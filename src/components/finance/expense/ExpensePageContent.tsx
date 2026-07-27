"use client";

import React, { useState } from "react";
import { MoneyEntryRecord } from "@/types/finance";
import { AmountInput } from "../money-entry/AmountInput";
import { EXPENSE_CATEGORIES, CategoryOption } from "../money-entry/CategoryGrid";
import { VoiceInputButton } from "../money-entry/VoiceInputButton";
import { PhotoUploader } from "../money-entry/PhotoUploader";
import { RecurringExpenseToggle } from "../money-entry/RecurringExpenseToggle";
import { MoneySummaryCards } from "../money-entry/MoneySummaryCards";
import { ExpenseBreakdownChart } from "../money-entry/ExpenseBreakdownChart";
import { MoneyHistoryList } from "../money-entry/MoneyHistoryList";
import { EmptyMoneyState } from "../money-entry/EmptyMoneyState";
import { CategoryManagerPanel } from "../category/CategoryManagerPanel";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useToast } from "@/hooks/use-toast";
import { useBranchStore } from "@/stores/branchStore";
import {
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
    date: "2026-07-20",
    memo: "Gulshan showroom shop rent advance",
    isRecurring: true,
    repeatFrequency: "monthly",
    createdAt: new Date(Date.now() - 259200000),
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

export function ExpensePageContent() {
  const { isBangla } = useAppTranslation();
  const { toast } = useToast();
  const { branches } = useBranchStore();

  // Dynamic Categories State for Expenses (CRUD supported on right side)
  const [categories, setCategories] = useState<CategoryOption[]>(EXPENSE_CATEGORIES);

  // Expense Records
  const [records, setRecords] = useState<MoneyEntryRecord[]>(INITIAL_EXPENSE_RECORDS);

  // Form Fields State
  const [amount, setAmount] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedBranchName, setSelectedBranchName] = useState(
    branches[0]?.name || "Dhanmondi Main Branch"
  );
  const [entryDate, setEntryDate] = useState("2026-07-23");
  const [memo, setMemo] = useState("");
  const [expenseNote, setExpenseNote] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);

  // Recurring Expense State
  const [isRecurring, setIsRecurring] = useState(false);
  const [repeatFrequency, setRepeatFrequency] = useState<"monthly" | "weekly" | "yearly">("monthly");
  const [nextDueDate, setNextDueDate] = useState("2026-08-23");

  // Validation & Loading
  const [errors, setErrors] = useState<{ amount?: string; category?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Summary Calculation
  const totalToday = 2500;
  const totalThisMonth = 48900;

  // Submit Handler
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { amount?: string; category?: string } = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = isBangla ? "সঠিক পরিমাণ দিন" : "Valid amount is required";
    }

    if (!selectedCategoryId) {
      newErrors.category = isBangla ? "ক্যাটাগরি নির্বাচন করুন" : "Category selection is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const catObj = categories.find((c) => c.id === selectedCategoryId);

      const newRecord: MoneyEntryRecord = {
        id: `exp-${Date.now()}`,
        type: "expense",
        amount: parseFloat(amount),
        categoryId: selectedCategoryId,
        categoryName: isBangla ? catObj?.nameBn || catObj?.nameEn || selectedCategoryId : catObj?.nameEn || selectedCategoryId,
        branchName: selectedBranchName,
        date: entryDate,
        memo: memo.trim() || undefined,
        sourceNote: expenseNote.trim() || undefined,
        photoUrl: photoUrl,
        isRecurring: isRecurring,
        repeatFrequency: isRecurring ? repeatFrequency : undefined,
        nextDueDate: isRecurring ? nextDueDate : undefined,
        createdAt: new Date(),
      };

      setRecords((prev) => [newRecord, ...prev]);

      toast({
        title: isBangla ? "খরচ সফলভাবে সংরক্ষিত হয়েছে" : "Expense Recorded Successfully",
        description: `৳${newRecord.amount.toLocaleString()} - ${newRecord.categoryName}`,
      });

      setAmount("");
      setSelectedCategoryId("");
      setMemo("");
      setExpenseNote("");
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
    setExpenseNote("");
    setPhotoUrl(undefined);
    setIsRecurring(false);
    setErrors({});
  };

  return (
    <div className="space-y-6 mx-auto pb-24">
      {/* 1. Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Expense Tracker V2
        </h1>
        <p className="text-xs text-muted-foreground font-mono">
          Home / Finance / Expenses
        </p>
      </div>

      {/* 2. Top Summary Cards */}
      <MoneySummaryCards
        mode="expense"
        totalToday={totalToday}
        totalThisMonth={totalThisMonth}
        totalEntriesCount={records.length}
        isBangla={isBangla}
      />

      {/* 3. Middle 2-Column Layout (Left Form | Right Category Manager Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Record New Expense Form (Span 7) */}
        <form
          onSubmit={handleSubmitForm}
          className="lg:col-span-7 rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5"
        >
          <div className="pb-2 border-b border-border/40">
            <h2 className="text-lg font-bold text-foreground">
              Record New Expense
            </h2>
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

          {/* Category Simple Dropdown (No Cards) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              CATEGORY *
            </Label>
            <Select
              value={selectedCategoryId}
              onValueChange={(val) => {
                setSelectedCategoryId(val);
                if (errors.category) setErrors((prev) => ({ ...prev, category: undefined }));
              }}
            >
              <SelectTrigger className="h-10 text-xs">
                <SelectValue placeholder={isBangla ? "ক্যাটাগরি নির্বাচন করুন" : "Select Category"} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {isBangla ? c.nameBn : c.nameEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-[11px] text-destructive font-medium pl-1">{errors.category}</p>
            )}
          </div>

          {/* Branch & Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                BRANCH *
              </Label>
              <Select value={selectedBranchName} onValueChange={setSelectedBranchName}>
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

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                DATE *
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

          {/* Memo & Expense Note Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                MEMO
              </Label>
              <div className="relative flex items-center">
                <Input
                  type="text"
                  placeholder="Text memo"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="h-10 text-xs pr-9"
                />
                <div className="absolute right-1 top-1/2 -translate-y-1/2">
                  <VoiceInputButton
                    onTranscript={(text) => setMemo((prev) => (prev ? `${prev} ${text}` : text))}
                    isBangla={isBangla}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                EXPENSE NOTE
              </Label>
              <Input
                type="text"
                placeholder="Voucher / receipt details"
                value={expenseNote}
                onChange={(e) => setExpenseNote(e.target.value)}
                className="h-10 text-xs"
              />
            </div>
          </div>

          {/* Recurring Expense Toggle */}
          <RecurringExpenseToggle
            isRecurring={isRecurring}
            onRecurringChange={setIsRecurring}
            frequency={repeatFrequency}
            onFrequencyChange={setRepeatFrequency}
            nextDueDate={nextDueDate}
            onNextDueDateChange={setNextDueDate}
            isBangla={isBangla}
          />

          {/* Photo Attachment */}
          <PhotoUploader
            photoUrl={photoUrl}
            onPhotoChange={setPhotoUrl}
            isBangla={isBangla}
          />

          {/* Save Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/40">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl text-xs font-semibold px-5 py-2 cursor-pointer bg-foreground text-background hover:bg-foreground/90"
            >
              {isSubmitting ? (
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5 mr-1.5" />
              )}
              Save Expense
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleCancelForm}
              className="rounded-xl text-xs font-medium cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </form>

        {/* RIGHT COLUMN: Categories List & CRUD Panel (Span 5) */}
        <div className="lg:col-span-5">
          <CategoryManagerPanel
            mode="expense"
            categories={categories}
            onUpdateCategories={setCategories}
            isBangla={isBangla}
          />
        </div>
      </div>

      {/* 4. Bottom Full-Width Section: Recent Expense Entries */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="pb-3 border-b border-border/40 flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <History className="h-4.5 w-4.5 text-primary" />
            <span>Recent Expense Entries</span>
          </h3>

          <span className="text-xs text-muted-foreground font-mono">
            {records.length} {isBangla ? "টি খরচ রেকর্ড" : "expense records"}
          </span>
        </div>

        {/* Expense Category Distribution Breakdown Chart */}
        {records.length > 0 && (
          <ExpenseBreakdownChart entries={records} isBangla={isBangla} />
        )}

        {records.length === 0 ? (
          <EmptyMoneyState
            mode="expense"
            onAddFirstClick={() => {
              const el = document.querySelector("input[type='number']") as HTMLInputElement;
              if (el) el.focus();
            }}
            isBangla={isBangla}
          />
        ) : (
          <MoneyHistoryList mode="expense" entries={records} isBangla={isBangla} />
        )}
      </div>
    </div>
  );
}
