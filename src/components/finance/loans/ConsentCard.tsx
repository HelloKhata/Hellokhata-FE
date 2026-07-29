"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck, Lock, ArrowRight, ArrowLeft, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConsentCardProps {
  initialConsent: boolean;
  onContinue: (consentAgreed: boolean) => void;
  onBack: () => void;
  isBangla?: boolean;
}

export function ConsentCard({
  initialConsent,
  onContinue,
  onBack,
  isBangla = false,
}: ConsentCardProps) {
  const [agreed, setAgreed] = useState<boolean>(initialConsent);

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-4 shadow-2xs">
      <div className="border-b border-border/80 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>{isBangla ? "ধাপ ৩: লেনদেন শেয়ারিং সম্মতি (Share Consent)" : "Step 3: Share Consent"}</span>
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {isBangla
              ? "ব্যাংক লোন মূল্যায়নের জন্য আপনার সম্মতি প্রদান করুন।"
              : "Grant permission to securely share transaction history with our partner bank."}
          </p>
        </div>
        <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full border border-primary/20">
          Step 3 / 5
        </span>
      </div>

      <div className="space-y-4 text-xs">
        {/* Dedicated Consent Card Banner */}
        <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-3">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5">
              <Lock className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-foreground text-xs sm:text-sm">
                {isBangla ? "নিরাপদ ডাটা এনক্রিপশন ও সম্মতি" : "Secure Partner Bank Authorization"}
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                {isBangla
                  ? "আবেদনটি সামনে এগিয়ে নেওয়ার মাধ্যমে আপনি হ্যালো খাতা-কে অনুমোদিত ব্যাংক পার্টনারের সাথে আপনার বিক্রয় ও জমা হিসাব এনক্রিপ্ট আকারে শেয়ার করার অনুমতি দিচ্ছেন।"
                  : "By continuing, you allow HelloKhata to securely share your transaction history with our partner bank for loan evaluation."}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-emerald-500/10 flex items-center gap-2 text-[11px] text-muted-foreground">
            <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>
              {isBangla
                ? "বাংলাদেশ ব্যাংক লাইসেন্সপ্রাপ্ত সিডিবিএল ও বাণিজ্যিক ব্যাংক পার্টনার।"
                : "Partner Banks: Dutch-Bangla Bank, City Bank, Brac Bank SME Loan."}
            </span>
          </div>
        </div>

        {/* Required Explicit Consent Checkbox */}
        <div className="p-3.5 bg-background/50 border border-border/80 rounded-xl flex items-start gap-3">
          <Checkbox
            id="loan-consent-checkbox"
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(!!checked)}
            className="mt-0.5 cursor-pointer"
          />
          <label
            htmlFor="loan-consent-checkbox"
            className="text-xs font-semibold text-foreground cursor-pointer select-none leading-normal"
          >
            {isBangla
              ? "আমি নিশ্চিত করছি যে আমি ব্যাংক লোন মূল্যায়নের জন্য আমার হ্যালো খাতার আর্থিক লেনদেন ডাটা শেয়ার করতে সম্মত।"
              : "I agree to share my financial history securely with partner banks for business loan evaluation."}
          </label>
        </div>
      </div>

      {/* Stepper Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-border/60">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-9 px-3 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer rounded-lg"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />
          <span>{isBangla ? "পেছনে" : "Back"}</span>
        </Button>

        <Button
          type="button"
          disabled={!agreed}
          onClick={() => onContinue(true)}
          className={cn(
            "h-9 px-4 text-xs font-semibold gap-1.5 cursor-pointer rounded-lg shadow-xs transition-all",
            agreed
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
          )}
        >
          <span>{isBangla ? "পরবর্তী ধাপ (Continue)" : "Continue"}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
