// Hello Khata OS - Quick Searchable Financial Reports Directory
// হ্যালো খাতা - আর্থিক ও হিসাবরক্ষণ রিপোর্টস ডিরেক্টরি

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  FileText,
  Scale,
  RefreshCw,
  Landmark,
  BookOpen,
  Receipt,
  PiggyBank,
  Wallet,
  ScrollText,
  ChevronRight,
  TrendingUp,
  FolderTree,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface FinancialReportsDirectoryProps {
  isBangla?: boolean;
}

interface ReportItem {
  id: string;
  name: string;
  nameBn: string;
  category: 'Statements' | 'Ledgers' | 'Banking' | 'Compliance';
  description: string;
  descriptionBn: string;
  href: string;
  icon: React.ElementType;
}

const ALL_REPORTS: ReportItem[] = [
  {
    id: 'pnl',
    name: 'Profit & Loss Statement',
    nameBn: 'লাভ-ক্ষতি বিবরণী (P&L)',
    category: 'Statements',
    description: 'Comprehensive income, direct costs, gross and net operational margins.',
    descriptionBn: 'মোট আয়, প্রত্যক্ষ ব্যয় এবং পরিচালন নিট মুনাফার পূর্ণাঙ্গ চিত্র।',
    href: '/finance/reports/profit-loss',
    icon: TrendingUp,
  },
  {
    id: 'balance-sheet',
    name: 'Balance Sheet',
    nameBn: 'উদ্বৃত্তপত্র / ব্যালেন্স শিট',
    category: 'Statements',
    description: 'Snapshot of enterprise assets, liabilities, and owners equity.',
    descriptionBn: 'ব্যবসায়ের মোট সম্পদ, দায় এবং মালিকানাস্বত্বের সারসংক্ষেপ।',
    href: '/finance/reports/balance-sheet',
    icon: Scale,
  },
  {
    id: 'cash-flow',
    name: 'Cash Flow Statement',
    nameBn: 'নগদ প্রবাহ বিবরণী',
    category: 'Statements',
    description: 'Operating, investing, and financing cash inflows and outflows.',
    descriptionBn: 'পরিচালন ও বিনিয়োগজনিত নগদ আগমন ও বহির্গমন রিপোর্ট।',
    href: '/finance/reports/cash-flow',
    icon: RefreshCw,
  },
  {
    id: 'trial-balance',
    name: 'Trial Balance',
    nameBn: 'রেওয়ামিল (Trial Balance)',
    category: 'Statements',
    description: 'Debit and credit balance reconciliation across all accounts.',
    descriptionBn: 'সকল হিসাবের ডেবিট ও ক্রেডিট উদ্বৃত্তের নির্ভুল যাচাইকরণ।',
    href: '/finance/reports/trial-balance',
    icon: BookOpen,
  },
  {
    id: 'general-ledger',
    name: 'General Ledger',
    nameBn: 'খতিয়ান বই (General Ledger)',
    category: 'Ledgers',
    description: 'Chronological summary of transactions per nominal ledger account.',
    descriptionBn: 'প্রতিটি অ্যাকাউন্টের বিস্তারিত লেনদেনের হিসাব বিবরণী।',
    href: '/reports/finance/general-ledger',
    icon: FileText,
  },
  {
    id: 'account-statement',
    name: 'Account Statement',
    nameBn: 'হিসাব বিবরণী (Account Statement)',
    category: 'Ledgers',
    description: 'Running balance and transaction history for specific financial accounts.',
    descriptionBn: 'নির্দিষ্ট আর্থিক হিসাবের লেনদেন ও চলমান উদ্বৃত্তের ইতিহাস।',
    href: '/finance/reports/account-statement',
    icon: ScrollText,
  },
  {
    id: 'cash-book',
    name: 'Cash Book',
    nameBn: 'নগদান বই (Cash Book)',
    category: 'Banking',
    description: 'Daily cash collections, petty cash disbursements, and physical balance.',
    descriptionBn: 'দৈনিক নগদ প্রাপ্তি, খুচরা খরচ এবং নগদ উদ্বৃত্তের খাতা।',
    href: '/reports/finance/cash-book',
    icon: Wallet,
  },
  {
    id: 'bank-book',
    name: 'Bank Book',
    nameBn: 'ব্যাংক হিসাব বই (Bank Book)',
    category: 'Banking',
    description: 'Bank account deposits, withdrawals, cheques, and reconciliation.',
    descriptionBn: 'ব্যাংক জমা, উত্তোলন, চেক ক্লিয়ারিং এবং ব্যাংক সমন্বয়।',
    href: '/reports/finance/bank-book',
    icon: Landmark,
  },
  {
    id: 'journal-report',
    name: 'Journal Book',
    nameBn: 'জাবেদা বই (Journal Report)',
    category: 'Ledgers',
    description: 'Original double-entry journal vouchers with debit/credit entries.',
    descriptionBn: 'দ্বৈত দাখিলা পদ্ধতির মূল জাবেদা ভাউচারসমূহের তালিকা।',
    href: '/reports/finance/journal-report',
    icon: Receipt,
  },
  {
    id: 'chart-of-accounts',
    name: 'Chart of Accounts',
    nameBn: 'হিসাবের তালিকা (COA)',
    category: 'Ledgers',
    description: 'Master structure of Assets, Liabilities, Equity, Revenue, and Expenses.',
    descriptionBn: 'ব্যবসায়ের সকল লেজার এবং হিসাবের শ্রেণীবদ্ধ মাস্টার কাঠামো।',
    href: '/reports/finance/chart-of-accounts',
    icon: FolderTree,
  },
];

export function FinancialReportsDirectory({
  isBangla = false,
}: FinancialReportsDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredReports = ALL_REPORTS.filter((report) => {
    const matchesSearch =
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.nameBn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || report.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div>
          <h3 className="text-sm font-bold text-foreground">
            {isBangla ? 'আর্থিক ও হিসাবরক্ষণ রিপোর্ট ডিরেক্টরি' : 'Financial & Accounting Reports'}
          </h3>
          <p className="text-[11px] text-muted-foreground">
            {isBangla ? 'আইনগত ও পরিচালন সংক্রান্ত সকল রিপোর্টের সরাসরি প্রবেশদ্বার' : 'Direct access to statutory and operational accounting statements'}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={isBangla ? 'রিপোর্ট সার্চ করুন...' : 'Search reports...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8 pl-8 text-xs bg-muted/20 border-border rounded-xl"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {['All', 'Statements', 'Ledgers', 'Banking'].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              'px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap',
              selectedCategory === cat
                ? 'bg-foreground text-background font-bold shadow-xs'
                : 'bg-muted/30 text-muted-foreground hover:text-foreground border border-border/50'
            )}
          >
            {isBangla
              ? cat === 'All'
                ? 'সকল রিপোর্ট'
                : cat === 'Statements'
                ? 'আর্থিক বিবরণী'
                : cat === 'Ledgers'
                ? 'লেজার ও খতিয়ান'
                : 'ব্যাংকিং ও নগদ'
              : cat}
          </button>
        ))}
      </div>

      {/* Reports Compact Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
        {filteredReports.map((r) => {
          const Icon = r.icon;
          return (
            <Link
              key={r.id}
              href={r.href}
              className="flex items-center justify-between p-3 rounded-xl bg-muted/15 hover:bg-muted/40 border border-border/60 hover:border-border transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors shrink-0 shadow-2xs">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground text-xs group-hover:text-primary transition-colors truncate">
                      {isBangla ? r.nameBn : r.name}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-muted-foreground line-clamp-1">
                    {isBangla ? r.descriptionBn : r.description}
                  </p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
