"use client";
import { useEffect, useRef, useState } from "react";
import type { GenericChatState } from "../../types/ai-integration/generic-chat.state";
import type { JsonObject } from "../../types/ai-integration/generic-tool.contract";
import { createErpV2Transport } from "../../services/ai-v2.services";
import { createV2StateClient } from "../../services/ai-v2.state-client";
import {
  compileBrowserContract,
  createRecordedAudio,
  transcribeRecordedAudio,
} from "../../services/ai-v2.browser";
import { useSessionStore } from "../../stores/sessionStore";
import { useBranchStore } from "../../stores/branchStore";
import { ActionReviewCard } from "./ActionReviewCard";
import { ChatComposer } from "./ChatComposer";
import {
  ChatMessage,
  ErrorNotice,
  WelcomeScreen,
  type ChatEntry,
} from "./ChatCards";
import { Button } from "../ui/button";
import {
  ArrowDown,
  ChevronDown,
  Loader2,
  MapPin,
  Plus,
  Sparkles,
} from "lucide-react";
import { getReviewSchema } from "../../services/ai-v2.schema";
import { loadRecovery, saveRecovery } from "../../services/ai-v2.recovery";
import type { RecoveryTarget } from "../../services/ai-v2.state-client";
import type {
  PublicChatResponse,
  ToolSchema,
} from "../../types/ai-integration/generic-tool.contract";

/** Canonical ERP assistant: voice is preview-only; all execution is ERP-authorized. */
export function V2InvoiceChat() {
  const [state, setState] = useState<GenericChatState>({ kind: "IDLE" });
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [audioState, setAudioState] = useState<
    "IDLE" | "STARTING" | "RECORDING" | "TRANSCRIBING"
  >("IDLE");
  const [clarification, setClarification] = useState("");
  const [candidates, setCandidates] = useState<{ id: string; label: string }[]>(
    [],
  );
  const [reviewSchema, setReviewSchema] = useState<ToolSchema>();
  const [recoveryTarget, setRecoveryTarget] = useState<RecoveryTarget>();
  const [messages, setMessages] = useState<ChatEntry[]>([]);
  const [showEdit, setShowEdit] = useState(false);
  const [busy, setBusy] = useState(false);
  const operationBusy = useRef(false);
  const [transcriptReady, setTranscriptReady] = useState(false);
  const recordingDraft = useRef("");
  const recordingStarted = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const nearBottom = useRef(true);
  const [showJump, setShowJump] = useState(false);
  const [draftJson, setDraftJson] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const session = useSessionStore((s) => s.user?.id + ":" + s.business?.id);
  const branch = useBranchStore((s) => s.currentBranchId);
  const assignedBranchId = useSessionStore((s) => s.user?.branchId);
  const branchName = useBranchStore((s) => s.currentBranch?.name);
  const branchLabel =
    branchName ??
    (branch && branch === assignedBranchId
      ? "Your assigned branch"
      : branch
        ? "Selected branch"
        : "All branches");
  const context = session + ":" + branch;
  const contextRef = useRef(context);
  contextRef.current = context;
  const requestContext = useRef<string | undefined>(undefined);
  const restoredContext = useRef<string | undefined>(undefined);
  const [submittedContext, setSubmittedContext] = useState<string | undefined>(
    undefined,
  );
  const recordingContext = useRef<string | undefined>(undefined);
  const clientRef = useRef<ReturnType<typeof createV2StateClient> | null>(null);
  const audioRef = useRef<ReturnType<typeof createRecordedAudio> | null>(null);
  const audioAbort = useRef<AbortController | null>(null);
  const mounted = useRef(true);
  const sequence = useRef(0);
  const [responseDetails, setResponseDetails] = useState("");
  // A conversation's durable identity is not a request generation or transcript.
  const conversation = useRef<string | undefined>(undefined);
  useEffect(() => {
    mounted.current = true;
    const transport = createErpV2Transport(compileBrowserContract);
    clientRef.current = createV2StateClient(
      transport,
      (next) => {
        if (
          mounted.current &&
          (!requestContext.current ||
            requestContext.current === contextRef.current)
        ) {
          setState(next);
          if (next.kind === "ACTION_REVIEW") {
            setDraftJson(JSON.stringify(next.action.call.arguments, null, 2));
            setShowEdit(false);
          }
        }
      },
      undefined,
      (response) => {
        if (!mounted.current || requestContext.current !== contextRef.current)
          return;
        conversation.current = response.conversationId;
        if (response.kind !== "ERROR") {
          const id =
            response.kind === "PENDING_ACTION"
              ? "action:" + response.action.actionId
              : response.kind === "RECEIPT"
                ? "receipt:" + response.receipt.operationId
                : response.kind === "CLARIFICATION"
                  ? "clarification:" + response.clarificationId
                  : "response:" + response.requestId;
          setMessages((previous) => {
            const existing = previous.find((entry) => entry.id === id);
            const entry: ChatEntry = {
              id,
              role: "assistant",
              response,
              ...(response.kind === "CLARIFICATION"
                ? { text: response.question }
                : {}),
              createdAt: existing?.createdAt ?? Date.now(),
            };
            return existing
              ? previous.map((item) => (item.id === id ? entry : item))
              : [...previous, entry];
          });
        }
        setResponseDetails(JSON.stringify(response, null, 2));
        if (response.kind === "CLARIFICATION") {
          setClarification(response.question);
          setCandidates(response.candidates);
        }
      },
      (target) => {
        setRecoveryTarget(target);
        saveRecovery(requestContext.current ?? contextRef.current, target);
      },
    );
    audioRef.current = createRecordedAudio(
      async (audio) => {
        const attempt = ++sequence.current,
          capturedContext = recordingContext.current;
        if (capturedContext !== contextRef.current) {
          setAudioState("IDLE");
          setError("RECORDING_CONTEXT_CHANGED");
          return;
        }
        audioAbort.current?.abort();
        audioAbort.current = new AbortController();
        const controller = audioAbort.current;
        const timeout = setTimeout(() => controller.abort(), 45000);
        setAudioState("TRANSCRIBING");
        try {
          const transcript = await transcribeRecordedAudio(
            audio,
            controller.signal,
          );
          if (
            mounted.current &&
            attempt === sequence.current &&
            capturedContext === contextRef.current
          ) {
            setText(
              [recordingDraft.current, transcript].filter(Boolean).join("\n"),
            );
            setTranscriptReady(true);
          }
        } catch (failure) {
          if (mounted.current && attempt === sequence.current)
            setError(
              failure instanceof Error
                ? failure.message
                : "TRANSCRIPTION_FAILED",
            );
        } finally {
          clearTimeout(timeout);
          if (mounted.current && attempt === sequence.current)
            setAudioState("IDLE");
        }
      },
      (code) => {
        if (mounted.current) {
          setError(code);
          setAudioState("IDLE");
        }
      },
    );
    const clock = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      mounted.current = false;
      restoredContext.current = undefined;
      sequence.current++;
      clearInterval(clock);
      audioAbort.current?.abort();
      audioRef.current?.dispose();
      clientRef.current?.cancel();
    };
  }, []);
  useEffect(() => {
    if (session.includes("undefined")) return;
    const previousContext = requestContext.current;
    const confirmationMayBeInFlight =
      state.kind === "PROCESSING" ||
      state.kind === "CONFIRMING" ||
      state.kind === "RECOVERING" ||
      (state.kind === "FAILED" && Boolean(recoveryTarget?.actionId));
    if (previousContext && previousContext !== context) {
      // Never move an uncertain request across a business/branch boundary.
      if (confirmationMayBeInFlight) return;
      clientRef.current?.cancel();
      requestContext.current = undefined;
      conversation.current = undefined;
      setSubmittedContext(undefined);
      setState({ kind: "IDLE" });
      setText("");
      setError("");
      setClarification("");
      setCandidates([]);
      setReviewSchema(undefined);
      setRecoveryTarget(undefined);
      setMessages([]);
      setDraftJson("");
      setResponseDetails("");
      setTranscriptReady(false);
      setShowEdit(false);
    }
    // Restore only on mount/context entry, not on every state transition.
    // Otherwise saving a new request aborts its POST and starts GET recovery
    // before the ERP has finished processing it.
    if (restoredContext.current === context) return;
    restoredContext.current = context;
    const saved = loadRecovery(context);
    if (!saved || !clientRef.current) return;
    requestContext.current = context;
    setSubmittedContext(context);
    void clientRef.current.restore(saved);
  }, [context, session, state.kind, recoveryTarget?.actionId]);
  const contextChanged =
    submittedContext !== undefined && submittedContext !== context;
  const idle =
    [
      "IDLE",
      "ANSWER",
      "COMPLETED",
      "FAILED",
      "ACTION_CLOSED",
      "CLARIFICATION",
    ].includes(state.kind) &&
    !(state.kind === "FAILED" && Boolean(recoveryTarget?.actionId));
  const run = async (work: () => Promise<unknown>) => {
    if (operationBusy.current) return;
    operationBusy.current = true;
    setBusy(true);
    setError("");
    try {
      await work();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "REQUEST_FAILED");
    } finally {
      operationBusy.current = false;
      if (mounted.current) setBusy(false);
    }
  };
  const submit = () =>
    run(async () => {
      if (
        !idle ||
        audioState !== "IDLE" ||
        !text.trim() ||
        text.length > 4000 ||
        contextChanged ||
        !clientRef.current
      )
        return;
      requestContext.current = context;
      setSubmittedContext(context);
      const input = text.trim();
      setCandidates([]);
      setMessages((previous) => [
        ...previous,
        {
          role: "user" as const,
          text: input,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
        },
      ]);
      await clientRef.current.submit({
        contractVersion: "2.0.0",
        clientRequestId: crypto.randomUUID(),
        ...(conversation.current
          ? { conversationId: conversation.current }
          : {}),
        ...(state.kind === "CLARIFICATION"
          ? {
              conversationId: state.conversationId,
              clarificationId: state.clarificationId,
            }
          : {}),
        input: { modality: "text", text: input, language: "bn-BD" },
      });
      if (clientRef.current.getState().kind !== "FAILED") {
        setText("");
        setTranscriptReady(false);
      }
    });
  const start = () =>
    run(async () => {
      if (!idle || audioState !== "IDLE" || contextChanged) return;
      setAudioState("STARTING");
      recordingContext.current = context;
      recordingDraft.current = text;
      try {
        await audioRef.current?.start();
        if (mounted.current) {
          recordingStarted.current = Date.now();
          setAudioState("RECORDING");
        }
      } catch (failure) {
        setAudioState("IDLE");
        throw failure;
      }
    });
  const review = "action" in state ? state.action : undefined;
  const expired = review ? review.expiresAtMs <= now : false;
  const editedDraft = Boolean(
    review &&
    JSON.stringify(JSON.parse(draftJson || "{}")) !==
      JSON.stringify(review.call.arguments),
  );
  useEffect(() => {
    setReviewSchema(undefined);
    if (!review || contextChanged) return;
    const abort = new AbortController(),
      timer = setTimeout(() => abort.abort(), 10000);
    void getReviewSchema(review.call.name, review.call.version, abort.signal)
      .then((value) => {
        if (!abort.signal.aborted) setReviewSchema(value);
      })
      .catch(() => {
        if (!abort.signal.aborted) setError("REVIEW_FORM_UNAVAILABLE");
      })
      .finally(() => clearTimeout(timer));
    return () => {
      clearTimeout(timer);
      abort.abort();
    };
  }, [review, contextChanged]);
  const scrollToLatest = () => {
    if (scrollRef.current)
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "auto",
      });
    nearBottom.current = true;
    setShowJump(false);
  };
  useEffect(() => {
    if (nearBottom.current && scrollRef.current)
      scrollRef.current.scrollTop =
        messages.length || state.kind !== "IDLE"
          ? scrollRef.current.scrollHeight
          : 0;
  }, [messages, state.kind, audioState, showEdit]);
  const canNewChat =
    !busy &&
    !contextChanged &&
    audioState === "IDLE" &&
    ((["IDLE", "ANSWER", "COMPLETED", "ACTION_CLOSED", "FAILED"].includes(
      state.kind,
    ) &&
      !recoveryTarget?.actionId) ||
      (state.kind === "ACTION_REVIEW" && expired));
  const newChat = () => {
    if (!canNewChat) return;
    clientRef.current?.cancel();
    saveRecovery(context, undefined);
    setRecoveryTarget(undefined);
    conversation.current = undefined;
    requestContext.current = undefined;
    setSubmittedContext(undefined);
    setMessages([]);
    setText("");
    setError("");
    setCandidates([]);
    setClarification("");
    setResponseDetails("");
    setTranscriptReady(false);
    setShowEdit(false);
    nearBottom.current = true;
    setShowJump(false);
  };
  const chooseDraft = (value: string) => {
    if (!idle || busy || audioState !== "IDLE" || contextChanged) return;
    setText(value);
    setTranscriptReady(false);
  };
  const chooseAssignedBranch = () => {
    if (!canNewChat || !assignedBranchId) return;
    newChat();
    const targetContext = session + ":" + assignedBranchId;
    const target = loadRecovery(targetContext);
    // An unconfirmed request can be abandoned for a fresh chat. Preserve any
    // action recovery target because its execution outcome may be uncertain.
    if (!target?.actionId) saveRecovery(targetContext, undefined);
    useBranchStore.getState().setCurrentBranch(assignedBranchId);
    useBranchStore.getState().setViewAllBranches(false);
  };
  const statusText =
    state.kind === "CONFIRMING"
      ? "Submitting your action…"
      : state.kind === "RECOVERING"
        ? "Checking the transaction status…"
        : "Working on your request…";
  const activeReview =
    review && !contextChanged ? (
      <ActionReviewCard
        action={review}
        schema={reviewSchema}
        draft={JSON.parse(draftJson || "{}") as JsonObject}
        editing={showEdit}
        changed={editedDraft}
        expired={expired}
        pending={state.kind === "ACTION_REVIEW"}
        busy={busy}
        canFresh={canNewChat}
        onFresh={newChat}
        onDraft={(value) => setDraftJson(JSON.stringify(value))}
        onEdit={() => {
          setShowEdit(!showEdit);
          if (showEdit) setDraftJson(JSON.stringify(review.call.arguments));
        }}
        onConfirm={() =>
          run(() => clientRef.current!.confirm(crypto.randomUUID()))
        }
        onReject={() =>
          run(() => clientRef.current!.reject(crypto.randomUUID()))
        }
        onSave={() =>
          run(async () => {
            const edited: unknown = JSON.parse(draftJson);
            if (
              !reviewSchema ||
              !compileBrowserContract(reviewSchema)(edited) ||
              !edited ||
              typeof edited !== "object" ||
              Array.isArray(edited)
            )
              throw new Error("INVALID_DRAFT_ARGUMENTS");
            await clientRef.current!.edit(
              edited as JsonObject,
              crypto.randomUUID(),
            );
          })
        }
      />
    ) : undefined;
  const renderExtra = (response?: PublicChatResponse) => {
    if (
      response?.kind === "PENDING_ACTION" &&
      response.action.actionId === review?.actionId
    )
      return activeReview;
    if (
      response?.kind === "CLARIFICATION" &&
      state.kind === "CLARIFICATION" &&
      response.clarificationId === state.clarificationId
    )
      return (
        <div className="mt-3 flex flex-wrap gap-2">
          {candidates.map((candidate) => (
            <Button
              key={candidate.id}
              variant="outline"
              className="h-auto max-w-full whitespace-normal py-2 text-left"
              disabled={contextChanged || busy || audioState !== "IDLE"}
              onClick={() =>
                chooseDraft(candidate.label + " [" + candidate.id + "]")
              }
            >
              {candidate.label}
            </Button>
          ))}
        </div>
      );
    return undefined;
  };
  const waiting = ["PROCESSING", "CONFIRMING", "RECOVERING"].includes(
    state.kind,
  );
  return (
    <section
      className="mx-auto flex h-[calc(100dvh-13rem)] min-h-[18rem] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:h-[calc(100dvh-9rem)] md:min-h-[28rem]"
      aria-label="ERP AI assistant"
    >
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-2.5 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h1 className="text-base font-semibold tracking-tight sm:text-lg">
              AI Assistant
            </h1>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{branchLabel}</span>
            </p>
            {assignedBranchId && (!branch || branch === "main") && (
              <Button
                variant="link"
                size="sm"
                className="h-6 px-0 text-xs"
                disabled={!canNewChat}
                onClick={chooseAssignedBranch}
              >
                Use assigned branch
              </Button>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={!canNewChat}
          onClick={newChat}
          title={
            canNewChat
              ? "Start a new conversation"
              : "Resolve the current action before starting a new conversation"
          }
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New chat</span>
          <span className="sm:hidden">New</span>
        </Button>
      </header>
      <div className="relative min-h-0 flex-1">
        <div
          ref={scrollRef}
          onScroll={() => {
            const element = scrollRef.current;
            if (!element) return;
            nearBottom.current =
              element.scrollHeight - element.scrollTop - element.clientHeight <
              100;
            setShowJump(!nearBottom.current);
          }}
          className="h-full overflow-y-auto overscroll-contain px-3 py-4 sm:px-6"
        >
          <div className="mx-auto max-w-4xl space-y-6">
            {contextChanged ? (
              <div
                role="alert"
                className="rounded-xl border border-[color:var(--warning)]/25 bg-[var(--warning-subtle)] p-4 text-sm"
              >
                Your business or branch changed during an active request. Return
                to the original business and branch to check its status.
              </div>
            ) : (
              <>
                {!messages.length && !waiting && !review && (
                  <WelcomeScreen
                    suggest={chooseDraft}
                    disabled={!idle || busy || audioState !== "IDLE"}
                  />
                )}
                <div
                  role="log"
                  aria-label="Conversation"
                  aria-live="polite"
                  aria-relevant="additions"
                  className="space-y-6"
                >
                  {messages.map((entry) => (
                    <ChatMessage
                      key={entry.id}
                      entry={entry}
                      reviewedAction={
                        entry.response?.kind === "RECEIPT"
                          ? messages.flatMap((message) =>
                              message.response?.kind === "PENDING_ACTION" &&
                              message.response.action.actionId ===
                                (entry.response?.kind === "RECEIPT"
                                  ? entry.response.receipt.actionId
                                  : undefined) &&
                              message.response.action.version ===
                                (entry.response?.kind === "RECEIPT"
                                  ? entry.response.receipt.actionVersion
                                  : undefined)
                                ? [message.response.action]
                                : [],
                            )[0]
                          : undefined
                      }
                      followUp={chooseDraft}
                      disabled={
                        !idle || busy || audioState !== "IDLE" || contextChanged
                      }
                    >
                      {renderExtra(entry.response)}
                    </ChatMessage>
                  ))}
                </div>
                {review &&
                  !messages.some(
                    (entry) =>
                      entry.response?.kind === "PENDING_ACTION" &&
                      entry.response.action.actionId === review.actionId,
                  ) &&
                  activeReview}
                {state.kind === "CLARIFICATION" &&
                  !messages.some(
                    (entry) =>
                      entry.response?.kind === "CLARIFICATION" &&
                      entry.response.clarificationId === state.clarificationId,
                  ) && <p className="text-sm">{clarification}</p>}
                {waiting && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="flex items-center gap-3 text-sm text-muted-foreground"
                  >
                    <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none text-primary" />
                    {statusText}
                  </div>
                )}
                {(error || state.kind === "FAILED") && (
                  <ErrorNotice
                    code={
                      error ||
                      (state.kind === "FAILED" ? state.code : "REQUEST_FAILED")
                    }
                  />
                )}
                {(state.kind === "RECOVERING" ||
                  state.kind === "PROCESSING" ||
                  (state.kind === "FAILED" && recoveryTarget)) && (
                  <Button
                    variant="outline"
                    disabled={contextChanged || busy}
                    onClick={() => run(() => clientRef.current!.recover())}
                  >
                    Check request status
                  </Button>
                )}
                {responseDetails && (
                  <details className="text-xs text-muted-foreground">
                    <summary className="flex cursor-pointer list-none items-center gap-1">
                      <ChevronDown className="h-3 w-3" />
                      Technical details
                    </summary>
                    <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-all rounded-xl bg-muted p-3">
                      {responseDetails}
                    </pre>
                  </details>
                )}
              </>
            )}
          </div>
        </div>
        {showJump && !contextChanged && (
          <Button
            variant="secondary"
            size="sm"
            className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full shadow-md"
            onClick={scrollToLatest}
          >
            <ArrowDown className="h-3 w-3" />
            Jump to latest
          </Button>
        )}
      </div>
      <ChatComposer
        text={text}
        onChange={(value) => {
          setText(value);
        }}
        onSend={submit}
        onRecord={start}
        onStop={() => audioRef.current?.stop()}
        disabled={!idle || busy || contextChanged}
        audioState={audioState}
        recordingSeconds={Math.max(
          0,
          Math.floor((now - recordingStarted.current) / 1000),
        )}
        transcript={transcriptReady}
      />
    </section>
  );
}
