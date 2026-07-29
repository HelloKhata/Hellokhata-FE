"use client";

import React, { useState } from "react";
import { useLeaveStore } from "../store/useLeaveStore";
import { Button } from "@/components/ui/button";
import { BranchSelector } from "@/components/finance/deposits-withdrawals/BranchSelector";
import { Calendar, Plus, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface LeaveBranchHeaderProps {
  onOpenNewLeaveModal: () => void;
  isBangla?: boolean;
}

export function LeaveBranchHeader({
  onOpenNewLeaveModal,
  isBangla = false,
}: LeaveBranchHeaderProps) {
  const { selectedBranch, setSelectedBranch } = useLeaveStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success(isBangla ? "ছুটির ডাটা রিফ্রেশ করা হয়েছে" : "Leave management data refreshed");
    }, 400);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <Calendar className="h-5 w-5" />
          </div>
          <span>{isBangla ? "ছুটি ব্যবস্থাপনা (Leave Management)" : "Leave Management"}</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          {isBangla
            ? "কর্মীদের ছুটির আবেদন ও অনুমোদন পরিচালনা করুন এবং স্বয়ংক্রিয়ভাবে উপস্থিতি ও পে-রোল আপডেট করুন।"
            : "Request, approve, and monitor employee leave while automatically synchronizing attendance and payroll."}
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

        {/* New Leave Request Primary CTA */}
        <Button
          type="button"
          onClick={onOpenNewLeaveModal}
          className="h-9 px-3.5 text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>{isBangla ? "নতুন ছুটির আবেদন" : "New Leave Request"}</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => toast.info("Exporting leave reports...")}
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
          title="Refresh Leave Data"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
        </Button>
      </div>
    </div>
  );
}
