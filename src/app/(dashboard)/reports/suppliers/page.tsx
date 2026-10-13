"use client";

import React, { useState, useMemo } from "react";
import {
  Calendar,
  Download,
  Printer,
  RotateCcw,
  TrendingUp,
  CreditCard,
  Truck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Package,
  Building2,
  Trophy,
  Medal,
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

// ============================================================================
// TYPES & MOCK DATA
// ============================================================================

export interface PurchaseReportRow {
  id: string;
  billNo: string;
  supplierName: string;
  supplierId: string;
  branch: string;
  branchId: string;
  totalQty: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  status: "Received" | "Pending" | "Partial" | "Cancelled";
  paymentStatus: "Paid" | "Partial" | "Due";
  createdAt: string;
  isoDate: string;
}

const INITIAL_MOCK_DATA: PurchaseReportRow[] = [
  {
    id: "pur-1",
    billNo: "BILL-2026-1045",
    supplierName: "PRAN-RFL Distributor",
    supplierId: "sup-1",
    branch: "Main Branch (Dhaka)",
    branchId: "store-main",
    totalQty: 120,
    grandTotal: 45200.0,
    paidAmount: 45200.0,
    dueAmount: 0.0,
    status: "Received",
    paymentStatus: "Paid",
    createdAt: "08 Oct 2026, 11:10 AM",
    isoDate: "2026-10-08",
  },
  {
    id: "pur-2",
    billNo: "BILL-2026-1044",
    supplierName: "Square Consumer Goods",
    supplierId: "sup-2",
    branch: "Gulshan Flagship Store",
    branchId: "store-gulshan",
    totalQty: 85,
    grandTotal: 28600.0,
    paidAmount: 15000.0,
    dueAmount: 13600.0,
    status: "Partial",
    paymentStatus: "Partial",
    createdAt: "08 Oct 2026, 09:45 AM",
    isoDate: "2026-10-08",
  },
  {
    id: "pur-3",
    billNo: "BILL-2026-1043",
    supplierName: "Unilever Bangladesh",
    supplierId: "sup-3",
    branch: "Dhanmondi Hub",
    branchId: "store-dhanmondi",
    totalQty: 64,
    grandTotal: 18450.0,
    paidAmount: 18450.0,
    dueAmount: 0.0,
    status: "Received",
    paymentStatus: "Paid",
    createdAt: "07 Oct 2026, 06:30 PM",
    isoDate: "2026-10-07",
  },
  {
    id: "pur-4",
    billNo: "BILL-2026-1042",
    supplierName: "Aarong Dairy Depot",
    supplierId: "sup-4",
    branch: "Main Branch (Dhaka)",
    branchId: "store-main",
    totalQty: 210,
    grandTotal: 52800.0,
    paidAmount: 52800.0,
    dueAmount: 0.0,
    status: "Received",
    paymentStatus: "Paid",
    createdAt: "07 Oct 2026, 02:15 PM",
    isoDate: "2026-10-07",
  },
  {
    id: "pur-5",
    billNo: "BILL-2026-1041",
    supplierName: "ACI Logistics Ltd",
    supplierId: "sup-5",
    branch: "Uttara Outlet",
    branchId: "store-uttara",
    totalQty: 48,
    grandTotal: 12900.0,
    paidAmount: 0.0,
    dueAmount: 12900.0,
    status: "Pending",
    paymentStatus: "Due",
    createdAt: "07 Oct 2026, 11:20 AM",
    isoDate: "2026-10-07",
  },
  {
    id: "pur-6",
    billNo: "BILL-2026-1040",
    supplierName: "Teer Flour Mills",
    supplierId: "sup-6",
    branch: "Chittagong Central",
    branchId: "store-ctg",
    totalQty: 156,
    grandTotal: 34150.0,
    paidAmount: 20000.0,
    dueAmount: 14150.0,
    status: "Partial",
    paymentStatus: "Partial",
    createdAt: "06 Oct 2026, 04:55 PM",
    isoDate: "2026-10-06",
  },
  {
    id: "pur-7",
    billNo: "BILL-2026-1039",
    supplierName: "PRAN-RFL Distributor",
    supplierId: "sup-1",
    branch: "Main Branch (Dhaka)",
    branchId: "store-main",
    totalQty: 32,
    grandTotal: 8750.0,
    paidAmount: 8750.0,
    dueAmount: 0.0,
    status: "Received",
    paymentStatus: "Paid",
    createdAt: "06 Oct 2026, 12:40 PM",
    isoDate: "2026-10-06",
  },
  {
    id: "pur-8",
    billNo: "BILL-2026-1038",
    supplierName: "Coca-Cola Beverages BD",
    supplierId: "sup-7",
    branch: "Gulshan Flagship Store",
    branchId: "store-gulshan",
    totalQty: 240,
    grandTotal: 61000.0,
    paidAmount: 61000.0,
    dueAmount: 0.0,
    status: "Received",
    paymentStatus: "Paid",
    createdAt: "05 Oct 2026, 05:05 PM",
    isoDate: "2026-10-05",
  },
  {
    id: "pur-9",
    billNo: "BILL-2026-1037",
    supplierName: "Square Consumer Goods",
    supplierId: "sup-2",
    branch: "Dhanmondi Hub",
    branchId: "store-dhanmondi",
    totalQty: 75,
    grandTotal: 19400.0,
    paidAmount: 0.0,
    dueAmount: 19400.0,
    status: "Cancelled",
    paymentStatus: "Due",
    createdAt: "05 Oct 2026, 10:50 AM",
    isoDate: "2026-10-05",
  },
  {
    id: "pur-10",
    billNo: "BILL-2026-1036",
    supplierName: "Fresh Cooking Oil Ltd",
    supplierId: "sup-8",
    branch: "Uttara Outlet",
    branchId: "store-uttara",
    totalQty: 96,
    grandTotal: 42750.0,
    paidAmount: 42750.0,
    dueAmount: 0.0,
    status: "Received",
    paymentStatus: "Paid",
    createdAt: "04 Oct 2026, 06:25 PM",
    isoDate: "2026-10-04",
  },
  {
    id: "pur-11",
    billNo: "BILL-2026-1035",
    supplierName: "Teer Flour Mills",
    supplierId: "sup-6",
    branch: "Chittagong Central",
    branchId: "store-ctg",
    totalQty: 300,
    grandTotal: 78300.0,
    paidAmount: 78300.0,
    dueAmount: 0.0,
    status: "Received",
    paymentStatus: "Paid",
    createdAt: "04 Oct 2026, 01:35 PM",
    isoDate: "2026-10-04",
  },
  {
    id: "pur-12",
    billNo: "BILL-2026-1034",
    supplierName: "Unilever Bangladesh",
    supplierId: "sup-3",
    branch: "Gulshan Flagship Store",
    branchId: "store-gulshan",
    totalQty: 110,
    grandTotal: 33900.0,
    paidAmount: 18000.0,
    dueAmount: 15900.0,
    status: "Partial",
    paymentStatus: "Partial",
    createdAt: "03 Oct 2026, 09:20 AM",
    isoDate: "2026-10-03",
  },
  {
    id: "pur-13",
    billNo: "BILL-2026-1033",
    supplierName: "ACI Logistics Ltd",
    supplierId: "sup-5",
    branch: "Dhanmondi Hub",
    branchId: "store-dhanmondi",
    totalQty: 58,
    grandTotal: 14650.0,
    paidAmount: 14650.0,
    dueAmount: 0.0,
    status: "Received",
    paymentStatus: "Paid",
    createdAt: "02 Oct 2026, 03:05 PM",
    isoDate: "2026-10-02",
  },
  {
    id: "pur-14",
    billNo: "BILL-2026-1032",
    supplierName: "Aarong Dairy Depot",
    supplierId: "sup-4",
    branch: "Main Branch (Dhaka)",
    branchId: "store-main",
    totalQty: 44,
    grandTotal: 11100.0,
    paidAmount: 11100.0,
    dueAmount: 0.0,
    status: "Received",
    paymentStatus: "Paid",
    createdAt: "01 Oct 2026, 04:30 PM",
    isoDate: "2026-10-01",
  },
  {
    id: "pur-15",
    billNo: "BILL-2026-1031",
    supplierName: "Coca-Cola Beverages BD",
    supplierId: "sup-7",
    branch: "Main Branch (Dhaka)",
    branchId: "store-main",
    totalQty: 180,
    grandTotal: 49500.0,
    paidAmount: 49500.0,
    dueAmount: 0.0,
    status: "Received",
    paymentStatus: "Paid",
    createdAt: "01 Oct 2026, 11:15 AM",
    isoDate: "2026-10-01",
  },
];

// Available Filter Options
const STORE_OPTIONS = [
  { value: "all", label: "Choose Store" },
  { value: "store-main", label: "Main Branch (Dhaka)" },
  { value: "store-gulshan", label: "Gulshan Flagship Store" },
  { value: "store-dhanmondi", label: "Dhanmondi Hub" },
  { value: "store-uttara", label: "Uttara Outlet" },
  { value: "store-ctg", label: "Chittagong Central" },
];

const SUPPLIER_OPTIONS = [
  { value: "all", label: "Select Supplier" },
  { value: "sup-1", label: "PRAN-RFL Distributor" },
  { value: "sup-2", label: "Square Consumer Goods" },
  { value: "sup-3", label: "Unilever Bangladesh" },
  { value: "sup-4", label: "Aarong Dairy Depot" },
  { value: "sup-5", label: "ACI Logistics Ltd" },
  { value: "sup-6", label: "Teer Flour Mills" },
  { value: "sup-7", label: "Coca-Cola Beverages BD" },
  { value: "sup-8", label: "Fresh Cooking Oil Ltd" },
];

// ============================================================================
// TOP SUPPLIERS MOCK DATA
// ============================================================================

export interface TopSupplier {
  rank: number;
  id: string;
  supplierName: string;
  supplierCode: string;
  category: string;
  billsCount: number;
  totalPurchase: number;
  outstandingDue: number;
  avgBillValue: number;
  growthRate: number;
}

const TOP_SUPPLIERS_MOCK: TopSupplier[] = [
  {
    rank: 1,
    id: "sup-1",
    supplierName: "PRAN-RFL Distributor",
    supplierCode: "SUP-PRAN-01",
    category: "FMCG",
    billsCount: 42,
    totalPurchase: 865000,
    outstandingDue: 45000,
    avgBillValue: 20595,
    growthRate: 16.2,
  },
  {
    rank: 2,
    id: "sup-2",
    supplierName: "Square Consumer Goods",
    supplierCode: "SUP-SQR-02",
    category: "Pharma & FMCG",
    billsCount: 36,
    totalPurchase: 742500,
    outstandingDue: 82000,
    avgBillValue: 20625,
    growthRate: 11.4,
  },
  {
    rank: 3,
    id: "sup-3",
    supplierName: "Unilever Bangladesh",
    supplierCode: "SUP-UNL-03",
    category: "Personal Care",
    billsCount: 31,
    totalPurchase: 618900,
    outstandingDue: 28500,
    avgBillValue: 19965,
    growthRate: 8.9,
  },
  {
    rank: 4,
    id: "sup-7",
    supplierName: "Coca-Cola Beverages BD",
    supplierCode: "SUP-CCE-07",
    category: "Beverages",
    billsCount: 28,
    totalPurchase: 554200,
    outstandingDue: 0,
    avgBillValue: 19793,
    growthRate: 21.3,
  },
  {
    rank: 5,
    id: "sup-6",
    supplierName: "Teer Flour Mills",
    supplierCode: "SUP-TEER-06",
    category: "Staples",
    billsCount: 25,
    totalPurchase: 496800,
    outstandingDue: 64000,
    avgBillValue: 19872,
    growthRate: 6.7,
  },
  {
    rank: 6,
    id: "sup-8",
    supplierName: "Fresh Cooking Oil Ltd",
    supplierCode: "SUP-FCL-08",
    category: "Cooking Oil",
    billsCount: 22,
    totalPurchase: 431500,
    outstandingDue: 15000,
    avgBillValue: 19614,
    growthRate: 4.2,
  },
  {
    rank: 7,
    id: "sup-4",
    supplierName: "Aarong Dairy Depot",
    supplierCode: "SUP-AAR-04",
    category: "Dairy",
    billsCount: 19,
    totalPurchase: 287400,
    outstandingDue: 9200,
    avgBillValue: 15126,
    growthRate: -2.8,
  },
  {
    rank: 8,
    id: "sup-5",
    supplierName: "ACI Logistics Ltd",
    supplierCode: "SUP-ACI-05",
    category: "Agro & Foods",
    billsCount: 15,
    totalPurchase: 214600,
    outstandingDue: 38700,
    avgBillValue: 14307,
    growthRate: -5.4,
  },
];

const TS_CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "FMCG", label: "FMCG" },
  { value: "Pharma & FMCG", label: "Pharma & FMCG" },
  { value: "Personal Care", label: "Personal Care" },
  { value: "Beverages", label: "Beverages" },
  { value: "Staples", label: "Staples" },
  { value: "Cooking Oil", label: "Cooking Oil" },
  { value: "Dairy", label: "Dairy" },
  { value: "Agro & Foods", label: "Agro & Foods" },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const formatBDT = (amount: number) => {
  return `৳${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// ============================================================================
// COMPONENT
// ============================================================================

export default function SupplierReportPage() {
  // Filter States
  const [startDate, setStartDate] = useState("2026-10-01");
  const [endDate, setEndDate] = useState("2026-10-08");
  const [selectedStore, setSelectedStore] = useState("all");
  const [selectedSupplier, setSelectedSupplier] = useState("all");

  // Applied Filters State (Updated when "Generate Report" is clicked)
  const [appliedFilters, setAppliedFilters] = useState({
    startDate: "2026-10-01",
    endDate: "2026-10-08",
    store: "all",
    supplier: "all",
  });

  // Supplier Report table filter
  const [tsCategoryFilter, setTsCategoryFilter] = useState("all");
  const [tsPageSize, setTsPageSize] = useState(10);
  const [tsCurrentPage, setTsCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  const filteredTopSuppliers = useMemo(() => {
    if (tsCategoryFilter === "all") return TOP_SUPPLIERS_MOCK;
    return TOP_SUPPLIERS_MOCK.filter((s) => s.category === tsCategoryFilter);
  }, [tsCategoryFilter]);

  const tsTotalEntries = filteredTopSuppliers.length;
  const tsTotalPages = Math.max(1, Math.ceil(tsTotalEntries / tsPageSize));
  const paginatedTopSuppliers = useMemo(() => {
    const start = (tsCurrentPage - 1) * tsPageSize;
    return filteredTopSuppliers.slice(start, start + tsPageSize);
  }, [filteredTopSuppliers, tsCurrentPage, tsPageSize]);

  // Filtered Purchase Rows (drives the Supplier Report KPIs)
  const filteredData = useMemo(() => {
    return INITIAL_MOCK_DATA.filter((item) => {
      if (appliedFilters.startDate && item.isoDate < appliedFilters.startDate) {
        return false;
      }
      if (appliedFilters.endDate && item.isoDate > appliedFilters.endDate) {
        return false;
      }
      if (
        appliedFilters.store !== "all" &&
        item.branchId !== appliedFilters.store
      ) {
        return false;
      }
      if (
        appliedFilters.supplier !== "all" &&
        item.supplierId !== appliedFilters.supplier
      ) {
        return false;
      }
      return true;
    });
  }, [appliedFilters]);

  // Aggregate Metrics for Supplier Report KPI Cards (respects applied filters)
  const supplierReportKpis = useMemo(() => {
    const totalAmount = filteredData.reduce((s, r) => s + r.grandTotal, 0);
    const totalPaid = filteredData.reduce((s, r) => s + r.paidAmount, 0);
    const totalDue = filteredData.reduce((s, r) => s + r.dueAmount, 0);
    const totalItems = filteredData.reduce((s, r) => s + r.totalQty, 0);
    const totalPurchases = filteredData.length;
    const uniqueSuppliers = new Set(filteredData.map((r) => r.supplierId)).size;
    return { totalAmount, totalPaid, totalDue, totalItems, totalPurchases, uniqueSuppliers };
  }, [filteredData]);

  // Handle Generate Report
  const handleGenerateReport = () => {
    setAppliedFilters({
      startDate,
      endDate,
      store: selectedStore,
      supplier: selectedSupplier,
    });
    setTsCurrentPage(1);
  };

  // Handle Reset Filter
  const handleResetFilter = () => {
    setStartDate("2026-10-01");
    setEndDate("2026-10-08");
    setSelectedStore("all");
    setSelectedSupplier("all");
    setTsCategoryFilter("all");

    setAppliedFilters({
      startDate: "2026-10-01",
      endDate: "2026-10-08",
      store: "all",
      supplier: "all",
    });
    setTsCurrentPage(1);
  };

  // Handle Export Excel / CSV (Supplier Report table)
  const handleDownloadExcel = () => {
    setIsExporting(true);
    try {
      const headers = [
        "Rank",
        "Supplier Name",
        "Code",
        "Category",
        "Bills",
        "Total Purchase",
        "Outstanding Due",
        "Avg. Bill",
        "Growth",
      ];

      const csvRows = [
        headers.join(","),
        ...filteredTopSuppliers.map((supplier) =>
          [
            supplier.rank,
            `"${supplier.supplierName}"`,
            `"${supplier.supplierCode}"`,
            `"${supplier.category}"`,
            supplier.billsCount,
            supplier.totalPurchase,
            supplier.outstandingDue,
            supplier.avgBillValue,
            supplier.growthRate,
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
        title="Supplier Reports"
        subtitle="Manage and analyse your supplier purchase data"
        showBack
      />

      {/* ================================================================== */}
      {/* 2. FILTER CARD                                                     */}
      {/* ================================================================== */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
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
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0 ml-1.5 pointer-events-none" />
            </div>
          </div>

          {/* Row 1: Store */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Store
            </label>
            <Select value={selectedStore} onValueChange={setSelectedStore}>
              <SelectTrigger className="w-full h-10 rounded-lg border-input bg-background text-foreground text-sm focus:border-primary/60 focus:ring-1 focus:ring-primary/20">
                <SelectValue placeholder="Choose Store" />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover text-popover-foreground">
                {STORE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Row 1: Supplier */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Supplier
            </label>
            <Select
              value={selectedSupplier}
              onValueChange={setSelectedSupplier}
            >
              <SelectTrigger className="w-full h-10 rounded-lg border-input bg-background text-foreground text-sm focus:border-primary/60 focus:ring-1 focus:ring-primary/20">
                <SelectValue placeholder="Select Supplier" />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover text-popover-foreground">
                {SUPPLIER_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
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
      {/* 3. SUPPLIER REPORT KPI CARDS                                       */}
      {/* ================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-card p-4 sm:p-5 shadow-sm transition-all duration-200 hover:border-indigo-500/40 hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-indigo-500 flex items-center justify-center text-white shrink-0 shadow-sm">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-semibold text-muted-foreground truncate">Total Amount</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                ৳{supplierReportKpis.totalAmount.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-card p-4 sm:p-5 shadow-sm transition-all duration-200 hover:border-emerald-500/40 hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-sm">
              <CreditCard className="h-6 w-6" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-semibold text-muted-foreground truncate">Total Paid</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                ৳{supplierReportKpis.totalPaid.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-rose-500/25 bg-card p-4 sm:p-5 shadow-sm transition-all duration-200 hover:border-rose-500/40 hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-rose-500 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Truck className="h-6 w-6" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-semibold text-muted-foreground truncate">Total Due</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                ৳{supplierReportKpis.totalDue.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-teal-500/25 bg-card p-4 sm:p-5 shadow-sm transition-all duration-200 hover:border-teal-500/40 hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-teal-500 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Package className="h-6 w-6" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-semibold text-muted-foreground truncate">Total Items</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {supplierReportKpis.totalItems.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/25 bg-card p-4 sm:p-5 shadow-sm transition-all duration-200 hover:border-amber-500/45 hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500 flex items-center justify-center text-white shrink-0 shadow-sm">
              <FileText className="h-6 w-6" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-semibold text-muted-foreground truncate">Total Purchases</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {supplierReportKpis.totalPurchases.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-violet-500/25 bg-card p-4 sm:p-5 shadow-sm transition-all duration-200 hover:border-violet-500/40 hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-violet-500 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-semibold text-muted-foreground truncate">Unique Suppliers</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {supplierReportKpis.uniqueSuppliers.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* 4. SUPPLIER REPORT TABLE CARD                                      */}
      {/* ================================================================== */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/40">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-foreground tracking-tight">Supplier Report</h2>
          </div>
          <div className="flex items-center gap-3">
            <Select value={tsCategoryFilter} onValueChange={(v) => { setTsCategoryFilter(v); setTsCurrentPage(1); }}>
              <SelectTrigger className="h-9 w-[160px] rounded-md border-input bg-background text-foreground text-xs">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover text-popover-foreground">
                {TS_CATEGORY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              type="button"
              onClick={handleDownloadExcel}
              disabled={isExporting}
              className="h-9 px-3.5 rounded-lg border border-border bg-background hover:bg-muted text-foreground text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isExporting ? "Exporting..." : "Export"}</span>
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground text-[11px] sm:text-xs font-semibold tracking-wider uppercase">
                <th className="px-4 py-3.5 whitespace-nowrap">Rank</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Supplier Name</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Code</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Category</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Bills</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Total Purchase</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Outstanding Due</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Avg. Bill</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {paginatedTopSuppliers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Building2 className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm font-medium">No suppliers found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedTopSuppliers.map((supplier) => {
                  const isPositiveGrowth = supplier.growthRate >= 0;
                  return (
                    <tr key={supplier.id} className="hover:bg-muted/40 transition-colors">
                      {/* Rank */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {supplier.rank === 1 && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                            <Trophy className="h-3 w-3" />#1
                          </span>
                        )}
                        {supplier.rank === 2 && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-muted text-foreground border border-border">
                            <Medal className="h-3 w-3" />#2
                          </span>
                        )}
                        {supplier.rank === 3 && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-700/15 text-orange-400 border border-orange-700/30">
                            <Medal className="h-3 w-3" />#3
                          </span>
                        )}
                        {supplier.rank > 3 && (
                          <span className="font-mono text-muted-foreground text-xs">#{supplier.rank}</span>
                        )}
                      </td>
                      {/* Supplier Name */}
                      <td className="px-4 py-3 font-semibold text-foreground whitespace-nowrap max-w-[240px] truncate">
                        {supplier.supplierName}
                      </td>
                      {/* Code */}
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                        {supplier.supplierCode}
                      </td>
                      {/* Category */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
                          {supplier.category}
                        </span>
                      </td>
                      {/* Bills */}
                      <td className="px-4 py-3 font-bold text-foreground whitespace-nowrap">
                        {supplier.billsCount.toLocaleString()}
                      </td>
                      {/* Total Purchase */}
                      <td className="px-4 py-3 font-medium text-emerald-400 whitespace-nowrap">
                        {formatBDT(supplier.totalPurchase)}
                      </td>
                      {/* Outstanding Due */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={cn(
                          "font-semibold",
                          supplier.outstandingDue > 0 ? "text-rose-400" : "text-muted-foreground"
                        )}>
                          {formatBDT(supplier.outstandingDue)}
                        </span>
                      </td>
                      {/* Avg Bill */}
                      <td className="px-4 py-3 text-foreground whitespace-nowrap">
                        {formatBDT(supplier.avgBillValue)}
                      </td>
                      {/* Growth Rate */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={cn(
                          "inline-flex items-center gap-1 text-xs font-semibold",
                          isPositiveGrowth ? "text-emerald-400" : "text-rose-400"
                        )}>
                          {isPositiveGrowth ? "▲" : "▼"}
                          {Math.abs(supplier.growthRate)}%
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Supplier Report Pagination */}
        <div className="px-6 py-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/40">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Show</span>
            <Select
              value={String(tsPageSize)}
              onValueChange={(val) => { setTsPageSize(Number(val)); setTsCurrentPage(1); }}
            >
              <SelectTrigger className="h-8 w-[72px] rounded-md border-input bg-background text-foreground text-xs">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover text-popover-foreground">
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
              </SelectContent>
            </Select>
            <span>
              Showing{" "}
              <strong className="text-foreground">{tsTotalEntries === 0 ? 0 : (tsCurrentPage - 1) * tsPageSize + 1}</strong>{" "}
              to{" "}
              <strong className="text-foreground">{Math.min(tsCurrentPage * tsPageSize, tsTotalEntries)}</strong>{" "}
              of <strong className="text-foreground">{tsTotalEntries}</strong> suppliers
            </span>
          </div>
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setTsCurrentPage((p) => Math.max(1, p - 1))}
              disabled={tsCurrentPage <= 1}
              className="h-8 w-8 rounded-md border border-border bg-background hover:bg-muted text-foreground disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: tsTotalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setTsCurrentPage(page)}
                className={cn(
                  "h-8 w-8 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer flex items-center justify-center",
                  tsCurrentPage === page
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "border border-border bg-background text-foreground hover:bg-muted"
                )}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setTsCurrentPage((p) => Math.min(tsTotalPages, p + 1))}
              disabled={tsCurrentPage >= tsTotalPages}
              className="h-8 w-8 rounded-md border border-border bg-background hover:bg-muted text-foreground disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
