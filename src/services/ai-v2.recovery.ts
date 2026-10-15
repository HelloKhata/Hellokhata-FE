import type { RecoveryTarget } from "./ai-v2.state-client";
const id = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function saveRecovery(
  context: string,
  target: RecoveryTarget | undefined,
) {
  try {
    const key = "ai-v2-recovery:" + context;
    if (!target) {
      sessionStorage.removeItem(key);
      return;
    }
    sessionStorage.setItem(
      key,
      JSON.stringify({ target, savedAt: Date.now() }),
    );
  } catch {
    /* UI still works if session storage is unavailable. */
  }
}
export function loadRecovery(context: string): RecoveryTarget | undefined {
  try {
    const text = sessionStorage.getItem("ai-v2-recovery:" + context);
    if (!text || text.length > 600) return;
    const data = JSON.parse(text) as {
      target?: RecoveryTarget;
      savedAt?: number;
    };
    if (
      !data.target ||
      typeof data.savedAt !== "number" ||
      data.savedAt > Date.now() ||
      Date.now() - data.savedAt > 86400000 ||
      !Object.keys(data.target).every((k) =>
        ["requestId", "actionId", "clientRequestId"].includes(k),
      ) ||
      !Object.values(data.target).every(
        (v) => typeof v === "string" && id.test(v),
      )
    )
      return;
    return data.target;
  } catch {
    return;
  }
}
