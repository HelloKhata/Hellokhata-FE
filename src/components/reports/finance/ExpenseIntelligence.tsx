// Hello Khata OS - Expense Intelligence ("Where is the money going?")
// হ্যালো খাতা - ব্যয় বিশ্লেষণ ও শীর্ষ ব্যয়ের খাতসমূহ

'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingDown,
  TrendingUp,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  ReceiptText,
} from 'lucide-react';
import { useCurrency } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import type { ExpenseCategoryItem } from './types';

interface ExpenseIntelligenceProps {
  categories: ExpenseCategoryItem[];
  totalExpenses: number;
  isBangla?: boolean;
}

export function ExpenseIntelligence({
  categories,
  totalExpenses,
  isBangla = false,
}: ExpenseIntelligenceProps) {
  const { formatCurrency } = useCurrency();

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <ReceiptText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              {isBangla ? 'ব্যয় বিশ্লেষণ (Where is the money going?)' : 'Where is the money going?'}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {isBangla ? 'সর্বোচ্চ ব্যয়ের খাতসমূহের তালিকা ও শতকরা অনুপাত' : 'Ranked operational expense breakdown'}
            </p>
          </div>
        </div>

        <Link
          href="/finance/expenses"
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
        >
          <span>{isBangla ? 'ব্যয় রিপোর্ট' : 'View Expense Report'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Horizontal Ranking List */}
      <div className="space-y-3 pt-1 text-xs">
        {categories.map((cat, idx) => (
          <div key={idx} className="space-y-1.5 group">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-mono text-muted-foreground text-[10px] w-3">{idx + 1}.</span>
                <span className="font-semibold text-foreground truncate">
                  {isBangla && cat.categoryBn ? cat.categoryBn : cat.category}
                </span>
                <span className="text-[10.5px] font-mono text-muted-foreground">
                  ({cat.percentage}%)
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0 font-mono">
                <span className="font-bold text-foreground">{formatCurrency(cat.amount)}</span>
                <span
                  className={cn(
                    'text-[10px] inline-flex items-center font-semibold',
                    cat.changePct > 0 ? 'text-rose-500' : 'text-emerald-600'
                  )}
                >
                  {cat.changePct > 0 ? '+' : ''}{cat.changePct}%
                </span>
              </div>
            </div>

            {/* Horizontal Bar */}
            <div className="h-1.5 w-full bg-muted/60 rounded-full overflow-hidden">
              <div
                style={{ width: `${cat.percentage}%` }}
                className={cn(
                  'h-full rounded-full transition-all duration-300',
                  idx === 0
                    ? 'bg-rose-500'
                    : idx === 1
                    ? 'bg-amber-500'
                    : idx === 2
                    ? 'bg-blue-500'
                    : 'bg-muted-foreground/60'
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
