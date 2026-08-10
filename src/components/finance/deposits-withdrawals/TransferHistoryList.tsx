"use client";

import React, { useMemo, useState } from "react";
import { TransferFilterState, TransferRecord } from "@/types/transfer";
import { TransferFilters } from "./TransferFilters";
import { TransferHistoryRow, TransferHistoryCard } from "./TransferHistoryRow";
import { TransferEmptyState } from "./TransferEmptyState";
import { isWithinInterval, subDays, parseISO, startOfDay, endOfDay } from "date-fns";

interface TransferHistoryListProps {
  records: TransferRecord[];
  isBangla?: boolean;
  onOpenCreate?: () => void;
}

export function TransferHistoryList({
  records,
  isBangla = false,
  onOpenCreate,
}: TransferHistoryListProps) {
  // Filter state
  const [filters, setFilters] = useState<TransferFilterState>({
    searchQuery: "",
    selectedAccount: "all",
    selectedType: "all",
    dateRange: "all",
  });

  const handleFilterChange = (updated: Partial<TransferFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  // Filtered & Chronologically sorted records (newest first)
  const filteredRecords = useMemo(() => {
    const today = new Date();

    return records
      .filter((rec) => {
        // Search Filter (Memo or Account Name)
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchMemo = rec.memo?.toLowerCase().includes(q);
          const matchAccount = rec.accountName.toLowerCase().includes(q);
          const matchBranch = rec.branchName.toLowerCase().includes(q);
          if (!matchMemo && !matchAccount && !matchBranch) return false;
        }

        // Account Filter
        if (filters.selectedAccount !== "all" && rec.accountId !== filters.selectedAccount) {
          return false;
        }

        // Type Filter
        if (filters.selectedType !== "all" && rec.type !== filters.selectedType) {
          return false;
        }

        // Date Range Filter
        if (filters.dateRange !== "all") {
          try {
            const recDate = parseISO(rec.date);
            if (filters.dateRange === "today") {
              const start = startOfDay(today);
              const end = endOfDay(today);
              if (!isWithinInterval(recDate, { start, end })) return false;
            } else if (filters.dateRange === "week") {
              const start = startOfDay(subDays(today, 7));
              const end = endOfDay(today);
              if (!isWithinInterval(recDate, { start, end })) return false;
            } else if (filters.dateRange === "month") {
              const start = startOfDay(subDays(today, 30));
              const end = endOfDay(today);
              if (!isWithinInterval(recDate, { start, end })) return false;
            }
          } catch {
            // Keep if date parsing fails
          }
        }

        return true;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [records, filters]);

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <TransferFilters filters={filters} onChange={handleFilterChange} isBangla={isBangla} />

      {/* History List Container */}
      <div className="bg-card border border-border rounded-xl shadow-2xs overflow-hidden">
        <div className="px-4 py-3 border-b border-border/80 flex items-center justify-between bg-muted/20">
          <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
            <span>{isBangla ? "ট্রান্সফার ইতিহাস" : "Transfer History"}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono font-bold">
              {filteredRecords.length}
            </span>
          </h3>
          <span className="text-[11px] text-muted-foreground">
            {isBangla ? "সর্বশেষ নতুন প্রথম" : "Newest first"}
          </span>
        </div>

        {filteredRecords.length === 0 ? (
          <TransferEmptyState onActionClick={onOpenCreate} isBangla={isBangla} />
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted/30 text-muted-foreground border-b border-border/80 font-semibold text-[11px] uppercase tracking-wider">
                    <th className="px-4 py-3">{isBangla ? "ধরন" : "Transfer Type"}</th>
                    <th className="px-4 py-3">{isBangla ? "অ্যাকাউন্ট" : "Account"}</th>
                    <th className="px-4 py-3">{isBangla ? "শাখা" : "Branch"}</th>
                    <th className="px-4 py-3">{isBangla ? "তারিখ" : "Date"}</th>
                    <th className="px-4 py-3">{isBangla ? "মেমো" : "Memo"}</th>
                    <th className="px-4 py-3 text-right">{isBangla ? "পরিমাণ" : "Amount"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredRecords.map((record) => (
                    <TransferHistoryRow key={record.id} record={record} isBangla={isBangla} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Responsive Cards View */}
            <div className="md:hidden p-3 space-y-2.5">
              {filteredRecords.map((record) => (
                <TransferHistoryCard key={record.id} record={record} isBangla={isBangla} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
