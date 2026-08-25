// Hello Khata OS - Customer Receivables Aging Breakdown
// হ্যালো খাতা - গ্রাহক বাকি ও মেয়াদোত্তীর্ণ এজিং বিশ্লেষণ

'use client';

import React from 'react';
import Link from 'next/link';
import {
  Clock,
  ChevronRight,
  AlertTriangle,
  CreditCard,
  ArrowRight,
} from 'lucide-react';
import { useCurrency } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import type { CustomerAgingBucket } from './types';

interface CustomerDueAgingProps {
  totalDue: number;
  buckets: CustomerAgingBucket[];
  isBangla?: boolean;
}

export function CustomerDueAging({
  totalDue,
  buckets,
  isBangla = false,
}: CustomerDueAgingProps) {
  const { formatCurrency } = useCurrency();

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              {isBangla ? 'গ্রাহক বাকির এজিং বিশ্লেষণ' : 'Customer Receivables Aging'}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {isBangla ? 'বকেয়ার বয়স ও কালেকশন ঝুঁকি নিরুপণ' : 'Collection risk and days outstanding analysis'}
            </p>
          </div>
        </div>

        <Link
          href="/reports/finance/receivables"
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
        >
          <span>{isBangla ? 'বকেয়া খতিয়ান' : 'View Receivables'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Segmented Progress Strip */}
      <div className="space-y-1.5">
        <div className="h-2.5 w-full bg-muted/60 rounded-full overflow-hidden flex">
          {buckets.map((b, i) => (
            <div
              key={i}
              style={{ width: `${b.percentage}%` }}
              className={cn(
                'h-full transition-all',
                i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-blue-500' : i === 2 ? 'bg-amber-500' : 'bg-rose-500'
              )}
              title={`${b.range}: ${formatCurrency(b.amount)} (${b.percentage}%)`}
            />
          ))}
        </div>
      </div>

      {/* Aging Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
        {buckets.map((b, i) => (
          <div key={i} className="p-3 rounded-xl bg-muted/15 border border-border/60 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-muted-foreground flex items-center gap-1 font-mono">
                <span
                  className={cn(
                    'w-1.5 h-1.5 rounded-full shrink-0',
                    i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-blue-500' : i === 2 ? 'bg-amber-500' : 'bg-rose-500'
                  )}
                />
                {b.range}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">{b.customerCount} {isBangla ? 'জন' : 'cust'}</span>
            </div>

            <div className="flex items-baseline justify-between pt-0.5">
              <span className="text-sm font-bold font-mono text-foreground">{formatCurrency(b.amount)}</span>
              <span className="text-[10.5px] font-mono text-muted-foreground">{b.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
