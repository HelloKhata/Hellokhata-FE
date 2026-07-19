import { api } from '@/lib/api-client';
import type {
  AiAction,
  AiActionReceipt,
  UpdateAiActionDraft,
} from '@/types/ai-actions';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function actionPath(actionId: string, suffix = '') {
  if (!UUID_PATTERN.test(actionId)) throw new Error('Invalid AI action ID.');
  return '/api/ai/actions/' + encodeURIComponent(actionId) + suffix;
}

export async function createOrRecoverAiAction(
  requestId: string,
): Promise<AiAction> {
  if (!UUID_PATTERN.test(requestId)) throw new Error('Invalid AI request ID.');
  return (
    await api.post<AiAction>(
      '/api/ai/actions/from-request/' + encodeURIComponent(requestId),
    )
  ).data;
}

export async function getAiAction(actionId: string): Promise<AiAction> {
  return (await api.get<AiAction>(actionPath(actionId))).data;
}

export async function updateAiActionDraft(
  actionId: string,
  draft: UpdateAiActionDraft,
): Promise<AiAction> {
  return (await api.patch<AiAction>(actionPath(actionId, '/draft'), draft)).data;
}

export async function confirmAiAction(
  actionId: string,
  expectedVersion: number,
): Promise<AiAction> {
  return (
    await api.post<AiAction>(actionPath(actionId, '/confirm'), {
      expectedVersion,
    })
  ).data;
}

export async function rejectAiAction(
  actionId: string,
  expectedVersion: number,
): Promise<AiAction> {
  return (
    await api.post<AiAction>(actionPath(actionId, '/reject'), {
      expectedVersion,
    })
  ).data;
}

export async function getAiActionReceipt(
  actionId: string,
): Promise<AiActionReceipt> {
  return (await api.get<AiActionReceipt>(actionPath(actionId, '/receipt'))).data;
}
