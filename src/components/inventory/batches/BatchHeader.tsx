"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, Plus, RefreshCw, ListChecks } from "lucide-react";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useRouter } from "next/navigation";

interface BatchHeaderProps {
  totalBatches?: number;
  selectMode: boolean;
  onToggleSelectMode: () => void;
  onRefresh: () => void;
  onAddBatch?: () => void;
}

export function BatchHeader({
  totalBatches = 0,
  selectMode,
  onToggleSelectMode,
  onRefresh,
  onAddBatch,
}: BatchHeaderProps) {
  const { isBangla } = useAppTranslation();
  const router = useRouter();

  return (
    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-xs border-b border-border/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Title & Description */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/inventory")}
              className="h-9 w-9 cursor-pointer text-muted-foreground hover:text-foreground"
              aria-label="Back to inventory"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-foreground tracking-tight">
                  <Package className="h-5 w-5 text-primary" />
                  {isBangla ? "ব্যাচ ট্র্যাকিং ও ম্যানেজমেন্ট" : "Batch Management"}
                </h1>
                <Badge
                  variant="outline"
                  className="font-mono text-xs font-semibold bg-muted/50 border-border"
                >
                  {totalBatches} {isBangla ? "টি ব্যাচ" : "Batches"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isBangla
                  ? "সকল ইনভেন্টরি ব্যাচের মেয়াদ, স্টক পরিমাণ এবং হিস্ট্রি পরিচালনা করুন"
                  : "Track product lots, monitor expiries, cost prices, and stock movements"}
              </p>
            </div>
          </div>

          {/* Primary Actions (Right) */}
          <div className="flex items-center gap-2">
            <Button
              variant={selectMode ? "default" : "outline"}
              size="sm"
              onClick={onToggleSelectMode}
              className="h-9 text-xs font-semibold gap-1.5 cursor-pointer shadow-xs"
            >
              <ListChecks className="h-3.5 w-3.5" />
              {selectMode
                ? isBangla ? "বাতিল" : "Done"
                : isBangla ? "সিলেক্ট" : "Select"}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={onRefresh}
              className="h-9 w-9 cursor-pointer"
              title={isBangla ? "রিফ্রেশ" : "Refresh"}
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>

            <Button
              size="sm"
              onClick={onAddBatch || (() => router.push("/inventory/new"))}
              className="h-9 text-xs font-bold gap-1.5 cursor-pointer shadow-xs hidden sm:flex"
            >
              <Plus className="h-4 w-4" />
              {isBangla ? "নতুন ব্যাচ" : "Add Batch"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
