"use client";

import React, { useState } from "react";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { BackButton } from "@/components/common";
import { useToast } from "@/hooks/use-toast";
import { useBranchStore } from "@/stores/branchStore";
import {
  Calendar,
  Download,
  FileText,
  BarChart3,
  ChevronDown,
  Info,
  TrendingUp,
} from "lucide-react";
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

export default function IncomePageContent() {
  const { isBangla } = useAppTranslation();
  const { toast } = useToast();
  const { branches } = useBranchStore();

  // API hooks
  const { data: incomeCategories, isLoading: loadingCategories } =
    useGetIncomeCateogories();
  const { mutate: createCategory, isPending: isCreatingCategory } =
    useCreateIncomeCategory();
  const { mutate: updateCategory, isPending: isUpdatingCategory } =
    useUpdateIncomeCategory();
  const { mutate: deleteCategory, isPending: isDeletingCategory } =
    useDeleteIncomeCategory();

  // Incomes State
  const [incomes, setIncomes] = useState<IncomeRecord[]>(INITIAL_INCOME_RECORDS);
  const [dateRange, setDateRange] = useState("Jul 23, 2026 - Aug 22, 2026");

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BackButton />
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {isBangla ? "আয়ের হিসাব" : "Income"}
                </h1>
              </div>
              <p className="text-xs text-muted-foreground">
                {isBangla
                  ? "আপনার ব্যবসায়িক সকল আয় ও রাজস্ব ট্র্যাক, পরিচালনা এবং বিশদ বিশ্লেষণ করুন"
                  : "Track, manage and analyze your business revenues & income"}
              </p>
            </div>
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
        </div>

        {/* =========================================================================
            2. TOP STATS CARDS (4 METRICS IN ROW)
           ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Today */}
          <div className="rounded-2xl border border-border/70 bg-card/90 p-4.5 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-emerald-500/40 transition-all">
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                <TrendingUp className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="mt-3 space-y-1 z-10">
              <div className="flex items-center gap-1 text-[11.5px] font-medium text-muted-foreground">
                <span>{isBangla ? "আজকের মোট আয়" : "Total Today"}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground/60 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    {isBangla ? "আজকে এন্ট্রি করা মোট আয়" : "Income recorded today"}
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-2xl font-bold font-mono text-foreground tracking-tight">
                {isBangla ? `৳${toBnNum("18,500.00")}` : "৳18,500.00"}
              </p>
              <p className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                <span>{isBangla ? "গতকালের চেয়ে +১৫.৪%" : "vs yesterday +15.4%"}</span>
                <span>↑</span>
              </p>
            </div>

            <div className="absolute right-2 bottom-2 w-28 h-12 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 100 40" className="w-full h-full stroke-emerald-400 stroke-[2.5] fill-none drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">
                <path d="M 5,34 Q 25,28 45,18 T 75,12 T 95,6" strokeLinecap="round" />
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
                <span>{isBangla ? "এই মাসের মোট আয়" : "Total This Month"}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground/60 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    {isBangla ? "চলতি মাসের সর্বমোট আয়" : "Income recorded in current month"}
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-2xl font-bold font-mono text-foreground tracking-tight">
                {isBangla ? `৳${toBnNum("184,200.00")}` : "৳184,200.00"}
              </p>
              <p className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                <span>{isBangla ? "গত মাসের চেয়ে +২২.৮%" : "vs last month +22.8%"}</span>
                <span>↑</span>
              </p>
            </div>

            <div className="absolute right-2 bottom-2 w-28 h-12 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 100 40" className="w-full h-full stroke-sky-400 stroke-[2.5] fill-none drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]">
                <path d="M 5,28 Q 30,32 50,18 T 75,14 T 95,8" strokeLinecap="round" />
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
                <span>{isBangla ? "এই বছরের মোট আয়" : "Total This Year"}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground/60 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    {isBangla ? "২০২৬ সালের সর্বমোট আয়" : "Total revenue recorded in 2026"}
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-2xl font-bold font-mono text-foreground tracking-tight">
                {isBangla ? `৳${toBnNum("1,842,500.00")}` : "৳1,842,500.00"}
              </p>
              <p className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                <span>{isBangla ? "গত বছরের চেয়ে +৩৪.২%" : "vs last year +34.2%"}</span>
                <span>↑</span>
              </p>
            </div>

            <div className="absolute right-2 bottom-2 w-28 h-12 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 100 40" className="w-full h-full stroke-purple-400 stroke-[2.5] fill-none drop-shadow-[0_0_8px_rgba(192,132,252,0.4)]">
                <path d="M 5,35 Q 30,22 50,26 T 75,14 T 95,4" strokeLinecap="round" />
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
                    {isBangla ? "দাখিলকৃত মোট আয় ভাউচার সংখ্যা" : "Number of income vouchers entered"}
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-2xl font-bold font-mono text-foreground tracking-tight">
                {isBangla ? toBnNum("245") : "245"}
              </p>
              <p className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                <span>{isBangla ? "গত মাসে +১৮টি" : "vs last month +18"}</span>
                <span>↑</span>
              </p>
            </div>

            <div className="absolute right-2 bottom-2 w-28 h-12 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 100 40" className="w-full h-full stroke-amber-400 stroke-[2.5] fill-none drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">
                <path d="M 5,32 Q 25,25 45,28 T 75,15 T 95,6" strokeLinecap="round" />
              </svg>
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* =========================================================================
            3. MIDDLE SECTION (LEFT: RECORD NEW INCOME | RIGHT: CATEGORIES & OVERVIEW)
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Record New Income Form Component (Col Span 7) */}
          <div className="lg:col-span-7">
            <RecordNewIncome
              incomeCategories={incomeCategories}
              loadingCategories={loadingCategories}
              branches={branches}
              isBangla={isBangla}
            />
          </div>

          {/* RIGHT: Categories & Income Overview Donut Chart (Col Span 5) */}
          <div className="lg:col-span-5">
            <IncomeCategoriesCard
              incomeCategories={incomeCategories}
              loadingCategories={loadingCategories}
              incomes={incomes}
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
          incomes={incomes}
          incomeCategories={incomeCategories}
          onDeleteIncome={handleDeleteIncome}
          isBangla={isBangla}
        />

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
