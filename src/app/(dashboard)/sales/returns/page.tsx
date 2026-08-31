// Hello Khata OS - Premium Sales Returns Page
// Elite SaaS Design - Dark Theme First

"use client";

import { useState, useMemo } from "react";
import {
  Card,
  Button,
  KPICard,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Plus,
  Search,
  Calendar as CalendarIcon,
  Banknote,
  Eye,
  Printer,
  Receipt,
  RotateCcw,
  CreditCard,
  Smartphone,
  X,
} from "lucide-react";
import { useCurrency, useDateFormat, useAppTranslation } from "@/hooks/useAppTranslation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetSalesReturns } from "@/hooks/api/useReturns";
import { useParties } from "@/hooks/api/useParties";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SaleReturnItem {
  id: string;
  saleReturnId?: string;
  saleItemId?: string;
  itemId?: string;
  itemName?: string;
  quantity: number;
  unitPrice: number;
  costPrice?: number;
  discount?: number;
  total: number;
  returnType?: string;
  reason?: string;
  createdAt?: string;
  deletedAt?: string | null;
}

interface SaleReturn {
  id: string;
  businessId?: string;
  branchId?: string;
  saleId?: string;
  returnNo?: string;
  returnInvoiceNo?: string;
  invoiceNo?: string;
  partyId?: string;
  party?: { name?: string; phone?: string };
  customer?: { name?: string; phone?: string };
  customerName?: string;
  subtotal?: number;
  discount?: number;
  tax?: number;
  total: number;
  refundAmount?: number;
  refundMethod?: string;
  status: string;
  reason?: string;
  notes?: string | null;
  imageUrl?: string | null;
  createdBy?: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
  sale?: {
    invoiceNo?: string;
    party?: { name?: string };
  };
  items?: SaleReturnItem[];
}

export default function SalesReturnsPage() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const { formatDateTime } = useDateFormat();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // Fetch sales returns
  const { data: salesReturns = [], isLoading } = useGetSalesReturns();

  // Fetch customers to resolve partyId when party object is not nested
  const { data: partiesData } = useParties({ type: "customer" });
  const parties = useMemo(() => {
    if (Array.isArray(partiesData)) return partiesData;
    if (Array.isArray((partiesData as any)?.data)) return (partiesData as any).data;
    return [];
  }, [partiesData]);

  const partyMap = useMemo(() => {
    const map: Record<string, string> = {};
    parties.forEach((p: any) => {
      if (p.id) map[p.id] = p.name;
    });
    return map;
  }, [parties]);

  const getCustomerName = (ret: SaleReturn) => {
    if (ret.party?.name) return ret.party.name;
    if (ret.sale?.party?.name) return ret.sale.party.name;
    if (ret.partyId && partyMap[ret.partyId]) return partyMap[ret.partyId];
    if (ret.customer?.name) return ret.customer.name;
    if (ret.customerName) return ret.customerName;
    return isBangla ? "খুচরা কাস্টমার" : "Retail Customer";
  };

  const getReasonLabel = (reason?: string) => {
    if (!reason) return "—";
    const map: Record<string, { en: string; bn: string }> = {
      defective: { en: "Defective", bn: "ত্রুটিপূর্ণ" },
      damaged: { en: "Damaged", bn: "ক্ষতিগ্রস্ত" },
      expired: { en: "Expired", bn: "মেয়াদোত্তীর্ণ" },
      wrong_item: { en: "Wrong Item", bn: "ভুল পণ্য" },
      customer_change_mind: { en: "Customer Request", bn: "কাস্টমারের অনুরোধ" },
    };
    const key = reason.toLowerCase().replace(/\s+/g, "_");
    if (map[key]) return isBangla ? map[key].bn : map[key].en;
    return reason.charAt(0).toUpperCase() + reason.slice(1).replace(/_/g, " ");
  };

  const getRefundMethodLabel = (method?: string) => {
    if (!method) return "—";
    const m = method.toLowerCase();
    if (m === "cash") return isBangla ? "নগদ" : "Cash";
    if (m === "card") return isBangla ? "কার্ড" : "Card";
    if (m === "mobile_banking" || m === "bkash" || m === "nagad") {
      return isBangla ? "মোবাইল ব্যাংকিং" : "Mobile Banking";
    }
    if (m === "bank" || m === "bank_transfer") return isBangla ? "ব্যাংক" : "Bank";
    return method.charAt(0).toUpperCase() + method.slice(1);
  };

  // Calculate stats from real return records
  const stats = useMemo(() => {
    if (!salesReturns || salesReturns.length === 0) {
      return { todayReturns: 0, monthReturns: 0, totalRefund: 0, returnCount: 0 };
    }

    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const monthStr = today.toISOString().slice(0, 7);

    let todayReturns = 0;
    let monthReturns = 0;
    let totalRefund = 0;

    salesReturns.forEach((item) => {
      const itemTotal = Number(item.total ?? item.refundAmount ?? 0);
      const itemRefund = Number(item.refundAmount ?? item.total ?? 0);
      totalRefund += itemRefund;

      const dateStr = item.createdAt ? new Date(item.createdAt).toISOString() : "";
      if (dateStr.startsWith(todayStr)) {
        todayReturns += itemTotal;
      }
      if (dateStr.startsWith(monthStr)) {
        monthReturns += itemTotal;
      }
    });

    return {
      todayReturns,
      monthReturns:
        monthReturns ||
        (todayReturns > 0
          ? todayReturns
          : salesReturns.reduce((s, r) => s + (Number(r.total) || 0), 0)),
      totalRefund,
      returnCount: salesReturns.length,
    };
  }, [salesReturns]);

  return (
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
              : "Manage returned sales, refunds, and return history."}
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
          value={stats.todayReturns}
          prefix="৳"
          trend={{ value: 12.5, isPositive: true }}
          icon={<RotateCcw className="h-5 w-5" />}
          iconColor="emerald"
          isBangla={isBangla}
        />
        <KPICard
          title="This Month Returns"
          titleBn="এই মাসের রিটার্ন"
          value={stats.monthReturns}
          prefix="৳"
          trend={{ value: 8.2, isPositive: true }}
          icon={<RotateCcw className="h-5 w-5" />}
          iconColor="indigo"
          isBangla={isBangla}
        />
        <KPICard
          title="Return Invoices"
          titleBn="রিটার্ন ইনভয়েস"
          value={stats.returnCount}
          trend={{ value: 5, isPositive: true }}
          icon={<Receipt className="h-5 w-5" />}
          iconColor="warning"
          isBangla={isBangla}
        />
        <KPICard
          title="Refund Amount"
          titleBn="রিফান্ড পরিমাণ"
          value={stats.totalRefund}
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
                  ? "রিটার্ন নং, ইনভয়েস, কাস্টমার বা পণ্য খুঁজুন..."
                  : "Search return no, invoice, customer, or product..."
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
              <SelectItem value="refunded">
                {isBangla ? "রিফান্ডেড" : "Refunded"}
              </SelectItem>
              <SelectItem value="processing">
                {isBangla ? "প্রক্রিয়াধীন" : "Processing"}
              </SelectItem>
              <SelectItem value="rejected">
                {isBangla ? "বাতিল" : "Rejected"}
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Return Date Picker Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "gap-2 shrink-0 border-[#2a3447] bg-[#171d2b] hover:bg-[#1f283a] text-slate-200",
                  selectedDate && "border-primary text-primary"
                )}
              >
                <CalendarIcon className="h-4 w-4" />
                <span className="whitespace-nowrap">
                  {selectedDate
                    ? format(selectedDate, "dd MMM yyyy")
                    : isBangla
                    ? "রিটার্ন তারিখ"
                    : "Return Date"}
                </span>
                {selectedDate && (
                  <X
                    className="h-3.5 w-3.5 ml-1 text-slate-400 hover:text-rose-400 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDate(undefined);
                    }}
                  />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 bg-[#131823] border-[#1e2738]"
              align="end"
            >
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </Card>

      {/* Sales Returns Table */}
      <div className="rounded-xl border border-[#1e2738] bg-[#131823] shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1f283c] flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-100 tracking-tight">
            {isBangla ? "রিটার্ন ইতিহাস" : "Sales Return History"}
          </h2>
          <span className="text-xs font-medium text-[#718296]">
            {salesReturns.length} {isBangla ? "টি রিটার্ন" : "returns total"}
          </span>
        </div>

        <div>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : salesReturns.length === 0 ? (
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
                      {isBangla ? "রিটার্ন নম্বর" : "Return No."}
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
                      {isBangla ? "কারণ" : "Reason"}
                    </th>
                    <th className="px-4 py-3.5 whitespace-nowrap">
                      {isBangla ? "রিফান্ড পদ্ধতি" : "Refund Method"}
                    </th>
                    <th className="px-4 py-3.5 whitespace-nowrap">
                      {isBangla ? "মোট রিটার্ন" : "Total Return"}
                    </th>
                    <th className="px-4 py-3.5 whitespace-nowrap">
                      {isBangla ? "রিফান্ড পরিমাণ" : "Refund Amount"}
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
                  {salesReturns.map((ret, index) => {
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
                    };

                    const status =
                      statusConfig[ret.status?.toLowerCase()] ||
                      statusConfig.completed;
                    const slNumber = String(index + 1).padStart(2, "0");
                    const returnNumber =
                      ret.returnNo ||
                      ret.returnInvoiceNo ||
                      ret.invoiceNo ||
                      `SR-${ret.id.slice(-6)}`;
                    const customerName = getCustomerName(ret);

                    return (
                      <tr
                        key={ret.id}
                        className="hover:bg-[#1a2130]/80 transition-colors cursor-pointer"
                        onClick={() => router.push(`/sales/returns/${ret.id}`)}
                      >
                        <td className="px-4 py-4 text-[#718296] font-mono text-xs font-medium whitespace-nowrap">
                          {slNumber}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="font-mono text-xs font-semibold text-slate-100">
                              {returnNumber}
                            </span>
                            {ret.sale?.invoiceNo && (
                              <span className="font-mono text-[11px] text-[#718296] flex items-center gap-1 mt-0.5">
                                <span className="text-slate-500">Inv:</span>{" "}
                                {ret.sale.invoiceNo}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-slate-100 font-semibold text-sm whitespace-nowrap">
                          {customerName}
                        </td>
                        <td className="px-4 py-4 text-[#718296] text-xs whitespace-nowrap">
                          {ret.createdAt ? formatDateTime(ret.createdAt) : "—"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex flex-col max-w-[180px]">
                            <span className="text-slate-200 text-xs font-medium whitespace-nowrap">
                              {ret.items?.length || 0}{" "}
                              {isBangla ? "টি পণ্য" : "item(s)"}
                            </span>
                            {ret.items &&
                              ret.items.length > 0 &&
                              ret.items[0]?.itemName && (
                                <span
                                  className="text-[11px] text-[#718296] truncate"
                                  title={ret.items
                                    .map(
                                      (i) =>
                                        `${i.itemName} (${i.quantity})`
                                    )
                                    .join(", ")}
                                >
                                  {ret.items[0].itemName}
                                  {ret.items.length > 1
                                    ? ` +${ret.items.length - 1}`
                                    : ""}
                                </span>
                              )}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#1e2638] text-slate-300 border border-[#2b354c]">
                            {getReasonLabel(ret.reason || ret.items?.[0]?.reason)}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            {ret.refundMethod?.toLowerCase() === "cash" && (
                              <Banknote className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                            )}
                            {ret.refundMethod?.toLowerCase() === "card" && (
                              <CreditCard className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                            )}
                            {(ret.refundMethod?.toLowerCase() ===
                              "mobile_banking" ||
                              ret.refundMethod?.toLowerCase() === "bkash" ||
                              ret.refundMethod?.toLowerCase() === "nagad") && (
                              <Smartphone className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                            )}
                            <span className="text-slate-300 text-xs">
                              {getRefundMethodLabel(ret.refundMethod)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 font-bold text-slate-100 text-sm whitespace-nowrap">
                          {formatCurrency(Number(ret.total) || 0)}
                        </td>
                        <td className="px-4 py-4 font-bold text-emerald-400 text-sm whitespace-nowrap">
                          {formatCurrency(
                            Number(ret.refundAmount ?? ret.total) || 0
                          )}
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
                                router.push(`/sales/returns/${ret.id}`)
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
                              onClick={() =>
                                router.push(`/sales/returns/${ret.id}?print=true`)
                              }
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
  );
}

