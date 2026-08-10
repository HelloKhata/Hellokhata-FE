"use client";

import React, { useState } from "react";
import { MoneyEntryRecord, MoneyEntryCategory } from "@/types/finance";
import { AmountInput } from "./AmountInput";
import { CategoryGrid, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "./CategoryGrid";
import { VoiceInputButton } from "./VoiceInputButton";
import { PhotoUploader } from "./PhotoUploader";
import { RecurringExpenseToggle } from "./RecurringExpenseToggle";
import { MoneySummaryCards } from "./MoneySummaryCards";
import { ExpenseBreakdownChart } from "./ExpenseBreakdownChart";
import { MoneyHistoryList } from "./MoneyHistoryList";
import { EmptyMoneyState } from "./EmptyMoneyState";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useToast } from "@/hooks/use-toast";
import { useBranchStore } from "@/stores/branchStore";
import {
  TrendingUp,
  TrendingDown,
  Building2,
  Calendar as CalendarIcon,
  RefreshCw,
  Save,
  Loader2,
  X,
  History,
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
import { cn } from "@/lib/utils";

interface MoneyEntryFormProps {
  mode: "income" | "expense";
}

// Initial Mock Records
const INITIAL_INCOME_RECORDS: MoneyEntryRecord[] = [
  {
    id: "inc-01",
    type: "income",
    amount: 8000,
    categoryId: "other_income",
    categoryName: "Other Income",
    branchName: "Gulshan Store",
    date: new Date().toISOString().split("T")[0],
    memo: "Cash sale outside POS counter",
    sourceNote: "Direct customer payment",
    createdAt: new Date(),
  },
  {
    id: "inc-02",
    type: "income",
    amount: 25000,
    categoryId: "investment",
    categoryName: "Investment",
    branchName: "Dhanmondi Main Branch",
    date: "2026-07-20",
    memo: "Partner equity infusion",
    createdAt: new Date(Date.now() - 259200000),
  },
];

const INITIAL_EXPENSE_RECORDS: MoneyEntryRecord[] = [
  {
    id: "exp-01",
    type: "expense",
    amount: 2500,
    categoryId: "utilities",
    categoryName: "Utilities",
    branchName: "Dhanmondi Main Branch",
    date: new Date().toISOString().split("T")[0],
    memo: "Showroom internet bill (July)",
    isRecurring: true,
    repeatFrequency: "monthly",
    createdAt: new Date(),
  },
  {
    id: "exp-02",
    type: "expense",
    amount: 15000,
    categoryId: "rent",
    categoryName: "Rent",
    branchName: "Gulshan Store",
    date: "2026-07-15",
    memo: "Gulshan showroom shop rent advance",
    isRecurring: true,
    repeatFrequency: "monthly",
    createdAt: new Date(Date.now() - 691200000),
  },
  {
    id: "exp-03",
    type: "expense",
    amount: 850,
    categoryId: "transport",
    categoryName: "Transport",
    branchName: "Tejgaon Central Depot",
    date: "2026-07-22",
    memo: "Courier dispatch charges",
    createdAt: new Date(Date.now() - 86400000),
  },
];

export function MoneyEntryForm({ mode }: MoneyEntryFormProps) {
  const { isBangla } = useAppTranslation();
  const { toast } = useToast();
  const { branches } = useBranchStore();

  const isIncome = mode === "income";

  // Records state
  const [records, setRecords] = useState<MoneyEntryRecord[]>(
    isIncome ? INITIAL_INCOME_RECORDS : INITIAL_EXPENSE_RECORDS
  );

  // Form Fields State
  const [amount, setAmount] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedBranchName, setSelectedBranchName] = useState(
    branches[0]?.name || "Dhanmondi Main Branch"
  );
  const [entryDate, setEntryDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [memo, setMemo] = useState("");
  const [sourceNote, setSourceNote] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);

  // Expense Only Recurring State
  const [isRecurring, setIsRecurring] = useState(false);
  const [repeatFrequency, setRepeatFrequency] = useState<"monthly" | "weekly" | "yearly">("monthly");
  const [nextDueDate, setNextDueDate] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0]
  );

  // Validation & Loading
  const [errors, setErrors] = useState<{ amount?: string; category?: string }>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter toolbar state
  const [toolbarBranch, setToolbarBranch] = useState("all");
  const [toolbarDateFilter, setToolbarDateFilter] = useState("this_month");

  // Summary Metrics Calculation
  const todayStr = new Date().toISOString().split("T")[0];
  const totalToday = records
    .filter((r) => r.date === todayStr)
    .reduce((sum, r) => sum + r.amount, 0);

  const totalThisMonth = records.reduce((sum, r) => sum + r.amount, 0);

  // Filtered History
  const filteredRecords = records.filter((r) => {
    if (toolbarBranch !== "all" && r.branchName !== toolbarBranch) {
      return false;
    }
    return true;
  });

  // Submit Handler
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { amount?: string; category?: string } = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = isBangla
        ? "সঠিক পরিমাণ প্রবেশ করান"
        : "Valid amount is required";
    }

    if (!selectedCategoryId) {
      newErrors.category = isBangla
        ? "ক্যাটাগরি নির্বাচন করুন"
        : "Category selection is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const categories = isIncome ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
      const catObj = categories.find((c) => c.id === selectedCategoryId);

      const newRecord: MoneyEntryRecord = {
        id: `${mode}-${Date.now()}`,
        type: mode,
        amount: parseFloat(amount),
        categoryId: selectedCategoryId,
        categoryName: isBangla ? catObj?.nameBn || catObj?.nameEn || selectedCategoryId : catObj?.nameEn || selectedCategoryId,
        branchName: selectedBranchName,
        date: entryDate,
        memo: memo.trim() || undefined,
        sourceNote: isIncome ? sourceNote.trim() || undefined : undefined,
        photoUrl: photoUrl,
        isRecurring: !isIncome ? isRecurring : undefined,
        repeatFrequency: !isIncome && isRecurring ? repeatFrequency : undefined,
        nextDueDate: !isIncome && isRecurring ? nextDueDate : undefined,
        createdAt: new Date(),
      };

      setRecords((prev) => [newRecord, ...prev]);

      toast({
        title: isIncome
          ? isBangla ? "আয় সফলভাবে সংরক্ষিত হয়েছে" : "Income Recorded Successfully"
          : isBangla ? "খরচ সফলভাবে সংরক্ষিত হয়েছে" : "Expense Recorded Successfully",
        description: `৳${newRecord.amount.toLocaleString()} - ${newRecord.categoryName}`,
      });

      // Reset form
      setAmount("");
      setSelectedCategoryId("");
      setMemo("");
      setSourceNote("");
      setPhotoUrl(undefined);
      setIsRecurring(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelForm = () => {
    setAmount("");
    setSelectedCategoryId("");
    setMemo("");
    setSourceNote("");
    setPhotoUrl(undefined);
    setIsRecurring(false);
    setErrors({});
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setIsRefreshing(false);
    toast({
      title: isBangla ? "ডাটা রিফ্রেশ হয়েছে" : "Refreshed Data",
    });
  };

  return (
    <div className="space-y-6 mx-auto pb-24">
      {/* 1. Header Card */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-border/40">
          <div>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "p-2 rounded-xl border shrink-0",
                  isIncome
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                )}
              >
                {isIncome ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {isIncome
                  ? isBangla ? "আয় এন্ট্রি (Income)" : "Income"
                  : isBangla ? "খরচ এন্ট্রি (Expenses)" : "Expenses"}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {isIncome
                ? isBangla
                  ? "POS বা অন্যান্য স্বয়ংক্রিয় মডিউল ছাড়া অতিরিক্ত আয় ম্যানুয়ালি রেকর্ড করুন।"
                  : "Record income that was not created automatically through POS or other modules."
                : isBangla
                  ? "আপনার ব্যবসার দৈনন্দিন খরচ এন্ট্রি দিয়ে হিসাব আপডেট রাখুন।"
                  : "Record your business expenses and keep your books up to date."}
            </p>
          </div>

          {/* Right Toolbar Actions */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Branch Selector */}
            <div className="flex items-center gap-1.5 bg-background border border-border rounded-xl px-2.5 py-1">
              <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <Select value={toolbarBranch} onValueChange={setToolbarBranch}>
                <SelectTrigger className="h-8 text-xs border-0 bg-transparent shadow-none focus:ring-0 w-[130px] px-1">
                  <SelectValue placeholder="Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isBangla ? "সকল শাখা" : "All Branches"}</SelectItem>
                  {branches.map((b) => (
                    <SelectItem key={b.id} value={b.name}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Filter */}
            <div className="flex items-center gap-1.5 bg-background border border-border rounded-xl px-2.5 py-1">
              <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <Select value={toolbarDateFilter} onValueChange={setToolbarDateFilter}>
                <SelectTrigger className="h-8 text-xs border-0 bg-transparent shadow-none focus:ring-0 w-[110px] px-1">
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this_month">{isBangla ? "এই মাস" : "This Month"}</SelectItem>
                  <SelectItem value="today">{isBangla ? "আজ" : "Today"}</SelectItem>
                  <SelectItem value="all">{isBangla ? "সকল সময়" : "All Time"}</SelectItem>
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
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
              {isBangla ? "রিফ্রেশ" : "Refresh"}
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Quick Summary Cards */}
      <MoneySummaryCards
        mode={mode}
        totalToday={totalToday}
        totalThisMonth={totalThisMonth}
        totalEntriesCount={records.length}
        isBangla={isBangla}
      />

      {/* 3. Main Form & History Layout (Desktop: 2 Columns | Mobile: Stacked) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Entry Form (Span 7 on Desktop) */}
        <form
          onSubmit={handleSubmitForm}
          className="lg:col-span-7 rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6"
        >
          <div className="pb-3 border-b border-border/40 flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">
              {isIncome
                ? isBangla ? "নতুন আয় এন্ট্রি ফর্ম" : "Record New Income"
                : isBangla ? "নতুন খরচ এন্ট্রি ফর্ম" : "Record New Expense"}
            </h2>
            <span className="text-[11px] text-muted-foreground">
              {isBangla ? "* চিহ্নিত ঘরগুলো আবশ্যক" : "* Required fields"}
            </span>
          </div>

          {/* Amount Field */}
          <AmountInput
            value={amount}
            onChange={(val) => {
              setAmount(val);
              if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
            }}
            error={errors.amount}
            autoFocus={true}
            isBangla={isBangla}
          />

          {/* Category Grid */}
          <CategoryGrid
            mode={mode}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={(id) => {
              setSelectedCategoryId(id);
              if (errors.category) setErrors((prev) => ({ ...prev, category: undefined }));
            }}
            error={errors.category}
            isBangla={isBangla}
          />

          {/* Branch & Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Branch Dropdown */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {isBangla ? "শাখা (Branch) *" : "Branch *"}
              </Label>
              <Select
                value={selectedBranchName}
                onValueChange={setSelectedBranchName}
              >
                <SelectTrigger className="h-10 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((b) => (
                    <SelectItem key={b.id} value={b.name}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Input */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {isBangla ? "তারিখ (Date) *" : "Date *"}
              </Label>
              <Input
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                className="h-10 text-xs"
                required
              />
            </div>
          </div>

          {/* Memo Field (with Voice Input) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {isBangla ? "মেমো / নোট (Memo)" : "Memo"}
              </Label>
              <VoiceInputButton
                onTranscript={(text) => setMemo((prev) => (prev ? `${prev} ${text}` : text))}
                isBangla={isBangla}
              />
            </div>
            <Input
              type="text"
              placeholder={
                isIncome
                  ? isBangla ? "মেমো লিখুন (যেমন: কাস্টমার বিশেষ পেমেন্ট)" : "Enter memo (e.g. Service fee payment)"
                  : isBangla ? "মেমো লিখুন (যেমন: ইন্টারনেট বিল পরিশোধ)" : "Enter memo (e.g. WiFi bill payment)"
              }
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="h-10 text-xs"
            />
          </div>

          {/* Source Note (Income Only) */}
          {isIncome && (
            <div className="space-y-1.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {isBangla ? "উৎসের বিবরণ (Source Note)" : "Source Note (Optional)"}
                </Label>
                <VoiceInputButton
                  onTranscript={(text) => setSourceNote((prev) => (prev ? `${prev} ${text}` : text))}
                  isBangla={isBangla}
                />
              </div>
              <Input
                type="text"
                placeholder={isBangla ? "যেমন: আউটসাইড ক্যাশ ডিল" : "e.g. Cash sale outside POS"}
                value={sourceNote}
                onChange={(e) => setSourceNote(e.target.value)}
                className="h-10 text-xs"
              />
            </div>
          )}

          {/* Recurring Expense Toggle (Expense Only) */}
          {!isIncome && (
            <RecurringExpenseToggle
              isRecurring={isRecurring}
              onRecurringChange={setIsRecurring}
              frequency={repeatFrequency}
              onFrequencyChange={setRepeatFrequency}
              nextDueDate={nextDueDate}
              onNextDueDateChange={setNextDueDate}
              isBangla={isBangla}
            />
          )}

          {/* Photo Attachment */}
          <PhotoUploader
            photoUrl={photoUrl}
            onPhotoChange={setPhotoUrl}
            isBangla={isBangla}
          />

          {/* Save Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelForm}
              className="rounded-xl text-xs font-medium cursor-pointer"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              {isBangla ? "বাতিল" : "Cancel"}
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "rounded-xl text-xs font-medium cursor-pointer",
                isIncome ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-rose-600 hover:bg-rose-700 text-white"
              )}
            >
              {isSubmitting ? (
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5 mr-1.5" />
              )}
              {isIncome
                ? isBangla ? "আয় সংরক্ষণ করুন" : "Save Income"
                : isBangla ? "খরচ সংরক্ষণ করুন" : "Save Expense"}
            </Button>
          </div>
        </form>

        {/* RIGHT COLUMN: History & Category Breakdown (Span 5 on Desktop) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <History className="h-4 w-4 text-primary" />
              <span>
                {isIncome
                  ? isBangla ? "সাম্প্রতিক আয় এন্ট্রি সমূহ" : "Recent Income Entries"
                  : isBangla ? "সাম্প্রতিক খরচ এন্ট্রি সমূহ" : "Recent Expense Entries"}
              </span>
            </h3>

            <span className="text-[11px] text-muted-foreground font-mono">
              {filteredRecords.length} {isBangla ? "টি তালিকা" : "records"}
            </span>
          </div>

          {/* Expense Only Breakdown Chart */}
          {!isIncome && filteredRecords.length > 0 && (
            <ExpenseBreakdownChart entries={filteredRecords} isBangla={isBangla} />
          )}

          {/* History List or Empty State */}
          {filteredRecords.length === 0 ? (
            <EmptyMoneyState
              mode={mode}
              onAddFirstClick={() => {
                const el = document.querySelector("input[type='number']") as HTMLInputElement;
                if (el) el.focus();
              }}
              isBangla={isBangla}
            />
          ) : (
            <MoneyHistoryList mode={mode} entries={filteredRecords} isBangla={isBangla} />
          )}
        </div>
      </div>
    </div>
  );
}
