"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { toast } from "sonner";

interface CancelTransferDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transferNo: string;
  onCancelSuccess?: () => void;
}

export function CancelTransferDialog({
  isOpen,
  onClose,
  transferNo,
  onCancelSuccess,
}: CancelTransferDialogProps) {
  const { isBangla } = useAppTranslation();

  const handleConfirmCancel = () => {
    toast.success(
      isBangla
        ? `ট্রান্সফার ${transferNo} সফলভাবে বাতিল করা হয়েছে`
        : `Transfer ${transferNo} cancelled successfully`
    );
    onCancelSuccess?.();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-5 bg-card">
        <DialogHeader className="space-y-1.5 border-b border-border pb-3">
          <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
            <span>{isBangla ? "ট্রান্সফার বাতিল নিশ্চিতকরণ" : "Cancel Transfer Confirmation"}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground text-left">
            {isBangla
              ? `আপনি কি নিশ্চিত যে ট্রান্সফার #${transferNo} বাতিল করতে চান?`
              : `Are you sure you want to cancel transfer #${transferNo}?`}
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 text-xs text-muted-foreground">
          {isBangla
            ? "এই ট্রান্সফারটি বাতিল করলে সংশ্লিষ্ট প্রোডাক্ট স্টক পূর্বের অবস্থায় অপরিবর্তিত থাকবে।"
            : "Cancelling this transfer will abort stock movement. Unsent items will remain in the source warehouse balance."}
        </div>

        <DialogFooter className="pt-2 flex flex-row justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} className="h-9 text-xs cursor-pointer">
            {isBangla ? "ফিরে যান" : "Keep Transfer"}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirmCancel}
            className="h-9 text-xs font-bold cursor-pointer"
          >
            {isBangla ? "হ্যাঁ, বাতিল করুন" : "Yes, Cancel Transfer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
