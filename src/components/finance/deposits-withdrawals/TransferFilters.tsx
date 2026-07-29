"use client";

import React from "react";
import { TransferFilterState, TransferMode } from "@/types/transfer";
import { DEFAULT_ACCOUNTS } from "./AccountSelector";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Calendar } from "lucide-react";

interface TransferFiltersProps {
  filters: TransferFilterState;
  onChange: (updated: Partial<TransferFilterState>) => void;
  isBangla?: boolean;
}

export function TransferFilters({
  filters,
  onChange,
  isBangla = false,
}: TransferFiltersProps) {
  return (
    <div className="bg-card border border-border/80 rounded-xl p-3 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3 shadow-2xs">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          value={filters.searchQuery}
          onChange={(e) => onChange({ searchQuery: e.target.value })}
          placeholder={
            isBangla
              ? "মেমো বা অ্যাকাউন্ট দিয়ে খুঁজুন..."
              : "Search memo or account..."
          }
          className="pl-9 h-9 bg-background/50 border-input text-xs"
        />
      </div>

      {/* Dropdown Filters Grid */}
      <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:gap-2">
        {/* Account Filter */}
        <Select
          value={filters.selectedAccount}
          onValueChange={(val) => onChange({ selectedAccount: val })}
        >
          <SelectTrigger className="h-9 text-xs bg-background/50 border-input w-full sm:w-[130px]">
            <SelectValue placeholder={isBangla ? "সব অ্যাকাউন্ট" : "All Accounts"} />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="all" className="text-xs">
              {isBangla ? "সব অ্যাকাউন্ট" : "All Accounts"}
            </SelectItem>
            {DEFAULT_ACCOUNTS.map((acc) => (
              <SelectItem key={acc.id} value={acc.id} className="text-xs">
                <span className="mr-1">{acc.icon}</span>
                {isBangla ? acc.nameBn : acc.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Type Filter */}
        <Select
          value={filters.selectedType}
          onValueChange={(val: any) => onChange({ selectedType: val })}
        >
          <SelectTrigger className="h-9 text-xs bg-background/50 border-input w-full sm:w-[110px]">
            <SelectValue placeholder={isBangla ? "সব ধরন" : "All Types"} />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="all" className="text-xs">
              {isBangla ? "সব ধরন" : "All Types"}
            </SelectItem>
            <SelectItem value="deposit" className="text-xs text-emerald-600 font-medium">
              {isBangla ? "জমা (Deposit)" : "Deposit"}
            </SelectItem>
            <SelectItem value="withdrawal" className="text-xs text-rose-600 font-medium">
              {isBangla ? "উত্তোলন (Withdrawal)" : "Withdrawal"}
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Date Range Filter */}
        <Select
          value={filters.dateRange}
          onValueChange={(val: any) => onChange({ dateRange: val })}
        >
          <SelectTrigger className="h-9 text-xs bg-background/50 border-input w-full sm:w-[110px]">
            <SelectValue placeholder={isBangla ? "তারিখ" : "Date Range"} />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="all" className="text-xs">
              {isBangla ? "সব সময়" : "All Time"}
            </SelectItem>
            <SelectItem value="today" className="text-xs">
              {isBangla ? "আজ" : "Today"}
            </SelectItem>
            <SelectItem value="week" className="text-xs">
              {isBangla ? "এই সপ্তাহ" : "This Week"}
            </SelectItem>
            <SelectItem value="month" className="text-xs">
              {isBangla ? "এই মাস" : "This Month"}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
