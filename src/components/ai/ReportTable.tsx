"use client";
import { Download, ChevronRight, FileSpreadsheet, Search } from "lucide-react";
import { Button } from "../ui/button";
import { useSessionStore } from "../../stores/sessionStore";
import type { ReportPresentation } from "../../types/ai-integration/generic-tool.contract";
import {
  technicalField,
  opaqueIdentifier,
  displayLabel,
  moneyMetric,
} from "./chat-presentation";
export const csvCell = (value: unknown) => {
  const raw = String(value ?? "");
  const safe = /^[\s]*[=+\-@\t\r]/.test(raw) ? "'" + raw : raw;
  return '"' + safe.replace(/"/g, '""') + '"';
};
export function ReportTable({
  report,
  followUp,
  disabled,
}: {
  report: ReportPresentation;
  followUp: (text: string) => void;
  disabled: boolean;
}) {
  const columns = report.columns.filter(
    (column) => !technicalField(column.key),
  );
  const title = displayLabel(report.title);
  const currency = useSessionStore(
    (session) => session.business?.currency ?? "BDT",
  );
  const number = new Intl.NumberFormat("en-BD", { maximumFractionDigits: 3 });
  const money = new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: /^[A-Z]{3}$/.test(currency) ? currency : "BDT",
  });
  const display = (value: unknown, format: string) =>
    typeof value === "number"
      ? format === "money"
        ? money.format(value)
        : number.format(value)
      : format === "date" &&
          typeof value === "string" &&
          value.length > 10 &&
          Number.isFinite(Date.parse(value))
        ? new Intl.DateTimeFormat("en-BD", {
            timeZone: report.timeZone,
          }).format(new Date(value))
        : typeof value === "string" && opaqueIdentifier(value)
          ? "—"
          : String(value ?? "—");
  const download = () => {
    const csv =
      "\uFEFF" +
      [
        columns.map((c) => csvCell(c.label)).join(","),
        ...report.rows.map((r) =>
          columns
            .map((c) =>
              csvCell(
                typeof r[c.key] === "string" &&
                  opaqueIdentifier(String(r[c.key]))
                  ? ""
                  : r[c.key],
              ),
            )
            .join(","),
        ),
      ].join("\r\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "report-page-" + report.page + ".csv";
    link.click();
    URL.revokeObjectURL(url);
  };
  return (
    <section
      className="overflow-hidden rounded-2xl border border-border bg-card"
      aria-label={title}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border p-4 sm:p-5">
        <div className="min-w-0 flex-1">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <FileSpreadsheet className="h-4 w-4 shrink-0 text-primary" />
            {title}
          </h2>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Verified business records for the selected filters.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {report.startDate ?? "Current snapshot"}
            {report.endDate ? " → " + report.endDate : ""} · {report.timeZone}
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={download}>
          <Download className="h-3.5 w-3.5" />
          Export this page
        </Button>
      </div>
      {Object.keys(report.totals).length > 0 && (
        <dl className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 sm:p-5">
          {Object.entries(report.totals)
            .filter(([key]) => !technicalField(key))
            .map(([key, value]) => (
              <div
                key={key}
                className="min-w-0 rounded-xl bg-muted/50 px-3 py-3"
              >
                <dt className="text-xs text-muted-foreground">
                  {displayLabel(key)}
                </dt>
                <dd className="mt-1 break-words text-lg font-semibold tabular-nums">
                  {display(
                    value,
                    report.columns.find((column) => column.key === key)
                      ?.format ?? (moneyMetric(key) ? "money" : "number"),
                  )}
                </dd>
              </div>
            ))}
        </dl>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">
            {title} — page {report.page}
          </caption>
          <thead className="bg-muted/50">
            <tr>
              {columns.map((column) => (
                <th
                  scope="col"
                  key={column.key}
                  className="whitespace-nowrap px-4 py-3 text-xs font-medium text-muted-foreground"
                >
                  {column.label}
                </th>
              ))}
              <th
                scope="col"
                className="px-4 py-3 text-xs font-medium text-muted-foreground"
              >
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {report.rows.map((row, index) => (
              <tr
                key={index}
                className="border-t border-border transition-colors hover:bg-muted/30"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-4 py-3 ${column.format === "money" || column.format === "number" ? "whitespace-nowrap tabular-nums" : "max-w-[20rem] break-words"}`}
                  >
                    {display(row[column.key], column.format)}
                  </td>
                ))}
                <td className="px-4 py-2">
                  {typeof (row.invoiceNo ?? row.name ?? row.title) ===
                    "string" &&
                    typeof row.id === "string" &&
                    /^[a-zA-Z0-9_-]{1,128}$/.test(row.id) && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={disabled}
                        onClick={() =>
                          followUp(
                            "Show the authorized details for this record; report: " +
                              report.title +
                              "; record reference: " +
                              String(row.invoiceNo ?? row.name ?? row.title),
                          )
                        }
                      >
                        <Search className="h-3 w-3" />
                        View
                      </Button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!report.rows.length && (
        <div className="p-8 text-center">
          <Search className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
          <p className="text-sm font-medium">No matching records</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try another date range or filter.
          </p>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs text-muted-foreground">
        <p>
          Page {report.page} · {report.rows.length} of {report.totalRecords}{" "}
          records
          <br />
          <span className="text-[11px]">
            Summary totals cover the full filter.
          </span>
        </p>
        {report.hasMore && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() =>
              followUp(
                "Show page " +
                  (report.page + 1) +
                  " of the same report with the same filters. Report: " +
                  report.title +
                  "; dates: " +
                  report.startDate +
                  " to " +
                  (report.endDate ?? "current") +
                  (report.query
                    ? "; exact ERP query: " +
                      JSON.stringify({
                        ...report.query,
                        arguments: {
                          ...report.query.arguments,
                          page: report.page + 1,
                        },
                      })
                    : ""),
              )
            }
          >
            Next page
            <ChevronRight className="h-3 w-3" />
          </Button>
        )}
      </div>
      <p className="px-4 pb-3 text-[11px] text-muted-foreground">
        Report actions prepare a message for you to review and send.
      </p>
    </section>
  );
}
