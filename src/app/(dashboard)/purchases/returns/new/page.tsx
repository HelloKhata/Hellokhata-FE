// Hello Khata OS - Purchase Return Page
// হ্যালো খাতা - নতুন ক্রয় ফেরত পেজ

"use client";

import  { useState, useMemo, Suspense, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Trash2,
  Calendar as CalendarIcon,
  X,
  ArrowLeft,
  Loader2,
  RotateCcw,
  Search,
  Sparkles,
  CheckCircle,
  Receipt,
  Upload,
} from "lucide-react";
import { useCurrency, useAppTranslation } from "@/hooks/useAppTranslation";
import { useUser } from "@/stores/sessionStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useReturnPurchase } from "@/hooks/api/useReturns";
import { useGetPurchases, useGetPurchaseById } from "@/hooks/api/usePurchases";
import { useAccounts } from "@/hooks/queries";
import { useParty } from "@/hooks/api/useParties";

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
  isSelected?: boolean;
}

function NewPurchaseReturnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supplierIdParam = searchParams.get("supplierId") || "";
  const purchaseIdParam = searchParams.get("purchaseId") || "";

    // purchased items
  const [purchase,setPurchase] = useState<any>(null);

  // Return items table state
  const [purchasedItems, setPurchasedItems] = useState<ReturnItemRow[]>([]);
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const { mutate: returnPurchase, isPending: isSubmitting } = useReturnPurchase();
  const user = useUser();

  // Queries
  // const { data: branches = [] } = useBranches();
  const { data: accounts = [] } = useAccounts();
  
  // Selected Purchase & Supplier state
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(supplierIdParam);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<string>(purchaseIdParam);

  // Search queries for supplier, invoice, product search
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState("");
  const [showInvoiceSuggestions,setShowInvoiceSuggestions] = useState(false);
 
  useEffect(() => {
      if (!purchase) {
        setPurchasedItems([])
      return
    }
      const initialItems: ReturnItemRow[] = purchase.items.map((item: any) => ({
        id: item?.id,
        purchaseItemId: item?.id,
        itemId: item?.productId || item?.itemId || item?.id,
        itemName: item?.itemName || item?.name || "",
        sku: item?.sku || "—",
        batchNo: item?.batchNo || "",
        quantity: item?.remainingQuantity ?? item?.quantity ?? 1,
        maxQuantity: item?.quantity ?? item?.remainingQuantity ?? 1,
        remainingQuantity: item?.remainingQuantity ?? item?.quantity ?? 1,
        unitCost: item?.unitCost ?? item?.rate ?? 0,
        unit: item?.unit || "pcs",
        returnType: "refund",
        reason: "damaged",
        total: (item?.remainingQuantity ?? item?.quantity ?? 1) * (item?.unitCost ?? item?.rate ?? 0),
        searchQuery: "",
        showSuggestions: false,
        imageUrl: item?.imageUrl || "",
        isSelected: false,
      }));
      setPurchasedItems(initialItems);
    
  }, [purchase]);

  const { data: singleSupplierData } = useParty(selectedSupplierId, {
    enabled: !!selectedSupplierId,
  });

  const { data: purchaseData = [] } = useGetPurchases({search:invoiceSearchQuery});
  const { data: singlePurchaseData } = useGetPurchaseById(selectedPurchaseId);
  const [returnNo, setReturnNo] = useState("");

  const [returnDate, setReturnDate] = useState<Date>(new Date());
  const [responsiblePerson, setResponsiblePerson] = useState("");
  const [referenceNo, setReferenceNo] = useState("");
  const [returnStatus, setReturnStatus] = useState<"draft" | "pending" | "approved" | "completed" | "cancelled">("completed");

  
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
  const [invoiceImage, setInvoiceImage] = useState<File | null>(null);
  const [invoiceImagePreview, setInvoiceImagePreview] = useState<string | null>(null);

  const handleInvoiceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInvoiceImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setInvoiceImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveInvoiceImage = () => {
    setInvoiceImage(null);
    setInvoiceImagePreview(null);
  };

  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);

  // Financial calculations
  const subtotal = useMemo(() => {
    return purchasedItems?.reduce((sum, item) => sum + (item?.isSelected ? item?.quantity * item?.unitCost : 0), 0);
  }, [purchasedItems]);

  const taxAmount = useMemo(() => {
    return Math.max(0, (subtotal - orderDiscount) * (taxPercent / 100));
  }, [subtotal, orderDiscount, taxPercent]);

  const grandTotal = useMemo(() => {
    return Math.max(0, subtotal - orderDiscount + taxAmount + shippingAdjustment + additionalCharges);
  }, [subtotal, orderDiscount, taxAmount, shippingAdjustment, additionalCharges]);

  const updateQuantity = (id: string, quantity: number) => {
    setPurchasedItems((prev) =>
      prev.map((item) => {
        if (item?.id === id) {
          const newQty = Math.max(0, quantity);
          return {
            ...item,
            quantity: newQty,
            total: newQty * item?.unitCost,
          };
        }
        return item;
      }),
    );
  };

  const updateItemField = (id: string, field: keyof ReturnItemRow, value: any) => {
    setPurchasedItems((prev) =>
      prev.map((item) => {
        if (item?.id === id) {
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
    const itemsToReturn = purchasedItems.filter((i) => i.isSelected && (i.itemId !== "" || i.itemName !== "") && i.quantity > 0);

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
      // branchId,
      responsiblePerson,
      referenceNo,
      status,
      items: itemsToReturn.map((item) => ({
        purchaseItemId: item?.purchaseItemId,
        itemId: item?.itemId,
        itemName: item?.itemName,
        quantity: item?.quantity,
        unitCost: item?.unitCost,
        returnType: item?.returnType,
        reason: item?.reason,
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
          setPurchasedItems([]);
          setNotes("");
          setReferenceNo("");
        } else if (andThen === "print") {
          window.print();
          router.push("/purchases/returns");
        } else {
          router.push("/purchases/returns");
        }
      },
    });
  };

  const returnTypes = [
    { value: "refund", label: isBangla ? "রিফান্ড (Refund)" : "Refund" },
    { value: "replacement", label: isBangla ? "প্রতিস্থাপন (Replacement)" : "Replacement" },
    { value: "exchange", label: isBangla ? "বিনিময় (Exchange)" : "Exchange" },
    { value: "warranty", label: isBangla ? "ওয়ারেন্টি (Warranty)" : "Warranty" }
  ];

  const returnReasons = [
    { value: "damaged", label: isBangla ? "ক্ষতিগ্রস্ত (Damaged)" : "Damaged" },
    { value: "expired", label: isBangla ? "মেয়াদোত্তীর্ণ (Expired)" : "Expired" },
    { value: "wrong_product", label: isBangla ? "ভুল পণ্য (Wrong Product)" : "Wrong Product" },
    { value: "wrong_quantity", label: isBangla ? "ভুল পরিমাণ (Wrong Quantity)" : "Wrong Quantity" },
    { value: "defective", label: isBangla ? "ত্রুটিপূর্ণ (Defective)" : "Defective" }
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
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground h-9 px-3"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {isBangla ? "পেছনে" : "Back"}
        </Button>
      </div>

      {/* Main Purchase Invoice Card */}
      <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm space-y-4">
        {/* Card Header & Invoice Change Button */}
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Receipt className="h-4 w-4" />
            <span>{isBangla ? "ক্রয় ইনভয়েস" : "Purchase Invoice"}</span>
          </div>
        </div>

        {/* 4-Column Grid: Purchase Invoice, Supplier(disable), Purchase Date(disable), Return Date */}
        <div className={cn("grid grid-cols-1 gap-4 items-end", purchase ? "md:grid-cols-2 lg:grid-cols-4" : "")}>
          {/* Field 1 (25%): Purchase Invoice */}
          <div className="relative space-y-1.5">
            <Label className="text-xs font-medium text-foreground">
              {isBangla ? "ক্রয় ইনভয়েস" : "Purchase Invoice"}
            </Label>
            <div className="relative">
              <Input
                value={invoiceSearchQuery}
                onChange={(e) => {
                  setInvoiceSearchQuery(e.target.value);
                  // if (selectedPurchaseId) setSelectedPurchaseId("");
                  setShowInvoiceSuggestions(true);
                }}
                onFocus={() => setShowInvoiceSuggestions(true)}
                onBlur={() => {
                  setShowInvoiceSuggestions(false)
                }}
                placeholder={
                  isBangla
                    ? "ইনভয়েস নম্বর দিয়ে খুঁজুন..."
                    : "Search purchase invoice number..."
                }
                className="pr-10 h-11 bg-background/50 border-input focus-visible:ring-1 text-sm font-medium w-full"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

              {showInvoiceSuggestions && (
                <div className="absolute z-50 left-0 top-full mt-1 w-full bg-card border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto divide-y divide-border">
                  {purchaseData.length === 0 ? (
                    <div className="p-3 text-center text-sm text-muted-foreground">
                      {isBangla
                        ? "কোনো ইনভয়েস পাওয়া যায়নি"
                        : "No invoices found"}
                    </div>
                  ) : (
                    purchaseData.map((purchase: any) => (
                      <button
                        key={purchase.id}
                        type="button"
                        className="w-full text-left p-3 hover:bg-muted/80 text-sm transition-colors flex justify-between items-center"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setPurchase(purchase);
                          setInvoiceSearchQuery(purchase.grnNo)
                          setShowInvoiceSuggestions(false);
                        }}

                        onClick={() =>{ setPurchase(purchase); setInvoiceSearchQuery(purchase.grnNo)}}
                      >
                        <div>
                          <p className="font-semibold text-foreground">
                            {purchase.grnNo || ''}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {purchase.supplier?.name || "Supplier"}
                          </p>
                        </div>
                        <span className="font-bold text-xs text-primary">
                          {formatCurrency(purchase.total)}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {!!purchase && (
            <>
              {/* Field 2 (25%): Supplier (Non-editable) */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  {isBangla ? "সরবরাহকারী" : "Supplier"}
                </Label>
                <Input
                  readOnly
                  disabled
                  value={
                    purchase?.supplier?.name  || purchase?.name || "—"
                  }
                  placeholder={isBangla ? "ইনভয়েস নির্বাচন করুন" : "Select invoice"}
                  className="h-11 bg-muted/40 border-input text-sm font-bold text-foreground cursor-not-allowed disabled:opacity-80"
                />
              </div>

              {/* Field 3 (25%): Purchase Date (Non-editable) */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  {isBangla ? "ক্রয় তারিখ" : "Purchase Date"}
                </Label>
                <Input
                  readOnly
                  disabled
                  value={
                    purchase?.createdAt
                      ? format(new Date(purchase.createdAt), "dd MMM yyyy")
                      : ""
                  }
                  placeholder={isBangla ? "ইনভয়েস নির্বাচন করুন" : "Select invoice"}
                  className="h-11 bg-muted/40 border-input text-sm font-semibold text-foreground cursor-not-allowed disabled:opacity-80"
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
            </>
          )}
        </div>
      </div>

      {/* IF NO INVOICE IS SELECTED: SHOW EMPTY PLACEHOLDER CARD */}
      {!purchase ? (
        <div className="bg-card/50 border border-dashed border-border rounded-xl p-12 text-center space-y-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Receipt className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-foreground">
            {isBangla ? "কোনো ক্রয় ইনভয়েস নির্বাচন করা হয়নি" : "No Purchase Invoice Selected"}
          </h3>
          <p className="text-xs text-muted-foreground mx-auto">
            {isBangla
              ? "ক্রয় ফেরত প্রক্রিয়া শুরু করতে উপরে যেকোনো মূল ক্রয় ইনভয়েস সার্চ করে সিলেক্ট করুন।"
              : "Please search and select an original purchase invoice above to view purchase details, product info, and process return items."}
          </p>
        </div>
      ) : (
        /* Main 12-column grid layout (Shown when invoice is selected) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Section (Spans 9 columns on desktop) */}
        <div className="lg:col-span-9 space-y-6">
          {/* Section 3: Return Items List Table */}
          <div className="bg-zinc-900/20 border border-border rounded-xl overflow-hidden shadow-xs space-y-4">
            {/* Purchase Billing Info Text in sm text at the top of table */}
            {purchase && (
              <div className="px-4 py-2.5 bg-muted/40 border-b border-border/50 flex flex-wrap items-center justify-between gap-3 text-xs font-medium">
                <div className="flex items-center gap-2 flex-wrap text-muted-foreground text-xs">
                  <span className="font-bold text-foreground">
                    {isBangla ? "ক্রয় ইনভয়েস তথ্য:" : "Purchase Billing Info:"}
                  </span>
                </div>

                <div className="flex items-center gap-3.5 flex-wrap text-xs">
                  <span>
                    {isBangla ? "মোট ইনভয়েস:" : "Total:"}{" "}
                    <strong className="font-bold text-foreground">
                      {formatCurrency(purchase.total || 0)}
                    </strong>
                  </span>
                  <span>
                    {isBangla ? "পরিশোধিত:" : "Paid:"}{" "}
                    <strong className="font-bold text-emerald-500">
                      {formatCurrency(
                        purchase.paidAmount ||  0
                      )}
                    </strong>
                  </span>
                  <span>
                    {isBangla ? "বাকি:" : "Due:"}{" "}
                    <strong className="font-bold text-rose-500">
                      {formatCurrency(
                        purchase?.dueAmount || 0
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

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-border/80 bg-muted/20 text-muted-foreground font-semibold">
                    <th className="px-4 py-3">{isBangla ? "আইটেম বিবরণ" : "Item & SKU"}</th>
                    <th className="px-3 py-3 text-right">{isBangla ? "মূল্য" : "Purchase Price"}</th>
                    <th className="px-3 py-3 text-center">{isBangla ? "ক্রয় পরিমাণ" : "Purchase Qty"}</th>
                    <th className="px-4 py-3 text-center w-28">{isBangla ? "ফেরত পরিমাণ *" : "Return Qty *"}</th>
                    <th className="px-3 py-3">{isBangla ? "ফেরত টাইপ" : "Return Type"}</th>
                    <th className="px-3 py-3">{isBangla ? "কারণ" : "Reason"}</th>
                    <th className="px-3 py-3 text-right">{isBangla ? "মোট" : "Total"}</th>
                    <th className="px-4 py-3 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
            
                  {purchasedItems?.map((item) => (
                    <tr 
                      key={item?.id} 
                      className={cn(
                        "hover:bg-muted/20 transition-colors cursor-pointer",
                        item?.isSelected ? "bg-primary/5" : ""
                      )}
                      onClick={() => updateItemField(item?.id, "isSelected", !item?.isSelected)}
                    >
                      <td className="px-4 py-3.5 align-middle">
                        <p className="font-semibold text-foreground text-xs leading-tight">{item?.itemName || (isBangla ? "পণ্য নির্বাচন করুন" : "Select Product")}</p>
                        <p className="text-[10px] text-muted-foreground">SKU: {item?.sku}</p>
                      </td>
                      <td className="px-3 py-3.5 align-middle text-right font-medium text-foreground">
                        {formatCurrency(item?.unitCost)}
                      </td>
                      <td className="px-3 py-3.5 align-middle text-center text-muted-foreground font-medium">
                        {item?.maxQuantity} {item?.unit}
                      </td>
                      <td className="px-4 py-3.5 align-middle">
                        <div className="flex items-center border border-input rounded bg-background/50 h-8 w-24 mx-auto" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item?.id, item?.quantity - 1)}
                            className="h-full px-2 text-muted-foreground hover:text-foreground active:bg-muted/20"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={item?.quantity || 0}
                            onChange={(e) => updateQuantity(item?.id, parseInt(e.target.value) || 0)}
                            className="w-full text-center h-full bg-transparent outline-none border-none text-xs font-semibold text-foreground [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <button
                            type="button"
                            onClick={() => updateQuantity(item?.id, item?.quantity + 1)}
                            className="h-full px-2 text-muted-foreground hover:text-foreground active:bg-muted/20"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 align-middle">
                        <div onClick={(e) => e.stopPropagation()}>
                          <Select
                            value={item?.returnType}
                            onValueChange={(val: any) => updateItemField(item?.id, "returnType", val)}
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
                        </div>
                      </td>
                      <td className="px-3 py-3.5 align-middle">
                        <div onClick={(e) => e.stopPropagation()}>
                          <Select
                            value={item?.reason}
                            onValueChange={(val: any) => updateItemField(item?.id, "reason", val)}
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
                        </div>
                      </td>
                      <td className="px-3 py-3.5 align-middle text-right font-bold text-foreground">
                        {formatCurrency(item?.quantity * item?.unitCost)}
                      </td>
                      <td className="px-4 py-3.5 align-middle text-right">
                        <div onClick={(e) => e.stopPropagation()} className="inline-flex items-center justify-center">
                          <Checkbox
                            checked={item?.isSelected}
                            onCheckedChange={(checked) => updateItemField(item?.id, "isSelected", !!checked)}
                            className="h-[18px] w-[18px] border-2 border-primary/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom summary bar */}
            <div className="flex justify-end items-center px-5 py-3.5 bg-muted/10 border-t border-border">
             
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

          {/* Notes & Invoice Image Upload Card */}
          <div className="bg-zinc-900/20 border border-border rounded-xl p-5 shadow-xs space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Remarks/Notes */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  {isBangla ? "মন্তব্য বা বিশেষ নির্দেশনা" : "Remarks or Special Notes"}
                </Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    isBangla
                      ? "অতিরিক্ত বিবরণ লিখুন..."
                      : "Enter additional purchase remarks..."
                  }
                  className="h-32 bg-background/50 border-input resize-none text-xs"
                />
              </div>

              {/* Invoice Image Upload */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  {isBangla ? "ইনভয়েস বা রসিদের ছবি" : "Invoice / Receipt Image"}
                </Label>
                {invoiceImagePreview ? (
                  <div className="relative h-32 w-full rounded-lg border border-border bg-background/50 overflow-hidden flex items-center justify-center group">
                    <img
                      src={invoiceImagePreview}
                      alt="Invoice preview"
                      className="h-full w-full object-contain p-1"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={handleRemoveInvoiceImage}
                        className="p-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full transition-colors cursor-pointer shadow-xs"
                        title={isBangla ? "মুছে ফেলুন" : "Remove Image"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="h-32 w-full rounded-lg border-2 border-dashed border-input hover:border-primary/60 bg-background/30 hover:bg-background/50 flex flex-col items-center justify-center cursor-pointer transition-colors p-4 text-center">
                    <Upload className="h-6 w-6 text-muted-foreground mb-1.5" />
                    <span className="text-xs font-semibold text-foreground">
                      {isBangla ? "ইনভয়েস ছবি আপলোড করুন" : "Upload Invoice Image"}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">
                      PNG, JPG, WEBP ({isBangla ? "সর্বোচ্চ ৫ মেগাবাইট" : "Max 5MB"})
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleInvoiceImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Refund Summary sticky card (3 columns on desktop) */}
        <div className="lg:col-span-3 lg:sticky lg:top-6 space-y-6">
          <div className="bg-zinc-900/20 border border-border rounded-xl p-5 space-y-4 shadow-xs">
            <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">
              {isBangla ? "ফেরত বিবরণী" : "Refund Summary"}
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>{isBangla ? "আইটেম উপমোট" : "Item Subtotal"}</span>
                <span className="font-semibold text-foreground">{formatCurrency(subtotal)}</span>
              </div>

              {/* Order Discount */}
              <div className="flex justify-between items-center text-muted-foreground pt-1.5 border-t border-border/40">
                <span>{isBangla ? "ছাড়" : "Discount"}</span>
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
                <span>{isBangla ? "ট্যাক্স" : "Tax"}</span>
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

           

              {/* Grand Total */}
              <div className="flex justify-between items-center border-t border-border pt-3 text-sm font-bold">
                <span className="text-foreground">{isBangla ? "সর্বমোট ফেরতযোগ্য" : "Grand Total"}</span>
                <span className="text-primary text-base">{formatCurrency(grandTotal)}</span>
              </div>
            </div>


            {/* Refund Method & Accounts */}
            <div className="flex items-center justify-between border-t border-border pt-3.5 space-y-3 text-xs">
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
            </div>
          )}
        </div>
      </div>
      )}
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
