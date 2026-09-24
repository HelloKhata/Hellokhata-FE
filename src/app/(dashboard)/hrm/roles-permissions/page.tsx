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
import { toast } from 'sonner';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import {
  type BaseRoleDefinition,
  type UserAccessProfile,
  type AccessAuditEntry,
  INITIAL_BASE_ROLES,
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

export default function UserAccessControlPage() {
  const { isBangla } = useAppTranslation();

  // Core State Collections
  const [users, setUsers] = useState<UserAccessProfile[]>(INITIAL_USER_PROFILES);
  const [baseRoles, setBaseRoles] = useState<BaseRoleDefinition[]>(INITIAL_BASE_ROLES);
  const [auditLogs, setAuditLogs] = useState<AccessAuditEntry[]>(INITIAL_AUDIT_LOGS);

  // Table Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [roleTypeFilter, setRoleTypeFilter] = useState<'all' | 'system' | 'custom'>('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal States
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<BaseRoleDefinition | null>(null);
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [viewStaffRole, setViewStaffRole] = useState<BaseRoleDefinition | null>(null);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [activeUser, setActiveUser] = useState<UserAccessProfile | null>(null);
  const [isManageAccessOpen, setIsManageAccessOpen] = useState(false);
  const [previewingUser, setPreviewingUser] = useState<UserAccessProfile | null>(null);
  const [isQuickPreviewOpen, setIsQuickPreviewOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // Filtered Roles
  const filteredRoles = useMemo(() => {
    return baseRoles.filter((r) => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.nameBn.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.descriptionBn.toLowerCase().includes(q);

      const matchType =
        roleTypeFilter === 'all' ||
        (roleTypeFilter === 'system' && r.isSystemProtected) ||
        (roleTypeFilter === 'custom' && !r.isSystemProtected);

      const matchStatus = statusFilter === 'all' || statusFilter === 'active';

      return matchQuery && matchType && matchStatus;
    });
  }, [baseRoles, searchQuery, roleTypeFilter, statusFilter]);


  const handleRoleSaved = (updatedRole: BaseRoleDefinition) => {
    setBaseRoles((prev) =>
      prev.map((r) => (r.id === updatedRole.id ? updatedRole : r))
    );
  };

  const handleDeleteRole = (role: BaseRoleDefinition) => {
    if (role.isSystemProtected) {
      toast.error(
        isBangla ? 'সিস্টেম রোল মুছে ফেলা সম্ভব নয়!' : 'System-protected roles cannot be deleted!'
      );
      return;
    }
    const hasAssignedStaff = users.some((u) => u.baseRoleId === role.id);
    if (hasAssignedStaff) {
      toast.error(
        isBangla
          ? 'এই রোলে কর্মী নিযুক্ত রয়েছে। আগে কর্মীদের ভূমিকা পরিবর্তন করুন।'
          : 'Staff members are assigned to this role. Please reassign them first.'
      );
      return;
    }
    setBaseRoles((prev) => prev.filter((r) => r.id !== role.id));
    toast.success(isBangla ? `রোল "${role.name}" মুছে ফেলা হয়েছে!` : `Role "${role.name}" deleted!`);
  };

  const handleViewStaff = (role: BaseRoleDefinition) => {
    setViewStaffRole(role);
    setIsStaffModalOpen(true);
  };

  const handleEditRole = (role: BaseRoleDefinition) => {
    setEditingRole(role);
    setIsEditRoleModalOpen(true);
  };

  const handleSaveUserAccess = (updatedUser: UserAccessProfile, auditEntry: AccessAuditEntry) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setAuditLogs((prev) => [auditEntry, ...prev]);
  };

  const handleUserCreated = (createdUser: UserAccessProfile) => {
    setUsers((prev) => [createdUser, ...prev]);
    const roleName = baseRoles.find((r) => r.id === createdUser.baseRoleId)?.name || 'Staff';
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
                {filteredRoles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-muted-foreground">
                      <Shield className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p className="font-semibold text-sm">
                        {isBangla ? 'কোনো রোল পাওয়া যায়নি' : 'No roles found matching filter criteria'}
                      </p>
                      <p className="text-xs mt-1">
                        {isBangla ? 'অনুগ্রহ করে ফিল্টার বা সার্চ পরিবর্তন করুন।' : 'Try resetting your search query or filters.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredRoles.map((role) => {
                    const assignedUsers = users.filter((u) => u.baseRoleId === role.id);
                    const coveredModules = ERP_MODULES.filter((m) =>
                      m.permissions.some((p) => role.permissionIds.includes(p.id))
                    );

                    return (
                      <tr key={role.id} className="hover:bg-muted/20 transition-colors">
                        {/* 1. ROLE NAME */}
                        <td className="py-4 px-4 align-middle">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-xs"
                              style={{ backgroundColor: role.color }}
                            >
                              <Crown className="w-4 h-4 text-white" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-foreground">
                                  {isBangla ? role.nameBn || role.name : role.name}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5 truncate">
                                {isBangla ? role.descriptionBn || role.description : role.description}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* 2. MODULES & PERMISSIONS */}
                        <td className="py-4 px-4 align-middle">
                          <div className="flex flex-col gap-1.5">
                            <div className="font-bold text-xs text-foreground flex items-center gap-1.5">
                              <span>
                                {coveredModules.length} / {ERP_MODULES.length} {isBangla ? 'মডিউল' : 'Modules'}
                              </span>
                              <span className="text-muted-foreground/60 font-normal">•</span>
                              <span>
                                {role.permissionIds.length} {isBangla ? 'অনুমতি' : 'Permissions'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {coveredModules.slice(0, 3).map((m) => (
                                <span
                                  key={m.id}
                                  className="inline-flex items-center gap-1 px-1 py-1 rounded-md text-[11px] font-medium bg-muted/40 text-foreground/85 border border-border/50"
                                >
                                  {getModuleIcon(m.id)}
                                  <span>{getModuleShortName(m, isBangla)}</span>
                                </span>
                              ))}
                              {coveredModules.length > 3 && (
                                <span className="inline-flex items-center justify-center py-0.5 rounded-md text-[10px] leading-tight font-medium bg-muted/40 text-muted-foreground border border-border/50">
                                  <span>+{coveredModules.length - 3} {isBangla ? 'আরো' : 'More'}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* 3. STATUS */}
                        <td className="py-4 px-4 align-middle">
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                              <span
                                className={cn(
                                  'w-2 h-2 rounded-full shrink-0',
                                  role.isSystemProtected ? 'bg-purple-500' : 'bg-emerald-500'
                                )}
                              />
                              <span>
                                {isBangla
                                  ? role.isSystemProtected
                                    ? 'Active (Protected)'
                                    : 'Active (Custom)'
                                  : role.isSystemProtected
                                  ? 'Active (Protected)'
                                  : 'Active (Custom)'}
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
                              {assignedUsers.length} {isBangla ? 'কর্মী' : 'staff'}
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
        baseRoles={baseRoles}
        onSaveUser={handleSaveUserAccess}
      />

      <QuickPreviewDialog
        open={isQuickPreviewOpen}
        onOpenChange={setIsQuickPreviewOpen}
        user={previewingUser}
        baseRoles={baseRoles}
        onOpenFullEditor={handleOpenFullEditorFromPreview}
      />

      <AddUserModal
        open={isAddUserModalOpen}
        onOpenChange={setIsAddUserModalOpen}
        baseRoles={baseRoles}
        onUserCreated={handleUserCreated}
      />
    </div>
  );
}
