// Hello Khata OS - Financial Alerts ("Needs Attention" - Exception-First Architecture)
// হ্যালো খাতা - আর্থিক সতর্কতা ও তাৎক্ষণিক সমাধান

'use client';

import React from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  ArrowRight,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { FinancialAlertItem } from './types';

interface FinancialAlertsSectionProps {
  alerts: FinancialAlertItem[];
  isBangla?: boolean;
}

export function FinancialAlertsSection({
  alerts,
  isBangla = false,
}: FinancialAlertsSectionProps) {
  if (!alerts.length) {
    return (
      <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-xs flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div className="text-xs">
          <span className="font-bold text-foreground block">
            {isBangla ? 'সব আর্থিক মেট্রিক সন্তোষজনক' : 'All Financial Indicators Healthy'}
          </span>
          <span className="text-muted-foreground text-[11px]">
            {isBangla ? 'এই মুহূর্তে কোনো তাৎক্ষণিক মনোযোগের প্রয়োজন নেই।' : 'No critical cash flow bottlenecks or severe overdue payments detected.'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              {isBangla ? 'বিশেষ মনোযোগ প্রয়োজন (Needs Attention)' : 'Needs Attention'}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {isBangla ? 'তাৎক্ষণিক পদক্ষেপ প্রয়োজন এমন আর্থিক অসংগতি' : 'Actionable operational and liquidity exceptions'}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
          {alerts.length} {isBangla ? 'টি বিষয়' : 'Pending Items'}
        </span>
      </div>

      {/* Alert Items List (Issue → Impact → Action) */}
      <div className="divide-y divide-border/50">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="py-3 first:pt-1 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'w-2 h-2 rounded-full shrink-0',
                    alert.severity === 'critical'
                      ? 'bg-rose-500'
                      : alert.severity === 'warning'
                      ? 'bg-amber-500'
                      : 'bg-blue-500'
                  )}
                />
                <span className="font-bold text-foreground">
                  {isBangla && alert.titleBn ? alert.titleBn : alert.title}
                </span>
              </div>

              <div className="text-[11px] text-muted-foreground flex items-center gap-2 pl-4">
                <span className="font-medium text-foreground/80">
                  {isBangla ? 'প্রভাব:' : 'Impact:'} {isBangla && alert.impactBn ? alert.impactBn : alert.impact}
                </span>
              </div>
            </div>

            <div className="pl-4 sm:pl-0 shrink-0">
              {alert.actionHref ? (
                <Link href={alert.actionHref}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2.5 rounded-xl border-border bg-card hover:bg-muted text-[11px] text-primary font-semibold gap-1"
                  >
                    <span>{isBangla && alert.actionTextBn ? alert.actionTextBn : alert.actionText}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2.5 rounded-xl border-border bg-card hover:bg-muted text-[11px] text-primary font-semibold gap-1"
                >
                  <span>{isBangla && alert.actionTextBn ? alert.actionTextBn : alert.actionText}</span>
                  <ArrowRight className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
