export type LeaveType = "Casual Leave" | "Sick Leave" | "Earned Leave" | "Festival Leave";

export type LeaveStatus = "pending" | "approved" | "rejected";

export interface LeaveBalance {
  leaveType: LeaveType;
  remainingDays: number;
  annualQuota: number;
}

export interface LeaveRequest {
  id: string; // LV-9901
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  role: string;
  branchName: string;
  leaveType: LeaveType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  totalDays: number;
  appliedDate: string;
  reason: string;
  status: LeaveStatus;
  managerNote?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  remainingBalancePreview?: number;
}

export interface LeaveFilterState {
  searchQuery: string;
  selectedBranch: string;
  selectedLeaveType: "all" | LeaveType;
  selectedStatus: "all" | LeaveStatus;
}
