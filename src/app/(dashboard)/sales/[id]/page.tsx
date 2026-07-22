// Hello Khata OS - Sale Details View Page
// হ্যালো খাতা - বিক্রয় বিবরণ পেজ

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
import {
  ArrowLeft,
  Users,
  Loader2,
  Sparkles,
  Gift,
} from "lucide-react";
import { useCurrency } from "@/hooks/useAppTranslation";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useGetSaleById } from "@/hooks/api/useSales";
import Image from "next/image";

const mockTxData = {
  partyName: "Kazi Shohel",
  party: {
    name: "Kazi Shohel",
    phone: "01712345678",
    currentBalance: -5000,
    creditLimit: 50000,
  },
  invoiceNo: "HK-89324",
  createdAt: "2026-07-16T12:00:00Z",
  paymentMethod: "cash",
  notes: "Thank you for shopping at Hello Khata! Please review our return policies in case of damaged packaging.",
  paidAmount: 12000,
  subtotal: 15000,
  discount: 500,
  tax: 300,
  vat: 450,
  additionalCharge: 250,
  total: 15500,
  dueAmount: 3500,
  totalOfferSavings: 500,
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
      // Offer data
      offerType: "bogo",
      offerTitle: "Buy 1 Get 1 Free",
      chargedQuantity: 1,
      freeQuantity: 1,
      offerSavings: 4200,
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

function SaleDetailsContent() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { t, isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();

  // API Integration (Uncomment to fetch real database transactions)
  // const { data: saleData } = useGetSaleById(id);
  // const txData = saleData?.data || mockTxData;
  const txData = mockTxData;
  const party = txData.party;

  const partyName = txData.partyName || party?.name || (isBangla ? "ক্যাশ কাস্টমার" : "Cash Customer");
  const invoiceNo = txData.invoiceNo || "—";
  const invoiceDate = txData.createdAt ? new Date(txData.createdAt) : new Date();
  const paymentMethod = txData.paymentMethod || "cash";
  const notes = txData.notes || "";
  const paidAmount = txData.paidAmount || 0;

  // Selected items formatted for the table view
  const selectedItems = useMemo(() => {
    const items = txData.items || [];
    return items.map((item: any, idx: number) => ({
      id: item.id || String(idx),
      itemName: item.itemName,
      batchNo: item.batchNo || "—",
      quantity: item.quantity || 0,
      unitPrice: item.unitPrice || 0,
      discountFlat: item.discount || 0,
      total: item.total || (item.quantity * item.unitPrice - (item.discount || 0)),
      imageUrl: item.imageUrl || "",
      // Offer fields
      offerType: item.offerType || null,
      offerTitle: item.offerTitle || null,
      chargedQuantity: item.chargedQuantity || item.quantity || 0,
      freeQuantity: item.freeQuantity || 0,
      offerSavings: item.offerSavings || 0,
    }));
  }, [txData]);

  // Calculations
  const rawSubtotal = txData?.subtotal || txData?.total || 0;
  const totalDiscount = txData?.discount || 0;
  const subtotalAfterDiscount = Math.max(0, rawSubtotal - totalDiscount);
  const taxVal = txData?.tax || 0;
  const vatVal = txData?.vat || 0;
  const additionalChargeVal = txData?.additionalCharge || 0;
  const grandTotal = txData?.total || 0;
  const due = txData?.dueAmount || 0;



  return (
    <div className="space-y-6">
      {/* Top Header Section */}
      <div className="flex items-center justify-between pb-2 border-b border-border/40">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          {isBangla ? "বিক্রয় বিবরণ" : "Sale Details"}
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

      {/* 75% / 25% Split Layout Container */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Side (75% on Desktop) */}
        <div className="w-full lg:w-[75%] space-y-6">
          
          {/* Row 1 Layout: Select Party, Invoice No, Invoice Date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end bg-card border border-border/50 rounded-xl p-5 shadow-sm">
            {/* Party Name */}
            <div className="space-y-2">
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

            {/* Invoice No */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                {isBangla ? "ইনভয়েস নম্বর" : "Invoice No"}
              </Label>
              <Input
                value={invoiceNo}
                readOnly
                className="h-11 bg-background/50 border-input font-medium cursor-default focus-visible:ring-0"
              />
            </div>

            {/* Invoice Date */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                {isBangla ? "ইনভয়েস তারিখ" : "Invoice Date"}
              </Label>
              <Input
                value={format(invoiceDate, "dd MMM yyyy")}
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
                <span>{isBangla ? "গ্রাহক সংক্ষিপ্ত বিবরণ" : "Customer Overview"}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{isBangla ? "গ্রাহকের নাম" : "Customer Name"}</p>
                  <p className="font-semibold text-foreground truncate mt-0.5">{party.name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{isBangla ? "মোবাইল" : "Phone"}</p>
                  <p className="font-semibold text-foreground truncate mt-0.5">{party.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-rose-400/80 uppercase tracking-wide">{isBangla ? "বর্তমান বাকি" : "Current Due"}</p>
                  <p className="font-bold text-rose-500 mt-0.5">
                    {formatCurrency(Math.abs(party.currentBalance || 0))}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{isBangla ? "ক্রেডিট লিমিট" : "Credit Limit"}</p>
                  <p className="font-semibold text-foreground mt-0.5">
                    {party.creditLimit ? formatCurrency(party.creditLimit) : (isBangla ? "সীমাহীন" : "Unlimited")}
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
                          <Image src="/images/image.png" width={50} height={50} alt="Image" className="h-8 w-8 text-muted-foreground/60" />
                        </div>
                      )}
                    </TableCell>

                    {/* Name */}
                    <TableCell className="px-4 py-3 align-middle relative w-[32%]">
                      <div className="w-full">
                        <Input
                          value={item.itemName}
                          readOnly
                          className="bg-transparent border-none outline-none focus-visible:ring-0 px-0 h-9 cursor-default"
                        />
                        {/* Offer Breakdown for Receipt */}
                        {item.offerTitle && (
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-bold">
                              <Sparkles className="h-2.5 w-2.5" />
                              {item.offerTitle}
                            </span>
                            {item.freeQuantity > 0 && (
                              <span className="text-[10px] text-emerald-400 font-semibold">
                                {item.chargedQuantity} Charged / {item.freeQuantity} Free
                              </span>
                            )}
                            {item.offerSavings > 0 && (
                              <span className="text-[10px] text-emerald-400 font-semibold">
                                Saved: ৳{item.offerSavings.toFixed(2)}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
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

          {/* Row 3 Layout: Notes, Attachments */}
          <div className="flex items-center justiy-between gap-6 bg-card border border-border/50 rounded-xl p-5 shadow-sm">
            {/* Notes Section */}
            <div className="space-y-3 grid-col-8">
              <Label className="text-sm font-semibold text-foreground">
                {isBangla ? "নোট বা মন্তব্য" : "Notes or Remarks"}
              </Label>
              <Textarea
                value={notes}
                readOnly
                className="py-5 min-h-[100px] bg-background/50 border-input resize-none focus-visible:ring-0 cursor-default"
              />
            </div>

            {/* Attachments Section */}
            <div className="flex gap-20">
              {/* Attached Image */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">
                  {isBangla ? "সংযুক্ত ছবি" : "Attached Image"}
                </Label>
                <div className="pt-1">
                  <div className="relative group overflow-hidden h-40 w-58 rounded-xl border border-border bg-muted/20 flex flex-col items-center justify-center transition-all cursor-zoom-in">
                    <Image
                      src="/images/image.png"
                      width={96}
                      height={80}
                      alt="product attachment"
                      className="h-full w-full object-cover rounded-xl"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[9px] text-white text-center py-0.5 truncate px-1 font-sans">
                      product_slip.jpg
                    </div>
                  </div>
                </div>
              </div>

              {/* Attached Invoice */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">
                  {isBangla ? "ইনভয়েস" : "Invoice"}
                </Label>
                <div className="pt-1">
                  <div className="relative group overflow-hidden h-40 w-58 rounded-xl border border-border bg-muted/20 flex flex-col items-center justify-center transition-all cursor-zoom-in">
                    <Image
                      src="/backgrounds/ai-abstract-bg.png"
                      width={96}
                      height={80}
                      alt="invoice attachment"
                      className="h-full w-full object-cover rounded-xl"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[9px] text-white text-center py-0.5 truncate px-1 font-sans">
                      invoice_slip.png
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Sticky Order Details Card (25% on Desktop) */}
        <div className="w-full lg:w-[25%] lg:sticky lg:top-6">
          <div className="bg-card border border-border/80 rounded-2xl shadow-md p-6 space-y-5">
            <h2 className="text-lg font-bold tracking-tight text-foreground border-b border-border/50 pb-2">
              {isBangla ? "অর্ডার সারাংশ" : "Order Summary"}
            </h2>

            {/* Financial Details */}
            <div className="space-y-3">
              {/* Subtotal */}
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-muted-foreground">{isBangla ? "উপমোট" : "Subtotal"}</span>
                <span className="text-foreground font-mono">Tk. {rawSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>

              {/* Discount */}
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-muted-foreground">{isBangla ? "ছাড়" : "Discount"}</span>
                <span className="text-amber-600 dark:text-amber-500 font-medium font-mono">-Tk. {totalDiscount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>

              {/* Offer Savings */}
              {(txData.totalOfferSavings || 0) > 0 && (
                <div className="flex justify-between items-center text-sm font-medium bg-purple-500/5 -mx-2 px-2 py-1 rounded-lg border border-purple-500/10">
                  <span className="text-purple-500 flex items-center gap-1.5 text-xs font-semibold">
                    <Sparkles className="h-3 w-3" />
                    {isBangla ? "অফার সাশ্রয়" : "Offer Savings"}
                  </span>
                  <span className="text-purple-400 font-bold text-xs font-mono">
                    -Tk. {(txData.totalOfferSavings || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              {/* Tax Display Row */}
              <div className="flex justify-between items-center text-sm font-medium py-0.5">
                <span className="text-muted-foreground">{isBangla ? "ট্যাক্স" : "Tax"}</span>
                <span className="text-foreground text-xs font-semibold font-mono">
                  Tk. {taxVal.toFixed(2)}
                </span>
              </div>

              {/* VAT Display Row */}
              <div className="flex justify-between items-center text-sm font-medium py-0.5">
                <span className="text-muted-foreground">{isBangla ? "ভ্যাট" : "VAT"}</span>
                <span className="text-foreground text-xs font-semibold font-mono">
                  Tk. {vatVal.toFixed(2)}
                </span>
              </div>

              {/* Additional Charge */}
              <div className="flex items-center justify-between gap-2 py-1.5 border-t border-border/20 border-b border-border/40 pb-2">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">{isBangla ? "অতিরিক্ত চার্জ" : "Additional Charge"}</span>
                  <span className="text-[10px] text-muted-foreground">{isBangla ? "শিপিং, ডেলিভারি ইত্যাদি" : "Shipping, Delivery etc."}</span>
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
                Tk. {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <hr className="border-border/60" />

            {/* Dedicated Payment Section */}
            <div className="space-y-4 pt-2 border-t border-border/40">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                {isBangla ? "পেমেন্ট" : "Payment"}
              </h3>

              {/* Payment Mode */}
              <div className="space-y-1.5">
                <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {isBangla ? "পেমেন্ট মোড" : "Payment Mode"}
                </Label>
                <Input
                  value={
                    paymentMethod === "cash"
                      ? isBangla ? "নগদ (Cash)" : "Cash"
                      : paymentMethod === "card"
                      ? isBangla ? "কার্ড (Card)" : "Card"
                      : paymentMethod === "mobile_banking"
                      ? isBangla ? "মোবাইল ব্যাংকিং" : "Mobile Banking"
                      : isBangla ? "বাকি (Credit)" : "Credit"
                  }
                  readOnly
                  className="h-10 bg-background/50 border-input text-foreground text-sm cursor-default focus-visible:ring-0"
                />
              </div>

              {/* Paid Amount */}
              {paymentMethod !== "credit" && (
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {isBangla ? "পরিশোধিত পরিমাণ" : "Paid Amount"}
                  </Label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs text-muted-foreground font-semibold">
                      Tk.
                    </span>
                    <Input
                      type="number"
                      value={paidAmount || ""}
                      readOnly
                      className="pl-9 h-10 bg-background/50 border-input text-right font-bold text-foreground text-sm cursor-default focus-visible:ring-0 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Due Amount Alert */}
              {due > 0 && (
                <div className="pt-1">
                  <div className="p-3 rounded-xl flex justify-between items-center text-xs font-semibold border transition-all duration-300 bg-rose-500/10 border-rose-500/20 text-rose-500">
                    <span>
                      {isBangla ? "বাকি পরিমাণ" : "Due Amount"}
                    </span>
                    <div className="text-right">
                      <span className="font-extrabold text-sm block font-mono">
                        Tk. {due.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <hr className="border-border/60 pt-1" />

            {/* Back Action Button */}
            <div className="flex flex-col gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="w-full h-10 text-sm border-input hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {isBangla ? "পেছনে ফিরে যান" : "Back to Sales"}
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function SaleDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <SaleDetailsContent />
    </Suspense>
  );
}
