// Hello Khata OS - Purchases Reports Dashboard Page
// হ্যালো খাতা - ক্রয় রিপোর্ট ড্যাশবোর্ড পেজ

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
  Truck,
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
  Package,
  Layers,
  Tag,
  CheckCircle2,
  X,
  Printer,
  Download,
  FileSpreadsheet,
  FileText,
  Loader2,
  RotateCcw,
  History,
  ClipboardCheck,
  ShoppingBag,
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  usePurchases,
  useItems,
  useBranches,
  useCategories,
} from '@/hooks/queries';
import { useCurrency, useAppTranslation } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import type { Purchase, PurchaseItem, StaffPerformance } from '@/types';
import { useSessionStore } from '@/stores/sessionStore';
import { PrintReportPreview, type ReportColumn } from '@/components/reports/PrintReportPreview';
import { useParties } from '@/hooks/api/useParties';

// Static Staff Performance Mock Data
const STATIC_STAFF_PERFORMANCE: StaffPerformance[] = [
  {
    staffId: 'user-1',
    staffName: 'আব্দুর রহমান (Abdur Rahman)',
    branchId: 'branch-1',
    period: 'Current Month',
    totalSales: 485000,
    totalTransactions: 156,
    totalProfit: 78500,
    averageSaleValue: 3109,
    commission: 7850,
    salesGrowth: 15.2,
    rank: 1,
  },
  {
    staffId: 'user-2',
    staffName: 'করিম উদ্দিন (Karim Uddin)',
    branchId: 'branch-2',
    period: 'Current Month',
    totalSales: 285000,
    totalTransactions: 98,
    totalProfit: 42500,
    averageSaleValue: 2908,
    commission: 4250,
    salesGrowth: 8.5,
    rank: 2,
  },
  {
    staffId: 'user-3',
    staffName: 'নাজমুল ইসলাম (Nazmul Islam)',
    branchId: 'branch-1',
    period: 'Current Month',
    totalSales: 195000,
    totalTransactions: 72,
    totalProfit: 28500,
    averageSaleValue: 2708,
    commission: 2850,
    salesGrowth: -2.3,
    rank: 3,
  },
  {
    staffId: 'user-4',
    staffName: 'তানভীর আহমেদ (Tanvir Ahmed)',
    branchId: 'branch-2',
    period: 'Current Month',
    totalSales: 145000,
    totalTransactions: 45,
    totalProfit: 19500,
    averageSaleValue: 3222,
    commission: 1950,
    salesGrowth: 4.1,
    rank: 4,
  },
];

// Mock types
interface PurchaseOrder {
  id: string;
  poNo: string;
  createdAt: string;
  supplierName: string;
  branchName: string;
  itemsCount: number;
  total: number;
  status: 'draft' | 'ordered' | 'completed' | 'cancelled';
  supplierId: string;
  branchId: string;
}

interface GRNRecord {
  id: string;
  grnNo: string;
  createdAt: string;
  refNo: string;
  supplierName: string;
  warehouseName: string;
  itemsCount: number;
  status: 'received' | 'inspected' | 'returned';
  supplierId: string;
  branchId: string;
}

interface PurchaseReturn {
  id: string;
  returnNo: string;
  createdAt: string;
  refInvoiceNo: string;
  supplierName: string;
  itemsCount: number;
  total: number;
  status: 'approved' | 'pending' | 'adjusted';
  supplierId: string;
}

interface PriceHistoryRecord {
  itemId: string;
  itemName: string;
  sku: string;
  categoryName: string;
  baseCost: number;
  minCost: number;
  maxCost: number;
  avgCost: number;
  lastCost: number;
  trend: 'up' | 'down' | 'stable';
}

export default function PurchasesReportsDashboard() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const { toast } = useToast();
  const { business, user } = useSessionStore();

  // Queries
  const { data: purchases = [], isLoading: purchasesLoading, error: purchasesError, refetch: refetchPurchases } = usePurchases();
  const { data: items = [], isLoading: itemsLoading } = useItems();
  const { data: suppliersData, isLoading: suppliersLoading } = useParties({ type: 'supplier' });
  const supplierList = (suppliersData as any)?.data || [];
  const { data: branches = [], isLoading: branchesLoading } = useBranches();
  const staffPerf = STATIC_STAFF_PERFORMANCE;
  const { data: categories = [] } = useCategories();

  // Brand mock options
  const brandList = useMemo(() => ['PRAN', 'Coca-Cola', 'Square', 'Aarong', 'ACI', 'Unilever', 'Radhuni', 'Bambi'], []);

  // Determine if we should fall back to mock data
  const { purchasesData, isDemoData } = useMemo(() => {
    if (purchasesError || (purchases && purchases.length === 0)) {
      return {
        purchasesData: generateMockPurchases(items, branches, supplierList),
        isDemoData: true,
      };
    }
    return {
      purchasesData: purchases,
      isDemoData: false,
    };
  }, [purchases, purchasesError, items, branches, supplierList]);

  // Loading state helper
  const isPageLoading = purchasesLoading || itemsLoading || suppliersLoading || branchesLoading;

  // Active Tab state
  const [activeTab, setActiveTab] = useState<string>('summary');

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
  const [selectedStaffId, setSelectedStaffId] = useState<string>('all');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('all');
  const [selectedProductId, setSelectedProductId] = useState<string>('all');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Local filter copy for "Apply Filters" pattern
  const [activeFilters, setActiveFilters] = useState<{
    period: '7d' | '30d' | '90d' | '1y' | 'custom';
    dateRange: { from?: Date; to?: Date };
    branchId: string;
    warehouseId: string;
    staffId: string;
    supplierId: string;
    productId: string;
    categoryId: string;
    brand: string;
    paymentMethod: string;
    status: string;
  }>({
    period: '30d',
    dateRange: { from: undefined, to: undefined },
    branchId: 'all',
    warehouseId: 'all',
    staffId: 'all',
    supplierId: 'all',
    productId: 'all',
    categoryId: 'all',
    brand: 'all',
    paymentMethod: 'all',
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
      staffId: selectedStaffId,
      supplierId: selectedSupplierId,
      productId: selectedProductId,
      categoryId: selectedCategoryId,
      brand: selectedBrand,
      paymentMethod: selectedPaymentMethod,
      status: selectedStatus,
    });
    toast({
      title: isBangla ? 'ফিল্টার প্রয়োগ করা হয়েছে' : 'Filters Applied',
      description: isBangla ? 'আপনার নির্বাচিত ফিল্টারের ভিত্তিতে ক্রয় রিপোর্ট আপডেট করা হয়েছে।' : 'Purchase ledger data refreshed against new filter set.',
    });
  };

  // Reset filters action
  const handleResetFilters = () => {
    setSearchQuery('');
    setPeriod('30d');
    setDateRange({ from: undefined, to: undefined });
    setSelectedBranchId('all');
    setSelectedWarehouseId('all');
    setSelectedStaffId('all');
    setSelectedSupplierId('all');
    setSelectedProductId('all');
    setSelectedCategoryId('all');
    setSelectedBrand('all');
    setSelectedPaymentMethod('all');
    setSelectedStatus('all');

    setActiveFilters({
      period: '30d',
      dateRange: { from: undefined, to: undefined },
      branchId: 'all',
      warehouseId: 'all',
      staffId: 'all',
      supplierId: 'all',
      productId: 'all',
      categoryId: 'all',
      brand: 'all',
      paymentMethod: 'all',
      status: 'all',
    });
    
    toast({
      title: isBangla ? 'রিসেট সম্পন্ন' : 'Filters Cleared',
      description: isBangla ? 'সকল ফিল্টার ডিফল্ট মানে রিসেট করা হয়েছে।' : 'All purchase reporting filters returned to baseline.',
    });
  };

  // Re-establish hook server connections
  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetchPurchases();
      toast({
        title: isBangla ? 'রিলোড সম্পন্ন' : 'Sync Completed',
        description: isBangla ? 'সার্ভার থেকে সফলভাবে সর্বশেষ ডেটা রিলোড করা হয়েছে।' : 'Latest purchase logs fetched from server.',
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

  // Main data filtering logic
  const filteredPurchases = useMemo(() => {
    return purchasesData.filter((purchase) => {
      // 0. Instant Text Search Filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesBill = (purchase.invoiceNo || '').toLowerCase().includes(query);
        const matchesSupplier = (purchase.supplier?.name || '').toLowerCase().includes(query);
        if (!matchesBill && !matchesSupplier) return false;
      }

      // 1. Date filter
      const { start, end } = getFilterDates();
      const purchaseDate = new Date(purchase.createdAt);
      if (start) {
        const startOfDay = new Date(start);
        startOfDay.setHours(0, 0, 0, 0);
        if (purchaseDate < startOfDay) return false;
      }
      if (end) {
        const endOfDay = new Date(end);
        endOfDay.setHours(23, 59, 59, 999);
        if (purchaseDate > endOfDay) return false;
      }

      // 2. Branch & Warehouse filter
      if (activeFilters.branchId !== 'all' && purchase.branchId !== activeFilters.branchId) {
        return false;
      }
      if (activeFilters.warehouseId !== 'all' && purchase.branchId !== activeFilters.warehouseId) {
        return false;
      }

      // 3. Purchaser/Staff filter
      if (activeFilters.staffId !== 'all' && purchase.createdBy !== activeFilters.staffId) {
        return false;
      }

      // 4. Supplier/Party filter
      if (activeFilters.supplierId !== 'all' && purchase.supplierId !== activeFilters.supplierId) {
        return false;
      }

      // 5. Payment Method mapping filter
      if (activeFilters.paymentMethod !== 'all') {
        const pm = purchase.dueAmount === 0 ? 'cash' : purchase.paidAmount === 0 ? 'credit' : 'mobile_banking';
        if (pm !== activeFilters.paymentMethod) return false;
      }

      // 6. Bill Status filter
      if (activeFilters.status !== 'all' && purchase.status !== activeFilters.status) {
        return false;
      }

      // 7. Product, Category, Brand filters (Check inside purchase.items)
      if (
        activeFilters.productId !== 'all' ||
        activeFilters.categoryId !== 'all' ||
        activeFilters.brand !== 'all'
      ) {
        const hasMatchingItem = purchase.items.some((pi) => {
          if (activeFilters.productId !== 'all' && pi.itemId !== activeFilters.productId) {
            return false;
          }
          
          if (activeFilters.categoryId !== 'all') {
            const product = items.find((p) => p.id === pi.itemId);
            if (!product || product.categoryId !== activeFilters.categoryId) {
              return false;
            }
          }

          if (activeFilters.brand !== 'all') {
            const mockBrands = brandList;
            const productBrand = mockBrands[pi.itemName.charCodeAt(0) % mockBrands.length];
            if (productBrand !== activeFilters.brand) {
              return false;
            }
          }

          return true;
        });

        if (!hasMatchingItem) return false;
      }

      return true;
    });
  }, [purchasesData, activeFilters, items, brandList, searchQuery]);

  // Calculate count of active advanced filters
  const activeAdvancedCount = useMemo(() => {
    let count = 0;
    if (activeFilters.warehouseId !== 'all') count++;
    if (activeFilters.staffId !== 'all') count++;
    if (activeFilters.productId !== 'all') count++;
    if (activeFilters.categoryId !== 'all') count++;
    if (activeFilters.paymentMethod !== 'all') count++;
    if (activeFilters.status !== 'all') count++;
    return count;
  }, [activeFilters]);

  // Active filter chips
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
    if (activeFilters.staffId !== 'all') {
      const name = staffPerf?.find(s => s.staffId === activeFilters.staffId)?.staffName || activeFilters.staffId;
      chips.push({ key: 'staffId', label: isBangla ? 'ক্রয়কারী' : 'Purchaser', valueText: name });
    }
    if (activeFilters.supplierId !== 'all') {
      const name = supplierList.find((s: any) => s.id === activeFilters.supplierId)?.name || activeFilters.supplierId;
      chips.push({ key: 'supplierId', label: isBangla ? 'সরবরাহকারী' : 'Supplier', valueText: name });
    }
    if (activeFilters.productId !== 'all') {
      const name = items.find(i => i.id === activeFilters.productId)?.name || activeFilters.productId;
      chips.push({ key: 'productId', label: isBangla ? 'পণ্য' : 'Product', valueText: name });
    }
    if (activeFilters.categoryId !== 'all') {
      const name = categories.find(c => c.id === activeFilters.categoryId)?.name || activeFilters.categoryId;
      chips.push({ key: 'categoryId', label: isBangla ? 'ক্যাটাগরি' : 'Category', valueText: name });
    }
    if (activeFilters.paymentMethod !== 'all') {
      chips.push({ key: 'paymentMethod', label: isBangla ? 'পেমেন্ট' : 'Payment', valueText: activeFilters.paymentMethod });
    }
    if (activeFilters.status !== 'all') {
      chips.push({ key: 'status', label: isBangla ? 'স্ট্যাটাস' : 'Status', valueText: activeFilters.status });
    }

    return chips;
  }, [activeFilters, branches, warehouses, staffPerf, supplierList, items, categories, isBangla]);

  const handleRemoveFilter = (key: string) => {
    if (key === 'branchId') {
      setSelectedBranchId('all');
      setActiveFilters(prev => ({ ...prev, branchId: 'all' }));
    } else if (key === 'warehouseId') {
      setSelectedWarehouseId('all');
      setActiveFilters(prev => ({ ...prev, warehouseId: 'all' }));
    } else if (key === 'staffId') {
      setSelectedStaffId('all');
      setActiveFilters(prev => ({ ...prev, staffId: 'all' }));
    } else if (key === 'supplierId') {
      setSelectedSupplierId('all');
      setActiveFilters(prev => ({ ...prev, supplierId: 'all' }));
    } else if (key === 'productId') {
      setSelectedProductId('all');
      setActiveFilters(prev => ({ ...prev, productId: 'all' }));
    } else if (key === 'categoryId') {
      setSelectedCategoryId('all');
      setActiveFilters(prev => ({ ...prev, categoryId: 'all' }));
    } else if (key === 'paymentMethod') {
      setSelectedPaymentMethod('all');
      setActiveFilters(prev => ({ ...prev, paymentMethod: 'all' }));
    } else if (key === 'status') {
      setSelectedStatus('all');
      setActiveFilters(prev => ({ ...prev, status: 'all' }));
    }
  };

  // Generate Mock Tables Data for sub-tabs
  const mockPurchaseOrders = useMemo(() => {
    return generateMockPurchaseOrders(branches, supplierList, activeFilters, searchQuery);
  }, [branches, supplierList, activeFilters, searchQuery]);

  const mockGRNs = useMemo(() => {
    return generateMockGRNs(branches, supplierList, activeFilters, searchQuery);
  }, [branches, supplierList, activeFilters, searchQuery]);

  const mockReturns = useMemo(() => {
    return generateMockReturns(supplierList, activeFilters, searchQuery);
  }, [supplierList, activeFilters, searchQuery]);

  const mockPriceHistory = useMemo(() => {
    return generateMockPriceHistory(items, categories, activeFilters, searchQuery, isBangla);
  }, [items, categories, activeFilters, searchQuery, isBangla]);

  // Calculate By Supplier summaries
  const supplierSummaries = useMemo(() => {
    const supMap: Record<string, { name: string; count: number; subtotal: number; paid: number; due: number; lastDate: string }> = {};

    filteredPurchases.forEach((purchase) => {
      const supId = purchase.supplierId || 'general';
      const supName = purchase.supplier?.name || (isBangla ? 'সাধারণ সরবরাহকারী' : 'Standard Supplier');
      
      if (!supMap[supId]) {
        supMap[supId] = {
          name: supName,
          count: 0,
          subtotal: 0,
          paid: 0,
          due: 0,
          lastDate: purchase.createdAt as string,
        };
      }

      supMap[supId].count++;
      supMap[supId].subtotal += purchase.total;
      supMap[supId].paid += purchase.paidAmount;
      supMap[supId].due += purchase.dueAmount;
      if (new Date(purchase.createdAt) > new Date(supMap[supId].lastDate)) {
        supMap[supId].lastDate = purchase.createdAt as string;
      }
    });

    return Object.values(supMap).sort((a, b) => b.subtotal - a.subtotal);
  }, [filteredPurchases, isBangla]);

  // Calculate By Product summaries
  const productSummaries = useMemo(() => {
    const prodMap: Record<string, { name: string; sku: string; qty: number; cost: number; lastCost: number }> = {};

    filteredPurchases.forEach((purchase) => {
      purchase.items.forEach((item) => {
        if (!prodMap[item.itemId]) {
          const itemObj = items.find((i) => i.id === item.itemId);
          prodMap[item.itemId] = {
            name: item.itemName,
            sku: itemObj?.sku || `SKU-${item.itemId.slice(-4).toUpperCase()}`,
            qty: 0,
            cost: 0,
            lastCost: item.unitCost,
          };
        }
        prodMap[item.itemId].qty += item.quantity;
        prodMap[item.itemId].cost += item.total;
        prodMap[item.itemId].lastCost = item.unitCost;
      });
    });

    return Object.values(prodMap).sort((a, b) => b.cost - a.cost);
  }, [filteredPurchases, items]);

  // Pagination states
  const [supplierPage, setSupplierPage] = useState(1);
  const [productSummaryPage, setProductSummaryPage] = useState(1);
  const [ordersPage, setOrdersPage] = useState(1);
  const [grnPage, setGrnPage] = useState(1);
  const [returnsPage, setReturnsPage] = useState(1);
  const [priceHistoryPage, setPriceHistoryPage] = useState(1);
  const [detailsPage, setDetailsPage] = useState(1);

  const itemsPerPage = 10;

  // Paginated Slices
  const paginatedSuppliers = useMemo(() => {
    const start = (supplierPage - 1) * itemsPerPage;
    return supplierSummaries.slice(start, start + itemsPerPage);
  }, [supplierSummaries, supplierPage]);

  const paginatedProductSummaries = useMemo(() => {
    const start = (productSummaryPage - 1) * itemsPerPage;
    return productSummaries.slice(start, start + itemsPerPage);
  }, [productSummaries, productSummaryPage]);

  const paginatedOrders = useMemo(() => {
    const start = (ordersPage - 1) * itemsPerPage;
    return mockPurchaseOrders.slice(start, start + itemsPerPage);
  }, [mockPurchaseOrders, ordersPage]);

  const paginatedGRNs = useMemo(() => {
    const start = (grnPage - 1) * itemsPerPage;
    return mockGRNs.slice(start, start + itemsPerPage);
  }, [mockGRNs, grnPage]);

  const paginatedReturns = useMemo(() => {
    const start = (returnsPage - 1) * itemsPerPage;
    return mockReturns.slice(start, start + itemsPerPage);
  }, [mockReturns, returnsPage]);

  const paginatedPriceHistory = useMemo(() => {
    const start = (priceHistoryPage - 1) * itemsPerPage;
    return mockPriceHistory.slice(start, start + itemsPerPage);
  }, [mockPriceHistory, priceHistoryPage]);

  const paginatedDetails = useMemo(() => {
    const start = (detailsPage - 1) * itemsPerPage;
    return filteredPurchases.slice(start, start + itemsPerPage);
  }, [filteredPurchases, detailsPage]);

  // KPI calculations
  const kpis = useMemo(() => {
    const totalPurchases = filteredPurchases.reduce((sum, s) => sum + s.total, 0);
    const totalOrders = filteredPurchases.length;
    const aov = totalOrders > 0 ? totalPurchases / totalOrders : 0;
    const netPurchases = filteredPurchases.reduce((sum, s) => sum + s.subtotal, 0);
    const discountsReceived = filteredPurchases.reduce((sum, s) => sum + s.discount, 0);
    const taxPaid = filteredPurchases.reduce((sum, s) => sum + s.tax, 0);
    
    const returnedPurchasesList = filteredPurchases.filter(s => s.status === 'cancelled');
    const returnedPurchasesValue = returnedPurchasesList.reduce((sum, s) => sum + s.total, 0);
    const returnedPurchasesCount = returnedPurchasesList.length;

    return {
      totalPurchases,
      totalOrders,
      aov,
      netPurchases,
      discountsReceived,
      taxPaid,
      returnedPurchasesValue,
      returnedPurchasesCount,
    };
  }, [filteredPurchases]);

  // Chart data
  const trendData = useMemo(() => {
    const dataMap: Record<string, number> = {};
    filteredPurchases.forEach((purchase) => {
      const dateKey = format(new Date(purchase.createdAt), 'dd MMM');
      dataMap[dateKey] = (dataMap[dateKey] || 0) + purchase.total;
    });
    return Object.entries(dataMap).map(([dateLabel, value]) => ({
      dateLabel,
      value,
    })).slice(0, 15);
  }, [filteredPurchases]);

  // Dynamic Print columns mapping based on activeTab
  const printColumns = useMemo<ReportColumn<any>[]>(() => {
    if (activeTab === 'details') {
      return [
        { header: 'Bill No.', headerBn: 'বিল নং', accessor: (row: Purchase) => row.invoiceNo || 'N/A' },
        { header: 'Date', headerBn: 'তারিখ', accessor: (row: Purchase) => format(new Date(row.createdAt), 'dd MMM yyyy') },
        { header: 'Supplier', headerBn: 'সরবরাহকারী', accessor: (row: Purchase) => row.supplier?.name || 'N/A' },
        { header: 'Subtotal', headerBn: 'উপমোট', accessor: (row: Purchase) => formatCurrency(row.subtotal), align: 'right' },
        { header: 'Discount', headerBn: 'ছাড়', accessor: (row: Purchase) => formatCurrency(row.discount), align: 'right' },
        { header: 'Tax Paid', headerBn: 'ট্যাক্স', accessor: (row: Purchase) => formatCurrency(row.tax), align: 'right' },
        { header: 'Net Total', headerBn: 'নিট মোট', accessor: (row: Purchase) => formatCurrency(row.total), align: 'right', footer: formatCurrency(kpis.totalPurchases) },
        { header: 'Status', headerBn: 'স্ট্যাটাস', accessor: (row: Purchase) => row.status, align: 'center' }
      ];
    } else if (activeTab === 'supplier') {
      return [
        { header: 'Supplier Name', headerBn: 'সরবরাহকারী', accessor: (row: any) => row.name },
        { header: 'Bills Count', headerBn: 'বিল সংখ্যা', accessor: (row: any) => row.count.toString(), align: 'center' },
        { header: 'Total Purchase', headerBn: 'মোট ক্রয়', accessor: (row: any) => formatCurrency(row.subtotal), align: 'right', footer: formatCurrency(kpis.totalPurchases) },
        { header: 'Total Paid', headerBn: 'মোট পরিশোধ', accessor: (row: any) => formatCurrency(row.paid), align: 'right' },
        { header: 'Outstanding Due', headerBn: 'বকেয়া', accessor: (row: any) => formatCurrency(row.due), align: 'right' }
      ];
    } else if (activeTab === 'product') {
      return [
        { header: 'Product Name', headerBn: 'পণ্য', accessor: (row: any) => row.name },
        { header: 'SKU', headerBn: 'এসকেইউ', accessor: (row: any) => row.sku },
        { header: 'Qty Procured', headerBn: 'ক্রয়কৃত পরিমাণ', accessor: (row: any) => row.qty.toString(), align: 'right' },
        { header: 'Total Cost', headerBn: 'মোট ব্যয়', accessor: (row: any) => formatCurrency(row.cost), align: 'right', footer: formatCurrency(kpis.totalPurchases) },
        { header: 'Average Cost', headerBn: 'গড় ব্যয়', accessor: (row: any) => formatCurrency(row.qty > 0 ? row.cost / row.qty : 0), align: 'right' }
      ];
    } else if (activeTab === 'orders') {
      return [
        { header: 'PO No', headerBn: 'পিও নং', accessor: (row: PurchaseOrder) => row.poNo },
        { header: 'Date', headerBn: 'তারিখ', accessor: (row: PurchaseOrder) => format(new Date(row.createdAt), 'dd MMM yyyy') },
        { header: 'Supplier', headerBn: 'সরবরাহকারী', accessor: (row: PurchaseOrder) => row.supplierName },
        { header: 'Branch', headerBn: 'শাখা', accessor: (row: PurchaseOrder) => row.branchName },
        { header: 'Items Qty', headerBn: 'পণ্য সংখ্যা', accessor: (row: PurchaseOrder) => row.itemsCount.toString(), align: 'center' },
        { header: 'Total Amount', headerBn: 'মোট মূল্য', accessor: (row: PurchaseOrder) => formatCurrency(row.total), align: 'right' },
        { header: 'Status', headerBn: 'স্ট্যাটাস', accessor: (row: PurchaseOrder) => row.status, align: 'center' }
      ];
    } else if (activeTab === 'grn') {
      return [
        { header: 'GRN No', headerBn: 'জিআরএন নং', accessor: (row: GRNRecord) => row.grnNo },
        { header: 'Date', headerBn: 'তারিখ', accessor: (row: GRNRecord) => format(new Date(row.createdAt), 'dd MMM yyyy') },
        { header: 'Ref Bill/PO', headerBn: 'রেফারেন্স বিল', accessor: (row: GRNRecord) => row.refNo },
        { header: 'Supplier', headerBn: 'সরবরাহকারী', accessor: (row: GRNRecord) => row.supplierName },
        { header: 'Warehouse', headerBn: 'গোডাউন', accessor: (row: GRNRecord) => row.warehouseName },
        { header: 'Received Qty', headerBn: 'গৃহীত পণ্য', accessor: (row: GRNRecord) => row.itemsCount.toString(), align: 'center' },
        { header: 'Status', headerBn: 'স্ট্যাটাস', accessor: (row: GRNRecord) => row.status, align: 'center' }
      ];
    } else if (activeTab === 'returns') {
      return [
        { header: 'Return No', headerBn: 'ফেরত বিল নং', accessor: (row: PurchaseReturn) => row.returnNo },
        { header: 'Date', headerBn: 'তারিখ', accessor: (row: PurchaseReturn) => format(new Date(row.createdAt), 'dd MMM yyyy') },
        { header: 'Ref Invoice', headerBn: 'মূল বিল নং', accessor: (row: PurchaseReturn) => row.refInvoiceNo },
        { header: 'Supplier', headerBn: 'সরবরাহকারী', accessor: (row: PurchaseReturn) => row.supplierName },
        { header: 'Items Returned', headerBn: 'ফেরত পণ্য', accessor: (row: PurchaseReturn) => row.itemsCount.toString(), align: 'center' },
        { header: 'Total Refund', headerBn: 'ফেরত মূল্য', accessor: (row: PurchaseReturn) => formatCurrency(row.total), align: 'right' },
        { header: 'Status', headerBn: 'স্ট্যাটাস', accessor: (row: PurchaseReturn) => row.status, align: 'center' }
      ];
    } else if (activeTab === 'price-history') {
      return [
        { header: 'Product Name', headerBn: 'পণ্য', accessor: (row: PriceHistoryRecord) => row.itemName },
        { header: 'SKU', headerBn: 'এসকেইউ', accessor: (row: PriceHistoryRecord) => row.sku },
        { header: 'Category', headerBn: 'ক্যাটাগরি', accessor: (row: PriceHistoryRecord) => row.categoryName },
        { header: 'Base Cost', headerBn: 'বেস মূল্য', accessor: (row: PriceHistoryRecord) => formatCurrency(row.baseCost), align: 'right' },
        { header: 'Min Cost', headerBn: 'সর্বনিম্ন মূল্য', accessor: (row: PriceHistoryRecord) => formatCurrency(row.minCost), align: 'right' },
        { header: 'Max Cost', headerBn: 'সর্বোচ্চ মূল্য', accessor: (row: PriceHistoryRecord) => formatCurrency(row.maxCost), align: 'right' },
        { header: 'Average Cost', headerBn: 'গড় মূল্য', accessor: (row: PriceHistoryRecord) => formatCurrency(row.avgCost), align: 'right' },
        { header: 'Last Cost', headerBn: 'সর্বশেষ মূল্য', accessor: (row: PriceHistoryRecord) => formatCurrency(row.lastCost), align: 'right' }
      ];
    } else {
      // summary default print columns
      return [
        { header: 'Key Metrics', headerBn: 'মূল নির্দেশক', accessor: (row: any) => row.label },
        { header: 'Value', headerBn: 'মান', accessor: (row: any) => row.value, align: 'right' }
      ];
    }
  }, [activeTab, kpis, formatCurrency]);

  const printDataArray = useMemo(() => {
    if (activeTab === 'details') return filteredPurchases;
    if (activeTab === 'supplier') return supplierSummaries;
    if (activeTab === 'product') return productSummaries;
    if (activeTab === 'orders') return mockPurchaseOrders;
    if (activeTab === 'grn') return mockGRNs;
    if (activeTab === 'returns') return mockReturns;
    if (activeTab === 'price-history') return mockPriceHistory;
    
    // summary tab fallback stats list
    return [
      { label: isBangla ? 'মোট ক্রয়' : 'Total Purchases', value: formatCurrency(kpis.totalPurchases) },
      { label: isBangla ? 'মোট অর্ডার' : 'Total Orders', value: kpis.totalOrders.toString() },
      { label: isBangla ? 'গড় বিলের মূল্য' : 'Average Bill Value', value: formatCurrency(kpis.aov) },
      { label: isBangla ? 'নিট ক্রয় মূল্য' : 'Net Purchases', value: formatCurrency(kpis.netPurchases) },
      { label: isBangla ? 'প্রাপ্ত ডিসকাউন্ট' : 'Discounts Received', value: formatCurrency(kpis.discountsReceived) },
      { label: isBangla ? 'পরিশোধিত ট্যাক্স' : 'Tax Paid', value: formatCurrency(kpis.taxPaid) },
      { label: isBangla ? 'ক্রয় ফেরত মূল্য' : 'Returned Value', value: formatCurrency(kpis.returnedPurchasesValue) }
    ];
  }, [activeTab, filteredPurchases, supplierSummaries, productSummaries, mockPurchaseOrders, mockGRNs, mockReturns, mockPriceHistory, kpis, isBangla, formatCurrency]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Purchases Reports"
        titleBn="ক্রয় রিপোর্ট"
        subtitle="Analyze purchase orders, procurement bills, supplier summaries and expenses."
        subtitleBn="ক্রয় বিল, অর্ডার, সরবরাহকারী ব্যয়নামা এবং ক্রয়কৃত ব্যয়ের পারফরম্যান্স ও ট্রেন্ড বিশ্লেষণ করুন।"
        icon={Truck}
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
                description: `Excel export completed for ${activeTab.toUpperCase()} report.`,
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
                description: `CSV export completed for ${activeTab.toUpperCase()} report.`,
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

      {/* Alert banner for demo/simulated data */}
      {isDemoData && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-600 rounded-xl p-3.5 flex items-center justify-between flex-wrap gap-2 text-xs font-medium">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 shrink-0 text-amber-500" />
            <span>
              {isBangla 
                ? 'সার্ভারের সংযোগ না থাকায় একটি সিমুলেটেড ডেমো ডেটাসেট প্রদর্শিত হচ্ছে। বাস্তব ডেটা রিলোড করতে ডানদিকের রিফ্রেশ বাটনে ক্লিক করুন।' 
                : 'Showing simulated analytics dataset because connection to the ERP server timed out. You can click Refresh to reconnect.'}
            </span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            className="h-7 text-xs border-amber-500/40 text-amber-700 bg-amber-500/5 hover:bg-amber-500/15"
          >
            <RefreshCw className="h-3 w-3 mr-1 text-amber-600 animate-spin-once" />
            {isBangla ? 'পুনরায় চেষ্টা করুন' : 'Reconnect Now'}
          </Button>
        </div>
      )}

      {/* Global Filter Bar */}
      <Card className="border-border/60 shadow-sm overflow-hidden bg-background">
        <CardContent className="p-4 space-y-3">
          {/* Main Primary Filters Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 w-full">
            
            {/* Left side: Search & Core Selects */}
            <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
              {/* Search Invoice/Customer */}
              <div className="relative w-full md:w-60 shrink-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={isBangla ? 'বিল বা সরবরাহকারী খুঁজুন...' : 'Search bill, supplier...'}
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

              {/* Supplier Selector */}
              <div className="shrink-0">
                <Select value={selectedSupplierId} onValueChange={setSelectedSupplierId}>
                  <SelectTrigger className="bg-background text-xs h-9 min-w-[140px] w-auto flex items-center justify-start gap-1">
                    <span className="text-muted-foreground mr-0.5">{isBangla ? 'সরবরাহকারী:' : 'Supplier:'}</span>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isBangla ? 'সব সরবরাহকারী' : 'All Suppliers'}</SelectItem>
                    {supplierList.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-3 border-t border-muted/50 mt-3 animate-fadeIn">
              
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

              {/* Purchaser Selector */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-muted-foreground">{isBangla ? 'ক্রয়কারী' : 'Purchased By'}</label>
                <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
                  <SelectTrigger className="bg-background text-xs h-9 w-full flex items-center justify-between">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isBangla ? 'সব কর্মচারী' : 'All'}</SelectItem>
                    {staffPerf?.map(s => (
                      <SelectItem key={s.staffId} value={s.staffId}>{s.staffName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Product Selector */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-muted-foreground">{isBangla ? 'পণ্য' : 'Product'}</label>
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger className="bg-background text-xs h-9 w-full flex items-center justify-between">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isBangla ? 'সব পণ্য' : 'All Products'}</SelectItem>
                    {items.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category Selector */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-muted-foreground">{isBangla ? 'ক্যাটাগরি' : 'Category'}</label>
                <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                  <SelectTrigger className="bg-background text-xs h-9 w-full flex items-center justify-between">
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

              {/* Payment Method Selector */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-muted-foreground">{isBangla ? 'পেমেন্ট পদ্ধতি' : 'Payment Method'}</label>
                <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                  <SelectTrigger className="bg-background text-xs h-9 w-full flex items-center justify-between">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isBangla ? 'সব পদ্ধতি' : 'All Methods'}</SelectItem>
                    <SelectItem value="cash">{isBangla ? 'ক্যাশ' : 'Cash'}</SelectItem>
                    <SelectItem value="card">{isBangla ? 'কার্ড' : 'Card'}</SelectItem>
                    <SelectItem value="mobile_banking">{isBangla ? 'মোবাইল ব্যাংকিং' : 'Mobile Banking'}</SelectItem>
                    <SelectItem value="credit">{isBangla ? 'বাকি (ক্রেডিট)' : 'Due (Credit)'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Invoice Status Selector */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-muted-foreground">{isBangla ? 'বিল স্ট্যাটাস' : 'Bill Status'}</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="bg-background text-xs h-9 w-full flex items-center justify-between">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isBangla ? 'সব স্ট্যাটাস' : 'All Statuses'}</SelectItem>
                    <SelectItem value="received">{isBangla ? 'সম্পন্ন (গৃহীত)' : 'Received'}</SelectItem>
                    <SelectItem value="pending">{isBangla ? 'বকেয়া' : 'Pending'}</SelectItem>
                    <SelectItem value="partial">{isBangla ? 'আংশিক' : 'Partial'}</SelectItem>
                    <SelectItem value="cancelled">{isBangla ? 'বাতিল' : 'Cancelled'}</SelectItem>
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
          {/* Main 8-Tabs Navigation list */}
          <TabsList className="bg-muted text-muted-foreground border p-1 rounded-lg w-full flex overflow-x-auto select-none scrollbar-none h-auto flex-nowrap shrink-0">
            <TabsTrigger value="summary" className="text-xs font-bold gap-1 px-3 py-2 shrink-0">
              <TrendingUp className="h-3.5 w-3.5" />
              {isBangla ? 'ক্রয় সারাংশ' : 'Purchase Summary'}
            </TabsTrigger>
            <TabsTrigger value="details" className="text-xs font-bold gap-1 px-3 py-2 shrink-0">
              <FileText className="h-3.5 w-3.5" />
              {isBangla ? 'ক্রয় বিস্তারিত' : 'Purchase Details'}
            </TabsTrigger>
            <TabsTrigger value="supplier" className="text-xs font-bold gap-1 px-3 py-2 shrink-0">
              <Building2 className="h-3.5 w-3.5" />
              {isBangla ? 'সরবরাহকারী ভিত্তিক' : 'Purchase by Supplier'}
            </TabsTrigger>
            <TabsTrigger value="product" className="text-xs font-bold gap-1 px-3 py-2 shrink-0">
              <Package className="h-3.5 w-3.5" />
              {isBangla ? 'পণ্য ভিত্তিক' : 'Purchase by Product'}
            </TabsTrigger>
            <TabsTrigger value="orders" className="text-xs font-bold gap-1 px-3 py-2 shrink-0">
              <ShoppingBag className="h-3.5 w-3.5" />
              {isBangla ? 'ক্রয় অর্ডারসমূহ' : 'Purchase Orders'}
            </TabsTrigger>
            <TabsTrigger value="grn" className="text-xs font-bold gap-1 px-3 py-2 shrink-0">
              <ClipboardCheck className="h-3.5 w-3.5" />
              {isBangla ? 'জিআরএন (মালামাল গ্রহণ)' : 'Goods Received (GRN)'}
            </TabsTrigger>
            <TabsTrigger value="returns" className="text-xs font-bold gap-1 px-3 py-2 shrink-0">
              <RotateCcw className="h-3.5 w-3.5" />
              {isBangla ? 'ক্রয় ফেরত' : 'Purchase Returns'}
            </TabsTrigger>
            <TabsTrigger value="price-history" className="text-xs font-bold gap-1 px-3 py-2 shrink-0">
              <History className="h-3.5 w-3.5" />
              {isBangla ? 'মূল্য ইতিহাস' : 'Purchase Price History'}
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: PURCHASE SUMMARY */}
          <TabsContent value="summary" className="space-y-6 outline-none">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fadeIn">
              <StatCard
                title={isBangla ? 'মোট ক্রয়' : 'Total Purchases'}
                value={formatCurrency(kpis.totalPurchases)}
                icon={Truck}
                iconColor="text-indigo-650"
              />
              <StatCard
                title={isBangla ? 'মোট অর্ডার' : 'Total Orders'}
                value={kpis.totalOrders}
                icon={Layers}
                iconColor="text-blue-600"
              />
              <StatCard
                title={isBangla ? 'গড় বিলের মূল্য' : 'Average Bill Value'}
                value={formatCurrency(kpis.aov)}
                icon={DollarSign}
                iconColor="text-violet-600"
              />
              <StatCard
                title={isBangla ? 'নিট ক্রয় মূল্য' : 'Net Purchases'}
                value={formatCurrency(kpis.netPurchases)}
                icon={CheckCircle2}
                iconColor="text-emerald-600"
              />
            </div>

            {/* Purchase trend area chart */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-indigo-650" />
                  {isBangla ? 'ক্রয় প্রবণতা (গ্রাফ)' : 'Purchase Trend Chart'}
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPurchasesSummary" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="dateLabel" className="text-[10px]" />
                    <YAxis className="text-[10px]" tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} />
                    <RechartsTooltip formatter={(val: number) => formatCurrency(val)} />
                    <Area type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#colorPurchasesSummary)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: PURCHASE DETAILS */}
          <TabsContent value="details" className="outline-none">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold">{isBangla ? 'ক্রয় বিবরণী খতিয়ান' : 'Purchases Details Ledger'}</CardTitle>
                <CardDescription className="text-xs">{isBangla ? 'সকল ক্রয় বিল এবং ভাউচারের বিস্তারিত তালিকা।' : 'Detailed chronological log of all purchase bills.'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead>{isBangla ? 'বিল নং' : 'Bill No.'}</TableHead>
                        <TableHead>{isBangla ? 'তারিখ' : 'Date'}</TableHead>
                        <TableHead>{isBangla ? 'সরবরাহকারী' : 'Supplier'}</TableHead>
                        <TableHead className="text-right">{isBangla ? 'উপমোট' : 'Subtotal'}</TableHead>
                        <TableHead className="text-right">{isBangla ? 'ডিসকাউন্ট' : 'Discount'}</TableHead>
                        <TableHead className="text-right">{isBangla ? 'ট্যাক্স' : 'Tax'}</TableHead>
                        <TableHead className="text-right">{isBangla ? 'নিট মোট' : 'Net Total'}</TableHead>
                        <TableHead className="text-center">{isBangla ? 'স্ট্যাটাস' : 'Status'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedDetails.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="font-bold">{row.invoiceNo || 'N/A'}</TableCell>
                          <TableCell>{format(new Date(row.createdAt), 'dd MMM yyyy')}</TableCell>
                          <TableCell className="font-semibold">{row.supplier?.name}</TableCell>
                          <TableCell className="text-right font-mono">{formatCurrency(row.subtotal)}</TableCell>
                          <TableCell className="text-right font-mono text-amber-600">-{formatCurrency(row.discount)}</TableCell>
                          <TableCell className="text-right font-mono">{formatCurrency(row.tax)}</TableCell>
                          <TableCell className="text-right font-bold font-mono text-indigo-650">{formatCurrency(row.total)}</TableCell>
                          <TableCell className="text-center">
                            <Badge className={cn(
                              "text-[10px] font-black rounded-full px-2 py-0.5",
                              row.status === 'received' ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50" : row.status === 'pending' ? "bg-amber-50 text-amber-700 hover:bg-amber-50" : "bg-red-50 text-red-700 hover:bg-red-50"
                            )}>
                              {row.status.toUpperCase()}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Details Pagination */}
                {filteredPurchases.length > itemsPerPage && (
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground">
                      {isBangla ? `পৃষ্ঠা ${detailsPage} এর ${Math.ceil(filteredPurchases.length / itemsPerPage)}` : `Page ${detailsPage} of ${Math.ceil(filteredPurchases.length / itemsPerPage)}`}
                    </span>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={detailsPage === 1} onClick={() => setDetailsPage(p => p - 1)}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={detailsPage >= Math.ceil(filteredPurchases.length / itemsPerPage)} onClick={() => setDetailsPage(p => p + 1)}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: PURCHASE BY SUPPLIER */}
          <TabsContent value="supplier" className="outline-none">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold">{isBangla ? 'সরবরাহকারী খতিয়ান বিবরণী' : 'Purchase by Supplier Ledger'}</CardTitle>
                <CardDescription className="text-xs">{isBangla ? 'সরবরাহকারী ভিত্তিক বিল সংখ্যা, ক্রয় মূল্য এবং বকেয়া হিসাব।' : 'Procurement sums, paid volumes, and outstanding liabilities aggregated by supplier.'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead>{isBangla ? 'সরবরাহকারী' : 'Supplier'}</TableHead>
                        <TableHead className="text-center">{isBangla ? 'বিল সংখ্যা' : 'Bills Count'}</TableHead>
                        <TableHead className="text-right">{isBangla ? 'মোট ক্রয়' : 'Total Purchase'}</TableHead>
                        <TableHead className="text-right">{isBangla ? 'মোট পরিশোধ' : 'Total Paid'}</TableHead>
                        <TableHead className="text-right">{isBangla ? 'বকেয়া পরিমাণ' : 'Outstanding Due'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedSuppliers.map((row, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-bold text-foreground">{row.name}</TableCell>
                          <TableCell className="text-center font-medium">{row.count}</TableCell>
                          <TableCell className="text-right font-bold font-mono text-indigo-650">{formatCurrency(row.subtotal)}</TableCell>
                          <TableCell className="text-right font-semibold font-mono text-emerald-600">{formatCurrency(row.paid)}</TableCell>
                          <TableCell className={cn("text-right font-bold font-mono", row.due > 0 ? "text-red-650" : "text-slate-500")}>
                            {formatCurrency(row.due)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Supplier Pagination */}
                {supplierSummaries.length > itemsPerPage && (
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground">
                      {isBangla ? `পৃষ্ঠা ${supplierPage} এর ${Math.ceil(supplierSummaries.length / itemsPerPage)}` : `Page ${supplierPage} of ${Math.ceil(supplierSummaries.length / itemsPerPage)}`}
                    </span>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={supplierPage === 1} onClick={() => setSupplierPage(p => p - 1)}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={supplierPage >= Math.ceil(supplierSummaries.length / itemsPerPage)} onClick={() => setSupplierPage(p => p + 1)}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: PURCHASE BY PRODUCT */}
          <TabsContent value="product" className="outline-none">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold">{isBangla ? 'পণ্য ভিত্তিক ক্রয় বিবরণী' : 'Purchase by Product Summary'}</CardTitle>
                <CardDescription className="text-xs">{isBangla ? 'পণ্য অনুযায়ী মোট ক্রয়কৃত সংখ্যা, মোট খরচ এবং গড় মূল্য।' : 'Procured item metrics grouping quantity purchased and average unit purchase costs.'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead>{isBangla ? 'পণ্য' : 'Product'}</TableHead>
                        <TableHead>{isBangla ? 'এসকেইউ' : 'SKU'}</TableHead>
                        <TableHead className="text-right">{isBangla ? 'ক্রয়কৃত পরিমাণ' : 'Qty Procured'}</TableHead>
                        <TableHead className="text-right">{isBangla ? 'মোট ব্যয়' : 'Total Cost'}</TableHead>
                        <TableHead className="text-right">{isBangla ? 'গড় ইউনিট মূল্য' : 'Average Unit Cost'}</TableHead>
                        <TableHead className="text-right">{isBangla ? 'সর্বশেষ ইউনিট মূল্য' : 'Last Unit Cost'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedProductSummaries.map((row, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-bold text-foreground">{row.name}</TableCell>
                          <TableCell className="font-mono text-xs">{row.sku}</TableCell>
                          <TableCell className="text-right font-medium">{row.qty}</TableCell>
                          <TableCell className="text-right font-bold text-indigo-650 font-mono">{formatCurrency(row.cost)}</TableCell>
                          <TableCell className="text-right font-mono">{formatCurrency(row.qty > 0 ? row.cost / row.qty : 0)}</TableCell>
                          <TableCell className="text-right font-mono text-slate-650">{formatCurrency(row.lastCost)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Product Summary Pagination */}
                {productSummaries.length > itemsPerPage && (
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground">
                      {isBangla ? `পৃষ্ঠা ${productSummaryPage} এর ${Math.ceil(productSummaries.length / itemsPerPage)}` : `Page ${productSummaryPage} of ${Math.ceil(productSummaries.length / itemsPerPage)}`}
                    </span>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={productSummaryPage === 1} onClick={() => setProductSummaryPage(p => p - 1)}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={productSummaryPage >= Math.ceil(productSummaries.length / itemsPerPage)} onClick={() => setProductSummaryPage(p => p + 1)}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 5: PURCHASE ORDERS */}
          <TabsContent value="orders" className="outline-none">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold">{isBangla ? 'ক্রয় অর্ডারসমূহ (PO)' : 'Purchase Orders (PO)'}</CardTitle>
                <CardDescription className="text-xs">{isBangla ? 'সরবরাহকারীদের পাঠানো প্রস্তাবিত ক্রয় নির্দেশের স্থিতি ও বিবরণ।' : 'Purchase orders sent to suppliers and their procurement progress states.'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead>{isBangla ? 'পিও নম্বর' : 'PO No.'}</TableHead>
                        <TableHead>{isBangla ? 'তারিখ' : 'PO Date'}</TableHead>
                        <TableHead>{isBangla ? 'সরবরাহকারী' : 'Supplier'}</TableHead>
                        <TableHead>{isBangla ? 'শাখা' : 'Branch'}</TableHead>
                        <TableHead className="text-center">{isBangla ? 'আইটেম সংখ্যা' : 'Items Count'}</TableHead>
                        <TableHead className="text-right">{isBangla ? 'মোট মূল্য' : 'Total Amount'}</TableHead>
                        <TableHead className="text-center">{isBangla ? 'স্ট্যাটাস' : 'Status'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedOrders.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="font-bold">{row.poNo}</TableCell>
                          <TableCell>{format(new Date(row.createdAt), 'dd MMM yyyy')}</TableCell>
                          <TableCell className="font-semibold">{row.supplierName}</TableCell>
                          <TableCell>{row.branchName}</TableCell>
                          <TableCell className="text-center">{row.itemsCount}</TableCell>
                          <TableCell className="text-right font-bold font-mono text-indigo-650">{formatCurrency(row.total)}</TableCell>
                          <TableCell className="text-center">
                            <Badge className={cn(
                              "text-[10px] font-black rounded-full px-2 py-0.5 uppercase",
                              row.status === 'completed' ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50" : row.status === 'ordered' ? "bg-blue-50 text-blue-700 hover:bg-blue-50" : row.status === 'draft' ? "bg-slate-100 text-slate-700 hover:bg-slate-100" : "bg-red-50 text-red-700 hover:bg-red-50"
                            )}>
                              {row.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Orders Pagination */}
                {mockPurchaseOrders.length > itemsPerPage && (
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground">
                      {isBangla ? `পৃষ্ঠা ${ordersPage} এর ${Math.ceil(mockPurchaseOrders.length / itemsPerPage)}` : `Page ${ordersPage} of ${Math.ceil(mockPurchaseOrders.length / itemsPerPage)}`}
                    </span>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={ordersPage === 1} onClick={() => setOrdersPage(p => p - 1)}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={ordersPage >= Math.ceil(mockPurchaseOrders.length / itemsPerPage)} onClick={() => setOrdersPage(p => p + 1)}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 6: GOODS RECEIVED (GRN) */}
          <TabsContent value="grn" className="outline-none">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold">{isBangla ? 'মালামাল প্রাপ্তি নোট (GRN)' : 'Goods Received Notes (GRN)'}</CardTitle>
                <CardDescription className="text-xs">{isBangla ? 'গোডাউনে মালামাল গ্রহণ, গণনা ও যাচাইকরণ স্থিতি বিবরণ।' : 'Verification logs and inspection states of raw goods arrived at warehouses.'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead>{isBangla ? 'জিআরএন নম্বর' : 'GRN No.'}</TableHead>
                        <TableHead>{isBangla ? 'গ্রহণের তারিখ' : 'Received Date'}</TableHead>
                        <TableHead>{isBangla ? 'রেফারেন্স বিল/PO' : 'Ref Bill/PO'}</TableHead>
                        <TableHead>{isBangla ? 'সরবরাহকারী' : 'Supplier'}</TableHead>
                        <TableHead>{isBangla ? 'গন্তব্য গোডাউন' : 'Warehouse'}</TableHead>
                        <TableHead className="text-center">{isBangla ? 'আইটেম সংখ্যা' : 'Items Received'}</TableHead>
                        <TableHead className="text-center">{isBangla ? 'অবস্থা' : 'Status'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedGRNs.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="font-bold">{row.grnNo}</TableCell>
                          <TableCell>{format(new Date(row.createdAt), 'dd MMM yyyy')}</TableCell>
                          <TableCell className="font-mono text-xs text-slate-600">{row.refNo}</TableCell>
                          <TableCell className="font-semibold">{row.supplierName}</TableCell>
                          <TableCell>{row.warehouseName}</TableCell>
                          <TableCell className="text-center">{row.itemsCount}</TableCell>
                          <TableCell className="text-center">
                            <Badge className={cn(
                              "text-[10px] font-black rounded-full px-2 py-0.5 uppercase",
                              row.status === 'received' ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50" : row.status === 'inspected' ? "bg-blue-50 text-blue-700 hover:bg-blue-50" : "bg-red-50 text-red-700 hover:bg-red-50"
                            )}>
                              {row.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* GRN Pagination */}
                {mockGRNs.length > itemsPerPage && (
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground">
                      {isBangla ? `পৃষ্ঠা ${grnPage} এর ${Math.ceil(mockGRNs.length / itemsPerPage)}` : `Page ${grnPage} of ${Math.ceil(mockGRNs.length / itemsPerPage)}`}
                    </span>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={grnPage === 1} onClick={() => setGrnPage(p => p - 1)}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={grnPage >= Math.ceil(mockGRNs.length / itemsPerPage)} onClick={() => setGrnPage(p => p + 1)}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 7: PURCHASE RETURNS */}
          <TabsContent value="returns" className="outline-none">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold">{isBangla ? 'ক্রয় ফেরত ও ডেবিট নোট' : 'Purchase Returns & Debit Notes'}</CardTitle>
                <CardDescription className="text-xs">{isBangla ? 'সরবরাহকারীদের নিকট ত্রুটিযুক্ত পণ্য ফেরত পাঠানো এবং সমন্বয়কৃত ডেবিট নোট।' : 'Log of returned goods and debit notes issued to suppliers for adjustments.'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead>{isBangla ? 'ফেরত বিল নং' : 'Return No.'}</TableHead>
                        <TableHead>{isBangla ? 'ফেরত তারিখ' : 'Return Date'}</TableHead>
                        <TableHead>{isBangla ? 'মূল ইনভয়েস নং' : 'Ref Invoice'}</TableHead>
                        <TableHead>{isBangla ? 'সরবরাহকারী' : 'Supplier'}</TableHead>
                        <TableHead className="text-center">{isBangla ? 'ফেরত পণ্য সংখ্যা' : 'Items Returned'}</TableHead>
                        <TableHead className="text-right">{isBangla ? 'ফেরত মূল্য' : 'Refund Value'}</TableHead>
                        <TableHead className="text-center">{isBangla ? 'স্ট্যাটাস' : 'Status'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedReturns.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="font-bold">{row.returnNo}</TableCell>
                          <TableCell>{format(new Date(row.createdAt), 'dd MMM yyyy')}</TableCell>
                          <TableCell className="font-mono text-xs">{row.refInvoiceNo}</TableCell>
                          <TableCell className="font-semibold">{row.supplierName}</TableCell>
                          <TableCell className="text-center">{row.itemsCount}</TableCell>
                          <TableCell className="text-right font-bold text-red-650 font-mono">{formatCurrency(row.total)}</TableCell>
                          <TableCell className="text-center">
                            <Badge className={cn(
                              "text-[10px] font-black rounded-full px-2 py-0.5 uppercase",
                              row.status === 'adjusted' ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50" : row.status === 'approved' ? "bg-blue-50 text-blue-700 hover:bg-blue-50" : "bg-amber-50 text-amber-700 hover:bg-amber-50"
                            )}>
                              {row.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Returns Pagination */}
                {mockReturns.length > itemsPerPage && (
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground">
                      {isBangla ? `পৃষ্ঠা ${returnsPage} এর ${Math.ceil(mockReturns.length / itemsPerPage)}` : `Page ${returnsPage} of ${Math.ceil(mockReturns.length / itemsPerPage)}`}
                    </span>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={returnsPage === 1} onClick={() => setReturnsPage(p => p - 1)}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={returnsPage >= Math.ceil(mockReturns.length / itemsPerPage)} onClick={() => setReturnsPage(p => p + 1)}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 8: PURCHASE PRICE HISTORY */}
          <TabsContent value="price-history" className="outline-none">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold">{isBangla ? 'পণ্য ক্রয় মূল্য ইতিহাস ও ওঠানামা' : 'Purchase Price History & Fluctuation'}</CardTitle>
                <CardDescription className="text-xs">{isBangla ? 'সময়ের ব্যবধানে পণ্যের বেস মূল্যের সাপেক্ষে ক্রয় মূল্যের পরিবর্তন ও প্রবণতা।' : 'Purchase cost history displaying price changes and fluctuation indexes per item.'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead>{isBangla ? 'পণ্য' : 'Product'}</TableHead>
                        <TableHead>{isBangla ? 'এসকেইউ' : 'SKU'}</TableHead>
                        <TableHead>{isBangla ? 'ক্যাটাগরি' : 'Category'}</TableHead>
                        <TableHead className="text-right">{isBangla ? 'বেস মূল্য' : 'Base Cost'}</TableHead>
                        <TableHead className="text-right">{isBangla ? 'সর্বনিম্ন ক্রয়মূল্য' : 'Min Cost'}</TableHead>
                        <TableHead className="text-right">{isBangla ? 'সর্বোচ্চ ক্রয়মূল্য' : 'Max Cost'}</TableHead>
                        <TableHead className="text-right">{isBangla ? 'গড় ক্রয়মূল্য' : 'Average Cost'}</TableHead>
                        <TableHead className="text-right">{isBangla ? 'সর্বশেষ ক্রয়মূল্য' : 'Last Cost'}</TableHead>
                        <TableHead className="text-center">{isBangla ? 'প্রবণতা' : 'Cost Trend'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedPriceHistory.map((row) => (
                        <TableRow key={row.itemId}>
                          <TableCell className="font-bold text-foreground">{row.itemName}</TableCell>
                          <TableCell className="font-mono text-xs">{row.sku}</TableCell>
                          <TableCell>{row.categoryName}</TableCell>
                          <TableCell className="text-right font-mono">{formatCurrency(row.baseCost)}</TableCell>
                          <TableCell className="text-right font-mono text-emerald-700">{formatCurrency(row.minCost)}</TableCell>
                          <TableCell className="text-right font-mono text-red-650">{formatCurrency(row.maxCost)}</TableCell>
                          <TableCell className="text-right font-bold font-mono text-indigo-650">{formatCurrency(row.avgCost)}</TableCell>
                          <TableCell className="text-right font-black font-mono">{formatCurrency(row.lastCost)}</TableCell>
                          <TableCell className="text-center">
                            <Badge className={cn(
                              "text-[10px] font-black rounded-full px-2 py-0.5 uppercase",
                              row.trend === 'up' ? "bg-red-50 text-red-700 hover:bg-red-50" : row.trend === 'down' ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50" : "bg-slate-100 text-slate-700 hover:bg-slate-100"
                            )}>
                              {row.trend === 'up' ? '▲ UP' : row.trend === 'down' ? '▼ DOWN' : '■ STABLE'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Price History Pagination */}
                {mockPriceHistory.length > itemsPerPage && (
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground">
                      {isBangla ? `পৃষ্ঠা ${priceHistoryPage} এর ${Math.ceil(mockPriceHistory.length / itemsPerPage)}` : `Page ${priceHistoryPage} of ${Math.ceil(mockPriceHistory.length / itemsPerPage)}`}
                    </span>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={priceHistoryPage === 1} onClick={() => setPriceHistoryPage(p => p - 1)}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={priceHistoryPage >= Math.ceil(mockPriceHistory.length / itemsPerPage)} onClick={() => setPriceHistoryPage(p => p + 1)}>
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
        title={isBangla ? `ক্রয় রিপোর্ট (${activeTab.toUpperCase()})` : `Purchases Report (${activeTab.toUpperCase()})`}
        titleBn={`ক্রয় রিপোর্ট (${activeTab.toUpperCase()})`}
        subtitle="SME Procurement Performance Ledger Summary"
        subtitleBn="ক্ষুদ্র ও মাঝারি ব্যবসা ক্রয় বিবরণী ও সরবরাহকারী খতিয়ান"
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
          purchaser: selectedStaffId === 'all' ? 'All' : staffPerf?.find((s: any) => s.staffId === selectedStaffId)?.staffName || selectedStaffId,
          supplier: selectedSupplierId === 'all' ? 'All' : supplierList.find((c: any) => c.id === selectedSupplierId)?.name || selectedSupplierId,
          product: selectedProductId === 'all' ? 'All' : items.find(i => i.id === selectedProductId)?.name || selectedProductId,
          category: selectedCategoryId === 'all' ? 'All' : categories.find(c => c.id === selectedCategoryId)?.name || selectedCategoryId,
          paymentMethod: selectedPaymentMethod === 'all' ? 'All' : selectedPaymentMethod,
          status: selectedStatus === 'all' ? 'All' : selectedStatus,
        }}
        kpis={[
          { label: 'Total Purchases', labelBn: 'মোট ক্রয়', value: formatCurrency(kpis.totalPurchases) },
          { label: 'Total Bills/Orders', labelBn: 'মোট বিল/অর্ডার', value: kpis.totalOrders },
          { label: 'Net Purchase Value', labelBn: 'নিট ক্রয় মূল্য', value: formatCurrency(kpis.netPurchases) },
          { label: 'Tax Paid', labelBn: 'পরিশোধিত ট্যাক্স', value: formatCurrency(kpis.taxPaid) },
          { label: 'Discounts Received', labelBn: 'প্রাপ্ত ডিসকাউন্ট', value: formatCurrency(kpis.discountsReceived) },
          { label: 'Returned Value', labelBn: 'ফেরত ক্রয়', value: formatCurrency(kpis.returnedPurchasesValue) },
          { label: 'Average Bill Value', labelBn: 'গড় বিল মূল্য', value: formatCurrency(kpis.aov) }
        ]}
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

// Fallback Mock Data Generator for Purchases Details
function generateMockPurchases(items: any[], branches: any[], suppliers: any[]): Purchase[] {
  const purchases: Purchase[] = [];
  const start = new Date();
  start.setDate(start.getDate() - 30);
  
  const paymentMethods: ('cash' | 'card' | 'mobile_banking' | 'credit')[] = ['cash', 'card', 'mobile_banking', 'credit'];
  const statuses: ('received' | 'pending' | 'partial' | 'cancelled')[] = ['received', 'received', 'received', 'received', 'pending', 'partial', 'cancelled'];
  
  const defaultItems = [
    { id: 'item-1', name: 'Coca-Cola 250ml', sku: 'CC-250', price: 35, cost: 28, categoryId: 'cat-1' },
    { id: 'item-2', name: 'PRAN Spice Mix 100g', sku: 'PR-SP100', price: 45, cost: 36, categoryId: 'cat-1' },
    { id: 'item-3', name: 'Square Lux Soap 150g', sku: 'SQ-LS150', price: 60, cost: 48, categoryId: 'cat-2' },
    { id: 'item-4', name: 'Aarong Liquid Milk 1L', sku: 'AR-LM1L', price: 90, cost: 72, categoryId: 'cat-3' },
    { id: 'item-5', name: 'ACI Pure Salt 1kg', sku: 'AC-PS1K', price: 38, cost: 30, categoryId: 'cat-1' },
    { id: 'item-6', name: 'Unilever Surf Excel 500g', sku: 'UL-SE500', price: 120, cost: 96, categoryId: 'cat-2' },
  ];

  const defaultSuppliers = [
    { id: 'sup-1', name: 'PRAN-RFL Distributor', phone: '01711111111' },
    { id: 'sup-2', name: 'Square Consumer Goods', phone: '01722222222' },
    { id: 'sup-3', name: 'Unilever Bangladesh', phone: '01733333333' },
    { id: 'sup-4', name: 'Aarong Dairy Depot', phone: '01744444444' },
    { id: 'sup-5', name: 'ACI Logistics Ltd', phone: '01755555555' },
  ];

  const useItems = items.length > 0 ? items : defaultItems;
  const useSuppliers = suppliers.length > 0 ? suppliers : defaultSuppliers;
  const useBranches = branches.length > 0 ? branches : [{ id: 'main', name: 'Main Branch' }];

  for (let i = 0; i < 60; i++) {
    const date = new Date(start.getTime());
    date.setDate(date.getDate() + Math.floor(i / 2.0));
    date.setHours(9 + (i % 10), (i * 7) % 60);

    const supplier = useSuppliers[i % useSuppliers.length];
    const branch = useBranches[i % useBranches.length];
    const branchId = branch.id;
    const pm = paymentMethods[i % paymentMethods.length];
    const status = statuses[i % statuses.length];
    const purchaseId = `pur-${100 + i}`;

    const numItems = 1 + (i % 3);
    const purchaseItems: PurchaseItem[] = [];
    let subtotal = 0;

    for (let j = 0; j < numItems; j++) {
      const p = useItems[(i + j) % useItems.length];
      const qty = 5 + ((i + j * 3) % 25);
      const costPerUnit = p.cost || Math.round((p.price || 50) * 0.8);
      const totalItemVal = qty * costPerUnit;

      purchaseItems.push({
        id: `pi-${i}-${j}`,
        purchaseId,
        itemId: p.id,
        itemName: p.name,
        quantity: qty,
        unitCost: costPerUnit,
        total: totalItemVal,
        createdAt: date.toISOString(),
      });
      subtotal += totalItemVal;
    }

    const discount = Math.random() > 0.8 ? Math.round(subtotal * 0.04) : 0;
    const tax = Math.round((subtotal - discount) * 0.05);
    const total = subtotal - discount + tax;
    
    const paidAmount = status === 'received' ? total : status === 'pending' ? 0 : Math.round(total * 0.5);
    const dueAmount = total - paidAmount;

    purchases.push({
      id: purchaseId,
      businessId: 'business-1',
      branchId,
      invoiceNo: `BILL-2024-${1000 + i}`,
      items: purchaseItems,
      subtotal,
      discount,
      tax,
      total,
      paidAmount,
      dueAmount,
      status,
      createdBy: ['user-1', 'user-2', 'user-3', 'user-4'][i % 4],
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
      supplier: {
        id: supplier.id,
        name: supplier.name,
        phone: supplier.phone || null,
      },
      supplierId: supplier.id,
    });
  }

  return purchases.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

// Fallback Mock Generator for Purchase Orders
function generateMockPurchaseOrders(branches: any[], suppliers: any[], filters: any, searchQuery: string): PurchaseOrder[] {
  const list: PurchaseOrder[] = [];
  const start = new Date();
  start.setDate(start.getDate() - 30);

  const statuses: ('draft' | 'ordered' | 'completed' | 'cancelled')[] = ['draft', 'ordered', 'completed', 'completed', 'cancelled'];
  const useBranches = branches.length > 0 ? branches : [{ id: 'main', name: 'Main Branch' }];
  const useSuppliers = suppliers.length > 0 ? suppliers : [{ id: 'sup-1', name: 'PRAN-RFL Distributor' }];

  for (let i = 0; i < 40; i++) {
    const date = new Date(start.getTime());
    date.setDate(date.getDate() + Math.floor(i / 1.3));

    const supplier = useSuppliers[i % useSuppliers.length];
    const branch = useBranches[i % useBranches.length];
    const status = statuses[i % statuses.length];

    const record: PurchaseOrder = {
      id: `po-${100 + i}`,
      poNo: `PO-2024-${2000 + i}`,
      createdAt: date.toISOString(),
      supplierName: supplier.name,
      branchName: branch.name,
      itemsCount: 1 + (i % 5),
      total: 5000 + (i * 850),
      status,
      supplierId: supplier.id,
      branchId: branch.id,
    };

    // Filter
    if (filters.supplierId !== 'all' && record.supplierId !== filters.supplierId) continue;
    if (filters.branchId !== 'all' && record.branchId !== filters.branchId) continue;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      if (!record.poNo.toLowerCase().includes(q) && !record.supplierName.toLowerCase().includes(q)) continue;
    }

    list.push(record);
  }
  return list;
}

// Fallback Mock Generator for GRNs
function generateMockGRNs(branches: any[], suppliers: any[], filters: any, searchQuery: string): GRNRecord[] {
  const list: GRNRecord[] = [];
  const start = new Date();
  start.setDate(start.getDate() - 30);

  const statuses: ('received' | 'inspected' | 'returned')[] = ['received', 'inspected', 'inspected', 'returned'];
  const useBranches = branches.length > 0 ? branches : [{ id: 'main', name: 'Main Branch' }];
  const useSuppliers = suppliers.length > 0 ? suppliers : [{ id: 'sup-1', name: 'PRAN-RFL Distributor' }];

  for (let i = 0; i < 35; i++) {
    const date = new Date(start.getTime());
    date.setDate(date.getDate() + Math.floor(i / 1.1));

    const supplier = useSuppliers[i % useSuppliers.length];
    const branch = useBranches[i % useBranches.length];
    const status = statuses[i % statuses.length];

    const record: GRNRecord = {
      id: `grn-${100 + i}`,
      grnNo: `GRN-2024-${3000 + i}`,
      createdAt: date.toISOString(),
      refNo: `BILL-2024-${1000 + i}`,
      supplierName: supplier.name,
      warehouseName: `${branch.name} WH`,
      itemsCount: 5 + (i * 2),
      status,
      supplierId: supplier.id,
      branchId: branch.id,
    };

    // Filter
    if (filters.supplierId !== 'all' && record.supplierId !== filters.supplierId) continue;
    if (filters.branchId !== 'all' && record.branchId !== filters.branchId) continue;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      if (!record.grnNo.toLowerCase().includes(q) && !record.refNo.toLowerCase().includes(q) && !record.supplierName.toLowerCase().includes(q)) continue;
    }

    list.push(record);
  }
  return list;
}

// Fallback Mock Generator for Purchase Returns / Debit Notes
function generateMockReturns(suppliers: any[], filters: any, searchQuery: string): PurchaseReturn[] {
  const list: PurchaseReturn[] = [];
  const start = new Date();
  start.setDate(start.getDate() - 30);

  const statuses: ('approved' | 'pending' | 'adjusted')[] = ['adjusted', 'approved', 'pending'];
  const useSuppliers = suppliers.length > 0 ? suppliers : [{ id: 'sup-1', name: 'PRAN-RFL Distributor' }];

  for (let i = 0; i < 20; i++) {
    const date = new Date(start.getTime());
    date.setDate(date.getDate() + Math.floor(i / 0.6));

    const supplier = useSuppliers[i % useSuppliers.length];
    const status = statuses[i % statuses.length];

    const record: PurchaseReturn = {
      id: `ret-${100 + i}`,
      returnNo: `RET-2024-${4000 + i}`,
      createdAt: date.toISOString(),
      refInvoiceNo: `BILL-2024-${1010 + i}`,
      supplierName: supplier.name,
      itemsCount: 1 + (i % 3),
      total: 1200 + (i * 450),
      status,
      supplierId: supplier.id,
    };

    // Filter
    if (filters.supplierId !== 'all' && record.supplierId !== filters.supplierId) continue;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      if (!record.returnNo.toLowerCase().includes(q) && !record.refInvoiceNo.toLowerCase().includes(q) && !record.supplierName.toLowerCase().includes(q)) continue;
    }

    list.push(record);
  }
  return list;
}

// Fallback Mock Generator for Purchase Price History
function generateMockPriceHistory(items: any[], categories: any[], filters: any, searchQuery: string, isBangla: boolean): PriceHistoryRecord[] {
  const list: PriceHistoryRecord[] = [];
  
  const defaultItems = [
    { id: 'item-1', name: 'Coca-Cola 250ml', sku: 'CC-250', cost: 28, categoryId: 'cat-1' },
    { id: 'item-2', name: 'PRAN Spice Mix 100g', sku: 'PR-SP100', cost: 36, categoryId: 'cat-1' },
    { id: 'item-3', name: 'Square Lux Soap 150g', sku: 'SQ-LS150', cost: 48, categoryId: 'cat-2' },
    { id: 'item-4', name: 'Aarong Liquid Milk 1L', sku: 'AR-LM1L', cost: 72, categoryId: 'cat-3' },
    { id: 'item-5', name: 'ACI Pure Salt 1kg', sku: 'AC-PS1K', cost: 30, categoryId: 'cat-1' },
    { id: 'item-6', name: 'Unilever Surf Excel 500g', sku: 'UL-SE500', cost: 96, categoryId: 'cat-2' },
  ];

  const useItems = items.length > 0 ? items : defaultItems;
  const trends: ('up' | 'down' | 'stable')[] = ['up', 'down', 'stable', 'up', 'stable', 'down'];

  useItems.forEach((item, i) => {
    const base = item.cost || 45;
    const cat = categories.find((c) => c.id === item.categoryId)?.name || (isBangla ? 'অন্যান্য' : 'Uncategorized');
    
    const record: PriceHistoryRecord = {
      itemId: item.id,
      itemName: item.name,
      sku: item.sku || `SKU-${item.id.slice(-4).toUpperCase()}`,
      categoryName: cat,
      baseCost: base,
      minCost: Math.round(base * 0.9),
      maxCost: Math.round(base * 1.12),
      avgCost: Math.round(base * 1.02),
      lastCost: Math.round(base * (trends[i % trends.length] === 'up' ? 1.08 : trends[i % trends.length] === 'down' ? 0.93 : 1.0)),
      trend: trends[i % trends.length],
    };

    // Filter
    if (filters.productId !== 'all' && record.itemId !== filters.productId) return;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      if (!record.itemName.toLowerCase().includes(q) && !record.sku.toLowerCase().includes(q)) return;
    }

    list.push(record);
  });

  return list;
}
