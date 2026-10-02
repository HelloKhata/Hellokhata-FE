import {
  assertActionCommand,
  assertCatalog,
  assertContinuation,
  assertExchange,
  GenericContractViolation,
  type ActionCommand,
  type OrchestrationRequest,
  type OrchestrationResponse,
  type PendingAction,
  type PublicChatResponse,
  type PublicUserRequest,
  type SchemaCompiler,
  type ToolSchema,
  type TranscriptResponse,
} from './generic-tool.contract';

// Draft-07 wire schemas. Dependency-free: server adapters choose a compiler.
const str = (maxLength = 128): ToolSchema => ({
  type: 'string',
  minLength: 1,
  maxLength,
  pattern: '\\S',
});
const uuid: ToolSchema = {
  ...str(36),
  pattern:
    '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$',
};
const integer = (minimum: number, maximum: number): ToolSchema => ({
  type: 'integer',
  minimum,
  maximum,
});
const timestamp = integer(0, Number.MAX_SAFE_INTEGER);
const literal = (value: string): ToolSchema => ({ const: value });
const obj = (
  properties: Record<string, ToolSchema>,
  required = Object.keys(properties),
): ToolSchema => ({
  type: 'object',
  properties,
  required,
  additionalProperties: false,
});
const list = (
  items: ToolSchema,
  maxItems: number,
  minItems = 0,
): ToolSchema => ({ type: 'array', items, minItems, maxItems });
const json: ToolSchema = { $ref: '#/definitions/json' };
const jsonObject: ToolSchema = {
  type: 'object',
  maxProperties: 100,
  additionalProperties: json,
};
const error = obj({
  code: str(64),
  message: str(1000),
  retryable: { type: 'boolean' },
});
const toolName = { ...str(), pattern: '^[a-zA-Z][a-zA-Z0-9_.-]*$' };
const call = obj({
  toolCallId: uuid,
  name: toolName,
  version: str(32),
  arguments: jsonObject,
});
const context = obj({
  requestId: uuid,
  traceId: uuid,
  conversationId: uuid,
  turnId: uuid,
  clientId: str(),
  tenantId: str(),
  actorId: str(),
  scopeId: str(),
});
const candidate = obj({ id: str(), label: str(240) });
const answer = {
  kind: literal('ANSWER'),
  text: str(10000),
  evidenceToolCallIds: { ...list(uuid, 128), uniqueItems: true },
};
const clarification = {
  kind: literal('CLARIFICATION'),
  clarificationId: uuid,
  question: str(1000),
  candidates: list(candidate, 20),
};
const version = literal('2.0.0');
const envelope = {
  contractVersion: version,
  context,
  catalogVersion: str(),
  step: integer(0, 15),
};
const pendingAction = obj({
  actionId: uuid,
  version: integer(1, Number.MAX_SAFE_INTEGER),
  call,
  summary: str(1000),
  expiresAtMs: timestamp,
  status: literal('PENDING'),
});
const receipt = obj({
  actionId: uuid,
  actionVersion: integer(1, Number.MAX_SAFE_INTEGER),
  operationId: uuid,
  completedAtMs: timestamp,
  status: literal('EXECUTED'),
  result: jsonObject,
});
const root = (schema: ToolSchema): ToolSchema => ({
  $schema: 'http://json-schema.org/draft-07/schema#',
  ...schema,
  definitions: {
    json: {
      anyOf: [
        { type: 'null' },
        { type: 'boolean' },
        { type: 'number' },
        { type: 'string', maxLength: 20000 },
        { type: 'array', maxItems: 1000, items: json },
        jsonObject,
      ],
    },
  },
});
const input = {
  oneOf: [
    obj({
      kind: literal('MESSAGE'),
      text: str(4000),
      language: str(35),
      timeZone: str(64),
      referenceTimeMs: timestamp,
    }),
    obj({
      kind: literal('CLARIFICATION_ANSWER'),
      clarificationId: uuid,
      text: str(4000),
    }),
    obj({
      kind: literal('TOOL_RESULTS'),
      responseId: uuid,
      results: list(
        {
          oneOf: [
            obj({
              toolCallId: uuid,
              name: str(),
              version: str(32),
              status: literal('SUCCEEDED'),
              data: jsonObject,
            }),
            obj({
              toolCallId: uuid,
              name: str(),
              version: str(32),
              status: literal('FAILED'),
              error,
            }),
          ],
        },
        8,
        1,
      ),
    }),
  ],
};
const tool = obj({
  name: toolName,
  version: str(32),
  description: str(2000),
  inputSchema: { type: 'object', maxProperties: 100 },
  outputSchema: { type: 'object', maxProperties: 100 },
  availability: { enum: ['AVAILABLE', 'UNAVAILABLE'] },
  effect: { enum: ['READ', 'MUTATION'] },
  confirmation: { enum: ['NONE', 'REQUIRED'] },
});
export const genericToolSchemas = {
  request: root(
    obj({
      ...envelope,
      tools: list(tool, 128),
      budget: obj({
        maxSteps: integer(1, 16),
        maxCallsPerStep: integer(1, 8),
        maxResultBytes: integer(1, 65536),
        deadlineMs: timestamp,
      }),
      input,
    }),
  ),
  response: root({
    oneOf: [
      obj({
        ...envelope,
        responseId: uuid,
        kind: literal('TOOL_CALLS'),
        calls: list(call, 8, 1),
      }),
      obj({
        ...envelope,
        responseId: uuid,
        kind: literal('PROPOSAL'),
        call,
        summary: str(1000),
      }),
      obj({ ...envelope, responseId: uuid, ...clarification }),
      obj({ ...envelope, responseId: uuid, ...answer }),
      obj({ ...envelope, responseId: uuid, kind: literal('ERROR'), error }),
    ],
  }),
  publicRequest: root(
    obj(
      {
        contractVersion: version,
        clientRequestId: uuid,
        conversationId: uuid,
        clarificationId: uuid,
        transcriptId: uuid,
        input: obj({
          modality: literal('text'),
          text: str(4000),
          language: str(35),
        }),
      },
      ['contractVersion', 'clientRequestId', 'input'],
    ),
  ),
  publicResponse: root({
    oneOf: [
      obj({
        contractVersion: version,
        requestId: uuid,
        conversationId: uuid,
        ...answer,
      }),
      obj({
        contractVersion: version,
        requestId: uuid,
        conversationId: uuid,
        ...clarification,
      }),
      obj({
        contractVersion: version,
        requestId: uuid,
        conversationId: uuid,
        kind: literal('PENDING_ACTION'),
        action: pendingAction,
      }),
      obj({
        contractVersion: version,
        requestId: uuid,
        conversationId: uuid,
        kind: literal('RECEIPT'),
        receipt,
      }),
      obj({
        contractVersion: version,
        requestId: uuid,
        conversationId: uuid,
        kind: literal('ACTION_TERMINAL'),
        outcome: obj({
          actionId: uuid,
          actionVersion: integer(1, Number.MAX_SAFE_INTEGER),
          status: { enum: ['REJECTED', 'EXPIRED', 'FAILED'] },
          executionOutcome: literal('NOT_EXECUTED'),
          error,
        }),
      }),
      obj({
        contractVersion: version,
        requestId: uuid,
        conversationId: uuid,
        kind: literal('ERROR'),
        error,
      }),
    ],
  }),
  actionCommand: root({
    oneOf: [
      obj({
        contractVersion: version,
        actionId: uuid,
        expectedVersion: integer(1, Number.MAX_SAFE_INTEGER),
        idempotencyKey: uuid,
        command: { enum: ['CONFIRM', 'REJECT'] },
      }),
      obj({
        contractVersion: version,
        actionId: uuid,
        expectedVersion: integer(1, Number.MAX_SAFE_INTEGER),
        idempotencyKey: uuid,
        command: literal('EDIT'),
        arguments: jsonObject,
      }),
    ],
  }),
  transcript: root(
    obj({
      contractVersion: version,
      transcriptId: uuid,
      transcript: str(4000),
      language: str(35),
    }),
  ),
} satisfies Record<string, ToolSchema>;

/** Boundary parsers. Inject a strict draft-07 compiler at the server adapter;
 * no framework or validator package is bundled in this portable contract. */
export function createGenericContractValidator(compile: SchemaCompiler) {
  const validators = Object.fromEntries(
    Object.entries(genericToolSchemas).map(([key, schema]) => [
      key,
      compile(schema),
    ]),
  ) as Record<keyof typeof genericToolSchemas, (value: unknown) => boolean>;
  const parse = <T>(
    key: keyof typeof genericToolSchemas,
    value: unknown,
  ): T => {
    if (!validators[key](value))
      throw new GenericContractViolation('INVALID_' + key.toUpperCase());
    return value as T;
  };
  const request = (value: unknown, nowMs: number): OrchestrationRequest => {
    const parsed = parse<OrchestrationRequest>('request', value);
    assertCatalog(parsed, compile, nowMs);
    if (parsed.input.kind === 'MESSAGE') {
      if (parsed.step !== 0)
        throw new GenericContractViolation('MESSAGE_STEP_MISMATCH');
      try {
        new Intl.DateTimeFormat('en', { timeZone: parsed.input.timeZone });
      } catch {
        throw new GenericContractViolation('INVALID_TIME_ZONE');
      }
    } else if (parsed.step === 0)
      throw new GenericContractViolation('CONTINUATION_STEP_MISMATCH');
    return parsed;
  };
  return {
    request,
    response: (
      input: unknown,
      value: unknown,
      nowMs: number,
      evidenceIds: readonly string[] = [],
    ) => {
      const req = request(input, nowMs);
      const res = parse<OrchestrationResponse>('response', value);
      assertExchange(req, res, compile, nowMs, evidenceIds);
      return res;
    },
    continuation: (
      previous: unknown,
      pending: unknown,
      next: unknown,
      nowMs: number,
    ) => {
      const req = request(previous, nowMs);
      const res = parse<OrchestrationResponse>('response', pending);
      const following = request(next, nowMs);
      assertContinuation(req, res, following, compile, nowMs);
      return following;
    },
    publicRequest: (value: unknown) => {
      const parsed = parse<PublicUserRequest>('publicRequest', value);
      if (parsed.clarificationId && !parsed.conversationId)
        throw new GenericContractViolation(
          'CLARIFICATION_CONVERSATION_REQUIRED',
        );
      return parsed;
    },
    publicResponse: (value: unknown) =>
      parse<PublicChatResponse>('publicResponse', value),
    transcript: (value: unknown) =>
      parse<TranscriptResponse>('transcript', value),
    actionCommand: (action: PendingAction, value: unknown, nowMs: number) => {
      const parsed = parse<ActionCommand>('actionCommand', value);
      assertActionCommand(action, parsed, nowMs);
      return parsed;
    },
  };
}
