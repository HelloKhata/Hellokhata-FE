// Hello Khata OS - Financial Health Summary (Premium Glass Color Edition)
// হ্যালো খাতা - আর্থিক স্বাস্থ্য সারসংক্ষেপ (প্রিমিয়াম গ্লাস কালার সংস্করণ)

'use client';

import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Users,
  Building2,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Landmark,
  PiggyBank,
  Receipt,
  Scale,
} from 'lucide-react';
import { useCurrency } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import type { FinancialHealthMetrics } from './types';

interface FinancialHealthSummaryProps {
  metrics: FinancialHealthMetrics;
  isBangla?: boolean;
}

export function FinancialHealthSummary({
  metrics,
  isBangla = false,
}: FinancialHealthSummaryProps) {
  const { formatCurrency } = useCurrency();

  return (
    <div className="relative rounded-3xl p-1 bg-gradient-to-r from-emerald-500/20 via-indigo-500/20 to-purple-500/20 shadow-xl shadow-emerald-500/5">
      <div className="bg-card/80 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[22px] p-4 sm:p-5">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* 1. Net Profit (Emerald Glow Glass) */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-transparent border border-emerald-500/25 p-3.5 sm:p-4 backdrop-blur-md shadow-xs transition-all hover:scale-[1.02] hover:shadow-md hover:border-emerald-500/40">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium mb-1">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                {isBangla ? 'নিট মুনাফা' : 'Net Profit'}
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
                {metrics.netMargin}%
              </span>
            </div>

            <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
              {formatCurrency(metrics.netProfit)}
            </div>

            <div className="flex items-center gap-1 text-[11px] mt-1">
              <span
                className={cn(
                  'inline-flex items-center font-bold font-mono',
                  metrics.netProfitChange >= 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                )}
              >
                {metrics.netProfitChange >= 0 ? (
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 mr-0.5" />
                )}
                {Math.abs(metrics.netProfitChange)}%
              </span>
              <span className="text-muted-foreground text-[10px]">
                {isBangla ? 'গত মাস' : 'vs last period'}
              </span>
            </div>
          </div>

          {/* 2. Total Revenue (Indigo Glow Glass) */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500/15 via-indigo-500/5 to-transparent border border-indigo-500/25 p-3.5 sm:p-4 backdrop-blur-md shadow-xs transition-all hover:scale-[1.02] hover:shadow-md hover:border-indigo-500/40">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium mb-1">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-indigo-500" />
                {isBangla ? 'মোট আয়' : 'Revenue'}
              </span>
              <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/15 border border-indigo-500/30 px-1.5 py-0.5 rounded-full">
                +{metrics.revenueChange}%
              </span>
            </div>

            <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-indigo-600 dark:text-indigo-400">
              {formatCurrency(metrics.revenue)}
            </div>

            <div className="flex items-center gap-1 text-[11px] mt-1 text-muted-foreground">
              <span className="text-[10px]">{isBangla ? 'মোট বিক্রয় ও সেবা আয়' : 'Gross collections'}</span>
            </div>
          </div>

          {/* 3. Total Expenses (Amber Glow Glass) */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/25 p-3.5 sm:p-4 backdrop-blur-md shadow-xs transition-all hover:scale-[1.02] hover:shadow-md hover:border-amber-500/40">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium mb-1">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-amber-500" />
                {isBangla ? 'মোট ব্যয়' : 'Expenses'}
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 rounded-full">
                +{metrics.expensesChange}%
              </span>
            </div>

            <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-amber-600 dark:text-amber-400">
              {formatCurrency(metrics.expenses)}
            </div>

            <div className="flex items-center gap-1 text-[11px] mt-1 text-muted-foreground">
              <span className="text-[10px]">{isBangla ? 'সিওজিএস ও ওভারহেড' : 'COGS + OPEX'}</span>
            </div>
          </div>

          {/* 4. Cash in Hand (Teal / Cyan Glow Glass) */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500/15 via-teal-500/5 to-transparent border border-teal-500/25 p-3.5 sm:p-4 backdrop-blur-md shadow-xs transition-all hover:scale-[1.02] hover:shadow-md hover:border-teal-500/40">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium mb-1">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-teal-500" />
                {isBangla ? 'নগদ ও ব্যাংক' : 'Cash & Bank'}
              </span>
              <span className="text-[10px] font-mono font-bold text-teal-600 dark:text-teal-400 bg-teal-500/15 border border-teal-500/30 px-1.5 py-0.5 rounded-full">
                Live
              </span>
            </div>

            <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-teal-600 dark:text-teal-400">
              {formatCurrency(metrics.cashAndBank)}
            </div>

            <div className="flex items-center gap-1 text-[11px] mt-1 text-muted-foreground">
              <span className="text-[10px]">{isBangla ? 'মোট তারল্য অবস্থান' : 'Liquid reserves'}</span>
            </div>
          </div>

          {/* 5. Accounts Receivable (Purple Glow Glass) */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/15 via-purple-500/5 to-transparent border border-purple-500/25 p-3.5 sm:p-4 backdrop-blur-md shadow-xs transition-all hover:scale-[1.02] hover:shadow-md hover:border-purple-500/40">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium mb-1">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-purple-500" />
                {isBangla ? 'গ্রাহক বাকি' : 'Receivables'}
              </span>
              <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-500/15 border border-purple-500/30 px-1.5 py-0.5 rounded-full">
                {isBangla ? 'বকেয়া' : 'Active Dues'}
              </span>
            </div>

            <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-purple-600 dark:text-purple-400">
              {formatCurrency(metrics.receivables)}
            </div>

            <div className="flex items-center gap-1 text-[11px] mt-1 text-muted-foreground">
              <span className="text-[10px]">{isBangla ? 'আদায়যোগ্য মোট বকেয়া' : 'Customer dues'}</span>
            </div>
          </div>

          {/* 6. Accounts Payable (Rose Glow Glass) */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500/15 via-rose-500/5 to-transparent border border-rose-500/25 p-3.5 sm:p-4 backdrop-blur-md shadow-xs transition-all hover:scale-[1.02] hover:shadow-md hover:border-rose-500/40">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium mb-1">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-rose-500" />
                {isBangla ? 'সাপ্লায়ার দেনা' : 'Payables'}
              </span>
              <span className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-500/15 border border-rose-500/30 px-1.5 py-0.5 rounded-full">
                {isBangla ? 'প্রদেয়' : 'Maturing'}
              </span>
            </div>

            <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-rose-600 dark:text-rose-400">
              {formatCurrency(metrics.payables)}
            </div>

            <div className="flex items-center gap-1 text-[11px] mt-1 text-muted-foreground">
              <span className="text-[10px]">{isBangla ? 'পরিশোধযোগ্য মোট দেনা' : 'Vendor liabilities'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
