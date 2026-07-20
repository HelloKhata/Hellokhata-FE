import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingUp, TrendingDown, DollarSign, Pencil, ShieldAlert } from "lucide-react";
import { AnalyticsStats } from "./mock-data";

interface LowStockThresholdCardProps {
  threshold: number;
  branch: string;
  onEdit?: () => void;
}

export function LowStockThresholdCard({
  threshold,
  branch,
  onEdit,
}: LowStockThresholdCardProps) {
  return (
    <Card className="border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden h-full flex flex-col justify-between">
      <CardHeader className="p-6 pb-3 flex flex-row items-center justify-between gap-4">
        <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-rose-500" />
          Low Stock Alert
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="h-8 w-8 p-0 border-input hover:bg-muted text-muted-foreground rounded-xl cursor-pointer"
        >
          <Pencil className="h-3 w-3" />
        </Button>
      </CardHeader>

      <CardContent className="p-6 pt-2 space-y-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-foreground">
            {threshold}
          </span>
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
            Units
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-xs text-rose-500 font-medium leading-relaxed">
          Alert triggers at <span className="font-bold">{branch}</span> outlet if active stock dips below {threshold} units.
        </div>
      </CardContent>
    </Card>
  );
}

interface InsightsCardProps {
  stats: AnalyticsStats;
}

export function InsightsCard({ stats }: InsightsCardProps) {
  return (
    <Card className="border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden h-full">
      <CardHeader className="p-6 pb-3 border-b border-border/40">
        <CardTitle className="text-base font-bold text-foreground">
          Sales Performance Insights
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-5">
        {/* Row 1: Best Selling Day */}
        <div className="flex items-center gap-3.5">
          <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Peak Sales Volume
            </span>
            <p className="text-xs font-bold text-foreground">
              {stats.bestSellingDay}
            </p>
          </div>
        </div>

        {/* Row 2: Worst Selling Day */}
        <div className="flex items-center gap-3.5">
          <div className="h-9 w-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 flex items-center justify-center shrink-0 shadow-sm">
            <TrendingDown className="h-4 w-4" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Lowest Sales Volume
            </span>
            <p className="text-xs font-bold text-foreground">
              {stats.worstSellingDay}
            </p>
          </div>
        </div>

        {/* Row 3: Average Daily Sales */}
        <div className="flex items-center gap-3.5">
          <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 shadow-sm">
            <DollarSign className="h-4 w-4" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Average Daily Revenue
            </span>
            <p className="text-xs font-bold text-foreground">
              ৳{stats.averageDailySales.toLocaleString()} / day
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
