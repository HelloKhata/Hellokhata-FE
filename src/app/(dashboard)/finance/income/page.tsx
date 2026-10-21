"use client";

import React, { useState } from "react";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { PageHeader } from "@/components/common";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  Download,
  FileText,
  BarChart3,
  ChevronDown,
  Info,
  TrendingUp,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useCreateIncomeCategory,
  useDeleteIncomeCategory,
  useGetIncomeCateogories,
  useGetIncomes,
  useGetIncomeSummary,
  useUpdateIncomeCategory,
} from "@/hooks/api/useFinance";
import {
  IncomeRecord,
  INITIAL_INCOME_RECORDS,
  toBnNum,
  RecordNewIncome,
  IncomeRecords,
  IncomeCategoriesCard,
  IncomeModals,
} from "@/components/finance/income";
import { useGetBranches } from "@/hooks/api/useBranches";
import { cn } from "@/lib/utils";

export default function IncomePageContent() {
  const { isBangla } = useAppTranslation();
  const { toast } = useToast();
  const { data: branches } = useGetBranches();
  
  // API hooks
  const { data: incomeCategories, isLoading: loadingCategories } =
    useGetIncomeCateogories();
  const { data: incomesData } = useGetIncomes();
  const { mutate: createCategory, isPending: isCreatingCategory } =
    useCreateIncomeCategory();
  const { mutate: updateCategory, isPending: isUpdatingCategory } =
    useUpdateIncomeCategory();
  const { mutate: deleteCategory, isPending: isDeletingCategory } =
    useDeleteIncomeCategory();
  const {data: incomeSum} = useGetIncomeSummary()
  // Incomes State (fallback or local)
  const [incomes, setIncomes] = useState<IncomeRecord[]>(INITIAL_INCOME_RECORDS);
  const [dateRange, setDateRange] = useState("Jul 23, 2026 - Aug 22, 2026");

  // Mobile Record New Income Modal
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);


  // Modals State
  // 1. Add Category
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [addCatNameEn, setAddCatNameEn] = useState("");
  const [addCatNameBn, setAddCatNameBn] = useState("");
  const [addCatColor, setAddCatColor] = useState("#10b981");
  const [addCatIcon, setAddCatIcon] = useState("shopping-bag");

  // 2. Edit Category
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editCatNameEn, setEditCatNameEn] = useState("");
  const [editCatNameBn, setEditCatNameBn] = useState("");
  const [editCatColor, setEditCatColor] = useState("#10b981");
  const [editCatIcon, setEditCatIcon] = useState("shopping-bag");

  // 3. View All Categories
  const [isViewAllCategoriesOpen, setIsViewAllCategoriesOpen] = useState(false);

  // 4. Delete Category Confirmation
  const [isDeleteCategoryOpen, setIsDeleteCategoryOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<any>(null);

  // --- Category Handlers ---
  const handleOpenAddCategory = () => {
    setAddCatNameEn("");
    setAddCatNameBn("");
    setAddCatColor("#10b981");
    setAddCatIcon("shopping-bag");
    setIsAddCategoryOpen(true);
  };

  const handleCreateCategory = () => {
    if (!addCatNameEn.trim() && !addCatNameBn.trim()) {
      toast({
        title: isBangla ? "নাম আবশ্যক" : "Name Required",
        description: isBangla
          ? "অনুগ্রহ করে ক্যাটাগরির নাম লিখুন।"
          : "Please enter a category name.",
        variant: "destructive",
      });
      return;
    }

    const enName = addCatNameEn.trim() || addCatNameBn.trim();
    const bnName = addCatNameBn.trim() || addCatNameEn.trim();

    const newCategory = {
      name: enName,
      nameBn: bnName,
      color: addCatColor,
      icon: addCatIcon,
    };

    createCategory(newCategory, {
      onSuccess: () => {
        toast({
          title: isBangla
            ? "সফলভাবে তৈরি হয়েছে"
            : "Category created successfully",
          variant: "default",
        });
        setIsAddCategoryOpen(false);
        setAddCatNameEn("");
        setAddCatNameBn("");
        setAddCatColor("#10b981");
        setAddCatIcon("shopping-bag");
      },
    });
  };

  const handleOpenEditCategory = (cat: any) => {
    setEditingCategory(cat);
    setEditCatNameEn(cat.name || "");
    setEditCatNameBn(cat.nameBn || "");
    setEditCatColor(cat.color || "#10b981");
    setEditCatIcon(cat.icon || "shopping-bag");
    setIsEditCategoryOpen(true);
  };

  const handleUpdateCategory = () => {
    if (!editingCategory) return;
    if (!editCatNameEn.trim() && !editCatNameBn.trim()) {
      toast({
        title: isBangla ? "নাম আবশ্যক" : "Name Required",
        description: isBangla
          ? "অনুগ্রহ করে ক্যাটাগরির নাম লিখুন।"
          : "Please enter a category name.",
        variant: "destructive",
      });
      return;
    }

    const enName = editCatNameEn.trim() || editCatNameBn.trim();
    const bnName = editCatNameBn.trim() || editCatNameEn.trim();

    const payload = {
      name: enName,
      nameBn: bnName,
      color: editCatColor,
      icon: editCatIcon,
    };

    updateCategory(
      { id: editingCategory.id, data: payload },
      {
        onSuccess: () => {
          toast({
            title: isBangla
              ? "সফলভাবে আপডেট হয়েছে"
              : "Category updated successfully",
            variant: "default",
          });
          setIsEditCategoryOpen(false);
          setEditingCategory(null);
        },
      }
    );
  };

  const handlePromptDeleteCategory = (cat: any) => {
    setCategoryToDelete(cat);
    setIsDeleteCategoryOpen(true);
  };

  const handleConfirmDeleteCategory = () => {
    if (!categoryToDelete) return;
    deleteCategory(categoryToDelete.id, {
      onSuccess: () => {
        toast({
          title: isBangla ? "ক্যাটাগরি মুছে ফেলা হয়েছে" : "Category Deleted",
          description: isBangla
            ? `${
                categoryToDelete.nameBn ||
                categoryToDelete.name ||
                "ক্যাটাগরি"
              } সফলভাবে মুছে ফেলা হয়েছে`
            : `${categoryToDelete.name || "Category"} removed successfully`,
        });
        setIsDeleteCategoryOpen(false);
        setCategoryToDelete(null);
      },
      onError: (err: any) => {
        toast({
          title: isBangla ? "মুছে ফেলা ব্যর্থ হয়েছে" : "Failed to delete category",
          description:
            err?.message ||
            (isBangla ? "অনুগ্রহ করে আবার চেষ্টা করুন" : "Please try again"),
          variant: "destructive",
        });
      },
    });
  };



  const handleDeleteIncome = (incId: string) => {
    setIncomes((prev) => prev.filter((e) => e.id !== incId));
    toast({
      title: isBangla ? "ভাউচার মুছে ফেলা হয়েছে" : "Income Record Deleted",
      description: isBangla
        ? "রেকর্ড সফলভাবে অপসারণ করা হলো।"
        : "Income entry removed.",
    });
  };


  return (
    <TooltipProvider>
      <div className="space-y-6 mx-auto pb-24 text-foreground">
        {/* =========================================================================
            1. HEADER SECTION
           ========================================================================= */}
        <PageHeader
          title={isBangla ? "আয়ের হিসাব" : "Income"}
          subtitle={isBangla
            ? "আপনার ব্যবসায়িক সকল আয় ও রাজস্ব ট্র্যাক, পরিচালনা এবং বিশদ বিশ্লেষণ করুন"
            : "Track, manage and analyze your business revenues & income"}
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
                        description: isBangla
                          ? "আয় রিপোর্ট CSV ফাইলে ডাউনলোড সম্পন্ন।"
                          : "Income report downloaded as CSV.",
                      })
                    }
                  >
                    {isBangla ? "CSV ফাইল (.csv)" : "Export as CSV (.csv)"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      toast({
                        title: isBangla ? "PDF তৈরি হচ্ছে..." : "Generating PDF...",
                        description: isBangla
                          ? "আয় রিপোর্ট PDF ফরম্যাটে প্রস্তুত।"
                          : "Income report compiled as PDF.",
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
            2. TOP STATS CARDS (4 METRICS IN ROW ON DESKTOP, 2 ROWS ON MOBILE)
           ========================================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {/* Card 1: Total Today */}
          <div className="rounded-xl sm:rounded-2xl border border-border/70 bg-card/90 p-2.5 sm:p-4.5 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-emerald-500/40 transition-all">
            <div className="flex items-start justify-between">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                <TrendingUp className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5" />
              </div>
            </div>

            <div className="mt-2 sm:mt-3 space-y-0.5 sm:space-y-1 z-10">
              <div className="flex items-center gap-1 text-[10px] sm:text-[11.5px] font-medium text-muted-foreground truncate">
                <span className="truncate">{isBangla ? "আজকের মোট আয়" : incomeSum?.today?.label || "Today's Income"}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground/60 cursor-help shrink-0" />
                  </TooltipTrigger>
                  <TooltipContent>
                    {isBangla ? "আজকে এন্ট্রি করা মোট আয়" : "Income recorded today"}
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-base sm:text-2xl font-bold font-mono text-foreground tracking-tight truncate">
                {isBangla
                  ? `৳${toBnNum((incomeSum?.today?.total ?? 0).toLocaleString())}.০০`
                  : `৳${(incomeSum?.today?.total ?? 0).toLocaleString()}.00`}
              </p>
              <p
                className={cn(
                  "text-[9px] sm:text-[11px] font-semibold flex items-center gap-1 truncate",
                  (incomeSum?.today?.change ?? 0) >= 0 ? "text-emerald-400" : "text-rose-400"
                )}
              >
                <span className="truncate">
                  {isBangla
                    ? `${incomeSum?.today?.changeLabel === "vs Yesterday" ? "গতকালের চেয়ে" : incomeSum?.today?.changeLabel || "গতকালের চেয়ে"} ${(incomeSum?.today?.change ?? 0) >= 0 ? "+" : ""}${toBnNum(incomeSum?.today?.change ?? 0)}%`
                    : `${incomeSum?.today?.changeLabel || "vs Yesterday"} ${(incomeSum?.today?.change ?? 0) >= 0 ? "+" : ""}${incomeSum?.today?.change ?? 0}%`}
                </span>
                <span>{(incomeSum?.today?.change ?? 0) >= 0 ? "↑" : "↓"}</span>
              </p>
            </div>

            <div className="absolute right-1 sm:right-2 bottom-1 sm:bottom-2 w-20 sm:w-28 h-8 sm:h-12 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 100 40" className="w-full h-full stroke-emerald-400 stroke-[2.5] fill-none drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">
                <path d="M 5,34 Q 25,28 45,18 T 75,12 T 95,6" strokeLinecap="round" />
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
              <div className="flex items-center gap-1 text-[10px] sm:text-[11.5px] font-medium text-muted-foreground truncate">
                <span className="truncate">{isBangla ? "এই মাসের মোট আয়" : incomeSum?.thisMonth?.label || "This Month"}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground/60 cursor-help shrink-0" />
                  </TooltipTrigger>
                  <TooltipContent>
                    {isBangla ? "চলতি মাসের সর্বমোট আয়" : "Income recorded in current month"}
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-base sm:text-2xl font-bold font-mono text-foreground tracking-tight truncate">
                {isBangla
                  ? `৳${toBnNum((incomeSum?.thisMonth?.total ?? 0).toLocaleString())}.০০`
                  : `৳${(incomeSum?.thisMonth?.total ?? 0).toLocaleString()}.00`}
              </p>
              <p
                className={cn(
                  "text-[9px] sm:text-[11px] font-semibold flex items-center gap-1 truncate",
                  (incomeSum?.thisMonth?.change ?? 0) >= 0 ? "text-emerald-400" : "text-rose-400"
                )}
              >
                <span className="truncate">
                  {isBangla
                    ? `${incomeSum?.thisMonth?.changeLabel === "vs Last Month" ? "গত মাসের চেয়ে" : incomeSum?.thisMonth?.changeLabel || "গত মাসের চেয়ে"} ${(incomeSum?.thisMonth?.change ?? 0) >= 0 ? "+" : ""}${toBnNum(incomeSum?.thisMonth?.change ?? 0)}%`
                    : `${incomeSum?.thisMonth?.changeLabel || "vs Last Month"} ${(incomeSum?.thisMonth?.change ?? 0) >= 0 ? "+" : ""}${incomeSum?.thisMonth?.change ?? 0}%`}
                </span>
                <span>{(incomeSum?.thisMonth?.change ?? 0) >= 0 ? "↑" : "↓"}</span>
              </p>
            </div>

            <div className="absolute right-1 sm:right-2 bottom-1 sm:bottom-2 w-20 sm:w-28 h-8 sm:h-12 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 100 40" className="w-full h-full stroke-sky-400 stroke-[2.5] fill-none drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]">
                <path d="M 5,28 Q 30,32 50,18 T 75,14 T 95,8" strokeLinecap="round" />
              </svg>
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/5 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Card 3: Total This Year / All Time */}
          <div className="rounded-xl sm:rounded-2xl border border-border/70 bg-card/90 p-2.5 sm:p-4.5 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-purple-500/40 transition-all">
            <div className="flex items-start justify-between">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/20">
                <BarChart3 className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5" />
              </div>
            </div>

            <div className="mt-2 sm:mt-3 space-y-0.5 sm:space-y-1 z-10">
              <div className="flex items-center gap-1 text-[10px] sm:text-[11.5px] font-medium text-muted-foreground truncate">
                <span className="truncate">{isBangla ? "সর্বমোট আয়" : incomeSum?.allTime?.label || "Total Income"}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground/60 cursor-help shrink-0" />
                  </TooltipTrigger>
                  <TooltipContent>
                    {isBangla ? "সর্বমোট আদায়কৃত আয়" : "All-time total income revenue"}
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-base sm:text-2xl font-bold font-mono text-foreground tracking-tight truncate">
                {isBangla
                  ? `৳${toBnNum((incomeSum?.allTime?.total ?? 0).toLocaleString())}.০০`
                  : `৳${(incomeSum?.allTime?.total ?? 0).toLocaleString()}.00`}
              </p>
              <p className="text-[9px] sm:text-[11px] font-semibold text-emerald-400 flex items-center gap-1 font-mono truncate">
                <span className="truncate">
                  {isBangla
                    ? `গড়: ৳${toBnNum((incomeSum?.allTime?.avgIncome ?? 0).toLocaleString())}`
                    : `Avg: ৳${(incomeSum?.allTime?.avgIncome ?? 0).toLocaleString()}`}
                </span>
              </p>
            </div>

            <div className="absolute right-1 sm:right-2 bottom-1 sm:bottom-2 w-20 sm:w-28 h-8 sm:h-12 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 100 40" className="w-full h-full stroke-purple-400 stroke-[2.5] fill-none drop-shadow-[0_0_8px_rgba(192,132,252,0.4)]">
                <path d="M 5,35 Q 30,22 50,26 T 75,14 T 95,4" strokeLinecap="round" />
              </svg>
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Card 4: Total Entries / Count */}
          <div className="rounded-xl sm:rounded-2xl border border-border/70 bg-card/90 p-2.5 sm:p-4.5 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-amber-500/40 transition-all">
            <div className="flex items-start justify-between">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/20">
                <FileText className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5" />
              </div>
            </div>

            <div className="mt-2 sm:mt-3 space-y-0.5 sm:space-y-1 z-10">
              <div className="flex items-center gap-1 text-[10px] sm:text-[11.5px] font-medium text-muted-foreground truncate">
                <span className="truncate">{isBangla ? "মোট এন্ট্রি সংখ্যা" : "Total Entries"}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground/60 cursor-help shrink-0" />
                  </TooltipTrigger>
                  <TooltipContent>
                    {isBangla ? "দাখিলকৃত মোট আয় ভাউচার সংখ্যা" : "Number of income vouchers entered"}
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-base sm:text-2xl font-bold font-mono text-foreground tracking-tight truncate">
                {isBangla
                  ? toBnNum(incomeSum?.allTime?.count ?? 0)
                  : (incomeSum?.allTime?.count ?? 0)}
              </p>
              <p className="text-[9px] sm:text-[11px] font-semibold text-emerald-400 flex items-center gap-1 truncate">
                <span className="truncate">
                  {isBangla
                    ? `এই মাসে +${toBnNum(incomeSum?.thisMonth?.count ?? 0)}টি`
                    : `This month: +${incomeSum?.thisMonth?.count ?? 0}`}
                </span>
                <span>↑</span>
              </p>
            </div>

            <div className="absolute right-1 sm:right-2 bottom-1 sm:bottom-2 w-20 sm:w-28 h-8 sm:h-12 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 100 40" className="w-full h-full stroke-amber-400 stroke-[2.5] fill-none drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">
                <path d="M 5,32 Q 25,25 45,28 T 75,15 T 95,6" strokeLinecap="round" />
              </svg>
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* =========================================================================
            3. MIDDLE SECTION (LEFT: RECORD NEW INCOME | RIGHT: CATEGORIES & OVERVIEW)
            Desktop only: on small devices, overview card is hidden and record form is in a modal
           ========================================================================= */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Record New Income Form Component (Col Span 7) */}
          <div className="lg:col-span-7">
            <RecordNewIncome
              incomeCategories={incomeCategories}
              loadingCategories={loadingCategories}
              branches={branches}
              isBangla={isBangla}
              onOpenAddCategory={handleOpenAddCategory}
            />
          </div>

          {/* RIGHT: Categories & Income Overview Donut Chart (Col Span 5) */}
          <div className="lg:col-span-5">
            <IncomeCategoriesCard
              incomeCategories={incomeCategories}
              loadingCategories={loadingCategories}
              incomes={incomesData || incomes}
              onOpenAddCategory={handleOpenAddCategory}
              onOpenEditCategory={handleOpenEditCategory}
              onPromptDeleteCategory={handlePromptDeleteCategory}
              onOpenViewAllCategories={() => setIsViewAllCategoriesOpen(true)}
              isBangla={isBangla}
            />
          </div>
        </div>

        {/* =========================================================================
            4. BOTTOM SECTION: INCOME RECORDS LIST & SPLIT VOUCHER DETAILS VIEW
           ========================================================================= */}
        <IncomeRecords
          incomes={incomesData || incomes}
          incomeCategories={incomeCategories}
          onDeleteIncome={handleDeleteIncome}
          isBangla={isBangla}
          onOpenNewIncome={() => setIsRecordModalOpen(true)}
        />


        {/* =========================================================================
            5. MODALS & DIALOGS (Add, Edit, View All, Delete Confirmation & Mobile Record)
           ========================================================================= */}
        {/* Record New Income Modal for Small Devices */}
        <Dialog open={isRecordModalOpen} onOpenChange={setIsRecordModalOpen}>
          <DialogContent className="max-w-[95vw] sm:max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-2xl bg-card border-border">
            <DialogHeader className="pb-2">
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                <span>{isBangla ? "নতুন আয় রেকর্ড করুন" : "Record New Income"}</span>
              </DialogTitle>
            </DialogHeader>
            <RecordNewIncome
              incomeCategories={incomeCategories}
              loadingCategories={loadingCategories}
              branches={branches}
              isBangla={isBangla}
              onOpenAddCategory={handleOpenAddCategory}
              onSuccess={() => setIsRecordModalOpen(false)}
            />
          </DialogContent>
        </Dialog>


        {/* =========================================================================
            5. MODALS & DIALOGS (Add, Edit, View All & Delete Confirmation)
           ========================================================================= */}
        <IncomeModals
          isAddCategoryOpen={isAddCategoryOpen}
          setIsAddCategoryOpen={setIsAddCategoryOpen}
          addCatNameEn={addCatNameEn}
          setAddCatNameEn={setAddCatNameEn}
          addCatNameBn={addCatNameBn}
          setAddCatNameBn={setAddCatNameBn}
          addCatColor={addCatColor}
          setAddCatColor={setAddCatColor}
          addCatIcon={addCatIcon}
          setAddCatIcon={setAddCatIcon}
          isCreatingCategory={isCreatingCategory}
          onCreateCategory={handleCreateCategory}

          isEditCategoryOpen={isEditCategoryOpen}
          setIsEditCategoryOpen={setIsEditCategoryOpen}
          editCatNameEn={editCatNameEn}
          setEditCatNameEn={setEditCatNameEn}
          editCatNameBn={editCatNameBn}
          setEditCatNameBn={setEditCatNameBn}
          editCatColor={editCatColor}
          setEditCatColor={setEditCatColor}
          editCatIcon={editCatIcon}
          setEditCatIcon={setEditCatIcon}
          isUpdatingCategory={isUpdatingCategory}
          onUpdateCategory={handleUpdateCategory}

          isViewAllCategoriesOpen={isViewAllCategoriesOpen}
          setIsViewAllCategoriesOpen={setIsViewAllCategoriesOpen}
          incomeCategories={incomeCategories}
          loadingCategories={loadingCategories}
          onOpenEditCategory={(cat) => {
            setIsViewAllCategoriesOpen(false);
            handleOpenEditCategory(cat);
          }}

          isDeleteCategoryOpen={isDeleteCategoryOpen}
          setIsDeleteCategoryOpen={setIsDeleteCategoryOpen}
          categoryToDelete={categoryToDelete}
          setCategoryToDelete={setCategoryToDelete}
          isDeletingCategory={isDeletingCategory}
          onConfirmDeleteCategory={handleConfirmDeleteCategory}
          onPromptDeleteCategory={handlePromptDeleteCategory}

          isBangla={isBangla}
        />
      </div>
    </TooltipProvider>
  );
}
