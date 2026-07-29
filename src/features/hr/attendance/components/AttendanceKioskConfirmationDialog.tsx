"use client";

import React, { useState, useEffect } from "react";
import { useAttendanceStore } from "../store/useAttendanceStore";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, LogIn, LogOut, Clock, X } from "lucide-react";
import { toast } from "sonner";

interface AttendanceKioskConfirmationDialogProps {
  employee: { id: string; name: string; avatarUrl?: string; role: string } | null;
  isOpen: boolean;
  onClose: () => void;
  isBangla?: boolean;
}

export function AttendanceKioskConfirmationDialog({
  employee,
  isOpen,
  onClose,
  isBangla = false,
}: AttendanceKioskConfirmationDialogProps) {
  const { addToOfflineQueue, selectedBranch } = useAttendanceStore();
  const [successAction, setSuccessAction] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSuccessAction(null);
    }
  }, [isOpen]);

  if (!employee) return null;

  const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handleAction = (type: "check_in" | "check_out") => {
    // Add to offline sync queue immediately
    addToOfflineQueue({
      employeeId: employee.id,
      employeeName: employee.name,
      type: type,
      timestamp: nowTime,
      branchName: selectedBranch,
    });

    const actionText = type === "check_in" ? `Checked In at ${nowTime}` : `Checked Out at ${nowTime}`;
    setSuccessAction(actionText);

    // Auto-return after 2 seconds
    setTimeout(() => {
      onClose();
      toast.success(`${employee.name} ${actionText}`);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-6 bg-card border-2 border-primary/30 rounded-3xl shadow-2xl">
        {successAction ? (
          /* Auto-Return 2-Second Success Animation View */
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="h-20 w-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-500 shadow-md">
              <CheckCircle2 className="h-12 w-12 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-foreground">
                ✔ {successAction}
              </h3>
              <p className="text-sm text-muted-foreground font-semibold">
                Thank you, {employee.name}! Returning to grid...
              </p>
            </div>
          </div>
        ) : (
          /* Large Touch Confirmation View */
          <div className="space-y-6 text-center">
            {/* Top Employee Card */}
            <div className="flex flex-col items-center space-y-3 pt-2">
              <Avatar className="h-24 w-24 rounded-3xl border-4 border-primary/20 shadow-md">
                <AvatarImage src={employee.avatarUrl} alt={employee.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl rounded-3xl">
                  {employee.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div>
                <h3 className="text-xl font-extrabold text-foreground">{employee.name}</h3>
                <span className="text-xs font-mono font-semibold text-muted-foreground">
                  {employee.role} • {employee.id}
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/50 border text-xs font-mono font-bold">
                <Clock className="h-3.5 w-3.5 text-primary" /> {nowTime}
              </div>
            </div>

            {/* Giant Touch Action Buttons (Min 48px target) */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <Button
                type="button"
                onClick={() => handleAction("check_in")}
                className="h-16 text-base font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white gap-2 rounded-2xl shadow-md cursor-pointer active:scale-95"
              >
                <LogIn className="h-6 w-6" />
                <span>Check In 🟢</span>
              </Button>

              <Button
                type="button"
                onClick={() => handleAction("check_out")}
                className="h-16 text-base font-extrabold bg-rose-600 hover:bg-rose-700 text-white gap-2 rounded-2xl shadow-md cursor-pointer active:scale-95"
              >
                <LogOut className="h-6 w-6" />
                <span>Check Out 🔴</span>
              </Button>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full h-11 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer rounded-xl"
            >
              Cancel
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
