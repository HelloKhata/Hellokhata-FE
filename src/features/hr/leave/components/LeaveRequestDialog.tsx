"use client";

import React, { useState, useEffect } from "react";
import { LeaveRequest, LeaveType, LeaveBalance } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Mic,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface LeaveRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  balances: LeaveBalance[];
  onRequestSubmitted: (newReq: LeaveRequest) => void;
  isBangla?: boolean;
}

export function LeaveRequestDialog({
  isOpen,
  onClose,
  balances,
  onRequestSubmitted,
  isBangla = false,
}: LeaveRequestDialogProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  const [leaveType, setLeaveType] = useState<LeaveType>("Casual Leave");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);

  const [reason, setReason] = useState("");
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto calculate total days
  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diffTime = Math.max(0, e.getTime() - s.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const totalDays = calculateDays();
  const currentBalance = balances.find((b) => b.leaveType === leaveType)?.remainingDays || 0;
  const isInsufficient = totalDays > currentBalance;

  // Voice Input Simulation
  const handleToggleVoiceInput = () => {
    if (isVoiceRecording) {
      setIsVoiceRecording(false);
      setReason((prev) => (prev ? `${prev} (Attending medical appointment)` : "Attending medical appointment"));
      toast.success(isBangla ? "ভয়েস রেকর্ড ইনপুট সম্পন্ন হয়েছে" : "Voice reason captured");
    } else {
      setIsVoiceRecording(true);
      toast.info("Listening to voice reason... (Simulated)");
      setTimeout(() => {
        setIsVoiceRecording(false);
        setReason("Emergency family commitment requiring 2 days leave.");
        toast.success("Voice transcript converted to text!");
      }, 2000);
    }
  };

  const handleNext = () => {
    if (currentStep === 2 && isInsufficient) {
      setErrors({ balance: "Insufficient leave balance for the requested duration" });
      return;
    }
    if (currentStep === 3 && !reason.trim()) {
      setErrors({ reason: "Reason is required" });
      return;
    }

    setErrors({});
    if (currentStep < 4) setCurrentStep((s) => (s + 1) as any);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((s) => (s - 1) as any);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const created: LeaveRequest = {
        id: `LV-${Math.floor(1000 + Math.random() * 9000)}`,
        employeeId: "EMP-1001",
        employeeName: "Kazi Shohel",
        role: "Manager",
        branchName: "Main Branch",
        leaveType,
        startDate,
        endDate,
        totalDays,
        appliedDate: new Date().toISOString().split("T")[0],
        reason: reason.trim(),
        status: "pending",
        remainingBalancePreview: currentBalance - totalDays,
      };

      setIsSubmitting(false);
      onRequestSubmitted(created);
      onClose();
      toast.success(
        isBangla
          ? "ছুটির আবেদন সফলভাবে জমা দেওয়া হয়েছে!"
          : "Leave request submitted successfully."
      );
    }, 400);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-5 bg-card">
        <DialogHeader className="space-y-1 border-b border-border pb-3">
          <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{isBangla ? "নতুন ছুটির আবেদন (New Leave Request)" : "New Leave Request"}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Request leave with automatic balance check and Attendance/Payroll integration.
          </DialogDescription>
        </DialogHeader>

        {/* Stepper Header */}
        <div className="grid grid-cols-4 gap-2 pt-1 pb-3 text-[11px] font-semibold border-b border-border/60">
          <div className={cn("pb-1 border-b-2 text-center", currentStep >= 1 ? "border-primary text-primary font-bold" : "border-muted text-muted-foreground")}>
            1. Dates
          </div>
          <div className={cn("pb-1 border-b-2 text-center", currentStep >= 2 ? "border-primary text-primary font-bold" : "border-muted text-muted-foreground")}>
            2. Balance
          </div>
          <div className={cn("pb-1 border-b-2 text-center", currentStep >= 3 ? "border-primary text-primary font-bold" : "border-muted text-muted-foreground")}>
            3. Reason
          </div>
          <div className={cn("pb-1 border-b-2 text-center", currentStep === 4 ? "border-primary text-primary font-bold" : "border-muted text-muted-foreground")}>
            4. Review
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs">
          {/* STEP 1: Leave Type & Dates */}
          {currentStep === 1 && (
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-foreground">Leave Type *</Label>
                <Select value={leaveType} onValueChange={(val: any) => setLeaveType(val)}>
                  <SelectTrigger className="h-9 text-xs bg-background/50 border-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Casual Leave" className="text-xs font-semibold">Casual Leave</SelectItem>
                    <SelectItem value="Sick Leave" className="text-xs font-semibold">Sick Leave</SelectItem>
                    <SelectItem value="Earned Leave" className="text-xs font-semibold">Earned Leave</SelectItem>
                    <SelectItem value="Festival Leave" className="text-xs font-semibold">Festival Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-foreground">Start Date *</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-9 bg-background/50 text-xs border-input font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-foreground">End Date *</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-9 bg-background/50 text-xs border-input font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Balance Check & Days Calculation */}
          {currentStep === 2 && (
            <div className="space-y-3.5">
              <div className="p-3.5 bg-background/50 border border-border/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs">Selected Leave Type</span>
                  <strong className="text-foreground font-bold">{leaveType}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs">Requested Duration</span>
                  <strong className="text-primary font-mono text-sm">{totalDays} Days</strong>
                </div>
                <div className="flex items-center justify-between border-t border-border/60 pt-2">
                  <span className="text-muted-foreground text-xs">Current Remaining Quota</span>
                  <strong className="text-foreground font-mono">{currentBalance} Days</strong>
                </div>
              </div>

              {isInsufficient ? (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold text-xs">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>Insufficient leave balance! You only have {currentBalance} days left.</span>
                </div>
              ) : (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>Sufficient quota available. ({currentBalance - totalDays} days remaining after request)</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Reason & Voice Input */}
          {currentStep === 3 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-foreground">Reason for Leave *</Label>

                {/* Voice Input Simulation Button */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleToggleVoiceInput}
                  className={`h-7 text-[10px] gap-1 cursor-pointer ${
                    isVoiceRecording ? "bg-rose-500 text-white animate-pulse" : "bg-background/50"
                  }`}
                >
                  <Mic className="h-3 w-3" />
                  <span>{isVoiceRecording ? "Listening..." : "Voice Input"}</span>
                </Button>
              </div>

              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="State the reason for your leave application..."
                className={cn("h-24 bg-background/50 border-input text-xs resize-none", errors.reason && "border-destructive")}
              />
              {errors.reason && (
                <p className="text-[10px] text-destructive font-medium">{errors.reason}</p>
              )}
            </div>
          )}

          {/* STEP 4: Review & Submit */}
          {currentStep === 4 && (
            <div className="p-3.5 bg-background/50 border border-border/80 rounded-xl space-y-2 text-xs">
              <h4 className="font-bold text-foreground border-b border-border/60 pb-1.5">
                Review Leave Application
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Type</span>
                  <strong className="text-foreground">{leaveType}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Duration</span>
                  <strong className="text-foreground font-mono">{totalDays} Days ({startDate} to {endDate})</strong>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground block text-[10px]">Reason</span>
                  <p className="text-foreground">{reason}</p>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Controls Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 1 || isSubmitting}
              className="h-9 text-xs px-3 gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>

            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={currentStep === 2 && isInsufficient}
                className="h-9 px-4 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-1 cursor-pointer"
              >
                <span>Next Step</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-9 px-5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 cursor-pointer shadow-xs"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Submit Leave Request</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
