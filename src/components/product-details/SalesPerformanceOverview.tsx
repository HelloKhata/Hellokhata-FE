"use client";

import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  TrendingUp,
  Package,
  CircleDollarSign,
  PieChart,
  Calendar,
  Award,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export type SalesPeriod = "7d" | "30d" | "12m";

export interface ChartDataPoint {
  label: string;
  sales: number;
  units: number;
  profit: number;
}

export interface KPIMetric {
  id: string;
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: React.ElementType;
}

export interface SalesPerformanceOverviewProps {
  isLoading?: boolean;
  period: SalesPeriod;
  onPeriodChange: (period: SalesPeriod) => void;
  customData?: Record<SalesPeriod, ChartDataPoint[]>;
}

// Default mock datasets for different periods matching the exact chart curve
const MOCK_PERIOD_DATA: Record<SalesPeriod, ChartDataPoint[]> = {
  "7d": [
    { label: "Page A", sales: 4000, units: 35, profit: 1200 },
    { label: "Page B", sales: 3000, units: 48, profit: 1740 },
    { label: "Page C", sales: 2000, units: 42, profit: 1530 },
    { label: "Page D", sales: 2780, units: 57, profit: 2070 },
    { label: "Page E", sales: 1890, units: 70, profit: 2520 },
    { label: "Page F", sales: 2390, units: 80, profit: 2880 },
    { label: "Page G", sales: 3490, units: 62, profit: 2250 },
  ],
  "30d": [
    { label: "Week 1", sales: 4000, units: 320, profit: 11550 },
    { label: "Week 2", sales: 3000, units: 350, profit: 12600 },
    { label: "Week 3", sales: 2000, units: 280, profit: 9800 },
    { label: "Week 4", sales: 2780, units: 310, profit: 10500 },
    { label: "Week 5", sales: 1890, units: 260, profit: 8900 },
    { label: "Week 6", sales: 2390, units: 290, profit: 9900 },
    { label: "Week 7", sales: 3490, units: 385, profit: 13770 },
  ],
  "12m": [
    { label: "Jan", sales: 4000, units: 1200, profit: 43500 },
    { label: "Feb", sales: 3000, units: 1350, profit: 48600 },
    { label: "Mar", sales: 2000, units: 1480, profit: 53400 },
    { label: "Apr", sales: 2780, units: 1290, profit: 46500 },
    { label: "May", sales: 1890, units: 1575, profit: 56700 },
    { label: "Jun", sales: 2390, units: 1700, profit: 61500 },
    { label: "Jul", sales: 3490, units: 1925, profit: 69300 },
  ],
};

export function getPeriodData(
  period: SalesPeriod,
  customData?: Record<SalesPeriod, ChartDataPoint[]>
): ChartDataPoint[] {
  const dataset = customData || MOCK_PERIOD_DATA;
  return dataset[period] || [];
}

const formatCurrency = (amount: number): string => {
  return `৳${amount.toLocaleString("en-US")}`;
};

const formatNumber = (num: number): string => {
  return num.toLocaleString("en-US");
};

export function computeKPIMetrics(
  chartData: ChartDataPoint[],
  period: SalesPeriod
): KPIMetric[] {
  if (!chartData || chartData.length === 0) {
    return [
      { id: "units", title: "Units Sold", value: "0 pcs", icon: Package },
      { id: "revenue", title: "Revenue", value: "৳0", icon: CircleDollarSign },
      { id: "profit", title: "Gross Profit", value: "৳0", icon: PieChart },
      { id: "daily", title: "Avg Daily Sales", value: "0 pcs/day", icon: Calendar },
      { id: "best_month", title: "Best Selling Month", value: "N/A", icon: Award },
    ];
  }

  const totalUnits = chartData.reduce((sum, item) => sum + item.units, 0);
  const totalRevenue = chartData.reduce((sum, item) => sum + item.sales, 0);
  const totalProfit = chartData.reduce((sum, item) => sum + item.profit, 0);

  let avgDaily = 0;
  if (period === "7d") avgDaily = Math.round(totalUnits / 7);
  else if (period === "30d") avgDaily = Math.round(totalUnits / 30);
  else avgDaily = Math.round(totalUnits / 365);

  let bestPoint = chartData[0];
  for (const pt of chartData) {
    if (pt.sales > bestPoint.sales) {
      bestPoint = pt;
    }
  }

  return [
    {
      id: "units",
      title: "Units Sold",
      value: `${formatNumber(totalUnits)} pcs`,
      change: "+12.4%",
      isPositive: true,
      icon: Package,
    },
    {
      id: "revenue",
      title: "Revenue",
      value: formatCurrency(totalRevenue),
      change: "+15.8%",
      isPositive: true,
      icon: CircleDollarSign,
    },
    {
      id: "profit",
      title: "Gross Profit",
      value: formatCurrency(totalProfit),
      change: "+18.2%",
      isPositive: true,
      icon: PieChart,
    },
    {
      id: "daily",
      title: "Avg Daily Sales",
      value: `${formatNumber(avgDaily)} pcs/day`,
      change: "+5.1%",
      isPositive: true,
      icon: Calendar,
    },
    {
      id: "best_month",
      title: "Best Selling Month",
      value: `${bestPoint.label} (${formatCurrency(bestPoint.sales)})`,
      icon: Award,
    },
  ];
}

export function KPISummaryCards({ metrics }: { metrics: KPIMetric[] }) {
  return (
    <div className="grid grid-cols-1 gap-2.5">
      {metrics.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.id}
            className="bg-muted/30 border border-border/40 rounded-2xl p-4 space-y-2.5 transition-colors hover:border-border/80"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1.5 rounded-lg bg-muted text-muted-foreground shrink-0">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">
                  {kpi.title}
                </span>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-base font-bold text-foreground font-mono truncate">
                  {kpi.value}
                </p>
                {kpi.change && (
                  <div className="mt-1 flex items-center justify-end gap-1">
                    <Badge
                      variant="outline"
                      className="text-[10px] font-semibold px-1.5 py-0.2 border-0 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    >
                      <TrendingUp className="h-3 w-3 mr-0.5 inline" />
                      {kpi.change}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const PERIOD_LABELS: Record<SalesPeriod, string> = {
  "7d": "Last 7 Days",
  "30d": "Last 30 Days",
  "12m": "Last 12 Months",
};

const PERIOD_SHORT_LABELS: Record<SalesPeriod, string> = {
  "7d": "7 Days",
  "30d": "30 Days",
  "12m": "12 Months",
};

interface PeriodTabsProps {
  period: SalesPeriod;
  onPeriodChange: (period: SalesPeriod) => void;
  short?: boolean;
}

export function PeriodTabs({
  period,
  onPeriodChange,
  short = false,
}: PeriodTabsProps) {
  const labels = short ? PERIOD_SHORT_LABELS : PERIOD_LABELS;
  return (
    <Tabs
      value={period}
      onValueChange={(val) => onPeriodChange(val as SalesPeriod)}
      className="w-full md:w-auto"
    >
      <TabsList
        className={`bg-muted/80 p-1 rounded-xl border border-border/40 w-full md:w-auto grid grid-cols-3 md:flex ${
          short ? "h-8" : "h-9"
        }`}
      >
        {(Object.keys(labels) as SalesPeriod[]).map((key) => (
          <TabsTrigger
            key={key}
            value={key}
            className={`font-semibold rounded-lg transition-all cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground ${
              short
                ? "text-[11px] px-2 py-1"
                : "text-xs px-3 py-1"
            }`}
          >
            {labels[key]}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number;
    color?: string;
    dataKey?: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 p-2.5 rounded shadow-sm text-center font-sans min-w-[110px]">
        <p className="font-bold text-gray-600 dark:text-slate-300 text-xs mb-1">
          {label}
        </p>
        {payload.map((entry, index) => (
          <p
            key={`tooltip-${index}`}
            className="text-xs font-semibold"
            style={{ color: entry.color || "#6dbf9c" }}
          >
            {entry.name || "uv"} : {formatNumber(entry.value || 0)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function SalesPerformanceOverview({
  isLoading = false,
  period,
  onPeriodChange,
  customData,
}: SalesPerformanceOverviewProps) {
  const chartData = useMemo(
    () => getPeriodData(period, customData),
    [period, customData]
  );

  if (isLoading) {
    return (
      <Card className="border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-md" />
              <Skeleton className="h-6 w-48 rounded-md" />
            </div>
            <Skeleton className="h-4 w-72 rounded-md" />
          </div>
          <Skeleton className="h-9 w-64 rounded-xl" />
        </div>

        <Skeleton className="h-[340px] w-full rounded-xl" />
      </Card>
    );
  }

  return (
    <Card className="border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden">
      {/* Header Section */}
      <CardHeader className="p-5 border-b border-border/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                Sales Performance Overview
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Monitor this product&apos;s sales, revenue, profitability, and performance trends over time.
              </p>
            </div>
          </div>

          {/* Segmented Period Selector */}
          <PeriodTabs period={period} onPeriodChange={onPeriodChange} />
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Performance Chart / Empty State */}
        {chartData.length > 0 ? (
          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="currentColor"
                  className="text-border/60"
                  vertical={true}
                  horizontal={true}
                />
                <XAxis
                  dataKey="label"
                  stroke="currentColor"
                  className="text-muted-foreground text-xs"
                  tickLine={true}
                  axisLine={true}
                />
                <YAxis
                  stroke="currentColor"
                  className="text-muted-foreground text-xs"
                  tickLine={true}
                  axisLine={true}
                  domain={[0, 4000]}
                  ticks={[0, 1000, 2000, 3000, 4000]}
                  tickFormatter={(val: number) => `${val}`}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: "currentColor", strokeDasharray: "3 3", opacity: 0.5 }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  name="uv"
                  stroke="#6dbf9c"
                  strokeWidth={2}
                  fill="#a7d7c5"
                  fillOpacity={0.65}
                  activeDot={{
                    r: 5,
                    fill: "#ffffff",
                    stroke: "#6dbf9c",
                    strokeWidth: 2.5,
                  }}
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[340px] flex flex-col items-center justify-center text-center p-6 space-y-3 bg-muted/20 border border-dashed border-border/60 rounded-xl">
            <div className="p-3 rounded-full bg-muted/50 text-muted-foreground">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">
                No sales data available.
              </h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
                Sales analytics will appear once transactions are recorded.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
