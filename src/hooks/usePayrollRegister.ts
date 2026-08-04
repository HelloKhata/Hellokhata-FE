import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PayrollRecord, PayrollFilters, PaymentStatus, PaymentMethod } from '@/types/payroll-register';

export const MOCK_PAYROLL_RECORDS: PayrollRecord[] = [
  {
    id: 'pr-1001',
    employeeId: 'emp-001',
    employeeCode: 'EMP-001',
    employeeName: 'Rahim Ahmed',
    employeeNameBn: 'রহিম আহমেদ',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    branchId: 'dhaka-main',
    branchName: 'Main Branch (Dhaka)',
    department: 'Accounts',
    designation: 'Senior Accountant',
    role: 'Accountant',
    payrollPeriod: 'July 2026',
    salaryType: 'monthly',
    basicSalary: 35000,
    allowances: 5000,
    overtime: 2500,
    bonus: 3000,
    grossSalary: 45500,
    tax: 1500,
    leaveDeduction: 0,
    lateDeduction: 500,
    otherDeductions: 500,
    totalDeductions: 2500,
    netSalary: 43000,
    paymentMethod: 'bank_transfer',
    paymentStatus: 'paid',
    paidDate: '2026-07-30',
    generatedDate: '2026-07-28',
    createdBy: 'Owner (System)',
    notes: 'Regular monthly salary disbursed via EFT.',
    bankInfo: {
      bankName: 'City Bank Ltd.',
      accountNumber: '1102938475001',
      branchName: 'Dhanmondi Branch',
    },
  },
  {
    id: 'pr-1002',
    employeeId: 'emp-002',
    employeeCode: 'EMP-002',
    employeeName: 'Tanvir Hossain',
    employeeNameBn: 'তানভীর হোসেন',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    branchId: 'dhaka-main',
    branchName: 'Main Branch (Dhaka)',
    department: 'Management',
    designation: 'Branch Manager',
    role: 'Branch Manager',
    payrollPeriod: 'July 2026',
    salaryType: 'monthly',
    basicSalary: 55000,
    allowances: 8000,
    overtime: 0,
    bonus: 5000,
    grossSalary: 68000,
    tax: 3500,
    leaveDeduction: 0,
    lateDeduction: 0,
    otherDeductions: 1000,
    totalDeductions: 4500,
    netSalary: 63500,
    paymentMethod: 'bank_transfer',
    paymentStatus: 'paid',
    paidDate: '2026-07-30',
    generatedDate: '2026-07-28',
    createdBy: 'Owner (System)',
    notes: 'Executive manager payroll processed cleanly.',
    bankInfo: {
      bankName: 'Brac Bank Ltd.',
      accountNumber: '1501203948001',
      branchName: 'Gulshan Branch',
    },
  },
  {
    id: 'pr-1003',
    employeeId: 'emp-003',
    employeeCode: 'EMP-003',
    employeeName: 'Nusrat Jahan',
    employeeNameBn: 'নুসরাত জাহান',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    branchId: 'ctg-branch',
    branchName: 'Chittagong Outlet',
    department: 'Sales',
    designation: 'Senior Cashier',
    role: 'Cashier',
    payrollPeriod: 'July 2026',
    salaryType: 'monthly',
    basicSalary: 22000,
    allowances: 3000,
    overtime: 3500,
    bonus: 1500,
    grossSalary: 30000,
    tax: 0,
    leaveDeduction: 800,
    lateDeduction: 400,
    otherDeductions: 0,
    totalDeductions: 1200,
    netSalary: 28800,
    paymentMethod: 'bkash',
    paymentStatus: 'paid',
    paidDate: '2026-07-31',
    generatedDate: '2026-07-28',
    createdBy: 'Tanvir Hossain',
    notes: 'Disbursed via bKash Merchant Payroll.',
    bankInfo: {
      bankName: 'bKash Wallet',
      accountNumber: '01711223344',
    },
  },
  {
    id: 'pr-1004',
    employeeId: 'emp-004',
    employeeCode: 'EMP-004',
    employeeName: 'Kamrul Islam',
    employeeNameBn: 'কামরুল ইসলাম',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    branchId: 'dhaka-main',
    branchName: 'Main Branch (Dhaka)',
    department: 'Sales',
    designation: 'Store Staff',
    role: 'Staff',
    payrollPeriod: 'July 2026',
    salaryType: 'monthly',
    basicSalary: 18000,
    allowances: 2500,
    overtime: 1800,
    bonus: 1000,
    grossSalary: 23300,
    tax: 0,
    leaveDeduction: 0,
    lateDeduction: 300,
    otherDeductions: 0,
    totalDeductions: 300,
    netSalary: 23000,
    paymentMethod: 'cash',
    paymentStatus: 'paid',
    paidDate: '2026-08-01',
    generatedDate: '2026-07-28',
    createdBy: 'Rahim Ahmed',
    notes: 'Cash payment disbursed at register.',
  },
  {
    id: 'pr-1005',
    employeeId: 'emp-005',
    employeeCode: 'EMP-005',
    employeeName: 'Anowar Hossain',
    employeeNameBn: 'আনোয়ার হোসেন',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    branchId: 'sylhet-branch',
    branchName: 'Sylhet Branch',
    department: 'Operations',
    designation: 'Inventory Supervisor',
    role: 'Staff',
    payrollPeriod: 'July 2026',
    salaryType: 'monthly',
    basicSalary: 26000,
    allowances: 3500,
    overtime: 4200,
    bonus: 2000,
    grossSalary: 35700,
    tax: 500,
    leaveDeduction: 1200,
    lateDeduction: 0,
    otherDeductions: 0,
    totalDeductions: 1700,
    netSalary: 34000,
    paymentMethod: 'bank_transfer',
    paymentStatus: 'partially_paid',
    paidDate: '2026-07-31',
    generatedDate: '2026-07-28',
    createdBy: 'Owner (System)',
    notes: '৳20,000 paid advance via bank; remaining ৳14,000 pending.',
    bankInfo: {
      bankName: 'Dutch-Bangla Bank Ltd.',
      accountNumber: '1051204958392',
      branchName: 'Zindabazar Branch',
    },
  },
  {
    id: 'pr-1006',
    employeeId: 'emp-006',
    employeeCode: 'EMP-006',
    employeeName: 'Sabrina Sultana',
    employeeNameBn: 'সবরিনা সুলতানা',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    branchId: 'dhaka-main',
    branchName: 'Main Branch (Dhaka)',
    department: 'HR',
    designation: 'HR Officer',
    role: 'Staff',
    payrollPeriod: 'July 2026',
    salaryType: 'monthly',
    basicSalary: 30000,
    allowances: 4500,
    overtime: 0,
    bonus: 2000,
    grossSalary: 36500,
    tax: 1000,
    leaveDeduction: 0,
    lateDeduction: 300,
    otherDeductions: 800,
    totalDeductions: 2100,
    netSalary: 34400,
    paymentMethod: 'bank_transfer',
    paymentStatus: 'pending',
    generatedDate: '2026-07-28',
    createdBy: 'Owner (System)',
    notes: 'Awaiting bank clearance batch approval.',
    bankInfo: {
      bankName: 'Eastern Bank Ltd.',
      accountNumber: '10192837465',
      branchName: 'Banani Branch',
    },
  },
  {
    id: 'pr-1007',
    employeeId: 'emp-007',
    employeeCode: 'EMP-007',
    employeeName: 'Farhana Akter',
    employeeNameBn: 'ফরহানা আক্তার',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    branchId: 'ctg-branch',
    branchName: 'Chittagong Outlet',
    department: 'Sales',
    designation: 'Sales Associate',
    role: 'Staff',
    payrollPeriod: 'July 2026',
    salaryType: 'monthly',
    basicSalary: 20000,
    allowances: 2500,
    overtime: 1200,
    bonus: 1000,
    grossSalary: 24700,
    tax: 0,
    leaveDeduction: 500,
    lateDeduction: 200,
    otherDeductions: 0,
    totalDeductions: 700,
    netSalary: 24000,
    paymentMethod: 'bkash',
    paymentStatus: 'pending',
    generatedDate: '2026-07-28',
    createdBy: 'Tanvir Hossain',
    notes: 'Queued for bKash disbursement.',
  },
  {
    id: 'pr-1008',
    employeeId: 'emp-008',
    employeeCode: 'EMP-008',
    employeeName: 'Mehedi Hasan',
    employeeNameBn: 'মেহেদী হাসান',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    branchId: 'sylhet-branch',
    branchName: 'Sylhet Branch',
    department: 'Sales',
    designation: 'Store Cashier',
    role: 'Cashier',
    payrollPeriod: 'July 2026',
    salaryType: 'monthly',
    basicSalary: 21000,
    allowances: 2800,
    overtime: 2100,
    bonus: 1000,
    grossSalary: 26900,
    tax: 0,
    leaveDeduction: 0,
    lateDeduction: 400,
    otherDeductions: 500,
    totalDeductions: 900,
    netSalary: 26000,
    paymentMethod: 'bank_transfer',
    paymentStatus: 'failed',
    generatedDate: '2026-07-28',
    createdBy: 'Rahim Ahmed',
    notes: 'Bank transaction bounced due to incorrect routing code.',
    bankInfo: {
      bankName: 'Islami Bank Bangladesh Ltd.',
      accountNumber: '20501928374',
    },
  },
];

export const usePayrollRegister = (initialFilters?: Partial<PayrollFilters>) => {
  const [filters, setFilters] = useState<PayrollFilters>({
    payrollPeriod: initialFilters?.payrollPeriod || 'July 2026',
    branch: initialFilters?.branch || 'all',
    search: initialFilters?.search || '',
    department: initialFilters?.department || 'all',
    role: initialFilters?.role || 'all',
    paymentStatus: initialFilters?.paymentStatus || 'all',
    paymentMethod: initialFilters?.paymentMethod || 'all',
    salaryType: initialFilters?.salaryType || 'all',
  });

  const {
    data: records = MOCK_PAYROLL_RECORDS,
    isLoading,
    isError,
    refetch,
  } = useQuery<PayrollRecord[]>({
    queryKey: ['payroll-register', filters],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_PAYROLL_RECORDS;
    },
    staleTime: 1000 * 60 * 10,
  });

  // Filter logic
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      // Branch filter
      if (filters.branch !== 'all' && rec.branchId !== filters.branch) {
        return false;
      }
      // Department filter
      if (filters.department !== 'all' && rec.department.toLowerCase() !== filters.department.toLowerCase()) {
        return false;
      }
      // Payment Status filter
      if (filters.paymentStatus !== 'all' && rec.paymentStatus !== filters.paymentStatus) {
        return false;
      }
      // Payment Method filter
      if (filters.paymentMethod !== 'all' && rec.paymentMethod !== filters.paymentMethod) {
        return false;
      }
      // Salary Type filter
      if (filters.salaryType !== 'all' && rec.salaryType !== filters.salaryType) {
        return false;
      }
      // Role filter
      if (filters.role !== 'all' && rec.role.toLowerCase() !== filters.role.toLowerCase()) {
        return false;
      }
      // Search query filter
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase().trim();
        const matchesName = rec.employeeName.toLowerCase().includes(q) || (rec.employeeNameBn && rec.employeeNameBn.includes(q));
        const matchesCode = rec.employeeCode.toLowerCase().includes(q);
        const matchesDept = rec.department.toLowerCase().includes(q);
        const matchesDesig = rec.designation.toLowerCase().includes(q);
        return matchesName || matchesCode || matchesDept || matchesDesig;
      }

      return true;
    });
  }, [records, filters]);

  const updateFilter = (key: keyof PayrollFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      payrollPeriod: 'July 2026',
      branch: 'all',
      search: '',
      department: 'all',
      role: 'all',
      paymentStatus: 'all',
      paymentMethod: 'all',
      salaryType: 'all',
    });
  };

  return {
    records,
    filteredRecords,
    filters,
    isLoading,
    isError,
    updateFilter,
    resetFilters,
    refetch,
  };
};
