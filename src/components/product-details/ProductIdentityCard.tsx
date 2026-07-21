"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pencil,
  Camera,
  Package,
  DollarSign,
  Store,
  Tag,
  MoreVertical,
  Share2,
  Archive,
  Trash2,
  Layers,
} from "lucide-react";
import { Product } from "./mock-data";

interface ProductIdentityCardProps {
  product: Product;
  onEdit?: () => void;
  onEditField?: (field: string) => void;
  onChangeImage?: () => void;
  onShare?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
}

export function ProductIdentityCard({
  product,
  onEdit,
  onEditField,
  onChangeImage,
  onShare,
  onArchive,
  onDelete,
}: ProductIdentityCardProps) {
  const avgCost = product.costPrice || 0;
  const sellingPrice = product.sellingPrice || 0;

  return (
    <Card className="border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden">
      <CardContent className="p-5 md:p-6">
        {/* Header Action Bar inside Card */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/40 gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="outline"
              className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
            >
              {product.status || "Active"}
            </Badge>
            {product.category && (
              <Badge variant="secondary" className="px-2.5 py-0.5 text-xs font-semibold">
                {product.category}
              </Badge>
            )}
            {product.brand && (
              <span className="text-xs text-muted-foreground font-medium">
                Brand: <strong className="text-foreground">{product.brand}</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={onEdit || (() => onEditField?.("all"))}
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-3.5 text-xs font-semibold rounded-xl cursor-pointer flex items-center gap-1.5"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit Product
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 border-input bg-background hover:bg-accent text-muted-foreground hover:text-foreground rounded-xl cursor-pointer shrink-0"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card border border-border rounded-xl">
                <DropdownMenuItem
                  onClick={onShare}
                  className="text-xs font-medium cursor-pointer flex items-center py-2 px-3"
                >
                  <Share2 className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  Share Product
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onArchive}
                  className="text-xs font-medium cursor-pointer flex items-center py-2 px-3"
                >
                  <Archive className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  Archive Product
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-xs font-medium cursor-pointer flex items-center py-2 px-3 text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-2 text-red-500" />
                  Delete Product
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Product Image */}
          <div className="relative group h-28 w-28 md:h-32 md:w-32 rounded-2xl overflow-hidden border border-border bg-muted flex items-center justify-center shrink-0 shadow-inner transition-all hover:border-primary/50">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover rounded-2xl animate-fade-in"
              />
            ) : (
              <Package className="h-10 w-10 text-muted-foreground/60" />
            )}
            {/* Change Image Button Cover */}
            <button
              type="button"
              onClick={onChangeImage}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-semibold gap-1 cursor-pointer"
            >
              <Camera className="h-4 w-4" />
              Change Image
            </button>
          </div>

          {/* Details & Summary Cards Container */}
          <div className="flex-1 min-w-0 space-y-4 w-full">
            {/* Product Name */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 group">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Product Name
                </span>
                <button
                  type="button"
                  onClick={() => onEditField?.("name")}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:text-primary-hover p-0.5"
                >
                  <Pencil className="h-3 w-3" />
                </button>
              </div>
              <h2 className="text-lg md:text-xl font-extrabold text-foreground tracking-tight truncate">
                {product.name}
              </h2>
            </div>

            {/* Bottom Row: Left Info (Category, Unit, SKU, Barcode) & Right Summary Cards */}
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 pt-1">
              {/* Left Side Info */}
              <div className="flex flex-wrap items-center gap-6 sm:gap-8">
                {/* Category */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1 group">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Category
                    </span>
                    <button
                      type="button"
                      onClick={() => onEditField?.("category")}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:text-primary-hover p-0.5"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-foreground truncate max-w-[140px]">
                    {product.category}
                  </p>
                </div>

                {/* Unit Measure */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1 group">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Unit
                    </span>
                    <button
                      type="button"
                      onClick={() => onEditField?.("unit")}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:text-primary-hover p-0.5"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-foreground truncate">
                    {product.unit}
                  </p>
                </div>

                {/* SKU Code */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1 group">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      SKU Code
                    </span>
                    <button
                      type="button"
                      onClick={() => onEditField?.("sku")}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:text-primary-hover p-0.5"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="text-sm font-mono font-bold text-foreground truncate">
                    {product.sku}
                  </p>
                </div>

                {/* Barcode if available */}
                {product.barcode && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                      Barcode
                    </span>
                    <p className="text-sm font-mono font-bold text-foreground truncate">
                      {product.barcode}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Side: Quick Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full xl:w-auto shrink-0">
                {/* Total Stock */}
                <div className="bg-muted/30 border border-border/40 rounded-2xl p-3.5 min-w-[120px] transition-all hover:bg-muted/40 hover:border-border/60">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Total Stock
                    </span>
                    <Package className="h-4 w-4 text-primary shrink-0" />
                  </div>
                  <p className="text-xl font-extrabold text-foreground mt-1.5 tracking-tight">
                    {product.totalStock}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                    {product.availableStock ?? product.totalStock} available
                  </p>
                </div>

                {/* Selling Price */}
                <div className="bg-muted/30 border border-border/40 rounded-2xl p-3.5 min-w-[120px] transition-all hover:bg-muted/40 hover:border-border/60">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Selling Price
                    </span>
                    <Tag className="h-4 w-4 text-emerald-500 shrink-0" />
                  </div>
                  <p className="text-xl font-extrabold text-foreground mt-1.5 tracking-tight">
                    ৳{sellingPrice}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                    Regular SRP
                  </p>
                </div>

                {/* Average Cost */}
                <div className="bg-muted/30 border border-border/40 rounded-2xl p-3.5 min-w-[120px] transition-all hover:bg-muted/40 hover:border-border/60">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Avg Cost
                    </span>
                    <DollarSign className="h-4 w-4 text-amber-500 shrink-0" />
                  </div>
                  <p className="text-xl font-extrabold text-foreground mt-1.5 tracking-tight">
                    ৳{avgCost}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                    Unit Cost
                  </p>
                </div>

                {/* Branches */}
                <div className="bg-muted/30 border border-border/40 rounded-2xl p-3.5 min-w-[120px] transition-all hover:bg-muted/40 hover:border-border/60">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Branches
                    </span>
                    <Store className="h-4 w-4 text-indigo-500 shrink-0" />
                  </div>
                  <p className="text-xl font-extrabold text-foreground mt-1.5 tracking-tight">
                    {product.totalBranches}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                    Active Outlets
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
