"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import {
  Calendar,
  Plus,
  Save,
  Loader2,
  Upload,
  Camera,
  RefreshCw,
  ShoppingBag,
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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  IncomeRecord,
  formatBnDate,
  toBnNum,
  getIconComponentById,
  getCategoryColorStyles,
} from "./types";
import { useCreateIncome } from "@/hooks/api/useFinance";

interface RecordNewIncomeProps {
  incomeCategories?: any[];
  loadingCategories?: boolean;
  branches?: { id?: string; name: string }[];
  isBangla: boolean;
}

export const RecordNewIncome: React.FC<RecordNewIncomeProps> = ({
  incomeCategories,
  loadingCategories,
  branches = [],
  isBangla,
}) => {
  const { toast } = useToast();

  // api mutation
  
  const {mutate: createIncom,isPending:cretingIncome} = useCreateIncome();

  // Internal Form State
  const [amount, setAmount] = useState("");
  const [entryDate, setEntryDate] = useState<Date>(new Date(2026, 7, 22));
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [selectedBranch, setSelectedBranch] = useState(
    branches[0]?.name || "Main Branch"
  );
  const [incomeNote, setIncomeNote] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState("monthly");
  const [recurringDueDate, setRecurringDueDate] = useState<Date>(
    new Date(2026, 8, 22)
  );
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  // Form Submit
  const handleSaveIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: isBangla ? "সঠিক পরিমাণ দিন" : "Invalid Amount",
        description: isBangla
          ? "অনুগ্রহ করে আয়ের পরিমাণ লিখুন।"
          : "Please enter a valid income amount.",
        variant: "destructive",
      });
      return;
    }

    const newIncome = {
    amount:parseFloat(amount),
    date:entryDate,
    paymentMethod,
    branchId:selectedBranch,
    incomeNote,
    isRecurring,
    recurringFrequency,
    recurringDueDate,
    attachmentName,
   }

   createIncom(newIncome,{onSuccess:()=>{
    toast({
      title: isBangla ? "সফল হয়েছে" : "Success",
      description: isBangla
        ? "নতুন আয় সফলভাবে সংরক্ষণ করা হয়েছে।"
        : "New income saved successfully.",
      variant: "success",
    });
    handleCancelForm();
   }})
  };

  const handleCancelForm = () => {
    setAmount("");
    setEntryDate(new Date(2026, 7, 22));
    setSelectedCategoryId("");
    setIncomeNote("");
    setAttachmentName(null);
    setIsRecurring(false);
    setRecurringDueDate(new Date(2026, 8, 22));
  };

  return (
    <form
      onSubmit={handleSaveIncome}
      className="rounded-2xl border border-border/80 bg-card/95 p-6 shadow-sm space-y-5 backdrop-blur-sm"
    >
      <div className="pb-1">
        <h2 className="text-base font-bold text-foreground">
          {isBangla ? "নতুন আয় রেকর্ড করুন" : "Record New Income"}
        </h2>
      </div>

      {/* Row 1: Amount & Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Amount Field with Prefix */}
        <div className="space-y-1.5 w-full">
          <Label className="text-xs font-semibold text-muted-foreground">
            {isBangla ? "পরিমাণ" : "Amount"}{" "}
            <span className="text-destructive">*</span>
          </Label>
          <div className="relative flex items-center w-full">
            <span className="absolute left-3 text-sm font-bold text-emerald-400 select-none">
              ৳
            </span>
            <Input
              type="number"
              step="any"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-10 pl-8 font-mono text-sm bg-muted/20 border-border focus:border-emerald-500 text-emerald-400 font-bold"
              required
            />
          </div>
        </div>

        {/* Date Field with Popover and Calendar */}
        <div className="space-y-1.5 w-full">
          <Label className="text-xs font-semibold text-muted-foreground">
            {isBangla ? "তারিখ" : "Date"}{" "}
            <span className="text-destructive">*</span>
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
            <PopoverContent
              className="w-auto p-0 border-border bg-card shadow-lg"
              align="start"
            >
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

      {/* Row 2: Category & Payment Method */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Category Dropdown */}
        <div className="space-y-1.5 w-full">
          <Label className="text-xs font-semibold text-muted-foreground">
            {isBangla ? "ক্যাটাগরি" : "Category"}{" "}
            <span className="text-destructive">*</span>
          </Label>
          <Select
            value={selectedCategoryId}
            onValueChange={setSelectedCategoryId}
            required
          >
            <SelectTrigger className="w-full h-10 text-xs bg-muted/20 border-border">
              <SelectValue
                placeholder={
                  isBangla ? "ক্যাটাগরি নির্বাচন করুন" : "Select Category"
                }
              />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {loadingCategories ? (
                <div className="flex items-center justify-center p-3 text-xs text-muted-foreground gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>{isBangla ? "লোড হচ্ছে..." : "Loading categories..."}</span>
                </div>
              ) : !incomeCategories || incomeCategories.length === 0 ? (
                <div className="p-3 text-xs text-muted-foreground text-center">
                  {isBangla
                    ? "কোনো ক্যাটাগরি পাওয়া যায়নি"
                    : "No categories found"}
                </div>
              ) : (
                incomeCategories.map((c: any) => (
                  <SelectItem key={c.id} value={c.id}>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: c.color || "#10b981" }}
                      />
                      <span>{isBangla ? c.nameBn || c.name : c.name}</span>
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Payment Method Dropdown */}
        <div className="space-y-1.5 w-full">
          <Label className="text-xs font-semibold text-muted-foreground">
            {isBangla ? "পেমেন্ট মাধ্যম" : "Payment Method"}{" "}
            <span className="text-destructive">*</span>
          </Label>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger className="w-full h-10 text-xs bg-muted/20 border-border">
              <SelectValue
                placeholder={
                  isBangla ? "পদ্ধতি নির্বাচন করুন" : "Select Payment Method"
                }
              />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="cash">
                {isBangla ? "ক্যাশ / নগদ টাকা" : "Cash in Hand"}
              </SelectItem>
              <SelectItem value="bank">
                {isBangla ? "ব্যাংক ট্রান্সফার" : "Bank Transfer"}
              </SelectItem>
              <SelectItem value="bkash">
                {isBangla
                  ? "বিকাশ মার্চেন্ট / পার্সোনাল"
                  : "bKash Merchant / Personal"}
              </SelectItem>
              <SelectItem value="nagad">
                {isBangla ? "নগদ ওয়ালেট" : "Nagad Wallet"}
              </SelectItem>
              <SelectItem value="card">
                {isBangla ? "ক্রেডিট / ডেবিট কার্ড" : "Credit / Debit Card"}
              </SelectItem>
              <SelectItem value="cheque">
                {isBangla ? "চেক" : "Cheque"}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 3: Branch & Income Note */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Branch Select */}
        <div className="space-y-1.5 w-full">
          <Label className="text-xs font-semibold text-muted-foreground">
            {isBangla ? "ব্রাঞ্চ / শাখা" : "Branch"}{" "}
            <span className="text-destructive">*</span>
          </Label>
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="w-full h-10 text-xs bg-muted/20 border-border">
              <SelectValue placeholder="Select Branch" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {branches.length > 0 ? (
                branches.map((b) => (
                  <SelectItem key={b.id || b.name} value={b.name}>
                    {b.name}
                  </SelectItem>
                ))
              ) : (
                <>
                  <SelectItem value="Main Branch">
                    {isBangla ? "প্রধান শাখা (ধানমন্ডি)" : "Main Branch"}
                  </SelectItem>
                  <SelectItem value="Gulshan Store">
                    {isBangla ? "গুলশান স্টোর" : "Gulshan Store"}
                  </SelectItem>
                  <SelectItem value="Tejgaon Central Depot">
                    {isBangla
                      ? "তেজগাঁও সেন্ট্রাল ডিপো"
                      : "Tejgaon Central Depot"}
                  </SelectItem>
                  <SelectItem value="Uttara Branch">
                    {isBangla ? "উত্তরা শাখা" : "Uttara Branch"}
                  </SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Income Note */}
        <div className="space-y-1.5 w-full">
          <Label className="text-xs font-semibold text-muted-foreground">
            {isBangla ? "ভাউচার নোট" : "Income Note"}
          </Label>
          <Input
            type="text"
            placeholder={
              isBangla
                ? "রসিদ / আয়ের বিবরণ (ঐচ্ছিক)"
                : "Receipt / income details (optional)"
            }
            value={incomeNote}
            onChange={(e) => setIncomeNote(e.target.value)}
            className="w-full h-10 text-xs bg-muted/20 border-border"
          />
        </div>
      </div>

      {/* Row 4: Recurring Income Toggle Banner */}
      <div className="rounded-xl border border-border/70 bg-muted/15 p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            <RefreshCw className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">
              {isBangla ? "পুনরাবৃত্তিমূলক আয়" : "Recurring Income"}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {isBangla
                ? "এই আয়টি নির্দিষ্ট বিরতিতে ঘটে (যেমন: মাসিক চুক্তি বা সাবলেট ভাড়া)"
                : "This revenue repeats regularly (e.g. monthly retainer, rent)"}
            </p>
          </div>
        </div>
        <Switch
          checked={isRecurring}
          onCheckedChange={setIsRecurring}
          className="cursor-pointer"
        />
      </div>

      {/* If Recurring is ON -> Extra options */}
      {isRecurring && (
        <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs animate-in fade-in duration-200">
          <div className="space-y-1">
            <Label className="text-[11px] text-muted-foreground">
              {isBangla ? "পুনরাবৃত্তির ধরণ" : "Frequency"}
            </Label>
            <Select
              value={recurringFrequency}
              onValueChange={setRecurringFrequency}
            >
              <SelectTrigger className="w-full h-8 text-xs bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">
                  {isBangla ? "সাপ্তাহিক" : "Weekly"}
                </SelectItem>
                <SelectItem value="monthly">
                  {isBangla ? "মাসিক" : "Monthly"}
                </SelectItem>
                <SelectItem value="yearly">
                  {isBangla ? "বার্ষিক" : "Yearly"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-[11px] text-muted-foreground">
              {isBangla ? "পরবর্তী গ্রহণের তারিখ" : "Next Due Date"}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-8 px-2.5 justify-between text-left font-normal bg-card border border-border rounded-lg text-foreground hover:bg-muted/30 text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                >
                  <span className="truncate">
                    {recurringDueDate
                      ? isBangla
                        ? formatBnDate(recurringDueDate)
                        : format(recurringDueDate, "dd MMM yyyy")
                      : isBangla
                      ? "তারিখ নির্বাচন করুন"
                      : "Select date"}
                  </span>
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 border-border bg-card shadow-lg"
                align="start"
              >
                <CalendarPicker
                  mode="single"
                  selected={recurringDueDate}
                  onSelect={(date) => date && setRecurringDueDate(date)}
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
          {/* Drag & Drop Zone */}
          <label className="sm:col-span-8 border border-dashed border-border/80 hover:border-emerald-500/50 rounded-xl p-3.5 bg-muted/10 hover:bg-muted/20 transition-all flex items-center justify-center gap-3 cursor-pointer group">
            <Upload className="h-4 w-4 text-muted-foreground group-hover:text-emerald-400 transition-colors" />
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
                  setAttachmentName(e.target.files[0].name);
                  toast({
                    title: isBangla ? "ফাইল সংযুক্ত হয়েছে" : "File Attached",
                    description: e.target.files[0].name,
                  });
                }
              }}
            />
          </label>

          {/* Capture Photo Button */}
          <button
            type="button"
            onClick={() => {
              setAttachmentName("income_receipt_photo.jpg");
              toast({
                title: isBangla ? "ছবি তোলা হয়েছে" : "Photo Captured",
                description: isBangla
                  ? "রসিদের ছবি সফলভাবে গৃহীত।"
                  : "Receipt image snapped successfully.",
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
        <Button
          type="submit"
          disabled={cretingIncome}
          className="bg-emerald-600 text-white hover:bg-emerald-500 font-semibold text-xs px-6 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-md transition-all"
        >
          {cretingIncome ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          {isBangla ? "আয় সংরক্ষণ করুন" : "Save Income"}
        </Button>
      </div>
    </form>
  );
};
