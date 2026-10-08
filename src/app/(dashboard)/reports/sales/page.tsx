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
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Package,
  Star,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

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

const ORDER_STATUS_OPTIONS = [
  { value: "all", label: "Choose" },
  { value: "Completed", label: "Completed" },
  { value: "Pending", label: "Pending" },
  { value: "Processing", label: "Processing" },
  { value: "Cancelled", label: "Cancelled" },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: "all", label: "Choose" },
  { value: "Paid", label: "Paid" },
  { value: "Partial", label: "Partial" },
  { value: "Due", label: "Due" },
];

// ============================================================================
// BEST SELLING MOCK DATA
// ============================================================================

export interface BestSellingProduct {
  rank: number;
  id: string;
  productName: string;
  sku: string;
  category: string;
  unitsSold: number;
  totalRevenue: number;
  avgSellingPrice: number;
  stockLeft: number;
  growthRate: number;
}

const BEST_SELLING_MOCK: BestSellingProduct[] = [
  {
    rank: 1,
    id: "prod-1",
    productName: "Premium Rice (Miniket) 5kg",
    sku: "GRC-MNK-5K",
    category: "Groceries",
    unitsSold: 342,
    totalRevenue: 188100,
    avgSellingPrice: 550,
    stockLeft: 214,
    growthRate: 18.4,
  },
  {
    rank: 2,
    id: "prod-2",
    productName: "Soybean Oil 5L",
    sku: "OIL-SOY-5L",
    category: "Cooking Oil",
    unitsSold: 298,
    totalRevenue: 238400,
    avgSellingPrice: 800,
    stockLeft: 87,
    growthRate: 12.1,
  },
  {
    rank: 3,
    id: "prod-3",
    productName: "Arla Full Cream Milk 1L",
    sku: "DRY-ARL-1L",
    category: "Dairy",
    unitsSold: 276,
    totalRevenue: 96600,
    avgSellingPrice: 350,
    stockLeft: 320,
    growthRate: 9.7,
  },
  {
    rank: 4,
    id: "prod-4",
    productName: "Lux Soap Bar (Pack of 4)",
    sku: "SOAP-LUX-P4",
    category: "Personal Care",
    unitsSold: 243,
    totalRevenue: 72900,
    avgSellingPrice: 300,
    stockLeft: 155,
    growthRate: 6.3,
  },
  {
    rank: 5,
    id: "prod-5",
    productName: "Nescafe Classic 200g",
    sku: "BEV-NES-200",
    category: "Beverages",
    unitsSold: 218,
    totalRevenue: 130800,
    avgSellingPrice: 600,
    stockLeft: 43,
    growthRate: 22.5,
  },
  {
    rank: 6,
    id: "prod-6",
    productName: "Fresh Bread (Large Loaf)",
    sku: "BAK-BRD-LG",
    category: "Bakery",
    unitsSold: 195,
    totalRevenue: 48750,
    avgSellingPrice: 250,
    stockLeft: 28,
    growthRate: -3.2,
  },
  {
    rank: 7,
    id: "prod-7",
    productName: "Sugar (Refined) 1kg",
    sku: "GRC-SUG-1K",
    category: "Groceries",
    unitsSold: 187,
    totalRevenue: 28050,
    avgSellingPrice: 150,
    stockLeft: 512,
    growthRate: 4.8,
  },
  {
    rank: 8,
    id: "prod-8",
    productName: "Hand Sanitizer 250ml",
    sku: "HGN-SAN-250",
    category: "Hygiene",
    unitsSold: 174,
    totalRevenue: 69600,
    avgSellingPrice: 400,
    stockLeft: 98,
    growthRate: 15.6,
  },
  {
    rank: 9,
    id: "prod-9",
    productName: "Chicken Curry Masala 100g",
    sku: "SPC-CCM-100",
    category: "Spices",
    unitsSold: 161,
    totalRevenue: 40250,
    avgSellingPrice: 250,
    stockLeft: 230,
    growthRate: 7.9,
  },
  {
    rank: 10,
    id: "prod-10",
    productName: "Bottled Water 600ml (24-pack)",
    sku: "BEV-WAT-24P",
    category: "Beverages",
    unitsSold: 148,
    totalRevenue: 44400,
    avgSellingPrice: 300,
    stockLeft: 176,
    growthRate: 2.1,
  },
];

const BS_CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "Groceries", label: "Groceries" },
  { value: "Cooking Oil", label: "Cooking Oil" },
  { value: "Dairy", label: "Dairy" },
  { value: "Personal Care", label: "Personal Care" },
  { value: "Beverages", label: "Beverages" },
  { value: "Bakery", label: "Bakery" },
  { value: "Hygiene", label: "Hygiene" },
  { value: "Spices", label: "Spices" },
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

export default function SalesReportPage() {
  // Filter States
  const [startDate, setStartDate] = useState("2026-10-01");
  const [endDate, setEndDate] = useState("2026-10-08");
  const [selectedStore, setSelectedStore] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState("all");
  const [selectedOrderStatus, setSelectedOrderStatus] = useState("all");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all");

  // Sub-menu tab
  const [activeTab, setActiveTab] = useState<"sales-report" | "best-selling">("sales-report");

  // Applied Filters State (Updated when "Generate Report" is clicked)
  const [appliedFilters, setAppliedFilters] = useState({
    startDate: "2026-10-01",
    endDate: "2026-10-08",
    store: "all",
    customer: "all",
    orderStatus: "all",
    paymentStatus: "all",
  });

  // Best Selling filter
  const [bsCategoryFilter, setBsCategoryFilter] = useState("all");
  const [bsPageSize, setBsPageSize] = useState(10);
  const [bsCurrentPage, setBsCurrentPage] = useState(1);

  const filteredBestSelling = useMemo(() => {
    if (bsCategoryFilter === "all") return BEST_SELLING_MOCK;
    return BEST_SELLING_MOCK.filter((p) => p.category === bsCategoryFilter);
  }, [bsCategoryFilter]);

  const bsTotalEntries = filteredBestSelling.length;
  const bsTotalPages = Math.max(1, Math.ceil(bsTotalEntries / bsPageSize));
  const paginatedBestSelling = useMemo(() => {
    const start = (bsCurrentPage - 1) * bsPageSize;
    return filteredBestSelling.slice(start, start + bsPageSize);
  }, [filteredBestSelling, bsCurrentPage, bsPageSize]);

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
        item.storeId !== appliedFilters.store
      ) {
        return false;
      }
      // Customer filter
      if (
        appliedFilters.customer !== "all" &&
        item.customerId !== appliedFilters.customer
      ) {
        return false;
      }
      // Order Status filter
      if (
        appliedFilters.orderStatus !== "all" &&
        item.status !== appliedFilters.orderStatus
      ) {
        return false;
      }
      // Payment Status filter
      if (
        appliedFilters.paymentStatus !== "all" &&
        item.paymentStatus !== appliedFilters.paymentStatus
      ) {
        return false;
      }
      return true;
    });
  }, [appliedFilters]);

  // Aggregate Metrics for 4 KPI Cards
  const kpiMetrics = useMemo(() => {
    const totalUnits = filteredData.reduce((sum, row) => sum + row.unitsSold, 0);
    const totalSales = filteredData.reduce((sum, row) => sum + row.payableTotal, 0);
    const totalPaid = filteredData.reduce((sum, row) => sum + row.paidAmount, 0);
    const totalDue = filteredData.reduce((sum, row) => sum + row.dueAmount, 0);

    return { totalUnits, totalSales, totalPaid, totalDue };
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
      customer: selectedCustomer,
      orderStatus: selectedOrderStatus,
      paymentStatus: selectedPaymentStatus,
    });
    setCurrentPage(1);
  };

  // Handle Reset Filter
  const handleResetFilter = () => {
    setStartDate("2026-10-01");
    setEndDate("2026-10-08");
    setSelectedStore("all");
    setSelectedCustomer("all");
    setSelectedOrderStatus("all");
    setSelectedPaymentStatus("all");

    setAppliedFilters({
      startDate: "2026-10-01",
      endDate: "2026-10-08",
      store: "all",
      customer: "all",
      orderStatus: "all",
      paymentStatus: "all",
    });
    setCurrentPage(1);
  };

  // Handle Export Excel / CSV
  const handleDownloadExcel = () => {
    setIsExporting(true);
    try {
      const headers = [
        "#",
        "Invoice No",
        "Grand Total",
        "Payable Total",
        "Paid Amount",
        "Due Amount",
        "Change Amount",
        "Store",
        "Status",
        "Payment Status",
        "Created At",
      ];

      const csvRows = [
        headers.join(","),
        ...filteredData.map((row, index) =>
          [
            index + 1,
            `"${row.invoiceNo}"`,
            row.grandTotal,
            row.payableTotal,
            row.paidAmount,
            row.dueAmount,
            row.changeAmount,
            `"${row.store}"`,
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
        `Sales_Report_${new Date().toISOString().slice(0, 10)}.csv`
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
          Sales Reports
        </h1>
        <p className="text-sm text-slate-400">Manage and analyse your sales data</p>
      </div>

      {/* ================================================================== */}
      {/* SUB-MENU TABS                                                       */}
      {/* ================================================================== */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="space-y-6">
        <TabsList className="bg-muted text-muted-foreground border p-1 rounded-lg w-full flex overflow-x-auto select-none scrollbar-none h-auto flex-nowrap shrink-0">
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

          {/* Row 1: Customer */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Customer
            </label>
            <Select
              value={selectedCustomer}
              onValueChange={setSelectedCustomer}
            >
              <SelectTrigger className="w-full h-10 rounded-lg border-[#222c3e] bg-[#141b29] text-slate-200 text-sm focus:border-primary/60 focus:ring-1 focus:ring-primary/20">
                <SelectValue placeholder="Select Customer" />
              </SelectTrigger>
              <SelectContent className="border-[#222c3e] bg-[#141b29] text-slate-200">
                {CUSTOMER_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Row 2: Order Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Order Status
            </label>
            <Select
              value={selectedOrderStatus}
              onValueChange={setSelectedOrderStatus}
            >
              <SelectTrigger className="w-full h-10 rounded-lg border-[#222c3e] bg-[#141b29] text-slate-200 text-sm focus:border-primary/60 focus:ring-1 focus:ring-primary/20">
                <SelectValue placeholder="Choose" />
              </SelectTrigger>
              <SelectContent className="border-[#222c3e] bg-[#141b29] text-slate-200">
                {ORDER_STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Row 2: Payment Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Payment Status
            </label>
            <Select
              value={selectedPaymentStatus}
              onValueChange={setSelectedPaymentStatus}
            >
              <SelectTrigger className="w-full h-10 rounded-lg border-[#222c3e] bg-[#141b29] text-slate-200 text-sm focus:border-primary/60 focus:ring-1 focus:ring-primary/20">
                <SelectValue placeholder="Choose" />
              </SelectTrigger>
              <SelectContent className="border-[#222c3e] bg-[#141b29] text-slate-200">
                {PAYMENT_STATUS_OPTIONS.map((opt) => (
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
      {/* 3. FOUR KPI CARDS (Horizontal Layout matching Image)              */}
      {/* ================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Units Sold — Primary Indigo */}
        <div className="relative overflow-hidden rounded-2xl border border-[#4F5BFF]/25 bg-[#0d131f]/95 p-4 sm:p-5 shadow-lg shadow-black/30 backdrop-blur-xl transition-all duration-200 hover:border-[#4F5BFF]/45 hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="h-13 w-13 rounded-xl bg-[#4F5BFF] flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-950/50">
              <BarChart3 className="h-7 w-7" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-semibold text-slate-400 truncate">
                Total Units Sold
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {formatKpiNumber(kpiMetrics.totalUnits)}
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Total Sales Amount — Emerald (app secondary / positive) */}
        <div className="relative overflow-hidden rounded-2xl border border-[#0FBF9F]/25 bg-[#0d131f]/95 p-4 sm:p-5 shadow-lg shadow-black/30 backdrop-blur-xl transition-all duration-200 hover:border-[#0FBF9F]/45 hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="h-13 w-13 rounded-xl bg-[#0FBF9F] flex items-center justify-center text-white shrink-0 shadow-md shadow-teal-950/50">
              <TrendingUp className="h-7 w-7" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-semibold text-slate-400 truncate">
                Total Sales Amount
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                ৳{formatKpiNumber(kpiMetrics.totalSales)}
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Total Paid — Emerald/success (positive financial metric) */}
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

        {/* Card 4: Total Due — Destructive rose (negative/alert) */}
        <div className="relative overflow-hidden rounded-2xl border border-[#EF4444]/25 bg-[#0d131f]/95 p-4 sm:p-5 shadow-lg shadow-black/30 backdrop-blur-xl transition-all duration-200 hover:border-[#EF4444]/45 hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="h-13 w-13 rounded-xl bg-[#EF4444] flex items-center justify-center text-white shrink-0 shadow-md shadow-red-950/50">
              <ShoppingBag className="h-7 w-7" />
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
      {/* 4. SALES REPORT DATA TABLE CARD                                    */}
      {/* ================================================================== */}
      <div className="rounded-2xl border border-[#1e2738] bg-[#0d131f]/95 shadow-xl shadow-black/30 backdrop-blur-xl overflow-hidden">
        {/* Table Header Bar */}
        <div className="px-6 py-4 border-b border-[#1e2738] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111726]/60">
          <h2 className="text-base font-bold text-slate-100 tracking-tight">
            Sales Report
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
                <th className="px-4 py-3.5 whitespace-nowrap">Invoice No</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Grand Total</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Payable Total</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Paid Amount</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Due Amount</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Change Amount</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Store</th>
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
                      <p className="text-sm font-medium">No sales records found</p>
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

                      {/* Invoice No */}
                      <td className="px-4 py-3 font-semibold text-primary font-mono text-xs whitespace-nowrap group-hover:underline cursor-pointer">
                        {row.invoiceNo}
                      </td>

                      {/* Grand Total */}
                      <td className="px-4 py-3 font-medium text-slate-200 whitespace-nowrap">
                        {formatBDT(row.grandTotal)}
                      </td>

                      {/* Payable Total */}
                      <td className="px-4 py-3 font-medium text-slate-200 whitespace-nowrap">
                        {formatBDT(row.payableTotal)}
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

                      {/* Change Amount */}
                      <td className="px-4 py-3 text-slate-400 font-medium whitespace-nowrap">
                        {formatBDT(row.changeAmount)}
                      </td>

                      {/* Store */}
                      <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                        {row.store}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {row.status === "Completed" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="h-3 w-3" />
                            Completed
                          </span>
                        )}
                        {row.status === "Pending" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Clock className="h-3 w-3" />
                            Pending
                          </span>
                        )}
                        {row.status === "Processing" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <Clock className="h-3 w-3" />
                            Processing
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
        </TabsContent>

        {/* ============================================================== */}
        {/* TAB 2: BEST SELLING                                             */}
        {/* ============================================================== */}
        <TabsContent value="best-selling" className="space-y-6 outline-none">

          {/* Best Selling KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative overflow-hidden rounded-2xl border border-[#4F5BFF]/25 bg-[#0d131f]/95 p-4 sm:p-5 shadow-lg shadow-black/30 backdrop-blur-xl transition-all duration-200 hover:border-[#4F5BFF]/45 hover:-translate-y-0.5">
              <div className="flex items-center gap-4">
                <div className="h-13 w-13 rounded-xl bg-[#4F5BFF] flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-950/50">
                  <Trophy className="h-7 w-7" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs font-semibold text-slate-400 truncate">Top Products</p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{BEST_SELLING_MOCK.length}</p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-[#0FBF9F]/25 bg-[#0d131f]/95 p-4 sm:p-5 shadow-lg shadow-black/30 backdrop-blur-xl transition-all duration-200 hover:border-[#0FBF9F]/45 hover:-translate-y-0.5">
              <div className="flex items-center gap-4">
                <div className="h-13 w-13 rounded-xl bg-[#0FBF9F] flex items-center justify-center text-white shrink-0 shadow-md shadow-teal-950/50">
                  <TrendingUp className="h-7 w-7" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs font-semibold text-slate-400 truncate">Total Units Sold</p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {BEST_SELLING_MOCK.reduce((s, p) => s + p.unitsSold, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-[#1FAF86]/25 bg-[#0d131f]/95 p-4 sm:p-5 shadow-lg shadow-black/30 backdrop-blur-xl transition-all duration-200 hover:border-[#1FAF86]/45 hover:-translate-y-0.5">
              <div className="flex items-center gap-4">
                <div className="h-13 w-13 rounded-xl bg-[#1FAF86] flex items-center justify-center text-white shrink-0 shadow-md shadow-green-950/50">
                  <BarChart3 className="h-7 w-7" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs font-semibold text-slate-400 truncate">Total Revenue</p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    ৳{BEST_SELLING_MOCK.reduce((s, p) => s + p.totalRevenue, 0).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-amber-500/25 bg-[#0d131f]/95 p-4 sm:p-5 shadow-lg shadow-black/30 backdrop-blur-xl transition-all duration-200 hover:border-amber-500/45 hover:-translate-y-0.5">
              <div className="flex items-center gap-4">
                <div className="h-13 w-13 rounded-xl bg-amber-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-amber-950/50">
                  <Star className="h-7 w-7" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs font-semibold text-slate-400 truncate">Avg Growth Rate</p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {(BEST_SELLING_MOCK.reduce((s, p) => s + p.growthRate, 0) / BEST_SELLING_MOCK.length).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Best Selling Table Card */}
          <div className="rounded-2xl border border-[#1e2738] bg-[#0d131f]/95 shadow-xl shadow-black/30 backdrop-blur-xl overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-[#1e2738] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111726]/60">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-bold text-slate-100 tracking-tight">Best Selling Products</h2>
              </div>
              <div className="flex items-center gap-3">
                <Select value={bsCategoryFilter} onValueChange={(v) => { setBsCategoryFilter(v); setBsCurrentPage(1); }}>
                  <SelectTrigger className="h-9 w-[160px] rounded-md border-[#222c3e] bg-[#141b29] text-slate-200 text-xs">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="border-[#222c3e] bg-[#141b29] text-slate-200">
                    {BS_CATEGORY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <button
                  type="button"
                  onClick={handleDownloadExcel}
                  className="h-9 px-3.5 rounded-lg border border-[#4F5BFF]/30 bg-[#4F5BFF]/8 hover:bg-[#4F5BFF]/15 text-[#8b93ff] text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[#1e2738] bg-[#101625] text-slate-400 text-[11px] sm:text-xs font-semibold tracking-wider uppercase">
                    <th className="px-4 py-3.5 whitespace-nowrap">Rank</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Product Name</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">SKU</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Category</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Units Sold</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Total Revenue</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Avg. Price</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Stock Left</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Growth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e2738]/60 text-slate-300">
                  {paginatedBestSelling.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Package className="h-8 w-8 text-slate-500" />
                          <p className="text-sm font-medium">No products found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedBestSelling.map((product) => {
                      const isPositiveGrowth = product.growthRate >= 0;
                      return (
                        <tr key={product.id} className="hover:bg-[#151d2e]/60 transition-colors">
                          {/* Rank */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            {product.rank === 1 && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                <Trophy className="h-3 w-3" />#1
                              </span>
                            )}
                            {product.rank === 2 && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-400/10 text-slate-300 border border-slate-500/30">
                                <Medal className="h-3 w-3" />#2
                              </span>
                            )}
                            {product.rank === 3 && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-700/15 text-orange-400 border border-orange-700/30">
                                <Medal className="h-3 w-3" />#3
                              </span>
                            )}
                            {product.rank > 3 && (
                              <span className="font-mono text-slate-400 text-xs">#{product.rank}</span>
                            )}
                          </td>
                          {/* Product Name */}
                          <td className="px-4 py-3 font-semibold text-slate-100 whitespace-nowrap max-w-[240px] truncate">
                            {product.productName}
                          </td>
                          {/* SKU */}
                          <td className="px-4 py-3 font-mono text-xs text-slate-400 whitespace-nowrap">
                            {product.sku}
                          </td>
                          {/* Category */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#4F5BFF]/10 text-[#8b93ff] border border-[#4F5BFF]/20">
                              {product.category}
                            </span>
                          </td>
                          {/* Units Sold */}
                          <td className="px-4 py-3 font-bold text-slate-100 whitespace-nowrap">
                            {product.unitsSold.toLocaleString()}
                          </td>
                          {/* Total Revenue */}
                          <td className="px-4 py-3 font-medium text-emerald-400 whitespace-nowrap">
                            {formatBDT(product.totalRevenue)}
                          </td>
                          {/* Avg Price */}
                          <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                            {formatBDT(product.avgSellingPrice)}
                          </td>
                          {/* Stock Left */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={cn(
                              "font-semibold",
                              product.stockLeft < 50 ? "text-rose-400" : product.stockLeft < 150 ? "text-amber-400" : "text-slate-300"
                            )}>
                              {product.stockLeft.toLocaleString()}
                            </span>
                          </td>
                          {/* Growth Rate */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={cn(
                              "inline-flex items-center gap-1 text-xs font-semibold",
                              isPositiveGrowth ? "text-emerald-400" : "text-rose-400"
                            )}>
                              {isPositiveGrowth ? "▲" : "▼"}
                              {Math.abs(product.growthRate)}%
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Best Selling Pagination */}
            <div className="px-6 py-4 border-t border-[#1e2738] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#101625]">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="font-medium text-slate-300">Show</span>
                <Select
                  value={String(bsPageSize)}
                  onValueChange={(val) => { setBsPageSize(Number(val)); setBsCurrentPage(1); }}
                >
                  <SelectTrigger className="h-8 w-[72px] rounded-md border-[#222c3e] bg-[#141b29] text-slate-200 text-xs">
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent className="border-[#222c3e] bg-[#141b29] text-slate-200">
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                  </SelectContent>
                </Select>
                <span>
                  Showing{" "}
                  <strong className="text-slate-200">{bsTotalEntries === 0 ? 0 : (bsCurrentPage - 1) * bsPageSize + 1}</strong>{" "}
                  to{" "}
                  <strong className="text-slate-200">{Math.min(bsCurrentPage * bsPageSize, bsTotalEntries)}</strong>{" "}
                  of <strong className="text-slate-200">{bsTotalEntries}</strong> products
                </span>
              </div>
              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setBsCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={bsCurrentPage <= 1}
                  className="h-8 w-8 rounded-md border border-[#222c3e] bg-[#141b29] hover:bg-[#1a2335] text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: bsTotalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setBsCurrentPage(page)}
                    className={cn(
                      "h-8 w-8 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer flex items-center justify-center",
                      bsCurrentPage === page
                        ? "bg-[#4F5BFF] text-white shadow-md shadow-indigo-950/50"
                        : "border border-[#222c3e] bg-[#141b29] text-slate-300 hover:bg-[#1a2335]"
                    )}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setBsCurrentPage((p) => Math.min(bsTotalPages, p + 1))}
                  disabled={bsCurrentPage >= bsTotalPages}
                  className="h-8 w-8 rounded-md border border-[#222c3e] bg-[#141b29] hover:bg-[#1a2335] text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

        </TabsContent>
      </Tabs>
    </div>
  );
}
