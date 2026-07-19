export const AI_CONTRACT_VERSION = '1.0.0' as const;

export type AiLanguage = 'bn' | 'bn-BD' | 'en' | 'en-US';
export type AiInputModality = 'text';

export interface PublicAiTextRequest {
  contractVersion: typeof AI_CONTRACT_VERSION;
  clientRequestId?: string;
  input: {
    modality: AiInputModality;
    text: string;
    language: AiLanguage;
  };
}

export type AiProposalStatus = 'PROPOSED' | 'NEEDS_CLARIFICATION' | 'REJECTED';

export type AiIntentType =
  | 'RECORD_SALE'
  | 'RECORD_PURCHASE'
  | 'RECORD_PAYMENT_IN'
  | 'RECORD_PAYMENT_OUT'
  | 'ISSUE_CREDIT'
  | 'REPAY_CREDIT'
  | 'ADJUST_INVENTORY'
  | 'UNKNOWN';

export interface AiProposalResponse {
  contractVersion: typeof AI_CONTRACT_VERSION;
  requestId: string;
  traceId: string;
  status: AiProposalStatus;
  proposal: {
    intentType: AiIntentType;
    actionId: string | null;
    summary: string;
    confidence: number;
    entities: Record<string, unknown>;
    actionAllowed: boolean;
  };
  missingFields: string[];
  requiresConfirmation: true;
  provider: {
    id: string;
    model: string;
  };
}
