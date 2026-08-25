"use client";

import React, { useState, useMemo } from "react";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useToast } from "@/hooks/use-toast";
import { useBranchStore } from "@/stores/branchStore";
import {
  Calendar,
  Download,
  Receipt,
  FileText,
  BarChart3,
  Plus,
  Edit2,
  Trash2,
  Save,
  Loader2,
  Upload,
  Camera,
  RefreshCw,
  Info,
  ChevronDown,
  Home,
  Zap,
  Users,
  Package,
  Truck,
  Layers,
  ArrowRight,
  Search,
  Building2,
  Paperclip,
  Printer,
  Clock,
  Eye,
  CheckCircle2,
  Copy,
  ChevronLeft,
  X,
  CreditCard,
  Tag,
  SlidersHorizontal,
} from "lucide-react";
import { Button, Input } from "@/components/ui/premium";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";

// --- Types ---
interface CategoryItem {
  id: string;
  nameEn: string;
  nameBn: string;
  percentage: number;
  amount: number;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ElementType;
}

interface ExpenseRecord {
  id: string;
  voucherCode: string;
  categoryId: string;
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  dateEn: string;
  dateBn: string;
  branch: string;
  paymentMethod: string;
  isRecurring: boolean;
  recurringFrequency?: string;
  attachmentName?: string | null;
  amount: number;
  color: string;
  bgColor: string;
  icon: React.ElementType;
}

// Initial Categories Data
const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: "rent",
    nameEn: "Rent",
    nameBn: "বাড়ি ভাড়া",
    percentage: 32,
    amount: 15800,
    color: "#f43f5e",
    bgColor: "bg-rose-500/15 text-rose-400",
    borderColor: "border-rose-500/20",
    icon: Home,
  },
  {
    id: "utilities",
    nameEn: "Utilities",
    nameBn: "বিদ্যুৎ ও গ্যাস",
    percentage: 14,
    amount: 6860,
    color: "#eab308",
    bgColor: "bg-amber-500/15 text-amber-400",
    borderColor: "border-amber-500/20",
    icon: Zap,
  },
  {
    id: "salary",
    nameEn: "Salary",
    nameBn: "বেতন",
    percentage: 20,
    amount: 9800,
    color: "#8b5cf6",
    bgColor: "bg-purple-500/15 text-purple-400",
    borderColor: "border-purple-500/20",
    icon: Users,
  },
  {
    id: "inventory",
    nameEn: "Inventory",
    nameBn: "মালামাল",
    percentage: 18,
    amount: 8820,
    color: "#06b6d4",
    bgColor: "bg-cyan-500/15 text-cyan-400",
    borderColor: "border-cyan-500/20",
    icon: Package,
  },
  {
    id: "transport",
    nameEn: "Transport",
    nameBn: "পরিবহন খরচ",
    percentage: 8,
    amount: 3900,
    color: "#22c55e",
    bgColor: "bg-emerald-500/15 text-emerald-400",
    borderColor: "border-emerald-500/20",
    icon: Truck,
  },
];

const INITIAL_EXPENSE_RECORDS: ExpenseRecord[] = [
  {
    id: "exp-1",
    voucherCode: "EXP-2026-0822",
    categoryId: "transport",
    titleEn: "Transport",
    titleBn: "পরিবহন",
    subtitleEn: "Courier dispatch charges",
    subtitleBn: "কুরিয়ার ডেলিভারি চার্জ",
    dateEn: "Aug 22, 2026",
    dateBn: "২২ আগস্ট, ২০২৬",
    branch: "Tejgaon Central Depot",
    paymentMethod: "cash",
    isRecurring: false,
    attachmentName: "courier_receipt_aug22.pdf",
    amount: 850,
    color: "#22c55e",
    bgColor: "bg-emerald-500/15 text-emerald-400",
    icon: Truck,
  },
  {
    id: "exp-2",
    voucherCode: "EXP-2026-0821",
    categoryId: "utilities",
    titleEn: "Utilities",
    titleBn: "ইউটিলিটি",
    subtitleEn: "Showroom internet bill (July)",
    subtitleBn: "শোরুম ইন্টারনেট বিল (জুলাই)",
    dateEn: "Aug 21, 2026",
    dateBn: "২১ আগস্ট, ২০২৬",
    branch: "Main Branch",
    paymentMethod: "bkash",
    isRecurring: true,
    recurringFrequency: "monthly",
    attachmentName: "link3_bill_july.jpg",
    amount: 2500,
    color: "#eab308",
    bgColor: "bg-amber-500/15 text-amber-400",
    icon: Zap,
  },
  {
    id: "exp-3",
    voucherCode: "EXP-2026-0820",
    categoryId: "rent",
    titleEn: "Rent",
    titleBn: "ভাড়া",
    subtitleEn: "Gulshan showroom shop rent advance",
    subtitleBn: "গুলশান শোরুমের অগ্রিম ভাড়া",
    dateEn: "Aug 20, 2026",
    dateBn: "২০ আগস্ট, ২০২৬",
    branch: "Gulshan Store",
    paymentMethod: "bank",
    isRecurring: true,
    recurringFrequency: "monthly",
    attachmentName: "shop_rent_voucher.pdf",
    amount: 15000,
    color: "#f43f5e",
    bgColor: "bg-rose-500/15 text-rose-400",
    icon: Home,
  },
  {
    id: "exp-4",
    voucherCode: "EXP-2026-0818",
    categoryId: "inventory",
    titleEn: "Inventory",
    titleBn: "মালামাল",
    subtitleEn: "Carton packaging & bubble wrap boxes",
    subtitleBn: "প্যাকেজিং কার্টন ও বাবল র্যাপ ক্রয়",
    dateEn: "Aug 18, 2026",
    dateBn: "১৮ আগস্ট, ২০২৬",
    branch: "Main Branch",
    paymentMethod: "cash",
    isRecurring: false,
    attachmentName: "packaging_invoice.pdf",
    amount: 4200,
    color: "#06b6d4",
    bgColor: "bg-cyan-500/15 text-cyan-400",
    icon: Package,
  },
  {
    id: "exp-5",
    voucherCode: "EXP-2026-0815",
    categoryId: "salary",
    titleEn: "Salary",
    titleBn: "বেতন",
    subtitleEn: "Showroom sales staff overtime bonus",
    subtitleBn: "শোরুম বিক্রয়কর্মীদের ওভারটাইম বোনাস",
    dateEn: "Aug 15, 2026",
    dateBn: "১৫ আগস্ট, ২০২৬",
    branch: "Gulshan Store",
    paymentMethod: "bank",
    isRecurring: false,
    attachmentName: null,
    amount: 9800,
    color: "#8b5cf6",
    bgColor: "bg-purple-500/15 text-purple-400",
    icon: Users,
  },
];

// Donut Chart Data
const OVERVIEW_DATA = [
  { nameEn: "Rent", nameBn: "বাড়ি ভাড়া", value: 15800, percentage: "32%", color: "#f43f5e" },
  { nameEn: "Utilities", nameBn: "ইউটিলিটি", value: 6860, percentage: "14%", color: "#eab308" },
  { nameEn: "Salary", nameBn: "বেতন", value: 9800, percentage: "20%", color: "#8b5cf6" },
  { nameEn: "Inventory", nameBn: "মালামাল", value: 8820, percentage: "18%", color: "#06b6d4" },
  { nameEn: "Transport", nameBn: "পরিবহন", value: 3900, percentage: "8%", color: "#22c55e" },
  { nameEn: "Others", nameBn: "অন্যান্য", value: 3720, percentage: "8%", color: "#64748b" },
];

// Number converter for Bengali numerals
const toBnNum = (num: number | string): string => {
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(num).replace(/[0-9]/g, (w) => bnDigits[+w]);
};

// Payment Method Labels
const PAYMENT_METHOD_MAP: Record<string, { en: string; bn: string; badgeColor: string }> = {
  cash: { en: "Cash", bn: "ক্যাশ", badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  bank: { en: "Bank Transfer", bn: "ব্যাংক", badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
  bkash: { en: "bKash", bn: "বিকাশ", badgeColor: "bg-pink-500/10 text-pink-400 border-pink-500/20" },
  nagad: { en: "Nagad", bn: "নগদ", badgeColor: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  card: { en: "Card", bn: "কার্ড", badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  cheque: { en: "Cheque", bn: "চেক", badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
};

export default function ExpensePageContent() {
  const { isBangla } = useAppTranslation();
  const { toast } = useToast();
  const { branches } = useBranchStore();

  // State
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(INITIAL_EXPENSE_RECORDS);
  const [dateRange, setDateRange] = useState("Jul 23, 2026 - Aug 22, 2026");

  // Selected Expense for Split Layout Detail Panel
  const [selectedExpense, setSelectedExpense] = useState<ExpenseRecord | null>(null);

  // Form State
  const [amount, setAmount] = useState("");
  const [entryDate, setEntryDate] = useState("2026-08-22");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [selectedBranch, setSelectedBranch] = useState(branches[0]?.name || "Main Branch");
  const [expenseNote, setExpenseNote] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState("monthly");
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Table Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [tableCategoryFilter, setTableCategoryFilter] = useState("all");
  const [tableBranchFilter, setTableBranchFilter] = useState("all");

  // Modals State
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [categoryFormNameEn, setCategoryFormNameEn] = useState("");
  const [categoryFormNameBn, setCategoryFormNameBn] = useState("");
  const [categoryFormColor, setCategoryFormColor] = useState("#f43f5e");
  const [isViewAllCategoriesOpen, setIsViewAllCategoriesOpen] = useState(false);

  // Filtered Expenses for Recent Expenses Full Table
  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      const matchSearch =
        searchQuery.trim() === "" ||
        exp.voucherCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.titleBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.subtitleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.subtitleBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.branch.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        tableCategoryFilter === "all" || exp.categoryId === tableCategoryFilter;
      const matchBranch =
        tableBranchFilter === "all" || exp.branch === tableBranchFilter;

      return matchSearch && matchCategory && matchBranch;
    });
  }, [expenses, searchQuery, tableCategoryFilter, tableBranchFilter]);

  // Form Submit
  const handleSaveExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: isBangla ? "সঠিক পরিমাণ দিন" : "Invalid Amount",
        description: isBangla ? "অনুগ্রহ করে ব্যয়ের পরিমাণ লিখুন।" : "Please enter a valid expense amount.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const cat = categories.find((c) => c.id === selectedCategoryId) || categories[0];
      const parsedAmount = parseFloat(amount);
      const randomId = Math.floor(1000 + Math.random() * 9000);

      // Add to expenses list with complete data
      const newRecord: ExpenseRecord = {
        id: `exp-${Date.now()}`,
        voucherCode: `EXP-2026-${randomId}`,
        categoryId: cat.id,
        titleEn: cat.nameEn,
        titleBn: cat.nameBn,
        subtitleEn: expenseNote.trim() || "Manual Expense Entry",
        subtitleBn: expenseNote.trim() || "ম্যানুয়াল ব্যয় এন্ট্রি",
        dateEn: "Today",
        dateBn: "আজ",
        branch: selectedBranch,
        paymentMethod: paymentMethod,
        isRecurring: isRecurring,
        recurringFrequency: isRecurring ? recurringFrequency : undefined,
        attachmentName: attachmentName,
        amount: parsedAmount,
        color: cat.color,
        bgColor: cat.bgColor,
        icon: cat.icon,
      };

      setExpenses((prev) => [newRecord, ...prev]);

      // Update category amounts
      setCategories((prev) =>
        prev.map((c) =>
          c.id === cat.id ? { ...c, amount: c.amount + parsedAmount } : c
        )
      );

      toast({
        title: isBangla ? "ব্যয় সফলভাবে সংরক্ষিত হয়েছে" : "Expense Recorded",
        description: isBangla
          ? `৳${toBnNum(parsedAmount.toLocaleString())} (${cat.nameBn})`
          : `৳${parsedAmount.toLocaleString()} under ${cat.nameEn}`,
      });

      // Reset form
      setAmount("");
      setSelectedCategoryId("");
      setExpenseNote("");
      setAttachmentName(null);
      setIsRecurring(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelForm = () => {
    setAmount("");
    setSelectedCategoryId("");
    setExpenseNote("");
    setAttachmentName(null);
    setIsRecurring(false);
  };

  // Category Add/Edit Actions
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryFormNameEn("");
    setCategoryFormNameBn("");
    setCategoryFormColor("#8b5cf6");
    setIsAddCategoryOpen(true);
  };

  const handleOpenEditCategory = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setCategoryFormNameEn(cat.nameEn);
    setCategoryFormNameBn(cat.nameBn);
    setCategoryFormColor(cat.color);
    setIsAddCategoryOpen(true);
  };

  const handleSaveCategoryModal = () => {
    if (!categoryFormNameEn.trim() && !categoryFormNameBn.trim()) return;

    const enName = categoryFormNameEn.trim() || categoryFormNameBn.trim();
    const bnName = categoryFormNameBn.trim() || categoryFormNameEn.trim();

    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? {
                ...c,
                nameEn: enName,
                nameBn: bnName,
                color: categoryFormColor,
              }
            : c
        )
      );
      toast({ title: isBangla ? "ক্যাটাগরি আপডেট হয়েছে" : "Category Updated" });
    } else {
      const newCat: CategoryItem = {
        id: `cat-${Date.now()}`,
        nameEn: enName,
        nameBn: bnName,
        percentage: 5,
        amount: 0,
        color: categoryFormColor,
        bgColor: "bg-indigo-500/15 text-indigo-400",
        borderColor: "border-indigo-500/20",
        icon: Layers,
      };
      setCategories((prev) => [...prev, newCat]);
      toast({
        title: isBangla ? "নতুন ক্যাটাগরি তৈরি হয়েছে" : "Category Added",
        description: isBangla ? newCat.nameBn : newCat.nameEn,
      });
    }
    setIsAddCategoryOpen(false);
  };

  const handleDeleteCategory = (catId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== catId));
    toast({ title: isBangla ? "ক্যাটাগরি মুছে ফেলা হয়েছে" : "Category Deleted" });
  };

  const handleDeleteExpense = (expId: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== expId));
    if (selectedExpense?.id === expId) {
      setSelectedExpense(null);
    }
    toast({
      title: isBangla ? "ভাউচার মুছে ফেলা হয়েছে" : "Expense Deleted",
      description: isBangla ? "রেকর্ড সফলভাবে অপসারণ করা হলো।" : "Expense entry removed.",
    });
  };

  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: isBangla ? "কপি করা হয়েছে" : "Copied to Clipboard",
      description: code,
    });
  };

  return (
    <TooltipProvider>
      <div className="space-y-6 mx-auto pb-24 text-foreground">
        {/* =========================================================================
            1. HEADER SECTION
           ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {isBangla ? "ব্যয়ের হিসাব" : "Expenses"}
              </h1>
            </div>
            <p className="text-xs text-muted-foreground">
              {isBangla
                ? "আপনার ব্যবসায়িক সকল খরচ ট্র্যাক, পরিচালনা এবং বিশদ বিশ্লেষণ করুন"
                : "Track, manage and analyze your business expenses"}
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            {/* Date Range Picker Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-9 px-3.5 rounded-xl border border-border/80 bg-card/60 hover:bg-card text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors cursor-pointer shadow-2xs">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>
                    {isBangla
                      ? dateRange === "Jul 23, 2026 - Aug 22, 2026"
                        ? "২৩ জুলাই, ২০২৬ - ২২ আগস্ট, ২০২৬"
                        : dateRange
                      : dateRange}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card border-border">
                <DropdownMenuItem onClick={() => setDateRange("Today: Aug 22, 2026")}>
                  {isBangla ? "আজ (২২ আগস্ট, ২০২৬)" : "Today: Aug 22, 2026"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateRange("This Week: Aug 16 - Aug 22, 2026")}>
                  {isBangla ? "এই সপ্তাহ (১৬ - ২২ আগস্ট)" : "This Week: Aug 16 - Aug 22, 2026"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateRange("Jul 23, 2026 - Aug 22, 2026")}>
                  {isBangla ? "গত ৩০ দিন (২৩ জুলাই - ২২ আগস্ট)" : "Last 30 Days (Jul 23 - Aug 22)"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateRange("This Month: Aug 1 - Aug 31, 2026")}>
                  {isBangla ? "এই মাস (আগস্ট ২০২৬)" : "This Month (August 2026)"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateRange("This Year (2026)")}>
                  {isBangla ? "এই বছর (২০২৬)" : "This Year (2026)"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Export Report Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-9 px-3.5 rounded-xl border border-border/80 bg-card/60 hover:bg-card text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors cursor-pointer shadow-2xs">
                  <Download className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{isBangla ? "রিপোর্ট ডাউনলোড" : "Export Report"}</span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                <DropdownMenuItem
                  onClick={() =>
                    toast({
                      title: isBangla ? "CSV ডাউনলোড হচ্ছে..." : "Exporting CSV...",
                      description: isBangla ? "ব্যয় রিপোর্ট CSV ফাইলে ডাউনলোড সম্পন্ন।" : "Expense report downloaded as CSV.",
                    })
                  }
                >
                  {isBangla ? "CSV ফাইল (.csv)" : "Export as CSV (.csv)"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    toast({
                      title: isBangla ? "PDF তৈরি হচ্ছে..." : "Generating PDF...",
                      description: isBangla ? "ব্যয় রিপোর্ট PDF ফরম্যাটে প্রস্তুত।" : "Expense report compiled as PDF.",
                    })
                  }
                >
                  {isBangla ? "PDF ডকুমেন্ট (.pdf)" : "Export as PDF (.pdf)"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.print()}>
                  {isBangla ? "প্রিন্ট করুন" : "Print Report"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* =========================================================================
            2. TOP STATS CARDS (4 METRICS IN ROW)
           ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Today */}
          <div className="rounded-2xl border border-border/70 bg-card/90 p-4.5 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-emerald-500/40 transition-all">
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                <Receipt className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="mt-3 space-y-1 z-10">
              <div className="flex items-center gap-1 text-[11.5px] font-medium text-muted-foreground">
                <span>{isBangla ? "আজকের মোট ব্যয়" : "Total Today"}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground/60 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    {isBangla ? "আজকে এন্ট্রি করা মোট খরচ" : "Expenses recorded today"}
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-2xl font-bold font-mono text-foreground tracking-tight">
                {isBangla ? `৳${toBnNum("2,500.00")}` : "৳2,500.00"}
              </p>
              <p className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                <span>{isBangla ? "গতকালের চেয়ে +১২.৫%" : "vs yesterday +12.5%"}</span>
                <span>↑</span>
              </p>
            </div>

            {/* Sparkline Wave */}
            <div className="absolute right-2 bottom-2 w-28 h-12 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 100 40" className="w-full h-full stroke-emerald-400 stroke-[2.5] fill-none drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">
                <path d="M 5,32 Q 25,28 45,18 T 75,14 T 95,8" strokeLinecap="round" />
              </svg>
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Card 2: Total This Month */}
          <div className="rounded-2xl border border-border/70 bg-card/90 p-4.5 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-sky-500/40 transition-all">
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/20">
                <Calendar className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="mt-3 space-y-1 z-10">
              <div className="flex items-center gap-1 text-[11.5px] font-medium text-muted-foreground">
                <span>{isBangla ? "এই মাসের মোট ব্যয়" : "Total This Month"}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground/60 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    {isBangla ? "চলতি মাসের মোট খরচ" : "Expenses recorded in current month"}
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-2xl font-bold font-mono text-foreground tracking-tight">
                {isBangla ? `৳${toBnNum("48,900.00")}` : "৳48,900.00"}
              </p>
              <p className="text-[11px] font-semibold text-rose-400 flex items-center gap-1">
                <span>{isBangla ? "গত মাসের চেয়ে -৮.৪%" : "vs last month -8.4%"}</span>
                <span>↓</span>
              </p>
            </div>

            {/* Sparkline Wave */}
            <div className="absolute right-2 bottom-2 w-28 h-12 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 100 40" className="w-full h-full stroke-sky-400 stroke-[2.5] fill-none drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]">
                <path d="M 5,30 Q 30,35 50,22 T 75,20 T 95,12" strokeLinecap="round" />
              </svg>
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/5 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Card 3: Total This Year */}
          <div className="rounded-2xl border border-border/70 bg-card/90 p-4.5 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-purple-500/40 transition-all">
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/20">
                <BarChart3 className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="mt-3 space-y-1 z-10">
              <div className="flex items-center gap-1 text-[11.5px] font-medium text-muted-foreground">
                <span>{isBangla ? "এই বছরের মোট ব্যয়" : "Total This Year"}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground/60 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    {isBangla ? "২০২৬ সালের সর্বমোট ব্যয়" : "Expenses recorded in 2026"}
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-2xl font-bold font-mono text-foreground tracking-tight">
                {isBangla ? `৳${toBnNum("612,350.00")}` : "৳612,350.00"}
              </p>
              <p className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                <span>{isBangla ? "গত বছরের চেয়ে +১৮.৬%" : "vs last year +18.6%"}</span>
                <span>↑</span>
              </p>
            </div>

            {/* Sparkline Wave */}
            <div className="absolute right-2 bottom-2 w-28 h-12 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 100 40" className="w-full h-full stroke-purple-400 stroke-[2.5] fill-none drop-shadow-[0_0_8px_rgba(192,132,252,0.4)]">
                <path d="M 5,34 Q 30,24 50,30 T 75,18 T 95,6" strokeLinecap="round" />
              </svg>
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Card 4: Total Entries */}
          <div className="rounded-2xl border border-border/70 bg-card/90 p-4.5 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-amber-500/40 transition-all">
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/20">
                <FileText className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="mt-3 space-y-1 z-10">
              <div className="flex items-center gap-1 text-[11.5px] font-medium text-muted-foreground">
                <span>{isBangla ? "মোট এন্ট্রি সংখ্যা" : "Total Entries"}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground/60 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    {isBangla ? "দাখিলকৃত মোট ভাউচার সংখ্যা" : "Number of expense vouchers entered"}
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-2xl font-bold font-mono text-foreground tracking-tight">
                {isBangla ? toBnNum("128") : "128"}
              </p>
              <p className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                <span>{isBangla ? "গত মাসে +৯টি" : "vs last month +9"}</span>
                <span>↑</span>
              </p>
            </div>

            {/* Sparkline Wave */}
            <div className="absolute right-2 bottom-2 w-28 h-12 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 100 40" className="w-full h-full stroke-amber-400 stroke-[2.5] fill-none drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">
                <path d="M 5,35 Q 25,28 45,32 T 75,18 T 95,8" strokeLinecap="round" />
              </svg>
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* =========================================================================
            3. MIDDLE SECTION (LEFT FORM | RIGHT CATEGORIES + EXPENSE OVERVIEW)
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* -------------------------------------------------------------
              LEFT: RECORD NEW EXPENSE FORM (Col Span 7)
             ------------------------------------------------------------- */}
          <form
            onSubmit={handleSaveExpense}
            className="lg:col-span-7 rounded-2xl border border-border/80 bg-card/95 p-6 shadow-sm space-y-5 backdrop-blur-sm"
          >
            <div className="pb-1">
              <h2 className="text-base font-bold text-foreground">
                {isBangla ? "নতুন ব্যয় রেকর্ড করুন" : "Record New Expense"}
              </h2>
            </div>

            {/* Row 1: Amount & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Amount Field with Prefix */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">
                  {isBangla ? "পরিমাণ" : "Amount"} <span className="text-destructive">*</span>
                </Label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-sm font-bold text-muted-foreground select-none">
                    ৳
                  </span>
                  <Input
                    type="number"
                    step="any"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-10 pl-8 font-mono text-sm bg-muted/20 border-border focus:border-primary"
                    required
                  />
                </div>
              </div>

              {/* Date Field */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">
                  {isBangla ? "তারিখ" : "Date"} <span className="text-destructive">*</span>
                </Label>
                <div className="relative flex items-center">
                  <Input
                    type="date"
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    className="h-10 text-xs bg-muted/20 border-border focus:border-primary pr-9"
                    required
                  />
                  <Calendar className="absolute right-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Row 2: Category & Payment Method */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category Dropdown */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">
                  {isBangla ? "ক্যাটাগরি" : "Category"} <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={selectedCategoryId}
                  onValueChange={setSelectedCategoryId}
                  required
                >
                  <SelectTrigger className="h-10 text-xs bg-muted/20 border-border">
                    <SelectValue placeholder={isBangla ? "ক্যাটাগরি নির্বাচন করুন" : "Select Category"} />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {isBangla ? c.nameBn : c.nameEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Method Dropdown */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">
                  {isBangla ? "পেমেন্ট মাধ্যম" : "Payment Method"} <span className="text-destructive">*</span>
                </Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="h-10 text-xs bg-muted/20 border-border">
                    <SelectValue placeholder={isBangla ? "পদ্ধতি নির্বাচন করুন" : "Select Payment Method"} />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="cash">
                      {isBangla ? "ক্যাশ / নগদ টাকা" : "Cash in Hand"}
                    </SelectItem>
                    <SelectItem value="bank">
                      {isBangla ? "ব্যাংক ট্রান্সফার" : "Bank Transfer"}
                    </SelectItem>
                    <SelectItem value="bkash">
                      {isBangla ? "বিকাশ মার্চেন্ট / পার্সোনাল" : "bKash Merchant / Personal"}
                    </SelectItem>
                    <SelectItem value="nagad">
                      {isBangla ? "নগদ ওয়ালেট" : "Nagad Wallet"}
                    </SelectItem>
                    <SelectItem value="card">
                      {isBangla ? "কোম্পানি ক্রেডিট কার্ড" : "Company Credit Card"}
                    </SelectItem>
                    <SelectItem value="cheque">
                      {isBangla ? "চেক" : "Cheque"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 3: Branch & Expense Note */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Branch Select */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">
                  {isBangla ? "ব্রাঞ্চ / শাখা" : "Branch"} <span className="text-destructive">*</span>
                </Label>
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger className="h-10 text-xs bg-muted/20 border-border">
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="Main Branch">
                      {isBangla ? "প্রধান শাখা (ধানমন্ডি)" : "Main Branch"}
                    </SelectItem>
                    <SelectItem value="Gulshan Store">
                      {isBangla ? "গুলশান স্টোর" : "Gulshan Store"}
                    </SelectItem>
                    <SelectItem value="Tejgaon Central Depot">
                      {isBangla ? "তেজগাঁও সেন্ট্রাল ডিপো" : "Tejgaon Central Depot"}
                    </SelectItem>
                    <SelectItem value="Uttara Branch">
                      {isBangla ? "উত্তরা শাখা" : "Uttara Branch"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Expense Note */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">
                  {isBangla ? "ভাউচার নোট" : "Expense Note"}
                </Label>
                <Input
                  type="text"
                  placeholder={isBangla ? "ভাউচার / রসিদের বিবরণ (ঐচ্ছিক)" : "Voucher / receipt details (optional)"}
                  value={expenseNote}
                  onChange={(e) => setExpenseNote(e.target.value)}
                  className="h-10 text-xs bg-muted/20 border-border"
                />
              </div>
            </div>

            {/* Row 4: Recurring Expense Toggle Banner */}
            <div className="rounded-xl border border-border/70 bg-muted/15 p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
                  <RefreshCw className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">
                    {isBangla ? "পুনরাবৃত্তিমূলক ব্যয়" : "Recurring Expense"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {isBangla
                      ? "এই ব্যয়টি নির্দিষ্ট বিরতিতে ঘটে (যেমন: মাসিক দোকান ভাড়া)"
                      : "This expense repeats regularly (e.g. monthly rent)"}
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
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-xs animate-in fade-in duration-200">
                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground">
                    {isBangla ? "পুনরাবৃত্তির ধরণ" : "Frequency"}
                  </Label>
                  <Select value={recurringFrequency} onValueChange={setRecurringFrequency}>
                    <SelectTrigger className="h-8 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">{isBangla ? "সাপ্তাহিক" : "Weekly"}</SelectItem>
                      <SelectItem value="monthly">{isBangla ? "মাসিক" : "Monthly"}</SelectItem>
                      <SelectItem value="yearly">{isBangla ? "বার্ষিক" : "Yearly"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground">
                    {isBangla ? "পরবর্তী পরিশোধের তারিখ" : "Next Due Date"}
                  </Label>
                  <Input type="date" defaultValue="2026-09-22" className="h-8 text-xs bg-card" />
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
                        setAttachmentName(e.target.files[0].name);
                        toast({
                          title: isBangla ? "ফাইল সংযুক্ত হয়েছে" : "File Attached",
                          description: e.target.files[0].name,
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
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-foreground text-background hover:bg-foreground/90 font-semibold text-xs px-6 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-md transition-all"
              >
                {isSubmitting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                {isBangla ? "ব্যয় সংরক্ষণ করুন" : "Save Expense"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={handleCancelForm}
                className="text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-xl px-5 py-2.5 cursor-pointer"
              >
                {isBangla ? "বাতিল" : "Cancel"}
              </Button>
            </div>
          </form>

          {/* -------------------------------------------------------------
              RIGHT: 2 STACKED CARDS (Categories + Expense Overview) (Col Span 5)
             ------------------------------------------------------------- */}
          <div className="lg:col-span-5 space-y-6">
            {/* CARD 1: Expense Categories */}
            <div className="rounded-2xl border border-border/80 bg-card/95 p-5 shadow-sm space-y-4 backdrop-blur-sm">
              <div className="flex items-center justify-between pb-1">
                <h3 className="text-sm font-bold text-foreground">
                  {isBangla ? "ব্যয় ক্যাটাগরি সমূহ" : "Expense Categories"}
                </h3>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleOpenAddCategory}
                  className="h-7.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{isBangla ? "ক্যাটাগরি যোগ করুন" : "Add Category"}</span>
                </Button>
              </div>

              {/* Category List */}
              <div className="space-y-3">
                {categories.slice(0, 5).map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between gap-3 text-xs group"
                    >
                      {/* Left: Icon + Names */}
                      <div className="flex items-center gap-2.5 w-28 shrink-0 min-w-0">
                        <div
                          className={cn(
                            "p-1.5 rounded-lg border shrink-0",
                            cat.bgColor,
                            cat.borderColor
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0 truncate">
                          <p className="font-bold text-foreground truncate">
                            {isBangla ? cat.nameBn : cat.nameEn}
                          </p>
                        </div>
                      </div>

                      {/* Center: Sleek Progress Bar */}
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-muted/40 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${cat.percentage}%`,
                              backgroundColor: cat.color,
                            }}
                          />
                        </div>
                        <span className="text-[11px] font-mono text-muted-foreground w-8 text-right shrink-0">
                          {isBangla ? `${toBnNum(cat.percentage)}%` : `${cat.percentage}%`}
                        </span>
                      </div>

                      {/* Right: Amount & Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono font-bold text-foreground text-xs">
                          {isBangla
                            ? `৳${toBnNum(cat.amount.toLocaleString())}.০০`
                            : `৳${cat.amount.toLocaleString()}.00`}
                        </span>

                        <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleOpenEditCategory(cat)}
                            className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors cursor-pointer"
                            title={isBangla ? "সম্পাদনা" : "Edit"}
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-1 text-muted-foreground hover:text-rose-400 rounded transition-colors cursor-pointer"
                            title={isBangla ? "মুছে ফেলুন" : "Delete"}
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* View All Categories Link */}
              <div className="pt-2 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => setIsViewAllCategoriesOpen(true)}
                  className="text-[11.5px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>{isBangla ? "সব ক্যাটাগরি দেখুন" : "View all categories"}</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* CARD 2: Expense Overview */}
            <div className="rounded-2xl border border-border/80 bg-card/95 p-5 shadow-sm space-y-4 backdrop-blur-sm">
              <div className="flex items-center justify-between pb-1">
                <h3 className="text-sm font-bold text-foreground">
                  {isBangla ? "ব্যয় সংক্ষিপ্ত বিবরণ" : "Expense Overview"}
                </h3>
                <Select defaultValue="this-month">
                  <SelectTrigger className="h-7 text-[11px] w-28 bg-muted/20 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="this-month">
                      {isBangla ? "এই মাস" : "This Month"}
                    </SelectItem>
                    <SelectItem value="last-month">
                      {isBangla ? "গত মাস" : "Last Month"}
                    </SelectItem>
                    <SelectItem value="this-year">
                      {isBangla ? "এই বছর" : "This Year"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Donut Chart and Legend */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                {/* Donut Chart (Col Span 5) */}
                <div className="sm:col-span-5 h-40 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={OVERVIEW_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={44}
                        outerRadius={62}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {OVERVIEW_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Center Text inside Donut */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                    <span className="text-sm font-extrabold font-mono text-foreground leading-none">
                      {isBangla ? `৳${toBnNum("48,900")}` : "৳48,900"}
                    </span>
                    <span className="text-[9.5px] text-muted-foreground mt-0.5">
                      {isBangla ? "মোট ব্যয়" : "Total Expense"}
                    </span>
                  </div>
                </div>

                {/* Legend List (Col Span 7) */}
                <div className="sm:col-span-7 grid grid-cols-1 gap-y-1.5 text-[11px]">
                  {OVERVIEW_DATA.map((item) => (
                    <div key={item.nameEn} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-muted-foreground truncate">
                          {isBangla ? item.nameBn : item.nameEn}
                        </span>
                      </div>
                      <span className="font-mono font-medium text-foreground ml-1 shrink-0 text-[10.5px]">
                        {isBangla
                          ? `৳${toBnNum(item.value.toLocaleString())}`
                          : `৳${item.value.toLocaleString()}`}{" "}
                        <span className="text-muted-foreground text-[10px]">
                          ({isBangla ? toBnNum(item.percentage) : item.percentage})
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            4. BOTTOM SECTION: SPLIT LAYOUT (RECENT EXPENSES LIST <-> EXPENSE DETAILS)
               Exact pattern as Parties page split layout!
           ========================================================================= */}
        <div className="flex flex-col lg:flex-row min-h-[550px] items-stretch overflow-hidden gap-6">
          {/* -------------------------------------------------------------
              LEFT COLUMN: EXPENSES LIST
             ------------------------------------------------------------- */}
          <div
            className={cn(
              "transition-all duration-300 ease-in-out flex flex-col shrink-0 overflow-hidden",
              selectedExpense
                ? "w-0 h-0 min-h-0 opacity-0 pointer-events-none lg:w-1/2 lg:h-auto lg:min-h-0 lg:opacity-100 lg:pointer-events-auto"
                : "w-full opacity-100"
            )}
          >
            <div className="rounded-2xl border border-border/80 bg-card/95 shadow-sm backdrop-blur-sm overflow-hidden flex flex-col h-full flex-1">
              {/* List Header */}
              <div className="p-5 pb-4 border-b border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/10">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-indigo-400" />
                    <h3 className="text-base font-bold text-foreground">
                      {isBangla
                        ? `ব্যয়ের তালিকা (${toBnNum(filteredExpenses.length)})`
                        : `Expenses (${filteredExpenses.length})`}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isBangla
                      ? "বিস্তারিত দেখতে তালিকায় ক্লিক করুন"
                      : "Click any item to view full details"}
                  </p>
                </div>

                {!selectedExpense && (
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => window.print()}
                      className="h-8 text-xs rounded-xl gap-1.5 cursor-pointer"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      <span>{isBangla ? "প্রিন্ট" : "Print"}</span>
                    </Button>
                  </div>
                )}
              </div>

              {/* Search & Filter Bar */}
              <div className="p-3.5 bg-muted/5 border-b border-border/60 flex flex-col gap-2.5">
                <div className="relative flex items-center">
                  <Search className="absolute left-3 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      isBangla
                        ? "ভাউচার আইডি, বিবরণ দিয়ে খুঁজুন..."
                        : "Search voucher, note..."
                    }
                    className="h-9 pl-9 text-xs bg-card border-border"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Select value={tableCategoryFilter} onValueChange={setTableCategoryFilter}>
                    <SelectTrigger className="h-8 text-[11px] bg-card border-border">
                      <SelectValue placeholder={isBangla ? "সকল ক্যাটাগরি" : "All Categories"} />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="all">
                        {isBangla ? "সকল ক্যাটাগরি" : "All Categories"}
                      </SelectItem>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {isBangla ? c.nameBn : c.nameEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={tableBranchFilter} onValueChange={setTableBranchFilter}>
                    <SelectTrigger className="h-8 text-[11px] bg-card border-border">
                      <SelectValue placeholder={isBangla ? "সকল ব্রাঞ্চ" : "All Branches"} />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="all">
                        {isBangla ? "সকল ব্রাঞ্চ" : "All Branches"}
                      </SelectItem>
                      <SelectItem value="Main Branch">
                        {isBangla ? "প্রধান শাখা" : "Main Branch"}
                      </SelectItem>
                      <SelectItem value="Gulshan Store">
                        {isBangla ? "গুলশান স্টোর" : "Gulshan Store"}
                      </SelectItem>
                      <SelectItem value="Tejgaon Central Depot">
                        {isBangla ? "তেজগাঁও সেন্ট্রাল ডিপো" : "Tejgaon Central Depot"}
                      </SelectItem>
                      <SelectItem value="Uttara Branch">
                        {isBangla ? "উত্তরা শাখা" : "Uttara Branch"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Table / List View */}
              <div className="overflow-x-auto flex-1">
                {filteredExpenses.length === 0 ? (
                  <div className="py-16 text-center space-y-2">
                    <Receipt className="h-10 w-10 text-muted-foreground/40 mx-auto" />
                    <p className="text-sm font-semibold text-foreground">
                      {isBangla ? "কোন ব্যয়ের রেকর্ড নেই" : "No Expenses Found"}
                    </p>
                  </div>
                ) : (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border/80 bg-muted/30 text-muted-foreground font-semibold text-[11px]">
                        <th className="py-3 px-3.5">{isBangla ? "ভাউচার ও বিবরণ" : "Voucher & Item"}</th>
                        {!selectedExpense && (
                          <>
                            <th className="py-3 px-3.5 whitespace-nowrap">{isBangla ? "শাখা" : "Branch"}</th>
                            <th className="py-3 px-3.5 whitespace-nowrap">{isBangla ? "পদ্ধতি" : "Method"}</th>
                            <th className="py-3 px-3.5 whitespace-nowrap">{isBangla ? "সংযুক্তি" : "Attachment"}</th>
                          </>
                        )}
                        <th className="py-3 px-3.5 text-right">{isBangla ? "পরিমাণ" : "Amount"}</th>
                        {!selectedExpense && (
                          <th className="py-3 px-3.5 text-right">{isBangla ? "অ্যাকশন" : "Action"}</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredExpenses.map((exp) => {
                        const Icon = exp.icon;
                        const isSelected = selectedExpense?.id === exp.id;
                        const payInfo = PAYMENT_METHOD_MAP[exp.paymentMethod] || {
                          en: exp.paymentMethod,
                          bn: exp.paymentMethod,
                          badgeColor: "bg-muted text-muted-foreground",
                        };

                        return (
                          <tr
                            key={exp.id}
                            onClick={() => setSelectedExpense(exp)}
                            className={cn(
                              "hover:bg-muted/30 transition-colors cursor-pointer group",
                              isSelected ? "bg-indigo-500/10 border-l-2 border-indigo-500" : ""
                            )}
                          >
                            {/* Voucher & Description */}
                            <td className="py-3 px-3.5 align-middle">
                              <div className="flex items-center gap-2.5">
                                <div className={cn("p-2 rounded-xl shrink-0 border", exp.bgColor)}>
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <p className="font-mono font-bold text-foreground text-xs leading-tight group-hover:text-indigo-400 transition-colors">
                                      {exp.voucherCode}
                                    </p>
                                    <span className="text-[10px] text-muted-foreground">
                                      • {isBangla ? exp.titleBn : exp.titleEn}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-muted-foreground truncate max-w-[200px] mt-0.5">
                                    {isBangla ? exp.subtitleBn : exp.subtitleEn}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground/80 flex items-center gap-1 mt-0.5 font-mono">
                                    <Clock className="h-2.5 w-2.5" />
                                    <span>{isBangla ? exp.dateBn : exp.dateEn}</span>
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Additional Full Width Columns when NOT Split */}
                            {!selectedExpense && (
                              <>
                                <td className="py-3 px-3.5 align-middle whitespace-nowrap">
                                  <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                                    <Building2 className="h-3 w-3 text-muted-foreground/70" />
                                    {exp.branch}
                                  </span>
                                </td>

                                <td className="py-3 px-3.5 align-middle whitespace-nowrap">
                                  <span
                                    className={cn(
                                      "px-2 py-0.5 rounded text-[10px] font-medium border",
                                      payInfo.badgeColor
                                    )}
                                  >
                                    {isBangla ? payInfo.bn : payInfo.en}
                                  </span>
                                </td>

                                <td className="py-3 px-3.5 align-middle whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                  {exp.attachmentName ? (
                                    <span
                                      className="inline-flex items-center gap-1 text-[10px] text-indigo-300 hover:text-indigo-200 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 cursor-pointer"
                                      onClick={() =>
                                        toast({
                                          title: isBangla ? "সংযুক্ত ফাইল ওপেন হচ্ছে" : "Viewing Document",
                                          description: exp.attachmentName || undefined,
                                        })
                                      }
                                    >
                                      <Paperclip className="h-3 w-3" />
                                      <span className="max-w-[75px] truncate">{exp.attachmentName}</span>
                                    </span>
                                  ) : (
                                    <span className="text-[11px] text-muted-foreground/60">—</span>
                                  )}
                                </td>
                              </>
                            )}

                            {/* Amount */}
                            <td className="py-3 px-3.5 align-middle text-right whitespace-nowrap">
                              <span className="font-mono font-bold text-rose-400 text-xs">
                                {isBangla
                                  ? `-৳${toBnNum(exp.amount.toLocaleString())}`
                                  : `-৳${exp.amount.toLocaleString()}`}
                              </span>
                            </td>

                            {/* Actions (Only in Full-Width Mode) */}
                            {!selectedExpense && (
                              <td className="py-3 px-3.5 align-middle text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-end gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-md cursor-pointer"
                                    onClick={() => setSelectedExpense(exp)}
                                    title={isBangla ? "বিস্তারিত দেখুন" : "View Details"}
                                  >
                                    <Eye className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-muted-foreground hover:text-rose-400 rounded-md cursor-pointer"
                                    onClick={() => handleDeleteExpense(exp.id)}
                                    title={isBangla ? "মুছে ফেলুন" : "Delete"}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------
              RIGHT COLUMN: EXPENSE DETAILS & HISTORY (Split View Panel)
             ------------------------------------------------------------- */}
          <div
            className={cn(
              "transition-all duration-300 ease-in-out flex flex-col overflow-hidden",
              selectedExpense
                ? "w-full opacity-100 lg:w-1/2 min-h-[500px]"
                : "w-0 h-0 min-h-0 opacity-0 pointer-events-none"
            )}
          >
            {selectedExpense && (
              <div className="rounded-2xl border border-border/80 bg-card/95 shadow-sm backdrop-blur-sm p-6 flex flex-col h-full flex-1 space-y-6">
                {/* Details Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border/80">
                  <div className="flex items-center gap-3.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 h-9 w-9 p-0 flex items-center justify-center rounded-xl hover:bg-muted cursor-pointer"
                      onClick={() => setSelectedExpense(null)}
                      title={isBangla ? "তালিকায় ফিরে যান" : "Back to List"}
                    >
                      <ChevronLeft className="h-5 w-5 text-foreground" />
                    </Button>

                    <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0 border", selectedExpense.bgColor)}>
                      {React.createElement(selectedExpense.icon, { className: "h-6 w-6" })}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-foreground truncate">
                          {isBangla ? selectedExpense.titleBn : selectedExpense.titleEn}
                        </h2>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {isBangla ? "পরিশোধিত" : "PAID"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">
                        {selectedExpense.voucherCode} • {isBangla ? selectedExpense.dateBn : selectedExpense.dateEn}
                      </p>
                    </div>
                  </div>

                  {/* Header Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => copyVoucherCode(selectedExpense.voucherCode)}
                      className="h-8.5 text-xs rounded-xl gap-1.5 cursor-pointer font-mono"
                    >
                      <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{selectedExpense.voucherCode}</span>
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => window.print()}
                      className="h-8.5 text-xs rounded-xl gap-1.5 cursor-pointer"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      <span>{isBangla ? "প্রিন্ট" : "Print"}</span>
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedExpense(null)}
                      className="h-8.5 w-8.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Amount Highlight Card */}
                <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">
                      {isBangla ? "ব্যয়কৃত মোট পরিমাণ" : "TOTAL EXPENSE AMOUNT"}
                    </p>
                    <p className="text-3xl font-extrabold font-mono text-rose-400 tracking-tight">
                      {isBangla
                        ? `-৳${toBnNum(selectedExpense.amount.toLocaleString())}.০০`
                        : `-৳${selectedExpense.amount.toLocaleString()}.00`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-xl bg-card border border-border/80 text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-indigo-400" />
                      <span>{selectedExpense.branch}</span>
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-card border border-border/80 text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <CreditCard className="h-3.5 w-3.5 text-indigo-400" />
                      <span>{PAYMENT_METHOD_MAP[selectedExpense.paymentMethod]?.[isBangla ? "bn" : "en"] || selectedExpense.paymentMethod}</span>
                    </span>
                  </div>
                </div>

                {/* Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Category */}
                  <div className="p-3.5 rounded-xl border border-border/60 bg-muted/10 space-y-1">
                    <p className="text-[11px] font-medium text-muted-foreground">
                      {isBangla ? "ব্যয়ের খাত / ক্যাটাগরি" : "Expense Category"}
                    </p>
                    <div className="flex items-center gap-2 pt-0.5">
                      <Tag className="h-3.5 w-3.5 text-indigo-400" />
                      <span className="font-semibold text-foreground text-xs">
                        {isBangla ? selectedExpense.titleBn : selectedExpense.titleEn}
                      </span>
                    </div>
                  </div>

                  {/* Transaction Date */}
                  <div className="p-3.5 rounded-xl border border-border/60 bg-muted/10 space-y-1">
                    <p className="text-[11px] font-medium text-muted-foreground">
                      {isBangla ? "লেনদেনের তারিখ" : "Transaction Date"}
                    </p>
                    <div className="flex items-center gap-2 pt-0.5">
                      <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                      <span className="font-semibold text-foreground font-mono text-xs">
                        {isBangla ? selectedExpense.dateBn : selectedExpense.dateEn}
                      </span>
                    </div>
                  </div>

                  {/* Branch */}
                  <div className="p-3.5 rounded-xl border border-border/60 bg-muted/10 space-y-1">
                    <p className="text-[11px] font-medium text-muted-foreground">
                      {isBangla ? "ব্রাঞ্চ / শাখা" : "Branch Location"}
                    </p>
                    <div className="flex items-center gap-2 pt-0.5">
                      <Building2 className="h-3.5 w-3.5 text-indigo-400" />
                      <span className="font-semibold text-foreground text-xs">
                        {selectedExpense.branch}
                      </span>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="p-3.5 rounded-xl border border-border/60 bg-muted/10 space-y-1">
                    <p className="text-[11px] font-medium text-muted-foreground">
                      {isBangla ? "পেমেন্ট মাধ্যম" : "Payment Method"}
                    </p>
                    <div className="flex items-center gap-2 pt-0.5">
                      <CreditCard className="h-3.5 w-3.5 text-indigo-400" />
                      <span className="font-semibold text-foreground capitalize text-xs">
                        {PAYMENT_METHOD_MAP[selectedExpense.paymentMethod]?.[isBangla ? "bn" : "en"] || selectedExpense.paymentMethod}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expense Note / Description */}
                <div className="p-4 rounded-xl border border-border/60 bg-muted/10 space-y-1.5 text-xs">
                  <p className="text-[11px] font-medium text-muted-foreground">
                    {isBangla ? "ভাউচার নোট / বিবরণ" : "Expense Note / Description"}
                  </p>
                  <p className="text-xs text-foreground leading-relaxed font-medium">
                    {isBangla ? selectedExpense.subtitleBn : selectedExpense.subtitleEn}
                  </p>
                </div>

                {/* Recurrence Status */}
                <div className="p-4 rounded-xl border border-border/60 bg-muted/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      <RefreshCw className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {isBangla ? "নিয়মিত ব্যয় স্ট্যাটাস" : "Recurrence Setting"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {selectedExpense.isRecurring
                          ? isBangla
                            ? `নিয়মিত পুনরাবৃত্তিমূলক (${selectedExpense.recurringFrequency || "মাসিক"})`
                            : `Recurring schedule (${selectedExpense.recurringFrequency || "monthly"})`
                          : isBangla
                          ? "এককালীন ব্যয় (One-time)"
                          : "One-time expense"}
                      </p>
                    </div>
                  </div>
                  {selectedExpense.isRecurring && (
                    <span className="px-2.5 py-0.5 rounded-md text-[10.5px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                      {isBangla ? "সক্রিয়" : "ACTIVE"}
                    </span>
                  )}
                </div>

                {/* Attachment Document */}
                {selectedExpense.attachmentName ? (
                  <div className="p-4 rounded-xl border border-border/60 bg-muted/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2.5 rounded-xl bg-card border border-border">
                        <Paperclip className="h-4 w-4 text-indigo-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate text-xs">
                          {selectedExpense.attachmentName}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {isBangla ? "সংযুক্ত রসিদ / ভাউচার ফাইল" : "Attached Receipt Voucher File"}
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toast({
                          title: isBangla ? "ডকুমেন্ট ডাউনলোড হচ্ছে" : "Downloading Document",
                          description: selectedExpense.attachmentName || undefined,
                        })
                      }
                      className="h-8.5 text-xs rounded-xl shrink-0 gap-1.5"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>{isBangla ? "ডাউনলোড" : "Download"}</span>
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-dashed border-border/60 bg-muted/5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 text-muted-foreground">
                      <Paperclip className="h-4 w-4" />
                      <span>{isBangla ? "কোন ডকুমেন্ট সংযুক্ত নেই" : "No document attached"}</span>
                    </div>
                  </div>
                )}

                {/* Panel Footer Actions */}
                <div className="pt-4 border-t border-border/80 flex items-center justify-between mt-auto">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteExpense(selectedExpense.id)}
                    className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>{isBangla ? "ভাউচার মুছে ফেলুন" : "Delete Expense"}</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedExpense(null)}
                    className="text-xs rounded-xl px-5 h-8.5 cursor-pointer"
                  >
                    {isBangla ? "বন্ধ করুন" : "Close"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            5. MODALS / DIALOGS (Category Add/Edit & View All Categories)
           ========================================================================= */}
        {/* Add/Edit Category Dialog */}
        <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
          <DialogContent className="sm:max-w-md bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-foreground">
                {editingCategory
                  ? isBangla
                    ? "ক্যাটাগরি সম্পাদনা"
                    : "Edit Category"
                  : isBangla
                  ? "নতুন ক্যাটাগরি তৈরি"
                  : "Add New Category"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  {isBangla ? "ক্যাটাগরির নাম (ইংরেজি)" : "Category Name (English)"} *
                </Label>
                <Input
                  value={categoryFormNameEn}
                  onChange={(e) => setCategoryFormNameEn(e.target.value)}
                  placeholder="e.g. Office Supplies"
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  {isBangla ? "ক্যাটাগরির নাম (বাংলা)" : "Category Name (Bangla)"}
                </Label>
                <Input
                  value={categoryFormNameBn}
                  onChange={(e) => setCategoryFormNameBn(e.target.value)}
                  placeholder="যেমন: অফিস সরঞ্জাম"
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  {isBangla ? "অ্যাকসেন্ট কালার" : "Accent Color"}
                </Label>
                <div className="flex items-center gap-2.5">
                  {["#f43f5e", "#eab308", "#8b5cf6", "#06b6d4", "#22c55e", "#f97316"].map(
                    (col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setCategoryFormColor(col)}
                        style={{ backgroundColor: col }}
                        className={cn(
                          "h-7 w-7 rounded-full transition-transform cursor-pointer",
                          categoryFormColor === col && "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110"
                        )}
                      />
                    )
                  )}
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddCategoryOpen(false)}
                className="text-xs h-9 rounded-xl"
              >
                {isBangla ? "বাতিল" : "Cancel"}
              </Button>
              <Button
                type="button"
                onClick={handleSaveCategoryModal}
                className="text-xs h-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
              >
                {isBangla ? "সংরক্ষণ করুন" : "Save Category"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View All Categories Dialog */}
        <Dialog open={isViewAllCategoriesOpen} onOpenChange={setIsViewAllCategoriesOpen}>
          <DialogContent className="sm:max-w-lg bg-card border-border max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-foreground">
                {isBangla
                  ? `সকল ব্যয় ক্যাটাগরি (${toBnNum(categories.length)}টি)`
                  : `All Expense Categories (${categories.length})`}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              {categories.map((c) => {
                const Icon = c.icon;
                return (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg border", c.bgColor, c.borderColor)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">
                          {isBangla ? c.nameBn : c.nameEn}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold">
                        {isBangla
                          ? `৳${toBnNum(c.amount.toLocaleString())}.০০`
                          : `৳${c.amount.toLocaleString()}.00`}
                      </span>
                      <button
                        onClick={() => handleDeleteCategory(c.id)}
                        className="text-muted-foreground hover:text-rose-400 p-1 cursor-pointer"
                        title={isBangla ? "মুছে ফেলুন" : "Delete"}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
