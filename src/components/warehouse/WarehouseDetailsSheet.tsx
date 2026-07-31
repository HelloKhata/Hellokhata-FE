"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  MapPin,
  UserCheck,
  Phone,
  Mail,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Edit,
  ArrowRightLeft,
  Star,
  Package,
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  Layers,
  Info,
} from "lucide-react";
import {
  Warehouse,
  WarehouseProduct,
  WarehouseTransfer,
  MOCK_WAREHOUSE_PRODUCTS,
  MOCK_TRANSFERS,
} from "./WarehouseMockData";

interface WarehouseDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  warehouse: Warehouse | null;
  onEdit: (wh: Warehouse) => void;
  onTransfer: (productName?: string) => void;
  isBangla?: boolean;
}

export function WarehouseDetailsSheet({
  isOpen,
  onClose,
  warehouse,
  onEdit,
  onTransfer,
  isBangla = false,
}: WarehouseDetailsSheetProps) {
  const [productSearch, setProductSearch] = useState("");
  const [activeTab, setActiveTab] = useState("products");

  if (!warehouse) return null;

  // Filter products for this specific warehouse
  const warehouseProducts = MOCK_WAREHOUSE_PRODUCTS.filter(
    (p) => p.warehouseId === warehouse.id || p.warehouseId === "wh-1"
  ).filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.batchNumber.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Filter transfers involving this warehouse
  const warehouseTransfers = MOCK_TRANSFERS.filter(
    (t) =>
      t.sourceWarehouseId === warehouse.id ||
      t.destinationWarehouseId === warehouse.id ||
      t.sourceBranch.toLowerCase().includes(warehouse.name.toLowerCase()) ||
      t.destinationBranch.toLowerCase().includes(warehouse.name.toLowerCase())
  );

  const capPercent = warehouse.capacityMax > 0
    ? Math.round((warehouse.capacityUsed / warehouse.capacityMax) * 100)
    : 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case "maintenance":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-semibold">
            <Wrench className="h-3 w-3 mr-1" />
            Maintenance
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-semibold">
            <AlertCircle className="h-3 w-3 mr-1" />
            Inactive
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[95vw] sm:max-w-2xl overflow-y-auto p-4 sm:p-6 bg-card border-border shadow-2xl space-y-4">
        {/* Drawer Header */}
        <SheetHeader className="border-b border-border pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <SheetTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                  <span className="truncate">{warehouse.name}</span>
                  {warehouse.isDefault && (
                    <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-[10px]">
                      <Star className="h-2.5 w-2.5 mr-0.5 fill-amber-500 text-amber-500" />
                      Default
                    </Badge>
                  )}
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground flex items-center gap-2 font-mono mt-0.5">
                  <Badge variant="outline" className="text-[10px] py-0 font-mono">
                    {warehouse.code}
                  </Badge>
                  <span>• {warehouse.type}</span>
                  <span>• {warehouse.city}</span>
                </SheetDescription>
              </div>
            </div>

            {getStatusBadge(warehouse.status)}
          </div>
        </SheetHeader>

        {/* Action Header Bar */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => {
                onClose();
                onEdit(warehouse);
              }}
              className="h-8 text-xs font-semibold gap-1.5 cursor-pointer"
            >
              <Edit className="h-3.5 w-3.5" />
              <span>{isBangla ? "এডিট" : "Edit Warehouse"}</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                onClose();
                onTransfer();
              }}
              className="h-8 text-xs font-semibold gap-1.5 border-border/80 cursor-pointer"
            >
              <ArrowRightLeft className="h-3.5 w-3.5 text-primary" />
              <span>{isBangla ? "স্টক ট্রান্সফার" : "Transfer Stock"}</span>
            </Button>
          </div>

          <div className="text-right text-[11px] font-mono">
            <span className="text-muted-foreground block">{isBangla ? "মোট স্টক মূল্য:" : "Total Stock Valuation:"}</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
              ৳{warehouse.stockValue.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Tabbed Interface: Products, Stock Transfers, Info */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 bg-muted/50 p-1 rounded-lg">
            <TabsTrigger value="products" className="text-xs font-semibold gap-1.5 cursor-pointer">
              <Package className="h-3.5 w-3.5" />
              <span>{isBangla ? "পণ্য তালিকা" : "Products Stock"}</span>
              <Badge variant="secondary" className="text-[9px] font-mono px-1">
                {warehouseProducts.length}
              </Badge>
            </TabsTrigger>

            <TabsTrigger value="transfers" className="text-xs font-semibold gap-1.5 cursor-pointer">
              <History className="h-3.5 w-3.5" />
              <span>{isBangla ? "স্টক ট্রান্সফার" : "Transfers Log"}</span>
              <Badge variant="secondary" className="text-[9px] font-mono px-1">
                {warehouseTransfers.length}
              </Badge>
            </TabsTrigger>

            <TabsTrigger value="info" className="text-xs font-semibold gap-1.5 cursor-pointer">
              <Info className="h-3.5 w-3.5" />
              <span>{isBangla ? "তথ্য ও কনফিগ" : "Info & Config"}</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: PRODUCTS STOCK IN THIS WAREHOUSE */}
          <TabsContent value="products" className="space-y-3 pt-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder={isBangla ? "এই ওয়্যারহাউসের পণ্য বা ব্যাচ খুঁজুন..." : "Search products, SKU or batch in this depot..."}
                className="pl-8 text-xs h-8 bg-background/50 border-input"
              />
            </div>

            <div className="overflow-x-auto border border-border/60 rounded-xl">
              <table className="w-full text-left text-xs border-collapse min-w-[540px]">
                <thead>
                  <tr className="bg-muted/40 text-muted-foreground border-b border-border/80 font-semibold uppercase text-[10px]">
                    <th className="p-2.5">{isBangla ? "পণ্য ও ব্যাচ" : "Product & Batch"}</th>
                    <th className="p-2.5 text-right">{isBangla ? "মজুদ পরিমাণ" : "In Stock"}</th>
                    <th className="p-2.5 text-right">{isBangla ? "একক মূল্য" : "Price"}</th>
                    <th className="p-2.5 text-right">{isBangla ? "স্টক মূল্য" : "Stock Value"}</th>
                    <th className="p-2.5 text-center">{isBangla ? "মেয়াদ" : "Expiry"}</th>
                    <th className="p-2.5 text-right">{isBangla ? "অ্যাকশন" : "Action"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {warehouseProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-muted-foreground space-y-1">
                        <Package className="h-6 w-6 text-muted-foreground/40 mx-auto" />
                        <p className="font-semibold text-xs text-foreground">
                          {isBangla ? "কোনো পণ্য পাওয়া যায়নি" : "No Products Stored"}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    warehouseProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                        {/* Name & Batch */}
                        <td className="p-2.5">
                          <p className="font-bold text-foreground truncate max-w-[180px]">{p.name}</p>
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
                            <span className="text-primary font-semibold">{p.sku}</span>
                            <span>•</span>
                            <Badge variant="outline" className="text-[9px] py-0 font-mono">
                              Batch: {p.batchNumber}
                            </Badge>
                          </div>
                        </td>

                        {/* Stock Qty */}
                        <td className="p-2.5 text-right font-bold font-mono">
                          <span className="text-foreground">{p.stockQty}</span>
                          <span className="text-[10px] text-muted-foreground ml-1">{p.unit}</span>
                        </td>

                        {/* Unit Price */}
                        <td className="p-2.5 text-right font-mono text-muted-foreground">
                          ৳{p.unitPrice}
                        </td>

                        {/* Stock Value */}
                        <td className="p-2.5 text-right font-bold font-mono text-emerald-600 dark:text-emerald-400">
                          ৳{p.stockValue.toLocaleString("en-IN")}
                        </td>

                        {/* Expiry */}
                        <td className="p-2.5 text-center font-mono text-[10px] text-muted-foreground">
                          {p.expiryDate || "N/A"}
                        </td>

                        {/* Action */}
                        <td className="p-2.5 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              onClose();
                              onTransfer(p.name);
                            }}
                            className="h-6 text-[10px] font-semibold text-primary hover:bg-primary/10 cursor-pointer gap-1 px-1.5"
                          >
                            <ArrowRightLeft className="h-3 w-3" />
                            <span>Transfer</span>
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* TAB 2: STOCK TRANSFERS HISTORY FOR THIS WAREHOUSE */}
          <TabsContent value="transfers" className="space-y-3 pt-3">
            <div className="overflow-x-auto border border-border/60 rounded-xl">
              <table className="w-full text-left text-xs border-collapse min-w-[520px]">
                <thead>
                  <tr className="bg-muted/40 text-muted-foreground border-b border-border/80 font-semibold uppercase text-[10px]">
                    <th className="p-2.5">{isBangla ? "ট্রান্সফার আইডি" : "Transfer ID"}</th>
                    <th className="p-2.5">{isBangla ? "দিক (Direction)" : "Direction"}</th>
                    <th className="p-2.5">{isBangla ? "উৎস → গন্তব্য" : "Route"}</th>
                    <th className="p-2.5 text-center">{isBangla ? "পরিমাণ" : "Qty"}</th>
                    <th className="p-2.5">{isBangla ? "স্ট্যাটাস" : "Status"}</th>
                    <th className="p-2.5 text-right">{isBangla ? "তারিখ" : "Date"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {warehouseTransfers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-muted-foreground space-y-1">
                        <History className="h-6 w-6 text-muted-foreground/40 mx-auto" />
                        <p className="font-semibold text-xs text-foreground">
                          {isBangla ? "কোনো ট্রান্সফার রেকর্ড নেই" : "No Transfer History"}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    warehouseTransfers.map((trf) => {
                      const isInbound = trf.destinationWarehouseId === warehouse.id;
                      return (
                        <tr key={trf.id} className="hover:bg-muted/20 transition-colors">
                          <td className="p-2.5 font-mono font-bold text-foreground">
                            {trf.transferNo}
                          </td>

                          <td className="p-2.5">
                            {isInbound ? (
                              <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[9px] font-bold">
                                <ArrowDownLeft className="h-2.5 w-2.5 mr-0.5" /> Inbound
                              </Badge>
                            ) : (
                              <Badge className="bg-blue-500/10 text-blue-600 border border-blue-500/20 text-[9px] font-bold">
                                <ArrowUpRight className="h-2.5 w-2.5 mr-0.5" /> Outbound
                              </Badge>
                            )}
                          </td>

                          <td className="p-2.5 font-medium text-foreground">
                            <span className="truncate max-w-[150px] block">
                              {isInbound ? trf.sourceBranch : trf.destinationBranch}
                            </span>
                          </td>

                          <td className="p-2.5 text-center font-mono font-bold text-foreground">
                            {trf.totalQuantity || 0} Units
                          </td>

                          <td className="p-2.5">
                            <Badge variant="outline" className="text-[9px] capitalize">
                              {trf.status}
                            </Badge>
                          </td>

                          <td className="p-2.5 text-right font-mono text-[10px] text-muted-foreground">
                            {new Date(trf.date).toLocaleDateString("en-GB")}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* TAB 3: WAREHOUSE DETAILS & CONFIGURATION */}
          <TabsContent value="info" className="space-y-4 pt-3">
            {/* Storage Capacity Bar */}
            <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <HardDrive className="h-3.5 w-3.5 text-primary" />
                  {isBangla ? "ধারণক্ষমতা ব্যবহার" : "Storage Capacity"}
                </span>
                <span className="font-mono font-bold text-primary">{capPercent}% Used</span>
              </div>
              <Progress value={capPercent} className="h-2" />
              <div className="flex justify-between items-center text-[10px] text-muted-foreground font-mono">
                <span>Used: {warehouse.capacityUsed.toLocaleString()} {warehouse.storageUnit}</span>
                <span>Max: {warehouse.capacityMax.toLocaleString()} {warehouse.storageUnit}</span>
              </div>
            </div>

            {/* Manager & Contact */}
            <div className="space-y-2 text-xs">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                {isBangla ? "ম্যানেজার ও যোগাযোগ" : "Manager & Contact"}
              </h4>
              <div className="space-y-2 p-3 rounded-lg border border-border/60 bg-muted/20">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="font-semibold text-foreground">{warehouse.managerName}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground font-mono">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span>{warehouse.managerPhone || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground font-mono">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span>{warehouse.managerEmail || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2 text-xs">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                {isBangla ? "ঠিকানা" : "Location Address"}
              </h4>
              <div className="flex items-start gap-2 p-3 rounded-lg border border-border/60 bg-muted/20 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">{warehouse.address}</p>
                  <p>{warehouse.city}, {warehouse.postalCode}, {warehouse.country}</p>
                  <p className="text-[10px] text-primary font-semibold mt-1">Branch: {warehouse.branchName}</p>
                </div>
              </div>
            </div>

            {/* Configurations Badges */}
            <div className="space-y-2 text-xs">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                {isBangla ? "কনফিগারেশন" : "Warehouse Features"}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {warehouse.config?.allowSales && <Badge variant="outline" className="text-[10px]">Sales Allowed</Badge>}
                {warehouse.config?.allowPurchase && <Badge variant="outline" className="text-[10px]">PO Receipts</Badge>}
                {warehouse.config?.allowTransfers && <Badge variant="outline" className="text-[10px]">Transfers</Badge>}
                {warehouse.config?.barcodeEnabled && <Badge variant="outline" className="text-[10px]">Barcode Scanning</Badge>}
                {warehouse.config?.batchTracking && <Badge variant="outline" className="text-[10px]">Batch Tracking</Badge>}
                {warehouse.config?.expiryTracking && <Badge variant="outline" className="text-[10px]">Expiry Alerts</Badge>}
                {warehouse.config?.trackTemperature && <Badge variant="outline" className="text-[10px] text-blue-500 border-blue-500/30">Cold Chain</Badge>}
              </div>
            </div>

            <Separator />

            {/* Timestamps */}
            <div className="flex justify-between items-center text-[10px] text-muted-foreground font-mono">
              <span>Created: {new Date(warehouse.createdAt).toLocaleDateString("en-GB")}</span>
              <span>Updated: {new Date(warehouse.updatedAt).toLocaleDateString("en-GB")}</span>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
