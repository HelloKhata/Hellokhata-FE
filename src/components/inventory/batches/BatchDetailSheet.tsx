"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Package,
  Printer,
  History,
  SlidersHorizontal,
  Pencil,
  Building2,
  Calendar,
  DollarSign,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useGetBatchById, useGetBatchMovements } from "@/hooks/api/useBatches";
import { useGetOffers } from "@/hooks/api/useOffers";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { cn } from "@/lib/utils";
import { AdjustmentForm } from "./AdjustmentForm";
import { EditBatchDetailsModal } from "./EditBatchDetailsModal";
import { BatchRowData } from "./BatchRow";
import { BatchStatusBadge } from "./BatchStatusBadge";
import { BatchBarcode } from "./BatchBarcode";
import { MovementTimeline, MovementItem } from "./MovementTimeline";
import { toast } from "sonner";

interface BatchDetailSheetProps {
  batchId: string | null;
  isOpen: boolean;
  onClose: () => void;
  fallbackBatch?: BatchRowData | null;
}

export function BatchDetailSheet({
  batchId,
  isOpen,
  onClose,
  fallbackBatch,
}: BatchDetailSheetProps) {
  const { isBangla } = useAppTranslation();
  const router = useRouter();
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [isEditDetailsOpen, setIsEditDetailsOpen] = useState(false);

  const { data: batchRes, isLoading } = useGetBatchById(batchId || "");
  const { data: movementsRes, isLoading: movementsLoading } = useGetBatchMovements(batchId || "");
  const { data: offersRes } = useGetOffers();

  const batch = batchRes?.data || fallbackBatch;
  const activeOffers = offersRes?.data || [];

  const activeOffer = batch
    ? activeOffers.find(
        (o: any) =>
          o.status === "active" &&
          (o.batchId === batch.id || (!o.batchId && o.productId === batch.itemId))
      )
    : null;

  const movements: MovementItem[] = (movementsRes?.data || []).map((m: any) => ({
    id: m.id || String(Math.random()),
    type: m.movement_type || m.movementType || "movement",
    quantity: m.quantity,
    remainingAfter: m.remaining_after || m.remainingAfter,
    date: m.created_at || m.createdAt || new Date().toISOString(),
    reference: m.reference_no || m.referenceNo || m.reference,
    notes: m.notes,
  }));

  if (!isOpen) return null;

  const remaining = batch?.quantity ?? 0;
  const received = batch?.quantityReceived ?? remaining;
  const unit = batch?.unit || "units";

  const handlePrintLabel = () => {
    toast.info(
      isBangla
        ? "ব্যাচ লেবেল প্রিন্টারে পাঠানো হচ্ছে..."
        : "Sending batch label to Bluetooth printer..."
    );
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[95%] sm:w-[95%] lg:w-[50%] max-w-none sm:max-w-none lg:max-w-none p-0 bg-background border border-border shadow-xl rounded-2xl overflow-hidden">
          {/* ========================================================================= */}
          {/* Section 1: Header — product image/name, branch, expiry status badge       */}
          {/* ========================================================================= */}
          <DialogHeader className="p-4 sm:p-5 border-b border-border/80 bg-card space-y-1">
            {isLoading && !batch ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            ) : batch ? (
              <div className="flex items-center gap-3.5 pr-6">
                {/* Product Image */}
                <div
                  className={cn(
                    "h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border border-border/40 overflow-hidden",
                    batch.isExpired
                      ? "bg-rose-100 dark:bg-rose-900/30"
                      : batch.isExpiringSoon
                      ? "bg-amber-100 dark:bg-amber-900/30"
                      : "bg-indigo-100 dark:bg-indigo-900/30"
                  )}
                >
                  {batch.itemImage ? (
                    <img src={batch.itemImage} alt={batch.itemName || ""} className="h-full w-full object-cover" />
                  ) : (
                    <Package
                      className={cn(
                        "h-6 w-6",
                        batch.isExpired ? "text-rose-600" : batch.isExpiringSoon ? "text-amber-600" : "text-indigo-600"
                      )}
                    />
                  )}
                </div>

                {/* Name & Branch */}
                <div className="min-w-0 flex-1">
                  <DialogTitle className="text-base sm:text-lg font-bold text-foreground text-left truncate">
                    {batch.itemName || batch.batchNumber}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground text-left flex items-center gap-2 flex-wrap mt-0.5">
                    <span className="font-mono font-semibold text-foreground/80">#{batch.batchNumber}</span>
                    {batch.branchName && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5 shrink-0" />
                          {batch.branchName}
                        </span>
                      </>
                    )}
                  </DialogDescription>
                </div>

                {/* Expiry Status Badge */}
                <div className="shrink-0">
                  <BatchStatusBadge
                    hasExpiry={batch.hasExpiry}
                    isExpired={batch.isExpired}
                    isExpiringSoon={batch.isExpiringSoon}
                    daysUntilExpiry={batch.daysUntilExpiry}
                  />
                </div>
              </div>
            ) : null}
          </DialogHeader>

          {/* Modal Scrollable Container */}
          <div className="p-4 sm:p-5 space-y-4 max-h-[78vh] overflow-y-auto">
            {isLoading && !batch ? (
              <div className="space-y-4">
                <Skeleton className="h-36 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-44 w-full rounded-xl" />
              </div>
            ) : batch ? (
              <>
                {/* ========================================================================= */}
                {/* Section 2: Core info card — cost, selling, qty, received date, expiry date */}
                {/* ========================================================================= */}
                <Card className="border border-border/60 shadow-xs">
                  <CardContent className="p-4 space-y-3">
                    <div className="text-xs font-bold text-foreground border-b border-border/40 pb-2">
                      {isBangla ? "মৌলিক তথ্য" : "Core Batch Details"}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                          {isBangla ? "ক্রয় মূল্য" : "Cost Price"}
                        </span>
                        <strong className="text-foreground font-mono text-sm">৳{batch.costPrice}</strong>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                          {isBangla ? "বিক্রয় মূল্য" : "Selling Price"}
                        </span>
                        <strong className="text-foreground font-mono text-sm">
                          {batch.sellingPrice != null ? `৳${batch.sellingPrice}` : "—"}
                        </strong>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                          {isBangla ? "অবশিষ্ট / প্রাপ্ত পরিমাণ" : "Quantity (Remaining / Received)"}
                        </span>
                        <strong className="text-foreground font-semibold">
                          {remaining} / {received} {unit}
                        </strong>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                          {isBangla ? "প্রাপ্তির তারিখ" : "Received Date"}
                        </span>
                        <strong className="text-foreground">
                          {batch.receivedDate || batch.createdAt
                            ? format(new Date(batch.receivedDate || batch.createdAt!), "dd MMM yyyy")
                            : "—"}
                        </strong>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                          {isBangla ? "মেয়াদ শেষ তারিখ" : "Expiry Date"}
                        </span>
                        <strong className="text-foreground">
                          {batch.expiryDate
                            ? format(new Date(batch.expiryDate), "dd MMM yyyy")
                            : isBangla ? "মেয়াদ নেই" : "No Expiry"}
                        </strong>
                      </div>

                      {batch.manufactureDate && (
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                            {isBangla ? "উৎপাদনে তারিখ" : "Mfg. Date"}
                          </span>
                          <strong className="text-foreground">
                            {format(new Date(batch.manufactureDate), "dd MMM yyyy")}
                          </strong>
                        </div>
                      )}

                      <div className="col-span-2 sm:col-span-3">
                        <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                          {isBangla ? "সরবরাহকারী" : "Supplier"}
                        </span>
                        <strong className="text-foreground font-medium">{batch.supplier || "—"}</strong>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* ========================================================================= */}
                {/* Section 3: Barcode section — code (batch-specific or shared) + Print Label */}
                {/* ========================================================================= */}
                <Card className="border border-border/60 shadow-xs">
                  <CardContent className="p-3.5 flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
                        {isBangla ? "বারকোড সম্বলিত তথ্য" : "Barcode Information"}
                      </span>
                      <BatchBarcode
                        barcode={batch.barcode}
                        barcodeType={batch.barcodeType}
                        manufacturerBarcode={batch.manufacturerBarcode}
                        showLabelAbove
                      />
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrintLabel}
                      className="h-8 text-xs font-semibold gap-1.5 cursor-pointer border-border"
                    >
                      <Printer className="h-3.5 w-3.5 text-primary" />
                      {isBangla ? "লেবেল প্রিন্ট" : "Print Label"}
                    </Button>
                  </CardContent>
                </Card>

                {/* ========================================================================= */}
                {/* Section 4: Active Offer banner — ONLY shown if an offer targets this batch  */}
                {/* ========================================================================= */}
                {activeOffer && (
                  <div
                    onClick={() => router.push(`/inventory/promotions/new?id=${activeOffer.id}`)}
                    className="p-3.5 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/15 transition-colors cursor-pointer flex items-center justify-between gap-3 text-purple-950 dark:text-purple-300"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-8 w-8 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                        <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">
                          {isBangla ? "সক্রিয় অফার উপলব্ধ" : "Active Batch Offer"}
                        </div>
                        <div className="text-[11px] text-purple-700 dark:text-purple-400 truncate">
                          {(activeOffer as any).name || (activeOffer as any).title || "Special promotional offer currently active for this batch"}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs font-semibold border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300 shrink-0 gap-1"
                    >
                      {isBangla ? "অফার দেখুন" : "View Offer"}
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                )}

                {/* ========================================================================= */}
                {/* Section 5: Stock Movement History — reverse-chronological list            */}
                {/* ========================================================================= */}
                <Card className="border border-border/60 shadow-xs">
                  <CardContent className="p-3.5 space-y-3">
                    <div className="flex items-center justify-between border-b border-border/40 pb-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-foreground uppercase">
                        <History className="h-4 w-4 text-primary" />
                        <span>{isBangla ? "স্টক মুভমেন্ট ইতিহাস" : "Stock Movement History"}</span>
                      </div>
                    </div>

                    {movementsLoading ? (
                      <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                          <Skeleton key={i} className="h-10 w-full" />
                        ))}
                      </div>
                    ) : (
                      <MovementTimeline movements={movements} unit={unit} />
                    )}
                  </CardContent>
                </Card>

                {/* ========================================================================= */}
                {/* Section 6: Actions row — Adjust Quantity button & Edit Details button       */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  <Button
                    onClick={() => setIsAdjustOpen(true)}
                    className="h-10 text-xs font-bold gap-1.5 cursor-pointer shadow-xs"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    {isBangla ? "পরিমাণ সংশোধন" : "Adjust Quantity"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setIsEditDetailsOpen(true)}
                    className="h-10 text-xs font-bold gap-1.5 cursor-pointer border-border"
                  >
                    <Pencil className="h-4 w-4 text-muted-foreground" />
                    {isBangla ? "তথ্য সম্পাদনা" : "Edit Details"}
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      {/* Adjustment Form Modal */}
      {batch && (
        <AdjustmentForm
          isOpen={isAdjustOpen}
          onClose={() => setIsAdjustOpen(false)}
          batchId={batch.id}
          batchNumber={batch.batchNumber}
          currentQuantity={remaining}
          unit={unit}
        />
      )}

      {/* Edit Details Modal */}
      {batch && (
        <EditBatchDetailsModal
          isOpen={isEditDetailsOpen}
          onClose={() => setIsEditDetailsOpen(false)}
          batchId={batch.id}
          batchNumber={batch.batchNumber}
          initialSupplier={batch.supplier}
          initialMfgDate={batch.manufactureDate}
        />
      )}
    </>
  );
}

// Export named aliases
export { BatchDetailSheet as BatchDetailModal, BatchDetailSheet as BatchDetailView };
