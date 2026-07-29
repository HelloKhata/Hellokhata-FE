"use client";

import React from "react";
import { UserCheck, Clock, UserX, Calendar, CheckCircle2, WifiOff } from "lucide-react";
import { useAttendanceStore } from "../store/useAttendanceStore";

interface AttendanceKPICardsProps {
  presentCount: number;
  lateCount: number;
  absentCount: number;
  leaveCount: number;
  checkedInToday: number;
  isBangla?: boolean;
}

export function AttendanceKPICards({
  presentCount,
  lateCount,
  absentCount,
  leaveCount,
  checkedInToday,
  isBangla = false,
}: AttendanceKPICardsProps) {
  const offlineQueue = useAttendanceStore((state) => state.offlineQueue);
  const pendingSyncCount = offlineQueue.filter((q) => q.syncState === "queued").length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {/* Card 1: Present */}
      <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between transition-all hover:border-emerald-500/30">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
            {isBangla ? "উপস্থিত" : "Present"}
          </p>
          <p className="text-lg sm:text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 truncate">
            {presentCount}
          </p>
          <p className="text-[10px] text-emerald-600 font-medium">95% attendance today</p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0 ml-2">
          <UserCheck className="h-5 w-5" />
        </div>
      </div>

      {/* Card 2: Late */}
      <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between transition-all hover:border-amber-500/30">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
            {isBangla ? "বিলম্ব" : "Late"}
          </p>
          <p className="text-lg sm:text-xl font-bold font-mono text-amber-600 dark:text-amber-400 truncate">
            {lateCount}
          </p>
          <p className="text-[10px] text-muted-foreground">Grace period exceeded</p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0 ml-2">
          <Clock className="h-5 w-5" />
        </div>
      </div>

      {/* Card 3: Absent */}
      <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between transition-all hover:border-rose-500/30">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
            {isBangla ? "অনুপস্থিত" : "Absent"}
          </p>
          <p className="text-lg sm:text-xl font-bold font-mono text-rose-600 dark:text-rose-400 truncate">
            {absentCount}
          </p>
          <p className="text-[10px] text-muted-foreground">Unexcused absence</p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0 ml-2">
          <UserX className="h-5 w-5" />
        </div>
      </div>

      {/* Card 4: On Leave */}
      <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between transition-all hover:border-blue-500/30">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
            {isBangla ? "ছুটিতে" : "On Leave"}
          </p>
          <p className="text-lg sm:text-xl font-bold font-mono text-blue-600 dark:text-blue-400 truncate">
            {leaveCount}
          </p>
          <p className="text-[10px] text-muted-foreground">Approved leave</p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0 ml-2">
          <Calendar className="h-5 w-5" />
        </div>
      </div>

      {/* Card 5: Checked In Today */}
      <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between transition-all hover:border-primary/30">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
            {isBangla ? "আজকে চেক-ইন" : "Checked In Today"}
          </p>
          <p className="text-lg sm:text-xl font-bold font-mono text-foreground truncate">
            {checkedInToday}
          </p>
          <p className="text-[10px] text-muted-foreground">Active shift</p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 ml-2">
          <CheckCircle2 className="h-5 w-5" />
        </div>
      </div>

      {/* Card 6: Pending Offline Sync */}
      <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between transition-all hover:border-purple-500/30">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
            {isBangla ? "অফলাইন সিঙ্ক" : "Pending Sync"}
          </p>
          <p className="text-lg sm:text-xl font-bold font-mono text-purple-600 dark:text-purple-400 truncate">
            {pendingSyncCount}
          </p>
          <p className="text-[10px] text-muted-foreground">Local queue</p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 shrink-0 ml-2">
          <WifiOff className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
