// Hello Khata OS - HRM Status Badge
// হ্যালো খাতা - এইচআরএম স্ট্যাটাস ব্যাজ

'use client';

import { Badge } from '@/components/ui/premium';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import type {
  AttendanceStatus,
  EmployeeStatus,
  LeaveStatus,
  PaymentStatus,
} from '../types';

const ATTN_LABELS: Record<AttendanceStatus, { en: string; bn: string }> = {
  Present: { en: 'Present', bn: 'উপস্থিত' },
  Absent: { en: 'Absent', bn: 'অনুপস্থিত' },
  Late: { en: 'Late', bn: 'দেরি' },
  'Half Day': { en: 'Half Day', bn: 'অর্ধদিবস' },
  Leave: { en: 'Leave', bn: 'ছুটি' },
  'Work From Home': { en: 'WFH', bn: 'হোম থেকে' },
  Overtime: { en: 'Overtime', bn: 'ওভারটাইম' },
};

const EMP_LABELS: Record<EmployeeStatus, { en: string; bn: string }> = {
  Active: { en: 'Active', bn: 'সক্রিয়' },
  'On Leave': { en: 'On Leave', bn: 'ছুটিতে' },
  Probation: { en: 'Probation', bn: 'পরীক্ষামূলক' },
  Inactive: { en: 'Inactive', bn: 'নিষ্ক্রিয়' },
};

const LEAVE_LABELS: Record<LeaveStatus, { en: string; bn: string }> = {
  Pending: { en: 'Pending', bn: 'অপেক্ষমাণ' },
  Approved: { en: 'Approved', bn: 'অনুমোদিত' },
  Rejected: { en: 'Rejected', bn: 'বাতিল' },
  Cancelled: { en: 'Cancelled', bn: 'বাতিলকৃত' },
};

const PAY_LABELS: Record<PaymentStatus, { en: string; bn: string }> = {
  Paid: { en: 'Paid', bn: 'পরিশোধিত' },
  Pending: { en: 'Pending', bn: 'অপেক্ষমাণ' },
  Processing: { en: 'Processing', bn: 'প্রক্রিয়াধীন' },
  Failed: { en: 'Failed', bn: 'ব্যর্থ' },
};

type Variant = 'success' | 'warning' | 'destructive' | 'indigo' | 'secondary' | 'outline' | 'default';

interface Props {
  status: string;
  variant?: Variant;
  className?: string;
}

export function HrmStatusBadge({ status, variant, className }: Props) {
  const { isBangla } = useAppTranslation();
  const label = isBangla ? '' : status;
  return (
    <Badge variant={variant || 'secondary'} size="sm" className={className}>
      {label}
    </Badge>
  );
}

export function AttendanceBadge({ status, className }: { status: AttendanceStatus; className?: string }) {
  const { isBangla } = useAppTranslation();
  const map: Record<AttendanceStatus, Variant> = {
    Present: 'success',
    Absent: 'destructive',
    Late: 'warning',
    'Half Day': 'warning',
    Leave: 'indigo',
    'Work From Home': 'outline',
    Overtime: 'indigo',
  };
  return (
    <Badge variant={map[status]} size="sm" className={className}>
      {isBangla ? ATTN_LABELS[status].bn : ATTN_LABELS[status].en}
    </Badge>
  );
}

export function EmployeeStatusBadge({ status, className }: { status: EmployeeStatus; className?: string }) {
  const { isBangla } = useAppTranslation();
  const map: Record<EmployeeStatus, Variant> = {
    Active: 'success',
    'On Leave': 'warning',
    Probation: 'indigo',
    Inactive: 'destructive',
  };
  return (
    <Badge variant={map[status]} size="sm" dot className={className}>
      {isBangla ? EMP_LABELS[status].bn : EMP_LABELS[status].en}
    </Badge>
  );
}

export function LeaveStatusBadge({ status, className }: { status: LeaveStatus; className?: string }) {
  const { isBangla } = useAppTranslation();
  const map: Record<LeaveStatus, Variant> = {
    Pending: 'warning',
    Approved: 'success',
    Rejected: 'destructive',
    Cancelled: 'secondary',
  };
  return (
    <Badge variant={map[status]} size="sm" className={className}>
      {isBangla ? LEAVE_LABELS[status].bn : LEAVE_LABELS[status].en}
    </Badge>
  );
}

export function PaymentStatusBadge({ status, className }: { status: PaymentStatus; className?: string }) {
  const { isBangla } = useAppTranslation();
  const map: Record<PaymentStatus, Variant> = {
    Paid: 'success',
    Pending: 'warning',
    Processing: 'indigo',
    Failed: 'destructive',
  };
  return (
    <Badge variant={map[status]} size="sm" dot className={className}>
      {isBangla ? PAY_LABELS[status].bn : PAY_LABELS[status].en}
    </Badge>
  );
}
