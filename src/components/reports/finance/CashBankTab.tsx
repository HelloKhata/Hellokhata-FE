'use client';

import React from 'react';
import {
  Wallet,
  Landmark,
  Smartphone,
  ArrowRightLeft,
  CheckCircle2,
  Info,
  Building2,
  CreditCard,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface CashBankTabProps {
  stats: any;
  accounts: any[];
  transfers: any[];
  isLoadingAccounts: boolean;
  isLoadingTransfers: boolean;
}

export function CashBankTab({
  stats,
  accounts,
  transfers,
  isLoadingAccounts,
  isLoadingTransfers,
}: CashBankTabProps) {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();

  const totalLiquidity = Number(stats?.totalLiquidity || 0);
  const cashLiquidity = Number(stats?.cashLiquidity || 0);
  const bankLiquidity = Number(stats?.bankLiquidity || 0);
  const walletLiquidity = Number(stats?.walletLiquidity || 0);

  return (
    <div className="space-y-6">
      {/* 1. Liquidity Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl p-4 bg-card/70 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-muted-foreground">
              {isBangla ? 'সর্বমোট তারল্য' : 'Total Liquidity'}
            </span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-foreground">
            {formatCurrency(totalLiquidity)}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            {stats?.totalAccounts || accounts?.length || 0} {isBangla ? 'টি অ্যাকাউন্ট' : 'active accounts'}
          </div>
        </div>

        <div className="rounded-2xl p-4 bg-card/70 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-muted-foreground">
              {isBangla ? 'হাতে নগদ (ক্যাশ)' : 'Cash in Hand'}
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-emerald-500">
            {formatCurrency(cashLiquidity)}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            {isBangla ? 'ক্যাশ রেজিস্টার ব্যালেন্স' : 'Immediate physical cash'}
          </div>
        </div>

        <div className="rounded-2xl p-4 bg-card/70 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-muted-foreground">
              {isBangla ? 'ব্যাংক হিসাবসমূহ' : 'Bank Accounts'}
            </span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-blue-500">
            {formatCurrency(bankLiquidity)}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            {isBangla ? 'কমার্শিয়াল ব্যাংক আমানত' : 'Commercial bank deposits'}
          </div>
        </div>

        <div className="rounded-2xl p-4 bg-card/70 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-muted-foreground">
              {isBangla ? 'মোবাইল ওয়ালেট' : 'Mobile Wallets'}
            </span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-purple-500">
            {formatCurrency(walletLiquidity)}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            {isBangla ? 'বিকাশ, নগদ, রকেট' : 'bKash, Nagad, Rocket'}
          </div>
        </div>
      </div>

      {/* 2. Crucial Financial Principle Alert */}
      <div className="rounded-2xl p-4 bg-primary/5 border border-primary/15 flex items-start gap-3">
        <div className="p-1.5 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="text-xs text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">
            {isBangla ? 'হিসাববিজ্ঞানের গুরুত্বপূর্ণ সতর্কতা: ' : 'Financial Accounting Rule: '}
          </span>
          {isBangla
            ? 'ক্যাশ, ব্যাংক এবং মোবাইল ওয়ালেটের মধ্যকার অভ্যন্তরীণ তহবিল স্থানান্তর (Internal Transfers / Contra Entries) কেবল তারল্যের স্থান পরিবর্তন। এগুলোকে কখনোই ব্যবসায়িক আয় বা পরিচালন ব্যয় হিসেবে গণ্য করা যাবে না।'
            : 'Internal fund transfers between cash, bank accounts, and digital wallets are liquidity reallocations (contra entries). They do not constitute revenue or operating expenditure.'}
        </div>
      </div>

      {/* 3. Account Balances Table */}
      <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <CreditCard className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">
              {isBangla ? 'অ্যাকাউন্ট ও ব্যালেন্স তালিকা' : 'Registered Accounts & Balances'}
            </h3>
          </div>
          <span className="text-xs text-muted-foreground">
            {accounts?.length || 0} {isBangla ? 'টি অ্যাকাউন্ট' : 'accounts'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border/60">
              <tr>
                <th className="py-3 px-4 font-semibold">{isBangla ? 'হিসাবের নাম' : 'Account Name'}</th>
                <th className="py-3 px-4 font-semibold">{isBangla ? 'ধরন' : 'Type'}</th>
                <th className="py-3 px-4 font-semibold">{isBangla ? 'প্রতিষ্ঠান / প্রোভাইডার' : 'Institution / Provider'}</th>
                <th className="py-3 px-4 font-semibold">{isBangla ? 'অ্যাকাউন্ট নম্বর' : 'Account No'}</th>
                <th className="py-3 px-4 font-semibold text-right">{isBangla ? 'বর্তমান ব্যালেন্স' : 'Current Balance'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {isLoadingAccounts ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td className="py-3.5 px-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="py-3.5 px-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="py-3.5 px-4"><Skeleton className="h-4 w-28" /></td>
                    <td className="py-3.5 px-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="py-3.5 px-4 text-right"><Skeleton className="h-4 w-20 ml-auto" /></td>
                  </tr>
                ))
              ) : accounts && accounts.length > 0 ? (
                accounts.map((acc: any) => {
                  const type = acc.type?.toLowerCase() || 'cash';
                  const isBank = type === 'bank';
                  const isWallet = type === 'wallet' || type === 'mobile';

                  return (
                    <tr key={acc.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-foreground">
                        {acc.name || acc.accountName || 'Cash Account'}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                          isBank
                            ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                            : isWallet
                            ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                            : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        )}>
                          {isBank
                            ? (isBangla ? 'ব্যাংক' : 'Bank')
                            : isWallet
                            ? (isBangla ? 'ওয়ালেট' : 'Wallet')
                            : (isBangla ? 'ক্যাশ' : 'Cash')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                        {acc.bankName || acc.provider || (isBank ? 'Bank' : isWallet ? 'MFS' : 'Cash Box')}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground font-mono text-[11px] whitespace-nowrap">
                        {acc.accountNumber || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-foreground whitespace-nowrap">
                        {formatCurrency(acc.balance || 0)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-muted-foreground text-xs">
                    {isBangla ? 'কোনো অ্যাকাউন্ট রেজিস্টার করা নেই।' : 'No payment accounts registered.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Internal Fund Movement / Transfers Ledger */}
      <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">
              {isBangla ? 'অভ্যন্তরীণ তহবিল স্থানান্তর ও জমা-উত্তোলন' : 'Internal Fund Transfers & Contra Entries'}
            </h3>
          </div>
          <span className="text-xs text-muted-foreground">
            {transfers?.length || 0} {isBangla ? 'টি এন্ট্রি' : 'movements'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border/60">
              <tr>
                <th className="py-3 px-4 font-semibold">{isBangla ? 'তারিখ' : 'Date'}</th>
                <th className="py-3 px-4 font-semibold">{isBangla ? 'ধরন' : 'Movement Type'}</th>
                <th className="py-3 px-4 font-semibold">{isBangla ? 'অ্যাকাউন্ট' : 'Account Involved'}</th>
                <th className="py-3 px-4 font-semibold">{isBangla ? 'রেফারেন্স / নোট' : 'Reference / Note'}</th>
                <th className="py-3 px-4 font-semibold text-right">{isBangla ? 'পরিমাণ' : 'Amount'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {isLoadingTransfers ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td className="py-3.5 px-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="py-3.5 px-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="py-3.5 px-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="py-3.5 px-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="py-3.5 px-4 text-right"><Skeleton className="h-4 w-20 ml-auto" /></td>
                  </tr>
                ))
              ) : transfers && transfers.length > 0 ? (
                transfers.slice(0, 10).map((t: any) => {
                  const isDeposit = t.type === 'deposit';
                  const dateStr = t.date
                    ? new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                    : '—';

                  return (
                    <tr key={t.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                        {dateStr}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                          isDeposit
                            ? "bg-teal-500/10 text-teal-500 border-teal-500/20"
                            : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        )}>
                          {isDeposit ? (isBangla ? 'জমা (Deposit)' : 'Deposit') : (isBangla ? 'উত্তোলন (Withdrawal)' : 'Withdrawal')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-foreground">
                        {t.accountName || t.account?.name || 'Account'}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">
                        {t.reference || t.description || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-foreground whitespace-nowrap">
                        {formatCurrency(t.amount || 0)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground text-xs">
                    {isBangla ? 'কোনো তহবিল স্থানান্তর এন্ট্রি পাওয়া যায়নি।' : 'No internal transfers recorded.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
