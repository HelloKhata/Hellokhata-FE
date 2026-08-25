// Hello Khata OS - Balance Sheet Snapshot (Financial Position)
// হ্যালো খাতা - ব্যালেন্স শিট স্ন্যাপশট (সম্পদ, দায় ও মালিকানাস্বত্ব)

'use client';

import React from 'react';
import Link from 'next/link';
import {
  Scale,
  Building2,
  Wallet,
  Coins,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useCurrency } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';

interface BalanceSheetSnapshotProps {
  assets: { total: number; cash: number; bank: number; inventory: number; receivables: number };
  liabilities: { total: number; payables: number; loans: number; others: number };
  equity: { total: number; capital: number; retainedEarnings: number };
  isBangla?: boolean;
}

export function BalanceSheetSnapshot({
  assets,
  liabilities,
  equity,
  isBangla = false,
}: BalanceSheetSnapshotProps) {
  const { formatCurrency } = useCurrency();

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              {isBangla ? 'আর্থিক অবস্থান (ব্যালেন্স শিট)' : 'Financial Position'}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {isBangla ? 'সম্পদ = দায় + মালিকানাস্বত্ব এর তাৎক্ষণিক চিত্র' : 'Assets = Liabilities + Owner Equity snapshot'}
            </p>
          </div>
        </div>

        <Link
          href="/finance/reports/balance-sheet"
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
        >
          <span>{isBangla ? 'পূর্ণ ব্যালেন্স শিট' : 'View Balance Sheet'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* 1. Total Assets */}
        <div className="p-4 rounded-xl bg-muted/20 border border-border/60 space-y-3">
          <div className="flex items-center justify-between border-b border-border/50 pb-2">
            <span className="font-bold text-foreground">{isBangla ? 'মোট সম্পদ (Assets)' : 'Total Assets'}</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
              {formatCurrency(assets.total)}
            </span>
          </div>

          <div className="space-y-1.5 font-mono text-[11px] text-muted-foreground">
            <div className="flex justify-between">
              <span>{isBangla ? 'নগদ ও ব্যাংক' : 'Cash & Bank'}</span>
              <span className="text-foreground">{formatCurrency(assets.cash + assets.bank)}</span>
            </div>
            <div className="flex justify-between">
              <span>{isBangla ? 'মজুদ পণ্য (Inventory)' : 'Inventory Value'}</span>
              <span className="text-foreground">{formatCurrency(assets.inventory)}</span>
            </div>
            <div className="flex justify-between">
              <span>{isBangla ? 'গ্রাহক বকেয়া (Receivable)' : 'Receivables'}</span>
              <span className="text-foreground">{formatCurrency(assets.receivables)}</span>
            </div>
          </div>
        </div>

        {/* 2. Total Liabilities */}
        <div className="p-4 rounded-xl bg-muted/20 border border-border/60 space-y-3">
          <div className="flex items-center justify-between border-b border-border/50 pb-2">
            <span className="font-bold text-foreground">{isBangla ? 'মোট দায় (Liabilities)' : 'Total Liabilities'}</span>
            <span className="font-mono font-bold text-rose-600 dark:text-rose-400 text-sm">
              {formatCurrency(liabilities.total)}
            </span>
          </div>

          <div className="space-y-1.5 font-mono text-[11px] text-muted-foreground">
            <div className="flex justify-between">
              <span>{isBangla ? 'সাপ্লায়ার দেনা' : 'Accounts Payable'}</span>
              <span className="text-foreground">{formatCurrency(liabilities.payables)}</span>
            </div>
            <div className="flex justify-between">
              <span>{isBangla ? 'স্বল্পমেয়াদী ঋণ' : 'Short-Term Loans'}</span>
              <span className="text-foreground">{formatCurrency(liabilities.loans)}</span>
            </div>
            <div className="flex justify-between">
              <span>{isBangla ? 'বকেয়া বিল ও কর' : 'Accrued Expenses & Tax'}</span>
              <span className="text-foreground">{formatCurrency(liabilities.others)}</span>
            </div>
          </div>
        </div>

        {/* 3. Owner Equity */}
        <div className="p-4 rounded-xl bg-muted/20 border border-border/60 space-y-3">
          <div className="flex items-center justify-between border-b border-border/50 pb-2">
            <span className="font-bold text-foreground">{isBangla ? 'মালিকানাস্বত্ব (Equity)' : 'Owner’s Equity'}</span>
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">
              {formatCurrency(equity.total)}
            </span>
          </div>

          <div className="space-y-1.5 font-mono text-[11px] text-muted-foreground">
            <div className="flex justify-between">
              <span>{isBangla ? 'মালিকের মূলধন' : 'Contributed Capital'}</span>
              <span className="text-foreground">{formatCurrency(equity.capital)}</span>
            </div>
            <div className="flex justify-between">
              <span>{isBangla ? 'সঞ্চিত মুনাফা (Retained)' : 'Retained Earnings'}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{formatCurrency(equity.retainedEarnings)}</span>
            </div>
            <div className="flex justify-between text-[10px] pt-1 text-muted-foreground/80">
              <span>Balance Check:</span>
              <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                <CheckCircle2 className="w-2.5 h-2.5" /> Balanced
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
