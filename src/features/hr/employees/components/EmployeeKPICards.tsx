"use client";

import React from "react";
import { Users, UserCheck, UserX, UserPlus, Building2 } from "lucide-react";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface EmployeeKPICardsProps {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  newThisMonth: number;
  totalBranches: number;
  isBangla?: boolean;
}

export function EmployeeKPICards({
  totalEmployees,
  activeEmployees,
  inactiveEmployees,
  newThisMonth,
  totalBranches,
  isBangla = false,
}: EmployeeKPICardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {/* Card 1: Total Employees */}
      <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between transition-all hover:border-primary/30">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
            {isBangla ? "মোট কর্মী" : "Total Employees"}
          </p>
          <p className="text-lg sm:text-xl font-bold font-mono text-foreground truncate">
            {totalEmployees}
          </p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
            +{newThisMonth} this month
          </p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 ml-2">
          <Users className="h-5 w-5" />
        </div>
      </div>

      {/* Card 2: Active Employees */}
      <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between transition-all hover:border-emerald-500/30">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
            {isBangla ? "সক্রিয় কর্মী" : "Active Employees"}
          </p>
          <p className="text-lg sm:text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 truncate">
            {activeEmployees}
          </p>
          <p className="text-[10px] text-muted-foreground">Currently working</p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0 ml-2">
          <UserCheck className="h-5 w-5" />
        </div>
      </div>

      {/* Card 3: Inactive Employees */}
      <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between transition-all hover:border-rose-500/30">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
            {isBangla ? "নিষ্ক্রিয় কর্মী" : "Inactive Employees"}
          </p>
          <p className="text-lg sm:text-xl font-bold font-mono text-rose-600 dark:text-rose-400 truncate">
            {inactiveEmployees}
          </p>
          <p className="text-[10px] text-muted-foreground">Deactivated / Resigned</p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0 ml-2">
          <UserX className="h-5 w-5" />
        </div>
      </div>

      {/* Card 4: New This Month */}
      <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between transition-all hover:border-blue-500/30">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
            {isBangla ? "নতুন যোগদান" : "New This Month"}
          </p>
          <p className="text-lg sm:text-xl font-bold font-mono text-blue-600 dark:text-blue-400 truncate">
            {newThisMonth}
          </p>
          <p className="text-[10px] text-muted-foreground">Joined this month</p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0 ml-2">
          <UserPlus className="h-5 w-5" />
        </div>
      </div>

      {/* Card 5: Total Branches */}
      <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between transition-all hover:border-amber-500/30 col-span-2 sm:col-span-1">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
            {isBangla ? "মোট শাখা" : "Total Branches"}
          </p>
          <p className="text-lg sm:text-xl font-bold font-mono text-amber-600 dark:text-amber-400 truncate">
            {totalBranches}
          </p>
          <p className="text-[10px] text-muted-foreground">Multi-branch roster</p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0 ml-2">
          <Building2 className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
