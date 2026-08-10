// Hello Khata OS - HRM Page Header
// হ্যালো খাতা - এইচআরএম পেজ হেডার

'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { HrmBreadcrumb } from './HrmBreadcrumb';

interface Props {
  title: string;
  titleBn?: string;
  subtitle?: string;
  subtitleBn?: string;
  icon?: LucideIcon;
  breadcrumbs?: { label: string; labelBn?: string; href?: string }[];
  actions?: React.ReactNode;
}

export function HrmPageHeader({
  title,
  titleBn,
  subtitle,
  subtitleBn,
  icon: Icon,
  breadcrumbs,
  actions,
}: Props) {
  const { isBangla } = useAppTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="mb-6"
    >
      {breadcrumbs && <HrmBreadcrumb items={breadcrumbs} />}

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="flex items-start gap-3">
          {Icon && (
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/20 to-emerald/10 flex items-center justify-center shrink-0 border border-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          )}
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
              {isBangla && titleBn ? titleBn : title}
            </h1>
            {(subtitle || subtitleBn) && (
              <p className="text-sm text-muted-foreground mt-1">
                {isBangla && subtitleBn ? subtitleBn : subtitle}
              </p>
            )}
          </div>
        </div>

        {actions && <div className="flex items-center gap-2 flex-wrap shrink-0">{actions}</div>}
      </div>
    </motion.div>
  );
}
