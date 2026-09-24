// Hello Khata OS - Quick Preview Dialog Component
// হ্যালো খাতা - দ্রুত অ্যাক্সেস প্রিভিউ ডায়ালগ

'use client';

import React from 'react';
import { Eye, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { HRM_BRANCHES } from '@/components/hrm/mock-data';
import type { UserAccessProfile, BaseRoleDefinition } from './types';
import { ALL_PERMISSION_IDS } from './mock-data';
import { computeEffectivePermissions } from './utils';

interface QuickPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserAccessProfile | null;
  baseRoles: BaseRoleDefinition[];
  onOpenFullEditor: (user: UserAccessProfile) => void;
}

export function QuickPreviewDialog({
  open,
  onOpenChange,
  user,
  baseRoles,
  onOpenFullEditor,
}: QuickPreviewDialogProps) {
  const { isBangla } = useAppTranslation();

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl bg-card border-border p-5">
        <div className="space-y-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground font-bold">
              <Eye className="w-4 h-4 text-primary" />
              <span>{isBangla ? `${user.nameBn || user.name} এর কার্যকর অনুমতি` : `${user.name}'s Effective Access`}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {user.designation} • {user.department}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">{isBangla ? 'শাখা প্রবেশাধিকার' : 'Branch Access'}</span>
              <p className="font-bold text-foreground">
                {user.branchScopeMode === 'all'
                  ? (isBangla ? 'সকল শাখা (Enterprise)' : 'All Branches (Enterprise)')
                  : user.allowedBranchIds.map((id) => HRM_BRANCHES.find((b) => b.id === id)?.name).join(', ')}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">{isBangla ? 'বেস ভূমিকা' : 'Base Role'}</span>
              <p className="font-bold text-foreground">
                {baseRoles.find((r) => r.id === user.baseRoleId)?.name || 'Custom'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">{isBangla ? 'কার্যকর মোট অনুমতি' : 'Effective Permissions'}</span>
              <p className="font-bold text-primary">
                {computeEffectivePermissions(user, baseRoles).size} of {ALL_PERMISSION_IDS.length} {isBangla ? 'অনুমতি সক্রিয়' : 'total permissions enabled'}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => {
                onOpenChange(false);
                onOpenFullEditor(user);
              }}
              className="w-full rounded-xl bg-primary text-primary-foreground font-bold text-xs h-9 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 mr-1" />
              {isBangla ? 'পূর্ণ অ্যাক্সেস কনফিগার করুন' : 'Open Full Access Editor'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
