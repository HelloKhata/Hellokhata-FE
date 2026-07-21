"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShoppingBag, Search, Calendar } from "lucide-react";
import { PurchaseRecord } from "./mock-data";

interface PurchaseHistoryTableProps {
  purchases: PurchaseRecord[];
}

export function PurchaseHistoryTable({ purchases }: PurchaseHistoryTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<string>("all");

  const suppliers = useMemo(() => {
    const set = new Set<string>();
    purchases.forEach((p) => set.add(p.supplierName));
    return Array.from(set);
  }, [purchases]);

  const filteredPurchases = useMemo(() => {
    return purchases.filter((p) => {
      const matchesSearch =
        p.purchaseNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.batchId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSupplier =
        selectedSupplier === "all" || p.supplierName === selectedSupplier;
      return matchesSearch && matchesSupplier;
    });
  }, [purchases, searchTerm, selectedSupplier]);

  const totalQuantity = useMemo(
    () => filteredPurchases.reduce((acc, p) => acc + p.quantity, 0),
    [filteredPurchases]
  );

  const totalValue = useMemo(
    () => filteredPurchases.reduce((acc, p) => acc + p.totalCost, 0),
    [filteredPurchases]
  );

  return (
    <Card className="border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden">
      <CardHeader className="p-5 border-b border-border/40 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                Purchase History ({filteredPurchases.length})
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Total Purchased: <strong className="text-foreground">{totalQuantity} units</strong> (৳{totalValue.toLocaleString()})
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search PO#, supplier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-9 text-xs bg-background border-input rounded-xl"
              />
            </div>

            <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
              <SelectTrigger className="w-full sm:w-48 h-9 text-xs border-input bg-background rounded-xl">
                <SelectValue placeholder="All Suppliers" />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="all">All Suppliers</SelectItem>
                {suppliers.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground text-xs font-semibold uppercase border-b border-border/40">
              <tr>
                <th className="px-6 py-3.5">PO Number</th>
                <th className="px-6 py-3.5">Supplier</th>
                <th className="px-6 py-3.5">Purchase Date</th>
                <th className="px-6 py-3.5">Batch</th>
                <th className="px-6 py-3.5 text-right">Quantity</th>
                <th className="px-6 py-3.5 text-right">Unit Cost</th>
                <th className="px-6 py-3.5 text-right">Total Cost</th>
                <th className="px-6 py-3.5 text-right">Created By</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/40">
              {filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-xs text-muted-foreground">
                    No purchase history records found.
                  </td>
                </tr>
              ) : (
                filteredPurchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-foreground text-xs">
                      {purchase.purchaseNo}
                    </td>
                    <td className="px-6 py-4 font-semibold text-foreground text-xs">
                      {purchase.supplierName}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground whitespace-nowrap">
                      {purchase.purchaseDate}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-muted-foreground">
                      {purchase.batchId}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-foreground text-xs">
                      {purchase.quantity}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-foreground text-xs">
                      ৳{purchase.unitCost}
                    </td>
                    <td className="px-6 py-4 text-right font-extrabold text-foreground text-xs">
                      ৳{purchase.totalCost.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-xs text-muted-foreground">
                      {purchase.createdBy}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
