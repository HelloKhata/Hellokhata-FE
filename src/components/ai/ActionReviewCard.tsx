"use client";

import { Check, Clock3, Pencil, ShieldCheck, X } from "lucide-react";
import { Button } from "../ui/button";
import { StructuredDetails } from "./ChatCards";
import { SchemaReviewForm } from "./SchemaReviewForm";
import {
  readableSummary,
  reviewPresentation,
  operationTitle,
} from "./chat-presentation";
import type {
  JsonObject,
  PendingAction,
  ToolSchema,
} from "../../types/ai-integration/generic-tool.contract";

export function ActionReviewCard({
  action,
  schema,
  draft,
  editing,
  changed,
  expired,
  pending,
  busy,
  canFresh,
  onEdit,
  onDraft,
  onConfirm,
  onReject,
  onSave,
  onFresh,
}: {
  action: PendingAction;
  schema?: ToolSchema;
  draft: JsonObject;
  editing: boolean;
  changed: boolean;
  expired: boolean;
  pending: boolean;
  busy: boolean;
  canFresh: boolean;
  onEdit: () => void;
  onDraft: (value: JsonObject) => void;
  onConfirm: () => void;
  onReject: () => void;
  onSave: () => void;
  onFresh: () => void;
}) {
  const disabled = expired || busy || !pending;
  return (
    <div className="overflow-hidden rounded-2xl border border-primary/25 bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-primary/5 px-4 py-3 sm:px-5">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <ShieldCheck className="h-4 w-4 text-primary" />
          {operationTitle(action.call.name)}
        </p>
        <span className="flex items-center gap-1.5 rounded-full bg-[var(--warning-subtle)] px-2.5 py-1 text-[11px] font-medium text-[var(--warning)]">
          <Clock3 className="h-3 w-3" />
          {!pending
            ? "Checking status"
            : expired
              ? "Expired"
              : "Awaiting confirmation"}
        </span>
      </div>
      <div className="space-y-5 p-4 sm:p-5">
        <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
          {readableSummary(action.summary)}
        </p>
        <StructuredDetails value={reviewPresentation(action)} />
        {editing && schema && (
          <div className="rounded-xl border border-border bg-background/40 p-3">
            <SchemaReviewForm
              schema={schema}
              value={draft}
              onChange={onDraft}
              disabled={disabled}
            />
          </div>
        )}
        {changed && (
          <p className="rounded-lg bg-[var(--warning-subtle)] px-3 py-2 text-xs text-[var(--warning)]">
            Save your changes and review the updated ERP summary before
            confirming.
          </p>
        )}
        <div className="flex flex-wrap gap-2 border-t border-border pt-4">
          <Button disabled={disabled || changed} onClick={onConfirm}>
            <Check className="h-4 w-4" />
            Confirm
          </Button>
          <Button
            variant="outline"
            disabled={disabled || !schema}
            onClick={onEdit}
          >
            <Pencil className="h-3.5 w-3.5" />
            {editing ? "Discard edits" : "Edit details"}
          </Button>
          {editing && (
            <Button
              variant="secondary"
              disabled={disabled || !changed || !schema}
              onClick={onSave}
            >
              Save changes
            </Button>
          )}
          <Button
            variant="ghost"
            className="text-muted-foreground"
            disabled={disabled}
            onClick={onReject}
          >
            <X className="h-4 w-4" />
            Reject
          </Button>
          {expired && pending && (
            <Button variant="outline" disabled={!canFresh} onClick={onFresh}>
              Start a fresh request
            </Button>
          )}
        </div>
        <p className="text-xs leading-5 text-muted-foreground">
          {!pending
            ? "The ERP is checking this action. Check its status before submitting another transaction."
            : expired
              ? "This review has expired. Start a fresh request to get an updated review."
              : "No changes have been made yet. Check the records, quantities and payments before confirming."}
        </p>
      </div>
    </div>
  );
}
