'use client';

import React, { useState } from 'react';
import { FinancePageHeader } from '@/components/finance/FinancePageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import {
  Landmark,
  Plus,
  Coins,
  Calendar,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Building2,
  TrendingDown,
} from 'lucide-react';

interface ActiveLoan {
  id: string;
  provider: string;
  providerBn: string;
  principal: number;
  interestRate: number;
  paidAmount: number;
  balance: number;
  installmentAmount: number;
  nextInstallmentDate: string;
  repaidPercent: number;
}

export default function FinanceLoanPage() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();

  // State Management: Active Borrowings
  const [activeLoans, setActiveLoans] = useState<ActiveLoan[]>([
    {
      id: 'LOAN-001',
      provider: 'Dhaka Bank PLC',
      providerBn: 'ঢাকা ব্যাংক পিএলসি',
      principal: 1000000,
      interestRate: 9.5,
      paidAmount: 150000,
      balance: 850000,
      installmentAmount: 35000,
      nextInstallmentDate: '2026-08-15',
      repaidPercent: 15,
    }
  ]);

  // UI Dialog States
  const [isRepayOpen, setIsRepayOpen] = useState(false);
  const [isBorrowOpen, setIsBorrowOpen] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState('');

  // Form Fields
  const [formAmount, setFormAmount] = useState('');
  const [formMethod, setFormMethod] = useState('Bank');
  const [formDesc, setFormDesc] = useState('');

  const [newProvider, setNewProvider] = useState('');
  const [newPrincipal, setNewPrincipal] = useState('');
  const [newInterestRate, setNewInterestRate] = useState('');
  const [newInstallment, setNewInstallment] = useState('');

  const [alertMessage, setAlertMessage] = useState('');

  // Calculations
  const totalOutstanding = activeLoans.reduce((acc, l) => acc + l.balance, 0);
  const totalPaid = activeLoans.reduce((acc, l) => acc + l.paidAmount, 0);
  const totalPrincipal = activeLoans.reduce((acc, l) => acc + l.principal, 0);

  const handleOpenRepay = (loanId: string) => {
    setSelectedLoanId(loanId);
    setIsRepayOpen(true);
  };

  const handleRecordRepayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(formAmount) || 0;

    if (amountNum <= 0) return;

    setActiveLoans(
      activeLoans.map((l) => {
        if (l.id === selectedLoanId) {
          const newPaid = l.paidAmount + amountNum;
          const newBal = Math.max(0, l.principal - newPaid);
          const newPercent = Math.min(100, Math.round((newPaid / l.principal) * 100));
          return {
            ...l,
            paidAmount: newPaid,
            balance: newBal,
            repaidPercent: newPercent,
            nextInstallmentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          };
        }
        return l;
      })
    );

    setIsRepayOpen(false);
    setFormAmount('');
    setFormDesc('');

    setAlertMessage(isBangla ? 'ঋণ পরিশোধ কিস্তি সফলভাবে এন্ট্রি করা হয়েছে!' : 'Loan repayment installment logged successfully!');
    setTimeout(() => setAlertMessage(''), 4000);
  };

  const handleBorrowLoan = (e: React.FormEvent) => {
    e.preventDefault();
    const principalNum = parseFloat(newPrincipal) || 0;
    const rateNum = parseFloat(newInterestRate) || 0;
    const installmentNum = parseFloat(newInstallment) || 0;

    if (!newProvider.trim() || principalNum <= 0) return;

    const newLoanObj: ActiveLoan = {
      id: `LOAN-${(activeLoans.length + 1).toString().padStart(3, '0')}`,
      provider: newProvider,
      providerBn: newProvider,
      principal: principalNum,
      interestRate: rateNum,
      paidAmount: 0,
      balance: principalNum,
      installmentAmount: installmentNum,
      nextInstallmentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      repaidPercent: 0,
    };

    setActiveLoans([newLoanObj, ...activeLoans]);
    setIsBorrowOpen(false);

    // Reset Form
    setNewProvider('');
    setNewPrincipal('');
    setNewInterestRate('');
    setNewInstallment('');

    setAlertMessage(isBangla ? 'নতুন সংগৃহীত ব্যাংক ঋণ সফলভাবে রেজিস্টার করা হয়েছে!' : 'New borrowing bank loan registered successfully!');
    setTimeout(() => setAlertMessage(''), 4000);
  };

  const handleDeleteLoan = (loanId: string) => {
    setActiveLoans(activeLoans.filter((l) => l.id !== loanId));
    setAlertMessage(isBangla ? 'ঋণ রেকর্ডটি সফলভাবে মুছে ফেলা হয়েছে।' : 'Loan record removed successfully.');
    setTimeout(() => setAlertMessage(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <FinancePageHeader
          pageName="Loan Management"
          pageNameBn="ঋণ ও দায় পরিশোধ ব্যবস্থাপনা"
          description="Register bank borrowings, log payout installments, and track APR repayment progress."
          descriptionBn="ব্যাংক ঋণ এন্ট্রি দিন, কিস্তি পরিশোধের লগ সংরক্ষণ করুন এবং সুদের হার ও অগ্রগতি ট্র্যাক করুন।"
          icon={Landmark}
        />
        <div className="flex gap-2 shrink-0">
          <Button onClick={() => setIsBorrowOpen(true)} className="gap-1.5 text-xs h-9">
            <Plus className="h-4 w-4" />
            {isBangla ? 'নতুন ঋণ যোগ করুন' : 'Borrow New Loan'}
          </Button>
        </div>
      </div>

      {/* 2. Success Alert Box */}
      {alertMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-500 text-xs font-semibold rounded-lg flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{alertMessage}</span>
        </div>
      )}

      {/* 3. Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{isBangla ? 'বকেয়া ঋণ স্থিতি (Outstanding)' : 'Total Outstanding Balance'}</p>
              <h3 className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1 font-mono">{formatCurrency(totalOutstanding)}</h3>
            </div>
            <div className="h-9 w-9 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <Landmark className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{isBangla ? 'পরিশোধিত আসল' : 'Total Principal Repaid'}</p>
              <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">{formatCurrency(totalPaid)}</h3>
            </div>
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Coins className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{isBangla ? 'মোট প্রারম্ভিক ঋণ (Principal)' : 'Initial Loan Capital'}</p>
              <h3 className="text-xl font-bold text-foreground mt-1 font-mono">{formatCurrency(totalPrincipal)}</h3>
            </div>
            <div className="h-9 w-9 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <Building2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. Active Loans List */}
      <div className="space-y-4">
        {activeLoans.map((loan) => (
          <Card key={loan.id} className="border-border/50 overflow-hidden shadow-sm">
            <div className="bg-muted/30 p-4 border-b border-border/20 flex justify-between items-center flex-wrap gap-2 text-xs font-semibold">
              <div className="flex items-center gap-3">
                <span className="text-primary font-mono font-bold">#{loan.id}</span>
                <span className="text-foreground text-sm font-bold">{isBangla ? loan.providerBn : loan.provider}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary font-mono">
                  {loan.interestRate}% APR
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDeleteLoan(loan.id)}
                  className="h-6 w-6 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <CardContent className="p-5 space-y-6">
              {/* Core figures grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <p className="font-medium text-muted-foreground">{isBangla ? 'মূল ঋণ (Principal)' : 'Principal Loan'}</p>
                  <h3 className="text-base font-bold text-foreground mt-1 font-mono">{formatCurrency(loan.principal)}</h3>
                </div>
                <div>
                  <p className="font-medium text-emerald-600 dark:text-emerald-400">{isBangla ? 'পরিশোধিত ঋণ' : 'Paid Amount'}</p>
                  <h3 className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">{formatCurrency(loan.paidAmount)}</h3>
                </div>
                <div>
                  <p className="font-medium text-rose-600 dark:text-rose-400">{isBangla ? 'বকেয়া ঋণ স্থিতি' : 'Remaining Balance'}</p>
                  <h3 className="text-base font-bold text-rose-600 dark:text-rose-400 mt-1 font-mono">{formatCurrency(loan.balance)}</h3>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">{isBangla ? 'পরবর্তী কিস্তি পরিমাণ' : 'Next Installment Amount'}</p>
                  <h3 className="text-base font-bold text-foreground mt-1 font-mono">{formatCurrency(loan.installmentAmount)}</h3>
                </div>
              </div>

              {/* Repayments Progress */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-muted-foreground">{isBangla ? 'ঋণ পরিশোধের অগ্রগতি' : 'Loan Repayment Progress'}</span>
                  <span className="text-primary font-mono">{loan.repaidPercent}% Paid</span>
                </div>
                <Progress value={loan.repaidPercent} className="h-2" />
              </div>

              {/* Installment breakdown action footer */}
              <div className="flex justify-between items-center pt-2 border-t border-border/20">
                <div className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{isBangla ? `পরবর্তী কিস্তির তারিখ: ${loan.nextInstallmentDate}` : `Next Payout Date: ${loan.nextInstallmentDate}`}</span>
                </div>

                <Button
                  size="sm"
                  onClick={() => handleOpenRepay(loan.id)}
                  disabled={loan.balance === 0}
                  className="text-xs gap-1.5 h-8"
                >
                  <Coins className="h-3.5 w-3.5" />
                  <span>{isBangla ? 'কিস্তি জমা দিন' : 'Pay Installment'}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 5. Repay Installment Dialog Popup */}
      <Dialog open={isRepayOpen} onOpenChange={setIsRepayOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleRecordRepayment} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Coins className="h-5 w-5 text-emerald-600" />
                <span>{isBangla ? 'ঋণ পরিশোধের কিস্তি এন্ট্রি' : 'Log Loan Payout Installment'}</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground">{isBangla ? 'পরিশোধের পরিমাণ (টাকা)' : 'Repayment Amount'}</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  required
                  className="font-mono h-9"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground">{isBangla ? 'পেমেন্ট পদ্ধতি' : 'Payment Method'}</label>
                <select
                  value={formMethod}
                  onChange={(e) => setFormMethod(e.target.value)}
                  className="w-full h-9 rounded-lg border bg-background px-3 text-xs focus:outline-none"
                >
                  <option value="Cash">{isBangla ? 'নগদ ক্যাশ (Cash)' : 'Cash'}</option>
                  <option value="Bank">{isBangla ? 'ব্যাংক স্থানান্তর (Bank)' : 'Bank'}</option>
                  <option value="Wallet">{isBangla ? 'মোবাইল ওয়ালেট (bKash/Nagad)' : 'Mobile Wallet'}</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground">{isBangla ? 'বিবরণ / মেমো' : 'Memo / Remarks'}</label>
                <Input
                  placeholder={isBangla ? 'কিস্তি সংক্রান্ত কোনো বিবরণ...' : 'e.g. Cleared installment for August'}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="h-9"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsRepayOpen(false)} className="text-xs h-9">
                {isBangla ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button type="submit" className="text-xs h-9">
                {isBangla ? 'পরিশোধ নিশ্চিত করুন' : 'Confirm Payout'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 6. Borrow New Loan Dialog Popup */}
      <Dialog open={isBorrowOpen} onOpenChange={setIsBorrowOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleBorrowLoan} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                <span>{isBangla ? 'নতুন ব্যাংক লোন রেজিস্টার করুন' : 'Borrow New Loan'}</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground">{isBangla ? 'ঋণ প্রদানকারী ব্যাংক/সংস্থা' : 'Lender Name / Provider'}</label>
                <Input
                  placeholder={isBangla ? 'যেমন: ব্র্যাক ব্যাংক পিএলসি' : 'e.g. BRAC Bank PLC'}
                  value={newProvider}
                  onChange={(e) => setNewProvider(e.target.value)}
                  required
                  className="h-9"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground">{isBangla ? 'মূল ঋণের পরিমাণ (টাকা)' : 'Principal Capital'}</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={newPrincipal}
                  onChange={(e) => setNewPrincipal(e.target.value)}
                  required
                  className="h-9 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">{isBangla ? 'সুদের হার (% APR)' : 'Interest Rate (% APR)'}</label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="9.0"
                    value={newInterestRate}
                    onChange={(e) => setNewInterestRate(e.target.value)}
                    className="h-9 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">{isBangla ? 'মাসিক কিস্তি পরিমাণ' : 'Monthly Installment'}</label>
                  <Input
                    type="number"
                    placeholder="35000"
                    value={newInstallment}
                    onChange={(e) => setNewInstallment(e.target.value)}
                    className="h-9 font-mono"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsBorrowOpen(false)} className="text-xs h-9">
                {isBangla ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button type="submit" className="text-xs h-9">
                {isBangla ? 'লোন এন্ট্রি সংরক্ষণ' : 'Submit Loan Entry'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
