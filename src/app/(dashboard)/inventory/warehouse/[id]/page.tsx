"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import {
  ChevronRight,
  Edit,
  ArrowRightLeft,
  Package,
  Box,
  DollarSign,
  AlertTriangle,
  Search,
  Building2,
  CheckCircle2,
  Wrench,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MOCK_WAREHOUSES,
  MOCK_WAREHOUSE_PRODUCTS,
  Warehouse,
  WarehouseProduct,
} from "@/components/warehouse/WarehouseMockData";
import { NewWarehouseModal } from "@/components/warehouse/NewWarehouseModal";
import { BatchesModal } from "@/components/inventory/BatchesModal";
import Link from "next/link";

export default function WarehouseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isBangla } = useAppTranslation();
  const warehouseId = params?.id as string;

  // State
  const [warehouses, setWarehouses] = useState<Warehouse[]>(MOCK_WAREHOUSES);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBatchItem, setSelectedBatchItem] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Lookup current warehouse
  const warehouse = useMemo(() => {
    return warehouses.find((w) => w.id === warehouseId) || warehouses[0];
  }, [warehouses, warehouseId]);

  // Lookup warehouse products
  const warehouseProducts = useMemo(() => {
    const products = MOCK_WAREHOUSE_PRODUCTS.filter(
      (p) => p.warehouseId === warehouse.id || p.warehouseId === "wh-1"
    );
    return products.length > 0 ? products : MOCK_WAREHOUSE_PRODUCTS;
  }, [warehouse.id]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return warehouseProducts.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.batchNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || p.category === categoryFilter;

      const matchesStatus =
        statusFilter === "all" || p.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [warehouseProducts, searchQuery, categoryFilter, statusFilter]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(warehouseProducts.map((p) => p.category));
    return Array.from(set);
  }, [warehouseProducts]);

  // Save updated warehouse handler
  const handleSaveWarehouse = (whData: Partial<Warehouse>) => {
    setWarehouses((prev) =>
      prev.map((w) => (w.id === warehouse.id ? ({ ...w, ...whData } as Warehouse) : w))
    );
  };

  const formatCurrency = (val: number) => `৳${val.toLocaleString("en-BD")}`;

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

  const getProductStatusBadge = (status: string) => {
    switch (status) {
      case "in_stock":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold py-0">
            {isBangla ? "স্টক আছে" : "In Stock"}
          </Badge>
        );
      case "low_stock":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-semibold py-0">
            {isBangla ? "স্টক কম" : "Low Stock"}
          </Badge>
        );
      case "out_of_stock":
        return (
          <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[10px] font-semibold py-0">
            {isBangla ? "স্টক শেষ" : "Out of Stock"}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const lowStockCount = warehouseProducts.filter(
    (p) => p.status === "low_stock" || p.status === "out_of_stock"
  ).length;

  return (
    <div className="space-y-5 pb-12">
      {/* 1. Breadcrumbs */}
      <div className="flex items-center justify-between gap-2">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/inventory" className="hover:text-primary transition-colors">
            {isBangla ? "ইনভেন্টরি" : "Inventory"}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/inventory/warehouse" className="hover:text-primary transition-colors">
            {isBangla ? "ওয়্যারহাউস" : "Warehouse"}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-semibold">{warehouse.name}</span>
        </nav>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/inventory/warehouse")}
          className="h-7 text-xs gap-1.5 font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{isBangla ? "তালিকায় ফিরে যান" : "Back to Warehouses"}</span>
        </Button>
      </div>

      {/* 2. Header: Title is Warehouse Name, right side edit & transfer buttons */}
      <div className="bg-card border border-border/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {warehouse.name}
            </h1>
            <Badge variant="outline" className="font-mono text-xs font-bold bg-muted">
              {warehouse.code}
            </Badge>
            {getStatusBadge(warehouse.status)}
          </div>
          <p className="text-xs text-muted-foreground flex flex-wrap items-center gap-2">
            <span>📍 {warehouse.city}, {warehouse.branchName}</span>
            <span>•</span>
            <span>👤 Manager: {warehouse.managerName}</span>
            {warehouse.managerPhone && (
              <span className="font-mono">({warehouse.managerPhone})</span>
            )}
          </p>
        </div>

        {/* Right side header actions: Edit and Transfer */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
            className="h-9 text-xs font-semibold gap-1.5 cursor-pointer border-border/80 rounded-xl"
          >
            <Edit className="h-3.5 w-3.5" />
            <span>{isBangla ? "এডিট করুন" : "Edit"}</span>
          </Button>

          <Button
            size="sm"
            onClick={() => router.push("/inventory/warehouse/transfers/new")}
            className="h-9 text-xs font-semibold gap-1.5 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs"
          >
            <ArrowRightLeft className="h-3.5 w-3.5" />
            <span>{isBangla ? "স্টক ট্রান্সফার" : "Transfer"}</span>
          </Button>
        </div>
      </div>

      {/* 3. 4 KPI Cards (Total Items, Total Stock, Stock Value, Low Stock) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* CARD 1: Total Items */}
        <Card className="border border-border/70 shadow-xs bg-card hover:border-primary/40 transition-colors">
          <CardContent className="p-3.5">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 min-w-0 pr-1">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider truncate">
                  {isBangla ? "মোট পণ্য" : "Total Items"}
                </p>
                <p className="text-xl font-bold font-mono text-foreground">
                  {(warehouse.productsCount || warehouseProducts.length).toLocaleString()}{" "}
                  <span className="text-xs font-normal text-muted-foreground">{isBangla ? "টি পণ্য" : "Items"}</span>
                </p>
                <span className="text-[10px] text-muted-foreground block truncate">
                  {isBangla ? "নিবন্ধিত পণ্যসমূহ" : "Registered products in depot"}
                </span>
              </div>
              <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                <Package className="h-4.5 w-4.5" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CARD 2: Total Stock */}
        <Card className="border border-border/70 shadow-xs bg-card hover:border-emerald-500/40 transition-colors">
          <CardContent className="p-3.5">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 min-w-0 pr-1">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider truncate">
                  {isBangla ? "মোট স্টক" : "Total Stock"}
                </p>
                <p className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {warehouse.totalStockUnits.toLocaleString()}{" "}
                  <span className="text-xs font-normal text-muted-foreground">{isBangla ? "ইউনিট" : "Units"}</span>
                </p>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block truncate">
                  {isBangla ? "উপলব্ধ ইউনিটসমূহ" : "Available units in depot"}
                </span>
              </div>
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <Box className="h-4.5 w-4.5" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CARD 3: Stock Value */}
        <Card className="border border-border/70 shadow-xs bg-card hover:border-emerald-500/40 transition-colors">
          <CardContent className="p-3.5">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 min-w-0 pr-1">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider truncate">
                  {isBangla ? "স্টকের মূল্য" : "Stock Value"}
                </p>
                <p className="text-xl font-bold font-mono text-foreground">
                  {formatCurrency(warehouse.stockValue)}
                </p>
                <span className="text-[10px] text-muted-foreground block truncate">
                  {isBangla ? "মোট ক্রয় মূল্যায়ন" : "Total inventory cost valuation"}
                </span>
              </div>
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <DollarSign className="h-4.5 w-4.5" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CARD 4: Low Stock */}
        <Card className="border border-border/70 shadow-xs bg-card hover:border-rose-500/40 transition-colors">
          <CardContent className="p-3.5">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 min-w-0 pr-1">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider truncate">
                  {isBangla ? "স্টক কম" : "Low Stock"}
                </p>
                <p className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400">
                  {lowStockCount}{" "}
                  <span className="text-xs font-normal text-muted-foreground">{isBangla ? "টি" : "Items"}</span>
                </p>
                <span className="text-[10px] text-rose-600 dark:text-rose-400 font-medium block truncate">
                  {isBangla ? "রিঅর্ডার লেভেলের নিচে" : "Items below reorder level"}
                </span>
              </div>
              <div className="h-9 w-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                <AlertTriangle className="h-4.5 w-4.5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. Warehouse Inventory Items List Container matching Inventory Page layout */}
      <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden space-y-0">
        <div className="px-6 pt-5 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40">
          <h3 className="text-base font-bold text-foreground">
            {isBangla ? 'পণ্য তালিকা' : 'Item List'}
          </h3>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isBangla ? "পণ্য বা SKU দিয়ে খুঁজুন..." : "Search by product name, SKU..."}
                className="pl-8 text-xs h-8 bg-background/50 border-input w-[180px] sm:w-[220px]"
              />
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-8 text-xs bg-background/50 border-input w-[140px]">
                <SelectValue placeholder={isBangla ? "সকল ক্যাটাগরি" : "All Categories"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isBangla ? "সকল ক্যাটাগরি" : "All Categories"}</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c} className="text-xs">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 text-xs bg-background/50 border-input w-[130px]">
                <SelectValue placeholder={isBangla ? "সকল স্ট্যাটাস" : "All Status"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isBangla ? "সকল স্ট্যাটাস" : "All Status"}</SelectItem>
                <SelectItem value="in_stock">{isBangla ? "স্টক আছে" : "In Stock"}</SelectItem>
                <SelectItem value="low_stock">{isBangla ? "স্টক কম" : "Low Stock"}</SelectItem>
                <SelectItem value="out_of_stock">{isBangla ? "স্টক শেষ" : "Out of Stock"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Column Header Bar - Matching Inventory Page Layout */}
        <div className="flex items-center justify-between px-6 py-3 bg-muted/40 text-xs font-medium text-muted-foreground border-b border-border/40 gap-4">
          <div className="w-10 text-left shrink-0 font-semibold">SL.</div>
          <div className="w-28 sm:w-32 text-left shrink-0 font-semibold">{isBangla ? 'বারকোড / SKU' : 'Barcode / SKU'}</div>
          <div className="w-12 text-left shrink-0 font-semibold">{isBangla ? 'ছবি' : 'Image'}</div>
          <div className="flex-1 text-left min-w-0 font-semibold">{isBangla ? 'পণ্যের নাম' : 'Product Name'}</div>
          <div className="hidden md:block w-44 sm:w-52 text-left shrink-0 font-semibold">{isBangla ? 'ব্যাচ' : 'Batches'}</div>
          <div className="w-28 sm:w-36 text-left shrink-0 font-semibold">{isBangla ? 'পরিমাণ' : 'Quantity'}</div>
          <div className="text-right w-36 sm:w-44 shrink-0 font-semibold">{isBangla ? 'অ্যাকশন' : 'Actions'}</div>
        </div>

        {/* Rows - Matching Inventory Page ItemRow Layout */}
        <div className="divide-y divide-border/30">
          {filteredProducts.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground space-y-2">
              <Package className="h-8 w-8 text-muted-foreground/40 mx-auto" />
              <p className="font-semibold text-foreground text-xs">
                {isBangla ? "কোনো পণ্য পাওয়া যায়নি" : "No Items Found"}
              </p>
            </div>
          ) : (
            filteredProducts.map((p, index) => (
              <div
                key={p.id}
                onClick={() => router.push(`/inventory/${p.id}`)}
                className="flex items-center justify-between px-6 py-3.5 hover:bg-muted/30 transition-colors gap-4 border-b border-border/30 cursor-pointer group"
              >
                {/* 1. SL. (Left aligned) */}
                <div className="w-10 shrink-0 text-left text-xs font-mono font-medium text-muted-foreground">
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* 2. Barcode / SKU (Left aligned) */}
                <div className="w-28 sm:w-32 shrink-0 min-w-0 text-left">
                  <span className="text-xs font-mono text-foreground truncate block font-medium group-hover:text-primary transition-colors">
                    {p.sku}
                  </span>
                </div>

                {/* 3. Image (Left aligned - real product image) */}
                <div className="w-12 shrink-0 text-left flex items-center justify-start">
                  <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center overflow-hidden border border-border/40 p-0.5 shrink-0 shadow-xs">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-cover rounded-lg"
                      />
                    ) : (
                      <Package className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* 4. Product Name & Status (Left aligned, expanded) */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-foreground text-sm leading-snug group-hover:text-primary transition-colors">{p.name}</p>
                    {getProductStatusBadge(p.status)}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{p.category}</p>
                </div>

                {/* 5. Batches (Left aligned) - Exact same pill button as inventory list */}
                <div className="hidden md:flex flex-col w-44 sm:w-52 shrink-0 text-left">
                  <button
                    type="button"
                    className="h-auto py-1 px-3.5 text-foreground whitespace-nowrap text-xs font-medium bg-muted/80 hover:bg-muted border border-border/50 rounded-full transition-colors w-fit cursor-pointer flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBatchItem({
                        id: p.id,
                        name: p.name,
                        sku: p.sku,
                        unit: p.unit,
                        currentStock: p.availableQty,
                        costPrice: p.unitPrice,
                        minStock: 10,
                        batchNumber: p.batchNumber,
                      });
                    }}
                  >
                    <span className="text-xs font-medium text-foreground">
                      1 {isBangla ? 'ব্যাচ' : 'Batch'}
                    </span>
                  </button>
                </div>

                {/* 6. Quantity (Left aligned) */}
                <div className="w-28 sm:w-36 shrink-0 min-w-0 text-left space-y-0.5">
                  <p className="text-sm font-extrabold text-foreground whitespace-nowrap">
                    {p.availableQty.toLocaleString()}{" "}
                    <span className="text-xs font-normal text-muted-foreground">{p.unit}</span>
                  </p>
                  <p className="text-xs text-muted-foreground/70 whitespace-nowrap font-mono">
                    Price {formatCurrency(p.unitPrice)}
                  </p>
                </div>

                {/* 7. Action Button - ONLY TRANSFER */}
                <div className="flex items-center justify-end gap-1 w-36 sm:w-44 shrink-0 text-right" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push("/inventory/warehouse/transfers/new");
                    }}
                    className="h-8 text-xs px-3 font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 cursor-pointer gap-1.5 rounded-xl border border-blue-500/20"
                    title={isBangla ? "স্টক ট্রান্সফার" : "Transfer"}
                  >
                    <ArrowRightLeft className="h-3.5 w-3.5" />
                    <span>{isBangla ? "ট্রান্সফার" : "Transfer"}</span>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Warehouse Modal */}
      <NewWarehouseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveWarehouse}
        editingWarehouse={warehouse}
        isBangla={isBangla}
      />

      {/* Batches Modal - Opened when clicking batch button */}
      <BatchesModal
        isOpen={!!selectedBatchItem}
        onClose={() => setSelectedBatchItem(null)}
        item={selectedBatchItem}
        isBangla={isBangla}
      />
    </div>
  );
}
