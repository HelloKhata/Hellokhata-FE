"use client";

import React, { useState } from "react";
import { PayrollItem, PayrollRun } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Play,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  Loader2,
  Building2,
  Receipt,
  FileCheck,
} from "lucide-react";
import { useCurrency } from "@/hooks/useAppTranslation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RunPayrollWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onRunCompleted: (run: PayrollRun) => void;
  isBangla?: boolean;
}

const INITIAL_AUTO_CALCULATED_ITEMS: PayrollItem[] = [
  {
    id: "item-1",
    employeeId: "EMP-1001",
    employeeName: "Kazi Shohel",
    role: "Manager",
    branchName: "Main Branch",
    basicSalary: 45000,
    allowances: 20000,
    overtimePay: 0,
    lateDeduction: 0,
    leaveDeduction: 2500,
    otherAdjustments: 0,
    netSalary: 62500,
    paymentStatus: "pending",
  },
  {
    id: "item-2",
    employeeId: "EMP-1002",
    employeeName: "Tanjila Akter",
    role: "Accountant",
    branchName: "Main Branch",
    basicSalary: 35000,
    allowances: 10000,
    overtimePay: 0,
    lateDeduction: 0,
    leaveDeduction: 0,
    otherAdjustments: 0,
    netSalary: 45000,
    paymentStatus: "pending",
  },
  {
    id: "item-3",
    employeeId: "EMP-1003",
    employeeName: "Abul Kalam",
    role: "Sales Associate",
    branchName: "Main Branch",
    basicSalary: 18000,
    allowances: 5000,
    overtimePay: 1200,
    lateDeduction: 500,
    leaveDeduction: 0,
    otherAdjustments: 0,
    netSalary: 23700,
    paymentStatus: "pending",
  },
  {
    id: "item-4",
    employeeId: "EMP-1004",
    employeeName: "Rafiqul Islam",
    role: "Store Keeper",
    branchName: "Main Branch",
    basicSalary: 20000,
    allowances: 0,
    overtimePay: 0,
    lateDeduction: 0,
    leaveDeduction: 0,
    otherAdjustments: 0,
    netSalary: 20000,
    paymentStatus: "pending",
  },
];

export function RunPayrollWizard({
  isOpen,
  onClose,
  onRunCompleted,
  isBangla = false,
}: RunPayrollWizardProps) {
  const { formatCurrency } = useCurrency();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  const [branchName, setBranchName] = useState("Main Branch");
  const [payPeriod, setPayPeriod] = useState("July 2026");
  const [paymentDate, setPaymentDate] = useState("2026-07-28");

  const [payrollItems, setPayrollItems] = useState<PayrollItem[]>(INITIAL_AUTO_CALCULATED_ITEMS);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Total Calculations
  const totalGross = payrollItems.reduce((sum, i) => sum + i.basicSalary + i.allowances + i.overtimePay, 0);
  const totalDeductions = payrollItems.reduce((sum, i) => sum + i.lateDeduction + i.leaveDeduction, 0);
  const totalNet = payrollItems.reduce((sum, i) => sum + i.netSalary, 0);

  const handleAdjustmentChange = (id: string, adjValue: number) => {
    setPayrollItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const gross = item.basicSalary + item.allowances + item.overtimePay;
          const ded = item.lateDeduction + item.leaveDeduction;
          const net = gross - ded + adjValue;
          return { ...item, otherAdjustments: adjValue, netSalary: net, isEdited: true };
        }
        return item;
      })
    );
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep((s) => (s + 1) as any);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((s) => (s - 1) as any);
  };

  const handleSubmitFinal = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const createdRun: PayrollRun = {
        id: `PR-2026-07-${Math.floor(100 + Math.random() * 900)}`,
        periodName: payPeriod,
        branchName: branchName,
        employeeCount: payrollItems.length,
        totalGross: totalGross,
        totalDeductions: totalDeductions,
        totalNetPayroll: totalNet,
        status: "completed",
        createdBy: "System Admin (HR)",
        createdDate: paymentDate,
        financeTransactionId: `TXN-FIN-${Math.floor(1000 + Math.random() * 9000)}`,
        items: payrollItems,
      };

      setIsSubmitting(false);
      onRunCompleted(createdRun);
      onClose();
      toast.success(
        isBangla
          ? `পে-রোল রান সম্পন্ন হয়েছে! ফাইন্যান্স ট্রানজ্যাকশন ৳${totalNet.toLocaleString()} তৈরি করা হয়েছে।`
          : `Payroll run finalized! Created Finance expense entry for ${formatCurrency(totalNet)}.`
      );
    }, 600);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl p-5 bg-card">
        <DialogHeader className="space-y-1 border-b border-border pb-3">
          <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <Play className="h-4 w-4 text-primary fill-current" />
            <span>{isBangla ? "নতুন পে-রোল রান (Run Monthly Payroll Wizard)" : "Monthly Payroll Run Wizard"}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Automatically compute salaries from Attendance/Leave logs, review exceptions, and generate Finance entry.
          </DialogDescription>
        </DialogHeader>

        {/* Stepper Indicator */}
        <div className="grid grid-cols-4 gap-2 pt-1 pb-3 text-[11px] font-semibold border-b border-border/60">
          <div className={cn("pb-1 border-b-2 text-center", currentStep >= 1 ? "border-primary text-primary font-bold" : "border-muted text-muted-foreground")}>
            1. Period Setup
          </div>
          <div className={cn("pb-1 border-b-2 text-center", currentStep >= 2 ? "border-primary text-primary font-bold" : "border-muted text-muted-foreground")}>
            2. Auto Calculations
          </div>
          <div className={cn("pb-1 border-b-2 text-center", currentStep >= 3 ? "border-primary text-primary font-bold" : "border-muted text-muted-foreground")}>
            3. Warnings Review
          </div>
          <div className={cn("pb-1 border-b-2 text-center", currentStep === 4 ? "border-primary text-primary font-bold" : "border-muted text-muted-foreground")}>
            4. Generate & Sync
          </div>
        </div>

        <form onSubmit={handleSubmitFinal} className="space-y-4 text-xs pt-1">
          {/* STEP 1: Period Setup */}
          {currentStep === 1 && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-foreground">Branch *</Label>
                  <Select value={branchName} onValueChange={setBranchName}>
                    <SelectTrigger className="h-9 text-xs bg-background/50 border-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Main Branch" className="text-xs">Main Branch</SelectItem>
                      <SelectItem value="Mirpur Branch" className="text-xs">Mirpur Branch</SelectItem>
                      <SelectItem value="Gulshan Branch" className="text-xs">Gulshan Branch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-foreground">Salary Month / Pay Period *</Label>
                  <Select value={payPeriod} onValueChange={setPayPeriod}>
                    <SelectTrigger className="h-9 text-xs bg-background/50 border-input font-mono font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="July 2026" className="text-xs font-mono font-bold">July 2026</SelectItem>
                      <SelectItem value="June 2026" className="text-xs font-mono">June 2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-foreground">Payment Execution Date *</Label>
                <Input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="h-9 bg-background/50 text-xs border-input font-mono"
                />
              </div>

              <div className="p-3.5 bg-background/50 border border-border/80 rounded-xl space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-medium">Included Employees Count</span>
                <strong className="text-base font-bold text-foreground block font-mono">
                  {payrollItems.length} Active Employees Included
                </strong>
              </div>
            </div>
          )}

          {/* STEP 2: Auto Calculated Review Table */}
          {currentStep === 2 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">
                  Review auto-computed salaries based on Attendance & Leave. Highlighted rows indicate manual adjustment.
                </span>
              </div>

              <div className="border border-border/80 rounded-xl overflow-x-auto shadow-2xs max-h-[300px]">
                <Table className="text-left text-xs">
                  <TableHeader>
                    <TableRow className="bg-muted/40 text-[10px] uppercase font-semibold">
                      <TableHead>Employee</TableHead>
                      <TableHead>Basic</TableHead>
                      <TableHead>Allowances</TableHead>
                      <TableHead>Overtime</TableHead>
                      <TableHead>Late Ded.</TableHead>
                      <TableHead>Leave Ded.</TableHead>
                      <TableHead>Adj (৳)</TableHead>
                      <TableHead className="text-right">Net Salary</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payrollItems.map((item) => (
                      <TableRow key={item.id} className={cn("hover:bg-muted/15", item.isEdited && "bg-amber-500/5")}>
                        <TableCell className="font-bold text-foreground">
                          {item.employeeName}
                          <span className="block text-[10px] text-muted-foreground font-mono font-normal">{item.role}</span>
                        </TableCell>
                        <TableCell className="font-mono text-muted-foreground">{formatCurrency(item.basicSalary)}</TableCell>
                        <TableCell className="font-mono text-emerald-600">+{formatCurrency(item.allowances)}</TableCell>
                        <TableCell className="font-mono text-blue-600">+{formatCurrency(item.overtimePay)}</TableCell>
                        <TableCell className="font-mono text-rose-600">-{formatCurrency(item.lateDeduction)}</TableCell>
                        <TableCell className="font-mono text-rose-600">-{formatCurrency(item.leaveDeduction)}</TableCell>
                        <TableCell className="w-24">
                          <Input
                            type="number"
                            value={item.otherAdjustments}
                            onChange={(e) => handleAdjustmentChange(item.id, parseFloat(e.target.value) || 0)}
                            className="h-7 text-xs bg-background border-input font-mono font-bold"
                          />
                        </TableCell>
                        <TableCell className="text-right font-mono font-bold text-foreground">
                          {formatCurrency(item.netSalary)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* STEP 3: Review & Warning Banners */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-background/50 border border-border/70 rounded-xl space-y-0.5">
                  <span className="text-[10px] text-muted-foreground uppercase">Gross Payroll</span>
                  <strong className="text-sm font-mono font-bold text-foreground block">{formatCurrency(totalGross)}</strong>
                </div>

                <div className="p-3 bg-background/50 border border-border/70 rounded-xl space-y-0.5">
                  <span className="text-[10px] text-muted-foreground uppercase">Total Deductions</span>
                  <strong className="text-sm font-mono font-bold text-rose-600 block">-{formatCurrency(totalDeductions)}</strong>
                </div>

                <div className="p-3 bg-background/50 border border-border/70 rounded-xl space-y-0.5">
                  <span className="text-[10px] text-muted-foreground uppercase">Total Net Payroll</span>
                  <strong className="text-sm font-mono font-bold text-emerald-600 block">{formatCurrency(totalNet)}</strong>
                </div>

                <div className="p-3 bg-background/50 border border-border/70 rounded-xl space-y-0.5">
                  <span className="text-[10px] text-muted-foreground uppercase">Employees</span>
                  <strong className="text-sm font-mono font-bold text-foreground block">{payrollItems.length} Total</strong>
                </div>
              </div>

              {/* Warning Banners */}
              <div className="space-y-2">
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-xs">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>Notice: 1 employee has unexcused late attendance penalty applied.</span>
                </div>

                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-xs">
                  <FileCheck className="h-4 w-4 shrink-0" />
                  <span>Leaves Verified: Approved leave records are automatically reflected in net calculations.</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Generate Payslips & Sync Finance */}
          {currentStep === 4 && (
            <div className="p-4 bg-background/50 border border-border/80 rounded-xl space-y-4 text-xs">
              <div className="space-y-1">
                <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-emerald-500" />
                  <span>Final Payroll Finalization & Integration</span>
                </h4>
                <p className="text-muted-foreground text-xs">
                  Confirming this payroll run will automatically generate employee payslips and post a single payroll expense entry into Finance.
                </p>
              </div>

              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl font-mono text-emerald-700 dark:text-emerald-300 font-bold space-y-1">
                <div className="flex justify-between">
                  <span>Pay Period: {payPeriod}</span>
                  <span>Branch: {branchName}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span>Total Net Payroll Disbursed:</span>
                  <span>{formatCurrency(totalNet)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Controls Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 1 || isSubmitting}
              className="h-9 text-xs px-3 gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>

            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="h-9 px-4 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-1 cursor-pointer"
              >
                <span>Next Step</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-9 px-5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 cursor-pointer shadow-xs"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Finalizing & Syncing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Confirm & Post Finance Expense</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
