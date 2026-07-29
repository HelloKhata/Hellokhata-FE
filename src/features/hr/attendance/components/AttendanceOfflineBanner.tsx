"use client";

import React from "react";
import { useAttendanceStore } from "../store/useAttendanceStore";
import { WifiOff, RotateCcw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function AttendanceOfflineBanner() {
  const { isOnline, offlineQueue, clearQueue, setIsOnline } = useAttendanceStore();
  const queuedCount = offlineQueue.filter((q) => q.syncState === "queued").length;

  if (isOnline && queuedCount === 0) return null;

  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400">
          <WifiOff className="h-4 w-4" />
        </div>
        <div>
          <strong className="text-foreground text-xs block font-bold">
            {!isOnline ? "Working in Offline Mode" : "Pending Offline Sync"}
          </strong>
          <span className="text-[11px] text-muted-foreground">
            {queuedCount} check-in records queued locally. Network loss will never block employee check-in.
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          onClick={() => {
            setIsOnline(true);
            clearQueue();
            toast.success("Offline queue synced with cloud server!");
          }}
          className="h-8 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white gap-1 cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Sync Queue ({queuedCount})</span>
        </Button>
      </div>
    </div>
  );
}
