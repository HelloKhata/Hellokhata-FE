// Hello Khata OS - HRM Stat Card
// হ্যালো খাতা - এইচআরএম স্ট্যাট কার্ড

'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppTranslation } from '@/hooks/useAppTranslation';

type Tone = 'indigo' | 'emerald' | 'warning' | 'destructive' | 'violet' | 'sky';

interface Props {
  title: string;
  titleBn?: string;
  value: string;
  suffix?: string;
  icon?: LucideIcon;
  tone?: Tone;
  trend?: { value: number; isPositive: boolean };
  caption?: string;
  captionBn?: string;
  index?: number;
  onClick?: () => void;
}

const TONES: Record<Tone, { icon: string; bar: string; hover: string }> = {
  indigo: { icon: 'text-primary bg-primary-subtle', bar: 'bg-primary', hover: 'hover:border-primary/40' },
  emerald: { icon: 'text-emerald bg-emerald-subtle', bar: 'bg-emerald', hover: 'hover:border-emerald/40' },
  warning: { icon: 'text-warning bg-warning-subtle', bar: 'bg-warning', hover: 'hover:border-warning/40' },
  destructive: { icon: 'text-destructive bg-destructive-subtle', bar: 'bg-destructive', hover: 'hover:border-destructive/40' },
  violet: { icon: 'text-violet-400 bg-violet-400/10', bar: 'bg-violet-400', hover: 'hover:border-violet-400/40' },
  sky: { icon: 'text-sky-400 bg-sky-400/10', bar: 'bg-sky-400', hover: 'hover:border-sky-400/40' },
};

export function HrmStatCard({
  title,
  titleBn,
  value,
  suffix,
  icon: Icon,
  tone = 'indigo',
  trend,
  caption,
  captionBn,
  index = 0,
  onClick,
}: Props) {
  const { isBangla } = useAppTranslation();
  const t = TONES[tone];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05, ease: 'easeOut' }}
      onClick={onClick}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.04)] bg-gradient-to-b from-card to-card/60 p-5 transition-all duration-200 shadow-premium-default',
        onClick && 'cursor-pointer',
        t.hover
      )}
    >
      <span className={cn('absolute left-0 top-0 bottom-0 w-0.5', t.bar)} />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground truncate">
            {isBangla && titleBn ? titleBn : title}
          </p>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
              {value}
            </span>
            {suffix && <span className="text-sm font-medium text-muted-foreground">{suffix}</span>}
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            {trend && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-[11px] font-semibold',
                  trend.isPositive ? 'text-emerald' : 'text-destructive'
                )}
              >
                {trend.isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : trend.value === 0 ? (
                  <Minus className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {Math.abs(trend.value).toFixed(1)}%
              </span>
            )}
            {(caption || captionBn) && (
              <span className="text-[11px] text-muted-foreground truncate">
                {isBangla && captionBn ? captionBn : caption}
              </span>
            )}
          </div>
        </div>
        {Icon && (
          <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center shrink-0', t.icon)}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
