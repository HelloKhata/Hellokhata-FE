"use client";

import React, { useState, useMemo } from "react";
import {
  BankAccount,
  StatementLine,
  RecordedTransaction,
  CSVColumnMapping,
  ReconciliationSummaryData,
  BankFilterState,
} from "@/types/bank";
import { BankKPICards } from "./BankKPICards";
import { AccountsListPanel } from "./AccountCard";
import { StatementUploadCard } from "./StatementUploadCard";
import { ColumnMappingDialog } from "./ColumnMappingDialog";
import { ReconciliationWorkspace } from "./ReconciliationWorkspace";
import { MatchingDetailsDrawer } from "./MatchingDetailsDrawer";
import { ReconciliationSummary } from "./ReconciliationSummary";
import { AccountStatementPreview } from "./AccountStatementPreview";
import { AddAccountModal } from "./AddAccountModal";
import { PremiumLockOverlay } from "./PremiumLockOverlay";
import { useAppTranslation, useCurrency } from "@/hooks/useAppTranslation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  RefreshCw,
  Plus,
  FileUp,
  Sparkles,
  Lock,
  Building2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const MOCK_ACCOUNTS: BankAccount[] = [
  {
    id: "acc-1",
    accountName: "Dutch-Bangla Bank - Main",
    accountNumber: "110.120.4412",
    accountType: "bank",
    bankName: "Dutch-Bangla Bank Ltd",
    branchName: "Main Branch",
    recordedBalance: 525000,
    importedStatementBalance: 525000,
    unreconciledCount: 3,
    lastImportedDate: "2026-07-28",
    isDefault: true,
  },
  {
    id: "acc-2",
    accountName: "bKash Merchant Wallet",
    accountNumber: "01711998877",
    accountType: "bkash",
    recordedBalance: 185000,
    importedStatementBalance: 190000,
    unreconciledCount: 5,
    lastImportedDate: "2026-07-27",
  },
  {
    id: "acc-3",
    accountName: "Nagad Merchant Wallet",
    accountNumber: "01899776655",
    accountType: "nagad",
    recordedBalance: 92000,
    importedStatementBalance: 92000,
    unreconciledCount: 0,
    lastImportedDate: "2026-07-26",
  },
  {
    id: "acc-4",
    accountName: "Rocket Merchant Wallet",
    accountNumber: "01912345678",
    accountType: "rocket",
    recordedBalance: 45000,
    importedStatementBalance: 45000,
    unreconciledCount: 0,
    lastImportedDate: "2026-07-20",
  },
  {
    id: "acc-5",
    accountName: "Main Store Cash Vault",
    accountType: "cash",
    recordedBalance: 125000,
    importedStatementBalance: 125000,
    unreconciledCount: 0,
    lastImportedDate: "2026-07-28",
  },
];

const MOCK_STATEMENT_LINES: StatementLine[] = [
  {
    id: "stmt-101",
    date: "2026-07-28",
    description: "bKash Merchant Pay - City Electronics Settlement",
    reference: "TXN-99812",
    amount: 15000,
    type: "credit",
    status: "pending",
    suggestedTransactionId: "txn-201",
    matchScore: 95,
    matchReason: "Exact amount match (৳15,000) & reference TXN-99812",
  },
  {
    id: "stmt-102",
    date: "2026-07-27",
    description: "Supplier Bill Payment - ABC Traders (BILL-1025)",
    reference: "CHK-4412",
    amount: -15000,
    type: "debit",
    status: "pending",
    suggestedTransactionId: "txn-202",
    matchScore: 90,
    matchReason: "Exact debit amount match (৳15,000) & supplier bill #BILL-1025",
  },
  {
    id: "stmt-103",
    date: "2026-07-25",
    description: "Client Due Recovery - Metro Packaging",
    reference: "REF-0081",
    amount: 68000,
    type: "credit",
    status: "matched",
    suggestedTransactionId: "txn-203",
    matchedTransactionId: "txn-203",
    matchScore: 100,
    matchReason: "Confirmed match",
  },
  {
    id: "stmt-104",
    date: "2026-07-22",
    description: "Utility Bill Auto-Debit (Electricity)",
    reference: "DESCO-771",
    amount: -3500,
    type: "debit",
    status: "pending",
    suggestedTransactionId: "txn-204",
    matchScore: 85,
    matchReason: "Amount match & expense category Desco Electric",
  },
];

const MOCK_RECORDED_TRANSACTIONS: RecordedTransaction[] = [
  {
    id: "txn-201",
    date: "2026-07-28",
    title: "Sale Receipt #INV-1082 (City Electronics)",
    branchName: "Main Branch",
    amount: 15000,
    type: "income",
    source: "auto",
    referenceNo: "TXN-99812",
  },
  {
    id: "txn-202",
    date: "2026-07-27",
    title: "Bill Payment - ABC Traders (BILL-1025)",
    branchName: "Main Branch",
    amount: 15000,
    type: "expense",
    source: "auto",
    referenceNo: "CHK-4412",
  },
  {
    id: "txn-203",
    date: "2026-07-25",
    title: "Customer Due Payment - Metro Packaging",
    branchName: "Gulshan Branch",
    amount: 68000,
    type: "income",
    source: "manual",
    referenceNo: "REF-0081",
  },
  {
    id: "txn-204",
    date: "2026-07-22",
    title: "Electricity Utility Expense - Main Branch",
    branchName: "Main Branch",
    amount: 3500,
    type: "expense",
    source: "manual",
  },
];

export function BankWalletsPageContent() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();

  // Premium Feature Lock Toggle State (simulated premium subscription state)
  const [isPremiumLocked, setIsPremiumLocked] = useState(false);

  // Accounts & Selection State
  const [accounts, setAccounts] = useState<BankAccount[]>(MOCK_ACCOUNTS);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>("acc-1");

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // Modals & Drawers State
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isMappingDialogOpen, setIsMappingDialogOpen] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | undefined>(undefined);

  const [statementLines, setStatementLines] = useState<StatementLine[]>(MOCK_STATEMENT_LINES);
  const [recordedTransactions, setRecordedTransactions] = useState<RecordedTransaction[]>(MOCK_RECORDED_TRANSACTIONS);

  // Drawer Inspection State
  const [drawerLine, setDrawerLine] = useState<StatementLine | null>(null);
  const [drawerTxn, setDrawerTxn] = useState<RecordedTransaction | null>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Selected Account Object
  const selectedAccount = useMemo(() => {
    return accounts.find((a) => a.id === selectedAccountId) || null;
  }, [accounts, selectedAccountId]);

  // Filtered & Sorted Accounts
  const filteredAccounts = useMemo(() => {
    return accounts
      .filter((a) => {
        if (typeFilter === "bank" && a.accountType !== "bank") return false;
        if (typeFilter === "wallets" && a.accountType === "bank" && a.accountType === "cash") return false;
        if (typeFilter === "cash" && a.accountType !== "cash") return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = a.accountName.toLowerCase().includes(q);
          const matchNo = a.accountNumber?.toLowerCase().includes(q);
          if (!matchName && !matchNo) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "balance") return b.recordedBalance - a.recordedBalance;
        if (sortBy === "pending") return b.unreconciledCount - a.unreconciledCount;
        return a.accountName.localeCompare(b.accountName);
      });
  }, [accounts, typeFilter, searchQuery, sortBy]);

  // Combined Summary Metrics
  const { totalRecordedBalance, pendingCount } = useMemo(() => {
    const tot = accounts.reduce((sum, a) => sum + a.recordedBalance, 0);
    const pend = accounts.reduce((sum, a) => sum + a.unreconciledCount, 0);
    return { totalRecordedBalance: tot, pendingCount: pend };
  }, [accounts]);

  // Reconciliation Summary Metrics for active account
  const reconciliationSummary = useMemo<ReconciliationSummaryData>(() => {
    const total = statementLines.length;
    const matched = statementLines.filter((l) => l.status === "matched").length;
    const pending = statementLines.filter((l) => l.status === "pending").length;
    const ignored = statementLines.filter((l) => l.status === "ignored").length;
    const conflict = statementLines.filter((l) => l.status === "conflict").length;

    const diff = selectedAccount
      ? selectedAccount.recordedBalance - selectedAccount.importedStatementBalance
      : 0;

    const pct = total > 0 ? Math.round((matched / total) * 100) : 100;

    return {
      totalLines: total,
      matchedCount: matched,
      pendingCount: pending,
      ignoredCount: ignored,
      conflictCount: conflict,
      differenceAmount: diff,
      completionPercentage: pct,
    };
  }, [statementLines, selectedAccount]);

  // Handlers
  const handleMatch = (lineId: string, txnId: string) => {
    setStatementLines((prev) =>
      prev.map((l) =>
        l.id === lineId
          ? { ...l, status: "matched", matchedTransactionId: txnId }
          : l
      )
    );
    toast.success("Transaction matched successfully");
  };

  const handleIgnore = (lineId: string) => {
    setStatementLines((prev) =>
      prev.map((l) => (l.id === lineId ? { ...l, status: "ignored" } : l))
    );
    toast.info("Statement line marked as ignored");
  };

  const handleUndo = (lineId: string) => {
    setStatementLines((prev) =>
      prev.map((l) =>
        l.id === lineId
          ? { ...l, status: "pending", matchedTransactionId: undefined }
          : l
      )
    );
  };

  const handleFileUploaded = (fileName: string) => {
    setUploadedFileName(fileName);
    setIsMappingDialogOpen(true);
  };

  const handleAddAccount = (newAcc: BankAccount) => {
    setAccounts((prev) => [newAcc, ...prev]);
    setSelectedAccountId(newAcc.id);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success(isBangla ? "অ্যাাকাউন্টস ডাটা রিফ্রেশ করা হয়েছে" : "Bank & Wallet accounts refreshed");
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                <Wallet className="h-5 w-5" />
              </div>
              <span>{isBangla ? "ব্যাংক ও ওয়ালেট (Bank & Wallets)" : "Bank & Wallets"}</span>
            </h1>

            <Badge className="bg-amber-500 text-white border-none text-[10px] font-extrabold uppercase px-2 py-0.5">
              <Sparkles className="h-3 w-3 mr-0.5" /> PREMIUM
            </Badge>

            <button
              type="button"
              onClick={() => setIsPremiumLocked(!isPremiumLocked)}
              className="text-[10px] text-muted-foreground hover:underline font-mono ml-2"
              title="Toggle Premium Lock demo view"
            >
              [{isPremiumLocked ? "Unlock View" : "Lock View"}]
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {isBangla
              ? "আপনার ব্যাংক ও ওয়ালেটের স্টেটমেন্ট হ্যালো খাতার লেনদেনের সাথে মিলিয়ে নিন।"
              : "Reconcile your bank and wallet statements with recorded transactions."}
          </p>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <Button
            type="button"
            onClick={() => setIsMappingDialogOpen(true)}
            className="h-9 px-3 text-xs font-semibold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs"
          >
            <FileUp className="h-4 w-4" />
            <span>{isBangla ? "ইমপোর্ট স্টেটমেন্ট" : "Import Statement"}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setIsAddAccountOpen(true)}
            className="h-9 px-3 text-xs font-semibold gap-1.5 border-input text-foreground hover:bg-muted cursor-pointer bg-background/50"
          >
            <Plus className="h-4 w-4" />
            <span>{isBangla ? "অ্যাাকাউন্ট যোগ করুন" : "Add Account"}</span>
          </Button>

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

      {/* KPI Cards */}
      <BankKPICards
        totalAccounts={accounts.length}
        totalRecordedBalance={totalRecordedBalance}
        pendingReconciliationCount={pendingCount}
        lastSyncTime="28 Jul 2026, 02:15 PM"
        isBangla={isBangla}
      />

      {/* Main Two-Column Layout (Desktop 35% / 65%, Mobile Stacked) */}
      {isPremiumLocked ? (
        <PremiumLockOverlay
          onUnlockClick={() => setIsPremiumLocked(false)}
          isBangla={isBangla}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Panel: Accounts List (35% on Desktop) */}
          <div className="lg:col-span-4">
            <AccountsListPanel
              accounts={filteredAccounts}
              selectedAccountId={selectedAccountId}
              onSelectAccount={(acc) => setSelectedAccountId(acc.id)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              typeFilter={typeFilter}
              onTypeFilterChange={setTypeFilter}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              onAddAccountClick={() => setIsAddAccountOpen(true)}
              isBangla={isBangla}
            />
          </div>

          {/* Right Panel: Reconciliation Workspace (65% on Desktop) */}
          <div className="lg:col-span-8 space-y-5">
            {!selectedAccount ? (
              <div className="bg-card border border-border/80 rounded-xl p-8 text-center space-y-3 shadow-2xs my-2 flex flex-col items-center justify-center min-h-[320px]">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Wallet className="h-6 w-6" />
                </div>
                <div className="space-y-1 max-w-sm">
                  <h3 className="text-sm font-bold text-foreground">
                    {isBangla ? "একটি অ্যাকাউন্ট নির্বাচন করুন" : "Select an account to start reconciliation"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {isBangla
                      ? "বামপাশের তালিকা থেকে একটি ব্যাংক বা ওয়ালেট অ্যাকাউন্ট সিলেক্ট করুন।"
                      : "Choose a bank or wallet account from the left panel to inspect statement lines."}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Account Information Card */}
                <div className="bg-card border border-border rounded-xl p-4 shadow-2xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base sm:text-lg font-bold text-foreground">
                          {selectedAccount.accountName}
                        </h2>
                        <Badge variant="outline" className="text-[10px] capitalize font-mono">
                          {selectedAccount.accountType}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                        {selectedAccount.bankName ? `${selectedAccount.bankName} • ` : ""}
                        {selectedAccount.accountNumber ? `A/C: ${selectedAccount.accountNumber}` : ""}
                      </p>
                    </div>

                    {/* Reconciliation Difference Badge */}
                    <div className="flex items-center gap-2">
                      <div className="bg-background/80 border border-border/70 p-2 rounded-lg text-right">
                        <span className="text-[10px] text-muted-foreground block uppercase">
                          Difference
                        </span>
                        <span
                          className={cn(
                            "font-mono font-bold text-xs",
                            reconciliationSummary.differenceAmount === 0
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-amber-600 dark:text-amber-400"
                          )}
                        >
                          {formatCurrency(reconciliationSummary.differenceAmount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-2.5 bg-background/50 border border-border/60 rounded-lg">
                      <span className="text-[10px] text-muted-foreground uppercase block">
                        Recorded Balance
                      </span>
                      <span className="font-bold font-mono text-foreground text-sm">
                        {formatCurrency(selectedAccount.recordedBalance)}
                      </span>
                    </div>

                    <div className="p-2.5 bg-background/50 border border-border/60 rounded-lg">
                      <span className="text-[10px] text-muted-foreground uppercase block">
                        Statement Balance
                      </span>
                      <span className="font-bold font-mono text-foreground text-sm">
                        {formatCurrency(selectedAccount.importedStatementBalance)}
                      </span>
                    </div>

                    <div className="p-2.5 bg-background/50 border border-border/60 rounded-lg col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-muted-foreground uppercase block">
                        Pending Lines
                      </span>
                      <span className="font-bold font-mono text-amber-600 text-sm">
                        {selectedAccount.unreconciledCount} Needs Review
                      </span>
                    </div>
                  </div>
                </div>

                {/* CSV Statement Upload Card */}
                <StatementUploadCard
                  onFileUploaded={handleFileUploaded}
                  isBangla={isBangla}
                />

                {/* Reconciliation 2-Column Matcher Workspace */}
                <ReconciliationWorkspace
                  statementLines={statementLines}
                  recordedTransactions={recordedTransactions}
                  onSelectLineForDrawer={(line, txn) => {
                    setDrawerLine(line);
                    setDrawerTxn(txn);
                  }}
                  onMatch={handleMatch}
                  onIgnore={handleIgnore}
                  onUndo={handleUndo}
                  isBangla={isBangla}
                />

                {/* Account Running Balance Statement Preview */}
                <AccountStatementPreview
                  accountName={selectedAccount.accountName}
                  isBangla={isBangla}
                />

                {/* Sticky Bottom Progress Summary Bar */}
                <ReconciliationSummary
                  summary={reconciliationSummary}
                  onCompleteReconciliation={() => {
                    toast.success(
                      isBangla
                        ? "মিলকরণ প্রক্রিয়া সফলভাবে সম্পন্ন করা হয়েছে!"
                        : "Reconciliation process completed successfully!"
                    );
                  }}
                  isBangla={isBangla}
                />
              </>
            )}
          </div>
        </div>
      )}

      {/* Column Mapping Modal */}
      <ColumnMappingDialog
        isOpen={isMappingDialogOpen}
        onClose={() => setIsMappingDialogOpen(false)}
        onConfirmMapping={() => setIsMappingDialogOpen(false)}
        fileName={uploadedFileName}
        isBangla={isBangla}
      />

      {/* Add Account Modal */}
      <AddAccountModal
        isOpen={isAddAccountOpen}
        onClose={() => setIsAddAccountOpen(false)}
        onAccountAdded={handleAddAccount}
        isBangla={isBangla}
      />

      {/* Matching Details Side Drawer */}
      <MatchingDetailsDrawer
        statementLine={drawerLine}
        matchedTransaction={drawerTxn}
        isOpen={!!drawerLine}
        onClose={() => setDrawerLine(null)}
        onConfirmMatch={handleMatch}
        onIgnoreMatch={handleIgnore}
        isBangla={isBangla}
      />
    </div>
  );
}
