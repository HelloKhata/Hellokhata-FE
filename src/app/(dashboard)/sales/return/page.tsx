// Hello Khata OS - Sales Return Page
// হ্যালো খাতা - বিক্রয় ফেরত পেজ

"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
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
} from "lucide-react";
import { useCurrency } from "@/hooks/useAppTranslation";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useGetItems } from "@/hooks/api/useItems";
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

  // API Data
  const { data: itemsData } = useGetItems({ page: 1, limit: 100 });
  const items = itemsData?.data || [];
  const { data: partiesData } = useParties();
  const parties = partiesData?.data || [];

  const { data: singlePartyData } = useParty(selectedPartyId, {
    enabled: !!selectedPartyId,
  });

  const { data: salesData } = useGetSales({ partyId: selectedPartyId || undefined });
  const salesList = salesData?.data || [];

  const { data: singleSaleData } = useGetSaleById(selectedSaleId);

  const { data: batchesData } = useGetBatches({ status: "active", limit: 1000 });
  const batches = batchesData || [];

  const getItemBatches = (itemId: string) => {
    if (!itemId) return [];
    return batches.filter((b: any) => b.itemId === itemId);
  };

  // Return Form Header Details
  const [returnNo, setReturnNo] = useState("RET-101");
  const [isManualReturnNo, setIsManualReturnNo] = useState(false);
  const [returnDate, setReturnDate] = useState<Date>(new Date());

  // Return Reasons & Remarks
  const [overallReason, setOverallReason] = useState("");
  const [notes, setNotes] = useState("");

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
      reason: "",
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
          reason: "",
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
        p.phone?.includes(partySearchQuery)
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
        s.party?.name?.toLowerCase().includes(invoiceSearchQuery.toLowerCase())
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
    return selectedItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
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
        reason: "",
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
          reason: "",
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
      })
    );
  };

  const handleSelectProduct = (rowId: string, product: any) => {
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id === rowId) {
          const qty = item.quantity || 1;
          const price = product.sellingPrice || 0;
          return {
            ...item,
            itemId: product.id,
            itemName: product.name,
            searchQuery: "",
            unitPrice: price,
            total: qty * price,
            showSuggestions: false,
            imageUrl: product.imageUrl,
          };
        }
        return item;
      })
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
      })
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
      })
    );
  };

  const handleItemReasonChange = (id: string, val: string) => {
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, reason: val };
        }
        return item;
      })
    );
  };

  const getFilteredProducts = (query: string) => {
    if (!query) return items;
    return items.filter(
      (it: any) =>
        it.name?.toLowerCase().includes(query.toLowerCase()) ||
        it.sku?.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Submit Sales Return Form
  const handleSubmit = async () => {
    const validItems = selectedItems.filter((i) => i.itemId !== "" && i.quantity > 0);
    if (validItems.length === 0) {
      toast.error(
        isBangla ? "অন্তত একটি ফেরতযোগ্য পণ্য যোগ করুন" : "Add at least one return item"
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
        reason: item.reason || overallReason || undefined,
      })),
      reason: overallReason || undefined,
      notes: notes || undefined,
      refundMethod,
      accountId: accountId || undefined,
    };

    mutate(payload, {
      onSuccess: () => {
        toast.success(
          isBangla
            ? "বিক্রয় ফেরত সফলভাবে সম্পন্ন হয়েছে"
            : "Sale return completed successfully"
        );
        router.push("/sales");
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.message ||
            (isBangla ? "বিক্রয় ফেরত ব্যর্থ হয়েছে" : "Sale return failed")
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
        {/* Left Side (75% on Desktop) */}
        <div className="w-full lg:w-[75%] space-y-6">
          {/* Row 1 Layout: Select Party, Select Sale Invoice, Return Date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end bg-card border border-border/50 rounded-xl p-5 shadow-sm">
            {/* Select Party */}
            <div className="relative space-y-2">
              <Label className="text-sm font-medium text-foreground">
                {isBangla ? "পার্টি নির্বাচন করুন" : "Select Party"}
              </Label>
              <div className="relative">
                <Input
                  value={selectedPartyName || partySearchQuery}
                  onChange={(e) => {
                    setPartySearchQuery(e.target.value);
                    if (selectedPartyId) setSelectedPartyId("");
                    setShowPartySuggestions(true);
                  }}
                  onFocus={() => setShowPartySuggestions(true)}
                  onBlur={() => {
                    setTimeout(() => setShowPartySuggestions(false), 200);
                  }}
                  placeholder={isBangla ? "পার্টি খুঁজুন..." : "Search for party"}
                  className="pr-10 h-11 bg-background/50 border-input focus-visible:ring-1"
                />
                <Users className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                {showPartySuggestions && (
                  <div className="absolute z-50 left-0 top-full mt-1 w-full bg-card border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto divide-y divide-border">
                    {filteredParties.length === 0 ? (
                      <div className="p-3 text-center text-sm text-muted-foreground">
                        {isBangla ? "কোনো পার্টি পাওয়া যায়নি" : "No parties found"}
                      </div>
                    ) : (
                      filteredParties.map((party: any) => (
                        <button
                          key={party.id}
                          type="button"
                          className="w-full text-left p-3 hover:bg-muted/80 text-sm transition-colors flex justify-between"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setSelectedPartyId(party.id);
                            setPartySearchQuery("");
                            setShowPartySuggestions(false);
                          }}
                        >
                          <span className="font-medium text-foreground">{party.name}</span>
                          {party.phone && (
                            <span className="text-xs text-muted-foreground">{party.phone}</span>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Select Original Sale Invoice (Optional) */}
            <div className="relative space-y-2">
              <Label className="text-sm font-medium text-foreground">
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
                    isBangla ? "ইনভয়েস খুঁজুন..." : "Search sales invoice"
                  }
                  className="pr-10 h-11 bg-background/50 border-input focus-visible:ring-1"
                />
                <Receipt className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                {showInvoiceSuggestions && (
                  <div className="absolute z-50 left-0 top-full mt-1 w-full bg-card border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto divide-y divide-border">
                    {filteredSalesList.length === 0 ? (
                      <div className="p-3 text-center text-sm text-muted-foreground">
                        {isBangla ? "কোনো ইনভয়েস পাওয়া যায়নি" : "No invoices found"}
                      </div>
                    ) : (
                      filteredSalesList.map((sale: any) => (
                        <button
                          key={sale.id}
                          type="button"
                          className="w-full text-left p-3 hover:bg-muted/80 text-sm transition-colors flex justify-between"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setSelectedSaleId(sale.id);
                            setInvoiceSearchQuery("");
                            setShowInvoiceSuggestions(false);
                          }}
                        >
                          <div>
                            <p className="font-semibold text-foreground">{sale.invoiceNo}</p>
                            <p className="text-xs text-muted-foreground">
                              {sale.party?.name || "Retail Customer"}
                            </p>
                          </div>
                          <span className="font-bold text-xs text-primary self-center">
                            {formatCurrency(sale.total)}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Return Date */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                {isBangla ? "ফেরতের তারিখ" : "Return Date"}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-11 justify-between text-left font-normal bg-background/50 border-input text-foreground hover:bg-muted"
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

          {/* Customer Info Card (if selected) */}
          {singlePartyData?.data && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-primary font-semibold text-xs border-b border-primary/10 pb-2">
                <Users className="h-4 w-4" />
                <span>{isBangla ? "গ্রাহক সংক্ষিপ্ত বিবরণ" : "Customer Overview"}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    {isBangla ? "গ্রাহকের নাম" : "Customer Name"}
                  </p>
                  <p className="font-semibold text-foreground truncate mt-0.5">
                    {singlePartyData.data.name}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    {isBangla ? "মোবাইল" : "Phone"}
                  </p>
                  <p className="font-semibold text-foreground truncate mt-0.5">
                    {singlePartyData.data.phone || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-rose-400/80 uppercase tracking-wide">
                    {isBangla ? "বর্তমান বাকি" : "Current Due"}
                  </p>
                  <p className="font-bold text-rose-500 mt-0.5">
                    {formatCurrency(Math.abs(singlePartyData.data.currentBalance || 0))}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    {isBangla ? "ক্রেডিট লিমিট" : "Credit Limit"}
                  </p>
                  <p className="font-semibold text-foreground mt-0.5">
                    {singlePartyData.data.creditLimit
                      ? formatCurrency(singlePartyData.data.creditLimit)
                      : isBangla
                      ? "সীমাহীন"
                      : "Unlimited"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Row 2: Return Items Table */}
          <div className="border border-border rounded-xl bg-card overflow-x-auto shadow-sm">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="px-4 py-3 w-[5%] text-xs font-semibold uppercase">
                    {isBangla ? "ক্রম" : "S.N."}
                  </TableHead>
                  <TableHead className="px-3 py-3 w-[5%]" />
                  <TableHead className="px-4 py-3 w-[28%] text-xs font-semibold uppercase">
                    {isBangla ? "পণ্য" : "Product"}
                  </TableHead>
                  <TableHead className="px-4 py-3 w-[12%] text-xs font-semibold uppercase">
                    {isBangla ? "ব্যাচ" : "Batch"}
                  </TableHead>
                  <TableHead className="px-4 py-3 w-[12%] text-xs font-semibold uppercase">
                    {isBangla ? "পরিমাণ" : "Qty"}
                  </TableHead>
                  <TableHead className="px-4 py-3 w-[14%] text-xs font-semibold uppercase">
                    {isBangla ? "দর" : "Rate"}
                  </TableHead>
                  <TableHead className="px-4 py-3 w-[20%] text-xs font-semibold uppercase">
                    {isBangla ? "ফেরত কারণ" : "Item Reason"}
                  </TableHead>
                  <TableHead className="px-4 py-3 w-[12%] text-right text-xs font-semibold uppercase">
                    {isBangla ? "মোট রিফান্ড" : "Total"}
                  </TableHead>
                  <TableHead className="px-4 py-3 w-[5%]" />
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border">
                {selectedItems.map((item, idx) => (
                  <TableRow key={item.id} className="hover:bg-muted/10 transition-colors">
                    {/* S.N. */}
                    <TableCell className="px-4 py-4 font-bold text-amber-500 align-middle">
                      {idx + 1}
                    </TableCell>

                    {/* Thumbnail */}
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
                            width={32}
                            height={32}
                            alt="Image"
                            className="h-6 w-6 text-muted-foreground/60"
                          />
                        </div>
                      )}
                    </TableCell>

                    {/* Product Name / Search */}
                    <TableCell className="px-4 py-3 align-middle relative">
                      <Popover open={item.showSuggestions}>
                        <PopoverAnchor asChild>
                          <div className="w-full">
                            <Input
                              value={
                                item.showSuggestions ? item.searchQuery || "" : item.itemName
                              }
                              placeholder={isBangla ? "পণ্য খুঁজুন..." : "Search item..."}
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
                                      : i
                                  )
                                );
                              }}
                              onChange={(e) => handleNameChange(item.id, e.target.value)}
                            />
                          </div>
                        </PopoverAnchor>

                        <PopoverContent
                          className="w-[360px] p-0 bg-card border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto divide-y divide-border z-50 text-foreground"
                          align="start"
                          onOpenAutoFocus={(e) => e.preventDefault()}
                          onCloseAutoFocus={(e) => e.preventDefault()}
                        >
                          {getFilteredProducts(item.searchQuery || "").length === 0 ? (
                            <div className="p-3 text-center text-sm text-muted-foreground">
                              {isBangla ? "কোনো পণ্য পাওয়া যায়নি" : "No items found"}
                            </div>
                          ) : (
                            getFilteredProducts(item.searchQuery || "").map((product: any) => (
                              <button
                                key={product.id}
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
                                      {product.name}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground truncate">
                                      Stock: {product.currentStock ?? 0}
                                    </p>
                                  </div>
                                </div>
                                <span className="font-bold text-xs text-primary shrink-0">
                                  {formatCurrency(product.sellingPrice || 0)}
                                </span>
                              </button>
                            ))
                          )}
                        </PopoverContent>
                      </Popover>
                    </TableCell>

                    {/* Batch */}
                    <TableCell className="px-4 py-3 align-middle">
                      {getItemBatches(item.itemId).length > 0 ? (
                        <Select
                          value={item.batchNo || ""}
                          onValueChange={(val) => {
                            setSelectedItems((prev) =>
                              prev.map((i) => (i.id === item.id ? { ...i, batchNo: val } : i))
                            );
                          }}
                        >
                          <SelectTrigger className="h-8 text-xs bg-transparent border-border/60">
                            <SelectValue placeholder={isBangla ? "ব্যাচ" : "Batch"} />
                          </SelectTrigger>
                          <SelectContent>
                            {getItemBatches(item.itemId).map((b: any) => (
                              <SelectItem key={b.id} value={b.batchNo}>
                                {b.batchNo} ({b.quantity})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    {/* Quantity */}
                    <TableCell className="px-4 py-3 align-middle">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        className="h-8 w-20 text-center font-semibold bg-background/50 border-input"
                      />
                    </TableCell>

                    {/* Rate */}
                    <TableCell className="px-4 py-3 align-middle">
                      <Input
                        type="number"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => handleRateChange(item.id, e.target.value)}
                        className="h-8 w-24 font-medium bg-background/50 border-input"
                      />
                    </TableCell>

                    {/* Item Reason */}
                    <TableCell className="px-4 py-3 align-middle">
                      <Select
                        value={item.reason || "defective"}
                        onValueChange={(val) => handleItemReasonChange(item.id, val)}
                      >
                        <SelectTrigger className="h-8 text-xs bg-background/50 border-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="defective">
                            {isBangla ? "ত্রুটিপূর্ণ / ড্যামেজ" : "Defective / Damaged"}
                          </SelectItem>
                          <SelectItem value="expired">
                            {isBangla ? "মেয়াদোত্তীর্ণ" : "Expired"}
                          </SelectItem>
                          <SelectItem value="wrong_item">
                            {isBangla ? "ভুল পণ্য" : "Wrong Item"}
                          </SelectItem>
                          <SelectItem value="not_satisfied">
                            {isBangla ? "গ্রাহক অসন্তুষ্ট" : "Customer Dissatisfied"}
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

          {/* Row 3: Return Reason & Other Notes */}
          <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              {isBangla ? "অতিরিক্ত তথ্য" : "Additional Information"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Main Return Reason */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-foreground">
                  {isBangla ? "ফেরতের মূল কারণ" : "Main Return Reason"}
                </Label>
                <Input
                  value={overallReason}
                  onChange={(e) => setOverallReason(e.target.value)}
                  placeholder={
                    isBangla
                      ? "যেমন: ড্যামেজ পণ্য, মাপ সঠিক নয়, অসন্তুষ্ট কাস্টমার"
                      : "e.g., Damaged goods, Wrong size, Not satisfied"
                  }
                  className="h-10 bg-background/50 border-input text-sm"
                />
              </div>

              {/* Other Notes */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-foreground">
                  {isBangla ? "অন্যান্য মন্তব্য / নোট" : "Other Notes"}
                </Label>
                <Textarea
                  rows={1}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isBangla ? "অতিরিক্ত মন্তব্য লিখুন..." : "Write additional remarks..."}
                  className="bg-background/50 border-input text-sm resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Refund Summary Sidebar (25%) */}
        <div className="w-full lg:w-[25%] space-y-6">
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-lg space-y-5 sticky top-6">
            <h2 className="text-base font-bold text-foreground border-b border-border/50 pb-3 flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-red-500" />
              {isBangla ? "রিফান্ড সারসংক্ষেপ" : "Refund Summary"}
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
                  { id: "cash", label: isBangla ? "নগদ" : "Cash", icon: Banknote },
                  { id: "mobile_banking", label: "bKash / Nagad", icon: Smartphone },
                  { id: "card", label: isBangla ? "ব্যাংক" : "Bank", icon: Building2 },
                  { id: "credit_note", label: isBangla ? "ক্রেডিট নোট" : "Credit Note", icon: CreditCard },
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
                          : "border-border/60 hover:bg-muted/50 text-muted-foreground"
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
                  {isBangla ? "অ্যাকাউন্ট আইডি / মোবাইল নং" : "Account ID / Mobile No"}
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
                className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md transition-all gap-2"
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
