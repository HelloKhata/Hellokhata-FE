"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRightLeft,
  ClipboardCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface WarehouseQuickActionsProps {
  isBangla?: boolean;
}

export function WarehouseQuickActions({ isBangla = false }: WarehouseQuickActionsProps) {
  const router = useRouter();

  return (
    <div className="bg-card border border-border/70 rounded-xl p-3 shadow-xs">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* 1. Receive Stock (GRN) */}
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/purchases/new")}
          className="h-9 text-xs font-semibold gap-2 border-border/80 hover:border-emerald-500/50 hover:bg-emerald-500/5 cursor-pointer justify-start px-3"
        >
          <div className="h-6 w-6 rounded-md bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <ArrowDownLeft className="h-3.5 w-3.5" />
          </div>
          <span className="truncate">{isBangla ? "পণ্য গ্রহণ (GRN)" : "Receive Stock (GRN)"}</span>
        </Button>

        {/* 2. Dispatch Stock */}
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/sales/new")}
          className="h-9 text-xs font-semibold gap-2 border-border/80 hover:border-purple-500/50 hover:bg-purple-500/5 cursor-pointer justify-start px-3"
        >
          <div className="h-6 w-6 rounded-md bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
          <span className="truncate">{isBangla ? "পণ্য প্রেরণ (Dispatch)" : "Dispatch Stock"}</span>
        </Button>

        {/* 3. Transfer Stock */}
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/inventory/warehouse/transfers/new")}
          className="h-9 text-xs font-semibold gap-2 border-border/80 hover:border-blue-500/50 hover:bg-blue-500/5 cursor-pointer justify-start px-3"
        >
          <div className="h-6 w-6 rounded-md bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
            <ArrowRightLeft className="h-3.5 w-3.5" />
          </div>
          <span className="truncate">{isBangla ? "স্টক ট্রান্সফার" : "Transfer Stock"}</span>
        </Button>

        {/* 4. Stock Count / Audit */}
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            toast.info(
              isBangla
                ? "ফিজিক্যাল ইনভেন্টরি অডিট মডিউল চালু হচ্ছে..."
                : "Opening physical inventory audit module..."
            );
          }}
          className="h-9 text-xs font-semibold gap-2 border-border/80 hover:border-amber-500/50 hover:bg-amber-500/5 cursor-pointer justify-start px-3"
        >
          <div className="h-6 w-6 rounded-md bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <ClipboardCheck className="h-3.5 w-3.5" />
          </div>
          <span className="truncate">{isBangla ? "স্টক কাউন্ট ও অডিট" : "Stock Count / Audit"}</span>
        </Button>
      </div>
    </div>
  );
}
