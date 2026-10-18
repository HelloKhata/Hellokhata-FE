"use client";
import Ajv from "ajv";
import type { SchemaCompiler } from "../types/ai-integration/generic-tool.contract";
import { useSessionStore } from "../stores/sessionStore";
import { useBranchStore } from "../stores/branchStore";
import { ERP_API_BASE_URL } from "../lib/api-url";
import { fetchWithSessionRefresh } from "./ai-v2.auth";

const validator = new Ajv({
  strict: true,
  allErrors: false,
  coerceTypes: false,
  useDefaults: false,
  removeAdditional: false,
});
export const compileBrowserContract: SchemaCompiler = (schema) => {
  const validate = validator.compile(schema);
  return (value: unknown) => validate(value) === true;
};

/** Public STT proxy only: browser never receives the AI engine API key.
 * Legacy STT response has no owned transcript ID; explicit Send submits reviewed
 * text rather than inventing a transcript binding. */
export async function transcribeRecordedAudio(
  audio: Blob,
  signal: AbortSignal,
): Promise<string> {
  if (!audio.size || audio.size > 25 * 1024 * 1024)
    throw new Error("INVALID_AUDIO_SIZE");
  const session = useSessionStore.getState();
  if (!session.token) throw new Error("AUTH_REQUIRED");
  const branch = useBranchStore.getState().currentBranchId;
  const body = new FormData();
  const mime = audio.type.split(";")[0];
  const suffix =
    mime === "audio/ogg"
      ? "ogg"
      : mime === "audio/mpeg"
        ? "mp3"
        : mime === "audio/wav"
          ? "wav"
          : "webm";
  body.append("file", new File([audio], "recording." + suffix, { type: mime }));
  body.append("language", "bn-BD");
  const response = await fetchWithSessionRefresh(
    ERP_API_BASE_URL.replace(/\/$/, "") + "/ai/speech-to-text",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + session.token,
        ...(branch === undefined ? {} : { "x-branch-id": branch ?? "" }),
      },
      body,
      signal,
    },
  );
  if (!response.ok) throw new Error("STT_REQUEST_FAILED_" + response.status);
  const reader = response.body?.getReader();
  if (!reader) throw new Error("EMPTY_STT_RESPONSE");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.byteLength;
      if (size > 65536) {
        await reader.cancel();
        throw new Error("STT_RESPONSE_TOO_LARGE");
      }
      chunks.push(part.value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  const raw: unknown = JSON.parse(new TextDecoder().decode(bytes));
  if (
    !raw ||
    typeof raw !== "object" ||
    !("success" in raw) ||
    raw.success !== true ||
    !("data" in raw) ||
    !raw.data ||
    typeof raw.data !== "object" ||
    !("transcript" in raw.data) ||
    typeof raw.data.transcript !== "string" ||
    !raw.data.transcript.trim() ||
    [...raw.data.transcript].length > 4000
  )
    throw new Error("INVALID_STT_RESPONSE");
  return raw.data.transcript.trim();
}

export function createRecordedAudio(
  onAudio: (audio: Blob) => void,
  onError: (code: string) => void,
) {
  let recorder: MediaRecorder | undefined,
    stream: MediaStream | undefined,
    timer: ReturnType<typeof setTimeout> | undefined;
  let generation = 0,
    disposed = false,
    starting = false;
  const cleanup = () => {
    if (timer) clearTimeout(timer);
    stream?.getTracks().forEach((track) => track.stop());
    stream = undefined;
  };
  return {
    async start() {
      if (starting || recorder) throw new Error("RECORDING_ALREADY_STARTED");
      starting = true;
      try {
        const current = ++generation;
        if (
          disposed ||
          !navigator.mediaDevices?.getUserMedia ||
          typeof MediaRecorder === "undefined"
        )
          throw new Error("AUDIO_RECORDING_UNAVAILABLE");
        const captured = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        if (disposed || current !== generation) {
          captured.getTracks().forEach((track) => track.stop());
          return;
        }
        stream = captured;
        const mimeType = [
          "audio/webm;codecs=opus",
          "audio/webm",
          "audio/ogg;codecs=opus",
        ].find((mime) => MediaRecorder.isTypeSupported(mime));
        if (!mimeType) {
          cleanup();
          throw new Error("SUPPORTED_AUDIO_FORMAT_UNAVAILABLE");
        }
        recorder = new MediaRecorder(captured, { mimeType });
        const chunks: Blob[] = [];
        let size = 0,
          rejected = false;
        recorder.ondataavailable = (event) => {
          if (!event.data.size || rejected) return;
          size += event.data.size;
          if (size > 25 * 1024 * 1024) {
            rejected = true;
            recorder?.stop();
            cleanup();
            if (!disposed && current === generation) onError("AUDIO_TOO_LARGE");
            return;
          }
          chunks.push(event.data);
        };
        recorder.onerror = () => {
          rejected = true;
          const failedRecorder = recorder;
          cleanup();
          recorder = undefined;
          if (failedRecorder?.state === "recording") failedRecorder.stop();
          if (!disposed && current === generation) onError("RECORDING_FAILED");
        };
        recorder.onstop = () => {
          if (current !== generation) {
            captured.getTracks().forEach((track) => track.stop());
            return;
          }
          cleanup();
          recorder = undefined;
          if (!rejected && !disposed && current === generation)
            onAudio(new Blob(chunks, { type: mimeType.split(";")[0] }));
        };
        recorder.start(1000);
        timer = setTimeout(() => {
          if (recorder?.state === "recording") recorder.stop();
        }, 120000);
      } catch (failure) {
        cleanup();
        recorder = undefined;
        throw failure;
      } finally {
        starting = false;
      }
    },
    stop() {
      if (recorder?.state === "recording") recorder.stop();
    },
    dispose() {
      disposed = true;
      generation++;
      if (recorder?.state === "recording") recorder.stop();
      cleanup();
    },
  };
}
