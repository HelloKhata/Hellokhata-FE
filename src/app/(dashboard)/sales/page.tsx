// Hello Khata OS - Premium Sales Page
// Elite SaaS Design - Dark Theme First

"use client";

import { useState } from "react";
import { Card, Button, KPICard, EmptyState } from "@/components/ui/premium";
import { PageHeader } from "@/components/common";
import { PaginationHelper } from "@/components/shared/PaginationHelper";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShoppingCart,
  Plus,
  Search,
  Calendar,
  Eye,
  TrendingUp,
  FileText,
  BarChart3,
  RotateCcw,
  User,
  Receipt,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrency, useDateFormat } from "@/hooks/useAppTranslation";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetSales, useGetSalesSummary } from "@/hooks/api/useSales";

export default function SalesPage() {
  const { t, isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data: salesData, isLoading } = useGetSales({
    search: searchTerm,
    limit: pageSize,
    page: currentPage,
  });
  const { data: salesSummary } = useGetSalesSummary();

  const todaysSales = salesSummary?.today?.total ?? 0;
  const thisMonthsSales = salesSummary?.thisMonth?.total ?? 0;
  const invoices = salesSummary?.allTime?.count ?? 0;
  const allTimeSales = salesSummary?.allTime?.total ?? 0;

  const sales = salesData?.data || [];
  const { formatDateTime } = useDateFormat();
  const router = useRouter();
  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title={t("sales.title")}
          subtitle={isBangla ? "সকল বিক্রির রেকর্ড" : "All sales records"}
          showBack
        >
          <Link href="/sales/new">
            <Button className="shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              <span className="whitespace-nowrap">{t("sales.newSale")}</span>
            </Button>
          </Link>
        </PageHeader>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Today's Sales"
            titleBn="আজকের বিক্রি"
            value={todaysSales}
            prefix="৳"
            trend={{ value: 12.5, isPositive: true }}
            icon={<TrendingUp className="h-5 w-5" />}
            iconColor="emerald"
            isBangla={isBangla}
          />
          <KPICard
            title="This Month"
            titleBn="এই মাসে"
            value={thisMonthsSales}
            prefix="৳"
            trend={{ value: 8.2, isPositive: true }}
            icon={<BarChart3 className="h-5 w-5" />}
            iconColor="indigo"
            isBangla={isBangla}
          />
          <KPICard
            title="Invoices"
            titleBn="ইনভয়েস"
            value={invoices}
            trend={{ value: 5, isPositive: true }}
            icon={<FileText className="h-5 w-5" />}
            iconColor="warning"
            isBangla={isBangla}
          />
          <KPICard
            title="Total Sales"
            titleBn="সর্বমোট বিক্রি"
            value={allTimeSales}
            prefix="৳"
            icon={<ShoppingCart className="h-5 w-5" />}
            iconColor="emerald"
            isBangla={isBangla}
          />
        </div>

        {/* Filters */}
        <Card variant="elevated" padding="default">
          <div className="flex flex-row items-center gap-2 md:gap-3">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground shrink-0" />
              <Input
                placeholder={
                  isBangla
                    ? "ইনভয়েস বা পণ্য খুঁজুন..."
                    : "Search invoice or item..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 md:pl-10 h-10 text-xs sm:text-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[110px] sm:w-[130px] md:w-[160px] shrink-0 h-10 text-xs sm:text-sm">
                <SelectValue placeholder={isBangla ? "স্ট্যাটাস" : "Status"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isBangla ? "সব" : "All"}</SelectItem>
                <SelectItem value="completed">
                  {isBangla ? "সম্পন্ন" : "Completed"}
                </SelectItem>
                <SelectItem value="pending">
                  {isBangla ? "অপেক্ষমান" : "Pending"}
                </SelectItem>
                <SelectItem value="cancelled">
                  {isBangla ? "বাতিল" : "Cancelled"}
                </SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="hidden md:flex gap-2 shrink-0 h-10"
            >
              <Calendar className="h-4 w-4" />
              <span className="whitespace-nowrap">
                {isBangla ? "তারিখ" : "Date"}
              </span>
            </Button>
          </div>
        </Card>

        {/* Sales Table / Cards */}
        <div className="rounded-xl border border-border dark:border-[#1e2738] bg-card dark:bg-[#131823] shadow-sm dark:shadow-xl overflow-hidden">
          <div className="px-4 md:px-6 py-4 border-b border-border dark:border-[#1f283c] flex items-center justify-between bg-card dark:bg-[#131823]">
            <h2 className="text-base font-bold text-foreground dark:text-slate-100 tracking-tight">
              {t("sales.saleHistory")}
            </h2>
            <span className="text-xs font-medium text-muted-foreground dark:text-[#718296]">
              {salesData?.meta?.total} {isBangla ? "টি বিক্রি" : "sales total"}
            </span>
          </div>

          <div>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
            ) : sales?.length === 0 ? (
              <EmptyState
                icon={<ShoppingCart className="h-8 w-8" />}
                title={isBangla ? "কোনো বিক্রি নেই" : "No sales found"}
                description={
                  isBangla ? "নতুন বিক্রি শুরু করুন" : "Start a new sale"
                }
                isBangla={isBangla}
                action={
                  <Button onClick={() => router.push("sales/new")}>
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="whitespace-nowrap">
                      {t("sales.newSale")}
                    </span>
                  </Button>
                }
              />
            ) : (
              <>
                {/* Desktop View: Full Table (md and up) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border dark:border-b-[#1f283c] bg-muted/40 dark:bg-[#131823] text-muted-foreground dark:text-[#718296] text-[12px] font-semibold tracking-wide">
                        <th className="px-4 py-3.5 whitespace-nowrap">
                          {isBangla ? "ক্রম" : "SL."}
                        </th>
                        <th className="px-4 py-3.5 whitespace-nowrap">
                          {isBangla ? "ইনভয়েস নং" : "Invoice No"}
                        </th>
                        <th className="px-4 py-3.5 whitespace-nowrap">
                          {isBangla ? "কাস্টমার" : "Customer"}
                        </th>
                        <th className="px-4 py-3.5 whitespace-nowrap">
                          {isBangla ? "তারিখ" : "Date"}
                        </th>
                        <th className="px-4 py-3.5 whitespace-nowrap">
                          {isBangla ? "পণ্য" : "Items"}
                        </th>
                        <th className="px-4 py-3.5 whitespace-nowrap">
                          {isBangla ? "পেমেন্ট পদ্ধতি" : "Payment Method"}
                        </th>
                        <th className="px-4 py-3.5 whitespace-nowrap">
                          {isBangla ? "মোট" : "Total"}
                        </th>
                        <th className="px-4 py-3.5 whitespace-nowrap">
                          {isBangla ? "পরিশোধিত" : "Paid"}
                        </th>
                        <th className="px-4 py-3.5 whitespace-nowrap">
                          {isBangla ? "বাকি" : "Due"}
                        </th>
                        <th className="px-4 py-3.5 text-right whitespace-nowrap">
                          {isBangla ? "অ্যাকশন" : "Actions"}
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-border dark:divide-[#1b2231] bg-card dark:bg-[#131823]">
                      {sales.map((sale, index) => {
                        const slNumber = String(
                          (currentPage - 1) * pageSize + index + 1,
                        ).padStart(2, "0");

                        return (
                          <tr
                            key={sale.id}
                            className="hover:bg-muted/50 dark:hover:bg-[#1a2130]/80 transition-colors cursor-pointer"
                            onClick={() => router.push(`/sales/${sale.id}`)}
                          >
                            <td className="px-4 py-4 text-muted-foreground dark:text-[#718296] font-mono text-xs font-medium whitespace-nowrap">
                              {slNumber}
                            </td>
                            <td className="px-4 py-4 text-foreground/80 dark:text-[#718296] font-mono text-xs font-medium whitespace-nowrap">
                              {sale.invoiceNo}
                            </td>
                            <td className="px-4 py-4 text-foreground dark:text-slate-100 font-semibold text-sm whitespace-nowrap">
                              {sale.partyName ||
                                (isBangla
                                  ? "ওয়াকিং কাস্টমার"
                                  : "Walking Customer")}
                            </td>
                            <td className="px-4 py-4 text-muted-foreground dark:text-[#718296] text-xs whitespace-nowrap">
                              {formatDateTime(sale.createdAt)}
                            </td>
                            <td className="px-4 py-4 text-foreground/80 dark:text-slate-200 text-xs font-medium whitespace-nowrap">
                              {sale.items?.length || 0}{" "}
                              {isBangla ? "টি" : "item(s)"}
                            </td>
                            <td className="px-4 py-4 text-muted-foreground dark:text-slate-300 text-xs capitalize whitespace-nowrap">
                              {sale.paymentMethod || "—"}
                            </td>
                            <td className="px-4 py-4 font-bold text-foreground dark:text-slate-100 text-sm whitespace-nowrap">
                              {formatCurrency(sale.total)}
                            </td>
                            <td className="px-4 py-4 font-bold text-emerald-600 dark:text-emerald-400 text-sm whitespace-nowrap">
                              {formatCurrency(sale.paidAmount)}
                            </td>
                            <td className="px-4 py-4 font-bold text-sm whitespace-nowrap">
                              <span
                                className={
                                  sale.dueAmount > 0
                                    ? "text-rose-600 dark:text-rose-400"
                                    : "text-muted-foreground dark:text-[#718296]"
                                }
                              >
                                {formatCurrency(sale.dueAmount)}
                              </span>
                            </td>
                            <td
                              className="px-4 py-4 text-right whitespace-nowrap"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  title={isBangla ? "দেখুন" : "View"}
                                  className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted dark:text-[#718296] dark:hover:text-white dark:hover:bg-[#202738] transition-colors"
                                  onClick={() =>
                                    router.push(`/sales/${sale.id}`)
                                  }
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  title={isBangla ? "রিটার্ন" : "Return"}
                                  className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted dark:text-[#718296] dark:hover:text-white dark:hover:bg-[#202738] transition-colors"
                                  onClick={() =>
                                    router.push(
                                      `/sales/returns/new?saleId=${sale.id}`,
                                    )
                                  }
                                >
                                  <RotateCcw className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View: Sale Cards (md:hidden) */}
                <div className="md:hidden p-3 space-y-3">
                  {sales.map((sale) => (
                    <div
                      key={sale.id}
                      onClick={() => router.push(`/sales/${sale.id}`)}
                      className="bg-card dark:bg-[#161c28] border border-border/80 dark:border-[#1e2738] rounded-xl p-3.5 space-y-3 shadow-xs hover:border-primary/50 transition-all cursor-pointer active:scale-[0.99]"
                    >
                      {/* Top Header: Invoice No + Date + Actions */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Receipt className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span className="font-mono text-xs font-bold text-primary truncate">
                            {sale.invoiceNo}
                          </span>
                          <span className="text-muted-foreground/60 text-xs">
                            •
                          </span>
                          <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                            {formatDateTime(sale.createdAt)}
                          </span>
                        </div>

                        <div
                          className="flex items-center gap-1 shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            title={isBangla ? "দেখুন" : "View"}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-[#202738] transition-colors"
                            onClick={() => router.push(`/sales/${sale.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            title={isBangla ? "রিটার্ন" : "Return"}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-[#202738] transition-colors"
                            onClick={() =>
                              router.push(
                                `/sales/returns/new?saleId=${sale.id}`,
                              )
                            }
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Customer & Info Row */}
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <User className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-foreground text-xs sm:text-sm truncate">
                            {sale.partyName ||
                              (isBangla
                                ? "ওয়াকিং কাস্টমার"
                                : "Walking Customer")}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                            <span>
                              {sale.items?.length || 0}{" "}
                              {isBangla ? "টি পণ্য" : "item(s)"}
                            </span>
                            <span>•</span>
                            <span className="capitalize">
                              {sale.paymentMethod || "—"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Financial Strip: Total / Paid / Due */}
                      <div className="bg-muted/40 dark:bg-[#111620] rounded-lg p-2.5 grid grid-cols-3 gap-2 text-xs border border-border/40">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                            {isBangla ? "মোট" : "Total"}
                          </span>
                          <span className="font-bold text-foreground font-mono">
                            {formatCurrency(sale.total)}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                            {isBangla ? "পরিশোধ" : "Paid"}
                          </span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                            {formatCurrency(sale.paidAmount)}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                            {isBangla ? "বাকি" : "Due"}
                          </span>
                          <span
                            className={cn(
                              "font-bold font-mono",
                              sale.dueAmount > 0
                                ? "text-rose-600 dark:text-rose-400"
                                : "text-muted-foreground dark:text-[#718296]",
                            )}
                          >
                            {formatCurrency(sale.dueAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Pagination Bar */}
          {salesData?.meta?.totalPages > 1 && (
            <div className="px-4 md:px-6 py-4 border-t border-border/40">
              <PaginationHelper
                currentPage={currentPage}
                totalPages={salesData?.meta?.totalPages}
                onPageChange={setCurrentPage}
                isBangla={isBangla}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
