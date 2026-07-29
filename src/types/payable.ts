export type PayableAgingBucket = "current" | "30_days" | "60_days" | "90_days";

export type PayableStatus = "unpaid" | "partial" | "paid" | "overdue";

export interface BillPayment {
  id: string;
  amount: number;
  date: string; // YYYY-MM-DD
  method: "cash" | "bank" | "bkash" | "nagad" | "rocket";
  referenceNo?: string;
  note?: string;
}

export interface SupplierBill {
  id: string;
  billNumber: string;
  supplierId: string;
  supplierName: string;
  supplierPhone?: string;
  supplierEmail?: string;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  issueDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  agingBucket: PayableAgingBucket;
  agingDays: number;
  branchId: string;
  branchName: string;
  status: PayableStatus;
  linkedPurchaseId?: string;
  linkedPurchaseNo?: string;
  notes?: string;
  paymentHistory: BillPayment[];
  createdAt: Date;
}

export interface PayableFilterState {
  searchQuery: string;
  selectedStatus: "all" | PayableStatus;
  selectedAging: "all" | PayableAgingBucket;
  selectedBranch: string;
  selectedSupplier: string;
  dateRange: "all" | "today" | "week" | "month" | "custom";
}
