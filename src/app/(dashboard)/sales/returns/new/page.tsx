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
import {
  Plus,
  Trash2,
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
  batchNo?: string;
  quantity: number;
  unitPrice: number;
  returnType: string;
  reason: string;
  total: number;
  searchQuery: string;
  showSuggestions: boolean;
  imageUrl?: string;
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

  const getItemBatches = (itemId: string) => {
    if (!itemId || !Array.isArray(batches)) return [];
    return batches.filter((b: any) => b.itemId === itemId);
  };

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
          id: Math.random().toString(),
          itemId: it.itemId || it.item?.id || "",
          itemName: it.itemName || it.item?.name || "",
          batchNo: it.batchNo || "",
          quantity: it.quantity || 1,
          unitPrice: it.unitPrice || 0,
          returnType: "refund",
          reason: "defective",
          total: (it.quantity || 1) * (it.unitPrice || 0),
          searchQuery: "",
          showSuggestions: false,
          imageUrl: it.item?.imageUrl || "",
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

  // Total Refund calculation
  const subtotalRefund = useMemo(() => {
    return selectedItems.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );
  }, [selectedItems]);

  const grandTotalRefund = useMemo(() => {
    return Math.max(0, subtotalRefund);
  }, [subtotalRefund]);

  // Add Item Row
  const addItemRow = () => {
    setSelectedItems((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
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
  };

  // Remove Item Row
  const removeItemRow = (id: string) => {
    if (selectedItems.length === 1) {
      setSelectedItems([
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
      return;
    }
    setSelectedItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Product Search / Selection Handlers
  const handleNameChange = (id: string, query: string) => {
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            itemId: "",
            itemName: "",
            searchQuery: query,
            showSuggestions: true,
            imageUrl: "",
          };
        }
        return item;
      }),
    );
  };

  const handleSelectProduct = (rowId: string, product: any) => {
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id === rowId) {
          const qty = item.quantity || 1;
          const price = product.unitPrice || product.sellingPrice || 0;
          const name = product.itemName || product.item?.name || product.name || "";
          return {
            ...item,
            itemId: product.itemId || product.id || product.item?.id || "",
            itemName: name,
            searchQuery: "",
            unitPrice: price,
            total: qty * price,
            showSuggestions: false,
            imageUrl: product.imageUrl || product.item?.imageUrl || "",
          };
        }
        return item;
      }),
    );
  };

  const handleQuantityChange = (id: string, val: string) => {
    const qty = Math.max(1, parseInt(val) || 1);
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
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

  const getFilteredProducts = (query: string) => {
    if (!query) return invoiceItems;
    return invoiceItems.filter(
      (it: any) =>
        (it.itemName || it.item?.name || "")
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        (it.item?.sku || "").toLowerCase().includes(query.toLowerCase()),
    );
  };

  // Submit Sales Return Form
  const handleSubmit = async () => {
    const validItems = selectedItems.filter(
      (i) => i.itemId !== "" && i.quantity > 0,
    );
    if (validItems.length === 0) {
      toast.error(
        isBangla
          ? "অন্তত একটি ফেরতযোগ্য পণ্য যোগ করুন"
          : "Add at least one return item",
      );
      return;
    }

    const payload = {
      partyId: selectedPartyId || undefined,
      saleId: selectedSaleId || undefined,
      items: validItems.map((item) => ({
        itemId: item.itemId,
        itemName: item.itemName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
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

      {/* 75% / 25% Split Layout Container */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Side (75% on Desktop when invoice selected, 100% otherwise) */}
        <div className={cn("w-full space-y-6", selectedSaleId ? "lg:w-[75%]" : "lg:w-full")}>
          {/* Main Sales Invoice Card */}
          <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm space-y-4">
            {/* Card Header & Invoice Change Button */}
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Receipt className="h-4 w-4" />
                <span>
                  {isBangla ? "বিক্রয় ইনভয়েস" : "Sales Invoice"}
                </span>
              </div>
             
            </div>

            {/* Inputs Grid: Original Sale Invoice Search (50%) & Return Date Picker (50%) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Original Sale Invoice (50% Width) */}
              <div className="relative space-y-2">
                <Label className="text-xs font-medium text-foreground">
                  {isBangla ? "মূল ইনভয়েস নির্বাচন করুন" : "Original Sale Invoice"}
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
                    className="pr-10 h-11 bg-background/50 border-input focus-visible:ring-1 text-sm font-medium"
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

              {/* Return Date (50% Width) */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-foreground">
                  {isBangla ? "ফেরতের তারিখ" : "Return Date"}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-11 justify-between text-left font-normal bg-background/50 border-input text-foreground hover:bg-muted text-sm font-medium"
                    >
                      <span>{format(returnDate, "dd MMM yyyy")}</span>
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
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

            {/* When Invoice IS Selected: Show Summary Details Grid & Items Purchased */}
            {singleSaleData?.data && (
              <React.Fragment>
                {/* Summary Details Grid */}
                <div className="pt-3 border-t border-border/40 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-xs">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      {isBangla ? "পার্টি / গ্রাহক" : "Party / Customer"}
                    </p>
                    <p className="font-semibold text-foreground truncate mt-0.5">
                      {selectedPartyName ||
                        singleSaleData?.data?.party?.name ||
                        (isBangla ? "ক্যাশ কাস্টমার" : "Cash Customer")}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      {isBangla ? "বিক্রয় তারিখ" : "Sales Date"}
                    </p>
                    <p className="font-semibold text-foreground mt-0.5">
                      {singleSaleData.data.createdAt
                        ? format(new Date(singleSaleData.data.createdAt), "dd MMM yyyy")
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      {isBangla ? "মোট ইনভয়েস পরিমাণ" : "Invoice Total"}
                    </p>
                    <p className="font-bold text-foreground mt-0.5">
                      {formatCurrency(singleSaleData.data.total || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-emerald-400 uppercase tracking-wide">
                      {isBangla ? "পরিশোধিত পরিমাণ" : "Paid Amount"}
                    </p>
                    <p className="font-bold text-emerald-500 mt-0.5">
                      {formatCurrency(
                        singleSaleData.data.paidAmount || singleSaleData.data.paid || 0,
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-rose-400 uppercase tracking-wide">
                      {isBangla ? "ইনভয়েস বাকি" : "Due Balance"}
                    </p>
                    <p className="font-bold text-rose-500 mt-0.5">
                      {formatCurrency(
                        singleSaleData.data.dueAmount ??
                          (singleSaleData.data.total -
                            (singleSaleData.data.paidAmount || 0)),
                      )}
                    </p>
                  </div>
                </div>

                {/* Purchased Items List */}
                {singleSaleData.data.items && singleSaleData.data.items.length > 0 && (
                  <div className="pt-3 border-t border-border/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Receipt className="h-3.5 w-3.5 text-primary" />
                        {isBangla
                          ? "ক্রয়কৃত পণ্যের বিবরণ"
                          : "Items Purchased in Sale Invoice"}
                      </p>
                      <span className="text-[10px] font-medium text-muted-foreground">
                        {singleSaleData.data.items.length}{" "}
                        {isBangla ? "টি আইটেম" : "items"}
                      </span>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-border/60 bg-card/60">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-muted/50 text-[10px] uppercase font-semibold text-muted-foreground border-b border-border/50">
                          <tr>
                            <th className="py-2 px-3">{isBangla ? "পণ্য" : "Item"}</th>
                            <th className="py-2 px-2 text-center">{isBangla ? "ব্যাচ" : "Batch"}</th>
                            <th className="py-2 px-2 text-center">{isBangla ? "পরিমাণ" : "Qty"}</th>
                            <th className="py-2 px-2 text-right">{isBangla ? "দর" : "Rate"}</th>
                            <th className="py-2 px-2 text-right">{isBangla ? "ছাড়" : "Discount"}</th>
                            <th className="py-2 px-3 text-right">{isBangla ? "মোট" : "Amount"}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40 text-xs">
                          {singleSaleData.data.items.map((saleItem: any, idx: number) => {
                            const img = saleItem.imageUrl || saleItem.item?.imageUrl;
                            const name = saleItem.itemName || saleItem.item?.name || "Product";
                            const batch = saleItem.batchNo || saleItem.batch?.batchNo || "—";
                            const qty = saleItem.quantity || 1;
                            const rate = saleItem.unitPrice || saleItem.price || 0;
                            const discount = saleItem.discount || 0;
                            const amount = saleItem.total ?? (qty * rate - discount);

                            return (
                              <tr key={saleItem.id || idx} className="hover:bg-muted/40 transition-colors">
                                {/* Image + Name */}
                                <td className="py-2 px-3">
                                  <div className="flex items-center gap-2 min-w-0">
                                    {img ? (
                                      <div className="h-7 w-7 rounded overflow-hidden relative shrink-0 border border-border">
                                        <Image
                                          src={img}
                                          alt={name}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                    ) : (
                                      <div className="h-7 w-7 rounded bg-muted flex items-center justify-center shrink-0 border border-border">
                                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                                      </div>
                                    )}
                                    <span className="font-semibold text-foreground truncate text-xs">
                                      {name}
                                    </span>
                                  </div>
                                </td>

                                {/* Batch */}
                                <td className="py-2 px-2 text-center text-muted-foreground font-mono text-[11px]">
                                  {batch}
                                </td>

                                {/* Quantity */}
                                <td className="py-2 px-2 text-center font-semibold text-foreground">
                                  {qty}
                                </td>

                                {/* Rate */}
                                <td className="py-2 px-2 text-right text-muted-foreground">
                                  {formatCurrency(rate)}
                                </td>

                                {/* Discount */}
                                <td className="py-2 px-2 text-right text-rose-500 font-medium">
                                  {discount > 0 ? `-${formatCurrency(discount)}` : "—"}
                                </td>

                                {/* Amount */}
                                <td className="py-2 px-3 text-right font-bold text-primary">
                                  {formatCurrency(amount)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </React.Fragment>
            )}
          </div>

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
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="px-3 py-3 w-[4%] text-xs font-semibold uppercase">
                    {isBangla ? "ক্রম" : "S.N."}
                  </TableHead>
                  <TableHead className="px-3 py-3 w-[34%] text-xs font-semibold uppercase">
                    {isBangla ? "পণ্য" : "Product"}
                  </TableHead>
                  <TableHead className="px-3 py-3 w-[10%] text-xs font-semibold uppercase">
                    {isBangla ? "পরিমাণ" : "Qty"}
                  </TableHead>
                  <TableHead className="px-3 py-3 w-[11%] text-xs font-semibold uppercase">
                    {isBangla ? "দর" : "Rate"}
                  </TableHead>
                  <TableHead className="px-3 py-3 w-[15%] text-xs font-semibold uppercase">
                    {isBangla ? "ফেরতের ধরন" : "Return Type"}
                  </TableHead>
                  <TableHead className="px-3 py-3 w-[15%] text-xs font-semibold uppercase">
                    {isBangla ? "ফেরত কারণ" : "Return Reason"}
                  </TableHead>
                  <TableHead className="px-3 py-3 w-[10%] text-right text-xs font-semibold uppercase">
                    {isBangla ? "মোট রিফান্ড" : "Total"}
                  </TableHead>
                  <TableHead className="px-2 py-3 w-[4%]" />
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border">
                {selectedItems.map((item, idx) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-muted/10 transition-colors"
                  >
                    {/* S.N. */}
                    <TableCell className="px-4 py-4 font-bold text-amber-500 align-middle">
                      {idx + 1}
                    </TableCell>

                    {/* Product Name / Search */}
                    <TableCell className="px-4 py-3 align-middle relative">
                      <Popover open={item.showSuggestions}>
                        <PopoverAnchor asChild>
                          <div className="w-full">
                            <Input
                              value={
                                item.showSuggestions
                                  ? item.searchQuery || ""
                                  : item.itemName
                              }
                              placeholder={
                                isBangla ? "পণ্য খুঁজুন..." : "Search item..."
                              }
                              className="bg-transparent border-none outline-none focus-visible:ring-0 px-0 h-9 w-full font-medium"
                              onFocus={() => {
                                setSelectedItems((prev) =>
                                  prev.map((i) =>
                                    i.id === item.id
                                      ? {
                                          ...i,
                                          searchQuery: i.itemName,
                                          showSuggestions: true,
                                        }
                                      : i,
                                  ),
                                );
                              }}
                              onChange={(e) =>
                                handleNameChange(item.id, e.target.value)
                              }
                            />
                          </div>
                        </PopoverAnchor>

                        <PopoverContent
                          className="w-[360px] p-0 bg-card border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto divide-y divide-border z-50 text-foreground"
                          align="start"
                          onOpenAutoFocus={(e) => e.preventDefault()}
                          onCloseAutoFocus={(e) => e.preventDefault()}
                        >
                          {getFilteredProducts(item.searchQuery || "")
                            .length === 0 ? (
                            <div className="p-3 text-center text-sm text-muted-foreground">
                              {isBangla
                                ? "ইনভয়েসে কোনো পণ্য পাওয়া যায়নি"
                                : "No items found in invoice"}
                            </div>
                          ) : (
                            getFilteredProducts(item.searchQuery || "").map(
                              (product: any) => (
                                <button
                                  key={product.id || product.itemId}
                                  type="button"
                                  className="w-full text-left p-2.5 hover:bg-muted/80 transition-colors flex items-center justify-between gap-3 text-foreground"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleSelectProduct(item.id, product);
                                  }}
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="h-8 w-8 rounded bg-muted flex items-center justify-center shrink-0">
                                      <FileText className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="font-semibold text-foreground truncate text-xs">
                                        {product.itemName || product.item?.name || product.name}
                                      </p>
                                      <p className="text-[10px] text-muted-foreground truncate">
                                        Sold Qty: {product.quantity ?? 1}
                                      </p>
                                    </div>
                                  </div>
                                  <span className="font-bold text-xs text-primary shrink-0">
                                    {formatCurrency(product.unitPrice || product.sellingPrice || 0)}
                                  </span>
                                </button>
                              ),
                            )
                          )}
                        </PopoverContent>
                      </Popover>
                    </TableCell>

                    {/* Quantity */}
                    <TableCell className="px-4 py-3 align-middle">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item.id, e.target.value)
                        }
                        className="h-8 w-20 text-center font-semibold bg-background/50 border-input"
                      />
                    </TableCell>

                    {/* Rate */}
                    <TableCell className="px-4 py-3 align-middle">
                      <Input
                        type="number"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleRateChange(item.id, e.target.value)
                        }
                        className="h-8 w-24 font-medium bg-background/50 border-input"
                      />
                    </TableCell>

                    {/* Return Type */}
                    <TableCell className="px-3 py-3 align-middle">
                      <Select
                        value={item.returnType || "refund"}
                        onValueChange={(val) =>
                          handleItemReturnTypeChange(item.id, val)
                        }
                      >
                        <SelectTrigger className="h-8 text-xs bg-background/50 border-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="refund">
                            {isBangla ? "রিফান্ড" : "Refund"}
                          </SelectItem>
                          <SelectItem value="exchange">
                            {isBangla ? "বিনিময়" : "Exchange / Replace"}
                          </SelectItem>
                          <SelectItem value="restock">
                            {isBangla ? "স্টকে ফেরত" : "Return to Stock"}
                          </SelectItem>
                          <SelectItem value="damage">
                            {isBangla ? "ড্যামেজ" : "Damaged / Scrap"}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>

                    {/* Item Reason */}
                    <TableCell className="px-3 py-3 align-middle">
                      <Select
                        value={item.reason || "defective"}
                        onValueChange={(val) =>
                          handleItemReasonChange(item.id, val)
                        }
                      >
                        <SelectTrigger className="h-8 text-xs bg-background/50 border-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="defective">
                            {isBangla
                              ? "ত্রুটিপূর্ণ / ড্যামেজ"
                              : "Defective / Damaged"}
                          </SelectItem>
                          <SelectItem value="expired">
                            {isBangla ? "মেয়াদোত্তীর্ণ" : "Expired"}
                          </SelectItem>
                          <SelectItem value="wrong_item">
                            {isBangla ? "ভুল পণ্য" : "Wrong Item"}
                          </SelectItem>
                          <SelectItem value="not_satisfied">
                            {isBangla
                              ? "গ্রাহক অসন্তুষ্ট"
                              : "Customer Dissatisfied"}
                          </SelectItem>
                          <SelectItem value="other">
                            {isBangla ? "অন্যান্য" : "Other"}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>

                    {/* Line Total */}
                    <TableCell className="px-4 py-3 align-middle text-right font-bold text-slate-100">
                      {formatCurrency(item.total)}
                    </TableCell>

                    {/* Remove Row */}
                    <TableCell className="px-4 py-3 align-middle text-right">
                      <button
                        type="button"
                        onClick={() => removeItemRow(item.id)}
                        className="text-muted-foreground hover:text-rose-500 p-1.5 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Add Row Footer */}
            <div className="p-3 bg-muted/20 border-t border-border flex justify-start">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItemRow}
                className="gap-2 text-xs font-semibold"
              >
                <Plus className="h-3.5 w-3.5" />
                {isBangla ? "ফেরতযোগ্য পণ্য যোগ করুন" : "Add Return Item"}
              </Button>
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
                  {selectedItems.filter((i) => i.itemId).length}
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

            {/* Refund Payment Method Selector */}
            <div className="space-y-3 pt-3 border-t border-border/60">
              <Label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                {isBangla ? "রিফান্ড মাধ্যম" : "Refund Method"}
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    id: "cash",
                    label: isBangla ? "নগদ" : "Cash",
                    icon: Banknote,
                  },
                  {
                    id: "mobile_banking",
                    label: "bKash / Nagad",
                    icon: Smartphone,
                  },
                  {
                    id: "card",
                    label: isBangla ? "ব্যাংক" : "Bank",
                    icon: Building2,
                  },
                  {
                    id: "credit_note",
                    label: isBangla ? "ক্রেডিট নোট" : "Credit Note",
                    icon: CreditCard,
                  },
                ].map((method) => {
                  const Icon = method.icon;
                  const isSelected = refundMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setRefundMethod(method.id as any)}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-semibold transition-all gap-1.5",
                        isSelected
                          ? "border-red-500 bg-red-500/10 text-red-500 shadow-sm"
                          : "border-border/60 hover:bg-muted/50 text-muted-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="truncate">{method.label}</span>
                    </button>
                  );
                })}
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
