"use client";

import React, { useState } from "react";
import {
  Download,
  Printer,
  RotateCcw,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Loader2,
  FileText,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/common";
import { PaginationHelper } from "@/components/shared/PaginationHelper";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useGetBranches } from "@/hooks/api/useBranches";
import { useGetIncomeCateogories } from "@/hooks/api/useFinance";
import { useGetIncomeReport } from "@/hooks/api/useReports";

// ============================================================================
// TYPES
// ============================================================================

export interface IncomeReportRow {
  index?: number;
  id: string;
  name?: string;
  incomeName?: string;
  category?: string;
  categoryName?: string;
  categoryId?: string;
  storeName?: string;
  branchName?: string;
  branch?: string;
  description?: string;
  note?: string;
  amount: number;
  paymentMethod?: string;
  method?: string;
  bankAccount?: string;
  accountName?: string;
  date?: string;
  createdAt?: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const formatBDT = (amount: number = 0) => {
  const num = Number(amount) || 0;
  return `৳${num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatKpiNumber = (amount: number = 0) => {
  const num = Number(amount) || 0;
  return num.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

const formatDateTime = (dateStr?: string) => {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const formatInputDate = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getInitialDateRange = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 30);
  return {
    start: formatInputDate(start),
    end: formatInputDate(end),
  };
};

// ============================================================================
// COMPONENT
// ============================================================================

export default function IncomeReportPage() {
  const { isBangla } = useAppTranslation();
  const initialDates = getInitialDateRange();

  // 1. DRAFT FORM INPUT STATES
  const [startDate, setStartDate] = useState(initialDates.start);
  const [endDate, setEndDate] = useState(initialDates.end);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Table Pagination State
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // 2. ACTIVE QUERY FILTERS (Set ONLY on Generate Report or pagination)
  const [activeFilters, setActiveFilters] = useState<any>(null);

  // Auxiliary API Data: Branches & Income Categories
  const { data: branches, isLoading: isBranchesLoading } = useGetBranches();
  const { data: categoriesData = [], isLoading: isCategoriesLoading } =
    useGetIncomeCateogories();

  // Controlled Report Hook
  const {
    data: incomeReportData,
    isLoading: isLoadingIncomeReport,
    isFetching: isFetchingIncomeReport,
  } = useGetIncomeReport(activeFilters, {
    enabled: Boolean(activeFilters),
  });

  console.log("incomeReportData", incomeReportData);
  const branchList = Array.isArray(branches)
    ? branches
    : Array.isArray((branches as any)?.data)
    ? (branches as any).data
    : Array.isArray((branches as any)?.branches)
    ? (branches as any).branches
    : [];

  const categoryList: any[] = Array.isArray(categoriesData)
    ? categoriesData
    : Array.isArray((categoriesData as any)?.data)
    ? (categoriesData as any).data
    : [];

  const incomeList: IncomeReportRow[] = incomeReportData?.data || [];
  const summary = incomeReportData?.summary;
  const meta = incomeReportData?.meta;

  const totalEntries = meta?.total ?? incomeList.length;
  const totalPages =
    meta?.totalPages ?? Math.max(1, Math.ceil(totalEntries / pageSize));

  // 3. ACTION HANDLERS
  const handleGenerateReport = () => {
    setCurrentPage(1);
    setActiveFilters({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      branchId:
        selectedBranch === "all" ? undefined : selectedBranch || undefined,
      categoryId:
        selectedCategory === "all" ? undefined : selectedCategory || undefined,
      page: 1,
      limit: pageSize,
    });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (activeFilters) {
      setActiveFilters((prev: any) => ({
        ...prev,
        page: newPage,
      }));
    }
  };

  const handleResetFilter = () => {
    const dates = getInitialDateRange();
    setStartDate(dates.start);
    setEndDate(dates.end);
    setSelectedBranch("");
    setSelectedCategory("all");
  };

  // Handle Export Excel / CSV
  const handleDownloadExcel = () => {
    setIsExporting(true);
    try {
      if (!incomeList || incomeList.length === 0) return;

      const headers = [
        "#",
        "Name",
        "Category",
        "Branch",
        "Description",
        "Amount (BDT)",
        "Payment Method",
        "Bank / Account",
        "Date",
      ];

      const csvRows = [
        headers.join(","),
        ...incomeList.map((row, idx) => {
          const rowNum = row.index ?? (currentPage - 1) * pageSize + idx + 1;
          const name = row.name || row.incomeName || "—";
          const cat = row.categoryName || row.category || "—";
          const branch = row.storeName || row.branchName || row.branch || "—";
          const desc = row.description || row.note || "";
          const method = row.paymentMethod || row.method || "—";
          const account = row.bankAccount || row.accountName || "—";
          const date = row.date || row.createdAt || "—";

          return [
            rowNum,
            `"${name.replace(/"/g, '""')}"`,
            `"${cat.replace(/"/g, '""')}"`,
            `"${branch.replace(/"/g, '""')}"`,
            `"${desc.replace(/"/g, '""')}"`,
            Number(row.amount || 0).toFixed(2),
            `"${method.replace(/"/g, '""')}"`,
            `"${account.replace(/"/g, '""')}"`,
            `"${date}"`,
          ].join(",");
        }),
      ];

      const blob = new Blob([csvRows.join("\n")], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        `download`,
        `Income_Report_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setTimeout(() => setIsExporting(false), 600);
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12 print:p-0 print:space-y-4">
      {/* ================================================================== */}
      {/* 1. PAGE HEADER                                                     */}
      {/* ================================================================== */}
      <PageHeader
        title="Income Reports"
        subtitle="Manage and analyse your business income data"
        showBack
      />

      {/* ================================================================== */}
      {/* 2. FILTER CARD                                                     */}
      {/* ================================================================== */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm print:hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Choose Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Choose Date
            </label>
            <div className="relative flex items-center h-10 rounded-lg border border-input bg-background px-3 transition-colors focus-within:border-primary/60 focus-within:ring-1 focus-within:ring-primary/20">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm text-foreground outline-none cursor-pointer"
              />
              <span className="text-muted-foreground px-2 select-none">→</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm text-foreground outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Branch Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Branch
            </label>
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-full h-10 rounded-lg border-input bg-background text-foreground text-sm focus:border-primary/60 focus:ring-1 focus:ring-primary/20">
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover text-popover-foreground">
                <SelectItem value="all">All Branches</SelectItem>
                {branchList.length > 0 ? (
                  branchList.map((branch: any) => (
                    <SelectItem
                      key={branch.id || branch._id}
                      value={String(branch.id || branch._id || branch.name)}
                    >
                      {branch.name}
                    </SelectItem>
                  ))
                ) : isBranchesLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading branches...
                  </SelectItem>
                ) : null}
              </SelectContent>
            </Select>
          </div>

          {/* Income Category Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Income Category
            </label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full h-10 rounded-lg border-input bg-background text-foreground text-sm focus:border-primary/60 focus:ring-1 focus:ring-primary/20">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover text-popover-foreground">
                <SelectItem value="all">All Categories</SelectItem>
                {categoryList.length > 0 ? (
                  categoryList.map((cat: any) => (
                    <SelectItem
                      key={cat.id || cat._id}
                      value={String(cat.id || cat._id)}
                    >
                      {cat.name}
                    </SelectItem>
                  ))
                ) : isCategoriesLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading categories...
                  </SelectItem>
                ) : null}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 mt-5 pt-4 border-t border-border">
          <button
            type="button"
            onClick={handleResetFilter}
            className="h-10 px-6 rounded-lg border border-border bg-background hover:bg-muted text-foreground font-medium text-sm transition-all duration-150 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
          >
            <RotateCcw className="h-4 w-4 text-muted-foreground" />
            <span>Reset Filter</span>
          </button>

          <button
            type="button"
            onClick={handleGenerateReport}
            className="h-10 px-6 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm transition-all duration-150 flex items-center justify-center gap-2 active:scale-[0.98] shadow-sm cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* ================================================================== */}
      {/* 3. KPI CARDS                                                       */}
      {/* ================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Income Amount */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-card p-4 sm:p-5 shadow-sm transition-all duration-200 hover:border-emerald-500/40 hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-sm">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-semibold text-muted-foreground truncate">
                Total Income Amount
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {activeFilters
                  ? formatBDT(summary?.totalIncomeAmount ?? summary?.totalAmount ?? 0)
                  : "৳0.00"}
              </p>
            </div>
          </div>
        </div>

        {/* Highest Income Amount */}
        <div className="relative overflow-hidden rounded-2xl border border-teal-500/25 bg-card p-4 sm:p-5 shadow-sm transition-all duration-200 hover:border-teal-500/40 hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-teal-500 flex items-center justify-center text-white shrink-0 shadow-sm">
              <ArrowUpRight className="h-6 w-6" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-semibold text-muted-foreground truncate">
                Highest Income
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {activeFilters
                  ? formatBDT(summary?.highestIncomeAmount ?? summary?.highestIncome ?? 0)
                  : "৳0.00"}
              </p>
            </div>
          </div>
        </div>

        {/* Lowest Income Amount */}
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/25 bg-card p-4 sm:p-5 shadow-sm transition-all duration-200 hover:border-amber-500/40 hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500 flex items-center justify-center text-white shrink-0 shadow-sm">
              <ArrowDownRight className="h-6 w-6" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-semibold text-muted-foreground truncate">
                Lowest Income
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {activeFilters
                  ? formatBDT(summary?.lowestIncomeAmount ?? summary?.lowestIncome ?? 0)
                  : "৳0.00"}
              </p>
            </div>
          </div>
        </div>

        {/* Total Records */}
        <div className="relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-card p-4 sm:p-5 shadow-sm transition-all duration-200 hover:border-indigo-500/40 hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-indigo-500 flex items-center justify-center text-white shrink-0 shadow-sm">
              <FileText className="h-6 w-6" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-semibold text-muted-foreground truncate">
                Total Records
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {activeFilters
                  ? formatKpiNumber(summary?.totalRecords ?? summary?.totalCount ?? totalEntries)
                  : "0"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* 4. INCOME REPORT DATA TABLE CARD                                   */}
      {/* ================================================================== */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {/* Table Header Bar */}
        <div className="px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/40">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-foreground tracking-tight">
              Income Report
            </h2>
            {isFetchingIncomeReport && !isLoadingIncomeReport && (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            )}
          </div>

          <div className="flex items-center gap-2.5 print:hidden">
            <button
              type="button"
              onClick={handleDownloadExcel}
              disabled={isExporting || incomeList.length === 0}
              className="h-9 px-3.5 rounded-lg border border-border bg-background hover:bg-muted text-foreground text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isExporting ? "Exporting..." : "Download Excel"}</span>
            </button>

            <button
              type="button"
              onClick={handlePrintReport}
              disabled={incomeList.length === 0}
              className="h-9 px-3.5 rounded-lg border border-border bg-background hover:bg-muted text-foreground text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Report</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground text-[11px] sm:text-xs font-semibold tracking-wider uppercase">
                <th className="px-4 py-3.5 whitespace-nowrap">#</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Name</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Category</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Branch</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Description</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Amount</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Payment Method</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Bank / Account</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {!activeFilters ? (
                /* Initial State Before Generating Report */
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-16 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2 mx-auto">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1">
                        <Sparkles className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        Ready to generate income report
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Select date range, branch, or category filters above, then click &quot;Generate Report&quot; to fetch the latest analytics.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : isLoadingIncomeReport ? (
                /* Loading State */
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-16 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="h-7 w-7 text-primary animate-spin" />
                      <p className="text-sm font-medium">
                        Loading income report...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : incomeList.length === 0 ? (
                /* Empty Results State */
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-16 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm font-medium">No income records found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                /* Data Rows */
                incomeList.map((row, idx) => {
                  const rowNum =
                    row.index ?? (currentPage - 1) * pageSize + idx + 1;
                  return (
                    <tr
                      key={row.id || idx}
                      className="hover:bg-muted/40 transition-colors group"
                    >
                      {/* # */}
                      <td className="px-4 py-3 whitespace-nowrap font-mono text-xs text-muted-foreground">
                        {rowNum}
                      </td>

                      {/* Name */}
                      <td className="px-4 py-3 whitespace-nowrap font-semibold text-foreground text-xs sm:text-sm">
                        {row.name || row.incomeName || "—"}
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {row.categoryName || row.category || "General"}
                        </span>
                      </td>

                      {/* Branch */}
                      <td className="px-4 py-3 text-foreground whitespace-nowrap text-xs">
                        {row.storeName || row.branchName || row.branch || "—"}
                      </td>

                      {/* Description */}
                      <td className="px-4 py-3 text-muted-foreground text-xs max-w-xs truncate">
                        {row.description || row.note || "—"}
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3 font-semibold text-emerald-500 whitespace-nowrap text-xs sm:text-sm">
                        {formatBDT(row.amount)}
                      </td>

                      {/* Payment Method */}
                      <td className="px-4 py-3 whitespace-nowrap text-xs">
                        {row.paymentMethod || row.method ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted text-foreground border border-border capitalize">
                            {row.paymentMethod || row.method}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>

                      {/* Bank / Account */}
                      <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                        {row.bankAccount || row.accountName || "—"}
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                        {formatDateTime(row.date || row.createdAt)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Reusable Pagination */}
        {activeFilters && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border print:hidden">
            <PaginationHelper
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isBangla={isBangla}
            />
          </div>
        )}
      </div>
    </div>
  );
}
