"use client";

import React, { useState, useMemo } from "react";
import {
  Calendar,
  Download,
  Printer,
  RotateCcw,
  BarChart3,
  TrendingUp,
  CreditCard,
  Truck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

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
// HELPER FUNCTIONS
// ============================================================================

const formatBDT = (amount: number) => {
  return `৳${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatKpiNumber = (amount: number) => {
  return amount.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

// ============================================================================
// COMPONENT
// ============================================================================

export default function PurchaseReportPage() {
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

  // Table Pagination State
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Filtered List
  const filteredData = useMemo(() => {
    return INITIAL_MOCK_DATA.filter((item) => {
      // Date filter
      if (appliedFilters.startDate && item.isoDate < appliedFilters.startDate) {
        return false;
      }
      if (appliedFilters.endDate && item.isoDate > appliedFilters.endDate) {
        return false;
      }
      // Store filter
      if (
        appliedFilters.store !== "all" &&
        item.branchId !== appliedFilters.store
      ) {
        return false;
      }
      // Supplier filter
      if (
        appliedFilters.supplier !== "all" &&
        item.supplierId !== appliedFilters.supplier
      ) {
        return false;
      }
      return true;
    });
  }, [appliedFilters]);

  // Aggregate Metrics for 4 KPI Cards
  const kpiMetrics = useMemo(() => {
    const totalUnits = filteredData.reduce((sum, row) => sum + row.totalQty, 0);
    const totalPurchases = filteredData.reduce((sum, row) => sum + row.grandTotal, 0);
    const totalPaid = filteredData.reduce((sum, row) => sum + row.paidAmount, 0);
    const totalDue = filteredData.reduce((sum, row) => sum + row.dueAmount, 0);

    return { totalUnits, totalPurchases, totalPaid, totalDue };
  }, [filteredData]);

  // Paginated Table Data
  const totalEntries = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
  const paginatedData = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return filteredData.slice(startIdx, startIdx + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Handle Generate Report
  const handleGenerateReport = () => {
    setAppliedFilters({
      startDate,
      endDate,
      store: selectedStore,
      supplier: selectedSupplier,
    });
    setCurrentPage(1);
  };

  // Handle Reset Filter
  const handleResetFilter = () => {
    setStartDate("2026-10-01");
    setEndDate("2026-10-08");
    setSelectedStore("all");
    setSelectedSupplier("all");

    setAppliedFilters({
      startDate: "2026-10-01",
      endDate: "2026-10-08",
      store: "all",
      supplier: "all",
    });
    setCurrentPage(1);
  };

  // Handle Export Excel / CSV
  const handleDownloadExcel = () => {
    setIsExporting(true);
    try {
      const headers = [
        "#",
        "Bill No",
        "Supplier",
        "Branch",
        "Total Qty",
        "Grand Total",
        "Paid Amount",
        "Due Amount",
        "Status",
        "Payment Status",
        "Created At",
      ];

      const csvRows = [
        headers.join(","),
        ...filteredData.map((row, index) =>
          [
            index + 1,
            `"${row.billNo}"`,
            `"${row.supplierName}"`,
            `"${row.branch}"`,
            row.totalQty,
            row.grandTotal,
            row.paidAmount,
            row.dueAmount,
            `"${row.status}"`,
            `"${row.paymentStatus}"`,
            `"${row.createdAt}"`,
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
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          Purchase Reports
        </h1>
        <p className="text-sm text-slate-400">
          Manage and analyse your purchase data
        </p>
      </div>

      {/* ================================================================== */}
      {/* 2. FILTER CARD                                                     */}
      {/* ================================================================== */}
      <div className="rounded-2xl border border-[#1e2738] bg-[#0d131f]/95 p-5 shadow-xl shadow-black/30 backdrop-blur-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Row 1: Choose Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Choose Date
            </label>
            <div className="relative flex items-center h-10 rounded-lg border border-[#222c3e] bg-[#141b29] px-3 transition-colors focus-within:border-primary/60 focus-within:ring-1 focus-within:ring-primary/20">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm text-slate-200 outline-none cursor-pointer [color-scheme:dark]"
              />
              <span className="text-slate-500 px-2 select-none">→</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm text-slate-200 outline-none cursor-pointer [color-scheme:dark]"
              />
              <Calendar className="h-4 w-4 text-slate-400 shrink-0 ml-1.5 pointer-events-none" />
            </div>
          </div>

          {/* Row 1: Store */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Store
            </label>
            <Select value={selectedStore} onValueChange={setSelectedStore}>
              <SelectTrigger className="w-full h-10 rounded-lg border-[#222c3e] bg-[#141b29] text-slate-200 text-sm focus:border-primary/60 focus:ring-1 focus:ring-primary/20">
                <SelectValue placeholder="Choose Store" />
              </SelectTrigger>
              <SelectContent className="border-[#222c3e] bg-[#141b29] text-slate-200">
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
            <label className="text-xs font-semibold text-slate-300">
              Supplier
            </label>
            <Select
              value={selectedSupplier}
              onValueChange={setSelectedSupplier}
            >
              <SelectTrigger className="w-full h-10 rounded-lg border-[#222c3e] bg-[#141b29] text-slate-200 text-sm focus:border-primary/60 focus:ring-1 focus:ring-primary/20">
                <SelectValue placeholder="Select Supplier" />
              </SelectTrigger>
              <SelectContent className="border-[#222c3e] bg-[#141b29] text-slate-200">
                {SUPPLIER_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Row 3: Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 mt-5 pt-4 border-t border-[#1e2738]/60">
          <button
            type="button"
            onClick={handleResetFilter}
            className="h-10 px-6 rounded-lg border border-[#2d3650] bg-[#141b29] hover:bg-[#1a2335] text-slate-200 font-medium text-sm transition-all duration-150 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
          >
            <RotateCcw className="h-4 w-4 text-slate-400" />
            <span>Reset Filter</span>
          </button>

          <button
            type="button"
            onClick={handleGenerateReport}
            className="h-10 px-6 rounded-lg bg-[#4F5BFF] hover:bg-[#5E6AFF] text-white font-medium text-sm transition-all duration-150 flex items-center justify-center gap-2 active:scale-[0.98] shadow-md shadow-indigo-950/40 cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* ================================================================== */}
      {/* 3. FOUR KPI CARDS (Horizontal Layout)                              */}
      {/* ================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Units Purchased — Primary Indigo */}
        <div className="relative overflow-hidden rounded-2xl border border-[#4F5BFF]/25 bg-[#0d131f]/95 p-4 sm:p-5 shadow-lg shadow-black/30 backdrop-blur-xl transition-all duration-200 hover:border-[#4F5BFF]/45 hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="h-13 w-13 rounded-xl bg-[#4F5BFF] flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-950/50">
              <BarChart3 className="h-7 w-7" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-semibold text-slate-400 truncate">
                Total Units Purchased
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {formatKpiNumber(kpiMetrics.totalUnits)}
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Total Purchase Amount — Emerald */}
        <div className="relative overflow-hidden rounded-2xl border border-[#0FBF9F]/25 bg-[#0d131f]/95 p-4 sm:p-5 shadow-lg shadow-black/30 backdrop-blur-xl transition-all duration-200 hover:border-[#0FBF9F]/45 hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="h-13 w-13 rounded-xl bg-[#0FBF9F] flex items-center justify-center text-white shrink-0 shadow-md shadow-teal-950/50">
              <TrendingUp className="h-7 w-7" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-semibold text-slate-400 truncate">
                Total Purchase Amount
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                ৳{formatKpiNumber(kpiMetrics.totalPurchases)}
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Total Paid — Emerald/success */}
        <div className="relative overflow-hidden rounded-2xl border border-[#1FAF86]/25 bg-[#0d131f]/95 p-4 sm:p-5 shadow-lg shadow-black/30 backdrop-blur-xl transition-all duration-200 hover:border-[#1FAF86]/45 hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="h-13 w-13 rounded-xl bg-[#1FAF86] flex items-center justify-center text-white shrink-0 shadow-md shadow-green-950/50">
              <CreditCard className="h-7 w-7" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-semibold text-slate-400 truncate">
                Total Paid
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                ৳{formatKpiNumber(kpiMetrics.totalPaid)}
              </p>
            </div>
          </div>
        </div>

        {/* Card 4: Total Due — Destructive rose */}
        <div className="relative overflow-hidden rounded-2xl border border-[#EF4444]/25 bg-[#0d131f]/95 p-4 sm:p-5 shadow-lg shadow-black/30 backdrop-blur-xl transition-all duration-200 hover:border-[#EF4444]/45 hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="h-13 w-13 rounded-xl bg-[#EF4444] flex items-center justify-center text-white shrink-0 shadow-md shadow-red-950/50">
              <Truck className="h-7 w-7" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-semibold text-slate-400 truncate">
                Total Due
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                ৳{formatKpiNumber(kpiMetrics.totalDue)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* 4. PURCHASE REPORT DATA TABLE CARD                                 */}
      {/* ================================================================== */}
      <div className="rounded-2xl border border-[#1e2738] bg-[#0d131f]/95 shadow-xl shadow-black/30 backdrop-blur-xl overflow-hidden">
        {/* Table Header Bar */}
        <div className="px-6 py-4 border-b border-[#1e2738] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111726]/60">
          <h2 className="text-base font-bold text-slate-100 tracking-tight">
            Purchase Report
          </h2>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleDownloadExcel}
              disabled={isExporting}
              className="h-9 px-3.5 rounded-lg border border-[#4F5BFF]/30 bg-[#4F5BFF]/8 hover:bg-[#4F5BFF]/15 text-[#8b93ff] text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isExporting ? "Exporting..." : "Download Excel"}</span>
            </button>

            <button
              type="button"
              onClick={handlePrintReport}
              className="h-9 px-3.5 rounded-lg border border-[#4F5BFF]/30 bg-[#4F5BFF]/8 hover:bg-[#4F5BFF]/15 text-[#8b93ff] text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
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
              <tr className="border-b border-[#1e2738] bg-[#101625] text-slate-400 text-[11px] sm:text-xs font-semibold tracking-wider uppercase">
                <th className="px-4 py-3.5 whitespace-nowrap">#</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Bill No</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Supplier</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Branch</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Total Qty</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Grand Total</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Paid Amount</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Due Amount</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Status</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Payment Status</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2738]/60 text-slate-300">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="px-4 py-12 text-center text-slate-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle className="h-8 w-8 text-slate-500" />
                      <p className="text-sm font-medium">No purchase records found</p>
                      <p className="text-xs text-slate-500">
                        Try adjusting your date range or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, idx) => {
                  const rowNumber = (currentPage - 1) * pageSize + idx + 1;
                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-[#151d2e]/60 transition-colors group"
                    >
                      {/* # */}
                      <td className="px-4 py-3 font-mono text-slate-400 text-xs whitespace-nowrap">
                        {rowNumber}
                      </td>

                      {/* Bill No */}
                      <td className="px-4 py-3 font-semibold text-primary font-mono text-xs whitespace-nowrap group-hover:underline cursor-pointer">
                        {row.billNo}
                      </td>

                      {/* Supplier */}
                      <td className="px-4 py-3 text-slate-200 whitespace-nowrap">
                        {row.supplierName}
                      </td>

                      {/* Branch */}
                      <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                        {row.branch}
                      </td>

                      {/* Total Qty */}
                      <td className="px-4 py-3 font-bold text-slate-100 whitespace-nowrap">
                        {row.totalQty.toLocaleString()}
                      </td>

                      {/* Grand Total */}
                      <td className="px-4 py-3 font-medium text-slate-200 whitespace-nowrap">
                        {formatBDT(row.grandTotal)}
                      </td>

                      {/* Paid Amount */}
                      <td className="px-4 py-3 font-medium text-emerald-400 whitespace-nowrap">
                        {formatBDT(row.paidAmount)}
                      </td>

                      {/* Due Amount */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {row.dueAmount > 0 ? (
                          <span className="font-semibold text-rose-400">
                            {formatBDT(row.dueAmount)}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium">
                            {formatBDT(0)}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {row.status === "Received" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="h-3 w-3" />
                            Received
                          </span>
                        )}
                        {row.status === "Pending" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Clock className="h-3 w-3" />
                            Pending
                          </span>
                        )}
                        {row.status === "Partial" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <Clock className="h-3 w-3" />
                            Partial
                          </span>
                        )}
                        {row.status === "Cancelled" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <XCircle className="h-3 w-3" />
                            Cancelled
                          </span>
                        )}
                      </td>

                      {/* Payment Status */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {row.paymentStatus === "Paid" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="h-3 w-3" />
                            Paid
                          </span>
                        )}
                        {row.paymentStatus === "Partial" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Clock className="h-3 w-3" />
                            Partial
                          </span>
                        )}
                        {row.paymentStatus === "Due" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <AlertCircle className="h-3 w-3" />
                            Due
                          </span>
                        )}
                      </td>

                      {/* Created At */}
                      <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
                        {row.createdAt}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="px-6 py-4 border-t border-[#1e2738] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#101625]">
          {/* Left: Page Size Selector & Entries Count */}
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="font-medium text-slate-300">Show</span>
            <Select
              value={String(pageSize)}
              onValueChange={(val) => {
                setPageSize(Number(val));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-[72px] rounded-md border-[#222c3e] bg-[#141b29] text-slate-200 text-xs">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent className="border-[#222c3e] bg-[#141b29] text-slate-200">
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>

            <span>
              Showing{" "}
              <strong className="text-slate-200">
                {totalEntries === 0 ? 0 : (currentPage - 1) * pageSize + 1}
              </strong>{" "}
              to{" "}
              <strong className="text-slate-200">
                {Math.min(currentPage * pageSize, totalEntries)}
              </strong>{" "}
              of <strong className="text-slate-200">{totalEntries}</strong> entries
            </span>
          </div>

          {/* Right: Pagination Navigation */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            {/* Prev Button */}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="h-8 w-8 rounded-md border border-[#222c3e] bg-[#141b29] hover:bg-[#1a2335] text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Page Buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              const isActive = page === currentPage;
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "h-8 w-8 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer flex items-center justify-center",
                    isActive
                      ? "bg-[#4F5BFF] text-white shadow-md shadow-indigo-950/50"
                      : "border border-[#222c3e] bg-[#141b29] text-slate-300 hover:bg-[#1a2335]"
                  )}
                >
                  {page}
                </button>
              );
            })}

            {/* Next Button */}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="h-8 w-8 rounded-md border border-[#222c3e] bg-[#141b29] hover:bg-[#1a2335] text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
