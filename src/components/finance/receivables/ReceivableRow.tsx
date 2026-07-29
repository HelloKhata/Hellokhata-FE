"use client";

import React, { memo } from "react";
import { ReceivableCustomer, AgingBucket } from "@/types/receivable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/hooks/useAppTranslation";
import { format, parseISO } from "date-fns";
import { Eye, CreditCard, Send, Phone, Building2, Calendar, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReceivableRowProps {
  customer: ReceivableCustomer;
  onViewDetails: (customer: ReceivableCustomer) => void;
  onRecordPayment: (customer: ReceivableCustomer) => void;
  onSendReminder: (customer: ReceivableCustomer) => void;
  isBangla?: boolean;
}

export const getAgingBadge = (bucket: AgingBucket, isBangla = false) => {
  switch (bucket) {
    case "current":
      return (
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-semibold">
          {isBangla ? "চলতি (Current)" : "Current"}
        </Badge>
      );
    case "30_days":
      return (
        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px] font-semibold">
          {isBangla ? "৩০+ দিন" : "30+ Days"}
        </Badge>
      );
    case "60_days":
      return (
        <Badge variant="outline" className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 text-[10px] font-semibold">
          {isBangla ? "৬০+ দিন" : "60+ Days"}
        </Badge>
      );
    case "90_days":
      return (
        <Badge variant="outline" className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 text-[10px] font-semibold">
          {isBangla ? "৯০+ দিন" : "90+ Days"}
        </Badge>
      );
  }
};

export const ReceivableRow = memo(function ReceivableRow({
  customer,
  onViewDetails,
  onRecordPayment,
  onSendReminder,
  isBangla = false,
}: ReceivableRowProps) {
  const { formatCurrency } = useCurrency();

  const formattedDueDate = (() => {
    try {
      return format(parseISO(customer.dueDate), "dd MMM yyyy");
    } catch {
      return customer.dueDate;
    }
  })();

  const formattedLastPayment = (() => {
    if (!customer.lastPaymentDate) return "—";
    try {
      return format(parseISO(customer.lastPaymentDate), "dd MMM");
    } catch {
      return customer.lastPaymentDate;
    }
  })();

  return (
    <tr className="hover:bg-muted/15 transition-colors border-b border-border/50 text-xs">
      {/* Customer Name & Phone */}
      <td className="px-4 py-3 align-middle">
        <div className="flex flex-col min-w-0">
          <button
            type="button"
            onClick={() => onViewDetails(customer)}
            className="font-bold text-foreground hover:text-primary transition-colors text-left text-xs truncate max-w-[170px] cursor-pointer"
          >
            {customer.name}
          </button>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
            <Phone className="h-2.5 w-2.5 shrink-0" />
            <span className="font-mono">{customer.phone}</span>
          </div>
        </div>
      </td>

      {/* Visually Emphasized Outstanding Amount */}
      <td className="px-4 py-3 align-middle font-bold font-mono text-sm text-foreground">
        <span className="text-rose-600 dark:text-rose-400">
          {formatCurrency(customer.totalOutstanding)}
        </span>
      </td>

      {/* Aging Bucket Badge */}
      <td className="px-4 py-3 align-middle">
        {getAgingBadge(customer.agingBucket, isBangla)}
      </td>

      {/* Last Payment */}
      <td className="px-4 py-3 align-middle text-muted-foreground whitespace-nowrap">
        {customer.lastPaymentAmount ? (
          <div>
            <span className="font-semibold text-foreground font-mono">
              ৳{customer.lastPaymentAmount.toLocaleString()}
            </span>
            <span className="text-[10px] block text-muted-foreground">{formattedLastPayment}</span>
          </div>
        ) : (
          <span className="text-muted-foreground/40">—</span>
        )}
      </td>

      {/* Due Date */}
      <td className="px-4 py-3 align-middle text-muted-foreground whitespace-nowrap font-mono text-[11px]">
        {formattedDueDate}
      </td>

      {/* Branch */}
      <td className="px-4 py-3 align-middle text-muted-foreground">
        <div className="flex items-center gap-1">
          <Building2 className="h-3 w-3 text-muted-foreground/70 shrink-0" />
          <span className="truncate max-w-[110px]">{customer.branchName}</span>
        </div>
      </td>

      {/* Row Actions */}
      <td className="px-4 py-3 align-middle text-right">
        <div className="flex items-center justify-end gap-1.5">
          {/* Send Reminder Action (Primary SMS action) */}
          <Button
            type="button"
            size="sm"
            onClick={() => onSendReminder(customer)}
            className="h-7 px-2.5 text-[11px] font-semibold gap-1 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-2xs"
            title={isBangla ? "এসএমএস রিমাইন্ডার পাঠান" : "Send SMS reminder"}
          >
            <Send className="h-3 w-3" />
            <span className="hidden xl:inline">{isBangla ? "রিমাইন্ডার" : "Send Reminder"}</span>
          </Button>

          {/* Record Partial Payment */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onRecordPayment(customer)}
            className="h-7 px-2 text-[11px] font-medium gap-1 text-foreground hover:bg-muted cursor-pointer"
            title={isBangla ? "পেমেন্ট রেকর্ড করুন" : "Record partial payment"}
          >
            <CreditCard className="h-3 w-3 text-primary" />
            <span className="hidden xl:inline">{isBangla ? "পেমেন্ট" : "Payment"}</span>
          </Button>

          {/* View Details */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onViewDetails(customer)}
            className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
            title={isBangla ? "বিস্তারিত দেখুন" : "View details"}
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  );
});

export const ReceivableCard = memo(function ReceivableCard({
  customer,
  onViewDetails,
  onRecordPayment,
  onSendReminder,
  isBangla = false,
}: ReceivableRowProps) {
  const { formatCurrency } = useCurrency();

  const formattedDueDate = (() => {
    try {
      return format(parseISO(customer.dueDate), "dd MMM yyyy");
    } catch {
      return customer.dueDate;
    }
  })();

  return (
    <div className="p-3.5 bg-card border border-border/70 rounded-xl space-y-3 shadow-2xs">
      <div className="flex items-start justify-between gap-2">
        <div>
          <button
            type="button"
            onClick={() => onViewDetails(customer)}
            className="font-bold text-foreground hover:text-primary transition-colors text-sm block text-left"
          >
            {customer.name}
          </button>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
            <Phone className="h-3 w-3" />
            <span className="font-mono">{customer.phone}</span>
          </div>
        </div>

        <div>{getAgingBadge(customer.agingBucket, isBangla)}</div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-border/40">
        <div>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide block">
            {isBangla ? "পাওনা পরিমাণ" : "Outstanding Amount"}
          </span>
          <span className="text-base font-bold font-mono text-rose-600 dark:text-rose-400">
            {formatCurrency(customer.totalOutstanding)}
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
        <Button
          type="button"
          size="sm"
          onClick={() => onSendReminder(customer)}
          className="flex-1 h-8 text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
        >
          <Send className="h-3 w-3" />
          <span>{isBangla ? "রিমাইন্ডার" : "Send Reminder"}</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onRecordPayment(customer)}
          className="flex-1 h-8 text-xs font-semibold gap-1.5 cursor-pointer"
        >
          <CreditCard className="h-3 w-3 text-primary" />
          <span>{isBangla ? "পেমেন্ট" : "Record Payment"}</span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onViewDetails(customer)}
          className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
});
