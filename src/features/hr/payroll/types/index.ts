export type PaymentMethod = "Cash" | "Bank" | "bKash" | "Nagad";

export type PaymentStatus = "paid" | "pending" | "partial";

export type PayrollRunStatus = "draft" | "review" | "completed";

export type BonusType = "Eid Bonus" | "Festival Bonus" | "Performance Bonus" | "One-Time Bonus";

export interface SalaryComponent {
  id: string;
  name: string;
  amount: number;
  type: "allowance" | "deduction";
}

export interface SalaryStructure {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  branchName: string;
  basicSalary: number;
  allowances: SalaryComponent[];
  deductions: SalaryComponent[];
  grossSalary: number;
  netSalary: number;
}

export interface PayrollItem {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  branchName: string;
  basicSalary: number;
  allowances: number;
  overtimePay: number;
  lateDeduction: number;
  leaveDeduction: number;
  otherAdjustments: number;
  netSalary: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  paidDate?: string;
  isEdited?: boolean;
}

export interface PayrollRun {
  id: string; // PR-2026-07
  periodName: string; // e.g. "July 2026"
  branchName: string;
  employeeCount: number;
  totalGross: number;
  totalDeductions: number;
  totalNetPayroll: number;
  status: PayrollRunStatus;
  createdBy: string;
  createdDate: string;
  financeTransactionId?: string;
  items: PayrollItem[];
}

export interface Payslip {
  id: string; // PS-1001
  employeeId: string;
  employeeName: string;
  role: string;
  branchName: string;
  monthYear: string;
  basicSalary: number;
  allowancesBreakdown: { name: string; amount: number }[];
  deductionsBreakdown: { name: string; amount: number }[];
  netPaid: number;
  paymentStatus: PaymentStatus;
  issueDate: string;
  paymentMethod?: PaymentMethod;
}

export interface BonusPayment {
  id: string;
  bonusType: BonusType;
  title: string;
  branchName: string;
  employeeCount: number;
  totalBonusAmount: number;
  disbursedDate: string;
  status: "disbursed" | "scheduled";
}

export interface PayPeriod {
  id: string;
  name: string; // e.g. "July 2026"
  startDate: string;
  endDate: string;
}

export interface PayrollFilterState {
  searchQuery: string;
  selectedBranch: string;
  selectedPeriod: string;
  selectedStatus: "all" | PaymentStatus;
  selectedPaymentMethod: "all" | PaymentMethod;
}
