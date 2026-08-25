// Hello Khata OS - Supplier Payables Aging & Settlement Health Card
// হ্যালো খাতা - সরবরাহকারী প্রদেয় দেনার বয়স ও পরিশোধ চ্যানেল

'use client';

import React from 'react';
import Link from 'next/link';
import {
  Clock,
  ChevronRight,
  Landmark,
  Wallet,
  Coins,
  CreditCard,
} from 'lucide-react';
import { useCurrency } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import type { SupplierAgingBucket } from './types';

interface SupplierPayableAndPaymentHealthProps {
  totalDue: number;
  agingBuckets: SupplierAgingBucket[];
  settlementChannels: {
    id: string;
    name: string;
    nameBn: string;
    amount: number;
    percentage: number;
  }[];
  isBangla?: boolean;
}

export function SupplierPayableAndPaymentHealth({
  totalDue,
  agingBuckets,
  settlementChannels,
  isBangla = false,
}: SupplierPayableAndPaymentHealthProps) {
  const { formatCurrency } = useCurrency();

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div>
          <h3 className="text-sm font-bold text-foreground">
            {isBangla ? 'প্রদেয় দেনার এজিং ও পেমেন্ট বিতরণ' : 'Payables Aging & Payout Methods'}
          </h3>
          <p className="text-[11px] text-muted-foreground">
            {isBangla ? 'বকেয়া দেনার মেয়াদ কাঠামো এবং পরিশোধের মাধ্যম' : 'Supplier payment schedule & settlement breakdown'}
          </p>
        </div>

        <Link
          href="/reports/finance/payables"
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
        >
          <span>{isBangla ? 'দেনা বিবরণী' : 'View Payables'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 2 Sub-Sections: Left Aging, Right Payment Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
        {/* Left: Payables Aging */}
        <div className="space-y-3 sm:pr-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">{isBangla ? 'দেনার বয়স (Aging)' : 'Payable Aging'}</span>
            <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
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

          {/* Aging Grid */}
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

        {/* Right: Settlement Channels */}
        <div className="space-y-3 sm:pl-4 pt-4 sm:pt-0">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">{isBangla ? 'পরিশোধ মাধ্যম (Payouts)' : 'Payout Methods'}</span>
            <span className="text-[11px] font-mono text-muted-foreground">
              {isBangla ? 'সর্বমোট পরিশোধিত' : 'Disbursed'}
            </span>
          </div>

          {/* Channels Progress */}
          <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden flex">
            {settlementChannels.map((ch, i) => (
              <div
                key={ch.id}
                style={{ width: `${ch.percentage}%` }}
                className={cn(
                  'h-full',
                  i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-emerald-500' : i === 2 ? 'bg-pink-500' : 'bg-purple-500'
                )}
                title={`${ch.name}: ${ch.percentage}%`}
              />
            ))}
          </div>

          {/* Channels Grid */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {settlementChannels.map((ch, i) => (
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
