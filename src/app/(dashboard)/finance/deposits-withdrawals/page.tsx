'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FinancePageHeader } from '@/components/finance/FinancePageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Plus,
  Coins,
  Building2,
  Wallet,
  Landmark,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Search,
  Loader2,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  useCreateDeposit,
  useCreateWithdrawal,
  useDeleteTransaction,
  useGetDepositsAndWithdrawls,
  useGetPaymentMethodStatus,
  useGetPaymentMethods,
} from '@/hooks/api/usePaymentMethod';
import { toast } from 'sonner';

export default function DepositWithdrawalPage() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<('deposit' | 'withdrawal') | "">("");
  const [filterAccount, setFilterAccount] = useState<string>('all');

  // Form Fields
  const [formType, setFormType] = useState<'deposit' | 'withdrawal'>('deposit');
  const [formAccount, setFormAccount] = useState<string>('');
  const [formAmount, setFormAmount] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Delete Confirmation State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);


  // API Calls
  const { data: accounts = [], isLoading: isLoadingAccounts } = useGetPaymentMethods();
  const { data: transactionList = [], isLoading: isLoadingDepositsAndWithdrawls } = useGetDepositsAndWithdrawls({
    search: searchTerm.trim() || undefined,
    accountId: filterAccount !== 'all' ? (filterAccount || undefined) : undefined,
    type: filterType || undefined,
  });

const {mutate: deleteTransaction, isPending: isDeletingTransaction} = useDeleteTransaction();
  const { data: summaryData, isLoading: isLoadingSummary } = useGetPaymentMethodStatus();
  const { mutate: createDeposit, isPending: isCreatingDeposit } = useCreateDeposit();
  const { mutate: createWithdrawal, isPending: isCreatingWithdrawal } = useCreateWithdrawal();


  const handleTypeChange = (type: 'deposit' | 'withdrawal') => {
    setFormType(type);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleRecordTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formAccount) {
      setErrorMsg(isBangla ? 'অনুগ্রহ করে হিসাব নির্বাচন করুন।' : 'Please select an account.');
      return;
    }

    const amountNum = parseFloat(formAmount) || 0;

    if (amountNum <= 0) {
      setErrorMsg(isBangla ? 'অনুগ্রহ করে সঠিক পরিমাণ লিখুন।' : 'Please enter a valid amount.');
      return;
    }

    const selectedAccount = accounts?.find((acc: any) => (acc.id || acc._id) === formAccount);
    const currentBalance = selectedAccount
      ? selectedAccount.balance ?? selectedAccount.currentBalance ?? selectedAccount.openingBalance ?? 0
      : 0;

    if (formType === 'withdrawal') {
      if (selectedAccount && currentBalance < amountNum) {
        setErrorMsg(
          isBangla
            ? `অপর্যাপ্ত ব্যালেন্স! নির্বাচিত হিসাবে সর্বোচ্চ ${formatCurrency(currentBalance)} আছে।`
            : `Insufficient funds! Selected account only has ${formatCurrency(currentBalance)} available.`
        );
        return;
      }
    }

    const payload = {
      accountId: formAccount,
      amount: amountNum,
      narration: formDesc,
    };

    if (formType === 'deposit') {
      createDeposit(payload, {
        onSuccess: () => {
          setSuccessMsg(isBangla ? 'জমা সফলভাবে রেকর্ড করা হয়েছে।' : 'Deposit recorded successfully.');
          setFormAmount('');
          setFormDesc('');
        }
      });
    } else {
      createWithdrawal(payload, {
        onSuccess: () => {
          setSuccessMsg(isBangla ? 'উত্তোলন সফলভাবে রেকর্ড করা হয়েছে।' : 'Withdrawal recorded successfully.');
          setFormAmount('');
          setFormDesc('');
        }
      });
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmId) return;
    deleteTransaction(deleteConfirmId, {
      onSuccess: (data: any) => {
        toast.success(
          data?.message || (isBangla ? 'লেনদেন সফলভাবে মুছে ফেলা হয়েছে।' : 'Transaction deleted successfully.')
        );
        setDeleteConfirmId(null);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <FinancePageHeader
        pageName="Deposit & Withdrawal"
        pageNameBn="জমা ও উত্তোলন"
        description="Record direct deposits and withdrawals for bank accounts, cash vaults, and digital wallets."
        descriptionBn="ক্যাশ বক্স, ব্যাংক অ্যাকাউন্ট এবং ডিজিটাল ওয়ালেটের জন্য সরাসরি জমা ও উত্তোলন পরিচালনা করুন।"
        icon={formType === 'deposit' ? ArrowDownLeft : ArrowUpRight}
        showBackButton={true}
        backHref="/finance/overview"
      />

      {/* 2. Overview Metric Cards: 2 cards in a row on mobile, slim compact height */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {isLoadingSummary ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-xl sm:rounded-2xl p-2.5 sm:p-4 bg-card/80 border border-border/50 shadow-sm flex flex-col justify-between min-h-[72px] sm:min-h-[105px] animate-pulse"
            >
              <div className="flex items-start justify-between gap-1.5">
                <div className="space-y-1 sm:space-y-1.5 flex-1">
                  <Skeleton className="h-2.5 sm:h-3 w-14 sm:w-20 rounded bg-muted/60" />
                  <Skeleton className="h-3.5 sm:h-6 w-16 sm:w-28 rounded bg-muted/60" />
                </div>
                <Skeleton className="h-5 w-5 sm:h-8 sm:w-8 rounded-md sm:rounded-lg shrink-0 bg-muted/60" />
              </div>
              <Skeleton className="h-2 sm:h-2.5 w-12 sm:w-24 rounded mt-1 bg-muted/60" />
            </div>
          ))
        ) : (
          <>
            {/* Card 1: Total Fund */}
            <div className="rounded-xl sm:rounded-2xl p-2.5 sm:p-4 bg-gradient-to-br from-[#1e3a8a] via-[#1d4ed8] to-[#3b82f6] text-white shadow-sm sm:shadow-md shadow-blue-950/20 border border-blue-500/30 flex flex-col justify-between min-h-[72px] sm:min-h-[105px] relative overflow-hidden group">
              <div className="flex items-start justify-between gap-1">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-blue-200/90 truncate">
                    {isBangla ? 'সর্বমোট তহবিল' : 'Total Fund'}
                  </p>
                  <h3 className="text-xs sm:text-lg md:text-xl font-bold font-mono text-white mt-0.5 sm:mt-1 truncate leading-tight">
                    {formatCurrency(summaryData?.totalLiquidity ?? 0)}
                  </h3>
                </div>
                <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-md sm:rounded-lg bg-white/15 text-blue-100 flex items-center justify-center shrink-0">
                  <Landmark className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
              </div>
              <span className="text-[9px] sm:text-[10px] text-white/75 font-mono mt-0.5 sm:mt-1 uppercase truncate block">
                {isBangla
                  ? `${summaryData?.totalAccounts ?? accounts?.length ?? 0}টি অ্যাকাউন্ট`
                  : `${summaryData?.totalAccounts ?? accounts?.length ?? 0} Accounts`}
              </span>
            </div>

            {/* Card 2: Total Withdrawals */}
            <div className="rounded-xl sm:rounded-2xl p-2.5 sm:p-4 bg-gradient-to-br from-[#881337] via-[#9f1239] to-[#e11d48] text-white shadow-sm sm:shadow-md shadow-rose-950/20 border border-rose-500/30 flex flex-col justify-between min-h-[72px] sm:min-h-[105px] relative overflow-hidden group">
              <div className="flex items-start justify-between gap-1">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-rose-200/90 truncate">
                    {isBangla ? 'মোট উত্তোলন' : 'Total Withdrawals'}
                  </p>
                  <h3 className="text-xs sm:text-lg md:text-xl font-bold font-mono text-white mt-0.5 sm:mt-1 truncate leading-tight">
                    {formatCurrency(summaryData?.totalWithdrawal ?? 0)}
                  </h3>
                </div>
                <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-md sm:rounded-lg bg-white/15 text-rose-100 flex items-center justify-center shrink-0">
                  <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
              </div>
              <span className="text-[9px] sm:text-[10px] text-white/75 font-mono mt-0.5 sm:mt-1 uppercase truncate block">
                {summaryData?.withdrawalCount ?? 0} {isBangla ? 'টি উত্তোলন' : 'Withdrawals'}
              </span>
            </div>

            {/* Card 3: Total Deposit */}
            <div className="rounded-xl sm:rounded-2xl p-2.5 sm:p-4 bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#059669] text-white shadow-sm sm:shadow-md shadow-emerald-950/20 border border-emerald-500/30 flex flex-col justify-between min-h-[72px] sm:min-h-[105px] relative overflow-hidden group">
              <div className="flex items-start justify-between gap-1">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-emerald-200/90 truncate">
                    {isBangla ? 'মোট জমা' : 'Total Deposit'}
                  </p>
                  <h3 className="text-xs sm:text-lg md:text-xl font-bold font-mono text-white mt-0.5 sm:mt-1 truncate leading-tight">
                    {formatCurrency(summaryData?.totalDeposit ?? 0)}
                  </h3>
                </div>
                <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-md sm:rounded-lg bg-white/15 text-emerald-100 flex items-center justify-center shrink-0">
                  <ArrowDownLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
              </div>
              <span className="text-[9px] sm:text-[10px] text-white/75 font-mono mt-0.5 sm:mt-1 uppercase truncate block">
                {summaryData?.depositCount ?? 0} {isBangla ? 'টি জমা' : 'Deposits'}
              </span>
            </div>

            {/* Card 4: Deposit Count & Withdrawals Count */}
            <div className="rounded-xl sm:rounded-2xl p-2.5 sm:p-4 bg-gradient-to-br from-[#78350f] via-[#92400e] to-[#d97706] text-white shadow-sm sm:shadow-md shadow-amber-950/20 border border-amber-500/30 flex flex-col justify-between min-h-[72px] sm:min-h-[105px] relative overflow-hidden group">
              <div className="flex items-start justify-between gap-1">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-amber-200/90 truncate">
                    {isBangla ? 'মোট লেনদেন' : 'Total Txn'}
                  </p>
                  <h3 className="text-xs sm:text-lg md:text-xl font-bold font-mono text-white mt-0.5 sm:mt-1 truncate leading-tight">
                    {(summaryData?.depositCount ?? 0) + (summaryData?.withdrawalCount ?? 0)}
                  </h3>
                </div>
                <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-md sm:rounded-lg bg-white/15 text-amber-100 flex items-center justify-center shrink-0">
                  <ArrowLeftRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
              </div>
              <span className="text-[9px] sm:text-[10px] text-white/75 font-mono mt-0.5 sm:mt-1 uppercase truncate block">
                {isBangla
                  ? `জমা: ${summaryData?.depositCount ?? 0} | উত্তোলন: ${summaryData?.withdrawalCount ?? 0}`
                  : `In: ${summaryData?.depositCount ?? 0} | Out: ${summaryData?.withdrawalCount ?? 0}`}
              </span>
            </div>
          </>
        )}
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
                  ? isBangla
                    ? 'জমা রেকর্ড করুন'
                    : 'Record Deposit'
                  : isBangla
                  ? 'উত্তোলন রেকর্ড করুন'
                  : 'Record Withdrawal'}
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

              {/* Selected Account: Populate from accounts (useGetPaymentMethods) */}
              <div className="space-y-1.5 text-xs">
                <Label className="font-semibold text-muted-foreground">
                  {formType === 'deposit'
                    ? isBangla
                      ? 'জমার হিসাব নির্বাচন করুন'
                      : 'Select Deposit Account'
                    : isBangla
                    ? 'উত্তোলনের হিসাব নির্বাচন করুন'
                    : 'Select Withdrawal Account'}
                </Label>
                <Select
                  value={formAccount}
                  onValueChange={(val) => setFormAccount(val)}
                  disabled={isLoadingAccounts}
                  required
                >
                  <SelectTrigger className="w-full h-9.5 rounded-lg border bg-background px-3 text-xs focus:outline-none cursor-pointer">
                    <SelectValue
                      placeholder={
                        isLoadingAccounts
                          ? isBangla
                            ? 'লোড হচ্ছে...'
                            : 'Loading accounts...'
                          : !accounts || accounts.length === 0
                          ? isBangla
                            ? 'কোনো হিসাব পাওয়া যায়নি'
                            : 'No accounts found'
                          : isBangla
                          ? 'হিসাব নির্বাচন করুন'
                          : 'Select an account'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {accounts?.map((acc: any) => {
                      const accId = acc.id || acc._id;
                      const accBalance = acc.balance ?? acc.currentBalance ?? acc.openingBalance ?? 0;
                      const accName = acc.name || acc.bankName || acc.provider || (isBangla ? 'অ্যাকাউন্ট' : 'Account');
                      const accNumber = acc.accountNumber ? ` (${acc.accountNumber})` : '';
                      return (
                        <SelectItem key={accId} value={accId} className="text-xs cursor-pointer">
                          <div className="flex items-center justify-between gap-2 w-full">
                            <span>{accName}{accNumber}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Amount (Single full-width input without fee) */}
              <div className="space-y-1.5 text-xs">
                <label className="font-semibold text-muted-foreground">
                  {formType === 'deposit'
                    ? isBangla
                      ? 'জমার পরিমাণ (৳)'
                      : 'Deposit Amount (৳)'
                    : isBangla
                    ? 'উত্তোলনের পরিমাণ (৳)'
                    : 'Withdrawal Amount (৳)'}
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
                <label className="font-semibold text-muted-foreground">
                  {isBangla ? 'লেনদেনের বিবরণ (Memo)' : 'Narration / Description'}
                </label>
                <Input
                  placeholder={
                    formType === 'deposit'
                      ? isBangla
                        ? 'যেমন: গ্রাহক থেকে সরাসরি ক্যাশ জমা...'
                        : 'e.g. Cash deposit from customer...'
                      : isBangla
                      ? 'যেমন: অফিস খরচের জন্য উত্তোলন...'
                      : 'e.g. Withdrawal for operational expenses...'
                  }
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="h-9.5"
                />
              </div>

              <Button
                type="submit"
                disabled={isCreatingDeposit || isCreatingWithdrawal}
                className={cn(
                  'w-full text-xs h-10 font-bold cursor-pointer transition-all flex items-center justify-center gap-2',
                  formType === 'deposit'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-rose-600 hover:bg-rose-700 text-white'
                )}
              >
                {isCreatingDeposit || isCreatingWithdrawal ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : formType === 'deposit' ? (
                  isBangla ? 'জমা নিশ্চিত করুন' : 'Confirm Deposit'
                ) : (
                  isBangla ? 'উত্তোলন নিশ্চিত করুন' : 'Confirm Withdrawal'
                )}
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
                onChange={(e) => setFilterType(e.target.value as 'deposit' | 'withdrawal'| "")}
                className="h-9 rounded-xl border border-border/60 bg-background px-3 text-xs focus:outline-none cursor-pointer"
              >
                <option value="">{isBangla ? 'সকল ধরন' : 'All Types'}</option>
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
                {accounts?.map((acc: any) => {
                  const accId = acc.id || acc._id;
                  const accName = acc.name || acc.bankName || acc.provider || (isBangla ? 'অ্যাকাউন্ট' : 'Account');
                  return (
                    <option key={accId} value={accId}>
                      {accName}
                    </option>
                  );
                })}
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
                  {isLoadingDepositsAndWithdrawls ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground font-semibold">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          <span>{isBangla ? 'লোড হচ্ছে...' : 'Loading transactions...'}</span>
                        </div>
                      </td>
                    </tr>
                  ) : transactionList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground font-semibold">
                        {isBangla ? 'কোনো লেনদেন এন্ট্রি পাওয়া যায়নি।' : 'No transactions found.'}
                      </td>
                    </tr>
                  ) : (
                    transactionList.map((t: any) => {
                      const tId = t.id || t._id;
                      const isDeposit = t.type === 'deposit';
                      const accObj = accounts?.find(
                        (a: any) => (a.id || a._id) === (t.accountId || t.account?._id || t.account?.id || t.account)
                      );
                      const accDisplayName =
                        accObj?.name ||
                        accObj?.bankName ||
                        t.account?.name ||
                        (typeof t.account === 'string' ? t.account : 'N/A');
                      const displayDate =
                        t.createdAt || t.date
                          ? new Date(t.createdAt || t.date).toLocaleDateString(isBangla ? 'bn-BD' : 'en-US', {
                              dateStyle: 'medium',
                            })
                          : '-';

                      return (
                        <tr key={tId} className="hover:bg-muted/5">
                          <td className="p-3 font-mono text-muted-foreground">{displayDate}</td>
                          <td className="p-3 font-mono font-bold text-primary truncate max-w-[120px]">
                            {t.reference || t.refCode || tId?.slice(-6) || '-'}
                          </td>
                          <td className="p-3">
                            <Badge
                              variant="secondary"
                              className={cn(
                                'text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit',
                                isDeposit
                                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                  : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20'
                              )}
                            >
                              {isDeposit ? (
                                <ArrowDownLeft className="h-3 w-3" />
                              ) : (
                                <ArrowUpRight className="h-3 w-3" />
                              )}
                              {isBangla ? (isDeposit ? 'জমা' : 'উত্তোলন') : isDeposit ? 'Deposit' : 'Withdrawal'}
                            </Badge>
                          </td>
                          <td className="p-3 font-semibold text-foreground">{accDisplayName}</td>
                          <td
                            className={cn(
                              'p-3 text-right font-mono font-bold',
                              isDeposit ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                            )}
                          >
                            {isDeposit ? '+' : '-'}
                            {formatCurrency(t.amount || 0)}
                          </td>
                          <td className="p-3 text-center">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => setDeleteConfirmId(t.id || t._id)}
                              className="h-7 w-7 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={!!deleteConfirmId}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <AlertDialogContent className="rounded-2xl border border-border/80 bg-card shadow-xl max-w-[350px] md:max-w-[460]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-rose-500" />
              <span>{isBangla ? 'লেনদেন মুছে ফেলার নিশ্চিতকরণ' : 'Confirm Delete Transaction'}</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground mt-2">
              {isBangla
                ? 'আপনি কি নিশ্চিত যে আপনি এই লেনদেন রেকর্ডটি মুছে ফেলতে চান? এই ক্রিয়াটি ফিরিয়ে আনা যাবে না।'
                : 'Are you sure you want to delete this transaction record? This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex gap-2 sm:justify-end">
            <AlertDialogCancel
              disabled={isDeletingTransaction}
              className="h-9 px-4 text-xs rounded-xl cursor-pointer"
            >
              {isBangla ? 'বাতিল' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeletingTransaction}
              className="h-9 px-4 text-xs bg-rose-600 hover:bg-rose-700 text-white rounded-xl cursor-pointer font-bold flex items-center gap-1.5"
            >
              {isDeletingTransaction ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>{isBangla ? 'মুছে ফেলা হচ্ছে...' : 'Deleting...'}</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>{isBangla ? 'মুছে ফেলুন' : 'Delete'}</span>
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
