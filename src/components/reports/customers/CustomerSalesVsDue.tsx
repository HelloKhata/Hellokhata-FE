// Hello Khata OS - Customer Sales vs Outstanding Receivables Section
// হ্যালো খাতা - মোট বিক্রয় বনাম অনাদায়ী বকেয়া বিশ্লেষণ

'use client';

import React from 'react';
import Link from 'next/link';
import {
  CreditCard,
  Receipt,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { useCurrency } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';

interface CustomerSalesVsDueProps {
  totalSales: number;
  totalPaid: number;
  totalDue: number;
  overdueDue: number;
  isBangla?: boolean;
}

export function CustomerSalesVsDue({
  totalSales,
  totalPaid,
  totalDue,
  overdueDue,
  isBangla = false,
}: CustomerSalesVsDueProps) {
  const { formatCurrency } = useCurrency();

  const paidRatio = totalSales > 0 ? Math.round((totalPaid / totalSales) * 100) : 82;
  const dueRatio = totalSales > 0 ? Math.round((totalDue / totalSales) * 100) : 18;

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div>
          <h3 className="text-sm font-bold text-foreground">
            {isBangla ? 'বিক্রয় বনাম বকেয়ার ভারসাম্য' : 'Sales vs Receivables Exposure'}
          </h3>
          <p className="text-[11px] text-muted-foreground">
            {isBangla ? 'নগদ আদায় এবং অনাদায়ী বাকি টাকার তুলনা' : 'Cash collected vs unpaid customer credit'}
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

      {/* Progress & Ratio Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {isBangla ? 'নগদ আদায়' : 'Collected'}: {formatCurrency(totalPaid)} ({paidRatio}%)
          </span>

          <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            {isBangla ? 'অনাদায়ী বকেয়া' : 'Outstanding'}: {formatCurrency(totalDue)} ({dueRatio}%)
          </span>
        </div>

        {/* 2-Segment Strip */}
        <div className="h-3 w-full bg-muted/60 rounded-full overflow-hidden flex">
          <div style={{ width: `${paidRatio}%` }} className="bg-emerald-500 h-full transition-all" />
          <div style={{ width: `${dueRatio}%` }} className="bg-amber-500 h-full transition-all" />
        </div>
      </div>

      {/* 3 Metric Mini Cards */}
      <div className="grid grid-cols-3 gap-2.5 text-xs pt-1">
        <div className="p-3 rounded-xl bg-muted/20 border border-border/50 space-y-0.5">
          <span className="text-[10px] text-muted-foreground block">{isBangla ? 'মোট ইনভয়েস মূল্য' : 'Total Invoiced'}</span>
          <span className="text-sm sm:text-base font-bold font-mono text-foreground">{formatCurrency(totalSales)}</span>
        </div>

        <div className="p-3 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/20 space-y-0.5">
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-medium">{isBangla ? 'পরিশোধিত অর্থ' : 'Settled In Cash'}</span>
          <span className="text-sm sm:text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">{formatCurrency(totalPaid)}</span>
        </div>

        <div className="p-3 rounded-xl bg-amber-500/[0.04] border border-amber-500/20 space-y-0.5">
          <span className="text-[10px] text-amber-600 dark:text-amber-400 block font-medium">{isBangla ? 'চলতি বাকি' : 'Current Due'}</span>
          <span className="text-sm sm:text-base font-bold font-mono text-amber-600 dark:text-amber-400">{formatCurrency(totalDue)}</span>
        </div>
      </div>

      {/* Data-Driven Callout */}
      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/30 border border-border/50 text-[11px] text-muted-foreground">
        <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span>
          {isBangla
            ? `বকেয়ার হার ${dueRatio}%, যার মধ্যে ${formatCurrency(overdueDue)} দীর্ঘমেয়াদী ঝুঁকিপূর্ণ।`
            : `Receivables represent ${dueRatio}% of sales, with ${formatCurrency(overdueDue)} aged beyond 60 days.`}
        </span>
      </div>
    </div>
  );
}
