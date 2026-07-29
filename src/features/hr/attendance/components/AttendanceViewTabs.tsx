"use client";

import React from "react";
import { useAttendanceStore } from "../store/useAttendanceStore";
import { LayoutDashboard, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";

export function AttendanceViewTabs() {
  const { viewMode, setViewMode } = useAttendanceStore();

  return (
    <div className="bg-card border border-border/80 rounded-xl p-1.5 shadow-2xs flex items-center gap-1 w-fit">
      <button
        type="button"
        onClick={() => setViewMode("manager")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none",
          viewMode === "manager"
            ? "bg-primary text-primary-foreground font-bold shadow-xs"
            : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
        )}
      >
        <LayoutDashboard className="h-4 w-4" />
        <span>Manager View</span>
      </button>

      <button
        type="button"
        onClick={() => setViewMode("kiosk")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none",
          viewMode === "kiosk"
            ? "bg-primary text-primary-foreground font-bold shadow-xs"
            : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
        )}
      >
        <QrCode className="h-4 w-4" />
        <span>Kiosk Mode (Touch Terminal)</span>
      </button>
    </div>
  );
}
