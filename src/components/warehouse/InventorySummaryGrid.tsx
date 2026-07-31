"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PackageCheck,
  CheckCircle2,
  Lock,
  AlertOctagon,
  XCircle,
  ArrowDownLeft,
  ArrowUpRight,
  Layers,
} from "lucide-react";
import { Warehouse } from "./WarehouseMockData";

interface InventorySummaryGridProps {
  warehouses: Warehouse[];
  isBangla?: boolean;
}

export function InventorySummaryGrid({
  warehouses,
  isBangla = false,
}: InventorySummaryGridProps) {
  const totalProductsCount = warehouses.reduce((sum, w) => sum + (w.productsCount || 0), 0);
  const totalStockUnits = warehouses.reduce((sum, w) => sum + (w.totalStockUnits || 0), 0);

  // Computed realistic breakdown
  const availableStock = Math.round(totalStockUnits * 0.82);
  const reservedStock = Math.round(totalStockUnits * 0.11);
  const damagedStock = 180;
  const expiredStock = 45;
  const incomingStock = 4800;
  const outgoingStock = 3200;

  const SUMMARY_ITEMS = [
    {
      titleEn: "Total Catalog Products",
      titleBn: "মোট ক্যাটালগ পণ্য",
      value: totalProductsCount.toLocaleString(),
      subEn: "Unique SKUs registered",
      subBn: "রেজিস্টার্ড ইউনিক আইটেম",
      icon: Layers,
      color: "text-primary bg-primary/10 border-primary/20",
    },
    {
      titleEn: "Available Stock",
      titleBn: "প্রাপ্য স্টক (Available)",
      value: availableStock.toLocaleString(),
      subEn: "Ready for sale & transfer",
      subBn: "বিক্রয় ও স্থানান্তরের জন্য প্রস্তুত",
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      titleEn: "Reserved Stock",
      titleBn: "সংরক্ষিত স্টক (Reserved)",
      value: reservedStock.toLocaleString(),
      subEn: "Allocated for pending orders",
      subBn: "পেন্ডিং অর্ডারের জন্য বুকিংকৃত",
      icon: Lock,
      color: "text-blue-600 bg-blue-500/10 border-blue-500/20",
    },
    {
      titleEn: "Damaged Stock",
      titleBn: "ক্ষতিগ্রস্ত স্টক (Damaged)",
      value: damagedStock.toLocaleString(),
      subEn: "In quarantine depot",
      subBn: "কোয়ারেন্টাইন ডিপোতে স্থানান্তরকৃত",
      icon: AlertOctagon,
      color: "text-amber-600 bg-amber-500/10 border-amber-500/20",
    },
    {
      titleEn: "Expired Stock",
      titleBn: "মেয়াদোত্তীর্ণ স্টক (Expired)",
      value: expiredStock.toLocaleString(),
      subEn: "Marked for disposal",
      subBn: "বাতিল বা ধ্বংসের উদ্দেশ্যে চিহ্নিত",
      icon: XCircle,
      color: "text-rose-600 bg-rose-500/10 border-rose-500/20",
    },
    {
      titleEn: "Incoming Goods",
      titleBn: "ইনকমিং পণ্য (Incoming)",
      value: incomingStock.toLocaleString(),
      subEn: "In-transit PO receipts",
      subBn: "পারচেজ অর্ডার ও ট্রানজিট পণ্য",
      icon: ArrowDownLeft,
      color: "text-indigo-600 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      titleEn: "Outgoing Shipments",
      titleBn: "আউটগোয়িং চালান (Outgoing)",
      value: outgoingStock.toLocaleString(),
      subEn: "Dispatched & in delivery",
      subBn: "ডেলিভারি চালানের পথে",
      icon: ArrowUpRight,
      color: "text-purple-600 bg-purple-500/10 border-purple-500/20",
    },
  ];

  return (
    <Card className="border border-border/80 shadow-xs bg-card">
      <CardHeader className="p-4 border-b border-border/60">
        <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
          <PackageCheck className="h-4 w-4 text-primary" />
          <span>{isBangla ? "ইনভেন্টরি স্টক সামারি ব্রেকডাউন" : "Inventory Stock Summary Breakdown"}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {SUMMARY_ITEMS.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-between hover:border-primary/40 transition-colors"
            >
              <div className="space-y-1 min-w-0 pr-2">
                <p className="text-[11px] font-semibold text-muted-foreground truncate">
                  {isBangla ? item.titleBn : item.titleEn}
                </p>
                <p className="text-xl font-bold font-mono text-foreground">
                  {item.value}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {isBangla ? item.subBn : item.subEn}
                </p>
              </div>
              <div className={`h-10 w-10 rounded-xl border flex items-center justify-center shrink-0 ${item.color}`}>
                <IconComponent className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
