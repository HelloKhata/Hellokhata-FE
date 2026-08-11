"use client";

import React from "react";
import { AccountOption } from "@/types/transfer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const DEFAULT_ACCOUNTS: AccountOption[] = [
  {
    id: "cash",
    name: "Cash in Hand",
    nameBn: "ক্যাশ ইন হ্যান্ড",
    icon: "💵",
    category: "cash",
    currentBalance: 125000,
  },
  {
    id: "bank",
    name: "Bank Account (Dutch-Bangla)",
    nameBn: "ব্যাংক অ্যাকাউন্ট (ডাচ-বাংলা)",
    icon: "🏦",
    category: "bank",
    currentBalance: 85500,
  },
  {
    id: "bkash",
    name: "bKash Merchant",
    nameBn: "বিকাশ মার্চেন্ট",
    icon: "📱",
    category: "wallet",
    currentBalance: 24000,
  },
  {
    id: "nagad",
    name: "Nagad Wallet",
    nameBn: "নগদ ওয়ালেট",
    icon: "📱",
    category: "wallet",
    currentBalance: 9000,
  },
  {
    id: "rocket",
    name: "Rocket Account",
    nameBn: "রকেট অ্যাকাউন্ট",
    icon: "📱",
    category: "wallet",
    currentBalance: 0,
  },
];

interface AccountSelectorProps {
  value: string;
  onChange: (val: string) => void;
  accounts?: AccountOption[];
  isBangla?: boolean;
  error?: string;
  label?: string;
}

export function AccountSelector({
  value,
  onChange,
  accounts = DEFAULT_ACCOUNTS,
  isBangla = false,
  error,
  label,
}: AccountSelectorProps) {
  const selectedAccount = accounts.find((a) => a.id === value);

  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-foreground">
        {label || (isBangla ? "অ্যাকাউন্ট (Account) *" : "Account *")}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className={cn(
            "h-10 text-xs bg-background/50 border-input w-full transition-colors",
            error && "border-destructive ring-1 ring-destructive/30"
          )}
        >
          <SelectValue placeholder={isBangla ? "অ্যাকাউন্ট নির্বাচন করুন" : "Select account"}>
            {selectedAccount && (
              <div className="flex items-center gap-2 text-foreground font-medium truncate">
                <span className="text-sm">{selectedAccount.icon}</span>
                <span className="truncate">{isBangla ? selectedAccount.nameBn : selectedAccount.name}</span>
                <span className="text-[10px] text-muted-foreground ml-auto pl-2 font-mono">
                  (৳{selectedAccount.currentBalance.toLocaleString()})
                </span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent align="start" className="max-h-60">
          {accounts.map((acc) => (
            <SelectItem key={acc.id} value={acc.id} className="text-xs cursor-pointer py-2">
              <div className="flex items-center justify-between w-full gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm shrink-0">{acc.icon}</span>
                  <span className="font-medium text-foreground truncate">
                    {isBangla ? acc.nameBn : acc.name}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono font-semibold shrink-0">
                  ৳{acc.currentBalance.toLocaleString()}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-[10px] text-destructive font-medium pl-0.5">{error}</p>}
    </div>
  );
}
