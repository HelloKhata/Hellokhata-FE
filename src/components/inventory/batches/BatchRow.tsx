"use client";

import React, { memo } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Building2,
  Sparkles,
  Tag,
  DollarSign,
  Eye,
  Pencil,
  SlidersHorizontal,
  Printer,
  MoreVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrency, useAppTranslation } from "@/hooks/useAppTranslation";
import { BatchStatusBadge } from "./BatchStatusBadge";

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
  offer?: any;
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
  index?: number;
  showBranch?: boolean;
  isSelectable?: boolean;
  isSelected?: boolean;
  offer?: any;
  onSelect?: (id: string, checked: boolean) => void;
  onTap?: (batch: BatchRowData) => void;
  onViewDetails?: (batch: BatchRowData) => void;
  onEdit?: (batch: BatchRowData) => void;
  onAdjust?: (batch: BatchRowData) => void;
  onCreateOffer?: (batch: BatchRowData) => void;
  onPrintLabel?: (batch: BatchRowData) => void;
}

export function OfferBadge({ offer, isBangla }: { offer: any; isBangla?: boolean }) {
  if (!offer) return <span className="text-xs text-muted-foreground/50">—</span>;

  if (offer.type === 'bogo') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 whitespace-nowrap shadow-2xs">
        <Sparkles className="h-3 w-3 text-amber-400" />
        BOGO
      </span>
    );
  }

  if (offer.type === 'percentage') {
    const pct = offer.percentageConfig?.percentage || offer.discountPercentage;
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 whitespace-nowrap shadow-2xs">
        <Tag className="h-3 w-3 text-indigo-400" />
        {pct ? `${pct}% OFF` : 'Discount'}
      </span>
    );
  }

  if (offer.type === 'flat') {
    const amt = offer.flatConfig?.amount || offer.flatDiscount;
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap shadow-2xs">
        <DollarSign className="h-3 w-3 text-emerald-400" />
        ৳{amt} OFF
      </span>
    );
  }

  if (offer.type === 'bundle') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 whitespace-nowrap shadow-2xs">
        Bundle
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 whitespace-nowrap shadow-2xs">
      <Sparkles className="h-3 w-3" />
      {offer.title || 'Offer'}
    </span>
  );
}

export const BatchRow = memo(function BatchRow({
  batch,
  index = 0,
  showBranch = false,
  isSelectable = false,
  isSelected = false,
  offer,
  onSelect,
  onTap,
  onViewDetails,
  onEdit,
  onAdjust,
  onCreateOffer,
  onPrintLabel,
}: BatchRowProps) {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const router = useRouter();

  const handleRowClick = () => {
    onTap?.(batch);
  };

  const activeOffer = offer || batch.offer;

  return (
    <div
      tabIndex={0}
      role="button"
      aria-label={`Batch ${batch.batchNumber} - ${batch.itemName}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleRowClick();
        }
      }}
      onClick={handleRowClick}
      className={cn(
        "flex items-center justify-between px-6 py-3.5 hover:bg-muted/30 transition-colors cursor-pointer group gap-4 border-b border-border/30 outline-none focus-visible:bg-muted/30",
        batch.isExpired && "bg-rose-950/10 hover:bg-rose-950/20",
        batch.isExpiringSoon && !batch.isExpired && "bg-amber-950/10 hover:bg-amber-950/20",
        isSelected && "bg-primary/10 border-primary/40"
      )}
    >
      {/* 1. SL. / Checkbox (w-10) */}
      <div
        className="w-10 shrink-0 text-left text-xs font-mono font-medium text-muted-foreground/80"
        onClick={(e) => e.stopPropagation()}
      >
        {isSelectable ? (
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect?.(batch.id, !!checked)}
            className="cursor-pointer"
            aria-label={`Select batch ${batch.batchNumber}`}
          />
        ) : (
          String(index + 1).padStart(2, "0")
        )}
      </div>

      {/* 2. Batch (w-28 sm:w-36) */}
      <div className="w-28 sm:w-36 shrink-0 min-w-0 text-left space-y-0.5">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors">
            #{batch.batchNumber}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground flex-wrap">
          {batch.barcode && (
            <span className="font-mono text-[11px] text-slate-300 truncate block">
              BARCODE: {batch.barcode}
            </span>
          )}
        </div>
      </div>

      {/* 3. Product (flex-1) */}
      <div className="flex-1 min-w-0 text-left">
        <p className="font-bold text-foreground text-xs sm:text-sm leading-snug truncate group-hover:text-primary transition-colors">
          {batch.itemName || batch.batchNumber}
        </p>
        {batch.category && (
          <p className="text-[11px] text-muted-foreground/80 truncate">
            {batch.category}
          </p>
        )}
      </div>

      {/* 4. Available (w-24 sm:w-28) */}
      <div className="w-24 sm:w-28 shrink-0 min-w-0 text-left">
        <p className="text-xs sm:text-sm font-extrabold text-foreground whitespace-nowrap">
          {batch.quantity}{" "}
          <span className="text-xs font-normal text-muted-foreground">
            {batch.unit || "pcs"}
          </span>
        </p>
      </div>

      {/* 5. Cost (w-20 sm:w-24) */}
      <div className="w-20 sm:w-24 shrink-0 text-right">
        <p className="text-xs sm:text-sm font-mono font-bold text-foreground whitespace-nowrap">
          {formatCurrency(batch.costPrice)}
        </p>
      </div>

      {/* 6. Selling (w-20 sm:w-24) */}
      <div className="w-20 sm:w-24 shrink-0 text-right">
        {batch.sellingPrice != null ? (
          <p className="text-xs sm:text-sm font-mono font-bold text-emerald-400 whitespace-nowrap">
            {formatCurrency(batch.sellingPrice)}
          </p>
        ) : (
          <span className="text-xs text-muted-foreground/50">—</span>
        )}
      </div>

      {/* 7. Offer (w-24 sm:w-28) */}
      <div className="w-24 sm:w-28 shrink-0 text-center flex items-center justify-center">
        <OfferBadge offer={activeOffer} isBangla={isBangla} />
      </div>

      {/* 8. Expiry (w-28 sm:w-32) */}
      <div className="w-28 sm:w-32 shrink-0 text-left space-y-0.5">
        {batch.expiryDate ? (
          <>
            <p className="text-xs font-semibold text-foreground whitespace-nowrap">
              {format(new Date(batch.expiryDate), "dd MMM yyyy")}
            </p>
            {batch.daysUntilExpiry != null && (
              <p
                className={cn(
                  "text-[10px] font-medium whitespace-nowrap",
                  batch.isExpired
                    ? "text-rose-500"
                    : batch.isExpiringSoon
                    ? "text-amber-400"
                    : "text-muted-foreground/80"
                )}
              >
                {batch.isExpired
                  ? isBangla
                    ? "মেয়াদ শেষ"
                    : "Expired"
                  : isBangla
                  ? `${batch.daysUntilExpiry} দিন বাকি`
                  : `${batch.daysUntilExpiry} days left`}
              </p>
            )}
          </>
        ) : (
          <span className="text-xs text-muted-foreground/60">
            {isBangla ? "মেয়াদহীন" : "No Expiry"}
          </span>
        )}
      </div>

      {/* 9. Status (w-24 sm:w-28) */}
      <div className="w-24 sm:w-28 shrink-0 text-center flex items-center justify-center">
        <BatchStatusBadge
          hasExpiry={batch.hasExpiry}
          isExpired={batch.isExpired}
          isExpiringSoon={batch.isExpiringSoon}
          daysUntilExpiry={batch.daysUntilExpiry}
        />
      </div>

      {/* 10. Actions (3-Dot Dropdown Menu) (w-20 sm:w-24) */}
      <div
        className="w-20 sm:w-24 shrink-0 text-right flex items-center justify-end"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-[#181d27] border-border/60">
            <DropdownMenuItem
              onClick={() => (onViewDetails ? onViewDetails(batch) : onTap?.(batch))}
              className="cursor-pointer gap-2.5 text-xs text-foreground hover:bg-muted/50"
            >
              <Eye className="h-4 w-4 text-muted-foreground" />
              {isBangla ? "বিস্তারিত দেখুন" : "View Details"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onEdit?.(batch)}
              className="cursor-pointer gap-2.5 text-xs text-foreground hover:bg-muted/50"
            >
              <Pencil className="h-4 w-4 text-muted-foreground" />
              {isBangla ? "সম্পাদনা" : "Edit Batch"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onAdjust?.(batch)}
              className="cursor-pointer gap-2.5 text-xs text-foreground hover:bg-muted/50"
            >
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              {isBangla ? "স্টক অ্যাডজাস্টমেন্ট" : "Stock Adjustment"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onCreateOffer ? onCreateOffer(batch) : router.push(`/inventory/promotions/new?batchId=${batch.id}&productId=${batch.itemId || ''}`)}
              className="cursor-pointer gap-2.5 text-xs text-emerald-400 hover:bg-emerald-500/10 focus:bg-emerald-500/10"
            >
              <Tag className="h-4 w-4 text-emerald-400" />
              {isBangla ? "অফার তৈরি করুন" : "Create Offer"}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/40" />
            <DropdownMenuItem
              onClick={() => onPrintLabel?.(batch)}
              className="cursor-pointer gap-2.5 text-xs text-foreground hover:bg-muted/50"
            >
              <Printer className="h-4 w-4 text-muted-foreground" />
              {isBangla ? "বারকোড প্রিন্ট" : "Print Barcode"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
});
