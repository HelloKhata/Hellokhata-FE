import type { ToolSchema } from "../types/ai-integration/generic-tool.contract";
import { ERP_API_BASE_URL } from "../lib/api-url";
import { useSessionStore } from "../stores/sessionStore";
import { useBranchStore } from "../stores/branchStore";
import { compileBrowserContract } from "./ai-v2.browser";
import { fetchWithSessionRefresh } from "./ai-v2.auth";
export async function getReviewSchema(
  name: string,
  version: string,
  signal: AbortSignal,
): Promise<ToolSchema> {
  const token = useSessionStore.getState().token,
    branch = useBranchStore.getState().currentBranchId;
  const response = await fetchWithSessionRefresh(
    ERP_API_BASE_URL.replace(/\/$/, "") +
      "/ai/v2/tools/" +
      encodeURIComponent(name) +
      "/schema",
    {
      headers: {
        ...(token ? { Authorization: "Bearer " + token } : {}),
        ...(branch !== undefined ? { "x-branch-id": branch ?? "" } : {}),
      },
      redirect: "error",
      signal,
    },
  );
  if (!response.ok) throw new Error("REVIEW_SCHEMA_UNAVAILABLE");
  const reader = response.body?.getReader();
  if (!reader) throw new Error("INVALID_SCHEMA");
  let bytes = 0,
    text = "";
  const decoder = new TextDecoder();
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > 24000) throw new Error("SCHEMA_TOO_LARGE");
      text += decoder.decode(chunk.value, { stream: true });
    }
    text += decoder.decode();
  } finally {
    await reader.cancel().catch(() => undefined);
  }
  const value = JSON.parse(text);
  if (
    value.success !== true ||
    value.data?.name !== name ||
    value.data?.version !== version ||
    value.data?.inputSchema?.type !== "object"
  )
    throw new Error("INVALID_SCHEMA");
  const definition = value.data.inputSchema as ToolSchema;
  // Compile without defaults/coercion; the server still validates every edit.
  compileBrowserContract(definition);
  return definition;
}
