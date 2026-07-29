"use client";

import React, { useState } from "react";
import { CSVColumnMapping } from "@/types/bank";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRight, CheckCircle2, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";

interface ColumnMappingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmMapping: (mapping: CSVColumnMapping) => void;
  fileName?: string;
  isBangla?: boolean;
}

const SAMPLE_CSV_HEADERS = [
  "Txn_Date",
  "Transaction_Details",
  "Ref_No",
  "Debit_Amount",
  "Credit_Amount",
  "Txn_Type",
  "Balance",
];

const SAMPLE_ROWS = [
  {
    Txn_Date: "2026-07-28",
    Transaction_Details: "bKash Merchant Pay - City Electronics",
    Ref_No: "TXN-99812",
    Debit_Amount: "15000",
    Credit_Amount: "0",
    Txn_Type: "Debit",
    Balance: "485000",
  },
  {
    Txn_Date: "2026-07-27",
    Transaction_Details: "Client Payment - ABC Traders",
    Ref_No: "TXN-99811",
    Debit_Amount: "0",
    Credit_Amount: "45000",
    Txn_Type: "Credit",
    Balance: "500000",
  },
];

export function ColumnMappingDialog({
  isOpen,
  onClose,
  onConfirmMapping,
  fileName = "Bank_Statement_July_2026.csv",
  isBangla = false,
}: ColumnMappingDialogProps) {
  const [mapping, setMapping] = useState<CSVColumnMapping>({
    dateCol: "Txn_Date",
    amountCol: "Credit_Amount",
    descriptionCol: "Transaction_Details",
    referenceCol: "Ref_No",
    typeCol: "Txn_Type",
  });

  const handleSave = () => {
    onConfirmMapping(mapping);
    onClose();
    toast.success(
      isBangla
        ? "কলাম ম্যাপিং সফলভাবে সম্পন্ন হয়েছে"
        : "CSV column mapping confirmed successfully"
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl p-5 bg-card">
        <DialogHeader className="space-y-1 border-b border-border pb-3">
          <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-primary" />
            <span>{isBangla ? "CSV কলাম ম্যাপিং (Column Mapping)" : "Map Statement CSV Columns"}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground font-mono">
            {fileName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-1 text-xs">
          {/* Mapping Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-muted/20 border border-border/70 rounded-xl">
            {/* Field 1: Date */}
            <div className="space-y-1">
              <Label className="text-[11px] font-semibold text-foreground">Date Column *</Label>
              <Select
                value={mapping.dateCol}
                onValueChange={(val) => setMapping({ ...mapping, dateCol: val })}
              >
                <SelectTrigger className="h-8 text-xs bg-background border-input font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SAMPLE_CSV_HEADERS.map((h) => (
                    <SelectItem key={h} value={h} className="text-xs font-mono">
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Field 2: Amount */}
            <div className="space-y-1">
              <Label className="text-[11px] font-semibold text-foreground">Amount Column *</Label>
              <Select
                value={mapping.amountCol}
                onValueChange={(val) => setMapping({ ...mapping, amountCol: val })}
              >
                <SelectTrigger className="h-8 text-xs bg-background border-input font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SAMPLE_CSV_HEADERS.map((h) => (
                    <SelectItem key={h} value={h} className="text-xs font-mono">
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Field 3: Description */}
            <div className="space-y-1">
              <Label className="text-[11px] font-semibold text-foreground">Description Column *</Label>
              <Select
                value={mapping.descriptionCol}
                onValueChange={(val) => setMapping({ ...mapping, descriptionCol: val })}
              >
                <SelectTrigger className="h-8 text-xs bg-background border-input font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SAMPLE_CSV_HEADERS.map((h) => (
                    <SelectItem key={h} value={h} className="text-xs font-mono">
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Field 4: Reference */}
            <div className="space-y-1">
              <Label className="text-[11px] font-semibold text-foreground">Reference / Ref No</Label>
              <Select
                value={mapping.referenceCol}
                onValueChange={(val) => setMapping({ ...mapping, referenceCol: val })}
              >
                <SelectTrigger className="h-8 text-xs bg-background border-input font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SAMPLE_CSV_HEADERS.map((h) => (
                    <SelectItem key={h} value={h} className="text-xs font-mono">
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sample CSV Data Preview Table */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-foreground uppercase tracking-wide block">
              CSV Preview Sample (Top 2 Rows)
            </span>
            <div className="border border-border/80 rounded-lg overflow-x-auto bg-background/50">
              <Table className="text-left text-[11px]">
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="py-2 text-[10px]">Date ({mapping.dateCol})</TableHead>
                    <TableHead className="py-2 text-[10px]">Details ({mapping.descriptionCol})</TableHead>
                    <TableHead className="py-2 text-[10px]">Ref ({mapping.referenceCol})</TableHead>
                    <TableHead className="py-2 text-[10px]">Amount ({mapping.amountCol})</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SAMPLE_ROWS.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="py-1.5 font-mono">{row.Txn_Date}</TableCell>
                      <TableCell className="py-1.5 truncate max-w-[150px]">{row.Transaction_Details}</TableCell>
                      <TableCell className="py-1.5 font-mono">{row.Ref_No}</TableCell>
                      <TableCell className="py-1.5 font-mono font-bold">
                        ৳{row.Credit_Amount !== "0" ? row.Credit_Amount : `-${row.Debit_Amount}`}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <Button
              type="button"
              onClick={handleSave}
              className="flex-1 h-9 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{isBangla ? "ম্যাপিং নিশ্চিত করুন" : "Confirm Mapping & Import"}</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-9 text-xs px-4 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {isBangla ? "বাতিল" : "Cancel"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
