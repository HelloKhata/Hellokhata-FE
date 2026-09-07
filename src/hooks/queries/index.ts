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



export function useAiInsights() {
  return useQuery({
    queryKey: queryKeys.aiInsights,
    queryFn: () => apiFunctions.getAiInsights(),
    // Return the full health score object which contains suggestions
    staleTime: 120000, // 2 minutes
  });
}

