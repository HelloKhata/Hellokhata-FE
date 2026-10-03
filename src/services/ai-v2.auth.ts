import { ERP_API_ORIGIN } from "../lib/api-url";

let refreshInFlight: Promise<boolean> | undefined;

/**
 * Retries one ERP request after the cookie-backed session is refreshed.
 * The caller keeps its original idempotency key, so a retry cannot create a
 * second AI command or request.
 */
export async function fetchWithSessionRefresh(
  input: RequestInfo | URL,
  init: RequestInit,
  fetcher: typeof fetch = globalThis.fetch,
): Promise<Response> {
  const request = () =>
    fetcher(input, { ...init, credentials: "include" });
  const response = await request();
  if (response.status !== 401 || init.signal?.aborted) return response;

  if (!refreshInFlight) {
    refreshInFlight = fetcher(ERP_API_ORIGIN + "/api/auth/refresh", {
      method: "POST",
      credentials: "include",
      redirect: "error",
    })
      .then((refresh) => refresh.ok)
      .catch(() => false)
      .finally(() => {
        refreshInFlight = undefined;
      });
  }
  if (!(await refreshInFlight)) return response;
  return request();
}
