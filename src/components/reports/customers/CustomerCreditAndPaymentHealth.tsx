// Hello Khata OS - Minimal Customer Credit & Payment Health Card
// হ্যালো খাতা - গ্রাহক ক্রেডিট ও পেমেন্ট স্বাস্থ্য সারসংক্ষেপ

'use client';

import React from 'react';
import Link from 'next/link';
import {
  Clock,
  ChevronRight,
  RotateCcw,
  Coins,
  Wallet,
  Landmark,
  CreditCard,
} from 'lucide-react';
import { useCurrency } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import type { CustomerAgingBucket } from './types';

interface CustomerCreditAndPaymentHealthProps {
  totalDue: number;
  agingBuckets: CustomerAgingBucket[];
  repeatPurchaseRate: number;
  channels: {
    id: string;
    name: string;
    nameBn: string;
    amount: number;
    percentage: number;
  }[];
  isBangla?: boolean;
}

export function CustomerCreditAndPaymentHealth({
  totalDue,
  agingBuckets,
  repeatPurchaseRate,
  channels,
  isBangla = false,
}: CustomerCreditAndPaymentHealthProps) {
  const { formatCurrency } = useCurrency();

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div>
          <h3 className="text-sm font-bold text-foreground">
            {isBangla ? 'গ্রাহক বকেয়া ও পেমেন্ট মাধ্যম' : 'Customer Credit & Payment Behavior'}
          </h3>
          <p className="text-[11px] text-muted-foreground">
            {isBangla ? 'বকেয়ার মেয়াদ কাঠামো ও পেমেন্ট মাধ্যমের শতকরা হার' : 'Aging risk distribution & settlement channels'}
          </p>
        </div>

        <Link
          href="/reports/finance/receivables"
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
        >
          <span>{isBangla ? 'বকেয়া তালিকা' : 'View Receivables'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 2 Sub-Sections: Left Aging, Right Payment Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
        {/* Left: Receivables Aging */}
        <div className="space-y-3 sm:pr-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">{isBangla ? 'বকেয়ার বয়স (Aging)' : 'Receivables Aging'}</span>
            <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
              {formatCurrency(totalDue)}
            </span>
          </div>

          {/* Segmented Bar */}
          <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden flex">
            {agingBuckets.map((b, i) => (
              <div
                key={i}
                style={{ width: `${b.percentage}%` }}
                className={cn(
                  'h-full',
                  i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-blue-500' : i === 2 ? 'bg-amber-500' : 'bg-rose-500'
                )}
                title={`${b.range}: ${formatCurrency(b.amount)}`}
              />
            ))}
          </div>

          {/* Aging Legend Grid */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {agingBuckets.map((b, i) => (
              <div key={i} className="p-2 rounded-xl bg-muted/20 border border-border/40 space-y-0.5">
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1 font-mono">
                    <span
                      className={cn(
                        'w-1.5 h-1.5 rounded-full shrink-0',
                        i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-blue-500' : i === 2 ? 'bg-amber-500' : 'bg-rose-500'
                      )}
                    />
                    {b.range}
                  </span>
                  <span>{b.percentage}%</span>
                </div>
                <span className="font-bold text-foreground font-mono block text-xs truncate">
                  {formatCurrency(b.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Payment Channels */}
        <div className="space-y-3 sm:pl-4 pt-4 sm:pt-0">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">{isBangla ? 'পেমেন্ট মাধ্যম (Channels)' : 'Payment Channels'}</span>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              {repeatPurchaseRate}% {isBangla ? 'পুনরাবৃত্তি হার' : 'Repeat Rate'}
            </span>
          </div>

          {/* Channels Progress */}
          <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden flex">
            {channels.map((ch, i) => (
              <div
                key={ch.id}
                style={{ width: `${ch.percentage}%` }}
                className={cn(
                  'h-full',
                  i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-pink-500' : i === 2 ? 'bg-blue-500' : 'bg-purple-500'
                )}
                title={`${ch.name}: ${ch.percentage}%`}
              />
            ))}
          </div>

          {/* Channels Grid */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {channels.map((ch, i) => (
              <div key={ch.id} className="p-2 rounded-xl bg-muted/20 border border-border/40 space-y-0.5">
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span className="truncate">{isBangla ? ch.nameBn : ch.name}</span>
                  <span className="font-mono font-bold">{ch.percentage}%</span>
                </div>
                <span className="font-bold text-foreground font-mono block text-xs truncate">
                  {formatCurrency(ch.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
