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

export interface SalesReportRow {
  id: string;
  invoiceNo: string;
  customerName: string;
  customerId: string;
  grandTotal: number;
  payableTotal: number;
  paidAmount: number;
  dueAmount: number;
  changeAmount: number;
  store: string;
  storeId: string;
  unitsSold: number;
  status: "Completed" | "Pending" | "Processing" | "Cancelled";
  paymentStatus: "Paid" | "Partial" | "Due";
  createdAt: string;
  isoDate: string;
}

const INITIAL_MOCK_DATA: SalesReportRow[] = [
  {
    id: "sale-1",
    invoiceNo: "INV-2026-0045",
    customerName: "Rahim Enterprise",
    customerId: "cust-1",
    grandTotal: 25400.0,
    payableTotal: 25000.0,
    paidAmount: 25000.0,
    dueAmount: 0.0,
    changeAmount: 0.0,
    store: "Main Branch (Dhaka)",
    storeId: "store-main",
    unitsSold: 42,
    status: "Completed",
    paymentStatus: "Paid",
    createdAt: "08 Oct 2026, 11:30 AM",
    isoDate: "2026-10-08",
  },
  {
    id: "sale-2",
    invoiceNo: "INV-2026-0044",
    customerName: "Karim Trading Co.",
    customerId: "cust-2",
    grandTotal: 18200.0,
    payableTotal: 18000.0,
    paidAmount: 10000.0,
    dueAmount: 8000.0,
    changeAmount: 0.0,
    store: "Gulshan Flagship Store",
    storeId: "store-gulshan",
    unitsSold: 28,
    status: "Completed",
    paymentStatus: "Partial",
    createdAt: "08 Oct 2026, 10:15 AM",
    isoDate: "2026-10-08",
  },
  {
    id: "sale-3",
    invoiceNo: "INV-2026-0043",
    customerName: "Walk-in Customer",
    customerId: "cust-walkin",
    grandTotal: 3450.0,
    payableTotal: 3450.0,
    paidAmount: 3500.0,
    dueAmount: 0.0,
    changeAmount: 50.0,
    store: "Dhanmondi Hub",
    storeId: "store-dhanmondi",
    unitsSold: 6,
    status: "Completed",
    paymentStatus: "Paid",
    createdAt: "07 Oct 2026, 08:45 PM",
    isoDate: "2026-10-07",
  },
  {
    id: "sale-4",
    invoiceNo: "INV-2026-0042",
    customerName: "Bengal Superstore",
    customerId: "cust-3",
    grandTotal: 45600.0,
    payableTotal: 44800.0,
    paidAmount: 44800.0,
    dueAmount: 0.0,
    changeAmount: 0.0,
    store: "Main Branch (Dhaka)",
    storeId: "store-main",
    unitsSold: 94,
    status: "Completed",
    paymentStatus: "Paid",
    createdAt: "07 Oct 2026, 06:10 PM",
    isoDate: "2026-10-07",
  },
  {
    id: "sale-5",
    invoiceNo: "INV-2026-0041",
    customerName: "Apex Retail",
    customerId: "cust-4",
    grandTotal: 12800.0,
    payableTotal: 12800.0,
    paidAmount: 0.0,
    dueAmount: 12800.0,
    changeAmount: 0.0,
    store: "Uttara Outlet",
    storeId: "store-uttara",
    unitsSold: 18,
    status: "Pending",
    paymentStatus: "Due",
    createdAt: "07 Oct 2026, 03:20 PM",
    isoDate: "2026-10-07",
  },
  {
    id: "sale-6",
    invoiceNo: "INV-2026-0040",
    customerName: "Green Valley Agro",
    customerId: "cust-5",
    grandTotal: 32150.0,
    payableTotal: 31500.0,
    paidAmount: 20000.0,
    dueAmount: 11500.0,
    changeAmount: 0.0,
    store: "Chittagong Central",
    storeId: "store-ctg",
    unitsSold: 55,
    status: "Completed",
    paymentStatus: "Partial",
    createdAt: "06 Oct 2026, 05:40 PM",
    isoDate: "2026-10-06",
  },
  {
    id: "sale-7",
    invoiceNo: "INV-2026-0039",
    customerName: "Walk-in Customer",
    customerId: "cust-walkin",
    grandTotal: 1850.0,
    payableTotal: 1850.0,
    paidAmount: 2000.0,
    dueAmount: 0.0,
    changeAmount: 150.0,
    store: "Main Branch (Dhaka)",
    storeId: "store-main",
    unitsSold: 3,
    status: "Completed",
    paymentStatus: "Paid",
    createdAt: "06 Oct 2026, 02:15 PM",
    isoDate: "2026-10-06",
  },
  {
    id: "sale-8",
    invoiceNo: "INV-2026-0038",
    customerName: "Modern Tech Solutions",
    customerId: "cust-6",
    grandTotal: 56000.0,
    payableTotal: 55000.0,
    paidAmount: 55000.0,
    dueAmount: 0.0,
    changeAmount: 0.0,
    store: "Gulshan Flagship Store",
    storeId: "store-gulshan",
    unitsSold: 110,
    status: "Completed",
    paymentStatus: "Paid",
    createdAt: "05 Oct 2026, 04:50 PM",
    isoDate: "2026-10-05",
  },
  {
    id: "sale-9",
    invoiceNo: "INV-2026-0037",
    customerName: "Dhaka Grocers",
    customerId: "cust-7",
    grandTotal: 9400.0,
    payableTotal: 9200.0,
    paidAmount: 0.0,
    dueAmount: 9200.0,
    changeAmount: 0.0,
    store: "Dhanmondi Hub",
    storeId: "store-dhanmondi",
    unitsSold: 14,
    status: "Cancelled",
    paymentStatus: "Due",
    createdAt: "05 Oct 2026, 12:30 PM",
    isoDate: "2026-10-05",
  },
  {
    id: "sale-10",
    invoiceNo: "INV-2026-0036",
    customerName: "Walk-in Customer",
    customerId: "cust-walkin",
    grandTotal: 5750.0,
    payableTotal: 5750.0,
    paidAmount: 5750.0,
    dueAmount: 0.0,
    changeAmount: 0.0,
    store: "Uttara Outlet",
    storeId: "store-uttara",
    unitsSold: 9,
    status: "Completed",
    paymentStatus: "Paid",
    createdAt: "04 Oct 2026, 07:15 PM",
    isoDate: "2026-10-04",
  },
  {
    id: "sale-11",
    invoiceNo: "INV-2026-0035",
    customerName: "Padma Distributions",
    customerId: "cust-8",
    grandTotal: 68300.0,
    payableTotal: 66500.0,
    paidAmount: 66500.0,
    dueAmount: 0.0,
    changeAmount: 0.0,
    store: "Chittagong Central",
    storeId: "store-ctg",
    unitsSold: 135,
    status: "Completed",
    paymentStatus: "Paid",
    createdAt: "04 Oct 2026, 01:20 PM",
    isoDate: "2026-10-04",
  },
  {
    id: "sale-12",
    invoiceNo: "INV-2026-0034",
    customerName: "Prime Pharma",
    customerId: "cust-9",
    grandTotal: 28900.0,
    payableTotal: 28000.0,
    paidAmount: 15000.0,
    dueAmount: 13000.0,
    changeAmount: 0.0,
    store: "Gulshan Flagship Store",
    storeId: "store-gulshan",
    unitsSold: 45,
    status: "Processing",
    paymentStatus: "Partial",
    createdAt: "03 Oct 2026, 09:45 AM",
    isoDate: "2026-10-03",
  },
  {
    id: "sale-13",
    invoiceNo: "INV-2026-0033",
    customerName: "Star Stationery",
    customerId: "cust-10",
    grandTotal: 7650.0,
    payableTotal: 7500.0,
    paidAmount: 7500.0,
    dueAmount: 0.0,
    changeAmount: 0.0,
    store: "Dhanmondi Hub",
    storeId: "store-dhanmondi",
    unitsSold: 22,
    status: "Completed",
    paymentStatus: "Paid",
    createdAt: "02 Oct 2026, 03:30 PM",
    isoDate: "2026-10-02",
  },
  {
    id: "sale-14",
    invoiceNo: "INV-2026-0032",
    customerName: "Walk-in Customer",
    customerId: "cust-walkin",
    grandTotal: 4100.0,
    payableTotal: 4100.0,
    paidAmount: 4100.0,
    dueAmount: 0.0,
    changeAmount: 0.0,
    store: "Main Branch (Dhaka)",
    storeId: "store-main",
    unitsSold: 8,
    status: "Completed",
    paymentStatus: "Paid",
    createdAt: "01 Oct 2026, 04:10 PM",
    isoDate: "2026-10-01",
  },
  {
    id: "sale-15",
    invoiceNo: "INV-2026-0031",
    customerName: "Sylhet Wholesale Hub",
    customerId: "cust-11",
    grandTotal: 39500.0,
    payableTotal: 38800.0,
    paidAmount: 38800.0,
    dueAmount: 0.0,
    changeAmount: 0.0,
    store: "Main Branch (Dhaka)",
    storeId: "store-main",
    unitsSold: 76,
    status: "Completed",
    paymentStatus: "Paid",
    createdAt: "01 Oct 2026, 11:00 AM",
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

const CUSTOMER_OPTIONS = [
  { value: "all", label: "Select Customer" },
  { value: "cust-walkin", label: "Walk-in Customer" },
  { value: "cust-1", label: "Rahim Enterprise" },
  { value: "cust-2", label: "Karim Trading Co." },
  { value: "cust-3", label: "Bengal Superstore" },
  { value: "cust-4", label: "Apex Retail" },
  { value: "cust-5", label: "Green Valley Agro" },
  { value: "cust-6", label: "Modern Tech Solutions" },
  { value: "cust-7", label: "Dhaka Grocers" },
  { value: "cust-8", label: "Padma Distributions" },
  { value: "cust-9", label: "Prime Pharma" },
  { value: "cust-10", label: "Star Stationery" },
  { value: "cust-11", label: "Sylhet Wholesale Hub" },
];

// ============================================================================
// TOP CUSTOMERS MOCK DATA
// ============================================================================

export interface TopCustomer {
  rank: number;
  id: string;
  customerName: string;
  customerCode: string;
  category: string;
  ordersCount: number;
  totalSales: number;
  outstandingDue: number;
  avgOrderValue: number;
  growthRate: number;
}

const TOP_CUSTOMERS_MOCK: TopCustomer[] = [
  {
    rank: 1,
    id: "cust-1",
    customerName: "Rahim Enterprise",
    customerCode: "CUS-RAH-01",
    category: "Retail",
    ordersCount: 38,
    totalSales: 612000,
    outstandingDue: 12500,
    avgOrderValue: 16105,
    growthRate: 14.6,
  },
  {
    rank: 2,
    id: "cust-8",
    customerName: "Padma Distributions",
    customerCode: "CUS-PAD-08",
    category: "Wholesale",
    ordersCount: 34,
    totalSales: 548700,
    outstandingDue: 0,
    avgOrderValue: 16138,
    growthRate: 12.1,
  },
  {
    rank: 3,
    id: "cust-3",
    customerName: "Bengal Superstore",
    customerCode: "CUS-BEN-03",
    category: "Retail",
    ordersCount: 29,
    totalSales: 486500,
    outstandingDue: 24000,
    avgOrderValue: 16776,
    growthRate: 9.8,
  },
  {
    rank: 4,
    id: "cust-6",
    customerName: "Modern Tech Solutions",
    customerCode: "CUS-MTS-06",
    category: "Corporate",
    ordersCount: 26,
    totalSales: 431200,
    outstandingDue: 0,
    avgOrderValue: 16585,
    growthRate: 18.4,
  },
  {
    rank: 5,
    id: "cust-2",
    customerName: "Karim Trading Co.",
    customerCode: "CUS-KAR-02",
    category: "Wholesale",
    ordersCount: 24,
    totalSales: 372900,
    outstandingDue: 46500,
    avgOrderValue: 15538,
    growthRate: 5.3,
  },
  {
    rank: 6,
    id: "cust-11",
    customerName: "Sylhet Wholesale Hub",
    customerCode: "CUS-SYL-11",
    category: "Wholesale",
    ordersCount: 21,
    totalSales: 318600,
    outstandingDue: 18900,
    avgOrderValue: 15171,
    growthRate: 3.7,
  },
  {
    rank: 7,
    id: "cust-5",
    customerName: "Green Valley Agro",
    customerCode: "CUS-GVA-05",
    category: "Agro & Foods",
    ordersCount: 18,
    totalSales: 245300,
    outstandingDue: 11500,
    avgOrderValue: 13628,
    growthRate: -2.4,
  },
  {
    rank: 8,
    id: "cust-9",
    customerName: "Prime Pharma",
    customerCode: "CUS-PRP-09",
    category: "Pharmacy",
    ordersCount: 16,
    totalSales: 198400,
    outstandingDue: 32000,
    avgOrderValue: 12400,
    growthRate: -6.1,
  },
];

const TC_CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "Retail", label: "Retail" },
  { value: "Wholesale", label: "Wholesale" },
  { value: "Corporate", label: "Corporate" },
  { value: "Agro & Foods", label: "Agro & Foods" },
  { value: "Pharmacy", label: "Pharmacy" },
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

export default function CustomerReportPage() {
  // Filter States
  const [startDate, setStartDate] = useState("2026-10-01");
  const [endDate, setEndDate] = useState("2026-10-08");
  const [selectedStore, setSelectedStore] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState("all");

  // Applied Filters State (Updated when "Generate Report" is clicked)
  const [appliedFilters, setAppliedFilters] = useState({
    startDate: "2026-10-01",
    endDate: "2026-10-08",
    store: "all",
    customer: "all",
  });

  // Customer Report table filter
  const [tcCategoryFilter, setTcCategoryFilter] = useState("all");
  const [tcPageSize, setTcPageSize] = useState(10);
  const [tcCurrentPage, setTcCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  const filteredTopCustomers = useMemo(() => {
    if (tcCategoryFilter === "all") return TOP_CUSTOMERS_MOCK;
    return TOP_CUSTOMERS_MOCK.filter((c) => c.category === tcCategoryFilter);
  }, [tcCategoryFilter]);

  const tcTotalEntries = filteredTopCustomers.length;
  const tcTotalPages = Math.max(1, Math.ceil(tcTotalEntries / tcPageSize));
  const paginatedTopCustomers = useMemo(() => {
    const start = (tcCurrentPage - 1) * tcPageSize;
    return filteredTopCustomers.slice(start, start + tcPageSize);
  }, [filteredTopCustomers, tcCurrentPage, tcPageSize]);

  // Filtered Sales Rows (drives the Customer Report KPIs)
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
        item.storeId !== appliedFilters.store
      ) {
        return false;
      }
      if (
        appliedFilters.customer !== "all" &&
        item.customerId !== appliedFilters.customer
      ) {
        return false;
      }
      return true;
    });
  }, [appliedFilters]);

  // Aggregate Metrics for Customer Report KPI Cards (respects applied filters)
  const customerReportKpis = useMemo(() => {
    const totalAmount = filteredData.reduce((s, r) => s + r.grandTotal, 0);
    const totalPaid = filteredData.reduce((s, r) => s + r.paidAmount, 0);
    const totalDue = filteredData.reduce((s, r) => s + r.dueAmount, 0);
    const totalItems = filteredData.reduce((s, r) => s + r.unitsSold, 0);
    const totalOrders = filteredData.length;
    const uniqueCustomers = new Set(filteredData.map((r) => r.customerId)).size;
    return { totalAmount, totalPaid, totalDue, totalItems, totalOrders, uniqueCustomers };
  }, [filteredData]);

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
    setEndDate("2026-10-08");
    setSelectedStore("all");
    setSelectedCustomer("all");
    setTcCategoryFilter("all");

    setAppliedFilters({
      startDate: "2026-10-01",
      endDate: "2026-10-08",
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
        "Rank",
        "Customer Name",
        "Code",
        "Category",
        "Orders",
        "Total Sales",
        "Outstanding Due",
        "Avg. Order",
        "Growth",
      ];

      const csvRows = [
        headers.join(","),
        ...filteredTopCustomers.map((customer) =>
          [
            customer.rank,
            `"${customer.customerName}"`,
            `"${customer.customerCode}"`,
            `"${customer.category}"`,
            customer.ordersCount,
            customer.totalSales,
            customer.outstandingDue,
            customer.avgOrderValue,
            customer.growthRate,
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
                ৳{customerReportKpis.totalAmount.toLocaleString("en-IN")}
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
                ৳{customerReportKpis.totalPaid.toLocaleString("en-IN")}
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
                ৳{customerReportKpis.totalDue.toLocaleString("en-IN")}
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
                {customerReportKpis.totalItems.toLocaleString("en-IN")}
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
              <p className="text-xs font-semibold text-muted-foreground truncate">Unique Customers</p>
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
            <Select value={tcCategoryFilter} onValueChange={(v) => { setTcCategoryFilter(v); setTcCurrentPage(1); }}>
              <SelectTrigger className="h-9 w-[160px] rounded-md border-input bg-background text-foreground text-xs">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover text-popover-foreground">
                {TC_CATEGORY_OPTIONS.map((opt) => (
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
                <th className="px-4 py-3.5 whitespace-nowrap">Customer Name</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Code</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Category</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Orders</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Total Sales</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Outstanding Due</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Avg. Order</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {paginatedTopCustomers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm font-medium">No customers found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedTopCustomers.map((customer) => {
                  const isPositiveGrowth = customer.growthRate >= 0;
                  return (
                    <tr key={customer.id} className="hover:bg-muted/40 transition-colors">
                      {/* Rank */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {customer.rank === 1 && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                            <Trophy className="h-3 w-3" />#1
                          </span>
                        )}
                        {customer.rank === 2 && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-muted text-foreground border border-border">
                            <Medal className="h-3 w-3" />#2
                          </span>
                        )}
                        {customer.rank === 3 && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-700/15 text-orange-400 border border-orange-700/30">
                            <Medal className="h-3 w-3" />#3
                          </span>
                        )}
                        {customer.rank > 3 && (
                          <span className="font-mono text-muted-foreground text-xs">#{customer.rank}</span>
                        )}
                      </td>
                      {/* Customer Name */}
                      <td className="px-4 py-3 font-semibold text-foreground whitespace-nowrap max-w-[240px] truncate">
                        {customer.customerName}
                      </td>
                      {/* Code */}
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                        {customer.customerCode}
                      </td>
                      {/* Category */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
                          {customer.category}
                        </span>
                      </td>
                      {/* Orders */}
                      <td className="px-4 py-3 font-bold text-foreground whitespace-nowrap">
                        {customer.ordersCount.toLocaleString()}
                      </td>
                      {/* Total Sales */}
                      <td className="px-4 py-3 font-medium text-emerald-400 whitespace-nowrap">
                        {formatBDT(customer.totalSales)}
                      </td>
                      {/* Outstanding Due */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={cn(
                          "font-semibold",
                          customer.outstandingDue > 0 ? "text-rose-400" : "text-muted-foreground"
                        )}>
                          {formatBDT(customer.outstandingDue)}
                        </span>
                      </td>
                      {/* Avg Order */}
                      <td className="px-4 py-3 text-foreground whitespace-nowrap">
                        {formatBDT(customer.avgOrderValue)}
                      </td>
                      {/* Growth Rate */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={cn(
                          "inline-flex items-center gap-1 text-xs font-semibold",
                          isPositiveGrowth ? "text-emerald-400" : "text-rose-400"
                        )}>
                          {isPositiveGrowth ? "▲" : "▼"}
                          {Math.abs(customer.growthRate)}%
                        </span>
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
