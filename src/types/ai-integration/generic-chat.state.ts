import type {
  ExecutionReceipt,
  PendingAction,
  PublicChatResponse,
  TerminalActionOutcome,
  TranscriptResponse,
} from './generic-tool.contract';

/** Local callback generation, not a server request ID or authority.
 * Use a fresh key per operation and retain it in callbacks/recovery.
 * The first response can establish a server-assigned conversation ID. */
interface ActiveChatRequest {
  requestKey: string;
  conversationId?: string;
}
/** Pure state contract; not wired to the existing UI/network in Phase 1. */
export type GenericChatState =
  | { kind: 'IDLE' }
  | { kind: 'RECORDING' }
  | { kind: 'TRANSCRIBING' }
  | { kind: 'TRANSCRIPT_REVIEW'; transcript: TranscriptResponse }
  | ({ kind: 'PROCESSING' } & ActiveChatRequest)
  | { kind: 'CLARIFICATION'; clarificationId: string; conversationId: string }
  | { kind: 'ACTION_REVIEW'; action: PendingAction; conversationId: string }
  | {
      kind: 'CONFIRMING';
      action: PendingAction;
      requestKey: string;
      conversationId: string;
    }
  | {
      kind: 'RECOVERING';
      action: PendingAction;
      requestKey: string;
      conversationId: string;
      code: string;
    }
  | { kind: 'ACTION_CLOSED'; outcome: TerminalActionOutcome }
  | { kind: 'ANSWER'; text: string }
  | { kind: 'COMPLETED'; receipt: ExecutionReceipt }
  | { kind: 'FAILED'; code: string };
export type GenericChatEvent =
  | { kind: 'RECORD' }
  | { kind: 'AUDIO_READY' }
  | { kind: 'TRANSCRIBED'; transcript: TranscriptResponse }
  | { kind: 'TRANSCRIPTION_FAILED'; code: string }
  | { kind: 'EDIT_TRANSCRIPT'; text: string }
  | ({ kind: 'SEND_TRANSCRIPT' } & ActiveChatRequest)
  | ({ kind: 'SEND_TEXT'; text: string } & ActiveChatRequest)
  | {
      kind: 'SEND_CLARIFICATION';
      clarificationId: string;
      text: string;
      requestKey: string;
    }
  | { kind: 'RESPONSE'; response: PublicChatResponse; requestKey: string }
  | {
      kind: 'CONFIRM';
      actionId: string;
      expectedVersion: number;
      nowMs: number;
      requestKey: string;
    }
  | { kind: 'CANCEL' }
  | { kind: 'FAIL'; code: string; requestKey: string };
const validText = (text: string) =>
  text.trim().length > 0 && [...text].length <= 4000;
const idleKinds = ['IDLE', 'ANSWER', 'COMPLETED', 'FAILED', 'ACTION_CLOSED'];
export function transitionGenericChat(
  state: GenericChatState,
  event: GenericChatEvent,
): GenericChatState {
  if (event.kind === 'RESPONSE' || event.kind === 'FAIL') {
    // Ignore canceled, superseded and cross-conversation callbacks, including errors.
    if (!('requestKey' in state) || state.requestKey !== event.requestKey)
      return state;
    if (
      event.kind === 'RESPONSE' &&
      state.conversationId !== undefined &&
      state.conversationId !== event.response.conversationId
    )
      return state;
  }
  if ('requestKey' in event && !event.requestKey.trim())
    throw new Error('INVALID_CHAT_REQUEST_KEY');
  if (event.kind === 'FAIL') {
    if (state.kind === 'CONFIRMING' || state.kind === 'RECOVERING')
      return { ...state, kind: 'RECOVERING', code: event.code };
    return { kind: 'FAILED', code: event.code };
  }
  if (event.kind === 'TRANSCRIPTION_FAILED' && state.kind === 'TRANSCRIBING')
    return { kind: 'FAILED', code: event.code };
  // Local cancel cannot erase uncertain execution. Only an authoritative
  // receipt, pending action or terminal NOT_EXECUTED outcome resolves it.
  if (
    event.kind === 'CANCEL' &&
    state.kind !== 'CONFIRMING' &&
    state.kind !== 'RECOVERING'
  )
    return { kind: 'IDLE' };
  if (event.kind === 'RECORD' && idleKinds.includes(state.kind))
    return { kind: 'RECORDING' };
  if (event.kind === 'AUDIO_READY' && state.kind === 'RECORDING')
    return { kind: 'TRANSCRIBING' };
  if (
    event.kind === 'TRANSCRIBED' &&
    state.kind === 'TRANSCRIBING' &&
    validText(event.transcript.transcript)
  )
    return { kind: 'TRANSCRIPT_REVIEW', transcript: event.transcript };
  if (event.kind === 'EDIT_TRANSCRIPT' && state.kind === 'TRANSCRIPT_REVIEW')
    return {
      ...state,
      transcript: { ...state.transcript, transcript: event.text },
    };
  if (
    event.kind === 'SEND_TRANSCRIPT' &&
    state.kind === 'TRANSCRIPT_REVIEW' &&
    validText(state.transcript.transcript)
  )
    return {
      kind: 'PROCESSING',
      requestKey: event.requestKey,
      conversationId: event.conversationId,
    };
  if (
    event.kind === 'SEND_TEXT' &&
    idleKinds.includes(state.kind) &&
    validText(event.text)
  )
    return {
      kind: 'PROCESSING',
      requestKey: event.requestKey,
      conversationId: event.conversationId,
    };
  if (
    event.kind === 'SEND_CLARIFICATION' &&
    state.kind === 'CLARIFICATION' &&
    event.clarificationId === state.clarificationId &&
    validText(event.text)
  )
    return {
      kind: 'PROCESSING',
      requestKey: event.requestKey,
      conversationId: state.conversationId,
    };
  if (
    event.kind === 'CONFIRM' &&
    state.kind === 'ACTION_REVIEW' &&
    event.actionId === state.action.actionId &&
    event.expectedVersion === state.action.version &&
    event.nowMs < state.action.expiresAtMs
  )
    return {
      kind: 'CONFIRMING',
      action: state.action,
      requestKey: event.requestKey,
      conversationId: state.conversationId,
    };
  if (event.kind === 'RESPONSE') {
    const response = event.response;
    if (state.kind === 'CONFIRMING' || state.kind === 'RECOVERING') {
      if (
        response.kind === 'RECEIPT' &&
        response.receipt.actionId === state.action.actionId &&
        response.receipt.actionVersion === state.action.version
      )
        return { kind: 'COMPLETED', receipt: response.receipt };
      if (
        response.kind === 'ACTION_TERMINAL' &&
        response.outcome.actionId === state.action.actionId &&
        response.outcome.actionVersion === state.action.version &&
        response.outcome.executionOutcome === 'NOT_EXECUTED'
      )
        return { kind: 'ACTION_CLOSED', outcome: response.outcome };
      if (response.kind === 'ERROR')
        return { ...state, kind: 'RECOVERING', code: response.error.code };
      if (
        state.kind === 'RECOVERING' &&
        response.kind === 'PENDING_ACTION' &&
        response.action.actionId === state.action.actionId &&
        response.action.version >= state.action.version
      )
        return {
          kind: 'ACTION_REVIEW',
          action: response.action,
          conversationId: response.conversationId,
        };
    } else if (state.kind === 'PROCESSING') {
      if (response.kind === 'ANSWER')
        return { kind: 'ANSWER', text: response.text };
      if (response.kind === 'CLARIFICATION')
        return {
          kind: 'CLARIFICATION',
          clarificationId: response.clarificationId,
          conversationId: response.conversationId,
        };
      if (response.kind === 'PENDING_ACTION')
        return {
          kind: 'ACTION_REVIEW',
          action: response.action,
          conversationId: response.conversationId,
        };
      if (response.kind === 'ERROR')
        return { kind: 'FAILED', code: response.error.code };
    }
  }
  throw new Error(`INVALID_CHAT_TRANSITION:${state.kind}:${event.kind}`);
}
