"use client";

import React from "react";
import { LeaveRequest } from "../types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Building2, Eye, Clock, CheckCircle2, XCircle } from "lucide-react";

interface LeaveApprovalCardsGridProps {
  requests: LeaveRequest[];
  onReviewRequest: (req: LeaveRequest) => void;
  isBangla?: boolean;
}

export function LeaveApprovalCardsGrid({
  requests,
  onReviewRequest,
  isBangla = false,
}: LeaveApprovalCardsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {requests.map((req) => (
        <div
          key={req.id}
          className="bg-card border border-border/80 rounded-xl p-4 shadow-2xs space-y-3.5 flex flex-col justify-between transition-all hover:border-primary/30"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Avatar className="h-10 w-10 rounded-xl border">
                <AvatarImage src={req.employeeAvatar} alt={req.employeeName} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                  {req.employeeName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div>
                <strong className="text-foreground text-xs block">{req.employeeName}</strong>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {req.role} • {req.branchName}
                </span>
              </div>
            </div>

            {req.status === "pending" ? (
              <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px] font-bold">
                🟡 Pending
              </Badge>
            ) : req.status === "approved" ? (
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-bold">
                🟢 Approved
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/20 text-[10px] font-bold">
                🔴 Rejected
              </Badge>
            )}
          </div>

          {/* Request Details */}
          <div className="bg-background/50 border border-border/70 p-3 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-[11px]">Leave Type</span>
              <strong className="text-foreground font-bold">{req.leaveType}</strong>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-[11px]">Duration</span>
              <strong className="text-primary font-mono">{req.totalDays} Days ({req.startDate} to {req.endDate})</strong>
            </div>

            <div className="flex items-center justify-between border-t border-border/50 pt-1.5">
              <span className="text-muted-foreground text-[10px]">Quota Preview</span>
              <span className="text-[10px] font-mono font-semibold text-emerald-600">
                {req.remainingBalancePreview || 6} Days Remaining
              </span>
            </div>

            <p className="text-[11px] text-muted-foreground italic line-clamp-2 pt-1 border-t border-border/50">
              "{req.reason}"
            </p>
          </div>

          {/* Actions */}
          <div className="pt-1">
            <Button
              type="button"
              onClick={() => onReviewRequest(req)}
              className="w-full h-8 text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs rounded-lg"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Review & Process Approval</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
