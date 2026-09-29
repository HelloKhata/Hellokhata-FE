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
  User,
  Shield,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAppTranslation, useCurrency, useDateFormat } from '@/hooks/useAppTranslation';
import { BackButton } from '@/components/common';
import { HrmAvatar } from '@/components/hrm/shared/HrmAvatar';
import { EmployeeStatusBadge } from '@/components/hrm/shared/HrmStatusBadge';
import { HrmEmptyState } from '@/components/hrm/shared/HrmEmptyState';
import { useGetSingleEmployee } from '@/hooks/api/useEmployes';
import { useGetBranches } from '@/hooks/api/useBranches';
import { useGetRoles } from '@/hooks/api/useRoles';

export default function EmployeeProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const { formatDate } = useDateFormat();

  const { data: apiEmployee, isLoading: isEmpLoading } = useGetSingleEmployee(params.id);
  const { data: branchesData = [] } = useGetBranches();
  const { data: rolesData = [] } = useGetRoles();

  const employee = useMemo(() => {
    if (!apiEmployee) return null;
    return (apiEmployee.data || apiEmployee) as any;
  }, [apiEmployee]);

  const getBranchLabel = (bId?: string) => {
    if (!bId) return isBangla ? 'মূল শাখা' : 'Main Branch';
    const found = (Array.isArray(branchesData) ? branchesData : []).find((b: any) => b.id === bId);
    if (found) return isBangla ? found.nameBn || found.name : found.name;
    return isBangla ? 'শাখা' : 'Branch';
  };

  const roleName = useMemo(() => {
    if (employee?.role) {
      return isBangla ? employee.role.nameBn || employee.role.name : employee.role.name;
    }
    if (employee?.roleId) {
      const r = (Array.isArray(rolesData) ? rolesData : []).find((x: any) => x.id === employee.roleId);
      if (r) return isBangla ? r.nameBn || r.name : r.name;
      return employee.roleId;
    }
    return null;
  }, [employee, rolesData, isBangla]);

  // Loading state
  if (isEmpLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">
          {isBangla ? 'কর্মচারীর তথ্য লোড হচ্ছে...' : 'Loading employee details...'}
        </p>
      </div>
    );
  }

  // Not found state
  if (!employee && !isEmpLoading) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => router.push('/hrm/employees')} className="cursor-pointer">
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          {isBangla ? 'ফিরে যান' : 'Go back'}
        </Button>
        <HrmEmptyState
          icon={User}
          title={isBangla ? 'কর্মচারী পাওয়া যায়নি' : 'Employee not found'}
          description={isBangla ? 'এই কর্মচারীটি বিদ্যমান নেই বা মুছে ফেলা হয়েছে।' : 'This employee does not exist or was removed.'}
        />
      </div>
    );
  }

  const empName = employee.fullName || employee.name || 'Employee';

  // Value formatting helpers
  const formatBloodGroup = (bg?: string) => {
    if (!bg) return '-';
    const map: Record<string, string> = {
      A_PLUS: 'A+ (Positive)',
      A_MINUS: 'A- (Negative)',
      B_PLUS: 'B+ (Positive)',
      B_MINUS: 'B- (Negative)',
      AB_PLUS: 'AB+ (Positive)',
      AB_MINUS: 'AB- (Negative)',
      O_PLUS: 'O+ (Positive)',
      O_MINUS: 'O- (Negative)',
    };
    return map[bg] || bg.replace('_', ' ');
  };

  const formatPaymentMethod = (pm?: string) => {
    if (!pm) return '-';
    const upper = pm.toUpperCase();
    const map: Record<string, string> = {
      BANK_TRANSFER: isBangla ? 'ব্যাংক ট্রান্সফার' : 'Bank Transfer',
      MOBILE_BANKING: isBangla ? 'মোবাইল ব্যাংকিং (MFS)' : 'Mobile Banking (MFS)',
      CASH: isBangla ? 'নগদ (Cash)' : 'Cash',
      CHEQUE: isBangla ? 'চেক (Cheque)' : 'Cheque',
    };
    return map[upper] || pm.replace('_', ' ');
  };

  const formatMaritalStatus = (ms?: string) => {
    if (!ms) return '-';
    const upper = ms.toUpperCase();
    const map: Record<string, string> = {
      SINGLE: isBangla ? 'অবিবাহিত (Single)' : 'Single',
      MARRIED: isBangla ? 'বিবাহিত (Married)' : 'Married',
      DIVORCED: isBangla ? 'তালাকপ্রাপ্ত (Divorced)' : 'Divorced',
      WIDOW: isBangla ? 'বিধবা / বিপত্নীক (Widow)' : 'Widow',
      WIDOWED: isBangla ? 'বিধবা / বিপত্নীক (Widowed)' : 'Widowed',
    };
    return map[upper] || ms;
  };

  const formatGender = (g?: string) => {
    if (!g) return '-';
    const upper = g.toUpperCase();
    const map: Record<string, string> = {
      MALE: isBangla ? 'পুরুষ (Male)' : 'Male',
      FEMALE: isBangla ? 'নারী (Female)' : 'Female',
      OTHER: isBangla ? 'অন্যান্য (Other)' : 'Other',
    };
    return map[upper] || g;
  };

  const formatReligion = (rel?: string) => {
    if (!rel) return '-';
    const upper = rel.toUpperCase();
    const map: Record<string, string> = {
      ISLAM: isBangla ? 'ইসলাম (Islam)' : 'Islam',
      HINDUISM: isBangla ? 'হিন্দুধর্ম (Hinduism)' : 'Hinduism',
      CHRISTIANITY: isBangla ? 'খ্রিস্টধর্ম (Christianity)' : 'Christianity',
      BUDDHISM: isBangla ? 'বৌদ্ধধর্ম (Buddhism)' : 'Buddhism',
      OTHER: isBangla ? 'অন্যান্য (Other)' : 'Other',
    };
    return map[upper] || rel.charAt(0).toUpperCase() + rel.slice(1).toLowerCase();
  };

  const formatSalaryCycle = (sc?: string) => {
    if (!sc) return isBangla ? 'মাসিক (Monthly)' : 'Monthly';
    const upper = sc.toUpperCase();
    const map: Record<string, string> = {
      MONTHLY: isBangla ? 'মাসিক (Monthly)' : 'Monthly',
      BIWEEKLY: isBangla ? 'দ্বিসাপ্তাহিক (Biweekly)' : 'Biweekly',
      WEEKLY: isBangla ? 'সাপ্তাহিক (Weekly)' : 'Weekly',
      DAILY: isBangla ? 'দৈনিক (Daily)' : 'Daily',
      HOURLY: isBangla ? 'ঘণ্টাভিত্তিক (Hourly)' : 'Hourly',
    };
    return map[upper] || sc;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BackButton fallbackHref="/hrm/employees" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
              <span>{isBangla ? employee.nameBn || empName : empName}</span>
              <EmployeeStatusBadge status={employee.status || (employee.isProbation ? 'PROBATION' : 'ACTIVE')} />
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5 font-mono">
              {employee.employeeId} · {employee.designation || 'Staff'} · {getBranchLabel(employee.branchId)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success(isBangla ? 'ডাউনলোড শুরু হয়েছে' : 'Download started')}
            className="rounded-xl border-border text-xs font-semibold h-9 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            {isBangla ? 'রেজুমে' : 'Resume'}
          </Button>
          <Button
            size="sm"
            onClick={() => router.push('/hrm/employees')}
            className="rounded-xl bg-primary text-primary-foreground text-xs font-bold h-9 shadow-xs cursor-pointer"
          >
            <Pencil className="h-3.5 w-3.5 mr-1.5" />
            {isBangla ? 'সম্পাদনা' : 'Edit'}
          </Button>
        </div>
      </div>

      {/* Main Details Grid */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-6"
      >
        {/* 1. BASIC INFORMATION (Full Width Card) */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs">
          <div className="mb-5">
            <h2 className="text-base font-bold text-foreground">
              {isBangla ? 'মৌলিক তথ্য' : 'Basic information'}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left side: Avatar + Identity + Contacts + Address */}
            <div className="lg:col-span-5 flex items-start gap-4 sm:gap-5">
              <HrmAvatar
                name={empName}
                imageUrl={employee.imageUrl}
                size="xl"
                className="w-20 h-20 sm:w-24 sm:h-24 text-2xl ring-4 ring-border/50 shadow-md shrink-0"
              />
              <div className="min-w-0 flex-1 space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-foreground truncate">
                  {empName}
                </h3>
                <p className="text-xs text-muted-foreground font-mono">
                  {employee.employeeId}
                </p>

                <div className="pt-3 space-y-3 text-xs text-muted-foreground">
                  {employee.gender && (
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 shrink-0 text-muted-foreground" />
                      <span className="font-medium text-foreground">{formatGender(employee.gender)}</span>
                    </div>
                  )}
                  {(employee.emailAddress || employee.email) && (
                    <div className="flex items-center gap-3 truncate">
                      <Mail className="w-4 h-4 shrink-0 text-muted-foreground" />
                      <span className="truncate font-medium text-foreground">{employee.emailAddress || employee.email}</span>
                    </div>
                  )}
                  {(employee.phoneNumber || employee.phone) && (
                    <div className="flex items-center gap-3 font-mono">
                      <Phone className="w-4 h-4 shrink-0 text-muted-foreground" />
                      <span className="font-medium text-foreground">{employee.phoneNumber || employee.phone}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 shrink-0 text-muted-foreground mt-0.5" />
                    <span className="font-medium text-foreground leading-snug">
                      {employee.presentAddress || employee.address || (isBangla ? 'ঠিকানা প্রদান করা হয়নি' : 'No address provided')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vertical divider on desktop */}
            <div className="hidden lg:block lg:col-span-1 h-full min-h-[140px] w-px bg-border/60 mx-auto" />

            {/* Right side: Key particulars list */}
            <div className="lg:col-span-6 space-y-2">
              <DetailRow
                label={isBangla ? 'জাতীয়তা' : 'Place of birth / Nationality'}
                value={employee.nationality || (isBangla ? 'বাংলাদেশী' : 'Bangladeshi')}
              />
              <DetailRow
                label={isBangla ? 'জন্ম তারিখ' : 'Birth date'}
                value={employee.dateOfBirth ? formatDate(employee.dateOfBirth) : '-'}
              />
              <DetailRow
                label={isBangla ? 'রক্তের গ্রুপ' : 'Blood type'}
                value={formatBloodGroup(employee.bloodGroup)}
              />
              <DetailRow
                label={isBangla ? 'বৈবাহিক অবস্থা' : 'Marital Status'}
                value={formatMaritalStatus(employee.maritalStatus)}
              />
              <DetailRow
                label={isBangla ? 'ধর্ম' : 'Religion'}
                value={formatReligion(employee.religion)}
              />
              <DetailRow
                label={isBangla ? 'জাতীয় পরিচয়পত্র (NID)' : 'National ID (NID)'}
                value={employee.nationalId || employee.nid || '-'}
                isMono
              />
              {employee.passportNo && (
                <DetailRow
                  label={isBangla ? 'পাসপোর্ট নম্বর' : 'Passport No'}
                  value={employee.passportNo}
                  isMono
                />
              )}
            </div>
          </div>
        </div>

        {/* 2. Employment Details & Compensation & Banking (2 Balanced Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card: Employment Details */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs">
            <div className="mb-4">
              <h2 className="text-base font-bold text-foreground">
                {isBangla ? 'চাকরি ও পদবি তথ্য' : 'Employment details'}
              </h2>
            </div>

            <div className="space-y-2">
              <DetailRow
                label={isBangla ? 'শাখা' : 'Branch'}
                value={getBranchLabel(employee.branchId)}
              />
              <DetailRow
                label={isBangla ? 'বিভাগ' : 'Department'}
                value={employee.department || '-'}
              />
              <DetailRow
                label={isBangla ? 'পদবি' : 'Designation'}
                value={employee.designation || '-'}
              />
              <DetailRow
                label={isBangla ? 'সিস্টেম রোল' : 'System Role'}
                value={roleName || (isBangla ? 'কোনো রোল নেই' : 'No Role')}
                badge={
                  roleName ? (
                    <Badge variant="outline" className="text-[10px] bg-indigo-500/10 text-indigo-400 border-indigo-500/20 font-bold ml-1.5">
                      <Shield className="w-2.5 h-2.5 mr-0.5" />
                      Role
                    </Badge>
                  ) : null
                }
              />
              <DetailRow
                label={isBangla ? 'রিপোর্টিং ম্যানেজার' : 'Reporting Manager'}
                value={employee.reportingManager || '-'}
              />
              <DetailRow
                label={isBangla ? 'যোগদানের তারিখ' : 'Joining date'}
                value={employee.joiningDate ? formatDate(employee.joiningDate) : '-'}
              />
              <DetailRow
                label={isBangla ? 'চুক্তির ধরন' : 'Employment type'}
                value={employee.employmentStatus || 'Full Time'}
              />
              <DetailRow
                label={isBangla ? 'কাজের শিফট' : 'Work shift'}
                value={employee.workShift || employee.shift || 'Day'}
              />
              <DetailRow
                label={isBangla ? 'সাপ্তাহিক কার্যদিবস' : 'Working days'}
                value={employee.workingDays ? `${employee.workingDays} ${isBangla ? 'দিন / সপ্তাহ' : 'Days / Week'}` : '-'}
              />
              <DetailRow
                label={isBangla ? 'প্রবেশনারি অবস্থা' : 'Probation'}
                value={employee.isProbation ? (isBangla ? 'হ্যাঁ (পরীক্ষামূলক)' : 'Yes (Under Probation)') : (isBangla ? 'না (নিশ্চিত কর্মী)' : 'No (Confirmed)')}
              />
            </div>
          </div>

          {/* Card: Compensation & Banking */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs">
            <div className="mb-4">
              <h2 className="text-base font-bold text-foreground">
                {isBangla ? 'বেতন ও ব্যাংকিং' : 'Compensation & Banking'}
              </h2>
            </div>

            <div className="space-y-2">
              <DetailRow
                label={isBangla ? 'মূল বেতন' : 'Basic salary'}
                value={
                  <span className="text-emerald-500 font-bold">
                    {formatCurrency(employee.basicSalary ?? employee.salary ?? 0)}
                  </span>
                }
              />
              <DetailRow
                label={isBangla ? 'বেতন চক্র' : 'Salary cycle'}
                value={formatSalaryCycle(employee.salaryCycle)}
              />
              <DetailRow
                label={isBangla ? 'পরিশোধের মাধ্যম' : 'Payment method'}
                value={formatPaymentMethod(employee.paymentMethod)}
              />
              <DetailRow
                label={isBangla ? 'ব্যাংক / ওয়ালেট' : 'Bank / Provider'}
                value={employee.bankName || '-'}
              />
              <DetailRow
                label={isBangla ? 'অ্যাকাউন্ট / ওয়ালেট নং' : 'Account / Wallet no'}
                value={employee.accountNumber || '-'}
                isMono
              />
              <DetailRow
                label={isBangla ? 'শাখা / রাউটিং নং' : 'Branch / Routing no'}
                value={employee.branchOrRoutingNo || '-'}
                isMono
              />
              <DetailRow
                label={isBangla ? 'ভাতা ও সুবিধাসমূহ' : 'Allowances & benefits'}
                value={employee.allowancesAndBenefits || '-'}
              />
              {employee.payrollRemarks && (
                <DetailRow
                  label={isBangla ? 'বেতন সংক্রান্ত মন্তব্য' : 'Payroll remarks'}
                  value={employee.payrollRemarks}
                />
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  badge,
  isMono,
}: {
  label: string;
  value: React.ReactNode;
  badge?: React.ReactNode;
  isMono?: boolean;
}) {
  return (
    <div className="flex items-start gap-6 sm:gap-8 py-1.5">
      <span className="text-xs text-muted-foreground w-44 sm:w-52 shrink-0 font-medium">{label}</span>
      <div className={`text-xs sm:text-sm font-semibold text-foreground flex-1 flex items-center gap-2 min-w-0 ${isMono ? 'font-mono' : ''}`}>
        <span className="truncate">{value || '-'}</span>
        {badge}
      </div>
    </div>
  );
}
 