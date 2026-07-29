"use client";

import React from "react";
import { SupplierBill } from "@/types/payable";
import { SupplierBillRow, SupplierBillCard } from "./SupplierBillRow";

interface SupplierBillsTableProps {
  bills: SupplierBill[];
  onViewDetails: (bill: SupplierBill) => void;
  onPayNow: (bill: SupplierBill) => void;
  onEditBill: (bill: SupplierBill) => void;
  isBangla?: boolean;
}

export function SupplierBillsTable({
  bills,
  onViewDetails,
  onPayNow,
  onEditBill,
  isBangla = false,
}: SupplierBillsTableProps) {
  return (
    <div className="bg-card border border-border rounded-xl shadow-2xs overflow-hidden">
      <div className="px-4 py-3 border-b border-border/80 flex items-center justify-between bg-muted/20">
        <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
          <span>{isBangla ? "সরবরাহকারী বিলের তালিকা" : "Supplier Bills"}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono font-bold">
            {bills.length}
          </span>
        </h3>
        <span className="text-[11px] text-muted-foreground">
          {isBangla ? "প্রদেয় বকেয়া পরিমাণ অনুযায়ী সাজানো" : "Sorted by outstanding balance"}
        </span>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-muted/30 text-muted-foreground border-b border-border/80 font-semibold text-[11px] uppercase tracking-wider">
              <th className="px-4 py-3">{isBangla ? "সরবরাহকারী" : "Supplier"}</th>
              <th className="px-4 py-3">{isBangla ? "বিল নম্বর" : "Bill Number"}</th>
              <th className="px-4 py-3">{isBangla ? "প্রদেয় বকেয়া" : "Outstanding Amount"}</th>
              <th className="px-4 py-3">{isBangla ? "পরিশোধের তারিখ" : "Due Date"}</th>
              <th className="px-4 py-3">{isBangla ? "বয়স (Aging)" : "Aging Bucket"}</th>
              <th className="px-4 py-3">{isBangla ? "শাখা" : "Branch"}</th>
              <th className="px-4 py-3">{isBangla ? "স্ট্যাটাস" : "Status"}</th>
              <th className="px-4 py-3 text-right">{isBangla ? "অ্যাকশন" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {bills.map((bill) => (
              <SupplierBillRow
                key={bill.id}
                bill={bill}
                onViewDetails={onViewDetails}
                onPayNow={onPayNow}
                onEditBill={onEditBill}
                isBangla={isBangla}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Responsive Cards View */}
      <div className="lg:hidden p-3 space-y-2.5">
        {bills.map((bill) => (
          <SupplierBillCard
            key={bill.id}
            bill={bill}
            onViewDetails={onViewDetails}
            onPayNow={onPayNow}
            onEditBill={onEditBill}
            isBangla={isBangla}
          />
        ))}
      </div>
    </div>
  );
}
