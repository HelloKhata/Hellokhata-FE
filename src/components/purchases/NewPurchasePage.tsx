// Hello Khata OS - New Purchase Page (Add Stock)
// Simplified UI for small retailers - internally creates Purchase + Inventory Transaction
// Elite SaaS Design - Dark Theme First

'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Divider } from '@/components/ui/premium';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
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
  DollarSign,
  Calculator,
  CreditCard,
  Banknote,
  Wallet,
  AlertCircle,
  CheckCircle,
  Loader2,
  Calendar as CalendarIcon,
  X,
  Search,
  Users,
  Camera
} from 'lucide-react';
import { useCurrency } from '@/hooks/useAppTranslation';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { useSessionStore, useUser } from '@/stores/sessionStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGetItems } from '@/hooks/api/useItems';
import { useParties, useParty } from '@/hooks/api/useParties';
import { useCreatePurchases } from '@/hooks/api/usePurchases';

interface PurchaseItem {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unitCost: number;
  unit: string;
  total: number;
  searchQuery: string;
  showSuggestions: boolean;
}

function NewPurchaseContent() {
  const { t, isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const searchParams = useSearchParams();
  const partyIdParam = searchParams.get('partyId') || 'none';
  const router = useRouter();

  // Form state
  const [supplierId, setSupplierId] = useState<string>(partyIdParam);
  const [supplierSearchQuery, setSupplierSearchQuery] = useState('');
  const [showSupplierSuggestions, setShowSupplierSuggestions] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mobile_banking' | 'credit'>('cash');
  const [paidAmount, setPaidAmount] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [purchaseDate, setPurchaseDate] = useState<Date>(new Date());

  // Billing items table state
  const [items, setItems] = useState<PurchaseItem[]>([
    {
      id: '1',
      itemId: '',
      itemName: '',
      quantity: 1,
      unitCost: 0,
      unit: 'pcs',
      total: 0,
      searchQuery: '',
      showSuggestions: false,
    }
  ]);

  // Fetch data
  const { data: productsData } = useGetItems({ page: 1, limit: 100 });
  const { data: suppliersData } = useParties({ type: 'supplier' });
  const { mutate: createPurchase, isPending: isCreatingPurchases } = useCreatePurchases();

  const products = productsData?.data || [];
  const suppliers = suppliersData?.data || [];
  const user = useUser();

  // Fetch individual supplier if supplierId is set
  const { data: singleSupplierData } = useParty(supplierId, { enabled: !!supplierId && supplierId !== 'none' });

  // Selected Supplier Name
  const selectedSupplierName = useMemo(() => {
    if (supplierId === 'none') return '';
    const supplier = suppliers.find((s: any) => s.id === supplierId);
    if (supplier) return supplier.name;
    if (singleSupplierData?.data && singleSupplierData.data.id === supplierId) {
      return singleSupplierData.data.name;
    }
    return '';
  }, [suppliers, supplierId, singleSupplierData]);

  // Filter suppliers for autocomplete suggestions
  const filteredSuppliers = useMemo(() => {
    if (!supplierSearchQuery) return suppliers.slice(0, 10);
    return suppliers.filter((supplier: any) =>
      supplier.name.toLowerCase().includes(supplierSearchQuery.toLowerCase()) ||
      supplier.phone?.toLowerCase().includes(supplierSearchQuery.toLowerCase())
    );
  }, [suppliers, supplierSearchQuery]);

  // Filter available products for inline suggestions
  const getFilteredProducts = (query: string) => {
    if (!query) return products.slice(0, 10);
    return products.filter((item: any) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.sku?.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Calculations
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.total, 0);
  }, [items]);

  const total = subtotal;

  const effectivePaidAmount = useMemo(() => {
    if (paymentMethod === 'credit') return 0;
    return paidAmount === '' ? total : (parseFloat(paidAmount) || total);
  }, [paymentMethod, paidAmount, total]);

  const due = Math.max(0, total - effectivePaidAmount);

  // Name Input Change
  const handleNameChange = (id: string, value: string) => {
    setItems((prev) => prev.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          itemName: value,
          searchQuery: value,
          showSuggestions: true,
        };
      }
      return item;
    }));
  };

  // Product Selection
  const handleSelectProduct = (rowId: string, product: any) => {
    setItems((prev) => prev.map((item) => {
      if (item.id === rowId) {
        const cost = product.costPrice || 0;
        return {
          ...item,
          itemId: product.id,
          itemName: product.name,
          unit: product.unit || 'pcs',
          unitCost: cost,
          total: item.quantity * cost,
          showSuggestions: false,
        };
      }
      return item;
    }));
  };

  // Quantity Change
  const handleQuantityChange = (id: string, value: string) => {
    const qty = parseFloat(value) || 0;
    setItems((prev) => prev.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          quantity: qty,
          total: qty * item.unitCost,
        };
      }
      return item;
    }));
  };

  // Cost Change
  const handleCostChange = (id: string, value: string) => {
    const cost = parseFloat(value) || 0;
    setItems((prev) => prev.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          unitCost: cost,
          total: item.quantity * cost,
        };
      }
      return item;
    }));
  };

  // Add Item Row
  const addItemRow = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        itemId: '',
        itemName: '',
        quantity: 1,
        unitCost: 0,
        unit: 'pcs',
        total: 0,
        searchQuery: '',
        showSuggestions: false,
      }
    ]);
  };

  // Remove Item Row
  const removeItemRow = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Handle row blur with delay to register suggestion clicks
  const handleRowBlur = (id: string) => {
    setTimeout(() => {
      setItems((prev) => prev.map((item) => {
        if (item.id === id) {
          return { ...item, showSuggestions: false };
        }
        return item;
      }));
    }, 200);
  };

  // Submit Purchase
  const handleSubmit = () => {
    const validItems = items.filter((i) => i.itemId !== '');
    if (validItems.length === 0) {
      toast.error(isBangla ? 'অন্তত একটি পণ্য যোগ করুন' : 'Add at least one item');
      return;
    }

    const data = {
      supplierId: supplierId === 'none' ? undefined : supplierId,
      items: validItems.map(item => ({
        itemId: item.itemId,
        itemName: item.itemName,
        quantity: item.quantity,
        unitCost: item.unitCost,
        trackBatch: true,
        expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        manufactureDate: new Date().toISOString(),
      })),
      paidAmount: effectivePaidAmount,
      accountId: user?.id || '',
      notes,
    };

    createPurchase(data, {
      onSuccess: () => {
        toast.success(isBangla ? 'স্টক সফলভাবে যোগ করা হয়েছে' : 'Stock added successfully');
        router.push('/purchases');
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Section */}
      <div className="flex items-center justify-between pb-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          {isBangla ? 'স্টক যোগ করুন' : 'Add Stock'}
        </h1>
        <Button variant="ghost" onClick={() => router.back()} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {isBangla ? 'পেছনে' : 'Back'}
        </Button>
      </div>

      <div className="space-y-6">
        {/* Row 1 Layout: Select Supplier, Purchase No, Purchase Date */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* Select Supplier */}
          <div className="relative space-y-2">
            <Label className="text-sm font-medium text-foreground">
              {isBangla ? 'সরবরাহকারী নির্বাচন করুন' : 'Select Supplier'}
            </Label>
            <div className="relative">
              <Input
                value={selectedSupplierName || supplierSearchQuery}
                onChange={(e) => {
                  setSupplierSearchQuery(e.target.value);
                  if (supplierId && supplierId !== 'none') setSupplierId('none');
                  setShowSupplierSuggestions(true);
                }}
                onFocus={() => setShowSupplierSuggestions(true)}
                onBlur={() => {
                  setTimeout(() => setShowSupplierSuggestions(false), 200);
                }}
                placeholder={isBangla ? 'সরবরাহকারী খুঁজুন...' : 'Search for supplier'}
                className="pr-10 h-11 bg-background/50 border-input"
              />
              <Users className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

              {showSupplierSuggestions && (
                <div className="absolute z-50 left-0 top-full mt-1 w-full bg-card border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto divide-y divide-border">
                  {filteredSuppliers.length === 0 ? (
                    <div className="p-3 text-center text-sm text-muted-foreground">
                      {isBangla ? 'কোনো সরবরাহকারী পাওয়া যায়নি' : 'No suppliers found'}
                    </div>
                  ) : (
                    filteredSuppliers.map((supplier: any) => (
                      <button
                        key={supplier.id}
                        type="button"
                        className="w-full text-left p-3 hover:bg-muted/80 text-sm transition-colors flex justify-between"
                        onClick={() => {
                          setSupplierId(supplier.id);
                          setSupplierSearchQuery('');
                        }}
                      >
                        <span className="font-medium text-foreground">{supplier.name}</span>
                        {supplier.phone && <span className="text-xs text-muted-foreground">{supplier.phone}</span>}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Purchase No */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium text-foreground">
                {isBangla ? 'ক্রয় নম্বর' : 'Purchase No'}
              </Label>
            </div>
            <Input
              disabled
              placeholder={isBangla ? 'স্বয়ংক্রিয় ক্রয়' : 'Auto Generated'}
              className="h-11 bg-background/50 border-input font-medium"
            />
          </div>

          {/* Purchase Date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              {isBangla ? 'ক্রয় তারিখ' : 'Purchase Date'}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-11 justify-between text-left font-normal bg-background/50 border-input text-foreground hover:bg-muted"
                >
                  <span>{format(purchaseDate, 'dd MMM yyyy')}</span>
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={purchaseDate}
                  onSelect={(date) => date && setPurchaseDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Row 2: Billing Items Table */}
        <div className="border border-border rounded-xl bg-card overflow-visible shadow-sm">
          <div className="overflow-visible">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b border-border text-muted-foreground text-xs font-semibold uppercase">
                  <th className="px-4 py-3 w-[8%]">{isBangla ? 'ক্রমিক' : 'S.N.'}</th>
                  <th className="px-4 py-3 w-[45%]">{isBangla ? 'নাম' : 'Name'}</th>
                  <th className="px-4 py-3 w-[15%]">{isBangla ? 'পরিমাণ' : 'Quantity'}</th>
                  <th className="px-4 py-3 w-[20%]">{isBangla ? 'ক্রয় মূল্য / দর' : 'Cost Price / Rate'}</th>
                  <th className="px-4 py-3 w-[12%] text-right">{isBangla ? 'মোট' : 'Amount'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                    {/* SN */}
                    <td className="px-4 py-4 font-bold text-amber-500 align-middle">
                      {idx + 1}
                    </td>

                    {/* Name */}
                    <td className="px-4 py-3 align-middle relative">
                      <Input
                        value={item.itemName}
                        onChange={(e) => handleNameChange(item.id, e.target.value)}
                        onFocus={() => {
                          setItems((prev) => prev.map((it) => {
                            if (it.id === item.id) {
                              return { ...it, showSuggestions: true };
                            }
                            return it;
                          }));
                        }}
                        onBlur={() => handleRowBlur(item.id)}
                        placeholder={isBangla ? 'পণ্য নাম লিখুন' : 'Enter Item name'}
                        className="bg-transparent border-none outline-none focus-visible:ring-0 px-0 h-9"
                      />

                      {item.showSuggestions && (
                        <div className="absolute z-50 left-4 right-4 top-full mt-1 bg-card border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto divide-y divide-border">
                          {getFilteredProducts(item.searchQuery).length === 0 ? (
                            <div className="p-3 text-center text-xs text-muted-foreground">
                              {isBangla ? 'কোনো পণ্য পাওয়া যায়নি' : 'No items found'}
                            </div>
                          ) : (
                            getFilteredProducts(item.searchQuery).map((product: any) => (
                              <button
                                key={product.id}
                                type="button"
                                className="w-full text-left p-3 hover:bg-muted/80 text-xs transition-colors flex justify-between"
                                onClick={() => handleSelectProduct(item.id, product)}
                              >
                                <div>
                                  <p className="font-semibold text-foreground">{product.name}</p>
                                  <p className="text-[10px] text-muted-foreground">Stock: {product.currentStock} {product.unit}</p>
                                </div>
                                <span className="font-bold text-emerald-500">Tk. {product.costPrice}</span>
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </td>

                    {/* Quantity */}
                    <td className="px-4 py-3 align-middle">
                      <Input
                        type="number"
                        value={item.quantity || ''}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        className="bg-background/30 h-9 text-center border-input focus:ring-0"
                        min="1"
                      />
                    </td>

                    {/* Rate */}
                    <td className="px-4 py-3 align-middle">
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-xs text-muted-foreground font-medium">Tk.</span>
                        <Input
                          type="number"
                          value={item.unitCost || ''}
                          onChange={(e) => handleCostChange(item.id, e.target.value)}
                          className="pl-9 bg-background/30 h-9 border-input focus:ring-0"
                          min="0"
                        />
                      </div>
                    </td>

                    {/* Amount & Action */}
                    <td className="px-4 py-3 align-middle text-right font-medium text-foreground">
                      <div className="flex items-center justify-end gap-3">
                        <span className="font-semibold text-foreground text-sm">Tk. {item.total.toFixed(2)}</span>
                        <button
                          type="button"
                          onClick={() => removeItemRow(item.id)}
                          className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Bottom Add Action */}
          <div className="flex justify-between items-center px-6 py-4 bg-muted/10 border-t border-border">
            <button
              type="button"
              onClick={addItemRow}
              className="text-emerald-500 font-semibold text-sm flex items-center gap-1.5 hover:text-emerald-600 transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              {isBangla ? 'বিল আইটেম যোগ করুন' : 'Add Billing Item'}
            </button>
            <div className="flex items-center gap-8">
              <span className="text-sm text-muted-foreground font-medium">{isBangla ? 'উপমোট' : 'Sub Total'}</span>
              <span className="font-bold text-foreground text-base">Tk. {subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Row 3 Layout: Notes, Attachments, Totals and Payment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Notes and Attachments */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                {isBangla ? 'নোট বা মন্তব্য' : 'Notes or Remarks'}
              </Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={isBangla ? 'নোট লিখুন...' : 'Enter note or description...'}
                className="min-h-[100px] bg-background/50 border-input resize-none"
              />
            </div>

            {/* Attach Images */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                {isBangla ? 'ছবি সংযুক্ত করুন' : 'Attach Images'}
              </Label>
              <div className="flex flex-wrap gap-3 items-center">
                <button
                  type="button"
                  className="h-16 w-16 rounded-xl border border-dashed border-border flex flex-col items-center justify-center bg-background/30 hover:bg-muted/50 hover:border-emerald-500 transition-all text-muted-foreground hover:text-foreground"
                >
                  <Camera className="h-5 w-5 mb-1" />
                  <span className="text-[10px]">{isBangla ? 'ক্যামেরা' : 'Upload'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Totals, Payment Mode and Submit Actions */}
          <div className="space-y-6 lg:pl-12">
            {/* Total Amount Output */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-base font-semibold text-foreground">{isBangla ? 'সর্বমোট পরিমাণ' : 'Total Amount'}</span>
              <div className="relative w-48 flex items-center">
                <span className="absolute left-3 text-sm text-muted-foreground font-semibold">Tk.</span>
                <Input
                  value={total.toFixed(2)}
                  readOnly
                  className="pl-9 h-11 bg-muted/30 border-input text-right font-bold text-lg text-foreground focus-visible:ring-0"
                />
              </div>
            </div>

            {/* Payment Mode Selector */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-base font-semibold text-foreground">{isBangla ? 'পেমেন্ট মোড' : 'Payment Mode'}</span>
              <div className="w-48">
                <Select value={paymentMethod} onValueChange={(val: any) => setPaymentMethod(val)}>
                  <SelectTrigger className="h-11 bg-background/50 border-input text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">{isBangla ? 'নগদ (Cash)' : 'Cash'}</SelectItem>
                    <SelectItem value="card">{isBangla ? 'কার্ড (Card)' : 'Card'}</SelectItem>
                    <SelectItem value="mobile_banking">{isBangla ? 'মোবাইল ব্যাংকিং' : 'Mobile Banking'}</SelectItem>
                    <SelectItem value="credit">{isBangla ? 'বাকি (Credit)' : 'Credit'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Paid Amount Input (if not Credit) */}
            {paymentMethod !== 'credit' && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-base font-semibold text-foreground">{isBangla ? 'পরিশোধিত পরিমাণ' : 'Paid Amount'}</span>
                <div className="relative w-48 flex items-center">
                  <span className="absolute left-3 text-sm text-muted-foreground font-semibold">Tk.</span>
                  <Input
                    type="number"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                    placeholder={total.toString()}
                    className="pl-9 h-11 bg-background/50 border-input text-right font-bold text-foreground"
                    min="0"
                  />
                </div>
              </div>
            )}

            {/* Due Alert */}
            {due > 0 && (
              <div className="p-3.5 bg-destructive/10 border border-destructive/20 rounded-xl flex justify-between items-center text-sm font-semibold">
                <span className="text-destructive">{isBangla ? 'বাকি পরিমাণ' : 'Due Amount'}</span>
                <span className="text-destructive font-bold">Tk. {due.toFixed(2)}</span>
              </div>
            )}

            {/* Submit Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1 h-11 border-input hover:bg-muted"
              >
                <X className="h-4 w-4 mr-2" />
                {isBangla ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isCreatingPurchases || items.length === 0}
                className="flex-1 h-11 font-semibold"
              >
                {isCreatingPurchases ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    {isBangla ? 'সংরক্ষণ হচ্ছে...' : 'Saving...'}
                  </span>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {isBangla ? 'স্টক যোগ করুন' : 'Add Stock'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewPurchasePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <NewPurchaseContent />
    </Suspense>
  );
}
