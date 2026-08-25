// Hello Khata OS - Cash Book Register (Counter & Petty Cash Desk)
// হ্যালো খাতা - নগদান বই (কাউন্টার ও খুচরা ক্যাশ রেজিস্টার)

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
  Wallet,
  Filter,
  Printer,
  FileSpreadsheet,
  Search,
  Calendar,
  Building2,
  Coins,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';

export default function CashBookPage() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency, formatNumber } = useCurrency();
  const [selectedDesk, setSelectedDesk] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');
  const [searchTerm, setSearchTerm] = useState('');

  const cashLogs = [
    { date: '2026-05-01', desc: 'Opening physical vault cash balance', voucher: 'OB-01', desk: 'Vault', receipt: 456800, payment: 0, balance: 456800 },
    { date: '2026-05-02', desc: 'Counter 1 cash sales collection', voucher: 'INV-2048', desk: 'Counter 1', receipt: 42000, payment: 0, balance: 498800 },
    { date: '2026-05-03', desc: 'Office refreshments and client tea snacks', voucher: 'CSH-021', desk: 'Petty Cash', receipt: 0, payment: 1200, balance: 497600 },
    { date: '2026-05-04', desc: 'Stationery and printer receipt paper roll buy', voucher: 'PV-901', desk: 'Petty Cash', receipt: 0, payment: 5000, balance: 492600 },
    { date: '2026-05-05', desc: 'Counter 2 retail sales receipts', voucher: 'INV-2049', desk: 'Counter 2', receipt: 28000, payment: 0, balance: 520600 },
    { date: '2026-05-05', desc: 'Physical cash deposit transfer to BRAC Bank', voucher: 'CON-03', desk: 'Vault', receipt: 0, payment: 60000, balance: 460600 },
    { date: '2026-05-06', desc: 'Walk-in cash sales collection', voucher: 'INV-2050', desk: 'Counter 1', receipt: 18500, payment: 0, balance: 479100 },
  ];

  const filteredLogs = cashLogs.filter((log) => {
    const matchesSearch =
      log.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.voucher.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedDesk === 'all') return matchesSearch;
    return matchesSearch && log.desk.toLowerCase().includes(selectedDesk.toLowerCase());
  });

  const totalReceipts = filteredLogs.reduce((acc, log) => acc + (log.voucher === 'OB-01' ? 0 : log.receipt), 0);
  const totalPayments = filteredLogs.reduce((acc, log) => acc + log.payment, 0);
  const closingCash = filteredLogs.length > 0 ? filteredLogs[filteredLogs.length - 1].balance : 456800;

  const handleExport = (type: string) => {
    toast.success(
      isBangla
        ? `নগদান বই ${type.toUpperCase()} এক্সপোর্ট সম্পন্ন হয়েছে!`
        : `Cash Book ${type.toUpperCase()} exported successfully!`
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <FinancePageHeader
        pageName="Cash Book Register"
        pageNameBn="নগদান বই (Cash Book Register)"
        icon={Wallet}
      />

      {/* Top Cash Vault KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-emerald-500/5 border border-emerald-500/20 shadow-xs space-y-1.5">
          <div className="text-xs font-semibold text-muted-foreground">{isBangla ? 'হাতে নগদ সমাপনী (Cash in Hand)' : 'Cash in Hand (Total)'}</div>
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">{formatCurrency(closingCash)}</div>
          <div className="text-[11px] text-muted-foreground">{isBangla ? 'কাউন্টার ১, ২ ও ভল্ট মিলিয়ে' : 'Physical desk & vault cash'}</div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-blue-500/5 border border-blue-500/20 shadow-xs space-y-1.5">
          <div className="text-xs font-semibold text-muted-foreground">{isBangla ? 'মোট নগদ প্রাপ্তি (Receipts)' : 'Cash Receipts'}</div>
          <div className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400">+{formatCurrency(totalReceipts)}</div>
          <div className="text-[11px] text-muted-foreground">{isBangla ? 'কাউন্টার বিক্রয় কালেকশন' : 'Inflow from cash sales'}</div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-amber-500/5 border border-amber-500/20 shadow-xs space-y-1.5">
          <div className="text-xs font-semibold text-muted-foreground">{isBangla ? 'খুচরা নগদ খরচ (Payments)' : 'Cash Disbursements'}</div>
          <div className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">−{formatCurrency(totalPayments)}</div>
          <div className="text-[11px] text-muted-foreground">{isBangla ? 'পেটি ক্যাশ ও ব্যাংক ডিপোজিট' : 'Petty cash & deposits'}</div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-teal-500/10 border border-teal-500/30 shadow-md space-y-1.5 ring-1 ring-teal-500/20">
          <div className="text-xs font-semibold text-teal-700 dark:text-teal-400 font-bold">{isBangla ? 'ক্যাশ অডিট স্ট্যাটাস' : 'Desk Reconciliation'}</div>
          <div className="text-xl font-bold font-mono text-foreground">Matched 100%</div>
          <div className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold font-mono">Zero Physical Variance</div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-4 rounded-2xl border border-border/70 shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          {/* Desk Selector */}
          <Select value={selectedDesk} onValueChange={setSelectedDesk}>
            <SelectTrigger className="h-9 text-xs w-48 bg-background">
              <Coins className="h-3.5 w-3.5 mr-1.5 text-primary" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isBangla ? 'সকল ক্যাশ ডেস্ক (All Desks)' : 'All Cash Desks'}</SelectItem>
              <SelectItem value="Counter 1">Counter 1 (কাউন্টার ১)</SelectItem>
              <SelectItem value="Counter 2">Counter 2 (কাউন্টার ২)</SelectItem>
              <SelectItem value="Vault">Main Vault (প্রধান ভল্ট)</SelectItem>
              <SelectItem value="Petty Cash">Petty Cash (খুচরা খরচ)</SelectItem>
            </SelectContent>
          </Select>

          {/* Search */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={isBangla ? 'ভাউচার বা বিবরণ...' : 'Search voucher or desc...'}
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
            <span>Excel Sheet</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => handleExport('pdf')}
            className="h-9 text-xs gap-1.5 font-semibold"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>{isBangla ? 'নগদান বই প্রিন্ট' : 'Print Cash Book'}</span>
          </Button>
        </div>
      </div>

      {/* Cash Book Table */}
      <Card className="rounded-2xl border-border/70 shadow-xs overflow-hidden">
        <CardHeader className="p-5 border-b border-border/50 bg-muted/20">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                {isBangla ? 'দৈনিক নগদ জমা ও খরচ রেজিস্টার' : 'Daily Cash Receipt & Payment Ledger'}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                {isBangla ? 'কাউন্টারভিত্তিক প্রাপ্তি, পেটি ক্যাশ ও চলমান ব্যালেন্স' : 'Chronological cash register with verified physical counts'}
              </CardDescription>
            </div>
            <span className="text-xs font-mono font-bold text-muted-foreground">
              {formatNumber(filteredLogs.length)} {isBangla ? 'টি এন্ট্রি' : 'entries'}
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
                  <th className="py-3 px-4">{isBangla ? 'ক্যাশ ডেস্ক' : 'Desk'}</th>
                  <th className="py-3 px-4">{isBangla ? 'বিবরণ' : 'Description'}</th>
                  <th className="py-3 px-4 text-right">{isBangla ? 'নগদ প্রাপ্তি (Inflow)' : 'Receipt (Inflow)'}</th>
                  <th className="py-3 px-4 text-right">{isBangla ? 'নগদ প্রদান (Outflow)' : 'Payment (Outflow)'}</th>
                  <th className="py-3 px-4 text-right">{isBangla ? 'চলমান ক্যাশ (৳)' : 'Balance (BDT)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filteredLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap text-muted-foreground font-medium">{log.date}</td>
                    <td className="py-3 px-4 font-mono font-bold text-primary">
                      <span className="bg-muted px-2 py-0.5 rounded-md border border-border/60">{log.voucher}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-[10px]">
                        {log.desk}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-medium text-foreground">{log.desc}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">
                      {log.receipt > 0 ? `+${formatCurrency(log.receipt)}` : '—'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-rose-600">
                      {log.payment > 0 ? `−${formatCurrency(log.payment)}` : '—'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-black text-foreground">
                      {formatCurrency(log.balance)}
                    </td>
                  </tr>
                ))}

                {/* Cash Summary */}
                <tr className="bg-muted/40 font-bold border-t-2 border-border/80">
                  <td colSpan={4} className="py-3.5 px-4 uppercase text-xs">
                    {isBangla ? 'সর্বমোট প্রাপ্তি ও প্রদান' : 'TOTAL RECEIPTS & DISBURSEMENTS'}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-sm font-black text-emerald-600">
                    +{formatCurrency(totalReceipts)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-sm font-black text-rose-600">
                    −{formatCurrency(totalPayments)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-sm font-black text-teal-600">
                    {formatCurrency(closingCash)}
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
