import {
    getBatches,
    getBatchesStatus,
    getBatchById,
    getBatchMovements,
    adjustBatchQuantity,
    updateBatchDetails,
    generateMissingBarcodes,
    type BatchStatus,
    type BatchSort,
} from "@/services/batches.services";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useGetBatches = (filters?: {
    search?: string;
    itemId?: string;
    status?: BatchStatus;
    branchId?: string;
    sort?: BatchSort;
    page?: number;
    limit?: number;
}) => {
    return useQuery({
        queryKey: ['batches', filters],
        queryFn: () => getBatches(filters),
        placeholderData: (previousData) => previousData
    });
}

export const useGetBatchesStatus = () => {
    return useQuery({
        queryKey: ['batchesStatus'],
        queryFn: getBatchesStatus,
    });
}

export const useGetBatchById = (id: string) => {
    return useQuery({
        queryKey: ['batch', id],
        queryFn: () => getBatchById(id),
        enabled: !!id,
    });
}

export const useGetBatchMovements = (id: string) => {
    return useQuery({
        queryKey: ['batchMovements', id],
        queryFn: () => getBatchMovements(id),
        enabled: !!id,
    });
}

export const useAdjustBatch = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: { quantity_delta: number; reason: string } }) =>
            adjustBatchQuantity(id, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['batch', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['batchMovements', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['batches'] });
            queryClient.invalidateQueries({ queryKey: ['batchesStatus'] });
        },
    });
}

export const useUpdateBatchDetails = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: { supplier?: string; manufacturing_date?: string; notes?: string } }) =>
            updateBatchDetails(id, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['batch', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['batches'] });
        },
    });
}

export const useGenerateMissingBarcodes = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (batch_ids: string[]) => generateMissingBarcodes(batch_ids),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['batches'] });
        },
    });
}

