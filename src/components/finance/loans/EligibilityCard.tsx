"use client";

import React from "react";
import { EligibilityStatus } from "@/types/loan";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/hooks/useAppTranslation";
import { CheckCircle2, TrendingUp, DollarSign, Wallet, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EligibilityCardProps {
  status: EligibilityStatus;
  estimatedLoanLimit?: number;
  onApplyNow: () => void;
  isBangla?: boolean;
}

export function EligibilityFactorCard({
  title,
  titleBn,
  statusText,
  statusTextBn,
  icon: Icon,
  color,
  isBangla = false,
}: {
  title: string;
  titleBn: string;
  statusText: string;
  statusTextBn: string;
  icon: any;
  color: string;
  isBangla?: boolean;
}) {
  return (
    <div className="bg-card border border-border/70 rounded-xl p-3.5 space-y-2 shadow-2xs">
      <div className="flex items-center justify-between">
        <div className={cn("p-1.5 rounded-lg border", color)}>
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
          {isBangla ? "ইতিবাচক" : "Positive"}
        </span>
      </div>
      <div>
        <h4 className="text-xs font-bold text-foreground">
          {isBangla ? titleBn : title}
        </h4>
        <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
          {isBangla ? statusTextBn : statusText}
        </p>
      </div>
    </div>
  );
}

export function EligibilityCard({
  status,
  estimatedLoanLimit = 500000,
  onApplyNow,
  isBangla = false,
}: EligibilityCardProps) {
  const { formatCurrency } = useCurrency();

  const getStatusBadge = () => {
    switch (status) {
      case "likely_eligible":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs px-3 py-1 font-bold">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-500" />
            {isBangla ? "ঋণ পাওয়ার যোগ্য (Likely Eligible)" : "Likely Eligible"}
          </Badge>
        );
      case "building_history":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs px-3 py-1 font-bold">
            <TrendingUp className="h-3.5 w-3.5 mr-1 text-amber-500" />
            {isBangla ? "হিসাব তৈরি হচ্ছে (Building History)" : "Building History"}
          </Badge>
        );
      case "not_enough_history":
        return (
          <Badge className="bg-muted text-muted-foreground border-border text-xs px-3 py-1 font-bold">
            {isBangla ? "পর্যাপ্ত লেনদেন নেই" : "Not Enough History"}
          </Badge>
        );
    }
  };

  return (
    <div id="eligibility-section" className="space-y-4">
      {/* Main Eligibility Signal Card */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-4">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              {isBangla ? "ঋণ যোগ্যতা সূচক (Eligibility Status)" : "Eligibility Status"}
            </span>
            <div className="flex items-center gap-3">
              {getStatusBadge()}
            </div>
          </div>

          {status === "likely_eligible" && (
            <div className="bg-emerald-500/5 border border-emerald-500/20 px-3.5 py-2 rounded-xl text-left sm:text-right">
              <span className="text-[10px] text-muted-foreground uppercase block font-medium">
                {isBangla ? "আনুমানিক লোন লিমিট" : "Estimated Loan Eligibility"}
              </span>
              <span className="text-base sm:text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {formatCurrency(estimatedLoanLimit)}
              </span>
            </div>
          )}
        </div>

        {/* Friendly Explanation Text */}
        <div className="p-3.5 bg-muted/20 border border-border/60 rounded-xl space-y-1 text-xs">
          <p className="text-foreground font-medium">
            {isBangla
              ? "আপনার ব্যবসা গত কয়েক মাসে ধারাবাহিকভাবে ভালো বিক্রি ও লেনদেন বজায় রেখেছে। হ্যালো খাতার ডাটা অনুযায়ী আপনি লোন আবেদনের উপযুক্ত।"
              : "Your business has shown consistent sales and income over the past few months. Based on your HelloKhata records, you qualify for a partner bank loan."}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {isBangla
              ? "ব্যাংক কোনো ম্যানুয়াল সিআরজি বা ক্রেডিট স্কোর চালায় না। লেনদেনের ধারাবাহিকতাই আপনার মূল শক্তি।"
              : "HelloKhata automatically verifies your business volume without manual paperwork or credit scoring."}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-1 flex justify-end">
          <Button
            type="button"
            onClick={onApplyNow}
            className="h-10 px-5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white gap-2 cursor-pointer shadow-xs rounded-lg"
          >
            <span>{isBangla ? "আবেদন শুরু করুন" : "Apply For Loan"}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 4 Eligibility Factors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <EligibilityFactorCard
          title="Consistent Income"
          titleBn="ধারাবাহিক আয়"
          statusText="Monthly cash sales and sales receipts are regular and steady."
          statusTextBn="প্রতি মাসের ক্যাশ বিক্রি এবং পেমেন্ট নিয়মিত।"
          icon={TrendingUp}
          color="bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
          isBangla={isBangla}
        />
        <EligibilityFactorCard
          title="Receivables Recovery"
          titleBn="পাওনা আদায়"
          statusText="Customer credit dues are collected within healthy timeframes."
          statusTextBn="গ্রাহকদের কাছে বাকি পাওনা সময়মত আদায় হচ্ছে।"
          icon={DollarSign}
          color="bg-blue-500/10 text-blue-500 border-blue-500/20"
          isBangla={isBangla}
        />
        <EligibilityFactorCard
          title="Payables Discipline"
          titleBn="সরবরাহকারী পেমেন্ট"
          statusText="Supplier bills and inventory dues are cleared responsibly."
          statusTextBn="সরবরাহকারীদের বিল নিয়মিত পরিশোধ করা হচ্ছে।"
          icon={Wallet}
          color="bg-purple-500/10 text-purple-500 border-purple-500/20"
          isBangla={isBangla}
        />
        <EligibilityFactorCard
          title="Active History"
          titleBn="সক্রিয় হিসাব"
          statusText="Daily register entries provide verified business activity."
          statusTextBn="দৈনিক লেনদেন হিসাব ধারাবাহিকভাবে ট্র্যাক হচ্ছে।"
          icon={ShieldCheck}
          color="bg-amber-500/10 text-amber-500 border-amber-500/20"
          isBangla={isBangla}
        />
      </div>
    </div>
  );
}
