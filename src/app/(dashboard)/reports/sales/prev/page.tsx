"use client";

import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  Download,
  RefreshCw,
  ChevronDown,
  Search,
  ChevronLeft,
  ChevronRight,
  Package,
  Layers,
  Users,
  CreditCard,
  Trophy,
  ArrowRight,
  RotateCcw as ReturnIcon,
} from "lucide-react";

// API Hooks
import {
  useGetSalesReportSummary,
  useGetWhatDroveSales,
  useGetProfitMarginReport,
  useGetCustomerDueAgingReport,
  useGetDiscountsReport,
} from "@/hooks/api/useReports";
import { useGetSales } from "@/hooks/api/useSales";
import { useGetSalesReturns } from "@/hooks/api/useReturns";
import { useGetBranches } from "@/hooks/api/useBranches";

// ============================================================================
// DATA & TYPES
// ============================================================================

interface MonthlyTrendPoint {
  month: string;
  sales: number;
  profit: number;
}

interface DriverItem {
  id: string;
  rank: string;
  name: string;
  subtitle: string;
  amount: number;
  share: number;
}

interface SalesReturnRecord {
  id: string;
  returnNo: string;
  date: string;
  invoiceRef: string;
  customer: string;
  item: string;
  quantity: number;
  amount: number;
  reason: string;
  status: "Refunded" | "Replaced";
}

interface RecentSaleItem {
  id: string;
  invoiceNo: string;
  customer: string;
  date: string;
  total: number;
  paid: number;
  due: number;
  status: "paid" | "partial" | "due";
}

// Monthly trend data fallback
const defaultMonthlyTrend: MonthlyTrendPoint[] = [
  { month: "2025-10", sales: 2112626.98, profit: 228679.8 },
  { month: "2025-11", sales: 2271273.14, profit: 249554.23 },
  { month: "2025-12", sales: 2313383.93, profit: 255117.76 },
  { month: "2026-01", sales: 2337349.5, profit: 258547.73 },
  { month: "2026-02", sales: 2001736.98, profit: 218538.98 },
  { month: "2026-03", sales: 2372009.72, profit: 258792.12 },
  { month: "2026-04", sales: 2246953.83, profit: 246927.79 },
  { month: "2026-05", sales: 2390673.53, profit: 258597.94 },
  { month: "2026-06", sales: 2328246.08, profit: 253218.1 },
  { month: "2026-07", sales: 2312305.86, profit: 249583.2 },
  { month: "2026-08", sales: 2318908.84, profit: 253130.32 },
  { month: "2026-09", sales: 2247378.12, profit: 245051.44 },
  { month: "2026-10", sales: 298232.73, profit: 32875.35 },
];

// Driver Data fallback matching the dimensions
const defaultDriversData: Record<"products" | "categories" | "customers" | "payments", DriverItem[]> = {
  products: [
    { id: "p1", rank: "01", name: "Paracetamol 500mg", subtitle: "Tablet • 500mg Box", amount: 42500, share: 17.1 },
    { id: "p2", rank: "02", name: "ORS (Oral Rehydration Salts)", subtitle: "Electrolyte Pack • 25s", amount: 38400, share: 15.5 },
    { id: "p3", rank: "03", name: "Napa Extra Tablet", subtitle: "Paracetamol + Caffeine", amount: 32700, share: 13.2 },
    { id: "p4", rank: "04", name: "Cough Syrup 100ml", subtitle: "Expectorant • Honey Base", amount: 28500, share: 11.5 },
    { id: "p5", rank: "05", name: "Vitamin C 500mg Chewable", subtitle: "Chewable Orange • Strip", amount: 24800, share: 10.0 },
  ],
  categories: [
    { id: "cat1", rank: "01", name: "Allergy & Respiratory", subtitle: "1,830 units • 42.5% volume", amount: 196700, share: 42.5 },
    { id: "cat2", rank: "02", name: "General OTC & Analgesics", subtitle: "2,450 units • 30.9% volume", amount: 142800, share: 30.9 },
    { id: "cat3", rank: "03", name: "Antibiotics & Infectious", subtitle: "620 units • 17.0% volume", amount: 78500, share: 17.0 },
    { id: "cat4", rank: "04", name: "Vitamins & Nutritional", subtitle: "520 units • 9.6% volume", amount: 44300, share: 9.6 },
  ],
  customers: [
    { id: "c1", rank: "01", name: "Walk-in Customer", subtitle: "Counter Direct Traffic • 840 orders", amount: 310200, share: 67.1 },
    { id: "c2", rank: "02", name: "Rudyard Booker", subtitle: "01620173656 • 12 orders", amount: 42500, share: 9.2 },
    { id: "c3", rank: "03", name: "Shawon", subtitle: "01782234235 • 8 orders", amount: 28400, share: 6.1 },
    { id: "c4", rank: "04", name: "Walking Customer", subtitle: "01620173655 • 6 orders", amount: 18200, share: 3.9 },
    { id: "c5", rank: "05", name: "Alpha Clinic & Care", subtitle: "Wholesale Partner • 4 orders", amount: 15600, share: 3.4 },
  ],
  payments: [
    { id: "pm1", rank: "01", name: "Cash Settlement", subtitle: "610 transactions • Counter cash register", amount: 215000, share: 46.5 },
    { id: "pm2", rank: "02", name: "bKash Merchant", subtitle: "345 transactions • MFS API gateway", amount: 138500, share: 29.9 },
    { id: "pm3", rank: "03", name: "Nagad Pay", subtitle: "140 transactions • MFS merchant", amount: 52400, share: 11.3 },
    { id: "pm4", rank: "04", name: "Bank Settlement", subtitle: "28 transactions • Cheque & RTGS", amount: 36400, share: 7.9 },
    { id: "pm5", rank: "05", name: "Card (POS)", subtitle: "125 transactions • Visa & Mastercard", amount: 20000, share: 4.3 },
  ],
};

// Sales Return Report Data fallback
const defaultReturns: SalesReturnRecord[] = [
  {
    id: "r1",
    returnNo: "RET-104",
    date: "Oct 05, 2026",
    invoiceRef: "INV-50005",
    customer: "Rudyard Booker",
    item: "Acea 100mg Syrup",
    quantity: 1,
    amount: 110,
    reason: "Damaged seal on box",
    status: "Refunded",
  },
  {
    id: "r2",
    returnNo: "RET-103",
    date: "Oct 03, 2026",
    invoiceRef: "INV-50001",
    customer: "Walking Customer",
    item: "Napa Extra Tablet",
    quantity: 2,
    amount: 150,
    reason: "Incorrect dosage purchased",
    status: "Replaced",
  },
  {
    id: "r3",
    returnNo: "RET-102",
    date: "Sep 28, 2026",
    invoiceRef: "INV-49982",
    customer: "Shawon",
    item: "ORS Saline Pack",
    quantity: 5,
    amount: 375,
    reason: "Near expiry date",
    status: "Refunded",
  },
];

// Recent Sales Table Data fallback
const defaultRecentSales: RecentSaleItem[] = [
  {
    id: "s1",
    invoiceNo: "INV-50006",
    customer: "Shawon",
    date: "Oct 06, 2026 14:22",
    total: 110,
    paid: 0,
    due: 110,
    status: "due",
  },
  {
    id: "s2",
    invoiceNo: "INV-50005",
    customer: "Rudyard Booker",
    date: "Oct 05, 2026 11:05",
    total: 110,
    paid: 55,
    due: 55,
    status: "partial",
  },
  {
    id: "s3",
    invoiceNo: "INV-50004",
    customer: "Walking Customer",
    date: "Oct 04, 2026 17:40",
    total: 220,
    paid: 220,
    due: 0,
    status: "paid",
  },
  {
    id: "s4",
    invoiceNo: "INV-50003",
    customer: "Walk-in Customer",
    date: "Oct 03, 2026 19:15",
    total: 110,
    paid: 110,
    due: 0,
    status: "paid",
  },
  {
    id: "s5",
    invoiceNo: "INV-50002",
    customer: "Walk-in Customer",
    date: "Oct 02, 2026 10:30",
    total: 110,
    paid: 110,
    due: 0,
    status: "paid",
  },
];

// Currency formatting
function formatBDT(val: number | string | undefined, includeDecimals = true): string {
  const num = typeof val === "string" ? parseFloat(val) : Number(val);
  if (isNaN(num)) return "৳0";
  return (
    "৳" +
    num.toLocaleString("en-IN", {
      minimumFractionDigits: includeDecimals ? 2 : 0,
      maximumFractionDigits: includeDecimals ? 2 : 0,
    })
  );
}

function formatMonthLabel(m: string): string {
  if (!m) return "";
  const parts = m.split("-");
  if (parts.length === 2) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthIdx = parseInt(parts[1], 10) - 1;
    if (monthIdx >= 0 && monthIdx < 12) {
      return `${months[monthIdx]} '${parts[0].slice(2)}`;
    }
  }
  return m;
}

export default function SalesReportsPage() {
  // Filter States
  const [dateRange, setDateRange] = useState("Oct 1, 2026 — Oct 6, 2026");
  const [datePreset, setDatePreset] = useState<string>("this_month");
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedSalesperson, setSelectedSalesperson] = useState("all");

  // Chart Series Toggle
  const [showSalesSeries, setShowSalesSeries] = useState(true);
  const [showProfitSeries, setShowProfitSeries] = useState(true);

  // Dimension Tabs in "What Drove Sales"
  const [activeDriverTab, setActiveDriverTab] = useState<
    "products" | "categories" | "customers" | "payments"
  >("products");

  // Focus state when clicking a driver row
  const [focusedDriverId, setFocusedDriverId] = useState<string | null>(null);

  // Recent Sales Search Query & Pagination
  const [recentSearch, setRecentSearch] = useState("");
  const [salesPage, setSalesPage] = useState(1);

  // Compute ISO Dates for API filters
  const { startDate, endDate } = useMemo(() => {
    const today = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    if (datePreset === "today") {
      const dStr = fmt(today);
      return { startDate: dStr, endDate: dStr };
    }
    if (datePreset === "last_7_days") {
      const prev = new Date();
      prev.setDate(today.getDate() - 7);
      return { startDate: fmt(prev), endDate: fmt(today) };
    }
    if (datePreset === "last_30_days") {
      const prev = new Date();
      prev.setDate(today.getDate() - 30);
      return { startDate: fmt(prev), endDate: fmt(today) };
    }
    if (datePreset === "this_month") {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      return { startDate: fmt(startOfMonth), endDate: fmt(today) };
    }
    return { startDate: undefined, endDate: undefined };
  }, [datePreset]);

  const reportsFilter = useMemo(() => {
    const filter: any = {};
    if (startDate) filter.startDate = startDate;
    if (endDate) filter.endDate = endDate;
    if (selectedBranch && selectedBranch !== "all") filter.branchId = selectedBranch;
    return filter;
  }, [startDate, endDate, selectedBranch]);

  // ============================================================================
  // API DATA HOOKS
  // ============================================================================
  // 1. Sales Report Summary (Overview KPIs & Trend)
  const {
    data: summaryData,
    isLoading: isLoadingSummary,
    isFetching: isFetchingSummary,
    refetch: refetchSummary,
  } = useGetSalesReportSummary(reportsFilter);

  // 2. What Drove Sales Driver Analysis
  const driverQueryMode = activeDriverTab === "payments" ? "payment_methods" : activeDriverTab;
  const {
    data: whatDroveSalesData,
    refetch: refetchDrivers,
  } = useGetWhatDroveSales({
    ...reportsFilter,
    driver: driverQueryMode,
    limit: 10,
  });

  // 3. Profit Margin Report
  const { data: profitMarginData, refetch: refetchProfit } = useGetProfitMarginReport(reportsFilter);

  // 4. Customer Due Aging Report
  const { data: dueAgingData, refetch: refetchDueAging } = useGetCustomerDueAgingReport({
    branchId: selectedBranch !== "all" ? selectedBranch : undefined,
  });

  // 5. Discounts Leakage Report
  const { data: discountsData, refetch: refetchDiscounts } = useGetDiscountsReport(reportsFilter);

  // 6. Recent Sales
  const { data: salesResponse } = useGetSales({
    search: recentSearch || undefined,
    limit: 10,
    page: salesPage,
  });

  // 7. Sales Returns
  const { data: returnsResponse } = useGetSalesReturns();

  // 8. Branches
  const { data: branchesData } = useGetBranches();
  const branchList = Array.isArray(branchesData) ? branchesData : [];

  const handleRefresh = () => {
    refetchSummary();
    refetchDrivers();
    refetchProfit();
    refetchDueAging();
    refetchDiscounts();
  };

  // ============================================================================
  // NORMALIZED DATA
  // ============================================================================

  // Normalized KPI metrics from summary, profit, due aging, and discounts reports
  const kpis = useMemo(() => {
    const s = summaryData || {};
    const pm = profitMarginData || {};
    const da = dueAgingData || {};
    const disc = discountsData || {};

    const netSales = Number(s.netSales ?? s.totalSales ?? 462300);
    const orders = Number(s.ordersCount ?? s.totalOrders ?? s.orders ?? 1248);
    const profit = Number(s.profit ?? pm.grossProfit ?? pm.netProfit ?? 126400);
    const due = Number(s.dues ?? da.totalOutstandingDue ?? 33000);
    const margin = Number(
      pm.grossMarginPercentage ?? s.profitMargin ?? (netSales > 0 ? (profit / netSales) * 100 : 27.3)
    ).toFixed(1);

    const totalSales = Number(s.totalSales ?? s.grossSales ?? 485000);
    const itemsSold = Number(s.itemsCount ?? s.totalItemsSold ?? 3420);
    const returnsAmount = Number(s.returns ?? s.totalReturns ?? 10000);
    const discountAmount = Number(s.discounts ?? disc.totalDiscounts ?? 12700);
    const taxAmount = Number(s.tax ?? s.totalTax ?? 10000);
    const grossProfit = Number(pm.grossProfit ?? profit);

    return {
      netSales,
      orders,
      profit,
      due,
      margin,
      totalSales,
      itemsSold,
      returnsAmount,
      discountAmount,
      taxAmount,
      grossProfit,
    };
  }, [summaryData, profitMarginData, dueAgingData, discountsData]);

  // Normalized Trend Points
  const trendData = useMemo(() => {
    const raw = summaryData?.periodBreakdown || summaryData?.monthlyTrend || summaryData?.trend;
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((item: any) => ({
        month: item.period || item.month || item.date || item.label || "",
        sales: Number(item.sales ?? item.totalSales ?? item.amount ?? 0),
        profit: Number(item.profit ?? item.grossProfit ?? item.netProfit ?? 0),
      }));
    }
    return defaultMonthlyTrend;
  }, [summaryData]);

  // Normalized What Drove Sales Driver List
  const currentDriverList = useMemo<DriverItem[]>(() => {
    const raw = whatDroveSalesData;
    let list: any[] = [];

    if (Array.isArray(raw)) {
      list = raw;
    } else if (raw && typeof raw === "object") {
      const key = activeDriverTab === "payments" ? "payment_methods" : activeDriverTab;
      if (Array.isArray(raw[key])) {
        list = raw[key];
      } else if (Array.isArray(raw.items)) {
        list = raw.items;
      } else if (Array.isArray(raw.data)) {
        list = raw.data;
      }
    }

    if (list.length > 0) {
      return list.map((item: any, idx: number) => {
        const id = item.id || item._id || `${activeDriverTab}-${idx}`;
        const name =
          item.name ||
          item.productName ||
          item.categoryName ||
          item.customerName ||
          item.paymentMethod ||
          item.title ||
          "Unknown";
        const subtitle =
          item.subtitle ||
          (item.ordersCount ? `${item.ordersCount} orders` : item.quantity ? `${item.quantity} units sold` : "");
        const amount = Number(item.amount || item.total || item.totalSales || item.revenue || 0);
        const share = Number(
          item.share || item.sharePercentage || item.revenueSharePercentage || item.percentage || 0
        );

        return {
          id,
          rank: item.rank ? String(item.rank).padStart(2, "0") : String(idx + 1).padStart(2, "0"),
          name,
          subtitle,
          amount,
          share,
        };
      });
    }

    return defaultDriversData[activeDriverTab] || [];
  }, [whatDroveSalesData, activeDriverTab]);

  const maxShare = Math.max(...currentDriverList.map((i) => i.share), 1);

  // Normalized Recent Sales
  const recentSalesList = useMemo<RecentSaleItem[]>(() => {
    const raw = salesResponse?.data?.sales || salesResponse?.data || salesResponse?.sales;
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((inv: any) => ({
        id: inv.id || inv._id,
        invoiceNo: inv.invoiceNo || inv.invoiceNumber || `INV-${String(inv.id).slice(-5)}`,
        customer: inv.party?.name || inv.customerName || inv.customer?.name || "Walk-in Customer",
        date: inv.saleDate
          ? new Date(inv.saleDate).toLocaleDateString()
          : inv.createdAt
          ? new Date(inv.createdAt).toLocaleDateString()
          : inv.date || "Today",
        total: Number(inv.totalAmount || inv.grandTotal || inv.total || 0),
        paid: Number(inv.paidAmount || inv.paid || 0),
        due: Number(inv.dueAmount || inv.due || 0),
        status: (
          inv.paymentStatus ||
          (inv.dueAmount > 0 ? (inv.paidAmount > 0 ? "partial" : "due") : "paid")
        ).toLowerCase() as "paid" | "partial" | "due",
      }));
    }
    return defaultRecentSales;
  }, [salesResponse]);

  const filteredRecentSales = useMemo(() => {
    return recentSalesList.filter((inv) => {
      if (!recentSearch) return true;
      const q = recentSearch.toLowerCase();
      return inv.invoiceNo.toLowerCase().includes(q) || inv.customer.toLowerCase().includes(q);
    });
  }, [recentSalesList, recentSearch]);

  // Normalized Sales Returns
  const salesReturnsList = useMemo<SalesReturnRecord[]>(() => {
    const raw = returnsResponse?.data || returnsResponse;
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((r: any, idx: number) => ({
        id: r.id || `ret-${idx}`,
        returnNo: r.returnNo || r.returnNumber || `RET-${100 + idx}`,
        date: r.createdAt
          ? new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
          : r.date || "Recent",
        invoiceRef: r.sale?.invoiceNo || r.invoiceRef || "—",
        customer: r.sale?.party?.name || r.party?.name || r.customer || "Walk-in Customer",
        item: r.item?.name || r.items?.[0]?.name || r.item || "Returned Merchandise",
        quantity: Number(r.quantity || r.items?.reduce((acc: number, it: any) => acc + (it.quantity || 0), 0) || 1),
        amount: Number(r.refundAmount || r.totalAmount || r.amount || 0),
        reason: r.reason || "Customer Return",
        status: (r.status === "Replaced" ? "Replaced" : "Refunded") as "Refunded" | "Replaced",
      }));
    }
    return defaultReturns;
  }, [returnsResponse]);

  const handleExportCsv = () => {
    const headers = ["Invoice No", "Customer", "Date", "Total", "Paid", "Due", "Status"];
    const rows = filteredRecentSales.map((inv) => [
      inv.invoiceNo,
      `"${inv.customer}"`,
      inv.date,
      inv.total,
      inv.paid,
      inv.due,
      inv.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `HelloKhata_Sales_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Rank badge styling helper matching screenshot
  const getRankBadgeClasses = (idx: number) => {
    switch (idx) {
      case 0:
        return "bg-[#382E00] text-[#FACC15] border border-[#6B5800]";
      case 1:
        return "bg-[#0B2545] text-[#38BDF8] border border-[#134375]";
      case 2:
        return "bg-[#063832] text-[#2DD4BF] border border-[#0E6359]";
      case 3:
        return "bg-[#15203D] text-[#93C5FD] border border-[#233566]";
      default:
        return "bg-[#1C2535] text-[#94A3B8] border border-[#2C3B54]";
    }
  };

  return (
    <div className="w-full min-h-screen text-[#F5F7FA] p-4 md:p-6 lg:p-8 space-y-6">
      {/* ==================================================================== */}
      {/* 1. TOP HEADER & FILTER BAR                                           */}
      {/* [ Date Range ] [ Branch ] [ Salesperson ] [Export]                   */}
      {/* ==================================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#F5F7FA]">
            Sales Reports
          </h1>
          <p className="text-xs text-[#737C8C] mt-0.5">
            Track your sales performance, profit, and outstanding payments.
          </p>
        </div>

        {/* Compact Filter Strip */}
        <div className="flex flex-wrap items-center gap-2">
          {/* [ Date Range ] */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#161A22] border border-[#252B36] text-[#F5F7FA] text-xs font-medium hover:border-[#4F5BFF] transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#4F5BFF]" />
              <span>{dateRange}</span>
              <ChevronDown className="w-3 h-3 text-[#737C8C]" />
            </button>

            {showDatePicker && (
              <div className="absolute right-0 mt-1.5 w-48 bg-[#161A22] border border-[#252B36] rounded-xl shadow-2xl p-1.5 z-50 space-y-1">
                {[
                  { label: "Today", value: "today", text: "Today" },
                  { label: "Last 7 Days", value: "last_7_days", text: "Last 7 Days" },
                  { label: "This Month", value: "this_month", text: "Oct 1, 2026 — Oct 6, 2026" },
                  { label: "Last 30 Days", value: "last_30_days", text: "Last 30 Days" },
                  { label: "All Time", value: "all", text: "All Time" },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      setDatePreset(item.value);
                      setDateRange(item.text);
                      setShowDatePicker(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      datePreset === item.value
                        ? "bg-[#4F5BFF] text-white"
                        : "text-[#A7AFBC] hover:bg-[#1C212B] hover:text-[#F5F7FA]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* [ Branch ] */}
          <div className="relative">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="appearance-none pl-3 pr-7 py-1.5 rounded-lg bg-[#161A22] border border-[#252B36] text-[#F5F7FA] text-xs font-medium focus:outline-none focus:border-[#4F5BFF] cursor-pointer"
            >
              <option value="all">All Branches</option>
              {branchList.length > 0 ? (
                branchList.map((b: any) => (
                  <option key={b.id || b._id} value={b.id || b._id}>
                    {b.name}
                  </option>
                ))
              ) : (
                <>
                  <option value="dhanmondi">Dhanmondi Branch - Flagship</option>
                  <option value="mirpur">Mirpur Warehouse Hub</option>
                  <option value="uttara">Uttara Outlet</option>
                </>
              )}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-2 text-[#737C8C] w-3 h-3" />
          </div>

          {/* [ Salesperson ] */}
          <div className="relative">
            <select
              value={selectedSalesperson}
              onChange={(e) => setSelectedSalesperson(e.target.value)}
              className="appearance-none pl-3 pr-7 py-1.5 rounded-lg bg-[#161A22] border border-[#252B36] text-[#F5F7FA] text-xs font-medium focus:outline-none focus:border-[#4F5BFF] cursor-pointer"
            >
              <option value="all">All Salespeople</option>
              <option value="anika">Anika Nai</option>
              <option value="mamun">Mamun</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-2 text-[#737C8C] w-3 h-3" />
          </div>

          {/* [ Export ] */}
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#4F5BFF] hover:bg-[#4338CA] text-white transition-colors text-xs font-semibold shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          {/* [ Refresh ] */}
          <button
            type="button"
            onClick={handleRefresh}
            title="Refresh"
            className="p-1.5 rounded-lg bg-[#161A22] border border-[#252B36] text-[#737C8C] hover:text-[#F5F7FA] hover:bg-[#1C212B] transition-colors cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                isLoadingSummary || isFetchingSummary ? "animate-spin text-[#4F5BFF]" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. PRIMARY 4 KPI CARDS                                               */}
      {/* ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐                  */}
      {/* │ Net Sales│ │ Orders   │ │ Profit   │ │ Due      │                  */}
      {/* │ ৳462,300 │ │ 1,248    │ │ ৳126,400 │ │ ৳33,000  │                  */}
      {/* └──────────┘ └──────────┘ └──────────┘ └──────────┘                  */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Net Sales */}
        <div className="bg-[#11141B] border border-[#252B36] rounded-xl p-4 flex flex-col justify-between hover:border-[#4F5BFF]/50 transition-colors">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#737C8C]">
            Net Sales
          </span>
          <div className="mt-2.5">
            <div className="text-xl lg:text-2xl font-bold tracking-tight text-[#F5F7FA] font-mono">
              {formatBDT(kpis.netSales)}
            </div>
            <p className="text-xs text-[#A7AFBC] mt-0.5">After returns &amp; discounts</p>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-[#11141B] border border-[#252B36] rounded-xl p-4 flex flex-col justify-between hover:border-[#252B36]/80 transition-colors">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#737C8C]">
            Orders
          </span>
          <div className="mt-2.5">
            <div className="text-xl lg:text-2xl font-bold tracking-tight text-[#F5F7FA] font-mono">
              {kpis.orders.toLocaleString()}
            </div>
            <p className="text-xs text-[#737C8C] mt-0.5">Completed orders</p>
          </div>
        </div>

        {/* Profit */}
        <div className="bg-[#11141B] border border-[#252B36] rounded-xl p-4 flex flex-col justify-between hover:border-[#0FBF9F]/50 transition-colors">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#737C8C]">
            Profit
          </span>
          <div className="mt-2.5">
            <div className="text-xl lg:text-2xl font-bold tracking-tight text-[#0FBF9F] font-mono">
              {formatBDT(kpis.profit)}
            </div>
            <p className="text-xs text-[#0FBF9F] font-medium mt-0.5">{kpis.margin}% margin</p>
          </div>
        </div>

        {/* Due */}
        <div className="bg-[#11141B] border border-[#252B36] rounded-xl p-4 flex flex-col justify-between hover:border-[#E8A23A]/50 transition-colors">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#E8A23A]">
            Due
          </span>
          <div className="mt-2.5">
            <div className="text-xl lg:text-2xl font-bold tracking-tight text-[#E8A23A] font-mono">
              {formatBDT(kpis.due)}
            </div>
            <p className="text-xs text-[#E8A23A]/80 font-medium mt-0.5">Customer balance</p>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2.1 FINANCIAL SUMMARY STRIP (All Required Metrics)                   */}
      {/* Total Sales, Total Items Sold, Sales Returns, Discount Given, Tax    */}
      {/* Collected, Gross Profit, Profit Margin                               */}
      {/* ==================================================================== */}
      <div className="bg-[#11141B] border border-[#252B36] rounded-xl p-3 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[780px] divide-x divide-[#252B36] text-xs">
          <div className="px-3 flex flex-col">
            <span className="text-[#737C8C] text-[11px] uppercase font-semibold">Total Sales</span>
            <span className="font-mono font-bold text-[#F5F7FA] text-sm mt-0.5">
              {formatBDT(kpis.totalSales)}
            </span>
          </div>

          <div className="px-3 flex flex-col">
            <span className="text-[#737C8C] text-[11px] uppercase font-semibold">Total Items Sold</span>
            <span className="font-mono font-bold text-[#F5F7FA] text-sm mt-0.5">
              {kpis.itemsSold.toLocaleString()} pcs
            </span>
          </div>

          <div className="px-3 flex flex-col">
            <span className="text-[#737C8C] text-[11px] uppercase font-semibold">Sales Returns</span>
            <span className="font-mono font-bold text-[#EF4444] text-sm mt-0.5">
              {formatBDT(kpis.returnsAmount)}
            </span>
          </div>

          <div className="px-3 flex flex-col">
            <span className="text-[#737C8C] text-[11px] uppercase font-semibold">Discount Given</span>
            <span className="font-mono font-bold text-[#F5F7FA] text-sm mt-0.5">
              {formatBDT(kpis.discountAmount)}
            </span>
          </div>

          <div className="px-3 flex flex-col">
            <span className="text-[#737C8C] text-[11px] uppercase font-semibold">Tax Collected</span>
            <span className="font-mono font-bold text-[#F5F7FA] text-sm mt-0.5">
              {formatBDT(kpis.taxAmount)}
            </span>
          </div>

          <div className="px-3 flex flex-col">
            <span className="text-[#0FBF9F] text-[11px] uppercase font-semibold">Gross Profit</span>
            <span className="font-mono font-bold text-[#0FBF9F] text-sm mt-0.5">
              {formatBDT(kpis.grossProfit)}
            </span>
          </div>

          <div className="px-3 flex flex-col">
            <span className="text-[#0FBF9F] text-[11px] uppercase font-semibold">Profit Margin</span>
            <span className="font-mono font-bold text-[#0FBF9F] text-sm mt-0.5">
              {kpis.margin}%
            </span>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 3. SALES TREND                                                       */}
      {/* 📈 Chart                                                             */}
      {/* ==================================================================== */}
      <div className="bg-[#11141B] border border-[#252B36] rounded-xl p-5 md:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base md:text-lg font-semibold tracking-tight text-[#F5F7FA]">
              Sales Trend
            </h2>
            <p className="text-xs text-[#737C8C]">Sales and profit over time</p>
          </div>

          <div className="flex items-center gap-2 bg-[#161A22] border border-[#252B36] p-1 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setShowSalesSeries(!showSalesSeries)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors cursor-pointer ${
                showSalesSeries
                  ? "bg-[#1C212B] text-[#F5F7FA] font-semibold"
                  : "text-[#737C8C] hover:text-[#A7AFBC]"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  showSalesSeries ? "bg-[#4F5BFF]" : "bg-[#737C8C]/50"
                }`}
              ></span>
              <span>Sales</span>
            </button>

            <button
              type="button"
              onClick={() => setShowProfitSeries(!showProfitSeries)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors cursor-pointer ${
                showProfitSeries
                  ? "bg-[#1C212B] text-[#F5F7FA] font-semibold"
                  : "text-[#737C8C] hover:text-[#A7AFBC]"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  showProfitSeries ? "bg-[#0FBF9F]" : "bg-[#737C8C]/50"
                }`}
              ></span>
              <span>Profit</span>
            </button>
          </div>
        </div>

        <div className="h-[300px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="salesGradTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F5BFF" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#4F5BFF" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="profitGradTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0FBF9F" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0FBF9F" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#252B36" />
              <XAxis
                dataKey="month"
                tickFormatter={formatMonthLabel}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#737C8C", fontSize: 11 }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#737C8C", fontSize: 11 }}
                tickFormatter={(val) => `৳${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as MonthlyTrendPoint;
                    return (
                      <div className="p-3 rounded-lg bg-[#161A22] border border-[#252B36] text-xs shadow-xl min-w-[170px] space-y-1">
                        <div className="font-semibold text-[#F5F7FA] border-b border-[#252B36] pb-1 mb-1">
                          {formatMonthLabel(label as string)}
                        </div>
                        {showSalesSeries && (
                          <div className="flex justify-between items-center text-[#A7AFBC]">
                            <span>Sales:</span>
                            <span className="font-mono text-[#F5F7FA] font-medium">
                              {formatBDT(data.sales)}
                            </span>
                          </div>
                        )}
                        {showProfitSeries && (
                          <div className="flex justify-between items-center text-[#A7AFBC]">
                            <span>Profit:</span>
                            <span className="font-mono text-[#0FBF9F] font-medium">
                              {formatBDT(data.profit)}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {showSalesSeries && (
                <Area
                  type="monotone"
                  dataKey="sales"
                  name="Sales"
                  stroke="#4F5BFF"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#salesGradTrend)"
                />
              )}
              {showProfitSeries && (
                <Area
                  type="monotone"
                  dataKey="profit"
                  name="Profit"
                  stroke="#0FBF9F"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#profitGradTrend)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 4. SALES BREAKDOWN (WHAT DROVE SALES)                                */}
      {/* Exact Design from the uploaded image / page1.tsx                     */}
      {/* ==================================================================== */}
      <div className="bg-[#090D14] border border-[#1A2536] rounded-2xl p-5 md:p-6 space-y-4 shadow-xl">
        {/* Top Header matching image */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-[#1A2536]/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#00E5BE] flex items-center justify-center text-[#090D14] shrink-0 shadow-sm">
              <Trophy className="w-4 h-4 fill-[#090D14]" />
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-tight">
                What Drove Sales
              </div>
              <div className="text-[11px] text-[#737C8C]">
                Click any driver to enter Sales Focus mode
              </div>
            </div>
          </div>

          {/* Dimension Tabs matching image */}
          <div className="flex items-center bg-[#0D1522] p-1 rounded-full border border-[#1A2536] overflow-x-auto gap-1">
            <button
              type="button"
              onClick={() => setActiveDriverTab("products")}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeDriverTab === "products"
                  ? "bg-[#00E5BE] text-[#090D14] shadow-sm font-bold"
                  : "text-[#94A3B8] hover:text-white"
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Products</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveDriverTab("categories")}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeDriverTab === "categories"
                  ? "bg-[#00E5BE] text-[#090D14] shadow-sm font-bold"
                  : "text-[#94A3B8] hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Categories</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveDriverTab("customers")}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeDriverTab === "customers"
                  ? "bg-[#00E5BE] text-[#090D14] shadow-sm font-bold"
                  : "text-[#94A3B8] hover:text-white"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Customers</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveDriverTab("payments")}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeDriverTab === "payments"
                  ? "bg-[#00E5BE] text-[#090D14] shadow-sm font-bold"
                  : "text-[#94A3B8] hover:text-white"
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Payment Methods</span>
            </button>
          </div>
        </div>

        {/* Ranked Driver Rows with the exact green/teal bar styling from screenshot */}
        <div className="space-y-2.5 pt-1">
          {currentDriverList.map((item, index) => {
            const isFocused = focusedDriverId === item.id;
            // Proportional width calculation matching screenshot aesthetic
            const barWidth = 22 + (item.share / maxShare) * 16;

            return (
              <div
                key={item.id}
                onClick={() => setFocusedDriverId(isFocused ? null : item.id)}
                className={`group relative p-3 rounded-2xl border transition-all cursor-pointer select-none overflow-hidden flex items-center justify-between ${
                  isFocused
                    ? "bg-[#0E1A29] border-[#00E5BE] shadow-lg shadow-[#00E5BE]/10"
                    : "bg-[#0C121D] hover:bg-[#0F1726] border-[#182336] hover:border-[#223550]"
                }`}
              >
                {/* Visual Proportional Green/Teal Container Bar behind left text matching image */}
                <div
                  className={`absolute left-0 top-0 bottom-0 rounded-2xl transition-all duration-300 pointer-events-none ${
                    isFocused
                      ? "bg-[#05433A] border-r-2 border-[#00E5BE]"
                      : "bg-[#04332B] border border-[#0A4D42]"
                  }`}
                  style={{ width: `${barWidth}%` }}
                />

                {/* Left Side Content: Rank Badge + Name + Subtitle (Relative z-10) */}
                <div className="flex items-center gap-3.5 min-w-0 relative z-10 pl-1">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${getRankBadgeClasses(
                      index
                    )}`}
                  >
                    #{item.rank}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-[#00E5BE] transition-colors">
                        {item.name}
                      </span>
                      {isFocused && (
                        <span className="text-[9px] bg-[#00E5BE] text-[#090D14] font-bold px-1.5 py-0.2 rounded-full">
                          Focused
                        </span>
                      )}
                    </div>
                    {item.subtitle && (
                      <p className="text-[11px] text-[#94A3B8] truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Side Content: Amount + Share % + Chevron (Relative z-10) */}
                <div className="flex items-center gap-4 shrink-0 text-right relative z-10 pr-1">
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white font-mono">
                      {formatBDT(item.amount, false)}
                    </div>
                    <div className="text-[11px] font-semibold text-[#00E5BE] font-mono">
                      {item.share}% share
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-[#64748B] group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer: View All Link button matching screenshot */}
        <div className="flex justify-end pt-1">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#38BDF8] hover:text-[#7DD3FC] transition-colors py-1 px-3 rounded-full hover:bg-[#38BDF8]/10 border border-[#38BDF8]/20 cursor-pointer"
          >
            <span>
              View all{" "}
              {activeDriverTab === "products"
                ? "Products"
                : activeDriverTab === "categories"
                ? "Categories"
                : activeDriverTab === "customers"
                ? "Customers"
                : "Payment Methods"}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 5. SALES RETURNS (Sales Return Report)                                */}
      {/* Returns | Amount | Return Rate | Top Returned                        */}
      {/* ==================================================================== */}
      <div className="bg-[#11141B] border border-[#252B36] rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#252B36]">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-[#F5F7FA]">
              Sales Returns
            </h2>
            <p className="text-xs text-[#737C8C]">Reversals, refunds, and damaged returns report</p>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EF4444]/10 text-[#EF4444] font-semibold">
            Sales Return Report
          </span>
        </div>

        {/* 4 Summary Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-[#161A22] border border-[#252B36]">
            <span className="text-[11px] text-[#737C8C] uppercase font-semibold block">
              Returns
            </span>
            <span className="text-lg font-bold font-mono text-[#F5F7FA] mt-0.5 block">
              {salesReturnsList.length} claims
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#161A22] border border-[#252B36]">
            <span className="text-[11px] text-[#737C8C] uppercase font-semibold block">
              Amount
            </span>
            <span className="text-lg font-bold font-mono text-[#EF4444] mt-0.5 block">
              {formatBDT(kpis.returnsAmount)}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#161A22] border border-[#252B36]">
            <span className="text-[11px] text-[#737C8C] uppercase font-semibold block">
              Return Rate
            </span>
            <span className="text-lg font-bold font-mono text-[#0FBF9F] mt-0.5 block">
              {kpis.totalSales > 0 ? ((kpis.returnsAmount / kpis.totalSales) * 100).toFixed(1) : "2.1"}%
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#161A22] border border-[#252B36]">
            <span className="text-[11px] text-[#737C8C] uppercase font-semibold block">
              Top Returned
            </span>
            <span className="text-sm font-semibold text-[#F5F7FA] truncate mt-0.5 block">
              {salesReturnsList[0]?.item || "Acea 100mg Syrup (3 pcs)"}
            </span>
          </div>
        </div>

        {/* Return Details Table */}
        <div className="overflow-x-auto pt-1">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#252B36] text-[#737C8C] font-semibold">
                <th className="py-2 px-2">Return ID</th>
                <th className="py-2 px-2">Date</th>
                <th className="py-2 px-2">Invoice Ref</th>
                <th className="py-2 px-2">Customer</th>
                <th className="py-2 px-2">Item Returned</th>
                <th className="py-2 px-2 text-right">Qty</th>
                <th className="py-2 px-2 text-right">Amount</th>
                <th className="py-2 px-2">Reason</th>
                <th className="py-2 px-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252B36]/60">
              {salesReturnsList.map((r) => (
                <tr key={r.id} className="hover:bg-[#161A22]/50 transition-colors">
                  <td className="py-2.5 px-2 font-mono font-medium text-[#4F5BFF]">{r.returnNo}</td>
                  <td className="py-2.5 px-2 text-[#737C8C]">{r.date}</td>
                  <td className="py-2.5 px-2 font-mono text-[#A7AFBC]">{r.invoiceRef}</td>
                  <td className="py-2.5 px-2 font-medium text-[#F5F7FA]">{r.customer}</td>
                  <td className="py-2.5 px-2 text-[#F5F7FA]">{r.item}</td>
                  <td className="py-2.5 px-2 text-right font-mono text-[#A7AFBC]">{r.quantity}</td>
                  <td className="py-2.5 px-2 text-right font-mono font-semibold text-[#EF4444]">
                    {formatBDT(r.amount)}
                  </td>
                  <td className="py-2.5 px-2 text-[#737C8C]">{r.reason}</td>
                  <td className="py-2.5 px-2 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        r.status === "Refunded"
                          ? "bg-[#EF4444]/10 text-[#EF4444]"
                          : "bg-[#0FBF9F]/10 text-[#0FBF9F]"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 6. RECENT SALES                                                      */}
      {/* Invoice | Customer | Date | Total | Paid | Due                       */}
      {/* ==================================================================== */}
      <div className="bg-[#11141B] border border-[#252B36] rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#252B36]">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-[#F5F7FA]">
              Recent Sales
            </h2>
            <p className="text-xs text-[#737C8C]">Live settlement tickets and invoices</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={recentSearch}
                onChange={(e) => setRecentSearch(e.target.value)}
                placeholder="Search invoice or customer..."
                className="w-56 pl-7 pr-3 py-1.5 rounded-lg bg-[#161A22] border border-[#252B36] text-xs text-[#F5F7FA] placeholder:text-[#737C8C] focus:outline-none focus:border-[#4F5BFF]"
              />
              <Search className="w-3.5 h-3.5 text-[#737C8C] absolute left-2 top-2" />
            </div>
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161A22] border border-[#252B36] text-[#A7AFBC] hover:text-[#F5F7FA] text-xs font-medium transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Table: Invoice | Customer | Date | Total | Paid | Due */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#161A22] text-[#737C8C] font-semibold border-b border-[#252B36]">
              <tr>
                <th className="py-2.5 px-3">Invoice</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3 text-right">Total</th>
                <th className="py-2.5 px-3 text-right">Paid</th>
                <th className="py-2.5 px-3 text-right">Due</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252B36]/60">
              {filteredRecentSales.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#737C8C]">
                    No sales records found.
                  </td>
                </tr>
              ) : (
                filteredRecentSales.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#161A22]/50 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-medium text-[#4F5BFF] whitespace-nowrap">
                      {inv.invoiceNo}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-[#F5F7FA] whitespace-nowrap">
                      {inv.customer}
                    </td>
                    <td className="py-2.5 px-3 text-[#737C8C] whitespace-nowrap">{inv.date}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-[#F5F7FA]">
                      {formatBDT(inv.total)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-[#0FBF9F]">
                      {formatBDT(inv.paid)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-[#E8A23A]">
                      {inv.due > 0 ? formatBDT(inv.due) : "—"}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          inv.status === "paid"
                            ? "bg-[#0FBF9F]/10 text-[#0FBF9F]"
                            : inv.status === "partial"
                            ? "bg-[#E8A23A]/10 text-[#E8A23A]"
                            : "bg-[#EF4444]/10 text-[#EF4444]"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#252B36] text-xs text-[#737C8C]">
          <div>
            Showing <strong className="text-[#F5F7FA]">1 to {filteredRecentSales.length}</strong> of{" "}
            <strong className="text-[#F5F7FA]">{kpis.orders.toLocaleString()}</strong> sales
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={salesPage <= 1}
              onClick={() => setSalesPage((p) => Math.max(p - 1, 1))}
              className="p-1 rounded bg-[#161A22] border border-[#252B36] text-[#737C8C] disabled:opacity-50 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setSalesPage(1)}
              className={`px-2.5 py-1 rounded font-semibold text-xs cursor-pointer ${
                salesPage === 1 ? "bg-[#4F5BFF] text-white" : "bg-[#161A22] border border-[#252B36] text-[#A7AFBC]"
              }`}
            >
              1
            </button>
            <button
              type="button"
              onClick={() => setSalesPage(2)}
              className={`px-2.5 py-1 rounded text-xs cursor-pointer ${
                salesPage === 2 ? "bg-[#4F5BFF] text-white" : "bg-[#161A22] border border-[#252B36] text-[#A7AFBC] hover:text-[#F5F7FA]"
              }`}
            >
              2
            </button>
            <button
              type="button"
              onClick={() => setSalesPage((p) => p + 1)}
              className="p-1 rounded bg-[#161A22] border border-[#252B36] text-[#A7AFBC] hover:text-[#F5F7FA] cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
