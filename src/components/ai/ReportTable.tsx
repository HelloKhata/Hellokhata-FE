"use client";
import type { ReportPresentation } from "../../types/ai-integration/generic-tool.contract";
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
  const number = new Intl.NumberFormat("bn-BD", { maximumFractionDigits: 3 });
  const display = (value: unknown, format: string) =>
    typeof value === "number"
      ? number.format(value)
      : format === "date" &&
          typeof value === "string" &&
          value.length > 10 &&
          Number.isFinite(Date.parse(value))
        ? new Intl.DateTimeFormat("bn-BD", {
            timeZone: report.timeZone,
          }).format(new Date(value))
        : String(value ?? "—");
  const download = () => {
    const csv =
      "\uFEFF" +
      [
        report.columns.map((c) => csvCell(c.label)).join(","),
        ...report.rows.map((r) =>
          report.columns.map((c) => csvCell(r[c.key])).join(","),
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
    <section className="space-y-3 rounded border p-4" aria-label={report.title}>
      <h2 className="font-semibold">{report.title}</h2>
      <p>{report.description}</p>
      <p>
        {report.startDate ?? "বর্তমান snapshot"}
        {report.endDate ? " → " + report.endDate : ""} · {report.timeZone}
      </p>
      <dl className="grid grid-cols-2 gap-2">
        {Object.entries(report.totals).map(([key, value]) => (
          <div key={key}>
            <dt>{key}</dt>
            <dd>{display(value, "number")}</dd>
          </div>
        ))}
      </dl>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <caption className="sr-only">
            {report.title} — page {report.page}
          </caption>
          <thead>
            <tr>
              {report.columns.map((c) => (
                <th scope="col" key={c.key} className="p-2">
                  {c.label}
                </th>
              ))}
              <th scope="col" className="p-2">
                বিস্তারিত / Details
              </th>
            </tr>
          </thead>
          <tbody>
            {report.rows.map((row, i) => (
              <tr key={i}>
                {report.columns.map((c) => (
                  <td key={c.key} className="border-t p-2">
                    {display(row[c.key], c.format)}
                  </td>
                ))}
                <td className="border-t p-2">
                  {typeof row.id === "string" &&
                    /^[a-zA-Z0-9_-]{1,128}$/.test(row.id) && (
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() =>
                          followUp(
                            "এই record-এর অনুমোদিত detail দেখাও; report: " +
                              report.title +
                              "; exact record ID: " +
                              row.id,
                          )
                        }
                      >
                        Detail request তৈরি করুন
                      </button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!report.rows.length && <p>এই filter-এ কোনো record নেই।</p>}
      <p>
        Page {report.page} · {report.rows.length}/{report.totalRecords} records
        · totals পুরো filter-এর
      </p>
      <button type="button" onClick={download}>
        এই page CSV download
      </button>
      {report.hasMore && (
        <button
          type="button"
          disabled={disabled}
          onClick={() =>
            followUp(
              "একই report ও একই filter-এর page " +
                (report.page + 1) +
                " দেখাও। Report: " +
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
          পরের page-এর request তৈরি করুন
        </button>
      )}
      <p>Record ID দিয়ে chat-এ detail চাইতে পারবেন।</p>
    </section>
  );
}
