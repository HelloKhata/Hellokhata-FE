import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  PermissionRow,
  MatrixPermissionsState,
  PermissionValue,
  ModuleCategory,
} from '@/types/permission';
import { RoleCode } from '@/types/role';

export const INITIAL_PERMISSIONS: PermissionRow[] = [
  {
    id: 'dashboard-analytics',
    moduleKey: 'dashboard',
    moduleName: 'Dashboard',
    category: 'All',
    feature: 'Executive Dashboard & Metrics',
    description: 'View top-level KPI cards, total revenue, and real-time store metrics.',
    rolePermissions: {
      owner: 'edit',
      branch_manager: 'view',
      accountant: 'view',
      cashier: 'view',
      staff: 'none',
    },
  },
  {
    id: 'sales-invoices',
    moduleKey: 'sales',
    moduleName: 'Sales',
    category: 'Sales',
    feature: 'Sales Invoices & Billing',
    description: 'Create, view, and edit sales tax invoices and customer receipts.',
    rolePermissions: {
      owner: 'edit',
      branch_manager: 'edit',
      accountant: 'edit',
      cashier: 'edit',
      staff: 'none',
    },
  },
  {
    id: 'sales-discounts',
    moduleKey: 'sales',
    moduleName: 'Sales',
    category: 'Sales',
    feature: 'Custom Discount Approvals',
    description: 'Apply custom discounts above maximum threshold on sales orders.',
    rolePermissions: {
      owner: 'edit',
      branch_manager: 'edit',
      accountant: 'none',
      cashier: 'none',
      staff: 'none',
    },
  },
  {
    id: 'pos-checkout',
    moduleKey: 'pos',
    moduleName: 'POS',
    category: 'Sales',
    feature: 'POS Terminal & Cash Drawer',
    description: 'Operate retail barcode scanner, billing terminal, and cash register.',
    rolePermissions: {
      owner: 'edit',
      branch_manager: 'edit',
      accountant: 'view',
      cashier: 'edit',
      staff: 'none',
    },
  },
  {
    id: 'customers-management',
    moduleKey: 'customers',
    moduleName: 'Customers',
    category: 'Sales',
    feature: 'Customer Directory & Credit Limit',
    description: 'Manage customer contact info, due balance, and credit ceilings.',
    rolePermissions: {
      owner: 'edit',
      branch_manager: 'edit',
      accountant: 'view',
      cashier: 'view',
      staff: 'none',
    },
  },
  {
    id: 'products-catalog',
    moduleKey: 'products',
    moduleName: 'Products',
    category: 'Inventory',
    feature: 'Product Catalog & Pricing',
    description: 'Create products, set purchase/selling prices, and manages variants.',
    rolePermissions: {
      owner: 'edit',
      branch_manager: 'edit',
      accountant: 'view',
      cashier: 'view',
      staff: 'none',
    },
  },
  {
    id: 'inventory-stock',
    moduleKey: 'inventory',
    moduleName: 'Inventory',
    category: 'Inventory',
    feature: 'Stock Adjustment & Transfers',
    description: 'Adjust stock levels, record damage/wastage, and initiate branch transfers.',
    rolePermissions: {
      owner: 'edit',
      branch_manager: 'edit',
      accountant: 'view',
      cashier: 'none',
      staff: 'none',
    },
  },
  {
    id: 'purchase-orders',
    moduleKey: 'purchase',
    moduleName: 'Purchase',
    category: 'Purchase',
    feature: 'Purchase Orders & Bills',
    description: 'Create POs, record goods received notes (GRN), and process vendor bills.',
    rolePermissions: {
      owner: 'edit',
      branch_manager: 'edit',
      accountant: 'edit',
      cashier: 'none',
      staff: 'none',
    },
  },
  {
    id: 'suppliers-ledger',
    moduleKey: 'suppliers',
    moduleName: 'Suppliers',
    category: 'Purchase',
    feature: 'Supplier Directory & Payable Ledger',
    description: 'Maintain vendor list, payment schedules, and outstanding balances.',
    rolePermissions: {
      owner: 'edit',
      branch_manager: 'view',
      accountant: 'edit',
      cashier: 'none',
      staff: 'none',
    },
  },
  {
    id: 'accounting-journals',
    moduleKey: 'accounting',
    moduleName: 'Accounting',
    category: 'Finance',
    feature: 'General Ledger & Journal Entries',
    description: 'Post debit/credit journal entries, manage Chart of Accounts.',
    rolePermissions: {
      owner: 'edit',
      branch_manager: 'none',
      accountant: 'edit',
      cashier: 'none',
      staff: 'none',
    },
  },
  {
    id: 'finance-banking',
    moduleKey: 'finance',
    moduleName: 'Finance',
    category: 'Finance',
    feature: 'Bank Accounts & Cash Transfers',
    description: 'Manage company bank accounts, fund transfers, and reconciliation.',
    rolePermissions: {
      owner: 'edit',
      branch_manager: 'none',
      accountant: 'edit',
      cashier: 'none',
      staff: 'none',
    },
  },
  {
    id: 'hr-employees',
    moduleKey: 'hr',
    moduleName: 'HR',
    category: 'HR',
    feature: 'Employee Directory & Onboarding',
    description: 'Manage staff profiles, designations, contracts, and employment status.',
    rolePermissions: {
      owner: 'edit',
      branch_manager: 'view',
      accountant: 'view',
      cashier: 'none',
      staff: 'none',
    },
  },
  {
    id: 'payroll-processing',
    moduleKey: 'payroll',
    moduleName: 'Payroll',
    category: 'HR',
    feature: 'Payroll & Salary Disbursal',
    description: 'Process monthly salaries, calculate deductions, and generate payslips.',
    rolePermissions: {
      owner: 'edit',
      branch_manager: 'none',
      accountant: 'edit',
      cashier: 'none',
      staff: 'none',
    },
  },
  {
    id: 'attendance-tracking',
    moduleKey: 'attendance',
    moduleName: 'Attendance',
    category: 'HR',
    feature: 'Attendance & Work Shifts',
    description: 'Track daily check-in times, overtime hours, and manage work schedules.',
    rolePermissions: {
      owner: 'edit',
      branch_manager: 'edit',
      accountant: 'view',
      cashier: 'view',
      staff: 'view',
    },
  },
  {
    id: 'leave-approvals',
    moduleKey: 'leave',
    moduleName: 'Leave',
    category: 'HR',
    feature: 'Leave Application & Approval',
    description: 'Apply for leaves, approve employee leave requests, and track balances.',
    rolePermissions: {
      owner: 'edit',
      branch_manager: 'edit',
      accountant: 'view',
      cashier: 'none',
      staff: 'view',
    },
  },
  {
    id: 'reports-financial',
    moduleKey: 'reports',
    moduleName: 'Reports',
    category: 'Reports',
    feature: 'Financial & P&L Reports',
    description: 'Generate Profit & Loss statements, balance sheets, and tax summaries.',
    rolePermissions: {
      owner: 'edit',
      branch_manager: 'none',
      accountant: 'edit',
      cashier: 'none',
      staff: 'none',
    },
  },
  {
    id: 'settings-security',
    moduleKey: 'settings',
    moduleName: 'Settings',
    category: 'Settings',
    feature: 'Roles & ERP System Controls',
    description: 'Configure business settings, tax rules, and user role access levels.',
    rolePermissions: {
      owner: 'edit',
      branch_manager: 'none',
      accountant: 'none',
      cashier: 'none',
      staff: 'none',
    },
  },
];

const buildMatrixState = (rows: PermissionRow[]): MatrixPermissionsState => {
  const state: MatrixPermissionsState = {};
  rows.forEach((row) => {
    state[row.id] = { ...row.rolePermissions };
  });
  return state;
};

export const usePermissions = () => {
  const queryClient = useQueryClient();

  // Primary Query for Permissions
  const {
    data: permissionsData = INITIAL_PERMISSIONS,
    isLoading,
    isError,
    refetch,
  } = useQuery<PermissionRow[]>({
    queryKey: ['permissions-matrix'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
      return INITIAL_PERMISSIONS;
    },
    staleTime: 1000 * 60 * 10,
  });

  // Local state for tracking uncommitted changes
  const [localMatrix, setLocalMatrix] = useState<MatrixPermissionsState | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ModuleCategory>('All');

  // Compute actual working matrix
  const currentMatrix = useMemo(() => {
    if (localMatrix) return localMatrix;
    return buildMatrixState(permissionsData);
  }, [localMatrix, permissionsData]);

  const savedMatrix = useMemo(() => {
    return buildMatrixState(permissionsData);
  }, [permissionsData]);

  // Check dirty state
  const isDirty = useMemo(() => {
    if (!localMatrix) return false;
    return JSON.stringify(localMatrix) !== JSON.stringify(savedMatrix);
  }, [localMatrix, savedMatrix]);

  // Update permission cell
  const updatePermission = (
    permissionId: string,
    roleCode: RoleCode,
    newValue: PermissionValue
  ) => {
    if (roleCode === 'owner') {
      toast.error('Owner role permissions are protected and cannot be changed.');
      return;
    }

    setLocalMatrix((prev) => {
      const base = prev ? { ...prev } : { ...savedMatrix };
      const rowState = base[permissionId] ? { ...base[permissionId] } : { owner: 'edit', branch_manager: 'none', accountant: 'none', cashier: 'none', staff: 'none' };
      rowState[roleCode] = newValue;
      base[permissionId] = rowState;
      return base;
    });
  };

  // Mutation to Save Changes
  const saveMutation = useMutation({
    mutationFn: async (updatedState: MatrixPermissionsState) => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return updatedState;
    },
    onSuccess: (updatedState) => {
      // Update cache
      queryClient.setQueryData<PermissionRow[]>(['permissions-matrix'], (old) => {
        if (!old) return old;
        return old.map((row) => ({
          ...row,
          rolePermissions: updatedState[row.id]
            ? { ...updatedState[row.id] }
            : row.rolePermissions,
        }));
      });
      setLocalMatrix(null);
      toast.success('Permissions updated successfully.');
    },
    onError: () => {
      toast.error('Failed to save permissions. Please try again.');
    },
  });

  const saveChanges = () => {
    if (!localMatrix || !isDirty) return;
    saveMutation.mutate(localMatrix);
  };

  const discardChanges = () => {
    setLocalMatrix(null);
    toast.info('Unsaved changes discarded.');
  };

  const resetChangesToDefault = () => {
    const defaultMatrix = buildMatrixState(INITIAL_PERMISSIONS);
    setLocalMatrix(defaultMatrix);
    toast.warning('Permissions reset to initial defaults. Click Save Changes to commit.');
  };

  // Filtered permission rows for display
  const filteredPermissions = useMemo(() => {
    return permissionsData.filter((row) => {
      // Category filter
      if (selectedCategory !== 'All' && row.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesModule = row.moduleName.toLowerCase().includes(q);
        const matchesFeature = row.feature.toLowerCase().includes(q);
        const matchesDesc = row.description.toLowerCase().includes(q);
        return matchesModule || matchesFeature || matchesDesc;
      }
      return true;
    });
  }, [permissionsData, selectedCategory, searchQuery]);

  return {
    permissions: permissionsData,
    filteredPermissions,
    currentMatrix,
    isDirty,
    isLoading,
    isError,
    isSaving: saveMutation.isPending,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    updatePermission,
    saveChanges,
    discardChanges,
    resetChangesToDefault,
    refetch,
  };
};
