"use client";

import React, { useState } from "react";
import { Transaction } from "@/types/finance";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/premium";
import { AutoManualBadge } from "./AutoManualBadge";
import { TransactionTypeBadge } from "./TransactionTypeBadge";
import {
  Building2,
  Calendar,
  CreditCard,
  FileText,
  ChevronDown,
  ChevronUp,
  Receipt,
  Sparkles,
  UserCheck,
  Scale,
  Link2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DetailDrawerProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  isBangla?: boolean;
}

export function TransactionDetailDrawer({
  transaction,
  isOpen,
  onClose,
  isBangla = false,
}: DetailDrawerProps) {
  const [showAccountingDetails, setShowAccountingDetails] = useState(false);

  if (!transaction) return null;

  const isPositive = transaction.amount > 0;

  // Plain-language summary text
  const getPlainLanguageExplanation = () => {
    if (transaction.type === "sale") {
      const vatText = transaction.vatAmount
        ? isBangla
          ? ` এবং ৳${transaction.vatAmount} ভ্যাট যুক্ত হয়েছে।`
          : ` and ৳${transaction.vatAmount} VAT.`
        : ".";
      return isBangla
        ? `এই বিক্রয় থেকে মোট ৳${Math.abs(transaction.amount).toLocaleString()} আয় অর্জিত হয়েছে${vatText}`
        : `This sale generated ৳${Math.abs(transaction.amount).toLocaleString()} income${vatText}`;
    }

    if (transaction.type === "expense") {
      return isBangla
        ? `এই ব্যবসায়ী খরচটি "${transaction.branchName}" শাখা থেকে ৳${Math.abs(transaction.amount).toLocaleString()} টাকা কেটেছে।`
        : `This business expense deducted ৳${Math.abs(transaction.amount).toLocaleString()} from ${transaction.branchName}.`;
    }

    if (transaction.type === "purchase") {
      return isBangla
        ? `এই পণ্য ক্রয়ে মোট ৳${Math.abs(transaction.amount).toLocaleString()} টাকা পারচেজ অ্যাকাউন্ট থেকে পরিশোধিত হয়েছে।`
        : `This purchase transaction disbursed ৳${Math.abs(transaction.amount).toLocaleString()} for inventory acquisition.`;
    }

    return isBangla
      ? `এই অর্থ স্থানান্তরে মোট ৳${Math.abs(transaction.amount).toLocaleString()} টাকা সংরক্ষিত হয়েছে।`
      : `This money movement recorded ৳${Math.abs(transaction.amount).toLocaleString()} in ${transaction.branchName}.`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-lg w-full overflow-y-auto p-6 space-y-6">
        <SheetHeader className="space-y-1 pb-4 border-b border-border/40">
          <div className="flex items-center justify-between gap-2">
            <TransactionTypeBadge type={transaction.type} isBangla={isBangla} />
            <AutoManualBadge isAuto={transaction.isAuto} isBangla={isBangla} />
          </div>

          <SheetTitle className="text-xl font-bold tracking-tight text-foreground pt-2">
            {transaction.description}
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Transaction ID: {transaction.id}
          </SheetDescription>
        </SheetHeader>

        {/* Plain Language Explanation Box */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-1.5">
          <p className="text-[11px] font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            {isBangla ? "অর্থ প্রবাহ ব্যখ্যা" : "Plain Language Summary"}
          </p>
          <p className="text-xs font-medium text-foreground leading-relaxed">
            {getPlainLanguageExplanation()}
          </p>
        </div>

        {/* Core Transaction Metrics Card */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-border/40">
            <span className="text-xs text-muted-foreground">{isBangla ? "টাকার পরিমাণ" : "Amount Moved"}</span>
            <span
              className={cn(
                "text-2xl font-bold font-mono",
                isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
              )}
            >
              {isPositive ? "+" : ""}৳{transaction.amount.toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[11px] text-muted-foreground block">{isBangla ? "ক্যাটাগরি" : "Category"}</span>
              <span className="font-semibold text-foreground">{transaction.category || "General"}</span>
            </div>

            <div>
              <span className="text-[11px] text-muted-foreground block">{isBangla ? "শাখা" : "Branch"}</span>
              <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
                {transaction.branchName}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-muted-foreground block">{isBangla ? "তারিখ ও সময়" : "Date & Time"}</span>
              <span className="font-medium text-foreground font-mono mt-0.5 block">{transaction.timestamp}</span>
            </div>

            <div>
              <span className="text-[11px] text-muted-foreground block">{isBangla ? "সংযুক্ত মডিউল" : "Linked Module"}</span>
              <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                <Link2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                {transaction.linkedModule || "Finance"}
              </span>
            </div>

            {transaction.customerOrSupplierName && (
              <div className="col-span-2 pt-2 border-t border-border/40">
                <span className="text-[11px] text-muted-foreground block">
                  {isBangla ? "গ্রাহক / সাপ্লায়ার" : "Customer / Supplier"}
                </span>
                <span className="font-semibold text-foreground">{transaction.customerOrSupplierName}</span>
              </div>
            )}

            {transaction.invoiceNumber && (
              <div className="col-span-2">
                <span className="text-[11px] text-muted-foreground block">{isBangla ? "ইনভয়েস/মেমো নম্বর" : "Invoice / Reference #"}</span>
                <span className="font-mono font-semibold text-foreground">{transaction.invoiceNumber}</span>
              </div>
            )}

            {transaction.notes && (
              <div className="col-span-2 pt-2 border-t border-border/40">
                <span className="text-[11px] text-muted-foreground block">{isBangla ? "নোট / বিবরণ" : "Notes"}</span>
                <span className="text-muted-foreground italic">{transaction.notes}</span>
              </div>
            )}
          </div>
        </div>

        {/* Collapsible Advanced View (Accountant Ledger Details) */}
        <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-3">
          <button
            type="button"
            onClick={() => setShowAccountingDetails(!showAccountingDetails)}
            className="w-full flex items-center justify-between text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-indigo" />
              <span>{isBangla ? "অ্যাকাউন্টিং খতিয়ান বিবরণ (Advanced View)" : "View Accounting Details"}</span>
            </div>
            {showAccountingDetails ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {showAccountingDetails && (
            <div className="pt-3 border-t border-border/40 space-y-2.5 text-xs animate-in fade-in duration-200">
              <div className="flex justify-between items-center text-[11.5px]">
                <span className="text-muted-foreground">Debit Account:</span>
                <span className="font-mono font-medium text-foreground">
                  {transaction.accountingDetails?.debitAccount || (isPositive ? "1010 - Cash/Bank Asset" : "5010 - Operating Expense")}
                </span>
              </div>

              <div className="flex justify-between items-center text-[11.5px]">
                <span className="text-muted-foreground">Credit Account:</span>
                <span className="font-mono font-medium text-foreground">
                  {transaction.accountingDetails?.creditAccount || (isPositive ? "4010 - Sales Revenue" : "1010 - Cash/Bank Asset")}
                </span>
              </div>

              <div className="flex justify-between items-center text-[11.5px]">
                <span className="text-muted-foreground">Journal Entry Ref:</span>
                <span className="font-mono text-muted-foreground">
                  {transaction.accountingDetails?.referenceCode || `JE-${transaction.id}`}
                </span>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
