"use client";

import React from "react";
import { useCurrency } from "@/hooks/useAppTranslation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, Printer, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";

interface StatementRowData {
  date: string;
  description: string;
  debit: number;
  credit: number;
  runningBalance: number;
}

const SAMPLE_STATEMENT_PREVIEW: StatementRowData[] = [
  {
    date: "2026-07-28",
    description: "bKash Merchant Settlement - Batch #99",
    debit: 0,
    credit: 45000,
    runningBalance: 525000,
  },
  {
    date: "2026-07-27",
    description: "Supplier Bill Payment - ABC Traders (BILL-1025)",
    debit: 15000,
    credit: 0,
    runningBalance: 480000,
  },
  {
    date: "2026-07-25",
    description: "Customer Credit Clearance - City Electronics",
    debit: 0,
    credit: 68000,
    runningBalance: 495000,
  },
  {
    date: "2026-07-22",
    description: "Office Utility & Maintenance Expense",
    debit: 3500,
    credit: 0,
    runningBalance: 427000,
  },
];

interface AccountStatementPreviewProps {
  accountName: string;
  isBangla?: boolean;
}

export function AccountStatementPreview({
  accountName,
  isBangla = false,
}: AccountStatementPreviewProps) {
  const { formatCurrency } = useCurrency();

  const handleExport = (type: string) => {
    toast.success(
      isBangla
        ? `${accountName}-এর স্টেটমেন্ট ${type} বয়ানে ডাউনলোড হচ্ছে...`
        : `Exporting ${accountName} statement as ${type}...`
    );
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-4 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-3">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <span>{isBangla ? "চলতি ব্যালেন্স স্টেটমেন্ট (Running Balance)" : "Account Statement & Running Balance"}</span>
          </h3>
          <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
            Account: {accountName}
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleExport("PDF")}
            className="h-8 text-xs font-semibold gap-1 bg-background/50 cursor-pointer"
          >
            <FileText className="h-3.5 w-3.5 text-rose-500" />
            <span>PDF</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleExport("Excel")}
            className="h-8 text-xs font-semibold gap-1 bg-background/50 cursor-pointer"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" />
            <span>Excel</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleExport("Print")}
            className="h-8 text-xs font-semibold gap-1 bg-background/50 cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Print</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-border/80 rounded-xl overflow-hidden">
        <Table className="text-left text-xs">
          <TableHeader>
            <TableRow className="bg-muted/30 text-[11px] font-semibold uppercase tracking-wider">
              <TableHead className="py-2.5">{isBangla ? "তারিখ" : "Date"}</TableHead>
              <TableHead className="py-2.5">{isBangla ? "বিবরণ" : "Description"}</TableHead>
              <TableHead className="py-2.5 text-right">{isBangla ? "ডেবিট (-)" : "Debit (-)"}</TableHead>
              <TableHead className="py-2.5 text-right">{isBangla ? "ক্রেডিট (+)" : "Credit (+)"}</TableHead>
              <TableHead className="py-2.5 text-right">{isBangla ? "চলতি ব্যালেন্স" : "Running Balance"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SAMPLE_STATEMENT_PREVIEW.map((row, idx) => (
              <TableRow key={idx} className="hover:bg-muted/15">
                <TableCell className="py-2.5 font-mono text-[11px] text-muted-foreground">
                  {row.date}
                </TableCell>
                <TableCell className="py-2.5 font-bold text-foreground">
                  {row.description}
                </TableCell>
                <TableCell className="py-2.5 text-right font-mono font-semibold text-rose-600 dark:text-rose-400">
                  {row.debit > 0 ? formatCurrency(row.debit) : "-"}
                </TableCell>
                <TableCell className="py-2.5 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                  {row.credit > 0 ? formatCurrency(row.credit) : "-"}
                </TableCell>
                <TableCell className="py-2.5 text-right font-mono font-bold text-foreground">
                  {formatCurrency(row.runningBalance)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
