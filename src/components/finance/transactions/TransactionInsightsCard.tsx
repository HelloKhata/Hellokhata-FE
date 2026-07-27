"use client";

import React from "react";
import { Button } from "@/components/ui/premium";
import { Sparkles, BrainCircuit } from "lucide-react";

interface TransactionInsightsCardProps {
  isBangla?: boolean;
}

const insights = [
  { key: "unusual", labelEn: "Unusual transactions", labelBn: "অস্বাভাবিক লেনদেন" },
  { key: "duplicate", labelEn: "Duplicate entries", labelBn: "ডুপ্লিকেট এন্ট্রি" },
  { key: "suspicious", labelEn: "Suspicious spending", labelBn: "সন্দেহজনক খরচ" },
  { key: "recurring", labelEn: "Recurring payments", labelBn: "পুনরাবৃত্ত পেমেন্ট" },
  { key: "cashflow", labelEn: "Cash flow trends", labelBn: "ক্যাশ ফ্লো ট্রেন্ড" },
  { key: "missing", labelEn: "Missing documentation", labelBn: "অনুপস্থিত ডকুমেন্ট" },
  { key: "anomalies", labelEn: "Accounting anomalies", labelBn: "হিসাব বিজ্ঞান সমস্যা" },
];

export function TransactionInsightsCard({
  isBangla = false,
}: TransactionInsightsCardProps) {
  return (
    <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-indigo-500/5 to-card/90 p-4 shadow-xs space-y-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 h-24 w-24 bg-indigo-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

      <div className="relative flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shrink-0">
          <Sparkles className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">
          {isBangla ? "AI লেনদেন অন্তর্দৃষ্টি" : "AI Transaction Insights"}
        </h3>
      </div>

      <div className="relative space-y-2.5">
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {isBangla
            ? "হ্যালো খাতা AI স্বয়ংক্রিয়ভাবে বিশ্লেষণ করবে:"
            : "HelloKhata AI will automatically analyze:"}
        </p>
        <ul className="space-y-1.5">
          {insights.map((item) => (
            <li
              key={item.key}
              className="flex items-center gap-2 text-xs text-muted-foreground"
            >
              <span className="h-1 w-1 rounded-full bg-indigo-500/60 shrink-0" />
              {isBangla ? item.labelBn : item.labelEn}
            </li>
          ))}
        </ul>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled
        className="relative rounded-xl text-xs font-medium gap-1.5 w-full border-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10"
      >
        <BrainCircuit className="h-3.5 w-3.5" />
        {isBangla ? "অন্তর্দৃষ্টি তৈরি করুন" : "Generate Insights"}
      </Button>
    </div>
  );
}
