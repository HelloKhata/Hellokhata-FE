"use client";

import React from "react";
import { LoanApplicationStatus, LoanApplicationRecord } from "@/types/loan";
import { useCurrency } from "@/hooks/useAppTranslation";
import { CheckCircle2, Clock, ShieldAlert, Building2, Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoanStatusTimelineProps {
  application: LoanApplicationRecord;
  isBangla?: boolean;
}

export function LoanStatusTimeline({
  application,
  isBangla = false,
}: LoanStatusTimelineProps) {
  const { formatCurrency } = useCurrency();

  const steps: { key: LoanApplicationStatus; title: string; titleBn: string; desc: string; descBn: string }[] = [
    {
      key: "submitted",
      title: "Submitted",
      titleBn: "আবেদন জমা হয়েছে",
      desc: "Application & HelloKhata data securely transferred.",
      descBn: "আপনার লেনদেনের ডাটা পার্টনার ব্যাংকে পাঠানো হয়েছে।",
    },
    {
      key: "under_review",
      title: "Under Review",
      titleBn: "ব্যাংক মূল্যায়নাধীন",
      desc: "Partner bank automated desk is evaluating history.",
      descBn: "ব্যাংক পার্টনার সিস্টেম স্বয়ংক্রিয়ভাবে যোগ্যতা যাঁচাই করছে।",
    },
    {
      key: "approved",
      title: "Approved",
      titleBn: "ঋণ অনুমোদিত",
      desc: "Loan offer & limit approved by partner bank.",
      descBn: "অভিনন্দন! আপনার ব্যবসায়িক লোন অনুমোদিত হয়েছে।",
    },
    {
      key: "disbursed",
      title: "Disbursed",
      titleBn: "টাকা স্থানান্তরিত",
      desc: "Loan funds transferred directly to your bank account.",
      descBn: "লোনের টাকা আপনার ব্যাংক অ্যাকাউন্টে জমা হয়েছে।",
    },
  ];

  const getStepIndex = (status: LoanApplicationStatus) => {
    switch (status) {
      case "submitted":
        return 0;
      case "under_review":
        return 1;
      case "approved":
        return 2;
      case "disbursed":
        return 3;
      case "rejected":
        return -1;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(application.status);

  return (
    <div id="status-section" className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-4 shadow-2xs">
      <div className="border-b border-border/80 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>{isBangla ? "আবেদন ট্র্যাকিং ও স্ট্যাটাস (Application Status)" : "Application Status & Timeline"}</span>
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {isBangla
              ? "আপনার জমা দেওয়া লোন আবেদনের বর্তমান অগ্রগতি ট্র্যাক করুন।"
              : "Track the real-time evaluation status of your business loan."}
          </p>
        </div>
        <span className="text-[10px] bg-emerald-500/10 text-emerald-600 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
          ID: {application.id}
        </span>
      </div>

      {/* Overview Info Banner */}
      <div className="p-3.5 bg-background/50 border border-border/70 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <span className="text-[10px] text-muted-foreground uppercase block">Requested Amount</span>
          <span className="font-bold font-mono text-foreground text-sm">
            {formatCurrency(application.requestedAmount)}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground uppercase block">Submitted Date</span>
          <span className="font-bold font-mono text-foreground">
            {application.submittedAt || "Today"}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground uppercase block">Est. Processing</span>
          <span className="font-bold font-mono text-primary">24 - 48 Hours</span>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground uppercase block">Partner Bank</span>
          <span className="font-bold text-foreground flex items-center gap-1">
            <Building2 className="h-3 w-3 text-primary" /> Dutch-Bangla SME
          </span>
        </div>
      </div>

      {/* Visual Vertical Timeline */}
      <div className="space-y-4 pt-2">
        {steps.map((st, idx) => {
          const isDone = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={st.key} className="flex items-start gap-3 relative">
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute left-4 top-8 bottom-0 w-0.5 -ml-[1px]",
                    idx < currentIndex ? "bg-emerald-500" : "bg-border/60"
                  )}
                />
              )}

              {/* Status Circle Icon */}
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center shrink-0 z-10 font-bold text-xs transition-all border",
                  isDone
                    ? "bg-emerald-500 text-white border-emerald-500 shadow-2xs"
                    : "bg-muted text-muted-foreground border-border/80"
                )}
              >
                {isDone ? <Check className="h-4 w-4" /> : idx + 1}
              </div>

              {/* Status Details */}
              <div className="space-y-0.5 pt-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-xs sm:text-sm text-foreground">
                    {isBangla ? st.titleBn : st.title}
                  </h4>
                  {isCurrent && (
                    <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-md animate-pulse">
                      In Progress
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {isBangla ? st.descBn : st.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
