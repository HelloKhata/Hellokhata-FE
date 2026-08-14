// Hello Khata OS - Premium Quotations Page
// Elite SaaS Design - Dark Theme First

"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  FileText,
  Plus,
  Search,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  DollarSign,
  ShoppingCart,
  Loader2,
  TrendingUp,
  Printer,
  Share2,
  Package,
} from "lucide-react";
import { useCurrency, useDateFormat } from "@/hooks/useAppTranslation";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import type { Quotation } from "@/types/quotation";
import { QUOTATION_STATUS_CONFIG } from "@/types/quotation";
import { toast } from "sonner";
import {
  useDeleteQuotation,
  useGetQoutationSummary,
  useGetQuotations,
} from "@/hooks/api/useQuotations";

export default function QuotationsPage() {
  const router = useRouter();
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const { formatDate } = useDateFormat();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quotationToDelete, setQuotationToDelete] = useState<Quotation | null>(
    null,
  );
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [selectedQuotation, setSelectedQuotation] =
    useState<Quotation | null>(null);

  // Fetch quotations from API
  const { data: quotationData = [], isLoading } = useGetQuotations(searchTerm);
  const { data: summaryData } = useGetQoutationSummary();
  const { mutate: deleteMutate, isPending: isDeleting } = useDeleteQuotation();

  // Extract quotations and summary from API response
  const quotations = quotationData?.data || [];

  // Filter quotations (client-side search and status filter)
  const filteredQuotations = useMemo(() => {
    if (!quotations) return [];

    let filtered = quotations;
    if (statusFilter !== "all") {
      filtered = filtered.filter((q) => q.status === statusFilter);
    }

    if (!searchTerm) return filtered;

    return filtered.filter((quotation) => {
      const matchesSearch =
        quotation.quotationNo
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        quotation.partyName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        quotation.items.some((item) =>
          item.itemName.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      return matchesSearch;
    });
  }, [quotations, searchTerm, statusFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!quotations)
      return { total: 0, pending: 0, accepted: 0, totalValue: 0 };

    const total = quotations.length;
    const pending = quotations.filter(
      (q) => q.status === "sent" || q.status === "draft",
    ).length;
    const accepted = quotations.filter((q) => q.status === "accepted").length;
    const totalValue = quotations.reduce((sum, q) => sum + q.total, 0);

    return { total, pending, accepted, totalValue };
  }, [quotations]);

  // Handle delete confirmation
  const handleDeleteClick = (quotation: Quotation) => {
    setQuotationToDelete(quotation);
    setDeleteDialogOpen(true);
  };

  // Handle confirmed delete
  const handleDeleteConfirm = async () => {
    if (!quotationToDelete) return;

    deleteMutate(quotationToDelete.id, {
      onSuccess: () => {
        toast.success(
          isBangla
            ? "কোটেশন সফলভাবে মুছে ফেলা হয়েছে"
            : "Quotation deleted successfully",
        );
        setDeleteDialogOpen(false);
        setQuotationToDelete(null);
      },
    });
  };

  // Handle view quotation
  const handleView = (quotation: Quotation) => {
    router.push(`/sales/quotations/${quotation.id}`);
  };

  // Handle edit quotation
  const handleEdit = (quotation: Quotation) => {
    router.push(`/sales/quotations/${quotation.id}/edit`);
  };

  // Handle convert to sale
  const handleConvert = (quotation: Quotation) => {
    router.push(`/sales/new?quotationId=${quotation.id}`);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              {isBangla ? "কোটেশন" : "Quotations"}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5 whitespace-nowrap">
              {isBangla ? "সকল কোটেশনের রেকর্ড" : "All quotation records"}
            </p>
          </div>
          <Button
            onClick={() => router.push("/sales/quotations/new")}
            className="shrink-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="whitespace-nowrap">
              {isBangla ? "নতুন কোটেশন" : "New Quotation"}
            </span>
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Quotations"
            titleBn="মোট কোটেশন"
            value={stats.total}
            icon={<FileText className="h-5 w-5" />}
            iconColor="indigo"
            isBangla={isBangla}
          />
          <KPICard
            title="Pending"
            titleBn="অপেক্ষমান"
            value={stats.pending}
            icon={<Clock className="h-5 w-5" />}
            iconColor="warning"
            isBangla={isBangla}
          />
          <KPICard
            title="Accepted"
            titleBn="গৃহীত"
            value={stats.accepted}
            trend={{ value: 15, isPositive: true }}
            icon={<CheckCircle className="h-5 w-5" />}
            iconColor="emerald"
            isBangla={isBangla}
          />
          <KPICard
            title="Total Value"
            titleBn="মোট মূল্য"
            value={stats.totalValue}
            prefix="৳"
            icon={<DollarSign className="h-5 w-5" />}
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
                    ? "কোটেশন বা গ্রাহক খুঁজুন..."
                    : "Search quotation or customer..."
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
                <SelectItem value="draft">
                  {isBangla ? "খসড়া" : "Draft"}
                </SelectItem>
                <SelectItem value="sent">
                  {isBangla ? "প্রেরিত" : "Sent"}
                </SelectItem>
                <SelectItem value="accepted">
                  {isBangla ? "গৃহীত" : "Accepted"}
                </SelectItem>
                <SelectItem value="rejected">
                  {isBangla ? "প্রত্যাখ্যাত" : "Rejected"}
                </SelectItem>
                <SelectItem value="converted">
                  {isBangla ? "রূপান্তরিত" : "Converted"}
                </SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2 shrink-0">
              <Calendar className="h-4 w-4" />
              <span className="whitespace-nowrap">
                {isBangla ? "তারিখ" : "Date"}
              </span>
            </Button>
          </div>
        </Card>

        {/* Quotations Table (Exact same as Sales List table) */}
        <div className="rounded-xl border border-[#1e2738] bg-[#131823] shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1f283c] flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100 tracking-tight">
              {isBangla ? "কোটেশন ইতিহাস" : "Quotation History"}
            </h2>
            <span className="text-xs font-medium text-[#718296]">
              {filteredQuotations.length}{" "}
              {isBangla ? "টি কোটেশন" : "quotations total"}
            </span>
          </div>

          <div>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
            ) : filteredQuotations.length === 0 ? (
              <EmptyState
                icon={<FileText className="h-8 w-8" />}
                title={isBangla ? "কোনো কোটেশন নেই" : "No quotations found"}
                description={
                  isBangla
                    ? "নতুন কোটেশন তৈরি করুন"
                    : "Create your first quotation"
                }
                isBangla={isBangla}
                action={
                  <Button onClick={() => router.push("/sales/quotations/new")}>
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="whitespace-nowrap">
                      {isBangla ? "নতুন কোটেশন" : "New Quotation"}
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
                        {isBangla ? "কোটেশন নং" : "Quotation No"}
                      </th>
                      <th className="px-4 py-3.5 whitespace-nowrap">
                        {isBangla ? "কাস্টমার" : "Customer"}
                      </th>
                      <th className="px-4 py-3.5 whitespace-nowrap">
                        {isBangla ? "তারিখ" : "Date"}
                      </th>
                      <th className="px-4 py-3.5 whitespace-nowrap">
                        {isBangla ? "মেয়াদ" : "Validity Date"}
                      </th>
                      <th className="px-4 py-3.5 whitespace-nowrap">
                        {isBangla ? "পণ্য" : "Items"}
                      </th>
                      <th className="px-4 py-3.5 whitespace-nowrap">
                        {isBangla ? "মোট" : "Total"}
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
                    {filteredQuotations.map((quotation, index) => {
                      const statusConfig: Record<
                        string,
                        { label: string; labelBn: string; color: string }
                      > = {
                        draft: {
                          label: "Draft",
                          labelBn: "খসড়া",
                          color:
                            "text-slate-400 bg-slate-500/10 border-slate-500/20",
                        },
                        sent: {
                          label: "Sent",
                          labelBn: "প্রেরিত",
                          color:
                            "text-amber-400 bg-amber-500/10 border-amber-500/20",
                        },
                        accepted: {
                          label: "Accepted",
                          labelBn: "গৃহীত",
                          color:
                            "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                        },
                        rejected: {
                          label: "Rejected",
                          labelBn: "প্রত্যাখ্যাত",
                          color:
                            "text-rose-400 bg-rose-500/10 border-rose-500/20",
                        },
                        converted: {
                          label: "Converted",
                          labelBn: "রূপান্তরিত",
                          color:
                            "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
                        },
                      };

                      const status =
                        statusConfig[quotation.status] || statusConfig.sent;
                      const slNumber = String(index + 1).padStart(2, "0");
                      const isExpired =
                        new Date(quotation.validityDate) < new Date() &&
                        quotation.status === "sent";

                      return (
                        <tr
                          key={quotation.id}
                          className="hover:bg-[#1a2130]/80 transition-colors cursor-pointer"
                          onClick={() => handleView(quotation)}
                        >
                          <td className="px-4 py-4 text-[#718296] font-mono text-xs font-medium whitespace-nowrap">
                            {slNumber}
                          </td>
                          <td className="px-4 py-4 text-[#718296] font-mono text-xs font-medium whitespace-nowrap">
                            {quotation.quotationNo}
                          </td>
                          <td className="px-4 py-4 text-slate-100 font-semibold text-sm whitespace-nowrap">
                            {quotation.partyName ||
                              (isBangla
                                ? "সাধারণ গ্রাহক"
                                : "Walk-in customer")}
                          </td>
                          <td className="px-4 py-4 text-[#718296] text-xs whitespace-nowrap">
                            {formatDate(quotation.quotationDate)}
                          </td>
                          <td className="px-4 py-4 text-[#718296] text-xs whitespace-nowrap">
                            {formatDate(quotation.validityDate)}
                          </td>
                          <td className="px-4 py-4 text-slate-200 text-xs font-medium whitespace-nowrap">
                            {quotation.items?.length || 0}{" "}
                            {isBangla ? "টি" : "item(s)"}
                          </td>
                          <td className="px-4 py-4 font-bold text-slate-100 text-sm whitespace-nowrap">
                            {formatCurrency(quotation.total)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span
                                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full border ${status.color}`}
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                {isBangla ? status.labelBn : status.label}
                              </span>
                              {isExpired && (
                                <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                  {isBangla ? "মেয়াদ শেষ" : "Expired"}
                                </span>
                              )}
                            </div>
                          </td>
                          <td
                            className="px-4 py-4 text-right whitespace-nowrap"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                title={isBangla ? "দেখুন" : "View"}
                                className="p-1.5 rounded-md text-[#718296] hover:text-white hover:bg-[#202738] transition-colors"
                                onClick={() => handleView(quotation)}
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              {(quotation.status === "draft" ||
                                quotation.status === "sent") && (
                                <button
                                  type="button"
                                  title={isBangla ? "সম্পাদনা" : "Edit"}
                                  className="p-1.5 rounded-md text-[#718296] hover:text-white hover:bg-[#202738] transition-colors"
                                  onClick={() => handleEdit(quotation)}
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                              )}
                              {quotation.status === "accepted" && (
                                <button
                                  type="button"
                                  title={
                                    isBangla
                                      ? "বিক্রিতে রূপান্তর"
                                      : "Convert to Sale"
                                  }
                                  className="p-1.5 rounded-md text-emerald-400 hover:text-white hover:bg-[#202738] transition-colors"
                                  onClick={() => handleConvert(quotation)}
                                >
                                  <ShoppingCart className="h-4 w-4" />
                                </button>
                              )}
                              {quotation.status === "draft" && (
                                <button
                                  type="button"
                                  title={isBangla ? "মুছে ফেলুন" : "Delete"}
                                  className="p-1.5 rounded-md text-rose-400 hover:text-white hover:bg-[#202738] transition-colors"
                                  onClick={() => handleDeleteClick(quotation)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="w-[400px] sm:w-[350px]">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isBangla ? "কোটেশন মুছে ফেলুন" : "Delete Quotation"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isBangla
                ? `আপনি কি নিশ্চিত যে "${quotationToDelete?.quotationNo}" কোটেশনটি মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।`
                : `Are you sure you want to delete quotation "${quotationToDelete?.quotationNo}"? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {isBangla ? "বাতিল" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {isBangla ? "মুছে ফেলুন" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
