"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Loader2, CheckCircle2, ShieldAlert } from "lucide-react";
import { useUpdateBatchDetails } from "@/hooks/api/useBatches";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { toast } from "sonner";

interface EditBatchDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchId: string;
  batchNumber: string;
  initialSupplier?: string;
  initialMfgDate?: string | null;
  initialNotes?: string;
}

export function EditBatchDetailsModal({
  isOpen,
  onClose,
  batchId,
  batchNumber,
  initialSupplier = "",
  initialMfgDate = null,
  initialNotes = "",
}: EditBatchDetailsModalProps) {
  const { isBangla } = useAppTranslation();
  const updateMutation = useUpdateBatchDetails();

  const [supplier, setSupplier] = useState(initialSupplier);
  const [mfgDate, setMfgDate] = useState(
    initialMfgDate ? new Date(initialMfgDate).toISOString().split("T")[0] : ""
  );
  const [notes, setNotes] = useState(initialNotes);

  useEffect(() => {
    if (isOpen) {
      setSupplier(initialSupplier || "");
      setMfgDate(initialMfgDate ? new Date(initialMfgDate).toISOString().split("T")[0] : "");
      setNotes(initialNotes || "");
    }
  }, [isOpen, initialSupplier, initialMfgDate, initialNotes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateMutation.mutateAsync({
        id: batchId,
        data: {
          supplier: supplier.trim() || undefined,
          manufacturing_date: mfgDate || undefined,
          notes: notes.trim() || undefined,
        },
      });
      toast.success(
        isBangla
          ? "ব্যাচের বিবরণ সফলভাবে হালনাগাদ করা হয়েছে"
          : "Batch details updated successfully"
      );
      onClose();
    } catch {
      // Handled by axios interceptor
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[92%] sm:w-full sm:max-w-md md:max-w-lg p-5 bg-card rounded-2xl">
        <DialogHeader className="space-y-1 border-b border-border pb-3">
          <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <Pencil className="h-4 w-4 text-primary" />
            {isBangla ? "ব্যাচ বিবরণ সম্পাদনা" : "Edit Batch Details"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isBangla
              ? `ব্যাচ #${batchNumber} এর তথ্য সম্পাদন করুন`
              : `Edit non-quantity fields for batch #${batchNumber}`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs">
          {/* Note about quantity restriction */}
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 flex items-start gap-2 text-[11px]">
            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
            <span>
              {isBangla
                ? "স্টক পরিমাণ এখানে সরাসরি সম্পাদনযোগ্য নয়। পরিমাণ পরিবর্তন করার জন্য অনুগ্রহ করে 'পরিমাণ সংশোধন' ব্যবহার করুন যাতে সমস্ত পরিবর্তন লগ করা হয়।"
                : "Quantity is not directly editable here. Quantity changes must go through the adjustment flow so a reason is always logged."}
            </span>
          </div>

          {/* Supplier */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              {isBangla ? "সরবরাহকারী (Supplier)" : "Supplier"}
            </Label>
            <Input
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              placeholder={isBangla ? "সরবরাহকারীর নাম..." : "Supplier name..."}
              className="h-9 text-xs bg-background border-input"
            />
          </div>

          {/* Manufacturing Date */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              {isBangla ? "উৎপাদনের তারিখ (Manufacturing Date)" : "Manufacturing Date"}
            </Label>
            <Input
              type="date"
              value={mfgDate}
              onChange={(e) => setMfgDate(e.target.value)}
              className="h-9 text-xs bg-background border-input font-mono"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              {isBangla ? "মন্তব্য (Notes)" : "Notes"}
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isBangla ? "অতিরিক্ত বিবরণ বা মন্তব্য..." : "Additional notes..."}
              className="h-20 text-xs bg-background border-input resize-none"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-9 text-xs font-medium cursor-pointer"
            >
              {isBangla ? "বাতিল" : "Cancel"}
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="h-9 text-xs font-bold gap-1.5 cursor-pointer shadow-xs"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {isBangla ? "সংরক্ষণ হচ্ছে..." : "Saving..."}
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {isBangla ? "সংরক্ষণ করুন" : "Save Changes"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
