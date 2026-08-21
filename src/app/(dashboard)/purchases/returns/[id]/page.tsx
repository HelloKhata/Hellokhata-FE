// Hello Khata OS - Purchase Return Details View Page
// হ্যালো খাতা - ক্রয় ফেরত বিবরণ পেজ

"use client";

import React, { useMemo, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/premium";
import {
  RotateCcw,
  ArrowLeft,
  Loader2,
  Printer,
  Calendar as CalendarIcon,
  Banknote,
  CreditCard,
  Smartphone,
  Receipt,
  FileText,
  ImageIcon,
} from "lucide-react";
import { useCurrency, useAppTranslation } from "@/hooks/useAppTranslation";
import { useGetPurchaseReturnById } from "@/hooks/api/useReturns";
import { cn } from "@/lib/utils";

const METHODS = [
  { id: "cash", label: "Cash", icon: Banknote, accent: "var(--emerald-500)", colorClass: "text-emerald-500", bgClass: "bg-emerald-500/10", borderClass: "border-emerald-500/20" },
  { id: "bank", label: "Bank/Card", icon: CreditCard, accent: "var(--blue-500)", colorClass: "text-blue-500", bgClass: "bg-blue-500/10", borderClass: "border-blue-500/20" },
  { id: "mobile_banking", label: "Mobile Banking", icon: Smartphone, accent: "var(--orange-500)", colorClass: "text-orange-500", bgClass: "bg-orange-500/10", borderClass: "border-orange-500/20" },
];

function PurchaseReturnDetailsContent() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) || "";

  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();

  // Fetch Purchase Return details from API
  const { data: apiReturnData, isLoading } = useGetPurchaseReturnById(id);

  const returnDetails = useMemo(() => {
    const data = apiReturnData?.data || apiReturnData || {};
    const purchase = data.purchase || {};
    const supplier = data.supplier || purchase.supplier || {};

    const items = (data.items || []).map((item: any) => {
      const unit = typeof item?.unit === "object"
        ? item?.unit?.symbol || item?.unit?.name || "pcs"
        : typeof item?.item?.unit === "object"
        ? item?.item?.unit?.symbol || item?.item?.unit?.name || "pcs"
        : item?.unit || item?.item?.unit || "pcs";

      return {
        id: item.id || item.purchaseItemId,
        itemName: item.itemName || item.item?.name || item.name || "Product",
        sku: item.sku || item.item?.sku || "—",
        batchNo: item.batchNo || item.batch?.batchNo || item.batchNumber || "",
        unitCost: Number(item.unitCost ?? item.unitPrice ?? item.rate ?? 0),
        taxPercent: Number(item.taxPercent ?? item.taxRate ?? item.tax ?? 0),
        quantity: Number(item.quantity ?? 0),
        maxQuantity: Number(item.maxQuantity ?? item.purchaseQuantity ?? item.quantity ?? 0),
        unit,
        returnType: item.returnType || "refund",
        reason: item.reason || "damaged",
        total: Number(item.total ?? (item.quantity * (item.unitCost ?? item.unitPrice ?? 0))),
        imageUrl: item.imageUrl || item.item?.imageUrl || "",
      };
    });

    const subtotal = data.subtotal != null
      ? Number(data.subtotal)
      : items.reduce((sum: number, item: any) => sum + (item.quantity * item.unitCost), 0);

    const taxAmount = data.tax != null
      ? Number(data.tax)
      : items.reduce((sum: number, item: any) => sum + ((item.quantity * item.unitCost * (item.taxPercent || 0)) / 100), 0);

    const additionalCharges = Number(data.additionalCharges ?? data.shippingAdjustment ?? 0);
    const grandTotal = data.total != null ? Number(data.total) : (subtotal + taxAmount + additionalCharges);

    return {
      id: data.id || id,
      returnNo: data.returnNo || data.returnInvoiceNo || data.invoiceNo || `RET-${id.slice(-6)}`,
      purchaseInvoiceNo: purchase.grnNo || purchase.invoiceNo || data.purchaseInvoiceNo || "—",
      purchaseDate: purchase.createdAt || data.purchaseDate,
      purchaseTotal: Number(purchase.total || 0),
      purchasePaid: Number(purchase.paidAmount || 0),
      purchaseDue: Number(purchase.dueAmount || 0),
      supplierName: supplier.name || data.supplierName || "—",
      supplierPhone: supplier.phone || data.supplierPhone || "",
      supplierBalance: Number(supplier.currentBalance ?? 0),
      returnDate: data.returnDate || data.createdAt,
      status: data.status || "completed",
      items,
      subtotal,
      taxAmount,
      additionalCharges,
      grandTotal,
      refundMethod: data.refundMethod || data.paymentMethod || "cash",
      accountId: data.accountId || data.account?.id || "",
      accountName: data.account?.name || data.accountName || "",
      refundAmount: data.refundAmount != null ? Number(data.refundAmount) : grandTotal,
      notes: data.notes || "",
      invoiceImage: data.invoiceImage || data.imageUrl || data.uploadedImage || "",
    };
  }, [apiReturnData, id]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/80">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <RotateCcw className="h-6 w-6 text-primary" />
            {isBangla ? "ক্রয় ফেরত বিবরণ" : "Purchase Return Details"}
          </h1>
          <Badge
            variant="outline"
            className="text-xs font-mono border-primary/30 text-primary bg-primary/10"
          >
            {returnDetails.returnNo}
          </Badge>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 capitalize">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {returnDetails.status}
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            onClick={handlePrint}
            className="h-9 text-xs bg-primary hover:bg-primary/95 text-primary-foreground font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>{isBangla ? "প্রিন্ট করুন" : "Print Invoice"}</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/purchases/returns")}
            className="h-9 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            {isBangla ? "পেছনে" : "Back"}
          </Button>
        </div>
      </div>

      {/* Top Card: Purchase Invoice & Return Overview (Matching new return form layout) */}
      <div className="bg-zinc-900/20 border border-border rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Receipt className="h-4 w-4" />
            <span>{isBangla ? "ক্রয় ইনভয়েস তথ্য" : "Purchase Invoice Details"}</span>
          </div>
        </div>

        {/* 4-Column Grid: Purchase Invoice, Supplier, Purchase Date, Return Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* Field 1: Purchase Invoice */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">
              {isBangla ? "ক্রয় ইনভয়েস" : "Purchase Invoice"}
            </Label>
            <Input
              readOnly
              disabled
              value={returnDetails.purchaseInvoiceNo}
              className="h-11 bg-muted/40 border-input text-sm font-bold text-foreground cursor-not-allowed disabled:opacity-90 font-mono"
            />
          </div>

          {/* Field 2: Supplier */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">
              {isBangla ? "সরবরাহকারী" : "Supplier"}
            </Label>
            <Input
              readOnly
              disabled
              value={returnDetails.supplierName}
              className="h-11 bg-muted/40 border-input text-sm font-bold text-foreground cursor-not-allowed disabled:opacity-90"
            />
          </div>

          {/* Field 3: Purchase Date */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">
              {isBangla ? "ক্রয় তারিখ" : "Purchase Date"}
            </Label>
            <Input
              readOnly
              disabled
              value={
                returnDetails.purchaseDate && !isNaN(new Date(returnDetails.purchaseDate).getTime())
                  ? format(new Date(returnDetails.purchaseDate), "dd MMM yyyy")
                  : "—"
              }
              className="h-11 bg-muted/40 border-input text-sm font-semibold text-foreground cursor-not-allowed disabled:opacity-90"
            />
          </div>

          {/* Field 4: Return Date */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">
              {isBangla ? "ফেরতের তারিখ" : "Return Date"}
            </Label>
            <div className="relative">
              <Input
                readOnly
                disabled
                value={
                  returnDetails.returnDate && !isNaN(new Date(returnDetails.returnDate).getTime())
                    ? format(new Date(returnDetails.returnDate), "dd MMM yyyy")
                    : "—"
                }
                className="h-11 bg-muted/40 border-input text-sm font-semibold text-foreground cursor-not-allowed disabled:opacity-90 pr-10"
              />
              <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>

      {/* Main 12-column grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Section (Spans 9 columns on desktop) */}
        <div className="lg:col-span-9 space-y-6">
          {/* Return Items List Table */}
          <div className="bg-zinc-900/20 border border-border rounded-xl overflow-hidden shadow-xs space-y-4">
            {/* Purchase Billing Info Bar */}
            {returnDetails.purchaseTotal > 0 && (
              <div className="px-4 py-2.5 bg-muted/40 border-b border-border/50 flex flex-wrap items-center justify-between gap-3 text-xs font-medium">
                <div className="flex items-center gap-2 flex-wrap text-muted-foreground text-xs">
                  <span className="font-bold text-foreground">
                    {isBangla ? "মূল ইনভয়েস বিলিং তথ্য:" : "Original Billing Info:"}
                  </span>
                </div>
                <div className="flex items-center gap-3.5 flex-wrap text-xs">
                  <span>
                    {isBangla ? "মোট ইনভয়েস:" : "Total:"}{" "}
                    <strong className="font-bold text-foreground font-mono">
                      {formatCurrency(returnDetails.purchaseTotal)}
                    </strong>
                  </span>
                  <span>
                    {isBangla ? "পরিশোধিত:" : "Paid:"}{" "}
                    <strong className="font-bold text-emerald-500 font-mono">
                      {formatCurrency(returnDetails.purchasePaid)}
                    </strong>
                  </span>
                  <span>
                    {isBangla ? "বাকি:" : "Due:"}{" "}
                    <strong className="font-bold text-rose-500 font-mono">
                      {formatCurrency(returnDetails.purchaseDue)}
                    </strong>
                  </span>
                </div>
              </div>
            )}

            <div className="px-5 py-2 border-b border-border flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">
                {isBangla ? "ফেরতযোগ্য পণ্য তালিকা" : "Returnable Items Details"}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {returnDetails.items.length} {isBangla ? "টি আইটেম" : "item(s)"}
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-border/80 bg-muted/20 text-muted-foreground font-semibold">
                    <th className="px-4 py-3">{isBangla ? "আইটেম বিবরণ" : "Item & SKU"}</th>
                    <th className="px-3 py-3 text-right">{isBangla ? "মূল্য" : "Purchase Price"}</th>
                    <th className="px-3 py-3 text-center">{isBangla ? "ট্যাক্স (%)" : "Tax (%)"}</th>
                    <th className="px-3 py-3 text-center">{isBangla ? "ক্রয় পরিমাণ" : "Purchase Qty"}</th>
                    <th className="px-4 py-3 text-center">{isBangla ? "ফেরত পরিমাণ" : "Return Qty"}</th>
                    <th className="px-3 py-3">{isBangla ? "ফেরত টাইপ" : "Return Type"}</th>
                    <th className="px-3 py-3">{isBangla ? "কারণ" : "Reason"}</th>
                    <th className="px-3 py-3 text-right">{isBangla ? "মোট" : "Total"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {returnDetails.items.map((item: any, idx: number) => (
                    <tr key={item.id || idx} className="hover:bg-muted/10 transition-colors">
                      <td className="px-4 py-3.5 align-middle">
                        <p className="font-semibold text-foreground text-xs leading-tight">{item.itemName}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">SKU: {item.sku}</p>
                        {item.batchNo && (
                          <span className="inline-block mt-0.5 text-[9px] bg-muted/60 text-muted-foreground px-1.5 py-0.5 rounded font-mono">
                            Batch: {item.batchNo}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3.5 align-middle text-right font-medium text-foreground font-mono">
                        {formatCurrency(item.unitCost)}
                      </td>
                      <td className="px-3 py-3.5 align-middle text-center text-muted-foreground font-semibold">
                        {item.taxPercent || 0}%
                      </td>
                      <td className="px-3 py-3.5 align-middle text-center text-muted-foreground font-medium">
                        {item.maxQuantity || item.quantity} {item.unit}
                      </td>
                      <td className="px-4 py-3.5 align-middle text-center">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-primary/10 text-primary font-bold text-xs">
                          {item.quantity} {item.unit}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 align-middle">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-background/50 border border-border/60 text-xs font-semibold text-foreground capitalize">
                          {item.returnType}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 align-middle">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-background/50 border border-border/60 text-xs text-muted-foreground capitalize">
                          {item.reason}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 align-middle text-right font-bold text-foreground font-mono text-xs">
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom summary bar */}
            <div className="flex justify-end items-center px-5 py-3.5 bg-muted/10 border-t border-border">
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground font-semibold text-xs">
                  {isBangla ? "আইটেম উপমোট পরিমাণ" : "Return Subtotal Amount"}
                </span>
                <span className="font-bold text-foreground text-sm font-mono">
                  {formatCurrency(returnDetails.subtotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes & Invoice Image Card */}
          <div className="bg-zinc-900/20 border border-border rounded-xl p-5 shadow-xs space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Remarks/Notes */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  {isBangla ? "মন্তব্য বা বিশেষ নির্দেশনা" : "Remarks or Special Notes"}
                </Label>
                <Textarea
                  readOnly
                  disabled
                  value={returnDetails.notes || (isBangla ? "কোনো মন্তব্য নেই" : "No special remarks")}
                  className="h-32 bg-background/50 border-input resize-none text-xs disabled:opacity-90"
                />
              </div>

              {/* Invoice Image Preview */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  {isBangla ? "ইনভয়েস বা রসিদের ছবি" : "Invoice / Receipt Image"}
                </Label>
                {returnDetails.invoiceImage ? (
                  <div className="relative h-32 w-full rounded-lg border border-border bg-background/50 overflow-hidden flex items-center justify-center">
                    <img
                      src={returnDetails.invoiceImage}
                      alt="Invoice preview"
                      className="h-full w-full object-contain p-1"
                    />
                  </div>
                ) : (
                  <div className="h-32 w-full rounded-lg border-2 border-dashed border-input bg-background/30 flex flex-col items-center justify-center text-center p-4">
                    <ImageIcon className="h-6 w-6 text-muted-foreground mb-1.5 opacity-50" />
                    <span className="text-xs text-muted-foreground">
                      {isBangla ? "কোনো ছবি সংযুক্ত নেই" : "No invoice image attached"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Refund Summary sticky card (3 columns on desktop) */}
        <div className="lg:col-span-3 lg:sticky lg:top-6 space-y-6">
          <div className="bg-zinc-900/20 border border-border rounded-xl p-5 space-y-4 shadow-xs">
            <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">
              {isBangla ? "ফেরত বিবরণী" : "Refund Summary"}
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>{isBangla ? "আইটেম উপমোট" : "Item Subtotal"}</span>
                <span className="font-semibold text-foreground font-mono">{formatCurrency(returnDetails.subtotal)}</span>
              </div>

              {/* Calculated Tax */}
              <div className="flex justify-between items-center text-muted-foreground pt-1.5 border-t border-border/40">
                <span>{isBangla ? "ট্যাক্স" : "Tax"}</span>
                <span className="font-semibold text-foreground font-mono">{formatCurrency(returnDetails.taxAmount)}</span>
              </div>

              {/* Additional Cost */}
              <div className="flex justify-between items-center text-muted-foreground">
                <span>{isBangla ? "অতিরিক্ত খরচ" : "Additional Cost"}</span>
                <span className="font-semibold text-foreground font-mono">{formatCurrency(returnDetails.additionalCharges)}</span>
              </div>

              {/* Grand Total */}
              <div className="flex justify-between items-center border-t border-border pt-3 text-sm font-bold">
                <span className="text-foreground">{isBangla ? "সর্বমোট ফেরতযোগ্য" : "Grand Total"}</span>
                <span className="text-primary text-base font-mono">{formatCurrency(returnDetails.grandTotal)}</span>
              </div>

              {/* Refund Method Section */}
              <div className="pt-3 border-t border-border space-y-3">
                <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  {isBangla ? "রিফান্ড মাধ্যম" : "Refund Method"}
                </Label>

                {/* Method Chip Display */}
                <div className="grid grid-cols-3 gap-2">
                  {METHODS.map((m) => {
                    const Icon = m.icon;
                    const isActive = returnDetails.refundMethod === m.id;
                    return (
                      <div
                        key={m.id}
                        className={cn(
                          "flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all",
                          isActive
                            ? cn(m.bgClass, m.borderClass)
                            : "border-border/40 bg-transparent opacity-40"
                        )}
                      >
                        <Icon
                          size={18}
                          className={isActive ? m.colorClass : "text-muted-foreground"}
                          strokeWidth={2}
                        />
                        <span
                          className={cn(
                            "text-[10px] font-medium leading-tight text-center",
                            isActive ? m.colorClass : "text-muted-foreground"
                          )}
                        >
                          {m.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Account Details if applicable */}
                {returnDetails.accountName && (
                  <div className="flex justify-between items-center text-xs text-muted-foreground bg-background/40 p-2.5 rounded-lg border border-border/50">
                    <span>{isBangla ? "অ্যাকাউন্ট" : "Account"}:</span>
                    <span className="font-semibold text-foreground">{returnDetails.accountName}</span>
                  </div>
                )}

                {/* Refund Paid Info */}
                <div className="flex justify-between items-center text-muted-foreground pt-1.5 border-t border-border/40 mt-1.5">
                  <span>{isBangla ? "রিফান্ড পরিমাণ" : "Refund Amount"}</span>
                  <span className="font-bold text-foreground font-mono">{formatCurrency(returnDetails.refundAmount)}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions inside Sticky Panel */}
            <div className="space-y-2 pt-3 border-t border-border">
              <Button
                type="button"
                onClick={handlePrint}
                className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center justify-center gap-1.5 cursor-pointer text-xs"
              >
                <Printer className="h-4 w-4" />
                <span>{isBangla ? "রিটার্ন ইনভয়েস প্রিন্ট করুন" : "Print Return Invoice"}</span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/purchases/returns")}
                className="w-full h-9 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {isBangla ? "পেছনে ফিরে যান" : "Back to Purchase Returns"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PurchaseReturnDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <PurchaseReturnDetailsContent />
    </Suspense>
  );
}
