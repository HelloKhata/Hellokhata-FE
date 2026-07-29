"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDangerous = false,
}: ConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-5 bg-card">
        <DialogHeader className="space-y-1.5 border-b border-border pb-3">
          <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <span>{title}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <Button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 h-9 text-xs font-semibold cursor-pointer ${
              isDangerous
                ? "bg-rose-600 hover:bg-rose-700 text-white"
                : "bg-primary hover:bg-primary/90 text-primary-foreground"
            }`}
          >
            {confirmText}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-9 text-xs px-4 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {cancelText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
