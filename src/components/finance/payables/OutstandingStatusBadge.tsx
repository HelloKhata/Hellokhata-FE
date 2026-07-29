"use client";

import React from "react";
import { PayableStatus, PayableAgingBucket } from "@/types/payable";
import { Badge } from "@/components/ui/badge";

interface OutstandingStatusBadgeProps {
  status: PayableStatus;
  isBangla?: boolean;
}

export function OutstandingStatusBadge({
  status,
  isBangla = false,
}: OutstandingStatusBadgeProps) {
  switch (status) {
    case "unpaid":
      return (
        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px] font-semibold">
          {isBangla ? "অপরিশোধিত (Unpaid)" : "Unpaid"}
        </Badge>
      );
    case "partial":
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 text-[10px] font-semibold">
          {isBangla ? "আংশিক পরিশোধ (Partial)" : "Partially Paid"}
        </Badge>
      );
    case "paid":
      return (
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-semibold">
          {isBangla ? "পরিশোধিত (Paid)" : "Paid"}
        </Badge>
      );
    case "overdue":
      return (
        <Badge variant="outline" className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 text-[10px] font-semibold">
          {isBangla ? "ওভারডিউ (Overdue)" : "Overdue"}
        </Badge>
      );
  }
}

export function PayableAgingBadge({
  bucket,
  isBangla = false,
}: {
  bucket: PayableAgingBucket;
  isBangla?: boolean;
}) {
  switch (bucket) {
    case "current":
      return (
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-semibold">
          {isBangla ? "চলতি" : "Current"}
        </Badge>
      );
    case "30_days":
      return (
        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px] font-semibold">
          {isBangla ? "৩০+ দিন" : "30+ Days"}
        </Badge>
      );
    case "60_days":
      return (
        <Badge variant="outline" className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 text-[10px] font-semibold">
          {isBangla ? "৬০+ দিন" : "60+ Days"}
        </Badge>
      );
    case "90_days":
      return (
        <Badge variant="outline" className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 text-[10px] font-semibold">
          {isBangla ? "৯০+ দিন" : "90+ Days"}
        </Badge>
      );
  }
}
