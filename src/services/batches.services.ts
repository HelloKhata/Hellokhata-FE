import client from "@/lib/axios";

export type BatchStatus = 'expired' | 'expiring' | 'active' | 'inactive' | 'depleted' | 'written_off';
export type BatchSort = 'expiry_asc' | 'received_desc' | 'received_asc' | 'name_asc';

export const getBatches = async (params?: {
    search?: string;
    itemId?: string;
    status?: BatchStatus;
    branchId?: string;
    sort?: BatchSort;
    page?: number;
    limit?: number;
}) => {
    const query = new URLSearchParams();

    if (params?.search) query.append("search", params.search);
    if (params?.itemId) query.append("itemId", params.itemId);
    if (params?.status) query.append("status", params.status);
    if (params?.branchId) query.append("branchId", params.branchId);
    if (params?.sort) query.append("sort", params.sort);

    query.append("page", String(params?.page || 1));
    query.append("limit", String(params?.limit || 50));
    const res = await client.get(`/api/batches?${query.toString()}`);
    return res.data;
}

export const getBatchesStatus = async () => {
    const res = await client.get(`/api/batches/status`);
    return res.data;
}

export const getBatchById = async (id: string) => {
    const res = await client.get(`/api/batches/${id}`);
    return res.data;
}

export const getBatchMovements = async (id: string) => {
    const res = await client.get(`/api/batches/${id}/movements`);
    return res.data;
}

export const adjustBatchQuantity = async (
    id: string,
    data: { quantity_delta: number; reason: string }
) => {
    const res = await client.post(`/api/batches/${id}/adjust`, data);
    return res.data;
}

export const updateBatchDetails = async (
    id: string,
    data: { supplier?: string; manufacturing_date?: string; notes?: string }
) => {
    const res = await client.patch(`/api/batches/${id}`, data);
    return res.data;
}

export const generateMissingBarcodes = async (batch_ids: string[]) => {
    const res = await client.post(`/api/batches/generate-missing-barcodes`, { batch_ids });
    return res.data;
}