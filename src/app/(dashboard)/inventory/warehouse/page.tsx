"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Package,
  AlertTriangle,
  XCircle,
  ArrowRightLeft,
  Layers,
  History,
  Eye,
  Plus,
  TrendingUp,
  ChevronRight,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { MOCK_TRANSFERS } from "@/components/warehouse/WarehouseMockData";

export default function WarehouseOverviewPage() {
  const { isBangla } = useAppTranslation();
  const router = useRouter();

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            {isBangla ? "সম্পন্ন" : "Completed"}
          </Badge>
        );
      case "in_transit":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[10px] font-semibold">
            <Clock className="h-3 w-3 mr-1" />
            {isBangla ? "চলমান (In Transit)" : "In Transit"}
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-semibold">
            <Clock className="h-3 w-3 mr-1" />
            {isBangla ? "অপেক্ষমান" : "Pending"}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[10px] font-semibold">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div className="space-y-1">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>{isBangla ? "ইনভেন্টরি" : "Inventory"}</span>
            <ChevronRight className="h-3 w-3" />
            <span>{isBangla ? "ওয়্যারহাউস" : "Warehouse"}</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-semibold">{isBangla ? "সংক্ষিপ্ত ওভারভিউ" : "Overview"}</span>
          </nav>

          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span>{isBangla ? "কেন্দ্রীয় ডিস্ট্রিবিউশন ওয়্যারহাউস" : "Central Distribution Warehouse"}</span>
            </h1>
            <Badge variant="outline" className="font-mono text-xs font-semibold bg-primary/10 text-primary border-primary/20">
              WH-MAIN
            </Badge>
          </div>
        </div>
      </div>

      {/* 2. Summary Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Stock Value */}
        <Card className="border border-border/60 shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  {isBangla ? "মোট স্টক মূল্য" : "Total Stock Value"}
                </p>
                <p className="text-2xl font-bold font-mono text-foreground">
                  ৳১,২৫,৪০,০০০
                </p>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +4.2% from last month
                </span>
              </div>
              <div className="h-11 w-11 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 shrink-0">
                <Package className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Products */}
        <Card className="border border-amber-500/30 bg-amber-50/20 dark:bg-amber-950/10 shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-amber-700 dark:text-amber-400 font-medium uppercase tracking-wider">
                  {isBangla ? "স্বল্প স্টক পণ্য" : "Low Stock Products"}
                </p>
                <p className="text-2xl font-bold font-mono text-amber-700 dark:text-amber-400">
                  14 {isBangla ? "টি পণ্য" : "Items"}
                </p>
                <span className="text-[11px] text-muted-foreground">
                  {isBangla ? "পুনরায় অর্ডার লেভেলের নিচে" : "Below reorder threshold"}
                </span>
              </div>
              <div className="h-11 w-11 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-600 shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expiring Soon Products */}
        <Card className="border border-rose-500/30 bg-rose-50/20 dark:bg-rose-950/10 shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-rose-700 dark:text-rose-400 font-medium uppercase tracking-wider">
                  {isBangla ? "শীঘ্রই মেয়াদ শেষ পণ্য" : "Expiring Soon Products"}
                </p>
                <p className="text-2xl font-bold font-mono text-rose-700 dark:text-rose-400">
                  8 {isBangla ? "টি ব্যাচ" : "Batches"}
                </p>
                <span className="text-[11px] text-muted-foreground">
                  {isBangla ? "৩০ দিনের মধ্যে মেয়াদের শেষ" : "Expiring within 30 days"}
                </span>
              </div>
              <div className="h-11 w-11 rounded-xl bg-rose-500/15 flex items-center justify-center text-rose-600 shrink-0">
                <XCircle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Quick Actions Panel */}
      <Card className="border border-border/60 shadow-xs bg-card">
        <CardHeader className="p-4 border-b border-border/40">
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4 text-primary" />
            <span>{isBangla ? "দ্রুত অ্যাকশন" : "Quick Actions"}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button
            onClick={() => router.push("/inventory/warehouse/transfers/new")}
            className="h-11 text-xs font-bold gap-2 cursor-pointer shadow-xs"
          >
            <Plus className="h-4 w-4" />
            {isBangla ? "নতুন ট্রান্সফার তৈরি করুন" : "Create Transfer"}
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push("/inventory/batches")}
            className="h-11 text-xs font-bold gap-2 cursor-pointer border-border"
          >
            <Layers className="h-4 w-4 text-primary" />
            {isBangla ? "সকল ব্যাচ দেখুন" : "View All Batches"}
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push("/inventory/warehouse/transfers")}
            className="h-11 text-xs font-bold gap-2 cursor-pointer border-border"
          >
            <History className="h-4 w-4 text-primary" />
            {isBangla ? "ট্রান্সফার হিস্ট্রি" : "Transfer History"}
          </Button>
        </CardContent>
      </Card>

      {/* 4. Recent Transfers Card Table */}
      <Card className="border border-border/60 shadow-xs">
        <CardHeader className="p-4 border-b border-border/40 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            <span>{isBangla ? "সাম্প্রতিক স্টক ট্রান্সফার" : "Recent Stock Transfers"}</span>
          </CardTitle>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/inventory/warehouse/transfers")}
            className="h-8 text-xs text-primary font-semibold hover:bg-primary/10 gap-1 cursor-pointer"
          >
            <span>{isBangla ? "সব দেখুন" : "View All"}</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-muted/40 text-muted-foreground border-b border-border/60 font-semibold uppercase text-[11px]">
                  <th className="p-3.5">{isBangla ? "ট্রান্সফার আইডি" : "Transfer ID"}</th>
                  <th className="p-3.5">{isBangla ? "গন্তব্য শাখা" : "Destination"}</th>
                  <th className="p-3.5">{isBangla ? "তারিখ" : "Date"}</th>
                  <th className="p-3.5">{isBangla ? "স্ট্যাটাস" : "Status"}</th>
                  <th className="p-3.5 text-right">{isBangla ? "অ্যাকশন" : "Action"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {MOCK_TRANSFERS.map((trf) => (
                  <tr key={trf.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-foreground">
                      {trf.transferNo}
                    </td>
                    <td className="p-3.5 font-medium text-foreground">
                      {trf.destinationBranch}
                    </td>
                    <td className="p-3.5 text-muted-foreground font-mono">
                      {new Date(trf.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-3.5">
                      {renderStatusBadge(trf.status)}
                    </td>
                    <td className="p-3.5 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/inventory/warehouse/transfers/${trf.id}`)}
                        className="h-7 text-xs font-semibold gap-1 text-primary hover:bg-primary/10 cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        {isBangla ? "দেখুন" : "View"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
