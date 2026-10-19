'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Search,
  Download,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Layers,
  ArrowLeftRight,
} from 'lucide-react';
import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface IncomeExpenseTabProps {
  transactions: any[];
  meta: any;
  categories: any[];
  isLoading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  flowFilter: string;
  onFlowFilterChange: (flow: string) => void;
  searchTerm: string;
  onSearchChange: (search: string) => void;
  onExportCsv: () => void;
}

export function IncomeExpenseTab({
  transactions,
  meta,
  categories,
  isLoading,
  currentPage,
  onPageChange,
  flowFilter,
  onFlowFilterChange,
  searchTerm,
  onSearchChange,
  onExportCsv,
}: IncomeExpenseTabProps) {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();

  const totalIn = Number(meta?.totalIn || 0);
  const totalOut = Number(meta?.totalOut || 0);
  const netFlow = totalIn - totalOut;
  const totalPages = Math.max(1, Number(meta?.totalPages || 1));

  return (
    <div className="space-y-6">
      {/* 1. Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl p-4 bg-card/70 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-muted-foreground">
              {isBangla ? 'মোট আয় / আগমন' : 'Total Inflow (Receipts)'}
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-emerald-500">
            +{formatCurrency(totalIn)}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            {isBangla ? 'বিক্রয় ও অন্যান্য আয়' : 'Sales and recorded receipts'}
          </div>
        </div>

        <div className="rounded-2xl p-4 bg-card/70 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-muted-foreground">
              {isBangla ? 'মোট ব্যয় / নির্গমন' : 'Total Outflow (Payments)'}
            </span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-rose-500">
            -{formatCurrency(totalOut)}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            {isBangla ? 'পরিচালন ও পণ্য ক্রয় ব্যয়' : 'Operating and vendor outflows'}
          </div>
        </div>

        <div className="rounded-2xl p-4 bg-card/70 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-muted-foreground">
              {isBangla ? 'নিট পরিচালন প্রবাহ' : 'Net Operating Flow'}
            </span>
            <div className={cn(
              "p-1.5 rounded-lg",
              netFlow >= 0 ? "bg-teal-500/10 text-teal-500" : "bg-amber-500/10 text-amber-500"
            )}>
              <ArrowLeftRight className="w-4 h-4" />
            </div>
          </div>
          <div className={cn("text-xl font-bold", netFlow >= 0 ? "text-teal-500" : "text-amber-500")}>
            {netFlow >= 0 ? '+' : ''}{formatCurrency(netFlow)}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            {isBangla ? 'প্রাপ্তি বনাম পরিশোধের ব্যবধান' : 'Net cash operational balance'}
          </div>
        </div>
      </div>

      {/* 2. Controls Bar: Filter, Search, Export */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card/60 backdrop-blur-xl p-3 rounded-2xl border border-white/10 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={isBangla ? 'লেনদেনের বিবরণ বা রেফারেন্স খুঁজুন...' : 'Search description or reference...'}
              className="pl-9 h-9 text-xs bg-background/50 rounded-xl border-border/60"
            />
          </div>

          <Select value={flowFilter} onValueChange={onFlowFilterChange}>
            <SelectTrigger className="w-[130px] h-9 text-xs bg-background/50 rounded-xl border-border/60">
              <SelectValue placeholder={isBangla ? 'ধরন' : 'Flow'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isBangla ? 'সকল প্রবাহ' : 'All Flows'}</SelectItem>
              <SelectItem value="IN">{isBangla ? 'শুধু আয় (IN)' : 'Inflow only'}</SelectItem>
              <SelectItem value="OUT">{isBangla ? 'শুধু ব্যয় (OUT)' : 'Outflow only'}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onExportCsv}
            className="h-9 px-3 rounded-xl text-xs gap-1.5 border-border/60 bg-background/50 hover:bg-muted font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isBangla ? 'CSV এক্সপোর্ট' : 'Export CSV'}</span>
          </Button>
        </div>
      </div>

      {/* 3. Transaction Ledger Table */}
      <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border/60">
              <tr>
                <th className="py-3 px-4 font-semibold">{isBangla ? 'তারিখ' : 'Date'}</th>
                <th className="py-3 px-4 font-semibold">{isBangla ? 'বিবরণ ও রেফারেন্স' : 'Description & Ref'}</th>
                <th className="py-3 px-4 font-semibold">{isBangla ? 'প্রবাহ' : 'Flow'}</th>
                <th className="py-3 px-4 font-semibold">{isBangla ? 'অ্যাকাউন্ট' : 'Account'}</th>
                <th className="py-3 px-4 font-semibold text-right">{isBangla ? 'পরিমাণ' : 'Amount'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    <td className="py-3.5 px-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="py-3.5 px-4"><Skeleton className="h-4 w-40" /></td>
                    <td className="py-3.5 px-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="py-3.5 px-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="py-3.5 px-4 text-right"><Skeleton className="h-4 w-20 ml-auto" /></td>
                  </tr>
                ))
              ) : transactions && transactions.length > 0 ? (
                transactions.map((txn: any) => {
                  const isInflow = txn.flow === 'IN' || txn.type === 'income' || txn.type === 'deposit';
                  const dateStr = txn.date
                    ? new Date(txn.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                    : '—';

                  return (
                    <tr key={txn.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                        {dateStr}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-foreground">
                        <div className="font-semibold">{txn.title || txn.partyName || txn.description || 'Transaction'}</div>
                        {txn.reference && (
                          <div className="text-[10px] text-muted-foreground">Ref: {txn.reference}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                          isInflow
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                        )}>
                          {isInflow ? (isBangla ? 'আয় (IN)' : 'Income (IN)') : (isBangla ? 'ব্যয় (OUT)' : 'Expense (OUT)')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                        {txn.accountName || txn.mode || 'Cash'}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold whitespace-nowrap">
                        <span className={isInflow ? "text-emerald-500" : "text-rose-500"}>
                          {isInflow ? '+' : '-'}{formatCurrency(txn.amount || 0)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground text-xs">
                    {isBangla ? 'কোনো লেনদেন পাওয়া যায়নি।' : 'No transactions recorded for the selected criteria.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground bg-muted/20">
          <div>
            {isBangla
              ? `পৃষ্ঠা ${currentPage} এর মধ্যে ${totalPages}`
              : `Page ${currentPage} of ${totalPages}`}
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1 || isLoading}
              onClick={() => onPageChange(currentPage - 1)}
              className="h-8 px-2.5 rounded-lg border-border/60"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages || isLoading}
              onClick={() => onPageChange(currentPage + 1)}
              className="h-8 px-2.5 rounded-lg border-border/60"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
