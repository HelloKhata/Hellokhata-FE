"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Building2,
  PackageCheck,
  XCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
  FileText,
  Package,
} from "lucide-react";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { MOCK_TRANSFERS } from "@/components/warehouse/WarehouseMockData";
import { ConfirmReceiptDialog } from "@/components/warehouse/ConfirmReceiptDialog";
import { CancelTransferDialog } from "@/components/warehouse/CancelTransferDialog";

export function TransferDetailPage() {
  const { isBangla } = useAppTranslation();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // Dialog States
  const [isConfirmReceiptOpen, setIsConfirmReceiptOpen] = useState(false);
  const [isCancelTransferOpen, setIsCancelTransferOpen] = useState(false);

  // Find transfer by ID or fallback to first mock transfer
  const transfer = MOCK_TRANSFERS.find((t) => t.id === id || t.transferNo === id) || MOCK_TRANSFERS[0];

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold px-2.5 py-1">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
            {isBangla ? "সম্পন্ন" : "Completed"}
          </Badge>
        );
      case "in_transit":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-semibold px-2.5 py-1">
            <Clock className="h-3.5 w-3.5 mr-1" />
            {isBangla ? "চলমান (In Transit)" : "In Transit"}
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-semibold px-2.5 py-1">
            <Clock className="h-3.5 w-3.5 mr-1" />
            {isBangla ? "অপেক্ষমান" : "Pending"}
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-semibold px-2.5 py-1">
            <XCircle className="h-3.5 w-3.5 mr-1" />
            {isBangla ? "বাতিল" : "Cancelled"}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs font-semibold">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header — Transfer ID, Status Badge, Date */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div className="space-y-1">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>{isBangla ? "ইনভেন্টরি" : "Inventory"}</span>
            <ChevronRight className="h-3 w-3" />
            <span>{isBangla ? "ওয়্যারহাউস" : "Warehouse"}</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-semibold">{isBangla ? "ট্রান্সফার বিবরণ" : "Transfer Detail"}</span>
          </nav>

          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-mono">
              #{transfer.transferNo}
            </h1>
            {renderStatusBadge(transfer.status)}
            <span className="text-xs text-muted-foreground font-mono">
              {new Date(transfer.date).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => router.back()}
          className="h-9 text-xs font-semibold gap-1.5 cursor-pointer shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
          {isBangla ? "পেছনে" : "Back"}
        </Button>
      </div>

      {/* 2. Information Card — Source Branch, Destination Branch, Notes */}
      <Card className="border border-border/60 shadow-xs">
        <CardHeader className="p-4 border-b border-border/40">
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            <span>{isBangla ? "শাখা ও ট্রান্সফার তথ্য" : "Transfer Information"}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                {isBangla ? "উৎস শাখা (Source Branch)" : "Source Branch"}
              </span>
              <p className="text-sm font-semibold text-foreground mt-0.5">{transfer.sourceBranch}</p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                {isBangla ? "গন্তব্য শাখা (Destination Branch)" : "Destination Branch"}
              </span>
              <p className="text-sm font-semibold text-foreground mt-0.5">{transfer.destinationBranch}</p>
            </div>

            <div className="col-span-1 md:col-span-2">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                {isBangla ? "মন্তব্য বা নির্দেশাবলী (Notes)" : "Notes"}
              </span>
              <p className="text-xs text-foreground bg-muted/30 p-2.5 rounded-lg border border-border/40 mt-1">
                {transfer.notes || (isBangla ? "কোনো বিশেষ মন্তব্য নেই" : "No specific notes provided.")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Items Table — Product, Batch, Quantity Sent */}
      <Card className="border border-border/60 shadow-xs">
        <CardHeader className="p-4 border-b border-border/40">
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" />
            <span>{isBangla ? "ট্রান্সফারকৃত পণ্য তালিকা" : "Transferred Items"}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-muted/40 text-muted-foreground border-b border-border/60 font-semibold uppercase text-[11px]">
                  <th className="p-3.5 w-[5%]">#</th>
                  <th className="p-3.5 w-[50%]">{isBangla ? "পণ্য (Product)" : "Product"}</th>
                  <th className="p-3.5 w-[25%]">{isBangla ? "ব্যাচ (Batch)" : "Batch"}</th>
                  <th className="p-3.5 w-[20%] text-right">{isBangla ? "প্রেরিত পরিমাণ (Quantity Sent)" : "Quantity Sent"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {transfer.items.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted-foreground text-xs">
                      {isBangla ? "কোনো আইটেম পাওয়া যায়নি" : "No items found in this transfer."}
                    </td>
                  </tr>
                ) : (
                  transfer.items.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-3.5 font-bold text-muted-foreground align-middle">
                        {idx + 1}
                      </td>
                      <td className="p-3.5 align-middle">
                        <div className="font-bold text-foreground text-xs">{item.productName}</div>
                        {item.sku && (
                          <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                            SKU: {item.sku}
                          </div>
                        )}
                      </td>
                      <td className="p-3.5 align-middle font-mono font-medium text-foreground">
                        {item.batchNumber}
                        {item.batchExpiry && (
                          <span className="text-[10px] text-muted-foreground block">Exp: {item.batchExpiry}</span>
                        )}
                      </td>
                      <td className="p-3.5 align-middle text-right font-mono font-bold text-foreground">
                        {item.quantitySent} {item.unit}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 4. Bottom Action Area — Show both buttons as UI placeholders */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsCancelTransferOpen(true)}
          className="h-10 text-xs font-semibold gap-1.5 cursor-pointer border-rose-500/30 text-rose-600 hover:bg-rose-500/10"
        >
          <XCircle className="h-4 w-4" />
          {isBangla ? "ট্রান্সফার বাতিল করুন" : "Cancel Transfer"}
        </Button>

        <Button
          type="button"
          onClick={() => setIsConfirmReceiptOpen(true)}
          className="h-10 text-xs font-bold gap-1.5 cursor-pointer shadow-xs px-5"
        >
          <PackageCheck className="h-4 w-4" />
          {isBangla ? "পণ্য রিসিভ নিশ্চিত করুন" : "Confirm Receipt"}
        </Button>
      </div>

      {/* 5. Confirm Receipt Dialog UI */}
      <ConfirmReceiptDialog
        isOpen={isConfirmReceiptOpen}
        onClose={() => setIsConfirmReceiptOpen(false)}
        transferNo={transfer.transferNo}
        items={transfer.items}
        onConfirmSuccess={() => {
          // Placeholder refresh/state update UI
        }}
      />

      {/* Cancel Transfer Dialog UI */}
      <CancelTransferDialog
        isOpen={isCancelTransferOpen}
        onClose={() => setIsCancelTransferOpen(false)}
        transferNo={transfer.transferNo}
        onCancelSuccess={() => {
          // Placeholder cancel UI
        }}
      />
    </div>
  );
}

export default TransferDetailPage;
