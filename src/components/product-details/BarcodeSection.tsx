"use client";

import React from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, QrCode, Barcode as BarcodeIcon } from "lucide-react";
import { BarcodeRecord } from "./mock-data";

interface BarcodeSectionProps {
  barcodes: BarcodeRecord[];
  onPrintLabel?: (barcode: string) => void;
  onGenerateBarcode?: () => void;
}

export function BarcodeSection({
  barcodes,
  onPrintLabel,
  onGenerateBarcode,
}: BarcodeSectionProps) {
  const primaryBarcode = barcodes[0]?.barcode || "8901030700812";

  return (
    <Card className="border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden p-4">
      <CardContent className="p-0 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left Side: Barcode Visual & Code */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white dark:bg-slate-900 border border-border rounded-xl flex items-center justify-center shrink-0">
            <BarcodeIcon className="h-7 w-12 text-slate-800 dark:text-slate-200" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Active Product Barcode
              </span>
            </div>
            <p className="text-base font-mono font-extrabold text-foreground tracking-wider">
              {primaryBarcode}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {barcodes.length} registered barcode labels across branches
            </p>
          </div>
        </div>

        {/* Right Side: Quick Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onGenerateBarcode}
            className="h-9 px-3 text-xs font-semibold border-input bg-background hover:bg-accent text-foreground rounded-xl cursor-pointer"
          >
            <QrCode className="h-3.5 w-3.5 mr-1.5" />
            Generate Barcode
          </Button>

          <Button
            size="sm"
            onClick={() => onPrintLabel?.(primaryBarcode)}
            className="h-9 px-3 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5 mr-1.5" />
            Print Label
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
