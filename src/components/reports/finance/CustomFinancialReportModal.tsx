// Hello Khata OS - Custom Financial Report Builder Modal
// হ্যালো খাতা - কাস্টম আর্থিক রিপোর্ট বিল্ডার ও জেনারেটর

'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Sparkles,
  Sliders,
  Layers,
  Calendar,
  Building2,
  FileSpreadsheet,
  Printer,
  CheckCircle2,
  Filter,
  ArrowRight,
  TrendingUp,
  Table,
} from 'lucide-react';
import { toast } from 'sonner';

interface CustomFinancialReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isBangla?: boolean;
}

export function CustomFinancialReportModal({
  open,
  onOpenChange,
  isBangla = false,
}: CustomFinancialReportModalProps) {
  const { formatCurrency } = useCurrency();
  const [reportName, setReportName] = useState(
    isBangla ? 'কাস্টম বিভাগীয় লাভ ও খরচ বিশ্লেষণ' : 'Custom Departmental Profit & Cost Analysis'
  );
  const [reportType, setReportType] = useState('pnl_custom');
  const [timePeriod, setTimePeriod] = useState('this_quarter');
  const [compareOption, setCompareOption] = useState('prev_year');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([
    '4100', // Sales Revenue
    '5100', // Cost of Goods Sold
    '6100', // Salaries & Benefits
    '6200', // Rent & Utilities
  ]);

  const accountOptions = [
    { code: '4100', name: 'Product Sales Revenue', nameBn: 'পণ্য বিক্রয় রাজস্ব', type: 'Revenue' },
    { code: '4200', name: 'Service & Maintenance Revenue', nameBn: 'সার্ভিস ও রক্ষণাবেক্ষণ আয়', type: 'Revenue' },
    { code: '5100', name: 'Cost of Goods Sold (COGS)', nameBn: 'বিক্রীত পণ্যের ব্যয় (সিওজিএস)', type: 'COGS' },
    { code: '6100', name: 'Salaries & Staff Payroll', nameBn: 'বেতন ও কর্মী পারিতোষিক', type: 'Expense' },
    { code: '6200', name: 'Office Rent & Commercial Utilities', nameBn: 'অফিস ভাড়া ও ইউটিলিটি', type: 'Expense' },
    { code: '6300', name: 'Marketing & Digital Ads', nameBn: 'মার্কেটিং ও ডিজিটাল বিজ্ঞাপন', type: 'Expense' },
    { code: '1100', name: 'Cash in Hand & Counter Desks', nameBn: 'হাতে নগদ ও কাউন্টার ক্যাশ', type: 'Asset' },
    { code: '1200', name: 'Bank Corporate Accounts', nameBn: 'ব্যাংক হিসাব ও জমা', type: 'Asset' },
    { code: '2100', name: 'Accounts Payable to Suppliers', nameBn: 'সাপ্লায়ার প্রদেয় বিল', type: 'Liability' },
  ];

  const toggleAccount = (code: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleGenerate = (format: 'view' | 'excel' | 'pdf') => {
    onOpenChange(false);
    if (format === 'excel') {
      toast.success(
        isBangla
          ? `"${reportName}" কাস্টম এক্সেল স্প্রেডশিট সফলভাবে এক্সপোর্ট হয়েছে!`
          : `Custom Excel spreadsheet "${reportName}" exported successfully!`
      );
    } else if (format === 'pdf') {
      toast.success(
        isBangla
          ? `"${reportName}" কাস্টম রিপোর্ট পিডিএফ প্রস্তুত হয়েছে!`
          : `Custom PDF report "${reportName}" is ready for printing!`
      );
    } else {
      toast.success(
        isBangla
          ? `"${reportName}" কাস্টম রিপোর্ট সফলভাবে জেনারেট হয়েছে!`
          : `Custom report "${reportName}" generated successfully!`
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
        {/* Header */}
        <DialogHeader className="space-y-1.5 border-b border-border/60 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                {isBangla ? 'কাস্টম আর্থিক রিপোর্ট বিল্ডার' : 'Custom Financial Report Studio'}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {isBangla
                  ? 'আপনার প্রয়োজন অনুযায়ী নির্দিষ্ট লেজার, শাখা ও তুলনামূলক ডেটা দিয়ে নিজস্ব রিপোর্ট ডিজাইন করুন'
                  : 'Design bespoke financial reports by combining specific accounts, branches, and variance metrics'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Builder Form Controls */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {/* 1. Report Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              {isBangla ? 'রিপোর্টের শিরোনাম / নাম' : 'Custom Report Title'}
            </label>
            <Input
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              placeholder="e.g., Q2 Operational Margin & Overhead Report"
              className="h-9 text-xs bg-muted/30 border-border/70 rounded-xl"
            />
          </div>

          {/* 2. Report Type & Period */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                {isBangla ? 'রিপোর্ট আর্কিটেকচার' : 'Report Structure'}
              </label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="h-9 text-xs bg-muted/30 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pnl_custom">
                    {isBangla ? 'কাস্টম আয় ও লাভ-ক্ষতি' : 'Custom Revenue & P&L'}
                  </SelectItem>
                  <SelectItem value="ledger_custom">
                    {isBangla ? 'মাল্টি-লেজার কম্বাইন্ড স্টেটমেন্ট' : 'Multi-Ledger Combined Postings'}
                  </SelectItem>
                  <SelectItem value="cost_center">
                    {isBangla ? 'কস্ট সেন্টার ও ওভারহেড বিশ্লেষণ' : 'Cost Center & Overhead Audit'}
                  </SelectItem>
                  <SelectItem value="branch_compare">
                    {isBangla ? 'শাখাভিত্তিক পারফরম্যান্স তুলনা' : 'Multi-Branch Variance Compare'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                {isBangla ? 'সময়কাল' : 'Date Range'}
              </label>
              <Select value={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger className="h-9 text-xs bg-muted/30 rounded-xl">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-primary" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this_month">This Month (চলতি মাস)</SelectItem>
                  <SelectItem value="this_quarter">Current Quarter (চলতি কোয়ার্টার - Q2)</SelectItem>
                  <SelectItem value="fy_2025">Fiscal Year 2025–26 (অর্থবছর ২৫-২৬)</SelectItem>
                  <SelectItem value="custom">Custom Date Range (নির্দিষ্ট তারিখ)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 3. Comparison & Branch Filter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                {isBangla ? 'তুলনামূলক ভিত্তি' : 'Variance Comparison'}
              </label>
              <Select value={compareOption} onValueChange={setCompareOption}>
                <SelectTrigger className="h-9 text-xs bg-muted/30 rounded-xl">
                  <TrendingUp className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Comparison (শুধু চলতি ডেটা)</SelectItem>
                  <SelectItem value="prev_period">vs Previous Month (গত মাসের সাথে)</SelectItem>
                  <SelectItem value="prev_year">vs Same Period Last Year (YoY গত বছর)</SelectItem>
                  <SelectItem value="budget">vs Annual Budget (টার্গেট বা বাজেট)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                {isBangla ? 'শাখা নির্বাচন' : 'Branch Scope'}
              </label>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger className="h-9 text-xs bg-muted/30 rounded-xl">
                  <Building2 className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Consolidated All Branches (সকল শাখা)</SelectItem>
                  <SelectItem value="dhanmondi">Main Branch (Dhanmondi)</SelectItem>
                  <SelectItem value="gulshan">Gulshan Corporate Branch</SelectItem>
                  <SelectItem value="uttara">Uttara Retail Outlet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 4. Multi-Account Selection Grid */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-500" />
                <span>{isBangla ? 'অন্তর্ভুক্ত খতিয়ান ও হিসাব নির্বাচন' : 'Select Ledger Accounts to Include'}</span>
              </label>
              <span className="text-[11px] font-mono text-muted-foreground">
                {selectedAccounts.length} selected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-muted/20 backdrop-blur-md p-3 rounded-2xl border border-border/60">
              {accountOptions.map((acc) => {
                const isSelected = selectedAccounts.includes(acc.code);
                return (
                  <button
                    key={acc.code}
                    type="button"
                    onClick={() => toggleAccount(acc.code)}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-purple-500/10 border-purple-500/40 text-foreground shadow-xs font-semibold'
                        : 'bg-card/60 border-border/50 text-muted-foreground hover:text-foreground hover:bg-card'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="font-mono text-[10px] text-purple-600 font-bold">{acc.code}</span>
                        <span className="truncate">{isBangla ? acc.nameBn : acc.name}</span>
                      </div>
                    </div>
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-border shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <DialogFooter className="border-t border-border/60 pt-3 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs rounded-xl text-muted-foreground hover:text-foreground"
          >
            {isBangla ? 'বাতিল' : 'Cancel'}
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleGenerate('excel')}
              className="h-8.5 text-xs gap-1.5 rounded-xl border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Excel</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleGenerate('pdf')}
              className="h-8.5 text-xs gap-1.5 rounded-xl border-blue-500/30 text-blue-600 hover:bg-blue-500/10"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PDF</span>
            </Button>

            <Button
              size="sm"
              onClick={() => handleGenerate('view')}
              className="h-8.5 px-4 text-xs font-semibold gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-500/25"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isBangla ? 'রিপোর্ট তৈরি করুন' : 'Generate Report'}</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
