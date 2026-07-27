"use client";

import React from "react";
import {
  ArrowLeftRight,
  Calendar,
  Clock3,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionSummaryCardProps {
  isBangla?: boolean;
}

const summaryCards = [
  {
    key: "total",
    icon: ArrowLeftRight,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    iconBorder: "border-primary/20",
    titleEn: "Total Transactions",
    titleBn: "মোট লেনদেন",
    descEn: "Total recorded transactions.",
    descBn: "মোট রেকর্ডকৃত লেনদেন।",
    value: "\u2014",
  },
  {
    key: "today",
    icon: Calendar,
    iconColor: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-500/10",
    iconBorder: "border-emerald-500/20",
    titleEn: "Today's Transactions",
    titleBn: "আজকের লেনদেন",
    descEn: "Transactions recorded today.",
    descBn: "আজ রেকর্ডকৃত লেনদেন।",
    value: "\u2014",
  },
  {
    key: "pending",
    icon: Clock3,
    iconColor: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-500/10",
    iconBorder: "border-amber-500/20",
    titleEn: "Pending Entries",
    titleBn: "মুলতুবি এন্ট্রি",
    descEn: "Transactions awaiting review.",
    descBn: "পর্যালোচনার অপেক্ষমান লেনদেন।",
    value: "\u2014",
  },
  {
    key: "updated",
    icon: RefreshCw,
    iconColor: "text-indigo-600 dark:text-indigo-400",
    iconBg: "bg-indigo-500/10",
    iconBorder: "border-indigo-500/20",
    titleEn: "Last Updated",
    titleBn: "শেষ আপডেট",
    descEn: "Most recent transaction sync.",
    descBn: "সবচেয়ে সাম্প্রতিক লেনদেন সিঙ্ক।",
    value: "Not available",
    valueBn: "তথ্য নেই",
  },
];

export function TransactionSummaryCard({
  isBangla = false,
}: TransactionSummaryCardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryCards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            className="rounded-2xl border border-border/60 bg-gradient-to-b from-card/90 via-card/75 to-card/60 backdrop-blur-md p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-border/90 transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5 min-w-0">
                <p className="text-[11px] font-semibold text-muted-foreground/80 uppercase tracking-wider truncate">
                  {isBangla ? card.titleBn : card.titleEn}
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {isBangla && card.valueBn ? card.valueBn : card.value}
                </p>
                <p className="text-[11px] text-muted-foreground/70 font-medium truncate">
                  {isBangla ? card.descBn : card.descEn}
                </p>
              </div>
              <div
                className={cn(
                  "h-10 w-10 sm:h-11 sm:w-11 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-200",
                  card.iconBg,
                  card.iconColor,
                  card.iconBorder
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
