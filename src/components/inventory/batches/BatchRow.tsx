"use client";

import React, { memo } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
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
  status?: string;
  daysUntilExpiry?: number | null;
  createdAt?: string;
}

interface BatchRowProps {
  batch: BatchRowData;
  index?: number;
  showBranch?: boolean;
  offer?: any;
  onTap?: (batch: BatchRowData) => void;
  onViewDetails?: (batch: BatchRowData) => void;
  onEdit?: (batch: BatchRowData) => void;
  onAdjust?: (batch: BatchRowData) => void;
  onCreateOffer?: (batch: BatchRowData) => void;
  onPrintLabel?: (batch: BatchRowData) => void;
}

export function OfferBadge({ offer, isBangla }: { offer: any; isBangla?: boolean }) {
  if (!offer) return null;

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
  offer,
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
      tabIndex={onTap ? 0 : undefined}
      role={onTap ? "button" : undefined}
      aria-label={`Batch ${batch.batchNumber} - ${batch.itemName}`}
      onKeyDown={(e) => {
        if (onTap && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handleRowClick();
        }
      }}
      onClick={handleRowClick}
      className={cn(
        "flex items-center justify-between w-full px-6 py-3.5 hover:bg-muted/30 transition-colors group gap-4 border-b border-border/30 outline-none focus-visible:bg-muted/30",
        onTap && "cursor-pointer",
        batch.isExpired && "bg-rose-950/10 hover:bg-rose-950/20",
        batch.isExpiringSoon && !batch.isExpired && "bg-amber-950/10 hover:bg-amber-950/20"
      )}
    >
      {/* 1. SL. (w-8) */}
      <div className="w-8 shrink-0 text-left text-xs font-mono font-medium text-muted-foreground/80">
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* 2. Batch (w-36) */}
      <div className="w-36 shrink-0 min-w-0 text-left space-y-0.5">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors">
            #{batch.batchNumber}
          </span>
        </div>
        {batch.barcode && (
          <div className="text-[11px] font-mono text-slate-400 truncate">
            {batch.barcode}
          </div>
        )}
      </div>

      {/* 3. Product (w-52) */}
      <div className="w-52 shrink-0 min-w-0 text-left space-y-1">
        <p className="font-bold text-foreground text-xs sm:text-sm leading-snug truncate group-hover:text-primary transition-colors">
          {batch.itemName || batch.batchNumber}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          {batch.category && (
            <span className="text-[11px] text-muted-foreground/70 truncate">
              {batch.category}
            </span>
          )}
          {activeOffer && <OfferBadge offer={activeOffer} isBangla={isBangla} />}
        </div>
      </div>

      {/* 4. Available (w-24) */}
      <div className="w-24 shrink-0 min-w-0 text-left">
        <p className="text-xs sm:text-sm font-extrabold text-foreground whitespace-nowrap">
          {batch.quantity}{" "}
          <span className="text-xs font-normal text-muted-foreground">
            {batch.unit || "pcs"}
          </span>
        </p>
      </div>

      {/* 5. Cost (w-20) */}
      <div className="w-20 shrink-0 text-right">
        <p className="text-xs sm:text-sm font-mono font-semibold text-slate-200 whitespace-nowrap">
          {formatCurrency(batch.costPrice)}
        </p>
      </div>

      {/* 6. Selling (w-20) */}
      <div className="w-20 shrink-0 text-right">
        {batch.sellingPrice != null ? (
          <p className="text-xs sm:text-sm font-mono font-semibold text-emerald-400 whitespace-nowrap">
            {formatCurrency(batch.sellingPrice)}
          </p>
        ) : (
          <span className="text-xs text-muted-foreground/50">—</span>
        )}
      </div>

      {/* 7. Expiry (w-28) */}
      <div className="w-28 shrink-0 text-left space-y-0.5">
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

      {/* 8. Status (w-24) */}
      <div className="w-24 shrink-0 text-center flex items-center justify-center">
        <BatchStatusBadge
          status={batch.status}
          hasExpiry={batch.hasExpiry}
          isExpired={batch.isExpired}
          isExpiringSoon={batch.isExpiringSoon}
          daysUntilExpiry={batch.daysUntilExpiry}
        />
      </div>
          
      {/* 9. Actions (w-12) */}
      <div
        className="w-12 shrink-0 text-right flex items-center justify-end"
        onClick={(e) => e.stopPropagation()}
      >
        {/* View Batch Button (Commented off) */}
        {/* <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                if (onViewDetails) {
                  onViewDetails(batch);
                } else {
                  onTap?.(batch);
                }
              }}
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">
                {isBangla ? "বিস্তারিত দেখুন" : "View Details"}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            {isBangla ? "বিস্তারিত দেখুন" : "View Details"}
          </TooltipContent>
        </Tooltip> */}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onPrintLabel?.(batch);
              }}
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span className="sr-only">
                {isBangla ? "বারকোড প্রিন্ট" : "Print Barcode"}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            {isBangla ? "বারকোড প্রিন্ট" : "Print Barcode"}
          </TooltipContent>
        </Tooltip>
      </div>
      {/* <div
        className="w-12 shrink-0 text-right flex items-center justify-end"
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
      </div> */}
    </div>
  );
});
