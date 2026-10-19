'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Landmark,
  Smartphone,
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Clock,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertCircle,
  Receipt,
  FileSpreadsheet,
} from 'lucide-react';
import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface FinanceOverviewTabProps {
  stats: any;
  partyStats: any;
  expenseSummary: any;
  salesSummary: any;
  recentTransactions: any[];
  isLoading: boolean;
  onNavigateTab: (tab: string) => void;
}

export function FinanceOverviewTab({
  stats,
  partyStats,
  expenseSummary,
  salesSummary,
  recentTransactions,
  isLoading,
  onNavigateTab,
}: FinanceOverviewTabProps) {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();

  // Liquidity Numbers
  const totalLiquidity = Number(stats?.totalLiquidity || 0);
  const cashLiquidity = Number(stats?.cashLiquidity || 0);
  const bankLiquidity = Number(stats?.bankLiquidity || 0);
  const walletLiquidity = Number(stats?.walletLiquidity || 0);

  // Inflow & Expenses
  const totalSalesRevenue = Number(salesSummary?.totalGrandTotal || 0);
  const thisMonthExpenses = Number(expenseSummary?.thisMonth?.total ?? expenseSummary?.allTime?.total ?? 0);
  const preliminaryOperatingProfit = totalSalesRevenue - thisMonthExpenses;

  // Receivables & Payables
  const totalReceivable = Number(partyStats?.totalReceivable || 0);
  const totalPayable = Number(partyStats?.totalPayable || 0);

  // Liquidity Percentages
  const cashPct = totalLiquidity > 0 ? Math.round((cashLiquidity / totalLiquidity) * 100) : 0;
  const bankPct = totalLiquidity > 0 ? Math.round((bankLiquidity / totalLiquidity) * 100) : 0;
  const walletPct = totalLiquidity > 0 ? Math.max(0, 100 - cashPct - bankPct) : 0;

  return (
    <div className="space-y-6">
      {/* =========================================================================
          1. TOP 6 CORE FINANCIAL METRIC CARDS (NO DUPLICATES)
         ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Card 1: Operating Inflow (Sales) */}
        <div className="rounded-2xl p-4 bg-card/70 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">
              {isBangla ? 'বিক্রয় রাজস্ব' : 'Operating Revenue'}
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          {isLoading ? (
            <Skeleton className="h-7 w-28 my-1" />
          ) : (
            <div className="text-lg font-bold text-foreground">
              {formatCurrency(totalSalesRevenue)}
            </div>
          )}
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-muted-foreground">
            <span className="text-emerald-500 font-medium">
              {salesSummary?.totalSalesCount || 0} {isBangla ? 'টি বিক্রয়' : 'orders'}
            </span>
          </div>
        </div>

        {/* Card 2: Operating Expenses */}
        <div className="rounded-2xl p-4 bg-card/70 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">
              {isBangla ? 'পরিচালন ব্যয়' : 'Operating Expenses'}
            </span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          {isLoading ? (
            <Skeleton className="h-7 w-28 my-1" />
          ) : (
            <div className="text-lg font-bold text-foreground">
              {formatCurrency(thisMonthExpenses)}
            </div>
          )}
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-muted-foreground">
            <span>{isBangla ? 'রেকর্ডকৃত খরচ' : 'Recorded overheads'}</span>
          </div>
        </div>

        {/* Card 3: Preliminary Net Margin */}
        <div className="rounded-2xl p-4 bg-card/70 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-muted-foreground">
                {isBangla ? 'প্রাথমিক মার্জিন' : 'Preliminary Margin'}
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-muted-foreground/70 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs p-2">
                    {isBangla
                      ? 'বিক্রয় আয় থেকে রেকর্ডকৃত পরিচালন খরচ বাদ দিয়ে প্রাথমিক হিসাব। পূর্ণাঙ্গ নিট লাভের জন্য ইনভেন্টরি বিক্রীত পণ্যের ব্যয় (COGS) সমন্বয় প্রয়োজন।'
                      : 'Operating Revenue minus recorded expenses. Complete statutory Net Profit requires batch inventory COGS adjustments.'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className={cn(
              "p-2 rounded-xl",
              preliminaryOperatingProfit >= 0 ? "bg-teal-500/10 text-teal-500" : "bg-amber-500/10 text-amber-500"
            )}>
              <Coins className="w-4 h-4" />
            </div>
          </div>
          {isLoading ? (
            <Skeleton className="h-7 w-28 my-1" />
          ) : (
            <div className={cn(
              "text-lg font-bold",
              preliminaryOperatingProfit >= 0 ? "text-teal-500" : "text-amber-500"
            )}>
              {formatCurrency(preliminaryOperatingProfit)}
            </div>
          )}
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-muted-foreground">
            <span>{isBangla ? 'পরিচালন উদ্বৃত্ত' : 'Operational surplus'}</span>
          </div>
        </div>

        {/* Card 4: Liquid Cash & Bank */}
        <div className="rounded-2xl p-4 bg-card/70 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">
              {isBangla ? 'মোট তারল্য (ক্যাশ ও ব্যাংক)' : 'Cash & Bank Liquidity'}
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          {isLoading ? (
            <Skeleton className="h-7 w-28 my-1" />
          ) : (
            <div className="text-lg font-bold text-foreground">
              {formatCurrency(totalLiquidity)}
            </div>
          )}
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-muted-foreground">
            <span>{stats?.totalAccounts || 0} {isBangla ? 'টি সক্রিয় অ্যাকাউন্ট' : 'accounts'}</span>
          </div>
        </div>

        {/* Card 5: Customer Receivables */}
        <div
          onClick={() => onNavigateTab('receivables')}
          className="rounded-2xl p-4 bg-card/70 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-sm hover:shadow-md hover:border-amber-500/30 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground group-hover:text-amber-500 transition-colors">
              {isBangla ? 'গ্রাহক পাওনা' : 'Customer Receivables'}
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          {isLoading ? (
            <Skeleton className="h-7 w-28 my-1" />
          ) : (
            <div className="text-lg font-bold text-amber-500">
              {formatCurrency(totalReceivable)}
            </div>
          )}
          <div className="flex items-center justify-between mt-2 text-[11px] text-muted-foreground">
            <span>{partyStats?.customers || 0} {isBangla ? 'জন গ্রাহক' : 'customers'}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 6: Supplier Payables */}
        <div
          onClick={() => onNavigateTab('payables')}
          className="rounded-2xl p-4 bg-card/70 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-sm hover:shadow-md hover:border-rose-500/30 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground group-hover:text-rose-500 transition-colors">
              {isBangla ? 'সরবরাহকারী দেনা' : 'Supplier Payables'}
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          {isLoading ? (
            <Skeleton className="h-7 w-28 my-1" />
          ) : (
            <div className="text-lg font-bold text-purple-500">
              {formatCurrency(totalPayable)}
            </div>
          )}
          <div className="flex items-center justify-between mt-2 text-[11px] text-muted-foreground">
            <span>{partyStats?.suppliers || 0} {isBangla ? 'জন সরবরাহকারী' : 'suppliers'}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. LIQUIDITY BREAKDOWN & TOP EXPENSE CATEGORIES ROW
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Liquidity Distribution */}
        <div className="rounded-2xl p-5 bg-card/70 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {isBangla ? 'নগদ ও ব্যাংক তহবিলের বিন্যাস' : 'Liquidity Breakdown'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isBangla ? 'হাতে নগদ, ব্যাংক ও মোবাইল ওয়ালেটের ভারসাম্য' : 'Distribution across Cash, Bank, and Mobile Wallets'}
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('cash-bank')}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{isBangla ? 'বিস্তারিত' : 'View Accounts'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Stacked Progress Bar */}
          <div className="h-3 w-full bg-muted/60 rounded-full overflow-hidden flex">
            <div style={{ width: `${cashPct}%` }} className="bg-emerald-500 h-full transition-all" />
            <div style={{ width: `${bankPct}%` }} className="bg-blue-500 h-full transition-all" />
            <div style={{ width: `${walletPct}%` }} className="bg-purple-500 h-full transition-all" />
          </div>

          {/* Cards for each channel */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
              <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium mb-1">
                <Wallet className="w-3.5 h-3.5" />
                <span>{isBangla ? 'হাতে নগদ' : 'Cash'}</span>
              </div>
              <div className="text-sm font-bold text-foreground">
                {formatCurrency(cashLiquidity)}
              </div>
              <span className="text-[10px] text-muted-foreground">{cashPct}% of total</span>
            </div>

            <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
              <div className="flex items-center gap-1.5 text-xs text-blue-500 font-medium mb-1">
                <Landmark className="w-3.5 h-3.5" />
                <span>{isBangla ? 'ব্যাংক ব্যালেন্স' : 'Bank'}</span>
              </div>
              <div className="text-sm font-bold text-foreground">
                {formatCurrency(bankLiquidity)}
              </div>
              <span className="text-[10px] text-muted-foreground">{bankPct}% of total</span>
            </div>

            <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10">
              <div className="flex items-center gap-1.5 text-xs text-purple-500 font-medium mb-1">
                <Smartphone className="w-3.5 h-3.5" />
                <span>{isBangla ? 'মোবাইল ওয়ালেট' : 'Wallets'}</span>
              </div>
              <div className="text-sm font-bold text-foreground">
                {formatCurrency(walletLiquidity)}
              </div>
              <span className="text-[10px] text-muted-foreground">{walletPct}% of total</span>
            </div>
          </div>
        </div>

        {/* Right: Top Expense Categories */}
        <div className="rounded-2xl p-5 bg-card/70 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {isBangla ? 'শীর্ষ পরিচালন ব্যয় খাত' : 'Top Expense Categories'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isBangla ? 'সর্বাধিক ব্যয়ের প্রধান ক্যাটাগরিসমূহ' : 'Major spending categories'}
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('income-expense')}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{isBangla ? 'সকল ব্যয়' : 'All Expenses'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {expenseSummary?.topCategories && expenseSummary.topCategories.length > 0 ? (
              expenseSummary.topCategories.slice(0, 4).map((cat: any, idx: number) => {
                const catAmount = Number(cat.amount || 0);
                const totalCatSpend = Math.max(1, thisMonthExpenses);
                const pct = Math.min(100, Math.round((catAmount / totalCatSpend) * 100));

                return (
                  <div key={cat.id || idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">
                        {isBangla ? (cat.nameBn || cat.name) : cat.name}
                      </span>
                      <span className="font-semibold text-muted-foreground">
                        {formatCurrency(catAmount)} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className={cn(
                          "h-full rounded-full transition-all",
                          idx === 0 ? "bg-rose-500" : idx === 1 ? "bg-amber-500" : idx === 2 ? "bg-blue-500" : "bg-teal-500"
                        )}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-muted-foreground">
                {isBangla ? 'ব্যয় সংক্রান্ত কোনো তথ্য রেকর্ড নেই' : 'No expense category records for this period'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. RECENT TRANSACTIONS LEDGER (LIVE FROM API)
         ========================================================================= */}
      <div className="rounded-2xl p-5 bg-card/70 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {isBangla ? 'সাম্প্রতিক আর্থিক লেনদেন' : 'Recent Financial Transactions'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isBangla ? 'সরাসরি লেনদেন খাতা থেকে সর্বশেষ এন্ট্রি' : 'Live journal activity across all branches'}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('income-expense')}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{isBangla ? 'সম্পূর্ণ লেজার' : 'Full Ledger'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto rounded-xl border border-border/50">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border/50">
              <tr>
                <th className="py-2.5 px-4 font-semibold">{isBangla ? 'তারিখ' : 'Date'}</th>
                <th className="py-2.5 px-4 font-semibold">{isBangla ? 'বিবরণ ও পক্ষ' : 'Description / Party'}</th>
                <th className="py-2.5 px-4 font-semibold">{isBangla ? 'ধরন' : 'Type'}</th>
                <th className="py-2.5 px-4 font-semibold">{isBangla ? 'অ্যাকাউন্ট' : 'Account'}</th>
                <th className="py-2.5 px-4 font-semibold text-right">{isBangla ? 'পরিমাণ' : 'Amount'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td className="py-3 px-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="py-3 px-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="py-3 px-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="py-3 px-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="py-3 px-4 text-right"><Skeleton className="h-4 w-20 ml-auto" /></td>
                  </tr>
                ))
              ) : recentTransactions && recentTransactions.length > 0 ? (
                recentTransactions.slice(0, 7).map((txn: any) => {
                  const isInflow = txn.flow === 'IN' || txn.type === 'income' || txn.type === 'deposit';
                  const dateFormatted = txn.date ? new Date(txn.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

                  return (
                    <tr key={txn.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                        {dateFormatted}
                      </td>
                      <td className="py-3 px-4 font-medium text-foreground">
                        <div className="truncate max-w-[220px]">
                          {txn.title || txn.partyName || txn.description || (isBangla ? 'সাধারণ লেনদেন' : 'General Transaction')}
                        </div>
                        {txn.reference && (
                          <div className="text-[10px] text-muted-foreground">Ref: {txn.reference}</div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap",
                          isInflow
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                        )}>
                          {isInflow ? (isBangla ? 'আগমন (IN)' : 'Inflow') : (isBangla ? 'বহির্গমন (OUT)' : 'Outflow')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {txn.accountName || txn.mode || 'Cash'}
                      </td>
                      <td className="py-3 px-4 text-right font-bold whitespace-nowrap">
                        <span className={isInflow ? "text-emerald-500" : "text-rose-500"}>
                          {isInflow ? '+' : '-'}{formatCurrency(txn.amount || 0)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    {isBangla ? 'কোনো সাম্প্রতিক লেনদেন পাওয়া যায়নি।' : 'No recent transactions found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
