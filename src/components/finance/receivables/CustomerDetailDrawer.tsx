"use client";

import React from "react";
import { ReceivableCustomer } from "@/types/receivable";
import { getAgingBadge } from "./ReceivableRow";
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
  User,
  Phone,
  Mail,
  MapPin,
  Building2,
  Calendar,
  CreditCard,
  Send,
  FileText,
  Clock,
  CheckCircle2,
  X,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomerDetailDrawerProps {
  customer: ReceivableCustomer | null;
  isOpen: boolean;
  onClose: () => void;
  onRecordPayment: (customer: ReceivableCustomer) => void;
  onSendReminder: (customer: ReceivableCustomer) => void;
  isBangla?: boolean;
}

export function CustomerDetailDrawer({
  customer,
  isOpen,
  onClose,
  onRecordPayment,
  onSendReminder,
  isBangla = false,
}: CustomerDetailDrawerProps) {
  const { formatCurrency } = useCurrency();

  if (!customer) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col h-full bg-card">
        {/* Header */}
        <SheetHeader className="p-4 border-b border-border bg-muted/20 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                <User className="h-5 w-5" />
              </div>
              <div>
                <SheetTitle className="text-base font-bold text-foreground text-left">
                  {customer.name}
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground text-left">
                  {isBangla ? "গ্রাহক পাওনা বিবরণী" : "Customer Outstanding Details"}
                </SheetDescription>
              </div>
            </div>
            <div>{getAgingBadge(customer.agingBucket, isBangla)}</div>
          </div>
        </SheetHeader>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
          {/* Customer Info Card */}
          <div className="bg-background/50 border border-border/70 rounded-xl p-3.5 space-y-2">
            <h4 className="font-semibold text-foreground text-[11px] uppercase tracking-wider border-b border-border/50 pb-1.5 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-primary" />
              <span>{isBangla ? "গ্রাহক তথ্য" : "Customer Information"}</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Phone className="h-3 w-3 shrink-0" />
                <span className="font-mono text-foreground font-medium">{customer.phone}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Building2 className="h-3 w-3 shrink-0" />
                <span className="truncate text-foreground font-medium">{customer.branchName}</span>
              </div>
              {customer.email && (
                <div className="flex items-center gap-1.5 text-muted-foreground col-span-2">
                  <Mail className="h-3 w-3 shrink-0" />
                  <span className="truncate text-foreground">{customer.email}</span>
                </div>
              )}
              {customer.address && (
                <div className="flex items-center gap-1.5 text-muted-foreground col-span-2">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate text-foreground">{customer.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Balance & Aging Breakdown */}
          <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-muted-foreground">
                {isBangla ? "মোট পাওনা পরিমাণ" : "Total Outstanding Due"}
              </span>
              <span className="text-lg font-bold font-mono text-rose-600 dark:text-rose-400">
                {formatCurrency(customer.totalOutstanding)}
              </span>
            </div>

            <div className="border-t border-rose-500/10 pt-2 grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-background/60 p-2 rounded border border-border/50">
                <span className="text-muted-foreground block text-[10px]">
                  {isBangla ? "মেয়াদ উত্তীর্ণ বয়স" : "Aging Days"}
                </span>
                <span className="font-bold text-foreground font-mono">{customer.agingDays} days</span>
              </div>
              <div className="bg-background/60 p-2 rounded border border-border/50">
                <span className="text-muted-foreground block text-[10px]">
                  {isBangla ? "পরিশোধের তারিখ" : "Due Date"}
                </span>
                <span className="font-bold text-foreground font-mono">
                  {format(parseISO(customer.dueDate), "dd MMM yyyy")}
                </span>
              </div>
            </div>
          </div>

          {/* Outstanding Invoices List */}
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground text-[11px] uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-primary" />
                <span>{isBangla ? "বাকি ইনভয়েসসমূহ" : "Outstanding Invoices"}</span>
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {customer.invoices.length} {isBangla ? "টি ইনভয়েস" : "invoices"}
              </span>
            </h4>

            <div className="space-y-2">
              {customer.invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="p-3 bg-background/50 border border-border/70 rounded-xl space-y-1.5"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold font-mono text-xs text-foreground">
                      {inv.invoiceNo}
                    </span>
                    <span className="font-bold font-mono text-rose-600 dark:text-rose-400">
                      {formatCurrency(inv.dueAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                    <span>Issued: {format(parseISO(inv.issueDate), "dd MMM")}</span>
                    <span>Due: {format(parseISO(inv.dueDate), "dd MMM yyyy")}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment History & Timeline */}
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <History className="h-3.5 w-3.5 text-primary" />
              <span>{isBangla ? "পেমেন্ট ইতিহাস ও টাইমলাইন" : "Payment History"}</span>
            </h4>

            {customer.paymentHistory.length === 0 ? (
              <p className="text-[11px] text-muted-foreground italic p-3 bg-muted/20 rounded-lg text-center">
                {isBangla ? "কোনো সাম্প্রতিক পেমেন্ট ইতিহাস পাওয়া যায়নি" : "No recent payments recorded"}
              </p>
            ) : (
              <div className="space-y-2">
                {customer.paymentHistory.map((pay) => (
                  <div
                    key={pay.id}
                    className="p-2.5 bg-emerald-500/5 border border-emerald-500/15 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 block text-xs font-mono">
                        +{formatCurrency(pay.amount)}
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase">
                        {pay.method} {pay.note ? `• ${pay.note}` : ""}
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
          <Button
            type="button"
            onClick={() => {
              onClose();
              onRecordPayment(customer);
            }}
            className="w-full h-10 font-semibold text-xs bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 cursor-pointer shadow-xs"
          >
            <CreditCard className="h-4 w-4" />
            <span>{isBangla ? "পেমেন্ট রেকর্ড করুন" : "Record Payment"}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onClose();
              onSendReminder(customer);
            }}
            className="w-full h-9 text-xs font-semibold gap-1.5 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 cursor-pointer"
          >
            <Send className="h-3.5 w-3.5" />
            <span>{isBangla ? "এসএমএস রিমাইন্ডার পাঠান" : "Send SMS Reminder"}</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
