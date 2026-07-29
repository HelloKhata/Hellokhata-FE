"use client";

import React, { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SlidersHorizontal,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useAdjustBatch } from "@/hooks/api/useBatches";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AdjustmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  batchId: string;
  batchNumber: string;
  currentQuantity: number;
  unit: string;
}

const ADJUSTMENT_REASONS = [
  { value: "count_correction", en: "Count Correction", bn: "গণনা সংশোধন" },
  { value: "damage", en: "Damage / Expired", bn: "ক্ষতিগ্রস্ত / মেয়াদোত্তীর্ণ" },
  { value: "theft", en: "Theft / Loss", bn: "চুরি / হ্রাস" },
  { value: "other", en: "Other Reason", bn: "অন্যান্য কারণ" },
];

export function AdjustmentForm({
  isOpen,
  onClose,
  batchId,
  batchNumber,
  currentQuantity,
  unit,
}: AdjustmentFormProps) {
  const { isBangla } = useAppTranslation();
  const adjustMutation = useAdjustBatch();

  const [quantityDelta, setQuantityDelta] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [otherReason, setOtherReason] = useState("");
  const [notes, setNotes] = useState("");

  const deltaNum = parseInt(quantityDelta, 10) || 0;
  const newQuantity = currentQuantity + deltaNum;
  const isValid = deltaNum !== 0 && reason !== "" && newQuantity >= 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const finalReason =
      reason === "other"
        ? (otherReason || "Other") + (notes ? ` (${notes})` : "")
        : reason + (notes ? ` (${notes})` : "");

    try {
      await adjustMutation.mutateAsync({
        id: batchId,
        data: { quantity_delta: deltaNum, reason: finalReason },
      });
      toast.success(
        isBangla
          ? `পরিমাণ সফলভাবে সংশোধিত হয়েছে। নতুন পরিমাণ: ${newQuantity} ${unit}`
          : `Quantity adjusted. New quantity: ${newQuantity} ${unit}`
      );
      setQuantityDelta("");
      setReason("");
      setOtherReason("");
      setNotes("");
      onClose();
    } catch {
      // Error handled by interceptor
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[92%] sm:w-full sm:max-w-md md:max-w-lg p-5 bg-card rounded-2xl">
        <DialogHeader className="space-y-1 border-b border-border pb-3">
          <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            {isBangla ? "স্টক পরিমাণ সংশোধন" : "Stock Quantity Adjustment"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isBangla
              ? `ব্যাচ #${batchNumber} এর ইনভেন্টরি ব্যালেন্স আপডেট করুন`
              : `Adjust inventory balance for batch #${batchNumber}`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs">
          {/* Quantity Delta Input */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              {isBangla ? "সংশোধন পরিমাণ (+ বা -)" : "Adjustment Delta (+ or -)"}
            </Label>
            <Input
              type="number"
              value={quantityDelta}
              onChange={(e) => setQuantityDelta(e.target.value)}
              placeholder={isBangla ? "যেমন: -5 বা +10" : "e.g. -5 or +10"}
              className="h-10 text-base font-mono font-bold bg-background border-input"
              autoFocus
            />
          </div>

          {/* Structured Preview Cards */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-muted/40 rounded-xl border border-border/60 text-center">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                {isBangla ? "বর্তমান" : "Current"}
              </span>
              <div className="font-mono font-bold text-sm text-foreground">
                {currentQuantity}
              </div>
            </div>

            <div className="space-y-0.5 border-x border-border/40 px-1">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                {isBangla ? "সংশোধন" : "Adjustment"}
              </span>
              <div
                className={cn(
                  "font-mono font-bold text-sm",
                  deltaNum > 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : deltaNum < 0
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-muted-foreground"
                )}
              >
                {deltaNum > 0 ? `+${deltaNum}` : deltaNum}
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                {isBangla ? "নতুন পরিমাণ" : "New Quantity"}
              </span>
              <div
                className={cn(
                  "font-mono font-bold text-sm",
                  newQuantity < 0 ? "text-rose-600" : "text-primary"
                )}
              >
                {newQuantity} {unit}
              </div>
            </div>
          </div>

          {newQuantity < 0 && (
            <div className="flex items-center gap-1.5 p-2 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-600 text-[11px] font-medium">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span>
                {isBangla
                  ? "নতুন পরিমাণ নেতিবাচক হতে পারে না।"
                  : "New resulting quantity cannot be negative."}
              </span>
            </div>
          )}

          {/* Reason Selector */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              {isBangla ? "সংশোধনের কারণ" : "Reason"}
            </Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="h-9 text-xs bg-background border-input">
                <SelectValue placeholder={isBangla ? "কারণ নির্বাচন করুন" : "Select reason"} />
              </SelectTrigger>
              <SelectContent>
                {ADJUSTMENT_REASONS.map((r) => (
                  <SelectItem key={r.value} value={r.value} className="text-xs font-medium">
                    {isBangla ? r.bn : r.en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {reason === "other" && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                {isBangla ? "কারণ উল্লেখ করুন" : "Specify reason"}
              </Label>
              <Input
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                placeholder={isBangla ? "কারণ..." : "Reason details..."}
                className="h-9 text-xs bg-background border-input"
              />
            </div>
          )}

          {/* Optional Notes */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">
              {isBangla ? "মন্তব্য (ঐচ্ছিক)" : "Optional Notes"}
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isBangla ? "অতিরিক্ত বিবরণ..." : "Additional details..."}
              className="h-16 text-xs bg-background border-input resize-none"
            />
          </div>

          {/* Buttons */}
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
              disabled={!isValid || adjustMutation.isPending}
              className="h-9 text-xs font-bold gap-1.5 cursor-pointer shadow-xs"
            >
              {adjustMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {isBangla ? "সংরক্ষণ হচ্ছে..." : "Saving..."}
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {isBangla ? "সংশোধন নিশ্চিত করুন" : "Confirm Adjustment"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
