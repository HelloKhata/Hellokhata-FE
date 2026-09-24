// Hello Khata OS - View Staff Modal Component
// হ্যালো খাতা - রোলে নিয়োজিত কর্মী তালিকা মডাল

'use client';

import React from 'react';
import { Users, UserX, Eye, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import type { BaseRoleDefinition, UserAccessProfile } from './types';

interface ViewStaffModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: BaseRoleDefinition | null;
  users: UserAccessProfile[];
  onManageAccess?: (user: UserAccessProfile) => void;
  onQuickPreview?: (user: UserAccessProfile) => void;
}

export function ViewStaffModal({
  open,
  onOpenChange,
  role,
  users,
  onManageAccess,
  onQuickPreview,
}: ViewStaffModalProps) {
  const { isBangla } = useAppTranslation();

  if (!role) return null;

  const assigned = users.filter((u) => u.baseRoleId === role.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl bg-card border-border p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground font-bold text-base">
            <Users className="w-5 h-5 text-primary" />
            <span>
              {isBangla ? `${role.nameBn || role.name} - নিয়োজিত কর্মী` : `Staff Assigned to ${role.name}`}
            </span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isBangla
              ? 'এই ভূমিকায় নিযুক্ত সকল কর্মচারীদের তালিকা।'
              : 'All employees currently assigned this baseline role.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pt-2">
          {assigned.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-xs">
              <UserX className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>{isBangla ? 'এই রোলে কোনো কর্মী নিযুক্ত নেই।' : 'No staff members are assigned to this role.'}</p>
            </div>
          ) : (
            assigned.map((u) => (
              <div key={u.id} className="p-3 rounded-xl border border-border bg-muted/20 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                      {u.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-foreground truncate">{isBangla ? u.nameBn || u.name : u.name}</div>
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 truncate">
                      <span>{u.designation}</span>
                      <span>•</span>
                      <span>{u.department}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-600 bg-emerald-500/10">
                    {u.status === 'active' ? (isBangla ? 'সক্রিয়' : 'Active') : (isBangla ? 'নিষ্ক্রিয়' : 'Inactive')}
                  </Badge>

                  {onQuickPreview && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        onOpenChange(false);
                        onQuickPreview(u);
                      }}
                      className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                      title={isBangla ? 'প্রিভিউ দেখুন' : 'Quick Preview'}
                    >
                      <Eye className="w-3.5 h-3.5 text-sky-400" />
                    </Button>
                  )}

                  {onManageAccess && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        onOpenChange(false);
                        onManageAccess(u);
                      }}
                      className="h-7 px-2 text-[11px] rounded-lg border-primary/30 text-primary hover:bg-primary/10 font-semibold cursor-pointer flex items-center gap-1"
                      title={isBangla ? 'অ্যাক্সেস ও পারমিশন পরিবর্তন' : 'Manage Permissions'}
                    >
                      <KeyRound className="w-3 h-3" />
                      <span>{isBangla ? 'অ্যাক্সেস' : 'Access'}</span>
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
