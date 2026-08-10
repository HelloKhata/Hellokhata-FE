"use client";

import React, { useState } from "react";
import { MoneyEntryRecord } from "@/types/finance";
import { AmountInput } from "../money-entry/AmountInput";
import { INCOME_CATEGORIES, CategoryOption } from "../money-entry/CategoryGrid";
import { VoiceInputButton } from "../money-entry/VoiceInputButton";
import { PhotoUploader } from "../money-entry/PhotoUploader";
import { MoneySummaryCards } from "../money-entry/MoneySummaryCards";
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
import { Textarea } from "@/components/ui/textarea";

const INITIAL_INCOME_RECORDS: MoneyEntryRecord[] = [
  {
    id: "inc-01",
    type: "income",
    amount: 8000,
    categoryId: "other_income",
    categoryName: "Other Income",
    branchName: "Gulshan Store",
    date: new Date().toISOString().split("T")[0],
    memo: "Direct Deposit",
    sourceNote: "Bank transfer receipt",
    createdAt: new Date(),
  },
  {
    id: "inc-02",
    type: "income",
    amount: 25000,
    categoryId: "investment",
    categoryName: "Investment",
    branchName: "Dhanmondi Main Branch",
    date: "2026-07-23",
    memo: "Partner Equity",
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: "inc-03",
    type: "income",
    amount: 4500,
    categoryId: "sales",
    categoryName: "Sales",
    branchName: "Gulshan Store",
    date: "2026-07-23",
    memo: "Cash Sale",
    createdAt: new Date(Date.now() - 172800000),
  },
];

export function IncomePageContent() {
  const { isBangla } = useAppTranslation();
  const { toast } = useToast();
  const { branches } = useBranchStore();

  // Dynamic Categories State for Income (CRUD supported on right side)
  const [categories, setCategories] = useState<CategoryOption[]>(INCOME_CATEGORIES);

  // Income Records
  const [records, setRecords] = useState<MoneyEntryRecord[]>(INITIAL_INCOME_RECORDS);

  // Form Fields State
  const [amount, setAmount] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedBranchName, setSelectedBranchName] = useState(
    branches[0]?.name || "Dhanmondi Main Branch"
  );
  const [entryDate, setEntryDate] = useState("2026-07-23");
  const [memo, setMemo] = useState("");
  const [sourceNote, setSourceNote] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);

  // Validation & Loading
  const [errors, setErrors] = useState<{ amount?: string; category?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Summary Calculation
  const totalToday = 12500;
  const totalThisMonth = 145000;

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
        id: `inc-${Date.now()}`,
        type: "income",
        amount: parseFloat(amount),
        categoryId: selectedCategoryId,
        categoryName: isBangla ? catObj?.nameBn || catObj?.nameEn || selectedCategoryId : catObj?.nameEn || selectedCategoryId,
        branchName: selectedBranchName,
        date: entryDate,
        memo: memo.trim() || undefined,
        sourceNote: sourceNote.trim() || undefined,
        photoUrl: photoUrl,
        createdAt: new Date(),
      };

      setRecords((prev) => [newRecord, ...prev]);

      toast({
        title: isBangla ? "আয় সফলভাবে সংরক্ষিত হয়েছে" : "Income Recorded Successfully",
        description: `৳${newRecord.amount.toLocaleString()} - ${newRecord.categoryName}`,
      });

      setAmount("");
      setSelectedCategoryId("");
      setMemo("");
      setSourceNote("");
      setPhotoUrl(undefined);
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
    setErrors({});
  };

  return (
    <div className="space-y-6 mx-auto pb-24">
      {/* 1. Header with Title & Breadcrumbs */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Income Tracker V2
        </h1>
        <p className="text-xs text-muted-foreground font-mono">
          Home / Finance / Income
        </p>
      </div>

      {/* 2. Top Summary Cards */}
      <MoneySummaryCards
        mode="income"
        totalToday={totalToday}
        totalThisMonth={totalThisMonth}
        totalEntriesCount={records.length}
        isBangla={isBangla}
      />

      {/* 3. Middle 2-Column Layout (Left Form | Right Category Manager Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Record New Income Form (Span 7) */}
      <form
  onSubmit={handleSubmitForm}
  className="lg:col-span-7 rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5"
>
  {/* Header */}
  <div className="pb-2 border-b border-border/40">
    <h2 className="text-lg font-bold text-foreground">
      Record New Income
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

  {/* Category, Branch & Date Row */}
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    {/* Category */}
    <div className="space-y-1.5 flex flex-col justify-start">
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
        <SelectTrigger className="h-10 text-xs w-full">
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

    {/* Branch */}
    <div className="space-y-1.5 flex flex-col justify-start">
      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
        BRANCH *
      </Label>
      <Select value={selectedBranchName} onValueChange={setSelectedBranchName}>
        <SelectTrigger className="h-10 text-xs w-full">
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

    {/* Date */}
    <div className="space-y-1.5 flex flex-col justify-start">
      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
        DATE *
      </Label>
      <Input
        type="date"
        value={entryDate}
        onChange={(e) => setEntryDate(e.target.value)}
        className="h-10 text-xs w-full"
        required
      />
    </div>
  </div>

  {/* Memo & Source Note Row */}
   <div className="space-y-1.5 flex flex-col justify-start">
      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
        SOURCE NOTE (OPTIONAL)
      </Label>
      <Textarea
        placeholder="Direct deposit / cash memo"
        value={sourceNote}
        onChange={(e) => setSourceNote(e.target.value)}
        className="h-10 text-xs w-full"
      />
    </div>
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
      className="inline-flex items-center justify-center h-10 rounded-xl text-xs font-semibold px-5 py-2 cursor-pointer bg-foreground text-background hover:bg-foreground/90 transition-colors"
    >
      {isSubmitting ? (
        <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin shrink-0" />
      ) : (
        <Save className="h-3.5 w-3.5 mr-1.5 shrink-0" />
      )}
      <span>Save Income</span>
    </Button>

    <Button
      type="button"
      variant="outline"
      onClick={handleCancelForm}
      className="inline-flex items-center justify-center h-10 rounded-xl text-xs font-medium px-4 cursor-pointer transition-colors"
    >
      Cancel
    </Button>
  </div>
</form>

        {/* RIGHT COLUMN: Categories List & CRUD Panel (Span 5) */}
        <div className="lg:col-span-5">
          <CategoryManagerPanel
            mode="income"
            categories={categories}
            onUpdateCategories={setCategories}
            isBangla={isBangla}
          />
        </div>
      </div>

      {/* 4. Bottom Full-Width Section: Recent Income Entries */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="pb-3 border-b border-border/40 flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <History className="h-4.5 w-4.5 text-primary" />
            <span>Recent Income Entries</span>
          </h3>

          <span className="text-xs text-muted-foreground font-mono">
            {records.length} {isBangla ? "টি আয় রেকর্ড" : "income records"}
          </span>
        </div>

        {records.length === 0 ? (
          <EmptyMoneyState
            mode="income"
            onAddFirstClick={() => {
              const el = document.querySelector("input[type='number']") as HTMLInputElement;
              if (el) el.focus();
            }}
            isBangla={isBangla}
          />
        ) : (
          <MoneyHistoryList mode="income" entries={records} isBangla={isBangla} />
        )}
      </div>
    </div>
  );
}
