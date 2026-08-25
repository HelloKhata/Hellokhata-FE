// Hello Khata OS - MFS Digital Wallet Statement (bKash / Nagad / Rocket)
// হ্যালো খাতা - এমএফএস ওয়ালেট স্টেটমেন্ট (বিকাশ, নগদ ও রকেট মার্চেন্ট কালেকশন)

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
  Coins,
  Filter,
  Printer,
  FileSpreadsheet,
  Search,
  Calendar,
  Building2,
  Smartphone,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';

export default function WalletStatementPage() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency, formatNumber } = useCurrency();
  const [selectedWallet, setSelectedWallet] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');
  const [searchTerm, setSearchTerm] = useState('');

  const wallets = [
    { id: 'bkash', name: 'bKash Merchant', number: '01792-882991', balance: 55000, color: 'text-pink-600', bg: 'bg-pink-500/10' },
    { id: 'nagad', name: 'Nagad Business', number: '01821-229202', balance: 30000, color: 'text-orange-600', bg: 'bg-orange-500/10' },
  ];

  const walletStatements = [
    { date: '2026-05-01', wallet: 'bKash', trxId: 'TRX-90218219', customer: 'ABC Traders', desc: 'Customer QR digital invoice payment', cashIn: 45000, cashOut: 0, fee: 0, balance: 45000 },
    { date: '2026-05-02', wallet: 'bKash', trxId: 'TRX-90223910', customer: 'Retail POS', desc: 'Counter QR code collection', cashIn: 15000, cashOut: 0, fee: 0, balance: 60000 },
    { date: '2026-05-04', wallet: 'bKash', trxId: 'TRX-90248201', customer: 'RedX Delivery', desc: 'Merchant payment to delivery partner', cashIn: 0, cashOut: 12500, fee: 125, balance: 47375 },
    { date: '2026-05-05', wallet: 'nagad', trxId: 'TRX-88210921', customer: 'Walk-in POS', desc: 'Nagad merchant direct payment', cashIn: 25000, cashOut: 0, fee: 0, balance: 25000 },
    { date: '2026-05-06', wallet: 'nagad', trxId: 'TRX-88249018', customer: 'Rahim Store', desc: 'Customer digital QR payment receipt', cashIn: 8500, cashOut: 0, fee: 0, balance: 33500 },
    { date: '2026-05-08', wallet: 'bKash', trxId: 'TRX-90299104', customer: 'City Bank', desc: 'Merchant collection cashout settlement to Bank', cashIn: 0, cashOut: 20000, fee: 200, balance: 27175 },
  ];

  const filteredStatements = walletStatements.filter((s) => {
    const matchesSearch =
      s.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.trxId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customer.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedWallet === 'all') return matchesSearch;
    return matchesSearch && s.wallet.toLowerCase() === selectedWallet.toLowerCase();
  });

  const totalCashIn = filteredStatements.reduce((acc, s) => acc + s.cashIn, 0);
  const totalCashOut = filteredStatements.reduce((acc, s) => acc + s.cashOut, 0);
  const totalMfsBalance = wallets.reduce((acc, w) => acc + w.balance, 0);

  const handleExport = (type: string) => {
    toast.success(
      isBangla
        ? `ওয়ালেট স্টেটমেন্ট ${type.toUpperCase()} এক্সপোর্ট সম্পন্ন হয়েছে!`
        : `Wallet Statement ${type.toUpperCase()} exported successfully!`
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <FinancePageHeader
        pageName="MFS Wallet Statement"
        pageNameBn="এমএফএস ওয়ালেট স্টেটমেন্ট (bKash & Nagad)"
        icon={Coins}
      />

      {/* Top MFS Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-pink-500/5 border border-pink-500/20 shadow-xs space-y-1.5">
          <div className="text-xs font-semibold text-muted-foreground">{isBangla ? 'সর্বমোট এমএফএস ব্যালেন্স' : 'Total MFS Balance'}</div>
          <div className="text-2xl font-black font-mono text-foreground">{formatCurrency(totalMfsBalance)}</div>
          <div className="text-[11px] text-muted-foreground">{isBangla ? 'বিকাশ ও নগদ মার্চেন্ট ওয়ালেট' : 'bKash & Nagad balances'}</div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-emerald-500/5 border border-emerald-500/20 shadow-xs space-y-1.5">
          <div className="text-xs font-semibold text-muted-foreground">{isBangla ? 'মোট কিউআর কালেকশন' : 'Digital QR Collections'}</div>
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">+{formatCurrency(totalCashIn)}</div>
          <div className="text-[11px] text-muted-foreground">{isBangla ? 'গ্রাহক পেমেন্ট প্রাপ্তি' : 'Customer digital payments'}</div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-amber-500/5 border border-amber-500/20 shadow-xs space-y-1.5">
          <div className="text-xs font-semibold text-muted-foreground">{isBangla ? 'ব্যাংক সেটেলমেন্ট ও ক্যাশআউট' : 'Settlements & Payouts'}</div>
          <div className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">−{formatCurrency(totalCashOut)}</div>
          <div className="text-[11px] text-muted-foreground">{isBangla ? 'ব্যাংক ও ভেন্ডর পরিশোধ' : 'Vendor & bank transfers'}</div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-teal-500/10 border border-teal-500/30 shadow-md space-y-1.5 ring-1 ring-teal-500/20">
          <div className="text-xs font-semibold text-teal-700 dark:text-teal-400 font-bold">{isBangla ? 'ওয়ালেট স্ট্যাটাস' : 'MFS Gateway Status'}</div>
          <div className="text-xl font-bold font-mono text-foreground">API Active</div>
          <div className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold font-mono">Auto Bank Settlement</div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-4 rounded-2xl border border-border/70 shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          {/* Wallet Selector */}
          <Select value={selectedWallet} onValueChange={setSelectedWallet}>
            <SelectTrigger className="h-9 text-xs w-52 bg-background">
              <Smartphone className="h-3.5 w-3.5 mr-1.5 text-primary" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isBangla ? 'সকল ওয়ালেট (All Wallets)' : 'All Digital Wallets'}</SelectItem>
              <SelectItem value="bkash">bKash Merchant (01792-882991)</SelectItem>
              <SelectItem value="nagad">Nagad Business (01821-229202)</SelectItem>
            </SelectContent>
          </Select>

          {/* Search */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={isBangla ? 'TrxID বা গ্রাহক খুঁজুন...' : 'Search TrxID or desc...'}
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
            <span>{isBangla ? 'ওয়ালেট প্রিন্ট' : 'Print Statement'}</span>
          </Button>
        </div>
      </div>

      {/* Wallet Statement Table */}
      <Card className="rounded-2xl border-border/70 shadow-xs overflow-hidden">
        <CardHeader className="p-5 border-b border-border/50 bg-muted/20">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                {isBangla ? 'এমএফএস পেমেন্ট ও সেটেলমেন্ট অডিট লগ' : 'MFS Payment & Settlement Audit Log'}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                {isBangla ? 'বিকাশ ও নগদ মার্চেন্ট ট্রানজ্যাকশন আইডি ও ব্যালেন্স' : 'Gateway TrxIDs, merchant fee deductions, and running balances'}
              </CardDescription>
            </div>
            <span className="text-xs font-mono font-bold text-muted-foreground">
              {formatNumber(filteredStatements.length)} {isBangla ? 'টি লেনদেন' : 'transactions'}
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground font-bold uppercase text-[10px] tracking-wider bg-muted/40">
                  <th className="py-3 px-4">{isBangla ? 'তারিখ' : 'Date'}</th>
                  <th className="py-3 px-4">{isBangla ? 'ওয়ালেট' : 'Wallet'}</th>
                  <th className="py-3 px-4">{isBangla ? 'ট্রানজ্যাকশন আইডি (TrxID)' : 'TrxID / Ref'}</th>
                  <th className="py-3 px-4">{isBangla ? 'গ্রাহক / পার্টি' : 'Customer / Party'}</th>
                  <th className="py-3 px-4">{isBangla ? 'বিবরণ' : 'Description'}</th>
                  <th className="py-3 px-4 text-right">{isBangla ? 'কালেকশন (৳)' : 'Collection (৳)'}</th>
                  <th className="py-3 px-4 text-right">{isBangla ? 'ক্যাশআউট / পে (৳)' : 'Payout (৳)'}</th>
                  <th className="py-3 px-4 text-right">{isBangla ? 'ব্যালেন্স (৳)' : 'Balance (BDT)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filteredStatements.map((s, idx) => (
                  <tr key={idx} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap text-muted-foreground font-medium">{s.date}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                          s.wallet === 'bKash'
                            ? 'bg-pink-500/10 text-pink-600 border-pink-500/20'
                            : 'bg-orange-500/10 text-orange-600 border-orange-500/20'
                        }`}
                      >
                        {s.wallet}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-primary">{s.trxId}</td>
                    <td className="py-3 px-4 font-semibold text-foreground">{s.customer}</td>
                    <td className="py-3 px-4 text-muted-foreground">{s.desc}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">
                      {s.cashIn > 0 ? `+${formatCurrency(s.cashIn)}` : '—'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-rose-600">
                      {s.cashOut > 0 ? `−${formatCurrency(s.cashOut)}` : '—'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-black text-foreground">
                      {formatCurrency(s.balance)}
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
