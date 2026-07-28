// Hello Khata OS - Purchase Return Page
// হ্যালো খাতা - নতুন ক্রয় ফেরত পেজ

"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/premium";
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
  Search,
  Camera,
  Sparkles,
  Info,
  CheckCircle,
  Image as ImageIcon,
} from "lucide-react";
import { useCurrency, useAppTranslation } from "@/hooks/useAppTranslation";
import { useUser } from "@/stores/sessionStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useParties, useParty } from "@/hooks/api/useParties";
import { useGetItems } from "@/hooks/api/useItems";
import { useReturnPurchase, useGetPurchaseReturns } from "@/hooks/api/useReturns";
import { useGetPurchases, useGetPurchaseById } from "@/hooks/api/usePurchases";
import { useBranches, useAccounts } from "@/hooks/queries";
import Image from "next/image";

interface ReturnItemRow {
  id: string;
  purchaseItemId?: string;
  itemId: string;
  itemName: string;
  sku: string;
  batchNo?: string;
  quantity: number;
  maxQuantity: number;
  remainingQuantity: number;
  unitCost: number;
  unit: string;
  returnType: "refund" | "replacement" | "exchange" | "damage" | "expired" | "warranty" | "supplier_credit";
  reason: string;
  total: number;
  searchQuery: string;
  showSuggestions: boolean;
  imageUrl?: string;
}

function NewPurchaseReturnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supplierIdParam = searchParams.get("supplierId") || "";
  const purchaseIdParam = searchParams.get("purchaseId") || "";

  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const { mutate: returnPurchase, isPending: isSubmitting } = useReturnPurchase();
  const user = useUser();

  // Queries
  const { data: branches = [] } = useBranches();
  const { data: accounts = [] } = useAccounts();
  const { data: purchaseReturns = [] } = useGetPurchaseReturns();

  // Selected Purchase & Supplier state
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(supplierIdParam);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<string>(purchaseIdParam);

  // Search queries for supplier, invoice, product search
  const [supplierSearchQuery, setSupplierSearchQuery] = useState("");
  const [showSupplierSuggestions, setShowSupplierSuggestions] = useState(false);
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState("");
  const [showInvoiceSuggestions, setShowInvoiceSuggestions] = useState(false);
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [showProductSuggestions, setShowProductSuggestions] = useState(false);

  // Fetch API data
  const { data: partiesData } = useParties();
  const suppliers = useMemo(() => {
    const list = partiesData?.data || [];
    return list.filter((p: any) => p.type === "supplier" || p.type === "both");
  }, [partiesData]);

  const { data: singleSupplierData } = useParty(selectedSupplierId, {
    enabled: !!selectedSupplierId,
  });

  const { data: purchasesList = [] } = useGetPurchases();
  const { data: singlePurchaseData } = useGetPurchaseById(selectedPurchaseId);

  const { data: itemsData } = useGetItems({ page: 1, limit: 100 });
  const items = itemsData?.data || [];

  // Form Metadata
  const autoReturnNo = useMemo(() => {
    const todayStr = format(new Date(), "yyyyMMdd");
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `PR-${todayStr}-${rand}`;
  }, []);

  const [returnNo, setReturnNo] = useState("");
  useEffect(() => {
    setReturnNo(autoReturnNo);
  }, [autoReturnNo]);

  const [returnDate, setReturnDate] = useState<Date>(new Date());
  const [branchId, setBranchId] = useState("");
  const [responsiblePerson, setResponsiblePerson] = useState("");
  const [referenceNo, setReferenceNo] = useState("");
  const [returnStatus, setReturnStatus] = useState<"draft" | "pending" | "approved" | "completed" | "cancelled">("completed");

  const userBranchId = user?.branchId;
  const userName = user?.name;
  useEffect(() => {
    if (userBranchId && !branchId) setBranchId(userBranchId);
    if (userName && !responsiblePerson) setResponsiblePerson(userName);
  }, [userBranchId, userName, branchId, responsiblePerson]);

  // Adjustments & Split Refund Configurations
  const [orderDiscount, setOrderDiscount] = useState<number>(0);
  const [taxPercent, setTaxPercent] = useState<number>(0);
  const [shippingAdjustment, setShippingAdjustment] = useState<number>(0);
  const [additionalCharges, setAdditionalCharges] = useState<number>(0);

  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [supplierCredit, setSupplierCredit] = useState<number>(0);
  const [paymentAdjustment, setPaymentAdjustment] = useState<number>(0);

  const [refundMethod, setRefundMethod] = useState<
    "cash" | "bank" | "card" | "bkash" | "nagad" | "rocket" | "wallet" | "supplier_credit" | "due_adjustment"
  >("cash");
  const [accountId, setAccountId] = useState<string>("");

  const [attachments, setAttachments] = useState<File[]>([]);
  const [notes, setNotes] = useState("");
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);

  // Return items table state
  const [selectedItems, setSelectedItems] = useState<ReturnItemRow[]>([
    {
      id: "initial-row",
      itemId: "",
      itemName: "",
      sku: "—",
      batchNo: "",
      quantity: 1,
      maxQuantity: 100,
      remainingQuantity: 100,
      unitCost: 0,
      unit: "pcs",
      returnType: "refund",
      reason: "damaged",
      total: 0,
      searchQuery: "",
      showSuggestions: false,
      imageUrl: "",
    },
  ]);

  // Sync items when an Original Purchase Invoice is selected
  useEffect(() => {
    if (singlePurchaseData?.data) {
      const p = singlePurchaseData.data;
      if (p.supplierId) setSelectedSupplierId(p.supplierId);
      if (p.branchId) setBranchId(p.branchId);

      if (p.items && p.items.length > 0) {
        const prefilled: ReturnItemRow[] = p.items.map((item: any, idx: number) => {
          const qtyPurchased = item.quantity || 1;
          const qtyReturned = item.alreadyReturned || 0;
          const qtyRemaining = Math.max(0, qtyPurchased - qtyReturned);
          const price = item.unitCost || item.unitPrice || 0;
          return {
            id: item.id || String(idx),
            purchaseItemId: item.id,
            itemId: item.itemId || "",
            itemName: item.itemName || item.name || "Product",
            sku: item.sku || item.item?.sku || "—",
            batchNo: item.batchNo || "",
            quantity: qtyRemaining,
            maxQuantity: qtyPurchased,
            remainingQuantity: qtyRemaining,
            unitCost: price,
            unit: item.unit || "pcs",
            returnType: "refund",
            reason: "damaged",
            total: qtyRemaining * price,
            searchQuery: "",
            showSuggestions: false,
            imageUrl: item.imageUrl || "",
          };
        });
        setSelectedItems(prefilled);
      }
    }
  }, [singlePurchaseData]);

  // Suppliers list filtering
  const filteredSuppliers = useMemo(() => {
    if (!supplierSearchQuery) return suppliers;
    return suppliers.filter(
      (s: any) =>
        s.name.toLowerCase().includes(supplierSearchQuery.toLowerCase()) ||
        s.phone?.includes(supplierSearchQuery),
    );
  }, [suppliers, supplierSearchQuery]);

  const selectedSupplierName = useMemo(() => {
    const s = suppliers.find((p: any) => p.id === selectedSupplierId);
    if (s) return s.name;
    if (singleSupplierData?.data && singleSupplierData.data.id === selectedSupplierId) {
      return singleSupplierData.data.name;
    }
    return "";
  }, [suppliers, selectedSupplierId, singleSupplierData]);

  // Purchases list filtering
  const filteredPurchases = useMemo(() => {
    if (!purchasesList) return [];
    if (!invoiceSearchQuery) return purchasesList.slice(0, 10);
    return purchasesList.filter((p: any) =>
      (p.invoiceNo || "").toLowerCase().includes(invoiceSearchQuery.toLowerCase()),
    );
  }, [purchasesList, invoiceSearchQuery]);

  const selectedInvoiceNo = useMemo(() => {
    const p = purchasesList.find((x: any) => x.id === selectedPurchaseId);
    if (p) return p.invoiceNo || `PUR-${(p.id || "").slice(-6)}`;
    if (singlePurchaseData?.data) {
      const sp = singlePurchaseData.data;
      return sp.invoiceNo || `PUR-${(sp.id || "").slice(-6)}`;
    }
    return "";
  }, [purchasesList, selectedPurchaseId, singlePurchaseData]);

  // Product filtering
  const getFilteredProducts = (query: string) => {
    if (!query?.trim()) return items.slice(0, 10);
    const search = query.toLowerCase();
    return items.filter(
      (product: any) =>
        product.name?.toLowerCase().includes(search) ||
        product.sku?.toLowerCase().includes(search) ||
        product.barcode?.toLowerCase().includes(search),
    );
  };

  // Financial calculations
  const subtotal = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);
  }, [selectedItems]);

  const taxAmount = useMemo(() => {
    return Math.max(0, (subtotal - orderDiscount) * (taxPercent / 100));
  }, [subtotal, orderDiscount, taxPercent]);

  const grandTotal = useMemo(() => {
    return Math.max(0, subtotal - orderDiscount + taxAmount + shippingAdjustment + additionalCharges);
  }, [subtotal, orderDiscount, taxAmount, shippingAdjustment, additionalCharges]);

  // Default split distribution
  useEffect(() => {
    if (
      refundMethod === "cash" ||
      refundMethod === "bank" ||
      refundMethod === "card" ||
      refundMethod === "bkash" ||
      refundMethod === "nagad" ||
      refundMethod === "rocket" ||
      refundMethod === "wallet"
    ) {
      setRefundAmount(grandTotal);
      setSupplierCredit(0);
      setPaymentAdjustment(0);
    } else if (refundMethod === "supplier_credit") {
      setRefundAmount(0);
      setSupplierCredit(grandTotal);
      setPaymentAdjustment(0);
    } else if (refundMethod === "due_adjustment") {
      setRefundAmount(0);
      setSupplierCredit(0);
      setPaymentAdjustment(grandTotal);
    }
  }, [grandTotal, refundMethod]);

  const handleAutoFillSplit = (type: "refund" | "credit" | "adjustment") => {
    if (type === "refund") {
      setRefundAmount(grandTotal);
      setSupplierCredit(0);
      setPaymentAdjustment(0);
    } else if (type === "credit") {
      setRefundAmount(0);
      setSupplierCredit(grandTotal);
      setPaymentAdjustment(0);
    } else {
      setRefundAmount(0);
      setSupplierCredit(0);
      setPaymentAdjustment(grandTotal);
    }
  };

  // AI Insights Suggestions
  const aiSuggestions = useMemo(() => {
    const suggestions: string[] = [];
    if (singleSupplierData?.data) {
      const sup = singleSupplierData.data;
      if (sup.returnRate && sup.returnRate > 15) {
        suggestions.push(
          isBangla
            ? `⚠️ সরবরাহকারী গুণমান সতর্কতা: ${sup.name}-এর পণ্য ফেরতের হার উচ্চ (${sup.returnRate}%)।`
            : `⚠️ Supplier Quality Warning: ${sup.name} has a high product return rate of ${sup.returnRate}%.`,
        );
      }
      if (sup.riskLevel === "high") {
        suggestions.push(
          isBangla
            ? `👤 আর্থিক ঝুঁকি: এই সরবরাহকারীর ঝুঁকি স্কোর বেশি। বকেয়া সমন্বয় নির্বাচন করার পরামর্শ দেওয়া হচ্ছে।`
            : `👤 Financial Risk: High supplier risk score. Recommend selecting Due Adjustment.`,
        );
      }
    }
    if (suggestions.length === 0) {
      suggestions.push(
        isBangla
          ? "💡 এআই পারচেজ অ্যাসিস্ট্যান্স: এই ফেরতের জন্য কোনো গুরুত্বপূর্ণ আর্থিক বা গুণগত ঝুঁকি পাওয়া যায়নি।"
          : "💡 AI Purchase Assistance: No critical financial or inventory quality risks identified.",
      );
    }
    return suggestions;
  }, [singleSupplierData, isBangla]);

  // Product table row actions
  const handleAddProductToTable = (product: any) => {
    setSelectedItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.itemId === product.id);
      if (existingIndex > -1) {
        return prev.map((item, idx) => {
          if (idx === existingIndex) {
            const newQty = item.quantity + 1;
            const price = item.unitCost || product.costPrice || product.sellingPrice || 0;
            return {
              ...item,
              quantity: newQty,
              total: newQty * price,
            };
          }
          return item;
        });
      }

      const price = product.costPrice || product.sellingPrice || 0;
      const newItemRow: ReturnItemRow = {
        id: Math.random().toString(),
        itemId: product.id,
        itemName: product.name,
        sku: product.sku || "—",
        batchNo: "",
        quantity: 1,
        maxQuantity: product.currentStock || 100,
        remainingQuantity: product.currentStock || 100,
        unitCost: price,
        unit: product.unit || "pcs",
        returnType: "refund",
        reason: "damaged",
        total: price,
        searchQuery: "",
        showSuggestions: false,
        imageUrl: product.imageUrl || "",
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
        sku: "—",
        batchNo: "",
        quantity: 1,
        maxQuantity: 100,
        remainingQuantity: 100,
        unitCost: 0,
        unit: "pcs",
        returnType: "refund",
        reason: "damaged",
        total: 0,
        searchQuery: "",
        showSuggestions: false,
        imageUrl: "",
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
          sku: "—",
          batchNo: "",
          quantity: 1,
          maxQuantity: 100,
          remainingQuantity: 100,
          unitCost: 0,
          unit: "pcs",
          returnType: "refund",
          reason: "damaged",
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

  const updateQuantity = (id: string, quantity: number) => {
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(0, quantity);
          return {
            ...item,
            quantity: newQty,
            total: newQty * item.unitCost,
          };
        }
        return item;
      }),
    );
  };

  const updateItemField = (id: string, field: keyof ReturnItemRow, value: any) => {
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            [field]: value,
          };
        }
        return item;
      }),
    );
  };

  // Submit flow
  const handleSubmitWithStatus = (status: typeof returnStatus, andThen: "redirect" | "clear" | "print") => {
    const itemsToReturn = selectedItems.filter((i) => (i.itemId !== "" || i.itemName !== "") && i.quantity > 0);

    if (!selectedSupplierId) {
      toast.error(isBangla ? "সরবরাহকারী নির্বাচন করা নেই" : "No supplier selected");
      return;
    }
    if (itemsToReturn.length === 0) {
      toast.error(isBangla ? "অন্তত একটি পণ্য ফেরত দিন" : "Select at least one item to return");
      return;
    }

    const payload = {
      purchaseId: selectedPurchaseId || undefined,
      supplierId: selectedSupplierId,
      returnNo,
      returnDate: returnDate.toISOString(),
      branchId,
      responsiblePerson,
      referenceNo,
      status,
      items: itemsToReturn.map((item) => ({
        purchaseItemId: item.purchaseItemId,
        itemId: item.itemId,
        itemName: item.itemName,
        quantity: item.quantity,
        unitCost: item.unitCost,
        returnType: item.returnType,
        reason: item.reason,
      })),
      discount: orderDiscount,
      tax: taxAmount,
      shippingAdjustment,
      additionalCharges,
      grandTotal,
      refundAmount,
      supplierCredit,
      paymentAdjustment,
      refundMethod,
      accountId: accountId || user?.id || "",
      notes: notes || undefined,
    };

    returnPurchase(payload, {
      onSuccess: () => {
        toast.success(
          isBangla ? "ক্রয় ফেরত সফলভাবে সম্পন্ন হয়েছে" : "Purchase return saved successfully",
        );
        if (andThen === "clear") {
          setSelectedItems([]);
          setNotes("");
          setReferenceNo("");
        } else if (andThen === "print") {
          window.print();
          router.push("/purchases/returns");
        } else {
          router.push("/purchases/returns");
        }
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || (isBangla ? "ফেরত ব্যর্থ হয়েছে" : "Return failed"),
        );
      },
    });
  };

  const returnTypes = [
    { value: "refund", label: isBangla ? "রিফান্ড (Refund)" : "Refund" },
    { value: "replacement", label: isBangla ? "প্রতিস্থাপন (Replacement)" : "Replacement" },
    { value: "exchange", label: isBangla ? "বিনিময় (Exchange)" : "Exchange" },
    { value: "damage", label: isBangla ? "ক্ষতিগ্রস্ত (Damage)" : "Damage" },
    { value: "expired", label: isBangla ? "মেয়াদোত্তীর্ণ (Expired)" : "Expired" },
    { value: "warranty", label: isBangla ? "ওয়ারেন্টি (Warranty)" : "Warranty" },
    { value: "supplier_credit", label: isBangla ? "সরবরাহকারী ক্রেডিট (Supplier Credit)" : "Supplier Credit" },
  ];

  const returnReasons = [
    { value: "damaged", label: isBangla ? "ক্ষতিগ্রস্ত (Damaged)" : "Damaged" },
    { value: "expired", label: isBangla ? "মেয়াদোত্তীর্ণ (Expired)" : "Expired" },
    { value: "wrong_product", label: isBangla ? "ভুল পণ্য (Wrong Product)" : "Wrong Product" },
    { value: "wrong_quantity", label: isBangla ? "ভুল পরিমাণ (Wrong Quantity)" : "Wrong Quantity" },
    { value: "defective", label: isBangla ? "ত্রুটিপূর্ণ (Defective)" : "Defective" },
    { value: "other", label: isBangla ? "অন্যান্য (Other)" : "Other" },
  ];

  return (
    <div className="space-y-6">
      {/* Header section - Exactly matching New Purchase UI */}
      <div className="flex items-center justify-between pb-3 border-b border-border/80">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <RotateCcw className="h-6 w-6 text-primary" />
            {isBangla ? "ক্রয় ফেরত" : "Purchase Return"}
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
          size="icon-sm"
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground h-9 px-3"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {isBangla ? "পেছনে" : "Back"}
        </Button>
      </div>

      {/* Main 12-column grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Section (Spans 9 columns on desktop) */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Section 1: Purchase Return Information Card */}
          <div className="bg-zinc-900/20 border border-border rounded-xl p-5 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <span className="text-sm font-semibold text-foreground">
                {isBangla ? "ক্রয় ফেরত সংক্রান্ত তথ্য" : "Purchase Return Information"}
              </span>
              <Badge variant="outline" className="text-xs font-medium">
                {isBangla ? "মেটাডাটা বিবরণ" : "Metadata Info"}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-background/30 p-3.5 rounded-lg border border-border/40">
              {/* Supplier Display */}
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  {isBangla ? "সরবরাহকারী" : "Supplier Name"}
                </p>
                <p className="font-bold text-foreground text-sm mt-0.5">
                  {singleSupplierData?.data?.name || (isBangla ? "সরবরাহকারী নির্বাচন করুন" : "Select Supplier")}
                </p>
              </div>

              {/* Original Purchase Invoice */}
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  {isBangla ? "মূল ক্রয় ইনভয়েস" : "Original Invoice"}
                </p>
                <p className="font-bold text-foreground text-sm mt-0.5">
                  {selectedInvoiceNo || (isBangla ? "ঐচ্ছিক ইনভয়েস" : "Optional Invoice")}
                </p>
              </div>

              {/* Return Date Display */}
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  {isBangla ? "ফেরতের তারিখ" : "Return Date"}
                </p>
                <p className="font-bold text-foreground text-sm mt-0.5">
                  {format(returnDate, "dd MMM yyyy")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Purchase Return Number */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  {isBangla ? "ক্রয় ফেরত নম্বর" : "Return Number"}
                </Label>
                <Input
                  value={returnNo}
                  onChange={(e) => setReturnNo(e.target.value)}
                  className="bg-background/50 border-input h-10 text-xs font-bold text-primary"
                />
              </div>

              {/* Return Date */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  {isBangla ? "ফেরতের তারিখ" : "Return Date"}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-10 bg-background/50 border-input justify-between text-left text-xs font-normal text-muted-foreground hover:bg-muted/5"
                    >
                      <span>{returnDate ? format(returnDate, "PPP") : isBangla ? "তারিখ নির্বাচন" : "Select date"}</span>
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-50">
                    <Calendar
                      mode="single"
                      selected={returnDate}
                      onSelect={(date) => date && setReturnDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Branch */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  {isBangla ? "শাখা" : "Branch"}
                </Label>
                <Select value={branchId} onValueChange={setBranchId}>
                  <SelectTrigger className="bg-background/50 border-input h-10 text-xs">
                    <SelectValue placeholder={isBangla ? "শাখা নির্বাচন করুন" : "Select branch"} />
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
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  {isBangla ? "দায়িত্বপ্রাপ্ত ব্যক্তি" : "Responsible Person"}
                </Label>
                <Input
                  value={responsiblePerson}
                  onChange={(e) => setResponsiblePerson(e.target.value)}
                  className="bg-background/50 border-input h-10 text-xs font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Supplier Overview Card */}
          {singleSupplierData?.data && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-primary font-semibold text-xs border-b border-primary/10 pb-2">
                <Users className="h-4 w-4" />
                <span>{isBangla ? "সরবরাহকারী সংক্ষিপ্ত বিবরণ ও আর্থিক অবস্থা" : "Supplier Overview"}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    {isBangla ? "সরবরাহকারীর নাম" : "Supplier Name"}
                  </p>
                  <p className="font-semibold text-foreground truncate mt-0.5">
                    {singleSupplierData.data.name}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    {isBangla ? "মোবাইল নম্বর" : "Phone"}
                  </p>
                  <p className="font-semibold text-foreground truncate mt-0.5">
                    {singleSupplierData.data.phone || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-rose-400 uppercase tracking-wide">
                    {isBangla ? "বর্তমান বকেয়া" : "Current Due"}
                  </p>
                  <p className="font-bold text-rose-500 mt-0.5">
                    {formatCurrency(Math.abs(singleSupplierData.data.currentBalance || 0))}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    {isBangla ? "বাকির সীমা (Credit Limit)" : "Credit Limit"}
                  </p>
                  <p className="font-semibold text-foreground mt-0.5">
                    {singleSupplierData.data.creditLimit
                      ? formatCurrency(singleSupplierData.data.creditLimit)
                      : isBangla
                        ? "সীমাহীন"
                        : "Unlimited"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Return Items List Table */}
          <div className="bg-zinc-900/20 border border-border rounded-xl overflow-hidden shadow-xs space-y-4">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">
                {isBangla ? "ফেরতযোগ্য পণ্য তালিকা" : "Returnable Items Details"}
              </span>
            </div>

            {/* Top Search Controls Bar */}
            <div className="px-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              {/* Product Search */}
              <div className="relative space-y-1.5 md:col-span-1">
                <Label className="text-xs font-semibold text-foreground">
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
                    onBlur={() => setTimeout(() => setShowProductSuggestions(false), 200)}
                    placeholder={isBangla ? "পণ্য সার্চ করুন..." : "Search product or scan barcode..."}
                    className="pr-9 h-9 bg-background/50 border-input text-xs font-medium"
                  />
                  <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />

                  {showProductSuggestions && (
                    <div className="absolute z-50 left-0 top-full mt-1 w-full bg-card border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto divide-y divide-border">
                      {getFilteredProducts(productSearchQuery).length === 0 ? (
                        <div className="p-3 text-center text-xs text-muted-foreground">
                          {isBangla ? "কোনো পণ্য পাওয়া যায়নি" : "No products found"}
                        </div>
                      ) : (
                        getFilteredProducts(productSearchQuery).map((product: any) => (
                          <button
                            key={product.id}
                            type="button"
                            className="w-full text-left p-2.5 hover:bg-muted/80 text-xs transition-colors flex items-center justify-between gap-3 text-foreground"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleAddProductToTable(product);
                            }}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="h-7 w-7 rounded bg-muted flex items-center justify-center border border-border/60 shrink-0">
                                <Image src="/images/image.png" width={16} height={16} alt="prod" className="h-4 w-4 text-muted-foreground/60" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-foreground truncate text-xs">{product.name}</p>
                                <p className="text-[10px] text-muted-foreground truncate">SKU: {product.sku || "—"}</p>
                              </div>
                            </div>
                            <span className="font-bold text-primary text-xs shrink-0">
                              {formatCurrency(product.costPrice || product.sellingPrice || 0)}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Purchase Invoice Selector */}
              <div className="relative space-y-1.5 md:col-span-1">
                <Label className="text-xs font-semibold text-foreground">
                  {isBangla ? "মূল ক্রয় ইনভয়েস" : "Original Purchase Invoice"}
                </Label>
                <div className="relative">
                  <Input
                    value={selectedInvoiceNo || invoiceSearchQuery}
                    onChange={(e) => {
                      setInvoiceSearchQuery(e.target.value);
                      if (selectedPurchaseId) setSelectedPurchaseId("");
                      setShowInvoiceSuggestions(true);
                    }}
                    onFocus={() => setShowInvoiceSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowInvoiceSuggestions(false), 200)}
                    placeholder={isBangla ? "ইনভয়েস নম্বর খুঁজুন..." : "Search invoice no..."}
                    className="pr-9 h-9 bg-background/50 border-input text-xs"
                  />
                  <FileText className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />

                  {showInvoiceSuggestions && (
                    <div className="absolute z-50 left-0 top-full mt-1 w-full bg-card border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto divide-y divide-border">
                      {filteredPurchases.length === 0 ? (
                        <div className="p-3 text-center text-xs text-muted-foreground">
                          {isBangla ? "কোনো ইনভয়েস পাওয়া যায়নি" : "No invoices found"}
                        </div>
                      ) : (
                        filteredPurchases.map((purchase: any) => (
                          <button
                            key={purchase.id}
                            type="button"
                            className="w-full text-left p-2.5 hover:bg-muted/80 text-xs transition-colors flex justify-between"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setSelectedPurchaseId(purchase.id);
                              setInvoiceSearchQuery("");
                              setShowInvoiceSuggestions(false);
                            }}
                          >
                            <span className="font-semibold text-foreground">
                              {purchase.invoiceNo || `PUR-${(purchase.id || "").slice(-6)}`}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {formatCurrency(purchase.total)}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Supplier Selector */}
              <div className="relative space-y-1.5 md:col-span-1">
                <Label className="text-xs font-semibold text-foreground">
                  {isBangla ? "সরবরাহকারী নির্বাচন" : "Select Supplier"}
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
                    onBlur={() => setTimeout(() => setShowSupplierSuggestions(false), 200)}
                    placeholder={isBangla ? "সরবরাহকারী খুঁজুন..." : "Search supplier..."}
                    className="pr-9 h-9 bg-background/50 border-input text-xs"
                  />
                  <Users className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />

                  {showSupplierSuggestions && (
                    <div className="absolute z-50 left-0 top-full mt-1 w-full bg-card border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto divide-y divide-border">
                      {filteredSuppliers.length === 0 ? (
                        <div className="p-3 text-center text-xs text-muted-foreground">
                          {isBangla ? "কোনো সরবরাহকারী পাওয়া যায়নি" : "No suppliers found"}
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
                            <span className="font-semibold text-foreground">{supplier.name}</span>
                            {supplier.phone && <span className="text-[10px] text-muted-foreground">{supplier.phone}</span>}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-border/80 bg-muted/20 text-muted-foreground font-semibold">
                    <th className="px-4 py-3">{isBangla ? "আইটেম বিবরণ" : "Item & SKU"}</th>
                    <th className="px-3 py-3 text-right">{isBangla ? "মূল্য" : "Purchase Price"}</th>
                    <th className="px-3 py-3 text-center">{isBangla ? "ইনভেন্টরি" : "Current Stock"}</th>
                    <th className="px-4 py-3 text-center w-28">{isBangla ? "ফেরত পরিমাণ *" : "Return Qty *"}</th>
                    <th className="px-3 py-3">{isBangla ? "ফেরত টাইপ" : "Return Type"}</th>
                    <th className="px-3 py-3">{isBangla ? "কারণ" : "Reason"}</th>
                    <th className="px-3 py-3 text-right">{isBangla ? "মোট" : "Total"}</th>
                    <th className="px-4 py-3 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {selectedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-4 py-3.5 align-middle">
                        <p className="font-semibold text-foreground text-xs leading-tight">{item.itemName || (isBangla ? "পণ্য নির্বাচন করুন" : "Select Product")}</p>
                        <p className="text-[10px] text-muted-foreground">SKU: {item.sku}</p>
                      </td>
                      <td className="px-3 py-3.5 align-middle text-right font-medium text-foreground">
                        {formatCurrency(item.unitCost)}
                      </td>
                      <td className="px-3 py-3.5 align-middle text-center text-muted-foreground font-medium">
                        {item.remainingQuantity} {item.unit}
                      </td>
                      <td className="px-4 py-3.5 align-middle">
                        <div className="flex items-center border border-input rounded bg-background/50 h-8 w-24 mx-auto">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-full px-2 text-muted-foreground hover:text-foreground active:bg-muted/20"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={item.quantity || 0}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                            className="w-full text-center h-full bg-transparent outline-none border-none text-xs font-semibold text-foreground [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-full px-2 text-muted-foreground hover:text-foreground active:bg-muted/20"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 align-middle">
                        <Select
                          value={item.returnType}
                          onValueChange={(val: any) => updateItemField(item.id, "returnType", val)}
                        >
                          <SelectTrigger className="h-8 text-[11px] bg-background/40 w-28 border-input">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {returnTypes.map((t) => (
                              <SelectItem key={t.value} value={t.value} className="text-xs">
                                {t.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-3 py-3.5 align-middle">
                        <Select
                          value={item.reason}
                          onValueChange={(val: any) => updateItemField(item.id, "reason", val)}
                        >
                          <SelectTrigger className="h-8 text-[11px] bg-background/40 w-28 border-input">
                            <SelectValue placeholder={isBangla ? "কারণ বলুন" : "Reason"} />
                          </SelectTrigger>
                          <SelectContent>
                            {returnReasons.map((r) => (
                              <SelectItem key={r.value} value={r.value} className="text-xs">
                                {r.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-3 py-3.5 align-middle text-right font-bold text-foreground">
                        {formatCurrency(item.quantity * item.unitCost)}
                      </td>
                      <td className="px-4 py-3.5 align-middle text-right">
                        <button
                          type="button"
                          onClick={() => removeItemRow(item.id)}
                          className="text-muted-foreground hover:text-rose-500 p-1.5 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom summary bar */}
            <div className="flex justify-between items-center px-5 py-3.5 bg-muted/10 border-t border-border">
              <button
                type="button"
                onClick={addItemRow}
                className="text-primary font-semibold text-xs flex items-center gap-1.5 hover:underline cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                {isBangla ? "আইটেম যোগ করুন" : "Add Return Item"}
              </button>
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground font-semibold text-xs">
                  {isBangla ? "আইটেম উপমোট পরিমাণ" : "Return Subtotal Amount"}
                </span>
                <span className="font-bold text-foreground text-sm">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Attachments Section */}
          <div className="bg-zinc-900/20 border border-border rounded-xl p-5 space-y-3.5 shadow-xs">
            <Label className="text-xs font-semibold text-foreground">
              {isBangla ? "প্রমাণপত্র / ক্রেডিট নোট / চালান ছবি সংযুক্ত করুন" : "Upload Credit Note / Return Invoices / Pictures"}
            </Label>
            <div className="flex flex-wrap gap-2.5 items-center">
              <label className="h-14 w-14 rounded-lg border border-dashed border-border/80 flex flex-col items-center justify-center bg-background/20 hover:bg-muted/50 hover:border-primary transition-all text-muted-foreground hover:text-foreground cursor-pointer">
                <Camera className="h-4 w-4 mb-0.5" />
                <span className="text-[9px]">{isBangla ? "আপলোড" : "Upload"}</span>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) {
                      const files = Array.from(e.target.files);
                      setAttachments((prev) => [...prev, ...files]);
                      toast.success(`${files.length} files attached.`);
                    }
                  }}
                />
              </label>

              {attachments.map((file, idx) => (
                <div
                  key={idx}
                  className="h-14 w-14 rounded-lg border border-border bg-background/40 flex items-center justify-center relative group p-1"
                >
                  {file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="h-full w-full object-cover rounded"
                    />
                  ) : (
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  )}
                  <button
                    type="button"
                    onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== idx))}
                    className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <span className="text-[8px] text-muted-foreground truncate w-full absolute bottom-0 bg-background/80 text-center px-0.5">
                    {file.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Notes Area */}
          <div className="bg-zinc-900/20 border border-border rounded-xl p-5 shadow-xs space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              {isBangla ? "বিশেষ মন্তব্য বা নোট" : "Note"}
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                isBangla
                  ? "ফেরত সংক্রান্ত তথ্য বা বিশেষ নোট লিখুন..."
                  : "Enter purchase return remarks, adjustments or audit notes..."
              }
              className="h-24 bg-background/50 border-input resize-none text-xs"
            />
          </div>
        </div>

        {/* Right Section: Refund Summary sticky card (3 columns on desktop) */}
        <div className="lg:col-span-3 lg:sticky lg:top-6 space-y-6">
          <div className="bg-zinc-900/20 border border-border rounded-xl p-5 space-y-4 shadow-xs">
            <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">
              {isBangla ? "ফেরত ও সমন্বয় বিবরণী" : "Refund & Calculation Summary"}
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>{isBangla ? "আইটেম উপমোট" : "Item Subtotal"}</span>
                <span className="font-semibold text-foreground">{formatCurrency(subtotal)}</span>
              </div>

              {/* Order Discount */}
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

              {/* Tax Percent */}
              <div className="flex justify-between items-center text-muted-foreground">
                <span>{isBangla ? "ট্যাক্স হার" : "Tax Percent"}</span>
                <div className="relative w-28 flex items-center">
                  <Input
                    type="number"
                    value={taxPercent || ""}
                    onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="h-8 text-right pr-6 bg-background/40 text-xs text-foreground font-semibold"
                    min="0"
                    max="100"
                  />
                  <span className="absolute right-2 text-[10px] font-medium text-muted-foreground">%</span>
                </div>
              </div>

              {/* Shipping Adjustment */}
              <div className="flex justify-between items-center text-muted-foreground">
                <span>{isBangla ? "পরিবহন খরচ সমন্বয়" : "Shipping Adjustment"}</span>
                <div className="relative w-28 flex items-center">
                  <span className="absolute left-2 text-[10px] font-medium text-muted-foreground">Tk.</span>
                  <Input
                    type="number"
                    value={shippingAdjustment || ""}
                    onChange={(e) => setShippingAdjustment(parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="h-8 text-right pl-6 bg-background/40 text-xs text-foreground font-semibold"
                  />
                </div>
              </div>

              {/* Additional Charges */}
              <div className="flex justify-between items-center text-muted-foreground">
                <span>{isBangla ? "অতিরিক্ত সমন্বয় খরচ" : "Additional Charges"}</span>
                <div className="relative w-28 flex items-center">
                  <span className="absolute left-2 text-[10px] font-medium text-muted-foreground">Tk.</span>
                  <Input
                    type="number"
                    value={additionalCharges || ""}
                    onChange={(e) => setAdditionalCharges(parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="h-8 text-right pl-6 bg-background/40 text-xs text-foreground font-semibold"
                  />
                </div>
              </div>

              {/* Grand Total */}
              <div className="flex justify-between items-center border-t border-border pt-3 text-sm font-bold">
                <span className="text-foreground">{isBangla ? "সর্বমোট ফেরতযোগ্য" : "Grand Total"}</span>
                <span className="text-primary text-base">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            {/* Split Options */}
            <div className="border-t border-border pt-3.5 space-y-3 text-xs">
              <span className="font-semibold text-foreground block">
                {isBangla ? "রিফান্ড বন্টন (Splits)" : "Refund Distributions"}
              </span>

              {/* Cash/Bank Amount */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] text-muted-foreground uppercase">{isBangla ? "নগদ / ব্যাংক ফেরত" : "Cash / Bank Refund"}</Label>
                  <button
                    type="button"
                    onClick={() => handleAutoFillSplit("refund")}
                    className="text-[9px] text-primary hover:underline font-semibold"
                  >
                    {isBangla ? "সবটুকুন" : "All"}
                  </button>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-2.5 text-[10px] text-muted-foreground">Tk.</span>
                  <Input
                    type="number"
                    value={refundAmount || ""}
                    onChange={(e) => setRefundAmount(parseFloat(e.target.value) || 0)}
                    className="h-8 text-right pl-7 bg-background/30 text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Supplier Credit Note */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] text-muted-foreground uppercase">{isBangla ? "সরবরাহকারী ক্রেডিট" : "Supplier Credit"}</Label>
                  <button
                    type="button"
                    onClick={() => handleAutoFillSplit("credit")}
                    className="text-[9px] text-primary hover:underline font-semibold"
                  >
                    {isBangla ? "সবটুকুন" : "All"}
                  </button>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-2.5 text-[10px] text-muted-foreground">Tk.</span>
                  <Input
                    type="number"
                    value={supplierCredit || ""}
                    onChange={(e) => setSupplierCredit(parseFloat(e.target.value) || 0)}
                    className="h-8 text-right pl-7 bg-background/30 text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Outstanding Due Adjustment */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] text-muted-foreground uppercase">{isBangla ? "বকেয়া সমন্বয়" : "Outstanding Due Adjustment"}</Label>
                  <button
                    type="button"
                    onClick={() => handleAutoFillSplit("adjustment")}
                    className="text-[9px] text-primary hover:underline font-semibold"
                  >
                    {isBangla ? "সবটুকুন" : "All"}
                  </button>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-2.5 text-[10px] text-muted-foreground">Tk.</span>
                  <Input
                    type="number"
                    value={paymentAdjustment || ""}
                    onChange={(e) => setPaymentAdjustment(parseFloat(e.target.value) || 0)}
                    className="h-8 text-right pl-7 bg-background/30 text-xs font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Refund Method & Accounts */}
            <div className="border-t border-border pt-3.5 space-y-3 text-xs">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-foreground">{isBangla ? "রিফান্ড পদ্ধতি" : "Refund Method"}</Label>
                <Select value={refundMethod} onValueChange={(val: any) => setRefundMethod(val)}>
                  <SelectTrigger className="h-9 bg-background/50 border-input text-xs font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">{isBangla ? "নগদ (Cash)" : "Cash"}</SelectItem>
                    <SelectItem value="bank">{isBangla ? "ব্যাংক (Bank Transfer)" : "Bank Transfer"}</SelectItem>
                    <SelectItem value="card">{isBangla ? "কার্ড (Card)" : "Card"}</SelectItem>
                    <SelectItem value="bkash">bKash</SelectItem>
                    <SelectItem value="nagad">Nagad</SelectItem>
                    <SelectItem value="rocket">Rocket</SelectItem>
                    <SelectItem value="wallet">{isBangla ? "ডিজিটাল ওয়ালেট" : "Digital Wallet"}</SelectItem>
                    <SelectItem value="supplier_credit">{isBangla ? "ক্রেডিট নোট" : "Supplier Credit"}</SelectItem>
                    <SelectItem value="due_adjustment">{isBangla ? "বকেয়া সমন্বয়" : "Due Adjustment"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {refundMethod !== "cash" && refundMethod !== "supplier_credit" && refundMethod !== "due_adjustment" && (
                <div className="space-y-1">
                  <Label className="text-[10px] font-semibold text-muted-foreground uppercase">{isBangla ? "রিফান্ড অ্যাকাউন্ট" : "Refund Account"}</Label>
                  <Select value={accountId} onValueChange={setAccountId}>
                    <SelectTrigger className="h-9 bg-background/50 border-input text-xs font-medium">
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
              )}
            </div>

            {/* Bottom Actions inside Sticky Panel */}
            <div className="space-y-2 pt-3 border-t border-border">
              <Button
                type="button"
                onClick={() => handleSubmitWithStatus(returnStatus, "redirect")}
                disabled={isSubmitting}
                className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center justify-center gap-1.5 cursor-pointer text-xs"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>{isBangla ? "সংরক্ষণ হচ্ছে..." : "Saving..."}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>{isBangla ? "সম্পূর্ণ ফেরত দিন" : "Complete Return"}</span>
                  </>
                )}
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSubmitWithStatus("draft", "clear")}
                  disabled={isSubmitting}
                  className="h-9 text-xs border-input hover:bg-muted font-medium cursor-pointer"
                >
                  {isBangla ? "খসড়া রাখুন" : "Save Draft"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSubmitWithStatus("pending", "clear")}
                  disabled={isSubmitting}
                  className="h-9 text-xs border-input hover:bg-muted font-medium cursor-pointer"
                >
                  {isBangla ? "অনুমোদন ও নতুন" : "Save & New"}
                </Button>
              </div>

              <Button
                type="button"
                variant="secondary"
                onClick={() => handleSubmitWithStatus(returnStatus, "print")}
                disabled={isSubmitting}
                className="w-full h-9 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText className="h-4 w-4" />
                <span>{isBangla ? "প্রিন্ট করুন" : "Save & Print"}</span>
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
                  <span>{isBangla ? "এআই ফেরত বুদ্ধি" : "AI Return Insights"}</span>
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

export default function NewPurchaseReturnPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <NewPurchaseReturnContent />
    </Suspense>
  );
}
