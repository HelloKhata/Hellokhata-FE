// Hello Khata OS - Recent Financial Activity Audit Table
// হ্যালো খাতা - সাম্প্রতিক আর্থিক লেনদেন অডিট

'use client';

import React from 'react';
import Link from 'next/link';
import {
  History,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeftRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCurrency, useDateFormat } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import type { RecentTransactionItem } from './types';

interface RecentFinancialActivityProps {
  transactions: RecentTransactionItem[];
  isBangla?: boolean;
}

export function RecentFinancialActivity({
  transactions,
  isBangla = false,
}: RecentFinancialActivityProps) {
  const { formatCurrency } = useCurrency();
  const { formatDate } = useDateFormat();

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              {isBangla ? 'সাম্প্রতিক আর্থিক লেনদেন' : 'Recent Financial Activity'}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {isBangla ? 'সর্বশেষ সম্পন্ন হওয়া আয়, ব্যয় ও লেনদেন' : 'Latest posted vouchers and bank movements'}
            </p>
          </div>
        </div>

        <Link
          href="/finance/transactions"
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
        >
          <span>{isBangla ? 'সকল লেনদেন দেখুন' : 'View All Transactions'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Dense Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-border/60 text-[11px] text-muted-foreground font-semibold">
              <th className="pb-2.5 font-medium">{isBangla ? 'তারিখ' : 'Date'}</th>
              <th className="pb-2.5 font-medium">{isBangla ? 'ভাউচার নং' : 'Reference'}</th>
              <th className="pb-2.5 font-medium">{isBangla ? 'হিসাব / খাতা' : 'Account'}</th>
              <th className="pb-2.5 font-medium">{isBangla ? 'ধরণ' : 'Type'}</th>
              <th className="pb-2.5 font-medium text-right">{isBangla ? 'পরিমাণ' : 'Amount'}</th>
              <th className="pb-2.5 font-medium text-right">{isBangla ? 'স্ট্যাটাস' : 'Status'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 font-mono text-[11.5px]">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-muted/30 transition-colors">
                <td className="py-2.5 text-muted-foreground">{tx.date}</td>
                <td className="py-2.5 font-bold text-foreground">{tx.reference}</td>
                <td className="py-2.5 font-sans font-medium text-foreground">{tx.account}</td>
                <td className="py-2.5 font-sans">
                  <span
                    className={cn(
                      'text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block',
                      tx.type === 'Income' || tx.type === 'Customer Receipt'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : tx.type === 'Expense' || tx.type === 'Supplier Payment'
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    )}
                  >
                    {tx.type}
                  </span>
                </td>
                <td
                  className={cn(
                    'py-2.5 text-right font-bold',
                    tx.type === 'Income' || tx.type === 'Customer Receipt'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : tx.type === 'Expense' || tx.type === 'Supplier Payment'
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-foreground'
                  )}
                >
                  {tx.type === 'Income' || tx.type === 'Customer Receipt' ? '+' : '-'}
                  {formatCurrency(tx.amount)}
                </td>
                <td className="py-2.5 text-right">
                  <span className="text-[10px] font-sans font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
