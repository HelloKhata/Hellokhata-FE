"use client";

import React, { useState, useEffect } from "react";
import { FinancialSummaryCard } from "@/components/finance/FinancialSummaryCard";
import { QuickActionCard } from "@/components/finance/QuickActionCard";
import { MoneyFlowChart } from "@/components/finance/MoneyFlowChart";
import { ReceivableCard } from "@/components/finance/ReceivableCard";
import { PayableCard } from "@/components/finance/PayableCard";
import { RecentTransactionsCard } from "@/components/finance/RecentTransactionsCard";
import { EmptyFinanceState } from "@/components/finance/EmptyFinanceState";
import {
  FinancialSummaryData,
  MoneyFlowPoint,
  ReceivableSummary,
  PayableSummary,
  RecentTransaction,
} from "@/types/finance";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useToast } from "@/hooks/use-toast";
import { useBranchStore } from "@/stores/branchStore";
import {
  RefreshCw,
  Calendar,
  Building2,
  PlusCircle,
  MinusCircle,
  ArrowDownCircle,
  ArrowUpCircle,
  Loader2,
} from "lucide-react";
import { Button, Input } from "@/components/ui/premium";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock Data matching Finance Specification
const INITIAL_SUMMARY: FinancialSummaryData = {
  cashPosition: {
    amount: 245600,
    cashAmount: 110000,
    bankAmount: 115600,
    walletAmount: 20000,
    lastSyncedMinutesAgo: 2,
  },
  moneyIn: {
    amount: 52300,
    period: "This Week",
    changePercentage: 12.4,
  },
  moneyOut: {
    amount: 18900,
    period: "This Week",
    changePercentage: -4.2,
  },
  netCashFlow: {
    amount: 33400,
    period: "This Week",
    isPositive: true,
  },
};

const INITIAL_MONEY_FLOW: MoneyFlowPoint[] = [
  { date: "2026-07-17", dayLabel: "Sat", moneyIn: 6500, moneyOut: 2100 },
  { date: "2026-07-18", dayLabel: "Sun", moneyIn: 9200, moneyOut: 3400 },
  { date: "2026-07-19", dayLabel: "Mon", moneyIn: 7800, moneyOut: 1900 },
  { date: "2026-07-20", dayLabel: "Tue", moneyIn: 11400, moneyOut: 4200 },
  { date: "2026-07-21", dayLabel: "Wed", moneyIn: 8100, moneyOut: 2800 },
  { date: "2026-07-22", dayLabel: "Thu", moneyIn: 9300, moneyOut: 4500 },
  { date: "2026-07-23", dayLabel: "Today", moneyIn: 12000, moneyOut: 3500 },
];

const INITIAL_RECEIVABLE: ReceivableSummary = {
  totalAmount: 48000,
  overdueCount: 3,
  pendingInvoicesCount: 6,
};

const INITIAL_PAYABLE: PayableSummary = {
  totalAmount: 21000,
  dueCount: 2,
  pendingBillsCount: 4,
};

const INITIAL_TRANSACTIONS: RecentTransaction[] = [
  {
    id: "tx-1042",
    type: "sale",
    description: "Sale Invoice #1042",
    category: "POS Sale",
    isAuto: true,
    branchName: "Gulshan",
    timestamp: "Today, 02:30 PM",
    rawDate: new Date(),
    amount: 1200,
  },
  {
    id: "tx-1041",
    type: "expense",
    description: "Electricity Bill Payment",
    category: "Utilities",
    isAuto: false,
    branchName: "Main Branch",
    timestamp: "Yesterday, 04:15 PM",
    rawDate: new Date(Date.now() - 86400000),
    amount: -3500,
  },
  {
    id: "tx-1040",
    type: "sale",
    description: "Bulk Wholesale Sale #1040",
    category: "Wholesale",
    isAuto: true,
    branchName: "Main Branch",
    timestamp: "Yesterday, 11:10 AM",
    rawDate: new Date(Date.now() - 86400000),
    amount: 18500,
  },
  {
    id: "tx-1039",
    type: "deposit",
    description: "Bank Cash Deposit",
    category: "Transfer",
    isAuto: false,
    branchName: "Gulshan",
    timestamp: "22 Jul 2026",
    rawDate: new Date(Date.now() - 172800000),
    amount: 10000,
  },
  {
    id: "tx-1038",
    type: "expense",
    description: "Office Refreshment Snacks",
    category: "Office Expenses",
    isAuto: false,
    branchName: "Tejgaon",
    timestamp: "21 Jul 2026",
    rawDate: new Date(Date.now() - 259200000),
    amount: -850,
  },
];

export default function FinanceOverviewPage() {
  const { isBangla } = useAppTranslation();
  const { toast } = useToast();
  const { branches } = useBranchStore();

  const [selectedBranchId, setSelectedBranchId] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("this_week");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Quick Action Modal State
  const [activeActionModal, setActiveActionModal] = useState<
    "income" | "expense" | "deposit" | "withdraw" | null
  >(null);
  const [actionAmount, setActionAmount] = useState<string>("");
  const [actionDescription, setActionDescription] = useState<string>("");
  const [isSubmittingAction, setIsSubmittingAction] = useState<boolean>(false);

  // Refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsRefreshing(false);
    toast({
      title: isBangla ? "তথ্য রフレশ হয়েছে" : "Refreshed Financial Data",
      description: isBangla
        ? "আপনার ক্যাশ ও আর্থিক তথ্য আপডেট করা হয়েছে"
        : "Cash position and financial summary have been updated.",
    });
  };

  // Quick Action Click
  const handleQuickActionClick = (actionId: string) => {
    setActiveActionModal(actionId as any);
    setActionAmount("");
    setActionDescription("");
  };

  // Submit Quick Action Form
  const handleActionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionAmount || parseFloat(actionAmount) <= 0) {
      toast({
        title: isBangla ? "সঠিক পরিমাণ দিন" : "Invalid Amount",
        description: isBangla
          ? "দয়া করে সঠিক টাকার পরিমাণ উল্লেখ করুন"
          : "Please enter a valid amount greater than 0",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingAction(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));

      const titleMap = {
        income: isBangla ? "আয় যোগ করা হয়েছে" : "Income Recorded",
        expense: isBangla ? "খরচ নোট করা হয়েছে" : "Expense Recorded",
        deposit: isBangla ? "ক্যাশ জমা সফল" : "Deposit Recorded",
        withdraw: isBangla ? "ক্যাশ উত্তোলন সফল" : "Withdrawal Recorded",
      };

      toast({
        title: titleMap[activeActionModal || "income"],
        description: isBangla
          ? `৳${parseFloat(actionAmount).toLocaleString()} সফলভাবে প্রক্রিয়াজাত হয়েছে`
          : `৳${parseFloat(actionAmount).toLocaleString()} successfully processed.`,
      });

      setActiveActionModal(null);
    } finally {
      setIsSubmittingAction(false);
    }
  };

  return (
    <div className="space-y-6 mx-auto pb-24">
      {/* Page Header & Top Toolbar */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-border/40">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {isBangla ? "অর্থায়নের সারসংক্ষেপ (Finance Overview)" : "Finance Overview"}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {isBangla
                ? "আপনার ব্যবসার রিয়েল-টাইম ক্যাশ প্রবাহ ও আর্থিক অবস্থা পর্যবেক্ষণ করুন।"
                : "Monitor your business cash flow and financial health."}
            </p>
          </div>

          {/* Right Toolbar Controls */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Branch Selector */}
            <div className="flex items-center gap-1.5 bg-background border border-border rounded-xl px-2.5 py-1">
              <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
                <SelectTrigger className="h-8 text-xs border-0 bg-transparent shadow-none focus:ring-0 w-[140px] px-1">
                  <SelectValue placeholder="Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {isBangla ? "সকল শাখা (All Branches)" : "All Branches"}
                  </SelectItem>
                  {branches.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Period Selector */}
            <div className="flex items-center gap-1.5 bg-background border border-border rounded-xl px-2.5 py-1">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="h-8 text-xs border-0 bg-transparent shadow-none focus:ring-0 w-[120px] px-1">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this_week">
                    {isBangla ? "এই সপ্তাহ" : "This Week"}
                  </SelectItem>
                  <SelectItem value="this_month">
                    {isBangla ? "এই মাস" : "This Month"}
                  </SelectItem>
                  <SelectItem value="this_quarter">
                    {isBangla ? "এই কোয়ার্টার" : "This Quarter"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Refresh Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-10 rounded-xl text-xs font-medium"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 mr-1.5 ${
                  isRefreshing ? "animate-spin text-primary" : ""
                }`}
              />
              {isBangla ? "রিফ্রেশ" : "Refresh"}
            </Button>
          </div>
        </div>

        {/* Core Philosophy Banner */}
        <div className="text-[11.5px] text-muted-foreground bg-muted/30 border border-border/40 px-3.5 py-2 rounded-xl flex items-center justify-between">
          <span>
            💡{" "}
            {isBangla
              ? "হ্যালো খাতা আপনার সমস্ত বিক্রয় ও খরচ নিজে থেকে হিসেব রাখে।"
              : "Your books build themselves. Real-time cash position automatically calculated from POS and Expenses."}
          </span>
          <span className="font-semibold text-primary hidden sm:inline">
            {isBangla ? "স্বয়ংক্রিয় হিসেব" : "Auto-calculated"}
          </span>
        </div>
      </div>

      {/* 1. Financial Summary Cards */}
      <FinancialSummaryCard
        data={INITIAL_SUMMARY}
        isLoading={isRefreshing}
        isBangla={isBangla}
      />

      {/* 2. Quick Actions Section */}
      <QuickActionCard
        onActionClick={handleQuickActionClick}
        isBangla={isBangla}
      />

      {/* 3. Money Flow Chart & Receivables/Payables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Money Flow Chart (Span 2) */}
        <div className="lg:col-span-2">
          <MoneyFlowChart data={INITIAL_MONEY_FLOW} isBangla={isBangla} />
        </div>

        {/* Receivables & Payables Column */}
        <div className="space-y-4">
          <ReceivableCard data={INITIAL_RECEIVABLE} isBangla={isBangla} />
          <PayableCard data={INITIAL_PAYABLE} isBangla={isBangla} />
        </div>
      </div>

      {/* 4. Recent Transactions Preview */}
      <RecentTransactionsCard
        transactions={INITIAL_TRANSACTIONS}
        isBangla={isBangla}
      />

      {/* Quick Action Modal Dialogs */}
      <Dialog
        open={activeActionModal !== null}
        onOpenChange={(open) => !open && setActiveActionModal(null)}
      >
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {activeActionModal === "income" && (
                <PlusCircle className="h-5 w-5 text-emerald-500" />
              )}
              {activeActionModal === "expense" && (
                <MinusCircle className="h-5 w-5 text-rose-500" />
              )}
              {activeActionModal === "deposit" && (
                <ArrowDownCircle className="h-5 w-5 text-indigo-500" />
              )}
              {activeActionModal === "withdraw" && (
                <ArrowUpCircle className="h-5 w-5 text-amber-500" />
              )}
              {activeActionModal === "income" &&
                (isBangla ? "আয় এন্ট্রি দিন" : "Record Income")}
              {activeActionModal === "expense" &&
                (isBangla ? "নতুন খরচ এন্ট্রি দিন" : "Record Business Expense")}
              {activeActionModal === "deposit" &&
                (isBangla ? "ক্যাশ জমা রেকর্ড করুন" : "Record Deposit")}
              {activeActionModal === "withdraw" &&
                (isBangla ? "ক্যাশ উত্তোলন রেকর্ড করুন" : "Record Withdrawal")}
            </DialogTitle>
            <DialogDescription>
              {isBangla
                ? "ব্যবসার টাকার অংক ও বিবরণ প্রবেশ করান"
                : "Enter amount and description for this transaction"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleActionSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs font-medium">
                {isBangla ? "টাকার পরিমাণ (BDT) *" : "Amount (BDT) *"}
              </Label>
              <Input
                type="number"
                step="0.01"
                min="1"
                placeholder="0.00"
                value={actionAmount}
                onChange={(e) => setActionAmount(e.target.value)}
                className="h-10 text-xs font-mono"
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium">
                {isBangla ? "বিবরণ / নোট" : "Description / Notes"}
              </Label>
              <Input
                placeholder={
                  activeActionModal === "income"
                    ? "e.g. Service fee collection"
                    : activeActionModal === "expense"
                    ? "e.g. Tea & snacks"
                    : "Notes"
                }
                value={actionDescription}
                onChange={(e) => setActionDescription(e.target.value)}
                className="h-10 text-xs"
              />
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveActionModal(null)}
                className="rounded-xl"
              >
                {isBangla ? "বাতিল" : "Cancel"}
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingAction}
                className="rounded-xl font-medium"
              >
                {isSubmittingAction && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {isBangla ? "সংরক্ষণ করুন" : "Confirm Entry"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
