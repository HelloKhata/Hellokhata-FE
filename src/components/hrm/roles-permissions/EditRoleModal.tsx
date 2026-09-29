// Hello Khata OS - Edit Role Modal Component
// হ্যালো খাতা - রোল সম্পাদনা মডাল

'use client';

import  {  useState } from 'react';
import { Crown, Lock, Save, Check, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import type { BaseRoleDefinition, PermissionModuleItem } from './types';
import { ROLE_COLOR_PRESETS } from './constants';
import { getModuleIcon, getActionDetails } from './utils';
import { useGetPermissions } from '@/hooks/api/useSettings';
import { useUpdateRole } from '@/hooks/api/useRoles';

// Helper to extract initial permissions with wildcard support
export const getInitialPermissions = (
  role: any,
  permissionsList: PermissionModuleItem[] = []
): Record<string, string[]> => {
  if (role?.permissions === '*' || role?.permissions === 'all') {
    return Object.fromEntries(permissionsList.map((m) => [m.module, [...(m.actions || [])]]));
  }
  return role?.permissions || {};
};


interface EditRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: (Partial<BaseRoleDefinition> & { permissions?: any }) | any | null;
  onRoleSaved?: (role: any) => void;
  onSubmit?: (rolePayload: any) => Promise<void> | void;
}

export function EditRoleModal({
  open,
  onOpenChange,
  role,
  onRoleSaved,
  onSubmit,
}: EditRoleModalProps) {
  const { isBangla } = useAppTranslation();


  const [name, setName] = useState(role?.name || '');
  const [description, setDescription] = useState(role?.description || '');
  const [color, setColor] = useState(role?.color || '#3b82f6');

  // get all permissions from API
  const { data: rawPermissions = [], isLoading: isPermissionsLoading } = useGetPermissions();
  const permissionsList: PermissionModuleItem[] = Array.isArray(rawPermissions) ? rawPermissions : [];

  
  // Module-grouped permissions state: { sales: ['view', 'create'], ... }
  const [permissions, setPermissions] = useState<Record<string, string[]>>(getInitialPermissions(role, permissionsList));

  // Update role API mutation
  const { mutate: updateRoleMutate, isPending: isUpdating } = useUpdateRole();

  const selectedCount = Object.values(permissions).reduce((acc, actions) => acc + (actions?.length || 0), 0);
  const totalAvailablePerms = permissionsList.reduce((acc, mod) => acc + (mod.actions?.length || 0), 0);
  const isAllSelected = selectedCount === totalAvailablePerms && totalAvailablePerms > 0;

  const handleTogglePermission = (moduleName: string, action: string) => {
    setPermissions((prev) => {
      const currentActions = prev[moduleName] || [];
      const updated = currentActions.includes(action)
        ? currentActions.filter((a) => a !== action)
        : [...currentActions, action];

      if (updated.length === 0) {
        const copy = { ...prev };
        delete copy[moduleName];
        return copy;
      }

      return {
        ...prev,
        [moduleName]: updated,
      };
    });
  };

  const handleToggleAllModule = (moduleName: string, actions: string[], enable: boolean) => {
    setPermissions((prev) => {
      if (!enable) {
        const copy = { ...prev };
        delete copy[moduleName];
        return copy;
      }
      return {
        ...prev,
        [moduleName]: [...actions],
      };
    });
  };

  const handleSelectAllPermissions = (enable: boolean) => {
    if (enable) {
      const all: Record<string, string[]> = {};
      permissionsList.forEach((mod) => {
        all[mod.module] = [...(mod.actions || [])];
      });
      setPermissions(all);
    } else {
      setPermissions({});
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error(isBangla ? 'অনুগ্রহ করে রোলের নাম লিখুন।' : 'Please enter role name.');
      return;
    }

    const updatedRole = {
      name: name.trim(),
      description: description.trim(),
      color: color,
      permissions,
    };

    if (onSubmit) {
      try {
        await onSubmit(updatedRole);
        if (onRoleSaved) onRoleSaved(updatedRole);
        onOpenChange(false);
      } catch (err: any) {
        toast.error(err?.message || (isBangla ? 'রোল সংরক্ষণ করতে সমস্যা হয়েছে।' : 'Failed to save role.'));
      }
      return;
    }

    updateRoleMutate({roleId:role?.id,roleData: updatedRole}, {
      onSuccess: (data) => {
        if (data?.success || data) {
          toast.success(
            isBangla
              ? `রোল "${updatedRole.name}" সফলভাবে সংরক্ষিত হয়েছে!`
              : `Role "${updatedRole.name}" saved successfully!`
          );
          if (onRoleSaved) onRoleSaved(updatedRole);
          onOpenChange(false);
        }
      }
    });
  };

  if (!open || !role) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[94vw] max-h-[90vh] flex flex-col p-0 gap-0 rounded-2xl bg-card border-border overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-20 border-b border-border bg-card bg-gradient-to-r from-muted/40 via-muted/20 to-card p-4 sm:p-5 flex items-center justify-between gap-3 shrink-0 shadow-xs backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ring-1 ring-border/50"
              style={{ backgroundColor: color || '#3b82f6' }}
            >
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-foreground">
                  {isBangla ? `রোল সম্পাদনা: ${role?.nameBn || name}` : `Edit Role: ${name}`}
                </h2>
                {role?.isSystem || role?.isSystemProtected ? (
                  <Badge variant="outline" className="text-[10px] bg-purple-500/10 text-purple-400 border-purple-500/20 font-bold flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    {isBangla ? 'সুরক্ষিত সিস্টেম রোল' : 'System Protected'}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold">
                    {isBangla ? 'কাস্টম রোল' : 'Custom Role'}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isBangla
                  ? 'রোলের বিবরণ, কালার থিম এবং পারমিশন অ্যাক্সেস পরিবর্তন করুন'
                  : 'Update role details, color branding, and configure granular permissions'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border-border text-xs font-semibold h-9 hover:bg-muted cursor-pointer"
            >
              {isBangla ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isUpdating}
              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold h-9 shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5 mr-1" />
              {isUpdating
                ? (isBangla ? 'সংরক্ষণ হচ্ছে...' : 'Saving...')
                : (isBangla ? 'সংরক্ষণ করুন' : 'Save Changes')}
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-5">
        {/* System Protected Notice */}
        {(role?.isSystem || role?.isSystemProtected) && (
          <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-start gap-2.5 text-xs text-foreground">
            <Lock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-purple-300">
                {isBangla ? 'সিস্টেম সংরক্ষিত রোল' : 'System-Protected Baseline Role'}
              </span>
              <span className="text-muted-foreground text-[11px]">
                {isBangla
                  ? 'এই রোলের মূল নাম সিস্টেমের সাথে যুক্ত থাকার কারণে অপরিবর্তনীয়, তবে আপনি কালার এবং পারমিশন কাস্টমাইজ করতে পারেন।'
                  : 'Core role identity is locked to maintain system stability. You can customize the color theme and permissions.'}
              </span>
            </div>
          </div>
        )}

        {/* Role Details Form */}
        <div className="p-4 sm:p-5 rounded-2xl bg-muted/20 border border-border/80 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold text-foreground mb-1.5 block">
                {isBangla ? 'রোলের নাম' : 'Role Name'} <span className="text-destructive">*</span>
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isBangla ? 'যেমন: এরিয়া সেলস অফিসার' : 'e.g. Area Sales Officer'}
                className="h-9 text-xs rounded-xl bg-background border-border/80 focus-visible:border-primary disabled:opacity-75"
                disabled={role?.isSystem || role?.isSystemProtected}
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-foreground mb-1.5 block">
                {isBangla ? 'বিবরণ' : 'Description'}
              </Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                  style={{ backgroundColor: color || '#3b82f6' }}
                />
              </Label>
              <span className="text-[11px] text-muted-foreground font-mono uppercase tracking-wider">
                {color || '#3b82f6'}
              </span>
            </div>

            <div className="flex items-center flex-wrap gap-2 p-2.5 rounded-xl bg-background/80 border border-border/70">
              {ROLE_COLOR_PRESETS.map((preset) => {
                const isSelected = (color || '').toLowerCase() === preset.hex.toLowerCase();
                return (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => setColor(preset.hex)}
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
                    value={color || '#3b82f6'}
                    onChange={(e) => setColor(e.target.value)}
                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                  />
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: color || '#3b82f6' }}
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
                onClick={() => handleSelectAllPermissions(!isAllSelected)}
                className="h-7 px-2 text-xs font-semibold text-primary hover:bg-primary/10 cursor-pointer"
              >
                {isAllSelected
                  ? (isBangla ? 'সব অনুমতি বাতিল' : 'Deselect All')
                  : (isBangla ? 'সব অনুমতি নির্বাচন' : 'Select All Permissions')}
              </Button>
              <span className="text-xs text-muted-foreground font-mono">
                {selectedCount} / {totalAvailablePerms} {isBangla ? 'সক্রিয়' : 'enabled'}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {isPermissionsLoading ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                {isBangla ? 'অনুমতি লোড হচ্ছে...' : 'Loading permissions...'}
              </div>
            ) : permissionsList && permissionsList.length > 0 ? (
              permissionsList.map((module) => {
                const moduleActions = module.actions || [];
                const selectedModuleActions = permissions[module.module] || [];
                const enabledCount = selectedModuleActions.length;
                const allEnabled = moduleActions.length > 0 && enabledCount === moduleActions.length;

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
                          ({enabledCount} / {moduleActions.length})
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleAllModule(module.module, moduleActions, !allEnabled)}
                        className="h-7 text-[11px] font-semibold text-primary hover:bg-primary/10 cursor-pointer"
                      >
                        {allEnabled ? (isBangla ? 'সব বাতিল' : 'Deselect All') : (isBangla ? 'সব নির্বাচন' : 'Select All')}
                      </Button>
                    </div>
                    <div className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                      {moduleActions.map((action) => {
                        const isChecked = selectedModuleActions.includes(action);
                        const actionInfo = getActionDetails(action, isBangla);

                        return (
                          <label
                            key={action}
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
                              onChange={() => handleTogglePermission(module.module, action)}
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
              })
            ) : (
              <div className="p-8 text-center text-xs text-muted-foreground">
                {isBangla ? 'কোন অনুমতি পাওয়া যায়নি' : 'No permissions found'}
              </div>
            )}
          </div>
        </div>
      </div>
    </DialogContent>
    </Dialog>
  );
}
