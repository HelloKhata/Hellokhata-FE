"use client";

import React, { useState } from "react";
import { PayrollItem, PaymentMethod } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, CheckCircle2, Building2 } from "lucide-react";
import { useCurrency } from "@/hooks/useAppTranslation";
import { toast } from "sonner";

interface PayrollPaymentTableProps {
  items: PayrollItem[];
  onMarkPaid: (itemId: string, method: PaymentMethod) => void;
  isBangla?: boolean;
}

export function PayrollPaymentTable({
  items,
  onMarkPaid,
  isBangla = false,
}: PayrollPaymentTableProps) {
  const { formatCurrency } = useCurrency();
  const [selectedMethods, setSelectedMethods] = useState<Record<string, PaymentMethod>>({});

  const handlePayClick = (id: string) => {
    const method = selectedMethods[id] || "Bank";
    onMarkPaid(id, method);
    toast.success(isBangla ? `বেতন পরিশোধিত হিসেবে মার্ক করা হয়েছে (${method})` : `Payment processed via ${method}`);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-4 shadow-2xs">
      <div className="border-b border-border/80 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" />
            <span>{isBangla ? "বেতন পরিশোধ ট্র্যাকার (Payment Distribution)" : "Salary Payment Distribution"}</span>
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Process full or partial salary payments individually via Cash, Bank transfer, or bKash.
          </p>
        </div>
      </div>

      <div className="border border-border/80 rounded-xl overflow-hidden text-xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 text-[10px] uppercase font-semibold">
              <TableHead>Employee</TableHead>
              <TableHead>Role & Branch</TableHead>
              <TableHead>Net Payable</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/15">
                <TableCell className="font-bold text-foreground">{item.employeeName}</TableCell>
                <TableCell className="text-muted-foreground text-[11px]">
                  {item.role} • {item.branchName}
                </TableCell>
                <TableCell className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(item.netSalary)}
                </TableCell>
                <TableCell className="w-36">
                  {item.paymentStatus === "paid" ? (
                    <span className="font-mono font-semibold text-foreground text-[11px]">
                      {item.paymentMethod || "Bank"}
                    </span>
                  ) : (
                    <Select
                      value={selectedMethods[item.id] || "Bank"}
                      onValueChange={(val: any) =>
                        setSelectedMethods((prev) => ({ ...prev, [item.id]: val }))
                      }
                    >
                      <SelectTrigger className="h-8 text-xs bg-background/50 border-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bank" className="text-xs font-semibold">🏦 Bank Transfer</SelectItem>
                        <SelectItem value="bKash" className="text-xs font-semibold">📱 bKash Wallet</SelectItem>
                        <SelectItem value="Cash" className="text-xs font-semibold">💵 Cash Vault</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </TableCell>
                <TableCell>
                  {item.paymentStatus === "paid" ? (
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-bold">
                      Paid ({item.paidDate || "Today"})
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px] font-bold">
                      Pending
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {item.paymentStatus === "paid" ? (
                    <span className="text-[10px] text-muted-foreground font-mono">Completed</span>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handlePayClick(item.id)}
                      className="h-7 text-xs font-bold gap-1 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Mark Paid</span>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
