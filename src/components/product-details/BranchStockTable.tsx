"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Store, Search, ArrowUpDown } from "lucide-react";
import { BranchStock } from "./mock-data";

interface BranchStockTableProps {
  branches: BranchStock[];
}

export function BranchStockTable({ branches }: BranchStockTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof BranchStock>("currentStock");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filteredBranches = useMemo(() => {
    return branches
      .filter((b) =>
        b.branchName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (typeof valA === "number" && typeof valB === "number") {
          return sortOrder === "asc" ? valA - valB : valB - valA;
        }
        return sortOrder === "asc"
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
  }, [branches, searchTerm, sortField, sortOrder]);

  const handleSort = (field: keyof BranchStock) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const totalStock = useMemo(
    () => branches.reduce((acc, b) => acc + b.currentStock, 0),
    [branches]
  );

  return (
    <Card className="border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden">
      <CardHeader className="p-5 border-b border-border/40 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                Branch Inventory ({branches.length})
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Total across all locations: <strong className="text-foreground">{totalStock} units</strong>
              </p>
            </div>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Filter by branch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-9 text-xs bg-background border-input rounded-xl"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground text-xs font-semibold uppercase border-b border-border/40">
              <tr>
                <th
                  onClick={() => handleSort("branchName")}
                  className="px-6 py-3.5 cursor-pointer hover:text-foreground transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Branch Name
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("currentStock")}
                  className="px-6 py-3.5 text-right cursor-pointer hover:text-foreground transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    Current Stock
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("availableStock")}
                  className="px-6 py-3.5 text-right cursor-pointer hover:text-foreground transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    Available
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("averageCost")}
                  className="px-6 py-3.5 text-right cursor-pointer hover:text-foreground transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    Avg Unit Cost
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-6 py-3.5 text-right">Last Updated</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/40">
              {filteredBranches.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-xs text-muted-foreground">
                    No matching branch stock records found.
                  </td>
                </tr>
              ) : (
                filteredBranches.map((branch) => (
                  <tr key={branch.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-foreground text-xs">
                      {branch.branchName}
                    </td>
                    <td className="px-6 py-4 text-right font-extrabold text-foreground text-xs">
                      {branch.currentStock}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                      {branch.availableStock}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-foreground text-xs">
                      ৳{branch.averageCost}
                    </td>
                    <td className="px-6 py-4 text-right text-xs text-muted-foreground">
                      {branch.lastUpdated}
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
