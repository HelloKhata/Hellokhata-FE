'use client';

import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Info,
  ShieldAlert,
  Download,
  Printer,
  Coins,
  Receipt,
  ShoppingCart,
  Truck,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface PreliminaryPnLTabProps {
  salesSummary: any;
  purchaseSummary: any;
  expenseSummary: any;
  isLoading: boolean;
  onPrint: () => void;
}

export function PreliminaryPnLTab({
  salesSummary,
  purchaseSummary,
  expenseSummary,
  isLoading,
  onPrint,
}: PreliminaryPnLTabProps) {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();

  // Revenue (Sales)
  const grossSales = Number(salesSummary?.totalGrandTotal || 0);
  const totalSalesDiscount = Number(salesSummary?.totalDiscount || 0);
  const netRevenue = Math.max(0, grossSales - totalSalesDiscount);

  // Period Purchases (Stock acquisitions)
  const totalPurchases = Number(purchaseSummary?.totalGrandTotal || 0);

  // Operating Expenses
  const operatingExpenses = Number(expenseSummary?.thisMonth?.total ?? expenseSummary?.allTime?.total ?? 0);

  // Preliminary Operational Surplus (Revenue minus Operating Expenses)
  const operationalSurplus = netRevenue - operatingExpenses;

  return (
    <div className="space-y-6">
      {/* 1. Preliminary Statement Banner (Compliance & Transparency) */}
      <div className="rounded-2xl p-5 bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 space-y-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
          <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400">
            {isBangla ? 'প্রাথমিক পরিচালন সারসংক্ষেপ (Preliminary Operational Statement)' : 'Preliminary Operational Statement (Not a Statutory P&L)'}
          </h3>
        </div>
        <p className="text-xs leading-relaxed text-amber-800/90 dark:text-amber-300/90">
          {isBangla
            ? 'এই প্রতিবেদনটি সফটওয়্যারে রেকর্ডকৃত বিক্রয় রাজস্ব, পণ্য ক্রয় এবং পরিচালন খরচের প্রাথমিক সারসংক্ষেপ উপস্থাপন করে। বাংলাদেশ হিসাববিজ্ঞান মানদণ্ড (BAS/SME) অনুযায়ী পূর্ণাঙ্গ নিট মুনাফা নির্ধারণে বিক্রিত পণ্যের প্রকৃত ব্যয় (COGS = প্রারম্ভিক স্টক + মোট ক্রয় - সমাপনী স্টক) এবং অবচয় সমন্বয় প্রযোজ্য, যা ইনভেন্টরি স্টক অডিট চূড়ান্ত হলে হালনাগাদ হবে।'
            : 'This report presents a preliminary operational overview based on recorded sales, inventory purchases, and operating expenditures. Under standard SME accounting (BAS/IAS 2), full statutory Profit & Loss requires Cost of Goods Sold (COGS = Opening Stock + Purchases - Closing Stock) and depreciation adjustments, which are recorded upon physical inventory stock reconciliation.'}
        </p>
      </div>

      {/* 2. Preliminary P&L Statement Card */}
      <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-border/60 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">
              {isBangla ? 'পরিচালন আয়-ব্যয় বিবরণী' : 'Operating Income & Expense Statement'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isBangla ? 'নির্বাচিত সময়কালের পরিচালন তথ্য' : 'Recorded operational activity for the selected period'}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onPrint}
            className="h-8 px-3 rounded-xl text-xs gap-1.5 border-border/60"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isBangla ? 'প্রিন্ট করুন' : 'Print Statement'}</span>
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* SECTION 1: OPERATING REVENUE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-500 uppercase tracking-wider pb-1 border-b border-emerald-500/20">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                {isBangla ? '১. পরিচালন রাজস্ব (Operating Revenue)' : '1. Operating Revenue'}
              </span>
              <span>{formatCurrency(netRevenue)}</span>
            </div>

            <div className="space-y-2 pl-4 text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>{isBangla ? 'মোট পণ্য ও সেবা বিক্রয় (Gross Sales)' : 'Gross Sales & Invoiced Orders'}</span>
                <span className="font-medium text-foreground">{formatCurrency(grossSales)}</span>
              </div>
              {totalSalesDiscount > 0 && (
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>{isBangla ? 'বাদ: বিক্রয় বাট্টা ও ছাড় (Discounts)' : 'Less: Sales Discounts'}</span>
                  <span className="font-medium text-rose-500">-{formatCurrency(totalSalesDiscount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between font-semibold pt-1 text-foreground border-t border-border/40">
                <span>{isBangla ? 'নিট বিক্রয় রাজস্ব (Net Sales)' : 'Net Operating Sales'}</span>
                <span className="text-emerald-500 font-bold">{formatCurrency(netRevenue)}</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: PURCHASES & STOCK INFLOW */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-blue-500 uppercase tracking-wider pb-1 border-b border-blue-500/20">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4" />
                {isBangla ? '২. চলতি সময়ে পণ্য ক্রয় (Period Inventory Purchases)' : '2. Period Purchases (Inventory Additions)'}
              </span>
              <span>{formatCurrency(totalPurchases)}</span>
            </div>

            <div className="space-y-2 pl-4 text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>{isBangla ? 'সরবরাহকারীদের কাছ থেকে মোট ক্রয় (Total Purchases)' : 'Supplier Invoiced Purchases'}</span>
                <span className="font-medium text-foreground">{formatCurrency(totalPurchases)}</span>
              </div>
              <p className="text-[11px] text-muted-foreground italic">
                {isBangla
                  ? '* দ্রষ্টব্য: পণ্য ক্রয় সরাসরি খরচ নয়, এটি ইনভেন্টরি সম্পদে যুক্ত হয়। পণ্য বিক্রি হলেই তা বিক্রীত পণ্যের ব্যয় (COGS) হিসেবে গণ্য হয়।'
                  : '* Note: Inventory purchases are capital asset inflows and are transformed into COGS upon sale through closing stock reconciliation.'}
              </p>
            </div>
          </div>

          {/* SECTION 3: OPERATING EXPENSES */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-rose-500 uppercase tracking-wider pb-1 border-b border-rose-500/20">
              <span className="flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4" />
                {isBangla ? '৩. পরিচালন ব্যয়সমূহ (Operating Expenses)' : '3. Operating Expenses'}
              </span>
              <span>{formatCurrency(operatingExpenses)}</span>
            </div>

            <div className="space-y-2 pl-4 text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>{isBangla ? 'রেকর্ডকৃত সাধারণ ও প্রশাসনিক খরচ' : 'General & Administrative Overheads'}</span>
                <span className="font-medium text-foreground">{formatCurrency(operatingExpenses)}</span>
              </div>
              {expenseSummary?.topCategories && expenseSummary.topCategories.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {expenseSummary.topCategories.slice(0, 4).map((c: any, i: number) => (
                    <div key={i} className="p-2 rounded-xl bg-muted/30 flex justify-between text-[11px]">
                      <span className="text-muted-foreground">{isBangla ? (c.nameBn || c.name) : c.name}</span>
                      <span className="font-semibold">{formatCurrency(c.amount || 0)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SUMMARY ROW: PRELIMINARY OPERATIONAL SURPLUS */}
          <div className="pt-4 border-t-2 border-border/70">
            <div className="rounded-2xl p-5 bg-gradient-to-r from-card to-muted/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {isBangla ? 'প্রাথমিক পরিচালন উদ্বৃত্ত (Operational Surplus)' : 'Preliminary Operating Surplus'}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {isBangla ? 'নিট রাজস্ব বিয়োগ রেকর্ডকৃত পরিচালন খরচ' : 'Net Revenue less recorded operating overheads'}
                </div>
              </div>
              <div className="text-2xl font-black">
                <span className={operationalSurplus >= 0 ? "text-emerald-500" : "text-amber-500"}>
                  {operationalSurplus >= 0 ? '+' : ''}{formatCurrency(operationalSurplus)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Equity & Transfer Guidelines Notice */}
      <div className="rounded-2xl p-4 bg-card/60 backdrop-blur-xl border border-white/10 dark:border-white/5 text-xs text-muted-foreground space-y-1.5">
        <div className="font-semibold text-foreground flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-teal-500" />
          <span>{isBangla ? 'মালিকানা স্বত্ব ও আর্থিক নীতি' : 'Owner Equity & Transfer Guidance'}</span>
        </div>
        <ul className="list-disc pl-5 space-y-1 text-[11px]">
          <li>
            {isBangla
              ? 'মালিকের মূলধন বিনিয়োগ (Capital Contribution) ইকুইটি/মূলধন বৃদ্ধি, এটি কোনো পরিচালন বিক্রয় রাজস্ব নয়।'
              : 'Owner capital investments represent owner equity additions and must not be booked as operational revenue.'}
          </li>
          <li>
            {isBangla
              ? 'মালিকের ব্যক্তিগত উত্তোলন (Owner Drawings) মূলধন হ্রাস, এটি নিয়মিত ব্যবসায়িক পরিচালন ব্যয় হিসেবে অন্তর্ভুক্ত করা যাবে না।'
              : 'Owner personal withdrawals represent equity reductions and must not be recorded as business operating expenses.'}
          </li>
          <li>
            {isBangla
              ? 'ব্যাংক ও ক্যাশের মধ্যকার স্থানান্তর কোনো লাভ বা ক্ষতি সৃষ্টি করে না।'
              : 'Internal bank and cash contra transfers do not create profit or loss.'}
          </li>
        </ul>
      </div>
    </div>
  );
}
