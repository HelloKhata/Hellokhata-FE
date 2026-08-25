// Hello Khata OS - Reports Dashboard Page
// হ্যালো খাতা - রিপোর্টস ড্যাশবোর্ড পেজ
// Recreated with premium aesthetics, HelloKhata color palette, and interactive widgets

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  TrendingDown,
  Receipt,
  ShoppingCart,
  Package,
  Calendar,
  Building2,
  ChevronDown,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  FileText,
  FileSpreadsheet,
  PieChart as PieChartIcon,
  BarChart3,
  Landmark,
  Home,
  Check,
  ChevronRight,
  Clock,
  Eye,
  Percent,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import { useBranchStore } from '@/stores/branchStore';
import { useBranches } from '@/hooks/queries';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// ==========================================
// MOCK DATA & CONSTANTS
// ==========================================

type PerformanceTab = 'revenue' | 'profit' | 'expense';
type PerformancePeriod = 'weekly' | 'monthly' | 'yearly';
type DateRangeOption = '7d' | '30d' | 'this_month' | 'last_month' | 'this_year';

const dateRangeLabels: Record<DateRangeOption, { en: string; bn: string; rangeTextEn: string; rangeTextBn: string }> = {
  '7d': { en: 'Last 7 Days', bn: 'গত ৭ দিন', rangeTextEn: 'May 11 – May 18, 2025', rangeTextBn: '১১ মে – ১৮ মে, ২০২৫' },
  '30d': { en: 'Last 30 Days', bn: 'গত ৩০ দিন', rangeTextEn: 'Apr 18 – May 18, 2025', rangeTextBn: '১৮ এপ্রিল – ১৮ মে, ২০২৫' },
  'this_month': { en: 'This Month', bn: 'চলতি মাস', rangeTextEn: 'May 01 – May 31, 2025', rangeTextBn: '০১ মে – ৩১ মে, ২০২৫' },
  'last_month': { en: 'Last Month', bn: 'গত মাস', rangeTextEn: 'Apr 01 – Apr 30, 2025', rangeTextBn: '০১ এপ্রিল – ৩০ এপ্রিল, ২০২৫' },
  'this_year': { en: 'This Year', bn: 'চলতি বছর', rangeTextEn: 'Jan 01 – Dec 31, 2025', rangeTextBn: '০১ জানু – ৩১ ডিসে, ২০২৫' },
};

// Financial Performance Time-Series Data
const performanceData: Record<PerformancePeriod, { date: string; dateBn: string; revenue: number; profit: number; expense: number }[]> = {
  weekly: [
    { date: 'May 11', dateBn: '১১ মে', revenue: 65000, profit: 42000, expense: 23000 },
    { date: 'May 12', dateBn: '১২ মে', revenue: 98000, profit: 62000, expense: 36000 },
    { date: 'May 13', dateBn: '১৩ মে', revenue: 84000, profit: 54000, expense: 30000 },
    { date: 'May 14', dateBn: '১৪ মে', revenue: 155000, profit: 105000, expense: 50000 },
    { date: 'May 15', dateBn: '১৫ মে', revenue: 120000, profit: 82000, expense: 38000 },
    { date: 'May 16', dateBn: '১৬ মে', revenue: 165000, profit: 115000, expense: 50000 },
    { date: 'May 17', dateBn: '১৭ মে', revenue: 248500, profit: 172300, expense: 76200 },
    { date: 'May 18', dateBn: '১৮ মে', revenue: 210000, profit: 145000, expense: 65000 },
  ],
  monthly: [
    { date: 'Jan', dateBn: 'জানু', revenue: 420000, profit: 270000, expense: 150000 },
    { date: 'Feb', dateBn: 'ফেব্রু', revenue: 510000, profit: 340000, expense: 170000 },
    { date: 'Mar', dateBn: 'মার্চ', revenue: 480000, profit: 310000, expense: 170000 },
    { date: 'Apr', dateBn: 'এপ্রিল', revenue: 620000, profit: 410000, expense: 210000 },
    { date: 'May', dateBn: 'মে', revenue: 780000, profit: 520000, expense: 260000 },
    { date: 'Jun', dateBn: 'জুন', revenue: 710000, profit: 480000, expense: 230000 },
    { date: 'Jul', dateBn: 'জুলাই', revenue: 850000, profit: 590000, expense: 260000 },
    { date: 'Aug', dateBn: 'আগস্ট', revenue: 920000, profit: 640000, expense: 280000 },
  ],
  yearly: [
    { date: '2021', dateBn: '২০২১', revenue: 4500000, profit: 2900000, expense: 1600000 },
    { date: '2022', dateBn: '২০২২', revenue: 6200000, profit: 4100000, expense: 2100000 },
    { date: '2023', dateBn: '২০২৩', revenue: 8400000, profit: 5600000, expense: 2800000 },
    { date: '2024', dateBn: '২০২৪', revenue: 11500000, profit: 7800000, expense: 3700000 },
    { date: '2025 (YTD)', dateBn: '২০২৫', revenue: 14200000, profit: 9800000, expense: 4400000 },
  ],
};

// Sales by Category Data
const salesCategoryData = [
  { name: 'Medicine', nameBn: 'ঔষধ', value: 42, color: '#0FBF9F', amount: '৳1,04,370' },
  { name: 'Grocery', nameBn: 'মুদিখানা', value: 28, color: '#3B82F6', amount: '৳69,580' },
  { name: 'Cosmetics', nameBn: 'প্রসাধন সামগ্রী', value: 18, color: '#F59E0B', amount: '৳44,730' },
  { name: 'Others', nameBn: 'অন্যান্য', value: 12, color: '#8B5CF6', amount: '৳29,820' },
];

// Expense Breakdown Data
const expenseBreakdownData = [
  { name: 'Purchase', nameBn: 'ক্রয়/সোর্সিং', value: 40, color: '#0FBF9F', amount: '৳30,480' },
  { name: 'Utilities', nameBn: 'ইউটিলিটি ও বিল', value: 20, color: '#3B82F6', amount: '৳15,240' },
  { name: 'Salary', nameBn: 'বেতন ও ভাতা', value: 18, color: '#F59E0B', amount: '৳13,716' },
  { name: 'Others', nameBn: 'অন্যান্য খরচ', value: 22, color: '#8B5CF6', amount: '৳16,764' },
];

// Top Selling Products
const topSellingProducts = [
  { id: 1, name: 'Paracetamol 500mg', nameBn: 'প্যারাসিটামল ৫০০ মি.গ্রা.', percentage: 18, sales: '৳44,730', units: '890 pcs' },
  { id: 2, name: 'ORS (Oral Rehydration Salts)', nameBn: 'ওআরএস স্যালাইন', percentage: 14, sales: '৳34,790', units: '1,240 pcs' },
  { id: 3, name: 'Cough Syrup 100ml', nameBn: 'কাফ সিরাপ ১০০ মিলি', percentage: 12, sales: '৳29,820', units: '420 pcs' },
  { id: 4, name: 'Vitamin C 500mg', nameBn: 'ভিটামিন সি ৫০০ মি.গ্রা.', percentage: 10, sales: '৳24,850', units: '650 pcs' },
  { id: 5, name: 'Face Mask (Pack of 50)', nameBn: 'ফেস মাস্ক (৫০ প্যাক)', percentage: 8, sales: '৳19,880', units: '310 pcs' },
];

// Recent Generated Reports
const recentReportsList = [
  {
    id: 'rep-01',
    name: 'Sales Report – May 2025',
    nameBn: 'বিক্রয় রিপোর্ট – মে ২০২৫',
    type: 'Sales',
    typeBn: 'বিক্রয়',
    badgeVariant: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    date: 'May 18, 2025 10:24 AM',
    dateBn: '১৮ মে, ২০২৫ ১০:২৪ পূর্বাহ্ণ',
    path: '/reports/sales',
  },
  {
    id: 'rep-02',
    name: 'Expense Report – May 2025',
    nameBn: 'ব্যয় রিপোর্ট – মে ২০২৫',
    type: 'Expense',
    typeBn: 'ব্যয়',
    badgeVariant: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    date: 'May 17, 2025 09:50 PM',
    dateBn: '১৭ মে, ২০২৫ ০৯:৫০ অপরাহ্ণ',
    path: '/reports/finance/income',
  },
  {
    id: 'rep-03',
    name: 'Inventory Report – May 2025',
    nameBn: 'ইনভেন্টরি রিপোর্ট – মে ২০২৫',
    type: 'Inventory',
    typeBn: 'ইনভেন্টরি',
    badgeVariant: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    date: 'May 16, 2025 08:42 PM',
    dateBn: '১৬ মে, ২০২৫ ০৮:৪২ অপরাহ্ণ',
    path: '/reports/inventory',
  },
];

// Quick Reports Links
const quickReports = [
  {
    id: 'profit-loss',
    title: 'Profit & Loss',
    titleBn: 'লাভ ও ক্ষতি',
    subtitle: 'Business performance',
    subtitleBn: 'ব্যবসায়িক পারফরম্যান্স',
    icon: Landmark,
    iconColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    path: '/reports/profit-loss',
  },
  {
    id: 'balance-sheet',
    title: 'Balance Sheet',
    titleBn: 'ব্যালেন্স শীট',
    subtitle: 'Financial position',
    subtitleBn: 'আর্থিক অবস্থান',
    icon: FileSpreadsheet,
    iconColor: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    path: '/reports/finance',
  },
  {
    id: 'cash-flow',
    title: 'Cash Flow',
    titleBn: 'ক্যাশ ফ্লো',
    subtitle: 'Liquidity movement',
    subtitleBn: 'নগদ অর্থের প্রবাহ',
    icon: Landmark,
    iconColor: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    path: '/reports/finance/cash-book',
  },
  {
    id: 'sales-report',
    title: 'Sales Report',
    titleBn: 'বিক্রয় রিপোর্ট',
    subtitle: 'Product wise sales',
    subtitleBn: 'পণ্যভিত্তিক বিক্রয়',
    icon: BarChart3,
    iconColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    path: '/reports/sales',
  },
  {
    id: 'expense-report',
    title: 'Expense Report',
    titleBn: 'ব্যয় রিপোর্ট',
    subtitle: 'Category wise spend',
    subtitleBn: 'খাতভিত্তিক খরচ',
    icon: Receipt,
    iconColor: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    path: '/reports/finance/income',
  },
  {
    id: 'inventory-report',
    title: 'Inventory Report',
    titleBn: 'ইনভেন্টরি রিপোর্ট',
    subtitle: 'Stock summary',
    subtitleBn: 'স্টকের সামগ্রিক বিবরণ',
    icon: Package,
    iconColor: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    path: '/reports/inventory',
  },
];

// Mini Sparkline SVG for Top Metric Cards
function MiniSparkline({
  data,
  color,
  gradientId,
}: {
  data: number[];
  color: string;
  gradientId: string;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 84;
  const height = 32;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(' ');

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg width={width} height={height} className="overflow-visible shrink-0">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.35} />
          <stop offset="100%" stopColor={color} stopOpacity={0.0} />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#${gradientId})`} />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

// Custom Recharts Tooltip for Main Performance Chart
const CustomAreaTooltip = ({ active, payload, label, isBangla, activeTab }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const rawVal = data.value;
    const formattedVal = `৳${rawVal.toLocaleString('en-IN')}`;

    let labelText = isBangla ? 'মোট আয়' : 'Total Revenue';
    if (activeTab === 'profit') labelText = isBangla ? 'মোট লাভ' : 'Net Profit';
    if (activeTab === 'expense') labelText = isBangla ? 'মোট ব্যয়' : 'Total Expense';

    return (
      <div className="bg-card/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-border/80 shadow-xl ring-1 ring-black/5 text-xs animate-in fade-in zoom-in-95 duration-150">
        <p className="font-semibold text-foreground mb-1">{label}</p>
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: data.color || '#0FBF9F' }}
          />
          <span className="text-muted-foreground">{labelText}:</span>
          <span className="font-bold text-foreground font-mono">{formattedVal}</span>
        </div>
      </div>
    );
  }
  return null;
};

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function ReportsDashboardPage() {
  const router = useRouter();
  const { t, isBangla } = useAppTranslation();
  const { currentBranchId, setCurrentBranch, viewAllBranches, setViewAllBranches } = useBranchStore();
  const { data: branches } = useBranches();

  // State
  const [dateRange, setDateRange] = useState<DateRangeOption>('7d');
  const [activePerformanceTab, setActivePerformanceTab] = useState<PerformanceTab>('revenue');
  const [performancePeriod, setPerformancePeriod] = useState<PerformancePeriod>('weekly');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentBranch = useMemo(() => {
    return branches?.find((b) => b.id === currentBranchId);
  }, [branches, currentBranchId]);

  // Active chart color based on active tab
  const activeTabColor = useMemo(() => {
    switch (activePerformanceTab) {
      case 'profit':
        return '#0FBF9F'; // Emerald
      case 'expense':
        return '#F43F5E'; // Rose
      case 'revenue':
      default:
        return '#0FBF9F'; // Primary Emerald
    }
  }, [activePerformanceTab]);

  const currentPerformanceSeries = useMemo(() => {
    return performanceData[performancePeriod] || performanceData.weekly;
  }, [performancePeriod]);

  // Open AI modal or trigger AI assistant
  const handleOpenAiAssistant = () => {
    const event = new CustomEvent('openVoiceModal');
    window.dispatchEvent(event);
  };

  return (
    <div className="min-h-screen bg-background/50 text-foreground pb-12 space-y-6">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & BREADCRUMBS ROW                                           */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
        {/* Left Title & Breadcrumbs */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm shrink-0">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {isBangla ? 'রিপোর্টস' : 'Reports'}
              </h1>
              <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground ml-3 border-l border-border pl-3">
                <Link href="/" className="hover:text-foreground flex items-center gap-1 transition-colors">
                  <Home className="w-3.5 h-3.5" />
                  <span>{isBangla ? 'হোম' : 'Home'}</span>
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
                <span className="text-foreground font-medium">{isBangla ? 'রিপোর্টস' : 'Reports'}</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              {isBangla ? 'এক নজরে ব্যবসার গুরুত্বপূর্ণ তথ্য ও বিশ্লেষণ' : 'Business insights at a glance'}
            </p>
          </div>
        </div>

        {/* Right Controls: Date Range Selector & Branch Selector */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date Range Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-10 px-3.5 rounded-xl border-border bg-card hover:bg-muted/50 text-foreground font-medium shadow-xs gap-2"
              >
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs sm:text-sm">
                  {isBangla ? dateRangeLabels[dateRange].rangeTextBn : dateRangeLabels[dateRange].rangeTextEn}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border-border rounded-xl shadow-lg">
              <DropdownMenuLabel className="text-xs text-muted-foreground font-medium px-2 py-1.5">
                {isBangla ? 'সময়সীমা নির্বাচন করুন' : 'Select Time Range'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              {(Object.keys(dateRangeLabels) as DateRangeOption[]).map((key) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => setDateRange(key)}
                  className={cn(
                    'cursor-pointer text-xs font-medium px-2.5 py-2 rounded-lg flex items-center justify-between',
                    dateRange === key ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground hover:bg-muted/50'
                  )}
                >
                  <span>{isBangla ? dateRangeLabels[key].bn : dateRangeLabels[key].en}</span>
                  {dateRange === key && <Check className="w-4 h-4 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Branch Switcher Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-10 px-3.5 rounded-xl border-border bg-card hover:bg-muted/50 text-foreground font-medium shadow-xs gap-2"
              >
                <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs sm:text-sm">
                  {viewAllBranches
                    ? (isBangla ? 'সব শাখা' : 'All Branches')
                    : (currentBranch?.nameBn || currentBranch?.name || (isBangla ? 'ঢাকা শাখা' : 'Dhaka Branch'))}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border-border rounded-xl shadow-lg">
              <DropdownMenuLabel className="text-xs text-muted-foreground font-medium px-2 py-1.5">
                {isBangla ? 'শাখা ফিল্টার' : 'Branch Filter'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem
                onClick={() => setViewAllBranches(true)}
                className={cn(
                  'cursor-pointer text-xs font-medium px-2.5 py-2 rounded-lg flex items-center justify-between',
                  viewAllBranches ? 'bg-emerald-500/10 text-emerald-600 font-semibold' : 'text-foreground hover:bg-muted/50'
                )}
              >
                <span>{isBangla ? 'সব শাখা' : 'All Branches'}</span>
                {viewAllBranches && <Check className="w-4 h-4 text-emerald-600" />}
              </DropdownMenuItem>
              {branches && branches.length > 0 ? (
                branches.map((b) => (
                  <DropdownMenuItem
                    key={b.id}
                    onClick={() => {
                      setCurrentBranch(b.id);
                      setViewAllBranches(false);
                    }}
                    className={cn(
                      'cursor-pointer text-xs font-medium px-2.5 py-2 rounded-lg flex items-center justify-between',
                      !viewAllBranches && currentBranchId === b.id
                        ? 'bg-emerald-500/10 text-emerald-600 font-semibold'
                        : 'text-foreground hover:bg-muted/50'
                    )}
                  >
                    <span>{b.nameBn || b.name}</span>
                    {!viewAllBranches && currentBranchId === b.id && <Check className="w-4 h-4 text-emerald-600" />}
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem
                  onClick={() => setViewAllBranches(false)}
                  className="cursor-pointer text-xs font-medium px-2.5 py-2 rounded-lg text-foreground hover:bg-muted/50"
                >
                  <span>{isBangla ? 'ঢাকা প্রধান শাখা' : 'Dhaka Main Branch'}</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TOP KPI SUMMARY METRIC CARDS (4 Columns)                                */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue Card */}
        <div className="bg-card border border-border/80 rounded-2xl p-4.5 shadow-xs hover:border-emerald-500/40 hover:shadow-md transition-all duration-200 relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">{isBangla ? 'মোট আয়' : 'Total Revenue'}</p>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-0.5 font-mono">
                  {isBangla ? '৳২,৪৮,৫০০' : '৳2,48,500'}
                </h3>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3.5 pt-2 border-t border-border/40">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              <span>+ 12.4%</span>
              <span className="text-muted-foreground font-normal">{isBangla ? 'গত সপ্তাহের চেয়ে' : 'vs last week'}</span>
            </span>
            <MiniSparkline data={[40, 52, 48, 65, 58, 80, 95]} color="#0FBF9F" gradientId="grad-revenue" />
          </div>
        </div>

        {/* Total Expense Card */}
        <div className="bg-card border border-border/80 rounded-2xl p-4.5 shadow-xs hover:border-rose-500/40 hover:shadow-md transition-all duration-200 relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">{isBangla ? 'মোট ব্যয়' : 'Total Expense'}</p>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-0.5 font-mono">
                  {isBangla ? '৳৭৬,২০০' : '৳76,200'}
                </h3>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3.5 pt-2 border-t border-border/40">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
              <span>- 6.7%</span>
              <span className="text-muted-foreground font-normal">{isBangla ? 'গত সপ্তাহের চেয়ে' : 'vs last week'}</span>
            </span>
            <MiniSparkline data={[70, 65, 55, 60, 50, 48, 42]} color="#F43F5E" gradientId="grad-expense" />
          </div>
        </div>

        {/* Net Profit Card */}
        <div className="bg-card border border-border/80 rounded-2xl p-4.5 shadow-xs hover:border-teal-500/40 hover:shadow-md transition-all duration-200 relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 dark:bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">{isBangla ? 'নিট লাভ' : 'Net Profit'}</p>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-0.5 font-mono">
                  {isBangla ? '৳১,৭২,৩০০' : '৳1,72,300'}
                </h3>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3.5 pt-2 border-t border-border/40">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-600 dark:text-teal-400">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block" />
              <span>+ 18.6%</span>
              <span className="text-muted-foreground font-normal">{isBangla ? 'গত সপ্তাহের চেয়ে' : 'vs last week'}</span>
            </span>
            <MiniSparkline data={[30, 42, 38, 55, 62, 75, 88]} color="#14B8A6" gradientId="grad-profit" />
          </div>
        </div>

        {/* Sales Orders Card */}
        <div className="bg-card border border-border/80 rounded-2xl p-4.5 shadow-xs hover:border-blue-500/40 hover:shadow-md transition-all duration-200 relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">{isBangla ? 'বিক্রয় অর্ডার' : 'Sales Orders'}</p>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-0.5 font-mono">
                  {isBangla ? '৩৪২' : '342'}
                </h3>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3.5 pt-2 border-t border-border/40">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
              <span>+ 14.2%</span>
              <span className="text-muted-foreground font-normal">{isBangla ? 'গত সপ্তাহের চেয়ে' : 'vs last week'}</span>
            </span>
            <MiniSparkline data={[45, 48, 55, 62, 58, 70, 85]} color="#3B82F6" gradientId="grad-orders" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MIDDLE SECTION: Performance Area Chart, Donut Category, Quick Reports  */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Financial Performance Area Chart (Spans 5 cols on lg, 5 cols on xl) */}
        <div className="lg:col-span-5 bg-card border border-border/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            {/* Card Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-foreground tracking-tight">
                  {isBangla ? 'আর্থিক পারফরম্যান্স' : 'Financial Performance'}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {/* Metric Tabs */}
                <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border text-xs">
                  <button
                    onClick={() => setActivePerformanceTab('revenue')}
                    className={cn(
                      'px-2.5 py-1 rounded-md font-medium transition-all',
                      activePerformanceTab === 'revenue'
                        ? 'bg-card text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {isBangla ? 'আয়' : 'Revenue'}
                  </button>
                  <button
                    onClick={() => setActivePerformanceTab('profit')}
                    className={cn(
                      'px-2.5 py-1 rounded-md font-medium transition-all',
                      activePerformanceTab === 'profit'
                        ? 'bg-card text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {isBangla ? 'লাভ' : 'Profit'}
                  </button>
                  <button
                    onClick={() => setActivePerformanceTab('expense')}
                    className={cn(
                      'px-2.5 py-1 rounded-md font-medium transition-all',
                      activePerformanceTab === 'expense'
                        ? 'bg-card text-rose-600 dark:text-rose-400 shadow-xs font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {isBangla ? 'ব্যয়' : 'Expense'}
                  </button>
                </div>

                {/* Period Switcher Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="h-7 px-2 text-xs font-medium text-muted-foreground hover:text-foreground bg-muted/40 hover:bg-muted/70 rounded-lg border border-border flex items-center gap-1 transition-colors">
                      <span className="capitalize">{isBangla ? (performancePeriod === 'weekly' ? 'সাপ্তাহিক' : performancePeriod === 'monthly' ? 'মাসিক' : 'বার্ষিক') : performancePeriod}</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32 bg-card border-border rounded-xl">
                    <DropdownMenuItem onClick={() => setPerformancePeriod('weekly')} className="text-xs cursor-pointer">
                      {isBangla ? 'সাপ্তাহিক' : 'Weekly'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPerformancePeriod('monthly')} className="text-xs cursor-pointer">
                      {isBangla ? 'মাসিক' : 'Monthly'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPerformancePeriod('yearly')} className="text-xs cursor-pointer">
                      {isBangla ? 'বার্ষিক' : 'Yearly'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Performance Chart Area */}
            <div className="h-64 w-full relative pt-2">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={currentPerformanceSeries}
                    margin={{ top: 20, right: 10, left: -15, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="performanceAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={activeTabColor} stopOpacity={0.4} />
                        <stop offset="60%" stopColor={activeTabColor} stopOpacity={0.12} />
                        <stop offset="100%" stopColor={activeTabColor} stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.6} />
                    <XAxis
                      dataKey={isBangla ? 'dateBn' : 'date'}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                      dy={8}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                      tickFormatter={(val) => {
                        if (val >= 100000) return `৳${(val / 100000).toFixed(1)}L`;
                        if (val >= 1000) return `৳${(val / 1000).toFixed(0)}k`;
                        return `৳${val}`;
                      }}
                    />
                    <Tooltip
                      content={<CustomAreaTooltip isBangla={isBangla} activeTab={activePerformanceTab} />}
                    />
                    <Area
                      type="monotone"
                      dataKey={activePerformanceTab}
                      stroke={activeTabColor}
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#performanceAreaGrad)"
                      activeDot={{
                        r: 6,
                        fill: activeTabColor,
                        stroke: '#FFFFFF',
                        strokeWidth: 2,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Chart Footer Link */}
          <div className="flex items-center justify-between pt-3 mt-2 border-t border-border/50 text-xs">
            <span className="text-emerald-600 dark:text-emerald-400 font-medium inline-flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{isBangla ? '↑ ১২.৪% পূর্বের সময়ের তুলনায়' : '↑ 12.4% vs previous period'}</span>
            </span>
            <Link
              href="/reports/finance"
              className="text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 font-medium inline-flex items-center gap-1 transition-colors group"
            >
              <span>{isBangla ? 'বিস্তারিত রিপোর্ট দেখুন' : 'View Detailed Report'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Center: Sales by Category Donut Chart (Spans 4 cols on lg) */}
        <div className="lg:col-span-4 bg-card border border-border/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold text-foreground tracking-tight">
                {isBangla ? 'ক্যাটাগরি অনুযায়ী বিক্রয়' : 'Sales by Category'}
              </h2>
            </div>

            {/* Donut Chart with Center Text */}
            <div className="h-44 w-full relative flex items-center justify-center my-1">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={salesCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {salesCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any, name: any, item: any) => [
                        `${val}% (${item.payload.amount})`,
                        isBangla ? item.payload.nameBn : name,
                      ]}
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        borderColor: 'var(--border)',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
              {/* Center Text Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-lg font-bold text-foreground font-mono leading-tight">
                  {isBangla ? '৳২.৪৮L' : '৳2.48L'}
                </span>
                <span className="text-[10px] text-muted-foreground font-medium">
                  {isBangla ? 'মোট বিক্রয়' : 'Total Sales'}
                </span>
              </div>
            </div>

            {/* Category Breakdown Legend */}
            <div className="space-y-2 mt-3 pt-3 border-t border-border/50">
              {salesCategoryData.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-foreground font-medium">{isBangla ? cat.nameBn : cat.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground font-mono text-[11px]">{cat.amount}</span>
                    <span className="font-semibold text-foreground font-mono w-8 text-right">{cat.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Quick Reports Navigation Hub (Spans 3 cols on lg) */}
        <div className="lg:col-span-3 bg-card border border-border/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-foreground tracking-tight">
                {isBangla ? 'কুইক রিপোর্টস' : 'Quick Reports'}
              </h2>
            </div>

            <div className="space-y-1.5">
              {quickReports.map((report) => {
                const IconComp = report.icon;
                return (
                  <Link
                    key={report.id}
                    href={report.path}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted/60 border border-transparent hover:border-border/80 transition-all duration-150 group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center border shrink-0',
                          report.iconColor
                        )}
                      >
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {isBangla ? report.titleBn : report.title}
                        </h4>
                        <p className="text-[10px] text-muted-foreground">
                          {isBangla ? report.subtitleBn : report.subtitle}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. BOTTOM GRID: Top Selling, Expense Breakdown, Stock, Health, AI & Recent */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
        {/* Card 1: Top Selling Products (Spans 4 cols on lg) */}
        <div className="lg:col-span-4 bg-card border border-border/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-base">🏆</span>
                <h3 className="text-sm font-bold text-foreground tracking-tight">
                  {isBangla ? 'শীর্ষ বিক্রীত পণ্য' : 'Top Selling Products'}
                </h3>
              </div>
              <Link
                href="/reports/sales"
                className="text-xs text-primary hover:underline font-medium"
              >
                {isBangla ? 'সব দেখুন' : 'View All'}
              </Link>
            </div>

            <div className="space-y-3.5">
              {topSellingProducts.map((prod) => (
                <div key={prod.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground truncate max-w-[180px]">
                      {prod.id}. {isBangla ? prod.nameBn : prod.name}
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-xs">
                      {prod.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-muted/60 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${prod.percentage * 4}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Expense Breakdown (Spans 4 cols on lg) */}
        <div className="lg:col-span-4 bg-card border border-border/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Receipt className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-bold text-foreground tracking-tight">
                {isBangla ? 'ব্যয়ের বিভাজন' : 'Expense Breakdown'}
              </h3>
            </div>

            {/* Expense Donut Chart */}
            <div className="h-36 w-full relative flex items-center justify-center my-1">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseBreakdownData}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {expenseBreakdownData.map((entry, index) => (
                        <Cell key={`exp-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any, name: any, item: any) => [
                        `${val}% (${item.payload.amount})`,
                        isBangla ? item.payload.nameBn : name,
                      ]}
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        borderColor: 'var(--border)',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
              {/* Center Text Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-base font-bold text-foreground font-mono leading-tight">
                  {isBangla ? '৳৭৬,২০০' : '৳76,200'}
                </span>
                <span className="text-[9px] text-muted-foreground font-medium">
                  {isBangla ? 'মোট ব্যয়' : 'Total Expense'}
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-border/50">
              {expenseBreakdownData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-[11px] p-1 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground truncate">{isBangla ? item.nameBn : item.name}</span>
                  </div>
                  <span className="font-bold text-foreground font-mono">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 3: Stock Status & Business Health (Spans 4 cols on lg) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Stock Status Box */}
          <div className="bg-card border border-border/80 rounded-2xl p-4.5 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                {isBangla ? 'স্টক অবস্থা' : 'Stock Status'}
              </h3>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  {isBangla ? 'লো স্টক' : 'Low Stock'}
                </span>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-bold px-2 py-0.5 text-xs">
                  {isBangla ? '৬' : '6'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                  {isBangla ? 'আউট অফ স্টক' : 'Out of Stock'}
                </span>
                <Badge variant="outline" className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 font-bold px-2 py-0.5 text-xs">
                  {isBangla ? '২' : '2'}
                </Badge>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-border/40">
                <span className="text-muted-foreground">{isBangla ? 'মোট পণ্য আইটেম' : 'Total Products'}</span>
                <span className="font-bold text-foreground font-mono">{isBangla ? '১,২৪৮' : '1,248'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{isBangla ? 'বর্তমান স্টক মূল্য' : 'Stock Value'}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{isBangla ? '৳৪,৩২,০০০' : '৳4,32,000'}</span>
              </div>
            </div>
          </div>

          {/* Business Health Gauge */}
          <div className="bg-card border border-border/80 rounded-2xl p-4.5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-rose-500 text-sm">❤️</span>
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  {isBangla ? 'ব্যবসায়িক স্বাস্থ্য' : 'Business Health'}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Radial Circle */}
              <div className="relative w-16 h-16 rounded-full border-4 border-emerald-500/20 flex items-center justify-center shrink-0">
                <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin-slow" />
                <div className="text-center">
                  <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono block leading-none">
                    92
                  </span>
                  <span className="text-[8px] text-muted-foreground block">/100</span>
                </div>
              </div>
              {/* Health checklist items */}
              <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px]">
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{isBangla ? 'বিক্রয় প্রবৃদ্ধি' : 'Sales Growth'}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{isBangla ? 'লাভজনকতা' : 'Profitability'}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{isBangla ? 'ক্যাশ ফ্লো' : 'Cash Flow'}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{isBangla ? 'কম ঝুঁকি' : 'Low Risk'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Recent Generated Reports Table (Spans 7 cols on lg) */}
        <div className="lg:col-span-7 bg-card border border-border/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-foreground tracking-tight">
                  {isBangla ? 'সাম্প্রতিক রিপোর্টসমূহ' : 'Recent Reports'}
                </h3>
              </div>
              <Link
                href="/reports/sales"
                className="text-xs text-primary hover:underline font-medium"
              >
                {isBangla ? 'সব দেখুন' : 'View All'}
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/60 text-muted-foreground font-semibold">
                    <th className="pb-2.5 font-medium">{isBangla ? 'রিপোর্টের নাম' : 'Report Name'}</th>
                    <th className="pb-2.5 font-medium">{isBangla ? 'ধরন' : 'Type'}</th>
                    <th className="pb-2.5 font-medium">{isBangla ? 'জেনারেট সময়' : 'Generated On'}</th>
                    <th className="pb-2.5 font-medium text-right">{isBangla ? 'অ্যাকশন' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {recentReportsList.map((row) => (
                    <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-medium text-foreground">
                        {isBangla ? row.nameBn : row.name}
                      </td>
                      <td className="py-3">
                        <Badge
                          variant="outline"
                          className={cn('text-[10px] font-semibold px-2 py-0.5', row.badgeVariant)}
                        >
                          {isBangla ? row.typeBn : row.type}
                        </Badge>
                      </td>
                      <td className="py-3 text-muted-foreground text-[11px] font-mono">
                        {isBangla ? row.dateBn : row.date}
                      </td>
                      <td className="py-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="h-6 px-2.5 text-[11px] rounded-lg border-border hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
                        >
                          <Link href={row.path}>
                            {isBangla ? 'দেখুন' : 'View'}
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Card 5: AI Insights Card (Spans 5 cols on lg) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-card via-card to-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-foreground tracking-tight flex items-center gap-1.5">
                <span>{isBangla ? 'এআই ইনসাইটস' : 'AI Insights'}</span>
                <span className="text-[10px] font-normal px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Smart AI
                </span>
              </h3>
            </div>

            <div className="space-y-3">
              {/* Insight 1: Sales */}
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-muted/40 border border-border/50">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-foreground">
                    {isBangla ? 'বিক্রয় বৃদ্ধি পেয়েছে ১৮%' : 'Sales increased by 18%'}
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {isBangla ? 'গত সপ্তাহের তুলনায় বিক্রয় সর্বোচ্চ পর্যায়ে পৌঁছেছে।' : 'Compared to last week, sales reached a strong peak.'}
                  </p>
                </div>
              </div>

              {/* Insight 2: Low Stock */}
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-muted/40 border border-border/50">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-foreground">
                    {isBangla ? '৬টি পণ্যের স্টক কম রয়েছে' : '6 products are low in stock'}
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {isBangla ? 'স্টকআউট এড়াতে দ্রুত রিস্টক অর্ডার দেওয়ার পরামর্শ।' : 'Reorder recommended to avoid impending stockouts.'}
                  </p>
                </div>
              </div>

              {/* Insight 3: Profit Margin */}
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-muted/40 border border-border/50">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Info className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-foreground">
                    {isBangla ? 'প্রফিট মার্জিন ১২% বৃদ্ধি' : 'Profit margin is 12% higher'}
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {isBangla ? 'কার্যকর ব্যয় নিয়ন্ত্রণের ফলে মার্জিন সন্তোষজনক।' : 'Effective operational expense control resulted in high performance.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* AI CTA Button */}
          <div className="mt-4 pt-3 border-t border-border/50">
            <Button
              onClick={handleOpenAiAssistant}
              className="w-full h-9 bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isBangla ? 'হ্যালো খাতা এআই-কে জিজ্ঞাসা করুন' : 'Ask HelloKhata AI'}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
