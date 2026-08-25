// Hello Khata OS - Profit & Loss Statement (Income Statement)
// হ্যালো খাতা - লাভ-ক্ষতি বিবরণী (ইনকাম স্টেটমেন্ট)

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FinancePageHeader } from '@/components/finance/FinancePageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import {
  TrendingUp,
  Filter,
  Download,
  Printer,
  FileSpreadsheet,
  Calendar,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Layers,
  DollarSign,
  PieChart,
  Percent,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ProfitLossPage() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency, formatPercent, formatNumber } = useCurrency();
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');
  const [showComparison, setShowComparison] = useState(true);

  // Financial Data Structure
  const reportData = {
    revenue: [
      { id: 'rev-1', code: '4010', name: 'Product Sales (Wholesale & Retail)', nameBn: 'পণ্য বিক্রয় (পাইকারি ও খুচরা)', current: 1845600, previous: 1620000, margin: 65.0 },
      { id: 'rev-2', code: '4020', name: 'Service & Maintenance Income', nameBn: 'সেবা ও সার্ভিসিং আয়', current: 654000, previous: 580000, margin: 23.0 },
      { id: 'rev-3', code: '4090', name: 'Delivery & Shipping Charges Received', nameBn: 'ডেলিভারি ও শিপিং চার্জ প্রাপ্তি', current: 346000, previous: 290000, margin: 12.0 },
    ],
    cogs: [
      { id: 'cogs-1', code: '5010', name: 'Cost of Inventory Stock Sold', nameBn: 'বিক্রিত পণ্যের ক্রয়মূল্য (স্টক)', current: 923400, previous: 810000, margin: 88.5 },
      { id: 'cogs-2', code: '5020', name: 'Direct Packaging & Warehouse Overhead', nameBn: 'প্যাকেজিং ও ওয়্যারহাউজ ওভারহেড', current: 120000, previous: 105000, margin: 11.5 },
    ],
    operatingExpenses: [
      { id: 'exp-1', code: '6010', name: 'Employee Salaries & Payroll', nameBn: 'কর্মচারীদের বেতন ও সুযোগ-সুবিধা', current: 500000, previous: 480000, margin: 56.8 },
      { id: 'exp-2', code: '6020', name: 'Commercial Space Rent & Utility Bills', nameBn: 'অফিস ও শোরুম ভাড়া এবং ইউটিলিটি', current: 240000, previous: 240000, margin: 27.3 },
      { id: 'exp-3', code: '6030', name: 'Digital Marketing & Social Campaigns', nameBn: 'মার্কেটিং ও বিজ্ঞাপন প্রচারণা', current: 110000, previous: 95000, margin: 12.5 },
      { id: 'exp-4', code: '6090', name: 'Software Subscriptions & Admin Fees', nameBn: 'প্রশাসনিক ও সফটওয়্যার সাবস্ক্রিপশন', current: 30000, previous: 28000, margin: 3.4 },
    ],
    taxes: [
      { id: 'tax-1', code: '7010', name: 'Advance Corporate Income Tax (AIT)', nameBn: 'অগ্রিম আয়কর (এআইটি)', current: 48500, previous: 42000, margin: 100.0 },
    ]
  };

  const totalRevenueCurrent = reportData.revenue.reduce((acc, r) => acc + r.current, 0);
  const totalRevenuePrev = reportData.revenue.reduce((acc, r) => acc + r.previous, 0);

  const totalCogsCurrent = reportData.cogs.reduce((acc, c) => acc + c.current, 0);
  const totalCogsPrev = reportData.cogs.reduce((acc, c) => acc + c.previous, 0);

  const grossProfitCurrent = totalRevenueCurrent - totalCogsCurrent;
  const grossProfitPrev = totalRevenuePrev - totalCogsPrev;
  const grossMarginPct = ((grossProfitCurrent / totalRevenueCurrent) * 100).toFixed(1);

  const totalOpexCurrent = reportData.operatingExpenses.reduce((acc, e) => acc + e.current, 0);
  const totalOpexPrev = reportData.operatingExpenses.reduce((acc, e) => acc + e.previous, 0);

  const operatingProfitCurrent = grossProfitCurrent - totalOpexCurrent;
  const operatingProfitPrev = grossProfitPrev - totalOpexPrev;

  const totalTaxesCurrent = reportData.taxes.reduce((acc, t) => acc + t.current, 0);
  const totalTaxesPrev = reportData.taxes.reduce((acc, t) => acc + t.previous, 0);

  const netProfitCurrent = operatingProfitCurrent - totalTaxesCurrent;
  const netProfitPrev = operatingProfitPrev - totalTaxesPrev;
  const netMarginPct = ((netProfitCurrent / totalRevenueCurrent) * 100).toFixed(1);
  const revenueGrowthPct = (((totalRevenueCurrent - totalRevenuePrev) / totalRevenuePrev) * 100).toFixed(1);

  const handleExport = (type: string) => {
    toast.success(
      isBangla
        ? `লাভ-ক্ষতি বিবরণী ${type.toUpperCase()} এক্সপোর্ট সম্পন্ন হয়েছে!`
        : `Profit & Loss Statement ${type.toUpperCase()} exported successfully!`
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header with Navigation */}
      <FinancePageHeader
        pageName="Profit & Loss Statement"
        pageNameBn="লাভ-ক্ষতি বিবরণী (P&L Statement)"
        icon={TrendingUp}
      />

      {/* Top Financial Health Executive KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-card via-card to-emerald-500/5 border border-emerald-500/20 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>{isBangla ? 'মোট পরিচালন আয়' : 'Total Revenue'}</span>
            <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <ArrowUpRight className="h-3 w-3 mr-0.5" />
              +{revenueGrowthPct}%
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-foreground">
            {formatCurrency(totalRevenueCurrent)}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {isBangla ? `পূর্ববর্তী মাস: ${formatCurrency(totalRevenuePrev)}` : `Prev Period: ${formatCurrency(totalRevenuePrev)}`}
          </div>
        </div>

        {/* Gross Profit */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-card via-card to-blue-500/5 border border-blue-500/20 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>{isBangla ? 'মোট পরিচালন লাভ' : 'Gross Profit'}</span>
            <Badge variant="outline" className="text-[10px] font-mono border-blue-500/30 text-blue-600">
              {grossMarginPct}% Margin
            </Badge>
          </div>
          <div className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400">
            {formatCurrency(grossProfitCurrent)}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {isBangla ? `বিক্রীত পণ্যের ব্যয় বাদ দেওয়ার পর` : `After COGS deduction`}
          </div>
        </div>

        {/* Operating Expenses */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-card via-card to-amber-500/5 border border-amber-500/20 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>{isBangla ? 'পরিচালন ব্যয় (OPEX)' : 'Operating Expenses'}</span>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              {((totalOpexCurrent / totalRevenueCurrent) * 100).toFixed(1)}% of Rev
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
            {formatCurrency(totalOpexCurrent)}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {isBangla ? 'বেতন, ভাড়া, বিদ্যুৎ ও মার্কেটিং' : 'Salaries, rent, admin & utility'}
          </div>
        </div>

        {/* Net Profit (Bottomline) */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-card via-card to-emerald-500/10 border border-emerald-500/30 shadow-md space-y-1.5 ring-1 ring-emerald-500/20">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">{isBangla ? 'নিট মুনাফা' : 'Net Operational Profit'}</span>
            <span className="inline-flex items-center text-[10px] font-extrabold text-emerald-600 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
              {netMarginPct}% Net
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {formatCurrency(netProfitCurrent)}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {isBangla ? `কর সমন্বয় পরবর্তী চূড়ান্ত সঞ্চয়` : `Post-tax realized earnings`}
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-4 rounded-2xl border border-border/70 shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          {/* Period Selector */}
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="h-9 text-xs w-48 bg-background">
              <Calendar className="h-3.5 w-3.5 mr-1.5 text-primary" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this_month">This Month (May 2026)</SelectItem>
              <SelectItem value="last_month">Last Month (April 2026)</SelectItem>
              <SelectItem value="this_quarter">Q2 2026 (Apr - Jun)</SelectItem>
              <SelectItem value="fy_2025_26">FY 2025–26 (Full Year)</SelectItem>
            </SelectContent>
          </Select>

          {/* Branch Filter */}
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="h-9 text-xs w-44 bg-background">
              <Building2 className="h-3.5 w-3.5 mr-1.5 text-teal-500" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isBangla ? 'সকল শাখা (All)' : 'All Branches (4)'}</SelectItem>
              <SelectItem value="dhaka">Dhaka Main Branch</SelectItem>
              <SelectItem value="ctg">Chattogram Branch</SelectItem>
              <SelectItem value="sylhet">Sylhet Branch</SelectItem>
            </SelectContent>
          </Select>

          {/* Compare Toggle */}
          <Button
            variant={showComparison ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setShowComparison(!showComparison)}
            className="h-9 text-xs font-bold gap-1.5 rounded-xl cursor-pointer"
          >
            <Percent className="h-3.5 w-3.5 text-primary" />
            <span>{isBangla ? 'তুলনামূলক ভিউ' : 'Variance Compare'}</span>
          </Button>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('excel')}
            className="h-9 text-xs gap-1.5"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
            <span>Excel P&L</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => handleExport('pdf')}
            className="h-9 text-xs gap-1.5 font-semibold"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>{isBangla ? 'অডিট প্রিন্ট' : 'Print Statement'}</span>
          </Button>
        </div>
      </div>

      {/* Main Income Statement Table */}
      <Card className="rounded-2xl border-border/70 shadow-xs overflow-hidden">
        <CardHeader className="p-5 border-b border-border/50 bg-muted/20">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                {isBangla ? 'আয় বিবরণী কাঠামো (IAS-1 স্ট্যান্ডার্ড)' : 'Income Statement Structure (IAS-1 Compliant)'}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                {isBangla
                  ? 'বহু-ধাপ লাভ-ক্ষতি বিবরণী ও খাতভিত্তিক শতাংশ'
                  : 'Multi-step operational revenue, margin contribution, and variance'}
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-xs font-mono">
              IAS 1 • Full Disclosure
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground font-bold uppercase text-[10px] tracking-wider bg-muted/40">
                  <th className="py-3 px-4 w-28">{isBangla ? 'লেজার কোড' : 'Code'}</th>
                  <th className="py-3 px-4">{isBangla ? 'আর্থিক বিবরণী বিবরণ' : 'Account Description'}</th>
                  <th className="py-3 px-4 text-right">{isBangla ? 'চলতি সময় (৳)' : 'Current Period'}</th>
                  {showComparison && (
                    <>
                      <th className="py-3 px-4 text-right text-muted-foreground">{isBangla ? 'পূর্ববর্তী সময় (৳)' : 'Prev Period'}</th>
                      <th className="py-3 px-4 text-right">{isBangla ? 'পার্থক্য / প্রবৃদ্ধি' : 'Variance %'}</th>
                    </>
                  )}
                  <th className="py-3 px-4 text-right">{isBangla ? 'অংশ (%)' : '% of Rev'}</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/20">
                {/* 1. OPERATING REVENUE SECTION */}
                <tr className="bg-emerald-500/5 font-bold text-emerald-700 dark:text-emerald-400">
                  <td colSpan={showComparison ? 6 : 4} className="py-2.5 px-4 uppercase text-[11px] tracking-wider">
                    {isBangla ? '১. পরিচালন আয় ও রাজস্ব (Operating Revenue)' : '1. Operating Revenue & Sales'}
                  </td>
                </tr>

                {reportData.revenue.map((item) => {
                  const variance = item.current - item.previous;
                  const variancePct = ((variance / item.previous) * 100).toFixed(1);
                  const revShare = ((item.current / totalRevenueCurrent) * 100).toFixed(1);

                  return (
                    <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-2.5 px-4 font-mono text-muted-foreground">{item.code}</td>
                      <td className="py-2.5 px-4 font-medium text-foreground">
                        {isBangla ? item.nameBn : item.name}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-foreground">
                        {formatCurrency(item.current)}
                      </td>
                      {showComparison && (
                        <>
                          <td className="py-2.5 px-4 text-right font-mono text-muted-foreground">
                            {formatCurrency(item.previous)}
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono font-semibold text-emerald-600">
                            +{variancePct}%
                          </td>
                        </>
                      )}
                      <td className="py-2.5 px-4 text-right font-mono text-muted-foreground">
                        {revShare}%
                      </td>
                    </tr>
                  );
                })}

                {/* Total Revenue Summary Row */}
                <tr className="bg-muted/30 font-bold border-b border-t border-border/60">
                  <td className="py-3 px-4 font-mono">TOTAL</td>
                  <td className="py-3 px-4">{isBangla ? 'সর্বমোট আয় (Total Revenue)' : 'Total Gross Revenue'}</td>
                  <td className="py-3 px-4 text-right font-mono text-sm text-foreground">
                    {formatCurrency(totalRevenueCurrent)}
                  </td>
                  {showComparison && (
                    <>
                      <td className="py-3 px-4 text-right font-mono text-muted-foreground">
                        {formatCurrency(totalRevenuePrev)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-600">
                        +{revenueGrowthPct}%
                      </td>
                    </>
                  )}
                  <td className="py-3 px-4 text-right font-mono">100.0%</td>
                </tr>

                {/* 2. COST OF GOODS SOLD SECTION */}
                <tr className="bg-blue-500/5 font-bold text-blue-700 dark:text-blue-400">
                  <td colSpan={showComparison ? 6 : 4} className="py-2.5 px-4 uppercase text-[11px] tracking-wider">
                    {isBangla ? '২. বিক্রীত পণ্যের ব্যয় (Cost of Goods Sold - COGS)' : '2. Cost of Goods Sold (COGS)'}
                  </td>
                </tr>

                {reportData.cogs.map((item) => {
                  const revShare = ((item.current / totalRevenueCurrent) * 100).toFixed(1);
                  const variancePct = (((item.current - item.previous) / item.previous) * 100).toFixed(1);

                  return (
                    <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-2.5 px-4 font-mono text-muted-foreground">{item.code}</td>
                      <td className="py-2.5 px-4 font-medium text-foreground">
                        {isBangla ? item.nameBn : item.name}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-foreground">
                        {formatCurrency(item.current)}
                      </td>
                      {showComparison && (
                        <>
                          <td className="py-2.5 px-4 text-right font-mono text-muted-foreground">
                            {formatCurrency(item.previous)}
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono text-muted-foreground">
                            +{variancePct}%
                          </td>
                        </>
                      )}
                      <td className="py-2.5 px-4 text-right font-mono text-muted-foreground">
                        {revShare}%
                      </td>
                    </tr>
                  );
                })}

                {/* GROSS PROFIT ROW */}
                <tr className="bg-blue-500/10 font-black border-y-2 border-blue-500/30 text-blue-700 dark:text-blue-300">
                  <td className="py-3 px-4 font-mono">GP</td>
                  <td className="py-3 px-4 uppercase tracking-wide">
                    {isBangla ? 'মোট মুনাফা (Gross Profit)' : 'Gross Profit (Operating Margin)'}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-sm">
                    {formatCurrency(grossProfitCurrent)}
                  </td>
                  {showComparison && (
                    <>
                      <td className="py-3 px-4 text-right font-mono text-muted-foreground">
                        {formatCurrency(grossProfitPrev)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-600">
                        +{(((grossProfitCurrent - grossProfitPrev) / grossProfitPrev) * 100).toFixed(1)}%
                      </td>
                    </>
                  )}
                  <td className="py-3 px-4 text-right font-mono">{grossMarginPct}%</td>
                </tr>

                {/* 3. OPERATING EXPENSES (OPEX) */}
                <tr className="bg-amber-500/5 font-bold text-amber-700 dark:text-amber-400">
                  <td colSpan={showComparison ? 6 : 4} className="py-2.5 px-4 uppercase text-[11px] tracking-wider">
                    {isBangla ? '৩. পরিচালন ও প্রশাসনিক ব্যয় (Operating Expenses - OPEX)' : '3. Operating & Admin Expenses (OPEX)'}
                  </td>
                </tr>

                {reportData.operatingExpenses.map((item) => {
                  const revShare = ((item.current / totalRevenueCurrent) * 100).toFixed(1);
                  const variancePct = (((item.current - item.previous) / item.previous) * 100).toFixed(1);

                  return (
                    <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-2.5 px-4 font-mono text-muted-foreground">{item.code}</td>
                      <td className="py-2.5 px-4 font-medium text-foreground">
                        {isBangla ? item.nameBn : item.name}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-foreground">
                        {formatCurrency(item.current)}
                      </td>
                      {showComparison && (
                        <>
                          <td className="py-2.5 px-4 text-right font-mono text-muted-foreground">
                            {formatCurrency(item.previous)}
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono text-muted-foreground">
                            +{variancePct}%
                          </td>
                        </>
                      )}
                      <td className="py-2.5 px-4 text-right font-mono text-muted-foreground">
                        {revShare}%
                      </td>
                    </tr>
                  );
                })}

                {/* 4. NET OPERATIONAL PROFIT (EBITDA & BOTTOM LINE) */}
                <tr className="bg-emerald-500/15 font-black border-y-2 border-emerald-500/40 text-emerald-800 dark:text-emerald-300">
                  <td className="py-4 px-4 font-mono text-sm">NP</td>
                  <td className="py-4 px-4 text-sm uppercase tracking-wider">
                    {isBangla ? 'নিট পরিচালন মুনাফা (Net Operating Profit)' : 'Net Realized Profit (Bottomline)'}
                  </td>
                  <td className="py-4 px-4 text-right font-mono text-base font-black text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(netProfitCurrent)}
                  </td>
                  {showComparison && (
                    <>
                      <td className="py-4 px-4 text-right font-mono text-muted-foreground">
                        {formatCurrency(netProfitPrev)}
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-emerald-600 font-bold">
                        +{(((netProfitCurrent - netProfitPrev) / netProfitPrev) * 100).toFixed(1)}%
                      </td>
                    </>
                  )}
                  <td className="py-4 px-4 text-right font-mono font-bold">{netMarginPct}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
