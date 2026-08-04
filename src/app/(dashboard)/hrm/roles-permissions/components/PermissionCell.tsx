'use client';

import React from 'react';
import { PermissionValue } from '@/types/permission';
import { RoleCode } from '@/types/role';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Lock, Eye, Edit3, Slash } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PermissionCellProps {
  permissionId: string;
  roleCode: RoleCode;
  value: PermissionValue;
  isOwner?: boolean;
  onChange: (val: PermissionValue) => void;
}

export const PermissionCell: React.FC<PermissionCellProps> = ({
  roleCode,
  value,
  isOwner = false,
  onChange,
}) => {
  if (isOwner || roleCode === 'owner') {
    return (
      <div className="flex items-center justify-center py-1">
        <Badge
          variant="outline"
          className="bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/40 text-[11px] font-medium py-1 px-2.5 flex items-center gap-1.5 shadow-2xs cursor-not-allowed"
          title="Owner system role is protected and immutable"
        >
          <Lock className="h-3 w-3 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Protected</span>
        </Badge>
      </div>
    );
  }

  const getStyleForValue = (val: PermissionValue) => {
    switch (val) {
      case 'edit':
        return 'text-emerald-700 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800/50';
      case 'view':
        return 'text-blue-700 dark:text-blue-300 bg-blue-50/80 dark:bg-blue-950/40 border-blue-200/80 dark:border-blue-800/50';
      case 'none':
      default:
        return 'text-muted-foreground bg-muted/30 border-border/50';
    }
  };

  return (
    <div className="flex items-center justify-center py-0.5">
      <Select
        value={value}
        onValueChange={(newVal) => onChange(newVal as PermissionValue)}
      >
        <SelectTrigger
          className={cn(
            'h-8 w-28 text-xs font-medium rounded-lg border transition-all justify-between px-2.5 shadow-2xs focus:ring-1 focus:ring-primary',
            getStyleForValue(value)
          )}
          aria-label={`Permission for ${roleCode}`}
        >
          <SelectValue>
            <div className="flex items-center gap-1.5">
              {value === 'edit' && <Edit3 className="h-3 w-3 shrink-0" />}
              {value === 'view' && <Eye className="h-3 w-3 shrink-0" />}
              {value === 'none' && <Slash className="h-3 w-3 shrink-0 text-muted-foreground" />}
              <span className="capitalize">{value}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent align="center" className="min-w-[120px] rounded-lg">
          <SelectItem value="none" className="text-xs">
            <div className="flex items-center gap-2">
              <Slash className="h-3.5 w-3.5 text-muted-foreground" />
              <span>None</span>
            </div>
          </SelectItem>
          <SelectItem value="view" className="text-xs">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Eye className="h-3.5 w-3.5" />
              <span>View</span>
            </div>
          </SelectItem>
          <SelectItem value="edit" className="text-xs">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
