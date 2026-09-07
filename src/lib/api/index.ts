// Hello Khata OS - API Index
// Real API integration

import { api } from '../api-client';
import type {
  DashboardStats,
  Item,
  Sale,
  Purchase,
  Category,
  ApiResponse,
  PaginatedResponse,
  BusinessHealthScore,
} from '@/types';

// Query Keys for React Query
export const queryKeys = {
  // Dashboard
  dashboardStats: (branchId?: string) => ['dashboard', 'stats', branchId] as const,
  aiInsights: ['dashboard', 'aiInsights'] as const,

  // Branches
  branches: ['branches'] as const,

  // Accounts
  accounts: (branchId?: string) => ['accounts', branchId] as const,

  // Health Score
  healthScore: (branchId?: string) => ['healthScore', branchId] as const,

  // Credit Control
  creditAging: (branchId?: string) => ['credit', 'aging', branchId] as const,
  creditLimit: (partyId: string) => ['credit', 'limit', partyId] as const,

  // Dead Stock
  deadStock: (branchId?: string) => ['inventory', 'deadStock', branchId] as const,

  // Items & Categories
  items: (filters?: { categoryId?: string; lowStock?: boolean; search?: string; branchId?: string }) => ['items', filters] as const,
  categories: ['categories'] as const,

  // Sales
  sales: (filters?: { partyId?: string; startDate?: string; endDate?: string; branchId?: string }) => ['sales', filters] as const,

  // Purchases
  purchases: (filters?: { supplierId?: string; startDate?: string; endDate?: string; branchId?: string }) => ['purchases', filters] as const,
};

// API Functions - Real API calls
export const apiFunctions = {
  // Dashboard
  getDashboardStats: async (branchId?: string): Promise<ApiResponse<DashboardStats>> => {
    return api.get<DashboardStats>('/dashboard/stats', { branchId });
  },

  getAiInsights: async (): Promise<{ success: boolean; data: BusinessHealthScore }> => {
    return api.get<BusinessHealthScore>('/health-score');
  },

}