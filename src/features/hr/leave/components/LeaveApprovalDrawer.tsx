"use client";

import React, { useState } from "react";
import { LeaveRequest } from "../types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle2, XCircle, Clock, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface LeaveApprovalDrawerProps {
  request: LeaveRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (reqId: string, managerNote?: string) => void;
  onReject: (reqId: string, managerNote?: string) => void;
  isBangla?: boolean;
}

export function LeaveApprovalDrawer({
  request,
  isOpen,
  onClose,
  onApprove,
  onReject,
  isBangla = false,
}: LeaveApprovalDrawerProps) {
  const [managerNote, setManagerNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!request) return null;

  const handleApproveAction = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onApprove(request.id, managerNote);
      setIsSubmitting(false);
      onClose();
      toast.success(
        isBangla
          ? `ছুটির আবেদন অনুমোদিত হয়েছে! উপস্থিতি মডিউল আপডেট করা হয়েছে।`
          : `Leave request for ${request.employeeName} approved & synced to Attendance!`
      );
    }, 400);
  };

  const handleRejectAction = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onReject(request.id, managerNote);
      setIsSubmitting(false);
      onClose();
      toast.info(`Leave request for ${request.employeeName} rejected.`);
    }, 400);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col h-full bg-card">
        <SheetHeader className="p-4 border-b border-border bg-muted/20 space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <SheetTitle className="text-sm font-bold text-foreground text-left">
                {isBangla ? "ছুটি অনুমোদন রিভিউ (Manager Approval)" : "Manager Leave Approval Review"}
              </SheetTitle>
              <SheetDescription className="text-[10px] text-muted-foreground text-left font-mono">
                Request ID: {request.id} • Applied {request.appliedDate}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Employee Header Info */}
          <div className="p-3.5 bg-background/50 border border-border/80 rounded-xl flex items-center gap-3">
            <Avatar className="h-12 w-12 rounded-xl border">
              <AvatarImage src={request.employeeAvatar} alt={request.employeeName} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                {request.employeeName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-0.5">
              <strong className="text-sm font-bold text-foreground block">{request.employeeName}</strong>
              <span className="text-[11px] text-muted-foreground font-mono block">
                {request.role} • {request.branchName}
              </span>
            </div>
          </div>

          {/* Employee Attendance & Leave Quota Overview */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-background/50 border border-border/70 rounded-xl space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase">Attendance Rate</span>
              <strong className="text-sm font-mono font-bold text-emerald-600 block">98.5%</strong>
            </div>

            <div className="p-3 bg-background/50 border border-border/70 rounded-xl space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase">Current Quota Left</span>
              <strong className="text-sm font-mono font-bold text-foreground block">
                {request.remainingBalancePreview || 6} Days Left
              </strong>
            </div>
          </div>

          {/* Request Details Card */}
          <div className="p-3.5 bg-background/50 border border-border/80 rounded-xl space-y-2">
            <h4 className="font-bold text-foreground text-xs border-b border-border/60 pb-1.5">
              Application Details
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-muted-foreground block text-[10px]">Leave Type</span>
                <strong className="text-foreground">{request.leaveType}</strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Requested Duration</span>
                <strong className="text-primary font-mono">{request.totalDays} Days ({request.startDate} to {request.endDate})</strong>
              </div>
              <div className="col-span-2 pt-1 border-t border-border/50">
                <span className="text-muted-foreground block text-[10px]">Reason</span>
                <p className="text-foreground italic">"{request.reason}"</p>
              </div>
            </div>
          </div>

          {/* Manager Audit Note */}
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-foreground">Manager Approval Note (Optional)</Label>
            <Textarea
              value={managerNote}
              onChange={(e) => setManagerNote(e.target.value)}
              placeholder="Add manager comments for employee & audit logs..."
              className="h-20 bg-background/50 border-input text-xs resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              type="button"
              onClick={handleApproveAction}
              disabled={isSubmitting}
              className="h-10 font-bold bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 cursor-pointer shadow-xs"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Approve Leave 🟢</span>
                </>
              )}
            </Button>

            <Button
              type="button"
              onClick={handleRejectAction}
              disabled={isSubmitting}
              className="h-10 font-bold bg-rose-600 hover:bg-rose-700 text-white text-xs gap-1.5 cursor-pointer shadow-xs"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  <span>Reject Leave 🔴</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
