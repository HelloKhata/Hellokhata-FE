// Hello Khata OS - Deposit & Withdrawal Report (Inter-Account Fund Movements)
// হ্যালো খাতা - ব্যাংক জমা, নগদ উত্তোলন ও ফান্ড ট্রান্সফার রিপোর্ট

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
  ArrowLeftRight,
  Filter,
  Printer,
  FileSpreadsheet,
  Search,
  Calendar,
  Building2,
  ArrowRight,
  ArrowDownLeft,
  ArrowUpRight,
  Coins,
  TrendingDown,
} from 'lucide-react';
import { toast } from 'sonner';

export default function DepositWithdrawalReportPage() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency, formatNumber } = useCurrency();
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');
  const [searchTerm, setSearchTerm] = useState('');

  const transfers = [
    {
      id: 'tf-1',
      date: '2026-05-05',
      ref: 'CON-003',
      desc: 'Cash deposited to BRAC Bank operating account from counter vault',
      source: 'Counter Vault Desk',
      dest: 'BRAC Bank Operating',
      amount: 120000,
      fee: 0,
      type: 'deposit',
      typeLabel: 'Bank Deposit',
    },
    {
      id: 'tf-2',
      date: '2026-05-04',
      ref: 'CON-002',
      desc: 'ATM branch cash withdrawal for petty cash replenish',
      source: 'City Bank Corporate',
      dest: 'Petty Cash Desk',
      amount: 30000,
      fee: 150,
      type: 'withdrawal',
      typeLabel: 'Cash Withdrawal',
    },
    {
      id: 'tf-3',
      date: '2026-05-02',
      ref: 'CON-001',
      desc: 'Inter-bank online fund transfer via BEFTN/NPSB',
      source: 'BRAC Bank Operating',
      dest: 'Dutch-Bangla Bank',
      amount: 200000,
      fee: 10,
      type: 'transfer',
      typeLabel: 'Fund Transfer',
    },
    {
      id: 'tf-4',
      date: '2026-05-08',
      ref: 'CON-004',
      desc: 'bKash merchant wallet collection cashout to City Bank',
      source: 'bKash Merchant Wallet',
      dest: 'City Bank Corporate',
      amount: 85000,
      fee: 850,
      type: 'transfer',
      typeLabel: 'MFS Settlement',
    },
  ];

  const filteredTransfers = transfers.filter((t) => {
    const matchesSearch =
      t.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.dest.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedType === 'all') return matchesSearch;
    return matchesSearch && t.type === selectedType;
  });

  const totalDeposits = transfers.filter((t) => t.type === 'deposit').reduce((acc, t) => acc + t.amount, 0);
  const totalWithdrawals = transfers.filter((t) => t.type === 'withdrawal').reduce((acc, t) => acc + t.amount, 0);
  const totalTransfers = transfers.filter((t) => t.type === 'transfer').reduce((acc, t) => acc + t.amount, 0);
  const totalFees = transfers.reduce((acc, t) => acc + t.fee, 0);

  const handleExport = (type: string) => {
    toast.success(
      isBangla
        ? `জমা ও উত্তোলন রিপোর্ট ${type.toUpperCase()} এক্সপোর্ট সম্পন্ন হয়েছে!`
        : `Deposit & Withdrawal Report ${type.toUpperCase()} exported successfully!`
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <FinancePageHeader
        pageName="Deposit & Withdrawal Report"
        pageNameBn="ব্যাংক জমা ও উত্তোলন রিপোর্ট (Fund Movements)"
        icon={ArrowLeftRight}
      />

      {/* Top Movement Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-emerald-500/5 border border-emerald-500/20 shadow-xs space-y-1.5">
          <div className="text-xs font-semibold text-muted-foreground">{isBangla ? 'মোট ব্যাংক জমা (Deposits)' : 'Bank Deposits'}</div>
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">{formatCurrency(totalDeposits)}</div>
          <div className="text-[11px] text-muted-foreground">{isBangla ? 'কাউন্টার ক্যাশ ব্যাংক জমা' : 'Inflow into bank accounts'}</div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-rose-500/5 border border-rose-500/20 shadow-xs space-y-1.5">
          <div className="text-xs font-semibold text-muted-foreground">{isBangla ? 'মোট নগদ উত্তোলন (Withdrawals)' : 'Cash Withdrawals'}</div>
          <div className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">{formatCurrency(totalWithdrawals)}</div>
          <div className="text-[11px] text-muted-foreground">{isBangla ? 'পেটি ক্যাশ ও অফিস ব্যয়' : 'Outflow to physical desk'}</div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-cyan-500/5 border border-cyan-500/20 shadow-xs space-y-1.5">
          <div className="text-xs font-semibold text-muted-foreground">{isBangla ? 'ইন্টার-অ্যাকাউন্ট ট্রান্সফার' : 'Account Transfers'}</div>
          <div className="text-2xl font-black font-mono text-cyan-600 dark:text-cyan-400">{formatCurrency(totalTransfers)}</div>
          <div className="text-[11px] text-muted-foreground">{isBangla ? 'ব্যাংক ও ওয়ালেট সেটেলমেন্ট' : 'Inter-account liquidity'}</div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-amber-500/5 border border-amber-500/20 shadow-xs space-y-1.5">
          <div className="text-xs font-semibold text-muted-foreground">{isBangla ? 'মোট চার্জ ও ফি (Fees)' : 'Total Gateway Fees'}</div>
          <div className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">{formatCurrency(totalFees)}</div>
          <div className="text-[11px] text-muted-foreground">{isBangla ? 'এটিএম ও ক্যাশআউট চার্জ' : 'Banking & settlement fees'}</div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-4 rounded-2xl border border-border/70 shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          {/* Movement Type Filter */}
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="h-9 text-xs w-52 bg-background">
              <ArrowLeftRight className="h-3.5 w-3.5 mr-1.5 text-primary" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isBangla ? 'সকল স্থানান্তর (All Types)' : 'All Movement Types'}</SelectItem>
              <SelectItem value="deposit">{isBangla ? 'ব্যাংক জমা (Deposits)' : 'Bank Deposits'}</SelectItem>
              <SelectItem value="withdrawal">{isBangla ? 'নগদ উত্তোলন (Withdrawals)' : 'Cash Withdrawals'}</SelectItem>
              <SelectItem value="transfer">{isBangla ? 'ফান্ড ট্রান্সফার (Transfers)' : 'Internal Transfers'}</SelectItem>
            </SelectContent>
          </Select>

          {/* Search */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={isBangla ? 'উৎস বা গন্তব্য খুঁজুন...' : 'Search source or dest...'}
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
            <span>{isBangla ? 'রিপোর্ট প্রিন্ট' : 'Print Transfer Report'}</span>
          </Button>
        </div>
      </div>

      {/* Transfers Flow Table */}
      <Card className="rounded-2xl border-border/70 shadow-xs overflow-hidden">
        <CardHeader className="p-5 border-b border-border/50 bg-muted/20">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                {isBangla ? 'আন্তঃহিসাব ফান্ড ট্রান্সফার ও চলাচল লগ' : 'Internal Fund Movement Audit Trail'}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                {isBangla ? 'উৎস হিসাব থেকে গন্তব্য হিসাবে টাকার প্রবাহ ও ফি' : 'Source to destination account flow and transaction fees'}
              </CardDescription>
            </div>
            <span className="text-xs font-mono font-bold text-muted-foreground">
              {formatNumber(filteredTransfers.length)} {isBangla ? 'টি এন্ট্রি' : 'transfers'}
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground font-bold uppercase text-[10px] tracking-wider bg-muted/40">
                  <th className="py-3 px-4">{isBangla ? 'তারিখ' : 'Date'}</th>
                  <th className="py-3 px-4">{isBangla ? 'রেফারেন্স' : 'Ref No'}</th>
                  <th className="py-3 px-4">{isBangla ? 'লেনদেনের ধরণ' : 'Type'}</th>
                  <th className="py-3 px-4">{isBangla ? 'উৎস ও গন্তব্য হিসাব' : 'Source → Destination Flow'}</th>
                  <th className="py-3 px-4">{isBangla ? 'বিবরণ' : 'Description'}</th>
                  <th className="py-3 px-4 text-right">{isBangla ? 'ফি (৳)' : 'Fee'}</th>
                  <th className="py-3 px-4 text-right">{isBangla ? 'পরিমাণ (৳)' : 'Amount (BDT)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filteredTransfers.map((tf) => (
                  <tr key={tf.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap text-muted-foreground font-medium">{tf.date}</td>
                    <td className="py-3 px-4 font-mono font-bold text-primary">
                      <span className="bg-muted px-2 py-0.5 rounded-md border border-border/60">{tf.ref}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className={
                          tf.type === 'deposit'
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]'
                            : tf.type === 'withdrawal'
                            ? 'bg-rose-500/10 text-rose-600 border-rose-500/20 text-[10px]'
                            : 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20 text-[10px]'
                        }
                      >
                        {tf.typeLabel}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-medium text-foreground">
                        <span className="text-muted-foreground">{tf.source}</span>
                        <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                        <span className="font-bold text-foreground">{tf.dest}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{tf.desc}</td>
                    <td className="py-3 px-4 text-right font-mono text-muted-foreground">
                      {tf.fee > 0 ? `৳${tf.fee}` : 'Free'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-black text-foreground">
                      {formatCurrency(tf.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
