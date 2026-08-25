// Hello Khata OS - Cash Flow Statement (IAS-7 Statement of Cash Flows)
// হ্যালো খাতা - নগদ প্রবাহ বিবরণী (আইএএস-৭ নগদ প্রবাহ বিবরণী)

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
  RefreshCw,
  Filter,
  Printer,
  FileSpreadsheet,
  ArrowUpRight,
  ArrowDownRight,
  Coins,
  Calendar,
  Building2,
  CheckCircle2,
  TrendingUp,
  Wallet,
  Landmark,
} from 'lucide-react';
import { toast } from 'sonner';

export default function CashFlowPage() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency, formatNumber } = useCurrency();
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');

  const operatingFlow = [
    { id: '1', code: 'CF-01', name: 'Net Operating Income (from P&L)', nameBn: 'নিট পরিচালন মুনাফা (লাভ-ক্ষতি থেকে)', amount: 482450, isInflow: true },
    { id: '2', code: 'CF-02', name: 'Depreciation & Non-Cash Amortization', nameBn: 'অবচয় ও অনগদ সমন্বয়', amount: 35000, isInflow: true },
    { id: '3', code: 'CF-03', name: 'Change in Accounts Receivable (Customer Collections)', nameBn: 'গ্রাহক বকেয়া আদায় সমন্বয়', amount: 84200, isInflow: true },
    { id: '4', code: 'CF-04', name: 'Payments for Commercial Inventory Replenishment', nameBn: 'নতুন পণ্য ক্রয়ের জন্য নগদ পরিশোধ', amount: 145000, isInflow: false },
    { id: '5', code: 'CF-05', name: 'Payments to Trade Suppliers & Creditors', nameBn: 'সাপ্লায়ার দেনা ও বিল পরিশোধ', amount: 210000, isInflow: false },
  ];

  const investingFlow = [
    { id: '6', code: 'CF-11', name: 'Procurement of IT Equipment & POS Terminals', nameBn: 'নতুন পিওএস টার্মিনাল ও আইটি সরঞ্জাম ক্রয়', amount: 65000, isInflow: false },
    { id: '7', code: 'CF-12', name: 'Warehouse Renovation & Fixtures Installation', nameBn: 'ওয়্যারহাউজ আধুনিকায়ন ও ফিটিংস খরচ', amount: 45000, isInflow: false },
  ];

  const financingFlow = [
    { id: '8', code: 'CF-21', name: 'Directors Equity Capital Infusion', nameBn: 'পরিচালকদের মূলধন বিনিয়োগ গ্রহণ', amount: 200000, isInflow: true },
    { id: '9', code: 'CF-22', name: 'Principal Repayment of Bank SME Loan', nameBn: 'ব্যাংক ঋণের মূল কিস্তি পরিশোধ', amount: 75000, isInflow: false },
    { id: '10', code: 'CF-23', name: 'Bank Interest & Financing Charges Paid', nameBn: 'ব্যাংক সুদ ও আর্থিক চার্জ প্রদান', amount: 21750, isInflow: false },
  ];

  const totalOperating = operatingFlow.reduce((acc, f) => acc + (f.isInflow ? f.amount : -f.amount), 0);
  const totalInvesting = investingFlow.reduce((acc, f) => acc + (f.isInflow ? f.amount : -f.amount), 0);
  const totalFinancing = financingFlow.reduce((acc, f) => acc + (f.isInflow ? f.amount : -f.amount), 0);

  const netCashMovement = totalOperating + totalInvesting + totalFinancing;
  const openingCashBalance = 1583500;
  const closingCashBalance = openingCashBalance + netCashMovement;

  const handleExport = (type: string) => {
    toast.success(
      isBangla
        ? `নগদ প্রবাহ বিবরণী ${type.toUpperCase()} এক্সপোর্ট সম্পন্ন হয়েছে!`
        : `Cash Flow Statement ${type.toUpperCase()} exported successfully!`
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <FinancePageHeader
        pageName="Cash Flow Statement"
        pageNameBn="নগদ প্রবাহ বিবরণী (Cash Flow)"
        icon={RefreshCw}
      />

      {/* Top Liquidity Health Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Operating Cash Flow */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-emerald-500/5 border border-emerald-500/20 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>{isBangla ? 'পরিচালন নগদ প্রবাহ (Operating)' : 'Operating Cash Flow'}</span>
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
              Core Business
            </Badge>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            +{formatCurrency(totalOperating)}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {isBangla ? 'মূল ব্যবসায়িক কার্যক্রমে উদ্বৃত্ত' : 'Positive operational surplus'}
          </div>
        </div>

        {/* Investing Cash Flow */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-blue-500/5 border border-blue-500/20 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>{isBangla ? 'বিনিয়োগ নগদ প্রবাহ (Investing)' : 'Investing Activities'}</span>
            <Badge variant="outline" className="text-[10px] text-blue-600 border-blue-500/30">
              CapEx Spends
            </Badge>
          </div>
          <div className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400">
            {totalInvesting >= 0 ? `+${formatCurrency(totalInvesting)}` : `−${formatCurrency(Math.abs(totalInvesting))}`}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {isBangla ? 'যন্ত্রপাতি ও সম্পদ সম্প্রসারণ' : 'Equipment & terminal purchases'}
          </div>
        </div>

        {/* Financing Cash Flow */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-purple-500/5 border border-purple-500/20 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>{isBangla ? 'অর্থায়ন নগদ প্রবাহ (Financing)' : 'Financing Activities'}</span>
            <Badge variant="outline" className="text-[10px] text-purple-600 border-purple-500/30">
              Equity & Debt
            </Badge>
          </div>
          <div className="text-2xl font-black font-mono text-purple-600 dark:text-purple-400">
            +{formatCurrency(totalFinancing)}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {isBangla ? 'মূলধন ও ঋণ সমন্বয়' : 'Equity capital & loan repayments'}
          </div>
        </div>

        {/* Net Period Cash Flow Closing */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-teal-500/10 border border-teal-500/30 shadow-md space-y-1.5 ring-1 ring-teal-500/20">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span className="text-teal-700 dark:text-teal-400 font-bold">{isBangla ? 'সমাপনী নগদ তারল্য' : 'Closing Cash Position'}</span>
            <span className="inline-flex items-center text-[10px] font-bold text-teal-600 bg-teal-500/15 px-2 py-0.5 rounded-full">
              Reconciled
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-foreground">
            {formatCurrency(closingCashBalance)}
          </div>
          <div className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold font-mono">
            Net Change: +{formatCurrency(netCashMovement)}
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
            </SelectContent>
          </Select>
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
            <span>Excel Cash Flow</span>
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

      {/* Structured Statement Table */}
      <Card className="rounded-2xl border-border/70 shadow-xs overflow-hidden">
        <CardHeader className="p-5 border-b border-border/50 bg-muted/20">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                {isBangla ? 'নগদ তহবিল প্রবাহ বিবরণী (IAS-7 পরোক্ষ পদ্ধতি)' : 'Statement of Cash Flows (IAS-7 Indirect Method)'}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                {isBangla
                  ? 'পরিচালন, মূলধনী ব্যয় ও অর্থায়নের বিস্তারিত নগদ প্রবাহ'
                  : 'Reconciliation of operating profit into cash and equivalent movements'}
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-xs font-mono">
              IAS 7 • Indirect Method
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground font-bold uppercase text-[10px] tracking-wider bg-muted/40">
                <th className="py-3 px-4 w-28">{isBangla ? 'রেফারেন্স' : 'Ref Code'}</th>
                <th className="py-3 px-4">{isBangla ? 'নগদ প্রবাহ কার্যক্রম বিবরণ' : 'Cash Flow Activity'}</th>
                <th className="py-3 px-4 text-center">{isBangla ? 'গতিপথ' : 'Flow'}</th>
                <th className="py-3 px-4 text-right">{isBangla ? 'পরিমাণ (৳)' : 'Amount (BDT)'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {/* 1. OPERATING ACTIVITIES */}
              <tr className="bg-emerald-500/5 font-bold text-emerald-700 dark:text-emerald-400">
                <td colSpan={4} className="py-2.5 px-4 uppercase text-[11px] tracking-wider">
                  {isBangla ? '১. পরিচালন কার্যক্রম থেকে নগদ প্রবাহ (Operating Activities)' : '1. Cash Flows from Operating Activities'}
                </td>
              </tr>
              {operatingFlow.map((item) => (
                <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                  <td className="py-2.5 px-4 font-mono text-muted-foreground">{item.code}</td>
                  <td className="py-2.5 px-4 font-medium text-foreground">{isBangla ? item.nameBn : item.name}</td>
                  <td className="py-2.5 px-4 text-center">
                    {item.isInflow ? (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">Inflow</span>
                    ) : (
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded-full">Outflow</span>
                    )}
                  </td>
                  <td className={`py-2.5 px-4 text-right font-mono font-bold ${item.isInflow ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {item.isInflow ? `+${formatCurrency(item.amount)}` : `−${formatCurrency(item.amount)}`}
                  </td>
                </tr>
              ))}
              <tr className="bg-emerald-500/10 font-bold border-y border-emerald-500/30 text-emerald-800 dark:text-emerald-300">
                <td colSpan={3} className="py-3 px-4">{isBangla ? 'পরিচালন কার্যক্রমের নিট নগদ' : 'Net Cash Provided by Operating Activities'}</td>
                <td className="py-3 px-4 text-right font-mono text-sm">+{formatCurrency(totalOperating)}</td>
              </tr>

              {/* 2. INVESTING ACTIVITIES */}
              <tr className="bg-blue-500/5 font-bold text-blue-700 dark:text-blue-400">
                <td colSpan={4} className="py-2.5 px-4 uppercase text-[11px] tracking-wider">
                  {isBangla ? '২. বিনিয়োগ কার্যক্রম থেকে নগদ প্রবাহ (Investing Activities)' : '2. Cash Flows from Investing Activities'}
                </td>
              </tr>
              {investingFlow.map((item) => (
                <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                  <td className="py-2.5 px-4 font-mono text-muted-foreground">{item.code}</td>
                  <td className="py-2.5 px-4 font-medium text-foreground">{isBangla ? item.nameBn : item.name}</td>
                  <td className="py-2.5 px-4 text-center">
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded-full">Outflow</span>
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-rose-600">
                    −{formatCurrency(item.amount)}
                  </td>
                </tr>
              ))}
              <tr className="bg-blue-500/10 font-bold border-y border-blue-500/30 text-blue-800 dark:text-blue-300">
                <td colSpan={3} className="py-3 px-4">{isBangla ? 'বিনিয়োগ কার্যক্রমের নিট নগদ' : 'Net Cash Used in Investing Activities'}</td>
                <td className="py-3 px-4 text-right font-mono text-sm">−{formatCurrency(Math.abs(totalInvesting))}</td>
              </tr>

              {/* 3. FINANCING ACTIVITIES */}
              <tr className="bg-purple-500/5 font-bold text-purple-700 dark:text-purple-400">
                <td colSpan={4} className="py-2.5 px-4 uppercase text-[11px] tracking-wider">
                  {isBangla ? '৩. অর্থায়ন কার্যক্রম থেকে নগদ প্রবাহ (Financing Activities)' : '3. Cash Flows from Financing Activities'}
                </td>
              </tr>
              {financingFlow.map((item) => (
                <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                  <td className="py-2.5 px-4 font-mono text-muted-foreground">{item.code}</td>
                  <td className="py-2.5 px-4 font-medium text-foreground">{isBangla ? item.nameBn : item.name}</td>
                  <td className="py-2.5 px-4 text-center">
                    {item.isInflow ? (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">Inflow</span>
                    ) : (
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded-full">Outflow</span>
                    )}
                  </td>
                  <td className={`py-2.5 px-4 text-right font-mono font-bold ${item.isInflow ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {item.isInflow ? `+${formatCurrency(item.amount)}` : `−${formatCurrency(item.amount)}`}
                  </td>
                </tr>
              ))}
              <tr className="bg-purple-500/10 font-bold border-y border-purple-500/30 text-purple-800 dark:text-purple-300">
                <td colSpan={3} className="py-3 px-4">{isBangla ? 'অর্থায়ন কার্যক্রমের নিট নগদ' : 'Net Cash Provided by Financing Activities'}</td>
                <td className="py-3 px-4 text-right font-mono text-sm">+{formatCurrency(totalFinancing)}</td>
              </tr>

              {/* NET RECONCILIATION SUMMARY */}
              <tr className="bg-muted/60 font-bold border-t-2 border-border/80">
                <td colSpan={3} className="py-3 px-4">{isBangla ? 'শুরুর প্রারম্ভিক নগদ তহবিল (Opening Balance)' : 'Opening Cash & Equivalents Balance'}</td>
                <td className="py-3 px-4 text-right font-mono font-bold">{formatCurrency(openingCashBalance)}</td>
              </tr>
              <tr className="bg-muted/40 font-bold">
                <td colSpan={3} className="py-2.5 px-4 text-emerald-600">{isBangla ? 'সময়ে নিট নগদ বৃদ্ধি (Net Change)' : 'Net Cash & Equivalents Movement'}</td>
                <td className="py-2.5 px-4 text-right font-mono font-bold text-emerald-600">+{formatCurrency(netCashMovement)}</td>
              </tr>
              <tr className="bg-teal-500/15 font-black border-y-2 border-teal-500/40 text-teal-800 dark:text-teal-300 text-sm">
                <td colSpan={3} className="py-3.5 px-4 uppercase">{isBangla ? 'সমাপনী নগদ তহবিল ব্যালেন্স (CLOSING CASH)' : 'CLOSING CASH & CASH EQUIVALENTS BALANCE'}</td>
                <td className="py-3.5 px-4 text-right font-mono text-base font-black">{formatCurrency(closingCashBalance)}</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
