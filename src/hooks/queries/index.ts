// Hello Khata OS - React Query Hooks
// হ্যালো খাতা - রিয়্যাক্ট কোয়েরি হুকস

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFunctions, queryKeys } from '@/lib/api';

// ============================================
// Dashboard hooks
// ============================================

export function useDashboardStats(branchId?: string) {
  return useQuery({
    queryKey: queryKeys.dashboardStats(branchId),
    queryFn: () => apiFunctions.getDashboardStats(branchId),
    select: (data) => data.data,
    staleTime: 30000, // 30 seconds
  });
}

export function useDailySales() {
  return useQuery({
    queryKey: queryKeys.dailySales(),
    queryFn: () => apiFunctions.getDailySales(),
    select: (data) => data.data,
    staleTime: 60000, // 1 minute
  });
}

export function useAiInsights() {
  return useQuery({
    queryKey: queryKeys.aiInsights,
    queryFn: () => apiFunctions.getAiInsights(),
    // Return the full health score object which contains suggestions
    staleTime: 120000, // 2 minutes
  });
}

// ============================================
// Branch hooks
// ============================================

export function useBranches() {
  return useQuery({
    queryKey: queryKeys.branches,
    queryFn: () => apiFunctions.getBranches(),
    select: (data) => data.data,
    staleTime: 60000,
  });
}

// ============================================
// Account hooks
// ============================================

export function useAccounts() {
  return useQuery({
    queryKey: queryKeys.accounts(),
    queryFn: () => apiFunctions.getAccounts(),
    select: (data) => data.data,
    staleTime: 30000,
  });
}

// ============================================
// Health Score hooks
// ============================================

export function useHealthScore() {
  return useQuery({
    queryKey: queryKeys.healthScore(),
    queryFn: () => apiFunctions.getHealthScore(),
    select: (data) => data.data,
    staleTime: 300000, // 5 minutes
  });
}

export function useRecalculateHealthScore() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => apiFunctions.recalculateHealthScore(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.healthScore() });
    },
  });
}

// ============================================
// Credit Control hooks
// ============================================

export function useCreditAgingReport() {
  return useQuery({
    queryKey: queryKeys.creditAging(),
    queryFn: () => apiFunctions.getCreditAgingReport(),
    select: (data) => data.data,
    staleTime: 120000, // 2 minutes
  });
}

export function useCreditLimitCheck(partyId: string, amount: number) {
  return useQuery({
    queryKey: queryKeys.creditLimit(partyId),
    queryFn: () => apiFunctions.checkCreditLimit(partyId, amount),
    select: (data) => data.data,
    enabled: !!partyId && amount > 0,
    staleTime: 60000,
  });
}

// ============================================
// Dead Stock hooks
// ============================================

export function useDeadStockReport() {
  return useQuery({
    queryKey: queryKeys.deadStock(),
    queryFn: () => apiFunctions.getDeadStockReport(),
    select: (data) => data.data,
    staleTime: 300000, // 5 minutes
  });
}

// ============================================
// Global Search hook
// ============================================

export function useGlobalSearch(query: string) {
  return useQuery({
    queryKey: queryKeys.globalSearch(query),
    queryFn: () => apiFunctions.globalSearch(query),
    select: (data) => data.data,
    enabled: query.length >= 2,
    staleTime: 60000,
  });
}

// ============================================
// Items & Categories hooks
// ============================================

export function useItems(params?: { categoryId?: string; lowStock?: boolean; search?: string }) {
  return useQuery({
    queryKey: queryKeys.items(params),
    queryFn: () => apiFunctions.getItems(params),
    select: (response) => response?.data || [],
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: true,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => apiFunctions.getCategories(),
    select: (data) => data.data,
    staleTime: 300000, 
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { name: string; nameBn?: string; description?: string }) => 
      apiFunctions.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; name?: string; nameBn?: string; description?: string }) => 
      apiFunctions.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiFunctions.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });
}

// ============================================
// Sales hooks
// ============================================

export function useSales(params?: { partyId?: string; startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: queryKeys.sales(params),
    queryFn: () => apiFunctions.getSales(params),
    select: (response) => (response as any)?.data?.data || (response as any)?.data || [],
    staleTime: 30000,
  });
}

// ============================================
// Purchases & Suppliers hooks
// ============================================

export function usePurchases(params?: { supplierId?: string; startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: queryKeys.purchases(params),
    queryFn: () => apiFunctions.getPurchases(params),
    select: (response) => (response as any)?.data?.data || (response as any)?.data || [],
    staleTime: 30000,
  });
}

export function usePurchase(id: string) {
  return useQuery({
    queryKey: queryKeys.parties({ type: 'supplier' }),
    queryFn: () => apiFunctions.getParties({ type: 'supplier' }),
    select: (response) => response?.data || [],
    staleTime: 60000,
  });
}

// ============================================
// Expenses hooks
// ============================================

export function useExpenses(params?: { categoryId?: string; startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: queryKeys.expenses(params),
    queryFn: () => apiFunctions.getExpenses(params),
    select: (response) => (response as any)?.data?.data || (response as any)?.data || [],
    staleTime: 60000,
  });
}

export function useExpenseCategories() {
  return useQuery({
    queryKey: queryKeys.expenseCategories,
    queryFn: () => apiFunctions.getExpenseCategories(),
    select: (data) => data.data,
    staleTime: 300000,
  });
}
