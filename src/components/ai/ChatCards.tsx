"use client";

import { useEffect, useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import {
  AlertCircle,
  ArrowUpRight,
  Bot,
  Check,
  CheckCircle2,
  Copy,
  FileText,
  Package,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "../ui/button";
import type {
  JsonObject,
  JsonValue,
  PublicChatResponse,
  PendingAction,
} from "../../types/ai-integration/generic-tool.contract";
import { ReportTable } from "./ReportTable";
import {
  businessFields,
  readableSummary,
  reviewPresentation,
  operationTitle,
  reportSummary,
} from "./chat-presentation";
import { useSessionStore } from "../../stores/sessionStore";

export const humanize = (key: string) =>
  key
    .replace(/([a-z\d])([A-Z])/g, "$1 $2")
    .replace(/[_.-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

/** Render arbitrary ERP fields without interpreting them as HTML or authority. */
export function StructuredDetails({
  value,
  depth = 0,
  fieldKey = "",
}: {
  value: JsonValue;
  depth?: number;
  fieldKey?: string;
}) {
  const currency = useSessionStore(
    (state) => state.business?.currency ?? "BDT",
  );
  value = businessFields(value);
  if (Array.isArray(value))
    value = value.filter(
      (entry) =>
        entry !== null &&
        (typeof entry !== "object" || Object.keys(entry).length > 0),
    );
  if (value && typeof value === "object" && Object.keys(value).length === 0)
    return <span className="text-muted-foreground">No additional details</span>;
  if (value === null || value === undefined)
    return <span className="text-muted-foreground">Not specified</span>;
  if (depth > 6)
    return (
      <span className="text-muted-foreground">Additional nested details</span>
    );
  if (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (entry) =>
        entry &&
        typeof entry === "object" &&
        !Array.isArray(entry) &&
        Object.values(entry).every(
          (cell) => cell === null || typeof cell !== "object",
        ),
    )
  ) {
    const rows = value as JsonObject[];
    const columns = [...new Set(rows.flatMap((row) => Object.keys(row)))];
    return (
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Operation line items</caption>
          <thead className="bg-muted/50">
            <tr>
              {columns.map((key) => (
                <th
                  key={key}
                  scope="col"
                  className="whitespace-nowrap px-3 py-2 text-xs font-medium text-muted-foreground"
                >
                  {humanize(key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-t border-border">
                {columns.map((key) => (
                  <td
                    key={key}
                    className="min-w-20 max-w-[20rem] px-3 py-3 tabular-nums"
                  >
                    <StructuredDetails
                      value={row[key] ?? null}
                      depth={depth + 1}
                      fieldKey={key}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (Array.isArray(value))
    return (
      <div className="space-y-3">
        {value.map((entry, index) => (
          <div
            key={index}
            className="rounded-xl border border-border bg-background/40 p-3"
          >
            <StructuredDetails value={entry} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  if (typeof value === "object")
    return (
      <dl className="grid min-w-0 gap-x-5 gap-y-3 sm:grid-cols-2">
        {Object.entries(value).map(([key, entry]) => (
          <div
            key={key}
            className={
              entry && typeof entry === "object"
                ? "col-span-full min-w-0"
                : "min-w-0"
            }
          >
            <dt className="mb-1 text-xs font-medium text-muted-foreground">
              {humanize(key)}
            </dt>
            <dd className="break-words text-sm font-medium text-foreground">
              <StructuredDetails
                value={entry}
                depth={depth + 1}
                fieldKey={key}
              />
            </dd>
          </div>
        ))}
      </dl>
    );
  return (
    <span className="break-all">
      {typeof value === "number"
        ? new Intl.NumberFormat(
            "en-BD",
            /(?:amount|total|price|cost|discount|tax|charges|balance)$/i.test(
              fieldKey,
            )
              ? {
                  style: "currency",
                  currency: /^[A-Z]{3}$/.test(currency) ? currency : "BDT",
                }
              : { maximumFractionDigits: 3 },
          ).format(value)
        : typeof value === "boolean"
          ? value
            ? "Yes"
            : "No"
          : String(value)}
    </span>
  );
}

export function WelcomeScreen({
  suggest,
  disabled,
}: {
  suggest: (text: string) => void;
  disabled: boolean;
}) {
  const suggestions = [
    {
      icon: TrendingUp,
      title: "Sales overview",
      hint: "See how your business is doing",
      text: "Show today's sales report.",
    },
    {
      icon: Package,
      title: "Check inventory",
      hint: "Find products and available stock",
      text: "Show available rice stock.",
    },
    {
      icon: FileText,
      title: "Prepare a purchase",
      hint: "Start with your supplier and items",
      text: "Help me prepare a purchase.",
    },
    {
      icon: Users,
      title: "Find a customer",
      hint: "Look up details and balances",
      text: "Find a customer named Sabet.",
    },
  ];
  return (
    <div className="mx-auto flex w-full max-w-[42rem] flex-col items-center px-2 py-4 text-center sm:py-6">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 shadow-sm">
        <Sparkles className="h-6 w-6 text-primary" />
      </div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        Hello Khata Assistant
      </p>
      <h2 className="max-w-[40rem] text-3xl font-semibold leading-tight tracking-tight text-foreground">
        Your business, one conversation away.
      </h2>
      <p className="mt-4 max-w-[28rem] text-sm leading-6 text-muted-foreground">
        Ask questions, review reports, or prepare a transaction. Type naturally
        or use your voice.
      </p>
      <div className="mt-6 grid w-full gap-3 sm:grid-cols-2">
        {suggestions.map(({ icon: Icon, title, hint, text }) => (
          <button
            key={title}
            type="button"
            disabled={disabled}
            onClick={() => suggest(text)}
            className="group flex min-w-0 items-start gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-foreground">
                {title}
              </span>
              <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                {hint}
              </span>
            </span>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
          </button>
        ))}
      </div>
      <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
        You review and confirm every change.
      </p>
    </div>
  );
}

export interface ChatEntry {
  id: string;
  role: "user" | "assistant";
  text?: string;
  response?: PublicChatResponse;
  createdAt: number;
}

export function ChatMessage({
  entry,
  followUp,
  disabled,
  children,
  reviewedAction,
}: {
  entry: ChatEntry;
  followUp: (text: string) => void;
  disabled: boolean;
  children?: ReactNode;
  reviewedAction?: PendingAction;
}) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);
  const user = entry.role === "user";
  const currency = useSessionStore(
    (state) => state.business?.currency ?? "BDT",
  );
  const response = entry.response;
  const text =
    !user && response?.kind === "ANSWER" && response.reports?.length
      ? reportSummary(response.reports, currency)
      : (entry.text ??
        (response?.kind === "ANSWER" ? response.text : undefined));
  return (
    <article
      className={`flex min-w-0 gap-3 ${user ? "justify-end" : ""}`}
      aria-label={user ? "Your message" : "Assistant message"}
    >
      {!user && (
        <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
          <Bot className="h-4 w-4" />
        </span>
      )}
      <div
        className={`min-w-0 ${user ? "max-w-[88%] sm:max-w-[75%]" : "flex-1"}`}
      >
        <div
          className={`mb-1.5 flex items-center gap-2 text-xs text-muted-foreground ${user ? "justify-end" : ""}`}
        >
          <span className="font-medium">{user ? "You" : "Assistant"}</span>
          <time dateTime={new Date(entry.createdAt).toISOString()}>
            {new Date(entry.createdAt).toLocaleTimeString("en-BD", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
        </div>
        {text && (
          <div
            className={
              user
                ? "rounded-2xl rounded-tr-md bg-primary px-4 py-3 text-sm leading-6 text-primary-foreground"
                : "chat-markdown text-sm leading-7 text-foreground"
            }
          >
            {user ? (
              <p className="whitespace-pre-wrap break-words">{text}</p>
            ) : (
              <ReactMarkdown
                skipHtml
                components={{
                  a: ({ children: content }) => <span>{content}</span>,
                  p: ({ children: content }) => (
                    <p className="mb-3 whitespace-pre-wrap break-words last:mb-0">
                      {content}
                    </p>
                  ),
                  ul: ({ children: content }) => (
                    <ul className="mb-3 list-disc space-y-1 pl-5">{content}</ul>
                  ),
                  ol: ({ children: content }) => (
                    <ol className="mb-3 list-decimal space-y-1 pl-5">
                      {content}
                    </ol>
                  ),
                  code: ({ children: content }) => (
                    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                      {content}
                    </code>
                  ),
                  pre: ({ children: content }) => (
                    <pre className="my-3 max-w-full overflow-auto rounded-xl bg-muted p-3">
                      {content}
                    </pre>
                  ),
                  h1: ({ children: content }) => (
                    <h3 className="mb-2 text-lg font-semibold">{content}</h3>
                  ),
                  h2: ({ children: content }) => (
                    <h3 className="mb-2 text-base font-semibold">{content}</h3>
                  ),
                  h3: ({ children: content }) => (
                    <h3 className="mb-2 font-semibold">{content}</h3>
                  ),
                }}
              >
                {text}
              </ReactMarkdown>
            )}
          </div>
        )}
        {response?.kind === "ANSWER" &&
          response.reports?.map((report) => (
            <div key={report.toolCallId} className="mt-4">
              <ReportTable
                report={report}
                followUp={followUp}
                disabled={disabled}
              />
            </div>
          ))}
        {response?.kind === "PENDING_ACTION" && !children && (
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="mb-2 text-sm font-medium">
              {operationTitle(response.action.call.name)}
            </p>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
              {readableSummary(response.action.summary)}
            </p>
            <details className="mt-3 text-xs text-muted-foreground">
              <summary className="cursor-pointer">Review details</summary>
              <div className="mt-3">
                <StructuredDetails
                  value={reviewPresentation(response.action)}
                />
              </div>
            </details>
            <p className="mt-3 text-xs text-muted-foreground">
              Previous review. Use the current action status below.
            </p>
          </div>
        )}
        {response?.kind === "RECEIPT" && (
          <div className="rounded-2xl border border-[color:var(--emerald)]/25 bg-card p-4 sm:p-5">
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--emerald)]">
              <CheckCircle2 className="h-5 w-5" />
              Transaction completed
            </p>
            <StructuredDetails value={response.receipt.result} />
            {reviewedAction && (
              <details className="mt-4 text-sm">
                <summary className="cursor-pointer text-muted-foreground">
                  Transaction items and payment
                </summary>
                <div className="mt-3">
                  <StructuredDetails
                    value={reviewPresentation(reviewedAction)}
                  />
                </div>
              </details>
            )}
            <p className="mt-4 text-xs text-muted-foreground">
              Completed{" "}
              {new Date(response.receipt.completedAtMs).toLocaleString("en-BD")}
            </p>
          </div>
        )}
        {response?.kind === "ACTION_TERMINAL" && (
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="font-medium">
              {response.outcome.status === "REJECTED"
                ? "Action rejected"
                : response.outcome.status === "EXPIRED"
                  ? "Review expired"
                  : "Action could not be completed"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              The ERP confirmed that this action was not executed.
            </p>
          </div>
        )}
        {children}
        {!user && text && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 h-7 px-2 text-xs text-muted-foreground"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(text);
                setCopied(true);
              } catch {
                setCopied(false);
              }
            }}
            aria-label="Copy assistant response"
          >
            {copied ? <Check /> : <Copy />}
            {copied ? "Copied" : "Copy"}
          </Button>
        )}
      </div>
    </article>
  );
}

const errorMessages: Record<string, string> = {
  AUTH_REQUIRED: "Your session has expired. Sign in again to continue.",
  SELECT_BRANCH_REQUIRED:
    "Choose a branch before continuing. Use your assigned branch in the chat header, then start a new request.",
  AI_STEP_REJECTED:
    "The assistant could not finish this request. Check its status before sending it again.",
  STORAGE_UNAVAILABLE:
    "The service is temporarily unavailable. Check the request status or try again later.",
  REQUEST_REJECTED:
    "The ERP rejected this request. Check your sign-in and permissions before continuing.",
  RECORDING_CONTEXT_CHANGED:
    "Your business or branch changed while recording. Record again in the current branch.",
  RECORDING_FAILED:
    "We could not record your voice. Check your microphone and try again.",
  AUDIO_TOO_LARGE: "This recording is too large. Try a shorter recording.",
  INVALID_DRAFT_ARGUMENTS:
    "Some review fields are invalid. Check the values and save your changes again.",
  REVIEW_FORM_UNAVAILABLE:
    "The edit form could not be loaded. You can still review the original details.",
};
export function ErrorNotice({ code }: { code: string }) {
  const message =
    errorMessages[code] ??
    (code.includes("STT") || code.includes("TRANSCRIPTION")
      ? "Your audio could not be transcribed. Try recording again or type your message."
      : code === "NotAllowedError" || /permission/i.test(code)
        ? "Microphone access was denied. Allow microphone access in your browser and try again."
        : "We could not complete this request. Check the status before repeating a transaction.");
  return (
    <div
      role="alert"
      className="flex gap-3 rounded-xl border border-destructive/25 bg-destructive/5 p-4"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
      <div className="min-w-0">
        <p className="text-sm text-foreground">{message}</p>
        <details className="mt-2 text-xs text-muted-foreground">
          <summary className="cursor-pointer">Technical details</summary>
          <p className="mt-1 break-all">{code}</p>
        </details>
      </div>
    </div>
  );
}
