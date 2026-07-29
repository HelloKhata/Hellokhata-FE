"use client";

import React from "react";
import { Payslip } from "../types";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Printer, Download, Share2, Building2, Receipt, CheckCircle2 } from "lucide-react";
import { useCurrency } from "@/hooks/useAppTranslation";
import { toast } from "sonner";

interface PayslipPreviewDialogProps {
  payslip: Payslip | null;
  isOpen: boolean;
  onClose: () => void;
  isBangla?: boolean;
}

export function PayslipPreviewDialog({
  payslip,
  isOpen,
  onClose,
  isBangla = true,
}: PayslipPreviewDialogProps) {
  const { formatCurrency } = useCurrency();
  if (!payslip) return null;

  const totalAllowances = payslip.allowancesBreakdown.reduce((sum, a) => sum + a.amount, 0);
  const totalDeductions = payslip.deductionsBreakdown.reduce((sum, d) => sum + d.amount, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl p-6 bg-card border-2 border-primary/20 rounded-2xl shadow-xl">
        {/* Printable Payslip Card Container */}
        <div id="printable-payslip" className="space-y-4 text-xs p-4 bg-background rounded-xl border border-border/80">
          {/* Company Header */}
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground font-black flex items-center justify-center text-sm shadow-xs">
                HK
              </div>
              <div>
                <strong className="text-base font-extrabold text-foreground tracking-tight block">
                  হ্যালো খাতা ইআরপি (HelloKhata ERP)
                </strong>
                <span className="text-[10px] text-muted-foreground block font-mono">
                  অফিসিয়াল বেতন পে-স্লিপ (Official Monthly Salary Payslip)
                </span>
              </div>
            </div>

            <div className="text-right font-mono text-[11px]">
              <strong className="text-foreground block">{payslip.monthYear}</strong>
              <span className="text-muted-foreground text-[10px]">Issue Date: {payslip.issueDate}</span>
            </div>
          </div>

          {/* Employee Info Grid */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-muted/20 rounded-xl text-xs">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase block">কর্মীর নাম (Employee)</span>
              <strong className="text-foreground text-xs">{payslip.employeeName}</strong>
            </div>

            <div>
              <span className="text-[10px] text-muted-foreground uppercase block">আইডি ও পদবী (ID & Role)</span>
              <strong className="text-foreground text-xs font-mono">{payslip.employeeId} • {payslip.role}</strong>
            </div>

            <div>
              <span className="text-[10px] text-muted-foreground uppercase block">শাখা (Branch)</span>
              <strong className="text-foreground text-xs">{payslip.branchName}</strong>
            </div>

            <div>
              <span className="text-[10px] text-muted-foreground uppercase block">পরিশোধের মাধ্যম (Payment Method)</span>
              <strong className="text-emerald-600 dark:text-emerald-400 text-xs font-mono">{payslip.paymentMethod || "Bank"}</strong>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="border border-border/80 rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 text-[10px] uppercase font-semibold">
                  <TableHead>বিবরণ (Earnings & Deductions)</TableHead>
                  <TableHead className="text-right">পরিমাণ (Amount)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-bold">মূল বেতন (Basic Salary)</TableCell>
                  <TableCell className="text-right font-mono font-bold">{formatCurrency(payslip.basicSalary)}</TableCell>
                </TableRow>

                {payslip.allowancesBreakdown.map((al, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="text-emerald-600 font-semibold">{al.name} (+)</TableCell>
                    <TableCell className="text-right font-mono font-semibold text-emerald-600">
                      +{formatCurrency(al.amount)}
                    </TableCell>
                  </TableRow>
                ))}

                {payslip.deductionsBreakdown.map((de, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="text-rose-600 font-semibold">{de.name} (-)</TableCell>
                    <TableCell className="text-right font-mono font-semibold text-rose-600">
                      -{formatCurrency(de.amount)}
                    </TableCell>
                  </TableRow>
                ))}

                <TableRow className="bg-muted/30 font-bold text-sm">
                  <TableCell className="text-foreground font-extrabold">সর্বমোট প্রদেয় বেতন (Net Paid Salary)</TableCell>
                  <TableCell className="text-right font-mono font-black text-emerald-600">
                    {formatCurrency(payslip.netPaid)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrint}
            className="h-9 text-xs font-semibold gap-1.5 cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Print Payslip</span>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => toast.success(`PDF downloaded for ${payslip.employeeName}`)}
              className="h-9 text-xs font-semibold gap-1.5 cursor-pointer"
            >
              <Download className="h-4 w-4 text-emerald-500" />
              <span>Download PDF</span>
            </Button>

            <Button
              type="button"
              onClick={onClose}
              className="h-9 px-4 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
