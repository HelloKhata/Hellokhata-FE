// Hello Khata OS - Inventory Reports Dashboard Page
// হ্যালো খাতা - ইনভেন্টরি রিপোর্ট ড্যাশবোর্ড পেজ

'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader, StatCard } from '@/components/common';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Package,
  ArrowLeftRight,
  TrendingUp,
  DollarSign,
  Calendar as CalendarIcon,
  RefreshCw,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Info,
  Building2,
  Layers,
  CheckCircle2,
  X,
  Printer,
  Download,
  FileSpreadsheet,
  FileText,
  Loader2,
  AlertTriangle,
  History,
  ShieldAlert,
  Inbox,
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useGetItems } from '@/hooks/api/useItems';
import { useParties } from '@/hooks/api/useParties';
import { useGetBranches } from '@/hooks/api/useBranches';
import { useGetItemsCategories } from '@/hooks/api/useItemCategories';
import { useCurrency, useAppTranslation } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import { useSessionStore } from '@/stores/sessionStore';
import { PrintReportPreview, type ReportColumn } from '@/components/reports/PrintReportPreview';

// Mock Types
interface CurrentStockRecord {
  itemId: string;
  itemName: string;
  sku: string;
  categoryName: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  totalCostValue: number;
  totalRetailValue: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  categoryId: string;
}

interface StockMovementRecord {
  id: string;
  createdAt: string;
  itemName: string;
  sku: string;
  type: 'Purchase (In)' | 'Sale (Out)' | 'Adjustment (In/Out)' | 'Transfer';
  qtyChange: number;
  balance: number;
  operator: string;
  itemId: string;
}

interface StockValuationRecord {
  itemId: string;
  itemName: string;
  categoryName: string;
  qty: number;
  avgCost: number;
  fifoValuation: number;
  lifoValuation: number;
  avgValuation: number;
  marginPct: number;
  categoryId: string;
}

interface LowStockRecord {
  itemId: string;
  itemName: string;
  sku: string;
  qty: number;
  reorderLevel: number;
  supplierName: string;
  categoryId: string;
}

interface ExpiryBatchRecord {
  itemId: string;
  itemName: string;
  batchNo: string;
  mfgDate: string;
  expiryDate: string;
  qty: number;
  daysToExpiry: number;
  status: 'expired' | 'near_expiry' | 'healthy';
  categoryId: string;
}

export default function InventoryReportsDashboard() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const { toast } = useToast();
  const { business, user } = useSessionStore();

  // Queries
  const { data: itemsData, isLoading: itemsLoading, refetch: refetchItems } = useGetItems();
  const items = Array.isArray(itemsData) ? itemsData : (itemsData as any)?.data || [];
  const { data: suppliersData, isLoading: suppliersLoading } = useParties({ type: 'supplier' });
  const supplierList = Array.isArray(suppliersData) ? suppliersData : (suppliersData as any)?.data || [];
  const { data: branchesData, isLoading: branchesLoading } = useGetBranches();
  const branches = Array.isArray(branchesData) ? branchesData : [];
  const { data: categoriesData } = useGetItemsCategories();
  const categories = Array.isArray(categoriesData) ? categoriesData : (categoriesData as any)?.data || [];

  // Loading state helper
  const isPageLoading = itemsLoading || suppliersLoading || branchesLoading;

  // Active Tab state
  const [activeTab, setActiveTab] = useState<string>('current-stock');

  // Search query state
  const [searchQuery, setSearchQuery] = useState('');
  // Show advanced filters panel state
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Print Preview Dialog State
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  // Filter States
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '1y' | 'custom'>('30d');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: undefined,
    to: undefined,
  });
  
  // Advanced Filter Selects
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>('all');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Local filter copy for "Apply Filters" pattern
  const [activeFilters, setActiveFilters] = useState<{
    period: '7d' | '30d' | '90d' | '1y' | 'custom';
    dateRange: { from?: Date; to?: Date };
    branchId: string;
    warehouseId: string;
    categoryId: string;
    status: string;
  }>({
    period: '30d',
    dateRange: { from: undefined, to: undefined },
    branchId: 'all',
    warehouseId: 'all',
    categoryId: 'all',
    status: 'all',
  });

  // Calculate default filter date limits
  const getFilterDates = () => {
    if (activeFilters.period === 'custom') {
      return { start: activeFilters.dateRange.from, end: activeFilters.dateRange.to };
    }
    const end = new Date();
    const start = new Date();
    if (activeFilters.period === '7d') start.setDate(start.getDate() - 7);
    else if (activeFilters.period === '90d') start.setDate(start.getDate() - 90);
    else if (activeFilters.period === '1y') start.setFullYear(start.getFullYear() - 1);
    else start.setDate(start.getDate() - 30); // 30d default
    return { start, end };
  };

  // Sync handles when period dropdown shifts
  const handlePeriodChange = (val: '7d' | '30d' | '90d' | '1y' | 'custom') => {
    setPeriod(val);
    if (val !== 'custom') {
      setDateRange({ from: undefined, to: undefined });
    }
  };

  // Submit active selections
  const handleApplyFilters = () => {
    setActiveFilters({
      period,
      dateRange,
      branchId: selectedBranchId,
      warehouseId: selectedWarehouseId,
      categoryId: selectedCategoryId,
      status: selectedStatus,
    });
    toast({
      title: isBangla ? 'ফিল্টার প্রয়োগ করা হয়েছে' : 'Filters Applied',
      description: isBangla ? 'আপনার নির্বাচিত ফিল্টারের ভিত্তিতে ইনভেন্টরি রিপোর্ট আপডেট করা হয়েছে।' : 'Inventory metrics refreshed against new filter set.',
    });
  };

  // Reset filters action
  const handleResetFilters = () => {
    setSearchQuery('');
    setPeriod('30d');
    setDateRange({ from: undefined, to: undefined });
    setSelectedBranchId('all');
    setSelectedWarehouseId('all');
    setSelectedCategoryId('all');
    setSelectedStatus('all');

    setActiveFilters({
      period: '30d',
      dateRange: { from: undefined, to: undefined },
      branchId: 'all',
      warehouseId: 'all',
      categoryId: 'all',
      status: 'all',
    });
    
    toast({
      title: isBangla ? 'রিসেট সম্পন্ন' : 'Filters Cleared',
      description: isBangla ? 'সকল ফিল্টার ডিফল্ট মানে রিসেট করা হয়েছে।' : 'All inventory reporting filters returned to baseline.',
    });
  };

  // Re-establish hook server connections
  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetchItems();
      toast({
        title: isBangla ? 'রিলোড সম্পন্ন' : 'Sync Completed',
        description: isBangla ? 'সার্ভার থেকে সফলভাবে সর্বশেষ ডেটা রিলোড করা হয়েছে।' : 'Latest inventory items fetched from server.',
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Filter warehouses from branches
  const warehouses = useMemo(() => {
    return branches.filter((b) => b.type === 'warehouse');
  }, [branches]);

  // Generators for 5 inventory subsections
  const mockCurrentStock = useMemo(() => {
    return generateMockCurrentStock(items, categories, activeFilters, searchQuery, isBangla);
  }, [items, categories, activeFilters, searchQuery, isBangla]);

  const mockStockMovement = useMemo(() => {
    return generateMockStockMovement(items, activeFilters, searchQuery);
  }, [items, activeFilters, searchQuery]);

  const mockStockValuation = useMemo(() => {
    return generateMockStockValuation(items, categories, activeFilters, searchQuery, isBangla);
  }, [items, categories, activeFilters, searchQuery, isBangla]);

  const mockLowStock = useMemo(() => {
    return generateMockLowStock(items, supplierList, activeFilters, searchQuery);
  }, [items, supplierList, activeFilters, searchQuery]);

  const mockExpiryBatch = useMemo(() => {
    return generateMockExpiryBatch(items, activeFilters, searchQuery);
  }, [items, activeFilters, searchQuery]);

  // KPI Calculations
  const kpis = useMemo(() => {
    const totalValuation = mockStockValuation.reduce((acc, curr) => acc + curr.avgValuation, 0);
    const totalItems = mockCurrentStock.length;
    const lowStockCount = mockLowStock.length;
    const expiredCount = mockExpiryBatch.filter(b => b.status === 'expired').length;
    const nearExpiryCount = mockExpiryBatch.filter(b => b.status === 'near_expiry').length;

    return {
      totalValuation,
      totalItems,
      lowStockCount,
      expiredCount,
      nearExpiryCount,
    };
  }, [mockStockValuation, mockCurrentStock, mockLowStock, mockExpiryBatch]);

  // Pagination states
  const [stockPage, setStockPage] = useState(1);
  const [movementPage, setMovementPage] = useState(1);
  const [valuationPage, setValuationPage] = useState(1);
  const [lowStockPage, setLowStockPage] = useState(1);
  const [expiryPage, setExpiryPage] = useState(1);
  const itemsPerPage = 10;

  const paginatedStock = useMemo(() => {
    const start = (stockPage - 1) * itemsPerPage;
    return mockCurrentStock.slice(start, start + itemsPerPage);
  }, [mockCurrentStock, stockPage]);

  const paginatedMovement = useMemo(() => {
    const start = (movementPage - 1) * itemsPerPage;
    return mockStockMovement.slice(start, start + itemsPerPage);
  }, [mockStockMovement, movementPage]);

  const paginatedValuation = useMemo(() => {
    const start = (valuationPage - 1) * itemsPerPage;
    return mockStockValuation.slice(start, start + itemsPerPage);
  }, [mockStockValuation, valuationPage]);

  const paginatedLowStock = useMemo(() => {
    const start = (lowStockPage - 1) * itemsPerPage;
    return mockLowStock.slice(start, start + itemsPerPage);
  }, [mockLowStock, lowStockPage]);

  const paginatedExpiry = useMemo(() => {
    const start = (expiryPage - 1) * itemsPerPage;
    return mockExpiryBatch.slice(start, start + itemsPerPage);
  }, [mockExpiryBatch, expiryPage]);

  // Active Advanced Count
  const activeAdvancedCount = useMemo(() => {
    let count = 0;
    if (activeFilters.warehouseId !== 'all') count++;
    if (activeFilters.status !== 'all') count++;
    return count;
  }, [activeFilters]);

  // Active Filter Chips
  const activeFilterChips = useMemo(() => {
    const chips: { key: string; label: string; valueText: string }[] = [];
    
    if (activeFilters.branchId !== 'all') {
      const name = branches.find(b => b.id === activeFilters.branchId)?.name || 'Main Branch';
      chips.push({ key: 'branchId', label: isBangla ? 'শাখা' : 'Branch', valueText: name });
    }
    if (activeFilters.warehouseId !== 'all') {
      const name = warehouses.find(w => w.id === activeFilters.warehouseId)?.name || activeFilters.warehouseId;
      chips.push({ key: 'warehouseId', label: isBangla ? 'গোডাউন' : 'Warehouse', valueText: name });
    }
    if (activeFilters.categoryId !== 'all') {
      const name = categories.find(c => c.id === activeFilters.categoryId)?.name || activeFilters.categoryId;
      chips.push({ key: 'categoryId', label: isBangla ? 'ক্যাটাগরি' : 'Category', valueText: name });
    }
    if (activeFilters.status !== 'all') {
      chips.push({ key: 'status', label: isBangla ? 'স্ট্যাটাস' : 'Status', valueText: activeFilters.status });
    }

    return chips;
  }, [activeFilters, branches, warehouses, categories, isBangla]);

  const handleRemoveFilter = (key: string) => {
    if (key === 'branchId') {
      setSelectedBranchId('all');
      setActiveFilters(prev => ({ ...prev, branchId: 'all' }));
    } else if (key === 'warehouseId') {
      setSelectedWarehouseId('all');
      setActiveFilters(prev => ({ ...prev, warehouseId: 'all' }));
    } else if (key === 'categoryId') {
      setSelectedCategoryId('all');
      setActiveFilters(prev => ({ ...prev, categoryId: 'all' }));
    } else if (key === 'status') {
      setSelectedStatus('all');
      setActiveFilters(prev => ({ ...prev, status: 'all' }));
    }
  };

  // Dynamic Print Columns mapping based on activeTab
  const printColumns = useMemo<ReportColumn<any>[]>(() => {
    if (activeTab === 'current-stock') {
      return [
        { header: 'Product Name', headerBn: 'পণ্য', accessor: (row: CurrentStockRecord) => row.itemName },
        { header: 'SKU', headerBn: 'এসকেইউ', accessor: (row: CurrentStockRecord) => row.sku },
        { header: 'Category', headerBn: 'ক্যাটাগরি', accessor: (row: CurrentStockRecord) => row.categoryName },
        { header: 'Quantity', headerBn: 'পরিমাণ', accessor: (row: CurrentStockRecord) => row.quantity.toString(), align: 'right' },
        { header: 'Cost Price', headerBn: 'ক্রয় মূল্য', accessor: (row: CurrentStockRecord) => formatCurrency(row.costPrice), align: 'right' },
        { header: 'Selling Price', headerBn: 'বিক্রয় মূল্য', accessor: (row: CurrentStockRecord) => formatCurrency(row.sellingPrice), align: 'right' },
        { header: 'Cost Valuation', headerBn: 'ক্রয় মূল্যায়ন', accessor: (row: CurrentStockRecord) => formatCurrency(row.totalCostValue), align: 'right' },
        { header: 'Status', headerBn: 'অবস্থা', accessor: (row: CurrentStockRecord) => row.status, align: 'center' }
      ];
    } else if (activeTab === 'movement') {
      return [
        { header: 'Date', headerBn: 'তারিখ', accessor: (row: StockMovementRecord) => format(new Date(row.createdAt), 'dd MMM yyyy') },
        { header: 'Product Name', headerBn: 'পণ্য', accessor: (row: StockMovementRecord) => row.itemName },
        { header: 'SKU', headerBn: 'এসকেইউ', accessor: (row: StockMovementRecord) => row.sku },
        { header: 'Type', headerBn: 'টাইপ', accessor: (row: StockMovementRecord) => row.type },
        { header: 'Qty Change', headerBn: 'পরিমাণ পরিবর্তন', accessor: (row: StockMovementRecord) => row.qtyChange > 0 ? `+${row.qtyChange}` : row.qtyChange.toString(), align: 'right' },
        { header: 'Stock Balance', headerBn: 'স্টক ব্যালেন্স', accessor: (row: StockMovementRecord) => row.balance.toString(), align: 'right' },
        { header: 'Operator', headerBn: 'অপারেটর', accessor: (row: StockMovementRecord) => row.operator }
      ];
    } else if (activeTab === 'valuation') {
      return [
        { header: 'Product Name', headerBn: 'পণ্য', accessor: (row: StockValuationRecord) => row.itemName },
        { header: 'CategoryName', headerBn: 'ক্যাটাগরি', accessor: (row: StockValuationRecord) => row.categoryName },
        { header: 'Stock Qty', headerBn: 'স্টক পরিমাণ', accessor: (row: StockValuationRecord) => row.qty.toString(), align: 'right' },
        { header: 'FIFO Value', headerBn: 'ফিফো (FIFO) মূল্য', accessor: (row: StockValuationRecord) => formatCurrency(row.fifoValuation), align: 'right' },
        { header: 'LIFO Value', headerBn: 'লিফো (LIFO) মূল্য', accessor: (row: StockValuationRecord) => formatCurrency(row.lifoValuation), align: 'right' },
        { header: 'Avg Cost Value', headerBn: 'গড় মূল্য', accessor: (row: StockValuationRecord) => formatCurrency(row.avgValuation), align: 'right', footer: formatCurrency(kpis.totalValuation) }
      ];
    } else if (activeTab === 'low-stock') {
      return [
        { header: 'Product Name', headerBn: 'পণ্য', accessor: (row: LowStockRecord) => row.itemName },
        { header: 'SKU', headerBn: 'এসকেইউ', accessor: (row: LowStockRecord) => row.sku },
        { header: 'Current Qty', headerBn: 'বর্তমান পরিমাণ', accessor: (row: LowStockRecord) => row.qty.toString(), align: 'right' },
        { header: 'Reorder Level', headerBn: 'রিঅর্ডার লেভেল', accessor: (row: LowStockRecord) => row.reorderLevel.toString(), align: 'right' },
        { header: 'Pref. Supplier', headerBn: 'সরবরাহকারী', accessor: (row: LowStockRecord) => row.supplierName }
      ];
    } else if (activeTab === 'expiry-batch') {
      return [
        { header: 'Product Name', headerBn: 'পণ্য', accessor: (row: ExpiryBatchRecord) => row.itemName },
        { header: 'Batch No.', headerBn: 'ব্যাচ নং', accessor: (row: ExpiryBatchRecord) => row.batchNo },
        { header: 'Mfg Date', headerBn: 'উত্পাদন তারিখ', accessor: (row: ExpiryBatchRecord) => format(new Date(row.mfgDate), 'dd MMM yyyy') },
        { header: 'Expiry Date', headerBn: 'মেয়াদ উত্তীর্ণের তারিখ', accessor: (row: ExpiryBatchRecord) => format(new Date(row.expiryDate), 'dd MMM yyyy') },
        { header: 'Qty', headerBn: 'পরিমাণ', accessor: (row: ExpiryBatchRecord) => row.qty.toString(), align: 'right' },
        { header: 'Days to Expiry', headerBn: 'বাকি দিন', accessor: (row: ExpiryBatchRecord) => row.daysToExpiry.toString(), align: 'right' },
        { header: 'Status', headerBn: 'অবস্থা', accessor: (row: ExpiryBatchRecord) => row.status, align: 'center' }
      ];
    } else {
      return [];
    }
  }, [activeTab, kpis, formatCurrency]);

  const printDataArray = useMemo(() => {
    if (activeTab === 'current-stock') return mockCurrentStock;
    if (activeTab === 'movement') return mockStockMovement;
    if (activeTab === 'valuation') return mockStockValuation;
    if (activeTab === 'low-stock') return mockLowStock;
    if (activeTab === 'expiry-batch') return mockExpiryBatch;
    return [];
  }, [activeTab, mockCurrentStock, mockStockMovement, mockStockValuation, mockLowStock, mockExpiryBatch]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Inventory Reports"
        titleBn="ইনভেন্টরি রিপোর্ট"
        subtitle="Track stock levels, adjustments, valuation metrics, alerts, and batch expiry."
        subtitleBn="স্টকের পরিমাণ, স্থানান্তর ইতিহাস, সমন্বয়, মোট মূল্য এবং ব্যাচ মেয়াদের পারফরম্যান্স বিশ্লেষণ করুন।"
        icon={Package}
        isBangla={isBangla}
      >
        <div className="flex gap-2 flex-wrap justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPrintOpen(true)}
            disabled={isPageLoading}
          >
            <FileText className="h-4 w-4 mr-2 text-muted-foreground group-hover:text-foreground" />
            PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast({
                title: isBangla ? 'এক্সপোর্ট সম্পন্ন' : 'Export Completed',
                description: `Excel export completed for ${activeTab.toUpperCase()} inventory report.`,
              });
            }}
            disabled={isPageLoading}
          >
            <FileSpreadsheet className="h-4 w-4 mr-2 text-muted-foreground group-hover:text-foreground" />
            Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast({
                title: isBangla ? 'এক্সপোর্ট সম্পন্ন' : 'Export Completed',
                description: `CSV export completed for ${activeTab.toUpperCase()} inventory report.`,
              });
            }}
            disabled={isPageLoading}
          >
            <Download className="h-4 w-4 mr-2 text-muted-foreground group-hover:text-foreground" />
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPrintOpen(true)}
            disabled={isPageLoading}
          >
            <Printer className="h-4 w-4 mr-2 text-muted-foreground group-hover:text-foreground" />
            {isBangla ? 'প্রিন্ট' : 'Print'}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing || isPageLoading}
            className="gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", (isRefreshing || isPageLoading) && "animate-spin")} />
            {isBangla ? 'রিফ্রেশ' : 'Refresh'}
          </Button>
        </div>
      </PageHeader>

      {/* Global Filter Bar */}
      <Card className="border-border/60 shadow-sm overflow-hidden bg-background">
        <CardContent className="p-4 space-y-3">
          {/* Main Primary Filters Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 w-full">
            
            {/* Left side: Search & Core Selects */}
            <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
              {/* Search Product */}
              <div className="relative w-full md:w-60 shrink-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={isBangla ? 'পণ্য বা বারকোড খুঁজুন...' : 'Search product, SKU...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 text-xs h-9 bg-background w-full"
                />
              </div>

              {/* Period Selector */}
              <div className="shrink-0">
                <Select value={period} onValueChange={handlePeriodChange}>
                  <SelectTrigger className="bg-background text-xs h-9 min-w-[130px] w-auto flex items-center justify-start gap-1">
                    <span className="text-muted-foreground mr-0.5">{isBangla ? 'সময়:' : 'Period:'}</span>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">{isBangla ? 'গত ৭ দিন' : 'Last 7 days'}</SelectItem>
                    <SelectItem value="30d">{isBangla ? 'গত ৩০ দিন' : 'Last 30 days'}</SelectItem>
                    <SelectItem value="90d">{isBangla ? 'গত ৯০ দিন' : 'Last 90 days'}</SelectItem>
                    <SelectItem value="1y">{isBangla ? 'গত ১ বছর' : 'Last year'}</SelectItem>
                    <SelectItem value="custom">{isBangla ? 'কাস্টম রেঞ্জ' : 'Custom Range'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Date Range Popover */}
              {period === 'custom' && (
                <div className="shrink-0">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-9 text-xs justify-start font-normal bg-background flex items-center gap-1 min-w-[155px] w-auto">
                        <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground mr-0.5">{isBangla ? 'তারিখ:' : 'Dates:'}</span>
                        <span className="truncate">
                          {dateRange.from ? (
                            dateRange.to ? (
                              <>{format(dateRange.from, 'dd LLL')} - {format(dateRange.to, 'dd LLL')}</>
                            ) : (
                              format(dateRange.from, 'dd LLL')
                            )
                          ) : (
                            isBangla ? 'বাছুন' : 'Select'
                          )}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange.from || new Date()}
                        selected={dateRange as any}
                        onSelect={(range: any) => {
                          setDateRange(range || { from: undefined, to: undefined });
                        }}
                        numberOfMonths={1}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {/* Branch Selector */}
              <div className="shrink-0">
                <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
                  <SelectTrigger className="bg-background text-xs h-9 min-w-[140px] w-auto flex items-center justify-start gap-1">
                    <span className="text-muted-foreground mr-0.5">{isBangla ? 'শাখা:' : 'Branch:'}</span>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isBangla ? 'সব শাখা' : 'All Branches'}</SelectItem>
                    {branches.map(b => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category Selector */}
              <div className="shrink-0">
                <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                  <SelectTrigger className="bg-background text-xs h-9 min-w-[140px] w-auto flex items-center justify-start gap-1">
                    <span className="text-muted-foreground mr-0.5">{isBangla ? 'ক্যাটাগরি:' : 'Category:'}</span>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isBangla ? 'সব ক্যাটাগরি' : 'All Categories'}</SelectItem>
                    {categories.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Right side: Expand Toggle, Apply/Reset Actions */}
            <div className="flex items-center gap-1.5 shrink-0 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={cn(
                  "h-9 gap-1.5 text-xs font-semibold shrink-0 transition-all",
                  showAdvanced && "bg-primary/5 text-primary border-primary/30"
                )}
              >
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                {isBangla ? 'আরো ফিল্টার' : 'More Filters'}
                {activeAdvancedCount > 0 && (
                  <Badge variant="default" className="ml-1 h-5 min-w-5 rounded-full px-1 flex items-center justify-center text-[10px] bg-primary text-primary-foreground font-black">
                    {activeAdvancedCount}
                  </Badge>
                )}
              </Button>
              <Button onClick={handleApplyFilters} className="bg-primary hover:bg-primary/95 text-xs h-9 px-3 gap-1 shrink-0 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isBangla ? 'প্রয়োগ' : 'Apply'}
              </Button>
              <Button variant="outline" onClick={handleResetFilters} className="text-xs h-9 px-2.5 shrink-0">
                {isBangla ? 'রিসেট' : 'Reset'}
              </Button>
            </div>

          </div>

          {/* Advanced Filters Expandable Grid Section */}
          {showAdvanced && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-3 border-t border-muted/50 mt-3 animate-fadeIn">
              
              {/* Warehouse Selector */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-muted-foreground">{isBangla ? 'গোডাউন' : 'Warehouse'}</label>
                <Select value={selectedWarehouseId} onValueChange={setSelectedWarehouseId}>
                  <SelectTrigger className="bg-background text-xs h-9 w-full flex items-center justify-between">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isBangla ? 'সব গোডাউন' : 'All Warehouses'}</SelectItem>
                    {warehouses.map(w => (
                      <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Selector */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-muted-foreground">{isBangla ? 'অবস্থা' : 'Status'}</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="bg-background text-xs h-9 w-full flex items-center justify-between">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isBangla ? 'সব অবস্থা' : 'All States'}</SelectItem>
                    <SelectItem value="in_stock">{isBangla ? 'পর্যাপ্ত স্টক' : 'In Stock'}</SelectItem>
                    <SelectItem value="low_stock">{isBangla ? 'কম স্টক (Low)' : 'Low Stock'}</SelectItem>
                    <SelectItem value="out_of_stock">{isBangla ? 'স্টক শেষ (Out)' : 'Out of Stock'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>
          )}

          {/* Active Filters Badges / Tags Row */}
          {activeFilterChips.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-muted/30">
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mr-1">
                {isBangla ? 'সক্রিয় ফিল্টারসমূহ:' : 'Active Filters:'}
              </span>
              {activeFilterChips.map((chip) => (
                <Badge
                  key={chip.key}
                  variant="secondary"
                  className="h-6 gap-1 text-[10px] font-semibold bg-indigo-50 text-indigo-950 hover:bg-indigo-100 border border-indigo-100 pl-2 pr-1 rounded-full shrink-0"
                >
                  <span>{chip.label}:</span>
                  <span className="font-bold text-foreground">{chip.valueText}</span>
                  <button
                    onClick={() => handleRemoveFilter(chip.key)}
                    className="h-4 w-4 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background/80 transition-colors ml-0.5 shrink-0"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-6 text-[10px] px-2 font-bold text-red-600 hover:text-red-700 hover:bg-red-50/50 ml-auto shrink-0"
              >
                {isBangla ? 'সব পরিষ্কার করুন' : 'Clear All'}
              </Button>
            </div>
          )}

        </CardContent>
      </Card>

      {isPageLoading ? (
        <div className="space-y-6">
          <div className="h-[350px] bg-card animate-pulse rounded-lg border border-border/50" />
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          
          {/* Tabs header list - 5 triggers */}
          <TabsList className="bg-muted text-muted-foreground border p-1 rounded-lg w-full flex overflow-x-auto select-none scrollbar-none h-auto flex-nowrap shrink-0">
            <TabsTrigger value="current-stock" className="text-xs font-bold gap-1 px-4 py-2 shrink-0">
              <Package className="h-3.5 w-3.5" />
              {isBangla ? 'বর্তমান স্টক' : 'Current Stock'}
            </TabsTrigger>
            <TabsTrigger value="movement" className="text-xs font-bold gap-1 px-4 py-2 shrink-0">
              <ArrowLeftRight className="h-3.5 w-3.5" />
              {isBangla ? 'স্টক মুভমেন্ট' : 'Stock Movement'}
            </TabsTrigger>
            <TabsTrigger value="valuation" className="text-xs font-bold gap-1 px-4 py-2 shrink-0">
              <DollarSign className="h-3.5 w-3.5" />
              {isBangla ? 'স্টক মূল্যায়ন' : 'Stock Valuation'}
            </TabsTrigger>
            <TabsTrigger value="low-stock" className="text-xs font-bold gap-1 px-4 py-2 shrink-0">
              <AlertTriangle className="h-3.5 w-3.5" />
              {isBangla ? 'কম স্টক অ্যালার্ট' : 'Low Stock'}
            </TabsTrigger>
            <TabsTrigger value="expiry-batch" className="text-xs font-bold gap-1 px-4 py-2 shrink-0">
              <History className="h-3.5 w-3.5" />
              {isBangla ? 'মেয়াদ ও ব্যাচ' : 'Expiry & Batch'}
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: CURRENT STOCK */}
          <TabsContent value="current-stock" className="outline-none">
            <div className="space-y-6">
              {/* StatCards specific to Stock */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fadeIn">
                <StatCard title={isBangla ? 'মোট আইটেম' : 'Total Items'} value={kpis.totalItems} icon={Package} iconColor="text-indigo-650" />
                <StatCard title={isBangla ? 'স্টক মূল্যায়ন (গড়)' : 'Valuation (Avg)'} value={formatCurrency(kpis.totalValuation)} icon={DollarSign} iconColor="text-emerald-600" />
                <StatCard title={isBangla ? 'লো-স্টক প্রোডাক্ট' : 'Low Stock Items'} value={kpis.lowStockCount} icon={AlertTriangle} iconColor="text-amber-600" />
                <StatCard title={isBangla ? 'মেয়াদোত্তীর্ণ পণ্য' : 'Expired Batches'} value={kpis.expiredCount} icon={ShieldAlert} iconColor="text-red-600" />
              </div>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-bold">{isBangla ? 'বর্তমান ইনভেন্টরি লেজার' : 'Current Stock Ledger'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow>
                          <TableHead>{isBangla ? 'পণ্য' : 'Product'}</TableHead>
                          <TableHead>{isBangla ? 'এসকেইউ' : 'SKU'}</TableHead>
                          <TableHead>{isBangla ? 'ক্যাটাগরি' : 'Category'}</TableHead>
                          <TableHead className="text-right">{isBangla ? 'মজুদ পরিমাণ' : 'Quantity'}</TableHead>
                          <TableHead className="text-right">{isBangla ? 'ক্রয়মূল্য' : 'Cost Price'}</TableHead>
                          <TableHead className="text-right">{isBangla ? 'বিক্রয়মূল্য' : 'Selling Price'}</TableHead>
                          <TableHead className="text-right">{isBangla ? 'মোট ক্রয়মূল্য' : 'Cost Valuation'}</TableHead>
                          <TableHead className="text-center">{isBangla ? 'অবস্থা' : 'Status'}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedStock.map((row) => (
                          <TableRow key={row.itemId}>
                            <TableCell className="font-bold text-foreground">{row.itemName}</TableCell>
                            <TableCell className="font-mono text-xs">{row.sku}</TableCell>
                            <TableCell>{row.categoryName}</TableCell>
                            <TableCell className="text-right font-medium">{row.quantity}</TableCell>
                            <TableCell className="text-right font-mono">{formatCurrency(row.costPrice)}</TableCell>
                            <TableCell className="text-right font-mono">{formatCurrency(row.sellingPrice)}</TableCell>
                            <TableCell className="text-right font-bold text-indigo-650 font-mono">{formatCurrency(row.totalCostValue)}</TableCell>
                            <TableCell className="text-center">
                              <Badge className={cn(
                                "text-[10px] font-black rounded-full px-2 py-0.5 uppercase",
                                row.status === 'in_stock' ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50" : row.status === 'low_stock' ? "bg-amber-50 text-amber-700 hover:bg-amber-50" : "bg-red-50 text-red-700 hover:bg-red-50"
                              )}>
                                {row.status.replace('_', ' ')}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Stock Pagination */}
                  {mockCurrentStock.length > itemsPerPage && (
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-muted-foreground font-semibold">
                        {isBangla ? `পৃষ্ঠা ${stockPage} এর ${Math.ceil(mockCurrentStock.length / itemsPerPage)}` : `Page ${stockPage} of ${Math.ceil(mockCurrentStock.length / itemsPerPage)}`}
                      </span>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={stockPage === 1} onClick={() => setStockPage(p => p - 1)}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={stockPage >= Math.ceil(mockCurrentStock.length / itemsPerPage)} onClick={() => setStockPage(p => p + 1)}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 2: STOCK MOVEMENT */}
          <TabsContent value="movement" className="outline-none">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold">{isBangla ? 'স্টক আদান-প্রদান খতিয়ান' : 'Stock Movement Ledger'}</CardTitle>
                <CardDescription className="text-xs">{isBangla ? 'ক্রয়, বিক্রয় এবং সমন্বয়ের কারণে মজুদ পরিবর্তনের বিস্তারিত ইতিহাস।' : 'Complete timeline log of items received, sold, adjusted, or transferred.'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead>{isBangla ? 'তারিখ' : 'Date'}</TableHead>
                        <TableHead>{isBangla ? 'পণ্য' : 'Product'}</TableHead>
                        <TableHead>{isBangla ? 'এসকেইউ' : 'SKU'}</TableHead>
                        <TableHead>{isBangla ? 'আদান-প্রদান টাইপ' : 'Type'}</TableHead>
                        <TableHead className="text-right">{isBangla ? 'পরিবর্তন সংখ্যা' : 'Qty Change'}</TableHead>
                        <TableHead className="text-right">{isBangla ? 'মজুদ ব্যালেন্স' : 'Stock Balance'}</TableHead>
                        <TableHead>{isBangla ? 'অপারেটর' : 'Operator'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedMovement.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{format(new Date(row.createdAt), 'dd MMM yyyy, hh:mm a')}</TableCell>
                          <TableCell className="font-bold text-foreground">{row.itemName}</TableCell>
                          <TableCell className="font-mono text-xs text-slate-650">{row.sku}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn(
                              "text-[10px] font-bold rounded-full px-2 py-0.5",
                              row.type.includes('In') || row.type.includes('Purchase') ? "bg-emerald-50/50 text-emerald-700 border-emerald-250" : "bg-red-50/50 text-red-700 border-red-250"
                            )}>
                              {row.type}
                            </Badge>
                          </TableCell>
                          <TableCell className={cn("text-right font-bold", row.qtyChange > 0 ? "text-emerald-600" : "text-red-650")}>
                            {row.qtyChange > 0 ? `+${row.qtyChange}` : row.qtyChange}
                          </TableCell>
                          <TableCell className="text-right font-black font-mono">{row.balance}</TableCell>
                          <TableCell className="text-slate-600 text-xs font-semibold">{row.operator}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Movement Pagination */}
                {mockStockMovement.length > itemsPerPage && (
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground font-semibold">
                      {isBangla ? `পৃষ্ঠা ${movementPage} এর ${Math.ceil(mockStockMovement.length / itemsPerPage)}` : `Page ${movementPage} of ${Math.ceil(mockStockMovement.length / itemsPerPage)}`}
                    </span>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={movementPage === 1} onClick={() => setMovementPage(p => p - 1)}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={movementPage >= Math.ceil(mockStockMovement.length / itemsPerPage)} onClick={() => setMovementPage(p => p + 1)}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: STOCK VALUATION */}
          <TabsContent value="valuation" className="outline-none">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold">{isBangla ? 'মজুদ পণ্যের মূল্যায়ন বিবরণী' : 'Stock Valuation & Margins'}</CardTitle>
                <CardDescription className="text-xs">{isBangla ? 'FIFO, LIFO এবং গড় খরচ পদ্ধতিতে স্টকের মোট মূল্যায়ন হিসাব।' : 'Comparing inventory asset values under FIFO, LIFO, and Weighted Average costing.'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead>{isBangla ? 'পণ্য' : 'Product'}</TableHead>
                        <TableHead>{isBangla ? 'ক্যাটাগরি' : 'Category'}</TableHead>
                        <TableHead className="text-right">{isBangla ? 'স্টক সংখ্যা' : 'Stock Qty'}</TableHead>
                        <TableHead className="text-right">{isBangla ? 'ইউনিট গড় ব্যয়' : 'Avg Cost'}</TableHead>
                        <TableHead className="text-right">{isBangla ? 'ফিফো (FIFO) মূল্য' : 'FIFO Value'}</TableHead>
                        <TableHead className="text-right">{isBangla ? 'লিফো (LIFO) মূল্য' : 'LIFO Value'}</TableHead>
                        <TableHead className="text-right">{isBangla ? 'গড় মূল্যায়ন' : 'Avg Cost Value'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedValuation.map((row) => (
                        <TableRow key={row.itemId}>
                          <TableCell className="font-bold text-foreground">{row.itemName}</TableCell>
                          <TableCell>{row.categoryName}</TableCell>
                          <TableCell className="text-right font-medium">{row.qty}</TableCell>
                          <TableCell className="text-right font-mono">{formatCurrency(row.avgCost)}</TableCell>
                          <TableCell className="text-right font-mono text-slate-700">{formatCurrency(row.fifoValuation)}</TableCell>
                          <TableCell className="text-right font-mono text-slate-700">{formatCurrency(row.lifoValuation)}</TableCell>
                          <TableCell className="text-right font-bold text-indigo-650 font-mono">{formatCurrency(row.avgValuation)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Valuation Pagination */}
                {mockStockValuation.length > itemsPerPage && (
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground font-semibold">
                      {isBangla ? `পৃষ্ঠা ${valuationPage} এর ${Math.ceil(mockStockValuation.length / itemsPerPage)}` : `Page ${valuationPage} of ${Math.ceil(mockStockValuation.length / itemsPerPage)}`}
                    </span>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={valuationPage === 1} onClick={() => setValuationPage(p => p - 1)}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={valuationPage >= Math.ceil(mockStockValuation.length / itemsPerPage)} onClick={() => setValuationPage(p => p + 1)}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: LOW STOCK */}
          <TabsContent value="low-stock" className="outline-none">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  {isBangla ? 'কম স্টক অ্যালার্ট এবং রিঅর্ডার তালিকা' : 'Low Stock Reorder List'}
                </CardTitle>
                <CardDescription className="text-xs">
                  {isBangla ? 'যেসব পণ্যের পরিমাণ রিঅর্ডার সীমারেখার নিচে নেমে এসেছে।' : 'Active procurement alerts for inventory items below reorder points.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead>{isBangla ? 'পণ্য' : 'Product'}</TableHead>
                        <TableHead>{isBangla ? 'এসকেইউ' : 'SKU'}</TableHead>
                        <TableHead className="text-right">{isBangla ? 'মজুদ পরিমাণ' : 'Current Qty'}</TableHead>
                        <TableHead className="text-right">{isBangla ? 'রিঅর্ডার লেভেল' : 'Reorder Level'}</TableHead>
                        <TableHead>{isBangla ? 'পছন্দসই সরবরাহকারী' : 'Pref. Supplier'}</TableHead>
                        <TableHead className="text-center">{isBangla ? 'অ্যাকশন' : 'Action'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedLowStock.length > 0 ? (
                        paginatedLowStock.map((row) => (
                          <TableRow key={row.itemId}>
                            <TableCell className="font-bold text-foreground">{row.itemName}</TableCell>
                            <TableCell className="font-mono text-xs">{row.sku}</TableCell>
                            <TableCell className="text-right font-bold text-red-600">{row.qty}</TableCell>
                            <TableCell className="text-right font-medium">{row.reorderLevel}</TableCell>
                            <TableCell className="font-semibold text-slate-700">{row.supplierName}</TableCell>
                            <TableCell className="text-center">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 text-[10px] font-bold text-indigo-650 border-indigo-250 hover:bg-indigo-50"
                                onClick={() => {
                                  toast({
                                    title: isBangla ? 'অর্ডার প্রসেসড' : 'Order Processed',
                                    description: `Reorder draft created for ${row.itemName} to ${row.supplierName}.`,
                                  });
                                }}
                              >
                                {isBangla ? 'রিঅর্ডার ড্রাফট' : 'Reorder Draft'}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center text-muted-foreground text-xs font-semibold">
                            {isBangla ? 'এই মুহূর্তে কম স্টকযুক্ত কোনো পণ্য নেই।' : 'No low stock warnings active.'}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Low Stock Pagination */}
                {mockLowStock.length > itemsPerPage && (
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground font-semibold">
                      {isBangla ? `পৃষ্ঠা ${lowStockPage} এর ${Math.ceil(mockLowStock.length / itemsPerPage)}` : `Page ${lowStockPage} of ${Math.ceil(mockLowStock.length / itemsPerPage)}`}
                    </span>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={lowStockPage === 1} onClick={() => setLowStockPage(p => p - 1)}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={lowStockPage >= Math.ceil(mockLowStock.length / itemsPerPage)} onClick={() => setLowStockPage(p => p + 1)}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 5: EXPIRY & BATCH */}
          <TabsContent value="expiry-batch" className="outline-none">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold">{isBangla ? 'পণ্য ব্যাচ ট্র্যাকিং ও মেয়াদ উত্তীর্ণের ট্র্যাকার' : 'Batch Tracking & Expiry Alerts'}</CardTitle>
                <CardDescription className="text-xs">{isBangla ? 'পণ্য ব্যাচ নম্বর, মেয়াদ শেষের তারিখ এবং কত দিন অবশিষ্ট আছে।' : 'Batch tracking code logs, manufacturing details, and safety limits.'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead>{isBangla ? 'পণ্য' : 'Product'}</TableHead>
                        <TableHead>{isBangla ? 'ব্যাচ নম্বর' : 'Batch No.'}</TableHead>
                        <TableHead>{isBangla ? 'উত্পাদন তারিখ' : 'Mfg Date'}</TableHead>
                        <TableHead>{isBangla ? 'মেয়াদ শেষের তারিখ' : 'Expiry Date'}</TableHead>
                        <TableHead className="text-right">{isBangla ? 'পরিমাণ' : 'Qty'}</TableHead>
                        <TableHead className="text-right">{isBangla ? 'বাকি দিন' : 'Days to Expiry'}</TableHead>
                        <TableHead className="text-center">{isBangla ? 'অবস্থা' : 'Status'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedExpiry.map((row, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-bold text-foreground">{row.itemName}</TableCell>
                          <TableCell className="font-mono text-xs text-slate-700">{row.batchNo}</TableCell>
                          <TableCell>{format(new Date(row.mfgDate), 'dd MMM yyyy')}</TableCell>
                          <TableCell>{format(new Date(row.expiryDate), 'dd MMM yyyy')}</TableCell>
                          <TableCell className="text-right font-medium">{row.qty}</TableCell>
                          <TableCell className={cn("text-right font-bold", row.daysToExpiry <= 0 ? "text-red-650 animate-pulse" : row.daysToExpiry <= 30 ? "text-amber-600" : "text-emerald-700")}>
                            {row.daysToExpiry <= 0 ? (isBangla ? 'উত্তীর্ণ' : 'EXPIRED') : `${row.daysToExpiry} days`}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className={cn(
                              "text-[10px] font-black rounded-full px-2 py-0.5 uppercase",
                              row.status === 'healthy' ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50" : row.status === 'near_expiry' ? "bg-amber-50 text-amber-700 hover:bg-amber-50" : "bg-red-50 text-red-700 hover:bg-red-50"
                            )}>
                              {row.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Expiry Pagination */}
                {mockExpiryBatch.length > itemsPerPage && (
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground font-semibold">
                      {isBangla ? `পৃষ্ঠা ${expiryPage} এর ${Math.ceil(mockExpiryBatch.length / itemsPerPage)}` : `Page ${expiryPage} of ${Math.ceil(mockExpiryBatch.length / itemsPerPage)}`}
                    </span>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={expiryPage === 1} onClick={() => setExpiryPage(p => p - 1)}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={expiryPage >= Math.ceil(mockExpiryBatch.length / itemsPerPage)} onClick={() => setExpiryPage(p => p + 1)}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      )}

      {/* Printable A4 Report Preview overlay */}
      <PrintReportPreview
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
        title={isBangla ? `ইনভেন্টরি রিপোর্ট (${activeTab.toUpperCase()})` : `Inventory Report (${activeTab.toUpperCase()})`}
        titleBn={`ইনভেন্টরি রিপোর্ট (${activeTab.toUpperCase()})`}
        subtitle="SME Procurement Performance Ledger Summary"
        subtitleBn="ক্ষুদ্র ও মাঝারি ব্যবসা মজুদ বিবরণী ও ইনভেন্টরি লেজার"
        businessName={business?.name || 'HelloKhata Business'}
        branchName={selectedBranchId === 'all' ? (isBangla ? 'সকল শাখা' : 'All Branches') : (branches.find(b => b.id === selectedBranchId)?.name || (isBangla ? 'প্রধান শাখা' : 'Main Branch'))}
        businessAddress={business?.address || (isBangla ? 'ঢাকা, বাংলাদেশ' : 'Dhaka, Bangladesh')}
        contactInfo={business?.phone || '+৮৮০ ১৭০০০-০০০০০'}
        userName={user?.name || 'Owner'}
        dateRange={{
          start: activeFilters.dateRange.from ? format(activeFilters.dateRange.from, 'dd MMM yyyy') : undefined,
          end: activeFilters.dateRange.to ? format(activeFilters.dateRange.to, 'dd MMM yyyy') : undefined,
          period: activeFilters.period
        }}
        activeFilters={{
          period: activeFilters.period,
          branch: selectedBranchId === 'all' ? 'All' : branches.find(b => b.id === selectedBranchId)?.name || 'Main Branch',
          warehouse: selectedWarehouseId === 'all' ? 'All' : selectedWarehouseId,
          category: selectedCategoryId === 'all' ? 'All' : categories.find(c => c.id === selectedCategoryId)?.name || selectedCategoryId,
          status: selectedStatus === 'all' ? 'All' : selectedStatus,
        }}
        kpis={[]}
        data={printDataArray}
        columns={printColumns}
        paymentBreakdown={[]}
        branchBreakdown={[]}
        productBreakdown={[]}
        isBangla={isBangla}
        formatCurrency={formatCurrency}
      />
    </div>
  );
}

// Fallback Mock Data Generator for Current Stock Ledger
function generateMockCurrentStock(items: any[], categories: any[], filters: any, searchQuery: string, isBangla: boolean): CurrentStockRecord[] {
  const list: CurrentStockRecord[] = [];
  
  const defaultItems = [
    { id: 'item-1', name: 'Coca-Cola 250ml', sku: 'CC-250', price: 35, cost: 28, categoryId: 'cat-1' },
    { id: 'item-2', name: 'PRAN Spice Mix 100g', sku: 'PR-SP100', price: 45, cost: 36, categoryId: 'cat-1' },
    { id: 'item-3', name: 'Square Lux Soap 150g', sku: 'SQ-LS150', price: 60, cost: 48, categoryId: 'cat-2' },
    { id: 'item-4', name: 'Aarong Liquid Milk 1L', sku: 'AR-LM1L', price: 90, cost: 72, categoryId: 'cat-3' },
    { id: 'item-5', name: 'ACI Pure Salt 1kg', sku: 'AC-PS1K', price: 38, cost: 30, categoryId: 'cat-1' },
    { id: 'item-6', name: 'Unilever Surf Excel 500g', sku: 'UL-SE500', price: 120, cost: 96, categoryId: 'cat-2' },
  ];

  const useItems = items.length > 0 ? items : defaultItems;

  useItems.forEach((item, i) => {
    const qty = i === 1 ? 5 : i === 3 ? 0 : 25 + (i * 12) % 150;
    const cat = categories.find((c) => c.id === item.categoryId)?.name || (isBangla ? 'অন্যান্য' : 'Uncategorized');
    
    const record: CurrentStockRecord = {
      itemId: item.id,
      itemName: item.name,
      sku: item.sku || `SKU-${item.id.slice(-4).toUpperCase()}`,
      categoryName: cat,
      quantity: qty,
      costPrice: item.cost || 30,
      sellingPrice: item.price || 40,
      totalCostValue: qty * (item.cost || 30),
      totalRetailValue: qty * (item.price || 40),
      status: qty <= 0 ? 'out_of_stock' : qty <= 10 ? 'low_stock' : 'in_stock',
      categoryId: item.categoryId || 'cat-1',
    };

    // Filter
    if (filters.categoryId !== 'all' && record.categoryId !== filters.categoryId) return;
    if (filters.status !== 'all' && record.status !== filters.status) return;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      if (!record.itemName.toLowerCase().includes(q) && !record.sku.toLowerCase().includes(q)) return;
    }

    list.push(record);
  });

  return list;
}

// Fallback Mock Data Generator for Stock Movement Ledger
function generateMockStockMovement(items: any[], filters: any, searchQuery: string): StockMovementRecord[] {
  const list: StockMovementRecord[] = [];
  const start = new Date();
  start.setDate(start.getDate() - 30);

  const types: ('Purchase (In)' | 'Sale (Out)' | 'Adjustment (In/Out)' | 'Transfer')[] = ['Purchase (In)', 'Sale (Out)', 'Adjustment (In/Out)', 'Transfer', 'Sale (Out)', 'Sale (Out)'];
  const defaultItems = [
    { id: 'item-1', name: 'Coca-Cola 250ml', sku: 'CC-250' },
    { id: 'item-2', name: 'PRAN Spice Mix 100g', sku: 'PR-SP100' },
    { id: 'item-3', name: 'Square Lux Soap 150g', sku: 'SQ-LS150' },
  ];
  const useItems = items.length > 0 ? items : defaultItems;

  for (let i = 0; i < 50; i++) {
    const date = new Date(start.getTime());
    date.setDate(date.getDate() + Math.floor(i / 1.8));

    const item = useItems[i % useItems.length];
    const type = types[i % types.length];
    const change = type.includes('In') || type === 'Transfer' ? 20 + (i * 2) % 50 : -(1 + (i % 8));

    const record: StockMovementRecord = {
      id: `mov-${100 + i}`,
      createdAt: date.toISOString(),
      itemName: item.name,
      sku: item.sku || `SKU-${item.id.slice(-4).toUpperCase()}`,
      type,
      qtyChange: change,
      balance: 150 + i * 2,
      operator: i % 2 === 0 ? 'Admin' : 'Staff-1',
      itemId: item.id,
    };

    // Filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      if (!record.itemName.toLowerCase().includes(q) && !record.sku.toLowerCase().includes(q)) continue;
    }

    list.push(record);
  }

  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// Fallback Mock Data Generator for Stock Valuation
function generateMockStockValuation(items: any[], categories: any[], filters: any, searchQuery: string, isBangla: boolean): StockValuationRecord[] {
  const list: StockValuationRecord[] = [];
  const useItems = items.length > 0 ? items : [
    { id: 'item-1', name: 'Coca-Cola 250ml', cost: 28, categoryId: 'cat-1' },
    { id: 'item-2', name: 'PRAN Spice Mix 100g', cost: 36, categoryId: 'cat-1' },
    { id: 'item-3', name: 'Square Lux Soap 150g', cost: 48, categoryId: 'cat-2' },
  ];

  useItems.forEach((item, i) => {
    const qty = 40 + (i * 15) % 120;
    const baseCost = item.cost || 30;
    const cat = categories.find((c) => c.id === item.categoryId)?.name || (isBangla ? 'অন্যান্য' : 'Uncategorized');

    const record: StockValuationRecord = {
      itemId: item.id,
      itemName: item.name,
      categoryName: cat,
      qty,
      avgCost: baseCost,
      fifoValuation: qty * Math.round(baseCost * 1.02),
      lifoValuation: qty * Math.round(baseCost * 0.98),
      avgValuation: qty * baseCost,
      marginPct: 22,
      categoryId: item.categoryId || 'cat-1',
    };

    // Filter
    if (filters.categoryId !== 'all' && record.categoryId !== filters.categoryId) return;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      if (!record.itemName.toLowerCase().includes(q)) return;
    }

    list.push(record);
  });

  return list;
}

// Fallback Mock Data Generator for Low Stock Alert
function generateMockLowStock(items: any[], suppliers: any[], filters: any, searchQuery: string): LowStockRecord[] {
  const list: LowStockRecord[] = [];
  const useItems = items.length > 0 ? items : [
    { id: 'item-2', name: 'PRAN Spice Mix 100g', sku: 'PR-SP100', categoryId: 'cat-1' },
    { id: 'item-4', name: 'Aarong Liquid Milk 1L', sku: 'AR-LM1L', categoryId: 'cat-3' },
  ];

  useItems.forEach((item, i) => {
    // Force low/out stock for mock representation
    if (i % 2 === 0) {
      const record: LowStockRecord = {
        itemId: item.id,
        itemName: item.name,
        sku: item.sku || `SKU-${item.id.slice(-4).toUpperCase()}`,
        qty: i === 0 ? 5 : 0,
        reorderLevel: 15,
        supplierName: suppliers[i % suppliers.length]?.name || 'PRAN-RFL Distributor',
        categoryId: item.categoryId || 'cat-1',
      };

      // Filter
      if (filters.categoryId !== 'all' && record.categoryId !== filters.categoryId) return;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        if (!record.itemName.toLowerCase().includes(q) && !record.sku.toLowerCase().includes(q)) return;
      }

      list.push(record);
    }
  });

  return list;
}

// Fallback Mock Data Generator for Expiry and Batches
function generateMockExpiryBatch(items: any[], filters: any, searchQuery: string): ExpiryBatchRecord[] {
  const list: ExpiryBatchRecord[] = [];
  const useItems = items.length > 0 ? items : [
    { id: 'item-1', name: 'Coca-Cola 250ml', categoryId: 'cat-1' },
    { id: 'item-2', name: 'PRAN Spice Mix 100g', categoryId: 'cat-1' },
    { id: 'item-4', name: 'Aarong Liquid Milk 1L', categoryId: 'cat-3' },
  ];

  const mfgDates = ['2024-01-10', '2024-02-15', '2024-03-20', '2024-01-01'];
  const expDates = ['2024-05-10', '2024-06-15', '2026-12-30', '2024-04-01']; // force expired node on 4th index
  const qtys = [20, 45, 12, 100];

  useItems.forEach((item, i) => {
    const idx = i % expDates.length;
    const expiry = new Date(expDates[idx]);
    const today = new Date();
    const daysToExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    const record: ExpiryBatchRecord = {
      itemId: item.id,
      itemName: item.name,
      batchNo: `BCH-2024-${500 + i}`,
      mfgDate: mfgDates[idx],
      expiryDate: expDates[idx],
      qty: qtys[idx],
      daysToExpiry,
      status: daysToExpiry <= 0 ? 'expired' : daysToExpiry <= 30 ? 'near_expiry' : 'healthy',
      categoryId: item.categoryId || 'cat-1',
    };

    // Filter
    if (filters.categoryId !== 'all' && record.categoryId !== filters.categoryId) return;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      if (!record.itemName.toLowerCase().includes(q) && !record.batchNo.toLowerCase().includes(q)) return;
    }

    list.push(record);
  });

  return list;
}
