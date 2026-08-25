// Hello Khata OS - Receivables & Payables with Aging Analysis
// হ্যালো খাতা - পাওনা ও দেনা এবং মেয়াদোত্তীর্ণ বিশ্লেষণ (০-৩০, ৩১-৬০, ৬১-৯০, ৯০+ দিন)

'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  Building2,
  ChevronRight,
  AlertCircle,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { useCurrency } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import type { AgingBucket } from './types';

interface DuesAgingSectionProps {
  receivables: {
    total: number;
    dueToday: number;
    overdue: number;
    aging: AgingBucket[];
  };
  payables: {
    total: number;
    dueToday: number;
    overdue: number;
    aging: AgingBucket[];
  };
  isBangla?: boolean;
}

export function DuesAgingSection({
  receivables,
  payables,
  isBangla = false,
}: DuesAgingSectionProps) {
  const { formatCurrency } = useCurrency();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* 1. Accounts Receivable (Customer Dues) */}
      <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                {isBangla ? 'গ্রাহক পাওনা (Receivables)' : 'Accounts Receivable'}
              </h3>
              <p className="text-[11px] text-muted-foreground">
                {isBangla ? 'গ্রাহকদের কাছে বকেয়া এবং মেয়াদ বিশ্লেষণ' : 'Outstanding customer balances & credit aging'}
              </p>
            </div>
          </div>

          <Link
            href="/finance/receivables"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>{isBangla ? 'বিস্তারিত' : 'View Receivables'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-3 gap-2.5 text-xs">
          <div className="p-3 rounded-xl bg-muted/20 border border-border/50 space-y-0.5">
            <span className="text-[10px] text-muted-foreground block">{isBangla ? 'মোট পাওনা' : 'Total Outstanding'}</span>
            <span className="text-sm sm:text-base font-bold font-mono text-foreground">{formatCurrency(receivables.total)}</span>
          </div>

          <div className="p-3 rounded-xl bg-muted/20 border border-border/50 space-y-0.5">
            <span className="text-[10px] text-muted-foreground block">{isBangla ? 'আজকের মেয়াদ' : 'Due Today'}</span>
            <span className="text-sm sm:text-base font-bold font-mono text-foreground">{formatCurrency(receivables.dueToday)}</span>
          </div>

          <div className="p-3 rounded-xl bg-rose-500/[0.04] border border-rose-500/20 space-y-0.5">
            <span className="text-[10px] text-rose-600 dark:text-rose-400 block font-medium">{isBangla ? 'মেয়াদোত্তীর্ণ' : 'Overdue'}</span>
            <span className="text-sm sm:text-base font-bold font-mono text-rose-600 dark:text-rose-400">{formatCurrency(receivables.overdue)}</span>
          </div>
        </div>

        {/* Aging Breakdown Bar */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{isBangla ? 'এজিং বিশ্লেষণ (Aging Buckets)' : 'Aging Breakdown'}</span>
            <span className="text-[10px] font-mono">{isBangla ? 'বকেয়া সময়কাল' : 'Days Past Invoice'}</span>
          </div>

          {/* Segmented Progress Strip */}
          <div className="h-2.5 w-full rounded-full bg-muted/60 overflow-hidden flex">
            {receivables.aging.map((bucket, i) => (
              <div
                key={i}
                style={{ width: `${bucket.percentage}%` }}
                className={cn(
                  'h-full transition-all',
                  i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-blue-500' : i === 2 ? 'bg-amber-500' : 'bg-rose-500'
                )}
                title={`${bucket.range}: ${formatCurrency(bucket.amount)} (${bucket.percentage}%)`}
              />
            ))}
          </div>

          {/* Legend Grid */}
          <div className="grid grid-cols-4 gap-1.5 text-[10.5px] pt-1">
            {receivables.aging.map((b, i) => (
              <div key={i} className="space-y-0.5">
                <span className="text-muted-foreground flex items-center gap-1 font-mono text-[10px]">
                  <span
                    className={cn(
                      'w-1.5 h-1.5 rounded-full shrink-0',
                      i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-blue-500' : i === 2 ? 'bg-amber-500' : 'bg-rose-500'
                    )}
                  />
                  {b.range}
                </span>
                <span className="font-bold text-foreground font-mono block truncate">{formatCurrency(b.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Accounts Payable (Supplier Dues) */}
      <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                {isBangla ? 'সাপ্লায়ার দেনা (Payables)' : 'Accounts Payable'}
              </h3>
              <p className="text-[11px] text-muted-foreground">
                {isBangla ? 'সরবরাহকারীদের পরিশোধযোগ্য দেনার হিসাব' : 'Supplier bills & upcoming payment commitments'}
              </p>
            </div>
          </div>

          <Link
            href="/finance/payables"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>{isBangla ? 'বিস্তারিত' : 'View Payables'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-3 gap-2.5 text-xs">
          <div className="p-3 rounded-xl bg-muted/20 border border-border/50 space-y-0.5">
            <span className="text-[10px] text-muted-foreground block">{isBangla ? 'মোট দেনা' : 'Total Payable'}</span>
            <span className="text-sm sm:text-base font-bold font-mono text-foreground">{formatCurrency(payables.total)}</span>
          </div>

          <div className="p-3 rounded-xl bg-muted/20 border border-border/50 space-y-0.5">
            <span className="text-[10px] text-muted-foreground block">{isBangla ? 'আজকের প্রদেয়' : 'Due Today'}</span>
            <span className="text-sm sm:text-base font-bold font-mono text-foreground">{formatCurrency(payables.dueToday)}</span>
          </div>

          <div className="p-3 rounded-xl bg-rose-500/[0.04] border border-rose-500/20 space-y-0.5">
            <span className="text-[10px] text-rose-600 dark:text-rose-400 block font-medium">{isBangla ? 'মেয়াদোত্তীর্ণ' : 'Overdue'}</span>
            <span className="text-sm sm:text-base font-bold font-mono text-rose-600 dark:text-rose-400">{formatCurrency(payables.overdue)}</span>
          </div>
        </div>

        {/* Aging Breakdown Bar */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{isBangla ? 'এজিং বিশ্লেষণ (Aging Buckets)' : 'Aging Breakdown'}</span>
            <span className="text-[10px] font-mono">{isBangla ? 'দেনা সময়কাল' : 'Days Outstanding'}</span>
          </div>

          {/* Segmented Progress Strip */}
          <div className="h-2.5 w-full rounded-full bg-muted/60 overflow-hidden flex">
            {payables.aging.map((bucket, i) => (
              <div
                key={i}
                style={{ width: `${bucket.percentage}%` }}
                className={cn(
                  'h-full transition-all',
                  i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-blue-500' : i === 2 ? 'bg-amber-500' : 'bg-rose-500'
                )}
                title={`${bucket.range}: ${formatCurrency(bucket.amount)} (${bucket.percentage}%)`}
              />
            ))}
          </div>

          {/* Legend Grid */}
          <div className="grid grid-cols-4 gap-1.5 text-[10.5px] pt-1">
            {payables.aging.map((b, i) => (
              <div key={i} className="space-y-0.5">
                <span className="text-muted-foreground flex items-center gap-1 font-mono text-[10px]">
                  <span
                    className={cn(
                      'w-1.5 h-1.5 rounded-full shrink-0',
                      i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-blue-500' : i === 2 ? 'bg-amber-500' : 'bg-rose-500'
                    )}
                  />
                  {b.range}
                </span>
                <span className="font-bold text-foreground font-mono block truncate">{formatCurrency(b.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
