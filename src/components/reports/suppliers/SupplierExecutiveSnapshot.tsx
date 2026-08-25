// Hello Khata OS - Supplier Executive Snapshot (5 Restrained Core Metrics)
// হ্যালো খাতা - সরবরাহকারী মূল মেট্রিক্স স্ট্রিপ

'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useCurrency } from '@/hooks/useAppTranslation';
import type { SupplierExecutiveKpis } from './types';

interface SupplierExecutiveSnapshotProps {
  metrics: SupplierExecutiveKpis;
  isBangla?: boolean;
}

export function SupplierExecutiveSnapshot({
  metrics,
  isBangla = false,
}: SupplierExecutiveSnapshotProps) {
  const { formatCurrency } = useCurrency();

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-4 sm:p-5 shadow-xs">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 divide-y md:divide-y-0 md:divide-x divide-border/60">
        {/* 1. Total Purchases */}
        <div className="space-y-1 md:pr-4">
          <span className="text-xs text-muted-foreground font-medium block">
            {isBangla ? 'মোট ইনভেন্টরি ক্রয়' : 'Total Purchases (COGS)'}
          </span>
          <div className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-foreground">
            {formatCurrency(metrics.totalPurchases)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
            <ArrowUpRight className="w-3 h-3" />
            <span>+{metrics.purchasesChange}%</span>
            <span className="text-muted-foreground font-sans font-normal text-[10.5px]">
              {isBangla ? 'বৃদ্ধি' : 'vs last period'}
            </span>
          </div>
        </div>

        {/* 2. Accounts Payable (Dues) */}
        <div className="space-y-1 md:px-4 pt-3 md:pt-0">
          <span className="text-xs text-muted-foreground font-medium block">
            {isBangla ? 'প্রদেয় বাকি (Payables)' : 'Accounts Payable (Dues)'}
          </span>
          <div className="text-lg sm:text-xl font-bold font-mono text-rose-600 dark:text-rose-400">
            {formatCurrency(metrics.accountsPayable)}
          </div>
          <span className="text-[10.5px] text-muted-foreground block">
            {metrics.payableRatio}% {isBangla ? 'ক্রয়ের অনুপাত' : 'of total purchases'}
          </span>
        </div>

        {/* 3. Total Suppliers */}
        <div className="space-y-1 md:px-4 pt-3 md:pt-0">
          <span className="text-xs text-muted-foreground font-medium block">
            {isBangla ? 'তালিকাভুক্ত ভেন্ডর' : 'Active Suppliers'}
          </span>
          <div className="text-lg sm:text-xl font-bold font-mono text-foreground">
            {metrics.totalSuppliers}
          </div>
          <span className="text-[10.5px] text-indigo-600 dark:text-indigo-400 font-mono font-semibold block">
            +{metrics.newSuppliers} {isBangla ? 'নতুন যোগ হয়েছে' : 'new this month'}
          </span>
        </div>

        {/* 4. Purchase Invoices */}
        <div className="space-y-1 md:px-4 pt-3 md:pt-0">
          <span className="text-xs text-muted-foreground font-medium block">
            {isBangla ? 'বিল ও চালান সংখ্যা' : 'Purchase Invoices (GRN)'}
          </span>
          <div className="text-lg sm:text-xl font-bold font-mono text-foreground">
            {metrics.totalInvoices}
          </div>
          <span className="text-[10.5px] text-muted-foreground font-mono block">
            {isBangla ? 'গৃহীত চালান' : 'bills fulfilled'}
          </span>
        </div>

        {/* 5. Average Invoice Value */}
        <div className="space-y-1 md:pl-4 pt-3 md:pt-0 col-span-2 md:col-span-1">
          <span className="text-xs text-muted-foreground font-medium block">
            {isBangla ? 'গড় চালান মূল্য' : 'Avg Invoice Value'}
          </span>
          <div className="text-lg sm:text-xl font-bold font-mono text-foreground">
            {formatCurrency(metrics.averageBillValue)}
          </div>
          <span className="text-[10.5px] text-muted-foreground block">
            {isBangla ? 'চালান প্রতি গড় ক্রয়' : 'per purchase order'}
          </span>
        </div>
      </div>
    </div>
  );
}
