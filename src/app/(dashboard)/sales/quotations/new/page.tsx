// Hello Khata OS - New Quotation Page
// হ্যালো খাতা - নতুন কোটেশন পেজ

"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Pencil,
  Sparkles,
  Gift,
  Search,
  FileText,
} from "lucide-react";
import { useCurrency, useAppTranslation } from "@/hooks/useAppTranslation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useGetItems } from "@/hooks/api/useItems";
import { useParties, useParty } from "@/hooks/api/useParties";
import { useGetBatches } from "@/hooks/api/useBatches";
import { useCreateQuotation } from "@/hooks/api/useQuotations";
import { useGetOffers } from "@/hooks/api/useOffers";
import {
  Offer,
  POSAppliedOffer,
  calculateBogoOffer,
  calculatePercentageOffer,
  calculateFlatOffer,
  calculateBundleOffer,
} from "@/types/offer.types";
import Image from "next/image";

interface BillingItemRow {
  id: string;
  itemId: string;
  itemName: string;
  batchNo?: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  discountPercent: number;
  discountFlat: number;
  total: number;
  searchQuery: string;
  showSuggestions: boolean;
  imageUrl?: string;
  // Offer fields
  appliedOffer?: POSAppliedOffer | null;
  chargedQuantity: number;
  freeQuantity: number;
  offerSavings: number;
}

function NewQuotationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const partyIdParam = searchParams.get("partyId") || "";
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const { mutate, isPending } = useCreateQuotation();

  // API Data
  const [partySearchQuery, setPartySearchQuery] = useState("");
  const [debouncedPartySearchQuery, setDebouncedPartySearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPartySearchQuery(partySearchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [partySearchQuery]);

  const { data: itemsData } = useGetItems({ page: 1, limit: 100 });
  const items = itemsData?.data || [];
  const { data: partiesData } = useParties();
  const parties = partiesData?.data || [];

  const { data: batchesData } = useGetBatches({ status: "active", limit: 1000 });
  const batches = batchesData || [];

  const { data: offersData } = useGetOffers({ status: "active" });
  const activeOffers: Offer[] = offersData?.data || [];

  // Find active offer for a product
  const findActiveOffer = (itemId: string, batchNo?: string): Offer | null => {
    if (!itemId) return null;
    const match = activeOffers.find(
      (o) =>
        o.productId === itemId &&
        o.status === "active" &&
        (!o.batchId || !batchNo || o.batchId === batchNo),
    );
    return match || null;
  };

  // Form State
  const [selectedPartyId, setSelectedPartyId] = useState<string>(partyIdParam);

  const { data: singlePartyData } = useParty(selectedPartyId, {
    enabled: !!selectedPartyId,
  });
  const [showPartySuggestions, setShowPartySuggestions] = useState(false);

  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [showProductSuggestions, setShowProductSuggestions] = useState(false);

  const [quotationDate, setQuotationDate] = useState<Date>(new Date());
  const [validityDate, setValidityDate] = useState<Date>(addDays(new Date(), 30));

  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"draft" | "sent">("sent");

  // Tax, VAT, Additional Charge
  const [taxConfig, setTaxConfig] = useState<{ type: "flat" | "percent"; value: number }>({
    type: "flat",
    value: 0,
  });
  const [vatConfig, setVatConfig] = useState<{ type: "flat" | "percent"; value: number }>({
    type: "flat",
    value: 0,
  });
  const [additionalCharge, setAdditionalCharge] = useState<string>("0");

  // Modal Controls
  const [isEditTaxOpen, setIsEditTaxOpen] = useState(false);
  const [isEditVatOpen, setIsEditVatOpen] = useState(false);

  const [tempTaxType, setTempTaxType] = useState<"flat" | "percent">("flat");
  const [tempTaxValue, setTempTaxValue] = useState<string>("0");

  const [tempVatType, setTempVatType] = useState<"flat" | "percent">("flat");
  const [tempVatValue, setTempVatValue] = useState<string>("0");

  // Billing Items Table Rows
  const [selectedItems, setSelectedItems] = useState<BillingItemRow[]>([
    {
      id: "initial-row",
      itemId: "",
      itemName: "",
      batchNo: "",
      quantity: 1,
      unitPrice: 0,
      costPrice: 0,
      discountPercent: 0,
      discountFlat: 0,
      total: 0,
      searchQuery: "",
      showSuggestions: false,
      imageUrl: "",
      appliedOffer: null,
      chargedQuantity: 0,
      freeQuantity: 0,
      offerSavings: 0,
    },
  ]);

  // Parties Filtering
  const filteredParties = useMemo(() => {
    if (!partySearchQuery) return parties;
    return parties.filter(
      (p: any) =>
        p.name.toLowerCase().includes(partySearchQuery.toLowerCase()) ||
        p.phone?.includes(partySearchQuery),
    );
  }, [parties, partySearchQuery]);

  // Selected Party Name
  const selectedPartyName = useMemo(() => {
    const party = parties.find((p: any) => p.id === selectedPartyId);
    if (party) return party.name;
    if (singlePartyData?.data && singlePartyData.data.id === selectedPartyId) {
      return singlePartyData.data.name;
    }
    return "";
  }, [parties, selectedPartyId, singlePartyData]);

  // Calculations
  const rawSubtotal = useMemo(() => {
    return selectedItems.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );
  }, [selectedItems]);

  const totalDiscount = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + item.discountFlat, 0);
  }, [selectedItems]);

  const totalOfferSavings = useMemo(() => {
    return selectedItems.reduce(
      (sum, item) => sum + (item.offerSavings || 0),
      0,
    );
  }, [selectedItems]);

  const subtotalAfterDiscount = useMemo(() => {
    return Math.max(0, rawSubtotal - totalDiscount);
  }, [rawSubtotal, totalDiscount]);

  const taxVal = useMemo(() => {
    if (taxConfig.type === "flat") {
      return taxConfig.value;
    } else {
      return (
        parseFloat(
          (subtotalAfterDiscount * (taxConfig.value / 100)).toFixed(2),
        ) || 0
      );
    }
  }, [taxConfig, subtotalAfterDiscount]);

  const vatVal = useMemo(() => {
    if (vatConfig.type === "flat") {
      return vatConfig.value;
    } else {
      return (
        parseFloat(
          (subtotalAfterDiscount * (vatConfig.value / 100)).toFixed(2),
        ) || 0
      );
    }
  }, [vatConfig, subtotalAfterDiscount]);

  const additionalChargeVal = useMemo(() => {
    return parseFloat(additionalCharge) || 0;
  }, [additionalCharge]);

  const grandTotal = useMemo(() => {
    return Math.max(
      0,
      subtotalAfterDiscount + taxVal + vatVal + additionalChargeVal,
    );
  }, [subtotalAfterDiscount, taxVal, vatVal, additionalChargeVal]);

  const calculateRowTotal = (
    qty: number,
    price: number,
    flatDiscount: number,
  ) => {
    return Math.max(0, qty * price - flatDiscount);
  };

  const handleAddProductToTable = (product: any) => {
    setSelectedItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.itemId === product.id);

      if (existingIndex > -1) {
        return prev.map((item, idx) => {
          if (idx === existingIndex) {
            const newQty = item.quantity + 1;
            const price = item.unitPrice || product.sellingPrice || 0;
            const flatDiscount = item.discountFlat || 0;
            const total = calculateRowTotal(newQty, price, flatDiscount);

            return {
              ...item,
              quantity: newQty,
              total,
            };
          }
          return item;
        });
      }

      const price = product.sellingPrice || 0;
      const newItemRow = {
        id: Math.random().toString(),
        itemId: product.id,
        itemName: product.name,
        batchNo: "",
        quantity: 1,
        unitPrice: price,
        costPrice: product.costPrice || 0,
        discountPercent: 0,
        discountFlat: 0,
        total: price,
        searchQuery: "",
        showSuggestions: false,
        imageUrl: product.imageUrl || "",
        appliedOffer: null,
        chargedQuantity: 1,
        freeQuantity: 0,
        offerSavings: 0,
      };

      const emptyRowIndex = prev.findIndex((i) => i.itemId === "");
      if (emptyRowIndex > -1 && prev.length === 1) {
        return [newItemRow];
      }

      return [...prev.filter((i) => i.itemId !== ""), newItemRow];
    });

    setProductSearchQuery("");
    setShowProductSuggestions(false);
  };

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
        costPrice: 0,
        discountPercent: 0,
        discountFlat: 0,
        total: 0,
        searchQuery: "",
        showSuggestions: false,
        imageUrl: "",
        appliedOffer: null,
        chargedQuantity: 0,
        freeQuantity: 0,
        offerSavings: 0,
      },
    ]);
  };

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
          costPrice: 0,
          discountPercent: 0,
          discountFlat: 0,
          total: 0,
          searchQuery: "",
          showSuggestions: false,
          imageUrl: "",
          appliedOffer: null,
          chargedQuantity: 0,
          freeQuantity: 0,
          offerSavings: 0,
        },
      ]);
      return;
    }
    setSelectedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id: string, val: string) => {
    const qty = parseFloat(val) || 0;
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const price = item.unitPrice || 0;
          const flat =
            parseFloat(
              (price * qty * (item.discountPercent / 100)).toFixed(2),
            ) || 0;
          const total = calculateRowTotal(qty, price, flat);
          return {
            ...item,
            quantity: qty,
            discountFlat: flat,
            total,
          };
        }
        return item;
      }),
    );
  };

  const handleRateChange = (id: string, val: string) => {
    const rate = parseFloat(val) || 0;
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const qty = item.quantity || 0;
          const flat =
            parseFloat(
              (rate * qty * (item.discountPercent / 100)).toFixed(2),
            ) || 0;
          const total = calculateRowTotal(qty, rate, flat);
          return {
            ...item,
            unitPrice: rate,
            discountFlat: flat,
            total,
          };
        }
        return item;
      }),
    );
  };

  const handleDiscountPercentChange = (id: string, val: string) => {
    const percent = parseFloat(val) || 0;
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const qty = item.quantity || 0;
          const price = item.unitPrice || 0;
          const flat =
            parseFloat((price * qty * (percent / 100)).toFixed(2)) || 0;
          const total = calculateRowTotal(qty, price, flat);
          return {
            ...item,
            discountPercent: percent,
            discountFlat: flat,
            total,
          };
        }
        return item;
      }),
    );
  };

  const handleDiscountFlatChange = (id: string, val: string) => {
    const flat = parseFloat(val) || 0;
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const qty = item.quantity || 0;
          const price = item.unitPrice || 0;
          const totalCost = price * qty;
          const percent =
            totalCost > 0
              ? parseFloat(((flat / totalCost) * 100).toFixed(2))
              : 0;
          const total = calculateRowTotal(qty, price, flat);
          return {
            ...item,
            discountPercent: percent,
            discountFlat: flat,
            total,
          };
        }
        return item;
      }),
    );
  };

  const getFilteredProducts = (query: string) => {
    if (!query?.trim()) {
      return items.slice(0, 10);
    }
    const search = query.toLowerCase();
    return items.filter((product: any) => {
      return (
        product.name?.toLowerCase().includes(search) ||
        product.sku?.toLowerCase().includes(search) ||
        product.barcode?.toLowerCase().includes(search)
      );
    });
  };

  const openEditTax = () => {
    setTempTaxType(taxConfig.type);
    setTempTaxValue(taxConfig.value.toString());
    setIsEditTaxOpen(true);
  };

  const saveTax = () => {
    const val = parseFloat(tempTaxValue) || 0;
    setTaxConfig({ type: tempTaxType, value: val });
    setIsEditTaxOpen(false);
  };

  const openEditVat = () => {
    setTempVatType(vatConfig.type);
    setTempVatValue(vatConfig.value.toString());
    setIsEditVatOpen(true);
  };

  const saveVat = () => {
    const val = parseFloat(tempVatValue) || 0;
    setVatConfig({ type: tempVatType, value: val });
    setIsEditVatOpen(false);
  };

  const handleSubmit = async () => {
    const validItems = selectedItems.filter((i) => i.itemId !== "");
    if (validItems.length === 0) {
      toast.error(
        isBangla ? "অন্তত একটি পণ্য যোগ করুন" : "Add at least one item",
      );
      return;
    }

    const payload = {
      partyId: selectedPartyId || undefined,
      partyName: selectedPartyName || undefined,
      quotationDate: quotationDate.toISOString(),
      validityDate: validityDate.toISOString(),
      status,
      items: validItems.map((item) => ({
        itemId: item.itemId,
        itemName: item.itemName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discountFlat,
        total: item.total,
      })),
      subtotal: rawSubtotal,
      discount: totalDiscount,
      tax: taxVal,
      vat: vatVal,
      additionalCharge: additionalChargeVal,
      total: grandTotal,
      notes: notes || undefined,
    };

    mutate(payload, {
      onSuccess: () => {
        toast.success(
          isBangla
            ? "কোটেশন সফলভাবে তৈরি হয়েছে"
            : "Quotation created successfully",
        );
        router.push("/sales/quotations");
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.message ||
            (isBangla ? "কোটেশন তৈরি করতে ব্যর্থ হয়েছে" : "Failed to create quotation"),
        );
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Section */}
      <div className="flex items-center justify-between pb-2 border-b border-border/40">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          {isBangla ? "নতুন কোটেশন" : "New Quotation"}
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

      <div className="w-full lg:flex-[3] min-w-0 space-y-6">
        {/* Row 1 Layout: Search Product, Select Party, Quotation Date & Validity Date */}
        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-6 items-end bg-card border border-border/50 rounded-xl p-5 shadow-sm">
          {/* Search Product */}
          <div className="relative space-y-2 md:col-span-1">
            <Label className="text-sm font-medium text-foreground">
              {isBangla ? "পণ্য খুঁজুন" : "Search Product"}
            </Label>
            <div className="relative">
              <Input
                value={productSearchQuery}
                onChange={(e) => {
                  setProductSearchQuery(e.target.value);
                  setShowProductSuggestions(true);
                }}
                onFocus={() => setShowProductSuggestions(true)}
                onBlur={() => {
                  setTimeout(() => setShowProductSuggestions(false), 200);
                }}
                placeholder={
                  isBangla
                    ? "পণ্য সার্চ বা বারকোড স্ক্যান করুন"
                    : "Search Or Scan Bar Code"
                }
                className="pr-10 h-11 bg-background/50 border-input focus-visible:ring-1 text-sm font-medium"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

              {showProductSuggestions && (
                <div className="absolute z-50 left-0 top-full mt-1 w-full bg-card border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto divide-y divide-border text-foreground">
                  {getFilteredProducts(productSearchQuery).length === 0 ? (
                    <div className="p-3 text-center text-sm text-muted-foreground">
                      {isBangla ? "কোনো পণ্য পাওয়া যায়নি" : "No items found"}
                    </div>
                  ) : (
                    getFilteredProducts(productSearchQuery).map((product: any) => (
                      <button
                        key={product.id}
                        type="button"
                        className="w-full text-left p-2.5 hover:bg-muted/80 transition-colors flex items-center justify-between gap-3 text-foreground"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleAddProductToTable(product);
                        }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-9 w-9 rounded object-cover border border-border/80 shrink-0"
                            />
                          ) : (
                            <div className="h-9 w-9 rounded bg-muted flex items-center justify-center border border-border/60 shrink-0">
                              <Image
                                src="/images/image.png"
                                width={20}
                                height={20}
                                alt={product.name}
                                className="h-5 w-5 text-muted-foreground/60"
                              />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground truncate text-xs">
                              {product.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground">
                              <span>SKU: {product.sku || "-"}</span>
                              <span>•</span>
                              <span>
                                Stock: {product.currentStock} {product.unit || ""}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="font-bold text-primary text-xs">
                            {formatCurrency(product.sellingPrice || 0)}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Select Party */}
          <div className="relative space-y-2 md:col-span-1">
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
                      {isBangla
                        ? "কোনো পার্টি পাওয়া যায়নি"
                        : "No parties found"}
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
                        <span className="font-medium text-foreground">
                          {party.name}
                        </span>
                        {party.phone && (
                          <span className="text-xs text-muted-foreground">
                            {party.phone}
                          </span>
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quotation Date */}
          <div className="space-y-2 md:col-span-1">
            <Label className="text-sm font-medium text-foreground">
              {isBangla ? "কোটেশন তারিখ" : "Quotation Date"}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-11 justify-between text-left font-normal bg-background/50 border-input text-foreground hover:bg-muted"
                >
                  <span>{format(quotationDate, "dd MMM yyyy")}</span>
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={quotationDate}
                  onSelect={(date) => date && setQuotationDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Validity Date */}
          <div className="space-y-2 md:col-span-1">
            <Label className="text-sm font-medium text-foreground">
              {isBangla ? "মেয়াদ শেষ হওয়ার তারিখ" : "Validity Date"}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-11 justify-between text-left font-normal bg-background/50 border-input text-foreground hover:bg-muted"
                >
                  <span>{format(validityDate, "dd MMM yyyy")}</span>
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={validityDate}
                  onSelect={(date) => date && setValidityDate(date)}
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

        {/* Row 2: Billing Items Table */}
        <div className="w-full border border-border rounded-xl bg-card overflow-x-auto shadow-sm">
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
                <TableHead className="px-4 py-3 w-[15%] text-xs font-semibold uppercase">
                  {isBangla ? "দর" : "Rate"}
                </TableHead>
                <TableHead className="px-4 py-3 w-[12%] text-xs font-semibold uppercase">
                  {isBangla ? "পরিমাণ" : "Quantity"}
                </TableHead>
                <TableHead className="px-4 py-3 w-[18%] text-xs font-semibold uppercase">
                  {isBangla ? "ছাড়" : "Discount"}
                </TableHead>
                <TableHead className="px-4 py-3 w-[11%] text-right text-xs font-semibold uppercase">
                  {isBangla ? "মোট" : "Amount"}
                </TableHead>
                <TableHead className="px-4 py-3 w-[11%] text-right text-xs font-semibold uppercase" />
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

                  {/* Product Name */}
                  <TableCell className="px-4 py-3 align-middle font-medium">
                    {item.itemName ? (
                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          {item.itemName}
                        </p>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">
                        {isBangla ? "উপরে পণ্য সার্চ করুন" : "Select product above"}
                      </span>
                    )}
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
                        onChange={(e) =>
                          handleRateChange(item.id, e.target.value)
                        }
                        className="pl-9 bg-background/30 h-9 border-input focus:ring-1 focus-visible:ring-1"
                        min="0"
                      />
                    </div>
                  </TableCell>

                  {/* Quantity */}
                  <TableCell className="px-4 py-3 align-middle">
                    <Input
                      type="number"
                      value={item.quantity || ""}
                      onChange={(e) =>
                        handleQuantityChange(item.id, e.target.value)
                      }
                      className="bg-background/30 h-9 text-center border-input focus:ring-1 focus-visible:ring-1"
                      min="1"
                    />
                  </TableCell>

                  {/* Discount */}
                  <TableCell className="px-4 py-3 align-middle">
                    <div className="flex gap-1.5 items-center">
                      <div className="relative flex-1 flex items-center">
                        <Input
                          type="number"
                          value={item.discountPercent || ""}
                          onChange={(e) =>
                            handleDiscountPercentChange(item.id, e.target.value)
                          }
                          placeholder="0"
                          className="bg-background/30 h-9 text-right pr-6 border-input focus:ring-1 focus-visible:ring-1"
                          min="0"
                          max="100"
                        />
                        <span className="absolute right-2 text-xs text-muted-foreground font-semibold">
                          %
                        </span>
                      </div>
                      <div className="relative flex-1 flex items-center">
                        <span className="absolute left-2.5 text-[10px] text-muted-foreground font-medium">
                          Tk.
                        </span>
                        <Input
                          type="number"
                          value={item.discountFlat || ""}
                          onChange={(e) =>
                            handleDiscountFlatChange(item.id, e.target.value)
                          }
                          placeholder="0"
                          className="pl-7 bg-background/30 h-9 text-right border-input focus:ring-1 focus-visible:ring-1"
                          min="0"
                        />
                      </div>
                    </div>
                  </TableCell>

                  {/* Amount & Action */}
                  <TableCell className="px-4 py-3 align-middle text-right font-medium text-foreground">
                    <span className="font-semibold text-foreground text-sm">
                      Tk. {item.total.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 align-middle">
                    <button
                      type="button"
                      onClick={() => removeItemRow(item.id)}
                      className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Table Bottom Add Action */}
          {/* <div className="flex justify-between items-center px-6 py-4 bg-muted/10 border-t border-border">
            <button
              type="button"
              onClick={addItemRow}
              className="text-primary font-semibold text-sm flex items-center gap-1.5 hover:text-primary-hover transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              {isBangla ? "আইটেম যোগ করুন" : "Add Quotation Item"}
            </button>
            <div className="flex items-center gap-8">
              <span className="text-sm text-muted-foreground font-medium">
                {isBangla ? "উপমোট" : "Sub Total"}
              </span>
              <span className="font-bold text-foreground text-base">
                Tk. {subtotalAfterDiscount.toFixed(2)}
              </span>
            </div>
          </div> */}
        </div>
      </div>

      {/* 75% / 25% Split Layout Container */}
      <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
        {/* Left Side: Notes */}
        <div className="w-full flex flex-col gap-5 bg-card border border-border/50 rounded-xl p-5 shadow-sm">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">
              {isBangla ? "নোট বা মন্তব্য" : "Notes or Remarks"}
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                isBangla ? "নোট লিখুন..." : "Enter note or description..."
              }
              className="min-h-[100px] bg-background/50 border-input resize-none focus-visible:ring-1"
            />
          </div>
        </div>

        {/* Right Side: Sticky Order Details Card */}
        <div className="w-full lg:flex-[1] lg:min-w-[460px] lg:max-w-[320px] lg:sticky lg:top-6">
          <div className="bg-card border border-border/80 rounded-2xl shadow-md p-6 space-y-5">
            <h2 className="text-lg font-bold tracking-tight text-foreground border-b border-border/50 pb-2">
              {isBangla ? "কোটেশন সারসংক্ষেপ" : "Quotation Summary"}
            </h2>

            {/* Financial Details */}
            <div className="space-y-3">
              {/* Subtotal */}
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-muted-foreground">
                  {isBangla ? "উপমোট" : "Subtotal"}
                </span>
                <span className="text-foreground">
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
                <span className="text-amber-600 dark:text-amber-500 font-medium">
                  -Tk.{" "}
                  {totalDiscount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              {/* Tax Display Row */}
              <div className="flex justify-between items-center text-sm font-medium py-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">
                    {isBangla ? "ট্যাক্স" : "Tax"}
                  </span>
                  <button
                    type="button"
                    onClick={openEditTax}
                    className="text-primary hover:text-primary-hover p-0.5 rounded hover:bg-primary/10 transition-colors"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                </div>
                <span className="text-foreground text-xs font-semibold">
                  {taxConfig.type === "percent"
                    ? `${taxConfig.value}% (Tk. ${taxVal.toFixed(2)})`
                    : `Tk. ${taxVal.toFixed(2)}`}
                </span>
              </div>

              {/* VAT Display Row */}
              <div className="flex justify-between items-center text-sm font-medium py-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">
                    {isBangla ? "ভ্যাট" : "VAT"}
                  </span>
                  <button
                    type="button"
                    onClick={openEditVat}
                    className="text-primary hover:text-primary-hover p-0.5 rounded hover:bg-primary/10 transition-colors"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                </div>
                <span className="text-foreground text-xs font-semibold">
                  {vatConfig.type === "percent"
                    ? `${vatConfig.value}% (Tk. ${vatVal.toFixed(2)})`
                    : `Tk. ${vatVal.toFixed(2)}`}
                </span>
              </div>

              {/* Additional Charge Input */}
              <div className="flex items-center justify-between gap-2 py-1.5 border-t border-border/20 border-b border-border/40 pb-2">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    {isBangla ? "অতিরিক্ত চার্জ" : "Additional Charge"}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {isBangla ? "শিপিং, ডেলিভারি ইত্যাদি" : "Shipping, Delivery etc."}
                  </span>
                </div>
                <div className="relative w-28">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-medium">
                    Tk.
                  </span>
                  <Input
                    type="number"
                    value={additionalCharge}
                    onChange={(e) => setAdditionalCharge(e.target.value)}
                    className="pl-6 pr-1 h-8 text-right text-xs bg-background/50 border-input rounded-md focus-visible:ring-1"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Grand Total */}
            <div className="flex items-center justify-between py-1 border-t border-border/40">
              <span className="text-base font-bold text-foreground">
                {isBangla ? "সর্বমোট" : "Grand Total"}
              </span>
              <span className="text-lg font-extrabold text-primary">
                Tk.{" "}
                {grandTotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            {/* Quotation Status Selector */}
            <div className="space-y-1.5 pt-2 border-t border-border/40">
              <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                {isBangla ? "স্ট্যাটাস" : "Status"}
              </Label>
              <Select
                value={status}
                onValueChange={(val: any) => setStatus(val)}
              >
                <SelectTrigger className="h-10 bg-background/50 border-input text-foreground text-sm focus-visible:ring-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">
                    {isBangla ? "খসড়া (Draft)" : "Draft"}
                  </SelectItem>
                  <SelectItem value="sent">
                    {isBangla ? "প্রেরিত (Sent)" : "Sent"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <hr className="border-border/60 pt-1" />

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className="w-full h-10 text-sm bg-primary hover:bg-primary/95 text-primary-foreground font-semibold shadow-sm"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    {isBangla ? "সংরক্ষণ হচ্ছে..." : "Saving..."}
                  </span>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    {isBangla ? "কোটেশন তৈরি করুন" : "Create Quotation"}
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="w-full h-10 text-sm border-input hover:bg-muted"
              >
                <X className="h-4 w-4 mr-2" />
                {isBangla ? "বাতিল" : "Cancel"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tax Edit Modal */}
      <Dialog open={isEditTaxOpen} onOpenChange={setIsEditTaxOpen}>
        <DialogContent className="sm:max-w-md p-6 space-y-4 text-foreground">
          <DialogHeader>
            <DialogTitle className="font-bold text-base">
              {isBangla ? "ট্যাক্স পরিবর্তন করুন" : "Edit Tax"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {isBangla ? "হিসাবের ধরন" : "Calculation Type"}
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={tempTaxType === "flat" ? "default" : "outline"}
                  onClick={() => setTempTaxType("flat")}
                  className="h-10 text-xs font-semibold"
                >
                  {isBangla ? "ফ্ল্যাট পরিমাণ (Flat)" : "Flat Amount"}
                </Button>
                <Button
                  type="button"
                  variant={tempTaxType === "percent" ? "default" : "outline"}
                  onClick={() => setTempTaxType("percent")}
                  className="h-10 text-xs font-semibold"
                >
                  {isBangla ? "শতকরা (%)" : "Percentage (%)"}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {isBangla ? "ট্যাক্স হার / পরিমাণ" : "Tax Rate / Amount"}
              </Label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs text-muted-foreground font-semibold">
                  {tempTaxType === "flat" ? "Tk." : "%"}
                </span>
                <Input
                  type="number"
                  value={tempTaxValue}
                  onChange={(e) => setTempTaxValue(e.target.value)}
                  className="pl-10 h-10 bg-background/50 border-input font-bold text-sm"
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 border-t border-border/40 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditTaxOpen(false)}
              className="flex-1 h-10 text-xs font-semibold border-input"
            >
              {isBangla ? "বাতিল" : "Cancel"}
            </Button>
            <Button
              type="button"
              onClick={saveTax}
              className="flex-1 h-10 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isBangla ? "সংরক্ষণ করুন" : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* VAT Edit Modal */}
      <Dialog open={isEditVatOpen} onOpenChange={setIsEditVatOpen}>
        <DialogContent className="sm:max-w-md p-6 space-y-4 text-foreground">
          <DialogHeader>
            <DialogTitle className="font-bold text-base">
              {isBangla ? "ভ্যাট পরিবর্তন করুন" : "Edit VAT"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {isBangla ? "হিসাবের ধরন" : "Calculation Type"}
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={tempVatType === "flat" ? "default" : "outline"}
                  onClick={() => setTempVatType("flat")}
                  className="h-10 text-xs font-semibold"
                >
                  {isBangla ? "ফ্ল্যাট পরিমাণ (Flat)" : "Flat Amount"}
                </Button>
                <Button
                  type="button"
                  variant={tempVatType === "percent" ? "default" : "outline"}
                  onClick={() => setTempVatType("percent")}
                  className="h-10 text-xs font-semibold"
                >
                  {isBangla ? "শতকরা (%)" : "Percentage (%)"}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {isBangla ? "ভ্যাট হার / পরিমাণ" : "VAT Rate / Amount"}
              </Label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs text-muted-foreground font-semibold">
                  {tempVatType === "flat" ? "Tk." : "%"}
                </span>
                <Input
                  type="number"
                  value={tempVatValue}
                  onChange={(e) => setTempVatValue(e.target.value)}
                  className="pl-10 h-10 bg-background/50 border-input font-bold text-sm"
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 border-t border-border/40 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditVatOpen(false)}
              className="flex-1 h-10 text-xs font-semibold border-input"
            >
              {isBangla ? "বাতিল" : "Cancel"}
            </Button>
            <Button
              type="button"
              onClick={saveVat}
              className="flex-1 h-10 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isBangla ? "সংরক্ষণ করুন" : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function NewQuotationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <NewQuotationContent />
    </Suspense>
  );
}
