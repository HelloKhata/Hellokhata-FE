"use client";

import React, { useState, useEffect } from "react";
import { SupplierBill } from "@/types/payable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2, CheckCircle2, DollarSign, CreditCard } from "lucide-react";
import { useCurrency } from "@/hooks/useAppTranslation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PayBillModalProps {
  bill: SupplierBill | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (
    billId: string,
    amount: number,
    method: string,
    referenceNo?: string,
    note?: string
  ) => void;
  isBangla?: boolean;
}

export function PayBillModal({
  bill,
  isOpen,
  onClose,
  onPaymentSuccess,
  isBangla = false,
}: PayBillModalProps) {
  const { formatCurrency } = useCurrency();

  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState<Date>(new Date());
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "bank" | "bkash" | "nagad" | "rocket">("cash");
  const [referenceNo, setReferenceNo] = useState("");
  const [note, setNote] = useState("");

  const [errors, setErrors] = useState<{ amount?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (bill) {
      setAmount("");
      setReferenceNo("");
      setNote("");
      setErrors({});
      setPaymentDate(new Date());
    }
  }, [bill, isOpen]);

  if (!bill) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numericAmount = parseFloat(amount);

    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      setErrors({
        amount: isBangla ? "অনুগ্রহ করে ০ এর বেশি পরিমাণ লিখুন" : "Enter a valid amount > 0",
      });
      return;
    }

    if (numericAmount > bill.outstandingAmount) {
      setErrors({
        amount: isBangla
          ? `পেমেন্ট পরিমাণ প্রদেয় বকেয়া (${formatCurrency(bill.outstandingAmount)}) এর চেয়ে বেশি হতে পারে না`
          : `Amount cannot exceed bill balance (${formatCurrency(bill.outstandingAmount)})`,
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      onPaymentSuccess(
        bill.id,
        numericAmount,
        paymentMethod,
        referenceNo.trim() || undefined,
        note.trim() || undefined
      );
      onClose();
      toast.success(
        isBangla
          ? `${bill.supplierName}-এর বিল ${bill.billNumber}-এ ৳${numericAmount.toLocaleString()} পেমেন্ট সফলভাবে রেকর্ড করা হয়েছে`
          : `Payment of ৳${numericAmount.toLocaleString()} recorded for ${bill.billNumber}`
      );
    }, 400);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-5 bg-card">
        <DialogHeader className="space-y-1.5 border-b border-border pb-3">
          <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <CreditCard className="h-4 w-4" />
            </div>
            <span>{isBangla ? "বিল পরিশোধের পেমেন্ট রেকর্ড করুন" : "Record Supplier Bill Payment"}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground font-mono">
            {bill.supplierName} • {bill.billNumber}
          </DialogDescription>
        </DialogHeader>

        {/* Outstanding Balance Summary Banner */}
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 flex justify-between items-center text-xs">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide block">
              {isBangla ? "বর্তমান প্রদেয় বকেয়া" : "Current Outstanding Due"}
            </span>
            <span className="font-bold text-foreground text-xs">{bill.billNumber}</span>
          </div>
          <span className="text-base font-bold font-mono text-amber-600 dark:text-amber-400">
            {formatCurrency(bill.outstandingAmount)}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
          {/* Payment Amount Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-semibold text-foreground">
                {isBangla ? "পেমেন্ট পরিমাণ (Amount) *" : "Payment Amount *"}
              </Label>
              <button
                type="button"
                onClick={() => setAmount(bill.outstandingAmount.toString())}
                className="text-[10px] text-primary hover:underline font-semibold cursor-pointer"
              >
                {isBangla ? "পূর্ণ পরিশোধ (Full)" : "Full Amount"}
              </button>
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-sm font-bold text-muted-foreground font-mono">
                ৳
              </span>
              <Input
                type="number"
                inputMode="decimal"
                step="any"
                min="1"
                max={bill.outstandingAmount}
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errors.amount) setErrors({});
                }}
                className={cn(
                  "pl-8 h-10 text-base font-bold font-mono bg-background/50 border-input",
                  errors.amount && "border-destructive ring-1 ring-destructive/30"
                )}
                autoFocus
              />
            </div>
            {errors.amount && (
              <p className="text-[10px] text-destructive font-medium pl-0.5">{errors.amount}</p>
            )}
          </div>

          {/* Grid: Payment Date & Payment Method */}
          <div className="grid grid-cols-2 gap-3">
            {/* Payment Date */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                {isBangla ? "তারিখ (Date) *" : "Payment Date *"}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-10 justify-between text-left font-normal bg-background/50 border-input text-foreground text-xs px-2.5"
                  >
                    <span>{format(paymentDate, "dd MMM yyyy")}</span>
                    <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={paymentDate}
                    onSelect={(date) => date && setPaymentDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Payment Method */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                {isBangla ? "পদ্ধতি *" : "Payment Method *"}
              </Label>
              <Select
                value={paymentMethod}
                onValueChange={(val: any) => setPaymentMethod(val)}
              >
                <SelectTrigger className="h-10 text-xs bg-background/50 border-input w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash" className="text-xs">
                    💵 Cash
                  </SelectItem>
                  <SelectItem value="bank" className="text-xs">
                    🏦 Bank
                  </SelectItem>
                  <SelectItem value="bkash" className="text-xs">
                    📱 bKash
                  </SelectItem>
                  <SelectItem value="nagad" className="text-xs">
                    📱 Nagad
                  </SelectItem>
                  <SelectItem value="rocket" className="text-xs">
                    📱 Rocket
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reference Number */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              {isBangla ? "রেফারেন্স বা চেক নম্বর" : "Reference / Transaction ID (Optional)"}
            </Label>
            <Input
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value)}
              placeholder="e.g. TXN-9981 or Check #445"
              className="h-9 bg-background/50 text-xs border-input font-mono"
            />
          </div>

          {/* Optional Note */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              {isBangla ? "নোট বা বিবরণ (Note)" : "Note (Optional)"}
            </Label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={isBangla ? "পেমেন্ট সম্পর্কিত কোনো বিবরণ..." : "Enter payment notes..."}
              className="h-16 bg-background/50 border-input text-xs resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-10 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{isBangla ? "রেকর্ড হচ্ছে..." : "Saving..."}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{isBangla ? "পেমেন্ট জমা করুন" : "Record Payment"}</span>
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-10 text-xs px-4 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {isBangla ? "বাতিল" : "Cancel"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
