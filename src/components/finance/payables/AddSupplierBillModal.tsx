"use client";

import React, { useState } from "react";
import { SupplierBill, PayableAgingBucket } from "@/types/payable";
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
import { Calendar as CalendarIcon, Loader2, CheckCircle2, FilePlus, Users } from "lucide-react";
import { BranchSelector } from "../deposits-withdrawals/BranchSelector";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AddSupplierBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBillCreated: (newBill: SupplierBill) => void;
  isBangla?: boolean;
}

export function AddSupplierBillModal({
  isOpen,
  onClose,
  onBillCreated,
  isBangla = false,
}: AddSupplierBillModalProps) {
  const [supplierName, setSupplierName] = useState("");
  const [supplierPhone, setSupplierPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [billNumber, setBillNumber] = useState(`BILL-${Math.floor(1000 + Math.random() * 9000)}`);
  const [dueDate, setDueDate] = useState<Date>(new Date(Date.now() + 30 * 86400000));
  const [branchName, setBranchName] = useState("Main Branch");
  const [linkedPurchaseNo, setLinkedPurchaseNo] = useState("");
  const [notes, setNotes] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setSupplierName("");
    setSupplierPhone("");
    setAmount("");
    setLinkedPurchaseNo("");
    setNotes("");
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!supplierName.trim()) {
      newErrors.supplier = isBangla ? "সরবরাহকারীর নাম লিখুন" : "Please enter supplier name";
    }

    const numericAmount = parseFloat(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      newErrors.amount = isBangla ? "অনুগ্রহ করে ০ এর বেশি পরিমাণ লিখুন" : "Enter a valid amount > 0";
    }

    if (!branchName) {
      newErrors.branch = isBangla ? "শাখা নির্বাচন করুন" : "Select a branch";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      const issueDateStr = new Date().toISOString().split("T")[0];
      const dueDateStr = format(dueDate, "yyyy-MM-dd");

      const createdBill: SupplierBill = {
        id: `bill-${Date.now()}`,
        billNumber: billNumber.trim() || `BILL-${Date.now()}`,
        supplierId: `sup-${Date.now()}`,
        supplierName: supplierName.trim(),
        supplierPhone: supplierPhone.trim() || undefined,
        totalAmount: numericAmount,
        paidAmount: 0,
        outstandingAmount: numericAmount,
        issueDate: issueDateStr,
        dueDate: dueDateStr,
        agingBucket: "current",
        agingDays: 0,
        branchId: branchName.toLowerCase().replace(/\s+/g, "-"),
        branchName: branchName,
        status: "unpaid",
        linkedPurchaseNo: linkedPurchaseNo.trim() || undefined,
        notes: notes.trim() || undefined,
        paymentHistory: [],
        createdAt: new Date(),
      };

      setIsSubmitting(false);
      onBillCreated(createdBill);
      resetForm();
      onClose();
      toast.success(
        isBangla
          ? `বিল ${createdBill.billNumber} সফলভাবে যোগ করা হয়েছে`
          : `Supplier bill ${createdBill.billNumber} created successfully`
      );
    }, 400);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-5 bg-card">
        <DialogHeader className="space-y-1.5 border-b border-border pb-3">
          <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <FilePlus className="h-4 w-4" />
            </div>
            <span>{isBangla ? "নতুন সরবরাহকারী বিল যোগ করুন" : "Add Supplier Bill"}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isBangla
              ? "সরবরাহকারীর নতুন ম্যানুয়াল বিল বা ইনভয়েস এন্ট্রি করুন।"
              : "Create a new supplier bill or manual liability entry."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-1 text-xs">
          {/* Supplier Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                {isBangla ? "সরবরাহকারী (Supplier) *" : "Supplier Name *"}
              </Label>
              <Input
                value={supplierName}
                onChange={(e) => {
                  setSupplierName(e.target.value);
                  if (errors.supplier) setErrors((prev) => ({ ...prev, supplier: "" }));
                }}
                placeholder={isBangla ? "সরবরাহকারীর নাম" : "e.g. ABC Traders"}
                className={cn("h-9 bg-background/50 text-xs border-input", errors.supplier && "border-destructive")}
              />
              {errors.supplier && (
                <p className="text-[10px] text-destructive font-medium">{errors.supplier}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                {isBangla ? "মোবাইল (Phone)" : "Phone (Optional)"}
              </Label>
              <Input
                value={supplierPhone}
                onChange={(e) => setSupplierPhone(e.target.value)}
                placeholder="017xxxxxxxx"
                className="h-9 bg-background/50 text-xs border-input font-mono"
              />
            </div>
          </div>

          {/* Amount & Bill Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                {isBangla ? "বিল পরিমাণ (Amount) *" : "Bill Amount *"}
              </Label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-bold text-muted-foreground font-mono">
                  ৳
                </span>
                <Input
                  type="number"
                  inputMode="decimal"
                  step="any"
                  min="1"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (errors.amount) setErrors((prev) => ({ ...prev, amount: "" }));
                  }}
                  className={cn(
                    "pl-8 h-9 text-xs font-bold font-mono bg-background/50 border-input",
                    errors.amount && "border-destructive"
                  )}
                />
              </div>
              {errors.amount && (
                <p className="text-[10px] text-destructive font-medium">{errors.amount}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                {isBangla ? "বিল নম্বর" : "Bill Number"}
              </Label>
              <Input
                value={billNumber}
                onChange={(e) => setBillNumber(e.target.value)}
                placeholder="BILL-xxxx"
                className="h-9 bg-background/50 text-xs border-input font-mono"
              />
            </div>
          </div>

          {/* Due Date & Branch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                {isBangla ? "পরিশোধের তারিখ *" : "Due Date *"}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-9 justify-between text-left font-normal bg-background/50 border-input text-foreground text-xs px-2.5"
                  >
                    <span>{format(dueDate, "dd MMM yyyy")}</span>
                    <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={(date) => date && setDueDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <BranchSelector
              value={branchName}
              onChange={(val) => {
                setBranchName(val);
                if (errors.branch) setErrors((prev) => ({ ...prev, branch: "" }));
              }}
              isBangla={isBangla}
              error={errors.branch}
              label={isBangla ? "শাখা (Branch) *" : "Branch *"}
              compact
            />
          </div>

          {/* Linked Purchase Ref */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              {isBangla ? "সংযুক্ত ক্রয় চালান নম্বর (Linked Purchase Ref)" : "Linked Purchase Ref (Optional)"}
            </Label>
            <Input
              value={linkedPurchaseNo}
              onChange={(e) => setLinkedPurchaseNo(e.target.value)}
              placeholder="e.g. #PUR-1052"
              className="h-9 bg-background/50 text-xs border-input font-mono"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              {isBangla ? "মন্তব্য (Notes)" : "Notes (Optional)"}
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isBangla ? "বিলের বিশেষ নির্দেশনা..." : "Enter bill description or notes..."}
              className="h-16 bg-background/50 border-input text-xs resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-9 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{isBangla ? "তৈরি হচ্ছে..." : "Creating..."}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{isBangla ? "বিল তৈরি করুন" : "Create Bill"}</span>
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-9 text-xs px-4 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {isBangla ? "বাতিল" : "Cancel"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
