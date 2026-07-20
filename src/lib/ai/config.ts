/**
 * Client-side rollout gate only. The ERP backend remains authoritative for
 * authentication, tenant scope, permissions, limits, and every AI decision.
 */
export const AI_UI_ENABLED = process.env.NEXT_PUBLIC_AI_ENABLED === 'true';
