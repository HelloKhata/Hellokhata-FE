// Hello Khata OS - HRM Roles & Permissions Page
// হ্যালো খাতা - এইচআরএম রোল ও পারমিশন পেজ

'use client';

import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Plus,
  UserPlus,
  Crown,
  Search,
  RotateCcw,
  Shield,
  Eye,
  Edit2,
  Trash2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import {
  type BaseRoleDefinition,
  type UserAccessProfile,
  type AccessAuditEntry,
  INITIAL_USER_PROFILES,
  INITIAL_AUDIT_LOGS,
  ERP_MODULES,
  getModuleIcon,
  getModuleShortName,
  CreateRoleModal,
  EditRoleModal,
  ViewStaffModal,
  ManageUserAccessModal,
  QuickPreviewDialog,
  AddUserModal,
} from '@/components/hrm/roles-permissions';
import { useGetRoles, useDeleteRole } from '@/hooks/api/useRoles';

const getRoleBadgeColor = (color?: string | null) => {
  if (!color) return '#6366f1';
  const c = color.toLowerCase();
  if (c === 'gray' || c === 'grey') return '#64748b';
  if (c === 'purple') return '#8b5cf6';
  if (c === 'blue') return '#3b82f6';
  if (c === 'indigo') return '#6366f1';
  if (c === 'emerald' || c === 'green') return '#10b981';
  if (c === 'amber' || c === 'orange') return '#f59e0b';
  if (c === 'rose' || c === 'red') return '#f43f5e';
  return color;
};

export default function UserAccessControlPage() {
  const { isBangla } = useAppTranslation();

  // Core State Collections
  const [users, setUsers] = useState<UserAccessProfile[]>(INITIAL_USER_PROFILES);
  const [auditLogs, setAuditLogs] = useState<AccessAuditEntry[]>(INITIAL_AUDIT_LOGS);

  // Table Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [roleTypeFilter, setRoleTypeFilter] = useState<'all' | 'system' | 'custom'>('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal States
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [viewStaffRole, setViewStaffRole] = useState<any>(null);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [activeUser, setActiveUser] = useState<UserAccessProfile | null>(null);
  const [isManageAccessOpen, setIsManageAccessOpen] = useState(false);
  const [previewingUser, setPreviewingUser] = useState<UserAccessProfile | null>(null);
  const [isQuickPreviewOpen, setIsQuickPreviewOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // Delete Confirmation State
  const [roleToDelete, setRoleToDelete] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // get all roles from API
  const { data: allRoles, isLoading: isLoadingRoles, refetch: refetchRoles } = useGetRoles();
  const deleteRoleMutation = useDeleteRole();

 
  const handleRoleSaved = () => {
    refetchRoles();
  };

  const handleDeleteRole = (role: any) => {
    if (role.isSystem || role.isDefault || role.name?.toLowerCase() === 'owner') {
      toast.error(
        isBangla ? 'সিস্টেম রোল মুছে ফেলা সম্ভব নয়!' : 'System-protected roles cannot be deleted!'
      );
      return;
    }
    const hasAssignedStaff = (role.userCount ?? 0) > 0 || users.some((u) => u.baseRoleId === role.id);
    if (hasAssignedStaff) {
      toast.error(
        isBangla
          ? 'এই রোলে কর্মী নিযুক্ত রয়েছে। আগে কর্মীদের ভূমিকা পরিবর্তন করুন।'
          : 'Staff members are assigned to this role. Please reassign them first.'
      );
      return;
    }

    setRoleToDelete(role);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!roleToDelete) return;

    deleteRoleMutation.mutate(roleToDelete.id, {
      onSuccess: () => {
        toast.success(
          isBangla
            ? `রোল "${roleToDelete.nameBn || roleToDelete.name}" মুছে ফেলা হয়েছে!`
            : `Role "${roleToDelete.name}" deleted!`
        );
        setIsDeleteDialogOpen(false);
        setRoleToDelete(null);
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.message ||
            (isBangla ? 'রোল মুছতে ব্যর্থ হয়েছে' : 'Failed to delete role')
        );
      },
    });
  };

  const handleViewStaff = (role: any) => {
    setViewStaffRole(role);
    setIsStaffModalOpen(true);
  };

  const handleEditRole = (role: any) => {
    setEditingRole(role);
    setIsEditRoleModalOpen(true);
  };

  const handleSaveUserAccess = (updatedUser: UserAccessProfile, auditEntry: AccessAuditEntry) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setAuditLogs((prev) => [auditEntry, ...prev]);
  };

  const handleUserCreated = (createdUser: UserAccessProfile) => {
    setUsers((prev) => [createdUser, ...prev]);
    const roleName = allRoles.find((r: any) => r.id === createdUser.baseRoleId)?.name || 'Staff';
    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp: 'Just now',
        performedBy: 'Sweet Ali (Owner)',
        targetUserName: createdUser.name,
        targetUserRole: roleName,
        actionType: 'user_created',
        addedPermissions: [`Initial assignment with role ${roleName}`],
        removedPermissions: [],
        notes: `New staff member onboarded and assigned access to ${createdUser.allowedBranchIds.length} branch(es).`,
      },
      ...prev,
    ]);
  };

  const handleOpenFullEditorFromPreview = (user: UserAccessProfile) => {
    setActiveUser(user);
    setIsManageAccessOpen(true);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* ─── Top Header & Primary Navigation ──────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-primary" />
            <span>{isBangla ? 'রোল ও পারমিশন' : 'Roles & Permissions'}</span>
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {isBangla
              ? 'ব্যবসার ধরন অনুযায়ী রোলে অনুমতি কাস্টমাইজ করুন এবং নির্দিষ্ট ব্যবহারকারীদের জন্য ডেটা অ্যাক্সেস নিয়ন্ত্রণ করুন।'
              : 'Customize roles with business-specific permissions and control data access for individual users.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            onClick={() => setIsAddUserModalOpen(true)}
            variant="outline"
            className="rounded-xl border-border text-foreground hover:bg-muted text-xs font-bold h-10 shadow-xs cursor-pointer"
          >
            <UserPlus className="w-4 h-4 mr-1.5 text-primary" />
            {isBangla ? 'কর্মী যোগ ও অ্যাক্সেস' : 'Add User Access'}
          </Button>

          <Button
            onClick={() => setIsCreateRoleModalOpen(true)}
            className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold h-10 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            {isBangla ? 'নতুন রোল যোগ' : 'Add Role'}
          </Button>
        </div>
      </div>

      {/* ─── ROLES & PERMISSIONS TABLE & TOOLBAR ────────────────────────────── */}
      <div className="space-y-4 pt-1">
        {/* Search & Filter Toolbar */}
        <div className="p-3.5 rounded-2xl bg-card border border-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={
                isBangla
                  ? 'রোলের নাম বা বিবরণ দিয়ে খুঁজুন...'
                  : 'Search roles by name or description...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 rounded-xl text-xs bg-background border-border"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Role Type Filter */}
            <select
              value={roleTypeFilter}
              onChange={(e) => setRoleTypeFilter(e.target.value as 'all' | 'system' | 'custom')}
              className="h-10 px-3 rounded-xl border border-border bg-background text-xs font-medium text-foreground cursor-pointer focus:outline-none"
            >
              <option value="all">{isBangla ? 'সকল ভূমিকা (All Roles)' : 'All Roles'}</option>
              <option value="system">{isBangla ? 'সিস্টেম রোল (System Roles)' : 'System Roles'}</option>
              <option value="custom">{isBangla ? 'কাস্টম রোল (Custom Roles)' : 'Custom Roles'}</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 rounded-xl border border-border bg-background text-xs font-medium text-foreground cursor-pointer focus:outline-none"
            >
              <option value="all">{isBangla ? 'সকল স্ট্যাটাস (All Status)' : 'All Status'}</option>
              <option value="active">{isBangla ? 'সক্রিয় (Active)' : 'Active'}</option>
              <option value="inactive">{isBangla ? 'নিষ্ক্রিয় (Inactive)' : 'Inactive'}</option>
            </select>

            {(searchQuery || roleTypeFilter !== 'all' || statusFilter !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setRoleTypeFilter('all');
                  setStatusFilter('all');
                }}
                className="text-xs text-muted-foreground hover:text-foreground h-10 px-2.5 rounded-xl cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                {isBangla ? 'রিসেট' : 'Reset'}
              </Button>
            )}
          </div>
        </div>

        {/* Roles Table */}
        <div className="rounded-2xl bg-card border border-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b border-border text-muted-foreground font-semibold tracking-wider uppercase text-[11px]">
                  <th className="py-3.5 px-4 font-semibold text-muted-foreground">{isBangla ? 'রোলের নাম' : 'ROLE NAME'}</th>
                  <th className="py-3.5 px-4 font-semibold text-muted-foreground">{isBangla ? 'মডিউল ও পারমিশন' : 'MODULES & PERMISSIONS'}</th>
                  <th className="py-3.5 px-4 font-semibold text-muted-foreground">{isBangla ? 'স্ট্যাটাস' : 'STATUS'}</th>
                  <th className="py-3.5 px-4 font-semibold text-muted-foreground">{isBangla ? 'নিয়োজিত কর্মী' : 'ASSIGNED USERS'}</th>
                  <th className="py-3.5 px-4 font-semibold text-muted-foreground text-right">{isBangla ? 'অ্যাকশন' : 'ACTIONS'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {isLoadingRoles ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                        <p className="text-xs font-medium">
                          {isBangla ? 'রোল লোড হচ্ছে...' : 'Loading roles from server...'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : allRoles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-muted-foreground">
                      <Shield className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p className="font-semibold text-sm">
                        {isBangla ? 'কোনো রোল পাওয়া যায়নি' : 'No roles found'}
                      </p>
                      <p className="text-xs mt-1">
                        {isBangla ? 'অনুগ্রহ করে ফিল্টার বা সার্চ পরিবর্তন করুন।' : 'Try resetting your search query or filters.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  allRoles.map((role: any) => {
                    const assignedUsersCount = typeof role.userCount === 'number'
                      ? role.userCount
                      : users.filter((u) => u.baseRoleId === role.id).length;

                    const isFullAccess = role.permissions === '*' || role.permissions === 'all';

                    return (
                      <tr key={role.id} className="hover:bg-muted/20 transition-colors">
                        {/* 1. ROLE NAME */}
                        <td className="py-4 px-4 align-middle">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-xs"
                              style={{ backgroundColor: getRoleBadgeColor(role.color) }}
                            >
                              {role.isSystem || role.isDefault || role.name?.toLowerCase() === 'owner' ? (
                                <Crown className="w-4 h-4 text-white" />
                              ) : (
                                <Shield className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-sm text-foreground capitalize">
                                  {isBangla ? role.nameBn || role.name : role.name}
                                </span>
                                {role.isSystem && (
                                  <Badge variant="outline" className="text-[10px] bg-purple-500/10 text-purple-400 border-purple-500/20 font-semibold py-0 px-1.5">
                                    {isBangla ? 'সিস্টেম' : 'System'}
                                  </Badge>
                                )}
                                {role.isDefault && (
                                  <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-400 border-blue-500/20 font-semibold py-0 px-1.5">
                                    {isBangla ? 'ডিফল্ট' : 'Default'}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5 truncate">
                                {isBangla
                                  ? role.nameBn || role.description || (isBangla ? 'কোনো বিবরণ নেই' : 'No description')
                                  : role.description || (isBangla ? 'কোনো বিবরণ নেই' : 'No description')}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* 2. MODULES & PERMISSIONS */}
                        <td className="py-4 px-4 align-middle">
                          {isFullAccess ? (
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1.5">
                                <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20 font-bold text-[11px] py-0.5 px-2">
                                  <Crown className="w-3 h-3 mr-1" />
                                  {isBangla ? 'পূর্ণ নিয়ন্ত্রণ' : 'Full Access'}
                                </Badge>
                              </div>
                              <span className="text-[11px] text-muted-foreground">
                                {isBangla ? 'সকল মডিউল ও পারমিশন অন্তর্ভুক্ত' : 'All modules & permissions included'}
                              </span>
                            </div>
                          ) : (
                            (() => {
                              const rolePerms = typeof role.permissions === 'object' && role.permissions && !Array.isArray(role.permissions)
                                ? role.permissions
                                : null;

                              const moduleEntries = rolePerms
                                ? Object.entries(rolePerms).filter(([, acts]) => Array.isArray(acts) && (acts as any[]).length > 0)
                                : [];

                              const coveredModules = ERP_MODULES.filter((m) =>
                                m.permissions.some((p) => Array.isArray(role.permissionIds) && role.permissionIds.includes(p.id))
                              );

                              const modulesCount = moduleEntries.length > 0 ? moduleEntries.length : coveredModules.length;
                              const totalPermsCount = moduleEntries.length > 0
                                ? moduleEntries.reduce((sum, [, acts]) => sum + (acts as any[]).length, 0)
                                : Array.isArray(role.permissionIds) ? role.permissionIds.length : 0;

                              if (modulesCount === 0) {
                                return (
                                  <span className="text-xs text-muted-foreground italic">
                                    {isBangla ? 'কোনো পারমিশন নেই' : 'No permissions'}
                                  </span>
                                );
                              }

                              return (
                                <div className="flex flex-col gap-1.5">
                                  <div className="font-bold text-xs text-foreground flex items-center gap-1.5">
                                    <span>
                                      {modulesCount} {isBangla ? 'মডিউল' : 'Modules'}
                                    </span>
                                    <span className="text-muted-foreground/60 font-normal">•</span>
                                    <span>
                                      {totalPermsCount} {isBangla ? 'অনুমতি' : 'Permissions'}
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    {moduleEntries.length > 0
                                      ? moduleEntries.slice(0, 3).map(([modName, acts]) => (
                                          <span
                                            key={modName}
                                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] font-medium bg-muted/40 text-foreground/85 border border-border/50"
                                          >
                                            {getModuleIcon(modName)}
                                            <span className="capitalize">{modName}</span>
                                            <span className="text-[10px] text-muted-foreground font-mono">
                                              ({(acts as any[]).length})
                                            </span>
                                          </span>
                                        ))
                                      : coveredModules.slice(0, 3).map((m) => (
                                          <span
                                            key={m.id}
                                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] font-medium bg-muted/40 text-foreground/85 border border-border/50"
                                          >
                                            {getModuleIcon(m.id)}
                                            <span>{getModuleShortName(m, isBangla)}</span>
                                          </span>
                                        ))}
                                    {modulesCount > 3 && (
                                      <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-muted/40 text-muted-foreground border border-border/50">
                                        +{modulesCount - 3} {isBangla ? 'আরো' : 'More'}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })()
                          )}
                        </td>

                        {/* 3. STATUS */}
                        <td className="py-4 px-4 align-middle">
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                              <span
                                className={cn(
                                  'w-2 h-2 rounded-full shrink-0',
                                  role.deletedAt
                                    ? 'bg-rose-500'
                                    : role.isSystem || role.isDefault
                                    ? 'bg-purple-500'
                                    : 'bg-emerald-500'
                                )}
                              />
                              <span>
                                {role.deletedAt
                                  ? (isBangla ? 'নিষ্ক্রিয় (Inactive)' : 'Inactive')
                                  : role.isSystem || role.isDefault
                                  ? (isBangla ? 'সক্রিয় (সুরক্ষিত)' : 'Active (System)')
                                  : (isBangla ? 'সক্রিয় (কাস্টম)' : 'Active (Custom)')}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 4. ASSIGNED USERS */}
                        <td className="py-4 px-4 align-middle">
                          <button
                            type="button"
                            onClick={() => handleViewStaff(role)}
                            className="flex items-center gap-1.5 cursor-pointer text-left group hover:opacity-85 transition-opacity"
                            title={isBangla ? 'নিয়োজিত কর্মী তালিকা দেখুন' : 'View assigned staff'}
                          >
                            <span className="font-bold text-xs text-foreground group-hover:text-primary transition-colors underline decoration-dotted underline-offset-4">
                              {assignedUsersCount} {isBangla ? 'কর্মী' : 'staff'}
                            </span>
                          </button>
                        </td>

                        {/* 5. ACTIONS */}
                        <td className="py-4 px-4 align-middle text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewStaff(role)}
                              className="h-8 px-3 rounded-full border-border/80 hover:border-border bg-background/50 hover:bg-muted/50 text-xs font-medium text-foreground flex items-center gap-1.5 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-sky-400" />
                              <span>{isBangla ? 'View' : 'View'}</span>
                            </Button>

                            <Button
                              size="sm"
                              onClick={() => handleEditRole(role)}
                              className="h-8 px-3.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-white" />
                              <span>{isBangla ? 'Edit' : 'Edit'}</span>
                            </Button>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteRole(role)}
                              disabled={deleteRoleMutation.isPending}
                              className="h-8 w-8 p-0 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                              title={isBangla ? 'মুছে ফেলুন' : 'Delete Role'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ─── MODAL DIALOGS ─────────────────────────────────────────────────── */}
      <CreateRoleModal
        open={isCreateRoleModalOpen}
        onOpenChange={setIsCreateRoleModalOpen}
      />

      <EditRoleModal
        open={isEditRoleModalOpen}
        onOpenChange={setIsEditRoleModalOpen}
        role={editingRole}
        onRoleSaved={handleRoleSaved}
      />

      <ViewStaffModal
        open={isStaffModalOpen}
        onOpenChange={setIsStaffModalOpen}
        role={viewStaffRole}
        users={users}
        onManageAccess={(u) => {
          setActiveUser(u);
          setIsManageAccessOpen(true);
        }}
        onQuickPreview={(u) => {
          setPreviewingUser(u);
          setIsQuickPreviewOpen(true);
        }}
      />

      <ManageUserAccessModal
        open={isManageAccessOpen}
        onOpenChange={setIsManageAccessOpen}
        user={activeUser}
        baseRoles={allRoles}
        onSaveUser={handleSaveUserAccess}
      />

      <QuickPreviewDialog
        open={isQuickPreviewOpen}
        onOpenChange={setIsQuickPreviewOpen}
        user={previewingUser}
        baseRoles={allRoles}
        onOpenFullEditor={handleOpenFullEditorFromPreview}
      />

      <AddUserModal
        open={isAddUserModalOpen}
        onOpenChange={setIsAddUserModalOpen}
        baseRoles={allRoles}
        onUserCreated={handleUserCreated}
      />

      {/* ─── DELETE ROLE CONFIRMATION DIALOG ──────────────────────────────── */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) setRoleToDelete(null);
        }}
      >
        <AlertDialogContent className="rounded-2xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              <span>{isBangla ? 'রোল মুছে ফেলতে নিশ্চিত?' : 'Delete Role Confirmation'}</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground pt-1">
              {isBangla
                ? `আপনি কি নিশ্চিত যে "${roleToDelete?.nameBn || roleToDelete?.name}" রোলটি মুছে ফেলতে চান? এটি মুছে ফেললে আর পুনরুদ্ধার করা যাবে না।`
                : `Are you sure you want to delete the role "${roleToDelete?.name}"? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0 mt-2">
            <AlertDialogCancel className="rounded-xl text-xs font-semibold cursor-pointer">
              {isBangla ? 'বাতিল' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteRoleMutation.isPending}
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs font-semibold cursor-pointer"
            >
              {deleteRoleMutation.isPending
                ? (isBangla ? 'মুছে ফেলা হচ্ছে...' : 'Deleting...')
                : (isBangla ? 'হ্যাঁ, মুছে ফেলুন' : 'Yes, Delete Role')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
