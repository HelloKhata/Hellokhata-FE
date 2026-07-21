import type { AiGroundingEvidence, AiIntentType } from './ai-gateway';

export type AiActionStatus =
  | 'PENDING_CONFIRMATION'
  | 'CONFIRMED'
  | 'REJECTED'
  | 'EXPIRED';

export interface AiActionDraft {
  intentType: AiIntentType;
  registryActionId: string;
  party: { recordId: string; label: string } | null;
  lineItems: Array<{
    recordId: string;
    label: string;
    quantity: number;
    unitPrice: number;
  }>;
  amount: number | null;
  paymentMethod: string | null;
  adjustmentReason: string | null;
  notes: string | null;
  citationIds: string[];
}

export interface AiActionReceipt {
  actionId: string;
  actionVersion: number;
  status: 'BLOCKED' | 'SUCCEEDED';
  errorCode: 'AI_EXECUTION_DISABLED' | 'AI_ACTION_NOT_ALLOWED' | null;
  committedEntity: {
    type: 'SALE';
    id: string;
    invoiceNo: string;
    href: string;
  } | null;
  attempts: number;
  createdAt: string;
  updatedAt: string;
}

export interface AiAction {
  contractVersion: '1.0.0';
  actionId: string;
  sourceRequestId: string;
  status: AiActionStatus;
  version: number;
  risk: string;
  actionType: string;
  registryActionId: string;
  draft: AiActionDraft;
  sourceEvidence: AiGroundingEvidence;
  proposalHash: string;
  expiresAt: string;
  confirmedAt: string | null;
  rejectedAt: string | null;
  createdAt: string;
  updatedAt: string;
  execution: AiActionReceipt | null;
}

export interface UpdateAiActionDraft {
  expectedVersion: number;
  party?: AiActionDraft['party'];
  lineItems?: AiActionDraft['lineItems'];
  amount?: number | null;
  paymentMethod?: string | null;
  adjustmentReason?: string | null;
  notes?: string | null;
}
