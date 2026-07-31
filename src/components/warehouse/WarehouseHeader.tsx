"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Building2,
  Plus,
  Edit,
  ArrowRightLeft,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Wrench,
  MoreVertical,
  Upload,
  Download,
  MapPin,
  Clock,
  Star,
  Settings,
} from "lucide-react";
import { Warehouse, MOCK_BRANCHES } from "./WarehouseMockData";

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
  onSelectBranch,
  onSelectWarehouse,
  onOpenNewModal,
  onOpenEditModal,
  onNavigateTransfer,
  onExportCsv,
  onImportModal,
  isBangla = false,
}: WarehouseHeaderProps) {
  const currentWh = selectedWarehouse || (warehouses.length > 0 ? warehouses[0] : null);

  const activeBranchName =
    selectedBranchId === "all"
      ? isBangla
        ? "সকল শাখা"
        : "All Branches"
      : MOCK_BRANCHES.find((b) => b.id === selectedBranchId)?.name || "Branch";

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold px-2 py-0">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            {isBangla ? "সক্রিয়" : "Active"}
          </Badge>
        );
      case "maintenance":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[11px] font-semibold px-2 py-0">
            <Wrench className="h-3 w-3 mr-1" />
            {isBangla ? "রক্ষণাবেক্ষণ" : "Maintenance"}
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[11px] font-semibold px-2 py-0">
            <AlertCircle className="h-3 w-3 mr-1" />
            {isBangla ? "নিষ্ক্রিয়" : "Inactive"}
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-xs space-y-2.5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left Section: Switchers & Identity */}
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <Building2 className="h-4.5 w-4.5" />
          </div>

          {/* 1. Branch Switcher Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs font-semibold gap-1.5 bg-background/50 border-input cursor-pointer"
              >
                <span>{activeBranchName}</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-card border-border shadow-xl">
              <DropdownMenuLabel className="text-[10px] font-semibold text-muted-foreground uppercase">
                {isBangla ? "শাখা নির্বাচন" : "Filter by Branch"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onSelectBranch("all")}
                className="text-xs font-semibold cursor-pointer"
              >
                {isBangla ? "🌐 সকল শাখা (All)" : "🌐 All Branches"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {MOCK_BRANCHES.map((b) => (
                <DropdownMenuItem
                  key={b.id}
                  onClick={() => onSelectBranch(b.id)}
                  className="text-xs cursor-pointer justify-between"
                >
                  <span>{b.name}</span>
                  <Badge variant="outline" className="text-[9px] font-mono">
                    {b.code}
                  </Badge>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 2. Warehouse Switcher Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-sm sm:text-base font-bold text-foreground hover:text-primary gap-1.5 p-1 px-2 cursor-pointer"
              >
                <span className="truncate max-w-[220px]">
                  {currentWh ? currentWh.name : isBangla ? "সকল ওয়্যারহাউস" : "All Warehouses"}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72 bg-card border-border shadow-xl">
              <DropdownMenuLabel className="text-[10px] font-semibold text-muted-foreground uppercase">
                {isBangla ? "একটিভ ওয়্যারহাউস নির্বাচন" : "Select Warehouse"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onSelectWarehouse(null)}
                className="text-xs font-semibold flex items-center justify-between cursor-pointer"
              >
                <span>{isBangla ? "🌐 সকল ওয়্যারহাউস (Overview)" : "🌐 All Warehouses (Overview)"}</span>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {warehouses.length}
                </Badge>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {warehouses.map((wh) => (
                <DropdownMenuItem
                  key={wh.id}
                  onClick={() => onSelectWarehouse(wh)}
                  className="text-xs flex items-center justify-between cursor-pointer py-1.5"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-bold truncate text-foreground flex items-center gap-1">
                      <span>{wh.name}</span>
                      {wh.isDefault && (
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500 shrink-0" />
                      )}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">{wh.branchName}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono shrink-0 bg-muted">
                    {wh.code}
                  </Badge>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Badges Row */}
          {currentWh && (
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="outline" className="font-mono text-[11px] font-bold bg-primary/10 text-primary border-primary/30 py-0">
                {currentWh.code}
              </Badge>

              {/* Warehouse Type Badge */}
              <Badge variant="secondary" className="text-[11px] font-medium py-0">
                {currentWh.type}
              </Badge>

              {/* Default Indicator */}
              {currentWh.isDefault && (
                <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-bold py-0">
                  <Star className="h-2.5 w-2.5 mr-0.5 fill-amber-500 text-amber-500" />
                  Default
                </Badge>
              )}

              {getStatusBadge(currentWh.status)}
            </div>
          )}
        </div>

        {/* Right Section: Primary Action + Overflow Menu */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Primary Action ONLY: New Warehouse */}
          <Button
            type="button"
            onClick={onOpenNewModal}
            className="h-8.5 text-xs font-bold gap-1.5 cursor-pointer shadow-xs bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{isBangla ? "নতুন ওয়্যারহাউস" : "+ New Warehouse"}</span>
          </Button>

          {/* Overflow Menu Dropdown (Includes Edit, Transfer, Import, Export) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-8.5 w-8.5 border-border/80 cursor-pointer">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 bg-card border-border shadow-xl">
              {currentWh && (
                <DropdownMenuItem
                  onClick={() => onOpenEditModal(currentWh)}
                  className="text-xs font-semibold gap-2 cursor-pointer"
                >
                  <Edit className="h-3.5 w-3.5 text-primary" />
                  <span>{isBangla ? "ওয়্যারহাউস এডিট করুন" : "Edit Warehouse"}</span>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                onClick={onNavigateTransfer}
                className="text-xs font-semibold gap-2 cursor-pointer"
              >
                <ArrowRightLeft className="h-3.5 w-3.5 text-blue-500" />
                <span>{isBangla ? "স্টক ট্রান্সফার করুন" : "Transfer Stock"}</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {onImportModal && (
                <DropdownMenuItem
                  onClick={onImportModal}
                  className="text-xs gap-2 cursor-pointer"
                >
                  <Upload className="h-3.5 w-3.5 text-emerald-500" />
                  <span>{isBangla ? "ওয়্যারহাউস ইম্পোর্ট (CSV)" : "Import Warehouses"}</span>
                </DropdownMenuItem>
              )}

              {onExportCsv && (
                <DropdownMenuItem
                  onClick={onExportCsv}
                  className="text-xs gap-2 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5 text-amber-500" />
                  <span>{isBangla ? "ওয়্যারহাউস এক্সপোর্ট (CSV)" : "Export Warehouses"}</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Sub-line: Location & Last Update Timestamp */}
      {currentWh && (
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground pt-0.5 border-t border-border/40">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-primary shrink-0" />
            <span>
              {currentWh.city}, {currentWh.branchName}
            </span>
          </div>

          <span>•</span>

          <div className="flex items-center gap-1 font-mono text-[10px]">
            <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
            <span>
              {isBangla ? "সর্বশেষ আপডেট:" : "Updated:"}{" "}
              {new Date(currentWh.updatedAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
