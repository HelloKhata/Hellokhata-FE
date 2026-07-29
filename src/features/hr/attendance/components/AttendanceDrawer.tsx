"use client";

import React, { useState, useEffect } from "react";
import { AttendanceRecord, AttendanceStatus } from "../types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, ShieldAlert, CheckCircle2, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AttendanceDrawerProps {
  record: AttendanceRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveCorrection: (updated: Partial<AttendanceRecord>) => void;
  isBangla?: boolean;
}

export function AttendanceDrawer({
  record,
  isOpen,
  onClose,
  onSaveCorrection,
  isBangla = false,
}: AttendanceDrawerProps) {
  const [checkIn, setCheckIn] = useState("09:00");
  const [checkOut, setCheckOut] = useState("18:00");
  const [status, setStatus] = useState<AttendanceStatus>("present");
  const [correctionReason, setCorrectionReason] = useState("");
  const [managerNote, setManagerNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (record) {
      setCheckIn(record.checkIn !== "-" ? record.checkIn : "09:00");
      setCheckOut(record.checkOut || "18:00");
      setStatus(record.status);
      setCorrectionReason(record.correctionReason || "");
      setManagerNote(record.managerNote || "");
    }
  }, [record]);

  if (!record) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!correctionReason.trim()) {
      setErrors({ correctionReason: "Correction reason is mandatory for audit logging" });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      onSaveCorrection({
        ...record,
        checkIn,
        checkOut,
        status,
        correctionReason,
        managerNote,
        isCorrected: true,
      });

      setIsSubmitting(false);
      onClose();
      toast.success(
        isBangla
          ? `${record.employeeName}-এর উপস্থিতি সফলভাবে সংশোধন করা হয়েছে`
          : `Attendance record corrected for ${record.employeeName}`
      );
    }, 400);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col h-full bg-card">
        <SheetHeader className="p-4 border-b border-border bg-muted/20 space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <SheetTitle className="text-sm font-bold text-foreground text-left">
                {isBangla ? "উপস্থিতি সংশোধন (Attendance Correction)" : "Attendance Record & Correction"}
              </SheetTitle>
              <SheetDescription className="text-[10px] text-muted-foreground text-left font-mono">
                {record.employeeName} ({record.employeeId}) • {record.date}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Details Overview Card */}
          <div className="p-3.5 bg-background/50 border border-border/80 rounded-xl space-y-2">
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-muted-foreground block text-[10px]">Branch</span>
                <strong className="text-foreground">{record.branchName}</strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Logged Device</span>
                <strong className="text-foreground font-mono">{record.device || "Kiosk Terminal"}</strong>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3 pt-1">
            <h4 className="font-bold text-foreground text-xs uppercase tracking-wider border-b border-border/50 pb-1.5">
              Correction Form
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-foreground">Check In Time *</Label>
                <Input
                  type="time"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="h-9 bg-background/50 text-xs border-input font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-foreground">Check Out Time</Label>
                <Input
                  type="time"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="h-9 bg-background/50 text-xs border-input font-mono font-bold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground">Attendance Status *</Label>
              <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                <SelectTrigger className="h-9 text-xs bg-background/50 border-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present" className="text-xs text-emerald-600 font-bold">
                    🟢 Present
                  </SelectItem>
                  <SelectItem value="late" className="text-xs text-amber-600 font-bold">
                    🟡 Late
                  </SelectItem>
                  <SelectItem value="absent" className="text-xs text-rose-600 font-bold">
                    🔴 Absent
                  </SelectItem>
                  <SelectItem value="leave" className="text-xs text-blue-600 font-bold">
                    🔵 Leave
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mandatory Correction Reason */}
            <div className="space-y-1">
              <Label className="text-xs font-bold text-foreground flex items-center gap-1">
                <span>Correction Reason *</span>
                <span className="text-[10px] text-rose-500">(Required for Audit)</span>
              </Label>
              <Input
                value={correctionReason}
                onChange={(e) => {
                  setCorrectionReason(e.target.value);
                  if (errors.correctionReason) setErrors({});
                }}
                placeholder="e.g. Biometric terminal glitch / Approved late entry"
                className={cn("h-9 bg-background/50 text-xs border-input", errors.correctionReason && "border-destructive")}
              />
              {errors.correctionReason && (
                <p className="text-[10px] text-destructive font-medium">{errors.correctionReason}</p>
              )}
            </div>

            {/* Manager Note */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground">Manager Note (Optional)</Label>
              <Textarea
                value={managerNote}
                onChange={(e) => setManagerNote(e.target.value)}
                placeholder="Additional audit details..."
                className="h-16 bg-background/50 border-input text-xs resize-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-9 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 cursor-pointer shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving Audit Correction...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Save Attendance Correction</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
