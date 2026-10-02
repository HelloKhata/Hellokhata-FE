import type { SchemaCompiler } from "../types/ai-integration/generic-tool.contract";
import { useSessionStore } from "../stores/sessionStore";
import { useBranchStore } from "../stores/branchStore";
import { createV2Transport } from "./ai-v2.transport";

/** Phase 6 supplies the reviewed browser compiler and wires the chat UI.
 * Existing v1 callers continue using ai.services.ts unchanged. */
export function createErpV2Transport(compile: SchemaCompiler) {
  return createV2Transport({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
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
