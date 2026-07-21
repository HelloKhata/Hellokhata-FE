"use client";

import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Search,
  Filter,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  MoreVertical,
  ArrowRightLeft,
  SlidersHorizontal,
  Eye,
  Layers,
} from "lucide-react";
import { Batch } from "./mock-data";
import { EmptyState } from "./EmptyState";

interface BatchTableProps {
  batches: Batch[];
  onViewBatch?: (batchId: string) => void;
  onTransferStock?: (batchId: string) => void;
  onAdjustStock?: (batchId: string) => void;
}

export function BatchTable({
  batches,
  onViewBatch,
  onTransferStock,
  onAdjustStock,
}: BatchTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Get unique branches for selector
  const branches = useMemo(() => {
    const list = new Set(batches.map((b) => b.branch));
    return ["all", ...Array.from(list)];
  }, [batches]);

  // Filtered dataset
  const filteredBatches = useMemo(() => {
    return batches.filter((batch) => {
      const matchesSearch =
        batch.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (batch.supplierName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (batch.purchaseNo || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBranch =
        branchFilter === "all" || batch.branch === branchFilter;
      const matchesStatus =
        statusFilter === "all" || batch.status === statusFilter;
      return matchesSearch && matchesBranch && matchesStatus;
    });
  }, [batches, searchTerm, branchFilter, statusFilter]);

  const renderStatusBadge = (status: Batch["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold py-0.5 px-2 flex items-center gap-1 w-max">
            <CheckCircle2 className="h-3 w-3" />
            Active
          </Badge>
        );
      case "expiring":
        return (
          <Badge className="bg-amber-500/10 hover:bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-semibold py-0.5 px-2 flex items-center gap-1 w-max">
            <AlertTriangle className="h-3 w-3" />
            Expiring Soon
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-rose-500/10 hover:bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[10px] font-semibold py-0.5 px-2 flex items-center gap-1 w-max">
            <AlertCircle className="h-3 w-3" />
            Expired
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden flex flex-col h-full">
      <CardHeader className="p-5 pb-4 border-b border-border/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                Batch Inventory Management ({filteredBatches.length})
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Track lots, branch allocation, expiry dates, and unit costs
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Toolbar */}
      <div className="p-5 pb-3 pt-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Batch ID, PO#, supplier..."
            className="pl-8 h-9 bg-background border-input text-xs rounded-xl"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto shrink-0">
          <Select value={branchFilter} onValueChange={setBranchFilter}>
            <SelectTrigger className="h-9 w-full sm:w-40 bg-background border-input text-xs rounded-xl">
              <SelectValue placeholder="Branch" />
            </SelectTrigger>
            <SelectContent className="bg-card border border-border rounded-xl text-xs">
              {branches.map((br) => (
                <SelectItem key={br} value={br} className="text-xs cursor-pointer">
                  {br === "all" ? "All Branches" : br}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-full sm:w-36 bg-background border-input text-xs rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-card border border-border rounded-xl text-xs">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expiring">Expiring Soon</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table grid */}
      <CardContent className="p-0 overflow-x-auto flex-1">
        {filteredBatches.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Search}
              title="No batches match criteria"
              description="Try adjusting your search terms or clearing status/branch filters."
            />
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/40 border-b border-border/40">
              <TableRow className="border-b border-border/40">
                <TableHead className="px-5 py-3 text-xs font-semibold uppercase text-muted-foreground">
                  Batch ID
                </TableHead>
                <TableHead className="px-5 py-3 text-xs font-semibold uppercase text-muted-foreground">
                  Branch
                </TableHead>
                <TableHead className="px-5 py-3 text-xs font-semibold uppercase text-muted-foreground">
                  Supplier
                </TableHead>
                <TableHead className="px-5 py-3 text-xs font-semibold uppercase text-muted-foreground text-right">
                  Total Qty
                </TableHead>
                <TableHead className="px-5 py-3 text-xs font-semibold uppercase text-muted-foreground text-right">
                  Available
                </TableHead>
                <TableHead className="px-5 py-3 text-xs font-semibold uppercase text-muted-foreground text-right">
                  Unit Cost
                </TableHead>
                <TableHead className="px-5 py-3 text-xs font-semibold uppercase text-muted-foreground">
                  Received
                </TableHead>
                <TableHead className="px-5 py-3 text-xs font-semibold uppercase text-muted-foreground">
                  Expiry
                </TableHead>
                <TableHead className="px-5 py-3 text-xs font-semibold uppercase text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="px-5 py-3 text-xs font-semibold uppercase text-muted-foreground text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border/40">
              {filteredBatches.map((batch) => (
                <TableRow key={batch.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="px-5 py-3.5 font-mono font-bold text-xs text-foreground">
                    {batch.id}
                  </TableCell>
                  <TableCell className="px-5 py-3.5 text-xs font-semibold text-foreground whitespace-nowrap">
                    {batch.branch}
                  </TableCell>
                  <TableCell className="px-5 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                    {batch.supplierName || "—"}
                  </TableCell>
                  <TableCell className="px-5 py-3.5 text-xs font-extrabold text-foreground text-right">
                    {batch.quantity}
                  </TableCell>
                  <TableCell className="px-5 py-3.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 text-right">
                    {batch.availableQuantity ?? batch.quantity}
                  </TableCell>
                  <TableCell className="px-5 py-3.5 text-xs font-mono font-bold text-foreground text-right">
                    ৳{batch.costPrice}
                  </TableCell>
                  <TableCell className="px-5 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(batch.receivedDate), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell className="px-5 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(batch.expiryDate), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell className="px-5 py-3.5 align-middle">
                    {renderStatusBadge(batch.status)}
                  </TableCell>
                  <TableCell className="px-5 py-3.5 text-right align-middle">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0 cursor-pointer">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 text-xs bg-card border border-border rounded-xl">
                        <DropdownMenuItem
                          onClick={() => onViewBatch?.(batch.id)}
                          className="cursor-pointer flex items-center py-2 px-3"
                        >
                          <Eye className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                          View Batch
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onTransferStock?.(batch.id)}
                          className="cursor-pointer flex items-center py-2 px-3"
                        >
                          <ArrowRightLeft className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                          Transfer Stock
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onAdjustStock?.(batch.id)}
                          className="cursor-pointer flex items-center py-2 px-3"
                        >
                          <SlidersHorizontal className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                          Stock Adjustment
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
