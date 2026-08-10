// Hello Khata OS - HRM Data Table
// হ্যালো খাতা - এইচআরএম ডেটা টেবিল

'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/premium';
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
      <Card padding="lg" className="w-full">
        <HrmTableSkeleton rows={skeletonRows} columns={columns.length} />
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card padding="none" className="w-full">
        <HrmEmptyState
          icon={emptyIcon}
          title={emptyTitle}
          titleBn={emptyTitleBn}
          description={emptyDescription}
          descriptionBn={emptyDescriptionBn}
          action={emptyAction}
        />
      </Card>
    );
  }

  return (
    <Card padding="none" className="w-full overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm min-w-[640px]">
          <thead>
            <tr className="border-b border-border bg-muted/20 text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3 whitespace-nowrap',
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
          <tbody>
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
                  'border-b border-border last:border-0 transition-colors hover:bg-muted/20',
                  onRowClick && 'cursor-pointer',
                  rowClassName?.(row)
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      'px-4 py-3 align-middle',
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
    </Card>
  );
}
