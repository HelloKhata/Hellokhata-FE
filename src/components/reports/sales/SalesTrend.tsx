// Hello Khata OS - 03. Sales Trend (Vibrant, Colorful Recharts Experience)
// হ্যালো খাতা - সেলস ট্রেন্ড চার্ট (রঙিন ও প্রাণবন্ত)

'use client';

import React from 'react';
import { useSalesFocus } from './SalesFocusContext';
import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, ArrowUpRight, ArrowDownRight, Activity, TrendingUp } from 'lucide-react';
import { TrendInterval, TrendMetric } from '@/types/sales-report';

export function SalesTrend() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency, formatNumber } = useCurrency();
  const {
    reportData,
    interval,
    setInterval,
    metric,
    setMetric,
    compareWithPrevious,
  } = useSalesFocus();

  const data = reportData.trend;

  const metricConfig: Record<
    TrendMetric,
    { en: string; bn: string; stroke: string; fillStart: string; fillEnd: string; glow: string }
  > = {
    sales: {
      en: 'Net Sales',
      bn: 'নিট বিক্রয়',
      stroke: '#0FBF9F',
      fillStart: '#0FBF9F',
      fillEnd: '#0FBF9F00',
      glow: 'rgba(15, 191, 159, 0.25)',
    },
    orders: {
      en: 'Orders Count',
      bn: 'অর্ডার সংখ্যা',
      stroke: '#6366F1',
      fillStart: '#6366F1',
      fillEnd: '#6366F100',
      glow: 'rgba(99, 102, 241, 0.25)',
    },
    profit: {
      en: 'Gross Profit',
      bn: 'মোট লাভ',
      stroke: '#F59E0B',
      fillStart: '#F59E0B',
      fillEnd: '#F59E0B00',
      glow: 'rgba(245, 158, 11, 0.25)',
    },
  };

  const intervalLabels: Record<TrendInterval, { en: string; bn: string }> = {
    daily: { en: 'Daily', bn: 'দৈনিক' },
    weekly: { en: 'Weekly', bn: 'সাপ্তাহিক' },
    monthly: { en: 'Monthly', bn: 'মাসিক' },
  };

  const currentConfig = metricConfig[metric];

  // Format Y Axis values nicely
  const formatYAxis = (val: number) => {
    if (metric === 'orders') return `${val}`;
    if (val >= 100000) return `৳${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `৳${(val / 1000).toFixed(0)}k`;
    return `৳${val}`;
  };

  return (
    <div className="relative flex flex-col h-full p-5 sm:p-6 bg-gradient-to-br from-card via-card to-indigo-500/[0.03] dark:to-indigo-500/[0.06] rounded-3xl border border-indigo-500/20 dark:border-indigo-500/30 shadow-lg shadow-indigo-500/5 overflow-hidden">
      {/* Decorative Ambient Light */}
      <div className="absolute right-0 top-0 w-48 h-48 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Controls Header */}
      <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
        {/* Metric Selector Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs sm:text-sm font-bold text-foreground border-indigo-500/30 bg-background/80 hover:bg-muted/80 gap-2 shadow-2xs"
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: currentConfig.stroke, boxShadow: `0 0 8px ${currentConfig.stroke}` }}
              />
              <span>{isBangla ? currentConfig.bn : currentConfig.en}</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44 p-1.5 shadow-xl">
            {(['sales', 'orders', 'profit'] as TrendMetric[]).map((m) => {
              const cfg = metricConfig[m];
              return (
                <DropdownMenuItem
                  key={m}
                  onClick={() => setMetric(m)}
                  className={`text-xs cursor-pointer py-1.5 px-2 rounded-md flex items-center gap-2 ${
                    metric === m ? 'bg-primary/10 font-bold text-primary' : ''
                  }`}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.stroke }} />
                  <span>{isBangla ? cfg.bn : cfg.en}</span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Interval Selector: Daily | Weekly | Monthly */}
        <div className="flex items-center bg-muted/80 p-1 rounded-xl border border-border/60 shadow-2xs">
          {(['daily', 'weekly', 'monthly'] as TrendInterval[]).map((int) => (
            <button
              key={int}
              type="button"
              onClick={() => setInterval(int)}
              className={`px-3 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                interval === int
                  ? 'bg-gradient-to-r from-primary to-teal-500 text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/40'
              }`}
            >
              {isBangla ? intervalLabels[int].bn : intervalLabels[int].en}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area with Vivid Multi-Stop Gradient */}
      <div className="w-full h-48 sm:h-56 lg:h-60 min-h-[190px] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 12, left: -14, bottom: 0 }}>
            <defs>
              <linearGradient id="vibrantTrendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={currentConfig.fillStart} stopOpacity={0.35} />
                <stop offset="50%" stopColor={currentConfig.fillStart} stopOpacity={0.12} />
                <stop offset="100%" stopColor={currentConfig.fillStart} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--border)"
              opacity={0.35}
            />

            <XAxis
              dataKey="label"
              tickFormatter={(val, idx) => (isBangla && data[idx]?.labelBn ? data[idx].labelBn : val)}
              stroke="var(--muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={6}
            />

            <YAxis
              tickFormatter={formatYAxis}
              stroke="var(--muted-foreground)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dx={-4}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0].payload;
                  const value = pt[metric];
                  const growth = pt.growthVsPrev || 18.4;
                  const isPositive = growth >= 0;

                  return (
                    <div className="bg-popover/95 backdrop-blur-md border border-border/80 text-popover-foreground p-3 rounded-2xl shadow-2xl text-xs space-y-2 min-w-[165px]">
                      <div className="flex items-center justify-between font-bold text-muted-foreground text-[11px] pb-1 border-b border-border/40">
                        <span>{isBangla && pt.labelBn ? pt.labelBn : pt.label}</span>
                        <span className="text-[10px] text-primary uppercase font-mono">{interval}</span>
                      </div>

                      <div className="pt-0.5">
                        <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                          {isBangla ? currentConfig.bn : currentConfig.en}
                        </div>
                        <div className="text-lg font-extrabold text-foreground font-mono" style={{ color: currentConfig.stroke }}>
                          {metric === 'orders' ? formatNumber(value) : formatCurrency(value)}
                        </div>
                      </div>

                      <div className="text-[11px] text-muted-foreground flex items-center justify-between pt-1.5 border-t border-border/40 font-medium">
                        <span>{formatNumber(pt.orders)} {isBangla ? 'অর্ডার' : 'Orders'}</span>
                        {compareWithPrevious && (
                          <span
                            className={`font-bold inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] ${
                              isPositive
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {isPositive ? (
                              <ArrowUpRight className="h-3 w-3 mr-0.5 stroke-[3]" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 mr-0.5 stroke-[3]" />
                            )}
                            {growth}%
                          </span>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey={metric}
              stroke={currentConfig.stroke}
              strokeWidth={3}
              fill="url(#vibrantTrendGradient)"
              activeDot={{
                r: 6,
                fill: currentConfig.stroke,
                stroke: 'var(--background)',
                strokeWidth: 2.5,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
