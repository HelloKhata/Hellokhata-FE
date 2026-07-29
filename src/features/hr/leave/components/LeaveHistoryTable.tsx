"use client";

import React from "react";
import { LeaveRequest } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Trash2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface LeaveHistoryTableProps {
  requests: LeaveRequest[];
  onCancelRequest: (reqId: string) => void;
  isBangla?: boolean;
}

export function LeaveHistoryTable({
  requests,
  onCancelRequest,
  isBangla = false,
}: LeaveHistoryTableProps) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-2xs space-y-3 p-4 sm:p-5">
      <div className="border-b border-border/80 pb-3 flex items-center justify-between">
        <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <span>{isBangla ? "আমার ছুটির আবেদনসমূহ (Leave Requests History)" : "My Leave Requests & Status History"}</span>
        </h3>
        <span className="text-xs text-muted-foreground font-mono font-semibold">
          {requests.length} Requests Submitted
        </span>
      </div>

      <div className="border border-border/80 rounded-xl overflow-hidden text-xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 text-[10px] uppercase font-semibold">
              <TableHead>Leave Type</TableHead>
              <TableHead>Date Range</TableHead>
              <TableHead>Total Days</TableHead>
              <TableHead>Applied Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Manager Note</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No leave requests submitted yet.
                </TableCell>
              </TableRow>
            ) : (
              requests.map((req) => (
                <TableRow key={req.id} className="hover:bg-muted/15">
                  <TableCell className="font-bold text-foreground">{req.leaveType}</TableCell>
                  <TableCell className="font-mono text-muted-foreground">
                    {req.startDate} to {req.endDate}
                  </TableCell>
                  <TableCell className="font-mono font-bold text-foreground">{req.totalDays} Days</TableCell>
                  <TableCell className="font-mono text-muted-foreground">{req.appliedDate}</TableCell>
                  <TableCell>
                    {req.status === "approved" ? (
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-bold">
                        🟢 Approved
                      </Badge>
                    ) : req.status === "pending" ? (
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px] font-bold">
                        🟡 Pending
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/20 text-[10px] font-bold">
                        🔴 Rejected
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-[11px]">
                    {req.managerNote || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {req.status === "pending" ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onCancelRequest(req.id)}
                        className="h-7 text-xs text-rose-600 hover:bg-rose-500/10 cursor-pointer"
                      >
                        Cancel
                      </Button>
                    ) : (
                      <span className="text-[10px] text-muted-foreground font-mono">Processed</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
