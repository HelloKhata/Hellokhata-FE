"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Zap,
} from "lucide-react";
import { Warehouse } from "./WarehouseMockData";

interface WarehousePerformanceGridProps {
  warehouses: Warehouse[];
  isBangla?: boolean;
}

export function WarehousePerformanceGrid({
  warehouses,
  isBangla = false,
}: WarehousePerformanceGridProps) {
  // Compute highlights
  const highestValueWh = [...warehouses].sort((a, b) => b.stockValue - a.stockValue)[0];
  const lowestStockWh = [...warehouses].sort((a, b) => a.totalStockUnits - b.totalStockUnits)[0];
  const mostActiveWh = warehouses.find((w) => w.code === "WH-MAIN-01") || warehouses[0];
  const fastMovingWh = warehouses.find((w) => w.type === "Fulfillment Center") || warehouses[4] || warehouses[0];

  return (
    <Card className="border border-border/80 shadow-xs bg-card">
      <CardHeader className="p-4 border-b border-border/60">
        <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
          <Award className="h-4 w-4 text-amber-500" />
          <span>{isBangla ? "ওয়্যারহাউস পারফরম্যান্স ও হাইলাইটস" : "Warehouse Performance Highlights"}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Most Active Warehouse */}
        <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase">
              {isBangla ? "সর্বাধিক সক্রিয় ওয়্যারহাউস" : "Most Active Warehouse"}
            </span>
            <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          {mostActiveWh && (
            <div>
              <p className="font-bold text-xs text-foreground truncate">{mostActiveWh.name}</p>
              <div className="flex items-center justify-between text-[11px] mt-1 text-muted-foreground">
                <span>{mostActiveWh.branchName}</span>
                <Badge variant="outline" className="text-[9px] font-mono">
                  {mostActiveWh.code}
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* Highest Inventory Value */}
        <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase">
              {isBangla ? "সর্বোচ্চ ইনভেন্টরি মূল্য" : "Highest Inventory Value"}
            </span>
            <div className="h-7 w-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          {highestValueWh && (
            <div>
              <p className="font-bold text-xs text-foreground truncate">{highestValueWh.name}</p>
              <p className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                ৳{highestValueWh.stockValue.toLocaleString("en-IN")}
              </p>
            </div>
          )}
        </div>

        {/* Lowest Inventory Reserve */}
        <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 uppercase">
              {isBangla ? "সর্বনিম্ন ইনভেন্টরি স্টক" : "Lowest Inventory Stock"}
            </span>
            <div className="h-7 w-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-600">
              <TrendingDown className="h-4 w-4" />
            </div>
          </div>
          {lowestStockWh && (
            <div>
              <p className="font-bold text-xs text-foreground truncate">{lowestStockWh.name}</p>
              <p className="text-xs font-bold font-mono text-amber-700 dark:text-amber-400 mt-0.5">
                {lowestStockWh.totalStockUnits.toLocaleString()} Units Remaining
              </p>
            </div>
          )}
        </div>

        {/* Fast Moving Warehouse Depot */}
        <div className="p-3.5 rounded-xl border border-blue-500/30 bg-blue-500/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-400 uppercase">
              {isBangla ? "দ্রুত স্টক টার্নওভার (Fast Moving)" : "Fastest Moving Depot"}
            </span>
            <div className="h-7 w-7 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          {fastMovingWh && (
            <div>
              <p className="font-bold text-xs text-foreground truncate">{fastMovingWh.name}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                82% Stock Turn / Month
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
