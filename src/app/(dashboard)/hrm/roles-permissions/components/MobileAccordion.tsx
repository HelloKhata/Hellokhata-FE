'use client';

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { PermissionRow, MatrixPermissionsState, PermissionValue } from '@/types/permission';
import { Role, RoleCode } from '@/types/role';
import { PermissionCell } from './PermissionCell';
import { Badge } from '@/components/ui/badge';
import { Lock } from 'lucide-react';

interface MobileAccordionProps {
  roles: Role[];
  permissions: PermissionRow[];
  matrixState: MatrixPermissionsState;
  onUpdatePermission: (
    permissionId: string,
    roleCode: RoleCode,
    value: PermissionValue
  ) => void;
  onSelectRole: (role: Role) => void;
}

export const MobileAccordion: React.FC<MobileAccordionProps> = ({
  roles,
  permissions,
  matrixState,
  onUpdatePermission,
  onSelectRole,
}) => {
  return (
    <div className="space-y-3 md:hidden">
      <Accordion type="multiple" className="w-full space-y-2.5">
        {permissions.map((perm) => (
          <AccordionItem
            key={perm.id}
            value={perm.id}
            className="border border-border/60 rounded-xl bg-card px-3 shadow-2xs overflow-hidden"
          >
            <AccordionTrigger className="hover:no-underline py-3 text-left">
              <div className="flex flex-col items-start gap-1 pr-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="text-[10px] uppercase font-mono px-1.5 py-0 bg-muted/60"
                  >
                    {perm.moduleName}
                  </Badge>
                  <span className="font-semibold text-xs text-foreground">
                    {perm.feature}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-1">
                  {perm.description}
                </p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-3 space-y-2.5 border-t border-border/40">
              <div className="grid grid-cols-1 gap-2 pt-2">
                {roles.map((role) => {
                  const currentVal: PermissionValue =
                    matrixState[perm.id]?.[role.code] ||
                    perm.rolePermissions[role.code] ||
                    'none';

                  return (
                    <div
                      key={role.code}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/40"
                    >
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onSelectRole(role)}
                          className="font-medium text-xs text-foreground hover:text-primary transition-colors flex items-center gap-1"
                        >
                          {role.name}
                          {role.isProtected && (
                            <Lock className="h-3 w-3 text-amber-500 shrink-0" />
                          )}
                        </button>
                      </div>
                      <PermissionCell
                        permissionId={perm.id}
                        roleCode={role.code}
                        value={currentVal}
                        isOwner={role.isProtected}
                        onChange={(newVal) =>
                          onUpdatePermission(perm.id, role.code, newVal)
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
