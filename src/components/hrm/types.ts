// Hello Khata OS - HRM Module Types
// হ্যালো খাতা - এইচআরএম মডিউল টাইপ সংজ্ঞা

export type EmployeeStatus = 'Active' | 'On Leave' | 'Probation' | 'Inactive';
export type AttendanceStatus =
  | 'Present'
  | 'Absent'
  | 'Late'
  | 'Half Day'
  | 'Leave'
  | 'Work From Home'
  | 'Overtime';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
export type LeaveType = 'Casual' | 'Sick' | 'Annual' | 'Maternity' | 'Paternity' | 'Unpaid';
export type PaymentStatus = 'Paid' | 'Pending' | 'Processing' | 'Failed';

export interface Branch {
  id: string;
  name: string;
}

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  nameBn: string;
  phone: string;
  email: string;
  branchId: string;
  department: string;
  designation: string;
  joiningDate: string;
  salary: number;
  status: EmployeeStatus;
  gender: 'Male' | 'Female';
  address: string;
  emergencyContact: string;
  bloodGroup: string;
  nid: string;
  shift: string;
  roleId: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  name: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: AttendanceStatus;
  hoursWorked: number;
  overtimeHours: number;
  branchId: string;
  department: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  name: string;
  type: LeaveType;
  from: string;
  to: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
  branchId: string;
  department: string;
  reviewedBy?: string;
  reviewedOn?: string;
}

export interface LeaveBalance {
  type: LeaveType;
  total: number;
  used: number;
  remaining: number;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  name: string;
  branchId: string;
  department: string;
  designation: string;
  basicSalary: number;
  allowance: number;
  bonus: number;
  deduction: number;
  netSalary: number;
  paymentStatus: PaymentStatus;
  paymentDate?: string;
  paymentMethod?: string;
}

export interface PayslipLine {
  label: string;
  labelBn: string;
  amount: number;
  type: 'earning' | 'deduction';
}

export interface RolePermission {
  id: string;
  name: string;
  description: string;
  employees: number;
  isSystem?: boolean;
  modules: Record<string, PermissionFlags>;
}

export interface PermissionFlags {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  approve: boolean;
  export: boolean;
}

export interface AttendanceTrendPoint {
  month: string;
  present: number;
  late: number;
  absent: number;
  leave: number;
}

export interface DepartmentDist {
  name: string;
  value: number;
}

export interface ActivityEvent {
  id: string;
  title: string;
  titleBn: string;
  detail: string;
  detailBn: string;
  time: string;
  icon: 'join' | 'leave' | 'salary' | 'attendance' | 'promotion';
}

export interface BirthdayItem {
  id: string;
  name: string;
  designation: string;
  day: number;
  month: string;
  dateLabel: string;
}

export const DEPARTMENTS = [
  'Management',
  'Sales',
  'Accounts & Finance',
  'Inventory',
  'HR & Admin',
  'IT & Support',
  'Marketing',
];

export const DESIGNATIONS = [
  'Managing Director',
  'Branch Manager',
  'Sales Executive',
  'Accountant',
  'Cashier',
  'Storekeeper',
  'HR Officer',
  'IT Executive',
  'Marketing Executive',
  'Receptionist',
  'Sales Representative',
  'Warehouse Supervisor',
];

export const PERMISSION_ACTIONS: { key: keyof PermissionFlags; label: string; labelBn: string }[] = [
  { key: 'view', label: 'View', labelBn: 'দেখুন' },
  { key: 'create', label: 'Create', labelBn: 'তৈরি করুন' },
  { key: 'edit', label: 'Edit', labelBn: 'সম্পাদনা' },
  { key: 'delete', label: 'Delete', labelBn: 'মুছুন' },
  { key: 'approve', label: 'Approve', labelBn: 'অনুমোদন' },
  { key: 'export', label: 'Export', labelBn: 'রপ্তানি' },
];

export const MODULE_KEYS = [
  'Dashboard',
  'Sales',
  'Purchases',
  'Parties',
  'Inventory',
  'Finance',
  'HRM',
  'Reports',
  'Settings',
];
