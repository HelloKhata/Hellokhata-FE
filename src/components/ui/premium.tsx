// Hello Khata OS - Premium Design System Components
// Elite SaaS UI Components inspired by Stripe, Linear, Notion
// GPU-optimized for smooth performance

'use client';

import { forwardRef, HTMLAttributes, ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

/* ============================================
   BUTTON VARIANTS
   ============================================ */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary-hover active:scale-[0.98]',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-border bg-transparent hover:bg-muted hover:text-foreground',
        ghost: 'hover:bg-muted hover:text-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        premium: 'bg-gradient-to-r from-primary to-indigo text-primary-foreground hover:opacity-90',
        glass: 'bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10',
      },
      size: {
        default: 'h-10 px-4 py-2 rounded-lg',
        sm: 'h-8 px-3 text-xs rounded-md',
        lg: 'h-12 px-6 text-base rounded-xl',
        xl: 'h-14 px-8 text-lg rounded-xl',
        icon: 'h-10 w-10 rounded-lg',
        'icon-sm': 'h-8 w-8 rounded-md',
        'icon-lg': 'h-12 w-12 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/* ============================================
   BUTTON COMPONENT
   ============================================ */
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);
Button.displayName = 'Button';

/* ============================================
   CARD VARIANTS - PREMIUM WITH INNER GRADIENTS
   ============================================ */
const cardVariants = cva(
  'transition-all duration-200 relative',
  {
    variants: {
      variant: {
        default: 'border border-border dark:border-slate-800/90 rounded-2xl bg-card dark:bg-[#0d131f]/95 shadow-sm dark:shadow-xl dark:shadow-black/40 backdrop-blur-xl',
        elevated: 'border border-border dark:border-slate-800/90 rounded-2xl bg-card dark:bg-[#0d131f]/95 shadow-md dark:shadow-2xl dark:shadow-black/50 backdrop-blur-xl hover:border-border dark:hover:border-slate-700/80 hover:-translate-y-0.5',
        glass: 'bg-card/85 dark:bg-[#0d131f]/80 backdrop-blur-xl border border-border dark:border-slate-800/80 rounded-2xl shadow-sm dark:shadow-xl dark:shadow-black/40',
        ghost: 'bg-transparent',
        outline: 'border border-border dark:border-slate-800 rounded-2xl bg-transparent',
        glow: 'border border-border dark:border-slate-800/90 rounded-2xl bg-card dark:bg-[#0d131f]/95 shadow-md dark:shadow-2xl dark:shadow-indigo-500/10 backdrop-blur-xl',
      },
      padding: {
        none: 'p-0',
        sm: 'p-3',
        default: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
    },
  }
);

/* ============================================
   CARD COMPONENT
   ============================================ */
export interface CardProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  glowColor?: 'emerald' | 'indigo' | 'warning' | 'none';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, glowColor, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, padding }),
          glowColor === 'emerald' && 'shadow-premium-glow-emerald',
          glowColor === 'indigo' && 'shadow-premium-glow-indigo',
          glowColor === 'warning' && 'shadow-premium-glow-warning',
          className
        )}
        {...props}
      >
        {/* Premium inner gradient overlay */}
        <div 
          className="absolute inset-0 pointer-events-none hidden dark:block"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 40%)',
            borderRadius: 'inherit'
          }}
        />
        <div className="relative">{children}</div>
      </div>
    );
  }
);
Card.displayName = 'Card';

/* ============================================
   CARD HEADER, CONTENT, FOOTER
   ============================================ */
export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center pt-4', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';

/* ============================================
   INPUT COMPONENT
   ============================================ */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftIcon, rightIcon, error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-lg border border-border-subtle bg-input px-3 py-2 text-sm',
            'placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-all duration-200',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-destructive focus:ring-destructive/20',
            className
          )}
          ref={ref}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {rightIcon}
          </div>
        )}
        {error && (
          <p className="mt-1.5 text-xs text-destructive">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

/* ============================================
   BADGE VARIANTS - SUBTLE & REFINED
   ============================================ */
const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary-subtle text-primary',
        secondary: 'bg-secondary text-secondary-foreground',
        destructive: 'bg-destructive-subtle text-destructive',
        warning: 'bg-warning-subtle text-warning',
        success: 'bg-success-subtle text-success',
        indigo: 'bg-indigo-subtle text-indigo',
        outline: 'border border-border text-foreground',
        ghost: 'text-muted-foreground',
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs',
        sm: 'px-2 py-0.5 text-[10px]',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/* ============================================
   BADGE COMPONENT
   ============================================ */
export interface BadgeProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  dot?: boolean;
  icon?: ReactNode;
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, dot, icon, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(badgeVariants({ variant, size }), className)} {...props}>
        {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
        {icon}
        {children}
      </div>
    );
  }
);
Badge.displayName = 'Badge';

/* ============================================
   KPI CARD COMPONENT (Flagship Dashboard Card)
   ============================================ */
export interface KPICardProps {
  title: string;
  titleBn?: string;
  value: number | string;
  prefix?: string;
  suffix?: string;
  subtext?: string;
  subtextBn?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: ReactNode;
  iconColor?: 'emerald' | 'indigo' | 'warning' | 'destructive';
  isBangla?: boolean;
  className?: string;
  compactOnMobile?: boolean;
  onClick?: () => void;
}

export function KPICard({
  title,
  titleBn,
  value,
  prefix,
  suffix,
  subtext,
  subtextBn,
  trend,
  icon,
  iconColor = 'emerald',
  isBangla = false,
  className,
  compactOnMobile = false,
  onClick,
}: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === 'number' ? value : parseFloat(value.replace(/[^0-9.-]/g, '')) || 0;
  const prevValueRef = useRef(0);
  const hasAnimated = useRef(false);
  
  useEffect(() => {
    // Reset animation when value changes significantly (e.g., from 0 to actual value)
    if (Math.abs(numericValue - prevValueRef.current) > 0) {
      hasAnimated.current = false;
    }
    prevValueRef.current = numericValue;
    
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    
    const duration = 800;
    const steps = 30;
    const increment = numericValue / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setDisplayValue(numericValue);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [numericValue]);
  
  const iconColorClasses = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.25)]',
    indigo: 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.25)]',
    warning: 'text-amber-400 bg-amber-500/10 border border-amber-500/20 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.25)]',
    destructive: 'text-rose-400 bg-rose-500/10 border border-rose-500/20 group-hover:shadow-[0_0_15px_rgba(244,63,94,0.25)]',
  };
  
  const formatValue = (val: number) => {
    return new Intl.NumberFormat(isBangla ? 'bn-BD' : 'en-US').format(val);
  };
  
  return (
    <div
      className={cn(
        'relative overflow-hidden cursor-default group rounded-2xl border border-border/60 bg-gradient-to-b from-card/90 via-card/75 to-card/60 backdrop-blur-md p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-border/90 hover:-translate-y-1 transition-all duration-200',
        compactOnMobile && 'p-3',
        className
      )}
      onClick={onClick}
    >
      <div className={cn('flex items-start justify-between gap-3', compactOnMobile && 'gap-2')}>
        <div className={cn('space-y-1.5 min-w-0', compactOnMobile && 'space-y-1')}>
          <p className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider truncate">
            {isBangla && titleBn ? titleBn : title}
          </p>
          <div className="flex items-baseline gap-1 min-w-0">
            {prefix && <span className={cn('text-lg font-semibold text-muted-foreground', compactOnMobile && 'text-sm sm:text-lg')}>{prefix}</span>}
            <span className={cn('text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight animate-count-up', compactOnMobile && 'text-xl sm:text-3xl truncate')}>
              {typeof value === 'number' ? formatValue(displayValue) : value}
            </span>
            {suffix && <span className="text-base font-medium text-muted-foreground">{suffix}</span>}
          </div>
          {(subtext || subtextBn) && (
            <p className="text-[11px] text-muted-foreground/70 font-medium truncate pt-0.5">
              {isBangla && subtextBn ? subtextBn : subtext}
            </p>
          )}
          {trend && (
            <div className={cn(
              'flex items-center gap-1 text-xs font-medium pt-0.5',
              trend.isPositive ? 'text-emerald-400' : 'text-rose-400'
            )}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{new Intl.NumberFormat(isBangla ? 'bn-BD' : 'en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(Math.abs(trend.value))}%</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={cn(
            'h-10 w-10 sm:h-11 sm:w-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200',
            compactOnMobile && 'h-8 w-8',
            iconColorClasses[iconColor]
          )}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}


/* ============================================
   PROGRESS BAR - PREMIUM WITH SHINE
   ============================================ */
export interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient';
  color?: 'emerald' | 'indigo' | 'warning' | 'destructive';
  showValue?: boolean;
  className?: string;
}

export function Progress({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  color = 'indigo',
  showValue = false,
  className,
}: ProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };
  
  const colorClasses = {
    emerald: 'bg-emerald',
    indigo: 'bg-primary',
    warning: 'bg-warning',
    destructive: 'bg-destructive',
  };
  
  return (
    <div 
      className={cn(
        'relative w-full overflow-hidden rounded-full bg-[rgba(255,255,255,0.04)]', 
        sizeClasses[size], 
        className
      )}
    >
      <div
        className={cn(
          'h-full rounded-full transition-all duration-300 ease-out relative overflow-hidden',
          variant === 'gradient' 
            ? 'bg-gradient-to-r from-primary to-emerald' 
            : colorClasses[color]
        )}
        style={{ width: `${percentage}%` }}
      />
      {/* Shine effect */}
      <div 
        className="absolute inset-0 overflow-hidden rounded-full"
        style={{ clipPath: `inset(0 ${100 - percentage}% 0 0)` }}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
            animation: 'progress-shine 2.5s ease-in-out infinite',
            willChange: 'transform'
          }}
        />
      </div>
      {showValue && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-foreground">
          {percentage.toFixed(0)}%
        </span>
      )}
    </div>
  );
}

/* ============================================
   DIVIDER COMPONENT
   ============================================ */
export function Divider({ className }: { className?: string }) {
  return (
    <div className={cn(
      'h-px w-full bg-gradient-to-r from-transparent via-border to-transparent',
      className
    )} />
  );
}

/* ============================================
   SKELETON COMPONENT
   ============================================ */
export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className, variant = 'rectangular', width, height }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-shimmer bg-muted rounded-lg',
        variant === 'circular' && 'rounded-full',
        variant === 'text' && 'rounded',
        className
      )}
      style={{ width, height }}
    />
  );
}

/* ============================================
   EMPTY STATE COMPONENT
   ============================================ */
export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  titleBn?: string;
  description?: string;
  descriptionBn?: string;
  action?: ReactNode;
  isBangla?: boolean;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  titleBn,
  description,
  descriptionBn,
  action,
  isBangla = false,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center w-full min-h-[200px]', className)}>
      {icon && (
        <div className="mb-4 h-16 w-16 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground shrink-0">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground mb-1 whitespace-nowrap">
        {isBangla && titleBn ? titleBn : title}
      </h3>
      {description && (
        <p className="text-sm text-muted-foreground  mb-4  text-ellipsis">
          {isBangla && descriptionBn ? descriptionBn : description}
        </p>
      )}
      <div className="shrink-0">
        {action}
      </div>
    </div>
  );
}


/* ============================================
   EXPORTS
   ============================================ */
export { buttonVariants, cardVariants, badgeVariants };
