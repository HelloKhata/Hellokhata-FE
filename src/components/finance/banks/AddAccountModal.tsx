"use client";

import React, { useState } from "react";
import { BankAccount, BankAccountType } from "@/types/bank";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle2, Wallet } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountAdded: (newAccount: BankAccount) => void;
  isBangla?: boolean;
}

export function AddAccountModal({
  isOpen,
  onClose,
  onAccountAdded,
  isBangla = false,
}: AddAccountModalProps) {
  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState<BankAccountType>("bank");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [branchName, setBranchName] = useState("Main Branch");
  const [openingBalance, setOpeningBalance] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!accountName.trim()) {
      setErrors({ accountName: isBangla ? "অ্যাকাউন্টের নাম লিখুন" : "Account name is required" });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      const balance = parseFloat(openingBalance) || 0;
      const createdAcc: BankAccount = {
        id: `acc-${Date.now()}`,
        accountName: accountName.trim(),
        accountType: accountType,
        bankName: bankName.trim() || undefined,
        accountNumber: accountNumber.trim() || undefined,
        branchName: branchName,
        recordedBalance: balance,
        importedStatementBalance: balance,
        unreconciledCount: 0,
        lastImportedDate: new Date().toISOString().split("T")[0],
      };

      setIsSubmitting(false);
      onAccountAdded(createdAcc);
      onClose();
      toast.success(
        isBangla
          ? `অ্যাকাউন্ট ${createdAcc.accountName} সফলভাবে যোগ করা হয়েছে`
          : `Account ${createdAcc.accountName} added successfully`
      );
    }, 400);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-5 bg-card">
        <DialogHeader className="space-y-1 border-b border-border pb-3">
          <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <Wallet className="h-4 w-4 text-primary" />
            <span>{isBangla ? "নতুন অ্যাকাউন্ট যোগ করুন" : "Add Bank or Mobile Wallet Account"}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isBangla
              ? "নতুন ব্যাংক, বিকাশ, নগদ, রকেট বা ক্যাশ ভল্ট অ্যাকাউন্ট এন্ট্রি করুন।"
              : "Register a new bank or wallet account for statement reconciliation."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-1 text-xs">
          {/* Account Name */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              {isBangla ? "অ্যাকাউন্টের নাম *" : "Account Name *"}
            </Label>
            <Input
              value={accountName}
              onChange={(e) => {
                setAccountName(e.target.value);
                if (errors.accountName) setErrors({});
              }}
              placeholder={isBangla ? "যেমন: ডাচ-বাংলা ব্যাংক লিমিটেড" : "e.g. Dutch-Bangla Bank - Main"}
              className={cn("h-9 bg-background/50 text-xs border-input", errors.accountName && "border-destructive")}
            />
            {errors.accountName && (
              <p className="text-[10px] text-destructive font-medium">{errors.accountName}</p>
            )}
          </div>

          {/* Account Type */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              {isBangla ? "অ্যাকাউন্টের ধরন *" : "Account Type *"}
            </Label>
            <Select value={accountType} onValueChange={(val: any) => setAccountType(val)}>
              <SelectTrigger className="h-9 text-xs bg-background/50 border-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank" className="text-xs">
                  🏦 Bank Account
                </SelectItem>
                <SelectItem value="bkash" className="text-xs">
                  📱 bKash Merchant
                </SelectItem>
                <SelectItem value="nagad" className="text-xs">
                  📱 Nagad Merchant
                </SelectItem>
                <SelectItem value="rocket" className="text-xs">
                  📱 Rocket Merchant
                </SelectItem>
                <SelectItem value="cash" className="text-xs">
                  💵 Cash Vault / Register
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Account Number & Opening Balance */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                {isBangla ? "অ্যাকাউন্ট / ফোন নম্বর" : "Account # / Phone"}
              </Label>
              <Input
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="e.g. 110.120.4412"
                className="h-9 bg-background/50 text-xs border-input font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                {isBangla ? "প্রারম্ভিক ব্যালেন্স (৳)" : "Opening Balance (৳)"}
              </Label>
              <Input
                type="number"
                inputMode="decimal"
                value={openingBalance}
                onChange={(e) => setOpeningBalance(e.target.value)}
                placeholder="0.00"
                className="h-9 bg-background/50 text-xs border-input font-mono font-bold"
              />
            </div>
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
                  <span>{isBangla ? "যোগ হচ্ছে..." : "Saving..."}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{isBangla ? "অ্যাকাউন্ট যোগ করুন" : "Add Account"}</span>
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
