// Hello Khata OS - Sales Return Details View Page
// হ্যালো খাতা - বিক্রয় ফেরত বিবরণ পেজ

"use client";

import React, { useMemo, Suspense } from "react";
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
  RotateCcw,
  ArrowLeft,
  Users,
  Loader2,
  Receipt,
  FileText,
  ImageIcon,
  Download,
  Banknote,
  Smartphone,
  Building2,
  CreditCard,
  Search,
  Calendar as CalendarIcon,
} from "lucide-react";
import { useCurrency, useAppTranslation } from "@/hooks/useAppTranslation";
import { toast } from "sonner";
import { useGetSalesReturnById } from "@/hooks/api/useReturns";

const mockReturnData = {
  id: "RET-101",
  returnNo: "RET-101",
  saleInvoiceNo: "INV-20260715-0001",
  createdAt: "2026-07-27T14:30:00Z",
  saleDate: "2026-07-15T12:00:00Z",
  partyName: "Cash Customer",
  invoiceTotal: 280,
  paidAmount: 900,
  dueBalance: -620,
  party: {
    name: "Cash Customer",
    phone: "01712345678",
    currentBalance: -620,
    creditLimit: 50000,
  },
  notes:
    "Product packaging was damaged during transportation and customer requested a refund.",
  refundMethod: "cash",
  accountId: "",
  uploadedImage: "/images/image.png",
  returnInvoiceImage: "/backgrounds/ai-abstract-bg.png",
  originalInvoiceItems: [
    {
      id: "orig-1",
      itemName: "100 Plus Carbonated Isotonic Elect. Energy Drink Can 325 ml",
      batchNo: "—",
      quantity: 1,
      unitPrice: 280,
      discount: 0,
      total: 280,
      imageUrl: "",
    },
  ],
  items: [
    {
      id: "1",
      itemName: "100 Plus Carbonated Isotonic Elect. Energy Drink Can 325 ml",
      batchNo: "—",
      quantity: 1,
      unitPrice: 280,
      returnType: "refund",
      reason: "defective",
      total: 280,
      imageUrl: "",
    },
  ],
};

function SalesReturnDetailsContent() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) || "";

  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();

  // Fetch Return Details from API if available
  const { data: apiReturnData, isLoading } = useGetSalesReturnById(id);

  const returnData = useMemo(() => {
    if (apiReturnData) {
      const sale = apiReturnData.sale || {};
      const saleItems = sale.items || apiReturnData.items || [];
      return {
        id: apiReturnData.id || id,
        returnNo: apiReturnData.returnNo || `RET-${id}`,
        saleInvoiceNo:
          sale.invoiceNo ||
          apiReturnData.saleInvoiceNo ||
          "INV-20260715-0001",
        createdAt: apiReturnData.createdAt || new Date().toISOString(),
        saleDate:
          sale.createdAt ||
          apiReturnData.saleDate ||
          "2026-07-15T12:00:00Z",
        partyName:
          sale.party?.name ||
          apiReturnData.party?.name ||
          apiReturnData.partyName ||
          "Cash Customer",
        invoiceTotal: sale.total ?? apiReturnData.invoiceTotal ?? 280,
        paidAmount:
          sale.paidAmount ?? sale.paid ?? apiReturnData.paidAmount ?? 900,
        dueBalance: sale.dueAmount ?? apiReturnData.dueBalance ?? -620,
        party: sale.party || apiReturnData.party || mockReturnData.party,
        notes: apiReturnData.notes || mockReturnData.notes,
        refundMethod:
          apiReturnData.refundMethod || mockReturnData.refundMethod,
        accountId: apiReturnData.accountId || mockReturnData.accountId,
        uploadedImage:
          apiReturnData.imageUrl ||
          apiReturnData.uploadedImage ||
          mockReturnData.uploadedImage,
        returnInvoiceImage:
          apiReturnData.returnInvoiceImage ||
          mockReturnData.returnInvoiceImage,
        originalInvoiceItems: saleItems.map((it: any, idx: number) => ({
          id: it.id || String(idx),
          itemName:
            it.itemName ||
            it.item?.name ||
            "100 Plus Carbonated Isotonic Elect. Energy Drink Can 325 ml",
          batchNo: it.batchNo || "—",
          quantity: it.quantity || 1,
          unitPrice: it.unitPrice || 280,
          discount: it.discount || 0,
          total:
            it.total ??
            (it.quantity || 1) * (it.unitPrice || 280) - (it.discount || 0),
          imageUrl: it.imageUrl || it.item?.imageUrl || "",
        })),
        items:
          apiReturnData.items && apiReturnData.items.length > 0
            ? apiReturnData.items.map((it: any, idx: number) => ({
                id: it.id || String(idx),
                itemName: it.itemName || it.item?.name || "Product",
                batchNo: it.batchNo || "—",
                quantity: it.quantity || 1,
                unitPrice: it.unitPrice || 0,
                returnType: it.returnType || "refund",
                reason: it.reason || "defective",
                total: it.total || (it.quantity || 1) * (it.unitPrice || 0),
                imageUrl: it.imageUrl || it.item?.imageUrl || "",
              }))
            : mockReturnData.items,
      };
    }
    return {
      ...mockReturnData,
      returnNo: id ? `RET-${id}` : mockReturnData.returnNo,
    };
  }, [apiReturnData, id]);

  const subtotalRefund = useMemo(() => {
    return returnData.items.reduce(
      (sum: number, item: any) =>
        sum + (item.total || item.quantity * item.unitPrice),
      0,
    );
  }, [returnData.items]);

  const grandTotalRefund = useMemo(() => {
    return Math.max(0, subtotalRefund);
  }, [subtotalRefund]);

  const handleDownloadInvoice = () => {
    toast.success(
      isBangla
        ? "ইনভয়েস ডাউনলোড শুরু হচ্ছে..."
        : "Downloading return invoice...",
    );
    window.print();
  };

  const handleBack = () => {
    router.back();
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
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-border/40">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <RotateCcw className="h-6 w-6 text-red-500" />
          {isBangla ? "বিক্রয় ফেরত বিবরণ" : "Sales Return Details"}
        </h1>
        <Button
          variant="ghost"
          onClick={handleBack}
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
          {/* Main Sales Invoice Card */}
          <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm space-y-4">
            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                <Receipt className="h-4 w-4" />
                <span>{isBangla ? "বিক্রয় ইনভয়েস" : "Sales Invoice"}</span>
              </div>
            </div>

            {/* Inputs Grid: Return Invoice (Col 1), Original Sale Invoice (Col 2), Return Date (Col 3) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {/* Return Invoice (First Column) */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-foreground">
                  {isBangla ? "রিটার্ন ইনভয়েস" : "Return Invoice"}
                </Label>
                <div className="relative">
                  <Input
                    value={returnData.returnNo}
                    readOnly
                    disabled
                    className="pr-10 h-11 bg-background/50 border-input text-sm font-bold text-primary cursor-default disabled:opacity-90"
                  />
                  <Receipt className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {/* Original Sale Invoice (Second Column) */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-foreground">
                  {isBangla ? "মূল ইনভয়েস" : "Original Sale Invoice"}
                </Label>
                <div className="relative">
                  <Input
                    value={returnData.saleInvoiceNo}
                    readOnly
                    disabled
                    className="pr-10 h-11 bg-background/50 border-input text-sm font-medium cursor-default disabled:opacity-90"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {/* Return Date (Third Column) */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-foreground">
                  {isBangla ? "ফেরতের তারিখ" : "Return Date"}
                </Label>
                <div className="relative">
                  <Input
                    value={
                      returnData.createdAt
                        ? format(new Date(returnData.createdAt), "dd MMM yyyy")
                        : format(new Date(), "dd MMM yyyy")
                    }
                    readOnly
                    disabled
                    className="pr-10 h-11 bg-background/50 border-input text-sm font-medium cursor-default disabled:opacity-90"
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Summary Details Grid */}
            <div className="pt-3 border-t border-border/40 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-xs">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  {isBangla ? "পার্টি / গ্রাহক" : "PARTY / CUSTOMER"}
                </p>
                <p className="font-semibold text-foreground truncate mt-0.5">
                  {returnData.partyName ||
                    (isBangla ? "ক্যাশ কাস্টমার" : "Cash Customer")}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  {isBangla ? "বিক্রয় তারিখ" : "SALES DATE"}
                </p>
                <p className="font-semibold text-foreground mt-0.5">
                  {returnData.saleDate
                    ? format(new Date(returnData.saleDate), "dd MMM yyyy")
                    : "15 Jul 2026"}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  {isBangla ? "মোট ইনভয়েস পরিমাণ" : "INVOICE TOTAL"}
                </p>
                <p className="font-bold text-foreground mt-0.5">
                  {formatCurrency(returnData.invoiceTotal ?? 280)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-emerald-400 uppercase tracking-wide">
                  {isBangla ? "পরিশোধিত পরিমাণ" : "PAID AMOUNT"}
                </p>
                <p className="font-bold text-emerald-400 mt-0.5">
                  {formatCurrency(returnData.paidAmount ?? 900)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-rose-400 uppercase tracking-wide">
                  {isBangla ? "ইনভয়েস বাকি" : "DUE BALANCE"}
                </p>
                <p className="font-bold text-rose-500 mt-0.5">
                  {formatCurrency(returnData.dueBalance ?? -620)}
                </p>
              </div>
            </div>

            {/* Items Purchased in Sale Invoice Table */}
            <div className="pt-3 border-t border-border/40 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Receipt className="h-3.5 w-3.5 text-indigo-400" />
                  {isBangla
                    ? "ক্রয়কৃত পণ্যের বিবরণ"
                    : "Items Purchased in Sale Invoice"}
                </p>
                <span className="text-[10px] font-medium text-muted-foreground">
                  {(returnData.originalInvoiceItems || returnData.items).length}{" "}
                  {isBangla ? "টি আইটেম" : "items"}
                </span>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border/60 bg-card/60">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 text-[10px] uppercase font-semibold text-muted-foreground border-b border-border/50">
                    <tr>
                      <th className="py-2.5 px-3">
                        {isBangla ? "পণ্য" : "ITEM"}
                      </th>
                      <th className="py-2.5 px-2 text-center">
                        {isBangla ? "ব্যাচ" : "BATCH"}
                      </th>
                      <th className="py-2.5 px-2 text-center">
                        {isBangla ? "পরিমাণ" : "QTY"}
                      </th>
                      <th className="py-2.5 px-2 text-right">
                        {isBangla ? "দর" : "RATE"}
                      </th>
                      <th className="py-2.5 px-2 text-right">
                        {isBangla ? "ছাড়" : "DISCOUNT"}
                      </th>
                      <th className="py-2.5 px-3 text-right">
                        {isBangla ? "মোট" : "AMOUNT"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 text-xs">
                    {(
                      returnData.originalInvoiceItems || returnData.items
                    ).map((saleItem: any, idx: number) => {
                      const img = saleItem.imageUrl || saleItem.item?.imageUrl;
                      const name =
                        saleItem.itemName ||
                        saleItem.item?.name ||
                        "100 Plus Carbonated Isotonic Elect. Energy Drink Can 325 ml";
                      const batch =
                        saleItem.batchNo || saleItem.batch?.batchNo || "—";
                      const qty = saleItem.quantity || 1;
                      const rate = saleItem.unitPrice || saleItem.price || 280;
                      const discount = saleItem.discount || 0;
                      const amount =
                        saleItem.total ?? qty * rate - discount;

                      return (
                        <tr
                          key={saleItem.id || idx}
                          className="hover:bg-muted/40 transition-colors"
                        >
                          {/* Image + Name */}
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                              {img ? (
                                <div className="h-7 w-7 rounded overflow-hidden relative shrink-0 border border-border">
                                  <img
                                    src={img}
                                    alt={name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="h-7 w-7 rounded bg-muted/60 flex items-center justify-center shrink-0 border border-border/80">
                                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                                </div>
                              )}
                              <span className="font-semibold text-foreground truncate text-xs">
                                {name}
                              </span>
                            </div>
                          </td>

                          {/* Batch */}
                          <td className="py-2.5 px-2 text-center text-muted-foreground font-mono text-[11px]">
                            {batch}
                          </td>

                          {/* Quantity */}
                          <td className="py-2.5 px-2 text-center font-semibold text-foreground font-mono">
                            {qty}
                          </td>

                          {/* Rate */}
                          <td className="py-2.5 px-2 text-right text-muted-foreground font-mono">
                            {formatCurrency(rate)}
                          </td>

                          {/* Discount */}
                          <td className="py-2.5 px-2 text-right text-rose-500 font-medium font-mono">
                            {discount > 0 ? `-${formatCurrency(discount)}` : "—"}
                          </td>

                          {/* Amount */}
                          <td className="py-2.5 px-3 text-right font-bold text-indigo-400 font-mono">
                            {formatCurrency(amount)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Card 2: Return Items Table */}
          <div className="bg-card border border-border/50 rounded-xl shadow-sm overflow-hidden">
            {/* Card Header Title */}
            <div className="flex items-center justify-between border-b border-border/50 p-4 bg-card">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                <RotateCcw className="h-4 w-4" />
                <span>
                  {isBangla ? "ফেরতকৃত পণ্যের বিবরণ" : "Returned Items Details"}
                </span>
              </div>
              <span className="text-[10px] font-medium text-muted-foreground">
                {returnData.items.length} {isBangla ? "টি আইটেম" : "items"}
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="px-3 py-3 w-[6%] text-xs font-semibold uppercase">
                      {isBangla ? "ক্রম" : "S.N."}
                    </TableHead>
                    <TableHead className="px-3 py-3 w-[34%] text-xs font-semibold uppercase">
                      {isBangla ? "পণ্য" : "Product"}
                    </TableHead>
                    <TableHead className="px-3 py-3 w-[10%] text-xs font-semibold uppercase">
                      {isBangla ? "পরিমাণ" : "Qty"}
                    </TableHead>
                    <TableHead className="px-3 py-3 w-[12%] text-xs font-semibold uppercase">
                      {isBangla ? "দর" : "Rate"}
                    </TableHead>
                    <TableHead className="px-3 py-3 w-[18%] text-xs font-semibold uppercase">
                      {isBangla ? "ফেরতের ধরন" : "Return Type"}
                    </TableHead>
                    <TableHead className="px-3 py-3 w-[20%] text-xs font-semibold uppercase">
                      {isBangla ? "ফেরত কারণ" : "Return Reason"}
                    </TableHead>
                    <TableHead className="px-3 py-3 text-right text-xs font-semibold uppercase">
                      {isBangla ? "মোট রিফান্ড" : "Total"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-border">
                  {returnData.items.map((item: any, idx: number) => {
                    const returnTypeLabel =
                      item.returnType === "refund"
                        ? isBangla
                          ? "রিফান্ড"
                          : "Refund"
                        : item.returnType === "exchange"
                        ? isBangla
                          ? "বিনিময়"
                          : "Exchange"
                        : item.returnType === "restock"
                        ? isBangla
                          ? "স্টকে ফেরত"
                          : "Restock"
                        : isBangla
                        ? "ড্যামেজ"
                        : "Damaged";

                    const reasonLabel =
                      item.reason === "defective"
                        ? isBangla
                          ? "ত্রুটিপূর্ণ / ড্যামেজ"
                          : "Defective / Damaged"
                        : item.reason === "expired"
                        ? isBangla
                          ? "মেয়াদোত্তীর্ণ"
                          : "Expired"
                        : item.reason === "wrong_item"
                        ? isBangla
                          ? "ভুল পণ্য"
                          : "Wrong Item"
                        : item.reason === "not_satisfied"
                        ? isBangla
                          ? "গ্রাহক অসন্তুষ্ট"
                          : "Customer Dissatisfied"
                        : isBangla
                        ? "অন্যান্য"
                        : "Other";

                    return (
                      <TableRow
                        key={item.id || idx}
                        className="hover:bg-muted/10 transition-colors"
                      >
                        {/* S.N. */}
                        <TableCell className="px-4 py-4 font-bold text-amber-500 align-middle">
                          {idx + 1}
                        </TableCell>

                        {/* Product */}
                        <TableCell className="px-4 py-3 align-middle">
                          <div className="flex items-center gap-3">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.itemName}
                                className="h-8 w-8 rounded object-cover border border-border shrink-0"
                              />
                            ) : (
                              <div className="h-8 w-8 rounded bg-muted flex items-center justify-center shrink-0 border border-border">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-foreground text-xs">
                                {item.itemName}
                              </p>
                              {item.batchNo && (
                                <p className="text-[10px] text-muted-foreground font-mono">
                                  Batch: {item.batchNo}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        {/* Qty */}
                        <TableCell className="px-4 py-3 align-middle font-semibold text-foreground font-mono text-center">
                          {item.quantity}
                        </TableCell>

                        {/* Rate */}
                        <TableCell className="px-4 py-3 align-middle font-medium text-foreground font-mono">
                          {formatCurrency(item.unitPrice)}
                        </TableCell>

                        {/* Return Type */}
                        <TableCell className="px-3 py-3 align-middle">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {returnTypeLabel}
                          </span>
                        </TableCell>

                        {/* Reason */}
                        <TableCell className="px-3 py-3 align-middle">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            {reasonLabel}
                          </span>
                        </TableCell>

                        {/* Total */}
                        <TableCell className="px-4 py-3 align-middle text-right font-bold text-foreground font-mono">
                          {formatCurrency(
                            item.total || item.quantity * item.unitPrice,
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Card 3: Notes & Proof/Invoice Images */}
          <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm space-y-4">
            {/* Card Header Title */}
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <FileText className="h-4 w-4" />
                <span>
                  {isBangla
                    ? "নোট ও সংযুক্ত ছবি"
                    : "Return Notes & Attachments"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {/* Left Column: Notes */}
              <div className="flex flex-col space-y-2 h-full">
                <Label className="text-xs font-medium text-foreground flex items-center gap-2 shrink-0">
                  <FileText className="h-4 w-4 text-primary" />
                  {isBangla ? "মন্তব্য" : "Notes"}
                </Label>
                <Textarea
                  value={
                    returnData.notes ||
                    (isBangla ? "কোনো মন্তব্য নেই" : "No notes provided")
                  }
                  readOnly
                  disabled
                  className="bg-background/50 border-input text-sm resize-none flex-1 min-h-[140px] h-full disabled:opacity-90 cursor-default"
                />
              </div>

              {/* Right Column: Return Image & Return Invoice Image */}
              <div className="flex flex-col space-y-2 h-full">
                <Label className="text-xs font-medium text-foreground flex items-center gap-2 shrink-0">
                  <ImageIcon className="h-4 w-4 text-primary" />
                  {isBangla ? "প্রমাণ ও ইনভয়েস ছবি" : "Proof & Invoice Images"}
                </Label>

                <div className="grid grid-cols-2 gap-3 flex-1 min-h-[140px] h-full">
                  {/* Uploaded Return Proof Image */}
                  <div className="relative rounded-lg border border-border/60 overflow-hidden bg-background/50 p-2 flex flex-col items-center justify-center">
                    {returnData.uploadedImage ? (
                      <div className="relative h-full w-full flex items-center justify-center">
                        <img
                          src={returnData.uploadedImage}
                          alt="Return proof"
                          className="h-full w-full object-contain rounded"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-[10px] text-white text-center py-0.5 px-1 truncate font-medium">
                          {isBangla
                            ? "আপলোডকৃত রিটার্ন ছবি"
                            : "Uploaded Proof Image"}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-muted-foreground text-xs text-center p-2">
                        <ImageIcon className="h-6 w-6 mb-1 opacity-40" />
                        <span className="text-[11px] font-medium">
                          {isBangla ? "রিটার্ন ছবি নেই" : "No Proof Image"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Return Invoice Image */}
                  <div className="relative rounded-lg border border-border/60 overflow-hidden bg-background/50 p-2 flex flex-col items-center justify-center">
                    {returnData.returnInvoiceImage ? (
                      <div className="relative h-full w-full flex items-center justify-center">
                        <img
                          src={returnData.returnInvoiceImage}
                          alt="Return invoice slip"
                          className="h-full w-full object-contain rounded"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-[10px] text-white text-center py-0.5 px-1 truncate font-medium">
                          {isBangla
                            ? "রিটার্ন ইনভয়েস ছবি"
                            : "Return Invoice Image"}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-muted-foreground text-xs text-center p-2">
                        <Receipt className="h-6 w-6 mb-1 opacity-40" />
                        <span className="text-[11px] font-medium">
                          {isBangla ? "ইনভয়েস ছবি নেই" : "No Invoice Image"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
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
            <div className="space-y-3 pt-3 border-t border-border/60">
              <Label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                {isBangla ? "রিফান্ড মাধ্যম" : "Refund Method"}
              </Label>

              <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-500 flex items-center gap-3">
                {returnData.refundMethod === "mobile_banking" ? (
                  <Smartphone className="h-5 w-5 shrink-0" />
                ) : returnData.refundMethod === "card" ? (
                  <Building2 className="h-5 w-5 shrink-0" />
                ) : returnData.refundMethod === "credit_note" ? (
                  <CreditCard className="h-5 w-5 shrink-0" />
                ) : (
                  <Banknote className="h-5 w-5 shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-xs uppercase">
                    {returnData.refundMethod === "mobile_banking"
                      ? "bKash / Nagad"
                      : returnData.refundMethod === "card"
                      ? isBangla
                        ? "ব্যাংক"
                        : "Bank"
                      : returnData.refundMethod === "credit_note"
                      ? isBangla
                        ? "ক্রেডিট নোট"
                        : "Credit Note"
                      : isBangla
                      ? "নগদ"
                      : "Cash"}
                  </p>
                  {returnData.accountId && (
                    <p className="text-[11px] font-mono opacity-80 truncate">
                      {returnData.accountId}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-4 border-t border-border/60">
              <Button
                onClick={handleDownloadInvoice}
                className="w-full h-11 bg-primary text-primary-foreground font-bold text-sm transition-all gap-2 shadow-md hover:bg-primary/90"
              >
                <Download className="h-4 w-4" />
                {isBangla ? "ইনভয়েস ডাউনলোড করুন" : "Download Invoice"}
              </Button>

              <Button
                variant="outline"
                onClick={handleBack}
                className="w-full h-10 border-border/80 hover:bg-muted font-medium text-sm gap-2 text-foreground"
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
