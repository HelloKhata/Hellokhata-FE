// Hello Khata OS - HRM Employee Profile Page
// হ্যালো খাতা - এইচআরএম কর্মচারী প্রোফাইল পেজ

'use client';

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Pencil,
  Download,
  Mail,
  Phone,
  MapPin,
  Droplets,
  CalendarDays,
  Banknote,
  User,
  Building2,
  ShieldCheck,
  BadgeCheck,
  Clock,
  Users,
  CalendarCheck,
  CalendarOff,
  Briefcase,
  Wallet,
  PhoneCall,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui/premium';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAppTranslation, useCurrency, useDateFormat } from '@/hooks/useAppTranslation';
import { HrmAvatar } from '@/components/hrm/shared/HrmAvatar';
import { HrmStatCard } from '@/components/hrm/shared/HrmStatCard';
import { HrmBreadcrumb } from '@/components/hrm/shared/HrmBreadcrumb';
import { EmployeeStatusBadge, AttendanceBadge, LeaveStatusBadge, PaymentStatusBadge } from '@/components/hrm/shared/HrmStatusBadge';
import { HrmEmptyState } from '@/components/hrm/shared/HrmEmptyState';
import {
  employeeById,
  branchName,
  generateAttendanceHistory,
  HRM_LEAVES,
  hrmPayroll,
} from '@/components/hrm/mock-data';

export default function EmployeeProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const { formatDate } = useDateFormat();

  const employee = useMemo(() => employeeById(params.id), [params.id]);
  const attendance = useMemo(() => generateAttendanceHistory(30), []);
  const leaves = useMemo(() => HRM_LEAVES.filter((l) => l.employeeId === params.id), [params.id]);
  const payroll = useMemo(() => hrmPayroll().filter((p) => p.employeeId === params.id), [params.id]);

  if (!employee) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => router.push('/hrm/employees')}>
          <ArrowLeft className="h-4 w-4" />
          {isBangla ? 'ফিরে যান' : 'Go back'}
        </Button>
        <HrmEmptyState
          icon={Users}
          title={isBangla ? 'কর্মচারী পাওয়া যায়নি' : 'Employee not found'}
          description={isBangla ? 'এই কর্মচারীটি বিদ্যমান নেই বা মুছে ফেলা হয়েছে।' : 'This employee does not exist or was removed.'}
        />
      </div>
    );
  }

  const empAttendance = attendance.filter((a) => a.employeeId === employee.id);
  const presentDays = empAttendance.filter((a) => a.status === 'Present' || a.status === 'Overtime').length;
  const lateDays = empAttendance.filter((a) => a.status === 'Late').length;
  const absentDays = empAttendance.filter((a) => a.status === 'Absent').length;
  const leaveDays = empAttendance.filter((a) => a.status === 'Leave').length;
  const attendancePct = empAttendance.length ? Math.round((presentDays / empAttendance.length) * 100) : 0;

  const balance = payroll[0];

  const profileFields = [
    { icon: Mail, label: isBangla ? 'ইমেইল' : 'Email', value: employee.email },
    { icon: Phone, label: isBangla ? 'মোবাইল' : 'Phone', value: employee.phone },
    { icon: MapPin, label: isBangla ? 'ঠিকানা' : 'Address', value: employee.address },
    { icon: Building2, label: isBangla ? 'শাখা' : 'Branch', value: branchName(employee.branchId) },
    { icon: Briefcase, label: isBangla ? 'বিভাগ' : 'Department', value: employee.department },
    { icon: ShieldCheck, label: isBangla ? 'শিফট' : 'Shift', value: employee.shift },
    { icon: CalendarDays, label: isBangla ? 'যোগদান' : 'Joined', value: formatDate(employee.joiningDate) },
    { icon: Banknote, label: isBangla ? 'মাসিক বেতন' : 'Monthly Salary', value: formatCurrency(employee.salary) },
    { icon: User, label: isBangla ? 'লিঙ্গ' : 'Gender', value: employee.gender },
    { icon: Droplets, label: 'Blood Group', value: employee.bloodGroup },
    { icon: PhoneCall, label: isBangla ? 'জরুরি যোগাযোগ' : 'Emergency', value: employee.emergencyContact },
  ];

  return (
    <div className="space-y-6">
      <HrmBreadcrumb
        items={[
          { label: isBangla ? 'কর্মচারী' : 'Employees', href: '/hrm/employees', labelBn: 'কর্মচারী' },
          { label: employee.name, labelBn: employee.nameBn },
        ]}
      />

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon-sm" onClick={() => router.push('/hrm/employees')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <HrmAvatar name={employee.name} size="xl" />
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                {isBangla ? employee.nameBn : employee.name}
              </h1>
              <EmployeeStatusBadge status={employee.status} />
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {employee.employeeId} · {employee.designation} · {employee.department}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            leftIcon={<Download className="h-4 w-4" />}
            onClick={() => toast.success(isBangla ? 'ডাউনলোড শুরু হয়েছে' : 'Download started')}
          >
            {isBangla ? 'রেজুমে' : 'Resume'}
          </Button>
          <Button
            leftIcon={<Pencil className="h-4 w-4" />}
            onClick={() => toast.success(isBangla ? 'সম্পাদনা মোড খোলা হয়েছে' : 'Edit mode opened')}
          >
            {isBangla ? 'সম্পাদনা' : 'Edit'}
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <HrmStatCard
          title="Attendance Rate"
          titleBn="উপস্থিতির হার"
          value={String(attendancePct)}
          suffix="%"
          icon={CalendarCheck}
          tone="emerald"
          caption={`${presentDays} present in last 30 days`}
          captionBn={`গত ৩০ দিনে ${presentDays} দিন উপস্থিত`}
          index={0}
        />
        <HrmStatCard
          title="Late Arrivals"
          titleBn="দেরিতে আসা"
          value={String(lateDays)}
          icon={Clock}
          tone="warning"
          caption="in last 30 days"
          captionBn="গত ৩০ দিনে"
          index={1}
        />
        <HrmStatCard
          title="Absent Days"
          titleBn="অনুপস্থিত"
          value={String(absentDays)}
          icon={CalendarOff}
          tone="destructive"
          caption="in last 30 days"
          captionBn="গত ৩০ দিনে"
          index={2}
        />
        <HrmStatCard
          title="Leave Taken"
          titleBn="নেওয়া ছুটি"
          value={String(leaveDays)}
          icon={CalendarDays}
          tone="sky"
          caption="in last 30 days"
          captionBn="গত ৩০ দিনে"
          index={3}
        />
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="w-full sm:w-auto flex-wrap">
          <TabsTrigger value="overview" className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            {isBangla ? 'ওভারভিউ' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex items-center gap-1.5">
            <CalendarCheck className="h-4 w-4" />
            {isBangla ? 'উপস্থিতি' : 'Attendance'}
          </TabsTrigger>
          <TabsTrigger value="leave" className="flex items-center gap-1.5">
            <CalendarOff className="h-4 w-4" />
            {isBangla ? 'ছুটি' : 'Leave'}
          </TabsTrigger>
          <TabsTrigger value="payroll" className="flex items-center gap-1.5">
            <Wallet className="h-4 w-4" />
            {isBangla ? 'বেতন' : 'Payroll'}
          </TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader className="px-5 pt-5">
                <CardTitle className="text-base">{isBangla ? 'ব্যক্তিগত তথ্য' : 'Personal Information'}</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {profileFields.map((f) => (
                    <div key={f.label} className="flex items-center gap-3 rounded-xl border border-[rgba(255,255,255,0.04)] bg-muted/20 p-3">
                      <div className="h-9 w-9 rounded-lg bg-muted/40 flex items-center justify-center shrink-0">
                        <f.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-muted-foreground">{f.label}</p>
                        <p className="text-sm font-medium text-foreground truncate">{f.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="px-5 pt-5">
                <CardTitle className="text-base">{isBangla ? 'ওভারভিউ' : 'At a Glance'}</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5 pt-2 space-y-3">
                <OverviewRow icon={BadgeCheck} label={isBangla ? 'স্ট্যাটাস' : 'Status'} value={employee.status} />
                <OverviewRow icon={Building2} label={isBangla ? 'শাখা' : 'Branch'} value={branchName(employee.branchId)} />
                <OverviewRow icon={Briefcase} label={isBangla ? 'বিভাগ' : 'Department'} value={employee.department} />
                <OverviewRow icon={ShieldCheck} label={isBangla ? 'পদবি' : 'Designation'} value={employee.designation} />
                <OverviewRow icon={CalendarDays} label={isBangla ? 'যোগদান' : 'Joined'} value={formatDate(employee.joiningDate)} />
                <OverviewRow icon={Banknote} label={isBangla ? 'বেতন' : 'Salary'} value={formatCurrency(employee.salary)} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Attendance */}
        <TabsContent value="attendance" className="mt-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 px-5 pt-5">
              <div>
                <CardTitle className="text-base">{isBangla ? 'সাম্প্রতিক উপস্থিতি' : 'Recent Attendance'}</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isBangla ? 'গত ৩০ দিনের রেকর্ড' : 'Last 30 days'}
                </p>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-2">
              {empAttendance.length === 0 ? (
                <HrmEmptyState
                  icon={CalendarCheck}
                  title={isBangla ? 'কোনো রেকর্ড নেই' : 'No records yet'}
                  description={isBangla ? 'এই কর্মচারীর কোনো উপস্থিতির রেকর্ড নেই।' : 'No attendance records for this employee yet.'}
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm min-w-[560px]">
                    <thead>
                      <tr className="text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                        <th className="py-2.5 pr-3 font-semibold">{isBangla ? 'তারিখ' : 'Date'}</th>
                        <th className="py-2.5 pr-3 font-semibold">{isBangla ? 'শাখা' : 'Branch'}</th>
                        <th className="py-2.5 pr-3 font-semibold text-center">{isBangla ? 'ইন' : 'In'}</th>
                        <th className="py-2.5 pr-3 font-semibold text-center">{isBangla ? 'আউট' : 'Out'}</th>
                        <th className="py-2.5 pr-3 font-semibold text-right">{isBangla ? 'ঘণ্টা' : 'Hours'}</th>
                        <th className="py-2.5 font-semibold text-right">{isBangla ? 'স্ট্যাটাস' : 'Status'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {empAttendance.slice(0, 12).map((a) => (
                        <tr key={a.id} className="border-b border-border/60 last:border-0 hover:bg-muted/20 transition-colors">
                          <td className="py-2.5 pr-3 text-foreground tabular-nums whitespace-nowrap">{formatDate(a.date)}</td>
                          <td className="py-2.5 pr-3 text-muted-foreground whitespace-nowrap">{branchName(a.branchId)}</td>
                          <td className="py-2.5 pr-3 text-center text-muted-foreground tabular-nums">{a.checkIn}</td>
                          <td className="py-2.5 pr-3 text-center text-muted-foreground tabular-nums">{a.checkOut}</td>
                          <td className="py-2.5 pr-3 text-right text-muted-foreground tabular-nums">{a.hoursWorked.toFixed(1)}</td>
                          <td className="py-2.5 text-right">
                            <AttendanceBadge status={a.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leave */}
        <TabsContent value="leave" className="mt-4">
          <Card>
            <CardHeader className="px-5 pt-5">
              <CardTitle className="text-base">{isBangla ? 'ছুটির ইতিহাস' : 'Leave History'}</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-2">
              {leaves.length === 0 ? (
                <HrmEmptyState
                  icon={CalendarOff}
                  title={isBangla ? 'কোনো ছুটি নেই' : 'No leave records'}
                  description={isBangla ? 'এই কর্মচারী এখনো কোনো ছুটির আবেদন করেননি।' : 'This employee has not applied for any leave yet.'}
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm min-w-[560px]">
                    <thead>
                      <tr className="text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                        <th className="py-2.5 pr-3 font-semibold">{isBangla ? 'ধরন' : 'Type'}</th>
                        <th className="py-2.5 pr-3 font-semibold">{isBangla ? 'সময়কাল' : 'Duration'}</th>
                        <th className="py-2.5 pr-3 font-semibold text-center">{isBangla ? 'দিন' : 'Days'}</th>
                        <th className="py-2.5 pr-3 font-semibold">{isBangla ? 'কারণ' : 'Reason'}</th>
                        <th className="py-2.5 font-semibold text-right">{isBangla ? 'স্ট্যাটাস' : 'Status'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaves.map((l) => (
                        <tr key={l.id} className="border-b border-border/60 last:border-0 hover:bg-muted/20 transition-colors">
                          <td className="py-2.5 pr-3 text-foreground whitespace-nowrap">{l.type}</td>
                          <td className="py-2.5 pr-3 text-muted-foreground whitespace-nowrap tabular-nums">
                            {formatDate(l.from)} → {formatDate(l.to)}
                          </td>
                          <td className="py-2.5 pr-3 text-center text-foreground tabular-nums">{l.days}</td>
                          <td className="py-2.5 pr-3 text-muted-foreground truncate max-w-[220px]">{l.reason}</td>
                          <td className="py-2.5 text-right">
                            <LeaveStatusBadge status={l.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payroll */}
        <TabsContent value="payroll" className="mt-4 space-y-4">
          {balance ? (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <HrmStatCard title="Basic Salary" titleBn="মূল বেতন" value={formatCurrency(balance.basicSalary)} icon={Banknote} tone="indigo" index={0} />
                <HrmStatCard title="Allowance" titleBn="ভাতা" value={formatCurrency(balance.allowance)} icon={BadgeCheck} tone="emerald" index={1} />
                <HrmStatCard title="Bonus" titleBn="বোনাস" value={formatCurrency(balance.bonus)} icon={CalendarCheck} tone="sky" index={2} />
                <HrmStatCard title="Deduction" titleBn="কর্তন" value={formatCurrency(balance.deduction)} icon={CalendarOff} tone="destructive" index={3} />
              </div>
              <Card>
                <CardHeader className="px-5 pt-5">
                  <CardTitle className="text-base">{isBangla ? 'বেতন সারাংশ' : 'Salary Summary'}</CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5 pt-2">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{isBangla ? 'মূল বেতন' : 'Basic Salary'}</span>
                      <span className="font-medium text-foreground tabular-nums">{formatCurrency(balance.basicSalary)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{isBangla ? 'ভাতা' : 'Allowance'}</span>
                      <span className="font-medium text-foreground tabular-nums">+ {formatCurrency(balance.allowance)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{isBangla ? 'বোনাস' : 'Bonus'}</span>
                      <span className="font-medium text-foreground tabular-nums">+ {formatCurrency(balance.bonus)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{isBangla ? 'কর্তন' : 'Deductions'}</span>
                      <span className="font-medium text-destructive tabular-nums">- {formatCurrency(balance.deduction)}</span>
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                    <div className="flex items-center justify-between text-base font-bold text-foreground">
                      <span>{isBangla ? 'নিট বেতন' : 'Net Salary'}</span>
                      <span className="tabular-nums">{formatCurrency(balance.netSalary)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-muted-foreground">{isBangla ? 'পরিশোধের অবস্থা' : 'Payment Status'}</span>
                      <PaymentStatusBadge status={balance.paymentStatus} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <HrmEmptyState
              icon={Wallet}
              title={isBangla ? 'বেতনের রেকর্ড নেই' : 'No payroll records'}
              description={isBangla ? 'এই মাসে এই কর্মচারীর জন্য কোনো বেতনের রেকর্ড নেই।' : 'No payroll records for this employee this month.'}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OverviewRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-9 w-9 rounded-lg bg-muted/40 flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}
