"use client";

import React, { useEffect } from "react";
import { COAAccount, AccountCategory, accountFormSchema, AccountFormValues } from "@/types/finance-settings";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { FolderTree, CheckCircle2, Loader2 } from "lucide-react";
import { BranchSelector } from "../deposits-withdrawals/BranchSelector";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AddAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAccount: (accountData: Partial<COAAccount>) => void;
  initialAccount?: COAAccount | null;
  allAccounts?: COAAccount[];
  isBangla?: boolean;
}

export function AddAccountDialog({
  isOpen,
  onClose,
  onSaveAccount,
  initialAccount = null,
  allAccounts = [],
  isBangla = false,
}: AddAccountDialogProps) {
  const isEditing = !!initialAccount;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: "",
      code: "",
      category: "assets",
      accountType: "Current Asset",
      parentAccountId: "",
      openingBalance: 0,
      description: "",
      branchName: "Main Branch",
      status: "active",
    },
  });

  const selectedCategory = watch("category");

  useEffect(() => {
    if (initialAccount) {
      reset({
        name: initialAccount.name,
        code: initialAccount.code,
        category: initialAccount.category,
        accountType: initialAccount.accountType,
        parentAccountId: initialAccount.parentAccountId || "",
        openingBalance: initialAccount.openingBalance || 0,
        description: initialAccount.description || "",
        branchName: initialAccount.branchName || "Main Branch",
        status: initialAccount.status,
      });
    } else {
      reset({
        name: "",
        code: `${Math.floor(1000 + Math.random() * 9000)}`,
        category: "assets",
        accountType: "Current Asset",
        parentAccountId: "",
        openingBalance: 0,
        description: "",
        branchName: "Main Branch",
        status: "active",
      });
    }
  }, [initialAccount, isOpen, reset]);

  const onSubmitForm = (values: AccountFormValues) => {
    onSaveAccount({
      ...values,
      id: initialAccount ? initialAccount.id : `acc-${Date.now()}`,
      currentBalance: values.openingBalance,
      hasTransactions: initialAccount ? initialAccount.hasTransactions : false,
    });
    onClose();
    toast.success(
      isBangla
        ? `হিসাব খাত ${values.name} সফলভাবে সংরক্ষণ করা হয়েছে`
        : `Chart of account ${values.name} saved successfully`
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-5 bg-card">
        <DialogHeader className="space-y-1 border-b border-border pb-3">
          <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <FolderTree className="h-4 w-4 text-primary" />
            <span>
              {isEditing
                ? isBangla ? "হিসাব খাত সংশোধন করুন" : "Edit Chart of Account"
                : isBangla ? "নতুন হিসাব খাত যোগ করুন" : "Add Chart of Account"}
            </span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isBangla
              ? "নতুন কোড ও লেজার ক্যাটাগরি কনফিগার করুন।"
              : "Configure account code, name, category, and opening balance."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-3.5 pt-1 text-xs">
          {/* Category & Code */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground">Category *</Label>
              <Select
                value={selectedCategory}
                onValueChange={(val: AccountCategory) => setValue("category", val)}
              >
                <SelectTrigger className="h-9 text-xs bg-background/50 border-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="assets" className="text-xs">Assets (1000)</SelectItem>
                  <SelectItem value="liabilities" className="text-xs">Liabilities (2000)</SelectItem>
                  <SelectItem value="equity" className="text-xs">Equity (3000)</SelectItem>
                  <SelectItem value="income" className="text-xs">Income (4000)</SelectItem>
                  <SelectItem value="expenses" className="text-xs">Expenses (5000)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground">Account Code *</Label>
              <Input
                {...register("code")}
                placeholder="e.g. 1010"
                className={cn("h-9 bg-background/50 text-xs border-input font-mono font-bold", errors.code && "border-destructive")}
              />
              {errors.code && (
                <p className="text-[10px] text-destructive font-medium">{errors.code.message}</p>
              )}
            </div>
          </div>

          {/* Account Name */}
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-foreground">Account Name *</Label>
            <Input
              {...register("name")}
              placeholder="e.g. Petty Cash Box"
              className={cn("h-9 bg-background/50 text-xs border-input", errors.name && "border-destructive")}
            />
            {errors.name && (
              <p className="text-[10px] text-destructive font-medium">{errors.name.message}</p>
            )}
          </div>

          {/* Account Type & Opening Balance */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground">Account Type *</Label>
              <Input
                {...register("accountType")}
                placeholder="e.g. Current Asset"
                className="h-9 bg-background/50 text-xs border-input font-mono"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground">Opening Balance (৳)</Label>
              <Input
                type="number"
                step="any"
                {...register("openingBalance", { valueAsNumber: true })}
                placeholder="0.00"
                className="h-9 bg-background/50 text-xs border-input font-mono font-bold"
              />
            </div>
          </div>

          {/* Branch & Status */}
          <div className="grid grid-cols-2 gap-3">
            <BranchSelector
              value={watch("branchName") || "Main Branch"}
              onChange={(val) => setValue("branchName", val)}
              isBangla={isBangla}
              label="Branch"
              compact
            />

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground">Status</Label>
              <Select
                value={watch("status")}
                onValueChange={(val: any) => setValue("status", val)}
              >
                <SelectTrigger className="h-9 text-xs bg-background/50 border-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active" className="text-xs font-semibold text-emerald-600">
                    Active
                  </SelectItem>
                  <SelectItem value="disabled" className="text-xs font-semibold text-muted-foreground">
                    Disabled
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-foreground">Description (Optional)</Label>
            <Textarea
              {...register("description")}
              placeholder="Account description..."
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
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{isEditing ? "Update Account" : "Save Account"}</span>
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
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
