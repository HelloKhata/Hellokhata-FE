// Hello Khata OS - HRM Attendance Summary Page
// হ্যালো খাতা - এইচআরএম উপস্থিতি সারাংশ পেজ

'use client';

import { useMemo, useState } from 'react';
import {
  CalendarCheck,
  Download,
  Users,
  TrendingUp,
  TrendingDown,
  TimerReset,
  BarChart3,
  UserX,
  Medal,
  Building2,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Card, CardHeader, CardTitle, Button, Progress } from '@/components/ui/premium';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAppTranslation, useDateFormat } from '@/hooks/useAppTranslation';
import { HrmPageHeader } from '@/components/hrm/shared/HrmPageHeader';
import { HrmStatCard } from '@/components/hrm/shared/HrmStatCard';
import { HrmAvatar } from '@/components/hrm/shared/HrmAvatar';
import { HrmDataTable, type HrmColumn } from '@/components/hrm/shared/HrmDataTable';
import {
  generateAttendanceHistory,
  HRM_BRANCHES,
  HRM_EMPLOYEES,
  branchName,
  departmentDistribution,
} from '@/components/hrm/mock-data';
import type { DepartmentDist } from '@/components/hrm/types';

export default function AttendanceSummaryPage() {
  const { isBangla } = useAppTranslation();
  const { formatDate } = useDateFormat();

  const records = useMemo(() => generateAttendanceHistory(30), []);
  const workingDays = useMemo(
    () => Array.from(new Set(records.map((r) => r.date))),
    [records]
  );

  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  const aggregates = useMemo(() => {
    const total = records.length;
    const present = records.filter((r) => r.status === 'Present' || r.status === 'Overtime').length;
    const late = records.filter((r) => r.status === 'Late').length;
    const absent = records.filter((r) => r.status === 'Absent').length;
    const leave = records.filter((r) => r.status === 'Leave').length;
    const wfh = records.filter((r) => r.status === 'Work From Home').length;
    const overtime = records.reduce((s, r) => s + r.overtimeHours, 0);
    const hours = records.reduce((s, r) => s + r.hoursWorked, 0);
    const rate = total ? ((present + wfh) / total) * 100 : 0;
    return { total, present, late, absent, leave, wfh, overtime, hours, rate };
  }, [records]);

  // Per employee summary
  const perEmployee = useMemo(() => {
    return HRM_EMPLOYEES.map((e) => {
      const recs = records.filter((r) => r.employeeId === e.id);
      const present = recs.filter((r) => r.status === 'Present' || r.status === 'Overtime' || r.status === 'Work From Home').length;
      const absent = recs.filter((r) => r.status === 'Absent').length;
      const late = recs.filter((r) => r.status === 'Late').length;
      const leave = recs.filter((r) => r.status === 'Leave').length;
      const hours = recs.reduce((s, r) => s + r.hoursWorked, 0);
      const rate = recs.length ? (present / recs.length) * 100 : 0;
      return { ...e, present, absent, late, leave, hours, rate };
    });
  }, [records]);

  const bestEmployee = useMemo(
    () => [...perEmployee].sort((a, b) => b.rate - a.rate)[0],
    [perEmployee]
  );
  const worstEmployee = useMemo(
    () => [...perEmployee].sort((a, b) => a.rate - b.rate)[0],
    [perEmployee]
  );

  // Per branch summary
  const perBranch = useMemo(() => {
    return HRM_BRANCHES.map((b) => {
      const recs = records.filter((r) => r.branchId === b.id);
      const present = recs.filter((r) => r.status === 'Present' || r.status === 'Overtime' || r.status === 'Work From Home').length;
      const absent = recs.filter((r) => r.status === 'Absent').length;
      const late = recs.filter((r) => r.status === 'Late').length;
      const rate = recs.length ? (present / recs.length) * 100 : 0;
      return { id: b.id, name: b.name, present, absent, late, total: recs.length, rate };
    });
  }, [records]);

  // Daily trend for chart
  const dailyTrend = useMemo(() => {
    return workingDays.map((date) => {
      const recs = records.filter((r) => r.date === date);
      const present = recs.filter((r) => r.status === 'Present' || r.status === 'Overtime' || r.status === 'Work From Home').length;
      const absent = recs.filter((r) => r.status === 'Absent').length;
      const late = recs.filter((r) => r.status === 'Late').length;
      return {
        date: formatDate(date).slice(0, 6),
        present,
        absent,
        late,
      };
    });
  }, [records, workingDays, formatDate]);

  const deptDist = useMemo<DepartmentDist[]>(() => departmentDistribution(), []);
  const deptRate = useMemo(() => {
    return deptDist.map((d) => {
      const recs = records.filter((r) => r.department === d.name);
      const present = recs.filter((r) => r.status === 'Present' || r.status === 'Overtime' || r.status === 'Work From Home').length;
      return { ...d, rate: recs.length ? (present / recs.length) * 100 : 0 };
    });
  }, [deptDist, records]);

  const branchColumns: HrmColumn<(typeof perBranch)[number]>[] = [
    {
      key: 'branch',
      header: isBangla ? 'শাখা' : 'Branch',
      render: (b) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-muted/40 flex items-center justify-center shrink-0">
            <Building2 className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium text-foreground text-sm">{b.name}</span>
        </div>
      ),
    },
    {
      key: 'present',
      header: isBangla ? 'উপস্থিত' : 'Present',
      align: 'right',
      render: (b) => <span className="text-sm text-emerald font-medium tabular-nums">{b.present}</span>,
    },
    {
      key: 'late',
      header: isBangla ? 'দেরি' : 'Late',
      align: 'right',
      render: (b) => <span className="text-sm text-warning font-medium tabular-nums">{b.late}</span>,
    },
    {
      key: 'absent',
      header: isBangla ? 'অনুপস্থিত' : 'Absent',
      align: 'right',
      render: (b) => <span className="text-sm text-destructive font-medium tabular-nums">{b.absent}</span>,
    },
    {
      key: 'rate',
      header: isBangla ? 'হার' : 'Rate',
      render: (b) => (
        <div className="flex items-center gap-3">
          <Progress value={b.rate} size="sm" color={b.rate >= 90 ? 'emerald' : b.rate >= 80 ? 'indigo' : 'warning'} className="w-24" />
          <span className="text-sm font-semibold text-foreground tabular-nums w-12">{b.rate.toFixed(1)}%</span>
        </div>
      ),
    },
  ];

  const deptColumns: HrmColumn<(typeof deptRate)[number]>[] = [
    {
      key: 'dept',
      header: isBangla ? 'বিভাগ' : 'Department',
      render: (d) => <span className="font-medium text-foreground text-sm">{d.name}</span>,
    },
    {
      key: 'count',
      header: isBangla ? 'কর্মচারী' : 'Employees',
      align: 'right',
      render: (d) => <span className="text-sm text-muted-foreground tabular-nums">{d.value}</span>,
    },
    {
      key: 'rate',
      header: isBangla ? 'উপস্থিতির হার' : 'Attendance Rate',
      render: (d) => (
        <div className="flex items-center gap-3">
          <Progress value={d.rate} size="sm" color={d.rate >= 90 ? 'emerald' : 'indigo'} className="w-24" />
          <span className="text-sm font-semibold text-foreground tabular-nums w-12">{d.rate.toFixed(1)}%</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <HrmPageHeader
        title={isBangla ? 'উপস্থিতির সারাংশ' : 'Attendance Summary'}
        titleBn="উপস্থিতির সারাংশ"
        subtitle={isBangla ? 'শাখা, বিভাগ ও কর্মচারীভিত্তিক উপস্থিতি বিশ্লেষণ।' : 'Analyze attendance across branches, departments and employees.'}
        subtitleBn="শাখা, বিভাগ ও কর্মচারীভিত্তিক উপস্থিতি বিশ্লেষণ।"
        icon={BarChart3}
        breadcrumbs={[{ label: isBangla ? 'উপস্থিতির সারাংশ' : 'Attendance Summary', labelBn: 'উপস্থিতির সারাংশ' }]}
        actions={
          <Button
            variant="outline"
            leftIcon={<Download className="h-4 w-4" />}
            onClick={() => toast.success(isBangla ? 'রিপোর্ট রপ্তানি হয়েছে' : 'Report exported')}
          >
            {isBangla ? 'রিপোর্ট ডাউনলোড' : 'Download Report'}
          </Button>
        }
      />

      {/* Period selector */}
      <Tabs value={period} onValueChange={(v) => setPeriod(v as 'daily' | 'weekly' | 'monthly')}>
        <TabsList>
          <TabsTrigger value="daily">{isBangla ? 'দৈনিক' : 'Daily'}</TabsTrigger>
          <TabsTrigger value="weekly">{isBangla ? 'সাপ্তাহিক' : 'Weekly'}</TabsTrigger>
          <TabsTrigger value="monthly">{isBangla ? 'মাসিক' : 'Monthly'}</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <HrmStatCard
          title="Avg Attendance Rate"
          titleBn="গড় উপস্থিতির হার"
          value={aggregates.rate.toFixed(1)}
          suffix="%"
          icon={CalendarCheck}
          tone="emerald"
          trend={{ value: aggregates.rate >= 85 ? 2.4 : -1.2, isPositive: aggregates.rate >= 85 }}
          caption={`${workingDays.length} working days`}
          captionBn={`${workingDays.length} কর্মদিবস`}
          index={0}
        />
        <HrmStatCard
          title="Total Present"
          titleBn="মোট উপস্থিত"
          value={String(aggregates.present)}
          icon={Users}
          tone="indigo"
          caption={`of ${aggregates.total} records`}
          captionBn={`${aggregates.total} রেকর্ডের মধ্যে`}
          index={1}
        />
        <HrmStatCard
          title="Absent + Late"
          titleBn="অনুপস্থিত + দেরি"
          value={String(aggregates.absent + aggregates.late)}
          icon={UserX}
          tone="destructive"
          caption="needs attention"
          captionBn="মনোযোগ প্রয়োজন"
          index={2}
        />
        <HrmStatCard
          title="Overtime Hours"
          titleBn="ওভারটাইম ঘণ্টা"
          value={aggregates.overtime.toFixed(1)}
          icon={TimerReset}
          tone="violet"
          caption={`${aggregates.hours.toFixed(0)}h total worked`}
          captionBn={`মোট ${aggregates.hours.toFixed(0)} ঘণ্টা কাজ`}
          index={3}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="px-5 pt-5">
            <CardTitle className="text-base">{isBangla ? 'দৈনিক উপস্থিতি প্রবণতা' : 'Daily Attendance Trend'}</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isBangla ? `গত ${workingDays.length} কর্মদিবস` : `Last ${workingDays.length} working days`}
            </p>
          </CardHeader>
          <div className="px-3 pb-5 pt-1 h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTrend} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradSumPresent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0FBF9F" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0FBF9F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} interval={4} />
                <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1B2432', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '12px' }}
                  labelStyle={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="present" stroke="#0FBF9F" strokeWidth={2.5} fill="url(#gradSumPresent)" name={isBangla ? 'উপস্থিত' : 'Present'} />
                <Area type="monotone" dataKey="late" stroke="#E8A23A" strokeWidth={1.8} fill="transparent" name={isBangla ? 'দেরি' : 'Late'} />
                <Area type="monotone" dataKey="absent" stroke="#C93C42" strokeWidth={1.8} fill="transparent" name={isBangla ? 'অনুপস্থিত' : 'Absent'} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top / bottom performers */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="px-5 pt-5">
              <CardTitle className="text-base flex items-center gap-2">
                <Medal className="h-4 w-4 text-amber-400" />
                {isBangla ? 'সেরা উপস্থিতি' : 'Best Attendance'}
              </CardTitle>
            </CardHeader>
            {bestEmployee && (
              <div className="px-5 pb-5 pt-1">
                <div className="rounded-xl border border-emerald/20 bg-emerald-subtle/40 p-4">
                  <div className="flex items-center gap-3">
                    <HrmAvatar name={bestEmployee.name} size="lg" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{bestEmployee.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{bestEmployee.designation}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xl font-bold text-emerald tabular-nums">{bestEmployee.rate.toFixed(1)}%</p>
                      <p className="text-[10px] text-muted-foreground">{isBangla ? 'উপস্থিতি' : 'attendance'}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-3">
                    <span className="inline-flex items-center gap-1"><TrendingUp className="h-3 w-3 text-emerald" /> {bestEmployee.present} {isBangla ? 'দিন উপস্থিত' : 'days'}</span>
                    <span>{bestEmployee.hours.toFixed(0)}h {isBangla ? 'কাজ' : 'worked'}</span>
                  </div>
                </div>
              </div>
            )}
          </Card>

          <Card>
            <CardHeader className="px-5 pt-5">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-destructive" />
                {isBangla ? 'নিম্নতম উপস্থিতি' : 'Needs Attention'}
              </CardTitle>
            </CardHeader>
            {worstEmployee && (
              <div className="px-5 pb-5 pt-1">
                <div className="rounded-xl border border-destructive/20 bg-destructive-subtle/30 p-4">
                  <div className="flex items-center gap-3">
                    <HrmAvatar name={worstEmployee.name} size="lg" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{worstEmployee.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{worstEmployee.designation}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xl font-bold text-destructive tabular-nums">{worstEmployee.rate.toFixed(1)}%</p>
                      <p className="text-[10px] text-muted-foreground">{isBangla ? 'উপস্থিতি' : 'attendance'}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-3">
                    <span className="inline-flex items-center gap-1"><UserX className="h-3 w-3 text-destructive" /> {worstEmployee.absent} {isBangla ? 'দিন অনুপস্থিত' : 'absent'}</span>
                    <span>{worstEmployee.late} {isBangla ? 'দেরি' : 'late'}</span>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Branch & Department comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="px-5 pt-5">
            <CardTitle className="text-base">{isBangla ? 'শাখাভিত্তিক তুলনা' : 'Branch Comparison'}</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isBangla ? 'গত ৩০ দিনের তথ্য' : 'Last 30 days'}
            </p>
          </CardHeader>
          <div className="px-5 pb-5 pt-1">
            <HrmDataTable
              columns={branchColumns}
              data={perBranch}
              keyField={(b) => b.id}
              skeletonRows={5}
              emptyIcon={Building2}
              emptyTitle={isBangla ? 'কোনো তথ্য নেই' : 'No data'}
              emptyTitleBn="কোনো তথ্য নেই"
              isBangla={isBangla}
            />
          </div>
        </Card>

        <Card>
          <CardHeader className="px-5 pt-5">
            <CardTitle className="text-base">{isBangla ? 'বিভাগভিত্তিক হার' : 'Department Rates'}</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isBangla ? 'গত ৩০ দিনের তথ্য' : 'Last 30 days'}
            </p>
          </CardHeader>
          <div className="px-5 pb-5 pt-1">
            <HrmDataTable
              columns={deptColumns}
              data={deptRate}
              keyField={(d) => d.name}
              skeletonRows={5}
              emptyIcon={Users}
              emptyTitle={isBangla ? 'কোনো তথ্য নেই' : 'No data'}
              emptyTitleBn="কোনো তথ্য নেই"
              isBangla={isBangla}
            />
          </div>
        </Card>
      </div>

      {/* Per employee table */}
      <Card>
        <CardHeader className="px-5 pt-5">
          <CardTitle className="text-base">{isBangla ? 'কর্মচারীভিত্তিক সারাংশ' : 'Per Employee Summary'}</CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isBangla ? 'গত ৩০ দিনের প্রতিটি কর্মচারীর উপস্থিতি' : 'Attendance for every employee over the last 30 days'}
          </p>
        </CardHeader>
        <div className="px-5 pb-5 pt-1">
          <HrmDataTable
            columns={[
              {
                key: 'employee',
                header: isBangla ? 'কর্মচারী' : 'Employee',
                render: (e) => (
                  <div className="flex items-center gap-3">
                    <HrmAvatar name={e.name} size="sm" />
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm truncate max-w-[140px]">{e.name}</p>
                      <p className="text-xs text-muted-foreground">{branchName(e.branchId)}</p>
                    </div>
                  </div>
                ),
              },
              {
                key: 'present',
                header: isBangla ? 'উপস্থিত' : 'Present',
                align: 'right',
                render: (e) => <span className="text-sm text-emerald font-medium tabular-nums">{e.present}</span>,
              },
              {
                key: 'late',
                header: isBangla ? 'দেরি' : 'Late',
                align: 'right',
                render: (e) => <span className="text-sm text-warning font-medium tabular-nums">{e.late}</span>,
              },
              {
                key: 'absent',
                header: isBangla ? 'অনুপস্থিত' : 'Absent',
                align: 'right',
                render: (e) => <span className="text-sm text-destructive font-medium tabular-nums">{e.absent}</span>,
              },
              {
                key: 'leave',
                header: isBangla ? 'ছুটি' : 'Leave',
                align: 'right',
                render: (e) => <span className="text-sm text-muted-foreground tabular-nums">{e.leave}</span>,
              },
              {
                key: 'hours',
                header: isBangla ? 'ঘণ্টা' : 'Hours',
                align: 'right',
                render: (e) => <span className="text-sm text-muted-foreground tabular-nums">{e.hours.toFixed(0)}h</span>,
              },
              {
                key: 'rate',
                header: isBangla ? 'হার' : 'Rate',
                render: (e) => (
                  <div className="flex items-center gap-3">
                    <Progress value={e.rate} size="sm" color={e.rate >= 90 ? 'emerald' : e.rate >= 80 ? 'indigo' : 'warning'} className="w-20" />
                    <span className="text-sm font-semibold text-foreground tabular-nums">{e.rate.toFixed(1)}%</span>
                  </div>
                ),
              },
            ]}
            data={perEmployee}
            keyField={(e) => e.id}
            skeletonRows={10}
            emptyIcon={Users}
            emptyTitle={isBangla ? 'কোনো তথ্য নেই' : 'No data'}
            emptyTitleBn="কোনো তথ্য নেই"
            isBangla={isBangla}
          />
        </div>
      </Card>
    </div>
  );
}
