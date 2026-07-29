"use client";

import React from "react";
import { CalendarCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AttendanceEmptyStateProps {
  onRefresh: () => void;
  isKiosk?: boolean;
  isBangla?: boolean;
}

export function AttendanceEmptyState({
  onRefresh,
  isKiosk = false,
  isBangla = false,
}: AttendanceEmptyStateProps) {
  return (
    <div className="bg-card border border-border/80 rounded-xl p-8 sm:p-12 text-center space-y-4 shadow-2xs my-4 flex flex-col items-center justify-center">
      <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs">
        <CalendarCheck className="h-8 w-8" />
      </div>

      <div className="space-y-1.5 max-w-md">
        <h3 className="text-base sm:text-lg font-bold text-foreground">
          {isKiosk ? "No employees available for this branch." : "No attendance records found."}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {isKiosk
            ? "Ensure employees are assigned to this branch in employee settings."
            : "Check your date picker filters or click refresh to load attendance logs."}
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={onRefresh}
        className="h-9 px-4 text-xs font-bold gap-1.5 bg-background/50 text-foreground cursor-pointer shadow-xs rounded-lg"
      >
        <RefreshCw className="h-4 w-4 text-primary" />
        <span>Refresh</span>
      </Button>
    </div>
  );
}
