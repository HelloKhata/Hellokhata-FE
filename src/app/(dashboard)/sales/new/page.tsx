"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { BackButton, PageHeader } from "@/components/common";
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
import { Switch } from "@/components/ui/switch";
import {
  Banknote,
  CreditCard,
  Smartphone,
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
  Phone,
  Package,
  AlertCircle,
  Lock,
  Plus,
  Minus,
  User,
  ChevronDown,
  ScanBarcode,
  Info,
} from "lucide-react";
import { useCurrency, useAppTranslation } from "@/hooks/useAppTranslation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useGetItems, useGetItemBatches } from "@/hooks/api/useItems";
import { useParties } from "@/hooks/api/useParties";
import { useCreateSales } from "@/hooks/api/useSales";
import { useGetOffers } from "@/hooks/api/useOffers";
import { useGetPaymentMethods } from "@/hooks/api/usePaymentMethod";
import { Offer, POSAppliedOffer, calculateBogoOffer, calculatePercentageOffer, calculateFlatOffer, calculateBundleOffer } from "@/types/offer.types";
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

const METHODS = [
  { id: "cash", label: "Cash", icon: Banknote, accent: "var(--emerald-500)", colorClass: "text-emerald-500", bgClass: "bg-emerald-500/10", borderClass: "border-emerald-500/20" },
  { id: "bank", label: "Bank/Card", icon: CreditCard, accent: "var(--blue-500)", colorClass: "text-blue-500", bgClass: "bg-blue-500/10", borderClass: "border-blue-500/20" },
  { id: "mobile_banking", label: "Mobile Banking", icon: Smartphone, accent: "var(--orange-500)", colorClass: "text-orange-500", bgClass: "bg-orange-500/10", borderClass: "border-orange-500/20" },
];

interface BillingItemRow {
  id: string;
  itemId: string;
  itemName: string;
  batchNo?: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  taxRate: number;
  taxAmount: number;
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


function NewSaleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const partyIdParam = searchParams.get("partyId") || "";
  const { t, isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const { mutate, isPending } = useCreateSales();

  // API Data
  const [phoneSearchQuery, setPhoneSearchQuery] = useState("");
  const [debouncedPartySearchQuery, setDebouncedPartySearchQuery] =
    useState("");

  const [showPartySuggestions, setShowPartySuggestions] = useState(false);
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [showProductSuggestions, setShowProductSuggestions] = useState(false);
  const [invoiceDate, setInvoiceDate] = useState<Date>(new Date());

    // Form State
  const [selectedParty, setSelectedParty] = useState<any>(null);
  const [selectedPartyId, setSelectedPartyId] = useState<string>(partyIdParam);

  // Debounce phone search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPartySearchQuery(phoneSearchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [phoneSearchQuery]);



  // Batch selection in search suggestion dropdown
  const [selectedProductForBatch, setSelectedProductForBatch] = useState<any>(null);


  const [splitMode, setSplitMode] = useState(false);
  const [activeSplitMethod, setActiveSplitMethod] = useState<string>("cash");



  // New Fields (VAT, Additional Charge)
  const [vatConfig, setVatConfig] = useState<{ type: "flat" | "percent"; value: number }>({
    type: "flat",
    value: 0,
  });
  const [additionalCharge, setAdditionalCharge] = useState<string>("0");

  // Modal Controls
  const [isEditVatOpen, setIsEditVatOpen] = useState(false);

  // Modal temporary values
  const [tempVatType, setTempVatType] = useState<"flat" | "percent">("flat");
  const [tempVatValue, setTempVatValue] = useState<string>("0");

  // Billing Items Table Rows
  const [selectedItems, setSelectedItems] = useState<BillingItemRow[]>([]);

  // Mobile UX States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isMobileCustomerModalOpen, setIsMobileCustomerModalOpen] = useState(false);
  const [isMoreModalOpen, setIsMoreModalOpen] = useState(false);
  const [mobileCustomerSearch, setMobileCustomerSearch] = useState("");
  const [mobileProductSearch, setMobileProductSearch] = useState("");
  const [modalQuantities, setModalQuantities] = useState<Record<string, number>>({});
  const [editingItemForPrice, setEditingItemForPrice] = useState<BillingItemRow | null>(null);
  const [tempNewPrice, setTempNewPrice] = useState<string>("");
  const [mobileDiscountType, setMobileDiscountType] = useState<"fixed" | "percent">("fixed");
  const [mobileDiscountValue, setMobileDiscountValue] = useState<string>("");

  const { data: items } = useGetItems({ search: productSearchQuery || mobileProductSearch, page: 1, limit: 100 });

  const { data: batchesData, isLoading: loadingBatches } = useGetItemBatches(
    selectedProductForBatch?.id || "",
    { enabled: !!selectedProductForBatch?.id }
  );
const itemsBatches = batchesData?.batches;
  const { data: partiesData = [] } = useParties({type:'customer',search:debouncedPartySearchQuery,includeWalkIn:true, page: 1, limit: 100});
  const { data: paymentMethods = [] } = useGetPaymentMethods();

  // Fetch active offers for auto-detection
  const { data: offersData } = useGetOffers({ status: "active" });
  const activeOffers: Offer[] = offersData?.data || [];

    const parties = useMemo(() => {
    return Array.isArray(partiesData) ? partiesData : (partiesData as any)?.data || [];
  }, [partiesData]);

  // Find active offer for a product+batch combination
  const findActiveOffer = (itemId: string, batchNo?: string): Offer | null => {
    if (!itemId) return null;
    const match = activeOffers.find(
      (o) =>
        o.productId === itemId &&
        o.status === "active" &&
        (!o.batchId || !batchNo || o.batchId === batchNo)
    );
    return match || null;
  };

 
  const accounts = useMemo(() => {
    return paymentMethods.map((pm: any) => ({
      id: pm.id,
      name: pm.name || pm.bankName || pm.provider || '',
      balance: pm.currentBalance || pm.openingBalance || 0,
      type: pm.type
    }));
  }, [paymentMethods]);

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
  
  // Default customer name fallback
  const defaultCustomerName = isBangla ? "ওয়াকিং কাস্টমার" : "Walking Customer";

  // Handle selecting party
  const handleSelectParty = (party: any) => {
    setSelectedParty(party);
    setSelectedPartyId(party.id);
    setPhoneSearchQuery(party.phone || "");
    setShowPartySuggestions(false);
  };

  // Handle Customer Phone change with auto-selection
  const handlePhoneChange = (inputVal: string) => {
    setPhoneSearchQuery(inputVal);
    const cleanInput = inputVal.trim().replace(/[\s\-\+\(\)]/g, "");

    if (!cleanInput) {
      if (selectedParty) {
        setSelectedParty(null);
        setSelectedPartyId("");
      }
      return;
    }

    // Match party by phone number in DB
    const matched = parties.find((p: any) => {
      if (!p.phone) return false;
      const cleanPhone = p.phone.trim().replace(/[\s\-\+\(\)]/g, "");
      return cleanPhone === cleanInput || p.phone.trim() === inputVal.trim();
    });

    if (matched) {
      setSelectedParty(matched);
      setSelectedPartyId(matched.id);
    } else {
      if (selectedParty) {
        setSelectedParty(null);
        setSelectedPartyId("");
      }
    }
  };

  // Calculations 
  const rawSubtotal = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  }, [selectedItems]);

  const totalDiscount = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + item.discountFlat, 0);
  }, [selectedItems]);

  const totalOfferSavings = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + (item.offerSavings || 0), 0);
  }, [selectedItems]);

  const subtotalAfterDiscount = useMemo(() => {
    return Math.max(0, rawSubtotal - totalDiscount);
  }, [rawSubtotal, totalDiscount]);

  const totalTax = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + (item.taxAmount || 0), 0);
  }, [selectedItems]);

  const vatVal = useMemo(() => {
    if (vatConfig.type === "flat") {
      return vatConfig.value;
    } else {
      return parseFloat((subtotalAfterDiscount * (vatConfig.value / 100)).toFixed(2)) || 0;
    }
  }, [vatConfig, subtotalAfterDiscount]);

  const additionalChargeVal = useMemo(() => {
    return parseFloat(additionalCharge) || 0;
  }, [additionalCharge]);

  const grandTotal = useMemo(() => {
    return Math.max(0, subtotalAfterDiscount + totalTax + vatVal + additionalChargeVal);
  }, [subtotalAfterDiscount, totalTax, vatVal, additionalChargeVal]);

  // Mobile specific discount, payable amount, and list filters
  const mobileDiscountAmount = useMemo(() => {
    const val = parseFloat(mobileDiscountValue) || 0;
    if (val <= 0) return 0;
    if (mobileDiscountType === "fixed") {
      return Math.min(rawSubtotal, val);
    } else {
      const pct = Math.min(100, Math.max(0, val));
      return parseFloat(((rawSubtotal * pct) / 100).toFixed(2));
    }
  }, [mobileDiscountType, mobileDiscountValue, rawSubtotal]);

  const mobilePayableTotal = useMemo(() => {
    return Math.max(0, rawSubtotal - mobileDiscountAmount + totalTax + vatVal + additionalChargeVal);
  }, [rawSubtotal, mobileDiscountAmount, totalTax, vatVal, additionalChargeVal]);

  const mobileFilteredProducts = useMemo(() => {
    const list = Array.isArray(items) ? items : (items as any)?.data || (items as any)?.items || [];
    if (!mobileProductSearch.trim()) return list;
    const q = mobileProductSearch.toLowerCase().trim();
    return list.filter((p: any) =>
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.sku && p.sku.toLowerCase().includes(q)) ||
      (p.barcode && p.barcode.toLowerCase().includes(q))
    );
  }, [items, mobileProductSearch]);

  const mobileFilteredParties = useMemo(() => {
    if (!mobileCustomerSearch.trim()) return parties;
    const q = mobileCustomerSearch.toLowerCase().trim();
    return parties.filter((p: any) =>
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.phone && p.phone.toLowerCase().includes(q))
    );
  }, [parties, mobileCustomerSearch]);

  const totalPaid = useMemo(() => {
    return payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  }, [payments]);

  const due = useMemo(() => {
    return Math.max(0, grandTotal - totalPaid);
  }, [grandTotal, totalPaid]);

  const changeReturned = useMemo(() => {
    return Math.max(0, totalPaid - grandTotal);
  }, [totalPaid, grandTotal]);

  // Validation & Warnings
  const [paymentWarning, setPaymentWarning] = useState<string | null>(null);

  const isPaidAmountExceeded = useMemo(() => {
    return totalPaid > grandTotal;
  }, [totalPaid, grandTotal]);

  const currentWarning = useMemo(() => {
    if (paymentWarning) return paymentWarning;
    if (totalPaid > grandTotal) {
      return isBangla
        ? `পরিশোধিত পরিমাণ মোট পরিমাণের চেয়ে বেশি হতে পারে না (সর্বোচ্চ: ${formatCurrency(grandTotal)})`
        : `Paid amount cannot exceed grand total (Max allowed: ${formatCurrency(grandTotal)})`;
    }
    return null;
  }, [paymentWarning, totalPaid, grandTotal, isBangla, formatCurrency]);

  const toggleSplitMode = () => {
    setPaymentWarning(null);
    if (splitMode) {
      // Revert to single payment mode
      setPayments([
        {
          id: Math.random().toString(),
          method: "cash",
          accountId: "",
          reference: "",
          transactionId: "",
          amount: Math.min(totalPaid || grandTotal, grandTotal),
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
          amount: Math.min(totalPaid || grandTotal, grandTotal),
          date: new Date(),
        },
        {
          id: "bank-split",
          method: "bank",
          accountId: "",
          reference: "",
          transactionId: "",
          amount: 0,
          date: new Date(),
        },
        {
          id: "mobile-split",
          method: "mobile_banking",
          accountId: "",
          reference: "",
          transactionId: "",
          amount: 0,
          date: new Date(),
        }
      ]);
    }
    setSplitMode(!splitMode);
  };

  const handlePaymentFieldChange = (id: string, field: keyof PaymentRow, value: any) => {
    if (field === "amount") {
      const numValue = typeof value === "number" ? value : parseFloat(value) || 0;

      if (numValue < 0) {
        setPaymentWarning(
          isBangla
            ? "পরিশোধের পরিমাণ ঋণাত্মক হতে পারে না"
            : "Paid amount cannot be negative"
        );
        return;
      }

      // Calculate total paid by other payments (in split mode)
      const otherPaymentsTotal = payments
        .filter((p) => p.id !== id)
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      const maxAllowed = Math.max(0, parseFloat((grandTotal - otherPaymentsTotal).toFixed(2)));

      if (numValue > maxAllowed) {
        setPaymentWarning(
          isBangla
            ? `পরিশোধের পরিমাণ সর্বমোট টাকার বেশি হতে পারবে না (সর্বোচ্চ: ${formatCurrency(maxAllowed)})`
            : `Paid amount cannot exceed grand total (Max allowed: ${formatCurrency(maxAllowed)})`
        );
        return; // The input field cannot receive data when exceeded
      } else {
        setPaymentWarning(null);
      }
    }

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

  // Calculate Item Tax Amount helper
  const calculateItemTaxAmount = (
    qty: number,
    price: number,
    flatDiscount: number,
    taxRate: number,
  ) => {
    const taxableAmount = Math.max(0, qty * price - flatDiscount);
    return parseFloat((taxableAmount * (taxRate / 100)).toFixed(2)) || 0;
  };

    // Calculate Row Total helper
  const calculateRowTotal = (
    qty: number,
    price: number,
    flatDiscount: number,
  ) => {
    return Math.max(0, qty * price - flatDiscount);
  };
  
  // Add Product to Table with chosen batch
  const handleSelectBatchAndAdd = (product: any, batch?: any) => {
    if (!product) return;
    const batchNo = batch?.batchNumber || batch?.batchNo || batch?.name || "";
    const price = batch?.sellingPrice || batch?.unitPrice || product.sellingPrice || 0;
    const costPrice = batch?.costPrice || product.costPrice || 0;
    const taxRate = Number(
      batch?.taxRate ??
      batch?.taxPercent ??
      product?.taxRate ??
      product?.taxPercent ??
      product?.taxCategory?.rate ??
      product?.tax ??
      0
    );

    setSelectedItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.itemId === product.id && (item.batchNo || "") === batchNo
      );

      if (existingIndex > -1) {
        return prev.map((item, idx) => {
          if (idx === existingIndex) {
            const newQty = item.quantity + 1;
            const flatDiscount = item.discountFlat || 0;
            const total = calculateRowTotal(newQty, price, flatDiscount);
            const rowTaxRate = item.taxRate ?? taxRate;
            const taxAmount = calculateItemTaxAmount(newQty, price, flatDiscount, rowTaxRate);

            const offer = findActiveOffer(product.id, batchNo);
            let appliedOffer: POSAppliedOffer | null = null;
            let chargedQty = newQty;
            let freeQty = 0;
            let offerSavings = 0;

            if (offer) {
              switch (offer.type) {
                case "bogo":
                  appliedOffer = calculateBogoOffer(
                    newQty,
                    offer.bogoConfig?.buyQuantity || 1,
                    offer.bogoConfig?.freeQuantity || 1,
                    price,
                  );
                  break;
                case "percentage":
                  appliedOffer = calculatePercentageOffer(
                    newQty,
                    offer.percentageConfig?.percentage || 0,
                    price,
                  );
                  break;
                case "flat":
                  appliedOffer = calculateFlatOffer(
                    newQty,
                    offer.flatConfig?.amount || 0,
                    offer.flatConfig?.scope || "per_unit",
                    price,
                  );
                  break;
                case "bundle":
                  appliedOffer = calculateBundleOffer(
                    newQty,
                    offer.bundleConfig?.bundleQuantity || 2,
                    offer.bundleConfig?.bundlePrice || 0,
                    price,
                  );
                  break;
              }
              if (appliedOffer) {
                appliedOffer.offerId = offer.id;
                chargedQty = appliedOffer.chargedQuantity;
                freeQty = appliedOffer.freeQuantity;
                offerSavings = appliedOffer.savings;
              }
            }

            return {
              ...item,
              quantity: newQty,
              unitPrice: price,
              taxRate: rowTaxRate,
              taxAmount,
              total,
              appliedOffer,
              chargedQuantity: chargedQty,
              freeQuantity: freeQty,
              offerSavings,
            };
          }
          return item;
        });
      }

      const offer = findActiveOffer(product.id, batchNo);
      let appliedOffer: POSAppliedOffer | null = null;
      let chargedQty = 1;
      let freeQty = 0;
      let offerSavings = 0;

      if (offer) {
        switch (offer.type) {
          case "bogo":
            appliedOffer = calculateBogoOffer(
              1,
              offer.bogoConfig?.buyQuantity || 1,
              offer.bogoConfig?.freeQuantity || 1,
              price,
            );
            break;
          case "percentage":
            appliedOffer = calculatePercentageOffer(
              1,
              offer.percentageConfig?.percentage || 0,
              price,
            );
            break;
          case "flat":
            appliedOffer = calculateFlatOffer(
              1,
              offer.flatConfig?.amount || 0,
              offer.flatConfig?.scope || "per_unit",
              price,
            );
            break;
          case "bundle":
            appliedOffer = calculateBundleOffer(
              1,
              offer.bundleConfig?.bundleQuantity || 2,
              offer.bundleConfig?.bundlePrice || 0,
              price,
            );
            break;
        }
        if (appliedOffer) {
          appliedOffer.offerId = offer.id;
          chargedQty = appliedOffer.chargedQuantity;
          freeQty = appliedOffer.freeQuantity;
          offerSavings = appliedOffer.savings;
        }
      }

      const initialTaxAmount = calculateItemTaxAmount(1, price, 0, taxRate);

      const newItemRow: BillingItemRow = {
        id: Math.random().toString(),
        itemId: product.id,
        itemName: product.name,
        batchNo: batchNo,
        quantity: 1,
        unitPrice: price,
        costPrice: costPrice,
        taxRate: taxRate,
        taxAmount: initialTaxAmount,
        discountPercent: 0,
        discountFlat: 0,
        total: price,
        searchQuery: "",
        showSuggestions: false,
        imageUrl: product.imageUrl || "",
        appliedOffer,
        chargedQuantity: chargedQty,
        freeQuantity: freeQty,
        offerSavings,
      };

      const emptyRowIndex = prev.findIndex((i) => i.itemId === "");
      if (emptyRowIndex > -1 && prev.length === 1) {
        return [newItemRow];
      }

      return [...prev.filter((i) => i.itemId !== ""), newItemRow];
    });

    setProductSearchQuery("");
    setShowProductSuggestions(false);
    setSelectedProductForBatch(null);
  };

  // Handle selecting a product from search suggestions
  const handleSelectProduct = (product: any) => {
    if (!product) return;
    setSelectedProductForBatch(product);
  };

  // Auto-add product if it has 1 or fewer batches
  useEffect(() => {
    if (selectedProductForBatch && !loadingBatches && itemsBatches !== undefined) {
      if (itemsBatches.length <= 1) {
        handleSelectBatchAndAdd(selectedProductForBatch, itemsBatches[0] || null);
      }
    }
  }, [selectedProductForBatch, itemsBatches, loadingBatches]);

  // Remove Item Row
  const removeItemRow = (id: string) => {
    setSelectedItems((prev) => prev.filter((item) => item.id !== id));
  };



  // Handle Quantity Change
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
          const taxAmount = calculateItemTaxAmount(qty, price, flat, item.taxRate || 0);

          // Recalculate offer with new quantity
          let appliedOffer: POSAppliedOffer | null = null;
          let chargedQty = qty;
          let freeQty = 0;
          let offerSavings = 0;

          if (item.itemId && item.appliedOffer) {
            const offer = findActiveOffer(item.itemId, item.batchNo);
            if (offer) {
              switch (offer.type) {
                case 'bogo':
                  appliedOffer = calculateBogoOffer(
                    qty,
                    offer.bogoConfig?.buyQuantity || 1,
                    offer.bogoConfig?.freeQuantity || 1,
                    price
                  );
                  break;
                case 'percentage':
                  appliedOffer = calculatePercentageOffer(
                    qty,
                    offer.percentageConfig?.percentage || 0,
                    price
                  );
                  break;
                case 'flat':
                  appliedOffer = calculateFlatOffer(
                    qty,
                    offer.flatConfig?.amount || 0,
                    offer.flatConfig?.scope || 'per_unit',
                    price
                  );
                  break;
                case 'bundle':
                  appliedOffer = calculateBundleOffer(
                    qty,
                    offer.bundleConfig?.bundleQuantity || 2,
                    offer.bundleConfig?.bundlePrice || 0,
                    price
                  );
                  break;
              }
              if (appliedOffer) {
                appliedOffer.offerId = offer.id;
                chargedQty = appliedOffer.chargedQuantity;
                freeQty = appliedOffer.freeQuantity;
                offerSavings = appliedOffer.savings;
              }
            }
          }

          return {
            ...item,
            quantity: qty,
            discountFlat: flat,
            taxAmount,
            total,
            appliedOffer,
            chargedQuantity: chargedQty,
            freeQuantity: freeQty,
            offerSavings,
          };
        }
        return item;
      }),
    );
  };

  // Handle Rate Change
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
          const taxAmount = calculateItemTaxAmount(qty, rate, flat, item.taxRate || 0);
          return {
            ...item,
            unitPrice: rate,
            discountFlat: flat,
            taxAmount,
            total,
          };
        }
        return item;
      }),
    );
  };


  // Modal Actions
  const saveVat = () => {
    const val = parseFloat(tempVatValue) || 0;
    setVatConfig({ type: tempVatType, value: val });
    setIsEditVatOpen(false);
  };

  // Handle adding product from mobile modal with specified quantity
  const handleAddProductFromModal = (product: any, qtyToAdd: number = 1, batch?: any) => {
    if (!product) return;
    const batchNo = batch?.batchNumber || batch?.batchNo || batch?.name || "";
    const price = batch?.sellingPrice || batch?.unitPrice || product.sellingPrice || 0;
    const costPrice = batch?.costPrice || product.costPrice || 0;
    const taxRate = Number(
      batch?.taxRate ??
      batch?.taxPercent ??
      product?.taxRate ??
      product?.taxPercent ??
      product?.taxCategory?.rate ??
      product?.tax ??
      0
    );

    setSelectedItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.itemId === product.id && (item.batchNo || "") === batchNo
      );

      if (existingIndex > -1) {
        return prev.map((item, idx) => {
          if (idx === existingIndex) {
            const newQty = item.quantity + qtyToAdd;
            const flatDiscount = item.discountFlat || 0;
            const total = calculateRowTotal(newQty, price, flatDiscount);
            const rowTaxRate = item.taxRate ?? taxRate;
            const taxAmount = calculateItemTaxAmount(newQty, price, flatDiscount, rowTaxRate);

            return {
              ...item,
              quantity: newQty,
              unitPrice: price,
              taxRate: rowTaxRate,
              taxAmount,
              total,
            };
          }
          return item;
        });
      }

      const flatDiscount = 0;
      const total = calculateRowTotal(qtyToAdd, price, flatDiscount);
      const initialTaxAmount = calculateItemTaxAmount(qtyToAdd, price, 0, taxRate);

      const newItemRow: BillingItemRow = {
        id: Math.random().toString(),
        itemId: product.id,
        itemName: product.name,
        batchNo: batchNo,
        quantity: qtyToAdd,
        unitPrice: price,
        costPrice: costPrice,
        taxRate: taxRate,
        taxAmount: initialTaxAmount,
        discountPercent: 0,
        discountFlat: 0,
        total: total,
        searchQuery: "",
        showSuggestions: false,
        imageUrl: product.imageUrl || "",
        appliedOffer: null,
        chargedQuantity: qtyToAdd,
        freeQuantity: 0,
        offerSavings: 0,
      };

      const emptyRowIndex = prev.findIndex((i) => i.itemId === "");
      if (emptyRowIndex > -1 && prev.length === 1) {
        return [newItemRow];
      }

      return [...prev.filter((i) => i.itemId !== ""), newItemRow];
    });

    toast.success(
      isBangla ? `${product.name} যোগ করা হয়েছে` : `Added ${product.name}`
    );
  };

  // Handle submit form
  const handleSubmit = async () => {
    // Filter empty items
    const validItems = selectedItems.filter((i) => i.itemId !== "");
    if (validItems.length === 0) {
      toast.error(
        isBangla ? "অন্তত একটি পণ্য যোগ করুন" : "Add at least one item",
      );
      return;
    }

    const effectiveDiscount = mobileDiscountAmount > 0 ? mobileDiscountAmount : totalDiscount;
    const effectiveTotal = mobilePayableTotal > 0 ? mobilePayableTotal : grandTotal;

    if (totalPaid > effectiveTotal && payments.some(p => p.amount > 0)) {
      toast.error(
        isBangla ? "পরিশোধিত পরিমাণ মোট পরিমাণের চেয়ে বেশি হতে পারে না" : "Paid amount cannot exceed grand total",
      );
      return;
    }

    const paymentList = payments.filter((p) => p.amount > 0);
    const effectivePayments =
      paymentList.length > 0
        ? paymentList.map((p) => ({
            paymentId: p.accountId || (accounts.find((a: any) => a.type === p.method)?.id) || p.id,
            paymentType: p.method,
            amount: p.amount || 0,
          }))
        : [
            {
              paymentId: accounts.find((a: any) => a.type === "cash")?.id || "cash",
              paymentType: "cash",
              amount: effectiveTotal,
            },
          ];

    const payload = {
      customerPhone: selectedParty?.phone || phoneSearchQuery || undefined,
      customerName: selectedParty?.name || defaultCustomerName,
      discount: effectiveDiscount,
      tax: parseFloat(totalTax.toFixed(2)),
      additionalCharges: additionalChargeVal,
      notes: notes || undefined,
      items: validItems.map((item) => ({
        itemId: item.itemId,
        batchId: item.batchNo,
        itemName: item.itemName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      paymentMethods: effectivePayments,
    };

    mutate(payload, {
      onSuccess: () => {
        toast.success(
          isBangla
            ? "বিক্রি সফলভাবে সম্পন্ন হয়েছে"
            : "Sale completed successfully",
        );
        router.push("/sales");
      },
    });
  };

  // Render Product Search Box (Row 1 on desktop/mid, top of cards on small devices)
  const renderProductSearchField = () => (
    <div className="relative space-y-2">
      <Label className="text-sm font-medium text-foreground">
        {isBangla ? "পণ্য খুঁজুন" : "Search Product"}
      </Label>
      <div className="relative">
        <Input
          value={productSearchQuery}
          onChange={(e) => {
            setProductSearchQuery(e.target.value);
            setSelectedProductForBatch(null);
            setShowProductSuggestions(true);
          }}
          onFocus={() => setShowProductSuggestions(true)}
          onBlur={() => {
            setShowProductSuggestions(false);
            setSelectedProductForBatch(null);
          }}
          placeholder={
            isBangla
              ? "পণ্য সার্চ বা বারকোড স্ক্যান করুন"
              : "Search Or Scan Bar Code"
          }
          className="pr-9 h-11 bg-background/50 border-input focus-visible:ring-1 text-xs font-medium"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

        {showProductSuggestions && (
          <div className="absolute z-50 left-0 top-full mt-1 w-full bg-card border border-border rounded-lg shadow-xl max-h-72 overflow-y-auto divide-y divide-border text-foreground">
            {!selectedProductForBatch ? (
              /* STEP 1: PRODUCT LIST */
              items?.length === 0 ? (
                <div className="p-3 text-center text-xs text-muted-foreground">
                  {isBangla ? "কোনো পণ্য পাওয়া যায়নি" : "No items found"}
                </div>
              ) : (
                items?.map((product: any) => (
                  <button
                    key={product.id}
                    type="button"
                    className="w-full text-left p-2.5 hover:bg-muted/80 transition-colors flex items-center justify-between gap-3 text-foreground cursor-pointer"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectProduct(product);
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 rounded overflow-hidden bg-muted flex items-center justify-center border border-border/80 shrink-0">
                        <Image
                          src={product.imageUrl || "/images/image.png"}
                          alt={product.name}
                          width={32}
                          height={32}
                          className="h-8 w-8 object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate text-xs">
                          {product.name}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-[10px] text-muted-foreground">
                          <span>SKU: {product.sku || "-"}</span>
                          <span>•</span>
                          <span>Stock: {product.currentStock} {product.unit || ""}</span>
                          {Number(product.taxRate ?? product.taxPercent ?? product.tax ?? 0) > 0 && (
                            <>
                              <span>•</span>
                              <span className="text-amber-600 dark:text-amber-400 font-medium">
                                Tax: {Number(product.taxRate ?? product.taxPercent ?? product.tax ?? 0)}%
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 flex items-center gap-2">
                      <div>
                        <p className="font-bold text-primary text-xs">
                          {formatCurrency(product.sellingPrice || 0)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )
            ) : (
              /* STEP 2: BATCH LIST FOR SELECTED PRODUCT */
              <div className="divide-y divide-border">
                {/* Header with back button */}
                <div className="p-2.5 bg-muted/40 flex items-center justify-between gap-2 text-xs border-b border-border">
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setSelectedProductForBatch(null);
                    }}
                    className="flex items-center gap-1 font-medium text-primary hover:underline hover:text-primary-hover cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>{isBangla ? "পণ্য তালিকায় ফিরুন" : "Back to products"}</span>
                  </button>
                  <span className="font-semibold text-foreground truncate max-w-[150px]">
                    {selectedProductForBatch.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-bold font-mono">
                    {formatCurrency(selectedProductForBatch.sellingPrice || 0)}
                  </span>
                </div>

                {/* Batches list */}
                <div className="divide-y divide-border/60 max-h-56 overflow-y-auto">
                  {loadingBatches ? (
                    <div className="p-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span>{isBangla ? "ব্যাচ লোড হচ্ছে..." : "Loading batches..."}</span>
                    </div>
                  ) : (itemsBatches && itemsBatches.length > 0) ? (
                    itemsBatches.map((batch: any) => {
                      const bNo = batch?.batchNumber;
                      const stock = batch.quantity;
                      const price = batch.sellingPrice || batch.unitPrice || selectedProductForBatch.sellingPrice || 0;
                      const expiry = batch.expiryDate ? format(new Date(batch.expiryDate), "dd MMM yyyy") : null;
                      const bTax = Number(batch?.taxRate ?? batch?.taxPercent ?? selectedProductForBatch?.taxRate ?? selectedProductForBatch?.taxPercent ?? selectedProductForBatch?.tax ?? 0);

                      return (
                        <button
                          key={batch.id || bNo}
                          type="button"
                          className="w-full text-left p-2.5 hover:bg-muted/80 transition-colors flex items-center justify-between text-xs group cursor-pointer"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSelectBatchAndAdd(selectedProductForBatch, batch);
                          }}
                        >
                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-foreground font-mono truncate group-hover:text-primary transition-colors">
                                {bNo}
                              </span>
                              {batch.status && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/10 text-emerald-500 font-medium">
                                  {batch.status}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                              {stock !== undefined && (
                                <span>
                                  {isBangla ? "স্টক" : "Stock"}: <strong className="text-foreground">{stock}</strong>
                                </span>
                              )}
                              {expiry && (
                                <span>
                                  {isBangla ? "মেয়াদ" : "Exp"}: {expiry}
                                </span>
                              )}
                              {bTax > 0 && (
                                <span className="text-amber-600 dark:text-amber-400 font-medium">
                                  Tax: {bTax}%
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="font-bold text-primary text-xs block">
                              {formatCurrency(price)}
                            </span>
                            <span className="text-[10px] text-muted-foreground group-hover:text-primary font-medium">
                              {isBangla ? "যোগ করুন +" : "Select +"}
                            </span>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="p-3 text-center text-xs text-muted-foreground">
                      {isBangla ? "কোনো ব্যাচ পাওয়া যায়নি" : "No batches found"}
                    </div>
                  )}

                  {/* Option to add without specific batch */}
                  <button
                    type="button"
                    className="w-full text-left p-2 bg-muted/20 hover:bg-muted/60 transition-colors text-[11px] text-muted-foreground text-center font-medium cursor-pointer"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectBatchAndAdd(selectedProductForBatch, null);
                    }}
                  >
                    {isBangla ? "+ ব্যাচ ছাড়া যোগ করুন" : "+ Add without specific batch"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ========================================================= */}
      {/* DESKTOP & TABLET VIEW (md and up) - 100% UNCHANGED       */}
      {/* ========================================================= */}
      <div className="hidden md:block space-y-4 sm:space-y-6">
        {/* Top Header Section */}
        <PageHeader
          title={isBangla ? "নতুন বিক্রি" : "New Sale"}
          showBack
          fallbackHref="/sales"
        />


        <div className="w-full lg:flex-[3] min-w-0 space-y-4 sm:space-y-6">
          
          {/* Row 1 Layout: Search Product, Select Party, Party Phone Number, Invoice Date */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 items-end bg-card border border-border/50 rounded-xl p-3.5 sm:p-5 shadow-sm">
            {/* 1. Search Product (Search Or Scan Bar Code) - Desktop & Mid Screens */}
            <div className="hidden md:block">
              {renderProductSearchField()}
            </div>

            {/* 2. Customer Phone Number (Searches customer by phone) */}
            <div className="relative space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-foreground">
                  {isBangla ? "ফোন নম্বর" : "Customer Phone"}
                </Label>
                {selectedParty?.name && (
                  <span className="md:hidden text-[11px] font-semibold text-primary truncate max-w-[150px]">
                    {selectedParty.name}
                  </span>
                )}
              </div>
              <div className="relative">
                <Input
                  value={selectedParty ? (selectedParty.phone || "") : phoneSearchQuery}
                  onChange={(e) => {
                    handlePhoneChange(e.target.value);
                    setShowPartySuggestions(true);
                  }}
                  onFocus={() => setShowPartySuggestions(true)}
                  onBlur={() => {
                    setShowPartySuggestions(false)
                  }}
                  placeholder={isBangla ? "ফোন নম্বর..." : "Search phone..."}
                  className="pr-9 h-11 bg-background/50 border-input text-xs font-mono focus-visible:ring-1"
                />
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                {showPartySuggestions && (
                  <div className="absolute z-50 left-0 top-full mt-1 w-full bg-card border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto divide-y divide-border text-foreground">
                    {parties.length === 0 ? (
                      <div className="p-3 text-center text-xs text-muted-foreground">
                        {isBangla
                          ? "কোনো পার্টি পাওয়া যায়নি"
                          : "No parties found"}
                      </div>
                    ) : (
                      parties.map((party: any) => (
                        <button
                          key={party.id}
                          type="button"
                          className="w-full text-left p-2.5 hover:bg-muted/80 text-xs transition-colors flex justify-between items-center"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSelectParty(party);
                          }}
                        >
                          <span className="font-semibold text-foreground truncate max-w-[140px]">
                            {party.name}
                          </span>
                          {party.phone && (
                            <span className="text-[10px] text-muted-foreground font-mono">
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

            {/* 3. Customer Name (Disabled field) - Desktop & Mid Screens */}
            <div className="hidden md:block relative space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-foreground">
                  {isBangla ? "গ্রাহকের নাম" : "Customer Name"}
                </Label>
              </div>
              <div className="relative">
                <Input
                  value={selectedParty ? selectedParty.name : defaultCustomerName}
                  disabled
                  className="pr-9 h-11 border-input text-xs cursor-not-allowed  font-medium select-none"
                />
                {selectedParty ? (
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                ) : (
                  <Users className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>

           

            {/* 4. Invoice Date */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                {isBangla ? "ইনভয়েস তারিখ" : "Invoice Date"}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-11 justify-between text-left font-normal bg-background/50 border-input text-foreground hover:bg-muted text-xs px-3"
                  >
                    <span>{format(invoiceDate, "dd MMM yyyy")}</span>
                    <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />
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


      {/* 75% / 25% Split Layout Container */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start w-full">
        
        {/* left side */}
        {/* Row 3 Layout: Notes, Attachments — stacked vertically */}
          <div className="w-full flex flex-col gap-4 sm:gap-5 bg-card border border-border/50 rounded-xl p-3.5 sm:p-5 shadow-sm">
            {/* Row 2: Billing Items Table (Desktop & Mid Screens) */}
          <div className="hidden md:block w-full border border-border rounded-xl bg-card overflow-x-auto shadow-sm">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="px-4 py-3 w-[5%] text-xs font-semibold uppercase">
                    {isBangla ? "ক্রমিক" : "S.N."}
                  </TableHead>
                  <TableHead className="px-3 py-3 w-[5%] text-xs font-semibold uppercase">
                    {/* Thumbnail Image column */}
                  </TableHead>
                  <TableHead className="px-4 py-3 w-[35%] text-xs font-semibold uppercase">
                    {isBangla ? "প্রোডাক্ট" : "Product"}
                  </TableHead>
                  <TableHead className="px-4 py-3 w-[15%] text-xs font-semibold uppercase">
                    {isBangla ? "দর" : "Rate"}
                  </TableHead>
                  <TableHead className="px-4 py-3 w-[12%] text-xs font-semibold uppercase">
                    {isBangla ? "পরিমাণ" : "Quantity"}
                  </TableHead>
                  <TableHead className="px-4 py-3 w-[13%] text-xs font-semibold uppercase">
                    {isBangla ? "ট্যাক্স" : "Tax"}
                  </TableHead>
                  <TableHead className="px-4 py-3 w-[10%] text-right text-xs font-semibold uppercase">
                    {isBangla ? "মোট" : "Amount"}
                  </TableHead>
                  <TableHead className="px-4 py-3 w-[5%] text-right text-xs font-semibold uppercase">
                  
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border">
                {selectedItems.filter((i) => i.itemId).length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="px-4 py-12 text-center text-muted-foreground text-xs"
                    >
                      <div className="h-10 w-10 rounded-full bg-muted/60 flex items-center justify-center mx-auto text-muted-foreground mb-2">
                        <Package className="h-5 w-5" />
                      </div>
                      <p className="font-semibold text-foreground text-xs mb-1">
                        {isBangla ? "কোনো পণ্য যোগ করা হয়নি" : "No items added yet"}
                      </p>
                      <p className="text-[11px] text-muted-foreground mx-auto">
                        {isBangla
                          ? "উপরের সার্চ বক্স থেকে পণ্য সার্চ বা বারকোড স্ক্যান করে এই বিক্রয়ে যুক্ত করুন।"
                          : "Search or scan products from the search box above to add them to this sale."}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  selectedItems
                    .filter((i) => i.itemId)
                    .map((item, idx) => (
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
                          <div className="h-8 w-8 rounded overflow-hidden bg-muted flex items-center justify-center border border-border/80">
                            <Image
                              src={item.imageUrl || "/images/image.png"}
                              alt={item.itemName || "Product"}
                              width={32}
                              height={32}
                              className="h-8 w-8 object-cover"
                            />
                          </div>
                        </TableCell>

                        {/* Product Name */}
                        <TableCell className="px-4 py-3 align-middle font-medium">
                          {item.itemName ? (
                            <div>
                              <p className="font-semibold text-foreground text-sm">
                                {item.itemName}
                              </p>
                              {item.batchNo && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-[10px] font-mono border border-border/60 mt-0.5">
                                  Batch: {item.batchNo}
                                </span>
                              )}
                              {item.appliedOffer && (
                                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-bold">
                                    <Sparkles className="h-2.5 w-2.5" />
                                    {item.appliedOffer.title}
                                  </span>
                                  {item.freeQuantity > 0 && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                                      <Gift className="h-2.5 w-2.5" />
                                      {item.freeQuantity} Free
                                    </span>
                                  )}
                                  <span className="text-[10px] text-emerald-400 font-semibold">
                                    Saved: ৳{(item.offerSavings || 0).toFixed(2)}
                                  </span>
                                </div>
                              )}
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

                        {/* Tax Column */}
                        <TableCell className="px-4 py-3 align-middle">
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-foreground">
                              {item.taxRate || 0}%
                            </span>
                            <span className="text-[11px] text-muted-foreground font-medium">
                              Tk. {(item.taxAmount || 0).toFixed(2)}
                            </span>
                          </div>
                        </TableCell>

                        {/* Amount & Action */}
                        <TableCell className="px-4 py-3 align-middle text-right font-medium text-foreground">
                          <div className="flex items-center justify-end gap-3">
                            <span className="font-semibold text-foreground text-sm">
                              Tk. {item.total.toFixed(2)}
                            </span>
                            
                          </div>
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
                    ))
                )}
              </TableBody>
            </Table>

            {/* Table Bottom Add Action */}
            <div className="flex justify-end items-center px-6 py-4 bg-muted/10 border-t border-border">
              <div className="flex items-center gap-8">
                <span className="text-sm text-muted-foreground font-medium">
                  {isBangla ? "উপমোট" : "Sub Total"}
                </span>
                <span className="font-bold text-foreground text-base">
                  Tk. {subtotalAfterDiscount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Product Cards View (< md screens) */}
          <div className="md:hidden space-y-3">
            {/* Search Product Field on Top of Products Card in Small Devices */}
            <div className="pb-1">
              {renderProductSearchField()}
            </div>

            {selectedItems.filter((i) => i.itemId).length === 0 ? (
              <div className="border border-border/60 rounded-xl bg-card p-6 text-center shadow-xs">
                <div className="h-11 w-11 rounded-full bg-muted/60 flex items-center justify-center mx-auto text-muted-foreground mb-2.5">
                  <Package className="h-5 w-5" />
                </div>
                <p className="font-semibold text-foreground text-sm mb-1">
                  {isBangla ? "কোনো পণ্য যোগ করা হয়নি" : "No items added yet"}
                </p>
                <p className="text-xs text-muted-foreground md:max-w-xs mx-auto">
                  {isBangla
                    ? "উপরের সার্চ বক্স থেকে পণ্য সার্চ বা বারকোড স্ক্যান করে এই বিক্রয়ে যুক্ত করুন।"
                    : "Search or scan products from the search box above to add them to this sale."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Product count & subtotal header badge */}
                <div className="flex items-center justify-between px-1 text-xs text-muted-foreground font-medium">
                  <span>
                    {isBangla ? "পণ্য তালিকা" : "Selected Items"} ({selectedItems.filter((i) => i.itemId).length})
                  </span>
                  <span className="font-semibold text-foreground">
                    {isBangla ? "উপমোট" : "Subtotal"}: Tk. {subtotalAfterDiscount.toFixed(2)}
                  </span>
                </div>

                {selectedItems
                  .filter((i) => i.itemId)
                  .map((item, idx) => (
                    <div
                      key={item.id}
                      className="bg-card hover:bg-card/90 border border-border/70 rounded-xl p-3.5 shadow-xs space-y-3 transition-colors"
                    >
                      {/* Top Row: Thumbnail + Item info + Delete Button */}
                      <div className="flex items-start gap-3">
                        {/* Product Thumbnail with S.N. badge */}
                        <div className="relative shrink-0">
                          <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center border border-border/80">
                            <Image
                              src={item.imageUrl || "/images/image.png"}
                              alt={item.itemName || "Product"}
                              width={48}
                              height={48}
                              className="h-12 w-12 object-cover"
                            />
                          </div>
                          <span className="absolute -top-1.5 -left-1.5 h-4.5 min-w-4.5 px-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-500 text-[10px] font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                        </div>

                        {/* Title & tags */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-foreground text-sm leading-tight break-words">
                              {item.itemName}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeItemRow(item.id)}
                              className="text-muted-foreground hover:text-red-500 active:text-red-600 transition-colors p-1.5 -mr-1.5 -mt-1.5 rounded-lg hover:bg-red-500/10 cursor-pointer shrink-0"
                              title={isBangla ? "মুছে ফেলুন" : "Remove"}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Batch tag */}
                          {item.batchNo && (
                            <div className="mt-1">
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-[10px] font-mono border border-border/60">
                                Batch: {item.batchNo}
                              </span>
                            </div>
                          )}

                          {/* Offer Tags */}
                          {item.appliedOffer && (
                            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-bold">
                                <Sparkles className="h-2.5 w-2.5" />
                                {item.appliedOffer.title}
                              </span>
                              {item.freeQuantity > 0 && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                                  <Gift className="h-2.5 w-2.5" />
                                  {item.freeQuantity} Free
                                </span>
                              )}
                              <span className="text-[10px] text-emerald-400 font-semibold">
                                Saved: ৳{(item.offerSavings || 0).toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Middle Row: Rate input & Quantity Stepper */}
                      <div className="grid grid-cols-2 gap-2.5 pt-1 border-t border-border/40">
                        {/* Rate (Price) */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-medium text-muted-foreground block">
                            {isBangla ? "দর (একক মূল্য)" : "Rate (Unit Price)"}
                          </label>
                          <div className="relative flex items-center">
                            <span className="absolute left-2.5 text-xs text-muted-foreground font-medium select-none pointer-events-none">
                              Tk.
                            </span>
                            <Input
                              type="number"
                              value={item.unitPrice || ""}
                              onChange={(e) => handleRateChange(item.id, e.target.value)}
                              className="pl-8 h-9 text-xs font-semibold bg-background/50 border-input focus:ring-1 focus-visible:ring-1"
                              min="0"
                            />
                          </div>
                        </div>

                        {/* Quantity with + / - buttons */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-medium text-muted-foreground block">
                            {isBangla ? "পরিমাণ" : "Quantity"}
                          </label>
                          <div className="flex items-center h-9 bg-background/50 border border-input rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:border-primary">
                            <button
                              type="button"
                              onClick={() => {
                                const newQty = Math.max(1, (item.quantity || 1) - 1);
                                handleQuantityChange(item.id, String(newQty));
                              }}
                              disabled={item.quantity <= 1}
                              className="h-full px-2.5 text-muted-foreground hover:text-foreground active:bg-muted/80 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center justify-center cursor-pointer shrink-0"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <input
                              type="number"
                              value={item.quantity || ""}
                              onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                              className="w-full text-center text-xs font-bold bg-transparent outline-none py-1 min-w-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              min="1"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newQty = (item.quantity || 0) + 1;
                                handleQuantityChange(item.id, String(newQty));
                              }}
                              className="h-full px-2.5 text-muted-foreground hover:text-foreground active:bg-muted/80 transition-colors flex items-center justify-center cursor-pointer shrink-0"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row: Tax Info & Total Amount */}
                      <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                        <div className="text-[11px] text-muted-foreground">
                          <span>
                            {isBangla ? "ট্যাক্স" : "Tax"}:{" "}
                            <strong className="text-foreground font-semibold">
                              {item.taxRate || 0}%
                            </strong>
                            {item.taxAmount > 0 && ` (Tk. ${item.taxAmount.toFixed(2)})`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-muted-foreground font-medium">
                            {isBangla ? "মোট" : "Total"}:
                          </span>
                          <span className="font-bold text-primary text-sm font-mono">
                            Tk. {item.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                {/* Mobile Subtotal Card */}
                <div className="flex justify-between items-center px-4 py-3 bg-muted/20 rounded-xl border border-border/60">
                  <span className="text-xs text-muted-foreground font-medium">
                    {isBangla ? "উপমোট" : "Sub Total"}
                  </span>
                  <span className="font-bold text-foreground text-sm font-mono">
                    Tk. {subtotalAfterDiscount.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
            {/* Notes Section */}
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

        {/* Right Side: Sticky Order Details Card (25% on Desktop) */}
        <div className="w-full lg:flex-[1] lg:min-w-[460px] lg:max-w-[320px] lg:sticky lg:top-6">
          <div className="bg-card border border-border/80 rounded-2xl shadow-md p-4 sm:p-6 space-y-4 sm:space-y-5">
            <h2 className="text-lg font-bold tracking-tight text-foreground border-b border-border/50 pb-2">
              {isBangla ? "অর্ডার সারাংশ" : "Order Summary"}
            </h2>

            {/* Financial Details */}
            <div className="space-y-3">
              {/* Subtotal */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{isBangla ? "উপমোট" : "Subtotal"}</span>
                <span className="text-foreground">Tk. {rawSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            
              {/* Discount */}
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-muted-foreground">{isBangla ? "ছাড়" : "Discount"}</span>
                <span className="text-amber-600 dark:text-amber-500 font-medium">-Tk. {totalDiscount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>

              {/* Offer Savings */}
              {totalOfferSavings > 0 && (
                <div className="flex justify-between items-center text-sm font-medium bg-purple-500/5 -mx-2 px-2 py-1 rounded-lg border border-purple-500/10">
                  <span className="text-purple-500 flex items-center gap-1.5 text-xs font-semibold">
                    <Sparkles className="h-3 w-3" />
                    {isBangla ? "অফার সাশ্রয়" : "Offer Savings"}
                  </span>
                  <span className="text-purple-400 font-bold text-xs">
                    -Tk. {totalOfferSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              {/* Total Tax Display Row */}
              <div className="flex justify-between items-center text-sm font-medium py-0.5">
                <span className="text-muted-foreground">{isBangla ? "মোট ট্যাক্স" : "Total Tax"}</span>
                <span className="text-foreground text-xs font-semibold">
                  Tk. {totalTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {/* VAT Display Row */}
              {/* <div className="flex justify-between items-center text-sm font-medium py-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">{isBangla ? "ভ্যাট" : "VAT"}</span>
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
              </div> */}

              {/* Additional Charge Input */}
              <div className="flex items-center justify-between gap-2 py-1.5 border-t border-border/20 border-b border-border/40 pb-2">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">{isBangla ? "অতিরিক্ত চার্জ" : "Additional Charge"}</span>
                  <span className="text-[10px] text-muted-foreground">{isBangla ? "শিপিং, ডেলিভারি ইত্যাদি" : "Shipping, Delivery etc."}</span>
                </div>
                <div className="relative w-28">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-medium">Tk.</span>
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
          {/* total */}
             <div className="flex items-center justify-between py-1">
              <span className="text-base text-foreground">
                {isBangla ? "মোট" : " Total"}
              </span>
              <span className="text-md font-medium text-primary">
                Tk. {rawSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            {/* overall discount */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1">
               <span className="text-sm text-muted-foreground font-medium shrink-0"> Discount:</span>
               <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
  {/* Percentage */}
  <div className="relative">
    <Input
      type="number"
      value={0}
      placeholder="0"
      min="0"
      max="100"
      onChange={(e)=> console.log(e.target.value)}
      className="w-16 h-9 bg-background/30 pr-5 text-right border-input"
    />
    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium pointer-events-none">
      %
    </span>
  </div>

  {/* Flat Amount */}
  <div className="relative">
    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-medium pointer-events-none">
      Tk.
    </span>
    <Input
      type="number"
      value="0"
      placeholder="0"
      onChange={(e)=> console.log(e.target.value)}
      min="0"
      className="w-20 h-9 bg-background/30 pl-7 pr-2 text-right border-input"
    />
  </div>
</div>
            </div>
            {/* Total Amount Output */}
            <div className="flex items-center justify-between py-1">
              <span className="text-base font-bold text-foreground">
                {isBangla ? "সর্বমোট" : "Grand Total"}
              </span>
              <span className="text-lg font-extrabold text-primary">
                Tk. {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <hr className="border-border/60" />

            {/* Payment Info Section */}
            <div className="">
              <div className="flex items-center justify-end gap-2 border-b border-border pb-2.5">
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

              <div className="space-y-4 pt-2">
                {(() => {
                  const activePayment = splitMode
                    ? payments.find(p => p.method === activeSplitMethod) || payments[0]
                    : payments[0];
                  
                  if (!activePayment) return null;
                  const p = activePayment;
                  const otherPaymentsTotal = payments
                    .filter((pay) => pay.id !== p.id)
                    .reduce((sum, pay) => sum + (pay.amount || 0), 0);
                  const maxAllowedForActive = Math.max(0, parseFloat((grandTotal - otherPaymentsTotal).toFixed(2)));

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
                                setPaymentWarning(null);
                                if (splitMode) {
                                  setActiveSplitMethod(m.id);
                                } else {
                                  handlePaymentFieldChange(p.id, "method", m.id);
                                }
                              }}
                              className={cn(
                                "flex flex-col items-center gap-1.5 py-2.5 sm:py-3 px-1 sm:px-2 rounded-xl border transition-all cursor-pointer",
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

                      {/* Common Amount Input (Rendered alone if method is somehow missing, though should be covered below) */}
                      {!["cash", "bank", "mobile_banking"].includes(p.method) && (
                        <div className="mb-3">
                          <div className="flex items-center bg-background/50 rounded-xl border border-border/60 px-3.5 py-2 focus-within:border-primary">
                            <span className="text-muted-foreground text-sm mr-1.5">{"\u09F3"}</span>
                            <input
                              type="number"
                              min={0}
                              max={maxAllowedForActive}
                              step="any"
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
                        <div className="mb-3">
                          <div className="flex items-center bg-background/50 rounded-xl border border-border/60 px-3.5 py-2 focus-within:border-primary">
                            <span className="text-muted-foreground text-sm mr-1.5">{"\u09F3"}</span>
                            <input
                              type="number"
                              min={0}
                              max={maxAllowedForActive}
                              step="any"
                              value={p.amount || ""}
                              onChange={(e) => handlePaymentFieldChange(p.id, "amount", parseFloat(e.target.value) || 0)}
                              className="bg-transparent text-foreground text-sm font-mono outline-none w-full"
                              placeholder={isBangla ? "পরিমাণ" : "Amount"}
                            />
                          </div>
                        </div>
                      )}

                      {/* Fields for Bank */}
                      {p.method === "bank" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-3">
                          <div className="flex items-center bg-background/50 rounded-xl border border-border/60 px-3.5 py-2 focus-within:border-primary">
                            <span className="text-muted-foreground text-sm mr-1.5">{"\u09F3"}</span>
                            <input
                              type="number"
                              min={0}
                              max={maxAllowedForActive}
                              step="any"
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
                              {accounts.filter((a: any) => a.type === 'bank').map((acc: any) => (
                                <SelectItem key={acc.id} value={acc.id}>
                                  {acc.name}  
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Fields for Mobile Banking */}
                      {p.method === "mobile_banking" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-3">
                          <Select
                            value={p.accountId}
                            onValueChange={(val) => handlePaymentFieldChange(p.id, "accountId", val)}
                          >
                            <SelectTrigger className="h-10 text-xs bg-background/50 border-input w-full rounded-xl">
                              <SelectValue placeholder={isBangla ? "অ্যাকাউন্ট নির্বাচন করুন" : "Select Account"} />
                            </SelectTrigger>
                            <SelectContent>
                              {accounts.filter((a: any) => a.type === 'mobile_banking').map((acc: any) => (
                                <SelectItem key={acc.id} value={acc.id}>
                                  {acc.name} (Tk.{acc.balance})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="flex items-center bg-background/50 rounded-xl border border-border/60 px-3.5 py-2 focus-within:border-primary h-10">
                            <span className="text-muted-foreground text-sm mr-1.5">{"\u09F3"}</span>
                            <input
                              type="number"
                              min={0}
                              max={maxAllowedForActive}
                              step="any"
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
                            className="w-full h-10 bg-background/50 rounded-xl border border-border/60 px-3.5 py-2.5 text-foreground text-xs outline-none placeholder:text-muted-foreground focus:border-primary"
                          />
                          <input
                            type="text"
                            value={p.reference}
                            onChange={(e) => handlePaymentFieldChange(p.id, "reference", e.target.value)}
                            placeholder={isBangla ? "রেফারেন্স" : "Ref no (optional)"}
                            className="w-full h-10 bg-background/50 rounded-xl border border-border/60 px-3.5 py-2.5 text-foreground text-xs outline-none placeholder:text-muted-foreground focus:border-primary"
                          />
                        </div>
                      )}

                      {/* Warning below payment method */}
                      {currentWarning && (
                        <div className="flex items-center gap-1.5 text-[11px] text-amber-500 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-lg mt-1 animate-in fade-in duration-150">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{currentWarning}</span>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
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
            <hr className="border-border/60 pt-1" />

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5 sm:gap-3">
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isPending || isPaidAmountExceeded}
                className="w-full h-11 sm:h-10 text-sm bg-primary hover:bg-primary/95 text-primary-foreground font-semibold shadow-sm"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    {isBangla ? "সংরক্ষণ হচ্ছে..." : "Saving..."}
                  </span>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    {isBangla ? "বিক্রি সম্পন্ন করুন" : "Complete Sale"}
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="w-full h-11 sm:h-10 text-sm border-input hover:bg-muted"
              >
                <X className="h-4 w-4 mr-2" />
                {isBangla ? "বাতিল" : "Cancel"}
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
    {/* End Desktop & Tablet View */}

      {/* ========================================================= */}
      {/* MOBILE VIEW (< md) - MATCHING EXACT SCREENSHOT UX FLOW    */}
      {/* ========================================================= */}
      <div className="md:hidden pb-44 space-y-3.5">
        {/* Mobile Header: BackButton + Title */}
        <PageHeader
          title={isBangla ? "নতুন বিক্রি" : "Add New Sales"}
          showBack
          fallbackHref="/sales"
        />

        {/* Customer & Date Selector Bar */}
        <div className="flex items-center justify-between py-1 border-b border-border/40 text-xs">
          {/* Customer Dropdown Chip */}
          <button
            type="button"
            onClick={() => setIsMobileCustomerModalOpen(true)}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-muted/60 transition-colors text-foreground font-medium text-left"
          >
            <User className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="truncate max-w-[155px]">
              {selectedParty?.name || defaultCustomerName}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          </button>

          {/* Date Picker Chip */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-muted/60 transition-colors text-foreground text-xs font-medium"
              >
                <CalendarIcon className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>{format(invoiceDate, "d MMM yyyy")}</span>
              </button>
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

        {/* Selected Product Container */}
        <div className="bg-card border border-border/70 rounded-2xl p-4 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between pb-2.5 border-b border-border/50">
            <h3 className="font-bold text-sm text-foreground">
              {isBangla ? "নির্বাচিত পণ্য" : "Selected Product"}
            </h3>
          </div>

          {selectedItems.filter((i) => i.itemId).length === 0 ? (
            /* Screen 1: Empty State Graphic & Select Product Button */
            <div className="py-10 flex flex-col items-center justify-center text-center">
              <div className="relative mb-4">
                <svg
                  width="100"
                  height="90"
                  viewBox="0 0 100 90"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="drop-shadow-xs"
                >
                  <rect x="22" y="18" width="56" height="45" rx="5" fill="#E2E8F0" className="dark:fill-muted" />
                  <rect x="28" y="24" width="44" height="4" rx="2" fill="#CBD5E1" className="dark:fill-muted-foreground/30" />
                  <rect x="28" y="32" width="44" height="4" rx="2" fill="#CBD5E1" className="dark:fill-muted-foreground/30" />
                  <rect x="28" y="40" width="28" height="4" rx="2" fill="#CBD5E1" className="dark:fill-muted-foreground/30" />
                  <path
                    d="M15 35H32L38 47H62L68 35H85V64C85 67.3137 82.3137 70 79 70H21C17.6863 70 15 67.3137 15 64V35Z"
                    fill="#CBD5E1"
                    className="dark:fill-muted/80"
                  />
                  <path
                    d="M15 42H30L36 53H64L70 42H85V64C85 67.3137 82.3137 70 79 70H21C17.6863 70 15 67.3137 15 64V42Z"
                    fill="#94A3B8"
                    className="dark:fill-muted"
                  />
                  <circle cx="75" cy="18" r="11" fill="#CBD5E1" className="dark:fill-muted" />
                  <circle cx="70" cy="18" r="1.5" fill="#64748B" className="dark:fill-muted-foreground" />
                  <circle cx="75" cy="18" r="1.5" fill="#64748B" className="dark:fill-muted-foreground" />
                  <circle cx="80" cy="18" r="1.5" fill="#64748B" className="dark:fill-muted-foreground" />
                </svg>
              </div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-6">
                {isBangla ? "কোনো পণ্য নেই" : "No Product"}
              </h4>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl border border-primary text-primary hover:bg-primary/10 active:bg-primary/20 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Plus className="h-4 w-4" />
                <span>{isBangla ? "পণ্য নির্বাচন করুন" : "Select Product"}</span>
              </button>
            </div>
          ) : (
            /* Screen 3: Selected Product Cards List */
            <div className="space-y-3">
              {selectedItems
                .filter((i) => i.itemId)
                .map((item) => (
                  <div
                    key={item.id}
                    className="bg-card border border-border/70 rounded-xl p-3 shadow-xs space-y-2.5"
                  >
                    {/* Top row: Thumbnail, Name & breakdown, Line Total & Delete */}
                    <div className="flex items-start gap-3">
                      <div className="h-11 w-11 rounded-lg border border-border/80 bg-muted/40 flex items-center justify-center shrink-0 overflow-hidden">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.itemName}
                            width={44}
                            height={44}
                            className="h-11 w-11 object-cover"
                          />
                        ) : (
                          <Package className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-foreground text-sm truncate">
                          {item.itemName}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                          <span>
                            {item.quantity} x ৳{item.unitPrice}
                          </span>
                          {item.batchNo && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground">
                              Batch <Info className="h-3 w-3 inline text-blue-500" />
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 shrink-0">
                        <span className="font-bold text-foreground text-sm">
                          ৳{item.total.toFixed(0)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItemRow(item.id)}
                          className="h-8 w-8 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-colors"
                          title={isBangla ? "মুছে ফেলুন" : "Remove"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Divider */}
                    <hr className="border-border/40" />

                    {/* Bottom row: Stepper & Update Selling Price link */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center h-8 bg-background border border-border/70 rounded-md overflow-hidden">
                        <button
                          type="button"
                          onClick={() => {
                            const newQty = Math.max(1, (item.quantity || 1) - 1);
                            handleQuantityChange(item.id, String(newQty));
                          }}
                          className="px-2.5 h-full text-muted-foreground hover:text-foreground active:bg-muted/60 transition-colors"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-foreground">
                          {String(item.quantity).padStart(2, "0")}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const newQty = (item.quantity || 0) + 1;
                            handleQuantityChange(item.id, String(newQty));
                          }}
                          className="px-2.5 h-full text-muted-foreground hover:text-foreground active:bg-muted/60 transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingItemForPrice(item);
                          setTempNewPrice(String(item.unitPrice || ""));
                        }}
                        className="text-blue-500 hover:text-blue-600 text-xs font-medium hover:underline transition-colors"
                      >
                        {isBangla ? "বিক্রয় মূল্য পরিবর্তন করুন" : "Update Selling Price"}
                      </button>
                    </div>
                  </div>
                ))}

              {/* + Select Product button to add more */}
              <button
                type="button"
                onClick={() => setIsProductModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl border border-primary text-primary hover:bg-primary/10 active:bg-primary/20 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-2xs mt-3"
              >
                <Plus className="h-4 w-4" />
                <span>{isBangla ? "পণ্য নির্বাচন করুন" : "Select Product"}</span>
              </button>
            </div>
          )}
        </div>

        {/* Fixed Sticky Bottom Checkout Bar (Visible when items selected) */}
        {selectedItems.filter((i) => i.itemId).length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border/80 p-3.5 pb-safe space-y-2.5 shadow-xl">
            {/* Subtotal Row */}
            <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
              <span className="text-muted-foreground">{isBangla ? "উপমোট" : "Subtotal"}</span>
              <span className="text-foreground font-bold">
                ৳{rawSubtotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
              </span>
            </div>

            {/* Discount Row */}
            <div className="grid grid-cols-2 gap-2.5">
              <Select
                value={mobileDiscountType}
                onValueChange={(val: "fixed" | "percent") => setMobileDiscountType(val)}
              >
                <SelectTrigger className="h-10 text-xs bg-background/60 border-input font-medium">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">{isBangla ? "নির্দিষ্ট (Fixed)" : "Fixed"}</SelectItem>
                  <SelectItem value="percent">{isBangla ? "শতকরা (%)" : "Percentage"}</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="number"
                value={mobileDiscountValue}
                onChange={(e) => setMobileDiscountValue(e.target.value)}
                placeholder={isBangla ? "ছাড়ের পরিমাণ" : "Discount Amount"}
                className="h-10 text-xs bg-background/60 border-input font-medium"
                min="0"
              />
            </div>

            {/* Total Payable Amount Row */}
            <div className="flex items-center justify-between pt-0.5 text-sm font-bold">
              <span className="text-primary">
                {isBangla ? "মোট পরিশোধযোগ্য পরিমাণ" : "Total Payable Amount"}
              </span>
              <span className="text-primary text-base font-extrabold">
                ৳{mobilePayableTotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-0.5">
              <Button
                type="button"
                onClick={() => setIsMoreModalOpen(true)}
                className="h-11 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                {isBangla ? "আরও" : "More"}
              </Button>

              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isPending || selectedItems.filter((i) => i.itemId).length === 0}
                className="h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-xs sm:text-sm shadow-sm disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                ) : null}
                {isBangla ? "অর্ডার সম্পন্ন করুন" : "Place Order"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Screen 2: "All Product" Modal Bottom Sheet */}
      <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden text-foreground flex flex-col max-h-[90vh]">
          {/* Header with Title and Close Button */}
          <div className="flex items-center justify-between p-4 border-b border-border/60">
            <h2 className="text-base font-bold text-foreground">
              {isBangla ? "সকল পণ্য" : "All Product"}
            </h2>
            <button
              type="button"
              onClick={() => setIsProductModalOpen(false)}
              className="rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search Row + Barcode Icon */}
          <div className="p-4 pb-2 flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                value={mobileProductSearch}
                onChange={(e) => setMobileProductSearch(e.target.value)}
                placeholder={isBangla ? "পণ্য খুঁজুন..." : "Search Product"}
                className="pl-9 h-11 bg-background/60 border-input text-xs"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <button
              type="button"
              onClick={() =>
                toast.info(isBangla ? "বারকোড স্ক্যানার সক্রিয় আছে" : "Barcode scanner is ready")
              }
              className="h-11 w-11 rounded-xl border border-input bg-background/60 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground shrink-0 shadow-2xs"
              title="Barcode Scanner"
            >
              <ScanBarcode className="h-5 w-5" />
            </button>
          </div>

          {/* Product List */}
          <div className="flex-1 overflow-y-auto p-4 pt-1 space-y-3">
            {mobileFilteredProducts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-xs">
                <Package className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p>{isBangla ? "কোনো পণ্য পাওয়া যায়নি" : "No products found"}</p>
              </div>
            ) : (
              mobileFilteredProducts.map((prod: any) => {
                const qty = modalQuantities[prod.id] || 1;
                const price = prod.sellingPrice || prod.unitPrice || 0;
                const stock = prod.stock ?? prod.currentStock ?? prod.quantity ?? 0;
                const unit = prod.unit || "pc";

                return (
                  <div
                    key={prod.id}
                    className="bg-card border border-border/70 rounded-xl p-3 shadow-xs space-y-2.5"
                  >
                    {/* Top row: Image & Name & Stock */}
                    <div className="flex items-start gap-3">
                      <div className="h-11 w-11 rounded-lg border border-border/80 bg-muted/40 flex items-center justify-center shrink-0 overflow-hidden">
                        {prod.imageUrl ? (
                          <Image
                            src={prod.imageUrl}
                            alt={prod.name}
                            width={44}
                            height={44}
                            className="h-11 w-11 object-cover"
                          />
                        ) : (
                          <Package className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-foreground text-sm truncate">
                          {prod.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Stock : {stock} {unit}
                        </p>
                      </div>
                    </div>

                    {/* Divider */}
                    <hr className="border-border/40" />

                    {/* Bottom row: Stepper, Price, Orange + Button */}
                    <div className="flex items-center justify-between">
                      {/* Stepper */}
                      <div className="flex items-center h-8 bg-background border border-border/70 rounded-md overflow-hidden">
                        <button
                          type="button"
                          onClick={() => {
                            setModalQuantities((prev) => ({
                              ...prev,
                              [prod.id]: Math.max(1, (prev[prod.id] || 1) - 1),
                            }));
                          }}
                          className="px-2.5 h-full text-muted-foreground hover:text-foreground active:bg-muted/60 transition-colors"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-foreground">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setModalQuantities((prev) => ({
                              ...prev,
                              [prod.id]: (prev[prod.id] || 1) + 1,
                            }));
                          }}
                          className="px-2.5 h-full text-muted-foreground hover:text-foreground active:bg-muted/60 transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-xs font-semibold text-foreground">
                        Price: <span className="text-primary font-bold">৳{price}</span>
                      </div>

                      {/* Orange + Button */}
                      <button
                        type="button"
                        onClick={() => handleAddProductFromModal(prod, qty)}
                        className="h-9 w-9 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground active:scale-95 flex items-center justify-center shadow-md transition-all shrink-0"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Sticky Bottom Next Button */}
          <div className="p-4 border-t border-border/60 bg-card">
            <Button
              type="button"
              onClick={() => setIsProductModalOpen(false)}
              className="w-full h-11 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-xl text-sm"
            >
              {isBangla ? "পরবর্তী" : "Next"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Customer Select Modal */}
      <Dialog open={isMobileCustomerModalOpen} onOpenChange={setIsMobileCustomerModalOpen}>
        <DialogContent className="max-w-md p-5 max-h-[85vh] overflow-y-auto space-y-3.5 text-foreground">
          <DialogHeader>
            <DialogTitle className="font-bold text-base">
              {isBangla ? "গ্রাহক নির্বাচন করুন" : "Select Customer"}
            </DialogTitle>
          </DialogHeader>

          {/* Customer Search Input */}
          <div className="relative">
            <Input
              value={mobileCustomerSearch}
              onChange={(e) => setMobileCustomerSearch(e.target.value)}
              placeholder={isBangla ? "নাম বা ফোন নম্বর দিয়ে খুঁজুন..." : "Search by name or phone..."}
              className="pl-9 h-10 text-xs bg-background/60"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>

          {/* Walk-in Customer Option */}
          <button
            type="button"
            onClick={() => {
              setSelectedParty(null);
              setSelectedPartyId("");
              setPhoneSearchQuery("");
              setIsMobileCustomerModalOpen(false);
            }}
            className={cn(
              "w-full text-left p-3 rounded-xl border transition-colors flex items-center justify-between text-xs",
              !selectedParty
                ? "border-primary bg-primary/10 text-primary font-bold"
                : "border-border/60 hover:bg-muted/50"
            )}
          >
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold">{defaultCustomerName}</p>
                <p className="text-[10px] text-muted-foreground">
                  {isBangla ? "ডিফল্ট গ্রাহক" : "Default Walk-in"}
                </p>
              </div>
            </div>
            {!selectedParty && <Check className="h-4 w-4 text-primary" />}
          </button>

          {/* Customer List */}
          <div className="divide-y divide-border/50 max-h-60 overflow-y-auto rounded-xl border border-border/60">
            {mobileFilteredParties.map((party: any) => (
              <button
                key={party.id}
                type="button"
                onClick={() => {
                  handleSelectParty(party);
                  setIsMobileCustomerModalOpen(false);
                }}
                className={cn(
                  "w-full text-left p-3 hover:bg-muted/50 transition-colors flex items-center justify-between text-xs",
                  selectedParty?.id === party.id && "bg-primary/10 font-semibold text-primary"
                )}
              >
                <div>
                  <p className="font-semibold text-foreground">{party.name}</p>
                  {party.phone && (
                    <p className="text-[10px] text-muted-foreground font-mono">{party.phone}</p>
                  )}
                </div>
                {selectedParty?.id === party.id && <Check className="h-4 w-4 text-primary" />}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Selling Price Modal */}
      <Dialog
        open={!!editingItemForPrice}
        onOpenChange={(open) => !open && setEditingItemForPrice(null)}
      >
        <DialogContent className="max-w-sm p-5 space-y-4 text-foreground">
          <DialogHeader>
            <DialogTitle className="font-bold text-base">
              {isBangla ? "বিক্রয় মূল্য পরিবর্তন করুন" : "Update Selling Price"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              {editingItemForPrice?.itemName}
            </p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                ৳
              </span>
              <Input
                type="number"
                value={tempNewPrice}
                onChange={(e) => setTempNewPrice(e.target.value)}
                className="pl-8 h-10 text-sm font-bold bg-background/60"
                min="0"
                autoFocus
              />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingItemForPrice(null)}
              className="flex-1 h-10 text-xs font-semibold"
            >
              {isBangla ? "বাতিল" : "Cancel"}
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (editingItemForPrice) {
                  handleRateChange(editingItemForPrice.id, tempNewPrice);
                  setEditingItemForPrice(null);
                  toast.success(
                    isBangla ? "বিক্রয় মূল্য আপডেট হয়েছে" : "Selling price updated"
                  );
                }
              }}
              className="flex-1 h-10 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isBangla ? "সংরক্ষণ" : "Update"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* More Options & Payment Dialog */}
      <Dialog open={isMoreModalOpen} onOpenChange={setIsMoreModalOpen}>
        <DialogContent className="max-w-md p-5 max-h-[85vh] overflow-y-auto space-y-4 text-foreground">
          <DialogHeader>
            <DialogTitle className="font-bold text-base">
              {isBangla ? "অতিরিক্ত বিকল্প ও পেমেন্ট" : "More Options & Payment"}
            </DialogTitle>
          </DialogHeader>

          {/* Payment Section */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between pb-1">
              <Label className="text-xs font-bold text-foreground">
                {isBangla ? "পেমেন্ট পদ্ধতি" : "Payment Method"}
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground">
                  {isBangla ? "বিভক্ত পেমেন্ট" : "Split Mode"}
                </span>
                <Switch checked={splitMode} onCheckedChange={toggleSplitMode} />
              </div>
            </div>

            {/* Method selection chips */}
            <div className="grid grid-cols-3 gap-2">
              {METHODS.map((m) => {
                const Icon = m.icon;
                const active = splitMode
                  ? activeSplitMethod === m.id
                  : payments[0]?.method === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      if (splitMode) {
                        setActiveSplitMethod(m.id);
                      } else {
                        handlePaymentFieldChange(payments[0].id, "method", m.id);
                      }
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold gap-1 transition-all",
                      active
                        ? "border-primary bg-primary/10 text-primary shadow-2xs"
                        : "border-border/60 bg-background/50 text-muted-foreground hover:bg-muted/50"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Active payment fields */}
            {(() => {
              const activePayment = splitMode
                ? payments.find((p) => p.method === activeSplitMethod) || payments[0]
                : payments[0];
              if (!activePayment) return null;

              return (
                <div className="bg-muted/30 p-3 rounded-xl border border-border/60 space-y-2.5">
                  {/* Account selection if bank or mobile */}
                  {activePayment.method !== "cash" && (
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">
                        {isBangla ? "হিসাব নির্বাচন করুন" : "Select Account"}
                      </Label>
                      <Select
                        value={activePayment.accountId}
                        onValueChange={(val) =>
                          handlePaymentFieldChange(activePayment.id, "accountId", val)
                        }
                      >
                        <SelectTrigger className="h-9 text-xs bg-background/60">
                          <SelectValue placeholder="Choose account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts
                            .filter((a: any) => a.type === activePayment.method)
                            .map((acc: any) => (
                              <SelectItem key={acc.id} value={acc.id}>
                                {acc.name} ({formatCurrency(acc.balance)})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Transaction ID if bank or mobile */}
                  {activePayment.method !== "cash" && (
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">
                        {isBangla ? "লেনদেন আইডি / রেফারেন্স" : "Transaction ID / Reference"}
                      </Label>
                      <Input
                        value={activePayment.transactionId || ""}
                        onChange={(e) =>
                          handlePaymentFieldChange(
                            activePayment.id,
                            "transactionId",
                            e.target.value
                          )
                        }
                        placeholder="TRX-12345"
                        className="h-9 text-xs bg-background/60"
                      />
                    </div>
                  )}

                  {/* Amount */}
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">
                      {isBangla ? "পরিশোধিত টাকা" : "Paid Amount"}
                    </Label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-semibold">
                        ৳
                      </span>
                      <Input
                        type="number"
                        value={activePayment.amount || ""}
                        onChange={(e) =>
                          handlePaymentFieldChange(activePayment.id, "amount", e.target.value)
                        }
                        placeholder="0"
                        className="pl-7 h-9 text-xs font-bold bg-background/60"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Additional Charges */}
          <div className="space-y-1.5 pt-1 border-t border-border/40">
            <Label className="text-xs font-semibold text-foreground">
              {isBangla ? "অতিরিক্ত চার্জ (ডেলিভারি / শিপিং)" : "Additional Charge (Delivery/Shipping)"}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                ৳
              </span>
              <Input
                type="number"
                value={additionalCharge}
                onChange={(e) => setAdditionalCharge(e.target.value)}
                placeholder="0"
                className="pl-8 h-9 text-xs font-medium bg-background/60"
                min="0"
              />
            </div>
          </div>

          {/* VAT Toggle & Edit */}
          <div className="flex items-center justify-between pt-1 border-t border-border/40">
            <div>
              <p className="text-xs font-semibold text-foreground">
                {isBangla ? "ভ্যাট" : "VAT"}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {vatConfig.type === "percent"
                  ? `${vatConfig.value}% (৳${vatVal.toFixed(2)})`
                  : `৳${vatVal.toFixed(2)}`}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setTempVatType(vatConfig.type);
                setTempVatValue(String(vatConfig.value));
                setIsEditVatOpen(true);
              }}
              className="h-8 text-xs font-semibold"
            >
              <Pencil className="h-3 w-3 mr-1" />
              {isBangla ? "পরিবর্তন" : "Edit"}
            </Button>
          </div>

          {/* Notes Section */}
          <div className="space-y-1.5 pt-1 border-t border-border/40">
            <Label className="text-xs font-semibold text-foreground">
              {isBangla ? "নোট বা মন্তব্য" : "Notes or Remarks"}
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isBangla ? "নোট লিখুন..." : "Enter note or description..."}
              className="min-h-[80px] bg-background/60 text-xs resize-none"
            />
          </div>

          {/* Done Button */}
          <Button
            type="button"
            onClick={() => setIsMoreModalOpen(false)}
            className="w-full h-10 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
          >
            {isBangla ? "সম্পন্ন" : "Done"}
          </Button>
        </DialogContent>
      </Dialog>
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

export default function NewSalePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <NewSaleContent />
    </Suspense>
  );
}
