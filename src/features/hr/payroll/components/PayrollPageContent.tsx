"use client";

import React, { useState, useMemo } from "react";
import { PayrollRun, PayrollItem, PaymentMethod } from "../types";
import { MOCK_PAYROLL_RUNS } from "../constants";
import { usePayrollStore } from "../store/usePayrollStore";
import { PayrollBranchHeader } from "./PayrollBranchHeader";
import { PayrollSummaryCards } from "./PayrollSummaryCards";
import { PayrollViewTabs } from "./PayrollViewTabs";
import { RunPayrollWizard } from "./RunPayrollWizard";
import { PayrollPaymentTable } from "./PayrollPaymentTable";
import { SalaryStructureCard } from "./SalaryStructureCard";
import { PayslipViewer } from "./PayslipViewer";
import { BonusPayWorkflow } from "./BonusPayWorkflow";
import { PayrollEmptyState } from "./PayrollEmptyState";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download, Play, CheckCircle2 } from "lucide-react";
import { useCurrency, useAppTranslation } from "@/hooks/useAppTranslation";
import { toast } from "sonner";

export function PayrollPageContent() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const {
    activeTab,
    setActiveTab,
    selectedBranch,
    isRunWizardOpen,
    setIsRunWizardOpen,
  } = usePayrollStore();

  // State
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>(MOCK_PAYROLL_RUNS);

  // Active Run Payout Items
  const activeItems = useMemo(() => {
    return payrollRuns[0]?.items || [];
  }, [payrollRuns]);

  // Filtered Payroll Runs
  const filteredRuns = useMemo(() => {
    return payrollRuns.filter((r) => {
      if (selectedBranch !== "All Branches" && r.branchName !== selectedBranch) return false;
      return true;
    });
  }, [payrollRuns, selectedBranch]);

  // Metrics Calculation
  const { totalEmployees, totalPayrollMonth, totalPaid, pendingPay, totalDed, avgSalary } = useMemo(() => {
    const run = payrollRuns[0];
    if (!run) {
      return { totalEmployees: 0, totalPayrollMonth: 0, totalPaid: 0, pendingPay: 0, totalDed: 0, avgSalary: 0 };
    }
    const totPaid = run.items.filter((i) => i.paymentStatus === "paid").reduce((sum, i) => sum + i.netSalary, 0);
    const pend = run.items.filter((i) => i.paymentStatus === "pending").reduce((sum, i) => sum + i.netSalary, 0);
    const avg = Math.round(run.totalNetPayroll / run.employeeCount);
    return {
      totalEmployees: run.employeeCount,
      totalPayrollMonth: run.totalNetPayroll,
      totalPaid: totPaid,
      pendingPay: pend,
      totalDed: run.totalDeductions,
      avgSalary: avg,
    };
  }, [payrollRuns]);

  // Handlers
  const handleRunCompleted = (newRun: PayrollRun) => {
    setPayrollRuns((prev) => [newRun, ...prev]);
  };

  const handleMarkPaymentPaid = (itemId: string, method: PaymentMethod) => {
    setPayrollRuns((prev) =>
      prev.map((run, idx) => {
        if (idx === 0) {
          const updatedItems = run.items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  paymentStatus: "paid" as const,
                  paymentMethod: method,
                  paidDate: new Date().toISOString().split("T")[0],
                }
              : item
          );
          return { ...run, items: updatedItems };
        }
        return run;
      })
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <PayrollBranchHeader
        onRunPayroll={() => setIsRunWizardOpen(true)}
        onOpenBonusModal={() => setActiveTab("bonuses")}
        isBangla={isBangla}
      />

      {/* KPI Cards */}
      <PayrollSummaryCards
        totalEmployees={totalEmployees}
        payrollThisMonth={totalPayrollMonth}
        totalPaid={totalPaid}
        pendingPayments={pendingPay}
        totalDeductions={totalDed}
        averageSalary={avgSalary}
        isBangla={isBangla}
      />

      {/* View Switcher Tabs */}
      <PayrollViewTabs />

      {/* TAB 1: PAYROLL RUNS */}
      {activeTab === "runs" && (
        <div className="space-y-4">
          {filteredRuns.length === 0 ? (
            <PayrollEmptyState onRunPayroll={() => setIsRunWizardOpen(true)} isBangla={isBangla} />
          ) : (
            <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-4 shadow-2xs">
              <div className="border-b border-border/80 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
                    <Play className="h-4 w-4 text-primary fill-current" />
                    <span>{isBangla ? "সম্পন্ন পে-রোল রান (Completed Payroll Runs)" : "Completed Monthly Payroll Runs"}</span>
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    View finalized monthly payroll runs and associated Finance voucher transactions.
                  </p>
                </div>
              </div>

              <div className="border border-border/80 rounded-xl overflow-hidden text-xs">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 text-[10px] uppercase font-semibold">
                      <TableHead>Pay Period</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Employees</TableHead>
                      <TableHead>Total Net Payroll</TableHead>
                      <TableHead>Finance Voucher ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRuns.map((run) => (
                      <TableRow key={run.id} className="hover:bg-muted/15">
                        <TableCell className="font-mono font-bold text-foreground">{run.periodName}</TableCell>
                        <TableCell className="text-muted-foreground">{run.branchName}</TableCell>
                        <TableCell className="font-mono font-bold">{run.employeeCount} Staff</TableCell>
                        <TableCell className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(run.totalNetPayroll)}
                        </TableCell>
                        <TableCell className="font-mono text-muted-foreground text-[11px]">
                          {run.financeTransactionId || "TXN-FIN-9981"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-bold">
                            Completed & Synced
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setActiveTab("payments")}
                            className="h-7 text-xs font-semibold gap-1 bg-background/50 cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5 text-primary" />
                            <span>Payments</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SALARY STRUCTURES */}
      {activeTab === "structures" && <SalaryStructureCard isBangla={isBangla} />}

      {/* TAB 3: PAYSLIPS */}
      {activeTab === "payslips" && <PayslipViewer isBangla={isBangla} />}

      {/* TAB 4: PAYMENT HISTORY */}
      {activeTab === "payments" && (
        <PayrollPaymentTable
          items={activeItems}
          onMarkPaid={handleMarkPaymentPaid}
          isBangla={isBangla}
        />
      )}

      {/* TAB 5: BONUS & FESTIVAL PAY */}
      {activeTab === "bonuses" && <BonusPayWorkflow isBangla={isBangla} />}

      {/* 4-Step Run Payroll Wizard */}
      <RunPayrollWizard
        isOpen={isRunWizardOpen}
        onClose={() => setIsRunWizardOpen(false)}
        onRunCompleted={handleRunCompleted}
        isBangla={isBangla}
      />
    </div>
  );
}
