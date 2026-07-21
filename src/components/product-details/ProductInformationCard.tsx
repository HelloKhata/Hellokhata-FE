"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, Truck, AlertTriangle, ShieldCheck, Tag, FileText } from "lucide-react";
import { Product } from "./mock-data";

interface ProductInformationCardProps {
  product: Product;
}

export function ProductInformationCard({ product }: ProductInformationCardProps) {
  const isLowStock =
    (product.totalStock || 0) <= (product.minStockAlert || 30);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Product Info Card (2 cols) */}
      <Card className="lg:col-span-2 border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden">
        <CardHeader className="p-5 border-b border-border/40 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <Info className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                Product Details & Specifications
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Core master data & inventory configuration
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Product Name
              </span>
              <p className="text-sm font-bold text-foreground">{product.name}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                SKU Code
              </span>
              <p className="text-sm font-mono font-bold text-foreground">{product.sku}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Barcode
              </span>
              <p className="text-sm font-mono font-bold text-foreground">{product.barcode || "N/A"}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Category
              </span>
              <p className="text-sm font-semibold text-foreground">{product.category}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Brand
              </span>
              <p className="text-sm font-semibold text-foreground">{product.brand || "Generic"}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Unit Measure
              </span>
              <p className="text-sm font-semibold text-foreground">{product.unit}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Applicable Tax Rate
              </span>
              <p className="text-sm font-semibold text-foreground">{product.taxRate ? `${product.taxRate}% VAT` : "Tax Exempt (0%)"}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Product Status
              </span>
              <Badge variant="outline" className="text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                {product.status || "Active"}
              </Badge>
            </div>
          </div>

          {product.description && (
            <div className="pt-4 border-t border-border/40 space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                Description
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Side Column: Supplier & Inventory Health */}
      <div className="space-y-6">
        {/* Preferred Supplier */}
        <Card className="border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden">
          <CardHeader className="p-4 border-b border-border/40 pb-3">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-bold text-foreground">
                Preferred Supplier
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="p-4 space-y-3">
            <div>
              <p className="text-sm font-bold text-foreground">{product.preferredSupplier || "Agro Foods Trading Co."}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{product.supplierEmail || "orders@supplier.com"}</p>
            </div>

            <div className="pt-2 border-t border-border/40 flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Phone Contact:</span>
              <span className="font-semibold text-foreground">{product.supplierContact || "+880 1711-234567"}</span>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Status & Minimum Threshold */}
        <Card className="border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden">
          <CardHeader className="p-4 border-b border-border/40 pb-3">
            <div className="flex items-center gap-2">
              {isLowStock ? (
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              ) : (
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
              )}
              <CardTitle className="text-sm font-bold text-foreground">
                Inventory Health Status
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-medium">Minimum Threshold:</span>
              <span className="font-bold text-foreground">{product.minStockAlert || 30} units</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-medium">Current Stock Level:</span>
              <span className="font-bold text-foreground">{product.totalStock} units</span>
            </div>

            {isLowStock ? (
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2 font-medium">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                Stock is nearing minimum threshold! Consider issuing a Purchase Order.
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 font-medium">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                Stock level is optimal and well above minimum threshold.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
