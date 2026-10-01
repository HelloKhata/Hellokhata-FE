"use client";

import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  TrendingUp,
  Search,
  Printer,
  Receipt,
  Clock,
  Building2,
  Paperclip,
  Eye,
  Trash2,
  ChevronLeft,
  Copy,
  X,
  CreditCard,
  Tag,
  RefreshCw,
  Calendar,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Button, Input } from "@/components/ui/premium";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  IncomeRecord,
  PAYMENT_METHOD_MAP,
  toBnNum,
  formatBnDate,
  getIconComponentById,
  getCategoryColorStyles,
} from "./types";
import { useGetIncomes, useDeleteIncome } from "@/hooks/api/useFinance";
import { useGetBranches } from "@/hooks/api/useBranches";
import { useGetPaymentMethods } from "@/hooks/api/usePaymentMethod";

export interface IncomeRecordsProps {
  incomes?: IncomeRecord[] | any[];
  incomeCategories?: any[];
  onDeleteIncome?: (incId: string) => void;
  isBangla: boolean;
}

export const IncomeRecords: React.FC<IncomeRecordsProps> = ({
  incomes: propIncomes,
  incomeCategories,
  onDeleteIncome,
  isBangla,
}) => {
  const { toast } = useToast();
  
  // Real API hooks
  const { data: incomesData, isLoading: isLoadingIncome } = useGetIncomes();
  const { mutate: deleteIncomeMutation, isPending: isDeleting } = useDeleteIncome();
  const { data: branches } = useGetBranches();
  const { data: paymentMethods } = useGetPaymentMethods();

  // Selected Income for Split Layout Detail Panel
  const [selectedIncome, setSelectedIncome] = useState<any | null>(null);

  // Table Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [tableCategoryFilter, setTableCategoryFilter] = useState("all");
  const [tableBranchFilter, setTableBranchFilter] = useState("all");

  // Normalize incoming real data or fallback prop data
  const normalizedIncomes = useMemo(() => {
    const rawList = Array.isArray(incomesData)
      ? incomesData
      : Array.isArray(propIncomes)
      ? propIncomes
      : [];

    return rawList.map((inc: any) => {
      const cat =
        inc.category ||
        incomeCategories?.find((c: any) => c.id === inc.categoryId);
      const catColor = cat?.color || inc.color || "#10B981";
      const { bgColor } = getCategoryColorStyles(catColor);
      
      const catIcon = cat?.icon
        ? typeof cat.icon === "string"
          ? getIconComponentById(cat.icon)
          : cat.icon
        : inc.icon || getIconComponentById("briefcase");

      const titleEn = cat?.name || cat?.nameEn || inc.titleEn || "Income";
      const titleBn =
        cat?.nameBn || cat?.name || inc.titleBn || inc.titleEn || "আয়";
      const subtitleEn =
        inc.note || inc.description || inc.subtitleEn || "Direct receipt";
      const subtitleBn =
        inc.note || inc.description || inc.subtitleBn || "সরাসরি আয়";

      let parsedDate = new Date();
      if (inc.date) {
        parsedDate = new Date(inc.date);
      } else if (inc.createdAt) {
        parsedDate = new Date(inc.createdAt);
      }
      const isValidDate = !isNaN(parsedDate.getTime());
      const dateEn = isValidDate
        ? format(parsedDate, "MMM dd, yyyy")
        : inc.dateEn || "—";
      const dateBn = isValidDate
        ? formatBnDate(parsedDate)
        : inc.dateBn || "—";

      // Branch name lookup
      const foundBranch = branches?.find((b: any) => b.id === inc.branchId);
      const branchName =
        inc.branch?.name ||
        (typeof inc.branch === "string" ? inc.branch : null) ||
        foundBranch?.name ||
        "Main Branch";

      // Payment Method name lookup
      const foundAccount = paymentMethods?.find(
        (p: any) => p.id === inc.accountId
      );
      const paymentMethodName =
        inc.paymentMethod ||
        inc.account?.name ||
        foundAccount?.name ||
        "cash";

      // Attachment / Receipt handling
      let attachmentName: string | null = inc.receipt || inc.attachmentName || null;
      let receiptUrl: string | null = null;
      if (attachmentName && (attachmentName.startsWith("http://") || attachmentName.startsWith("https://"))) {
        receiptUrl = attachmentName;
        try {
          const urlObj = new URL(attachmentName);
          attachmentName = urlObj.pathname.split("/").pop() || "receipt.jpg";
        } catch {
          attachmentName = "receipt.jpg";
        }
      }

      // Voucher Code
      const voucherCode =
        inc.voucherCode ||
        (inc.id ? `INC-${inc.id.slice(-6).toUpperCase()}` : "INC-0000");

      return {
        id: inc.id,
        voucherCode,
        categoryId: inc.categoryId || cat?.id || "",
        category: cat,
        titleEn,
        titleBn,
        subtitleEn,
        subtitleBn,
        dateEn,
        dateBn,
        rawDate: parsedDate,
        branch: branchName,
        branchId: inc.branchId,
        paymentMethod: paymentMethodName,
        accountId: inc.accountId,
        isRecurring: Boolean(inc.isRecurring),
        recurringFrequency: inc.recurringFrequency || "monthly",
        attachmentName,
        receiptUrl,
        amount: Number(inc.amount) || 0,
        color: catColor,
        bgColor: inc.bgColor || bgColor,
        icon: catIcon,
        raw: inc,
      };
    });
  }, [incomesData, propIncomes, incomeCategories, branches, paymentMethods]);

  // Filtered Incomes
  const filteredIncomes = useMemo(() => {
    return normalizedIncomes.filter((inc) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        q === "" ||
        inc.voucherCode.toLowerCase().includes(q) ||
        inc.titleEn.toLowerCase().includes(q) ||
        inc.titleBn.toLowerCase().includes(q) ||
        inc.subtitleEn.toLowerCase().includes(q) ||
        inc.subtitleBn.toLowerCase().includes(q) ||
        inc.branch.toLowerCase().includes(q) ||
        String(inc.amount).includes(q);

      const matchCategory =
        tableCategoryFilter === "all" ||
        inc.categoryId === tableCategoryFilter ||
        inc.category?.id === tableCategoryFilter;

      const matchBranch =
        tableBranchFilter === "all" ||
        inc.branchId === tableBranchFilter ||
        inc.branch.toLowerCase() === tableBranchFilter.toLowerCase();

      return matchSearch && matchCategory && matchBranch;
    });
  }, [normalizedIncomes, searchQuery, tableCategoryFilter, tableBranchFilter]);

  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: isBangla ? "কপি করা হয়েছে" : "Copied to Clipboard",
      description: code,
    });
  };

  const handleDelete = (incId: string) => {
    deleteIncomeMutation(incId, {
      onSuccess: () => {
        toast({
          title: isBangla ? "ভাউচার মুছে ফেলা হয়েছে" : "Income Record Deleted",
          description: isBangla
            ? "রেকর্ড সফলভাবে অপসারণ করা হলো।"
            : "Income entry removed successfully.",
        });
        if (selectedIncome?.id === incId) {
          setSelectedIncome(null);
        }
        if (onDeleteIncome) {
          onDeleteIncome(incId);
        }
      },
      onError: (err: any) => {
        // Fallback local deletion if API fails or not supported
        if (onDeleteIncome) {
          onDeleteIncome(incId);
        }
        if (selectedIncome?.id === incId) {
          setSelectedIncome(null);
        }
        toast({
          title: isBangla ? "ভাউচার মুছে ফেলা হয়েছে" : "Income Record Deleted",
          description: err?.message || (isBangla ? "রেকর্ড অপসারণ করা হলো।" : "Income entry removed."),
        });
      },
    });
  };

  const handleOpenReceipt = (inc: any) => {
    if (inc.receiptUrl) {
      window.open(inc.receiptUrl, "_blank");
    } else {
      toast({
        title: isBangla ? "সংযুক্ত ফাইল" : "Attached Document",
        description: inc.attachmentName || undefined,
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[550px] items-stretch overflow-hidden gap-6">
      {/* -------------------------------------------------------------
          LEFT COLUMN: INCOMES LIST (50% When Split)
         ------------------------------------------------------------- */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out flex flex-col shrink-0 overflow-hidden",
          selectedIncome
            ? "w-0 h-0 min-h-0 opacity-0 pointer-events-none lg:w-1/2 lg:h-auto lg:min-h-0 lg:opacity-100 lg:pointer-events-auto"
            : "w-full opacity-100"
        )}
      >
        <div className="rounded-2xl border border-border/80 bg-card/95 shadow-sm backdrop-blur-sm overflow-hidden flex flex-col h-full flex-1">
          {/* List Header */}
          <div className="p-5 pb-4 border-b border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/10">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-bold text-foreground">
                  {isBangla
                    ? `আয়ের তালিকা (${toBnNum(filteredIncomes.length)})`
                    : `Income Records (${filteredIncomes.length})`}
                </h3>
                {isLoadingIncome && (
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-500 ml-1" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {isBangla
                  ? "বিস্তারিত দেখতে তালিকায় ক্লিক করুন"
                  : "Click any item to view full details"}
              </p>
            </div>

            {!selectedIncome && (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => window.print()}
                  className="h-8 text-xs rounded-xl gap-1.5 cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>{isBangla ? "প্রিন্ট" : "Print"}</span>
                </Button>
              </div>
            )}
          </div>

          {/* Search & Filter Bar */}
          <div className="p-3.5 bg-muted/5 border-b border-border/60 flex flex-col gap-2.5">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isBangla
                    ? "ভাউচার আইডি, বিবরণ, পরিমাণ দিয়ে খুঁজুন..."
                    : "Search voucher, note, amount..."
                }
                className="h-9 pl-9 text-xs bg-card border-border"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Select
                value={tableCategoryFilter}
                onValueChange={setTableCategoryFilter}
              >
                <SelectTrigger className="h-8 text-[11px] bg-card border-border">
                  <SelectValue
                    placeholder={
                      isBangla ? "সকল ক্যাটাগরি" : "All Categories"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">
                    {isBangla ? "সকল ক্যাটাগরি" : "All Categories"}
                  </SelectItem>
                  {incomeCategories?.map((c: any) => (
                    <SelectItem key={c.id} value={c.id}>
                      {isBangla ? c.nameBn || c.name : c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={tableBranchFilter}
                onValueChange={setTableBranchFilter}
              >
                <SelectTrigger className="h-8 text-[11px] bg-card border-border">
                  <SelectValue
                    placeholder={isBangla ? "সকল ব্রাঞ্চ" : "All Branches"}
                  />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">
                    {isBangla ? "সকল ব্রাঞ্চ" : "All Branches"}
                  </SelectItem>
                  {branches && branches.length > 0 ? (
                    branches.map((b: any) => (
                      <SelectItem key={b.id || b.name} value={b.id || b.name}>
                        {b.name}
                      </SelectItem>
                    ))
                  ) : (
                    <>
                      <SelectItem value="Main Branch">
                        {isBangla ? "প্রধান শাখা" : "Main Branch"}
                      </SelectItem>
                      <SelectItem value="Gulshan Store">
                        {isBangla ? "গুলশান স্টোর" : "Gulshan Store"}
                      </SelectItem>
                      <SelectItem value="Tejgaon Central Depot">
                        {isBangla ? "তেজগাঁও সেন্ট্রাল ডিপো" : "Tejgaon Central Depot"}
                      </SelectItem>
                      <SelectItem value="Uttara Branch">
                        {isBangla ? "উত্তরা শাখা" : "Uttara Branch"}
                      </SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table / List View */}
          <div className="overflow-x-auto flex-1">
            {isLoadingIncome ? (
              <div className="py-20 text-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mx-auto" />
                <p className="text-xs text-muted-foreground font-medium">
                  {isBangla ? "আয়ের তথ্য লোড হচ্ছে..." : "Loading income records..."}
                </p>
              </div>
            ) : filteredIncomes.length === 0 ? (
              <div className="py-16 text-center space-y-2">
                <Receipt className="h-10 w-10 text-muted-foreground/40 mx-auto" />
                <p className="text-sm font-semibold text-foreground">
                  {isBangla
                    ? "কোন আয়ের রেকর্ড নেই"
                    : "No Income Records Found"}
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/80 bg-muted/30 text-muted-foreground font-semibold text-[11px]">
                    <th className="py-3 px-3.5">
                      {isBangla ? "ভাউচার ও বিবরণ" : "Voucher & Item"}
                    </th>
                    {!selectedIncome && (
                      <>
                        <th className="py-3 px-3.5 whitespace-nowrap">
                          {isBangla ? "শাখা" : "Branch"}
                        </th>
                        <th className="py-3 px-3.5 whitespace-nowrap">
                          {isBangla ? "পদ্ধতি" : "Method"}
                        </th>
                        <th className="py-3 px-3.5 whitespace-nowrap">
                          {isBangla ? "সংযুক্তি" : "Attachment"}
                        </th>
                      </>
                    )}
                    <th className="py-3 px-3.5 text-right">
                      {isBangla ? "পরিমাণ" : "Amount"}
                    </th>
                    {!selectedIncome && (
                      <th className="py-3 px-3.5 text-right">
                        {isBangla ? "অ্যাকশন" : "Action"}
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredIncomes.map((inc) => {
                    const isSelected = selectedIncome?.id === inc.id;
                    const methodKey = inc.paymentMethod.toLowerCase();
                    const payInfo =
                      PAYMENT_METHOD_MAP[methodKey] || {
                        en: inc.paymentMethod,
                        bn: inc.paymentMethod,
                        badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                      };

                    return (
                      <tr
                        key={inc.id}
                        onClick={() => setSelectedIncome(inc)}
                        className={cn(
                          "hover:bg-muted/30 transition-colors cursor-pointer group",
                          isSelected
                            ? "bg-emerald-500/10 border-l-2 border-emerald-500"
                            : ""
                        )}
                      >
                        {/* Voucher & Description */}
                        <td className="py-3 px-3.5 align-middle">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={cn(
                                "p-2 rounded-xl shrink-0 border",
                                inc.bgColor
                              )}
                            >
                              {React.createElement(inc.icon, {
                                className: "h-4 w-4",
                              })}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="font-mono font-bold text-foreground text-xs leading-tight group-hover:text-emerald-400 transition-colors">
                                  {inc.voucherCode}
                                </p>
                                <span className="text-[10px] text-muted-foreground">
                                  • {isBangla ? inc.titleBn : inc.titleEn}
                                </span>
                              </div>
                              <p className="text-[11px] text-muted-foreground truncate max-w-[200px] mt-0.5">
                                {isBangla ? inc.subtitleBn : inc.subtitleEn}
                              </p>
                              <p className="text-[10px] text-muted-foreground/80 flex items-center gap-1 mt-0.5 font-mono">
                                <Clock className="h-2.5 w-2.5" />
                                <span>
                                  {isBangla ? inc.dateBn : inc.dateEn}
                                </span>
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Additional Full Width Columns when NOT Split */}
                        {!selectedIncome && (
                          <>
                            <td className="py-3 px-3.5 align-middle whitespace-nowrap">
                              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                                <Building2 className="h-3 w-3 text-muted-foreground/70" />
                                {inc.branch}
                              </span>
                            </td>

                            <td className="py-3 px-3.5 align-middle whitespace-nowrap">
                              <span
                                className={cn(
                                  "px-2 py-0.5 rounded text-[10px] font-medium border capitalize",
                                  payInfo.badgeColor
                                )}
                              >
                                {isBangla ? payInfo.bn : payInfo.en}
                              </span>
                            </td>

                            <td
                              className="py-3 px-3.5 align-middle whitespace-nowrap"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {inc.attachmentName ? (
                                <span
                                  className="inline-flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 cursor-pointer"
                                  onClick={() => handleOpenReceipt(inc)}
                                >
                                  <Paperclip className="h-3 w-3" />
                                  <span className="max-w-[85px] truncate">
                                    {inc.attachmentName}
                                  </span>
                                  {inc.receiptUrl && (
                                    <ExternalLink className="h-2.5 w-2.5 ml-0.5 opacity-70" />
                                  )}
                                </span>
                              ) : (
                                <span className="text-[11px] text-muted-foreground/60">
                                  —
                                </span>
                              )}
                            </td>
                          </>
                        )}

                        {/* Amount */}
                        <td className="py-3 px-3.5 align-middle text-right whitespace-nowrap">
                          <span className="font-mono font-bold text-emerald-400 text-xs">
                            {isBangla
                              ? `+৳${toBnNum(inc.amount.toLocaleString())}`
                              : `+৳${inc.amount.toLocaleString()}`}
                          </span>
                        </td>

                        {/* Actions (Only in Full-Width Mode) */}
                        {!selectedIncome && (
                          <td
                            className="py-3 px-3.5 align-middle text-right whitespace-nowrap"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-md cursor-pointer"
                                onClick={() => setSelectedIncome(inc)}
                                title={
                                  isBangla ? "বিস্তারিত দেখুন" : "View Details"
                                }
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={isDeleting}
                                className="h-7 w-7 text-muted-foreground hover:text-rose-400 rounded-md cursor-pointer"
                                onClick={() => handleDelete(inc.id)}
                                title={isBangla ? "মুছে ফেলুন" : "Delete"}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          RIGHT COLUMN: INCOME DETAILS & BREAKDOWN (50% Split View Panel)
         ------------------------------------------------------------- */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out flex flex-col overflow-hidden",
          selectedIncome
            ? "w-full opacity-100 lg:w-1/2 min-h-[500px]"
            : "w-0 h-0 min-h-0 opacity-0 pointer-events-none"
        )}
      >
        {selectedIncome && (
          <div className="rounded-2xl border border-border/80 bg-card/95 shadow-sm backdrop-blur-sm p-6 flex flex-col h-full flex-1 space-y-6">
            {/* Details Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border/80">
              <div className="flex items-center gap-3.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 h-9 w-9 p-0 flex items-center justify-center rounded-xl hover:bg-muted cursor-pointer"
                  onClick={() => setSelectedIncome(null)}
                  title={isBangla ? "তালিকায় ফিরে যান" : "Back to List"}
                >
                  <ChevronLeft className="h-5 w-5 text-foreground" />
                </Button>

                <div
                  className={cn(
                    "h-12 w-12 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0 border",
                    selectedIncome.bgColor
                  )}
                >
                  {React.createElement(selectedIncome.icon, {
                    className: "h-6 w-6",
                  })}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-foreground truncate">
                      {isBangla
                        ? selectedIncome.titleBn
                        : selectedIncome.titleEn}
                    </h2>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {isBangla ? "গৃহীত / আদায়কৃত" : "RECEIVED"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    {selectedIncome.voucherCode} •{" "}
                    {isBangla ? selectedIncome.dateBn : selectedIncome.dateEn}
                  </p>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => copyVoucherCode(selectedIncome.voucherCode)}
                  className="h-8.5 text-xs rounded-xl gap-1.5 cursor-pointer font-mono"
                >
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{selectedIncome.voucherCode}</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => window.print()}
                  className="h-8.5 text-xs rounded-xl gap-1.5 cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>{isBangla ? "প্রিন্ট" : "Print"}</span>
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedIncome(null)}
                  className="h-8.5 w-8.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Amount Highlight Card */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                  {isBangla ? "আয়কৃত মোট পরিমাণ" : "TOTAL RECEIVED REVENUE"}
                </p>
                <p className="text-3xl font-extrabold font-mono text-emerald-400 tracking-tight">
                  {isBangla
                    ? `+৳${toBnNum(selectedIncome.amount.toLocaleString())}.০০`
                    : `+৳${selectedIncome.amount.toLocaleString()}.00`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-card border border-border/80 text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{selectedIncome.branch}</span>
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-card border border-border/80 text-xs font-semibold text-foreground flex items-center gap-1.5 capitalize">
                  <CreditCard className="h-3.5 w-3.5 text-emerald-400" />
                  <span>
                    {PAYMENT_METHOD_MAP[selectedIncome.paymentMethod.toLowerCase()]?.[
                      isBangla ? "bn" : "en"
                    ] || selectedIncome.paymentMethod}
                  </span>
                </span>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Category */}
              <div className="p-3.5 rounded-xl border border-border/60 bg-muted/10 space-y-1">
                <p className="text-[11px] font-medium text-muted-foreground">
                  {isBangla ? "আয়ের খাত / ক্যাটাগরি" : "Income Category"}
                </p>
                <div className="flex items-center gap-2 pt-0.5">
                  <Tag className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="font-semibold text-foreground text-xs">
                    {isBangla
                      ? selectedIncome.titleBn
                      : selectedIncome.titleEn}
                  </span>
                </div>
              </div>

              {/* Transaction Date */}
              <div className="p-3.5 rounded-xl border border-border/60 bg-muted/10 space-y-1">
                <p className="text-[11px] font-medium text-muted-foreground">
                  {isBangla ? "লেনদেনের তারিখ" : "Transaction Date"}
                </p>
                <div className="flex items-center gap-2 pt-0.5">
                  <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="font-semibold text-foreground font-mono text-xs">
                    {isBangla ? selectedIncome.dateBn : selectedIncome.dateEn}
                  </span>
                </div>
              </div>

              {/* Branch */}
              <div className="p-3.5 rounded-xl border border-border/60 bg-muted/10 space-y-1">
                <p className="text-[11px] font-medium text-muted-foreground">
                  {isBangla ? "ব্রাঞ্চ / শাখা" : "Branch Location"}
                </p>
                <div className="flex items-center gap-2 pt-0.5">
                  <Building2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="font-semibold text-foreground text-xs">
                    {selectedIncome.branch}
                  </span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="p-3.5 rounded-xl border border-border/60 bg-muted/10 space-y-1">
                <p className="text-[11px] font-medium text-muted-foreground">
                  {isBangla ? "পেমেন্ট মাধ্যম" : "Payment Method"}
                </p>
                <div className="flex items-center gap-2 pt-0.5">
                  <CreditCard className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="font-semibold text-foreground capitalize text-xs">
                    {PAYMENT_METHOD_MAP[selectedIncome.paymentMethod.toLowerCase()]?.[
                      isBangla ? "bn" : "en"
                    ] || selectedIncome.paymentMethod}
                  </span>
                </div>
              </div>
            </div>

            {/* Income Note / Description */}
            <div className="p-4 rounded-xl border border-border/60 bg-muted/10 space-y-1.5 text-xs">
              <p className="text-[11px] font-medium text-muted-foreground">
                {isBangla ? "ভাউচার নোট / বিবরণ" : "Income Note / Description"}
              </p>
              <p className="text-xs text-foreground leading-relaxed font-medium">
                {isBangla
                  ? selectedIncome.subtitleBn
                  : selectedIncome.subtitleEn}
              </p>
            </div>

            {/* Recurrence Status */}
            <div className="p-4 rounded-xl border border-border/60 bg-muted/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <RefreshCw className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {isBangla ? "নিয়মিত আয় স্ট্যাটাস" : "Recurring Revenue"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {selectedIncome.isRecurring
                      ? isBangla
                        ? `নিয়মিত পুনরাবৃত্তিমূলক (${
                            selectedIncome.recurringFrequency || "মাসিক"
                          })`
                        : `Repeats automatically (${
                            selectedIncome.recurringFrequency || "Monthly"
                          })`
                      : isBangla
                      ? "এককালীন আয় (নিয়মিত নয়)"
                      : "One-time receipt (Not recurring)"}
                  </p>
                </div>
              </div>
              <span
                className={cn(
                  "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border",
                  selectedIncome.isRecurring
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                    : "bg-muted text-muted-foreground border-border"
                )}
              >
                {selectedIncome.isRecurring
                  ? isBangla
                    ? "সক্রিয়"
                    : "Active"
                  : isBangla
                  ? "নিষ্ক্রিয়"
                  : "Inactive"}
              </span>
            </div>

            {/* Attached File Viewer */}
            {selectedIncome.attachmentName && (
              <div className="p-4 rounded-xl border border-border/60 bg-muted/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Paperclip className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate max-w-[200px]">
                      {selectedIncome.attachmentName}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {isBangla
                        ? "সংযুক্ত ভাউচার / চালানের স্ক্যান কপি"
                        : "Attached voucher / receipt document"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenReceipt(selectedIncome)}
                  className="h-8 text-xs rounded-xl cursor-pointer gap-1"
                >
                  <span>{isBangla ? "দেখুন" : "View File"}</span>
                  {selectedIncome.receiptUrl && (
                    <ExternalLink className="h-3 w-3" />
                  )}
                </Button>
              </div>
            )}

            {/* Panel Footer Actions */}
            <div className="flex items-center justify-between pt-5 border-t border-border/80 mt-auto">
              <Button
                variant="destructive"
                size="sm"
                disabled={isDeleting}
                onClick={() => handleDelete(selectedIncome.id)}
                className="h-8.5 text-xs rounded-xl gap-1.5 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>{isBangla ? "মুছে ফেলুন" : "Delete Voucher"}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedIncome(null)}
                className="text-xs rounded-xl px-5 h-8.5 cursor-pointer"
              >
                {isBangla ? "বন্ধ করুন" : "Close"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

