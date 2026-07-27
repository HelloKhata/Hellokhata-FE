"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface MoneySummaryCardsProps {
  mode: "income" | "expense";
  totalToday: number;
  totalThisMonth: number;
  totalEntriesCount: number;
  isBangla?: boolean;
}

export function MoneySummaryCards({
  mode,
  totalToday,
  totalThisMonth,
  totalEntriesCount,
  isBangla = false,
}: MoneySummaryCardsProps) {
  const isIncome = mode === "income";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Card 1: TOTAL TODAY */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs flex items-center justify-between relative overflow-hidden group hover:border-emerald-500/40 transition-all">
        <div className="space-y-1 z-10">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            {isBangla ? "আজকের মোট" : "TOTAL TODAY"}
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground tracking-tight">
            ৳{totalToday.toLocaleString()}
          </p>
        </div>

        {/* Sparkline Graphic */}
        <div className="h-12 w-28 shrink-0 z-10 flex items-center justify-end">
          <svg viewBox="0 0 100 40" className="w-full h-full stroke-emerald-500 stroke-[2.5] fill-none drop-shadow-sm">
            <path d="M5,32 Q25,28 45,20 T75,14 T95,6" strokeLinecap="round" />
            <circle cx="95" cy="6" r="3" className="fill-emerald-500 stroke-none" />
          </svg>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-emerald-500/10 pointer-events-none opacity-60" />
      </div>

      {/* Card 2: TOTAL THIS MONTH */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs flex items-center justify-between relative overflow-hidden group hover:border-sky-500/40 transition-all">
        <div className="space-y-1 z-10">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            {isBangla ? "এই মাসের মোট" : "TOTAL THIS MONTH"}
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground tracking-tight">
            ৳{totalThisMonth.toLocaleString()}
          </p>
        </div>

        {/* Sparkline Graphic */}
        <div className="h-12 w-28 shrink-0 z-10 flex items-center justify-end">
          <svg viewBox="0 0 100 40" className="w-full h-full stroke-sky-500 stroke-[2.5] fill-none drop-shadow-sm">
            <path d="M5,35 Q20,30 40,22 T70,18 T95,8" strokeLinecap="round" />
            <circle cx="95" cy="8" r="3" className="fill-sky-500 stroke-none" />
          </svg>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-500/5 to-sky-500/10 pointer-events-none opacity-60" />
      </div>

      {/* Card 3: TOTAL ENTRIES */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs flex items-center justify-between relative overflow-hidden group hover:border-purple-500/40 transition-all">
        <div className="space-y-1 z-10">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            {isBangla ? "মোট এন্ট্রি সংখ্যা" : "TOTAL ENTRIES"}
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground tracking-tight">
            {totalEntriesCount}
          </p>
        </div>

        {/* Sparkline Graphic */}
        <div className="h-12 w-28 shrink-0 z-10 flex items-center justify-end">
          <svg viewBox="0 0 100 40" className="w-full h-full stroke-purple-500 stroke-[2.5] fill-none drop-shadow-sm">
            <path d="M5,28 Q25,32 45,18 T75,25 T95,10" strokeLinecap="round" />
            <circle cx="95" cy="10" r="3" className="fill-purple-500 stroke-none" />
          </svg>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-purple-500/10 pointer-events-none opacity-60" />
      </div>
    </div>
  );
}
