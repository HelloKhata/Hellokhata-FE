import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
).replace(/\/+$/, "");

const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };
type QueuedRequest = {
  resolve: () => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let failedQueue: QueuedRequest[] = [];

const processQueue = (error?: unknown) => {
  failedQueue.forEach((request) => {
    if (error) request.reject(error);
    else request.resolve();
  });
  failedQueue = [];
};

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string }>) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const message = error.response?.data?.message || "Something went wrong!";
    const isRefreshRequest = originalRequest?.url?.includes("/api/auth/refresh");

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isRefreshRequest
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => client(originalRequest));
      }

      isRefreshing = true;
      try {
        await axios.post(
          `${API_BASE_URL}/api/auth/refresh`,
          {},
          { withCredentials: true },
        );
        processQueue();
        return client(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        if (typeof window !== "undefined") {
          toast.error("Session expired. Please login again.");
          const pathname = window.location.pathname;
          if (pathname !== "/login" && pathname !== "/verify-forget-otp") {
            window.location.href = "/login";
          }
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (typeof window !== "undefined") toast.error(message);
    return Promise.reject(error);
  },
);

export default client;
