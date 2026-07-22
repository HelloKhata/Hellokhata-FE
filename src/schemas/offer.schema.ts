// Hello Khata OS - Offer Zod Validation Schema
// হ্যালো খাতা - অফার ফরম ভ্যালিডেশন স্কিমা

import { z } from 'zod';

export const offerSchema = z.object({
  id: z.string().optional(),
  productId: z.string().min(1, 'Product is required'),
  productName: z.string().min(1, 'Product name is required'),
  batchId: z.string().optional(),
  batchNumber: z.string().optional(),
  scope: z.enum(['product', 'batch']),
  type: z.enum(['bogo', 'percentage', 'flat', 'bundle']),
  
  // Type specific configs
  buyQuantity: z.number().min(1, 'Buy quantity must be at least 1').optional(),
  freeQuantity: z.number().min(1, 'Free quantity must be at least 1').optional(),
  percentage: z.number().min(0.1, 'Percentage must be greater than 0').max(100, 'Percentage cannot exceed 100%').optional(),
  flatAmount: z.number().min(1, 'Discount amount must be at least 1').optional(),
  flatScope: z.enum(['per_unit', 'per_transaction']).optional(),
  bundleQuantity: z.number().min(2, 'Bundle quantity must be at least 2').optional(),
  bundlePrice: z.number().min(1, 'Bundle price must be at least 1').optional(),
  
  // Validity
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  untilSoldOut: z.boolean().default(false),
  
  // Branch
  branchId: z.string().default('all'),
}).superRefine((data, ctx) => {
  // Validate type-specific requirements
  if (data.type === 'bogo') {
    if (!data.buyQuantity || data.buyQuantity < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Buy quantity is required for BOGO',
        path: ['buyQuantity'],
      });
    }
    if (!data.freeQuantity || data.freeQuantity < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Free quantity is required for BOGO',
        path: ['freeQuantity'],
      });
    }
  } else if (data.type === 'percentage') {
    if (data.percentage === undefined || data.percentage <= 0 || data.percentage > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enter a valid percentage between 1 and 100',
        path: ['percentage'],
      });
    }
  } else if (data.type === 'flat') {
    if (!data.flatAmount || data.flatAmount <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enter a valid discount amount',
        path: ['flatAmount'],
      });
    }
  } else if (data.type === 'bundle') {
    if (!data.bundleQuantity || data.bundleQuantity < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Bundle quantity must be at least 2',
        path: ['bundleQuantity'],
      });
    }
    if (!data.bundlePrice || data.bundlePrice <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enter a valid bundle price',
        path: ['bundlePrice'],
      });
    }
  }

  // Validate End Date when not untilSoldOut
  if (!data.untilSoldOut) {
    if (!data.endDate || data.endDate.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End date is required when not running until batch sells out',
        path: ['endDate'],
      });
    } else {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      if (end <= start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'End date must be after start date',
          path: ['endDate'],
        });
      }
    }
  }
});

export type OfferFormValues = z.infer<typeof offerSchema>;
