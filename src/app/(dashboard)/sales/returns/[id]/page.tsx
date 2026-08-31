// Hello Khata OS - Sales Return Details View Page
// হ্যালো খাতা - বিক্রয় ফেরত বিবরণ পেজ

"use client";

import React, { useMemo, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  RotateCcw,
  ArrowLeft,
  Loader2,
  Receipt,
  FileText,
  ImageIcon,
  Download,
  Banknote,
  Smartphone,
  CreditCard,
  Calendar as CalendarIcon,
  Printer,
} from "lucide-react";
import { useCurrency, useAppTranslation } from "@/hooks/useAppTranslation";
import { useGetSalesReturnById } from "@/hooks/api/useReturns";
import { useGetSaleById } from "@/hooks/api/useSales";
import { useParty } from "@/hooks/api/useParties";

function SalesReturnDetailsContent() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) || "";

  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();

  // Fetch Return Details from API
  const { data: apiReturnData, isLoading } = useGetSalesReturnById(id);

  // If saleId exists, fetch the sale data to get full invoice total, paid, due, sale date
  const saleId = apiReturnData?.saleId || "";
  const { data: singleSaleData } = useGetSaleById(saleId);
  const sale = singleSaleData?.data || apiReturnData?.sale || {};

  // If partyId exists, fetch party to get customer phone/name
  const partyId = apiReturnData?.partyId || sale?.partyId || "";
  const { data: partyData } = useParty(partyId, { enabled: !!partyId });
  const party =
    partyData?.data || partyData || sale?.party || apiReturnData?.party || {};

  const returnData = useMemo(() => {
    if (!apiReturnData) return null;
    const saleItems = sale.items || [];

    // Map return items
    const rawItems = apiReturnData.items || [];
    const items = rawItems.map((it: any, idx: number) => {
      const originalSaleItem = saleItems.find(
        (si: any) => si.id === it.saleItemId || si.itemId === it.itemId,
      );
      return {
        id: it.id || String(idx),
        itemName:
          it.itemName ||
          originalSaleItem?.itemName ||
          originalSaleItem?.item?.name ||
          "Product",
        sku:
          it.sku ||
          originalSaleItem?.sku ||
          originalSaleItem?.item?.sku ||
          "—",
        unitPrice: Number(it.unitPrice ?? originalSaleItem?.unitPrice ?? 0),
        soldQuantity: originalSaleItem?.quantity,
        quantity: Number(it.quantity ?? 1),
        maxQuantity: originalSaleItem?.quantity,
        returnType: it.returnType || "refund",
        reason: it.reason || apiReturnData.reason || "defective",
        total: Number(it.total ?? it.quantity * it.unitPrice ?? 0),
      };
    });

    const invoiceTotal = Number(sale.total ?? apiReturnData.subtotal ?? 0);
    const paidAmount = Number(sale.paidAmount ?? sale.paid ?? invoiceTotal);
    const dueBalance = Number(sale.dueAmount ?? invoiceTotal - paidAmount);

    return {
      id: apiReturnData.id || id,
      returnNo: apiReturnData.returnNo || `SR-${id.slice(-6)}`,
      saleInvoiceNo: sale.invoiceNo || apiReturnData.sale?.invoiceNo || "—",
      createdAt: apiReturnData.createdAt || new Date().toISOString(),
      saleDate: sale.createdAt || apiReturnData.createdAt,
      partyName:
        party.name ||
        apiReturnData.partyName ||
        (isBangla ? "খুচরা কাস্টমার" : "Retail Customer"),
      phone: party.phone || sale.phone || "—",
      invoiceTotal,
      paidAmount,
      dueBalance,
      items,
      notes: apiReturnData.notes || "",
      imageUrl: apiReturnData.imageUrl || null,
      refundMethod: apiReturnData.refundMethod || "cash",
      accountId: apiReturnData.accountId || "",
      status: apiReturnData.status || "completed",
    };
  }, [apiReturnData, sale, party, id, isBangla]);

  const subtotalRefund = useMemo(() => {
    if (!returnData) return 0;
    return returnData.items.reduce(
      (sum: number, item: any) => sum + (item.total || item.quantity * item.unitPrice),
      0,
    );
  }, [returnData]);

  const grandTotalRefund = useMemo(() => {
    return Math.max(0, subtotalRefund);
  }, [subtotalRefund]);

  const handlePrint = () => {
    window.print();
  };

  const getReturnTypeLabel = (type?: string) => {
    if (!type) return isBangla ? "রিফান্ড" : "Refund";
    const map: Record<string, { en: string; bn: string }> = {
      refund: { en: "Refund", bn: "রিফান্ড" },
      exchange: { en: "Exchange", bn: "বিনিময়" },
      restock: { en: "Return to Stock", bn: "স্টকে ফেরত" },
      damage: { en: "Damaged", bn: "ড্যামেজ" },
      damaged: { en: "Damaged", bn: "ড্যামেজ" },
    };
    return map[type.toLowerCase()]
      ? isBangla
        ? map[type.toLowerCase()].bn
        : map[type.toLowerCase()].en
      : type;
  };

  const getReasonLabel = (reason?: string) => {
    if (!reason) return isBangla ? "ত্রুটিপূর্ণ" : "Defective";
    const map: Record<string, { en: string; bn: string }> = {
      defective: { en: "Defective / Damaged", bn: "ত্রুটিপূর্ণ / ড্যামেজ" },
      damaged: { en: "Defective / Damaged", bn: "ত্রুটিপূর্ণ / ড্যামেজ" },
      expired: { en: "Expired", bn: "মেয়াদোত্তীর্ণ" },
      wrong_item: { en: "Wrong Item", bn: "ভুল পণ্য" },
      not_satisfied: { en: "Not Satisfied", bn: "গ্রাহক অসন্তুষ্ট" },
      customer_change_mind: { en: "Customer Request", bn: "কাস্টমারের অনুরোধ" },
      other: { en: "Other", bn: "অন্যান্য" },
    };
    return map[reason.toLowerCase()]
      ? isBangla
        ? map[reason.toLowerCase()].bn
        : map[reason.toLowerCase()].en
      : reason;
  };

  const getRefundMethodLabel = (method?: string) => {
    if (!method) return isBangla ? "নগদ" : "Cash";
    const m = method.toLowerCase();
    if (m === "cash") return isBangla ? "নগদ" : "Cash";
    if (m === "card") return isBangla ? "কার্ড" : "Card";
    if (m === "mobile_banking" || m === "bkash" || m === "nagad") {
      return isBangla ? "মোবাইল ব্যাংকিং" : "Mobile Banking";
    }
    if (m === "bank" || m === "bank_transfer") return isBangla ? "ব্যাংক" : "Bank";
    if (m === "credit_note") return isBangla ? "ক্রেডিট নোট" : "Credit Note";
    return method.charAt(0).toUpperCase() + method.slice(1);
  };

  const statusConfig: Record<string, { label: string; color: string }> = {
    completed: {
      label: isBangla ? "সম্পন্ন" : "Completed",
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    pending: {
      label: isBangla ? "অপেক্ষমান" : "Pending",
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    approved: {
      label: isBangla ? "অনুমোদিত" : "Approved",
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    rejected: {
      label: isBangla ? "বাতিল" : "Rejected",
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    },
    refunded: {
      label: isBangla ? "রিফান্ডেড" : "Refunded",
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    },
    processing: {
      label: isBangla ? "প্রক্রিয়াধীন" : "Processing",
      color: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    },
    cancelled: {
      label: isBangla ? "বাতিল" : "Cancelled",
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!returnData) {
    return (
      <div className="bg-card border border-border rounded-xl p-12 text-center space-y-3">
        <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
          <RotateCcw className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-foreground">
          {isBangla ? "রিটার্ন তথ্য পাওয়া যায়নি" : "Sales Return Not Found"}
        </h3>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {isBangla ? "পেছনে ফিরে যান" : "Go Back"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <RotateCcw className="h-6 w-6 text-red-500" />
            {isBangla ? "বিক্রয় ফেরত বিবরণ" : "Sales Return Details"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isBangla
              ? "ফেরতকৃত বিক্রয়ের বিস্তারিত তথ্য ও পণ্যের তালিকা"
              : "Detailed information and returned item list"}
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {isBangla ? "পেছনে" : "Back"}
        </Button>
      </div>

      {/* Main Sales Invoice Card (Structure matching new sales return) */}
      <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm space-y-4">
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Receipt className="h-4 w-4" />
            <span>{isBangla ? "বিক্রয় ইনভয়েস" : "Sales Invoice"}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{isBangla ? "রিটার্ন নং:" : "Return No:"}</span>
            <span className="font-mono font-bold text-primary px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
              {returnData.returnNo}
            </span>
          </div>
        </div>

        {/* 4-Column Grid: Original Sale Invoice, Phone, Customer, Return Date (25% width each) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* Field 1 (25%): Original Sale Invoice */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">
              {isBangla ? "মূল ইনভয়েস" : "Original Sale Invoice"}
            </Label>
            <div className="h-11 px-3.5 flex items-center justify-between rounded-lg bg-background/50 border border-input text-sm font-semibold text-foreground">
              <span className="font-mono">{returnData.saleInvoiceNo || "—"}</span>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Field 2 (25%): Phone */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">
              {isBangla ? "ফোন নম্বর" : "Phone"}
            </Label>
            <div className="h-11 px-3.5 flex items-center rounded-lg bg-background/50 border border-input text-sm font-semibold text-foreground">
              <span>{returnData.phone || "—"}</span>
            </div>
          </div>

          {/* Field 3 (25%): Customer */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">
              {isBangla ? "গ্রাহক" : "Customer"}
            </Label>
            <div className="h-11 px-3.5 flex items-center rounded-lg bg-background/50 border border-input text-sm font-bold text-foreground">
              <span>{returnData.partyName}</span>
            </div>
          </div>

          {/* Field 4 (25%): Return Date */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">
              {isBangla ? "ফেরতের তারিখ" : "Return Date"}
            </Label>
            <div className="h-11 px-3.5 flex items-center justify-between rounded-lg bg-background/50 border border-input text-sm font-medium text-foreground">
              <span>
                {returnData.createdAt
                  ? format(new Date(returnData.createdAt), "dd MMM yyyy")
                  : "—"}
              </span>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>

      {/* 75% / 25% Split Layout Container (Structure matching new sales return) */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Side (75% on Desktop) */}
        <div className="w-full lg:w-[75%] space-y-6">
          {/* Return Items Table */}
          <div className="border border-border rounded-xl bg-card overflow-x-auto shadow-sm">
            {/* Sales Billing Info Bar at the top of the table */}
            <div className="px-4 py-2.5 bg-muted/40 border-b border-border/50 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-medium">
              <div className="flex items-center gap-2 flex-wrap text-muted-foreground text-xs">
                <span>
                  {isBangla ? "তারিখ:" : "Invoice Date:"}{" "}
                  <strong className="text-foreground">
                    {returnData.saleDate
                      ? format(new Date(returnData.saleDate), "dd MMM yyyy")
                      : "—"}
                  </strong>
                </span>
              </div>

              <div className="flex items-center gap-3.5 flex-wrap text-xs">
                <span>
                  {isBangla ? "মোট ইনভয়েস:" : "Total:"}{" "}
                  <strong className="font-bold text-foreground font-mono">
                    {formatCurrency(returnData.invoiceTotal || 0)}
                  </strong>
                </span>
                <span>
                  {isBangla ? "পরিশোধিত:" : "Paid:"}{" "}
                  <strong className="font-bold text-emerald-500 font-mono">
                    {formatCurrency(returnData.paidAmount || 0)}
                  </strong>
                </span>
                <span>
                  {isBangla ? "বাকি:" : "Due:"}{" "}
                  <strong className="font-bold text-rose-500 font-mono">
                    {formatCurrency(returnData.dueBalance || 0)}
                  </strong>
                </span>
              </div>
            </div>

            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">
                {isBangla ? "ফেরতযোগ্য পণ্য তালিকা" : "Returnable Items Details"}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                {returnData.items.length} {isBangla ? "টি পণ্য" : "items"}
              </span>
            </div>

            <Table>
              <TableHeader className="bg-muted/20">
                <TableRow className="border-b border-border/80 text-muted-foreground font-semibold">
                  <TableHead className="px-4 py-3 text-xs font-semibold">
                    {isBangla ? "আইটেম বিবরণ" : "Item & SKU"}
                  </TableHead>
                  <TableHead className="px-3 py-3 text-right text-xs font-semibold">
                    {isBangla ? "বিক্রয় মূল্য" : "Selling Price"}
                  </TableHead>
                  <TableHead className="px-3 py-3 text-center text-xs font-semibold">
                    {isBangla ? "বিক্রয় পরিমাণ" : "Sold Qty"}
                  </TableHead>
                  <TableHead className="px-4 py-3 text-center text-xs font-semibold">
                    {isBangla ? "ফেরত পরিমাণ" : "Return Qty"}
                  </TableHead>
                  <TableHead className="px-3 py-3 text-xs font-semibold">
                    {isBangla ? "ফেরত টাইপ" : "Return Type"}
                  </TableHead>
                  <TableHead className="px-3 py-3 text-xs font-semibold">
                    {isBangla ? "কারণ" : "Reason"}
                  </TableHead>
                  <TableHead className="px-4 py-3 text-right text-xs font-semibold">
                    {isBangla ? "মোট" : "Total"}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border/60">
                {returnData.items.map((item: any, idx: number) => (
                  <TableRow
                    key={item.id || idx}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    {/* Item & SKU */}
                    <TableCell className="px-4 py-3.5 align-middle">
                      <p className="font-semibold text-foreground text-xs leading-tight">
                        {item.itemName}
                      </p>
                      {item.sku && item.sku !== "—" && (
                        <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                          SKU: {item.sku}
                        </p>
                      )}
                    </TableCell>

                    {/* Selling Price */}
                    <TableCell className="px-3 py-3.5 align-middle text-right font-medium text-foreground text-xs font-mono">
                      {formatCurrency(item.unitPrice)}
                    </TableCell>

                    {/* Sold Quantity */}
                    <TableCell className="px-3 py-3.5 align-middle text-center text-muted-foreground font-medium text-xs font-mono">
                      {item.maxQuantity ?? item.soldQuantity ?? item.quantity ?? 1}
                    </TableCell>

                    {/* Return Quantity (Normal text display) */}
                    <TableCell className="px-4 py-3.5 align-middle text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded bg-background/80 border border-input font-bold text-foreground text-xs font-mono min-w-[36px]">
                        {item.quantity}
                      </span>
                    </TableCell>

                    {/* Return Type (Normal badge display) */}
                    <TableCell className="px-3 py-3.5 align-middle">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {getReturnTypeLabel(item.returnType)}
                      </span>
                    </TableCell>

                    {/* Return Reason (Normal badge display) */}
                    <TableCell className="px-3 py-3.5 align-middle">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {getReasonLabel(item.reason)}
                      </span>
                    </TableCell>

                    {/* Total Refund for line */}
                    <TableCell className="px-4 py-3.5 align-middle text-right font-bold text-foreground text-xs font-mono">
                      {formatCurrency(
                        item.total ?? item.quantity * item.unitPrice,
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Bottom summary bar */}
            <div className="flex justify-end items-center px-5 py-3.5 bg-muted/10 border-t border-border">
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground font-semibold text-xs">
                  {isBangla ? "আইটেম উপমোট পরিমাণ" : "Return Subtotal Amount"}
                </span>
                <span className="font-bold text-foreground text-sm font-mono">
                  {formatCurrency(subtotalRefund)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes & Attachment Card */}
          <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {/* Left Column: Notes */}
              <div className="flex flex-col space-y-2 h-full">
                <Label className="text-xs font-medium text-foreground flex items-center gap-2 shrink-0">
                  <FileText className="h-4 w-4 text-primary" />
                  {isBangla ? "মন্তব্য" : "Notes"}
                </Label>
                <div className="bg-background/50 border border-input rounded-md p-3 text-sm text-foreground flex-1 min-h-[140px] whitespace-pre-wrap">
                  {returnData.notes ||
                    (isBangla ? "কোনো মন্তব্য নেই" : "No notes provided")}
                </div>
              </div>

              {/* Right Column: Return Image / Document */}
              <div className="flex flex-col space-y-2 h-full">
                <Label className="text-xs font-medium text-foreground flex items-center gap-2 shrink-0">
                  <ImageIcon className="h-4 w-4 text-primary" />
                  {isBangla ? "প্রমাণ ডকুমেন্ট / ছবি" : "Return Image / Document"}
                </Label>

                {returnData.imageUrl ? (
                  <div className="relative rounded-lg border border-border overflow-hidden bg-background/50 flex-1 min-h-[140px] h-full flex items-center justify-center p-2">
                    <img
                      src={returnData.imageUrl}
                      alt="Return proof"
                      className="h-full w-full object-contain max-h-[160px] rounded"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center flex-1 min-h-[140px] h-full border-2 border-dashed border-border/80 rounded-lg bg-background/30 p-4 text-center">
                    <ImageIcon className="h-6 w-6 text-muted-foreground mb-1.5 opacity-40" />
                    <span className="text-xs text-muted-foreground">
                      {isBangla
                        ? "কোনো ছবি আপলোড করা হয়নি"
                        : "No image attached"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Return Summary Sidebar (25% on Desktop) */}
        <div className="w-full lg:w-[25%] space-y-6">
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-lg space-y-5 sticky top-6">
            <h2 className="text-base font-bold text-foreground border-b border-border/50 pb-3 flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-red-500" />
              {isBangla ? "রিটার্ন সারসংক্ষেপ" : "Return Summary"}
            </h2>

            {/* Calculations Breakdown */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>{isBangla ? "মোট ফেরত পণ্য" : "Total Return Items"}</span>
                <span className="font-semibold text-foreground font-mono">
                  {returnData.items.length}
                </span>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <span>{isBangla ? "ফেরত উপমোট" : "Subtotal"}</span>
                <span className="font-medium text-foreground font-mono">
                  {formatCurrency(subtotalRefund)}
                </span>
              </div>

              <div className="pt-3 border-t border-border/60 flex justify-between items-center">
                <span className="font-bold text-foreground text-base">
                  {isBangla ? "মোট রিফান্ড" : "Grand Refund Total"}
                </span>
                <span className="text-xl font-extrabold text-red-500 font-mono">
                  {formatCurrency(grandTotalRefund)}
                </span>
              </div>
            </div>

            {/* Refund Payment Method */}
            <div className="space-y-2 pt-3 border-t border-border/60">
              <Label className="text-xs font-semibold text-foreground">
                {isBangla ? "রিফান্ড মাধ্যম" : "Refund Method"}
              </Label>
              <div className="p-3 rounded-lg border border-border bg-background/50 flex items-center gap-3">
                {returnData.refundMethod?.toLowerCase() === "cash" ? (
                  <Banknote className="h-5 w-5 text-emerald-400 shrink-0" />
                ) : returnData.refundMethod?.toLowerCase() === "card" ? (
                  <CreditCard className="h-5 w-5 text-blue-400 shrink-0" />
                ) : (
                  <Smartphone className="h-5 w-5 text-amber-400 shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-xs text-foreground">
                    {getRefundMethodLabel(returnData.refundMethod)}
                  </p>
                  {returnData.accountId && (
                    <p className="text-[11px] font-mono text-muted-foreground truncate mt-0.5">
                      {returnData.accountId}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2 pt-2">
              <Label className="text-xs font-semibold text-foreground">
                {isBangla ? "স্ট্যাটাস" : "Status"}
              </Label>
              <div>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${
                    statusConfig[returnData.status?.toLowerCase()]?.color ||
                    "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {statusConfig[returnData.status?.toLowerCase()]?.label ||
                    returnData.status}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-4 border-t border-border/60">
              <Button
                onClick={handlePrint}
                className="w-full h-11 bg-primary text-primary-foreground font-bold text-sm transition-all gap-2 cursor-pointer shadow-md hover:bg-primary/90"
              >
                <Printer className="h-4 w-4" />
                {isBangla ? "ইনভয়েস প্রিন্ট করুন" : "Print Invoice"}
              </Button>

              <Button
                variant="outline"
                onClick={() => router.back()}
                className="w-full h-10 border-border/80 hover:bg-muted font-medium text-sm gap-2 text-foreground cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                {isBangla ? "পেছনে" : "Back"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SalesReturnDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <SalesReturnDetailsContent />
    </Suspense>
  );
}

