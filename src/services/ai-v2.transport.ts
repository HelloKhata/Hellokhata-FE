import type {
  ActionCommand,
  PublicChatResponse,
  PublicUserRequest,
  SchemaCompiler,
} from "../types/ai-integration/generic-tool.contract";
import {
  createGenericContractValidator,
  genericToolSchemas,
} from "../types/ai-integration/generic-tool.schema";

export type V2Result =
  | { status: 200; data: PublicChatResponse }
  | { status: 204 }
  | {
      status: 202;
      operation: {
        kind: "PROCESSING";
        requestId: string;
        conversationId: string;
        actionId?: string;
      };
      retryAfterMs: number;
    };
export class V2TransportError extends Error {
  constructor(
    readonly code: string,
    readonly status: number,
    readonly retryable: boolean,
  ) {
    super(code);
  }
}
const uuid =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export interface V2TransportOptions {
  baseUrl: string;
  /** ERP JWT and selected branch only. Never supply the AI service API key. */
  headers: () => Record<string, string>;
  compile: SchemaCompiler;
  fetch?: typeof fetch;
}
export function createV2Transport(options: V2TransportOptions) {
  const boundary = createGenericContractValidator(options.compile);
  const fetcher = options.fetch ?? globalThis.fetch;
  const commandValid = options.compile(genericToolSchemas.actionCommand);
  const id = (value: string) => {
    if (!uuid.test(value))
      throw new V2TransportError("INVALID_IDENTIFIER", 0, false);
    return value;
  };
  async function call(
    path: string,
    method: "GET" | "POST",
    body?: unknown,
    signal?: AbortSignal,
    allowEmpty = false,
  ): Promise<V2Result> {
    let response: Response;
    try {
      response = await fetcher(
        options.baseUrl.replace(/\/$/, "") + "/ai/v2/" + path,
        {
          method,
          headers: { ...options.headers(), "Content-Type": "application/json" },
          credentials: "include",
          redirect: "error",
          ...(body === undefined ? {} : { body: JSON.stringify(body) }),
          signal,
        },
      );
    } catch {
      throw new V2TransportError(
        signal?.aborted ? "REQUEST_CANCELLED" : "NETWORK_ERROR",
        0,
        true,
      );
    }
    if (response.status === 204) {
      if (!allowEmpty)
        throw new V2TransportError("UNEXPECTED_EMPTY_RESPONSE", 204, false);
      return { status: 204 };
    }
    let payload: unknown;
    try {
      // Enforce a bounded response while streaming; do not parse unlimited text.
      const reader = response.body?.getReader();
      if (!reader) throw new Error();
      const decoder = new TextDecoder();
      let text = "";
      let bytes = 0;
      try {
        while (true) {
          const chunk = await reader.read();
          if (chunk.done) break;
          bytes += chunk.value.byteLength;
          if (bytes > 131072) throw new Error();
          text += decoder.decode(chunk.value, { stream: true });
        }
        text += decoder.decode();
        payload = JSON.parse(text);
      } finally {
        await reader.cancel().catch(() => undefined);
      }
    } catch {
      throw new V2TransportError(
        "INVALID_ERP_RESPONSE",
        response.status,
        false,
      );
    }
    if (!payload || typeof payload !== "object")
      throw new V2TransportError(
        "INVALID_ERP_RESPONSE",
        response.status,
        false,
      );
    const envelope = payload as {
      success?: unknown;
      data?: unknown;
      error?: { code?: unknown; retryable?: unknown };
    };
    if (!response.ok || envelope.success !== true) {
      const raw = envelope.error?.code;
      const code =
        typeof raw === "string" && /^[A-Z0-9_]{1,128}$/.test(raw)
          ? raw
          : "ERP_REQUEST_FAILED";
      throw new V2TransportError(
        code,
        response.status,
        envelope.error?.retryable === true,
      );
    }
    if (response.status === 202) {
      const operation = envelope.data as
        | {
            kind?: unknown;
            requestId?: unknown;
            conversationId?: unknown;
            actionId?: unknown;
          }
        | undefined;
      if (
        !operation ||
        operation.kind !== "PROCESSING" ||
        typeof operation.requestId !== "string" ||
        typeof operation.conversationId !== "string" ||
        !uuid.test(operation.requestId) ||
        !uuid.test(operation.conversationId) ||
        (operation.actionId !== undefined &&
          (typeof operation.actionId !== "string" ||
            !uuid.test(operation.actionId)))
      )
        throw new V2TransportError("INVALID_RECOVERY_RESPONSE", 202, false);
      const seconds = Number(response.headers.get("Retry-After") ?? "2");
      return {
        status: 202,
        operation: operation as {
          kind: "PROCESSING";
          requestId: string;
          conversationId: string;
          actionId?: string;
        },
        retryAfterMs:
          (Number.isFinite(seconds) ? Math.min(30, Math.max(1, seconds)) : 2) *
          1000,
      };
    }
    if (response.status !== 200)
      throw new V2TransportError(
        "UNEXPECTED_ERP_STATUS",
        response.status,
        false,
      );
    try {
      return { status: 200, data: boundary.publicResponse(envelope.data) };
    } catch {
      throw new V2TransportError(
        "INVALID_ERP_RESPONSE",
        response.status,
        false,
      );
    }
  }
  return {
    submit: (request: PublicUserRequest, signal?: AbortSignal) => {
      boundary.publicRequest(request);
      return call("requests", "POST", request, signal);
    },
    recoverRequest: (requestId: string, signal?: AbortSignal) =>
      call("requests/" + id(requestId), "GET", undefined, signal),
    recoverAction: (actionId: string, signal?: AbortSignal) =>
      call("actions/" + id(actionId), "GET", undefined, signal),
    command: (command: ActionCommand, signal?: AbortSignal) => {
      if (!commandValid(command))
        throw new V2TransportError("INVALID_ACTION_COMMAND", 0, false);
      return call(
        "actions/" + id(command.actionId) + "/commands",
        "POST",
        command,
        signal,
        command.command === "REJECT",
      );
    },
  };
}
export type V2Transport = ReturnType<typeof createV2Transport>;
