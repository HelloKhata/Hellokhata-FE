"use client";

import React from "react";
import { Users, DollarSign, CheckCircle2, Clock, MinusCircle, TrendingUp } from "lucide-react";
import { useCurrency } from "@/hooks/useAppTranslation";

interface PayrollSummaryCardsProps {
  totalEmployees: number;
  payrollThisMonth: number;
  totalPaid: number;
  pendingPayments: number;
  totalDeductions: number;
  averageSalary: number;
  isBangla?: boolean;
}

export function PayrollSummaryCards({
  totalEmployees,
  payrollThisMonth,
  totalPaid,
  pendingPayments,
  totalDeductions,
  averageSalary,
  isBangla = false,
}: PayrollSummaryCardsProps) {
  const { formatCurrency } = useCurrency();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {/* Card 1: Total Employees */}
      <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between transition-all hover:border-primary/30">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
            {isBangla ? "মোট কর্মী" : "Total Employees"}
          </p>
          <p className="text-lg sm:text-xl font-bold font-mono text-foreground truncate">
            {totalEmployees}
          </p>
          <p className="text-[10px] text-muted-foreground">Active payroll roster</p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 ml-2">
          <Users className="h-5 w-5" />
        </div>
      </div>

      {/* Card 2: Payroll This Month */}
      <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between transition-all hover:border-emerald-500/30">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
            {isBangla ? "চলতি মাসের পে-রোল" : "Payroll This Month"}
          </p>
          <p className="text-lg sm:text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 truncate">
            {formatCurrency(payrollThisMonth)}
          </p>
          <p className="text-[10px] text-emerald-600 font-medium">+8% compared to last month</p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0 ml-2">
          <DollarSign className="h-5 w-5" />
        </div>
      </div>

      {/* Card 3: Total Paid */}
      <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between transition-all hover:border-blue-500/30">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
            {isBangla ? "মোট পরিশোধিত" : "Total Paid"}
          </p>
          <p className="text-lg sm:text-xl font-bold font-mono text-blue-600 dark:text-blue-400 truncate">
            {formatCurrency(totalPaid)}
          </p>
          <p className="text-[10px] text-muted-foreground">Disbursed via Bank/bKash</p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0 ml-2">
          <CheckCircle2 className="h-5 w-5" />
        </div>
      </div>

      {/* Card 4: Pending Payments */}
      <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between transition-all hover:border-amber-500/30">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
            {isBangla ? "অপেক্ষমান পরিশোধ" : "Pending Payments"}
          </p>
          <p className="text-lg sm:text-xl font-bold font-mono text-amber-600 dark:text-amber-400 truncate">
            {formatCurrency(pendingPayments)}
          </p>
          <p className="text-[10px] text-amber-600 font-medium">Scheduled for payout</p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0 ml-2">
          <Clock className="h-5 w-5" />
        </div>
      </div>

      {/* Card 5: Total Deductions */}
      <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between transition-all hover:border-rose-500/30">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
            {isBangla ? "মোট কর্তন" : "Total Deductions"}
          </p>
          <p className="text-lg sm:text-xl font-bold font-mono text-rose-600 dark:text-rose-400 truncate">
            {formatCurrency(totalDeductions)}
          </p>
          <p className="text-[10px] text-muted-foreground">PF & late penalties</p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0 ml-2">
          <MinusCircle className="h-5 w-5" />
        </div>
      </div>

      {/* Card 6: Average Salary */}
      <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-center justify-between transition-all hover:border-purple-500/30">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
            {isBangla ? "গড় বেতন" : "Average Salary"}
          </p>
          <p className="text-lg sm:text-xl font-bold font-mono text-purple-600 dark:text-purple-400 truncate">
            {formatCurrency(averageSalary)}
          </p>
          <p className="text-[10px] text-muted-foreground">Per employee mean</p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 shrink-0 ml-2">
          <TrendingUp className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
