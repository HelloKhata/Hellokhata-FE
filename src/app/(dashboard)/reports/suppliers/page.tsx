"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Download,
  Printer,
  RotateCcw,
  TrendingUp,
  CreditCard,
  Truck,
  Sparkles,
  Package,
  Building2,
  Check,
  Search,
  Loader2,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/common";
import { PaginationHelper } from "@/components/shared/PaginationHelper";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useGetBranches } from "@/hooks/api/useBranches";
import { useParties } from "@/hooks/api/useParties";
import { useGetSupplierReport } from "@/hooks/api/useReports";

// ============================================================================
// TYPES
// ============================================================================

export interface SupplierReportRow {
  index?: number;
  id: string;
  reference?: string;
  supplier: string;
  supplierId?: string;
  supplierPhone?: string;
  totalItems: number;
  totalAmount: number;
  totalPaid: number;
  totalDue: number;
  status?: string;
  purchaseDate?: string;
  invoiceNo?: string | null;
  grnNo?: string;
  purchaseType?: string;
  storeName?: string;
  branchName?: string;
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

// ============================================================================
// COMPONENT
// ============================================================================

export default function SupplierReportPage() {
  const { isBangla } = useAppTranslation();

  // 1. DRAFT FORM INPUT STATES
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("all");
  const [selectedSupplierName, setSelectedSupplierName] = useState("All");
  const [supplierSearchQuery, setSupplierSearchQuery] = useState("");
  const [debouncedSupplierSearch, setDebouncedSupplierSearch] = useState("");
  const [showSupplierSuggestions, setShowSupplierSuggestions] = useState(false);
  const supplierDropdownRef = useRef<HTMLDivElement>(null);

  // Table Pagination State
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // 2. ACTIVE QUERY FILTERS (Set ONLY on Generate Report or pagination)
  const [activeFilters, setActiveFilters] = useState<any>(null);

  // Debounce supplier search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSupplierSearch(supplierSearchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [supplierSearchQuery]);

  // Click outside to close supplier suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        supplierDropdownRef.current &&
        !supplierDropdownRef.current.contains(event.target as Node)
      ) {
        setShowSupplierSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Auxiliary API Data: Branches & Suppliers
  const { data: branches, isLoading: isBranchesLoading } = useGetBranches();
  const { data: partiesData = [], isLoading: isLoadingParties } = useParties({
    type: "supplier",
    search: debouncedSupplierSearch || undefined,
  });

  // Controlled Report Hook
  const {
    data: supplierReportData,
    isLoading: isLoadingSupplierReport,
    isFetching: isFetchingSupplierReport,
  } = useGetSupplierReport(activeFilters, {
    enabled: Boolean(activeFilters),
  });

  const branchList = Array.isArray(branches)
    ? branches
    : Array.isArray((branches as any)?.data)
    ? (branches as any).data
    : Array.isArray((branches as any)?.branches)
    ? (branches as any).branches
    : [];

  const supplierParties: any[] = Array.isArray(partiesData)
    ? partiesData
    : Array.isArray((partiesData as any)?.data)
    ? (partiesData as any).data
    : [];

  const handleSelectSupplier = (party: any) => {
    if (!party || party === "all" || party.id === "all") {
      setSelectedSupplier("all");
      setSelectedSupplierName("All");
      setSupplierSearchQuery("");
    } else {
      setSelectedSupplier(party.id || party._id);
      setSelectedSupplierName(party.name);
      setSupplierSearchQuery("");
    }
    setShowSupplierSuggestions(false);
  };

  const suppliersList: SupplierReportRow[] = supplierReportData?.data || [];
  const summary = supplierReportData?.summary;
  const meta = supplierReportData?.meta;

  const totalEntries = meta?.total ?? suppliersList.length;
  const totalPages =
    meta?.totalPages ?? Math.max(1, Math.ceil(totalEntries / pageSize));

  // 3. ACTION HANDLERS
  const handleGenerateReport = () => {
    setCurrentPage(1);
    setActiveFilters({
      branchId:
        selectedBranch === "all" ? undefined : selectedBranch || undefined,
      supplierId:
        selectedSupplier === "all" || !selectedSupplier
          ? undefined
          : selectedSupplier,
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
    setSelectedBranch("");
    setSelectedSupplier("all");
    setSelectedSupplierName("All");
    setSupplierSearchQuery("");
    setShowSupplierSuggestions(false);
  };

  // Handle Export Excel / CSV
  const handleDownloadExcel = () => {
    setIsExporting(true);
    try {
      if (!suppliersList || suppliersList.length === 0) return;

      const headers = [
        "#",
        "Reference / Invoice",
        "Supplier",
        "Phone",
        "Branch",
        "Total Items",
        "Total Amount",
        "Total Paid",
        "Total Due",
        "Status",
        "Purchase Date",
      ];

      const csvRows = [
        headers.join(","),
        ...suppliersList.map((row, idx) => {
          const rowNum = row.index ?? (currentPage - 1) * pageSize + idx + 1;
          const ref = row.reference || row.invoiceNo || row.grnNo || "";
          return [
            rowNum,
            `"${ref.replace(/"/g, '""')}"`,
            `"${(row.supplier || "—").replace(/"/g, '""')}"`,
            `"${(row.supplierPhone || "").replace(/"/g, '""')}"`,
            `"${(row.storeName || row.branchName || "—").replace(/"/g, '""')}"`,
            row.totalItems ?? 0,
            Number(row.totalAmount || 0).toFixed(2),
            Number(row.totalPaid || 0).toFixed(2),
            Number(row.totalDue || 0).toFixed(2),
            `"${(row.status || "—").replace(/"/g, '""')}"`,
            `"${row.purchaseDate || "—"}"`,
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
        "download",
        `Supplier_Report_${new Date().toISOString().slice(0, 10)}.csv`
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
        title="Supplier Reports"
        subtitle="Manage and analyse your supplier purchase and order data"
        showBack
      />

      {/* ================================================================== */}
      {/* 2. FILTER CARD                                                     */}
      {/* ================================================================== */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm print:hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Branch Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Branch
            </label>
            <Select
              value={selectedBranch}
              onValueChange={setSelectedBranch}
            >
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

          {/* Supplier Filter */}
          <div ref={supplierDropdownRef} className="space-y-1.5 relative">
            <label className="text-xs font-semibold text-foreground">
              Supplier
            </label>
            <div className="relative">
              <input
                type="text"
                value={
                  showSupplierSuggestions
                    ? supplierSearchQuery
                    : selectedSupplierName || "All"
                }
                onChange={(e) => {
                  setSupplierSearchQuery(e.target.value);
                  if (!showSupplierSuggestions) setShowSupplierSuggestions(true);
                }}
                onFocus={() => {
                  setShowSupplierSuggestions(true);
                }}
                placeholder="Search supplier / phone..."
                className="w-full h-10 rounded-lg border border-input bg-background px-3 pr-8 text-xs sm:text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:ring-1 focus:ring-primary/20 placeholder:text-muted-foreground"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {selectedSupplier && selectedSupplier !== "all" && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectSupplier("all");
                    }}
                    className="h-4 w-4 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center text-[10px] cursor-pointer"
                    title="Clear supplier filter"
                  >
                    ×
                  </button>
                )}
                <Search className="h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>

              {/* Suggestions dropdown list */}
              {showSupplierSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-lg border border-border bg-popover shadow-xl z-50 divide-y divide-border">
                  {/* Option 1: All Suppliers */}
                  <button
                    type="button"
                    className={cn(
                      "w-full text-left p-2.5 hover:bg-muted/80 text-xs transition-colors flex items-center justify-between cursor-pointer",
                      (selectedSupplier === "all" || !selectedSupplier) &&
                        "bg-primary/10 text-primary font-medium"
                    )}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectSupplier("all");
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-semibold text-foreground">
                        All
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                        Default
                      </span>
                    </div>
                    {(selectedSupplier === "all" || !selectedSupplier) && (
                      <Check className="h-3.5 w-3.5 text-primary" />
                    )}
                  </button>

                  {/* Option 2: Search / Registered Suppliers */}
                  {isLoadingParties ? (
                    <div className="p-3 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                      <span>Loading suppliers...</span>
                    </div>
                  ) : supplierParties.length === 0 ? (
                    <div className="p-3 text-center text-xs text-muted-foreground">
                      No suppliers found
                    </div>
                  ) : (
                    supplierParties.map((party: any) => {
                      const partyId = party.id || party._id;
                      const isSelected = selectedSupplier === partyId;
                      return (
                        <button
                          key={partyId}
                          type="button"
                          className={cn(
                            "w-full text-left p-2.5 hover:bg-muted/80 text-xs transition-colors flex items-center justify-between cursor-pointer",
                            isSelected && "bg-primary/10 text-primary font-medium"
                          )}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSelectSupplier(party);
                          }}
                        >
                          <div className="flex flex-col min-w-0 pr-2">
                            <span className="font-semibold text-foreground truncate">
                              {party.name}
                            </span>
                            {party.phone && (
                              <span className="text-[11px] text-muted-foreground font-mono">
                                {party.phone}
                              </span>
                            )}
                          </div>
                          {isSelected && (
                            <Check className="h-3.5 w-3.5 text-primary shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
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
      {/* 3. SIX KPI CARDS (Matching Backend Summary)                        */}
      {/* ================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Amount */}
        <div className="relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-card p-4 shadow-sm transition-all duration-200 hover:border-indigo-500/40 hover:-translate-y-0.5">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-indigo-500 flex items-center justify-center text-white shrink-0 shadow-sm">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-semibold text-muted-foreground truncate">
                Total Amount
              </p>
              <p className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                {activeFilters
                  ? formatBDT(summary?.totalAmount ?? 0)
                  : "৳0.00"}
              </p>
            </div>
          </div>
        </div>

        {/* Total Paid */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-card p-4 shadow-sm transition-all duration-200 hover:border-emerald-500/40 hover:-translate-y-0.5">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-sm">
              <CreditCard className="h-5 w-5" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-semibold text-muted-foreground truncate">
                Total Paid
              </p>
              <p className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                {activeFilters
                  ? formatBDT(summary?.totalPaid ?? 0)
                  : "৳0.00"}
              </p>
            </div>
          </div>
        </div>

        {/* Total Due */}
        <div className="relative overflow-hidden rounded-2xl border border-rose-500/25 bg-card p-4 shadow-sm transition-all duration-200 hover:border-rose-500/40 hover:-translate-y-0.5">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-rose-500 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Truck className="h-5 w-5" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-semibold text-muted-foreground truncate">
                Total Due
              </p>
              <p className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                {activeFilters
                  ? formatBDT(summary?.totalDue ?? 0)
                  : "৳0.00"}
              </p>
            </div>
          </div>
        </div>

        {/* Total Items */}
        <div className="relative overflow-hidden rounded-2xl border border-teal-500/25 bg-card p-4 shadow-sm transition-all duration-200 hover:border-teal-500/40 hover:-translate-y-0.5">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-teal-500 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Package className="h-5 w-5" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-semibold text-muted-foreground truncate">
                Total Items
              </p>
              <p className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                {activeFilters
                  ? formatKpiNumber(summary?.totalItems ?? 0)
                  : "0"}
              </p>
            </div>
          </div>
        </div>

        {/* Total Purchases */}
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/25 bg-card p-4 shadow-sm transition-all duration-200 hover:border-amber-500/45 hover:-translate-y-0.5">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-amber-500 flex items-center justify-center text-white shrink-0 shadow-sm">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-semibold text-muted-foreground truncate">
                Total Purchases
              </p>
              <p className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                {activeFilters
                  ? formatKpiNumber(summary?.totalPurchases ?? 0)
                  : "0"}
              </p>
            </div>
          </div>
        </div>

        {/* Unique Suppliers */}
        <div className="relative overflow-hidden rounded-2xl border border-violet-500/25 bg-card p-4 shadow-sm transition-all duration-200 hover:border-violet-500/40 hover:-translate-y-0.5">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-violet-500 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-semibold text-muted-foreground truncate">
                Unique Suppliers
              </p>
              <p className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                {activeFilters
                  ? formatKpiNumber(summary?.uniqueSuppliers ?? totalEntries)
                  : "0"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* 4. SUPPLIER REPORT DATA TABLE CARD                                 */}
      {/* ================================================================== */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {/* Table Header Bar */}
        <div className="px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/40">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-foreground tracking-tight">
              Supplier Report
            </h2>
            {isFetchingSupplierReport && !isLoadingSupplierReport && (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            )}
          </div>

          <div className="flex items-center gap-2.5 print:hidden">
            <button
              type="button"
              onClick={handleDownloadExcel}
              disabled={isExporting || suppliersList.length === 0}
              className="h-9 px-3.5 rounded-lg border border-border bg-background hover:bg-muted text-foreground text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isExporting ? "Exporting..." : "Download Excel"}</span>
            </button>

            <button
              type="button"
              onClick={handlePrintReport}
              disabled={suppliersList.length === 0}
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
                <th className="px-4 py-3.5 whitespace-nowrap">Reference</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Supplier</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Phone</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Branch</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Total Items</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Total Amount</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Total Paid</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Total Due</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Status</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Purchase Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {!activeFilters ? (
                /* Initial State Before Generating Report */
                <tr>
                  <td
                    colSpan={11}
                    className="px-4 py-16 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2 mx-auto">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1">
                        <Sparkles className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        Ready to generate supplier report
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Select a branch or supplier filter above, then click &quot;Generate Report&quot; to fetch the latest analytics.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : isLoadingSupplierReport ? (
                /* Loading State */
                <tr>
                  <td
                    colSpan={11}
                    className="px-4 py-16 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="h-7 w-7 text-primary animate-spin" />
                      <p className="text-sm font-medium">
                        Loading supplier report...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : suppliersList.length === 0 ? (
                /* Empty Results State */
                <tr>
                  <td
                    colSpan={11}
                    className="px-4 py-16 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Building2 className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm font-medium">No suppliers found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                /* Data Rows */
                suppliersList.map((row, idx) => {
                  const rowNum =
                    row.index ?? (currentPage - 1) * pageSize + idx + 1;
                  const statusNormalized = (row.status || "").toLowerCase();
                  return (
                    <tr
                      key={row.id || idx}
                      className="hover:bg-muted/40 transition-colors group"
                    >
                      {/* # */}
                      <td className="px-4 py-3 whitespace-nowrap font-mono text-xs text-muted-foreground">
                        {rowNum}
                      </td>

                      {/* Reference / Invoice / GRN */}
                      <td className="px-4 py-3 whitespace-nowrap font-mono text-xs text-foreground font-semibold">
                        {row.reference || row.invoiceNo || row.grnNo || "—"}
                      </td>

                      {/* Supplier */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-semibold text-foreground text-xs sm:text-sm">
                          {row.supplier}
                        </span>
                      </td>

                      {/* Phone */}
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                        {row.supplierPhone || "—"}
                      </td>

                      {/* Branch */}
                      <td className="px-4 py-3 text-foreground whitespace-nowrap text-xs">
                        {row.storeName || row.branchName || "—"}
                      </td>

                      {/* Total Items */}
                      <td className="px-4 py-3 font-bold text-foreground whitespace-nowrap text-xs">
                        {row.totalItems ?? 0}
                      </td>

                      {/* Total Amount */}
                      <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap text-xs">
                        {formatBDT(row.totalAmount)}
                      </td>

                      {/* Total Paid */}
                      <td className="px-4 py-3 font-medium text-emerald-500 whitespace-nowrap text-xs">
                        {formatBDT(row.totalPaid)}
                      </td>

                      {/* Total Due */}
                      <td className="px-4 py-3 whitespace-nowrap text-xs">
                        {(row.totalDue ?? 0) > 0 ? (
                          <span className="font-semibold text-rose-500">
                            {formatBDT(row.totalDue)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground font-medium">
                            {formatBDT(0)}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 whitespace-nowrap text-xs">
                        {statusNormalized === "received" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 capitalize">
                            <CheckCircle2 className="h-3 w-3" />
                            {row.status}
                          </span>
                        ) : statusNormalized === "returned" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 capitalize">
                            <XCircle className="h-3 w-3" />
                            {row.status}
                          </span>
                        ) : statusNormalized === "partial" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 capitalize">
                            <Clock className="h-3 w-3" />
                            {row.status}
                          </span>
                        ) : statusNormalized ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-muted text-muted-foreground border border-border capitalize">
                            <AlertCircle className="h-3 w-3" />
                            {row.status}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>

                      {/* Purchase Date */}
                      <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                        {row.purchaseDate || "—"}
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
