// Hello Khata OS - Page Header Component
// Enterprise-grade structured header

'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { BackButton } from './BackButton';
import type { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  titleBn?: string;
  subtitle?: string;
  subtitleBn?: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  backAction?: () => void;
  showBack?: boolean;
  children?: React.ReactNode;
  className?: string;
  isBangla?: boolean;
}

export function PageHeader({
  title,
  titleBn,
  subtitle,
  subtitleBn,
  icon: Icon,
  action,
  backAction,
  showBack = true,
  children,
  className,
  isBangla = false,
}: PageHeaderProps) {
  const displayTitle = isBangla && titleBn ? titleBn : title;
  const displaySubtitle = isBangla && subtitleBn ? subtitleBn : subtitle;

  return (
    <div className={cn('mb-6', className)}>
      {/* Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          {(showBack || backAction) && (
            <BackButton
              onClick={backAction}
              size="default"
              variant="default"
              className="mt-0.5"
            />
          )}
          {Icon && (
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shrink-0 border border-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          )}
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
              {displayTitle}
            </h1>
            {displaySubtitle && (
              <p className="text-sm text-muted-foreground mt-1">
                {displaySubtitle}
              </p>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {children}
          {action && (
            <Button onClick={action.onClick} className="bg-primary hover:bg-primary/90">
              {action.icon && <action.icon className="h-4 w-4 mr-2" />}
              {action.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
