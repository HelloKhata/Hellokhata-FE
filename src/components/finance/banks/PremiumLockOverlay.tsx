"use client";

import React from "react";
import { Lock, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface PremiumLockOverlayProps {
  onUnlockClick?: () => void;
  isBangla?: boolean;
}

export function PremiumLockOverlay({
  onUnlockClick,
  isBangla = false,
}: PremiumLockOverlayProps) {
  const handleUpgrade = () => {
    if (onUnlockClick) {
      onUnlockClick();
    } else {
      toast.info(
        isBangla
          ? "প্রিমিয়াম প্ল্যান আপগ্রেড পৃষ্ঠা খোলা হচ্ছে..."
          : "Opening Premium plan upgrade modal..."
      );
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-amber-500/30">
      {/* Blurred Preview Container */}
      <div className="filter blur-md pointer-events-none select-none opacity-40 p-6 space-y-4 bg-card">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-32 bg-muted rounded-xl" />
          <div className="h-32 bg-muted rounded-xl" />
        </div>
        <div className="h-40 bg-muted rounded-xl" />
      </div>

      {/* Lock Overlay Modal Box */}
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center bg-background/80 backdrop-blur-md space-y-4">
        <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-sm">
          <Lock className="h-7 w-7" />
        </div>

        <div className="space-y-1.5 max-w-md">
          <div className="flex items-center justify-center gap-1.5">
            <Badge className="bg-amber-500 text-white border-none text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5">
              <Sparkles className="h-3 w-3 mr-1" /> PREMIUM FEATURE
            </Badge>
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-foreground">
            {isBangla
              ? "স্মার্ট ব্যাংক মেলানো ফিচার আনলক করুন"
              : "Unlock Bank Statement Reconciliation"}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {isBangla
              ? "আপনার ব্যাংক ও বিকাশ/নগদ স্টেটমেন্ট হ্যালো খাতার লেনদেনের সাথে স্বয়ংক্রিয়ভাবে মিলিযে নিতে প্রিমিয়াম প্ল্যানে আপগ্রেড করুন।"
              : "Reconcile actual bank and mobile wallet statements with recorded transactions using automated CSV matching and column mapping."}
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            {isBangla ? "অটোমেটেড সিএসভি ম্যাচিং" : "Automated CSV Matcher"}
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            {isBangla ? "সঠিক ব্যাংক হিসাব নিকাশ" : "Accountant Workspace"}
          </span>
        </div>

        <Button
          type="button"
          onClick={handleUpgrade}
          className="h-10 px-6 text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white gap-2 cursor-pointer shadow-md rounded-xl"
        >
          <span>{isBangla ? "প্রিমিয়াম আপগ্রেড করুন" : "Upgrade to Premium"}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
