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
  { value: "inactive", en: "Inactive", bn: "নিষ্ক্রিয়", icon: Archive, dotColor: "bg-gray-400" },
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
  sortOrder?: BatchSort;
  onSortOrderChange?: (sort: BatchSort) => void;
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
      {/* Top Controls Row: Search + Status Filter Dropdown + Branch Selector + Sort Dropdown */}
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

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Status Filter Dropdown */}
          <Select value={statusFilter} onValueChange={(v) => onStatusFilterChange(v as StatusTab)}>
            <SelectTrigger className="w-full sm:w-[160px] h-9 text-xs bg-card border-border/80">
              <SelectValue placeholder={isBangla ? "স্ট্যাটাস" : "Status"} />
            </SelectTrigger>
            <SelectContent>
              {STATUS_TABS.map((tab) => (
                <SelectItem key={tab.value} value={tab.value} className="text-xs">
                  <div className="flex items-center gap-2">
                    <span className={cn("h-2 w-2 rounded-full shrink-0", tab.dotColor)} />
                    <span>{isBangla ? tab.bn : tab.en}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
          {/* <Select value={sortOrder} onValueChange={(v) => onSortOrderChange?.(v as BatchSort)}>
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
          </Select> */}
        </div>
      </div>
    </div>
  );
});
