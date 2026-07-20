import axios from 'axios';
import { API_BASE_URL } from '@/lib/axios';
import type {
  PlatformPrincipal,
  PlatformSessionResponse,
} from './types';

// Deliberately separate from the tenant axios client. Platform 401 responses
// must never invoke the tenant refresh flow or redirect to the shop login page.
const platformClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { Accept: 'application/json' },
});

export const isPlatformAdminEnabled =
  process.env.NEXT_PUBLIC_PLATFORM_ADMIN_ENABLED === 'true';

export async function signInPlatform(input: {
  email: string;
  password: string;
}): Promise<PlatformPrincipal> {
  const response = await platformClient.post<PlatformSessionResponse>(
    '/api/platform/auth/sign-in',
    input,
  );
  return response.data.data.principal;
}

export async function getPlatformSession(): Promise<PlatformPrincipal> {
  const response = await platformClient.get<PlatformSessionResponse>(
    '/api/platform/auth/session',
  );
  return response.data.data.principal;
}

export async function signOutPlatform(): Promise<void> {
  await platformClient.post('/api/platform/auth/sign-out');
}

export { platformClient };
