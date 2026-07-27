"use client";

import React from "react";
import { Input } from "@/components/ui/premium";
import { Button } from "@/components/ui/premium";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, RotateCcw, Filter, Building2, Calendar, Sparkles } from "lucide-react";
import { TransactionType, TransactionSource } from "@/types/finance";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  dateRange: string;
  onDateRangeChange: (value: string) => void;
  selectedBranch: string;
  onBranchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  selectedSource: string;
  onSourceChange: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  branchesList?: { id: string; name: string }[];
  isBangla?: boolean;
}

export function TransactionFilterBar({
  searchQuery,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  selectedBranch,
  onBranchChange,
  selectedType,
  onTypeChange,
  selectedSource,
  onSourceChange,
  onClearFilters,
  hasActiveFilters,
  branchesList = [],
  isBangla = false,
}: FilterBarProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              isBangla
                ? "খুঁজুন (বিবরণ, ইনভয়েস, মেমো, কাস্টমার, সাপ্লায়ার...)"
                : "Search description, invoice #, memo, customer, supplier..."
            }
            className="pl-9 h-10 text-xs rounded-xl"
          />
        </div>

        {/* Dropdown Filters Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Range */}
          <div className="flex items-center gap-1.5 border border-border rounded-xl bg-background px-2.5 py-1">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <Select value={dateRange} onValueChange={onDateRangeChange}>
              <SelectTrigger className="h-8 text-xs border-0 bg-transparent shadow-none focus:ring-0 w-[120px] px-1">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isBangla ? "সকল সময়" : "All Time"}</SelectItem>
                <SelectItem value="today">{isBangla ? "আজ (Today)" : "Today"}</SelectItem>
                <SelectItem value="yesterday">{isBangla ? "গতকাল" : "Yesterday"}</SelectItem>
                <SelectItem value="this_week">{isBangla ? "এই সপ্তাহ" : "This Week"}</SelectItem>
                <SelectItem value="this_month">{isBangla ? "এই মাস" : "This Month"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Branch Filter */}
          <div className="flex items-center gap-1.5 border border-border rounded-xl bg-background px-2.5 py-1">
            <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <Select value={selectedBranch} onValueChange={onBranchChange}>
              <SelectTrigger className="h-8 text-xs border-0 bg-transparent shadow-none focus:ring-0 w-[130px] px-1">
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isBangla ? "সকল শাখা" : "All Branches"}</SelectItem>
                {branchesList.map((b) => (
                  <SelectItem key={b.id} value={b.name}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1.5 border border-border rounded-xl bg-background px-2.5 py-1">
            <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <Select value={selectedType} onValueChange={onTypeChange}>
              <SelectTrigger className="h-8 text-xs border-0 bg-transparent shadow-none focus:ring-0 w-[130px] px-1">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isBangla ? "সকল টাইপ" : "All Types"}</SelectItem>
                <SelectItem value="sale">{isBangla ? "বিক্রয় (Sale)" : "Sale"}</SelectItem>
                <SelectItem value="purchase">{isBangla ? "ক্রয় (Purchase)" : "Purchase"}</SelectItem>
                <SelectItem value="expense">{isBangla ? "ব্যয় (Expense)" : "Expense"}</SelectItem>
                <SelectItem value="income">{isBangla ? "আয় (Income)" : "Income"}</SelectItem>
                <SelectItem value="deposit">{isBangla ? "জমা (Deposit)" : "Deposit"}</SelectItem>
                <SelectItem value="withdrawal">{isBangla ? "উত্তোলন (Withdrawal)" : "Withdrawal"}</SelectItem>
                <SelectItem value="payment">{isBangla ? "পেমেন্ট (Payment)" : "Payment"}</SelectItem>
                <SelectItem value="payroll">{isBangla ? "বেতন (Payroll)" : "Payroll"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Source Filter (Auto/Manual) */}
          <div className="flex items-center gap-1.5 border border-border rounded-xl bg-background px-2.5 py-1">
            <Sparkles className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <Select value={selectedSource} onValueChange={onSourceChange}>
              <SelectTrigger className="h-8 text-xs border-0 bg-transparent shadow-none focus:ring-0 w-[110px] px-1">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isBangla ? "সকল উৎস" : "All Sources"}</SelectItem>
                <SelectItem value="auto">{isBangla ? "অটোমেটিক (Auto)" : "Auto"}</SelectItem>
                <SelectItem value="manual">{isBangla ? "ম্যানুয়াল (Manual)" : "Manual"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="h-10 text-xs rounded-xl text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              {isBangla ? "ফিল্টার মুছুন" : "Clear Filters"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
