// Hello Khata OS - Reports Page
// হ্যালো খাতা - রিপোর্ট পেজ

'use client';

import { useState } from 'react';
import { PageHeader, StatCard } from '@/components/common';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart3,
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  FileSpreadsheet,
  Printer,
  Loader2,
} from 'lucide-react';
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
  PieChart as RechartsPie,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useDashboardStats, useDailySales, useItems } from '@/hooks/queries';
import { useCurrency, useAppTranslation } from '@/hooks/useAppTranslation';

const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899'];

export default function ReportsPage() {
  const { t, isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const { toast } = useToast();
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [exportingType, setExportingType] = useState<string | null>(null);

  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: dailySales, isLoading: salesLoading } = useDailySales();
  const { data: items } = useItems();

  const getPeriodLabel = () => {
    const labels: Record<string, string> = {
      '7d': isBangla ? 'গত ৭ দিন' : 'Last 7 days',
      '30d': isBangla ? 'গত ৩০ দিন' : 'Last 30 days',
      '90d': isBangla ? 'গত ৯০ দিন' : 'Last 90 days',
      '1y': isBangla ? 'গত ১ বছর' : 'Last year',
    };
    return labels[period];
  };

  const salesByCategory = [
    { name: isBangla ? 'খাদ্য পণ্য' : 'Food', value: 45 },
    { name: isBangla ? 'পানীয়' : 'Beverages', value: 25 },
    { name: isBangla ? 'দৈনন্দিন' : 'Daily', value: 15 },
    { name: isBangla ? 'অন্যান্য' : 'Others', value: 15 },
  ];

  const chartData = dailySales?.map((item) => ({
    date: new Date(item.date).toLocaleDateString(isBangla ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'short' }),
    sales: item.sales,
    expenses: item.expenses,
    profit: item.profit,
  })) || [];

  const getReportData = (): ReportData => ({
    dateRange: {
      start: new Date(Date.now() - (period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      end: new Date().toLocaleDateString(),
      period: getPeriodLabel(),
    },
    stats: {
      totalSales: stats?.todaySales || 0,
      totalExpenses: stats?.todayExpenses || 0,
      netProfit: stats?.todayProfit || 0,
      profitMargin: ((stats?.todayProfit || 0) / (stats?.todaySales || 1)) * 100,
      receivable: stats?.receivable || 0,
      stockValue: stats?.stockValue || 0,
    },
    chartData: chartData.map(item => ({
      date: item.date,
      sales: item.sales,
      expenses: item.expenses,
      profit: item.profit,
    })),
    salesByCategory,
    profitLossSummary: {
      totalRevenue: stats?.todaySales || 0,
      costOfGoods: Math.round((stats?.todaySales || 0) * 0.63),
      grossProfit: Math.round((stats?.todaySales || 0) * 0.37),
      operatingExpenses: stats?.todayExpenses || 0,
      netProfit: stats?.todayProfit || 0,
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

  if (statsLoading || salesLoading) {
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
            <BarChart3 className="h-6 w-6 text-primary" />
            {t('reports.title')}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isBangla ? 'ব্যবসার বিশ্লেষণ ও প্রতিবেদন' : 'Business analytics & reports'}
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

      {/* Period Selector Card */}
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            {isBangla ? 'সময়কাল নির্বাচন করুন' : 'Select Period'}
          </span>
          <Select value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">{isBangla ? 'গত ৭ দিন' : 'Last 7 days'}</SelectItem>
              <SelectItem value="30d">{isBangla ? 'গত ৩০ দিন' : 'Last 30 days'}</SelectItem>
              <SelectItem value="90d">{isBangla ? 'গত ৯০ দিন' : 'Last 90 days'}</SelectItem>
              <SelectItem value="1y">{isBangla ? 'গত ১ বছর' : 'Last year'}</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title={isBangla ? 'মোট বিক্রি' : 'Total Sales'}
          value={formatCurrency(stats?.todaySales || 0)}
          icon={TrendingUp}
          iconColor="text-emerald-600"
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title={isBangla ? 'মোট খরচ' : 'Total Expenses'}
          value={formatCurrency(stats?.todayExpenses || 0)}
          icon={TrendingDown}
          iconColor="text-orange-600"
          trend={{ value: -5.2, isPositive: true }}
        />
        <StatCard
          title={isBangla ? 'নেট লাভ' : 'Net Profit'}
          value={formatCurrency(stats?.todayProfit || 0)}
          icon={DollarSign}
          iconColor="text-blue-600"
          trend={{ value: 18.3, isPositive: true }}
        />
        <StatCard
          title={isBangla ? 'লাভের হার' : 'Profit Margin'}
          value={`${((stats?.todayProfit || 0) / (stats?.todaySales || 1) * 100).toFixed(1)}%`}
          icon={PieChart}
          iconColor="text-purple-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              {isBangla ? 'বিক্রির প্রবণতা' : 'Sales Trend'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSalesReport" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Area type="monotone" dataKey="sales" stroke="#10B981" fillOpacity={1} fill="url(#colorSalesReport)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sales by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-purple-600" />
              {isBangla ? 'ক্যাটাগরি অনুযায়ী বিক্রি' : 'Sales by Category'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPie>
                <Pie
                  data={salesByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {salesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsPie>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
