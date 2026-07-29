export type BankAccountType = "bank" | "bkash" | "nagad" | "rocket" | "cash";

export type ReconciliationMatchStatus = "matched" | "pending" | "ignored" | "conflict";

export interface BankAccount {
  id: string;
  accountName: string;
  accountNumber?: string;
  accountType: BankAccountType;
  bankName?: string;
  branchName?: string;
  recordedBalance: number;
  importedStatementBalance: number;
  unreconciledCount: number;
  lastImportedDate?: string;
  isDefault?: boolean;
}

export interface StatementLine {
  id: string;
  date: string; // YYYY-MM-DD
  description: string;
  reference?: string;
  amount: number; // positive = credit/deposit, negative = debit/withdrawal
  type: "credit" | "debit";
  status: ReconciliationMatchStatus;
  suggestedTransactionId?: string;
  matchedTransactionId?: string;
  matchScore?: number; // percentage e.g. 95
  matchReason?: string;
}

export interface RecordedTransaction {
  id: string;
  date: string;
  title: string;
  branchName: string;
  amount: number;
  type: "income" | "expense" | "transfer";
  source: "auto" | "manual";
  referenceNo?: string;
}

export interface CSVColumnMapping {
  dateCol: string;
  amountCol: string;
  descriptionCol: string;
  referenceCol: string;
  typeCol: string;
}

export interface ReconciliationSummaryData {
  totalLines: number;
  matchedCount: number;
  pendingCount: number;
  ignoredCount: number;
  conflictCount: number;
  differenceAmount: number;
  completionPercentage: number;
}

export interface BankFilterState {
  searchQuery: string;
  accountType: "all" | BankAccountType;
  sortBy: "name" | "balance font" | "pending";
  dateRange: "all" | "today" | "week" | "month" | "custom";
  statusFilter: "all" | ReconciliationMatchStatus;
}
