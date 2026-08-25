// Hello Khata OS - Cash Flow Movement Summary (Opening → Inflow → Outflow → Closing)
// হ্যালো খাতা - নগদ প্রবাহ আন্দোলন সারসংক্ষেপ

'use client';

import React from 'react';
import Link from 'next/link';
import {
  Wallet,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
} from 'lucide-react';
import { useCurrency } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import type { CashMovementSummary } from './types';

interface CashFlowMovementProps {
  data: CashMovementSummary;
  isBangla?: boolean;
}

export function CashFlowMovement({
  data,
  isBangla = false,
}: CashFlowMovementProps) {
  const { formatCurrency } = useCurrency();

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              {isBangla ? 'নগদ প্রবাহের গতিপথ' : 'Cash Flow Movement'}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {isBangla ? 'প্রারম্ভিক থেকে সমাপনী নগদ উদ্বৃত্তের পরিবর্তন' : 'Opening balance to closing liquidity transition'}
            </p>
          </div>
        </div>

        <Link
          href="/finance/reports/cash-flow"
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
        >
          <span>{isBangla ? 'পূর্ণ ক্যাশ ফ্লো রিপোর্ট' : 'View Cash Flow Report'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Movement Pipeline Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        {/* 1. Opening Cash */}
        <div className="p-3.5 rounded-xl bg-muted/20 border border-border/50 space-y-1">
          <span className="text-[11px] text-muted-foreground block">
            {isBangla ? 'প্রারম্ভিক নগদ (Opening)' : '1. Opening Cash'}
          </span>
          <div className="text-base font-bold font-mono text-foreground">
            {formatCurrency(data.openingCash)}
          </div>
          <span className="text-[10px] text-muted-foreground block">
            {isBangla ? 'মাসের শুরুতে' : 'At start of period'}
          </span>
        </div>

        {/* 2. Total Inflows */}
        <div className="p-3.5 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/20 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground block">
              {isBangla ? 'মোট নগদ আগমন (+ In)' : '2. Cash Inflow (+)'}
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
            +{formatCurrency(data.cashIn)}
          </div>
          <span className="text-[10px] text-muted-foreground block">
            {isBangla ? 'বিক্রয় ও গ্রাহক সংগ্রহ' : 'Sales & collections'}
          </span>
        </div>

        {/* 3. Total Outflows */}
        <div className="p-3.5 rounded-xl bg-rose-500/[0.04] border border-rose-500/20 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground block">
              {isBangla ? 'মোট নগদ নির্গমন (- Out)' : '3. Cash Outflow (-)'}
            </span>
            <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-base font-bold font-mono text-rose-600 dark:text-rose-400">
            -{formatCurrency(data.cashOut)}
          </div>
          <span className="text-[10px] text-muted-foreground block">
            {isBangla ? 'ক্রয়, বেতন ও বিল' : 'Purchases & operating costs'}
          </span>
        </div>

        {/* 4. Closing Cash Balance */}
        <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-1 ring-1 ring-border/50">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-foreground font-semibold block">
              {isBangla ? 'সমাপনী নগদ (Closing)' : '4. Closing Cash'}
            </span>
            <span
              className={cn(
                'text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md',
                data.netCashFlow >= 0
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
              )}
            >
              {data.netCashFlow >= 0 ? `+${formatCurrency(data.netCashFlow)}` : formatCurrency(data.netCashFlow)}
            </span>
          </div>
          <div className="text-base font-bold font-mono text-foreground">
            {formatCurrency(data.closingCash)}
          </div>
          <span className="text-[10px] text-muted-foreground block">
            {isBangla ? 'বর্তমান মোট তারল্য' : 'Current net liquid position'}
          </span>
        </div>
      </div>
    </div>
  );
}
