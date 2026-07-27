"use client";

import React from "react";
import { Button } from "@/components/ui/premium";
import { ClipboardList, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyTransactionsTableProps {
  isBangla?: boolean;
}

const tableColumns = [
  { key: "date", labelEn: "Date", labelBn: "তারিখ" },
  { key: "id", labelEn: "Transaction ID", labelBn: "লেনদেন আইডি" },
  { key: "type", labelEn: "Type", labelBn: "ধরন" },
  { key: "account", labelEn: "Account", labelBn: "অ্যাকাউন্ট" },
  { key: "description", labelEn: "Description", labelBn: "বিবরণ" },
  { key: "party", labelEn: "Party", labelBn: "পক্ষ" },
  { key: "debit", labelEn: "Debit", labelBn: "ডেবিট" },
  { key: "credit", labelEn: "Credit", labelBn: "ক্রেডিট" },
  { key: "balance", labelEn: "Balance", labelBn: "ব্যালেন্স" },
  { key: "paymentMethod", labelEn: "Payment Method", labelBn: "পেমেন্ট পদ্ধতি" },
  { key: "status", labelEn: "Status", labelBn: "স্ট্যাটাস" },
  { key: "action", labelEn: "Action", labelBn: "কাজ" },
];

export function EmptyTransactionsTable({
  isBangla = false,
}: EmptyTransactionsTableProps) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
      {/* Desktop Table Header */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/50 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider bg-muted/20">
              {tableColumns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "py-3 px-4",
                    (col.key === "debit" ||
                      col.key === "credit" ||
                      col.key === "balance" ||
                      col.key === "action") &&
                      "text-right"
                  )}
                >
                  {isBangla ? col.labelBn : col.labelEn}
                </th>
              ))}
            </tr>
          </thead>
        </table>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-16 px-8 text-center space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
            <ClipboardList className="h-8 w-8" />
          </div>
          <div className="max-w-md space-y-1.5">
            <h3 className="text-base font-bold text-foreground">
              {isBangla ? "কোনো লেনদেন পাওয়া যায়নি" : "No transactions found"}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isBangla
                ? "আপনার আর্থিক লেনদেনগুলো রেকর্ড হলে এখানে প্রদর্শিত হবে।"
                : "Your financial transactions will appear here once they are recorded."}
            </p>
          </div>
          <Button
            type="button"
            disabled
            className="rounded-xl text-xs font-medium gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            {isBangla ? "প্রথম লেনদেন যোগ করুন" : "Add First Transaction"}
          </Button>
        </div>
      </div>

      {/* Mobile Empty State */}
      <div className="block md:hidden flex flex-col items-center justify-center py-12 px-6 text-center space-y-4">
        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
          <ClipboardList className="h-7 w-7" />
        </div>
        <div className="max-w-xs space-y-1.5">
          <h3 className="text-sm font-bold text-foreground">
            {isBangla ? "কোনো লেনদেন পাওয়া যায়নি" : "No transactions found"}
          </h3>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {isBangla
              ? "আপনার আর্থিক লেনদেনগুলো রেকর্ড হলে এখানে প্রদর্শিত হবে।"
              : "Your financial transactions will appear here once they are recorded."}
          </p>
        </div>
        <Button
          type="button"
          disabled
          size="sm"
          className="rounded-xl text-xs font-medium gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          {isBangla ? "প্রথম লেনদেন যোগ করুন" : "Add First Transaction"}
        </Button>
      </div>

      {/* Table Footer (Pagination Placeholder) */}
      <div className="border-t border-border/50 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 bg-muted/10">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span>
            {isBangla
              ? "মোট রেকর্ড: 0"
              : "Total records: 0"}
          </span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">
            {isBangla
              ? "প্রতি পৃষ্ঠায়: 10"
              : "Rows per page: 10"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span>
            {isBangla
              ? "০ টির মধ্যে ০ টি দেখানো হচ্ছে"
              : "Showing 0 of 0 entries"}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled
              className="h-7 w-7 rounded-lg border border-border bg-background flex items-center justify-center text-muted-foreground/40 cursor-not-allowed"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <span className="font-semibold font-mono text-xs px-1">1 / 1</span>
            <button
              type="button"
              disabled
              className="h-7 w-7 rounded-lg border border-border bg-background flex items-center justify-center text-muted-foreground/40 cursor-not-allowed"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
