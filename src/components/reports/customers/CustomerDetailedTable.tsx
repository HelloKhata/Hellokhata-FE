// Hello Khata OS - Detailed Customer Report Table
// হ্যালো খাতা - বিস্তারিত গ্রাহক অডিট ও পারফরম্যান্স টেবিল

'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  Printer,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Phone,
  Building2,
  SlidersHorizontal,
  RotateCcw,
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
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { CustomerDetailedRecord } from './types';

interface CustomerDetailedTableProps {
  records: CustomerDetailedRecord[];
  onExportExcel: () => void;
  isBangla?: boolean;
}

export function CustomerDetailedTable({
  records,
  onExportExcel,
  isBangla = false,
}: CustomerDetailedTableProps) {
  const { formatCurrency } = useCurrency();
  const { formatDate } = useDateFormat();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filtered & Paginated records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.customerId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || r.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesGroup = groupFilter === 'all' || r.group.toLowerCase() === groupFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesGroup;
    });
  }, [records, searchTerm, statusFilter, groupFilter]);

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
              {isBangla ? 'গ্রাহক বিস্তারিত পারফরম্যান্স রিপোর্ট' : 'Customer Master Performance Ledger'}
            </h3>
            <Badge variant="outline" className="text-[10px] font-mono">
              {filteredRecords.length} {isBangla ? 'জন তালিকাভুক্ত' : 'Records'}
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground">
            {isBangla ? 'প্রতিটি গ্রাহকের সামগ্রিক ক্রয়, বাকি এবং পেমেন্ট ইতিহাস' : 'Comprehensive sales, collections, dues, and return audit'}
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={isBangla ? 'গ্রাহক বা ফোন নম্বর খুঁজুন...' : 'Search customer, phone, ID...'}
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
              <SelectItem value="regular">{isBangla ? 'নিয়মিত' : 'Regular'}</SelectItem>
              <SelectItem value="overdue">{isBangla ? 'বকেয়া রয়েছে' : 'Overdue'}</SelectItem>
              <SelectItem value="dormant">{isBangla ? 'নিষ্ক্রিয়' : 'Dormant'}</SelectItem>
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
              <th className="pb-2.5 font-medium">{isBangla ? 'গ্রাহক ও কোড' : 'Customer & ID'}</th>
              <th className="pb-2.5 font-medium">{isBangla ? 'শাখা ও গ্রুপ' : 'Branch / Group'}</th>
              <th className="pb-2.5 font-medium text-center">{isBangla ? 'অর্ডার' : 'Orders'}</th>
              <th className="pb-2.5 font-medium text-right">{isBangla ? 'মোট বিক্রয়' : 'Total Sales'}</th>
              <th className="pb-2.5 font-medium text-right">{isBangla ? 'পরিশোধিত' : 'Paid'}</th>
              <th className="pb-2.5 font-medium text-right">{isBangla ? 'বকেয়া' : 'Due'}</th>
              <th className="pb-2.5 font-medium text-right">{isBangla ? 'সর্বশেষ ক্রয়' : 'Last Purchase'}</th>
              <th className="pb-2.5 font-medium text-right">{isBangla ? 'স্ট্যাটাস' : 'Status'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 font-mono text-[11.5px]">
            {paginatedRecords.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-muted-foreground font-sans">
                  {isBangla ? 'কোনো গ্রাহক রেকর্ড পাওয়া যায়নি' : 'No customer records match your filter criteria'}
                </td>
              </tr>
            ) : (
              paginatedRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-muted/30 transition-colors group">
                  {/* Customer Info */}
                  <td className="py-2.5 font-sans">
                    <Link href={`/customers`} className="group-hover:text-primary transition-colors block">
                      <span className="font-bold text-foreground block">{rec.name}</span>
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
                        <span>{rec.customerId}</span>
                        <span>•</span>
                        <span>{rec.phone}</span>
                      </div>
                    </Link>
                  </td>

                  {/* Branch & Group */}
                  <td className="py-2.5 font-sans text-muted-foreground">
                    <span className="block text-foreground text-[11px] font-medium">{rec.branch}</span>
                    <span className="text-[10px] text-muted-foreground">{rec.group}</span>
                  </td>

                  {/* Orders */}
                  <td className="py-2.5 text-center font-bold text-foreground font-mono">
                    {rec.purchases}
                  </td>

                  {/* Sales */}
                  <td className="py-2.5 text-right font-bold text-foreground">
                    {formatCurrency(rec.sales)}
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
                      <span className="text-muted-foreground font-sans text-[11px]">—</span>
                    )}
                  </td>

                  {/* Last Purchase */}
                  <td className="py-2.5 text-right text-muted-foreground font-sans text-[11px]">
                    {rec.lastPurchase}
                  </td>

                  {/* Status */}
                  <td className="py-2.5 text-right font-sans">
                    <span
                      className={cn(
                        'text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block',
                        rec.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : rec.status === 'Regular'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          : rec.status === 'Overdue'
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
