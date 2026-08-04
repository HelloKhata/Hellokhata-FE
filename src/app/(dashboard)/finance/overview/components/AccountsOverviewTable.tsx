'use client';

import React from 'react';
import { AccountOverview } from '@/types/finance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Landmark, Wallet, CreditCard, Smartphone, Eye, FileText, ArrowLeftRight } from 'lucide-react';
import Link from 'next/link';

interface AccountsOverviewTableProps {
  accounts: AccountOverview[];
}

export const AccountsOverviewTable: React.FC<AccountsOverviewTableProps> = ({
  accounts,
}) => {
  const formatCurrency = (val: number) => `৳${val.toLocaleString('en-BD')}`;

  const getAccountIcon = (type: AccountOverview['accountType']) => {
    switch (type) {
      case 'Cash':
        return <Wallet className="h-4 w-4 text-emerald-500" />;
      case 'Bank':
        return <Landmark className="h-4 w-4 text-blue-500" />;
      case 'Mobile Banking':
        return <Smartphone className="h-4 w-4 text-pink-500" />;
      case 'Credit Card':
        return <CreditCard className="h-4 w-4 text-purple-500" />;
    }
  };

  const getBadgeVariant = (type: AccountOverview['accountType']) => {
    switch (type) {
      case 'Cash':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200';
      case 'Bank':
        return 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200';
      case 'Mobile Banking':
        return 'bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 border-pink-200';
      case 'Credit Card':
        return 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200';
    }
  };

  return (
    <Card className="border border-border/60 shadow-2xs bg-card">
      <CardHeader className="p-4 pb-3 border-b border-border/40 flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Landmark className="h-4 w-4 text-primary" />
          Accounts & Liquid Balances Overview
        </CardTitle>
        <Link href="/finance/banks">
          <Button variant="ghost" size="sm" className="h-7 text-xs font-medium text-primary hover:text-primary">
            Manage Accounts
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-muted/40 border-b border-border/50 text-muted-foreground uppercase font-semibold text-[10px]">
                <th className="p-3 pl-4">Account Name</th>
                <th className="p-3">Type</th>
                <th className="p-3 text-right">Current Balance</th>
                <th className="p-3 text-right">Available Balance</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {accounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3 pl-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-muted/60 flex items-center justify-center shrink-0">
                        {getAccountIcon(acc.accountType)}
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-bold text-foreground block">
                          {acc.accountName}
                        </span>
                        {acc.accountNumber && (
                          <span className="text-[10px] text-muted-foreground font-mono block">
                            {acc.accountNumber}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 align-middle">
                    <Badge variant="outline" className={`text-[10px] font-medium ${getBadgeVariant(acc.accountType)}`}>
                      {acc.accountType}
                    </Badge>
                  </td>
                  <td className="p-3 text-right font-mono font-bold align-middle">
                    <span className={acc.currentBalance < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-foreground'}>
                      {formatCurrency(acc.currentBalance)}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono text-muted-foreground align-middle">
                    {formatCurrency(acc.availableBalance)}
                  </td>
                  <td className="p-3 text-center align-middle">
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] py-0 capitalize">
                      {acc.status}
                    </Badge>
                  </td>
                  <td className="p-3 pr-4 text-right align-middle">
                    <div className="flex items-center justify-end gap-1">
                      <Link href="/finance/transactions">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs px-2 gap-1 text-muted-foreground hover:text-foreground"
                          title="View Ledger"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          Ledger
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
