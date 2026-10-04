"use client";
import { useEffect, useRef, useState } from "react";
import type { GenericChatState } from "../../types/ai-integration/generic-chat.state";
import type { JsonObject } from "../../types/ai-integration/generic-tool.contract";
import { createErpV2Transport } from "../../services/ai-v2.services";
import { createV2StateClient } from "../../services/ai-v2.state-client";
import {
  compileBrowserContract,
  createRecordedAudio,
  transcribeRecordedAudio,
} from "../../services/ai-v2.browser";
import { useSessionStore } from "../../stores/sessionStore";
import { useBranchStore } from "../../stores/branchStore";
import { SchemaReviewForm } from "./SchemaReviewForm";
import { ReportTable } from "./ReportTable";
import { getReviewSchema } from "../../services/ai-v2.schema";
import { loadRecovery, saveRecovery } from "../../services/ai-v2.recovery";
import type { RecoveryTarget } from "../../services/ai-v2.state-client";
import type {
  ReportPresentation,
  ToolSchema,
} from "../../types/ai-integration/generic-tool.contract";

/** Canonical ERP assistant: voice is preview-only; all execution is ERP-authorized. */
export function V2InvoiceChat() {
  const [state, setState] = useState<GenericChatState>({ kind: "IDLE" });
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [audioState, setAudioState] = useState<
    "IDLE" | "STARTING" | "RECORDING" | "TRANSCRIBING"
  >("IDLE");
  const [clarification, setClarification] = useState("");
  const [candidates, setCandidates] = useState<{ id: string; label: string }[]>(
    [],
  );
  const [reports, setReports] = useState<ReportPresentation[]>([]);
  const [reviewSchema, setReviewSchema] = useState<ToolSchema>();
  const [recoveryTarget, setRecoveryTarget] = useState<RecoveryTarget>();
  const [messages, setMessages] = useState<
    { role: string; text: string; id: string }[]
  >([]);
  const [draftJson, setDraftJson] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const session = useSessionStore((s) => s.user?.id + ":" + s.business?.id);
  const branch = useBranchStore((s) => s.currentBranchId);
  const context = session + ":" + branch;
  const contextRef = useRef(context);
  contextRef.current = context;
  const requestContext = useRef<string | undefined>(undefined);
  const restoredContext = useRef<string | undefined>(undefined);
  const [submittedContext, setSubmittedContext] = useState<string | undefined>(
    undefined,
  );
  const recordingContext = useRef<string | undefined>(undefined);
  const clientRef = useRef<ReturnType<typeof createV2StateClient> | null>(null);
  const audioRef = useRef<ReturnType<typeof createRecordedAudio> | null>(null);
  const audioAbort = useRef<AbortController | null>(null);
  const mounted = useRef(true);
  const sequence = useRef(0);
  const [responseDetails, setResponseDetails] = useState("");
  // A conversation's durable identity is not a request generation or transcript.
  const conversation = useRef<string | undefined>(undefined);
  useEffect(() => {
    mounted.current = true;
    const transport = createErpV2Transport(compileBrowserContract);
    clientRef.current = createV2StateClient(
      transport,
      (next) => {
        if (
          mounted.current &&
          (!requestContext.current ||
            requestContext.current === contextRef.current)
        ) {
          setState(next);
          if (next.kind === "ACTION_REVIEW")
            setDraftJson(JSON.stringify(next.action.call.arguments, null, 2));
        }
      },
      undefined,
      (response) => {
        if (!mounted.current || requestContext.current !== contextRef.current)
          return;
        conversation.current = response.conversationId;
        if (response.kind === "ANSWER") {
          setReports(response.reports ?? []);
          setMessages((previous) =>
            [
              ...previous,
              {
                role: "assistant",
                text: response.text,
                id: response.requestId,
              },
            ].slice(-30),
          );
        }
        if (response.kind === "CLARIFICATION")
          setClarification(
            response.question +
              (response.candidates.length
                ? "\n" +
                  response.candidates
                    .map((c) => c.label + " [" + c.id + "]")
                    .join("\n")
                : ""),
          );
        setResponseDetails(JSON.stringify(response, null, 2));
        if (response.kind === "CLARIFICATION") {
          setClarification(response.question);
          setCandidates(response.candidates);
        }
      },
      (target) => {
        setRecoveryTarget(target);
        saveRecovery(requestContext.current ?? contextRef.current, target);
      },
    );
    audioRef.current = createRecordedAudio(
      async (audio) => {
        const attempt = ++sequence.current,
          capturedContext = recordingContext.current;
        if (capturedContext !== contextRef.current) {
          setAudioState("IDLE");
          setError("RECORDING_CONTEXT_CHANGED");
          return;
        }
        audioAbort.current?.abort();
        audioAbort.current = new AbortController();
        const controller = audioAbort.current;
        const timeout = setTimeout(() => controller.abort(), 45000);
        setAudioState("TRANSCRIBING");
        try {
          const transcript = await transcribeRecordedAudio(
            audio,
            controller.signal,
          );
          if (
            mounted.current &&
            attempt === sequence.current &&
            capturedContext === contextRef.current
          )
            setText(transcript);
        } catch (failure) {
          if (mounted.current && attempt === sequence.current)
            setError(
              failure instanceof Error
                ? failure.message
                : "TRANSCRIPTION_FAILED",
            );
        } finally {
          clearTimeout(timeout);
          if (mounted.current && attempt === sequence.current)
            setAudioState("IDLE");
        }
      },
      (code) => {
        if (mounted.current) {
          setError(code);
          setAudioState("IDLE");
        }
      },
    );
    const clock = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      mounted.current = false;
      restoredContext.current = undefined;
      sequence.current++;
      clearInterval(clock);
      audioAbort.current?.abort();
      audioRef.current?.dispose();
      clientRef.current?.cancel();
    };
  }, []);
  useEffect(() => {
    if (session.includes("undefined")) return;
    const previousContext = requestContext.current;
    const confirmationMayBeInFlight =
      state.kind === "PROCESSING" ||
      state.kind === "CONFIRMING" ||
      state.kind === "RECOVERING" ||
      (state.kind === "FAILED" && Boolean(recoveryTarget?.actionId));
    if (previousContext && previousContext !== context) {
      // Never move an uncertain request across a business/branch boundary.
      if (confirmationMayBeInFlight) return;
      clientRef.current?.cancel();
      requestContext.current = undefined;
      conversation.current = undefined;
      setSubmittedContext(undefined);
      setState({ kind: "IDLE" });
      setText("");
      setError("");
      setClarification("");
      setCandidates([]);
      setReports([]);
      setReviewSchema(undefined);
      setRecoveryTarget(undefined);
      setMessages([]);
      setDraftJson("");
      setResponseDetails("");
    }
    // Restore only on mount/context entry, not on every state transition.
    // Otherwise saving a new request aborts its POST and starts GET recovery
    // before the ERP has finished processing it.
    if (restoredContext.current === context) return;
    restoredContext.current = context;
    const saved = loadRecovery(context);
    if (!saved || !clientRef.current) return;
    requestContext.current = context;
    setSubmittedContext(context);
    void clientRef.current.restore(saved);
  }, [context, session, state.kind, recoveryTarget?.actionId]);
  const contextChanged =
    submittedContext !== undefined && submittedContext !== context;
  const idle =
    [
      "IDLE",
      "ANSWER",
      "COMPLETED",
      "FAILED",
      "ACTION_CLOSED",
      "CLARIFICATION",
    ].includes(state.kind) &&
    !(state.kind === "FAILED" && Boolean(recoveryTarget?.actionId));
  const run = async (work: () => Promise<unknown>) => {
    setError("");
    try {
      await work();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "REQUEST_FAILED");
    }
  };
  const submit = () =>
    run(async () => {
      if (
        !idle ||
        audioState !== "IDLE" ||
        !text.trim() ||
        contextChanged ||
        !clientRef.current
      )
        return;
      requestContext.current = context;
      setSubmittedContext(context);
      const input = text.trim();
      setReports([]);
      setCandidates([]);
      setMessages((previous) =>
        [
          ...previous,
          { role: "user", text: input, id: crypto.randomUUID() },
        ].slice(-30),
      );
      await clientRef.current.submit({
        contractVersion: "2.0.0",
        clientRequestId: crypto.randomUUID(),
        ...(conversation.current
          ? { conversationId: conversation.current }
          : {}),
        ...(state.kind === "CLARIFICATION"
          ? {
              conversationId: state.conversationId,
              clarificationId: state.clarificationId,
            }
          : {}),
        input: { modality: "text", text: input, language: "bn-BD" },
      });
      if (clientRef.current.getState().kind !== "FAILED") setText("");
    });
  const start = () =>
    run(async () => {
      if (!idle || audioState !== "IDLE" || contextChanged) return;
      setAudioState("STARTING");
      recordingContext.current = context;
      try {
        await audioRef.current?.start();
        if (mounted.current) setAudioState("RECORDING");
      } catch (failure) {
        setAudioState("IDLE");
        throw failure;
      }
    });
  const review = state.kind === "ACTION_REVIEW" ? state.action : undefined;
  const expired = review ? review.expiresAtMs <= now : false;
  const editedDraft = Boolean(
    review &&
    JSON.stringify(JSON.parse(draftJson || "{}")) !==
      JSON.stringify(review.call.arguments),
  );
  useEffect(() => {
    setReviewSchema(undefined);
    if (!review || contextChanged) return;
    const abort = new AbortController(),
      timer = setTimeout(() => abort.abort(), 10000);
    void getReviewSchema(review.call.name, review.call.version, abort.signal)
      .then((value) => {
        if (!abort.signal.aborted) setReviewSchema(value);
      })
      .catch(() => {
        if (!abort.signal.aborted)
          setError("এই draft-এর edit form পাওয়া যায়নি।");
      })
      .finally(() => clearTimeout(timer));
    return () => {
      clearTimeout(timer);
      abort.abort();
    };
  }, [review, contextChanged]);
  return (
    <section
      className="mx-auto max-w-3xl space-y-4 p-6"
      aria-label="ERP AI assistant"
    >
      <h1 className="text-2xl font-semibold">
        AI সহকারী — Sales, Purchase, Reports, Customer, Product, Inventory
      </h1>
      <p>
        Voice → transcript review → Send → কাজের review → explicit Confirm.
        Voice record বা text পাঠালেই কোনো লেনদেন execute হবে না।
      </p>
      {contextChanged && (
        <p role="alert">
          User/business/branch changed. Restore the original context to recover
          this request. Do not assume an interrupted confirmation failed.
        </p>
      )}
      {error && <p role="alert">{error}</p>}
      <div role="log" aria-label="কথোপকথন" className="space-y-2">
        {messages.map((message) => (
          <p key={message.id} className="whitespace-pre-wrap">
            <span className="font-semibold">
              {message.role === "user" ? "আপনি: " : "AI: "}
            </span>
            {message.text}
          </p>
        ))}
      </div>
      <p role="status" aria-live="polite">
        {state.kind} · Audio: {audioState}
      </p>
      {state.kind === "CLARIFICATION" && (
        <pre className="whitespace-pre-wrap rounded border p-3">
          {clarification || "Provide the requested missing information."}
        </pre>
      )}
      {state.kind === "CLARIFICATION" && (
        <div role="group" aria-label="নির্বাচন করুন">
          {candidates.map((candidate) => (
            <button
              key={candidate.id}
              type="button"
              disabled={contextChanged}
              className="m-1 rounded border p-2"
              onClick={() =>
                setText(candidate.label + " [" + candidate.id + "]")
              }
            >
              {candidate.label}
            </button>
          ))}
        </div>
      )}
      <label className="block">
        Text / editable transcript
        <textarea
          className="mt-2 w-full rounded border p-3"
          aria-label="Text or transcript"
          value={text}
          maxLength={4000}
          onChange={(event) => setText(event.target.value)}
          disabled={!idle || audioState !== "IDLE" || contextChanged}
          rows={4}
        />
      </label>
      <div className="flex gap-3">
        <button
          type="button"
          className="rounded border px-4 py-2"
          onClick={start}
          disabled={!idle || audioState !== "IDLE" || contextChanged}
        >
          Record voice
        </button>
        <button
          type="button"
          className="rounded border px-4 py-2"
          onClick={() => audioRef.current?.stop()}
          disabled={audioState !== "RECORDING"}
        >
          Stop & transcribe
        </button>
        <button
          type="button"
          className="rounded border px-4 py-2"
          onClick={submit}
          disabled={
            !idle || audioState !== "IDLE" || !text.trim() || contextChanged
          }
        >
          Send
        </button>
      </div>
      {review && (
        <div className="space-y-3 rounded border p-4">
          <h2 className="font-semibold">
            Review: {review.call.name} · version {review.version}
          </h2>
          <p className="whitespace-pre-wrap">{review.summary}</p>
          <pre className="overflow-auto whitespace-pre-wrap">
            {JSON.stringify(review.call.arguments, null, 2)}
          </pre>
          <p>
            {expired
              ? "Expired: request a fresh review."
              : "Nothing executed yet. Check exact records, quantities, prices, payments and date before confirming."}
          </p>
          {expired && !contextChanged && (
            <button
              type="button"
              className="rounded border px-4 py-2"
              onClick={() => {
                clientRef.current?.cancel();
                conversation.current = undefined;
                setResponseDetails("");
              }}
            >
              Start a fresh request — expired draft will not execute
            </button>
          )}
          {reviewSchema && (
            <SchemaReviewForm
              schema={reviewSchema}
              value={JSON.parse(draftJson || "{}") as JsonObject}
              onChange={(value) => setDraftJson(JSON.stringify(value))}
              disabled={contextChanged || expired}
            />
          )}
          <div className="flex gap-3">
            <button
              type="button"
              className="rounded border px-4 py-2"
              disabled={expired || contextChanged || editedDraft}
              onClick={() =>
                run(() => clientRef.current!.confirm(crypto.randomUUID()))
              }
            >
              Confirm
            </button>
            {editedDraft && (
              <p>
                পরিবর্তন save করে নতুন ERP summary review করুন, তারপর Confirm
                করুন।
              </p>
            )}
            <button
              type="button"
              className="rounded border px-4 py-2"
              disabled={expired || contextChanged}
              onClick={() =>
                run(async () => {
                  const edited: unknown = JSON.parse(draftJson);
                  if (
                    !reviewSchema ||
                    !compileBrowserContract(reviewSchema)(edited)
                  )
                    throw new Error("INVALID_DRAFT_ARGUMENTS");
                  if (
                    !edited ||
                    typeof edited !== "object" ||
                    Array.isArray(edited)
                  )
                    throw new Error("OBJECT_ARGUMENTS_REQUIRED");
                  await clientRef.current!.edit(
                    edited as JsonObject,
                    crypto.randomUUID(),
                  );
                })
              }
            >
              Save edit & review again
            </button>
            <button
              type="button"
              className="rounded border px-4 py-2"
              disabled={expired || contextChanged}
              onClick={() =>
                run(() => clientRef.current!.reject(crypto.randomUUID()))
              }
            >
              Reject
            </button>
          </div>
        </div>
      )}
      {(state.kind === "RECOVERING" ||
        state.kind === "PROCESSING" ||
        (state.kind === "FAILED" && recoveryTarget)) && (
        <button
          type="button"
          className="rounded border px-4 py-2"
          disabled={contextChanged}
          onClick={() => run(() => clientRef.current!.recover())}
        >
          Check authoritative status — no retry execution
        </button>
      )}
      {state.kind === "ANSWER" && (
        <div>
          <p>
            এই request-এ কোনো পরিবর্তন execute হয়নি। তথ্যভিত্তিক উত্তর execution
            receipt নয়।
          </p>
          <p className="whitespace-pre-wrap">{state.text}</p>
        </div>
      )}
      {state.kind === "ANSWER" &&
        reports.map((report) => (
          <ReportTable
            key={report.toolCallId}
            report={report}
            followUp={setText}
            disabled={!idle || contextChanged}
          />
        ))}
      {state.kind === "COMPLETED" && (
        <div>
          <h2>ERP execution receipt</h2>
          <dl>
            <dt>অবস্থা / Status</dt>
            <dd>{state.receipt.status}</dd>
            <dt>Operation ID</dt>
            <dd>{state.receipt.operationId}</dd>
            <dt>সময় / Completed</dt>
            <dd>
              {new Date(state.receipt.completedAtMs).toLocaleString("bn-BD")}
            </dd>
            <dt>Action version</dt>
            <dd>{state.receipt.actionVersion}</dd>
          </dl>
          <pre className="overflow-auto whitespace-pre-wrap">
            {JSON.stringify(state.receipt, null, 2)}
          </pre>
        </div>
      )}
      {state.kind === "ACTION_CLOSED" && (
        <p>
          {state.outcome.status}: {state.outcome.executionOutcome}
        </p>
      )}
      {state.kind === "FAILED" && <p role="alert">{state.code}</p>}
      {responseDetails && (
        <details>
          <summary>Last structured response</summary>
          <pre className="overflow-auto whitespace-pre-wrap">
            {responseDetails}
          </pre>
        </details>
      )}
    </section>
  );
}
