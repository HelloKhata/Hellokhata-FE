// Hello Khata OS - Customer Sales Trend Chart (Primary Analytical Visualization)
// হ্যালো খাতা - গ্রাহক বিক্রয় প্রবণতা চার্ট

'use client';

import React from 'react';
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
import { useCurrency } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import type { CustomerSalesTrendPoint } from './types';

interface CustomerSalesTrendChartProps {
  data: CustomerSalesTrendPoint[];
  timeframe: 'daily' | 'weekly' | 'monthly';
  onTimeframeChange: (tf: 'daily' | 'weekly' | 'monthly') => void;
  isBangla?: boolean;
}

export function CustomerSalesTrendChart({
  data,
  timeframe,
  onTimeframeChange,
  isBangla = false,
}: CustomerSalesTrendChartProps) {
  const { formatCurrency } = useCurrency();

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Header & Granularity Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-foreground">
              {isBangla ? 'গ্রাহক বিক্রয়ের গতিধারা' : 'Customer Sales Trend'}
            </h3>
            <span className="text-xs text-muted-foreground font-normal">
              ({isBangla ? 'বর্তমান বনাম পূর্ববর্তী সময়কাল' : 'Current vs Previous Period'})
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isBangla
              ? 'গ্রাহকদের কেনাকাটার আয়তন এবং সময়ের সাথে বৃদ্ধির গতি'
              : 'How customer-generated sales changed over time'}
          </p>
        </div>

        {/* Timeframe Buttons */}
        <div className="flex items-center bg-muted/40 p-0.5 rounded-xl border border-border/60 self-start sm:self-auto">
          {(['daily', 'weekly', 'monthly'] as const).map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => onTimeframeChange(tf)}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer',
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
                  : 'মাসিক'
                : tf}
            </button>
          ))}
        </div>
      </div>

      {/* Semantic Legend Strip */}
      <div className="flex items-center gap-5 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="font-medium text-foreground">{isBangla ? 'চলতি সময়কালের বিক্রয়' : 'Current Period Sales'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-0.5 bg-muted-foreground border-t-2 border-dashed border-muted-foreground" />
          <span className="font-medium text-muted-foreground">{isBangla ? 'পূর্ববর্তী সময়কাল' : 'Previous Period'}</span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-[280px] sm:h-[300px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="customerSalesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
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
                  const current = Number(payload.find((p) => p.dataKey === 'currentSales')?.value) || 0;
                  const prev = Number(payload.find((p) => p.dataKey === 'previousSales')?.value) || 0;
                  const orders = Number(payload[0]?.payload?.orders) || 0;
                  const growth = prev > 0 ? (((current - prev) / prev) * 100).toFixed(1) : '+100';

                  return (
                    <div className="bg-card/95 backdrop-blur-md border border-border p-3 rounded-2xl shadow-xl text-xs space-y-2 min-w-[190px]">
                      <div className="font-bold text-foreground border-b border-border/60 pb-1 flex justify-between items-center">
                        <span>{label}</span>
                        <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded font-bold">
                          {Number(growth) >= 0 ? `+${growth}%` : `${growth}%`}
                        </span>
                      </div>

                      <div className="space-y-1 font-mono">
                        <div className="flex justify-between items-center text-foreground font-bold">
                          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Current Sales:
                          </span>
                          <span>৳{current.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="flex justify-between items-center text-muted-foreground">
                          <span>Previous Period:</span>
                          <span>৳{prev.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="flex justify-between items-center pt-1 border-t border-border/60 text-[11px] text-muted-foreground font-sans">
                          <span>Orders Completed:</span>
                          <span className="font-bold text-foreground font-mono">{orders}</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Current Period Area */}
            <Area
              type="monotone"
              dataKey="currentSales"
              fill="url(#customerSalesGrad)"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: '#10b981', stroke: 'var(--card)', strokeWidth: 2 }}
            />

            {/* Previous Period Line */}
            <Line
              type="monotone"
              dataKey="previousSales"
              stroke="var(--muted-foreground)"
              strokeWidth={1.75}
              strokeDasharray="4 4"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
