"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoanStepperProps {
  currentStep: number; // 1 to 5
  onStepClick: (step: number) => void;
  isBangla?: boolean;
}

export function LoanStepper({
  currentStep,
  onStepClick,
  isBangla = false,
}: LoanStepperProps) {
  const steps = [
    { num: 1, title: "Business Info", titleBn: "ব্যবসার তথ্য" },
    { num: 2, title: "KYC Upload", titleBn: "কেওয়াইসি" },
    { num: 3, title: "Consent", titleBn: "সম্মতি" },
    { num: 4, title: "Summary", titleBn: "রিভিউ" },
    { num: 5, title: "Status", titleBn: "স্ট্যাটাস" },
  ];

  return (
    <div className="bg-card border border-border/80 rounded-xl p-3 sm:p-4 shadow-2xs">
      <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
        {steps.map((st, idx) => {
          const isCompleted = currentStep > st.num;
          const isCurrent = currentStep === st.num;

          return (
            <React.Fragment key={st.num}>
              {/* Step item */}
              <button
                type="button"
                onClick={() => onStepClick(st.num)}
                className={cn(
                  "flex items-center gap-2 p-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer select-none",
                  isCurrent
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-2xs font-bold"
                    : isCompleted
                    ? "text-emerald-600 dark:text-emerald-400 hover:bg-muted/50"
                    : "text-muted-foreground hover:bg-muted/30"
                )}
              >
                <div
                  className={cn(
                    "h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors",
                    isCompleted
                      ? "bg-emerald-500 text-white"
                      : isCurrent
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="h-3.5 w-3.5" /> : st.num}
                </div>

                <span className="hidden sm:inline text-xs">
                  {isBangla ? st.titleBn : st.title}
                </span>
              </button>

              {/* Separator line between steps */}
              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 min-w-[12px] sm:min-w-[20px] transition-colors rounded-full",
                    currentStep > st.num ? "bg-emerald-500/60" : "bg-border/60"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
