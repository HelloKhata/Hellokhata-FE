'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePayrollRegister } from '@/hooks/usePayrollRegister';
import { usePayrollSummary } from '@/hooks/usePayrollSummary';
import { PayrollRecord } from '@/types/payroll-register';

import { PayrollSummaryCards } from './components/PayrollSummaryCards';
import { QuickInsights } from './components/QuickInsights';
import { PayrollFilterBar } from './components/PayrollFilterBar';
import { PayrollRegisterTable } from './components/PayrollRegisterTable';
import { MobilePayrollCards } from './components/MobilePayrollCards';
import { PayrollDetailsDrawer } from './components/PayrollDetailsDrawer';
import { ExportMenu } from './components/ExportMenu';

import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  FileText,
  Printer,
  Share2,
  RefreshCw,
  AlertTriangle,
  Building2,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';

function PayrollRegisterContent() {
  const searchParams = useSearchParams();

  // Read URL query parameters from Payroll / Quick Reports shortcuts
  const initialBranch = searchParams?.get('branch') || 'all';
  const initialPeriod = searchParams?.get('period') || 'July 2026';

  const {
    records,
    filteredRecords,
    filters,
    isLoading,
    isError,
    updateFilter,
    resetFilters,
    refetch,
  } = usePayrollRegister({
    branch: initialBranch,
    payrollPeriod: initialPeriod,
  });

  const summary = usePayrollSummary(filteredRecords);
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null);

  // Sync initial query params if present in URL
  useEffect(() => {
    if (initialBranch && initialBranch !== 'all') {
      updateFilter('branch', initialBranch);
    }
    if (initialPeriod) {
      updateFilter('payrollPeriod', initialPeriod);
    }
  }, [initialBranch, initialPeriod]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Payroll register report link copied to clipboard.');
    }
  };

  if (isError) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8 border border-border/60 rounded-2xl bg-card text-center space-y-4">
        <div className="h-12 w-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div className="space-y-1 max-w-md">
          <h3 className="text-base font-semibold text-foreground">
            Unable to load payroll records
          </h3>
          <p className="text-xs text-muted-foreground">
            An error occurred while fetching payroll register records. Please check your network connection and try again.
          </p>
        </div>
        <Button
          onClick={() => refetch()}
          size="sm"
          className="rounded-xl h-9 px-4 gap-2 text-xs font-medium"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Retry Loading
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Printable Company Header (Visible only when printing) */}
      <div className="hidden print:block space-y-2 mb-6 border-b border-black pb-4 text-black">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Hello Khata ERP</h1>
            <p className="text-xs">Official Payroll Register Statement</p>
          </div>
          <div className="text-right text-xs">
            <p>Generated: {new Date().toLocaleDateString()}</p>
            <p>Period: {filters.payrollPeriod}</p>
          </div>
        </div>
      </div>

      {/* Header & Breadcrumbs */}
      <div className="space-y-3 print:hidden">
        <Breadcrumb>
          <BreadcrumbList className="text-xs">
            <BreadcrumbItem>
              <BreadcrumbLink href="/reports" className="hover:text-primary">
                Reports
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/hrm/employees" className="hover:text-primary">
                HR
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-foreground">
                Payroll Register
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary shrink-0" />
              Payroll Register
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              View and export comprehensive payroll records by branch and payroll period.
            </p>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <ExportMenu records={filteredRecords} />

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="h-9 px-3 text-xs rounded-xl font-medium border-border/70 gap-1.5"
            >
              <Printer className="h-3.5 w-3.5 text-muted-foreground" />
              Print
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="h-9 px-3 text-xs rounded-xl font-medium border-border/70 gap-1.5"
            >
              <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
              Share
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground rounded-xl"
              title="Refresh Payroll Data"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <PayrollSummaryCards
        summary={summary}
        totalRecordsCount={records.length}
        isLoading={isLoading}
      />

      {/* Collapsible Quick Insights */}
      <QuickInsights summary={summary} />

      {/* Advanced Filter Section */}
      <PayrollFilterBar
        filters={filters}
        onUpdateFilter={updateFilter}
        onResetFilters={resetFilters}
      />

      {/* Main Payroll Table (Desktop & Tablet) */}
      <div className="hidden md:block">
        <PayrollRegisterTable
          records={filteredRecords}
          isLoading={isLoading}
          onSelectRecord={(rec) => setSelectedRecord(rec)}
          onResetFilters={resetFilters}
        />
      </div>

      {/* Mobile Card List */}
      <div className="block md:hidden">
        <MobilePayrollCards
          records={filteredRecords}
          onSelectRecord={(rec) => setSelectedRecord(rec)}
        />
      </div>

      {/* Payslip Details Side Drawer */}
      <PayrollDetailsDrawer
        record={selectedRecord}
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </div>
  );
}

export default function PayrollRegisterPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading Payroll Register...</div>}>
      <PayrollRegisterContent />
    </Suspense>
  );
}
