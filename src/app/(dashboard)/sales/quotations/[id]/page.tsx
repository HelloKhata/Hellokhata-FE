// Hello Khata OS - Quotation Details View Page
// হ্যালো খাতা - কোটেশন বিবরণ পেজ

"use client";

import { useMemo, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ArrowLeft, Users, Loader2, Sparkles, ShoppingCart, FileText } from "lucide-react";
import { useCurrency, useAppTranslation } from "@/hooks/useAppTranslation";
import { useGetQuotationById } from "@/hooks/api/useQuotations";
import { QUOTATION_STATUS_CONFIG } from "@/types/quotation";
import Image from "next/image";
import { cn } from "@/lib/utils";

const mockQuotationData = {
  id: "q-1",
  quotationNo: "QT-2026-001",
  partyName: "Kazi Shohel",
  party: {
    name: "Kazi Shohel",
    phone: "01712345678",
    currentBalance: -5000,
    creditLimit: 50000,
  },
  quotationDate: "2026-07-20T10:00:00Z",
  validityDate: "2026-08-20T10:00:00Z",
  status: "sent",
  notes:
    "Quotation valid for 30 days. Prices are inclusive of tax and delivery.",
  subtotal: 15000,
  discount: 500,
  tax: 300,
  vat: 450,
  additionalCharge: 250,
  total: 15500,
  items: [
    {
      id: "1",
      itemName: "Premium Basmati Rice 5kg",
      batchNo: "BATCH-R204",
      quantity: 2,
      unitPrice: 4200,
      discount: 200,
      total: 8000,
      imageUrl: "",
    },
    {
      id: "2",
      itemName: "Pure Soybean Oil 5L",
      batchNo: "BATCH-O802",
      quantity: 3,
      unitPrice: 2200,
      discount: 300,
      total: 6300,
      imageUrl: "",
    },
  ],
};

function QuotationDetailsContent() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();

  const { data: quotationResponse, isLoading } = useGetQuotationById(id);
  const qData = quotationResponse?.data || mockQuotationData;
  const party = qData.party;

  const partyName =
    qData.partyName ||
    party?.name ||
    (isBangla ? "সাধারণ গ্রাহক" : "Walk-in Customer");
  const quotationNo = qData.quotationNo || "—";
  const quotationDate = qData.quotationDate
    ? new Date(qData.quotationDate)
    : new Date();
  const validityDate = qData.validityDate
    ? new Date(qData.validityDate)
    : new Date();
  const notes = qData.notes || "";

  const selectedItems = useMemo(() => {
    const items = qData.items || [];
    return items.map((item: any, idx: number) => ({
      id: item.id || String(idx),
      itemName: item.itemName,
      batchNo: item.batchNo || "—",
      quantity: item.quantity || 0,
      unitPrice: item.unitPrice || 0,
      discountFlat: item.discount || 0,
      total:
        item.total || item.quantity * item.unitPrice - (item.discount || 0),
      imageUrl: item.imageUrl || "",
    }));
  }, [qData]);

  const rawSubtotal = qData?.subtotal || qData?.total || 0;
  const totalDiscount = qData?.discount || 0;
  const subtotalAfterDiscount = Math.max(0, rawSubtotal - totalDiscount);
  const taxVal = qData?.tax || 0;
  const vatVal = qData?.vat || 0;
  const additionalChargeVal = qData?.additionalCharge || 0;
  const grandTotal = qData?.total || 0;

  const statusConfig = QUOTATION_STATUS_CONFIG[qData.status || "sent"] || QUOTATION_STATUS_CONFIG.sent;

  return (
    <div className="space-y-6">
      {/* Top Header Section */}
      <div className="flex items-center justify-between pb-2 border-b border-border/40">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          {isBangla ? "কোটেশন বিবরণ" : "Quotation Details"}
        </h1>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {isBangla ? "পেছনে" : "Back"}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        /* 75% / 25% Split Layout Container */
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Side (75% on Desktop) */}
          <div className="w-full lg:w-[75%] space-y-6">
            {/* Row 1 Layout: Select Party, Quotation No, Dates */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end bg-card border border-border/50 rounded-xl p-5 shadow-sm">
              {/* Party Name */}
              <div className="space-y-2 md:col-span-1">
                <Label className="text-sm font-medium text-foreground">
                  {isBangla ? "পার্টি" : "Party"}
                </Label>
                <div className="relative">
                  <Input
                    value={partyName}
                    readOnly
                    className="pr-10 h-11 bg-background/50 border-input cursor-default focus-visible:ring-0"
                  />
                  <Users className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {/* Quotation No */}
              <div className="space-y-2 md:col-span-1">
                <Label className="text-sm font-medium text-foreground">
                  {isBangla ? "কোটেশন নম্বর" : "Quotation No"}
                </Label>
                <Input
                  value={quotationNo}
                  readOnly
                  className="h-11 bg-background/50 border-input font-medium cursor-default focus-visible:ring-0"
                />
              </div>

              {/* Quotation Date */}
              <div className="space-y-2 md:col-span-1">
                <Label className="text-sm font-medium text-foreground">
                  {isBangla ? "কোটেশন তারিখ" : "Quotation Date"}
                </Label>
                <Input
                  value={format(quotationDate, "dd MMM yyyy")}
                  readOnly
                  className="h-11 bg-background/50 border-input font-medium cursor-default focus-visible:ring-0"
                />
              </div>

              {/* Validity Date */}
              <div className="space-y-2 md:col-span-1">
                <Label className="text-sm font-medium text-foreground">
                  {isBangla ? "মেয়াদ শেষ হওয়ার তারিখ" : "Validity Date"}
                </Label>
                <Input
                  value={format(validityDate, "dd MMM yyyy")}
                  readOnly
                  className="h-11 bg-background/50 border-input font-medium cursor-default focus-visible:ring-0"
                />
              </div>
            </div>

            {/* Customer Info Card (if selected) */}
            {party && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-primary font-semibold text-xs border-b border-primary/10 pb-2">
                  <Users className="h-4 w-4" />
                  <span>
                    {isBangla ? "গ্রাহক সংক্ষিপ্ত বিবরণ" : "Customer Overview"}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      {isBangla ? "গ্রাহকের নাম" : "Customer Name"}
                    </p>
                    <p className="font-semibold text-foreground truncate mt-0.5">
                      {party.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      {isBangla ? "মোবাইল" : "Phone"}
                    </p>
                    <p className="font-semibold text-foreground truncate mt-0.5">
                      {party.phone || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-rose-400/80 uppercase tracking-wide">
                      {isBangla ? "বর্তমান বাকি" : "Current Due"}
                    </p>
                    <p className="font-bold text-rose-500 mt-0.5">
                      {formatCurrency(Math.abs(party.currentBalance || 0))}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      {isBangla ? "ক্রেডিট লিমিট" : "Credit Limit"}
                    </p>
                    <p className="font-semibold text-foreground mt-0.5">
                      {party.creditLimit
                        ? formatCurrency(party.creditLimit)
                        : isBangla
                          ? "সীমাহীন"
                          : "Unlimited"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Row 2: Billing Items Table */}
            <div className="border border-border rounded-xl bg-card overflow-x-auto shadow-sm">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="px-4 py-3 w-[6%] text-xs font-semibold uppercase">
                      {isBangla ? "ক্রমিক" : "S.N."}
                    </TableHead>
                    <TableHead className="px-4 py-3 w-[6%] text-xs font-semibold uppercase">
                      {/* Thumbnail Image column */}
                    </TableHead>
                    <TableHead className="px-4 py-3 w-[32%] text-xs font-semibold uppercase">
                      {isBangla ? "প্রোডাক্ট" : "Product"}
                    </TableHead>
                    <TableHead className="px-4 py-3 w-[12%] text-xs font-semibold uppercase">
                      {isBangla ? "ব্যাচ নম্বর" : "Batch No"}
                    </TableHead>
                    <TableHead className="px-4 py-3 w-[12%] text-xs font-semibold uppercase">
                      {isBangla ? "পরিমাণ" : "Quantity"}
                    </TableHead>
                    <TableHead className="px-4 py-3 w-[15%] text-xs font-semibold uppercase">
                      {isBangla ? "দর" : "Rate"}
                    </TableHead>
                    <TableHead className="px-4 py-3 w-[18%] text-xs font-semibold uppercase">
                      {isBangla ? "ছাড়" : "Discount"}
                    </TableHead>
                    <TableHead className="px-4 py-3 w-[11%] text-right text-xs font-semibold uppercase">
                      {isBangla ? "মোট" : "Amount"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-border">
                  {selectedItems.map((item, idx) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-muted/10 transition-colors"
                    >
                      {/* SN */}
                      <TableCell className="px-4 py-4 font-bold text-amber-500 align-middle">
                        {idx + 1}
                      </TableCell>

                      {/* Product Thumbnail */}
                      <TableCell className="px-3 py-3 align-middle">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.itemName}
                            className="h-8 w-8 rounded object-cover border border-border/80"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded bg-muted flex items-center justify-center border border-border/60">
                            <Image
                              src="/images/image.png"
                              width={50}
                              height={50}
                              alt="Image"
                              className="h-8 w-8 text-muted-foreground/60"
                            />
                          </div>
                        )}
                      </TableCell>

                      {/* Name */}
                      <TableCell className="px-4 py-3 align-middle relative w-[32%]">
                        <Input
                          value={item.itemName}
                          readOnly
                          className="bg-transparent border-none outline-none focus-visible:ring-0 px-0 h-9 cursor-default font-semibold text-foreground"
                        />
                      </TableCell>

                      {/* Batch No */}
                      <TableCell className="px-4 py-3 align-middle w-[15%]">
                        <Input
                          value={item.batchNo}
                          readOnly
                          className="bg-transparent border-none outline-none focus-visible:ring-0 px-0 h-9 cursor-default text-left"
                        />
                      </TableCell>

                      {/* Quantity */}
                      <TableCell className="px-4 py-3 align-middle">
                        <Input
                          type="number"
                          value={item.quantity || ""}
                          readOnly
                          className="bg-background/30 h-9 text-center border-input focus:ring-0 focus-visible:ring-0 cursor-default font-mono"
                        />
                      </TableCell>

                      {/* Rate */}
                      <TableCell className="px-4 py-3 align-middle">
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-xs text-muted-foreground font-medium">
                            Tk.
                          </span>
                          <Input
                            type="number"
                            value={item.unitPrice || ""}
                            readOnly
                            className="pl-9 bg-background/30 h-9 border-input focus:ring-0 focus-visible:ring-0 cursor-default font-mono"
                          />
                        </div>
                      </TableCell>

                      {/* Discount */}
                      <TableCell className="px-4 py-3 align-middle">
                        <div className="flex gap-1.5 items-center">
                          <div className="relative flex-1 flex items-center">
                            <span className="absolute left-2.5 text-[10px] text-muted-foreground font-medium">
                              Tk.
                            </span>
                            <Input
                              type="number"
                              value={item.discountFlat || ""}
                              readOnly
                              className="pl-7 bg-background/30 h-9 text-right border-input focus:ring-0 focus-visible:ring-0 cursor-default font-mono"
                            />
                          </div>
                        </div>
                      </TableCell>

                      {/* Amount */}
                      <TableCell className="px-4 py-3 align-middle text-right font-medium text-foreground">
                        <span className="font-semibold text-foreground text-sm font-mono">
                          Tk. {item.total.toFixed(2)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Table Bottom Action */}
              <div className="flex justify-end items-center px-6 py-4 bg-muted/10 border-t border-border">
                <div className="flex items-center gap-8">
                  <span className="text-sm text-muted-foreground font-medium">
                    {isBangla ? "উপমোট" : "Sub Total"}
                  </span>
                  <span className="font-bold text-foreground text-base font-mono">
                    Tk. {subtotalAfterDiscount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Row 3 Layout: Notes */}
            <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm space-y-3">
              <Label className="text-sm font-semibold text-foreground">
                {isBangla ? "নোট বা মন্তব্য" : "Notes or Remarks"}
              </Label>
              <Textarea
                value={notes}
                readOnly
                className="py-3 min-h-[100px] bg-background/50 border-input resize-none focus-visible:ring-0 cursor-default"
              />
            </div>
          </div>

          {/* Right Side: Sticky Order Details Card (25% on Desktop) */}
          <div className="w-full lg:w-[25%] lg:sticky lg:top-6">
            <div className="bg-card border border-border/80 rounded-2xl shadow-md p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <h2 className="text-lg font-bold tracking-tight text-foreground">
                  {isBangla ? "কোটেশন সারসংক্ষেপ" : "Quotation Summary"}
                </h2>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border",
                    qData.status === "accepted"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : qData.status === "converted"
                      ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                      : qData.status === "rejected"
                      ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20",
                  )}
                >
                  {isBangla ? statusConfig.labelBn : statusConfig.label}
                </span>
              </div>

              {/* Financial Details */}
              <div className="space-y-3">
                {/* Subtotal */}
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-muted-foreground">
                    {isBangla ? "উপমোট" : "Subtotal"}
                  </span>
                  <span className="text-foreground font-mono">
                    Tk.{" "}
                    {rawSubtotal.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                {/* Discount */}
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-muted-foreground">
                    {isBangla ? "ছাড়" : "Discount"}
                  </span>
                  <span className="text-amber-600 dark:text-amber-500 font-medium font-mono">
                    -Tk.{" "}
                    {totalDiscount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                {/* Tax Display Row */}
                <div className="flex justify-between items-center text-sm font-medium py-0.5">
                  <span className="text-muted-foreground">
                    {isBangla ? "ট্যাক্স" : "Tax"}
                  </span>
                  <span className="text-foreground text-xs font-semibold font-mono">
                    Tk. {taxVal.toFixed(2)}
                  </span>
                </div>

                {/* VAT Display Row */}
                <div className="flex justify-between items-center text-sm font-medium py-0.5">
                  <span className="text-muted-foreground">
                    {isBangla ? "ভ্যাট" : "VAT"}
                  </span>
                  <span className="text-foreground text-xs font-semibold font-mono">
                    Tk. {vatVal.toFixed(2)}
                  </span>
                </div>

                {/* Additional Charge */}
                <div className="flex items-center justify-between gap-2 py-1.5 border-t border-border/20 border-b border-border/40 pb-2">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {isBangla ? "অতিরিক্ত চার্জ" : "Additional Charge"}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {isBangla
                        ? "শিপিং, ডেলিভারি ইত্যাদি"
                        : "Shipping, Delivery etc."}
                    </span>
                  </div>
                  <span className="text-foreground text-sm font-bold font-mono">
                    Tk. {additionalChargeVal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Total Amount Output */}
              <div className="flex items-center justify-between py-1">
                <span className="text-base font-bold text-foreground">
                  {isBangla ? "সর্বমোট" : "Grand Total"}
                </span>
                <span className="text-lg font-extrabold text-primary font-mono">
                  Tk.{" "}
                  {grandTotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <hr className="border-border/60" />

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  type="button"
                  onClick={() => router.push(`/sales/new?quotationId=${qData.id}`)}
                  className="w-full h-10 text-sm bg-primary hover:bg-primary/95 text-primary-foreground font-semibold shadow-sm"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {isBangla ? "বিক্রিতে রূপান্তর করুন" : "Convert to Sale"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="w-full h-10 text-sm border-input hover:bg-muted"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {isBangla ? "পেছনে ফিরে যান" : "Back to Quotations"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function QuotationDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <QuotationDetailsContent />
    </Suspense>
  );
}
