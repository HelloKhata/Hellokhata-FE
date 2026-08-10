// Hello Khata OS - HRM Attendance Page
// হ্যালো খাতা - এইচআরএম উপস্থিতি পেজ

'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarCheck,
  Clock,
  UserX,
  CalendarOff,
  Home,
  TimerReset,
  ChevronLeft,
  ChevronRight,
  Search,
  Download,
  CheckCheck,
  CalendarDays,
  RefreshCw,
  UserCheck,
  ListChecks,
  Zap,
  Edit2,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button, Input, Card, CardHeader, CardTitle } from '@/components/ui/premium';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
import { useAppTranslation, useDateFormat } from '@/hooks/useAppTranslation';
import { HrmPageHeader } from '@/components/hrm/shared/HrmPageHeader';
import { HrmStatCard } from '@/components/hrm/shared/HrmStatCard';
import { HrmDataTable, type HrmColumn } from '@/components/hrm/shared/HrmDataTable';
import { HrmPagination } from '@/components/hrm/shared/HrmPagination';
import { HrmAvatar } from '@/components/hrm/shared/HrmAvatar';
import { AttendanceBadge } from '@/components/hrm/shared/HrmStatusBadge';
import { HrmEmptyState } from '@/components/hrm/shared/HrmEmptyState';
import { todayAttendance, branchName, HRM_BRANCHES } from '@/components/hrm/mock-data';
import { DEPARTMENTS } from '@/components/hrm/types';
import type { AttendanceRecord, AttendanceStatus } from '@/components/hrm/types';

const PAGE_SIZE = 8;

const STATUS_ACTIONS: { status: AttendanceStatus; label: string; labelBn: string; tone: string }[] = [
  { status: 'Present', label: 'Present', labelBn: 'উপস্থিত', tone: 'hover:bg-emerald/20 text-emerald' },
  { status: 'Late', label: 'Late', labelBn: 'দেরি', tone: 'hover:bg-warning/20 text-warning' },
  { status: 'Half Day', label: 'Half Day', labelBn: 'অর্ধদিবস', tone: 'hover:bg-warning/20 text-warning' },
  { status: 'Work From Home', label: 'WFH', labelBn: 'হোম থেকে', tone: 'hover:bg-primary/20 text-primary' },
  { status: 'Overtime', label: 'Overtime', labelBn: 'ওভারটাইম', tone: 'hover:bg-sky-400/20 text-sky-400' },
  { status: 'Leave', label: 'Leave', labelBn: 'ছুটি', tone: 'hover:bg-primary/20 text-primary' },
  { status: 'Absent', label: 'Absent', labelBn: 'অনুপস্থিত', tone: 'hover:bg-destructive/20 text-destructive' },
];

export default function AttendancePage() {
  const { isBangla } = useAppTranslation();
  const { formatDate } = useDateFormat();

  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [marked, setMarked] = useState<Record<string, AttendanceStatus>>({});
  const [bulkMode, setBulkMode] = useState(false);

  // Custom Attendance Overrides state (for inline/dialog modifications)
  const [overrides, setOverrides] = useState<Record<string, Partial<AttendanceRecord> & { remarks?: string }>>({});

  // Dialog Edit states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState('');
  const [editStatus, setEditStatus] = useState<AttendanceStatus>('Present');
  const [editCheckIn, setEditCheckIn] = useState('09:00 AM');
  const [editCheckOut, setEditCheckOut] = useState('05:30 PM');
  const [editHours, setEditHours] = useState('8.0');
  const [editOvertime, setEditOvertime] = useState('0.0');
  const [editRemarks, setEditRemarks] = useState('');

  const baseRecords = useMemo(() => todayAttendance(selectedDate), [selectedDate]);

  const selectedEditRecord = baseRecords.find((r) => r.employeeId === editEmployeeId);
  
  const records = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return baseRecords.map((r) => {
      const o = overrides[r.employeeId] || {};
      const statusVal = o.status || marked[r.employeeId] || r.status;
      return {
        ...r,
        ...o,
        status: statusVal,
      };
    }).filter((r) => {
      if (q && !r.name.toLowerCase().includes(q) && !r.employeeId.toLowerCase().includes(q)) return false;
      if (branchFilter !== 'all' && r.branchId !== branchFilter) return false;
      if (deptFilter !== 'all' && r.department !== deptFilter) return false;
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      return true;
    });
  }, [baseRecords, searchTerm, branchFilter, deptFilter, statusFilter, marked, overrides]);

  const stats = useMemo(() => {
    const list = baseRecords.map((r) => {
      const o = overrides[r.employeeId] || {};
      return o.status || marked[r.employeeId] || r.status;
    });
    const count = (s: AttendanceStatus) => list.filter((x) => x === s).length;
    const computedHours = baseRecords.reduce((s, r) => {
      const o = overrides[r.employeeId] || {};
      const hr = o.hoursWorked !== undefined ? o.hoursWorked : r.hoursWorked;
      return s + hr;
    }, 0);
    return {
      present: count('Present') + count('Work From Home') + count('Overtime') + count('Late') + count('Half Day'),
      late: count('Late'),
      absent: count('Absent'),
      leave: count('Leave'),
      wfh: count('Work From Home'),
      overtime: count('Overtime'),
      hours: computedHours,
    };
  }, [baseRecords, marked, overrides]);

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  const shiftDay = (delta: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + delta);
    setSelectedDate(d);
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(records.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paged = records.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const setStatusFor = (employeeId: string, status: AttendanceStatus) => {
    setMarked((prev) => ({ ...prev, [employeeId]: status }));
    // Synchronize override status
    setOverrides((prev) => ({
      ...prev,
      [employeeId]: {
        ...(prev[employeeId] || {}),
        status,
      }
    }));
    toast.success(isBangla ? 'উপস্থিতি আপডেট হয়েছে' : 'Attendance updated');
  };

  const markAll = (status: AttendanceStatus) => {
    const nextMarked: Record<string, AttendanceStatus> = {};
    const nextOverrides: Record<string, Partial<AttendanceRecord>> = {};
    
    baseRecords.forEach((r) => {
      const currentStatus = overrides[r.employeeId]?.status || marked[r.employeeId] || r.status;
      if (statusFilter === 'all' || currentStatus === statusFilter) {
        nextMarked[r.employeeId] = status;
        nextOverrides[r.employeeId] = {
          ...(overrides[r.employeeId] || {}),
          status,
        };
      }
    });

    setMarked((prev) => ({ ...prev, ...nextMarked }));
    setOverrides((prev) => ({ ...prev, ...nextOverrides }));
    setBulkMode(false);
    toast.success(isBangla ? `সবাই ${status} হিসেবে চিহ্নিত হয়েছে` : `All marked as ${status}`);
  };

  const handleOpenEdit = (record: AttendanceRecord) => {
    const o = overrides[record.employeeId] || {};
    const statusVal = o.status || record.status;
    const checkInVal = o.checkIn || record.checkIn;
    const checkOutVal = o.checkOut || record.checkOut;
    const hoursVal = o.hoursWorked !== undefined ? String(o.hoursWorked) : String(record.hoursWorked);
    const otVal = o.overtimeHours !== undefined ? String(o.overtimeHours) : String(record.overtimeHours);
    const remarksVal = o.remarks || '';

    setEditEmployeeId(record.employeeId);
    setEditStatus(statusVal);
    setEditCheckIn(checkInVal);
    setEditCheckOut(checkOutVal);
    setEditHours(hoursVal);
    setEditOvertime(otVal);
    setEditRemarks(remarksVal);
    setIsEditOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editEmployeeId) return;

    setOverrides((prev) => ({
      ...prev,
      [editEmployeeId]: {
        ...(prev[editEmployeeId] || {}),
        status: editStatus,
        checkIn: editCheckIn,
        checkOut: editCheckOut,
        hoursWorked: parseFloat(editHours) || 0,
        overtimeHours: parseFloat(editOvertime) || 0,
        remarks: editRemarks,
      },
    }));

    setIsEditOpen(false);
    toast.success(isBangla ? 'উপস্থিতি রেকর্ড আপডেট সম্পন্ন!' : 'Attendance record updated successfully!');
  };

  const columns: HrmColumn<AttendanceRecord>[] = [
    {
      key: 'employee',
      header: isBangla ? 'কর্মচারী' : 'Employee',
      render: (r) => {
        const hasOverride = overrides[r.employeeId] !== undefined;
        return (
          <div className="flex items-center gap-3">
            <HrmAvatar name={r.name} size="sm" />
            <div className="min-w-0">
              <p className="font-medium text-foreground text-sm truncate max-w-[150px]">{r.name}</p>
              <p className="text-xs text-muted-foreground">{r.department}</p>
            </div>
            {hasOverride && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary-subtle rounded px-1.5 py-0.5 shrink-0">
                <Zap className="h-3 w-3" />
                {isBangla ? 'সম্পাদিত' : 'Edited'}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: 'branch',
      header: isBangla ? 'শাখা' : 'Branch',
      render: (r) => <span className="text-sm text-muted-foreground whitespace-nowrap">{branchName(r.branchId)}</span>,
    },
    {
      key: 'checkIn',
      header: isBangla ? 'ইন' : 'Check In',
      align: 'center',
      render: (r) => <span className="text-sm text-muted-foreground tabular-nums">{r.checkIn}</span>,
    },
    {
      key: 'checkOut',
      header: isBangla ? 'আউট' : 'Check Out',
      align: 'center',
      render: (r) => <span className="text-sm text-muted-foreground tabular-nums">{r.checkOut}</span>,
    },
    {
      key: 'hours',
      header: isBangla ? 'ঘণ্টা' : 'Hours',
      align: 'right',
      render: (r) => (
        <span className="text-sm font-medium text-foreground tabular-nums">
          {r.hoursWorked.toFixed(1)}
          {r.overtimeHours > 0 && <span className="text-[10px] text-sky-400 ml-1">+{r.overtimeHours.toFixed(1)}</span>}
        </span>
      ),
    },
    {
      key: 'status',
      header: isBangla ? 'স্ট্যাটাস' : 'Status',
      align: 'center',
      render: (r) => <AttendanceBadge status={r.status} />,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end" onClick={(ev) => ev.stopPropagation()}>
          {bulkMode ? (
            <div className="flex items-center gap-1">
              {STATUS_ACTIONS.filter((s) => s.status !== 'Absent').map((s) => (
                <button
                  key={s.status}
                  onClick={() => setStatusFor(r.employeeId, s.status)}
                  className={`text-[11px] font-medium rounded-md px-2 py-1 transition-colors ${s.tone}`}
                >
                  {isBangla ? s.labelBn : s.label}
                </button>
              ))}
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleOpenEdit(r)}
              className="h-7 text-[10px] px-2.5 flex items-center gap-1 hover:bg-primary/10 hover:text-primary transition-colors border-border/60"
            >
              <Edit2 className="h-3 w-3" />
              <span>{isBangla ? 'সম্পাদনা' : 'Edit'}</span>
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <HrmPageHeader
        title={isBangla ? 'উপস্থিতি ব্যবস্থাপনা' : 'Attendance Management'}
        titleBn="উপস্থিতি ব্যবস্থাপনা"
        subtitle={isBangla ? 'দৈনিক উপস্থিতি রেকর্ড ও পরিচালনা করুন।' : 'Record and manage daily attendance.'}
        subtitleBn="দৈনিক উপস্থিতি রেকর্ড ও পরিচালনা করুন।"
        icon={CalendarCheck}
        breadcrumbs={[{ label: isBangla ? 'উপস্থিতি' : 'Attendance', labelBn: 'উপস্থিতি' }]}
        actions={
          <>
            <Button
              variant="outline"
              leftIcon={<Download className="h-4 w-4" />}
              onClick={() => toast.success(isBangla ? 'রপ্তানি শুরু হয়েছে' : 'Export started')}
            >
              <span className="hidden sm:inline">{isBangla ? 'রপ্তানি' : 'Export'}</span>
            </Button>
            <Button
              variant={bulkMode ? 'secondary' : 'default'}
              leftIcon={<ListChecks className="h-4 w-4" />}
              onClick={() => setBulkMode((v) => !v)}
            >
              {bulkMode ? (isBangla ? 'বাতিল করুন' : 'Done') : (isBangla ? 'বাল্ক উপস্থিতি' : 'Bulk Edit')}
            </Button>
          </>
        }
      />

      {/* Date navigation */}
      <Card padding="lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => shiftDay(-1)} aria-label="Previous day">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="default" leftIcon={<CalendarDays className="h-4 w-4" />}>
                  <span className="tabular-nums">{formatDate(selectedDate)}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) => {
                    if (d) setSelectedDate(d);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button variant="outline" size="icon" onClick={() => shiftDay(1)} aria-label="Next day">
              <ChevronRight className="h-4 w-4" />
            </Button>
            {!isToday && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<RefreshCw className="h-4 w-4" />}
                onClick={() => setSelectedDate(new Date())}
              >
                {isBangla ? 'আজ' : 'Today'}
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-4 w-4 text-primary" />
            {isBangla
              ? `মোট ${stats.hours.toFixed(1)} ঘণ্টা কাজ`
              : `Total ${stats.hours.toFixed(1)}h worked`}
            <span className="hidden sm:inline text-muted-foreground/50">·</span>
            <span className="hidden sm:inline">
              {isBangla ? `${Math.round((stats.present / baseRecords.length) * 100)}% উপস্থিতির হার` : `${Math.round((stats.present / baseRecords.length) * 100)}% attendance rate`}
            </span>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <HrmStatCard title="Present" titleBn="উপস্থিত" value={String(stats.present)} icon={UserCheck} tone="emerald" index={0} />
        <HrmStatCard title="Late" titleBn="দেরি" value={String(stats.late)} icon={Clock} tone="warning" index={1} />
        <HrmStatCard title="Absent" titleBn="অনুপস্থিত" value={String(stats.absent)} icon={UserX} tone="destructive" index={2} />
        <HrmStatCard title="On Leave" titleBn="ছুটিতে" value={String(stats.leave)} icon={CalendarOff} tone="indigo" index={3} />
        <HrmStatCard title="WFH" titleBn="হোম থেকে" value={String(stats.wfh)} icon={Home} tone="sky" index={4} />
        <HrmStatCard title="Overtime" titleBn="ওভারটাইম" value={String(stats.overtime)} icon={TimerReset} tone="violet" index={5} />
      </div>

      {/* Bulk actions bar */}
      {bulkMode && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-primary/20 bg-primary-subtle/40 p-4"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-foreground mr-1 inline-flex items-center gap-2">
              <CheckCheck className="h-4 w-4 text-primary" />
              {isBangla ? 'সবাইকে চিহ্নিত করুন:' : 'Mark everyone as:'}
            </span>
            {STATUS_ACTIONS.map((s) => (
              <button
                key={s.status}
                onClick={() => markAll(s.status)}
                className={`text-xs font-semibold rounded-lg px-3 py-1.5 border border-border bg-card transition-colors ${s.tone}`}
              >
                {isBangla ? s.labelBn : s.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Filters (Relocated to the top) */}
      <Card>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10 h-9 text-xs"
              placeholder={isBangla ? 'কর্মচারী খুঁজুন…' : 'Search employee…'}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <Select
            value={branchFilter}
            onValueChange={(v) => {
              setBranchFilter(v);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder={isBangla ? 'শাখা' : 'Branch'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isBangla ? 'সব শাখা' : 'All branches'}</SelectItem>
              {HRM_BRANCHES.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={deptFilter}
            onValueChange={(v) => {
              setDeptFilter(v);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder={isBangla ? 'বিভাগ' : 'Department'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isBangla ? 'সব বিভাগ' : 'All departments'}</SelectItem>
              {DEPARTMENTS.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder={isBangla ? 'স্ট্যাটাস' : 'Status'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isBangla ? 'সব স্ট্যাটাস' : 'All statuses'}</SelectItem>
              {STATUS_ACTIONS.map((s) => (
                <SelectItem key={s.status} value={s.status}>
                  {isBangla ? s.labelBn : s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <HrmDataTable
        columns={columns}
        data={paged}
        keyField={(r) => r.id}
        skeletonRows={6}
        emptyIcon={CalendarCheck}
        emptyTitle={isBangla ? 'কোনো উপস্থিতির রেকর্ড নেই' : 'No attendance records'}
        emptyTitleBn="কোনো উপস্থিতির রেকর্ড নেই"
        emptyDescription={
          isBangla
            ? 'এই তারিখে কোনো রেকর্ড নেই। অন্য তারিখ বা ফিল্টার ব্যবহার করে দেখুন।'
            : 'No records for this date. Try a different date or filter.'
        }
        emptyDescriptionBn="এই তারিখে কোনো রেকর্ড নেই। অন্য তারিখ বা ফিল্টার ব্যবহার করে দেখুন।"
        isBangla={isBangla}
        footer={
          <HrmPagination
            currentPage={safePage}
            totalPages={totalPages}
            totalItems={records.length}
            pageSize={PAGE_SIZE}
            onPageChange={(p) => {
              setCurrentPage(p);
              setLoading(true);
              setTimeout(() => setLoading(false), 400);
            }}
          />
        }
      />

      {/* Edit Attendance Record Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <DialogHeader className="border-b pb-2">
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>{isBangla ? 'উপস্থিতি রেকর্ড সম্পাদনা' : 'Edit Attendance Record'}</span>
              </DialogTitle>
            </DialogHeader>

            {selectedEditRecord && (
              <div className="flex items-center gap-3 bg-muted/40 p-2.5 rounded-lg text-xs">
                <HrmAvatar name={selectedEditRecord.name} size="sm" />
                <div>
                  <p className="font-bold text-foreground">{selectedEditRecord.name}</p>
                  <p className="text-muted-foreground">{selectedEditRecord.department} · {branchName(selectedEditRecord.branchId)}</p>
                </div>
              </div>
            )}

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">{isBangla ? 'উপস্থিতি স্ট্যাটাস' : 'Attendance Status'}</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as AttendanceStatus)}
                  className="w-full h-9 rounded-lg border bg-background px-3 text-xs focus:outline-none"
                >
                  {STATUS_ACTIONS.map((s) => (
                    <option key={s.status} value={s.status}>
                      {isBangla ? s.labelBn : s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">{isBangla ? 'চেক-ইন সময়' : 'Check In Time'}</label>
                  <Input
                    placeholder="09:00 AM"
                    value={editCheckIn}
                    onChange={(e) => setEditCheckIn(e.target.value)}
                    className="h-9 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">{isBangla ? 'চেক-আউট সময়' : 'Check Out Time'}</label>
                  <Input
                    placeholder="05:30 PM"
                    value={editCheckOut}
                    onChange={(e) => setEditCheckOut(e.target.value)}
                    className="h-9 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">{isBangla ? 'মোট কাজের ঘণ্টা' : 'Hours Worked'}</label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="8.0"
                    value={editHours}
                    onChange={(e) => setEditHours(e.target.value)}
                    className="h-9 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">{isBangla ? 'ওভারটাইম ঘণ্টা' : 'Overtime Hours'}</label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    value={editOvertime}
                    onChange={(e) => setEditOvertime(e.target.value)}
                    className="h-9 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">{isBangla ? 'মন্তব্য / কারণ' : 'Remarks / Note'}</label>
                <Input
                  placeholder={isBangla ? 'দেরি হওয়া বা ছুটির কারণ...' : 'e.g. Traffic delays'}
                  value={editRemarks}
                  onChange={(e) => setEditRemarks(e.target.value)}
                  className="h-9"
                />
              </div>
            </div>

            <DialogFooter className="border-t pt-3">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} className="text-xs h-9">
                {isBangla ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button type="submit" className="text-xs h-9">
                {isBangla ? 'সংরক্ষণ করুন' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
