"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetWarehouses } from "@/hooks/api/useWarehouse";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { ChevronRight } from "lucide-react";
import {
  MOCK_TRANSFERS,
  Warehouse,
  WarehouseTransfer,
} from "@/components/warehouse/WarehouseMockData";
import { WarehouseHeader } from "@/components/warehouse/WarehouseHeader";
import { WarehouseKpiCards } from "@/components/warehouse/WarehouseKpiCards";
import { WarehouseListTable } from "@/components/warehouse/WarehouseListTable";
import { WarehouseDetailsModal } from "@/components/warehouse/WarehouseDetailsModal";
import { StockTransferTable } from "@/components/warehouse/StockTransferTable";
import { NewWarehouseModal } from "@/components/warehouse/NewWarehouseModal";
import { EditWarehouseModal } from "@/components/warehouse/EditWarehouseModal";
import { toast } from "sonner";

export default function WarehouseOverviewPage() {
  const { isBangla } = useAppTranslation();
  const router = useRouter();

  // API Hook
  const { data: warehouses, isLoading: isWarehousesLoading } = useGetWarehouses();

  // State Management
  const [transfers, setTransfers] = useState<WarehouseTransfer[]>(MOCK_TRANSFERS);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("all");

  // Details Modal State
  const [modalWarehouse, setModalWarehouse] = useState<Warehouse | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Modal State
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);

  // Branch Filtered Warehouses
  const displayedWarehouses = selectedBranchId === "all"
    ? warehouses
    : warehouses.filter((w) => w.branchId === selectedBranchId);


  const handleOpenNewModal = () => {
    setIsNewModalOpen(true);
  };
  // CSV Export Helper
  const handleExportCsv = () => {
    const headers = ["Name", "Code", "Type", "Branch", "Manager", "City", "Status", "Stock Value", "Available Units"];
    const rows = warehouses.map((w) => [
      `"${w.name}"`,
      `"${w.code}"`,
      `"${w.type}"`,
      `"${w.branchName}"`,
      `"${w.managerName}"`,
      `"${w.city}"`,
      `"${w.status}"`,
      w.stockValue,
      w.totalStockUnits,
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

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };
  return (
    <div className="space-y-5 pb-12">
      {/* 1. Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>{isBangla ? "ইনভেন্টরি" : "Inventory"}</span>
          <ChevronRight className="h-3 w-3" />
          <span>{isBangla ? "ওয়্যারহাউস" : "Warehouse"}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-semibold">
            {isBangla ? "ওভারভিউ" : "Overview"}
          </span>
        </nav>
      </div>

      {/* 2. Compact Header with Switchers & Overflow Action Menu */}
      <WarehouseHeader
        warehouses={warehouses}
        selectedWarehouse={selectedWarehouse}
        selectedBranchId={selectedBranchId}
        onSelectBranch={setSelectedBranchId}
        onSelectWarehouse={setSelectedWarehouse}
        onOpenNewModal={handleOpenNewModal}
        onOpenEditModal={handleOpenEditModal}
        onNavigateTransfer={() => router.push("/inventory/warehouse/transfers/new")}
        onExportCsv={handleExportCsv}
        onImportModal={() => toast.info(isBangla ? "CSV ইম্পোর্ট মডিউল..." : "Opening CSV import wizard...")}
        isBangla={isBangla}
      />

      {/* 3. 5 Operational Summary KPI Cards */}
      <WarehouseKpiCards
        warehouses={displayedWarehouses}
        transfers={transfers}
        isBangla={isBangla}
      />

      {/* 4. Warehouse List Table with Row Navigation */}
      <WarehouseListTable
        warehouses={displayedWarehouses}
        isBangla={isBangla}
        onOpenNewModal={handleOpenNewModal}
      />

      {/* 5. Recent Stock Transfers Log */}
      <StockTransferTable
        transfers={transfers}
        onNavigateNewTransfer={() => router.push("/inventory/warehouse/transfers/new")}
        onNavigateAllTransfers={() => router.push("/inventory/warehouse/transfers")}
        isBangla={isBangla}
      />

 

      {/* WAREHOUSE DETAILS MODAL */}
      <WarehouseDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        warehouse={modalWarehouse}
        onEdit={handleOpenEditModal}
        onTransfer={() => router.push("/inventory/warehouse/transfers/new")}
        isBangla={isBangla}
      />

      {/* NEW WAREHOUSE MODAL */}
      <NewWarehouseModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        isBangla={isBangla}
      />

      {/* EDIT WAREHOUSE MODAL */}
      <EditWarehouseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        warehouse={editingWarehouse}
        isBangla={isBangla}
      />

      <EditWarehouseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        warehouse={editingWarehouse}
        isBangla={isBangla}
      />
    </div>
  );
}
