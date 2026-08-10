// Hello Khata OS - HRM Dashboard Page
// হ্যালো খাতা - এইচআরএম ড্যাশবোর্ড পেজ

'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Users,
  UserCheck,
  CalendarOff,
  Wallet,
  UserPlus,
  Cake,
  UserCog,
  Activity,
  CalendarCheck,
  ChevronRight,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, Divider } from '@/components/ui/premium';
import { useAppTranslation, useCurrency, useDateFormat } from '@/hooks/useAppTranslation';
import { HrmPageHeader } from '@/components/hrm/shared/HrmPageHeader';
import { HrmStatCard } from '@/components/hrm/shared/HrmStatCard';
import { HrmAvatar } from '@/components/hrm/shared/HrmAvatar';
import { HrmEmptyState } from '@/components/hrm/shared/HrmEmptyState';
import { AttendanceBadge } from '@/components/hrm/shared/HrmStatusBadge';
import { HrmTableSkeleton } from '@/components/hrm/shared/HrmSkeleton';
import {
  HRM_EMPLOYEES,
  HRM_LEAVES,
  HRM_BRANCHES,
  todayAttendance,
  hrmPayroll,
  attendanceTrend,
  departmentDistribution,
  upcomingBirthdays,
  recentActivities,
  branchName,
} from '@/components/hrm/mock-data';
import { useRouter } from 'next/navigation';

const PIE_COLORS = ['#4F5BFF', '#0FBF9F', '#E8A23A', '#C93C42', '#818CF8', '#38BDF8', '#F472B6'];
const ACTIVITY_ICONS: Record<string, { icon: React.ComponentType<{ className?: string }>; tone: string }> = {
  join: { icon: UserPlus, tone: 'text-emerald bg-emerald-subtle' },
  leave: { icon: CalendarOff, tone: 'text-warning bg-warning-subtle' },
  salary: { icon: Wallet, tone: 'text-primary bg-primary-subtle' },
  attendance: { icon: CalendarCheck, tone: 'text-sky-400 bg-sky-400/10' },
  promotion: { icon: UserCog, tone: 'text-violet-400 bg-violet-400/10' },
};

export default function HrmDashboardPage() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const { formatDate } = useDateFormat();
  const router = useRouter();

  const records = useMemo(() => todayAttendance(), []);
  const payroll = useMemo(() => hrmPayroll(), []);
  const trend = useMemo(() => attendanceTrend(), []);
  const deptDist = useMemo(() => departmentDistribution(), []);
  const birthdays = useMemo(() => upcomingBirthdays(), []);
  const activities = useMemo(() => recentActivities(), []);

  const activeEmployees = HRM_EMPLOYEES.filter((e) => e.status === 'Active').length;
  const presentToday = records.filter((r) => r.status === 'Present' || r.status === 'Work From Home' || r.status === 'Overtime').length;
  const absentToday = records.filter((r) => r.status === 'Absent').length;
  const onLeaveToday = records.filter((r) => r.status === 'Leave').length;
  const monthlyPayroll = payroll.reduce((sum, p) => sum + p.netSalary, 0);
  const pendingLeaves = HRM_LEAVES.filter((l) => l.status === 'Pending');
  const totalHours = records.reduce((sum, r) => sum + r.hoursWorked, 0);

  const trendConfig = {
    present: { label: isBangla ? 'উপস্থিত' : 'Present', color: '#0FBF9F' },
    late: { label: isBangla ? 'দেরি' : 'Late', color: '#E8A23A' },
    absent: { label: isBangla ? 'অনুপস্থিত' : 'Absent', color: '#C93C42' },
    leave: { label: isBangla ? 'ছুটি' : 'Leave', color: '#4F5BFF' },
  };

  const quickActions = [
    { title: isBangla ? 'নতুন কর্মচারী' : 'Add Employee', titleBn: 'নতুন কর্মচারী', desc: isBangla ? 'কর্মচারী যোগ করুন' : 'Add a new employee', icon: UserPlus, tone: 'text-primary bg-primary-subtle', href: '/hrm/employees' },
    { title: isBangla ? 'উপস্থিতি' : 'Mark Attendance', titleBn: 'উপস্থিতি', desc: isBangla ? 'আজকের উপস্থিতি' : 'Record today\'s attendance', icon: CalendarCheck, tone: 'text-emerald bg-emerald-subtle', href: '/hrm/attendance' },
    { title: isBangla ? 'ছুটির আবেদন' : 'Leave Request', titleBn: 'ছুটির আবেদন', desc: isBangla ? 'ছুটি অনুমোদন করুন' : 'Approve leave requests', icon: CalendarOff, tone: 'text-warning bg-warning-subtle', href: '/hrm/leave' },
    { title: isBangla ? 'বেতন' : 'Payroll', titleBn: 'বেতন', desc: isBangla ? 'বেতন প্রস্তুত' : 'Generate monthly payroll', icon: Wallet, tone: 'text-sky-400 bg-sky-400/10', href: '/hrm/payroll' },
  ];

  return (
    <div className="space-y-6">
      <HrmPageHeader
        title={isBangla ? 'এইচআরএম ড্যাশবোর্ড' : 'HRM Dashboard'}
        titleBn="এইচআরএম ড্যাশবোর্ড"
        subtitle={isBangla ? 'এক নজরে আপনার প্রতিষ্ঠানের কর্মচারী ও উপস্থিতি দেখুন।' : 'Monitor employees, attendance and payroll at a glance.'}
        subtitleBn="এক নজরে আপনার প্রতিষ্ঠানের কর্মচারী ও উপস্থিতি দেখুন।"
        icon={Users}
        breadcrumbs={[]}
        actions={
          <>
            <Link href="/hrm/employees">
              <button className="inline-flex items-center gap-2 h-10 px-4 rounded-lg text-sm font-medium border border-border bg-transparent hover:bg-muted transition-colors">
                <UserPlus className="h-4 w-4" />
                {isBangla ? 'কর্মচারী যোগ করুন' : 'Add Employee'}
              </button>
            </Link>
            <Link href="/hrm/attendance">
              <button className="inline-flex items-center gap-2 h-10 px-4 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary-hover transition-colors">
                <CalendarCheck className="h-4 w-4" />
                {isBangla ? 'উপস্থিতি দিন' : 'Mark Attendance'}
              </button>
            </Link>
          </>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <HrmStatCard
          title="Total Employees"
          titleBn="মোট কর্মচারী"
          value={String(HRM_EMPLOYEES.length)}
          icon={Users}
          tone="indigo"
          trend={{ value: 4.2, isPositive: true }}
          caption="across all branches"
          captionBn="সব শাখায়"
          index={0}
          onClick={() => router.push('/hrm/employees')}
        />
        <HrmStatCard
          title="Present Today"
          titleBn="আজ উপস্থিত"
          value={String(presentToday)}
          icon={UserCheck}
          tone="emerald"
          trend={{ value: 2.1, isPositive: true }}
          caption="out of 12"
          captionBn="১২ জনের মধ্যে"
          index={1}
        />
        <HrmStatCard
          title="On Leave"
          titleBn="ছুটিতে আছেন"
          value={String(onLeaveToday + absentToday)}
          icon={CalendarOff}
          tone="warning"
          caption={`${onLeaveToday} on leave · ${absentToday} absent`}
          captionBn={`${onLeaveToday} ছুটিতে · ${absentToday} অনুপস্থিত`}
          index={2}
        />
        <HrmStatCard
          title="Payroll This Month"
          titleBn="এ মাসের বেতন"
          value={formatCurrency(monthlyPayroll)}
          icon={Wallet}
          tone="sky"
          trend={{ value: 3.4, isPositive: true }}
          caption="for 12 employees"
          captionBn="১২ জন কর্মচারীর জন্য"
          index={3}
          onClick={() => router.push('/hrm/payroll')}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Attendance Trend */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0 px-5 pt-5">
            <div>
              <CardTitle className="text-base">
                {isBangla ? 'উপস্থিতির প্রবণতা' : 'Attendance Trend'}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isBangla ? 'গত ৬ মাসের মাসিক উপস্থিতি' : 'Last 6 months monthly attendance'}
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              {(Object.keys(trendConfig) as (keyof typeof trendConfig)[]).map((k) => (
                <span key={k} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: trendConfig[k].color }} />
                  {trendConfig[k].label}
                </span>
              ))}
            </div>
          </CardHeader>
          <CardContent className="px-3 pb-4 pt-2">
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradPresent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0FBF9F" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#0FBF9F" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: '#1B2432',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                    labelStyle={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="present" stroke="#0FBF9F" strokeWidth={2.5} fill="url(#gradPresent)" name={isBangla ? 'উপস্থিত' : 'Present'} />
                  <Area type="monotone" dataKey="late" stroke="#E8A23A" strokeWidth={1.8} fill="transparent" name={isBangla ? 'দেরি' : 'Late'} />
                  <Area type="monotone" dataKey="absent" stroke="#C93C42" strokeWidth={1.8} fill="transparent" name={isBangla ? 'অনুপস্থিত' : 'Absent'} />
                  <Area type="monotone" dataKey="leave" stroke="#4F5BFF" strokeWidth={1.8} fill="transparent" name={isBangla ? 'ছুটি' : 'Leave'} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card>
          <CardHeader className="px-5 pt-5">
            <CardTitle className="text-base">
              {isBangla ? 'বিভাগ অনুযায়ী' : 'By Department'}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isBangla ? 'বিভাগভিত্তিক কর্মচারী' : 'Employees per department'}
            </p>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="h-[150px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deptDist}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={62}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {deptDist.map((entry, index) => (
                      <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#1B2432',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value) => [`${value} ${isBangla ? 'জন' : 'people'}`, isBangla ? 'কর্মচারী' : 'Employees']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5">
              {deptDist.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="truncate flex-1">{d.name}</span>
                  <span className="font-semibold text-foreground tabular-nums">{d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Today's Attendance */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0 px-5 pt-5">
            <div>
              <CardTitle className="text-base">
                {isBangla ? "আজকের উপস্থিতি" : "Today's Attendance"}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isBangla
                  ? `${formatDate(new Date())} · মোট ${totalHours.toFixed(1)} ঘণ্টা কাজ`
                  : `${formatDate(new Date())} · ${totalHours.toFixed(1)}h total worked`}
              </p>
            </div>
            <Link href="/hrm/attendance" className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1 shrink-0">
              {isBangla ? 'সব দেখুন' : 'View all'}
              <ChevronRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-3">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[420px]">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                    <th className="py-2 pr-3 font-semibold">{isBangla ? 'কর্মচারী' : 'Employee'}</th>
                    <th className="py-2 pr-3 font-semibold">{isBangla ? 'শাখা' : 'Branch'}</th>
                    <th className="py-2 pr-3 font-semibold text-center">{isBangla ? 'ইন' : 'In'}</th>
                    <th className="py-2 pr-3 font-semibold text-center">{isBangla ? 'আউট' : 'Out'}</th>
                    <th className="py-2 font-semibold text-right">{isBangla ? 'স্ট্যাটাস' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody>
                  {records.slice(0, 6).map((r) => (
                    <tr key={r.id} className="border-b border-border/60 last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="py-2.5 pr-3">
                        <div className="flex items-center gap-2.5">
                          <HrmAvatar name={r.name} size="sm" />
                          <span className="font-medium text-foreground whitespace-nowrap">{r.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 pr-3 text-muted-foreground whitespace-nowrap">{branchName(r.branchId)}</td>
                      <td className="py-2.5 pr-3 text-center text-muted-foreground tabular-nums">{r.checkIn}</td>
                      <td className="py-2.5 pr-3 text-center text-muted-foreground tabular-nums">{r.checkOut}</td>
                      <td className="py-2.5 text-right">
                        <AttendanceBadge status={r.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <Card>
            <CardHeader className="px-5 pt-5">
              <CardTitle className="text-base">
                {isBangla ? 'দ্রুত অ্যাকশন' : 'Quick Actions'}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-1">
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((a, i) => (
                  <Link
                    key={i}
                    href={a.href}
                    className="group rounded-xl border border-[rgba(255,255,255,0.04)] bg-gradient-to-b from-card to-card/60 p-3 hover:border-primary/30 transition-all duration-200"
                  >
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center mb-2 ${a.tone}`}>
                      <a.icon className="h-4 w-4" />
                    </div>
                    <p className="text-xs font-semibold text-foreground leading-tight">{a.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{a.desc}</p>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Leave Requests */}
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 px-5 pt-5">
              <CardTitle className="text-base">
                {isBangla ? 'ছুটি অনুমোদন' : 'Pending Approvals'}
              </CardTitle>
              <Link href="/hrm/leave" className="text-xs font-medium text-primary hover:underline shrink-0">
                {isBangla ? 'সব দেখুন' : 'View all'}
              </Link>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-2">
              {pendingLeaves.length === 0 ? (
                <HrmEmptyState
                  icon={CalendarCheck}
                  title={isBangla ? 'কোনো অপেক্ষমাণ নেই' : 'Nothing pending'}
                  description={isBangla ? 'সব ছুটির আবেদন নিষ্পত্তি হয়েছে' : 'All leave requests are resolved'}
                />
              ) : (
                <div className="space-y-2.5">
                  {pendingLeaves.slice(0, 3).map((l) => (
                    <div key={l.id} className="flex items-center gap-3 rounded-xl border border-[rgba(255,255,255,0.04)] bg-muted/20 p-3">
                      <HrmAvatar name={l.name} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{l.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {l.type} · {l.days} {isBangla ? 'দিন' : 'days'}
                        </p>
                      </div>
                      <Link
                        href="/hrm/leave"
                        className="text-[11px] font-semibold text-primary bg-primary-subtle rounded-md px-2.5 py-1 hover:bg-primary/20 transition-colors shrink-0"
                      >
                        {isBangla ? 'পর্যালোচনা' : 'Review'}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Birthdays */}
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 px-5 pt-5">
              <CardTitle className="text-base flex items-center gap-2">
                <Cake className="h-4 w-4 text-rose-400" />
                {isBangla ? 'জন্মদিন' : 'Birthdays'}
              </CardTitle>
              <span className="text-[11px] text-muted-foreground">{isBangla ? 'আগামী ৩০ দিন' : 'Next 30 days'}</span>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-2">
              <div className="space-y-2.5">
                {birthdays.map((b) => (
                  <div key={b.id} className="flex items-center gap-3">
                    <div className="flex flex-col items-center justify-center h-11 w-11 rounded-xl bg-gradient-to-br from-primary/20 to-emerald/10 border border-primary/10 shrink-0">
                      <span className="text-sm font-bold text-primary leading-none tabular-nums">{b.day}</span>
                      <span className="text-[9px] text-muted-foreground uppercase">{b.month}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{b.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{b.designation}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">{b.dateLabel}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="px-5 pt-5">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald" />
                {isBangla ? 'সাম্প্রতিক কার্যক্রম' : 'Recent Activity'}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-2">
              <div className="space-y-4">
                {activities.map((a) => {
                  const meta = ACTIVITY_ICONS[a.icon] || ACTIVITY_ICONS.join;
                  const Icon = meta.icon;
                  return (
                    <div key={a.id} className="flex items-start gap-3">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${meta.tone}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground">
                          {isBangla ? a.titleBn : a.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                          {isBangla ? a.detailBn : a.detail}
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 mt-0.5">{a.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
