'use client';

import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from '@tanstack/react-table';
import { PayrollRecord } from '@/types/payroll-register';
import { PayrollTotals } from './PayrollTotals';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  FileText,
  Printer,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  SearchX,
  ArrowUpDown,
} from 'lucide-react';

interface PayrollRegisterTableProps {
  records: PayrollRecord[];
  isLoading?: boolean;
  onSelectRecord: (record: PayrollRecord) => void;
  onResetFilters?: () => void;
}

const columnHelper = createColumnHelper<PayrollRecord>();

export const PayrollRegisterTable: React.FC<PayrollRegisterTableProps> = ({
  records,
  isLoading = false,
  onSelectRecord,
  onResetFilters,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const formatCurrency = (val: number) => `৳${val.toLocaleString('en-BD')}`;

  const columns = useMemo(
    () => [
      columnHelper.accessor('employeeName', {
        id: 'employee',
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
          >
            <span>Employee</span>
            <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: (info) => {
          const r = info.row.original;
          return (
            <div className="flex items-center gap-2.5 min-w-[220px]">
              <Avatar className="h-8 w-8 border border-border/60 shrink-0">
                <AvatarImage src={r.photoUrl} alt={r.employeeName} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                  {r.employeeName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5 min-w-0">
                <button
                  type="button"
                  onClick={() => onSelectRecord(r)}
                  className="font-bold text-xs text-foreground hover:text-primary transition-colors truncate block text-left"
                >
                  {r.employeeName}
                </button>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span className="font-mono">{r.employeeCode}</span>
                  <span>•</span>
                  <span className="truncate">{r.designation}</span>
                </div>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor('branchName', {
        id: 'branch',
        header: 'Branch & Dept',
        cell: (info) => {
          const r = info.row.original;
          return (
            <div className="space-y-0.5 min-w-[140px] text-left">
              <span className="font-semibold text-xs text-foreground block truncate">
                {r.branchName}
              </span>
              <span className="text-[10px] text-muted-foreground block truncate">
                {r.department}
              </span>
            </div>
          );
        },
      }),
      columnHelper.accessor('payrollPeriod', {
        id: 'period',
        header: 'Period & Type',
        cell: (info) => {
          const r = info.row.original;
          return (
            <div className="space-y-0.5 text-center min-w-[110px]">
              <Badge variant="outline" className="text-[10px] font-medium px-1.5 py-0">
                {r.payrollPeriod}
              </Badge>
              <span className="text-[10px] text-muted-foreground block capitalize">
                {r.salaryType}
              </span>
            </div>
          );
        },
      }),
      columnHelper.accessor('basicSalary', {
        id: 'basicSalary',
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1 text-right font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground ml-auto"
          >
            <span>Basic</span>
            <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: (info) => (
          <span className="font-mono text-xs text-right block">
            {formatCurrency(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor('allowances', {
        id: 'allowances',
        header: 'Allowances',
        cell: (info) => (
          <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 text-right block">
            +{formatCurrency(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor('overtime', {
        id: 'overtime',
        header: 'Overtime',
        cell: (info) => (
          <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 text-right block">
            +{formatCurrency(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor('bonus', {
        id: 'bonus',
        header: 'Bonus',
        cell: (info) => (
          <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 text-right block">
            +{formatCurrency(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor('grossSalary', {
        id: 'grossSalary',
        header: 'Gross Salary',
        cell: (info) => (
          <span className="font-mono text-xs font-bold text-foreground text-right block">
            {formatCurrency(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor('tax', {
        id: 'tax',
        header: 'Tax',
        cell: (info) => (
          <span className="font-mono text-xs text-rose-600 dark:text-rose-400 text-right block">
            -{formatCurrency(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor('leaveDeduction', {
        id: 'leaveDeduction',
        header: 'Leave Ded.',
        cell: (info) => (
          <span className="font-mono text-xs text-rose-600 dark:text-rose-400 text-right block">
            -{formatCurrency(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor('lateDeduction', {
        id: 'lateDeduction',
        header: 'Late Ded.',
        cell: (info) => (
          <span className="font-mono text-xs text-rose-600 dark:text-rose-400 text-right block">
            -{formatCurrency(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor('otherDeductions', {
        id: 'otherDeductions',
        header: 'Other Ded.',
        cell: (info) => (
          <span className="font-mono text-xs text-rose-600 dark:text-rose-400 text-right block">
            -{formatCurrency(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor('totalDeductions', {
        id: 'totalDeductions',
        header: 'Total Ded.',
        cell: (info) => (
          <span className="font-mono text-xs font-bold text-rose-700 dark:text-rose-300 text-right block">
            -{formatCurrency(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor('netSalary', {
        id: 'netSalary',
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1 text-right font-bold text-xs uppercase tracking-wider text-primary hover:text-primary/80 ml-auto"
          >
            <span>Net Salary</span>
            <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: (info) => (
          <span className="font-mono text-xs font-extrabold text-primary text-right block bg-primary/5 py-1 px-1.5 rounded">
            {formatCurrency(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor('paymentMethod', {
        id: 'paymentMethod',
        header: 'Method',
        cell: (info) => (
          <span className="text-[11px] font-medium capitalize text-muted-foreground text-center block">
            {info.getValue().replace('_', ' ')}
          </span>
        ),
      }),
      columnHelper.accessor('paymentStatus', {
        id: 'paymentStatus',
        header: 'Status',
        cell: (info) => {
          const val = info.getValue();
          switch (val) {
            case 'paid':
              return (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] py-0">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Paid
                </Badge>
              );
            case 'partially_paid':
              return (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] py-0">
                  <Clock className="h-3 w-3 mr-1" /> Partial
                </Badge>
              );
            case 'pending':
              return (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] py-0">
                  <Clock className="h-3 w-3 mr-1" /> Pending
                </Badge>
              );
            case 'failed':
              return (
                <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 text-[10px] py-0">
                  <AlertTriangle className="h-3 w-3 mr-1" /> Failed
                </Badge>
              );
          }
        },
      }),
      columnHelper.display({
        id: 'payslipBtn',
        header: 'Payslip',
        cell: (info) => {
          const r = info.row.original;
          return (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onSelectRecord(r)}
              className="h-7 text-xs px-2 gap-1 text-primary hover:text-primary hover:bg-primary/10 rounded-lg"
            >
              <FileText className="h-3.5 w-3.5" />
              View
            </Button>
          );
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => {
          const r = info.row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 rounded-xl text-xs">
                <DropdownMenuItem
                  onClick={() => onSelectRecord(r)}
                  className="gap-2 cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5 text-primary" />
                  <span>View Payslip</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onSelectRecord(r)}
                  className="gap-2 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Download PDF</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => window.print()}
                  className="gap-2 cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Print Statement</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      }),
    ],
    [onSelectRecord]
  );

  const table = useReactTable({
    data: records,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) {
    return (
      <div className="border border-border/60 rounded-xl overflow-hidden bg-card shadow-2xs p-4 space-y-3">
        <Skeleton className="h-10 w-full rounded-lg" />
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="border border-border/60 rounded-xl p-12 text-center bg-card shadow-2xs flex flex-col items-center justify-center">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground">
          <SearchX className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-semibold text-foreground mb-1">
          No payroll records found
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm mb-4">
          Try changing your selected payroll period, branch, or reset filter options.
        </p>
        {onResetFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="h-8 text-xs rounded-lg gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear All Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Scrollable Matrix Table */}
      <div className="border border-border/60 rounded-xl overflow-hidden bg-card shadow-2xs relative">
        <div className="overflow-x-auto max-h-[600px] scrollbar-thin">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="sticky top-0 z-20 bg-muted/90 backdrop-blur-xs border-b border-border/70 shadow-2xs">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header, idx) => (
                    <th
                      key={header.id}
                      className={`p-3 font-medium transition-colors ${
                        idx === 0
                          ? 'sticky left-0 z-30 bg-muted/95 border-r border-border/60 min-w-[220px]'
                          : 'text-center min-w-[100px]'
                      }`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border/50">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-muted/40 transition-colors group"
                >
                  {row.getVisibleCells().map((cell, idx) => (
                    <td
                      key={cell.id}
                      className={`p-3 align-middle ${
                        idx === 0
                          ? 'sticky left-0 z-10 bg-card group-hover:bg-muted/40 border-r border-border/60'
                          : 'text-center'
                      }`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <PayrollTotals records={records} />
            </tfoot>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1 print:hidden">
        <div>
          Showing {table.getRowModel().rows.length} of {records.length} records
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 text-xs rounded-lg px-3"
          >
            Previous
          </Button>
          <span className="font-semibold text-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount() || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-8 text-xs rounded-lg px-3"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
