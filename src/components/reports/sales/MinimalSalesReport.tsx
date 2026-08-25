// Hello Khata OS - HelloKhata Minimal Sales Report Component (100% Inline Architecture, No Drawers)
// হ্যালো খাতা - মিনিমাল বিক্রয় রিপোর্ট প্রধান কম্পোনেন্ট

'use client';

import React, { useState } from 'react';
import { SalesFocusProvider, useSalesFocus } from './SalesFocusContext';
import { ReportHeader } from './ReportHeader';
import { SalesSummaryTrend } from './SalesSummaryTrend';
import { SalesDrivers } from './SalesDrivers';
import { SalesRecords } from './SalesRecords';
import { ViewAllDriversModal } from './ViewAllDriversModal';
import { PrintReportPreview, ReportColumn } from '@/components/reports/PrintReportPreview';
import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import { useSessionStore } from '@/stores/sessionStore';
import { useBranchStore } from '@/stores/branchStore';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { SalesTransactionRecord } from '@/types/sales-report';

function MinimalSalesReportContent() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const user = useSessionStore((state) => state.user);
  const business = useSessionStore((state) => state.business);
  const branches = useBranchStore((state) => state.branches);

  const {
    reportData,
    dateRangeLabel,
    branchId,
    period,
    focus,
  } = useSalesFocus();

  const [printPreviewOpen, setPrintPreviewOpen] = useState(false);
  const [printInvoiceData, setPrintInvoiceData] = useState<SalesTransactionRecord[]>([]);

  // CSV Export
  const handleExportCsv = () => {
    const headers = ['Invoice No', 'Date', 'Customer', 'Items Count', 'Amount (BDT)', 'Payment Status', 'Salesperson', 'Branch'];
    const rows = reportData.records.map((r) => [
      r.invoiceNo,
      r.date,
      `"${r.customerName}"`,
      r.itemsCount,
      r.amount,
      r.paymentStatus,
      r.salesperson,
      `"${r.branch}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HelloKhata_Sales_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(isBangla ? 'সেলস রিপোর্ট CSV ডাউনলোড সম্পন্ন হয়েছে' : 'Sales report CSV downloaded successfully');
  };

  // Handle single invoice print
  const handlePrintSpecificInvoice = (record: SalesTransactionRecord) => {
    setPrintInvoiceData([record]);
    setPrintPreviewOpen(true);
  };

  const handlePrintFullReport = () => {
    setPrintInvoiceData(reportData.records);
    setPrintPreviewOpen(true);
  };

  const printColumns: ReportColumn<SalesTransactionRecord>[] = [
    {
      header: 'Invoice No',
      headerBn: 'ইনভয়েস নং',
      accessor: (row) => row.invoiceNo,
    },
    {
      header: 'Date',
      headerBn: 'তারিখ',
      accessor: (row) => row.date,
    },
    {
      header: 'Customer',
      headerBn: 'গ্রাহক',
      accessor: (row) => row.customerName,
    },
    {
      header: 'Items',
      headerBn: 'আইটেম',
      accessor: (row) => row.itemsCount,
      align: 'center',
    },
    {
      header: 'Status',
      headerBn: 'স্ট্যাটাস',
      accessor: (row) => (row.paymentStatus === 'paid' ? 'Paid' : row.paymentStatus === 'partial' ? 'Partial' : 'Due'),
      align: 'center',
    },
    {
      header: 'Amount',
      headerBn: 'পরিমাণ',
      accessor: (row) => `৳${row.amount.toLocaleString('en-IN')}`,
      align: 'right',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full space-y-6 pb-12"
    >
      {/* 01. Compact Report Header with Inline Filters */}
      <ReportHeader
        onExportCsv={handleExportCsv}
        onPrintReport={handlePrintFullReport}
      />

      {/* 02 & 03. Sales Summary (with Inline Accordion Waterfall) + Sales Trend Chart */}
      <SalesSummaryTrend />

      {/* 04. What Drove Sales (Ranked Driver Tabbed List) */}
      <SalesDrivers />

      {/* 05. Sales Records (Minimal Audit Table with Inline Row Expansion) */}
      <SalesRecords onPrintInvoice={handlePrintSpecificInvoice} />

      {/* Full Modal for viewing all drivers */}
      <ViewAllDriversModal />

      {/* Full-Screen Print & PDF Preview */}
      <PrintReportPreview
        isOpen={printPreviewOpen}
        onClose={() => setPrintPreviewOpen(false)}
        title={isBangla ? 'বিক্রয় রিপোর্ট বিবরণী' : 'HelloKhata Sales Report'}
        titleBn="বিক্রয় রিপোর্ট বিবরণী"
        subtitle={`Period: ${dateRangeLabel} • Scope: ${branchId === 'all' ? 'All Branches' : branchId}`}
        businessName={business?.name || 'HelloKhata Enterprise'}
        branchName={branchId === 'all' ? 'All Branches' : branchId}
        businessAddress={business?.address || 'ঢাকা, বাংলাদেশ'}
        contactInfo={business?.phone || '+৮৮০ ১৭০০০-০০০০০'}
        userName={user?.name || 'Authorized User'}
        dateRange={{
          period,
          start: '2026-05-01',
          end: '2026-05-31',
        }}
        activeFilters={{
          Period: dateRangeLabel,
          Focus: focus ? `${focus.name} (${formatCurrency(focus.amount)})` : 'None (All Sales)',
          Branch: branchId === 'all' ? 'All Branches' : branchId,
        }}
        kpis={[
          {
            label: 'Net Sales',
            labelBn: 'নিট বিক্রয়',
            value: formatCurrency(reportData.summary.netSales),
          },
          {
            label: 'Growth',
            labelBn: 'প্রবৃদ্ধি',
            value: `+${reportData.summary.growthPercentage}%`,
          },
          {
            label: 'Total Orders',
            labelBn: 'অর্ডার সংখ্যা',
            value: `${reportData.summary.ordersCount}`,
          },
          {
            label: 'Average Order Value',
            labelBn: 'গড় অর্ডার মান',
            value: formatCurrency(reportData.summary.averageOrderValue),
          },
        ]}
        data={printInvoiceData.length > 0 ? printInvoiceData : reportData.records}
        columns={printColumns}
        isBangla={isBangla}
        formatCurrency={(val) => `৳${Number(val).toLocaleString('en-IN')}`}
      />
    </motion.div>
  );
}

export function MinimalSalesReport() {
  const branches = useBranchStore((state) => state.branches);
  const isSingleBranch = branches ? branches.length <= 1 : false;

  return (
    <SalesFocusProvider isSingleBranchBusiness={isSingleBranch}>
      <MinimalSalesReportContent />
    </SalesFocusProvider>
  );
}
