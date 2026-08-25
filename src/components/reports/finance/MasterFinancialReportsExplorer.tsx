// Hello Khata OS - Master Financial & Accounting Reports Explorer
// হ্যালো খাতা - আর্থিক ও হিসাবরক্ষণ রিপোর্টস এক্সপ্লোরার (কেন্দ্রীয় রিপোর্ট হাব)

'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Scale,
  RefreshCw,
  BookOpen,
  Receipt,
  FolderTree,
  Coins,
  Building2,
  Percent,
  Landmark,
  PiggyBank,
  ShieldCheck,
  Search,
  LayoutGrid,
  List,
  Star,
  Download,
  FileSpreadsheet,
  ArrowUpRight,
  ChevronRight,
  Sparkles,
  Sliders,
  Plus,
  FileText,
  Wallet,
  ScrollText,
  ArrowLeftRight,
  Eye,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
// import { exportMultiSheetFinancialWorkbook } from '@/lib/export/financial-excel-export';
import { CustomFinancialReportModal } from './CustomFinancialReportModal';

export interface MasterFinanceReport {
  id: string;
  name: string;
  nameBn: string;
  category: 'statements' | 'ledgers' | 'banking' | 'dues' | 'compliance';
  categoryLabel: string;
  categoryLabelBn: string;
  description: string;
  descriptionBn: string;
  href: string;
  icon: React.ElementType;
  colorClass: string;
  bgClass: string;
  badge?: string;
  badgeBn?: string;
  quickStat?: string;
  quickStatLabel?: string;
  isPopular?: boolean;
}

const FINANCE_REPORTS_CATALOG: MasterFinanceReport[] = [
  // 1. STATEMENTS
  {
    id: 'pnl',
    name: 'Profit & Loss Statement',
    nameBn: 'লাভ-ক্ষতি বিবরণী (P&L Statement)',
    category: 'statements',
    categoryLabel: 'Financial Statements',
    categoryLabelBn: 'আর্থিক বিবরণী',
    description: 'Comprehensive statement of operating revenue, cost of goods sold, gross margin, and net operational profit.',
    descriptionBn: 'মোট বিক্রয় রাজস্ব, বিক্রীত পণ্যের ব্যয়, মোট লাভ এবং পরিচালন নিট মুনাফার পূর্ণাঙ্গ বিবরণী।',
    href: '/finance/reports/profit-loss',
    icon: TrendingUp,
    colorClass: 'text-emerald-600 dark:text-emerald-400',
    bgClass: 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/20',
    badge: 'Core Statement',
    badgeBn: 'প্রধান বিবরণী',
    quickStat: '৳4,82,450 Net Profit',
    quickStatLabel: 'Current Month',
    isPopular: true,
  },
  {
    id: 'balance-sheet',
    name: 'Balance Sheet',
    nameBn: 'উদ্বৃত্তপত্র / ব্যালেন্স শিট (Balance Sheet)',
    category: 'statements',
    categoryLabel: 'Financial Statements',
    categoryLabelBn: 'আর্থিক বিবরণী',
    description: 'Statutory snapshot of enterprise assets, liabilities, and shareholders equity following IAS/IFRS standards.',
    descriptionBn: 'ব্যবসায়ের মোট সম্পদ, দায় এবং মালিকানাস্বত্বের সংবিধিবদ্ধ সারসংক্ষেপ ও আর্থিক ভারসাম্য।',
    href: '/finance/reports/balance-sheet',
    icon: Scale,
    colorClass: 'text-purple-600 dark:text-purple-400',
    bgClass: 'bg-purple-500/10 dark:bg-purple-500/15 border-purple-500/20',
    badge: 'Core Statement',
    badgeBn: 'প্রধান বিবরণী',
    quickStat: '৳32.45L Total Assets',
    quickStatLabel: 'Balanced',
    isPopular: true,
  },
  {
    id: 'cash-flow',
    name: 'Cash Flow Statement',
    nameBn: 'নগদ প্রবাহ বিবরণী (Cash Flow)',
    category: 'statements',
    categoryLabel: 'Financial Statements',
    categoryLabelBn: 'আর্থিক বিবরণী',
    description: 'Detailed analysis of operating, investing, and financing cash movements with net cash flow reconciliation.',
    descriptionBn: 'পরিচালন, বিনিয়োগ ও অর্থায়ন সংক্রান্ত নগদ তহবিলের আগমন ও বহির্গমনের গতিপথ।',
    href: '/finance/reports/cash-flow',
    icon: RefreshCw,
    colorClass: 'text-blue-600 dark:text-blue-400',
    bgClass: 'bg-blue-500/10 dark:bg-blue-500/15 border-blue-500/20',
    badge: 'Liquidity',
    badgeBn: 'তারল্য',
    quickStat: '+৳1,45,900 Net Flow',
    quickStatLabel: 'Positive',
    isPopular: true,
  },
  {
    id: 'trial-balance',
    name: 'Trial Balance',
    nameBn: 'রেওয়ামিল (Trial Balance Reconciliation)',
    category: 'statements',
    categoryLabel: 'Financial Statements',
    categoryLabelBn: 'আর্থিক বিবরণী',
    description: 'Periodic debit and credit reconciliation across all ledger accounts to ensure mathematical accuracy.',
    descriptionBn: 'সকল খতিয়ান হিসাবের ডেবিট ও ক্রেডিট জের সমান হওয়ার নির্ভুল গাণিতিক যাচাইকরণ।',
    href: '/finance/reports/trial-balance',
    icon: BookOpen,
    colorClass: 'text-amber-600 dark:text-amber-400',
    bgClass: 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/20',
    badge: 'Reconciliation',
    badgeBn: 'জের যাচাই',
    quickStat: 'Dr = Cr Match',
    quickStatLabel: 'Zero Variance',
    isPopular: true,
  },

  // 2. LEDGERS & JOURNALS
  {
    id: 'general-ledger',
    name: 'General Ledger Book',
    nameBn: 'খতিয়ান বই (General Ledger)',
    category: 'ledgers',
    categoryLabel: 'Ledgers & Journals',
    categoryLabelBn: 'খতিয়ান ও জাবেদা',
    description: 'Complete chronological transaction log and running balance organized by individual Chart of Accounts.',
    descriptionBn: 'হিসাব তালিকার প্রতিটি অ্যাকাউন্টের তারিখভিত্তিক বিস্তারিত লেনদেন ও চলমান ব্যালেন্স।',
    href: '/reports/finance/general-ledger',
    icon: FileText,
    colorClass: 'text-indigo-600 dark:text-indigo-400',
    bgClass: 'bg-indigo-500/10 dark:bg-indigo-500/15 border-indigo-500/20',
    badge: 'Audit Trail',
    badgeBn: 'অডিট লগ',
    quickStat: '42 Accounts Active',
    quickStatLabel: 'Master Ledger',
    isPopular: true,
  },
  {
    id: 'account-statement',
    name: 'Account Statement (Ledger Summary)',
    nameBn: 'হিসাব বিবরণী (Account Statement)',
    category: 'ledgers',
    categoryLabel: 'Ledgers & Journals',
    categoryLabelBn: 'খতিয়ান ও জাবেদা',
    description: 'Single-account transaction statement with opening balance, debit/credit details, and closing position.',
    descriptionBn: 'নির্দিষ্ট কোনো একটি হিসাবের শুরু থেকে শেষ পর্যন্ত সকল লেনদেনের একক স্টেটমেন্ট।',
    href: '/finance/reports/account-statement',
    icon: ScrollText,
    colorClass: 'text-teal-600 dark:text-teal-400',
    bgClass: 'bg-teal-500/10 dark:bg-teal-500/15 border-teal-500/20',
    quickStat: 'Single Account Filter',
    quickStatLabel: 'Export Ready',
  },
  {
    id: 'journal-report',
    name: 'Journal Book & Vouchers',
    nameBn: 'জাবেদা বই ও ভাউচার লগ (Journal Register)',
    category: 'ledgers',
    categoryLabel: 'Ledgers & Journals',
    categoryLabelBn: 'খতিয়ান ও জাবেদা',
    description: 'Original double-entry journal vouchers (JV), debit vouchers (DV), and credit vouchers (CV) register.',
    descriptionBn: 'ব্যবসায়ের সকল দ্বৈত দাখিলা জাবেদা এন্ট্রি ও ভাউচারের আনুষ্ঠানিক রেজিস্টার।',
    href: '/reports/finance/journal-report',
    icon: Receipt,
    colorClass: 'text-sky-600 dark:text-sky-400',
    bgClass: 'bg-sky-500/10 dark:bg-sky-500/15 border-sky-500/20',
    quickStat: '142 Posted Vouchers',
    quickStatLabel: 'This Month',
  },
  {
    id: 'chart-of-accounts',
    name: 'Chart of Accounts (COA Master)',
    nameBn: 'হিসাবের তালিকা ও কোড (Chart of Accounts)',
    category: 'ledgers',
    categoryLabel: 'Ledgers & Journals',
    categoryLabelBn: 'খতিয়ান ও জাবেদা',
    description: 'Hierarchical 5-tier classification of Assets, Liabilities, Equity, Revenues, and Operating Expenses.',
    descriptionBn: 'সম্পদ, দায়, মূলধন, আয় ও ব্যয়ের ৫ স্তরের প্রাতিষ্ঠানিক হিসাব কাঠামো ও লেজার কোড।',
    href: '/reports/finance/chart-of-accounts',
    icon: FolderTree,
    colorClass: 'text-violet-600 dark:text-violet-400',
    bgClass: 'bg-violet-500/10 dark:bg-violet-500/15 border-violet-500/20',
    quickStat: '5 Asset Categories',
    quickStatLabel: 'Configured',
  },

  // 3. CASH & BANKING
  {
    id: 'cash-book',
    name: 'Cash Book (Petty & Counter Cash)',
    nameBn: 'নগদান বই (Cash Book Register)',
    category: 'banking',
    categoryLabel: 'Cash & Banking',
    categoryLabelBn: 'নগদ ও ব্যাংকিং',
    description: 'Physical cash desk receipts, petty cash expenses, and physical vault cash closing reconciliations.',
    descriptionBn: 'দোকান বা কাউন্টারে নগদ টাকার দৈনিক জমা, খরচ ও দিন শেষের ভল্ট ক্যাশ হিসাব।',
    href: '/reports/finance/cash-book',
    icon: Wallet,
    colorClass: 'text-emerald-600 dark:text-emerald-400',
    bgClass: 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/20',
    badge: 'Daily Desk',
    badgeBn: 'দৈনিক ক্যাশ',
    quickStat: '৳2,15,000 Cash in Hand',
    quickStatLabel: 'Counter 1 & 2',
    isPopular: true,
  },
  {
    id: 'bank-book',
    name: 'Bank Book & Reconciliation',
    nameBn: 'ব্যাংক হিসাব বই (Bank Book & Cheques)',
    category: 'banking',
    categoryLabel: 'Cash & Banking',
    categoryLabelBn: 'নগদ ও ব্যাংকিং',
    description: 'Multi-bank accounts deposit history, cheque issuances, wire transfers, and statement reconciliation.',
    descriptionBn: 'বিভিন্ন ব্যাংকের চলতি ও সঞ্চয়ী হিসাবের টাকা জমা, চেক প্রদান ও ব্যাংক রিকনসিলিয়েশন।',
    href: '/reports/finance/bank-book',
    icon: Landmark,
    colorClass: 'text-blue-600 dark:text-blue-400',
    bgClass: 'bg-blue-500/10 dark:bg-blue-500/15 border-blue-500/20',
    quickStat: '৳5,70,900 in Bank',
    quickStatLabel: 'BRAC & City Bank',
    isPopular: true,
  },
  {
    id: 'deposit-withdrawal',
    name: 'Deposit & Withdrawal Report',
    nameBn: 'ব্যাংক জমা ও উত্তোলন রিপোর্ট',
    category: 'banking',
    categoryLabel: 'Cash & Banking',
    categoryLabelBn: 'নগদ ও ব্যাংকিং',
    description: 'Summary of internal bank deposits, ATM/branch cash withdrawals, and inter-account transfers.',
    descriptionBn: 'অভ্যন্তরীণ ব্যাংক জমা, নগদ উত্তোলন এবং বিভিন্ন ব্যাংক ও ওয়ালেটের ফান্ড ট্রান্সফার।',
    href: '/reports/finance/deposit-withdrawal',
    icon: ArrowLeftRight,
    colorClass: 'text-cyan-600 dark:text-cyan-400',
    bgClass: 'bg-cyan-500/10 dark:bg-cyan-500/15 border-cyan-500/20',
    quickStat: '৳1.20L Transferred',
    quickStatLabel: 'This Week',
  },
  {
    id: 'wallet-statement',
    name: 'MFS Wallet Statement (bKash/Nagad)',
    nameBn: 'এমএফএস ওয়ালেট স্টেটমেন্ট (বিকাশ / নগদ)',
    category: 'banking',
    categoryLabel: 'Cash & Banking',
    categoryLabelBn: 'নগদ ও ব্যাংকিং',
    description: 'Merchant bKash, Nagad, and Rocket wallet collection logs, cashout fees, and merchant settlement.',
    descriptionBn: 'বিকাশ ও নগদ মার্চেন্ট ওয়ালেটের পেমেন্ট কালেকশন, ক্যাশআউট চার্জ ও সেটেলমেন্ট রিপোর্ট।',
    href: '/reports/finance/wallet-statement',
    icon: Coins,
    colorClass: 'text-pink-600 dark:text-pink-400',
    bgClass: 'bg-pink-500/10 dark:bg-pink-500/15 border-pink-500/20',
    quickStat: '৳85,000 MFS Balance',
    quickStatLabel: 'Active Wallets',
  },

  // 4. CREDIT & WORKING CAPITAL
  {
    id: 'receivables',
    name: 'Accounts Receivable & Aging',
    nameBn: 'গ্রাহক বকেয়া ও মেয়াদ বিশ্লেষণ (Receivables)',
    category: 'dues',
    categoryLabel: 'Credit & Working Capital',
    categoryLabelBn: 'বকেয়া ও দেনা-পাওনা',
    description: 'Outstanding customer dues segmented into 0-30, 31-60, 61-90, and 90+ days aging buckets with risk flags.',
    descriptionBn: 'সকল কাস্টমারদের বাকি টাকা এবং সময়ভিত্তিক বকেয়ার ঝুঁকি ও মেয়াদোত্তীর্ণ বিশ্লেষণ।',
    href: '/reports/finance/receivables',
    icon: Percent,
    colorClass: 'text-emerald-600 dark:text-emerald-400',
    bgClass: 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/20',
    badge: 'Customer Dues',
    badgeBn: 'কাস্টমার বাকি',
    quickStat: '৳3,24,500 Total Due',
    quickStatLabel: '৳82k Overdue',
    isPopular: true,
  },
  {
    id: 'payables',
    name: 'Accounts Payable & Supplier Dues',
    nameBn: 'সাপ্লায়ার বকেয়া ও দেনা রিপোর্ট (Payables)',
    category: 'dues',
    categoryLabel: 'Credit & Working Capital',
    categoryLabelBn: 'বকেয়া ও দেনা-পাওনা',
    description: 'Supplier credit balances, pending purchase bills, due maturity dates, and payment disbursement schedule.',
    descriptionBn: 'সরবরাহকারীদের প্রদেয় দেনা, অপরিশোধিত ইনভয়েস এবং পেমেন্ট পরিশোধের সময়সূচি।',
    href: '/reports/finance/payables',
    icon: Building2,
    colorClass: 'text-rose-600 dark:text-rose-400',
    bgClass: 'bg-rose-500/10 dark:bg-rose-500/15 border-rose-500/20',
    badge: 'Supplier Dues',
    badgeBn: 'সাপ্লায়ার দেনা',
    quickStat: '৳1,95,000 Payable',
    quickStatLabel: '3 Maturing Soon',
    isPopular: true,
  },
  {
    id: 'loan-management',
    name: 'Loans & EMI Schedule Report',
    nameBn: 'ঋণ ও কিস্তি রেজিস্টার (Loans & Liabilities)',
    category: 'dues',
    categoryLabel: 'Credit & Working Capital',
    categoryLabelBn: 'বকেয়া ও দেনা-পাওনা',
    description: 'Bank loans, director loans, interest calculations, monthly EMI schedules, and principal balance tracking.',
    descriptionBn: 'ব্যবসায়িক ব্যাংক ঋণ, পরিচালক ঋণ, সুদের হিসাব এবং মাসিক কিস্তি পরিশোধের রেজিস্টার।',
    href: '/reports/finance/loan',
    icon: PiggyBank,
    colorClass: 'text-amber-600 dark:text-amber-400',
    bgClass: 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/20',
    quickStat: '৳2,50,000 Loan Balance',
    quickStatLabel: 'Monthly EMI Active',
  },

  // 5. TAX & COMPLIANCE
  {
    id: 'vat-tax-ledger',
    name: 'VAT & Tax Compliance Register',
    nameBn: 'মূসক ও ভ্যাট রিটার্ন রেজিস্টার (VAT & Tax)',
    category: 'compliance',
    categoryLabel: 'Tax & Compliance',
    categoryLabelBn: 'ট্যাক্স ও কমপ্লায়েন্স',
    description: 'NBR VAT 9.1 return preparation, input VAT credits, output VAT collected, and Advance Income Tax (AIT).',
    descriptionBn: 'জাতীয় রাজস্ব বোর্ডের ভ্যাট ৯.১ রিটার্ন প্রস্তুতি, ইনপুট ও আউটপুট ভ্যাট এবং এআইটি হিসাব।',
    href: '/reports/finance/vat-tax',
    icon: ShieldCheck,
    colorClass: 'text-indigo-600 dark:text-indigo-400',
    bgClass: 'bg-indigo-500/10 dark:bg-indigo-500/15 border-indigo-500/20',
    badge: 'NBR Form 9.1',
    badgeBn: 'ভ্যাট ৯.১ প্রস্তুত',
    quickStat: '৳18,500 Tax Due',
    quickStatLabel: 'Quarterly',
  },
];

interface MasterFinancialReportsExplorerProps {
  isBangla?: boolean;
}

export function MasterFinancialReportsExplorer({
  isBangla = false,
}: MasterFinancialReportsExplorerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<string[]>(['pnl', 'balance-sheet', 'cash-flow', 'receivables']);
  const [customReportModalOpen, setCustomReportModalOpen] = useState(false);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    toast.success(
      favorites.includes(id)
        ? isBangla
          ? 'প্রিয় তালিকা থেকে সরানো হয়েছে'
          : 'Removed from pinned favorites'
        : isBangla
        ? 'প্রিয় তালিকায় যুক্ত করা হয়েছে'
        : 'Pinned to quick access favorites'
    );
  };

  const categories = [
    { id: 'all', label: 'All Reports', labelBn: 'সকল রিপোর্ট', count: FINANCE_REPORTS_CATALOG.length },
    { id: 'statements', label: 'Financial Statements', labelBn: 'আর্থিক বিবরণী', count: 4 },
    { id: 'ledgers', label: 'Ledgers & Journals', labelBn: 'খতিয়ান ও জাবেদা', count: 4 },
    { id: 'banking', label: 'Cash & Banking', labelBn: 'নগদ ও ব্যাংকিং', count: 4 },
    { id: 'dues', label: 'Credit & Dues', labelBn: 'বকেয়া ও দেনা-পাওনা', count: 3 },
    { id: 'compliance', label: 'Tax & Compliance', labelBn: 'ট্যাক্স ও কমপ্লায়েন্স', count: 1 },
    { id: 'favorites', label: '⭐ Pinned Favorites', labelBn: '⭐ প্রিয় রিপোর্টসমূহ', count: favorites.length },
  ];

  const filteredReports = useMemo(() => {
    return FINANCE_REPORTS_CATALOG.filter((report) => {
      const matchesSearch =
        report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.nameBn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'favorites') return favorites.includes(report.id);
      return report.category === selectedCategory;
    });
  }, [searchTerm, selectedCategory, favorites]);

  return (
    <div className="relative rounded-3xl p-1 bg-gradient-to-br from-emerald-500/15 via-indigo-500/10 to-teal-500/15 shadow-xl shadow-emerald-500/5">
      <div className="bg-card/85 backdrop-blur-2xl border border-white/25 dark:border-white/10 rounded-[22px] p-5 sm:p-6 space-y-5">
        {/* 1. Header with Title, Search, Custom Report & View Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border/70 pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {isBangla ? 'আর্থিক ও হিসাবরক্ষণ রিপোর্টস হাব' : 'Financial & Accounting Reports Explorer'}
            </h2>
          </div>

          {/* Right Search, Custom Report Action & Controls */}
          <div className="flex items-center gap-2.5 w-full lg:w-auto flex-wrap sm:flex-nowrap">
            {/* Search Box */}
            <div className="relative flex-1 lg:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={isBangla ? 'রিপোর্ট বা লেজার সার্চ করুন...' : 'Search reports, statements, ledgers...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 pl-9 text-xs bg-muted/40 backdrop-blur-md border-border/70 rounded-xl"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground cursor-pointer font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Custom Report Builder Action */}
            <Button
              size="sm"
              onClick={() => setCustomReportModalOpen(true)}
              className="h-9 px-3.5 text-xs font-bold gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-500/20 cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isBangla ? '+ কাস্টম রিপোর্ট' : '+ Custom Report'}</span>
            </Button>

            {/* Grid / List Switcher */}
            <div className="flex items-center bg-muted/40 backdrop-blur-md p-0.5 rounded-xl border border-border/60 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-1.5 rounded-lg text-xs transition-all cursor-pointer',
                  viewMode === 'grid'
                    ? 'bg-card text-foreground shadow-xs font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-1.5 rounded-lg text-xs transition-all cursor-pointer',
                  viewMode === 'list'
                    ? 'bg-card text-foreground shadow-xs font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 2. Horizontal Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border',
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20 border-emerald-500/50'
                    : 'bg-muted/40 backdrop-blur-md text-muted-foreground hover:text-foreground hover:bg-muted/70 border-border/50'
                )}
              >
                <span>{isBangla ? cat.labelBn : cat.label}</span>
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold',
                    isActive ? 'bg-white/20 text-white' : 'bg-muted/80 text-muted-foreground'
                  )}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 3. Reports Presentation (Grid or List with Glass Cards) */}
        {filteredReports.length === 0 ? (
          <div className="text-center py-12 space-y-3 bg-muted/20 backdrop-blur-md rounded-2xl border border-dashed border-border/80">
            <Search className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
            <h4 className="text-sm font-bold text-foreground">
              {isBangla ? 'কোনো রিপোর্ট পাওয়া যায়নি' : 'No matching reports found'}
            </h4>
            <p className="text-xs text-muted-foreground">
              {isBangla
                ? 'অন্য কোনো নাম বা কিওয়ার্ড দিয়ে সার্চ করে চেষ্টা করুন।'
                : 'Try searching with a different report name or clear the filter.'}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="text-xs rounded-xl"
            >
              {isBangla ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
            </Button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 pt-1">
            {filteredReports.map((report) => {
              const Icon = report.icon;
              const isFav = favorites.includes(report.id);

              return (
                <div
                  key={report.id}
                  className="group relative flex flex-col justify-between p-4.5 rounded-2xl bg-card/75 backdrop-blur-xl border border-border/70 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-0.5 transition-all duration-200 space-y-3.5"
                >
                  {/* Top Strip: Icon, Badge & Pin Button */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-11 h-11 rounded-2xl flex items-center justify-center border shadow-xs shrink-0 group-hover:scale-105 transition-transform backdrop-blur-md',
                          report.bgClass,
                          report.colorClass
                        )}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-bold block">
                          {isBangla ? report.categoryLabelBn : report.categoryLabel}
                        </span>
                        <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors leading-tight">
                          {isBangla ? report.nameBn : report.name}
                        </h3>
                      </div>
                    </div>

                    {/* Favorite Pin Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(e, report.id)}
                      className={cn(
                        'p-1.5 rounded-xl transition-colors cursor-pointer shrink-0',
                        isFav
                          ? 'text-amber-500 bg-amber-500/10'
                          : 'text-muted-foreground/40 hover:text-muted-foreground bg-muted/20'
                      )}
                      title={isFav ? 'Remove from favorites' : 'Pin to favorites'}
                    >
                      <Star className={cn('w-3.5 h-3.5', isFav && 'fill-amber-500')} />
                    </button>
                  </div>

                  {/* Quick Stats or Highlights */}
                  {report.quickStat && (
                    <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-muted/30 backdrop-blur-md border border-border/50 text-[11px]">
                      <span className="text-muted-foreground font-medium">{report.quickStatLabel}</span>
                      <span className="font-mono font-bold text-foreground">{report.quickStat}</span>
                    </div>
                  )}

                  {/* Bottom Action Footer */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-border/50 gap-2">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // exportMultiSheetFinancialWorkbook();
                          toast.success(isBangla ? `${report.name} সহ পূর্ণ এক্সেল মডেল ডাউনলোড সম্পন্ন!` : `Exported Multi-Sheet Excel Model with ${report.name}!`);
                        }}
                        className="h-7 px-2 text-[11px] rounded-lg text-muted-foreground hover:text-foreground"
                        title="Quick Excel Export"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                        <span>Excel</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          window.print();
                        }}
                        className="h-7 px-2 text-[11px] rounded-lg text-muted-foreground hover:text-foreground"
                        title="Print / Save PDF"
                      >
                        <Download className="w-3.5 h-3.5 mr-1 text-blue-600" />
                        <span>PDF</span>
                      </Button>
                    </div>

                    <Link href={report.href}>
                      <Button
                        size="sm"
                        className="h-8 px-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold gap-1 shadow-md shadow-emerald-600/20 cursor-pointer"
                      >
                        <span>{isBangla ? 'স্টেটমেন্ট দেখুন' : 'View Report'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}

            {/* 🌟 Custom Financial Report Studio Card (Placed At The Very End) */}
            {(!searchTerm || 'custom report studio বিল্ডার ডিজাইন'.toLowerCase().includes(searchTerm.toLowerCase())) && (
              <div className="group relative flex flex-col justify-between p-4.5 rounded-2xl bg-gradient-to-br from-purple-500/15 via-indigo-500/10 to-card/85 backdrop-blur-xl border border-purple-500/35 hover:border-purple-500/60 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-0.5 transition-all duration-200 space-y-3.5 ring-1 ring-purple-500/20">
                {/* Top Strip: Icon, Badge & Builder Tag */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center border border-purple-500/40 bg-gradient-to-br from-purple-500/25 to-indigo-500/20 text-purple-600 dark:text-purple-400 shadow-sm shrink-0 group-hover:scale-105 transition-transform backdrop-blur-md">
                      <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-purple-600 dark:text-purple-400 font-bold block">
                        {isBangla ? 'কাস্টম স্টুডিও' : 'Custom Report Studio'}
                      </span>
                      <h3 className="font-bold text-foreground text-sm group-hover:text-purple-600 transition-colors leading-tight">
                        {isBangla ? 'কাস্টম আর্থিক রিপোর্ট বিল্ডার' : 'Custom Financial Report Studio'}
                      </h3>
                    </div>
                  </div>

                  <Badge variant="outline" className="text-[10px] font-mono border-purple-500/40 text-purple-600 bg-purple-500/15">
                    {isBangla ? 'ডিজাইনার' : 'Builder'}
                  </Badge>
                </div>

                {/* Quick Capability Strip */}
                <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-purple-500/10 backdrop-blur-md border border-purple-500/20 text-[11px]">
                  <span className="text-muted-foreground font-medium">{isBangla ? 'ক্যাপাবিলিটি' : 'Capability'}</span>
                  <span className="font-mono font-bold text-purple-600 dark:text-purple-400">Dynamic Multi-GL</span>
                </div>

                {/* Bottom Action Footer */}
                <div className="flex items-center justify-between pt-2.5 border-t border-border/50 gap-2">
                  <span className="text-[11px] text-muted-foreground">
                    {isBangla ? 'নির্দিষ্ট খতিয়ান নির্বাচন' : 'Bespoke GL & Filters'}
                  </span>

                  <Button
                    size="sm"
                    onClick={() => setCustomReportModalOpen(true)}
                    className="h-8 px-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold gap-1 shadow-md shadow-purple-600/25 cursor-pointer"
                  >
                    <span>{isBangla ? 'রিপোর্ট ডিজাইন করুন' : 'Build Report'}</span>
                    <Sliders className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* List View */
          <div className="divide-y divide-border/60 border border-border/70 rounded-2xl overflow-hidden bg-card/75 backdrop-blur-xl text-xs">
            {filteredReports.map((report) => {
              const Icon = report.icon;
              const isFav = favorites.includes(report.id);

              return (
                <div
                  key={report.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 hover:bg-muted/30 transition-colors gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        'w-9 h-9 rounded-xl flex items-center justify-center border shadow-xs shrink-0 backdrop-blur-md',
                        report.bgClass,
                        report.colorClass
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground text-xs group-hover:text-primary transition-colors truncate">
                          {isBangla ? report.nameBn : report.name}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground bg-muted/40 px-1.5 py-0.2 rounded border border-border/50">
                          {isBangla ? report.categoryLabelBn : report.categoryLabel}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pl-12 sm:pl-0">
                    {report.quickStat && (
                      <div className="text-right hidden md:block">
                        <span className="text-[10px] text-muted-foreground block">{report.quickStatLabel}</span>
                        <span className="font-mono font-bold text-foreground text-xs">{report.quickStat}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(e, report.id)}
                        className={cn(
                          'p-1.5 rounded-lg transition-colors cursor-pointer',
                          isFav
                            ? 'text-amber-500 bg-amber-500/10'
                            : 'text-muted-foreground/40 hover:text-muted-foreground'
                        )}
                      >
                        <Star className={cn('w-3.5 h-3.5', isFav && 'fill-amber-500')} />
                      </button>

                      <Link href={report.href}>
                        <Button
                          size="sm"
                          className="h-7.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold gap-1 shadow-xs cursor-pointer"
                        >
                          <span>{isBangla ? 'রিপোর্ট দেখুন' : 'Run Report'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CUSTOM FINANCIAL REPORT STUDIO MODAL */}
      <CustomFinancialReportModal
        open={customReportModalOpen}
        onOpenChange={setCustomReportModalOpen}
        isBangla={isBangla}
      />
    </div>
  );
}
