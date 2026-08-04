'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DashboardKpiCard } from '@/hooks/useFinancialDashboard';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Building2,
  Receipt,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FinancialKpiGridProps {
  kpis: Record<string, DashboardKpiCard>;
}

// Micro SVG Sparkline Renderer
const SparklineSvg = ({ points, isPositive }: { points: number[]; isPositive: boolean }) => {
  if (!points || points.length < 2) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const width = 64;
  const height = 24;

  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - ((p - min) / range) * (height - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const colorClass = isPositive
    ? 'stroke-emerald-500 dark:stroke-emerald-400'
    : 'stroke-rose-500 dark:stroke-rose-400';

  return (
    <svg width={width} height={height} className="overflow-visible shrink-0">
      <polyline
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={colorClass}
        points={coords.join(' ')}
      />
    </svg>
  );
};

export const FinancialKpiGrid: React.FC<FinancialKpiGridProps> = ({ kpis }) => {
  const formatCurrency = (val: number) => `৳${val.toLocaleString('en-BD')}`;

  const kpiList = [
    {
      data: kpis.totalIncome,
      icon: TrendingUp,
      iconColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40',
      isPositive: true,
    },
    {
      data: kpis.totalExpenses,
      icon: TrendingDown,
      iconColor: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/40',
      isPositive: false,
    },
    {
      data: kpis.netProfit,
      icon: CheckCircle2,
      iconColor: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/40',
      isPositive: true,
    },
    {
      data: kpis.totalReceivable,
      icon: Receipt,
      iconColor: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40',
      isPositive: false,
    },
    {
      data: kpis.totalPayable,
      icon: CreditCard,
      iconColor: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/40',
      isPositive: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {kpiList.map((item, idx) => {
        if (!item.data) return null;
        const card = item.data;
        const Icon = item.icon;
        const isUp = card.changePercentage >= 0;

        return (
          <Card
            key={card.id || idx}
            className="border border-border/60 shadow-2xs hover:border-border transition-all bg-card flex flex-col justify-between"
          >
            <CardContent className="p-3.5 space-y-2">
              {/* Header Icon & Title */}
              <div className="flex items-center justify-between gap-1">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider truncate">
                  {card.title}
                </p>
                <div className={`p-1.5 rounded-lg border shrink-0 ${item.iconColor}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Main Value */}
              <div className="space-y-0.5">
                <h3 className="text-base font-bold tracking-tight text-foreground truncate">
                  {formatCurrency(card.value)}
                </h3>
                {card.categoryDetail && (
                  <p className="text-[10px] text-muted-foreground truncate">
                    {card.categoryDetail}
                  </p>
                )}
              </div>

              {/* Sparkline & Comparison Footer */}
              <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {isUp ? (
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40 text-[10px] px-1 py-0 font-medium gap-0.5"
                    >
                      <ArrowUpRight className="h-3 w-3" />
                      +{card.changePercentage}%
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/40 text-[10px] px-1 py-0 font-medium gap-0.5"
                    >
                      <ArrowDownRight className="h-3 w-3" />
                      {card.changePercentage}%
                    </Badge>
                  )}
                </div>
                <SparklineSvg points={card.sparkline} isPositive={isUp} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
