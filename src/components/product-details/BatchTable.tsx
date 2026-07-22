"use client";

import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
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
  Sparkles,
  Tag,
  Plus,
} from "lucide-react";
import { Batch } from "./mock-data";
import { EmptyState } from "./EmptyState";
import { useGetOffers } from "@/hooks/api/useOffers";

interface BatchTableProps {
  batches: Batch[];
  productId?: string;
  onViewBatch?: (batchId: string) => void;
  onTransferStock?: (batchId: string) => void;
  onAdjustStock?: (batchId: string) => void;
}

export function BatchTable({
  batches,
  productId,
  onViewBatch,
  onTransferStock,
  onAdjustStock,
}: BatchTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: offersData } = useGetOffers();
  const activeOffers = offersData?.data || [];

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

  const getOfferLabel = (offer: any) => {
    switch (offer.type) {
      case 'bogo':
        return `Buy ${offer.bogoConfig?.buyQuantity || 1} Get ${offer.bogoConfig?.freeQuantity || 1} Free`;
      case 'percentage':
        return `${offer.percentageConfig?.percentage || 0}% Off`;
      case 'flat':
        return `${offer.flatConfig?.scope === 'per_unit' ? 'Per Unit' : 'Per Order'} Discount`;
      case 'bundle':
        return `Bundle Deal`;
      default:
        return offer.type.toUpperCase();
    }
  };

  const getBatchOffer = (batchId: string) => {
    return activeOffers.find(
      (o) => o.status === "active" && (o.batchId === batchId || o.productId === productId)
    );
  };

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
    }
  };

  return (
    <Card className="border border-border/60 shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="p-5 border-b border-border/40 bg-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              Batch Inventory Breakdown
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Detailed tracking of active, expiring, and transferred product batches across outlets.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() =>
                router.push(
                  `/inventory/promotions/new${productId ? `?productId=${productId}` : ""}`
                )
              }
              className="h-9 text-xs font-semibold gap-1.5 shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Create Offer
            </Button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Filter by Batch ID, branch, supplier, or purchase #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs bg-background/50 border-input"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Branch Selector */}
            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger className="h-9 w-[130px] text-xs font-medium bg-background/50 border-input">
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((b) => (
                  <SelectItem key={b} value={b} className="text-xs capitalize">
                    {b === "all" ? "All Branches" : b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Selector */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-[130px] text-xs font-medium bg-background/50 border-input">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All Statuses</SelectItem>
                <SelectItem value="active" className="text-xs">Active</SelectItem>
                <SelectItem value="expiring" className="text-xs">Expiring Soon</SelectItem>
                <SelectItem value="expired" className="text-xs">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {filteredBatches.length === 0 ? (
          <div className="py-12">
            <EmptyState
              icon={<Layers className="h-10 w-10 text-muted-foreground/60" />}
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
                  Expiry
                </TableHead>
                <TableHead className="px-5 py-3 text-xs font-semibold uppercase text-muted-foreground">
                  Active Offer
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
              {filteredBatches.map((batch) => {
                const offer = getBatchOffer(batch.id);
                return (
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
                      {format(new Date(batch.expiryDate), "dd MMM yyyy")}
                    </TableCell>
                    
                    {/* Active Offer Badge or Create Offer Button */}
                    <TableCell className="px-5 py-3.5 whitespace-nowrap">
                      {offer ? (
                        <button
                          type="button"
                          onClick={() => router.push(`/inventory/promotions/new?id=${offer.id}`)}
                          className="cursor-pointer"
                        >
                          <Badge className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-bold py-0.5 px-2 flex items-center gap-1 w-max">
                            <Sparkles className="h-3 w-3" />
                            {getOfferLabel(offer)}
                          </Badge>
                        </button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/inventory/promotions/new?productId=${productId || ''}&batchId=${batch.id}`
                            )
                          }
                          className="h-7 px-2 text-[11px] font-semibold text-primary hover:text-primary-hover hover:bg-primary/10 gap-1 cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                          Create Offer
                        </Button>
                      )}
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
                            onClick={() =>
                              router.push(
                                `/inventory/promotions/new?productId=${productId || ''}&batchId=${batch.id}`
                              )
                            }
                            className="cursor-pointer flex items-center py-2 px-3 text-primary font-semibold"
                          >
                            <Sparkles className="h-3.5 w-3.5 mr-2 text-primary" />
                            Create Offer
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
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
