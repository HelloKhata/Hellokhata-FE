// Hello Khata OS - Create Role Modal Component
// হ্যালো খাতা - নতুন রোল তৈরি মডাল

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Check, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import type { BaseRoleDefinition, PermissionModuleItem } from './types';
import { ROLE_COLOR_PRESETS, DEFAULT_PERMISSION_MODULES } from './mock-data';
import { getModuleIcon, getActionDetails } from './utils';
import { useGetPermissions } from '@/hooks/api/useSettings';

export interface RolePayload {
  name: string;
  nameBn?: string;
  description: string;
  color: string;
  permissions: Record<string, string[]>;
}

// Helper to format flat permission IDs into module-grouped permissions object
export const formatPermissions = (
  permIds: string[],
  modules: PermissionModuleItem[] = DEFAULT_PERMISSION_MODULES
): Record<string, string[]> => {
  const result: Record<string, string[]> = {};

  // Group actions by module based on available modules
  modules.forEach((mod) => {
    const selectedActions = mod.actions.filter((action) =>
      permIds.includes(`${mod.module}_${action}`)
    );
    if (selectedActions.length > 0) {
      result[mod.module] = selectedActions;
    }
  });

  // Fallback for any custom or extra permId not explicitly in modules
  permIds.forEach((permId) => {
    const lastUnderscore = permId.lastIndexOf('_');
    if (lastUnderscore !== -1) {
      const modName = permId.slice(0, lastUnderscore);
      const action = permId.slice(lastUnderscore + 1);
      if (!result[modName]) {
        result[modName] = [];
      }
      if (!result[modName].includes(action)) {
        result[modName].push(action);
      }
    }
  });

  return result;
};

interface CreateRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoleCreated?: (rolePayload: RolePayload, newRoleDefinition?: BaseRoleDefinition) => void;
  onSubmit?: (rolePayload: RolePayload) => Promise<void> | void;
}

export function CreateRoleModal({
  open,
  onOpenChange,
  onRoleCreated,
  onSubmit,
}: CreateRoleModalProps) {
  const { isBangla } = useAppTranslation();

  const [createRoleData, setCreateRoleData] = useState({
    name: '',
    description: '',
    color: '#6366f1',
  });
  const [createRolePermissions, setCreateRolePermissions] = useState<string[]>([]);

  // get all roles & permissions from API
  const { data: rawPermissions } = useGetPermissions();

  const permissionModules: PermissionModuleItem[] = useMemo(() => {
    if (Array.isArray(rawPermissions) && rawPermissions.length > 0) {
      return rawPermissions;
    }
    return DEFAULT_PERMISSION_MODULES;
  }, [rawPermissions]);

  const allAvailablePermissionIds = useMemo(() => {
    return permissionModules.flatMap((mod) =>
      mod.actions.map((action) => `${mod.module}_${action}`)
    );
  }, [permissionModules]);

  const resetForm = () => {
    setCreateRoleData({
      name: '',
      description: '',
      color: '#6366f1',
    });
    setCreateRolePermissions([]);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };


  const handleTogglePermission = (permId: string) => {
    setCreateRolePermissions((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
    );
  };

  const handleToggleAllModulePermissions = (mod: PermissionModuleItem, enable: boolean) => {
    const modPermIds = mod.actions.map((action) => `${mod.module}_${action}`);
    console.log('mod',mod);
    console.log('modPermIds',modPermIds);
    console.log('enable',enable)
    if (enable) {
      setCreateRolePermissions((prev) => Array.from(new Set([...prev, ...modPermIds])));
    } else {
      setCreateRolePermissions((prev) => prev.filter((p) => !modPermIds.includes(p)));
    }
  };

  const handleSelectAllPermissions = (enable: boolean) => {
    if (enable) {
      setCreateRolePermissions([...allAvailablePermissionIds]);
    } else {
      setCreateRolePermissions([]);
    }
  };

  const handleSubmit = async () => {
    if (!createRoleData.name.trim()) {
      toast.error(isBangla ? 'অনুগ্রহ করে রোলের নাম লিখুন।' : 'Please enter role name.');
      return;
    }

    const formattedPermissions = formatPermissions(createRolePermissions, permissionModules);

    const newRole: RolePayload = {
      name: createRoleData.name.trim(),
      description: createRoleData.description.trim(),
      color: createRoleData.color || '#6366f1',
      permissions: formattedPermissions,
    };

    console.log('newRole payload:', newRole);

    try {
      if (onSubmit) {
        await onSubmit(newRole);
      }
      if (onRoleCreated) {
        const newRoleDef: BaseRoleDefinition = {
          id: `role-${Date.now()}`,
          name: newRole.name,
          nameBn: newRole.name,
          description: newRole.description,
          descriptionBn: newRole.description,
          isSystemProtected: false,
          color: newRole.color,
          defaultDataScope: 'entire_business',
          defaultBranchMode: 'all',
          permissionIds: createRolePermissions,
        };
        onRoleCreated(newRole, newRoleDef);
      }

      handleOpenChange(false);
      toast.success(
        isBangla
          ? `নতুন রোল "${newRole.name}" সফলভাবে তৈরি হয়েছে!`
          : `New role "${newRole.name}" created successfully!`
      );
    } catch (err: any) {
      toast.error(err?.message || (isBangla ? 'রোল তৈরি করতে সমস্যা হয়েছে।' : 'Failed to create role.'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl w-[94vw] max-h-[90vh] flex flex-col p-0 gap-0 rounded-2xl bg-card border-border overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border bg-gradient-to-r from-muted/30 via-muted/15 to-transparent flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ring-1 ring-border/50"
              style={{ backgroundColor: createRoleData.color || '#6366f1' }}
            >
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-foreground">
                  {isBangla ? 'নতুন রোল তৈরি করুন' : 'Create New Role'}
                </h2>
                <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20 font-bold">
                  {isBangla ? 'নতুন ভূমিকা' : 'New Role'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isBangla
                  ? 'কাস্টম রোলের নাম, থিম কালার ও মডিউল পারমিশন নির্ধারণ করুন'
                  : 'Define custom role identity, visual color, and configure modular permissions'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenChange(false)}
              className="rounded-xl border-border text-xs font-semibold h-9 hover:bg-muted cursor-pointer"
            >
              {isBangla ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold h-9 shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              {isBangla ? 'রোল তৈরি করুন' : 'Create Role'}
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Form Details */}
          <div className="p-4 sm:p-5 rounded-2xl bg-muted/20 border border-border/80 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold text-foreground mb-1.5 block">
                  {isBangla ? 'রোলের নাম' : 'Role Name'} <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={createRoleData.name}
                  onChange={(e) => setCreateRoleData({ ...createRoleData, name: e.target.value })}
                  placeholder={isBangla ? 'যেমন: এরিয়া সেলস অফিসার' : 'e.g. Area Sales Officer'}
                  className="h-9 text-xs rounded-xl bg-background border-border/80 focus-visible:border-primary"
                  autoFocus
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-foreground mb-1.5 block">
                  {isBangla ? 'বিবরণ' : 'Description'}
                </Label>
                <Input
                  value={createRoleData.description}
                  onChange={(e) => setCreateRoleData({ ...createRoleData, description: e.target.value })}
                  placeholder={isBangla ? 'দায়িত্ব ও কাজের সংক্ষিপ্ত বিবরণ' : 'Brief summary of duties and responsibilities'}
                  className="h-9 text-xs rounded-xl bg-background border-border/80 focus-visible:border-primary"
                />
              </div>
            </div>

            {/* Role Color Template Picker */}
            <div className="space-y-2 pt-2 border-t border-border/40">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-foreground flex items-center gap-2">
                  <span>{isBangla ? 'রোলের কালার থিম' : 'Role Color'}</span>
                  <span
                    className="w-3.5 h-3.5 rounded-full ring-1 ring-border/80 shadow-xs inline-block transition-transform duration-200"
                    style={{ backgroundColor: createRoleData.color || '#6366f1' }}
                  />
                </Label>
                <span className="text-[11px] text-muted-foreground font-mono uppercase tracking-wider">
                  {createRoleData.color || '#6366f1'}
                </span>
              </div>

              <div className="flex items-center flex-wrap gap-2 p-2.5 rounded-xl bg-background/80 border border-border/70">
                {ROLE_COLOR_PRESETS.map((preset) => {
                  const isSelected = (createRoleData.color || '').toLowerCase() === preset.hex.toLowerCase();
                  return (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => setCreateRoleData({ ...createRoleData, color: preset.hex })}
                      title={preset.name}
                      className={`w-7 h-7 rounded-full transition-all duration-150 flex items-center justify-center cursor-pointer relative ${
                        isSelected
                          ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110 shadow-sm'
                          : 'hover:scale-105 opacity-85 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: preset.hex }}
                    >
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-white drop-shadow stroke-[3]" />
                      )}
                    </button>
                  );
                })}

                {/* Custom Color Picker Swatch */}
                <div className="flex items-center gap-1.5 pl-2 border-l border-border/70 ml-1">
                  <label
                    title={isBangla ? 'কাস্টম কালার পিক করুন' : 'Pick custom color'}
                    className="w-7 h-7 rounded-full border border-dashed border-border hover:border-primary flex items-center justify-center cursor-pointer relative overflow-hidden bg-muted/40 hover:bg-muted/80 transition-colors"
                  >
                    <input
                      type="color"
                      value={createRoleData.color || '#6366f1'}
                      onChange={(e) => setCreateRoleData({ ...createRoleData, color: e.target.value })}
                      className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                    />
                    <span
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: createRoleData.color || '#6366f1' }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Modules & Permissions Matrix */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>{isBangla ? 'মডিউল ভিত্তিক অনুমতি' : 'Module Permissions'}</span>
              </h3>
              <div className="flex items-center gap-2.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSelectAllPermissions(createRolePermissions.length !== allAvailablePermissionIds.length)}
                  className="h-7 px-2 text-xs font-semibold text-primary hover:bg-primary/10 cursor-pointer"
                >
                  {createRolePermissions.length === allAvailablePermissionIds.length
                    ? (isBangla ? 'সব অনুমতি বাতিল' : 'Deselect All')
                    : (isBangla ? 'সব অনুমতি নির্বাচন' : 'Select All Permissions')}
                </Button>
                <span className="text-xs text-muted-foreground font-mono">
                  {createRolePermissions.length} / {allAvailablePermissionIds.length} {isBangla ? 'সক্রিয়' : 'enabled'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {permissionModules.map((module) => {
                const modPermIds = module.actions.map((act) => `${module.module}_${act}`);
                const enabledCount = modPermIds.filter((id) => createRolePermissions.includes(id)).length;
                const allEnabled = modPermIds.length > 0 && enabledCount === modPermIds.length;
                console.log('modPermIds',modPermIds)
                console.log('enabledCount',enabledCount)
                console.log('allEnabled',allEnabled)
                console.log('module',module)
                return (
                  <div key={module.module} className="rounded-xl border border-border bg-card overflow-hidden">
                    <div className="p-3 bg-muted/30 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-background border border-border/80 flex items-center justify-center">
                          {getModuleIcon(module.module)}
                        </div>
                        <span className="font-bold text-xs text-foreground">
                          {isBangla ? module.labelBn || module.label : module.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          ({enabledCount} / {modPermIds.length})
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleAllModulePermissions(module, !allEnabled)}
                        className="h-7 text-[11px] font-semibold text-primary hover:bg-primary/10 cursor-pointer"
                      >
                        {allEnabled ? (isBangla ? 'সব বাতিল' : 'Deselect All') : (isBangla ? 'সব নির্বাচন' : 'Select All')}
                      </Button>
                    </div>
                    <div className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                      {module.actions.map((action) => {
                        const permId = `${module.module}_${action}`;
                        const isChecked = createRolePermissions.includes(permId);
                        const actionInfo = getActionDetails(action, isBangla);

                        return (
                          <label
                            key={permId}
                            className={cn(
                              'flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors',
                              isChecked
                                ? 'bg-primary/5 border-primary/30 text-foreground shadow-xs'
                                : 'border-border/60 text-muted-foreground hover:bg-muted/30 hover:border-border'
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleTogglePermission(permId)}
                              className="mt-0.5 rounded border-border text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <span className="font-bold text-xs text-foreground block truncate">
                                  {actionInfo.label}
                                </span>
                              </div>
                              <span className="text-[10px] text-muted-foreground leading-tight line-clamp-1 block">
                                {actionInfo.description}
                              </span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
