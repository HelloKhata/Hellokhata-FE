export type AgingBucket = "current" | "30_days" | "60_days" | "90_days";

export interface ReceivableInvoice {
  id: string;
  invoiceNo: string;
  issueDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: "unpaid" | "partial" | "overdue";
}

export interface ReceivablePayment {
  id: string;
  amount: number;
  date: string;
  method: "cash" | "bank" | "bkash" | "nagad" | "rocket";
  note?: string;
  referenceNo?: string;
}

export interface ReceivableCustomer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  branchId: string;
  branchName: string;
  totalOutstanding: number;
  agingBucket: AgingBucket;
  agingDays: number;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
  dueDate: string;
  riskScore?: number; // 0 - 100
  invoices: ReceivableInvoice[];
  paymentHistory: ReceivablePayment[];
}

export interface ReceivableFilterState {
  searchQuery: string;
  selectedAging: "all" | AgingBucket;
  selectedBranch: string;
  minAmount?: number;
  maxAmount?: number;
  dateRange: "all" | "today" | "week" | "month" | "custom";
}
