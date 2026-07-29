"use client";

import React, { useState, useEffect } from "react";
import { useAttendanceStore } from "../store/useAttendanceStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, QrCode, Wifi, WifiOff, CheckCircle2, UserCheck } from "lucide-react";
import { MOCK_EMPLOYEES } from "@/features/hr/employees/constants";
import { AttendanceKioskConfirmationDialog } from "./AttendanceKioskConfirmationDialog";

interface AttendanceKioskGridProps {
  isBangla?: boolean;
}

export function AttendanceKioskGrid({ isBangla = false }: AttendanceKioskGridProps) {
  const {
    selectedBranch,
    isOnline,
    setSelectedKioskEmployee,
    selectedKioskEmployee,
  } = useAttendanceStore();

  // Live HH:mm:ss Clock
  const [liveTime, setLiveTime] = useState<string>("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setLiveTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const branchEmployees = MOCK_EMPLOYEES.filter(
    (e) => selectedBranch === "All Branches" || e.branchName === selectedBranch
  );

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-4 sm:p-6 space-y-6 shadow-md min-h-[550px]">
      {/* Top Header Bar for Touch Terminal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs font-bold uppercase px-3 py-1">
              <QrCode className="h-4 w-4 mr-1.5" /> TOUCH KIOSK TERMINAL
            </Badge>
            <span className="font-bold text-foreground text-sm sm:text-base">
              {selectedBranch}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Tap your photo card to log Check-in or Check-out (No typing required).
          </p>
        </div>

        {/* Live Clock & Sync Indicator */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="p-2.5 px-4 bg-background border border-border/80 rounded-xl flex items-center gap-2 shadow-2xs">
            <Clock className="h-4 w-4 text-primary animate-pulse" />
            <span className="font-mono text-base font-extrabold text-foreground tracking-wider">
              {liveTime || "09:00:00 AM"}
            </span>
          </div>

          <div className="p-2.5 px-3 bg-background border border-border/80 rounded-xl text-xs font-mono">
            {isOnline ? (
              <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                <Wifi className="h-4 w-4" /> Ready
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-rose-600 font-bold">
                <WifiOff className="h-4 w-4" /> Offline Queue
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Large Touch Photo Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {branchEmployees.map((emp) => (
          <button
            key={emp.id}
            type="button"
            onClick={() =>
              setSelectedKioskEmployee({
                id: emp.id,
                name: emp.fullName,
                avatarUrl: emp.avatarUrl,
                role: emp.role,
              })
            }
            className="p-4 bg-background/60 hover:bg-primary/5 border border-border/80 hover:border-primary/40 rounded-2xl shadow-2xs hover:shadow-md transition-all flex flex-col items-center justify-center text-center space-y-3 cursor-pointer min-h-[140px] group active:scale-95"
          >
            <Avatar className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border-2 border-border/80 group-hover:border-primary/40 shadow-xs transition-colors">
              <AvatarImage src={emp.avatarUrl} alt={emp.fullName} />
              <AvatarFallback className="bg-primary/10 text-primary font-extrabold text-lg rounded-2xl">
                {emp.fullName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-0.5 max-w-full">
              <strong className="text-sm font-bold text-foreground truncate block group-hover:text-primary transition-colors">
                {emp.fullName}
              </strong>
              <span className="text-[11px] text-muted-foreground block font-mono">
                {emp.role}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Touchscreen Full-Screen Confirmation Modal */}
      <AttendanceKioskConfirmationDialog
        employee={selectedKioskEmployee}
        isOpen={!!selectedKioskEmployee}
        onClose={() => setSelectedKioskEmployee(null)}
        isBangla={isBangla}
      />
    </div>
  );
}
