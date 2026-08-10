// Hello Khata OS - HRM Empty State
// হ্যালো খাতা - এইচআরএম এম্পটি স্টেট

'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { useAppTranslation } from '@/hooks/useAppTranslation';

interface Props {
  icon?: LucideIcon;
  title: string;
  titleBn?: string;
  description?: string;
  descriptionBn?: string;
  action?: React.ReactNode;
  className?: string;
}

export function HrmEmptyState({
  icon: Icon,
  title,
  titleBn,
  description,
  descriptionBn,
  action,
  className,
}: Props) {
  const { isBangla } = useAppTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex flex-col items-center justify-center text-center p-10 w-full min-h-[220px] ${className || ''}`}
    >
      {Icon && (
        <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4 shrink-0">
          <Icon className="h-8 w-8 text-muted-foreground/70" />
        </div>
      )}
      <h3 className="text-base font-semibold text-foreground mb-1">
        {isBangla && titleBn ? titleBn : title}
      </h3>
      {(description || descriptionBn) && (
        <p className="text-sm text-muted-foreground mb-5 max-w-sm">
          {isBangla && descriptionBn ? descriptionBn : description}
        </p>
      )}
      {action}
    </motion.div>
  );
}
