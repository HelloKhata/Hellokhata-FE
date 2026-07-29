"use client";

import React, { useState } from "react";
import { SalaryStructure, SalaryComponent } from "../types";
import { MOCK_SALARY_STRUCTURES } from "../constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SlidersHorizontal, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { useCurrency } from "@/hooks/useAppTranslation";
import { toast } from "sonner";

interface SalaryStructureCardProps {
  isBangla?: boolean;
}

export function SalaryStructureCard({ isBangla = false }: SalaryStructureCardProps) {
  const { formatCurrency } = useCurrency();
  const [structures, setStructures] = useState<SalaryStructure[]>(MOCK_SALARY_STRUCTURES);

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-4 shadow-2xs">
      <div className="border-b border-border/80 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            <span>{isBangla ? "বেতন কাঠামো টেমপ্লেট (Salary Structures)" : "Reusable Salary Structure Templates"}</span>
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Configure reusable salary components (Basic, Allowances, Deductions) assigned to employee roles.
          </p>
        </div>
      </div>

      <div className="border border-border/80 rounded-xl overflow-hidden text-xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 text-[10px] uppercase font-semibold">
              <TableHead>Employee Name</TableHead>
              <TableHead>Role & Branch</TableHead>
              <TableHead>Basic Salary</TableHead>
              <TableHead>Allowances Total</TableHead>
              <TableHead>Deductions Total</TableHead>
              <TableHead className="text-right">Net Monthly Salary</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {structures.map((s) => (
              <TableRow key={s.id} className="hover:bg-muted/15">
                <TableCell className="font-bold text-foreground">{s.employeeName}</TableCell>
                <TableCell className="text-muted-foreground text-[11px]">
                  {s.role} • {s.branchName}
                </TableCell>
                <TableCell className="font-mono font-semibold text-foreground">
                  {formatCurrency(s.basicSalary)}
                </TableCell>
                <TableCell className="font-mono text-emerald-600 font-semibold">
                  +{formatCurrency(s.allowances.reduce((sum, a) => sum + a.amount, 0))}
                </TableCell>
                <TableCell className="font-mono text-rose-600 font-semibold">
                  -{formatCurrency(s.deductions.reduce((sum, d) => sum + d.amount, 0))}
                </TableCell>
                <TableCell className="text-right font-mono font-bold text-foreground text-sm">
                  {formatCurrency(s.netSalary)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
