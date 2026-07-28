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
  Users,
  Loader2,
  Printer,
  FileText,
  Calendar as CalendarIcon,
  Banknote,
  Camera,
  Image as ImageIcon,
} from "lucide-react";
import { useCurrency, useAppTranslation } from "@/hooks/useAppTranslation";
import { useGetPurchaseReturnById } from "@/hooks/api/useReturns";
import Image from "next/image";

const mockReturnDetails = {
  id: "PRET-101",
  returnNo: "PR-20260727-8932",
  purchaseInvoiceNo: "PUR-20260715-0001",
  createdAt: "2026-07-27T14:30:00Z",
  purchaseDate: "2026-07-15T12:00:00Z",
  branchName: "Main Branch (Chittagong)",
  responsiblePerson: "Kazi Shohel",
  referenceNo: "REF-RET-091",
  status: "completed",
  supplierName: "Apex Supplies Ltd",
  supplier: {
    name: "Apex Supplies Ltd",
    phone: "01799887766",
    currentBalance: 0,
    creditLimit: 100000,
  },
  notes: "Products received were defective and returned to supplier for full cash refund.",
  refundMethod: "cash",
  subtotal: 4500,
  discount: 0,
  tax: 0,
  shippingAdjustment: 0,
  additionalCharges: 0,
  total: 4500,
  refundAmount: 4500,
  supplierCredit: 0,
  paymentAdjustment: 0,
  uploadedImage: "/images/image.png",
  returnInvoiceImage: "/backgrounds/ai-abstract-bg.png",
  items: [
    {
      id: "1",
      itemName: "Wireless Optical Mouse - Black",
      sku: "SKU-LOG-M185",
      batchNo: "BATCH-2026-A",
      quantity: 10,
      maxQuantity: 50,
      remainingQuantity: 40,
      unitCost: 450,
      unit: "pcs",
      returnType: "refund",
      reason: "defective",
      total: 4500,
      imageUrl: "",
    },
  ],
};

function PurchaseReturnDetailsContent() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) || "";

  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();

  // Fetch Purchase Return details from API
  const { data: apiReturnData, isLoading } = useGetPurchaseReturnById(id);

  const returnDetails = useMemo(() => {
    if (apiReturnData?.data || apiReturnData) {
      const data = apiReturnData.data || apiReturnData;
      return {
        ...mockReturnDetails,
        ...data,
        returnNo: data.returnNo || data.returnInvoiceNo || data.invoiceNo || mockReturnDetails.returnNo,
        purchaseInvoiceNo: data.purchase?.invoiceNo || data.purchaseInvoiceNo || mockReturnDetails.purchaseInvoiceNo,
        createdAt: data.createdAt || data.returnDate || mockReturnDetails.createdAt,
        branchName: data.branch?.name || data.branchName || mockReturnDetails.branchName,
        responsiblePerson: data.responsiblePerson || data.user?.name || mockReturnDetails.responsiblePerson,
        status: data.status || mockReturnDetails.status,
        supplierName: data.supplier?.name || data.supplierName || mockReturnDetails.supplierName,
        supplier: {
          name: data.supplier?.name || data.supplierName || mockReturnDetails.supplier.name,
          phone: data.supplier?.phone || mockReturnDetails.supplier.phone,
          currentBalance: data.supplier?.currentBalance ?? mockReturnDetails.supplier.currentBalance,
          creditLimit: data.supplier?.creditLimit ?? mockReturnDetails.supplier.creditLimit,
        },
        items: data.items && data.items.length > 0 ? data.items : mockReturnDetails.items,
        notes: data.notes || mockReturnDetails.notes,
        refundMethod: data.refundMethod || data.paymentMethod || mockReturnDetails.refundMethod,
        subtotal: data.subtotal || mockReturnDetails.subtotal,
        discount: data.discount || mockReturnDetails.discount,
        tax: data.tax || mockReturnDetails.tax,
        shippingAdjustment: data.shippingAdjustment || mockReturnDetails.shippingAdjustment,
        additionalCharges: data.additionalCharges || mockReturnDetails.additionalCharges,
        total: data.total || data.grandTotal || data.refundAmount || mockReturnDetails.total,
        refundAmount: data.refundAmount ?? mockReturnDetails.refundAmount,
        supplierCredit: data.supplierCredit ?? mockReturnDetails.supplierCredit,
        paymentAdjustment: data.paymentAdjustment ?? mockReturnDetails.paymentAdjustment,
      };
    }
    return mockReturnDetails;
  }, [apiReturnData]);

  const rawSubtotal = useMemo(() => {
    return (returnDetails.items || []).reduce(
      (sum: number, item: any) => sum + (item.total || item.quantity * item.unitCost),
      0,
    );
  }, [returnDetails]);

  const grandTotal = useMemo(() => {
    return returnDetails.total || returnDetails.refundAmount || rawSubtotal;
  }, [returnDetails, rawSubtotal]);

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
      {/* Top Header Section - Exactly matching New Purchase Return Page Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/80">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <RotateCcw className="h-6 w-6 text-primary" />
            {isBangla ? "পারচেজ রিটার্ন বিবরণ" : "Purchase Return Details"}
          </h1>
          <Badge
            variant="outline"
            className="text-xs font-mono border-primary/30 text-primary bg-primary/10"
          >
            {returnDetails.returnNo}
          </Badge>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            onClick={handlePrint}
            className="h-9 text-xs bg-primary hover:bg-primary/95 text-primary-foreground font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>{isBangla ? "ইনভয়েস প্রিন্ট করুন" : "Print Return Invoice"}</span>
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

      {/* Main 12-column grid layout - Exactly matching New Purchase Return Page layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Section (Spans 9 columns on desktop) */}
        <div className="lg:col-span-9 space-y-6">

          {/* Section 1: Purchase Return Information Card (Disabled Fields) */}
          <div className="bg-zinc-900/20 border border-border rounded-xl p-5 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <span className="text-sm font-semibold text-foreground">
                {isBangla ? "ক্রয় ফেরত সংক্রান্ত তথ্য" : "Purchase Return Information"}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 capitalize">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {returnDetails.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-background/30 p-3.5 rounded-lg border border-border/40">
              {/* Supplier Display */}
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  {isBangla ? "সরবরাহকারী" : "Supplier Name"}
                </p>
                <p className="font-bold text-foreground text-sm mt-0.5">
                  {returnDetails.supplierName}
                </p>
              </div>

              {/* Purchase Invoice */}
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  {isBangla ? "মূল ক্রয় ইনভয়েস" : "Original Invoice"}
                </p>
                <p className="font-bold text-foreground text-sm mt-0.5 font-mono">
                  {returnDetails.purchaseInvoiceNo}
                </p>
              </div>

              {/* Return Date */}
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  {isBangla ? "ফেরতের তারিখ" : "Return Date"}
                </p>
                <p className="font-bold text-foreground text-sm mt-0.5">
                  {returnDetails.createdAt
                    ? format(new Date(returnDetails.createdAt), "dd MMM yyyy, hh:mm a")
                    : "—"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Return Number */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  {isBangla ? "ক্রয় ফেরত নম্বর" : "Return Number"}
                </Label>
                <Input
                  value={returnDetails.returnNo}
                  disabled
                  className="bg-background/50 border-input h-10 text-xs font-bold text-primary disabled:opacity-90 font-mono"
                />
              </div>

              {/* Return Date */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  {isBangla ? "ফেরতের তারিখ" : "Return Date"}
                </Label>
                <div className="relative">
                  <Input
                    value={
                      returnDetails.createdAt
                        ? format(new Date(returnDetails.createdAt), "dd MMM yyyy")
                        : "—"
                    }
                    disabled
                    className="bg-background/50 border-input h-10 text-xs font-medium pr-9 disabled:opacity-90"
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {/* Branch */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  {isBangla ? "শাখা" : "Branch"}
                </Label>
                <Input
                  value={returnDetails.branchName || "Main Branch"}
                  disabled
                  className="bg-background/50 border-input h-10 text-xs font-medium disabled:opacity-90"
                />
              </div>

              {/* Responsible Person */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  {isBangla ? "দায়িত্বপ্রাপ্ত ব্যক্তি" : "Responsible Person"}
                </Label>
                <Input
                  value={returnDetails.responsiblePerson || "System Manager"}
                  disabled
                  className="bg-background/50 border-input h-10 text-xs font-medium disabled:opacity-90"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Supplier Overview Card */}
          {returnDetails.supplier && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-primary font-semibold text-xs border-b border-primary/10 pb-2">
                <Users className="h-4 w-4" />
                <span>
                  {isBangla ? "সরবরাহকারী সংক্ষিপ্ত বিবরণ ও আর্থিক অবস্থা" : "Supplier Overview"}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    {isBangla ? "সরবরাহকারীর নাম" : "Supplier Name"}
                  </p>
                  <p className="font-semibold text-foreground truncate mt-0.5">
                    {returnDetails.supplier.name}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    {isBangla ? "মোবাইল নম্বর" : "Phone"}
                  </p>
                  <p className="font-semibold text-foreground truncate mt-0.5">
                    {returnDetails.supplier.phone || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-rose-400 uppercase tracking-wide">
                    {isBangla ? "বর্তমান বকেয়া" : "Current Due"}
                  </p>
                  <p className="font-bold text-rose-500 mt-0.5">
                    {formatCurrency(Math.abs(returnDetails.supplier.currentBalance || 0))}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    {isBangla ? "বাকির সীমা (Credit Limit)" : "Credit Limit"}
                  </p>
                  <p className="font-semibold text-foreground mt-0.5">
                    {returnDetails.supplier.creditLimit
                      ? formatCurrency(returnDetails.supplier.creditLimit)
                      : isBangla
                        ? "সীমাহীন"
                        : "Unlimited"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Returned Items List Table */}
          <div className="bg-zinc-900/20 border border-border rounded-xl overflow-hidden shadow-xs">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">
                {isBangla ? "ফেরতকৃত পণ্য তালিকা" : "Returned Items Details"}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {returnDetails.items?.length || 0} {isBangla ? "টি আইটেম" : "item(s)"}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-border/80 bg-muted/20 text-muted-foreground font-semibold">
                    <th className="px-4 py-3">{isBangla ? "ক্রমিক" : "S.N."}</th>
                    <th className="px-3 py-3">{/* Thumbnail */}</th>
                    <th className="px-4 py-3">{isBangla ? "আইটেম বিবরণ" : "Item & SKU"}</th>
                    <th className="px-3 py-3 text-right">{isBangla ? "মূল্য" : "Purchase Price"}</th>
                    <th className="px-3 py-3 text-center">{isBangla ? "ইনভেন্টরি" : "Current Stock"}</th>
                    <th className="px-4 py-3 text-center">{isBangla ? "ফেরত পরিমাণ" : "Returned Qty"}</th>
                    <th className="px-3 py-3">{isBangla ? "ফেরত টাইপ" : "Return Type"}</th>
                    <th className="px-3 py-3">{isBangla ? "কারণ" : "Reason"}</th>
                    <th className="px-4 py-3 text-right">{isBangla ? "মোট" : "Total"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {(returnDetails.items || []).map((item: any, idx: number) => (
                    <tr key={item.id || idx} className="hover:bg-muted/10 transition-colors">
                      <td className="px-4 py-3.5 align-middle font-bold text-amber-500">
                        {idx + 1}
                      </td>
                      <td className="px-3 py-3.5 align-middle">
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
                              width={40}
                              height={40}
                              alt="Image"
                              className="h-6 w-6 text-muted-foreground/60"
                            />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 align-middle">
                        <p className="font-semibold text-foreground text-xs leading-tight">
                          {item.itemName || item.name || "Product"}
                        </p>
                        {item.sku && (
                          <p className="text-[10px] text-muted-foreground">SKU: {item.sku}</p>
                        )}
                        {item.batchNo && (
                          <span className="text-[9px] bg-muted/60 text-muted-foreground px-1.5 py-0.5 rounded font-mono">
                            Batch: {item.batchNo}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3.5 align-middle text-right font-medium text-foreground">
                        {formatCurrency(item.unitCost || item.unitPrice || 0)}
                      </td>
                      <td className="px-3 py-3.5 align-middle text-center text-muted-foreground font-medium">
                        {item.remainingQuantity || item.maxQuantity || 0} {item.unit || "pcs"}
                      </td>
                      <td className="px-4 py-3.5 align-middle text-center font-bold text-foreground">
                        {item.quantity} {item.unit || "pcs"}
                      </td>
                      <td className="px-3 py-3.5 align-middle capitalize text-xs text-muted-foreground">
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-primary/10 text-primary font-semibold">
                          {item.returnType || "refund"}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 align-middle capitalize text-xs text-muted-foreground">
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                          {item.reason || "damaged"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 align-middle text-right font-bold text-foreground font-mono">
                        {formatCurrency(item.total || item.quantity * (item.unitCost || item.unitPrice || 0))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom summary bar */}
            <div className="flex justify-between items-center px-5 py-3.5 bg-muted/10 border-t border-border">
              <span className="text-muted-foreground font-semibold text-xs">
                {isBangla ? "আইটেম উপমোট পরিমাণ" : "Return Subtotal Amount"}
              </span>
              <span className="font-bold text-foreground text-sm font-mono">
                {formatCurrency(rawSubtotal)}
              </span>
            </div>
          </div>

          {/* Section 4: Attachments Section */}
          <div className="bg-zinc-900/20 border border-border rounded-xl p-5 space-y-3.5 shadow-xs">
            <Label className="text-xs font-semibold text-foreground flex items-center gap-2">
              <Camera className="h-4 w-4 text-primary" />
              {isBangla ? "সংযুক্ত প্রমাণপত্র / ইনভয়েস ছবি" : "Uploaded Return Proofs & Invoices"}
            </Label>
            <div className="flex flex-wrap gap-3 items-center pt-1">
              {returnDetails.uploadedImage && (
                <div className="h-28 w-28 rounded-lg border border-border bg-background/40 relative overflow-hidden p-1 shadow-2xs">
                  <img
                    src={returnDetails.uploadedImage}
                    alt="Proof"
                    className="h-full w-full object-cover rounded"
                  />
                  <span className="text-[9px] text-muted-foreground truncate w-full absolute bottom-0 bg-background/80 text-center px-0.5 font-medium">
                    {isBangla ? "পণ্য ছবি" : "Proof Image"}
                  </span>
                </div>
              )}
              {returnDetails.returnInvoiceImage && (
                <div className="h-28 w-28 rounded-lg border border-border bg-background/40 relative overflow-hidden p-1 shadow-2xs">
                  <img
                    src={returnDetails.returnInvoiceImage}
                    alt="Invoice"
                    className="h-full w-full object-cover rounded"
                  />
                  <span className="text-[9px] text-muted-foreground truncate w-full absolute bottom-0 bg-background/80 text-center px-0.5 font-medium">
                    {isBangla ? "ইনভয়েস কপি" : "Return Invoice"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Notes Area */}
          <div className="bg-zinc-900/20 border border-border rounded-xl p-5 shadow-xs space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              {isBangla ? "বিশেষ মন্তব্য বা নোট" : "Note / Remarks"}
            </Label>
            <Textarea
              value={returnDetails.notes || ""}
              disabled
              className="h-24 bg-background/50 border-input resize-none text-xs disabled:opacity-90"
            />
          </div>
        </div>

        {/* Right Section: Refund Summary Sticky Sidebar */}
        <div className="lg:col-span-3 lg:sticky lg:top-6 space-y-6">
          <div className="bg-zinc-900/20 border border-border rounded-xl p-5 space-y-4 shadow-xs">
            <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">
              {isBangla ? "ফেরত ও সমন্বয় বিবরণী" : "Refund & Calculation Summary"}
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>{isBangla ? "আইটেম উপমোট" : "Item Subtotal"}</span>
                <span className="font-semibold text-foreground">{formatCurrency(rawSubtotal)}</span>
              </div>

              <div className="flex justify-between items-center text-muted-foreground pt-1.5 border-t border-border/40">
                <span>{isBangla ? "অর্ডার ছাড়" : "Order Discount"}</span>
                <span className="font-semibold text-foreground">
                  -{formatCurrency(returnDetails.discount)}
                </span>
              </div>

              <div className="flex justify-between items-center text-muted-foreground">
                <span>{isBangla ? "ট্যাক্স / ভ্যাট" : "Tax / VAT"}</span>
                <span className="font-semibold text-foreground">
                  +{formatCurrency(returnDetails.tax)}
                </span>
              </div>

              <div className="flex justify-between items-center text-muted-foreground">
                <span>{isBangla ? "পরিবহন খরচ সমন্বয়" : "Shipping Adjustment"}</span>
                <span className="font-semibold text-foreground">
                  +{formatCurrency(returnDetails.shippingAdjustment)}
                </span>
              </div>

              <div className="flex justify-between items-center text-muted-foreground">
                <span>{isBangla ? "অতিরিক্ত সমন্বয় খরচ" : "Additional Charges"}</span>
                <span className="font-semibold text-foreground">
                  +{formatCurrency(returnDetails.additionalCharges)}
                </span>
              </div>

              {/* Grand Total */}
              <div className="flex justify-between items-center border-t border-border pt-3 text-sm font-bold">
                <span className="text-foreground">{isBangla ? "সর্বমোট ফেরতযোগ্য" : "Grand Total"}</span>
                <span className="text-primary text-base">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            {/* Refund Splits */}
            <div className="border-t border-border pt-3.5 space-y-2.5 text-xs">
              <span className="font-semibold text-foreground block">
                {isBangla ? "রিফান্ড বন্টন (Splits)" : "Refund Distributions"}
              </span>

              <div className="flex justify-between items-center text-muted-foreground">
                <span>{isBangla ? "নগদ / ব্যাংক ফেরত" : "Cash / Bank Refund"}</span>
                <span className="font-bold text-emerald-400">{formatCurrency(returnDetails.refundAmount)}</span>
              </div>

              <div className="flex justify-between items-center text-muted-foreground">
                <span>{isBangla ? "সরবরাহকারী ক্রেডিট" : "Supplier Credit"}</span>
                <span className="font-semibold text-foreground">{formatCurrency(returnDetails.supplierCredit)}</span>
              </div>

              <div className="flex justify-between items-center text-muted-foreground">
                <span>{isBangla ? "বকেয়া সমন্বয়" : "Due Adjustment"}</span>
                <span className="font-semibold text-foreground">{formatCurrency(returnDetails.paymentAdjustment)}</span>
              </div>
            </div>

            {/* Refund Method Badge */}
            <div className="border-t border-border pt-3.5 space-y-2 text-xs">
              <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                {isBangla ? "রিফান্ড পদ্ধতি" : "Refund Method"}
              </Label>
              <div className="p-3 rounded-lg bg-background/50 border border-input flex items-center gap-2 text-xs font-semibold text-foreground capitalize">
                <Banknote className="h-4 w-4 text-emerald-500" />
                <span>{returnDetails.refundMethod}</span>
              </div>
            </div>

            {/* Bottom Action Buttons */}
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
