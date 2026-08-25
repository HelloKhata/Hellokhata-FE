// Hello Khata OS - Branch Reports Dashboard Page
// হ্যালো খাতা - শাখা রিপোর্ট ড্যাশবোর্ড পেজ

'use client';

import { useState, useMemo } from 'react';
import { PageHeader, StatCard, EmptyState } from '@/components/common';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
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
  Building2,
  TrendingUp,
  DollarSign,
  Calendar as CalendarIcon,
  RefreshCw,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  X,
  Printer,
  Download,
  FileSpreadsheet,
  FileText,
  ShoppingBag,
  Package,
  Receipt,
  BarChart3,
  Users,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Store,
  Warehouse,
  Landmark,
  Percent,
  TrendingDown,
  Target,
  Sparkles,
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  useBranches,
  useSales,
  useItems,
} from '@/hooks/queries';
import { useCurrency, useAppTranslation } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import { useSessionStore } from '@/stores/sessionStore';
import { PrintReportPreview, type ReportColumn } from '@/components/reports/PrintReportPreview';

// Mock Data Types
interface BranchPerformanceRecord {
  branchId: string;
  branchName: string;
  code: string;
  type: string;
  sales: number;
  purchases: number;
  expenses: number;
  netProfit: number;
  staffCount: number;
  status: 'active' | 'inactive';
}

interface BranchSalesRecord {
  branchId: string;
  branchName: string;
  ordersCount: number;
  grossSales: number;
  discounts: number;
  tax: number;
  netSales: number;
  avgOrderValue: number;
}

interface BranchPurchasesRecord {
  branchId: string;
  branchName: string;
  ordersCount: number;
  grossCost: number;
  otherCosts: number;
  netPurchases: number;
  supplierCount: number;
}

interface BranchProfitRecord {
  branchId: string;
  branchName: string;
  salesRevenue: number;
  cogs: number;
  grossProfit: number;
  operatingExpenses: number;
  netProfit: number;
  netMarginPct: number;
}

interface BranchExpensesRecord {
  branchId: string;
  branchName: string;
  rentUtilities: number;
  salaries: number;
  operations: number;
  marketing: number;
  totalExpenses: number;
  expenseToRevenuePct: number;
}

interface BranchInventoryRecord {
  branchId: string;
  branchName: string;
  skuCount: number;
  totalQty: number;
  lowStockAlerts: number;
  costValuation: number;
  retailValuation: number;
}

interface BranchComparisonRecord {
  branchId: string;
  branchName: string;
  salesSharePct: number;
  profitSharePct: number;
  inventorySharePct: number;
  salesPerStaff: number;
  growthIndex: string;
}

export default function BranchesReportsDashboard() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const { toast } = useToast();
  const { business, user } = useSessionStore();

  // Queries
  const { data: branches = [], isLoading: branchesLoading, refetch: refetchBranches } = useBranches();
  const { data: sales = [], isLoading: salesLoading } = useSales();
  const { data: items = [], isLoading: itemsLoading } = useItems();

  // Loading state helper
  const isPageLoading = branchesLoading || salesLoading || itemsLoading;

  // Active Tab state
  const [activeTab, setActiveTab] = useState<string>('performance');

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
  const [selectedType, setSelectedType] = useState<string>('all');

  // Local filter copy for "Apply Filters" pattern
  const [activeFilters, setActiveFilters] = useState<{
    period: '7d' | '30d' | '90d' | '1y' | 'custom';
    dateRange: { from?: Date; to?: Date };
    branchId: string;
    type: string;
  }>({
    period: '30d',
    dateRange: { from: undefined, to: undefined },
    branchId: 'all',
    type: 'all',
  });

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
      type: selectedType,
    });
    toast({
      title: isBangla ? 'ফিল্টার প্রয়োগ করা হয়েছে' : 'Filters Applied',
      description: isBangla ? 'আপনার নির্বাচিত ফিল্টারের ভিত্তিতে শাখা রিপোর্ট আপডেট করা হয়েছে।' : 'Branch report filters refreshed against new filter set.',
    });
  };

  // Reset filters action
  const handleResetFilters = () => {
    setSearchQuery('');
    setPeriod('30d');
    setDateRange({ from: undefined, to: undefined });
    setSelectedBranchId('all');
    setSelectedType('all');

    setActiveFilters({
      period: '30d',
      dateRange: { from: undefined, to: undefined },
      branchId: 'all',
      type: 'all',
    });
    
    toast({
      title: isBangla ? 'রিসেট সম্পন্ন' : 'Filters Cleared',
      description: isBangla ? 'সকল ফিল্টার ডিফল্ট মানে রিসেট করা হয়েছে।' : 'All branch reporting filters returned to baseline.',
    });
  };

  // Re-establish hook server connections
  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetchBranches();
      toast({
        title: isBangla ? 'রিলোড সম্পন্ন' : 'Sync Completed',
        description: isBangla ? 'সার্ভার থেকে সফলভাবে সর্বশেষ শাখা ডেটা লোড করা হয়েছে।' : 'Latest branch data synchronized from server.',
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Mock Data Generators for 7 Tabs
  const mockPerformance = useMemo(() => {
    return generateMockPerformance(branches, activeFilters, searchQuery);
  }, [branches, activeFilters, searchQuery]);

  const mockSales = useMemo(() => {
    return generateMockBranchSales(branches, activeFilters, searchQuery);
  }, [branches, activeFilters, searchQuery]);

  const mockPurchases = useMemo(() => {
    return generateMockBranchPurchases(branches, activeFilters, searchQuery);
  }, [branches, activeFilters, searchQuery]);

  const mockProfit = useMemo(() => {
    return generateMockBranchProfit(branches, activeFilters, searchQuery);
  }, [branches, activeFilters, searchQuery]);

  const mockExpenses = useMemo(() => {
    return generateMockBranchExpenses(branches, activeFilters, searchQuery);
  }, [branches, activeFilters, searchQuery]);

  const mockInventory = useMemo(() => {
    return generateMockBranchInventory(branches, activeFilters, searchQuery);
  }, [branches, activeFilters, searchQuery]);

  const mockComparison = useMemo(() => {
    return generateMockBranchComparison(branches, activeFilters, searchQuery);
  }, [branches, activeFilters, searchQuery]);

  // Tab-Specific KPI Summaries
  const performanceKpis = useMemo(() => {
    const totalSales = mockPerformance.reduce((acc, curr) => acc + curr.sales, 0);
    const totalPurchases = mockPerformance.reduce((acc, curr) => acc + curr.purchases, 0);
    const totalExpenses = mockPerformance.reduce((acc, curr) => acc + curr.expenses, 0);
    const totalProfit = mockPerformance.reduce((acc, curr) => acc + curr.netProfit, 0);
    const activeCount = mockPerformance.filter(b => b.status === 'active').length;
    const totalStaff = mockPerformance.reduce((acc, curr) => acc + curr.staffCount, 0);
    return { totalSales, totalPurchases, totalExpenses, totalProfit, activeCount, totalStaff, count: mockPerformance.length };
  }, [mockPerformance]);

  const salesKpis = useMemo(() => {
    const totalInvoices = mockSales.reduce((acc, curr) => acc + curr.ordersCount, 0);
    const grossSales = mockSales.reduce((acc, curr) => acc + curr.grossSales, 0);
    const totalDiscounts = mockSales.reduce((acc, curr) => acc + curr.discounts, 0);
    const totalTax = mockSales.reduce((acc, curr) => acc + curr.tax, 0);
    const netSales = mockSales.reduce((acc, curr) => acc + curr.netSales, 0);
    const avgTicket = totalInvoices > 0 ? Math.round(netSales / totalInvoices) : 0;
    const maxSales = Math.max(...mockSales.map(s => s.netSales), 1);
    return { totalInvoices, grossSales, totalDiscounts, totalTax, netSales, avgTicket, maxSales };
  }, [mockSales]);

  const purchasesKpis = useMemo(() => {
    const totalPOs = mockPurchases.reduce((acc, curr) => acc + curr.ordersCount, 0);
    const grossCost = mockPurchases.reduce((acc, curr) => acc + curr.grossCost, 0);
    const otherCosts = mockPurchases.reduce((acc, curr) => acc + curr.otherCosts, 0);
    const netPurchases = mockPurchases.reduce((acc, curr) => acc + curr.netPurchases, 0);
    const totalSuppliers = mockPurchases.reduce((acc, curr) => acc + curr.supplierCount, 0);
    return { totalPOs, grossCost, otherCosts, netPurchases, totalSuppliers };
  }, [mockPurchases]);

  const profitKpis = useMemo(() => {
    const totalRevenue = mockProfit.reduce((acc, curr) => acc + curr.salesRevenue, 0);
    const totalCOGS = mockProfit.reduce((acc, curr) => acc + curr.cogs, 0);
    const grossProfit = mockProfit.reduce((acc, curr) => acc + curr.grossProfit, 0);
    const opExpenses = mockProfit.reduce((acc, curr) => acc + curr.operatingExpenses, 0);
    const netProfit = mockProfit.reduce((acc, curr) => acc + curr.netProfit, 0);
    const avgMarginPct = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
    return { totalRevenue, totalCOGS, grossProfit, opExpenses, netProfit, avgMarginPct };
  }, [mockProfit]);

  const expensesKpis = useMemo(() => {
    const rent = mockExpenses.reduce((acc, curr) => acc + curr.rentUtilities, 0);
    const salaries = mockExpenses.reduce((acc, curr) => acc + curr.salaries, 0);
    const ops = mockExpenses.reduce((acc, curr) => acc + curr.operations, 0);
    const marketing = mockExpenses.reduce((acc, curr) => acc + curr.marketing, 0);
    const totalExp = mockExpenses.reduce((acc, curr) => acc + curr.totalExpenses, 0);
    const avgExpRatio = mockExpenses.length > 0 ? mockExpenses.reduce((acc, curr) => acc + curr.expenseToRevenuePct, 0) / mockExpenses.length : 0;
    return { rent, salaries, ops, marketing, totalExp, avgExpRatio };
  }, [mockExpenses]);

  const inventoryKpis = useMemo(() => {
    const totalSkus = mockInventory.reduce((acc, curr) => acc + curr.skuCount, 0);
    const totalStock = mockInventory.reduce((acc, curr) => acc + curr.totalQty, 0);
    const lowStockAlerts = mockInventory.reduce((acc, curr) => acc + curr.lowStockAlerts, 0);
    const costValuation = mockInventory.reduce((acc, curr) => acc + curr.costValuation, 0);
    const retailValuation = mockInventory.reduce((acc, curr) => acc + curr.retailValuation, 0);
    return { totalSkus, totalStock, lowStockAlerts, costValuation, retailValuation };
  }, [mockInventory]);

  const comparisonKpis = useMemo(() => {
    const topBranch = mockComparison.length > 0 ? [...mockComparison].sort((a, b) => b.salesSharePct - a.salesSharePct)[0] : null;
    const avgSalesPerStaff = mockComparison.length > 0 ? Math.round(mockComparison.reduce((acc, curr) => acc + curr.salesPerStaff, 0) / mockComparison.length) : 0;
    return { topBranch, avgSalesPerStaff, count: mockComparison.length };
  }, [mockComparison]);

  // Pagination states
  const [perfPage, setPerfPage] = useState(1);
  const [salesPage, setSalesPage] = useState(1);
  const [purchasesPage, setPurchasesPage] = useState(1);
  const [profitPage, setProfitPage] = useState(1);
  const [expensesPage, setExpensesPage] = useState(1);
  const [inventoryPage, setInventoryPage] = useState(1);
  const [comparisonPage, setComparisonPage] = useState(1);
  const itemsPerPage = 10;

  const paginatedPerf = useMemo(() => {
    const start = (perfPage - 1) * itemsPerPage;
    return mockPerformance.slice(start, start + itemsPerPage);
  }, [mockPerformance, perfPage]);

  const paginatedSales = useMemo(() => {
    const start = (salesPage - 1) * itemsPerPage;
    return mockSales.slice(start, start + itemsPerPage);
  }, [mockSales, salesPage]);

  const paginatedPurchases = useMemo(() => {
    const start = (purchasesPage - 1) * itemsPerPage;
    return mockPurchases.slice(start, start + itemsPerPage);
  }, [mockPurchases, purchasesPage]);

  const paginatedProfit = useMemo(() => {
    const start = (profitPage - 1) * itemsPerPage;
    return mockProfit.slice(start, start + itemsPerPage);
  }, [mockProfit, profitPage]);

  const paginatedExpenses = useMemo(() => {
    const start = (expensesPage - 1) * itemsPerPage;
    return mockExpenses.slice(start, start + itemsPerPage);
  }, [mockExpenses, expensesPage]);

  const paginatedInventory = useMemo(() => {
    const start = (inventoryPage - 1) * itemsPerPage;
    return mockInventory.slice(start, start + itemsPerPage);
  }, [mockInventory, inventoryPage]);

  const paginatedComparison = useMemo(() => {
    const start = (comparisonPage - 1) * itemsPerPage;
    return mockComparison.slice(start, start + itemsPerPage);
  }, [mockComparison, comparisonPage]);

  // Active Advanced Count
  const activeAdvancedCount = useMemo(() => {
    let count = 0;
    if (activeFilters.type !== 'all') count++;
    return count;
  }, [activeFilters]);

  // Active Filter Chips
  const activeFilterChips = useMemo(() => {
    const chips: { key: string; label: string; valueText: string }[] = [];
    
    if (activeFilters.branchId !== 'all') {
      const name = branches.find(b => b.id === activeFilters.branchId)?.name || 'Main Branch';
      chips.push({ key: 'branchId', label: isBangla ? 'শাখা' : 'Branch', valueText: name });
    }
    if (activeFilters.type !== 'all') {
      chips.push({ key: 'type', label: isBangla ? 'টাইপ' : 'Type', valueText: activeFilters.type });
    }

    return chips;
  }, [activeFilters, branches, isBangla]);

  const handleRemoveFilter = (key: string) => {
    if (key === 'branchId') {
      setSelectedBranchId('all');
      setActiveFilters(prev => ({ ...prev, branchId: 'all' }));
    } else if (key === 'type') {
      setSelectedType('all');
      setActiveFilters(prev => ({ ...prev, type: 'all' }));
    }
  };

  // Dynamic Print Columns mapping based on activeTab
  const printColumns = useMemo<ReportColumn<any>[]>(() => {
    if (activeTab === 'performance') {
      return [
        { header: 'Branch Name', headerBn: 'শাখার নাম', accessor: (row: BranchPerformanceRecord) => row.branchName },
        { header: 'Code', headerBn: 'কোড', accessor: (row: BranchPerformanceRecord) => row.code },
        { header: 'Type', headerBn: 'টাইপ', accessor: (row: BranchPerformanceRecord) => row.type },
        { header: 'Total Sales', headerBn: 'মোট বিক্রয়', accessor: (row: BranchPerformanceRecord) => formatCurrency(row.sales), align: 'right' },
        { header: 'Total Purchases', headerBn: 'মোট ক্রয়', accessor: (row: BranchPerformanceRecord) => formatCurrency(row.purchases), align: 'right' },
        { header: 'Total Expenses', headerBn: 'মোট খরচ', accessor: (row: BranchPerformanceRecord) => formatCurrency(row.expenses), align: 'right' },
        { header: 'Net Profit', headerBn: 'নিট লাভ', accessor: (row: BranchPerformanceRecord) => formatCurrency(row.netProfit), align: 'right', footer: formatCurrency(performanceKpis.totalProfit) }
      ];
    } else if (activeTab === 'sales') {
      return [
        { header: 'Branch Name', headerBn: 'শাখার নাম', accessor: (row: BranchSalesRecord) => row.branchName },
        { header: 'Invoices Count', headerBn: 'চালান সংখ্যা', accessor: (row: BranchSalesRecord) => row.ordersCount.toString(), align: 'center' },
        { header: 'Gross Sales', headerBn: 'গ্রস বিক্রয়', accessor: (row: BranchSalesRecord) => formatCurrency(row.grossSales), align: 'right' },
        { header: 'Discounts', headerBn: 'ছাড়', accessor: (row: BranchSalesRecord) => formatCurrency(row.discounts), align: 'right' },
        { header: 'Tax Collected', headerBn: 'ট্যাক্স/ভ্যাট', accessor: (row: BranchSalesRecord) => formatCurrency(row.tax), align: 'right' },
        { header: 'Net Sales Revenue', headerBn: 'নিট বিক্রয় রাজস্ব', accessor: (row: BranchSalesRecord) => formatCurrency(row.netSales), align: 'right', footer: formatCurrency(salesKpis.netSales) },
        { header: 'Avg Ticket Size', headerBn: 'গড় রসিদ মূল্য', accessor: (row: BranchSalesRecord) => formatCurrency(row.avgOrderValue), align: 'right' }
      ];
    } else if (activeTab === 'purchases') {
      return [
        { header: 'Branch Name', headerBn: 'শাখার নাম', accessor: (row: BranchPurchasesRecord) => row.branchName },
        { header: 'PO Count', headerBn: 'অর্ডার সংখ্যা', accessor: (row: BranchPurchasesRecord) => row.ordersCount.toString(), align: 'center' },
        { header: 'Gross Cost', headerBn: 'মূল ক্রয় খরচ', accessor: (row: BranchPurchasesRecord) => formatCurrency(row.grossCost), align: 'right' },
        { header: 'Freight / Other', headerBn: 'পরিবহন ও অন্যান্য', accessor: (row: BranchPurchasesRecord) => formatCurrency(row.otherCosts), align: 'right' },
        { header: 'Net Purchase Volume', headerBn: 'মোট ক্রয় পরিমাণ', accessor: (row: BranchPurchasesRecord) => formatCurrency(row.netPurchases), align: 'right', footer: formatCurrency(purchasesKpis.netPurchases) },
        { header: 'Suppliers Count', headerBn: 'সরবরাহকারী সংখ্যা', accessor: (row: BranchPurchasesRecord) => row.supplierCount.toString(), align: 'center' }
      ];
    } else if (activeTab === 'profit') {
      return [
        { header: 'Branch Name', headerBn: 'শাখার নাম', accessor: (row: BranchProfitRecord) => row.branchName },
        { header: 'Sales Revenue', headerBn: 'বিক্রয় রাজস্ব', accessor: (row: BranchProfitRecord) => formatCurrency(row.salesRevenue), align: 'right' },
        { header: 'COGS', headerBn: 'পণ্য উৎপাদন/ক্রয় খরচ', accessor: (row: BranchProfitRecord) => formatCurrency(row.cogs), align: 'right' },
        { header: 'Gross Profit', headerBn: 'গ্রস লাভ', accessor: (row: BranchProfitRecord) => formatCurrency(row.grossProfit), align: 'right' },
        { header: 'Operating Expenses', headerBn: 'পরিচালন খরচ', accessor: (row: BranchProfitRecord) => formatCurrency(row.operatingExpenses), align: 'right' },
        { header: 'Net Profit', headerBn: 'নিট লাভ', accessor: (row: BranchProfitRecord) => formatCurrency(row.netProfit), align: 'right', footer: formatCurrency(profitKpis.netProfit) },
        { header: 'Net Margin %', headerBn: 'নিট মার্জিন %', accessor: (row: BranchProfitRecord) => `${row.netMarginPct.toFixed(1)}%`, align: 'right' }
      ];
    } else if (activeTab === 'expenses') {
      return [
        { header: 'Branch Name', headerBn: 'শাখার নাম', accessor: (row: BranchExpensesRecord) => row.branchName },
        { header: 'Rent & Utilities', headerBn: 'ভাড়া ও উপযোগিতা', accessor: (row: BranchExpensesRecord) => formatCurrency(row.rentUtilities), align: 'right' },
        { header: 'Salaries & Wages', headerBn: 'বেতন ও মজুরি', accessor: (row: BranchExpensesRecord) => formatCurrency(row.salaries), align: 'right' },
        { header: 'Operations', headerBn: 'পরিচালন ব্যয়', accessor: (row: BranchExpensesRecord) => formatCurrency(row.operations), align: 'right' },
        { header: 'Marketing', headerBn: 'মার্কেটিং', accessor: (row: BranchExpensesRecord) => formatCurrency(row.marketing), align: 'right' },
        { header: 'Total Expenses', headerBn: 'মোট খরচ', accessor: (row: BranchExpensesRecord) => formatCurrency(row.totalExpenses), align: 'right', footer: formatCurrency(expensesKpis.totalExp) },
        { header: 'Exp / Rev Ratio', headerBn: 'খরচ-রাজস্ব অনুপাত', accessor: (row: BranchExpensesRecord) => `${row.expenseToRevenuePct.toFixed(1)}%`, align: 'right' }
      ];
    } else if (activeTab === 'inventory') {
      return [
        { header: 'Branch Name', headerBn: 'শাখার নাম', accessor: (row: BranchInventoryRecord) => row.branchName },
        { header: 'SKU Count', headerBn: 'এসকেইউ সংখ্যা', accessor: (row: BranchInventoryRecord) => row.skuCount.toString(), align: 'center' },
        { header: 'Total Stock Qty', headerBn: 'মোট মজুদ পরিমাণ', accessor: (row: BranchInventoryRecord) => row.totalQty.toString(), align: 'right' },
        { header: 'Low Stock Alerts', headerBn: 'কম স্টক সতর্কতা', accessor: (row: BranchInventoryRecord) => row.lowStockAlerts.toString(), align: 'center' },
        { header: 'Cost Valuation', headerBn: 'ক্রয় মূল্যায়ন', accessor: (row: BranchInventoryRecord) => formatCurrency(row.costValuation), align: 'right' },
        { header: 'Retail Valuation', headerBn: 'খুচরা বিক্রয় মূল্যায়ন', accessor: (row: BranchInventoryRecord) => formatCurrency(row.retailValuation), align: 'right', footer: formatCurrency(inventoryKpis.retailValuation) }
      ];
    } else if (activeTab === 'comparison') {
      return [
        { header: 'Branch Name', headerBn: 'শাখার নাম', accessor: (row: BranchComparisonRecord) => row.branchName },
        { header: 'Sales Share %', headerBn: 'বিক্রয় শেয়ার %', accessor: (row: BranchComparisonRecord) => `${row.salesSharePct.toFixed(1)}%`, align: 'right' },
        { header: 'Profit Share %', headerBn: 'লাভের শেয়ার %', accessor: (row: BranchComparisonRecord) => `${row.profitSharePct.toFixed(1)}%`, align: 'right' },
        { header: 'Inventory Share %', headerBn: 'স্টক শেয়ার %', accessor: (row: BranchComparisonRecord) => `${row.inventorySharePct.toFixed(1)}%`, align: 'right' },
        { header: 'Rev / Staff', headerBn: 'কর্মী প্রতি রাজস্ব', accessor: (row: BranchComparisonRecord) => formatCurrency(row.salesPerStaff), align: 'right' },
        { header: 'Growth Index', headerBn: 'গ্রোথ সূচক', accessor: (row: BranchComparisonRecord) => row.growthIndex, align: 'center' }
      ];
    } else {
      return [];
    }
  }, [activeTab, performanceKpis, salesKpis, purchasesKpis, profitKpis, expensesKpis, inventoryKpis, formatCurrency]);

  const printDataArray = useMemo(() => {
    if (activeTab === 'performance') return mockPerformance;
    if (activeTab === 'sales') return mockSales;
    if (activeTab === 'purchases') return mockPurchases;
    if (activeTab === 'profit') return mockProfit;
    if (activeTab === 'expenses') return mockExpenses;
    if (activeTab === 'inventory') return mockInventory;
    if (activeTab === 'comparison') return mockComparison;
    return [];
  }, [activeTab, mockPerformance, mockSales, mockPurchases, mockProfit, mockExpenses, mockInventory, mockComparison]);

  const getTypeBadgeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'warehouse':
        return <Warehouse className="h-3 w-3 mr-1 text-amber-600" />;
      case 'headquarters':
      case 'hq':
        return <Landmark className="h-3 w-3 mr-1 text-purple-600" />;
      default:
        return <Store className="h-3 w-3 mr-1 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Branch Reports"
        titleBn="শাখা রিপোর্ট"
        subtitle="Comprehensive multi-outlet performance analytics, cross-branch sales, profit comparison, and inventory holding distribution."
        subtitleBn="শাখাভিত্তিক পারফরম্যান্স বিশ্লেষণ, বিক্রয়, লাভ-ক্ষতি, পরিচালন খরচ এবং ইনভেন্টরি ডিস্ট্রিবিউশন পর্যবেক্ষণ করুন।"
        icon={Building2}
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
                description: `Excel export completed for branch ${activeTab.toUpperCase()} report.`,
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
                description: `CSV export completed for branch ${activeTab.toUpperCase()} report.`,
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
              {/* Search Branch */}
              <div className="relative w-full md:w-60 shrink-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={isBangla ? 'শাখার নাম বা কোড খুঁজুন...' : 'Search branch name, code...'}
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
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-muted/50 mt-3 animate-fadeIn">
              
              {/* Type Selector */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-muted-foreground">{isBangla ? 'শাখার ধরণ' : 'Branch Type'}</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="bg-background text-xs h-9 w-full flex items-center justify-between">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isBangla ? 'সব ধরণ' : 'All Types'}</SelectItem>
                    <SelectItem value="retail">{isBangla ? 'খুচরা শোরুম (Retail)' : 'Retail Outlet'}</SelectItem>
                    <SelectItem value="warehouse">{isBangla ? 'গোডাউন (Warehouse)' : 'Warehouse'}</SelectItem>
                    <SelectItem value="headquarters">{isBangla ? 'প্রধান কার্যালয় (HQ)' : 'Headquarters'}</SelectItem>
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
                  className="h-6 gap-1 text-[10px] font-semibold bg-indigo-50 text-indigo-950 hover:bg-indigo-100 border border-indigo-100 pl-2 pr-1 rounded-full shrink-0 dark:bg-indigo-950/40 dark:text-indigo-200 dark:border-indigo-800"
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-card animate-pulse rounded-xl border border-border/50" />
            ))}
          </div>
          <div className="h-[350px] bg-card animate-pulse rounded-xl border border-border/50" />
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          
          {/* Tabs header list - 7 triggers with count badges */}
          <TabsList className="bg-muted/80 text-muted-foreground border p-1 rounded-xl w-full flex overflow-x-auto select-none scrollbar-none h-auto flex-nowrap shrink-0 shadow-inner">
            <TabsTrigger value="performance" className="text-xs font-bold gap-1.5 px-3.5 py-2 shrink-0 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
              <Building2 className="h-3.5 w-3.5 text-indigo-500" />
              {isBangla ? 'শাখা পারফরম্যান্স' : 'Branch Performance'}
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0 font-normal bg-muted text-muted-foreground">
                {mockPerformance.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="sales" className="text-xs font-bold gap-1.5 px-3.5 py-2 shrink-0 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              {isBangla ? 'শাখা বিক্রয়' : 'Branch Sales'}
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0 font-normal bg-muted text-muted-foreground">
                {mockSales.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="purchases" className="text-xs font-bold gap-1.5 px-3.5 py-2 shrink-0 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
              <ShoppingBag className="h-3.5 w-3.5 text-blue-500" />
              {isBangla ? 'শাখা ক্রয়' : 'Branch Purchases'}
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0 font-normal bg-muted text-muted-foreground">
                {mockPurchases.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="profit" className="text-xs font-bold gap-1.5 px-3.5 py-2 shrink-0 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
              <DollarSign className="h-3.5 w-3.5 text-teal-500" />
              {isBangla ? 'শাখা লাভ-ক্ষতি' : 'Branch Profit'}
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0 font-normal bg-muted text-muted-foreground">
                {mockProfit.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="expenses" className="text-xs font-bold gap-1.5 px-3.5 py-2 shrink-0 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
              <Receipt className="h-3.5 w-3.5 text-amber-500" />
              {isBangla ? 'শাখা পরিচালন খরচ' : 'Branch Expenses'}
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0 font-normal bg-muted text-muted-foreground">
                {mockExpenses.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="text-xs font-bold gap-1.5 px-3.5 py-2 shrink-0 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
              <Package className="h-3.5 w-3.5 text-purple-500" />
              {isBangla ? 'শাখা ইনভেন্টরি' : 'Branch Inventory'}
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0 font-normal bg-muted text-muted-foreground">
                {mockInventory.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="comparison" className="text-xs font-bold gap-1.5 px-3.5 py-2 shrink-0 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
              <BarChart3 className="h-3.5 w-3.5 text-rose-500" />
              {isBangla ? 'শাখা তুলনা' : 'Branch Comparison'}
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0 font-normal bg-muted text-muted-foreground">
                {mockComparison.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: BRANCH PERFORMANCE */}
          <TabsContent value="performance" className="outline-none space-y-6 animate-fadeIn">
            {/* StatCards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard title={isBangla ? 'সক্রিয় শাখা সংখ্যা' : 'Active Outlets'} value={`${performanceKpis.activeCount} / ${performanceKpis.count}`} icon={Building2} iconColor="text-indigo-600" />
              <StatCard title={isBangla ? 'মোট বিক্রয় রাজস্ব' : 'Total Revenue'} value={formatCurrency(performanceKpis.totalSales)} icon={TrendingUp} iconColor="text-emerald-600" />
              <StatCard title={isBangla ? 'মোট পরিচালন ব্যয়' : 'Operating Expenses'} value={formatCurrency(performanceKpis.totalExpenses)} icon={Receipt} iconColor="text-amber-600" />
              <StatCard title={isBangla ? 'সর্বমোট নিট লাভ' : 'Net Business Profit'} value={formatCurrency(performanceKpis.totalProfit)} icon={DollarSign} iconColor="text-teal-600" />
            </div>

            <Card className="shadow-sm border-border/80">
              <CardHeader className="bg-muted/20 border-b border-border/40 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-indigo-500" />
                      {isBangla ? 'শাখাভিত্তিক সার্বিক পারফরম্যান্স ওভারভিউ' : 'Branch Performance Master Ledger'}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {isBangla ? 'প্রতিটি শাখার বিক্রয়, ক্রয়, খরচ এবং নিট মুনাফার সমন্বিত চিত্র।' : 'Overview of operational turnover, costs, profit margins, and staffing per outlet.'}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-[11px] font-semibold bg-indigo-50/50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-300">
                    {mockPerformance.length} {isBangla ? 'টি শাখা' : 'Outlets'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {mockPerformance.length === 0 ? (
                  <div className="py-12">
                    <EmptyState
                      title={isBangla ? 'কোন শাখা পাওয়া যায়নি' : 'No Branches Found'}
                      description={isBangla ? 'আপনার ফিল্টারের সাথে মিলে এমন কোন শাখা নেই।' : 'No branches match the applied filters or search term.'}
                      icon={Building2}
                      action={{
                        label: isBangla ? 'ফিল্টার রিসেট করুন' : 'Reset Filters',
                        onClick: handleResetFilters,
                      }}
                    />
                  </div>
                ) : (
                  <div className="space-y-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-muted/40">
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="font-bold">{isBangla ? 'শাখার নাম' : 'Branch Name'}</TableHead>
                            <TableHead className="font-bold">{isBangla ? 'কোড' : 'Code'}</TableHead>
                            <TableHead className="font-bold">{isBangla ? 'ধরণ' : 'Type'}</TableHead>
                            <TableHead className="text-right font-bold">{isBangla ? 'মোট বিক্রয়' : 'Total Sales'}</TableHead>
                            <TableHead className="text-right font-bold">{isBangla ? 'মোট ক্রয়' : 'Total Purchases'}</TableHead>
                            <TableHead className="text-right font-bold">{isBangla ? 'মোট খরচ' : 'Total Expenses'}</TableHead>
                            <TableHead className="text-right font-bold">{isBangla ? 'নিট লাভ' : 'Net Profit'}</TableHead>
                            <TableHead className="text-center font-bold">{isBangla ? 'স্টাফ' : 'Staff'}</TableHead>
                            <TableHead className="text-center font-bold">{isBangla ? 'স্ট্যাটাস' : 'Status'}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedPerf.map((row) => (
                            <TableRow key={row.branchId} className="hover:bg-accent/40 transition-colors">
                              <TableCell className="font-bold text-foreground flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 shrink-0">
                                  {getTypeBadgeIcon(row.type)}
                                </div>
                                <span>{row.branchName}</span>
                              </TableCell>
                              <TableCell className="font-mono text-xs text-muted-foreground">{row.code}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-[10px] font-bold uppercase rounded-full px-2 py-0.5 capitalize bg-background">
                                  {row.type}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-bold text-indigo-600 dark:text-indigo-400 font-mono">{formatCurrency(row.sales)}</TableCell>
                              <TableCell className="text-right font-semibold text-muted-foreground font-mono">{formatCurrency(row.purchases)}</TableCell>
                              <TableCell className="text-right font-mono text-amber-600 dark:text-amber-400">{formatCurrency(row.expenses)}</TableCell>
                              <TableCell className={cn("text-right font-black font-mono", row.netProfit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                                <div className="flex items-center justify-end gap-1">
                                  {row.netProfit >= 0 ? <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" /> : <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />}
                                  {formatCurrency(row.netProfit)}
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge variant="secondary" className="text-[10px] font-semibold">
                                  <Users className="h-3 w-3 mr-1 text-muted-foreground" />
                                  {row.staffCount}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                <span className={cn(
                                  "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold",
                                  row.status === 'active' ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-slate-100 text-slate-600"
                                )}>
                                  <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", row.status === 'active' ? "bg-emerald-500 animate-pulse" : "bg-slate-400")} />
                                  {row.status === 'active' ? (isBangla ? 'সক্রিয়' : 'Active') : (isBangla ? 'নিষ্ক্রিয়' : 'Inactive')}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Summary Footer Row */}
                    <div className="bg-muted/30 border-t border-border px-4 py-3 flex flex-wrap items-center justify-between text-xs font-bold gap-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>{isBangla ? 'সর্বমোট বিবরণ (' : 'Total Aggregate ('}{mockPerformance.length} {isBangla ? 'টি শাখা)' : 'Branches)'}</span>
                      </div>
                      <div className="flex items-center gap-6 font-mono">
                        <div><span className="text-muted-foreground mr-1">{isBangla ? 'বিক্রয়:' : 'Sales:'}</span><span className="text-indigo-600 dark:text-indigo-400 font-black">{formatCurrency(performanceKpis.totalSales)}</span></div>
                        <div><span className="text-muted-foreground mr-1">{isBangla ? 'ক্রয়:' : 'Purchases:'}</span><span>{formatCurrency(performanceKpis.totalPurchases)}</span></div>
                        <div><span className="text-muted-foreground mr-1">{isBangla ? 'খরচ:' : 'Expenses:'}</span><span className="text-amber-600 dark:text-amber-400">{formatCurrency(performanceKpis.totalExpenses)}</span></div>
                        <div><span className="text-muted-foreground mr-1">{isBangla ? 'নিট লাভ:' : 'Net Profit:'}</span><span className="text-emerald-600 dark:text-emerald-400 font-black">{formatCurrency(performanceKpis.totalProfit)}</span></div>
                      </div>
                    </div>

                    {/* Performance Pagination */}
                    {mockPerformance.length > itemsPerPage && (
                      <div className="flex items-center justify-between p-4 border-t border-border">
                        <span className="text-xs text-muted-foreground font-semibold">
                          {isBangla ? `পৃষ্ঠা ${perfPage} এর ${Math.ceil(mockPerformance.length / itemsPerPage)}` : `Page ${perfPage} of ${Math.ceil(mockPerformance.length / itemsPerPage)}`}
                        </span>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={perfPage === 1} onClick={() => setPerfPage(p => p - 1)}>
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={perfPage >= Math.ceil(mockPerformance.length / itemsPerPage)} onClick={() => setPerfPage(p => p + 1)}>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: BRANCH SALES */}
          <TabsContent value="sales" className="outline-none space-y-6 animate-fadeIn">
            {/* Sales Tab Contextual KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard title={isBangla ? 'মোট বিক্রয় চালান' : 'Total Invoices'} value={salesKpis.totalInvoices.toLocaleString()} icon={FileText} iconColor="text-indigo-600" />
              <StatCard title={isBangla ? 'গ্রস বিক্রয় মূল্য' : 'Gross Sales'} value={formatCurrency(salesKpis.grossSales)} icon={TrendingUp} iconColor="text-blue-600" />
              <StatCard title={isBangla ? 'মোট প্রদত্ত ছাড়' : 'Total Discounts'} value={formatCurrency(salesKpis.totalDiscounts)} icon={Percent} iconColor="text-amber-600" />
              <StatCard title={isBangla ? 'নিট বিক্রয় রাজস্ব' : 'Net Sales Revenue'} value={formatCurrency(salesKpis.netSales)} icon={DollarSign} iconColor="text-emerald-600" />
            </div>

            <Card className="shadow-sm border-border/80">
              <CardHeader className="bg-muted/20 border-b border-border/40 pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  {isBangla ? 'শাখাভিত্তিক বিক্রয় হিসাব বিবরণী' : 'Branch Sales Turnover'}
                </CardTitle>
                <CardDescription className="text-xs">{isBangla ? 'শাখা অনুযায়ী মোট চালান, ছাড়, ট্যাক্স এবং নিট বিক্রয় রাজস্ব।' : 'Detailed breakdown of invoice volumes, discounts, tax collections, and net revenues per branch.'}</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {mockSales.length === 0 ? (
                  <div className="py-12">
                    <EmptyState
                      title={isBangla ? 'কোন বিক্রয় ডেটা নেই' : 'No Sales Data'}
                      description={isBangla ? 'নির্বাচিত ফিল্টারে কোন শাখার বিক্রয় তথ্য পাওয়া যায়নি।' : 'No sales records found matching the active branch filter.'}
                      icon={TrendingUp}
                      action={{
                        label: isBangla ? 'ফিল্টার রিসেট করুন' : 'Reset Filters',
                        onClick: handleResetFilters,
                      }}
                    />
                  </div>
                ) : (
                  <div className="space-y-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-muted/40">
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="font-bold">{isBangla ? 'শাখার নাম' : 'Branch Name'}</TableHead>
                            <TableHead className="text-center font-bold">{isBangla ? 'চালান সংখ্যা' : 'Invoices Count'}</TableHead>
                            <TableHead className="text-right font-bold">{isBangla ? 'গ্রস বিক্রয়' : 'Gross Sales'}</TableHead>
                            <TableHead className="text-right font-bold">{isBangla ? 'মোট ছাড়' : 'Discounts'}</TableHead>
                            <TableHead className="text-right font-bold">{isBangla ? 'ট্যাক্স/ভ্যাট' : 'Tax Collected'}</TableHead>
                            <TableHead className="text-right font-bold">{isBangla ? 'নিট বিক্রয় রাজস্ব' : 'Net Sales Revenue'}</TableHead>
                            <TableHead className="w-[120px] font-bold text-center">{isBangla ? 'শেয়ার আয়তন' : 'Volume Share'}</TableHead>
                            <TableHead className="text-right font-bold">{isBangla ? 'গড় চালান মূল্য' : 'Avg Ticket Size'}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedSales.map((row) => {
                            const sharePct = Math.min(100, Math.round((row.netSales / salesKpis.maxSales) * 100));
                            return (
                              <TableRow key={row.branchId} className="hover:bg-accent/40 transition-colors">
                                <TableCell className="font-bold text-foreground">{row.branchName}</TableCell>
                                <TableCell className="text-center font-medium">
                                  <Badge variant="outline" className="text-[10px] font-bold bg-background">
                                    {row.ordersCount}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right font-mono text-muted-foreground">{formatCurrency(row.grossSales)}</TableCell>
                                <TableCell className="text-right font-mono text-amber-600 dark:text-amber-400">{formatCurrency(row.discounts)}</TableCell>
                                <TableCell className="text-right font-mono text-muted-foreground">{formatCurrency(row.tax)}</TableCell>
                                <TableCell className="text-right font-bold text-indigo-600 dark:text-indigo-400 font-mono">{formatCurrency(row.netSales)}</TableCell>
                                <TableCell className="w-[120px]">
                                  <div className="space-y-1">
                                    <Progress value={sharePct} className="h-1.5 bg-muted" />
                                    <p className="text-[9px] text-muted-foreground text-center font-mono">{sharePct}%</p>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right font-semibold font-mono text-foreground">{formatCurrency(row.avgOrderValue)}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Summary Footer Row */}
                    <div className="bg-muted/30 border-t border-border px-4 py-3 flex flex-wrap items-center justify-between text-xs font-bold gap-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>{isBangla ? 'সর্বমোট বিক্রয়:' : 'Total Sales Aggregate:'}</span>
                      </div>
                      <div className="flex items-center gap-6 font-mono">
                        <div><span className="text-muted-foreground mr-1">{isBangla ? 'চালান:' : 'Invoices:'}</span><span className="text-foreground">{salesKpis.totalInvoices}</span></div>
                        <div><span className="text-muted-foreground mr-1">{isBangla ? 'গ্রস:' : 'Gross:'}</span><span>{formatCurrency(salesKpis.grossSales)}</span></div>
                        <div><span className="text-muted-foreground mr-1">{isBangla ? 'ছাড়:' : 'Discounts:'}</span><span className="text-amber-600">{formatCurrency(salesKpis.totalDiscounts)}</span></div>
                        <div><span className="text-muted-foreground mr-1">{isBangla ? 'নিট রাজস্ব:' : 'Net Revenue:'}</span><span className="text-indigo-600 dark:text-indigo-400 font-black">{formatCurrency(salesKpis.netSales)}</span></div>
                      </div>
                    </div>

                    {/* Sales Pagination */}
                    {mockSales.length > itemsPerPage && (
                      <div className="flex items-center justify-between p-4 border-t border-border">
                        <span className="text-xs text-muted-foreground font-semibold">
                          {isBangla ? `পৃষ্ঠা ${salesPage} এর ${Math.ceil(mockSales.length / itemsPerPage)}` : `Page ${salesPage} of ${Math.ceil(mockSales.length / itemsPerPage)}`}
                        </span>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={salesPage === 1} onClick={() => setSalesPage(p => p - 1)}>
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={salesPage >= Math.ceil(mockSales.length / itemsPerPage)} onClick={() => setSalesPage(p => p + 1)}>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: BRANCH PURCHASES */}
          <TabsContent value="purchases" className="outline-none space-y-6 animate-fadeIn">
            {/* Purchases Tab Contextual KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard title={isBangla ? 'ক্রয় আদেশ (PO)' : 'Purchase Orders'} value={purchasesKpis.totalPOs.toString()} icon={ShoppingBag} iconColor="text-blue-600" />
              <StatCard title={isBangla ? 'মূল সোর্সিং খরচ' : 'Gross Sourcing Cost'} value={formatCurrency(purchasesKpis.grossCost)} icon={DollarSign} iconColor="text-indigo-600" />
              <StatCard title={isBangla ? 'পরিবহন ও অতিরিক্ত' : 'Freight & Extra'} value={formatCurrency(purchasesKpis.otherCosts)} icon={Receipt} iconColor="text-amber-600" />
              <StatCard title={isBangla ? 'মোট ক্রয় পরিমাণ' : 'Net Purchase Volume'} value={formatCurrency(purchasesKpis.netPurchases)} icon={Package} iconColor="text-purple-600" />
            </div>

            <Card className="shadow-sm border-border/80">
              <CardHeader className="bg-muted/20 border-b border-border/40 pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-blue-500" />
                  {isBangla ? 'শাখাভিত্তিক পণ্য ক্রয় খতিয়ান' : 'Branch Procurement & Purchases'}
                </CardTitle>
                <CardDescription className="text-xs">{isBangla ? 'শাখাভিত্তিক সোর্সিং ভলিউম, পরিবহন খরচ এবং মোট ক্রয় মূল্যের বিবরণ।' : 'Audit of purchase orders, shipping expenses, and net procurement cost per branch.'}</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {mockPurchases.length === 0 ? (
                  <div className="py-12">
                    <EmptyState
                      title={isBangla ? 'কোন ক্রয় ডেটা নেই' : 'No Purchase Data'}
                      description={isBangla ? 'রিসেন্ট ফিল্টারে কোন ক্রয় তথ্য পাওয়া যায়নি।' : 'No procurement records match your selected parameters.'}
                      icon={ShoppingBag}
                      action={{
                        label: isBangla ? 'ফিল্টার রিসেট করুন' : 'Reset Filters',
                        onClick: handleResetFilters,
                      }}
                    />
                  </div>
                ) : (
                  <div className="space-y-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-muted/40">
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="font-bold">{isBangla ? 'শাখার নাম' : 'Branch Name'}</TableHead>
                            <TableHead className="text-center font-bold">{isBangla ? 'অর্ডার সংখ্যা (PO)' : 'PO Count'}</TableHead>
                            <TableHead className="text-right font-bold">{isBangla ? 'মূল ক্রয় খরচ' : 'Gross Cost'}</TableHead>
                            <TableHead className="text-right font-bold">{isBangla ? 'পরিবহন/অন্যান্য' : 'Freight / Other'}</TableHead>
                            <TableHead className="text-right font-bold">{isBangla ? 'মোট ক্রয় খরচ' : 'Net Purchase Volume'}</TableHead>
                            <TableHead className="text-center font-bold">{isBangla ? 'সরবরাহকারী' : 'Suppliers'}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedPurchases.map((row) => (
                            <TableRow key={row.branchId} className="hover:bg-accent/40 transition-colors">
                              <TableCell className="font-bold text-foreground">{row.branchName}</TableCell>
                              <TableCell className="text-center font-medium">
                                <Badge variant="secondary" className="text-[10px] font-bold">
                                  {row.ordersCount}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-mono text-muted-foreground">{formatCurrency(row.grossCost)}</TableCell>
                              <TableCell className="text-right font-mono text-amber-600 dark:text-amber-400">{formatCurrency(row.otherCosts)}</TableCell>
                              <TableCell className="text-right font-bold text-blue-600 dark:text-blue-400 font-mono">{formatCurrency(row.netPurchases)}</TableCell>
                              <TableCell className="text-center">
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                                  <Users className="h-3 w-3 text-indigo-500" />
                                  {row.supplierCount}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Summary Footer Row */}
                    <div className="bg-muted/30 border-t border-border px-4 py-3 flex flex-wrap items-center justify-between text-xs font-bold gap-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>{isBangla ? 'সর্বমোট ক্রয় আদেশ:' : 'Total Purchase Aggregate:'}</span>
                      </div>
                      <div className="flex items-center gap-6 font-mono">
                        <div><span className="text-muted-foreground mr-1">{isBangla ? 'PO সংখ্যা:' : 'Total POs:'}</span><span>{purchasesKpis.totalPOs}</span></div>
                        <div><span className="text-muted-foreground mr-1">{isBangla ? 'মূল খরচ:' : 'Gross:'}</span><span>{formatCurrency(purchasesKpis.grossCost)}</span></div>
                        <div><span className="text-muted-foreground mr-1">{isBangla ? 'অতিরিক্ত:' : 'Freight:'}</span><span className="text-amber-600">{formatCurrency(purchasesKpis.otherCosts)}</span></div>
                        <div><span className="text-muted-foreground mr-1">{isBangla ? 'মোট ক্রয়:' : 'Net Total:'}</span><span className="text-blue-600 dark:text-blue-400 font-black">{formatCurrency(purchasesKpis.netPurchases)}</span></div>
                      </div>
                    </div>

                    {/* Purchases Pagination */}
                    {mockPurchases.length > itemsPerPage && (
                      <div className="flex items-center justify-between p-4 border-t border-border">
                        <span className="text-xs text-muted-foreground font-semibold">
                          {isBangla ? `পৃষ্ঠা ${purchasesPage} এর ${Math.ceil(mockPurchases.length / itemsPerPage)}` : `Page ${purchasesPage} of ${Math.ceil(mockPurchases.length / itemsPerPage)}`}
                        </span>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={purchasesPage === 1} onClick={() => setPurchasesPage(p => p - 1)}>
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={purchasesPage >= Math.ceil(mockPurchases.length / itemsPerPage)} onClick={() => setPurchasesPage(p => p + 1)}>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: BRANCH PROFIT */}
          <TabsContent value="profit" className="outline-none space-y-6 animate-fadeIn">
            {/* Profit Tab Contextual KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard title={isBangla ? 'মোট রাজস্ব' : 'Total Revenue'} value={formatCurrency(profitKpis.totalRevenue)} icon={TrendingUp} iconColor="text-blue-600" />
              <StatCard title={isBangla ? 'পণ্য খরচ (COGS)' : 'Total COGS'} value={formatCurrency(profitKpis.totalCOGS)} icon={Receipt} iconColor="text-amber-600" />
              <StatCard title={isBangla ? 'গ্রস লাভ' : 'Gross Profit'} value={formatCurrency(profitKpis.grossProfit)} icon={DollarSign} iconColor="text-emerald-600" />
              <StatCard title={isBangla ? 'গড় নিট প্রফিট মার্জিন' : 'Average Net Margin'} value={`${profitKpis.avgMarginPct.toFixed(1)}%`} icon={Percent} iconColor="text-teal-600" />
            </div>

            <Card className="shadow-sm border-border/80">
              <CardHeader className="bg-muted/20 border-b border-border/40 pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-teal-500" />
                  {isBangla ? 'শাখাভিত্তিক লাভ-ক্ষতি বিশ্লেষণ' : 'Branch Profitability Analysis'}
                </CardTitle>
                <CardDescription className="text-xs">{isBangla ? 'গ্রস প্রফিট, সিওজিএস (COGS), পরিচালন খরচ বাদ দিয়ে প্রতিটি শাখার নিট মুনাফা।' : 'Gross profit, cost of goods sold, overheads, and net profit margins per outlet.'}</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {mockProfit.length === 0 ? (
                  <div className="py-12">
                    <EmptyState
                      title={isBangla ? 'কোন ডেটা নেই' : 'No Profit Records'}
                      description={isBangla ? 'মুনাফা বিশ্লেষণের জন্য তথ্য পাওয়া যায়নি।' : 'No profit metrics available for the filtered branches.'}
                      icon={DollarSign}
                      action={{
                        label: isBangla ? 'ফিল্টার রিসেট করুন' : 'Reset Filters',
                        onClick: handleResetFilters,
                      }}
                    />
                  </div>
                ) : (
                  <div className="space-y-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-muted/40">
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="font-bold">{isBangla ? 'শাখার নাম' : 'Branch Name'}</TableHead>
                            <TableHead className="text-right font-bold">{isBangla ? 'বিক্রয় রাজস্ব' : 'Sales Revenue'}</TableHead>
                            <TableHead className="text-right font-bold">{isBangla ? 'পণ্য খরচ (COGS)' : 'COGS'}</TableHead>
                            <TableHead className="text-right font-bold">{isBangla ? 'গ্রস লাভ' : 'Gross Profit'}</TableHead>
                            <TableHead className="text-right font-bold">{isBangla ? 'পরিচালন খরচ' : 'Op. Expenses'}</TableHead>
                            <TableHead className="text-right font-bold">{isBangla ? 'নিট লাভ' : 'Net Profit'}</TableHead>
                            <TableHead className="w-[140px] font-bold text-center">{isBangla ? 'মার্জিন হেলথ' : 'Margin Health'}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedProfit.map((row) => {
                            const isHealthy = row.netMarginPct >= 20;
                            const isModerate = row.netMarginPct >= 10 && row.netMarginPct < 20;
                            return (
                              <TableRow key={row.branchId} className="hover:bg-accent/40 transition-colors">
                                <TableCell className="font-bold text-foreground">{row.branchName}</TableCell>
                                <TableCell className="text-right font-mono text-muted-foreground">{formatCurrency(row.salesRevenue)}</TableCell>
                                <TableCell className="text-right font-mono text-muted-foreground">{formatCurrency(row.cogs)}</TableCell>
                                <TableCell className="text-right font-semibold text-emerald-600 dark:text-emerald-400 font-mono">{formatCurrency(row.grossProfit)}</TableCell>
                                <TableCell className="text-right font-mono text-amber-600 dark:text-amber-400">{formatCurrency(row.operatingExpenses)}</TableCell>
                                <TableCell className="text-right font-black font-mono text-emerald-600 dark:text-emerald-400">{formatCurrency(row.netProfit)}</TableCell>
                                <TableCell className="w-[140px]">
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between text-[10px] font-bold">
                                      <span className={cn(
                                        isHealthy ? "text-emerald-600" : isModerate ? "text-amber-600" : "text-red-600"
                                      )}>
                                        {row.netMarginPct.toFixed(1)}%
                                      </span>
                                      <span className="text-[9px] text-muted-foreground uppercase font-mono">
                                        {isHealthy ? 'High' : isModerate ? 'Mid' : 'Low'}
                                      </span>
                                    </div>
                                    <Progress 
                                      value={Math.min(100, Math.max(0, row.netMarginPct * 2.5))} 
                                      className="h-1.5 bg-muted"
                                    />
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Summary Footer Row */}
                    <div className="bg-muted/30 border-t border-border px-4 py-3 flex flex-wrap items-center justify-between text-xs font-bold gap-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>{isBangla ? 'সর্বমোট লাভ-ক্ষতি:' : 'Net Profit Aggregate:'}</span>
                      </div>
                      <div className="flex items-center gap-6 font-mono">
                        <div><span className="text-muted-foreground mr-1">{isBangla ? 'রাজস্ব:' : 'Revenue:'}</span><span>{formatCurrency(profitKpis.totalRevenue)}</span></div>
                        <div><span className="text-muted-foreground mr-1">{isBangla ? 'COGS:' : 'COGS:'}</span><span>{formatCurrency(profitKpis.totalCOGS)}</span></div>
                        <div><span className="text-muted-foreground mr-1">{isBangla ? 'গ্রস লাভ:' : 'Gross Profit:'}</span><span className="text-emerald-600">{formatCurrency(profitKpis.grossProfit)}</span></div>
                        <div><span className="text-muted-foreground mr-1">{isBangla ? 'নিট মুনাফা:' : 'Net Profit:'}</span><span className="text-teal-600 dark:text-teal-400 font-black">{formatCurrency(profitKpis.netProfit)}</span></div>
                      </div>
                    </div>

                    {/* Profit Pagination */}
                    {mockProfit.length > itemsPerPage && (
                      <div className="flex items-center justify-between p-4 border-t border-border">
                        <span className="text-xs text-muted-foreground font-semibold">
                          {isBangla ? `পৃষ্ঠা ${profitPage} এর ${Math.ceil(mockProfit.length / itemsPerPage)}` : `Page ${profitPage} of ${Math.ceil(mockProfit.length / itemsPerPage)}`}
                        </span>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={profitPage === 1} onClick={() => setProfitPage(p => p - 1)}>
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={profitPage >= Math.ceil(mockProfit.length / itemsPerPage)} onClick={() => setProfitPage(p => p + 1)}>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 5: BRANCH EXPENSES */}
          <TabsContent value="expenses" className="outline-none space-y-6 animate-fadeIn">
            {/* Expenses Tab Contextual KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard title={isBangla ? 'ভাড়া ও সেবা ব্যয়' : 'Rent & Utilities'} value={formatCurrency(expensesKpis.rent)} icon={Building2} iconColor="text-blue-600" />
              <StatCard title={isBangla ? 'বেতন ও মজুরি' : 'Salaries & Wages'} value={formatCurrency(expensesKpis.salaries)} icon={Users} iconColor="text-purple-600" />
              <StatCard title={isBangla ? 'পরিচালন ব্যয়' : 'Operations Cost'} value={formatCurrency(expensesKpis.ops)} icon={Receipt} iconColor="text-amber-600" />
              <StatCard title={isBangla ? 'সর্বমোট পরিচালন খরচ' : 'Total Expenses'} value={formatCurrency(expensesKpis.totalExp)} icon={DollarSign} iconColor="text-rose-600" />
            </div>

            <Card className="shadow-sm border-border/80">
              <CardHeader className="bg-muted/20 border-b border-border/40 pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-amber-500" />
                  {isBangla ? 'শাখাভিত্তিক পরিচালন খরচ বন্টন' : 'Branch Expense Breakdown'}
                </CardTitle>
                <CardDescription className="text-xs">{isBangla ? 'ভাড়া, উপযোগিতা, বেতন এবং অন্যান্য খরচের শাখাভিত্তিক বিভাজন।' : 'Detailed operational spending categorized by rent, utilities, payroll, and marketing.'}</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {mockExpenses.length === 0 ? (
                  <div className="py-12">
                    <EmptyState
                      title={isBangla ? 'কোন খরচ পাওয়া যায়নি' : 'No Expense Data'}
                      description={isBangla ? 'এই ফিল্টারে কোন পরিচালন ব্যয়ের তথ্য নেই।' : 'No expense records found matching active filter state.'}
                      icon={Receipt}
                      action={{
                        label: isBangla ? 'ফিল্টার রিসেট করুন' : 'Reset Filters',
                        onClick: handleResetFilters,
                      }}
                    />
                  </div>
                ) : (
                  <div className="space-y-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-muted/40">
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="font-bold">{isBangla ? 'শাখার নাম' : 'Branch Name'}</TableHead>
                            <TableHead className="text-right font-bold">{isBangla ? 'ভাড়া ও উপযোগিতা' : 'Rent & Utilities'}</TableHead>
                            <TableHead className="text-right font-bold">{isBangla ? 'বেতন ও মজুরি' : 'Salaries & Wages'}</TableHead>
                            <TableHead className="text-right font-bold">{isBangla ? 'পরিচালন ব্যয়' : 'Operations'}</TableHead>
                            <TableHead className="text-right font-bold">{isBangla ? 'মার্কেটিং' : 'Marketing'}</TableHead>
                            <TableHead className="text-right font-bold">{isBangla ? 'মোট খরচ' : 'Total Expenses'}</TableHead>
                            <TableHead className="w-[130px] font-bold text-center">{isBangla ? 'খরচ-রাজস্ব অনুপাত' : 'Exp / Rev Ratio'}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedExpenses.map((row) => (
                            <TableRow key={row.branchId} className="hover:bg-accent/40 transition-colors">
                              <TableCell className="font-bold text-foreground">{row.branchName}</TableCell>
                              <TableCell className="text-right font-mono text-muted-foreground">{formatCurrency(row.rentUtilities)}</TableCell>
                              <TableCell className="text-right font-mono text-muted-foreground">{formatCurrency(row.salaries)}</TableCell>
                              <TableCell className="text-right font-mono text-muted-foreground">{formatCurrency(row.operations)}</TableCell>
                              <TableCell className="text-right font-mono text-muted-foreground">{formatCurrency(row.marketing)}</TableCell>
                              <TableCell className="text-right font-bold text-amber-600 dark:text-amber-400 font-mono">{formatCurrency(row.totalExpenses)}</TableCell>
                              <TableCell className="w-[130px]">
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between text-[10px] font-mono">
                                    <span className="font-bold text-amber-600">{row.expenseToRevenuePct.toFixed(1)}%</span>
                                  </div>
                                  <Progress value={Math.min(100, row.expenseToRevenuePct * 4)} className="h-1.5 bg-muted" />
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Summary Footer Row */}
                    <div className="bg-muted/30 border-t border-border px-4 py-3 flex flex-wrap items-center justify-between text-xs font-bold gap-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>{isBangla ? 'সর্বমোট পরিচালন ব্যয়:' : 'Total Expense Aggregate:'}</span>
                      </div>
                      <div className="flex items-center gap-6 font-mono">
                        <div><span className="text-muted-foreground mr-1">{isBangla ? 'ভাড়া:' : 'Rent:'}</span><span>{formatCurrency(expensesKpis.rent)}</span></div>
                        <div><span className="text-muted-foreground mr-1">{isBangla ? 'বেতন:' : 'Salaries:'}</span><span>{formatCurrency(expensesKpis.salaries)}</span></div>
                        <div><span className="text-muted-foreground mr-1">{isBangla ? 'অপারেশনস:' : 'Ops:'}</span><span>{formatCurrency(expensesKpis.ops)}</span></div>
                        <div><span className="text-muted-foreground mr-1">{isBangla ? 'সর্বমোট:' : 'Total Exp:'}</span><span className="text-amber-600 dark:text-amber-400 font-black">{formatCurrency(expensesKpis.totalExp)}</span></div>
                      </div>
                    </div>

                    {/* Expenses Pagination */}
                    {mockExpenses.length > itemsPerPage && (
                      <div className="flex items-center justify-between p-4 border-t border-border">
                        <span className="text-xs text-muted-foreground font-semibold">
                          {isBangla ? `পৃষ্ঠা ${expensesPage} এর ${Math.ceil(mockExpenses.length / itemsPerPage)}` : `Page ${expensesPage} of ${Math.ceil(mockExpenses.length / itemsPerPage)}`}
                        </span>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={expensesPage === 1} onClick={() => setExpensesPage(p => p - 1)}>
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={expensesPage >= Math.ceil(mockExpenses.length / itemsPerPage)} onClick={() => setExpensesPage(p => p + 1)}>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 6: BRANCH INVENTORY */}
          <TabsContent value="inventory" className="outline-none space-y-6 animate-fadeIn">
            {/* Inventory Tab Contextual KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard title={isBangla ? 'মোট মজুদ পণ্য সংখ্যা' : 'Total Stock Qty'} value={inventoryKpis.totalStock.toLocaleString()} icon={Package} iconColor="text-indigo-600" />
              <StatCard title={isBangla ? 'কম স্টক সতর্কতা' : 'Low Stock Alerts'} value={inventoryKpis.lowStockAlerts.toString()} icon={AlertTriangle} iconColor="text-amber-600" />
              <StatCard title={isBangla ? 'ক্রয়মূল্য ভিত্তিক স্টক' : 'Cost Valuation'} value={formatCurrency(inventoryKpis.costValuation)} icon={DollarSign} iconColor="text-blue-600" />
              <StatCard title={isBangla ? 'খুচরামূল্য ভিত্তিক স্টক' : 'Retail Valuation'} value={formatCurrency(inventoryKpis.retailValuation)} icon={TrendingUp} iconColor="text-emerald-600" />
            </div>

            <Card className="shadow-sm border-border/80">
              <CardHeader className="bg-muted/20 border-b border-border/40 pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Package className="h-4 w-4 text-purple-500" />
                  {isBangla ? 'শাখাভিত্তিক ইনভেন্টরি ও স্টক মূল্য' : 'Branch Inventory Holdings'}
                </CardTitle>
                <CardDescription className="text-xs">{isBangla ? 'শাখা ও গোডাউন অনুযায়ী মজুদ পণ্যের সংখ্যা এবং ক্রয়/বিক্রয় মূল্যায়ন।' : 'Stock quantities, low stock warning counts, and total asset valuation per outlet.'}</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {mockInventory.length === 0 ? (
                  <div className="py-12">
                    <EmptyState
                      title={isBangla ? 'কোন ইনভেন্টরি পাওয়া যায়নি' : 'No Inventory Data'}
                      description={isBangla ? 'নির্বাচিত ফিল্টারে কোন ইনভেন্টরি তথ্য পাওয়া যায়নি।' : 'No inventory records found for active filter settings.'}
                      icon={Package}
                      action={{
                        label: isBangla ? 'ফিল্টার রিসেট করুন' : 'Reset Filters',
                        onClick: handleResetFilters,
                      }}
                    />
                  </div>
                ) : (
                  <div className="space-y-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-muted/40">
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="font-bold">{isBangla ? 'শাখার নাম' : 'Branch Name'}</TableHead>
                            <TableHead className="text-center font-bold">{isBangla ? 'এসকেইউ সংখ্যা' : 'SKU Count'}</TableHead>
                            <TableHead className="text-right font-bold">{isBangla ? 'মোট মজুদ পরিমাণ' : 'Total Stock Qty'}</TableHead>
                            <TableHead className="text-center font-bold">{isBangla ? 'কম স্টক সতর্কতা' : 'Low Stock Alerts'}</TableHead>
                            <TableHead className="text-right font-bold">{isBangla ? 'ক্রয় মূল্যায়ন' : 'Cost Valuation'}</TableHead>
                            <TableHead className="text-right font-bold">{isBangla ? 'খুচরা বিক্রয় মূল্যায়ন' : 'Retail Valuation'}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedInventory.map((row) => (
                            <TableRow key={row.branchId} className="hover:bg-accent/40 transition-colors">
                              <TableCell className="font-bold text-foreground">{row.branchName}</TableCell>
                              <TableCell className="text-center font-medium">
                                <Badge variant="outline" className="text-[10px] font-bold">
                                  {row.skuCount} SKUs
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-bold text-foreground font-mono">{row.totalQty.toLocaleString()}</TableCell>
                              <TableCell className="text-center">
                                <Badge variant="outline" className={cn(
                                  "text-[10px] font-bold rounded-full px-2 py-0.5",
                                  row.lowStockAlerts > 0 ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300" : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                                )}>
                                  {row.lowStockAlerts > 0 && <AlertTriangle className="h-3 w-3 mr-1" />}
                                  {row.lowStockAlerts} {isBangla ? 'টি' : 'Alerts'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-mono text-muted-foreground">{formatCurrency(row.costValuation)}</TableCell>
                              <TableCell className="text-right font-bold text-indigo-600 dark:text-indigo-400 font-mono">{formatCurrency(row.retailValuation)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Summary Footer Row */}
                    <div className="bg-muted/30 border-t border-border px-4 py-3 flex flex-wrap items-center justify-between text-xs font-bold gap-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>{isBangla ? 'সর্বমোট স্টক সম্পদ:' : 'Total Inventory Assets:'}</span>
                      </div>
                      <div className="flex items-center gap-6 font-mono">
                        <div><span className="text-muted-foreground mr-1">{isBangla ? 'মোট মজুদ:' : 'Total Qty:'}</span><span>{inventoryKpis.totalStock.toLocaleString()}</span></div>
                        <div><span className="text-muted-foreground mr-1">{isBangla ? 'সতর্কতা:' : 'Low Stock:'}</span><span className={inventoryKpis.lowStockAlerts > 0 ? "text-amber-600" : ""}>{inventoryKpis.lowStockAlerts}</span></div>
                        <div><span className="text-muted-foreground mr-1">{isBangla ? 'ক্রয়মূল্য:' : 'Cost Value:'}</span><span>{formatCurrency(inventoryKpis.costValuation)}</span></div>
                        <div><span className="text-muted-foreground mr-1">{isBangla ? 'বিক্রয়মূল্য:' : 'Retail Value:'}</span><span className="text-indigo-600 dark:text-indigo-400 font-black">{formatCurrency(inventoryKpis.retailValuation)}</span></div>
                      </div>
                    </div>

                    {/* Inventory Pagination */}
                    {mockInventory.length > itemsPerPage && (
                      <div className="flex items-center justify-between p-4 border-t border-border">
                        <span className="text-xs text-muted-foreground font-semibold">
                          {isBangla ? `পৃষ্ঠা ${inventoryPage} এর ${Math.ceil(mockInventory.length / itemsPerPage)}` : `Page ${inventoryPage} of ${Math.ceil(mockInventory.length / itemsPerPage)}`}
                        </span>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={inventoryPage === 1} onClick={() => setInventoryPage(p => p - 1)}>
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={inventoryPage >= Math.ceil(mockInventory.length / itemsPerPage)} onClick={() => setInventoryPage(p => p + 1)}>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 7: BRANCH COMPARISON */}
          <TabsContent value="comparison" className="outline-none space-y-6 animate-fadeIn">
            {/* Comparison Tab Contextual KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <StatCard 
                title={isBangla ? 'শীর্ষ পারফর্মার শাখা' : 'Top Performing Outlet'} 
                value={comparisonKpis.topBranch ? comparisonKpis.topBranch.branchName : 'N/A'} 
                subtitle={comparisonKpis.topBranch ? `${comparisonKpis.topBranch.salesSharePct.toFixed(1)}% Sales Share` : ''} 
                icon={Sparkles} 
                iconColor="text-indigo-600" 
              />
              <StatCard 
                title={isBangla ? 'কর্মী প্রতি গড় বিক্রয়' : 'Avg Sales per Staff'} 
                value={formatCurrency(comparisonKpis.avgSalesPerStaff)} 
                icon={Users} 
                iconColor="text-emerald-600" 
              />
              <StatCard 
                title={isBangla ? 'তুলনাধীন শাখা' : 'Compared Outlets'} 
                value={`${comparisonKpis.count} Outlets`} 
                icon={BarChart3} 
                iconColor="text-rose-600" 
              />
            </div>

            <Card className="shadow-sm border-border/80">
              <CardHeader className="bg-muted/20 border-b border-border/40 pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-rose-500" />
                  {isBangla ? 'শাখা সমকক্ষ তুলনা ও অবদান শেয়ার' : 'Branch Cross Comparison Matrix'}
                </CardTitle>
                <CardDescription className="text-xs">{isBangla ? 'ব্যবসায়ের মোট বিক্রয়, মুনাফা এবং কর্মী দক্ষতার সাপেক্ষে শাখা সমকক্ষ তুলনা।' : 'Comparative matrix analyzing revenue share %, profit contribution %, and staff productivity.'}</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {mockComparison.length === 0 ? (
                  <div className="py-12">
                    <EmptyState
                      title={isBangla ? 'তুলনামূলক তথ্য নেই' : 'No Comparison Data'}
                      description={isBangla ? 'শাখা সমকক্ষ তুলনার জন্য পর্যাপ্ত ডেটা নেই।' : 'Not enough data available for branch cross-comparison.'}
                      icon={BarChart3}
                      action={{
                        label: isBangla ? 'ফিল্টার রিসেট করুন' : 'Reset Filters',
                        onClick: handleResetFilters,
                      }}
                    />
                  </div>
                ) : (
                  <div className="space-y-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-muted/40">
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="font-bold">{isBangla ? 'শাখার নাম' : 'Branch Name'}</TableHead>
                            <TableHead className="text-right font-bold">{isBangla ? 'বিক্রয় শেয়ার %' : 'Sales Share %'}</TableHead>
                            <TableHead className="text-right font-bold">{isBangla ? 'লাভের শেয়ার %' : 'Profit Share %'}</TableHead>
                            <TableHead className="text-right font-bold">{isBangla ? 'স্টক শেয়ার %' : 'Inventory Share %'}</TableHead>
                            <TableHead className="text-right font-bold">{isBangla ? 'কর্মী প্রতি রাজস্ব' : 'Rev / Staff'}</TableHead>
                            <TableHead className="text-center font-bold">{isBangla ? 'গ্রোথ সূচক' : 'Growth Index'}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedComparison.map((row) => (
                            <TableRow key={row.branchId} className="hover:bg-accent/40 transition-colors">
                              <TableCell className="font-bold text-foreground">{row.branchName}</TableCell>
                              <TableCell className="text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                <div className="space-y-1 justify-end">
                                  <span>{row.salesSharePct.toFixed(1)}%</span>
                                  <Progress value={row.salesSharePct} className="h-1 bg-muted" />
                                </div>
                              </TableCell>
                              <TableCell className="text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                <div className="space-y-1 justify-end">
                                  <span>{row.profitSharePct.toFixed(1)}%</span>
                                  <Progress value={row.profitSharePct} className="h-1 bg-muted" />
                                </div>
                              </TableCell>
                              <TableCell className="text-right font-mono text-muted-foreground">{row.inventorySharePct.toFixed(1)}%</TableCell>
                              <TableCell className="text-right font-mono font-semibold text-foreground">{formatCurrency(row.salesPerStaff)}</TableCell>
                              <TableCell className="text-center">
                                <Badge className="text-[10px] font-black rounded-full px-2 py-0.5 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300">
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                  {row.growthIndex}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Comparison Pagination */}
                    {mockComparison.length > itemsPerPage && (
                      <div className="flex items-center justify-between p-4 border-t border-border">
                        <span className="text-xs text-muted-foreground font-semibold">
                          {isBangla ? `পৃষ্ঠা ${comparisonPage} এর ${Math.ceil(mockComparison.length / itemsPerPage)}` : `Page ${comparisonPage} of ${Math.ceil(mockComparison.length / itemsPerPage)}`}
                        </span>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={comparisonPage === 1} onClick={() => setComparisonPage(p => p - 1)}>
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={comparisonPage >= Math.ceil(mockComparison.length / itemsPerPage)} onClick={() => setComparisonPage(p => p + 1)}>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
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
        title={isBangla ? `শাখা রিপোর্ট (${activeTab.toUpperCase()})` : `Branch Report (${activeTab.toUpperCase()})`}
        titleBn={`শাখা রিপোর্ট (${activeTab.toUpperCase()})`}
        subtitle="Multi-Outlet Branch Performance Ledger"
        subtitleBn="বহু-শাখা পারফরম্যান্স ও পরিচালন খতিয়ান"
        businessName={business?.name || 'HelloKhata Business'}
        branchName={selectedBranchId === 'all' ? (isBangla ? 'সকল শাখা' : 'All Branches') : (branches.find(b => b.id === selectedBranchId)?.name || (isBangla ? 'প্রধান শাখা' : 'Main Branch'))}
        businessAddress={(business as any)?.address || (isBangla ? 'ঢাকা, বাংলাদেশ' : 'Dhaka, Bangladesh')}
        contactInfo={(business as any)?.phone || '+৮৮০ ১৭০০০-০০০০০'}
        userName={user?.name || 'Owner'}
        dateRange={{
          start: activeFilters.dateRange.from ? format(activeFilters.dateRange.from, 'dd MMM yyyy') : undefined,
          end: activeFilters.dateRange.to ? format(activeFilters.dateRange.to, 'dd MMM yyyy') : undefined,
          period: activeFilters.period
        }}
        activeFilters={{
          period: activeFilters.period,
          branch: selectedBranchId === 'all' ? 'All' : branches.find(b => b.id === selectedBranchId)?.name || 'Main Branch',
          type: selectedType === 'all' ? 'All' : selectedType,
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

// Mock Performance Generator
function generateMockPerformance(branches: any[], filters: any, searchQuery: string): BranchPerformanceRecord[] {
  const list: BranchPerformanceRecord[] = [];
  const defaultBranches = [
    { id: 'b-1', name: 'Main Branch (Dhanmondi)', code: 'BR-01', type: 'retail' },
    { id: 'b-2', name: 'Gulshan Outlet', code: 'BR-02', type: 'retail' },
    { id: 'b-3', name: 'Uttara Warehouse', code: 'BR-03', type: 'warehouse' },
    { id: 'b-4', name: 'Chittagong Hub', code: 'BR-04', type: 'retail' },
  ];

  const useBranchesList = branches.length > 0 ? branches : defaultBranches;

  useBranchesList.forEach((b, i) => {
    const sales = 480000 + i * 210000;
    const purchases = 310000 + i * 140000;
    const expenses = 45000 + i * 18000;
    const netProfit = sales - purchases - expenses;

    const record: BranchPerformanceRecord = {
      branchId: b.id,
      branchName: b.name,
      code: b.code || `BR-0${i + 1}`,
      type: b.type || (i === 2 ? 'warehouse' : 'retail'),
      sales,
      purchases,
      expenses,
      netProfit,
      staffCount: 4 + i * 2,
      status: 'active',
    };

    if (filters.branchId !== 'all' && record.branchId !== filters.branchId) return;
    if (filters.type !== 'all' && record.type !== filters.type) return;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      if (!record.branchName.toLowerCase().includes(q) && !record.code.toLowerCase().includes(q)) return;
    }

    list.push(record);
  });

  return list;
}

// Mock Sales Generator
function generateMockBranchSales(branches: any[], filters: any, searchQuery: string): BranchSalesRecord[] {
  const list: BranchSalesRecord[] = [];
  const useBranchesList = branches.length > 0 ? branches : [
    { id: 'b-1', name: 'Main Branch (Dhanmondi)' },
    { id: 'b-2', name: 'Gulshan Outlet' },
    { id: 'b-3', name: 'Uttara Warehouse' },
    { id: 'b-4', name: 'Chittagong Hub' },
  ];

  useBranchesList.forEach((b, i) => {
    const orders = 140 + i * 65;
    const gross = 500000 + i * 220000;
    const discounts = 12000 + i * 4000;
    const tax = 8000 + i * 3000;
    const net = gross - discounts + tax;

    const record: BranchSalesRecord = {
      branchId: b.id,
      branchName: b.name,
      ordersCount: orders,
      grossSales: gross,
      discounts,
      tax,
      netSales: net,
      avgOrderValue: Math.round(net / orders),
    };

    if (filters.branchId !== 'all' && record.branchId !== filters.branchId) return;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      if (!record.branchName.toLowerCase().includes(q)) return;
    }

    list.push(record);
  });

  return list;
}

// Mock Purchases Generator
function generateMockBranchPurchases(branches: any[], filters: any, searchQuery: string): BranchPurchasesRecord[] {
  const list: BranchPurchasesRecord[] = [];
  const useBranchesList = branches.length > 0 ? branches : [
    { id: 'b-1', name: 'Main Branch (Dhanmondi)' },
    { id: 'b-2', name: 'Gulshan Outlet' },
    { id: 'b-3', name: 'Uttara Warehouse' },
    { id: 'b-4', name: 'Chittagong Hub' },
  ];

  useBranchesList.forEach((b, i) => {
    const gross = 300000 + i * 135000;
    const other = 10000 + i * 4500;

    const record: BranchPurchasesRecord = {
      branchId: b.id,
      branchName: b.name,
      ordersCount: 18 + i * 6,
      grossCost: gross,
      otherCosts: other,
      netPurchases: gross + other,
      supplierCount: 5 + i * 2,
    };

    if (filters.branchId !== 'all' && record.branchId !== filters.branchId) return;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      if (!record.branchName.toLowerCase().includes(q)) return;
    }

    list.push(record);
  });

  return list;
}

// Mock Profit Generator
function generateMockBranchProfit(branches: any[], filters: any, searchQuery: string): BranchProfitRecord[] {
  const list: BranchProfitRecord[] = [];
  const useBranchesList = branches.length > 0 ? branches : [
    { id: 'b-1', name: 'Main Branch (Dhanmondi)' },
    { id: 'b-2', name: 'Gulshan Outlet' },
    { id: 'b-3', name: 'Uttara Warehouse' },
    { id: 'b-4', name: 'Chittagong Hub' },
  ];

  useBranchesList.forEach((b, i) => {
    const salesRevenue = 496000 + i * 219000;
    const cogs = 310000 + i * 140000;
    const grossProfit = salesRevenue - cogs;
    const operatingExpenses = 45000 + i * 18000;
    const netProfit = grossProfit - operatingExpenses;
    const netMarginPct = (netProfit / salesRevenue) * 100;

    const record: BranchProfitRecord = {
      branchId: b.id,
      branchName: b.name,
      salesRevenue,
      cogs,
      grossProfit,
      operatingExpenses,
      netProfit,
      netMarginPct,
    };

    if (filters.branchId !== 'all' && record.branchId !== filters.branchId) return;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      if (!record.branchName.toLowerCase().includes(q)) return;
    }

    list.push(record);
  });

  return list;
}

// Mock Expenses Generator
function generateMockBranchExpenses(branches: any[], filters: any, searchQuery: string): BranchExpensesRecord[] {
  const list: BranchExpensesRecord[] = [];
  const useBranchesList = branches.length > 0 ? branches : [
    { id: 'b-1', name: 'Main Branch (Dhanmondi)' },
    { id: 'b-2', name: 'Gulshan Outlet' },
    { id: 'b-3', name: 'Uttara Warehouse' },
    { id: 'b-4', name: 'Chittagong Hub' },
  ];

  useBranchesList.forEach((b, i) => {
    const rent = 20000 + i * 8000;
    const salaries = 18000 + i * 6000;
    const ops = 5000 + i * 2000;
    const mkt = 2000 + i * 1000;
    const total = rent + salaries + ops + mkt;
    const rev = 496000 + i * 219000;

    const record: BranchExpensesRecord = {
      branchId: b.id,
      branchName: b.name,
      rentUtilities: rent,
      salaries,
      operations: ops,
      marketing: mkt,
      totalExpenses: total,
      expenseToRevenuePct: (total / rev) * 100,
    };

    if (filters.branchId !== 'all' && record.branchId !== filters.branchId) return;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      if (!record.branchName.toLowerCase().includes(q)) return;
    }

    list.push(record);
  });

  return list;
}

// Mock Inventory Generator
function generateMockBranchInventory(branches: any[], filters: any, searchQuery: string): BranchInventoryRecord[] {
  const list: BranchInventoryRecord[] = [];
  const useBranchesList = branches.length > 0 ? branches : [
    { id: 'b-1', name: 'Main Branch (Dhanmondi)' },
    { id: 'b-2', name: 'Gulshan Outlet' },
    { id: 'b-3', name: 'Uttara Warehouse' },
    { id: 'b-4', name: 'Chittagong Hub' },
  ];

  useBranchesList.forEach((b, i) => {
    const cost = 250000 + i * 180000;
    const retail = 340000 + i * 240000;

    const record: BranchInventoryRecord = {
      branchId: b.id,
      branchName: b.name,
      skuCount: 45 + i * 20,
      totalQty: 850 + i * 400,
      lowStockAlerts: i % 2 === 0 ? 3 : 0,
      costValuation: cost,
      retailValuation: retail,
    };

    if (filters.branchId !== 'all' && record.branchId !== filters.branchId) return;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      if (!record.branchName.toLowerCase().includes(q)) return;
    }

    list.push(record);
  });

  return list;
}

// Mock Comparison Generator
function generateMockBranchComparison(branches: any[], filters: any, searchQuery: string): BranchComparisonRecord[] {
  const list: BranchComparisonRecord[] = [];
  const useBranchesList = branches.length > 0 ? branches : [
    { id: 'b-1', name: 'Main Branch (Dhanmondi)' },
    { id: 'b-2', name: 'Gulshan Outlet' },
    { id: 'b-3', name: 'Uttara Warehouse' },
    { id: 'b-4', name: 'Chittagong Hub' },
  ];

  const totalSalesSum = 496000 + 715000 + 934000 + 1153000;

  useBranchesList.forEach((b, i) => {
    const sales = 496000 + i * 219000;
    const salesShare = (sales / totalSalesSum) * 100;
    const staff = 4 + i * 2;

    const record: BranchComparisonRecord = {
      branchId: b.id,
      branchName: b.name,
      salesSharePct: salesShare,
      profitSharePct: salesShare * 0.95,
      inventorySharePct: 20 + i * 5,
      salesPerStaff: Math.round(sales / staff),
      growthIndex: i % 2 === 0 ? '+14.2% YoY' : '+18.5% YoY',
    };

    if (filters.branchId !== 'all' && record.branchId !== filters.branchId) return;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      if (!record.branchName.toLowerCase().includes(q)) return;
    }

    list.push(record);
  });

  return list;
}
