"use client";

import React from "react";
import { Clock, CheckCircle2, XCircle, Calendar, ShieldCheck, Timer } from "lucide-react";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface LeaveSummaryCardsProps {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  onLeaveTodayCount: number;
  remainingBalance: number;
  avgApprovalTime: string;
  isBangla?: boolean;
}

export function LeaveSummaryCards({
  pendingCount,
  approvedCount,
  rejectedCount,
  onLeaveTodayCount,
  remainingBalance,
  avgApprovalTime,
  isBangla = false,
}: LeaveSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {/* Card 1: Pending Requests */}
      <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between transition-all hover:border-amber-500/30">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
            {isBangla ? "অপেক্ষমান আবেদন" : "Pending Requests"}
          </p>
          <p className="text-lg sm:text-xl font-bold font-mono text-amber-600 dark:text-amber-400 truncate">
            {pendingCount}
          </p>
          <p className="text-[10px] text-amber-600 font-medium">3 submitted today</p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0 ml-2">
          <Clock className="h-5 w-5" />
        </div>
      </div>

      {/* Card 2: Approved */}
      <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between transition-all hover:border-emerald-500/30">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
            {isBangla ? "অনুমোদিত" : "Approved"}
          </p>
          <p className="text-lg sm:text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 truncate">
            {approvedCount}
          </p>
          <p className="text-[10px] text-muted-foreground">Synchronized to attendance</p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0 ml-2">
          <CheckCircle2 className="h-5 w-5" />
        </div>
      </div>

      {/* Card 3: Rejected */}
      <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between transition-all hover:border-rose-500/30">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
            {isBangla ? "বাতিলকৃত" : "Rejected"}
          </p>
          <p className="text-lg sm:text-xl font-bold font-mono text-rose-600 dark:text-rose-400 truncate">
            {rejectedCount}
          </p>
          <p className="text-[10px] text-muted-foreground">Declined by manager</p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0 ml-2">
          <XCircle className="h-5 w-5" />
        </div>
      </div>

      {/* Card 4: Employees On Leave Today */}
      <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between transition-all hover:border-blue-500/30">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
            {isBangla ? "আজকে ছুটিতে" : "On Leave Today"}
          </p>
          <p className="text-lg sm:text-xl font-bold font-mono text-blue-600 dark:text-blue-400 truncate">
            {onLeaveTodayCount}
          </p>
          <p className="text-[10px] text-muted-foreground">Active leave shift</p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0 ml-2">
          <Calendar className="h-5 w-5" />
        </div>
      </div>

      {/* Card 5: Remaining Leave Balance */}
      <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between transition-all hover:border-primary/30">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
            {isBangla ? "অবশিষ্ট ছুটি" : "Remaining Balance"}
          </p>
          <p className="text-lg sm:text-xl font-bold font-mono text-foreground truncate">
            {remainingBalance} Days
          </p>
          <p className="text-[10px] text-muted-foreground">Personal leave quota</p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 ml-2">
          <ShieldCheck className="h-5 w-5" />
        </div>
      </div>

      {/* Card 6: Average Approval Time */}
      <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between transition-all hover:border-purple-500/30">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
            {isBangla ? "গড় অনুমোদনের সময়" : "Avg Approval Time"}
          </p>
          <p className="text-lg sm:text-xl font-bold font-mono text-purple-600 dark:text-purple-400 truncate">
            {avgApprovalTime}
          </p>
          <p className="text-[10px] text-muted-foreground">Manager response rate</p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 shrink-0 ml-2">
          <Timer className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
