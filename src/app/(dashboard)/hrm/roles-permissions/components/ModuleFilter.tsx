'use client';

import React from 'react';
import { ModuleCategory } from '@/types/permission';
import { cn } from '@/lib/utils';

interface ModuleFilterProps {
  selected: ModuleCategory;
  onSelect: (category: ModuleCategory) => void;
}

const CATEGORIES: ModuleCategory[] = [
  'All',
  'Sales',
  'Inventory',
  'Purchase',
  'Finance',
  'HR',
  'Reports',
  'Settings',
];

export const ModuleFilter: React.FC<ModuleFilterProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 max-w-full">
      {CATEGORIES.map((cat) => {
        const isActive = selected === cat;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelect(cat)}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all duration-150 border',
              isActive
                ? 'bg-primary text-primary-foreground border-primary shadow-2xs font-semibold'
                : 'bg-background hover:bg-muted text-muted-foreground hover:text-foreground border-border/60'
            )}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};
