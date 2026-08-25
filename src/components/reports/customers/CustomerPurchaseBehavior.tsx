// Hello Khata OS - Customer Purchase Behavior & Retention
// হ্যালো খাতা - গ্রাহক কেনাকাটার আচরণ ও পুনরাবৃত্তি হার

'use client';

import React from 'react';
import {
  RotateCcw,
  UserPlus,
  TrendingUp,
  Percent,
  Sparkles,
} from 'lucide-react';
import { useCurrency } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';

interface CustomerPurchaseBehaviorProps {
  repeatPurchaseRate: number;
  returningSales: number;
  newSales: number;
  returningCustomerCount: number;
  newCustomerCount: number;
  isBangla?: boolean;
}

export function CustomerPurchaseBehavior({
  repeatPurchaseRate,
  returningSales,
  newSales,
  returningCustomerCount,
  newCustomerCount,
  isBangla = false,
}: CustomerPurchaseBehaviorProps) {
  const { formatCurrency } = useCurrency();

  const total = returningSales + newSales || 1;
  const returningPct = Math.round((returningSales / total) * 100);
  const newPct = 100 - returningPct;

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              {isBangla ? 'গ্রাহক আনুগত্য ও ক্রয় পুনরাবৃত্তি' : 'Purchase Frequency & Loyalty'}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {isBangla ? 'নতুন বনাম নিয়মিত পুনরাবৃত্তি ক্রেতা' : 'New vs returning customer contribution'}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
          {repeatPurchaseRate}% {isBangla ? 'পুনরাবৃত্তি হার' : 'Repeat Rate'}
        </span>
      </div>

      {/* Progress Strip */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-emerald-600 dark:text-emerald-400">
            {isBangla ? 'নিয়মিত ক্রেতা' : 'Returning'}: {returningPct}%
          </span>
          <span className="text-purple-600 dark:text-purple-400">
            {isBangla ? 'নতুন ক্রেতা' : 'New Acquisitions'}: {newPct}%
          </span>
        </div>

        <div className="h-3 w-full bg-muted/60 rounded-full overflow-hidden flex">
          <div style={{ width: `${returningPct}%` }} className="bg-emerald-500 h-full transition-all" />
          <div style={{ width: `${newPct}%` }} className="bg-purple-500 h-full transition-all" />
        </div>
      </div>

      {/* 2 Column Breakdown */}
      <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
        <div className="p-3.5 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/20 space-y-1">
          <span className="text-[10.5px] text-muted-foreground block font-medium">
            {isBangla ? 'নিয়মিত ক্রেতাদের বিক্রয়' : 'Returning Customer Sales'}
          </span>
          <div className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {formatCurrency(returningSales)}
          </div>
          <span className="text-[10px] text-muted-foreground block">
            {returningCustomerCount} {isBangla ? 'জন নিয়মিত ক্রেতা' : 'repeat buyers'}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-purple-500/[0.04] border border-purple-500/20 space-y-1">
          <span className="text-[10.5px] text-muted-foreground block font-medium">
            {isBangla ? 'নতুন ক্রেতাদের বিক্রয়' : 'New Customer Sales'}
          </span>
          <div className="text-base font-bold font-mono text-purple-600 dark:text-purple-400">
            {formatCurrency(newSales)}
          </div>
          <span className="text-[10px] text-muted-foreground block">
            {newCustomerCount} {isBangla ? 'জন প্রথমবার ক্রেতা' : 'first-time buyers'}
          </span>
        </div>
      </div>
    </div>
  );
}
