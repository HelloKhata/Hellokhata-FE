"use client";

import React, { useState } from "react";
import {
  EligibilityStatus,
  LoanApplicationStatus,
  BusinessInfo,
  KYCDocuments,
  LoanApplicationRecord,
  ActiveLoanDetails,
} from "@/types/loan";
import { LoanHeroCard } from "./LoanHeroCard";
import { EligibilityCard } from "./EligibilityCard";
import { LoanBenefits } from "./LoanBenefits";
import { LoanStepper } from "./LoanStepper";
import { BusinessInformationCard } from "./BusinessInformationCard";
import { KYCUploader } from "./KYCUploader";
import { ConsentCard } from "./ConsentCard";
import { ApplicationSummary } from "./ApplicationSummary";
import { LoanStatusTimeline } from "./LoanStatusTimeline";
import { ActiveLoanCard } from "./ActiveLoanCard";
import { LoanFAQAccordion } from "./LoanFAQAccordion";
import { LoanEmptyState } from "./LoanEmptyState";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, RefreshCw, HelpCircle, FileText } from "lucide-react";
import { toast } from "sonner";

const INITIAL_BUSINESS_INFO: BusinessInfo = {
  businessName: "Dhanmondi Super Store",
  ownerName: "Kazi Shohel",
  phone: "01711223344",
  email: "shohel@dhanmondisuper.com",
  businessAddress: "House 42, Road 7/A, Dhanmondi, Dhaka",
  businessType: "General Retail & Wholesale",
};

const INITIAL_ACTIVE_LOAN: ActiveLoanDetails = {
  loanId: "LN-DBBL-2026-9921",
  partnerBankName: "Dutch-Bangla Bank SME",
  outstandingBalance: 250000,
  totalApprovedAmount: 300000,
  monthlyInstallment: 12500,
  nextPaymentDate: "2026-08-15",
  interestRate: 9,
  tenureMonths: 24,
  status: "active",
};

export function LoanPageContent() {
  const { isBangla } = useAppTranslation();

  // Application Flow State
  const [eligibilityStatus, setEligibilityStatus] = useState<EligibilityStatus>("likely_eligible");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Form & Application Records
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(INITIAL_BUSINESS_INFO);
  const [kyc, setKyc] = useState<KYCDocuments>({});
  const [consentAgreed, setConsentAgreed] = useState<boolean>(false);

  const [activeApplication, setActiveApplication] = useState<LoanApplicationRecord | null>(null);
  const [activeLoan, setActiveLoan] = useState<ActiveLoanDetails | null>(null);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleStep1Continue = (updatedInfo: BusinessInfo) => {
    setBusinessInfo(updatedInfo);
    setCurrentStep(2);
  };

  const handleStep2Continue = (updatedKyc: KYCDocuments) => {
    setKyc(updatedKyc);
    setCurrentStep(3);
  };

  const handleStep3Continue = (agreed: boolean) => {
    setConsentAgreed(agreed);
    setCurrentStep(4);
  };

  const handleStep4Submit = (requestedAmount: number) => {
    const newApp: LoanApplicationRecord = {
      id: `LN-APP-${Math.floor(10000 + Math.random() * 90000)}`,
      status: "submitted",
      requestedAmount,
      submittedAt: new Date().toISOString().split("T")[0],
      estimatedProcessingHours: 24,
      businessInfo,
      kyc,
      consentAgreed,
    };

    setActiveApplication(newApp);
    setCurrentStep(5);
    toast.success(
      isBangla
        ? "আপনার লোন আবেদন সফলভাবে জমা দেওয়া হয়েছে!"
        : "Business loan application submitted successfully!"
    );

    // Simulate approval trigger for demonstration after submission
    setTimeout(() => {
      setActiveLoan(INITIAL_ACTIVE_LOAN);
    }, 4000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success(isBangla ? "লোন যোগ্যতা রিফ্রেশ করা হয়েছে" : "Loan eligibility refreshed");
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <span>{isBangla ? "বিজনেস লোন (Business Loan)" : "Business Loan"}</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {isBangla
              ? "হ্যালো খাতার স্বয়ংক্রিয় লেনদেন ডাটা দিয়ে ব্যবসা বাড়াতে লোন সুবিধা নিন।"
              : "Explore business loan opportunities using your HelloKhata transaction history."}
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-9 w-9 bg-background/50 border-input text-muted-foreground hover:text-foreground cursor-pointer"
            title={isBangla ? "রিফ্রেশ" : "Refresh"}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
          </Button>

          <Button
            variant="outline"
            onClick={() => scrollToSection("faq-section")}
            className="h-9 text-xs gap-1.5 bg-background/50 border-input text-foreground cursor-pointer px-3"
          >
            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{isBangla ? "সাহায্য ও প্রশ্ন" : "Help & FAQ"}</span>
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <LoanHeroCard
        onCheckEligibility={() => scrollToSection("eligibility-section")}
        onLearnMore={() => scrollToSection("benefits-section")}
        isBangla={isBangla}
      />

      {/* Eligibility Indicator & 4 Factors Section */}
      <EligibilityCard
        status={eligibilityStatus}
        estimatedLoanLimit={500000}
        onApplyNow={() => scrollToSection("application-stepper")}
        isBangla={isBangla}
      />

      {/* Active Loan Card (Shows if user has an approved active loan) */}
      {activeLoan && <ActiveLoanCard loan={activeLoan} isBangla={isBangla} />}

      {/* Interactive Loan Application Stepper Section */}
      <div id="application-stepper" className="space-y-4">
        <div className="flex items-center justify-between border-b border-border/80 pb-2">
          <h3 className="text-xs sm:text-sm font-bold text-foreground">
            {isBangla ? "সহজ ৫-ধাপে লোন আবেদন" : "5-Step Business Loan Application"}
          </h3>
          <span className="text-[11px] text-muted-foreground">
            {isBangla ? "কোনো বাড়তি সিআরজি পেপার নেই" : "No manual bookkeeping required"}
          </span>
        </div>

        {eligibilityStatus === "not_enough_history" ? (
          <LoanEmptyState
            onCheckEligibility={() => {
              setEligibilityStatus("likely_eligible");
              scrollToSection("application-stepper");
            }}
            isBangla={isBangla}
          />
        ) : (
          <>
            {/* Stepper Navigation Bar */}
            <LoanStepper
              currentStep={currentStep}
              onStepClick={(st) => setCurrentStep(st)}
              isBangla={isBangla}
            />

            {/* Active Step Content */}
            {currentStep === 1 && (
              <BusinessInformationCard
                initialInfo={businessInfo}
                onContinue={handleStep1Continue}
                isBangla={isBangla}
              />
            )}

            {currentStep === 2 && (
              <KYCUploader
                initialKyc={kyc}
                onContinue={handleStep2Continue}
                onBack={() => setCurrentStep(1)}
                isBangla={isBangla}
              />
            )}

            {currentStep === 3 && (
              <ConsentCard
                initialConsent={consentAgreed}
                onContinue={handleStep3Continue}
                onBack={() => setCurrentStep(2)}
                isBangla={isBangla}
              />
            )}

            {currentStep === 4 && (
              <ApplicationSummary
                businessInfo={businessInfo}
                kyc={kyc}
                consentAgreed={consentAgreed}
                onSubmit={handleStep4Submit}
                onBack={() => setCurrentStep(3)}
                isBangla={isBangla}
              />
            )}

            {currentStep === 5 && (
              <LoanStatusTimeline
                application={
                  activeApplication || {
                    id: "LN-APP-99821",
                    status: "submitted",
                    requestedAmount: 300000,
                    submittedAt: new Date().toISOString().split("T")[0],
                    businessInfo,
                    kyc,
                    consentAgreed: true,
                  }
                }
                isBangla={isBangla}
              />
            )}
          </>
        )}
      </div>

      {/* Benefits Section */}
      <LoanBenefits isBangla={isBangla} />

      {/* FAQ Accordion Section */}
      <LoanFAQAccordion isBangla={isBangla} />
    </div>
  );
}
