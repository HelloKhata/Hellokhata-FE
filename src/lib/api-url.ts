/** One ERP API setting shared by authenticated requests, SSE and AI endpoints. */
export const ERP_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

// Axios callers use both `api/...` and `/api/...` paths. Keep their common
// base at the host origin while deriving it from the configured `/api` URL.
export const ERP_API_ORIGIN = ERP_API_BASE_URL.replace(/\/api\/?$/, "").replace(
  /\/$/,
  "",
);
 
export function erpApiEndpoint(path: string): string {
  const base = ERP_API_BASE_URL.replace(/\/$/, "");
  return new URL(
    `${base}/${path.replace(/^\/+/, "")}`,
    window.location.origin,
  ).toString();
}
