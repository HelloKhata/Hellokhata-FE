// Hello Khata OS - Premium Inventory Page
// Elite SaaS Design - Dark Theme First
// Multi-Price Support

'use client';

import { useState, useEffect, memo } from 'react';
import { Button, KPICard, EmptyState,  Skeleton } from '@/components/ui/premium';
import { PageHeader, ImageWithFallback } from '@/components/common';
import { Input } from '@/components/ui/input';
import { PaginationHelper } from '@/components/shared/PaginationHelper';
import { Badge } from '@/components/ui/badge';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Box,
  Edit,
  DollarSign,
  Crown,
  Tag,
  Sparkles,
  Trash2,
  ArrowUpDown,
  Eye,
} from 'lucide-react';
import { useCurrency } from '@/hooks/useAppTranslation';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
// import type { Item } from '@/types';
import { toast } from 'sonner';
import { ImportItemsModal } from '@/components/inventory/ImportItemsModal';
import { ExportItemsModal } from '@/components/inventory/ExportItemsModal';
import { BatchesModal } from '@/components/inventory/BatchesModal';
import { useRouter } from 'next/navigation';
import { useDeleteItem, useGetItems, useGetItemsStatus } from '@/hooks/api/useItems';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useGetItemsCategories } from '@/hooks/api/useItemCategories';
 
export default function InventoryPage() {
  const { t, isBangla } = useAppTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');
  const [selectedBatchItemId, setSelectedBatchItemId] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data: products, isLoading: itemsLoading, refetch } = useGetItems({
    search: searchTerm || undefined,
    categoryId: categoryFilter !== 'all' ? categoryFilter : undefined,
    lowStock: stockFilter === 'low' ? true : false,
    outOfStock: stockFilter === 'out' ? true : false,
    inStock: stockFilter === 'in' ? true : false,
    sortBy: sortBy,
    page: currentPage,
    limit: pageSize,
  });
  const { data: categories } = useGetItemsCategories();
  const { data: statusData, isLoading: statusLoading } = useGetItemsStatus();
  const router = useRouter();

  // Status KPIs from API
  const totalItems = statusData?.data?.totalItems ?? 0;
  const totalStock = statusData?.data?.totalStock ?? 0;
  const stockValue = statusData?.data?.stockValue ?? 0;
  const lowStockCount = statusData?.data?.lowStock ?? 0;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title={t('inventory.title')}
          subtitle={isBangla ? 'পণ্য ও স্টক ব্যবস্থাপনা' : 'Product & stock management'}
          showBack
          actions={
            <Button
              onClick={() => router.push('/inventory/new')}
              className="shrink-0 h-9 sm:h-10 px-3.5 sm:px-4 rounded-xl font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center gap-2 text-xs sm:text-sm"
            >
              <Plus className="h-4 w-4" />
              <span className="whitespace-nowrap">{t('inventory.addItem')}</span>
            </Button>
          }
        />

        {/* Premium SaaS ERP KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {statusLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-2xl bg-muted/30 animate-pulse border border-border/40"
              />
            ))
          ) : (
            <>
              <KPICard
                title="Total Items"
                titleBn="মোট পণ্য"
                value={totalItems}
                subtext="Registered products"
                subtextBn="নিবন্ধিত পণ্যসমূহ"
                icon={<Package className="h-5 w-5" />}
                iconColor="indigo"
                isBangla={isBangla}
              />
              <KPICard
                title="Total Stock"
                titleBn="মোট স্টক"
                value={totalStock}
                subtext="Available units"
                subtextBn="উপলব্ধ ইউনিট"
                icon={<Box className="h-5 w-5" />}
                iconColor="emerald"
                isBangla={isBangla}
              />
              <KPICard
                title="Stock Value"
                titleBn="স্টকের মূল্য"
                value={stockValue}
                prefix="৳"
                subtext="Total cost valuation"
                subtextBn="মোট ক্রয় মূল্যায়ন"
                icon={<DollarSign className="h-5 w-5" />}
                iconColor="emerald"
                isBangla={isBangla}
              />
              <KPICard
                title="Low Stock"
                titleBn="স্টক কম"
                value={lowStockCount}
                subtext={lowStockCount > 0 ? 'Items below min stock' : 'Healthy inventory'}
                subtextBn={lowStockCount > 0 ? 'রিঅর্ডার লেভেলের নিচে' : 'পর্যাপ্ত স্টক রয়েছে'}
                icon={<AlertTriangle className="h-5 w-5" />}
                iconColor={lowStockCount > 0 ? 'destructive' : 'emerald'}
                isBangla={isBangla}
              />
            </>
          )}
        </div>

        {/* Filters Container */}
        <div className="rounded-2xl border border-border/60 bg-gradient-to-b from-card/90 via-card/75 to-card/60 backdrop-blur-md p-3.5 sm:p-5 shadow-sm space-y-3">
          <div className="flex flex-col md:flex-row gap-2.5 sm:gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70 shrink-0" />
              <Input
                placeholder={isBangla ? 'পণ্যের নাম, SKU বা বারকোড খুঁজুন...' : 'Search by name, SKU or barcode...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 rounded-xl bg-background/80 hover:bg-background border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-xs sm:text-sm placeholder:text-muted-foreground/60"
              />
            </div>
            <div className="grid grid-cols-3 md:flex md:flex-row gap-1.5 sm:gap-2.5 md:gap-3">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[180px] h-9 md:h-10 px-2 sm:px-3 rounded-xl bg-background/80 hover:bg-background border-border/60 focus:ring-2 focus:ring-primary/20 transition-all text-[11px] sm:text-xs md:text-sm truncate">
                  <SelectValue placeholder={isBangla ? 'ক্যাটাগরি' : 'Category'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isBangla ? 'সব ক্যাটাগরি' : 'All Categories'}</SelectItem>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {isBangla? cat.nameBn : cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-full md:w-[150px] h-9 md:h-10 px-2 sm:px-3 rounded-xl bg-background/80 hover:bg-background border-border/60 focus:ring-2 focus:ring-primary/20 transition-all text-[11px] sm:text-xs md:text-sm truncate">
                  <SelectValue placeholder={isBangla ? 'স্টক' : 'Stock'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isBangla ? 'সব' : 'All'}</SelectItem>
                  <SelectItem value="low">{isBangla ? 'স্টক কম' : 'Low Stock'}</SelectItem>
                  <SelectItem value="out">{isBangla ? 'স্টক শেষ' : 'Out of Stock'}</SelectItem>
                  <SelectItem value="in">{isBangla ? 'ইন স্টক' : 'In Stock'}</SelectItem>
                </SelectContent>
              </Select>
             
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[170px] h-9 md:h-10 px-2 sm:px-3 rounded-xl bg-background/80 hover:bg-background border-border/60 focus:ring-2 focus:ring-primary/20 transition-all text-[11px] sm:text-xs md:text-sm truncate">
                  <ArrowUpDown className="h-3 w-3 mr-1 text-muted-foreground shrink-0 hidden sm:inline-block" />
                  <SelectValue placeholder={isBangla ? 'সাজান' : 'Sort by'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">{isBangla ? 'ডিফল্ট' : 'Default'}</SelectItem>
                  <SelectItem value="stock_asc">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0" />
                      {isBangla ? 'স্টক কম (প্রথমে)' : 'Low Stock First'}
                    </div>
                  </SelectItem>
                  <SelectItem value="stock_desc">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <Box className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      {isBangla ? 'স্টক বেশি (প্রথমে)' : 'High Stock First'}
                    </div>
                  </SelectItem>
                  <SelectItem value="price_asc">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <TrendingUp className="h-3.5 w-3.5 text-primary shrink-0" />
                      {isBangla ? 'মূল্য: কম → বেশি' : 'Price: Low → High'}
                    </div>
                  </SelectItem>
                  <SelectItem value="price_desc">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <TrendingDown className="h-3.5 w-3.5 text-destructive shrink-0" />
                      {isBangla ? 'মূল্য: বেশি → কম' : 'Price: High → Low'}
                    </div>
                  </SelectItem>
                  <SelectItem value="cost_asc">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <Tag className="h-3.5 w-3.5 text-primary shrink-0" />
                      {isBangla ? 'ক্রয়মূল্য: কম → বেশি' : 'Cost: Low → High'}
                    </div> 
                  </SelectItem>
                  <SelectItem value="cost_desc">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <Tag className="h-3.5 w-3.5 text-destructive shrink-0" />
                      {isBangla ? 'ক্রয়মূল্য: বেশি → কম' : 'Cost: High → Low'}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Items List Container */}
        <div className="bg-transparent md:bg-card border-0 md:border md:border-border/60 md:rounded-2xl md:shadow-sm md:overflow-hidden space-y-3 md:space-y-0">
          <div className="px-1 sm:px-2 md:px-6 pt-1 md:pt-5 pb-1 md:pb-3 flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              {isBangla ? 'পণ্য তালিকা' : 'Item List'}
            </h3>
            <span className="text-xs text-muted-foreground font-medium">
              {totalItems} {isBangla ? 'টি পণ্য' : 'items'}
            </span>
          </div>

          {itemsLoading ? (
            <div className="p-0 md:p-4 space-y-2.5 md:space-y-4">
              {/* Desktop Skeletons */}
              <div className="hidden md:block space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/20 animate-pulse gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
                      <div className="space-y-2 flex-1 max-w-md">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-36 rounded" />
                          <Skeleton className="h-4 w-16 rounded-full" />
                        </div>
                        <Skeleton className="h-3 w-48 rounded" />
                        <Skeleton className="h-2 w-32 rounded-full" />
                      </div>
                    </div>
                    <div className="flex items-center gap-6 shrink-0">
                      <div className="space-y-1 text-right">
                        <Skeleton className="h-4 w-16 rounded ml-auto" />
                        <Skeleton className="h-3 w-24 rounded ml-auto" />
                      </div>
                      <div className="flex items-center gap-1">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Mobile Skeletons - Slim Cards */}
              <div className="md:hidden space-y-2.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="bg-card border border-border/60 rounded-xl p-2.5 sm:p-3 shadow-sm animate-pulse space-y-2">
                    <div className="flex items-center gap-2.5">
                      <Skeleton className="h-11 w-11 rounded-lg shrink-0" />
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <Skeleton className="h-3.5 w-3/5 rounded" />
                        <Skeleton className="h-2.5 w-2/5 rounded" />
                      </div>
                      <div className="space-y-1 text-right shrink-0">
                        <Skeleton className="h-3.5 w-14 rounded ml-auto" />
                        <Skeleton className="h-2.5 w-10 rounded ml-auto" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              icon={<Package className="h-8 w-8" />}
              title={isBangla ? 'কোনো পণ্য নেই' : 'No items found'}
              description={isBangla ? 'নতুন পণ্য যোগ করুন' : 'Add your first item'}
              isBangla={isBangla}
              action={
                <Button onClick={() => router.push('/inventory/new')} className="rounded-xl">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="whitespace-nowrap">{t('inventory.addItem')}</span>
                </Button>
              }
            />
          ) : (
            <div>
              {/* Column Header Bar - Left Aligned Except Actions (Desktop only) */}
              <div className="hidden md:flex items-center justify-between w-full px-6 py-3 bg-muted/40 text-xs font-medium text-muted-foreground border-b border-border/40 gap-4">
                <div className="w-8 text-left shrink-0">SL.</div>
                <div className="w-32 text-left shrink-0">{isBangla ? 'বারকোড / SKU' : 'Barcode / SKU'}</div>
                <div className="w-12 text-left shrink-0">{isBangla ? 'ছবি' : 'Image'}</div>
                <div className="w-52 text-left shrink-0">{isBangla ? 'পণ্যের নাম' : 'Product Name'}</div>
                <div className="w-20 text-left shrink-0">{isBangla ? 'ক্রয়মূল্য' : 'Cost Price'}</div>
                <div className="w-20 text-left shrink-0">{isBangla ? 'বিক্রয়মূল্য' : 'Selling Price'}</div>
                <div className="hidden md:block w-24 text-left shrink-0">{isBangla ? 'ব্যাচ' : 'Batches'}</div>
                <div className="w-20 text-left shrink-0">{isBangla ? 'পরিমাণ' : 'Quantity'}</div>
                <div className="w-24 text-left shrink-0">{isBangla ? 'স্ট্যাটাস' : 'Status'}</div>
                <div className="text-right w-28 shrink-0">{isBangla ? 'অ্যাকশন' : 'Actions'}</div>
              </div>
              <div className="space-y-2.5 md:space-y-0 md:divide-y md:divide-border/30">
                {products?.map((item, index) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    isBangla={isBangla}
                    index={(currentPage - 1) * pageSize + index}
                    categories={categories || []}
                    onView={() => router.push(`/inventory/${item.id}`)}
                    onViewBatches={(itemId) => setSelectedBatchItemId(itemId)}
                    refetchItems={refetch}
                  />
                ))}
              </div>

              {/* Pagination Bar */}
              <div className="mt-2.5 md:mt-0 px-4 md:px-6 py-3 md:py-3.5 md:pb-4 bg-card md:bg-muted/5 border border-border/60 md:border-0 md:border-t md:border-border/40 rounded-xl md:rounded-none overflow-x-auto">
                <PaginationHelper
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  isBangla={isBangla}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Batches Modal */}
      {selectedBatchItemId && (
        <BatchesModal
          isOpen={!!selectedBatchItemId}
          onClose={() => setSelectedBatchItemId(null)}
          itemId={selectedBatchItemId}
          item={products?.find((p) => p.id === selectedBatchItemId) || null}
          isBangla={isBangla}
          categories={categories || []}
        />
      )}

      {/* Import Items Modal */}
      <ImportItemsModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={() => {
          window.location.reload();
        }}
      />

      {/* Export Items Modal */}
      <ExportItemsModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        items={products || []}
      />

      {/* Categories Management Modal */}
      {/* <CategoriesModal
        isOpen={showCategoriesModal}
        onClose={() => setShowCategoriesModal(false)}
      /> */}
    </>
  );
}

// Item Row Component
const ItemRow = memo(function ItemRow({
  item,
  isBangla,
  index,
  onView,
  onViewBatches,
  refetchItems
}: {
  item: any;
  isBangla: boolean;
  index: number;
  categories?: any[];
  onView: () => void;
  onViewBatches: (itemId: string) => void;
  refetchItems: () => void
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { formatCurrency } = useCurrency();
  const deleteItem = useDeleteItem();
  const router = useRouter();

  // Metadata Resolution
  const minStock = item.minStock ?? 10;
  const unit = item.unit || 'pcs';

  // Stock Status Calculation
  const getStockStatus = () => {
    if ((item as any).isExpired || (item as any).hasExpiredBatch) {
      return {
        variant: 'destructive' as const,
        label: isBangla ? 'মেয়াদউত্তীর্ণ ব্যাচ' : 'Expired Batch',
        tooltip: isBangla ? 'একটি বা একাধিক ব্যাচের মেয়াদ উত্তীর্ণ হয়েছে' : 'One or more batches have expired'
      };
    }
    if ((item as any).isExpiringSoon || (item as any).hasExpiringBatch) {
      return {
        variant: 'warning' as const,
        label: isBangla ? 'শীঘ্রই মেয়াদউত্তীর্ণ' : 'Expiring Soon',
        tooltip: isBangla ? 'পণ্য ব্যাচের মেয়াদ শীঘ্রই শেষ হবে' : 'Product batch is expiring soon'
      };
    }
    if ((item.currentStock ?? 0) === 0) {
      return {
        variant: 'destructive' as const,
        label: isBangla ? 'স্টক শেষ' : 'Out of Stock',
        tooltip: isBangla ? 'কোন স্টক অবশিষ্ট নেই' : 'No inventory remaining'
      };
    }
    if ((item.currentStock ?? 0) <= minStock) {
      return {
        variant: 'warning' as const,
        label: isBangla ? 'স্টক কম' : 'Low Stock',
        tooltip: isBangla ? `স্টক লেভেল রিউর্ডার লেভেলের নিচে (${minStock} ${unit})` : `Stock level below reorder alert (${minStock} ${unit})`
      };
    }
    return {
      variant: 'success' as const,
      label: isBangla ? 'স্টক আছে' : 'In Stock',
      tooltip: isBangla ? 'পর্যাপ্ত স্টক রয়েছে' : 'Healthy inventory level'
    };
  };

  const stockStatus = getStockStatus();
  const itemStatus = item.status
    ? String(item.status).toUpperCase()
    : item.isActive === false
    ? 'INACTIVE'
    : 'ACTIVE';
  const hasWholesale = Boolean(item.wholesalePrice && item.wholesalePrice > 0);
  const hasVip = Boolean(item.vipPrice && item.vipPrice > 0);
  const hasMinimum = Boolean(item.minimumPrice && item.minimumPrice > 0);
  const hasMultiPrice = hasWholesale || hasVip || hasMinimum;

  const handleConfirmDelete = () => {
    deleteItem.mutate(item.id, {
      onSuccess: data => {
        if (data.success) {
          toast.success(isBangla ? 'পণ্য সফলভাবে মুছে ফেলা হয়েছে!' : 'Item deleted successfully!');
          refetchItems();
          setDeleteOpen(false);
        }
      }
    });
  };

  const handleRowClick = () => {
    if (deleteOpen) return;
    onView();
  };

  const handleAction = (e: React.MouseEvent, actionFn: () => void) => {
    e.stopPropagation();
    actionFn();
  };

  return (
    <TooltipProvider>
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm overflow-hidden !max-h-none">
          <div className="flex flex-col items-center gap-3 pt-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 shrink-0">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>

            <div className="text-center space-y-1">
              <DialogTitle className="text-base font-semibold">
                {isBangla ? 'পণ্য মুছে ফেলবেন?' : 'Delete this item?'}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {isBangla
                  ? `"${item.name}" স্থায়ীভাবে মুছে ফেলা হবে।`
                  : `"${item.name}" will be permanently deleted.`}
              </DialogDescription>
            </div>

            <div className="flex items-center gap-3 w-full pt-2">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => setDeleteOpen(false)}
              >
                {isBangla ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button
                variant="destructive"
                className="flex-1 rounded-xl"
                onClick={handleConfirmDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isBangla ? 'মুছে ফেলুন' : 'Delete'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Desktop Table Row (md and up) */}
      <div
        className="hidden md:flex items-center justify-between w-full px-6 py-4 hover:bg-muted/30 transition-colors cursor-default group gap-4 border-b border-border/30"
        style={{ animationDelay: `${index * 30}ms` }}
        onClick={handleRowClick}
      >
        {/* 1. SL. (Left aligned) */}
        <div className="w-8 shrink-0 text-left text-xs font-mono font-medium text-muted-foreground/80">
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* 2. Product Barcode / SKU (Left aligned) */}
        <div className="w-32 shrink-0 min-w-0 text-left">
            <span className="text-xs font-mono text-muted-foreground truncate block" title={item.barcode}>
            {item.barcode}
            </span>
        </div>

        {/* 3. Product Image (Left aligned) */}
        <div className="w-12 shrink-0 text-left flex items-center justify-start">
          <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center overflow-hidden border border-border/40 p-1 shrink-0">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                loading="lazy"
                className="h-full w-full object-contain"
              />
            ) : (
              <Package className="h-6 w-6 text-slate-400" />
            )}
          </div>
        </div>

        {/* 4. Product Name & Status (Left aligned, expanded) */}
        <div className="w-52 shrink-0 min-w-0 text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-foreground text-sm leading-snug truncate" title={item.name}>{item.name}</p>

            <span
              className={cn(
                "text-[11px] font-medium tracking-wide whitespace-nowrap",
                stockStatus.variant === 'destructive' ? "text-rose-500" :
                stockStatus.variant === 'warning' ? "text-amber-500 dark:text-amber-400" : "text-muted-foreground"
              )}
            >
              {stockStatus.label}
            </span>

            {hasMultiPrice && (
              <>
                {hasWholesale && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                    {isBangla ? 'পাইকারি' : 'Wholesale'}
                  </span>
                )}
                {hasVip && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                    VIP
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Cost Price */}
        <div className="w-20 shrink-0 text-left">
          <p className="text-xs sm:text-sm font-semibold text-foreground whitespace-nowrap">
            {formatCurrency(item.costPrice ?? 0)}
          </p>
        </div>

        {/* Selling Price */}
        <div className="w-20 shrink-0 text-left">
          <p className="text-xs sm:text-sm font-semibold text-emerald-400 whitespace-nowrap">
            {formatCurrency(item.sellingPrice ?? 0)}
          </p>
        </div>

        {/* 5. Inventory (Batches, Left aligned) */}
        <div className="hidden md:flex flex-col w-24 shrink-0 text-left">
          <button
            type="button"
            className="h-auto py-1 px-2.5 whitespace-nowrap text-xs font-medium bg-muted/80 hover:bg-muted text-foreground border border-border/70 rounded-full transition-colors w-fit cursor-pointer flex items-center gap-1.5 shadow-2xs hover:border-border"
            onClick={(e) => handleAction(e, () => onViewBatches(item.id))}
          >
            <Box className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs font-medium text-foreground">
              {item.batchCount ?? 0} {item.batchCount === 1 ? (isBangla ? 'ব্যাচ' : 'Batch') : (isBangla ? 'ব্যাচ' : 'Batches')} 
            </span>
          </button>
        </div>

        {/* 6. Quantity (Left aligned) */}
        <div className="w-20 shrink-0 min-w-0 text-left space-y-0.5">
          <p className="text-sm font-extrabold text-foreground whitespace-nowrap">
            {item.currentStock ?? 0} <span className="text-xs font-normal text-muted-foreground">{unit}</span>
          </p>
        </div>

        {/* 7. Status (Active / Inactive Badge) */}
        <div className="w-24 shrink-0 text-left">
          {itemStatus === 'ACTIVE' ? (
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25 text-[11px] font-semibold py-0.5 px-2 flex items-center gap-1.5 w-max"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>{isBangla ? 'সক্রিয়' : 'Active'}</span>
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25 text-[11px] font-semibold py-0.5 px-2 flex items-center gap-1.5 w-max"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
              <span>{isBangla ? 'নিষ্ক্রিয়' : 'Inactive'}</span>
            </Badge>
          )}
        </div>

        {/* 8. Action Buttons (Right aligned) */}
        <div className="flex items-center justify-end gap-1 w-28 shrink-0 text-right">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                onClick={(e) => handleAction(e, () => router.push(`/inventory/edit/${item.id}`))}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{isBangla ? 'সম্পাদনা' : 'Edit'}</p>
            </TooltipContent>
          </Tooltip>
           <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                onClick={(e) => handleAction(e, onView)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{isBangla ? 'বিস্তারিত দেখুন' : 'View'}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Mobile Card Layout (Small Devices: md:hidden) - Slim & Smart */}
      <div
        className="md:hidden bg-card border border-border/60 rounded-xl p-2.5 sm:p-3 shadow-sm hover:border-border/90 transition-all cursor-pointer space-y-2"
        style={{ animationDelay: `${index * 30}ms` }}
        onClick={handleRowClick}
      >
        {/* Main Row: Thumbnail + Product Identity & Tags + Price & Stock */}
        <div className="flex items-center gap-2.5">
          {/* Thumbnail */}
          <div className="h-11 w-11 rounded-lg bg-white flex items-center justify-center overflow-hidden border border-border/40 p-0.5 shrink-0 shadow-xs">
            {item.imageUrl ? (
              <ImageWithFallback
                src={item.imageUrl}
                alt={item.name}
                width={44}
                height={44}
                fallbackSrc="/images/image.png"
                className="h-full w-full object-contain"
              />
            ) : (
              <Package className="h-5 w-5 text-slate-400" />
            )}
          </div>

          {/* Product Name, SKU & Badges */}
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-foreground text-xs leading-tight truncate" title={item.name}>
              {item.name}
            </h4>

            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              {item.barcode && (
                <span className="text-[10px] font-mono text-muted-foreground/90 truncate max-w-[90px]">
                  {item.barcode}
                </span>
              )}

              <span className="text-[10px] text-muted-foreground/40">•</span>

              {/* Stock Status Badge */}
              <span
                className={cn(
                  "text-[10px] font-medium leading-none",
                  stockStatus.variant === 'destructive'
                    ? "text-rose-500"
                    : stockStatus.variant === 'warning'
                    ? "text-amber-400"
                    : "text-emerald-400"
                )}
              >
                {stockStatus.label}
              </span>

              {hasWholesale && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                  {isBangla ? 'পাইকারি' : 'Wholesale'}
                </span>
              )}
              {hasVip && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                  VIP
                </span>
              )}
            </div>
          </div>

          {/* Right: Selling Price & Stock Quantity */}
          <div className="text-right shrink-0">
            <p className="font-bold text-emerald-400 text-xs sm:text-sm whitespace-nowrap">
              {formatCurrency(item.sellingPrice ?? 0)}
            </p>
            <p className="text-[11px] font-semibold text-foreground whitespace-nowrap mt-0.5">
              {item.currentStock ?? 0} <span className="text-[10px] font-normal text-muted-foreground">{unit}</span>
            </p>
          </div>
        </div>

        {/* Secondary Slim Row: Cost & Batches / Status + Quick Actions */}
        <div className="flex items-center justify-between pt-1 border-t border-border/20 gap-2">
          {/* Left: Cost price & Batch chip / Status */}
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
              {isBangla ? 'ক্রয়:' : 'Cost:'}{" "}
              <strong className="text-foreground font-medium">{formatCurrency(item.costPrice ?? 0)}</strong>
            </span>

            {item.batchCount !== undefined && item.batchCount > 0 && (
              <button
                type="button"
                className="py-0.5 px-2 whitespace-nowrap text-[10px] font-medium bg-muted/80 hover:bg-muted text-foreground border border-border/70 rounded-full transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                onClick={(e) => handleAction(e, () => onViewBatches(item.id))}
              >
                <Box className="h-2.5 w-2.5 text-muted-foreground" />
                <span className="text-foreground font-medium">
                  {item.batchCount} {item.batchCount === 1 ? (isBangla ? 'ব্যাচ' : 'Batch') : (isBangla ? 'ব্যাচ' : 'Batches')}
                </span>
              </button>
            )}

            {itemStatus !== 'ACTIVE' && (
              <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                {isBangla ? 'নিষ্ক্রিয়' : 'Inactive'}
              </span>
            )}
          </div>

          {/* Right: Slim Action Buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 rounded text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted/50 flex items-center gap-1 cursor-pointer"
              onClick={(e) => handleAction(e, onView)}
            >
              <Eye className="h-3 w-3" />
              <span>{isBangla ? 'দেখুন' : 'View'}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 rounded text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted/50 flex items-center gap-1 cursor-pointer"
              onClick={(e) => handleAction(e, () => router.push(`/inventory/edit/${item.id}`))}
            >
              <Edit className="h-3 w-3" />
              <span>{isBangla ? 'এডিট' : 'Edit'}</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer"
              onClick={(e) => handleAction(e, () => setDeleteOpen(true))}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
});
