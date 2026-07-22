// Hello Khata OS - Create / Edit Offer Page with Live Preview Card
// হ্যালো খাতা - অফার তৈরি ও সম্পাদনা পেজ

'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { offerSchema, OfferFormValues } from '@/schemas/offer.schema';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverAnchor,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sparkles,
  ArrowLeft,
  Package,
  Layers,
  Gift,
  Percent,
  DollarSign,
  Calendar as CalendarIcon,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Store,
  Tag,
  Loader2,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useGetItems, useGetSingleItem } from '@/hooks/api/useItems';
import { useGetBatches } from '@/hooks/api/useBatches';
import { useCreateOffer, useUpdateOffer, useGetOfferById } from '@/hooks/api/useOffers';
import { OfferType } from '@/types/offer.types';

function OfferFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const offerIdParam = searchParams.get('id') || '';
  const productIdParam = searchParams.get('productId') || '';
  const batchIdParam = searchParams.get('batchId') || '';
  const initialTypeParam = (searchParams.get('type') as OfferType) || 'bogo';
  const initialBuyQty = parseInt(searchParams.get('buyQty') || '1') || 1;
  const initialFreeQty = parseInt(searchParams.get('freeQty') || '1') || 1;

  const { t, isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();

  // API Data
  const { data: itemsData } = useGetItems({ page: 1, limit: 100 });
  const items = itemsData?.data || [];
  const { data: batchesData } = useGetBatches({ status: 'active', limit: 1000 });
  const batches = batchesData?.data || batchesData || [];

  const { data: existingOfferData } = useGetOfferById(offerIdParam);
  const existingOffer = existingOfferData?.data;

  const { mutate: createOffer, isPending: isCreating } = useCreateOffer();
  const { mutate: updateOffer, isPending: isUpdating } = useUpdateOffer();
  const isSubmitting = isCreating || isUpdating;

  // Search states for Product Target Selector
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [showProductSuggestions, setShowProductSuggestions] = useState(false);
  const [isPrefilledTarget, setIsPrefilledTarget] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
    mode: 'onChange',
    defaultValues: {
      productId: '',
      productName: '',
      scope: 'product',
      type: initialTypeParam,
      buyQuantity: initialBuyQty,
      freeQuantity: initialFreeQty,
      percentage: 20,
      flatAmount: 50,
      flatScope: 'per_unit',
      bundleQuantity: 2,
      bundlePrice: 500,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      untilSoldOut: false,
      branchId: 'all',
    },
  });

  const watchedType = watch('type');
  const watchedScope = watch('scope');
  const watchedProductId = watch('productId');
  const watchedBatchId = watch('batchId');
  const watchedBuyQty = watch('buyQuantity') || 1;
  const watchedFreeQty = watch('freeQuantity') || 1;
  const watchedPercentage = watch('percentage') || 10;
  const watchedFlatAmount = watch('flatAmount') || 0;
  const watchedFlatScope = watch('flatScope') || 'per_unit';
  const watchedBundleQty = watch('bundleQuantity') || 2;
  const watchedBundlePrice = watch('bundlePrice') || 0;
  const watchedStartDate = watch('startDate');
  const watchedEndDate = watch('endDate');
  const watchedUntilSoldOut = watch('untilSoldOut');

  // Selected item details for calculations
  const selectedProduct = useMemo(() => {
    return items.find((it: any) => it.id === watchedProductId) || null;
  }, [items, watchedProductId]);

  const itemBatches = useMemo(() => {
    if (!watchedProductId) return [];
    return batches.filter((b: any) => b.itemId === watchedProductId);
  }, [batches, watchedProductId]);

  const selectedBatch = useMemo(() => {
    if (!watchedBatchId) return null;
    return batches.find((b: any) => b.id === watchedBatchId) || null;
  }, [batches, watchedBatchId]);

  // Handle URL navigation prefilling (from Product Details or Expiry Tracker)
  useEffect(() => {
    if (productIdParam && items.length > 0) {
      const prod = items.find((i: any) => i.id === productIdParam);
      if (prod) {
        setValue('productId', prod.id, { shouldValidate: true });
        setValue('productName', prod.name, { shouldValidate: true });
        setIsPrefilledTarget(true);

        if (batchIdParam) {
          const batch = batches.find((b: any) => b.id === batchIdParam);
          if (batch) {
            setValue('batchId', batch.id);
            setValue('batchNumber', batch.batchNumber);
            setValue('scope', 'batch');
          }
        }
      }
    }
  }, [productIdParam, batchIdParam, items, batches, setValue]);

  // Handle Edit prefilling if offerIdParam is present
  useEffect(() => {
    if (existingOffer) {
      setValue('id', existingOffer.id);
      setValue('productId', existingOffer.productId);
      setValue('productName', existingOffer.productName);
      setValue('scope', existingOffer.scope);
      setValue('type', existingOffer.type);
      setValue('startDate', existingOffer.startDate);
      setValue('endDate', existingOffer.endDate || '');
      setValue('untilSoldOut', existingOffer.untilSoldOut || false);
      setValue('branchId', existingOffer.branchId || 'all');

      if (existingOffer.batchId) {
        setValue('batchId', existingOffer.batchId);
        setValue('batchNumber', existingOffer.batchNumber);
      }

      if (existingOffer.bogoConfig) {
        setValue('buyQuantity', existingOffer.bogoConfig.buyQuantity);
        setValue('freeQuantity', existingOffer.bogoConfig.freeQuantity);
      }
      if (existingOffer.percentageConfig) {
        setValue('percentage', existingOffer.percentageConfig.percentage);
      }
      if (existingOffer.flatConfig) {
        setValue('flatAmount', existingOffer.flatConfig.amount);
        setValue('flatScope', existingOffer.flatConfig.scope);
      }
      if (existingOffer.bundleConfig) {
        setValue('bundleQuantity', existingOffer.bundleConfig.bundleQuantity);
        setValue('bundlePrice', existingOffer.bundleConfig.bundlePrice);
      }

      setIsPrefilledTarget(true);
    }
  }, [existingOffer, setValue]);

  // Filtered product suggestions
  const filteredProducts = useMemo(() => {
    if (!productSearchQuery) return items.slice(0, 10);
    return items.filter(
      (it: any) =>
        it.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
        it.sku?.toLowerCase().includes(productSearchQuery.toLowerCase())
    );
  }, [items, productSearchQuery]);

  // Handle Product Select
  const handleSelectProduct = (product: any) => {
    setValue('productId', product.id, { shouldValidate: true });
    setValue('productName', product.name, { shouldValidate: true });
    setValue('batchId', undefined);
    setValue('batchNumber', undefined);
    setValue('scope', 'product');
    setProductSearchQuery('');
    setShowProductSuggestions(false);
  };

  // Real-time Preview Card Calculations
  const regularPrice = selectedProduct?.sellingPrice || 100;

  const previewStats = useMemo(() => {
    switch (watchedType) {
      case 'bogo': {
        const totalItemsReceived = watchedBuyQty + watchedFreeQty;
        const customerPays = watchedBuyQty * regularPrice;
        const totalRegularValue = totalItemsReceived * regularPrice;
        const totalSavings = watchedFreeQty * regularPrice;
        const effectiveDiscountPercent = totalRegularValue > 0 ? (totalSavings / totalRegularValue) * 100 : 0;
        return {
          title: `Buy ${watchedBuyQty} Get ${watchedFreeQty} Free`,
          customerPays,
          totalRegularValue,
          totalSavings,
          effectiveDiscountPercent: Math.round(effectiveDiscountPercent),
          itemsCountText: `Customer pays for ${watchedBuyQty}, receives ${totalItemsReceived}`,
        };
      }
      case 'percentage': {
        const discountAmount = (regularPrice * (watchedPercentage / 100));
        const finalPrice = Math.max(0, regularPrice - discountAmount);
        return {
          title: `${watchedPercentage}% Off Single Item`,
          customerPays: finalPrice,
          totalRegularValue: regularPrice,
          totalSavings: discountAmount,
          effectiveDiscountPercent: watchedPercentage,
          itemsCountText: `Save ${watchedPercentage}% off regular unit price`,
        };
      }
      case 'flat': {
        const discountAmount = watchedFlatAmount;
        const finalPrice = Math.max(0, regularPrice - discountAmount);
        const discountPercent = regularPrice > 0 ? (discountAmount / regularPrice) * 100 : 0;
        return {
          title: `৳${watchedFlatAmount} Off (${watchedFlatScope === 'per_unit' ? 'Per Unit' : 'Per Order'})`,
          customerPays: finalPrice,
          totalRegularValue: regularPrice,
          totalSavings: discountAmount,
          effectiveDiscountPercent: Math.round(discountPercent),
          itemsCountText: `Flat ৳${watchedFlatAmount} discount applied`,
        };
      }
      case 'bundle': {
        const regularBundleCost = watchedBundleQty * regularPrice;
        const totalSavings = Math.max(0, regularBundleCost - watchedBundlePrice);
        const discountPercent = regularBundleCost > 0 ? (totalSavings / regularBundleCost) * 100 : 0;
        return {
          title: `Bundle of ${watchedBundleQty} Items @ ৳${watchedBundlePrice}`,
          customerPays: watchedBundlePrice,
          totalRegularValue: regularBundleCost,
          totalSavings,
          effectiveDiscountPercent: Math.round(discountPercent),
          itemsCountText: `Bundle pack containing ${watchedBundleQty} units`,
          isWarning: watchedBundlePrice > regularBundleCost,
        };
      }
    }
  }, [
    watchedType,
    watchedBuyQty,
    watchedFreeQty,
    watchedPercentage,
    watchedFlatAmount,
    watchedFlatScope,
    watchedBundleQty,
    watchedBundlePrice,
    regularPrice,
  ]);

  // Form Submit Handler
  const onSubmit = (data: OfferFormValues) => {
    const payload = {
      title: `${data.productName} - ${data.type.toUpperCase()} Offer`,
      type: data.type,
      status: 'active' as const,
      scope: data.scope,
      productId: data.productId,
      productName: data.productName,
      productSku: selectedProduct?.sku || 'SKU-001',
      productImage: selectedProduct?.imageUrl || '',
      regularPrice,
      batchId: data.batchId,
      batchNumber: data.batchNumber,
      batchExpiry: selectedBatch?.expiryDate,
      startDate: data.startDate,
      endDate: data.untilSoldOut ? undefined : data.endDate,
      untilSoldOut: data.untilSoldOut,
      branchId: data.branchId,
      branchName: data.branchId === 'all' ? 'All Branches' : 'Main Branch',
      bogoConfig: data.type === 'bogo' ? { buyQuantity: data.buyQuantity!, freeQuantity: data.freeQuantity! } : undefined,
      percentageConfig: data.type === 'percentage' ? { percentage: data.percentage! } : undefined,
      flatConfig: data.type === 'flat' ? { amount: data.flatAmount!, scope: data.flatScope! } : undefined,
      bundleConfig: data.type === 'bundle' ? { bundleQuantity: data.bundleQuantity!, bundlePrice: data.bundlePrice! } : undefined,
    };

    if (offerIdParam) {
      updateOffer(
        { id: offerIdParam, payload },
        {
          onSuccess: () => {
            toast.success(isBangla ? 'অফারটি সফলভাবে আপডেট করা হয়েছে' : 'Offer updated successfully');
            router.push('/inventory/promotions');
          },
        }
      );
    } else {
      createOffer(payload, {
        onSuccess: () => {
          toast.success(isBangla ? 'নতুন অফার সফলভাবে তৈরি করা হয়েছে' : 'Offer created successfully');
          router.push('/inventory/promotions');
        },
      });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border/40">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <Sparkles className="h-6 w-6 text-primary" />
          {offerIdParam
            ? isBangla ? 'অফার সম্পাদনা করুন' : 'Edit Promotion Offer'
            : isBangla ? 'নতুন অফার তৈরি করুন' : 'Create Promotion Offer'}
        </h1>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {isBangla ? 'পেছনে' : 'Back'}
        </Button>
      </div>

      {/* Main 2 Column Grid: Form (65%) & Live Preview (35%) */}
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column Form Controls (7 Cols = ~60%) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* SECTION 1: Target Selector */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                {isBangla ? '১. টার্গেট প্রোডাক্ট ও ব্যাচ' : '1. Target Product & Batch'}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {isPrefilledTarget && selectedProduct ? (
                /* Readonly Target Card */
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {selectedProduct.imageUrl ? (
                      <img
                        src={selectedProduct.imageUrl}
                        alt={selectedProduct.name}
                        className="h-12 w-12 rounded-lg object-cover border border-primary/20 shrink-0"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Package className="h-6 w-6" />
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-foreground text-sm">{selectedProduct.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span>Reg Price: {formatCurrency(regularPrice)}</span>
                        {watchedBatchId && (
                          <span className="font-mono text-amber-500 font-semibold">
                            • Batch: {selectedBatch?.batchNumber || 'Selected'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPrefilledTarget(false)}
                    className="text-xs shrink-0"
                  >
                    {isBangla ? 'টার্গেট পরিবর্তন' : 'Change Target'}
                  </Button>
                </div>
              ) : (
                /* Manual Product Search Popover */
                <div className="space-y-3">
                  <Label className="text-xs font-semibold text-foreground">
                    {isBangla ? 'প্রোডাক্ট খুঁজুন ও নির্বাচন করুন' : 'Search & Select Product'}
                  </Label>
                  <div className="relative">
                    <Input
                      value={selectedProduct ? selectedProduct.name : productSearchQuery}
                      onChange={(e) => {
                        setProductSearchQuery(e.target.value);
                        setValue('productId', '');
                        setShowProductSuggestions(true);
                      }}
                      onFocus={() => setShowProductSuggestions(true)}
                      placeholder={isBangla ? 'প্রোডাক্ট এর নাম লিখুন...' : 'Search product by name or SKU...'}
                      className="pr-10 h-11 bg-background/50 border-input"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                    {showProductSuggestions && (
                      <div className="absolute z-50 left-0 top-full mt-1 w-full bg-card border border-border rounded-xl shadow-xl max-h-60 overflow-y-auto divide-y divide-border">
                        {filteredProducts.length === 0 ? (
                          <div className="p-3 text-center text-sm text-muted-foreground">
                            {isBangla ? 'কোনো প্রোডাক্ট পাওয়া যায়নি' : 'No products found'}
                          </div>
                        ) : (
                          filteredProducts.map((prod: any) => (
                            <button
                              key={prod.id}
                              type="button"
                              className="w-full text-left p-3 hover:bg-muted/80 text-sm transition-colors flex items-center justify-between"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleSelectProduct(prod);
                              }}
                            >
                              <div>
                                <p className="font-semibold text-foreground">{prod.name}</p>
                                <p className="text-xs text-muted-foreground">SKU: {prod.sku || 'N/A'}</p>
                              </div>
                              <span className="font-bold text-xs text-primary">
                                {formatCurrency(prod.sellingPrice || 0)}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                  {errors.productId && (
                    <p className="text-xs text-rose-500">{errors.productId.message}</p>
                  )}

                  {/* Batch Scope Selector (if product has batches) */}
                  {selectedProduct && itemBatches.length > 0 && (
                    <div className="pt-2 space-y-2">
                      <Label className="text-xs font-semibold text-foreground">
                        {isBangla ? 'ব্যাচ নির্বাচন (ঐচ্ছিক)' : 'Select Specific Batch (Optional)'}
                      </Label>
                      <Select
                        value={watchedBatchId || 'all'}
                        onValueChange={(val) => {
                          if (val === 'all') {
                            setValue('batchId', undefined);
                            setValue('batchNumber', undefined);
                            setValue('scope', 'product');
                          } else {
                            const b = itemBatches.find((batch: any) => batch.id === val);
                            setValue('batchId', val);
                            setValue('batchNumber', b?.batchNumber);
                            setValue('scope', 'batch');
                          }
                        }}
                      >
                        <SelectTrigger className="h-10 bg-background/50 border-input text-xs font-medium">
                          <SelectValue placeholder="All Batches (Whole Product)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Whole Product (All Batches)</SelectItem>
                          {itemBatches.map((b: any) => (
                            <SelectItem key={b.id} value={b.id}>
                              Batch: {b.batchNumber} (Stock: {b.quantity})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* SECTION 2: Offer Type Segmented Control */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-base flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />
                {isBangla ? '২. অফারের ধরন' : '2. Offer Type'}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'bogo', label: 'BOGO (Buy X Get Y)', icon: Gift },
                  { id: 'percentage', label: 'Percentage Off', icon: Percent },
                  { id: 'flat', label: 'Flat Discount', icon: DollarSign },
                  { id: 'bundle', label: 'Bundle Price', icon: Package },
                ].map((typeItem) => {
                  const Icon = typeItem.icon;
                  const isSelected = watchedType === typeItem.id;
                  return (
                    <button
                      key={typeItem.id}
                      type="button"
                      onClick={() => setValue('type', typeItem.id as OfferType, { shouldValidate: true })}
                      className={cn(
                        'flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all gap-1.5 cursor-pointer',
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary shadow-sm ring-1 ring-primary/30'
                          : 'border-border/60 hover:bg-muted/50 text-muted-foreground'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-center leading-tight">{typeItem.label}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* SECTION 3: Dynamic Offer Configuration */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                {isBangla ? '৩. অফার কনফিগারেশন' : '3. Offer Configuration'}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {/* BOGO Controls */}
              {watchedType === 'bogo' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Buy Quantity (কেনার সংখ্যা)</Label>
                    <Input
                      type="number"
                      min="1"
                      {...register('buyQuantity', { valueAsNumber: true })}
                      className="h-10 bg-background/50 border-input"
                    />
                    {errors.buyQuantity && (
                      <p className="text-xs text-rose-500">{errors.buyQuantity.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Free Quantity (ফ্রি সংখ্যা)</Label>
                    <Input
                      type="number"
                      min="1"
                      {...register('freeQuantity', { valueAsNumber: true })}
                      className="h-10 bg-background/50 border-input"
                    />
                    {errors.freeQuantity && (
                      <p className="text-xs text-rose-500">{errors.freeQuantity.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Percentage Controls */}
              {watchedType === 'percentage' && (
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Percentage Off (% ছাড়)</Label>
                  <div className="relative flex items-center">
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      {...register('percentage', { valueAsNumber: true })}
                      className="h-10 bg-background/50 border-input pr-8"
                    />
                    <span className="absolute right-3 text-xs text-muted-foreground font-bold">%</span>
                  </div>
                  {errors.percentage && (
                    <p className="text-xs text-rose-500">{errors.percentage.message}</p>
                  )}
                </div>
              )}

              {/* Flat Discount Controls */}
              {watchedType === 'flat' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Discount Amount (ছাড়ের পরিমাণ)</Label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-xs text-muted-foreground font-bold">৳</span>
                      <Input
                        type="number"
                        min="1"
                        {...register('flatAmount', { valueAsNumber: true })}
                        className="h-10 bg-background/50 border-input pl-8"
                      />
                    </div>
                    {errors.flatAmount && (
                      <p className="text-xs text-rose-500">{errors.flatAmount.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Discount Scope (প্রযোজ্য ক্ষেত্র)</Label>
                    <Select
                      value={watchedFlatScope}
                      onValueChange={(val: any) => setValue('flatScope', val)}
                    >
                      <SelectTrigger className="h-10 bg-background/50 border-input text-xs font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="per_unit">Per Unit Item</SelectItem>
                        <SelectItem value="per_transaction">Per Transaction Order</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Bundle Controls */}
              {watchedType === 'bundle' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Bundle Quantity (বান্ডেল আইটেম সংখ্যা)</Label>
                    <Input
                      type="number"
                      min="2"
                      {...register('bundleQuantity', { valueAsNumber: true })}
                      className="h-10 bg-background/50 border-input"
                    />
                    {errors.bundleQuantity && (
                      <p className="text-xs text-rose-500">{errors.bundleQuantity.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Bundle Price (বান্ডেল প্যাকেজ মূল্য)</Label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-xs text-muted-foreground font-bold">৳</span>
                      <Input
                        type="number"
                        min="1"
                        {...register('bundlePrice', { valueAsNumber: true })}
                        className="h-10 bg-background/50 border-input pl-8"
                      />
                    </div>
                    {errors.bundlePrice && (
                      <p className="text-xs text-rose-500">{errors.bundlePrice.message}</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* SECTION 4: Validity & SECTION 5: Branch */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-primary" />
                {isBangla ? '৪. সময়সীমা ও ব্রাঞ্চ' : '4. Validity & Branch'}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Start Date */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Start Date (শুরুর তারিখ)</Label>
                  <Input
                    type="date"
                    {...register('startDate')}
                    className="h-10 bg-background/50 border-input text-xs"
                  />
                  {errors.startDate && (
                    <p className="text-xs text-rose-500">{errors.startDate.message}</p>
                  )}
                </div>

                {/* End Date */}
                {!watchedUntilSoldOut && (
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">End Date (শেষের তারিখ)</Label>
                    <Input
                      type="date"
                      {...register('endDate')}
                      className="h-10 bg-background/50 border-input text-xs"
                    />
                    {errors.endDate && (
                      <p className="text-xs text-rose-500">{errors.endDate.message}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Checkbox: Run Until Batch Sells Out */}
              {watchedScope === 'batch' && (
                <div className="flex items-center gap-2 pt-1">
                  <Checkbox
                    id="untilSoldOut"
                    checked={watchedUntilSoldOut}
                    onCheckedChange={(checked) => setValue('untilSoldOut', !!checked)}
                  />
                  <Label htmlFor="untilSoldOut" className="text-xs font-medium cursor-pointer">
                    Run Until Batch Sells Out (ব্যাচের মজুদ থাকা পর্যন্ত চলবে)
                  </Label>
                </div>
              )}

              {/* Branch Selector */}
              <div className="pt-2 space-y-2 border-t border-border/40">
                <Label className="text-xs font-semibold">Applicable Branch (ব্রাঞ্চ)</Label>
                <Select
                  value={watch('branchId')}
                  onValueChange={(val) => setValue('branchId', val)}
                >
                  <SelectTrigger className="h-10 bg-background/50 border-input text-xs font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Branches (সকল ব্রাঞ্চ)</SelectItem>
                    <SelectItem value="main">Main Branch (মূল ব্রাঞ্চ)</SelectItem>
                    <SelectItem value="outlet-1">Dhanmondi Outlet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Live Preview Card (5 Cols = ~40%) */}
        <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-4">
          <div className="rounded-2xl border border-primary/30 bg-card p-6 shadow-xl space-y-5 relative overflow-hidden">
            
            {/* Top Accent Gradient */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-indigo-500 to-emerald-400" />

            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" />
                Live Offer Preview
              </span>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Auto Updating
              </span>
            </div>

            {/* Target Product Overview */}
            <div className="flex items-center gap-3 bg-muted/40 p-3 rounded-xl border border-border/50">
              {selectedProduct?.imageUrl ? (
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="h-10 w-10 rounded-lg object-cover border border-border shrink-0"
                />
              ) : (
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0 border border-border">
                  <Package className="h-5 w-5" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground text-xs truncate">
                  {selectedProduct?.name || 'Select a product target'}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Regular Price: <span className="font-bold text-foreground">{formatCurrency(regularPrice)}</span>
                </p>
              </div>
            </div>

            {/* Preview Card Main Highlights */}
            <div className="space-y-4 bg-background/60 p-4 rounded-xl border border-border/60">
              <div className="text-center space-y-1">
                <span className="text-[11px] uppercase tracking-wide font-semibold text-muted-foreground">
                  Offer Highlight
                </span>
                <h3 className="text-xl font-extrabold text-foreground tracking-tight">
                  {previewStats?.title}
                </h3>
                <p className="text-xs text-primary font-medium">{previewStats?.itemsCountText}</p>
              </div>

              {/* Big Stat Cards Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-muted/30 p-3 rounded-lg border border-border/40 text-center">
                  <p className="text-[10px] text-muted-foreground font-medium uppercase">Customer Pays</p>
                  <p className="text-lg font-bold text-slate-100 mt-0.5">
                    {formatCurrency(previewStats?.customerPays || 0)}
                  </p>
                </div>
                <div className="bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20 text-center">
                  <p className="text-[10px] text-emerald-400 font-medium uppercase">Total Savings</p>
                  <p className="text-lg font-bold text-emerald-400 mt-0.5">
                    {formatCurrency(previewStats?.totalSavings || 0)}
                  </p>
                </div>
              </div>

              {/* Effective Discount Percentage Badge */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-xs font-semibold">
                <span className="text-muted-foreground">Effective Discount Rate:</span>
                <span className="text-primary font-bold text-sm">
                  {previewStats?.effectiveDiscountPercent}% OFF
                </span>
              </div>
            </div>

            {/* Bundle Warning Alert if applicable */}
            {previewStats?.isWarning && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-400">
                <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Notice:</strong> Bundle package price exceeds the regular price of individual items.
                </span>
              </div>
            )}

            {/* Offer Period & Scope Footer Summary */}
            <div className="space-y-1.5 text-xs text-muted-foreground border-t border-border/50 pt-3">
              <div className="flex justify-between">
                <span>Scope:</span>
                <span className="font-semibold text-foreground capitalize">{watchedScope} Level</span>
              </div>
              <div className="flex justify-between">
                <span>Validity:</span>
                <span className="font-semibold text-foreground">
                  {watchedUntilSoldOut ? 'Until Batch Stock Sold Out' : `${watchedStartDate} to ${watchedEndDate || 'N/A'}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Branch:</span>
                <span className="font-semibold text-foreground">All Outlets</span>
              </div>
            </div>

            {/* Submit Action Button */}
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm rounded-xl shadow-lg shadow-primary/20 transition-all gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isBangla ? 'সংরক্ষণ করা হচ্ছে...' : 'Saving Offer...'}
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  {offerIdParam
                    ? isBangla ? 'অফার আপডেট করুন' : 'Update Offer'
                    : isBangla ? 'অফার নিশ্চিত করুন' : 'Save Offer'}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function CreateEditOfferPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <OfferFormContent />
    </Suspense>
  );
}
