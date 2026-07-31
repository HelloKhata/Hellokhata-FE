"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  CheckCircle2,
  Lock,
  HardDrive,
  ArrowRightLeft,
} from "lucide-react";
import { Warehouse, WarehouseTransfer } from "./WarehouseMockData";

interface WarehouseKpiCardsProps {
  warehouses: Warehouse[];
  transfers: WarehouseTransfer[];
  isBangla?: boolean;
}

export function WarehouseKpiCards({
  warehouses,
  transfers,
  isBangla = false,
}: WarehouseKpiCardsProps) {
  // Calculated aggregates
  const totalStockUnits = warehouses.reduce((sum, w) => sum + (w.totalStockUnits || 0), 0);
  const availableStockUnits = warehouses.reduce((sum, w) => sum + (w.availableUnits || Math.round((w.totalStockUnits || 0) * 0.85)), 0);
  const reservedStockUnits = warehouses.reduce((sum, w) => sum + (w.reservedUnits || Math.round((w.totalStockUnits || 0) * 0.15)), 0);

  const totalCapacityMax = warehouses.reduce((sum, w) => sum + (w.capacityMax || 0), 0);
  const totalCapacityUsed = warehouses.reduce((sum, w) => sum + (w.capacityUsed || 0), 0);
  const overallUtilizationPercent = totalCapacityMax > 0
    ? Math.round((totalCapacityUsed / totalCapacityMax) * 100)
    : 0;

  const todayTransfersCount = transfers.length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {/* CARD 1: Total Stock Quantity */}
      <Card className="border border-border/70 shadow-xs bg-card hover:border-primary/40 transition-colors">
        <CardContent className="p-3.5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 min-w-0 pr-1">
              <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider truncate">
                {isBangla ? "মোট স্টক পরিমাণ" : "Total Stock Quantity"}
              </p>
              <p className="text-xl font-bold font-mono text-foreground">
                {totalStockUnits.toLocaleString()}{" "}
                <span className="text-xs font-normal text-muted-foreground">{isBangla ? "ইউনিট" : "Units"}</span>
              </p>
              <span className="text-[10px] text-muted-foreground block truncate">
                {isBangla ? "সকল নিবন্ধিত ডিপোর স্টক" : "Combined storage depots"}
              </span>
            </div>
            <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Package className="h-4.5 w-4.5" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CARD 2: Available Stock */}
      <Card className="border border-border/70 shadow-xs bg-card hover:border-emerald-500/40 transition-colors">
        <CardContent className="p-3.5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 min-w-0 pr-1">
              <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider truncate">
                {isBangla ? "প্রাপ্য স্টক" : "Available Stock"}
              </p>
              <p className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {availableStockUnits.toLocaleString()}{" "}
                <span className="text-xs font-normal text-muted-foreground">{isBangla ? "ইউনিট" : "Units"}</span>
              </p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block truncate">
                {isBangla ? "বিক্রয় ও স্থানান্তরের জন্য প্রস্তুত" : "Ready for dispatch"}
              </span>
            </div>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <CheckCircle2 className="h-4.5 w-4.5" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CARD 3: Reserved Stock */}
      <Card className="border border-border/70 shadow-xs bg-card hover:border-blue-500/40 transition-colors">
        <CardContent className="p-3.5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 min-w-0 pr-1">
              <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider truncate">
                {isBangla ? "সংরক্ষিত স্টক" : "Reserved Stock"}
              </p>
              <p className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400">
                {reservedStockUnits.toLocaleString()}{" "}
                <span className="text-xs font-normal text-muted-foreground">{isBangla ? "ইউনিট" : "Units"}</span>
              </p>
              <span className="text-[10px] text-muted-foreground block truncate">
                {isBangla ? "পেন্ডিং অর্ডারের জন্য বুকিংকৃত" : "Allocated to orders"}
              </span>
            </div>
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <Lock className="h-4.5 w-4.5" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CARD 4: Capacity Utilization */}
      <Card className="border border-border/70 shadow-xs bg-card hover:border-purple-500/40 transition-colors">
        <CardContent className="p-3.5 space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider truncate">
              {isBangla ? "ধারণক্ষমতা ব্যবহার" : "Capacity Utilization"}
            </p>
            <Badge
              variant="outline"
              className="text-[10px] font-mono font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 py-0"
            >
              {overallUtilizationPercent}%
            </Badge>
          </div>
          <div className="flex items-center justify-between pt-0.5">
            <p className="text-xl font-bold font-mono text-foreground">
              {totalCapacityUsed.toLocaleString()}{" "}
              <span className="text-[10px] text-muted-foreground font-normal">/ {totalCapacityMax.toLocaleString()}</span>
            </p>
            <div className="h-7 w-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 shrink-0">
              <HardDrive className="h-3.5 w-3.5" />
            </div>
          </div>
          <Progress value={overallUtilizationPercent} className="h-1.5" />
        </CardContent>
      </Card>

      {/* CARD 5: Today's Movements / Transfers */}
      <Card className="border border-border/70 shadow-xs bg-card hover:border-amber-500/40 transition-colors">
        <CardContent className="p-3.5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 min-w-0 pr-1">
              <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider truncate">
                {isBangla ? "আজকের স্টক মুভমেন্ট" : "Today's Transfers"}
              </p>
              <p className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">
                {todayTransfersCount}{" "}
                <span className="text-xs font-normal text-muted-foreground">{isBangla ? "টি" : "Movements"}</span>
              </p>
              <span className="text-[10px] text-muted-foreground block truncate">
                {isBangla ? "ইনবাউন্ড ও আউটবাউন্ড স্থানান্তর" : "Inbound & outbound"}
              </span>
            </div>
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
              <ArrowRightLeft className="h-4.5 w-4.5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
