// Hello Khata OS - 02. The Sales Summary (Vibrant, Colorful & Premium)
// হ্যালো খাতা - সেলস সামারি (কালারফুল ও প্রাণবন্ত)

'use client';

import React, { useState } from 'react';
import { useSalesFocus } from './SalesFocusContext';
import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import {
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  ChevronUp,
  Minus,
  Sparkles,
  TrendingUp,
  ShoppingBag,
  CreditCard,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function SalesSummary() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency, formatNumber, formatPercent } = useCurrency();
  const { reportData, compareWithPrevious, focus } = useSalesFocus();
  const { summary } = reportData;

  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);
  const isGrowthPositive = summary.growthPercentage >= 0;

  const grossSales = summary.grossSales;
  const discounts = summary.discounts;
  const returns = summary.returns;
  const netSales = summary.netSales;

  return (
    <div className="relative flex flex-col justify-between h-full p-6 bg-gradient-to-br from-card via-card to-emerald-500/[0.04] dark:to-emerald-500/[0.08] rounded-3xl border border-emerald-500/20 dark:border-emerald-500/30 shadow-lg shadow-emerald-500/5 overflow-hidden transition-all group">
      {/* Decorative Vibrant Ambient Glow Circles */}
      <div className="absolute -right-12 -top-12 w-40 h-40 bg-emerald-500/15 dark:bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-36 h-36 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Line: Scope Badge & Inline Breakdown Toggle */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-sm shadow-emerald-500/30">
            <Zap className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            {focus
              ? isBangla
                ? 'নির্বাচিত আইটেমের নিট বিক্রয়'
                : 'Focused Net Sales'
              : isBangla
              ? 'মোট নিট বিক্রয়'
              : 'Net Sales Revenue'}
          </span>
        </div>

        {/* Inline Progressive Disclosure Toggle */}
        <button
          type="button"
          onClick={() => setIsBreakdownOpen(!isBreakdownOpen)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all py-1 px-2.5 rounded-full cursor-pointer shadow-2xs"
        >
          <span>{isBreakdownOpen ? (isBangla ? 'ব্রেকডাউন লুকান' : 'Hide waterfall') : (isBangla ? 'ব্রেকডাউন দেখুন' : 'View waterfall')}</span>
          {isBreakdownOpen ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* Primary Hero Net Sales Anchor with Gradient Typography */}
      <div className="my-auto py-4 relative z-10">
        <div className="text-3xl sm:text-4xl lg:text-[46px] font-black tracking-tight font-mono leading-none bg-gradient-to-r from-foreground via-foreground to-emerald-600 dark:to-emerald-400 bg-clip-text text-transparent">
          {formatCurrency(summary.netSales)}
        </div>

        {/* Growth vs previous period */}
        {compareWithPrevious && (
          <div className="flex items-center gap-2 mt-3">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold shadow-xs ${
                isGrowthPositive
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
              }`}
            >
              {isGrowthPositive ? (
                <ArrowUpRight className="h-3.5 w-3.5 mr-0.5 stroke-[3]" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5 mr-0.5 stroke-[3]" />
              )}
              {formatPercent(summary.growthPercentage)}
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              {isBangla ? 'পূর্ববর্তী সময়ের তুলনায় প্রবৃদ্ধি' : 'growth vs previous period'}
            </span>
          </div>
        )}
      </div>

      {/* Inline Expandable Waterfall Breakdown (Vibrant Color Flow) */}
      <AnimatePresence>
        {isBreakdownOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden mb-4 pt-2 relative z-10"
          >
            <div className="space-y-2 bg-background/80 backdrop-blur-sm p-3.5 rounded-2xl border border-emerald-500/20 text-xs font-mono shadow-inner">
              {/* Gross Sales */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300">
                <span className="font-sans font-semibold">{isBangla ? 'গ্রস বিক্রয় (Gross Sales):' : 'Gross Sales:'}</span>
                <span className="font-bold">{formatCurrency(grossSales)}</span>
              </div>

              {/* Discounts */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300">
                <span className="font-sans font-medium flex items-center gap-1">
                  <Minus className="h-3 w-3" />
                  <span>{isBangla ? 'ছাড় (Discounts):' : 'Discounts:'}</span>
                </span>
                <span className="font-bold">−{formatCurrency(discounts)}</span>
              </div>

              {/* Returns */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300">
                <span className="font-sans font-medium flex items-center gap-1">
                  <Minus className="h-3 w-3" />
                  <span>{isBangla ? 'পণ্য ফেরত (Returns):' : 'Returns & Refunds:'}</span>
                </span>
                <span className="font-bold">−{formatCurrency(returns)}</span>
              </div>

              {/* Net Result */}
              <div className="pt-2 border-t border-emerald-500/30 flex items-center justify-between text-sm font-bold text-emerald-600 dark:text-emerald-400">
                <span className="font-sans">{isBangla ? 'নিট প্রাপ্তি (Net Sales):' : 'Net Realized:'}</span>
                <span className="font-mono text-base">{formatCurrency(netSales)}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Secondary Metrics: Orders & Average Order Value with Colorful Mini Badges */}
      <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-4 text-xs sm:text-sm relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <ShoppingBag className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="font-bold text-foreground font-mono leading-none">{formatNumber(summary.ordersCount)}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{isBangla ? 'মোট অর্ডার' : 'Total Orders'}</div>
          </div>
        </div>

        <div className="h-7 w-[1px] bg-border/80" />

        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <CreditCard className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="font-bold text-foreground font-mono leading-none">{formatCurrency(summary.averageOrderValue)}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{isBangla ? 'গড় অর্ডার মান' : 'Avg. Order Value'}</div>
          </div>
        </div>

        <div className="h-7 w-[1px] bg-border/80 hidden sm:block" />

        <div className="hidden sm:flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <TrendingUp className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="font-bold text-foreground font-mono leading-none">21.0%</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{isBangla ? 'গ্রস মার্জিন' : 'Gross Margin'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
