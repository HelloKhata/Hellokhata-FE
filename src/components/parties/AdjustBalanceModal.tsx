// Hello Khata - Adjust Balance Modal Component
// Modal to adjust a party's balance (Add Balance or Reduce Balance)

"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useQueryClient } from "@tanstack/react-query";
import client from "@/lib/axios";

interface AdjustBalanceComponentProps {
  isOpen: boolean;
  onClose: () => void;
  partyId: string;
  partyName: string;
  currentBalance: number; // Positive is receivable, negative is payable
  onSuccess?: () => void;
}

export function AdjustBalanceModal({
  isOpen,
  onClose,
  partyId,
  partyName,
  currentBalance,
  onSuccess,
}: AdjustBalanceComponentProps) {
  const { isBangla } = useAppTranslation();
  const queryClient = useQueryClient();

  const [adjustmentType, setAdjustmentType] = useState<"add" | "reduce">("add");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [isPending, setIsPending] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setAdjustmentType("add");
      setAmount("");
      setDate(new Date());
      setRemarks("");
    }
  }, [isOpen]);

  // Calculate adjusted balance
  const parsedAmount = parseFloat(amount) || 0;
  const adjustedBalance =
    adjustmentType === "add"
      ? currentBalance + parsedAmount
      : currentBalance - parsedAmount;

  const handleConfirm = async () => {
    if (!amount || parsedAmount <= 0) {
      toast.error(
        isBangla
          ? "দয়া করে সঠিক পরিমাণ লিখুন"
          : "Please enter a valid adjustment amount"
      );
      return;
    }

    setIsPending(true);
    try {
      await client.post("/api/parties/adjust-balance", {
        partyId,
        type: adjustmentType,
        amount: parsedAmount,
        date: date.toISOString(),
        remarks,
      });

      toast.success(
        isBangla
          ? "ব্যালেন্স সমন্বয় সফল হয়েছে!"
          : "Balance adjusted successfully!"
      );

      // Invalidate queries to refresh details & ledger
      queryClient.invalidateQueries({ queryKey: ["party", partyId] });
      queryClient.invalidateQueries({ queryKey: ["parties"] });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      const errMsg =
        err.response?.data?.message ||
        (isBangla ? "ব্যালেন্স সমন্বয় ব্যর্থ হয়েছে" : "Balance adjustment failed");
      toast.error(errMsg);
    } finally {
      setIsPending(false);
    }
  };

  const isReduce = adjustmentType === "reduce";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[480px] p-6 rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <DialogTitle className="text-lg font-bold text-foreground">
            {isBangla ? "ব্যালেন্স সমন্বয়" : "Adjust Balance"}
          </DialogTitle>
        </div>

        {/* Form Body */}
        <div className="space-y-5 pt-4">
          {/* Party Display Context */}
          {/* <div className="text-sm text-muted-foreground">
            {isBangla ? "পার্টি: " : "Party: "}
            <span className="font-semibold text-foreground">{partyName}</span>
          </div> */}

          {/* Adjustment Type Selector */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground">
              {isBangla ? "সমন্বয়ের ধরন" : "Adjustment Type"}
            </Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAdjustmentType("add")}
                className={cn(
                  "flex-1 py-2 px-4 text-sm font-semibold rounded-lg border transition-all duration-200 cursor-pointer",
                  adjustmentType === "add"
                    ? "bg-primary/10 text-primary border-primary/20 shadow-sm"
                    : "bg-transparent text-muted-foreground border-border hover:bg-muted/50"
                )}
              >
                {isBangla ? "ব্যালেন্স যোগ করুন" : "Add Balance"}
              </button>
              <button
                type="button"
                onClick={() => setAdjustmentType("reduce")}
                className={cn(
                  "flex-1 py-2 px-4 text-sm font-semibold rounded-lg border transition-all duration-200 cursor-pointer",
                  adjustmentType === "reduce"
                    ? "bg-red-50 text-red-700 border-red-200 shadow-sm"
                    : "bg-transparent text-muted-foreground border-border hover:bg-muted/50"
                )}
              >
                {isBangla ? "ব্যালেন্স কমান" : "Reduce Balance"}
              </button>
            </div>
          </div>

          {/* Amount & Date in 2-column layout */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                {isBangla ? "সমন্বয় পরিমাণ" : "Adjustment Amount"}
              </Label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-sm text-muted-foreground font-semibold">
                  Tk.
                </span>
                <Input
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-9 h-11 bg-background/50 border-input text-foreground font-bold focus:ring-1 focus:ring-primary"
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                {isBangla ? "তারিখ অনুযায়ী" : "As of Date"}
              </Label>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-11 justify-between text-left font-normal bg-background/50 border-input text-foreground hover:bg-muted/50"
                  >
                    <span>{format(date, "dd MMM yyyy")}</span>
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                      if (selectedDate) setDate(selectedDate);
                      setDatePickerOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Remarks */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">
              {isBangla ? "মন্তব্য" : "Remarks"}
            </Label>
            <Textarea
              placeholder={isBangla ? "এখানে মন্তব্য লিখুন..." : "Enter remarks here..."}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="min-h-[80px] bg-background/50 border-input text-foreground resize-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Summary Box */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2.5">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">
                {isBangla ? "বর্তমান ব্যালেন্স" : "Current Balance"}
              </span>
              <span className="font-semibold text-primary">
                Tk. {currentBalance.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm pt-2 border-t border-dashed border-border">
              <span className="text-muted-foreground">
                {isBangla ? "সমন্বিত ব্যালেন্স" : "Adjusted Balance"}
              </span>
              <span className="font-bold text-primary">
                Tk. {adjustedBalance.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-border mt-5">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="h-11 px-5 border-input hover:bg-muted text-foreground font-semibold rounded-lg"
          >
            {isBangla ? "বাতিল" : "Cancel"}
          </Button>

          <Button
            onClick={handleConfirm}
            disabled={isPending}
            className={cn(
              "h-11 px-5 font-semibold shadow-md rounded-lg transition-colors duration-200",
              isReduce
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-primary hover:bg-primary/90 text-primary-foreground"
            )}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {isBangla ? "সমন্বয় হচ্ছে..." : "Adjusting..."}
              </span>
            ) : (
              isBangla ? "সমন্বয় নিশ্চিত করুন" : "Confirm Adjustment"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
