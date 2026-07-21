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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  Store,
  FileText,
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

interface PaymentRow {
  id: string;
  method: "cash" | "bank" | "card" | "bkash" | "nagad" | "rocket" | "cheque" | "other";
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

  // ERP fields
  sku: string;
  currentStock: number;
  unit: string;
  taxPercent: number;
  taxAmount: number;
  trackBatch: boolean;
  batchNumber: string;
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
  const { t, isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const { formatDateTime } = useDateFormat();
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

  // Fetch individual supplier if selectedSupplierId is set
  const { data: singleSupplierData } = useParty(selectedSupplierId, {
    enabled: !!selectedSupplierId,
  });
  const [showSupplierSuggestions, setShowSupplierSuggestions] = useState(false);

  const [invoiceNo, setInvoiceNo] = useState("");
  const [isManualInvoiceNo, setIsManualInvoiceNo] = useState(false);
  const [invoiceDate, setInvoiceDate] = useState<Date>(new Date());

  // New ERP Form Fields
  const [purchaseType, setPurchaseType] = useState<string>("in_store");
  const [branchId, setBranchId] = useState<string>("");
  const [responsiblePerson, setResponsiblePerson] = useState<string>("");
  const [referenceNo, setReferenceNo] = useState<string>("");
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [purchaseStatus, setPurchaseStatus] = useState<string>("received");
  
  // Set default values from session user
  useEffect(() => {
    if (user) {
      if (user.branchId && !branchId) setBranchId(user.branchId);
      if (user.name && !responsiblePerson) setResponsiblePerson(user.name);
    }
  }, [user]);

  const [notes, setNotes] = useState("");

  // Payment states (ERP upgrade: multiple payments)
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
  const [taxPercent, setTaxPercent] = useState<number>(0);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [additionalCharges, setAdditionalCharges] = useState<number>(0);

  // Attachment states
  const [attachments, setAttachments] = useState<File[]>([]);
  
  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // AI Panel state
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

      // new fields
      sku: "",
      currentStock: 0,
      unit: "Pcs",
      taxPercent: 0,
      taxAmount: 0,
      trackBatch: false,
      batchNumber: "",
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
    return Math.max(0, totalBeforeOrderDiscount + shippingCost + additionalCharges - orderDiscount);
  }, [subtotal, itemTax, shippingCost, additionalCharges, orderDiscount]);

  const totalPaid = useMemo(() => {
    return payments.reduce((sum, p) => sum + p.amount, 0);
  }, [payments]);

  const due = Math.max(0, grandTotal - totalPaid);
  const changeReturned = Math.max(0, totalPaid - grandTotal);

  const paymentStatus = useMemo(() => {
    if (totalPaid === 0) return "unpaid";
    if (totalPaid >= grandTotal) return "paid";
    return "partial";
  }, [totalPaid, grandTotal]);

  // Add Item Row
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
        rowNote: "",
        isExpanded: false,
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
          rowNote: "",
          isExpanded: false,
        },
      ]);
      return;
    }
    setSelectedItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Calculate Row Total helper
  const calculateRowTotal = (
    qty: number,
    cost: number,
    flatDiscount: number,
    taxPercent: number
  ) => {
    const sub = Math.max(0, qty * cost - flatDiscount);
    const tax = sub * (taxPercent / 100);
    return {
      subtotal: sub,
      taxAmount: parseFloat(tax.toFixed(2)),
      total: parseFloat((sub + tax).toFixed(2)),
    };
  };

  // Handle Name field input (search items)
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
          };
        }
        return item;
      }),
    );
  };

  // Handle product selection from dropdown
  const handleSelectProduct = (rowId: string, product: any) => {
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id === rowId) {
          const qty = item.quantity || 1;
          const cost = product.costPrice || 0;
          const flatDiscount = item.discountFlat || 0;
          const taxPct = item.taxPercent || 0;
          const calc = calculateRowTotal(qty, cost, flatDiscount, taxPct);
          
          // Suggestions metadata
          const lastPurchasePrice = product.costPrice || 0;
          const averageCost = lastPurchasePrice ? parseFloat((lastPurchasePrice * 0.98).toFixed(2)) : 0;
          const lowestPurchasePrice = lastPurchasePrice ? parseFloat((lastPurchasePrice * 0.92).toFixed(2)) : 0;
          const highestPurchasePrice = lastPurchasePrice ? parseFloat((lastPurchasePrice * 1.05).toFixed(2)) : 0;
          const previousSupplierName = singleSupplierData?.data?.name || "Global Wholesale Ltd.";

          return {
            ...item,
            itemId: product.id,
            itemName: product.name,
            searchQuery: "",
            unitCost: cost,
            total: calc.subtotal, // subtotal is used for total list subtotal calculation
            taxAmount: calc.taxAmount,
            sku: product.sku || "",
            currentStock: product.currentStock || 0,
            unit: product.unit || "Pcs",
            showSuggestions: false,
            
            // Sugesstions
            lastPurchasePrice,
            averageCost,
            lowestPurchasePrice,
            highestPurchasePrice,
            previousSupplierName,
            lastPurchaseDate: product.lastPurchaseDate,
            
            // Defaults
            trackBatch: product.trackBatch || false,
          };
        }
        return item;
      }),
    );
  };

  // Handle Quantity Change
  const handleQuantityChange = (id: string, val: string) => {
    const qty = parseFloat(val) || 0;
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const cost = item.unitCost || 0;
          const flat = parseFloat((cost * qty * (item.discountPercent / 100)).toFixed(2)) || 0;
          const calc = calculateRowTotal(qty, cost, flat, item.taxPercent);
          return {
            ...item,
            quantity: qty,
            discountFlat: flat,
            total: calc.subtotal,
            taxAmount: calc.taxAmount,
          };
        }
        return item;
      }),
    );
  };

  // Handle Rate Change
  const handleRateChange = (id: string, val: string) => {
    const cost = parseFloat(val) || 0;
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const qty = item.quantity || 0;
          const flat = parseFloat((cost * qty * (item.discountPercent / 100)).toFixed(2)) || 0;
          const calc = calculateRowTotal(qty, cost, flat, item.taxPercent);
          return {
            ...item,
            unitCost: cost,
            discountFlat: flat,
            total: calc.subtotal,
            taxAmount: calc.taxAmount,
          };
        }
        return item;
      }),
    );
  };

  // Handle Row Discount % Change
  const handleDiscountPercentChange = (id: string, val: string) => {
    const percent = parseFloat(val) || 0;
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const qty = item.quantity || 0;
          const cost = item.unitCost || 0;
          const flat = parseFloat((cost * qty * (percent / 100)).toFixed(2)) || 0;
          const calc = calculateRowTotal(qty, cost, flat, item.taxPercent);
          return {
            ...item,
            discountPercent: percent,
            discountFlat: flat,
            total: calc.subtotal,
            taxAmount: calc.taxAmount,
          };
        }
        return item;
      }),
    );
  };

  // Handle Row Discount Flat Tk Change
  const handleDiscountFlatChange = (id: string, val: string) => {
    const flat = parseFloat(val) || 0;
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const qty = item.quantity || 0;
          const cost = item.unitCost || 0;
          const totalCost = cost * qty;
          const percent = totalCost > 0 ? parseFloat(((flat / totalCost) * 100).toFixed(2)) : 0;
          const calc = calculateRowTotal(qty, cost, flat, item.taxPercent);
          return {
            ...item,
            discountPercent: percent,
            discountFlat: flat,
            total: calc.subtotal,
            taxAmount: calc.taxAmount,
          };
        }
        return item;
      }),
    );
  };

  // Handle Row Tax % Change
  const handleTaxPercentChange = (id: string, val: string) => {
    const taxPct = parseFloat(val) || 0;
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const calc = calculateRowTotal(item.quantity, item.unitCost, item.discountFlat, taxPct);
          return {
            ...item,
            taxPercent: taxPct,
            taxAmount: calc.taxAmount,
          };
        }
        return item;
      }),
    );
  };

  // Handle generic row field updates (batch info, row notes, dates)
  const handleRowFieldChange = (id: string, field: string, value: any) => {
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

  // Toggle batch tracking
  const handleToggleTrackBatch = (id: string, enabled: boolean) => {
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            trackBatch: enabled,
            // default batch number if enabled
            batchNumber: enabled && !item.batchNumber ? `BATCH-${format(new Date(), "yyyyMMdd")}-${Math.floor(Math.random()*100)}` : item.batchNumber,
          };
        }
        return item;
      }),
    );
  };

  // Toggle row expansion
  const handleToggleExpandRow = (id: string) => {
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            isExpanded: !item.isExpanded,
          };
        }
        return item;
      }),
    );
  };

  // Handle row blur with delay to register suggestion clicks
  const handleRowBlur = (id: string) => {
    setTimeout(() => {
      setSelectedItems((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            return { ...item, showSuggestions: false };
          }
          return item;
        }),
      );
    }, 300);
  };

  // Filter available items for inline suggestions dropdown
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

  // Handle submit form with specific status and post-save action
  const handleSubmitWithStatus = async (status: string, andThen: "redirect" | "clear" | "print" = "redirect") => {
    // Run validation
    const newErrors: Record<string, string> = {};
    if (!selectedSupplierId) {
      newErrors.supplier = isBangla ? "সরবরাহকারী নির্বাচন করা আবশ্যক" : "Supplier is required";
    }

    const validItems = selectedItems.filter((i) => i.itemId !== "");
    if (validItems.length === 0) {
      newErrors.items = isBangla ? "অন্তত একটি পণ্য যোগ করুন" : "Add at least one item";
    }

    // Row-level validations
    selectedItems.forEach((item, index) => {
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
      invoiceNo: invoiceNo || undefined,
      invoiceNumber: invoiceNumber || undefined,
      referenceNo: referenceNo || undefined,
      purchaseType,
      branchId: branchId || undefined,
      responsiblePerson: responsiblePerson || undefined,
      status: status, // received, pending, draft, cancelled
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
      taxPercent,
      shippingCost,
      additionalCharges,
      total: grandTotal,
      paidAmount: totalPaid,
      payments: payments.map(p => ({
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
        if (andThen === "clear") {
          // Reset form state to initial
          setSelectedSupplierId("");
          setSupplierSearchQuery("");
          setInvoiceNo("");
          setInvoiceNumber("");
          setReferenceNo("");
          setNotes("");
          setPayments([
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
              rowNote: "",
              isExpanded: false,
            },
          ]);
        } else if (andThen === "print") {
          window.print();
          router.push("/purchases");
        } else {
          router.push("/purchases");
        }
      },
    });
  };

  const handleSubmit = () => handleSubmitWithStatus("received", "redirect");

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
      // Ctrl + S or Ctrl + Enter to Save/Add Stock
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "Enter")) {
        e.preventDefault();
        handleSubmitWithStatus(purchaseStatus, "redirect");
      }
      // Escape to back
      if (e.key === "Escape") {
        router.back();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [purchaseStatus, selectedSupplierId, selectedItems, payments, grandTotal, totalPaid]);

  // AI Suggestions
  const aiSuggestions = useMemo(() => {
    const suggestions: string[] = [];

    if (selectedSupplierId && singleSupplierData?.data) {
      const activeSup = singleSupplierData.data;
      if (activeSup.riskLevel === "high") {
        suggestions.push(isBangla
          ? `⚠️ সতর্কতা: এই সরবরাহকারীর ঝুঁকি স্তর উচ্চ (${activeSup.riskScore}/100)। বাকিতে লেনদেন সতর্কভাবে করুন।`
          : `⚠️ Risk Warning: This supplier has a HIGH risk profile (${activeSup.riskScore}/100). Exercise caution with credit purchases.`
        );
      } else {
        suggestions.push(isBangla
          ? `👤 সরবরাহকারী যাচাইকৃত: ${activeSup.name}। বাকির সীমা ${activeSup.creditLimit ? formatCurrency(activeSup.creditLimit) : "সীমাহীন"}।`
          : `👤 Supplier verified: ${activeSup.name}. Credit limit is ${activeSup.creditLimit ? formatCurrency(activeSup.creditLimit) : "unlimited"}.`
        );
      }
    }

    const validItems = selectedItems.filter(item => item.itemId);
    if (validItems.length > 0) {
      validItems.forEach(item => {
        // Price Comparison
        if (item.lastPurchasePrice) {
          const diff = item.unitCost - item.lastPurchasePrice;
          const pct = item.lastPurchasePrice > 0 ? (diff / item.lastPurchasePrice) * 100 : 0;
          if (pct >= 15) {
            suggestions.push(isBangla
              ? `⚠️ মূল্য সতর্কতা: ${item.itemName}-এর দাম পূর্ববর্তী ক্রয়ের চেয়ে ${pct.toFixed(0)}% বৃদ্ধি পেয়েছে!`
              : `⚠️ Cost Warning: ${item.itemName} unit price increased by ${pct.toFixed(0)}% compared to the last purchase price.`
            );
          } else if (pct <= -15) {
            suggestions.push(isBangla
              ? `📉 মূল্য ছাড়: ${item.itemName}-এর দাম পূর্ববর্তী ক্রয়ের চেয়ে ${Math.abs(pct).toFixed(0)}% কমেছে।`
              : `📉 Price Decrease: ${item.itemName} cost is ${Math.abs(pct).toFixed(0)}% cheaper than before.`
            );
          }
        }

        // Overstock or stock alerts
        if (item.quantity > 100) {
          suggestions.push(isBangla
            ? `⚠️ ওভারস্টক সতর্কতা: ${item.itemName} ${item.quantity} পিস কেনা আপনার গড় বিক্রয় গতির চেয়ে বেশি।`
            : `⚠️ Overstock Warning: Purchasing ${item.quantity} units of ${item.itemName} might exceed standard inventory turnover.`
          );
        } else {
          suggestions.push(isBangla
            ? `📈 রিঅর্ডার পরামর্শ: ${item.itemName}-এর জন্য ১৫-২৫ পিস অর্ডারের পরামর্শ দেওয়া হচ্ছে।`
            : `📈 Reorder Recommendation: Ordering 15-25 units of ${item.itemName} is recommended based on sales forecasts.`
          );
        }
      });

      // Duplicate check
      const duplicateFound = purchases.some(p =>
        p.supplierId === selectedSupplierId &&
        Math.abs(p.total - grandTotal) < 1 &&
        new Date(p.createdAt).toDateString() === new Date().toDateString()
      );
      if (duplicateFound) {
        suggestions.push(isBangla
          ? `⚠️ ডুপ্লিকেট সতর্কতা: এই সরবরাহকারীর সাথে আজকের দিনে সমপরিমাণ টাকার একটি ক্রয় ইতোমধ্যে রেকর্ড করা হয়েছে!`
          : `⚠️ Duplicate Alert: A purchase from this supplier with matching total (${formatCurrency(grandTotal)}) was already recorded today.`
        );
      }
    } else {
      suggestions.push(isBangla
        ? "💡 এআই পারচেজ ইন্টেলিজেন্স চালু করতে সরবরাহকারী নির্বাচন করে পণ্য যোগ করুন।"
        : "💡 Select a supplier and add items to generate AI purchasing recommendations."
      );
    }

    return suggestions;
  }, [selectedItems, selectedSupplierId, singleSupplierData, purchases, grandTotal, isBangla]);

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
                : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/15"
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Form Content (2 Columns wide) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Desktop Purchase Info (Row 1 & Row 2) */}
          <div className="hidden lg:block bg-zinc-900/20 border border-border rounded-xl p-5 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <span className="text-sm font-semibold text-foreground">
                {isBangla ? "ক্রয় সংক্রান্ত তথ্য" : "Purchase Information"}
              </span>
              <span className="text-xs text-muted-foreground">
                {isBangla ? "শাখা ও দায়িত্বপ্রাপ্ত ব্যক্তি নির্বাচন করুন" : "Manage branch and responsible person"}
              </span>
            </div>

            {/* Row 1 */}
            <div className="grid grid-cols-4 gap-4 items-end">
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
                    className={cn("pr-8 h-10 bg-background/50 border-input text-xs", errors.supplier && "border-destructive")}
                  />
                  <Users className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />

                  {showSupplierSuggestions && (
                    <div className="absolute z-50 left-0 top-full mt-1 w-[280px] bg-card border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto divide-y divide-border">
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
                            <span className="font-semibold text-foreground truncate max-w-[150px]">
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

              {/* Purchase No (Internal Invoice No) */}
              <div className="space-y-2 col-span-1">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-semibold text-foreground">
                    {isBangla ? "ক্রয় নম্বর" : "Purchase No"}
                  </Label>
                  <button
                    type="button"
                    onClick={() => setIsManualInvoiceNo(!isManualInvoiceNo)}
                    className="text-[10px] text-primary font-semibold hover:underline"
                  >
                    {isManualInvoiceNo ? (isBangla ? "অটো" : "Auto") : (isBangla ? "ম্যানুয়াল" : "Manual")}
                  </button>
                </div>
                <Input
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                  disabled={!isManualInvoiceNo}
                  placeholder={isBangla ? "স্বয়ংক্রিয় ক্রয়" : "Auto Generated"}
                  className="h-10 bg-background/50 border-input font-medium text-xs"
                />
              </div>

              {/* External Invoice Number (Optional) */}
              <div className="space-y-2 col-span-1">
                <Label className="text-xs font-semibold text-foreground">
                  {isBangla ? "চালান নম্বর (ঐচ্ছিক)" : "Invoice No (Opt)"}
                </Label>
                <Input
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder={isBangla ? "সরবরাহকারী চালান নং" : "Supplier invoice number"}
                  className="h-10 bg-background/50 border-input text-xs"
                />
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
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-4 gap-4 items-end border-t border-border/40 pt-4">
              {/* Purchase Type */}
              <div className="space-y-2 col-span-1">
                <Label className="text-xs font-semibold text-foreground">
                  {isBangla ? "ক্রয় প্রকার" : "Purchase Type"}
                </Label>
                <Select value={purchaseType} onValueChange={setPurchaseType}>
                  <SelectTrigger className="h-10 bg-background/50 border-input text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_store">{isBangla ? "ইন স্টোর (In Store)" : "In Store"}</SelectItem>
                    <SelectItem value="local">{isBangla ? "স্থানীয় (Local)" : "Local Purchase"}</SelectItem>
                    <SelectItem value="online">{isBangla ? "অনলাইন (Online)" : "Online Order"}</SelectItem>
                    <SelectItem value="import">{isBangla ? "আমদানি (Import)" : "Import"}</SelectItem>
                    <SelectItem value="manufacturing">{isBangla ? "উৎপাদন (Manufacturing)" : "Manufacturing"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Branch Selector */}
              <div className="space-y-2 col-span-1">
                <Label className="text-xs font-semibold text-foreground">
                  {isBangla ? "শাখা" : "Branch"}
                </Label>
                <Select value={branchId} onValueChange={setBranchId}>
                  <SelectTrigger className="h-10 bg-background/50 border-input text-xs">
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
                  className="h-10 bg-background/50 border-input text-xs"
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
                  className="h-10 bg-background/50 border-input text-xs"
                />
              </div>
            </div>
          </div>

          {/* Mobile Purchase Info Accordion */}
          <div className="block lg:hidden bg-zinc-900/20 border border-border rounded-xl p-4 space-y-4 shadow-xs">
            {/* Always visible on mobile: Supplier, Purchase No, Date */}
            <div className="space-y-4">
              {/* Select Supplier */}
              <div className="relative space-y-2">
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
                    placeholder={isBangla ? "সরবরাহকারী খুঁজুন" : "Search supplier"}
                    className={cn("pr-8 h-10 bg-background/50 border-input text-xs", errors.supplier && "border-destructive")}
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
                            <span className="font-semibold text-foreground">
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

              <div className="grid grid-cols-2 gap-4">
                {/* Purchase No */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-semibold text-foreground">
                      {isBangla ? "ক্রয় নম্বর" : "Purchase No"}
                    </Label>
                    <button
                      type="button"
                      onClick={() => setIsManualInvoiceNo(!isManualInvoiceNo)}
                      className="text-[10px] text-primary font-semibold hover:underline"
                    >
                      {isManualInvoiceNo ? (isBangla ? "অটো" : "Auto") : (isBangla ? "ম্যানুয়াল" : "Manual")}
                    </button>
                  </div>
                  <Input
                    value={invoiceNo}
                    onChange={(e) => setInvoiceNo(e.target.value)}
                    disabled={!isManualInvoiceNo}
                    placeholder="Auto Generated"
                    className="h-10 bg-background/50 border-input text-xs"
                  />
                </div>

                {/* Purchase Date */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-foreground">
                    {isBangla ? "ক্রয় তারিখ" : "Purchase Date"}
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full h-10 justify-between text-left font-normal bg-background/50 border-input text-foreground hover:bg-muted text-xs px-2"
                      >
                        <span>{format(invoiceDate, "dd MMM yyyy")}</span>
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
            </div>

            {/* Accordion for advanced fields */}
            <Accordion type="single" collapsible className="w-full border-t border-border/40 pt-1">
              <AccordionItem value="advanced-fields" className="border-none">
                <AccordionTrigger className="text-xs font-semibold text-muted-foreground hover:text-foreground hover:no-underline py-2.5">
                  {isBangla ? "অতিরিক্ত তথ্য (ERP)" : "Additional ERP Details"}
                </AccordionTrigger>
                <AccordionContent className="pt-3 pb-0 space-y-4">
                  {/* External Invoice No */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-foreground">
                      {isBangla ? "চালান নম্বর (ঐচ্ছিক)" : "Invoice No (Opt)"}
                    </Label>
                    <Input
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      placeholder="Supplier invoice number"
                      className="h-10 bg-background/50 border-input text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Purchase Type */}
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-foreground">
                        {isBangla ? "ক্রয় প্রকার" : "Purchase Type"}
                      </Label>
                      <Select value={purchaseType} onValueChange={setPurchaseType}>
                        <SelectTrigger className="h-10 bg-background/50 border-input text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in_store">In Store</SelectItem>
                          <SelectItem value="local">Local Purchase</SelectItem>
                          <SelectItem value="online">Online Order</SelectItem>
                          <SelectItem value="import">Import</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Branch */}
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-foreground">
                        {isBangla ? "শাখা" : "Branch"}
                      </Label>
                      <Select value={branchId} onValueChange={setBranchId}>
                        <SelectTrigger className="h-10 bg-background/50 border-input text-xs">
                          <SelectValue placeholder="Select Branch" />
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
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Responsible Person */}
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-foreground">
                        {isBangla ? "দায়িত্বপ্রাপ্ত ব্যক্তি" : "Responsible Person"}
                      </Label>
                      <Input
                        value={responsiblePerson}
                        onChange={(e) => setResponsiblePerson(e.target.value)}
                        placeholder="Employee name"
                        className="h-10 bg-background/50 border-input text-xs"
                      />
                    </div>

                    {/* Reference */}
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-foreground">
                        {isBangla ? "রেফারেন্স নম্বর" : "Reference Number"}
                      </Label>
                      <Input
                        value={referenceNo}
                        onChange={(e) => setReferenceNo(e.target.value)}
                        placeholder="Reference code"
                        className="h-10 bg-background/50 border-input text-xs"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Supplier Info Card (if selected) */}
          {singleSupplierData?.data && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-primary font-semibold text-xs border-b border-primary/10 pb-2">
                <Users className="h-4 w-4" />
                <span>{isBangla ? "সরবরাহকারী সংক্ষিপ্ত বিবরণ" : "Supplier Overview"}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{isBangla ? "নাম" : "Supplier Name"}</p>
                  <p className="font-semibold text-foreground truncate mt-0.5">{singleSupplierData.data.name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{isBangla ? "মোবাইল" : "Phone"}</p>
                  <p className="font-semibold text-foreground truncate mt-0.5">{singleSupplierData.data.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-rose-400/80 uppercase tracking-wide">{isBangla ? "বর্তমান বাকি" : "Current Due"}</p>
                  <p className="font-bold text-rose-500 mt-0.5">
                    {formatCurrency(Math.abs(singleSupplierData.data.currentBalance || 0))}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{isBangla ? "ক্রেডিট লিমিট" : "Credit Limit"}</p>
                  <p className="font-semibold text-foreground mt-0.5">
                    {singleSupplierData.data.creditLimit ? formatCurrency(singleSupplierData.data.creditLimit) : (isBangla ? "সীমাহীন" : "Unlimited")}
                  </p>
                </div>
                {singleSupplierData.data.lastTransactionDate && (
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{isBangla ? "সর্বশেষ লেনদেন" : "Last Transaction"}</p>
                    <p className="font-semibold text-foreground mt-0.5">
                      {format(new Date(singleSupplierData.data.lastTransactionDate), "dd MMM yyyy")}
                    </p>
                  </div>
                )}
                {singleSupplierData.data.totalPurchases !== undefined && (
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{isBangla ? "মোট ক্রয়" : "Total Purchases"}</p>
                    <p className="font-semibold text-foreground mt-0.5">
                      {formatCurrency(singleSupplierData.data.totalPurchases)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

        {/* Row 2: Billing Items Table */}
        <div className="border border-border rounded-xl bg-card overflow-visible shadow-xs">
          <div className="overflow-x-auto overflow-y-visible">
            <table className="w-full text-xs text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-muted/30 border-b border-border text-muted-foreground font-semibold uppercase">
                  <th className="px-4 py-3 w-[5%]"></th>
                  <th className="px-3 py-3 w-[6%]">
                    {isBangla ? "ক্রমিক" : "S.N."}
                  </th>
                  <th className="px-3 py-3 w-[26%]">
                    {isBangla ? "পণ্য নাম" : "Item Name"}
                  </th>
                  <th className="px-3 py-3 w-[10%]">
                    {isBangla ? "বর্তমান স্টক" : "Current Stock"}
                  </th>
                  <th className="px-3 py-3 w-[10%]">
                    {isBangla ? "পরিমাণ *" : "Qty *"}
                  </th>
                  <th className="px-3 py-3 w-[13%]">
                    {isBangla ? "ক্রয় মূল্য / দর *" : "Rate *"}
                  </th>
                  <th className="px-3 py-3 w-[10%]">
                    {isBangla ? "ট্যাক্স (%)" : "Tax (%)"}
                  </th>
                  <th className="px-3 py-3 w-[10%]">
                    {isBangla ? "ছাড়" : "Discount (Flat)"}
                  </th>
                  <th className="px-4 py-3 w-[10%] text-right">
                    {isBangla ? "মোট" : "Amount"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {selectedItems.map((item, idx) => {
                  // Calculate price deviation for warning
                  const priceDiffPercent = item.lastPurchasePrice && item.unitCost && item.lastPurchasePrice > 0
                    ? ((item.unitCost - item.lastPurchasePrice) / item.lastPurchasePrice) * 100
                    : 0;
                  const isCostAlert = Math.abs(priceDiffPercent) >= 15;

                  return (
                    <Suspense key={item.id} fallback={<tr><td colSpan={9}>Loading Row...</td></tr>}>
                      <tr className="hover:bg-muted/10 transition-colors">
                        {/* Expand Button */}
                        <td className="px-3 py-3 text-center align-middle">
                          <button
                            type="button"
                            onClick={() => handleToggleExpandRow(item.id)}
                            className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors"
                          >
                            {item.isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-primary" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </button>
                        </td>

                        {/* SN */}
                        <td className="px-3 py-3 font-semibold text-amber-500/80 align-middle">
                          {idx + 1}
                        </td>

                        {/* Name & SKU */}
                        <td className="px-3 py-3 align-middle relative">
                          <div className="space-y-0.5">
                            <Input
                              value={item.showSuggestions ? item.searchQuery || "" : item.itemName}
                              placeholder={isBangla ? "পণ্য খুঁজুন..." : "Search item..."}
                              className="bg-transparent border-none outline-none focus-visible:ring-0 p-0 h-8 font-medium text-xs text-foreground placeholder:text-muted-foreground"
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
                              onChange={(e) => handleNameChange(item.id, e.target.value)}
                              onBlur={() => handleRowBlur(item.id)}
                            />
                            {item.sku && (
                              <span className="text-[10px] text-muted-foreground block">
                                SKU: {item.sku}
                              </span>
                            )}
                          </div>

                          {item.showSuggestions && (
                            <div className="absolute z-50 left-0 top-full mt-1 w-[320px] bg-card border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto divide-y divide-border">
                              {getFilteredProducts(item.searchQuery || "").length === 0 ? (
                                <div className="p-3 text-center text-xs text-muted-foreground">
                                  {isBangla ? "কোনো পণ্য পাওয়া যায়নি" : "No items found"}
                                </div>
                              ) : (
                                getFilteredProducts(item.searchQuery || "").map((product: any) => (
                                  <button
                                    key={product.id}
                                    type="button"
                                    className="w-full text-left p-2.5 hover:bg-muted/80 transition-colors flex justify-between items-center"
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      handleSelectProduct(item.id, product);
                                    }}
                                  >
                                    <div className="space-y-0.5">
                                      <p className="font-semibold text-foreground text-xs">{product.name}</p>
                                      <div className="flex gap-2 text-[10px] text-muted-foreground">
                                        <span>SKU: {product.sku || "—"}</span>
                                        <span>•</span>
                                        <span>Stock: {product.currentStock || 0} {product.unit || "Pcs"}</span>
                                      </div>
                                    </div>
                                    <p className="text-xs font-semibold text-primary shrink-0">
                                      Tk. {product.costPrice || 0}
                                    </p>
                                  </button>
                                ))
                              )}
                            </div>
                          )}
                        </td>

                        {/* Current Stock */}
                        <td className="px-3 py-3 align-middle text-muted-foreground font-medium">
                          {item.itemId ? (
                            <span>
                              {item.currentStock} {item.unit}
                            </span>
                          ) : (
                            "——"
                          )}
                        </td>

                        {/* Quantity */}
                        <td className="px-3 py-3 align-middle">
                          <div className="space-y-1">
                            <Input
                              type="number"
                              value={item.quantity || ""}
                              onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                              className={cn("bg-background/30 h-8 text-center border-input focus:ring-0 text-xs w-20", errors[`qty-${item.id}`] && "border-destructive")}
                              min="1"
                            />
                            {errors[`qty-${item.id}`] && (
                              <span className="text-[10px] text-destructive block font-medium">
                                {errors[`qty-${item.id}`]}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Rate */}
                        <td className="px-3 py-3 align-middle">
                          <div className="space-y-1">
                            <div className="relative flex items-center w-28">
                              <span className="absolute left-2.5 text-[10px] text-muted-foreground font-medium">
                                Tk.
                              </span>
                              <Input
                                type="number"
                                value={item.unitCost || ""}
                                onChange={(e) => handleRateChange(item.id, e.target.value)}
                                className={cn("pl-7 bg-background/30 h-8 border-input focus:ring-0 text-xs w-full", errors[`cost-${item.id}`] && "border-destructive")}
                                min="0"
                              />
                            </div>
                            {errors[`cost-${item.id}`] && (
                              <span className="text-[10px] text-destructive block font-medium">
                                {errors[`cost-${item.id}`]}
                              </span>
                            )}
                            {isCostAlert && (
                              <span className={cn("text-[9px] block font-medium leading-tight", priceDiffPercent > 0 ? "text-amber-500" : "text-primary")}>
                                {priceDiffPercent > 0
                                  ? `⚠️ Price +${priceDiffPercent.toFixed(0)}%`
                                  : `📉 Price ${priceDiffPercent.toFixed(0)}%`}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Tax % */}
                        <td className="px-3 py-3 align-middle">
                          <div className="relative flex items-center w-20">
                            <Input
                              type="number"
                              value={item.taxPercent || ""}
                              onChange={(e) => handleTaxPercentChange(item.id, e.target.value)}
                              placeholder="0"
                              className="bg-background/30 h-8 pr-6 text-right border-input focus:ring-0 text-xs w-full"
                              min="0"
                              max="100"
                            />
                            <span className="absolute right-2 text-[10px] text-muted-foreground font-semibold">
                              %
                            </span>
                          </div>
                        </td>

                        {/* Discount Flat */}
                        <td className="px-3 py-3 align-middle">
                          <div className="relative flex items-center w-24">
                            <span className="absolute left-2 text-[10px] text-muted-foreground font-medium">
                              Tk.
                            </span>
                            <Input
                              type="number"
                              value={item.discountFlat || ""}
                              onChange={(e) => handleDiscountFlatChange(item.id, e.target.value)}
                              placeholder="0"
                              className="pl-6 bg-background/30 h-8 text-right border-input focus:ring-0 text-xs w-full"
                              min="0"
                            />
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="px-4 py-3 align-middle text-right font-medium">
                          <div className="flex items-center justify-end gap-3.5">
                            <span className="font-semibold text-foreground text-xs shrink-0">
                              Tk. {((item.quantity * item.unitCost) - item.discountFlat + (item.taxAmount || 0)).toFixed(2)}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeItemRow(item.id)}
                              className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Sub-Row */}
                      {item.isExpanded && (
                        <tr className="bg-muted/15">
                          <td colSpan={9} className="px-6 py-4 border-t border-border">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {/* Batch Tracking */}
                              <div className="space-y-3 p-4 bg-background/40 border border-border/50 rounded-lg shadow-2xs">
                                <div className="flex items-center justify-between">
                                  <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={item.trackBatch}
                                      onChange={(e) => handleToggleTrackBatch(item.id, e.target.checked)}
                                      className="rounded border-input text-primary focus:ring-primary h-3.5 w-3.5"
                                    />
                                    {isBangla ? "ব্যাচ ট্র্যাকিং সক্রিয়" : "Track Batch"}
                                  </Label>
                                </div>
                                {item.trackBatch && (
                                  <div className="space-y-2.5 pt-1.5">
                                    <div>
                                      <Label className="text-[10px] font-semibold text-muted-foreground uppercase">{isBangla ? "ব্যাচ নম্বর" : "Batch Number"}</Label>
                                      <Input
                                        value={item.batchNumber}
                                        onChange={(e) => handleRowFieldChange(item.id, "batchNumber", e.target.value)}
                                        placeholder="e.g. BAT-2026-001"
                                        className="h-8 text-xs bg-background/50 border-input mt-1"
                                      />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase">{isBangla ? "উৎপাদন" : "Mfg Date"}</Label>
                                        <Input
                                          type="date"
                                          value={item.manufactureDate ? format(item.manufactureDate, "yyyy-MM-dd") : ""}
                                          onChange={(e) => handleRowFieldChange(item.id, "manufactureDate", e.target.value ? new Date(e.target.value) : undefined)}
                                          className="h-8 text-xs bg-background/50 border-input mt-1"
                                        />
                                      </div>
                                      <div>
                                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase">{isBangla ? "মেয়াদোত্তীর্ণ" : "Exp Date"}</Label>
                                        <Input
                                          type="date"
                                          value={item.expiryDate ? format(item.expiryDate, "yyyy-MM-dd") : ""}
                                          onChange={(e) => handleRowFieldChange(item.id, "expiryDate", e.target.value ? new Date(e.target.value) : undefined)}
                                          className="h-8 text-xs bg-background/50 border-input mt-1"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Row Notes */}
                              <div className="space-y-3 p-4 bg-background/40 border border-border/50 rounded-lg shadow-2xs flex flex-col justify-between">
                                <div>
                                  <Label className="text-xs font-semibold text-foreground">{isBangla ? "আইটেম নোট" : "Item Notes"}</Label>
                                  <Textarea
                                    value={item.rowNote || ""}
                                    onChange={(e) => handleRowFieldChange(item.id, "rowNote", e.target.value)}
                                    placeholder={isBangla ? "এই পণ্যের কোনো মন্তব্য..." : "Any notes for this specific item..."}
                                    className="min-h-[70px] text-xs bg-background/50 border-input mt-1 resize-none flex-1"
                                  />
                                </div>
                              </div>

                              {/* Inventory Info */}
                              <div className="space-y-2 p-4 bg-background/40 border border-border/50 rounded-lg shadow-2xs text-[11px]">
                                <p className="font-semibold text-foreground border-b border-border/50 pb-1 flex items-center gap-1">
                                  <Store className="h-3.5 w-3.5 text-primary shrink-0" />
                                  <span>{isBangla ? "ইনভেন্টরি বিশ্লেষণ" : "Inventory Analysis"}</span>
                                </p>
                                {item.itemId ? (
                                  <div className="grid grid-cols-2 gap-y-2 gap-x-3 pt-1">
                                    <div>
                                      <p className="text-muted-foreground">{isBangla ? "উপলব্ধ স্টক" : "Available Stock"}</p>
                                      <p className="font-semibold text-foreground mt-0.5">{item.currentStock} {item.unit}</p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground">{isBangla ? "সর্বশেষ ক্রয় মূল্য" : "Last Cost"}</p>
                                      <p className="font-semibold text-foreground mt-0.5">{formatCurrency(item.lastPurchasePrice || 0)}</p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground">{isBangla ? "গড় ক্রয় মূল্য" : "Avg Cost"}</p>
                                      <p className="font-semibold text-foreground mt-0.5">{formatCurrency(item.averageCost || 0)}</p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground">{isBangla ? "পূর্ববর্তী সরবরাহকারী" : "Prev Supplier"}</p>
                                      <p className="font-semibold text-foreground truncate mt-0.5" title={item.previousSupplierName}>
                                        {item.previousSupplierName || "—"}
                                      </p>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-muted-foreground italic text-center pt-4">
                                    {isBangla ? "কোনো পণ্য নির্বাচিত নেই" : "No product selected"}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Suspense>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Bottom Add Action */}
          <div className="flex justify-between items-center px-5 py-3.5 bg-muted/10 border-t border-border">
            <button
              type="button"
              onClick={addItemRow}
              className="text-primary font-semibold text-xs flex items-center gap-1 hover:text-primary/80 transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              {isBangla ? "বিল আইটেম যোগ করুন" : "Add Billing Item"}
            </button>
            <div className="flex items-center gap-8 text-xs">
              <span className="text-muted-foreground font-medium">
                {isBangla ? "উপমোট" : "Sub Total"}
              </span>
              <span className="font-bold text-foreground text-sm">
                Tk. {subtotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

          {/* Payment Section */}
          <div className="bg-zinc-900/20 border border-border rounded-xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <span className="text-sm font-semibold text-foreground">
                {isBangla ? "পেমেন্ট তথ্য" : "Payment Information"}
              </span>
              <button
                type="button"
                onClick={addPaymentRow}
                className="text-primary font-semibold text-xs flex items-center gap-1 hover:text-primary/80 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                {isBangla ? "পেমেন্ট পদ্ধতি যোগ করুন" : "Add Payment Row"}
              </button>
            </div>

            <div className="space-y-4">
              {payments.map((p, index) => (
                <div key={p.id} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end bg-background/20 p-3.5 rounded-lg border border-border/40 relative">
                  {/* Payment Method */}
                  <div className="space-y-1.5 md:col-span-1">
                    <Label className="text-[10px] font-semibold text-muted-foreground uppercase">{isBangla ? "পদ্ধতি" : "Method"}</Label>
                    <Select
                      value={p.method}
                      onValueChange={(val: any) => handlePaymentFieldChange(p.id, "method", val)}
                    >
                      <SelectTrigger className="h-9 text-xs bg-background/50 border-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">{isBangla ? "নগদ (Cash)" : "Cash"}</SelectItem>
                        <SelectItem value="bank">{isBangla ? "ব্যাংক (Bank)" : "Bank Transfer"}</SelectItem>
                        <SelectItem value="card">{isBangla ? "কার্ড (Card)" : "Card"}</SelectItem>
                        <SelectItem value="bkash">bKash</SelectItem>
                        <SelectItem value="nagad">Nagad</SelectItem>
                        <SelectItem value="rocket">Rocket</SelectItem>
                        <SelectItem value="cheque">{isBangla ? "চেক (Cheque)" : "Cheque"}</SelectItem>
                        <SelectItem value="other">{isBangla ? "অন্যান্য" : "Other"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Account selection */}
                  <div className="space-y-1.5 md:col-span-1.5">
                    <Label className="text-[10px] font-semibold text-muted-foreground uppercase">{isBangla ? "অ্যাকাউন্ট" : "Account"}</Label>
                    <Select
                      value={p.accountId}
                      onValueChange={(val) => handlePaymentFieldChange(p.id, "accountId", val)}
                    >
                      <SelectTrigger className="h-9 text-xs bg-background/50 border-input">
                        <SelectValue placeholder={isBangla ? "নির্বাচন করুন" : "Select Account"} />
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

                  {/* Reference */}
                  <div className="space-y-1.5 md:col-span-1">
                    <Label className="text-[10px] font-semibold text-muted-foreground uppercase">{isBangla ? "রেফারেন্স" : "Reference"}</Label>
                    <Input
                      value={p.reference}
                      onChange={(e) => handlePaymentFieldChange(p.id, "reference", e.target.value)}
                      placeholder="e.g. check no"
                      className="h-9 text-xs bg-background/50 border-input"
                    />
                  </div>

                  {/* Transaction ID */}
                  <div className="space-y-1.5 md:col-span-1">
                    <Label className="text-[10px] font-semibold text-muted-foreground uppercase">{isBangla ? "লেনদেন আইডি" : "TXN ID"}</Label>
                    <Input
                      value={p.transactionId}
                      onChange={(e) => handlePaymentFieldChange(p.id, "transactionId", e.target.value)}
                      placeholder="TXN-xxxx"
                      className="h-9 text-xs bg-background/50 border-input"
                    />
                  </div>

                  {/* Amount */}
                  <div className="space-y-1.5 md:col-span-1">
                    <Label className="text-[10px] font-semibold text-muted-foreground uppercase">{isBangla ? "পরিমাণ *" : "Amount *"}</Label>
                    <Input
                      type="number"
                      value={p.amount || ""}
                      onChange={(e) => handlePaymentFieldChange(p.id, "amount", parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="h-9 text-xs bg-background/50 border-input text-right font-semibold"
                    />
                  </div>

                  {/* Delete button */}
                  <div className="flex justify-end items-center h-9 md:col-span-0.5 pb-0.5">
                    <button
                      type="button"
                      disabled={payments.length === 1}
                      onClick={() => removePaymentRow(p.id)}
                      className="text-muted-foreground hover:text-red-500 transition-colors p-1 disabled:opacity-30 disabled:pointer-events-none"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              {errors.payments && <p className="text-[10px] text-destructive font-medium">{errors.payments}</p>}
            </div>
          </div>

          {/* Notes and Attachments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-900/20 border border-border rounded-xl p-5 shadow-xs">
            {/* Notes */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-foreground">
                {isBangla ? "মন্তব্য বা বিশেষ নির্দেশনা" : "Remarks or Special Notes"}
              </Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={isBangla ? "অতিরিক্ত বিবরণ লিখুন..." : "Enter additional purchase remarks..."}
                className="min-h-[100px] bg-background/50 border-input resize-none text-xs"
              />
            </div>

            {/* Attachments */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-foreground">
                {isBangla ? "চালান বা ছবি সংযুক্ত করুন" : "Attach Invoice / Images / Documents"}
              </Label>
              <div className="flex flex-wrap gap-2.5 items-center">
                <label className="h-14 w-14 rounded-lg border border-dashed border-border/80 flex flex-col items-center justify-center bg-background/20 hover:bg-muted/50 hover:border-primary transition-all text-muted-foreground hover:text-foreground cursor-pointer">
                  <Camera className="h-4 w-4 mb-0.5" />
                  <span className="text-[9px]">
                    {isBangla ? "আপলোড" : "Upload"}
                  </span>
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
                
                {/* Previews */}
                {attachments.map((file, idx) => (
                  <div key={idx} className="h-14 w-14 rounded-lg border border-border bg-background/40 flex items-center justify-center relative group p-1">
                    {file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt="attachment preview"
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
          </div>
        </div>

        {/* Right Section: Purchase Summary Sticky Panel */}
        <div className="lg:col-span-1 lg:sticky lg:top-6 space-y-6">
          {/* Purchase Summary Card */}
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

              {/* Status Selector */}
              <div className="flex justify-between items-center text-muted-foreground pt-2.5 border-t border-border/40">
                <span className="font-semibold text-foreground">{isBangla ? "ক্রয় স্ট্যাটাস" : "Purchase Status"}</span>
                <div className="w-28">
                  <Select value={purchaseStatus} onValueChange={setPurchaseStatus}>
                    <SelectTrigger className="h-8 text-xs bg-background/50 border-input font-medium text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="received">{isBangla ? "গৃহীত (Received)" : "Received"}</SelectItem>
                      <SelectItem value="pending">{isBangla ? "পেন্ডিং (Pending)" : "Pending"}</SelectItem>
                      <SelectItem value="draft">{isBangla ? "খসড়া (Draft)" : "Draft"}</SelectItem>
                      <SelectItem value="cancelled">{isBangla ? "বাতিল (Cancelled)" : "Cancelled"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Submit Action Buttons */}
            <div className="space-y-2 pt-3 border-t border-border">
              <Button
                type="button"
                onClick={() => handleSubmitWithStatus(purchaseStatus, "redirect")}
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
                    <span>{isBangla ? "স্টক যোগ করুন (Save)" : "Add Stock (Save)"}</span>
                  </>
                )}
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSubmitWithStatus("draft", "clear")}
                  disabled={isPending}
                  className="h-9 text-xs border-input hover:bg-muted font-medium cursor-pointer"
                >
                  {isBangla ? "খসড়া রাখুন" : "Save Draft"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSubmitWithStatus("received", "clear")}
                  disabled={isPending}
                  className="h-9 text-xs border-input hover:bg-muted font-medium cursor-pointer"
                >
                  {isBangla ? "সংরক্ষণ ও নতুন" : "Save & New"}
                </Button>
              </div>

              <Button
                type="button"
                variant="secondary"
                onClick={() => handleSubmitWithStatus(purchaseStatus, "print")}
                disabled={isPending}
                className="w-full h-9 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText className="h-4 w-4" />
                <span>{isBangla ? "সংরক্ষণ ও প্রিন্ট" : "Save & Print"}</span>
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
