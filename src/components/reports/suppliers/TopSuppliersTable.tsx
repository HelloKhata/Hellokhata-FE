// Hello Khata OS - Top Suppliers Table (Key Vendor Ranking)
// হ্যালো খাতা - শীর্ষ সরবরাহকারী তালিকা

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Truck,
  Building2,
  Phone,
  Crown,
} from 'lucide-react';
import { useCurrency } from '@/hooks/useAppTranslation';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { TopSupplierItem } from './types';

interface TopSuppliersTableProps {
  suppliers: TopSupplierItem[];
  isBangla?: boolean;
}

export function TopSuppliersTable({
  suppliers,
  isBangla = false,
}: TopSuppliersTableProps) {
  const { formatCurrency } = useCurrency();

  const [sortBy, setSortBy] = useState<'purchases' | 'due' | 'invoices'>('purchases');

  const sortedSuppliers = [...suppliers].sort((a, b) => {
    switch (sortBy) {
      case 'due':
        return b.currentDue - a.currentDue;
      case 'invoices':
        return b.invoicesCount - a.invoicesCount;
      case 'purchases':
      default:
        return b.totalPurchases - a.totalPurchases;
    }
  });

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Header & Sorting Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              {isBangla ? 'শীর্ষ সরবরাহকারী (Top Vendors)' : 'Top Strategic Suppliers'}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {isBangla ? 'সর্বোচ্চ পণ্য সরবরাহকারী প্রধান বাণিজ্য সহযোগী' : 'Highest procurement volume and fulfillment partners'}
            </p>
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center bg-muted/40 p-0.5 rounded-xl border border-border/60 text-xs self-start sm:self-auto">
          {[
            { id: 'purchases', label: 'Highest Purchases', labelBn: 'সর্বোচ্চ ক্রয়' },
            { id: 'due', label: 'Highest Payable', labelBn: 'সর্বোচ্চ দেনা' },
            { id: 'invoices', label: 'Most Bills', labelBn: 'বেশি চালান' },
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
              <th className="pb-2.5 font-medium">{isBangla ? 'সরবরাহকারী' : 'Supplier'}</th>
              <th className="pb-2.5 font-medium text-center">{isBangla ? 'চালান' : 'Bills'}</th>
              <th className="pb-2.5 font-medium text-right">{isBangla ? 'মোট ক্রয়' : 'Total Purchases'}</th>
              <th className="pb-2.5 font-medium text-right">{isBangla ? 'পরিশোধ' : 'Paid Out'}</th>
              <th className="pb-2.5 font-medium text-right">{isBangla ? 'প্রদেয় দেনা' : 'Payable Due'}</th>
              <th className="pb-2.5 font-medium text-right">{isBangla ? 'সর্বশেষ চালান' : 'Last Delivery'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 font-mono text-[11.5px]">
            {sortedSuppliers.map((sup) => (
              <tr key={sup.id} className="hover:bg-muted/30 transition-colors group">
                {/* Supplier Info */}
                <td className="py-2.5 font-sans">
                  <Link href={`/suppliers`} className="flex items-center gap-2.5 group-hover:text-primary transition-colors">
                    <div
                      className={cn(
                        'w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 text-white',
                        sup.avatarColor
                      )}
                    >
                      {sup.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-foreground truncate">{sup.name}</span>
                        {sup.tier === 'Strategic' && (
                          <Badge className="h-4 px-1 text-[9px] font-bold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30">
                            Key Vendor
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
                        <span>{sup.category}</span>
                        <span>•</span>
                        <span>{sup.phone}</span>
                      </div>
                    </div>
                  </Link>
                </td>

                <td className="py-2.5 text-center font-bold text-foreground font-mono">
                  {sup.invoicesCount}
                </td>

                <td className="py-2.5 text-right font-bold text-foreground">
                  {formatCurrency(sup.totalPurchases)}
                </td>

                <td className="py-2.5 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                  {formatCurrency(sup.totalPaid)}
                </td>

                <td className="py-2.5 text-right">
                  {sup.currentDue > 0 ? (
                    <span className="font-bold text-rose-600 dark:text-rose-400">
                      {formatCurrency(sup.currentDue)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground font-sans text-[11px]">Paid Clear</span>
                  )}
                </td>

                <td className="py-2.5 text-right text-muted-foreground font-sans text-[11px]">
                  {sup.lastSupplyDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
