// Hello Khata OS - Bank Book & Reconciliation Register
// হ্যালো খাতা - ব্যাংক হিসাব বই ও রিকনসিলিয়েশন রেজিস্টার

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
  Landmark,
  Filter,
  Printer,
  FileSpreadsheet,
  Building2,
  Search,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react';
import { toast } from 'sonner';

export default function BankBookPage() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency, formatNumber } = useCurrency();
  const [selectedBank, setSelectedBank] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');
  const [searchTerm, setSearchTerm] = useState('');

  const bankAccounts = [
    { id: 'brac', name: 'BRAC Bank Operating', accountNo: '1501-2049-1829', branch: 'Gulshan Branch', balance: 742500 },
    { id: 'city', name: 'City Bank Corporate Desk', accountNo: '1108-3921-9921', branch: 'Principal Branch', balance: 345000 },
    { id: 'dbbl', name: 'Dutch-Bangla Bank', accountNo: '102-120-84920', branch: 'Banani Branch', balance: 200000 },
  ];

  const bankTransactions = [
    { date: '2026-05-01', bankId: 'brac', bankName: 'BRAC Bank', ref: 'OB-001', chequeNo: '—', desc: 'Opening bank operating balance', type: 'deposit', amount: 850000, status: 'cleared', balance: 850000 },
    { date: '2026-05-03', bankId: 'brac', bankName: 'BRAC Bank', ref: 'CQ-901', chequeNo: 'CHQ-849201', desc: 'Salary Payroll bank wire disbursement', type: 'withdrawal', amount: 500000, status: 'cleared', balance: 350000 },
    { date: '2026-05-04', bankId: 'dbbl', bankName: 'Dutch-Bangla', ref: 'CQ-902', chequeNo: 'CHQ-192840', desc: 'Office Rental cheque payout', type: 'withdrawal', amount: 45000, status: 'cleared', balance: 155000 },
    { date: '2026-05-05', bankId: 'brac', bankName: 'BRAC Bank', ref: 'FT-005', chequeNo: '—', desc: 'Counter cash vault deposit', type: 'deposit', amount: 120000, status: 'cleared', balance: 470000 },
    { date: '2026-05-06', bankId: 'city', bankName: 'City Bank', ref: 'RV-3012', chequeNo: 'NPSB-48192', desc: 'Customer invoice wire payment from ABC Traders', type: 'deposit', amount: 345000, status: 'cleared', balance: 345000 },
    { date: '2026-05-12', bankId: 'brac', bankName: 'BRAC Bank', ref: 'CQ-904', chequeNo: 'CHQ-849204', desc: 'Supplier bill payment to Square Pharma', type: 'withdrawal', amount: 85000, status: 'in_clearing', balance: 385000 },
  ];

  const filteredTransactions = bankTransactions.filter((tx) => {
    const matchesSearch =
      tx.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.chequeNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.bankName.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedBank === 'all') return matchesSearch;
    return matchesSearch && tx.bankId === selectedBank;
  });

  const totalDeposits = filteredTransactions.filter((t) => t.type === 'deposit').reduce((acc, t) => acc + (t.ref === 'OB-001' ? 0 : t.amount), 0);
  const totalWithdrawals = filteredTransactions.filter((t) => t.type === 'withdrawal').reduce((acc, t) => acc + t.amount, 0);
  const totalBankBalance = bankAccounts.reduce((acc, b) => acc + b.balance, 0);

  const handleExport = (type: string) => {
    toast.success(
      isBangla
        ? `ব্যাংক বই ${type.toUpperCase()} এক্সপোর্ট সম্পন্ন হয়েছে!`
        : `Bank Book ${type.toUpperCase()} exported successfully!`
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <FinancePageHeader
        pageName="Bank Book & Reconciliation"
        pageNameBn="ব্যাংক হিসাব বই (Bank Book & Reconciliation)"
        icon={Landmark}
      />

      {/* Top Multi-Bank Balances KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-blue-500/5 border border-blue-500/20 shadow-xs space-y-1.5">
          <div className="text-xs font-semibold text-muted-foreground">{isBangla ? 'সর্বমোট ব্যাংক তারল্য' : 'Total Bank Liquidity'}</div>
          <div className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400">{formatCurrency(totalBankBalance)}</div>
          <div className="text-[11px] text-muted-foreground">{isBangla ? '৩টি সক্রিয় কর্পোরেট অ্যাকাউন্টে' : 'Across 3 corporate accounts'}</div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-emerald-500/5 border border-emerald-500/20 shadow-xs space-y-1.5">
          <div className="text-xs font-semibold text-muted-foreground">{isBangla ? 'মোট ব্যাংক জমা (Deposits)' : 'Total Deposits'}</div>
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">+{formatCurrency(totalDeposits)}</div>
          <div className="text-[11px] text-muted-foreground">{isBangla ? 'ওয়্যার, ক্যাশ ও এনপিএসবি জমা' : 'Wire, cash & transfer inflows'}</div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-rose-500/5 border border-rose-500/20 shadow-xs space-y-1.5">
          <div className="text-xs font-semibold text-muted-foreground">{isBangla ? 'মোট চেক উত্তোলন (Withdrawals)' : 'Total Withdrawals'}</div>
          <div className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">−{formatCurrency(totalWithdrawals)}</div>
          <div className="text-[11px] text-muted-foreground">{isBangla ? 'স্যালারি ও সাপ্লায়ার পেমেন্ট' : 'Salary & supplier payouts'}</div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-teal-500/10 border border-teal-500/30 shadow-md space-y-1.5 ring-1 ring-teal-500/20">
          <div className="text-xs font-semibold text-teal-700 dark:text-teal-400 font-bold">{isBangla ? 'চেক ক্লিয়ারিং স্ট্যাটাস' : 'Cheque Clearance'}</div>
          <div className="text-xl font-bold font-mono text-foreground">1 In-Clearing</div>
          <div className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold font-mono">BACPS Real-Time</div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-4 rounded-2xl border border-border/70 shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          {/* Bank Selector */}
          <Select value={selectedBank} onValueChange={setSelectedBank}>
            <SelectTrigger className="h-9 text-xs w-56 bg-background">
              <Building2 className="h-3.5 w-3.5 mr-1.5 text-primary" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isBangla ? 'সকল ব্যাংক অ্যাকাউন্ট (All Banks)' : 'All Bank Accounts'}</SelectItem>
              {bankAccounts.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name} ({b.accountNo})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={isBangla ? 'চেক নং বা বিবরণ খুঁজুন...' : 'Search cheque or desc...'}
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
            <span>{isBangla ? 'ব্যাংক বই প্রিন্ট' : 'Print Bank Book'}</span>
          </Button>
        </div>
      </div>

      {/* Bank Transactions Table */}
      <Card className="rounded-2xl border-border/70 shadow-xs overflow-hidden">
        <CardHeader className="p-5 border-b border-border/50 bg-muted/20">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                {isBangla ? 'ব্যাংক লেনদেন ও ক্লিয়ারিং রেজিস্টার' : 'Bank Transaction & Clearance Register'}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                {isBangla ? 'চেক নং, ডিপোজিট স্লিপ ও রিকনসিলিয়েশন স্ট্যাটাস' : 'Bank deposits, cheque clearing logs, and BACPS reconciliation'}
              </CardDescription>
            </div>
            <span className="text-xs font-mono font-bold text-muted-foreground">
              {formatNumber(filteredTransactions.length)} {isBangla ? 'টি লেনদেন' : 'transactions'}
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground font-bold uppercase text-[10px] tracking-wider bg-muted/40">
                  <th className="py-3 px-4">{isBangla ? 'তারিখ' : 'Date'}</th>
                  <th className="py-3 px-4">{isBangla ? 'ব্যাংক' : 'Bank'}</th>
                  <th className="py-3 px-4">{isBangla ? 'চেক / রেফারেন্স' : 'Cheque / Ref'}</th>
                  <th className="py-3 px-4">{isBangla ? 'বিবরণ' : 'Description'}</th>
                  <th className="py-3 px-4 text-right">{isBangla ? 'জমা (Deposit)' : 'Deposit'}</th>
                  <th className="py-3 px-4 text-right">{isBangla ? 'উত্তোলন (Withdraw)' : 'Withdrawal'}</th>
                  <th className="py-3 px-4 text-center">{isBangla ? 'ক্লিয়ারিং' : 'Status'}</th>
                  <th className="py-3 px-4 text-right">{isBangla ? 'ব্যালেন্স (৳)' : 'Balance (BDT)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filteredTransactions.map((tx, idx) => (
                  <tr key={idx} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap text-muted-foreground font-medium">{tx.date}</td>
                    <td className="py-3 px-4 font-semibold text-foreground">{tx.bankName}</td>
                    <td className="py-3 px-4 font-mono font-bold text-primary">
                      <span className="bg-muted px-2 py-0.5 rounded-md border border-border/60">{tx.chequeNo !== '—' ? tx.chequeNo : tx.ref}</span>
                    </td>
                    <td className="py-3 px-4 text-foreground">{tx.desc}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">
                      {tx.type === 'deposit' ? `+${formatCurrency(tx.amount)}` : '—'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-rose-600">
                      {tx.type === 'withdrawal' ? `−${formatCurrency(tx.amount)}` : '—'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {tx.status === 'cleared' ? (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          Cleared
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          In-Clearing
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-black text-foreground">
                      {formatCurrency(tx.balance)}
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
