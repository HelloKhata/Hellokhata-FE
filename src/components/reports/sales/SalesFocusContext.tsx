// Hello Khata OS - Sales Focus Context & Reporting State Management
// হ্যালো খাতা - সেলস ফোকাস কনটেক্সট ও স্টেট

'use client';

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import {
  ReportPeriod,
  TrendInterval,
  TrendMetric,
  DriverDimension,
  SalesFocusItem,
  AdvancedFilterState,
  MinimalSalesReportData,
  SalesTransactionRecord,
} from '@/types/sales.-reports';
import { salesReportService } from './salesReport.service';

interface SalesFocusContextType {
  // Filters & State
  period: ReportPeriod;
  setPeriod: (period: ReportPeriod) => void;
  dateRangeLabel: string;
  branchId: string;
  setBranchId: (id: string) => void;
  compareWithPrevious: boolean;
  setCompareWithPrevious: (compare: boolean) => void;
  
  // Trend Chart State
  interval: TrendInterval;
  setInterval: (interval: TrendInterval) => void;
  metric: TrendMetric;
  setMetric: (metric: TrendMetric) => void;
  
  // Driver Dimension Tab
  activeDimension: DriverDimension;
  setActiveDimension: (dim: DriverDimension) => void;
  
  // Signature Sales Focus Interaction
  focus: SalesFocusItem | null;
  setFocus: (focus: SalesFocusItem | null) => void;
  clearFocus: () => void;
  
  // Advanced Filters
  advancedFilters: AdvancedFilterState;
  setAdvancedFilters: React.Dispatch<React.SetStateAction<AdvancedFilterState>>;
  activeFiltersCount: number;
  clearAdvancedFilters: () => void;
  
  // Modals & Drawers Visibility
  breakdownDrawerOpen: boolean;
  setBreakdownDrawerOpen: (open: boolean) => void;
  filtersSheetOpen: boolean;
  setFiltersSheetOpen: (open: boolean) => void;
  viewAllDriversOpen: boolean;
  setViewAllDriversOpen: (open: boolean) => void;
  selectedInvoice: SalesTransactionRecord | null;
  setSelectedInvoice: (inv: SalesTransactionRecord | null) => void;
  
  // Computed Data
  reportData: MinimalSalesReportData;
  isSingleBranchBusiness: boolean;
}

const SalesFocusContext = createContext<SalesFocusContextType | undefined>(undefined);

export function SalesFocusProvider({
  children,
  isSingleBranchBusiness = false,
}: {
  children: ReactNode;
  isSingleBranchBusiness?: boolean;
}) {
  const [period, setPeriod] = useState<ReportPeriod>('this_month');
  const [branchId, setBranchId] = useState<string>('all');
  const [compareWithPrevious, setCompareWithPrevious] = useState<boolean>(true);
  const [interval, setInterval] = useState<TrendInterval>('daily');
  const [metric, setMetric] = useState<TrendMetric>('sales');
  const [activeDimension, setActiveDimension] = useState<DriverDimension>('products');
  const [focus, setFocus] = useState<SalesFocusItem | null>(null);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterState>({});
  
  // Drawers & Modals
  const [breakdownDrawerOpen, setBreakdownDrawerOpen] = useState(false);
  const [filtersSheetOpen, setFiltersSheetOpen] = useState(false);
  const [viewAllDriversOpen, setViewAllDriversOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<SalesTransactionRecord | null>(null);

  const clearFocus = () => setFocus(null);

  const clearAdvancedFilters = () => setAdvancedFilters({});

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (advancedFilters.paymentMethod && advancedFilters.paymentMethod !== 'all') count++;
    if (advancedFilters.status && advancedFilters.status !== 'all') count++;
    if (advancedFilters.salesperson && advancedFilters.salesperson !== 'all') count++;
    if (advancedFilters.minAmount || advancedFilters.maxAmount) count++;
    return count;
  }, [advancedFilters]);

  const dateRangeLabel = useMemo(() => {
    switch (period) {
      case 'today':
        return 'May 18, 2026';
      case 'yesterday':
        return 'May 17, 2026';
      case 'last_7_days':
        return 'May 12 – May 18, 2026';
      case 'last_month':
        return 'April 1 – April 30, 2026';
      case 'this_quarter':
        return 'Q2 (Apr 1 – Jun 30, 2026)';
      case 'this_month':
      default:
        return 'May 1 – May 31, 2026';
    }
  }, [period]);

  const reportData = useMemo(() => {
    return salesReportService.getSalesReportData({
      period,
      branchId,
      interval,
      focus,
      advancedFilters,
    });
  }, [period, branchId, interval, focus, advancedFilters]);

  const value = {
    period,
    setPeriod,
    dateRangeLabel,
    branchId,
    setBranchId,
    compareWithPrevious,
    setCompareWithPrevious,
    interval,
    setInterval,
    metric,
    setMetric,
    activeDimension,
    setActiveDimension,
    focus,
    setFocus,
    clearFocus,
    advancedFilters,
    setAdvancedFilters,
    activeFiltersCount,
    clearAdvancedFilters,
    breakdownDrawerOpen,
    setBreakdownDrawerOpen,
    filtersSheetOpen,
    setFiltersSheetOpen,
    viewAllDriversOpen,
    setViewAllDriversOpen,
    selectedInvoice,
    setSelectedInvoice,
    reportData,
    isSingleBranchBusiness,
  };

  return <SalesFocusContext.Provider value={value}>{children}</SalesFocusContext.Provider>;
}

export function useSalesFocus() {
  const context = useContext(SalesFocusContext);
  if (!context) {
    throw new Error('useSalesFocus must be used within a SalesFocusProvider');
  }
  return context;
}
