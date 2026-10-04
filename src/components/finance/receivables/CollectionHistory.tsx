'use client';

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, History, ArrowUpDown } from 'lucide-react';
import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import { useGetPaymentList } from '@/hooks/api/usePayments';
import { cn } from '@/lib/utils';

export interface CollectionLog {
  id: string;
  date: string;
  customerName: string;
  customerNameBn?: string;
  amount: number;
  discount?: number;
  method: string;
  methodBn?: string;
  ref?: string;
}

interface CollectionHistoryProps {
  logs?: CollectionLog[];
}

export function CollectionHistory({ logs }: CollectionHistoryProps) {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();

  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Query live payment list if available
  const { data: paymentResponse, isLoading } = useGetPaymentList('received');
  const apiTransactions = useMemo(() => {
    const raw = paymentResponse?.data?.data ?? paymentResponse?.data;
    if (!Array.isArray(raw)) return [];
    return raw.map((tx: any) => ({
      id: tx.reference || tx.id || `REC-${tx._id?.slice(-6) || '000'}`,
      date: tx.createdAt ? new Date(tx.createdAt).toLocaleDateString(isBangla ? 'bn-BD' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—',
      rawDate: tx.createdAt ? new Date(tx.createdAt).getTime() : 0,
      customerName: tx.party?.name || 'Walk-in Customer',
      customerNameBn: tx.party?.nameBn || tx.party?.name || 'কাস্টমার',
      amount: tx.amount || 0,
      discount: tx.discount || 0,
      method: tx.mode || tx.method || 'Cash',
      methodBn: tx.mode === 'bank' || tx.method === 'Bank Transfer' ? 'ব্যাংক স্থানান্তর' : tx.mode === 'mobile_banking' ? 'মোবাইল ওয়ালেট' : 'নগদ টাকা',
      ref: tx.notes || tx.remarks || 'Collection',
    }));
  }, [paymentResponse, isBangla]);

  // Combine API transactions or fallback to local logs prop
  const combinedLogs: CollectionLog[] = useMemo(() => {
    if (apiTransactions && apiTransactions.length > 0) {
      return apiTransactions;
    }
    return logs || [];
  }, [apiTransactions, logs]);

  // Filter & Search Logic
  const filteredLogs = useMemo(() => {
    return combinedLogs
      .filter((log) => {
        const matchesSearch =
          log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (log.customerNameBn && log.customerNameBn.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (log.ref && log.ref.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesMethod =
          methodFilter === 'all' ||
          log.method.toLowerCase().includes(methodFilter.toLowerCase());

        return matchesSearch && matchesMethod;
      })
      .sort((a: any, b: any) => {
        const timeA = a.rawDate || new Date(a.date).getTime() || 0;
        const timeB = b.rawDate || new Date(b.date).getTime() || 0;
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [combinedLogs, searchTerm, methodFilter, sortOrder]);

  return (
    <Card className="border-border/50 overflow-hidden shadow-sm">
      {/* Filter toolbar */}
      <div className="p-3 border-b border-border/30 bg-muted/20 flex flex-col sm:flex-row gap-2.5 items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold text-foreground">
            {isBangla ? 'আদায় সংগ্রহ লগ ও ইতিহাস' : 'Collection History Records'}
          </span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4.5 font-mono">
            {filteredLogs.length}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          <div className="relative w-full sm:w-44">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder={isBangla ? 'রিসিট বা নাম খুঁজুন...' : 'Search receipt or party...'}
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
            <option value="bank">{isBangla ? 'ব্যাংক' : 'Bank Transfer'}</option>
            <option value="cash">{isBangla ? 'নগদ (Cash)' : 'Cash'}</option>
            <option value="mobile">{isBangla ? 'মোবাইল ওয়ালেট' : 'Mobile Banking'}</option>
          </select>

          <button
            type="button"
            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
            className="h-8 px-2.5 rounded-lg border border-border/30 bg-background/50 text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <ArrowUpDown className="h-3 w-3" />
            <span>{sortOrder === 'desc' ? (isBangla ? 'নতুন আগে' : 'Newest') : (isBangla ? 'পুরনো আগে' : 'Oldest')}</span>
          </button>
        </div>
      </div>

      {/* Table view */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-muted/40 border-b border-border/30 font-bold text-muted-foreground">
              <th className="p-3">{isBangla ? 'রিসিট নম্বর' : 'Receipt Ref'}</th>
              <th className="p-3">{isBangla ? 'তারিখ' : 'Date'}</th>
              <th className="p-3">{isBangla ? 'গ্রাহক' : 'Customer'}</th>
              <th className="p-3">{isBangla ? 'পেমেন্ট পদ্ধতি' : 'Method'}</th>
              <th className="p-3">{isBangla ? 'নোট / বিবরণ' : 'Remarks'}</th>
              <th className="p-3 text-right">{isBangla ? 'ডিসকাউন্ট/ছাড়' : 'Write-off Discount'}</th>
              <th className="p-3 text-right">{isBangla ? 'মোট সংগৃহীত পরিমাণ' : 'Collected Net'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/10">
            {isLoading && combinedLogs.length === 0 ? (
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
            ) : filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground font-semibold">
                  {isBangla ? 'কোনো আদায় সংগ্রহের রেকর্ড পাওয়া যায়নি।' : 'No collection log records found.'}
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/5 transition-colors">
                  <td className="p-3 font-mono font-bold text-primary">{log.id}</td>
                  <td className="p-3 font-mono text-muted-foreground">{log.date}</td>
                  <td className="p-3 font-semibold text-foreground">
                    {isBangla && log.customerNameBn ? log.customerNameBn : log.customerName}
                  </td>
                  <td className="p-3 text-muted-foreground">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-muted/60 text-foreground">
                      {isBangla && log.methodBn ? log.methodBn : log.method}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground max-w-[160px] truncate" title={log.ref}>
                    {log.ref || '—'}
                  </td>
                  <td className="p-3 text-right font-mono text-rose-500">
                    {log.discount && log.discount > 0 ? formatCurrency(log.discount) : '—'}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-500 text-sm">
                    {formatCurrency(log.amount)}
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
