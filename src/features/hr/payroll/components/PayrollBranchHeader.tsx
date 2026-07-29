"use client";

import React, { useState } from "react";
import { usePayrollStore } from "../store/usePayrollStore";
import { Button } from "@/components/ui/button";
import { BranchSelector } from "@/components/finance/deposits-withdrawals/BranchSelector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, Play, Sparkles, Download, RefreshCw, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface PayrollBranchHeaderProps {
  onRunPayroll: () => void;
  onOpenBonusModal: () => void;
  isBangla?: boolean;
}

export function PayrollBranchHeader({
  onRunPayroll,
  onOpenBonusModal,
  isBangla = false,
}: PayrollBranchHeaderProps) {
  const {
    selectedBranch,
    setSelectedBranch,
    selectedPayPeriod,
    setSelectedPayPeriod,
  } = usePayrollStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success(isBangla ? "পে-রোল ডাটা রিফ্রেশ করা হয়েছে" : "Payroll data refreshed");
    }, 400);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <DollarSign className="h-5 w-5" />
          </div>
          <span>{isBangla ? "পে-রোল (Payroll)" : "Payroll System"}</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          {isBangla
            ? "বেতন রিভিউ, হিসাব, অনুমোদন ও বিতরণ করুন এবং ফাইন্যান্সের সাথে স্বয়ংক্রিয়ভাবে মিলিয়া নিন।"
            : "Review, calculate, approve, and distribute employee salaries while automatically syncing with Finance."}
        </p>
      </div>

      {/* Header Right Actions */}
      <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
        {/* Branch Switcher */}
        <div className="w-[140px] sm:w-[160px]">
          <BranchSelector
            value={selectedBranch}
            onChange={setSelectedBranch}
            isBangla={isBangla}
            compact
          />
        </div>

        {/* Pay Period Selector */}
        <Select value={selectedPayPeriod} onValueChange={setSelectedPayPeriod}>
          <SelectTrigger className="h-9 text-xs bg-background/50 border-input w-[130px] font-mono font-bold">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="July 2026" className="text-xs font-mono font-bold">July 2026 (Current)</SelectItem>
            <SelectItem value="June 2026" className="text-xs font-mono">June 2026</SelectItem>
            <SelectItem value="May 2026" className="text-xs font-mono">May 2026</SelectItem>
          </SelectContent>
        </Select>

        {/* Run Payroll Primary CTA */}
        <Button
          type="button"
          onClick={onRunPayroll}
          className="h-9 px-3.5 text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          <span>{isBangla ? "পে-রোল রান করুন" : "Run Payroll"}</span>
        </Button>

        {/* Bonus Workflow Button */}
        <Button
          type="button"
          variant="outline"
          onClick={onOpenBonusModal}
          className="h-9 px-3 text-xs font-bold gap-1.5 border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 cursor-pointer bg-background/50"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>{isBangla ? "বোনাস পে" : "Bonus Pay"}</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => toast.info("Exporting payroll report...")}
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
          title="Refresh Payroll"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
        </Button>
      </div>
    </div>
  );
}
