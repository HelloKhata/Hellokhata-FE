import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  PermissionRow,
  ModuleCategory,
  ActionType,
  GranularPermissionsState,
} from '@/types/permission';
import { RoleCode } from '@/types/role';

export const INITIAL_PERMISSIONS: PermissionRow[] = [
  {
    id: 'dashboard-analytics',
    moduleKey: 'dashboard',
    moduleName: 'Dashboard',
    category: 'Dashboard',
    feature: 'Executive Dashboard & Metrics',
    description: 'View top-level KPI cards, total revenue, and real-time store metrics.',
    availableActions: ['view', 'export'],
    rolePermissions: {}, // legacy
    roleGranularPermissions: {
      owner: ['view', 'export'],
      branch_manager: ['view'],
      accountant: ['view'],
      cashier: ['view'],
      staff: [],
    },
  },
  {
    id: 'sales-invoices',
    moduleKey: 'sales',
    moduleName: 'Sales',
    category: 'Sales',
    feature: 'Sales Invoices & Billing',
    description: 'Create, view, and edit sales tax invoices and customer receipts.',
    availableActions: ['view', 'create', 'edit', 'delete', 'export', 'print'],
    rolePermissions: {},
    roleGranularPermissions: {
      owner: ['view', 'create', 'edit', 'delete', 'export', 'print'],
      branch_manager: ['view', 'create', 'edit', 'print'],
      accountant: ['view', 'create', 'edit', 'export'],
      cashier: ['view', 'create', 'print'],
      staff: [],
    },
  },
  {
    id: 'products-catalog',
    moduleKey: 'products',
    moduleName: 'Products',
    category: 'Inventory',
    feature: 'Product Catalog & Pricing',
    description: 'Create products, set purchase/selling prices, and manages variants.',
    availableActions: ['view', 'create', 'edit', 'delete', 'export', 'import'],
    rolePermissions: {},
    roleGranularPermissions: {
      owner: ['view', 'create', 'edit', 'delete', 'export', 'import'],
      branch_manager: ['view', 'create', 'edit'],
      accountant: ['view', 'export'],
      cashier: ['view'],
      staff: [],
    },
  },
  // Add more as needed, keeping it brief for the rewrite
];

const buildGranularState = (rows: PermissionRow[]): GranularPermissionsState => {
  const state: GranularPermissionsState = {};
  rows.forEach((row) => {
    state[row.id] = { ...row.roleGranularPermissions };
  });
  return state;
};

export const usePermissions = () => {
  const queryClient = useQueryClient();

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

  const [localMatrix, setLocalMatrix] = useState<GranularPermissionsState | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ModuleCategory>('All');

  const currentMatrix = useMemo(() => {
    if (localMatrix) return localMatrix;
    return buildGranularState(permissionsData);
  }, [localMatrix, permissionsData]);

  const savedMatrix = useMemo(() => {
    return buildGranularState(permissionsData);
  }, [permissionsData]);

  const isDirty = useMemo(() => {
    if (!localMatrix) return false;
    return JSON.stringify(localMatrix) !== JSON.stringify(savedMatrix);
  }, [localMatrix, savedMatrix]);

  const updateGranularPermission = (
    permissionId: string,
    roleCode: RoleCode,
    action: ActionType,
    isAllowed: boolean
  ) => {
    if (roleCode === 'owner') {
      toast.error('Owner role permissions are protected and cannot be changed.');
      return;
    }

    setLocalMatrix((prev) => {
      const base = prev ? JSON.parse(JSON.stringify(prev)) : JSON.parse(JSON.stringify(savedMatrix));
      
      if (!base[permissionId]) base[permissionId] = {};
      if (!base[permissionId][roleCode]) base[permissionId][roleCode] = [];

      const currentActions = base[permissionId][roleCode];
      
      if (isAllowed && !currentActions.includes(action)) {
        currentActions.push(action);
      } else if (!isAllowed) {
        base[permissionId][roleCode] = currentActions.filter((a: ActionType) => a !== action);
      }

      return base;
    });
  };

  const saveMutation = useMutation({
    mutationFn: async (updatedState: GranularPermissionsState) => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return updatedState;
    },
    onSuccess: (updatedState) => {
      queryClient.setQueryData<PermissionRow[]>(['permissions-matrix'], (old) => {
        if (!old) return old;
        return old.map((row) => ({
          ...row,
          roleGranularPermissions: updatedState[row.id]
            ? { ...updatedState[row.id] }
            : row.roleGranularPermissions,
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
    const defaultMatrix = buildGranularState(INITIAL_PERMISSIONS);
    setLocalMatrix(defaultMatrix);
    toast.warning('Permissions reset to initial defaults. Click Save Changes to commit.');
  };

  const filteredPermissions = useMemo(() => {
    return permissionsData.filter((row) => {
      if (selectedCategory !== 'All' && row.category !== selectedCategory) {
        return false;
      }
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
    updateGranularPermission,
    saveChanges,
    discardChanges,
    resetChangesToDefault,
    refetch,
  };
};
