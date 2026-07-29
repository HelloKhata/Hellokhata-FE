"use client";

import React, { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Package, ChevronRight, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { BatchStatusBadge } from "./BatchStatusBadge";
import { BatchSourceBadge } from "./BatchSourceBadge";
import { BatchBarcode } from "./BatchBarcode";
import { BatchProgress } from "./BatchProgress";

export interface BatchRowData {
  id: string;
  batchNumber: string;
  itemId: string;
  itemName?: string;
  itemImage?: string;
  unit?: string;
  category?: string;
  quantity: number;
  quantityReceived?: number;
  costPrice: number;
  sellingPrice?: number;
  expiryDate?: string | null;
  manufactureDate?: string | null;
  receivedDate?: string;
  supplier?: string;
  branchName?: string;
  branchId?: string;
  barcode?: string | null;
  barcodeType?: "manufacturer" | "auto" | string;
  manufacturerBarcode?: string | null;
  source?: "purchase" | "return" | "legacy" | "adjustment" | "legacy_merge" | string;
  hasExpiry?: boolean;
  isExpired?: boolean;
  isExpiringSoon?: boolean;
  isActive?: boolean;
  daysUntilExpiry?: number | null;
  createdAt?: string;
}

interface BatchRowProps {
  batch: BatchRowData;
  showBranch?: boolean;
  isSelectable?: boolean;
  isSelected?: boolean;
  onSelect?: (id: string, checked: boolean) => void;
  onTap?: (batch: BatchRowData) => void;
}

export const BatchRow = memo(function BatchRow({
  batch,
  showBranch = false,
  isSelectable = false,
  isSelected = false,
  onSelect,
  onTap,
}: BatchRowProps) {
  const remaining = batch.quantity;
  const received = batch.quantityReceived ?? batch.quantity;
  const unit = batch.unit || "units";

  return (
    <Card
      tabIndex={0}
      role="button"
      aria-label={`Batch ${batch.batchNumber} - ${batch.itemName}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onTap?.(batch);
        }
      }}
      className={cn(
        "group border border-border/60 hover:border-primary/50 hover:shadow-xs transition-all duration-150 cursor-pointer rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        batch.isExpired && "border-rose-300 bg-rose-50/20 dark:bg-rose-950/10",
        batch.isExpiringSoon && !batch.isExpired && "border-amber-300 bg-amber-50/20 dark:bg-amber-950/10",
        isSelected && "ring-2 ring-primary/40 border-primary/50 bg-primary/5"
      )}
    >
      <CardContent className="p-3 sm:p-3.5">
        <div className="flex items-center gap-3">
          {/* Checkbox */}
          {isSelectable && (
            <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => onSelect?.(batch.id, !!checked)}
                className="cursor-pointer"
                aria-label={`Select batch ${batch.batchNumber}`}
              />
            </div>
          )}

          {/* Main Click Area */}
          <div
            className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0"
            onClick={() => onTap?.(batch)}
          >
            {/* Product Image */}
            <div
              className={cn(
                "h-11 w-11 rounded-lg flex items-center justify-center shrink-0 border border-border/40 overflow-hidden",
                batch.isExpired
                  ? "bg-rose-100 dark:bg-rose-900/30"
                  : batch.isExpiringSoon
                  ? "bg-amber-100 dark:bg-amber-900/30"
                  : "bg-muted/60"
              )}
            >
              {batch.itemImage ? (
                <img
                  src={batch.itemImage}
                  alt={batch.itemName || ""}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Package
                  className={cn(
                    "h-5 w-5",
                    batch.isExpired
                      ? "text-rose-600"
                      : batch.isExpiringSoon
                      ? "text-amber-600"
                      : "text-muted-foreground"
                  )}
                />
              )}
            </div>

            {/* Product Name & Barcode */}
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                  {batch.itemName || batch.batchNumber}
                </h3>
                <span className="font-mono text-[11px] text-muted-foreground/80 font-medium shrink-0">
                  #{batch.batchNumber}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs flex-wrap">
                <BatchBarcode
                  barcode={batch.barcode}
                  barcodeType={batch.barcodeType}
                  manufacturerBarcode={batch.manufacturerBarcode}
                />
                {showBranch && batch.branchName && (
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1 shrink-0">
                    <Building2 className="h-3 w-3 shrink-0" />
                    {batch.branchName}
                  </span>
                )}
              </div>
            </div>

            {/* Stock Progress Visualization (2nd Hierarchy) */}
            <div className="hidden sm:block w-36 sm:w-44 shrink-0">
              <BatchProgress
                remaining={remaining}
                total={received}
                unit={unit}
              />
            </div>

            {/* Price Column (4th Hierarchy) */}
            <div className="hidden md:block text-right shrink-0 min-w-[90px]">
              <div className="text-xs font-mono font-bold text-foreground">
                ৳{batch.costPrice}
              </div>
              <div className="text-[10px] text-muted-foreground">
                {batch.sellingPrice != null ? `Sell: ৳${batch.sellingPrice}` : `Total: ৳${(remaining * batch.costPrice).toLocaleString()}`}
              </div>
            </div>

            {/* Badges Column (3rd & Least Hierarchy) */}
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5 shrink-0">
              <BatchStatusBadge
                hasExpiry={batch.hasExpiry}
                isExpired={batch.isExpired}
                isExpiringSoon={batch.isExpiringSoon}
                daysUntilExpiry={batch.daysUntilExpiry}
              />
              <div className="hidden lg:block">
                <BatchSourceBadge source={batch.source} />
              </div>
            </div>

            {/* Chevron */}
            <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>
        </div>

        {/* Mobile Extra Stock Bar */}
        <div className="sm:hidden mt-2.5 pt-2 border-t border-border/40">
          <BatchProgress
            remaining={remaining}
            total={received}
            unit={unit}
          />
        </div>
      </CardContent>
    </Card>
  );
});
