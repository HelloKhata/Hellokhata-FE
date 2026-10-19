// HelloKhata - Finance & Accounting Reports Master Hub
// হ্যালো খাতা - হিসাব ও অর্থায়ন রিপোর্টস মাস্টার হাব

'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Receipt,
  CreditCard,
  FileSpreadsheet,
  Download,
  Printer,
  LayoutDashboard,
  Layers,
  ArrowRightLeft,
  Calendar,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import { PageHeader } from '@/components/common';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

// API Hooks
import { useGetPaymentMethodStatus, useGetPaymentMethods, useGetDepositsAndWithdrawls } from '@/hooks/api/usePaymentMethod';
import { usePartyStats, useParties } from '@/hooks/api/useParties';
import { useExpenseSummary, useGetExpenseCategories } from '@/hooks/api/useExpense';
import { useGetTransactions, useGetIncomeCateogories } from '@/hooks/api/useFinance';
import { useGetSalesReportSummary, useGetPurhcaseReport } from '@/hooks/api/useReports';
import { useGetBranches } from '@/hooks/api/useBranches';

// Report Tabs
import { FinanceOverviewTab } from '@/components/reports/finance/FinanceOverviewTab';
import { IncomeExpenseTab } from '@/components/reports/finance/IncomeExpenseTab';
import { CashBankTab } from '@/components/reports/finance/CashBankTab';
import { ReceivablesTab } from '@/components/reports/finance/ReceivablesTab';
import { PayablesTab } from '@/components/reports/finance/PayablesTab';
import { PreliminaryPnLTab } from '@/components/reports/finance/PreliminaryPnLTab';
import { FinanceDateFilter, DateRangePreset } from '@/components/reports/finance/FinanceDateFilter';

export type FinanceTabKey = 'overview' | 'income-expense' | 'cash-bank' | 'receivables' | 'payables' | 'profit-loss';

function FinanceReportsContent() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Tab State
  const initialTab = (searchParams.get('tab') as FinanceTabKey) || 'overview';
  const [activeTab, setActiveTab] = useState<FinanceTabKey>(initialTab);

  useEffect(() => {
    const tabParam = searchParams.get('tab') as FinanceTabKey;
    if (tabParam && ['overview', 'income-expense', 'cash-bank', 'receivables', 'payables', 'profit-loss'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tab: FinanceTabKey) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.replace(`/reports/finance?${params.toString()}`, { scroll: false });
  };

  // Date Filter State
  const [datePreset, setDatePreset] = useState<DateRangePreset>('this_month');
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [selectedBranch, setSelectedBranch] = useState<string>('all');

  // Search & Pagination States
  const [txnSearch, setTxnSearch] = useState('');
  const [txnFlow, setTxnFlow] = useState('all');
  const [txnPage, setTxnPage] = useState(1);

  const [customerSearch, setCustomerSearch] = useState('');
  const [customerPage, setCustomerPage] = useState(1);

  const [supplierSearch, setSupplierSearch] = useState('');
  const [supplierPage, setSupplierPage] = useState(1);

  // Preset Date Handlers
  const handlePresetChange = (preset: DateRangePreset) => {
    setDatePreset(preset);
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    if (preset === 'today') {
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (preset === 'this_week') {
      const firstDay = new Date(now.setDate(now.getDate() - now.getDay()));
      setStartDate(firstDay.toISOString().split('T')[0]);
      setEndDate(todayStr);
    } else if (preset === 'this_month') {
      const first = new Date(now.getFullYear(), now.getMonth(), 1);
      setStartDate(first.toISOString().split('T')[0]);
      setEndDate(todayStr);
    } else if (preset === 'last_month') {
      const first = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const last = new Date(now.getFullYear(), now.getMonth(), 0);
      setStartDate(first.toISOString().split('T')[0]);
      setEndDate(last.toISOString().split('T')[0]);
    }
  };

  // API Queries
  const { data: branches = [] } = useGetBranches();
  const { data: paymentStats, isLoading: isLoadingPaymentStats } = useGetPaymentMethodStatus();
  const { data: paymentAccounts = [], isLoading: isLoadingAccounts } = useGetPaymentMethods();
  const { data: depositsWithdrawals = [], isLoading: isLoadingDeposits } = useGetDepositsAndWithdrawls();
  const { data: partyStats, isLoading: isLoadingPartyStats } = usePartyStats();

  const { data: customerParties = [], isLoading: isLoadingCustomers } = useParties({
    type: 'customer',
    balanceType: 'receivable',
    search: customerSearch.trim() || undefined,
    page: customerPage,
    limit: 20,
  });

  const { data: supplierParties = [], isLoading: isLoadingSuppliers } = useParties({
    type: 'supplier',
    balanceType: 'payable',
    search: supplierSearch.trim() || undefined,
    page: supplierPage,
    limit: 20,
  });

  const { data: expenseSummary, isLoading: isLoadingExpenseSummary } = useExpenseSummary();
  const { data: expenseCategories = [] } = useGetExpenseCategories();

  const { data: salesReportSummary, isLoading: isLoadingSalesSummary } = useGetSalesReportSummary({
    branchId: selectedBranch === 'all' ? undefined : selectedBranch,
    startDate,
    endDate,
  });

  const { data: purchaseReportData, isLoading: isLoadingPurchaseReport } = useGetPurhcaseReport({
    branchId: selectedBranch === 'all' ? undefined : selectedBranch,
    page: 1,
    limit: 1,
  });

  const { data: transactionsData, isLoading: isLoadingTxns } = useGetTransactions({
    branchId: selectedBranch === 'all' ? undefined : selectedBranch,
    flow: txnFlow === 'all' ? undefined : txnFlow,
    search: txnSearch.trim() || undefined,
    page: txnPage,
    limit: 12,
  });

  // Client-safe CSV Download Helper
  const downloadCsv = (filename: string, headers: string[], rows: (string | number)[][]) => {
    try {
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [
          headers.join(','),
          ...rows.map((r) =>
            r.map((field) => `"${String(field ?? '').replace(/"/g, '""')}"`).join(',')
          ),
        ].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${filename}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(isBangla ? 'রিপোর্ট CSV ডাউনলোড সম্পন্ন!' : 'Report exported as CSV successfully!');
    } catch {
      toast.error(isBangla ? 'CSV এক্সপোর্ট করা যায়নি' : 'Failed to export CSV');
    }
  };

  // CSV Export Handlers for Tabs
  const exportTransactionsCsv = () => {
    const list = transactionsData?.data || [];
    const headers = ['Date', 'Description', 'Party', 'Flow', 'Account', 'Amount'];
    const rows = list.map((t: any) => [
      t.date ? new Date(t.date).toISOString().split('T')[0] : '',
      t.title || t.description || 'Transaction',
      t.partyName || '',
      t.flow || '',
      t.accountName || t.mode || '',
      t.amount || 0,
    ]);
    downloadCsv('finance-transactions-report', headers, rows);
  };

  const exportCustomersCsv = () => {
    const headers = ['Customer Name', 'Phone', 'Branch', 'Due Amount'];
    const rows = customerParties.map((c: any) => [
      c.name || '',
      c.phone || '',
      c.storeName || '',
      Math.abs(Number(c.currentBalance || c.totalDue || 0)),
    ]);
    downloadCsv('customer-receivables-report', headers, rows);
  };

  const exportSuppliersCsv = () => {
    const headers = ['Supplier Name', 'Phone', 'Branch', 'Payable Amount'];
    const rows = supplierParties.map((s: any) => [
      s.name || '',
      s.phone || '',
      s.storeName || '',
      Math.abs(Number(s.currentBalance || s.totalDue || 0)),
    ]);
    downloadCsv('supplier-payables-report', headers, rows);
  };

  const handlePrint = () => {
    window.print();
  };

  // Tab definitions
  const tabs: { key: FinanceTabKey; labelEn: string; labelBn: string; icon: React.ElementType }[] = [
    { key: 'overview', labelEn: 'Overview', labelBn: 'সারসংক্ষেপ', icon: LayoutDashboard },
    { key: 'income-expense', labelEn: 'Income & Expense', labelBn: 'আয় ও ব্যয়', icon: TrendingUp },
    { key: 'cash-bank', labelEn: 'Cash & Bank', labelBn: 'নগদ ও ব্যাংক', icon: Wallet },
    { key: 'receivables', labelEn: 'Receivables', labelBn: 'গ্রাহক পাওনা', icon: Receipt },
    { key: 'payables', labelEn: 'Payables', labelBn: 'সরবরাহকারী দেনা', icon: CreditCard },
    { key: 'profit-loss', labelEn: 'Profit & Loss', labelBn: 'লাভ-ক্ষতি বিবরণী', icon: FileSpreadsheet },
  ];

  return (
    <div className="space-y-6 pb-12 max-w-[1560px] mx-auto">
      {/* 1. Page Header */}
      <PageHeader
        title={isBangla ? 'অর্থায়ন ও আর্থিক বিবরণী' : 'Finance & Financial Reports'}
        subtitle={
          isBangla
            ? 'ব্যবসায়ের নগদ তারল্য, আয়-ব্যয়, বকেয়া এবং পরিচালন মার্জিনের সমন্বিত বিবরণী'
            : 'Comprehensive business liquidity, income, expenses, receivables, and operational margins'
        }
        showBack
        fallbackHref="/finance"
      />

      {/* 2. Global Filter Bar: Presets, Dates, Branch, Print */}
      <FinanceDateFilter
        preset={datePreset}
        onPresetChange={handlePresetChange}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        selectedBranch={selectedBranch}
        onBranchChange={setSelectedBranch}
        branches={branches}
        onPrint={handlePrint}
      />

      {/* 3. Navigation Tabs Controller */}
      <div className="border-b border-border/70 pb-1">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTabChange(tab.key)}
                className={cn(
                  'px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2',
                  isActive
                    ? 'bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{isBangla ? tab.labelBn : tab.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Tab Panels */}
      <div className="pt-1">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <FinanceOverviewTab
            stats={paymentStats}
            partyStats={partyStats}
            expenseSummary={expenseSummary}
            salesSummary={salesReportSummary}
            recentTransactions={transactionsData?.data || []}
            isLoading={isLoadingPaymentStats || isLoadingPartyStats || isLoadingSalesSummary}
            onNavigateTab={handleTabChange}
          />
        )}

        {/* TAB 2: INCOME & EXPENSE REPORT */}
        {activeTab === 'income-expense' && (
          <IncomeExpenseTab
            transactions={transactionsData?.data || []}
            meta={transactionsData?.meta || { totalPages: 1, totalIn: 0, totalOut: 0 }}
            categories={expenseCategories}
            isLoading={isLoadingTxns}
            currentPage={txnPage}
            onPageChange={setTxnPage}
            flowFilter={txnFlow}
            onFlowFilterChange={setTxnFlow}
            searchTerm={txnSearch}
            onSearchChange={setTxnSearch}
            onExportCsv={exportTransactionsCsv}
          />
        )}

        {/* TAB 3: CASH & BANK REPORT */}
        {activeTab === 'cash-bank' && (
          <CashBankTab
            stats={paymentStats}
            accounts={paymentAccounts}
            transfers={depositsWithdrawals}
            isLoadingAccounts={isLoadingAccounts}
            isLoadingTransfers={isLoadingDeposits}
          />
        )}

        {/* TAB 4: RECEIVABLES REPORT */}
        {activeTab === 'receivables' && (
          <ReceivablesTab
            partyStats={partyStats}
            customers={customerParties}
            isLoading={isLoadingCustomers || isLoadingPartyStats}
            searchTerm={customerSearch}
            onSearchChange={setCustomerSearch}
            currentPage={customerPage}
            onPageChange={setCustomerPage}
            onExportCsv={exportCustomersCsv}
          />
        )}

        {/* TAB 5: PAYABLES REPORT */}
        {activeTab === 'payables' && (
          <PayablesTab
            partyStats={partyStats}
            suppliers={supplierParties}
            isLoading={isLoadingSuppliers || isLoadingPartyStats}
            searchTerm={supplierSearch}
            onSearchChange={setSupplierSearch}
            currentPage={supplierPage}
            onPageChange={setSupplierPage}
            onExportCsv={exportSuppliersCsv}
          />
        )}

        {/* TAB 6: PRELIMINARY PROFIT & LOSS */}
        {activeTab === 'profit-loss' && (
          <PreliminaryPnLTab
            salesSummary={salesReportSummary}
            purchaseSummary={purchaseReportData?.summary}
            expenseSummary={expenseSummary}
            isLoading={isLoadingSalesSummary || isLoadingExpenseSummary}
            onPrint={handlePrint}
          />
        )}
      </div>
    </div>
  );
}

export default function FinanceReportsPage() {
  return (
    <Suspense fallback={
      <div className="p-8 space-y-4 max-w-[1560px] mx-auto">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-12 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
      </div>
    }>
      <FinanceReportsContent />
    </Suspense>
  );
}
