'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Search,
  Download,
  CreditCard,
  ArrowRight,
  Phone,
  Store,
} from 'lucide-react';
import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

interface PayablesTabProps {
  partyStats: any;
  suppliers: any[];
  isLoading: boolean;
  searchTerm: string;
  onSearchChange: (search: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  onExportCsv: () => void;
}

export function PayablesTab({
  partyStats,
  suppliers,
  isLoading,
  searchTerm,
  onSearchChange,
  currentPage,
  onPageChange,
  onExportCsv,
}: PayablesTabProps) {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();

  const totalPayable = Number(partyStats?.totalPayable || 0);
  const totalSupplierCount = Number(partyStats?.suppliers || 0);

  return (
    <div className="space-y-6">
      {/* 1. Metric Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl p-5 bg-card/70 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">
              {isBangla ? 'সর্বমোট সরবরাহকারী দেনা (প্রদেয়)' : 'Total Outstanding Payables'}
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-500">
            {formatCurrency(totalPayable)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {isBangla ? 'পণ্য সরবরাহকারী ও ভেন্ডরদের অপরিশোধিত বাকি' : 'Total credit balance due to suppliers & vendors'}
          </p>
        </div>

        <div className="rounded-2xl p-5 bg-card/70 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">
              {isBangla ? 'দেনা থাকা সরবরাহকারী সংখ্যা' : 'Suppliers with Outstanding Balance'}
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {totalSupplierCount}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {isBangla ? 'সক্রিয় সরবরাহকারী যাদের পেমেন্ট বাকি আছে' : 'Registered vendors with outstanding credit'}
          </p>
        </div>
      </div>

      {/* 2. Controls & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card/60 backdrop-blur-xl p-3 rounded-2xl border border-white/10 dark:border-white/5 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={isBangla ? 'সরবরাহকারীর নাম বা ফোন নম্বর দিয়ে খুঁজুন...' : 'Search supplier by name or phone...'}
            className="pl-9 h-9 text-xs bg-background/50 rounded-xl border-border/60"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onExportCsv}
            className="h-9 px-3 rounded-xl text-xs gap-1.5 border-border/60 bg-background/50 hover:bg-muted font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isBangla ? 'CSV এক্সপোর্ট' : 'Export CSV'}</span>
          </Button>
          <Button
            asChild
            size="sm"
            className="h-9 px-3 rounded-xl text-xs gap-1.5 font-medium"
          >
            <Link href="/parties?type=supplier">
              <span>{isBangla ? 'সরবরাহকারী তালিকা' : 'Manage Suppliers'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* 3. Suppliers Payables Table */}
      <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border/60">
              <tr>
                <th className="py-3 px-4 font-semibold">{isBangla ? 'সরবরাহকারীর নাম' : 'Supplier / Vendor'}</th>
                <th className="py-3 px-4 font-semibold">{isBangla ? 'মোবাইল নম্বর' : 'Phone'}</th>
                <th className="py-3 px-4 font-semibold">{isBangla ? 'শাখা / স্টোর' : 'Branch / Store'}</th>
                <th className="py-3 px-4 font-semibold text-right">{isBangla ? 'প্রদেয় পরিমাণ (দেনা)' : 'Payable Balance'}</th>
                <th className="py-3 px-4 font-semibold text-center">{isBangla ? 'অ্যাকশন' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="py-3.5 px-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="py-3.5 px-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="py-3.5 px-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="py-3.5 px-4 text-right"><Skeleton className="h-4 w-20 ml-auto" /></td>
                    <td className="py-3.5 px-4 text-center"><Skeleton className="h-4 w-12 mx-auto" /></td>
                  </tr>
                ))
              ) : suppliers && suppliers.length > 0 ? (
                suppliers.map((s: any) => {
                  const dueAmount = Math.abs(Number(s.currentBalance || s.totalDue || 0));

                  return (
                    <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-foreground">
                        <div>{s.name || (isBangla ? 'সরবরাহকারী' : 'Supplier')}</div>
                        {s.companyName && (
                          <div className="text-[10px] text-muted-foreground">{s.companyName}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap font-mono">
                        {s.phone || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                        {s.storeName || s.branch?.name || (isBangla ? 'প্রধান শাখা' : 'Main Branch')}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-purple-500 whitespace-nowrap">
                        {formatCurrency(dueAmount)}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <Link
                          href={`/parties/${s.id}`}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                        >
                          <span>{isBangla ? 'লেজার দেখুন' : 'Ledger'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground text-xs">
                    {isBangla ? 'কোনো সরবরাহকারী দেনা পাওয়া যায়নি।' : 'No outstanding payables to suppliers found.'}
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
