"use client";

import React from "react";
import { AttendanceMatrixRow, AttendanceMatrixCell } from "../types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Grid, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface AttendanceMatrixGridProps {
  matrixRows: AttendanceMatrixRow[];
  onSelectCell: (empName: string, cell: AttendanceMatrixCell) => void;
  isBangla?: boolean;
}

export function AttendanceMatrixGrid({
  matrixRows,
  onSelectCell,
  isBangla = false,
}: AttendanceMatrixGridProps) {
  const dates = ["2026-07-28", "2026-07-27", "2026-07-26", "2026-07-25", "2026-07-24", "2026-07-23"];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <span className="h-6 px-2 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30 inline-flex items-center gap-1">🟢 Present</span>;
      case "late":
        return <span className="h-6 px-2 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30 inline-flex items-center gap-1">🟡 Late</span>;
      case "absent":
        return <span className="h-6 px-2 rounded-md bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold border border-rose-500/30 inline-flex items-center gap-1">🔴 Absent</span>;
      case "leave":
        return <span className="h-6 px-2 rounded-md bg-blue-500/15 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/30 inline-flex items-center gap-1">🔵 Leave</span>;
      case "holiday":
        return <span className="h-6 px-2 rounded-md bg-muted text-muted-foreground font-bold border border-border/60 inline-flex items-center gap-1">⚪ Holiday</span>;
      default:
        return <span className="text-muted-foreground">-</span>;
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-4 shadow-2xs">
      <div className="border-b border-border/80 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
            <Grid className="h-4 w-4 text-primary" />
            <span>{isBangla ? "উপস্থিতি ম্যাট্রিক্স গ্রিড (Attendance Matrix Grid)" : "Attendance Matrix Grid"}</span>
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {isBangla
              ? "প্রতিদিনের উপস্থিতির স্ট্যাটাস দেখুন। যেকোনো সেলে ক্লিক করে ম্যানুয়াল কারেকশন টাইটেল দেখুন।"
              : "Responsive matrix grid comparing employee attendance by dates. Click any cell to inspect or edit details."}
          </p>
        </div>
      </div>

      {/* Grid Matrix Table */}
      <div className="border border-border/80 rounded-xl overflow-x-auto shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-muted/40 text-muted-foreground border-b border-border/80 font-semibold text-[11px] uppercase tracking-wider">
              <th className="px-3 py-3 min-w-[200px]">Employee</th>
              {dates.map((date) => (
                <th key={date} className="px-3 py-3 text-center min-w-[110px] font-mono">
                  {date.substring(5)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50 bg-card">
            {matrixRows.map((row) => (
              <tr key={row.employeeId} className="hover:bg-muted/15 transition-colors">
                {/* Employee Info Cell */}
                <td className="px-3 py-2.5 align-middle">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-7 w-7 rounded-lg border">
                      <AvatarImage src={row.avatarUrl} alt={row.employeeName} />
                      <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                        {row.employeeName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <strong className="text-foreground text-xs block truncate">{row.employeeName}</strong>
                      <span className="text-[10px] text-muted-foreground font-mono">{row.role}</span>
                    </div>
                  </div>
                </td>

                {/* Date Status Cells */}
                {dates.map((date) => {
                  const cell = row.cells.find((c) => c.date === date) || { date, status: "holiday" };

                  return (
                    <td key={date} className="px-2 py-2 text-center align-middle">
                      <button
                        type="button"
                        onClick={() => onSelectCell(row.employeeName, cell)}
                        className="cursor-pointer transition-transform active:scale-95 text-[10px]"
                      >
                        {getStatusBadge(cell.status)}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
