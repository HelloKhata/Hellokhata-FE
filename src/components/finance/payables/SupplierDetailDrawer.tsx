"use client";

import React from "react";
import { SupplierBill } from "@/types/payable";
import { OutstandingStatusBadge, PayableAgingBadge } from "./OutstandingStatusBadge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/hooks/useAppTranslation";
import { format, parseISO } from "date-fns";
import {
  Users,
  Phone,
  Mail,
  Building2,
  Calendar,
  CreditCard,
  Pencil,
  FileText,
  ExternalLink,
  History,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SupplierDetailDrawerProps {
  bill: SupplierBill | null;
  isOpen: boolean;
  onClose: () => void;
  onPayNow: (bill: SupplierBill) => void;
  onEditBill: (bill: SupplierBill) => void;
  isBangla?: boolean;
}

export function SupplierDetailDrawer({
  bill,
  isOpen,
  onClose,
  onPayNow,
  onEditBill,
  isBangla = false,
}: SupplierDetailDrawerProps) {
  const { formatCurrency } = useCurrency();

  if (!bill) return null;

  const isPaid = bill.status === "paid" || bill.outstandingAmount === 0;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col h-full bg-card">
        {/* Header */}
        <SheetHeader className="p-4 border-b border-border bg-muted/20 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <SheetTitle className="text-base font-bold text-foreground text-left">
                  {bill.supplierName}
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground text-left font-mono">
                  {bill.billNumber}
                </SheetDescription>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <PayableAgingBadge bucket={bill.agingBucket} isBangla={isBangla} />
              <OutstandingStatusBadge status={bill.status} isBangla={isBangla} />
            </div>
          </div>
        </SheetHeader>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
          {/* Supplier Info Card */}
          <div className="bg-background/50 border border-border/70 rounded-xl p-3.5 space-y-2">
            <h4 className="font-semibold text-foreground text-[11px] uppercase tracking-wider border-b border-border/50 pb-1.5 flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-primary" />
              <span>{isBangla ? "সরবরাহকারী তথ্য" : "Supplier Information"}</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {bill.supplierPhone && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Phone className="h-3 w-3 shrink-0" />
                  <span className="font-mono text-foreground font-medium">{bill.supplierPhone}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Building2 className="h-3 w-3 shrink-0" />
                <span className="truncate text-foreground font-medium">{bill.branchName}</span>
              </div>
              {bill.supplierEmail && (
                <div className="flex items-center gap-1.5 text-muted-foreground col-span-2">
                  <Mail className="h-3 w-3 shrink-0" />
                  <span className="truncate text-foreground">{bill.supplierEmail}</span>
                </div>
              )}
            </div>
          </div>

          {/* Bill Summary & Linked Purchase Card */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-muted-foreground">
                {isBangla ? "প্রদেয় বকেয়া পরিমাণ" : "Outstanding Balance"}
              </span>
              <span className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400">
                {formatCurrency(bill.outstandingAmount)}
              </span>
            </div>

            <div className="border-t border-amber-500/10 pt-2 grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-background/60 p-2 rounded border border-border/50">
                <span className="text-muted-foreground block text-[10px]">
                  {isBangla ? "বিল তারিখ" : "Bill Date"}
                </span>
                <span className="font-bold text-foreground font-mono">
                  {format(parseISO(bill.issueDate), "dd MMM yyyy")}
                </span>
              </div>
              <div className="bg-background/60 p-2 rounded border border-border/50">
                <span className="text-muted-foreground block text-[10px]">
                  {isBangla ? "পরিশোধের তারিখ" : "Due Date"}
                </span>
                <span className="font-bold text-foreground font-mono">
                  {format(parseISO(bill.dueDate), "dd MMM yyyy")}
                </span>
              </div>
            </div>

            {/* Linked Purchase Section */}
            {bill.linkedPurchaseNo && (
              <div className="pt-2 border-t border-amber-500/10 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <FileText className="h-3 w-3 text-primary" />
                  {isBangla ? "সংযুক্ত ক্রয় চালান:" : "Linked Purchase:"}
                </span>
                <Link
                  href={bill.linkedPurchaseId ? `/purchases/${bill.linkedPurchaseId}` : "/purchases"}
                  className="font-bold text-primary hover:underline text-xs flex items-center gap-1 font-mono"
                >
                  <span>{bill.linkedPurchaseNo}</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            )}
          </div>

          {/* Notes if available */}
          {bill.notes && (
            <div className="p-3 bg-muted/20 border border-border/60 rounded-xl space-y-1">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                {isBangla ? "মন্তব্য" : "Notes"}
              </span>
              <p className="text-xs text-foreground italic">"{bill.notes}"</p>
            </div>
          )}

          {/* Payment History List */}
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <History className="h-3.5 w-3.5 text-primary" />
              <span>{isBangla ? "পরিশোধের ইতিহাস" : "Payment History"}</span>
            </h4>

            {bill.paymentHistory.length === 0 ? (
              <p className="text-[11px] text-muted-foreground italic p-3 bg-muted/20 rounded-lg text-center">
                {isBangla ? "কোনো পেমেন্ট রেকর্ড পাওয়া যায়নি" : "No payment history recorded for this bill"}
              </p>
            ) : (
              <div className="space-y-2">
                {bill.paymentHistory.map((pay) => (
                  <div
                    key={pay.id}
                    className="p-2.5 bg-emerald-500/5 border border-emerald-500/15 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 block text-xs font-mono">
                        +{formatCurrency(pay.amount)}
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase">
                        {pay.method} {pay.referenceNo ? `• Ref: ${pay.referenceNo}` : ""}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {format(parseISO(pay.date), "dd MMM yyyy")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Drawer Bottom Actions */}
        <div className="p-4 border-t border-border bg-muted/20 space-y-2">
          {!isPaid && (
            <Button
              type="button"
              onClick={() => {
                onClose();
                onPayNow(bill);
              }}
              className="w-full h-10 font-semibold text-xs bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 cursor-pointer shadow-xs"
            >
              <CreditCard className="h-4 w-4" />
              <span>{isBangla ? "বিল পরিশোধ করুন (Pay Bill)" : "Pay Bill"}</span>
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onClose();
              onEditBill(bill);
            }}
            className="w-full h-9 text-xs font-semibold gap-1.5 text-foreground hover:bg-muted cursor-pointer"
          >
            <Pencil className="h-3.5 w-3.5" />
            <span>{isBangla ? "বিল এডিট করুন" : "Edit Bill"}</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
