"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/common";
import { Warehouse } from "./WarehouseMockData";

interface WarehouseHeaderProps {
  warehouses: Warehouse[];
  selectedWarehouse: Warehouse | null;
  selectedBranchId: string;
  onSelectBranch: (branchId: string) => void;
  onSelectWarehouse: (warehouse: Warehouse | null) => void;
  onOpenNewModal: () => void;
  onOpenEditModal: (warehouse: Warehouse) => void;
  onNavigateTransfer: () => void;
  onExportCsv?: () => void;
  onImportModal?: () => void;
  isBangla?: boolean;
}

export function WarehouseHeader({
  warehouses,
  selectedWarehouse,
  selectedBranchId,
  onOpenNewModal,
  onOpenEditModal,
  onNavigateTransfer,
  onExportCsv,
  onImportModal,
  isBangla = false,
}: WarehouseHeaderProps) {
  return (
    <PageHeader
      breadcrumbs={[
        { label: "Inventory", labelBn: "ইনভেন্টরি", href: "/inventory" },
        { label: "Warehouse", labelBn: "ওয়্যারহাউস", href: "/inventory/warehouse" },
        { label: "Overview", labelBn: "ওভারভিউ" },
      ]}
      title="Warehouse Overview"
      titleBn="ওয়্যারহাউস ওভারভিউ"
      subtitle="Manage warehouse locations, capacity, and stock transfers"
      subtitleBn="ওয়্যারহাউস লোকেশন, ধারণক্ষমতা এবং স্টক পরিচালনা করুন"
      fallbackHref="/inventory"
      actions={
        <Button
          type="button"
          onClick={onOpenNewModal}
          className="h-8.5 text-xs font-bold gap-1.5 cursor-pointer shadow-xs bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{isBangla ? "নতুন ওয়্যারহাউস" : "New Warehouse"}</span>
        </Button>
      }
    />
  );
}
