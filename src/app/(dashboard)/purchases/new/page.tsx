// Hello Khata OS - New Purchase Page
// হ্যালো খাতা - নতুন ক্রয় পেজ

"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
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
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Accordion } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  Check,
  X,
  ArrowLeft,
  Camera,
  Users,
  Loader2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Info,
  FileText,
  Search,
} from "lucide-react";
import { useCurrency, useDateFormat } from "@/hooks/useAppTranslation";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useGetItems } from "@/hooks/api/useItems";
import { useParties, useParty } from "@/hooks/api/useParties";
import { useCreatePurchases, useGetPurchases } from "@/hooks/api/usePurchases";
import { useBranches, useAccounts } from "@/hooks/queries";
import { useUser } from "@/stores/sessionStore";
import Image from "next/image";

interface PaymentRow {
  id: string;
  method: "cash" | "bank" | "mobile_banking";
  accountId: string;
  reference: string;
  transactionId: string;
  amount: number;
  date: Date;
}

interface BillingItemRow {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unitCost: number;
  discountPercent: number;
  discountFlat: number;
  total: number;
  searchQuery: string;
  showSuggestions: boolean;
  imageUrl?: string;

  // ERP fields
  sku: string;
  currentStock: number;
  unit: string;
  taxPercent: number;
  taxAmount: number;
  trackBatch: boolean;
  batchNumber: string;
  trackExpiry: boolean;
  manufactureDate?: Date;
  expiryDate?: Date;
  rowNote: string;
  isExpanded: boolean;

  // Suggestions metadata
  lastPurchasePrice?: number;
  averageCost?: number;
  lowestPurchasePrice?: number;
  highestPurchasePrice?: number;
  previousSupplierName?: string;
  lastPurchaseDate?: string;
}

function NewPurchaseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supplierIdParam = searchParams.get("partyId") || "";
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const { mutate, isPending } = useCreatePurchases();
  const user = useUser();

  // API Data
  const [supplierSearchQuery, setSupplierSearchQuery] = useState("");

  const { data: itemsData } = useGetItems({ page: 1, limit: 100 });
  const items = itemsData?.data || [];

  const { data: suppliersData } = useParties({ type: "supplier" });
  const suppliers = suppliersData?.data || [];

  const { data: branches = [] } = useBranches();
  const { data: accounts = [] } = useAccounts();
  const { data: purchases = [] } = useGetPurchases();

  // Form State
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(supplierIdParam);
  const { data: singleSupplierData } = useParty(selectedSupplierId, {
    enabled: !!selectedSupplierId,
  });
  const [showSupplierSuggestions, setShowSupplierSuggestions] = useState(false);

  // Top Product Search & Barcode Scan State
  const [topProductSearchQuery, setTopProductSearchQuery] = useState("");
  const [showTopProductSuggestions, setShowTopProductSuggestions] = useState(false);

  const [invoiceDate, setInvoiceDate] = useState<Date>(new Date());
  const [purchaseType, setPurchaseType] = useState<string>("in_store");
  const [branchId, setBranchId] = useState<string>("");
  const [responsiblePerson, setResponsiblePerson] = useState<string>("");
  const [referenceNo, setReferenceNo] = useState<string>("");

  // Set default values from session user
  const userBranchId = user?.branchId;
  const userName = user?.name;
  useEffect(() => {
    if (userBranchId && !branchId) setBranchId(userBranchId);
    if (userName && !responsiblePerson) setResponsiblePerson(userName);
  }, [userBranchId, userName, branchId, responsiblePerson]);

  const [notes, setNotes] = useState("");

  // Payment states
  const [payments, setPayments] = useState<PaymentRow[]>([
    {
      id: "pay-initial",
      method: "cash",
      accountId: "",
      reference: "",
      transactionId: "",
      amount: 0,
      date: new Date(),
    },
  ]);

  // Order summary adjustments
  const [orderDiscount, setOrderDiscount] = useState<number>(0);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [additionalCharges, setAdditionalCharges] = useState<number>(0);

  // Attachment states
  const [attachments, setAttachments] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAiPanelOpen, setIsAiPanelOpen] = useState<boolean>(false);

  // Billing Items Table Rows
  const [selectedItems, setSelectedItems] = useState<BillingItemRow[]>([
    {
      id: "initial-row",
      itemId: "",
      itemName: "",
      quantity: 1,
      unitCost: 0,
      discountPercent: 0,
      discountFlat: 0,
      total: 0,
      searchQuery: "",
      showSuggestions: false,
      sku: "",
      currentStock: 0,
      unit: "Pcs",
      taxPercent: 0,
      taxAmount: 0,
      trackBatch: false,
      batchNumber: "",
      trackExpiry: false,
      rowNote: "",
      isExpanded: false,
    },
  ]);

  // Suppliers Filtering
  const filteredSuppliers = useMemo(() => {
    if (!supplierSearchQuery) return suppliers;
    return suppliers.filter(
      (p: any) =>
        p.name.toLowerCase().includes(supplierSearchQuery.toLowerCase()) ||
        p.phone?.includes(supplierSearchQuery),
    );
  }, [suppliers, supplierSearchQuery]);

  // Selected Supplier Name
  const selectedSupplierName = useMemo(() => {
    const supplier = suppliers.find((p: any) => p.id === selectedSupplierId);
    if (supplier) return supplier.name;
    if (singleSupplierData?.data && singleSupplierData.data.id === selectedSupplierId) {
      return singleSupplierData.data.name;
    }
    return "";
  }, [suppliers, selectedSupplierId, singleSupplierData]);

  // Calculations
  const subtotal = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + item.total, 0);
  }, [selectedItems]);

  const itemDiscount = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + item.discountFlat, 0);
  }, [selectedItems]);

  const itemTax = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + item.taxAmount, 0);
  }, [selectedItems]);

  const grandTotal = useMemo(() => {
    const totalBeforeOrderDiscount = subtotal + itemTax;
    const finalTotal = totalBeforeOrderDiscount - orderDiscount + shippingCost + additionalCharges;
    return Math.max(0, finalTotal);
  }, [subtotal, itemTax, orderDiscount, shippingCost, additionalCharges]);

  const totalPaid = useMemo(() => {
    return payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  }, [payments]);

  const due = useMemo(() => {
    return Math.max(0, grandTotal - totalPaid);
  }, [grandTotal, totalPaid]);

  const changeReturned = useMemo(() => {
    return Math.max(0, totalPaid - grandTotal);
  }, [totalPaid, grandTotal]);

  // Sync initial single payment row amount when grandTotal changes safely
  useEffect(() => {
    setPayments((prev) => {
      if (prev.length === 1 && prev[0].amount === 0 && grandTotal > 0) {
        return [{ ...prev[0], amount: grandTotal }];
      }
      return prev;
    });
  }, [grandTotal]);

  // Table row handlers
  const addItemRow = () => {
    setSelectedItems((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        itemId: "",
        itemName: "",
        quantity: 1,
        unitCost: 0,
        discountPercent: 0,
        discountFlat: 0,
        total: 0,
        searchQuery: "",
        showSuggestions: false,
        sku: "",
        currentStock: 0,
        unit: "Pcs",
        taxPercent: 0,
        taxAmount: 0,
        trackBatch: false,
        batchNumber: "",
        trackExpiry: false,
        rowNote: "",
        isExpanded: false,
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
          quantity: 1,
          unitCost: 0,
          discountPercent: 0,
          discountFlat: 0,
          total: 0,
          searchQuery: "",
          showSuggestions: false,
          sku: "",
          currentStock: 0,
          unit: "Pcs",
          taxPercent: 0,
          taxAmount: 0,
          trackBatch: false,
          batchNumber: "",
          trackExpiry: false,
          rowNote: "",
          isExpanded: false,
        },
      ]);
      return;
    }
    setSelectedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleRowExpansion = (id: string) => {
    setSelectedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isExpanded: !item.isExpanded } : item))
    );
  };

  const handleItemSelect = (rowId: string, item: any) => {
    setSelectedItems((prev) =>
      prev.map((r) => {
        if (r.id === rowId) {
          const cost = item.costPrice || item.purchasePrice || 0;
          const qty = r.quantity || 1;
          const taxPct = item.taxPercent || 0;

          let discFlat = r.discountFlat || 0;
          let discPct = r.discountPercent || 0;
          if (discPct > 0) {
            discFlat = parseFloat(((qty * cost) * (discPct / 100)).toFixed(2));
          } else if (discFlat > 0 && qty * cost > 0) {
            discPct = parseFloat(((discFlat / (qty * cost)) * 100).toFixed(2));
          }

          const baseTotal = qty * cost;
          const taxAmt = Math.max(0, baseTotal - discFlat) * (taxPct / 100);
          const finalTotal = Math.max(0, baseTotal - discFlat + taxAmt);

          return {
            ...r,
            itemId: item.id,
            itemName: item.name,
            sku: item.sku || "",
            unit: item.unit?.name || item.unit || "Pcs",
            currentStock: item.currentStock || 0,
            unitCost: cost,
            discountPercent: discPct,
            discountFlat: discFlat,
            taxPercent: taxPct,
            taxAmount: taxAmt,
            total: finalTotal,
            searchQuery: "",
            showSuggestions: false,
            lastPurchasePrice: item.lastPurchasePrice || cost,
            averageCost: item.averageCost || cost,
            lowestPurchasePrice: item.lowestPurchasePrice || cost,
            highestPurchasePrice: item.highestPurchasePrice || cost,
            previousSupplierName: item.previousSupplierName || "",
            lastPurchaseDate: item.lastPurchaseDate || "",
          };
        }
        return r;
      })
    );
  };

  const handleRowChange = (id: string, field: keyof BillingItemRow, value: any) => {
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };

          const qty = field === "quantity" ? parseFloat(value) || 0 : item.quantity;
          const cost = field === "unitCost" ? parseFloat(value) || 0 : item.unitCost;
          let discFlat = item.discountFlat;
          let discPct = item.discountPercent;

          if (field === "discountPercent") {
            discPct = parseFloat(value) || 0;
            discFlat = parseFloat(((qty * cost) * (discPct / 100)).toFixed(2)) || 0;
          } else if (field === "discountFlat") {
            discFlat = parseFloat(value) || 0;
            discPct = qty * cost > 0 ? parseFloat(((discFlat / (qty * cost)) * 100).toFixed(2)) : 0;
          } else if (field === "quantity" || field === "unitCost") {
            if (discPct > 0) {
              discFlat = parseFloat(((qty * cost) * (discPct / 100)).toFixed(2)) || 0;
            } else if (discFlat > 0 && qty * cost > 0) {
              discPct = parseFloat(((discFlat / (qty * cost)) * 100).toFixed(2));
            }
          }

          const taxPct = field === "taxPercent" ? parseFloat(value) || 0 : item.taxPercent;
          const baseTotal = qty * cost;
          const taxAmt = Math.max(0, baseTotal - discFlat) * (taxPct / 100);
          const total = Math.max(0, baseTotal - discFlat + taxAmt);

          return {
            ...updated,
            quantity: qty,
            unitCost: cost,
            discountPercent: discPct,
            discountFlat: discFlat,
            taxPercent: taxPct,
            taxAmount: taxAmt,
            total,
          };
        }
        return item;
      })
    );
  };

  const getFilteredItems = (query: string) => {
    if (!query) return items.slice(0, 10);
    return items.filter(
      (item: any) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.sku?.toLowerCase().includes(query.toLowerCase())
    );
  };

  const getFilteredTopProducts = (query: string) => {
    if (!query?.trim()) return items.slice(0, 10);
    const search = query.toLowerCase();
    return items.filter(
      (product: any) =>
        product.name?.toLowerCase().includes(search) ||
        product.sku?.toLowerCase().includes(search) ||
        product.barcode?.toLowerCase().includes(search)
    );
  };

  const handleAddProductFromTopSearch = (product: any) => {
    const cost = product.costPrice || product.purchasePrice || 0;
    const taxPct = product.taxPercent || 0;

    setSelectedItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.itemId === product.id);

      if (existingIndex !== -1) {
        return prev.map((item, index) => {
          if (index === existingIndex) {
            const newQty = item.quantity + 1;
            const baseTotal = newQty * item.unitCost;
            const taxAmt = (baseTotal - item.discountFlat) * (item.taxPercent / 100);
            const total = Math.max(0, baseTotal - item.discountFlat + taxAmt);
            return {
              ...item,
              quantity: newQty,
              taxAmount: taxAmt,
              total,
            };
          }
          return item;
        });
      }

      const hasSingleEmptyRow = prev.length === 1 && !prev[0].itemId;

      const newRow: BillingItemRow = {
        id: Math.random().toString(),
        itemId: product.id,
        itemName: product.name,
        imageUrl: product.imageUrl || "",
        sku: product.sku || "",
        unit: product.unit?.name || product.unit || "Pcs",
        currentStock: product.currentStock || 0,
        quantity: 1,
        unitCost: cost,
        discountPercent: 0,
        discountFlat: 0,
        taxPercent: taxPct,
        taxAmount: cost * (taxPct / 100),
        total: cost + cost * (taxPct / 100),
        searchQuery: "",
        showSuggestions: false,
        trackBatch: false,
        batchNumber: "",
        trackExpiry: false,
        rowNote: "",
        isExpanded: false,
        lastPurchasePrice: product.lastPurchasePrice || cost,
        averageCost: product.averageCost || cost,
      };

      if (hasSingleEmptyRow) {
        return [newRow];
      }

      return [...prev, newRow];
    });

    setTopProductSearchQuery("");
    setShowTopProductSuggestions(false);
    toast.success(isBangla ? `${product.name} যোগ করা হয়েছে` : `Added ${product.name}`);
  };

  const handleSubmitWithStatus = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedSupplierId) {
      newErrors.supplier = isBangla ? "সরবরাহকারী নির্বাচন করা আবশ্যক" : "Supplier is required";
    }

    const validItems = selectedItems.filter((i) => i.itemId !== "");
    if (validItems.length === 0) {
      newErrors.items = isBangla ? "অন্তত একটি পণ্য যোগ করুন" : "Add at least one item";
    }

    // Row-level validations
    selectedItems.forEach((item) => {
      if (item.itemId) {
        if (!item.quantity || item.quantity <= 0) {
          newErrors[`qty-${item.id}`] = isBangla ? "পরিমাণ ০ এর বেশি হতে হবে" : "Qty must be > 0";
        }
        if (item.unitCost <= 0) {
          newErrors[`cost-${item.id}`] = isBangla ? "ক্রয় মূল্য ০ এর বেশি হতে হবে" : "Rate must be > 0";
        }
      }
    });

    if (totalPaid > grandTotal) {
      newErrors.payments = isBangla ? "পরিশোধিত পরিমাণ মোট পরিমাণের চেয়ে বেশি হতে পারে না" : "Paid amount cannot exceed grand total";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError);
      return;
    }

    setErrors({});

    const payload = {
      supplierId: selectedSupplierId || undefined,
      purchaseType,
      branchId: branchId || undefined,
      responsiblePerson: responsiblePerson || undefined,
      referenceNo: referenceNo || undefined,
      status: "received",
      items: validItems.map((item) => ({
        itemId: item.itemId,
        itemName: item.itemName,
        quantity: item.quantity,
        unitCost: item.unitCost,
        discount: item.discountFlat,
        taxPercent: item.taxPercent,
        trackBatch: item.trackBatch,
        batchNumber: item.batchNumber || undefined,
        manufactureDate: item.manufactureDate ? item.manufactureDate.toISOString() : undefined,
        expiryDate: item.expiryDate ? item.expiryDate.toISOString() : undefined,
        rowNote: item.rowNote || undefined,
      })),
      discount: orderDiscount + itemDiscount,
      orderDiscount,
      shippingCost,
      additionalCharges,
      total: grandTotal,
      paidAmount: totalPaid,
      payments: payments.map((p) => ({
        method: p.method,
        accountId: p.accountId || undefined,
        reference: p.reference || undefined,
        transactionId: p.transactionId || undefined,
        amount: p.amount,
        date: p.date.toISOString(),
      })),
      notes: notes || undefined,
    };

    mutate(payload, {
      onSuccess: () => {
        toast.success(
          isBangla
            ? "ক্রয় সফলভাবে সংরক্ষণ করা হয়েছে"
            : "Purchase saved successfully",
        );
        router.push("/purchases");
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.message || (isBangla ? "ক্রয় সংরক্ষণ করতে সমস্যা হয়েছে" : "Failed to save purchase"),
        );
      },
    });
  };

  const addPaymentRow = () => {
    setPayments((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        method: "cash",
        accountId: "",
        reference: "",
        transactionId: "",
        amount: 0,
        date: new Date(),
      },
    ]);
  };

  const removePaymentRow = (id: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  const handlePaymentFieldChange = (id: string, field: keyof PaymentRow, value: any) => {
    setPayments((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            [field]: value,
          };
        }
        return p;
      })
    );
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "Enter")) {
        e.preventDefault();
        handleSubmitWithStatus();
      }
      if (e.key === "Escape") {
        router.back();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedSupplierId, selectedItems, payments, grandTotal, totalPaid]);

  // AI Suggestions
  const aiSuggestions = useMemo(() => {
    const suggestions: string[] = [];

    if (selectedSupplierId && singleSupplierData?.data) {
      const activeSup = singleSupplierData.data;
      if (activeSup.riskLevel === "high") {
        suggestions.push(
          isBangla
            ? `⚠️ সতর্কতা: এই সরবরাহকারীর ঝুঁকি স্তর উচ্চ (${activeSup.riskScore}/100)। বাকিতে লেনদেন সতর্কভাবে করুন।`
            : `⚠️ Risk Warning: This supplier has a HIGH risk profile (${activeSup.riskScore}/100). Exercise caution with credit purchases.`,
        );
      } else {
        suggestions.push(
          isBangla
            ? `👤 সরবরাহকারী যাচাইকৃত: ${activeSup.name}। বাকির সীমা ${activeSup.creditLimit ? formatCurrency(activeSup.creditLimit) : "সীমাহীন"}।`
            : `👤 Supplier verified: ${activeSup.name}. Credit limit is ${activeSup.creditLimit ? formatCurrency(activeSup.creditLimit) : "unlimited"}.`,
        );
      }
    }

    const validItems = selectedItems.filter((item) => item.itemId);
    if (validItems.length > 0) {
      validItems.forEach((item) => {
        if (item.lastPurchasePrice) {
          const diff = item.unitCost - item.lastPurchasePrice;
          const pct = item.lastPurchasePrice > 0 ? (diff / item.lastPurchasePrice) * 100 : 0;
          if (pct >= 15) {
            suggestions.push(
              isBangla
                ? `⚠️ মূল্য সতর্কতা: ${item.itemName}-এর দাম পূর্ববর্তী ক্রয়ের চেয়ে ${pct.toFixed(0)}% বৃদ্ধি পেয়েছে!`
                : `⚠️ Cost Warning: ${item.itemName} unit price increased by ${pct.toFixed(0)}% compared to the last purchase price.`,
            );
          }
        }
      });
    }

    return suggestions;
  }, [selectedItems, selectedSupplierId, singleSupplierData, isBangla]);

  return (
    <div className="space-y-6">
      {/* Top Header Section */}
      <div className="flex items-center justify-between pb-3 border-b border-border/80">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            {isBangla ? "নতুন ক্রয়" : "New Purchase"}
          </h1>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
            className={cn(
              "gap-1.5 h-8 px-2.5 rounded-lg border text-xs font-semibold transition-all flex items-center cursor-pointer",
              isAiPanelOpen
                ? "bg-primary/20 text-primary border-primary/40 shadow-xs"
                : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/15",
            )}
          >
            <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
            <span>{isBangla ? "এআই সহকারী" : "AI Assistant"}</span>
          </Button>
        </div>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground h-9 px-3"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {isBangla ? "পেছনে" : "Back"}
        </Button>
      </div>

      {/* Main Responsive Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form Content (9 Columns wide) */}
        <div className="lg:col-span-9 space-y-6">

          {/* Top Product Autocomplete Search & Barcode Scanner Card (At Very Top of Purchase Info) */}
          <div className="bg-zinc-900/20 border border-border rounded-xl p-5 space-y-2 shadow-xs">
            <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Search className="h-4 w-4 text-primary" />
              <span>{isBangla ? "পণ্য খুঁজুন বা স্ক্যান করুন" : "Search Product / Scan Barcode"}</span>
            </Label>
            <div className="relative">
              <Input
                value={topProductSearchQuery}
                onChange={(e) => {
                  setTopProductSearchQuery(e.target.value);
                  setShowTopProductSuggestions(true);
                }}
                onFocus={() => setShowTopProductSuggestions(true)}
                onBlur={() => {
                  setTimeout(() => setShowTopProductSuggestions(false), 200);
                }}
                placeholder={
                  isBangla
                    ? "পণ্য সার্চ বা বারকোড স্ক্যান করুন (পণ্য সিলেক্ট করলে অটো নিচে টেবিল যোগ হবে)..."
                    : "Search product by name, SKU or scan barcode (auto-adds to items table below)..."
                }
                className="pr-10 h-11 bg-background/50 border-input text-xs font-medium focus-visible:ring-1"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

              {showTopProductSuggestions && (
                <div className="absolute z-50 left-0 top-full mt-1 w-full bg-card border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto divide-y divide-border text-foreground">
                  {getFilteredTopProducts(topProductSearchQuery).length === 0 ? (
                    <div className="p-3 text-center text-xs text-muted-foreground">
                      {isBangla ? "কোনো পণ্য পাওয়া যায়নি" : "No items found"}
                    </div>
                  ) : (
                    getFilteredTopProducts(topProductSearchQuery).map((product: any) => (
                      <button
                        key={product.id}
                        type="button"
                        className="w-full text-left p-2.5 hover:bg-muted/80 transition-colors flex items-center justify-between gap-3 text-foreground cursor-pointer"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleAddProductFromTopSearch(product);
                        }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-8 w-8 rounded object-cover border border-border/80 shrink-0"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded bg-muted flex items-center justify-center border border-border/60 shrink-0">
                              <Package className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground truncate text-xs">
                              {product.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground">
                              <span>SKU: {product.sku || "—"}</span>
                              <span>•</span>
                              <span>Stock: {product.currentStock || 0} {product.unit?.name || product.unit || "Pcs"}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="font-bold text-primary text-xs">
                            {formatCurrency(product.costPrice || product.purchasePrice || 0)}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Purchase Info Card */}
          <div className="bg-zinc-900/20 border border-border rounded-xl p-5 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <span className="text-sm font-semibold text-foreground">
                {isBangla ? "ক্রয় সংক্রান্ত তথ্য" : "Purchase Information"}
              </span>
              <span className="text-xs text-muted-foreground">
                {isBangla ? "শাখা ও বিবরণ নির্বাচন করুন" : "Manage branch and details"}
              </span>
            </div>

            {/* Row 1: Supplier, Purchase Date, Purchase Type (Each taking 1/3 equal full width) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              {/* Select Supplier */}
              <div className="relative space-y-2 col-span-1">
                <Label className="text-xs font-semibold text-foreground">
                  {isBangla ? "সরবরাহকারী *" : "Supplier *"}
                </Label>
                <div className="relative">
                  <Input
                    value={selectedSupplierName || supplierSearchQuery}
                    onChange={(e) => {
                      setSupplierSearchQuery(e.target.value);
                      if (selectedSupplierId) setSelectedSupplierId("");
                      setShowSupplierSuggestions(true);
                    }}
                    onFocus={() => setShowSupplierSuggestions(true)}
                    onBlur={() => {
                      setTimeout(() => setShowSupplierSuggestions(false), 200);
                    }}
                    placeholder={isBangla ? "খুঁজুন..." : "Search supplier"}
                    className={cn("pr-8 h-10 bg-background/50 border-input text-xs w-full", errors.supplier && "border-destructive")}
                  />
                  <Users className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />

                  {showSupplierSuggestions && (
                    <div className="absolute z-50 left-0 top-full mt-1 w-full bg-card border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto divide-y divide-border">
                      {filteredSuppliers.length === 0 ? (
                        <div className="p-3 text-center text-xs text-muted-foreground">
                          {isBangla ? "কোনো সরবরাহকারী নেই" : "No suppliers found"}
                        </div>
                      ) : (
                        filteredSuppliers.map((supplier: any) => (
                          <button
                            key={supplier.id}
                            type="button"
                            className="w-full text-left p-2.5 hover:bg-muted/80 text-xs transition-colors flex justify-between"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setSelectedSupplierId(supplier.id);
                              setSupplierSearchQuery("");
                              setShowSupplierSuggestions(false);
                            }}
                          >
                            <span className="font-semibold text-foreground truncate max-w-[180px]">
                              {supplier.name}
                            </span>
                            {supplier.phone && (
                              <span className="text-[10px] text-muted-foreground">
                                {supplier.phone}
                              </span>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
                {errors.supplier && <p className="text-[10px] text-destructive font-medium">{errors.supplier}</p>}
              </div>

              {/* Purchase Date */}
              <div className="space-y-2 col-span-1">
                <Label className="text-xs font-semibold text-foreground">
                  {isBangla ? "ক্রয় তারিখ" : "Purchase Date"}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-10 justify-between text-left font-normal bg-background/50 border-input text-foreground hover:bg-muted text-xs px-3"
                    >
                      <span>{format(invoiceDate, "dd MMM yyyy")}</span>
                      <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={invoiceDate}
                      onSelect={(date) => date && setInvoiceDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Purchase Type */}
              <div className="space-y-2 col-span-1">
                <Label className="text-xs font-semibold text-foreground">
                  {isBangla ? "ক্রয় প্রকার" : "Purchase Type"}
                </Label>
                <Select value={purchaseType} onValueChange={setPurchaseType}>
                  <SelectTrigger className="h-10 bg-background/50 border-input text-xs w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_store">{isBangla ? "ইন স্টোর (In Store)" : "In Store"}</SelectItem>
                    <SelectItem value="warehouse">{isBangla ? "ওয়্যারহাউস (Warehouse)" : "Warehouse"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 2: Branch, Responsible Person, Reference Number (Each taking 1/3 equal full width) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end border-t border-border/40 pt-4">
              {/* Branch Selector */}
              <div className="space-y-2 col-span-1">
                <Label className="text-xs font-semibold text-foreground">
                  {isBangla ? "শাখা" : "Branch"}
                </Label>
                <Select value={branchId} onValueChange={setBranchId}>
                  <SelectTrigger className="h-10 bg-background/50 border-input text-xs w-full">
                    <SelectValue placeholder={isBangla ? "শাখা নির্বাচন করুন" : "Select Branch"} />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((b: any) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Responsible Person */}
              <div className="space-y-2 col-span-1">
                <Label className="text-xs font-semibold text-foreground">
                  {isBangla ? "দায়িত্বপ্রাপ্ত ব্যক্তি" : "Responsible Person"}
                </Label>
                <Input
                  value={responsiblePerson}
                  onChange={(e) => setResponsiblePerson(e.target.value)}
                  placeholder={isBangla ? "নাম লিখুন" : "Employee name"}
                  className="h-10 bg-background/50 border-input text-xs w-full"
                />
              </div>

              {/* Reference Number */}
              <div className="space-y-2 col-span-1">
                <Label className="text-xs font-semibold text-foreground">
                  {isBangla ? "রেফারেন্স নম্বর" : "Reference Number"}
                </Label>
                <Input
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  placeholder={isBangla ? "রেফারেন্স কোড" : "Reference code"}
                  className="h-10 bg-background/50 border-input text-xs w-full"
                />
              </div>
            </div>
          </div>

          {/* Supplier Overview Banner */}
          {singleSupplierData?.data && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-primary font-semibold text-xs border-b border-primary/10 pb-2">
                <Users className="h-4 w-4" />
                <span>{isBangla ? "সরবরাহকারী সংক্ষিপ্ত বিবরণ" : "Supplier Overview"}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{isBangla ? "সরবরাহকারীর নাম" : "Supplier Name"}</p>
                  <p className="font-semibold text-foreground truncate mt-0.5">{singleSupplierData.data.name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{isBangla ? "মোবাইল" : "Phone"}</p>
                  <p className="font-semibold text-foreground truncate mt-0.5">{singleSupplierData.data.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-rose-400 uppercase tracking-wide">{isBangla ? "বর্তমান বকেয়া" : "Current Due"}</p>
                  <p className="font-bold text-rose-500 mt-0.5">
                    {formatCurrency(Math.abs(singleSupplierData.data.currentBalance || 0))}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{isBangla ? "বাকির সীমা" : "Credit Limit"}</p>
                  <p className="font-semibold text-foreground mt-0.5">
                    {singleSupplierData.data.creditLimit ? formatCurrency(singleSupplierData.data.creditLimit) : (isBangla ? 'সীমাহীন' : 'Unlimited')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Billing Items Table */}
          <div className="bg-zinc-900/20 border border-border rounded-xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <span className="text-sm font-semibold text-foreground">
                {isBangla ? "পণ্য ও মূল্য নির্ধারণ" : "Items & Pricing"}
              </span>
              {/* <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItemRow}
                className="h-8 text-xs gap-1.5 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{isBangla ? "নতুন সারি যোগ করুন" : "Add Row"}</span>
              </Button> */}
            </div>

            <div className="overflow-x-auto border border-border/60 rounded-lg">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted/20 text-muted-foreground border-b border-border/80 font-semibold">
                    <th className="px-3 py-3 w-[4%]">#</th>
                    <th className="px-3 py-3 w-[26%]">{isBangla ? "পণ্য বা ডেসক্রিপশন *" : "Item *"}</th>
                    <th className="px-3 py-3 w-[8%] text-center">{isBangla ? "স্টক" : "Stock"}</th>
                    <th className="px-3 py-3 w-[10%] text-center">{isBangla ? "পরিমাণ *" : "Qty *"}</th>
                    <th className="px-3 py-3 w-[12%]">{isBangla ? "ক্রয় মূল্য / দর *" : "Rate *"}</th>
                    <th className="px-3 py-3 w-[8%]">{isBangla ? "ট্যাক্স (%)" : "Tax (%)"}</th>
                    <th className="px-3 py-3 w-[18%]">{isBangla ? "ছাড় (% / Flat)" : "Discount (% / Flat)"}</th>
                    <th className="px-4 py-3 w-[10%] text-right">{isBangla ? "মোট" : "Amount"}</th>
                    <th className="px-3 py-3 w-[4%]"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {selectedItems.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground text-xs">
                        {isBangla
                          ? "উপরের সার্চ বক্স থেকে পণ্য সার্চ বা বারকোড স্ক্যান করে যোগ করুন।"
                          : "Use the search box above to search or scan products into this purchase."}
                      </td>
                    </tr>
                  ) : (
                    selectedItems.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                        <td className="px-3 py-3 font-semibold text-amber-500/80 align-middle">
                          {idx + 1}
                        </td>

                        {/* Product Image, Name & SKU (Uneditable Display) */}
                        <td className="px-3 py-3 align-middle">
                          <div className="flex items-center gap-2.5">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.itemName}
                                className="h-8 w-8 rounded object-cover border border-border/80 shrink-0"
                              />
                            ) : (
                              <div className="h-8 w-8 rounded bg-muted flex items-center justify-center border border-border/60 shrink-0">
                                <Image
                                  src="/images/image.png"
                                  width={40}
                                  height={40}
                                  alt="Image"
                                  className="h-5 w-5 text-muted-foreground/60"
                                />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-foreground text-xs leading-tight">
                                {item.itemName}
                              </p>
                              {item.sku && (
                                <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                                  SKU: {item.sku}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Stock */}
                        <td className="px-3 py-3 align-middle text-center text-muted-foreground font-medium">
                          {item.currentStock} {item.unit}
                        </td>

                        {/* Quantity */}
                        <td className="px-3 py-3 align-middle">
                          <Input
                            type="number"
                            value={item.quantity || ""}
                            onChange={(e) => handleRowChange(item.id, "quantity", e.target.value)}
                            className="h-8 text-center bg-background/50 border-input text-xs font-semibold"
                            min="1"
                          />
                        </td>

                        {/* Rate */}
                        <td className="px-3 py-3 align-middle">
                          <Input
                            type="number"
                            value={item.unitCost || ""}
                            onChange={(e) => handleRowChange(item.id, "unitCost", e.target.value)}
                            className="h-8 text-right bg-background/50 border-input text-xs font-semibold"
                            min="0"
                          />
                        </td>

                        {/* Tax % */}
                        <td className="px-3 py-3 align-middle">
                          <Input
                            type="number"
                            value={item.taxPercent || ""}
                            onChange={(e) => handleRowChange(item.id, "taxPercent", e.target.value)}
                            placeholder="0%"
                            className="h-8 text-right bg-background/50 border-input text-xs"
                            min="0"
                          />
                        </td>

                        {/* Discount (% and flat) */}
                        <td className="px-3 py-3 align-middle">
                          <div className="flex gap-1.5 items-center">
                            <div className="relative flex-1 flex items-center">
                              <Input
                                type="number"
                                value={item.discountPercent || ""}
                                onChange={(e) => handleRowChange(item.id, "discountPercent", e.target.value)}
                                placeholder="0"
                                className="bg-background/50 h-8 text-right pr-5 border-input text-xs font-semibold"
                                min="0"
                                max="100"
                              />
                              <span className="absolute right-1.5 text-[10px] text-muted-foreground font-semibold">
                                %
                              </span>
                            </div>
                            <div className="relative flex-1 flex items-center">
                              <span className="absolute left-1.5 text-[10px] text-muted-foreground font-medium">
                                Tk.
                              </span>
                              <Input
                                type="number"
                                value={item.discountFlat || ""}
                                onChange={(e) => handleRowChange(item.id, "discountFlat", e.target.value)}
                                placeholder="0"
                                className="pl-6 bg-background/50 h-8 text-right border-input text-xs font-semibold"
                                min="0"
                              />
                            </div>
                          </div>
                        </td>

                        {/* Row Total */}
                        <td className="px-4 py-3 align-middle text-right font-bold text-foreground font-mono">
                          {formatCurrency(item.total)}
                        </td>

                        {/* Delete Action */}
                        <td className="px-3 py-3 align-middle text-right">
                          <button
                            type="button"
                            onClick={() => removeItemRow(item.id)}
                            className="text-muted-foreground hover:text-rose-500 transition-colors p-1 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {errors.items && <p className="text-[10px] text-destructive font-medium">{errors.items}</p>}
          </div>

          {/* Payment Info Section - Cash vs Bank / Mobile Banking */}
          <div className="bg-zinc-900/20 border border-border rounded-xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <span className="text-sm font-semibold text-foreground">
                {isBangla ? "পেমেন্ট তথ্য" : "Payment Information"}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addPaymentRow}
                className="h-8 text-xs gap-1.5 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{isBangla ? "নতুন পেমেন্ট যোগ করুন" : "Add Payment"}</span>
              </Button>
            </div>

            <div className="space-y-3">
              {payments.map((p) => {
                const isCash = p.method === "cash";
                return (
                  <div
                    key={p.id}
                    className="p-4 rounded-xl border border-border/60 bg-background/30 space-y-4 relative"
                  >
                    {/* Delete payment button in top right if multiple payment rows */}
                    {payments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePaymentRow(p.id)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-rose-500 transition-colors p-1 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      {/* Payment Method Selector */}
                      <div className="space-y-2 col-span-1">
                        <Label className="text-xs font-semibold text-foreground">
                          {isBangla ? "পদ্ধতি *" : "Payment Method *"}
                        </Label>
                        <Select
                          value={p.method}
                          onValueChange={(val: any) => handlePaymentFieldChange(p.id, "method", val)}
                        >
                          <SelectTrigger className="h-10 text-xs bg-background/50 border-input w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">{isBangla ? "নগদ (Cash)" : "Cash"}</SelectItem>
                            <SelectItem value="bank">{isBangla ? "ব্যাংক (Bank)" : "Bank"}</SelectItem>
                            <SelectItem value="mobile_banking">
                              {isBangla ? "মোবাইল ব্যাংকিং (Mobile Banking)" : "Mobile Banking"}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Extra fields when Bank or Mobile Banking is selected */}
                      {!isCash && (
                        <>
                          {/* Account selection */}
                          <div className="space-y-2 col-span-1">
                            <Label className="text-xs font-semibold text-foreground">
                              {isBangla ? "অ্যাকাউন্ট" : "Account"}
                            </Label>
                            <Select
                              value={p.accountId}
                              onValueChange={(val) => handlePaymentFieldChange(p.id, "accountId", val)}
                            >
                              <SelectTrigger className="h-10 text-xs bg-background/50 border-input w-full">
                                <SelectValue placeholder={isBangla ? "অ্যাকাউন্ট নির্বাচন করুন" : "Select Account"} />
                              </SelectTrigger>
                              <SelectContent>
                                {accounts.map((acc: any) => (
                                  <SelectItem key={acc.id} value={acc.id}>
                                    {acc.name} (Tk.{acc.balance})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}

                      {/* Amount Field */}
                      <div className="space-y-2 col-span-1">
                        <Label className="text-xs font-semibold text-foreground">
                          {isBangla ? "পরিমাণ *" : "Amount *"}
                        </Label>
                        <Input
                          type="number"
                          value={p.amount || ""}
                          onChange={(e) => handlePaymentFieldChange(p.id, "amount", parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          className="h-10 text-xs bg-background/50 border-input text-right font-semibold w-full"
                        />
                      </div>

                      {!isCash && (
                        <>
                          {/* Reference */}
                          <div className="space-y-2 col-span-1">
                            <Label className="text-xs font-semibold text-foreground">
                              {isBangla ? "রেফারেন্স" : "Reference"}
                            </Label>
                            <Input
                              value={p.reference}
                              onChange={(e) => handlePaymentFieldChange(p.id, "reference", e.target.value)}
                              placeholder="Check / Ref no"
                              className="h-10 text-xs bg-background/50 border-input w-full"
                            />
                          </div>

                          {/* Transaction ID */}
                          <div className="space-y-2 col-span-1">
                            <Label className="text-xs font-semibold text-foreground">
                              {isBangla ? "লেনদেন আইডি" : "TXN ID"}
                            </Label>
                            <Input
                              value={p.transactionId}
                              onChange={(e) => handlePaymentFieldChange(p.id, "transactionId", e.target.value)}
                              placeholder="TXN-xxxx"
                              className="h-10 text-xs bg-background/50 border-input w-full"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              {errors.payments && <p className="text-[10px] text-destructive font-medium">{errors.payments}</p>}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-zinc-900/20 border border-border rounded-xl p-5 space-y-1.5 shadow-xs">
            <Label className="text-xs font-semibold text-foreground">
              {isBangla ? "মন্তব্য বা বিশেষ নির্দেশনা" : "Remarks or Special Notes"}
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isBangla ? "অতিরিক্ত বিবরণ লিখুন..." : "Enter additional purchase remarks..."}
              className="h-24 bg-background/50 border-input resize-none text-xs"
            />
          </div>
        </div>

        {/* Right Section: Purchase Summary Sticky Panel (3 Columns Wide) */}
        <div className="lg:col-span-3 lg:sticky lg:top-6 space-y-6">
          <div className="bg-zinc-900/20 border border-border rounded-xl p-5 space-y-4 shadow-xs">
            <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">
              {isBangla ? "ক্রয় সারাংশ" : "Purchase Summary"}
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>{isBangla ? "আইটেম উপমোট" : "Item Subtotal"}</span>
                <span className="font-semibold text-foreground">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>{isBangla ? "আইটেম ছাড়" : "Item Discount"}</span>
                <span className="font-semibold text-primary">-{formatCurrency(itemDiscount)}</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>{isBangla ? "আইটেম ট্যাক্স" : "Item Tax"}</span>
                <span className="font-semibold text-foreground">+{formatCurrency(itemTax)}</span>
              </div>

              {/* Order Discount Input */}
              <div className="flex justify-between items-center text-muted-foreground pt-1.5 border-t border-border/40">
                <span>{isBangla ? "অর্ডার ছাড়" : "Order Discount"}</span>
                <div className="relative w-28 flex items-center">
                  <span className="absolute left-2 text-[10px] font-medium text-muted-foreground">Tk.</span>
                  <Input
                    type="number"
                    value={orderDiscount || ""}
                    onChange={(e) => setOrderDiscount(parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="h-8 text-right pl-6 bg-background/40 text-xs text-foreground font-semibold"
                    min="0"
                  />
                </div>
              </div>

              {/* Shipping Cost Input */}
              <div className="flex justify-between items-center text-muted-foreground">
                <span>{isBangla ? "পরিবহন খরচ" : "Shipping Cost"}</span>
                <div className="relative w-28 flex items-center">
                  <span className="absolute left-2 text-[10px] font-medium text-muted-foreground">Tk.</span>
                  <Input
                    type="number"
                    value={shippingCost || ""}
                    onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="h-8 text-right pl-6 bg-background/40 text-xs text-foreground font-semibold"
                    min="0"
                  />
                </div>
              </div>

              {/* Additional Charges Input */}
              <div className="flex justify-between items-center text-muted-foreground">
                <span>{isBangla ? "অন্যান্য খরচ" : "Additional Charges"}</span>
                <div className="relative w-28 flex items-center">
                  <span className="absolute left-2 text-[10px] font-medium text-muted-foreground">Tk.</span>
                  <Input
                    type="number"
                    value={additionalCharges || ""}
                    onChange={(e) => setAdditionalCharges(parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="h-8 text-right pl-6 bg-background/40 text-xs text-foreground font-semibold"
                    min="0"
                  />
                </div>
              </div>

              {/* Grand Total output */}
              <div className="flex justify-between items-center border-t border-border pt-3 text-sm font-bold">
                <span className="text-foreground">{isBangla ? "সর্বমোট" : "Grand Total"}</span>
                <span className="text-primary text-base">{formatCurrency(grandTotal)}</span>
              </div>

              <div className="flex justify-between items-center text-muted-foreground pt-1.5 border-t border-border/40">
                <span>{isBangla ? "পরিশোধিত" : "Paid Amount"}</span>
                <span className="font-bold text-foreground">{formatCurrency(totalPaid)}</span>
              </div>

              {due > 0 && (
                <div className="flex justify-between items-center text-rose-500 font-bold">
                  <span>{isBangla ? "বাকি পরিমাণ" : "Due Amount"}</span>
                  <span>{formatCurrency(due)}</span>
                </div>
              )}

              {changeReturned > 0 && (
                <div className="flex justify-between items-center text-blue-500 font-bold">
                  <span>{isBangla ? "ফেরত (Change)" : "Change Return"}</span>
                  <span>{formatCurrency(changeReturned)}</span>
                </div>
              )}
            </div>

            {/* ONLY Complete Purchase & Cancel Buttons (per user request) */}
            <div className="space-y-2 pt-3 border-t border-border">
              <Button
                type="button"
                onClick={handleSubmitWithStatus}
                disabled={isPending}
                className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center justify-center gap-1.5 cursor-pointer text-xs"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>{isBangla ? "সংরক্ষণ হচ্ছে..." : "Saving..."}</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>{isBangla ? "ক্রয় সম্পন্ন করুন" : "Complete Purchase"}</span>
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                className="w-full h-9 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {isBangla ? "বাতিল করুন" : "Cancel"}
              </Button>
            </div>
          </div>

          {/* AI Suggestions Card */}
          {isAiPanelOpen && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 shadow-xs space-y-3.5 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-primary/10 pb-2">
                <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  <span>{isBangla ? "এআই ক্রয় বুদ্ধি" : "AI Purchase Insights"}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsAiPanelOpen(false)}
                  className="text-muted-foreground hover:text-foreground text-xs"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-3 text-[11px] leading-relaxed">
                {aiSuggestions.map((suggestion, idx) => (
                  <div key={idx} className="p-2.5 bg-background/50 border border-border/50 rounded-lg flex items-start gap-2 shadow-2xs">
                    <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NewPurchasePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <NewPurchaseContent />
    </Suspense>
  );
}
