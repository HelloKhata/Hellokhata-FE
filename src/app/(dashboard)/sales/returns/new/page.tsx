// Hello Khata OS - Sales Return Page
// হ্যালো খাতা - বিক্রয় ফেরত পেজ

"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverAnchor,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Calendar as CalendarIcon,
  Check,
  X,
  ArrowLeft,
  Users,
  Loader2,
  RotateCcw,
  FileText,
  Banknote,
  Smartphone,
  CreditCard,
  Building2,
  CheckCircle2,
  Receipt,
  Search,
  Upload,
  ImageIcon,
} from "lucide-react";
import { useCurrency } from "@/hooks/useAppTranslation";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useParties, useParty } from "@/hooks/api/useParties";
import { useGetBatches } from "@/hooks/api/useBatches";
import { useReturnSale } from "@/hooks/api/useReturns";
import { useGetSales, useGetSaleById } from "@/hooks/api/useSales";
import Image from "next/image";

interface ReturnItemRow {
  id: string;
  itemId: string;
  itemName: string;
  sku?: string;
  batchNo?: string;
  quantity: number;
  maxQuantity?: number;
  unitPrice: number;
  returnType: string;
  reason: string;
  total: number;
  searchQuery: string;
  showSuggestions: boolean;
  imageUrl?: string;
  isSelected?: boolean;
}

function SalesReturnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const partyIdParam = searchParams.get("partyId") || "";
  const saleIdParam = searchParams.get("saleId") || "";

  const { t, isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const { mutate, isPending } = useReturnSale();

  // Selected Sale & Party state
  const [selectedPartyId, setSelectedPartyId] = useState<string>(partyIdParam);
  const [selectedSaleId, setSelectedSaleId] = useState<string>(saleIdParam);

  // Search queries for party & sale search
  const [partySearchQuery, setPartySearchQuery] = useState("");
  const [showPartySuggestions, setShowPartySuggestions] = useState(false);
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState("");
  const [showInvoiceSuggestions, setShowInvoiceSuggestions] = useState(false);

  // API Data: Fetch Sales Invoices using useGetSales
  const { data: salesData } = useGetSales({
    search: invoiceSearchQuery || undefined,
    partyId: selectedPartyId || undefined,
  });
  const salesList = salesData?.data || [];

  const { data: partiesData } = useParties();
  const parties = partiesData?.data || [];

  const { data: singlePartyData } = useParty(selectedPartyId, {
    enabled: !!selectedPartyId,
  });

  const { data: singleSaleData } = useGetSaleById(selectedSaleId);
  const salesInvoice = singleSaleData?.data;
  const invoiceItems = salesInvoice?.items || [];

  const { data: batchesData } = useGetBatches({
    status: "active",
    limit: 1000,
  });
  const batches = Array.isArray(batchesData?.data)
    ? batchesData.data
    : Array.isArray(batchesData)
    ? batchesData
    : [];

  // Return Form Header Details
  const [returnNo, setReturnNo] = useState("RET-101");
  const [isManualReturnNo, setIsManualReturnNo] = useState(false);
  const [returnDate, setReturnDate] = useState<Date>(new Date());

  // Return Reasons & Remarks
  const [overallReason, setOverallReason] = useState("");
  const [notes, setNotes] = useState("");
  const [returnImage, setReturnImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(
          isBangla
            ? "ফাইল সাইজ সর্বোচ্চ ৫ মেগাবাইট হতে পারবে"
            : "File size must be under 5MB",
        );
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setReturnImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Refund Settlement
  const [refundMethod, setRefundMethod] = useState<
    "cash" | "card" | "mobile_banking" | "credit_note"
  >("cash");
  const [accountId, setAccountId] = useState("");

  // Return Items Table Rows
  const [selectedItems, setSelectedItems] = useState<ReturnItemRow[]>([
    {
      id: "initial-row",
      itemId: "",
      itemName: "",
      batchNo: "",
      quantity: 1,
      unitPrice: 0,
      returnType: "refund",
      reason: "defective",
      total: 0,
      searchQuery: "",
      showSuggestions: false,
      imageUrl: "",
    },
  ]);

  // When a sale is selected, automatically populate return items
  useEffect(() => {
    if (singleSaleData?.data) {
      const sale = singleSaleData.data;
      if (sale.partyId) {
        setSelectedPartyId(sale.partyId);
      }
      if (sale.items && sale.items.length > 0) {
        const prefilledRows: ReturnItemRow[] = sale.items.map((it: any) => ({
          id: it.id || Math.random().toString(),
          itemId: it.id || it.itemId || it.item?.id || "",
          itemName: it.itemName || it.item?.name || "",
          sku: it.item?.sku || it.sku || "—",
          batchNo: it.batchNo || "",
          quantity: it.quantity || 1,
          maxQuantity: it.quantity || 1,
          unitPrice: it.unitPrice || 0,
          returnType: "refund",
          reason: "defective",
          total: (it.quantity || 1) * (it.unitPrice || 0),
          searchQuery: "",
          showSuggestions: false,
          imageUrl: it.item?.imageUrl || "",
          isSelected: false,
        }));
        setSelectedItems(prefilledRows);
      }
    }
  }, [singleSaleData]);

  // Party filtering
  const filteredParties = useMemo(() => {
    if (!partySearchQuery) return parties;
    return parties.filter(
      (p: any) =>
        p.name.toLowerCase().includes(partySearchQuery.toLowerCase()) ||
        p.phone?.includes(partySearchQuery),
    );
  }, [parties, partySearchQuery]);

  const selectedPartyName = useMemo(() => {
    const party = parties.find((p: any) => p.id === selectedPartyId);
    if (party) return party.name;
    if (singlePartyData?.data && singlePartyData.data.id === selectedPartyId) {
      return singlePartyData.data.name;
    }
    return "";
  }, [parties, selectedPartyId, singlePartyData]);

  // Invoice filtering
  const filteredSalesList = useMemo(() => {
    if (!invoiceSearchQuery) return salesList;
    return salesList.filter(
      (s: any) =>
        s.invoiceNo.toLowerCase().includes(invoiceSearchQuery.toLowerCase()) ||
        s.party?.name?.toLowerCase().includes(invoiceSearchQuery.toLowerCase()),
    );
  }, [salesList, invoiceSearchQuery]);

  const selectedInvoiceNo = useMemo(() => {
    const sale = salesList.find((s: any) => s.id === selectedSaleId);
    if (sale) return sale.invoiceNo;
    if (singleSaleData?.data && singleSaleData.data.id === selectedSaleId) {
      return singleSaleData.data.invoiceNo;
    }
    return "";
  }, [salesList, selectedSaleId, singleSaleData]);

  // Total Refund calculation based only on selected items
  const subtotalRefund = useMemo(() => {
    return selectedItems.reduce(
      (sum, item) => sum + (item.isSelected ? item.quantity * item.unitPrice : 0),
      0,
    );
  }, [selectedItems]);

  const grandTotalRefund = useMemo(() => {
    return Math.max(0, subtotalRefund);
  }, [subtotalRefund]);

  // Item Selection Toggles
  const toggleItemSelection = (id: string, isSelected?: boolean) => {
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextVal = typeof isSelected === "boolean" ? isSelected : !item.isSelected;
          return { ...item, isSelected: nextVal };
        }
        return item;
      }),
    );
  };

  const toggleSelectAll = (checked: boolean) => {
    setSelectedItems((prev) =>
      prev.map((item) => ({ ...item, isSelected: checked })),
    );
  };

  const handleQuantityChange = (id: string, val: number | string) => {
    const parsed = typeof val === "string" ? parseInt(val) || 0 : val;
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const max = item.maxQuantity !== undefined ? item.maxQuantity : 999999;
          const qty = Math.max(0, Math.min(max, parsed));
          return {
            ...item,
            quantity: qty,
            total: qty * item.unitPrice,
          };
        }
        return item;
      }),
    );
  };

  const handleRateChange = (id: string, val: string) => {
    const rate = Math.max(0, parseFloat(val) || 0);
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            unitPrice: rate,
            total: item.quantity * rate,
          };
        }
        return item;
      }),
    );
  };

  const handleItemReasonChange = (id: string, val: string) => {
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, reason: val };
        }
        return item;
      }),
    );
  };

  const handleItemReturnTypeChange = (id: string, val: string) => {
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, returnType: val };
        }
        return item;
      }),
    );
  };

  // Submit Sales Return Form
  const handleSubmit = async () => {
    const validItems = selectedItems.filter(
      (i) => i.isSelected && i.itemId !== "" && i.quantity > 0,
    );
    if (validItems.length === 0) {
      toast.error(
        isBangla
          ? "অনুগ্রহ করে অন্তত একটি ফেরতযোগ্য পণ্য নির্বাচন করুন"
          : "Please select at least one return item",
      );
      return;
    }

    const payload = {
      // partyId: selectedPartyId || undefined,
      saleId: selectedSaleId || undefined,
      items: validItems.map((item) => ({
        saleItemId: item.itemId,
        quantity: item.quantity,
        returnType: item.returnType || "refund",
        reason: item.reason || overallReason || undefined,
      })),
      reason: overallReason || undefined,
      notes: notes || undefined,
      imageUrl: returnImage || undefined,
      refundMethod,
      accountId: accountId || undefined,
    };

    mutate(payload, {
      onSuccess: () => {
        toast.success(
          isBangla
            ? "বিক্রয় ফেরত সফলভাবে সম্পন্ন হয়েছে"
            : "Sale return completed successfully",
        );
        router.push("/sales");
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.message ||
            (isBangla ? "বিক্রয় ফেরত ব্যর্থ হয়েছে" : "Sale return failed"),
        );
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-border/40">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <RotateCcw className="h-6 w-6 text-red-500" />
          {isBangla ? "বিক্রয় ফেরত" : "Sales Return"}
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
      {/* Main Sales Invoice Card */}
      <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm space-y-4">
        {/* Card Header & Invoice Change Button */}
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Receipt className="h-4 w-4" />
            <span>{isBangla ? "বিক্রয় ইনভয়েস" : "Sales Invoice"}</span>
          </div>
          {selectedSaleId && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedSaleId("");
                setSelectedInvoiceNo("");
                setInvoiceSearchQuery("");
                setSelectedItems([]);
              }}
              className="h-8 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {isBangla ? "ইনভয়েস পরিবর্তন করুন" : "Change Invoice"}
            </Button>
          )}
        </div>

        {/* 4-Column Grid: Original Sale Invoice, Customer, Invoice Date, Return Date (25% width each) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* Field 1 (25%): Original Sale Invoice */}
          <div className="relative space-y-1.5">
            <Label className="text-xs font-medium text-foreground">
              {isBangla ? "মূল ইনভয়েস" : "Original Sale Invoice"}
            </Label>
            <div className="relative">
              <Input
                value={selectedInvoiceNo || invoiceSearchQuery}
                onChange={(e) => {
                  setInvoiceSearchQuery(e.target.value);
                  if (selectedSaleId) setSelectedSaleId("");
                  setShowInvoiceSuggestions(true);
                }}
                onFocus={() => setShowInvoiceSuggestions(true)}
                onBlur={() => {
                  setTimeout(() => setShowInvoiceSuggestions(false), 200);
                }}
                placeholder={
                  isBangla
                    ? "ইনভয়েস নম্বর দিয়ে খুঁজুন..."
                    : "Search sales invoice number..."
                }
                className="pr-10 h-11 bg-background/50 border-input focus-visible:ring-1 text-sm font-medium w-full"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

              {showInvoiceSuggestions && (
                <div className="absolute z-50 left-0 top-full mt-1 w-full bg-card border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto divide-y divide-border">
                  {filteredSalesList.length === 0 ? (
                    <div className="p-3 text-center text-sm text-muted-foreground">
                      {isBangla
                        ? "কোনো ইনভয়েস পাওয়া যায়নি"
                        : "No invoices found"}
                    </div>
                  ) : (
                    filteredSalesList.map((sale: any) => (
                      <button
                        key={sale.id}
                        type="button"
                        className="w-full text-left p-3 hover:bg-muted/80 text-sm transition-colors flex justify-between items-center"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setSelectedSaleId(sale.id);
                          setSelectedInvoiceNo(sale.invoiceNo);
                          setInvoiceSearchQuery("");
                          setShowInvoiceSuggestions(false);
                        }}
                      >
                        <div>
                          <p className="font-semibold text-foreground">
                            {sale.invoiceNo}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {sale.party?.name || "Retail Customer"}
                          </p>
                        </div>
                        <span className="font-bold text-xs text-primary">
                          {formatCurrency(sale.total)}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
   {/* Field 3 (25%): Phone (Non-editable) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">
              {isBangla ? "ফোন নম্বর" : "Phone"}
            </Label>
            <Input
            
              value={
                selectedSaleId
                  ? singleSaleData?.data?.party?.phone || singleSaleData?.data?.phone || "—"
                  : ""
              }
              placeholder={isBangla ? "ইনভয়েস নির্বাচন করুন" : "Select invoice"}
              className="h-11 border-input text-sm font-semibold text-foreground disabled:opacity-80"
            />
          </div>
          {/* Field 2 (25%): Customer (Non-editable) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">
              {isBangla ? "গ্রাহক" : "Customer"}
            </Label>
            <Input
              readOnly
              disabled
              value={
                selectedSaleId
                  ? selectedPartyName ||
                    singleSaleData?.data?.party?.name ||
                    (isBangla ? "ক্যাশ কাস্টমার" : "Cash Customer")
                  : ""
              }
              placeholder={isBangla ? "ইনভয়েস নির্বাচন করুন" : "Select invoice"}
              className="h-11 bg-muted/40 border-input text-sm font-bold text-foreground cursor-not-allowed disabled:opacity-80"
            />
          </div>

       

          {/* Field 4 (25%): Return Date (Editable Date Picker) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">
              {isBangla ? "ফেরতের তারিখ" : "Return Date"}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-11 justify-between text-left font-normal bg-background/50 border-input text-foreground hover:bg-muted text-sm font-medium cursor-pointer"
                >
                  <span>{format(returnDate, "dd MMM yyyy")}</span>
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={returnDate}
                  onSelect={(date) => date && setReturnDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
  
      </div>

      {/* 75% / 25% Split Layout Container */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Side (75% on Desktop when invoice selected, 100% otherwise) */}
        <div className={cn("w-full space-y-6", selectedSaleId ? "lg:w-[75%]" : "lg:w-full")}>
          
          {/* IF NO INVOICE IS SELECTED: SHOW EMPTY PLACEHOLDER CARD */}
          {!selectedSaleId ? (
            <div className="bg-card/50 border border-dashed border-border rounded-xl p-12 text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <Receipt className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-foreground">
                {isBangla ? "কোনো ইনভয়েস নির্বাচন করা হয়নি" : "No Sale Invoice Selected"}
              </h3>
              <p className="text-xs text-muted-foreground mx-auto">
                {isBangla
                  ? "বিক্রয় ফেরত প্রক্রিয়া শুরু করতে উপরে যেকোনো মূল বিক্রয় ইনভয়েস সার্চ করে সিলেক্ট করুন।"
                  : "Please search and select an original sale invoice above to view sales details, product info, and process return items."}
              </p>
            </div>
          ) : (
            <React.Fragment>

          {/* Row 2: Return Items Table */}
          <div className="border border-border rounded-xl bg-card overflow-x-auto shadow-sm">
            {/* Sales Billing Info Text in sm text at the top of the table */}
            {singleSaleData?.data && (
              <div className="px-4 py-2.5 bg-muted/40 border-b border-border/50 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-medium">
                <div className="flex items-center gap-2 flex-wrap text-muted-foreground text-xs">
                  <span>
                    {isBangla ? "তারিখ:" : "Invoice Date:"}{" "}
                    <strong className="text-foreground">
                      {singleSaleData.data.createdAt
                        ? format(new Date(singleSaleData.data.createdAt), "dd MMM yyyy")
                        : "—"}
                    </strong>
                  </span>
                </div>

                <div className="flex items-center gap-3.5 flex-wrap text-xs">
                  <span>
                    {isBangla ? "মোট ইনভয়েস:" : "Total:"}{" "}
                    <strong className="font-bold text-foreground">
                      {formatCurrency(singleSaleData.data.total || 0)}
                    </strong>
                  </span>
                  <span>
                    {isBangla ? "পরিশোধিত:" : "Paid:"}{" "}
                    <strong className="font-bold text-emerald-500">
                      {formatCurrency(
                        singleSaleData.data.paidAmount || singleSaleData.data.paid || 0
                      )}
                    </strong>
                  </span>
                  <span>
                    {isBangla ? "বাকি:" : "Due:"}{" "}
                    <strong className="font-bold text-rose-500">
                      {formatCurrency(
                        singleSaleData.data.dueAmount ??
                          (singleSaleData.data.total -
                            (singleSaleData.data.paidAmount || 0))
                      )}
                    </strong>
                  </span>
                </div>
              </div>
            )}

            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">
                {isBangla ? "ফেরতযোগ্য পণ্য তালিকা" : "Returnable Items Details"}
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
                  <TableHead className="px-4 py-3 text-center w-28 text-xs font-semibold">
                    {isBangla ? "ফেরত পরিমাণ *" : "Return Qty *"}
                  </TableHead>
                  <TableHead className="px-3 py-3 text-xs font-semibold">
                    {isBangla ? "ফেরত টাইপ" : "Return Type"}
                  </TableHead>
                  <TableHead className="px-3 py-3 text-xs font-semibold">
                    {isBangla ? "কারণ" : "Reason"}
                  </TableHead>
                  <TableHead className="px-3 py-3 text-right text-xs font-semibold">
                    {isBangla ? "মোট" : "Total"}
                  </TableHead>
                  <TableHead className="px-4 py-3 text-right w-12">
                    <div className="inline-flex items-center justify-center">
                      <Checkbox
                        checked={
                          selectedItems.length > 0 &&
                          selectedItems.every((i) => i.isSelected)
                        }
                        onCheckedChange={(checked) =>
                          toggleSelectAll(!!checked)
                        }
                        className="h-[18px] w-[18px] border-2 border-primary/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border/60">
                {selectedItems.map((item) => (
                  <TableRow
                    key={item.id}
                    className={cn(
                      "hover:bg-muted/20 transition-colors cursor-pointer",
                      item.isSelected ? "bg-primary/5 dark:bg-primary/10" : ""
                    )}
                    onClick={() => toggleItemSelection(item.id)}
                  >
                    {/* Item & SKU */}
                    <TableCell className="px-4 py-3.5 align-middle">
                      <p className="font-semibold text-foreground text-xs leading-tight">
                        {item.itemName || (isBangla ? "পণ্য নির্বাচন করুন" : "Select Product")}
                      </p>
                      {item.sku && item.sku !== "—" && (
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          SKU: {item.sku}
                        </p>
                      )}
                    </TableCell>

                    {/* Unit Price */}
                    <TableCell className="px-3 py-3.5 align-middle text-right font-medium text-foreground text-xs">
                      {formatCurrency(item.unitPrice)}
                    </TableCell>

                    {/* Sold Quantity */}
                    <TableCell className="px-3 py-3.5 align-middle text-center text-muted-foreground font-medium text-xs">
                      {item.maxQuantity ?? item.quantity ?? 1}
                    </TableCell>

                    {/* Return Quantity with Stepper */}
                    <TableCell className="px-4 py-3.5 align-middle" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center border border-input rounded bg-background/50 h-8 w-24 mx-auto">
                        <button
                          type="button"
                          disabled={(item.quantity || 0) <= 0}
                          onClick={() => handleQuantityChange(item.id, (item.quantity || 0) - 1)}
                          className="h-full px-2 text-muted-foreground hover:text-foreground active:bg-muted/20 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={0}
                          max={item.maxQuantity}
                          value={item.quantity || 0}
                          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                          className="w-full text-center h-full bg-transparent outline-none border-none text-xs font-semibold text-foreground [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button
                          type="button"
                          disabled={item.maxQuantity !== undefined && (item.quantity || 0) >= item.maxQuantity}
                          onClick={() => handleQuantityChange(item.id, (item.quantity || 0) + 1)}
                          className="h-full px-2 text-muted-foreground hover:text-foreground active:bg-muted/20 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </TableCell>

                    {/* Return Type */}
                    <TableCell className="px-3 py-3.5 align-middle" onClick={(e) => e.stopPropagation()}>
                      <Select
                        value={item.returnType || "refund"}
                        onValueChange={(val) => handleItemReturnTypeChange(item.id, val)}
                      >
                        <SelectTrigger className="h-8 text-[11px] bg-background/40 w-28 border-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="refund" className="text-xs">
                            {isBangla ? "রিফান্ড" : "Refund"}
                          </SelectItem>
                          <SelectItem value="exchange" className="text-xs">
                            {isBangla ? "বিনিময়" : "Exchange"}
                          </SelectItem>
                          <SelectItem value="restock" className="text-xs">
                            {isBangla ? "স্টকে ফেরত" : "Return to Stock"}
                          </SelectItem>
                          <SelectItem value="damage" className="text-xs">
                            {isBangla ? "ড্যামেজ" : "Damaged"}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>

                    {/* Return Reason */}
                    <TableCell className="px-3 py-3.5 align-middle" onClick={(e) => e.stopPropagation()}>
                      <Select
                        value={item.reason || "defective"}
                        onValueChange={(val) => handleItemReasonChange(item.id, val)}
                      >
                        <SelectTrigger className="h-8 text-[11px] bg-background/40 w-28 border-input">
                          <SelectValue placeholder={isBangla ? "কারণ বলুন" : "Reason"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="defective" className="text-xs">
                            {isBangla ? "ত্রুটিপূর্ণ / ড্যামেজ" : "Defective / Damaged"}
                          </SelectItem>
                          <SelectItem value="expired" className="text-xs">
                            {isBangla ? "মেয়াদোত্তীর্ণ" : "Expired"}
                          </SelectItem>
                          <SelectItem value="wrong_item" className="text-xs">
                            {isBangla ? "ভুল পণ্য" : "Wrong Item"}
                          </SelectItem>
                          <SelectItem value="not_satisfied" className="text-xs">
                            {isBangla ? "গ্রাহক অসন্তুষ্ট" : "Not Satisfied"}
                          </SelectItem>
                          <SelectItem value="other" className="text-xs">
                            {isBangla ? "অন্যান্য" : "Other"}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>

                    {/* Total Refund for line */}
                    <TableCell className="px-3 py-3.5 align-middle text-right font-bold text-foreground text-xs">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </TableCell>

                    {/* Select Checkbox */}
                    <TableCell className="px-4 py-3.5 align-middle text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center justify-center">
                        <Checkbox
                          checked={item.isSelected}
                          onCheckedChange={(checked) => toggleItemSelection(item.id, !!checked)}
                          className="h-[18px] w-[18px] border-2 border-primary/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      </div>
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
                <span className="font-bold text-foreground text-sm">
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
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    isBangla
                      ? "অতিরিক্ত মন্তব্য লিখুন..."
                      : "Write additional remarks..."
                  }
                  className="bg-background/50 border-input text-sm resize-none flex-1 min-h-[140px] h-full"
                />
              </div>

              {/* Right Column: Return Image / Document Upload */}
              <div className="flex flex-col space-y-2 h-full">
                <Label className="text-xs font-medium text-foreground flex items-center gap-2 shrink-0">
                  <ImageIcon className="h-4 w-4 text-primary" />
                  {isBangla ? "প্রমাণ ডকুমেন্ট / ছবি আপলোড" : "Return Image / Document"}
                </Label>

                {returnImage ? (
                  <div className="relative rounded-lg border border-border overflow-hidden group bg-background/50 flex-1 min-h-[140px] h-full flex items-center justify-center">
                    <img
                      src={returnImage}
                      alt="Return proof"
                      className="h-full w-full object-contain p-2 max-h-[160px]"
                    />
                    <button
                      type="button"
                      onClick={() => setReturnImage(null)}
                      className="absolute top-2 right-2 bg-rose-500 text-white p-1 rounded-full hover:bg-rose-600 transition-colors shadow-md"
                      title={isBangla ? "ছবি মুছুন" : "Remove image"}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center flex-1 min-h-[140px] h-full border-2 border-dashed border-border/80 rounded-lg cursor-pointer bg-background/30 hover:bg-muted/40 transition-colors p-4 text-center">
                    <Upload className="h-6 w-6 text-muted-foreground mb-1.5" />
                    <span className="text-xs font-medium text-foreground">
                      {isBangla ? "ছবি আপলোড করুন" : "Upload Image"}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">
                      {isBangla ? "PNG, JPG বা WEBP (সর্বোচ্চ 5MB)" : "PNG, JPG or WEBP (Max 5MB)"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>

        {/* Right Side: Refund Summary Sidebar (25% on Desktop) */}
        {selectedSaleId && (
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
                <span className="font-semibold text-foreground">
                  {selectedItems.filter((i) => i.isSelected && i.itemId).length}
                </span>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <span>{isBangla ? "ফেরত উপমোট" : "Subtotal"}</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(subtotalRefund)}
                </span>
              </div>

              <div className="pt-3 border-t border-border/60 flex justify-between items-center">
                <span className="font-bold text-foreground text-base">
                  {isBangla ? "মোট রিফান্ড" : "Grand Refund Total"}
                </span>
                <span className="text-xl font-extrabold text-red-500">
                  {formatCurrency(grandTotalRefund)}
                </span>
              </div>
            </div>

            {/* Account ID / Mobile No input when non-cash method */}
            {refundMethod !== "cash" && (
              <div className="space-y-1.5 pt-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  {isBangla
                    ? "অ্যাকাউন্ট আইডি / মোবাইল নং"
                    : "Account ID / Mobile No"}
                </Label>
                <Input
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  placeholder="017xxxxxxxx / Acc No"
                  className="h-9 text-xs bg-background/50 border-input"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-4">
              <Button
                onClick={handleSubmit}
                disabled={isPending || grandTotalRefund === 0}
                className="w-full h-11 bg-red-800 text-white font-bold text-sm transition-all gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isBangla ? "প্রসেস হচ্ছে..." : "Processing..."}
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    {isBangla ? "ফেরত নিশ্চিত করুন" : "Confirm Sales Return"}
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => router.back()}
                className="w-full h-10 border-border/80 hover:bg-muted"
              >
                {isBangla ? "বাতিল" : "Cancel"}
              </Button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default function SalesReturnPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <SalesReturnContent />
    </Suspense>
  );
}
