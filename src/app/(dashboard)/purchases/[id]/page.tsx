"use client";

import { useState, Suspense, Fragment } from "react";
import { useRouter, useParams } from "next/navigation";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  Calendar as CalendarIcon,
  ArrowLeft,
  Loader2,
  Download,
  Undo2,
} from "lucide-react";
import { useCurrency } from "@/hooks/useAppTranslation";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { cn } from "@/lib/utils";
import { useUser } from "@/stores/sessionStore";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetPurchaseById } from "@/hooks/api/usePurchases";

function PurchaseDetailsContent() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) || "";
  
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const user = useUser();

  const { data: purchaseData, isLoading: isPurchaseLoading } = useGetPurchaseById(id);
  return (
    <div className="space-y-6">
      {/* Top Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/80 pointer-events-auto">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            {isBangla ? `ক্রয় বিবরণ #${purchaseData?.data?.invoiceNo}` : `Purchase Details #${purchaseData?.data?.invoiceNo || purchaseData?.grnNo}`}
          </h1>
        </div>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground h-9 px-3 text-xs sm:text-sm ml-auto sm:ml-0"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {isBangla ? "পেছনে" : "Back"}
        </Button>
      </div>

      {/* 1. Purchase Information & Metadata Card (As per user request) */}
      <div className="bg-zinc-900/20 border border-border/40 rounded-xl  p-5 space-y-5 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
          <span className="text-[13px] font-bold text-white">
            {isBangla ? "ক্রয় সংক্রান্ত তথ্য এবং মেটাডেটা" : "Purchase Information & Metadata"}
          </span>
          <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
            {isBangla ? "গৃহীত" : "Received"}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Purchase Invoice No */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold text-white/80 uppercase tracking-wider">
              {isBangla ? "ক্রয় ইনভয়েস নং" : "Purchase Invoice No"}
            </Label>
            <div className="h-10 bg-[#1a1d27] border border-white/5 rounded-lg flex items-center px-3.5">
              <span className="text-indigo-400 font-bold text-xs">{purchaseData?.invoiceNo || purchaseData?.grnNo}</span>
            </div>  
          </div>

          {/* Purchase Date */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold text-white/80 uppercase tracking-wider">
              {isBangla ? "ক্রয়ের তারিখ" : "Purchase Date"}
            </Label>
            <div className="h-10 bg-[#1a1d27] border border-white/5 rounded-lg flex items-center justify-between px-3.5">
              <span className="text-white font-semibold text-xs">
                {(() => {
                  const dateStr = purchaseData?.purchaseDate || purchaseData?.createdAt;
                  if (!dateStr) return "—";
                  const parsed = new Date(dateStr);
                  return !isNaN(parsed.getTime()) ? format(parsed, "dd MMM yyyy") : "—";
                })()}
              </span>
              <CalendarIcon className="h-3.5 w-3.5 text-white/40 shrink-0" />
            </div>
          </div>

          {/* Branch */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold text-white/80 uppercase tracking-wider">
              {isBangla ? "শাখা" : "Branch"}
            </Label>
            <div className="h-10 bg-[#1a1d27] border border-white/5 rounded-lg flex items-center px-3.5">
              <span className="text-white font-semibold text-xs truncate">{purchaseData?.branchName}</span>
            </div>
          </div>

          {/* Responsible Person */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold text-white/80 uppercase tracking-wider">
              {isBangla ? "দায়িত্বশীল ব্যক্তি" : "Responsible Person"}
            </Label>
            <div className="h-10 bg-[#1a1d27] border border-white/5 rounded-lg flex items-center px-3.5">
              <span className="text-white font-semibold text-xs truncate">{user?.name || "—"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Responsive Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form Content (9 Columns wide on Desktop) */}
        <div className="col-span-1 lg:col-span-9 space-y-6">
          {/* Billing Items Table */}
          <div className="bg-zinc-900/20 border border-border rounded-xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <span className="text-sm font-semibold text-foreground">
                {isBangla ? "পণ্য ও মূল্য নির্ধারণ" : "Items & Pricing"}
              </span>
            </div>

            <div className="overflow-x-auto border border-border/60 rounded-lg">
              <table className="w-full text-left text-xs border-collapse min-w-[760px]">
                <thead>
                  <tr className="bg-muted/20 text-muted-foreground border-b border-border/80 font-semibold">
                    <th className="px-3 py-3 w-[4%] text-center">#</th>
                    <th className="px-3 py-3 w-[26%]">{isBangla ? "পণ্য বা ডেসক্রিপশন" : "Item"}</th>
                    <th className="px-3 py-3 w-[11%] text-center">{isBangla ? "ব্যাচ নং" : "Batch No"}</th>
                    <th className="px-3 py-3 w-[11%] text-center">{isBangla ? "মেয়াদ" : "Expiry Date"}</th>
                    {/* <th className="px-3 py-3 w-[8%] text-center">{isBangla ? "স্টক" : "Stock"}</th> */}
                    <th className="px-3 py-3 w-[8%] text-center">{isBangla ? "পরিমাণ" : "Qty"}</th>
                    <th className="px-3 py-3 w-[11%] text-center">{isBangla ? "ক্রয় মূল্য / দর" : "Rate"}</th>
                    <th className="px-3 py-3 w-[8%] text-center">{isBangla ? "ট্যাক্স (%)" : "Tax (%)"}</th>
                    <th className="px-3 py-3 w-[11%] text-center">{isBangla ? "মোট" : "Amount"}</th>
                    <th className="px-3 py-3 w-[3%] text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {
                     purchaseData?.items?.map((rawItem: any, idx: number) => {
                      const itemId = rawItem.itemId || rawItem.id || `item-${idx}`;
                      const itemName = rawItem.itemName || rawItem.item?.name || "—";
                      const quantity = rawItem.quantity || 0;
                      const unitCost = rawItem.unitCost || 0;
                      const total = rawItem.total || 0;
                      const sku = rawItem.item?.sku || "";
                      const currentStock = rawItem.batch?.remainingQty ?? rawItem.remainingQuantity ?? 0;
                      const unit = typeof rawItem.item?.unit === "object" 
                        ? rawItem.item?.unit?.symbol || rawItem.item?.unit?.name || "Pcs"
                        : typeof rawItem.unit === "object"
                        ? rawItem.unit?.symbol || rawItem.unit?.name || "Pcs"
                        : rawItem.item?.unit || rawItem.unit || "Pcs";
                      const batchNo = rawItem.batch?.batchNumber || "—";
                      const rawExpiry = rawItem.batch?.expiryDate || rawItem.expiryDate;
                      const isValidExpiry = rawExpiry && !isNaN(new Date(rawExpiry).getTime());

                      return (
                      <Fragment key={itemId}>
                        <tr className="hover:bg-muted/10 transition-colors">
                          <td className="px-3 py-3 font-semibold text-amber-500/80 align-middle text-center">
                            {idx + 1}
                          </td>

                          {/* Product Image, Fixed Width Name with Truncate & Tooltip, SKU */}
                          <td className="px-3 py-3 align-middle">
                            <div className="flex items-center gap-3">
                              {rawItem.item?.imageUrl ? (
                                <img
                                  src={rawItem.item.imageUrl}
                                  alt={itemName}
                                  className="h-8 w-8 rounded object-cover border border-border/80 shrink-0"
                                />
                              ) : (
                                <div className="h-8 w-8 rounded bg-muted flex items-center justify-center border border-border/60 shrink-0">
                                  <Image
                                    src="/images/image.png"
                                    width={40}
                                    height={40}
                                    alt="Image"
                                    className="h-5 w-5 text-muted-foreground/60"
                                  />
                                </div>
                              )}
                              <div className="w-[180px] min-w-[180px] max-w-[180px] shrink-0">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <p className="font-semibold text-foreground text-xs leading-tight truncate cursor-pointer hover:text-primary transition-colors">
                                      {itemName}
                                    </p>
                                  </TooltipTrigger>
                                  {itemName && (
                                    <TooltipContent side="top" className="max-w-[250px]">
                                      <p className="text-xs">{itemName}</p>
                                    </TooltipContent>
                                  )}
                                </Tooltip>
                                {sku && (
                                  <p className="text-[10px] text-muted-foreground mt-0.5 font-mono truncate">
                                    SKU: {sku}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Batch No */}
                          <td className="px-3 py-3 align-middle text-center text-xs font-mono text-foreground font-medium">
                            {batchNo && batchNo !== "—" ? (
                              <span className="bg-muted/40 px-2 py-0.5 rounded border border-border/60">
                                {batchNo}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>

                          {/* Expiry Date */}
                          <td className="px-3 py-3 align-middle text-center text-xs text-muted-foreground font-medium">
                            {isValidExpiry ? format(new Date(rawExpiry), "dd MMM yyyy") : "—"}
                          </td>
                          
                          {/* Stock */}
                          {/* <td className="px-3 py-3 align-middle text-center text-muted-foreground font-medium">
                            {currentStock} {unit}
                          </td> */}

                          {/* Quantity */}
                          <td className="px-3 py-3 align-middle text-center font-semibold text-foreground text-sm">
                            {quantity} ({unit})
                          </td>

                          {/* Rate */}
                          <td className="px-3 py-3 align-middle text-center font-semibold text-foreground">
                            {formatCurrency(unitCost || 0)}
                          </td>

                          {/* Tax % */}
                          <td className="px-3 py-3 align-middle text-center font-semibold text-muted-foreground">
                            {rawItem.taxPercent || 0}%
                          </td>

                          {/* Row Total */}
                          <td className="px-3 py-3 align-middle text-center font-bold text-primary font-mono text-sm">
                            {formatCurrency(total || 0)}
                          </td>

                          {/* Delete Action - Removed */}
                          <td className="px-3 py-3 align-middle text-right"></td>
                        </tr>
                      </Fragment>
                    )})

                  }
                </tbody>
              </table>
            </div>

          </div>

          {/* Notes */}
          {purchaseData?.notes && (
            <div className="bg-zinc-900/20 border border-border rounded-xl p-5 space-y-4 shadow-xs">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  {isBangla ? "মন্তব্য বা বিশেষ নির্দেশনা" : "Remarks or Special Notes"}
                </Label>
                <div className="bg-background/50 border border-border/60 rounded-lg p-3 text-xs text-muted-foreground min-h-[60px]">
                  {purchaseData?.notes}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Section: Purchase Summary Sticky Panel */}
        <div className="col-span-1 lg:col-span-3 lg:sticky lg:top-6 space-y-6">
          <div className="bg-zinc-900/20 border border-border rounded-xl p-5 space-y-4 shadow-xs">
            <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">
              {isBangla ? "ক্রয় সারাংশ" : "Purchase Summary"}
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>{isBangla ? "আইটেম উপমোট" : "Item Subtotal"}</span>
                <span className="font-semibold text-foreground">{formatCurrency(purchaseData?.subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>{isBangla ? "আইটেম ট্যাক্স" : "Item Tax"}</span>
                <span className="font-semibold text-foreground">+{formatCurrency(purchaseData?.tax)}</span>
              </div>

              {/* Shipping Cost */}
              <div className="flex justify-between items-center text-muted-foreground">
                <span>{isBangla ? "পরিবহন খরচ" : "Shipping Cost"}</span>
                <span className="font-semibold text-foreground">+{formatCurrency(purchaseData?.shippingCost)}</span>
              </div>

              {/* Additional Charges */}
              <div className="flex justify-between items-center text-muted-foreground">
                <span>{isBangla ? "অন্যান্য খরচ" : "Additional Charges"}</span>
                <span className="font-semibold text-foreground">+{formatCurrency(purchaseData?.additionalCharges)}</span>
              </div>

              {/* Grand Total output */}
              <div className="flex justify-between items-center border-t border-border pt-3 text-sm font-bold">
                <span className="text-foreground">{isBangla ? "সর্বমোট" : "Grand Total"}</span>
                <span className="text-primary text-base">{formatCurrency(purchaseData?.total)}</span>
              </div>
                 {/* Payment Info Section */}
      
              <div className="flex justify-between items-center text-muted-foreground pt-1.5 border-t border-border/40 mt-1.5">
                <span>{isBangla ? "পরিশোধিত" : "Paid Amount"}</span>
                <span className="font-bold text-foreground">{formatCurrency(purchaseData?.paidAmount)}</span>
              </div>

              {purchaseData?.dueAmount > 0 && (
                <div className="flex justify-between items-center text-rose-500 font-bold">
                  <span>{isBangla ? "বাকি পরিমাণ" : "Due Amount"}</span>
                  <span>{formatCurrency(purchaseData?.dueAmount)}</span>
                </div>
              )}

              {purchaseData?.changeReturned > 0 && (
                <div className="flex justify-between items-center text-blue-500 font-bold">
                  <span>{isBangla ? "ফেরত (Change)" : "Change Return"}</span>
                  <span>{formatCurrency(purchaseData?.changeReturned)}</span>
                </div>
              )}
            </div>
            <div className="space-y-3 pt-3 border-t border-border flex flex-col pointer-events-auto">
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => router.push(`/purchases/returns/new?purchaseId=${id}`)}
                  className="flex-1 h-10 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 font-semibold flex items-center justify-center gap-1.5 cursor-pointer text-xs transition-colors"
                >
                  <Undo2 className="h-4 w-4" />
                  <span>{isBangla ? "ফেরত দিন" : "Return"}</span>
                </Button>
                <Button
                  type="button"
                  className="flex-1 h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center justify-center gap-1.5 cursor-pointer text-xs transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>{isBangla ? "ইনভয়েস" : "Invoice"}</span>
                </Button>
              </div>
              <Button
                type="button"
                onClick={() => router.push('/purchases')}
                className="w-full h-10 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold flex items-center justify-center gap-1.5 cursor-pointer text-xs transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{isBangla ? "ফিরে যান" : "Back"}</span>
              </Button>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
}

export default function PurchaseDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <PurchaseDetailsContent />
    </Suspense>
  );
}
