// Hello Khata OS - Customer Reports Unified Command Header
// হ্যালো খাতা - গ্রাহক রিপোর্টস সমন্বিত কমান্ড হেডার

'use client';

import React, { useState } from 'react';
import {
  Users,
  Calendar,
  Building2,
  Download,
  Printer,
  ChevronDown,
  FileSpreadsheet,
  RefreshCw,
  Check,
  FileText,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CustomerReportHeaderProps {
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  selectedBranch: string;
  onBranchChange: (branchId: string) => void;
  branches: { id: string; name: string }[];
  onExport: (type: 'excel' | 'pdf' | 'print') => void;
  isBangla?: boolean;
}

export function CustomerReportHeader({
  dateRange,
  onDateRangeChange,
  selectedBranch,
  onBranchChange,
  branches,
  onExport,
  isBangla = false,
}: CustomerReportHeaderProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success(isBangla ? 'গ্রাহক তথ্য ও লেজার আপডেট সম্পন্ন' : 'Customer ledgers & balances refreshed');
    }, 600);
  };

  const getDateRangeLabel = () => {
    switch (dateRange) {
      case 'this_month':
        return isBangla ? 'চলতি মাস (Aug 2026)' : 'This Month (Aug 2026)';
      case 'last_month':
        return isBangla ? 'গত মাস (Jul 2026)' : 'Last Month (Jul 2026)';
      case 'this_quarter':
        return isBangla ? 'চলতি কোয়ার্টার (Q3)' : 'This Quarter (Q3)';
      case 'this_year':
        return isBangla ? 'চলতি বছর (2026)' : 'This Year (2026)';
      default:
        return isBangla ? 'চলতি মাস' : 'This Month';
    }
  };

  const getBranchLabel = () => {
    if (selectedBranch === 'all') {
      return isBangla ? 'সকল শাখা (৪)' : 'All Branches (4)';
    }
    const found = branches.find((b) => b.id === selectedBranch);
    return found ? found.name : isBangla ? 'শাখা' : 'Branch';
  };

  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-2">
      {/* 1. Left: Branding & Subtitle */}
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500/15 via-blue-500/10 to-indigo-500/5 border border-blue-500/25 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xs shrink-0 ring-1 ring-blue-500/10">
          <Users className="w-5 h-5" />
        </div>

        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {isBangla ? 'গ্রাহক রিপোর্টস ও অ্যানালিটিক্স' : 'Customer Reports'}
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              1,284 Customers Tracked
            </span>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground font-normal mt-0.5">
            {isBangla
              ? 'গ্রাহকদের ক্রয়, বকেয়া, আনুগত্য, ক্রয় পুনরাবৃত্তি এবং পেমেন্ট আচরণ পর্যালোচনা করুন।'
              : 'Understand customer purchases, receivables, loyalty, repeat buying, and payment behavior.'}
          </p>
        </div>
      </div>

      {/* 2. Right: Unified Executive Command Bar */}
      <div className="flex flex-wrap items-center gap-2 self-start xl:self-auto">
        {/* Connected Filter Capsule */}
        <div className="inline-flex items-center rounded-2xl bg-card border border-border/80 p-1 shadow-xs divide-x divide-border/60">
          {/* A. Date Range Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted/50 rounded-xl transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="font-mono text-xs">{getDateRangeLabel()}</span>
                <ChevronDown className="w-3 h-3 text-muted-foreground ml-0.5 opacity-70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-card border-border rounded-2xl shadow-xl p-1.5">
              <DropdownMenuLabel className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground px-2 py-1">
                {isBangla ? 'সময়কাল নির্বাচন' : 'Report Period'}
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => onDateRangeChange('this_month')}
                className="text-xs rounded-xl py-2 cursor-pointer flex justify-between"
              >
                <span>{isBangla ? 'চলতি মাস (Aug 2026)' : 'This Month (Aug 2026)'}</span>
                {dateRange === 'this_month' && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDateRangeChange('last_month')}
                className="text-xs rounded-xl py-2 cursor-pointer flex justify-between"
              >
                <span>{isBangla ? 'গত মাস (Jul 2026)' : 'Last Month (Jul 2026)'}</span>
                {dateRange === 'last_month' && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDateRangeChange('this_quarter')}
                className="text-xs rounded-xl py-2 cursor-pointer flex justify-between"
              >
                <span>{isBangla ? 'চলতি কোয়ার্টার (Q3)' : 'This Quarter (Q3)'}</span>
                {dateRange === 'this_quarter' && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem
                onClick={() => onDateRangeChange('this_year')}
                className="text-xs rounded-xl py-2 cursor-pointer flex justify-between"
              >
                <span>{isBangla ? 'চলতি বছর (2026 YTD)' : 'Year to Date (2026)'}</span>
                {dateRange === 'this_year' && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* B. Branch Scope Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted/50 rounded-xl transition-colors cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-purple-500" />
                <span className="text-xs max-w-[130px] truncate">{getBranchLabel()}</span>
                <ChevronDown className="w-3 h-3 text-muted-foreground ml-0.5 opacity-70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 bg-card border-border rounded-2xl shadow-xl p-1.5">
              <DropdownMenuLabel className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground px-2 py-1">
                {isBangla ? 'শাখা ফিল্টার' : 'Branch Scope'}
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => onBranchChange('all')}
                className="text-xs rounded-xl py-2 cursor-pointer flex justify-between font-bold"
              >
                <span>{isBangla ? 'সকল শাখা (একত্রিত)' : 'All Branches (Consolidated)'}</span>
                {selectedBranch === 'all' && <Check className="w-3.5 h-3.5 text-purple-600" />}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              {branches.map((b) => (
                <DropdownMenuItem
                  key={b.id}
                  onClick={() => onBranchChange(b.id)}
                  className="text-xs rounded-xl py-2 cursor-pointer flex justify-between"
                >
                  <span className="truncate">{b.name}</span>
                  {selectedBranch === b.id && <Check className="w-3.5 h-3.5 text-purple-600" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Sync Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="h-9 w-9 p-0 rounded-2xl border-border/80 bg-card hover:bg-muted text-muted-foreground hover:text-foreground shadow-xs shrink-0"
          title="Refresh Customer Data"
        >
          <RefreshCw className={cn('w-3.5 h-3.5', isRefreshing && 'animate-spin text-blue-600')} />
        </Button>

        {/* Export Packet Trigger */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              className="h-9 px-3.5 rounded-2xl bg-foreground hover:bg-foreground/90 text-background text-xs font-bold gap-1.5 shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isBangla ? 'রিপোর্ট রপ্তানি' : 'Export Report'}</span>
              <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-card border-border rounded-2xl shadow-xl p-1.5">
            <DropdownMenuLabel className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground px-2 py-1">
              {isBangla ? 'রপ্তানি ফরম্যাট' : 'Export Options'}
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => onExport('excel')}
              className="text-xs rounded-xl py-2 cursor-pointer gap-2.5 font-medium"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <FileSpreadsheet className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="block font-bold text-foreground">{isBangla ? 'গ্রাহক এক্সেল শিট' : 'Customer Ledger (.xlsx)'}</span>
                <span className="text-[10px] text-muted-foreground block">Full sales &amp; dues workbook</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onExport('pdf')}
              className="text-xs rounded-xl py-2 cursor-pointer gap-2.5 font-medium"
            >
              <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="block font-bold text-foreground">{isBangla ? 'পিডিএফ স্টেটমেন্ট' : 'PDF Statement'}</span>
                <span className="text-[10px] text-muted-foreground block">Executive summary report</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              onClick={() => onExport('print')}
              className="text-xs rounded-xl py-2 cursor-pointer gap-2.5"
            >
              <div className="w-6 h-6 rounded-lg bg-muted text-muted-foreground flex items-center justify-center">
                <Printer className="w-3.5 h-3.5" />
              </div>
              <span>{isBangla ? 'প্রিন্ট ভিউ (Print)' : 'Print Clean View'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
