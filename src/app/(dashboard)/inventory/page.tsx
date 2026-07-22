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
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <Package className="h-7 w-7 text-primary shrink-0" />
              {t('inventory.title')}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground/80 mt-1 whitespace-nowrap">
              {isBangla ? 'পণ্য ও স্টক ব্যবস্থাপনা' : 'Product & stock management'}
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            {/* Settings Dropdown — disabled, coming soon */}
            <Button
              variant="ghost"
              size="icon"
              disabled
              title={isBangla ? 'শীঘ্রই আসছে' : 'Coming soon'}
              className="opacity-50 cursor-not-allowed h-10 w-10 rounded-xl"
            >
              <Settings className="h-4 w-4" />
            </Button>

            <Button
              onClick={() => router.push('/inventory/new')}
              className="shrink-0 h-10 px-4 rounded-xl font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span className="whitespace-nowrap">{t('inventory.addItem')}</span>
            </Button>
          </div>
        </div>

        {/* Premium SaaS ERP KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* Multi-Price Summary Container */}
        {multiPriceItems > 0 && (
          <div className="rounded-2xl border border-border/60 bg-gradient-to-b from-card/90 via-card/75 to-card/60 backdrop-blur-md p-4 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground whitespace-nowrap">
                  {isBangla ? 'মাল্টি-প্রাইস পণ্য' : 'Multi-Price Items'}
                </h3>
                <p className="text-xs text-muted-foreground/80 whitespace-nowrap">
                  {isBangla
                    ? `${multiPriceItems}টি পণ্যে একাধিক মূল্য সেট করা আছে`
                    : `${multiPriceItems} items have multiple price tiers`}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {wholesaleItems > 0 && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo/10 border border-indigo/20 whitespace-nowrap">
                    <Package className="h-3.5 w-3.5 text-indigo shrink-0" />
                    <span className="text-xs font-medium text-indigo">{wholesaleItems}</span>
                    <span className="text-xs text-muted-foreground">{isBangla ? 'পাইকারি' : 'Wholesale'}</span>
                  </div>
                )}
                {vipItems > 0 && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-warning/10 border border-warning/20 whitespace-nowrap">
                    <Crown className="h-3.5 w-3.5 text-warning shrink-0" />
                    <span className="text-xs font-medium text-warning">{vipItems}</span>
                    <span className="text-xs text-muted-foreground">VIP</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Filters Container */}
        <div className="rounded-2xl border border-border/60 bg-gradient-to-b from-card/90 via-card/75 to-card/60 backdrop-blur-md p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70 shrink-0" />
              <Input
                placeholder={isBangla ? 'পণ্যের নাম, SKU বা বারকোড খুঁজুন...' : 'Search by name, SKU or barcode...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 rounded-xl bg-background/80 hover:bg-background border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-xs sm:text-sm placeholder:text-muted-foreground/60"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px] h-10 rounded-xl bg-background/80 hover:bg-background border-border/60 focus:ring-2 focus:ring-primary/20 transition-all text-xs sm:text-sm">
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
              <SelectTrigger className="w-full md:w-[150px] h-10 rounded-xl bg-background/80 hover:bg-background border-border/60 focus:ring-2 focus:ring-primary/20 transition-all text-xs sm:text-sm">
                <SelectValue placeholder={isBangla ? 'স্টক' : 'Stock'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isBangla ? 'সব' : 'All'}</SelectItem>
                <SelectItem value="low">{isBangla ? 'স্টক কম' : 'Low Stock'}</SelectItem>
                <SelectItem value="out">{isBangla ? 'স্টক শেষ' : 'Out of Stock'}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="w-full md:w-[170px] h-10 rounded-xl bg-background/80 hover:bg-background border-border/60 focus:ring-2 focus:ring-primary/20 transition-all text-xs sm:text-sm">
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
              <SelectTrigger className="w-full md:w-[170px] h-10 rounded-xl bg-background/80 hover:bg-background border-border/60 focus:ring-2 focus:ring-primary/20 transition-all text-xs sm:text-sm">
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
        </div>

        {/* Items List Container */}
        <div className="rounded-2xl border border-border/60 bg-[#12161f] shadow-sm overflow-hidden">
          <div className="px-6 pt-5 pb-3">
            <h3 className="text-base font-bold text-foreground">
              {isBangla ? 'পণ্য তালিকা' : 'Item List'}
            </h3>
          </div>

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
                <Button onClick={() => router.push('/inventory/new')} className="rounded-xl">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="whitespace-nowrap">{t('inventory.addItem')}</span>
                </Button>
              }
            />
          ) : (
            <div>
              {/* Column Header Bar - Left Aligned Except Actions */}
              <div className="flex items-center justify-between px-6 py-3 bg-[#161a23]/60 text-xs font-medium text-muted-foreground/80 border-b border-border/40 gap-4">
                <div className="w-10 text-left shrink-0">SL.</div>
                <div className="w-24 sm:w-28 text-left shrink-0">SKU</div>
                <div className="w-12 text-left shrink-0">{isBangla ? 'ছবি' : 'Image'}</div>
                <div className="flex-1 text-left min-w-0">{isBangla ? 'পণ্যের নাম' : 'Product Name'}</div>
                <div className="hidden md:block w-44 sm:w-52 text-left shrink-0">{isBangla ? 'ব্যাচ' : 'Batches'}</div>
                <div className="w-28 sm:w-36 text-left shrink-0">{isBangla ? 'পরিমাণ' : 'Quantity'}</div>
                <div className="text-right w-36 sm:w-44 shrink-0">{isBangla ? 'অ্যাকশন' : 'Actions'}</div>
              </div>
              <ScrollArea className="h-[520px]">
                <div className="divide-y divide-border/30">
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
        </div>
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
                    {selectedItem.currentStock ?? 0} {selectedItem.unit || 'pcs'}
                  </span>
                }
              />
              <DetailRow
                label={isBangla ? 'ক্রয় মূল্য' : 'Purchase Price'}
                value={formatCurrency(selectedItem.costPrice)}
              />
              <DetailRow
                label={isBangla ? 'বিক্রয় মূল্য' : 'Selling Price'}
                value={formatCurrency(selectedItem.sellingPrice)}
              />
              <DetailRow
                label={isBangla ? 'বারকোড' : 'Barcode'}
                value={selectedItem.barcode || '—'}
              />
            </DetailSection>
          </>
        )}
      </DetailModal>

      {/* View Batches Modal */}
      {selectedBatchItem && (
        <BatchesModal
          isOpen={!!selectedBatchItem}
          onClose={() => setSelectedBatchItem(null)}
          item={selectedBatchItem}
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

      <div
        className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors cursor-default group gap-4 border-b border-border/30"
        style={{ animationDelay: `${index * 30}ms` }}
        onClick={handleRowClick}
      >
        {/* 1. SL. (Left aligned) */}
        <div className="w-10 shrink-0 text-left text-xs font-mono font-medium text-muted-foreground/80">
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* 2. Product SKU (Left aligned) */}
        <div className="w-24 sm:w-28 shrink-0 min-w-0 text-left">
          <span className="text-xs font-mono text-muted-foreground/60 truncate block" title={item.sku}>
            {item.sku ? item.sku : '—'}
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
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-3 flex-wrap">
            <p className="font-bold text-foreground text-sm leading-snug">{item.name}</p>

            <span
              className={cn(
                "text-[11px] font-medium tracking-wide whitespace-nowrap",
                stockStatus.variant === 'destructive' ? "text-rose-500" :
                stockStatus.variant === 'warning' ? "text-amber-400" : "text-slate-300"
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

        {/* 5. Inventory (Batches, Left aligned) */}
        <div className="hidden md:flex flex-col w-44 sm:w-52 shrink-0 text-left">
          <button
            type="button"
            className="h-auto py-1 px-3.5 text-foreground whitespace-nowrap text-xs font-medium bg-[#1c222e] hover:bg-[#232b3a] border border-border/50 rounded-full transition-colors w-fit cursor-pointer flex items-center"
            onClick={(e) => handleAction(e, onViewBatches)}
          >
            <span className="text-xs font-medium text-slate-200">
              {batchesCount} {batchesCount === 1 ? (isBangla ? 'ব্যাচ' : 'Batch') : (isBangla ? 'ব্যাচ' : 'Batches')} • {branchesCount} {branchesCount === 1 ? (isBangla ? 'শাখা' : 'Branch') : (isBangla ? 'শাখা' : 'Branches')}
            </span>
          </button>
        </div>

        {/* 6. Quantity (Left aligned) */}
        <div className="w-28 sm:w-36 shrink-0 min-w-0 text-left space-y-0.5">
          <p className="text-sm font-extrabold text-foreground whitespace-nowrap">
            {item.currentStock ?? 0} <span className="text-xs font-normal text-muted-foreground">{unit}</span>
          </p>
          <p className="text-xs text-muted-foreground/70 whitespace-nowrap">
            Purchase {formatCurrency(item.costPrice)}
          </p>
        </div>

        {/* 7. Action Buttons (Right aligned) */}
        <div className="flex items-center justify-end gap-1 w-36 sm:w-44 shrink-0 text-right">
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

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
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
                size="icon"
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                  >
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
