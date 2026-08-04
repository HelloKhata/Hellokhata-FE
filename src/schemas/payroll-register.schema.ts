import { z } from 'zod';

export const paymentStatusSchema = z.enum([
  'paid',
  'partially_paid',
  'pending',
  'failed',
]);

export const paymentMethodSchema = z.enum([
  'bank_transfer',
  'cash',
  'bkash',
  'cheque',
]);

export const salaryTypeSchema = z.enum([
  'monthly',
  'hourly',
  'commission',
]);

export const payrollFiltersSchema = z.object({
  payrollPeriod: z.string().optional().default('current_month'),
  branch: z.string().optional().default('all'),
  search: z.string().optional().default(''),
  department: z.string().optional().default('all'),
  role: z.string().optional().default('all'),
  paymentStatus: z.string().optional().default('all'),
  paymentMethod: z.string().optional().default('all'),
  salaryType: z.string().optional().default('all'),
});

export type PayrollFiltersInput = z.infer<typeof payrollFiltersSchema>;
