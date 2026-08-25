// Hello Khata OS - Detailed Supplier Master Report Table
// হ্যালো খাতা - বিস্তারিত সরবরাহকারী মাস্টার লেজার টেবিল

'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Truck,
  Building2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCurrency, useDateFormat } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import type { SupplierDetailedRecord } from './types';

interface SupplierDetailedTableProps {
  records: SupplierDetailedRecord[];
  onExportExcel: () => void;
  isBangla?: boolean;
}

export function SupplierDetailedTable({
  records,
  onExportExcel,
  isBangla = false,
}: SupplierDetailedTableProps) {
  const { formatCurrency } = useCurrency();
  const { formatDate } = useDateFormat();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filtered & Paginated records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.supplierId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || r.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesCategory = categoryFilter === 'all' || r.category.toLowerCase() === categoryFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [records, searchTerm, statusFilter, categoryFilter]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(start, start + itemsPerPage);
  }, [filteredRecords, currentPage]);

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-foreground">
              {isBangla ? 'সরবরাহকারী বিস্তারিত লেজার ও দেনা খতিয়ান' : 'Supplier Master Procurement Ledger'}
            </h3>
            <Badge variant="outline" className="text-[10px] font-mono">
              {filteredRecords.length} {isBangla ? 'জন সরবরাহকারী' : 'Suppliers'}
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground">
            {isBangla ? 'প্রতিটি সরবরাহকারীর সামগ্রিক ক্রয়, পরিশোধ, বকেয়া দেনা এবং চালানের ইতিহাস' : 'Comprehensive procurement bills, disbursements, and payable balances'}
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={isBangla ? 'সরবরাহকারী বা ফোন খুঁজুন...' : 'Search supplier, phone, ID...'}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="h-8 pl-8 text-xs bg-muted/20 border-border rounded-xl"
            />
          </div>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-8 text-xs rounded-xl border-border bg-card w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border rounded-xl text-xs">
              <SelectItem value="all">{isBangla ? 'সকল স্ট্যাটাস' : 'All Status'}</SelectItem>
              <SelectItem value="active">{isBangla ? 'সক্রিয়' : 'Active'}</SelectItem>
              <SelectItem value="paid clear">{isBangla ? 'দেনা পরিশোধিত' : 'Paid Clear'}</SelectItem>
              <SelectItem value="overdue due">{isBangla ? 'দেনা বকেয়া' : 'Overdue Due'}</SelectItem>
            </SelectContent>
          </Select>

          {/* Export Excel Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onExportExcel}
            className="h-8 px-2.5 rounded-xl border-border bg-card hover:bg-muted text-xs text-foreground font-semibold gap-1.5 shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Excel</span>
          </Button>
        </div>
      </div>

      {/* Dense Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-border/60 text-[11px] text-muted-foreground font-semibold">
              <th className="pb-2.5 font-medium">{isBangla ? 'সরবরাহকারী ও কোড' : 'Supplier & ID'}</th>
              <th className="pb-2.5 font-medium">{isBangla ? 'ক্যাটাগরি ও শাখা' : 'Category / Branch'}</th>
              <th className="pb-2.5 font-medium text-center">{isBangla ? 'চালান' : 'Bills'}</th>
              <th className="pb-2.5 font-medium text-right">{isBangla ? 'মোট ক্রয়' : 'Total Purchases'}</th>
              <th className="pb-2.5 font-medium text-right">{isBangla ? 'পরিশোধিত' : 'Paid Out'}</th>
              <th className="pb-2.5 font-medium text-right">{isBangla ? 'প্রদেয় দেনা' : 'Payable Due'}</th>
              <th className="pb-2.5 font-medium text-right">{isBangla ? 'সর্বশেষ চালান' : 'Last Delivery'}</th>
              <th className="pb-2.5 font-medium text-right">{isBangla ? 'স্ট্যাটাস' : 'Status'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 font-mono text-[11.5px]">
            {paginatedRecords.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-muted-foreground font-sans">
                  {isBangla ? 'কোনো সরবরাহকারী পাওয়া যায়নি' : 'No supplier records match your filter criteria'}
                </td>
              </tr>
            ) : (
              paginatedRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-muted/30 transition-colors group">
                  {/* Supplier Info */}
                  <td className="py-2.5 font-sans">
                    <Link href={`/suppliers`} className="group-hover:text-primary transition-colors block">
                      <span className="font-bold text-foreground block">{rec.name}</span>
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
                        <span>{rec.supplierId}</span>
                        <span>•</span>
                        <span>{rec.phone}</span>
                      </div>
                    </Link>
                  </td>

                  {/* Category & Branch */}
                  <td className="py-2.5 font-sans text-muted-foreground">
                    <span className="block text-foreground text-[11px] font-medium">{rec.category}</span>
                    <span className="text-[10px] text-muted-foreground">{rec.branch}</span>
                  </td>

                  {/* Invoices */}
                  <td className="py-2.5 text-center font-bold text-foreground font-mono">
                    {rec.invoices}
                  </td>

                  {/* Purchases */}
                  <td className="py-2.5 text-right font-bold text-foreground">
                    {formatCurrency(rec.purchases)}
                  </td>

                  {/* Paid */}
                  <td className="py-2.5 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                    {formatCurrency(rec.paid)}
                  </td>

                  {/* Due */}
                  <td className="py-2.5 text-right">
                    {rec.due > 0 ? (
                      <span className="font-bold text-rose-600 dark:text-rose-400">
                        {formatCurrency(rec.due)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground font-sans text-[11px]">Paid Clear</span>
                    )}
                  </td>

                  {/* Last Supply */}
                  <td className="py-2.5 text-right text-muted-foreground font-sans text-[11px]">
                    {rec.lastSupply}
                  </td>

                  {/* Status */}
                  <td className="py-2.5 text-right font-sans">
                    <span
                      className={cn(
                        'text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block',
                        rec.status === 'Active'
                          ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                          : rec.status === 'Paid Clear'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : rec.status === 'Overdue Due'
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {rec.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs text-muted-foreground">
        <span>
          {isBangla ? 'পৃষ্ঠা' : 'Showing page'} {currentPage} of {totalPages} ({filteredRecords.length} {isBangla ? 'জন' : 'total'})
        </span>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="h-7 px-2 text-xs rounded-lg"
          >
            <ChevronLeft className="w-3.5 h-3.5 mr-1" />
            <span>{isBangla ? 'পূর্ববর্তী' : 'Prev'}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="h-7 px-2 text-xs rounded-lg"
          >
            <span>{isBangla ? 'পরবর্তী' : 'Next'}</span>
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
