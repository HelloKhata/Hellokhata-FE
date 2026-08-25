// Hello Khata OS - Sales Breakdown Drawer (Progressive Disclosure)
// হ্যালো খাতা - বিক্রয় বিশদ বিবরণী ড্রয়ার

'use client';

import React from 'react';
import { useSalesFocus } from './SalesFocusContext';
import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { ArrowDown, ArrowRight, Minus, Percent } from 'lucide-react';

export function SalesBreakdownDrawer() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency, formatPercent } = useCurrency();
  const { breakdownDrawerOpen, setBreakdownDrawerOpen, reportData, focus } = useSalesFocus();
  const { summary } = reportData;

  const grossSales = summary.grossSales;
  const discounts = summary.discounts;
  const returns = summary.returns;
  const netSales = summary.netSales;

  const discountPercent = grossSales > 0 ? (discounts / grossSales) * 100 : 0;
  const returnsPercent = grossSales > 0 ? (returns / grossSales) * 100 : 0;

  return (
    <Sheet open={breakdownDrawerOpen} onOpenChange={setBreakdownDrawerOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md p-6 overflow-y-auto">
        <SheetHeader className="space-y-1 text-left pb-4 border-b border-border/50">
          <SheetTitle className="text-lg font-bold text-foreground">
            {isBangla ? 'বিক্রয় ব্রেকডাউন বিবরণী' : 'Sales Breakdown'}
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            {focus
              ? isBangla
                ? `নির্বাচিত আইটেম (${focus.name}) এর হিসাব বিবরণী`
                : `Accounting waterfall for ${focus.name}`
              : isBangla
              ? 'গ্রস বিক্রয় থেকে নিট বিক্রয়ের হিসাব প্রবাহ'
              : 'Progressive revenue breakdown from gross to net sales'}
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Waterfall Calculation Cards */}
          <div className="space-y-3 font-mono">
            {/* 1. Gross Sales */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/40 border border-border/50">
              <div>
                <div className="text-xs font-semibold text-foreground font-sans">
                  {isBangla ? 'গ্রস বিক্রয়' : 'Gross Sales'}
                </div>
                <div className="text-[10px] text-muted-foreground font-sans">
                  {isBangla ? 'সর্বমোট চালান মূল্য' : 'Total invoiced value before deductions'}
                </div>
              </div>
              <div className="text-sm font-bold text-foreground">
                {formatCurrency(grossSales)}
              </div>
            </div>

            {/* 2. Discounts */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/15">
              <div>
                <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 font-sans flex items-center gap-1">
                  <Minus className="h-3 w-3" />
                  <span>{isBangla ? 'ছাড় ও ডিসকাউন্ট' : 'Discounts'}</span>
                </div>
                <div className="text-[10px] text-muted-foreground font-sans">
                  {formatPercent(discountPercent)} {isBangla ? 'গ্রস বিক্রয়ের' : 'of gross sales'}
                </div>
              </div>
              <div className="text-sm font-bold text-rose-600 dark:text-rose-400">
                −{formatCurrency(discounts)}
              </div>
            </div>

            {/* 3. Returns */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/15">
              <div>
                <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 font-sans flex items-center gap-1">
                  <Minus className="h-3 w-3" />
                  <span>{isBangla ? 'পণ্য ফেরত (রিটার্ন)' : 'Returns & Refunds'}</span>
                </div>
                <div className="text-[10px] text-muted-foreground font-sans">
                  {formatPercent(returnsPercent)} {isBangla ? 'গ্রস বিক্রয়ের' : 'of gross sales'}
                </div>
              </div>
              <div className="text-sm font-bold text-rose-600 dark:text-rose-400">
                −{formatCurrency(returns)}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-dashed border-border/80 my-2" />

            {/* 4. Net Sales Final Total */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-primary/10 border border-primary/30">
              <div>
                <div className="text-sm font-bold text-primary font-sans">
                  {isBangla ? 'নিট বিক্রয়' : 'Net Sales'}
                </div>
                <div className="text-[10px] text-muted-foreground font-sans">
                  {isBangla ? 'কার্যকর অর্জিত আয়' : 'Actual realized revenue'}
                </div>
              </div>
              <div className="text-lg font-extrabold text-foreground">
                {formatCurrency(netSales)}
              </div>
            </div>
          </div>

          {/* Additional Margin Context */}
          {summary.grossProfit && (
            <div className="p-4 rounded-xl border border-border/60 bg-card space-y-2">
              <div className="text-xs font-semibold text-foreground">
                {isBangla ? 'মুনাফা মার্জিন সারাংশ' : 'Profit Margin Context'}
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-muted-foreground">{isBangla ? 'মোট লাভ (Gross Profit):' : 'Gross Profit:'}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(summary.grossProfit)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-muted-foreground">{isBangla ? 'মার্জিন হার:' : 'Gross Margin:'}</span>
                <span className="font-bold text-foreground">
                  {summary.grossMarginPercentage}%
                </span>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
