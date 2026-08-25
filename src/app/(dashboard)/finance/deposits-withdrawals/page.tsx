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
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Coins,
  Building2,
  Wallet,
  Landmark,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Search,
} from 'lucide-react';

interface TransactionRecord {
  id: string;
  date: string;
  type: 'deposit' | 'withdrawal';
  typeBn: string;
  desc: string;
  descBn: string;
  account: string;
  accountBn: string;
  amount: number;
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

  // State Management: Transactions List
  const [transactions, setTransactions] = useState<TransactionRecord[]>([
    {
      id: 'TXN-003',
      date: '2026-08-05',
      type: 'deposit',
      typeBn: 'জমা (Deposit)',
      desc: 'Owner capital cash deposit into Sonali Bank',
      descBn: 'সোনালী ব্যাংক হিসাবে মালিকের মূলধন নগদ জমা',
      account: 'sonaliBank',
      accountBn: 'সোনালী ব্যাংক পিএলসি',
      amount: 60000,
      branch: 'Dhaka',
    },
    {
      id: 'TXN-002',
      date: '2026-08-04',
      type: 'withdrawal',
      typeBn: 'উত্তোলন (Withdrawal)',
      desc: 'ATM Cash Withdrawal for counter cash vault',
      descBn: 'কাউন্টার নগদ ভল্টের জন্য এটিএম ক্যাশ উত্তোলন',
      account: 'dbblBank',
      accountBn: 'ডাচ-বাংলা ব্যাংক (DBBL)',
      amount: 30000,
      branch: 'Dhaka',
    },
    {
      id: 'TXN-001',
      date: '2026-08-02',
      type: 'deposit',
      typeBn: 'জমা (Deposit)',
      desc: 'Direct client deposit to DBBL account',
      descBn: 'ডিবিবিএল ব্যাংক অ্যাকাউন্টে সরাসরি গ্রাহক জমা',
      account: 'dbblBank',
      accountBn: 'ডাচ-বাংলা ব্যাংক (DBBL)',
      amount: 150000,
      branch: 'Dhaka',
    },
  ]);

  // Form Fields
  const [formType, setFormType] = useState<'deposit' | 'withdrawal'>('deposit');
  const [formAccount, setFormAccount] = useState<keyof typeof balances>('dbblBank');
  const [formAmount, setFormAmount] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'deposit' | 'withdrawal'>('all');
  const [filterAccount, setFilterAccount] = useState<string>('all');

  // Account Names helper
  const accountLabels: Record<keyof typeof balances, { en: string; bn: string }> = {
    cashBox: { en: 'Cash Box / Vault', bn: 'নগদ ক্যাশ বক্স / ভল্ট' },
    dbblBank: { en: 'Dutch-Bangla Bank (DBBL)', bn: 'ডাচ-বাংলা ব্যাংক (DBBL)' },
    sonaliBank: { en: 'Sonali Bank PLC', bn: 'সোনালী ব্যাংক পিএলসি' },
    bkashWallet: { en: 'bKash Merchant Wallet', bn: 'বিকাশ মার্চেন্ট ওয়ালেট' },
  };

  const handleTypeChange = (type: 'deposit' | 'withdrawal') => {
    setFormType(type);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleRecordTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const amountNum = parseFloat(formAmount) || 0;

    if (amountNum <= 0) {
      setErrorMsg(isBangla ? 'অনুগ্রহ করে সঠিক পরিমাণ লিখুন।' : 'Please enter a valid amount.');
      return;
    }

    if (formType === 'withdrawal') {
      if (balances[formAccount] < amountNum) {
        setErrorMsg(
          isBangla
            ? `অপর্যাপ্ত ব্যালেন্স! নির্বাচিত হিসাবে সর্বোচ্চ ${formatCurrency(balances[formAccount])} আছে।`
            : `Insufficient funds! Selected account only has ${formatCurrency(balances[formAccount])} available.`
        );
        return;
      }

      setBalances((prev) => ({
        ...prev,
        [formAccount]: prev[formAccount] - amountNum,
      }));
    } else {
      // Deposit adds amount to selected account
      setBalances((prev) => ({
        ...prev,
        [formAccount]: prev[formAccount] + amountNum,
      }));
    }

    // Generate reference code
    const newRef = `TXN-${(transactions.length + 1).toString().padStart(3, '0')}`;

    const newTransaction: TransactionRecord = {
      id: newRef,
      date: new Date().toISOString().split('T')[0],
      type: formType,
      typeBn: formType === 'deposit' ? (isBangla ? 'জমা' : 'Deposit') : (isBangla ? 'উত্তোলন' : 'Withdrawal'),
      desc: formDesc || `${formType === 'deposit' ? 'Deposit to' : 'Withdrawal from'} ${accountLabels[formAccount].en}`,
      descBn: formDesc || `${accountLabels[formAccount].bn} এ ${formType === 'deposit' ? 'জমা' : 'উত্তোলন'}`,
      account: formAccount,
      accountBn: accountLabels[formAccount].bn,
      amount: amountNum,
      branch: 'Dhaka',
    };

    setTransactions([newTransaction, ...transactions]);
    setSuccessMsg(
      formType === 'deposit'
        ? (isBangla ? 'টাকা সফলভাবে জমা করা হয়েছে!' : 'Deposit recorded successfully!')
        : (isBangla ? 'টাকা সফলভাবে উত্তোলন করা হয়েছে!' : 'Withdrawal processed successfully!')
    );

    // Reset Form
    setFormAmount('');
    setFormDesc('');
  };

  const handleDeleteTransaction = (record: TransactionRecord) => {
    const acc = record.account as keyof typeof balances;

    if (record.type === 'withdrawal') {
      // Reverse withdrawal: add back amount
      setBalances((prev) => ({
        ...prev,
        [acc]: prev[acc] + record.amount,
      }));
    } else {
      // Reverse deposit: subtract amount
      setBalances((prev) => ({
        ...prev,
        [acc]: prev[acc] - record.amount,
      }));
    }

    setTransactions(transactions.filter((t) => t.id !== record.id));
    setSuccessMsg(isBangla ? 'লেনদেন সফলভাবে মুছে ফেলা হয়েছে এবং ব্যালেন্স সমন্বয় করা হয়েছে।' : 'Transaction deleted and balance adjusted successfully.');
  };

  // Filter & Search logic
  const filteredTransactions = transactions.filter((t) => {
    if (filterType !== 'all' && t.type !== filterType) {
      return false;
    }
    if (filterAccount !== 'all' && t.account !== filterAccount) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchId = t.id.toLowerCase().includes(q);
      const matchDesc = t.desc.toLowerCase().includes(q) || t.descBn.toLowerCase().includes(q);
      const matchAcc =
        (accountLabels[t.account as keyof typeof balances]?.en || '').toLowerCase().includes(q) ||
        (accountLabels[t.account as keyof typeof balances]?.bn || '').toLowerCase().includes(q);
      const matchDate = t.date.includes(q);
      if (!matchId && !matchDesc && !matchAcc && !matchDate) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <FinancePageHeader
        pageName="Deposit & Withdrawal"
        pageNameBn="জমা ও উত্তোলন"
        description="Record direct deposits and withdrawals for bank accounts, cash vaults, and digital wallets."
        descriptionBn="ক্যাশ বক্স, ব্যাংক অ্যাকাউন্ট এবং ডিজিটাল ওয়ালেটের জন্য সরাসরি জমা ও উত্তোলন পরিচালনা করুন।"
        icon={formType === 'deposit' ? ArrowDownLeft : ArrowUpRight}
      />

      {/* 2. Colorful Bank Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cash Box Card */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-[#78350f] via-[#92400e] to-[#d97706] text-white shadow-lg shadow-amber-950/20 border border-amber-500/30 flex flex-col justify-between min-h-[115px] relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-amber-200/80">
                {isBangla ? 'নগদ ক্যাশ বক্স / ভল্ট' : 'Cash Box (Vault)'}
              </p>
              <h3 className="text-2xl font-bold font-mono text-white mt-1">
                {formatCurrency(balances.cashBox)}
              </h3>
            </div>
            <div className="h-9 w-9 rounded-xl bg-white/15 text-amber-200 flex items-center justify-center shrink-0">
              <Coins className="h-5 w-5" />
            </div>
          </div>
          <span className="text-[10px] text-white/60 font-mono mt-2">CASH IN HAND</span>
        </div>

        {/* Dutch-Bangla Bank Card */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-[#1e3a8a] via-[#1d4ed8] to-[#3b82f6] text-white shadow-lg shadow-blue-950/20 border border-blue-500/30 flex flex-col justify-between min-h-[115px] relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-blue-200/80">
                {isBangla ? 'ডাচ-বাংলা ব্যাংক (DBBL)' : 'Dutch-Bangla Bank'}
              </p>
              <h3 className="text-2xl font-bold font-mono text-white mt-1">
                {formatCurrency(balances.dbblBank)}
              </h3>
            </div>
            <div className="h-9 w-9 rounded-xl bg-white/15 text-blue-200 flex items-center justify-center shrink-0">
              <Landmark className="h-5 w-5" />
            </div>
          </div>
          <span className="text-[10px] text-white/60 font-mono mt-2">BANK ACC: 190.120.***</span>
        </div>

        {/* Sonali Bank Card */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#059669] text-white shadow-lg shadow-emerald-950/20 border border-emerald-500/30 flex flex-col justify-between min-h-[115px] relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-200/80">
                {isBangla ? 'সোনালী ব্যাংক পিএলসি' : 'Sonali Bank PLC'}
              </p>
              <h3 className="text-2xl font-bold font-mono text-white mt-1">
                {formatCurrency(balances.sonaliBank)}
              </h3>
            </div>
            <div className="h-9 w-9 rounded-xl bg-white/15 text-emerald-200 flex items-center justify-center shrink-0">
              <Building2 className="h-5 w-5" />
            </div>
          </div>
          <span className="text-[10px] text-white/60 font-mono mt-2">BANK ACC: 0019.890.***</span>
        </div>

        {/* bKash Wallet Card */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-[#831843] via-[#9d174d] to-[#ec4899] text-white shadow-lg shadow-pink-950/20 border border-pink-500/30 flex flex-col justify-between min-h-[115px] relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-pink-200/80">
                {isBangla ? 'বিকাশ মার্চেন্ট ওয়ালেট' : 'bKash Merchant'}
              </p>
              <h3 className="text-2xl font-bold font-mono text-white mt-1">
                {formatCurrency(balances.bkashWallet)}
              </h3>
            </div>
            <div className="h-9 w-9 rounded-xl bg-white/15 text-pink-200 flex items-center justify-center shrink-0">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <span className="text-[10px] text-white/60 font-mono mt-2">WALLET: +880 1711***</span>
        </div>
      </div>

      {/* 3. Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Logger Form */}
        <div className="rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden h-fit">
          <div className="px-5 py-3.5 border-b border-border/30 bg-muted/15 flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Plus className="h-4 w-4 text-primary" />
              <span>
                {formType === 'deposit'
                  ? (isBangla ? 'জমা রেকর্ড করুন' : 'Record Deposit')
                  : (isBangla ? 'উত্তোলন রেকর্ড করুন' : 'Record Withdrawal')}
              </span>
            </h3>
          </div>
          <div className="p-4 sm:p-5">
            <form onSubmit={handleRecordTransaction} className="space-y-4">
              
              {/* Type Tab Selectors: 2 options only (Deposit & Withdrawal) */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-muted rounded-xl text-center text-xs">
                <button
                  type="button"
                  onClick={() => handleTypeChange('deposit')}
                  className={cn(
                    'py-2 px-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer',
                    formType === 'deposit'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <ArrowDownLeft className="h-3.5 w-3.5" />
                  {isBangla ? 'জমা (Deposit)' : 'Deposit'}
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('withdrawal')}
                  className={cn(
                    'py-2 px-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer',
                    formType === 'withdrawal'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  {isBangla ? 'উত্তোলন (Withdrawal)' : 'Withdrawal'}
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

              {/* Selected Account: Only 1 account selected */}
              <div className="space-y-1.5 text-xs">
                <label className="font-semibold text-muted-foreground">
                  {formType === 'deposit'
                    ? (isBangla ? 'জমার হিসাব নির্বাচন করুন' : 'Select Deposit Account')
                    : (isBangla ? 'উত্তোলনের হিসাব নির্বাচন করুন' : 'Select Withdrawal Account')}
                </label>
                <select
                  value={formAccount}
                  onChange={(e) => setFormAccount(e.target.value as any)}
                  className="w-full h-9.5 rounded-lg border bg-background px-3 text-xs focus:outline-none cursor-pointer"
                >
                  {Object.keys(balances).map((accKey) => (
                    <option key={accKey} value={accKey}>
                      {isBangla ? accountLabels[accKey as keyof typeof balances].bn : accountLabels[accKey as keyof typeof balances].en} ({formatCurrency(balances[accKey as keyof typeof balances])})
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount (Single full-width input without fee) */}
              <div className="space-y-1.5 text-xs">
                <label className="font-semibold text-muted-foreground">
                  {formType === 'deposit'
                    ? (isBangla ? 'জমার পরিমাণ (৳)' : 'Deposit Amount (৳)')
                    : (isBangla ? 'উত্তোলনের পরিমাণ (৳)' : 'Withdrawal Amount (৳)')}
                </label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  required
                  min="0.01"
                  step="any"
                  className="h-9.5 font-mono"
                />
              </div>

              {/* Description Narration */}
              <div className="space-y-1.5 text-xs">
                <label className="font-semibold text-muted-foreground">{isBangla ? 'লেনদেনের বিবরণ (Memo)' : 'Narration / Description'}</label>
                <Input
                  placeholder={
                    formType === 'deposit'
                      ? (isBangla ? 'যেমন: গ্রাহক থেকে সরাসরি ক্যাশ জমা...' : 'e.g. Cash deposit from customer...')
                      : (isBangla ? 'যেমন: অফিস খরচের জন্য উত্তোলন...' : 'e.g. Withdrawal for operational expenses...')
                  }
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="h-9.5"
                />
              </div>

              <Button
                type="submit"
                className={cn(
                  'w-full text-xs h-10 font-bold cursor-pointer transition-all',
                  formType === 'deposit'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-rose-600 hover:bg-rose-700 text-white'
                )}
              >
                {formType === 'deposit'
                  ? (isBangla ? 'জমা নিশ্চিত করুন' : 'Confirm Deposit')
                  : (isBangla ? 'উত্তোলন নিশ্চিত করুন' : 'Confirm Withdrawal')}
              </Button>
            </form>
          </div>
        </div>

        {/* Right Side: Log list registry */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search bar (left) and Filters (right) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border/50 shadow-sm">
            {/* Left Side: Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder={isBangla ? 'রেফারেন্স বা বিবরণ দিয়ে খুঁজুন...' : 'Search by reference, memo...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 pl-9 text-xs bg-background rounded-xl border-border/60"
              />
            </div>

            {/* Right Side: Filters (Type & Account) */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
              {/* Type Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="h-9 rounded-xl border border-border/60 bg-background px-3 text-xs focus:outline-none cursor-pointer"
              >
                <option value="all">{isBangla ? 'সকল ধরন' : 'All Types'}</option>
                <option value="deposit">{isBangla ? 'জমা' : 'Deposits Only'}</option>
                <option value="withdrawal">{isBangla ? 'উত্তোলন' : 'Withdrawals Only'}</option>
              </select>

              {/* Account Filter */}
              <select
                value={filterAccount}
                onChange={(e) => setFilterAccount(e.target.value)}
                className="h-9 rounded-xl border border-border/60 bg-background px-3 text-xs focus:outline-none cursor-pointer max-w-[160px] truncate"
              >
                <option value="all">{isBangla ? 'সকল হিসাব' : 'All Accounts'}</option>
                {Object.keys(balances).map((accKey) => (
                  <option key={accKey} value={accKey}>
                    {isBangla ? accountLabels[accKey as keyof typeof balances].bn : accountLabels[accKey as keyof typeof balances].en}
                  </option>
                ))}
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
                    <th className="p-3">{isBangla ? 'ধরন' : 'Type'}</th>
                    <th className="p-3">{isBangla ? 'হিসাব' : 'Account'}</th>
                    <th className="p-3 text-right">{isBangla ? 'পরিমাণ' : 'Amount'}</th>
                    <th className="p-3 text-center">{isBangla ? 'অ্যাকশন' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground font-semibold">
                        {isBangla ? 'কোনো লেনদেন এন্ট্রি পাওয়া যায়নি।' : 'No transactions found.'}
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((t) => (
                      <tr key={t.id} className="hover:bg-muted/5">
                        <td className="p-3 font-mono text-muted-foreground">{t.date}</td>
                        <td className="p-3 font-mono font-bold text-primary">{t.id}</td>
                        <td className="p-3">
                          <Badge
                            variant="secondary"
                            className={cn(
                              'text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit',
                              t.type === 'deposit'
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20'
                            )}
                          >
                            {t.type === 'deposit' ? (
                              <ArrowDownLeft className="h-3 w-3" />
                            ) : (
                              <ArrowUpRight className="h-3 w-3" />
                            )}
                            {isBangla
                              ? t.type === 'deposit' ? 'জমা' : 'উত্তোলন'
                              : t.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                          </Badge>
                        </td>
                        <td className="p-3 font-semibold text-foreground">
                          {isBangla
                            ? accountLabels[t.account as keyof typeof balances]?.bn
                            : accountLabels[t.account as keyof typeof balances]?.en}
                        </td>
                        <td
                          className={cn(
                            'p-3 text-right font-mono font-bold',
                            t.type === 'deposit'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-rose-600 dark:text-rose-400'
                          )}
                        >
                          {t.type === 'deposit' ? '+' : '-'}{formatCurrency(t.amount)}
                        </td>
                        <td className="p-3 text-center">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDeleteTransaction(t)}
                            className="h-7 w-7 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 cursor-pointer"
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
