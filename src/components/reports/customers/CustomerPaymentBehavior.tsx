// Hello Khata OS - Customer Payment Behavior & Channel Breakdown
// হ্যালো খাতা - গ্রাহক পেমেন্ট আচরণ ও মাধ্যম বিশ্লেষণ

'use client';

import React from 'react';
import {
  Wallet,
  Coins,
  Landmark,
  CreditCard,
  Banknote,
  Receipt,
} from 'lucide-react';
import { useCurrency } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';

interface CustomerPaymentBehaviorProps {
  channels: {
    id: string;
    name: string;
    nameBn: string;
    amount: number;
    percentage: number;
    icon: React.ElementType;
    color: string;
    bg: string;
  }[];
  isBangla?: boolean;
}

export function CustomerPaymentBehavior({
  channels,
  isBangla = false,
}: CustomerPaymentBehaviorProps) {
  const { formatCurrency } = useCurrency();

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              {isBangla ? 'পেমেন্ট মাধ্যম বিশ্লেষণ' : 'Payment Behavior'}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {isBangla ? 'নগদ, বিকাশ/নগদ, ব্যাংক ও কার্ড পেমেন্ট অনুপাত' : 'Disbursement channel distribution'}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Strip */}
      <div className="space-y-1.5">
        <div className="h-2.5 w-full bg-muted/60 rounded-full overflow-hidden flex">
          {channels.map((ch, i) => (
            <div
              key={ch.id}
              style={{ width: `${ch.percentage}%` }}
              className={cn(
                'h-full transition-all',
                i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-pink-500' : i === 2 ? 'bg-blue-500' : 'bg-purple-500'
              )}
              title={`${ch.name}: ${formatCurrency(ch.amount)} (${ch.percentage}%)`}
            />
          ))}
        </div>
      </div>

      {/* 4 Channel Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
        {channels.map((ch, i) => {
          const Icon = ch.icon;
          return (
            <div key={ch.id} className="p-3 rounded-xl bg-muted/15 border border-border/60 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-foreground flex items-center gap-1.5 truncate">
                  <span
                    className={cn(
                      'w-1.5 h-1.5 rounded-full shrink-0',
                      i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-pink-500' : i === 2 ? 'bg-blue-500' : 'bg-purple-500'
                    )}
                  />
                  {isBangla ? ch.nameBn : ch.name}
                </span>
                <span className="font-mono text-[10px] font-bold text-muted-foreground">{ch.percentage}%</span>
              </div>

              <div className="pt-0.5">
                <span className="text-sm font-bold font-mono text-foreground block">{formatCurrency(ch.amount)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
