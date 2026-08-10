'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  UserPlus,
  Save,
  User,
  Phone,
  Mail,
  MapPin,
  Banknote,
  Building2,
  Briefcase,
  Layers,
  Activity,
  Calendar,
  Upload,
  FileText,
  Trash2,
  Eye,
  Download,
  AlertTriangle,
  FolderOpen,
  Info,
  CheckCircle2,
  FileUp,
} from 'lucide-react';
import { Button, Input, Card } from '@/components/ui/premium';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface UploadedDoc {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
}

export default function AddEmployeePage() {
  const { isBangla } = useAppTranslation();
  const router = useRouter();



  // Form states - General
  const [loading, setLoading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // Form states - Personal
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [bloodGroup, setBloodGroup] = useState('A+');
  const [maritalStatus, setMaritalStatus] = useState('Single');
  const [nid, setNid] = useState('');
  const [passport, setPassport] = useState('');
  const [nationality, setNationality] = useState(isBangla ? 'বাংলাদেশী' : 'Bangladeshi');
  const [religion, setReligion] = useState('Islam');

  // Form states - Contact
  const [phoneVal, setPhoneVal] = useState('');
  const [emailVal, setEmailVal] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [presentAddress, setPresentAddress] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState(isBangla ? 'বাংলাদেশ' : 'Bangladesh');

  // Form states - Employment
  const [branch, setBranch] = useState(HRM_BRANCHES[0].id);
  const [department, setDepartment] = useState(DEPARTMENTS[1]);
  const [designation, setDesignation] = useState(DESIGNATIONS[2]);
  const [role, setRole] = useState('Employee');
  const [manager, setManager] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [employmentType, setEmploymentType] = useState('Full Time');
  const [workShift, setWorkShift] = useState('Day');
  const [workingDays, setWorkingDays] = useState('5');
  const [probation, setProbation] = useState('Yes');
  const [status, setStatus] = useState('Active');

  // Form states - Salary
  const [salaryVal, setSalaryVal] = useState('');
  const [salaryType, setSalaryType] = useState('Monthly');
  const [paymentMethod, setPaymentMethod] = useState('Bank');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [mobileBanking, setMobileBanking] = useState('bKash');
  const [allowances, setAllowances] = useState('');
  const [notesVal, setNotesVal] = useState('');

  // Documents state
  const [documents, setDocuments] = useState<UploadedDoc[]>([
    { id: '1', name: 'NID_Copy.pdf', type: 'application/pdf', size: '1.2 MB', uploadedAt: '2026-08-07' },
    { id: '2', name: 'Academic_Certificate.pdf', type: 'application/pdf', size: '2.4 MB', uploadedAt: '2026-08-07' }
  ]);
  const [previewDoc, setPreviewDoc] = useState<UploadedDoc | null>(null);



  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoUrl(URL.createObjectURL(file));
      toast.success(isBangla ? 'ছবি আপলোড সফল হয়েছে' : 'Photo uploaded successfully');
    }
  };

  const handleDocUpload = (docType: string) => {
    const mockDocNames: Record<string, string> = {
      nid: 'National_ID.pdf',
      photo: 'Profile_Photo.jpg',
      cv: 'CV_Onboarding.pdf',
      letter: 'Appointment_Letter.pdf',
      certs: 'Degree_Certificate.pdf',
      others: 'Other_Attachments.zip'
    };
    
    const newDoc: UploadedDoc = {
      id: String(Date.now()),
      name: mockDocNames[docType] || 'Attachment.pdf',
      type: docType === 'photo' ? 'image/jpeg' : 'application/pdf',
      size: '1.5 MB',
      uploadedAt: new Date().toISOString().split('T')[0]
    };

    setDocuments((prev) => [...prev, newDoc]);
    toast.success(isBangla ? `${newDoc.name} সফলভাবে আপলোড হয়েছে` : `${newDoc.name} uploaded successfully`);
  };

  const handleDocDelete = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    toast.success(isBangla ? 'নথি মুছে ফেলা হয়েছে' : 'Document removed successfully');
  };

  const handleDocDownload = (doc: UploadedDoc) => {
    toast.info(isBangla ? `${doc.name} ডাউনলোড শুরু হয়েছে...` : `Downloading ${doc.name}...`);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !phoneVal || !salaryVal || !employeeId) {
      toast.error(isBangla ? 'সব আবশ্যক ক্ষেত্র পূরণ করুন' : 'Please fill all required fields marked with *');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      toast.success(
        isBangla
          ? 'নতুন কর্মচারী প্রোফাইল সফলভাবে তৈরি হয়েছে!'
          : 'New employee profile created successfully!'
      );
      router.push('/hrm/employees');
    }, 800);
  };

  const handleSaveDraft = () => {
    toast.success(isBangla ? 'খসড়া হিসেবে সংরক্ষিত হয়েছে' : 'Saved to drafts');
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/20 pb-4">
        <div className="space-y-1">
          <button
            onClick={() => router.push('/hrm/employees')}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            {isBangla ? 'কর্মচারী তালিকায় ফিরুন' : 'Back to Employees'}
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
            {isBangla ? 'নতুন কর্মচারী যোগ করুন' : 'Add New Employee'}
          </h1>
          <p className="text-xs text-muted-foreground">
            {isBangla ? 'একটি নতুন কর্মচারী প্রোফাইল তৈরি করুন।' : 'Create a new employee profile.'}
          </p>
        </div>
        
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={() => router.push('/hrm/employees')}
            className="cursor-pointer"
          >
            {isBangla ? 'বাতিল' : 'Cancel'}
          </Button>
          <Button
            variant="outline"
            leftIcon={<Save className="h-4 w-4" />}
            onClick={handleSaveDraft}
            className="cursor-pointer border-border/60 hover:bg-muted"
          >
            {isBangla ? 'খসড়া রাখুন' : 'Save Draft'}
          </Button>
          <Button
            onClick={handleCreate}
            leftIcon={<UserPlus className="h-4 w-4" />}
            disabled={loading}
            className="cursor-pointer"
          >
            {loading ? (isBangla ? 'তৈরি হচ্ছে...' : 'Creating...') : (isBangla ? 'কর্মচারী তৈরি করুন' : 'Create Employee')}
          </Button>
        </div>
      </div>

      <div className="w-full space-y-6">
          
          {/* 3. EMPLOYEE PHOTO & PERSONAL INFORMATION */}
          <Card id="personal" padding="lg" className="bg-[#131A22] border-border/40 space-y-6">
            <div className="border-b border-border/20 pb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <User className="h-4.5 w-4.5 text-primary" />
                {isBangla ? 'ব্যক্তিগত তথ্য' : 'Personal Information'}
              </h3>
              <span className="text-[10px] font-bold text-muted-foreground uppercase bg-muted/40 px-2 py-0.5 rounded-full">Section 1</span>
            </div>

            {/* Photo Upload Section */}
            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl border border-dashed border-border/60 bg-muted/10">
              <div className="relative h-20 w-20 rounded-2xl border border-border bg-[#131A22] flex items-center justify-center overflow-hidden shrink-0">
                {photoUrl ? (
                  <img src={photoUrl} alt="Employee Preview" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-10 w-10 text-muted-foreground/40" />
                )}
              </div>
              <div className="space-y-2 text-center sm:text-left flex-1">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">{isBangla ? 'কর্মচারীর ছবি' : 'Employee Photo'}</h4>
                <p className="text-xs text-muted-foreground">{isBangla ? 'জেপিজি বা পিএনজি ফর্ম্যাটে ২ মেগাবাইটের মধ্যে দিন।' : 'Upload a professional photo in JPG/PNG format (max 2MB).'}</p>
                <div className="relative inline-block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    id="photo-input"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    leftIcon={<Upload className="h-3.5 w-3.5" />}
                    className="pointer-events-none"
                  >
                    {isBangla ? 'ছবি আপলোড করুন' : 'Upload Photo'}
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'প্রথম নাম *' : 'First Name *'}</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Abdur"
                  className="bg-[#131A22] border-border/40"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'শেষ নাম *' : 'Last Name *'}</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Rahman"
                  className="bg-[#131A22] border-border/40"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="employeeId" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'কর্মচারী আইডি *' : 'Employee ID *'}</Label>
                <Input
                  id="employeeId"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="e.g. HK-00124"
                  className="bg-[#131A22] border-border/40 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="dob" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'জন্ম তারিখ' : 'Date of Birth'}</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 z-10 pointer-events-none" />
                  <Input
                    id="dob"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="pl-9 bg-[#131A22] border-border/40 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'লিঙ্গ' : 'Gender'}</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="bg-[#131A22] border-border/40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">{isBangla ? 'পুরুষ' : 'Male'}</SelectItem>
                    <SelectItem value="Female">{isBangla ? 'নারী' : 'Female'}</SelectItem>
                    <SelectItem value="Other">{isBangla ? 'অন্যান্য' : 'Other'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'রক্তের গ্রুপ' : 'Blood Group'}</Label>
                <Select value={bloodGroup} onValueChange={setBloodGroup}>
                  <SelectTrigger className="bg-[#131A22] border-border/40 font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="font-mono">
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'বৈবাহিক অবস্থা' : 'Marital Status'}</Label>
                <Select value={maritalStatus} onValueChange={setMaritalStatus}>
                  <SelectTrigger className="bg-[#131A22] border-border/40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">{isBangla ? 'অবিবাহিত' : 'Single'}</SelectItem>
                    <SelectItem value="Married">{isBangla ? 'বিবাহিত' : 'Married'}</SelectItem>
                    <SelectItem value="Divorced">{isBangla ? 'তালাকপ্রাপ্ত' : 'Divorced'}</SelectItem>
                    <SelectItem value="Widowed">{isBangla ? 'বিপত্নীক/বিধবা' : 'Widowed'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="nidVal" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'জাতীয় পরিচয়পত্র নম্বর' : 'National ID'}</Label>
                <Input
                  id="nidVal"
                  value={nid}
                  onChange={(e) => setNid(e.target.value)}
                  placeholder="e.g. 1993XXXXXXXXX"
                  className="bg-[#131A22] border-border/40 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="passportVal" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'পাসপোর্ট নম্বর' : 'Passport No'}</Label>
                <Input
                  id="passportVal"
                  value={passport}
                  onChange={(e) => setPassport(e.target.value)}
                  placeholder="e.g. EGXXXXXXX"
                  className="bg-[#131A22] border-border/40 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="nationalityVal" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'জাতীয়তা' : 'Nationality'}</Label>
                <Input
                  id="nationalityVal"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="bg-[#131A22] border-border/40"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'ধর্ম' : 'Religion'}</Label>
                <Select value={religion} onValueChange={setReligion}>
                  <SelectTrigger className="bg-[#131A22] border-border/40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Islam">{isBangla ? 'ইসলাম' : 'Islam'}</SelectItem>
                    <SelectItem value="Hinduism">{isBangla ? 'হিন্দু' : 'Hinduism'}</SelectItem>
                    <SelectItem value="Buddhism">{isBangla ? 'বৌদ্ধ' : 'Buddhism'}</SelectItem>
                    <SelectItem value="Christianity">{isBangla ? 'খ্রিস্টান' : 'Christianity'}</SelectItem>
                    <SelectItem value="Others">{isBangla ? 'অন্যান্য' : 'Others'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* 5. CONTACT INFORMATION */}
          <Card id="contact" padding="lg" className="bg-[#131A22] border-border/40 space-y-6">
            <div className="border-b border-border/20 pb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Phone className="h-4.5 w-4.5 text-primary" />
                {isBangla ? 'যোগাযোগ তথ্য' : 'Contact Information'}
              </h3>
              <span className="text-[10px] font-bold text-muted-foreground uppercase bg-muted/40 px-2 py-0.5 rounded-full">Section 2</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="phoneVal" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'মোবাইল নম্বর *' : 'Phone *'}</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 shrink-0" />
                  <Input
                    id="phoneVal"
                    value={phoneVal}
                    onChange={(e) => setPhoneVal(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="pl-9 bg-[#131A22] border-border/40 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="emailVal" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'ইমেইল' : 'Email'}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 shrink-0" />
                  <Input
                    id="emailVal"
                    type="email"
                    value={emailVal}
                    onChange={(e) => setEmailVal(e.target.value)}
                    placeholder="example@hellokhata.com"
                    className="pl-9 bg-[#131A22] border-border/40"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="emergencyName" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'জরুরি যোগাযোগের ব্যক্তি' : 'Emergency Contact Name'}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 shrink-0" />
                  <Input
                    id="emergencyName"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    placeholder={isBangla ? 'সম্পর্কিত ব্যক্তির নাম' : "Contact person's name"}
                    className="pl-9 bg-[#131A22] border-border/40"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="emergencyPhone" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'জরুরি যোগাযোগের মোবাইল' : 'Emergency Contact Phone'}</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 shrink-0" />
                  <Input
                    id="emergencyPhone"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="pl-9 bg-[#131A22] border-border/40 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="presentAddress" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'বর্তমান ঠিকানা' : 'Present Address'}</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 shrink-0" />
                  <Input
                    id="presentAddress"
                    value={presentAddress}
                    onChange={(e) => setPresentAddress(e.target.value)}
                    placeholder={isBangla ? 'বাড়ি, রোড, এলাকা, শহর' : 'House, Road, Area, City'}
                    className="pl-9 bg-[#131A22] border-border/40"
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="permanentAddress" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'স্থায়ী ঠিকানা' : 'Permanent Address'}</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 shrink-0" />
                  <Input
                    id="permanentAddress"
                    value={permanentAddress}
                    onChange={(e) => setPermanentAddress(e.target.value)}
                    placeholder={isBangla ? 'গ্রাম, ডাকঘর, থানা, জেলা' : 'Village, Post, Thana, District'}
                    className="pl-9 bg-[#131A22] border-border/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:col-span-2">
                <div className="space-y-1.5">
                  <Label htmlFor="city" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'শহর' : 'City'}</Label>
                  <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} className="bg-[#131A22] border-border/40" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="district" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'জেলা' : 'District'}</Label>
                  <Input id="district" value={district} onChange={(e) => setDistrict(e.target.value)} className="bg-[#131A22] border-border/40" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="postal" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'পোস্টাল কোড' : 'Postal Code'}</Label>
                  <Input id="postal" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="bg-[#131A22] border-border/40 font-mono" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="country" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'দেশ' : 'Country'}</Label>
                  <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} className="bg-[#131A22] border-border/40" />
                </div>
              </div>
            </div>
          </Card>

          {/* 6. EMPLOYMENT INFORMATION */}
          <Card id="employment" padding="lg" className="bg-[#131A22] border-border/40 space-y-6">
            <div className="border-b border-border/20 pb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Briefcase className="h-4.5 w-4.5 text-primary" />
                {isBangla ? 'কর্মসংস্থান তথ্য' : 'Employment Information'}
              </h3>
              <span className="text-[10px] font-bold text-muted-foreground uppercase bg-muted/40 px-2 py-0.5 rounded-full">Section 3</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'শাখা *' : 'Branch *'}</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 z-10 pointer-events-none" />
                  <Select value={branch} onValueChange={setBranch}>
                    <SelectTrigger className="pl-9 bg-[#131A22] border-border/40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {HRM_BRANCHES.map((b) => (
                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'বিভাগ *' : 'Department *'}</Label>
                <div className="relative">
                  <Layers className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 z-10 pointer-events-none" />
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger className="pl-9 bg-[#131A22] border-border/40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'পদবি *' : 'Designation *'}</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 z-10 pointer-events-none" />
                  <Select value={designation} onValueChange={setDesignation}>
                    <SelectTrigger className="pl-9 bg-[#131A22] border-border/40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DESIGNATIONS.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'রোল / ভূমিকা *' : 'Role *'}</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="bg-[#131A22] border-border/40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="HR">HR Manager</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="manager" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'রিপোর্টিং ম্যানেজার' : 'Reporting Manager'}</Label>
                <Input
                  id="manager"
                  value={manager}
                  onChange={(e) => setManager(e.target.value)}
                  placeholder="e.g. Masud Rana"
                  className="bg-[#131A22] border-border/40"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="joining" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'যোগদানের তারিখ' : 'Joining Date'}</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 z-10 pointer-events-none" />
                  <Input
                    id="joining"
                    type="date"
                    value={joiningDate}
                    onChange={(e) => setJoiningDate(e.target.value)}
                    className="pl-9 bg-[#131A22] border-border/40 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'চাকরির ধরণ' : 'Employment Type'}</Label>
                <Select value={employmentType} onValueChange={setEmploymentType}>
                  <SelectTrigger className="bg-[#131A22] border-border/40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full Time">{isBangla ? 'স্থায়ী / ফুল টাইম' : 'Full Time'}</SelectItem>
                    <SelectItem value="Part Time">{isBangla ? 'খণ্ডকালীন' : 'Part Time'}</SelectItem>
                    <SelectItem value="Contract">{isBangla ? 'চুক্তিভিত্তিক' : 'Contract'}</SelectItem>
                    <SelectItem value="Intern">{isBangla ? 'ইন্টার্ন' : 'Intern'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'কর্ম শিফট' : 'Work Shift'}</Label>
                <Select value={workShift} onValueChange={setWorkShift}>
                  <SelectTrigger className="bg-[#131A22] border-border/40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Day">{isBangla ? 'ডে শিফট' : 'Day Shift'}</SelectItem>
                    <SelectItem value="Night">{isBangla ? 'নাইট শিফট' : 'Night Shift'}</SelectItem>
                    <SelectItem value="Roster">{isBangla ? 'রোস্টার' : 'Roster'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="workdays" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'কার্যদিবস (সাপ্তাহিক)' : 'Working Days'}</Label>
                <Input
                  id="workdays"
                  value={workingDays}
                  onChange={(e) => setWorkingDays(e.target.value)}
                  placeholder="e.g. 5 days/week"
                  className="bg-[#131A22] border-border/40 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'প্রবেশন সময়?' : 'Probation'}</Label>
                <Select value={probation} onValueChange={setProbation}>
                  <SelectTrigger className="bg-[#131A22] border-border/40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">{isBangla ? 'হ্যাঁ' : 'Yes'}</SelectItem>
                    <SelectItem value="No">{isBangla ? 'না' : 'No'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'স্ট্যাটাস' : 'Employee Status'}</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="bg-[#131A22] border-border/40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Probation">Probation</SelectItem>
                    <SelectItem value="On Leave">On Leave</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* 7. SALARY INFORMATION */}
          <Card id="salary" padding="lg" className="bg-[#131A22] border-border/40 space-y-6">
            <div className="border-b border-border/20 pb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Banknote className="h-4.5 w-4.5 text-primary" />
                {isBangla ? 'বেতন বিবরণী' : 'Salary Information'}
              </h3>
              <span className="text-[10px] font-bold text-muted-foreground uppercase bg-muted/40 px-2 py-0.5 rounded-full">Section 4</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="basicSalary" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'মূল বেতন *' : 'Basic Salary *'}</Label>
                <div className="relative">
                  <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 shrink-0" />
                  <Input
                    id="basicSalary"
                    type="number"
                    value={salaryVal}
                    onChange={(e) => setSalaryVal(e.target.value)}
                    placeholder="30000"
                    className="pl-9 bg-[#131A22] border-border/40 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'বেতনের ধরণ' : 'Salary Type'}</Label>
                <Select value={salaryType} onValueChange={setSalaryType}>
                  <SelectTrigger className="bg-[#131A22] border-border/40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monthly">{isBangla ? 'মাসিক' : 'Monthly'}</SelectItem>
                    <SelectItem value="Hourly">{isBangla ? 'ঘণ্টাভিত্তিক' : 'Hourly'}</SelectItem>
                    <SelectItem value="Daily">{isBangla ? 'দৈনিক' : 'Daily'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'পেমেন্ট মাধ্যম' : 'Payment Method'}</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="bg-[#131A22] border-border/40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bank">{isBangla ? 'ব্যাংক ট্রান্সফার' : 'Bank Transfer'}</SelectItem>
                    <SelectItem value="Mobile Banking">{isBangla ? 'মোবাইল ব্যাংকিং' : 'Mobile Banking'}</SelectItem>
                    <SelectItem value="Cash">{isBangla ? 'নগদ / ক্যাশ' : 'Cash'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {paymentMethod === 'Bank' && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="bankName" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'ব্যাংকের নাম' : 'Bank'}</Label>
                    <Input
                      id="bankName"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g. City Bank"
                      className="bg-[#131A22] border-border/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="accNumber" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'অ্যাকাউন্ট নম্বর' : 'Account Number'}</Label>
                    <Input
                      id="accNumber"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="120XXXXXXXXXXXX"
                      className="bg-[#131A22] border-border/40 font-mono"
                    />
                  </div>
                </>
              )}

              {paymentMethod === 'Mobile Banking' && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'মোবাইল ওয়ালেট' : 'Mobile Banking'}</Label>
                  <Select value={mobileBanking} onValueChange={setMobileBanking}>
                    <SelectTrigger className="bg-[#131A22] border-border/40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bKash">bKash</SelectItem>
                      <SelectItem value="Nagad">Nagad</SelectItem>
                      <SelectItem value="Rocket">Rocket</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="allowance" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'ভাতা ও অন্যান্য বোনাস' : 'Allowances'}</Label>
                <Input
                  id="allowance"
                  value={allowances}
                  onChange={(e) => setAllowances(e.target.value)}
                  placeholder="e.g. Medical: 2000, TA: 1500"
                  className="bg-[#131A22] border-border/40"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2 md:col-span-3">
                <Label htmlFor="notesVal" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isBangla ? 'বেতন সংক্রান্ত নোট' : 'Notes'}</Label>
                <Input
                  id="notesVal"
                  value={notesVal}
                  onChange={(e) => setNotesVal(e.target.value)}
                  placeholder={isBangla ? 'অন্য কোনো আর্থিক নির্দেশাবলী...' : 'Any financial instructions or bonus details...'}
                  className="bg-[#131A22] border-border/40"
                />
              </div>
            </div>
          </Card>

          {/* 8. DOCUMENTS & ATTACHMENTS */}
          <Card id="documents" padding="lg" className="bg-[#131A22] border-border/40 space-y-6">
            <div className="border-b border-border/20 pb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <FolderOpen className="h-4.5 w-4.5 text-primary" />
                {isBangla ? 'সংযুক্তি ও নথি' : 'Documents & Attachments'}
              </h3>
              <span className="text-[10px] font-bold text-muted-foreground uppercase bg-muted/40 px-2 py-0.5 rounded-full">Section 5</span>
            </div>

            {/* Grid of Upload Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { id: 'nid', label: isBangla ? 'জাতীয় পরিচয়পত্র' : 'National ID Copy' },
                { id: 'photo', label: isBangla ? 'প্রোফাইল ছবি' : 'Profile Photo' },
                { id: 'cv', label: isBangla ? 'জীবনবৃত্তান্ত / CV' : 'Curriculum Vitae (CV)' },
                { id: 'letter', label: isBangla ? 'নিয়োগপত্র' : 'Appointment Letter' },
                { id: 'certs', label: isBangla ? 'শিক্ষাগত সার্টিফিকেট' : 'Academic Certificates' },
                { id: 'others', label: isBangla ? 'অন্যান্য' : 'Others Documents' }
              ].map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => handleDocUpload(doc.id)}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-border/40 hover:border-primary/50 bg-muted/5 hover:bg-primary/5 transition-all cursor-pointer group text-center"
                >
                  <FileUp className="h-5 w-5 text-muted-foreground/60 group-hover:text-primary transition-colors mb-2" />
                  <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                    {doc.label}
                  </span>
                  <span className="text-[9px] text-muted-foreground/60 mt-1 uppercase">Click to upload</span>
                </div>
              ))}
            </div>

            {/* List of Uploaded Docs */}
            {documents.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border/20">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  {isBangla ? 'সংযুক্ত নথিসমূহ' : 'Uploaded Documents'}
                </p>
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border/30 bg-muted/10 hover:bg-muted/20 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-8 w-8 rounded-lg bg-primary-subtle text-primary flex items-center justify-center shrink-0">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate max-w-[220px] sm:max-w-xs md:max-w-md">
                            {doc.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            {doc.size} · {doc.uploadedAt}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setPreviewDoc(doc)}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer rounded-lg"
                          aria-label="Preview"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleDocDownload(doc)}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer rounded-lg"
                          aria-label="Download"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleDocDelete(doc.id)}
                          className="h-8 w-8 text-rose-500 hover:bg-rose-500/10 cursor-pointer rounded-lg"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

      {/* 9. DOCUMENT PREVIEW DIALOG MODAL */}
      <Dialog open={!!previewDoc} onOpenChange={(open) => !open && setPreviewDoc(null)}>
        <DialogContent className="max-w-md bg-card border border-border/80 rounded-xl shadow-2xl">
          <DialogHeader className="border-b border-border/20 pb-3">
            <DialogTitle className="text-sm font-bold text-foreground truncate flex items-center gap-2">
              <FileText className="h-4.5 w-4.5 text-primary shrink-0" />
              {previewDoc?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="py-8 flex flex-col items-center justify-center bg-muted/10 rounded-lg border border-dashed border-border/40">
            <FileText className="h-16 w-16 text-primary/40 mb-3 animate-pulse" />
            <p className="text-xs font-semibold text-foreground">
              {isBangla ? 'নথির খসড়া প্রিভিউ লোড হচ্ছে...' : 'Simulated File Preview'}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              File type: {previewDoc?.type} ({previewDoc?.size})
            </p>
          </div>
          <div className="flex justify-end gap-2.5 pt-2">
            <Button
              variant="outline"
              onClick={() => setPreviewDoc(null)}
              className="cursor-pointer"
            >
              {isBangla ? 'বন্ধ করুন' : 'Close'}
            </Button>
            <Button
              onClick={() => {
                if (previewDoc) handleDocDownload(previewDoc);
                setPreviewDoc(null);
              }}
              leftIcon={<Download className="h-4 w-4" />}
              className="cursor-pointer"
            >
              {isBangla ? 'ডাউনলোড' : 'Download'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
