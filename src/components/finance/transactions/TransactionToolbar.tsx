"use client";

import React from "react";
import { Input } from "@/components/ui/premium";
import { Button } from "@/components/ui/premium";
import {
  Search,
  Filter,
  ArrowUpDown,
  CalendarRange,
  Columns3,
  RefreshCw,
} from "lucide-react";

interface TransactionToolbarProps {
  isBangla?: boolean;
}

const toolbarButtons = [
  {
    key: "filter",
    icon: Filter,
    labelEn: "Filter",
    labelBn: "ফিল্টার",
  },
  {
    key: "sort",
    icon: ArrowUpDown,
    labelEn: "Sort",
    labelBn: "সাজান",
  },
  {
    key: "dateRange",
    icon: CalendarRange,
    labelEn: "Date Range",
    labelBn: "তারিখ পরিসীমা",
  },
  {
    key: "columns",
    icon: Columns3,
    labelEn: "Columns",
    labelBn: "কলাম",
  },
  {
    key: "refresh",
    icon: RefreshCw,
    labelEn: "Refresh",
    labelBn: "রিফ্রেশ",
  },
];

export function TransactionToolbar({
  isBangla = false,
}: TransactionToolbarProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={
              isBangla ? "লেনদেন খুঁজুন..." : "Search transactions..."
            }
            disabled
            className="pl-9 h-10 text-xs rounded-xl"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {toolbarButtons.map((btn) => {
            const Icon = btn.icon;
            return (
              <Button
                key={btn.key}
                type="button"
                variant="outline"
                size="sm"
                disabled
                className="h-9 rounded-xl text-xs font-medium gap-1.5"
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">
                  {isBangla ? btn.labelBn : btn.labelEn}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
