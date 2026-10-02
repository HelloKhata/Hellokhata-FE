import {
  transitionGenericChat,
  type GenericChatEvent,
  type GenericChatState,
} from "../types/ai-integration/generic-chat.state";
import type {
  JsonObject,
  PublicUserRequest,
} from "../types/ai-integration/generic-tool.contract";
import {
  V2TransportError,
  type V2Result,
  type V2Transport,
} from "./ai-v2.transport";

/** Headless foundation, not a replacement for AIDrawer/VoiceModal yet.
 * Every callback captures a local generation; confirmations are never retried
 * automatically. The UI must invoke recovery or explicit command actions. */
export function createV2StateClient(
  transport: V2Transport,
  changed: (state: GenericChatState) => void,
  uuid: () => string = () => crypto.randomUUID(),
) {
  let state: GenericChatState = { kind: "IDLE" };
  let controller: AbortController | undefined;
  let attempt = 0;
  let recovery:
    { requestKey: string; requestId?: string; actionId?: string } | undefined;
  const dispatch = (event: GenericChatEvent) => {
    state = transitionGenericChat(state, event);
    changed(state);
  };
  const active = (key: string) =>
    "requestKey" in state && state.requestKey === key;
  function deliver(result: V2Result, key: string) {
    if (!active(key)) return;
    if (result.status === 202) {
      recovery = {
        requestKey: key,
        requestId: result.operation.requestId,
        ...("action" in state ? { actionId: state.action.actionId } : {}),
      };
      if (state.kind === "CONFIRMING")
        dispatch({ kind: "FAIL", requestKey: key, code: "PROCESSING" });
      return;
    }
    if (result.status !== 200)
      throw new V2TransportError(
        "UNEXPECTED_EMPTY_RESPONSE",
        result.status,
        false,
      );
    dispatch({ kind: "RESPONSE", requestKey: key, response: result.data });
  }
  async function perform(
    key: string,
    work: (signal: AbortSignal) => Promise<V2Result>,
    acceptEditedPending = false,
  ) {
    const generation = ++attempt;
    controller?.abort();
    controller = new AbortController();
    const signal = controller.signal;
    try {
      const result = await work(signal);
      if (generation === attempt && !signal.aborted) {
        // Editing returns a new pending version. Enter recovery before accepting
        // it; the shared state contract intentionally forbids pending responses
        // from resolving an uncertain CONFIRM directly.
        if (
          acceptEditedPending &&
          result.status === 200 &&
          result.data.kind === "PENDING_ACTION" &&
          state.kind === "CONFIRMING"
        )
          dispatch({ kind: "FAIL", requestKey: key, code: "ACTION_REFRESH" });
        deliver(result, key);
      }
    } catch (error) {
      if (generation === attempt && !signal.aborted && active(key))
        dispatch({
          kind: "FAIL",
          requestKey: key,
          code:
            error instanceof V2TransportError ? error.code : "INVALID_RESPONSE",
        });
    }
  }
  async function reviewCommand(
    command: "EDIT" | "REJECT",
    idempotencyKey: string,
    argumentsValue?: JsonObject,
  ) {
    if (state.kind !== "ACTION_REVIEW")
      throw new Error("ACTION_REVIEW_REQUIRED");
    const action = state.action;
    const key = uuid();
    // CONFIRMING is the shared in-flight action fence, not permission to execute.
    // Only the actual command sent below decides EDIT/REJECT/CONFIRM on the ERP.
    dispatch({
      kind: "CONFIRM",
      requestKey: key,
      actionId: action.actionId,
      expectedVersion: action.version,
      nowMs: Date.now(),
    });
    if (!active(key)) throw new Error("ACTION_TRANSITION_REJECTED");
    recovery = { requestKey: key, actionId: action.actionId };
    await perform(
      key,
      async (signal) => {
        const result = await transport.command(
          {
            contractVersion: "2.0.0",
            actionId: action.actionId,
            expectedVersion: action.version,
            idempotencyKey,
            ...(command === "EDIT"
              ? { command: "EDIT" as const, arguments: argumentsValue! }
              : { command: "REJECT" as const }),
          },
          signal,
        );
        // A 204 confirms rejection but has no state payload. GET is read-only;
        // never repeat the mutation when its outcome is uncertain.
        return result.status === 204
          ? transport.recoverAction(action.actionId, signal)
          : result;
      },
      command === "EDIT",
    );
  }
  return {
    getState: () => state,
    edit: (argumentsValue: JsonObject, idempotencyKey: string) =>
      reviewCommand("EDIT", idempotencyKey, argumentsValue),
    reject: (idempotencyKey: string) => reviewCommand("REJECT", idempotencyKey),
    /** Transcription alone never dispatches a text request. */
    dispatch,
    cancel: () => {
      attempt++;
      controller?.abort();
      if (state.kind === "CONFIRMING")
        dispatch({
          kind: "FAIL",
          requestKey: state.requestKey,
          code: "REQUEST_CANCELLED",
        });
      else if (state.kind !== "RECOVERING") dispatch({ kind: "CANCEL" });
    },
    async submit(input: PublicUserRequest) {
      const key = uuid();
      dispatch(
        input.clarificationId
          ? {
              kind: "SEND_CLARIFICATION",
              requestKey: key,
              clarificationId: input.clarificationId,
              text: input.input.text,
            }
          : {
              kind: "SEND_TEXT",
              requestKey: key,
              text: input.input.text,
              ...(input.conversationId
                ? { conversationId: input.conversationId }
                : {}),
            },
      );
      if (!active(key)) throw new Error("SEND_TRANSITION_REJECTED");
      recovery = undefined;
      await perform(key, (signal) => transport.submit(input, signal));
    },
    async confirm(idempotencyKey: string) {
      if (state.kind !== "ACTION_REVIEW")
        throw new Error("ACTION_REVIEW_REQUIRED");
      const action = state.action;
      const key = uuid();
      dispatch({
        kind: "CONFIRM",
        requestKey: key,
        actionId: action.actionId,
        expectedVersion: action.version,
        nowMs: Date.now(),
      });
      if (!active(key)) throw new Error("CONFIRM_TRANSITION_REJECTED");
      recovery = { requestKey: key, actionId: action.actionId };
      await perform(key, (signal) =>
        transport.command(
          {
            contractVersion: "2.0.0",
            actionId: action.actionId,
            expectedVersion: action.version,
            idempotencyKey,
            command: "CONFIRM",
          },
          signal,
        ),
      );
    },
    async recover() {
      if (!recovery || !active(recovery.requestKey))
        throw new Error("RECOVERY_NOT_AVAILABLE");
      const target = recovery;
      await perform(target.requestKey, (signal) =>
        target.actionId
          ? transport.recoverAction(target.actionId, signal)
          : transport.recoverRequest(target.requestId!, signal),
      );
    },
  };
}
