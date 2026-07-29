"use client";

import React from "react";
import { EmployeeFilterState, EmployeeRole } from "../types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, RotateCcw, Filter } from "lucide-react";
import { font_ROLES } from "../constants";
import { BranchSelector } from "@/components/finance/deposits-withdrawals/BranchSelector";

interface EmployeeFiltersBarProps {
  filters: EmployeeFilterState;
  onFilterChange: (updated: Partial<EmployeeFilterState>) => void;
  onResetFilters: () => void;
  isBangla?: boolean;
}

export function EmployeeFiltersBar({
  filters,
  onFilterChange,
  onResetFilters,
  isBangla = false,
}: EmployeeFiltersBarProps) {
  return (
    <div className="bg-card border border-border/80 rounded-xl p-3 sm:p-4 shadow-2xs space-y-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Global Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder={
              isBangla
                ? "কর্মীর নাম, ফোন, আইডি বা পদবী দিয়ে খুঁজুন..."
                : "Search by Name, Phone, Employee ID, or Role..."
            }
            className="pl-9 h-9 text-xs bg-background/50 border-input"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Branch Switcher */}
          <div className="w-[150px] sm:w-[170px]">
            <BranchSelector
              value={filters.selectedBranch}
              onChange={(val) => onFilterChange({ selectedBranch: val })}
              isBangla={isBangla}
              compact
            />
          </div>

          {/* Role Filter */}
          <Select
            value={filters.selectedRole}
            onValueChange={(val) => onFilterChange({ selectedRole: val })}
          >
            <SelectTrigger className="h-9 text-xs bg-background/50 border-input w-[130px] font-medium">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Roles</SelectItem>
              {font_ROLES.map((role) => (
                <SelectItem key={role} value={role} className="text-xs">
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={filters.selectedStatus}
            onValueChange={(val: any) => onFilterChange({ selectedStatus: val })}
          >
            <SelectTrigger className="h-9 text-xs bg-background/50 border-input w-[120px] font-medium">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Status</SelectItem>
              <SelectItem value="active" className="text-xs text-emerald-600 font-semibold">
                Active
              </SelectItem>
              <SelectItem value="inactive" className="text-xs text-rose-600 font-semibold">
                Inactive
              </SelectItem>
              <SelectItem value="on_leave" className="text-xs text-amber-600 font-semibold">
                On Leave
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Salary Range Filter */}
          <Select
            value={filters.salaryRange}
            onValueChange={(val: any) => onFilterChange({ salaryRange: val })}
          >
            <SelectTrigger className="h-9 text-xs bg-background/50 border-input w-[120px] font-medium">
              <SelectValue placeholder="Salary" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Salaries</SelectItem>
              <SelectItem value="0-20k" className="text-xs">Below ৳20k</SelectItem>
              <SelectItem value="20k-50k" className="text-xs">৳20k - ৳50k</SelectItem>
              <SelectItem value="50k+" className="text-xs">৳50k+</SelectItem>
            </SelectContent>
          </Select>

          {/* Reset Filters */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="h-9 text-xs px-2.5 text-muted-foreground hover:text-foreground cursor-pointer bg-background/50 gap-1"
            title="Reset Filters"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
