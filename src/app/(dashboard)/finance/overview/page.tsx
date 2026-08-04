'use client';

import React, { useState } from 'react';
import { useFinancialDashboard } from '@/hooks/useFinancialDashboard';
import { FinancialHeader } from './components/FinancialHeader';
import { FinancialKpiGrid } from './components/FinancialKpiGrid';
import { FinancialChartsSection } from './components/FinancialChartsSection';
import { AccountsOverviewTable } from './components/AccountsOverviewTable';
import { UnifiedTransactionsList } from './components/UnifiedTransactionsList';
import { FinancialDashboardSkeleton } from './components/FinancialDashboardSkeleton';

import { Button, Input } from '@/components/ui/premium';
import { Label } from '@/components/ui/label';
import {
  Dialog, 
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  PlusCircle,
  MinusCircle,
  ArrowDownCircle,
  ArrowUpCircle,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

export default function FinanceOverviewPage() {
  const {
    kpis,
    incomeBreakdown,
    expenseBreakdown,
    cashFlow,
    accounts,
    transactions,
    insights,
    selectedBranch,
    setSelectedBranch,
    selectedPeriod,
    setSelectedPeriod,
    cashFlowTimeframe,
    setCashFlowTimeframe,
    isLoading,
    isError,
    isRefetching,
    refetch,
  } = useFinancialDashboard();

  // Quick Action Modal State
  const [activeActionModal, setActiveActionModal] = useState<
    'income' | 'expense' | 'deposit' | 'withdraw' | null
  >(null);
  const [actionAmount, setActionAmount] = useState<string>('');
  const [actionDescription, setActionDescription] = useState<string>('');
  const [isSubmittingAction, setIsSubmittingAction] = useState<boolean>(false);

  // Quick Action Click
  const handleQuickActionClick = (actionId: 'income' | 'expense' | 'deposit' | 'withdraw') => {
    setActiveActionModal(actionId);
    setActionAmount('');
    setActionDescription('');
  };

  // Submit Quick Action Form
  const handleActionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionAmount || parseFloat(actionAmount) <= 0) {
      toast.error('Please enter a valid amount greater than 0');
      return;
    }

    setIsSubmittingAction(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));

      const titleMap = {
        income: 'Income Recorded',
        expense: 'Business Expense Recorded',
        deposit: 'Cash Deposit Recorded',
        withdraw: 'Cash Withdrawal Recorded',
      };

      toast.success(
        `${titleMap[activeActionModal || 'income']}: ৳${parseFloat(
          actionAmount
        ).toLocaleString('en-BD')} successfully processed.`
      );

      setActiveActionModal(null);
      refetch();
    } finally {
      setIsSubmittingAction(false);
    }
  };

  if (isLoading) {
    return <FinancialDashboardSkeleton />;
  }

  if (isError) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8 border border-border/60 rounded-2xl bg-card text-center space-y-4">
        <div className="h-12 w-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div className="space-y-1 max-w-md">
          <h3 className="text-base font-semibold text-foreground">
            Unable to load financial dashboard data
          </h3>
          <p className="text-xs text-muted-foreground">
            An error occurred while communicating with the financial ledger servers. Please verify your connection and try again.
          </p>
        </div>
        <Button
          onClick={() => refetch()}
          size="sm"
          className="rounded-xl h-9 px-4 gap-2 text-xs font-medium"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Retry Loading Data
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 mx-auto pb-24">
      {/* 1. Header & Top Controls */}
      <FinancialHeader
        selectedBranch={selectedBranch}
        onBranchChange={setSelectedBranch}
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        isRefreshing={isRefetching}
        onRefresh={refetch}
        onQuickAction={handleQuickActionClick}
      />

      {/* 2. 7 Financial KPI Summary Cards */}
      <FinancialKpiGrid kpis={kpis} />

      {/* 4. Optimized Income/Expense & Cash Flow Charts Section */}
      <FinancialChartsSection
        incomeBreakdown={incomeBreakdown}
        expenseBreakdown={expenseBreakdown}
        cashFlowData={cashFlow}
        cashFlowTimeframe={cashFlowTimeframe}
        onTimeframeChange={setCashFlowTimeframe}
      />

      {/* 5. Liquid Accounts Overview Table */}
      <AccountsOverviewTable accounts={accounts} />

      {/* 6. Consolidated Recent Transactions List */}
      <UnifiedTransactionsList transactions={transactions} />

      {/* Quick Action Modal Dialogs */}
      <Dialog
        open={activeActionModal !== null}
        onOpenChange={(open) => !open && setActiveActionModal(null)}
      >
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {activeActionModal === 'income' && (
                <PlusCircle className="h-5 w-5 text-emerald-500" />
              )}
              {activeActionModal === 'expense' && (
                <MinusCircle className="h-5 w-5 text-rose-500" />
              )}
              {activeActionModal === 'deposit' && (
                <ArrowDownCircle className="h-5 w-5 text-indigo-500" />
              )}
              {activeActionModal === 'withdraw' && (
                <ArrowUpCircle className="h-5 w-5 text-amber-500" />
              )}
              {activeActionModal === 'income' && 'Record Business Income'}
              {activeActionModal === 'expense' && 'Record Business Expense'}
              {activeActionModal === 'deposit' && 'Record Cash Deposit'}
              {activeActionModal === 'withdraw' && 'Record Cash Withdrawal'}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Enter transaction amount and details to update cash balances.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleActionSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs font-medium">
                Amount (BDT) *
              </Label>
              <Input
                type="number"
                step="0.01"
                min="1"
                placeholder="0.00"
                value={actionAmount}
                onChange={(e) => setActionAmount(e.target.value)}
                className="h-10 text-xs font-mono"
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium">
                Description / Notes
              </Label>
              <Input
                placeholder={
                  activeActionModal === 'income'
                    ? 'e.g. Service fee collection'
                    : activeActionModal === 'expense'
                    ? 'e.g. Office tea & snacks'
                    : 'Notes'
                }
                value={actionDescription}
                onChange={(e) => setActionDescription(e.target.value)}
                className="h-10 text-xs"
              />
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveActionModal(null)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingAction}
                className="rounded-xl font-medium bg-primary text-primary-foreground"
              >
                {isSubmittingAction && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Confirm Entry
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
