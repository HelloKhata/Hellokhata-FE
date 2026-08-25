// Hello Khata OS - Accounting & Finance Reports Unified Command Header
// হ্যালো খাতা - হিসাব ও অর্থায়ন রিপোর্টস সমন্বিত কমান্ড হেডার

'use client';

import React, { useState } from 'react';
import {
  Landmark,
  Calendar,
  Building2,
  Download,
  Printer,
  ChevronDown,
  FileSpreadsheet,
  RefreshCw,
  ArrowLeftRight,
  Check,
  Sparkles,
  Share2,
  FileText,
  Clock,
  SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface FinanceReportHeaderProps {
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  comparePeriod: string;
  onComparePeriodChange: (period: string) => void;
  selectedBranch: string;
  onBranchChange: (branchId: string) => void;
  branches: { id: string; name: string }[];
  onExport: (type: 'excel' | 'pdf' | 'print') => void;
  isBangla?: boolean;
}

export function FinanceReportHeader({
  dateRange,
  onDateRangeChange,
  comparePeriod,
  onComparePeriodChange,
  selectedBranch,
  onBranchChange,
  branches,
  onExport,
  isBangla = false,
}: FinanceReportHeaderProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success(isBangla ? 'আর্থিক তথ্য সিঙ্ক ও আপডেট হয়েছে' : 'Financial books synced with latest vouchers');
    }, 600);
  };

  // Helper label resolvers
  const getDateRangeLabel = () => {
    switch (dateRange) {
      case 'this_month':
        return isBangla ? 'চলতি মাস (Aug 2026)' : 'This Month (Aug 2026)';
      case 'last_month':
        return isBangla ? 'গত মাস (Jul 2026)' : 'Last Month (Jul 2026)';
      case 'this_quarter':
        return isBangla ? 'চলতি কোয়ার্টার (Q3)' : 'This Quarter (Q3 2026)';
      case 'this_fy':
        return isBangla ? 'অর্থবছর (FY 25–26)' : 'FY 2025–26';
      case 'last_fy':
        return isBangla ? 'পূর্ববর্তী অর্থবছর' : 'Previous FY (24–25)';
      default:
        return isBangla ? 'চলতি মাস' : 'This Month';
    }
  };

  const getCompareLabel = () => {
    switch (comparePeriod) {
      case 'prev_period':
        return isBangla ? 'পূর্ববর্তী মাস' : 'vs Prev Month';
      case 'prev_year':
        return isBangla ? 'গত বছর একই সময়' : 'vs Last Year';
      case 'none':
        return isBangla ? 'কোনো তুলনা ছাড়া' : 'No Compare';
      default:
        return 'vs Prev Period';
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
      {/* 1. Left: Branding, Page Title & Operational Purpose */}
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-emerald-500/10 to-teal-500/5 border border-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs shrink-0 ring-1 ring-emerald-500/10">
          <Landmark className="w-5 h-5" />
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {isBangla ? 'হিসাব ও অর্থায়ন রিপোর্ট' : 'Accounting & Finance reports'}
          </h1>
        </div>
      </div>

      {/* 2. Right: Unified Executive Command Bar (Connected Segments) */}
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
                <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
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
                {dateRange === 'this_month' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDateRangeChange('last_month')}
                className="text-xs rounded-xl py-2 cursor-pointer flex justify-between"
              >
                <span>{isBangla ? 'গত মাস (Jul 2026)' : 'Last Month (Jul 2026)'}</span>
                {dateRange === 'last_month' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDateRangeChange('this_quarter')}
                className="text-xs rounded-xl py-2 cursor-pointer flex justify-between"
              >
                <span>{isBangla ? 'চলতি কোয়ার্টার (Q3 2026)' : 'This Quarter (Q3 2026)'}</span>
                {dateRange === 'this_quarter' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem
                onClick={() => onDateRangeChange('this_fy')}
                className="text-xs rounded-xl py-2 cursor-pointer flex justify-between"
              >
                <span>{isBangla ? 'চলতি অর্থবছর (FY 2025–26)' : 'Fiscal Year 2025–26'}</span>
                {dateRange === 'this_fy' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDateRangeChange('last_fy')}
                className="text-xs rounded-xl py-2 cursor-pointer flex justify-between"
              >
                <span>{isBangla ? 'পূর্ববর্তী অর্থবছর (FY 2024–25)' : 'Previous FY 2024–25'}</span>
                {dateRange === 'last_fy' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* B. Comparison Benchmark Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted/50 rounded-xl transition-colors cursor-pointer"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-xs">{getCompareLabel()}</span>
                <ChevronDown className="w-3 h-3 text-muted-foreground ml-0.5 opacity-70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-52 bg-card border-border rounded-2xl shadow-xl p-1.5">
              <DropdownMenuLabel className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground px-2 py-1">
                {isBangla ? 'তুলনামূলক বেঞ্চমার্ক' : 'Comparison Benchmark'}
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => onComparePeriodChange('prev_period')}
                className="text-xs rounded-xl py-2 cursor-pointer flex justify-between"
              >
                <span>{isBangla ? 'পূর্ববর্তী মাস (MoM)' : 'vs Previous Period'}</span>
                {comparePeriod === 'prev_period' && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onComparePeriodChange('prev_year')}
                className="text-xs rounded-xl py-2 cursor-pointer flex justify-between"
              >
                <span>{isBangla ? 'গত বছর একই সময় (YoY)' : 'vs Same Period Last Year'}</span>
                {comparePeriod === 'prev_year' && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem
                onClick={() => onComparePeriodChange('none')}
                className="text-xs rounded-xl py-2 cursor-pointer flex justify-between"
              >
                <span>{isBangla ? 'কোনো তুলনা ছাড়া' : 'No Benchmark (Standalone)'}</span>
                {comparePeriod === 'none' && <Check className="w-3.5 h-3.5 text-muted-foreground" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* C. Branch Scope Dropdown */}
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

        {/* Sync / Refresh Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="h-9 w-9 p-0 rounded-2xl border-border/80 bg-card hover:bg-muted text-muted-foreground hover:text-foreground shadow-xs shrink-0"
          title="Refresh Books"
        >
          <RefreshCw className={cn('w-3.5 h-3.5', isRefreshing && 'animate-spin text-primary')} />
        </Button>

        {/* High-Impact Export Packet Trigger */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              className="h-9 px-3.5 rounded-2xl bg-foreground hover:bg-foreground/90 text-background text-xs font-bold gap-1.5 shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isBangla ? 'রিপোর্ট রপ্তানি' : 'Export Packet'}</span>
              <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-card border-border rounded-2xl shadow-xl p-1.5">
            <DropdownMenuLabel className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground px-2 py-1">
              {isBangla ? 'রপ্তানি ফরম্যাট' : 'Export Packet Options'}
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => onExport('excel')}
              className="text-xs rounded-xl py-2 cursor-pointer gap-2.5 font-medium"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <FileSpreadsheet className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="block font-bold text-foreground">{isBangla ? 'এক্সেল ফাইল' : 'Excel Workbook (.xlsx)'}</span>
                <span className="text-[10px] text-muted-foreground block">{isBangla ? 'সকল স্টেটমেন্ট ও লেজার' : 'Full financial models'}</span>
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
                <span className="block font-bold text-foreground">{isBangla ? 'পিডিএফ ডকুমেন্ট' : 'Formal PDF Packet'}</span>
                <span className="text-[10px] text-muted-foreground block">{isBangla ? 'অডিট ও ম্যানেজমেন্ট রিপোর্ট' : 'Auditor & board-ready'}</span>
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
              <span>{isBangla ? 'প্রিন্ট ভিউ (Print)' : 'Print View / Paper'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
