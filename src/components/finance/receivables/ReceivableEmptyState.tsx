"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

interface ReceivableEmptyStateProps {
  isBangla?: boolean;
}

export function ReceivableEmptyState({ isBangla = false }: ReceivableEmptyStateProps) {
  return (
    <div className="bg-card border border-border/80 rounded-xl p-8 text-center space-y-4 shadow-2xs my-2 flex flex-col items-center justify-center min-h-[260px]">
      <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-xs">
        <CheckCircle2 className="h-7 w-7" />
      </div>

      <div className="space-y-1 max-w-sm">
        <h3 className="text-sm sm:text-base font-bold text-foreground">
          {isBangla ? "কোনো বকেয়া পাওয়া যায়নি" : "No outstanding receivables"}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {isBangla
            ? "সকল গ্রাহকের পেমেন্ট পরিশোধিত রয়েছে। কোনো বাকি থাকলে তা স্বয়ংক্রিয়ভাবে এখানে প্রদর্শন করা হবে।"
            : "All customer payments are up to date. Outstanding balances will appear here automatically."}
        </p>
      </div>
    </div>
  );
}
