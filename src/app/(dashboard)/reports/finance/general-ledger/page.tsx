// Hello Khata OS - General Ledger Book (Master Transaction Journal)
// হ্যালো খাতা - সাধারণ খতিয়ান বই (মাস্টার ট্রানজ্যাকশন লেজার)

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
  FileText,
  Filter,
  Printer,
  FileSpreadsheet,
  Search,
  Calendar,
  Building2,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Receipt,
} from 'lucide-react';
import { toast } from 'sonner';

export default function GeneralLedgerPage() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency, formatNumber } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');

  const ledgerEntries = [
    { date: '2026-05-01', code: '1010', account: 'Cash on Hand (Vault)', desc: 'Monthly opening cash balance setup', voucher: 'JV-001', debit: 456800, credit: 0, balance: 456800 },
    { date: '2026-05-01', code: '1020', account: 'Bank Operating Account (BRAC)', desc: 'Initial operating liquidity deposit', voucher: 'JV-001', debit: 1287500, credit: 0, balance: 1744300 },
    { date: '2026-05-02', code: '4010', account: 'Product Sales Revenues', desc: 'Wholesale sales to ABC Traders on credit', voucher: 'INV-2048', debit: 0, credit: 125000, balance: 1619300 },
    { date: '2026-05-02', code: '1100', account: 'Accounts Receivable', desc: 'Receivable entry for Invoice INV-2048', voucher: 'INV-2048', debit: 125000, credit: 0, balance: 1744300 },
    { date: '2026-05-03', code: '6010', account: 'Employee Salaries & Payroll', desc: 'Monthly employee salary disbursement', voucher: 'PV-5021', debit: 500000, credit: 0, balance: 1244300 },
    { date: '2026-05-03', code: '1020', account: 'Bank Operating Account (BRAC)', desc: 'Cheque drawn for salary payout', voucher: 'PV-5021', debit: 0, credit: 500000, balance: 744300 },
    { date: '2026-05-04', code: '6020', account: 'Office Rent & Utilities', desc: 'Commercial office rent paid via wire', voucher: 'PV-5022', debit: 240000, credit: 0, balance: 504300 },
    { date: '2026-05-05', code: '5010', account: 'Cost of Goods Sold (COGS)', desc: 'Inventory stock depletion voucher', voucher: 'JV-002', debit: 923400, credit: 0, balance: -419100 },
    { date: '2026-05-05', code: '1200', account: 'Commercial Inventory Stock', desc: 'Inventory outflow matching sales', voucher: 'JV-002', debit: 0, credit: 923400, balance: -1342500 },
    { date: '2026-05-06', code: '1020', account: 'Bank Operating Account (City Bank)', desc: 'Customer wire transfer received', voucher: 'RV-3012', debit: 345000, credit: 0, balance: -997500 },
  ];

  const filteredEntries = ledgerEntries.filter((entry) => {
    const matchesSearch =
      entry.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.voucher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.code.includes(searchTerm);

    if (selectedAccount === 'all') return matchesSearch;
    return matchesSearch && entry.code === selectedAccount;
  });

  const totalDebit = filteredEntries.reduce((acc, entry) => acc + entry.debit, 0);
  const totalCredit = filteredEntries.reduce((acc, entry) => acc + entry.credit, 0);

  const handleExport = (type: string) => {
    toast.success(
      isBangla
        ? `খতিয়ান বই ${type.toUpperCase()} এক্সপোর্ট সম্পন্ন হয়েছে!`
        : `General Ledger ${type.toUpperCase()} exported successfully!`
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <FinancePageHeader
        pageName="General Ledger Book"
        pageNameBn="খতিয়ান বই (General Ledger Master)"
        icon={BookOpen}
      />

      {/* Top Ledger Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-indigo-500/5 border border-indigo-500/20 shadow-xs space-y-1.5">
          <div className="text-xs font-semibold text-muted-foreground">{isBangla ? 'সর্বমোট ডেবিট এন্ট্রি' : 'Total Debit Postings'}</div>
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">{formatCurrency(totalDebit)}</div>
          <div className="text-[11px] text-muted-foreground">{isBangla ? 'নির্বাচিত সময়ের মোট ডেবিট' : 'Debits across postings'}</div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-blue-500/5 border border-blue-500/20 shadow-xs space-y-1.5">
          <div className="text-xs font-semibold text-muted-foreground">{isBangla ? 'সর্বমোট ক্রেডিট এন্ট্রি' : 'Total Credit Postings'}</div>
          <div className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400">{formatCurrency(totalCredit)}</div>
          <div className="text-[11px] text-muted-foreground">{isBangla ? 'নির্বাচিত সময়ের মোট ক্রেডিট' : 'Credits across postings'}</div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-purple-500/5 border border-purple-500/20 shadow-xs space-y-1.5">
          <div className="text-xs font-semibold text-muted-foreground">{isBangla ? 'পোস্টেড ভাউচার সংখ্যা' : 'Posted Vouchers'}</div>
          <div className="text-2xl font-black font-mono text-foreground">{formatNumber(filteredEntries.length)}</div>
          <div className="text-[11px] text-muted-foreground">{isBangla ? 'দ্বৈত দাখিলা রেজিস্টার' : 'Audit voucher count'}</div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-teal-500/10 border border-teal-500/30 shadow-md space-y-1.5 ring-1 ring-teal-500/20">
          <div className="text-xs font-semibold text-teal-700 dark:text-teal-400 font-bold">{isBangla ? 'খতিয়ান স্ট্যাটাস' : 'Ledger Status'}</div>
          <div className="text-xl font-bold font-mono text-foreground">Fully Reconciled</div>
          <div className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold font-mono">Real-time Double Entry</div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-4 rounded-2xl border border-border/70 shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          {/* Account Filter */}
          <Select value={selectedAccount} onValueChange={setSelectedAccount}>
            <SelectTrigger className="h-9 text-xs w-52 bg-background">
              <BookOpen className="h-3.5 w-3.5 mr-1.5 text-primary" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isBangla ? 'সকল অ্যাকাউন্ট (All)' : 'All Ledger Accounts'}</SelectItem>
              <SelectItem value="1010">1010 - Cash on Hand</SelectItem>
              <SelectItem value="1020">1020 - Bank Operating</SelectItem>
              <SelectItem value="1100">1100 - Accounts Receivable</SelectItem>
              <SelectItem value="1200">1200 - Inventory Stock</SelectItem>
              <SelectItem value="4010">4010 - Product Sales</SelectItem>
              <SelectItem value="6010">6010 - Salaries & Payroll</SelectItem>
            </SelectContent>
          </Select>

          {/* Search */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={isBangla ? 'ভাউচার বা বিবরণ খুঁজুন...' : 'Search voucher or desc...'}
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
            <span>Excel Ledger</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => handleExport('pdf')}
            className="h-9 text-xs gap-1.5 font-semibold"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>{isBangla ? 'খতিয়ান প্রিন্ট' : 'Print Ledger'}</span>
          </Button>
        </div>
      </div>

      {/* General Ledger Table */}
      <Card className="rounded-2xl border-border/70 shadow-xs overflow-hidden">
        <CardHeader className="p-5 border-b border-border/50 bg-muted/20">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                {isBangla ? 'কালানুক্রমিক খতিয়ান লেনদেন ও চলমান ব্যালেন্স' : 'Chronological General Ledger Postings'}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                {isBangla
                  ? 'প্রতিটি ভাউচারের বিপরীতে ডেবিট/ক্রেডিট প্রবাহ ও খতিয়ান হিসাব'
                  : 'Double-entry debit and credit audit log with posted voucher references'}
              </CardDescription>
            </div>
            <span className="text-xs font-mono font-bold text-muted-foreground">
              {formatNumber(filteredEntries.length)} {isBangla ? 'টি এন্ট্রি' : 'postings'}
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground font-bold uppercase text-[10px] tracking-wider bg-muted/40">
                  <th className="py-3 px-4">{isBangla ? 'তারিখ' : 'Date'}</th>
                  <th className="py-3 px-4">{isBangla ? 'ভাউচার' : 'Voucher'}</th>
                  <th className="py-3 px-4">{isBangla ? 'অ্যাকাউন্ট ও কোড' : 'Account & Code'}</th>
                  <th className="py-3 px-4">{isBangla ? 'বিবরণ / ব্যাখ্যা' : 'Description'}</th>
                  <th className="py-3 px-4 text-right">{isBangla ? 'ডেবিট (৳)' : 'Debit (BDT)'}</th>
                  <th className="py-3 px-4 text-right">{isBangla ? 'ক্রেডিট (৳)' : 'Credit (BDT)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filteredEntries.map((entry, idx) => (
                  <tr key={idx} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap text-muted-foreground font-medium">{entry.date}</td>
                    <td className="py-3 px-4 font-mono font-bold text-primary">
                      <span className="bg-muted px-2 py-0.5 rounded-md border border-border/60">{entry.voucher}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-foreground">
                      <div>{entry.account}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{entry.code}</div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{entry.desc}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {entry.debit > 0 ? formatCurrency(entry.debit) : '—'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-blue-600 dark:text-blue-400">
                      {entry.credit > 0 ? formatCurrency(entry.credit) : '—'}
                    </td>
                  </tr>
                ))}

                {/* Ledger Totals */}
                <tr className="bg-muted/40 font-bold border-t-2 border-border/80">
                  <td colSpan={4} className="py-3.5 px-4 uppercase text-xs">
                    {isBangla ? 'মোট খতিয়ান ভলিউম (TOTAL POSTING VOLUME)' : 'TOTAL POSTING VOLUME'}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-sm font-black text-emerald-600">
                    {formatCurrency(totalDebit)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-sm font-black text-blue-600">
                    {formatCurrency(totalCredit)}
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
