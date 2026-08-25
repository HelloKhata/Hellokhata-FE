// Hello Khata OS - Finance Reports Architecture Types
// হ্যালো খাতা - ফাইন্যান্স রিপোর্টস আর্কিটেকচার টাইপস

export interface FinancialHealthMetrics {
  netProfit: number;
  netProfitChange: number;
  netProfitPrevious: number;
  revenue: number;
  revenueChange: number;
  expenses: number;
  expensesChange: number;
  cashAndBank: number;
  receivables: number;
  payables: number;
  netMargin: number;
}

export interface PerformanceTimePoint {
  period: string;
  revenue: number;
  expenses: number;
  netProfit: number;
}

export interface CashMovementSummary {
  openingCash: number;
  cashIn: number;
  cashOut: number;
  closingCash: number;
  netCashFlow: number;
  trend: number[];
}

export interface AgingBucket {
  range: string;
  amount: number;
  percentage: number;
}

export interface BalanceSheetItem {
  category: string;
  amount: number;
  percentage: number;
}

export interface ExpenseCategoryItem {
  category: string;
  categoryBn?: string;
  amount: number;
  percentage: number;
  changePct: number;
}

export interface FinancialAlertItem {
  id: string;
  title: string;
  titleBn?: string;
  severity: 'warning' | 'info' | 'critical';
  impact: string;
  impactBn?: string;
  actionText: string;
  actionTextBn?: string;
  actionHref?: string;
}

export interface RecentTransactionItem {
  id: string;
  date: string;
  reference: string;
  account: string;
  type: 'Income' | 'Expense' | 'Transfer' | 'Customer Receipt' | 'Supplier Payment';
  amount: number;
  status: 'Completed' | 'Pending';
}
