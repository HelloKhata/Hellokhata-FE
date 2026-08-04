import { z } from 'zod';

export const permissionValueSchema = z.enum(['none', 'view', 'edit']);

export const roleCodeSchema = z.enum([
  'owner',
  'branch_manager',
  'accountant',
  'cashier',
  'staff',
]);

export const rolePermissionsSchema = z.object({
  owner: permissionValueSchema.refine((val) => val === 'edit' || val === 'view', {
    message: 'Owner permission is protected and must remain active',
  }),
  branch_manager: permissionValueSchema,
  accountant: permissionValueSchema,
  cashier: permissionValueSchema,
  staff: permissionValueSchema,
});

export const updatePermissionSchema = z.object({
  permissionId: z.string().min(1, 'Permission ID is required'),
  roleCode: roleCodeSchema.refine((code) => code !== 'owner', {
    message: 'The Owner role is protected and cannot be modified',
  }),
  newValue: permissionValueSchema,
});

export const matrixPermissionsSchema = z.record(
  z.string(),
  rolePermissionsSchema
);

export type PermissionValueSchema = z.infer<typeof permissionValueSchema>;
export type UpdatePermissionInput = z.infer<typeof updatePermissionSchema>;
export type MatrixPermissionsSchema = z.infer<typeof matrixPermissionsSchema>;
