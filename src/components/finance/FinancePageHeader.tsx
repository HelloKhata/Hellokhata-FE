'use client';

import React from 'react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { LucideIcon } from 'lucide-react';

import { BackButton } from '@/components/common/BackButton';

interface FinancePageHeaderProps {
  pageName: string;
  pageNameBn?: string;
  description: string;
  descriptionBn?: string;
  icon?: LucideIcon;
  parentName?: string;
  parentNameBn?: string;
  parentHref?: string;
  showBackButton?: boolean;
  backHref?: string;
  children?: React.ReactNode;
}

export function FinancePageHeader({
  pageName,
  pageNameBn,
  description,
  descriptionBn,
  icon: Icon,
  parentName = 'Finance & Accounting',
  parentNameBn = 'অর্থায়ন ও হিসাববিজ্ঞান',
  parentHref,
  showBackButton = false,
  backHref,
  children,
}: FinancePageHeaderProps) {
  const { isBangla } = useAppTranslation();
  
  const displayName = isBangla && pageNameBn ? pageNameBn : pageName;
  const displayDescription = isBangla && descriptionBn ? descriptionBn : description;
  const displayParentName = isBangla && parentNameBn ? parentNameBn : parentName;

  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 sm:gap-4">
          {showBackButton && <BackButton className="mt-0.5 sm:mt-1 shrink-0" fallbackHref={backHref} />}
          {Icon && (
            <div className="hidden sm:flex h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-indigo-subtle items-center justify-center shrink-0">
              <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
          )}
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {displayName}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {displayDescription}
            </p>
          </div>
        </div>
        {children && <div>{children}</div>}
      </div>
    </div>
  );
}
