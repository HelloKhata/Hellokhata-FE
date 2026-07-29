"use client";

import React from "react";
import { ReceivableFilterState, AgingBucket } from "@/types/receivable";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useBranchStore } from "@/stores/branchStore";

interface ReceivableFilterBarProps {
  filters: ReceivableFilterState;
  onChange: (updated: Partial<ReceivableFilterState>) => void;
  isBangla?: boolean;
}

export function ReceivableFilterBar({
  filters,
  onChange,
  isBangla = false,
}: ReceivableFilterBarProps) {
  const { branches } = useBranchStore();

  const defaultBranches = branches.length > 0 ? branches : [
    { id: "b-main", name: "Main Branch" },
    { id: "b-mirpur", name: "Mirpur Branch" },
    { id: "b-gulshan", name: "Gulshan Branch" },
  ];

  return (
    <div className="bg-card border border-border/80 rounded-xl p-3 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3 shadow-2xs">
      {/* Search Bar (Name, Phone, Invoice No) */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          value={filters.searchQuery}
          onChange={(e) => onChange({ searchQuery: e.target.value })}
          placeholder={
            isBangla
              ? "গ্রাহকের নাম, মোবাইল বা ইনভয়েস নম্বর..."
              : "Search customer name, phone, or invoice..."
          }
          className="pl-9 h-9 bg-background/50 border-input text-xs"
        />
      </div>

      {/* Filter Dropdowns Grid */}
      <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:gap-2">
        {/* Aging Bucket Dropdown */}
        <Select
          value={filters.selectedAging}
          onValueChange={(val: any) => onChange({ selectedAging: val })}
        >
          <SelectTrigger className="h-9 text-xs bg-background/50 border-input w-full sm:w-[130px]">
            <SelectValue placeholder={isBangla ? "সব বয়স" : "All Aging"} />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="all" className="text-xs">
              {isBangla ? "সব বয়স" : "All Aging"}
            </SelectItem>
            <SelectItem value="current" className="text-xs text-emerald-600 font-medium">
              {isBangla ? "চলতি (0-30)" : "Current (0-30d)"}
            </SelectItem>
            <SelectItem value="30_days" className="text-xs text-amber-600 font-medium">
              {isBangla ? "৩০+ দিন" : "30+ Days"}
            </SelectItem>
            <SelectItem value="60_days" className="text-xs text-orange-600 font-medium">
              {isBangla ? "৬০+ দিন" : "60+ Days"}
            </SelectItem>
            <SelectItem value="90_days" className="text-xs text-rose-600 font-medium">
              {isBangla ? "৯০+ দিন" : "90+ Days"}
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Branch Dropdown */}
        <Select
          value={filters.selectedBranch}
          onValueChange={(val) => onChange({ selectedBranch: val })}
        >
          <SelectTrigger className="h-9 text-xs bg-background/50 border-input w-full sm:w-[130px]">
            <SelectValue placeholder={isBangla ? "সব শাখা" : "All Branches"} />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="all" className="text-xs">
              {isBangla ? "সব শাখা" : "All Branches"}
            </SelectItem>
            {defaultBranches.map((b) => (
              <SelectItem key={b.id} value={b.name} className="text-xs">
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Range Dropdown */}
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
