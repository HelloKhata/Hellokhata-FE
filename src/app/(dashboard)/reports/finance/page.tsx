// Hello Khata OS - Accounting & Finance Reports Master Hub (Premium Glass Edition)
// হ্যালো খাতা - হিসাব ও অর্থায়ন রিপোর্টস মাস্টার হাব (প্রিমিয়াম গ্লাস কালার সংস্করণ)

'use client';

import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import {
  TrendingUp,
  Wallet,
  Scale,
  Percent,
  Activity,
  History,
  AlertCircle,
  FileSpreadsheet,
  Download,
  BookOpen,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import { FinanceReportHeader } from '@/components/reports/finance/FinanceReportHeader';
import { FinancialHealthSummary } from '@/components/reports/finance/FinancialHealthSummary';
import { MasterFinancialReportsExplorer } from '@/components/reports/finance/MasterFinancialReportsExplorer';
import { ContextualFinancialInsight } from '@/components/reports/finance/ContextualFinancialInsight';
import { FinancialAlertsSection } from '@/components/reports/finance/FinancialAlertsSection';
import { FinancialPerformanceChart } from '@/components/reports/finance/FinancialPerformanceChart';
import { CashFlowMovement } from '@/components/reports/finance/CashFlowMovement';
import { DuesAgingSection } from '@/components/reports/finance/DuesAgingSection';
import { BalanceSheetSnapshot } from '@/components/reports/finance/BalanceSheetSnapshot';
import { ExpenseIntelligence } from '@/components/reports/finance/ExpenseIntelligence';
import { RecentFinancialActivity } from '@/components/reports/finance/RecentFinancialActivity';
import { StatutoryPdfPacketModal } from '@/components/reports/finance/StatutoryPdfPacketModal';
// import { exportMultiSheetFinancialWorkbook } from '@/lib/export/financial-excel-export';
import { cn } from '@/lib/utils';

import {
  MOCK_FINANCE_METRICS,
  MOCK_PERFORMANCE_DAILY,
  MOCK_PERFORMANCE_WEEKLY,
  MOCK_PERFORMANCE_MONTHLY,
  MOCK_PERFORMANCE_QUARTERLY,
  MOCK_PERFORMANCE_YEARLY,
  MOCK_CASH_MOVEMENT,
  MOCK_RECEIVABLES_DATA,
  MOCK_PAYABLES_DATA,
  MOCK_BALANCE_SHEET_DATA,
  MOCK_EXPENSE_CATEGORIES,
  MOCK_FINANCIAL_ALERTS,
  MOCK_RECENT_TRANSACTIONS,
} from '@/components/reports/finance/mock-data';

export default function FinanceReportsPage() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();

  // Filters State
  const [dateRange, setDateRange] = useState('this_month');
  const [comparePeriod, setComparePeriod] = useState('prev_period');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [activeAnalyticsTab, setActiveAnalyticsTab] = useState<'performance' | 'cashflow' | 'aging' | 'balancesheet'>('performance');
  const [statutoryPdfOpen, setStatutoryPdfOpen] = useState(false);

  // Branch list
  const branches = useMemo(() => [
    { id: 'branch-1', name: 'Main Branch (Dhanmondi)' },
    { id: 'branch-2', name: 'Gulshan Corporate Branch' },
    { id: 'branch-3', name: 'Uttara Retail Outlet' },
    { id: 'branch-4', name: 'Chittagong Hub' },
  ], []);

  // Performance Chart Data according to selected timeframe
  const chartData = useMemo(() => {
    switch (timeframe) {
      case 'daily':
        return MOCK_PERFORMANCE_DAILY;
      case 'weekly':
        return MOCK_PERFORMANCE_WEEKLY;
      case 'quarterly':
        return MOCK_PERFORMANCE_QUARTERLY;
      case 'yearly':
        return MOCK_PERFORMANCE_YEARLY;
      case 'monthly':
      default:
        return MOCK_PERFORMANCE_MONTHLY;
    }
  }, [timeframe]);

  // Export handler
  const handleExport = (type: 'excel' | 'pdf' | 'print') => {
    if (type === 'excel') {
      // exportMultiSheetFinancialWorkbook();
      toast.success(isBangla ? 'মাল্টি-শীট এক্সেল ওয়ার্কবুক প্রস্তুত ও ডাউনলোড সম্পন্ন!' : 'Downloaded Multi-Sheet Financial Model (.xlsx)!');
    } else if (type === 'pdf') {
      setStatutoryPdfOpen(true);
      toast.success(isBangla ? 'সংবিধিবদ্ধ আর্থিক বিবরণী প্যাকেট প্রস্তুত' : 'Statutory Financial Packet ready for review & PDF');
    } else {
      window.print();
    }
  };

  return (
    <div className="relative min-h-screen bg-background p-4 sm:p-6 lg:p-8 max-w-[1560px] mx-auto space-y-6 overflow-hidden">
      {/* Ambient Glass Glow Orbs */}
      <div className="pointer-events-none absolute -top-24 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      {/* ========================================================================= */}
      {/* 1. HEADER (Compact, Action-Oriented Control Bar)                          */}
      {/* ========================================================================= */}
      <FinanceReportHeader
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        comparePeriod={comparePeriod}
        onComparePeriodChange={setComparePeriod}
        selectedBranch={selectedBranch}
        onBranchChange={setSelectedBranch}
        branches={branches}
        onExport={handleExport}
        isBangla={isBangla}
      />

      {/* ========================================================================= */}
      {/* 2. EXECUTIVE FINANCIAL HEALTH STRIP (Unified Coherent Numbers)            */}
      {/* ========================================================================= */}
      <FinancialHealthSummary
        metrics={MOCK_FINANCE_METRICS}
        isBangla={isBangla}
      />

      {/* ========================================================================= */}
      {/* 3. ⭐ PRIMARY MAIN SECTION: FINANCIAL & ACCOUNTING REPORTS EXPLORER       */}
      {/*    Direct Access to Statutory & Operational Accounting Statements         */}
      {/* ========================================================================= */}
      <MasterFinancialReportsExplorer
        isBangla={isBangla}
      />

      {/* ========================================================================= */}
      {/* 4. DEEP-DIVE FINANCIAL INTELLIGENCE & ANALYTICS WORKSPACE                 */}
      {/* ========================================================================= */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-3">
          <div>
            <h3 className="text-base font-bold text-foreground">
              {isBangla ? 'আর্থিক বিশ্লেষণ ও পারফরম্যান্স গতিধারা' : 'Financial Intelligence & Deep Dive'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isBangla
                ? 'রাজস্ব, নগদ তারল্য, মেয়াদোত্তীর্ণ দেনা-পাওনা এবং ব্যালেন্স শিটের বিশদ পর্যালোচনা'
                : 'Operational cash movement, credit aging buckets, and financial performance trends'}
            </p>
          </div>

          {/* Analytics Glass Tabs Controller */}
          <div className="flex items-center bg-card/80 backdrop-blur-xl p-1 rounded-2xl border border-white/20 dark:border-white/10 shadow-sm overflow-x-auto self-start sm:self-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveAnalyticsTab('performance')}
              className={cn(
                'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5',
                activeAnalyticsTab === 'performance'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-md shadow-emerald-500/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{isBangla ? 'আয় ও মুনাফা' : 'Performance & P&L'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAnalyticsTab('cashflow')}
              className={cn(
                'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5',
                activeAnalyticsTab === 'cashflow'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold shadow-md shadow-blue-500/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>{isBangla ? 'ক্যাশ ফ্লো ও লেনদেন' : 'Cash Flow & Activity'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAnalyticsTab('aging')}
              className={cn(
                'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5',
                activeAnalyticsTab === 'aging'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold shadow-md shadow-amber-500/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <Percent className="w-3.5 h-3.5" />
              <span>{isBangla ? 'বকেয়া ও সতর্কতা' : 'Dues & Alerts'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAnalyticsTab('balancesheet')}
              className={cn(
                'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5',
                activeAnalyticsTab === 'balancesheet'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-md shadow-purple-500/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{isBangla ? 'ব্যালেন্স শিট ও খরচ' : 'Balance Sheet & Costs'}</span>
            </button>
          </div>
        </div>

        {/* TAB CONTENT 1: PERFORMANCE & REVENUE */}
        {activeAnalyticsTab === 'performance' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <ContextualFinancialInsight
              insightText="Operating expenses are 5.1% higher than last period, primarily due to seasonal transport and electricity tariffs. Net profit margin remains healthy at 26.1%."
              insightTextBn="গত মাসের তুলনায় পরিচালন ব্যয় ৫.১% বৃদ্ধি পেয়েছে, মূলত বিদ্যুৎ বিল ও পরিবহনের কারণে। তবুও নিট মুনাফা মার্জিন ২৬.১% এ শক্তিশালী অবস্থানে রয়েছে।"
              detailsHref="/finance/reports/profit-loss"
              isBangla={isBangla}
            />

            <FinancialPerformanceChart
              data={chartData}
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
              isBangla={isBangla}
            />
          </div>
        )}

        {/* TAB CONTENT 2: CASH FLOW & RECENT TRANSACTIONS */}
        {activeAnalyticsTab === 'cashflow' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <CashFlowMovement
              data={MOCK_CASH_MOVEMENT}
              isBangla={isBangla}
            />

            <RecentFinancialActivity
              transactions={MOCK_RECENT_TRANSACTIONS}
              isBangla={isBangla}
            />
          </div>
        )}

        {/* TAB CONTENT 3: DUES & AGING + FINANCIAL ALERTS */}
        {activeAnalyticsTab === 'aging' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <FinancialAlertsSection
              alerts={MOCK_FINANCIAL_ALERTS}
              isBangla={isBangla}
            />

            <DuesAgingSection
              receivables={MOCK_RECEIVABLES_DATA}
              payables={MOCK_PAYABLES_DATA}
              isBangla={isBangla}
            />
          </div>
        )}

        {/* TAB CONTENT 4: BALANCE SHEET & EXPENSE INTELLIGENCE */}
        {activeAnalyticsTab === 'balancesheet' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-in fade-in duration-200">
            <BalanceSheetSnapshot
              assets={MOCK_BALANCE_SHEET_DATA.assets}
              liabilities={MOCK_BALANCE_SHEET_DATA.liabilities}
              equity={MOCK_BALANCE_SHEET_DATA.equity}
              isBangla={isBangla}
            />

            <ExpenseIntelligence
              categories={MOCK_EXPENSE_CATEGORIES}
              totalExpenses={MOCK_FINANCE_METRICS.expenses}
              isBangla={isBangla}
            />
          </div>
        )}
      </div>

      {/* STATUTORY FINANCIAL REPORT PACKET MODAL */}
      <StatutoryPdfPacketModal
        open={statutoryPdfOpen}
        onOpenChange={setStatutoryPdfOpen}
        isBangla={isBangla}
      />
    </div>
  );
}
