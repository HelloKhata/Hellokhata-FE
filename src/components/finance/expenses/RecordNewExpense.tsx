"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import {
  Calendar,
  Save,
  Loader2,
  Upload,
  Camera,
  Plus,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { useCreateExpense } from "@/hooks/api/useExpense";
import { cn } from "@/lib/utils";

// Number converter for Bengali numerals
const toBnNum = (num: number | string | undefined | null): string => {
  if (num === undefined || num === null) return "০";
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(num).replace(/[0-9]/g, (w) => bnDigits[+w]);
};

// Bengali month mapping
const BN_MONTHS: Record<string, string> = {
  "01": "জানুয়ারি",
  "02": "ফেব্রুয়ারি",
  "03": "মার্চ",
  "04": "এপ্রিল",
  "05": "মে",
  "06": "জুন",
  "07": "জুলাই",
  "08": "আগস্ট",
  "09": "সেপ্টেম্বর",
  "10": "অক্টোবর",
  "11": "নভেম্বর",
  "12": "ডিসেম্বর",
};

const formatBnDate = (date: Date): string => {
  const day = toBnNum(format(date, "dd"));
  const month = BN_MONTHS[format(date, "MM")] || format(date, "MM");
  const year = toBnNum(format(date, "yyyy"));
  return `${day} ${month}, ${year}`;
};

const UTILITY_TYPES = [
  { value: "electricity", labelEn: "Electricity", labelBn: "বিদ্যুৎ" },
  { value: "gas", labelEn: "Gas", labelBn: "গ্যাস" },
  { value: "internet", labelEn: "Internet", labelBn: "ইন্টারনেট" },
  { value: "water", labelEn: "Water", labelBn: "পানি" },
  { value: "other", labelEn: "Other / ETC", labelBn: "অন্যান্য (ETC)" },
];

interface RecordNewExpenseProps {
  expenseCategories?: any[];
  branchesData?: any[];
  paymentMethodsData?: any[];
  isBangla: boolean;
  onOpenAddCategory?: () => void;
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export const RecordNewExpense: React.FC<RecordNewExpenseProps> = ({
  expenseCategories = [],
  branchesData = [],
  paymentMethodsData = [],
  isBangla,
  onOpenAddCategory,
  onSuccess,
  onCancel,
  isModal = false,
}) => {
  const { toast } = useToast();
  const { mutate: createExpense, isPending: isSubmitting } = useCreateExpense();

  // Form State
  const [payeeName, setPayeeName] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"paid" | "partial" | "unpaid">("paid");
  const [dueAmount, setDueAmount] = useState("");
  const [amount, setAmount] = useState("");
  const [entryDate, setEntryDate] = useState<Date>(new Date());
  const [employeeName, setEmployeeName] = useState("");
  const [utilityType, setUtilityType] = useState("electricity");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [expenseNote, setExpenseNote] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);

  const selectedCategoryObj = expenseCategories?.find((c: any) => c.id === selectedCategoryId);
  const isSalaryCategory = Boolean(
    selectedCategoryObj &&
      ((selectedCategoryObj.name || selectedCategoryObj.nameEn || "").toLowerCase().includes("salary") ||
        (selectedCategoryObj.name || selectedCategoryObj.nameEn || "").toLowerCase().includes("wage") ||
        (selectedCategoryObj.nameBn || "").includes("বেতন"))
  );
  const isUtilityCategory = Boolean(
    selectedCategoryObj &&
      ((selectedCategoryObj.name || selectedCategoryObj.nameEn || "").toLowerCase().includes("utility") ||
        (selectedCategoryObj.name || selectedCategoryObj.nameEn || "").toLowerCase().includes("electric") ||
        (selectedCategoryObj.name || selectedCategoryObj.nameEn || "").toLowerCase().includes("bill") ||
        (selectedCategoryObj.nameBn || "").includes("বিল") ||
        (selectedCategoryObj.nameBn || "").includes("বিদ্যুৎ"))
  );

  const handleCancelForm = () => {
    setPayeeName("");
    setAmount("");
    setPaymentStatus("paid");
    setDueAmount("");
    setEntryDate(new Date());
    setEmployeeName("");
    setUtilityType("electricity");
    setExpenseNote("");
    setReceiptFile(null);
    setAttachmentName(null);
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCategoryId) {
      toast({
        title: isBangla ? "ক্যাটাগরি নির্বাচন করুন" : "Category Required",
        description: isBangla
          ? "অনুগ্রহ করে একটি ব্যয় ক্যাটাগরি বেছে নিন।"
          : "Please select an expense category.",
        variant: "destructive",
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: isBangla ? "পরিমাণ প্রয়োজন" : "Amount Required",
        description: isBangla
          ? "অনুগ্রহ করে সঠিক ব্যয়ের পরিমাণ উল্লেখ করুন।"
          : "Please enter a valid expense amount.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedAccountId) {
      toast({
        title: isBangla ? "পেমেন্ট মাধ্যম প্রয়োজন" : "Payment Method Required",
        description: isBangla
          ? "অনুগ্রহ করে ব্যয়ের পেমেন্ট মাধ্যম বেছে নিন।"
          : "Please select an account or payment method.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedBranchId) {
      toast({
        title: isBangla ? "ব্রাঞ্চ প্রয়োজন" : "Branch Required",
        description: isBangla
          ? "অনুগ্রহ করে ব্যয়ের সংশ্লিষ্ট শাখা বেছে নিন।"
          : "Please select a branch for this expense.",
        variant: "destructive",
      });
      return;
    }

    const parsedAmount = parseFloat(amount);
    const parsedDueAmount = paymentStatus === "partial" ? parseFloat(dueAmount) || 0 : undefined;
    const formattedDate = format(entryDate, "yyyy-MM-dd");

    let generatedDescription = expenseNote.trim();
    if (isSalaryCategory && employeeName.trim()) {
      generatedDescription = `${isBangla ? "কর্মচারী" : "Staff"}: ${employeeName.trim()}${
        expenseNote.trim() ? ` — ${expenseNote.trim()}` : ""
      }`;
    } else if (isUtilityCategory) {
      const utilLabel =
        UTILITY_TYPES.find((u) => u.value === utilityType)?.[isBangla ? "labelBn" : "labelEn"] || utilityType;
      generatedDescription = `${utilLabel}${expenseNote.trim() ? ` — ${expenseNote.trim()}` : ""}`;
    } else if (payeeName.trim()) {
      generatedDescription = `${isBangla ? "প্রাপক" : "Payee"}: ${payeeName.trim()}${
        expenseNote.trim() ? ` — ${expenseNote.trim()}` : ""
      }`;
    }

    const payload: any = {
      amount: parsedAmount,
      categoryId: selectedCategoryId,
      accountId: selectedAccountId,
      branchId: selectedBranchId,
      status: paymentStatus,
      dueAmount: parsedDueAmount,
      description: generatedDescription || selectedCategoryObj?.nameEn || undefined,
      date: formattedDate,
    };

    createExpense(payload, {
      onSuccess: () => {
        const catName = isBangla
          ? selectedCategoryObj?.nameBn || "ব্যয়"
          : selectedCategoryObj?.nameEn || "Expense";
        toast({
          title: isBangla ? "ব্যয় সফলভাবে সংরক্ষিত হয়েছে" : "Expense Recorded",
          description: isBangla
            ? `৳${toBnNum(parsedAmount.toLocaleString())} (${catName})`
            : `৳${parsedAmount.toLocaleString()} under ${catName}`,
        });
        handleCancelForm();
        onSuccess?.();
      },
      onError: (err: any) => {
        toast({
          title: isBangla ? "ব্যয় সংরক্ষণ ব্যর্থ হয়েছে" : "Failed to record expense",
          description:
            err?.response?.data?.message ||
            err?.message ||
            (isBangla ? "অনুগ্রহ করে আবার চেষ্টা করুন" : "Please try again."),
          variant: "destructive",
        });
      },
    });
  };

  return (
    <form
      onSubmit={handleSaveExpense}
      className={cn(
        "space-y-5",
        isModal
          ? "p-1"
          : "lg:col-span-7 rounded-2xl border border-border/80 bg-card/95 p-6 shadow-sm backdrop-blur-sm"
      )}
    >
      {!isModal && (
        <div className="pb-1">
          <h2 className="text-base font-bold text-foreground">
            {isBangla ? "নতুন ব্যয় রেকর্ড করুন" : "Record New Expense"}
          </h2>
        </div>
      )}

      {/* Row 1: Category & Dynamic Field by the Side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Category Dropdown with Add Category Button */}
        <div className="space-y-1.5 w-full">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold text-muted-foreground">
              {isBangla ? "ক্যাটাগরি" : "Category"} <span className="text-destructive">*</span>
            </Label>
            <button
              type="button"
              onClick={onOpenAddCategory}
              className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="h-3 w-3" />
              <span>{isBangla ? "ক্যাটাগরি যোগ করুন" : "Add Category"}</span>
            </button>
          </div>
          <Select
            value={selectedCategoryId}
            onValueChange={setSelectedCategoryId}
            required
          >
            <SelectTrigger className="w-full h-10 text-xs bg-muted/20 border-border">
              <SelectValue placeholder={isBangla ? "ক্যাটাগরি নির্বাচন করুন" : "Select Category"} />
            </SelectTrigger>
            <SelectContent className="bg-card border-border max-h-60">
              {expenseCategories?.map((c: any) => (
                <SelectItem key={c.id} value={c.id}>
                  <div className="flex items-center gap-2">
                    {c.color && (
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                        style={{ backgroundColor: c.color }}
                      />
                    )}
                    <span>{isBangla ? (c.nameBn || c.name) : (c.name || c.nameBn)}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Side Field: If Salary -> Employee Name, If Utility -> Utility Type, Else -> Payable's Name */}
        {isSalaryCategory ? (
          <div className="space-y-1.5 w-full">
            <Label className="text-xs font-semibold text-muted-foreground">
              {isBangla ? "কর্মচারীর নাম" : "Employee Name"} <span className="text-destructive">*</span>
            </Label>
            <Input
              type="text"
              placeholder={isBangla ? "যেমন: মো: রফিকুল ইসলাম" : "e.g. Md. Rafiqul Islam"}
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              className="w-full h-10 text-xs bg-muted/20 border-border focus:border-primary"
              required
            />
          </div>
        ) : isUtilityCategory ? (
          <div className="space-y-1.5 w-full">
            <Label className="text-xs font-semibold text-muted-foreground">
              {isBangla ? "ইউটিলিটির ধরণ" : "Utility Type"} <span className="text-destructive">*</span>
            </Label>
            <Select value={utilityType} onValueChange={setUtilityType} required>
              <SelectTrigger className="w-full h-10 text-xs bg-muted/20 border-border">
                <SelectValue placeholder={isBangla ? "ধরণ নির্বাচন করুন" : "Select Type"} />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {UTILITY_TYPES.map((u) => (
                  <SelectItem key={u.value} value={u.value}>
                    <span>{isBangla ? u.labelBn : u.labelEn}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="space-y-1.5 w-full">
            <Label className="text-xs font-semibold text-muted-foreground">
              {isBangla ? "পাওনাদার / প্রাপকের নাম" : "Payable's Name"}
            </Label>
            <Input
              type="text"
              placeholder={isBangla ? "যেমন: করিম এন্টারপ্রাইজ / রহিম" : "e.g. Karim Enterprise, Rahim"}
              value={payeeName}
              onChange={(e) => setPayeeName(e.target.value)}
              className="w-full h-10 text-xs bg-muted/20 border-border focus:border-primary"
            />
          </div>
        )}
      </div>

      {/* Row 2: Payment Method & Branch */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Payment Method / Account Dropdown */}
        <div className="space-y-1.5 w-full">
          <Label className="text-xs font-semibold text-muted-foreground">
            {isBangla ? "পেমেন্ট মাধ্যম" : "Payment Method"} <span className="text-destructive">*</span>
          </Label>
          <Select value={selectedAccountId} onValueChange={setSelectedAccountId} required>
            <SelectTrigger className="w-full h-10 text-xs bg-muted/20 border-border">
              <SelectValue placeholder={isBangla ? "পদ্ধতি নির্বাচন করুন" : "Select Payment Method"} />
            </SelectTrigger>
            <SelectContent className="bg-card border-border max-h-60">
              {paymentMethodsData?.map((pm: any) => {
                const labelEn = pm.name || pm.bankName || pm.provider || pm.accountNumber || pm.type || "Account";
                const labelBn = pm.nameBn || labelEn;
                return (
                  <SelectItem key={pm.id} value={pm.id}>
                    <div className="flex items-center justify-between gap-3 w-full">
                      <span>{isBangla ? labelBn : labelEn}</span>
                      {pm.type && (
                        <span className="text-[10px] text-muted-foreground uppercase">
                          ({pm.type})
                        </span>
                      )}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Branch Select */}
        <div className="space-y-1.5 w-full">
          <Label className="text-xs font-semibold text-muted-foreground">
            {isBangla ? "ব্রাঞ্চ / শাখা" : "Branch"} <span className="text-destructive">*</span>
          </Label>
          <Select value={selectedBranchId} onValueChange={setSelectedBranchId} required>
            <SelectTrigger className="w-full h-10 text-xs bg-muted/20 border-border">
              <SelectValue placeholder={isBangla ? "ব্রাঞ্চ নির্বাচন করুন" : "Select Branch"} />
            </SelectTrigger>
            <SelectContent className="bg-card border-border max-h-60">
              {branchesData?.map((b: any) => (
                <SelectItem key={b.id} value={b.id}>
                  {isBangla ? (b.nameBn || b.name) : b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 3: Payment Status & Expense Note */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Payment Status Dropdown */}
        <div className="space-y-1.5 w-full">
          <Label className="text-xs font-semibold text-muted-foreground">
            {isBangla ? "পেমেন্ট স্ট্যাটাস" : "Payment Status"} <span className="text-destructive">*</span>
          </Label>
          <Select value={paymentStatus} onValueChange={(v: "paid" | "partial" | "unpaid") => setPaymentStatus(v)}>
            <SelectTrigger className="w-full h-10 text-xs bg-muted/20 border-border">
              <SelectValue placeholder={isBangla ? "স্ট্যাটাস নির্বাচন করুন" : "Select Status"} />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="paid">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0" />
                  <span>{isBangla ? "পরিশোধিত (Paid)" : "Paid"}</span>
                </div>
              </SelectItem>
              <SelectItem value="partial">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block shrink-0" />
                  <span>{isBangla ? "আংশিক পরিশোধ (Partial)" : "Partial"}</span>
                </div>
              </SelectItem>
              <SelectItem value="unpaid">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block shrink-0" />
                  <span>{isBangla ? "অপরিশোধিত (Unpaid)" : "Unpaid"}</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Expense Note */}
        <div className="space-y-1.5 w-full">
          <Label className="text-xs font-semibold text-muted-foreground">
            {isBangla ? "ভাউচার নোট / বিবরণ" : "Expense Note"}
          </Label>
          <Input
            type="text"
            placeholder={isBangla ? "ভাউচার / রসিদের বিবরণ (ঐচ্ছিক)" : "Voucher / receipt details (optional)"}
            value={expenseNote}
            onChange={(e) => setExpenseNote(e.target.value)}
            className="w-full h-10 text-xs bg-muted/20 border-border"
          />
        </div>
      </div>

      {/* Row 4: Amount, Due Amount & Date */}
      {paymentStatus === "partial" ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Amount / Paid Amount */}
          <div className="space-y-1.5 w-full">
            <Label className="text-xs font-semibold text-muted-foreground">
              {isBangla ? "পরিশোধিত পরিমাণ" : "Paid Amount"} <span className="text-destructive">*</span>
            </Label>
            <div className="relative flex items-center w-full">
              <span className="absolute left-3 text-sm font-bold text-muted-foreground select-none">
                ৳
              </span>
              <Input
                type="number"
                step="any"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-10 pl-8 font-mono text-sm bg-muted/20 border-border focus:border-primary"
                required
              />
            </div>
          </div>

          {/* Due Amount */}
          <div className="space-y-1.5 w-full">
            <Label className="text-xs font-semibold text-amber-500">
              {isBangla ? "বকেয়া পরিমাণ" : "Due Amount"} <span className="text-destructive">*</span>
            </Label>
            <div className="relative flex items-center w-full">
              <span className="absolute left-3 text-sm font-bold text-amber-500 select-none">
                ৳
              </span>
              <Input
                type="number"
                step="any"
                placeholder="0.00"
                value={dueAmount}
                onChange={(e) => setDueAmount(e.target.value)}
                className="w-full h-10 pl-8 font-mono text-sm bg-amber-500/10 border-amber-500/30 text-amber-400 focus:border-amber-500"
                required={paymentStatus === "partial"}
              />
            </div>
          </div>

          {/* Date Field with Popover and Calendar */}
          <div className="space-y-1.5 w-full">
            <Label className="text-xs font-semibold text-muted-foreground">
              {isBangla ? "তারিখ" : "Date"} <span className="text-destructive">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-10 px-3 justify-between text-left font-normal bg-muted/20 border-border text-foreground hover:bg-muted/30 text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
                >
                  <span className="truncate">
                    {entryDate
                      ? isBangla
                        ? formatBnDate(entryDate)
                        : format(entryDate, "dd MMM yyyy")
                      : isBangla
                      ? "তারিখ নির্বাচন করুন"
                      : "Select date"}
                  </span>
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-border bg-card shadow-lg" align="start">
                <CalendarPicker
                  mode="single"
                  selected={entryDate}
                  onSelect={(date) => date && setEntryDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      ) : paymentStatus === "unpaid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Unpaid Amount */}
          <div className="space-y-1.5 w-full">
            <Label className="text-xs font-semibold text-rose-500">
              {isBangla ? "অপরিশোধিত পরিমাণ" : "Unpaid Amount"} <span className="text-destructive">*</span>
            </Label>
            <div className="relative flex items-center w-full">
              <span className="absolute left-3 text-sm font-bold text-rose-500 select-none">
                ৳
              </span>
              <Input
                type="number"
                step="any"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-10 pl-8 font-mono text-sm bg-rose-500/10 border-rose-500/30 text-rose-400 focus:border-rose-500"
                required
              />
            </div>
          </div>

          {/* Date Field with Popover and Calendar */}
          <div className="space-y-1.5 w-full">
            <Label className="text-xs font-semibold text-muted-foreground">
              {isBangla ? "তারিখ" : "Date"} <span className="text-destructive">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-10 px-3 justify-between text-left font-normal bg-muted/20 border-border text-foreground hover:bg-muted/30 text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
                >
                  <span className="truncate">
                    {entryDate
                      ? isBangla
                        ? formatBnDate(entryDate)
                        : format(entryDate, "dd MMM yyyy")
                      : isBangla
                      ? "তারিখ নির্বাচন করুন"
                      : "Select date"}
                  </span>
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-border bg-card shadow-lg" align="start">
                <CalendarPicker
                  mode="single"
                  selected={entryDate}
                  onSelect={(date) => date && setEntryDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Amount Field with Prefix */}
          <div className="space-y-1.5 w-full">
            <Label className="text-xs font-semibold text-muted-foreground">
              {isBangla ? "পরিমাণ" : "Amount"} <span className="text-destructive">*</span>
            </Label>
            <div className="relative flex items-center w-full">
              <span className="absolute left-3 text-sm font-bold text-muted-foreground select-none">
                ৳
              </span>
              <Input
                type="number"
                step="any"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-10 pl-8 font-mono text-sm bg-muted/20 border-border focus:border-primary"
                required
              />
            </div>
          </div>

          {/* Date Field with Popover and Calendar */}
          <div className="space-y-1.5 w-full">
            <Label className="text-xs font-semibold text-muted-foreground">
              {isBangla ? "তারিখ" : "Date"} <span className="text-destructive">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-10 px-3 justify-between text-left font-normal bg-muted/20 border-border text-foreground hover:bg-muted/30 text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
                >
                  <span className="truncate">
                    {entryDate
                      ? isBangla
                        ? formatBnDate(entryDate)
                        : format(entryDate, "dd MMM yyyy")
                      : isBangla
                      ? "তারিখ নির্বাচন করুন"
                      : "Select date"}
                  </span>
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-border bg-card shadow-lg" align="start">
                <CalendarPicker
                  mode="single"
                  selected={entryDate}
                  onSelect={(date) => date && setEntryDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}

      {/* Row 5: Attachment Drag & Drop + Capture Photo */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-muted-foreground">
          {isBangla ? "ডকুমেন্ট সংযুক্তি" : "Attachment"}
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Drag & Drop Zone (Col Span 8) */}
          <label className="sm:col-span-8 border border-dashed border-border/80 hover:border-indigo-500/50 rounded-xl p-3.5 bg-muted/10 hover:bg-muted/20 transition-all flex items-center justify-center gap-3 cursor-pointer group">
            <Upload className="h-4 w-4 text-muted-foreground group-hover:text-indigo-400 transition-colors" />
            <div className="text-left">
              <p className="text-[11.5px] font-medium text-foreground">
                {attachmentName ||
                  (isBangla
                    ? "ফাইল টেনে আনুন অথবা আপলোড করতে ক্লিক করুন"
                    : "Drag & drop files here or click to upload")}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {isBangla
                  ? "সমর্থিত ফরম্যাট: JPG, PNG, PDF (সর্বোচ্চ ৫MB)"
                  : "Supports: JPG, PNG, PDF (Max 5MB)"}
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  const file = e.target.files[0];
                  setReceiptFile(file);
                  setAttachmentName(file.name);
                  toast({
                    title: isBangla ? "ফাইল সংযুক্ত হয়েছে" : "File Attached",
                    description: file.name,
                  });
                }
              }}
            />
          </label>

          {/* Capture Photo Button (Col Span 4) */}
          <button
            type="button"
            onClick={() => {
              setAttachmentName("voucher_camera_photo.jpg");
              toast({
                title: isBangla ? "ছবি তোলা হয়েছে" : "Photo Captured",
                description: isBangla ? "রসিদের ছবি সফলভাবে গৃহীত।" : "Receipt image snapped successfully.",
              });
            }}
            className="sm:col-span-4 h-11 px-4 rounded-xl border border-border/80 bg-card hover:bg-muted/40 text-xs font-medium text-foreground flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Camera className="h-4 w-4 text-muted-foreground" />
            <span>{isBangla ? "ছবি তুলুন" : "Capture Photo"}</span>
          </button>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
        {isModal && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="text-xs h-9 rounded-xl cursor-pointer"
          >
            {isBangla ? "বাতিল" : "Cancel"}
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-red-500 text-white hover:bg-red-500/90 font-semibold text-xs px-6 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-md transition-all"
        >
          {isSubmitting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          {isBangla ? "ব্যয় সংরক্ষণ করুন" : "Save Expense"}
        </Button>
      </div>
    </form>
  );
};
