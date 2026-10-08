"use client";

import React, { useState, useMemo } from "react";
import {
  Calendar,
  Download,
  Printer,
  RotateCcw,
  TrendingUp,
  Package,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
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

export interface StockRow {
  id: string;
  itemName: string;
  sku: string;
  category: string;
  categoryId: string;
  store: string;
  storeId: string;
  qty: number;
  costPrice: number;
  sellingPrice: number;
  valuation: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

const STORE_MAIN = "Main Branch (Dhaka)";
const STORE_GULSHAN = "Gulshan Flagship Store";
const STORE_DHANMONDI = "Dhanmondi Hub";
const STORE_UTTARA = "Uttara Outlet";
const STORE_CTG = "Chittagong Central";

const MOCK_STOCK: StockRow[] = [
  { id: "st-1", itemName: "Premium Rice (Miniket) 5kg", sku: "GRC-MNK-5K", category: "Groceries", categoryId: "cat-1", store: STORE_MAIN, storeId: "store-main", qty: 214, costPrice: 480, sellingPrice: 550, valuation: 102720, status: "In Stock" },
  { id: "st-2", itemName: "Soybean Oil 5L", sku: "OIL-SOY-5L", category: "Cooking Oil", categoryId: "cat-2", store: STORE_GULSHAN, storeId: "store-gulshan", qty: 87, costPrice: 720, sellingPrice: 800, valuation: 62640, status: "In Stock" },
  { id: "st-3", itemName: "Arla Full Cream Milk 1L", sku: "DRY-ARL-1L", category: "Dairy", categoryId: "cat-3", store: STORE_DHANMONDI, storeId: "store-dhanmondi", qty: 320, costPrice: 280, sellingPrice: 350, valuation: 89600, status: "In Stock" },
  { id: "st-4", itemName: "Lux Soap Bar (Pack of 4)", sku: "SOAP-LUX-P4", category: "Personal Care", categoryId: "cat-5", store: STORE_MAIN, storeId: "store-main", qty: 155, costPrice: 240, sellingPrice: 300, valuation: 37200, status: "In Stock" },
  { id: "st-5", itemName: "Nescafe Classic 200g", sku: "BEV-NES-200", category: "Beverages", categoryId: "cat-4", store: STORE_GULSHAN, storeId: "store-gulshan", qty: 43, costPrice: 480, sellingPrice: 600, valuation: 20640, status: "In Stock" },
  { id: "st-6", itemName: "Fresh Bread (Large Loaf)", sku: "BAK-BRD-LG", category: "Bakery", categoryId: "cat-6", store: STORE_DHANMONDI, storeId: "store-dhanmondi", qty: 8, costPrice: 200, sellingPrice: 250, valuation: 1600, status: "Low Stock" },
  { id: "st-7", itemName: "Sugar (Refined) 1kg", sku: "GRC-SUG-1K", category: "Groceries", categoryId: "cat-1", store: STORE_UTTARA, storeId: "store-uttara", qty: 512, costPrice: 120, sellingPrice: 150, valuation: 61440, status: "In Stock" },
  { id: "st-8", itemName: "Hand Sanitizer 250ml", sku: "HGN-SAN-250", category: "Hygiene", categoryId: "cat-7", store: STORE_CTG, storeId: "store-ctg", qty: 98, costPrice: 320, sellingPrice: 400, valuation: 31360, status: "In Stock" },
  { id: "st-9", itemName: "Chicken Curry Masala 100g", sku: "SPC-CCM-100", category: "Spices", categoryId: "cat-8", store: STORE_MAIN, storeId: "store-main", qty: 230, costPrice: 200, sellingPrice: 250, valuation: 46000, status: "In Stock" },
  { id: "st-10", itemName: "Bottled Water 600ml (24-pack)", sku: "BEV-WAT-24P", category: "Beverages", categoryId: "cat-4", store: STORE_GULSHAN, storeId: "store-gulshan", qty: 176, costPrice: 240, sellingPrice: 300, valuation: 42240, status: "In Stock" },
  { id: "st-11", itemName: "Maggi Noodles (12-pack)", sku: "SNK-MAG-12P", category: "Snacks", categoryId: "cat-9", store: STORE_UTTARA, storeId: "store-uttara", qty: 6, costPrice: 140, sellingPrice: 175, valuation: 840, status: "Low Stock" },
  { id: "st-12", itemName: "Radhuni Turmeric Powder 200g", sku: "SPC-RAD-200", category: "Spices", categoryId: "cat-8", store: STORE_CTG, storeId: "store-ctg", qty: 0, costPrice: 85, sellingPrice: 110, valuation: 0, status: "Out of Stock" },
  { id: "st-13", itemName: "Aarong Ghee 500ml", sku: "DRY-ARG-500", category: "Dairy", categoryId: "cat-3", store: STORE_MAIN, storeId: "store-main", qty: 64, costPrice: 410, sellingPrice: 480, valuation: 26240, status: "In Stock" },
  { id: "st-14", itemName: "Wheel Detergent 1kg", sku: "HGN-WHL-1K", category: "Hygiene", categoryId: "cat-7", store: STORE_DHANMONDI, storeId: "store-dhanmondi", qty: 9, costPrice: 95, sellingPrice: 120, valuation: 855, status: "Low Stock" },
  { id: "st-15", itemName: "Play Safe Biscuit (Family Pack)", sku: "BAK-PSB-FP", category: "Bakery", categoryId: "cat-6", store: STORE_UTTARA, storeId: "store-uttara", qty: 140, costPrice: 90, sellingPrice: 120, valuation: 12600, status: "In Stock" },
];

// Filter Options
const STORE_OPTIONS = [
  { value: "all", label: "Choose Store" },
  { value: "store-main", label: STORE_MAIN },
  { value: "store-gulshan", label: STORE_GULSHAN },
  { value: "store-dhanmondi", label: STORE_DHANMONDI },
  { value: "store-uttara", label: STORE_UTTARA },
  { value: "store-ctg", label: STORE_CTG },
];

const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "cat-1", label: "Groceries" },
  { value: "cat-2", label: "Cooking Oil" },
  { value: "cat-3", label: "Dairy" },
  { value: "cat-4", label: "Beverages" },
  { value: "cat-5", label: "Personal Care" },
  { value: "cat-6", label: "Bakery" },
  { value: "cat-7", label: "Hygiene" },
  { value: "cat-8", label: "Spices" },
  { value: "cat-9", label: "Snacks" },
];

// ============================================================================
// HELPERS
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

type Accent = "indigo" | "teal" | "emerald" | "red" | "amber";

const ACCENT_STYLES: Record<Accent, { border: string; icon: string; shadow: string }> = {
  indigo: { border: "border-[#4F5BFF]/25 hover:border-[#4F5BFF]/45", icon: "bg-[#4F5BFF]", shadow: "shadow-indigo-950/50" },
  teal: { border: "border-[#0FBF9F]/25 hover:border-[#0FBF9F]/45", icon: "bg-[#0FBF9F]", shadow: "shadow-teal-950/50" },
  emerald: { border: "border-[#1FAF86]/25 hover:border-[#1FAF86]/45", icon: "bg-[#1FAF86]", shadow: "shadow-green-950/50" },
  red: { border: "border-[#EF4444]/25 hover:border-[#EF4444]/45", icon: "bg-[#EF4444]", shadow: "shadow-red-950/50" },
  amber: { border: "border-amber-500/25 hover:border-amber-500/45", icon: "bg-amber-500", shadow: "shadow-amber-950/50" },
};

function KpiCard({
  accent,
  icon: Icon,
  label,
  value,
}: {
  accent: Accent;
  icon: LucideIcon;
  label: string;
  value: string | number;
}) {
  const style = ACCENT_STYLES[accent];
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-[#0d131f]/95 p-4 sm:p-5 shadow-lg shadow-black/30 backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5",
        style.border
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "h-13 w-13 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md",
            style.icon,
            style.shadow
          )}
        >
          <Icon className="h-7 w-7" />
        </div>
        <div className="min-w-0 space-y-0.5">
          <p className="text-xs font-semibold text-slate-400 truncate">{label}</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function TableHeaderBar({
  title,
  onExport,
  isExporting = false,
}: {
  title: string;
  onExport: () => void;
  isExporting?: boolean;
}) {
  return (
    <div className="px-6 py-4 border-b border-[#1e2738] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111726]/60">
      <h2 className="text-base font-bold text-slate-100 tracking-tight">{title}</h2>
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onExport}
          disabled={isExporting}
          className="h-9 px-3.5 rounded-lg border border-[#4F5BFF]/30 bg-[#4F5BFF]/8 hover:bg-[#4F5BFF]/15 text-[#8b93ff] text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
        >
          <Download className="h-3.5 w-3.5" />
          <span>{isExporting ? "Exporting..." : "Download Excel"}</span>
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="h-9 px-3.5 rounded-lg border border-[#4F5BFF]/30 bg-[#4F5BFF]/8 hover:bg-[#4F5BFF]/15 text-[#8b93ff] text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Printer className="h-3.5 w-3.5" />
          <span>Print Report</span>
        </button>
      </div>
    </div>
  );
}

const EmptyState = ({ message }: { message: string }) => (
  <tr>
    <td colSpan={9} className="px-4 py-12 text-center text-slate-400">
      <div className="flex flex-col items-center justify-center gap-2">
        <AlertCircle className="h-8 w-8 text-slate-500" />
        <p className="text-sm font-medium">{message}</p>
        <p className="text-xs text-slate-500">Try adjusting your date range or filters.</p>
      </div>
    </td>
  </tr>
);

// ============================================================================
// COMPONENT
// ============================================================================

export default function InventoryReportPage() {
  // Filter States
  const [startDate, setStartDate] = useState("2026-10-01");
  const [endDate, setEndDate] = useState("2026-10-08");
  const [selectedStore, setSelectedStore] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [appliedFilters, setAppliedFilters] = useState({
    startDate: "2026-10-01",
    endDate: "2026-10-08",
    store: "all",
    category: "all",
  });

  // Pagination states
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isExporting, setIsExporting] = useState(false);

  // Filter helpers
  const matchStore = (storeId: string) =>
    appliedFilters.store === "all" || storeId === appliedFilters.store;
  const matchCategory = (categoryId: string) =>
    appliedFilters.category === "all" || categoryId === appliedFilters.category;

  // Filtered datasets
  const filteredStock = useMemo(
    () =>
      MOCK_STOCK.filter(
        (r) => matchStore(r.storeId) && matchCategory(r.categoryId)
      ),
    [appliedFilters]
  );

  // KPIs — Current Stock
  const stockKpis = useMemo(() => {
    const totalValuation = filteredStock.reduce((sum, r) => sum + r.valuation, 0);
    const lowStockCount = filteredStock.filter((r) => r.status === "Low Stock").length;
    const outOfStockCount = filteredStock.filter((r) => r.status === "Out of Stock").length;
    return { totalItems: filteredStock.length, totalValuation, lowStockCount, outOfStockCount };
  }, [filteredStock]);

  // Paginated slices
  const paginatedStock = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStock.slice(start, start + pageSize);
  }, [filteredStock, currentPage, pageSize]);

  // Handle Generate Report
  const handleGenerateReport = () => {
    setAppliedFilters({
      startDate,
      endDate,
      store: selectedStore,
      category: selectedCategory,
    });
    setCurrentPage(1);
  };

  // Handle Reset Filter
  const handleResetFilter = () => {
    setStartDate("2026-10-01");
    setEndDate("2026-10-08");
    setSelectedStore("all");
    setSelectedCategory("all");

    setAppliedFilters({
      startDate: "2026-10-01",
      endDate: "2026-10-08",
      store: "all",
      category: "all",
    });
    setCurrentPage(1);
  };

  // Handle Export
  const handleDownloadExcel = () => {
    setIsExporting(true);
    try {
      const rows = filteredStock as unknown as Record<string, unknown>[];

      if (rows.length === 0) return;
      const headers = Object.keys(rows[0]);
      const csvRows = [
        headers.join(","),
        ...rows.map((row) =>
          headers
            .map((h) => {
              const val = row[h];
              return typeof val === "string" ? `"${val}"` : String(val);
            })
            .join(",")
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
        `Inventory_Report_${new Date().toISOString().slice(0, 10)}.csv`
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

  return (
    <div className="space-y-6 pb-12 print:p-0 print:space-y-4">
      {/* ================================================================== */}
      {/* 1. PAGE HEADER                                                     */}
      {/* ================================================================== */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          Inventory Reports
        </h1>
        <p className="text-sm text-slate-400">
          Track stock levels, valuation, movements and expiry alerts
        </p>
      </div>

          {/* Filter Card */}
          <div className="rounded-2xl border border-[#1e2738] bg-[#0d131f]/95 p-5 shadow-xl shadow-black/30 backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Choose Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Choose Date</label>
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

              {/* Store */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Store</label>
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

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full h-10 rounded-lg border-[#222c3e] bg-[#141b29] text-slate-200 text-sm focus:border-primary/60 focus:ring-1 focus:ring-primary/20">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="border-[#222c3e] bg-[#141b29] text-slate-200">
                    {CATEGORY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
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

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              accent="indigo"
              icon={Package}
              label="Total Items"
              value={formatKpiNumber(stockKpis.totalItems)}
            />
            <KpiCard
              accent="teal"
              icon={TrendingUp}
              label="Stock Valuation"
              value={`৳${formatKpiNumber(stockKpis.totalValuation)}`}
            />
            <KpiCard
              accent="amber"
              icon={AlertTriangle}
              label="Low Stock Items"
              value={formatKpiNumber(stockKpis.lowStockCount)}
            />
            <KpiCard
              accent="red"
              icon={ShieldAlert}
              label="Out of Stock"
              value={formatKpiNumber(stockKpis.outOfStockCount)}
            />
          </div>

          {/* Current Stock Table */}
          <div className="rounded-2xl border border-[#1e2738] bg-[#0d131f]/95 shadow-xl shadow-black/30 backdrop-blur-xl overflow-hidden">
            <TableHeaderBar
              title="Current Stock Report"
              onExport={handleDownloadExcel}
              isExporting={isExporting}
            />
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[#1e2738] bg-[#101625] text-slate-400 text-[11px] sm:text-xs font-semibold tracking-wider uppercase">
                    <th className="px-4 py-3.5 whitespace-nowrap">#</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Product</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">SKU</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Category</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Store</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Qty</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Cost Price</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Selling Price</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Cost Valuation</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e2738]/60 text-slate-300">
                  {paginatedStock.length === 0 ? (
                    <EmptyState message="No stock records found" />
                  ) : (
                    paginatedStock.map((row, idx) => {
                      const rowNumber = (currentPage - 1) * pageSize + idx + 1;
                      return (
                        <tr
                          key={row.id}
                          className="hover:bg-[#151d2e]/60 transition-colors group"
                        >
                          <td className="px-4 py-3 font-mono text-slate-400 text-xs whitespace-nowrap">
                            {rowNumber}
                          </td>
                          <td className="px-4 py-3 font-semibold text-primary text-xs whitespace-nowrap group-hover:underline cursor-pointer">
                            {row.itemName}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-slate-400 whitespace-nowrap">
                            {row.sku}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#4F5BFF]/10 text-[#8b93ff] border border-[#4F5BFF]/20">
                              {row.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                            {row.store}
                          </td>
                          <td
                            className={cn(
                              "px-4 py-3 font-bold whitespace-nowrap",
                              row.qty === 0
                                ? "text-rose-400"
                                : row.status === "Low Stock"
                                  ? "text-amber-400"
                                  : "text-slate-100"
                            )}
                          >
                            {row.qty.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                            {formatBDT(row.costPrice)}
                          </td>
                          <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                            {formatBDT(row.sellingPrice)}
                          </td>
                          <td className="px-4 py-3 font-medium text-emerald-400 whitespace-nowrap">
                            {formatBDT(row.valuation)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {row.status === "In Stock" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <CheckCircle2 className="h-3 w-3" />
                                In Stock
                              </span>
                            )}
                            {row.status === "Low Stock" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                <Clock className="h-3 w-3" />
                                Low Stock
                              </span>
                            )}
                            {row.status === "Out of Stock" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                <XCircle className="h-3 w-3" />
                                Out of Stock
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination + Page Size */}
            <div className="px-6 py-4 border-t border-[#1e2738] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#101625]">
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
                    {filteredStock.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
                  </strong>{" "}
                  to{" "}
                  <strong className="text-slate-200">
                    {Math.min(currentPage * pageSize, filteredStock.length)}
                  </strong>{" "}
                  of <strong className="text-slate-200">{filteredStock.length}</strong> entries
                </span>
              </div>
              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="h-8 w-8 rounded-md border border-[#222c3e] bg-[#141b29] hover:bg-[#1a2335] text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from(
                  { length: Math.max(1, Math.ceil(filteredStock.length / pageSize)) },
                  (_, i) => i + 1
                ).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setCurrentPage(p)}
                    className={cn(
                      "h-8 w-8 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer flex items-center justify-center",
                      p === currentPage
                        ? "bg-[#4F5BFF] text-white shadow-md shadow-indigo-950/50"
                        : "border border-[#222c3e] bg-[#141b29] text-slate-300 hover:bg-[#1a2335]"
                    )}
                  >
                    {p}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(Math.max(1, Math.ceil(filteredStock.length / pageSize)), p + 1)
                    )
                  }
                  disabled={currentPage >= Math.max(1, Math.ceil(filteredStock.length / pageSize))}
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