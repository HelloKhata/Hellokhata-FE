'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import { CategoryBreakdownItem, CashFlowPointExtended } from '@/types/finance';
import { PieChart as PieIcon, TrendingUp } from 'lucide-react';

interface FinancialChartsSectionProps {
  incomeBreakdown: CategoryBreakdownItem[];
  expenseBreakdown: CategoryBreakdownItem[];
  cashFlowData: CashFlowPointExtended[];
  cashFlowTimeframe: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  onTimeframeChange: (timeframe: 'weekly' | 'monthly' | 'quarterly' | 'yearly') => void;
}

export const FinancialChartsSection: React.FC<FinancialChartsSectionProps> = ({
  incomeBreakdown,
  expenseBreakdown,
  cashFlowData,
  cashFlowTimeframe,
  onTimeframeChange,
}) => {
  const formatCurrency = (val: number) => `৳${(val / 1000).toFixed(0)}k`;
  const formatFullCurrency = (val: number) => `৳${val.toLocaleString('en-BD')}`;

  return (
    <div className="space-y-6">
      {/* Row 1: Income Breakdown & Expense Breakdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Breakdown Card */}
        <Card className="border border-border/60 shadow-2xs bg-card">
          <CardHeader className="p-4 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <PieIcon className="h-4 w-4 text-emerald-500" />
              Income By Category
            </CardTitle>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Total: {formatFullCurrency(incomeBreakdown.reduce((acc, c) => acc + c.amount, 0))}
            </span>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Doughnut Chart */}
              <div className="h-[180px] w-[180px] shrink-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={incomeBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="amount"
                    >
                      {incomeBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(val: number) => [formatFullCurrency(val), 'Income']}
                      contentStyle={{
                        borderRadius: '12px',
                        fontSize: '12px',
                        borderColor: 'rgba(0,0,0,0.1)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend List */}
              <div className="flex-1 space-y-2.5 w-full">
                {incomeBreakdown.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-medium text-foreground truncate">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-bold text-foreground">
                        {formatFullCurrency(item.amount)}
                      </span>
                      <span className="text-[11px] text-muted-foreground w-10 text-right font-mono">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expense Breakdown Card */}
        <Card className="border border-border/60 shadow-2xs bg-card">
          <CardHeader className="p-4 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <PieIcon className="h-4 w-4 text-rose-500" />
              Expense By Category
            </CardTitle>
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
              Total: {formatFullCurrency(expenseBreakdown.reduce((acc, c) => acc + c.amount, 0))}
            </span>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Doughnut Chart */}
              <div className="h-[180px] w-[180px] shrink-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="amount"
                    >
                      {expenseBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(val: number) => [formatFullCurrency(val), 'Expense']}
                      contentStyle={{
                        borderRadius: '12px',
                        fontSize: '12px',
                        borderColor: 'rgba(0,0,0,0.1)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend List */}
              <div className="flex-1 space-y-2 w-full">
                {expenseBreakdown.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-medium text-foreground truncate">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-bold text-foreground">
                        {formatFullCurrency(item.amount)}
                      </span>
                      <span className="text-[11px] text-muted-foreground w-10 text-right font-mono">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Cash Flow Trend Chart */}
      <Card className="border border-border/60 shadow-2xs bg-card">
        <CardHeader className="p-4 pb-2 border-b border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Cash Flow & Net Profit Trend
          </CardTitle>

          {/* Timeframe Toggles */}
          <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border/60 text-xs">
            {(['weekly', 'monthly', 'quarterly', 'yearly'] as const).map((tf) => (
              <Button
                key={tf}
                type="button"
                variant={cashFlowTimeframe === tf ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onTimeframeChange(tf)}
                className="h-7 text-xs capitalize font-medium rounded-lg px-2.5"
              >
                {tf}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-4">
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlowData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="label" stroke="#888888" fontSize={11} tickLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} tickFormatter={formatCurrency} />
                <RechartsTooltip
                  formatter={(val: number, name: string) => [
                    formatFullCurrency(val),
                    name.charAt(0).toUpperCase() + name.slice(1),
                  ]}
                  contentStyle={{
                    borderRadius: '12px',
                    fontSize: '12px',
                    borderColor: 'rgba(0,0,0,0.1)',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#incomeGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  name="Expense"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#expenseGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  name="Net Profit"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#profitGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
