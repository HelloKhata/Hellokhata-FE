"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PackageCheck, AlertTriangle, CheckCircle2, X } from "lucide-react";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { toast } from "sonner";
import { WarehouseTransferItem } from "./WarehouseMockData";

interface ConfirmReceiptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transferNo: string;
  items: WarehouseTransferItem[];
  onConfirmSuccess?: () => void;
}

export function ConfirmReceiptDialog({
  isOpen,
  onClose,
  transferNo,
  items,
  onConfirmSuccess,
}: ConfirmReceiptDialogProps) {
  const { isBangla } = useAppTranslation();

  // State to hold actual received quantities per item
  const [receivedQtyMap, setReceivedQtyMap] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    items.forEach((item) => {
      initial[item.id] = item.actualReceived ?? item.expectedQuantity;
    });
    return initial;
  });

  const handleQtyChange = (itemId: string, val: string) => {
    const parsed = parseInt(val, 10);
    setReceivedQtyMap((prev) => ({
      ...prev,
      [itemId]: isNaN(parsed) ? 0 : Math.max(0, parsed),
    }));
  };

  // Check if any actual quantity is smaller than expected
  const hasQuantityMismatch = items.some((item) => {
    const actual = receivedQtyMap[item.id] ?? item.expectedQuantity;
    return actual < item.expectedQuantity;
  });

  const handleConfirm = () => {
    toast.success(
      isBangla
        ? `ট্রান্সফার ${transferNo} এর রিসিভ সফলভাবে নিশ্চিত করা হয়েছে`
        : `Transfer ${transferNo} receipt confirmed successfully`
    );
    onConfirmSuccess?.();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95%] sm:w-full sm:max-w-2xl md:max-w-3xl p-0 bg-card border border-border shadow-xl rounded-2xl overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-4 sm:p-5 border-b border-border bg-card space-y-1">
          <DialogTitle className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
            <PackageCheck className="h-5 w-5 text-primary shrink-0" />
            <span>{isBangla ? "পণ্য রিসিভ নিশ্চিতকরণ" : "Confirm Transfer Receipt"}</span>
            <Badge variant="outline" className="font-mono text-xs font-semibold ml-2">
              #{transferNo}
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground text-left">
            {isBangla
              ? "প্রকৃত প্রাপ্ত পরিমাণ যাচাই করুন এবং যেকোনো বৈষম্য নিশ্চিত করুন।"
              : "Verify actual received quantity for each transfer item before confirming receipt."}
          </DialogDescription>
        </DialogHeader>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Items Table */}
          <div className="border border-border/60 rounded-xl overflow-x-auto bg-background/50">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-muted/40 text-muted-foreground border-b border-border font-semibold">
                  <th className="p-3 w-[45%]">{isBangla ? "পণ্য ও ব্যাচ" : "Product & Batch"}</th>
                  <th className="p-3 w-[25%] text-center">{isBangla ? "প্রত্যাশিত পরিমাণ" : "Expected Qty"}</th>
                  <th className="p-3 w-[30%] text-right">{isBangla ? "প্রকৃত প্রাপ্ত পরিমাণ *" : "Actual Received *"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-muted-foreground text-xs">
                      {isBangla ? "কোনো আইটেম নেই" : "No items in transfer"}
                    </td>
                  </tr>
                ) : (
                  items.map((item) => {
                    const actual = receivedQtyMap[item.id] ?? item.expectedQuantity;
                    const isShort = actual < item.expectedQuantity;
                    return (
                      <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                        <td className="p-3 align-middle">
                          <div className="font-bold text-foreground text-xs">{item.productName}</div>
                          <div className="text-[11px] text-muted-foreground font-mono mt-0.5 flex items-center gap-2">
                            <span>Batch: {item.batchNumber}</span>
                            {item.sku && <span>• SKU: {item.sku}</span>}
                          </div>
                        </td>
                        <td className="p-3 align-middle text-center font-mono font-semibold text-foreground">
                          {item.expectedQuantity} {item.unit}
                        </td>
                        <td className="p-3 align-middle text-right">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            <Input
                              type="number"
                              value={actual}
                              onChange={(e) => handleQtyChange(item.id, e.target.value)}
                              className={`h-9 w-24 text-right font-mono font-bold text-xs bg-background border-input ${
                                isShort ? "border-amber-500 text-amber-600 focus-visible:ring-amber-500" : ""
                              }`}
                              min="0"
                            />
                            <span className="text-[11px] text-muted-foreground font-medium shrink-0">
                              {item.unit}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Quantity Mismatch Warning Message Component */}
          {hasQuantityMismatch && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 space-y-1 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 font-bold text-xs">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                <span>
                  {isBangla
                    ? "সতর্কতা: প্রাপ্ত পরিমাণে বৈষম্য পাওয়া গেছে!"
                    : "Warning: Quantity Mismatch Detected"}
                </span>
              </div>
              <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed pl-6">
                {isBangla
                  ? "প্রকৃত প্রাপ্ত পরিমাণ পাঠানো প্রত্যাশিত পরিমাণের চেয়ে কম। একটি বৈষম্য বা শর্টেজ রিপোর্ট স্বয়ংক্রিয়ভাবে ইনভেন্টরিতে রেকর্ড করা হবে।"
                  : "Actual received quantity is less than expected sent quantity. A short-receipt variance log will be recorded in inventory."}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="p-4 border-t border-border bg-card flex flex-row items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} className="h-9 text-xs cursor-pointer">
            {isBangla ? "বাতিল" : "Cancel"}
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="h-9 text-xs font-bold gap-1.5 cursor-pointer shadow-xs"
          >
            <CheckCircle2 className="h-4 w-4" />
            {isBangla ? "রিসিভ নিশ্চিত করুন" : "Confirm Receipt"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
