// Hello Khata OS - Contextual AI Financial Insight (Calm & Restrained Intelligence Layer)
// হ্যালো খাতা - প্রাসঙ্গিক আর্থিক পর্যবেক্ষণ লেয়ার

'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

interface ContextualFinancialInsightProps {
  insightText: string;
  insightTextBn?: string;
  detailsHref?: string;
  isBangla?: boolean;
}

export function ContextualFinancialInsight({
  insightText,
  insightTextBn,
  detailsHref = '/finance/reports/profit-loss',
  isBangla = false,
}: ContextualFinancialInsightProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-4 py-3 rounded-2xl bg-muted/30 border border-border/70 text-xs">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <p className="text-muted-foreground leading-relaxed">
          <strong className="text-foreground font-semibold mr-1.5">
            {isBangla ? 'আর্থিক পর্যবেক্ষণ:' : 'Financial Insight:'}
          </strong>
          {isBangla && insightTextBn ? insightTextBn : insightText}
        </p>
      </div>

      <Link
        href={detailsHref}
        className="text-primary hover:underline text-[11px] font-semibold flex items-center gap-1 shrink-0 self-end sm:self-auto"
      >
        <span>{isBangla ? 'বিস্তারিত দেখুন' : 'View Details'}</span>
        <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}
