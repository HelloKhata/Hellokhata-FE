'use client';

import { useState } from 'react';
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
  CreditCard,
  Plus,
  Search,
  Calendar,
  MoreVertical,
  FileText,
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';
import { AddPaymentInModal } from '@/components/parties/AddPaymentInModal';
import { useAppTranslation } from '@/hooks/useAppTranslation';

interface PaymentTransaction {
  receiptNo: string;
  partyName: string;
  date: string;
  paymentMode: string;
  amount: number;
  remarks: string;
}

export default function PaymentInPage() {
  const { isBangla } = useAppTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentModeFilter, setPaymentModeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Mock Transactions for Payment In
  const [transactions] = useState<PaymentTransaction[]>([
    {
      receiptNo: '3',
      partyName: 'Sweet',
      date: '28 Jun 2026',
      paymentMode: 'Mobile Banking',
      amount: 1500,
      remarks: 'Invoice #1023 payment',
    },
    {
      receiptNo: '2',
      partyName: 'Robin',
      date: '25 Jun 2026',
      paymentMode: 'Cash',
      amount: 800,
      remarks: '--',
    },
    {
      receiptNo: '1',
      partyName: 'John',
      date: '23 Jun 2026',
      paymentMode: 'Card',
      amount: 120,
      remarks: 'Advance',
    },
  ]);

  // Filtering
  const filteredTransactions = transactions
    .filter((tx) => {
      const matchesSearch =
        tx.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.receiptNo.includes(searchTerm) ||
        tx.remarks.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesMode =
        paymentModeFilter === 'all' ||
        tx.paymentMode.toLowerCase() === paymentModeFilter.toLowerCase();
      
      return matchesSearch && matchesMode;
    })
    .sort((a, b) => {
      const numA = parseInt(a.receiptNo);
      const numB = parseInt(b.receiptNo);
      return sortOrder === 'desc' ? numB - numA : numA - numB;
    });

  return (
    <>
      <div className="space-y-6 text-foreground">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              {isBangla ? `পেমেন্ট ইন (${filteredTransactions.length})` : `Payment In (${filteredTransactions.length})`}
            </h1>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center gap-2 h-10 px-4 rounded-lg"
          >
            <Plus className="h-4 w-4" />
            <span>{isBangla ? 'পেমেন্ট গ্রহণ' : 'Add Payment In'}</span>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={isBangla ? 'পেমেন্ট ইন খুঁজুন...' : 'Search Payment In...'}
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
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      {isBangla ? 'কোনো লেনদেন পাওয়া যায়নি' : 'No transactions found'}
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <tr
                      key={tx.receiptNo}
                      className="border-b border-border last:border-0 hover:bg-[#18181b]/50 transition-colors"
                    >
                      <td className="p-4 text-muted-foreground font-medium">{tx.receiptNo}</td>
                      <td className="p-4 font-bold text-white">{tx.partyName}</td>
                      <td className="p-4 text-muted-foreground">{tx.date}</td>
                      <td className="p-4 text-white">{tx.paymentMode}</td>
                      <td className="p-4 font-bold text-white">Tk. {tx.amount}</td>
                      <td className="p-4 text-muted-foreground">{tx.remarks}</td>
                      <td className="p-4 text-center flex items-center justify-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white p-0">
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

      <AddPaymentInModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </>
  );
}
