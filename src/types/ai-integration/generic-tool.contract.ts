/** Portable v2 contract. Keep byte-identical in the ERP and FE repositories.
 * No Nest, provider, ERP operation enums, endpoint bindings or authorization.
 */
export const GENERIC_TOOL_CONTRACT_VERSION = '2.0.0' as const;
/** Reserved migration targets, not routes implemented by Phase 1. */
export const GENERIC_INTEGRATION_PATHS = {
  orchestrationStep: '/api/internal/v2/orchestration/steps',
  publicRequests: '/api/ai/v2/requests',
  publicRequestStatus: '/api/ai/v2/requests/:requestId',
  publicSpeechToText: '/api/ai/v2/speech-to-text',
  publicActionCommands: '/api/ai/v2/actions/:actionId/commands',
  publicActionStatus: '/api/ai/v2/actions/:actionId',
} as const;
export type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | JsonObject;
export interface JsonObject {
  [key: string]: JsonValue;
}
export type ToolSchema = JsonObject;
export interface ExchangeContext {
  requestId: string;
  traceId: string;
  conversationId: string;
  turnId: string;
  clientId: string;
  tenantId: string;
  actorId: string;
  /** ERP-owned canonical scope fingerprint, not a client permission claim. */
  scopeId: string;
}
export interface ToolDeclaration {
  name: string;
  version: string;
  description: string;
  inputSchema: ToolSchema;
  outputSchema: ToolSchema;
  availability: 'AVAILABLE' | 'UNAVAILABLE';
  effect: 'READ' | 'MUTATION';
  confirmation: 'NONE' | 'REQUIRED';
}
export interface ToolCall {
  toolCallId: string;
  name: string;
  version: string;
  arguments: JsonObject;
}
export interface ContractError {
  code: string;
  message: string;
  retryable: boolean;
}
export type ToolResult = {
  toolCallId: string;
  name: string;
  version: string;
} & (
  | { status: 'SUCCEEDED'; data: JsonObject }
  | { status: 'FAILED'; error: ContractError }
);
export interface TextInput {
  text: string;
  language: string;
  timeZone: string;
  referenceTimeMs: number;
}
export interface GenericEnvelope {
  contractVersion: typeof GENERIC_TOOL_CONTRACT_VERSION;
  context: ExchangeContext;
  catalogVersion: string;
  step: number;
}
export interface OrchestrationRequest extends GenericEnvelope {
  tools: ToolDeclaration[];
  budget: {
    maxSteps: number;
    maxCallsPerStep: number;
    maxResultBytes: number;
    deadlineMs: number;
  };
  input:
    | ({ kind: 'MESSAGE' } & TextInput)
    | { kind: 'TOOL_RESULTS'; responseId: string; results: ToolResult[] }
    | { kind: 'CLARIFICATION_ANSWER'; clarificationId: string; text: string };
}
export type OrchestrationResponse = GenericEnvelope & { responseId: string } & (
    | { kind: 'TOOL_CALLS'; calls: ToolCall[] }
    | { kind: 'PROPOSAL'; call: ToolCall; summary: string }
    | {
        kind: 'CLARIFICATION';
        clarificationId: string;
        question: string;
        candidates: { id: string; label: string }[];
      }
    | { kind: 'ANSWER'; text: string; evidenceToolCallIds: string[] }
    | { kind: 'ERROR'; error: ContractError }
  );
export interface PublicUserRequest {
  contractVersion: typeof GENERIC_TOOL_CONTRACT_VERSION;
  clientRequestId: string;
  conversationId?: string;
  clarificationId?: string;
  transcriptId?: string;
  input: { modality: 'text'; text: string; language: string };
}
export interface PendingAction {
  /** ERP-authored business details, never model-generated or execution input. */
  presentation?: JsonObject;
  actionId: string;
  version: number;
  call: ToolCall;
  summary: string;
  expiresAtMs: number;
  status: 'PENDING';
}
export interface ExecutionReceipt {
  actionId: string;
  actionVersion: number;
  operationId: string;
  completedAtMs: number;
  status: 'EXECUTED';
  result: JsonObject;
}
/** ERP-authoritative closed action. Errors or model output cannot establish it. */
export interface TerminalActionOutcome {
  actionId: string;
  actionVersion: number;
  status: 'REJECTED' | 'EXPIRED' | 'FAILED';
  executionOutcome: 'NOT_EXECUTED';
  error: ContractError;
}
export type ActionCommand = {
  contractVersion: typeof GENERIC_TOOL_CONTRACT_VERSION;
  actionId: string;
  expectedVersion: number;
  idempotencyKey: string;
} & (
  | { command: 'CONFIRM' | 'REJECT' }
  | { command: 'EDIT'; arguments: JsonObject }
);
export type PublicChatResponse = {
  contractVersion: typeof GENERIC_TOOL_CONTRACT_VERSION;
  requestId: string;
  conversationId: string;
} & (
  | {
      kind: 'ANSWER';
      text: string;
      evidenceToolCallIds: string[];
      reports?: ReportPresentation[];
    }
  | {
      kind: 'CLARIFICATION';
      clarificationId: string;
      question: string;
      candidates: { id: string; label: string }[];
    }
  | { kind: 'PENDING_ACTION'; action: PendingAction }
  | { kind: 'RECEIPT'; receipt: ExecutionReceipt }
  | { kind: 'ACTION_TERMINAL'; outcome: TerminalActionOutcome }
  | { kind: 'ERROR'; error: ContractError }
);
export interface TranscriptResponse {
  contractVersion: typeof GENERIC_TOOL_CONTRACT_VERSION;
  transcriptId: string;
  transcript: string;
  language: string;
}
/** ERP-authored presentation of verified READ results, never model-generated.
 * Row identifiers are data, not authority or executable frontend URLs. */
export interface ReportPresentation {
  /** ERP-authored query for explicit pagination; never an execution command. */
  query?: { name: string; arguments: JsonObject };
  toolCallId: string;
  title: string;
  description: string;
  timeZone: string;
  startDate: string | null;
  endDate: string | null;
  generatedAtMs: number;
  columns: {
    key: string;
    label: string;
    format: 'text' | 'number' | 'money' | 'date';
  }[];
  rows: JsonObject[];
  totals: JsonObject;
  page: number;
  pageSize: number;
  totalRecords: number;
  hasMore: boolean;
}
// Compiler must enforce draft-07 without coercion/defaults/property removal or
// remote schema loading. Schema validation is necessary, never authorization.
export type SchemaCompiler = (
  schema: ToolSchema,
) => (value: unknown) => boolean;
export class GenericContractViolation extends Error {
  constructor(public readonly code: string) {
    super(code);
    this.name = 'GenericContractViolation';
  }
}
function requireContract(condition: boolean, code: string): asserts condition {
  if (!condition) throw new GenericContractViolation(code);
}
function sameContext(
  left: ExchangeContext,
  right: ExchangeContext,
  allowNewRequest: boolean,
): boolean {
  return (Object.keys(left) as (keyof ExchangeContext)[]).every(
    (key) =>
      (allowNewRequest && key === 'requestId') || left[key] === right[key],
  );
}
function canonicalJson(value: unknown): string {
  if (Array.isArray(value))
    return '[' + value.map(canonicalJson).join(',') + ']';
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return (
      '{' +
      Object.keys(record)
        .sort()
        .map((key) => JSON.stringify(key) + ':' + canonicalJson(record[key]))
        .join(',') +
      '}'
    );
  }
  const serialized = JSON.stringify(value);
  requireContract(serialized !== undefined, 'INVALID_JSON');
  return serialized;
}
function safeSchema(value: JsonValue, depth = 0): boolean {
  if (depth > 32) return false;
  if (Array.isArray(value)) return value.every((v) => safeSchema(v, depth + 1));
  if (value && typeof value === 'object') {
    return Object.entries(value).every(
      ([key, v]) =>
        !['$id', '$schema', '$async', '$dynamicRef', '$recursiveRef'].includes(
          key,
        ) &&
        (key !== '$ref' ||
          (typeof v === 'string' && v.startsWith('#/definitions/'))) &&
        safeSchema(v, depth + 1),
    );
  }
  return true;
}
export function assertCatalog(
  request: OrchestrationRequest,
  compile: SchemaCompiler,
  nowMs: number,
): void {
  requireContract(request.budget.deadlineMs > nowMs, 'DEADLINE_EXCEEDED');
  requireContract(
    request.step < request.budget.maxSteps,
    'STEP_BUDGET_EXCEEDED',
  );
  const names = new Set<string>();
  for (const tool of request.tools) {
    requireContract(!names.has(tool.name), 'DUPLICATE_TOOL_NAME');
    names.add(tool.name);
    requireContract(
      tool.confirmation === (tool.effect === 'MUTATION' ? 'REQUIRED' : 'NONE'),
      'UNSAFE_CONFIRMATION_POLICY',
    );
    for (const schema of [tool.inputSchema, tool.outputSchema]) {
      requireContract(
        schema.type === 'object' &&
          schema.additionalProperties === false &&
          safeSchema(schema),
        'UNSAFE_TOOL_SCHEMA',
      );
      requireContract(
        new TextEncoder().encode(JSON.stringify(schema)).length <= 8192,
        'TOOL_SCHEMA_TOO_LARGE',
      );
      try {
        compile(schema);
      } catch {
        throw new GenericContractViolation('INVALID_TOOL_SCHEMA');
      }
    }
  }
}
function assertCall(
  request: OrchestrationRequest,
  call: ToolCall,
  effect: ToolDeclaration['effect'],
  compile: SchemaCompiler,
): ToolDeclaration {
  const tool = request.tools.find(
    (t) => t.name === call.name && t.version === call.version,
  );
  requireContract(Boolean(tool), 'UNKNOWN_TOOL');
  const declaration = tool as ToolDeclaration;
  requireContract(declaration.availability === 'AVAILABLE', 'TOOL_UNAVAILABLE');
  requireContract(declaration.effect === effect, 'INVALID_TOOL_EFFECT');
  requireContract(
    compile(declaration.inputSchema)(call.arguments),
    'INVALID_TOOL_ARGUMENTS',
  );
  return declaration;
}
/** Call after validating request and response envelope shapes. No execution. */
export function assertExchange(
  request: OrchestrationRequest,
  response: OrchestrationResponse,
  compile: SchemaCompiler,
  nowMs: number,
  evidenceIds: readonly string[] = [],
): void {
  assertCatalog(request, compile, nowMs);
  requireContract(
    sameContext(request.context, response.context, false) &&
      request.catalogVersion === response.catalogVersion &&
      request.step === response.step,
    'EXCHANGE_MISMATCH',
  );
  if (response.kind === 'TOOL_CALLS') {
    requireContract(
      response.calls.length <= request.budget.maxCallsPerStep,
      'CALL_BUDGET_EXCEEDED',
    );
    requireContract(
      new Set(response.calls.map((c) => c.toolCallId)).size ===
        response.calls.length,
      'DUPLICATE_TOOL_CALL_ID',
    );
    for (const call of response.calls)
      assertCall(request, call, 'READ', compile);
  } else if (response.kind === 'PROPOSAL') {
    assertCall(request, response.call, 'MUTATION', compile);
  } else if (response.kind === 'ANSWER') {
    requireContract(
      response.evidenceToolCallIds.every((id) => evidenceIds.includes(id)),
      'UNKNOWN_EVIDENCE',
    );
  }
}
/** ERP must supply the stored request/response, not values sent by the client. */
export function assertContinuation(
  previous: OrchestrationRequest,
  pending: OrchestrationResponse,
  next: OrchestrationRequest,
  compile: SchemaCompiler,
  nowMs: number,
): void {
  assertExchange(previous, pending, compile, nowMs);
  assertCatalog(next, compile, nowMs);
  requireContract(
    sameContext(previous.context, next.context, true) &&
      next.context.requestId !== previous.context.requestId &&
      next.step === previous.step + 1 &&
      next.catalogVersion === previous.catalogVersion &&
      canonicalJson(next.tools) === canonicalJson(previous.tools) &&
      canonicalJson(next.budget) === canonicalJson(previous.budget),
    'CONTINUATION_MISMATCH',
  );
  if (pending.kind === 'CLARIFICATION') {
    requireContract(
      next.input.kind === 'CLARIFICATION_ANSWER' &&
        next.input.clarificationId === pending.clarificationId,
      'CLARIFICATION_MISMATCH',
    );
    return;
  }
  requireContract(
    pending.kind === 'TOOL_CALLS' && next.input.kind === 'TOOL_RESULTS',
    'UNEXPECTED_CONTINUATION',
  );
  if (pending.kind !== 'TOOL_CALLS' || next.input.kind !== 'TOOL_RESULTS')
    return;
  requireContract(
    next.input.responseId === pending.responseId &&
      next.input.results.length === pending.calls.length &&
      new Set(next.input.results.map((r) => r.toolCallId)).size ===
        next.input.results.length,
    'RESULT_CORRELATION_MISMATCH',
  );
  // JS UTF-8 encoding, works in browser and Node without Buffer.
  const bytes = new TextEncoder().encode(
    JSON.stringify(next.input.results),
  ).length;
  requireContract(
    bytes <= next.budget.maxResultBytes,
    'RESULT_BUDGET_EXCEEDED',
  );
  for (const result of next.input.results) {
    const call = pending.calls.find(
      (c) =>
        c.toolCallId === result.toolCallId &&
        c.name === result.name &&
        c.version === result.version,
    );
    requireContract(Boolean(call), 'RESULT_CORRELATION_MISMATCH');
    const tool = requestTool(previous, result);
    if (result.status === 'SUCCEEDED')
      requireContract(
        compile(tool.outputSchema)(result.data),
        'INVALID_TOOL_RESULT',
      );
  }
}
function requestTool(
  request: OrchestrationRequest,
  result: ToolResult,
): ToolDeclaration {
  const tool = request.tools.find(
    (t) => t.name === result.name && t.version === result.version,
  );
  requireContract(Boolean(tool), 'UNKNOWN_TOOL');
  return tool as ToolDeclaration;
}
/** This guard only checks version/expiry. ERP must still authenticate, authorize,
 * bind the action to actor/scope, revalidate arguments and transact idempotently. */
export function assertActionCommand(
  action: PendingAction,
  command: ActionCommand,
  nowMs: number,
): void {
  requireContract(
    action.actionId === command.actionId &&
      action.version === command.expectedVersion,
    'ACTION_VERSION_CONFLICT',
  );
  requireContract(
    action.status === 'PENDING' && action.expiresAtMs > nowMs,
    'ACTION_EXPIRED',
  );
}
