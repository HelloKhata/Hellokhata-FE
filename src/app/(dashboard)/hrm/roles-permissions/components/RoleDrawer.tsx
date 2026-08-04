'use client';

import React from 'react';
import { Role } from '@/types/role';
import { PermissionRow, MatrixPermissionsState, PermissionValue } from '@/types/permission';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Users, Clock, Edit3, Eye, Slash } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface RoleDrawerProps {
  role: Role | null;
  isOpen: boolean;
  onClose: () => void;
  permissions: PermissionRow[];
  matrixState: MatrixPermissionsState;
}

export const RoleDrawer: React.FC<RoleDrawerProps> = ({
  role,
  isOpen,
  onClose,
  permissions,
  matrixState,
}) => {
  if (!role) return null;

  let editCount = 0;
  let viewCount = 0;
  let noneCount = 0;

  permissions.forEach((perm) => {
    const val: PermissionValue =
      matrixState[perm.id]?.[role.code] || perm.rolePermissions[role.code] || 'none';
    if (val === 'edit') editCount++;
    else if (val === 'view') viewCount++;
    else noneCount++;
  });

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col h-full bg-card">
        <div className="p-6 pb-4 border-b border-border/60">
          <SheetHeader className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  {role.isProtected ? (
                    <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  ) : (
                    <Shield className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <SheetTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                    {role.name}
                  </SheetTitle>
                  {role.nameBn && (
                    <span className="text-xs text-muted-foreground font-normal">
                      ({role.nameBn})
                    </span>
                  )}
                </div>
              </div>
              <Badge
                variant={role.isProtected ? 'warning' : 'outline'}
                className="text-[11px] font-medium py-0.5"
              >
                {role.isProtected ? 'Protected System Role' : 'Predefined Role'}
              </Badge>
            </div>
            <SheetDescription className="text-xs leading-relaxed text-muted-foreground pt-1">
              {role.description}
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto flex-1 scrollbar-thin">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5 text-primary" />
                <span>Assigned Staff</span>
              </div>
              <p className="text-base font-bold text-foreground">
                {role.employeeCount} Employees
              </p>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span>Last Updated</span>
              </div>
              <p className="text-xs font-semibold text-foreground pt-1">
                {new Date(role.updatedAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Permission Access Breakdown
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/40 text-center">
                <div className="flex items-center justify-center gap-1 text-emerald-700 dark:text-emerald-300 text-xs font-medium mb-1">
                  <Edit3 className="h-3 w-3" />
                  <span>Edit</span>
                </div>
                <span className="text-lg font-bold text-emerald-800 dark:text-emerald-200">
                  {editCount}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-800/40 text-center">
                <div className="flex items-center justify-center gap-1 text-blue-700 dark:text-blue-300 text-xs font-medium mb-1">
                  <Eye className="h-3 w-3" />
                  <span>View</span>
                </div>
                <span className="text-lg font-bold text-blue-800 dark:text-blue-200">
                  {viewCount}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/50 border border-border/60 text-center">
                <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs font-medium mb-1">
                  <Slash className="h-3 w-3" />
                  <span>None</span>
                </div>
                <span className="text-lg font-bold text-foreground">
                  {noneCount}
                </span>
              </div>
            </div>
          </div>

          <Separator className="bg-border/60" />

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Assigned Module Permissions
            </h4>
            <div className="space-y-2">
              {permissions.map((perm) => {
                const val: PermissionValue =
                  matrixState[perm.id]?.[role.code] ||
                  perm.rolePermissions[role.code] ||
                  'none';

                return (
                  <div
                    key={perm.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/40 text-xs"
                  >
                    <div>
                      <span className="font-medium text-foreground">
                        {perm.feature}
                      </span>
                      <p className="text-[10px] text-muted-foreground">
                        {perm.moduleName}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`capitalize text-[11px] font-medium px-2 ${
                        val === 'edit'
                          ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200'
                          : val === 'view'
                          ? 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 border-blue-200'
                          : 'text-muted-foreground bg-muted/50'
                      }`}
                    >
                      {val}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
