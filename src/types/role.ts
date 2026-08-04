export type RoleCode = 'owner' | 'branch_manager' | 'accountant' | 'cashier' | 'staff';

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
}
