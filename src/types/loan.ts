export type EligibilityStatus = "likely_eligible" | "building_history" | "not_enough_history";

export type LoanApplicationStatus =
  | "none"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "disbursed";

export interface BusinessInfo {
  businessName: string;
  ownerName: string;
  phone: string;
  email?: string;
  businessAddress: string;
  businessType: string;
  tradeLicenseNo?: string;
}

export interface KYCDocuments {
  tradeLicenseUrl?: string;
  tradeLicenseName?: string;
  nidFrontUrl?: string;
  nidFrontName?: string;
  nidBackUrl?: string;
  nidBackName?: string;
}

export interface LoanApplicationRecord {
  id: string;
  status: LoanApplicationStatus;
  requestedAmount: number;
  approvedAmount?: number;
  submittedAt?: string;
  estimatedProcessingHours?: number;
  businessInfo: BusinessInfo;
  kyc: KYCDocuments;
  consentAgreed: boolean;
}

export interface ActiveLoanDetails {
  loanId: string;
  partnerBankName: string;
  outstandingBalance: number;
  totalApprovedAmount: number;
  monthlyInstallment: number;
  nextPaymentDate: string; // YYYY-MM-DD
  interestRate: number; // e.g. 9
  tenureMonths: number; // e.g. 12
  status: "active" | "overdue" | "closed";
}
