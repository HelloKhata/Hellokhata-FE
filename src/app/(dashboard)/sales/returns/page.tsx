// Hello Khata OS - Premium Sales Page
// Elite SaaS Design - Dark Theme First

"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  KPICard,
  Divider,
  EmptyState,
} from "@/components/ui/premium";
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
  CreditCard,
  Banknote,
  Smartphone,
  User,
  Eye,
  Printer,
  Share2,
  TrendingUp,
  FileText,
  BarChart3,
  ArrowUpRight,
  ChevronRight,
  Package,
  DollarSign,
  Receipt,
  Clock,
  RotateCcw,
  Check,
  Edit2,
  Edit,
  MoreVertical,
  Layers,
} from "lucide-react";
import { useCurrency, useDateFormat } from "@/hooks/useAppTranslation";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import type { Sale } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetSales, useGetSalesSummary } from "@/hooks/api/useSales";
import { toast } from "sonner";

interface ReturnForm {
  reason: string;
  notes: string;
  refundMethod: "cash" | "bkash" | "credit_note" | "bank";
}
export default function SalesPage() {
  const { t, isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();

  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [isOpenRetrun, setIsOpenReturn] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [returnForm, setReturnForm] = useState<ReturnForm>({
    reason: "",
    notes: "",
    refundMethod: "cash",
  });

  const { data: salesData, isLoading } = useGetSales({ search: searchTerm });
  const { data: salesSummary } = useGetSalesSummary();
  const sales = salesData?.data || [];
  const summary = salesSummary?.data;

  const { formatDateTime } = useDateFormat();

  const filteredSales = useMemo(() => {
    if (statusFilter === "all") return sales;
    return sales.filter((s: Sale) => s.status === statusFilter);
  }, [sales, statusFilter]);

  const router = useRouter();
  // Calculate stats
  const todaySales = sales.reduce((sum, s) => sum + s.total, 0);
  const monthSales = todaySales * 30;
  const invoiceCount = sales.length;
  const avgSale = invoiceCount > 0 ? todaySales / invoiceCount : 0;

  const handleChange = (field: string, value: string) => {
    setReturnForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleSubmitReturn = () => {
    if (!returnForm.reason || !returnForm.refundMethod) {
      console.log(returnForm);
      toast.error(isBangla ? "সব তথ্য দিন" : "Please fill required fields");
      return;
    }

    toast.success(isBangla ? "রিটার্ন সফল" : "Return processed successfully");
  };
  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <RotateCcw className="h-6 w-6 text-primary" />
              {isBangla ? "সেলস রিটার্ন" : "Sales Returns"}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5 whitespace-nowrap">
              {isBangla
                ? "ফেরতকৃত বিক্রি, রিফান্ড এবং রিটার্ন ইতিহাস পরিচালনা করুন"
                : "Manage returned sales, refunds, exchanges, and return history."}
            </p>
          </div>
          <Link href="/sales/returns/new">
            <Button className="shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              <span className="whitespace-nowrap">
                {isBangla ? "নতুন রিটার্ন" : "New Sales Return"}
              </span>
            </Button>
          </Link>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Today's Returns"
            titleBn="আজকের রিটার্ন"
            value={todaySales}
            prefix="৳"
            trend={{ value: 12.5, isPositive: true }}
            icon={<RotateCcw className="h-5 w-5" />}
            iconColor="emerald"
            isBangla={isBangla}
          />
          <KPICard
            title="This Month Returns"
            titleBn="এই মাসের রিটার্ন"
            value={monthSales}
            prefix="৳"
            trend={{ value: 8.2, isPositive: true }}
            icon={<RotateCcw className="h-5 w-5" />}
            iconColor="indigo"
            isBangla={isBangla}
          />
          <KPICard
            title="Return Invoices"
            titleBn="রিটার্ন ইনভয়েস"
            value={invoiceCount}
            trend={{ value: 5, isPositive: true }}
            icon={<Receipt className="h-5 w-5" />}
            iconColor="warning"
            isBangla={isBangla}
          />
          <KPICard
            title="Refund Amount"
            titleBn="রিফান্ড পরিমাণ"
            value={Math.round(avgSale)}
            prefix="৳"
            icon={<Banknote className="h-5 w-5" />}
            iconColor="emerald"
            isBangla={isBangla}
          />
        </div>

        {/* Filters */}
        <Card variant="elevated" padding="default">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground shrink-0" />
              <Input
                placeholder={
                  isBangla
                    ? "রিটার্ন ইনভয়েস, কাস্টমার বা পণ্য খুঁজুন..."
                    : "Search return invoice, customer, or product..."
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
                <SelectItem value="completed">
                  {isBangla ? "সম্পন্ন" : "Completed"}
                </SelectItem>
                <SelectItem value="pending">
                  {isBangla ? "অপেক্ষমান" : "Pending"}
                </SelectItem>
                <SelectItem value="approved">
                  {isBangla ? "অনুমোদিত" : "Approved"}
                </SelectItem>
                <SelectItem value="rejected">
                  {isBangla ? "বাতিল" : "Rejected"}
                </SelectItem>
                <SelectItem value="refunded">
                  {isBangla ? "রিফান্ডেড" : "Refunded"}
                </SelectItem>
                <SelectItem value="processing">
                  {isBangla ? "প্রক্রিয়াধীন" : "Processing"}
                </SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2 shrink-0">
              <Calendar className="h-4 w-4" />
              <span className="whitespace-nowrap">
                {isBangla ? "রিটার্ন তারিখ" : "Return Date"}
              </span>
            </Button>
          </div>
        </Card>

        {/* Sales Table */}
        <div className="rounded-xl border border-[#1e2738] bg-[#131823] shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1f283c] flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100 tracking-tight">
              {isBangla ? "রিটার্ন ইতিহাস" : "Sales Return History"}
            </h2>
            <span className="text-xs font-medium text-[#718296]">
              {filteredSales.length} {isBangla ? "টি রিটার্ন" : "returns total"}
            </span>
          </div>

          <div>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
            ) : filteredSales.length === 0 ? (
              <EmptyState
                icon={<RotateCcw className="h-8 w-8" />}
                title={
                  isBangla ? "কোনো সেলস রিটার্ন নেই" : "No Sales Returns Found"
                }
                description={
                  isBangla
                    ? "কাস্টমার পণ্য ফেরত দিলে সেলস রিটার্ন রেকর্ড এখানে দেখা যাবে।"
                    : "Sales return records will appear here after customers return sold products."
                }
                isBangla={isBangla}
                action={
                  <Button onClick={() => router.push("/sales/returns/new")}>
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="whitespace-nowrap">
                      {isBangla ? "নতুন রিটার্ন" : "Create Sales Return"}
                    </span>
                  </Button>
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
                        {isBangla ? "রিটার্ন ইনভয়েস" : "Return Invoice"}
                      </th>
                      <th className="px-4 py-3.5 whitespace-nowrap">
                        {isBangla ? "কাস্টমার" : "Customer"}
                      </th>
                      <th className="px-4 py-3.5 whitespace-nowrap">
                        {isBangla ? "রিটার্ন তারিখ" : "Return Date"}
                      </th>
                      <th className="px-4 py-3.5 whitespace-nowrap">
                        {isBangla ? "ফেরতকৃত পণ্য" : "Returned Items"}
                      </th>
                      <th className="px-4 py-3.5 whitespace-nowrap">
                        {isBangla ? "রিফান্ড পদ্ধতি" : "Refund Method"}
                      </th>
                      <th className="px-4 py-3.5 whitespace-nowrap">
                        {isBangla ? "রিফান্ড পরিমাণ" : "Refund Amount"}
                      </th>
                      <th className="px-4 py-3.5 whitespace-nowrap">
                        {isBangla ? "রিফান্ডেড" : "Refunded"}
                      </th>
                      <th className="px-4 py-3.5 whitespace-nowrap">
                        {isBangla ? "বকেয়া রিফান্ড" : "Pending Refund"}
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
                    {filteredSales.map((sale, index) => {
                      const statusConfig: Record<
                        string,
                        { label: string; color: string }
                      > = {
                        completed: {
                          label: isBangla ? "সম্পন্ন" : "Completed",
                          color:
                            "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                        },
                        pending: {
                          label: isBangla ? "অপেক্ষমান" : "Pending",
                          color:
                            "text-amber-400 bg-amber-500/10 border-amber-500/20",
                        },
                        approved: {
                          label: isBangla ? "অনুমোদিত" : "Approved",
                          color:
                            "text-blue-400 bg-blue-500/10 border-blue-500/20",
                        },
                        rejected: {
                          label: isBangla ? "বাতিল" : "Rejected",
                          color:
                            "text-rose-400 bg-rose-500/10 border-rose-500/20",
                        },
                        refunded: {
                          label: isBangla ? "রিফান্ডেড" : "Refunded",
                          color:
                            "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
                        },
                        processing: {
                          label: isBangla ? "প্রক্রিয়াধীন" : "Processing",
                          color:
                            "text-orange-400 bg-orange-500/10 border-orange-500/20",
                        },
                        cancelled: {
                          label: isBangla ? "বাতিল" : "Cancelled",
                          color:
                            "text-rose-400 bg-rose-500/10 border-rose-500/20",
                        },
                        returned: {
                          label: isBangla ? "রিটার্ন" : "Returned",
                          color:
                            "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
                        },
                      };
                      const status =
                        statusConfig[sale.status] || statusConfig.completed;
                      const slNumber = String(index + 1).padStart(2, "0");

                      return (
                        <tr
                          key={sale.id}
                          className="hover:bg-[#1a2130]/80 transition-colors cursor-pointer"
                          onClick={() =>
                            router.push(`/sales/returns/${sale.id}`)
                          }
                        >
                          <td className="px-4 py-4 text-[#718296] font-mono text-xs font-medium whitespace-nowrap">
                            {slNumber}
                          </td>
                          <td className="px-4 py-4 text-[#718296] font-mono text-xs font-medium whitespace-nowrap">
                            {sale.invoiceNo}
                          </td>
                          <td className="px-4 py-4 text-slate-100 font-semibold text-sm whitespace-nowrap">
                            {sale.party?.name ||
                              (isBangla ? "খুচরা কাস্টমার" : "Retail Customer")}
                          </td>
                          <td className="px-4 py-4 text-[#718296] text-xs whitespace-nowrap">
                            {formatDateTime(sale.createdAt)}
                          </td>
                          <td className="px-4 py-4 text-slate-200 text-xs font-medium whitespace-nowrap">
                            {sale.items?.length || 0}{" "}
                            {isBangla ? "টি" : "item(s)"}
                          </td>
                          <td className="px-4 py-4 text-slate-300 text-xs capitalize whitespace-nowrap">
                            {sale.paymentMethod || "—"}
                          </td>
                          <td className="px-4 py-4 font-bold text-slate-100 text-sm whitespace-nowrap">
                            {formatCurrency(sale.total)}
                          </td>
                          <td className="px-4 py-4 font-bold text-emerald-400 text-sm whitespace-nowrap">
                            {formatCurrency(sale.paidAmount)}
                          </td>
                          <td className="px-4 py-4 font-bold text-sm whitespace-nowrap">
                            <span
                              className={
                                sale.dueAmount > 0
                                  ? "text-rose-400"
                                  : "text-[#718296]"
                              }
                            >
                              {formatCurrency(sale.dueAmount)}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full border ${status.color}`}
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-current" />
                              {status.label}
                            </span>
                          </td>
                          <td
                            className="px-4 py-4 text-right whitespace-nowrap"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                title={
                                  isBangla ? "রিটার্ন দেখুন" : "View Return"
                                }
                                className="p-1.5 rounded-md text-[#718296] hover:text-white hover:bg-[#202738] transition-colors"
                                onClick={() =>
                                  router.push(`/sales/returns/${sale.id}`)
                                }
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                title={
                                  isBangla
                                    ? "রিটার্ন প্রিন্ট করুন"
                                    : "Print Return"
                                }
                                className="p-1.5 rounded-md text-[#718296] hover:text-white hover:bg-[#202738] transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log("Print Return");
                                }}
                              >
                                <Printer className="h-4 w-4" />
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
    </>
  );
}
