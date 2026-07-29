"use client";

import React, { useState } from "react";
import { useAttendanceStore } from "../store/useAttendanceStore";
import { Button } from "@/components/ui/button";
import { BranchSelector } from "@/components/finance/deposits-withdrawals/BranchSelector";
import { CalendarCheck, QrCode, Download, RefreshCw, Calendar, Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface AttendanceBranchHeaderProps {
  onOpenKiosk: () => void;
  isBangla?: boolean;
}

export function AttendanceBranchHeader({
  onOpenKiosk,
  isBangla = false,
}: AttendanceBranchHeaderProps) {
  const { selectedBranch, setSelectedBranch, isOnline, setIsOnline } = useAttendanceStore();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success(isBangla ? "উপস্থিতি ডাটা রিফ্রেশ করা হয়েছে" : "Attendance data refreshed");
    }, 400);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <span>{isBangla ? "উপস্থিতি (Attendance)" : "Attendance Management"}</span>
          </h1>

          {/* Network Sync Simulation Badge */}
          <button
            type="button"
            onClick={() => {
              setIsOnline(!isOnline);
              toast.info(isOnline ? "Simulating Network Offline" : "Network Restored (Online)");
            }}
            className="text-[10px] text-muted-foreground hover:underline font-mono ml-2 flex items-center gap-1 cursor-pointer"
            title="Click to toggle network simulation"
          >
            {isOnline ? (
              <span className="flex items-center gap-1 text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">
                <Wifi className="h-3 w-3" /> Online
              </span>
            ) : (
              <span className="flex items-center gap-1 text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 font-semibold">
                <WifiOff className="h-3 w-3" /> Offline Mode
              </span>
            )}
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {isBangla
            ? "কর্মীদের উপস্থিতি ট্র্যাক করুন, চেক-ইন পরিচালনা করুন এবং ম্যানুয়াল কারেকশন সংশোধন করুন।"
            : "Monitor employee attendance, manage check-ins, review attendance history, and handle attendance corrections."}
        </p>
      </div>

      {/* Header Right Actions */}
      <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
        {/* Branch Switcher */}
        <div className="w-[150px] sm:w-[170px]">
          <BranchSelector
            value={selectedBranch}
            onChange={setSelectedBranch}
            isBangla={isBangla}
            compact
          />
        </div>

        {/* Date Picker */}
        <div className="flex items-center gap-1 border border-border/80 bg-background/50 rounded-lg px-2.5 h-9 text-xs font-mono">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent border-none text-xs text-foreground focus:outline-none cursor-pointer"
          />
        </div>

        {/* Open Kiosk Primary Button */}
        <Button
          type="button"
          onClick={onOpenKiosk}
          className="h-9 px-3.5 text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs"
        >
          <QrCode className="h-4 w-4" />
          <span>{isBangla ? "কিয়স্ক মোড খুলুন" : "Open Kiosk Mode"}</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => toast.info("Exporting attendance report...")}
          className="h-9 px-3 text-xs font-semibold gap-1 border-input text-foreground hover:bg-muted cursor-pointer bg-background/50"
        >
          <Download className="h-4 w-4 text-muted-foreground" />
          <span className="hidden sm:inline">Export</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="h-9 w-9 bg-background/50 border-input text-muted-foreground hover:text-foreground cursor-pointer"
          title="Refresh Attendance"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
        </Button>
      </div>
    </div>
  );
}
