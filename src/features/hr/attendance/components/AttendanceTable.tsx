"use client";

import React from "react";
import { AttendanceRecord } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, Building2, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AttendanceTableProps {
  records: AttendanceRecord[];
  onEditRecord: (rec: AttendanceRecord) => void;
  isBangla?: boolean;
}

export function AttendanceTable({
  records,
  onEditRecord,
  isBangla = false,
}: AttendanceTableProps) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-2xs">
      <div className="p-4 border-b border-border/80 flex items-center justify-between">
        <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <span>{isBangla ? "উপস্থিতি রেজিস্টার লগ" : "Attendance Log Register"}</span>
        </h3>
        <span className="text-xs text-muted-foreground font-mono font-semibold">
          {records.length} Records Logged Today
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-muted/40 text-muted-foreground border-b border-border/80 font-semibold text-[11px] uppercase tracking-wider sticky top-0 z-10">
              <th className="px-3 py-3">Employee</th>
              <th className="px-3 py-3">Role</th>
              <th className="px-3 py-3">Branch</th>
              <th className="px-3 py-3">Check In</th>
              <th className="px-3 py-3">Check Out</th>
              <th className="px-3 py-3">Working Hours</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50 bg-card">
            {records.map((rec) => (
              <tr key={rec.id} className="hover:bg-muted/15 transition-colors">
                <td className="px-3 py-2.5 align-middle">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-8 w-8 rounded-lg border">
                      <AvatarImage src={rec.employeeAvatar} alt={rec.employeeName} />
                      <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                        {rec.employeeName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <strong className="text-foreground text-xs block">{rec.employeeName}</strong>
                      <span className="font-mono text-[10px] text-muted-foreground">{rec.employeeId}</span>
                    </div>
                  </div>
                </td>

                <td className="px-3 py-2.5 align-middle text-muted-foreground font-medium">
                  {rec.role}
                </td>

                <td className="px-3 py-2.5 align-middle text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-primary/70" /> {rec.branchName}
                  </span>
                </td>

                <td className="px-3 py-2.5 align-middle font-mono font-bold text-foreground">
                  {rec.checkIn}
                </td>

                <td className="px-3 py-2.5 align-middle font-mono text-muted-foreground">
                  {rec.checkOut || "-"}
                </td>

                <td className="px-3 py-2.5 align-middle font-mono font-semibold text-foreground">
                  {rec.workingHours} hrs
                </td>

                <td className="px-3 py-2.5 align-middle">
                  {rec.status === "present" ? (
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                      Present
                    </Badge>
                  ) : rec.status === "late" ? (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]">
                      Late
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/20 text-[10px]">
                      Absent
                    </Badge>
                  )}
                </td>

                <td className="px-3 py-2.5 align-middle text-right">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditRecord(rec)}
                    className="h-7 text-xs font-semibold gap-1 text-primary cursor-pointer"
                  >
                    <Pencil className="h-3 w-3" />
                    <span>Correct</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
