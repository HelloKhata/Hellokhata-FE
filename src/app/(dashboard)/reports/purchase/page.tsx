"use client";

import { useState, useEffect, useRef } from "react";
import {
  Download,
  Printer,
  RotateCcw,
  BarChart3,
  TrendingUp,
  CreditCard,
  Truck,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  Search,
  Users,
  Check,
  X,
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
import { useGetPurhcaseReport } from "@/hooks/api/useReports";
import { useParties } from "@/hooks/api/useParties";

// ============================================================================
// CONSTANTS & OPTIONS
// ============================================================================

const PAYMENT_STATUS_OPTIONS = [
  { value: "all", label: "All Payment Status" },
  { value: "paid", label: "Paid" },
  { value: "unpaid", label: "Unpaid" },
  { value: "partial", label: "Partial" },
];

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
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
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

export default function PurchaseReportPage() {
  const { isBangla } = useAppTranslation();
  const initialDates = getInitialDateRange();

  // 1. DRAFT FORM INPUT STATES (Only updated when typing / selecting)
  const [startDate, setStartDate] = useState(initialDates.start);
  const [endDate, setEndDate] = useState(initialDates.end);
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("all");
  const [selectedSupplierName, setSelectedSupplierName] = useState("All");
  const [supplierSearchQuery, setSupplierSearchQuery] = useState("");
  const [debouncedSupplierSearch, setDebouncedSupplierSearch] = useState("");
  const [showSupplierSuggestions, setShowSupplierSuggestions] = useState(false);
  const supplierDropdownRef = useRef<HTMLDivElement>(null);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("");

  // Table Pagination State
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // 2. ACTIVE QUERY FILTERS (Snapshot set ONLY on "Generate Report" or pagination)
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

  // 3. CONTROLLED QUERY HOOK
  // Bound strictly to activeFilters with enabled: !!activeFilters
  const {
    data: purchaseReportData,
    isLoading: isLoadingPurchaseReport,
    isFetching: isFetchingPurchaseReport,
  } = useGetPurhcaseReport(activeFilters, {
    enabled: Boolean(activeFilters),
  });

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

  const branchList = Array.isArray(branches)
    ? branches
    : Array.isArray((branches as any)?.data)
    ? (branches as any).data
    : Array.isArray((branches as any)?.branches)
    ? (branches as any).branches
    : [];

  // Parse response data
  const purchaseData: any[] = purchaseReportData?.data || [];
  const summary = purchaseReportData?.summary;
  const meta = purchaseReportData?.meta;

  const totalEntries = meta?.total ?? purchaseData.length;
  const totalPages =
    meta?.totalPages ?? Math.max(1, Math.ceil(totalEntries / pageSize));

  // 4. ACTION HANDLERS
  // Snapshots current form input state into activeFilters
  const handleGenerateReport = () => {
    setCurrentPage(1);
    setActiveFilters({
      startDate,
      endDate,
      branchId: selectedStore === "all" ? undefined : selectedStore || undefined,
      supplierId:
        selectedSupplier === "all" || !selectedSupplier
          ? undefined
          : selectedSupplier,
      paymentStatus:
        selectedPaymentStatus === "all"
          ? undefined
          : selectedPaymentStatus || undefined,
      page: 1,
      limit: pageSize,
    });
  };

  // Handles page navigation while keeping filters stable
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (activeFilters) {
      setActiveFilters((prev: any) => ({
        ...prev,
        page: newPage,
      }));
    }
  };

  // Handle Reset Filter: resets draft form controls without wiping current screen
  const handleResetFilter = () => {
    const dates = getInitialDateRange();
    setStartDate(dates.start);
    setEndDate(dates.end);
    setSelectedStore("");
    setSelectedSupplier("all");
    setSelectedSupplierName("All");
    setSupplierSearchQuery("");
    setShowSupplierSuggestions(false);
    setSelectedPaymentStatus("");
  };

  // Handle Export Excel / CSV
  const handleDownloadExcel = () => {
    setIsExporting(true);
    try {
      if (!purchaseData || purchaseData.length === 0) return;
      const headers = [
        "#",
        "Invoice No",
        "Supplier",
        "Store / Warehouse",
        "Purchase Type",
        "Total Products",
        "Responsible Person",
        "Grand Total",
        "Paid Amount",
        "Due Amount",
        "Payment Status",
        "Date",
      ];

      const csvRows = [
        headers.join(","),
        ...purchaseData.map((row: any, idx: number) =>
          [
            row.index ?? (currentPage - 1) * pageSize + idx + 1,
            `"${row.invoiceNo || row.billNo || ""}"`,
            `"${(row.supplierName || "—").replace(/"/g, '""')}"`,
            `"${(row.storeOrWarehouse || row.branch || "—").replace(/"/g, '""')}"`,
            `"${(row.type || row.purchaseType || "—").replace(/"/g, '""')}"`,
            row.totalProducts ?? 0,
            `"${(row.responsiblePerson || "—").replace(/"/g, '""')}"`,
            Number(row.grandTotal || 0).toFixed(2),
            Number(row.paidAmount || 0).toFixed(2),
            Number(row.dueAmount || 0).toFixed(2),
            `"${(row.paymentStatus || "—").replace(/"/g, '""')}"`,
            `"${formatDateTime(row.date || row.createdAt)}"`,
          ].join(",")
        ),
      ];

      const blob = new Blob([csvRows.join("\n")], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `Purchase_Report_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setTimeout(() => setIsExporting(false), 500);
    }
  };

  // Handle Print Report
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12 print:p-0 print:space-y-4">
      {/* ================================================================== */}
      {/* 1. PAGE HEADER                                                     */}
      {/* ================================================================== */}
      <PageHeader
        title="Purchase Reports"
        subtitle="Manage and analyse your purchase data"
        showBack
      />

      {/* ================================================================== */}
      {/* 2. FILTER CARD                                                     */}
      {/* ================================================================== */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm print:hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Row 1: Choose Date */}
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

          {/* Row 1: Branch */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Branch
            </label>
            <Select value={selectedStore} onValueChange={setSelectedStore}>
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
                ) : Array.isArray(branches) ? (
                  branches.map((opt: any) => (
                    <SelectItem
                      key={opt.id || opt.value}
                      value={String(opt.id || opt.value)}
                    >
                      {opt.name || opt.label}
                    </SelectItem>
                  ))
                ) : null}
              </SelectContent>
            </Select>
          </div>

          {/* Row 1: Supplier (Searchable Dropdown) */}
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
                    className="p-0.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Reset to All Suppliers"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                <Search className="h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              </div>

              {showSupplierSuggestions && (
                <div className="absolute z-50 left-0 right-0 top-full mt-1 w-full bg-card border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto divide-y divide-border text-foreground">
                  {/* Option 1: All Suppliers (Default) */}
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
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
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

          {/* Row 1: Payment Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Payment Status
            </label>
            <Select
              value={selectedPaymentStatus}
              onValueChange={setSelectedPaymentStatus}
            >
              <SelectTrigger className="w-full h-10 rounded-lg border-input bg-background text-foreground text-sm focus:border-primary/60 focus:ring-1 focus:ring-primary/20">
                <SelectValue placeholder="Select Payment Status" />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover text-popover-foreground">
                <SelectItem value="all">All Payment Status</SelectItem>
                {PAYMENT_STATUS_OPTIONS.filter((opt) => opt.value !== "all").map(
                  (opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Row 2: Action Buttons */}
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
      {/* 3. FOUR KPI CARDS (Horizontal Layout matching Sales Page)           */}
      {/* ================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Purchases — Indigo */}
        <div className="relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-card p-4 sm:p-5 shadow-sm transition-all duration-200 hover:border-indigo-500/40 hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-indigo-500 flex items-center justify-center text-white shrink-0 shadow-sm">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-semibold text-muted-foreground truncate">
                Total Purchases
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {activeFilters
                  ? formatKpiNumber(summary?.totalPurchases ?? totalEntries)
                  : "0"}
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Total Grand Total — Teal */}
        <div className="relative overflow-hidden rounded-2xl border border-teal-500/25 bg-card p-4 sm:p-5 shadow-sm transition-all duration-200 hover:border-teal-500/40 hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-teal-500 flex items-center justify-center text-white shrink-0 shadow-sm">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-semibold text-muted-foreground truncate">
                Total Grand Total
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {activeFilters
                  ? `৳${formatKpiNumber(summary?.totalGrandTotal ?? 0)}`
                  : "৳0"}
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Total Paid Amount — Emerald */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-card p-4 sm:p-5 shadow-sm transition-all duration-200 hover:border-emerald-500/40 hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-sm">
              <CreditCard className="h-6 w-6" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-semibold text-muted-foreground truncate">
                Total Paid Amount
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {activeFilters
                  ? `৳${formatKpiNumber(summary?.totalPaidAmount ?? 0)}`
                  : "৳0"}
              </p>
            </div>
          </div>
        </div>

        {/* Card 4: Total Due Amount — Rose */}
        <div className="relative overflow-hidden rounded-2xl border border-rose-500/25 bg-card p-4 sm:p-5 shadow-sm transition-all duration-200 hover:border-rose-500/40 hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-rose-500 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Truck className="h-6 w-6" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-semibold text-muted-foreground truncate">
                Total Due Amount
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {activeFilters
                  ? `৳${formatKpiNumber(summary?.totalDueAmount ?? 0)}`
                  : "৳0"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* 4. PURCHASE REPORT DATA TABLE CARD                                 */}
      {/* ================================================================== */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {/* Table Header Bar */}
        <div className="px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/40">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-foreground tracking-tight">
              Purchase Report
            </h2>
            {isFetchingPurchaseReport && !isLoadingPurchaseReport && (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            )}
          </div>

          <div className="flex items-center gap-2.5 print:hidden">
            <button
              type="button"
              onClick={handleDownloadExcel}
              disabled={isExporting || purchaseData.length === 0}
              className="h-9 px-3.5 rounded-lg border border-border bg-background hover:bg-muted text-foreground text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isExporting ? "Exporting..." : "Download Excel"}</span>
            </button>

            <button
              type="button"
              onClick={handlePrintReport}
              disabled={purchaseData.length === 0}
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
                <th className="px-4 py-3.5 whitespace-nowrap">Invoice No</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Supplier</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Store / Warehouse</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Purchase Type</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Total Products</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Responsible Person</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Grand Total</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Paid Amount</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Due Amount</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Payment Status</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {!activeFilters ? (
                /* Initial First Load Prompt */
                <tr>
                  <td
                    colSpan={12}
                    className="px-4 py-16 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2 mx-auto">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1">
                        <Sparkles className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        Ready to generate purchase report
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Select your desired date range and filters above, then click &ldquo;Generate Report&rdquo; to fetch the latest purchase records.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : isLoadingPurchaseReport ? (
                /* Loading State */
                <tr>
                  <td
                    colSpan={12}
                    className="px-4 py-16 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="h-7 w-7 text-primary animate-spin" />
                      <p className="text-sm font-medium">
                        Loading purchase report...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : purchaseData.length === 0 ? (
                /* Empty State */
                <tr>
                  <td
                    colSpan={12}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm font-medium">
                        No purchase records found
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Try adjusting your date range or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                /* Render Data Rows */
                purchaseData.map((row: any, idx: number) => {
                  const rowNumber =
                    row.index ?? (currentPage - 1) * pageSize + idx + 1;
                  const paymentStatusKey = String(
                    row.paymentStatus || ""
                  ).toLowerCase();

                  return (
                    <tr
                      key={row.id || row.invoiceNo || idx}
                      className="hover:bg-muted/40 transition-colors group"
                    >
                      {/* # */}
                      <td className="px-4 py-3 font-mono text-muted-foreground text-xs whitespace-nowrap">
                        {rowNumber}
                      </td>

                      {/* Invoice No */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-semibold text-primary font-mono text-xs group-hover:underline cursor-pointer block">
                          {row.invoiceNo || row.billNo || "—"}
                        </span>
                      </td>

                      {/* Supplier */}
                      <td className="px-4 py-3 whitespace-nowrap text-foreground font-medium text-xs">
                        {row.supplierName || "—"}
                      </td>

                      {/* Store / Warehouse */}
                      <td className="px-4 py-3 text-foreground whitespace-nowrap text-xs">
                        {row.storeOrWarehouse || row.branch || "—"}
                      </td>

                      {/* Purchase Type */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-muted text-muted-foreground border border-border">
                          {row.type || row.purchaseType || "—"}
                        </span>
                      </td>

                      {/* Total Products */}
                      <td className="px-4 py-3 font-semibold text-foreground whitespace-nowrap text-xs">
                        {row.totalProducts ?? 0}
                      </td>

                      {/* Responsible Person */}
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs">
                        {row.responsiblePerson || "—"}
                      </td>

                      {/* Grand Total */}
                      <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                        {formatBDT(row.grandTotal)}
                      </td>

                      {/* Paid Amount */}
                      <td className="px-4 py-3 font-medium text-emerald-500 whitespace-nowrap">
                        {formatBDT(row.paidAmount)}
                      </td>

                      {/* Due Amount */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {(row.dueAmount ?? 0) > 0 ? (
                          <span className="font-semibold text-rose-500">
                            {formatBDT(row.dueAmount)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground font-medium">
                            {formatBDT(0)}
                          </span>
                        )}
                      </td>

                      {/* Payment Status */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {paymentStatusKey === "paid" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="h-3 w-3" />
                            Paid
                          </span>
                        )}
                        {paymentStatusKey === "partial" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            <Clock className="h-3 w-3" />
                            Partial
                          </span>
                        )}
                        {(paymentStatusKey === "due" ||
                          paymentStatusKey === "unpaid") && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                            <AlertCircle className="h-3 w-3" />
                            Unpaid
                          </span>
                        )}
                        {![
                          "paid",
                          "partial",
                          "due",
                          "unpaid",
                        ].includes(paymentStatusKey) && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-muted text-muted-foreground border border-border capitalize">
                            {row.paymentStatus || "—"}
                          </span>
                        )}
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
