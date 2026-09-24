// Hello Khata OS - Roles & Permissions Helper Utilities
// হ্যালো খাতা - রোল ও পারমিশন হেল্পার ও ইউটিলিটি

import React from 'react';
import {
  LayoutGrid,
  ShoppingCart,
  Truck,
  Package,
  Users,
  Landmark,
  Briefcase,
  FileSpreadsheet,
  FileText,
  Settings,
  Layers,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import type { UserAccessProfile, BaseRoleDefinition, ERPModuleDefinition, PermissionModuleItem } from './types';
import { ALL_PERMISSION_IDS } from './mock-data';

// ─── HELPER: Extract Permission IDs from a Role ───────────────────────────

export function getRolePermissionIds(role: any): string[] {
  if (!role) return [];
  if (role.permissions === '*' || role.permissions === 'all') {
    return ALL_PERMISSION_IDS;
  }
  if (Array.isArray(role.permissionIds)) {
    return role.permissionIds;
  }
  if (role.permissions && typeof role.permissions === 'object' && !Array.isArray(role.permissions)) {
    return Object.entries(role.permissions).flatMap(([mod, acts]) =>
      Array.isArray(acts) ? acts.map((act) => `${mod}_${act}`) : []
    );
  }
  if (Array.isArray(role.permissions)) {
    return role.permissions;
  }
  return [];
}

// ─── HELPER: Compute Effective Permissions for a User ────────────────────────

export function computeEffectivePermissions(
  user: UserAccessProfile,
  baseRoles: (BaseRoleDefinition | any)[]
): Set<string> {
  if (user.isFullSystemAccess || user.isOwner) {
    return new Set(ALL_PERMISSION_IDS);
  }

  const role = baseRoles.find((r) => r.id === user.baseRoleId);
  const basePermissions = new Set(getRolePermissionIds(role));

  // Apply custom granted overrides (+)
  user.customGrantedPermissions?.forEach((pId) => basePermissions.add(pId));

  // Apply custom revoked overrides (-)
  user.customRevokedPermissions?.forEach((pId) => basePermissions.delete(pId));

  return basePermissions;
}

// ─── HELPER: Get Module Icon ─────────────────────────────────────────────────

export function getModuleIcon(idOrCode: string) {
  const key = idOrCode.toLowerCase();
  switch (key) {
    case 'mod_dashboard':
    case 'dashboard':
      return React.createElement(LayoutGrid, { className: 'w-4 h-4 text-sky-400 shrink-0' });
    case 'mod_sales':
    case 'sales':
    case 'sales_pos':
      return React.createElement(ShoppingCart, { className: 'w-4 h-4 text-emerald-400 shrink-0' });
    case 'mod_purchases':
    case 'purchases':
      return React.createElement(Truck, { className: 'w-4 h-4 text-amber-400 shrink-0' });
    case 'mod_inventory':
    case 'inventory':
      return React.createElement(Package, { className: 'w-4 h-4 text-indigo-400 shrink-0' });
    case 'mod_parties':
    case 'parties':
      return React.createElement(Users, { className: 'w-4 h-4 text-blue-400 shrink-0' });
    case 'mod_expenses':
    case 'expenses':
      return React.createElement(TrendingDown, { className: 'w-4 h-4 text-rose-400 shrink-0' });
    case 'mod_incomes':
    case 'incomes':
      return React.createElement(TrendingUp, { className: 'w-4 h-4 text-emerald-400 shrink-0' });
    case 'mod_quotations':
    case 'quotations':
      return React.createElement(FileText, { className: 'w-4 h-4 text-teal-400 shrink-0' });
    case 'mod_reports':
    case 'reports':
      return React.createElement(FileSpreadsheet, { className: 'w-4 h-4 text-purple-400 shrink-0' });
    case 'mod_settings':
    case 'settings':
      return React.createElement(Settings, { className: 'w-4 h-4 text-slate-400 shrink-0' });
    case 'mod_staff':
    case 'staff':
    case 'mod_hrm':
    case 'hrm':
      return React.createElement(Briefcase, { className: 'w-4 h-4 text-pink-400 shrink-0' });
    case 'mod_finance':
    case 'finance':
      return React.createElement(Landmark, { className: 'w-4 h-4 text-cyan-400 shrink-0' });
    default:
      return React.createElement(Layers, { className: 'w-4 h-4 text-muted-foreground shrink-0' });
  }
}

// ─── HELPER: Action Metadata & Descriptions ─────────────────────────────────

export function getActionDetails(action: string, isBangla: boolean) {
  const act = action.toLowerCase();
  switch (act) {
    case 'view':
      return {
        label: isBangla ? 'দেখুন (View)' : 'View',
        description: isBangla ? 'তালিকা ও তথ্য দেখার অনুমতি' : 'View and inspect records',
        badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      };
    case 'create':
      return {
        label: isBangla ? 'তৈরি করুন (Create)' : 'Create',
        description: isBangla ? 'নতুন এন্ট্রি বা লেনদেন তৈরির অনুমতি' : 'Create new records & transactions',
        badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      };
    case 'edit':
      return {
        label: isBangla ? 'সম্পাদনা (Edit)' : 'Edit',
        description: isBangla ? 'বিদ্যমান তথ্য পরিবর্তনের অনুমতি' : 'Modify and update existing records',
        badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      };
    case 'delete':
      return {
        label: isBangla ? 'মুছে ফেলুন (Delete)' : 'Delete',
        description: isBangla ? 'রেকর্ড মুছে ফেলা বা বাতিলের অনুমতি' : 'Delete, void or remove records',
        badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      };
    default:
      return {
        label: isBangla ? action : action.charAt(0).toUpperCase() + action.slice(1),
        description: isBangla ? `${action} করার অনুমতি` : `Permission to ${action}`,
        badgeClass: 'bg-muted/40 text-muted-foreground border-border/50',
      };
  }
}

// ─── HELPER: Get Module Short Name ───────────────────────────────────────────

export function getModuleShortName(m: ERPModuleDefinition, isBangla: boolean): string {
  if (isBangla) {
    if (m.id === 'mod_dashboard') return 'ড্যাশবোর্ড';
    if (m.id === 'mod_sales') return 'বিক্রয়';
    if (m.id === 'mod_purchases') return 'ক্রয়';
    if (m.id === 'mod_inventory') return 'ইনভেন্টরি';
    if (m.id === 'mod_parties') return 'পার্টি';
    if (m.id === 'mod_finance') return 'হিসাববিজ্ঞান';
    if (m.id === 'mod_hrm') return 'এইচআরএম';
    if (m.id === 'mod_reports') return 'রিপোর্ট';
    if (m.id === 'mod_quotations') return 'কোটেশন';
    if (m.id === 'mod_settings') return 'সেটিংস';
    return m.nameBn;
  }
  if (m.id === 'mod_dashboard') return 'Dashboard';
  if (m.id === 'mod_sales') return 'Sales';
  if (m.id === 'mod_purchases') return 'Purchases';
  if (m.id === 'mod_inventory') return 'Inventory';
  if (m.id === 'mod_parties') return 'Parties';
  if (m.id === 'mod_finance') return 'Finance';
  if (m.id === 'mod_hrm') return 'HRM';
  if (m.id === 'mod_reports') return 'Reports';
  if (m.id === 'mod_quotations') return 'Quotations';
  if (m.id === 'mod_settings') return 'Settings';
  return m.name.split(' ')[0];
}

// ─── HELPER: Staff Initials ──────────────────────────────────────────────────

export function getStaffInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 1 && parts[0]) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}
