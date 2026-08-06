import { RoleCode } from './role';

export type PermissionValue = 'none' | 'view' | 'edit'; // Legacy
export type ActionType = 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'export' | 'print' | 'import';

export type ModuleCategory =
  | 'All'
  | 'Dashboard'
  | 'POS'
  | 'Inventory'
  | 'Purchase'
  | 'Sales'
  | 'Customer'
  | 'Supplier'
  | 'Accounting'
  | 'Warehouse'
  | 'HR'
  | 'Reports'
  | 'AI'
  | 'Settings'
  | 'E-commerce';

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
  | 'warehouse'
  | 'finance'
  | 'hr'
  | 'payroll'
  | 'attendance'
  | 'leave'
  | 'reports'
  | 'ai'
  | 'settings'
  | 'ecommerce';

export interface PermissionRow {
  id: string; // e.g. "sales-invoices"
  moduleKey: ModuleKey;
  moduleName: string;
  category: ModuleCategory;
  feature: string;
  description: string;
  availableActions?: ActionType[];
  rolePermissions: Record<string, PermissionValue>; // Legacy matrix
  roleGranularPermissions?: Record<string, ActionType[]>; // New granular system: RoleCode -> Allowed Actions
}

export type MatrixPermissionsState = Record<string, Record<string, PermissionValue>>;
export type GranularPermissionsState = Record<string, Record<string, ActionType[]>>;

export interface PermissionsSummary {
  totalRoles: number;
  protectedRoles: number;
  permissionAreas: number;
  lastUpdated: string;
}
