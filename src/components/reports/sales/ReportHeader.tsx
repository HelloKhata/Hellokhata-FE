// Hello Khata OS - 01. Compact Report Header (Vibrant & Colorful)
// হ্যালো খাতা - কমপ্যাক্ট রিপোর্ট হেডার (রঙিন ও আধুনিক)

'use client';

import React, { useState } from 'react';
import { useSalesFocus } from './SalesFocusContext';
import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Calendar,
  Building2,
  Filter,
  Download,
  Printer,
  FileSpreadsheet,
  X,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  BarChart3,
  Package,
  Layers,
  Users,
  UserCheck,
  CreditCard,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReportPeriod, DriverDimension } from '@/types/sales-report';

interface ReportHeaderProps {
  onExportCsv?: () => void;
  onPrintReport?: () => void;
}

export function ReportHeader({ onExportCsv, onPrintReport }: ReportHeaderProps) {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const {
    period,
    setPeriod,
    dateRangeLabel,
    branchId,
    setBranchId,
    compareWithPrevious,
    setCompareWithPrevious,
    focus,
    clearFocus,
    activeFiltersCount,
    advancedFilters,
    setAdvancedFilters,
    clearAdvancedFilters,
    isSingleBranchBusiness,
    activeDimension,
    setActiveDimension,
  } = useSalesFocus();

  const [isInlineFilterOpen, setIsInlineFilterOpen] = useState(false);

  const periods: { value: ReportPeriod; labelEn: string; labelBn: string }[] = [
    { value: 'today', labelEn: 'Today', labelBn: 'আজ' },
    { value: 'yesterday', labelEn: 'Yesterday', labelBn: 'গতকাল' },
    { value: 'last_7_days', labelEn: 'Last 7 Days', labelBn: 'গত ৭ দিন' },
    { value: 'this_month', labelEn: 'This Month (May 2026)', labelBn: 'চলতি মাস (মে ২০২৬)' },
    { value: 'last_month', labelEn: 'Last Month (April 2026)', labelBn: 'গত মাস (এপ্রিল ২০২৬)' },
    { value: 'this_quarter', labelEn: 'This Quarter (Q2 2026)', labelBn: 'চলতি কোয়ার্টার' },
  ];

  const branches = [
    { id: 'all', nameEn: 'All Branches', nameBn: 'সকল শাখা' },
    { id: 'br-dhaka', nameEn: 'Dhaka Main Branch', nameBn: 'ঢাকা প্রধান শাখা' },
    { id: 'br-ctg', nameEn: 'Chattogram Branch', nameBn: 'চট্টগ্রাম শাখা' },
    { id: 'br-syl', nameEn: 'Sylhet Branch', nameBn: 'সিলেট শাখা' },
    { id: 'br-raj', nameEn: 'Rajshahi Branch', nameBn: 'রাজশাহী শাখা' },
  ];

  const currentBranch = branches.find((b) => b.id === branchId) || branches[0];

  return (
    <div className="space-y-3">
      {/* Primary Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Title and Scope context */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Report Title */}
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground font-sans">
            {isBangla ? 'বিক্রয় রিপোর্ট' : 'Sales Report'}
          </h1>

          <div className="hidden sm:block h-4 w-[1px] bg-border/80" />

          {/* Date Range Selector Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs sm:text-sm font-semibold text-foreground bg-card/80 border-border/70 hover:bg-muted/70 gap-1.5 rounded-full shadow-2xs"
              >
                <Calendar className="h-3.5 w-3.5 text-primary" />
                <span>{dateRangeLabel}</span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 p-1.5 shadow-xl rounded-2xl">
              <DropdownMenuLabel className="text-xs font-bold text-muted-foreground px-2 py-1">
                {isBangla ? 'সময়সীমা নির্বাচন' : 'Date Range Scope'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {periods.map((p) => (
                <DropdownMenuItem
                  key={p.value}
                  onClick={() => setPeriod(p.value)}
                  className={`text-xs sm:text-sm cursor-pointer py-1.5 px-2 rounded-xl ${
                    period === p.value ? 'bg-primary/10 text-primary font-bold' : ''
                  }`}
                >
                  {isBangla ? p.labelBn : p.labelEn}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Branch Selector */}
          {!isSingleBranchBusiness && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs sm:text-sm font-semibold text-foreground bg-card/80 border-border/70 hover:bg-muted/70 gap-1.5 rounded-full shadow-2xs"
                >
                  <Building2 className="h-3.5 w-3.5 text-teal-500" />
                  <span>{isBangla ? currentBranch.nameBn : currentBranch.nameEn}</span>
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52 p-1.5 shadow-xl rounded-2xl">
                <DropdownMenuLabel className="text-xs font-bold text-muted-foreground px-2 py-1">
                  {isBangla ? 'শাখা ফিল্টার' : 'Branch Scope'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {branches.map((b) => (
                  <DropdownMenuItem
                    key={b.id}
                    onClick={() => setBranchId(b.id)}
                    className={`text-xs sm:text-sm cursor-pointer py-1.5 px-2 rounded-xl ${
                      branchId === b.id ? 'bg-primary/10 text-primary font-bold' : ''
                    }`}
                  >
                    {isBangla ? b.nameBn : b.nameEn}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Action Controls: Compare, Filter, Export */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {/* Compare Toggle Pill */}
          <Button
            variant={compareWithPrevious ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setCompareWithPrevious(!compareWithPrevious)}
            className={`h-8 px-3 text-xs font-bold rounded-full transition-all ${
              compareWithPrevious
                ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 shadow-xs'
                : 'text-muted-foreground hover:text-foreground border-border/70'
            }`}
            title="Toggle period comparison"
          >
            <TrendingUp className="h-3.5 w-3.5 mr-1.5 text-emerald-500" />
            <span className="hidden md:inline">{isBangla ? 'পূর্ববর্তী তুলনা' : 'vs Previous'}</span>
            <span className="md:hidden">{isBangla ? 'তুলনা' : 'Compare'}</span>
          </Button>

          {/* Inline Filter Toggle Button */}
          <Button
            variant={activeFiltersCount > 0 || isInlineFilterOpen ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsInlineFilterOpen(!isInlineFilterOpen)}
            className={`h-8 px-3 text-xs font-bold gap-1.5 rounded-full transition-all cursor-pointer ${
              activeFiltersCount > 0
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                : isInlineFilterOpen
                ? 'bg-muted text-foreground border-indigo-500/40'
                : 'border-border/70 bg-card/80'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-400" />
            <span>{isBangla ? 'ফিল্টার' : 'Filters'}</span>
            {activeFiltersCount > 0 && (
              <span className="ml-0.5 rounded-full bg-white/25 text-white px-1.5 py-0.2 text-[10px] font-extrabold">
                {activeFiltersCount}
              </span>
            )}
            {isInlineFilterOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>

          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs font-bold gap-1.5 border-border/70 bg-card/80 rounded-full hover:bg-muted/70 shadow-2xs cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 text-teal-500" />
                <span>{isBangla ? 'এক্সপোর্ট' : 'Export'}</span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 p-1.5 shadow-2xl rounded-2xl">
              <DropdownMenuItem
                onClick={onPrintReport}
                className="text-xs sm:text-sm cursor-pointer py-2 px-2.5 rounded-xl gap-2 font-semibold"
              >
                <Printer className="h-4 w-4 text-primary" />
                <span>{isBangla ? 'প্রিন্ট / PDF ভিউ' : 'Print / PDF Report'}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onExportCsv}
                className="text-xs sm:text-sm cursor-pointer py-2 px-2.5 rounded-xl gap-2 font-semibold"
              >
                <FileSpreadsheet className="h-4 w-4 text-teal-500" />
                <span>{isBangla ? 'CSV এক্সপোর্ট' : 'Export as CSV'}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Inline Collapsible Filter Toolbar */}
      <AnimatePresence>
        {isInlineFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-gradient-to-r from-card via-card to-indigo-500/[0.05] border border-indigo-500/30 rounded-2xl shadow-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {/* Payment Method */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                  {isBangla ? 'পেমেন্ট মাধ্যম' : 'Payment Method'}
                </label>
                <Select
                  value={advancedFilters.paymentMethod || 'all'}
                  onValueChange={(val) =>
                    setAdvancedFilters((prev) => ({
                      ...prev,
                      paymentMethod: val === 'all' ? undefined : val,
                    }))
                  }
                >
                  <SelectTrigger className="h-8 text-xs bg-background/90 rounded-xl">
                    <SelectValue placeholder={isBangla ? 'সকল মাধ্যম' : 'All Methods'} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">{isBangla ? 'সকল মাধ্যম' : 'All Methods'}</SelectItem>
                    <SelectItem value="Cash">Cash (নগদ ক্যাশ)</SelectItem>
                    <SelectItem value="bKash">bKash (বিকাশ)</SelectItem>
                    <SelectItem value="Nagad">Nagad (নগদ)</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer (ব্যাংক)</SelectItem>
                    <SelectItem value="Credit">Credit (বকেয়া)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                  {isBangla ? 'পেমেন্ট স্ট্যাটাস' : 'Payment Status'}
                </label>
                <Select
                  value={advancedFilters.status || 'all'}
                  onValueChange={(val) =>
                    setAdvancedFilters((prev) => ({
                      ...prev,
                      status: val === 'all' ? undefined : (val as 'paid' | 'partial' | 'due'),
                    }))
                  }
                >
                  <SelectTrigger className="h-8 text-xs bg-background/90 rounded-xl">
                    <SelectValue placeholder={isBangla ? 'সকল স্ট্যাটাস' : 'All Status'} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">{isBangla ? 'সকল স্ট্যাটাস' : 'All Status'}</SelectItem>
                    <SelectItem value="paid">{isBangla ? 'পরিশোধিত (Paid)' : 'Paid'}</SelectItem>
                    <SelectItem value="partial">{isBangla ? 'আংশিক (Partial)' : 'Partial'}</SelectItem>
                    <SelectItem value="due">{isBangla ? 'বকেয়া (Due)' : 'Due'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Salesperson */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                  {isBangla ? 'বিক্রয়কর্মী' : 'Salesperson'}
                </label>
                <Select
                  value={advancedFilters.salesperson || 'all'}
                  onValueChange={(val) =>
                    setAdvancedFilters((prev) => ({
                      ...prev,
                      salesperson: val === 'all' ? undefined : val,
                    }))
                  }
                >
                  <SelectTrigger className="h-8 text-xs bg-background/90 rounded-xl">
                    <SelectValue placeholder={isBangla ? 'সকল বিক্রয়কর্মী' : 'All Salespeople'} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">{isBangla ? 'সকল বিক্রয়কর্মী' : 'All Salespeople'}</SelectItem>
                    <SelectItem value="Rahim Ahmed">Rahim Ahmed</SelectItem>
                    <SelectItem value="Karim Ullah">Karim Ullah</SelectItem>
                    <SelectItem value="Tanvir Hasan">Tanvir Hasan</SelectItem>
                    <SelectItem value="Farhana Akter">Farhana Akter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reset Action */}
              <div className="flex items-end justify-between gap-2">
                <div className="flex-1">
                  <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                    {isBangla ? 'সর্বোচ্চ পরিমাণ (৳)' : 'Max Amount (৳)'}
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g. 20000"
                    value={advancedFilters.maxAmount || ''}
                    onChange={(e) =>
                      setAdvancedFilters((prev) => ({
                        ...prev,
                        maxAmount: e.target.value ? Number(e.target.value) : undefined,
                      }))
                    }
                    className="h-8 text-xs bg-background/90 rounded-xl"
                  />
                </div>

                {activeFiltersCount > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearAdvancedFilters}
                    className="h-8 px-3 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 gap-1 rounded-xl shrink-0 font-bold"
                    title={isBangla ? 'ফিল্টার মুছুন' : 'Reset filters'}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>{isBangla ? 'রিসেট' : 'Reset'}</span>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Signature Sales Focus Context Banner with Radiant Gradient Glow */}
      <AnimatePresence>
        {focus && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-2 pt-0.5"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-indigo-500/15 border border-emerald-500/40 text-foreground rounded-full px-3.5 py-1.5 text-xs font-semibold shadow-md shadow-emerald-500/10">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
              <span className="flex items-center gap-1.5 flex-wrap">
                <span className="capitalize font-bold text-emerald-600 dark:text-emerald-400">
                  {focus.type === 'product'
                    ? isBangla
                      ? 'পণ্য:'
                      : 'Product:'
                    : focus.type === 'category'
                    ? isBangla
                      ? 'ক্যাটাগরি:'
                      : 'Category:'
                    : focus.type === 'customer'
                    ? isBangla
                      ? 'গ্রাহক:'
                      : 'Customer:'
                    : focus.type === 'salesperson'
                    ? isBangla
                      ? 'বিক্রয়কর্মী:'
                      : 'Staff:'
                    : focus.type === 'payment'
                    ? isBangla
                      ? 'পেমেন্ট:'
                      : 'Payment:'
                    : isBangla
                    ? 'শাখা:'
                    : 'Branch:'}
                </span>
                <span className="font-extrabold text-foreground">
                  {isBangla && focus.nameBn ? focus.nameBn : focus.name}
                </span>
                <span className="text-muted-foreground font-normal">•</span>
                <span className="font-black text-primary">{formatCurrency(focus.amount)}</span>
                <span className="text-muted-foreground font-medium">
                  ({focus.sharePercentage}% {isBangla ? 'মোট বিক্রয়ের' : 'of total'})
                </span>
              </span>

              <button
                type="button"
                onClick={clearFocus}
                className="hover:bg-rose-500/20 hover:text-rose-500 rounded-full p-1 ml-1 transition-colors text-muted-foreground cursor-pointer"
                title={isBangla ? 'ফোকাস মুছুন' : 'Clear focus'}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">
              {isBangla ? 'পুরো রিপোর্টটি নির্বাচিত আইটেমে ফিল্টার করা হয়েছে' : 'Entire report filtered to this entity'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
