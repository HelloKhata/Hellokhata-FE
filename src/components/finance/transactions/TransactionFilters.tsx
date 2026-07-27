"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/premium";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionFiltersProps {
  isBangla?: boolean;
}

const filterGroups = [
  {
    key: "type",
    labelEn: "Transaction Type",
    labelBn: "লেনদেনের ধরন",
    options: [
      { value: "all", labelEn: "All Types", labelBn: "সকল ধরন" },
      { value: "sale", labelEn: "Sales", labelBn: "বিক্রয়" },
      { value: "income", labelEn: "Income", labelBn: "আয়" },
      { value: "expense", labelEn: "Expenses", labelBn: "খরচ" },
      { value: "deposit", labelEn: "Deposits", labelBn: "জমা" },
      { value: "withdrawal", labelEn: "Withdrawals", labelBn: "উত্তোলন" },
      { value: "loan", labelEn: "Loans", labelBn: "ঋণ" },
      { value: "adjustment", labelEn: "Adjustments", labelBn: "সমন্বয়" },
      { value: "transfer", labelEn: "Transfers", labelBn: "স্থানান্তর" },
      { value: "refund", labelEn: "Refunds", labelBn: "ফেরত" },
    ],
  },
  {
    key: "dateRange",
    labelEn: "Date Range",
    labelBn: "তারিখ পরিসীমা",
    options: [
      { value: "all", labelEn: "All Time", labelBn: "সকল সময়" },
      { value: "today", labelEn: "Today", labelBn: "আজ" },
      { value: "yesterday", labelEn: "Yesterday", labelBn: "গতকাল" },
      { value: "thisWeek", labelEn: "This Week", labelBn: "এই সপ্তাহ" },
      { value: "thisMonth", labelEn: "This Month", labelBn: "এই মাস" },
      { value: "thisQuarter", labelEn: "This Quarter", labelBn: "এই কোয়ার্টার" },
      { value: "custom", labelEn: "Custom Range", labelBn: "কাস্টম পরিসীমা" },
    ],
  },
  {
    key: "paymentMethod",
    labelEn: "Payment Method",
    labelBn: "পেমেন্ট পদ্ধতি",
    options: [
      { value: "all", labelEn: "All Methods", labelBn: "সকল পদ্ধতি" },
      { value: "cash", labelEn: "Cash", labelBn: "নগদ" },
      { value: "bkash", labelEn: "bKash", labelBn: "বিকাশ" },
      { value: "nagad", labelEn: "Nagad", labelBn: "নগদ" },
      { value: "bank", labelEn: "Bank Transfer", labelBn: "ব্যাংক ট্রান্সফার" },
      { value: "card", labelEn: "Card", labelBn: "কার্ড" },
      { value: "cheque", labelEn: "Cheque", labelBn: "চেক" },
    ],
  },
  {
    key: "bankAccount",
    labelEn: "Bank Account",
    labelBn: "ব্যাংক অ্যাকাউন্ট",
    options: [
      { value: "all", labelEn: "All Accounts", labelBn: "সকল অ্যাকাউন্ট" },
      { value: "cash", labelEn: "Cash Drawer", labelBn: "ক্যাশ ড্রয়ার" },
      { value: "dbbl", labelEn: "Dutch-Bangla Bank", labelBn: "ডাচ-বাংলা ব্যাংক" },
      { value: "bkash", labelEn: "bKash Merchant", labelBn: "বিকাশ মার্চেন্ট" },
      { value: "nagad", labelEn: "Nagad Personal", labelBn: "নগদ পার্সোনাল" },
    ],
  },
  {
    key: "party",
    labelEn: "Party",
    labelBn: "পক্ষ",
    options: [
      { value: "all", labelEn: "All Parties", labelBn: "সকল পক্ষ" },
      { value: "customer", labelEn: "Customers", labelBn: "কাস্টমার" },
      { value: "supplier", labelEn: "Suppliers", labelBn: "সাপ্লায়ার" },
      { value: "employee", labelEn: "Employees", labelBn: "কর্মচারী" },
    ],
  },
  {
    key: "category",
    labelEn: "Category",
    labelBn: "ক্যাটাগরি",
    options: [
      { value: "all", labelEn: "All Categories", labelBn: "সকল ক্যাটাগরি" },
      { value: "sales", labelEn: "Sales Revenue", labelBn: "বিক্রয় আয়" },
      { value: "utilities", labelEn: "Utilities", labelBn: "ইউটিলিটি" },
      { value: "salaries", labelEn: "Salaries", labelBn: "বেতন" },
      { value: "inventory", labelEn: "Inventory", labelBn: "ইনভেন্টরি" },
      { value: "office", labelEn: "Office Expenses", labelBn: "অফিস খরচ" },
      { value: "other", labelEn: "Other", labelBn: "অন্যান্য" },
    ],
  },
  {
    key: "createdBy",
    labelEn: "Created By",
    labelBn: "তৈরি করেছেন",
    options: [
      { value: "all", labelEn: "All Users", labelBn: "সকল ব্যবহারকারী" },
      { value: "system", labelEn: "System (Auto)", labelBn: "সিস্টেম (অটো)" },
      { value: "admin", labelEn: "Admin", labelBn: "অ্যাডমিন" },
      { value: "manager", labelEn: "Manager", labelBn: "ম্যানেজার" },
    ],
  },
  {
    key: "status",
    labelEn: "Status",
    labelBn: "স্ট্যাটাস",
    options: [
      { value: "all", labelEn: "All Statuses", labelBn: "সকল স্ট্যাটাস" },
      { value: "completed", labelEn: "Completed", labelBn: "সম্পন্ন" },
      { value: "pending", labelEn: "Pending", labelBn: "মুলতুবি" },
      { value: "reconciled", labelEn: "Reconciled", labelBn: "সমন্বিত" },
      { value: "draft", labelEn: "Draft", labelBn: "ড্রাফট" },
    ],
  },
  {
    key: "branch",
    labelEn: "Branch",
    labelBn: "শাখা",
    options: [
      { value: "all", labelEn: "All Branches", labelBn: "সকল শাখা" },
      { value: "main", labelEn: "Main Branch", labelBn: "প্রধান শাখা" },
      { value: "gulshan", labelEn: "Gulshan Store", labelBn: "গুলশান স্টোর" },
      { value: "tejgaon", labelEn: "Tejgaon Depot", labelBn: "তেজগাঁও ডিপো" },
    ],
  },
  {
    key: "reference",
    labelEn: "Reference Number",
    labelBn: "রেফারেন্স নম্বর",
    options: [
      { value: "all", labelEn: "All References", labelBn: "সকল রেফারেন্স" },
      { value: "has", labelEn: "Has Reference", labelBn: "রেফারেন্স আছে" },
      { value: "none", labelEn: "No Reference", labelBn: "রেফারেন্স নেই" },
    ],
  },
];

export function TransactionFilters({
  isBangla = false,
}: TransactionFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-foreground">
              {isBangla ? "ফিল্টার" : "Filters"}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {isBangla
                ? "আর্থিক লেনদেন পরিশোধন করুন"
                : "Refine financial transactions."}
            </p>
          </div>
        </div>
        <div className="h-7 w-7 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground shrink-0">
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-border/40">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 pt-4">
            {filterGroups.map((group) => (
              <div key={group.key} className="space-y-1.5">
                <label className="text-[10.5px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {isBangla ? group.labelBn : group.labelEn}
                </label>
                <Select disabled defaultValue="all">
                  <SelectTrigger className="h-9 text-xs rounded-xl bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {group.options.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {isBangla ? opt.labelBn : opt.labelEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/40">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled
              className="text-xs text-muted-foreground gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {isBangla ? "ফিল্টার রিসেট করুন" : "Reset Filter"}
            </Button>
            <Button
              type="button"
              size="sm"
              disabled
              className="rounded-xl text-xs font-medium gap-1.5"
            >
              <Check className="h-3.5 w-3.5" />
              {isBangla ? "ফিল্টার প্রয়োগ করুন" : "Apply Filter"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
