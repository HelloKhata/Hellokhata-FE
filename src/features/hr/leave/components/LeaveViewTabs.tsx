"use client";

import React from "react";
import { useLeaveStore } from "../store/useLeaveStore";
import { UserCheck, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function LeaveViewTabs() {
  const { activeTab, setActiveTab } = useLeaveStore();

  return (
    <div className="bg-card border border-border/80 rounded-xl p-1.5 shadow-2xs flex items-center gap-1 w-fit">
      <button
        type="button"
        onClick={() => setActiveTab("my_leave")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none",
          activeTab === "my_leave"
            ? "bg-primary text-primary-foreground font-bold shadow-xs"
            : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
        )}
      >
        <UserCheck className="h-4 w-4" />
        <span>My Leave (Employee Portal)</span>
      </button>

      <button
        type="button"
        onClick={() => setActiveTab("approval_queue")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none",
          activeTab === "approval_queue"
            ? "bg-primary text-primary-foreground font-bold shadow-xs"
            : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
        )}
      >
        <ShieldCheck className="h-4 w-4" />
        <span>Approval Queue (Manager Dashboard)</span>
      </button>
    </div>
  );
}
