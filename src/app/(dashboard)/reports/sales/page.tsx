"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Calendar,
  Download,
  Printer,
  RotateCcw,
  BarChart3,
  TrendingUp,
  CreditCard,
  ShoppingBag,
  Sparkles,
  Package,
  Trophy,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Loader2,
  Search,
  User,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/common";
import { PaginationHelper } from "@/components/shared/PaginationHelper";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useGetBranches } from "@/hooks/api/useBranches";
import { useGetBestSellingProducts, useGetSalesReport } from "@/hooks/api/useReports";
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
  start.setDate(end.getDate() - 7);
  return {
    start: formatInputDate(start),
    end: formatInputDate(end),
  };
};

// ============================================================================
// COMPONENT
// ============================================================================

export default function SalesReportPage() {
  const { isBangla } = useAppTranslation();
  const initialDates = getInitialDateRange();

  // Tab 1 (Sales Report) Filter States
  const [startDate, setStartDate] = useState(initialDates.start);
  const [endDate, setEndDate] = useState(initialDates.end);
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("all");
  const [selectedCustomerName, setSelectedCustomerName] = useState("All");
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [debouncedCustomerSearch, setDebouncedCustomerSearch] = useState("");
  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
  const customerDropdownRef = useRef<HTMLDivElement>(null);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("");

  // Tab 2 (Best Selling) Filter States
  const [bsStartDate, setBsStartDate] = useState(initialDates.start);
  const [bsEndDate, setBsEndDate] = useState(initialDates.end);
  const [bsSelectedStore, setBsSelectedStore] = useState("");

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

  // Sub-menu tab
  const [activeTab, setActiveTab] = useState<"sales-report" | "best-selling">("sales-report");

  // Table Pagination State
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Best Selling filter
  const [bsPageSize, setBsPageSize] = useState(10);
  const [bsCurrentPage, setBsCurrentPage] = useState(1);

  // api data
  const { data: branches, isLoading: isBranchesLoading } = useGetBranches();
  const { data: partiesData = [], isLoading: isLoadingParties } = useParties({
    type: "customer",
    search: debouncedCustomerSearch || undefined,
    includeWalkIn: true,
  });
  const { data: salesReportData, refetch: refetchReport, isLoading: isLoadingSalesReport } = useGetSalesReport(
    {
      startDate,
      endDate,
      branchId: selectedStore === "all" ? undefined : selectedStore || undefined,
      customerId: selectedCustomer === "all" || !selectedCustomer ? undefined : selectedCustomer,
      paymentStatus: selectedPaymentStatus === "all" ? undefined : selectedPaymentStatus || undefined,
      page: currentPage,
      limit: pageSize,
    },
    { enabled: false }
  );
  
  const {
    data: getBestSellingData,
    refetch: refetchBestSellingReport,
    isLoading: isLoadingBestSelling,
  } = useGetBestSellingProducts(
    {
      startDate: bsStartDate,
      endDate: bsEndDate,
      branchId: bsSelectedStore === "all" ? undefined : bsSelectedStore || undefined,
      page: bsCurrentPage,
      limit: bsPageSize,
    },
    { enabled: false }
  );
 
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
        (p: any) => p.isWalkIn || p.id === "walk-in" || p.name?.toLowerCase().includes("walk-in")
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
    setCurrentPage(1);
  };

  const salesData: any[] =
     salesReportData?.data
    || [];

  const totalEntries = salesReportData?.meta?.total ?? salesData.length;
  const salesTotalPages =
    salesReportData?.meta?.totalPages ??
    Math.max(1, Math.ceil(totalEntries / pageSize));

  const branchList = Array.isArray(branches)
    ? branches
    : Array.isArray((branches as any)?.data)
    ? (branches as any).data
    : Array.isArray((branches as any)?.branches)
    ? (branches as any).branches
    : [];

  const bestSellingList: any[] = Array.isArray(getBestSellingData?.data)
    ? getBestSellingData.data
    : Array.isArray(getBestSellingData)
    ? getBestSellingData
    : [];

  const bsTotalEntries =
    getBestSellingData?.meta?.total ?? bestSellingList.length;
  const bsTotalPages =
    getBestSellingData?.meta?.totalPages ??
    Math.max(1, Math.ceil(bsTotalEntries / bsPageSize));

  // KPI calculations for Best Selling (100% dynamic from summary)
  const bsSummary = getBestSellingData?.summary;
  const bsTotalProducts = bsSummary?.totalProducts ?? bestSellingList.length;
  const bsTotalSoldQty =
    bsSummary?.totalSoldQty ??
    bestSellingList.reduce(
      (s: number, p: any) => s + (Number(p.soldQty) || 0),
      0
    );
  const bsTotalSoldAmount =
    bsSummary?.totalSoldAmount ??
    bestSellingList.reduce(
      (s: number, p: any) => s + (Number(p.soldAmount) || 0),
      0
    );

  // Handle Generate Report
  const handleGenerateReport = () => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      refetchReport();
    }
  };

  // Handle Reset Filter for Best Selling
  const handleResetBsFilter = () => {
    const dates = getInitialDateRange();
    setBsStartDate(dates.start);
    setBsEndDate(dates.end);
    setBsSelectedStore("");
    if (bsCurrentPage !== 1) {
      setBsCurrentPage(1);
    }
  };

  // Handle Generate Report for Best Selling
  const handleGenerateBsReport = () => {
    if (bsCurrentPage !== 1) {
      setBsCurrentPage(1);
    } else {
      refetchBestSellingReport();
    }
  };

  // Handle Reset Filter
  const handleResetFilter = () => {
    const dates = getInitialDateRange();
    setStartDate(dates.start);
    setEndDate(dates.end);
    setSelectedStore("");
    setSelectedCustomer("all");
    setSelectedCustomerName("All");
    setCustomerSearchQuery("");
    setShowCustomerSuggestions(false);
    setSelectedPaymentStatus("");
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  // Handle Export Excel / CSV
  const handleDownloadExcel = () => {
    setIsExporting(true);
    try {
      if (activeTab === "sales-report") {
        if (!salesData || salesData.length === 0) return;
        const headers = [
          "#",
          "Invoice No",
          "Customer",
          "Grand Total",
          "Payable Total",
          "Paid Amount",
          "Due Amount",
          "Branch",
          "Status",
          "Payment Status",
          "Created At",
        ];

        const csvRows = [
          headers.join(","),
          ...salesData.map((row: any, idx: number) =>
            [
              row.index ?? (currentPage - 1) * pageSize + idx + 1,
              `"${row.invoiceNo || ""}"`,
              `"${(row.customer || "Walk-in Customer").replace(/"/g, '""')}"`,
              Number(row.grandTotal || 0).toFixed(2),
              Number(row.payableTotal || 0).toFixed(2),
              Number(row.paidAmount || 0).toFixed(2),
              Number(row.dueAmount || 0).toFixed(2),
              `"${(row.store || "").replace(/"/g, '""')}"`,
              `"${(row.status || "").replace(/"/g, '""')}"`,
              `"${(row.paymentStatus || "").replace(/"/g, '""')}"`,
              `"${formatDateTime(row.createdAt)}"`,
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
          `Sales_Report_${new Date().toISOString().slice(0, 10)}.csv`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        if (!bestSellingList || bestSellingList.length === 0) return;
        const headers = [
          "#",
          "Product Name",
          "SKU",
          "Category",
          "Brand",
          "Sold Qty",
          "In-Stock Qty",
          "Sold Amount",
        ];

        const csvRows = [
          headers.join(","),
          ...bestSellingList.map((product: any, idx: number) =>
            [
              product.index ?? (bsCurrentPage - 1) * bsPageSize + idx + 1,
              `"${(product.productName || "").replace(/"/g, '""')}"`,
              `"${(product.sku || "").replace(/"/g, '""')}"`,
              `"${(product.category || "").replace(/"/g, '""')}"`,
              `"${(product.brand || "").replace(/"/g, '""')}"`,
              Number(product.soldQty || 0),
              Number(product.inStockQty || 0),
              Number(product.soldAmount || 0).toFixed(2),
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
          `Best_Selling_Products_${new Date().toISOString().slice(0, 10)}.csv`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
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
        title="Sales Reports"
        subtitle="Manage and analyse your sales data"
        showBack
      />

      {/* ================================================================== */}
      {/* SUB-MENU TABS                                                       */}
      {/* ================================================================== */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="space-y-6">
        <TabsList className="bg-muted text-muted-foreground border p-1 rounded-lg w-full flex overflow-x-auto select-none scrollbar-none h-auto flex-nowrap shrink-0 print:hidden">
          <TabsTrigger value="sales-report" className="text-xs font-bold gap-1.5 px-4 py-2 shrink-0">
            <FileText className="h-3.5 w-3.5" />
            Sales Report
          </TabsTrigger>
          <TabsTrigger value="best-selling" className="text-xs font-bold gap-1.5 px-4 py-2 shrink-0">
            <Trophy className="h-3.5 w-3.5" />
            Best Selling
          </TabsTrigger>
        </TabsList>

        {/* ============================================================== */}
        {/* TAB 1: SALES REPORT                                             */}
        {/* ============================================================== */}
        <TabsContent value="sales-report" className="space-y-6 outline-none">

      {/* ================================================================== */}
      {/* 2. FILTER CARD                                                     */}
      {/* ================================================================== */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm print:hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Row 1: Choose Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Choose Date
            </label>
            <div className="relative flex items-center h-10 rounded-lg border border-input bg-background px-3 transition-colors focus-within:border-primary/60 focus-within:ring-1 focus-within:ring-primary/20">
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-transparent text-xs sm:text-sm text-foreground outline-none cursor-pointer"
              />
              <span className="text-muted-foreground px-2 select-none">→</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-transparent text-xs sm:text-sm text-foreground outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Row 1: Branch */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Branch
            </label>
            <Select
              value={selectedStore}
              onValueChange={(val) => {
                setSelectedStore(val);
                setCurrentPage(1);
              }}
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
                ) : Array.isArray(branches) ? (
                  branches.map((opt: any) => (
                    <SelectItem key={opt.id || opt.value} value={String(opt.id || opt.value)}>
                      {opt.name || opt.label}
                    </SelectItem>
                  ))
                ) : null}
              </SelectContent>
            </Select>
          </div>

          {/* Row 1: Customer */}
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
                    : (selectedCustomerName || "All")
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
                    className="p-0.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Reset to All Customers"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                <Search className="h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              </div>

              {showCustomerSuggestions && (
                <div className="absolute z-50 left-0 right-0 top-full mt-1 w-full bg-card border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto divide-y divide-border text-foreground">
                  {/* Option 1: All Customers (Default) */}
                  <button
                    type="button"
                    className={cn(
                      "w-full text-left p-2.5 hover:bg-muted/80 text-xs transition-colors flex items-center justify-between cursor-pointer",
                      (selectedCustomer === "all" || !selectedCustomer) && "bg-primary/10 text-primary font-medium"
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
                      (selectedCustomer === "walk-in" || selectedCustomerName === "Walk-in Customer") && "bg-primary/10 text-primary font-medium"
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
                    {(selectedCustomer === "walk-in" || selectedCustomerName === "Walk-in Customer") && (
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

          {/* Row 2: Payment Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Payment Status
            </label>
            <Select
              value={selectedPaymentStatus}
              onValueChange={(val) => {
                setSelectedPaymentStatus(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full h-10 rounded-lg border-input bg-background text-foreground text-sm focus:border-primary/60 focus:ring-1 focus:ring-primary/20">
                <SelectValue placeholder="Select Payment Status" />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover text-popover-foreground">
                <SelectItem value="all">All Payment Status</SelectItem>
                {PAYMENT_STATUS_OPTIONS.filter((opt) => opt.value !== "all").map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Row 3: Action Buttons */}
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
      {/* 3. FOUR KPI CARDS (Horizontal Layout matching Image)              */}
      {/* ================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Units Sold — Primary Indigo */}
        <div className="relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-card p-4 sm:p-5 shadow-sm transition-all duration-200 hover:border-indigo-500/40 hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-indigo-500 flex items-center justify-center text-white shrink-0 shadow-sm">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-semibold text-muted-foreground truncate">
                Total Units Sold
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {formatKpiNumber(salesReportData?.summary?.totalUnitsSold ?? 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Total Sales Amount — Emerald (app secondary / positive) */}
        <div className="relative overflow-hidden rounded-2xl border border-teal-500/25 bg-card p-4 sm:p-5 shadow-sm transition-all duration-200 hover:border-teal-500/40 hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-teal-500 flex items-center justify-center text-white shrink-0 shadow-sm">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-semibold text-muted-foreground truncate">
                Total Sales Amount
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                ৳{formatKpiNumber(salesReportData?.summary?.totalSalesAmount ?? 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Total Paid — Emerald/success (positive financial metric) */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-card p-4 sm:p-5 shadow-sm transition-all duration-200 hover:border-emerald-500/40 hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-sm">
              <CreditCard className="h-6 w-6" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-semibold text-muted-foreground truncate">
                Total Paid
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                ৳{formatKpiNumber(salesReportData?.summary?.totalPaid ?? 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Card 4: Total Due — Destructive rose (negative/alert) */}
        <div className="relative overflow-hidden rounded-2xl border border-rose-500/25 bg-card p-4 sm:p-5 shadow-sm transition-all duration-200 hover:border-rose-500/40 hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-rose-500 flex items-center justify-center text-white shrink-0 shadow-sm">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-semibold text-muted-foreground truncate">
                Total Due
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                ৳{formatKpiNumber(salesReportData?.summary?.totalDue ?? 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* 4. SALES REPORT DATA TABLE CARD                                    */}
      {/* ================================================================== */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {/* Table Header Bar */}
        <div className="px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/40">
          <h2 className="text-base font-bold text-foreground tracking-tight">
            Sales Report
          </h2>

          <div className="flex items-center gap-2.5 print:hidden">
            <button
              type="button"
              onClick={handleDownloadExcel}
              disabled={isExporting}
              className="h-9 px-3.5 rounded-lg border border-border bg-background hover:bg-muted text-foreground text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isExporting ? "Exporting..." : "Download Excel"}</span>
            </button>

            <button
              type="button"
              onClick={handlePrintReport}
              className="h-9 px-3.5 rounded-lg border border-border bg-background hover:bg-muted text-foreground text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
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
                <th className="px-4 py-3.5 whitespace-nowrap">Customer</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Grand Total</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Payable Total</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Paid Amount</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Due Amount</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Branch</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Status</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Payment Status</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {isLoadingSalesReport ? (
                <tr>
                  <td
                    colSpan={11}
                    className="px-4 py-16 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="h-7 w-7 text-primary animate-spin" />
                      <p className="text-sm font-medium">Loading sales report...</p>
                    </div>
                  </td>
                </tr>
              ) : salesData.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm font-medium">No sales records found</p>
                      <p className="text-xs text-muted-foreground">
                        Try adjusting your date range or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                salesData.map((row: any, idx: number) => {
                  const rowNumber = row.index ?? (currentPage - 1) * pageSize + idx + 1;
                  const statusKey = String(row.status || "").toLowerCase();
                  const paymentStatusKey = String(row.paymentStatus || "").toLowerCase();

                  return (
                    <tr
                      key={row.id || row.invoiceNo || idx}
                      className="hover:bg-muted/40 transition-colors group"
                    >
                      <td className="px-4 py-3 font-mono text-muted-foreground text-xs whitespace-nowrap">
                        {rowNumber}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-semibold text-primary font-mono text-xs group-hover:underline cursor-pointer block">
                          {row.invoiceNo}
                        </span>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap text-foreground font-medium text-xs">
                        {row.customer || "Walk-in Customer"}
                      </td>

                      <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                        {formatBDT(row.grandTotal)}
                      </td>

                      <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                        {formatBDT(row.payableTotal)}
                      </td>

                      <td className="px-4 py-3 font-medium text-emerald-500 whitespace-nowrap">
                        {formatBDT(row.paidAmount)}
                      </td>

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

                      <td className="px-4 py-3 text-foreground whitespace-nowrap">
                        {row.store || "—"}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        {statusKey === "completed" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="h-3 w-3" />
                            Completed
                          </span>
                        )}
                        {statusKey === "returned" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                            <RotateCcw className="h-3 w-3" />
                            Returned
                          </span>
                        )}
                        {statusKey === "pending" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            <Clock className="h-3 w-3" />
                            Pending
                          </span>
                        )}
                        {statusKey === "processing" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                            <Clock className="h-3 w-3" />
                            Processing
                          </span>
                        )}
                        {statusKey === "cancelled" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                            <XCircle className="h-3 w-3" />
                            Cancelled
                          </span>
                        )}
                        {!["completed", "returned", "pending", "processing", "cancelled"].includes(statusKey) && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-muted text-muted-foreground border border-border capitalize">
                            {row.status || "—"}
                          </span>
                        )}
                      </td>

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
                        {(paymentStatusKey === "due" || paymentStatusKey === "unpaid") && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                            <AlertCircle className="h-3 w-3" />
                            Due
                          </span>
                        )}
                        {!["paid", "partial", "due", "unpaid"].includes(paymentStatusKey) && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-muted text-muted-foreground border border-border capitalize">
                            {row.paymentStatus || "—"}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                        {formatDateTime(row.createdAt)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Reusable Pagination */}
        {salesTotalPages > 1 && (
          <div className="px-6 pb-4 print:hidden">
            <PaginationHelper
              currentPage={currentPage}
              totalPages={salesTotalPages}
              onPageChange={setCurrentPage}
              isBangla={isBangla}
            />
          </div>
        )}
      </div>
        </TabsContent>

        {/* ============================================================== */}
        {/* TAB 2: BEST SELLING                                             */}
        {/* ============================================================== */}
        <TabsContent value="best-selling" className="space-y-6 outline-none">

          {/* ============================================================== */}
          {/* 1. FILTER CARD (Date & Branch)                                 */}
          {/* ============================================================== */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm print:hidden">
            <div className="flex flex-col lg:flex-row lg:items-end gap-4">
              {/* Choose Date */}
              <div className="space-y-1.5 flex-1 min-w-[260px]">
                <label className="text-xs font-semibold text-foreground">
                  Choose Date
                </label>
                <div className="relative flex items-center h-10 rounded-lg border border-input bg-background px-3 transition-colors focus-within:border-primary/60 focus-within:ring-1 focus-within:ring-primary/20">
                  <input
                    type="date"
                    value={bsStartDate}
                    onChange={(e) => {
                      setBsStartDate(e.target.value);
                      setBsCurrentPage(1);
                    }}
                    className="w-full bg-transparent text-xs sm:text-sm text-foreground outline-none cursor-pointer"
                  />
                  <span className="text-muted-foreground px-2 select-none">→</span>
                  <input
                    type="date"
                    value={bsEndDate}
                    onChange={(e) => {
                      setBsEndDate(e.target.value);
                      setBsCurrentPage(1);
                    }}
                    className="w-full bg-transparent text-xs sm:text-sm text-foreground outline-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Branch */}
              <div className="space-y-1.5 flex-1 min-w-[200px]">
                <label className="text-xs font-semibold text-foreground">
                  Branch
                </label>
                <Select
                  value={bsSelectedStore}
                  onValueChange={(val) => {
                    setBsSelectedStore(val);
                    setBsCurrentPage(1);
                  }}
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
                    ) : Array.isArray(branches) ? (
                      branches.map((opt: any) => (
                        <SelectItem key={opt.id || opt.value} value={String(opt.id || opt.value)}>
                          {opt.name || opt.label}
                        </SelectItem>
                      ))
                    ) : null}
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 pt-2 lg:pt-0 shrink-0">
                <button
                  type="button"
                  onClick={handleGenerateBsReport}
                  disabled={isLoadingBestSelling}
                  className="h-10 px-5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm transition-all duration-150 flex items-center justify-center gap-2 active:scale-[0.98] shadow-sm cursor-pointer whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoadingBestSelling ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  <span>Generate Report</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetBsFilter}
                  className="h-10 px-5 rounded-lg border border-border bg-background hover:bg-muted text-foreground font-medium text-sm transition-all duration-150 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4 text-muted-foreground" />
                  <span>Reset Filter</span>
                </button>

               
              </div>
            </div>
          </div>

          {/* Best Selling KPI Strip (Dynamic Summary: totalProducts, totalSoldQty, totalSoldAmount) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-card p-4 sm:p-5 shadow-sm transition-all duration-200 hover:border-indigo-500/40 hover:-translate-y-0.5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-indigo-500 flex items-center justify-center text-white shrink-0 shadow-sm">
                  <Trophy className="h-6 w-6" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs font-semibold text-muted-foreground truncate">Top Products</p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                    {bsTotalProducts}
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-teal-500/25 bg-card p-4 sm:p-5 shadow-sm transition-all duration-200 hover:border-teal-500/40 hover:-translate-y-0.5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-teal-500 flex items-center justify-center text-white shrink-0 shadow-sm">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs font-semibold text-muted-foreground truncate">Total Sold Qty</p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                    {bsTotalSoldQty.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-card p-4 sm:p-5 shadow-sm transition-all duration-200 hover:border-emerald-500/40 hover:-translate-y-0.5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-sm">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs font-semibold text-muted-foreground truncate">Total Sold Amount</p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                    {formatBDT(bsTotalSoldAmount)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Best Selling Table Card */}
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/40">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-bold text-foreground tracking-tight">Best Selling Products</h2>
              </div>
              <div className="flex items-center gap-3 print:hidden">
                <button
                  type="button"
                  onClick={handleDownloadExcel}
                  disabled={isExporting}
                  className="h-9 px-3.5 rounded-lg border border-border bg-background hover:bg-muted text-foreground text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{isExporting ? "Exporting..." : "Export"}</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground text-[11px] sm:text-xs font-semibold tracking-wider uppercase">
                    <th className="px-4 py-3.5 whitespace-nowrap">#</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Product Name</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">SKU</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Category</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Brand</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Sold Qty</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">In-Stock Qty</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Sold Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground">
                  {isLoadingBestSelling ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          <p className="text-sm font-medium">Loading best selling products...</p>
                        </div>
                      </td>
                    </tr>
                  ) : bestSellingList.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Package className="h-8 w-8 text-muted-foreground" />
                          <p className="text-sm font-medium">No products found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    bestSellingList.map((product: any, idx: number) => {
                      const rank = product.index ?? (bsCurrentPage - 1) * bsPageSize + idx + 1;
                      const name = (product.productName || "").trim() || "—";
                      const sku = product.sku || "—";
                      const category = product.category || "—";
                      const brand = product.brand || "—";
                      const soldQty = Number(product.soldQty ?? 0);
                      const inStockQty = Number(product.inStockQty ?? 0);
                      const soldAmount = Number(product.soldAmount ?? 0);

                      return (
                        <tr key={product.id || idx} className="hover:bg-muted/40 transition-colors">
                          {/* Rank / Index */}
                          <td className="px-4 py-3 whitespace-nowrap font-mono text-xs text-muted-foreground">
                            {rank}
                          </td>
                          {/* Product Name */}
                          <td className="px-4 py-3 font-semibold text-foreground whitespace-nowrap max-w-[240px] truncate" title={name}>
                            {name}
                          </td>
                          {/* SKU */}
                          <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                            {sku}
                          </td>
                          {/* Category */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
                              {category}
                            </span>
                          </td>
                          {/* Brand */}
                          <td className="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground font-medium">
                            {brand}
                          </td>
                          {/* Sold Qty */}
                          <td className="px-4 py-3 font-bold text-foreground whitespace-nowrap">
                            {soldQty.toLocaleString()}
                          </td>
                          {/* In-Stock Qty */}
                          <td className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">
                            {inStockQty.toLocaleString()}
                          </td>
                          {/* Sold Amount */}
                          <td className="px-4 py-3 font-medium text-emerald-400 whitespace-nowrap">
                            {formatBDT(soldAmount)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Reusable Pagination */}
            {bsTotalPages > 1 && (
              <div className="px-6 pb-4 print:hidden">
                <PaginationHelper
                  currentPage={bsCurrentPage}
                  totalPages={bsTotalPages}
                  onPageChange={setBsCurrentPage}
                  isBangla={isBangla}
                />
              </div>
            )}
          </div>

        </TabsContent>
      </Tabs>
    </div>
  );
}
