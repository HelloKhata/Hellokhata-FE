"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Building2,
  Search,
  ArrowRightLeft,
  Edit,
  Eye,
  Trash2,
  CheckCircle2,
  Wrench,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Archive,
  CheckSquare,
  MoreHorizontal,
} from "lucide-react";
import { Warehouse, MOCK_BRANCHES } from "./WarehouseMockData";
import { EditWarehouseModal } from "./EditWarehouseModal";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface WarehouseListTableProps {
  warehouses: Warehouse[];
  isBangla?: boolean;
  onOpenNewModal?: () => void;
}

export function WarehouseListTable({
  warehouses,
  isBangla = false,
  onOpenNewModal,
}: WarehouseListTableProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const itemsPerPage = 5;

  const handleBulkDelete = (ids: string[]) => {
    toast.success(
      isBangla
        ? `${ids.length}টি ওয়্যারহাউস সফলভাবে মুছে ফেলা হয়েছে!`
        : `${ids.length} warehouses deleted successfully!`
    );
    setSelectedIds([]);
  };

  const handleBulkStatusChange = (ids: string[], status: "active" | "inactive" | "maintenance") => {
    toast.success(
      isBangla
        ? `${ids.length}টি ওয়্যারহাউসের স্ট্যাটাস '${status}' আপডেট করা হয়েছে!`
        : `Updated status to '${status}' for ${ids.length} warehouses!`
    );
    setSelectedIds([]);
  };

  const handleExportCsv = () => {
    const headers = ["Name", "Code", "Type", "Branch", "Manager", "City", "Status", "Stock Value", "Available Units"];
    const rows = warehouses.map((w) => [
      `"${w.name}"`,
      `"${w.code}"`,
      `"${w.type || ''}"`,
      `"${w.branchName}"`,
      `"${w.managerName}"`,
      `"${w.city}"`,
      `"${w.status}"`,
      w.stockValue,
      w.totalStockUnits || 0,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Hellokhata_Warehouses_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(isBangla ? "ওয়্যারহাউস ডেটা CSV ফাইল হিসাবে এক্সপোর্ট হয়েছে!" : "Warehouses exported to CSV file!");
  };

  const filteredWarehouses = useMemo(() => {
    return warehouses?.filter((wh) => {
      const matchesSearch =
        wh.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wh.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wh.managerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wh.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesBranch = branchFilter === "all" || wh.branchId === branchFilter;
      const matchesStatus = statusFilter === "all" || wh.status === statusFilter;

      return matchesSearch && matchesBranch && matchesStatus;
    });
  }, [warehouses, searchQuery, branchFilter, statusFilter]);

  const totalPages = Math.ceil(filteredWarehouses?.length / itemsPerPage) || 1;
  const paginatedWarehouses = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredWarehouses?.slice(start, start + itemsPerPage);
  }, [filteredWarehouses, currentPage]);

  const allOnPageSelected =
    paginatedWarehouses?.length > 0 &&
    paginatedWarehouses?.every((wh) => selectedIds?.includes(wh.id));

  const toggleSelectAll = () => {
    if (allOnPageSelected) {
      const pageIds = paginatedWarehouses?.map((w) => w?.id);
      setSelectedIds((prev) => prev.filter((id) => !pageIds?.includes(id)));
    } else {
      const pageIds = paginatedWarehouses?.map((w) => w.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold px-2 py-0">
            <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
            {isBangla ? "সক্রিয়" : "Active"}
          </Badge>
        );
      case "maintenance":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-semibold px-2 py-0">
            <Wrench className="h-2.5 w-2.5 mr-1" />
            {isBangla ? "রক্ষণাবেক্ষণ" : "Maintenance"}
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[10px] font-semibold px-2 py-0">
            <AlertCircle className="h-2.5 w-2.5 mr-1" />
            {isBangla ? "নিষ্ক্রিয়" : "Inactive"}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="border border-border/80 shadow-xs bg-card">
      <CardHeader className="p-3.5 py-1 border-b border-border/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <CardTitle className="text-sm font-bold text-foreground">
            {isBangla ? "ওয়্যারহাউস তালিকা" : "Warehouses List"}
          </CardTitle>
        </div>

        {/* Bulk Action Bar if items selected */}
        {selectedIds.length > 0 ? (
          <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/30 p-1 px-2.5 rounded-lg text-xs animate-in fade-in">
            <span className="font-bold font-mono text-primary mr-1">
              {selectedIds.length} Selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleBulkStatusChange(selectedIds, "active")}
              className="h-7 text-[11px] font-semibold text-emerald-600 hover:bg-emerald-500/10 cursor-pointer"
            >
              <CheckSquare className="h-3 w-3 mr-1" />
              Activate
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleBulkStatusChange(selectedIds, "inactive")}
              className="h-7 text-[11px] font-semibold text-amber-600 hover:bg-amber-500/10 cursor-pointer"
            >
              <Archive className="h-3 w-3 mr-1" />
              Archive
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleBulkDelete(selectedIds)}
              className="h-7 text-[11px] font-semibold text-rose-600 hover:bg-rose-500/10 cursor-pointer"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
          </div>
        ) : (
          /* Export Button */
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            className="h-7.5 text-xs font-semibold gap-1.5 cursor-pointer border-border/80"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{isBangla ? "এক্সপোর্ট CSV" : "Export CSV"}</span>
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-3.5 py-1 space-y-3">
        {/* Search & Filter Controls Grid */}
        <div className="">
          {/* Search Input (By Name or Code) */}
          <div className="relative lg:col-span-2 w-1/2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={isBangla ? "ওয়্যারহাউস কোড বা নাম দিয়ে খুঁজুন..." : "Search by code, warehouse name, location..."}
              className="pl-8 text-xs h-8 bg-background/50 border-input"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto border border-border/60 rounded-xl">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-muted/40 text-muted-foreground border-b border-border/80 font-semibold uppercase text-[10px]">
                <th className="p-3 w-10 text-center">
                  <Checkbox
                    checked={allOnPageSelected}
                    onCheckedChange={toggleSelectAll}
                  />
                </th>
                <th className="p-3 font-semibold">{isBangla ? "ওয়্যারহাউস ও কোড" : "Warehouse & Code"}</th>
                <th className="p-3 font-semibold">{isBangla ? "অবস্থান" : "Location"}</th>
                <th className="p-3 font-semibold">{isBangla ? "ম্যানেজার" : "Manager"}</th>
                <th className="p-3 font-semibold text-right">{isBangla ? "প্রাপ্য স্টক" : "Available Items"}</th>
                <th className="p-3 font-semibold text-right">{isBangla ? "স্টক মূল্য" : "Stock Value"}</th>
                <th className="p-3 font-semibold">{isBangla ? "স্ট্যাটাস" : "Status"}</th>
                <th className="p-3 font-semibold text-right">{isBangla ? "অ্যাকশন" : "Actions"}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/40">
              {paginatedWarehouses?.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted-foreground space-y-3">
                    <Building2 className="h-8 w-8 text-muted-foreground/40 mx-auto" />
                    <p className="font-semibold text-foreground text-xs">
                      {isBangla ? "কোনো ওয়্যারহাউস পাওয়া যায়নি" : "No Warehouses Found"}
                    </p>
                    {onOpenNewModal && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onOpenNewModal}
                        className="mt-2 h-8 text-xs font-semibold cursor-pointer"
                      >
                        {isBangla ? "নতুন ওয়্যারহাউস যোগ করুন" : "Create Warehouse"}
                      </Button>
                    )}
                  </td>
                </tr>
              ) : (
                paginatedWarehouses?.map((wh) => {
                  const isSelected = selectedIds.includes(wh.id);

                  return (
                    <tr
                      key={wh.id}
                      onClick={() => router.push(`/inventory/warehouse/${wh.id}`)}
                      className={`hover:bg-muted/30 transition-colors cursor-pointer ${
                        isSelected ? "bg-primary/5" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() =>
                            setSelectedIds((prev) =>
                              prev.includes(wh.id)
                                ? prev.filter((i) => i !== wh.id)
                                : [...prev, wh.id]
                            )
                          }
                        />
                      </td>

                      {/* Name & Code */}
                      <td className="p-3">
                        <div>
                          <p className="font-bold text-foreground hover:text-primary transition-colors text-xs">
                            {wh.name}
                          </p>
                          <Badge variant="outline" className="text-[9px] py-0 font-mono bg-muted text-muted-foreground mt-0.5">
                            {wh.code}
                          </Badge>
                        </div>
                      </td>

                      {/* Location (City, Branch) */}
                      <td className="p-3 text-muted-foreground font-medium text-[11px]">
                        {wh.city}, {wh.branchName}
                      </td>

                      {/* Manager */}
                      <td className="p-3 font-medium text-foreground">
                        {wh.managerName}
                      </td>

                      {/* Available Qty */}
                      <td className="p-3 text-right font-bold font-mono text-foreground">
                        {(wh.availableUnits || wh?.totalStockUnits)?.toLocaleString()}
                      </td>

                      {/* Stock Value */}
                      <td className="p-3 text-right font-bold font-mono text-emerald-600 dark:text-emerald-400">
                        ৳{wh?.stockValue?.toLocaleString("en-IN")}
                      </td>

                      {/* Status */}
                      <td className="p-3">
                        {getStatusBadge(wh.status)}
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push("/inventory/warehouse/transfers/new")}
                            className="h-7 text-xs px-2 font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 cursor-pointer gap-1"
                            title={isBangla ? "স্টক ট্রান্সফার" : "Transfer"}
                          >
                            <ArrowRightLeft className="h-3.5 w-3.5" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer">
                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-36">
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditingWarehouse(wh);
                                }}
                                className="cursor-pointer gap-2"
                              >
                                <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>{isBangla ? "এডিট করুন" : "Edit"}</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  toast.success(isBangla ? "ওয়্যারহাউস মুছে ফেলা হয়েছে!" : "Warehouse deleted successfully!");
                                }}
                                className="cursor-pointer gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>{isBangla ? "মুছে ফেলুন" : "Delete"}</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Integrated Compact Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
          <p className="text-[11px] text-muted-foreground font-medium">
            {isBangla
              ? `${filteredWarehouses?.length}টির মধ্যে ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                  currentPage * itemsPerPage,
                  filteredWarehouses?.length
                )} দেখাচ্ছে`
              : `Showing ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                  currentPage * itemsPerPage,
                  filteredWarehouses?.length
                )} of ${filteredWarehouses?.length} warehouses`}
          </p>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="h-7 text-xs font-semibold cursor-pointer px-2"
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-0.5" />
              {isBangla ? "আগেরটি" : "Prev"}
            </Button>

            <span className="text-xs font-mono px-2 font-bold text-foreground">
              {currentPage} / {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="h-7 text-xs font-semibold cursor-pointer px-2"
            >
              {isBangla ? "পরেরটি" : "Next"}
              <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
            </Button>
          </div>
        </div>
      </CardContent>

      {editingWarehouse && (
        <EditWarehouseModal
          isOpen={!!editingWarehouse}
          onClose={() => setEditingWarehouse(null)}
          warehouse={editingWarehouse}
          isBangla={isBangla}
        />
      )}
    </Card>
  );
}
