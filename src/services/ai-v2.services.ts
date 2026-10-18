import type { SchemaCompiler } from "../types/ai-integration/generic-tool.contract";
import { useSessionStore } from "../stores/sessionStore";
import { useBranchStore } from "../stores/branchStore";
import { createV2Transport } from "./ai-v2.transport";
import { ERP_API_BASE_URL } from "@/lib/api-url";

/** Phase 5 supplies the browser compiler and gated invoice vertical slice.
 * Phase 6 unifies entry points; existing v1 callers remain unchanged. */
export function createErpV2Transport(compile: SchemaCompiler) {
  return createV2Transport({
    baseUrl: ERP_API_BASE_URL,
    compile,
    headers: () => {
      const session = useSessionStore.getState();
      const branch = useBranchStore.getState().currentBranchId;
      return {
        ...(session.token ? { Authorization: "Bearer " + session.token } : {}),
        ...(branch !== undefined ? { "x-branch-id": branch ?? "" } : {}),
      };
    },
  });
}
