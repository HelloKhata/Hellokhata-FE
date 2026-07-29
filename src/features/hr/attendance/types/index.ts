export type AttendanceStatus = "present" | "late" | "absent" | "leave" | "holiday";

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  role: string;
  branchName: string;
  date: string; // YYYY-MM-DD
  checkIn: string; // HH:mm
  checkOut?: string; // HH:mm
  workingHours: number;
  overtimeHours?: number;
  status: AttendanceStatus;
  device?: string; // e.g. "Kiosk Terminal #1"
  correctionReason?: string;
  managerNote?: string;
  isCorrected?: boolean;
}

export interface AttendanceMatrixCell {
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  recordId?: string;
}

export interface AttendanceMatrixRow {
  employeeId: string;
  employeeName: string;
  avatarUrl?: string;
  role: string;
  branchName: string;
  cells: AttendanceMatrixCell[];
}

export interface OfflineQueueItem {
  id: string;
  employeeId: string;
  employeeName: string;
  type: "check_in" | "check_out";
  timestamp: string;
  branchName: string;
  syncState: "idle" | "queued" | "syncing" | "synced" | "failed";
  retryCount: number;
}

export interface AttendanceCorrectionInput {
  recordId: string;
  checkIn: string;
  checkOut?: string;
  status: AttendanceStatus;
  correctionReason: string;
  managerNote?: string;
}
