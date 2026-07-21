import { api, ApiClientError } from '@/lib/api-client';
import {
  AI_CONTRACT_VERSION,
  type AiLanguage,
  type AiProposalResponse,
  type PublicAiTextRequest,
} from '@/types/ai-gateway';

const AI_TEXT_MIN_LENGTH = 2;
const AI_TEXT_MAX_LENGTH = 1000;
const AI_RECOVERY_TIMEOUT_MS = 8_000;
const AI_REQUEST_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type AiRequestRecoveryResult =
  | { kind: 'found'; proposal: AiProposalResponse }
  | { kind: 'not-found' }
  | { kind: 'not-ready' };

interface AiRequestRecoveryOptions {
  signal?: AbortSignal;
  maxAttempts?: number;
  retryDelayMs?: number;
}

export function isValidAiRequestId(requestId: string): boolean {
  return AI_REQUEST_ID_PATTERN.test(requestId);
}

export async function getAiRequest(
  requestId: string,
  signal?: AbortSignal,
): Promise<AiProposalResponse> {
  if (!isValidAiRequestId(requestId)) {
    throw new Error('Invalid AI request ID.');
  }

  const response = await api.get<AiProposalResponse>(
    `/api/ai/requests/${encodeURIComponent(requestId)}`,
    undefined,
    signal,
    AI_RECOVERY_TIMEOUT_MS,
  );

  return response.data;
}

function waitForRetry(delayMs: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Recovery cancelled.', 'AbortError'));
      return;
    }

    const handleAbort = () => {
      window.clearTimeout(timeoutId);
      reject(new DOMException('Recovery cancelled.', 'AbortError'));
    };
    const timeoutId = window.setTimeout(() => {
      signal?.removeEventListener('abort', handleAbort);
      resolve();
    }, delayMs);
    signal?.addEventListener('abort', handleAbort, { once: true });
  });
}

export async function recoverAiRequest(
  requestId: string,
  options: AiRequestRecoveryOptions = {},
): Promise<AiRequestRecoveryResult> {
  const { signal, maxAttempts = 3, retryDelayMs = 500 } = options;
  const boundedAttempts = Math.max(1, Math.min(maxAttempts, 5));

  for (let attempt = 1; attempt <= boundedAttempts; attempt += 1) {
    try {
      const proposal = await getAiRequest(requestId, signal);
      return { kind: 'found', proposal };
    } catch (error) {
      if (signal?.aborted) throw error;
      if (!(error instanceof ApiClientError)) throw error;
      if (error.status === 404) return { kind: 'not-found' };
      if (error.status !== 409) throw error;
      if (attempt === boundedAttempts) return { kind: 'not-ready' };
      await waitForRetry(retryDelayMs, signal);
    }
  }

  return { kind: 'not-ready' };
}

export async function submitAiTextRequest(
  text: string,
  language: AiLanguage,
): Promise<AiProposalResponse> {
  const normalizedText = text.trim();

  if (
    normalizedText.length < AI_TEXT_MIN_LENGTH ||
    normalizedText.length > AI_TEXT_MAX_LENGTH
  ) {
    throw new Error(
      `AI request text must be between ${AI_TEXT_MIN_LENGTH} and ${AI_TEXT_MAX_LENGTH} characters.`,
    );
  }

  const request: PublicAiTextRequest = {
    contractVersion: AI_CONTRACT_VERSION,
    clientRequestId: globalThis.crypto?.randomUUID?.(),
    input: {
      modality: 'text',
      text: normalizedText,
      language,
    },
  };

  const response = await api.post<AiProposalResponse>('/api/ai/requests', request);

  if (!response.data) {
    throw new Error('The ERP backend returned an empty AI proposal response.');
  }

  return response.data;
}

export function formatAiProposalText(
  response: AiProposalResponse,
  language: AiLanguage,
): string {
  const isBangla = language === 'bn' || language === 'bn-BD';
  const confidence = Math.round(response.proposal.confidence * 100);
  const missing = response.missingFields.length > 0
    ? response.missingFields.join(', ')
    : isBangla ? 'নেই' : 'None';
  const expiryLine = response.expiresAt
    ? (isBangla ? 'প্রস্তাবের মেয়াদ' : 'Proposal expires') +
      ': ' +
      new Date(response.expiresAt).toLocaleString(
        isBangla ? 'bn-BD' : 'en-US',
      )
    : null;
  const groundingLines = formatGroundingLines(response, isBangla);
  let statusLine: string;
  let safetyLine: string;

  switch (response.status) {
    case 'REJECTED':
      statusLine = isBangla ? 'প্রস্তাব প্রত্যাখ্যাত — এই কাজ অনুমোদিত নয়।' : 'Proposal rejected — this action is not allowed.';
      safetyLine = isBangla
        ? 'কোনো কাজ বা লেনদেন সম্পন্ন হয়নি। এই অনুরোধটি এগিয়ে নেওয়া যাবে না।'
        : 'Nothing has been executed. This request cannot proceed.';
      break;
    case 'NEEDS_CLARIFICATION':
      statusLine = isBangla ? 'আরও তথ্য প্রয়োজন।' : 'Clarification is needed.';
      safetyLine = isBangla
        ? 'কোনো কাজ সম্পন্ন হয়নি। অসম্পূর্ণ তথ্য দিন; ভবিষ্যৎ প্রস্তাবেও অনুমোদিত নিশ্চিতকরণ লাগবে।'
        : 'Nothing has been executed. Provide the missing information; any future proposal still requires authorized confirmation.';
      break;
    case 'PROPOSED':
      statusLine = isBangla ? 'খসড়া প্রস্তাব।' : 'Draft proposal.';
      safetyLine = isBangla
        ? 'শুধু খসড়া — কোনো লেনদেন সম্পন্ন হয়নি। অনুমোদিত নিশ্চিতকরণ আবশ্যক।'
        : 'Draft only — nothing has been executed. Authorized confirmation is required.';
      break;
  }

  return [
    response.proposal.summary,
    '',
    statusLine,
    (isBangla ? 'আত্মবিশ্বাস' : 'Confidence') + ': ' + confidence + '%',
    (isBangla ? 'অসম্পূর্ণ তথ্য' : 'Missing fields') + ': ' + missing,
    expiryLine,
    ...groundingLines,
    '',
    safetyLine,
  ].filter((line): line is string => line !== null).join('\n');
}

function formatGroundingLines(
  response: AiProposalResponse,
  isBangla: boolean,
): string[] {
  if (!response.grounding) return [];

  const lines = [
    '',
    (isBangla ? 'ERP à¦—à§à¦°à¦¾à¦‰à¦¨à§à¦¡à¦¿à¦‚' : 'ERP grounding') +
      ': ' +
      response.grounding.status,
  ];

  for (const resolution of response.grounding.resolutions) {
    if (resolution.status === 'RESOLVED') continue;
    const candidates = resolution.candidates
      .map((candidate) => candidate.label)
      .join(', ');
    lines.push(
      '- ' +
        resolution.entityType +
        ' "' +
        resolution.input +
        '": ' +
        resolution.status +
        (candidates ? ' (' + candidates + ')' : ''),
    );
  }

  if (response.grounding.citations.length > 0) {
    lines.push(isBangla ? 'à¦‰à§Žà¦¸:' : 'Sources:');
  }
  for (const citation of response.grounding.citations) {
    const facts = citation.facts
      .filter((fact) => fact.value !== null)
      .slice(0, 4)
      .map((fact) => fact.field + '=' + String(fact.value))
      .join(', ');
    lines.push(
      '- [' +
        citation.sourceType +
        '] ' +
        citation.label +
        (facts ? ' â€” ' + facts : '') +
        ' (' +
        citation.href +
        ')',
    );
  }

  return lines;
import { api } from '@/lib/api-client';
import {
  AI_CONTRACT_VERSION,
  type AiLanguage,
  type AiProposalResponse,
  type PublicAiTextRequest,
} from '@/types/ai-gateway';

const AI_TEXT_MIN_LENGTH = 2;
const AI_TEXT_MAX_LENGTH = 1000;

export async function submitAiTextRequest(
  text: string,
  language: AiLanguage,
): Promise<AiProposalResponse> {
  const normalizedText = text.trim();

  if (
    normalizedText.length < AI_TEXT_MIN_LENGTH ||
    normalizedText.length > AI_TEXT_MAX_LENGTH
  ) {
    throw new Error(
      `AI request text must be between ${AI_TEXT_MIN_LENGTH} and ${AI_TEXT_MAX_LENGTH} characters.`,
    );
  }

  const request: PublicAiTextRequest = {
    contractVersion: AI_CONTRACT_VERSION,
    clientRequestId: globalThis.crypto?.randomUUID?.(),
    input: {
      modality: 'text',
      text: normalizedText,
      language,
    },
  };

  const response = await api.post<AiProposalResponse>('/ai/requests', request);

  if (!response.data) {
    throw new Error('The ERP backend returned an empty AI proposal response.');
  }

  return response.data;
}

export function formatAiProposalText(
  response: AiProposalResponse,
  language: AiLanguage,
): string {
  const isBangla = language === 'bn' || language === 'bn-BD';
  const confidence = Math.round(response.proposal.confidence * 100);
  const missing = response.missingFields.length > 0
    ? response.missingFields.join(', ')
    : isBangla ? 'নেই' : 'None';
  let statusLine: string;
  let safetyLine: string;

  switch (response.status) {
    case 'REJECTED':
      statusLine = isBangla ? 'প্রস্তাব প্রত্যাখ্যাত — এই কাজ অনুমোদিত নয়।' : 'Proposal rejected — this action is not allowed.';
      safetyLine = isBangla
        ? 'কোনো কাজ বা লেনদেন সম্পন্ন হয়নি। এই অনুরোধটি এগিয়ে নেওয়া যাবে না।'
        : 'Nothing has been executed. This request cannot proceed.';
      break;
    case 'NEEDS_CLARIFICATION':
      statusLine = isBangla ? 'আরও তথ্য প্রয়োজন।' : 'Clarification is needed.';
      safetyLine = isBangla
        ? 'কোনো কাজ সম্পন্ন হয়নি। অসম্পূর্ণ তথ্য দিন; ভবিষ্যৎ প্রস্তাবেও অনুমোদিত নিশ্চিতকরণ লাগবে।'
        : 'Nothing has been executed. Provide the missing information; any future proposal still requires authorized confirmation.';
      break;
    case 'PROPOSED':
      statusLine = isBangla ? 'খসড়া প্রস্তাব।' : 'Draft proposal.';
      safetyLine = isBangla
        ? 'শুধু খসড়া — কোনো লেনদেন সম্পন্ন হয়নি। অনুমোদিত নিশ্চিতকরণ আবশ্যক।'
        : 'Draft only — nothing has been executed. Authorized confirmation is required.';
      break;
  }

  return [
    response.proposal.summary,
    '',
    statusLine,
    (isBangla ? 'আত্মবিশ্বাস' : 'Confidence') + ': ' + confidence + '%',
    (isBangla ? 'অসম্পূর্ণ তথ্য' : 'Missing fields') + ': ' + missing,
    '',
    safetyLine,
  ].join('\n');
}
