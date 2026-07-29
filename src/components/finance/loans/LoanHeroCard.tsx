"use client";

import React from "react";
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Building2, TrendingUp, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/hooks/useAppTranslation";

interface LoanHeroCardProps {
  onCheckEligibility: () => void;
  onLearnMore: () => void;
  isBangla?: boolean;
}

export function LoanHeroCard({
  onCheckEligibility,
  onLearnMore,
  isBangla = false,
}: LoanHeroCardProps) {
  const { formatCurrency } = useCurrency();

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-5 sm:p-7 shadow-2xs relative overflow-hidden bg-gradient-to-br from-primary/5 via-card to-background">
      {/* Background Decorative Blur Element */}
      <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        {/* Left Content Area */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-primary shrink-0" />
            <span>
              {isBangla
                ? "অটোমেটেড বুককিপিং স্মার্ট লোন"
                : "Automated Bookkeeping Smart Loan"}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
            {isBangla
              ? "বিজনেস লোন দিয়ে আপনার ব্যবসার পরিধি বড় করুন"
              : "Grow Your Business with a Business Loan"}
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {isBangla
              ? "হ্যালো খাতার মাধ্যমে আপনার দৈনন্দিন লেনদেন হিসাব রাখার ফলে কোনো ম্যানুয়াল ডকুমেন্টেশন ছাড়াই আপনি সহজেই লোন পাওয়ার যোগ্যতা অর্জন করতে পারেন।"
              : "Your business history in HelloKhata helps determine your loan eligibility automatically without requiring additional financial statements."}
          </p>

          {/* Key Trust Highlights */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-muted-foreground pt-1">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>{isBangla ? "কোনো বাড়তি কাগজপত্রের ঝামেলা নেই" : "No manual financial statements"}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
              <span>{isBangla ? "অনুমোদিত ব্যাংক পার্টনার" : "Partner bank evaluation"}</span>
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              type="button"
              onClick={onCheckEligibility}
              className="h-10 px-5 text-xs sm:text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground gap-2 cursor-pointer shadow-xs rounded-xl"
            >
              <span>{isBangla ? "যোগ্যতা যাঁচাই করুন" : "Check Eligibility"}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onLearnMore}
              className="h-10 px-4 text-xs font-semibold border-input text-foreground hover:bg-muted cursor-pointer rounded-xl bg-background/50"
            >
              <span>{isBangla ? "আরও জানুন" : "Learn More"}</span>
            </Button>
          </div>
        </div>

        {/* Right Visual Feature Card */}
        <div className="lg:col-span-5">
          <div className="bg-background/80 backdrop-blur-xs border border-border/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5 relative">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">
                    {isBangla ? "স্মার্ট লোন লিমিট" : "Pre-Qualified Loan"}
                  </h4>
                  <span className="text-[10px] text-muted-foreground">
                    {isBangla ? "লেনদেন বিশ্লেষণের ওপর ভিত্তি করে" : "Based on HelloKhata Activity"}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Likely Eligible
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-medium block">
                {isBangla ? "আনুমানিক লোন যোগ্যতা" : "Estimated Eligibility Up To"}
              </span>
              <p className="text-xl sm:text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {formatCurrency(500000)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50 text-[11px]">
              <div className="p-2 rounded-lg bg-muted/30 border border-border/40 space-y-0.5">
                <span className="text-[10px] text-muted-foreground block">Processing Time</span>
                <span className="font-bold text-foreground font-mono">24-48 Hours</span>
              </div>
              <div className="p-2 rounded-lg bg-muted/30 border border-border/40 space-y-0.5">
                <span className="text-[10px] text-muted-foreground block">Interest Rate</span>
                <span className="font-bold text-foreground font-mono">From 9% p.a.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
