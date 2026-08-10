'use client';

import React, { useState } from 'react';
import { FinancePageHeader } from '@/components/finance/FinancePageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import {
  ArrowLeftRight,
  Filter,
  Plus,
  Coins,
  Building2,
  Wallet,
  Landmark,
  Trash2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface TransferRecord {
  id: string;
  date: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  typeBn: string;
  desc: string;
  descBn: string;
  source: string;
  sourceBn: string;
  dest: string;
  destBn: string;
  amount: number;
  fee: number;
  branch: string;
}

export default function DepositWithdrawalPage() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();

  // State Management: Account Balances
  const [balances, setBalances] = useState({
    cashBox: 456800,
    dbblBank: 1287500,
    sonaliBank: 60000,
    bkashWallet: 85000,
  });

  // State Management: Fund Transfers List
  const [transfers, setTransfers] = useState<TransferRecord[]>([
    {
      id: 'CON-003',
      date: '2026-08-05',
      type: 'deposit',
      typeBn: 'জমা (Deposit)',
      desc: 'Cash deposited to Sonali Bank operating account',
      descBn: 'সোনালী ব্যাংক অপারেটিং হিসাবে নগদ অর্থ জমা করা হয়েছে',
      source: 'cashBox',
      sourceBn: 'নগদ ক্যাশ বক্স',
      dest: 'sonaliBank',
      destBn: 'সোনালী ব্যাংক (Sonali Bank)',
      amount: 60000,
      fee: 0,
      branch: 'Dhaka',
    },
    {
      id: 'CON-002',
      date: '2026-08-04',
      type: 'withdrawal',
      typeBn: 'উত্তোলন (Withdrawal)',
      desc: 'ATM Cash Withdrawal for counter cash vault',
      descBn: 'কাউন্টার নগদ ভল্টের জন্য এটিএম ক্যাশ উত্তোলন করা হয়েছে',
      source: 'dbblBank',
      sourceBn: 'ডাচ-বাংলা ব্যাংক (DBBL)',
      dest: 'cashBox',
      destBn: 'নগদ ক্যাশ বক্স',
      amount: 30000,
      fee: 150,
      branch: 'Dhaka',
    },
    {
      id: 'CON-001',
      date: '2026-08-02',
      type: 'transfer',
      typeBn: 'স্থানান্তর (Transfer)',
      desc: 'Transfer to bKash Merchant Wallet',
      descBn: 'প্রধান ব্যাংক হিসাব থেকে বিকাশ মার্চেন্ট ওয়ালেটে স্থানান্তর',
      source: 'dbblBank',
      sourceBn: 'ডাচ-বাংলা ব্যাংক (DBBL)',
      dest: 'bkashWallet',
      destBn: 'বিকাশ ওয়ালেট (bKash)',
      amount: 15000,
      fee: 225,
      branch: 'Chittagong',
    },
  ]);

  // Form Fields
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [formType, setFormType] = useState<'deposit' | 'withdrawal' | 'transfer'>('deposit');
  const [formSource, setFormSource] = useState<keyof typeof balances>('cashBox');
  const [formDest, setFormDest] = useState<keyof typeof balances>('dbblBank');
  const [formAmount, setFormAmount] = useState('');
  const [formFee, setFormFee] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Account Names helper
  const accountLabels: Record<keyof typeof balances, { en: string; bn: string }> = {
    cashBox: { en: 'Cash Box / Vault', bn: 'নগদ ক্যাশ বক্স / ভল্ট' },
    dbblBank: { en: 'Dutch-Bangla Bank (DBBL)', bn: 'ডাচ-বাংলা ব্যাংক (DBBL)' },
    sonaliBank: { en: 'Sonali Bank PLC', bn: 'সোনালী ব্যাংক পিএলসি' },
    bkashWallet: { en: 'bKash Merchant Wallet', bn: 'বিকাশ মার্চেন্ট ওয়ালেট' },
  };

  const handleTypeChange = (type: 'deposit' | 'withdrawal' | 'transfer') => {
    setFormType(type);
    if (type === 'deposit') {
      setFormSource('cashBox');
      setFormDest('dbblBank');
    } else if (type === 'withdrawal') {
      setFormSource('dbblBank');
      setFormDest('cashBox');
    } else {
      setFormSource('dbblBank');
      setFormDest('bkashWallet');
    }
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleRecordTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (formSource === formDest) {
      setErrorMsg(isBangla ? 'উৎস এবং গন্তব্য হিসাব একই হতে পারে না!' : 'Source and destination accounts cannot be the same!');
      return;
    }

    const amountNum = parseFloat(formAmount) || 0;
    const feeNum = parseFloat(formFee) || 0;
    const totalDeduction = amountNum + feeNum;

    if (amountNum <= 0) {
      setErrorMsg(isBangla ? 'অনুগ্রহ করে সঠিক পরিমাণ লিখুন।' : 'Please enter a valid amount.');
      return;
    }

    if (balances[formSource] < totalDeduction) {
      setErrorMsg(
        isBangla
          ? `অপর্যাপ্ত ব্যালেন্স! উৎস হিসাবে সর্বোচ্চ ${formatCurrency(balances[formSource])} আছে (ফি সহ)।`
          : `Insufficient funds! Source account only has ${formatCurrency(balances[formSource])} available (including fees).`
      );
      return;
    }

    // Deduct from source and add to destination
    setBalances((prev) => ({
      ...prev,
      [formSource]: prev[formSource] - totalDeduction,
      [formDest]: prev[formDest] + amountNum,
    }));

    // Generate reference code
    const newRef = `CON-${(transfers.length + 1).toString().padStart(3, '0')}`;

    const newTransfer: TransferRecord = {
      id: newRef,
      date: new Date().toISOString().split('T')[0],
      type: formType,
      typeBn: isBangla ? (formType === 'deposit' ? 'জমা' : formType === 'withdrawal' ? 'উত্তোলন' : 'স্থানান্তর') : formType,
      desc: formDesc || `Contra fund transfer from ${accountLabels[formSource].en} to ${accountLabels[formDest].en}`,
      descBn: formDesc || `${accountLabels[formSource].bn} থেকে ${accountLabels[formDest].bn}-এ ফান্ড স্থানান্তর`,
      source: formSource,
      sourceBn: accountLabels[formSource].bn,
      dest: formDest,
      destBn: accountLabels[formDest].bn,
      amount: amountNum,
      fee: feeNum,
      branch: 'Dhaka',
    };

    setTransfers([newTransfer, ...transfers]);
    setSuccessMsg(isBangla ? 'তহবিল কনট্রা স্থানান্তর সফলভাবে সম্পন্ন হয়েছে!' : 'Fund contra transfer processed successfully!');

    // Reset Form
    setFormAmount('');
    setFormFee('');
    setFormDesc('');
  };

  const handleDeleteTransfer = (record: TransferRecord) => {
    // Reverse balances
    const sourceAcc = record.source as keyof typeof balances;
    const destAcc = record.dest as keyof typeof balances;

    setBalances((prev) => ({
      ...prev,
      [sourceAcc]: prev[sourceAcc] + record.amount + record.fee,
      [destAcc]: prev[destAcc] - record.amount,
    }));

    setTransfers(transfers.filter((t) => t.id !== record.id));
    setSuccessMsg(isBangla ? 'লেনদেন সফলভাবে বাতিল করা হয়েছে এবং ফান্ড রিভার্স করা হয়েছে।' : 'Transaction deleted and fund balances reversed successfully.');
  };

  // Filter logic
  const filteredTransfers = transfers.filter((t) => {
    const matchesBranch = selectedBranch === 'all' || t.branch.toLowerCase() === selectedBranch.toLowerCase();
    return matchesBranch;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <FinancePageHeader
        pageName="Deposit & Withdrawal (Contra)"
        pageNameBn="জমা ও উত্তোলন (কনট্রা)"
        description="Record internal fund transfers between cash tills, bank ledgers, and digital wallets."
        descriptionBn="ক্যাশ বক্স, ব্যাংক অপারেটিং লেজার এবং ডিজিটাল ওয়ালেটের মধ্যে অভ্যন্তরীণ তহবিল স্থানান্তর পরিচালনা করুন।"
        icon={ArrowLeftRight}
      />

      {/* 2. Account Balances Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-gradient-to-br from-card to-emerald-500/[0.01]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">{isBangla ? 'নগদ ক্যাশ অন হ্যান্ড' : 'Cash Box (Vault)'}</p>
              <h3 className="text-xl font-bold text-foreground mt-1 font-mono">{formatCurrency(balances.cashBox)}</h3>
            </div>
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Coins className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-card to-indigo-500/[0.01]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">{isBangla ? 'ডাচ-বাংলা ব্যাংক (DBBL)' : 'Dutch-Bangla Bank'}</p>
              <h3 className="text-xl font-bold text-foreground mt-1 font-mono">{formatCurrency(balances.dbblBank)}</h3>
            </div>
            <div className="h-9 w-9 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <Landmark className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-card to-indigo-500/[0.01]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">{isBangla ? 'সোনালী ব্যাংক' : 'Sonali Bank PLC'}</p>
              <h3 className="text-xl font-bold text-foreground mt-1 font-mono">{formatCurrency(balances.sonaliBank)}</h3>
            </div>
            <div className="h-9 w-9 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <Building2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-card to-amber-500/[0.01]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">{isBangla ? 'বিকাশ ওয়ালেট' : 'bKash Merchant'}</p>
              <h3 className="text-xl font-bold text-foreground mt-1 font-mono">{formatCurrency(balances.bkashWallet)}</h3>
            </div>
            <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Wallet className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Logger Form */}
        <Card className="border-border/50 h-fit">
          <CardHeader className="pb-3 border-b border-border/30 bg-muted/10">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Plus className="h-4.5 w-4.5 text-primary" />
              <span>{isBangla ? 'স্থানান্তর রেকর্ড করুন' : 'Record Contra Transfer'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <form onSubmit={handleRecordTransfer} className="space-y-4">
              
              {/* Transfer Type Tab Selectors */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-muted rounded-xl text-center text-xs">
                <button
                  type="button"
                  onClick={() => handleTypeChange('deposit')}
                  className={cn(
                    'py-1.5 px-2 rounded-lg font-semibold transition-all',
                    formType === 'deposit' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {isBangla ? 'জমা (Deposit)' : 'Deposit'}
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('withdrawal')}
                  className={cn(
                    'py-1.5 px-2 rounded-lg font-semibold transition-all',
                    formType === 'withdrawal' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {isBangla ? 'উত্তোলন' : 'Withdrawal'}
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('transfer')}
                  className={cn(
                    'py-1.5 px-2 rounded-lg font-semibold transition-all',
                    formType === 'transfer' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {isBangla ? 'স্থানান্তর' : 'Transfer'}
                </button>
              </div>

              {/* Status Messages */}
              {errorMsg && (
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg flex items-start gap-2 text-xs font-semibold">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-500 rounded-lg flex items-start gap-2 text-xs font-semibold">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Source Account (From) */}
              <div className="space-y-1.5 text-xs">
                <label className="font-semibold text-muted-foreground">
                  {isBangla ? 'উৎস হিসাব (From Source)' : 'Source Account (From)'}
                </label>
                <select
                  value={formSource}
                  onChange={(e) => setFormSource(e.target.value as any)}
                  className="w-full h-9 rounded-lg border bg-background px-3 text-xs focus:outline-none"
                >
                  {Object.keys(balances).map((accKey) => (
                    <option key={accKey} value={accKey}>
                      {isBangla ? accountLabels[accKey as keyof typeof balances].bn : accountLabels[accKey as keyof typeof balances].en} ({formatCurrency(balances[accKey as keyof typeof balances])})
                    </option>
                  ))}
                </select>
              </div>

              {/* Destination Account (To) */}
              <div className="space-y-1.5 text-xs">
                <label className="font-semibold text-muted-foreground">
                  {isBangla ? 'গন্তব্য হিসাব (To Destination)' : 'Destination Account (To)'}
                </label>
                <select
                  value={formDest}
                  onChange={(e) => setFormDest(e.target.value as any)}
                  className="w-full h-9 rounded-lg border bg-background px-3 text-xs focus:outline-none"
                >
                  {Object.keys(balances).map((accKey) => (
                    <option key={accKey} value={accKey}>
                      {isBangla ? accountLabels[accKey as keyof typeof balances].bn : accountLabels[accKey as keyof typeof balances].en} ({formatCurrency(balances[accKey as keyof typeof balances])})
                    </option>
                  ))}
                </select>
              </div>

              {/* Grid: Amount & Fees */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">{isBangla ? 'পরিমাণ (টাকা)' : 'Transfer Amount'}</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    required
                    className="h-9 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">{isBangla ? 'সার্ভিস চার্জ / ফি' : 'Service Fee/Charges'}</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={formFee}
                    onChange={(e) => setFormFee(e.target.value)}
                    className="h-9 font-mono"
                  />
                </div>
              </div>

              {/* Description Narration */}
              <div className="space-y-1.5 text-xs">
                <label className="font-semibold text-muted-foreground">{isBangla ? 'স্থানান্তর বিবরণ (Memo)' : 'Narration / Description'}</label>
                <Input
                  placeholder={isBangla ? 'স্থানান্তরের কারণ বা বিবরণী...' : 'Write transfer details...'}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="h-9"
                />
              </div>

              <Button type="submit" className="w-full text-xs h-9">
                {isBangla ? 'স্থানান্তর নিশ্চিত করুন' : 'Confirm Fund Transfer'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Right Side: Log list registry */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between bg-card p-3 rounded-xl border border-border/50 shadow-sm">
            <div className="flex items-center gap-2 text-xs">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold text-muted-foreground">{isBangla ? 'ফিল্টার:' : 'Branch Filter:'}</span>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="h-8 rounded-lg border bg-background px-3 text-xs focus:outline-none"
              >
                <option value="all">{isBangla ? 'সব শাখা' : 'All Branches'}</option>
                <option value="dhaka">{isBangla ? 'ঢাকা শাখা' : 'Dhaka'}</option>
                <option value="chittagong">{isBangla ? 'চট্টগ্রাম শাখা' : 'Chittagong'}</option>
              </select>
            </div>
          </div>

          <Card className="border-border/50 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted/40 border-b border-border/30 font-bold text-muted-foreground">
                    <th className="p-3">{isBangla ? 'তারিখ' : 'Date'}</th>
                    <th className="p-3">{isBangla ? 'রেফারেন্স' : 'Ref Code'}</th>
                    <th className="p-3">{isBangla ? 'উৎস (From)' : 'Source'}</th>
                    <th className="p-3">{isBangla ? 'গন্তব্য (To)' : 'Destination'}</th>
                    <th className="p-3 text-right">{isBangla ? 'ফি' : 'Fee'}</th>
                    <th className="p-3 text-right">{isBangla ? 'পরিমাণ' : 'Amount'}</th>
                    <th className="p-3 text-center">{isBangla ? 'অ্যাকশন' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                  {filteredTransfers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-muted-foreground font-semibold">
                        {isBangla ? 'কোনো কনট্রা স্থানান্তর এন্ট্রি পাওয়া যায়নি।' : 'No contra transfer logs recorded.'}
                      </td>
                    </tr>
                  ) : (
                    filteredTransfers.map((t) => (
                      <tr key={t.id} className="hover:bg-muted/5">
                        <td className="p-3 font-mono text-muted-foreground">{t.date}</td>
                        <td className="p-3 font-mono font-bold text-primary">{t.id}</td>
                        <td className="p-3 font-semibold text-rose-600 dark:text-rose-400">
                          {isBangla ? accountLabels[t.source as keyof typeof balances]?.bn : accountLabels[t.source as keyof typeof balances]?.en}
                        </td>
                        <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">
                          {isBangla ? accountLabels[t.dest as keyof typeof balances]?.bn : accountLabels[t.dest as keyof typeof balances]?.en}
                        </td>
                        <td className="p-3 text-right font-mono text-muted-foreground">
                          {t.fee > 0 ? formatCurrency(t.fee) : '—'}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-foreground">
                          {formatCurrency(t.amount)}
                        </td>
                        <td className="p-3 text-center">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDeleteTransfer(t)}
                            className="h-7 w-7 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
