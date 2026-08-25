// Hello Khata OS - Loans & Liabilities Register (EMI & Repayment Schedule)
// হ্যালো খাতা - ঋণ ও কিস্তি রেজিস্টার (ব্যাংক ঋণ ও দায় পরিশোধের সময়সূচি)

'use client';

import React, { useState } from 'react';
import { FinancePageHeader } from '@/components/finance/FinancePageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import {
  PiggyBank,
  Landmark,
  Calendar,
  FileSpreadsheet,
  Printer,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Percent,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';

export default function LoanReportPage() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency, formatNumber } = useCurrency();

  const loans = [
    {
      id: 'LN-101',
      name: 'SME Commercial Term Loan',
      nameBn: 'এসএমই বাণিজ্যিক মেয়াদী ঋণ',
      provider: 'BRAC Bank PLC',
      sanctionDate: '2025-01-10',
      tenureMonths: 36,
      principal: 1000000,
      interestRate: 9.5,
      paidPrincipal: 391200,
      balancePrincipal: 608800,
      monthlyEmi: 32000,
      nextInstallmentDate: '2026-06-10',
      status: 'active',
    },
    {
      id: 'LN-102',
      name: 'Delivery Van Auto Finance Facility',
      nameBn: 'ডেলিভারি ভ্যান অটো লোন',
      provider: 'City Bank PLC',
      sanctionDate: '2025-06-15',
      tenureMonths: 24,
      principal: 500000,
      interestRate: 10.0,
      paidPrincipal: 250000,
      balancePrincipal: 250000,
      monthlyEmi: 23000,
      nextInstallmentDate: '2026-06-15',
      status: 'active',
    },
  ];

  const totalSanctioned = loans.reduce((acc, l) => acc + l.principal, 0);
  const totalBalance = loans.reduce((acc, l) => acc + l.balancePrincipal, 0);
  const totalRepaid = loans.reduce((acc, l) => acc + l.paidPrincipal, 0);
  const totalMonthlyEmi = loans.reduce((acc, l) => acc + l.monthlyEmi, 0);

  const handleExport = (type: string) => {
    toast.success(
      isBangla
        ? `ঋণ ও কিস্তি রেজিস্টার ${type.toUpperCase()} এক্সপোর্ট সম্পন্ন হয়েছে!`
        : `Loan Schedule ${type.toUpperCase()} exported successfully!`
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <FinancePageHeader
        pageName="Loans & EMI Schedule Report"
        pageNameBn="ঋণ ও কিস্তি রেজিস্টার (Loans & Liabilities)"
        icon={PiggyBank}
      />

      {/* Top Liabilities KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-rose-500/5 border border-rose-500/20 shadow-xs space-y-1.5">
          <div className="text-xs font-semibold text-muted-foreground">{isBangla ? 'বকেয়া মূল ঋণ ব্যালেন্স' : 'Outstanding Principal'}</div>
          <div className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">{formatCurrency(totalBalance)}</div>
          <div className="text-[11px] text-muted-foreground">{isBangla ? '২টি সক্রিয় ব্যাংক ঋণ সুবিধা' : 'Active term borrowings'}</div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-emerald-500/5 border border-emerald-500/20 shadow-xs space-y-1.5">
          <div className="text-xs font-semibold text-muted-foreground">{isBangla ? 'মোট পরিশোধিত মূলধন' : 'Total Repaid Principal'}</div>
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">{formatCurrency(totalRepaid)}</div>
          <div className="text-[11px] text-muted-foreground">{((totalRepaid / totalSanctioned) * 100).toFixed(1)}% of original debt repaid</div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-amber-500/5 border border-amber-500/20 shadow-xs space-y-1.5">
          <div className="text-xs font-semibold text-muted-foreground">{isBangla ? 'মাসিক ইএমআই কিস্তি' : 'Total Monthly EMI'}</div>
          <div className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">{formatCurrency(totalMonthlyEmi)}</div>
          <div className="text-[11px] text-muted-foreground">{isBangla ? 'প্রতি মাসে প্রদেয় কিস্তি' : 'Combined monthly obligation'}</div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-teal-500/10 border border-teal-500/30 shadow-md space-y-1.5 ring-1 ring-teal-500/20">
          <div className="text-xs font-semibold text-teal-700 dark:text-teal-400 font-bold">{isBangla ? 'ক্রেডিট রেটিং ও রেকর্ড' : 'Debt Servicing Status'}</div>
          <div className="text-xl font-bold font-mono text-foreground">Regular Standard</div>
          <div className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold font-mono">0 Defaulted Installments</div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-4 rounded-2xl border border-border/70 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>{isBangla ? 'ব্যাংক ঋণ চুক্তি ও কিস্তি পরিশোধ ট্র্যাকার' : 'Active Bank Loan Facilities & EMI Amortization'}</span>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('excel')}
            className="h-9 text-xs gap-1.5"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
            <span>Excel Schedule</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => handleExport('pdf')}
            className="h-9 text-xs gap-1.5 font-semibold"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>{isBangla ? 'ঋণ বিবরণী প্রিন্ট' : 'Print Loan Schedule'}</span>
          </Button>
        </div>
      </div>

      {/* Loan Accounts Schedule */}
      <div className="space-y-4">
        {loans.map((loan) => {
          const progressPct = ((loan.paidPrincipal / loan.principal) * 100).toFixed(1);

          return (
            <Card key={loan.id} className="rounded-2xl border-border/70 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-border/50 bg-muted/20 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-base font-bold text-foreground">{isBangla ? loan.nameBn : loan.name}</h3>
                    <Badge variant="outline" className="font-mono text-xs">{loan.id}</Badge>
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                      Regular Active
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {loan.provider} • Sanctioned: {loan.sanctionDate} • Tenure: {loan.tenureMonths} Months
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-[10px] text-muted-foreground uppercase font-bold">{isBangla ? 'সুদের হার' : 'Interest Rate'}</div>
                    <div className="text-sm font-bold font-mono text-foreground">{loan.interestRate}% p.a.</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-muted-foreground uppercase font-bold">{isBangla ? 'মাসিক কিস্তি' : 'Monthly EMI'}</div>
                    <div className="text-base font-black font-mono text-amber-600 dark:text-amber-400">{formatCurrency(loan.monthlyEmi)}</div>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">
                      Repayment Progress: <strong className="text-foreground">{progressPct}% Paid</strong>
                    </span>
                    <span className="font-mono text-muted-foreground">
                      Remaining Principal: <strong className="text-rose-600">{formatCurrency(loan.balancePrincipal)}</strong> / {formatCurrency(loan.principal)}
                    </span>
                  </div>
                  <Progress value={Number(progressPct)} className="h-2 rounded-full" />
                </div>

                {/* Details strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-muted/40 p-3.5 rounded-xl border border-border/40 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">{isBangla ? 'পরবর্তী কিস্তির তারিখ' : 'Next Installment Due'}</span>
                    <span className="font-bold text-foreground font-mono">{loan.nextInstallmentDate}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">{isBangla ? 'পরিশোধিত মূল ঋণ' : 'Principal Discharged'}</span>
                    <span className="font-bold text-emerald-600 font-mono">{formatCurrency(loan.paidPrincipal)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">{isBangla ? 'অবশিষ্ট মূল ঋণ' : 'Outstanding Principal'}</span>
                    <span className="font-bold text-rose-600 font-mono">{formatCurrency(loan.balancePrincipal)}</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
