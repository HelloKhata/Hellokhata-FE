// Hello Khata OS - Purchase Return Page
// হ্যালো খাতা - ক্রয় ফেরত পেজ

'use client';

import { useState, useEffect, use, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Divider } from '@/components/ui/premium';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
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
} from '@/components/ui/select';
import {
  Package,
  Plus,
  Trash2,
  ArrowLeft,
  Truck,
  Calculator,
  CreditCard,
  Banknote,
  Wallet,
  AlertCircle,
  CheckCircle,
  Loader2,
  RotateCcw,
  Sparkles,
  Info,
  Calendar as CalendarIcon,
  X,
  FileText,
  Camera,
  Users,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useCurrency, useAppTranslation } from '@/hooks/useAppTranslation';
import { useUser } from '@/stores/sessionStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useGetPurchaseById } from '@/hooks/api/usePurchases';
import { useReturnPurchase, useGetPurchaseReturns } from '@/hooks/api/useReturns';
import { useBranches, useAccounts } from '@/hooks/queries';
import { useParty } from '@/hooks/api/useParties';

interface ReturnItem {
  purchaseItemId: string;
  itemId: string;
  itemName: string;
  sku: string;
  barcode: string;
  batchNumber: string;
  purchaseDate: string;
  quantity: number; // Return Quantity
  maxQuantity: number; // Purchased Quantity
  alreadyReturned: number;
  remainingQuantity: number;
  unitCost: number;
  unit: string;
  total: number;
  reason: string;
  returnType: 'refund' | 'replacement' | 'exchange' | 'damage' | 'expired' | 'warranty' | 'supplier_credit';
}

export default function PurchaseReturnPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const router = useRouter();
  const user = useUser();

  // Queries
  const { data: purchaseData, isLoading: isFetchingPurchase } = useGetPurchaseById(id);
  const { mutate: returnPurchase, isPending: isSubmitting } = useReturnPurchase();
  const { data: branches = [] } = useBranches();
  const { data: accounts = [] } = useAccounts();
  const { data: purchaseReturns = [] } = useGetPurchaseReturns();

  // Form states
  const [initialized, setInitialized] = useState(false);
  const [supplierId, setSupplierId] = useState<string>('');
  
  // Single Supplier Profile Query
  const { data: singleSupplierData } = useParty(supplierId, {
    enabled: !!supplierId,
  });

  const autoReturnNo = useMemo(() => {
    const todayStr = format(new Date(), "yyyyMMdd");
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `PR-${todayStr}-${rand}`;
  }, []);

  // Purchase Return Info states
  const [returnNo, setReturnNo] = useState("");
  useEffect(() => {
    setReturnNo(autoReturnNo);
  }, [autoReturnNo]);

  const [returnDate, setReturnDate] = useState<Date>(new Date());
  const [branchId, setBranchId] = useState("");
  const [responsiblePerson, setResponsiblePerson] = useState("");
  const [referenceNo, setReferenceNo] = useState("");
  const [returnStatus, setReturnStatus] = useState<'draft' | 'pending' | 'approved' | 'completed' | 'cancelled'>('completed');
  const [overallReturnReason, setOverallReturnReason] = useState("");

  // Items list state
  const [items, setItems] = useState<ReturnItem[]>([]);

  // Split Refund configurations
  const [orderDiscount, setOrderDiscount] = useState<number>(0);
  const [taxPercent, setTaxPercent] = useState<number>(0);
  const [shippingAdjustment, setShippingAdjustment] = useState<number>(0);
  const [additionalCharges, setAdditionalCharges] = useState<number>(0);

  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [supplierCredit, setSupplierCredit] = useState<number>(0);
  const [paymentAdjustment, setPaymentAdjustment] = useState<number>(0);

  const [refundMethod, setRefundMethod] = useState<'cash' | 'bank' | 'card' | 'bkash' | 'nagad' | 'rocket' | 'wallet' | 'supplier_credit' | 'due_adjustment'>('cash');
  const [accountId, setAccountId] = useState<string>('');

  // Attachments & Notes
  const [attachments, setAttachments] = useState<File[]>([]);
  const [notes, setNotes] = useState("");

  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);

  // Initialize from Purchase Record
  useEffect(() => {
    if (purchaseData?.data && !initialized) {
      const purchase = purchaseData.data;
      setSupplierId(purchase.supplierId || '');
      setBranchId(purchase.branchId || '');
      setResponsiblePerson(user?.name || user?.id || 'System Manager');
      setInitialized(true);

      const prefillItems: ReturnItem[] = (purchase.items || []).map((item: any) => {
        const qtyPurchased = item.quantity || 0;
        const qtyReturned = item.alreadyReturned || 0;
        const qtyRemaining = Math.max(0, qtyPurchased - qtyReturned);
        return {
          purchaseItemId: item.id,
          itemId: item.itemId,
          itemName: item.itemName || 'Product',
          sku: item.sku || item.item?.sku || '—',
          barcode: item.barcode || item.item?.barcode || '—',
          batchNumber: item.batchNumber || '—',
          purchaseDate: purchase.createdAt ? format(new Date(purchase.createdAt), 'dd MMM yyyy') : '—',
          quantity: qtyRemaining, // defaults return quantity to all remaining
          maxQuantity: qtyPurchased,
          alreadyReturned: qtyReturned,
          remainingQuantity: qtyRemaining,
          unitCost: item.unitCost || 0,
          unit: item.unit || 'pcs',
          total: qtyRemaining * (item.unitCost || 0),
          reason: '',
          returnType: 'refund',
        };
      });
      setItems(prefillItems);
    }
  }, [purchaseData, initialized, user]);

  // Derive calculations
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);
  }, [items]);

  const taxAmount = useMemo(() => {
    return Math.max(0, (subtotal - orderDiscount) * (taxPercent / 100));
  }, [subtotal, orderDiscount, taxPercent]);

  const grandTotal = useMemo(() => {
    return Math.max(0, subtotal - orderDiscount + taxAmount + shippingAdjustment + additionalCharges);
  }, [subtotal, orderDiscount, taxAmount, shippingAdjustment, additionalCharges]);

  // Sync split defaults when grandTotal updates
  useEffect(() => {
    if (refundMethod === 'cash' || refundMethod === 'bank' || refundMethod === 'card' || refundMethod === 'bkash' || refundMethod === 'nagad' || refundMethod === 'rocket' || refundMethod === 'wallet') {
      setRefundAmount(grandTotal);
      setSupplierCredit(0);
      setPaymentAdjustment(0);
    } else if (refundMethod === 'supplier_credit') {
      setRefundAmount(0);
      setSupplierCredit(grandTotal);
      setPaymentAdjustment(0);
    } else if (refundMethod === 'due_adjustment') {
      setRefundAmount(0);
      setSupplierCredit(0);
      setPaymentAdjustment(grandTotal);
    }
  }, [grandTotal, refundMethod]);

  // Split distribution helpers
  const handleAutoFillSplit = (type: 'refund' | 'credit' | 'adjustment') => {
    if (type === 'refund') {
      setRefundAmount(grandTotal);
      setSupplierCredit(0);
      setPaymentAdjustment(0);
    } else if (type === 'credit') {
      setRefundAmount(0);
      setSupplierCredit(grandTotal);
      setPaymentAdjustment(0);
    } else {
      setRefundAmount(0);
      setSupplierCredit(0);
      setPaymentAdjustment(grandTotal);
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSubmitWithStatus(returnStatus, 'redirect');
      }
      if (e.key === 'Escape') {
        router.back();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [returnStatus, items, grandTotal]);

  // AI Suggestions
  const aiSuggestions = useMemo(() => {
    const suggestions: string[] = [];

    if (singleSupplierData?.data) {
      const sup = singleSupplierData.data;
      if (sup.returnRate && sup.returnRate > 15) {
        suggestions.push(isBangla
          ? `⚠️ সরবরাহকারী গুণমান সতর্কতা: ${sup.name}-এর পণ্য ফেরতের হার উচ্চ (${sup.returnRate}%)। গুণগত মান পর্যালোচনা করুন।`
          : `⚠️ Supplier Quality Warning: ${sup.name} has a high product return rate of ${sup.returnRate}%. Check batch metrics.`
        );
      }
      if (sup.riskLevel === "high") {
        suggestions.push(isBangla
          ? `👤 আর্থিক ঝুঁকি সতর্কতা: এই সরবরাহকারীর ঝুঁকি স্কোর ${sup.riskScore}/100। টাকা রিফান্ডের পরিবর্তে বকেয়া সমন্বয় (Due Adjustment) নির্বাচন করতে পারেন।`
          : `👤 Financial Risk: This supplier has a risk score of ${sup.riskScore}/100. Choose Due Adjustment over Cash Refund.`
        );
      }
    }

    // Expiry check
    const expiredItems = items.filter(item => item.reason === 'expired' || item.returnType === 'expired');
    if (expiredItems.length > 0) {
      suggestions.push(isBangla
        ? `⚠️ মেয়াদোত্তীর্ণ সতর্কতা: ফেরত তালিকায় ${expiredItems.length} টি মেয়াদোত্তীর্ণ আইটেম সনাক্ত হয়েছে। দ্রুত ডিসপোজাল প্রোটোকল সম্পাদন করুন।`
        : `⚠️ Expired Alert: ${expiredItems.length} items flagged with expired reason. Process warehouse disposal protocol.`
      );
    }

    // Duplicate return check
    const isDup = purchaseReturns.some((pr: any) => pr.purchaseId === id);
    if (isDup) {
      suggestions.push(isBangla
        ? `⚠️ ডুপ্লিকেট ইনভয়েস সতর্কতা: এই ক্রয়ের বিপরীতে ইতোমধ্যে একটি ফেরত রেকর্ড রয়েছে!`
        : `⚠️ Duplicate Return Warning: A return transaction is already logged against this purchase invoice.`
      );
    }

    if (suggestions.length === 0) {
      suggestions.push(isBangla
        ? "💡 এআই পারচেজ অ্যাসিস্ট্যান্স: এই ফেরতের জন্য কোনো গুরুত্বপূর্ণ আর্থিক বা গুণগত ঝুঁকি পাওয়া যায়নি।"
        : "💡 AI Purchase Assistance: No critical financial or inventory quality risks identified for this return."
      );
    }

    return suggestions;
  }, [items, singleSupplierData, purchaseReturns, id, isBangla]);

  // Form Row modification helpers
  const updateQuantity = (purchaseItemId: string, quantity: number) => {
    setItems(prev => prev.map(item => {
      if (item.purchaseItemId === purchaseItemId) {
        const newQty = Math.max(0, Math.min(quantity, item.remainingQuantity));
        return {
          ...item,
          quantity: newQty,
          total: newQty * item.unitCost,
        };
      }
      return item;
    }));
  };

  const updateItemField = (purchaseItemId: string, field: keyof ReturnItem, value: any) => {
    setItems(prev => prev.map(item => {
      if (item.purchaseItemId === purchaseItemId) {
        return {
          ...item,
          [field]: value,
        };
      }
      return item;
    }));
  };

  const removeItem = (purchaseItemId: string) => {
    setItems(prev => prev.filter(item => item.purchaseItemId !== purchaseItemId));
  };

  // Submit flow
  const handleSubmitWithStatus = (status: typeof returnStatus, andThen: 'redirect' | 'clear' | 'print') => {
    const itemsToReturn = items.filter(i => i.quantity > 0);

    if (!supplierId) {
      toast.error(isBangla ? 'সরবরাহকারী নির্বাচন করা নেই' : 'No supplier selected');
      return;
    }
    if (itemsToReturn.length === 0) {
      toast.error(isBangla ? 'অন্তত একটি পণ্য ফেরত দিন' : 'Select at least one item to return');
      return;
    }

    // Instantly check quantities
    const qtyViolated = itemsToReturn.some(item => item.quantity > item.remainingQuantity);
    if (qtyViolated) {
      toast.error(isBangla ? 'ফেরত সংখ্যা অবশিষ্টের বেশি হতে পারবে না' : 'Return quantity cannot exceed remaining returnable quantity');
      return;
    }

    const payload = {
      purchaseId: id,
      supplierId,
      returnNo,
      returnDate: returnDate.toISOString(),
      branchId,
      responsiblePerson,
      referenceNo,
      status,
      items: itemsToReturn.map(item => ({
        purchaseItemId: item.purchaseItemId,
        itemId: item.itemId,
        itemName: item.itemName,
        quantity: item.quantity,
        unitCost: item.unitCost,
        returnType: item.returnType,
        reason: item.reason || overallReturnReason || undefined,
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
      accountId: accountId || user?.id || '',
      notes: notes || undefined,
      internalNotes: notes || undefined,
      supplierNotes: notes || undefined,
    };

    returnPurchase(payload, {
      onSuccess: () => {
        toast.success(isBangla ? 'ক্রয় ফেরত সফলভাবে সম্পন্ন হয়েছে' : 'Purchase return saved successfully');
        if (andThen === 'clear') {
          setItems([]);
          setInitialized(false);
          setOverallReturnReason('');
          setNotes('');
          setReferenceNo('');
        } else if (andThen === 'print') {
          window.print();
          router.push('/purchases');
        } else {
          router.push('/purchases');
        }
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || (isBangla ? 'ফেরত ব্যর্থ হয়েছে' : 'Return failed'));
      }
    });
  };

  const returnTypes = [
    { value: 'refund', label: isBangla ? 'রিফান্ড (Refund)' : 'Refund' },
    { value: 'replacement', label: isBangla ? 'প্রতিস্থাপন (Replacement)' : 'Replacement' },
    { value: 'exchange', label: isBangla ? 'বিনিময় (Exchange)' : 'Exchange' },
    { value: 'damage', label: isBangla ? 'ক্ষতিগ্রস্ত (Damage)' : 'Damage' },
    { value: 'expired', label: isBangla ? 'মেয়াদোত্তীর্ণ (Expired)' : 'Expired' },
    { value: 'warranty', label: isBangla ? 'ওয়ারেন্টি (Warranty)' : 'Warranty' },
    { value: 'supplier_credit', label: isBangla ? 'সরবরাহকারী ক্রেডিট (Supplier Credit)' : 'Supplier Credit' },
  ];

  const returnReasons = [
    { value: 'damaged', label: isBangla ? 'ক্ষতিগ্রস্ত (Damaged)' : 'Damaged' },
    { value: 'expired', label: isBangla ? 'মেয়াদোত্তীর্ণ (Expired)' : 'Expired' },
    { value: 'wrong_product', label: isBangla ? 'ভুল পণ্য (Wrong Product)' : 'Wrong Product' },
    { value: 'wrong_quantity', label: isBangla ? 'ভুল পরিমাণ (Wrong Quantity)' : 'Wrong Quantity' },
    { value: 'defective', label: isBangla ? 'ত্রুটিপূর্ণ (Defective)' : 'Defective' },
    { value: 'complaint', label: isBangla ? 'ক্রেতার অভিযোগ (Customer Complaint)' : 'Customer Complaint' },
    { value: 'other', label: isBangla ? 'অন্যান্য (Other)' : 'Other' },
  ];

  if (isFetchingPurchase) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between pb-3 border-b border-border/80">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <RotateCcw className="h-6 w-6 text-primary" />
            {isBangla ? 'ক্রয় ফেরত' : 'Purchase Return'}
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
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()} className="text-muted-foreground hover:text-foreground h-9 px-3">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {isBangla ? 'পেছনে' : 'Back'}
        </Button>
      </div>

      {/* Main Form content area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Section (Spans 2 columns on desktop) */}
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
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{isBangla ? "সরবরাহকারী" : "Supplier Name"}</p>
                <p className="font-bold text-foreground text-sm mt-0.5">
                  {singleSupplierData?.data?.name || (isBangla ? 'লোড হচ্ছে...' : 'Loading...')}
                </p>
              </div>

              {/* Purchase Invoice */}
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{isBangla ? "মূল ক্রয় ইনভয়েস" : "Original Invoice"}</p>
                <p className="font-bold text-foreground text-sm mt-0.5">
                  {purchaseData?.data?.invoiceNo || `PUR-INV-${id.substring(0, 8).toUpperCase()}`}
                </p>
              </div>

              {/* Purchase Date */}
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{isBangla ? "ক্রয়ের তারিখ" : "Purchase Date"}</p>
                <p className="font-bold text-foreground text-sm mt-0.5">
                  {purchaseData?.data?.createdAt ? format(new Date(purchaseData.data.createdAt), 'dd MMM yyyy') : '—'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Purchase Return Number */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">{isBangla ? "ক্রয় ফেরত নম্বর" : "Return Number"}</Label>
                <Input
                  value={returnNo}
                  onChange={(e) => setReturnNo(e.target.value)}
                  className="bg-background/50 border-input h-10 text-xs font-bold text-primary"
                />
              </div>

              {/* Return Date */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">{isBangla ? "ফেরতের তারিখ" : "Return Date"}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-10 bg-background/50 border-input justify-between text-left text-xs font-normal text-muted-foreground hover:bg-muted/5"
                    >
                      <span>{returnDate ? format(returnDate, "PPP") : (isBangla ? "তারিখ নির্বাচন" : "Select date")}</span>
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
                <Label className="text-xs font-semibold text-foreground">{isBangla ? "শাখা" : "Branch"}</Label>
                <Select value={branchId} onValueChange={setBranchId}>
                  <SelectTrigger className="bg-background/50 border-input h-10 text-xs">
                    <SelectValue placeholder={isBangla ? "শাখা নির্বাচন করুন" : "Select branch"} />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((b: any) => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Responsible Person */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">{isBangla ? "দায়িত্বপ্রাপ্ত ব্যক্তি" : "Responsible Person"}</Label>
                <Input
                  value={responsiblePerson}
                  onChange={(e) => setResponsiblePerson(e.target.value)}
                  className="bg-background/50 border-input h-10 text-xs font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Supplier Information Card */}
          {singleSupplierData?.data && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-primary font-semibold text-xs border-b border-primary/10 pb-2">
                <Users className="h-4 w-4" />
                <span>{isBangla ? "সরবরাহকারী সংক্ষিপ্ত বিবরণ ও আর্থিক অবস্থা" : "Supplier Overview"}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{isBangla ? "সরবরাহকারীর নাম" : "Supplier Name"}</p>
                  <p className="font-semibold text-foreground truncate mt-0.5">{singleSupplierData.data.name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{isBangla ? "মোবাইল নম্বর" : "Phone"}</p>
                  <p className="font-semibold text-foreground truncate mt-0.5">{singleSupplierData.data.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-rose-400 uppercase tracking-wide">{isBangla ? "বর্তমান বকেয়া" : "Current Due"}</p>
                  <p className="font-bold text-rose-500 mt-0.5">
                    {formatCurrency(Math.abs(singleSupplierData.data.currentBalance || 0))}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{isBangla ? "বাকির সীমা (Credit Limit)" : "Credit Limit"}</p>
                  <p className="font-semibold text-foreground mt-0.5">
                    {singleSupplierData.data.creditLimit ? formatCurrency(singleSupplierData.data.creditLimit) : (isBangla ? 'সীমাহীন' : 'Unlimited')}
                  </p>
                </div>
              </div>
              
            </div>
          )}

          {/* Section 3: Return Items List Table */}
          <div className="bg-zinc-900/20 border border-border rounded-xl overflow-hidden shadow-xs">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">
                {isBangla ? "ফেরতযোগ্য পণ্য তালিকা" : "Returnable Items details"}
              </span>
              {/* <span className="text-[11px] text-muted-foreground">
                {isBangla ? "ইনভেন্টরি ও ব্যাচ তথ্য নিশ্চিত করুন" : "Confirm batch and inventory metrics"}
              </span> */}
            </div>

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
                    <th className="px-4 py-3 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {items.map((item, idx) => {
                    const isQtyExceeded = item.quantity > item.remainingQuantity;
                    return (
                      <tr key={item.purchaseItemId} className={cn("hover:bg-muted/10 transition-colors", isQtyExceeded && "bg-destructive/5")}>
                        {/* Item Name / SKU */}
                        <td className="px-4 py-3.5 align-middle">
                          <p className="font-semibold text-foreground text-xs leading-tight">{item.itemName}</p> 
                        </td>

                        {/* Purchase Price */}
                        <td className="px-3 py-3.5 align-middle text-right font-medium text-foreground">
                          {formatCurrency(item.unitCost)}
                        </td>

                        {/* Current Stock */}
                        <td className="px-3 py-3.5 align-middle text-center text-muted-foreground font-medium">
                          {item.remainingQuantity} {item.unit}
                        </td>

                        {/* Return Qty control */}
                        <td className="px-4 py-3.5 align-middle">
                          <div className="flex flex-col items-center space-y-1">
                            <div className="flex items-center border border-input rounded bg-background/50 h-8 w-24">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.purchaseItemId, item.quantity - 1)}
                                className="h-full px-2 text-muted-foreground hover:text-foreground active:bg-muted/20"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                value={item.quantity || 0}
                                onChange={(e) => updateQuantity(item.purchaseItemId, parseInt(e.target.value) || 0)}
                                className="w-full text-center h-full bg-transparent outline-none border-none text-xs font-semibold text-foreground [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.purchaseItemId, item.quantity + 1)}
                                className="h-full px-2 text-muted-foreground hover:text-foreground active:bg-muted/20"
                              >
                                +
                              </button>
                            </div>
                            {isQtyExceeded && (
                              <span className="text-[9px] text-rose-500 font-bold leading-none">
                                Max {item.remainingQuantity}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Return Type dropdown */}
                        <td className="px-3 py-3.5 align-middle">
                          <Select
                            value={item.returnType}
                            onValueChange={(val: any) => updateItemField(item.purchaseItemId, 'returnType', val)}
                          >
                            <SelectTrigger className="h-8 text-[11px] bg-background/40 w-28 border-input">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {returnTypes.map(t => (
                                <SelectItem key={t.value} value={t.value} className="text-xs">{t.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>

                        {/* Reason dropdown */}
                        <td className="px-3 py-3.5 align-middle">
                          <Select
                            value={item.reason}
                            onValueChange={(val: any) => updateItemField(item.purchaseItemId, 'reason', val)}
                          >
                            <SelectTrigger className="h-8 text-[11px] bg-background/40 w-28 border-input">
                              <SelectValue placeholder={isBangla ? "কারণ বলুন" : "Reason"} />
                            </SelectTrigger>
                            <SelectContent>
                              {returnReasons.map(r => (
                                <SelectItem key={r.value} value={r.value} className="text-xs">{r.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>

                        {/* Action buttons */}
                        <td className="px-4 py-3.5 align-middle text-right">
                          <button
                            type="button"
                            onClick={() => removeItem(item.purchaseItemId)}
                            className="text-muted-foreground hover:text-rose-500 p-1.5 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom calculation summary */}
            <div className="flex justify-between items-center px-5 py-3.5 bg-muted/10 border-t border-border">
              <span className="text-muted-foreground font-semibold text-xs">
                {isBangla ? "আইটেম উপমোট পরিমাণ" : "Return Subtotal Amount"}
              </span>
              <span className="font-bold text-foreground text-sm">
                {formatCurrency(subtotal)}
              </span>
            </div>
          </div>

          {/* Section 5: Attachments Section */}
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
                      setAttachments(prev => [...prev, ...files]);
                      toast.success(`${files.length} files attached.`);
                    }
                  }}
                />
              </label>

              {attachments.map((file, idx) => (
                <div key={idx} className="h-14 w-14 rounded-lg border border-border bg-background/40 flex items-center justify-center relative group p-1">
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
                    onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
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

          {/* Section 6: Notes Area */}
          <div className="bg-zinc-900/20 border border-border rounded-xl p-5 shadow-xs space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              {isBangla ? "বিশেষ মন্তব্য বা নোট" : "Note"}
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isBangla ? "ফেরত সংক্রান্ত তথ্য বা বিশেষ নোট লিখুন..." : "Enter purchase return remarks, adjustments or audit notes..."}
              className="h-24 bg-background/50 border-input resize-none text-xs"
            />
          </div>
        </div>

        {/* Right Section: Refund Summary sticky card */}
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
              <span className="font-semibold text-foreground block">{isBangla ? "রিফান্ড বন্টন (Splits)" : "Refund Distributions"}</span>

              {/* Refund Cash/Bank Amount */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] text-muted-foreground uppercase">{isBangla ? "নগদ / ব্যাংক ফেরত" : "Cash / Bank Refund"}</Label>
                  <button
                    type="button"
                    onClick={() => handleAutoFillSplit('refund')}
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
                    onClick={() => handleAutoFillSplit('credit')}
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
                    onClick={() => handleAutoFillSplit('adjustment')}
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

            {/* Refund Options */}
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

              {/* Account lookups (except cash/credit note/due adjustments) */}
              {refundMethod !== 'cash' && refundMethod !== 'supplier_credit' && refundMethod !== 'due_adjustment' && (
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
                onClick={() => handleSubmitWithStatus(returnStatus, 'redirect')}
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
                  onClick={() => handleSubmitWithStatus('draft', 'clear')}
                  disabled={isSubmitting}
                  className="h-9 text-xs border-input hover:bg-muted font-medium cursor-pointer"
                >
                  {isBangla ? "খসড়া রাখুন" : "Save Draft"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSubmitWithStatus('pending', 'clear')}
                  disabled={isSubmitting}
                  className="h-9 text-xs border-input hover:bg-muted font-medium cursor-pointer"
                >
                  {isBangla ? "অনুমোদন ও নতুন" : "Save & New"}
                </Button>
              </div>

              <Button
                type="button"
                variant="secondary"
                onClick={() => handleSubmitWithStatus(returnStatus, 'print')}
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
