"use client";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
/** All entry points share one canonical chat, avoiding competing recovery clients. */
export function V2AssistantEntry({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent className="min-w-0">
        <DialogTitle>AI Assistant</DialogTitle>
        <DialogDescription>
          Ask about your business or record a voice message. Review your
          transcript before sending, and confirm transaction details before any
          changes are made.
        </DialogDescription>
        <Link
          href="/ai"
          onClick={onClose}
          className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Open assistant
        </Link>
      </DialogContent>
    </Dialog>
  );
}
