// Hello Khata OS - Premium Inventory Page
// Elite SaaS Design - Dark Theme First
// Multi-Price Support

'use client';

import { useState, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, KPICard, Divider, EmptyState, Progress, Skeleton } from '@/components/ui/premium';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  Eye,
  Edit,
  MoreVertical,
  ChevronRight,
  BarChart3,
  DollarSign,
  Crown,
  Star,
  Tag,
  Sparkles,
  Calendar,
  Layers,
  ArrowUpCircle,
  ArrowDownCircle,
  ArrowRightLeft,
  Truck,
  Settings,
  Upload,
  Download,
  Tags,
  Trash2,
  ArrowUpDown,
  Lock,
  Copy,
  Archive,
  Printer,
  QrCode,
  FileText,
  Receipt,
} from 'lucide-react';
import { useItems, useCategories } from '@/hooks/queries';
import { useCurrency, useDateFormat } from '@/hooks/useAppTranslation';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { useNavigation } from '@/stores/uiStore';
import { cn } from '@/lib/utils';
import { DetailModal, DetailRow, DetailSection } from '@/components/shared/DetailModal';
import type { Item } from '@/types';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ImportItemsModal } from '@/components/inventory/ImportItemsModal';
import { ExportItemsModal } from '@/components/inventory/ExportItemsModal';
import { CategoriesModal } from '@/components/inventory/CategoriesModal';
import { BatchesModal } from '@/components/inventory/BatchesModal';
import { useRouter } from 'next/navigation';
import { useDeleteItem, useGetItems, useGetItemsCategories, useGetItemsStatus } from '@/hooks/api/useItems';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function InventoryPage() {
  const { t, isBangla } = useAppTranslation();
  const { formatCurrency, formatNumber } = useCurrency();
  const { navigateTo } = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedBatchItem, setSelectedBatchItem] = useState<Item | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);

  const { data: itemsData, isLoading: itemsLoading, refetch } = useGetItems({
    search: searchTerm || undefined,
    categoryId: categoryFilter !== 'all' ? categoryFilter : undefined,
    lowStock: stockFilter === 'low' ? true : undefined,
    // optional future:
    // outOfStock: stockFilter === 'out' ? true : undefined,
    page: 1,
    limit: 50,
  });
  const { data: categoriesData } = useGetItemsCategories();
  const { data: statusData, isLoading: statusLoading } = useGetItemsStatus();
  const router = useRouter();

  const items = itemsData?.data;
  const categories = categoriesData?.data;

  // Status KPIs from API
  const totalItems = statusData?.data?.totalItems ?? 0;
  const totalStock = statusData?.data?.totalStock ?? 0;
  const stockValue = statusData?.data?.stockValue ?? 0;
  const lowStockCount = statusData?.data?.lowStock ?? 0;

  // Multi-price stats (still derived from the items list)
  const wholesaleItems = (items || []).filter((item) => item.wholesalePrice && item.wholesalePrice > 0).length;
  const vipItems = (items || []).filter((item) => item.vipPrice && item.vipPrice > 0).length;
  const multiPriceItems = (items || []).filter((item) => item.wholesalePrice || item.vipPrice || item.minimumPrice).length;

  // Client-side price filtering
  const priceFilteredItems = (items || []).filter((item) => {
    switch (priceFilter) {
      case 'wholesale':
        return item.wholesalePrice && item.wholesalePrice > 0;
      case 'vip':
        return item.vipPrice && item.vipPrice > 0;
      case 'multi':
        return (item.wholesalePrice && item.wholesalePrice > 0)
          || (item.vipPrice && item.vipPrice > 0)
          || (item.minimumPrice && item.minimumPrice > 0);
      default:
        return true;
    }
  });

  // Client-side sorting (applied on top of price filter)
  const sortedItems = [...priceFilteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'low-stock':
        return (a.currentStock ?? 0) - (b.currentStock ?? 0);
      case 'high-stock':
        return (b.currentStock ?? 0) - (a.currentStock ?? 0);
      case 'price-asc':
        return a.sellingPrice - b.sellingPrice;
      case 'price-desc':
        return b.sellingPrice - a.sellingPrice;
      case 'cost-asc':
        return a.costPrice - b.costPrice;
      case 'cost-desc':
        return b.costPrice - a.costPrice;
      default:
        return 0;
    }
  });

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              {t('inventory.title')}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5 whitespace-nowrap">
              {isBangla ? 'পণ্য ও স্টক ব্যবস্থাপনা' : 'Product & stock management'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Settings Dropdown — disabled, coming soon */}
            <Button
              variant="ghost"
              size="icon-sm"
              disabled
              title={isBangla ? 'শীঘ্রই আসছে' : 'Coming soon'}
              className="opacity-50 cursor-not-allowed"
            >
              <Settings className="h-4 w-4" />
            </Button>

            <Button onClick={() => router.push('/inventory/new')} className="shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              <span className="whitespace-nowrap">{t('inventory.addItem')}</span>
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statusLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-xl bg-muted/40 animate-pulse"
              />
            ))
          ) : (
            <>
              <KPICard
                title="Total Items"
                titleBn="মোট পণ্য"
                value={totalItems}
                icon={<Package className="h-5 w-5" />}
                iconColor="indigo"
                isBangla={isBangla}
              />
              <KPICard
                title="Total Stock"
                titleBn="মোট স্টক"
                value={totalStock}
                icon={<Box className="h-5 w-5" />}
                iconColor="emerald"
                isBangla={isBangla}
              />
              <KPICard
                title="Stock Value"
                titleBn="স্টকের মূল্য"
                value={stockValue}
                prefix="৳"
                icon={<DollarSign className="h-5 w-5" />}
                iconColor="emerald"
                isBangla={isBangla}
              />
              <KPICard
                title="Low Stock"
                titleBn="স্টক কম"
                value={lowStockCount}
                icon={<AlertTriangle className="h-5 w-5" />}
                iconColor={lowStockCount > 0 ? 'warning' : 'emerald'}
                isBangla={isBangla}
              />
            </>
          )}
        </div>

        {/* Multi-Price Summary */}
        {multiPriceItems > 0 && (
          <Card variant="elevated" padding="default">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground whitespace-nowrap">
                  {isBangla ? 'মাল্টি-প্রাইস পণ্য' : 'Multi-Price Items'}
                </h3>
                <p className="text-xs text-muted-foreground whitespace-nowrap">
                  {isBangla
                    ? `${multiPriceItems}টি পণ্যে একাধিক মূল্য সেট করা আছে`
                    : `${multiPriceItems} items have multiple price tiers`}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {wholesaleItems > 0 && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo/10 whitespace-nowrap">
                    <Package className="h-3.5 w-3.5 text-indigo shrink-0" />
                    <span className="text-xs font-medium text-indigo">{wholesaleItems}</span>
                    <span className="text-xs text-muted-foreground">{isBangla ? 'পাইকারি' : 'Wholesale'}</span>
                  </div>
                )}
                {vipItems > 0 && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-warning/10 whitespace-nowrap">
                    <Crown className="h-3.5 w-3.5 text-warning shrink-0" />
                    <span className="text-xs font-medium text-warning">{vipItems}</span>
                    <span className="text-xs text-muted-foreground">VIP</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Filters */}
        <Card variant="elevated" padding="default">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground shrink-0" />
              <Input
                placeholder={isBangla ? 'পণ্যের নাম, SKU বা বারকোড খুঁজুন...' : 'Search by name, SKU or barcode...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder={isBangla ? 'ক্যাটাগরি' : 'Category'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isBangla ? 'সব ক্যাটাগরি' : 'All Categories'}</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.nameBn || cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder={isBangla ? 'স্টক' : 'Stock'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isBangla ? 'সব' : 'All'}</SelectItem>
                <SelectItem value="low">{isBangla ? 'স্টক কম' : 'Low Stock'}</SelectItem>
                <SelectItem value="out">{isBangla ? 'স্টক শেষ' : 'Out of Stock'}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="w-full md:w-[170px]">
                <SelectValue placeholder={isBangla ? 'মূল্য' : 'Price'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isBangla ? 'সব মূল্য' : 'All Prices'}</SelectItem>
                <SelectItem value="wholesale">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <Package className="h-3.5 w-3.5 text-indigo shrink-0" />
                    {isBangla ? 'পাইকারি' : 'Wholesale'}
                  </div>
                </SelectItem>
                <SelectItem value="vip">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <Crown className="h-3.5 w-3.5 text-warning shrink-0" />
                    VIP
                  </div>
                </SelectItem>
                <SelectItem value="multi">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
                    {isBangla ? 'মাল্টি-প্রাইস' : 'Multi-Price'}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[170px]">
                <ArrowUpDown className="h-3.5 w-3.5 mr-1.5 text-muted-foreground shrink-0" />
                <SelectValue placeholder={isBangla ? 'সাজান' : 'Sort by'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">{isBangla ? 'ডিফল্ট' : 'Default'}</SelectItem>
                <SelectItem value="low-stock">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0" />
                    {isBangla ? 'স্টক কম (প্রথমে)' : 'Low Stock First'}
                  </div>
                </SelectItem>
                <SelectItem value="high-stock">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <Box className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    {isBangla ? 'স্টক বেশি (প্রথমে)' : 'High Stock First'}
                  </div>
                </SelectItem>
                <SelectItem value="price-asc">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <TrendingUp className="h-3.5 w-3.5 text-primary shrink-0" />
                    {isBangla ? 'মূল্য: কম → বেশি' : 'Price: Low → High'}
                  </div>
                </SelectItem>
                <SelectItem value="price-desc">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <TrendingDown className="h-3.5 w-3.5 text-destructive shrink-0" />
                    {isBangla ? 'মূল্য: বেশি → কম' : 'Price: High → Low'}
                  </div>
                </SelectItem>
                <SelectItem value="cost-asc">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <Tag className="h-3.5 w-3.5 text-primary shrink-0" />
                    {isBangla ? 'ক্রয়মূল্য: কম → বেশি' : 'Cost: Low → High'}
                  </div>
                </SelectItem>
                <SelectItem value="cost-desc">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <Tag className="h-3.5 w-3.5 text-destructive shrink-0" />
                    {isBangla ? 'ক্রয়মূল্য: বেশি → কম' : 'Cost: High → Low'}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Items List */}
        <Card variant="elevated" padding="none">
          <CardHeader className="px-6 pt-6 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base whitespace-nowrap">{isBangla ? 'পণ্য তালিকা' : 'Item List'}</CardTitle>
              {sortBy !== 'default' && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <ArrowUpDown className="h-3 w-3" />
                  {isBangla ? 'সাজানো হয়েছে' : 'Sorted'}
                </span>
              )}
            </div>
          </CardHeader>
          <Divider />
          <CardContent className="p-0">
            {itemsLoading ? (
              <div className="p-4 space-y-4">
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
            ) : sortedItems.length === 0 ? (
              <EmptyState
                icon={<Package className="h-8 w-8" />}
                title={isBangla ? 'কোনো পণ্য নেই' : 'No items found'}
                description={isBangla ? 'নতুন পণ্য যোগ করুন' : 'Add your first item'}
                isBangla={isBangla}
                action={
                  <Button onClick={() => router.push('/inventory/new')}>
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="whitespace-nowrap">{t('inventory.addItem')}</span>
                  </Button>
                }
              />
            ) : (
              <div>
                {/* Column Header Bar - Left Aligned Except Actions */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 text-xs font-semibold text-muted-foreground border-b border-border-subtle gap-4">
                  <div className="w-8 text-left shrink-0">SL.</div>
                  <div className="w-24 sm:w-28 text-left shrink-0">SKU</div>
                  <div className="w-11 text-left shrink-0">{isBangla ? 'ছবি' : 'Image'}</div>
                  <div className="flex-1 text-left min-w-0">{isBangla ? 'পণ্যের নাম' : 'Product Name'}</div>
                  <div className="hidden md:block w-40 sm:w-48 text-left shrink-0">{isBangla ? 'ব্যাচ' : 'Batches'}</div>
                  <div className="w-28 sm:w-36 text-left shrink-0">{isBangla ? 'পরিমাণ' : 'Quantity'}</div>
                  <div className="text-right w-36 sm:w-44 shrink-0">{isBangla ? 'অ্যাকশন' : 'Actions'}</div>
                </div>
                <ScrollArea className="h-[500px]">
                  <div className="divide-y divide-border-subtle">
                    {sortedItems.map((item, index) => (
                      <ItemRow
                        key={item.id}
                        item={item}
                        isBangla={isBangla}
                        index={index}
                        categories={categories || []}
                        onView={() => router.push(`/inventory/${item.id}`)}
                        onViewBatches={() => setSelectedBatchItem(item)}
                        refetchItems={refetch}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Item Detail Modal */}
      <DetailModal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.name || ''}
        subtitle={selectedItem?.sku || ''}
        width="lg"
      >
        {selectedItem && (
          <>
            <DetailSection title={isBangla ? 'পণ্যের তথ্য' : 'Item Information'}>
              <DetailRow
                label={isBangla ? 'বর্তমান স্টক' : 'Current Stock'}
                value={
                  <span className={cn(
                    'text-xl font-bold',
                    (selectedItem.currentStock ?? 0) === 0 ? 'text-red-600' :
                      (selectedItem.currentStock ?? 0) <= (selectedItem.minStock ?? 0) ? 'text-amber-600' : 'text-emerald-600'
                  )}>
                    {selectedItem.currentStock ?? 0} {selectedItem.unit}
                  </span>
                }
                icon={<Package className="h-5 w-5 text-emerald-600" />}
              />
              <DetailRow
                label={isBangla ? 'বিক্রয় মূল্য' : 'Selling Price'}
                value={<span className="font-bold">{formatCurrency(selectedItem.sellingPrice)}</span>}
                icon={<DollarSign className="h-5 w-5 text-blue-600" />}
              />
              <DetailRow
                label={isBangla ? 'ক্রয় মূল্য' : 'Cost Price'}
                value={formatCurrency(selectedItem.costPrice)}
                icon={<Tag className="h-5 w-5 text-gray-600" />}
              />
              {selectedItem.margin !== undefined && (
                <DetailRow
                  label={isBangla ? 'মার্জিন' : 'Margin'}
                  value={
                    <span className={cn(
                      'font-bold',
                      selectedItem.margin > 20 ? 'text-emerald-600' :
                        selectedItem.margin > 10 ? 'text-amber-600' : 'text-red-600'
                    )}>
                      {selectedItem.margin.toFixed(1)}%
                    </span>
                  }
                  icon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
                />
              )}
            </DetailSection>

            {/* Multi-Price Section */}
            {(selectedItem.wholesalePrice || selectedItem.vipPrice || selectedItem.minimumPrice) && (
              <DetailSection title={isBangla ? 'মাল্টি-প্রাইস' : 'Multi-Price'}>
                {selectedItem.wholesalePrice && (
                  <DetailRow
                    label={isBangla ? 'পাইকারি মূল্য' : 'Wholesale Price'}
                    value={<span className="font-bold text-indigo-600">{formatCurrency(selectedItem.wholesalePrice)}</span>}
                    icon={<Package className="h-5 w-5 text-indigo" />}
                  />
                )}
                {selectedItem.vipPrice && (
                  <DetailRow
                    label="VIP Price"
                    value={<span className="font-bold text-amber-600">{formatCurrency(selectedItem.vipPrice)}</span>}
                    icon={<Crown className="h-5 w-5 text-amber-600" />}
                  />
                )}
                {selectedItem.minimumPrice && (
                  <DetailRow
                    label={isBangla ? 'সর্বনিম্ন মূল্য' : 'Minimum Price'}
                    value={<span className="font-bold text-red-600">{formatCurrency(selectedItem.minimumPrice)}</span>}
                    icon={<TrendingDown className="h-5 w-5 text-red-600" />}
                  />
                )}
              </DetailSection>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <Button
                className="flex-1"
                onClick={() => router.push(`/inventory/${selectedItem.id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                <span className="whitespace-nowrap">{isBangla ? 'সম্পাদনা' : 'Edit'}</span>
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  toast.info(isBangla ? 'স্টক ইতিহাস শীঘ্রই আসছে' : 'Stock history coming soon');
                }}
              >
                <Layers className="h-4 w-4 mr-2" />
                <span className="whitespace-nowrap">{isBangla ? 'স্টক ইতিহাস' : 'Stock History'}</span>
              </Button>
            </div>
          </>
        )}
      </DetailModal>

      {/* View Batches Modal */}
      <BatchesModal
        isOpen={!!selectedBatchItem}
        onClose={() => setSelectedBatchItem(null)}
        item={selectedBatchItem}
        isBangla={isBangla}
        categories={categories || []}
      />

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
        items={items || []}
      />

      {/* Categories Management Modal */}
      <CategoriesModal
        isOpen={showCategoriesModal}
        onClose={() => setShowCategoriesModal(false)}
      />
    </>
  );
}

// Item Row Component
const ItemRow = memo(function ItemRow({
  item,
  isBangla,
  index,
  categories,
  onView,
  onViewBatches,
  refetchItems
}: {
  item: Item;
  isBangla: boolean;
  index: number;
  categories?: any[];
  onView: () => void;
  onViewBatches: () => void;
  refetchItems: () => void
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { formatCurrency } = useCurrency();
  const deleteItem = useDeleteItem();
  const router = useRouter();

  // Metadata Resolution
  const categoryName = item.categoryId
    ? categories?.find((c) => c.id === item.categoryId)?.name || (item as any).category?.name
    : (item as any).category?.name;
  const brandName = (item as any).brand;
  const batchesCount = (item as any).batchesCount ?? ((item as any).batches?.length ?? 1);
  const branchesCount = (item as any).branchesCount ?? ((item as any).branches?.length ?? 1);
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
  const maxCapacity = Math.max((item.maxStock || minStock * 3), 1);
  const stockPercentage = Math.min(((item.currentStock ?? 0) / maxCapacity) * 100, 100);

  const progressColor = (item.currentStock ?? 0) === 0 || stockStatus.variant === 'destructive'
    ? 'destructive'
    : (item.currentStock ?? 0) <= minStock || stockStatus.variant === 'warning'
      ? 'warning'
      : 'emerald';

  const marginVal = item.margin ?? (item.sellingPrice > 0 ? ((item.sellingPrice - item.costPrice) / item.sellingPrice) * 100 : 0);

  const hasWholesale = item.wholesalePrice && item.wholesalePrice > 0;
  const hasVip = item.vipPrice && item.vipPrice > 0;
  const hasMinimum = item.minimumPrice && item.minimumPrice > 0;
  const hasMultiPrice = hasWholesale || hasVip || hasMinimum;

  const handleDeleteButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteOpen(true);
  };

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

            <div className="flex w-full gap-2 pt-1">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDeleteOpen(false)}
              >
                {isBangla ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleConfirmDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isBangla ? 'মুছে ফেলুন' : 'Delete'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div
        className="flex items-center justify-between p-3.5 sm:p-4 hover:bg-muted/40 transition-colors cursor-default group stagger-item gap-4"
        style={{ animationDelay: `${index * 30}ms` }}
        onClick={handleRowClick}
      >
        {/* 1. SL. (Left aligned) */}
        <div className="w-8 shrink-0 text-left text-xs font-mono font-medium text-muted-foreground">
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* 2. Product SKU (Left aligned) */}
        <div className="w-24 sm:w-28 shrink-0 min-w-0 text-left">
          <span className="text-xs font-mono text-muted-foreground/80 truncate block" title={item.sku}>
            {item.sku ? `SKU: ${item.sku}` : '—'}
          </span>
        </div>

        {/* 3. Product Image (Left aligned) */}
        <div className="w-11 shrink-0 text-left flex items-center justify-start">
          <div className="h-11 w-11 rounded-sm bg-muted flex items-center justify-center overflow-hidden border border-border/80">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : (
              <Package className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </div>

        {/* 4. Product Name & Status (Left aligned, expanded) */}
        <div className="flex-1 min-w-0 space-y-1 text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-foreground text-sm ">{item.name}</p>

            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Badge variant={stockStatus.variant} size="sm" className="whitespace-nowrap cursor-help">
                    {stockStatus.label}
                  </Badge>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{stockStatus.tooltip}</p>
              </TooltipContent>
            </Tooltip>

            {hasMultiPrice && (
              <>
                {hasWholesale && (
                  <Badge variant="indigo" size="sm" icon={<Package className="h-3 w-3" />} className="whitespace-nowrap">
                    {isBangla ? 'পাইকারি' : 'Wholesale'}
                  </Badge>
                )}
                {hasVip && (
                  <Badge variant="warning" size="sm" icon={<Crown className="h-3 w-3" />} className="whitespace-nowrap">
                    VIP
                  </Badge>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80 flex-wrap">
            {categoryName && <span>{categoryName}</span>}
            {brandName && (
              <>
                {categoryName && <span className="text-border">•</span>}
                <span>{brandName}</span>
              </>
            )}
          </div>
        </div>

        {/* 5. Inventory (Batches, Left aligned) */}
        <div className="hidden md:flex flex-col w-40 sm:w-48 shrink-0 text-left">
          <Button
            variant="secondary"
            size="sm"
            className="h-auto py-1 px-2.5 text-foreground whitespace-nowrap text-xs font-medium bg-muted/50 hover:bg-muted border border-border/40 transition-colors w-fit cursor-pointer"
            onClick={(e) => handleAction(e, onViewBatches)}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-xs font-medium text-foreground whitespace-nowrap">
                  {batchesCount} {batchesCount === 1 ? (isBangla ? 'ব্যাচ' : 'Batch') : (isBangla ? 'ব্যাচ' : 'Batches')} • {branchesCount} {branchesCount === 1 ? (isBangla ? 'শাখা' : 'Branch') : (isBangla ? 'শাখা' : 'Branches')}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isBangla ? 'ব্যাচসমূহ দেখুন' : 'View Batches'}</p>
              </TooltipContent>
            </Tooltip>
          </Button>
        </div>

        {/* 6. Quantity (Left aligned) */}
        <div className="w-28 sm:w-36 shrink-0 min-w-0 text-left space-y-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="font-bold text-foreground text-sm whitespace-nowrap cursor-help">
                {item.currentStock ?? 0} <span className="text-xs font-normal text-muted-foreground">{unit}</span>
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isBangla ? `মোট স্টক: ${item.currentStock ?? 0} ${unit}` : `Total Stock: ${item.currentStock ?? 0} ${unit}`}</p>
            </TooltipContent>
          </Tooltip>
          <p className="text-xs text-muted-foreground/80 whitespace-nowrap">
            Purchase {formatCurrency(item.costPrice)}
          </p>
        </div>

        {/* 7. Action Buttons (Right aligned) */}
        <div className="flex items-center justify-end gap-1 w-36 sm:w-44 shrink-0 text-right opacity-80 group-hover:opacity-100 transition-opacity">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="cursor-pointer"
                onClick={(e) => handleAction(e, onView)}
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
                onClick={(e) => handleAction(e, onViewBatches)}
              >
                <Layers className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{isBangla ? 'ব্যাচসমূহ দেখুন' : 'View Batches'}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="cursor-pointer"
                onClick={(e) => handleAction(e, () => router.push(`/inventory/${item.id}/edit`))}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{isBangla ? 'সম্পাদনা' : 'Edit'}</p>
            </TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon-sm" className="cursor-pointer">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{isBangla ? 'আরও' : 'More'}</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="cursor-pointer" onClick={(e) => handleAction(e, onViewBatches)}>
                <Layers className="h-4 w-4 mr-2" />
                <span>{isBangla ? 'ব্যাচসমূহ দেখুন' : 'View Batches'}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={(e) => handleAction(e, () => toast.info(isBangla ? 'পণ্যটি ডুপ্লিকেট করা হয়েছে' : 'Product duplicated'))}>
                <Copy className="h-4 w-4 mr-2" />
                <span>{isBangla ? 'ডুপ্লিকেট' : 'Duplicate'}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={(e) => handleAction(e, () => toast.info(isBangla ? 'পণ্যটি আর্কাইভ করা হয়েছে' : 'Product archived'))}>
                <Archive className="h-4 w-4 mr-2" />
                <span>{isBangla ? 'আর্কাইভ' : 'Archive'}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={(e) => handleAction(e, () => router.push(`/reports/purchase`))}>
                <FileText className="h-4 w-4 mr-2" />
                <span>{isBangla ? 'ক্রয় ইতিহাস' : 'Purchase History'}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={(e) => handleAction(e, () => router.push(`/reports/sales`))}>
                <Receipt className="h-4 w-4 mr-2" />
                <span>{isBangla ? 'বিক্রয় ইতিহাস' : 'Sales History'}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={(e) => handleAction(e, () => toast.info(isBangla ? 'বারকোড প্রিন্ট প্রস্তুত' : 'Printing Barcode...'))}>
                <Printer className="h-4 w-4 mr-2" />
                <span>{isBangla ? 'বারকোড প্রিন্ট' : 'Print Barcode'}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={(e) => handleAction(e, () => toast.info(isBangla ? 'কিউআর কোড প্রিন্ট প্রস্তুত' : 'Printing QR Code...'))}>
                <QrCode className="h-4 w-4 mr-2" />
                <span>{isBangla ? 'QR কোড প্রিন্ট' : 'Print QR Code'}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer"
                onClick={handleDeleteButtonClick}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                <span>{isBangla ? 'মুছে ফেলুন' : 'Delete'}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </TooltipProvider>
  );
});



