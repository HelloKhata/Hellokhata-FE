"use client";

import React, { useState } from "react";
import { BonusPayment, BonusType } from "../types";
import { MOCK_BONUS_PAYMENTS } from "../constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sparkles, Plus, CheckCircle2, Gift } from "lucide-react";
import { useCurrency } from "@/hooks/useAppTranslation";
import { BranchSelector } from "@/components/finance/deposits-withdrawals/BranchSelector";
import { toast } from "sonner";

interface BonusPayWorkflowProps {
  isBangla?: boolean;
}

export function BonusPayWorkflow({ isBangla = false }: BonusPayWorkflowProps) {
  const { formatCurrency } = useCurrency();
  const [bonuses, setBonuses] = useState<BonusPayment[]>(MOCK_BONUS_PAYMENTS);

  // Form State
  const [bonusType, setBonusType] = useState<BonusType>("Eid Bonus");
  const [title, setTitle] = useState("Eid-ul-Fitr Festival Bonus");
  const [branchName, setBranchName] = useState("Main Branch");
  const [amountPerEmp, setAmountPerEmp] = useState<number>(10000);
  const [disbursedDate, setDisbursedDate] = useState(new Date().toISOString().split("T")[0]);

  const handleCreateBonus = (e: React.FormEvent) => {
    e.preventDefault();
    const created: BonusPayment = {
      id: `bon-${Date.now()}`,
      bonusType,
      title,
      branchName,
      employeeCount: 12,
      totalBonusAmount: amountPerEmp * 12,
      disbursedDate,
      status: "disbursed",
    };

    setBonuses((prev) => [created, ...prev]);
    toast.success(
      isBangla
        ? `${title} সফলভাবে বিতরণ করা হয়েছে!`
        : `${title} bonus disbursed for ${created.employeeCount} employees!`
    );
  };

  return (
    <div className="space-y-5">
      {/* Create New Bonus Form Card */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-4 shadow-2xs">
        <div className="border-b border-border/80 pb-3">
          <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span>{isBangla ? "নতুন উৎসব বা পারফরম্যান্স বোনাস প্রসেস (Bonus Pay)" : "Disburse Festival & Performance Bonus"}</span>
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Process Eid, Festival, Performance, or One-Time bonuses separately from monthly payroll runs.
          </p>
        </div>

        <form onSubmit={handleCreateBonus} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground">Bonus Category *</Label>
              <Select value={bonusType} onValueChange={(val: any) => setBonusType(val)}>
                <SelectTrigger className="h-9 text-xs bg-background/50 border-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Eid Bonus" className="text-xs font-semibold">Eid Bonus</SelectItem>
                  <SelectItem value="Festival Bonus" className="text-xs font-semibold">Festival Bonus</SelectItem>
                  <SelectItem value="Performance Bonus" className="text-xs font-semibold">Performance Bonus</SelectItem>
                  <SelectItem value="One-Time Bonus" className="text-xs font-semibold">One-Time Bonus</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground">Bonus Title *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Eid Bonus 2026"
                className="h-9 bg-background/50 text-xs border-input"
              />
            </div>

            <BranchSelector
              value={branchName}
              onChange={setBranchName}
              isBangla={isBangla}
              compact
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground">Amount Per Employee (৳) *</Label>
              <Input
                type="number"
                value={amountPerEmp}
                onChange={(e) => setAmountPerEmp(parseFloat(e.target.value) || 0)}
                className="h-9 bg-background/50 text-xs border-input font-mono font-bold text-base"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground">Disbursement Date *</Label>
              <Input
                type="date"
                value={disbursedDate}
                onChange={(e) => setDisbursedDate(e.target.value)}
                className="h-9 bg-background/50 text-xs border-input font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              className="h-9 px-4 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white gap-1.5 cursor-pointer shadow-xs rounded-lg"
            >
              <Gift className="h-4 w-4" />
              <span>Process & Disburse Bonus</span>
            </Button>
          </div>
        </form>
      </div>

      {/* Bonus Disbursed History Table */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-3 shadow-2xs">
        <h4 className="font-bold text-foreground text-xs uppercase tracking-wider border-b border-border/60 pb-2">
          Bonus Disbursement History
        </h4>

        <div className="border border-border/80 rounded-xl overflow-hidden text-xs">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 text-[10px] uppercase font-semibold">
                <TableHead>Bonus Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Disbursed Date</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bonuses.map((b) => (
                <TableRow key={b.id} className="hover:bg-muted/15">
                  <TableCell className="font-bold text-foreground">{b.title}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-[11px]">{b.bonusType}</TableCell>
                  <TableCell className="text-muted-foreground">{b.branchName}</TableCell>
                  <TableCell className="font-mono font-bold">{b.employeeCount} Staff</TableCell>
                  <TableCell className="font-mono font-bold text-purple-600 dark:text-purple-400">
                    {formatCurrency(b.totalBonusAmount)}
                  </TableCell>
                  <TableCell className="font-mono text-muted-foreground">{b.disbursedDate}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/20 text-[10px] font-bold">
                      Disbursed
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
