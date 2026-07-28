"use client";

import { useState, useMemo } from "react";
import {
  Card,
  Button,
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
  Plus,
  Search,
  Calendar,
  CreditCard,
  Eye,
  FileText,
  Loader2,
  ArrowUpDown,
} from "lucide-react";
import { AddPaymentOutModal } from "@/components/parties/AddPaymentOutModal";
import { PaymentDetailsModal } from "@/components/parties/PaymentDetailsModal";
import { useAppTranslation, useCurrency } from "@/hooks/useAppTranslation";
import { useGetPaymentList } from "@/hooks/api/usePayments";

export default function PaymentOutPage() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();

  const [searchTerm, setSearchTerm] = useState("");
  const [paymentModeFilter, setPaymentModeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);

  // Fetch payment list from API
  const { data: paymentResponse, isLoading, isError } = useGetPaymentList("paid");
  const transactions = paymentResponse?.data?.data ?? paymentResponse?.data ?? [];

  // Helper to format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Filtering & sorting
  const filteredTransactions = useMemo(() => {
    if (!Array.isArray(transactions)) return [];

    return transactions
      .filter((tx: any) => {
        const partyName = tx.party?.name || "";
        const receiptNo = tx.reference || "";
        const remarks = tx.notes || "";
        const mode = tx.mode || "";

        const matchesSearch =
          partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(receiptNo).toLowerCase().includes(searchTerm.toLowerCase()) ||
          remarks.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesMode =
          paymentModeFilter === "all" ||
          mode.toLowerCase() === paymentModeFilter.toLowerCase();

        return matchesSearch && matchesMode;
      })
      .sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      });
  }, [transactions, searchTerm, paymentModeFilter, sortOrder]);

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-rose-500" />
              {isBangla ? "পেমেন্ট আউট" : "Payment Out"}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5 whitespace-nowrap">
              {isBangla ? "সরবরাহকারীদের পেমেন্ট প্রদানের তালিকা" : "All payments paid to suppliers"}
            </p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="shrink-0 gap-2 bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span className="whitespace-nowrap">{isBangla ? "পেমেন্ট প্রদান" : "Add Payment Out"}</span>
          </Button>
        </div>

        {/* Filters */}
        <Card variant="elevated" padding="default">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground shrink-0" />
              <Input
                placeholder={isBangla ? "রসিদ নং বা পার্টির নাম খুঁজুন..." : "Search receipt no or party..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={paymentModeFilter} onValueChange={setPaymentModeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder={isBangla ? "পেমেন্ট মোড" : "Payment Mode"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isBangla ? "সব মোড" : "All Modes"}</SelectItem>
                <SelectItem value="cash">{isBangla ? "নগদ (Cash)" : "Cash"}</SelectItem>
                <SelectItem value="bank">{isBangla ? "ব্যাংক (Bank)" : "Bank"}</SelectItem>
                <SelectItem value="mobile_banking">{isBangla ? "মোবাইল ব্যাংকিং" : "Mobile Banking"}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder={isBangla ? "তারিখ" : "Date"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isBangla ? "সব তারিখ" : "All Dates"}</SelectItem>
                <SelectItem value="today">{isBangla ? "আজ" : "Today"}</SelectItem>
                <SelectItem value="yesterday">{isBangla ? "গতকাল" : "Yesterday"}</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
              className="shrink-0 cursor-pointer"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Transactions Table - Matches Sales List Design */}
        <div className="rounded-xl border border-[#1e2738] bg-[#131823] shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1f283c] flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100 tracking-tight">
              {isBangla ? "পেমেন্ট আউট ইতিহাস" : "Payment Out History"}
            </h2>
            <span className="text-xs font-medium text-[#718296]">
              {filteredTransactions.length} {isBangla ? "টি পেমেন্ট" : "payments total"}
            </span>
          </div>

          <div>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="h-8 w-8 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
              </div>
            ) : isError ? (
              <div className="p-8 text-center text-rose-400 text-sm">
                {isBangla ? "ডেটা লোড করতে সমস্যা হয়েছে" : "Failed to load payment records"}
              </div>
            ) : filteredTransactions.length === 0 ? (
              <EmptyState
                icon={<CreditCard className="h-8 w-8" />}
                title={isBangla ? "কোনো পেমেন্ট পাওয়া যায়নি" : "No payment out records found"}
                description={isBangla ? "নতুন পেমেন্ট আউট যোগ করুন" : "Add a new payment paid to supplier"}
                isBangla={isBangla}
                action={
                  <Button onClick={() => setIsAddModalOpen(true)} className="bg-rose-600 hover:bg-rose-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    <span>{isBangla ? "পেমেন্ট প্রদান" : "Add Payment Out"}</span>
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
                        {isBangla ? "রসিদ নং" : "Receipt No"}
                      </th>
                      <th className="px-4 py-3.5 whitespace-nowrap">
                        {isBangla ? "পার্টির নাম" : "Party Name"}
                      </th>
                      <th className="px-4 py-3.5 whitespace-nowrap">
                        {isBangla ? "তারিখ" : "Date"}
                      </th>
                      <th className="px-4 py-3.5 whitespace-nowrap">
                        {isBangla ? "পেমেন্ট পদ্ধতি" : "Payment Method"}
                      </th>
                      <th className="px-4 py-3.5 whitespace-nowrap">
                        {isBangla ? "পরিমাণ" : "Amount"}
                      </th>
                      <th className="px-4 py-3.5 whitespace-nowrap">
                        {isBangla ? "মন্তব্য" : "Remarks"}
                      </th>
                      <th className="px-4 py-3.5 text-right whitespace-nowrap">
                        {isBangla ? "অ্যাকশন" : "Actions"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1b2231] bg-[#131823]">
                    {filteredTransactions.map((tx: any, index: number) => {
                      const slNumber = String(index + 1).padStart(2, "0");

                      return (
                        <tr
                          key={tx.id}
                          className="hover:bg-[#1a2130]/80 transition-colors cursor-pointer"
                          onClick={() => setSelectedPaymentId(tx.id)}
                        >
                          <td className="px-4 py-4 text-[#718296] font-mono text-xs font-medium whitespace-nowrap">
                            {slNumber}
                          </td>
                          <td className="px-4 py-4 text-[#718296] font-mono text-xs font-medium whitespace-nowrap">
                            {tx.reference || "—"}
                          </td>
                          <td className="px-4 py-4 text-slate-100 font-semibold text-sm whitespace-nowrap">
                            {tx.party?.name || (isBangla ? "অজ্ঞাত পার্টি" : "Unknown Party")}
                          </td>
                          <td className="px-4 py-4 text-[#718296] text-xs whitespace-nowrap">
                            {formatDate(tx.createdAt)}
                          </td>
                          <td className="px-4 py-4 text-slate-200 text-xs font-medium capitalize whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              {tx.mode || "Cash"}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-rose-400 font-mono text-sm font-bold whitespace-nowrap">
                            {formatCurrency(Math.abs(tx.amount || 0))}
                          </td>
                          <td className="px-4 py-4 text-[#718296] text-xs max-w-xs truncate whitespace-nowrap">
                            {tx.notes || "—"}
                          </td>
                          <td className="px-4 py-4 text-right whitespace-nowrap">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-[#718296] hover:text-white hover:bg-[#1f283c] cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPaymentId(tx.id);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
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

      <AddPaymentOutModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {selectedPaymentId && (
        <PaymentDetailsModal
          isOpen={!!selectedPaymentId}
          onClose={() => setSelectedPaymentId(null)}
          paymentId={selectedPaymentId}
        />
      )}
    </>
  );
}
