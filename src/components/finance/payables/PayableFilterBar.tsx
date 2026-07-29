"use client";

import React from "react";
import { PayableFilterState } from "@/types/payable";
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

interface PayableFilterBarProps {
  filters: PayableFilterState;
  onChange: (updated: Partial<PayableFilterState>) => void;
  suppliersList?: { id: string; name: string }[];
  isBangla?: boolean;
}

export function PayableFilterBar({
  filters,
  onChange,
  suppliersList = [],
  isBangla = false,
}: PayableFilterBarProps) {
  const { branches } = useBranchStore();

  const defaultBranches = branches.length > 0 ? branches : [
    { id: "b-main", name: "Main Branch" },
    { id: "b-mirpur", name: "Mirpur Branch" },
    { id: "b-gulshan", name: "Gulshan Branch" },
  ];

  return (
    <div className="bg-card border border-border/80 rounded-xl p-3 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-2.5 shadow-2xs">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          value={filters.searchQuery}
          onChange={(e) => onChange({ searchQuery: e.target.value })}
          placeholder={
            isBangla
              ? "সরবরাহকারী, বিল নম্বর বা পারচেজ দিয়ে খুঁজুন..."
              : "Search supplier, bill #, or purchase ref..."
          }
          className="pl-9 h-9 bg-background/50 border-input text-xs"
        />
      </div>

      {/* Filter Dropdowns Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:flex sm:items-center sm:gap-2">
        {/* Status Dropdown */}
        <Select
          value={filters.selectedStatus}
          onValueChange={(val: any) => onChange({ selectedStatus: val })}
        >
          <SelectTrigger className="h-9 text-xs bg-background/50 border-input w-full sm:w-[120px]">
            <SelectValue placeholder={isBangla ? "স্ট্যাটাস" : "Status"} />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="all" className="text-xs">
              {isBangla ? "সব স্ট্যাটাস" : "All Status"}
            </SelectItem>
            <SelectItem value="unpaid" className="text-xs text-amber-600 font-medium">
              {isBangla ? "অপরিশোধিত" : "Unpaid"}
            </SelectItem>
            <SelectItem value="partial" className="text-xs text-blue-600 font-medium">
              {isBangla ? "আংশিক পরিশোধিত" : "Partially Paid"}
            </SelectItem>
            <SelectItem value="paid" className="text-xs text-emerald-600 font-medium">
              {isBangla ? "পরিশোধিত" : "Paid"}
            </SelectItem>
            <SelectItem value="overdue" className="text-xs text-rose-600 font-medium">
              {isBangla ? "ওভারডিউ" : "Overdue"}
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Aging Dropdown */}
        <Select
          value={filters.selectedAging}
          onValueChange={(val: any) => onChange({ selectedAging: val })}
        >
          <SelectTrigger className="h-9 text-xs bg-background/50 border-input w-full sm:w-[115px]">
            <SelectValue placeholder={isBangla ? "বয়স (Aging)" : "Aging"} />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="all" className="text-xs">
              {isBangla ? "সব বয়স" : "All Aging"}
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
          <SelectTrigger className="h-9 text-xs bg-background/50 border-input w-full sm:w-[120px]">
            <SelectValue placeholder={isBangla ? "শাখা" : "Branch"} />
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

        {/* Due Date Range Dropdown */}
        <Select
          value={filters.dateRange}
          onValueChange={(val: any) => onChange({ dateRange: val })}
        >
          <SelectTrigger className="h-9 text-xs bg-background/50 border-input w-full sm:w-[110px]">
            <SelectValue placeholder={isBangla ? "তারিখ" : "Due Date"} />
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
