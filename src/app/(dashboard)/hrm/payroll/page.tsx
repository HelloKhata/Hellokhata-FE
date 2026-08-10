// Hello Khata OS - HRM Payroll Page
// হ্যালো খাতা - এইচআরএম বেতন পেজ

'use client';

import { useMemo, useState } from 'react';
import {
  Wallet,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  FileText,
  CheckCheck,
  XCircle,
  Loader2,
  Landmark,
  Download,
  BadgeCheck,
  Clock,
  CircleDollarSign,
  ReceiptText,
  Eye,
  TrendingUp,
  Banknote,
  Briefcase,
} from 'lucide-react';
import { Button, Input, Card, CardHeader, CardTitle } from '@/components/ui/premium';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerFooter,
} from '@/components/ui/drawer';
import { toast } from 'sonner';
import { useAppTranslation, useCurrency, useDateFormat } from '@/hooks/useAppTranslation';
import { HrmPageHeader } from '@/components/hrm/shared/HrmPageHeader';
import { HrmStatCard } from '@/components/hrm/shared/HrmStatCard';
import { HrmDataTable, type HrmColumn } from '@/components/hrm/shared/HrmDataTable';
import { HrmPagination } from '@/components/hrm/shared/HrmPagination';
import { HrmAvatar } from '@/components/hrm/shared/HrmAvatar';
import { PaymentStatusBadge } from '@/components/hrm/shared/HrmStatusBadge';
import { HrmEmptyState } from '@/components/hrm/shared/HrmEmptyState';
import { hrmPayroll, HRM_EMPLOYEES, branchName, HRM_BRANCHES } from '@/components/hrm/mock-data';
import type { PayrollRecord, PaymentStatus, PayslipLine } from '@/components/hrm/types';

const PAGE_SIZE = 8;

export default function PayrollPage() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const { formatDate } = useDateFormat();

  const [month, setMonth] = useState<Date>(() => new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [records, setRecords] = useState<PayrollRecord[]>(() => hrmPayroll());

  const [payslipTarget, setPayslipTarget] = useState<PayrollRecord | null>(null);
  const [drawerTarget, setDrawerTarget] = useState<PayrollRecord | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const monthLabel = month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return records.filter((r) => {
      if (q && !`${r.name} ${r.department} ${r.designation}`.toLowerCase().includes(q)) return false;
      if (branchFilter !== 'all' && r.branchId !== branchFilter) return false;
      if (statusFilter !== 'all' && r.paymentStatus !== statusFilter) return false;
      return true;
    });
  }, [records, searchTerm, branchFilter, statusFilter]);

  const totals = useMemo(() => {
    const basic = records.reduce((s, r) => s + r.basicSalary, 0);
    const allowance = records.reduce((s, r) => s + r.allowance, 0);
    const bonus = records.reduce((s, r) => s + r.bonus, 0);
    const deduction = records.reduce((s, r) => s + r.deduction, 0);
    const net = records.reduce((s, r) => s + r.netSalary, 0);
    const paid = records.filter((r) => r.paymentStatus === 'Paid').reduce((s, r) => s + r.netSalary, 0);
    return { basic, allowance, bonus, deduction, net, paid };
  }, [records]);

  const statusCounts = useMemo(() => {
    const count: Record<PaymentStatus, number> = { Paid: 0, Pending: 0, Processing: 0, Failed: 0 };
    records.forEach((r) => count[r.paymentStatus]++);
    return count;
  }, [records]);

  const shiftMonth = (delta: number) => {
    const d = new Date(month);
    d.setMonth(d.getMonth() + delta);
    setMonth(d);
    setCurrentPage(1);
    setLoading(true);
    setTimeout(() => {
      setRecords(hrmPayroll(d));
      setLoading(false);
    }, 400);
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      toast.success(
        isBangla
          ? `${monthLabel} এর বেতন প্রস্তুত হয়েছে`
          : `${monthLabel} payroll generated successfully`
      );
    }, 900);
  };

  const markPaid = (id: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              paymentStatus: 'Paid' as PaymentStatus,
              paymentDate: new Date().toISOString().slice(0, 10),
              paymentMethod: 'bKash',
            }
          : r
      )
    );
    toast.success(isBangla ? 'বেতন পরিশোধিত হিসেবে চিহ্নিত হয়েছে' : 'Marked as paid');
  };

  const payslipLines = (r: PayrollRecord): PayslipLine[] => [
    { label: 'Basic Salary', labelBn: 'মূল বেতন', amount: r.basicSalary, type: 'earning' },
    { label: 'House Rent Allowance', labelBn: 'ভাড়া ভাতা', amount: r.allowance, type: 'earning' },
    { label: 'Performance Bonus', labelBn: 'পারফরম্যান্স বোনাস', amount: r.bonus, type: 'earning' },
    { label: 'Tax & Other Deduction', labelBn: 'কর ও অন্যান্য কর্তন', amount: r.deduction, type: 'deduction' },
  ];

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const columns: HrmColumn<PayrollRecord>[] = [
    {
      key: 'employee',
      header: isBangla ? 'কর্মচারী' : 'Employee',
      render: (r) => (
        <div className="flex items-center gap-3">
          <HrmAvatar name={r.name} size="sm" />
          <div className="min-w-0">
            <p className="font-medium text-foreground text-sm truncate max-w-[150px]">{r.name}</p>
            <p className="text-xs text-muted-foreground truncate">{r.designation}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      header: isBangla ? 'বিভাগ' : 'Department',
      render: (r) => (
        <div>
          <p className="text-sm text-foreground whitespace-nowrap">{r.department}</p>
          <p className="text-xs text-muted-foreground whitespace-nowrap">{branchName(r.branchId)}</p>
        </div>
      ),
    },
    {
      key: 'basic',
      header: isBangla ? 'মূল' : 'Basic',
      align: 'right',
      render: (r) => <span className="text-sm text-muted-foreground tabular-nums whitespace-nowrap">{formatCurrency(r.basicSalary)}</span>,
    },
    {
      key: 'allowance',
      header: isBangla ? 'ভাতা' : 'Allowance',
      align: 'right',
      render: (r) => <span className="text-sm text-muted-foreground tabular-nums whitespace-nowrap">{formatCurrency(r.allowance + r.bonus)}</span>,
    },
    {
      key: 'deduction',
      header: isBangla ? 'কর্তন' : 'Deduction',
      align: 'right',
      render: (r) => <span className="text-sm text-destructive tabular-nums whitespace-nowrap">-{formatCurrency(r.deduction)}</span>,
    },
    {
      key: 'net',
      header: isBangla ? 'নিট' : 'Net Pay',
      align: 'right',
      render: (r) => <span className="text-sm font-semibold text-foreground tabular-nums whitespace-nowrap">{formatCurrency(r.netSalary)}</span>,
    },
    {
      key: 'status',
      header: isBangla ? 'স্ট্যাটাস' : 'Status',
      align: 'center',
      render: (r) => <PaymentStatusBadge status={r.paymentStatus} />,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1" onClick={(ev) => ev.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Payslip"
            onClick={() => setPayslipTarget(r)}
          >
            <ReceiptText className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Breakdown"
            onClick={() => {
              setDrawerTarget(r);
              setDrawerOpen(true);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {r.paymentStatus !== 'Paid' && (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Mark paid"
              onClick={() => markPaid(r.id)}
            >
              <CheckCheck className="h-4 w-4 text-emerald" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <HrmPageHeader
        title={isBangla ? 'বেতন ব্যবস্থাপনা' : 'Payroll Management'}
        titleBn="বেতন ব্যবস্থাপনা"
        subtitle={isBangla ? 'মাসিক বেতন প্রস্তুত, পরিশোধ ও পে-স্লিপ পরিচালনা করুন।' : 'Generate, pay and manage monthly payroll and payslips.'}
        subtitleBn="মাসিক বেতন প্রস্তুত, পরিশোধ ও পে-স্লিপ পরিচালনা করুন।"
        icon={Wallet}
        breadcrumbs={[{ label: isBangla ? 'বেতন' : 'Payroll', labelBn: 'বেতন' }]}
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
              leftIcon={generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              onClick={handleGenerate}
              isLoading={generating}
            >
              {isBangla ? 'বেতন প্রস্তুত' : 'Generate Payroll'}
            </Button>
          </>
        }
      />

      {/* Month navigation */}
      <Card padding="lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => shiftMonth(-1)} aria-label="Previous month">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-base font-semibold text-foreground tabular-nums min-w-[140px] text-center">
              {isBangla
                ? month.toLocaleDateString('bn-BD', { month: 'long', year: 'numeric' })
                : monthLabel}
            </span>
            <Button variant="outline" size="icon" onClick={() => shiftMonth(1)} aria-label="Next month">
              <ChevronRight className="h-4 w-4" />
            </Button>
            {month.toDateString() !== new Date().toDateString() && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const now = new Date();
                  setMonth(now);
                  setRecords(hrmPayroll(now));
                }}
              >
                {isBangla ? 'এই মাস' : 'This month'}
              </Button>
            )}
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <Landmark className="h-4 w-4 text-primary" />
            {isBangla
              ? `${HRM_EMPLOYEES.length} জন কর্মচারী · ${formatCurrency(totals.net)} মোট`
              : `${HRM_EMPLOYEES.length} employees · ${formatCurrency(totals.net)} total`}
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <HrmStatCard
          title="Gross Payroll"
          titleBn="মোট বেতন"
          value={formatCurrency(totals.basic + totals.allowance + totals.bonus)}
          icon={CircleDollarSign}
          tone="indigo"
          trend={{ value: 3.4, isPositive: true }}
          index={0}
        />
        <HrmStatCard
          title="Net Payable"
          titleBn="নিট প্রদেয়"
          value={formatCurrency(totals.net)}
          icon={Banknote}
          tone="emerald"
          index={1}
        />
        <HrmStatCard
          title="Paid"
          titleBn="পরিশোধিত"
          value={formatCurrency(totals.paid)}
          icon={BadgeCheck}
          tone="sky"
          caption={`${statusCounts.Paid} employees paid`}
          captionBn={`${statusCounts.Paid} জনের বেতন পরিশোধিত`}
          index={2}
        />
        <HrmStatCard
          title="Total Deductions"
          titleBn="মোট কর্তন"
          value={formatCurrency(totals.deduction)}
          icon={TrendingUp}
          tone="destructive"
          index={3}
        />
      </div>

      {/* Status counts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatusMiniCard label={isBangla ? 'পরিশোধিত' : 'Paid'} count={statusCounts.Paid} tone="text-emerald" />
        <StatusMiniCard label={isBangla ? 'অপেক্ষমাণ' : 'Pending'} count={statusCounts.Pending} tone="text-warning" />
        <StatusMiniCard label={isBangla ? 'প্রক্রিয়াধীন' : 'Processing'} count={statusCounts.Processing} tone="text-primary" />
        <StatusMiniCard label={isBangla ? 'ব্যর্থ' : 'Failed'} count={statusCounts.Failed} tone="text-destructive" />
      </div>

      {/* Payroll table */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 px-5 pt-5">
          <div>
            <CardTitle className="text-base">{isBangla ? 'বেতন তালিকা' : 'Payroll List'}</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isBangla ? `${filtered.length} জন কর্মচারীর রেকর্ড` : `${filtered.length} employee record(s)`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative hidden md:block w-56">
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
              value={branchFilter}
              onValueChange={(v) => {
                setBranchFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[140px]">
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
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder={isBangla ? 'স্ট্যাটাস' : 'Status'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isBangla ? 'সব স্ট্যাটাস' : 'All statuses'}</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <div className="px-5 pt-3">
          <HrmDataTable
            columns={columns}
            data={paged}
            keyField={(r) => r.id}
            loading={loading}
            skeletonRows={6}
            emptyIcon={Wallet}
            emptyTitle={isBangla ? 'কোনো রেকর্ড নেই' : 'No payroll records'}
            emptyTitleBn="কোনো রেকর্ড নেই"
            emptyDescription={isBangla ? 'এই মাসের বেতন এখনো প্রস্তুত হয়নি।' : 'Payroll for this month has not been generated yet.'}
            emptyDescriptionBn="এই মাসের বেতন এখনো প্রস্তুত হয়নি।"
            emptyAction={
              <Button leftIcon={<Plus className="h-4 w-4" />} onClick={handleGenerate}>
                {isBangla ? 'বেতন প্রস্তুত' : 'Generate Payroll'}
              </Button>
            }
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

      {/* Payslip Dialog */}
      <Dialog open={!!payslipTarget} onOpenChange={(o) => !o && setPayslipTarget(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
          {payslipTarget && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {isBangla ? 'পে-স্লিপ' : 'Payslip'} — {monthLabel}
                </DialogTitle>
              </DialogHeader>

              <div className="rounded-2xl border border-[rgba(255,255,255,0.04)] bg-gradient-to-b from-card to-card/60 p-5 space-y-5">
                <div className="flex items-center gap-3">
                  <HrmAvatar name={payslipTarget.name} size="lg" />
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">{payslipTarget.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {payslipTarget.designation} · {payslipTarget.department}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{branchName(payslipTarget.branchId)}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {payslipLines(payslipTarget).map((l) => (
                    <div key={l.label} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{isBangla ? l.labelBn : l.label}</span>
                      <span className={l.type === 'deduction' ? 'text-destructive font-medium tabular-nums' : 'text-foreground font-medium tabular-nums'}>
                        {l.type === 'deduction' ? '- ' : '+ '}
                        {formatCurrency(l.amount)}
                      </span>
                    </div>
                  ))}
                  <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                  <div className="flex items-center justify-between text-base font-bold text-foreground">
                    <span>{isBangla ? 'নিট বেতন' : 'Net Pay'}</span>
                    <span className="tabular-nums">{formatCurrency(payslipTarget.netSalary)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs">
                  <span className="text-muted-foreground">{isBangla ? 'স্ট্যাটাস' : 'Status'}</span>
                  <PaymentStatusBadge status={payslipTarget.paymentStatus} />
                </div>
                {payslipTarget.paymentDate && (
                  <p className="text-[11px] text-muted-foreground text-right">
                    {isBangla ? `পরিশোধিত: ${formatDate(payslipTarget.paymentDate)}` : `Paid on ${formatDate(payslipTarget.paymentDate)}`}
                  </p>
                )}
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <DialogClose asChild>
                  <Button variant="outline">{isBangla ? 'বন্ধ করুন' : 'Close'}</Button>
                </DialogClose>
                <Button
                  leftIcon={<Download className="h-4 w-4" />}
                  onClick={() => toast.success(isBangla ? 'পে-স্লিপ ডাউনলোড হয়েছে' : 'Payslip downloaded')}
                >
                  {isBangla ? 'ডাউনলোড' : 'Download'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Salary Breakdown Drawer */}
      <Drawer direction="right" open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="w-full max-w-md">
          {drawerTarget && (
            <>
              <DrawerHeader className="border-b border-border px-5 pb-4">
                <div className="flex items-center gap-3">
                  <HrmAvatar name={drawerTarget.name} size="lg" />
                  <div className="min-w-0 flex-1">
                    <DrawerTitle className="text-lg font-semibold text-foreground truncate">
                      {drawerTarget.name}
                    </DrawerTitle>
                    <p className="text-sm text-muted-foreground">
                      {drawerTarget.designation} · {monthLabel}
                    </p>
                  </div>
                  <DrawerClose asChild>
                    <Button variant="ghost" size="icon-sm">
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </DrawerClose>
                </div>
              </DrawerHeader>

              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                <BreakdownRow
                  icon={Banknote}
                  label={isBangla ? 'মূল বেতন' : 'Basic Salary'}
                  value={formatCurrency(drawerTarget.basicSalary)}
                  tone="text-primary"
                />
                <BreakdownRow
                  icon={Briefcase}
                  label={isBangla ? 'ভাড়া ও অন্যান্য ভাতা' : 'House Rent & Allowance'}
                  value={`+ ${formatCurrency(drawerTarget.allowance)}`}
                  tone="text-emerald"
                />
                <BreakdownRow
                  icon={BadgeCheck}
                  label={isBangla ? 'বোনাস' : 'Performance Bonus'}
                  value={`+ ${formatCurrency(drawerTarget.bonus)}`}
                  tone="text-emerald"
                />
                <BreakdownRow
                  icon={Clock}
                  label={isBangla ? 'কর ও কর্তন' : 'Tax & Deductions'}
                  value={`- ${formatCurrency(drawerTarget.deduction)}`}
                  tone="text-destructive"
                />
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{isBangla ? 'নিট বেতন' : 'Net Salary'}</span>
                  <span className="text-lg font-bold text-foreground tabular-nums">{formatCurrency(drawerTarget.netSalary)}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-muted-foreground">{isBangla ? 'পরিশোধের অবস্থা' : 'Payment Status'}</span>
                  <PaymentStatusBadge status={drawerTarget.paymentStatus} />
                </div>
              </div>

              <DrawerFooter className="border-t border-border px-5 py-4 flex-row gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  leftIcon={<ReceiptText className="h-4 w-4" />}
                  onClick={() => {
                    setDrawerOpen(false);
                    setPayslipTarget(drawerTarget);
                  }}
                >
                  {isBangla ? 'পে-স্লিপ' : 'Payslip'}
                </Button>
                {drawerTarget.paymentStatus !== 'Paid' && (
                  <Button
                    className="flex-1"
                    leftIcon={<CheckCheck className="h-4 w-4" />}
                    onClick={() => {
                      markPaid(drawerTarget.id);
                      setDrawerOpen(false);
                    }}
                  >
                    {isBangla ? 'পরিশোধ করুন' : 'Mark Paid'}
                  </Button>
                )}
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}

function StatusMiniCard({ label, count, tone }: { label: string; count: number; tone: string }) {
  return (
    <Card padding="lg" className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-xl font-bold tabular-nums ${tone}`}>{count}</span>
    </Card>
  );
}

function BreakdownRow({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-[rgba(255,255,255,0.04)] bg-muted/20 p-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-9 w-9 rounded-lg bg-muted/40 flex items-center justify-center shrink-0">
          <Icon className={`h-4 w-4 ${tone}`} />
        </div>
        <span className="text-sm text-foreground font-medium">{label}</span>
      </div>
      <span className={`text-sm font-semibold tabular-nums ${tone}`}>{value}</span>
    </div>
  );
}
