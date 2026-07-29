"use client";

import React, { useState } from "react";
import { VATRate, BranchVATConfig } from "@/types/finance-settings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Receipt, Plus, Pencil, Ban, Trash2, Building2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { BranchSelector } from "../deposits-withdrawals/BranchSelector";

const MOCK_VAT_RATES: VATRate[] = [
  { id: "vat-1", name: "Standard National VAT", percentage: 15, appliesTo: "all", isDefault: true, status: "active", isUsed: true },
  { id: "vat-2", name: "Reduced Retail Tax", percentage: 5, appliesTo: "products", isDefault: false, status: "active", isUsed: true },
  { id: "vat-3", name: "Zero-Rated Export Tax", percentage: 0, appliesTo: "all", isDefault: false, status: "active", isUsed: false },
];

interface VATSettingsCardProps {
  isBangla?: boolean;
}

export function VATSettingsCard({ isBangla = false }: VATSettingsCardProps) {
  const [vatRates, setVatRates] = useState<VATRate[]>(MOCK_VAT_RATES);

  // Branch VAT Configuration State
  const [selectedBranch, setSelectedBranch] = useState("Main Branch");
  const [branchPricingMode, setBranchPricingMode] = useState<"inclusive" | "exclusive">("exclusive");
  const [defaultRateId, setDefaultRateId] = useState("vat-1");
  const [taxNumber, setTaxNumber] = useState("BIN-11992288");
  const [invoiceVatLabel, setInvoiceVatLabel] = useState("VAT (মূসক 9.1)");

  const handleSaveBranchVat = () => {
    toast.success(
      isBangla
        ? `${selectedBranch}-এর ভ্যাট কনফিগারেশন সংরক্ষণ করা হয়েছে`
        : `VAT configuration updated for ${selectedBranch}`
    );
  };

  return (
    <div className="space-y-5">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-card border border-border/80 rounded-xl p-3.5 space-y-1 shadow-2xs">
          <span className="text-[10px] text-muted-foreground uppercase font-medium block">Default VAT</span>
          <span className="text-xl font-bold font-mono text-primary">15%</span>
        </div>
        <div className="bg-card border border-border/80 rounded-xl p-3.5 space-y-1 shadow-2xs">
          <span className="text-[10px] text-muted-foreground uppercase font-medium block">Inclusive Products</span>
          <span className="text-xl font-bold font-mono text-emerald-600">142</span>
        </div>
        <div className="bg-card border border-border/80 rounded-xl p-3.5 space-y-1 shadow-2xs">
          <span className="text-[10px] text-muted-foreground uppercase font-medium block">Exclusive Products</span>
          <span className="text-xl font-bold font-mono text-amber-600">388</span>
        </div>
        <div className="bg-card border border-border/80 rounded-xl p-3.5 space-y-1 shadow-2xs">
          <span className="text-[10px] text-muted-foreground uppercase font-medium block">Tax Rates</span>
          <span className="text-xl font-bold font-mono text-foreground">{vatRates.length}</span>
        </div>
      </div>

      {/* Main VAT Rate Table Card */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-border/80 pb-3">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
              <Receipt className="h-4 w-4 text-primary" />
              <span>{isBangla ? "ভ্যাট রেট তালিকা (VAT Rates)" : "VAT Rates & Tax Configuration"}</span>
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {isBangla
                ? "পণ্যের জন্য প্রযোজ্য জাতীয় ভ্যাট রেট ও শতকরা হার নির্ধারণ করুন।"
                : "Manage statutory tax rates, default VAT percentages, and product applicability."}
            </p>
          </div>

          <Button
            type="button"
            size="sm"
            onClick={() => toast.info("Create new VAT rate dialog")}
            className="h-8 text-xs font-semibold gap-1 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{isBangla ? "নতুন ভ্যাট রেট" : "Add Tax Rate"}</span>
          </Button>
        </div>

        {/* VAT Table */}
        <div className="border border-border/80 rounded-xl overflow-hidden shadow-2xs">
          <Table className="text-left text-xs">
            <TableHeader>
              <TableRow className="bg-muted/40 text-[11px] font-semibold uppercase tracking-wider">
                <TableHead className="py-2.5">Rate Name</TableHead>
                <TableHead className="py-2.5">Percentage (%)</TableHead>
                <TableHead className="py-2.5">Applies To</TableHead>
                <TableHead className="py-2.5">Default</TableHead>
                <TableHead className="py-2.5">Status</TableHead>
                <TableHead className="py-2.5 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vatRates.map((vat) => (
                <TableRow key={vat.id} className="hover:bg-muted/15">
                  <TableCell className="py-2.5 font-bold text-foreground">{vat.name}</TableCell>
                  <TableCell className="py-2.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {vat.percentage}%
                  </TableCell>
                  <TableCell className="py-2.5 capitalize text-muted-foreground font-mono text-[11px]">
                    {vat.appliesTo}
                  </TableCell>
                  <TableCell className="py-2.5">
                    {vat.isDefault ? (
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold">
                        Default Rate
                      </Badge>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="py-2.5">
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                        <Ban className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={vat.isUsed}
                        className="h-7 w-7 text-muted-foreground hover:text-rose-600 disabled:opacity-30"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Branch Level VAT Configuration Card */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-4 shadow-2xs">
        <div className="border-b border-border/80 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              <span>{isBangla ? "শাখা ভিত্তিক ভ্যাট কনফিগারেশন" : "Branch VAT Configuration"}</span>
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Configure branch-specific pricing modes (VAT Inclusive vs Exclusive) and Tax ID (BIN/TIN).
            </p>
          </div>

          <div className="w-44">
            <BranchSelector
              value={selectedBranch}
              onChange={setSelectedBranch}
              isBangla={isBangla}
              compact
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Pricing Mode Toggle */}
          <div className="space-y-1.5 p-3.5 bg-background/50 border border-border/70 rounded-xl">
            <Label className="text-xs font-bold text-foreground block">Pricing Mode</Label>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button
                type="button"
                variant={branchPricingMode === "exclusive" ? "default" : "outline"}
                size="sm"
                onClick={() => setBranchPricingMode("exclusive")}
                className="h-8 text-xs font-semibold cursor-pointer"
              >
                VAT Exclusive
              </Button>
              <Button
                type="button"
                variant={branchPricingMode === "inclusive" ? "default" : "outline"}
                size="sm"
                onClick={() => setBranchPricingMode("inclusive")}
                className="h-8 text-xs font-semibold cursor-pointer"
              >
                VAT Inclusive
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground pt-1">
              {branchPricingMode === "exclusive"
                ? "VAT will be added on top of product prices at checkout."
                : "Product prices already include VAT inside item price."}
            </p>
          </div>

          {/* Tax Number & Invoice VAT Label */}
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground">Tax Registration # (BIN / TIN)</Label>
              <Input
                value={taxNumber}
                onChange={(e) => setTaxNumber(e.target.value)}
                placeholder="e.g. BIN-11992288"
                className="h-9 bg-background/50 text-xs border-input font-mono font-bold"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground">Invoice VAT Display Label</Label>
              <Input
                value={invoiceVatLabel}
                onChange={(e) => setInvoiceVatLabel(e.target.value)}
                placeholder="e.g. VAT (মূসক 9.1)"
                className="h-9 bg-background/50 text-xs border-input"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-border/60">
          <Button
            type="button"
            onClick={handleSaveBranchVat}
            className="h-9 px-4 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 cursor-pointer rounded-lg shadow-xs"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Save Branch VAT Config</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
