// Hello Khata OS - Customer Executive Snapshot (Minimal Unified Metrics Strip)
// হ্যালো খাতা - গ্রাহক মূল মেট্রিক্স স্ট্রিপ

'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useCurrency } from '@/hooks/useAppTranslation';
import type { CustomerExecutiveKpis } from './types';

interface CustomerExecutiveSnapshotProps {
  metrics: CustomerExecutiveKpis;
  isBangla?: boolean;
}

export function CustomerExecutiveSnapshot({
  metrics,
  isBangla = false,
}: CustomerExecutiveSnapshotProps) {
  const { formatCurrency } = useCurrency();

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-4 sm:p-5 shadow-xs">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 divide-y md:divide-y-0 md:divide-x divide-border/60">
        {/* 1. Customer Sales */}
        <div className="space-y-1 md:pr-4">
          <span className="text-xs text-muted-foreground font-medium block">
            {isBangla ? 'গ্রাহক মোট বিক্রয়' : 'Total Customer Sales'}
          </span>
          <div className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-foreground">
            {formatCurrency(metrics.customerSales)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
            <ArrowUpRight className="w-3 h-3" />
            <span>+{metrics.customerSalesChange}%</span>
            <span className="text-muted-foreground font-sans font-normal text-[10.5px]">
              {isBangla ? 'বৃদ্ধি' : 'vs last period'}
            </span>
          </div>
        </div>

        {/* 2. Outstanding Due */}
        <div className="space-y-1 md:px-4 pt-3 md:pt-0">
          <span className="text-xs text-muted-foreground font-medium block">
            {isBangla ? 'মোট অনাদায়ী বাকি' : 'Outstanding Dues'}
          </span>
          <div className="text-lg sm:text-xl font-bold font-mono text-amber-600 dark:text-amber-400">
            {formatCurrency(metrics.outstandingReceivables)}
          </div>
          <span className="text-[10.5px] text-muted-foreground block">
            {metrics.receivablesRatio}% {isBangla ? 'বিক্রয়ের অনুপাত' : 'of total sales'}
          </span>
        </div>

        {/* 3. Total Customers */}
        <div className="space-y-1 md:px-4 pt-3 md:pt-0">
          <span className="text-xs text-muted-foreground font-medium block">
            {isBangla ? 'নিবন্ধিত গ্রাহক' : 'Total Customers'}
          </span>
          <div className="text-lg sm:text-xl font-bold font-mono text-foreground">
            {metrics.totalCustomers.toLocaleString()}
          </div>
          <span className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold block">
            +{metrics.newCustomers} {isBangla ? 'নতুন যোগ হয়েছে' : 'new acquired'}
          </span>
        </div>

        {/* 4. Active Buyers */}
        <div className="space-y-1 md:px-4 pt-3 md:pt-0">
          <span className="text-xs text-muted-foreground font-medium block">
            {isBangla ? 'চলতি মাসে সক্রিয়' : 'Active Buyers (30d)'}
          </span>
          <div className="text-lg sm:text-xl font-bold font-mono text-foreground">
            {metrics.activeCustomers.toLocaleString()}
          </div>
          <span className="text-[10.5px] text-muted-foreground font-mono block">
            {metrics.activeRate}% {isBangla ? 'সক্রিয়তার হার' : 'active rate'}
          </span>
        </div>

        {/* 5. Average Customer Value (ACV) */}
        <div className="space-y-1 md:pl-4 pt-3 md:pt-0 col-span-2 md:col-span-1">
          <span className="text-xs text-muted-foreground font-medium block">
            {isBangla ? 'গড় গ্রাহক মূল্য (ACV)' : 'Avg Customer Value'}
          </span>
          <div className="text-lg sm:text-xl font-bold font-mono text-foreground">
            {formatCurrency(metrics.averageCustomerValue)}
          </div>
          <span className="text-[10.5px] text-muted-foreground block">
            {isBangla ? 'সক্রিয় ক্রেতা প্রতি' : 'per active customer'}
          </span>
        </div>
      </div>
    </div>
  );
}
