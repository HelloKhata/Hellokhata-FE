// Hello Khata OS - 05. Sales Records (Vibrant, Colorful Table & Mobile Cards)
// হ্যালো খাতা - বিক্রয় রেকর্ডস টেবিল (কালারফুল ব্যাজ ও ইনলাইন এক্সপ্যানশন)

'use client';

import React, { useState } from 'react';
import { useSalesFocus } from './SalesFocusContext';
import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import { SalesTransactionRecord } from '@/types/sales-report';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Search,
  ChevronDown,
  ChevronUp,
  Printer,
  Receipt,
  User,
  Building2,
  CreditCard,
  Package,
  FileText,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SalesRecordsProps {
  onPrintInvoice?: (record: SalesTransactionRecord) => void;
}

export function SalesRecords({ onPrintInvoice }: SalesRecordsProps) {
  const { isBangla } = useAppTranslation();
  const { formatCurrency, formatNumber } = useCurrency();
  const { reportData, focus } = useSalesFocus();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>(null);

  const records = reportData.records;

  const filteredRecords = records.filter((r) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      r.invoiceNo.toLowerCase().includes(term) ||
      r.customerName.toLowerCase().includes(term) ||
      r.paymentMethod.toLowerCase().includes(term) ||
      r.salesperson.toLowerCase().includes(term)
    );
  });

  const toggleExpand = (id: string) => {
    setExpandedInvoiceId(expandedInvoiceId === id ? null : id);
  };

  const getStatusBadge = (status: 'paid' | 'partial' | 'due') => {
    switch (status) {
      case 'paid':
        return (
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            {isBangla ? 'পরিশোধিত' : 'Paid'}
          </span>
        );
      case 'partial':
        return (
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
            {isBangla ? 'আংশিক' : 'Partial'}
          </span>
        );
      case 'due':
      default:
        return (
          <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/15 px-2.5 py-0.5 rounded-full border border-rose-500/30">
            {isBangla ? 'বকেয়া' : 'Due'}
          </span>
        );
    }
  };

  const getPaymentMethodBadge = (method: string) => {
    const lower = method.toLowerCase();
    if (lower.includes('bkash')) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-pink-500/15 text-pink-600 dark:text-pink-400 border border-pink-500/25">
          bKash
        </span>
      );
    }
    if (lower.includes('nagad')) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/25">
          Nagad
        </span>
      );
    }
    if (lower.includes('bank')) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/25">
          Bank
        </span>
      );
    }
    if (lower.includes('credit')) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25">
          Credit
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
        Cash
      </span>
    );
  };

  return (
    <div id="sales-records-section" className="p-5 sm:p-6 bg-gradient-to-br from-card via-card to-muted/20 rounded-3xl border border-border/70 shadow-lg shadow-black/5 space-y-4">
      {/* Header: Section Title + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-xs">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground tracking-tight">
                {isBangla ? 'বিক্রয় লেনদেন অডিট ও রেকর্ডস' : 'Sales Invoices & Audit Records'}
              </h3>
              <span className="text-xs font-bold text-primary font-mono bg-primary/10 px-2 py-0.2 rounded-full border border-primary/20">
                {formatNumber(filteredRecords.length)} {isBangla ? 'টি ইনভয়েস' : 'invoices'}
              </span>
            </div>
            {focus && (
              <p className="text-[11px] text-primary font-medium mt-0.5">
                {isBangla
                  ? `নির্বাচিত আইটেম (${focus.name}) সম্পর্কিত লেনদেন দেখানো হচ্ছে`
                  : `Filtered to transactions containing "${focus.name}"`}
              </p>
            )}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="text"
            placeholder={isBangla ? 'ইনভয়েস বা গ্রাহক খুঁজুন...' : 'Search invoice or customer...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 pl-9 text-xs bg-background/80 border-border/70 rounded-xl"
          />
        </div>
      </div>

      {/* Desktop Table View with Inline Row Expansion */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border/60 text-muted-foreground font-bold uppercase text-[10px] tracking-wider">
              <th className="py-3 px-3">{isBangla ? 'ইনভয়েস' : 'Invoice'}</th>
              <th className="py-3 px-3">{isBangla ? 'তারিখ' : 'Date'}</th>
              <th className="py-3 px-3">{isBangla ? 'গ্রাহক' : 'Customer'}</th>
              <th className="py-3 px-3 text-center">{isBangla ? 'পেমেন্ট মাধ্যম' : 'Method'}</th>
              <th className="py-3 px-3 text-center">{isBangla ? 'আইটেম' : 'Items'}</th>
              <th className="py-3 px-3 text-right">{isBangla ? 'পরিমাণ' : 'Amount'}</th>
              <th className="py-3 px-3 text-center">{isBangla ? 'স্ট্যাটাস' : 'Status'}</th>
              <th className="py-3 px-2 w-8 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-muted-foreground text-xs">
                  {isBangla ? 'কোন বিক্রয় রেকর্ড পাওয়া যায়নি' : 'No sales records found'}
                </td>
              </tr>
            ) : (
              filteredRecords.map((record) => {
                const isExpanded = expandedInvoiceId === record.id;

                return (
                  <React.Fragment key={record.id}>
                    <tr
                      onClick={() => toggleExpand(record.id)}
                      className={`hover:bg-muted/50 cursor-pointer transition-colors group select-none ${
                        isExpanded ? 'bg-primary/5 font-semibold' : ''
                      }`}
                    >
                      <td className="py-3 px-3 font-mono font-bold text-foreground group-hover:text-primary transition-colors">
                        <span className="bg-muted px-2 py-0.5 rounded-md border border-border/50">
                          {record.invoiceNo}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground whitespace-nowrap font-medium">
                        {record.date}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-foreground">{record.customerName}</div>
                        {record.customerPhone && (
                          <div className="text-[10px] text-muted-foreground">{record.customerPhone}</div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {getPaymentMethodBadge(record.paymentMethod)}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-muted-foreground">
                        {record.itemsCount}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-black text-foreground">
                        {formatCurrency(record.amount)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {getStatusBadge(record.paymentStatus)}
                      </td>
                      <td className="py-3 px-2 text-center">
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-primary" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground" />
                        )}
                      </td>
                    </tr>

                    {/* Inline Expanded Detail Row */}
                    {isExpanded && (
                      <tr className="bg-muted/20">
                        <td colSpan={8} className="p-4 border-b border-border/40">
                          <div className="space-y-3 bg-card p-4 rounded-2xl border border-primary/20 shadow-md">
                            {/* Summary header */}
                            <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-border/40 pb-2.5">
                              <div className="flex items-center gap-4 flex-wrap text-muted-foreground">
                                <span className="flex items-center gap-1.5 bg-muted/60 px-2 py-1 rounded-lg">
                                  <User className="h-3.5 w-3.5 text-primary" />
                                  <strong className="text-foreground">{isBangla ? 'বিক্রয়কর্মী:' : 'Salesperson:'}</strong> {record.salesperson}
                                </span>
                                <span className="flex items-center gap-1.5 bg-muted/60 px-2 py-1 rounded-lg">
                                  <Building2 className="h-3.5 w-3.5 text-primary" />
                                  <strong className="text-foreground">{isBangla ? 'শাখা:' : 'Branch:'}</strong> {record.branch}
                                </span>
                              </div>

                              <Button
                                type="button"
                                size="sm"
                                variant="default"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onPrintInvoice) onPrintInvoice(record);
                                }}
                                className="h-7 text-[11px] gap-1.5 font-bold shadow-xs cursor-pointer"
                              >
                                <Printer className="h-3 w-3" />
                                <span>{isBangla ? 'চালান প্রিন্ট / PDF' : 'Print Invoice'}</span>
                              </Button>
                            </div>

                            {/* Line items table with colorful columns */}
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="text-muted-foreground text-[10px] border-b border-border/40 uppercase font-bold">
                                    <th className="py-1.5 px-2 text-left">{isBangla ? 'পণ্য' : 'Item Description'}</th>
                                    <th className="py-1.5 px-2 text-center">{isBangla ? 'পরিমাণ' : 'Quantity'}</th>
                                    <th className="py-1.5 px-2 text-right">{isBangla ? 'একক মূল্য' : 'Unit Price'}</th>
                                    <th className="py-1.5 px-2 text-right">{isBangla ? 'ছাড়' : 'Discount'}</th>
                                    <th className="py-1.5 px-2 text-right">{isBangla ? 'মোট' : 'Total'}</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-border/20 font-mono">
                                  {record.items.map((item) => (
                                    <tr key={item.id}>
                                      <td className="py-2 px-2 font-sans font-semibold text-foreground">
                                        {isBangla && item.nameBn ? item.nameBn : item.name}
                                      </td>
                                      <td className="py-2 px-2 text-center font-bold text-primary">{item.quantity}</td>
                                      <td className="py-2 px-2 text-right">{formatCurrency(item.unitPrice)}</td>
                                      <td className="py-2 px-2 text-right text-rose-500 font-bold">
                                        {item.discount > 0 ? `−${formatCurrency(item.discount)}` : '—'}
                                      </td>
                                      <td className="py-2 px-2 text-right font-black text-foreground">
                                        {formatCurrency(item.total)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View with Colorful Badges */}
      <div className="sm:hidden space-y-2.5">
        {filteredRecords.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground text-xs">
            {isBangla ? 'কোন বিক্রয় রেকর্ড পাওয়া যায়নি' : 'No sales records found'}
          </div>
        ) : (
          filteredRecords.map((record) => {
            const isExpanded = expandedInvoiceId === record.id;

            return (
              <div
                key={record.id}
                onClick={() => toggleExpand(record.id)}
                className="p-3.5 bg-background/80 border border-border/60 rounded-2xl space-y-2.5 cursor-pointer transition-all shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs bg-muted px-2 py-0.5 rounded text-foreground">
                    {record.invoiceNo}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground font-mono font-medium">
                      {record.date}
                    </span>
                    {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-foreground">{record.customerName}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
                      <span>{record.itemsCount} {isBangla ? 'টি আইটেম' : 'items'}</span>
                      <span>•</span>
                      {getPaymentMethodBadge(record.paymentMethod)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-black text-foreground font-mono">
                      {formatCurrency(record.amount)}
                    </div>
                    <div className="mt-1">{getStatusBadge(record.paymentStatus)}</div>
                  </div>
                </div>

                {/* Mobile Inline Expanded Items */}
                {isExpanded && (
                  <div className="pt-3 border-t border-border/50 space-y-2 text-xs">
                    <div className="text-[11px] text-muted-foreground">
                      <div><strong>{isBangla ? 'বিক্রয়কর্মী:' : 'Salesperson:'}</strong> {record.salesperson}</div>
                      <div><strong>{isBangla ? 'শাখা:' : 'Branch:'}</strong> {record.branch}</div>
                    </div>

                    <div className="space-y-1 bg-muted/40 p-2.5 rounded-xl">
                      {record.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-[11px]">
                          <span>{item.quantity}x {isBangla && item.nameBn ? item.nameBn : item.name}</span>
                          <span className="font-mono font-bold">{formatCurrency(item.total)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
