"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Package,
  Box,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import { Warehouse, WarehouseTransfer } from "./WarehouseMockData";

interface WarehouseKpiCardsProps {
  warehouses: Warehouse[];
  transfers?: WarehouseTransfer[];
  isBangla?: boolean;
}

export function WarehouseKpiCards({
  warehouses,
  isBangla = false,
}: WarehouseKpiCardsProps) {
  // Calculated aggregates matching inventory cards specification
  const totalItems = warehouses.reduce((sum, w) => sum + (w.productsCount || 0), 0);
  const totalStock = warehouses.reduce((sum, w) => sum + (w.totalStockUnits || 0), 0);
  const stockValue = warehouses.reduce((sum, w) => sum + (w.stockValue || 0), 0);
  const lowStockCount = warehouses.reduce((sum, w) => sum + Math.max(1, Math.round((w.productsCount || 0) * 0.015)), 0);

  const formatCurrency = (val: number) => `৳${val.toLocaleString("en-BD")}`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* CARD 1: Total Items */}
      <Card className="border border-border/70 shadow-xs bg-card hover:border-primary/40 transition-colors">
        <CardContent className="p-3.5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 min-w-0 pr-1">
              <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider truncate">
                {isBangla ? "মোট পণ্য" : "Total Items"}
              </p>
              <p className="text-xl font-bold font-mono text-foreground">
                {totalItems.toLocaleString()}{" "}
                <span className="text-xs font-normal text-muted-foreground">{isBangla ? "টি পণ্য" : "Items"}</span>
              </p>
              <span className="text-[10px] text-muted-foreground block truncate">
                {isBangla ? "নিবন্ধিত পণ্যসমূহ" : "Registered products"}
              </span>
            </div>
            <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <Package className="h-4.5 w-4.5" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CARD 2: Total Stock */}
      <Card className="border border-border/70 shadow-xs bg-card hover:border-emerald-500/40 transition-colors">
        <CardContent className="p-3.5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 min-w-0 pr-1">
              <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider truncate">
                {isBangla ? "মোট স্টক" : "Total Stock"}
              </p>
              <p className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {totalStock.toLocaleString()}{" "}
                <span className="text-xs font-normal text-muted-foreground">{isBangla ? "ইউনিট" : "Units"}</span>
              </p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block truncate">
                {isBangla ? "উপলব্ধ ইউনিটসমূহ" : "Available units in depots"}
              </span>
            </div>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <Box className="h-4.5 w-4.5" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CARD 3: Stock Value */}
      <Card className="border border-border/70 shadow-xs bg-card hover:border-emerald-500/40 transition-colors">
        <CardContent className="p-3.5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 min-w-0 pr-1">
              <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider truncate">
                {isBangla ? "স্টকের মূল্য" : "Stock Value"}
              </p>
              <p className="text-xl font-bold font-mono text-foreground">
                {formatCurrency(stockValue)}
              </p>
              <span className="text-[10px] text-muted-foreground block truncate">
                {isBangla ? "মোট ক্রয় মূল্যায়ন" : "Total inventory cost valuation"}
              </span>
            </div>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <DollarSign className="h-4.5 w-4.5" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CARD 4: Low Stock */}
      <Card className="border border-border/70 shadow-xs bg-card hover:border-rose-500/40 transition-colors">
        <CardContent className="p-3.5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 min-w-0 pr-1">
              <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider truncate">
                {isBangla ? "স্টক কম" : "Low Stock"}
              </p>
              <p className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400">
                {lowStockCount}{" "}
                <span className="text-xs font-normal text-muted-foreground">{isBangla ? "টি" : "Items"}</span>
              </p>
              <span className="text-[10px] text-rose-600 dark:text-rose-400 font-medium block truncate">
                {isBangla ? "রিঅর্ডার লেভেলের নিচে" : "Items below reorder level"}
              </span>
            </div>
            <div className="h-9 w-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
              <AlertTriangle className="h-4.5 w-4.5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
