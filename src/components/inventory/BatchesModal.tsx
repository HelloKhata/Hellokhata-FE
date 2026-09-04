'use client';

import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Package,
  Layers,
  XCircle,
  MoreVertical,
  Eye,
  Edit,
  ArrowRightLeft,
  Printer,
  Plus,
  ArrowUpDown,
  Clock,
  Building2,
  CheckCircle,
} from 'lucide-react';
import { useGetBatchById } from '@/hooks/api/useBatches';
import { useCurrency } from '@/hooks/useAppTranslation';
import type { Item } from '@/types';
import { format, differenceInDays } from 'date-fns';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useGetItemBatches } from '@/hooks/api/useItems';

interface BatchesModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId?: string | null;
  batchId?: string | null;
  item?: Item | null;
  isBangla?: boolean;
  categories?: any[];
}

export function BatchesModal({
  isOpen,
  onClose,
  itemId,
  batchId,
  item,
  isBangla = false,
  categories = [],
}: BatchesModalProps) {
  const router = useRouter();
  const { formatCurrency } = useCurrency();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'expiry' | 'quantity' | 'batchNumber'>('date');
  const [selectedBatch, setSelectedBatch] = useState<any | null>(null);

  // Fetch batch info using useGetBatchById
  const targetId = batchId || itemId || item?.id || "";
  const { data: batchRes, isLoading } = useGetItemBatches(targetId);

  // Extract raw batches from API response
  const rawBatches = useMemo(() => {
    if (!batchRes) return [];
    const payload = (batchRes as any)?.data !== undefined ? (batchRes as any).data : batchRes;
    if (Array.isArray(payload)) {
      return payload;
    }
    if (payload && typeof payload === 'object') {
      if (Array.isArray(payload.batches)) {
        return payload.batches;
      }
      if (payload.id || payload.batchNumber || payload.batchId) {
        return [payload];
      }
    }
    return [];
  }, [batchRes]);

  // Metadata Resolution
  const categoryName = item?.categoryId
    ? categories?.find((c) => c.id === item.categoryId)?.name || (item as any)?.category?.name
    : (item as any)?.category?.name;
  const brandName = (item as any)?.brand;
  const unit = item?.unit || 'pcs';

  const batches = useMemo(() => {
    return rawBatches.map((b: any) => {
      const initialQty = b.initialQty ?? b.initialQuantity ?? b.quantity ?? item?.currentStock ?? 0;
      const remainingQty = b.remainingQty ?? b.quantity ?? item?.currentStock ?? 0;
      const reservedQty = b.reservedQuantity ?? b.reservedQty ?? 0;
      const availableQty = Math.max(remainingQty - reservedQty, 0);
      const branchName = b.branch?.name || b.branchName || b.branchId || (isBangla ? 'প্রধান শাখা' : 'Main Branch');

      return {
        ...b,
        id: b.id || b.batchId,
        batchNumber: b.batchNumber || b.batchId || '—',
        branchId: b.branchId || '—',
        branchName,
        initialQty,
        remainingQty,
        totalQty: initialQty,
        currentQty: remainingQty,
        reservedQty,
        availableQty,
        costPrice: b.costPrice ?? item?.costPrice ?? 0,
        mrp: b.mrp ?? item?.sellingPrice ?? 0,
        manufactureDate: b.manufactureDate,
        expiryDate: b.expiryDate,
        createdAt: b.createdAt,
        isActive: b.isActive !== undefined ? b.isActive : true,
      };
    });
  }, [rawBatches, item, isBangla]);

  // Filtered and Sorted Batches
  const processedBatches = useMemo(() => {
    let result = [...batches];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.batchNumber?.toLowerCase().includes(q) ||
          b.branchName?.toLowerCase().includes(q) ||
          b.branchId?.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'quantity') return (b.remainingQty || 0) - (a.remainingQty || 0);
      if (sortBy === 'batchNumber') return (a.batchNumber || '').localeCompare(b.batchNumber || '');
      if (sortBy === 'expiry') {
        if (!a.expiryDate) return 1;
        if (!b.expiryDate) return -1;
        return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
      }
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

    return result;
  }, [batches, searchQuery, sortBy]);

  // Summary Metrics
  const summary = useMemo(() => {
    const now = new Date();
    let totalCurrentStock = 0;
    let totalPurchaseVal = 0;
    let expiringCount = 0;
    let expiredCount = 0;
    let lowStockCount = 0;

    processedBatches.forEach((b) => {
      const qty = b.remainingQty || 0;
      const cost = b.costPrice || item?.costPrice || 0;
      totalCurrentStock += qty;
      totalPurchaseVal += qty * cost;

      if (b.expiryDate) {
        const days = differenceInDays(new Date(b.expiryDate), now);
        if (days < 0 || b.isExpired) {
          expiredCount++;
        } else if (days <= 30 || b.isExpiringSoon) {
          expiringCount++;
        }
      }

      if (qty <= (item?.minStock || 10)) {
        lowStockCount++;
      }
    });

    return {
      totalCurrentStock,
      totalBatches: processedBatches.length,
      totalPurchaseVal,
      expiringCount,
      expiredCount,
      lowStockCount,
      branchesCount: new Set(processedBatches.map((b) => b.branchId || b.branchName)).size || 1,
    };
  }, [processedBatches, item]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-[95vw] p-0 overflow-hidden bg-background border-border border max-h-[90vh] flex flex-col shadow-2xl">
        <TooltipProvider>
          {/* Fixed Modal Header */}
          <div className="p-4 sm:p-5 border-b border-border/80 bg-card flex items-start justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center shrink-0 overflow-hidden border border-border/80 shadow-sm">
                {item?.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Package className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center justify-start gap-4">
                  <DialogTitle className="text-lg font-bold text-foreground">
                    {item?.name || (isBangla ? 'ব্যাচ বিবরণী' : 'Batch Details')}
                  </DialogTitle>

                  {item?.sku && (
                    <Badge variant="outline" className="text-xs font-mono">
                      # SKU: {item.sku}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                  {categoryName && <span>{categoryName}</span>}
                  {brandName && (
                    <>
                      {categoryName && <span>•</span>}
                      <span>{brandName}</span>
                    </>
                  )}
                  {item && (
                    <>
                      <span>•</span>
                      <span className="font-medium text-foreground">
                        {isBangla ? 'স্টক:' : 'Current Stock:'} {item.currentStock ?? 0} {unit}
                      </span>
                    </>
                  )}
                  <span>•</span>
                  <span>
                    {summary.totalBatches} {isBangla ? 'টি ব্যাচ' : 'Batches'}
                  </span>
                  <span>•</span>
                  <span>
                    {summary.branchesCount} {isBangla ? 'টি শাখা' : 'Branches'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Body with Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {/* Controls Bar: Search & Sort */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={isBangla ? 'ব্যাচ নম্বর খুঁজুন...' : 'Search by batch number...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-xs"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  {isBangla ? 'সর্ট:' : 'Sort by:'}
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="h-9 px-3 py-1 bg-background text-foreground border border-input rounded-md text-xs font-medium focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="date">{isBangla ? 'ক্রয়ের তারিখ' : 'Purchase Date'}</option>
                  <option value="expiry">{isBangla ? 'মেয়াদের তারিখ' : 'Expiry Date'}</option>
                  <option value="quantity">{isBangla ? 'বর্তমান পরিমাণ' : 'Current Quantity'}</option>
                  <option value="batchNumber">{isBangla ? 'ব্যাচ নম্বর' : 'Batch Number'}</option>
                </select>

                <Button
                  size="sm"
                  onClick={() => {
                    onClose();
                    router.push(`/inventory/batches?itemId=${targetId}`);
                  }}
                  className="h-9 text-xs whitespace-nowrap shrink-0"
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  {isBangla ? 'নতুন ব্যাচ' : 'New Batch'}
                </Button>
              </div>
            </div>

            {/* Table Content Area */}
            {isLoading ? (
              <div className="space-y-2 py-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            ) : processedBatches.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/20 border border-dashed border-border rounded-xl space-y-3">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  <Package className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">
                    {isBangla ? 'কোনো ব্যাচ পাওয়া যায়নি' : 'No inventory batches found'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isBangla
                      ? 'এই পণ্যটির জন্য এখনো কোনো ব্যাচ যোগ করা হয়নি।'
                      : 'This product has not been stocked yet.'}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    onClose();
                    router.push(`/inventory/batches?itemId=${targetId}`);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  {isBangla ? 'প্রথম ব্যাচ তৈরি করুন' : 'Create First Batch'}
                </Button>
              </div>
            ) : (
              <div className="border border-border/80 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-muted/60 text-muted-foreground font-semibold border-b border-border/80 sticky top-0 backdrop-blur z-10">
                      <tr>
                        <th className="py-2.5 px-3 font-semibold">{isBangla ? 'ব্যাচ নম্বর' : 'Batch No.'}</th>
                        <th className="py-2.5 px-3 font-semibold">{isBangla ? 'শাখা' : 'Branch'}</th>
                        <th className="py-2.5 px-3 font-semibold">{isBangla ? 'প্রাথমিক পরিমাণ' : 'Initial Qty'}</th>
                        <th className="py-2.5 px-3 font-semibold">{isBangla ? 'অবশিষ্ট পরিমাণ' : 'Remaining Qty'}</th>
                        <th className="py-2.5 px-3 font-semibold">{isBangla ? 'ক্রয়মূল্য' : 'Cost Price'}</th>
                        <th className="py-2.5 px-3 font-semibold">{isBangla ? 'এমআরপি' : 'MRP'}</th>
                        <th className="py-2.5 px-3 font-semibold">{isBangla ? 'উৎপাদন তারিখ' : 'Mfg. Date'}</th>
                        <th className="py-2.5 px-3 font-semibold">{isBangla ? 'মেয়াদ তারিখ' : 'Expiry Date'}</th>
                        <th className="py-2.5 px-3 font-semibold">{isBangla ? 'স্ট্যাটাস' : 'Status'}</th>
                        <th className="py-2.5 px-3 font-semibold text-right">{isBangla ? 'অ্যাকশন' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60 bg-card">
                      {processedBatches.map((batch) => {
                        const now = new Date();
                        let daysLeft: number | null = null;
                        if (batch.expiryDate) {
                          daysLeft = differenceInDays(new Date(batch.expiryDate), now);
                        }

                        const isExpired = daysLeft !== null && daysLeft <= 0;
                        const isExpiringSoon = daysLeft !== null && daysLeft > 0 && daysLeft <= 30;
                        const isLowStock = (batch.remainingQty || 0) <= (item?.minStock || 10);
                        const isOut = (batch.remainingQty || 0) === 0;

                        // Batch Status Calculation
                        const getBatchBadge = () => {
                          if (batch.isActive === false) {
                            return (
                              <Badge variant="outline" size="sm" className="whitespace-nowrap text-slate-400 border-slate-600">
                                {isBangla ? 'নিষ্ক্রিয়' : 'Inactive'}
                              </Badge>
                            );
                          }
                          if (batch.status ==='expired') {
                            return (
                              <Badge variant="destructive" size="sm" className="whitespace-nowrap">
                                {isBangla ? 'মেয়াদউত্তীর্ণ' : 'Expired'}
                              </Badge>
                            );
                          }
                          if (isExpiringSoon) {
                            return (
                              <Badge variant="warning" size="sm" className="whitespace-nowrap">
                                {isBangla ? 'শীঘ্রই মেয়াদ শেষ' : 'Expiring Soon'}
                              </Badge>
                            );
                          }
                          if (isOut) {
                            return (
                              <Badge variant="destructive" size="sm" className="whitespace-nowrap">
                                {isBangla ? 'স্টক শেষ' : 'Out of Stock'}
                              </Badge>
                            );
                          }
                          if (isLowStock) {
                            return (
                              <Badge variant="warning" size="sm" className="whitespace-nowrap">
                                {isBangla ? 'স্টক কম' : 'Low Stock'}
                              </Badge>
                            );
                          }
                         
                        };

                        return (
                          <tr
                            key={batch.id || batch.batchNumber}
                            className="hover:bg-muted/40 transition-colors group"
                          >
                            {/* 1. Batch No */}
                            <td className="py-3 px-3 font-mono font-medium text-foreground whitespace-nowrap">
                              <span className="px-1.5 py-0.5 rounded bg-muted text-foreground border border-border/60">
                                {batch.batchNumber || '—'}
                              </span>
                            </td>

                            {/* 2. Branch */}
                            <td className="py-3 px-3 text-muted-foreground whitespace-nowrap font-mono text-[11px]" title={batch.branchId}>
                              {batch.branchName !== '—' ? batch.branchName : batch.branchId}
                            </td>

                            {/* 3. Initial Qty */}
                            <td className="py-3 px-3 text-muted-foreground whitespace-nowrap">
                              {batch.initialQty} {unit}
                            </td>

                            {/* 4. Remaining Qty */}
                            <td className="py-3 px-3 font-bold text-foreground whitespace-nowrap">
                              {batch.remainingQty} {unit}
                            </td>

                            {/* 5. Cost Price */}
                            <td className="py-3 px-3 font-medium text-foreground whitespace-nowrap">
                              {formatCurrency(batch.costPrice)}
                            </td>

                            {/* 6. MRP */}
                            <td className="py-3 px-3 font-medium text-foreground whitespace-nowrap">
                              {formatCurrency(batch.mrp)}
                            </td>

                            {/* 7. Manufacture Date */}
                            <td className="py-3 px-3 text-muted-foreground whitespace-nowrap">
                              {batch.manufactureDate
                                ? format(new Date(batch.manufactureDate), 'dd MMM yyyy')
                                : '—'}
                            </td>

                            {/* 8. Expiry Date & Warning Badge */}
                            <td className="py-3 px-3 whitespace-nowrap">
                              {batch.expiryDate ? (
                                isExpired ? (
                                  <span className="text-red-500 font-semibold flex items-center gap-1">
                                    <XCircle className="h-3.5 w-3.5" />
                                    {isBangla ? 'মেয়াদউত্তীর্ণ' : 'Expired'}
                                  </span>
                                ) : isExpiringSoon ? (
                                  <span className="text-amber-500 font-semibold flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    {isBangla ? `${daysLeft} দিন বাকি` : `Expires in ${daysLeft}d`}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">
                                    {format(new Date(batch.expiryDate), 'dd MMM yyyy')}
                                  </span>
                                )
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </td>

                            {/* 9. Status */}
                            <td className="py-3 px-3">{getBatchBadge()}</td>

                            {/* 10. Actions */}
                            <td className="py-3 px-3 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon-sm"
                                      className="cursor-pointer"
                                      onClick={() => setSelectedBatch(batch)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent side="top">
                                    <p>{isBangla ? 'বিস্তারিত দেখুন' : 'View'}</p>
                                  </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon-sm"
                                      className="cursor-pointer"
                                      onClick={() => {
                                        onClose();
                                        router.push(`/inventory/batches?edit=${batch.id}`);
                                      }}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent side="top">
                                    <p>{isBangla ? 'সম্পাদনা' : 'Edit'}</p>
                                  </TooltipContent>
                                </Tooltip>

                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon-sm" className="cursor-pointer">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-44">
                                    <DropdownMenuItem className="cursor-pointer" onClick={() => setSelectedBatch(batch)}>
                                      <Eye className="h-4 w-4 mr-2" />
                                      {isBangla ? 'ব্যাচ বিস্তারিত' : 'View Batch Details'}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer" onClick={() => {
                                      onClose();
                                      router.push(`/inventory/stock-adjustment?batchId=${batch.id}`);
                                    }}>
                                      <ArrowRightLeft className="h-4 w-4 mr-2 text-emerald-500" />
                                      {isBangla ? 'স্টক সমন্বয়' : 'Adjust Stock'}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer" onClick={() => {
                                      onClose();
                                      router.push(`/inventory/transfer?batchId=${batch.id}`);
                                    }}>
                                      <Building2 className="h-4 w-4 mr-2" />
                                      {isBangla ? 'স্টক স্থানান্তর' : 'Transfer Stock'}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="cursor-pointer" onClick={() => toast.info(isBangla ? 'ব্যাচ লেবেল প্রিন্ট হচ্ছে...' : 'Printing Batch Label...')}>
                                      <Printer className="h-4 w-4 mr-2" />
                                      {isBangla ? 'লেবেল প্রিন্ট' : 'Print Batch Label'}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </TooltipProvider>

        {/* View Batch Detail Sub-Modal */}
        {selectedBatch && (
          <Dialog open={!!selectedBatch} onOpenChange={() => setSelectedBatch(null)}>
            <DialogContent className="max-w-md bg-background border border-border shadow-xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-base font-bold">
                  <Layers className="h-5 w-5 text-primary" />
                  {isBangla ? 'ব্যাচ বিবরণী' : 'Batch Details'} — {selectedBatch.batchNumber}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-3 pt-2 text-xs">
                <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-muted/40 border border-border/60">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">{isBangla ? 'পণ্য' : 'Product'}</span>
                    <span className="font-semibold text-foreground truncate block">{item?.name || selectedBatch.batchNumber}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">{isBangla ? 'শাখা / Branch ID' : 'Branch / Branch ID'}</span>
                    <span className="font-semibold text-foreground truncate block">{selectedBatch.branchName || selectedBatch.branchId}</span>
                  </div>
                </div>

                <div className="space-y-1.5 border-t border-border/60 pt-2">
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">{isBangla ? 'ব্যাচ আইডি:' : 'Batch ID:'}</span>
                    <span className="font-mono">{selectedBatch.id || selectedBatch.batchId}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">{isBangla ? 'ব্রাঞ্চ আইডি:' : 'Branch ID:'}</span>
                    <span className="font-mono">{selectedBatch.branchId}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">{isBangla ? 'প্রাথমিক পরিমাণ:' : 'Initial Quantity:'}</span>
                    <span className="font-medium">{selectedBatch.initialQty} {unit}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">{isBangla ? 'অবশিষ্ট পরিমাণ:' : 'Remaining Quantity:'}</span>
                    <span className="font-bold text-foreground">{selectedBatch.remainingQty} {unit}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">{isBangla ? 'ক্রয়মূল্য (একক):' : 'Cost Price (Per Unit):'}</span>
                    <span className="font-medium">{formatCurrency(selectedBatch.costPrice)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">{isBangla ? 'এমআরপি:' : 'MRP:'}</span>
                    <span className="font-semibold text-foreground">{formatCurrency(selectedBatch.mrp)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">{isBangla ? 'মোট ব্যাচ মূল্য:' : 'Total Batch Value:'}</span>
                    <span className="font-bold text-emerald-500">
                      {formatCurrency((selectedBatch.remainingQty || 0) * selectedBatch.costPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">{isBangla ? 'উৎপাদন তারিখ:' : 'Manufacture Date:'}</span>
                    <span>
                      {selectedBatch.manufactureDate
                        ? format(new Date(selectedBatch.manufactureDate), 'dd MMM yyyy')
                        : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">{isBangla ? 'মেয়াদ উত্তীর্ণের তারিখ:' : 'Expiry Date:'}</span>
                    <span className="font-medium">
                      {selectedBatch.expiryDate
                        ? format(new Date(selectedBatch.expiryDate), 'dd MMM yyyy')
                        : (isBangla ? 'মেয়াদ নেই' : 'No Expiry')}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">{isBangla ? 'তৈরির তারিখ:' : 'Created At:'}</span>
                    <span>
                      {selectedBatch.createdAt
                        ? format(new Date(selectedBatch.createdAt), 'dd MMM yyyy, hh:mm a')
                        : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">{isBangla ? 'স্ট্যাটাস:' : 'Status:'}</span>
                    <span className="font-medium">
                      {selectedBatch.isActive ? (
                        <span className="text-emerald-500 font-semibold">{isBangla ? 'সক্রিয়' : 'Active'}</span>
                      ) : (
                        <span className="text-muted-foreground">{isBangla ? 'নিষ্ক্রিয়' : 'Inactive'}</span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => setSelectedBatch(null)}>
                    {isBangla ? 'বন্ধ করুন' : 'Close'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}

