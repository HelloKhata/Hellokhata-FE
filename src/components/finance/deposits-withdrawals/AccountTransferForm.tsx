"use client";

import React, { useState } from "react";
import { TransferMode, TransferRecord } from "@/types/transfer";
import { TransferModeToggle } from "./TransferModeToggle";
import { AccountSelector, DEFAULT_ACCOUNTS } from "./AccountSelector";
import { BranchSelector } from "./BranchSelector";
import { AmountInput } from "../money-entry/AmountInput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar as CalendarIcon,
  Mic,
  Loader2,
  CheckCircle,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AccountTransferFormProps {
  mode: TransferMode;
  onModeChange: (mode: TransferMode) => void;
  onSubmitSuccess: (record: TransferRecord) => void;
  isBangla?: boolean;
  defaultBranch?: string;
}

export function AccountTransferForm({
  mode,
  onModeChange,
  onSubmitSuccess,
  isBangla = false,
  defaultBranch = "Main Branch",
}: AccountTransferFormProps) {
  // Form States
  const [selectedAccountId, setSelectedAccountId] = useState("cash");
  const [amount, setAmount] = useState("");
  const [transferDate, setTransferDate] = useState<Date>(new Date());
  const [branchName, setBranchName] = useState(defaultBranch);
  const [memo, setMemo] = useState("");

  // Status & Validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const resetForm = () => {
    setAmount("");
    setMemo("");
    setErrors({});
  };

  const handleVoiceInput = () => {
    setIsListening(true);
    toast.info(isBangla ? "ভয়েস ইনপুট শুনছে..." : "Listening for voice note...");
    setTimeout(() => {
      setIsListening(false);
      if (!memo) {
        setMemo(isBangla ? "নগদ কাউন্টারে জমা সম্পন্ন" : "Cash register count verification");
        toast.success(isBangla ? "ভয়েস নোট যোগ করা হয়েছে" : "Voice note added successfully");
      }
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!selectedAccountId) {
      newErrors.account = isBangla ? "অ্যাকাউন্ট নির্বাচন করুন" : "Please select an account";
    }

    const numericAmount = parseFloat(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      newErrors.amount = isBangla
        ? "অনুগ্রহ করে ০-এর বেশি পরিমাণ লিখুন"
        : "Please enter a valid amount greater than 0";
    }

    if (!branchName) {
      newErrors.branch = isBangla ? "শাখা নির্বাচন করুন" : "Please select a branch";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const accountObj = DEFAULT_ACCOUNTS.find((a) => a.id === selectedAccountId);

    setTimeout(() => {
      const newRecord: TransferRecord = {
        id: `tr-${Date.now()}`,
        type: mode,
        accountId: selectedAccountId,
        accountName: accountObj ? (isBangla ? accountObj.nameBn : accountObj.name) : selectedAccountId,
        accountIcon: accountObj ? accountObj.icon : "💵",
        branchId: branchName.toLowerCase().replace(/\s+/g, "-"),
        branchName: branchName,
        amount: numericAmount,
        date: format(transferDate, "yyyy-MM-dd"),
        memo: memo.trim() || undefined,
        createdAt: new Date(),
      };

      setIsSubmitting(false);
      resetForm();
      onSubmitSuccess(newRecord);

      toast.success(
        isBangla
          ? mode === "deposit"
            ? "টাকা জমা সফলভাবে সম্পন্ন হয়েছে"
            : "উত্তোলন সফলভাবে সম্পন্ন হয়েছে"
          : mode === "deposit"
          ? "Deposit recorded successfully"
          : "Withdrawal recorded successfully"
      );
    }, 400);
  };

  const isDeposit = mode === "deposit";

  return (
    <div className="bg-card border border-border rounded-xl shadow-2xs overflow-hidden">
      {/* Header with Mode Selector */}
      <div className="p-4 sm:p-5 border-b border-border space-y-4 bg-muted/20">
        <TransferModeToggle mode={mode} onChange={onModeChange} isBangla={isBangla} />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "p-2 rounded-lg shrink-0",
                isDeposit
                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
              )}
            >
              {isDeposit ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-foreground leading-snug">
                {isDeposit
                  ? isBangla
                    ? "অ্যাকাউন্টে টাকা জমা (Deposit)"
                    : "Deposit Money"
                  : isBangla
                  ? "অ্যাকাউন্ট থেকে উত্তোলন (Withdrawal)"
                  : "Withdraw Money"}
              </h2>
              <p className="text-[11px] text-muted-foreground">
                {isDeposit
                  ? isBangla
                    ? "ক্যাশ, ব্যাংক বা ওয়ালেটে টাকা জমা করুন"
                    : "Add money to cash, bank or mobile wallet"
                  : isBangla
                  ? "অ্যাকাউন্ট থেকে টাকা উত্তোলন বা স্থানান্তরণ করুন"
                  : "Move money out of account"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Transfer Form */}
      <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
        {/* Account Selection */}
        <AccountSelector
          value={selectedAccountId}
          onChange={(val) => {
            setSelectedAccountId(val);
            if (errors.account) setErrors((prev) => ({ ...prev, account: "" }));
          }}
          isBangla={isBangla}
          error={errors.account}
        />

        {/* Large Amount Input */}
        <AmountInput
          value={amount}
          onChange={(val) => {
            setAmount(val);
            if (errors.amount) setErrors((prev) => ({ ...prev, amount: "" }));
          }}
          error={errors.amount}
          isBangla={isBangla}
          autoFocus={false}
        />

        {/* Grid for Date and Branch */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Transfer Date */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              {isBangla ? "তারিখ (Date) *" : "Date *"}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-10 justify-between text-left font-normal bg-background/50 border-input text-foreground text-xs px-3"
                >
                  <span className="font-medium">{format(transferDate, "dd MMM yyyy")}</span>
                  <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={transferDate}
                  onSelect={(date) => date && setTransferDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Branch Selector */}
          <BranchSelector
            value={branchName}
            onChange={(val) => {
              setBranchName(val);
              if (errors.branch) setErrors((prev) => ({ ...prev, branch: "" }));
            }}
            isBangla={isBangla}
            error={errors.branch}
            label={isBangla ? "শাখা (Branch) *" : "Branch *"}
          />
        </div>

        {/* Memo Input with Voice Icon */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold text-foreground">
              {isBangla ? "মেমো বা নোট (Memo)" : "Memo (Optional)"}
            </Label>
            <button
              type="button"
              onClick={handleVoiceInput}
              title={isBangla ? "ভয়েস নোট যোগ করুন" : "Voice input note"}
              className={cn(
                "p-1 rounded-md text-xs flex items-center gap-1 transition-colors cursor-pointer",
                isListening
                  ? "text-rose-500 animate-pulse bg-rose-500/10"
                  : "text-muted-foreground hover:text-primary hover:bg-muted"
              )}
            >
              <Mic className="h-3.5 w-3.5" />
              <span className="text-[10px] font-medium">{isBangla ? "ভয়েস" : "Voice"}</span>
            </button>
          </div>
          <Textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder={
              isBangla
                ? "টাকা স্থানান্তরের একটি নোট বা মেমো লিখুন..."
                : "Add a note about this transfer..."
            }
            className="h-20 bg-background/50 border-input text-xs resize-none focus-visible:ring-1"
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-border/60">
          <Button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "flex-1 h-10 font-semibold text-xs transition-all cursor-pointer gap-2",
              isDeposit
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                : "bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{isBangla ? "সংরক্ষণ হচ্ছে..." : "Saving..."}</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>
                  {isDeposit
                    ? isBangla
                      ? "জমা সংরক্ষণ করুন (Save Deposit)"
                      : "Save Deposit"
                    : isBangla
                    ? "উত্তোলন সংরক্ষণ করুন (Save Withdrawal)"
                    : "Save Withdrawal"}
                </span>
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            disabled={isSubmitting}
            className="h-10 text-xs px-3 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            <span>{isBangla ? "রিসেট" : "Cancel"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
