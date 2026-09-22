// Hello Khata OS - HRM Employees Page
// হ্যালো খাতা - এইচআরএম কর্মচারী তালিকা পেজ

'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  UserPlus,
  Search,
  Eye,
  Pencil,
  Archive,
  KeyRound,
  MoreHorizontal,
  Filter,
  Mail,
  Phone,
  MapPin,
  Droplets,
  FileText,
  Baby,
  User,
  Building2,
  Banknote,
  ShieldCheck,
  CalendarDays,
  BadgeCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerFooter,
} from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useAppTranslation, useCurrency, useDateFormat } from '@/hooks/useAppTranslation';
import { useRouter } from 'next/navigation';
import { HrmDataTable, type HrmColumn } from '@/components/hrm/shared/HrmDataTable';
import { HrmPagination } from '@/components/hrm/shared/HrmPagination';
import { HrmAvatar } from '@/components/hrm/shared/HrmAvatar';
import { EmployeeStatusBadge } from '@/components/hrm/shared/HrmStatusBadge';
import { HRM_EMPLOYEES, HRM_BRANCHES, branchName } from '@/components/hrm/mock-data';
import type { Employee } from '@/components/hrm/types';
import { DEPARTMENTS, DESIGNATIONS } from '@/components/hrm/types';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 8;

export default function EmployeesPage() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const { formatDate } = useDateFormat();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [designationFilter, setDesignationFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<Employee | null>(null);
  const [resetTarget, setResetTarget] = useState<Employee | null>(null);

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return HRM_EMPLOYEES.filter((e) => {
      if (q && !`${e.name} ${e.employeeId} ${e.phone} ${e.email}`.toLowerCase().includes(q)) return false;
      if (branchFilter !== 'all' && e.branchId !== branchFilter) return false;
      if (deptFilter !== 'all' && e.department !== deptFilter) return false;
      if (designationFilter !== 'all' && e.designation !== designationFilter) return false;
      if (statusFilter !== 'all' && e.status !== statusFilter) return false;
      return true;
    });
  }, [searchTerm, branchFilter, deptFilter, designationFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const refresh = (fn: () => void) => {
    setLoading(true);
    setTimeout(() => {
      fn();
      setLoading(false);
    }, 500);
  };

  const openDrawer = (e: Employee) => {
    setSelectedEmployee(e);
    setDrawerOpen(true);
  };

  const openAdd = () => {
    router.push('/hrm/employees/new');
  };

  const openEdit = (e: Employee) => {
    setEditingEmployee(e);
    setFormOpen(true);
  };

  const handleArchive = () => {
    if (!archiveTarget) return;
    setArchiveTarget(null);
    toast.success(
      isBangla
        ? `${archiveTarget.name} কে আর্কাইভ করা হয়েছে`
        : `${archiveTarget.name} has been archived`
    );
  };

  const handleResetPassword = () => {
    if (!resetTarget) return;
    setResetTarget(null);
    toast.success(
      isBangla
        ? `${resetTarget.name} এর পাসওয়ার্ড রিসেট করা হয়েছে`
        : `Password reset link sent to ${resetTarget.name}`
    );
  };

  const columns: HrmColumn<Employee>[] = [
    {
      key: 'employee',
      header: isBangla ? 'কর্মচারী' : 'Employee',
      render: (e) => (
        <div className="flex items-center gap-3">
          <HrmAvatar name={e.name} size="sm" className="ring-1 ring-slate-700/60 shadow-sm" />
          <div className="min-w-0">
            <p className="font-semibold text-slate-100 text-sm truncate max-w-[170px] hover:text-indigo-400 transition-colors">
              {e.name}
            </p>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{e.employeeId}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      header: isBangla ? 'যোগাযোগ' : 'Contact',
      render: (e) => (
        <div className="min-w-0">
          <p className="text-sm text-slate-200 font-medium tabular-nums">{e.phone}</p>
          <p className="text-xs text-slate-400 truncate max-w-[180px] mt-0.5">{e.email}</p>
        </div>
      ),
    },
    {
      key: 'department',
      header: isBangla ? 'বিভাগ ও পদবি' : 'Department & Role',
      render: (e) => (
        <div>
          <p className="text-sm text-slate-200 font-medium whitespace-nowrap">{e.department}</p>
          <p className="text-xs text-slate-400 whitespace-nowrap mt-0.5">{e.designation}</p>
        </div>
      ),
    },
    {
      key: 'branch',
      header: isBangla ? 'শাখা' : 'Branch',
      render: (e) => (
        <span className="text-sm text-slate-300 whitespace-nowrap">{branchName(e.branchId)}</span>
      ),
    },
    {
      key: 'joining',
      header: isBangla ? 'যোগদান' : 'Joined',
      render: (e) => (
        <span className="text-sm text-slate-400 whitespace-nowrap tabular-nums">
          {formatDate(e.joiningDate)}
        </span>
      ),
    },
    {
      key: 'salary',
      header: isBangla ? 'বেতন' : 'Salary',
      align: 'right',
      render: (e) => (
        <span className="text-sm font-bold text-emerald-400 whitespace-nowrap tabular-nums">
          {formatCurrency(e.salary)}
        </span>
      ),
    },
    {
      key: 'status',
      header: isBangla ? 'স্ট্যাটাস' : 'Status',
      align: 'center',
      render: (e) => <EmployeeStatusBadge status={e.status} />,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (e) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(ev) => ev.stopPropagation()}>
          <button
            type="button"
            onClick={() => openDrawer(e)}
            aria-label="View"
            className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-all cursor-pointer"
          >
            <Eye className="h-4 w-4" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="More"
                className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-all cursor-pointer"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-[#0d131f] border-slate-800 text-slate-200 shadow-2xl shadow-black/80 rounded-xl p-1.5">
              <DropdownMenuItem
                onClick={() => openEdit(e)}
                className="hover:bg-slate-800/80 hover:text-slate-100 focus:bg-slate-800/80 focus:text-slate-100 cursor-pointer rounded-lg text-xs font-medium px-2.5 py-2"
              >
                <Pencil className="h-4 w-4 mr-2 text-indigo-400" /> {isBangla ? 'সম্পাদনা' : 'Edit'}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`/hrm/employees/${e.id}`)}
                className="hover:bg-slate-800/80 hover:text-slate-100 focus:bg-slate-800/80 focus:text-slate-100 cursor-pointer rounded-lg text-xs font-medium px-2.5 py-2"
              >
                <FileText className="h-4 w-4 mr-2 text-sky-400" /> {isBangla ? 'প্রোফাইল' : 'Profile'}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-800/80 my-1" />
              <DropdownMenuItem
                onClick={() => setResetTarget(e)}
                className="hover:bg-slate-800/80 hover:text-slate-100 focus:bg-slate-800/80 focus:text-slate-100 cursor-pointer rounded-lg text-xs font-medium px-2.5 py-2"
              >
                <KeyRound className="h-4 w-4 mr-2 text-amber-400" /> {isBangla ? 'পাসওয়ার্ড রিসেট' : 'Reset Password'}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setArchiveTarget(e)}
                className="text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 focus:bg-rose-500/10 focus:text-rose-300 cursor-pointer rounded-lg text-xs font-medium px-2.5 py-2"
              >
                <Archive className="h-4 w-4 mr-2" /> {isBangla ? 'আর্কাইভ' : 'Archive'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full space-y-6 pb-12 px-1 sm:px-2">
      {/* 1. TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 shrink-0 shadow-sm shadow-indigo-500/20">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
              <span>{isBangla ? 'কর্মচারী ব্যবস্থাপনা' : 'Employee Management'}</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {isBangla
                ? 'কর্মচারী তালিকা পরিচালনা করুন — যোগ, সম্পাদনা ও প্রোফাইল দেখুন।'
                : 'Manage your workforce — add, edit and view employee profiles.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={openAdd}
            className="cursor-pointer font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 h-10 px-5 rounded-lg transition-all flex items-center gap-2 text-xs sm:text-sm"
          >
            <UserPlus className="h-4 w-4" />
            <span>{isBangla ? 'কর্মচারী যোগ করুন' : 'Add Employee'}</span>
          </Button>
        </div>
      </div>

      {/* 2. SEARCH & FILTER TOOLBAR */}
      <div className="rounded-2xl border border-slate-800/90 bg-[#0d131f]/95 shadow-xl shadow-black/40 backdrop-blur-xl p-4 sm:p-5 transition-all">
        <div className="flex flex-col gap-3.5">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                className="w-full h-10.5 pl-10 pr-4 bg-slate-900/60 border border-slate-800/90 text-slate-100 placeholder:text-slate-500 rounded-lg text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                placeholder={isBangla ? 'নাম, আইডি, ফোন বা ইমেইল খুঁজুন…' : 'Search name, ID, phone or email…'}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowFilters((v) => !v)}
                className={cn(
                  'h-10.5 px-3.5 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer select-none',
                  showFilters
                    ? 'bg-indigo-600/15 border-indigo-500/40 text-indigo-300'
                    : 'bg-slate-900/60 border-slate-800/90 text-slate-300 hover:text-slate-100 hover:bg-slate-800/60'
                )}
              >
                <Filter className="h-4 w-4" />
                <span>{isBangla ? 'ফিল্টার' : 'Filters'}</span>
                {branchFilter !== 'all' || deptFilter !== 'all' || statusFilter !== 'all' || designationFilter !== 'all' ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500" />
                ) : null}
              </button>
              <div className="h-10.5 px-3.5 rounded-lg bg-slate-900/60 border border-slate-800/90 text-xs text-slate-400 flex items-center justify-center whitespace-nowrap font-medium">
                {isBangla
                  ? `${filtered.length} জন ফলাফল`
                  : `${filtered.length} result${filtered.length === 1 ? '' : 's'}`}
              </div>
            </div>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-800/60"
            >
              <Select
                value={branchFilter}
                onValueChange={(v) => {
                  setBranchFilter(v);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-10.5 bg-slate-900/60 border-slate-800/90 text-slate-200 text-xs rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30">
                  <SelectValue placeholder={isBangla ? 'শাখা' : 'Branch'} />
                </SelectTrigger>
                <SelectContent className="bg-[#0d131f] border-slate-800 text-slate-200 shadow-2xl">
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
                <SelectTrigger className="h-10.5 bg-slate-900/60 border-slate-800/90 text-slate-200 text-xs rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30">
                  <SelectValue placeholder={isBangla ? 'বিভাগ' : 'Department'} />
                </SelectTrigger>
                <SelectContent className="bg-[#0d131f] border-slate-800 text-slate-200 shadow-2xl">
                  <SelectItem value="all">{isBangla ? 'সব বিভাগ' : 'All departments'}</SelectItem>
                  {DEPARTMENTS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={designationFilter}
                onValueChange={(v) => {
                  setDesignationFilter(v);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-10.5 bg-slate-900/60 border-slate-800/90 text-slate-200 text-xs rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30">
                  <SelectValue placeholder={isBangla ? 'পদবি' : 'Designation'} />
                </SelectTrigger>
                <SelectContent className="bg-[#0d131f] border-slate-800 text-slate-200 shadow-2xl">
                  <SelectItem value="all">{isBangla ? 'সব পদবি' : 'All designations'}</SelectItem>
                  {DESIGNATIONS.map((d) => (
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
                <SelectTrigger className="h-10.5 bg-slate-900/60 border-slate-800/90 text-slate-200 text-xs rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30">
                  <SelectValue placeholder={isBangla ? 'স্ট্যাটাস' : 'Status'} />
                </SelectTrigger>
                <SelectContent className="bg-[#0d131f] border-slate-800 text-slate-200 shadow-2xl">
                  <SelectItem value="all">{isBangla ? 'সব স্ট্যাটাস' : 'All statuses'}</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="On Leave">On Leave</SelectItem>
                  <SelectItem value="Probation">Probation</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          )}
        </div>
      </div>

      {/* 3. TABLE */}
      <HrmDataTable
        columns={columns}
        data={paged}
        keyField={(e) => e.id}
        loading={loading}
        skeletonRows={6}
        emptyIcon={Users}
        emptyTitle={isBangla ? 'কোনো কর্মচারী পাওয়া যায়নি' : 'No employees found'}
        emptyTitleBn="কোনো কর্মচারী পাওয়া যায়নি"
        emptyDescription={isBangla ? 'অন্য ফিল্টার ব্যবহার করে দেখুন বা নতুন কর্মচারী যোগ করুন।' : 'Try different filters or add a new employee.'}
        emptyDescriptionBn="অন্য ফিল্টার ব্যবহার করে দেখুন বা নতুন কর্মচারী যোগ করুন।"
        emptyAction={
          <Button
            onClick={openAdd}
            className="cursor-pointer font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 h-10 px-5 rounded-lg transition-all flex items-center gap-2 text-xs sm:text-sm mt-3"
          >
            <UserPlus className="h-4 w-4" />
            <span>{isBangla ? 'কর্মচারী যোগ করুন' : 'Add Employee'}</span>
          </Button>
        }
        onRowClick={openDrawer}
        isBangla={isBangla}
        footer={
          <HrmPagination
            currentPage={safePage}
            totalPages={totalPages}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            onPageChange={(p) => {
              setCurrentPage(p);
              refresh(() => {});
            }}
          />
        }
      />

      {/* 4. DETAILS DRAWER */}
      <Drawer direction="right" open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="w-full max-w-md bg-[#0d131f] border-l border-slate-800 text-slate-100 shadow-2xl">
          {selectedEmployee && (
            <>
              <DrawerHeader className="border-b border-slate-800/80 px-6 py-5">
                <div className="flex items-center gap-3.5">
                  <HrmAvatar name={selectedEmployee.name} size="lg" className="ring-2 ring-indigo-500/30 shadow-md" />
                  <div className="min-w-0 flex-1">
                    <DrawerTitle className="text-lg font-bold text-slate-100 truncate">
                      {selectedEmployee.name}
                    </DrawerTitle>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      {selectedEmployee.employeeId} · {selectedEmployee.designation}
                    </p>
                    <div className="mt-2">
                      <EmployeeStatusBadge status={selectedEmployee.status} />
                    </div>
                  </div>
                  <DrawerClose asChild>
                    <button
                      type="button"
                      aria-label="Close"
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-all cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4 rotate-180" />
                    </button>
                  </DrawerClose>
                </div>
              </DrawerHeader>

              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <DetailChip icon={Building2} label={isBangla ? 'বিভাগ' : 'Department'} value={selectedEmployee.department} />
                  <DetailChip icon={ShieldCheck} label={isBangla ? 'শিফট' : 'Shift'} value={selectedEmployee.shift} />
                  <DetailChip icon={MapPin} label={isBangla ? 'শাখা' : 'Branch'} value={branchName(selectedEmployee.branchId)} />
                  <DetailChip icon={CalendarDays} label={isBangla ? 'যোগদান' : 'Joined'} value={formatDate(selectedEmployee.joiningDate)} />
                  <DetailChip icon={Banknote} label={isBangla ? 'বেতন' : 'Salary'} value={formatCurrency(selectedEmployee.salary)} />
                  <DetailChip icon={User} label={isBangla ? 'লিঙ্গ' : 'Gender'} value={selectedEmployee.gender} />
                  <DetailChip icon={Droplets} label="Blood" value={selectedEmployee.bloodGroup} />
                  <DetailChip icon={Baby} label="NID" value={selectedEmployee.nid} />
                </div>

                <Divider />

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                    <span>{isBangla ? 'যোগাযোগের তথ্য' : 'Contact Information'}</span>
                  </h4>
                  <div className="space-y-2.5">
                    <ContactRow icon={Phone} label={isBangla ? 'মোবাইল' : 'Phone'} value={selectedEmployee.phone} />
                    <ContactRow icon={Mail} label="Email" value={selectedEmployee.email} />
                    <ContactRow icon={MapPin} label={isBangla ? 'ঠিকানা' : 'Address'} value={selectedEmployee.address} />
                    <ContactRow icon={BadgeCheck} label={isBangla ? 'জরুরি যোগাযোগ' : 'Emergency'} value={selectedEmployee.emergencyContact} />
                  </div>
                </div>
              </div>

              <DrawerFooter className="border-t border-slate-800/80 px-6 py-4 flex-row gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-slate-100 rounded-lg h-10 cursor-pointer text-xs"
                  onClick={() => {
                    setDrawerOpen(false);
                    openEdit(selectedEmployee);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5 mr-1.5 text-indigo-400" />
                  <span>{isBangla ? 'সম্পাদনা' : 'Edit'}</span>
                </Button>
                <Button
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg h-10 shadow-lg shadow-indigo-600/30 cursor-pointer text-xs"
                  onClick={() => {
                    setDrawerOpen(false);
                    router.push(`/hrm/employees/${selectedEmployee.id}`);
                  }}
                >
                  <FileText className="h-3.5 w-3.5 mr-1.5" />
                  <span>{isBangla ? 'প্রোফাইল' : 'Profile'}</span>
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>

      {/* 5. ADD / EDIT DIALOG */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl bg-[#0d131f] border border-slate-800 text-slate-100 shadow-2xl rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-100">
              {editingEmployee
                ? isBangla
                  ? 'কর্মচারী সম্পাদনা'
                  : `Edit ${editingEmployee.name}`
                : isBangla
                  ? 'নতুন কর্মচারী যোগ করুন'
                  : 'Add New Employee'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="emp-name" className="text-xs font-semibold text-slate-300">
                {isBangla ? 'পুরো নাম *' : 'Full Name *'}
              </Label>
              <Input
                id="emp-name"
                placeholder="e.g. Abdur Rahman"
                defaultValue={editingEmployee?.name}
                className="h-10 bg-slate-900/60 border-slate-800/90 text-slate-100 placeholder:text-slate-500 rounded-lg focus-visible:border-indigo-500"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="emp-phone" className="text-xs font-semibold text-slate-300">
                {isBangla ? 'মোবাইল *' : 'Phone *'}
              </Label>
              <Input
                id="emp-phone"
                placeholder="01XXXXXXXXX"
                defaultValue={editingEmployee?.phone}
                className="h-10 bg-slate-900/60 border-slate-800/90 text-slate-100 placeholder:text-slate-500 rounded-lg focus-visible:border-indigo-500"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="emp-email" className="text-xs font-semibold text-slate-300">
                {isBangla ? 'ইমেইল' : 'Email'}
              </Label>
              <Input
                id="emp-email"
                type="email"
                placeholder="name@hellokhata.com"
                defaultValue={editingEmployee?.email}
                className="h-10 bg-slate-900/60 border-slate-800/90 text-slate-100 placeholder:text-slate-500 rounded-lg focus-visible:border-indigo-500"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="emp-salary" className="text-xs font-semibold text-slate-300">
                {isBangla ? 'বেতন (৳) *' : 'Salary (৳) *'}
              </Label>
              <Input
                id="emp-salary"
                type="number"
                placeholder="30000"
                defaultValue={editingEmployee?.salary}
                className="h-10 bg-slate-900/60 border-slate-800/90 text-slate-100 placeholder:text-slate-500 rounded-lg focus-visible:border-indigo-500"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-300">{isBangla ? 'শাখা *' : 'Branch *'}</Label>
              <Select defaultValue={editingEmployee?.branchId || HRM_BRANCHES[0].id}>
                <SelectTrigger className="h-10 bg-slate-900/60 border-slate-800/90 text-slate-100 rounded-lg focus:border-indigo-500">
                  <SelectValue placeholder={isBangla ? 'শাখা নির্বাচন' : 'Select branch'} />
                </SelectTrigger>
                <SelectContent className="bg-[#0d131f] border-slate-800 text-slate-200">
                  {HRM_BRANCHES.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-300">{isBangla ? 'বিভাগ *' : 'Department *'}</Label>
              <Select defaultValue={editingEmployee?.department || DEPARTMENTS[1]}>
                <SelectTrigger className="h-10 bg-slate-900/60 border-slate-800/90 text-slate-100 rounded-lg focus:border-indigo-500">
                  <SelectValue placeholder={isBangla ? 'বিভাগ নির্বাচন' : 'Select department'} />
                </SelectTrigger>
                <SelectContent className="bg-[#0d131f] border-slate-800 text-slate-200">
                  {DEPARTMENTS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-300">{isBangla ? 'পদবি *' : 'Designation *'}</Label>
              <Select defaultValue={editingEmployee?.designation || DESIGNATIONS[2]}>
                <SelectTrigger className="h-10 bg-slate-900/60 border-slate-800/90 text-slate-100 rounded-lg focus:border-indigo-500">
                  <SelectValue placeholder={isBangla ? 'পদবি নির্বাচন' : 'Select designation'} />
                </SelectTrigger>
                <SelectContent className="bg-[#0d131f] border-slate-800 text-slate-200">
                  {DESIGNATIONS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-300">{isBangla ? 'স্ট্যাটাস' : 'Status'}</Label>
              <Select defaultValue={editingEmployee?.status || 'Active'}>
                <SelectTrigger className="h-10 bg-slate-900/60 border-slate-800/90 text-slate-100 rounded-lg focus:border-indigo-500">
                  <SelectValue placeholder={isBangla ? 'স্ট্যাটাস' : 'Status'} />
                </SelectTrigger>
                <SelectContent className="bg-[#0d131f] border-slate-800 text-slate-200">
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="On Leave">On Leave</SelectItem>
                  <SelectItem value="Probation">Probation</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="emp-address" className="text-xs font-semibold text-slate-300">
                {isBangla ? 'ঠিকানা' : 'Address'}
              </Label>
              <Input
                id="emp-address"
                placeholder={isBangla ? 'বাড়ি, রোড, এলাকা, ঢাকা' : 'House, Road, Area, Dhaka'}
                defaultValue={editingEmployee?.address}
                className="h-10 bg-slate-900/60 border-slate-800/90 text-slate-100 placeholder:text-slate-500 rounded-lg focus-visible:border-indigo-500"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-3 pt-3 border-t border-slate-800/80">
            <DialogClose asChild>
              <Button variant="outline" className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-slate-100 rounded-lg text-xs h-10 cursor-pointer">
                {isBangla ? 'বাতিল' : 'Cancel'}
              </Button>
            </DialogClose>
            <Button
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30 rounded-lg text-xs h-10 px-5 cursor-pointer"
              onClick={() => {
                setFormOpen(false);
                toast.success(
                  editingEmployee
                    ? isBangla
                      ? 'কর্মচারী আপডেট হয়েছে'
                      : 'Employee updated successfully'
                    : isBangla
                      ? 'নতুন কর্মচারী যোগ হয়েছে'
                      : 'Employee added successfully'
                );
              }}
            >
              {editingEmployee ? (isBangla ? 'আপডেট করুন' : 'Save Changes') : (isBangla ? 'যোগ করুন' : 'Add Employee')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 6. ARCHIVE CONFIRM DIALOG */}
      <Dialog open={!!archiveTarget} onOpenChange={(o) => !o && setArchiveTarget(null)}>
        <DialogContent className="sm:max-w-md bg-[#0d131f] border border-slate-800 text-slate-100 shadow-2xl rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-100">
              {isBangla ? 'কর্মচারী আর্কাইভ করুন?' : 'Archive employee?'}
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs sm:text-sm text-slate-400 py-2 leading-relaxed">
            {archiveTarget
              ? isBangla
                ? `${archiveTarget.name} কে আর্কাইভ করলে তিনি আর সক্রিয় কর্মচারী তালিকায় থাকবেন না।`
                : `${archiveTarget.name} will no longer appear in the active employee list. You can restore anytime.`
              : ''}
          </p>
          <DialogFooter className="gap-2 sm:gap-3 pt-3 border-t border-slate-800/80">
            <DialogClose asChild>
              <Button variant="outline" className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-slate-100 rounded-lg text-xs h-10 cursor-pointer">
                {isBangla ? 'বাতিল' : 'Cancel'}
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleArchive}
              className="bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-600/30 rounded-lg text-xs h-10 px-4 cursor-pointer flex items-center gap-1.5"
            >
              <Archive className="h-4 w-4" />
              <span>{isBangla ? 'আর্কাইভ করুন' : 'Archive'}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 7. RESET PASSWORD DIALOG */}
      <Dialog open={!!resetTarget} onOpenChange={(o) => !o && setResetTarget(null)}>
        <DialogContent className="sm:max-w-md bg-[#0d131f] border border-slate-800 text-slate-100 shadow-2xl rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-100">
              {isBangla ? 'পাসওয়ার্ড রিসেট' : 'Reset password'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3.5 my-2">
            <KeyRound className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed">
              {resetTarget
                ? isBangla
                  ? `${resetTarget.name} এর লগইন পাসওয়ার্ড রিসেট করতে একটি লিংক পাঠানো হবে।`
                  : `A password reset link will be sent to ${resetTarget.email || resetTarget.phone}.`
                : ''}
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-3 pt-3 border-t border-slate-800/80">
            <DialogClose asChild>
              <Button variant="outline" className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-slate-100 rounded-lg text-xs h-10 cursor-pointer">
                {isBangla ? 'বাতিল' : 'Cancel'}
              </Button>
            </DialogClose>
            <Button
              onClick={handleResetPassword}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30 rounded-lg text-xs h-10 px-5 cursor-pointer flex items-center gap-1.5"
            >
              <KeyRound className="h-4 w-4" />
              <span>{isBangla ? 'লিংক পাঠান' : 'Send Link'}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailChip({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3 transition-all hover:border-slate-700/60">
      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
        <Icon className="h-3.5 w-3.5 text-indigo-400" />
        <span>{label}</span>
      </div>
      <p className="text-sm font-semibold text-slate-100 truncate">{value}</p>
    </div>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
      <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-indigo-400" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-slate-400">{label}</p>
        <p className="text-sm text-slate-200 font-medium truncate">{value}</p>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="h-px w-full bg-slate-800/80" />;
}
