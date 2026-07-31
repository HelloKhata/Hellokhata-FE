"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { ChevronRight } from "lucide-react";
import {
  MOCK_WAREHOUSES,
  MOCK_TRANSFERS,
  MOCK_ALERTS,
  MOCK_ACTIVITIES,
  Warehouse,
  WarehouseTransfer,
} from "@/components/warehouse/WarehouseMockData";
import { WarehouseHeader } from "@/components/warehouse/WarehouseHeader";
import { WarehouseKpiCards } from "@/components/warehouse/WarehouseKpiCards";
import { WarehouseListTable } from "@/components/warehouse/WarehouseListTable";
import { WarehouseDetailsModal } from "@/components/warehouse/WarehouseDetailsModal";
import { StockTransferTable } from "@/components/warehouse/StockTransferTable";
import { WarehouseActivitiesAndAlerts } from "@/components/warehouse/WarehouseActivitiesAndAlerts";
import { NewWarehouseModal } from "@/components/warehouse/NewWarehouseModal";
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
import { toast } from "sonner";

export default function WarehouseOverviewPage() {
  const { isBangla } = useAppTranslation();
  const router = useRouter();

  // State Management
  const [warehouses, setWarehouses] = useState<Warehouse[]>(MOCK_WAREHOUSES);
  const [transfers, setTransfers] = useState<WarehouseTransfer[]>(MOCK_TRANSFERS);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("all");

  // Details Modal State
  const [modalWarehouse, setModalWarehouse] = useState<Warehouse | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);

  // Delete Dialog State
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Branch Filtered Warehouses
  const displayedWarehouses = selectedBranchId === "all"
    ? warehouses
    : warehouses.filter((w) => w.branchId === selectedBranchId);

  // Handlers
  const handleOpenWarehouseDetails = (wh: Warehouse) => {
    setModalWarehouse(wh);
    setIsDetailsModalOpen(true);
  };

  const handleOpenNewModal = () => {
    setEditingWarehouse(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (wh: Warehouse) => {
    setEditingWarehouse(wh);
    setIsModalOpen(true);
  };

  const handleSaveWarehouse = (whData: Partial<Warehouse>) => {
    if (editingWarehouse) {
      setWarehouses((prev) =>
        prev.map((w) => (w.id === editingWarehouse.id ? ({ ...w, ...whData } as Warehouse) : w))
      );
      if (selectedWarehouse && selectedWarehouse.id === editingWarehouse.id) {
        setSelectedWarehouse((prev) => (prev ? ({ ...prev, ...whData } as Warehouse) : null));
      }
    } else {
      const newWh: Warehouse = {
        id: `wh-${Date.now()}`,
        name: whData.name || "New Warehouse",
        code: whData.code || "WH-NEW",
        type: whData.type || "Central Warehouse",
        branchId: whData.branchId || "b1",
        branchName: whData.branchName || "Dhaka Central HQ",
        managerName: whData.managerName || "Unassigned",
        managerPhone: whData.managerPhone || "N/A",
        managerEmail: whData.managerEmail || "N/A",
        address: whData.address || "Main City Zone",
        city: whData.city || "Dhaka",
        postalCode: whData.postalCode || "1200",
        country: whData.country || "Bangladesh",
        description: whData.description || "",
        notes: whData.notes || "",
        status: whData.status || "active",
        capacityMax: whData.capacityMax || 20000,
        capacityUsed: whData.capacityUsed || 0,
        storageUnit: whData.storageUnit || "pallets",
        productsCount: 0,
        stockValue: 0,
        totalStockUnits: 0,
        availableUnits: 0,
        reservedUnits: 0,
        config: whData.config || {
          allowSales: true,
          allowPurchase: true,
          allowTransfers: true,
          isDefault: false,
          trackCapacity: true,
          trackTemperature: false,
          allowNegativeStock: false,
          barcodeEnabled: true,
          batchTracking: true,
          expiryTracking: true,
          serialTracking: false,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setWarehouses((prev) => [newWh, ...prev]);
    }
  };

  const handleDeleteWarehouse = (id: string) => {
    setDeleteTargetId(id);
  };

  const confirmDeleteWarehouse = () => {
    if (!deleteTargetId) return;
    setWarehouses((prev) => prev.filter((w) => w.id !== deleteTargetId));
    if (selectedWarehouse && selectedWarehouse.id === deleteTargetId) {
      setSelectedWarehouse(null);
    }
    toast.success(isBangla ? "ওয়্যারহাউস সফলভাবে মুছে ফেলা হয়েছে!" : "Warehouse deleted successfully!");
    setDeleteTargetId(null);
  };

  // Bulk Actions
  const handleBulkDelete = (ids: string[]) => {
    setWarehouses((prev) => prev.filter((w) => !ids.includes(w.id)));
    toast.success(
      isBangla
        ? `${ids.length}টি ওয়্যারহাউস সফলভাবে মুছে ফেলা হয়েছে!`
        : `${ids.length} warehouses deleted successfully!`
    );
  };

  const handleBulkStatusChange = (ids: string[], status: "active" | "inactive" | "maintenance") => {
    setWarehouses((prev) =>
      prev.map((w) => (ids.includes(w.id) ? { ...w, status } : w))
    );
    toast.success(
      isBangla
        ? `${ids.length}টি ওয়্যারহাউসের স্ট্যাটাস '${status}' আপডেট করা হয়েছে!`
        : `Updated status to '${status}' for ${ids.length} warehouses!`
    );
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

      {/* 4. Warehouse List Table with Row Dialog Modal & Bulk Actions */}
      <WarehouseListTable
        warehouses={displayedWarehouses}
        onSelectWarehouse={handleOpenWarehouseDetails}
        onEditWarehouse={handleOpenEditModal}
        onDeleteWarehouse={handleDeleteWarehouse}
        onBulkDelete={handleBulkDelete}
        onBulkStatusChange={handleBulkStatusChange}
        onNavigateTransfer={() => router.push("/inventory/warehouse/transfers/new")}
        onExportCsv={handleExportCsv}
        isBangla={isBangla}
      />

      {/* 5. Recent Stock Transfers Log */}
      <StockTransferTable
        transfers={transfers}
        onNavigateNewTransfer={() => router.push("/inventory/warehouse/transfers/new")}
        onNavigateAllTransfers={() => router.push("/inventory/warehouse/transfers")}
        isBangla={isBangla}
      />

      {/* 6. Warehouse Alerts + Activity (Dual Filterable Panels) */}
      <WarehouseActivitiesAndAlerts
        alerts={MOCK_ALERTS}
        activities={MOCK_ACTIVITIES}
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

      {/* NEW/EDIT WAREHOUSE MODAL */}
      <NewWarehouseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveWarehouse}
        editingWarehouse={editingWarehouse}
        isBangla={isBangla}
      />

      {/* DELETE CONFIRMATION DIALOG */}
      <AlertDialog open={!!deleteTargetId} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <AlertDialogContent className="bg-card border-border shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-foreground">
              {isBangla ? "ওয়্যারহাউসটি মুছে ফেলতে চান?" : "Delete Warehouse?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground">
              {isBangla
                ? "এই ওয়্যারহাউসটি মুছে ফেললে এর রেকর্ড ও কনফিগারেশন রিমুভ হবে। এই কাজটি অপরিবর্তনীয়।"
                : "This will remove the warehouse record and its configuration from the system. This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs font-semibold cursor-pointer">
              {isBangla ? "বাতিল" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteWarehouse}
              className="text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
            >
              {isBangla ? "হ্যাঁ, মুছে ফেলুন" : "Delete Warehouse"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
