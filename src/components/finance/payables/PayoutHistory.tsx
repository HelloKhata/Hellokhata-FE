'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, History, ArrowUpDown } from 'lucide-react';
import { useAppTranslation, useCurrency, useDateFormat } from '@/hooks/useAppTranslation';
import { useGetPaymentList } from '@/hooks/api/usePayments';

export interface PayoutItem {
  id: string;
  businessId?: string;
  branchId?: string;
  partyId?: string;
  type?: string;
  mode: string;
  accountId?: string | null;
  amount: number;
  reference?: string | null;
  saleId?: string | null;
  purchaseId?: string | null;
  paymentPlanId?: string | null;
  notes?: string | null;
  createdBy?: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
  discount?: number;
  party?: {
    id: string;
    name: string;
    phone?: string;
    type?: string;
  };
}

export type PayoutLog = PayoutItem;

interface PayoutHistoryProps {
  logs?: PayoutItem[];
}

export function PayoutHistory({ logs }: PayoutHistoryProps) {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const { formatDate } = useDateFormat();

  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Query live payment list for payout/paid payments
  const { data: apiData = [], isLoading } = useGetPaymentList('paid');
  const dataList: PayoutItem[] = (logs && logs.length > 0 ? logs : apiData) || [];

  const getMethodLabel = (mode: string) => {
    switch (mode?.toLowerCase()) {
      case 'cash':
        return isBangla ? 'নগদ (Cash)' : 'Cash';
      case 'bank':
        return isBangla ? 'ব্যাংক' : 'Bank';
      case 'mobile':
        return isBangla ? 'মোবাইল ওয়ালেট' : 'Mobile Banking';
      default:
        return mode || '—';
    }
  };

  // Direct filtering and sorting without memoization
  const filteredData = dataList
    .filter((item) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        item.reference?.toLowerCase().includes(term) ||
        item.id?.toLowerCase().includes(term) ||
        item.party?.name?.toLowerCase().includes(term) ||
        item.party?.phone?.toLowerCase().includes(term) ||
        item.notes?.toLowerCase().includes(term);

      const matchesMethod =
        methodFilter === 'all' || item.mode?.toLowerCase() === methodFilter.toLowerCase();

      return matchesSearch && matchesMethod;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  return (
    <Card className="border-border/50 overflow-hidden shadow-sm">
      {/* Filter toolbar */}
      <div className="p-3 border-b border-border/30 bg-muted/20 flex flex-col sm:flex-row gap-2.5 items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold text-foreground">
            {isBangla ? 'পরিশোধ লগ ও ইতিহাস' : 'Payout History Records'}
          </span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4.5 font-mono">
            {filteredData.length}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          <div className="relative w-full sm:w-44">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder={isBangla ? 'ভাউচার বা নাম খুঁজুন...' : 'Search voucher or supplier...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-8 text-[11px] bg-background/50 border-border/30 rounded-lg"
            />
          </div>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="h-8 rounded-lg border border-border/30 bg-background/50 px-2 text-[11px] text-muted-foreground focus:outline-none"
          >
            <option value="all">{isBangla ? 'সব পদ্ধতি' : 'All Methods'}</option>
            <option value="cash">{isBangla ? 'নগদ (Cash)' : 'Cash'}</option>
            <option value="bank">{isBangla ? 'ব্যাংক' : 'Bank Transfer'}</option>
            <option value="mobile">{isBangla ? 'মোবাইল ওয়ালেট' : 'Mobile Banking'}</option>
          </select>

          <button
            type="button"
            onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
            className="h-8 px-2.5 rounded-lg border border-border/30 bg-background/50 text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <ArrowUpDown className="h-3 w-3" />
            <span>
              {sortOrder === 'desc'
                ? isBangla
                  ? 'নতুন আগে'
                  : 'Newest'
                : isBangla
                ? 'পুরনো আগে'
                : 'Oldest'}
            </span>
          </button>
        </div>
      </div>

      {/* Table view */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-muted/40 border-b border-border/30 font-bold text-muted-foreground">
              <th className="p-3">{isBangla ? 'ভাউচার আইডি' : 'Payout Ref'}</th>
              <th className="p-3">{isBangla ? 'তারিখ' : 'Date'}</th>
              <th className="p-3">{isBangla ? 'সরবরাহকারী' : 'Supplier'}</th>
              <th className="p-3">{isBangla ? 'পেমেন্ট পদ্ধতি' : 'Method'}</th>
              <th className="p-3">{isBangla ? 'নোট / বিবরণ' : 'Remarks'}</th>
              <th className="p-3 text-right">{isBangla ? 'প্রাপ্ত ডিসকাউন্ট' : 'Discount Recd'}</th>
              <th className="p-3 text-right">{isBangla ? 'মোট পরিশোধিত পরিমাণ' : 'Payout Net'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/10">
            {isLoading && dataList.length === 0 ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx} className="border-b border-border/10">
                  <td className="p-3"><Skeleton className="h-4 w-20" /></td>
                  <td className="p-3"><Skeleton className="h-4 w-20" /></td>
                  <td className="p-3"><Skeleton className="h-4 w-28" /></td>
                  <td className="p-3"><Skeleton className="h-4 w-20" /></td>
                  <td className="p-3"><Skeleton className="h-4 w-24" /></td>
                  <td className="p-3 text-right"><Skeleton className="h-4 w-16 ml-auto" /></td>
                  <td className="p-3 text-right"><Skeleton className="h-4 w-20 ml-auto" /></td>
                </tr>
              ))
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground font-semibold">
                  {isBangla ? 'কোনো পরিশোধের রেকর্ড পাওয়া যায়নি।' : 'No payout log records found.'}
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-muted/5 transition-colors">
                  <td className="p-3 font-mono font-bold text-primary">
                    {item.reference ? `#${item.reference}` : item.id.slice(-6).toUpperCase()}
                  </td>
                  <td className="p-3 font-mono text-muted-foreground">
                    {item.createdAt ? formatDate(item.createdAt) : '—'}
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-foreground">
                      {item.party?.name || '—'}
                    </div>
                    {item.party?.phone && (
                      <div className="text-[10px] text-muted-foreground font-mono">
                        {item.party.phone}
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-muted-foreground">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-muted/60 text-foreground capitalize">
                      {getMethodLabel(item.mode)}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground max-w-[160px] truncate" title={item.notes || ''}>
                    {item.notes || '—'}
                  </td>
                  <td className="p-3 text-right font-mono text-emerald-600 dark:text-emerald-500">
                    {item.discount && item.discount > 0 ? formatCurrency(item.discount) : '—'}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-rose-600 dark:text-rose-400 text-sm">
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
