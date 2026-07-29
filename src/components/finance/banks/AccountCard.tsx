"use client";

import React, { memo } from "react";
import { BankAccount, BankAccountType } from "@/types/bank";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/hooks/useAppTranslation";
import { Building2, Smartphone, Banknote, Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function getAccountIcon(type: BankAccountType) {
  switch (type) {
    case "bank":
      return <Building2 className="h-4 w-4 text-blue-500" />;
    case "bkash":
      return <Smartphone className="h-4 w-4 text-pink-500" />;
    case "nagad":
      return <Smartphone className="h-4 w-4 text-orange-500" />;
    case "rocket":
      return <Smartphone className="h-4 w-4 text-purple-500" />;
    case "cash":
      return <Banknote className="h-4 w-4 text-emerald-500" />;
  }
}

interface AccountCardProps {
  account: BankAccount;
  isSelected: boolean;
  onSelect: (account: BankAccount) => void;
  isBangla?: boolean;
}

export const AccountCard = memo(function AccountCard({
  account,
  isSelected,
  onSelect,
  isBangla = false,
}: AccountCardProps) {
  const { formatCurrency } = useCurrency();

  return (
    <div
      onClick={() => onSelect(account)}
      className={cn(
        "p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 select-none",
        isSelected
          ? "border-primary bg-primary/5 shadow-2xs ring-1 ring-primary/20"
          : "border-border/70 bg-card hover:border-border hover:bg-muted/15"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-lg bg-background border border-border/60 shrink-0">
            {getAccountIcon(account.accountType)}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-foreground text-xs truncate">
              {account.accountName}
            </h4>
            <span className="text-[10px] text-muted-foreground font-mono truncate block">
              {account.accountNumber ? `A/C: ${account.accountNumber}` : account.accountType.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Unreconciled count orange badge */}
        {account.unreconciledCount > 0 ? (
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px] font-bold px-2 py-0.5 shrink-0">
            {account.unreconciledCount} {isBangla ? "নতুন" : "Needs Review"}
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] shrink-0">
            Synced
          </Badge>
        )}
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-border/40 text-xs">
        <div>
          <span className="text-[10px] text-muted-foreground uppercase block font-medium">
            {isBangla ? "রেকর্ডকৃত ব্যালেন্স" : "Recorded Balance"}
          </span>
          <span className="font-bold font-mono text-foreground">
            {formatCurrency(account.recordedBalance)}
          </span>
        </div>

        {account.lastImportedDate && (
          <div className="text-right">
            <span className="text-[10px] text-muted-foreground uppercase block">
              {isBangla ? "ইমপোর্ট" : "Imported"}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">
              {account.lastImportedDate}
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

interface AccountsListPanelProps {
  accounts: BankAccount[];
  selectedAccountId: string | null;
  onSelectAccount: (account: BankAccount) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  typeFilter: string;
  onTypeFilterChange: (type: string) => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
  onAddAccountClick: () => void;
  isBangla?: boolean;
}

export function AccountsListPanel({
  accounts,
  selectedAccountId,
  onSelectAccount,
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  sortBy,
  onSortByChange,
  onAddAccountClick,
  isBangla = false,
}: AccountsListPanelProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-3.5 space-y-3 shadow-2xs">
      <div className="flex items-center justify-between border-b border-border/80 pb-2.5">
        <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
          <span>{isBangla ? "অ্যাাকাউন্টস তালিকা" : "Accounts"}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono font-bold">
            {accounts.length}
          </span>
        </h3>

        <button
          type="button"
          onClick={onAddAccountClick}
          className="text-xs font-semibold text-primary hover:underline cursor-pointer"
        >
          {isBangla ? "+ যোগ করুন" : "+ Add Account"}
        </button>
      </div>

      {/* Controls: Search, Filter, Sort */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={isBangla ? "অ্যাাকাউন্ট খুঁজুন..." : "Search accounts..."}
            className="pl-8 h-8 text-xs bg-background/50 border-input"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Select value={typeFilter} onValueChange={onTypeFilterChange}>
            <SelectTrigger className="h-8 text-xs bg-background/50 border-input">
              <SelectValue placeholder={isBangla ? "ধরন" : "Type"} />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectItem value="all" className="text-xs">
                {isBangla ? "সব অ্যাকাউন্ট" : "All Types"}
              </SelectItem>
              <SelectItem value="bank" className="text-xs">
                🏦 Banks
              </SelectItem>
              <SelectItem value="wallets" className="text-xs">
                📱 Mobile Wallets
              </SelectItem>
              <SelectItem value="cash" className="text-xs">
                💵 Cash
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={onSortByChange}>
            <SelectTrigger className="h-8 text-xs bg-background/50 border-input">
              <SelectValue placeholder={isBangla ? "সাজান" : "Sort By"} />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="name" className="text-xs">
                Name
              </SelectItem>
              <SelectItem value="balance" className="text-xs">
                Balance
              </SelectItem>
              <SelectItem value="pending" className="text-xs">
                Pending Review
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Account Cards List */}
      <div className="space-y-2 max-h-[580px] overflow-y-auto pr-0.5">
        {accounts.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6 italic">
            {isBangla ? "কোনো অ্যাকাউন্ট পাওয়া যায়নি" : "No accounts match filters"}
          </p>
        ) : (
          accounts.map((acc) => (
            <AccountCard
              key={acc.id}
              account={acc}
              isSelected={selectedAccountId === acc.id}
              onSelect={onSelectAccount}
              isBangla={isBangla}
            />
          ))
        )}
      </div>
    </div>
  );
}
