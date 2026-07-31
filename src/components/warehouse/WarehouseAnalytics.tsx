"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  BarChart3,
  TrendingUp,
  HardDrive,
  ArrowRightLeft,
} from "lucide-react";
import {
  MOCK_CHART_INVENTORY_VALUE,
  MOCK_CHART_TRANSFERS_TREND,
  Warehouse,
} from "./WarehouseMockData";

interface WarehouseAnalyticsProps {
  warehouses: Warehouse[];
  isBangla?: boolean;
}

export function WarehouseAnalytics({ warehouses, isBangla = false }: WarehouseAnalyticsProps) {
  // Process warehouse utilization for horizontal bar list
  const topUtilizedWarehouses = [...warehouses]
    .sort((a, b) => (b.capacityUsed / (b.capacityMax || 1)) - (a.capacityUsed / (a.capacityMax || 1)))
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* CHART 1: Inventory Value by Warehouse */}
      <Card className="border border-border/80 shadow-xs bg-card">
        <CardHeader className="p-4 border-b border-border/60 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-emerald-500" />
            <span>{isBangla ? "ওয়্যারহাউস ভিত্তিক স্টক মূল্য (কোটি ৳)" : "Inventory Value by Warehouse (Million BDT)"}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_CHART_INVENTORY_VALUE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} />
              <YAxis stroke="#888888" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.9)",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#fff",
                }}
                formatter={(value: any) => [`৳${value} Million`, "Valuation"]}
              />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* CHART 2: Transfers Last 30 Days & Movement Trend */}
      <Card className="border border-border/80 shadow-xs bg-card">
        <CardHeader className="p-4 border-b border-border/60 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4 text-blue-500" />
            <span>{isBangla ? "স্টক মুভমেন্ট ট্রেন্ড (ইনকমিং বনাম আউটগোয়িং)" : "Stock Movement Trend (Incoming vs Outgoing)"}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_CHART_TRANSFERS_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncoming" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorOutgoing" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="day" stroke="#888888" fontSize={11} tickLine={false} />
              <YAxis stroke="#888888" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.9)",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#fff",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "5px" }} />
              <Area type="monotone" dataKey="incoming" name={isBangla ? "ইনকমিং (Incoming)" : "Incoming"} stroke="#10b981" fillOpacity={1} fill="url(#colorIncoming)" />
              <Area type="monotone" dataKey="outgoing" name={isBangla ? "আউটগোয়িং (Outgoing)" : "Outgoing"} stroke="#3b82f6" fillOpacity={1} fill="url(#colorOutgoing)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* CHART 3: Warehouse Capacity Utilization Progress Breakdown */}
      <Card className="border border-border/80 shadow-xs bg-card lg:col-span-2">
        <CardHeader className="p-4 border-b border-border/60 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-purple-500" />
            <span>{isBangla ? "ওয়্যারহাউস ধারণক্ষমতা সর্বোচ্চ ব্যবহারিত পারসেন্টেজ" : "Warehouse Storage Capacity Utilization Ranking"}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {topUtilizedWarehouses.map((wh) => {
            const capPercent = wh.capacityMax > 0
              ? Math.round((wh.capacityUsed / wh.capacityMax) * 100)
              : 0;

            return (
              <div key={wh.id} className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground truncate max-w-[200px]">
                    {wh.name}
                  </span>
                  <span className="font-mono font-bold text-primary">{capPercent}% Used</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden border border-border/50">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      capPercent > 80
                        ? "bg-rose-500"
                        : capPercent > 60
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${Math.min(100, capPercent)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-muted-foreground font-mono">
                  <span>Code: {wh.code}</span>
                  <span>
                    {wh.capacityUsed.toLocaleString()} / {wh.capacityMax.toLocaleString()} {wh.storageUnit}
                  </span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
