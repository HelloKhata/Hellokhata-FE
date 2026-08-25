// Hello Khata OS - Main Financial Performance Visualization
// হ্যালো খাতা - মূল আর্থিক পারফরম্যান্স চার্ট (রাজস্ব বনাম ব্যয় বনাম নিট লাভ)

'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { useCurrency } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import type { PerformanceTimePoint } from './types';

interface FinancialPerformanceChartProps {
  data: PerformanceTimePoint[];
  timeframe: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  onTimeframeChange: (tf: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly') => void;
  isBangla?: boolean;
}

export function FinancialPerformanceChart({
  data,
  timeframe,
  onTimeframeChange,
  isBangla = false,
}: FinancialPerformanceChartProps) {
  const { formatCurrency } = useCurrency();

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Chart Header & Granularity Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-foreground">
              {isBangla ? 'আর্থিক পারফরম্যান্স পর্যালোচনা' : 'Financial Performance'}
            </h3>
            <span className="text-xs text-muted-foreground font-normal">
              ({isBangla ? 'রাজস্ব, ব্যয় ও নিট মুনাফা' : 'Revenue vs Expenses vs Net Profit'})
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isBangla
              ? 'নির্দিষ্ট সময়কাল অনুযায়ী ব্যবসায়ের আয়-ব্যয় এবং মুনাফার গতিধারা'
              : 'Trends and margin evolution over the selected period'}
          </p>
        </div>

        {/* Timeframe Buttons */}
        <div className="flex items-center bg-muted/40 p-0.5 rounded-xl border border-border/60 self-start sm:self-auto">
          {(['daily', 'weekly', 'monthly', 'quarterly', 'yearly'] as const).map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => onTimeframeChange(tf)}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer',
                timeframe === tf
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {isBangla
                ? tf === 'daily'
                  ? 'দৈনিক'
                  : tf === 'weekly'
                  ? 'সাপ্তাহিক'
                  : tf === 'monthly'
                  ? 'মাসিক'
                  : tf === 'quarterly'
                  ? 'ত্রৈমাসিক'
                  : 'বার্ষিক'
                : tf}
            </button>
          ))}
        </div>
      </div>

      {/* Semantic Legend Strip */}
      <div className="flex items-center gap-5 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="font-medium text-foreground">{isBangla ? 'রাজস্ব (Revenue)' : 'Revenue'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400 dark:bg-rose-500" />
          <span className="font-medium text-foreground">{isBangla ? 'ব্যয় (Expenses)' : 'Expenses'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
          <span className="font-medium text-foreground">{isBangla ? 'নিট লাভ (Net Profit)' : 'Net Profit'}</span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-[280px] sm:h-[320px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="profitAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.6} />

            <XAxis
              dataKey="period"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 11, fontWeight: 500 }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
              tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const rev = Number(payload.find((p) => p.dataKey === 'revenue')?.value) || 0;
                  const exp = Number(payload.find((p) => p.dataKey === 'expenses')?.value) || 0;
                  const profit = Number(payload.find((p) => p.dataKey === 'netProfit')?.value) || 0;
                  const margin = rev > 0 ? ((profit / rev) * 100).toFixed(1) : '0';

                  return (
                    <div className="bg-card/95 backdrop-blur-md border border-border p-3 rounded-2xl shadow-xl text-xs space-y-2 min-w-[190px]">
                      <div className="font-bold text-foreground border-b border-border/60 pb-1 flex justify-between items-center">
                        <span>{label}</span>
                        <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded font-bold">
                          {margin}% Margin
                        </span>
                      </div>

                      <div className="space-y-1 font-mono">
                        <div className="flex justify-between items-center text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Revenue:
                          </span>
                          <span className="font-bold text-foreground">৳{rev.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="flex justify-between items-center text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-500" />
                            Expenses:
                          </span>
                          <span className="font-bold text-foreground">৳{exp.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="flex justify-between items-center pt-1 border-t border-border/60 text-foreground font-bold">
                          <span className="flex items-center gap-1.5 text-indigo-500">
                            <span className="w-2 h-2 rounded-full bg-indigo-500" />
                            Net Profit:
                          </span>
                          <span className="text-emerald-600 dark:text-emerald-400">৳{profit.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Net Profit Area Fill */}
            <Area
              type="monotone"
              dataKey="netProfit"
              fill="url(#profitAreaGrad)"
              stroke="#6366f1"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: '#6366f1', stroke: 'var(--card)', strokeWidth: 2 }}
            />

            {/* Revenue Line */}
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#10b981', stroke: 'var(--card)', strokeWidth: 2 }}
            />

            {/* Expenses Line */}
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#f43f5e"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              activeDot={{ r: 4, fill: '#f43f5e', stroke: 'var(--card)', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
