"use client";

import React from "react";
import { ActiveLoanDetails } from "@/types/loan";
import { useCurrency } from "@/hooks/useAppTranslation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, CreditCard, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface ActiveLoanCardProps {
  loan: ActiveLoanDetails;
  isBangla?: boolean;
}

export function ActiveLoanCard({ loan, isBangla = false }: ActiveLoanCardProps) {
  const { formatCurrency } = useCurrency();

  const handleScheduleClick = () => {
    toast.info(
      isBangla
        ? "পরিশোধের কিস্তি সময়সূচী ডাউনলোড ডায়ালগ খোলা হচ্ছে..."
        : "Opening loan repayment schedule dialog..."
    );
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-4 shadow-2xs">
      <div className="flex items-center justify-between border-b border-border/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 shrink-0">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground">
                {isBangla ? "সক্রিয় লোন তথ্য (Active Business Loan)" : "Active Business Loan"}
              </h3>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-bold">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Active
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
              Partner Bank: <strong className="text-foreground">{loan.partnerBankName}</strong> • ID: {loan.loanId}
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleScheduleClick}
          className="h-8 text-xs font-semibold gap-1 text-foreground hover:bg-muted cursor-pointer"
        >
          <span>{isBangla ? "কিস্তি সময়সূচী" : "View Schedule"}</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Loan Financial Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        {/* Outstanding Balance */}
        <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase font-medium block">
            {isBangla ? "মোট বাকি লোন ব্যালেন্স" : "Outstanding Balance"}
          </span>
          <span className="text-base sm:text-lg font-bold font-mono text-amber-600 dark:text-amber-400">
            {formatCurrency(loan.outstandingBalance)}
          </span>
        </div>

        {/* Monthly Installment */}
        <div className="p-3 bg-background/50 border border-border/70 rounded-xl space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase font-medium block">
            {isBangla ? "মাসিক কিস্তি (Monthly EMI)" : "Monthly Installment"}
          </span>
          <span className="text-base sm:text-lg font-bold font-mono text-foreground">
            {formatCurrency(loan.monthlyInstallment)}
          </span>
        </div>

        {/* Next Payment Date */}
        <div className="p-3 bg-background/50 border border-border/70 rounded-xl space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase font-medium block">
            {isBangla ? "পরবর্তী কিস্তির তারিখ" : "Next Payment Date"}
          </span>
          <span className="text-xs sm:text-sm font-bold font-mono text-foreground flex items-center gap-1 mt-1">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            {loan.nextPaymentDate}
          </span>
        </div>

        {/* Total Approved Amount */}
        <div className="p-3 bg-background/50 border border-border/70 rounded-xl space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase font-medium block">
            {isBangla ? "অনুমোদিত মোট পরিমাণ" : "Total Approved Loan"}
          </span>
          <span className="text-xs sm:text-sm font-bold font-mono text-foreground mt-1 block">
            {formatCurrency(loan.totalApprovedAmount)} ({loan.interestRate}% Interest)
          </span>
        </div>
      </div>
    </div>
  );
}
