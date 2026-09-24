// Hello Khata OS - Roles & Permissions Types
// হ্যালো খাতা - রোল ও পারমিশন টাইপসমূহ

export type AccessLevelType = 'full_system' | 'branch_restricted' | 'custom_access' | 'restricted' | 'unassigned';
export type DataScopeType = 'entire_business' | 'assigned_branches' | 'own_department' | 'own_records';
export type PermissionLevelType = 'no_access' | 'read_only' | 'standard' | 'full_access' | 'custom';

export interface PermissionAction {
  id: string;
  code: string;
  name: string;
  nameBn: string;
  description: string;
  category: string; // 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'export' | 'special'
  isSensitive?: boolean;
  dependsOn?: string[]; // IDs of permissions required for this to work
}

export interface PermissionModuleItem {
  module: string;
  label: string;
  labelBn: string;
  actions: string[];
}

export interface ERPModuleDefinition {
  id: string;
  code: string;
  name: string;
  nameBn: string;
  description: string;
  descriptionBn: string;
  iconName: string;
  permissions: PermissionAction[];
  standardPermissionIds: string[];
  readOnlyPermissionIds: string[];
}

export interface UserAccessProfile {
  id: string;
  userId: string;
  employeeId: string;
  name: string;
  nameBn: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  avatarUrl?: string;
  status: 'active' | 'inactive';
  isOwner?: boolean;
  isFullSystemAccess: boolean;
  baseRoleId: string;
  accessLevel: AccessLevelType;
  branchScopeMode: 'all' | 'selected';
  allowedBranchIds: string[];
  dataScope: DataScopeType;
  customGrantedPermissions: string[]; // Overrides: user has these even if role doesn't
  customRevokedPermissions: string[]; // Overrides: user does NOT have these even if role does
  lastActive?: string;
  updatedAt: string;
  updatedBy: string;
}

export interface BaseRoleDefinition {
  id?: string;
  name: string;
  nameBn: string;
  description: string;
  descriptionBn: string;
  isSystemProtected: boolean;
  color: string;
  defaultDataScope: DataScopeType;
  defaultBranchMode: 'all' | 'selected';
  permissionIds: string[];
}

export interface AccessAuditEntry {
  id: string;
  timestamp: string;
  performedBy: string;
  targetUserName: string;
  targetUserRole: string;
  actionType: 'permission_override' | 'role_changed' | 'branch_scope_updated' | 'full_access_granted' | 'full_access_revoked' | 'user_created' | 'status_changed';
  addedPermissions: string[];
  removedPermissions: string[];
  branchChanges?: { added: string[]; removed: string[] };
  notes: string;
}

export interface PermissionDiff {
  added: PermissionAction[];
  removed: PermissionAction[];
  branchAdded: string[];
  branchRemoved: string[];
  sensitiveGranted: PermissionAction[];
}
