export type EmployeeRole =
  | "Manager"
  | "Sales Associate"
  | "Accountant"
  | "Cashier"
  | "Store Keeper"
  | "HR Officer"
  | "Delivery Executive";

export type EmployeeStatus = "active" | "inactive" | "on_leave";

export interface SalaryComponent {
  id: string;
  name: string;
  amount: number;
  type: "allowance" | "deduction";
}

export interface SalaryStructure {
  basicSalary: number;
  allowances: SalaryComponent[];
  deductions: SalaryComponent[];
  grossSalary: number;
  netSalary: number;
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  clockIn: string; // HH:mm
  clockOut: string; // HH:mm
  status: "present" | "late" | "absent" | "half_day" | "leave";
  hoursWorked: number;
  overtimeHours?: number;
}

export interface LeaveRecord {
  id: string;
  leaveType: "Casual Leave" | "Sick Leave" | "Earned Leave" | "Unpaid Leave";
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: "approved" | "pending" | "rejected";
}

export interface PayslipRecord {
  id: string;
  monthYear: string; // e.g. "July 2026"
  issueDate: string;
  basicSalary: number;
  totalAllowances: number;
  totalDeductions: number;
  netPaid: number;
  status: "paid" | "processing";
}

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  performedBy: string;
}

export interface Employee {
  id: string; // EMP-1001
  fullName: string;
  phone: string;
  email: string;
  nid?: string;
  avatarUrl?: string;
  role: EmployeeRole;
  branchId: string;
  branchName: string;
  joiningDate: string; // YYYY-MM-DD
  status: EmployeeStatus;
  salaryStructure: SalaryStructure;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  managerName?: string;
  attendanceHistory: AttendanceRecord[];
  leaveHistory: LeaveRecord[];
  payslipHistory: PayslipRecord[];
  activityLogs: ActivityLogEntry[];
  createdAt: Date;
}

export interface EmployeeFilterState {
  searchQuery: string;
  selectedBranch: string;
  selectedRole: string;
  selectedStatus: "all" | EmployeeStatus;
  salaryRange: "all" | "0-20k" | "20k-50k" | "50k+";
}
