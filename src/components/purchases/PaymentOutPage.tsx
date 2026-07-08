'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Search,
  Calendar,
  MoreVertical,
  FileText,
  ArrowUpDown,
  Loader2,
} from 'lucide-react';
import { AddPaymentOutModal } from '@/components/parties/AddPaymentOutModal';
import { PaymentDetailsModal } from '@/components/parties/PaymentDetailsModal';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { useGetPaymentList } from '@/hooks/api/usePayments';

export default function PaymentOutPage() {
  const { isBangla } = useAppTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentModeFilter, setPaymentModeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);

  // Fetch payment list from API
  const { data: paymentResponse, isLoading, isError } = useGetPaymentList('paid');
  const transactions = paymentResponse?.data?.data ?? paymentResponse?.data ?? [];

  // Helper to format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Filtering & sorting
  const filteredTransactions = useMemo(() => {
    if (!Array.isArray(transactions)) return [];

    return transactions
      .filter((tx: any) => {
        const partyName = tx.party?.name || '';
        const receiptNo = tx.reference || '';
        const remarks = tx.notes || '';
        const mode = tx.mode || '';

        const matchesSearch =
          partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(receiptNo).includes(searchTerm) ||
          remarks.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesMode =
          paymentModeFilter === 'all' ||
          mode.toLowerCase() === paymentModeFilter.toLowerCase();

        return matchesSearch && matchesMode;
      })
      .sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      });
  }, [transactions, searchTerm, paymentModeFilter, sortOrder]);

  return (
    <>
      <div className="space-y-6 text-foreground">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              {isBangla ? `পেমেন্ট আউট (${filteredTransactions.length})` : `Payment Out (${filteredTransactions.length})`}
            </h1>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center gap-2 h-10 px-4 rounded-lg"
          >
            <Plus className="h-4 w-4" />
            <span>{isBangla ? 'পেমেন্ট প্রদান' : 'Add Payment'}</span>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={isBangla ? 'পেমেন্ট আউট খুঁজুন...' : 'Search Payment Out...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-10 bg-[#0f0f10] border-border text-sm text-white rounded-lg focus-visible:ring-emerald-500"
              />
            </div>

            {/* Payment Mode Filter */}
            <Select value={paymentModeFilter} onValueChange={setPaymentModeFilter}>
              <SelectTrigger className="w-48 h-10 bg-[#0f0f10] border-emerald-500/30 text-white focus:ring-emerald-500 rounded-lg">
                <SelectValue placeholder="All Payment Modes" />
              </SelectTrigger>
              <SelectContent className="bg-[#0f0f10] border-border text-white">
                <SelectItem value="all">{isBangla ? 'সব পেমেন্ট মোড' : 'All Payment Modes'}</SelectItem>
                <SelectItem value="cash">{isBangla ? 'ক্যাশ' : 'Cash'}</SelectItem>
                <SelectItem value="card">{isBangla ? 'কার্ড' : 'Card'}</SelectItem>
                <SelectItem value="mobile banking">{isBangla ? 'মোবাইল ব্যাংকিং' : 'Mobile Banking'}</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Filter */}
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-40 h-10 bg-[#0f0f10] border-border text-white rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="All Date" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-[#0f0f10] border-border text-white">
                <SelectItem value="all">{isBangla ? 'সব তারিখ' : 'All Date'}</SelectItem>
                <SelectItem value="today">{isBangla ? 'আজ' : 'Today'}</SelectItem>
                <SelectItem value="yesterday">{isBangla ? 'গতকাল' : 'Yesterday'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="h-10 w-10 bg-[#0f0f10] border-border text-white hover:bg-muted/10 rounded-lg"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>

        {/* Transactions Table */}
        <div className="border border-border rounded-xl overflow-hidden bg-[#0f0f10]/80">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-[#18181b] text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
                  <th className="p-4">{isBangla ? 'রসিদ নং' : 'Receipt No'}</th>
                  <th className="p-4">{isBangla ? 'পার্টির নাম' : 'Party Name'}</th>
                  <th className="p-4">{isBangla ? 'তারিখ' : 'Date'}</th>
                  <th className="p-4">{isBangla ? 'পেমেন্ট মোড' : 'Payment Mode'}</th>
                  <th className="p-4">{isBangla ? 'পরিমাণ' : 'Amount'}</th>
                  <th className="p-4">{isBangla ? 'মন্তব্য' : 'Remarks'}</th>
                  <th className="p-4 text-center">{isBangla ? 'অ্যাকশন' : 'Action'}</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
                        <span>{isBangla ? 'লোড হচ্ছে...' : 'Loading payments...'}</span>
                      </div>
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-rose-500">
                      {isBangla ? 'ডেটা লোড করতে সমস্যা হয়েছে' : 'Failed to load payments'}
                    </td>
                  </tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      {isBangla ? 'কোনো লেনদেন পাওয়া যায়নি' : 'No transactions found'}
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx: any) => (
                    <tr
                      key={tx.id}
                      className="border-b border-border last:border-0 hover:bg-[#18181b]/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedPaymentId(tx.id)}
                    >
                      <td className="p-4 text-muted-foreground font-medium">
                        {tx.reference || '—'}
                        {console.log('reference',tx.reference)}
                      </td>
                      <td className="p-4 font-bold text-white">{tx.party?.name || '—'}</td>
                      <td className="p-4 text-muted-foreground">{formatDate(tx.createdAt)}</td>
                      <td className="p-4 text-white capitalize">{tx.mode || '—'}</td>
                      <td className="p-4 font-bold text-white">Tk. {Math.abs(tx.amount)}</td>
                      <td className="p-4 text-muted-foreground">{tx.notes || '—'}</td>
                      <td className="p-4 text-center flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-white p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPaymentId(tx.id);
                          }}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddPaymentOutModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {selectedPaymentId && (
        <PaymentDetailsModal
          isOpen={!!selectedPaymentId}
          onClose={() => setSelectedPaymentId(null)}
          paymentId={selectedPaymentId}
        />
      )}
    </>
  );
}
