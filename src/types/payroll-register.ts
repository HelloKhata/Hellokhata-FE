export type PaymentStatus = 'paid' | 'partially_paid' | 'pending' | 'failed';

export type PaymentMethod = 'bank_transfer' | 'cash' | 'bkash' | 'cheque';

export type SalaryType = 'monthly' | 'hourly' | 'commission';

export interface BankInfo {
  bankName: string;
  accountNumber: string;
  branchName?: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  employeeNameBn?: string;
  photoUrl?: string;
  branchId: string;
  branchName: string;
  department: string;
  designation: string;
  role: string;
  payrollPeriod: string; // e.g. "July 2026"
  salaryType: SalaryType;
  basicSalary: number;
  allowances: number;
  overtime: number;
  bonus: number;
  grossSalary: number;
  tax: number;
  leaveDeduction: number;
  lateDeduction: number;
  otherDeductions: number;
  totalDeductions: number;
  netSalary: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paidDate?: string;
  generatedDate: string;
  createdBy: string;
  notes?: string;
  bankInfo?: BankInfo;
}

export interface PayrollSummary {
  totalEmployeesPaid: number;
  grossPayroll: number;
  totalDeductions: number;
  netPayrollPaid: number;
  pendingPaymentsAmount: number;
  pendingPaymentsCount: number;
  highestSalary: number;
  lowestSalary: number;
  totalOvertimePaid: number;
  totalBonusesPaid: number;
  averageSalary: number;
  averageDeduction: number;
}

export interface PayrollFilters {
  payrollPeriod: string;
  branch: string;
  search: string;
  department: string;
  role: string;
  paymentStatus: string;
  paymentMethod: string;
  salaryType: string;
  dateRangePreset?: 'current_month' | 'last_month' | 'q2_2026' | 'all';
}
