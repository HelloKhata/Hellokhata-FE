// Hello Khata OS - Purchases Management Page
// হ্যালো খাতা - ক্রয় পেজ

"use client";

import { useState, useMemo } from "react";
import { KPICard, EmptyState } from "@/components/ui/premium";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package,
  Plus,
  Search,
  Calendar,
  BarChart3,
  Truck,
  Eye,
  ShoppingCart,
  RotateCcw,
  Receipt,
  AlertCircle,
} from "lucide-react";
import { useCurrency, useDateFormat } from "@/hooks/useAppTranslation";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import type { Purchase } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetPurchases } from "@/hooks/api/usePurchases";

export default function PurchasesPage() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const { formatDate } = useDateFormat();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
 
  const { data: purchasesList = [], isLoading } = useGetPurchases();
  const purchases: Purchase[] = Array.isArray(purchasesList)
    ? purchasesList
    : (purchasesList as any)?.data || [];

  // Calculate purchase stats
  const totalPurchases = purchases.reduce((sum, p) => sum + (p.total || 0), 0);
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthPurchases = purchases
    .filter((p) => new Date(p.createdAt) >= startOfMonth)
    .reduce((sum, p) => sum + (p.total || 0), 0);
  const purchaseCount = purchases.length;
  const totalDue = purchases.reduce((sum, p) => sum + (p.dueAmount || 0), 0);

  // Filter purchases
  const filteredPurchases = useMemo(() => {
    return purchases.filter((purchase) => {
      const matchesSearch =
        (purchase.invoiceNo || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (purchase.supplier?.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        purchase.items?.some((item) =>
          item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      const matchesStatus =
        statusFilter === "all" || purchase.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [purchases, searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Truck className="h-6 w-6 text-primary" />
            {isBangla ? "ক্রয় ব্যবস্থাপনা" : "Purchases"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5 whitespace-nowrap">
            {isBangla
              ? "সরবরাহকারী থেকে পণ্য ক্রয় এবং ক্রয়ের ইতিহাস পরিচালনা করুন"
              : "Manage supplier purchases and purchase history."}
          </p>
        </div>
        <Link
          href="/purchases/new"
          className="bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 flex gap-2 shrink-0 p-2.5 rounded-lg text-sm font-semibold items-center"
        >
          <Plus className="h-4 w-4" />
          <span className="whitespace-nowrap">
            {isBangla ? "নতুন ক্রয়" : "New Purchase"}
          </span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Purchases"
          titleBn="মোট ক্রয়"
          value={totalPurchases}
          prefix="৳"
          trend={{ value: 8.5, isPositive: false }}
          icon={<ShoppingCart className="h-5 w-5" />}
          iconColor="warning"
          isBangla={isBangla}
        />
        <KPICard
          title="This Month"
          titleBn="এই মাসে"
          value={monthPurchases}
          prefix="৳"
          trend={{ value: 5.2, isPositive: false }}
          icon={<BarChart3 className="h-5 w-5" />}
          iconColor="indigo"
          isBangla={isBangla}
        />
        <KPICard
          title="Purchase Invoices"
          titleBn="ক্রয় ইনভয়েস সংখ্যা"
          value={purchaseCount}
          trend={{ value: 3, isPositive: true }}
          icon={<Receipt className="h-5 w-5" />}
          iconColor="warning"
          isBangla={isBangla}
        />
        <KPICard
          title="Total Due Amount"
          titleBn="মোট বকেয়া পরিমাণ"
          value={totalDue}
          prefix="৳"
          icon={<AlertCircle className="h-5 w-5" />}
          iconColor="emerald"
          isBangla={isBangla}
        />
      </div>

      {/* Filters Bar */}
      <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground shrink-0" />
            <Input
              placeholder={
                isBangla
                  ? "ইনভয়েস, সরবরাহকারী বা পণ্য খুঁজুন..."
                  : "Search invoice, supplier, or product..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[160px]">
              <SelectValue placeholder={isBangla ? "স্ট্যাটাস" : "Status"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isBangla ? "সব" : "All"}</SelectItem>
              <SelectItem value="received">
                {isBangla ? "গৃহীত" : "Received"}
              </SelectItem>
              <SelectItem value="completed">
                {isBangla ? "সম্পন্ন" : "Completed"}
              </SelectItem>
              <SelectItem value="pending">
                {isBangla ? "অপেক্ষমান" : "Pending"}
              </SelectItem>
              <SelectItem value="partial">
                {isBangla ? "আংশিক" : "Partial"}
              </SelectItem>
            </SelectContent>
          </Select>
          <button
            type="button"
            className="flex items-center gap-2 border border-input rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted shrink-0 cursor-pointer"
          >
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="whitespace-nowrap">
              {isBangla ? "তারিখ" : "Date"}
            </span>
          </button>
        </div>
      </div>

      {/* Purchases Table (Dark Aesthetic matching Sales list table) */}
      <div className="rounded-xl border border-[#1e2738] bg-[#131823] shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1f283c] flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-100 tracking-tight">
            {isBangla ? "ক্রয়ের ইতিহাস" : "Purchase History"}
          </h2>
          <span className="text-xs font-medium text-[#718296]">
            {filteredPurchases.length}{" "}
            {isBangla ? "টি ক্রয়" : "purchases total"}
          </span>
        </div>

        <div>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : filteredPurchases.length === 0 ? (
            <EmptyState
              icon={<Package className="h-8 w-8" />}
              title={isBangla ? "কোনো ক্রয় নেই" : "No purchases found"}
              description={
                isBangla ? "নতুন ক্রয় শুরু করুন" : "Start a new purchase"
              }
              isBangla={isBangla}
              action={
                <button
                  type="button"
                  onClick={() => router.push("/purchases/new")}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span className="whitespace-nowrap">
                    {isBangla ? "স্টক যোগ" : "Add Stock"}
                  </span>
                </button>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-b-[#1f283c] bg-[#131823] text-[#718296] text-[12px] font-semibold tracking-wide">
                    <th className="px-4 py-3.5 whitespace-nowrap">
                      {isBangla ? "ক্রম" : "SL."}
                    </th>
                    <th className="px-4 py-3.5 whitespace-nowrap">
                      {isBangla ? "ইনভয়েস নং" : "Invoice No"}
                    </th>
                    <th className="px-4 py-3.5 whitespace-nowrap">
                      {isBangla ? "সরবরাহকারী" : "Supplier"}
                    </th>
                    <th className="px-4 py-3.5 whitespace-nowrap">
                      {isBangla ? "তারিখ" : "Date"}
                    </th>
                    <th className="px-4 py-3.5 whitespace-nowrap">
                      {isBangla ? "পণ্য" : "Items"}
                    </th>
                    <th className="px-4 py-3.5 whitespace-nowrap">
                      {isBangla ? "মোট" : "Total"}
                    </th>
                    <th className="px-4 py-3.5 whitespace-nowrap">
                      {isBangla ? "বাকি" : "Due"}
                    </th>
                    <th className="px-4 py-3.5 whitespace-nowrap">
                      {isBangla ? "স্ট্যাটাস" : "Status"}
                    </th>
                    <th className="px-4 py-3.5 text-right whitespace-nowrap">
                      {isBangla ? "অ্যাকশন" : "Actions"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1b2231] bg-[#131823]">
                  {filteredPurchases.map((purchase, index) => {
                    const statusConfig: Record<
                      string,
                      { label: string; labelBn: string; color: string }
                    > = {
                      received: {
                        label: "Received",
                        labelBn: "গৃহীত",
                        color:
                          "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                      },
                      completed: {
                        label: "Completed",
                        labelBn: "সম্পন্ন",
                        color:
                          "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                      },
                      pending: {
                        label: "Pending",
                        labelBn: "অপেক্ষমান",
                        color:
                          "text-amber-400 bg-amber-500/10 border-amber-500/20",
                      },
                      partial: {
                        label: "Partial",
                        labelBn: "আংশিক",
                        color:
                          "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
                      },
                      cancelled: {
                        label: "Cancelled",
                        labelBn: "বাতিল",
                        color:
                          "text-rose-400 bg-rose-500/10 border-rose-500/20",
                      },
                    };

                    const status =
                      statusConfig[purchase.status] || statusConfig.received;
                    const slNumber = String(index + 1).padStart(2, "0");
                    const invoiceNo =
                      purchase.invoiceNo ||
                      `PUR-${(purchase.id || "").slice(-6)}`;
                    const supplierName =
                      purchase.supplier?.name ||
                      (purchase as any).party?.name ||
                      (isBangla ? "সাধারণ সরবরাহকারী" : "Supplier");

                    return (
                      <tr
                        key={purchase.id}
                        className="hover:bg-[#1a2130]/80 transition-colors cursor-pointer"
                        onClick={() => router.push(`/purchases/${purchase.id}`)}
                      >
                        <td className="px-4 py-4 text-[#718296] font-mono text-xs font-medium whitespace-nowrap">
                          {slNumber}
                        </td>
                        <td className="px-4 py-4 text-[#718296] font-mono text-xs font-medium whitespace-nowrap">
                          {invoiceNo}
                        </td>
                        <td className="px-4 py-4 text-slate-100 font-semibold text-sm whitespace-nowrap">
                          {supplierName}
                        </td>
                        <td className="px-4 py-4 text-[#718296] text-xs whitespace-nowrap">
                          {formatDate(purchase.createdAt)}
                        </td>
                        <td className="px-4 py-4 text-slate-200 text-xs font-medium whitespace-nowrap">
                          {purchase.items?.length || 0}{" "}
                          {isBangla ? "টি" : "item(s)"}
                        </td>
                        <td className="px-4 py-4 font-bold text-slate-100 text-sm whitespace-nowrap">
                          {formatCurrency(purchase.total)}
                        </td>
                        <td className="px-4 py-4 text-xs font-medium whitespace-nowrap">
                          {purchase.dueAmount > 0 ? (
                            <span className="text-rose-400 font-bold">
                              {formatCurrency(purchase.dueAmount)}
                            </span>
                          ) : (
                            <span className="text-[#718296]">৳0.00</span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full border ${status.color}`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {isBangla ? status.labelBn : status.label}
                          </span>
                        </td>
                        <td
                          className="px-4 py-4 text-right whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              title={isBangla ? "দেখুন" : "View Details"}
                              className="p-1.5 rounded-md text-[#718296] hover:text-white hover:bg-[#202738] transition-colors cursor-pointer"
                              onClick={() =>
                                router.push(`/purchases/${purchase.id}`)
                              }
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              title={isBangla ? "ক্রয় ফেরত" : "Return Purchase"}
                              className="p-1.5 rounded-md text-amber-400 hover:text-white hover:bg-[#202738] transition-colors cursor-pointer"
                              onClick={() =>
                                router.push(
                                  `/purchases/returns/new?purchaseId=${purchase.id}`,
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
          )}
        </div>
      </div>
    </div>
  );
}
