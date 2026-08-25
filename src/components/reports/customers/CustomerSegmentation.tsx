// Hello Khata OS - Customer Behavioral Segmentation
// হ্যালো খাতা - গ্রাহক বিভাজন ও আচরণগত শ্রেণিবিভাগ

'use client';

import React from 'react';
import {
  Users,
  Star,
  RefreshCw,
  UserPlus,
  AlertTriangle,
  UserX,
  CreditCard,
  ChevronRight,
} from 'lucide-react';
import { useCurrency } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import type { CustomerSegmentItem } from './types';

interface CustomerSegmentationProps {
  segments: CustomerSegmentItem[];
  totalCustomers: number;
  isBangla?: boolean;
}

export function CustomerSegmentation({
  segments,
  totalCustomers,
  isBangla = false,
}: CustomerSegmentationProps) {
  const { formatCurrency } = useCurrency();

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              {isBangla ? 'গ্রাহক বিভাজন (Customer Segments)' : 'Customer Segments'}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {isBangla ? 'ক্রয় আচরণ ও ঝুঁকি অনুযায়ী গ্রাহক শ্রেণিবিভাগ' : 'Behavioral classification & risk grouping'}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono font-bold text-muted-foreground">
          {totalCustomers.toLocaleString()} {isBangla ? 'জন সর্বমোট' : 'Total Base'}
        </span>
      </div>

      {/* Segmented Distribution Strip */}
      <div className="space-y-1.5">
        <div className="h-2.5 w-full bg-muted/60 rounded-full overflow-hidden flex">
          {segments.map((seg) => (
            <div
              key={seg.id}
              style={{ width: `${seg.percentage}%` }}
              className={cn('h-full transition-all', seg.color)}
              title={`${seg.name}: ${seg.count} (${seg.percentage}%)`}
            />
          ))}
        </div>
      </div>

      {/* Segments Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
        {segments.map((seg) => (
          <div
            key={seg.id}
            className="p-3 rounded-xl bg-muted/15 hover:bg-muted/30 border border-border/60 transition-all space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground truncate text-xs">
                {isBangla ? seg.nameBn : seg.name}
              </span>
              <span className="text-[10px] font-mono font-bold text-muted-foreground">
                {seg.percentage}%
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-0.5">
              <span className="text-sm font-bold font-mono text-foreground">{seg.count}</span>
              <span className="text-[10px] font-mono text-muted-foreground">{formatCurrency(seg.totalSales)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
