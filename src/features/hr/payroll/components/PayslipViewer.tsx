"use client";

import React, { useState } from "react";
import { Payslip } from "../types";
import { MOCK_PAYSLIPS } from "../constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Receipt, Download, Printer, Share2, Eye } from "lucide-react";
import { useCurrency } from "@/hooks/useAppTranslation";
import { PayslipPreviewDialog } from "./PayslipPreviewDialog";
import { toast } from "sonner";

interface PayslipViewerProps {
  isBangla?: boolean;
}

export function PayslipViewer({ isBangla = false }: PayslipViewerProps) {
  const { formatCurrency } = useCurrency();
  const [payslips, setPayslips] = useState<Payslip[]>(MOCK_PAYSLIPS);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);

  const handleDownloadPdf = (ps: Payslip) => {
    toast.success(`Downloading PDF payslip for ${ps.employeeName} (${ps.monthYear})...`);
  };

  const handleShare = (ps: Payslip) => {
    toast.info(`Payslip share link generated for ${ps.employeeName}`);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-4 shadow-2xs">
      <div className="border-b border-border/80 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
            <Receipt className="h-4 w-4 text-primary" />
            <span>{isBangla ? "কর্মীদের পে-স্লিপ তালিকা (Generated Employee Payslips)" : "Generated Employee Payslips"}</span>
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Download PDF or print official monthly payslips formatted with Bengali language support.
          </p>
        </div>
      </div>

      <div className="border border-border/80 rounded-xl overflow-hidden text-xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 text-[10px] uppercase font-semibold">
              <TableHead>Employee</TableHead>
              <TableHead>Role & Branch</TableHead>
              <TableHead>Payroll Period</TableHead>
              <TableHead>Net Salary Paid</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payslips.map((ps) => (
              <TableRow key={ps.id} className="hover:bg-muted/15">
                <TableCell className="font-bold text-foreground">{ps.employeeName}</TableCell>
                <TableCell className="text-muted-foreground text-[11px]">
                  {ps.role} • {ps.branchName}
                </TableCell>
                <TableCell className="font-mono text-muted-foreground">{ps.monthYear}</TableCell>
                <TableCell className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(ps.netPaid)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-bold">
                    Paid
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPayslip(ps)}
                      className="h-7 text-xs font-semibold gap-1 bg-background/50 cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5 text-primary" />
                      <span>View</span>
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadPdf(ps)}
                      className="h-7 text-xs font-semibold gap-1 bg-background/50 cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5 text-emerald-500" />
                      <span>PDF</span>
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleShare(ps)}
                      className="h-7 w-7 text-muted-foreground cursor-pointer"
                      title="Share Payslip"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Printable Payslip Preview Modal */}
      <PayslipPreviewDialog
        payslip={selectedPayslip}
        isOpen={!!selectedPayslip}
        onClose={() => setSelectedPayslip(null)}
        isBangla={isBangla}
      />
    </div>
  );
}
