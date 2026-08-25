'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Wallet,
  Building2,
  Receipt,
  FileClock,
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  Info,
  Calendar,
  Download,
  ChevronDown,
  ArrowRight,
  CreditCard,
  Smartphone,
  AlertTriangle,
  FileText,
  Clock,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Printer,
  FileSpreadsheet,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';

// --- DATA STRUCTURES & MOCK DATA ---

const INCOME_EXPENSE_DATA = [
  { date: 'Jul 23', dateBn: '২৩ জুলাই', income: 42000, expense: 28000 },
  { date: 'Jul 28', dateBn: '২৮ জুলাই', income: 68000, expense: 34000 },
  { date: 'Aug 02', dateBn: '০২ আগস্ট', income: 94000, expense: 45000 },
  { date: 'Aug 07', dateBn: '০৭ আগস্ট', income: 48000, expense: 38000 },
  { date: 'Aug 12', dateBn: '১২ আগস্ট', income: 58000, expense: 42000 },
  { date: 'Aug 17', dateBn: '১৭ আগস্ট', income: 75000, expense: 39000 },
  { date: 'Aug 22', dateBn: '২২ আগস্ট', income: 88000, expense: 52000 },
];

const CASH_FLOW_DATA = [
  { name: 'Cash Inflow', nameBn: 'নগদ আগমন', value: 186340, percentage: '62%', colorHex: '#10b981' },
  { name: 'Cash Outflow', nameBn: 'নগদ নির্গমন', value: 87720, percentage: '29%', colorHex: '#f43f5e' },
  { name: 'Transfers In', nameBn: 'ট্রান্সফার ইন', value: 15000, percentage: '5%', colorHex: '#3b82f6' },
  { name: 'Transfers Out', nameBn: 'ট্রান্সফার আউট', value: 5000, percentage: '4%', colorHex: '#f59e0b' },
];

const TOP_INCOME_CATEGORIES = [
  { name: 'Sales Income', nameBn: 'বিক্রয় আয়', amount: 120700, percentage: 65, color: '#10b981', bg: 'bg-emerald-500/10 text-emerald-400' },
  { name: 'Service Income', nameBn: 'সার্ভিস আয়', amount: 27900, percentage: 15, color: '#0FBF9F', bg: 'bg-teal-500/10 text-teal-400' },
  { name: 'Other Income', nameBn: 'অন্যান্য আয়', amount: 18600, percentage: 10, color: '#06b6d4', bg: 'bg-cyan-500/10 text-cyan-400' },
  { name: 'Interest Income', nameBn: 'সুদ আয়', amount: 9250, percentage: 5, color: '#3b82f6', bg: 'bg-blue-500/10 text-blue-400' },
  { name: 'Discount Received', nameBn: 'প্রাপ্ত বাট্টা', amount: 3300, percentage: 5, color: '#10b981', bg: 'bg-emerald-500/10 text-emerald-400' },
];

const TOP_EXPENSE_CATEGORIES = [
  { name: 'Rent', nameBn: 'দোকান/অফিস ভাড়া', amount: 15800, percentage: 32, color: '#f43f5e', bg: 'bg-rose-500/10 text-rose-400' },
  { name: 'Utilities', nameBn: 'ইউটিলিটি বিল', amount: 6860, percentage: 14, color: '#f97316', bg: 'bg-orange-500/10 text-orange-400' },
  { name: 'Salary', nameBn: 'কর্মচারী বেতন', amount: 9800, percentage: 20, color: '#6366f1', bg: 'bg-indigo-500/10 text-indigo-400' },
  { name: 'Inventory', nameBn: 'ইনভেন্টরি খরচ', amount: 8820, percentage: 18, color: '#a855f7', bg: 'bg-purple-500/10 text-purple-400' },
  { name: 'Transport', nameBn: 'যাতায়াত ও পরিবহন', amount: 3900, percentage: 8, color: '#ec4899', bg: 'bg-pink-500/10 text-pink-400' },
];

const RECENT_TRANSACTIONS = [
  {
    id: 'tx-1',
    title: 'Sales Income',
    titleBn: 'বিক্রয় আয়',
    subtitle: 'Walk-in Customer',
    subtitleBn: 'সরাসরি খদ্দের',
    date: 'Aug 22, 2026',
    dateBn: '২২ আগস্ট, ২০২৬',
    amount: 850,
    type: 'income',
  },
  {
    id: 'tx-2',
    title: 'Transport Expense',
    titleBn: 'পরিবহন খরচ',
    subtitle: 'Courier dispatch charges',
    subtitleBn: 'কুরিয়ার ডেলিভারি চার্জ',
    date: 'Aug 22, 2026',
    dateBn: '২২ আগস্ট, ২০২৬',
    amount: -850,
    type: 'expense',
  },
  {
    id: 'tx-3',
    title: 'Service Income',
    titleBn: 'সার্ভিস আয়',
    subtitle: 'Showroom internet bill (July)',
    subtitleBn: 'শোরুম ইন্টারনেট বিল (জুলাই)',
    date: 'Aug 21, 2026',
    dateBn: '২১ আগস্ট, ২০২৬',
    amount: 2500,
    type: 'income',
  },
  {
    id: 'tx-4',
    title: 'Rent Expense',
    titleBn: 'ভাড়া খরচ',
    subtitle: 'Gulshan showroom shop rent',
    subtitleBn: 'গুলশান শোরুমের দোকান ভাড়া',
    date: 'Aug 20, 2026',
    dateBn: '২০ আগস্ট, ২০২৬',
    amount: -15000,
    type: 'expense',
  },
  {
    id: 'tx-5',
    title: 'Interest Income',
    titleBn: 'সুদ আয়',
    subtitle: 'Savings account interest',
    subtitleBn: 'সঞ্চয়ী হিসাবের অর্জিত সুদ',
    date: 'Aug 19, 2026',
    dateBn: '১৯ আগস্ট, ২০২৬',
    amount: 1250,
    type: 'income',
  },
];

export default function FinanceOverviewPage() {
  const { isBangla } = useAppTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Jul 23, 2026 - Aug 22, 2026');
  const [periodLabel, setPeriodLabel] = useState<string>('This Month');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isBangla ? 'bn-BD' : 'en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleExport = (type: string) => {
    toast.success(
      isBangla
        ? `${type} ফরম্যাটে রিপোর্ট তৈরি হচ্ছে...`
        : `Generating ${type} report export...`
    );
  };

  return (
    <TooltipProvider>
      <div className="space-y-6 pb-12">
        {/* =========================================================================
            1. HEADER SECTION
           ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
              <span>{isBangla ? 'অর্থায়ন ও হিসাববিজ্ঞান ওভারভিউ' : 'Finance & Accounting Overview'}</span>
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              {isBangla
                ? 'আপনার ব্যবসায়ের আর্থিক অবস্থার রিয়েল-টাইম সামগ্রিক সারসংক্ষেপ'
                : 'Real-time summary of your business financial health'}
            </p>
          </div>

          {/* Header Controls: Date Filter & Export Button */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Date Range Picker Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-card border border-white/10 hover:border-white/20 text-foreground transition-all shadow-sm">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                <span>{selectedPeriod}</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card border border-white/10 backdrop-blur-xl">
                <DropdownMenuItem onClick={() => { setSelectedPeriod('Today'); setPeriodLabel('Today'); }}>
                  {isBangla ? 'আজ' : 'Today'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedPeriod('This Week'); setPeriodLabel('This Week'); }}>
                  {isBangla ? 'এই সপ্তাহ' : 'This Week'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedPeriod('Jul 23, 2026 - Aug 22, 2026'); setPeriodLabel('This Month'); }}>
                  {isBangla ? 'এই মাস (গত ৩০ দিন)' : 'Jul 23, 2026 - Aug 22, 2026 (This Month)'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedPeriod('Last 30 Days'); setPeriodLabel('Last 30 Days'); }}>
                  {isBangla ? 'গত ৩০ দিন' : 'Last 30 Days'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedPeriod('This Quarter'); setPeriodLabel('This Quarter'); }}>
                  {isBangla ? 'এই কোয়ার্টার' : 'This Quarter'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedPeriod('This Year (2026)'); setPeriodLabel('This Year'); }}>
                  {isBangla ? 'এই বছর (২০২৬)' : 'This Year (2026)'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Export Report Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-card border border-white/10 hover:border-white/20 text-foreground transition-all shadow-sm">
                <Download className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{isBangla ? 'রিপোর্ট রপ্তানি' : 'Export Report'}</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card border border-white/10 backdrop-blur-xl">
                <DropdownMenuItem onClick={() => handleExport('PDF')} className="gap-2">
                  <FileText className="h-4 w-4 text-rose-400" />
                  <span>{isBangla ? 'পিডিএফ (PDF)' : 'PDF Document'}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('Excel')} className="gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                  <span>{isBangla ? 'এক্সেল (Excel/CSV)' : 'Excel Sheet (.xlsx)'}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.print()} className="gap-2">
                  <Printer className="h-4 w-4 text-blue-400" />
                  <span>{isBangla ? 'প্রিন্ট করুন' : 'Print Overview'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* =========================================================================
            2. TOP KPI METRIC CARDS ROW (5 Cards)
           ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* Card 1: Cash in Hand */}
          <TopKpiCard
            title={isBangla ? 'হাতে নগদ' : 'Cash in Hand'}
            infoTooltip={isBangla ? 'ক্যাশ বাক্সে এবং ড্রয়ারে বর্তমান নগদ অর্থ' : 'Physical cash available in cash register and vault'}
            amount="৳125,430.00"
            trend="+8.12% vs last month"
            isPositive={true}
            trendColor="text-emerald-400"
            icon={Wallet}
            iconBg="bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            sparklinePath="M0,22 Q12,18 24,20 T48,12 T72,16 T96,4"
            sparklineColor="#10b981"
          />

          {/* Card 2: Bank Balance */}
          <TopKpiCard
            title={isBangla ? 'ব্যাংক ব্যালেন্স' : 'Bank Balance'}
            amount="৳385,750.00"
            trend="+12.45% vs last month"
            isPositive={true}
            trendColor="text-blue-400"
            icon={Building2}
            iconBg="bg-blue-500/10 border-blue-500/20 text-blue-400"
            sparklinePath="M0,24 Q16,20 32,22 T64,10 T96,5"
            sparklineColor="#3b82f6"
          />

          {/* Card 3: Total Receivables */}
          <TopKpiCard
            title={isBangla ? 'মোট প্রাপ্য বকেয়া' : 'Total Receivables'}
            infoTooltip={isBangla ? 'গ্রাহকদের কাছ থেকে মোট আদায়যোগ্য বকেয়া' : 'Outstanding dues to collect from customers'}
            amount="৳256,800.00"
            trend="-5.32% vs last month"
            isPositive={false}
            trendColor="text-amber-400"
            icon={Receipt}
            iconBg="bg-amber-500/10 border-amber-500/20 text-amber-400"
            sparklinePath="M0,8 Q20,10 40,16 T70,22 T96,20"
            sparklineColor="#f59e0b"
          />

          {/* Card 4: Total Payables */}
          <TopKpiCard
            title={isBangla ? 'মোট প্রদেয় দেনা' : 'Total Payables'}
            infoTooltip={isBangla ? 'সরবরাহকারীদের পরিশোধযোগ্য মোট দেনা' : 'Outstanding bills due to suppliers & vendors'}
            amount="৳148,950.00"
            trend="+3.25% vs last month"
            isPositive={true}
            trendColor="text-purple-400"
            icon={FileClock}
            iconBg="bg-purple-500/10 border-purple-500/20 text-purple-400"
            sparklinePath="M0,20 Q18,22 36,15 T72,12 T96,6"
            sparklineColor="#a855f7"
          />

          {/* Card 5: Net Cash Flow */}
          <TopKpiCard
            title={isBangla ? 'নিট ক্যাশ ফ্লো' : 'Net Cash Flow'}
            amount="৳98,620.00"
            trend="+18.75% vs last month"
            isPositive={true}
            trendColor="text-emerald-400"
            icon={ArrowLeftRight}
            iconBg="bg-teal-500/10 border-teal-500/20 text-teal-400"
            sparklinePath="M0,24 Q15,22 30,16 T65,8 T96,3"
            sparklineColor="#0FBF9F"
          />
        </div>

        {/* =========================================================================
            3. MIDDLE SECTION - ROW 1 (Charts & Account Breakdown)
           ========================================================================= */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          {/* 3.1 Income vs Expense Clustered Bar Chart (xl:col-span-5) */}
          <div className="xl:col-span-5 rounded-2xl border border-white/[0.06] bg-card p-5 flex flex-col justify-between shadow-sm relative overflow-hidden">
            {/* Header with Title, Legends & Period Dropdown */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  {isBangla ? 'আয় বনাম ব্যয়' : 'Income vs Expense'}
                </h3>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" />
                    <span className="text-foreground/80 font-medium">{isBangla ? 'আয়' : 'Income'}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500 inline-block" />
                    <span className="text-foreground/80 font-medium">{isBangla ? 'ব্যয়' : 'Expense'}</span>
                  </span>
                </div>
              </div>

              {/* Period Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-muted/40 border border-white/5 text-muted-foreground hover:text-foreground transition-colors">
                  <span>{isBangla ? 'এই মাস' : periodLabel}</span>
                  <ChevronDown className="h-3 w-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36 bg-card border border-white/10">
                  <DropdownMenuItem onClick={() => setPeriodLabel('This Week')}>
                    {isBangla ? 'এই সপ্তাহ' : 'This Week'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPeriodLabel('This Month')}>
                    {isBangla ? 'এই মাস' : 'This Month'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPeriodLabel('This Year')}>
                    {isBangla ? 'এই বছর' : 'This Year'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Recharts Bar Chart */}
            <div className="h-[210px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={INCOME_EXPENSE_DATA}
                  margin={{ top: 10, right: 8, left: -18, bottom: 0 }}
                  barGap={3}
                >
                  <XAxis
                    dataKey={isBangla ? 'dateBn' : 'date'}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#8899A8', fontSize: 10.5 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `৳${val / 1000}K`}
                    tick={{ fill: '#8899A8', fontSize: 10.5 }}
                    domain={[0, 100000]}
                    ticks={[0, 20000, 40000, 60000, 80000, 100000]}
                  />
                  <RechartsTooltip content={<CustomBarTooltip isBangla={isBangla} />} />
                  <Bar
                    dataKey="income"
                    fill="#10b981"
                    radius={[3, 3, 0, 0]}
                    maxBarSize={11}
                  />
                  <Bar
                    dataKey="expense"
                    fill="#f43f5e"
                    radius={[3, 3, 0, 0]}
                    maxBarSize={11}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Bottom Summary Bar */}
            <div className="grid grid-cols-3 gap-2 pt-4 mt-2 border-t border-white/[0.06] text-center">
              <div>
                <div className="text-[11px] text-muted-foreground">{isBangla ? 'মোট আয়' : 'Total Income'}</div>
                <div className="text-xs sm:text-sm font-bold text-emerald-400 mt-0.5">৳185,750.00</div>
                <div className="text-[10px] text-emerald-400 font-medium">+8.41%</div>
              </div>
              <div className="border-x border-white/[0.06]">
                <div className="text-[11px] text-muted-foreground">{isBangla ? 'মোট ব্যয়' : 'Total Expense'}</div>
                <div className="text-xs sm:text-sm font-bold text-rose-400 mt-0.5">৳87,130.00</div>
                <div className="text-[10px] text-rose-400 font-medium">-6.12%</div>
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground">{isBangla ? 'নিট লাভ' : 'Net Profit'}</div>
                <div className="text-xs sm:text-sm font-bold text-blue-400 mt-0.5">৳98,620.00</div>
                <div className="text-[10px] text-emerald-400 font-medium">+18.75%</div>
              </div>
            </div>
          </div>

          {/* 3.2 Cash Flow Summary (Donut Chart & Legend) (xl:col-span-4) */}
          <div className="xl:col-span-4 rounded-2xl border border-white/[0.06] bg-card p-5 flex flex-col justify-between shadow-sm">
            {/* Header with Period Dropdown */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-foreground">
                {isBangla ? 'ক্যাশ ফ্লো সারাংশ' : 'Cash Flow Summary'}
              </h3>
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-muted/40 border border-white/5 text-muted-foreground hover:text-foreground transition-colors">
                  <span>{isBangla ? 'এই মাস' : periodLabel}</span>
                  <ChevronDown className="h-3 w-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36 bg-card border border-white/10">
                  <DropdownMenuItem onClick={() => setPeriodLabel('This Week')}>
                    {isBangla ? 'এই সপ্তাহ' : 'This Week'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPeriodLabel('This Month')}>
                    {isBangla ? 'এই মাস' : 'This Month'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPeriodLabel('This Year')}>
                    {isBangla ? 'এই বছর' : 'This Year'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Donut Chart & Side Breakdown */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 my-auto">
              {/* Donut Chart with Center Text */}
              <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={CASH_FLOW_DATA}
                      innerRadius={54}
                      outerRadius={74}
                      paddingAngle={2}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {CASH_FLOW_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.colorHex} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-base font-extrabold text-foreground tracking-tight">
                    ৳98,620
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {isBangla ? 'নিট ক্যাশ ফ্লো' : 'Net Cash Flow'}
                  </span>
                </div>
              </div>

              {/* Side Breakdown Legend */}
              <div className="space-y-2.5 w-full sm:w-auto flex-1 text-xs">
                {CASH_FLOW_DATA.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: item.colorHex }}
                      />
                      <span className="text-muted-foreground truncate text-[11px]">
                        {isBangla ? item.nameBn : item.name}
                      </span>
                    </div>
                    <div className="text-right shrink-0 font-medium">
                      <span className="text-foreground text-[11px]">৳{formatCurrency(item.value)}</span>
                      <span className="text-[10px] text-muted-foreground ml-1.5">{item.percentage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Navigation Link */}
            <div className="pt-3 border-t border-white/[0.06]">
              <Link
                href="/finance/reports"
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium transition-colors"
              >
                <span>{isBangla ? 'ক্যাশ ফ্লো রিপোর্ট দেখুন' : 'View cash flow report'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* 3.3 Side Stacked Widgets (Quick Summary & Account Balances) (xl:col-span-3) */}
          <div className="xl:col-span-3 flex flex-col gap-4">
            {/* Quick Summary Widget */}
            <div className="rounded-2xl border border-white/[0.06] bg-card p-4 shadow-sm space-y-2.5">
              <h3 className="text-sm font-bold text-foreground">
                {isBangla ? 'দ্রুত সারসংক্ষেপ' : 'Quick Summary'}
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{isBangla ? 'মোট আয়' : 'Total Income'}</span>
                  <span className="font-semibold text-emerald-400">৳185,750.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{isBangla ? 'মোট ব্যয়' : 'Total Expense'}</span>
                  <span className="font-semibold text-rose-400">৳87,130.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{isBangla ? 'মোট লাভ' : 'Gross Profit'}</span>
                  <span className="font-semibold text-blue-400">৳98,620.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{isBangla ? 'ব্যয় অনুপাত' : 'Expense Ratio'}</span>
                  <span className="font-semibold text-foreground">46.93%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{isBangla ? 'নিট লাভ মার্জিন' : 'Net Profit Margin'}</span>
                  <span className="font-semibold text-foreground">53.07%</span>
                </div>
              </div>
            </div>

            {/* Account Balances Widget */}
            <div className="rounded-2xl border border-white/[0.06] bg-card p-4 shadow-sm space-y-2.5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-foreground">
                    {isBangla ? 'অ্যাকাউন্ট ব্যালেন্স' : 'Account Balances'}
                  </h3>
                  <Link
                    href="/finance/bank-wallets"
                    className="text-[11px] text-muted-foreground hover:text-foreground transition-colors font-medium"
                  >
                    {isBangla ? 'সব দেখুন' : 'View All'}
                  </Link>
                </div>

                <div className="space-y-2.5 text-xs">
                  {/* Cash in Hand */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-md bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                        <Wallet className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-foreground/90 font-medium text-[11px]">
                        {isBangla ? 'হাতে নগদ' : 'Cash in Hand'}
                      </span>
                    </div>
                    <span className="font-semibold text-emerald-400 text-[11px]">৳125,430.00</span>
                  </div>

                  {/* Bank Accounts */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-md bg-teal-500/10 flex items-center justify-center text-teal-400 shrink-0">
                        <Building2 className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-foreground/90 font-medium text-[11px]">
                        {isBangla ? 'ব্যাংক হিসাব' : 'Bank Accounts'}
                      </span>
                    </div>
                    <span className="font-semibold text-teal-400 text-[11px]">৳385,750.00</span>
                  </div>

                  {/* Mobile Banking */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-md bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                        <Smartphone className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-foreground/90 font-medium text-[11px]">
                        {isBangla ? 'মোবাইল ব্যাংকিং' : 'Mobile Banking'}
                      </span>
                    </div>
                    <span className="font-semibold text-purple-400 text-[11px]">৳12,430.00</span>
                  </div>

                  {/* Cards */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                        <CreditCard className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-foreground/90 font-medium text-[11px]">
                        {isBangla ? 'কার্ড ব্যালেন্স' : 'Cards'}
                      </span>
                    </div>
                    <span className="font-semibold text-muted-foreground text-[11px]">৳0.00</span>
                  </div>

                  {/* Wallets */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-md bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                        <Wallet className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-foreground/90 font-medium text-[11px]">
                        {isBangla ? 'ডিজিটাল ওয়ালেট' : 'Wallets'}
                      </span>
                    </div>
                    <span className="font-semibold text-emerald-400 text-[11px]">৳2,850.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            4. MIDDLE SECTION - ROW 2 (Categories Breakdown & Recent Transactions)
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* 4.1 Top Income Categories Card */}
          <div className="rounded-2xl border border-white/[0.06] bg-card p-5 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-foreground">
                  {isBangla ? 'শীর্ষ আয়ের ক্যাটাগরি' : 'Top Income Categories'}
                </h3>
                <DropdownMenu>
                  <DropdownMenuTrigger className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-muted/40 border border-white/5 text-muted-foreground hover:text-foreground transition-colors">
                    <span>{isBangla ? 'এই মাস' : periodLabel}</span>
                    <ChevronDown className="h-3 w-3" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36 bg-card border border-white/10">
                    <DropdownMenuItem onClick={() => setPeriodLabel('This Month')}>
                      {isBangla ? 'এই মাস' : 'This Month'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPeriodLabel('This Year')}>
                      {isBangla ? 'এই বছর' : 'This Year'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-3.5">
                {TOP_INCOME_CATEGORIES.map((cat, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className={`h-6 w-6 rounded-md flex items-center justify-center shrink-0 ${cat.bg}`}>
                          <DollarSign className="h-3 w-3" />
                        </div>
                        <span className="font-medium text-foreground/90 text-[11.5px]">
                          {isBangla ? cat.nameBn : cat.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground text-[11.5px]">
                          ৳{formatCurrency(cat.amount)}
                        </span>
                        <span className="text-[10px] text-muted-foreground w-7 text-right">
                          {cat.percentage}%
                        </span>
                      </div>
                    </div>
                    {/* Progress Track */}
                    <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${cat.percentage}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-white/[0.06]">
              <Link
                href="/finance/income"
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium transition-colors"
              >
                <span>{isBangla ? 'সব আয়ের ক্যাটাগরি দেখুন' : 'View all income categories'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* 4.2 Top Expense Categories Card */}
          <div className="rounded-2xl border border-white/[0.06] bg-card p-5 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-foreground">
                  {isBangla ? 'শীর্ষ ব্যয়ের ক্যাটাগরি' : 'Top Expense Categories'}
                </h3>
                <DropdownMenu>
                  <DropdownMenuTrigger className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-muted/40 border border-white/5 text-muted-foreground hover:text-foreground transition-colors">
                    <span>{isBangla ? 'এই মাস' : periodLabel}</span>
                    <ChevronDown className="h-3 w-3" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36 bg-card border border-white/10">
                    <DropdownMenuItem onClick={() => setPeriodLabel('This Month')}>
                      {isBangla ? 'এই মাস' : 'This Month'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPeriodLabel('This Year')}>
                      {isBangla ? 'এই বছর' : 'This Year'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-3.5">
                {TOP_EXPENSE_CATEGORIES.map((cat, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className={`h-6 w-6 rounded-md flex items-center justify-center shrink-0 ${cat.bg}`}>
                          <Receipt className="h-3 w-3" />
                        </div>
                        <span className="font-medium text-foreground/90 text-[11.5px]">
                          {isBangla ? cat.nameBn : cat.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground text-[11.5px]">
                          ৳{formatCurrency(cat.amount)}
                        </span>
                        <span className="text-[10px] text-muted-foreground w-7 text-right">
                          {cat.percentage}%
                        </span>
                      </div>
                    </div>
                    {/* Progress Track */}
                    <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${cat.percentage * 2}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-white/[0.06]">
              <Link
                href="/finance/expenses"
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium transition-colors"
              >
                <span>{isBangla ? 'সব ব্যয়ের ক্যাটাগরি দেখুন' : 'View all expense categories'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* 4.3 Recent Transactions Card */}
          <div className="rounded-2xl border border-white/[0.06] bg-card p-5 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-foreground">
                  {isBangla ? 'সাম্প্রতিক লেনদেন' : 'Recent Transactions'}
                </h3>
                <Link
                  href="/finance/transactions"
                  className="text-[11px] text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  {isBangla ? 'সব দেখুন' : 'View All'}
                </Link>
              </div>

              <div className="space-y-3">
                {RECENT_TRANSACTIONS.map((tx) => {
                  const isIncome = tx.type === 'income';
                  return (
                    <div key={tx.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${
                            isIncome
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-rose-500/10 text-rose-400'
                          }`}
                        >
                          {isIncome ? (
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          ) : (
                            <ArrowDownRight className="h-3.5 w-3.5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-foreground text-[11.5px] truncate">
                            {isBangla ? tx.titleBn : tx.title}
                          </div>
                          <div className="text-[10px] text-muted-foreground truncate">
                            {isBangla ? tx.subtitleBn : tx.subtitle} • {isBangla ? tx.dateBn : tx.date}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`font-semibold text-[11.5px] shrink-0 ${
                          isIncome ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {isIncome ? `+৳${formatCurrency(tx.amount)}` : `-৳${formatCurrency(Math.abs(tx.amount))}`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-white/[0.06]">
              <Link
                href="/finance/transactions"
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium transition-colors"
              >
                <span>{isBangla ? 'সব লেনদেন দেখুন' : 'View all transactions'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* =========================================================================
            5. BOTTOM ALERT / ACTION CARDS STRIP (5 Cards)
           ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* Card 1: Overdue Receivables */}
          <Link
            href="/finance/receivables"
            className="group rounded-2xl border border-white/[0.06] bg-card p-4 hover:border-amber-500/30 transition-all shadow-sm flex items-center gap-3.5"
          >
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-medium">
                {isBangla ? 'মেয়াদোত্তীর্ণ প্রাপ্য' : 'Overdue Receivables'}
              </div>
              <div className="text-sm font-bold text-amber-400 mt-0.5">৳48,600.00</div>
              <div className="text-[10px] text-muted-foreground">
                {isBangla ? '৮টি চালান' : '8 Invoices'}
              </div>
            </div>
          </Link>

          {/* Card 2: Overdue Payables */}
          <Link
            href="/finance/payables"
            className="group rounded-2xl border border-white/[0.06] bg-card p-4 hover:border-rose-500/30 transition-all shadow-sm flex items-center gap-3.5"
          >
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0 group-hover:scale-105 transition-transform">
              <FileClock className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-medium">
                {isBangla ? 'মেয়াদোত্তীর্ণ প্রদেয়' : 'Overdue Payables'}
              </div>
              <div className="text-sm font-bold text-rose-400 mt-0.5">৳32,400.00</div>
              <div className="text-[10px] text-muted-foreground">
                {isBangla ? '৫টি বিল' : '5 Bills'}
              </div>
            </div>
          </Link>

          {/* Card 3: Due Today (Receivable) */}
          <Link
            href="/finance/receivables"
            className="group rounded-2xl border border-white/[0.06] bg-card p-4 hover:border-cyan-500/30 transition-all shadow-sm flex items-center gap-3.5"
          >
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-medium">
                {isBangla ? 'আজকের প্রাপ্য' : 'Due Today (Receivable)'}
              </div>
              <div className="text-sm font-bold text-cyan-400 mt-0.5">৳18,200.00</div>
              <div className="text-[10px] text-muted-foreground">
                {isBangla ? '৩টি চালান' : '3 Invoices'}
              </div>
            </div>
          </Link>

          {/* Card 4: Due Today (Payable) */}
          <Link
            href="/finance/payables"
            className="group rounded-2xl border border-white/[0.06] bg-card p-4 hover:border-purple-500/30 transition-all shadow-sm flex items-center gap-3.5"
          >
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-105 transition-transform">
              <ArrowLeftRight className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-medium">
                {isBangla ? 'আজকের প্রদেয়' : 'Due Today (Payable)'}
              </div>
              <div className="text-sm font-bold text-purple-400 mt-0.5">৳7,800.00</div>
              <div className="text-[10px] text-muted-foreground">
                {isBangla ? '২টি বিল' : '2 Bills'}
              </div>
            </div>
          </Link>

          {/* Card 5: Unreconciled Transactions */}
          <Link
            href="/finance/bank-wallets"
            className="group rounded-2xl border border-white/[0.06] bg-card p-4 hover:border-amber-500/30 transition-all shadow-sm flex items-center gap-3.5"
          >
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-medium">
                {isBangla ? 'অমিমাংসিত লেনদেন' : 'Unreconciled Transactions'}
              </div>
              <div className="text-sm font-bold text-amber-400 mt-0.5">12</div>
              <div className="text-[10px] text-muted-foreground">
                {isBangla ? 'ব্যাংক / ক্যাশ' : 'Bank / Cash'}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </TooltipProvider>
  );
}

// --- HELPER SUB-COMPONENTS ---

interface TopKpiCardProps {
  title: string;
  amount: string;
  trend: string;
  isPositive: boolean;
  trendColor: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  infoTooltip?: string;
  sparklinePath: string;
  sparklineColor: string;
}

function TopKpiCard({
  title,
  amount,
  trend,
  isPositive,
  trendColor,
  icon: Icon,
  iconBg,
  infoTooltip,
  sparklinePath,
  sparklineColor,
}: TopKpiCardProps) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-card p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-white/10 transition-all">
      {/* Header of KPI card: Icon & Title */}
      <div className="flex items-center gap-2.5">
        <div className={`h-8 w-8 rounded-lg border flex items-center justify-center shrink-0 ${iconBg}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-1 min-w-0">
          <span className="text-xs text-muted-foreground font-medium truncate">
            {title}
          </span>
          {infoTooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="text-muted-foreground/60 hover:text-foreground transition-colors">
                  <Info className="h-3 w-3" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-popover text-popover-foreground border border-white/10 text-xs max-w-xs">
                {infoTooltip}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Main Amount */}
      <div className="mt-3.5">
        <div className="text-lg md:text-xl font-bold tracking-tight text-foreground font-sans">
          {amount}
        </div>
      </div>

      {/* Footer: Trend and SVG Sparkline */}
      <div className="flex items-center justify-between mt-2 pt-1">
        <div className={`text-[11px] font-semibold flex items-center gap-1 ${trendColor}`}>
          <span>{trend}</span>
        </div>
        {/* Curved Sparkline */}
        <div className="w-16 h-6 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
          <svg viewBox="0 0 96 28" className="w-full h-full overflow-visible" fill="none">
            <path
              d={sparklinePath}
              stroke={sparklineColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

// Custom Tooltip for Clustered Bar Chart
function CustomBarTooltip({ active, payload, label, isBangla }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-card/95 backdrop-blur-md p-2.5 shadow-xl text-xs space-y-1">
        <div className="font-semibold text-foreground border-b border-white/10 pb-1 mb-1">
          {label}
        </div>
        <div className="flex items-center justify-between gap-4 text-emerald-400">
          <span>{isBangla ? 'আয়' : 'Income'}:</span>
          <span className="font-bold">৳{payload[0]?.value?.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-rose-400">
          <span>{isBangla ? 'ব্যয়' : 'Expense'}:</span>
          <span className="font-bold">৳{payload[1]?.value?.toLocaleString()}</span>
        </div>
      </div>
    );
  }
  return null;
}
