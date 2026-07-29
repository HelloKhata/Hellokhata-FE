"use client";

import React, { memo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Building2,
  ArrowUpDown,
  Package,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Archive,
  Trash2,
} from "lucide-react";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { cn } from "@/lib/utils";
import type { BatchStatus, BatchSort } from "@/services/batches.services";

export type StatusTab = "all" | BatchStatus;

const STATUS_TABS: {
  value: StatusTab;
  en: string;
  bn: string;
  icon: any;
  dotColor: string;
}[] = [
  { value: "all", en: "All", bn: "সব", icon: Package, dotColor: "bg-slate-400" },
  { value: "active", en: "Active", bn: "সক্রিয়", icon: CheckCircle2, dotColor: "bg-emerald-500" },
  { value: "expiring", en: "Expiring Soon", bn: "শীঘ্রই মেয়াদ শেষ", icon: AlertTriangle, dotColor: "bg-amber-500" },
  { value: "expired", en: "Expired", bn: "মেয়াদোত্তীর্ণ", icon: AlertCircle, dotColor: "bg-rose-500" },
  { value: "depleted", en: "Depleted", bn: "স্টক শেষ", icon: Archive, dotColor: "bg-gray-400" },
  { value: "written_off", en: "Written Off", bn: "বাতিল", icon: Trash2, dotColor: "bg-gray-400" },
];

interface BatchToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: StatusTab;
  onStatusFilterChange: (status: StatusTab) => void;
  branchFilter: string;
  onBranchFilterChange: (branchId: string) => void;
  branches?: any[];
  isMultiBranch?: boolean;
  sortOrder: BatchSort;
  onSortOrderChange: (sort: BatchSort) => void;
  className?: string;
}

export const BatchToolbar = memo(function BatchToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  branchFilter,
  onBranchFilterChange,
  branches = [],
  isMultiBranch = false,
  sortOrder,
  onSortOrderChange,
  className,
}: BatchToolbarProps) {
  const { isBangla } = useAppTranslation();

  return (
    <div className={cn("space-y-3", className)}>
      {/* Top Controls Row: Search + Branch Selector + Sort Dropdown */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={
              isBangla
                ? "পণ্যের নাম বা বারকোড দিয়ে খুঁজুন..."
                : "Search by product name, SKU or barcode..."
            }
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 text-xs bg-card border-border/80"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Branch Selector */}
          {isMultiBranch && (
            <Select value={branchFilter} onValueChange={onBranchFilterChange}>
              <SelectTrigger className="w-full sm:w-[160px] h-9 text-xs bg-card border-border/80">
                <Building2 className="h-3.5 w-3.5 mr-1.5 text-muted-foreground shrink-0" />
                <SelectValue placeholder={isBangla ? "সব শাখা" : "All Branches"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" " className="text-xs font-medium">
                  {isBangla ? "সব শাখা" : "All Branches"}
                </SelectItem>
                {branches.map((b: any) => (
                  <SelectItem key={b.id} value={b.id} className="text-xs">
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Sort Dropdown */}
          <Select value={sortOrder} onValueChange={(v) => onSortOrderChange(v as BatchSort)}>
            <SelectTrigger className="w-full sm:w-[170px] h-9 text-xs bg-card border-border/80">
              <ArrowUpDown className="h-3.5 w-3.5 mr-1.5 text-muted-foreground shrink-0" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expiry_asc" className="text-xs">
                {isBangla ? "মেয়াদ শেষ (নিকটতম)" : "Expiry (soonest)"}
              </SelectItem>
              <SelectItem value="received_desc" className="text-xs">
                {isBangla ? "প্রাপ্তি (নতুন)" : "Received (newest)"}
              </SelectItem>
              <SelectItem value="received_asc" className="text-xs">
                {isBangla ? "প্রাপ্তি (পুরাতন)" : "Received (oldest)"}
              </SelectItem>
              <SelectItem value="name_asc" className="text-xs">
                {isBangla ? "পণ্যের নাম (A-Z)" : "Product name A-Z"}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Segmented Filter Chips */}
      <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-xl border border-border/60 overflow-x-auto no-scrollbar">
        {STATUS_TABS.map((tab) => {
          const isActive = statusFilter === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onStatusFilterChange(tab.value)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer select-none whitespace-nowrap",
                isActive
                  ? "bg-card text-foreground shadow-xs border border-border/60 font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/40"
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", tab.dotColor)} />
              {isBangla ? tab.bn : tab.en}
            </button>
          );
        })}
      </div>
    </div>
  );
});
