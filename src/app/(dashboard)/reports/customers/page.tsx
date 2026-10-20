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
  Users,
  User,
  UserCheck,
  Check,
  Search,
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
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/common";
import { PaginationHelper } from "@/components/shared/PaginationHelper";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useGetBranches } from "@/hooks/api/useBranches";
import { useParties } from "@/hooks/api/useParties";
import { useGetCustomerReport } from "@/hooks/api/useReports";

// ============================================================================
// TYPES
// ============================================================================

export interface CustomerReportRow {
  index?: number;
  id: string;
  customer: string;
  reference?: string;
  phone?: string;
  email?: string;
  address?: string;
  storeName?: string;
  branchName?: string;
  totalOrders: number;
  totalOrderAmount: number;
  totalPaid: number;
  totalDue: number;
  currentBalance: number;
  lastOrderDate?: string;
  lastOrderDateIso?: string | null;
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

export default function CustomerReportPage() {
  const { isBangla } = useAppTranslation();

  // 1. DRAFT FORM INPUT STATES
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("all");
  const [selectedCustomerName, setSelectedCustomerName] = useState("All");
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [debouncedCustomerSearch, setDebouncedCustomerSearch] = useState("");
  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
  const customerDropdownRef = useRef<HTMLDivElement>(null);

  // Table Pagination State
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // 2. ACTIVE QUERY FILTERS (Set ONLY on Generate Report or pagination)
  const [activeFilters, setActiveFilters] = useState<any>(null);

  // Debounce customer search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCustomerSearch(customerSearchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [customerSearchQuery]);

  // Click outside to close customer suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        customerDropdownRef.current &&
        !customerDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCustomerSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Auxiliary API Data: Branches & Customers
  const { data: branches, isLoading: isBranchesLoading } = useGetBranches();
  const { data: partiesData = [], isLoading: isLoadingParties } = useParties({
    type: "customer",
    search: debouncedCustomerSearch || undefined,
    includeWalkIn: true,
  });

  // Controlled Report Hook
  const {
    data: customerReportData,
    isLoading: isLoadingCustomerReport,
    isFetching: isFetchingCustomerReport,
  } = useGetCustomerReport(activeFilters, {
    enabled: Boolean(activeFilters),
  });

  const branchList = Array.isArray(branches)
    ? branches
    : Array.isArray((branches as any)?.data)
    ? (branches as any).data
    : Array.isArray((branches as any)?.branches)
    ? (branches as any).branches
    : [];

  const customerParties: any[] = Array.isArray(partiesData)
    ? partiesData
    : Array.isArray((partiesData as any)?.data)
    ? (partiesData as any).data
    : [];

  const handleSelectCustomer = (party: any) => {
    if (!party || party === "all" || party.id === "all") {
      setSelectedCustomer("all");
      setSelectedCustomerName("All");
      setCustomerSearchQuery("");
    } else if (party === "walk-in" || party.id === "walk-in" || party.isWalkIn) {
      const walkIn = customerParties.find(
        (p: any) =>
          p.isWalkIn ||
          p.id === "walk-in" ||
          p.name?.toLowerCase().includes("walk-in")
      );
      setSelectedCustomer(walkIn?.id || walkIn?._id || "walk-in");
      setSelectedCustomerName("Walk-in Customer");
      setCustomerSearchQuery("");
    } else {
      setSelectedCustomer(party.id || party._id);
      setSelectedCustomerName(party.name);
      setCustomerSearchQuery("");
    }
    setShowCustomerSuggestions(false);
  };

  const customersList: CustomerReportRow[] = customerReportData?.data || [];
  const summary = customerReportData?.summary;
  const meta = customerReportData?.meta;

  const totalEntries = meta?.total ?? customersList.length;
  const totalPages =
    meta?.totalPages ?? Math.max(1, Math.ceil(totalEntries / pageSize));

  // 3. ACTION HANDLERS
  const handleGenerateReport = () => {
    setCurrentPage(1);
    setActiveFilters({
      branchId:
        selectedBranch === "all" ? undefined : selectedBranch || undefined,
      customerId:
        selectedCustomer === "all" || !selectedCustomer
          ? undefined
          : selectedCustomer,
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
    setSelectedCustomer("all");
    setSelectedCustomerName("All");
    setCustomerSearchQuery("");
    setShowCustomerSuggestions(false);
  };

  // Handle Export Excel / CSV
  const handleDownloadExcel = () => {
    setIsExporting(true);
    try {
      if (!customersList || customersList.length === 0) return;

      const headers = [
        "#",
        "Customer",
        "Phone / Reference",
        "Email",
        "Address",
        "Branch",
        "Total Orders",
        "Total Order Amount",
        "Total Paid",
        "Total Due",
        "Current Balance",
        "Last Order Date",
      ];

      const csvRows = [
        headers.join(","),
        ...customersList.map((customer, idx) => {
          const rowNum =
            customer.index ?? (currentPage - 1) * pageSize + idx + 1;
          return [
            rowNum,
            `"${(customer.customer || "—").replace(/"/g, '""')}"`,
            `"${(customer.phone || customer.reference || "").replace(/"/g, '""')}"`,
            `"${(customer.email || "").replace(/"/g, '""')}"`,
            `"${(customer.address || "").replace(/"/g, '""')}"`,
            `"${(customer.storeName || customer.branchName || "—").replace(/"/g, '""')}"`,
            customer.totalOrders ?? 0,
            Number(customer.totalOrderAmount || 0).toFixed(2),
            Number(customer.totalPaid || 0).toFixed(2),
            Number(customer.totalDue || 0).toFixed(2),
            Number(customer.currentBalance || 0).toFixed(2),
            `"${customer.lastOrderDate || "—"}"`,
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
        `Customer_Report_${new Date().toISOString().slice(0, 10)}.csv`
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
        title="Customer Reports"
        subtitle="Manage and analyse your customer sales and order data"
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

          {/* Customer Filter */}
          <div ref={customerDropdownRef} className="space-y-1.5 relative">
            <label className="text-xs font-semibold text-foreground">
              Customer
            </label>
            <div className="relative">
              <input
                type="text"
                value={
                  showCustomerSuggestions
                    ? customerSearchQuery
                    : selectedCustomerName || "All"
                }
                onChange={(e) => {
                  setCustomerSearchQuery(e.target.value);
                  if (!showCustomerSuggestions) setShowCustomerSuggestions(true);
                }}
                onFocus={() => {
                  setShowCustomerSuggestions(true);
                }}
                placeholder="Search customer / phone..."
                className="w-full h-10 rounded-lg border border-input bg-background px-3 pr-8 text-xs sm:text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:ring-1 focus:ring-primary/20 placeholder:text-muted-foreground"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {selectedCustomer && selectedCustomer !== "all" && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectCustomer("all");
                    }}
                    className="h-4 w-4 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center text-[10px] cursor-pointer"
                    title="Clear customer filter"
                  >
                    ×
                  </button>
                )}
                <Search className="h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>

              {/* Suggestions dropdown list */}
              {showCustomerSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-lg border border-border bg-popover shadow-xl z-50 divide-y divide-border">
                  {/* Option 1: All Customers */}
                  <button
                    type="button"
                    className={cn(
                      "w-full text-left p-2.5 hover:bg-muted/80 text-xs transition-colors flex items-center justify-between cursor-pointer",
                      (selectedCustomer === "all" || !selectedCustomer) &&
                        "bg-primary/10 text-primary font-medium"
                    )}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectCustomer("all");
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
                    {(selectedCustomer === "all" || !selectedCustomer) && (
                      <Check className="h-3.5 w-3.5 text-primary" />
                    )}
                  </button>

                  {/* Option 2: Walk-in Customer */}
                  <button
                    type="button"
                    className={cn(
                      "w-full text-left p-2.5 hover:bg-muted/80 text-xs transition-colors flex items-center justify-between cursor-pointer",
                      (selectedCustomer === "walk-in" ||
                        selectedCustomerName === "Walk-in Customer") &&
                        "bg-primary/10 text-primary font-medium"
                    )}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectCustomer("walk-in");
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-semibold text-foreground">
                        Walk-in Customer
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                        Walk-in
                      </span>
                    </div>
                    {(selectedCustomer === "walk-in" ||
                      selectedCustomerName === "Walk-in Customer") && (
                      <Check className="h-3.5 w-3.5 text-primary" />
                    )}
                  </button>

                  {/* Option 3: Search / Registered Customers */}
                  {isLoadingParties ? (
                    <div className="p-3 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                      <span>Loading customers...</span>
                    </div>
                  ) : customerParties.length === 0 ? (
                    <div className="p-3 text-center text-xs text-muted-foreground">
                      No customers found
                    </div>
                  ) : (
                    customerParties
                      .filter(
                        (p: any) =>
                          !p.isWalkIn &&
                          !p.name?.toLowerCase().includes("walk-in") &&
                          !p.name?.toLowerCase().includes("walking") &&
                          p.id !== "walk-in" &&
                          p._id !== "walk-in"
                      )
                      .map((party: any) => {
                        const partyId = party.id || party._id;
                        const isSelected = selectedCustomer === partyId;
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
                              handleSelectCustomer(party);
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
        {/* Total Order Amount */}
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
                  ? formatBDT(summary?.totalOrderAmount ?? 0)
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

        {/* Total Orders */}
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/25 bg-card p-4 shadow-sm transition-all duration-200 hover:border-amber-500/45 hover:-translate-y-0.5">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-amber-500 flex items-center justify-center text-white shrink-0 shadow-sm">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-semibold text-muted-foreground truncate">
                Total Orders
              </p>
              <p className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                {activeFilters
                  ? formatKpiNumber(summary?.totalOrders ?? 0)
                  : "0"}
              </p>
            </div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="relative overflow-hidden rounded-2xl border border-violet-500/25 bg-card p-4 shadow-sm transition-all duration-200 hover:border-violet-500/40 hover:-translate-y-0.5">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-violet-500 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Users className="h-5 w-5" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-semibold text-muted-foreground truncate">
                Total Customers
              </p>
              <p className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                {activeFilters
                  ? formatKpiNumber(summary?.totalCustomers ?? totalEntries)
                  : "0"}
              </p>
            </div>
          </div>
        </div>

        {/* Active Customers */}
        <div className="relative overflow-hidden rounded-2xl border border-teal-500/25 bg-card p-4 shadow-sm transition-all duration-200 hover:border-teal-500/40 hover:-translate-y-0.5">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-teal-500 flex items-center justify-center text-white shrink-0 shadow-sm">
              <UserCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-semibold text-muted-foreground truncate">
                Active Customers
              </p>
              <p className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                {activeFilters
                  ? formatKpiNumber(summary?.activeCustomers ?? 0)
                  : "0"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* 4. CUSTOMER REPORT DATA TABLE CARD                                 */}
      {/* ================================================================== */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {/* Table Header Bar */}
        <div className="px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/40">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-foreground tracking-tight">
              Customer Report
            </h2>
            {isFetchingCustomerReport && !isLoadingCustomerReport && (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            )}
          </div>

          <div className="flex items-center gap-2.5 print:hidden">
            <button
              type="button"
              onClick={handleDownloadExcel}
              disabled={isExporting || customersList.length === 0}
              className="h-9 px-3.5 rounded-lg border border-border bg-background hover:bg-muted text-foreground text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isExporting ? "Exporting..." : "Download Excel"}</span>
            </button>

            <button
              type="button"
              onClick={handlePrintReport}
              disabled={customersList.length === 0}
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
                <th className="px-4 py-3.5 whitespace-nowrap">Customer</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Phone</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Branch</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Total Orders</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Total Order Amount</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Total Paid</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Total Due</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Current Balance</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Last Order Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {!activeFilters ? (
                /* Initial State Before Generating Report */
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-16 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2 mx-auto">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1">
                        <Sparkles className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        Ready to generate customer report
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Select a branch or customer filter above, then click &quot;Generate Report&quot; to fetch the latest analytics.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : isLoadingCustomerReport ? (
                /* Loading State */
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-16 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="h-7 w-7 text-primary animate-spin" />
                      <p className="text-sm font-medium">
                        Loading customer report...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : customersList.length === 0 ? (
                /* Empty Results State */
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-16 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm font-medium">No customers found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                /* Data Rows */
                customersList.map((customer, idx) => {
                  const rowNum =
                    customer.index ?? (currentPage - 1) * pageSize + idx + 1;
                  return (
                    <tr
                      key={customer.id || idx}
                      className="hover:bg-muted/40 transition-colors group"
                    >
                      {/* # */}
                      <td className="px-4 py-3 whitespace-nowrap font-mono text-xs text-muted-foreground">
                        {rowNum}
                      </td>

                      {/* Customer & Email */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground text-xs sm:text-sm">
                            {customer.customer}
                          </span>
                          {customer.email && customer.email !== "-" && (
                            <span className="text-[11px] text-muted-foreground font-mono">
                              {customer.email}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Phone / Reference */}
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                        {customer.phone || customer.reference || "—"}
                      </td>

                      {/* Branch */}
                      <td className="px-4 py-3 text-foreground whitespace-nowrap text-xs">
                        {customer.storeName || customer.branchName || "—"}
                      </td>

                      {/* Total Orders */}
                      <td className="px-4 py-3 font-bold text-foreground whitespace-nowrap text-xs">
                        {customer.totalOrders ?? 0}
                      </td>

                      {/* Total Order Amount */}
                      <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap text-xs">
                        {formatBDT(customer.totalOrderAmount)}
                      </td>

                      {/* Total Paid */}
                      <td className="px-4 py-3 font-medium text-emerald-500 whitespace-nowrap text-xs">
                        {formatBDT(customer.totalPaid)}
                      </td>

                      {/* Total Due */}
                      <td className="px-4 py-3 whitespace-nowrap text-xs">
                        {(customer.totalDue ?? 0) > 0 ? (
                          <span className="font-semibold text-rose-500">
                            {formatBDT(customer.totalDue)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground font-medium">
                            {formatBDT(0)}
                          </span>
                        )}
                      </td>

                      {/* Current Balance */}
                      <td className="px-4 py-3 whitespace-nowrap text-xs">
                        {(customer.currentBalance ?? 0) > 0 ? (
                          <span className="font-semibold text-rose-500">
                            {formatBDT(customer.currentBalance)}
                          </span>
                        ) : (customer.currentBalance ?? 0) < 0 ? (
                          <span className="font-semibold text-emerald-500">
                            {formatBDT(Math.abs(customer.currentBalance))} (Adv)
                          </span>
                        ) : (
                          <span className="text-muted-foreground font-medium">
                            {formatBDT(0)}
                          </span>
                        )}
                      </td>

                      {/* Last Order Date */}
                      <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                        {customer.lastOrderDate || "—"}
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
