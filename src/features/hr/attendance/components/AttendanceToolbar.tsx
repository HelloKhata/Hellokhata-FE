"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Printer, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface AttendanceToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusFilterChange: (s: string) => void;
  isBangla?: boolean;
}

export function AttendanceToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  isBangla = false,
}: AttendanceToolbarProps) {
  return (
    <div className="bg-card border border-border/80 rounded-xl p-3 space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-3 shadow-2xs">
      <div className="relative flex-1 min-w-[220px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={
            isBangla
              ? "কর্মীর নাম, আইডি বা ফোন দিয়ে রেজিস্টার খুঁজুন..."
              : "Search attendance by Name, Employee ID, or Phone..."
          }
          className="pl-8 h-8 text-xs bg-background/50 border-input"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="h-8 text-xs bg-background/50 border-input w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="all" className="text-xs">All Statuses</SelectItem>
            <SelectItem value="present" className="text-xs text-emerald-600 font-semibold">
              🟢 Present
            </SelectItem>
            <SelectItem value="late" className="text-xs text-amber-600 font-semibold">
              🟡 Late
            </SelectItem>
            <SelectItem value="absent" className="text-xs text-rose-600 font-semibold">
              🔴 Absent
            </SelectItem>
            <SelectItem value="leave" className="text-xs text-blue-600 font-semibold">
              🔵 Leave
            </SelectItem>
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => window.print()}
          className="h-8 text-xs font-semibold gap-1 text-muted-foreground hover:text-foreground cursor-pointer bg-background/50"
        >
          <Printer className="h-3.5 w-3.5" />
          <span>Print</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => toast.info("Exporting attendance report...")}
          className="h-8 text-xs font-semibold gap-1 text-muted-foreground hover:text-foreground cursor-pointer bg-background/50"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export</span>
        </Button>
      </div>
    </div>
  );
}
