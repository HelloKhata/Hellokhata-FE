export type RoleCode = 'owner' | 'branch_manager' | 'accountant' | 'cashier' | 'staff' | string;

export type AccessScope = 'entire_company' | 'selected_branches' | 'own_branch_only' | 'selected_warehouses' | 'own_records_only';

export interface BusinessLimits {
  maxDiscountPercentage?: number;
  maxRefundAmount?: number;
  maxCreditSale?: number;
  maxExpenseApproval?: number;
  maxPriceOverride?: number;
  cashDrawerLimit?: number;
}

export interface Restrictions {
  allowLogin: 'always' | 'business_hours' | 'custom_hours';
  allowedDevice: 'any' | 'desktop_only' | 'pos_terminal' | 'registered_device';
}

export interface Role {
  id: string;
  code: RoleCode;
  name: string;
  nameBn?: string;
  description: string;
  descriptionBn?: string;
  isProtected: boolean;
  isSystem: boolean;
  employeeCount: number;
  updatedAt: string;
  scope?: AccessScope;
  selectedBranchIds?: string[];
  selectedWarehouseIds?: string[];
  limits?: BusinessLimits;
  restrictions?: Restrictions;
  dataVisibility?: 'all' | 'assigned_branch' | 'own_transactions' | 'assigned_customers' | 'assigned_orders';
}
