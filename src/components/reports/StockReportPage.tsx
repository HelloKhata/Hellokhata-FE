// Hello Khata OS - Stock Report Page
// হ্যালো খাতা - স্টক রিপোর্ট পেজ

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageHeader, StatCard } from '@/components/common';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Package,
  AlertTriangle,
  Download,
  FileText,
  FileSpreadsheet,
  Printer,
  Loader2,
  ArrowRight,
  Search,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { exportToCSV, exportToExcel, exportToPDF, printReport, type ReportData } from '@/lib/export-utils';
import { useDashboardStats, useItems, useCategories } from '@/hooks/queries';
import { useCurrency, useAppTranslation } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import { PaginationHelper } from '@/components/shared/PaginationHelper';

export default function StockReportPage() {
  const { t, isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const { toast } = useToast();
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '1y' | 'custom'>('30d');
  const [exportingType, setExportingType] = useState<string | null>(null);

  // Search, Filters & Pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockStatusFilter, setStockStatusFilter] = useState<string>('all'); // all, low, out
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: undefined,
    to: undefined,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: items, isLoading: itemsLoading } = useItems();
  const { data: categories } = useCategories();

  const getCategoryName = (id?: string) => {
    if (!id) return isBangla ? 'সাধারণ' : 'General';
    const cat = categories?.find((c: any) => c.id === id);
    return cat 
      ? (isBangla && cat.nameBn ? cat.nameBn : cat.name) 
      : (isBangla ? 'সাধারণ' : 'General');
  };

  const getPeriodLabel = () => {
    const labels: Record<string, string> = {
      '7d': isBangla ? 'গত ৭ দিন' : 'Last 7 days',
      '30d': isBangla ? 'গত ৩০ দিন' : 'Last 30 days',
      '90d': isBangla ? 'গত ৯০ দিন' : 'Last 90 days',
      '1y': isBangla ? 'গত ১ বছর' : 'Last year',
      'custom': isBangla ? 'কাস্টম রেঞ্জ' : 'Custom Range',
    };
    return labels[period];
  };

  const getFilterDates = () => {
    if (period === 'custom') {
      return {
        start: dateRange.from,
        end: dateRange.to,
      };
    }
    const end = new Date();
    const start = new Date();
    if (period === '7d') start.setDate(end.getDate() - 7);
    else if (period === '30d') start.setDate(end.getDate() - 30);
    else if (period === '90d') start.setDate(end.getDate() - 90);
    else if (period === '1y') start.setFullYear(end.getFullYear() - 1);
    return { start, end };
  };

  const handlePeriodChange = (v: string) => {
    const newPeriod = v as typeof period;
    setPeriod(newPeriod);
    setCurrentPage(1);
    if (newPeriod !== 'custom') {
      setDateRange({ from: undefined, to: undefined });
    }
  };

  // Client-side filtering of stock items
  const filteredItems = (items || []).filter((item) => {
    // 1. Search Query filter (Item Name, SKU)
    const matchSearch = searchQuery
      ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.nameBn && item.nameBn.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.sku && item.sku.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;

    // 2. Category filter
    const matchCategory = categoryFilter === 'all' ? true : item.categoryId === categoryFilter;

    // 3. Stock Level Alert filter
    let matchStockStatus = true;
    const isLow = item.currentStock <= (item.minStock || 10);
    const isOut = item.currentStock <= 0;
    if (stockStatusFilter === 'low') {
      matchStockStatus = isLow;
    } else if (stockStatusFilter === 'out') {
      matchStockStatus = isOut;
    }

    // 4. Date Range filter (createdAt)
    const { start, end } = getFilterDates();
    let matchDate = true;
    if (item.createdAt) {
      const itemDate = new Date(item.createdAt);
      if (start) {
        const startOfDay = new Date(start);
        startOfDay.setHours(0, 0, 0, 0);
        matchDate = matchDate && itemDate >= startOfDay;
      }
      if (end) {
        const endOfDay = new Date(end);
        endOfDay.setHours(23, 59, 59, 999);
        matchDate = matchDate && itemDate <= endOfDay;
      }
    }

    return matchSearch && matchCategory && matchStockStatus && matchDate;
  });

  // Calculate stock statistics based on filtered list
  const totalItems = filteredItems.length;
  const lowStockItems = filteredItems.filter(item => item.currentStock <= (item.minStock || 10));
  const totalStockValue = filteredItems.reduce((sum, item) => sum + (item.currentStock * (item.costPrice || 0)), 0);
  const deadStockValue = filteredItems
    .filter(item => item.currentStock > 0 && (!item.lastSaleDate || (new Date().getTime() - new Date(item.lastSaleDate).getTime()) > 60 * 24 * 60 * 60 * 1000))
    .reduce((sum, item) => sum + (item.currentStock * (item.costPrice || 0)), 0);

  // Pagination calculations
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getReportData = (): ReportData => ({
    dateRange: {
      start: getFilterDates().start?.toLocaleDateString() || new Date().toLocaleDateString(),
      end: getFilterDates().end?.toLocaleDateString() || new Date().toLocaleDateString(),
      period: getPeriodLabel(),
    },
    stats: {
      totalSales: 0,
      totalExpenses: 0,
      netProfit: 0,
      profitMargin: 0,
      receivable: 0,
      stockValue: totalStockValue,
    },
    chartData: [],
    profitLossSummary: {
      totalRevenue: 0,
      costOfGoods: 0,
      grossProfit: 0,
      operatingExpenses: 0,
      netProfit: 0,
    },
  });

  const handleExportCSV = async () => {
    setExportingType('csv');
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const success = exportToCSV(getReportData(), `stock-report-${Date.now()}.csv`);
      if (success) {
        toast({
          title: isBangla ? 'CSV এক্সপোর্ট সম্পন্ন' : 'CSV Exported',
          description: isBangla ? 'রিপোর্ট CSV ফাইলে ডাউনলোড হয়েছে' : 'Report has been downloaded as CSV',
        });
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error(error);
      toast({
        title: isBangla ? 'ত্রুটি' : 'Error',
        description: isBangla ? 'এক্সপোর্ট ব্যর্থ হয়েছে' : 'Export failed',
        variant: 'destructive',
      });
    } finally {
      setExportingType(null);
    }
  };

  const handleExportExcel = async () => {
    setExportingType('excel');
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const success = exportToExcel(getReportData(), `stock-report-${Date.now()}.xlsx`);
      if (success) {
        toast({
          title: isBangla ? 'Excel এক্সপোর্ট সম্পন্ন' : 'Excel Exported',
          description: isBangla ? 'রিপোর্ট Excel ফাইলে ডাউনলোড হয়েছে' : 'Report has been downloaded as Excel',
        });
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error(error);
      toast({
        title: isBangla ? 'ত্রুটি' : 'Error',
        description: isBangla ? 'এক্সপোর্ট ব্যর্থ হয়েছে' : 'Export failed',
        variant: 'destructive',
      });
    } finally {
      setExportingType(null);
    }
  };

  const handleExportPDF = async () => {
    setExportingType('pdf');
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const success = exportToPDF(getReportData());
      if (success) {
        toast({
          title: isBangla ? 'PDF তৈরি হয়েছে' : 'PDF Generated',
          description: isBangla ? 'প্রিন্ট উইন্ডো খোলা হয়েছে, PDF হিসেবে সংরক্ষণ করুন' : 'Print window opened, save as PDF',
        });
      } else {
        throw new Error('PDF export failed');
      }
    } catch (error) {
      console.error(error);
      toast({
        title: isBangla ? 'ত্রুটি' : 'Error',
        description: isBangla ? 'পপ-আপ ব্লক করা হয়েছে। পপ-আপ অনুমোদন করুন।' : 'Popup blocked. Please allow popups.',
        variant: 'destructive',
      });
    } finally {
      setExportingType(null);
    }
  };

  const handlePrint = async () => {
    setExportingType('print');
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      const success = printReport(getReportData());
      if (success) {
        toast({
          title: isBangla ? 'প্রিন্ট উইন্ডো খোলা হয়েছে' : 'Print Dialog Opened',
          description: isBangla ? 'প্রিন্ট করুন বা PDF হিসেবে সংরক্ষণ করুন' : 'Print or save as PDF',
        });
      } else {
        throw new Error('Print failed');
      }
    } catch (error) {
      console.error(error);
      toast({
        title: isBangla ? 'ত্রুটি' : 'Error',
        description: isBangla ? 'পপ-আপ ব্লক করা হয়েছে। পপ-আপ অনুমোদন করুন।' : 'Popup blocked. Please allow popups.',
        variant: 'destructive',
      });
    } finally {
      setExportingType(null);
    }
  };

  if (statsLoading || itemsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            {isBangla ? 'স্টক রিপোর্ট' : 'Stock Report'}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isBangla ? 'পণ্যের স্টক বিবরণী ও বিশ্লেষণ' : 'Inventory stock statement and analytics'}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleExportPDF} disabled={exportingType === 'pdf'}>
            {exportingType === 'pdf' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileText className="h-4 w-4 mr-2" />}
            PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportExcel} disabled={exportingType === 'excel'}>
            {exportingType === 'excel' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileSpreadsheet className="h-4 w-4 mr-2" />}
            Excel
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={exportingType === 'csv'}>
            {exportingType === 'csv' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
            CSV
          </Button>
          <Button variant="default" size="sm" onClick={handlePrint} disabled={exportingType === 'print'}>
            {exportingType === 'print' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Printer className="h-4 w-4 mr-2" />}
            {isBangla ? 'প্রিন্ট' : 'Print'}
          </Button>
        </div>
      </div>

      {/* Filters Card */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={isBangla ? "পণ্য খুঁজুন (নাম বা SKU)..." : "Search items (name or SKU)..."}
                className="pl-9 bg-background"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Other controls */}
            <div className="flex flex-wrap gap-2 items-center w-full md:w-auto justify-end">
              {/* Category filter */}
              <Select value={categoryFilter} onValueChange={(v) => {
                setCategoryFilter(v);
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-[140px] bg-background">
                  <SelectValue placeholder={isBangla ? "ক্যাটাগরি" : "Category"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isBangla ? "সব ক্যাটাগরি" : "All Categories"}</SelectItem>
                  {categories?.map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {isBangla && cat.nameBn ? cat.nameBn : cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Stock Level filter */}
              <Select value={stockStatusFilter} onValueChange={(v) => {
                setStockStatusFilter(v);
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-[140px] bg-background">
                  <SelectValue placeholder={isBangla ? "স্টক লেভেল" : "Stock Level"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isBangla ? "সব স্টক" : "All Stock"}</SelectItem>
                  <SelectItem value="low">{isBangla ? "কম স্টক" : "Low Stock"}</SelectItem>
                  <SelectItem value="out">{isBangla ? "স্টক নেই" : "Out of Stock"}</SelectItem>
                </SelectContent>
              </Select>

              {/* Period selection */}
              <Select value={period} onValueChange={handlePeriodChange}>
                <SelectTrigger className="w-[140px] bg-background">
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

              {/* Custom date range popover */}
              {period === 'custom' && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[240px] justify-start text-left font-normal bg-background">
                      <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "dd LLL yyyy")} - {format(dateRange.to, "dd LLL yyyy")}
                          </>
                        ) : (
                          format(dateRange.from, "dd LLL yyyy")
                        )
                      ) : (
                        <span>{isBangla ? "তারিখ নির্বাচন করুন" : "Select Date Range"}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from || new Date()}
                      selected={dateRange as any}
                      onSelect={(range: any) => {
                        setDateRange(range || { from: undefined, to: undefined });
                        setCurrentPage(1);
                      }}
                      numberOfMonths={1}
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title={isBangla ? 'স্টক মূল্য' : 'Stock Value'}
          value={formatCurrency(totalStockValue)}
          icon={Package}
          iconColor="text-blue-600"
        />
        <StatCard
          title={isBangla ? 'মোট আইটেম' : 'Total Items'}
          value={totalItems.toString()}
          icon={Package}
          iconColor="text-purple-600"
        />
        <StatCard
          title={isBangla ? 'কম স্টক' : 'Low Stock'}
          value={lowStockItems.length.toString()}
          icon={AlertTriangle}
          iconColor="text-orange-600"
        />
        <StatCard
          title={isBangla ? 'অচল স্টক' : 'Dead Stock'}
          value={formatCurrency(deadStockValue)}
          icon={AlertTriangle}
          iconColor="text-red-600"
        />
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              {isBangla ? 'কম স্টক সতর্কতা' : 'Low Stock Alert'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {lowStockItems.slice(0, 10).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-950 rounded-lg text-xs">
                  <span className="font-medium">{item.nameBn || item.name}</span>
                  <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300 border-transparent">
                    {item.currentStock} {isBangla ? 'বাকি' : 'left'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stock Items Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            {isBangla ? 'স্টক ইনভেন্টরি তালিকা' : 'Stock Inventory List'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">{isBangla ? 'এসকিউ (SKU)' : 'SKU'}</TableHead>
                  <TableHead className="font-semibold">{isBangla ? 'নাম' : 'Name'}</TableHead>
                  <TableHead className="font-semibold">{isBangla ? 'ক্যাটাগরি' : 'Category'}</TableHead>
                  <TableHead className="text-right font-semibold">{isBangla ? 'স্টক পরিমাণ' : 'Stock Qty'}</TableHead>
                  <TableHead className="text-right font-semibold">{isBangla ? 'ক্রয় মূল্য' : 'Cost Price'}</TableHead>
                  <TableHead className="text-right font-semibold">{isBangla ? 'বিক্রয় মূল্য' : 'Selling Price'}</TableHead>
                  <TableHead className="text-right font-semibold">{isBangla ? 'মোট স্টক মূল্য' : 'Stock Value'}</TableHead>
                  <TableHead className="text-center font-semibold">{isBangla ? 'অবস্থা' : 'Status'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedItems.length > 0 ? (
                  paginatedItems.map((item) => {
                    const isLow = item.currentStock <= (item.minStock || 10);
                    const isOut = item.currentStock <= 0;
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-xs">{item.sku || 'N/A'}</TableCell>
                        <TableCell className="font-medium">{item.nameBn || item.name}</TableCell>
                        <TableCell>{getCategoryName(item.categoryId)}</TableCell>
                        <TableCell className={cn(
                          "text-right font-semibold",
                          isOut ? "text-red-600" : isLow ? "text-orange-600" : ""
                        )}>
                          {item.currentStock} {item.unit || (isBangla ? 'টি' : 'pcs')}
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(item.costPrice || 0)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.sellingPrice || 0)}</TableCell>
                        <TableCell className="text-right font-bold">{formatCurrency(item.currentStock * (item.costPrice || 0))}</TableCell>
                        <TableCell className="text-center font-semibold">
                          <Badge
                            className={cn(
                              "border-transparent font-semibold shadow-none text-xs",
                              isOut
                                ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                                : isLow
                                ? "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300"
                                : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            )}
                          >
                            {isOut
                              ? (isBangla ? 'স্টক নেই' : 'Out of Stock')
                              : isLow
                              ? (isBangla ? 'কম স্টক' : 'Low Stock')
                              : (isBangla ? 'পর্যাপ্ত' : 'In Stock')}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      {isBangla ? 'কোনো পণ্য পাওয়া যায়নি' : 'No items found'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <PaginationHelper
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            isBangla={isBangla}
          />
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/inventory">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">{isBangla ? 'ইনভেন্টরি তালিকা' : 'Inventory List'}</p>
                  <p className="text-sm text-muted-foreground">{isBangla ? 'বিস্তারিত স্টক বিবরণী' : 'Detailed stock list'}</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/reports/dead-stock">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">{isBangla ? 'অচল স্টক' : 'Dead Stock'}</p>
                  <p className="text-sm text-muted-foreground">{isBangla ? 'অচল মজুদ পরিচালনা' : 'Manage dead inventory'}</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
