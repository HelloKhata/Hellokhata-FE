'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Package,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { useRouter } from 'next/navigation';
import { useGetBatches, useGetBatchesStatus } from '@/hooks/api/useBatches';
import { useBranches } from '@/hooks/queries';
import {
  BatchHeader,
  BatchToolbar,
  BatchRow,
  BatchDetailSheet,
  BulkActionBar,
  BatchEmptyState,
  BatchLoadingSkeleton,
  type BatchRowData,
  type StatusTab,
} from '@/components/inventory/batches';
import type { BatchStatus, BatchSort } from '@/services/batches.services';

export default function BatchesPage() {
  const { isBangla } = useAppTranslation();
  const router = useRouter();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusTab>('all');
  const [branchFilter, setBranchFilter] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<BatchSort>('received_desc');
  const [page, setPage] = useState(1);
  const LIMIT = 30;

  // Multi-select state
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Batch Detail Sheet
  const [inspectingBatchId, setInspectingBatchId] = useState<string | null>(null);
  const [inspectingFallback, setInspectingFallback] = useState<BatchRowData | null>(null);

  // Data fetching
  const { data: branches = [] } = useBranches();
  const isMultiBranch = branches.length > 1;

  const { data: batchesStatusData } = useGetBatchesStatus();
  const batchesStatus = batchesStatusData?.data;

  const { data: batchesData, isLoading, isError, refetch } = useGetBatches({
    search: debouncedSearch || undefined,
    status: statusFilter === 'all' ? undefined : (statusFilter as BatchStatus),
    branchId: branchFilter.trim() ? branchFilter : undefined,
    sort: sortOrder,
    page,
    limit: LIMIT,
  });

  // Map API response items into robust BatchRowData format
  const batches: BatchRowData[] = useMemo(() => {
    const raw = batchesData?.data || [];
    return raw.map((b: any) => ({
      id: b.id,
      batchNumber: b.batchNumber,
      itemId: b.itemId,
      itemName: b.itemName || b.item?.name,
      itemImage: b.item?.image,
      unit: b.item?.unit || 'pcs',
      category: b.item?.category,
      quantity: b.quantity,
      quantityReceived: b.quantityReceived,
      costPrice: b.costPrice,
      sellingPrice: b.sellingPrice,
      expiryDate: b.expiryDate,
      manufactureDate: b.manufactureDate,
      receivedDate: b.receivedDate || b.createdAt,
      supplier: b.supplier,
      branchName: b.branch?.name || b.branchName,
      branchId: b.branchId,
      barcode: b.barcode,
      barcodeType: b.barcodeType || b.item?.barcodeType,
      manufacturerBarcode: b.manufacturerBarcode || b.item?.manufacturerBarcode,
      source: b.source,
      hasExpiry: b.hasExpiry ?? b.item?.hasExpiry,
      isExpired: b.isExpired,
      isExpiringSoon: b.isExpiringSoon,
      isActive: b.isActive,
      daysUntilExpiry: b.daysUntilExpiry,
      createdAt: b.createdAt,
    }));
  }, [batchesData]);

  const totalBatchesCount = batchesData?.meta?.total ?? batches.length;
  const totalPages = Math.ceil(totalBatchesCount / LIMIT);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, branchFilter, sortOrder]);

  // Select handlers
  const handleSelectToggle = useCallback((id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedIds(new Set());
    setSelectMode(false);
  }, []);

  const selectedBatches = useMemo(
    () => batches.filter((b) => selectedIds.has(b.id)),
    [batches, selectedIds]
  );

  // Batch item click handler
  const handleBatchTap = useCallback((batch: BatchRowData) => {
    if (selectMode) {
      handleSelectToggle(batch.id, !selectedIds.has(batch.id));
      return;
    }
    setInspectingFallback(batch);
    setInspectingBatchId(batch.id);
  }, [selectMode, selectedIds, handleSelectToggle]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setStatusFilter('all');
    setBranchFilter('');
    setSortOrder('received_desc');
    setPage(1);
  };

  const hasActiveFilters = !!(debouncedSearch || statusFilter !== 'all' || branchFilter.trim());

  return (
    <div className="min-h-screen space-y-4 pb-20">
      {/* Page Header */}
      <BatchHeader
        totalBatches={batchesStatus?.totalBatches || totalBatchesCount}
        selectMode={selectMode}
        onToggleSelectMode={() => {
          setSelectMode(!selectMode);
          if (selectMode) handleClearSelection();
        }}
        onRefresh={() => refetch()}
        onAddBatch={() => router.push('/inventory/new')}
      />

      <div className="mx-auto px-4 sm:px-6 space-y-4">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="border border-border/60 shadow-xs">
            <CardContent className="p-3.5">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                  <Package className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground font-medium">
                    {isBangla ? 'মোট ব্যাচ' : 'Total Batches'}
                  </p>
                  <p className="text-lg font-bold font-mono text-foreground">
                    {batchesStatus?.totalBatches || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-rose-500/20 bg-rose-50/20 dark:bg-rose-950/10 shadow-xs">
            <CardContent className="p-3.5">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-rose-500/15 flex items-center justify-center shrink-0">
                  <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <p className="text-[11px] text-rose-700 dark:text-rose-400 font-medium">
                    {isBangla ? 'মেয়াদোত্তীর্ণ' : 'Expired'}
                  </p>
                  <p className="text-lg font-bold font-mono text-rose-700 dark:text-rose-400">
                    {batchesStatus?.expired || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-amber-500/20 bg-amber-50/20 dark:bg-amber-950/10 shadow-xs">
            <CardContent className="p-3.5">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                    {isBangla ? '৩০ দিনের মধ্যে' : 'Expiring Soon'}
                  </p>
                  <p className="text-lg font-bold font-mono text-amber-700 dark:text-amber-400">
                    {batchesStatus?.expiringIn30Days || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/60 shadow-xs">
            <CardContent className="p-3.5">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground font-medium">
                    {isBangla ? 'সক্রিয় ব্যাচ' : 'Active Batches'}
                  </p>
                  <p className="text-lg font-bold font-mono text-foreground">
                    {batchesStatus?.activeBatches || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search + Filter Toolbar */}
        <BatchToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          branchFilter={branchFilter}
          onBranchFilterChange={setBranchFilter}
          branches={branches}
          isMultiBranch={isMultiBranch}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
        />

        {/* Batch Card List */}
        {isLoading ? (
          <BatchLoadingSkeleton />
        ) : isError ? (
          <BatchEmptyState type="error" onAction={() => refetch()} />
        ) : batches.length === 0 ? (
          hasActiveFilters ? (
            <BatchEmptyState type="filtered_empty" onResetFilters={handleResetFilters} />
          ) : (
            <BatchEmptyState type="no_data" onAction={() => router.push('/purchases/new')} />
          )
        ) : (
          <>
            <div className="space-y-2">
              {batches.map((batch) => (
                <BatchRow
                  key={batch.id}
                  batch={batch}
                  showBranch={isMultiBranch}
                  isSelectable={selectMode}
                  isSelected={selectedIds.has(batch.id)}
                  onSelect={handleSelectToggle}
                  onTap={handleBatchTap}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 text-xs">
                <span className="text-muted-foreground font-mono">
                  Showing {(page - 1) * LIMIT + 1} - {Math.min(page * LIMIT, totalBatchesCount)} of {totalBatchesCount}
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="h-8 text-xs gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    {isBangla ? 'আগের' : 'Previous'}
                  </Button>

                  <span className="font-mono font-semibold px-2">
                    {page} / {totalPages}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="h-8 text-xs gap-1 cursor-pointer"
                  >
                    {isBangla ? 'পরের' : 'Next'}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Batch Detail Panel */}
      <BatchDetailSheet
        batchId={inspectingBatchId}
        isOpen={!!inspectingBatchId}
        onClose={() => {
          setInspectingBatchId(null);
          setInspectingFallback(null);
        }}
        fallbackBatch={inspectingFallback}
      />

      {/* Sticky Bulk Action Bar */}
      <BulkActionBar
        selectedBatches={selectedBatches}
        onClearSelection={handleClearSelection}
      />
    </div>
  );
}
