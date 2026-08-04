export type TransactionType =
  | "sale"
  | "purchase"
  | "expense"
  | "income"
  | "deposit"
  | "withdrawal"
  | "payment"
  | "payroll"
  | "loan";

export type TransactionSource = "auto" | "manual";

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  category: string;
  isAuto: boolean;
  branchName: string;
  branchId?: string;
  timestamp: string; // e.g. "Today, 3:40 PM"
  rawDate: Date;
  amount: number; // positive for Money In, negative for Money Out
  customerOrSupplierName?: string;
  invoiceNumber?: string;
  memo?: string;
  notes?: string;
  linkedModule?: "POS" | "Sales" | "Expenses" | "Purchases" | "Inventory" | "Payroll" | "Banking";
  vatAmount?: number;
  taxAmount?: number;
  accountingDetails?: {
    debitAccount: string;
    creditAccount: string;
    referenceCode: string;
  };
}

export interface MoneyEntryCategory {
  id: string;
  nameEn: string;
  nameBn: string;
  iconName: string;
}

export interface MoneyEntryRecord {
  id: string;
  type: "income" | "expense";
  amount: number;
  categoryId: string;
  categoryName: string;
  branchName: string;
  date: string;
  memo?: string;
  sourceNote?: string;
  photoUrl?: string;
  isRecurring?: boolean;
  repeatFrequency?: "monthly" | "weekly" | "yearly";
  nextDueDate?: string;
  createdAt: Date;
}

export interface FinancialSummaryData {
  cashPosition: {
    amount: number;
    cashAmount: number;
    bankAmount: number;
    walletAmount: number;
    lastSyncedMinutesAgo: number;
  };
  moneyIn: {
    amount: number;
    period: string;
    changePercentage: number;
  };
  moneyOut: {
    amount: number;
    period: string;
    changePercentage: number;
  };
  netCashFlow: {
    amount: number;
    period: string;
    isPositive: boolean;
  };
}

export interface MoneyFlowPoint {
  date: string;
  dayLabel: string;
  moneyIn: number;
  moneyOut: number;
}

export interface ReceivableSummary {
  totalAmount: number;
  overdueCount: number;
  pendingInvoicesCount: number;
}

export interface PayableSummary {
  totalAmount: number;
  dueCount: number;
  pendingBillsCount: number;
}

export interface RecentTransaction {
  id: string;
  type: "sale" | "expense" | "deposit" | "withdrawal" | "transfer" | "income" | "refund";
  accountName?: string;
  description: string;
  category?: string;
  isAuto: boolean;
  branchName: string;
  timestamp: string;
  rawDate: Date;
  amount: number;
  status?: "completed" | "pending" | "failed";
}

export interface CategoryBreakdownItem {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface CashFlowPointExtended {
  date: string;
  label: string;
  income: number;
  expense: number;
  profit: number;
}

export interface AccountOverview {
  id: string;
  accountName: string;
  accountType: "Cash" | "Bank" | "Mobile Banking" | "Credit Card";
  accountNumber?: string;
  currentBalance: number;
  availableBalance: number;
  status: "active" | "inactive" | "syncing";
  bankLogo?: string;
}

export interface FinancialDashboardInsights {
  highestExpenseCategory: { name: string; amount: number };
  highestIncomeSource: { name: string; amount: number };
  profitMarginPercentage: number;
  avgDailyIncome: number;
  avgDailyExpense: number;
  bestPerformingMonth: string;
  worstPerformingMonth: string;
}

