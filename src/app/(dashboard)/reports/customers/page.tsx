// Hello Khata OS - Customer Reports & Analytics Dashboard (Minimal & Refined Standard)
// হ্যালো খাতা - গ্রাহক রিপোর্টস ও কাস্টমার অ্যানালিটিক্স ড্যাশবোর্ড

'use client';

import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import { CustomerReportHeader } from '@/components/reports/customers/CustomerReportHeader';
import { CustomerExecutiveSnapshot } from '@/components/reports/customers/CustomerExecutiveSnapshot';
import { CustomerSalesTrendChart } from '@/components/reports/customers/CustomerSalesTrendChart';
import { TopCustomersTable } from '@/components/reports/customers/TopCustomersTable';
import { CustomerCreditAndPaymentHealth } from '@/components/reports/customers/CustomerCreditAndPaymentHealth';
import { CustomerDetailedTable } from '@/components/reports/customers/CustomerDetailedTable';

import {
  MOCK_CUSTOMER_KPIS,
  MOCK_CUSTOMER_SALES_TREND_MONTHLY,
  MOCK_CUSTOMER_SALES_TREND_WEEKLY,
  MOCK_CUSTOMER_SALES_TREND_DAILY,
  MOCK_TOP_CUSTOMERS,
  MOCK_CUSTOMER_AGING,
  MOCK_PAYMENT_CHANNELS,
  MOCK_DETAILED_CUSTOMER_RECORDS,
} from '@/components/reports/customers/mock-data';
import { exportCustomerReportsExcel } from '@/lib/export/customer-excel-export';

export default function CustomerReportsPage() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();

  // Filters State
  const [dateRange, setDateRange] = useState('this_month');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  // Branch list
  const branches = useMemo(() => [
    { id: 'branch-1', name: 'Dhanmondi Main Branch' },
    { id: 'branch-2', name: 'Gulshan Corporate Branch' },
    { id: 'branch-3', name: 'Uttara Retail Outlet' },
    { id: 'branch-4', name: 'Chittagong Hub' },
  ], []);

  // Trend data according to timeframe
  const trendData = useMemo(() => {
    switch (timeframe) {
      case 'daily':
        return MOCK_CUSTOMER_SALES_TREND_DAILY;
      case 'weekly':
        return MOCK_CUSTOMER_SALES_TREND_WEEKLY;
      case 'monthly':
      default:
        return MOCK_CUSTOMER_SALES_TREND_MONTHLY;
    }
  }, [timeframe]);

  // Export handler
  const handleExport = (type: 'excel' | 'pdf' | 'print') => {
    if (type === 'excel') {
      exportCustomerReportsExcel(MOCK_DETAILED_CUSTOMER_RECORDS, MOCK_TOP_CUSTOMERS);
      toast.success(isBangla ? 'গ্রাহক এক্সেল রিপোর্ট ডাউনলোড সম্পন্ন!' : 'Downloaded Customer Report (.xlsx)!');
    } else {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 max-w-[1560px] mx-auto space-y-5">
      {/* 1. Header Control Bar */}
      <CustomerReportHeader
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        selectedBranch={selectedBranch}
        onBranchChange={setSelectedBranch}
        branches={branches}
        onExport={handleExport}
        isBangla={isBangla}
      />

      {/* 2. Minimal Executive Customer Snapshot (5 Key Metrics) */}
      <CustomerExecutiveSnapshot
        metrics={MOCK_CUSTOMER_KPIS}
        isBangla={isBangla}
      />

      {/* 3. Primary Customer Sales Trend Visualization */}
      <CustomerSalesTrendChart
        data={trendData}
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        isBangla={isBangla}
      />

      {/* 4. Core Operational 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Top Accounts & Key Spenders */}
        <TopCustomersTable
          customers={MOCK_TOP_CUSTOMERS}
          isBangla={isBangla}
        />

        {/* Right: Receivables Aging & Settlement Channels */}
        <CustomerCreditAndPaymentHealth
          totalDue={MOCK_CUSTOMER_KPIS.outstandingReceivables}
          agingBuckets={MOCK_CUSTOMER_AGING}
          repeatPurchaseRate={68.4}
          channels={MOCK_PAYMENT_CHANNELS}
          isBangla={isBangla}
        />
      </div>

      {/* 5. Master Customer Performance Ledger Table */}
      <CustomerDetailedTable
        records={MOCK_DETAILED_CUSTOMER_RECORDS}
        onExportExcel={() => exportCustomerReportsExcel(MOCK_DETAILED_CUSTOMER_RECORDS, MOCK_TOP_CUSTOMERS)}
        isBangla={isBangla}
      />
    </div>
  );
}
