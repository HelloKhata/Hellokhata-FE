// Hello Khata OS - Profit & Loss Report Page
// হ্যালো খাতা - লাভ-লোকসান রিপোর্ট পেজ

'use client';

import { useState } from 'react';
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
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  FileText,
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
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useDashboardStats, useSales, useExpenses, useExpenseCategories } from '@/hooks/queries';
import { useCurrency, useAppTranslation } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import { PaginationHelper } from '@/components/shared/PaginationHelper';

export default function ProfitLossReportPage() {
  const { t, isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const { toast } = useToast();
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '1y' | 'custom'>('30d');
  const [exportingType, setExportingType] = useState<string | null>(null);

  // Search, Filters & Pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: undefined,
    to: undefined,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: sales, isLoading: salesLoading } = useSales();
  const { data: expenses, isLoading: expensesLoading } = useExpenses();
  const { data: expenseCategories } = useExpenseCategories();

  const getExpenseCategoryName = (id?: string) => {
    if (!id) return isBangla ? 'সাধারণ খরচ' : 'General Expense';
    const category = expenseCategories?.find((c: any) => c.id === id);
    return category 
      ? (isBangla && category.nameBn ? category.nameBn : category.name) 
      : (isBangla ? 'সাধারণ খরচ' : 'General Expense');
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

  // Convert sales and expenses to combined ledger
  const salesList = sales || [];
  const expensesList = expenses || [];

  const salesLedgerItems = salesList.map((s) => ({
    id: s.id,
    date: new Date(s.createdAt),
    type: 'income' as const,
    description: `${isBangla ? 'বিক্রয় ইনভয়েস' : 'Sales Invoice'} #${s.invoiceNo}`,
    category: isBangla ? 'বিক্রয়' : 'Sales',
    amount: s.total,
  }));

  const expensesLedgerItems = expensesList.map((e) => ({
    id: e.id,
    date: new Date(e.date),
    type: 'expense' as const,
    description: e.description || (isBangla ? 'পরিচালন খরচ' : 'Operating Expense'),
    category: getExpenseCategoryName(e.categoryId),
    amount: e.amount,
  }));

  const ledgerItems = [...salesLedgerItems, ...expensesLedgerItems].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  // Client-side filtering of ledger items
  const filteredLedger = ledgerItems.filter((item) => {
    // 1. Search filter
    const matchSearch = searchQuery
      ? item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    // 2. Type filter
    const matchType = typeFilter === 'all' ? true : item.type === typeFilter;

    // 3. Date Range filter
    const { start, end } = getFilterDates();
    let matchDate = true;
    if (start) {
      const startOfDay = new Date(start);
      startOfDay.setHours(0, 0, 0, 0);
      matchDate = matchDate && item.date >= startOfDay;
    }
    if (end) {
      const endOfDay = new Date(end);
      endOfDay.setHours(23, 59, 59, 999);
      matchDate = matchDate && item.date <= endOfDay;
    }

    return matchSearch && matchType && matchDate;
  });

  // Calculate stats based on filtered ledger
  const totalRevenue = filteredLedger
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);

  const operatingExpenses = filteredLedger
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);

  const costOfGoods = Math.round(totalRevenue * 0.63);
  const grossProfit = totalRevenue - costOfGoods;
  const netProfit = grossProfit - operatingExpenses;

  // Group filtered ledger by date for the chart
  const ledgerByDate = filteredLedger.reduce((acc: Record<string, { sales: number; expenses: number }>, item) => {
    const dateStr = item.date.toLocaleDateString(isBangla ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'short' });
    if (!acc[dateStr]) {
      acc[dateStr] = { sales: 0, expenses: 0 };
    }
    if (item.type === 'income') {
      acc[dateStr].sales += item.amount;
    } else {
      acc[dateStr].expenses += item.amount;
    }
    return acc;
  }, {}) || {};

  const chartData = Object.entries(ledgerByDate).map(([date, data]) => {
    const profit = Math.round(data.sales * 0.37) - data.expenses;
    return {
      date,
      sales: data.sales,
      expenses: data.expenses,
      profit,
    };
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredLedger.length / itemsPerPage);
  const paginatedLedger = filteredLedger.slice(
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
      totalSales: totalRevenue,
      totalExpenses: operatingExpenses,
      netProfit: netProfit,
      profitMargin: (netProfit / (totalRevenue || 1)) * 100,
      receivable: stats?.receivable || 0,
      stockValue: stats?.stockValue || 0,
    },
    chartData: chartData.map(item => ({
      date: item.date,
      sales: item.sales,
      expenses: item.expenses,
      profit: item.profit,
    })),
    profitLossSummary: {
      totalRevenue: totalRevenue,
      costOfGoods: costOfGoods,
      grossProfit: grossProfit,
      operatingExpenses: operatingExpenses,
      netProfit: netProfit,
    },
  });

  const handleExportCSV = async () => {
    setExportingType('csv');
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const success = exportToCSV(getReportData());
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
      const success = exportToExcel(getReportData());
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

  if (statsLoading || salesLoading || expensesLoading) {
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
            <DollarSign className="h-6 w-6 text-primary" />
            {isBangla ? 'লাভ-লোকসান রিপোর্ট' : 'Profit & Loss Report'}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isBangla ? 'ব্যবসায়িক লাভ-লোকসান বিবরণী ও প্রবণতা' : 'Business profit/loss statement and trends'}
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
                placeholder={isBangla ? "লেজার খুঁজুন (বিবরণ বা ক্যাটাগরি)..." : "Search ledger (desc or category)..."}
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
              {/* Type filter */}
              <Select value={typeFilter} onValueChange={(v: any) => {
                setTypeFilter(v);
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-[140px] bg-background">
                  <SelectValue placeholder={isBangla ? "লেনদেন টাইপ" : "Transaction Type"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isBangla ? "সব লেনদেন" : "All Transactions"}</SelectItem>
                  <SelectItem value="income">{isBangla ? "আয় (বিক্রয়)" : "Income (Sales)"}</SelectItem>
                  <SelectItem value="expense">{isBangla ? "খরচ (পরিচালন)" : "Expense (Operating)"}</SelectItem>
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
          title={isBangla ? 'মোট আয়' : 'Total Revenue'}
          value={formatCurrency(totalRevenue)}
          icon={ArrowUpRight}
          iconColor="text-emerald-600"
        />
        <StatCard
          title={isBangla ? 'মোট খরচ' : 'Total Expenses'}
          value={formatCurrency(operatingExpenses)}
          icon={ArrowDownRight}
          iconColor="text-red-600"
        />
        <StatCard
          title={isBangla ? 'নেট লাভ' : 'Net Profit'}
          value={formatCurrency(netProfit)}
          icon={DollarSign}
          iconColor={netProfit >= 0 ? "text-emerald-600" : "text-red-600"}
        />
        <StatCard
          title={isBangla ? 'লাভের হার' : 'Profit Margin'}
          value={`${((netProfit / (totalRevenue || 1)) * 100).toFixed(1)}%`}
          icon={PieChart}
          iconColor="text-purple-600"
        />
      </div>

      {/* Profit & Loss Summary */}
      <Card>
        <CardHeader>
          <CardTitle>{isBangla ? 'লাভ-লোকসান সারাংশ' : 'Profit & Loss Summary'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Revenue */}
            <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
              <div className="flex items-center gap-3">
                <ArrowUpRight className="h-5 w-5 text-emerald-600" />
                <span className="font-medium">{isBangla ? 'মোট আয়' : 'Total Revenue'}</span>
              </div>
              <span className="font-bold text-emerald-600">{formatCurrency(totalRevenue)}</span>
            </div>

            {/* Cost of Goods */}
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950 rounded-lg">
              <div className="flex items-center gap-3">
                <ArrowDownRight className="h-5 w-5 text-red-600" />
                <span className="font-medium">{isBangla ? 'পণ্যের খরচ' : 'Cost of Goods Sold'}</span>
              </div>
              <span className="font-bold text-red-600">-{formatCurrency(costOfGoods)}</span>
            </div>

            {/* Gross Profit */}
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <span className="font-medium">{isBangla ? 'স্থূল লাভ' : 'Gross Profit'}</span>
              </div>
              <span className="font-bold text-blue-600">{formatCurrency(grossProfit)}</span>
            </div>

            {/* Operating Expenses */}
            <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <div className="flex items-center gap-3">
                <ArrowDownRight className="h-5 w-5 text-orange-600" />
                <span className="font-medium">{isBangla ? 'পরিচালন খরচ' : 'Operating Expenses'}</span>
              </div>
              <span className="font-bold text-orange-600">-{formatCurrency(operatingExpenses)}</span>
            </div>

            {/* Net Profit */}
            <div className={cn(
              "flex items-center justify-between p-4 rounded-lg border-2",
              netProfit >= 0 
                ? "bg-emerald-100 dark:bg-emerald-900 border-emerald-200 dark:border-emerald-800"
                : "bg-red-100 dark:bg-red-900 border-red-200 dark:border-red-800"
            )}>
              <div className="flex items-center gap-3">
                <TrendingUp className={cn("h-6 w-6", netProfit >= 0 ? "text-emerald-600" : "text-red-600")} />
                <span className="font-bold text-lg">{isBangla ? 'নেট লাভ' : 'Net Profit'}</span>
              </div>
              <span className={cn("font-bold text-xl", netProfit >= 0 ? "text-emerald-600" : "text-red-600")}>
                {formatCurrency(netProfit)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profit Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            {isBangla ? 'লাভের প্রবণতা' : 'Profit Trend'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorProfitReport" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Area type="monotone" dataKey="profit" name={isBangla ? 'লাভ' : 'Profit'} stroke="#3B82F6" fillOpacity={1} fill="url(#colorProfitReport)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center min-h-[200px] text-muted-foreground">
              {isBangla ? 'কোন তথ্য নেই' : 'No data available'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ledger Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            {isBangla ? 'আয় ও ব্যয়ের লেজার বিবরণী' : 'Income & Expense Ledger'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">{isBangla ? 'তারিখ' : 'Date'}</TableHead>
                  <TableHead className="font-semibold">{isBangla ? 'বিবরণ' : 'Description'}</TableHead>
                  <TableHead className="font-semibold">{isBangla ? 'ক্যাটাগরি' : 'Category'}</TableHead>
                  <TableHead className="font-semibold">{isBangla ? 'টাইপ' : 'Type'}</TableHead>
                  <TableHead className="text-right font-semibold">{isBangla ? 'পরিমাণ' : 'Amount'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLedger.length > 0 ? (
                  paginatedLedger.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {item.date.toLocaleDateString(isBangla ? 'bn-BD' : 'en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="font-medium">{item.description}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "border-transparent font-semibold shadow-none text-xs",
                            item.type === 'income'
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                          )}
                        >
                          {isBangla
                            ? (item.type === 'income' ? 'আয়' : 'ব্যয়')
                            : (item.type === 'income' ? 'Income' : 'Expense')}
                        </Badge>
                      </TableCell>
                      <TableCell className={cn(
                        "text-right font-bold",
                        item.type === 'income' ? "text-emerald-600" : "text-red-600"
                      )}>
                        {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      {isBangla ? 'কোনো বিবরণী পাওয়া যায়নি' : 'No ledger records found'}
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
    </div>
  );
}
