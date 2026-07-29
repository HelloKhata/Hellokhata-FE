"use client";

import React from "react";
import { usePayrollStore, PayrollTab } from "../store/usePayrollStore";
import { Play, SlidersHorizontal, Receipt, CreditCard, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function PayrollViewTabs() {
  const { activeTab, setActiveTab } = usePayrollStore();

  const tabs: { id: PayrollTab; label: string; icon: any }[] = [
    { id: "runs", label: "Payroll Runs", icon: Play },
    { id: "structures", label: "Salary Structures", icon: SlidersHorizontal },
    { id: "payslips", label: "Payslips", icon: Receipt },
    { id: "payments", label: "Payment History", icon: CreditCard },
    { id: "bonuses", label: "Bonus & Festival Pay", icon: Sparkles },
  ];

  return (
    <div className="bg-card border border-border/80 rounded-xl p-1.5 shadow-2xs flex items-center gap-1 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer select-none whitespace-nowrap",
              isActive
                ? "bg-primary text-primary-foreground font-bold shadow-xs"
                : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
