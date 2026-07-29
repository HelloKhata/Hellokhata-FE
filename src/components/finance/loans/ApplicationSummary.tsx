"use client";

import React, { useState } from "react";
import { BusinessInfo, KYCDocuments } from "@/types/loan";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Building2, FileText, ShieldCheck, Loader2, ArrowLeft } from "lucide-react";
import { useCurrency } from "@/hooks/useAppTranslation";
import { cn } from "@/lib/utils";

interface ApplicationSummaryProps {
  businessInfo: BusinessInfo;
  kyc: KYCDocuments;
  consentAgreed: boolean;
  onSubmit: (requestedAmount: number) => void;
  onBack: () => void;
  isBangla?: boolean;
}

export function ApplicationSummary({
  businessInfo,
  kyc,
  consentAgreed,
  onSubmit,
  onBack,
  isBangla = false,
}: ApplicationSummaryProps) {
  const { formatCurrency } = useCurrency();

  const [requestedAmount, setRequestedAmount] = useState<string>("300000");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(requestedAmount) || 300000;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit(numericAmount);
    }, 600);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-4 shadow-2xs">
      <div className="border-b border-border/80 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>{isBangla ? "ধাপ ৪: আবেদন সামারি ও জমা (Submit Application)" : "Step 4: Application Summary"}</span>
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {isBangla
              ? "লোনের জন্য চাওয়া পরিমাণ লিখুন এবং আবেদন জমা দিন।"
              : "Review your application details and enter requested loan amount."}
          </p>
        </div>
        <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full border border-primary/20">
          Step 4 / 5
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Requested Amount */}
        <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-2">
          <Label className="text-xs font-bold text-foreground block">
            {isBangla ? "আবেদনকৃত লোন পরিমাণ (Requested Amount) *" : "Requested Loan Amount *"}
          </Label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-base font-bold text-muted-foreground font-mono">
              ৳
            </span>
            <Input
              type="number"
              inputMode="decimal"
              step="10000"
              min="50000"
              max="500000"
              value={requestedAmount}
              onChange={(e) => setRequestedAmount(e.target.value)}
              className="pl-9 h-11 text-lg font-bold font-mono bg-background border-input"
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            {isBangla
              ? "সর্বোচ্চ লোন লিমিট: ৳৫০,০০০ থেকে ৳৫০০,০০০ পর্যন্ত"
              : "Available Limit: ৳50,000 to ৳500,000 based on transaction history."}
          </p>
        </div>

        {/* Business Info Summary */}
        <div className="p-3.5 bg-background/50 border border-border/70 rounded-xl space-y-2">
          <div className="flex items-center justify-between border-b border-border/50 pb-1.5 font-bold text-foreground">
            <span className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-primary" />
              <span>{isBangla ? "প্রতিষ্ঠানের বিবরণ" : "Business Details"}</span>
            </span>
            <span className="text-emerald-500 text-[10px]">Verified</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
            <div>
              <span className="block text-[10px] uppercase">Business Name</span>
              <strong className="text-foreground">{businessInfo.businessName}</strong>
            </div>
            <div>
              <span className="block text-[10px] uppercase">Owner</span>
              <strong className="text-foreground">{businessInfo.ownerName}</strong>
            </div>
            <div>
              <span className="block text-[10px] uppercase">Phone</span>
              <strong className="text-foreground font-mono">{businessInfo.phone}</strong>
            </div>
            <div>
              <span className="block text-[10px] uppercase">Type</span>
              <strong className="text-foreground">{businessInfo.businessType}</strong>
            </div>
          </div>
        </div>

        {/* KYC & Consent Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-background/50 border border-border/70 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <FileText className="h-3.5 w-3.5 text-amber-500" />
              <span>{isBangla ? "কেওয়াইসি কাগজপত্র" : "KYC Documents"}</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              {kyc.tradeLicenseName ? kyc.tradeLicenseName : "Documents Uploaded"}
            </p>
          </div>

          <div className="p-3 bg-background/50 border border-border/70 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>{isBangla ? "সম্মতি স্ট্যাটাস" : "Consent Agreement"}</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              {isBangla ? "অনুমতি প্রদান করা হয়েছে" : "Explicit Consent Granted"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border/60">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isSubmitting}
            className="h-9 px-3 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer rounded-lg"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            <span>{isBangla ? "পেছনে" : "Back"}</span>
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-10 px-5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-2 cursor-pointer rounded-lg shadow-xs"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{isBangla ? "জমা হচ্ছে..." : "Submitting..."}</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>{isBangla ? "আবেদন জমা দিন (Submit Loan)" : "Submit Loan Application"}</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
