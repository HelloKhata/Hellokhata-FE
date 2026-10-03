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
        <DialogTitle>AI সহকারী / AI assistant</DialogTitle>
        <DialogDescription>
          একই chat-এ লিখুন অথবা voice record করুন। Transcript review করে Send
          করুন; কোনো কাজ নিজে থেকে execute হবে না।
        </DialogDescription>
        <Link
          href="/ai"
          onClick={onClose}
          className="inline-block rounded border p-3"
        >
          Chat ও voice assistant খুলুন / Open assistant
        </Link>
      </DialogContent>
    </Dialog>
  );
}
