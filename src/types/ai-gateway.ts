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

export interface AiGroundingFact {
  field: string;
  value: string | number | boolean | null;
}

export interface AiGroundingCandidate {
  recordId: string;
  citationId: string;
  label: string;
  branchId: string | null;
  score: number;
}

export interface AiGroundingResolution {
  entityType: 'PARTY' | 'ITEM';
  input: string;
  status: 'RESOLVED' | 'AMBIGUOUS' | 'NOT_FOUND';
  selectedRecordId: string | null;
  candidates: AiGroundingCandidate[];
}

export interface AiGroundingCitation {
  citationId: string;
  sourceType: 'PARTY' | 'ITEM';
  recordId: string;
  label: string;
  branchId: string | null;
  href: string;
  observedAt: string;
  recordUpdatedAt: string;
  facts: AiGroundingFact[];
}

export interface AiGroundingEvidence {
  status: 'GROUNDED' | 'PARTIAL' | 'UNRESOLVED' | 'NOT_REQUIRED';
  checkedAt: string;
  resolutions: AiGroundingResolution[];
  citations: AiGroundingCitation[];
}

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
  grounding?: AiGroundingEvidence;
  expiresAt?: string;
  providerAttempt?: {
    attempt: number;
    status: 'SUCCEEDED' | 'FAILED';
    durationMs: number;
    errorCode: string | null;
    retryable: boolean;
  };
  provider: {
    id: string;
    model: string;
    promptVersion: string;
    parseRecoveryOutcome: 'NOT_NEEDED' | 'RECOVERED';
  };
}
