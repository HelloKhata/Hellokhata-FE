import axios from 'axios';
import client from '@/lib/axios';
import { useUiStore } from '@/stores/uiStore';
import { useBranchStore } from '@/stores/branchStore';
import type { ApiResponse, ApiError } from '@/types';

export class ApiClientError extends Error {
  code: string;
  status: number;
  details?: Record<string, string[]>;

  constructor(error: ApiError, status: number) {
    super(error.message);
    this.code = error.code;
    this.status = status;
    this.details = error.details;
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  branchId?: string | null;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const {
    params,
    branchId: overrideBranchId,
    headers,
    body,
    method = 'GET',
  } = options;
  const language = useUiStore.getState().language;
  const branchState = useBranchStore.getState();
  const branchId =
    overrideBranchId !== undefined
      ? overrideBranchId
      : branchState.currentBranchId;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept-Language': language,
    ...(headers as Record<string, string> | undefined),
  };

  if (branchId !== undefined) {
    requestHeaders['x-branch-id'] = branchId || '';
  }

  try {
    const response = await client.request<ApiResponse<T>>({
      url: endpoint,
      method,
      params,
      headers: requestHeaders,
      data: typeof body === 'string' ? JSON.parse(body) : body,
    });
    const data = response.data;

    if (!data.success) {
      throw new ApiClientError(
        data.error || {
          code: 'UNKNOWN_ERROR',
          message: 'An unknown error occurred',
        },
        response.status,
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiClientError) throw error;

    if (axios.isAxiosError<ApiResponse<T>>(error)) {
      const apiError = error.response?.data?.error;
      throw new ApiClientError(
        apiError || {
          code: 'HTTP_ERROR',
          message: error.message || 'The API request failed.',
        },
        error.response?.status || 0,
      );
    }

    throw new ApiClientError(
      {
        code: 'NETWORK_ERROR',
        message: 'Network error. Please check your connection.',
        messageBn: 'নেটওয়ার্ক ত্রুটি। অনুগ্রহ করে আপনার সংযোগ পরীক্ষা করুন।',
      },
      0,
    );
  }
}

export const api = {
  get: <T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>,
  ) => apiRequest<T>(endpoint, { method: 'GET', params }),

  post: <T>(endpoint: string, body?: unknown, branchId?: string | null) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      branchId,
    }),

  put: <T>(endpoint: string, body?: unknown, branchId?: string | null) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      branchId,
    }),

  patch: <T>(endpoint: string, body?: unknown, branchId?: string | null) =>
    apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      branchId,
    }),

  delete: <T>(endpoint: string, branchId?: string | null) =>
    apiRequest<T>(endpoint, { method: 'DELETE', branchId }),
};

export const isMockMode = () => false;
