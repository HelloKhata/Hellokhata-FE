export type TransferMode = "deposit" | "withdrawal";

export type AccountType = "cash" | "bank" | "bkash" | "nagad" | "rocket" | string;

export interface AccountOption {
  id: AccountType;
  name: string;
  nameBn: string;
  icon: string;
  category: "cash" | "bank" | "wallet";
  currentBalance: number;
}

export interface TransferRecord {
  id: string;
  type: TransferMode;
  accountId: AccountType;
  accountName: string;
  accountIcon: string;
  branchId: string;
  branchName: string;
  amount: number;
  date: string; // YYYY-MM-DD
  memo?: string;
  createdAt: Date;
}

export interface TransferFilterState {
  searchQuery: string;
  selectedAccount: string;
  selectedType: "all" | TransferMode;
  dateRange: "all" | "today" | "week" | "month" | "custom";
}
