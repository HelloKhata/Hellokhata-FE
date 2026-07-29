"use client";

import React from "react";
import { LeaveBalance } from "../types";
import { Progress } from "@/components/ui/progress";
import { Calendar, ShieldCheck, HeartPulse, Sparkles } from "lucide-react";

interface LeaveBalanceCardsProps {
  balances: LeaveBalance[];
  isBangla?: boolean;
}

export function LeaveBalanceCards({
  balances,
  isBangla = false,
}: LeaveBalanceCardsProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "Casual Leave":
        return <Calendar className="h-4 w-4 text-emerald-500" />;
      case "Sick Leave":
        return <HeartPulse className="h-4 w-4 text-rose-500" />;
      case "Festival Leave":
        return <Sparkles className="h-4 w-4 text-purple-500" />;
      default:
        return <ShieldCheck className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {balances.map((b) => {
        const percentage = Math.round((b.remainingDays / b.annualQuota) * 100);

        return (
          <div
            key={b.leaveType}
            className="bg-card border border-border/80 rounded-xl p-4 shadow-2xs space-y-2.5 transition-all hover:border-primary/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5 truncate">
                {getIcon(b.leaveType)}
                <span>{b.leaveType}</span>
              </span>
              <span className="text-[10px] font-mono font-semibold text-muted-foreground">
                {b.annualQuota} Annual
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline justify-between">
                <strong className="text-lg sm:text-xl font-mono font-bold text-foreground">
                  {b.remainingDays} Days
                </strong>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {percentage}% Left
                </span>
              </div>
              <Progress value={percentage} className="h-1.5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
