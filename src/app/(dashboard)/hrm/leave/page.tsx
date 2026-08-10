// Hello Khata OS - HRM Leave Page
// হ্যালো খাতা - এইচআরএম ছুটি পেজ

'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarOff,
  Plus,
  Search,
  Check,
  X,
  CalendarPlus,
  Clock,
  CalendarCheck,
  Ban,
  Inbox,
  Umbrella,
  BriefcaseMedical,
  Palmtree,
  Baby,
  CircleDollarSign,
} from 'lucide-react';
import { Button, Input, Card, CardHeader, CardTitle } from '@/components/ui/premium';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAppTranslation, useDateFormat } from '@/hooks/useAppTranslation';
import { HrmPageHeader } from '@/components/hrm/shared/HrmPageHeader';
import { HrmStatCard } from '@/components/hrm/shared/HrmStatCard';
import { HrmDataTable, type HrmColumn } from '@/components/hrm/shared/HrmDataTable';
import { HrmPagination } from '@/components/hrm/shared/HrmPagination';
import { HrmAvatar } from '@/components/hrm/shared/HrmAvatar';
import { LeaveStatusBadge } from '@/components/hrm/shared/HrmStatusBadge';
import { HrmEmptyState } from '@/components/hrm/shared/HrmEmptyState';
import { HRM_LEAVES, HRM_LEAVE_BALANCES, HRM_EMPLOYEES, branchName } from '@/components/hrm/mock-data';
import type { LeaveRequest, LeaveType, LeaveStatus } from '@/components/hrm/types';
import { Progress } from '@/components/ui/premium';

const PAGE_SIZE = 8;

const LEAVE_TYPE_ICONS: Record<LeaveType, { icon: React.ComponentType<{ className?: string }>; tone: string }> = {
  Casual: { icon: Umbrella, tone: 'text-emerald bg-emerald-subtle' },
  Sick: { icon: BriefcaseMedical, tone: 'text-rose-400 bg-rose-400/10' },
  Annual: { icon: Palmtree, tone: 'text-primary bg-primary-subtle' },
  Maternity: { icon: Baby, tone: 'text-violet-400 bg-violet-400/10' },
  Paternity: { icon: Baby, tone: 'text-sky-400 bg-sky-400/10' },
  Unpaid: { icon: CircleDollarSign, tone: 'text-warning bg-warning-subtle' },
};

export default function LeavePage() {
  const { isBangla } = useAppTranslation();
  const { formatDate } = useDateFormat();

  const [requests, setRequests] = useState<LeaveRequest[]>(HRM_LEAVES);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return requests.filter((l) => {
      if (q && !`${l.name} ${l.department}`.toLowerCase().includes(q)) return false;
      if (typeFilter !== 'all' && l.type !== typeFilter) return false;
      if (statusFilter !== 'all' && l.status !== statusFilter) return false;
      return true;
    });
  }, [requests, searchTerm, typeFilter, statusFilter]);

  const pending = requests.filter((l) => l.status === 'Pending');
  const approved = requests.filter((l) => l.status === 'Approved');
  const rejected = requests.filter((l) => l.status === 'Rejected');

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const decide = (id: string, status: 'Approved' | 'Rejected') => {
    setRequests((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, status, reviewedBy: 'HR Manager', reviewedOn: new Date().toISOString().slice(0, 10) }
          : l
      )
    );
    toast.success(
      status === 'Approved'
        ? isBangla
          ? 'ছুটির আবেদন অনুমোদিত হয়েছে'
          : 'Leave request approved'
        : isBangla
          ? 'ছুটির আবেদন বাতিল হয়েছে'
          : 'Leave request rejected'
    );
  };

  const leaveTypes: LeaveType[] = ['Casual', 'Sick', 'Annual', 'Maternity', 'Paternity', 'Unpaid'];

  const columns: HrmColumn<LeaveRequest>[] = [
    {
      key: 'employee',
      header: isBangla ? 'কর্মচারী' : 'Employee',
      render: (l) => (
        <div className="flex items-center gap-3">
          <HrmAvatar name={l.name} size="sm" />
          <div className="min-w-0">
            <p className="font-medium text-foreground text-sm truncate max-w-[150px]">{l.name}</p>
            <p className="text-xs text-muted-foreground">{l.department}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: isBangla ? 'ধরন' : 'Type',
      render: (l) => {
        const meta = LEAVE_TYPE_ICONS[l.type];
        return (
          <span className="inline-flex items-center gap-2">
            <span className={`h-7 w-7 rounded-lg flex items-center justify-center ${meta.tone}`}>
              <meta.icon className="h-3.5 w-3.5" />
            </span>
            <span className="text-sm text-foreground whitespace-nowrap">{l.type}</span>
          </span>
        );
      },
    },
    {
      key: 'duration',
      header: isBangla ? 'সময়কাল' : 'Duration',
      render: (l) => (
        <div className="min-w-0">
          <p className="text-sm text-foreground tabular-nums whitespace-nowrap">
            {formatDate(l.from)} → {formatDate(l.to)}
          </p>
          <p className="text-xs text-muted-foreground">
            {l.days} {isBangla ? 'দিন' : 'days'}
          </p>
        </div>
      ),
    },
    {
      key: 'branch',
      header: isBangla ? 'শাখা' : 'Branch',
      render: (l) => <span className="text-sm text-muted-foreground whitespace-nowrap">{branchName(l.branchId)}</span>,
    },
    {
      key: 'reason',
      header: isBangla ? 'কারণ' : 'Reason',
      render: (l) => <span className="text-sm text-muted-foreground truncate max-w-[200px] block">{l.reason}</span>,
    },
    {
      key: 'status',
      header: isBangla ? 'স্ট্যাটাস' : 'Status',
      align: 'center',
      render: (l) => <LeaveStatusBadge status={l.status} />,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (l) =>
        l.status === 'Pending' ? (
          <div className="flex items-center justify-end gap-1.5" onClick={(ev) => ev.stopPropagation()}>
            <button
              onClick={() => decide(l.id, 'Approved')}
              className="h-7 w-7 rounded-lg inline-flex items-center justify-center bg-success-subtle text-success hover:bg-success/20 transition-colors"
              aria-label="Approve"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={() => decide(l.id, 'Rejected')}
              className="h-7 w-7 rounded-lg inline-flex items-center justify-center bg-destructive-subtle text-destructive hover:bg-destructive/20 transition-colors"
              aria-label="Reject"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {l.reviewedBy ? `by ${l.reviewedBy}` : '—'}
          </span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <HrmPageHeader
        title={isBangla ? 'ছুটি ব্যবস্থাপনা' : 'Leave Management'}
        titleBn="ছুটি ব্যবস্থাপনা"
        subtitle={isBangla ? 'ছুটির আবেদন দেখুন, অনুমোদন করুন ও ব্যালেন্স ট্র্যাক করুন।' : 'Review, approve and track leave requests and balances.'}
        subtitleBn="ছুটির আবেদন দেখুন, অনুমোদন করুন ও ব্যালেন্স ট্র্যাক করুন।"
        icon={CalendarOff}
        breadcrumbs={[{ label: isBangla ? 'ছুটি' : 'Leave', labelBn: 'ছুটি' }]}
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setApplyOpen(true)}>
            {isBangla ? 'ছুটির আবেদন' : 'Apply Leave'}
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <HrmStatCard title="Total Requests" titleBn="মোট আবেদন" value={String(requests.length)} icon={CalendarOff} tone="indigo" index={0} />
        <HrmStatCard title="Pending" titleBn="অপেক্ষমাণ" value={String(pending.length)} icon={Clock} tone="warning" caption="needs review" captionBn="পর্যালোচনা প্রয়োজন" index={1} />
        <HrmStatCard title="Approved" titleBn="অনুমোদিত" value={String(approved.length)} icon={CalendarCheck} tone="emerald" index={2} />
        <HrmStatCard title="Rejected" titleBn="বাতিল" value={String(rejected.length)} icon={Ban} tone="destructive" index={3} />
      </div>

      {/* Pending approvals */}
      {pending.length > 0 && (
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 px-5 pt-5">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Inbox className="h-4 w-4 text-warning" />
                {isBangla ? 'অনুমোদন প্রয়োজন' : 'Pending Approvals'}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isBangla ? `${pending.length} টি আবেদন পর্যালোচনার অপেক্ষায়` : `${pending.length} request(s) awaiting review`}
              </p>
            </div>
          </CardHeader>
          <div className="px-5 pb-5 pt-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {pending.slice(0, 3).map((l) => {
              const meta = LEAVE_TYPE_ICONS[l.type];
              return (
                <motion.div
                  key={l.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-[rgba(255,255,255,0.04)] bg-muted/20 p-4"
                >
                  <div className="flex items-center gap-3">
                    <HrmAvatar name={l.name} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{l.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {l.type} · {l.days} {isBangla ? 'দিন' : 'days'}
                      </p>
                    </div>
                    <span className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${meta.tone}`}>
                      <meta.icon className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 leading-snug line-clamp-2">{l.reason}</p>
                  <p className="text-[11px] text-muted-foreground mt-2 tabular-nums">
                    {formatDate(l.from)} → {formatDate(l.to)}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => decide(l.id, 'Approved')}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 rounded-lg text-xs font-semibold bg-success-subtle text-success hover:bg-success/20 transition-colors"
                    >
                      <Check className="h-3.5 w-3.5" />
                      {isBangla ? 'অনুমোদন' : 'Approve'}
                    </button>
                    <button
                      onClick={() => decide(l.id, 'Rejected')}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 rounded-lg text-xs font-semibold bg-destructive-subtle text-destructive hover:bg-destructive/20 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                      {isBangla ? 'বাতিল' : 'Reject'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Leave balances */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">
          {isBangla ? 'ছুটির ব্যালেন্স' : 'Leave Balances'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {HRM_LEAVE_BALANCES.map((b) => {
            const meta = LEAVE_TYPE_ICONS[b.type];
            const pct = Math.min(100, (b.used / b.total) * 100);
            return (
              <Card key={b.type} padding="lg">
                <div className="flex items-center gap-2.5 mb-2">
                  <span className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${meta.tone}`}>
                    <meta.icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{b.type}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {b.used} / {b.total} {isBangla ? 'ব্যবহৃত' : 'used'}
                    </p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground tabular-nums">
                  {b.remaining}
                  <span className="text-xs font-medium text-muted-foreground ml-1">{isBangla ? 'অবশিষ্ট' : 'left'}</span>
                </p>
                <div className="mt-2">
                  <Progress value={pct} size="sm" color={pct > 75 ? 'warning' : 'indigo'} />
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Requests table */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 px-5 pt-5">
          <div>
            <CardTitle className="text-base">{isBangla ? 'ছুটির আবেদনসমূহ' : 'Leave Requests'}</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isBangla ? 'সব আবেদনের ইতিহাস' : 'All request history'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder={isBangla ? 'খুঁজুন…' : 'Search…'}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <Select
              value={typeFilter}
              onValueChange={(v) => {
                setTypeFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder={isBangla ? 'ধরন' : 'Type'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isBangla ? 'সব ধরন' : 'All types'}</SelectItem>
                {leaveTypes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
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
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder={isBangla ? 'স্ট্যাটাস' : 'Status'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isBangla ? 'সব স্ট্যাটাস' : 'All statuses'}</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <div className="px-5 pt-3">
          <HrmDataTable
            columns={columns}
            data={paged}
            keyField={(l) => l.id}
            skeletonRows={6}
            emptyIcon={CalendarOff}
            emptyTitle={isBangla ? 'কোনো আবেদন পাওয়া যায়নি' : 'No leave requests found'}
            emptyTitleBn="কোনো আবেদন পাওয়া যায়নি"
            emptyDescription={isBangla ? 'অন্য ফিল্টার ব্যবহার করুন বা নতুন আবেদন করুন।' : 'Try different filters or apply for a new leave.'}
            emptyDescriptionBn="অন্য ফিল্টার ব্যবহার করুন বা নতুন আবেদন করুন।"
            isBangla={isBangla}
            footer={
              <HrmPagination
                currentPage={safePage}
                totalPages={totalPages}
                totalItems={filtered.length}
                pageSize={PAGE_SIZE}
                onPageChange={(p) => {
                  setCurrentPage(p);
                  setLoading(true);
                  setTimeout(() => setLoading(false), 400);
                }}
              />
            }
          />
        </div>
      </Card>

      {/* Apply Leave Dialog */}
      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarPlus className="h-5 w-5 text-primary" />
              {isBangla ? 'নতুন ছুটির আবেদন' : 'Apply for Leave'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>{isBangla ? 'কর্মচারী *' : 'Employee *'}</Label>
              <Select defaultValue={HRM_EMPLOYEES[0].id}>
                <SelectTrigger>
                  <SelectValue placeholder={isBangla ? 'কর্মচারী নির্বাচন' : 'Select employee'} />
                </SelectTrigger>
                <SelectContent>
                  {HRM_EMPLOYEES.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{isBangla ? 'ছুটির ধরন *' : 'Leave Type *'}</Label>
              <Select defaultValue="Casual">
                <SelectTrigger>
                  <SelectValue placeholder={isBangla ? 'ধরন নির্বাচন' : 'Select type'} />
                </SelectTrigger>
                <SelectContent>
                  {leaveTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="leave-days">{isBangla ? 'দিন সংখ্যা *' : 'Number of Days *'}</Label>
              <Input id="leave-days" type="number" defaultValue={1} min={1} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="leave-from">{isBangla ? 'শুরুর তারিখ *' : 'From Date *'}</Label>
              <Input id="leave-from" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="leave-to">{isBangla ? 'শেষ তারিখ *' : 'To Date *'}</Label>
              <Input id="leave-to" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="leave-reason">{isBangla ? 'কারণ *' : 'Reason *'}</Label>
              <textarea
                id="leave-reason"
                rows={3}
                className="flex w-full rounded-lg border border-border-subtle bg-input px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all duration-200 resize-none"
                placeholder={isBangla ? 'ছুটির কারণ লিখুন…' : 'Write the reason for your leave…'}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="outline">{isBangla ? 'বাতিল' : 'Cancel'}</Button>
            </DialogClose>
            <Button
              onClick={() => {
                setApplyOpen(false);
                toast.success(isBangla ? 'ছুটির আবেদন জমা হয়েছে' : 'Leave request submitted');
              }}
            >
              {isBangla ? 'জমা দিন' : 'Submit Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
