'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { BackButton } from './BackButton';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

export interface PageHeaderProps {
  title?: React.ReactNode;
  titleBn?: string;
  pageName?: string;
  pageNameBn?: string;

  subtitle?: React.ReactNode;
  subtitleBn?: string;
  description?: React.ReactNode;
  descriptionBn?: string;

  badge?: React.ReactNode;

  showBack?: boolean;
  showBackButton?: boolean;
  backAction?: () => void;
  backHref?: string;
  fallbackHref?: string;

  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
    icon?: LucideIcon;
    className?: string;
  };
  actions?: React.ReactNode;
  children?: React.ReactNode;

  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  isBangla?: boolean;

  // Unused backward-compatibility props so existing callers don't throw type errors
  icon?: LucideIcon;
  parentName?: string;
  parentNameBn?: string;
  parentHref?: string;
  breadcrumbs?: { label: string; labelBn?: string; href?: string }[];
}

export function PageHeader({
  title,
  titleBn,
  pageName,
  pageNameBn,
  subtitle,
  subtitleBn,
  description,
  descriptionBn,
  badge,
  showBack,
  showBackButton,
  backAction,
  backHref,
  fallbackHref,
  action,
  actions,
  children,
  className,
  titleClassName,
  subtitleClassName,
  isBangla: propIsBangla,
  breadcrumbs,
}: PageHeaderProps) {
  const { isBangla: hookIsBangla } = useAppTranslation();
  const isBangla = propIsBangla ?? hookIsBangla;

  // Resolve title
  const resolvedTitle = title ?? pageName;
  const resolvedTitleBn = titleBn ?? pageNameBn;
  const displayTitle =
    isBangla && resolvedTitleBn
      ? resolvedTitleBn
      : resolvedTitle;

  // Resolve subtitle/description
  const resolvedSubtitle = subtitle ?? description;
  const resolvedSubtitleBn = subtitleBn ?? descriptionBn;
  const displaySubtitle =
    isBangla && resolvedSubtitleBn
      ? resolvedSubtitleBn
      : resolvedSubtitle;

  // Resolve back button visibility: each page must have a back button by default
  const shouldShowBack =
    showBack !== undefined
      ? showBack
      : showBackButton !== undefined
      ? showBackButton
      : true;

  return (
    <div className={cn('space-y-4 mb-6', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        {/* Left: Back button + Title & Description */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {shouldShowBack && (
            <BackButton
              onClick={backAction}
              fallbackHref={fallbackHref || backHref}
              className="shrink-0"
            />
          )}

          <div className="min-w-0">
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                {breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span className="opacity-50">/</span>}
                    {crumb.href ? (
                      <Link href={crumb.href} className="hover:text-foreground transition-colors">
                        {isBangla && crumb.labelBn ? crumb.labelBn : crumb.label}
                      </Link>
                    ) : (
                      <span className={idx === breadcrumbs.length - 1 ? "text-foreground font-semibold" : ""}>
                        {isBangla && crumb.labelBn ? crumb.labelBn : crumb.label}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <h1
                className={cn(
                  'text-xl sm:text-2xl font-bold tracking-tight text-foreground',
                  titleClassName
                )}
              >
                {displayTitle}
              </h1>
              {badge}
            </div>

            {displaySubtitle && (
              <p
                className={cn(
                  'hidden sm:block text-xs sm:text-sm text-muted-foreground mt-0.5',
                  subtitleClassName
                )}
              >
                {displaySubtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right: Actions, buttons, or custom children */}
        {(actions || children || action) && (
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            {actions}
            {children}
            {action && (
              action.href ? (
                <Link href={action.href}>
                  <Button
                    className={cn('h-9 sm:h-10 px-3.5 sm:px-4 rounded-xl font-semibold shadow-xs cursor-pointer flex items-center gap-2 text-xs sm:text-sm', action.className)}
                  >
                    {action.icon && <action.icon className="h-4 w-4" />}
                    <span>{action.label}</span>
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={action.onClick}
                  className={cn('h-9 sm:h-10 px-3.5 sm:px-4 rounded-xl font-semibold shadow-xs cursor-pointer flex items-center gap-2 text-xs sm:text-sm', action.className)}
                >
                  {action.icon && <action.icon className="h-4 w-4" />}
                  <span>{action.label}</span>
                </Button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PageHeader;
