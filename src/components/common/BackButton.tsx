// Hello Khata OS - BackButton Component
// Reusable back navigation button with micro-interactions and bilingual support

'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppTranslation } from '@/hooks/useAppTranslation';

export interface BackButtonProps {
  /** Optional custom back action. Defaults to router.back() */
  onClick?: () => void;
  /** Fallback URL to navigate to if history is empty (optional) */
  fallbackHref?: string;
  /** Custom text label (if showLabel is true) */
  label?: string;
  /** Custom Bengali label (if showLabel is true) */
  labelBn?: string;
  /** Whether to show the text label. Default: false (single arrow icon) */
  showLabel?: boolean;
  /** Visual variant */
  variant?: 'default' | 'ghost' | 'outline' | 'subtle';
  /** Size variant */
  size?: 'sm' | 'default' | 'lg' | 'icon';
  /** Additional CSS classes */
  className?: string;
  /** Optional title attribute */
  title?: string;
}

export function BackButton({
  onClick,
  fallbackHref,
  label,
  labelBn,
  showLabel = false,
  variant = 'ghost',
  size = 'default',
  className,
  title,
}: BackButtonProps) {
  const router = useRouter();
  const { isBangla } = useAppTranslation();

  const handleBack = () => {
    if (onClick) {
      onClick();
    } else if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else if (fallbackHref) {
      router.push(fallbackHref);
    } else {
      router.back();
    }
  };

  const defaultText = isBangla ? 'পেছনে' : 'Back';
  const displayText = isBangla && labelBn ? labelBn : label || defaultText;
  const tooltipText = title || (isBangla ? 'পেছনে যান' : 'Go back');

  if (!showLabel) {
    return (
      <button
        type="button"
        onClick={handleBack}
        title={tooltipText}
        aria-label={tooltipText}
        className={cn(
          'inline-flex items-center justify-center rounded-xl transition-all duration-200 group shrink-0 cursor-pointer',
          'h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted/60 active:scale-95',
          variant === 'outline' && 'border border-border hover:bg-muted/50 shadow-xs',
          variant === 'subtle' && 'bg-muted/40 hover:bg-muted border border-border-subtle hover:border-border',
          size === 'sm' && 'h-8 w-8',
          size === 'lg' && 'h-10 w-10',
          className
        )}
      >
        <ArrowLeft className={cn(
          "transition-transform duration-200 group-hover:-translate-x-0.5",
          size === 'sm' ? "h-4 w-4" : "h-5 w-5"
        )} />
      </button>
    );
  }

  const variantStyles = {
    default: 'text-muted-foreground hover:text-foreground bg-muted/40 hover:bg-muted/80 border border-border-subtle hover:border-border cursor-pointer',
    ghost: 'text-muted-foreground hover:text-foreground hover:bg-muted/60 cursor-pointer',
    outline: 'text-muted-foreground hover:text-foreground border border-border hover:bg-muted/50 shadow-xs cursor-pointer',
    subtle: 'text-muted-foreground hover:text-foreground hover:bg-primary/10 hover:text-primary cursor-pointer',
  };

  const sizeStyles = {
    sm: 'h-8 px-2.5 text-xs gap-1.5 rounded-lg',
    default: 'h-9 px-3 text-sm gap-2 rounded-xl',
    lg: 'h-10 px-4 text-base gap-2.5 rounded-xl',
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      title={tooltipText}
      aria-label={tooltipText}
      className={cn(
        'inline-flex items-center font-medium transition-all duration-200 group shrink-0 active:scale-95',
        variantStyles[variant],
        sizeStyles[size as keyof typeof sizeStyles] || sizeStyles.default,
        className
      )}
    >
      <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5 shrink-0" />
      <span className="truncate">{displayText}</span>
    </button>
  );
}

export default BackButton;
