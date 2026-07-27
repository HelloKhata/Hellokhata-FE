"use client";

import React from "react";
import {
  Rocket,
  BookOpen,
  Repeat,
  Upload,
  Download,
  ShieldCheck,
  Paperclip,
  ScanLine,
  Cpu,
  Cog,
  Scale,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionComingSoonCardProps {
  isBangla?: boolean;
}

const roadmapItems = [
  {
    key: "journal",
    icon: BookOpen,
    labelEn: "Journal Entries",
    labelBn: "জার্নাল এন্ট্রি",
    color: "text-indigo-500",
  },
  {
    key: "recurring",
    icon: Repeat,
    labelEn: "Recurring Transactions",
    labelBn: "পুনরাবৃত্ত লেনদেন",
    color: "text-emerald-500",
  },
  {
    key: "bulkImport",
    icon: Upload,
    labelEn: "Bulk Import",
    labelBn: "বাল্ক ইম্পোর্ট",
    color: "text-sky-500",
  },
  {
    key: "bulkExport",
    icon: Download,
    labelEn: "Bulk Export",
    labelBn: "বাল্ক এক্সপোর্ট",
    color: "text-amber-500",
  },
  {
    key: "approval",
    icon: ShieldCheck,
    labelEn: "Transaction Approval",
    labelBn: "লেনদেন অনুমোদন",
    color: "text-violet-500",
  },
  {
    key: "attachments",
    icon: Paperclip,
    labelEn: "Attachments",
    labelBn: "সংযুক্তি",
    color: "text-rose-500",
  },
  {
    key: "scanner",
    icon: ScanLine,
    labelEn: "Receipt Scanner",
    labelBn: "রিসিট স্ক্যানার",
    color: "text-teal-500",
  },
  {
    key: "aiCategory",
    icon: Cpu,
    labelEn: "AI Categorization",
    labelBn: "AI ক্যাটাগরি",
    color: "text-indigo-400",
  },
  {
    key: "audit",
    icon: Scale,
    labelEn: "Audit Trail",
    labelBn: "অডিট ট্রেইল",
    color: "text-blue-500",
  },
  {
    key: "rules",
    icon: Cog,
    labelEn: "Accounting Rules",
    labelBn: "হিসাব নিয়ম",
    color: "text-orange-500",
  },
];

export function TransactionComingSoonCard({
  isBangla = false,
}: TransactionComingSoonCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-4 relative overflow-hidden">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
          <Rocket className="h-4 w-4" />
        </div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {isBangla ? "আসছে শীঘ্রই" : "Coming Soon"}
        </h3>
      </div>

      <div className="space-y-1">
        {roadmapItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-muted/30 transition-colors"
            >
              <Icon className={cn("h-3.5 w-3.5 shrink-0", item.color)} />
              <span className="text-xs text-muted-foreground">
                {isBangla ? item.labelBn : item.labelEn}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
