// Hello Khata OS - Purchase Details View Page
// হ্যালো খাতা - ক্রয় বিবরণ পেজ

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
  Printer,
  RotateCcw,
  FileText,
  Calendar as CalendarIcon,
  ShoppingBag,
  CreditCard,
  Banknote,
  Building2,
  CheckCircle,
} from "lucide-react";
import { useCurrency, useAppTranslation } from "@/hooks/useAppTranslation";
import { useGetPurchaseById } from "@/hooks/api/usePurchases";
import { toast } from "sonner";
import Image from "next/image";

const mockPurchaseDetails = {
  id: "PUR-20260715-0001",
  invoiceNo: "PUR-20260715-0001",
  createdAt: "2026-07-15T10:30:00Z",
  branchName: "Main Branch (Chittagong)",
  responsiblePerson: "Kazi Shohel",
  referenceNo: "REF-99231",
  status: "received",
  supplier: {
    name: "Apex Supplies Ltd",
    phone: "01799887766",
    currentBalance: 0,
    creditLimit: 100000,
  },
  notes: "Delivered to warehouse slot B-4. All packaging inspected and verified clean.",
  paymentMethod: "cash",
  paidAmount: 15000,
  dueAmount: 0,
  subtotal: 14500,
  discount: 0,
  tax: 500,
  shippingCost: 0,
  additionalCharges: 0,
  total: 15000,
  items: [
    {
      id: "1",
      itemName: "Wireless Optical Mouse - Black",
      sku: "SKU-LOG-M185",
      batchNo: "BATCH-2026-A",
      quantity: 10,
      unitCost: 450,
      discountFlat: 0,
      taxPercent: 0,
      total: 4500,
      imageUrl: "",
    },
    {
      id: "2",
      itemName: "Mechanical Gaming Keyboard RGB",
      sku: "SKU-LOG-K840",
      batchNo: "BATCH-2026-B",
      quantity: 5,
      unitCost: 2000,
      discountFlat: 0,
      taxPercent: 5,
      total: 10000,
      imageUrl: "",
    },
  ],
};

function PurchaseDetailsContent() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) || "";

  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();

  // Fetch API Purchase Record
  const { data: apiPurchaseData, isLoading } = useGetPurchaseById(id);

  const purchase = useMemo(() => {
    if (apiPurchaseData?.data || apiPurchaseData) {
      const data = apiPurchaseData.data || apiPurchaseData;
      return {
        ...mockPurchaseDetails,
        ...data,
        invoiceNo: data.invoiceNo || data.invoiceNumber || mockPurchaseDetails.invoiceNo,
        createdAt: data.createdAt || mockPurchaseDetails.createdAt,
        branchName: data.branch?.name || data.branchName || mockPurchaseDetails.branchName,
        responsiblePerson: data.responsiblePerson || data.user?.name || mockPurchaseDetails.responsiblePerson,
        referenceNo: data.referenceNo || data.referenceNumber || mockPurchaseDetails.referenceNo,
        status: data.status || mockPurchaseDetails.status,
        supplier: {
          name: data.supplier?.name || data.supplierName || mockPurchaseDetails.supplier.name,
          phone: data.supplier?.phone || mockPurchaseDetails.supplier.phone,
          currentBalance: data.supplier?.currentBalance ?? mockPurchaseDetails.supplier.currentBalance,
          creditLimit: data.supplier?.creditLimit ?? mockPurchaseDetails.supplier.creditLimit,
        },
        items: data.items && data.items.length > 0 ? data.items : mockPurchaseDetails.items,
        notes: data.notes || mockPurchaseDetails.notes,
        paymentMethod: data.paymentMethod || mockPurchaseDetails.paymentMethod,
        subtotal: data.subtotal || mockPurchaseDetails.subtotal,
        discount: data.discount || mockPurchaseDetails.discount,
        tax: data.tax || mockPurchaseDetails.tax,
        shippingCost: data.shippingCost || data.shipping || mockPurchaseDetails.shippingCost,
        additionalCharges: data.additionalCharges || mockPurchaseDetails.additionalCharges,
        total: data.total || data.grandTotal || mockPurchaseDetails.total,
        paidAmount: data.paidAmount ?? mockPurchaseDetails.paidAmount,
        dueAmount: data.dueAmount ?? mockPurchaseDetails.dueAmount,
      };
    }
    return mockPurchaseDetails;
  }, [apiPurchaseData]);

  const handlePrint = () => {
    window.print();
  };

  const handleCreateReturn = () => {
    router.push(`/purchases/returns/new?purchaseId=${id}`);
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
      <div className="flex items-center justify-between pb-3 border-b border-border/80">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            {isBangla ? "ক্রয় বিবরণ" : "Purchase Details"}
          </h1>
          <Badge
            variant="outline"
            className="text-xs font-mono border-primary/30 text-primary bg-primary/10"
          >
            {purchase.invoiceNo}
          </Badge>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={handleCreateReturn}
            className="h-9 text-xs border-input hover:bg-muted font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4 text-amber-500" />
            <span>{isBangla ? "ক্রয় ফেরত দিন" : "Return Purchase"}</span>
          </Button>
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
            onClick={() => router.push("/purchases")}
            className="h-9 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            {isBangla ? "পেছনে" : "Back"}
          </Button>
        </div>
      </div>

      {/* Main 12-column grid layout - Exactly matching New Purchase Page layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Section (Spans 9 columns on desktop) */}
        <div className="lg:col-span-9 space-y-6">

          {/* Section 1: Purchase Information Card (Disabled Fields) */}
          <div className="bg-zinc-900/20 border border-border rounded-xl p-5 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <span className="text-sm font-semibold text-foreground">
                {isBangla ? "ক্রয় মেটাডাটা ও বিবরণ" : "Purchase Information & Metadata"}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 capitalize">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {purchase.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Invoice Number */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  {isBangla ? "ক্রয় নম্বর" : "Purchase Invoice No"}
                </Label>
                <Input
                  value={purchase.invoiceNo}
                  disabled
                  className="bg-background/50 border-input h-10 text-xs font-bold text-primary disabled:opacity-90"
                />
              </div>

              {/* Purchase Date */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  {isBangla ? "ক্রয় তারিখ" : "Purchase Date"}
                </Label>
                <div className="relative">
                  <Input
                    value={
                      purchase.createdAt
                        ? format(new Date(purchase.createdAt), "dd MMM yyyy, hh:mm a")
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
                  value={purchase.branchName || "Main Branch"}
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
                  value={purchase.responsiblePerson || "System Manager"}
                  disabled
                  className="bg-background/50 border-input h-10 text-xs font-medium disabled:opacity-90"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Supplier Overview Card */}
          {purchase.supplier && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-primary font-semibold text-xs border-b border-primary/10 pb-2">
                <Users className="h-4 w-4" />
                <span>
                  {isBangla ? "সরবরাহকারী সংক্ষিপ্ত বিবরণ" : "Supplier Overview"}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    {isBangla ? "সরবরাহকারীর নাম" : "Supplier Name"}
                  </p>
                  <p className="font-semibold text-foreground truncate mt-0.5">
                    {purchase.supplier.name}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    {isBangla ? "মোবাইল নম্বর" : "Phone"}
                  </p>
                  <p className="font-semibold text-foreground truncate mt-0.5">
                    {purchase.supplier.phone || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-rose-400 uppercase tracking-wide">
                    {isBangla ? "বর্তমান বকেয়া" : "Current Due"}
                  </p>
                  <p className="font-bold text-rose-500 mt-0.5">
                    {formatCurrency(Math.abs(purchase.supplier.currentBalance || 0))}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    {isBangla ? "বাকির সীমা (Credit Limit)" : "Credit Limit"}
                  </p>
                  <p className="font-semibold text-foreground mt-0.5">
                    {purchase.supplier.creditLimit
                      ? formatCurrency(purchase.supplier.creditLimit)
                      : isBangla
                        ? "সীমাহীন"
                        : "Unlimited"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Purchased Items List Table */}
          <div className="bg-zinc-900/20 border border-border rounded-xl overflow-hidden shadow-xs">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">
                {isBangla ? "ক্রয়কৃত পণ্য তালিকা" : "Purchased Items Details"}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {purchase.items?.length || 0} {isBangla ? "টি আইটেম" : "item(s)"}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-border/80 bg-muted/20 text-muted-foreground font-semibold">
                    <th className="px-4 py-3">{isBangla ? "ক্রমিক" : "S.N."}</th>
                    <th className="px-3 py-3">{/* Image */}</th>
                    <th className="px-4 py-3">{isBangla ? "আইটেম বিবরণ" : "Item & SKU"}</th>
                    <th className="px-3 py-3 text-right">{isBangla ? "একক মূল্য" : "Unit Cost"}</th>
                    <th className="px-3 py-3 text-center">{isBangla ? "পরিমাণ" : "Quantity"}</th>
                    <th className="px-3 py-3 text-right">{isBangla ? "ছাড়" : "Discount"}</th>
                    <th className="px-3 py-3 text-right">{isBangla ? "ট্যাক্স" : "Tax"}</th>
                    <th className="px-4 py-3 text-right">{isBangla ? "মোট" : "Total"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {(purchase.items || []).map((item: any, idx: number) => (
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
                      <td className="px-3 py-3.5 align-middle text-center font-bold text-foreground">
                        {item.quantity} {item.unit || "pcs"}
                      </td>
                      <td className="px-3 py-3.5 align-middle text-right text-muted-foreground font-medium">
                        {formatCurrency(item.discountFlat || item.discount || 0)}
                      </td>
                      <td className="px-3 py-3.5 align-middle text-right text-muted-foreground font-medium">
                        {item.taxPercent ? `${item.taxPercent}%` : "0%"}
                      </td>
                      <td className="px-4 py-3.5 align-middle text-right font-bold text-foreground font-mono">
                        {formatCurrency(item.total || item.quantity * (item.unitCost || 0))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom summary bar */}
            <div className="flex justify-between items-center px-5 py-3.5 bg-muted/10 border-t border-border">
              <span className="text-muted-foreground font-semibold text-xs">
                {isBangla ? "আইটেম উপমোট পরিমাণ" : "Item Subtotal Amount"}
              </span>
              <span className="font-bold text-foreground text-sm">
                {formatCurrency(purchase.subtotal)}
              </span>
            </div>
          </div>

          {/* Section 4: Notes & Remarks */}
          <div className="bg-zinc-900/20 border border-border rounded-xl p-5 shadow-xs space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              {isBangla ? "বিশেষ মন্তব্য বা নোট" : "Note / Remarks"}
            </Label>
            <Textarea
              value={purchase.notes || ""}
              disabled
              className="h-24 bg-background/50 border-input resize-none text-xs disabled:opacity-90"
            />
          </div>
        </div>

        {/* Right Section: Purchase Summary Sticky Sidebar */}
        <div className="lg:col-span-3 lg:sticky lg:top-6 space-y-6">
          <div className="bg-zinc-900/20 border border-border rounded-xl p-5 space-y-4 shadow-xs">
            <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">
              {isBangla ? "ক্রয় সারসংক্ষেপ" : "Purchase Financial Summary"}
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>{isBangla ? "আইটেম উপমোট" : "Item Subtotal"}</span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(purchase.subtotal)}
                </span>
              </div>

              <div className="flex justify-between items-center text-muted-foreground pt-1.5 border-t border-border/40">
                <span>{isBangla ? "অর্ডার ছাড়" : "Order Discount"}</span>
                <span className="font-semibold text-foreground">
                  -{formatCurrency(purchase.discount)}
                </span>
              </div>

              <div className="flex justify-between items-center text-muted-foreground">
                <span>{isBangla ? "ট্যাক্স / ভ্যাট" : "Tax / VAT"}</span>
                <span className="font-semibold text-foreground">
                  +{formatCurrency(purchase.tax)}
                </span>
              </div>

              <div className="flex justify-between items-center text-muted-foreground">
                <span>{isBangla ? "পরিবহন খরচ" : "Shipping Cost"}</span>
                <span className="font-semibold text-foreground">
                  +{formatCurrency(purchase.shippingCost)}
                </span>
              </div>

              <div className="flex justify-between items-center text-muted-foreground">
                <span>{isBangla ? "অতিরিক্ত খরচ" : "Additional Charges"}</span>
                <span className="font-semibold text-foreground">
                  +{formatCurrency(purchase.additionalCharges)}
                </span>
              </div>

              {/* Grand Total */}
              <div className="flex justify-between items-center border-t border-border pt-3 text-sm font-bold">
                <span className="text-foreground">{isBangla ? "সর্বমোট ক্রয় মূল্য" : "Grand Total"}</span>
                <span className="text-primary text-base">{formatCurrency(purchase.total)}</span>
              </div>

              {/* Paid Amount */}
              <div className="flex justify-between items-center pt-1.5 text-emerald-400 font-semibold">
                <span>{isBangla ? "পরিশোধিত পরিমাণ" : "Paid Amount"}</span>
                <span>{formatCurrency(purchase.paidAmount)}</span>
              </div>

              {/* Due Amount */}
              {purchase.dueAmount > 0 && (
                <div className="flex justify-between items-center text-rose-400 font-bold">
                  <span>{isBangla ? "বকেয়া পরিমাণ" : "Due Amount"}</span>
                  <span>{formatCurrency(purchase.dueAmount)}</span>
                </div>
              )}
            </div>

            {/* Payment Method Badge */}
            <div className="border-t border-border pt-3.5 space-y-2 text-xs">
              <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                {isBangla ? "পেমেন্ট পদ্ধতি" : "Payment Method"}
              </Label>
              <div className="p-3 rounded-lg bg-background/50 border border-input flex items-center gap-2 text-xs font-semibold text-foreground capitalize">
                <Banknote className="h-4 w-4 text-emerald-500" />
                <span>{purchase.paymentMethod}</span>
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
                <span>{isBangla ? "ইনভয়েস প্রিন্ট করুন" : "Print Purchase Invoice"}</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleCreateReturn}
                className="w-full h-9 text-xs border-input hover:bg-muted font-medium flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4 text-amber-500" />
                <span>{isBangla ? "ক্রয় ফেরত দিন" : "Return Purchase"}</span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/purchases")}
                className="w-full h-9 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {isBangla ? "পেছনে ফিরে যান" : "Back to Purchases"}
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
