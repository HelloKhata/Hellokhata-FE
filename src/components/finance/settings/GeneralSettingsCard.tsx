"use client";

import React from "react";
import { GeneralSettings } from "@/types/finance-settings";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal, Lock, CheckCircle2 } from "lucide-react";
import { BranchSelector } from "../deposits-withdrawals/BranchSelector";

interface GeneralSettingsCardProps {
  settings: GeneralSettings;
  onChange: (updated: Partial<GeneralSettings>) => void;
  isBangla?: boolean;
}

export function GeneralSettingsCard({
  settings,
  onChange,
  isBangla = false,
}: GeneralSettingsCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-5 shadow-2xs">
      <div className="border-b border-border/80 pb-3">
        <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <span>{isBangla ? "সাধারণ অ্যাকাউন্টিং সেটিংস (General Settings)" : "General Accounting Settings"}</span>
        </h3>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          {isBangla
            ? "ব্যবসার অর্থবছর, অ্যাকাউন্টিং পদ্ধতি ও ডিফোল্ট অ্যাকাউন্টসমূহ কনফিগার করুন।"
            : "Configure fiscal year, accounting method, default branch, and core ledger accounts."}
        </p>
      </div>

      <div className="space-y-4 text-xs">
        {/* Row 1: Currency & Accounting Method */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Currency (Read-Only) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>{isBangla ? "ডিফোল্ট মুদ্রা (Default Currency)" : "Default Currency"}</span>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-normal">
                <Lock className="h-3 w-3" /> Configured
              </span>
            </Label>
            <Input
              value={`${settings.currency} (৳)`}
              readOnly
              className="h-9 bg-muted/40 text-xs border-input font-mono font-bold text-foreground cursor-not-allowed"
            />
          </div>

          {/* Accounting Method */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              {isBangla ? "অ্যাকাউন্টিং পদ্ধতি (Accounting Method) *" : "Accounting Method *"}
            </Label>
            <Select
              value={settings.accountingMethod}
              onValueChange={(val: any) => onChange({ accountingMethod: val })}
            >
              <SelectTrigger className="h-9 text-xs bg-background/50 border-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="accrual" className="text-xs font-semibold">
                  Accrual Basis (Recognize income/expense when incurred)
                </SelectItem>
                <SelectItem value="cash" className="text-xs">
                  Cash Basis (Recognize income/expense when cash received/paid)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Row 2: Fiscal Year & Closing Month */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              {isBangla ? "অর্থবছর শুরু (Fiscal Year Start)" : "Fiscal Year Start"}
            </Label>
            <Select
              value={settings.fiscalYearStart}
              onValueChange={(val) => onChange({ fiscalYearStart: val })}
            >
              <SelectTrigger className="h-9 text-xs bg-background/50 border-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="July 1st" className="text-xs">
                  July 1st (National BD Fiscal Standard)
                </SelectItem>
                <SelectItem value="January 1st" className="text-xs">
                  January 1st (Calendar Year)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              {isBangla ? "অর্থবছর সমাপনী মাস" : "Financial Closing Month"}
            </Label>
            <Select
              value={settings.financialYearClosingMonth}
              onValueChange={(val) => onChange({ financialYearClosingMonth: val })}
            >
              <SelectTrigger className="h-9 text-xs bg-background/50 border-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="June" className="text-xs">
                  June
                </SelectItem>
                <SelectItem value="December" className="text-xs">
                  December
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Row 3: Default Branch */}
        <div className="space-y-1.5">
          <BranchSelector
            value={settings.defaultBranch}
            onChange={(val) => onChange({ defaultBranch: val })}
            isBangla={isBangla}
            label={isBangla ? "ডিফোল্ট শাখা (Default Branch) *" : "Default Primary Branch *"}
            compact
          />
        </div>

        {/* Row 4: Default System Accounts Grid */}
        <div className="p-3.5 bg-background/50 border border-border/70 rounded-xl space-y-3">
          <h4 className="font-bold text-foreground text-[11px] uppercase tracking-wider">
            {isBangla ? "সিস্টেম ডিফোল্ট হিসাব খাতসমূহ" : "Default Core Accounts"}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-muted-foreground">Default Cash Account</Label>
              <Select
                value={settings.defaultCashAccount}
                onValueChange={(val) => onChange({ defaultCashAccount: val })}
              >
                <SelectTrigger className="h-8 text-xs bg-background border-input font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1010 - Main Store Cash Vault" className="text-xs font-mono">
                    1010 - Main Store Cash Vault
                  </SelectItem>
                  <SelectItem value="1020 - Petty Cash Box" className="text-xs font-mono">
                    1020 - Petty Cash Box
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-muted-foreground">Default Income Account</Label>
              <Select
                value={settings.defaultIncomeAccount}
                onValueChange={(val) => onChange({ defaultIncomeAccount: val })}
              >
                <SelectTrigger className="h-8 text-xs bg-background border-input font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4010 - Sales Income" className="text-xs font-mono">
                    4010 - Sales Income
                  </SelectItem>
                  <SelectItem value="4020 - Service Revenue" className="text-xs font-mono">
                    4020 - Service Revenue
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-muted-foreground">Default Expense Account</Label>
              <Select
                value={settings.defaultExpenseAccount}
                onValueChange={(val) => onChange({ defaultExpenseAccount: val })}
              >
                <SelectTrigger className="h-8 text-xs bg-background border-input font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5010 - Inventory Cost of Goods Sold" className="text-xs font-mono">
                    5010 - Inventory Cost of Goods Sold
                  </SelectItem>
                  <SelectItem value="5020 - Operating Expense" className="text-xs font-mono">
                    5020 - Operating Expense
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-muted-foreground">Default Tax Account</Label>
              <Select
                value={settings.defaultTaxAccount}
                onValueChange={(val) => onChange({ defaultTaxAccount: val })}
              >
                <SelectTrigger className="h-8 text-xs bg-background border-input font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2030 - Output VAT Payable" className="text-xs font-mono">
                    2030 - Output VAT Payable
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-3 pt-2 border-t border-border/60">
          <div className="flex items-center justify-between p-3 bg-muted/20 border border-border/60 rounded-xl">
            <div className="space-y-0.5">
              <Label className="text-xs font-bold text-foreground cursor-pointer">
                {isBangla ? "লেনদেন স্বয়ংক্রিয়ভাবে পোস্ট করুন" : "Automatically post transactions"}
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Automatically post sales, purchases, and payments to ledger upon completion.
              </p>
            </div>
            <Switch
              checked={settings.autoPostTransactions}
              onCheckedChange={(checked) => onChange({ autoPostTransactions: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/20 border border-border/60 rounded-xl">
            <div className="space-y-0.5">
              <Label className="text-xs font-bold text-foreground cursor-pointer">
                {isBangla ? "হিসাব রেকর্ড মোছার আগে নিশ্চিতকরণ আবশ্যক" : "Require confirmation before deleting accounting records"}
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Display safety confirmation dialog before permanently deleting financial vouchers.
              </p>
            </div>
            <Switch
              checked={settings.requireConfirmOnDelete}
              onCheckedChange={(checked) => onChange({ requireConfirmOnDelete: checked })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
