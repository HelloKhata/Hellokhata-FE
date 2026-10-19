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
  Users,
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

export interface CustomerReportRow {
  id: string;
  customer: string;
  totalOrders: number;
  totalOrderAmount: number;
  totalPaid: number;
  totalDue: number;
  lastOrderDate: string;
  lastOrderDateIso: string;
  phone: string;
  email: string;
  address: string;
  currentBalance: number;
  storeName: string;
}

const CUSTOMER_REPORT_MOCK: CustomerReportRow[] = [
  {
    id: "cmv9971vd000f01n3bemmgbxg",
    customer: "Sweet Ali",
    totalOrders: 1,
    totalOrderAmount: 75,
    totalPaid: 75,
    totalDue: 0,
    lastOrderDate: "2026-10-15",
    lastOrderDateIso: "2026-10-15T08:05:46.725Z",
    phone: "01727724844",
    email: "sweetali0520@gmail.com",
    address: "-",
    currentBalance: 0,
    storeName: "Main Branch",
  },
  {
    id: "cmv9971vd000f01n3bemmgbx1",
    customer: "Rahim Enterprise",
    totalOrders: 38,
    totalOrderAmount: 61200,
    totalPaid: 48700,
    totalDue: 12500,
    lastOrderDate: "2026-10-14",
    lastOrderDateIso: "2026-10-14T11:20:15.000Z",
    phone: "01819234567",
    email: "rahim.enterprise@gmail.com",
    address: "Mirpur-10, Dhaka",
    currentBalance: 12500,
    storeName: "Main Branch",
  },
  {
    id: "cmv9971vd000f01n3bemmgbx2",
    customer: "Karim Trading Co.",
    totalOrders: 24,
    totalOrderAmount: 37290,
    totalPaid: 29290,
    totalDue: 8000,
    lastOrderDate: "2026-10-13",
    lastOrderDateIso: "2026-10-13T15:45:00.000Z",
    phone: "01711987654",
    email: "karim.trade@yahoo.com",
    address: "Gulshan-1, Dhaka",
    currentBalance: 8000,
    storeName: "Gulshan Flagship Store",
  },
  {
    id: "cmv9971vd000f01n3bemmgbx3",
    customer: "Bengal Superstore",
    totalOrders: 29,
    totalOrderAmount: 48650,
    totalPaid: 48650,
    totalDue: 0,
    lastOrderDate: "2026-10-12",
    lastOrderDateIso: "2026-10-12T09:30:20.000Z",
    phone: "01912345678",
    email: "bengal.super@gmail.com",
    address: "Dhanmondi 27, Dhaka",
    currentBalance: 0,
    storeName: "Dhanmondi Hub",
  },
  {
    id: "cmv9971vd000f01n3bemmgbx4",
    customer: "Apex Retail",
    totalOrders: 18,
    totalOrderAmount: 24500,
    totalPaid: 18000,
    totalDue: 6500,
    lastOrderDate: "2026-10-10",
    lastOrderDateIso: "2026-10-10T14:15:30.000Z",
    phone: "01678123456",
    email: "apex.retail@gmail.com",
    address: "Sector 3, Uttara",
    currentBalance: 6500,
    storeName: "Uttara Outlet",
  },
  {
    id: "cmv9971vd000f01n3bemmgbx5",
    customer: "Green Valley Agro",
    totalOrders: 14,
    totalOrderAmount: 32150,
    totalPaid: 32150,
    totalDue: 0,
    lastOrderDate: "2026-10-09",
    lastOrderDateIso: "2026-10-09T17:10:00.000Z",
    phone: "01552345678",
    email: "greenvalley@agro.com",
    address: "GEC Circle, Chittagong",
    currentBalance: 0,
    storeName: "Chittagong Central",
  },
  {
    id: "cmv9971vd000f01n3bemmgbx6",
    customer: "Modern Tech Solutions",
    totalOrders: 26,
    totalOrderAmount: 43120,
    totalPaid: 43120,
    totalDue: 0,
    lastOrderDate: "2026-10-08",
    lastOrderDateIso: "2026-10-08T12:00:00.000Z",
    phone: "01733445566",
    email: "info@moderntech.com.bd",
    address: "Motijheel C/A, Dhaka",
    currentBalance: 0,
    storeName: "Main Branch",
  },
  {
    id: "cmv9971vd000f01n3bemmgbx7",
    customer: "Dhaka Grocers",
    totalOrders: 22,
    totalOrderAmount: 28900,
    totalPaid: 23900,
    totalDue: 5000,
    lastOrderDate: "2026-10-07",
    lastOrderDateIso: "2026-10-07T16:40:10.000Z",
    phone: "01822334455",
    email: "dhaka.grocers@gmail.com",
    address: "Banani, Dhaka",
    currentBalance: 5000,
    storeName: "Gulshan Flagship Store",
  },
  {
    id: "cmv9971vd000f01n3bemmgbx8",
    customer: "Padma Distributions",
    totalOrders: 34,
    totalOrderAmount: 54870,
    totalPaid: 54870,
    totalDue: 0,
    lastOrderDate: "2026-10-06",
    lastOrderDateIso: "2026-10-06T11:15:00.000Z",
    phone: "01933445566",
    email: "padma.dist@gmail.com",
    address: "Kawran Bazar, Dhaka",
    currentBalance: 0,
    storeName: "Main Branch",
  },
  {
    id: "cmv9971vd000f01n3bemmgbx9",
    customer: "Prime Pharma",
    totalOrders: 16,
    totalOrderAmount: 19840,
    totalPaid: 15000,
    totalDue: 4840,
    lastOrderDate: "2026-10-05",
    lastOrderDateIso: "2026-10-05T13:25:00.000Z",
    phone: "01611223344",
    email: "prime.pharma@gmail.com",
    address: "Uttara Sector 7",
    currentBalance: 4840,
    storeName: "Uttara Outlet",
  },
];

// Available Filter Options
const STORE_OPTIONS = [
  { value: "all", label: "Choose Store" },
  { value: "Main Branch", label: "Main Branch" },
  { value: "Gulshan Flagship Store", label: "Gulshan Flagship Store" },
  { value: "Dhanmondi Hub", label: "Dhanmondi Hub" },
  { value: "Uttara Outlet", label: "Uttara Outlet" },
  { value: "Chittagong Central", label: "Chittagong Central" },
];

const CUSTOMER_OPTIONS = [
  { value: "all", label: "Select Customer" },
  { value: "Sweet Ali", label: "Sweet Ali" },
  { value: "Rahim Enterprise", label: "Rahim Enterprise" },
  { value: "Karim Trading Co.", label: "Karim Trading Co." },
  { value: "Bengal Superstore", label: "Bengal Superstore" },
  { value: "Apex Retail", label: "Apex Retail" },
  { value: "Green Valley Agro", label: "Green Valley Agro" },
  { value: "Modern Tech Solutions", label: "Modern Tech Solutions" },
  { value: "Dhaka Grocers", label: "Dhaka Grocers" },
  { value: "Padma Distributions", label: "Padma Distributions" },
  { value: "Prime Pharma", label: "Prime Pharma" },
];

const TABLE_STORE_FILTER_OPTIONS = [
  { value: "all", label: "All Stores" },
  { value: "Main Branch", label: "Main Branch" },
  { value: "Gulshan Flagship Store", label: "Gulshan Flagship Store" },
  { value: "Dhanmondi Hub", label: "Dhanmondi Hub" },
  { value: "Uttara Outlet", label: "Uttara Outlet" },
  { value: "Chittagong Central", label: "Chittagong Central" },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const formatBDT = (amount: number) => {
  return `৳${Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// ============================================================================
// COMPONENT
// ============================================================================

export default function CustomerReportPage() {
  // Filter States
  const [startDate, setStartDate] = useState("2026-10-01");
  const [endDate, setEndDate] = useState("2026-10-15");
  const [selectedStore, setSelectedStore] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState("all");

  // Applied Filters State (Updated when "Generate Report" is clicked)
  const [appliedFilters, setAppliedFilters] = useState({
    startDate: "2026-10-01",
    endDate: "2026-10-15",
    store: "all",
    customer: "all",
  });

  // Customer Report table filter
  const [tcStoreFilter, setTcStoreFilter] = useState("all");
  const [tcPageSize, setTcPageSize] = useState(10);
  const [tcCurrentPage, setTcCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  // Filtered Customers based on Top Filter & Table Store Filter
  const filteredCustomers = useMemo(() => {
    return CUSTOMER_REPORT_MOCK.filter((c) => {
      // Date filter based on lastOrderDate
      if (appliedFilters.startDate && c.lastOrderDate < appliedFilters.startDate) {
        return false;
      }
      if (appliedFilters.endDate && c.lastOrderDate > appliedFilters.endDate) {
        return false;
      }
      // Store filter from top filter card
      if (appliedFilters.store !== "all" && c.storeName !== appliedFilters.store) {
        return false;
      }
      // Customer filter from top filter card
      if (
        appliedFilters.customer !== "all" &&
        c.customer !== appliedFilters.customer
      ) {
        return false;
      }
      // Table-level store dropdown filter
      if (tcStoreFilter !== "all" && c.storeName !== tcStoreFilter) {
        return false;
      }
      return true;
    });
  }, [appliedFilters, tcStoreFilter]);

  const tcTotalEntries = filteredCustomers.length;
  const tcTotalPages = Math.max(1, Math.ceil(tcTotalEntries / tcPageSize));
  const paginatedCustomers = useMemo(() => {
    const start = (tcCurrentPage - 1) * tcPageSize;
    return filteredCustomers.slice(start, start + tcPageSize);
  }, [filteredCustomers, tcCurrentPage, tcPageSize]);

  // Aggregate Metrics for Customer Report KPI Cards
  const customerReportKpis = useMemo(() => {
    const totalAmount = filteredCustomers.reduce((s, r) => s + r.totalOrderAmount, 0);
    const totalPaid = filteredCustomers.reduce((s, r) => s + r.totalPaid, 0);
    const totalDue = filteredCustomers.reduce((s, r) => s + r.totalDue, 0);
    const totalOrders = filteredCustomers.reduce((s, r) => s + r.totalOrders, 0);
    const totalBalance = filteredCustomers.reduce((s, r) => s + r.currentBalance, 0);
    const uniqueCustomers = filteredCustomers.length;
    return { totalAmount, totalPaid, totalDue, totalOrders, totalBalance, uniqueCustomers };
  }, [filteredCustomers]);

  // Handle Generate Report
  const handleGenerateReport = () => {
    setAppliedFilters({
      startDate,
      endDate,
      store: selectedStore,
      customer: selectedCustomer,
    });
    setTcCurrentPage(1);
  };

  // Handle Reset Filter
  const handleResetFilter = () => {
    setStartDate("2026-10-01");
    setEndDate("2026-10-15");
    setSelectedStore("all");
    setSelectedCustomer("all");
    setTcStoreFilter("all");

    setAppliedFilters({
      startDate: "2026-10-01",
      endDate: "2026-10-15",
      store: "all",
      customer: "all",
    });
    setTcCurrentPage(1);
  };

  // Handle Export Excel / CSV (Customer Report table)
  const handleDownloadExcel = () => {
    setIsExporting(true);
    try {
      const headers = [
        "#",
        "Customer",
        "Phone",
        "Email",
        "Address",
        "Store / Branch",
        "Total Orders",
        "Total Order Amount",
        "Total Paid",
        "Total Due",
        "Current Balance",
        "Last Order Date",
      ];

      const csvRows = [
        headers.join(","),
        ...filteredCustomers.map((customer, idx) =>
          [
            idx + 1,
            `"${customer.customer}"`,
            `"${customer.phone || ""}"`,
            `"${customer.email || ""}"`,
            `"${customer.address || ""}"`,
            `"${customer.storeName || ""}"`,
            customer.totalOrders,
            Number(customer.totalOrderAmount || 0).toFixed(2),
            Number(customer.totalPaid || 0).toFixed(2),
            Number(customer.totalDue || 0).toFixed(2),
            Number(customer.currentBalance || 0).toFixed(2),
            `"${customer.lastOrderDate || ""}"`,
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
        title="Customer Reports"
        subtitle="Manage and analyse your customer sales data"
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

          {/* Row 1: Customer */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Customer
            </label>
            <Select
              value={selectedCustomer}
              onValueChange={setSelectedCustomer}
            >
              <SelectTrigger className="w-full h-10 rounded-lg border-input bg-background text-foreground text-sm focus:border-primary/60 focus:ring-1 focus:ring-primary/20">
                <SelectValue placeholder="Select Customer" />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover text-popover-foreground">
                {CUSTOMER_OPTIONS.map((opt) => (
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
      {/* 3. CUSTOMER REPORT KPI CARDS                                       */}
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
                {formatBDT(customerReportKpis.totalAmount)}
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
                {formatBDT(customerReportKpis.totalPaid)}
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
                {formatBDT(customerReportKpis.totalDue)}
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
              <p className="text-xs font-semibold text-muted-foreground truncate">Total Balance</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {formatBDT(customerReportKpis.totalBalance)}
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
              <p className="text-xs font-semibold text-muted-foreground truncate">Total Orders</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {customerReportKpis.totalOrders.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-violet-500/25 bg-card p-4 sm:p-5 shadow-sm transition-all duration-200 hover:border-violet-500/40 hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-violet-500 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Users className="h-6 w-6" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-semibold text-muted-foreground truncate">Customers</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {customerReportKpis.uniqueCustomers.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* 4. CUSTOMER REPORT TABLE CARD                                      */}
      {/* ================================================================== */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/40">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-foreground tracking-tight">Customer Report</h2>
          </div>
          <div className="flex items-center gap-3">
            <Select value={tcStoreFilter} onValueChange={(v) => { setTcStoreFilter(v); setTcCurrentPage(1); }}>
              <SelectTrigger className="h-9 w-[170px] rounded-md border-input bg-background text-foreground text-xs">
                <SelectValue placeholder="All Stores" />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover text-popover-foreground">
                {TABLE_STORE_FILTER_OPTIONS.map((opt) => (
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
                <th className="px-4 py-3.5 whitespace-nowrap">#</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Customer</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Phone</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Store / Branch</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Total Orders</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Total Order Amount</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Total Paid</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Total Due</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Current Balance</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Last Order Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm font-medium">No customers found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((customer, idx) => {
                  return (
                    <tr key={customer.id} className="hover:bg-muted/40 transition-colors group">
                      {/* # */}
                      <td className="px-4 py-3 whitespace-nowrap font-mono text-xs text-muted-foreground">
                        {(tcCurrentPage - 1) * tcPageSize + idx + 1}
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

                      {/* Phone */}
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                        {customer.phone || "—"}
                      </td>

                      {/* Store / Branch */}
                      <td className="px-4 py-3 text-foreground whitespace-nowrap text-xs">
                        {customer.storeName || "—"}
                      </td>

                      {/* Total Orders */}
                      <td className="px-4 py-3 font-bold text-foreground whitespace-nowrap text-xs">
                        {customer.totalOrders}
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
                        {customer.totalDue > 0 ? (
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
                        {customer.currentBalance > 0 ? (
                          <span className="font-semibold text-rose-500">
                            {formatBDT(customer.currentBalance)}
                          </span>
                        ) : customer.currentBalance < 0 ? (
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

        {/* Customer Report Pagination */}
        <div className="px-6 py-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/40">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Show</span>
            <Select
              value={String(tcPageSize)}
              onValueChange={(val) => { setTcPageSize(Number(val)); setTcCurrentPage(1); }}
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
              <strong className="text-foreground">{tcTotalEntries === 0 ? 0 : (tcCurrentPage - 1) * tcPageSize + 1}</strong>{" "}
              to{" "}
              <strong className="text-foreground">{Math.min(tcCurrentPage * tcPageSize, tcTotalEntries)}</strong>{" "}
              of <strong className="text-foreground">{tcTotalEntries}</strong> customers
            </span>
          </div>
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setTcCurrentPage((p) => Math.max(1, p - 1))}
              disabled={tcCurrentPage <= 1}
              className="h-8 w-8 rounded-md border border-border bg-background hover:bg-muted text-foreground disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: tcTotalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setTcCurrentPage(page)}
                className={cn(
                  "h-8 w-8 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer flex items-center justify-center",
                  tcCurrentPage === page
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "border border-border bg-background text-foreground hover:bg-muted"
                )}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setTcCurrentPage((p) => Math.min(tcTotalPages, p + 1))}
              disabled={tcCurrentPage >= tcTotalPages}
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
