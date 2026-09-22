// Hello Khata OS - HRM Data Table
// হ্যালো খাতা - এইচআরএম ডেটা টেবিল

'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { HrmTableSkeleton } from './HrmSkeleton';
import { HrmEmptyState } from './HrmEmptyState';
import type { LucideIcon } from 'lucide-react';

export interface HrmColumn<T> {
  key: string;
  header: string;
  headerBn?: string;
  className?: string;
  align?: 'left' | 'center' | 'right';
  render: (row: T, index: number) => ReactNode;
}

interface Props<T> {
  columns: HrmColumn<T>[];
  data: T[];
  keyField: (row: T) => string;
  loading?: boolean;
  skeletonRows?: number;
  emptyIcon?: LucideIcon;
  emptyTitle: string;
  emptyTitleBn?: string;
  emptyDescription?: string;
  emptyDescriptionBn?: string;
  emptyAction?: ReactNode;
  rowClassName?: (row: T) => string;
  onRowClick?: (row: T) => void;
  onRowKeyDown?: (row: T) => void;
  footer?: ReactNode;
  isBangla?: boolean;
}

export function HrmDataTable<T>({
  columns,
  data,
  keyField,
  loading = false,
  skeletonRows = 6,
  emptyIcon,
  emptyTitle,
  emptyTitleBn,
  emptyDescription,
  emptyDescriptionBn,
  emptyAction,
  rowClassName,
  onRowClick,
  footer,
  isBangla,
}: Props<T>) {
  if (loading) {
    return (
      <div className="w-full rounded-2xl border border-slate-800/90 bg-[#0d131f]/95 shadow-2xl shadow-black/40 backdrop-blur-xl p-6">
        <HrmTableSkeleton rows={skeletonRows} columns={columns.length} />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full rounded-2xl border border-slate-800/90 bg-[#0d131f]/95 shadow-2xl shadow-black/40 backdrop-blur-xl p-6">
        <HrmEmptyState
          icon={emptyIcon}
          title={emptyTitle}
          titleBn={emptyTitleBn}
          description={emptyDescription}
          descriptionBn={emptyDescriptionBn}
          action={emptyAction}
        />
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-slate-800/90 bg-[#0d131f]/95 shadow-2xl shadow-black/40 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-slate-700/80">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm min-w-[640px]">
          <thead>
            <tr className="border-b border-slate-800/80 bg-slate-900/80 text-slate-400 text-[11px] font-semibold tracking-wider uppercase">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-5 py-3.5 whitespace-nowrap',
                    col.align === 'right' && 'text-right',
                    col.align === 'center' && 'text-center',
                    col.className
                  )}
                >
                  {isBangla && col.headerBn ? col.headerBn : col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {data.map((row, index) => (
              <motion.tr
                key={keyField(row)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.18, delay: Math.min(index * 0.02, 0.3) }}
                onClick={() => onRowClick?.(row)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && onRowClick) onRowClick(row);
                }}
                className={cn(
                  'border-b border-slate-800/60 transition-colors hover:bg-slate-800/40',
                  onRowClick && 'cursor-pointer',
                  rowClassName?.(row)
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      'px-5 py-3.5 align-middle',
                      col.align === 'right' && 'text-right',
                      col.align === 'center' && 'text-center',
                      col.className
                    )}
                  >
                    {col.render(row, index)}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {footer}
    </div>
  );
}
