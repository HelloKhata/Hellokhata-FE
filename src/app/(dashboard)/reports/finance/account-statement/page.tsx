// Hello Khata OS - Account Statement (Ledger Summary & Statement)
// হ্যালো খাতা - হিসাব বিবরণী (লেজার সারসংক্ষেপ ও অ্যাকাউন্ট স্টেটমেন্ট)

'use client';

import React, { useState } from 'react';
import { FinancePageHeader } from '@/components/finance/FinancePageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
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
import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import {
  ScrollText,
  Filter,
  Printer,
  FileSpreadsheet,
  Building2,
  Search,
  Calendar,
  ArrowDownLeft,
  ArrowUpRight,
  Landmark,
  BookOpen,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AccountStatementPage() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency, formatNumber } = useCurrency();
  const [selectedAccount, setSelectedAccount] = useState('1020');
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');
  const [searchTerm, setSearchTerm] = useState('');

  const accountsList = [
    { code: '1020', name: 'BRAC Bank Operating Account', nameBn: 'ব্র্যাক ব্যাংক চলতি হিসাব', type: 'Asset', opening: 1287500 },
    { code: '1010', name: 'Cash on Hand (Vault Desk)', nameBn: 'হাতে নগদ ক্যাশ ডেস্ক', type: 'Asset', opening: 456800 },
    { code: '1030', name: 'bKash Merchant Wallet', nameBn: 'বিকাশ মার্চেন্ট ওয়ালেট', type: 'Asset', opening: 85000 },
    { code: '1100', name: 'Accounts Receivable Ledger', nameBn: 'প্রাপ্য হিসাব লেজার', type: 'Asset', opening: 634200 },
    { code: '2010', name: 'Accounts Payable (Trade Suppliers)', nameBn: 'সাপ্লায়ার দেনা হিসাব', type: 'Liability', opening: 412300 },
  ];

  const currentAccount = accountsList.find((a) => a.code === selectedAccount) || accountsList[0];

  const statementLogs = [
    { date: '2026-05-01', ref: 'OB-001', desc: 'Opening Ledger Balance Carried Forward', type: 'Credit', debit: 0, credit: 1287500, balance: 1287500 },
    { date: '2026-05-03', ref: 'PV-5021', desc: 'Salary Payroll bank transfer disbursement', type: 'Debit', debit: 500000, credit: 0, balance: 787500 },
    { date: '2026-05-04', ref: 'PV-5022', desc: 'Commercial Office Rent wire payment', type: 'Debit', debit: 240000, credit: 0, balance: 547500 },
    { date: '2026-05-06', ref: 'RV-3012', desc: 'Customer wire transfer from ABC Traders', type: 'Credit', debit: 0, credit: 345000, balance: 892500 },
    { date: '2026-05-10', ref: 'FT-084', desc: 'Counter cash vault deposit', type: 'Credit', debit: 0, credit: 120000, balance: 1012500 },
    { date: '2026-05-14', ref: 'PV-5030', desc: 'Supplier bill payment to Square Pharma', type: 'Debit', debit: 85000, credit: 0, balance: 927500 },
  ];

  const filteredLogs = statementLogs.filter(
    (log) =>
      log.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ref.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCredits = filteredLogs.reduce((acc, l) => acc + l.credit, 0);
  const totalDebits = filteredLogs.reduce((acc, l) => acc + l.debit, 0);
  const closingBalance = filteredLogs.length > 0 ? filteredLogs[filteredLogs.length - 1].balance : currentAccount.opening;

  const handleExport = (type: string) => {
    toast.success(
      isBangla
        ? `অ্যাকাউন্ট স্টেটমেন্ট ${type.toUpperCase()} এক্সপোর্ট সম্পন্ন হয়েছে!`
        : `Account Statement ${type.toUpperCase()} exported successfully!`
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <FinancePageHeader
        pageName="Account Statement"
        pageNameBn="হিসাব বিবরণী (Account Statement)"
        icon={ScrollText}
      />

      {/* Top Account Snapshot Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-card via-card to-teal-500/10 border border-teal-500/30 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/30 shrink-0">
            <Landmark className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-foreground">
                {isBangla ? currentAccount.nameBn : currentAccount.name}
              </h2>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-mono">
                Code: {currentAccount.code}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isBangla ? 'নির্বাচিত অ্যাকাউন্টের বিস্তারিত ক্রেডিট/ডেবিট খতিয়ান সারসংক্ষেপ' : 'Comprehensive running transaction ledger for this specific account'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 self-stretch md:self-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-border/60">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-muted-foreground">{isBangla ? 'প্রারম্ভিক ব্যালেন্স' : 'Opening'}</div>
            <div className="text-sm font-bold font-mono text-muted-foreground">{formatCurrency(currentAccount.opening)}</div>
          </div>
          <div className="h-8 w-[1px] bg-border/80" />
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-teal-700 dark:text-teal-400">{isBangla ? 'বর্তমান সমাপনী ব্যালেন্স' : 'Closing Balance'}</div>
            <div className="text-lg font-black font-mono text-teal-600 dark:text-teal-400">{formatCurrency(closingBalance)}</div>
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-4 rounded-2xl border border-border/70 shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          {/* Account Selector */}
          <Select value={selectedAccount} onValueChange={setSelectedAccount}>
            <SelectTrigger className="h-9 text-xs w-60 bg-background">
              <BookOpen className="h-3.5 w-3.5 mr-1.5 text-primary" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {accountsList.map((acc) => (
                <SelectItem key={acc.code} value={acc.code}>
                  {acc.code} - {acc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Period Selector */}
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="h-9 text-xs w-44 bg-background">
              <Calendar className="h-3.5 w-3.5 mr-1.5 text-primary" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this_month">This Month (May 2026)</SelectItem>
              <SelectItem value="last_month">Last Month (Apr 2026)</SelectItem>
              <SelectItem value="this_quarter">Q2 2026</SelectItem>
              <SelectItem value="fy_25_26">FY 2025–26</SelectItem>
            </SelectContent>
          </Select>

          {/* Search */}
          <div className="relative w-full sm:w-52">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={isBangla ? 'রেফারেন্স বা বিবরণ...' : 'Search ref or desc...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 pl-8 text-xs bg-background"
            />
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
            <span>Excel Statement</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => handleExport('pdf')}
            className="h-9 text-xs gap-1.5 font-semibold"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>{isBangla ? 'স্টেটমেন্ট প্রিন্ট' : 'Print Statement'}</span>
          </Button>
        </div>
      </div>

      {/* Account Statement Table */}
      <Card className="rounded-2xl border-border/70 shadow-xs overflow-hidden">
        <CardHeader className="p-5 border-b border-border/50 bg-muted/20">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                {isBangla ? 'স্টেটমেন্ট লেনদেন খতিয়ান' : 'Account Statement Running Log'}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                {isBangla ? 'তারিখভিত্তিক সকল জমা, খরচ ও চলমান ব্যালেন্স' : 'Chronological ledger debit/credit postings with real-time balance'}
              </CardDescription>
            </div>
            <span className="text-xs font-mono font-bold text-muted-foreground">
              {formatNumber(filteredLogs.length)} {isBangla ? 'টি লেনদেন' : 'transactions'}
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground font-bold uppercase text-[10px] tracking-wider bg-muted/40">
                  <th className="py-3 px-4">{isBangla ? 'তারিখ' : 'Date'}</th>
                  <th className="py-3 px-4">{isBangla ? 'রেফারেন্স' : 'Reference'}</th>
                  <th className="py-3 px-4">{isBangla ? 'বিবরণ' : 'Description'}</th>
                  <th className="py-3 px-4 text-right">{isBangla ? 'ডেবিট (Outflow)' : 'Debit (Outflow)'}</th>
                  <th className="py-3 px-4 text-right">{isBangla ? 'ক্রেডিট (Inflow)' : 'Credit (Inflow)'}</th>
                  <th className="py-3 px-4 text-right">{isBangla ? 'চলমান ব্যালেন্স (৳)' : 'Balance (BDT)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filteredLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap text-muted-foreground font-medium">{log.date}</td>
                    <td className="py-3 px-4 font-mono font-bold text-primary">
                      <span className="bg-muted px-2 py-0.5 rounded-md border border-border/60">{log.ref}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-foreground">{log.desc}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-rose-600">
                      {log.debit > 0 ? `−${formatCurrency(log.debit)}` : '—'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">
                      {log.credit > 0 ? `+${formatCurrency(log.credit)}` : '—'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-black text-foreground">
                      {formatCurrency(log.balance)}
                    </td>
                  </tr>
                ))}

                {/* Statement Summary Row */}
                <tr className="bg-muted/40 font-bold border-t-2 border-border/80">
                  <td colSpan={3} className="py-3.5 px-4 uppercase text-xs">
                    {isBangla ? 'সর্বমোট লেনদেন ভলিউম' : 'TOTAL STATEMENT TURNOVER'}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-sm font-black text-rose-600">
                    −{formatCurrency(totalDebits)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-sm font-black text-emerald-600">
                    +{formatCurrency(totalCredits)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-sm font-black text-teal-600">
                    {formatCurrency(closingBalance)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
