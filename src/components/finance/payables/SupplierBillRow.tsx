"use client";

import React, { memo } from "react";
import { SupplierBill } from "@/types/payable";
import { OutstandingStatusBadge, PayableAgingBadge } from "./OutstandingStatusBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrency } from "@/hooks/useAppTranslation";
import { format, parseISO } from "date-fns";
import {
  Eye,
  CreditCard,
  Building2,
  MoreVertical,
  Pencil,
  FileText,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SupplierBillRowProps {
  bill: SupplierBill;
  onViewDetails: (bill: SupplierBill) => void;
  onPayNow: (bill: SupplierBill) => void;
  onEditBill: (bill: SupplierBill) => void;
  isBangla?: boolean;
}

export const SupplierBillRow = memo(function SupplierBillRow({
  bill,
  onViewDetails,
  onPayNow,
  onEditBill,
  isBangla = false,
}: SupplierBillRowProps) {
  const { formatCurrency } = useCurrency();

  const formattedDueDate = (() => {
    try {
      return format(parseISO(bill.dueDate), "dd MMM yyyy");
    } catch {
      return bill.dueDate;
    }
  })();

  const isPaid = bill.status === "paid" || bill.outstandingAmount === 0;

  return (
    <tr className="hover:bg-muted/15 transition-colors border-b border-border/50 text-xs">
      {/* Supplier Name */}
      <td className="px-4 py-3 align-middle">
        <div className="flex flex-col min-w-0">
          <button
            type="button"
            onClick={() => onViewDetails(bill)}
            className="font-bold text-foreground hover:text-primary transition-colors text-left text-xs truncate max-w-[170px] cursor-pointer"
          >
            {bill.supplierName}
          </button>
          {bill.supplierPhone && (
            <span className="text-[10px] text-muted-foreground font-mono mt-0.5">
              {bill.supplierPhone}
            </span>
          )}
        </div>
      </td>

      {/* Bill Number & Linked Purchase Ref */}
      <td className="px-4 py-3 align-middle font-mono font-medium">
        <div className="flex flex-col">
          <span className="text-foreground font-semibold text-xs">{bill.billNumber}</span>
          {bill.linkedPurchaseNo && (
            <span className="text-[10px] text-primary flex items-center gap-0.5 mt-0.5" title="Linked Purchase">
              <FileText className="h-2.5 w-2.5" />
              <span>{bill.linkedPurchaseNo}</span>
            </span>
          )}
        </div>
      </td>

      {/* Visually Emphasized Outstanding Amount */}
      <td className="px-4 py-3 align-middle font-bold font-mono text-sm text-foreground">
        <span className={cn(isPaid ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400")}>
          {formatCurrency(bill.outstandingAmount)}
        </span>
      </td>

      {/* Due Date */}
      <td className="px-4 py-3 align-middle text-muted-foreground whitespace-nowrap font-mono text-[11px]">
        {formattedDueDate}
      </td>

      {/* Aging Bucket */}
      <td className="px-4 py-3 align-middle">
        <PayableAgingBadge bucket={bill.agingBucket} isBangla={isBangla} />
      </td>

      {/* Branch */}
      <td className="px-4 py-3 align-middle text-muted-foreground">
        <div className="flex items-center gap-1">
          <Building2 className="h-3 w-3 text-muted-foreground/70 shrink-0" />
          <span className="truncate max-w-[110px]">{bill.branchName}</span>
        </div>
      </td>

      {/* Status Badge */}
      <td className="px-4 py-3 align-middle">
        <OutstandingStatusBadge status={bill.status} isBangla={isBangla} />
      </td>

      {/* Row Actions */}
      <td className="px-4 py-3 align-middle text-right">
        <div className="flex items-center justify-end gap-1.5">
          {/* Pay Now Primary Action */}
          {!isPaid ? (
            <Button
              type="button"
              size="sm"
              onClick={() => onPayNow(bill)}
              className="h-7 px-2.5 text-[11px] font-semibold gap-1 bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer shadow-2xs"
              title={isBangla ? "এখনই বিল পরিশোধ করুন" : "Pay bill now"}
            >
              <CreditCard className="h-3 w-3" />
              <span className="hidden xl:inline">{isBangla ? "পরিশোধ" : "Pay Now"}</span>
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(bill)}
              className="h-7 px-2 text-[11px] text-muted-foreground cursor-pointer"
            >
              {isBangla ? "সম্পন্ন" : "Paid"}
            </Button>
          )}

          {/* View Details */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onViewDetails(bill)}
            className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
            title={isBangla ? "বিল বিবরণ" : "View details"}
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>

          {/* More Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-xs">
              <DropdownMenuItem onClick={() => onEditBill(bill)} className="gap-2 cursor-pointer">
                <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{isBangla ? "বিল এডিট করুন" : "Edit Bill"}</span>
              </DropdownMenuItem>
              {bill.linkedPurchaseId && (
                <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                  <Link href={`/purchases/${bill.linkedPurchaseId}`}>
                    <ExternalLink className="h-3.5 w-3.5 text-primary" />
                    <span>{isBangla ? "ক্রয় চালান দেখুন" : "View Purchase"}</span>
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  );
});

export const SupplierBillCard = memo(function SupplierBillCard({
  bill,
  onViewDetails,
  onPayNow,
  onEditBill,
  isBangla = false,
}: SupplierBillRowProps) {
  const { formatCurrency } = useCurrency();

  const formattedDueDate = (() => {
    try {
      return format(parseISO(bill.dueDate), "dd MMM yyyy");
    } catch {
      return bill.dueDate;
    }
  })();

  const isPaid = bill.status === "paid" || bill.outstandingAmount === 0;

  return (
    <div className="p-3.5 bg-card border border-border/70 rounded-xl space-y-3 shadow-2xs">
      <div className="flex items-start justify-between gap-2">
        <div>
          <button
            type="button"
            onClick={() => onViewDetails(bill)}
            className="font-bold text-foreground hover:text-primary transition-colors text-sm block text-left"
          >
            {bill.supplierName}
          </button>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono mt-0.5">
            <span>{bill.billNumber}</span>
            {bill.linkedPurchaseNo && (
              <span className="text-primary font-semibold">({bill.linkedPurchaseNo})</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <PayableAgingBadge bucket={bill.agingBucket} isBangla={isBangla} />
          <OutstandingStatusBadge status={bill.status} isBangla={isBangla} />
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-border/40">
        <div>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide block">
            {isBangla ? "প্রদেয় বকেয়া" : "Outstanding Balance"}
          </span>
          <span className="text-base font-bold font-mono text-amber-600 dark:text-amber-400">
            {formatCurrency(bill.outstandingAmount)}
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide block">
            {isBangla ? "পরিশোধের তারিখ" : "Due Date"}
          </span>
          <span className="text-xs font-semibold font-mono text-foreground">{formattedDueDate}</span>
        </div>
      </div>

      {/* Card Mobile Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-border/40">
        {!isPaid ? (
          <Button
            type="button"
            size="sm"
            onClick={() => onPayNow(bill)}
            className="flex-1 h-8 text-xs font-semibold gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
          >
            <CreditCard className="h-3.5 w-3.5" />
            <span>{isBangla ? "এখনই পরিশোধ করুন" : "Pay Now"}</span>
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(bill)}
            className="flex-1 h-8 text-xs font-semibold text-muted-foreground cursor-pointer"
          >
            <span>{isBangla ? "পরিশোধিত" : "Paid"}</span>
          </Button>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(bill)}
          className="h-8 text-xs font-semibold gap-1 cursor-pointer"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>{isBangla ? "বিস্তারিত" : "Details"}</span>
        </Button>
      </div>
    </div>
  );
});
