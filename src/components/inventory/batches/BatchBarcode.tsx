"use client";

import React from "react";
import { Barcode } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BatchBarcodeProps {
  barcode?: string | null;
  barcodeType?: "manufacturer" | "auto" | string;
  manufacturerBarcode?: string | null;
  className?: string;
  showLabelAbove?: boolean;
}

export function BatchBarcode({
  barcode,
  barcodeType,
  manufacturerBarcode,
  className,
  showLabelAbove = false,
}: BatchBarcodeProps) {
  const isManufacturer = barcodeType === "manufacturer" || (!!manufacturerBarcode && !barcode);
  const displayCode = isManufacturer ? (manufacturerBarcode || barcode) : (barcode || manufacturerBarcode);

  if (!displayCode) {
    return (
      <span className={cn("text-[11px] text-muted-foreground/60 italic", className)}>
        No barcode
      </span>
    );
  }

  const labelText = isManufacturer ? "MANUFACTURER BARCODE" : "UNIQUE BATCH BARCODE";

  return (
    <div className={cn("inline-flex flex-col gap-0.5", className)}>
      {showLabelAbove && (
        <span className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground/80">
          {labelText}
        </span>
      )}
      <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <Barcode className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" />
        <span className="font-mono font-bold text-foreground text-[11px] tracking-tight">
          {displayCode}
        </span>
        {!showLabelAbove && (
          isManufacturer ? (
            <Badge
              variant="outline"
              className="text-[9px] font-semibold py-0 px-1 border-border bg-muted/40 text-muted-foreground"
            >
              Manufacturer
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-[9px] font-semibold py-0 px-1 border-primary/20 bg-primary/5 text-primary/80"
            >
              Unique Batch
            </Badge>
          )
        )}
      </div>
    </div>
  );
}
