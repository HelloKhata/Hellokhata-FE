// Hello Khata OS - Sale Details View Page
// হ্যালো খাতা - বিক্রয় বিবরণ পেজ

"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common";
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
  ArrowLeft,
  Users,
  Loader2,
  Sparkles,
  Gift,
  Phone,
  Calendar as CalendarIcon,
  Receipt,
  RotateCcw,
  Printer,
  Download,
  Eye,
  Banknote,
  CreditCard,
  Smartphone,
  Package,
  MoreVertical,
  Copy,
  MapPin,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useCurrency, useAppTranslation } from "@/hooks/useAppTranslation";
import { useGetSaleById } from "@/hooks/api/useSales";
import { useParty } from "@/hooks/api/useParties";
import { useSessionStore } from "@/stores/sessionStore";
import { useBranchStore } from "@/stores/branchStore";
import {
  useInvoiceActions,
  InvoiceOffscreen,
  InvoicePreviewDialog,
} from "@/components/invoice/InvoiceActions";
import { InvoiceData, InvoiceItem } from "@/types/invoice";
import { cn } from "@/lib/utils";

const METHODS = [
  {
    id: "cash",
    label: "Cash",
    labelBn: "নগদ",
    icon: Banknote,
    colorClass: "text-emerald-500",
    bgClass: "bg-emerald-500/10",
    borderClass: "border-emerald-500/20",
  },
  {
    id: "bank",
    label: "Bank/Card",
    labelBn: "ব্যাংক/কার্ড",
    icon: CreditCard,
    colorClass: "text-blue-500",
    bgClass: "bg-blue-500/10",
    borderClass: "border-blue-500/20",
  },
  {
    id: "mobile_banking",
    label: "Mobile Banking",
    labelBn: "মোবাইল ব্যাংকিং",
    icon: Smartphone,
    colorClass: "text-orange-500",
    bgClass: "bg-orange-500/10",
    borderClass: "border-orange-500/20",
  },
];

function SaleDetailsContent() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) || "";
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [invoiceSettings, setInvoiceSettings] = useState<any>({});

  // Synchronize invoice settings from localStorage
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("hk_invoice_settings");
        if (saved) {
          setInvoiceSettings(JSON.parse(saved));
        }
      }
    } catch (e) {
      console.error("Error reading saved invoice settings:", e);
    }
  }, []);

  // Business and branch stores for fallback invoice info
  const sessionBusiness = useSessionStore((state) => state.business);
  const currentBranch = useBranchStore((state) => state.currentBranch);

  // Fetch real sale details from API
  const { data: apiSaleData, isLoading } = useGetSaleById(id);
  const txData = apiSaleData?.data || apiSaleData;

  // Resolve customer party details if available
  const partyId = txData?.partyId || txData?.party?.id || "";
  const { data: partyData } = useParty(partyId, { enabled: !!partyId });
  const party = partyData?.data || partyData || txData?.party || {};

  const customerName =
    txData?.customerName ||
    party?.name ||
    txData?.partyName ||
    (isBangla ? "খুচরা গ্রাহক" : "Retail Customer");

  const customerPhone =
    txData?.customerPhone ||
    txData?.phone ||
    party?.phone ||
    "—";

  const invoiceNo = txData?.invoiceNo || (id ? `INV-${id.slice(-6)}` : "—");
  const invoiceDate = txData?.createdAt ? new Date(txData.createdAt) : new Date();
  const notes = txData?.notes || "";

  // Selected items formatted for the table view matching new sale page
  const selectedItems = useMemo(() => {
    if (!txData?.items) return [];
    return txData.items.map((item: any, idx: number) => {
      const rawPrice = Number(item.unitPrice ?? item.price ?? 0);
      const rawQty = Number(item.quantity ?? 1);
      const rawDiscount = Number(item.discount ?? item.discountFlat ?? 0);
      const lineTotal = Number(item.total ?? (rawPrice * rawQty - rawDiscount));

      return {
        id: item.id || String(idx),
        itemId: item.itemId || item.id,
        itemName: item.itemName || item.item?.name || "Product",
        batchNo: item.batchNo || item.batch?.batchNumber || item.batchId || "—",
        unit: item.unit || item.item?.unit || "pc",
        quantity: rawQty,
        unitPrice: rawPrice,
        discountFlat: rawDiscount,
        total: lineTotal,
        imageUrl: item.imageUrl || item.item?.imageUrl || "",
        // Offer fields
        appliedOffer: item.appliedOffer || item.offer || null,
        chargedQuantity: item.chargedQuantity ?? rawQty,
        freeQuantity: Number(item.freeQuantity || 0),
        offerSavings: Number(item.offerSavings || 0),
      };
    });
  }, [txData]);

  // Calculations matching new sale page
  const rawSubtotal = Number(
    txData?.subtotal ??
      selectedItems.reduce((acc: number, it: any) => acc + it.unitPrice * it.quantity, 0),
  );
  const totalDiscount = Number(txData?.discount || 0);
  const totalOfferSavings = Number(
    txData?.totalOfferSavings ??
      selectedItems.reduce((acc: number, it: any) => acc + (it.offerSavings || 0), 0),
  );
  const taxVal = Number(txData?.tax || 0);
  const additionalChargeVal = Number(
    txData?.additionalCharge ?? txData?.additionalCharges ?? 0,
  );
  const grandTotal = Number(txData?.total ?? rawSubtotal - totalDiscount + taxVal + additionalChargeVal);
  const paidAmount = Number(txData?.paidAmount ?? txData?.paid ?? 0);
  const due = Number(txData?.dueAmount ?? Math.max(0, grandTotal - paidAmount));
  const changeReturned = Math.max(0, paidAmount - grandTotal);

  const paymentMethod = (txData?.paymentMethod || "cash").toLowerCase();

  // Constructed Invoice Data Object based on user's Invoice Settings
  const invoiceData: InvoiceData = useMemo(() => {
    const business = {
      name:
        invoiceSettings?.businessName ||
        sessionBusiness?.name ||
        (isBangla ? "স্মার্টস্টোর" : "SmartStore"),
      address:
        invoiceSettings?.businessAddress ||
        currentBranch?.address ||
        (isBangla ? "ঢাকা, বাংলাদেশ" : "Dhaka, Bangladesh"),
      phone:
        invoiceSettings?.businessPhone ||
        currentBranch?.phone ||
        "01XXXXXXXXX",
      logoUrl: invoiceSettings?.logoUrl ?? sessionBusiness?.logo ?? null,
    };

    const customer = {
      name: customerName,
      phone: customerPhone !== "—" ? customerPhone : undefined,
      address: party?.address || undefined,
    };

    const items: InvoiceItem[] = selectedItems.map((item: any) => ({
      id: item.id,
      name: item.itemName,
      qty: item.quantity,
      price: item.unitPrice,
      unit: item.unit || "pc",
    }));

    const status: "PAID" | "DUE" | "PARTIAL" =
      due <= 0 ? "PAID" : paidAmount > 0 ? "PARTIAL" : "DUE";

    return {
      invoiceNumber: invoiceNo,
      date: format(invoiceDate, "dd MMM yyyy"),
      status,
      business,
      customer,
      items,
      subtotal: rawSubtotal,
      discount: totalDiscount,
      tax: taxVal,
      paidAmount,
      dueAmount: due,
      changeAmount: changeReturned,
      returnPolicy:
        invoiceSettings?.returnPolicy ||
        (isBangla
          ? "পণ্য বিক্রয়ের ৭ দিনের মধ্যে ক্যাশ মেমোসহ পরিবর্তনযোগ্য। ব্যবহৃত বা ক্ষতিগ্রস্ত পণ্য ফেরতযোগ্য নয়।"
          : "Exchangeable within 7 days of purchase with cash memo. Used or damaged goods are not returnable."),
      footerNote:
        invoiceSettings?.footerNote ||
        (isBangla ? "ধন্যবাদ আপনার কেনাকাটার জন্য!" : "Thank you for your business!"),
      paperSize: (invoiceSettings?.paperSize as "A4" | "A5") || "A4",
      printerType: (invoiceSettings?.printerType as "normal" | "thermal") || "normal",
      inWords: undefined,
    };
  }, [
    txData,
    selectedItems,
    customerName,
    customerPhone,
    party,
    invoiceNo,
    invoiceDate,
    rawSubtotal,
    totalDiscount,
    taxVal,
    paidAmount,
    due,
    changeReturned,
    sessionBusiness,
    currentBranch,
    invoiceSettings,
    isBangla,
  ]);

  // Reusable invoice actions hook from InvoiceActions
  const { invoiceRef, isDownloading, handleDownloadPdf, handlePrint } =
    useInvoiceActions(invoiceData);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!txData) {
    return (
      <div className="bg-card border border-border rounded-xl p-12 text-center space-y-3">
        <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
          <Receipt className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-foreground">
          {isBangla ? "বিক্রয় তথ্য পাওয়া যায়নি" : "Sale Record Not Found"}
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
      {/* ========================================================= */}
      {/* DESKTOP & TABLET VIEW (md and up)                         */}
      {/* ========================================================= */}
      <div className="hidden md:block space-y-6">
        {/* Top Header Section */}
        <PageHeader
          title={isBangla ? "বিক্রয় বিবরণ" : "Sale Details"}
          subtitle={
            isBangla
              ? "সম্পন্ন বিক্রয়ের বিস্তারিত তথ্য ও অর্ডার সারাংশ"
              : "Completed sale details and order summary"
          }
          showBack
          className="pb-2 border-b border-border/40"
        >
          <div className="flex items-center gap-2 flex-wrap">
            {/* Download Invoice Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="text-xs gap-1.5 cursor-pointer text-primary border-primary/30 hover:bg-primary/10"
            >
              {isDownloading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              {isBangla ? "ইনভয়েস ডাউনলোড" : "Download Invoice"}
            </Button>

            {/* Return Sale Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/sales/returns/new?saleId=${id}`)}
              className="text-xs gap-1.5 cursor-pointer text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {isBangla ? "বিক্রি ফেরত" : "Return Sale"}
            </Button>

            {/* Preview Invoice Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewOpen(true)}
              className="text-xs gap-1.5 cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5" />
              {isBangla ? "প্রিভিউ" : "Preview"}
            </Button>

            {/* Print Invoice Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="text-xs gap-1.5 cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              {isBangla ? "ইনভয়েস প্রিন্ট" : "Print"}
            </Button>
          </div>
        </PageHeader>

        {/* Row 1 Layout: 4 Columns Container (matching new sale page layout) */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end bg-card border border-border/50 rounded-xl p-5 shadow-sm">
          {/* 1. Invoice No */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              {isBangla ? "ইনভয়েস নম্বর" : "Invoice No"}
            </Label>
            <div className="h-11 px-3.5 flex items-center justify-between bg-background/50 border border-input rounded-md text-xs font-mono font-bold text-primary">
              <span>{invoiceNo}</span>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* 2. Customer Phone Number */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              {isBangla ? "ফোন নম্বর" : "Customer Phone"}
            </Label>
            <div className="h-11 px-3.5 flex items-center justify-between bg-background/50 border border-input rounded-md text-xs font-mono font-medium text-foreground">
              <span>{customerPhone}</span>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* 3. Customer Name */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              {isBangla ? "গ্রাহক" : "Customer"}
            </Label>
            <div className="h-11 px-3.5 flex items-center justify-between bg-background/50 border border-input rounded-md text-xs font-semibold text-foreground">
              <span>{customerName}</span>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* 4. Invoice Date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              {isBangla ? "ইনভয়েস তারিখ" : "Invoice Date"}
            </Label>
            <div className="h-11 px-3.5 flex items-center justify-between bg-background/50 border border-input rounded-md text-xs font-medium text-foreground">
              <span>{format(invoiceDate, "dd MMM yyyy")}</span>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* 75% / 25% Split Layout Container (matching new sale page structure) */}
        <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
          {/* Left Side (75% on Desktop) */}
          <div className="w-full lg:flex-[3] min-w-0 flex flex-col gap-5 bg-card border border-border/50 rounded-xl p-5 shadow-sm">
            {/* Row 2: Billing Items Table */}
            <div className="w-full border border-border rounded-xl bg-card overflow-x-auto shadow-sm">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="px-4 py-3 w-[6%] text-xs font-semibold uppercase">
                      {isBangla ? "ক্রমিক" : "S.N."}
                    </TableHead>
                    <TableHead className="px-3 py-3 w-[6%] text-xs font-semibold uppercase">
                      {/* Thumbnail Image column */}
                    </TableHead>
                    <TableHead className="px-4 py-3 w-[44%] text-xs font-semibold uppercase">
                      {isBangla ? "প্রোডাক্ট" : "Product"}
                    </TableHead>
                    <TableHead className="px-4 py-3 w-[16%] text-xs font-semibold uppercase">
                      {isBangla ? "দর" : "Rate"}
                    </TableHead>
                    <TableHead className="px-4 py-3 w-[14%] text-xs font-semibold uppercase">
                      {isBangla ? "পরিমাণ" : "Quantity"}
                    </TableHead>
                    <TableHead className="px-4 py-3 w-[14%] text-right text-xs font-semibold uppercase">
                      {isBangla ? "মোট" : "Amount"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-border">
                  {selectedItems.map((item, idx) => (
                    <TableRow
                      key={item.id || idx}
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
                            <Package className="h-4 w-4 text-muted-foreground/60" />
                          </div>
                        )}
                      </TableCell>

                      {/* Product Name */}
                      <TableCell className="px-4 py-3 align-middle font-medium">
                        <div>
                          <p className="font-semibold text-foreground text-sm">
                            {item.itemName}
                          </p>
                          {item.batchNo && item.batchNo !== "—" && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-[10px] font-mono border border-border/60 mt-0.5">
                              Batch: {item.batchNo}
                            </span>
                          )}
                          {item.appliedOffer && (
                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-bold">
                                <Sparkles className="h-2.5 w-2.5" />
                                {item.appliedOffer.title || item.appliedOffer.name}
                              </span>
                              {item.freeQuantity > 0 && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                                  <Gift className="h-2.5 w-2.5" />
                                  {item.freeQuantity} Free
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

                      {/* Rate (Normal info text) */}
                      <TableCell className="px-4 py-3 align-middle font-mono font-medium text-foreground text-sm">
                        {formatCurrency(item.unitPrice)}
                      </TableCell>

                      {/* Quantity (Normal info text) */}
                      <TableCell className="px-4 py-3 align-middle font-mono font-bold text-foreground text-sm">
                        {item.quantity} {item.unit || ""}
                      </TableCell>

                      {/* Amount */}
                      <TableCell className="px-4 py-3 align-middle text-right font-medium text-foreground font-mono">
                        {formatCurrency(item.total)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Table Bottom Subtotal Bar */}
              <div className="flex justify-end items-center px-6 py-4 bg-muted/10 border-t border-border">
                <div className="flex items-center gap-8">
                  <span className="text-sm text-muted-foreground font-medium">
                    {isBangla ? "উপমোট" : "Sub Total"}
                  </span>
                  <span className="font-bold text-foreground text-base font-mono">
                    {formatCurrency(rawSubtotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes Section (matching new sale page) */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                {isBangla ? "নোট বা মন্তব্য" : "Notes or Remarks"}
              </Label>
              <div className="min-h-[100px] bg-background/50 border border-input rounded-md p-3 text-sm text-foreground whitespace-pre-wrap">
                {notes || (isBangla ? "কোনো নোট নেই" : "No notes or remarks")}
              </div>
            </div>
          </div>

          {/* Right Side: Sticky Order Details Card (25% on Desktop, matching new sale page) */}
          <div className="w-full lg:flex-[1] lg:min-w-[340px] lg:max-w-[380px] lg:sticky lg:top-6">
            <div className="bg-card border border-border/80 rounded-2xl shadow-md p-6 space-y-5">
              <h2 className="text-lg font-bold tracking-tight text-foreground border-b border-border/50 pb-2">
                {isBangla ? "অর্ডার সারাংশ" : "Order Summary"}
              </h2>

              {/* Financial Details */}
              <div className="space-y-3">
                {/* Subtotal */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">
                    {isBangla ? "উপমোট" : "Subtotal"}
                  </span>
                  <span className="text-foreground font-mono font-semibold">
                    {formatCurrency(rawSubtotal)}
                  </span>
                </div>

                {/* Discount */}
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-muted-foreground">
                    {isBangla ? "ছাড়" : "Discount"}
                  </span>
                  <span className="text-amber-600 dark:text-amber-500 font-medium font-mono">
                    -{formatCurrency(totalDiscount)}
                  </span>
                </div>

                {/* Offer Savings */}
                {totalOfferSavings > 0 && (
                  <div className="flex justify-between items-center text-sm font-medium bg-purple-500/5 -mx-2 px-2 py-1 rounded-lg border border-purple-500/10">
                    <span className="text-purple-500 flex items-center gap-1.5 text-xs font-semibold">
                      <Sparkles className="h-3 w-3" />
                      {isBangla ? "অফার সাশ্রয়" : "Offer Savings"}
                    </span>
                    <span className="text-purple-400 font-bold text-xs font-mono">
                      -{formatCurrency(totalOfferSavings)}
                    </span>
                  </div>
                )}

                {/* Tax Display Row */}
                <div className="flex justify-between items-center text-sm font-medium py-0.5">
                  <span className="text-muted-foreground">
                    {isBangla ? "ট্যাক্স" : "Tax"}
                  </span>
                  <span className="text-foreground text-xs font-semibold font-mono">
                    {formatCurrency(taxVal)}
                  </span>
                </div>

                {/* Additional Charge Display */}
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
                    {formatCurrency(additionalChargeVal)}
                  </span>
                </div>
              </div>

              {/* Total Amount Output */}
              <div className="flex items-center justify-between py-1">
                <span className="text-base font-bold text-foreground">
                  {isBangla ? "সর্বমোট" : "Grand Total"}
                </span>
                <span className="text-lg font-extrabold text-primary font-mono">
                  {formatCurrency(grandTotal)}
                </span>
              </div>

              <hr className="border-border/60" />

              {/* Payment Section (matching new sale page) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {isBangla ? "পেমেন্ট পদ্ধতি" : "Payment Method"}
                  </Label>
                </div>

                {/* Method display chip */}
                <div className="grid grid-cols-3 gap-2">
                  {METHODS.map((m) => {
                    const Icon = m.icon;
                    const active = paymentMethod.includes(m.id);
                    return (
                      <div
                        key={m.id}
                        className={cn(
                          "flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all",
                          active
                            ? cn(m.bgClass, m.borderClass)
                            : "border-border/40 bg-transparent opacity-40",
                        )}
                      >
                        <Icon
                          size={18}
                          className={active ? m.colorClass : "text-muted-foreground"}
                          strokeWidth={2}
                        />
                        <span
                          className={cn(
                            "text-[10px] font-medium leading-tight text-center",
                            active ? m.colorClass : "text-muted-foreground",
                          )}
                        >
                          {isBangla ? m.labelBn : m.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Payment details list if split / multiple payments */}
                {Array.isArray(txData?.paymentMethods) && txData.paymentMethods.length > 0 && (
                  <div className="pt-2 pb-1 space-y-1.5 border-t border-border/40">
                    {txData.paymentMethods.map((p: any, pIdx: number) => (
                      <div
                        key={p.id || pIdx}
                        className="flex justify-between items-center text-xs text-muted-foreground"
                      >
                        <span className="capitalize">{p.paymentType || p.method || "Payment"}</span>
                        <span className="font-mono font-semibold text-foreground">
                          {formatCurrency(p.amount || 0)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Paid Amount */}
                <div className="flex justify-between items-center text-muted-foreground pt-1.5 border-t border-border/40">
                  <span>{isBangla ? "পরিশোধিত" : "Paid Amount"}</span>
                  <span className="font-bold text-foreground font-mono">
                    {formatCurrency(paidAmount)}
                  </span>
                </div>

                {/* Due Amount Alert */}
                {due > 0 && (
                  <div className="flex justify-between items-center text-rose-500 font-bold text-sm">
                    <span>{isBangla ? "বাকি পরিমাণ" : "Due Amount"}</span>
                    <span className="font-mono">{formatCurrency(due)}</span>
                  </div>
                )}

                {/* Change Return Alert */}
                {changeReturned > 0 && (
                  <div className="flex justify-between items-center text-blue-500 font-bold text-sm">
                    <span>{isBangla ? "ফেরত (Change)" : "Change Return"}</span>
                    <span className="font-mono">{formatCurrency(changeReturned)}</span>
                  </div>
                )}
              </div>

              <hr className="border-border/60 pt-1" />

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5">
                {/* Download Invoice Button */}
                <Button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isDownloading}
                  className="w-full h-11 bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  {isDownloading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {isBangla ? "ইনভয়েস ডাউনলোড করুন" : "Download Invoice"}
                </Button>

                {/* Return Sale Button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/sales/returns/new?saleId=${id}`)}
                  className="w-full h-10 border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                  {isBangla ? "বিক্রি ফেরত দিন" : "Return Sale"}
                </Button>

                {/* Back Action */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="w-full h-10 border-input hover:bg-muted font-medium flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {isBangla ? "পেছনে ফিরে যান" : "Back to Sales"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MOBILE VIEW (< md) - ANDROID APP STYLE EXPERIENCE         */}
      {/* ========================================================= */}
      <div className="md:hidden pb-32 space-y-3.5">
        {/* Mobile Top Bar */}
        <div className="flex items-center justify-between gap-2 py-1 border-b border-border/40">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => router.back()}
              className="h-9 w-9 rounded-full bg-muted/60 hover:bg-muted active:scale-95 flex items-center justify-center text-foreground shrink-0 transition-transform cursor-pointer"
              title={isBangla ? "পেছনে ফিরে যান" : "Back"}
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-foreground truncate">
                  {invoiceNo}
                </span>
                {/* Status Badge */}
                <span
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0",
                    due <= 0
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : paidAmount > 0
                        ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        : "bg-rose-500/10 text-rose-500 border-rose-500/20",
                  )}
                >
                  {due <= 0
                    ? isBangla
                      ? "পরিশোধিত"
                      : "PAID"
                    : paidAmount > 0
                      ? isBangla
                        ? "আংশিক"
                        : "PARTIAL"
                      : isBangla
                        ? "বাকি"
                        : "DUE"}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground truncate">
                {format(invoiceDate, "dd MMM yyyy, hh:mm a")}
              </p>
            </div>
          </div>

          {/* Action icons on top bar */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 flex items-center justify-center transition-all cursor-pointer"
              title={isBangla ? "প্রিভিউ" : "Preview"}
            >
              <Eye className="h-4 w-4" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 flex items-center justify-center transition-all cursor-pointer"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 text-xs font-medium">
                <DropdownMenuItem onClick={handlePrint} className="gap-2 cursor-pointer">
                  <Printer className="h-3.5 w-3.5" />
                  <span>{isBangla ? "ইনভয়েস প্রিন্ট" : "Print Invoice"}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push(`/sales/returns/new?saleId=${id}`)}
                  className="gap-2 text-amber-600 dark:text-amber-400 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{isBangla ? "বিক্রি ফেরত" : "Return Sale"}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    if (typeof navigator !== "undefined" && navigator.clipboard) {
                      navigator.clipboard.writeText(invoiceNo);
                      toast.success(
                        isBangla
                          ? "ইনভয়েস নম্বর কপি হয়েছে"
                          : "Invoice number copied",
                      );
                    }
                  }}
                  className="gap-2 cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>{isBangla ? "ইনভয়েস কপি" : "Copy Invoice No"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Customer Information Card */}
        <div className="bg-card border border-border/70 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              {isBangla ? "গ্রাহকের তথ্য" : "Customer Information"}
            </span>
            {partyId && (
              <button
                type="button"
                onClick={() => router.push(`/parties/${partyId}`)}
                className="text-[11px] text-primary hover:underline font-semibold cursor-pointer"
              >
                {isBangla ? "প্রোফাইল দেখুন" : "View Profile"}
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-foreground text-sm truncate">
                {customerName}
              </h4>
              {customerPhone && customerPhone !== "—" ? (
                <a
                  href={`tel:${customerPhone}`}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-mono mt-0.5"
                >
                  <Phone className="h-3 w-3 text-primary" />
                  <span>{customerPhone}</span>
                </a>
              ) : (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isBangla ? "ফোন নম্বর নেই" : "No phone provided"}
                </p>
              )}
            </div>
          </div>

          {party?.address && (
            <div className="text-[11px] text-muted-foreground pt-2 border-t border-border/40 flex items-start gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80 mt-0.5" />
              <span className="line-clamp-2">{party.address}</span>
            </div>
          )}
        </div>

        {/* Purchased Items Card */}
        <div className="bg-card border border-border/70 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border/40">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              <h3 className="font-bold text-sm text-foreground">
                {isBangla ? "ক্রয়কৃত পণ্য" : "Purchased Items"}
              </h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {selectedItems.length} {isBangla ? "টি" : "items"}
            </span>
          </div>

          <div className="divide-y divide-border/50">
            {selectedItems.map((item, idx) => (
              <div
                key={item.id || idx}
                className="py-3 first:pt-0 last:pb-0 space-y-2"
              >
                <div className="flex items-start gap-3 justify-between">
                  {/* Thumbnail */}
                  <div className="h-10 w-10 rounded-lg overflow-hidden bg-muted/60 border border-border/60 shrink-0 flex items-center justify-center">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.itemName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package className="h-5 w-5 text-muted-foreground/60" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-foreground text-xs leading-snug">
                      {item.itemName}
                    </h4>
                    <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                      {item.batchNo && item.batchNo !== "—" && (
                        <span className="text-[10px] text-muted-foreground font-mono bg-muted/70 px-1.5 py-0.2 rounded border border-border/50">
                          Batch: {item.batchNo}
                        </span>
                      )}
                      {item.appliedOffer && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-400 text-[10px] font-semibold border border-purple-500/20">
                          <Sparkles className="h-2.5 w-2.5" />
                          {item.appliedOffer.title || item.appliedOffer.name}
                        </span>
                      )}
                      {item.freeQuantity > 0 && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                          <Gift className="h-2.5 w-2.5" />
                          +{item.freeQuantity} Free
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right shrink-0">
                    <p className="font-bold font-mono text-sm text-foreground">
                      {formatCurrency(item.total)}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                      {item.quantity} {item.unit || "pc"} ×{" "}
                      {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary & Financials Card */}
        <div className="bg-card border border-border/70 rounded-2xl p-4 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-foreground pb-2 border-b border-border/40">
            {isBangla ? "হিসাব ও পেমেন্ট" : "Payment & Summary"}
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center text-muted-foreground">
              <span>{isBangla ? "উপমোট" : "Subtotal"}</span>
              <span className="font-semibold text-foreground font-mono">
                {formatCurrency(rawSubtotal)}
              </span>
            </div>

            {totalDiscount > 0 && (
              <div className="flex justify-between items-center text-amber-600 dark:text-amber-400 font-medium">
                <span>{isBangla ? "ছাড়" : "Discount"}</span>
                <span className="font-mono font-semibold">
                  -{formatCurrency(totalDiscount)}
                </span>
              </div>
            )}

            {totalOfferSavings > 0 && (
              <div className="flex justify-between items-center text-purple-500 font-medium bg-purple-500/5 px-2 py-1 rounded-lg">
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  {isBangla ? "অফার সাশ্রয়" : "Offer Savings"}
                </span>
                <span className="font-mono font-bold">
                  -{formatCurrency(totalOfferSavings)}
                </span>
              </div>
            )}

            {taxVal > 0 && (
              <div className="flex justify-between items-center text-muted-foreground">
                <span>{isBangla ? "ট্যাক্স (VAT)" : "Tax (VAT)"}</span>
                <span className="font-semibold text-foreground font-mono">
                  {formatCurrency(taxVal)}
                </span>
              </div>
            )}

            {additionalChargeVal > 0 && (
              <div className="flex justify-between items-center text-muted-foreground">
                <span>{isBangla ? "অতিরিক্ত চার্জ" : "Additional Charge"}</span>
                <span className="font-semibold text-foreground font-mono">
                  {formatCurrency(additionalChargeVal)}
                </span>
              </div>
            )}

            {/* Grand Total */}
            <div className="flex justify-between items-center pt-2 border-t border-border/50 text-sm font-bold">
              <span className="text-foreground">
                {isBangla ? "সর্বমোট টাকা" : "Grand Total"}
              </span>
              <span className="text-primary font-mono text-base font-extrabold">
                {formatCurrency(grandTotal)}
              </span>
            </div>

            {/* Payment Method Chip */}
            <div className="pt-2 border-t border-border/40">
              <div className="flex items-center justify-between text-[11px] mb-2">
                <span className="text-muted-foreground uppercase font-semibold">
                  {isBangla ? "পেমেন্ট মাধ্যম" : "Payment Method"}
                </span>
                <span className="font-bold text-foreground capitalize">
                  {paymentMethod}
                </span>
              </div>

              {/* 3 mini method icons with active highlight */}
              <div className="grid grid-cols-3 gap-1.5">
                {METHODS.map((m) => {
                  const Icon = m.icon;
                  const active = paymentMethod.includes(m.id);
                  return (
                    <div
                      key={m.id}
                      className={cn(
                        "flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl border text-[11px] font-semibold transition-all",
                        active
                          ? cn(
                              m.bgClass,
                              m.borderClass,
                              m.colorClass,
                              "ring-1 ring-primary/20",
                            )
                          : "border-border/40 bg-muted/20 opacity-40 text-muted-foreground",
                      )}
                    >
                      <Icon size={14} />
                      <span>{isBangla ? m.labelBn : m.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Multiple payment methods list if any */}
              {Array.isArray(txData?.paymentMethods) &&
                txData.paymentMethods.length > 0 && (
                  <div className="pt-2 mt-2 border-t border-border/40 space-y-1">
                    {txData.paymentMethods.map((p: any, pIdx: number) => (
                      <div
                        key={p.id || pIdx}
                        className="flex justify-between items-center text-[11px] text-muted-foreground"
                      >
                        <span className="capitalize">
                          {p.paymentType || p.method || "Payment"}
                        </span>
                        <span className="font-mono font-bold text-foreground">
                          {formatCurrency(p.amount || 0)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
            </div>

            {/* Paid & Due summary strip */}
            <div className="bg-muted/40 dark:bg-muted/20 rounded-xl p-3 border border-border/40 space-y-1.5 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">
                  {isBangla ? "পরিশোধিত টাকা" : "Paid Amount"}:
                </span>
                <span className="font-bold text-foreground font-mono">
                  {formatCurrency(paidAmount)}
                </span>
              </div>

              {due > 0 ? (
                <div className="flex justify-between items-center text-rose-500 font-bold border-t border-border/40 pt-1.5">
                  <span>{isBangla ? "বাকি পরিমাণ" : "Due Amount"}:</span>
                  <span className="font-mono text-sm">
                    {formatCurrency(due)}
                  </span>
                </div>
              ) : (
                <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-bold border-t border-border/40 pt-1.5">
                  <span>{isBangla ? "অবস্থা" : "Status"}:</span>
                  <span>{isBangla ? "সম্পূর্ণ পরিশোধিত" : "Fully Paid"}</span>
                </div>
              )}

              {changeReturned > 0 && (
                <div className="flex justify-between items-center text-blue-500 font-bold border-t border-border/40 pt-1.5">
                  <span>{isBangla ? "ফেরত (Change)" : "Change Return"}:</span>
                  <span className="font-mono">
                    {formatCurrency(changeReturned)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notes Card */}
        {notes && (
          <div className="bg-card border border-border/70 rounded-2xl p-4 shadow-xs space-y-1.5">
            <span className="text-xs font-semibold text-foreground">
              {isBangla ? "নোট বা মন্তব্য" : "Notes or Remarks"}
            </span>
            <p className="text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-xl border border-border/40 whitespace-pre-wrap">
              {notes}
            </p>
          </div>
        )}

        {/* Sticky Bottom Bar for Mobile Devices */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border/80 p-3 pb-safe shadow-xl">
          <div className="grid grid-cols-2 gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/sales/returns/new?saleId=${id}`)}
              className="h-11 border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4 shrink-0" />
              <span>{isBangla ? "বিক্রি ফেরত" : "Return Sale"}</span>
            </Button>

            <Button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="h-11 bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin shrink-0" />
              ) : (
                <Download className="h-4 w-4 shrink-0" />
              )}
              <span>{isBangla ? "ইনভয়েস ডাউনলোড" : "Download PDF"}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Invoice Preview Dialog Modal from InvoiceActions */}
      <InvoicePreviewDialog
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        data={invoiceData}
        isBangla={isBangla}
      />

      {/* Offscreen Invoice Template for PDF generation & printing from InvoiceActions */}
      <InvoiceOffscreen
        invoiceRef={invoiceRef}
        data={invoiceData}
        isBangla={isBangla}
      />
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


