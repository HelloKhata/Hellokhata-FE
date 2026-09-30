// Hello Khata OS - Quick Preview Dialog Component
// হ্যালো খাতা - দ্রুত অ্যাক্সেস প্রিভিউ ডায়ালগ

'use client';

import React, { useMemo } from 'react';
import { Eye, KeyRound, Globe, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { useGetBranches } from '@/hooks/api/useBranches';
import { HRM_BRANCHES } from '@/components/hrm/mock-data';
import type { UserAccessProfile, BaseRoleDefinition } from './types';
import { ALL_PERMISSION_IDS } from './mock-data';
import { computeEffectivePermissions } from './utils';

interface QuickPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserAccessProfile | null | any;
  baseRoles?: (BaseRoleDefinition | any)[];
  onOpenFullEditor: (user: UserAccessProfile) => void;
}

export function QuickPreviewDialog({
  open,
  onOpenChange,
  user,
  baseRoles = [],
  onOpenFullEditor,
}: QuickPreviewDialogProps) {
  const { isBangla } = useAppTranslation();
  const { data: apiBranches = [] } = useGetBranches();

  const branches = useMemo(() => {
    if (Array.isArray(apiBranches) && apiBranches.length > 0) {
      return apiBranches;
    }
    return HRM_BRANCHES;
  }, [apiBranches]);

  if (!user) return null;

  const safeRoles = Array.isArray(baseRoles) ? baseRoles : [];
  const activeRole = safeRoles.find((r: any) => r && r.id === user.baseRoleId);
  const effectivePermissions = computeEffectivePermissions(user, safeRoles);
  const userName = user.name || user.fullName || 'Staff Member';
  const userNameBn = user.nameBn || user.fullNameBn || user.name || user.fullName || 'কর্মী';
  const designation = user.designation || 'Staff';
  const department = user.department || 'General';
  const allowedBranchIds: string[] =
    Array.isArray(user.allowedBranchIds) && user.allowedBranchIds.length > 0
      ? user.allowedBranchIds
      : user.branchId
      ? [user.branchId]
      : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl bg-card border-border p-5">
        <div className="space-y-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground font-bold text-base">
              <Eye className="w-4 h-4 text-primary" />
              <span>{isBangla ? `${userNameBn} এর কার্যকর অনুমতি` : `${userName}'s Effective Access`}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {designation} • {department}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                <Building2 className="w-3 h-3 text-emerald-500" />
                {isBangla ? 'শাখা প্রবেশাধিকার' : 'Branch Access'}
              </span>
              <div className="pt-0.5">
                {user.branchScopeMode === 'all' || user.isFullSystemAccess || allowedBranchIds.length >= branches.length ? (
                  <p className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" />
                    <span>{isBangla ? 'সকল শাখা (Enterprise)' : 'All Branches (Enterprise)'}</span>
                  </p>
                ) : allowedBranchIds.length === 0 ? (
                  <p className="text-muted-foreground italic">{isBangla ? 'কোনো নির্দিষ্ট শাখা নেই' : 'No branches assigned'}</p>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {allowedBranchIds.map((bId) => {
                      const b = branches.find((br: any) => br.id === bId);
                      return (
                        <Badge key={bId} variant="secondary" className="text-[10px]">
                          {isBangla ? b?.nameBn || b?.name || bId : b?.name || bId}
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">{isBangla ? 'বেস ভূমিকা' : 'Base Role'}</span>
              <p className="font-bold text-foreground">
                {isBangla ? activeRole?.nameBn || activeRole?.name || 'কাস্টম' : activeRole?.name || 'Custom'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">{isBangla ? 'কার্যকর মোট অনুমতি' : 'Effective Permissions'}</span>
              <p className="font-bold text-primary">
                {effectivePermissions.size} of {ALL_PERMISSION_IDS.length} {isBangla ? 'অনুমতি সক্রিয়' : 'total permissions enabled'}
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
