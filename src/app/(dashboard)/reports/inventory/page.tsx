"use client";

import React, { useState, useMemo } from "react";
import {
  Download,
  Printer,
  RotateCcw,
  TrendingUp,
  Package,
  AlertTriangle,
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
import { useGetInventoryReport } from "@/hooks/api/useReports";
import { PaginationHelper } from "@/components/shared/PaginationHelper";
import { useAppTranslation } from "@/hooks/useAppTranslation";

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

const STOCK_STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "in_stock", label: "In Stock" },
  { value: "low_stock", label: "Low Stock" },
  { value: "out_of_stock", label: "Out of Stock" },
];

// ============================================================================
// HELPERS
// ============================================================================

const formatBDT = (amount: number | string) => {
  const num = Number(amount) || 0;
  return `৳${num.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
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
  const { isBangla } = useAppTranslation();
  // Filter States
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [activeFilters, setActiveFilters] = useState<null | any>(null);

  // api hooks
  const { data: categories, isLoading: categoriesLoading } = useGetItemsCategories();
  const {data:branches} = useGetBranches();
  
  const {data: inventoryData,isLoading: stockReportLoading} = useGetInventoryReport(activeFilters,{
    enabled: !!activeFilters,
  })
  // Pagination states
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isExporting, setIsExporting] = useState(false);

 //reports data
 const inventory =  inventoryData?.data;
 const summary = inventoryData?.summary;
 const meta = inventoryData?.meta 


 const handlePageChange = (newPage:number) =>{
    setCurrentPage(newPage)
   setActiveFilters(prev => ({...prev,page:newPage}))
 }
  // Handle Generate Report
  const handleGenerateReport = () => {
    // category:selectedCategory,
    setCurrentPage(1);
    setActiveFilters({
      branchId:selectedBranch === "all"? undefined :selectedBranch,
      stockType:selectedStatus === "all"? undefined :selectedStatus,
      page:currentPage,
      limit:pageSize
    });
  };    

  // Handle Reset Filter
  const handleResetFilter = () => {
    setCurrentPage(1);
    setSelectedBranch("all");
    setSelectedCategory("all");
    setSelectedStatus("all");
    setActiveFilters(null);
  };

  // Handle Export
  const handleDownloadExcel = () => {
  
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
              value={formatKpiNumber(0)}
            />
            <KpiCard
              accent="teal"
              icon={TrendingUp}
              label="Stock Valuation"
              value={`৳${formatKpiNumber(0)}`}
            />
            <KpiCard
              accent="amber"
              icon={AlertTriangle}
              label="Low Stock Items"
              value={formatKpiNumber(0)}
            />
            <KpiCard
              accent="red"
              icon={ShieldAlert}
              label="Out of Stock"
              value={formatKpiNumber(0)}
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
                  {inventory?.length === 0 ? (
                    <EmptyState message="No stock records found" />
                  ) : (
                    inventory?.map((row:any) => {
                      return (
                        <tr
                          key={row.id}
                          className="hover:bg-muted/40 transition-colors group"
                        >
                          <td className="px-4 py-3 font-mono text-muted-foreground text-xs whitespace-nowrap">
                            {row.index}
                          </td>
                          <td className="px-4 py-3 font-semibold text-primary text-xs whitespace-nowrap group-hover:underline cursor-pointer">
                            {row.productName}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                            {row.sku}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
                              {row.categoryName}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-foreground whitespace-nowrap">
                            {row.storeName}
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
                            {row.inStock}
                          </td>
                          <td className="px-4 py-3 text-foreground whitespace-nowrap">
                            {formatBDT(row.costPrice)}
                            {row.costPrice}
                          </td>
                          <td className="px-4 py-3 text-foreground whitespace-nowrap">
                            {formatBDT(row.sellingPrice)}
                            {row.sellingPrice}
                          </td>
                          <td className="px-4 py-3 font-medium text-emerald-400 whitespace-nowrap">
                            {formatBDT(row.valuation)}
                            {row.valuation}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            In stock
                            {row.stockType === "IN STOCK" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                <CheckCircle2 className="h-3 w-3" />
                                In Stock
                              </span>
                            )}
                            {row.stockType === "LOW STOCK" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                <Clock className="h-3 w-3" />
                                Low Stock
                              </span>
                            )}
                            {row.stockType === "OUT OF STOCK" && (
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
                {/* Reusable Pagination */}
                        {activeFilters && meta?.totalPages > 1 && (
                          <div className="px-6 py-4 border-t border-border print:hidden">
                            <PaginationHelper
                              currentPage={currentPage}
                              totalPages={meta?.totalPages}
                              onPageChange={handlePageChange}
                              isBangla={isBangla}
                            />
                          </div>
                        )}
            </div>
          </div>
    </div>
  );
}