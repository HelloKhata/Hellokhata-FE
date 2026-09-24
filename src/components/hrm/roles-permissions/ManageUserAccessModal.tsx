// Hello Khata OS - Manage User Access Modal Component
// হ্যালো খাতা - ব্যবহারকারী অ্যাক্সেস ও অনুমতি ব্যবস্থাপনা মডাল

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  KeyRound,
  RotateCcw,
  Save,
  Crown,
  Building2,
  Shield,
  ShieldAlert,
  Sparkles,
  Globe,
  Lock,
  Check,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { HRM_BRANCHES } from '@/components/hrm/mock-data';
import { cn } from '@/lib/utils';
import type {
  UserAccessProfile,
  BaseRoleDefinition,
  AccessAuditEntry,
  ERPModuleDefinition,
  PermissionLevelType,
  PermissionAction,
} from './types';
import {
  ERP_MODULES,
  ALL_PERMISSION_IDS,
  ALL_SENSITIVE_PERMISSION_IDS,
  PERMISSION_BY_ID_MAP,
  MODULE_BY_PERMISSION_ID_MAP,
} from './mock-data';
import { computeEffectivePermissions } from './utils';
import { FullAccessWarningDialog } from './FullAccessWarningDialog';
import { DiffConfirmDialog } from './DiffConfirmDialog';

interface ManageUserAccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserAccessProfile | null;
  baseRoles: BaseRoleDefinition[];
  onSaveUser: (updatedUser: UserAccessProfile, auditEntry: AccessAuditEntry) => void;
}

export function ManageUserAccessModal({
  open,
  onOpenChange,
  user,
  baseRoles,
  onSaveUser,
}: ManageUserAccessModalProps) {
  const { isBangla } = useAppTranslation();

  const [draftUser, setDraftUser] = useState<UserAccessProfile | null>(null);
  const [expandedModuleIds, setExpandedModuleIds] = useState<string[]>(['mod_sales', 'mod_inventory']);
  const [permissionModuleSearch, setPermissionModuleSearch] = useState('');

  // Child confirmation modals
  const [isFullAccessWarningOpen, setIsFullAccessWarningOpen] = useState(false);
  const [isDiffConfirmOpen, setIsDiffConfirmOpen] = useState(false);

  useEffect(() => {
    if (user && open) {
      setDraftUser(JSON.parse(JSON.stringify(user)));
    }
  }, [user, open]);

  const activeRoleDefinition = useMemo(() => {
    if (!draftUser) return null;
    return baseRoles.find((r) => r.id === draftUser.baseRoleId) || null;
  }, [draftUser, baseRoles]);

  const draftEffectivePermissions = useMemo(() => {
    if (!draftUser) return new Set<string>();
    return computeEffectivePermissions(draftUser, baseRoles);
  }, [draftUser, baseRoles]);

  // Diff computation for confirmation dialog
  const permissionDiff = useMemo(() => {
    if (!user || !draftUser) {
      return { added: [], removed: [], branchAdded: [], branchRemoved: [], sensitiveGranted: [] };
    }

    const oldPerms = computeEffectivePermissions(user, baseRoles);
    const newPerms = computeEffectivePermissions(draftUser, baseRoles);

    const added: PermissionAction[] = [];
    const removed: PermissionAction[] = [];
    const sensitiveGranted: PermissionAction[] = [];

    newPerms.forEach((pId) => {
      if (!oldPerms.has(pId)) {
        const pObj = PERMISSION_BY_ID_MAP.get(pId);
        if (pObj) {
          added.push(pObj);
          if (pObj.isSensitive) sensitiveGranted.push(pObj);
        }
      }
    });

    oldPerms.forEach((pId) => {
      if (!newPerms.has(pId)) {
        const pObj = PERMISSION_BY_ID_MAP.get(pId);
        if (pObj) removed.push(pObj);
      }
    });

    const oldBranches = new Set(user.allowedBranchIds);
    const newBranches = new Set(draftUser.allowedBranchIds);

    const branchAdded = draftUser.allowedBranchIds.filter((id) => !oldBranches.has(id));
    const branchRemoved = user.allowedBranchIds.filter((id) => !newBranches.has(id));

    return { added, removed, branchAdded, branchRemoved, sensitiveGranted };
  }, [user, draftUser, baseRoles]);

  if (!draftUser || !user) return null;

  // Handlers
  const handleToggleFullSystemAccess = (enable: boolean) => {
    if (enable) {
      setIsFullAccessWarningOpen(true);
    } else {
      setDraftUser({
        ...draftUser,
        isFullSystemAccess: false,
        accessLevel: draftUser.allowedBranchIds.length < HRM_BRANCHES.length ? 'branch_restricted' : 'custom_access',
      });
      toast.info(isBangla ? 'পূর্ণ সিস্টেম অ্যাক্সেস নিষ্ক্রিয় করা হয়েছে।' : 'Full System Access disabled. Base role permissions restored.');
    }
  };

  const confirmGrantFullSystemAccess = () => {
    setDraftUser({
      ...draftUser,
      isFullSystemAccess: true,
      accessLevel: 'full_system',
      branchScopeMode: 'all',
      allowedBranchIds: HRM_BRANCHES.map((b) => b.id),
      dataScope: 'entire_business',
      customGrantedPermissions: [],
      customRevokedPermissions: [],
    });
    setIsFullAccessWarningOpen(false);
    toast.success(
      isBangla
        ? 'সতর্কতা: এই ব্যবহারকারীকে পূর্ণ সিস্টেম অ্যাক্সেস প্রদান করা হয়েছে!'
        : 'Full System Access granted! User now has unrestricted access across all branches and modules.'
    );
  };

  const handleBaseRoleChange = (roleId: string) => {
    const selectedRole = baseRoles.find((r) => r.id === roleId);
    if (!selectedRole) return;

    setDraftUser({
      ...draftUser,
      baseRoleId: roleId,
      isFullSystemAccess: selectedRole.id === 'role-owner',
      accessLevel: selectedRole.id === 'role-owner' ? 'full_system' : 'custom_access',
      dataScope: selectedRole.defaultDataScope,
      branchScopeMode: selectedRole.defaultBranchMode,
      customGrantedPermissions: [],
      customRevokedPermissions: [],
    });
    toast.info(
      isBangla
        ? `বেস ভূমিকা "${selectedRole.nameBn || selectedRole.name}" হিসেবে নির্বাচন করা হয়েছে।`
        : `Base role changed to "${selectedRole.name}". Default permissions applied.`
    );
  };

  const handleToggleBranch = (branchId: string) => {
    if (draftUser.isFullSystemAccess) return;
    const exists = draftUser.allowedBranchIds.includes(branchId);
    let newBranches: string[];
    if (exists) {
      if (draftUser.allowedBranchIds.length === 1) {
        toast.error(isBangla ? 'কমপক্ষে একটি শাখা নির্বাচন করতে হবে।' : 'At least one branch must be assigned.');
        return;
      }
      newBranches = draftUser.allowedBranchIds.filter((id) => id !== branchId);
    } else {
      newBranches = [...draftUser.allowedBranchIds, branchId];
    }

    setDraftUser({
      ...draftUser,
      allowedBranchIds: newBranches,
      branchScopeMode: newBranches.length === HRM_BRANCHES.length ? 'all' : 'selected',
      accessLevel: newBranches.length < HRM_BRANCHES.length ? 'branch_restricted' : 'custom_access',
    });
  };

  const handleToggleAllBranches = (all: boolean) => {
    if (draftUser.isFullSystemAccess) return;
    if (all) {
      setDraftUser({
        ...draftUser,
        branchScopeMode: 'all',
        allowedBranchIds: HRM_BRANCHES.map((b) => b.id),
      });
    } else {
      setDraftUser({
        ...draftUser,
        branchScopeMode: 'selected',
        allowedBranchIds: [HRM_BRANCHES[0].id],
        accessLevel: 'branch_restricted',
      });
    }
  };

  const handlePermissionToggle = (permissionId: string) => {
    if (draftUser.isFullSystemAccess || !activeRoleDefinition) return;

    const isCurrentlyGranted = draftEffectivePermissions.has(permissionId);
    const roleHasIt = activeRoleDefinition.permissionIds.includes(permissionId);

    let newGranted = [...draftUser.customGrantedPermissions];
    let newRevoked = [...draftUser.customRevokedPermissions];

    if (isCurrentlyGranted) {
      if (roleHasIt) {
        if (!newRevoked.includes(permissionId)) newRevoked.push(permissionId);
      } else {
        newGranted = newGranted.filter((id) => id !== permissionId);
      }
    } else {
      if (roleHasIt) {
        newRevoked = newRevoked.filter((id) => id !== permissionId);
      } else {
        if (!newGranted.includes(permissionId)) newGranted.push(permissionId);
      }
    }

    setDraftUser({
      ...draftUser,
      customGrantedPermissions: newGranted,
      customRevokedPermissions: newRevoked,
      accessLevel: 'custom_access',
    });
  };

  const handleModuleQuickLevelChange = (module: ERPModuleDefinition, level: PermissionLevelType) => {
    if (draftUser.isFullSystemAccess || !activeRoleDefinition) return;

    const modulePermissionIds = module.permissions.map((p) => p.id);
    let targetGrantedIds: string[] = [];

    if (level === 'no_access') {
      targetGrantedIds = [];
    } else if (level === 'read_only') {
      targetGrantedIds = module.readOnlyPermissionIds;
    } else if (level === 'standard') {
      targetGrantedIds = module.standardPermissionIds;
    } else if (level === 'full_access') {
      targetGrantedIds = modulePermissionIds;
    } else {
      if (!expandedModuleIds.includes(module.id)) {
        setExpandedModuleIds([...expandedModuleIds, module.id]);
      }
      return;
    }

    let newGranted = draftUser.customGrantedPermissions.filter((id) => !modulePermissionIds.includes(id));
    let newRevoked = draftUser.customRevokedPermissions.filter((id) => !modulePermissionIds.includes(id));

    module.permissions.forEach((p) => {
      const shouldHave = targetGrantedIds.includes(p.id);
      const roleHas = activeRoleDefinition.permissionIds.includes(p.id);

      if (shouldHave && !roleHas) {
        newGranted.push(p.id);
      } else if (!shouldHave && roleHas) {
        newRevoked.push(p.id);
      }
    });

    setDraftUser({
      ...draftUser,
      customGrantedPermissions: newGranted,
      customRevokedPermissions: newRevoked,
      accessLevel: 'custom_access',
    });

    toast.success(
      isBangla
        ? `মডিউল "${module.nameBn}" এর অনুমতি "${level}" হিসেবে সেট করা হয়েছে।`
        : `"${module.name}" updated to ${level.replace('_', ' ').toUpperCase()}.`
    );
  };

  const handleResetModuleToRole = (module: ERPModuleDefinition) => {
    const modulePermissionIds = module.permissions.map((p) => p.id);
    const newGranted = draftUser.customGrantedPermissions.filter((id) => !modulePermissionIds.includes(id));
    const newRevoked = draftUser.customRevokedPermissions.filter((id) => !modulePermissionIds.includes(id));

    setDraftUser({
      ...draftUser,
      customGrantedPermissions: newGranted,
      customRevokedPermissions: newRevoked,
    });

    toast.info(
      isBangla
        ? `মডিউল "${module.nameBn}" ভূমিকা অনুযায়ী রিসেট করা হয়েছে।`
        : `"${module.name}" reset to base role defaults.`
    );
  };

  const handleResetAllToRole = () => {
    setDraftUser({
      ...draftUser,
      customGrantedPermissions: [],
      customRevokedPermissions: [],
      accessLevel: draftUser.allowedBranchIds.length < HRM_BRANCHES.length ? 'branch_restricted' : 'custom_access',
    });
    toast.success(
      isBangla
        ? 'সকল কাস্টম ওভাররাইড মুছে ফেলা হয়েছে এবং মূল ভূমিকার অনুমতি বহাল রাখা হয়েছে।'
        : 'All custom overrides cleared. Reverted to base role permissions.'
    );
  };

  const handleSaveClick = () => {
    const hasPermDiff = permissionDiff.added.length > 0 || permissionDiff.removed.length > 0;
    const hasBranchDiff = permissionDiff.branchAdded.length > 0 || permissionDiff.branchRemoved.length > 0;
    const hasRoleDiff = user.baseRoleId !== draftUser.baseRoleId;
    const hasFullAccessDiff = user.isFullSystemAccess !== draftUser.isFullSystemAccess;

    if (!hasPermDiff && !hasBranchDiff && !hasRoleDiff && !hasFullAccessDiff) {
      onSaveUser(draftUser, {
        id: `aud-${Date.now()}`,
        timestamp: 'Just now',
        performedBy: 'Sweet Ali (Owner)',
        targetUserName: draftUser.name,
        targetUserRole: activeRoleDefinition?.name || 'Custom',
        actionType: 'status_changed',
        addedPermissions: [],
        removedPermissions: [],
        notes: 'Access profile verified with no changes.',
      });
      onOpenChange(false);
      toast.success(isBangla ? 'পরিবর্তন সংরক্ষিত হয়েছে।' : 'Changes saved successfully.');
      return;
    }

    setIsDiffConfirmOpen(true);
  };

  const handleConfirmAndApply = () => {
    const newAudit: AccessAuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: 'Just now',
      performedBy: 'Sweet Ali (Owner)',
      targetUserName: draftUser.name,
      targetUserRole: activeRoleDefinition?.name || 'Custom',
      actionType: draftUser.isFullSystemAccess ? 'full_access_granted' : 'permission_override',
      addedPermissions: permissionDiff.added.map((p) => `${MODULE_BY_PERMISSION_ID_MAP.get(p.id)?.name || ''} → ${p.name}`),
      removedPermissions: permissionDiff.removed.map((p) => `${MODULE_BY_PERMISSION_ID_MAP.get(p.id)?.name || ''} → ${p.name}`),
      branchChanges: {
        added: permissionDiff.branchAdded.map((id) => HRM_BRANCHES.find((b) => b.id === id)?.name || id),
        removed: permissionDiff.branchRemoved.map((id) => HRM_BRANCHES.find((b) => b.id === id)?.name || id),
      },
      notes: `Access profile updated by Owner with ${permissionDiff.added.length} added and ${permissionDiff.removed.length} revoked permissions.`,
    };

    const updatedUser: UserAccessProfile = {
      ...draftUser,
      updatedAt: 'Just now',
      updatedBy: 'Sweet Ali',
    };

    onSaveUser(updatedUser, newAudit);
    setIsDiffConfirmOpen(false);
    onOpenChange(false);
    toast.success(
      isBangla
        ? `সফলভাবে ${draftUser.name} এর অ্যাক্সেস ও অনুমতি আপডেট করা হয়েছে!`
        : `Access control and permissions updated for ${draftUser.name}!`
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl w-[96vw] max-h-[92vh] flex flex-col p-0 gap-0 rounded-2xl bg-card border-border overflow-hidden">
          {/* Modal Top Header */}
          <div className="p-4 sm:p-5 border-b border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <Avatar className="w-11 h-11 border-2 border-primary/20 shadow-xs">
                <AvatarFallback className="bg-primary/10 text-primary font-black text-sm">
                  {draftUser.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-extrabold text-foreground">
                    {isBangla ? draftUser.nameBn || draftUser.name : draftUser.name}
                  </h2>
                  {draftUser.isOwner && (
                    <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 text-[10px]">
                      Owner
                    </Badge>
                  )}
                  <span
                    className={cn(
                      'w-2 h-2 rounded-full inline-block',
                      draftUser.status === 'active' ? 'bg-emerald-500' : 'bg-muted-foreground'
                    )}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <span className="font-mono">{draftUser.employeeId}</span>
                  <span>•</span>
                  <span>{draftUser.department}</span>
                  <span>•</span>
                  <span>{draftUser.designation}</span>
                  <span>•</span>
                  <span>{draftUser.email}</span>
                </div>
              </div>
            </div>

            {/* Right Action Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetAllToRole}
                className="rounded-xl border-border text-xs font-semibold h-9 hover:bg-muted cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                {isBangla ? 'ভূমিকা অনুযায়ী রিসেট' : 'Reset to Role'}
              </Button>

              <Button
                size="sm"
                onClick={handleSaveClick}
                className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold h-9 shadow-sm cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 mr-1" />
                {isBangla ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes'}
              </Button>
            </div>
          </div>

          {/* Live Access Summary Bar */}
          <div className="px-4 py-2.5 bg-muted/40 border-b border-border flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground font-medium">{isBangla ? 'অ্যাক্সেস লেভেল' : 'Access Level'}:</span>
                {draftUser.isFullSystemAccess ? (
                  <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 text-[10px] font-bold">
                    <Crown className="w-3 h-3 mr-1" /> Full System Access
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] font-bold">
                    {draftUser.accessLevel.replace('_', ' ').toUpperCase()}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground font-medium">{isBangla ? 'শাখা সীমা' : 'Branches'}:</span>
                <span className="font-bold text-foreground">
                  {draftUser.branchScopeMode === 'all' || draftUser.isFullSystemAccess
                    ? `All (${HRM_BRANCHES.length})`
                    : `${draftUser.allowedBranchIds.length} of ${HRM_BRANCHES.length}`}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground font-medium">{isBangla ? 'অনুমতি সংখ্যা' : 'Permissions'}:</span>
                <span className="font-bold text-foreground">{draftEffectivePermissions.size} / {ALL_PERMISSION_IDS.length}</span>
              </div>

              {(draftUser.customGrantedPermissions.length > 0 || draftUser.customRevokedPermissions.length > 0) && (
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="text-emerald-500 font-bold">+{draftUser.customGrantedPermissions.length} Overrides</span>
                  {draftUser.customRevokedPermissions.length > 0 && (
                    <span className="text-rose-500 font-bold">-{draftUser.customRevokedPermissions.length} Revoked</span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
              <span>Last updated: {draftUser.updatedAt}</span>
              <span>by {draftUser.updatedBy}</span>
            </div>
          </div>

          {/* Modal Body: 3-Zone Workspace Layout */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* ── LEFT & CENTER: Configuration Settings (8 cols) ─────────── */}
            <div className="lg:col-span-8 space-y-6">
              {/* SECTION 1: Base Role & Full System Access Toggle */}
              <div className="p-4 rounded-2xl bg-card border border-border shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-primary" />
                    <h3 className="font-bold text-sm text-foreground">
                      {isBangla ? '১. প্রাথমিক ভূমিকা ও পূর্ণ অ্যাক্সেস মোড' : '1. Base Role & Full System Access'}
                    </h3>
                  </div>

                  {/* Full System Access Switch */}
                  <div className="flex items-center gap-2">
                    <Label htmlFor="full-access-toggle" className="text-xs font-bold text-foreground cursor-pointer">
                      {isBangla ? 'পূর্ণ সিস্টেম অ্যাক্সেস (Full Access)' : 'Full System Access'}
                    </Label>
                    <Switch
                      id="full-access-toggle"
                      checked={draftUser.isFullSystemAccess}
                      onCheckedChange={handleToggleFullSystemAccess}
                    />
                  </div>
                </div>

                {draftUser.isFullSystemAccess ? (
                  <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-700 dark:text-purple-300 flex items-start gap-2.5">
                    <Crown className="w-4 h-4 shrink-0 mt-0.5 text-purple-600" />
                    <div>
                      <p className="font-bold">{isBangla ? 'এই কর্মীকে পূর্ণ আনরেস্ট্রিক্টেড অ্যাক্সেস দেওয়া হয়েছে।' : 'Unrestricted Full Enterprise Access Active'}</p>
                      <p className="text-[11px] opacity-90 mt-0.5">
                        {isBangla
                          ? 'তিনি সকল শাখা, আর্থিক হিসাব, বেতন ও নিরাপত্তা সেটিংস দেখতে ও পরিবর্তন করতে পারবেন।'
                          : 'This employee has unrestricted visibility across all branches, financial balances, payroll, and configuration.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                        {isBangla ? 'বেস রোল টেমপ্লেট নির্বাচন করুন' : 'Select Base Role Template'}
                      </label>
                      <select
                        value={draftUser.baseRoleId}
                        onChange={(e) => handleBaseRoleChange(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs font-bold text-foreground cursor-pointer focus:outline-none"
                      >
                        {baseRoles.map((r) => (
                          <option key={r.id} value={r.id}>
                            {isBangla ? r.nameBn : r.name} ({r.permissionIds.length} Perms)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                        {isBangla ? 'ব্যবসায়িক ডেটা দৃশ্যমানতার সীমা (Data Scope)' : 'Business Data Scope'}
                      </label>
                      <select
                        value={draftUser.dataScope}
                        onChange={(e) => setDraftUser({ ...draftUser, dataScope: e.target.value as any })}
                        className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs font-medium text-foreground cursor-pointer focus:outline-none"
                      >
                        <option value="entire_business">{isBangla ? 'সমগ্র প্রতিষ্ঠান (Entire Business)' : 'Entire Business'}</option>
                        <option value="assigned_branches">{isBangla ? 'অনুমোদিত শাখাসমূহ (Assigned Branches)' : 'Assigned Branches Only'}</option>
                        <option value="own_department">{isBangla ? 'নিজ ডিপার্টমেন্ট (Own Department)' : 'Own Department Only'}</option>
                        <option value="own_records">{isBangla ? 'শুধুমাত্র নিজের তৈরি রেকর্ড (Own Records)' : 'Own Records & Assigned Parties'}</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 2: Branch Access Scope */}
              <div className="p-4 rounded-2xl bg-card border border-border shadow-xs space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-500" />
                    <div>
                      <h3 className="font-bold text-sm text-foreground">
                        {isBangla ? '২. শাখা প্রবেশাধিকার (Branch Access Scope)' : '2. Branch Access Scope'}
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        {isBangla
                          ? 'কর্মচারী শুধুমাত্র নির্বাচিত শাখার ডেটা ও লেনদেন পরিচালনা করতে পারবেন।'
                          : 'Employee will only be able to view and manage data belonging to selected branches.'}
                      </p>
                    </div>
                  </div>

                  {!draftUser.isFullSystemAccess && (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={draftUser.branchScopeMode === 'all' ? 'default' : 'outline'}
                        onClick={() => handleToggleAllBranches(true)}
                        className="h-7 text-[11px] rounded-lg cursor-pointer px-2.5 font-bold"
                      >
                        {isBangla ? 'সকল শাখা' : 'All Branches'}
                      </Button>
                      <Button
                        size="sm"
                        variant={draftUser.branchScopeMode === 'selected' ? 'default' : 'outline'}
                        onClick={() => handleToggleAllBranches(false)}
                        className="h-7 text-[11px] rounded-lg cursor-pointer px-2.5 font-bold"
                      >
                        {isBangla ? 'নির্দিষ্ট শাখা' : 'Selected Only'}
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                  {HRM_BRANCHES.map((branch) => {
                    const isAssigned = draftUser.branchScopeMode === 'all' || draftUser.isFullSystemAccess || draftUser.allowedBranchIds.includes(branch.id);
                    return (
                      <div
                        key={branch.id}
                        onClick={() => handleToggleBranch(branch.id)}
                        className={cn(
                          'p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer select-none',
                          isAssigned
                            ? 'bg-emerald-500/5 border-emerald-500/40 text-foreground shadow-xs'
                            : 'bg-muted/20 border-border text-muted-foreground opacity-70 hover:opacity-100'
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={cn(
                              'w-4 h-4 rounded-md border flex items-center justify-center transition-colors',
                              isAssigned ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-muted-foreground/40'
                            )}
                          >
                            {isAssigned && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="text-xs font-bold">{branch.name}</span>
                        </div>

                        {isAssigned && (
                          <Badge className="bg-emerald-500/10 text-emerald-600 text-[9px] px-1.5 py-0 border-emerald-500/20">
                            {isBangla ? 'অনুমোদিত' : 'Allowed'}
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 3: Granular Module Access & Quick Permission Levels */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <div>
                      <h3 className="font-bold text-sm text-foreground">
                        {isBangla ? '৩. মডিউল ও কাস্টম অ্যাকশন পারমিশন' : '3. Module Access & Action Permissions'}
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        {isBangla
                          ? 'মডিউল অনুযায়ী কুইক লেভেল নির্ধারণ করুন অথবা বিস্তারিত অ্যাকশন পারমিশন কাস্টমাইজ করুন।'
                          : 'Set quick access levels per module or customize granular action permissions.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      placeholder={isBangla ? 'পারমিশন বা মডিউল খুঁজুন...' : 'Search permissions...'}
                      value={permissionModuleSearch}
                      onChange={(e) => setPermissionModuleSearch(e.target.value)}
                      className="h-8 text-xs w-48 rounded-lg bg-background border-border"
                    />
                  </div>
                </div>

                {/* Expandable Module Cards */}
                <div className="space-y-3">
                  {ERP_MODULES.map((module) => {
                    const isExpanded = expandedModuleIds.includes(module.id);
                    const modulePermIds = module.permissions.map((p) => p.id);
                    const grantedCountInModule = modulePermIds.filter((pId) => draftEffectivePermissions.has(pId)).length;
                    const totalInModule = modulePermIds.length;

                    let currentLevel: PermissionLevelType = 'custom';
                    if (grantedCountInModule === 0) currentLevel = 'no_access';
                    else if (grantedCountInModule === totalInModule) currentLevel = 'full_access';
                    else if (
                      grantedCountInModule === module.standardPermissionIds.length &&
                      module.standardPermissionIds.every((id) => draftEffectivePermissions.has(id))
                    ) {
                      currentLevel = 'standard';
                    } else if (
                      grantedCountInModule === module.readOnlyPermissionIds.length &&
                      module.readOnlyPermissionIds.every((id) => draftEffectivePermissions.has(id))
                    ) {
                      currentLevel = 'read_only';
                    }

                    if (permissionModuleSearch) {
                      const q = permissionModuleSearch.toLowerCase();
                      const matchMod = module.name.toLowerCase().includes(q) || module.nameBn.includes(q);
                      const matchPerm = module.permissions.some((p) => p.name.toLowerCase().includes(q) || p.nameBn.includes(q));
                      if (!matchMod && !matchPerm) return null;
                    }

                    return (
                      <div
                        key={module.id}
                        className={cn(
                          'rounded-2xl border transition-all overflow-hidden bg-card',
                          grantedCountInModule > 0 ? 'border-border shadow-xs' : 'border-border/60 opacity-80'
                        )}
                      >
                        {/* Module Header Bar */}
                        <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/20">
                          <div
                            onClick={() => {
                              if (isExpanded) {
                                setExpandedModuleIds(expandedModuleIds.filter((id) => id !== module.id));
                              } else {
                                setExpandedModuleIds([...expandedModuleIds, module.id]);
                              }
                            }}
                            className="flex items-center gap-3 cursor-pointer select-none flex-1"
                          >
                            <div className="p-1 rounded-md text-muted-foreground hover:bg-muted">
                              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-foreground">
                                  {isBangla ? module.nameBn : module.name}
                                </span>
                                <Badge
                                  variant={grantedCountInModule === totalInModule ? 'default' : grantedCountInModule > 0 ? 'secondary' : 'outline'}
                                  className="text-[10px] py-0 px-1.5 font-bold"
                                >
                                  {grantedCountInModule} / {totalInModule} {isBangla ? 'অনুমতি' : 'granted'}
                                </Badge>
                              </div>
                              <p className="text-[11px] text-muted-foreground hidden sm:block">
                                {isBangla ? module.descriptionBn : module.description}
                              </p>
                            </div>
                          </div>

                          {/* Quick Level Selector Buttons */}
                          {!draftUser.isFullSystemAccess && (
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => handleModuleQuickLevelChange(module, 'no_access')}
                                className={cn(
                                  'px-2 py-1 rounded-md text-[10px] font-bold border transition-colors cursor-pointer',
                                  currentLevel === 'no_access'
                                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-600'
                                    : 'bg-background border-border text-muted-foreground hover:bg-muted'
                                )}
                              >
                                {isBangla ? 'নো অ্যাক্সেস' : 'None'}
                              </button>

                              <button
                                onClick={() => handleModuleQuickLevelChange(module, 'read_only')}
                                className={cn(
                                  'px-2 py-1 rounded-md text-[10px] font-bold border transition-colors cursor-pointer',
                                  currentLevel === 'read_only'
                                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-600'
                                    : 'bg-background border-border text-muted-foreground hover:bg-muted'
                                )}
                              >
                                {isBangla ? 'রিড অনলি' : 'Read Only'}
                              </button>

                              <button
                                onClick={() => handleModuleQuickLevelChange(module, 'standard')}
                                className={cn(
                                  'px-2 py-1 rounded-md text-[10px] font-bold border transition-colors cursor-pointer',
                                  currentLevel === 'standard'
                                    ? 'bg-primary/10 border-primary/30 text-primary'
                                    : 'bg-background border-border text-muted-foreground hover:bg-muted'
                                )}
                              >
                                {isBangla ? 'স্ট্যান্ডার্ড' : 'Standard'}
                              </button>

                              <button
                                onClick={() => handleModuleQuickLevelChange(module, 'full_access')}
                                className={cn(
                                  'px-2 py-1 rounded-md text-[10px] font-bold border transition-colors cursor-pointer',
                                  currentLevel === 'full_access'
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'
                                    : 'bg-background border-border text-muted-foreground hover:bg-muted'
                                )}
                              >
                                {isBangla ? 'ফুল' : 'Full'}
                              </button>

                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleResetModuleToRole(module)}
                                className="h-6 w-6 p-0 rounded text-muted-foreground hover:text-foreground cursor-pointer"
                                title={isBangla ? 'ভূমিকা অনুযায়ী রিসেট' : 'Reset to Role'}
                              >
                                <RotateCcw className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* Expanded Granular Permissions Grid */}
                        {isExpanded && (
                          <div className="p-3.5 bg-background border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {module.permissions.map((perm) => {
                              const isGranted = draftEffectivePermissions.has(perm.id);
                              const isCustomGranted = draftUser.customGrantedPermissions.includes(perm.id);
                              const isCustomRevoked = draftUser.customRevokedPermissions.includes(perm.id);
                              const isRoleInherited = activeRoleDefinition?.permissionIds.includes(perm.id);

                              return (
                                <div
                                  key={perm.id}
                                  onClick={() => handlePermissionToggle(perm.id)}
                                  className={cn(
                                    'p-2.5 rounded-xl border transition-all flex items-start justify-between gap-2 select-none cursor-pointer',
                                    isGranted
                                      ? 'bg-primary/5 border-primary/20 text-foreground'
                                      : 'bg-muted/10 border-border/60 text-muted-foreground hover:bg-muted/30'
                                  )}
                                >
                                  <div className="flex items-start gap-2.5">
                                    <div
                                      className={cn(
                                        'w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                                        isGranted ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/40'
                                      )}
                                    >
                                      {isGranted && <Check className="w-3 h-3 stroke-[3]" />}
                                    </div>

                                    <div>
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-bold text-foreground">
                                          {isBangla ? perm.nameBn : perm.name}
                                        </span>
                                        {perm.isSensitive && (
                                          <span title="Sensitive Action" className="text-rose-500 font-bold text-[10px] flex items-center gap-0.5">
                                            <Lock className="w-3 h-3" />
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-[10px] text-muted-foreground mt-0.5">
                                        {perm.description}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="shrink-0">
                                    {isCustomGranted && (
                                      <Badge className="bg-emerald-500/10 text-emerald-600 text-[8px] font-bold px-1 py-0 border-emerald-500/20">
                                        + Custom
                                      </Badge>
                                    )}
                                    {isCustomRevoked && (
                                      <Badge className="bg-rose-500/10 text-rose-600 text-[8px] font-bold px-1 py-0 border-rose-500/20">
                                        - Revoked
                                      </Badge>
                                    )}
                                    {!isCustomGranted && !isCustomRevoked && isRoleInherited && isGranted && (
                                      <span className="text-[9px] text-muted-foreground font-mono">
                                        [Role]
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── RIGHT PANEL: Real-time Effective Access Preview (4 cols) ── */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-4 rounded-2xl bg-card border border-border shadow-xs sticky top-2 space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <h4 className="font-extrabold text-xs tracking-wider uppercase text-foreground">
                      {isBangla ? 'কার্যকর প্রবেশাধিকার সারাংশ' : 'Effective Access Summary'}
                    </h4>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    Live Preview
                  </Badge>
                </div>

                {/* 1. Who is this employee? */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    {isBangla ? '১. কর্মী পরিচিতি' : '1. Who is this employee?'}
                  </span>
                  <p className="text-xs font-bold text-foreground">
                    {draftUser.name} — <span className="text-primary">{activeRoleDefinition?.name || 'Custom'}</span>
                  </p>
                </div>

                {/* 2. Where can they work? */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    {isBangla ? '২. কোন শাখায় কাজ করতে পারবেন?' : '2. Where can they work?'}
                  </span>
                  {draftUser.branchScopeMode === 'all' || draftUser.isFullSystemAccess ? (
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5" /> All Branches Across Business
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {draftUser.allowedBranchIds.map((bId) => (
                        <Badge key={bId} variant="secondary" className="text-[10px]">
                          {HRM_BRANCHES.find((b) => b.id === bId)?.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. What can they access? */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    {isBangla ? '৩. কোন কোন মডিউল সক্রিয়?' : '3. What can they access?'}
                  </span>
                  <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                    {ERP_MODULES.map((m) => {
                      const count = m.permissions.filter((p) => draftEffectivePermissions.has(p.id)).length;
                      if (count === 0) {
                        return (
                          <div key={m.id} className="flex items-center justify-between text-[11px] text-muted-foreground py-0.5">
                            <span className="line-through opacity-60">{m.name}</span>
                            <span className="text-[9px] text-rose-500 font-bold">Blocked</span>
                          </div>
                        );
                      }
                      return (
                        <div key={m.id} className="flex items-center justify-between text-[11px] py-0.5">
                          <span className="font-semibold text-foreground flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-500" />
                            {m.name}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground font-bold">
                            {count}/{m.permissions.length}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Sensitive Actions Safeguard */}
                <div className="pt-2 border-t border-border space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    {isBangla ? 'সংবেদনশীল পারমিশন চেক' : 'Sensitive Actions Enabled'}
                  </span>
                  {ALL_SENSITIVE_PERMISSION_IDS.filter((id) => draftEffectivePermissions.has(id)).length === 0 ? (
                    <p className="text-[11px] text-muted-foreground italic">
                      No high-risk sensitive permissions enabled.
                    </p>
                  ) : (
                    <div className="space-y-1">
                      {ALL_SENSITIVE_PERMISSION_IDS.filter((id) => draftEffectivePermissions.has(id)).map((sId) => (
                        <div key={sId} className="flex items-center gap-1 text-[10px] font-semibold text-rose-600 dark:text-rose-400">
                          <Lock className="w-2.5 h-2.5" />
                          <span>{PERMISSION_BY_ID_MAP.get(sId)?.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Safety Confirmation Dialogs */}
      <FullAccessWarningDialog
        open={isFullAccessWarningOpen}
        onOpenChange={setIsFullAccessWarningOpen}
        onConfirm={confirmGrantFullSystemAccess}
      />

      <DiffConfirmDialog
        open={isDiffConfirmOpen}
        onOpenChange={setIsDiffConfirmOpen}
        userName={draftUser.name}
        diff={permissionDiff}
        onConfirm={handleConfirmAndApply}
      />
    </>
  );
}
