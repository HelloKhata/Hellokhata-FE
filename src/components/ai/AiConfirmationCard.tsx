'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/premium';
import {
  confirmAiAction,
  createOrRecoverAiAction,
  rejectAiAction,
  updateAiActionDraft,
} from '@/services/ai-action.services';
import type { AiAction, AiActionDraft } from '@/types/ai-actions';
import type { AiProposalResponse } from '@/types/ai-gateway';

type Run = (work: () => Promise<AiAction>) => Promise<void>;

export function AiConfirmationCard(props: {
  proposal: AiProposalResponse;
  compact?: boolean;
}) {
  const [action, setAction] = useState<AiAction | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const run: Run = async (work) => {
    setBusy(true);
    setError(null);
    try {
      setAction(await work());
    } catch {
      setError('Confirmation request failed. Refresh and review again.');
    } finally {
      setBusy(false);
    }
  };
  return <CardBody {...props} action={action} busy={busy} error={error} run={run} />;
}

function ActionBody(props: {
  proposal: AiProposalResponse;
  compact?: boolean;
  action: AiAction;
  busy: boolean;
  error: string | null;
  run: Run;
}) {
  const { action, busy, compact, error, run } = props;
  const [draft, setDraft] = useState(action.draft);
  const changeLine = (
    index: number,
    field: 'quantity' | 'unitPrice',
    value: number,
  ) => {
    setDraft((current) => {
      const lineItems = current.lineItems.map((line, position) =>
        position === index ? { ...line, [field]: value } : line,
      );
      return {
        ...current,
        lineItems,
        amount: Number(
          lineItems
            .reduce(
              (total, line) => total + line.quantity * line.unitPrice,
              0,
            )
            .toFixed(2),
        ),
      };
    });
  };
  const terminal = action.status !== 'PENDING_CONFIRMATION';
  const stockByRecord = new Map(
    action.sourceEvidence.citations.map((citation) => [
      citation.recordId,
      citation.facts.find((fact) => fact.field === 'currentStock')?.value,
    ]),
  );
  return <section className={'mt-3 rounded-xl border border-border bg-background p-3 text-left'}>
    <p className={'text-xs font-semibold'}>Confirmation review</p>
    <p className={'text-[10px] text-muted-foreground'}>
      v{action.version} · {action.risk} · {action.status}
    </p>
    {draft.party
      ? <p className={'mt-2 text-xs'}>Party: {draft.party.label}</p>
      : null}
    {draft.lineItems.map((line, index) => (
      <div key={line.recordId + index} className={compact
        ? 'mt-2 rounded bg-muted/40 p-2'
        : 'mt-2 grid grid-cols-[1fr_70px_80px] gap-2 rounded bg-muted/40 p-2'}>
        <span className={'self-center text-xs'}>
          {line.label}
          {typeof stockByRecord.get(line.recordId) === 'number'
            ? <small className={'block text-[10px] text-muted-foreground'}>
                Stock: {String(stockByRecord.get(line.recordId))}
              </small>
            : null}
        </span>
        {(['quantity', 'unitPrice'] as const).map((field) => (
          <label key={field} className={'text-[10px] text-muted-foreground'}>
            {field === 'quantity' ? 'Qty' : 'Price'}
            <input
              className={'mt-1 w-full rounded border bg-background px-2 py-1 text-xs'}
              disabled={terminal || busy}
              min={field === 'quantity' ? 0.0001 : 0}
              step={'any'}
              type={'number'}
              defaultValue={line[field]}
              onChange={(event) =>
                changeLine(index, field, Number(event.target.value))
              }
            />
          </label>
        ))}
      </div>
    ))}
    <div className={'mt-3 grid gap-2 text-xs sm:grid-cols-2'}>
      <label className={'text-muted-foreground'}>
        Payment
        <select
          className={'mt-1 w-full rounded border bg-background px-2 py-1.5 text-xs'}
          disabled={terminal || busy}
          value={draft.paymentMethod ?? ''}
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              paymentMethod: event.target.value || null,
            }))
          }>
          <option value={''}>Credit / unpaid</option>
          <option value={'cash'}>Cash</option>
          <option value={'card'}>Card</option>
          <option value={'mobile_banking'}>Mobile banking</option>
          <option value={'bank_transfer'}>Bank transfer</option>
        </select>
      </label>
      <div className={'rounded border bg-muted/30 p-2'}>
        <span className={'text-muted-foreground'}>Authoritative review total</span>
        <strong className={'block text-sm'}>
          ৳{(draft.amount ?? 0).toLocaleString()}
        </strong>
      </div>
    </div>
    <ActionButtons action={action} draft={draft} busy={busy} run={run} />
    {action.execution?.status === 'SUCCEEDED' && action.execution.committedEntity
      ? <p className={'mt-3 rounded bg-success/10 p-2 text-xs'}>
          Sale committed exactly once as{' '}
          <a className={'font-semibold underline'} href={action.execution.committedEntity.href}>
            {action.execution.committedEntity.invoiceNo}
          </a>.
        </p>
      : action.execution
        ? <p className={'mt-3 rounded bg-warning/10 p-2 text-xs'}>
            Confirmed; execution was blocked ({action.execution.errorCode}). No ERP entity was committed.
          </p>
        : null}
    {action.status === 'REJECTED'
      ? <p className={'mt-3 text-xs'}>Rejected. Nothing was committed.</p>
      : null}
    {error ? <p className={'mt-2 text-[11px] text-destructive'}>{error}</p> : null}
  </section>;
}

function CardBody(props: {
  proposal: AiProposalResponse;
  compact?: boolean;
  action: AiAction | null;
  busy: boolean;
  error: string | null;
  run: Run;
}) {
  const { proposal, action, busy, error, run } = props;
  const allowed = [
    proposal.status === 'PROPOSED',
    proposal.proposal.actionAllowed,
    Boolean(proposal.proposal.actionId),
    Boolean(proposal.expiresAt),
    Boolean(proposal.grounding),
    ['GROUNDED', 'NOT_REQUIRED'].includes(proposal.grounding?.status ?? ''),
  ].every(Boolean);
  if (!allowed) return null;
  if (action) return <ActionBody {...props} action={action} />;
  return <section className={'mt-3 rounded-xl border border-primary/30 bg-primary/5 p-3 text-left'}>
    <p className={'text-xs font-semibold'}>Durable confirmation required</p>
    <p className={'mt-1 text-[11px] text-muted-foreground'}>
      Opening the versioned draft never commits data. Confirmation can execute
      only when the backend RECORD_SALE allowlist is explicitly enabled.
    </p>
    <Button className={'mt-2'} size={'sm'} disabled={busy}
      onClick={() => run(() => createOrRecoverAiAction(proposal.requestId))}>
      {busy ? 'Opening...' : 'Review grounded draft'}
    </Button>
    {error ? <p className={'mt-2 text-[11px] text-destructive'}>{error}</p> : null}
  </section>;
}

function ActionButtons(props: {
  action: AiAction;
  draft: AiActionDraft;
  busy: boolean;
  run: Run;
}) {
  const { action, draft, busy, run } = props;
  if (action.status !== 'PENDING_CONFIRMATION') return null;
  const save = () => updateAiActionDraft(action.actionId, {
    expectedVersion: action.version,
    party: draft.party,
    lineItems: draft.lineItems,
    amount: draft.amount,
    paymentMethod: draft.paymentMethod,
    adjustmentReason: draft.adjustmentReason,
    notes: draft.notes,
  });
  return <div className={'mt-3 flex flex-wrap gap-2'}>
    <Button variant={'outline'} size={'sm'} disabled={busy}
      onClick={() => run(save)}>
      Save revision
    </Button>
    <Button size={'sm'} disabled={busy}
      onClick={() =>
        run(() => confirmAiAction(action.actionId, action.version))
      }>
      Confirm reviewed draft
    </Button>
    <Button variant={'destructive'} size={'sm'} disabled={busy}
      onClick={() =>
        run(() => rejectAiAction(action.actionId, action.version))
      }>
      Reject
    </Button>
  </div>;
}
