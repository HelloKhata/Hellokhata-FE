// Hello Khata OS - Enterprise Add Item / Add Inventory Page
// হ্যালো খাতা - নতুন ইনভেন্টরি পণ্য যোগ

'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Package,
  ArrowLeft,
  DollarSign,
  Tag,
  Plus,
  QrCode,
  Sparkles,
  Truck,
  Store,
  Layers,
  FileCheck,
  FileText,
  UploadCloud,
  X,
  CheckCircle2,
  AlertTriangle,
  Info,
  TrendingUp,
  Percent,
  Calculator,
  Save,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useCreateItem, useGetItemsCategories } from '@/hooks/api/useItems';
import { useSearch } from '@/hooks/api/useSearch';

const initialForm = {
  // Section 1: Basic Information
  name: '',
  categoryId: '',
  brand: '',
  sku: '',
  barcode: '',
  unit: 'pcs',
  productType: 'Physical Product',
  status: 'Active',
  trackInventory: true,
  batchTracking: false,
  expiryTracking: false,
  variantProduct: false,

  // Section 2: Pricing
  costPrice: '',
  sellingPrice: '',
  wholesalePrice: '',
  dealerPrice: '',
  onlinePrice: '',
  minimumPrice: '',

  // Section 3: Inventory Information
  openingStock: '0',
  minStock: '10',
  maxStock: '',
  reorderLevel: '15',
  damagedStock: '0',
  inTransitStock: '0',

  // Section 4 & 5: Purchase & Supplier
  supplierId: '',
  supplierSku: '',
  supplierContact: '',
  purchaseUnit: 'pcs',
  purchaseTax: '0',
  lastPurchaseDate: '',

  // Section 6: Branch & Batch Management
  defaultBranch: 'Main Branch',
  storageLocation: '',
  batchPrefix: 'BCH-',
  autoBatch: true,

  // Section 7: Tax & Accounting
  taxCategory: 'Standard',
  vatRate: '5',
  incomeAccount: 'Sales Revenue',
  expenseAccount: 'Operating Expenses',
  inventoryAccount: 'Inventory Assets',
  cogsAccount: 'Cost of Goods Sold',

  // Section 8: Description & Keywords
  shortDescription: '',
  description: '',
  internalNotes: '',
  tags: '',
  keywords: '',

  // Images
  images: [] as string[],
};

export default function NewItemPage() {
  const { t, isBangla } = useAppTranslation();
  const router = useRouter();
  const createItem = useCreateItem();

  const { data: categoriesData } = useGetItemsCategories();
  const categories = categoriesData?.data || [];

  const [formData, setFormData] = useState(initialForm);
  const [showAdvancedPricing, setShowAdvancedPricing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Dialog states for Quick Add
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddBrandModal, setShowAddBrandModal] = useState(false);
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newBrandName, setNewBrandName] = useState('');
  const [newSupplierName, setNewSupplierName] = useState('');

  // Debounced search for existing items
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(formData.name);
    }, 300);
    return () => clearTimeout(timer);
  }, [formData.name]);

  const { data: searchResults } = useSearch({
    index: 'items',
    query: debouncedSearchQuery,
    filter: 'isActive = true',
  });

  const suggestions = searchResults?.data?.hits || [];

  const updateForm = (key: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Auto-generate SKU
  const handleGenerateSku = () => {
    const prefix = formData.name
      ? formData.name.substring(0, 3).toUpperCase()
      : 'ITEM';
    const random = Math.floor(1000 + Math.random() * 9000);
    const sku = `${prefix}-${random}`;
    updateForm('sku', sku);
    toast.info(`Generated SKU: ${sku}`);
  };

  // Auto-generate Barcode
  const handleGenerateBarcode = () => {
    const code = '890' + Math.floor(100000000 + Math.random() * 900000000);
    updateForm('barcode', code);
    toast.info(`Generated Barcode: ${code}`);
  };

  // Auto-populate from suggestion
  const handleSelectItem = (item: any) => {
    setFormData((prev) => ({
      ...prev,
      name: item.name || '',
      categoryId: item.categoryId || '',
      sku: item.sku || '',
      barcode: item.barcode ? String(item.barcode) : '',
      description: item.description || '',
      unit: item.unit || 'pcs',
      costPrice: item.costPrice !== undefined ? String(item.costPrice) : '',
      sellingPrice: item.sellingPrice !== undefined ? String(item.sellingPrice) : '',
      wholesalePrice: item.wholesalePrice !== undefined ? String(item.wholesalePrice) : '',
      openingStock: item.currentStock !== undefined ? String(item.currentStock) : '0',
      minStock: item.minStock !== undefined ? String(item.minStock) : '10',
    }));
    setShowSuggestions(false);
  };

  // Real-time Margin & Profit Calculation
  const financialMetrics = useMemo(() => {
    const cost = parseFloat(formData.costPrice) || 0;
    const selling = parseFloat(formData.sellingPrice) || 0;
    const profit = selling - cost;
    const markup = cost > 0 ? ((selling - cost) / cost) * 100 : 0;
    const margin = selling > 0 ? ((selling - cost) / selling) * 100 : 0;

    return {
      cost,
      selling,
      profit,
      markup: isNaN(markup) ? 0 : markup.toFixed(1),
      margin: isNaN(margin) ? 0 : margin.toFixed(1),
    };
  }, [formData.costPrice, formData.sellingPrice]);

  // Handle Form Submission
  const handleSubmit = async (isDraft = false) => {
    if (!formData.name.trim()) {
      toast.error(isBangla ? 'পণ্যের নাম আবশ্যক' : 'Product Name is required');
      return;
    }

    if (!formData.categoryId) {
      toast.error(isBangla ? 'ক্যাটাগরি নির্বাচন করুন' : 'Category is required');
      return;
    }

    const sellingPrice = parseFloat(formData.sellingPrice) || 0;
    if (sellingPrice <= 0) {
      toast.error(isBangla ? 'বিক্রয় মূল্য প্রয়োজন' : 'Selling Price is required');
      return;
    }

    const costPrice = parseFloat(formData.costPrice) || 0;

    const payload = {
      name: formData.name,
      nameBn: formData.name,
      categoryId: formData.categoryId || undefined,
      brand: formData.brand || undefined,
      sku: formData.sku || undefined,
      barcode: formData.barcode || undefined,
      description: formData.description || undefined,
      unit: formData.unit,
      costPrice,
      sellingPrice,
      wholesalePrice: formData.wholesalePrice ? parseFloat(formData.wholesalePrice) : undefined,
      minimumPrice: formData.minimumPrice ? parseFloat(formData.minimumPrice) : undefined,
      currentStock: parseFloat(formData.openingStock) || 0,
      minStock: parseFloat(formData.minStock) || 10,
      maxStock: formData.maxStock ? parseFloat(formData.maxStock) : undefined,
      supplierId: formData.supplierId || undefined,
    };

    createItem.mutate(payload, {
      onSuccess: (data) => {
        if (data.success) {
          toast.success(
            isDraft
              ? 'Draft product saved successfully!'
              : 'Product created successfully!'
          );
          setFormData(initialForm);
          router.push('/inventory');
        }
      },
    });
  };

  return (
    <div className="space-y-8 pb-28 py-4 max-w-6xl mx-auto">
      {/* ---------------------------------------------------- */}
      {/* PAGE HEADER */}
      {/* ---------------------------------------------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div className="space-y-1">
          <Link
            href="/inventory"
            className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {isBangla ? 'ইনভেন্টরিতে ফিরে যান' : 'Back to Inventory'}
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary/15 text-primary flex items-center justify-center font-bold shrink-0">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
                {isBangla ? 'নতুন পণ্য যোগ করুন' : 'Add New Product'}
              </h1>
              <p className="text-xs text-muted-foreground">
                {isBangla
                  ? 'নতুন ইনভেন্টরি পণ্য তৈরি করুন এবং মূল্য, স্টক ও সরবরাহকারী কনফিগার করুন'
                  : 'Create a new inventory item and configure pricing, stock, suppliers, and ERP settings.'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/inventory')}
            className="h-9 px-4 text-xs font-semibold rounded-xl border-input cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleSubmit(true)}
            className="h-9 px-4 text-xs font-semibold rounded-xl cursor-pointer"
          >
            Save Draft
          </Button>
          <Button
            size="sm"
            disabled={createItem.isPending}
            onClick={() => handleSubmit(false)}
            className="h-9 px-4 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer flex items-center gap-1.5"
          >
            {createItem.isPending ? (
              <Sparkles className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Product
          </Button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* SECTION 1 — BASIC INFORMATION */}
      {/* ---------------------------------------------------- */}
      <Card className="border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden">
        <CardHeader className="p-5 border-b border-border/40 pb-4">
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <Package className="h-4 w-4" />
            </div>
            <span>Basic Product Information</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Product Name with Suggestions */}
          <div className="relative space-y-1.5">
            <Label className="text-xs font-semibold text-foreground flex items-center gap-1">
              Product Name <span className="text-destructive">*</span>
            </Label>
            <Input
              value={formData.name}
              onChange={(e) => {
                updateForm('name', e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="e.g. Premium Jasmine Rice 5kg"
              className="h-10 text-xs bg-background rounded-xl border-input"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 left-0 top-full mt-1 w-full bg-card border border-border rounded-2xl shadow-xl max-h-56 overflow-y-auto divide-y divide-border/40">
                {suggestions.map((item: any) => (
                  <button
                    key={item.id}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectItem(item);
                    }}
                    className="w-full text-left p-3 hover:bg-muted/80 text-xs transition-colors flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold text-foreground">{item.name}</p>
                      {item.sku && (
                        <p className="text-[10px] text-muted-foreground">SKU: {item.sku}</p>
                      )}
                    </div>
                    {item.sellingPrice !== undefined && (
                      <Badge variant="secondary" className="font-mono text-xs">
                        ৳{item.sellingPrice}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* SKU & Barcode Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* SKU */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-semibold text-foreground">SKU Code</Label>
                <button
                  type="button"
                  onClick={handleGenerateSku}
                  className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" /> Generate SKU
                </button>
              </div>
              <Input
                value={formData.sku}
                onChange={(e) => updateForm('sku', e.target.value)}
                placeholder="e.g. JSM-RC-5KG"
                className="h-10 text-xs font-mono font-semibold bg-background rounded-xl border-input"
              />
            </div>

            {/* Barcode */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-semibold text-foreground">Barcode / EAN</Label>
                <button
                  type="button"
                  onClick={handleGenerateBarcode}
                  className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <QrCode className="h-3 w-3" /> Generate Barcode
                </button>
              </div>
              <Input
                value={formData.barcode}
                onChange={(e) => updateForm('barcode', e.target.value)}
                placeholder="e.g. 8901030700812"
                className="h-10 text-xs font-mono font-semibold bg-background rounded-xl border-input"
              />
            </div>
          </div>

          {/* Category, Brand, Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Category */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-semibold text-foreground">
                  Category <span className="text-destructive">*</span>
                </Label>
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(true)}
                  className="text-[10px] font-bold text-primary hover:underline flex items-center gap-0.5"
                >
                  <Plus className="h-3 w-3" /> Add
                </button>
              </div>
              <Select
                value={formData.categoryId}
                onValueChange={(val) => updateForm('categoryId', val)}
              >
                <SelectTrigger className="h-10 text-xs bg-background rounded-xl border-input">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="bg-card border border-border rounded-xl text-xs">
                  {categories.map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.id} className="text-xs cursor-pointer">
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Brand */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-semibold text-foreground">Brand</Label>
                <button
                  type="button"
                  onClick={() => setShowAddBrandModal(true)}
                  className="text-[10px] font-bold text-primary hover:underline flex items-center gap-0.5"
                >
                  <Plus className="h-3 w-3" /> Add
                </button>
              </div>
              <Input
                value={formData.brand}
                onChange={(e) => updateForm('brand', e.target.value)}
                placeholder="e.g. Royal Harvest"
                className="h-10 text-xs bg-background rounded-xl border-input"
              />
            </div>

            {/* Unit */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Unit Measure <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.unit}
                onValueChange={(val) => updateForm('unit', val)}
              >
                <SelectTrigger className="h-10 text-xs bg-background rounded-xl border-input">
                  <SelectValue placeholder="Select Unit" />
                </SelectTrigger>
                <SelectContent className="bg-card border border-border rounded-xl text-xs">
                  <SelectItem value="pcs">Pcs (Pieces)</SelectItem>
                  <SelectItem value="kg">Kg (Kilograms)</SelectItem>
                  <SelectItem value="bag">Bag</SelectItem>
                  <SelectItem value="box">Box</SelectItem>
                  <SelectItem value="carton">Carton</SelectItem>
                  <SelectItem value="liter">Liter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product Type & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Product Type</Label>
              <Select
                value={formData.productType}
                onValueChange={(val) => updateForm('productType', val)}
              >
                <SelectTrigger className="h-10 text-xs bg-background rounded-xl border-input">
                  <SelectValue placeholder="Product Type" />
                </SelectTrigger>
                <SelectContent className="bg-card border border-border rounded-xl text-xs">
                  <SelectItem value="Physical Product">Physical Product</SelectItem>
                  <SelectItem value="Service">Service</SelectItem>
                  <SelectItem value="Digital Product">Digital Product</SelectItem>
                  <SelectItem value="Raw Material">Raw Material</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Initial Status</Label>
              <Select
                value={formData.status}
                onValueChange={(val) => updateForm('status', val)}
              >
                <SelectTrigger className="h-10 text-xs bg-background rounded-xl border-input">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-card border border-border rounded-xl text-xs">
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-muted/30 border border-border/40">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-foreground">Track Inventory</span>
              <Switch
                checked={formData.trackInventory}
                onCheckedChange={(val) => updateForm('trackInventory', val)}
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-foreground">Batch Tracking</span>
              <Switch
                checked={formData.batchTracking}
                onCheckedChange={(val) => updateForm('batchTracking', val)}
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-foreground">Expiry Tracking</span>
              <Switch
                checked={formData.expiryTracking}
                onCheckedChange={(val) => updateForm('expiryTracking', val)}
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-foreground">Variant Product</span>
              <Switch
                checked={formData.variantProduct}
                onCheckedChange={(val) => updateForm('variantProduct', val)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ---------------------------------------------------- */}
      {/* SECTION 2 — PRICING & PROFIT MARGINS */}
      {/* ---------------------------------------------------- */}
      <Card className="border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden">
        <CardHeader className="p-5 border-b border-border/40 pb-4">
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <Tag className="h-4 w-4" />
            </div>
            <span>Pricing & Profit Margins</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Price Inputs */}
            <div className="lg:col-span-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Purchase Cost */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">
                    Purchase Cost <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                      ৳
                    </span>
                    <Input
                      type="number"
                      value={formData.costPrice}
                      onChange={(e) => updateForm('costPrice', e.target.value)}
                      placeholder="0.00"
                      className="pl-7 h-10 text-xs font-mono font-bold bg-background rounded-xl border-input"
                    />
                  </div>
                </div>

                {/* Retail Selling Price */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">
                    Retail Selling Price (MRP) <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                      ৳
                    </span>
                    <Input
                      type="number"
                      value={formData.sellingPrice}
                      onChange={(e) => updateForm('sellingPrice', e.target.value)}
                      placeholder="0.00"
                      className="pl-7 h-10 text-xs font-mono font-bold bg-background rounded-xl border-input"
                    />
                  </div>
                </div>
              </div>

              {/* Advanced Multi-Tier Pricing Toggle */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdvancedPricing(!showAdvancedPricing)}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <Calculator className="h-4 w-4" />
                  {showAdvancedPricing ? 'Hide Multi-Tier Pricing' : '+ Enable Wholesale, Dealer & Special Pricing Tiers'}
                </button>
              </div>

              {showAdvancedPricing && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-muted/30 border border-border/40 animate-fade-in">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-semibold text-muted-foreground">Wholesale Price</Label>
                    <Input
                      type="number"
                      value={formData.wholesalePrice}
                      onChange={(e) => updateForm('wholesalePrice', e.target.value)}
                      placeholder="0.00"
                      className="h-9 text-xs font-mono bg-background rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-semibold text-muted-foreground">Dealer / VIP Price</Label>
                    <Input
                      type="number"
                      value={formData.dealerPrice}
                      onChange={(e) => updateForm('dealerPrice', e.target.value)}
                      placeholder="0.00"
                      className="h-9 text-xs font-mono bg-background rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-semibold text-muted-foreground">Minimum Floor Price</Label>
                    <Input
                      type="number"
                      value={formData.minimumPrice}
                      onChange={(e) => updateForm('minimumPrice', e.target.value)}
                      placeholder="0.00"
                      className="h-9 text-xs font-mono bg-background rounded-xl"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Financial Calculator Summary Card */}
            <div className="lg:col-span-4 p-5 rounded-2xl bg-muted/40 border border-border/60 space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <span className="text-xs font-bold text-foreground">Profit & Margin Calculator</span>
                <Percent className="h-4 w-4 text-emerald-500" />
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Gross Profit / Unit:</span>
                  <span className="font-extrabold text-foreground">
                    ৳{financialMetrics.profit.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Markup %:</span>
                  <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                    {financialMetrics.markup}%
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Profit Margin %:</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                    {financialMetrics.margin}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ---------------------------------------------------- */}
      {/* SECTION 3 — INVENTORY INFORMATION */}
      {/* ---------------------------------------------------- */}
      <Card className="border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden">
        <CardHeader className="p-5 border-b border-border/40 pb-4">
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
              <Layers className="h-4 w-4" />
            </div>
            <span>Inventory Stock Levels</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Opening Stock */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">Opening Stock</Label>
                <Input
                  type="number"
                  value={formData.openingStock}
                  onChange={(e) => updateForm('openingStock', e.target.value)}
                  placeholder="0"
                  className="h-10 text-xs font-bold bg-background rounded-xl border-input"
                />
              </div>

              {/* Min Stock Level */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">Minimum Stock Alert</Label>
                <Input
                  type="number"
                  value={formData.minStock}
                  onChange={(e) => updateForm('minStock', e.target.value)}
                  placeholder="10"
                  className="h-10 text-xs font-bold bg-background rounded-xl border-input"
                />
              </div>

              {/* Max Stock Level */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">Maximum Stock Capacity</Label>
                <Input
                  type="number"
                  value={formData.maxStock}
                  onChange={(e) => updateForm('maxStock', e.target.value)}
                  placeholder="500"
                  className="h-10 text-xs font-bold bg-background rounded-xl border-input"
                />
              </div>
            </div>

            {/* Real-time Available Stock Summary Card */}
            <div className="lg:col-span-4 p-5 rounded-2xl bg-muted/40 border border-border/60 space-y-3">
              <span className="text-xs font-bold text-foreground block border-b border-border/40 pb-2">
                Stock Summary Breakdown
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Opening Balance:</span>
                  <span className="font-bold text-foreground">{formData.openingStock || 0} {formData.unit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Min Alert Level:</span>
                  <span className="font-bold text-amber-600">{formData.minStock || 0} {formData.unit}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ---------------------------------------------------- */}
      {/* SECTION 4 & 5 — SUPPLIER & PURCHASE INFORMATION */}
      {/* ---------------------------------------------------- */}
      <Card className="border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden">
        <CardHeader className="p-5 border-b border-border/40 pb-4">
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Truck className="h-4 w-4" />
            </div>
            <span>Supplier & Purchase Configuration</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-semibold text-foreground">Preferred Supplier</Label>
                <button
                  type="button"
                  onClick={() => setShowAddSupplierModal(true)}
                  className="text-[10px] font-bold text-primary hover:underline flex items-center gap-0.5"
                >
                  <Plus className="h-3 w-3" /> Add
                </button>
              </div>
              <Input
                value={formData.supplierId}
                onChange={(e) => updateForm('supplierId', e.target.value)}
                placeholder="e.g. Agro Foods Trading Co."
                className="h-10 text-xs bg-background rounded-xl border-input"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Supplier SKU Code</Label>
              <Input
                value={formData.supplierSku}
                onChange={(e) => updateForm('supplierSku', e.target.value)}
                placeholder="e.g. SUP-JSM-01"
                className="h-10 text-xs font-mono bg-background rounded-xl border-input"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Supplier Contact Phone</Label>
              <Input
                value={formData.supplierContact}
                onChange={(e) => updateForm('supplierContact', e.target.value)}
                placeholder="+880 1711-234567"
                className="h-10 text-xs bg-background rounded-xl border-input"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ---------------------------------------------------- */}
      {/* SECTION 6 — BRANCH & BATCH MANAGEMENT */}
      {/* ---------------------------------------------------- */}
      <Card className="border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden">
        <CardHeader className="p-5 border-b border-border/40 pb-4">
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <Store className="h-4 w-4" />
            </div>
            <span>Branch & Storage Location</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Primary Branch</Label>
              <Select
                value={formData.defaultBranch}
                onValueChange={(val) => updateForm('defaultBranch', val)}
              >
                <SelectTrigger className="h-10 text-xs bg-background rounded-xl border-input">
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent className="bg-card border border-border rounded-xl text-xs">
                  <SelectItem value="Main Branch">Main Branch (Dhaka)</SelectItem>
                  <SelectItem value="Banani Outlet">Banani Outlet</SelectItem>
                  <SelectItem value="Chittagong GEC">Chittagong GEC</SelectItem>
                  <SelectItem value="Sylhet Outlet">Sylhet Outlet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Storage Location / Bin</Label>
              <Input
                value={formData.storageLocation}
                onChange={(e) => updateForm('storageLocation', e.target.value)}
                placeholder="e.g. Shelf A-3, Rack 2"
                className="h-10 text-xs bg-background rounded-xl border-input"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Batch Prefix</Label>
              <Input
                value={formData.batchPrefix}
                onChange={(e) => updateForm('batchPrefix', e.target.value)}
                placeholder="BCH-"
                className="h-10 text-xs font-mono bg-background rounded-xl border-input"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ---------------------------------------------------- */}
      {/* SECTION 7 — TAX & ACCOUNTING */}
      {/* ---------------------------------------------------- */}
      <Card className="border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden">
        <CardHeader className="p-5 border-b border-border/40 pb-4">
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400">
              <FileCheck className="h-4 w-4" />
            </div>
            <span>Tax Rates & Accounting Setup</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Tax Category</Label>
              <Select
                value={formData.taxCategory}
                onValueChange={(val) => updateForm('taxCategory', val)}
              >
                <SelectTrigger className="h-10 text-xs bg-background rounded-xl border-input">
                  <SelectValue placeholder="Tax Category" />
                </SelectTrigger>
                <SelectContent className="bg-card border border-border rounded-xl text-xs">
                  <SelectItem value="Standard">Standard Rate</SelectItem>
                  <SelectItem value="Exempt">Tax Exempt (0%)</SelectItem>
                  <SelectItem value="Reduced">Reduced Rate (2.5%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">VAT Rate (%)</Label>
              <Input
                type="number"
                value={formData.vatRate}
                onChange={(e) => updateForm('vatRate', e.target.value)}
                placeholder="5"
                className="h-10 text-xs font-bold bg-background rounded-xl border-input"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Income Revenue Account</Label>
              <Input
                value={formData.incomeAccount}
                onChange={(e) => updateForm('incomeAccount', e.target.value)}
                placeholder="Sales Revenue"
                className="h-10 text-xs bg-background rounded-xl border-input"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ---------------------------------------------------- */}
      {/* SECTION 8 — DESCRIPTION & TAGS */}
      {/* ---------------------------------------------------- */}
      <Card className="border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden">
        <CardHeader className="p-5 border-b border-border/40 pb-4">
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-foreground">
              <FileText className="h-4 w-4" />
            </div>
            <span>Product Description & Metadata</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-5">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">Short Description</Label>
            <Input
              value={formData.shortDescription}
              onChange={(e) => updateForm('shortDescription', e.target.value)}
              placeholder="Brief 1-line product summary"
              className="h-10 text-xs bg-background rounded-xl border-input"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">Detailed Specifications</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => updateForm('description', e.target.value)}
              rows={4}
              placeholder="Full product details, ingredient sources, packaging notes..."
              className="text-xs bg-background rounded-xl border-input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Tags</Label>
              <Input
                value={formData.tags}
                onChange={(e) => updateForm('tags', e.target.value)}
                placeholder="e.g. rice, organic, premium"
                className="h-10 text-xs bg-background rounded-xl border-input"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Internal Notes</Label>
              <Input
                value={formData.internalNotes}
                onChange={(e) => updateForm('internalNotes', e.target.value)}
                placeholder="Staff notes (not visible to customers)"
                className="h-10 text-xs bg-background rounded-xl border-input"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ---------------------------------------------------- */}
      {/* STICKY BOTTOM ACTION BAR */}
      {/* ---------------------------------------------------- */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur border-t border-border/80 p-4 shadow-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground font-semibold">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Ready to register item into inventory master data</span>
          </div>

          <div className="flex items-center gap-3 ml-auto w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/inventory')}
              className="h-10 px-4 text-xs font-semibold rounded-xl border-input cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleSubmit(true)}
              className="h-10 px-4 text-xs font-semibold rounded-xl cursor-pointer"
            >
              Save Draft
            </Button>
            <Button
              size="sm"
              disabled={createItem.isPending}
              onClick={() => handleSubmit(false)}
              className="h-10 px-5 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer flex items-center gap-2 shadow-md"
            >
              {createItem.isPending ? (
                <Sparkles className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Product
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Add Category Dialog */}
      <Dialog open={showAddCategoryModal} onOpenChange={setShowAddCategoryModal}>
        <DialogContent className="w-[360px] rounded-2xl bg-card border border-border">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <Label className="text-xs font-semibold">Category Name</Label>
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="e.g. Beverages"
              className="h-10 text-xs rounded-xl"
            />
          </div>
          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddCategoryModal(false)}
              className="h-9 text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (newCategoryName.trim()) {
                  toast.success(`Category "${newCategoryName}" added!`);
                  setNewCategoryName('');
                  setShowAddCategoryModal(false);
                }
              }}
              className="h-9 text-xs rounded-xl bg-primary text-primary-foreground"
            >
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
