// Hello Khata OS - Top Customers Table (High-Value Client Ranking)
// হ্যালো খাতা - শীর্ষ গ্রাহক তালিকা

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Star,
  ChevronRight,
  ArrowUpDown,
  Phone,
  User,
  ShoppingBag,
  CreditCard,
  Crown,
} from 'lucide-react';
import { useCurrency, useDateFormat } from '@/hooks/useAppTranslation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { TopCustomerItem } from './types';

interface TopCustomersTableProps {
  customers: TopCustomerItem[];
  isBangla?: boolean;
}

export function TopCustomersTable({
  customers,
  isBangla = false,
}: TopCustomersTableProps) {
  const { formatCurrency } = useCurrency();
  const { formatDate } = useDateFormat();

  const [sortBy, setSortBy] = useState<'sales' | 'due' | 'purchases' | 'recent'>('sales');

  const sortedCustomers = [...customers].sort((a, b) => {
    switch (sortBy) {
      case 'due':
        return b.currentDue - a.currentDue;
      case 'purchases':
        return b.purchasesCount - a.purchasesCount;
      case 'recent':
        return new Date(b.lastPurchaseDate).getTime() - new Date(a.lastPurchaseDate).getTime();
      case 'sales':
      default:
        return b.totalSales - a.totalSales;
    }
  });

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Header & Sorting Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Crown className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              {isBangla ? 'শীর্ষ গ্রাহক তালিকা (Top Customers)' : 'Top Customers'}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {isBangla ? 'সর্বোচ্চ কেনাকাটা ও অবদান রাখা সম্মানিত গ্রাহকগণ' : 'Highest spending and most frequent buyers'}
            </p>
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center bg-muted/40 p-0.5 rounded-xl border border-border/60 text-xs self-start sm:self-auto">
          {[
            { id: 'sales', label: 'Highest Sales', labelBn: 'সর্বোচ্চ বিক্রয়' },
            { id: 'due', label: 'Highest Due', labelBn: 'সর্বোচ্চ বাকি' },
            { id: 'purchases', label: 'Most Orders', labelBn: 'বেশি অর্ডার' },
          ].map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSortBy(s.id as any)}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                sortBy === s.id
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {isBangla ? s.labelBn : s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dense Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-border/60 text-[11px] text-muted-foreground font-semibold">
              <th className="pb-2.5 font-medium">{isBangla ? 'গ্রাহক' : 'Customer'}</th>
              <th className="pb-2.5 font-medium text-center">{isBangla ? 'অর্ডার সংখ্যা' : 'Orders'}</th>
              <th className="pb-2.5 font-medium text-right">{isBangla ? 'মোট বিক্রয়' : 'Total Sales'}</th>
              <th className="pb-2.5 font-medium text-right">{isBangla ? 'পরিশোধিত' : 'Paid'}</th>
              <th className="pb-2.5 font-medium text-right">{isBangla ? 'বকেয়া' : 'Due'}</th>
              <th className="pb-2.5 font-medium text-right">{isBangla ? 'সর্বশেষ ক্রয়' : 'Last Purchase'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 font-mono text-[11.5px]">
            {sortedCustomers.map((cust, idx) => (
              <tr key={cust.id} className="hover:bg-muted/30 transition-colors group">
                {/* Customer Info */}
                <td className="py-2.5 font-sans">
                  <Link href={`/customers`} className="flex items-center gap-2.5 group-hover:text-primary transition-colors">
                    <div
                      className={cn(
                        'w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 text-white',
                        cust.avatarColor
                      )}
                    >
                      {cust.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-foreground truncate">{cust.name}</span>
                        {cust.tier === 'VIP' && (
                          <Badge className="h-4 px-1 text-[9px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30">
                            VIP
                          </Badge>
                        )}
                      </div>
                      <span className="text-[10.5px] text-muted-foreground block font-mono">{cust.phone}</span>
                    </div>
                  </Link>
                </td>

                <td className="py-2.5 text-center font-bold text-foreground font-mono">
                  {cust.purchasesCount}
                </td>

                <td className="py-2.5 text-right font-bold text-foreground">
                  {formatCurrency(cust.totalSales)}
                </td>

                <td className="py-2.5 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                  {formatCurrency(cust.totalPaid)}
                </td>

                <td className="py-2.5 text-right">
                  {cust.currentDue > 0 ? (
                    <span className="font-bold text-rose-600 dark:text-rose-400">
                      {formatCurrency(cust.currentDue)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground font-sans text-[11px]">Paid In Full</span>
                  )}
                </td>

                <td className="py-2.5 text-right text-muted-foreground font-sans text-[11px]">
                  {cust.lastPurchaseDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
