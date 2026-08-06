"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, AlertTriangle, ShieldCheck, BarChart3 } from "lucide-react";
import { Product } from "./mock-data";
import {
  SalesPerformanceOverview,
  KPISummaryCards,
  PeriodTabs,
  getPeriodData,
  computeKPIMetrics,
} from "./SalesPerformanceOverview";
import type { SalesPeriod } from "./SalesPerformanceOverview";
import { PurchaseHistoryTable } from "./PurchaseHistoryTable";

interface ProductInformationCardProps {
  product: Product;
}

export function ProductInformationCard({ product }: ProductInformationCardProps) {
  const isLowStock =
    (product.totalStock || 0) <= (product.minStockAlert || 30);

  const [period, setPeriod] = useState<SalesPeriod>("7d");
  const chartData = useMemo(() => getPeriodData(period), [period]);
  const kpiMetrics = useMemo(
    () => computeKPIMetrics(chartData, period),
    [chartData, period]
  );

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Column (2 cols wide) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Sales Performance Overview Analytics Card */}
        <SalesPerformanceOverview
          period={period}
          onPeriodChange={setPeriod}
        />
      
      </div>

      {/* Side Column: KPI Summary, Supplier & Inventory Health */}
      <div className="space-y-6">
        {/* KPI Summary */}
        <Card className="border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden">
          <CardHeader className="p-2 border-b border-border/40">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-bold text-foreground">
                  KPI Summary
                </CardTitle>
              </div>
              <PeriodTabs period={period} onPeriodChange={setPeriod} short />
            </div>
          </CardHeader>

          <CardContent className="px-4">
            <KPISummaryCards metrics={kpiMetrics} />
          </CardContent>
        </Card>
      </div>
    </div>
     <div className="pt-5">
       <PurchaseHistoryTable  purchases={[
  {
    id: "pur_001",
    purchaseNo: "PUR-20260804-001",
    supplierName: "ABC Traders",
    purchaseDate: "2026-08-04",
    batchId: "BCH-107029",
    quantity: 100,
    unitCost: 73,
    totalCost: 7300,
    createdBy: "Sweet Ali",
  },
  {
    id: "pur_002",
    purchaseNo: "PUR-20260803-002",
    supplierName: "Fresh Foods Ltd.",
    purchaseDate: "2026-08-03",
    batchId: "BCH-107030",
    quantity: 50,
    unitCost: 75,
    totalCost: 3750,
    createdBy: "Admin",
  },
  {
    id: "pur_003",
    purchaseNo: "PUR-20260802-003",
    supplierName: "Global Supply Co.",
    purchaseDate: "2026-08-02",
    batchId: "BCH-107031",
    quantity: 200,
    unitCost: 68,
    totalCost: 13600,
    createdBy: "John Doe",
  },
  {
    id: "pur_004",
    purchaseNo: "PUR-20260801-004",
    supplierName: "Prime Wholesale",
    purchaseDate: "2026-08-01",
    batchId: "BCH-107032",
    quantity: 80,
    unitCost: 71,
    totalCost: 5680,
    createdBy: "Admin",
  },
  {
    id: "pur_005",
    purchaseNo: "PUR-20260730-005",
    supplierName: "National Distributors",
    purchaseDate: "2026-07-30",
    batchId: "BCH-107033",
    quantity: 150,
    unitCost: 69,
    totalCost: 10350,
    createdBy: "Sweet Ali",
  },
]} />
     </div>
    </div>
  );
}
