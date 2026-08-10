// Hello Khata OS - New Purchase Page
// হ্যালো খাতা - নতুন ক্রয় পেজ

"use client";

import { useState, useMemo, Suspense, useEffect, Fragment } from "react";
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
  Banknote,
  CreditCard,
  Smartphone,
  Receipt,
  ChevronRight,
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
  Layers,
  Barcode,
  Package,
  Upload,
  Settings,
  Eye,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useCurrency, useDateFormat } from "@/hooks/useAppTranslation";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useGetItems } from "@/hooks/api/useItems";
import { AddPartyModal } from "@/components/parties/AddPartyModal";
import { InventoryItemForm } from "@/components/inventory/InventoryItemForm";
import { useParties, useParty } from "@/hooks/api/useParties";
import { useCreatePurchases, useGetPurchases } from "@/hooks/api/usePurchases";
import { getBatches } from "@/services/batches.services";
import { useBranches, useAccounts } from "@/hooks/queries";
import { useUser } from "@/stores/sessionStore";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PaymentRow {
  id: string;
  method: "cash" | "bank" | "mobile_banking";
  accountId: string;
  reference: string;
  transactionId: string;
  receivedBy?: string;
  amount: number;
  date: Date;
}

interface BillingItemRow {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unitCost: number;
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

const METHODS = [
  { id: "cash", label: "Cash", icon: Banknote, accent: "var(--emerald-500)", colorClass: "text-emerald-500", bgClass: "bg-emerald-500/10", borderClass: "border-emerald-500/20" },
  { id: "bank", label: "Bank/Card", icon: CreditCard, accent: "var(--blue-500)", colorClass: "text-blue-500", bgClass: "bg-blue-500/10", borderClass: "border-blue-500/20" },
  { id: "mobile_banking", label: "Mobile Banking", icon: Smartphone, accent: "var(--orange-500)", colorClass: "text-orange-500", bgClass: "bg-orange-500/10", borderClass: "border-orange-500/20" },
];

const MOBILE_PROVIDERS = [
  { id: "bkash", label: "bKash", color: "#E2136E", logo: "/images/bkash.png" },
  { id: "nagad", label: "Nagad", color: "#EE7623", logo: "/images/nagad.png" },
  { id: "rocket", label: "Rocket", color: "#8C52E0", logo: "/images/rocket.png" },
];

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

  console.log(suppliers)
  const { data: branches = [{id:1, name:'Main'},{id:2, name:'Sub Branch'}] } = useBranches();
  const { data: accounts = [] } = useAccounts();
  const { data: purchases = [] } = useGetPurchases();

  // Form State
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(supplierIdParam);
  const { data: singleSupplierData } = useParty(selectedSupplierId, {
    enabled: !!selectedSupplierId,
  });
  const [showSupplierSuggestions, setShowSupplierSuggestions] = useState(false);

  // Top Product Search & Selection State
  const [topProductSearchQuery, setTopProductSearchQuery] = useState("");
  const [showTopProductSuggestions, setShowTopProductSuggestions] = useState(false);
  const [selectedSearchProduct, setSelectedSearchProduct] = useState<any | null>(null);

  const [invoiceDate, setInvoiceDate] = useState<Date>(new Date());
  const [purchaseType, setPurchaseType] = useState<string>("in_store");
  const [warehouseId, setWarehouseId] = useState<string>("");
  const [responsiblePerson, setResponsiblePerson] = useState<string>("");
  const [referenceNo, setReferenceNo] = useState<string>("");
  // Store branches vs Warehouses lists
  const storeBranches = useMemo(() => {
    const filtered = branches.filter((b: any) => b.type !== "warehouse");
    return filtered.length > 0 ? filtered : branches;
  }, [branches]);

  // Find main branch
  const defaultMainBranch = useMemo(() => {
    if (!storeBranches || storeBranches.length === 0) return { id: "", name: "" };
    const found = storeBranches.find((b: any) => b.isMain || b.type === "main" || b.name?.toLowerCase().includes("main")) || storeBranches[0];
    return { id: String(found.id), name: found.name };
  }, [storeBranches]);

  const [branch, setBranch] = useState<{ name: string; id: string }>({ name: "", id: "" });
  console.log("branch", branch);
  const warehousesList = useMemo(() => {
    const filtered = branches.filter((b: any) => b.type === "warehouse");
    if (filtered.length > 0) return filtered;
    return [
      { id: "wh-main", name: isBangla ? "কেন্দ্রীয় ডিস্ট্রিবিউশন ওয়্যারহাউস (WH-MAIN)" : "Central Distribution Warehouse (WH-MAIN)" },
      { id: "wh-dhaka", name: isBangla ? "ঢাকা ওয়্যারহাউস (WH-DHK)" : "Dhaka Central Warehouse (WH-DHK)" },
      { id: "wh-ctg", name: isBangla ? "চট্টগ্রাম ডিস্ট্রিবিউশন হাব (WH-CTG)" : "Chittagong Hub Warehouse (WH-CTG)" },
    ];
  }, [branches, isBangla]);

  // Set default values from session user & warehouses
  const userBranchId = user?.branchId;
  const userName = user?.name;
  useEffect(() => {
    if (defaultMainBranch.id && !branch.id) {
      setBranch(defaultMainBranch);
    }
    if (userName && !responsiblePerson) setResponsiblePerson(userName);
    if (warehousesList.length > 0 && !warehouseId) setWarehouseId(String(warehousesList[0].id));
  }, [defaultMainBranch, branch.id, userName, responsiblePerson, warehousesList, warehouseId]);

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

  // Payment states
  const [payments, setPayments] = useState<PaymentRow[]>([
    {
      id: "pay-initial",
      method: "cash",
      accountId: "",
      reference: "",
      transactionId: "",
      receivedBy: "",
      amount: 0,
      date: new Date(),
    },
  ]);
  const [splitMode, setSplitMode] = useState(false);
  const [activeSplitMethod, setActiveSplitMethod] = useState<string>("cash");

  // Order summary adjustments
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

  // Track open Expiry Settings row ID
  const [openExpiryRowId, setOpenExpiryRowId] = useState<string | null>(null);

  // Modals for "+ Add New" Item and Supplier
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);

  // Close expiry settings when clicking outside or empty spaces
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-expiry-container]")) {
        if (openExpiryRowId) {
          const activeItem = selectedItems.find((i) => i.id === openExpiryRowId);
          if (activeItem && activeItem.trackExpiry && !activeItem.expiryDate) {
            toast.error(
              isBangla
                ? `"${activeItem.itemName}"-এর মেয়াদের তারিখ নির্বাচন করা আবশ্যক`
                : `Expiry date is required for "${activeItem.itemName}"`
            );
            return;
          }
        }
        setOpenExpiryRowId(null);
      }
    };

    if (openExpiryRowId) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openExpiryRowId, selectedItems, isBangla]);

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
    const supplier = suppliers.find((p: any) => String(p.id) === String(selectedSupplierId));
    if (supplier) return supplier.name;
    if (singleSupplierData?.data && String(singleSupplierData.data.id) === String(selectedSupplierId)) {
      return singleSupplierData.data.name;
    }
    return "";
  }, [suppliers, selectedSupplierId, singleSupplierData]);

  // Calculations
  const subtotal = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + (item.quantity || 0) * (item.unitCost || 0), 0);
  }, [selectedItems]);

  const itemTax = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + (item.taxAmount || 0), 0);
  }, [selectedItems]);

  const grandTotal = useMemo(() => {
    const finalTotal = subtotal + itemTax + shippingCost + additionalCharges;
    return Math.max(0, finalTotal);
  }, [subtotal, itemTax, shippingCost, additionalCharges]);

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


  const handleRowChange = (id: string, field: keyof BillingItemRow, value: any) => {
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };

          let qty = item.quantity;
          let cost = item.unitCost;
          let taxPct = item.taxPercent;
          let taxAmt = item.taxAmount;
          let total = item.total;

          if (field === "quantity") {
            qty = parseFloat(value) || 0;
            const baseTotal = qty * cost;
            taxAmt = Math.max(0, baseTotal) * (taxPct / 100);
            total = parseFloat((baseTotal + taxAmt).toFixed(2));
          } else if (field === "unitCost") {
            cost = parseFloat(value) || 0;
            const baseTotal = qty * cost;
            taxAmt = Math.max(0, baseTotal) * (taxPct / 100);
            total = parseFloat((baseTotal + taxAmt).toFixed(2));
          } else if (field === "taxPercent") {
            taxPct = parseFloat(value) || 0;
            const baseTotal = qty * cost;
            taxAmt = Math.max(0, baseTotal) * (taxPct / 100);
            total = parseFloat((baseTotal + taxAmt).toFixed(2));
          } else if (field === "total") {
            const newTotal = parseFloat(value) || 0;
            total = newTotal;
            const baseTotal = taxPct > 0 ? newTotal / (1 + taxPct / 100) : newTotal;
            taxAmt = newTotal - baseTotal;
            cost = qty > 0 ? parseFloat((baseTotal / qty).toFixed(2)) : 0;
          }

          return {
            ...updated,
            quantity: qty,
            unitCost: cost,
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

  const handleSelectProductFromTopSearch = async (product: any) => {
    // Check if any existing item has Track Expiry ON but no expiry date selected
    const invalidItem = selectedItems.find((i) => i.itemId && i.trackExpiry && !i.expiryDate);
    if (invalidItem) {
      setOpenExpiryRowId(invalidItem.id);
      toast.error(
        isBangla
          ? `নতুন পণ্য যোগ করার আগে "${invalidItem.itemName}"-এর মেয়াদের তারিখ সিলেক্ট করুন`
          : `Please select expiry date for "${invalidItem.itemName}" before adding a new item`
      );
      return;
    }

    setTopProductSearchQuery("");
    setShowTopProductSuggestions(false);
    setSelectedSearchProduct(null);

    const qty = 1;
    const unitCost = product.costPrice || product.purchasePrice || 0;
    const taxPct = product.taxPercent || 0;

    let availableBatches: any[] = [];
    try {
      const res = await getBatches({ itemId: product.id, status: 'active', limit: 50 });
      availableBatches = res?.data || [];
    } catch {
      // Fallback
    }

    const selectedBatchObj = availableBatches[0];
    const batchNo = selectedBatchObj?.batchNumber || "";
    const baseTotal = qty * unitCost;
    const taxAmt = Math.max(0, baseTotal) * (taxPct / 100);
    const total = Math.max(0, baseTotal + taxAmt);

    setSelectedItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.itemId === product.id && (batchNo ? item.batchNumber === batchNo : true)
      );

      if (existingIndex !== -1) {
        return prev.map((item, index) => {
          if (index === existingIndex) {
            const newQty = item.quantity + 1;
            const newBase = newQty * unitCost;
            const newTaxAmt = Math.max(0, newBase) * (item.taxPercent / 100);
            const newTotal = Math.max(0, newBase + newTaxAmt);
            return {
              ...item,
              quantity: newQty,
              unitCost: unitCost,
              taxAmount: newTaxAmt,
              total: newTotal,
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
        quantity: qty,
        unitCost: unitCost,
        taxPercent: taxPct,
        taxAmount: taxAmt,
        total: total,
        searchQuery: "",
        showSuggestions: false,
        trackBatch: false,
        batchNumber: batchNo,
        trackExpiry: false,
        manufactureDate: undefined,
        expiryDate: undefined,
        rowNote: "",
        isExpanded: false,
        lastPurchasePrice: product.lastPurchasePrice || unitCost,
        averageCost: product.averageCost || unitCost,
      };

      if (hasSingleEmptyRow) {
        return [newRow];
      }

      return [...prev, newRow];
    });

    toast.success(
      isBangla
        ? `${product.name} সফলভাবে টেবিলে যোগ করা হয়েছে`
        : `Added ${product.name} to items table`
    );
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
        if (item.trackExpiry && !item.expiryDate) {
          newErrors[`expiry-${item.id}`] = isBangla ? `"${item.itemName}"-এর মেয়াদের তারিখ নির্বাচন করা আবশ্যক` : `Expiry date is required for "${item.itemName}"`;
          setOpenExpiryRowId(item.id);
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
      branchId: purchaseType === "warehouse" ? (warehouseId || undefined) : (branch.id || undefined),
      allocationMethod: "VALUE",
      additionalCharges: additionalCharges || 0,
      shippingCost: shippingCost || 0,
      purchaseDate: format(invoiceDate, "yyyy-MM-dd"),
      purchaseType: purchaseType === "warehouse" ? "WAREHOUSE" : "INSTORE",
      warehouseId: purchaseType === "warehouse" ? (warehouseId || undefined) : undefined,
      supplierId: selectedSupplierId || undefined,
      invoiceNo: referenceNo || undefined,
      grnNo: referenceNo || undefined,
      items: validItems.map((item) => ({
        itemId: item.itemId,
        itemName: item.itemName,
        quantity: item.quantity || 0,
        unitCost: item.unitCost || 0,
        tax: item.taxPercent || 0,
        batchId: undefined,
        trackBatch: item.trackBatch || false,
        batchNumber: item.batchNumber || undefined,
        expiryDate: item.expiryDate ? item.expiryDate.toISOString() : undefined,
        manufactureDate: item.manufactureDate ? item.manufactureDate.toISOString() : undefined,
        warrantyDays: 0,
        mrp: item.unitCost || 0,
        location: undefined,
        weight: 0,
        volume: 0,
        manualAllocatedCost: 0,
      })),
      discount: 0,
      tax: itemTax || 0,
      status: "received",
      paidAmount: totalPaid || 0,
      paymentMethod: payments.filter((p) => p.amount > 0).map((p) => ({
        paymentId: p.id,
        paymentType: p.method,
        amount: p.amount || 0,
        referenceNumber: p.reference || undefined,
        txnId: p.transactionId || undefined,
      })),
      accountId: payments.length > 0 ? (payments[0].accountId || undefined) : undefined,
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

  const toggleSplitMode = () => {
    if (splitMode) {
      // Revert to single payment mode
      setPayments([
        {
          id: Math.random().toString(),
          method: "cash",
          accountId: "",
          reference: "",
          transactionId: "",
          receivedBy: "",
          amount: grandTotal,
          date: new Date(),
        },
      ]);
    } else {
      setActiveSplitMethod("cash");
      // Enter split mode
      setPayments([
        {
          id: "cash-split",
          method: "cash",
          accountId: "",
          reference: "",
          transactionId: "",
          receivedBy: "",
          amount: grandTotal,
          date: new Date(),
        },
        {
          id: "bank-split",
          method: "bank",
          accountId: "",
          reference: "",
          transactionId: "",
          receivedBy: "",
          amount: 0,
          date: new Date(),
        },
        {
          id: "mobile-split",
          method: "mobile_banking",
          accountId: "",
          reference: "",
          transactionId: "",
          receivedBy: "",
          amount: 0,
          date: new Date(),
        }
      ]);
    }
    setSplitMode(!splitMode);
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
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/80">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
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
          className="text-muted-foreground hover:text-foreground h-9 px-3 text-xs sm:text-sm ml-auto sm:ml-0"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {isBangla ? "পেছনে" : "Back"}
        </Button>
      </div>

      {/* Merged Purchase Information Card */}
      <div className="bg-zinc-900/20 border border-border rounded-xl p-5 space-y-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2.5">
          <span className="text-sm font-semibold text-foreground">
            {isBangla ? "ক্রয় সংক্রান্ত তথ্য" : "Purchase Information"}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <Label className="text-xs font-semibold text-foreground shrink-0 whitespace-nowrap">
              {isBangla ? "তারিখ:" : "Date:"}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-8 w-[130px] justify-between text-left font-normal bg-background/50 border-input text-foreground hover:bg-muted text-xs px-2.5 shrink-0"
                >
                  <span className="truncate">{format(invoiceDate, "dd MMM yyyy")}</span>
                  <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
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
        </div>

        {/* Single Row on Desktop, 2 Cols on Tablet, Stacked on Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-10 gap-3 items-end">
          {/* 1. Purchase Item (40% width on desktop) */}
          <div className="space-y-2 col-span-1 sm:col-span-2 lg:col-span-4 relative">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5 truncate">
                <Search className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="truncate">{isBangla ? "পণ্য খুঁজুন *" : "Purchase Item *"}</span>
              </Label>
              <button
                type="button"
                onClick={() => setIsAddItemModalOpen(true)}
                className="text-[11px] font-semibold text-primary hover:underline cursor-pointer flex items-center gap-1 shrink-0"
              >
                + Add New
              </button>
            </div>
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
                    ? "পণ্য সার্চ / স্ক্যান..."
                    : "Search item / barcode..."
                }
                className="pr-8 h-10 bg-background/50 border-input text-xs font-medium focus-visible:ring-1"
              />
              <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />

              {showTopProductSuggestions && (
                <div className="absolute z-50 left-0 top-full mt-1 w-full min-w-[280px] max-w-sm sm:max-w-md bg-card border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto divide-y divide-border text-foreground">
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
                          handleSelectProductFromTopSearch(product);
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

          {/* 2. Party Name / Phone (30% width on desktop) */}
          <div className="relative space-y-2 col-span-1 sm:col-span-2 lg:col-span-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-foreground truncate">
                {isBangla ? "সরবরাহকারী *" : "Supplier Name *"}
              </Label>
              <button
                type="button"
                onClick={() => setIsAddSupplierModalOpen(true)}
                className="text-[11px] font-semibold text-primary hover:underline cursor-pointer flex items-center gap-1 shrink-0"
              >
                + Add New
              </button>
            </div>
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
                placeholder={isBangla ? "নাম / ফোন দিয়ে খুঁজুন..." : "Search supplier / phone"}
                className={cn("pr-8 h-10 bg-background/50 border-input text-xs w-full", errors.supplier && "border-destructive")}
              />
              <Users className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />

              {showSupplierSuggestions && (
                <div className="absolute z-50 left-0 top-full mt-1 w-full min-w-[240px] max-w-xs sm:max-w-sm bg-card border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto divide-y divide-border">
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

          {/* 3. Purchase Type (10% width on desktop) */}
          <div className="space-y-2 col-span-1 sm:col-span-1 lg:col-span-1">
            <Label className="text-xs font-semibold text-foreground truncate">
              {isBangla ? "প্রকার" : "Type"}
            </Label>
            <Select
              value={purchaseType}
              onValueChange={(val) => {
                setPurchaseType(val);
                if (val === "warehouse" && !warehouseId && warehousesList.length > 0) {
                  setWarehouseId(String(warehousesList[0].id));
                } else if (val === "in_store" && !branch.id && storeBranches.length > 0) {
                  const mainB = storeBranches.find((b: any) => b.isMain || b.type === "main" || b.name?.toLowerCase().includes("main")) || storeBranches[0];
                  if (mainB) setBranch({ id: String(mainB.id), name: mainB.name });
                }
              }}
            >
              <SelectTrigger className="h-10 bg-background/50 border-input text-xs w-full px-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in_store">{isBangla ? "ইন স্টোর" : "In Store"}</SelectItem>
                <SelectItem value="warehouse">{isBangla ? "ওয়্যারহাউস" : "Warehouse"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 4. Branch / Warehouse (20% width on desktop) */}
          <div className="space-y-2 col-span-1 sm:col-span-1 lg:col-span-2">
            {purchaseType === "warehouse" ? (
              <>
                <Label className="text-xs font-semibold text-foreground truncate">
                  {isBangla ? "ওয়্যারহাউস *" : "Warehouse *"}
                </Label>
                <Select value={warehouseId} onValueChange={setWarehouseId}>
                  <SelectTrigger className="h-10 bg-background/50 border-input text-xs w-full">
                    <SelectValue placeholder={isBangla ? "ওয়্যারহাউস" : "Select Warehouse"} />
                  </SelectTrigger>
                  <SelectContent>
                    {warehousesList.map((w: any) => (
                      <SelectItem key={w.id} value={w.id}>
                        {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            ) : (
              <>
                <Label className="text-xs font-semibold text-foreground truncate">
                  {isBangla ? "শাখা *" : "Branch *"}
                </Label>
                <Select
                  value={branch.id ? String(branch.id) : undefined}
                  onValueChange={(selectedId) => {
                    const selectedObj = storeBranches.find((b: any) => String(b.id) === String(selectedId));
                    if (selectedObj) {
                      setBranch({ id: String(selectedObj.id), name: selectedObj.name });
                    }
                  }}
                >
                  <SelectTrigger className="h-10 bg-background/50 border-input text-xs w-full">
                    <SelectValue placeholder={isBangla ? "শাখা" : "Select Branch"} />
                  </SelectTrigger>
                  <SelectContent>
                    {storeBranches.map((b: any) => (
                      <SelectItem key={b.id} value={String(b.id)}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Responsive Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form Content (9 Columns wide on Desktop) */}
        <div className="col-span-1 lg:col-span-9 space-y-6">
          {/* Billing Items Table */}
          <div className="bg-zinc-900/20 border border-border rounded-xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <span className="text-sm font-semibold text-foreground">
                {isBangla ? "পণ্য ও মূল্য নির্ধারণ" : "Items & Pricing"}
              </span>
            </div>

            <div className="overflow-x-auto border border-border/60 rounded-lg">
              <table className="w-full text-left text-xs border-collapse min-w-[760px]">
                <thead>
                  <tr className="bg-muted/20 text-muted-foreground border-b border-border/80 font-semibold">
                    <th className="px-3 py-3 w-[4%] text-center">#</th>
                    <th className="px-3 py-3 w-[30%]">{isBangla ? "পণ্য বা ডেসক্রিপশন *" : "Item *"}</th>
                    <th className="px-3 py-3 w-[12%] text-center">{isBangla ? "ব্যাচ ট্র্যাকিং" : "Track Batch"}</th>
                    <th className="px-3 py-3 w-[8%] text-center">{isBangla ? "স্টক" : "Stock"}</th>
                    <th className="px-3 py-3 w-[10%] text-center">{isBangla ? "পরিমাণ *" : "Qty *"}</th>
                    <th className="px-3 py-3 w-[11%] text-center">{isBangla ? "ক্রয় মূল্য / দর *" : "Rate *"}</th>
                    <th className="px-3 py-3 w-[8%] text-center">{isBangla ? "ট্যাক্স (%)" : "Tax (%)"}</th>
                    <th className="px-3 py-3 w-[12%] text-center">{isBangla ? "মোট" : "Amount"}</th>
                    <th className="px-3 py-3 w-[5%] text-center"></th>
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
                      <Fragment key={item.id}>
                        <tr className="hover:bg-muted/10 transition-colors">
                          <td className="px-3 py-3 font-semibold text-amber-500/80 align-middle text-center">
                            {idx + 1}
                          </td>

                          {/* Product Image, Fixed Width Name with Truncate & Tooltip, SKU */}
                          <td className="px-3 py-3 align-middle">
                            <div className="flex items-center gap-3">
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
                              <div className="w-[180px] min-w-[180px] max-w-[180px] shrink-0">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <p className="font-semibold text-foreground text-xs leading-tight truncate cursor-pointer hover:text-primary transition-colors">
                                      {item.itemName || "—"}
                                    </p>
                                  </TooltipTrigger>
                                  {item.itemName && (
                                    <TooltipContent side="top" className="max-w-[250px]">
                                      <p className="text-xs">{item.itemName}</p>
                                    </TooltipContent>
                                  )}
                                </Tooltip>
                                {item.sku && (
                                  <p className="text-[10px] text-muted-foreground mt-0.5 font-mono truncate">
                                    SKU: {item.sku}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Track Batch Set / View Column */}
                          <td className="px-3 py-3 align-middle text-center">
                            <div className="flex items-center justify-center">
                              {!item.trackBatch ? (
                                <button
                                  type="button"
                                  data-expiry-container
                                  onClick={() => {
                                    setOpenExpiryRowId((prev) => (prev === item.id ? null : item.id));
                                  }}
                                  className={cn(
                                    "flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md border transition-all cursor-pointer shrink-0 shadow-2xs",
                                    openExpiryRowId === item.id
                                      ? "bg-primary text-primary-foreground border-primary"
                                      : "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
                                  )}
                                  title={isBangla ? "ব্যাচ ও মেয়াদ সেটিংস নির্বাচন করুন" : "Set batch & expiry settings"}
                                >
                                  <Settings className="h-3 w-3" />
                                  <span>{isBangla ? "সেট" : "Set"}</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  data-expiry-container
                                  onClick={() => {
                                    setOpenExpiryRowId((prev) => (prev === item.id ? null : item.id));
                                  }}
                                  className={cn(
                                    "flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md border transition-all cursor-pointer shrink-0 shadow-2xs",
                                    openExpiryRowId === item.id
                                      ? "bg-primary text-primary-foreground border-primary"
                                      : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                                  )}
                                  title={isBangla ? "ব্যাচ ও মেয়াদ সেটিংস দেখুন" : "View batch & expiry settings"}
                                >
                                  <Eye className="h-3 w-3" />
                                  <span>{isBangla ? "ভিউ" : "View"}</span>
                                </button>
                              )}
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

                          {/* Row Total */}
                          <td className="px-3 py-3 align-middle">
                            <Input
                              type="number"
                              value={item.total || ""}
                              onChange={(e) => handleRowChange(item.id, "total", e.target.value)}
                              className="h-8 text-right bg-background/50 border-input text-xs font-bold text-primary font-mono"
                              min="0"
                            />
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

                        {/* Conditional Expiry & Batch Settings Sub-Row */}
                        {openExpiryRowId === item.id && (
                          <tr
                            data-expiry-container
                            className="bg-muted/15 border-b border-border/50 animate-in fade-in duration-150"
                          >
                            <td colSpan={9} className="px-4 py-2 text-xs">
                              <div className="flex flex-wrap items-center gap-4 pl-7">
                                

                                {/* 1. Track Batch Checkbox inside Settings */}
                                <label className="flex items-center gap-1.5 cursor-pointer select-none text-[11px] text-foreground bg-background hover:bg-muted/60 px-2.5 py-1 rounded-md border border-border/60 shadow-xs transition-colors shrink-0">
                                  <input
                                    type="checkbox"
                                    checked={!!item.trackBatch}
                                    onChange={(e) => {
                                      const checked = e.target.checked;
                                      handleRowChange(item.id, "trackBatch", checked);
                                      if (!checked) {
                                        handleRowChange(item.id, "trackExpiry", false);
                                        handleRowChange(item.id, "expiryDate", undefined);
                                        if (openExpiryRowId === item.id) {
                                          setOpenExpiryRowId(null);
                                        }
                                      }
                                    }}
                                    className="h-3.5 w-3.5 rounded border-input accent-primary cursor-pointer"
                                  />
                                  <span className="font-medium whitespace-nowrap">
                                    {isBangla ? "ব্যাচ ট্র্যাকিং" : "Track Batch"}
                                  </span>
                                </label>

                                {/* 2. Track Expiry Checkbox inside Settings */}
                                <label
                                  className={cn(
                                    "flex items-center gap-1.5 select-none text-[11px] px-2.5 py-1 rounded-md border border-border/60 shadow-xs transition-colors shrink-0",
                                    !item.trackBatch
                                      ? "opacity-50 cursor-not-allowed bg-muted/20 text-muted-foreground"
                                      : "cursor-pointer text-foreground bg-background hover:bg-muted/60"
                                  )}
                                >
                                  <input
                                    type="checkbox"
                                    checked={!!item.trackExpiry}
                                    disabled={!item.trackBatch}
                                    onChange={(e) => {
                                      if (!item.trackBatch) return;
                                      const checked = e.target.checked;
                                      handleRowChange(item.id, "trackExpiry", checked);
                                      if (!checked) {
                                        handleRowChange(item.id, "manufactureDate", undefined);
                                        handleRowChange(item.id, "expiryDate", undefined);
                                      }
                                    }}
                                    className="h-3.5 w-3.5 rounded border-input accent-primary cursor-pointer disabled:cursor-not-allowed"
                                  />
                                  <span className="font-medium whitespace-nowrap">
                                    {isBangla ? "মেয়াদ ট্র্যাকিং" : "Track Expiry"}
                                  </span>
                                </label>


                                {/* 4. Expiry Date Calendar */}
                                {item.trackExpiry && (
                                  <div className="flex items-center gap-2 animate-in fade-in duration-150 shrink-0">
                                    <span className="text-[11px] font-semibold text-foreground whitespace-nowrap">
                                      {isBangla ? "মেয়াদের তারিখ *" : "Expiry Date *"}
                                    </span>
                                    <Input
                                      type="date"
                                      value={
                                        item.expiryDate
                                          ? new Date(item.expiryDate).toISOString().split("T")[0]
                                          : ""
                                      }
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        handleRowChange(
                                          item.id,
                                          "expiryDate",
                                          val ? new Date(val) : undefined
                                        );
                                      }}
                                      className={cn(
                                        "h-7 w-[135px] text-[11px] bg-background border-input px-2 py-0 cursor-pointer shadow-xs",
                                        !item.expiryDate && "border-amber-500/80 focus-visible:ring-amber-500"
                                      )}
                                    />
                                  </div>
                                )}
                                {/* 3. Manufacture Date Calendar */}
                                {item.trackExpiry && (
                                  <div className="flex items-center gap-2 animate-in fade-in duration-150 shrink-0">
                                    <span className="text-[11px] font-medium text-muted-foreground whitespace-nowrap">
                                      {isBangla ? "উৎপাদনের তারিখ:" : "Mfg Date:"}
                                    </span>
                                    <Input
                                      type="date"
                                      value={
                                        item.manufactureDate
                                          ? new Date(item.manufactureDate).toISOString().split("T")[0]
                                          : ""
                                      }
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        handleRowChange(
                                          item.id,
                                          "manufactureDate",
                                          val ? new Date(val) : undefined
                                        );
                                      }}
                                      className="h-7 w-[135px] text-[11px] bg-background border-input px-2 py-0 cursor-pointer shadow-xs"
                                    />
                                  </div>
                                )}

                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {errors.items && <p className="text-[10px] text-destructive font-medium">{errors.items}</p>}
          </div>

          {/* Notes & Invoice Image Upload */}
          <div className="bg-zinc-900/20 border border-border rounded-xl p-5 space-y-4 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Remarks/Notes */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  {isBangla ? "মন্তব্য বা বিশেষ নির্দেশনা" : "Remarks or Special Notes"}
                </Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isBangla ? "অতিরিক্ত বিবরণ লিখুন..." : "Enter additional purchase remarks..."}
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

        {/* Right Section: Purchase Summary Sticky Panel */}
        <div className="col-span-1 lg:col-span-3 lg:sticky lg:top-6 space-y-6">
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
                <span>{isBangla ? "আইটেম ট্যাক্স" : "Item Tax"}</span>
                <span className="font-semibold text-foreground">+{formatCurrency(itemTax)}</span>
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
                 {/* Payment Info Section */}
          <div className="">
            <div className="flex items-center justify-end gap-2 border-b border-border pb-2.5">
              {/* <span className="text-sm font-semibold text-foreground">
                {isBangla ? "পেমেন্ট তথ্য" : "Payment Information"}
              </span> */}
              
              <div className="flex items-center gap-2 group">
                <Label htmlFor="split-mode" className="text-muted-foreground text-xs cursor-pointer">
                  {isBangla ? "একাধিক পদ্ধতি ব্যবহার করুন" : "Split across multiple methods"}
                </Label>
                <Switch
                  id="split-mode"
                  checked={splitMode}
                  onCheckedChange={toggleSplitMode}
                />
              </div>
            </div>

            <div className="space-y-4">
              {(() => {
                const activePayment = splitMode
                  ? payments.find(p => p.method === activeSplitMethod) || payments[0]
                  : payments[0];
                
                if (!activePayment) return null;
                const p = activePayment;

                return (
                  <div key={p.id} className="bg-background/30 p-4 border border-border/60 rounded-xl transition-colors">
                    {/* Method chips */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {METHODS.map((m) => {
                        const Icon = m.icon;
                        const active = splitMode ? activeSplitMethod === m.id : p.method === m.id;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => {
                              if (splitMode) {
                                setActiveSplitMethod(m.id);
                              } else {
                                handlePaymentFieldChange(p.id, "method", m.id);
                              }
                            }}
                            className={cn(
                              "flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all",
                              active ? cn(m.bgClass, m.borderClass) : "border-border/60 bg-transparent hover:bg-muted/30"
                            )}
                          >
                            <Icon size={18} className={active ? m.colorClass : "text-muted-foreground"} strokeWidth={2} />
                            <span
                              className={cn(
                                "text-[10px] font-medium leading-tight text-center",
                                active ? m.colorClass : "text-muted-foreground"
                              )}
                            >
                              {m.label}
                              {splitMode && (() => {
                                const splitP = payments.find(pay => pay.method === m.id);
                                return splitP && splitP.amount > 0 ? (
                                  <span className="block mt-0.5 font-bold text-foreground text-[11px]">
                                    Tk.{splitP.amount}
                                  </span>
                                ) : null;
                              })()}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Provider selection for Mobile Banking */}
                    {p.method === "mobile_banking" && (
                      <div className="flex gap-2 mb-3">
                        {MOBILE_PROVIDERS.map((provider) => {
                          const active = p.accountId === provider.id;
                          return (
                            <button
                              key={provider.id}
                              type="button"
                              onClick={() => handlePaymentFieldChange(p.id, "accountId", provider.id)}
                              className={cn(
                                "flex flex-1 items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all border",
                                active ? "text-white" : "text-muted-foreground border-border/60 bg-transparent hover:bg-muted/30"
                              )}
                              style={active ? { backgroundColor: provider.color, borderColor: provider.color } : {}}
                            >
                              {provider.logo ? (
                                <img src={provider.logo} alt={provider.label} className="w-[50px] h-8 object-contain" />
                              ) : (
                                provider.label
                              )}
                              { provider.label}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Common Amount Input (Rendered alone if method is somehow missing, though should be covered below) */}
                    {!["cash", "bank", "mobile_banking"].includes(p.method) && (
                      <div className="mb-3">
                        <div className="flex items-center bg-background/50 rounded-xl border border-border/60 px-3.5 py-2 focus-within:border-primary">
                          <span className="text-muted-foreground text-sm mr-1.5">{"\u09F3"}</span>
                          <input
                            type="number"
                            value={p.amount || ""}
                            onChange={(e) => handlePaymentFieldChange(p.id, "amount", parseFloat(e.target.value) || 0)}
                            className="bg-transparent text-foreground text-sm font-mono outline-none w-full"
                            placeholder={isBangla ? "পরিমাণ" : "Amount"}
                          />
                        </div>
                      </div>
                    )}

                    {/* Fields for Cash */}
                    {p.method === "cash" && (
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="flex items-center bg-background/50 rounded-xl border border-border/60 px-3.5 py-2 focus-within:border-primary">
                          <span className="text-muted-foreground text-sm mr-1.5">{"\u09F3"}</span>
                          <input
                            type="number"
                            value={p.amount || ""}
                            onChange={(e) => handlePaymentFieldChange(p.id, "amount", parseFloat(e.target.value) || 0)}
                            className="bg-transparent text-foreground text-sm font-mono outline-none w-full"
                            placeholder={isBangla ? "পরিমাণ" : "Amount"}
                          />
                        </div>
                        <input
                          type="text"
                          value={p.receivedBy || ""}
                          onChange={(e) => handlePaymentFieldChange(p.id, "receivedBy", e.target.value)}
                          placeholder={isBangla ? "গ্রহীতার নাম" : "Received By (optional)"}
                          className="w-full bg-background/50 rounded-xl border border-border/60 px-3.5 py-2.5 text-foreground text-xs outline-none placeholder:text-muted-foreground focus:border-primary"
                        />
                      </div>
                    )}

                    {/* Fields for Bank */}
                    {p.method === "bank" && (
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="flex items-center bg-background/50 rounded-xl border border-border/60 px-3.5 py-2 focus-within:border-primary">
                          <span className="text-muted-foreground text-sm mr-1.5">{"\u09F3"}</span>
                          <input
                            type="number"
                            value={p.amount || ""}
                            onChange={(e) => handlePaymentFieldChange(p.id, "amount", parseFloat(e.target.value) || 0)}
                            className="bg-transparent text-foreground text-sm font-mono outline-none w-full"
                            placeholder={isBangla ? "পরিমাণ" : "Amount"}
                          />
                        </div>
                        <Select
                          value={p.accountId}
                          onValueChange={(val) => handlePaymentFieldChange(p.id, "accountId", val)}
                        >
                          <SelectTrigger className="h-10 text-xs bg-background/50 border-input w-full rounded-xl">
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
                        <input
                          type="text"
                          value={p.transactionId}
                          onChange={(e) => handlePaymentFieldChange(p.id, "transactionId", e.target.value)}
                          placeholder={isBangla ? "লেনদেন আইডি" : "TXN ID (optional)"}
                          className="w-full bg-background/50 rounded-xl border border-border/60 px-3.5 py-2.5 text-foreground text-xs outline-none placeholder:text-muted-foreground focus:border-primary"
                        />
                      </div>
                    )}

                    {/* Fields for Mobile Banking */}
                    {p.method === "mobile_banking" && (
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="flex items-center bg-background/50 rounded-xl border border-border/60 px-3.5 py-2 focus-within:border-primary">
                          <span className="text-muted-foreground text-sm mr-1.5">{"\u09F3"}</span>
                          <input
                            type="number"
                            value={p.amount || ""}
                            onChange={(e) => handlePaymentFieldChange(p.id, "amount", parseFloat(e.target.value) || 0)}
                            className="bg-transparent text-foreground text-sm font-mono outline-none w-full"
                            placeholder={isBangla ? "পরিমাণ" : "Amount"}
                          />
                        </div>
                        <input
                          type="text"
                          value={p.transactionId}
                          onChange={(e) => handlePaymentFieldChange(p.id, "transactionId", e.target.value)}
                          placeholder={isBangla ? "লেনদেন আইডি" : "TXN ID (optional)"}
                          className="w-full bg-background/50 rounded-xl border border-border/60 px-3.5 py-2.5 text-foreground text-xs outline-none placeholder:text-muted-foreground focus:border-primary"
                        />
                        <input
                          type="text"
                          value={p.reference}
                          onChange={(e) => handlePaymentFieldChange(p.id, "reference", e.target.value)}
                          placeholder={isBangla ? "রেফারেন্স" : "Ref no (optional)"}
                          className="w-full bg-background/50 rounded-xl border border-border/60 px-3.5 py-2.5 text-foreground text-xs outline-none placeholder:text-muted-foreground focus:border-primary"
                        />
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
            
            {errors.payments && <p className="text-[10px] text-destructive font-medium">{errors.payments}</p>}
          </div>
              {splitMode && payments.some(p => p.amount > 0) && (
                <div className="pt-2 pb-1 space-y-1.5">
                  {payments.filter(p => p.amount > 0).map((p) => {
                    const methodLabel = METHODS.find(m => m.id === p.method)?.label || p.method;
                    const accountName = accounts.find((a: any) => String(a.id) === String(p.accountId))?.name;
                    return (
                      <div key={p.id} className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{methodLabel} {accountName ? `(${accountName})` : ''}</span>
                        <span>{formatCurrency(p.amount)}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex justify-between items-center text-muted-foreground pt-1.5 border-t border-border/40 mt-1.5">
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

            {/* ONLY Complete Purchase & Cancel Buttons */}
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

          
        </div>
      </div>

      {/* Add New Supplier Modal */}
      <AddPartyModal
        isOpen={isAddSupplierModalOpen}
        onClose={() => setIsAddSupplierModalOpen(false)}
      />

      {/* Add New Item Modal */}
      <Dialog open={isAddItemModalOpen} onOpenChange={setIsAddItemModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {isBangla ? "নতুন পণ্য যুক্ত করুন" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <InventoryItemForm
            isModal
            onSuccess={(newItem) => {
              setIsAddItemModalOpen(false);
              if (newItem) {
                handleSelectProductFromTopSearch(newItem);
              }
            }}
            onCancel={() => setIsAddItemModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
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
