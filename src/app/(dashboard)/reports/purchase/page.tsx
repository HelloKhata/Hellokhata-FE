// Hello Khata OS - Purchase Report Page
// হ্যালো খাতা - ক্রয় রিপোর্ট পেজ

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
  BarChart3,
  Download,
  FileText,
  TrendingDown,
  DollarSign,
  Users,
  Truck,
  ArrowRight,
  FileSpreadsheet,
  Printer,
  Loader2,
  Search,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { exportToCSV, exportToExcel, exportToPDF, printReport, type ReportData } from '@/lib/export-utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useDashboardStats, usePurchases, useSuppliers } from '@/hooks/queries';
import { useCurrency, useAppTranslation } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import { PaginationHelper } from '@/components/shared/PaginationHelper';

export default function PurchaseReportPage() {
  const { t, isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const { toast } = useToast();
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '1y' | 'custom'>('30d');
  const [exportingType, setExportingType] = useState<string | null>(null);

  // Search, Filters & Pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: undefined,
    to: undefined,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: purchases, isLoading: purchasesLoading } = usePurchases();
  const { data: suppliersData } = useSuppliers();

  const suppliersList = (suppliersData as any)?.data || [];

  const getSupplierName = (id?: string) => {
    if (!id) return isBangla ? 'সাধারণ সরবরাহকারী' : 'Generic Supplier';
    const supplier = suppliersList.find((s: any) => s.id === id);
    return supplier ? supplier.name : (isBangla ? 'সাধারণ সরবরাহকারী' : 'Generic Supplier');
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

  // Client-side filtering of purchases list
  const filteredPurchases = (purchases || []).filter((p) => {
    const supplierName = getSupplierName(p.supplierId);
    
    // 1. Search Query filter (Invoice No, Supplier Name)
    const matchSearch = searchQuery
      ? (p.invoiceNo && p.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase())) ||
        supplierName.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    // 2. Status filter
    const matchStatus = statusFilter === 'all' ? true : p.status === statusFilter;

    // 3. Date Range filter
    const { start, end } = getFilterDates();
    const purchaseDate = new Date(p.createdAt);
    let matchDate = true;
    if (start) {
      const startOfDay = new Date(start);
      startOfDay.setHours(0, 0, 0, 0);
      matchDate = matchDate && purchaseDate >= startOfDay;
    }
    if (end) {
      const endOfDay = new Date(end);
      endOfDay.setHours(23, 59, 59, 999);
      matchDate = matchDate && purchaseDate <= endOfDay;
    }

    return matchSearch && matchStatus && matchDate;
  });

  // Calculate metrics based on filtered list
  const totalPurchasesAmount = filteredPurchases.reduce((sum, p) => sum + p.total, 0);
  const totalPaidPurchases = filteredPurchases.reduce((sum, p) => sum + p.paidAmount, 0);
  const totalDuePurchases = filteredPurchases.reduce((sum, p) => sum + p.dueAmount, 0);
  const suppliersCount = stats?.activeParties || 0; // fallback active suppliers

  // Group filtered purchases by date for the chart
  const purchasesByDate = filteredPurchases.reduce((acc: Record<string, number>, p) => {
    const dateStr = new Date(p.createdAt).toLocaleDateString(isBangla ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'short' });
    acc[dateStr] = (acc[dateStr] || 0) + p.total;
    return acc;
  }, {}) || {};

  const chartData = Object.entries(purchasesByDate).map(([date, total]) => ({
    date,
    purchases: total,
  }));

  // Pagination calculations
  const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);
  const paginatedPurchases = filteredPurchases.slice(
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
      totalSales: totalPurchasesAmount, // reuse fields for export mapping
      totalExpenses: stats?.todayExpenses || 0,
      netProfit: totalPaidPurchases,
      profitMargin: 0,
      receivable: totalDuePurchases,
      stockValue: stats?.stockValue || 0,
    },
    chartData: chartData.map(item => ({
      date: item.date,
      sales: (item.purchases as number) || 0,
      expenses: 0,
      profit: 0,
    })),
    profitLossSummary: {
      totalRevenue: totalPurchasesAmount,
      costOfGoods: totalPaidPurchases,
      grossProfit: 0,
      operatingExpenses: stats?.todayExpenses || 0,
      netProfit: 0,
    },
  });

  const handleExportCSV = async () => {
    setExportingType('csv');
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const success = exportToCSV(getReportData(), `purchase-report-${Date.now()}.csv`);
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
      const success = exportToExcel(getReportData(), `purchase-report-${Date.now()}.xlsx`);
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

  if (statsLoading || purchasesLoading) {
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
            <Truck className="h-6 w-6 text-primary" />
            {isBangla ? 'ক্রয় রিপোর্ট' : 'Purchase Report'}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isBangla ? 'ক্রয়ের বিবরণী এবং বিশ্লেষণ' : 'Purchase trends and analytics'}
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
                placeholder={isBangla ? "ক্রয় খুঁজুন (ইনভয়েস বা নাম)..." : "Search purchases (invoice or supplier)..."}
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
              {/* Status filter */}
              <Select value={statusFilter} onValueChange={(v) => {
                setStatusFilter(v);
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-[140px] bg-background">
                  <SelectValue placeholder={isBangla ? "অবস্থা" : "Status"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isBangla ? "সব অবস্থা" : "All Statuses"}</SelectItem>
                  <SelectItem value="received">{isBangla ? "গৃহীত" : "Received"}</SelectItem>
                  <SelectItem value="pending">{isBangla ? "বকেয়া" : "Pending"}</SelectItem>
                  <SelectItem value="partial">{isBangla ? "আংশিক" : "Partial"}</SelectItem>
                  <SelectItem value="cancelled">{isBangla ? "বাতিল" : "Cancelled"}</SelectItem>
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
          title={isBangla ? 'মোট ক্রয়' : 'Total Purchases'}
          value={formatCurrency(totalPurchasesAmount)}
          icon={Truck}
          iconColor="text-blue-600"
        />
        <StatCard
          title={isBangla ? 'পরিশোধিত' : 'Paid Purchases'}
          value={formatCurrency(totalPaidPurchases)}
          icon={DollarSign}
          iconColor="text-emerald-600"
        />
        <StatCard
          title={isBangla ? 'দেনা (বাকি)' : 'Unpaid (Due)'}
          value={formatCurrency(totalDuePurchases)}
          icon={Users}
          iconColor="text-red-600"
        />
        <StatCard
          title={isBangla ? 'মোট খরচ' : 'Total Expenses'}
          value={formatCurrency(stats?.todayExpenses || 0)}
          icon={TrendingDown}
          iconColor="text-orange-600"
        />
      </div>

      {/* Purchase Analysis Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            {isBangla ? 'ক্রয় বিশ্লেষণ' : 'Purchase Analysis'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="purchases" name={isBangla ? 'ক্রয়' : 'Purchases'} fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center min-h-[200px] text-muted-foreground">
              {isBangla ? 'কোন তথ্য নেই' : 'No data available'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Purchase Transactions Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Truck className="h-5 w-5 text-blue-600" />
            {isBangla ? 'ক্রয় লেনদেনসমূহ' : 'Purchase Transactions'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">{isBangla ? 'ইনভয়েস নম্বর' : 'Invoice No'}</TableHead>
                  <TableHead className="font-semibold">{isBangla ? 'সরবরাহকারী' : 'Supplier'}</TableHead>
                  <TableHead className="font-semibold">{isBangla ? 'তারিখ' : 'Date'}</TableHead>
                  <TableHead className="text-right font-semibold">{isBangla ? 'মোট' : 'Total'}</TableHead>
                  <TableHead className="text-right font-semibold">{isBangla ? 'পরিশোধিত' : 'Paid'}</TableHead>
                  <TableHead className="text-right font-semibold">{isBangla ? 'বাকি' : 'Due'}</TableHead>
                  <TableHead className="text-center font-semibold">{isBangla ? 'অবস্থা' : 'Status'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPurchases.length > 0 ? (
                  paginatedPurchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell className="font-medium text-primary hover:underline">
                        <Link href={`/purchases/${purchase.id}`}>{purchase.invoiceNo || 'N/A'}</Link>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {getSupplierName(purchase.supplierId)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(purchase.createdAt).toLocaleDateString(isBangla ? 'bn-BD' : 'en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="text-right font-semibold">{formatCurrency(purchase.total)}</TableCell>
                      <TableCell className="text-right text-emerald-600 font-medium">{formatCurrency(purchase.paidAmount)}</TableCell>
                      <TableCell className="text-right text-red-600 font-medium">{formatCurrency(purchase.dueAmount)}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          className={cn(
                            "border-transparent font-semibold shadow-none text-xs",
                            purchase.status === 'received'
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : purchase.status === 'pending'
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300"
                              : purchase.status === 'partial'
                              ? "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300"
                              : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                          )}
                        >
                          {isBangla
                            ? (purchase.status === 'received' ? 'গৃহীত' : purchase.status === 'pending' ? 'বকেয়া' : purchase.status === 'partial' ? 'আংশিক' : 'বাতিল')
                            : purchase.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      {isBangla ? 'কোনো লেনদেন পাওয়া যায়নি' : 'No transactions found'}
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
        <Link href="/purchases">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">{isBangla ? 'ক্রয় তালিকা' : 'Purchase List'}</p>
                  <p className="text-sm text-muted-foreground">{isBangla ? 'সব ক্রয় লেনদেনের তালিকা' : 'View all purchase transactions'}</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/purchases/new">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">{isBangla ? 'নতুন ক্রয়' : 'New Purchase'}</p>
                  <p className="text-sm text-muted-foreground">{isBangla ? 'নতুন ক্রয় যোগ করুন' : 'Create a new purchase'}</p>
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
