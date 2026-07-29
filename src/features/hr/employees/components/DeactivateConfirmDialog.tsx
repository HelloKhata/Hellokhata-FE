"use client";

import React from "react";
import { Employee } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserX, CheckCircle2 } from "lucide-react";

interface DeactivateConfirmDialogProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (emp: Employee) => void;
  isBangla?: boolean;
}

export function DeactivateConfirmDialog({
  employee,
  isOpen,
  onClose,
  onConfirm,
  isBangla = false,
}: DeactivateConfirmDialogProps) {
  if (!employee) return null;
  const isDeactivating = employee.status === "active";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-5 bg-card">
        <DialogHeader className="space-y-1.5 border-b border-border pb-3">
          <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${isDeactivating ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"}`}>
              {isDeactivating ? <UserX className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
            </div>
            <span>
              {isDeactivating
                ? `Deactivate Employee ${employee.fullName}?`
                : `Reactivate Employee ${employee.fullName}?`}
            </span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            {isDeactivating
              ? `Are you sure you want to deactivate ${employee.fullName} (${employee.id})? Deactivating will disable system login and pause payroll generation, but historical attendance and payslips will be strictly preserved.`
              : `Reactivating ${employee.fullName} will restore active roster status, biometric attendance logging, and monthly payroll processing.`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <Button
            type="button"
            onClick={() => {
              onConfirm(employee);
              onClose();
            }}
            className={`flex-1 h-9 text-xs font-semibold cursor-pointer ${
              isDeactivating
                ? "bg-rose-600 hover:bg-rose-700 text-white"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
          >
            {isDeactivating ? "Confirm Deactivation" : "Confirm Activation"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-9 text-xs px-4 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
