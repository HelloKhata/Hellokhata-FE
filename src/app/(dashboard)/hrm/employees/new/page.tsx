'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  UserPlus,
  User,
  Phone,
  Mail,
  MapPin,
  Banknote,
  Building2,
  Briefcase,
  Layers,
  Calendar,
  Trash2,
  AlertCircle,
  ShieldCheck,
  CreditCard,
  Landmark,
  Smartphone,
  Info,
  Camera,
  RefreshCw,
  Upload,
  Trophy,
  BadgeCheck,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/common';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { HRM_BRANCHES } from '@/components/hrm/mock-data';
import { DEPARTMENTS, DESIGNATIONS } from '@/components/hrm/types';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/stores/uiStore';
import { useCreateEmployee } from '@/hooks/api/useEmployes';

export default function AddEmployeePage() {
  const { isBangla } = useAppTranslation();
  const router = useRouter();
  const { sidebarCollapsed } = useUiStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // api state
  const { mutate: createEmployee, isPending: isCreating } = useCreateEmployee();
  // Form states - General
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // Form states - Personal
  const [fullName, setFullName] = useState('');
  const [employeeId, setEmployeeId] = useState(`HK-${Math.floor(1000 + Math.random() * 9000)}`);
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('MALE');
  const [bloodGroup, setBloodGroup] = useState('A_PLUS');
  const [maritalStatus, setMaritalStatus] = useState('SINGLE');
  const [nid, setNid] = useState('');
  const [passport, setPassport] = useState('');
  const [nationality, setNationality] = useState(isBangla ? 'বাংলাদেশী' : 'Bangladeshi');
  const [religion, setReligion] = useState('Islam');

  // Form states - Contact
  const [phoneVal, setPhoneVal] = useState('');
  const [emailVal, setEmailVal] = useState('');
  const [presentAddress, setPresentAddress] = useState('');

  // Form states - Employment
  const [branch, setBranch] = useState(HRM_BRANCHES[0]?.id || 'b1');
  const [department, setDepartment] = useState(DEPARTMENTS[1] || 'Sales');
  const [designation, setDesignation] = useState(DESIGNATIONS[2] || 'Sales Executive');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [manager, setManager] = useState('');
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split('T')[0]);
  const [employmentType, setEmploymentType] = useState('Full Time');
  const [workShift, setWorkShift] = useState('Day');
  const [workingDays, setWorkingDays] = useState('5');
  const [probation, setProbation] = useState('Yes (3 Months)');
  const [status, setStatus] = useState('ACTIVE');

  // Form states - Salary
  const [salaryVal, setSalaryVal] = useState('');
  const [salaryType, setSalaryType] = useState('MONTHLY');


  const [paymentMethod, setPaymentMethod] = useState<'BANK_TRANSFER' | 'MOBILE_BANKING' | 'CASH' | 'CHEQUE'>('BANK_TRANSFER');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankBranch, setBankBranch] = useState('');
  const [mobileBanking, setMobileBanking] = useState('bKash');
  const [mobileWalletNumber, setMobileWalletNumber] = useState('');
  const [allowances, setAllowances] = useState('');
  const [notesVal, setNotesVal] = useState('');

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [, setTouched] = useState<Record<string, boolean>>({});

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(isBangla ? 'ছবির সাইজ সর্বোচ্চ ২MB হতে পারে' : 'Image size must be within 2MB');
        return;
      }
      setPhotoUrl(URL.createObjectURL(file));
      toast.success(isBangla ? 'ছবি আপলোড সফল হয়েছে' : 'Photo uploaded successfully');
    }
  };

  const handleRemovePhoto = () => {
    setPhotoUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.info(isBangla ? 'ছবি মুছে ফেলা হয়েছে' : 'Photo removed');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = isBangla ? 'পূর্ণ নাম আবশ্যক' : 'Full name is required';
    }
    if (!employeeId.trim()) {
      newErrors.employeeId = isBangla ? 'কর্মচারী আইডি আবশ্যক' : 'Employee ID is required';
    }
    if (!phoneVal.trim()) {
      newErrors.phone = isBangla ? 'মোবাইল নম্বর আবশ্যক' : 'Phone number is required';
    }
    if (!branch) {
      newErrors.branch = isBangla ? 'শাখা নির্বাচন করুন' : 'Branch is required';
    }
    if (!department) {
      newErrors.department = isBangla ? 'বিভাগ নির্বাচন করুন' : 'Department is required';
    }
    if (!designation) {
      newErrors.designation = isBangla ? 'পদবি নির্বাচন করুন' : 'Designation is required';
    }
    if (!salaryVal || parseFloat(salaryVal) <= 0) {
      newErrors.salary = isBangla ? 'মূল বেতন আবশ্যক' : 'Basic salary is required';
    }
    if (role && role !== 'none') {
      if (!password.trim()) {
        newErrors.password = isBangla ? 'পাসওয়ার্ড আবশ্যক' : 'Password is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      fullName: true,
      employeeId: true,
      phone: true,
      branch: true,
      department: true,
      designation: true,
      salary: true,
      ...(role && role !== 'none' ? { password: true } : {}),
    });

    if (!validateForm()) {
      toast.error(
        isBangla
          ? 'অনুগ্রহ করে সকল আবশ্যক ক্ষেত্রগুলো পূরণ করুন'
          : 'Please fill all required fields marked with *'
      );

      // Intelligent scroll to first error
      const firstErrorField = document.querySelector('[aria-invalid="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (firstErrorField as HTMLElement).focus?.();
      }
      return;
    }

    const payload = {
      fullName: fullName.trim(),
      employeeId: employeeId.trim(),
      imageUrl: photoUrl || '',
      dateOfBirth: new Date(dob).toISOString().split('T')[0] || '',
      gender: gender,
      bloodGroup: bloodGroup,
      maritalStatus: maritalStatus,
      nationalId: nid.trim(),
      passportNo: passport.trim(),
      nationality: nationality.trim(),
      religion: religion,
      phoneNumber: phoneVal.trim(),
      emailAddress: emailVal.trim(),
      presentAddress: presentAddress.trim(),
      branchId: 'cmu2iml45002401pl74asd47u',
      department: department,
      designation: designation,
      // branchIds: [branch],
      ...(role && role !== 'none'
        ? {
            roleId: role === 'Admin' || role === 'HR' || role === 'Manager' || role === 'Employee' ? 'cmu2iml46002501plbvxgcxaa' : role,
            password: password.trim(),
          }
        : {}),
      reportingManager: manager.trim(),
      joiningDate: joiningDate || '',
      employmentStatus: employmentType,
      workShift: workShift,
      workingDays: String(workingDays),
      isProbation: probation.toLowerCase().includes('yes'),
      status: status,
      basicSalary: parseFloat(salaryVal) || 0,
      salaryCycle: salaryType,
      paymentMethod: paymentMethod,
      bankName:
        paymentMethod === 'BANK_TRANSFER'
          ? bankName.trim()
          : paymentMethod === 'MOBILE_BANKING'
          ? mobileBanking
          : '',
      accountNumber:
        paymentMethod === 'BANK_TRANSFER'
          ? accountNumber.trim()
          : paymentMethod === 'MOBILE_BANKING'
          ? mobileWalletNumber.trim()
          : '',
      branchOrRoutingNo: paymentMethod === 'BANK_TRANSFER' ? bankBranch.trim() : '',
      allowancesAndBenefits:  allowances,
      payrollRemarks: notesVal.trim(),
    };

    console.log(payload)
    createEmployee(payload, {
      onSuccess: () => {
        toast.success(
          isBangla
            ? 'নতুন কর্মচারী প্রোফাইল সফলভাবে তৈরি হয়েছে!'
            : 'New employee profile created successfully!'
        );
        router.push('/hrm/employees');
      },
      
    });
  };

  const generateNewId = () => {
    const newId = `HK-${Math.floor(1000 + Math.random() * 9000)}`;
    setEmployeeId(newId);
    toast.info(isBangla ? `নতুন আইডি জেনারেট হয়েছে: ${newId}` : `Generated ID: ${newId}`);
  };

  return (
    <div className="w-full space-y-6 pb-20 px-1 sm:px-2">
      {/* 1. TOP HEADER */}
      <div className="flex items-center justify-between gap-4 py-2">
        <div className="flex items-center gap-3">
          <BackButton fallbackHref="/hrm/employees" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
              <span>{isBangla ? 'নতুন কর্মচারী যোগ করুন' : 'Add New Employee'}</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {isBangla
                ? 'একটি সম্পূর্ণ নতুন কর্মচারী প্রোফাইল ও বেতন বিবরণী তৈরি করুন।'
                : 'Create a new employee profile and employment arrangement.'}
            </p>
          </div>
        </div>
      </div>

      {/* FORM CONTAINER */}
      <form onSubmit={handleCreate} className="space-y-6">
        {/* ========================================================
            SECTION 1: PERSONAL INFORMATION
            ======================================================== */}
        <div
          id="personal"
          className="rounded-2xl border border-slate-800/90 bg-[#0d131f]/95 shadow-2xl shadow-black/40 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-slate-700/80"
        >
          {/* Section Header */}
          <div className="p-5 sm:p-6 pb-4 sm:pb-5 border-b border-slate-800/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 shrink-0 shadow-sm shadow-indigo-500/20">
                <User className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500" />
                  <h2 className="text-sm sm:text-base font-bold text-slate-100 tracking-wider uppercase">
                    {isBangla ? 'ব্যক্তিগত তথ্য' : 'PERSONAL INFORMATION'}
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isBangla
                    ? 'মৌলিক পরিচয়, ছবি ও জনসংখ্যাতাত্ত্বিক বিবরণ'
                    : 'Basic identity, photo, and demographic details'}
                </p>
              </div>
            </div>
            <div className="text-[10px] sm:text-[11px] font-bold tracking-widest text-slate-400 uppercase bg-slate-800/70 border border-slate-700/60 px-3 py-1 rounded-full shadow-inner font-mono shrink-0">
              {isBangla ? 'বিভাগ ০১' : 'SECTION 01'}
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-6">
            {/* 1.1 Compact Photo Upload */}
            <div className="p-4 sm:p-5 rounded-xl border border-slate-800/80 bg-slate-900/40 space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-xs shadow-indigo-400/50" />
                <span className="text-xs font-bold text-indigo-300/90 uppercase tracking-wider">
                  {isBangla ? 'কর্মচারীর ছবি' : 'EMPLOYEE PHOTO'}
                </span>
                <span className="text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                  {isBangla ? 'প্রস্তাবিত' : 'Recommended'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 pt-1">
                <div className="relative group shrink-0">
                  <div className="h-20 w-20 rounded-xl border border-dashed border-slate-700 bg-slate-900/80 flex items-center justify-center overflow-hidden shadow-inner ring-1 ring-slate-800">
                    {photoUrl ? (
                      <img src={photoUrl} alt="Employee Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-9 w-9 text-slate-600" />
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-center sm:text-left flex-1">
                  <p className="text-xs text-slate-400">
                    {isBangla
                      ? 'পেশাদার স্পষ্ট ছবি আপলোড করুন (JPG, PNG, সর্বোচ্চ ২MB)।'
                      : 'Upload professional photo (JPG, PNG, max 2MB).'}
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-input"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-8.5 px-4 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      {photoUrl
                        ? isBangla ? 'ছবি পরিবর্তন করুন' : 'Change Photo'
                        : isBangla ? 'ছবি আপলোড' : 'Upload'}
                    </Button>

                    {photoUrl && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemovePhoto}
                        className="h-8.5 text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        {isBangla ? 'মুছে ফেলুন' : 'Remove'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 1.2 Basic Identity Subsection */}
            <div className="space-y-3.5">
              <div className="text-xs font-bold text-indigo-300/90 uppercase tracking-wider flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-xs shadow-indigo-400/50" />
                <span>{isBangla ? 'মৌলিক পরিচয়' : 'BASIC IDENTITY'}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                    {isBangla ? 'পূর্ণ নাম' : 'Full Name'} <span className="text-rose-400 font-bold">*</span>
                  </Label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                      }}
                      placeholder={isBangla ? 'যেমন: আবদুর রহমান' : 'Abdur Rahman'}
                      aria-invalid={!!errors.fullName}
                      className={cn(
                        'pl-10 h-10.5 bg-slate-900/60 border-slate-800/90 text-slate-100 placeholder:text-slate-500 rounded-lg focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/30 transition-all',
                        errors.fullName && 'border-rose-500/80 focus-visible:ring-rose-500/30'
                      )}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" /> {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Employee ID */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="employeeId" className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                      {isBangla ? 'কর্মচারী আইডি' : 'Employee ID'} <span className="text-rose-400 font-bold">*</span>
                    </Label>
                    <button
                      type="button"
                      onClick={generateNewId}
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer font-medium transition-colors"
                      title={isBangla ? 'নতুন আইডি তৈরি করুন' : 'Generate new ID'}
                    >
                      <RefreshCw className="h-3 w-3" />
                      <span>{isBangla ? 'অটো-জেনারেট' : 'Auto-generate'}</span>
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <BadgeCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400/80 pointer-events-none" />
                    <Input
                      id="employeeId"
                      value={employeeId}
                      onChange={(e) => {
                        setEmployeeId(e.target.value);
                        if (errors.employeeId) setErrors((prev) => ({ ...prev, employeeId: '' }));
                      }}
                      placeholder="HK-9638"
                      aria-invalid={!!errors.employeeId}
                      className={cn(
                        'pl-10 h-10.5 font-mono font-medium bg-slate-900/60 border-slate-800/90 text-indigo-300 placeholder:text-slate-500 rounded-lg focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/30 transition-all',
                        errors.employeeId && 'border-rose-500/80 focus-visible:ring-rose-500/30'
                      )}
                    />
                  </div>
                  {errors.employeeId && (
                    <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" /> {errors.employeeId}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 1.3 Personal Details Subsection */}
            <div className="space-y-3.5 pt-2 border-t border-slate-800/60">
              <div className="text-xs font-bold text-indigo-300/90 uppercase tracking-wider flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-xs shadow-indigo-400/50" />
                <span>{isBangla ? 'ব্যক্তিগত বিবরণ' : 'PERSONAL DETAILS'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* Date of Birth */}
                <div className="space-y-1.5">
                  <Label htmlFor="dob" className="text-xs font-semibold text-slate-300">
                    {isBangla ? 'জন্ম তারিখ' : 'Date of Birth'}
                  </Label>
                  <div className="relative flex items-center">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                    <Input
                      id="dob"
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="pl-10 h-10.5 font-mono text-sm bg-slate-900/60 border-slate-800/90 text-slate-100 rounded-lg focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/30 transition-all"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-300">
                    {isBangla ? 'লিঙ্গ' : 'Gender'}
                  </Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className="w-full h-10.5 bg-slate-900/60 border-slate-800/90 text-slate-100 rounded-lg focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                      <SelectItem value="MALE">{isBangla ? 'পুরুষ (Male)' : 'Male'}</SelectItem>
                      <SelectItem value="FEMALE">{isBangla ? 'নারী (Female)' : 'Female'}</SelectItem>
                      <SelectItem value="OTHER">{isBangla ? 'অন্যান্য (Other)' : 'Other'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Blood Group */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-300">
                    {isBangla ? 'রক্তের গ্রুপ' : 'Blood Group'}
                  </Label>
                  <Select value={bloodGroup} onValueChange={setBloodGroup}>
                    <SelectTrigger className="w-full h-10.5 font-mono bg-slate-900/60 border-slate-800/90 text-slate-100 rounded-lg focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-100 font-mono">
                      {["A_PLUS", "A_MINUS", "B_PLUS", "B_MINUS", "AB_PLUS", "AB_MINUS", "O_PLUS", "O_MINUS"].map((bg) => (
                        <SelectItem key={bg} value={bg}>
                          {bg.split('_')[0] + " " + (bg.split('_')[1] == "PLUS" ? '+' : '-')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Marital Status */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-300">
                    {isBangla ? 'বৈবাহিক অবস্থা' : 'Marital Status'}
                  </Label>
                  <Select value={maritalStatus} onValueChange={setMaritalStatus}>
                    <SelectTrigger className="w-full h-10.5 bg-slate-900/60 border-slate-800/90 text-slate-100 rounded-lg focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                      <SelectItem value="SINGLE">{isBangla ? 'অবিবাহিত (Single)' : 'Single'}</SelectItem>
                      <SelectItem value="MARRIED">{isBangla ? 'বিবাহিত (Married)' : 'Married'}</SelectItem>
                      <SelectItem value="DIVORCED">{isBangla ? 'তালাকপ্রাপ্ত (Divorced)' : 'Divorced'}</SelectItem>
                      <SelectItem value="WIDOW">{isBangla ? 'বিধবা/বিপত্নীক (Widowed)' : 'Widowed'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* 1.4 Identity & Demographics Subsection */}
            <div className="space-y-3.5 pt-2 border-t border-slate-800/60">
              <div className="text-xs font-bold text-indigo-300/90 uppercase tracking-wider flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-xs shadow-indigo-400/50" />
                <span>{isBangla ? 'জাতীয়তা ও পরিচয়পত্র' : 'IDENTITY & DEMOGRAPHICS'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* NID */}
                <div className="space-y-1.5">
                  <Label htmlFor="nidVal" className="text-xs font-semibold text-slate-300">
                    {isBangla ? 'জাতীয় পরিচয়পত্র নম্বর (NID)' : 'National ID (NID)'}
                  </Label>
                  <Input
                    id="nidVal"
                    value={nid}
                    onChange={(e) => setNid(e.target.value)}
                    placeholder="1993269145829103"
                    className="h-10.5 font-mono bg-slate-900/60 border-slate-800/90 text-slate-100 placeholder:text-slate-500 rounded-lg focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/30 transition-all"
                  />
                </div>

                {/* Passport */}
                <div className="space-y-1.5">
                  <Label htmlFor="passportVal" className="text-xs font-semibold text-slate-300">
                    {isBangla ? 'পাসপোর্ট নম্বর (ঐচ্ছিক)' : 'Passport No (Optional)'}
                  </Label>
                  <Input
                    id="passportVal"
                    value={passport}
                    onChange={(e) => setPassport(e.target.value)}
                    placeholder="e.g. EGXXXXXXX"
                    className="h-10.5 font-mono bg-slate-900/60 border-slate-800/90 text-slate-100 placeholder:text-slate-500 rounded-lg focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/30 transition-all"
                  />
                </div>

                {/* Nationality */}
                <div className="space-y-1.5">
                  <Label htmlFor="nationalityVal" className="text-xs font-semibold text-slate-300">
                    {isBangla ? 'জাতীয়তা' : 'Nationality'}
                  </Label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 px-1.5 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-300 select-none pointer-events-none">
                      BD
                    </div>
                    <Input
                      id="nationalityVal"
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      className="pl-12 h-10.5 bg-slate-900/60 border-slate-800/90 text-slate-100 placeholder:text-slate-500 rounded-lg focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/30 transition-all"
                    />
                  </div>
                </div>

                {/* Religion */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-300">
                    {isBangla ? 'ধর্ম' : 'Religion'}
                  </Label>

                  <Select value={religion} onValueChange={setReligion}>
                    <SelectTrigger className="w-full h-10.5 bg-slate-900/60 border-slate-800/90 text-slate-100 rounded-lg focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                      <SelectItem value="ISLAM">{isBangla ? 'ইসলাম (Islam)' : 'Islam'}</SelectItem>
                      <SelectItem value="HINDUISM">{isBangla ? 'হিন্দু (Hinduism)' : 'Hinduism'}</SelectItem>
                      <SelectItem value="BUDDHISM">{isBangla ? 'বৌদ্ধ (Buddhism)' : 'Buddhism'}</SelectItem>
                      <SelectItem value="CHRISTIANITY">{isBangla ? 'খ্রিস্টান (Christianity)' : 'Christianity'}</SelectItem>
                      <SelectItem value="OTHER">{isBangla ? 'অন্যান্য (Others)' : 'Others'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            SECTION 2: CONTACT INFORMATION
            ======================================================== */}
        <div
          id="contact"
          className="rounded-2xl border border-slate-800/90 bg-[#0d131f]/95 shadow-2xl shadow-black/40 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-slate-700/80"
        >
          {/* Section Header */}
          <div className="p-5 sm:p-6 pb-4 sm:pb-5 border-b border-slate-800/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 shrink-0 shadow-sm shadow-indigo-500/20">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500" />
                  <h2 className="text-sm sm:text-base font-bold text-slate-100 tracking-wider uppercase">
                    {isBangla ? 'যোগাযোগের তথ্য' : 'CONTACT INFORMATION'}
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isBangla
                    ? 'মোবাইল নম্বর, ইমেইল ও বর্তমান ঠিকানার বিবরণ'
                    : 'Phone, email, and present address details'}
                </p>
              </div>
            </div>
            <div className="text-[10px] sm:text-[11px] font-bold tracking-widest text-slate-400 uppercase bg-slate-800/70 border border-slate-700/60 px-3 py-1 rounded-full shadow-inner font-mono shrink-0">
              {isBangla ? 'বিভাগ ০২' : 'SECTION 02'}
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-6">
            {/* 2.1 Primary Contact Details */}
            <div className="space-y-3.5">
              <div className="text-xs font-bold text-indigo-300/90 uppercase tracking-wider flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-xs shadow-indigo-400/50" />
                <span>{isBangla ? 'প্রাথমিক যোগাযোগ' : 'PRIMARY CONTACT'}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone Number */}
                <div className="space-y-1.5">
                  <Label htmlFor="phoneVal" className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                    {isBangla ? 'মোবাইল নম্বর' : 'Phone Number'} <span className="text-rose-400 font-bold">*</span>
                  </Label>
                  <div className="relative flex items-center">
                    <div className="absolute left-2.5 flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-800/80 border border-slate-700/80 text-[11px] font-semibold text-slate-300 select-none pointer-events-none">
                      <span className="font-bold text-indigo-400">BD</span>
                      <span className="text-slate-400">+880</span>
                    </div>
                    <Input
                      id="phoneVal"
                      value={phoneVal}
                      onChange={(e) => {
                        setPhoneVal(e.target.value);
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                      }}
                      placeholder="01712345678"
                      aria-invalid={!!errors.phone}
                      className={cn(
                        'pl-24 h-10.5 font-mono bg-slate-900/60 border-slate-800/90 text-slate-100 placeholder:text-slate-500 rounded-lg focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/30 transition-all',
                        errors.phone && 'border-rose-500/80 focus-visible:ring-rose-500/30'
                      )}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" /> {errors.phone}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <Label htmlFor="emailVal" className="text-xs font-semibold text-slate-300">
                    {isBangla ? 'ইমেইল ঠিকানা' : 'Email Address'}
                  </Label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                    <Input
                      id="emailVal"
                      type="email"
                      value={emailVal}
                      onChange={(e) => setEmailVal(e.target.value)}
                      placeholder="abdur.rahman@hellokhata.com"
                      className="pl-10 h-10.5 bg-slate-900/60 border-slate-800/90 text-slate-100 placeholder:text-slate-500 rounded-lg focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/30 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2.2 Address */}
            <div className="space-y-3.5 pt-2 border-t border-slate-800/60">
              <div className="text-xs font-bold text-indigo-300/90 uppercase tracking-wider flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-xs shadow-indigo-400/50" />
                <span>{isBangla ? 'ঠিকানা' : 'ADDRESS'}</span>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="presentAddress" className="text-xs font-semibold text-slate-300">
                  {isBangla ? 'বর্তমান ঠিকানা' : 'Present Address'}
                </Label>
                <div className="relative flex items-center">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                  <Input
                    id="presentAddress"
                    value={presentAddress}
                    onChange={(e) => setPresentAddress(e.target.value)}
                    placeholder={isBangla ? 'যেমন: বাড়ি # ৪২, রোড # ১১, বনানী ব্লক-ডি, ঢাকা' : 'House # 42, Road # 11, Banani Block-D, Dhaka'}
                    className="pl-10 h-10.5 bg-slate-900/60 border-slate-800/90 text-slate-100 placeholder:text-slate-500 rounded-lg focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/30 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            SECTION 3: EMPLOYMENT INFORMATION
            ======================================================== */}
        <div
          id="employment"
          className="rounded-2xl border border-slate-800/90 bg-[#0d131f]/95 shadow-2xl shadow-black/40 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-slate-700/80"
        >
          {/* Section Header */}
          <div className="p-5 sm:p-6 pb-4 sm:pb-5 border-b border-slate-800/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 shrink-0 shadow-sm shadow-indigo-500/20">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500" />
                  <h2 className="text-sm sm:text-base font-bold text-slate-100 tracking-wider uppercase">
                    {isBangla ? 'কর্মসংস্থান তথ্য' : 'EMPLOYMENT INFORMATION'}
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isBangla
                    ? 'শাখা, বিভাগ, পদবি, ভূমিকা ও কাজের শর্তাবলী'
                    : 'Branch, department, designation, role and work terms'}
                </p>
              </div>
            </div>
            <div className="text-[10px] sm:text-[11px] font-bold tracking-widest text-slate-400 uppercase bg-slate-800/70 border border-slate-700/60 px-3 py-1 rounded-full shadow-inner font-mono shrink-0">
              {isBangla ? 'বিভাগ ০৩' : 'SECTION 03'}
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-6">
            {/* 3.1 Organization Structure */}
            <div className="space-y-3.5">
              <div className="text-xs font-bold text-indigo-300/90 uppercase tracking-wider flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-xs shadow-indigo-400/50" />
                <span>{isBangla ? 'প্রাতিষ্ঠানিক কাঠামো' : 'ORGANIZATION STRUCTURE'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Branch */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                    {isBangla ? 'শাখা' : 'Branch'} <span className="text-rose-400 font-bold">*</span>
                  </Label>
                  <Select value={branch} onValueChange={setBranch}>
                    <SelectTrigger className="w-full h-10.5 bg-slate-900/60 border-slate-800/90 text-slate-100 rounded-lg focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/30">
                      <div className="flex items-center gap-2 truncate">
                        <Building2 className="h-4 w-4 text-indigo-400 shrink-0" />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                      {HRM_BRANCHES.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Department */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                    {isBangla ? 'বিভাগ' : 'Department'} <span className="text-rose-400 font-bold">*</span>
                  </Label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger className="w-full h-10.5 bg-slate-900/60 border-slate-800/90 text-slate-100 rounded-lg focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/30">
                      <div className="flex items-center gap-2 truncate">
                        <Layers className="h-4 w-4 text-indigo-400 shrink-0" />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                      {DEPARTMENTS.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Designation */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                    {isBangla ? 'পদবি' : 'Designation'} <span className="text-rose-400 font-bold">*</span>
                  </Label>
                  <Select value={designation} onValueChange={setDesignation}>
                    <SelectTrigger className="w-full h-10.5 bg-slate-900/60 border-slate-800/90 text-slate-100 rounded-lg focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/30">
                      <div className="flex items-center gap-2 truncate">
                        <Trophy className="h-4 w-4 text-indigo-400 shrink-0" />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                      {DESIGNATIONS.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* 3.2 Role & Hierarchy */}
            <div className="space-y-3.5 pt-2 border-t border-slate-800/60">
              <div className="text-xs font-bold text-indigo-300/90 uppercase tracking-wider flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-xs shadow-indigo-400/50" />
                <span>{isBangla ? 'ভূমিকা ও নিয়োগ শর্ত' : 'ROLE & EMPLOYMENT TERMS'}</span>
              </div>

              <div className={cn(
                'grid grid-cols-1 sm:grid-cols-2 gap-4',
                role && role !== 'none' ? 'md:grid-cols-4' : 'md:grid-cols-3'
              )}>
                {/* System Role */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                    {isBangla ? 'সিস্টেম রোল' : 'System Role'}
                  </Label>
                  <Select
                    value={role}
                    onValueChange={(val) => {
                      setRole(val);
                      if (!val || val === 'none') {
                        setPassword('');
                        setErrors((prev) => ({ ...prev, password: '' }));
                      }
                    }}
                  >
                    <SelectTrigger className="w-full h-10.5 bg-slate-900/60 border-slate-800/90 text-slate-100 rounded-lg focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/30">
                      <div className="flex items-center gap-2 truncate">
                        <ShieldCheck className="h-4 w-4 text-indigo-400 shrink-0" />
                        <SelectValue placeholder={isBangla ? 'রোল নির্বাচন করুন (ঐচ্ছিক)' : 'Select Role (Optional)'} />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                      <SelectItem value="none">{isBangla ? 'কোনো রোল নেই (ঐচ্ছিক)' : 'No Role (Optional)'}</SelectItem>
                      <SelectItem value="Admin">Admin (পূর্ণ নিয়ন্ত্রণ)</SelectItem>
                      <SelectItem value="HR">HR Manager (মানবসম্পদ)</SelectItem>
                      <SelectItem value="Manager">Manager (ব্যবস্থাপক)</SelectItem>
                      <SelectItem value="Employee">Employee (সাধারণ কর্মচারী)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Reporting Manager */}
                <div className="space-y-1.5">
                  <Label htmlFor="manager" className="text-xs font-semibold text-slate-300">
                    {isBangla ? 'রিপোর্টিং ম্যানেজার' : 'Reporting Manager'}
                  </Label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                    <Input
                      id="manager"
                      value={manager}
                      onChange={(e) => setManager(e.target.value)}
                      placeholder={isBangla ? 'যেমন: মাসুদ রানা' : 'Masud Rana'}
                      className="pl-10 h-10.5 bg-slate-900/60 border-slate-800/90 text-slate-100 placeholder:text-slate-500 rounded-lg focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/30 transition-all"
                    />
                  </div>
                </div>

                {/* Joining Date */}
                <div className="space-y-1.5">
                  <Label htmlFor="joining" className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                    {isBangla ? 'যোগদানের তারিখ' : 'Joining Date'} <span className="text-rose-400 font-bold">*</span>
                  </Label>
                  <div className="relative flex items-center">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                    <Input
                      id="joining"
                      type="date"
                      value={joiningDate}
                      onChange={(e) => setJoiningDate(e.target.value)}
                      className="pl-10 h-10.5 font-mono text-sm bg-slate-900/60 border-slate-800/90 text-slate-100 rounded-lg focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/30 transition-all"
                    />
                  </div>
                </div>

                {/* Login Password - Only displayed when role is selected */}
                {role && role !== 'none' && (
                  <div className="space-y-1.5">
                    <Label htmlFor="passwordVal" className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                      {isBangla ? 'লগইন পাসওয়ার্ড' : 'Login Password'} <span className="text-rose-400 font-bold">*</span>
                    </Label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                      <Input
                        id="passwordVal"
                        type="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                        }}
                        placeholder="••••••••"
                        aria-invalid={!!errors.password}
                        className={cn(
                          'pl-10 h-10.5 font-mono text-sm bg-slate-900/60 border-slate-800/90 text-slate-100 placeholder:text-slate-500 rounded-lg focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/30 transition-all',
                          errors.password && 'border-rose-500/80 focus-visible:ring-rose-500/30'
                        )}
                      />
                    </div>
                    {errors.password && (
                      <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" /> {errors.password}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 3.3 Work Schedule & Status */}
            <div className="space-y-3.5 pt-2 border-t border-slate-800/60">
              <div className="text-xs font-bold text-indigo-300/90 uppercase tracking-wider flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-xs shadow-indigo-400/50" />
                <span>{isBangla ? 'কাজের শিফট ও স্ট্যাটাস' : 'WORK SCHEDULE & STATUS'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Employment Type */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-300">
                    {isBangla ? 'চাকরির ধরণ' : 'Employment Type'}
                  </Label>
                  <Select value={employmentType} onValueChange={setEmploymentType}>
                    <SelectTrigger className="w-full h-10.5 bg-slate-900/60 border-slate-800/90 text-slate-100 rounded-lg focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                      <SelectItem value="Full Time">{isBangla ? 'স্থায়ী (Full Time)' : 'Full Time'}</SelectItem>
                      <SelectItem value="Part Time">{isBangla ? 'খণ্ডকালীন (Part Time)' : 'Part Time'}</SelectItem>
                      <SelectItem value="Contract">{isBangla ? 'চুক্তিভিত্তিক (Contract)' : 'Contract'}</SelectItem>
                      <SelectItem value="Intern">{isBangla ? 'ইন্টার্ন (Intern)' : 'Intern'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Work Shift */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-300">
                    {isBangla ? 'কর্ম শিফট' : 'Work Shift'}
                  </Label>
                  <Select value={workShift} onValueChange={setWorkShift}>
                    <SelectTrigger className="w-full h-10.5 bg-slate-900/60 border-slate-800/90 text-slate-100 rounded-lg focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                      <SelectItem value="Day">{isBangla ? 'ডে শিফট (Day)' : 'Day Shift'}</SelectItem>
                      <SelectItem value="Night">{isBangla ? 'নাইট শিফট (Night)' : 'Night Shift'}</SelectItem>
                      <SelectItem value="Roster">{isBangla ? 'রোস্টার (Roster)' : 'Roster'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Working Days */}
                <div className="space-y-1.5">
                  <Label htmlFor="workdays" className="text-xs font-semibold text-slate-300">
                    {isBangla ? 'কার্যদিবস (সাপ্তাহিক)' : 'Working Days'}
                  </Label>
                  <Select value={workingDays} onValueChange={setWorkingDays}>
                    <SelectTrigger className="w-full h-10.5 font-mono bg-slate-900/60 border-slate-800/90 text-slate-100 rounded-lg focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-100 font-mono">
                      <SelectItem value="5">{isBangla ? '৫ দিন/সপ্তাহ (5 Days)' : '5 Days/Week'}</SelectItem>
                      <SelectItem value="6">{isBangla ? '৬ দিন/সপ্তাহ (6 Days)' : '6 Days/Week'}</SelectItem>
                      <SelectItem value="7">{isBangla ? '৭ দিন/সপ্তাহ (7 Days)' : '7 Days/Week'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Probation */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-300">
                    {isBangla ? 'প্রবেশন সময়?' : 'Probation?'}
                  </Label>
                  <Select value={probation} onValueChange={setProbation}>
                    <SelectTrigger className="w-full h-10.5 bg-slate-900/60 border-slate-800/90 text-slate-100 rounded-lg focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                      <SelectItem value="Yes (3 Months)">{isBangla ? 'হ্যাঁ (৩ মাস)' : 'Yes (3 Months)'}</SelectItem>
                      <SelectItem value="Yes (6 Months)">{isBangla ? 'হ্যাঁ (৬ মাস)' : 'Yes (6 Months)'}</SelectItem>
                      <SelectItem value="No">{isBangla ? 'না (No)' : 'No'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-300">
                    {isBangla ? 'স্ট্যাটাস' : 'Employee Status'}
                  </Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="w-full h-10.5 bg-slate-900/60 border-slate-800/90 text-slate-100 rounded-lg focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                      <SelectItem value="ACTIVE">
                        <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500" />
                          Active
                        </span>
                      </SelectItem>
                      <SelectItem value="PROBATION">
                        <span className="flex items-center gap-1.5 font-medium text-amber-400">
                          <span className="h-2 w-2 rounded-full bg-amber-500" />
                          Probation
                        </span>
                      </SelectItem>
                      <SelectItem value="ON_LEAVE">
                        <span className="flex items-center gap-1.5 font-medium text-blue-400">
                          <span className="h-2 w-2 rounded-full bg-blue-500" />
                          On Leave
                        </span>
                      </SelectItem>
                      <SelectItem value="INACTIVE">
                        <span className="flex items-center gap-1.5 font-medium text-slate-400">
                          <span className="h-2 w-2 rounded-full bg-slate-500" />
                          Inactive
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            SECTION 4: SALARY & COMPENSATION
            ======================================================== */}
        <div
          id="salary"
          className="rounded-2xl border border-slate-800/90 bg-[#0d131f]/95 shadow-2xl shadow-black/40 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-slate-700/80"
        >
          {/* Section Header */}
          <div className="p-5 sm:p-6 pb-4 sm:pb-5 border-b border-slate-800/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 shrink-0 shadow-sm shadow-indigo-500/20">
                <Banknote className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500" />
                  <h2 className="text-sm sm:text-base font-bold text-slate-100 tracking-wider uppercase">
                    {isBangla ? 'বেতন বিবরণী ও ক্ষতিপূরণ' : 'SALARY & COMPENSATION'}
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isBangla
                    ? 'মূল বেতন, বিতরণ পদ্ধতি এবং পেমেন্ট অ্যাকাউন্ট'
                    : 'Base salary, disbursement method, and payment accounts'}
                </p>
              </div>
            </div>
            <div className="text-[10px] sm:text-[11px] font-bold tracking-widest text-slate-400 uppercase bg-slate-800/70 border border-slate-700/60 px-3 py-1 rounded-full shadow-inner font-mono shrink-0">
              {isBangla ? 'বিভাগ ০৪' : 'SECTION 04'}
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-6">
            {/* 4.1 Core Compensation */}
            <div className="space-y-3.5">
              <div className="text-xs font-bold text-indigo-300/90 uppercase tracking-wider flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-xs shadow-indigo-400/50" />
                <span>{isBangla ? 'মূল ক্ষতিপূরণ' : 'CORE COMPENSATION'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Basic Salary */}
                <div className="space-y-1.5">
                  <Label htmlFor="basicSalary" className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                    {isBangla ? 'মূল বেতন' : 'Basic Salary'} <span className="text-rose-400 font-bold">*</span>
                  </Label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 flex items-center justify-center text-indigo-400 font-bold text-base select-none pointer-events-none">
                      ৳
                    </div>
                    <Input
                      id="basicSalary"
                      type="number"
                      value={salaryVal}
                      onChange={(e) => {
                        setSalaryVal(e.target.value);
                        if (errors.salary) setErrors((prev) => ({ ...prev, salary: '' }));
                      }}
                      placeholder="35,000"
                      aria-invalid={!!errors.salary}
                      className={cn(
                        'pl-9 h-10.5 font-mono text-base font-semibold bg-slate-900/60 border-slate-800/90 text-slate-100 placeholder:text-slate-500 rounded-lg focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/30 transition-all',
                        errors.salary && 'border-rose-500/80 focus-visible:ring-rose-500/30'
                      )}
                    />
                  </div>
                  {errors.salary && (
                    <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" /> {errors.salary}
                    </p>
                  )}
                </div>

                {/* Salary Cycle */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-300">
                    {isBangla ? 'বেতনের চক্র' : 'Salary Cycle'}
                  </Label>
                  <Select value={salaryType} onValueChange={setSalaryType}>
                    <SelectTrigger className="w-full h-10.5 bg-slate-900/60 border-slate-800/90 text-slate-100 rounded-lg focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                      <SelectItem value="MONTHLY">{isBangla ? 'মাসিক (প্রতি মাসে)' : 'Monthly (প্রতি মাসে)'}</SelectItem>
                      <SelectItem value="HOURLY">{isBangla ? 'ঘণ্টাভিত্তিক (Hourly)' : 'Hourly'}</SelectItem>
                      <SelectItem value="WEEKLY">{isBangla ? 'সাপ্তাহিক (প্রতি সপ্তাহে)' : 'Weekly (প্রতি সপ্তাহে)'}</SelectItem>
                      <SelectItem value="BIWEEKLY">{isBangla ? 'পাক্ষিক (প্রতি ১৫ দিনে)' : 'Bi-weekly (প্রতি ১৫ দিনে)'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Payment Method */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-300">
                    {isBangla ? 'পেমেন্ট মাধ্যম' : 'Payment Method'}
                  </Label>
                  <Select value={paymentMethod} onValueChange={(val: any) => setPaymentMethod(val)}>
                    <SelectTrigger className="w-full h-10.5 bg-slate-900/60 border-slate-800/90 text-slate-100 rounded-lg focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                      <SelectItem value="BANK_TRANSFER">{isBangla ? 'ব্যাংক ট্রান্সফার (BEFTN/NPSB)' : 'Bank Transfer (BEFTN/NPSB)'}</SelectItem>
                      <SelectItem value="MOBILE_BANKING">{isBangla ? 'মোবাইল ব্যাংকিং (MFS)' : 'Mobile Banking (bKash/Nagad)'}</SelectItem>
                      <SelectItem value="CASH">{isBangla ? 'নগদ / ক্যাশ (Cash)' : 'Cash Payout'}</SelectItem>
                      <SelectItem value="CHEQUE">{isBangla ? 'নগদ / ক্যাশ (Cash)' : 'Cash Payout'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* 4.2 Dynamic Payment Details */}
            {paymentMethod === 'BANK_TRANSFER' && (
              <div className="space-y-3.5 pt-2 border-t border-slate-800/60">
                <div className="text-xs font-bold text-indigo-300/90 uppercase tracking-wider flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-xs shadow-indigo-400/50" />
                  <span>{isBangla ? 'ব্যাংকিং বিবরণ' : 'BANKING DETAILS'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Bank Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="bankName" className="text-xs font-semibold text-slate-300">
                      {isBangla ? 'ব্যাংকের নাম' : 'Bank Name'}
                    </Label>
                    <div className="relative flex items-center">
                      <Landmark className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                      <Input
                        id="bankName"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="City Bank Ltd"
                        className="pl-10 h-10.5 bg-slate-900/60 border-slate-800/90 text-slate-100 placeholder:text-slate-500 rounded-lg focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/30 transition-all"
                      />
                    </div>
                  </div>

                  {/* Account Number */}
                  <div className="space-y-1.5">
                    <Label htmlFor="accNumber" className="text-xs font-semibold text-slate-300">
                      {isBangla ? 'অ্যাকাউন্ট নম্বর' : 'Account Number'}
                    </Label>
                    <div className="relative flex items-center">
                      <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                      <Input
                        id="accNumber"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="1203948201948"
                        className="pl-10 h-10.5 font-mono bg-slate-900/60 border-slate-800/90 text-slate-100 placeholder:text-slate-500 rounded-lg focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/30 transition-all"
                      />
                    </div>
                  </div>

                  {/* Branch / Routing */}
                  <div className="space-y-1.5">
                    <Label htmlFor="bankBranch" className="text-xs font-semibold text-slate-300">
                      {isBangla ? 'শাখা / রাউটিং নং' : 'Branch / Routing No'}
                    </Label>
                    <div className="relative flex items-center">
                      <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                      <Input
                        id="bankBranch"
                        value={bankBranch}
                        onChange={(e) => setBankBranch(e.target.value)}
                        placeholder="Gulshan Branch – 090271"
                        className="pl-10 h-10.5 bg-slate-900/60 border-slate-800/90 text-slate-100 placeholder:text-slate-500 rounded-lg focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/30 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'MOBILE_BANKING' && (
              <div className="space-y-3.5 pt-2 border-t border-slate-800/60">
                <div className="text-xs font-bold text-indigo-300/90 uppercase tracking-wider flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-xs shadow-indigo-400/50" />
                  <span>{isBangla ? 'মোবাইল ওয়ালেট বিবরণ' : 'MOBILE BANKING (MFS) DETAILS'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-300">
                      {isBangla ? 'মোবাইল ব্যাংকিং প্রোভাইডার' : 'MFS Provider'}
                    </Label>
                    <Select value={mobileBanking} onValueChange={setMobileBanking}>
                      <SelectTrigger className="w-full h-10.5 bg-slate-900/60 border-slate-800/90 text-slate-100 rounded-lg focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                        <SelectItem value="bKash">bKash (বিকাশ)</SelectItem>
                        <SelectItem value="Nagad">Nagad (নগদ)</SelectItem>
                        <SelectItem value="Rocket">Rocket (রকেট)</SelectItem>
                        <SelectItem value="Upay">Upay (উপায়)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="mobileWalletNumber" className="text-xs font-semibold text-slate-300">
                      {isBangla ? 'ওয়ালেট মোবাইল নম্বর' : 'Wallet Account Number'}
                    </Label>
                    <div className="relative flex items-center">
                      <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                      <Input
                        id="mobileWalletNumber"
                        value={mobileWalletNumber}
                        onChange={(e) => setMobileWalletNumber(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="pl-10 h-10.5 font-mono bg-slate-900/60 border-slate-800/90 text-slate-100 placeholder:text-slate-500 rounded-lg focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/30 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'CASH' && (
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-center gap-3 text-xs text-slate-300">
                <Info className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>
                  {isBangla
                    ? 'নগদ বেতন পরিশোধ কোম্পানি ক্যাশ রেজিস্টার ও এইচআর পে-রোল রসিদ দ্বারা পরিচালিত হবে।'
                    : 'Cash salary disbursement will be logged via company cashier register and signed payslips.'}
                </span>
              </div>
            )}

            {/* 4.3 Additional Compensation & Notes */}
            <div className="space-y-3.5 pt-2 border-t border-slate-800/60">
              <div className="text-xs font-bold text-indigo-300/90 uppercase tracking-wider flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-xs shadow-indigo-400/50" />
                <span>{isBangla ? 'ভাতা ও নির্দেশাবলী' : 'ALLOWANCES & NOTES'}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Allowances & Benefits */}
                <div className="space-y-1.5">
                  <Label htmlFor="allowance" className="text-xs font-semibold text-slate-300">
                    {isBangla ? 'ভাতা ও অন্যান্য সুবিধা' : 'Allowances & Benefits'}
                  </Label>
                  <Input
                    id="allowance"
                    value={allowances}
                    onChange={(e) => setAllowances(e.target.value)}
                    placeholder={
                      isBangla
                        ? 'মেডিকেল: ২০০০, যাতায়াত: ১৫০০, খাবার: ১০০০'
                        : 'Medical: 2000, Transport: 1500, Food: 1000'
                    }
                    className="h-10.5 bg-slate-900/60 border-slate-800/90 text-slate-100 placeholder:text-slate-500 rounded-lg focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/30 transition-all"
                  />
                  <p className="text-[11px] text-slate-500">
                    {isBangla ? 'কমা দিয়ে আলাদা করুন: লেবেল: পরিমাণ' : 'Comma-separated label: amount pairs'}
                  </p>
                </div>

                {/* Payroll Remarks & Notes */}
                <div className="space-y-1.5">
                  <Label htmlFor="notesVal" className="text-xs font-semibold text-slate-300">
                    {isBangla ? 'বেতন সংক্রান্ত নোট' : 'Payroll Remarks & Notes'}
                  </Label>
                  <Input
                    id="notesVal"
                    value={notesVal}
                    onChange={(e) => setNotesVal(e.target.value)}
                    placeholder={
                      isBangla
                        ? '৬ মাস পূর্ণ হওয়ার পর উৎসব বোনাস প্রযোজ্য হবে।'
                        : 'Standard festival bonus eligible after completion of 6 months.'
                    }
                    className="h-10.5 bg-slate-900/60 border-slate-800/90 text-slate-100 placeholder:text-slate-500 rounded-lg focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/30 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= FIXED BOTTOM FORM ACTIONS ================= */}
        <div
          className={cn(
            'fixed bottom-0 right-0 z-30 bg-[#0b0f19]/95 backdrop-blur-md border-t border-slate-800/80 shadow-2xl transition-all duration-300 ease-smooth',
            'left-0 md:left-64',
            sidebarCollapsed && 'md:left-16'
          )}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-3.5 mx-auto">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push('/hrm/employees')}
              className="text-xs text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 cursor-pointer h-10 px-3 rounded-lg transition-all"
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              {isBangla ? 'কর্মচারী তালিকায় ফিরে যান' : 'Back to Employee List'}
            </Button>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <Button
                type="submit"
                disabled={isCreating}
                className="flex-1 sm:flex-none cursor-pointer font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 h-10 px-6 rounded-lg transition-all min-w-[160px]"
              >
                {isCreating ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    {isBangla ? 'তৈরি হচ্ছে...' : 'Creating...'}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <UserPlus className="h-4 w-4" />
                    {isBangla ? 'কর্মচারী তৈরি করুন' : 'Create Employee'}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
