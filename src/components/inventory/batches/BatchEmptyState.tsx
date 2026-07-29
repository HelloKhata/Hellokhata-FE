"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Package, RefreshCw, AlertCircle, FilterX } from "lucide-react";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface BatchEmptyStateProps {
  type: "no_data" | "filtered_empty" | "error";
  onAction?: () => void;
  onResetFilters?: () => void;
}

export function BatchEmptyState({
  type,
  onAction,
  onResetFilters,
}: BatchEmptyStateProps) {
  const { isBangla } = useAppTranslation();

  if (type === "error") {
    return (
      <Card className="border border-border/60 shadow-xs">
        <CardContent className="py-12 text-center space-y-3">
          <AlertCircle className="h-10 w-10 mx-auto text-rose-500 opacity-80" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">
              {isBangla ? "ডাটা লোড করতে সমস্যা হয়েছে" : "Failed to load batches"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isBangla
                ? "অনুগ্রহ করে আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন এবং পুনরায় চেষ্টা করুন।"
                : "Please check your network connection and try again."}
            </p>
          </div>
          {onAction && (
            <Button size="sm" onClick={onAction} className="h-8 text-xs font-semibold cursor-pointer">
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              {isBangla ? "পুনরায় চেষ্টা" : "Retry"}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (type === "filtered_empty") {
    return (
      <Card className="border border-border/60 shadow-xs">
        <CardContent className="py-12 text-center space-y-3">
          <FilterX className="h-10 w-10 mx-auto text-muted-foreground/60" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">
              {isBangla ? "কোনো ব্যাচ মিলেনি" : "No batches match your filters"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isBangla
                ? "অন্য কোনো ফিল্টার বা অনুসন্ধান শব্দ প্রয়োগ করার চেষ্টা করুন।"
                : "Try adjusting or clearing your active search and filter parameters."}
            </p>
          </div>
          {onResetFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="h-8 text-xs font-semibold cursor-pointer"
            >
              {isBangla ? "ফিল্টার রিসেট করুন" : "Clear Filters"}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/60 shadow-xs">
      <CardContent className="py-12 text-center space-y-3">
        <Package className="h-12 w-12 mx-auto text-muted-foreground/40" />
        <div className="space-y-1">
          <h3 className="text-base font-bold text-foreground">
            {isBangla ? "কোনো ব্যাচ পাওয়া যায়নি" : "No Batches Found"}
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {isBangla
              ? "আপনার ইনভেন্টরিতে এখনো কোনো ব্যাচ যোগ করা হয়নি। ক্রয় করার সময় স্বয়ক্রিয়ভাবে ব্যাচ যুক্ত হবে।"
              : "No batches are registered in your inventory yet. Batches will be automatically created when you perform stock-in or purchase orders."}
          </p>
        </div>
        {onAction && (
          <Button size="sm" onClick={onAction} className="h-9 text-xs font-bold cursor-pointer">
            {isBangla ? "স্টক ইন এ যান" : "Go to Stock In"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
