'use client';

import React from 'react';
import { RecentTransaction } from '@/types/finance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  ShoppingCart,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

interface UnifiedTransactionsListProps {
  transactions: RecentTransaction[];
}

export const UnifiedTransactionsList: React.FC<UnifiedTransactionsListProps> = ({
  transactions,
}) => {
  const formatCurrency = (val: number) => `৳${Math.abs(val).toLocaleString('en-BD')}`;

  const getTypeBadge = (type: RecentTransaction['type']) => {
    switch (type) {
      case 'sale':
      case 'income':
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1 text-[10px]">
            <TrendingUp className="h-3 w-3" /> Income
          </Badge>
        );
      case 'expense':
      case 'withdrawal':
        return (
          <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 gap-1 text-[10px]">
            <TrendingDown className="h-3 w-3" /> Expense
          </Badge>
        );
      case 'transfer':
      case 'deposit':
        return (
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 gap-1 text-[10px]">
            <ArrowLeftRight className="h-3 w-3" /> Transfer
          </Badge>
        );
      case 'refund':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1 text-[10px]">
            <RotateCcw className="h-3 w-3" /> Refund
          </Badge>
        );
    }
  };

  return (
    <Card className="border border-border/60 shadow-2xs bg-card">
      <CardHeader className="p-4 pb-3 border-b border-border/40 flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <ArrowLeftRight className="h-4 w-4 text-primary" />
          Recent Unified Financial Transactions (Latest 10)
        </CardTitle>
        <Link href="/finance/transactions">
          <Button variant="ghost" size="sm" className="h-7 text-xs font-medium text-primary hover:text-primary gap-1">
            View All Transactions
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-muted/40 border-b border-border/50 text-muted-foreground uppercase font-semibold text-[10px]">
                <th className="p-3 pl-4">Type</th>
                <th className="p-3">Description & Category</th>
                <th className="p-3">Account & Branch</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3 text-center">Timestamp</th>
                <th className="p-3 pr-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {transactions.slice(0, 10).map((tx) => {
                const isPositive = tx.amount > 0;
                return (
                  <tr key={tx.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 pl-4 align-middle">
                      {getTypeBadge(tx.type)}
                    </td>
                    <td className="p-3 align-middle">
                      <div className="space-y-0.5 max-w-[220px]">
                        <span className="font-semibold text-xs text-foreground truncate block">
                          {tx.description}
                        </span>
                        {tx.category && (
                          <span className="text-[10px] text-muted-foreground block truncate">
                            {tx.category} {tx.isAuto ? '• Auto-recorded' : ''}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 align-middle">
                      <div className="space-y-0.5">
                        <span className="font-medium text-foreground block truncate">
                          {tx.accountName || 'Main Cash Drawer'}
                        </span>
                        <span className="text-[10px] text-muted-foreground block">
                          {tx.branchName}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-right font-mono font-bold align-middle">
                      <span className={isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                        {isPositive ? '+' : '-'}{formatCurrency(tx.amount)}
                      </span>
                    </td>
                    <td className="p-3 text-center text-muted-foreground align-middle text-[11px]">
                      {tx.timestamp}
                    </td>
                    <td className="p-3 pr-4 text-center align-middle">
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] py-0">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Completed
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
