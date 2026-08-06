import { Role, RoleCode } from '@/types/role';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const PREDEFINED_ROLES: Role[] = [
  {
    id: 'role-owner',
    code: 'owner',
    name: 'Owner',
    nameBn: 'মালিক',
    description: 'Full administrative access across all ERP modules and financial operations. Immutable protected system role.',
    descriptionBn: 'সমস্ত ইআরপি মডিউল এবং আর্থিক অপারেশনে পূর্ণ প্রশাসনিক অ্যাক্সেস।',
    isProtected: true,
    isSystem: true,
    employeeCount: 1,
    updatedAt: '2026-08-01T10:00:00Z',
    scope: 'entire_company',
    limits: {
      maxDiscountPercentage: 100,
    },
    restrictions: {
      allowLogin: 'always',
      allowedDevice: 'any'
    },
    dataVisibility: 'all'
  },
  {
    id: 'role-branch-manager',
    code: 'branch_manager',
    name: 'Branch Manager',
    nameBn: 'শাখা ব্যবস্থাপক',
    description: 'Operational control over assigned branch activities, inventory, sales, and employee attendance.',
    descriptionBn: 'নির্ধারিত শাখার কার্যক্রম, ইনভেন্টরি, বিক্রয় এবং উপস্থিতির উপর নিয়ন্ত্রণ।',
    isProtected: false,
    isSystem: true,
    employeeCount: 4,
    updatedAt: '2026-08-03T14:30:00Z',
  },
  {
    id: 'role-accountant',
    code: 'accountant',
    name: 'Accountant',
    nameBn: 'হিসাবরক্ষক',
    description: 'Access to financial ledger, vouchers, purchase bills, payroll processing, and financial reporting.',
    descriptionBn: 'আর্থিক খতিয়ান, ভাউচার, ক্রয় বিল, পেরোল প্রক্রিয়াকরণ এবং আর্থিক রিপোর্টে অ্যাক্সেস।',
    isProtected: false,
    isSystem: true,
    employeeCount: 2,
    updatedAt: '2026-08-02T11:15:00Z',
  },
  {
    id: 'role-cashier',
    code: 'cashier',
    name: 'Cashier',
    nameBn: 'ক্যাশিয়ার',
    description: 'Front-desk POS checkout capabilities, receipt issuance, cash register reconciliation, and view product stock.',
    descriptionBn: 'পিওএস চেকআউট, রসিদ প্রদান, ক্যাশ রেজিস্টার মিলন এবং প্রোডাক্ট স্টক দেখার সুবিধা।',
    isProtected: false,
    isSystem: true,
    employeeCount: 8,
    updatedAt: '2026-08-04T09:20:00Z',
  },
  {
    id: 'role-staff',
    code: 'staff',
    name: 'Staff',
    nameBn: 'স্টাফ',
    description: 'Basic access to daily assigned task workflows, self attendance, and personal leave requests.',
    descriptionBn: 'দৈনন্দিন কাজের ফ্লো, নিজের উপস্থিতি এবং ব্যক্তিগত ছুটির আবেদনে সাধারণ অ্যাক্সেস।',
    isProtected: false,
    isSystem: true,
    employeeCount: 15,
    updatedAt: '2026-07-28T16:45:00Z',
  },
];

export const useRoles = () => {
  const queryClient = useQueryClient();

  const { data: roles = PREDEFINED_ROLES, isLoading, isError, refetch } = useQuery<Role[]>({
    queryKey: ['roles'],
    queryFn: async () => {
      // Simulate network request for production-ready TanStack Query hook
      await new Promise((resolve) => setTimeout(resolve, 300));
      const cached = queryClient.getQueryData<Role[]>(['roles']);
      if (cached && cached.length > 0) return cached;
      return PREDEFINED_ROLES;
    },
    staleTime: 1000 * 60 * 15, // 15 mins cache
  });

  const getRoleByCode = (code: RoleCode): Role | undefined => {
    return roles.find((r) => r.code === code);
  };

  const createRole = (newRole: Omit<Role, 'id' | 'isProtected' | 'isSystem' | 'employeeCount' | 'updatedAt'>) => {
    const role: Role = {
      ...newRole,
      id: `role-${Date.now()}`,
      isProtected: false,
      isSystem: false,
      employeeCount: 0,
      updatedAt: new Date().toISOString(),
    };
    queryClient.setQueryData<Role[]>(['roles'], (old) => {
      return [...(old || []), role];
    });
    return role;
  };

  const duplicateRole = (roleToDuplicate: Role) => {
    const role: Role = {
      ...roleToDuplicate,
      id: `role-${Date.now()}`,
      code: `${roleToDuplicate.code}_copy_${Date.now()}`,
      name: `${roleToDuplicate.name} (Copy)`,
      isProtected: false,
      isSystem: false,
      employeeCount: 0,
      updatedAt: new Date().toISOString(),
    };
    queryClient.setQueryData<Role[]>(['roles'], (old) => {
      return [...(old || []), role];
    });
    return role;
  };

  const deleteRole = (roleId: string) => {
    queryClient.setQueryData<Role[]>(['roles'], (old) => {
      if (!old) return old;
      return old.filter(r => r.id !== roleId);
    });
  };

  return {
    roles,
    isLoading,
    isError,
    refetch,
    getRoleByCode,
    createRole,
    duplicateRole,
    deleteRole,
  };
};
