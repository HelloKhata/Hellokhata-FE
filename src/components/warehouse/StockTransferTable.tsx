"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  History,
  ArrowRightLeft,
  ChevronRight,
  Eye,
  Truck,
  CheckCircle2,
  Clock,
  PackageCheck,
  XCircle,
  Printer,
  Plus,
  ArrowDownLeft,
} from "lucide-react";
import { WarehouseTransfer } from "./WarehouseMockData";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface StockTransferTableProps {
  transfers: WarehouseTransfer[];
  onNavigateNewTransfer: () => void;
  onNavigateAllTransfers: () => void;
  isBangla?: boolean;
}

export function StockTransferTable({
  transfers,
  onNavigateNewTransfer,
  onNavigateAllTransfers,
  isBangla = false,
}: StockTransferTableProps) {
  const router = useRouter();
  const displayTransfers = transfers.slice(0, 5);

  const renderStatusBadge = (status: WarehouseTransfer["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "delivered":
        return (
          <Badge className="bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 text-[10px] font-semibold">
            <PackageCheck className="h-3 w-3 mr-1" />
            Delivered
          </Badge>
        );
      case "in_transit":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[10px] font-semibold">
            <Truck className="h-3 w-3 mr-1" />
            In Transit
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-semibold">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[10px] font-semibold">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleAction = (actionName: string, transferNo: string) => {
    toast.info(`${actionName} action for transfer ${transferNo}...`);
  };

  return (
    <Card className="border border-border/80 shadow-xs bg-card">
      <CardHeader className="p-3.5 border-b border-border/60 flex flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <History className="h-4.5 w-4.5 text-primary" />
          <CardTitle className="text-sm font-bold text-foreground">
            {isBangla ? "সাম্প্রতিক স্টক ট্রান্সফার" : "Recent Stock Transfers"}
          </CardTitle>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={onNavigateNewTransfer}
            className="h-7 text-xs font-bold gap-1 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{isBangla ? "নতুন ট্রান্সফার" : "New Transfer"}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onNavigateAllTransfers}
            className="h-7 text-xs text-primary font-semibold hover:bg-primary/10 gap-0.5 cursor-pointer"
          >
            <span>{isBangla ? "সব দেখুন" : "View All"}</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto border-t border-border/40">
          <table className="w-full text-left text-xs border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-muted/40 text-muted-foreground border-b border-border/60 font-semibold uppercase text-[10px]">
                <th className="p-3">{isBangla ? "ট্রান্সফার আইডি" : "Transfer ID"}</th>
                <th className="p-3">{isBangla ? "টাইপ" : "Transfer Type"}</th>
                <th className="p-3">{isBangla ? "উৎস → গন্তব্য" : "Source → Destination"}</th>
                <th className="p-3 text-center">{isBangla ? "আইটেম ও পরিমাণ" : "Items / Qty"}</th>
                <th className="p-3">{isBangla ? "তৈরিকারী ও তারিখ" : "Created By & Date"}</th>
                <th className="p-3">{isBangla ? "স্ট্যাটাস" : "Status"}</th>
                <th className="p-3 text-right">{isBangla ? "কুইক অ্যাকশন" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {displayTransfers.map((trf) => (
                <tr key={trf.id} className="hover:bg-muted/20 transition-colors">
                  {/* Transfer ID */}
                  <td className="p-3 font-mono font-bold text-foreground">
                    {trf.transferNo}
                  </td>

                  {/* Transfer Type */}
                  <td className="p-3">
                    <Badge variant="outline" className="text-[10px] font-medium bg-muted">
                      {trf.transferType || "Inter-Branch"}
                    </Badge>
                  </td>

                  {/* Source -> Destination */}
                  <td className="p-3 font-medium text-foreground">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="truncate max-w-[130px] font-semibold">{trf.sourceBranch}</span>
                      <ArrowRightLeft className="h-3 w-3 text-muted-foreground shrink-0" />
                      <span className="truncate max-w-[130px]">{trf.destinationBranch}</span>
                    </div>
                  </td>

                  {/* Item / Quantity */}
                  <td className="p-3 text-center">
                    <span className="font-bold font-mono block text-foreground">
                      {trf.totalItems} Items
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      ({trf.totalQuantity || 0} Units)
                    </span>
                  </td>

                  {/* Created By & Date */}
                  <td className="p-3">
                    <span className="font-semibold text-foreground block text-xs">{trf.createdBy}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {new Date(trf.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="p-3">
                    {renderStatusBadge(trf.status)}
                  </td>

                  {/* Quick Actions (Receive, Track, Print) */}
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {trf.status === "in_transit" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAction("Receive", trf.transferNo)}
                          className="h-7 text-[11px] font-semibold text-emerald-600 hover:bg-emerald-500/10 cursor-pointer gap-1 px-1.5"
                        >
                          <ArrowDownLeft className="h-3 w-3" />
                          <span>Receive</span>
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/inventory/warehouse/transfers/${trf.id}`)}
                        className="h-7 w-7 text-primary hover:bg-primary/10 cursor-pointer"
                        title="Track / View Details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleAction("Print Challan", trf.transferNo)}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                        title="Print Challan"
                      >
                        <Printer className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
