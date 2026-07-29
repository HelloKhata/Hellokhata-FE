"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Building2,
  ArrowRightLeft,
  Eye,
  Plus,
  ChevronRight,
  ChevronLeft,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  FilterX,
} from "lucide-react";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { MOCK_TRANSFERS, MOCK_BRANCHES } from "@/components/warehouse/WarehouseMockData";

export function TransferHistoryPage() {
  const { isBangla } = useAppTranslation();
  const router = useRouter();

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [destinationFilter, setDestinationFilter] = useState("all");
  const [page, setPage] = useState(1);

  // Filtered dataset
  const filteredTransfers = useMemo(() => {
    return MOCK_TRANSFERS.filter((trf) => {
      const matchesSearch =
        !searchQuery ||
        trf.transferNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trf.destinationBranch.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || trf.status === statusFilter;
      const matchesSource = sourceFilter === "all" || trf.sourceBranch === sourceFilter;
      const matchesDest = destinationFilter === "all" || trf.destinationBranch === destinationFilter;

      return matchesSearch && matchesStatus && matchesSource && matchesDest;
    });
  }, [searchQuery, statusFilter, sourceFilter, destinationFilter]);

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            {isBangla ? "সম্পন্ন" : "Completed"}
          </Badge>
        );
      case "in_transit":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[10px] font-semibold">
            <Clock className="h-3 w-3 mr-1" />
            {isBangla ? "চলমান (In Transit)" : "In Transit"}
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-semibold">
            <Clock className="h-3 w-3 mr-1" />
            {isBangla ? "অপেক্ষমান" : "Pending"}
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[10px] font-semibold">
            <XCircle className="h-3 w-3 mr-1" />
            {isBangla ? "বাতিল" : "Cancelled"}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[10px] font-semibold">
            {status}
          </Badge>
        );
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSourceFilter("all");
    setDestinationFilter("all");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div className="space-y-1">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>{isBangla ? "ইনভেন্টরি" : "Inventory"}</span>
            <ChevronRight className="h-3 w-3" />
            <span>{isBangla ? "ওয়্যারহাউস" : "Warehouse"}</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-semibold">{isBangla ? "ট্রান্সফার হিস্ট্রি" : "Transfer History"}</span>
          </nav>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ArrowRightLeft className="h-6 w-6 text-primary" />
            <span>{isBangla ? "স্টক ট্রান্সফার হিস্ট্রি" : "Stock Transfer History"}</span>
          </h1>
        </div>

        <Button
          onClick={() => router.push("/inventory/warehouse/transfers/new")}
          className="h-9 text-xs font-bold gap-1.5 cursor-pointer shadow-xs shrink-0"
        >
          <Plus className="h-4 w-4" />
          {isBangla ? "নতুন ট্রান্সফার" : "Create Transfer"}
        </Button>
      </div>

      {/* Top Toolbar: Search + Status Filter + Source + Destination + Date Range */}
      <div className="space-y-3 p-4 bg-card border border-border/60 rounded-xl shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {/* Search Input */}
          <div className="relative col-span-1 sm:col-span-2 lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={isBangla ? "ট্রান্সফার আইডি বা গন্তব্য খুঁজুন..." : "Search Transfer ID or destination..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs bg-background border-input"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 text-xs bg-background border-input">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">{isBangla ? "সব স্ট্যাটাস" : "All Statuses"}</SelectItem>
              <SelectItem value="completed" className="text-xs">{isBangla ? "সম্পন্ন" : "Completed"}</SelectItem>
              <SelectItem value="in_transit" className="text-xs">{isBangla ? "চলমান" : "In Transit"}</SelectItem>
              <SelectItem value="pending" className="text-xs">{isBangla ? "অপেক্ষমান" : "Pending"}</SelectItem>
              <SelectItem value="cancelled" className="text-xs">{isBangla ? "বাতিল" : "Cancelled"}</SelectItem>
            </SelectContent>
          </Select>

          {/* Destination Branch Filter */}
          <Select value={destinationFilter} onValueChange={setDestinationFilter}>
            <SelectTrigger className="h-9 text-xs bg-background border-input">
              <Building2 className="h-3.5 w-3.5 mr-1 text-muted-foreground shrink-0" />
              <SelectValue placeholder="Destination" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">{isBangla ? "সব গন্তব্য" : "All Destinations"}</SelectItem>
              {MOCK_BRANCHES.filter((b) => !b.isWarehouse).map((b) => (
                <SelectItem key={b.id} value={b.name} className="text-xs">
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Range Selector */}
          <Button variant="outline" className="h-9 text-xs font-normal justify-between bg-background border-input">
            <span className="truncate">{isBangla ? "তারিখ সীমা" : "Date Range"}</span>
            <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          </Button>
        </div>
      </div>

      {/* Responsive Table */}
      <Card className="border border-border/60 shadow-xs">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-muted/40 text-muted-foreground border-b border-border/60 font-semibold uppercase text-[11px]">
                  <th className="p-3.5">{isBangla ? "ট্রান্সফার আইডি" : "Transfer ID"}</th>
                  <th className="p-3.5">{isBangla ? "তারিখ" : "Date"}</th>
                  <th className="p-3.5">{isBangla ? "উৎস শাখা" : "Source"}</th>
                  <th className="p-3.5">{isBangla ? "গন্তব্য শাখা" : "Destination"}</th>
                  <th className="p-3.5 text-center">{isBangla ? "আইটেম সংখ্যা" : "Items"}</th>
                  <th className="p-3.5">{isBangla ? "স্ট্যাটাস" : "Status"}</th>
                  <th className="p-3.5 text-right">{isBangla ? "অ্যাকশন" : "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredTransfers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-muted-foreground space-y-3">
                      <FilterX className="h-10 w-10 mx-auto opacity-50 text-muted-foreground" />
                      <p className="text-sm font-semibold">{isBangla ? "কোনো ট্রান্সফার পাওয়া যায়নি" : "No transfers match criteria"}</p>
                      <Button variant="outline" size="sm" onClick={handleResetFilters} className="h-8 text-xs cursor-pointer">
                        {isBangla ? "ফিল্টার রিসেট করুন" : "Reset Filters"}
                      </Button>
                    </td>
                  </tr>
                ) : (
                  filteredTransfers.map((trf) => (
                    <tr key={trf.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-foreground">
                        {trf.transferNo}
                      </td>
                      <td className="p-3.5 text-muted-foreground font-mono">
                        {new Date(trf.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="p-3.5 font-medium text-foreground">
                        {trf.sourceBranch}
                      </td>
                      <td className="p-3.5 font-medium text-foreground">
                        {trf.destinationBranch}
                      </td>
                      <td className="p-3.5 text-center font-mono font-bold text-foreground">
                        {trf.totalItems} {isBangla ? "টি" : "Items"}
                      </td>
                      <td className="p-3.5">
                        {renderStatusBadge(trf.status)}
                      </td>
                      <td className="p-3.5 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/inventory/warehouse/transfers/${trf.id}`)}
                          className="h-7 text-xs font-semibold gap-1 text-primary hover:bg-primary/10 cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          {isBangla ? "বিবরণ" : "Details"}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Placeholder */}
          <div className="p-4 border-t border-border/40 flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-mono">
              Showing 1-4 of 48 transfers
            </span>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled className="h-8 text-xs gap-1">
                <ChevronLeft className="h-3.5 w-3.5" />
                {isBangla ? "আগের" : "Previous"}
              </Button>
              <span className="font-mono font-semibold px-2">1 / 5</span>
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1 cursor-pointer">
                {isBangla ? "পরের" : "Next"}
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TransferHistoryPage;
