'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Download,
  Phone,
  AlertTriangle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Receipt,
  UserCheck,
} from 'lucide-react';
import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

interface ReceivablesTabProps {
  partyStats: any;
  customers: any[];
  isLoading: boolean;
  searchTerm: string;
  onSearchChange: (search: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  onExportCsv: () => void;
}

export function ReceivablesTab({
  partyStats,
  customers,
  isLoading,
  searchTerm,
  onSearchChange,
  currentPage,
  onPageChange,
  onExportCsv,
}: ReceivablesTabProps) {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();

  const totalReceivable = Number(partyStats?.totalReceivable || 0);
  const totalCustomerCount = Number(partyStats?.customers || 0);

  return (
    <div className="space-y-6">
      {/* 1. Metric Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl p-5 bg-card/70 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">
              {isBangla ? 'সর্বমোট গ্রাহক বকেয়া (পাওনা)' : 'Total Outstanding Receivables'}
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-500">
            {formatCurrency(totalReceivable)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {isBangla ? 'ক্রেতাদের কাছে ব্যবসায়িক মোট বাকি বা পাওনা' : 'Total dues owed by customers across all sales'}
          </p>
        </div>

        <div className="rounded-2xl p-5 bg-card/70 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">
              {isBangla ? 'বকেয়াযুক্ত গ্রাহক সংখ্যা' : 'Customers with Outstanding Balance'}
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {totalCustomerCount}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {isBangla ? 'সক্রিয় গ্রাহক যাদের হিসাব অপরিশোধিত রয়েছে' : 'Active buyers with outstanding credit ledger'}
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
            placeholder={isBangla ? 'গ্রাহকের নাম বা ফোন নম্বর দিয়ে খুঁজুন...' : 'Search customer by name or phone...'}
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
            <Link href="/parties?type=customer">
              <span>{isBangla ? 'পার্টি ম্যানেজমেন্ট' : 'Manage Parties'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* 3. Customers Receivables Table */}
      <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border/60">
              <tr>
                <th className="py-3 px-4 font-semibold">{isBangla ? 'গ্রাহকের নাম' : 'Customer Name'}</th>
                <th className="py-3 px-4 font-semibold">{isBangla ? 'মোবাইল নম্বর' : 'Phone'}</th>
                <th className="py-3 px-4 font-semibold">{isBangla ? 'শাখা / স্টোর' : 'Branch / Store'}</th>
                <th className="py-3 px-4 font-semibold text-right">{isBangla ? 'বকেয়া পরিমাণ' : 'Outstanding Balance'}</th>
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
              ) : customers && customers.length > 0 ? (
                customers.map((c: any) => {
                  const dueAmount = Math.abs(Number(c.currentBalance || c.totalDue || 0));

                  return (
                    <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-foreground">
                        <div>{c.name || (isBangla ? 'সাধারণ গ্রাহক' : 'Customer')}</div>
                        {c.address && c.address !== '-' && (
                          <div className="text-[10px] text-muted-foreground truncate max-w-[200px]">{c.address}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap font-mono">
                        {c.phone || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                        {c.storeName || c.branch?.name || (isBangla ? 'প্রধান শাখা' : 'Main Branch')}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-amber-500 whitespace-nowrap">
                        {formatCurrency(dueAmount)}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <Link
                          href={`/parties/${c.id}`}
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
                    {isBangla ? 'কোনো গ্রাহকের বকেয়া পাওয়া যায়নি।' : 'No customers with outstanding receivables found.'}
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
