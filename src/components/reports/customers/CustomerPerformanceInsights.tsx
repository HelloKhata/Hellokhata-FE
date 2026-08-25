// Hello Khata OS - Customer Performance Insights Strip
// হ্যালো খাতা - গ্রাহক পারফরম্যান্স পর্যবেক্ষণ স্ট্রিপ

'use client';

import React from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { useCurrency } from '@/hooks/useAppTranslation';

interface CustomerPerformanceInsightsProps {
  isBangla?: boolean;
}

export function CustomerPerformanceInsights({
  isBangla = false,
}: CustomerPerformanceInsightsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
      {/* Insight 1: Strongest Segment */}
      <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs space-y-1.5 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
          <TrendingUp className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-bold text-foreground">
            {isBangla ? 'শীর্ষ গ্রাহক সেগমেন্ট' : 'Strongest Customer Segment'}
          </h4>
          <p className="text-muted-foreground leading-relaxed text-[11px] mt-0.5">
            {isBangla
              ? 'নিয়মিত ও রিপিট ক্রেতারা এই মাসে মোট বিক্রয়ের ৬৮.৪% অবদান রেখেছেন।'
              : 'Regular repeat buyers generated 68.4% of total customer revenue this period.'}
          </p>
        </div>
      </div>

      {/* Insight 2: Receivable Exposure Alert */}
      <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs space-y-1.5 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-bold text-foreground">
            {isBangla ? 'বকেয়া ঝুঁকি পর্যবেক্ষণ' : 'Receivable Alert'}
          </h4>
          <p className="text-muted-foreground leading-relaxed text-[11px] mt-0.5">
            {isBangla
              ? 'মোট বকেয়ার মধ্যে ৳৬২,০০০ টাকা ৬০ দিনের বেশি পুরানো, অবিলম্বে তাগাদা পাঠানো জরুরি।'
              : 'A critical ৳62,000 portion of customer dues is older than 60 days.'}
          </p>
        </div>
      </div>

      {/* Insight 3: Retention & Loyalty */}
      <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs space-y-1.5 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
          <RotateCcw className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-bold text-foreground">
            {isBangla ? 'গ্রাহক ধরে রাখার সংকেত' : 'Retention Signal'}
          </h4>
          <p className="text-muted-foreground leading-relaxed text-[11px] mt-0.5">
            {isBangla
              ? 'চলতি মাসে গ্রাহকদের পুনরাবৃত্তি ক্রয়ের হার ৪.২% বৃদ্ধি পেয়ে ৬৮.৪%-এ দাঁড়িয়েছে।'
              : 'Repeat purchase frequency increased by 4.2% MoM with high customer lifetime retention.'}
          </p>
        </div>
      </div>
    </div>
  );
}
