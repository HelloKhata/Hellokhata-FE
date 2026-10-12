// Hello Khata OS - Shared Page Container Component
// Provides consistent centered layout for form pages and settings

'use client';

import { cn } from '@/lib/utils';
import { BackButton } from './BackButton';
import { useRouter } from 'next/navigation';
import { useAppTranslation } from '@/hooks/useAppTranslation';

interface PageContainerProps {
  children: React.ReactNode;
  /** Maximum width in pixels. Default: 900 */
  maxWidth?: number;
  /** Show back button */
  showBack?: boolean;
  /** Custom back handler */
  onBack?: () => void;
  /** Additional class names */
  className?: string;
}

export function PageContainer({ 
  children, 
  maxWidth = 900,
  showBack = true,
  onBack,
  className 
}: PageContainerProps) {
  return (
    <div className={cn('flex justify-center', className)}>
      <div 
        className="w-full px-4 sm:px-6"
        style={{ maxWidth: `${maxWidth}px` }}
      >
        {showBack && (
          <div className="mb-4">
            <BackButton onClick={onBack} />
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

import { PageHeader as UniversalPageHeader } from './PageHeader';

// Page Header Component (Delegated to universal PageHeader)
interface PageHeaderProps {
  icon?: React.ElementType;
  iconColor?: 'primary' | 'indigo' | 'emerald' | 'warning';
  title: string;
  titleBn?: string;
  description?: string;
  descriptionBn?: string;
  action?: React.ReactNode;
}

export function PageHeader({ 
  title, 
  titleBn,
  description, 
  descriptionBn,
  action 
}: PageHeaderProps) {
  return (
    <UniversalPageHeader
      title={title}
      titleBn={titleBn}
      subtitle={description}
      subtitleBn={descriptionBn}
      actions={action}
    />
  );
}

// Form Card Component
interface FormCardProps {
  children: React.ReactNode;
  title?: string;
  titleBn?: string;
  className?: string;
}

export function FormCard({ children, title, titleBn, className }: FormCardProps) {
  const { isBangla } = useAppTranslation();

  return (
    <div 
      className={cn(
        'rounded-2xl border border-[rgba(255,255,255,0.06)]',
        'bg-[rgba(255,255,255,0.03)]',
        className
      )}
    >
      {title && (
        <div className="px-6 py-4 border-b border-[rgba(255,255,255,0.05)]">
          <h2 className="text-base font-semibold text-foreground">
            {isBangla && titleBn ? titleBn : title}
          </h2>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

// Form Section Component
interface FormSectionProps {
  title?: string;
  titleBn?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'highlighted';
}

export function FormSection({ 
  title, 
  titleBn, 
  children, 
  className,
  variant = 'default' 
}: FormSectionProps) {
  const { isBangla } = useAppTranslation();

  return (
    <div 
      className={cn(
        'space-y-4',
        variant === 'highlighted' && 'p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]',
        className
      )}
    >
      {title && (
        <h3 className="text-sm font-semibold text-foreground">
          {isBangla && titleBn ? titleBn : title}
        </h3>
      )}
      {children}
    </div>
  );
}

// Form Actions Component
interface FormActionsProps {
  children: React.ReactNode;
  className?: string;
}

export function FormActions({ children, className }: FormActionsProps) {
  return (
    <div className={cn('flex gap-3 pt-4', className)}>
      {children}
    </div>
  );
}

export default PageContainer;
