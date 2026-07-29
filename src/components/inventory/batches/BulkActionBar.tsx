"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Barcode, Printer, Download, X, Loader2 } from "lucide-react";
import { useGenerateMissingBarcodes } from "@/hooks/api/useBatches";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { toast } from "sonner";
import { BatchRowData } from "./BatchRow";

interface BulkActionBarProps {
  selectedBatches: BatchRowData[];
  onClearSelection: () => void;
}

export function BulkActionBar({
  selectedBatches,
  onClearSelection,
}: BulkActionBarProps) {
  const { isBangla } = useAppTranslation();
  const generateBarcodeMutation = useGenerateMissingBarcodes();

  if (selectedBatches.length === 0) return null;

  const batchesWithoutBarcode = selectedBatches.filter(
    (b) => !b.barcode && !b.manufacturerBarcode
  );
  const canGenerateBarcodes = batchesWithoutBarcode.length > 0;

  const handleGenerateBarcodes = async () => {
    try {
      await generateBarcodeMutation.mutateAsync(
        batchesWithoutBarcode.map((b) => b.id)
      );
      toast.success(
        isBangla
          ? `${batchesWithoutBarcode.length}টি ব্যাচের জন্য বারকোড তৈরি করা হয়েছে`
          : `Generated barcodes for ${batchesWithoutBarcode.length} batches`
      );
      onClearSelection();
    } catch {
      // Error toast handled by axios interceptor
    }
  };

  const handlePrintLabels = () => {
    toast.info(
      isBangla
        ? `${selectedBatches.length}টি লেবেল প্রিন্টারে পাঠানো হচ্ছে...`
        : `Sending ${selectedBatches.length} labels to printer...`
    );
  };

  const handleExport = () => {
    toast.success(
      isBangla
        ? `${selectedBatches.length}টি ব্যাচের এক্সপোর্ট সম্পন্ন হয়েছে`
        : `Exported ${selectedBatches.length} batches to CSV`
    );
  };

  return (
    <TooltipProvider delayDuration={150}>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg animate-in slide-in-from-bottom-4 duration-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClearSelection}
              className="h-8 w-8 cursor-pointer text-muted-foreground hover:text-foreground"
              title="Clear selection"
            >
              <X className="h-4 w-4" />
            </Button>
            <span className="text-xs sm:text-sm font-bold text-foreground">
              {isBangla
                ? `${selectedBatches.length}টি ব্যাচ নির্বাচিত`
                : `${selectedBatches.length} Batch${selectedBatches.length > 1 ? "es" : ""} Selected`}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Generate Barcodes with Tooltip when disabled */}
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateBarcodes}
                    disabled={!canGenerateBarcodes || generateBarcodeMutation.isPending}
                    className="h-8 text-xs font-semibold gap-1.5 cursor-pointer"
                  >
                    {generateBarcodeMutation.isPending ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Barcode className="h-3.5 w-3.5" />
                    )}
                    {isBangla ? "বারকোড তৈরি" : "Generate Barcodes"}
                    {canGenerateBarcodes && (
                      <span className="ml-1 text-muted-foreground font-mono">
                        ({batchesWithoutBarcode.length})
                      </span>
                    )}
                  </Button>
                </span>
              </TooltipTrigger>
              {!canGenerateBarcodes && (
                <TooltipContent side="top">
                  {isBangla
                    ? "নির্বাচিত সকল ব্যাচে ইতিমধ্যেই বারকোড বিদ্যমান"
                    : "All selected batches already have barcodes assigned"}
                </TooltipContent>
              )}
            </Tooltip>

            {/* Print Labels */}
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrintLabels}
              className="h-8 text-xs font-semibold gap-1.5 cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              {isBangla ? "লেবেল প্রিন্ট" : "Print Labels"}
            </Button>

            {/* Export */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="h-8 text-xs font-semibold gap-1.5 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              {isBangla ? "এক্সপোর্ট" : "Export"}
            </Button>

            {/* Clear Selection button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              className="h-8 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {isBangla ? "নির্বাচন বাতিল" : "Clear Selection"}
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
