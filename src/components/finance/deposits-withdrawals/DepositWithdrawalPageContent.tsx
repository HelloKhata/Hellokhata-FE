"use client";

import React, { useState, useMemo } from "react";
import { TransferMode, TransferRecord } from "@/types/transfer";
import { TransferSummaryCards } from "./TransferSummaryCards";
import { AccountTransferForm } from "./AccountTransferForm";
import { TransferHistoryList } from "./TransferHistoryList";
import { BranchSelector } from "./BranchSelector";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  ArrowLeftRight,
  RefreshCw,
  Calendar as CalendarIcon,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

const INITIAL_TRANSFERS: TransferRecord[] = [
  {
    id: "tr-101",
    type: "deposit",
    accountId: "cash",
    accountName: "Cash in Hand",
    accountIcon: "💵",
    branchId: "main-branch",
    branchName: "Main Branch",
    amount: 10000,
    date: new Date().toISOString().split("T")[0],
    memo: "Added cash to register",
    createdAt: new Date(),
  },
  {
    id: "tr-102",
    type: "withdrawal",
    accountId: "bank",
    accountName: "Bank Account (Dutch-Bangla)",
    accountIcon: "🏦",
    branchId: "mirpur",
    branchName: "Mirpur Branch",
    amount: 5000,
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    memo: "ATM withdrawal for operational expense",
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: "tr-103",
    type: "deposit",
    accountId: "bkash",
    accountName: "bKash Merchant",
    accountIcon: "📱",
    branchId: "main-branch",
    branchName: "Main Branch",
    amount: 75000,
    date: "2026-07-24",
    memo: "Bulk customer payment settlement",
    createdAt: new Date(Date.now() - 172800000),
  },
  {
    id: "tr-104",
    type: "withdrawal",
    accountId: "nagad",
    accountName: "Nagad Wallet",
    accountIcon: "📱",
    branchId: "gulshan",
    branchName: "Gulshan Branch",
    amount: 37000,
    date: "2026-07-22",
    memo: "Vendor invoice payout",
    createdAt: new Date(Date.now() - 259200000),
  },
];

export function DepositWithdrawalPageContent() {
  const { isBangla } = useAppTranslation();

  // Mode State (deposit vs withdrawal)
  const [transferMode, setTransferMode] = useState<TransferMode>("deposit");

  // Records State
  const [records, setRecords] = useState<TransferRecord[]>(INITIAL_TRANSFERS);

  // Top Header Filters
  const [selectedBranch, setSelectedBranch] = useState<string>("Main Branch");
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Summary Metrics
  const { totalDeposits, totalWithdrawals, currentBalance } = useMemo(() => {
    const dep = records
      .filter((r) => r.type === "deposit")
      .reduce((sum, r) => sum + r.amount, 0);

    const wd = records
      .filter((r) => r.type === "withdrawal")
      .reduce((sum, r) => sum + r.amount, 0);

    // Initial base balance + deposits - withdrawals
    const base = 200500;
    const current = base + dep - wd;

    return {
      totalDeposits: dep,
      totalWithdrawals: wd,
      currentBalance: current,
    };
  }, [records]);

  const handleCreateTransfer = (newRecord: TransferRecord) => {
    setRecords((prev) => [newRecord, ...prev]);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success(isBangla ? "তথ্য হালনাগাদ করা হয়েছে" : "Transfers data refreshed");
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
              <ArrowLeftRight className="h-5 w-5" />
            </div>
            <span>{isBangla ? "জমা / উত্তোলন (Deposit / Withdrawal)" : "Deposit / Withdrawal"}</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {isBangla
              ? "আপনার ক্যাশ, ব্যাংক এবং ওয়ালেট অ্যাকাউন্টের মধ্যে টাকা স্থানান্তর করুন।"
              : "Move money between your cash, bank, and wallet accounts."}
          </p>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {/* Branch Selector */}
          <div className="w-36 sm:w-44">
            <BranchSelector
              value={selectedBranch}
              onChange={setSelectedBranch}
              isBangla={isBangla}
              showIcon
              compact
            />
          </div>

          {/* Date Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-9 text-xs px-2.5 bg-background/50 border-input text-foreground font-normal gap-1.5"
              >
                <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="hidden sm:inline">
                  {filterDate ? format(filterDate, "dd MMM yyyy") : isBangla ? "তারিখ ফিল্টার" : "Date"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={filterDate}
                onSelect={setFilterDate}
                initialFocus
              />
              {filterDate && (
                <div className="p-2 border-t border-border text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setFilterDate(undefined)}
                  >
                    {isBangla ? "মুছে ফেলুন" : "Clear Filter"}
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-9 w-9 bg-background/50 border-input text-muted-foreground hover:text-foreground cursor-pointer"
            title={isBangla ? "রিফ্রেশ" : "Refresh"}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Transfer Summary Cards */}
      <TransferSummaryCards
        totalDeposits={totalDeposits}
        totalWithdrawals={totalWithdrawals}
        currentBalance={currentBalance}
        isBangla={isBangla}
      />

      {/* Responsive Main Content Grid */}
      {/* Desktop: Form | History (5 cols / 7 cols) */}
      {/* Tablet / Mobile: Stacked vertically */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Transfer Form Column */}
        <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-6">
          <AccountTransferForm
            mode={transferMode}
            onModeChange={setTransferMode}
            onSubmitSuccess={handleCreateTransfer}
            isBangla={isBangla}
            defaultBranch={selectedBranch}
          />
        </div>

        {/* Transfer History Column */}
        <div className="lg:col-span-7 space-y-6">
          <TransferHistoryList
            records={records}
            isBangla={isBangla}
            onOpenCreate={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      </div>
    </div>
  );
}
