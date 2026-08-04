import { RoleCode } from './role';

export type PermissionValue = 'none' | 'view' | 'edit';

export type ModuleCategory =
  | 'All'
  | 'Sales'
  | 'Inventory'
  | 'Purchase'
  | 'Finance'
  | 'HR'
  | 'Reports'
  | 'Settings';

export type ModuleKey =
  | 'dashboard'
  | 'sales'
  | 'pos'
  | 'customers'
  | 'products'
  | 'inventory'
  | 'purchase'
  | 'suppliers'
  | 'accounting'
  | 'finance'
  | 'hr'
  | 'payroll'
  | 'attendance'
  | 'leave'
  | 'reports'
  | 'settings';

export interface PermissionRow {
  id: string; // e.g. "sales-invoices"
  moduleKey: ModuleKey;
  moduleName: string;
  category: ModuleCategory;
  feature: string;
  description: string;
  rolePermissions: Record<RoleCode, PermissionValue>;
}

export type MatrixPermissionsState = Record<string, Record<RoleCode, PermissionValue>>;

export interface PermissionsSummary {
  totalRoles: number;
  protectedRoles: number;
  permissionAreas: number;
  lastUpdated: string;
}
