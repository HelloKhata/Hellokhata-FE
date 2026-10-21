"use client";

import React, { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { PageHeader } from "@/components/common";
import { useToast } from "@/hooks/use-toast";
import { useBranchStore } from "@/stores/branchStore";
import {
  useGetExpenseCategories,
  useCreateExpenseCategories,
  useUpdateExpenseCategory,
  useDeleteExpenseCategory,
  useCreateExpense,
  useUploadExpenseImage,
  useGetExpenses,
  useExpenseSummary,
  useDeletExpense,
} from "@/hooks/api/useExpense";
import { useGetBranches } from "@/hooks/api/useBranches";
import { useGetPaymentMethods } from "@/hooks/api/usePaymentMethod";
import { RecordNewExpense } from "@/components/finance/expenses/RecordNewExpense";
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
  Copy,
  ChevronLeft,
  X,
  CreditCard,
  Tag,
  SlidersHorizontal,
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
export interface ExpenseCategory {
  id: string;
  name: string;
  nameBn?: string;
  icon?: string;
  color?: string;
  isDefault?: boolean;
  amount?: number;
  percentage?: number;
}

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

// Payment Method Labels
const PAYMENT_METHOD_MAP: Record<string, { en: string; bn: string; badgeColor: string }> = {
  cash: { en: "Cash", bn: "ক্যাশ", badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  bank: { en: "Bank Transfer", bn: "ব্যাংক", badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
  bkash: { en: "bKash", bn: "বিকাশ", badgeColor: "bg-pink-500/10 text-pink-400 border-pink-500/20" },
  nagad: { en: "Nagad", bn: "নগদ", badgeColor: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  card: { en: "Card", bn: "কার্ড", badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  cheque: { en: "Cheque", bn: "চেক", badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
};

// Helper icon mapper for category icon string
const getCategoryIcon = (iconName?: string): React.ElementType => {
  switch (iconName?.toLowerCase()) {
    case "home":
    case "rent":
      return Home;
    case "zap":
    case "utilities":
      return Zap;
    case "users":
    case "salary":
      return Users;
    case "package":
    case "inventory":
      return Package;
    case "truck":
    case "transport":
      return Truck;
    case "tool":
    case "maintenance":
    case "wrench":
      return SlidersHorizontal;
    case "card":
    case "credit-card":
      return CreditCard;
    case "tag":
      return Tag;
    default:
      return Layers;
  }
};

export default function ExpensePageContent() {
  const { isBangla } = useAppTranslation();
  const { toast } = useToast();
  const { branches } = useBranchStore();

  // API Queries & Mutations
  const [searchQuery, setSearchQuery] = useState("");
  const [tableCategoryFilter, setTableCategoryFilter] = useState("all");
  const [tableBranchFilter, setTableBranchFilter] = useState("all");

  const { data: expenseCategories = [] } = useGetExpenseCategories();
  const { data: branchesData = [] } = useGetBranches();
  const { data: paymentMethodsData = [] } = useGetPaymentMethods();
  const { data: expenseSummary } = useExpenseSummary();
  const { data: expenses, isLoading: isExpensesLoading } = useGetExpenses({
    search: searchQuery.trim() || undefined,
    categoryId: tableCategoryFilter !== "all" ? tableCategoryFilter : undefined,
  });

  const { mutate: createExpenseCategory, isPending: isCreatingCategory } = useCreateExpenseCategories();
  const { mutate: updateExpenseCategory, isPending: isUpdatingCategory } = useUpdateExpenseCategory();
  const { mutate: deleteExpenseCategory, isPending: isDeletingCategory } = useDeleteExpenseCategory();
  const uploadExpenseImageMutation = useUploadExpenseImage();
  const deleteExpenseMutation = useDeletExpense();

  const [categoryToDelete, setCategoryToDelete] = useState<any | null>(null);
  const [isDeleteCategoryOpen, setIsDeleteCategoryOpen] = useState(false);

  // State
  const [dateRange, setDateRange] = useState("Jul 23, 2026 - Aug 22, 2026");

  // Selected Expense for Split Layout Detail Panel
  const [selectedExpense, setSelectedExpense] = useState<any | null>(null);


  // Modals State
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [categoryFormNameEn, setCategoryFormNameEn] = useState("");
  const [categoryFormNameBn, setCategoryFormNameBn] = useState("");
  const [categoryFormColor, setCategoryFormColor] = useState("#F59E0B");
  const [categoryFormIcon, setCategoryFormIcon] = useState("zap");
  const [isViewAllCategoriesOpen, setIsViewAllCategoriesOpen] = useState(false);


  // Category Add/Edit Actions
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryFormNameEn("");
    setCategoryFormNameBn("");
    setCategoryFormColor("#F59E0B");
    setCategoryFormIcon("zap");
    setIsAddCategoryOpen(true);
  };

  const handleOpenEditCategory = (cat: any) => {
    setEditingCategory(cat);
    setCategoryFormNameEn(cat.name || cat.nameEn || "");
    setCategoryFormNameBn(cat.nameBn || cat.name || "");
    setCategoryFormColor(cat.color || "#F59E0B");
    setCategoryFormIcon(cat.icon || "zap");
    setIsAddCategoryOpen(true);
  };

  const handleSaveCategoryModal = async () => {
    if (!categoryFormNameEn.trim() && !categoryFormNameBn.trim()) {
      toast({
        title: isBangla ? "নাম আবশ্যক" : "Name Required",
        description: isBangla ? "অনুগ্রহ করে ক্যাটাগরির নাম লিখুন।" : "Please enter a category name.",
        variant: "destructive",
      });
      return;
    }

    const enName = categoryFormNameEn.trim() || categoryFormNameBn.trim();
    const bnName = categoryFormNameBn.trim() || categoryFormNameEn.trim();

    if (editingCategory) {
      const payload = {
        name: enName,
        nameBn: bnName,
        icon: categoryFormIcon || "zap",
        color: categoryFormColor || "#F59E0B",
      };

      updateExpenseCategory(
        { id: editingCategory.id, data: payload },
        {
          onSuccess: () => {
            toast({
              title: isBangla ? "ক্যাটাগরি আপডেট হয়েছে" : "Category Updated",
              description: isBangla ? bnName : enName,
            });
            setIsAddCategoryOpen(false);
            setEditingCategory(null);
          },
          onError: (err: any) => {
            toast({
              title: isBangla ? "আপডেট ব্যর্থ হয়েছে" : "Failed to update category",
              description:
                err?.response?.data?.message ||
                err?.message ||
                (isBangla ? "অনুগ্রহ করে আবার চেষ্টা করুন" : "Please try again."),
              variant: "destructive",
            });
          },
        }
      );
    } else {
      const payload = {
        name: enName,
        nameBn: bnName,
        icon: categoryFormIcon || "zap",
        color: categoryFormColor || "#F59E0B",
      };

      createExpenseCategory(payload, {
        onSuccess: () => {
          toast({
            title: isBangla ? "নতুন ক্যাটাগরি তৈরি হয়েছে" : "Category Added",
            description: isBangla ? bnName : enName,
          });
          setIsAddCategoryOpen(false);
        },
        onError: (err: any) => {
          toast({
            title: isBangla ? "ক্যাটাগরি তৈরি ব্যর্থ হয়েছে" : "Failed to create category",
            description:
              err?.response?.data?.message ||
              err?.message ||
              (isBangla ? "অনুগ্রহ করে আবার চেষ্টা করুন" : "Please try again."),
            variant: "destructive",
          });
        },
      });
    }
  };

  const handlePromptDeleteCategory = (cat: any) => {
    setCategoryToDelete(cat);
    setIsDeleteCategoryOpen(true);
  };

  const handleConfirmDeleteCategory = () => {
    if (!categoryToDelete) return;
    deleteExpenseCategory(categoryToDelete.id, {
      onSuccess: () => {
        toast({
          title: isBangla ? "ক্যাটাগরি মুছে ফেলা হয়েছে" : "Category Deleted",
          description: isBangla
            ? `${categoryToDelete.nameBn || categoryToDelete.name || "ক্যাটাগরি"} সফলভাবে মুছে ফেলা হয়েছে`
            : `${categoryToDelete.name || "Category"} removed successfully`,
        });
        setIsDeleteCategoryOpen(false);
        setCategoryToDelete(null);
      },
      onError: (err: any) => {
        toast({
          title: isBangla ? "মুছে ফেলা ব্যর্থ হয়েছে" : "Failed to delete category",
          description:
            err?.response?.data?.message ||
            err?.message ||
            (isBangla ? "অনুগ্রহ করে আবার চেষ্টা করুন" : "Please try again"),
          variant: "destructive",
        });
      },
    });
  };

  const handleDeleteExpense = async (expId: string) => {
    // console.log()
  };

  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: isBangla ? "কপি করা হয়েছে" : "Copied to Clipboard",
      description: code,
    });
  };

  const handleExportExpensesCSV = () => {
    if (!expenses || expenses.length === 0) {
      toast({
        title: isBangla ? "কোন তথ্য নেই" : "No data to export",
        description: isBangla ? "ডাউনলোড করার মত কোন রেকর্ড নেই" : "No records available to download",
        variant: "destructive",
      });
      return;
    }
    const headers = [
      isBangla ? "ভাউচার" : "Voucher",
      isBangla ? "তারিখ" : "Date",
      isBangla ? "খাত" : "Category",
      isBangla ? "বিবরণ" : "Description",
      isBangla ? "শাখা" : "Branch",
      isBangla ? "পেমেন্ট পদ্ধতি" : "Payment Method",
      isBangla ? "পরিমাণ (৳)" : "Amount (BDT)",
    ];
    const rows = expenses.map((exp: any) => [
      exp.voucherCode || (exp.id ? `EXP-${exp.id.slice(-6).toUpperCase()}` : "EXP-0000"),
      exp.date || (exp.createdAt ? format(new Date(exp.createdAt), "yyyy-MM-dd") : ""),
      `"${((exp.category?.nameBn || exp.category?.name || "Expense")).replace(/"/g, '""')}"`,
      `"${((exp.description || exp.note || "")).replace(/"/g, '""')}"`,
      `"${((exp.branch?.name || "Main Branch")).replace(/"/g, '""')}"`,
      exp.account?.name || exp.paymentMethod || "cash",
      typeof exp.amount === "number" ? exp.amount : parseFloat(exp.amount) || 0,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e: any[]) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `expense-records-${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: isBangla ? "ডাউনলোড সম্পন্ন" : "Download Complete",
      description: isBangla
        ? "ব্যয় তালিকা সফলভাবে ডাউনলোড হয়েছে।"
        : "Expense records downloaded successfully.",
    });
  };

  return (
    <TooltipProvider>
      <div className="space-y-6 mx-auto pb-24 text-foreground">
        {/* =========================================================================
            1. HEADER SECTION
           ========================================================================= */}
        <PageHeader
          title={isBangla ? "ব্যয়ের হিসাব" : "Expenses"}
          subtitle={isBangla
            ? "আপনার ব্যবসায়িক সকল খরচ ট্র্যাক, পরিচালনা এবং বিশদ বিশ্লেষণ করুন"
            : "Track, manage and analyze your business expenses"}
          showBack
          actions={
            <div className="hidden md:flex items-center flex-wrap gap-2.5">
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
          }
        />

        {/* =========================================================================
            2. TOP STATS CARDS (4 METRICS IN ROW)
           ========================================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {/* Card 1: Total Today */}
          <div className="rounded-xl sm:rounded-2xl border border-border/70 bg-card/90 p-2.5 sm:p-4.5 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-emerald-500/40 transition-all">
            <div className="flex items-start justify-between">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                <Receipt className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5" />
              </div>
            </div>

            <div className="mt-2 sm:mt-3 space-y-0.5 sm:space-y-1 z-10">
              <div className="flex items-center gap-1 text-[10px] sm:text-[11.5px] font-medium text-muted-foreground">
                <span className="truncate">{isBangla ? "আজকের মোট ব্যয়" : expenseSummary?.today?.label || "Today's Expense"}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground/60 cursor-help shrink-0" />
                  </TooltipTrigger>
                  <TooltipContent>
                    {isBangla ? "আজকে এন্ট্রি করা মোট খরচ" : "Expenses recorded today"}
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-base sm:text-2xl font-bold font-mono text-foreground tracking-tight">
                {isBangla
                  ? `৳${toBnNum((expenseSummary?.today?.total ?? 0).toLocaleString())}.০০`
                  : `৳${(expenseSummary?.today?.total ?? 0).toLocaleString()}.00`}
              </p>
              <p
                className={cn(
                  "text-[10px] sm:text-[11px] font-semibold flex items-center gap-1",
                  (expenseSummary?.today?.change ?? 0) <= 0 ? "text-emerald-400" : "text-rose-400"
                )}
              >
                <span className="truncate">
                  {isBangla
                    ? `${expenseSummary?.today?.changeLabel === "vs Yesterday" ? "গতকালের চেয়ে" : expenseSummary?.today?.changeLabel || "গতকালের চেয়ে"} ${(expenseSummary?.today?.change ?? 0) >= 0 ? "+" : ""}${toBnNum(expenseSummary?.today?.change ?? 0)}%`
                    : `${expenseSummary?.today?.changeLabel || "vs Yesterday"} ${(expenseSummary?.today?.change ?? 0) >= 0 ? "+" : ""}${expenseSummary?.today?.change ?? 0}%`}
                </span>
                <span>{(expenseSummary?.today?.change ?? 0) >= 0 ? "↑" : "↓"}</span>
              </p>
            </div> 

            {/* Sparkline Wave */}
            <div className="hidden sm:block absolute right-2 bottom-2 w-28 h-12 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 100 40" className="w-full h-full stroke-emerald-400 stroke-[2.5] fill-none drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">
                <path d="M 5,32 Q 25,28 45,18 T 75,14 T 95,8" strokeLinecap="round" />
              </svg>
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Card 2: Total This Month */}
          <div className="rounded-xl sm:rounded-2xl border border-border/70 bg-card/90 p-2.5 sm:p-4.5 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-sky-500/40 transition-all">
            <div className="flex items-start justify-between">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/20">
                <Calendar className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5" />
              </div>
            </div>

            <div className="mt-2 sm:mt-3 space-y-0.5 sm:space-y-1 z-10">
              <div className="flex items-center gap-1 text-[10px] sm:text-[11.5px] font-medium text-muted-foreground">
                <span className="truncate">{isBangla ? "এই মাসের মোট ব্যয়" : expenseSummary?.thisMonth?.label || "This Month"}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground/60 cursor-help shrink-0" />
                  </TooltipTrigger>
                  <TooltipContent>
                    {isBangla ? "চলতি মাসের মোট খরচ" : "Expenses recorded in current month"}
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-base sm:text-2xl font-bold font-mono text-foreground tracking-tight">
                {isBangla
                  ? `৳${toBnNum((expenseSummary?.thisMonth?.total ?? 0).toLocaleString())}.০০`
                  : `৳${(expenseSummary?.thisMonth?.total ?? 0).toLocaleString()}.00`}
              </p>
              <p
                className={cn(
                  "text-[10px] sm:text-[11px] font-semibold flex items-center gap-1",
                  (expenseSummary?.thisMonth?.change ?? 0) <= 0 ? "text-emerald-400" : "text-rose-400"
                )}
              >
                <span className="truncate">
                  {isBangla
                    ? `${expenseSummary?.thisMonth?.changeLabel === "vs Last Month" ? "গত মাসের চেয়ে" : expenseSummary?.thisMonth?.changeLabel || "গত মাসের চেয়ে"} ${(expenseSummary?.thisMonth?.change ?? 0) >= 0 ? "+" : ""}${toBnNum(expenseSummary?.thisMonth?.change ?? 0)}%`
                    : `${expenseSummary?.thisMonth?.changeLabel || "vs Last Month"} ${(expenseSummary?.thisMonth?.change ?? 0) >= 0 ? "+" : ""}${expenseSummary?.thisMonth?.change ?? 0}%`}
                </span>
                <span>{(expenseSummary?.thisMonth?.change ?? 0) >= 0 ? "↑" : "↓"}</span>
              </p>
            </div>

            {/* Sparkline Wave */}
            <div className="hidden sm:block absolute right-2 bottom-2 w-28 h-12 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 100 40" className="w-full h-full stroke-sky-400 stroke-[2.5] fill-none drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]">
                <path d="M 5,30 Q 30,35 50,22 T 75,20 T 95,12" strokeLinecap="round" />
              </svg>
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/5 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Card 3: Total This Year */}
          <div className="rounded-xl sm:rounded-2xl border border-border/70 bg-card/90 p-2.5 sm:p-4.5 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-purple-500/40 transition-all">
            <div className="flex items-start justify-between">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/20">
                <BarChart3 className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5" />
              </div>
            </div>

            <div className="mt-2 sm:mt-3 space-y-0.5 sm:space-y-1 z-10">
              <div className="flex items-center gap-1 text-[10px] sm:text-[11.5px] font-medium text-muted-foreground">
                <span className="truncate">{isBangla ? "সর্বমোট ব্যয়" : expenseSummary?.allTime?.label || "Total Expenses"}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground/60 cursor-help shrink-0" />
                  </TooltipTrigger>
                  <TooltipContent>
                    {isBangla ? "সর্বমোট আদায়কৃত ব্যয়" : "All-time total expenses"}
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-base sm:text-2xl font-bold font-mono text-foreground tracking-tight">
                {isBangla
                  ? `৳${toBnNum((expenseSummary?.allTime?.total ?? 0).toLocaleString())}.০০`
                  : `৳${(expenseSummary?.allTime?.total ?? 0).toLocaleString()}.00`}
              </p>
              <p className="text-[10px] sm:text-[11px] font-semibold text-emerald-400 flex items-center gap-1 font-mono">
                <span className="truncate">
                  {expenseSummary?.allTime?.avgExpense !== undefined && expenseSummary?.allTime?.avgExpense !== null
                    ? isBangla
                      ? `গড়: ৳${toBnNum((expenseSummary.allTime.avgExpense ?? 0).toLocaleString())}`
                      : `Avg: ৳${(expenseSummary.allTime.avgExpense ?? 0).toLocaleString()}`
                    : isBangla
                    ? "সর্বমোট হিসাব"
                    : "Live overview"}
                </span>
                <span>•</span>
              </p>
            </div>

            {/* Sparkline Wave */}
            <div className="hidden sm:block absolute right-2 bottom-2 w-28 h-12 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 100 40" className="w-full h-full stroke-purple-400 stroke-[2.5] fill-none drop-shadow-[0_0_8px_rgba(192,132,252,0.4)]">
                <path d="M 5,34 Q 30,24 50,30 T 75,18 T 95,6" strokeLinecap="round" />
              </svg>
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Card 4: Total Entries */}
          <div className="rounded-xl sm:rounded-2xl border border-border/70 bg-card/90 p-2.5 sm:p-4.5 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-amber-500/40 transition-all">
            <div className="flex items-start justify-between">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/20">
                <FileText className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5" />
              </div>
            </div>

            <div className="mt-2 sm:mt-3 space-y-0.5 sm:space-y-1 z-10">
              <div className="flex items-center gap-1 text-[10px] sm:text-[11.5px] font-medium text-muted-foreground">
                <span className="truncate">{isBangla ? "মোট এন্ট্রি সংখ্যা" : "Total Entries"}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground/60 cursor-help shrink-0" />
                  </TooltipTrigger>
                  <TooltipContent>
                    {isBangla ? "দাখিলকৃত মোট ভাউচার সংখ্যা" : "Number of expense vouchers entered"}
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-base sm:text-2xl font-bold font-mono text-foreground tracking-tight">
                {isBangla
                  ? toBnNum(expenseSummary?.allTime?.count ?? 0)
                  : (expenseSummary?.allTime?.count ?? 0)}
              </p>
              <p className="text-[10px] sm:text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                <span className="truncate">
                  {isBangla
                    ? `এই মাসে +${toBnNum(expenseSummary?.thisMonth?.count ?? 0)}টি`
                    : `This month: +${expenseSummary?.thisMonth?.count ?? 0}`}
                </span>
                <span>↑</span>
              </p>
            </div>

            {/* Sparkline Wave */}
            <div className="hidden sm:block absolute right-2 bottom-2 w-28 h-12 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
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
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* -------------------------------------------------------------
              LEFT: RECORD NEW EXPENSE FORM (Col Span 7)
             ------------------------------------------------------------- */}
          <RecordNewExpense
            expenseCategories={expenseCategories}
            branchesData={branchesData}
            paymentMethodsData={paymentMethodsData}
            isBangla={isBangla}
            onOpenAddCategory={handleOpenAddCategory}
          />

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
                {expenseCategories?.slice(0, 5).map((cat: any) => {
                  const Icon = getCategoryIcon(cat.icon || cat.name);
                  const color = cat.color || "#14B8A6";
                  const percentage = cat.percentage || 0;
                  const amount = cat.amount || 0;
                  const nameBn = cat.nameBn || cat.name || "ব্যয়";
                  const nameEn = cat.name || "Expense";
                  return (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between gap-3 text-xs group"
                    >
                      {/* Left: Icon + Names */}
                      <div className="flex items-center gap-2.5 w-28 shrink-0 min-w-0">
                        <div
                          className={cn(
                            "p-1.5 rounded-lg border shrink-0 bg-indigo-500/15 text-indigo-400 border-indigo-500/20"
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0 truncate">
                          <p className="font-bold text-foreground truncate">
                            {isBangla ? nameBn : nameEn}
                          </p>
                        </div>
                      </div>

                      {/* Center: Sleek Progress Bar */}
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-muted/40 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: color,
                            }}
                          />
                        </div>
                        <span className="text-[11px] font-mono text-muted-foreground w-8 text-right shrink-0">
                          {isBangla ? `${toBnNum(percentage)}%` : `${percentage}%`}
                        </span>
                      </div>

                      {/* Right: Amount & Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono font-bold text-foreground text-xs">
                          {isBangla
                            ? `৳${toBnNum((amount ?? 0).toLocaleString())}.০০`
                            : `৳${(amount ?? 0).toLocaleString()}.00`}
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
                            onClick={() => handlePromptDeleteCategory(cat)}
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
              </div>

              {/* Donut Chart and Legend */}
              {(() => {
                const colors = ["#f43f5e", "#eab308", "#8b5cf6", "#06b6d4", "#22c55e", "#ec4899", "#3b82f6", "#14B8A6"];
                const topCats = expenseSummary?.topCategories && Array.isArray(expenseSummary.topCategories) && expenseSummary.topCategories.length > 0
                  ? expenseSummary.topCategories.map((tc: any, index: number) => ({
                      nameEn: tc.name || tc.category?.name || "Expense",
                      nameBn: tc.nameBn || tc.category?.nameBn || tc.name || "ব্যয়",
                      value: Number(tc.total ?? tc.amount ?? 0),
                      percentage: `${tc.percentage ?? 0}%`,
                      color: tc.color || tc.category?.color || colors[index % colors.length],
                    }))
                  : expenseCategories && Array.isArray(expenseCategories) && expenseCategories.length > 0
                  ? expenseCategories.slice(0, 6).map((cat: any, index: number) => ({
                      nameEn: cat.name || "Expense",
                      nameBn: cat.nameBn || cat.name || "ব্যয়",
                      value: Number(cat.amount ?? 0),
                      percentage: `${cat.percentage ?? 0}%`,
                      color: cat.color || colors[index % colors.length],
                    }))
                  : [];

                const totalVal = expenseSummary?.thisMonth?.total ?? expenseSummary?.allTime?.total ?? 0;

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    {/* Donut Chart (Col Span 5) */}
                    <div className="sm:col-span-5 h-40 relative flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={topCats.length > 0 ? topCats : [{ nameEn: "No Data", nameBn: "তথ্য নেই", value: 1, color: "#334155" }]}
                            cx="50%"
                            cy="50%"
                            innerRadius={44}
                            outerRadius={62}
                            paddingAngle={topCats.length > 0 ? 3 : 0}
                            dataKey="value"
                          >
                            {(topCats.length > 0 ? topCats : [{ color: "#334155" }]).map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>

                      {/* Center Text inside Donut */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                        <span className="text-sm font-extrabold font-mono text-foreground leading-none">
                          {isBangla ? `৳${toBnNum((totalVal ?? 0).toLocaleString())}` : `৳${(totalVal ?? 0).toLocaleString()}`}
                        </span>
                        <span className="text-[9.5px] text-muted-foreground mt-0.5">
                          {isBangla ? "মোট ব্যয়" : "Total Expense"}
                        </span>
                      </div>
                    </div>

                    {/* Legend List (Col Span 7) */}
                    <div className="sm:col-span-7 grid grid-cols-1 gap-y-1.5 text-[11px]">
                      {topCats.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic">
                          {isBangla ? "কোন ক্যাটাগরি তথ্য নেই" : "No category data"}
                        </p>
                      ) : (
                        topCats.map((item: any) => (
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
                                ? `৳${toBnNum((item.value ?? 0).toLocaleString())}`
                                : `৳${(item.value ?? 0).toLocaleString()}`}{" "}
                              <span className="text-muted-foreground text-[10px]">
                                ({isBangla ? toBnNum(item.percentage) : item.percentage})
                              </span>
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })()}
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
              <div className="p-3.5 sm:p-5 pb-3 sm:pb-4 border-b border-border/80 flex flex-row items-center justify-between gap-2 bg-muted/10">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <Receipt className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-rose-500 shrink-0" />
                    <h3 className="text-sm sm:text-base font-bold text-foreground truncate">
                      {isBangla
                        ? `ব্যয়ের তালিকা (${toBnNum(expenses?.length || 0)})`
                        : `Expenses (${expenses?.length || 0})`}
                    </h3>
                  </div>
                  <p className="text-[11px] sm:text-xs text-muted-foreground hidden sm:block">
                    {isBangla
                      ? "বিস্তারিত দেখতে তালিকায় ক্লিক করুন"
                      : "Click any item to view full details"}
                  </p>
                </div>

                {!selectedExpense && (
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => window.print()}
                      className="hidden md:flex h-8 text-xs rounded-xl gap-1.5 cursor-pointer px-2.5 sm:px-3"
                      title={isBangla ? "প্রিন্ট" : "Print"}
                    >
                      <Printer className="h-3.5 w-3.5" />
                      <span>{isBangla ? "প্রিন্ট" : "Print"}</span>
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setIsRecordModalOpen(true)}
                      className="md:hidden h-8 px-2.5 sm:px-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>{isBangla ? "নতুন ব্যয়" : "New Expense"}</span>
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
                      {expenseCategories?.map((c: any) => (
                        <SelectItem key={c.id} value={c.id}>
                          {isBangla ? (c.nameBn || c.name) : (c.name || c.nameBn)}
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
                      {branchesData?.map((b: any) => (
                        <SelectItem key={b.id} value={b.name}>
                          {isBangla ? (b.nameBn || b.name) : b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Table / List View */}
              <div className="overflow-x-auto flex-1">
                {isExpensesLoading ? (
                  <div className="py-16 text-center space-y-3">
                    <Loader2 className="h-8 w-8 text-indigo-400 animate-spin mx-auto" />
                    <p className="text-xs text-muted-foreground">
                      {isBangla ? "ব্যয়ের তালিকা লোড হচ্ছে..." : "Loading expenses..."}
                    </p>
                  </div>
                ) : expenses.length === 0 ? (
                  <div className="py-16 text-center space-y-2">
                    <Receipt className="h-10 w-10 text-muted-foreground/40 mx-auto" />
                    <p className="text-sm font-semibold text-foreground">
                      {isBangla ? "কোন ব্যয়ের রেকর্ড নেই" : "No Expenses Found"}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="hidden md:block">
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
                      {expenses.map((exp: any) => {
                        const Icon = getCategoryIcon(exp.category?.icon || exp.category?.name);
                        const isSelected = selectedExpense?.id === exp.id;
                        const catNameEn = exp.category?.name || "Expense";
                        const catNameBn = exp.category?.nameBn || catNameEn;
                        const catColor = exp.category?.color || "#F59E0B";
                        const voucherCode = exp.voucherCode || (exp.id ? `EXP-${exp.id.slice(-6).toUpperCase()}` : "EXP-000000");
                        const branchName = exp.branch?.name || branchesData?.find((b: any) => b.id === exp.branchId)?.name || "Main Branch";
                        const paymentMethodKey = exp.account?.type || exp.paymentMethod || "cash";
                        const payInfo = PAYMENT_METHOD_MAP[paymentMethodKey] || {
                          en: exp.account?.name || paymentMethodKey,
                          bn: exp.account?.name || paymentMethodKey,
                          badgeColor: "bg-muted text-muted-foreground",
                        };
                        const dateObj = exp.date ? new Date(exp.date) : new Date(exp.createdAt || Date.now());
                        const validDate = isNaN(dateObj.getTime()) ? new Date() : dateObj;
                        const dateEn = format(validDate, "MMM dd, yyyy");
                        const dateBn = formatBnDate(validDate);
                        const amountVal = typeof exp.amount === "number" ? exp.amount : parseFloat(exp.amount) || 0;
                        const description = exp.description || exp.note || "—";
                        const attachment = exp.receipt
                          ? typeof exp.receipt === "string"
                            ? exp.receipt.split("/").pop()
                            : "receipt.jpg"
                          : null;

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
                                <div
                                  className="p-2 rounded-xl shrink-0 border"
                                  style={{
                                    backgroundColor: `${catColor}15`,
                                    borderColor: `${catColor}30`,
                                    color: catColor,
                                  }}
                                >
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <p className="font-mono font-bold text-foreground text-xs leading-tight group-hover:text-indigo-400 transition-colors">
                                      {voucherCode}
                                    </p>
                                    <span className="text-[10px] text-muted-foreground">
                                      • {isBangla ? catNameBn : catNameEn}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-muted-foreground truncate max-w-[200px] mt-0.5">
                                    {description}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground/80 flex items-center gap-1 mt-0.5 font-mono">
                                    <Clock className="h-2.5 w-2.5" />
                                    <span>{isBangla ? dateBn : dateEn}</span>
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
                                    {branchName}
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
                                  {attachment ? (
                                    <span
                                      className="inline-flex items-center gap-1 text-[10px] text-indigo-300 hover:text-indigo-200 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 cursor-pointer"
                                      onClick={() => {
                                        if (typeof exp.receipt === "string") {
                                          window.open(exp.receipt, "_blank");
                                        } else {
                                          toast({
                                            title: isBangla ? "সংযুক্ত ফাইল" : "Attached Document",
                                            description: attachment,
                                          });
                                        }
                                      }}
                                    >
                                      <Paperclip className="h-3 w-3" />
                                      <span className="max-w-[75px] truncate">{attachment}</span>
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
                                  ? `-৳${toBnNum(amountVal.toLocaleString())}`
                                  : `-৳${amountVal.toLocaleString()}`}
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
                </div>

                {/* Mobile List Cards View */}
                <div className="md:hidden">
                  {/* Top of List Bar: Download Button */}
                  <div className="px-3.5 py-2 bg-muted/20 border-b border-border/60 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      {isBangla
                        ? `মোট রেকর্ড: ${toBnNum(expenses.length)}`
                        : `Total Records: ${expenses.length}`}
                    </span>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs rounded-lg gap-1.5 cursor-pointer px-2.5 bg-card border-border/80 hover:bg-muted/50 text-foreground shadow-2xs font-medium"
                        >
                          <Download className="h-3.5 w-3.5 text-rose-500" />
                          <span>{isBangla ? "ডাউনলোড" : "Download"}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-card border-border shadow-lg">
                        <DropdownMenuItem onClick={handleExportExpensesCSV} className="cursor-pointer py-2">
                          <Download className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                          <span>{isBangla ? "CSV ফাইল ডাউনলোড (.csv)" : "Download CSV (.csv)"}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.print()} className="cursor-pointer py-2">
                          <Printer className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                          <span>{isBangla ? "PDF / প্রিন্ট কপি" : "Print / PDF Document"}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="divide-y divide-border/60">
                  {expenses.map((exp: any) => {
                    const Icon = getCategoryIcon(exp.category?.icon || exp.category?.name);
                    const isSelected = selectedExpense?.id === exp.id;
                    const catNameEn = exp.category?.name || "Expense";
                    const catNameBn = exp.category?.nameBn || catNameEn;
                    const catColor = exp.category?.color || "#F59E0B";
                    const voucherCode = exp.voucherCode || (exp.id ? `EXP-${exp.id.slice(-6).toUpperCase()}` : "EXP-000000");
                    const branchName = exp.branch?.name || branchesData?.find((b: any) => b.id === exp.branchId)?.name || "Main Branch";
                    const paymentMethodKey = exp.account?.type || exp.paymentMethod || "cash";
                    const payInfo = PAYMENT_METHOD_MAP[paymentMethodKey] || {
                      en: exp.account?.name || paymentMethodKey,
                      bn: exp.account?.name || paymentMethodKey,
                      badgeColor: "bg-muted text-muted-foreground",
                    };
                    const dateObj = exp.date ? new Date(exp.date) : new Date(exp.createdAt || Date.now());
                    const validDate = isNaN(dateObj.getTime()) ? new Date() : dateObj;
                    const dateEn = format(validDate, "MMM dd, yyyy");
                    const dateBn = formatBnDate(validDate);
                    const amountVal = typeof exp.amount === "number" ? exp.amount : parseFloat(exp.amount) || 0;
                    const description = exp.description || exp.note || "—";
                    const attachment = exp.receipt
                      ? typeof exp.receipt === "string"
                        ? exp.receipt.split("/").pop()
                        : "receipt.jpg"
                      : null;

                    return (
                      <div
                        key={exp.id}
                        onClick={() => setSelectedExpense(exp)}
                        className={cn(
                          "p-3.5 space-y-2.5 hover:bg-muted/30 transition-colors cursor-pointer",
                          isSelected ? "bg-indigo-500/10 border-l-2 border-indigo-500" : ""
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className="p-1.5 rounded-lg shrink-0 border"
                              style={{
                                backgroundColor: `${catColor}15`,
                                borderColor: `${catColor}30`,
                                color: catColor,
                              }}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-mono font-bold text-foreground text-xs">
                                  {voucherCode}
                                </span>
                                <span className="text-[10px] text-muted-foreground font-medium truncate">
                                  • {isBangla ? catNameBn : catNameEn}
                                </span>
                              </div>
                              <p className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono mt-0.5">
                                <Clock className="h-2.5 w-2.5" />
                                <span>{isBangla ? dateBn : dateEn}</span>
                              </p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-mono font-bold text-rose-400 text-xs sm:text-sm">
                              {isBangla
                                ? `-৳${toBnNum(amountVal.toLocaleString())}`
                                : `-৳${amountVal.toLocaleString()}`}
                            </span>
                          </div>
                        </div>

                        {description && description !== "—" && (
                          <p className="text-xs text-muted-foreground line-clamp-2 pl-0.5">
                            {description}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-1 border-t border-border/40 gap-2 text-[11px] text-muted-foreground">
                          <div className="flex items-center gap-2 flex-wrap min-w-0">
                            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground truncate">
                              <Building2 className="h-3 w-3 shrink-0" />
                              <span className="truncate">{branchName}</span>
                            </span>
                            <span
                              className={cn(
                                "px-1.5 py-0.5 rounded text-[9px] font-medium border shrink-0",
                                payInfo.badgeColor
                              )}
                            >
                              {isBangla ? payInfo.bn : payInfo.en}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                            {attachment && (
                              <span
                                className="inline-flex items-center gap-1 text-[10px] text-indigo-300 hover:text-indigo-200 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20 cursor-pointer"
                                onClick={() => {
                                  if (typeof exp.receipt === "string") {
                                    window.open(exp.receipt, "_blank");
                                  } else {
                                    toast({
                                      title: isBangla ? "সংযুক্ত ফাইল" : "Attached Document",
                                      description: attachment,
                                    });
                                  }
                                }}
                              >
                                <Paperclip className="h-3 w-3" />
                              </span>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground hover:text-foreground rounded cursor-pointer"
                              onClick={() => setSelectedExpense(exp)}
                              title={isBangla ? "বিস্তারিত দেখুন" : "View Details"}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground hover:text-rose-400 rounded cursor-pointer"
                              onClick={() => handleDeleteExpense(exp.id)}
                              title={isBangla ? "মুছে ফেলুন" : "Delete"}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
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
            {selectedExpense && (() => {
              const SelIcon = getCategoryIcon(selectedExpense.category?.icon || selectedExpense.category?.name);
              const selCatNameEn = selectedExpense.category?.name || selectedExpense.titleEn || "Expense";
              const selCatNameBn = selectedExpense.category?.nameBn || selectedExpense.titleBn || selCatNameEn;
              const selCatColor = selectedExpense.category?.color || selectedExpense.color || "#F59E0B";
              const selVoucherCode = selectedExpense.voucherCode || (selectedExpense.id ? `EXP-${selectedExpense.id.slice(-6).toUpperCase()}` : "EXP-000000");
              const selBranch = selectedExpense.branch?.name || selectedExpense.branch || branchesData?.find((b: any) => b.id === selectedExpense.branchId)?.name || "Main Branch";
              const selPaymentMethodKey = selectedExpense.account?.type || selectedExpense.paymentMethod || "cash";
              const selPaymentLabel = PAYMENT_METHOD_MAP[selPaymentMethodKey]?.[isBangla ? "bn" : "en"] || selectedExpense.account?.name || selPaymentMethodKey;
              const selDateObj = selectedExpense.date ? new Date(selectedExpense.date) : new Date(selectedExpense.createdAt || Date.now());
              const selValidDate = isNaN(selDateObj.getTime()) ? new Date() : selDateObj;
              const selDateEn = format(selValidDate, "MMM dd, yyyy");
              const selDateBn = formatBnDate(selValidDate);
              const selAmount = typeof selectedExpense.amount === "number" ? selectedExpense.amount : parseFloat(selectedExpense.amount) || 0;
              const selDescription = selectedExpense.description || selectedExpense.note || selectedExpense.subtitleBn || selectedExpense.subtitleEn || "—";
              const selAttachment = selectedExpense.receipt ? (typeof selectedExpense.receipt === "string" ? selectedExpense.receipt.split("/").pop() : "receipt.jpg") : null;
              const selReceiptUrl = typeof selectedExpense.receipt === "string" ? selectedExpense.receipt : null;

              return (
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

                      <div
                        className="h-12 w-12 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0 border"
                        style={{
                          backgroundColor: `${selCatColor}15`,
                          borderColor: `${selCatColor}30`,
                          color: selCatColor,
                        }}
                      >
                        <SelIcon className="h-6 w-6" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-bold text-foreground truncate">
                            {isBangla ? selCatNameBn : selCatNameEn}
                          </h2>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {isBangla ? "পরিশোধিত" : "PAID"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">
                          {selVoucherCode} • {isBangla ? selDateBn : selDateEn}
                        </p>
                      </div>
                    </div>

                    {/* Header Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => copyVoucherCode(selVoucherCode)}
                        className="h-8.5 text-xs rounded-xl gap-1.5 cursor-pointer font-mono"
                      >
                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{selVoucherCode}</span>
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
                          ? `-৳${toBnNum(selAmount.toLocaleString())}.০০`
                          : `-৳${selAmount.toLocaleString()}.00`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-xl bg-card border border-border/80 text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-indigo-400" />
                        <span>{selBranch}</span>
                      </span>
                      <span className="px-3 py-1.5 rounded-xl bg-card border border-border/80 text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <CreditCard className="h-3.5 w-3.5 text-indigo-400" />
                        <span>{selPaymentLabel}</span>
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
                          {isBangla ? selCatNameBn : selCatNameEn}
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
                          {isBangla ? selDateBn : selDateEn}
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
                          {selBranch}
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
                          {selPaymentLabel}
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
                      {selDescription}
                    </p>
                  </div>

                  {/* Attachment Document */}
                  {selAttachment ? (
                    <div className="p-4 rounded-xl border border-border/60 bg-muted/10 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2.5 rounded-xl bg-card border border-border">
                          <Paperclip className="h-4 w-4 text-indigo-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate text-xs">
                            {selAttachment}
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
                        onClick={() => {
                          if (selReceiptUrl) {
                            window.open(selReceiptUrl, "_blank");
                          } else {
                            toast({
                              title: isBangla ? "ডকুমেন্ট ডাউনলোড হচ্ছে" : "Downloading Document",
                              description: selAttachment || undefined,
                            });
                          }
                        }}
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
              );
            })()}
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
                  placeholder="e.g. Utilities"
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
                  placeholder="যেমন: ইউটিলিটি"
                  className="h-9 text-xs"
                />
              </div>

              {/* Icon Selector */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  {isBangla ? "আইকন নির্বাচন" : "Select Icon"}
                </Label>
                <div className="grid grid-cols-6 gap-2">
                  {[
                    { id: "zap", label: "Zap", icon: Zap },
                    { id: "tool", label: "Tool", icon: SlidersHorizontal },
                    { id: "home", label: "Home", icon: Home },
                    { id: "users", label: "Salary", icon: Users },
                    { id: "package", label: "Supplies", icon: Package },
                    { id: "truck", label: "Transport", icon: Truck },
                    { id: "card", label: "Card", icon: CreditCard },
                    { id: "tag", label: "Tag", icon: Tag },
                    { id: "layers", label: "Other", icon: Layers },
                  ].map((item) => {
                    const IconComp = item.icon;
                    const isSelected = categoryFormIcon === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setCategoryFormIcon(item.id)}
                        className={cn(
                          "flex flex-col items-center justify-center p-2 rounded-xl border text-xs transition-all cursor-pointer",
                          isSelected
                            ? "border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary"
                            : "border-border/70 bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                        )}
                      >
                        <IconComp className="h-4 w-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Accent Color */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  {isBangla ? "কালার থিম" : "Color Theme"}
                </Label>
                <div className="flex items-center gap-2.5">
                  {["#F59E0B", "#14B8A6", "#8B5CF6", "#F43F5E", "#06B6D4", "#22C55E", "#EC4899", "#3B82F6"].map(
                    (col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setCategoryFormColor(col)}
                        style={{ backgroundColor: col }}
                        className={cn(
                          "h-7 w-7 rounded-full transition-transform cursor-pointer shadow-xs",
                          categoryFormColor.toLowerCase() === col.toLowerCase() &&
                            "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110"
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
                disabled={isCreatingCategory || isUpdatingCategory}
                className="text-xs h-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5"
              >
                {isCreatingCategory || isUpdatingCategory ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : editingCategory ? (
                  <Save className="h-3.5 w-3.5" />
                ) : (
                  <Plus className="h-3.5 w-3.5" />
                )}
                <span>
                  {isCreatingCategory || isUpdatingCategory
                    ? isBangla
                      ? "সংরক্ষণ হচ্ছে..."
                      : "Saving..."
                    : editingCategory
                    ? isBangla
                      ? "আপডেট করুন"
                      : "Update Category"
                    : isBangla
                    ? "সংরক্ষণ করুন"
                    : "Save Category"}
                </span>
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
                  ? `সকল ব্যয় ক্যাটাগরি (${toBnNum(expenseCategories.length)}টি)`
                  : `All Expense Categories (${expenseCategories.length})`}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              {expenseCategories.map((c: any) => {
                const Icon = getCategoryIcon(c.icon || c.name);
                const color = c.color || "#F59E0B";
                return (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/10"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-lg border shrink-0"
                        style={{
                          backgroundColor: `${color}15`,
                          borderColor: `${color}30`,
                          color: color,
                        }}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">
                          {isBangla ? (c.nameBn || c.name) : (c.name || c.nameBn)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsViewAllCategoriesOpen(false);
                          handleOpenEditCategory(c);
                        }}
                        className="p-1.5 text-muted-foreground hover:text-foreground rounded transition-colors cursor-pointer"
                        title={isBangla ? "সম্পাদনা" : "Edit"}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsViewAllCategoriesOpen(false);
                          handlePromptDeleteCategory(c);
                        }}
                        className="p-1.5 text-muted-foreground hover:text-rose-400 rounded transition-colors cursor-pointer"
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

        {/* Delete Category Confirmation Dialog */}
        <Dialog open={isDeleteCategoryOpen} onOpenChange={setIsDeleteCategoryOpen}>
          <DialogContent className="sm:max-w-md bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-foreground">
                {isBangla ? "ক্যাটাগরি মুছে ফেলার নিশ্চিতকরণ" : "Confirm Delete Category"}
              </DialogTitle>
            </DialogHeader>
            <div className="py-2 text-xs text-muted-foreground">
              {isBangla
                ? `আপনি কি নিশ্চিত যে "${categoryToDelete?.nameBn || categoryToDelete?.name}" ক্যাটাগরি মুছে ফেলতে চান?`
                : `Are you sure you want to delete the category "${categoryToDelete?.name || categoryToDelete?.nameBn}"?`}
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDeleteCategoryOpen(false);
                  setCategoryToDelete(null);
                }}
                className="text-xs h-9 rounded-xl"
              >
                {isBangla ? "বাতিল" : "Cancel"}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleConfirmDeleteCategory}
                disabled={isDeletingCategory}
                className="text-xs h-9 rounded-xl font-semibold flex items-center gap-1.5"
              >
                {isDeletingCategory && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>
                  {isDeletingCategory
                    ? isBangla
                      ? "মুছে ফেলা হচ্ছে..."
                      : "Deleting..."
                    : isBangla
                    ? "মুছে ফেলুন"
                    : "Delete"}
                </span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Record New Expense Modal for Small Devices */}
        <Dialog open={isRecordModalOpen} onOpenChange={setIsRecordModalOpen}>
          <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-foreground">
                {isBangla ? "নতুন ব্যয় রেকর্ড করুন" : "Record New Expense"}
              </DialogTitle>
            </DialogHeader>
            <RecordNewExpense
              expenseCategories={expenseCategories}
              branchesData={branchesData}
              paymentMethodsData={paymentMethodsData}
              isBangla={isBangla}
              onOpenAddCategory={handleOpenAddCategory}
              onSuccess={() => setIsRecordModalOpen(false)}
              onCancel={() => setIsRecordModalOpen(false)}
              isModal
            />
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
