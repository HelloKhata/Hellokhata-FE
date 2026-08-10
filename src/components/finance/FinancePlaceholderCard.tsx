'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/premium';
import { Info } from 'lucide-react';
import { useAppTranslation } from '@/hooks/useAppTranslation';

interface FinancePlaceholderProps {
  title: string;
  titleBn?: string;
  description: string;
  descriptionBn?: string;
  badgeText?: string;
}

export function FinancePlaceholderCard({
  title,
  titleBn,
  description,
  descriptionBn,
  badgeText,
}: FinancePlaceholderProps) {
  const { isBangla } = useAppTranslation();
  
  const displayTitle = isBangla && titleBn ? titleBn : title;
  const displayDescription = isBangla && descriptionBn ? descriptionBn : description;

  return (
    <Card className="border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] backdrop-blur-sm relative overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Info className="h-5 w-5 text-primary shrink-0" />
            <span>{displayTitle}</span>
          </CardTitle>
          {badgeText && (
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {badgeText}
            </span>
          )}
        </div>
        <CardDescription className="text-sm text-muted-foreground mt-1.5">
          {displayDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-64 border-t border-[rgba(255,255,255,0.04)] flex flex-col items-center justify-center text-center p-6">
        <div className="max-w-md space-y-2">
          <h3 className="text-xl font-bold text-foreground">
            {isBangla ? 'শীঘ্রই আসছে' : 'Coming Soon'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isBangla
              ? 'এই মডিউলটি পরবর্তী ধাপে প্রয়োগ করা হবে। বর্তমানে এই অংশের ইন্টারফেস ও লেআউট প্রস্তুত করা হচ্ছে।'
              : 'This module will be implemented in the next phase. Currently, the interface and structures are being prepared.'}
          </p>
          <div className="pt-4">
            <div className="inline-flex items-center gap-2 rounded-xl bg-muted/50 px-4 py-2 border border-border-subtle">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-muted-foreground">
                {isBangla ? 'ভবিষ্যৎ উইজেটের জন্য সংরক্ষিত এলাকা' : 'Reserved Area for Future Widgets'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
