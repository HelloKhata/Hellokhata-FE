"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PackageCheck, Calendar, RotateCcw, DollarSign, TrendingUp } from "lucide-react";
import { Product } from "./mock-data";

interface SalesSummarySectionProps {
  product: Product;
}

export function SalesSummarySection({ product }: SalesSummarySectionProps) {
  // Simple summary stats without chart clutter
  const totalUnitsSold = 546;
  const lastSoldDate = "2026-07-16 02:30 PM";
  const totalReturns = 4;
  const totalRevenue = 573300;
  const estimatedProfit = 109200;

  return (
    <div className="space-y-6">
      <Card className="border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden">
        <CardHeader className="p-5 border-b border-border/40 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                Sales Summary Statistics
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Key sales numbers and product movement summary
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Total Sold */}
            <div className="bg-muted/30 border border-border/40 rounded-2xl p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Total Sold
                </span>
                <PackageCheck className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-extrabold text-foreground mt-2 tracking-tight">
                {totalUnitsSold}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1 truncate">
                {product.unit}s sold to date
              </p>
            </div>

            {/* Last Sold Date */}
            <div className="bg-muted/30 border border-border/40 rounded-2xl p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Last Sold
                </span>
                <Calendar className="h-4 w-4 text-blue-500" />
              </div>
              <p className="text-sm font-bold text-foreground mt-2 truncate">
                {lastSoldDate}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1 truncate">
                Retail outlet sale
              </p>
            </div>

            {/* Total Returns */}
            <div className="bg-muted/30 border border-border/40 rounded-2xl p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Total Returns
                </span>
                <RotateCcw className="h-4 w-4 text-amber-500" />
              </div>
              <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-2 tracking-tight">
                {totalReturns}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1 truncate">
                Returned items
              </p>
            </div>

            {/* Revenue */}
            <div className="bg-muted/30 border border-border/40 rounded-2xl p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Total Revenue
                </span>
                <DollarSign className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-extrabold text-foreground mt-2 tracking-tight">
                ৳{totalRevenue.toLocaleString()}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1 truncate">
                Gross sales revenue
              </p>
            </div>

            {/* Profit */}
            <div className="bg-muted/30 border border-border/40 rounded-2xl p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Estimated Profit
                </span>
                <TrendingUp className="h-4 w-4 text-indigo-500" />
              </div>
              <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2 tracking-tight">
                ৳{estimatedProfit.toLocaleString()}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1 truncate">
                Gross sales profit
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
