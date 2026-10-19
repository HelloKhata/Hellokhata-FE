"use client";

import React, { useState, useMemo } from "react";
import {
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
import { PageHeader } from "@/components/common";
import { useGetItemsCategories } from "@/hooks/api/useItemCategories";
import { useGetBranches } from "@/hooks/api/useBranches";

// ============================================================================
// TYPES & MOCK DATA
// ============================================================================

export interface StockRow {
  id: string;
  itemName: string;
  sku: string;
  category: string;
  categoryId: string;
  branch: string;
  branchId: string;
  qty: number;
  costPrice: number;
  sellingPrice: number;
  valuation: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

const BRANCH_MAIN = "Main Branch (Dhaka)";
const BRANCH_GULSHAN = "Gulshan Branch";
const BRANCH_DHANMONDI = "Dhanmondi Branch";
const BRANCH_UTTARA = "Uttara Branch";
const BRANCH_CTG = "Chittagong Branch";

const MOCK_STOCK: StockRow[] = [
  { id: "st-1", itemName: "Premium Rice (Miniket) 5kg", sku: "GRC-MNK-5K", category: "Groceries", categoryId: "cat-1", branch: BRANCH_MAIN, branchId: "branch-main", qty: 214, costPrice: 480, sellingPrice: 550, valuation: 102720, status: "In Stock" },
  { id: "st-2", itemName: "Soybean Oil 5L", sku: "OIL-SOY-5L", category: "Cooking Oil", categoryId: "cat-2", branch: BRANCH_GULSHAN, branchId: "branch-gulshan", qty: 87, costPrice: 720, sellingPrice: 800, valuation: 62640, status: "In Stock" },
  { id: "st-3", itemName: "Arla Full Cream Milk 1L", sku: "DRY-ARL-1L", category: "Dairy", categoryId: "cat-3", branch: BRANCH_DHANMONDI, branchId: "branch-dhanmondi", qty: 320, costPrice: 280, sellingPrice: 350, valuation: 89600, status: "In Stock" },
  { id: "st-4", itemName: "Lux Soap Bar (Pack of 4)", sku: "SOAP-LUX-P4", category: "Personal Care", categoryId: "cat-5", branch: BRANCH_MAIN, branchId: "branch-main", qty: 155, costPrice: 240, sellingPrice: 300, valuation: 37200, status: "In Stock" },
  { id: "st-5", itemName: "Nescafe Classic 200g", sku: "BEV-NES-200", category: "Beverages", categoryId: "cat-4", branch: BRANCH_GULSHAN, branchId: "branch-gulshan", qty: 43, costPrice: 480, sellingPrice: 600, valuation: 20640, status: "In Stock" },
  { id: "st-6", itemName: "Fresh Bread (Large Loaf)", sku: "BAK-BRD-LG", category: "Bakery", categoryId: "cat-6", branch: BRANCH_DHANMONDI, branchId: "branch-dhanmondi", qty: 8, costPrice: 200, sellingPrice: 250, valuation: 1600, status: "Low Stock" },
  { id: "st-7", itemName: "Sugar (Refined) 1kg", sku: "GRC-SUG-1K", category: "Groceries", categoryId: "cat-1", branch: BRANCH_UTTARA, branchId: "branch-uttara", qty: 512, costPrice: 120, sellingPrice: 150, valuation: 61440, status: "In Stock" },
  { id: "st-8", itemName: "Hand Sanitizer 250ml", sku: "HGN-SAN-250", category: "Hygiene", categoryId: "cat-7", branch: BRANCH_CTG, branchId: "branch-ctg", qty: 98, costPrice: 320, sellingPrice: 400, valuation: 31360, status: "In Stock" },
  { id: "st-9", itemName: "Chicken Curry Masala 100g", sku: "SPC-CCM-100", category: "Spices", categoryId: "cat-8", branch: BRANCH_MAIN, branchId: "branch-main", qty: 230, costPrice: 200, sellingPrice: 250, valuation: 46000, status: "In Stock" },
  { id: "st-10", itemName: "Bottled Water 600ml (24-pack)", sku: "BEV-WAT-24P", category: "Beverages", categoryId: "cat-4", branch: BRANCH_GULSHAN, branchId: "branch-gulshan", qty: 176, costPrice: 240, sellingPrice: 300, valuation: 42240, status: "In Stock" },
  { id: "st-11", itemName: "Maggi Noodles (12-pack)", sku: "SNK-MAG-12P", category: "Snacks", categoryId: "cat-9", branch: BRANCH_UTTARA, branchId: "branch-uttara", qty: 6, costPrice: 140, sellingPrice: 175, valuation: 840, status: "Low Stock" },
  { id: "st-12", itemName: "Radhuni Turmeric Powder 200g", sku: "SPC-RAD-200", category: "Spices", categoryId: "cat-8", branch: BRANCH_CTG, branchId: "branch-ctg", qty: 0, costPrice: 85, sellingPrice: 110, valuation: 0, status: "Out of Stock" },
  { id: "st-13", itemName: "Aarong Ghee 500ml", sku: "DRY-ARG-500", category: "Dairy", categoryId: "cat-3", branch: BRANCH_MAIN, branchId: "branch-main", qty: 64, costPrice: 410, sellingPrice: 480, valuation: 26240, status: "In Stock" },
  { id: "st-14", itemName: "Wheel Detergent 1kg", sku: "HGN-WHL-1K", category: "Hygiene", categoryId: "cat-7", branch: BRANCH_DHANMONDI, branchId: "branch-dhanmondi", qty: 9, costPrice: 95, sellingPrice: 120, valuation: 855, status: "Low Stock" },
  { id: "st-15", itemName: "Play Safe Biscuit (Family Pack)", sku: "BAK-PSB-FP", category: "Bakery", categoryId: "cat-6", branch: BRANCH_UTTARA, branchId: "branch-uttara", qty: 140, costPrice: 90, sellingPrice: 120, valuation: 12600, status: "In Stock" },
];

// Filter Options
const BRANCH_OPTIONS = [
  { value: "all", label: "All Branches" },
  { value: "branch-main", label: BRANCH_MAIN },
  { value: "branch-gulshan", label: BRANCH_GULSHAN },
  { value: "branch-dhanmondi", label: BRANCH_DHANMONDI },
  { value: "branch-uttara", label: BRANCH_UTTARA },
  { value: "branch-ctg", label: BRANCH_CTG },
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

const STOCK_STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "in_stock", label: "In Stock" },
  { value: "low_stock", label: "Low Stock" },
  { value: "out_of_stock", label: "Out of Stock" },
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
  indigo: { border: "border-indigo-500/25 hover:border-indigo-500/40", icon: "bg-indigo-500", shadow: "shadow-sm" },
  teal: { border: "border-teal-500/25 hover:border-teal-500/40", icon: "bg-teal-500", shadow: "shadow-sm" },
  emerald: { border: "border-emerald-500/25 hover:border-emerald-500/40", icon: "bg-emerald-500", shadow: "shadow-sm" },
  red: { border: "border-rose-500/25 hover:border-rose-500/40", icon: "bg-rose-500", shadow: "shadow-sm" },
  amber: { border: "border-amber-500/25 hover:border-amber-500/45", icon: "bg-amber-500", shadow: "shadow-sm" },
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
        "relative overflow-hidden rounded-2xl border bg-card p-4 sm:p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5",
        style.border
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "h-12 w-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md",
            style.icon,
            style.shadow
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0 space-y-0.5">
          <p className="text-xs font-semibold text-muted-foreground truncate">{label}</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
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
    <div className="px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/40">
      <h2 className="text-base font-bold text-foreground tracking-tight">{title}</h2>
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onExport}
          disabled={isExporting}
          className="h-9 px-3.5 rounded-lg border border-border bg-background hover:bg-muted text-foreground text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
        >
          <Download className="h-3.5 w-3.5" />
          <span>{isExporting ? "Exporting..." : "Download Excel"}</span>
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="h-9 px-3.5 rounded-lg border border-border bg-background hover:bg-muted text-foreground text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
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
    <td colSpan={10} className="px-4 py-12 text-center text-muted-foreground">
      <div className="flex flex-col items-center justify-center gap-2">
        <AlertCircle className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium">{message}</p>
        <p className="text-xs text-muted-foreground">Try adjusting your filters.</p>
      </div>
    </td>
  </tr>
);

// ============================================================================
// COMPONENT
// ============================================================================

export default function InventoryReportPage() {
  // Filter States
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [appliedFilters, setAppliedFilters] = useState({
    branch: "all",
    category: "all",
    status: "all",
  });

  // api hooks
  const { data: categories, isLoading: categoriesLoading } = useGetItemsCategories();
  const {data:branches} = useGetBranches();
  
  // Pagination states
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isExporting, setIsExporting] = useState(false);

  // Filter helpers
  const matchBranch = (branchId: string) =>
    appliedFilters.branch === "all" || branchId === appliedFilters.branch;
  const matchCategory = (categoryId: string) =>
    appliedFilters.category === "all" || categoryId === appliedFilters.category;
  const matchStatus = (status: StockRow["status"]) => {
    if (appliedFilters.status === "all") return true;
    if (appliedFilters.status === "in_stock") return status === "In Stock";
    if (appliedFilters.status === "low_stock") return status === "Low Stock";
    if (appliedFilters.status === "out_of_stock") return status === "Out of Stock";
    return true;
  };

  // Filtered datasets
  const filteredStock = useMemo(
    () =>
      MOCK_STOCK.filter(
        (r) =>
          matchBranch(r.branchId) &&
          matchCategory(r.categoryId) &&
          matchStatus(r.status)
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
      branch: selectedBranch,
      category: selectedCategory,
      status: selectedStatus,
    });
    setCurrentPage(1);
  };

  // Handle Reset Filter
  const handleResetFilter = () => {
    setSelectedBranch("all");
    setSelectedCategory("all");
    setSelectedStatus("all");

    setAppliedFilters({
      branch: "all",
      category: "all",
      status: "all",
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
      <PageHeader
        title="Inventory Reports"
        subtitle="Track stock levels, valuation, movements and expiry alerts"
        showBack
      />

          {/* Filter Card */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Branch */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Branch</label>
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger className="w-full h-10 rounded-lg border-input bg-background text-foreground text-sm focus:border-primary/60 focus:ring-1 focus:ring-primary/20">
                    <SelectValue placeholder="All Branches" />
                  </SelectTrigger>
                  <SelectContent className="border-border bg-popover text-popover-foreground">
                      <SelectItem  value="all">
                       All Branches
                      </SelectItem>
                    {branches?.map((branch:any) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full h-10 rounded-lg border-input bg-background text-foreground text-sm focus:border-primary/60 focus:ring-1 focus:ring-primary/20">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="border-border bg-popover text-popover-foreground">
                      <SelectItem  value="all">
                       All Categories
                      </SelectItem>
                    {categories?.map((opt:any) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full h-10 rounded-lg border-input bg-background text-foreground text-sm focus:border-primary/60 focus:ring-1 focus:ring-primary/20">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent className="border-border bg-popover text-popover-foreground">
                    {STOCK_STATUS_OPTIONS.map((opt) => (
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
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <TableHeaderBar
              title="Current Stock Report"
              onExport={handleDownloadExcel}
              isExporting={isExporting}
            />
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground text-[11px] sm:text-xs font-semibold tracking-wider uppercase">
                    <th className="px-4 py-3.5 whitespace-nowrap">#</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Product</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">SKU</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Category</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Branch</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Qty</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Cost Price</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Selling Price</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Cost Valuation</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground">
                  {paginatedStock.length === 0 ? (
                    <EmptyState message="No stock records found" />
                  ) : (
                    paginatedStock.map((row, idx) => {
                      const rowNumber = (currentPage - 1) * pageSize + idx + 1;
                      return (
                        <tr
                          key={row.id}
                          className="hover:bg-muted/40 transition-colors group"
                        >
                          <td className="px-4 py-3 font-mono text-muted-foreground text-xs whitespace-nowrap">
                            {rowNumber}
                          </td>
                          <td className="px-4 py-3 font-semibold text-primary text-xs whitespace-nowrap group-hover:underline cursor-pointer">
                            {row.itemName}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                            {row.sku}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
                              {row.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-foreground whitespace-nowrap">
                            {row.branch}
                          </td>
                          <td
                            className={cn(
                              "px-4 py-3 font-bold whitespace-nowrap",
                              row.qty === 0
                                ? "text-rose-400"
                                : row.status === "Low Stock"
                                  ? "text-amber-400"
                                  : "text-foreground"
                            )}
                          >
                            {row.qty.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-foreground whitespace-nowrap">
                            {formatBDT(row.costPrice)}
                          </td>
                          <td className="px-4 py-3 text-foreground whitespace-nowrap">
                            {formatBDT(row.sellingPrice)}
                          </td>
                          <td className="px-4 py-3 font-medium text-emerald-400 whitespace-nowrap">
                            {formatBDT(row.valuation)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {row.status === "In Stock" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                <CheckCircle2 className="h-3 w-3" />
                                In Stock
                              </span>
                            )}
                            {row.status === "Low Stock" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                <Clock className="h-3 w-3" />
                                Low Stock
                              </span>
                            )}
                            {row.status === "Out of Stock" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
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
            <div className="px-6 py-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/40">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Show</span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(val) => {
                    setPageSize(Number(val));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="h-8 w-[72px] rounded-md border-input bg-background text-foreground text-xs">
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent className="border-border bg-popover text-popover-foreground">
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span>
                  Showing{" "}
                  <strong className="text-foreground">
                    {filteredStock.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
                  </strong>{" "}
                  to{" "}
                  <strong className="text-foreground">
                    {Math.min(currentPage * pageSize, filteredStock.length)}
                  </strong>{" "}
                  of <strong className="text-foreground">{filteredStock.length}</strong> entries
                </span>
              </div>
              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="h-8 w-8 rounded-md border border-border bg-background hover:bg-muted text-foreground disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
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
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "border border-border bg-background text-foreground hover:bg-muted"
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
                  className="h-8 w-8 rounded-md border border-border bg-background hover:bg-muted text-foreground disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
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