import type {
  JsonObject,
  JsonValue,
  PendingAction,
  ReportPresentation,
} from "../../types/ai-integration/generic-tool.contract";

export const technicalField = (key: string) =>
  /(^id$|Ids?$|^revision$|^evidence$|hash|^operationId$|^actionVersion$)/.test(
    key,
  );
export const opaqueIdentifier = (value: string) =>
  /^(?:c[a-z0-9]{24,}|[a-f0-9]{64}|[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})$/i.test(
    value,
  );

/** Presentation only: never mutate the reviewed arguments or execution payload. */
export function businessFields(value: JsonValue): JsonValue {
  if (Array.isArray(value)) return value.map(businessFields);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !technicalField(key))
        .map(([key, entry]) => [key, businessFields(entry)]),
    );
  return typeof value === "string" && opaqueIdentifier(value)
    ? "Selected record"
    : value;
}

// Read complete JSON snapshots from the existing ERP-authored summary. Quoted
// semicolons/braces are data, not delimiters; truncated snapshots are ignored.
function snapshot(summary: string, label: string): JsonValue | undefined {
  const marker = "; " + label + " ";
  const start = summary.indexOf(marker);
  if (start < 0) return;
  const offset = start + marker.length;
  let depth = 0,
    quoted = false,
    escaped = false;
  for (let i = offset; i < summary.length; i++) {
    const char = summary[i];
    if (quoted) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') quoted = false;
    } else if (char === '"') quoted = true;
    else if (char === "{" || char === "[") depth++;
    else if (char === "}" || char === "]") {
      if (--depth === 0) {
        try {
          return JSON.parse(summary.slice(offset, i + 1)) as JsonValue;
        } catch {
          return;
        }
      }
    }
  }
}
const object = (value: JsonValue | undefined): JsonObject =>
  value && typeof value === "object" && !Array.isArray(value) ? value : {};

export function reviewPresentation(action: PendingAction): JsonObject {
  if (action.presentation)
    return businessFields(action.presentation) as JsonObject;
  const args = action.call.arguments;
  if (!/^(sales|purchases)\.create$/.test(action.call.name))
    return businessFields(args) as JsonObject;
  const party = object(snapshot(action.summary, "party"));
  const products = snapshot(action.summary, "items");
  const snapshots = Array.isArray(products) ? products.map(object) : [];
  const items = Array.isArray(args.items)
    ? args.items.map((entry) => {
        const line = object(entry);
        const product = snapshots.find((row) => row.id === line.itemId);
        return {
          product:
            typeof product?.name === "string"
              ? product.name
              : "Selected product (name unavailable)",
          ...(businessFields(line) as JsonObject),
        };
      })
    : [];
  const totals = object(snapshot(action.summary, "totals"));
  return {
    ...(typeof party.name === "string" && party.id === args.partyId
      ? {
          [action.call.name.startsWith("sales") ? "customer" : "supplier"]:
            party.name,
        }
      : args.partyId
        ? { party: "Selected party (name unavailable)" }
        : {}),
    ...(businessFields(args) as JsonObject),
    items,
    ...(Object.keys(totals).length ? { totals } : {}),
  };
}

export const readableSummary = (summary: string) =>
  /(?:; evidence |full-review-sha256:|\b(?:branch|accountId|partyId|itemId)\b|[\[{])/.test(
    summary,
  )
    ? "Review the transaction details below before confirming."
    : summary.replace(/;\s*(?:full-)?review-sha256:[a-f0-9]{64}/gi, "").trim();

export const operationTitle = (name: string) =>
  displayLabel(name).replace(/ Create$/, " review");

export function displayLabel(key: string): string {
  const labels: Record<string, string> = {
    "dashboard.summary": "Sales and purchases overview",
    salesGross: "Sales total",
    salesPaid: "Sales paid",
    salesDue: "Sales outstanding",
    purchaseGross: "Purchases total",
    purchasePaid: "Purchases paid",
    purchaseDue: "Purchases outstanding",
    purchaseCount: "Purchase invoices",
    activeProducts: "Active products",
    signedCurrentBalance: "Current balance (signed)",
    cashReceipts: "Cash receipts",
    expenses: "Expenses",
    cashAfterExpenses: "Cash after expenses",
  };
  return (
    labels[key] ??
    key
      .replace(/^(reports|dashboard)\./, "")
      .replace(/([a-z\d])([A-Z])/g, "$1 $2")
      .replace(/[_.-]+/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  );
}

export const moneyMetric = (key: string) =>
  /(?:Gross|Paid|Due|Balance|Receipts|expenses|Expenses)$/.test(key);

/** Legacy persisted answers may contain raw JSON. Rebuild their visible text
 * from verified report data, never from tool names or unverified model prose. */
export function reportSummary(
  reports: ReportPresentation[],
  currency = "BDT",
): string {
  return reports
    .map((report) => {
      const metrics = Object.entries(report.totals)
        .filter(([key]) => !technicalField(key))
        .map(([key, value]) => {
          const display =
            typeof value === "number"
              ? new Intl.NumberFormat(
                  "en-BD",
                  moneyMetric(key)
                    ? {
                        style: "currency",
                        currency: /^[A-Z]{3}$/.test(currency)
                          ? currency
                          : "BDT",
                      }
                    : { maximumFractionDigits: 3 },
                ).format(value)
              : String(businessFields(value) ?? "Not available");
          return `${displayLabel(key)}: ${display}`;
        });
      const period = report.startDate
        ? ` (${report.startDate}${report.endDate && report.endDate !== report.startDate ? " to " + report.endDate : ""})`
        : "";
      return `${displayLabel(report.title)}${period}. ${metrics.length ? metrics.join("; ") : `${report.totalRecords} records found`}.`;
    })
    .join("\n");
}
