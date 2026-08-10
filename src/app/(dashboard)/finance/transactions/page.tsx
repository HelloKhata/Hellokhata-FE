'use client';

import React, { useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import {
  ArrowLeftRight,
  Calendar,
  Clock3,
  RefreshCw,
  Search,
  Filter,
  ArrowUpDown,
  CalendarDays,
  Columns,
  ChevronDown,
  Plus,
  Download,
  Upload,
  Activity,
  ArrowRight,
  Coins,
  FileClock,
  Landmark,
  Building2,
  FileSpreadsheet,
  Settings,
  Clock,
  FileText,
  User,
  Eye,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  type: 'Sales' | 'Income' | 'Expense' | 'Deposit' | 'Withdrawal' | 'Transfer' | 'Loan';
  typeBn: string;
  account: string;
  accountBn: string;
  desc: string;
  descBn: string;
  party: string;
  partyBn: string;
  debit: number;
  credit: number;
  method: string;
  methodBn: string;
  status: 'Completed' | 'Pending' | 'Failed';
  statusBn: string;
  branch: string;
  branchBn: string;
}

export default function FinanceTransactionsPage() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();

  // State Management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedMethod, setSelectedMethod] = useState('all');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeTransaction, setActiveTransaction] = useState<Transaction | null>(null);

  // Form Fields for new transaction
  const [formType, setFormType] = useState<'Sales' | 'Income' | 'Expense' | 'Deposit' | 'Withdrawal' | 'Transfer' | 'Loan'>('Income');
  const [formAccount, setFormAccount] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formMethod, setFormMethod] = useState('Bank');
  const [formParty, setFormParty] = useState('');
  const [formBranch, setFormBranch] = useState('Dhaka');
  const [formStatus, setFormStatus] = useState<'Completed' | 'Pending'>('Completed');

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'TXN-001',
      date: '2026-08-05',
      type: 'Income',
      typeBn: 'আয়',
      account: 'Product Sales',
      accountBn: 'পণ্য বিক্রয়',
      desc: 'Credit sale invoice payment',
      descBn: 'বাকিতে বিক্রয় ইনভয়েস পেমেন্ট',
      party: 'M/S Rahman & Sons',
      partyBn: 'মেসার্স রহমান এন্ড সন্স',
      debit: 0,
      credit: 85000,
      method: 'Bank Transfer',
      methodBn: 'ব্যাংক স্থানান্তর',
      status: 'Completed',
      statusBn: 'সম্পন্ন',
      branch: 'Dhaka',
      branchBn: 'ঢাকা',
    },
    {
      id: 'TXN-002',
      date: '2026-08-05',
      type: 'Deposit',
      typeBn: 'জমা',
      account: 'Bank Operating Account',
      accountBn: 'ব্যাংক হিসাব',
      desc: 'Counter cash bank deposit transfer',
      descBn: 'কাউন্টার নগদ ব্যাংক ডিপোজিট',
      party: 'Self (Contra)',
      partyBn: 'নিজস্ব (কনট্রা)',
      debit: 0,
      credit: 60000,
      method: 'Contra Cash',
      methodBn: 'নগদ কনট্রা',
      status: 'Completed',
      statusBn: 'সম্পন্ন',
      branch: 'Dhaka',
      branchBn: 'ঢাকা',
    },
    {
      id: 'TXN-003',
      date: '2026-08-04',
      type: 'Expense',
      typeBn: 'ব্যয়',
      account: 'Office Rent & Utilities',
      accountBn: 'অফিস ভাড়া ও ইউটিলিটি',
      desc: 'Monthly office rent payment',
      descBn: 'মাসিক অফিস ভাড়া পরিশোধ',
      party: 'Landlord Chowdhury',
      partyBn: 'বাড়িওয়ালা চৌধুরী',
      debit: 45000,
      credit: 0,
      method: 'Bank Transfer',
      methodBn: 'ব্যাংক স্থানান্তর',
      status: 'Completed',
      statusBn: 'সম্পন্ন',
      branch: 'Dhaka',
      branchBn: 'ঢাকা',
    },
    {
      id: 'TXN-004',
      date: '2026-08-03',
      type: 'Expense',
      typeBn: 'ব্যয়',
      account: 'Employee Salaries',
      accountBn: 'কর্মচারীদের বেতন',
      desc: 'July payroll salary disbursement',
      descBn: 'জুলাই মাসের বেতন বিতরণ',
      party: 'All Employees',
      partyBn: 'সব কর্মকর্তা-কর্মচারী',
      debit: 120000,
      credit: 0,
      method: 'Bank Transfer',
      methodBn: 'ব্যাংক স্থানান্তর',
      status: 'Completed',
      statusBn: 'সম্পন্ন',
      branch: 'Dhaka',
      branchBn: 'ঢাকা',
    },
    {
      id: 'TXN-005',
      date: '2026-08-03',
      type: 'Loan',
      typeBn: 'ঋণ',
      account: 'Dhaka Bank Loan Account',
      accountBn: 'ঢাকা ব্যাংক ঋণ হিসাব',
      desc: 'Monthly bank loan amortization payout',
      descBn: 'মাসিক ঋণ কিস্তি পরিশোধ',
      party: 'Dhaka Bank PLC',
      partyBn: 'ঢাকা ব্যাংক পিএলসি',
      debit: 35000,
      credit: 0,
      method: 'Bank Transfer',
      methodBn: 'ব্যাংক স্থানান্তর',
      status: 'Completed',
      statusBn: 'সম্পন্ন',
      branch: 'Dhaka',
      branchBn: 'ঢাকা',
    },
    {
      id: 'TXN-006',
      date: '2026-08-02',
      type: 'Sales',
      typeBn: 'বিক্রয়',
      account: 'Counter Sales',
      accountBn: 'কাউন্টার বিক্রয়',
      desc: 'Retail counter sale invoice',
      descBn: 'কাউন্টার নগদ বিক্রয় রসিদ',
      party: 'Walk-in Client',
      partyBn: 'খুচরা ক্রেতা',
      debit: 0,
      credit: 42000,
      method: 'Cash',
      methodBn: 'নগদ',
      status: 'Completed',
      statusBn: 'সম্পন্ন',
      branch: 'Chittagong',
      branchBn: 'চট্টগ্রাম',
    },
    {
      id: 'TXN-007',
      date: '2026-08-02',
      type: 'Expense',
      typeBn: 'ব্যয়',
      account: 'Sales Marketing',
      accountBn: 'বিক্রয় মার্কেটিং',
      desc: 'Facebook ad manager promotion bill',
      descBn: 'ফেসবুক প্রমোশন বিজ্ঞাপন বিল',
      party: 'Facebook Inc.',
      partyBn: 'ফেসবুক ইনকর্পোরেশন',
      debit: 15000,
      credit: 0,
      method: 'Credit Card',
      methodBn: 'ক্রেডিট কার্ড',
      status: 'Completed',
      statusBn: 'সম্পন্ন',
      branch: 'Dhaka',
      branchBn: 'ঢাকা',
    },
  ]);

  // Handles adding a new transaction preset
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAccount.trim() || !formAmount) return;

    const parsedAmount = parseFloat(formAmount) || 0;
    const isCredit = ['Sales', 'Income', 'Deposit'].includes(formType);

    const newTxn: Transaction = {
      id: `TXN-${Date.now().toString().slice(-3)}`,
      date: new Date().toISOString().split('T')[0],
      type: formType,
      typeBn: isBangla ? (formType === 'Income' ? 'আয়' : formType === 'Expense' ? 'ব্যয়' : 'অন্যান্য') : formType,
      account: formAccount,
      accountBn: formAccount,
      desc: formDesc || 'Logged transaction entry',
      descBn: formDesc || 'লগ করা লেনদেনের এন্ট্রি',
      party: formParty || 'N/A',
      partyBn: formParty || 'প্রযোজ্য নয়',
      debit: isCredit ? 0 : parsedAmount,
      credit: isCredit ? parsedAmount : 0,
      method: formMethod,
      methodBn: isBangla ? (formMethod === 'Cash' ? 'নগদ' : 'ব্যাংক') : formMethod,
      status: formStatus,
      statusBn: isBangla ? (formStatus === 'Completed' ? 'সম্পন্ন' : 'অপেক্ষমান') : formStatus,
      branch: formBranch,
      branchBn: isBangla ? (formBranch === 'Dhaka' ? 'ঢাকা' : 'চট্টগ্রাম') : formBranch,
    };

    setTransactions([newTxn, ...transactions]);
    setIsCreateOpen(false);

    // Reset Form
    setFormAccount('');
    setFormDesc('');
    setFormAmount('');
    setFormParty('');
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const handleOpenDetails = (txn: Transaction) => {
    setActiveTransaction(txn);
    setIsDetailsOpen(true);
  };

  // Filtering transactions
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.party.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'all' || t.type === selectedType;
    const matchesMethod = selectedMethod === 'all' || t.method.toLowerCase().includes(selectedMethod.toLowerCase());
    const matchesBranch = selectedBranch === 'all' || t.branch.toLowerCase() === selectedBranch.toLowerCase();
    const matchesStatus = selectedStatus === 'all' || t.status === selectedStatus;

    return matchesSearch && matchesType && matchesMethod && matchesBranch && matchesStatus;
  });

  // Totals calculations
  const totalInflows = filteredTransactions.reduce((acc, t) => acc + t.credit, 0);
  const totalOutflows = filteredTransactions.reduce((acc, t) => acc + t.debit, 0);
  const totalCount = filteredTransactions.length;
  const pendingCount = filteredTransactions.filter((t) => t.status === 'Pending').length;

  const activeFiltersCount = 
    (searchTerm ? 1 : 0) +
    (selectedType !== 'all' ? 1 : 0) +
    (selectedMethod !== 'all' ? 1 : 0) +
    (selectedBranch !== 'all' ? 1 : 0) +
    (selectedStatus !== 'all' ? 1 : 0);

  const handleExport = (type: string) => {
    alert(isBangla ? `${type} এক্সপোর্ট সিমুলেশন সম্পন্ন!` : `${type} export simulation completed!`);
  };

  return (
    <div className="space-y-6">
      {/* 1. Breadcrumbs Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1.5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-muted-foreground hover:text-foreground">
                  {isBangla ? 'ড্যাশবোর্ড' : 'Dashboard'}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span className="text-muted-foreground">
                  {isBangla ? 'অর্থায়ন ও হিসাববিজ্ঞান' : 'Finance & Accounting'}
                </span>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium text-foreground">
                  {isBangla ? 'লেনদেন রেজিস্টার' : 'Transactions Ledger'}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {isBangla ? 'লেনদেন খাতা রেজিস্টার' : 'Transactions Ledger'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isBangla
              ? 'আপনার ব্যবসায়ের সমস্ত আর্থিক লেনদেন দেখুন, রেকর্ড করুন এবং পরিচালনা করুন।'
              : 'View, record, and manage every financial transaction ledger across your business.'}
          </p>
        </div>

        {/* Toolbar Trigger Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Button onClick={() => setIsCreateOpen(true)} className="gap-1.5 text-xs h-9">
            <Plus className="h-4 w-4" />
            {isBangla ? 'নতুন লেনদেন' : 'Record Transaction'}
          </Button>
          <Button variant="outline" onClick={() => handleExport('Excel')} className="gap-1.5 text-xs h-9">
            <Upload className="h-3.5 w-3.5" />
            <span>{isBangla ? 'ইম্পোর্ট' : 'Import'}</span>
          </Button>
          <Button variant="outline" onClick={() => handleExport('PDF')} className="gap-1.5 text-xs h-9">
            <Download className="h-3.5 w-3.5" />
            <span>{isBangla ? 'এক্সপোর্ট' : 'Export'}</span>
          </Button>
        </div>
      </div>

      {/* 2. Dynamic Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{isBangla ? 'মোট লেনদেন' : 'Total Transactions'}</p>
              <h3 className="text-xl font-bold text-foreground mt-1 font-mono">{totalCount}</h3>
            </div>
            <div className="h-9 w-9 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <ArrowLeftRight className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{isBangla ? 'মোট জমা (ইনফ্লো)' : 'Total Inflows'}</p>
              <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">{formatCurrency(totalInflows)}</h3>
            </div>
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Coins className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-rose-600 dark:text-rose-400">{isBangla ? 'মোট খরচ (আউটফ্লো)' : 'Total Outflows'}</p>
              <h3 className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1 font-mono">{formatCurrency(totalOutflows)}</h3>
            </div>
            <div className="h-9 w-9 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <FileClock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-card to-primary/[0.01]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-primary">{isBangla ? 'অপেক্ষমান এন্ট্রি' : 'Pending Approvals'}</p>
              <h3 className="text-xl font-bold text-primary mt-1 font-mono">{pendingCount}</h3>
            </div>
            <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Clock3 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Toolbar Search & Filters */}
      <div className="border border-border/30 rounded-xl overflow-hidden bg-card/40 p-1 flex flex-col sm:flex-row gap-1 items-center justify-between">
        {/* Left Side: Search Box */}
        <div className="relative w-full sm:w-48 shrink-0">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder={isBangla ? 'অনুসন্ধান...' : 'Search...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-7 h-7 text-[11px] bg-background/50 rounded-lg border-border/20 focus-visible:ring-primary/20"
          />
        </div>

        {/* Right Side: Grouped Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-1 justify-end w-full sm:w-auto">
          {/* Type Select */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="h-7 rounded-lg border border-border/30 bg-background/50 px-1.5 text-[11px] shadow-sm focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer text-muted-foreground font-medium"
          >
            <option value="all">{isBangla ? 'সব ধরণের লেনদেন' : 'All Types'}</option>
            <option value="Sales">{isBangla ? 'পণ্য বিক্রয়' : 'Sales'}</option>
            <option value="Income">{isBangla ? 'পরিচালন আয়' : 'Income'}</option>
            <option value="Expense">{isBangla ? 'খরচ/ব্যয়' : 'Expense'}</option>
            <option value="Deposit">{isBangla ? 'জমা (ডিপোজিট)' : 'Deposit'}</option>
            <option value="Withdrawal">{isBangla ? 'উত্তোলন' : 'Withdrawal'}</option>
            <option value="Transfer">{isBangla ? 'স্থানান্তর' : 'Transfer'}</option>
            <option value="Loan">{isBangla ? 'ঋণ/লোন' : 'Loan'}</option>
          </select>

          {/* Method Select */}
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="h-7 rounded-lg border border-border/30 bg-background/50 px-1.5 text-[11px] shadow-sm focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer text-muted-foreground font-medium"
          >
            <option value="all">{isBangla ? 'সব পেমেন্ট পদ্ধতি' : 'All Methods'}</option>
            <option value="cash">{isBangla ? 'নগদ' : 'Cash'}</option>
            <option value="bank">{isBangla ? 'ব্যাংক' : 'Bank'}</option>
            <option value="card">{isBangla ? 'কার্ড' : 'Card'}</option>
          </select>

          {/* Branch Select */}
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="h-7 rounded-lg border border-border/30 bg-background/50 px-1.5 text-[11px] shadow-sm focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer text-muted-foreground font-medium"
          >
            <option value="all">{isBangla ? 'সব শাখা' : 'All Branches'}</option>
            <option value="dhaka">{isBangla ? 'ঢাকা শাখা' : 'Dhaka'}</option>
            <option value="chittagong">{isBangla ? 'চট্টগ্রাম শাখা' : 'Chittagong'}</option>
          </select>

          {/* Status Select */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-7 rounded-lg border border-border/30 bg-background/50 px-1.5 text-[11px] shadow-sm focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer text-muted-foreground font-medium"
          >
            <option value="all">{isBangla ? 'সব স্ট্যাটাস' : 'All Statuses'}</option>
            <option value="Completed">{isBangla ? 'সম্পন্ন' : 'Completed'}</option>
            <option value="Pending">{isBangla ? 'অপেক্ষমান' : 'Pending'}</option>
          </select>

          {/* Reset filters action */}
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setSelectedType('all');
                setSelectedMethod('all');
                setSelectedBranch('all');
                setSelectedStatus('all');
              }}
              className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 text-[11px] h-7 px-1.5 shrink-0 transition-colors"
            >
              {isBangla ? 'রিসেট' : 'Reset'}
            </Button>
          )}
        </div>
      </div>

      {/* 4. Table view registry */}
      <Card className="border-border/50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30 border-b border-border/20 text-muted-foreground font-semibold">
              <TableRow>
                <TableHead className="p-3">{isBangla ? 'তারিখ' : 'Date'}</TableHead>
                <TableHead className="p-3">{isBangla ? 'আইডি' : 'Voucher ID'}</TableHead>
                <TableHead className="p-3">{isBangla ? 'লেনদেনের ধরণ' : 'Type'}</TableHead>
                <TableHead className="p-3">{isBangla ? 'হিসাব খাতা' : 'Ledger Account'}</TableHead>
                <TableHead className="p-3">{isBangla ? 'বিবরণ' : 'Narration'}</TableHead>
                <TableHead className="p-3">{isBangla ? 'পার্টি' : 'Particulars/Party'}</TableHead>
                <TableHead className="p-3 text-right">{isBangla ? 'ডেবিট (আউট)' : 'Debit (Outflow)'}</TableHead>
                <TableHead className="p-3 text-right">{isBangla ? 'ক্রেডিট (ইন)' : 'Credit (Inflow)'}</TableHead>
                <TableHead className="p-3">{isBangla ? 'পদ্ধতি' : 'Method'}</TableHead>
                <TableHead className="p-3">{isBangla ? 'অবস্থা' : 'Status'}</TableHead>
                <TableHead className="p-3 text-center">{isBangla ? 'অ্যাকশন' : 'Action'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border/10">
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="h-64 text-center text-muted-foreground font-semibold">
                    {isBangla ? 'কোনো লেনদেন এন্ট্রি পাওয়া যায়নি।' : 'No financial transaction records found.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((txn) => (
                  <TableRow key={txn.id} className="hover:bg-muted/5">
                    <td className="p-3 font-mono text-muted-foreground">{txn.date}</td>
                    <td className="p-3 font-mono font-bold text-primary">{txn.id}</td>
                    <td className="p-3">
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-[9px] py-0.5 px-2 rounded-md border-transparent font-bold',
                          ['Sales', 'Income', 'Deposit'].includes(txn.type)
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        )}
                      >
                        {isBangla ? txn.typeBn : txn.type}
                      </Badge>
                    </td>
                    <td className="p-3 font-semibold text-foreground">{isBangla ? txn.accountBn : txn.account}</td>
                    <td className="p-3 text-muted-foreground">{isBangla ? txn.descBn : txn.desc}</td>
                    <td className="p-3 font-medium text-foreground">{isBangla ? txn.partyBn : txn.party}</td>
                    <td className="p-3 text-right font-mono text-rose-600 dark:text-rose-400">
                      {txn.debit > 0 ? formatCurrency(txn.debit) : '-'}
                    </td>
                    <td className="p-3 text-right font-mono text-emerald-600 dark:text-emerald-400">
                      {txn.credit > 0 ? formatCurrency(txn.credit) : '-'}
                    </td>
                    <td className="p-3 text-muted-foreground">{isBangla ? txn.methodBn : txn.method}</td>
                    <td className="p-3">
                      <Badge
                        className={cn(
                          'rounded-md text-[9px] py-0 px-1.5 font-bold border-transparent',
                          txn.status === 'Completed'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-500'
                        )}
                      >
                        {isBangla ? txn.statusBn : txn.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex gap-1.5 justify-center">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleOpenDetails(txn)}
                          className="h-7 w-7 text-primary hover:bg-primary/10"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteTransaction(txn.id)}
                          className="h-7 w-7 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* 5. Create Transaction dialog popup */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[680px] border-border/60">
          <form onSubmit={handleAddTransaction} className="space-y-4">
            <DialogHeader className="border-b pb-2.5">
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <span>{isBangla ? 'আর্থিক লেনদেন ভাউচার রেকর্ড' : 'Record Transaction Voucher'}</span>
              </DialogTitle>
            </DialogHeader>

            {/* Split Form Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Left Column */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">{isBangla ? 'লেনদেনের ধরণ (Voucher Type)' : 'Voucher Type'}</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/20"
                  >
                    <option value="Income">{isBangla ? 'পরিচালন আয় (Income)' : 'Operating Income'}</option>
                    <option value="Expense">{isBangla ? 'পরিচালন ব্যয় (Expense)' : 'Operating Expense'}</option>
                    <option value="Deposit">{isBangla ? 'ব্যাংক জমা (Deposit)' : 'Bank Deposit (Contra)'}</option>
                    <option value="Withdrawal">{isBangla ? 'ব্যাংক উত্তোলন (Withdrawal)' : 'Bank Withdrawal (Contra)'}</option>
                    <option value="Transfer">{isBangla ? 'তহবিল স্থানান্তর (Transfer)' : 'Contra Fund Transfer'}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">{isBangla ? 'হিসাব খাতা (Ledger Account)' : 'Ledger Account'}</label>
                  <Input
                    placeholder={isBangla ? 'যেমন: পণ্য বিক্রয়, অফিস ভাড়া, ইত্যাদি' : 'e.g. Product Sales, Office Rent'}
                    value={formAccount}
                    onChange={(e) => setFormAccount(e.target.value)}
                    required
                    className="h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">{isBangla ? 'সংশ্লিষ্ট পার্টি (Associated Party)' : 'Associated Party'}</label>
                  <Input
                    placeholder={isBangla ? 'মেসার্স রহমত ব্রাদার্স / নিজস্ব' : 'e.g. M/S Rahman & Sons'}
                    value={formParty}
                    onChange={(e) => setFormParty(e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">{isBangla ? 'লেনদেন পরিমাণ (Amount)' : 'Voucher Amount'}</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    required
                    className="h-9 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">{isBangla ? 'পেমেন্ট পদ্ধতি (Payment Method)' : 'Payment Method'}</label>
                  <select
                    value={formMethod}
                    onChange={(e) => setFormMethod(e.target.value)}
                    className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/20"
                  >
                    <option value="Cash">{isBangla ? 'নগদ ক্যাশ (Cash)' : 'Cash'}</option>
                    <option value="Bank Transfer">{isBangla ? 'ব্যাংক স্থানান্তর (Bank)' : 'Bank Transfer'}</option>
                    <option value="Mobile Wallet">{isBangla ? 'মোবাইল ওয়ালেট (bkash/Nagad)' : 'Mobile Wallet'}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">{isBangla ? 'শাখা (Branch)' : 'Branch'}</label>
                  <select
                    value={formBranch}
                    onChange={(e) => setFormBranch(e.target.value)}
                    className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/20"
                  >
                    <option value="Dhaka">{isBangla ? 'ঢাকা শাখা' : 'Dhaka'}</option>
                    <option value="Chittagong">{isBangla ? 'চট্টগ্রাম শাখা' : 'Chittagong'}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Narration note - Full width */}
            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-muted-foreground">{isBangla ? 'লেনদেনের বিবরণ / ন্যারেশন (Memo)' : 'Narration / Memo'}</label>
              <Input
                placeholder={isBangla ? 'লেনদেন সংক্রান্ত বিশদ বিবরণ লিখুন...' : 'Write invoice references or payment notes...'}
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                className="h-9"
              />
            </div>

            {/* Live Double Entry Posting Preview */}
            <div className="bg-muted/30 border border-dashed rounded-lg p-2.5 space-y-1.5 text-[11px] font-mono">
              <p className="font-bold text-[10px] tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                <span>{isBangla ? 'দ্বৈত দাখিলা খতিয়ান পোস্টিং প্রিভিউ' : 'Double-Entry Posting Preview'}</span>
              </p>
              
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2 bg-emerald-500/5 border border-emerald-500/10 rounded-md">
                  <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-500 block uppercase">{isBangla ? 'ডেবিট ভুক্তি (Debit)' : 'Debit Ledger Posting'}</span>
                  <span className="font-bold text-foreground block mt-0.5 truncate">
                    {formType === 'Income' ? (isBangla ? 'নগদ / ব্যাংক তহবিল' : `${formMethod} Account`) : ''}
                    {formType === 'Expense' ? (formAccount || (isBangla ? 'ব্যয় খাতা' : 'Expense Ledger')) : ''}
                    {formType === 'Deposit' ? (formAccount || (isBangla ? 'ব্যাংক হিসাব' : 'Contra Bank')) : ''}
                    {formType === 'Withdrawal' ? (isBangla ? 'নগদ ক্যাশ অন হ্যান্ড' : 'Cash on Hand') : ''}
                    {formType === 'Transfer' ? (formAccount || (isBangla ? 'প্রাপক হিসাব' : 'Destination Account')) : ''}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">
                    +{formatCurrency(parseFloat(formAmount) || 0)}
                  </span>
                </div>

                <div className="p-2 bg-rose-500/5 border border-rose-500/10 rounded-md">
                  <span className="text-[9px] font-bold text-rose-500 block uppercase">{isBangla ? 'ক্রেডিট ভুক্তি (Credit)' : 'Credit Ledger Posting'}</span>
                  <span className="font-bold text-foreground block mt-0.5 truncate">
                    {formType === 'Income' ? (formAccount || (isBangla ? 'আয় হিসাব' : 'Revenue Ledger')) : ''}
                    {formType === 'Expense' ? (isBangla ? 'নগদ / ব্যাংক তহবিল' : `${formMethod} Account`) : ''}
                    {formType === 'Deposit' ? (isBangla ? 'নগদ ক্যাশ অন হ্যান্ড' : 'Cash on Hand') : ''}
                    {formType === 'Withdrawal' ? (formAccount || (isBangla ? 'ব্যাংক হিসাব' : 'Contra Bank')) : ''}
                    {formType === 'Transfer' ? (isBangla ? 'উৎস ব্যাংক/নগদ' : `${formMethod} Source`) : ''}
                  </span>
                  <span className="text-rose-500 block mt-0.5 font-bold">
                    +{formatCurrency(parseFloat(formAmount) || 0)}
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter className="border-t pt-3">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} className="text-xs h-9">
                {isBangla ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button type="submit" className="text-xs h-9">
                {isBangla ? 'ভাউচার দাখিল করুন' : 'Submit Voucher Entry'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 6. Transaction Details dialog popup */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>{isBangla ? 'লেনদেনের বিবরণ ভাউচার' : 'Transaction Voucher Details'}</span>
            </DialogTitle>
          </DialogHeader>

          {activeTransaction && (
            <div className="space-y-4 text-xs font-medium border-t pt-3 border-border/20">
              <div className="flex justify-between items-center bg-muted/40 p-2.5 rounded-lg border">
                <div>
                  <p className="text-[10px] text-muted-foreground">{isBangla ? 'ভাউচার নম্বর' : 'VOUCHER NUMBER'}</p>
                  <p className="font-bold text-primary font-mono text-sm mt-0.5">#{activeTransaction.id}</p>
                </div>
                <Badge
                  className={cn(
                    'rounded-md text-[10px] py-0.5 px-2 font-bold border-transparent',
                    activeTransaction.status === 'Completed'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-500'
                  )}
                >
                  {isBangla ? activeTransaction.statusBn : activeTransaction.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-muted-foreground">{isBangla ? 'লেনদেনের তারিখ' : 'TRANSACTION DATE'}</p>
                  <p className="font-semibold text-foreground mt-0.5 font-mono">{activeTransaction.date}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">{isBangla ? 'হিসাব খাতা' : 'LEDGER ACCOUNT'}</p>
                  <p className="font-semibold text-foreground mt-0.5">
                    {isBangla ? activeTransaction.accountBn : activeTransaction.account}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-muted-foreground">{isBangla ? 'লেনদেন ধরণ' : 'TRANSACTION TYPE'}</p>
                  <p className="font-semibold text-foreground mt-0.5">{isBangla ? activeTransaction.typeBn : activeTransaction.type}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">{isBangla ? 'পেমেন্ট পদ্ধতি' : 'PAYMENT METHOD'}</p>
                  <p className="font-semibold text-foreground mt-0.5">
                    {isBangla ? activeTransaction.methodBn : activeTransaction.method}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-muted-foreground">{isBangla ? 'সংশ্লিষ্ট শাখা' : 'BRANCH LOCATION'}</p>
                  <p className="font-semibold text-foreground mt-0.5">
                    {isBangla ? activeTransaction.branchBn : activeTransaction.branch}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">{isBangla ? 'পার্টি/ব্যক্তি নাম' : 'ASSOCIATED PARTY'}</p>
                  <p className="font-semibold text-foreground mt-0.5">
                    {isBangla ? activeTransaction.partyBn : activeTransaction.party}
                  </p>
                </div>
              </div>

              <div className="border-t pt-3 border-border/10">
                <p className="text-[10px] text-muted-foreground">{isBangla ? 'লেনদেনের বিবরণী নোট' : 'MEMO DETAILS'}</p>
                <p className="text-muted-foreground mt-0.5 italic leading-relaxed">
                  {isBangla ? activeTransaction.descBn : activeTransaction.desc}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t pt-3 border-border/10">
                <div className="p-2 bg-rose-500/5 rounded-lg border border-rose-500/10">
                  <p className="text-[9px] text-rose-500 font-bold uppercase tracking-wider">{isBangla ? 'ডেবিট (টাকা)' : 'Debit Outflow'}</p>
                  <p className="text-sm font-bold text-rose-600 dark:text-rose-400 font-mono mt-0.5">
                    {activeTransaction.debit > 0 ? formatCurrency(activeTransaction.debit) : '—'}
                  </p>
                </div>
                <div className="p-2 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                  <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider">{isBangla ? 'ক্রেডিট (টাকা)' : 'Credit Inflow'}</p>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-500 font-mono mt-0.5">
                    {activeTransaction.credit > 0 ? formatCurrency(activeTransaction.credit) : '—'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button onClick={() => setIsDetailsOpen(false)} className="text-xs h-9 w-full sm:w-auto">
              {isBangla ? 'বন্ধ করুন' : 'Close'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
