"use client";

import React from "react";
import { ReceivableCustomer } from "@/types/receivable";
import { ReceivableRow, ReceivableCard } from "./ReceivableRow";

interface ReceivableTableProps {
  customers: ReceivableCustomer[];
  onViewDetails: (customer: ReceivableCustomer) => void;
  onRecordPayment: (customer: ReceivableCustomer) => void;
  onSendReminder: (customer: ReceivableCustomer) => void;
  isBangla?: boolean;
}

export function ReceivableTable({
  customers,
  onViewDetails,
  onRecordPayment,
  onSendReminder,
  isBangla = false,
}: ReceivableTableProps) {
  return (
    <div className="bg-card border border-border rounded-xl shadow-2xs overflow-hidden">
      <div className="px-4 py-3 border-b border-border/80 flex items-center justify-between bg-muted/20">
        <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
          <span>{isBangla ? "পাওনাদার গ্রাহকের তালিকা" : "Outstanding Customers"}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono font-bold">
            {customers.length}
          </span>
        </h3>
        <span className="text-[11px] text-muted-foreground">
          {isBangla ? "পাওনা পরিমাণ অনুযায়ী সাজানো" : "Sorted by outstanding due"}
        </span>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-muted/30 text-muted-foreground border-b border-border/80 font-semibold text-[11px] uppercase tracking-wider">
              <th className="px-4 py-3">{isBangla ? "গ্রাহকের নাম" : "Customer"}</th>
              <th className="px-4 py-3">{isBangla ? "পাওনা পরিমাণ" : "Outstanding Amount"}</th>
              <th className="px-4 py-3">{isBangla ? "বয়স (Aging)" : "Aging Bucket"}</th>
              <th className="px-4 py-3">{isBangla ? "শেষ পেমেন্ট" : "Last Payment"}</th>
              <th className="px-4 py-3">{isBangla ? "পরিশোধের তারিখ" : "Due Date"}</th>
              <th className="px-4 py-3">{isBangla ? "শাখা" : "Branch"}</th>
              <th className="px-4 py-3 text-right">{isBangla ? "অ্যাকশন" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {customers.map((customer) => (
              <ReceivableRow
                key={customer.id}
                customer={customer}
                onViewDetails={onViewDetails}
                onRecordPayment={onRecordPayment}
                onSendReminder={onSendReminder}
                isBangla={isBangla}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Responsive Cards View */}
      <div className="lg:hidden p-3 space-y-2.5">
        {customers.map((customer) => (
          <ReceivableCard
            key={customer.id}
            customer={customer}
            onViewDetails={onViewDetails}
            onRecordPayment={onRecordPayment}
            onSendReminder={onSendReminder}
            isBangla={isBangla}
          />
        ))}
      </div>
    </div>
  );
}
