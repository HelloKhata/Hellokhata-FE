// Hello Khata OS - Supplier Reports & Procurement Analytics
// হ্যালো খাতা - সরবরাহকারী রিপোর্টস ও ক্রয় অ্যানালিটিক্স ড্যাশবোর্ড

'use client';

import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import { SupplierReportHeader } from '@/components/reports/suppliers/SupplierReportHeader';
import { SupplierExecutiveSnapshot } from '@/components/reports/suppliers/SupplierExecutiveSnapshot';
import { SupplierPurchaseTrendChart } from '@/components/reports/suppliers/SupplierPurchaseTrendChart';
import { TopSuppliersTable } from '@/components/reports/suppliers/TopSuppliersTable';
import { SupplierPayableAndPaymentHealth } from '@/components/reports/suppliers/SupplierPayableAndPaymentHealth';
import { SupplierDetailedTable } from '@/components/reports/suppliers/SupplierDetailedTable';

import {
  MOCK_SUPPLIER_KPIS,
  MOCK_SUPPLIER_PURCHASE_TREND_MONTHLY,
  MOCK_SUPPLIER_PURCHASE_TREND_WEEKLY,
  MOCK_SUPPLIER_PURCHASE_TREND_DAILY,
  MOCK_TOP_SUPPLIERS,
  MOCK_SUPPLIER_AGING,
  MOCK_SETTLEMENT_CHANNELS,
  MOCK_DETAILED_SUPPLIER_RECORDS,
} from '@/components/reports/suppliers/mock-data';
import { exportSupplierReportsExcel } from '@/lib/export/supplier-excel-export';

export default function SupplierReportsPage() {
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
        return MOCK_SUPPLIER_PURCHASE_TREND_DAILY;
      case 'weekly':
        return MOCK_SUPPLIER_PURCHASE_TREND_WEEKLY;
      case 'monthly':
      default:
        return MOCK_SUPPLIER_PURCHASE_TREND_MONTHLY;
    }
  }, [timeframe]);

  // Export handler
  const handleExport = (type: 'excel' | 'pdf' | 'print') => {
    if (type === 'excel') {
      exportSupplierReportsExcel(MOCK_DETAILED_SUPPLIER_RECORDS, MOCK_TOP_SUPPLIERS);
      toast.success(isBangla ? 'সরবরাহকারী এক্সেল রিপোর্ট ডাউনলোড সম্পন্ন!' : 'Downloaded Supplier Report (.xlsx)!');
    } else {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 max-w-[1560px] mx-auto space-y-5">
      {/* 1. Header Control Bar */}
      <SupplierReportHeader
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        selectedBranch={selectedBranch}
        onBranchChange={setSelectedBranch}
        branches={branches}
        onExport={handleExport}
        isBangla={isBangla}
      />

      {/* 2. Minimal Executive Supplier Snapshot (5 Key Metrics) */}
      <SupplierExecutiveSnapshot
        metrics={MOCK_SUPPLIER_KPIS}
        isBangla={isBangla}
      />

      {/* 3. Primary Procurement & Purchase Trend Visualization */}
      <SupplierPurchaseTrendChart
        data={trendData}
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        isBangla={isBangla}
      />

      {/* 4. Core Operational 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Top Vendors & Strategic Suppliers */}
        <TopSuppliersTable
          suppliers={MOCK_TOP_SUPPLIERS}
          isBangla={isBangla}
        />

        {/* Right: Accounts Payable Aging & Disbursement Channels */}
        <SupplierPayableAndPaymentHealth
          totalDue={MOCK_SUPPLIER_KPIS.accountsPayable}
          agingBuckets={MOCK_SUPPLIER_AGING}
          settlementChannels={MOCK_SETTLEMENT_CHANNELS}
          isBangla={isBangla}
        />
      </div>

      {/* 5. Master Supplier Procurement Ledger Table */}
      <SupplierDetailedTable
        records={MOCK_DETAILED_SUPPLIER_RECORDS}
        onExportExcel={() => exportSupplierReportsExcel(MOCK_DETAILED_SUPPLIER_RECORDS, MOCK_TOP_SUPPLIERS)}
        isBangla={isBangla}
      />
    </div>
  );
}
