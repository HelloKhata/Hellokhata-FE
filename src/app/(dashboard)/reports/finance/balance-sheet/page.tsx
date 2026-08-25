// Hello Khata OS - Balance Sheet (Statement of Financial Position)
// হ্যালো খাতা - উদ্বৃত্তপত্র / ব্যালেন্স শিট (আইএএস-১ সংবিধিবদ্ধ ব্যালেন্স শিট)

'use client';

import React, { useState } from 'react';
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
  Scale,
  Filter,
  Printer,
  FileSpreadsheet,
  ShieldCheck,
  Landmark,
  PiggyBank,
  Briefcase,
  Calendar,
  Building2,
  CheckCircle2,
  TrendingUp,
  Percent,
  Layers,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

export default function BalanceSheetPage() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency, formatNumber } = useCurrency();
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [asOfDate, setAsOfDate] = useState('today');

  const assets = {
    current: [
      { id: '1', code: '1010', name: 'Cash on Hand (Vault & Petty)', nameBn: 'হাতে নগদ (ভল্ট ও খুচরা ক্যাশ)', amount: 456800, share: 10.2 },
      { id: '2', code: '1020', name: 'Cash at Bank (BRAC, City, DBBL)', nameBn: 'ব্যাংক হিসাব ব্যালেন্স', amount: 1287500, share: 28.7 },
      { id: '3', code: '1030', name: 'MFS Digital Wallets (bKash/Nagad)', nameBn: 'ডিজিটাল ওয়ালেট ব্যালেন্স (বিকাশ/নগদ)', amount: 85000, share: 1.9 },
      { id: '4', code: '1100', name: 'Accounts Receivable (Customer Dues)', nameBn: 'গ্রাহক বকেয়া (প্রাপ্য হিসাব)', amount: 634200, share: 14.2 },
      { id: '5', code: '1200', name: 'Commercial Inventory Stock (Cost Basis)', nameBn: 'মজুদ পণ্যের মূল্যায়ন (স্টক ভ্যালু)', amount: 850000, share: 19.0 },
    ],
    nonCurrent: [
      { id: '6', code: '1500', name: 'Office Equipment, IT & Furniture', nameBn: 'অফিস সরঞ্জাম ও ফার্নিচার', amount: 450000, share: 10.0 },
      { id: '7', code: '1600', name: 'Commercial Vehicles & Delivery Vans', nameBn: 'কোম্পানির যানবাহন ও ভ্যান', amount: 715000, share: 16.0 },
    ]
  };

  const liabilitiesAndEquities = {
    currentLiabilities: [
      { id: '1', code: '2010', name: 'Accounts Payable (Supplier Bills)', nameBn: 'সরবরাহকারী প্রদেয় বিল', amount: 412300, share: 9.2 },
      { id: '2', code: '2020', name: 'Accrued Operating Expenses & Rent', nameBn: 'বকেয়া বেতন ও অফিস ভাড়া', amount: 185000, share: 4.1 },
      { id: '3', code: '2030', name: 'Statutory VAT & Tax Payable (NBR)', nameBn: 'প্রদেয় সরকারি ভ্যাট ও মূসক', amount: 56100, share: 1.3 },
    ],
    nonCurrentLiabilities: [
      { id: '4', code: '2500', name: 'Long-term Bank SME Loan Facility', nameBn: 'দীর্ঘমেয়াদী এসএমই ব্যাংক ঋণ', amount: 608800, share: 13.6 },
    ],
    equities: [
      { id: '5', code: '3010', name: 'Paid-up Share Capital', nameBn: 'পরিশোধিত শেয়ার মূলধন', amount: 2500000, share: 55.8 },
      { id: '6', code: '3020', name: 'Retained Earnings & Accumulated Surplus', nameBn: 'সংরক্ষিত আয় ও ব্যবসায়িক মুনাফা', amount: 716300, share: 16.0 },
    ]
  };

  const totalCurrentAssets = assets.current.reduce((acc, r) => acc + r.amount, 0);
  const totalNonCurrentAssets = assets.nonCurrent.reduce((acc, c) => acc + c.amount, 0);
  const totalAssets = totalCurrentAssets + totalNonCurrentAssets;

  const totalCurrentLiabilities = liabilitiesAndEquities.currentLiabilities.reduce((acc, e) => acc + e.amount, 0);
  const totalNonCurrentLiabilities = liabilitiesAndEquities.nonCurrentLiabilities.reduce((acc, e) => acc + e.amount, 0);
  const totalLiabilities = totalCurrentLiabilities + totalNonCurrentLiabilities;

  const totalEquities = liabilitiesAndEquities.equities.reduce((acc, e) => acc + e.amount, 0);
  const totalLiabilitiesAndEquities = totalLiabilities + totalEquities;

  const workingCapital = totalCurrentAssets - totalCurrentLiabilities;
  const currentRatio = (totalCurrentAssets / totalCurrentLiabilities).toFixed(2);
  const isEquationBalanced = totalAssets === totalLiabilitiesAndEquities;

  const handleExport = (type: string) => {
    toast.success(
      isBangla
        ? `ব্যালেন্স শিট ${type.toUpperCase()} এক্সপোর্ট সম্পন্ন হয়েছে!`
        : `Balance Sheet ${type.toUpperCase()} exported successfully!`
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <FinancePageHeader
        pageName="Balance Sheet"
        pageNameBn="উদ্বৃত্তপত্র / ব্যালেন্স শিট (Balance Sheet)"
        icon={Scale}
      />

      {/* Top Solvency & Liquidity KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Assets */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-purple-500/5 border border-purple-500/20 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>{isBangla ? 'সর্বমোট সম্পদ (Total Assets)' : 'Total Assets'}</span>
            <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 text-[10px]">
              IAS 1 Compliant
            </Badge>
          </div>
          <div className="text-2xl font-black font-mono text-purple-600 dark:text-purple-400">
            {formatCurrency(totalAssets)}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {isBangla ? `চলতি: ${formatCurrency(totalCurrentAssets)}` : `Current Assets: ${formatCurrency(totalCurrentAssets)}`}
          </div>
        </div>

        {/* Total Liabilities */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-rose-500/5 border border-rose-500/20 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>{isBangla ? 'সর্বমোট দায় (Liabilities)' : 'Total Liabilities'}</span>
            <span className="text-[10px] font-bold text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded-full">
              {((totalLiabilities / totalAssets) * 100).toFixed(1)}% Debt Ratio
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
            {formatCurrency(totalLiabilities)}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {isBangla ? `সাপ্লায়ার ও ব্যাংক দায়` : `Payables & Bank Debt`}
          </div>
        </div>

        {/* Shareholders Equity */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-emerald-500/5 border border-emerald-500/20 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>{isBangla ? 'মালিকানাস্বত্ব (Total Equity)' : 'Shareholders Equity'}</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Net Worth
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {formatCurrency(totalEquities)}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {isBangla ? 'মূলধন ও সংরক্ষিত মুনাফা' : 'Paid Capital + Retained Profit'}
          </div>
        </div>

        {/* Accounting Equation Equilibrium Check */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-teal-500/10 border border-teal-500/30 shadow-md space-y-1.5 ring-1 ring-teal-500/20">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span className="text-teal-700 dark:text-teal-400 font-bold">{isBangla ? 'ব্যালেন্স শিট সমীকরণ' : 'Accounting Equation'}</span>
            <span className="inline-flex items-center text-[10px] font-bold text-teal-600 bg-teal-500/15 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              {isEquationBalanced ? 'Balanced' : 'Imbalance'}
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-foreground">
            A = L + E
          </div>
          <div className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold font-mono">
            {formatCurrency(totalAssets)} = {formatCurrency(totalLiabilitiesAndEquities)}
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-4 rounded-2xl border border-border/70 shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          {/* As of Date */}
          <Select value={asOfDate} onValueChange={setAsOfDate}>
            <SelectTrigger className="h-9 text-xs w-48 bg-background">
              <Calendar className="h-3.5 w-3.5 mr-1.5 text-primary" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">As of Today (Live Books)</SelectItem>
              <SelectItem value="month_end">As of Last Month End</SelectItem>
              <SelectItem value="q1_end">As of Q1 Close</SelectItem>
              <SelectItem value="fy_end">As of FY 2025 Close</SelectItem>
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
            </SelectContent>
          </Select>

          <div className="text-xs text-muted-foreground font-mono bg-muted/60 px-3 py-1.5 rounded-xl border border-border/60">
            Current Ratio: <strong className="text-foreground">{currentRatio}x</strong> • Working Capital: <strong className="text-foreground">{formatCurrency(workingCapital)}</strong>
          </div>
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
            <span>Excel Balance Sheet</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => handleExport('pdf')}
            className="h-9 text-xs gap-1.5 font-semibold"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>{isBangla ? 'অডিট প্রিন্ট' : 'Print Balance Sheet'}</span>
          </Button>
        </div>
      </div>

      {/* Structured Balance Sheet Tables (Assets & Liabilities Side by Side or Stacked) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: ASSETS */}
        <Card className="rounded-2xl border-border/70 shadow-xs overflow-hidden">
          <CardHeader className="p-4 border-b border-border/50 bg-purple-500/5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wide">
                {isBangla ? 'সম্পদসমূহ (Assets)' : 'Assets'}
              </CardTitle>
              <span className="text-sm font-mono font-black text-foreground">
                {formatCurrency(totalAssets)}
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-xs text-left">
              <tbody>
                {/* Current Assets */}
                <tr className="bg-muted/40 font-bold border-b border-border/40">
                  <td colSpan={3} className="py-2 px-3 text-[11px] text-muted-foreground uppercase">
                    {isBangla ? 'চলতি সম্পদ (Current Assets)' : 'Current Assets'}
                  </td>
                </tr>
                {assets.current.map((item) => (
                  <tr key={item.id} className="border-b border-border/20 hover:bg-muted/30">
                    <td className="py-2.5 px-3 font-mono text-muted-foreground w-16">{item.code}</td>
                    <td className="py-2.5 px-3 font-medium text-foreground">
                      {isBangla ? item.nameBn : item.name}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-foreground">
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-purple-500/5 font-bold border-b border-border/60 text-purple-700 dark:text-purple-300">
                  <td colSpan={2} className="py-2.5 px-3">{isBangla ? 'মোট চলতি সম্পদ' : 'Total Current Assets'}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{formatCurrency(totalCurrentAssets)}</td>
                </tr>

                {/* Non-Current Assets */}
                <tr className="bg-muted/40 font-bold border-b border-border/40">
                  <td colSpan={3} className="py-2 px-3 text-[11px] text-muted-foreground uppercase">
                    {isBangla ? 'স্থায়ী সম্পদ (Non-Current Assets)' : 'Non-Current / Fixed Assets'}
                  </td>
                </tr>
                {assets.nonCurrent.map((item) => (
                  <tr key={item.id} className="border-b border-border/20 hover:bg-muted/30">
                    <td className="py-2.5 px-3 font-mono text-muted-foreground w-16">{item.code}</td>
                    <td className="py-2.5 px-3 font-medium text-foreground">
                      {isBangla ? item.nameBn : item.name}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-foreground">
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-purple-500/5 font-bold border-b border-border/60 text-purple-700 dark:text-purple-300">
                  <td colSpan={2} className="py-2.5 px-3">{isBangla ? 'মোট স্থায়ী সম্পদ' : 'Total Fixed Assets'}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{formatCurrency(totalNonCurrentAssets)}</td>
                </tr>

                {/* Grand Total Assets */}
                <tr className="bg-purple-500/15 font-black border-t-2 border-purple-500/40 text-purple-800 dark:text-purple-300">
                  <td colSpan={2} className="py-3 px-3 uppercase text-xs">
                    {isBangla ? 'সর্বমোট সম্পদ (TOTAL ASSETS)' : 'TOTAL ENTERPRISE ASSETS'}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-sm font-black">
                    {formatCurrency(totalAssets)}
                  </td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* RIGHT COLUMN: LIABILITIES & EQUITY */}
        <Card className="rounded-2xl border-border/70 shadow-xs overflow-hidden">
          <CardHeader className="p-4 border-b border-border/50 bg-emerald-500/5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                {isBangla ? 'দায় ও মালিকানাস্বত্ব (Liabilities & Equity)' : 'Liabilities & Equity'}
              </CardTitle>
              <span className="text-sm font-mono font-black text-foreground">
                {formatCurrency(totalLiabilitiesAndEquities)}
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-xs text-left">
              <tbody>
                {/* Current Liabilities */}
                <tr className="bg-muted/40 font-bold border-b border-border/40">
                  <td colSpan={3} className="py-2 px-3 text-[11px] text-muted-foreground uppercase">
                    {isBangla ? 'চলতি দায় (Current Liabilities)' : 'Current Liabilities'}
                  </td>
                </tr>
                {liabilitiesAndEquities.currentLiabilities.map((item) => (
                  <tr key={item.id} className="border-b border-border/20 hover:bg-muted/30">
                    <td className="py-2.5 px-3 font-mono text-muted-foreground w-16">{item.code}</td>
                    <td className="py-2.5 px-3 font-medium text-foreground">
                      {isBangla ? item.nameBn : item.name}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-foreground">
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))}

                {/* Long Term Debt */}
                <tr className="bg-muted/40 font-bold border-b border-border/40">
                  <td colSpan={3} className="py-2 px-3 text-[11px] text-muted-foreground uppercase">
                    {isBangla ? 'দীর্ঘমেয়াদী দায় (Long-Term Liabilities)' : 'Non-Current Liabilities'}
                  </td>
                </tr>
                {liabilitiesAndEquities.nonCurrentLiabilities.map((item) => (
                  <tr key={item.id} className="border-b border-border/20 hover:bg-muted/30">
                    <td className="py-2.5 px-3 font-mono text-muted-foreground w-16">{item.code}</td>
                    <td className="py-2.5 px-3 font-medium text-foreground">
                      {isBangla ? item.nameBn : item.name}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-foreground">
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-rose-500/5 font-bold border-b border-border/60 text-rose-700 dark:text-rose-300">
                  <td colSpan={2} className="py-2.5 px-3">{isBangla ? 'মোট দায় (Total Liabilities)' : 'Total Liabilities'}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{formatCurrency(totalLiabilities)}</td>
                </tr>

                {/* Shareholders Equity */}
                <tr className="bg-muted/40 font-bold border-b border-border/40">
                  <td colSpan={3} className="py-2 px-3 text-[11px] text-muted-foreground uppercase">
                    {isBangla ? 'মালিকানাস্বত্ব (Shareholders Equity)' : 'Shareholders Equity'}
                  </td>
                </tr>
                {liabilitiesAndEquities.equities.map((item) => (
                  <tr key={item.id} className="border-b border-border/20 hover:bg-muted/30">
                    <td className="py-2.5 px-3 font-mono text-muted-foreground w-16">{item.code}</td>
                    <td className="py-2.5 px-3 font-medium text-foreground">
                      {isBangla ? item.nameBn : item.name}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-foreground">
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-emerald-500/5 font-bold border-b border-border/60 text-emerald-700 dark:text-emerald-300">
                  <td colSpan={2} className="py-2.5 px-3">{isBangla ? 'মোট মালিকানাস্বত্ব' : 'Total Equity'}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{formatCurrency(totalEquities)}</td>
                </tr>

                {/* Grand Total Liabilities & Equity */}
                <tr className="bg-emerald-500/15 font-black border-t-2 border-emerald-500/40 text-emerald-800 dark:text-emerald-300">
                  <td colSpan={2} className="py-3 px-3 uppercase text-xs">
                    {isBangla ? 'মোট দায় ও ইকুইটি (TOTAL L & E)' : 'TOTAL LIABILITIES & EQUITY'}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-sm font-black">
                    {formatCurrency(totalLiabilitiesAndEquities)}
                  </td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
