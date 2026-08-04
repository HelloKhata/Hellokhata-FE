import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  CategoryBreakdownItem,
  CashFlowPointExtended,
  AccountOverview,
  RecentTransaction,
  FinancialDashboardInsights,
} from '@/types/finance';
import { RoleCode } from '@/types/role';

export interface DashboardKpiCard {
  id: string;
  title: string;
  titleBn?: string;
  value: number;
  changePercentage: number;
  periodLabel: string;
  trend: 'up' | 'down' | 'neutral';
  sparkline: number[];
  categoryDetail?: string;
}

export const MOCK_KPIS: Record<string, DashboardKpiCard> = {
  totalIncome: {
    id: 'totalIncome',
    title: 'Total Income',
    titleBn: 'মোট আয়',
    value: 524800,
    changePercentage: 14.2,
    periodLabel: 'vs last month',
    trend: 'up',
    sparkline: [42, 48, 45, 52, 58, 62, 70],
    categoryDetail: 'POS + Invoices + Services',
  },
  totalExpenses: {
    id: 'totalExpenses',
    title: 'Total Expenses',
    titleBn: 'মোট খরচ',
    value: 189400,
    changePercentage: -3.8,
    periodLabel: 'vs last month',
    trend: 'down',
    sparkline: [30, 28, 25, 26, 22, 24, 20],
    categoryDetail: 'Rent + Utility + Payroll',
  },
  netProfit: {
    id: 'netProfit',
    title: 'Net Profit / Balance',
    titleBn: 'নিট লাভ / ব্যালেন্স',
    value: 335400,
    changePercentage: 22.5,
    periodLabel: 'vs last month',
    trend: 'up',
    sparkline: [12, 20, 20, 26, 36, 38, 50],
    categoryDetail: 'Margin: 63.9%',
  },
  cashInHand: {
    id: 'cashInHand',
    title: 'Cash in Hand',
    titleBn: 'হাতে ক্যাশ',
    value: 110000,
    changePercentage: 5.0,
    periodLabel: 'synced 2m ago',
    trend: 'up',
    sparkline: [95, 98, 100, 102, 105, 108, 110],
    categoryDetail: 'Main Cash Register',
  },
  bankBalance: {
    id: 'bankBalance',
    title: 'Bank Balance',
    titleBn: 'ব্যাংক ব্যালেন্স',
    value: 135600,
    changePercentage: 8.4,
    periodLabel: 'synced 5m ago',
    trend: 'up',
    sparkline: [110, 115, 120, 122, 128, 130, 135.6],
    categoryDetail: '3 Active Bank Accounts',
  },
  totalReceivable: {
    id: 'totalReceivable',
    title: 'Total Receivable',
    titleBn: 'মোট প্রাপ্য (দেনা)',
    value: 48000,
    changePercentage: -12.1,
    periodLabel: '3 overdue invoices',
    trend: 'down',
    sparkline: [60, 58, 55, 52, 50, 49, 48],
    categoryDetail: '6 Pending Customer Bills',
  },
  totalPayable: {
    id: 'totalPayable',
    title: 'Total Payable',
    titleBn: 'মোট প্রদেয় (পাওনা)',
    value: 21000,
    changePercentage: -5.4,
    periodLabel: '2 due bills',
    trend: 'down',
    sparkline: [28, 26, 25, 24, 23, 22, 21],
    categoryDetail: '4 Vendor Bills Pending',
  },
};

export const MOCK_INCOME_BREAKDOWN = [
  { category: 'POS Retail Sales', amount: 312000, percentage: 59.4, color: '#10b981' },
  { category: 'Wholesale Orders', amount: 145000, percentage: 27.6, color: '#3b82f6' },
  { category: 'Service & Consultations', amount: 48800, percentage: 9.3, color: '#6366f1' },
  { category: 'Other Income', amount: 19000, percentage: 3.7, color: '#f59e0b' },
];

export const MOCK_EXPENSE_BREAKDOWN = [
  { category: 'Inventory Purchases', amount: 95000, percentage: 50.1, color: '#ef4444' },
  { category: 'Staff Payroll & Salaries', amount: 48000, percentage: 25.3, color: '#f97316' },
  { category: 'Store Rent & Utilities', amount: 26400, percentage: 13.9, color: '#ec4899' },
  { category: 'Marketing & Ads', amount: 12000, percentage: 6.3, color: '#8b5cf6' },
  { category: 'Office & Miscellaneous', amount: 8000, percentage: 4.4, color: '#64748b' },
];

export const MOCK_CASH_FLOW_TRENDS: Record<string, CashFlowPointExtended[]> = {
  weekly: [
    { date: '2026-07-17', label: 'Sat', income: 65000, expense: 21000, profit: 44000 },
    { date: '2026-07-18', label: 'Sun', income: 92000, expense: 34000, profit: 58000 },
    { date: '2026-07-19', label: 'Mon', income: 78000, expense: 19000, profit: 59000 },
    { date: '2026-07-20', label: 'Tue', income: 114000, expense: 42000, profit: 72000 },
    { date: '2026-07-21', label: 'Wed', income: 81000, expense: 28000, profit: 53000 },
    { date: '2026-07-22', label: 'Thu', income: 93000, expense: 45000, profit: 48000 },
    { date: '2026-07-23', label: 'Fri (Today)', income: 120000, expense: 35000, profit: 85000 },
  ],
  monthly: [
    { date: '2026-01', label: 'Jan', income: 410000, expense: 160000, profit: 250000 },
    { date: '2026-02', label: 'Feb', income: 430000, expense: 175000, profit: 255000 },
    { date: '2026-03', label: 'Mar', income: 480000, expense: 190000, profit: 290000 },
    { date: '2026-04', label: 'Apr', income: 460000, expense: 180000, profit: 280000 },
    { date: '2026-05', label: 'May', income: 510000, expense: 195000, profit: 315000 },
    { date: '2026-06', label: 'Jun', income: 490000, expense: 185000, profit: 305000 },
    { date: '2026-07', label: 'Jul', income: 524800, expense: 189400, profit: 335400 },
  ],
  quarterly: [
    { date: '2025-Q3', label: 'Q3 2025', income: 1200000, expense: 480000, profit: 720000 },
    { date: '2025-Q4', label: 'Q4 2025', income: 1350000, expense: 510000, profit: 840000 },
    { date: '2026-Q1', label: 'Q1 2026', income: 1320000, expense: 525000, profit: 795000 },
    { date: '2026-Q2', label: 'Q2 2026', income: 1460000, expense: 560000, profit: 900000 },
  ],
  yearly: [
    { date: '2023', label: '2023', income: 3800000, expense: 1600000, profit: 2200000 },
    { date: '2024', label: '2024', income: 4600000, expense: 1900000, profit: 2700000 },
    { date: '2025', label: '2025', income: 5200000, expense: 2100000, profit: 3100000 },
    { date: '2026 YTD', label: '2026 (YTD)', income: 3304800, expense: 1274400, profit: 2030400 },
  ],
};

export const MOCK_ACCOUNTS: AccountOverview[] = [
  {
    id: 'acc-1',
    accountName: 'Main Store Cash Drawer',
    accountType: 'Cash',
    currentBalance: 110000,
    availableBalance: 110000,
    status: 'active',
  },
  {
    id: 'acc-2',
    accountName: 'BRAC Bank Corporate Account',
    accountType: 'Bank',
    accountNumber: '1501203948001',
    currentBalance: 85600,
    availableBalance: 85600,
    status: 'active',
  },
  {
    id: 'acc-3',
    accountName: 'City Bank Current Account',
    accountType: 'Bank',
    accountNumber: '1102938475001',
    currentBalance: 50000,
    availableBalance: 50000,
    status: 'active',
  },
  {
    id: 'acc-4',
    accountName: 'bKash Merchant Wallet',
    accountType: 'Mobile Banking',
    accountNumber: '01711223344',
    currentBalance: 20000,
    availableBalance: 20000,
    status: 'active',
  },
  {
    id: 'acc-5',
    accountName: 'DBBL Nexus Gateway',
    accountType: 'Credit Card',
    accountNumber: '4105 **** **** 1029',
    currentBalance: -15000,
    availableBalance: 85000,
    status: 'active',
  },
];

export const MOCK_UNIFIED_TRANSACTIONS: RecentTransaction[] = [
  {
    id: 'tx-2001',
    type: 'sale',
    accountName: 'Main Store Cash Drawer',
    description: 'POS Retail Checkout #2001',
    category: 'POS Sale',
    isAuto: true,
    branchName: 'Main Branch (Dhaka)',
    timestamp: 'Today, 02:45 PM',
    rawDate: new Date(),
    amount: 14500,
    status: 'completed',
  },
  {
    id: 'tx-2002',
    type: 'expense',
    accountName: 'City Bank Current Account',
    description: 'Electricity & Utility Bill',
    category: 'Utilities',
    isAuto: false,
    branchName: 'Main Branch (Dhaka)',
    timestamp: 'Today, 11:20 AM',
    rawDate: new Date(),
    amount: -3500,
    status: 'completed',
  },
  {
    id: 'tx-2003',
    type: 'income',
    accountName: 'BRAC Bank Corporate Account',
    description: 'Corporate Wholesale Payment Received',
    category: 'Wholesale Orders',
    isAuto: false,
    branchName: 'Chittagong Outlet',
    timestamp: 'Yesterday, 04:15 PM',
    rawDate: new Date(Date.now() - 86400000),
    amount: 45000,
    status: 'completed',
  },
  {
    id: 'tx-2004',
    type: 'transfer',
    accountName: 'bKash Merchant Wallet',
    description: 'Cash Drawer to Bank Transfer',
    category: 'Fund Transfer',
    isAuto: false,
    branchName: 'Main Branch (Dhaka)',
    timestamp: 'Yesterday, 02:10 PM',
    rawDate: new Date(Date.now() - 86400000),
    amount: 20000,
    status: 'completed',
  },
  {
    id: 'tx-2005',
    type: 'expense',
    accountName: 'Main Store Cash Drawer',
    description: 'Office Snacks & Refreshments',
    category: 'Office Expenses',
    isAuto: false,
    branchName: 'Sylhet Branch',
    timestamp: '22 Jul 2026',
    rawDate: new Date(Date.now() - 172800000),
    amount: -1200,
    status: 'completed',
  },
  {
    id: 'tx-2006',
    type: 'refund',
    accountName: 'bKash Merchant Wallet',
    description: 'Customer Order Return Refund #1089',
    category: 'Sales Return',
    isAuto: true,
    branchName: 'Chittagong Outlet',
    timestamp: '21 Jul 2026',
    rawDate: new Date(Date.now() - 259200000),
    amount: -2400,
    status: 'completed',
  },
  {
    id: 'tx-2007',
    type: 'sale',
    accountName: 'Main Store Cash Drawer',
    description: 'Retail Sale #1998',
    category: 'POS Sale',
    isAuto: true,
    branchName: 'Main Branch (Dhaka)',
    timestamp: '21 Jul 2026',
    rawDate: new Date(Date.now() - 259200000),
    amount: 8200,
    status: 'completed',
  },
  {
    id: 'tx-2008',
    type: 'income',
    accountName: 'BRAC Bank Corporate Account',
    description: 'IT Consulting Service Invoice #304',
    category: 'Service & Consultations',
    isAuto: false,
    branchName: 'Main Branch (Dhaka)',
    timestamp: '20 Jul 2026',
    rawDate: new Date(Date.now() - 345600000),
    amount: 15000,
    status: 'completed',
  },
  {
    id: 'tx-2009',
    type: 'expense',
    accountName: 'BRAC Bank Corporate Account',
    description: 'Google Cloud & SaaS Subscription',
    category: 'Software & Ads',
    isAuto: false,
    branchName: 'Main Branch (Dhaka)',
    timestamp: '19 Jul 2026',
    rawDate: new Date(Date.now() - 432000000),
    amount: -4800,
    status: 'completed',
  },
  {
    id: 'tx-2010',
    type: 'withdrawal',
    accountName: 'Main Store Cash Drawer',
    description: 'Owner Personal Cash Draw',
    category: 'Drawings',
    isAuto: false,
    branchName: 'Main Branch (Dhaka)',
    timestamp: '18 Jul 2026',
    rawDate: new Date(Date.now() - 518400000),
    amount: -10000,
    status: 'completed',
  },
];

export const MOCK_INSIGHTS: FinancialDashboardInsights = {
  highestExpenseCategory: { name: 'Inventory Purchases', amount: 95000 },
  highestIncomeSource: { name: 'POS Retail Sales', amount: 312000 },
  profitMarginPercentage: 63.9,
  avgDailyIncome: 16929,
  avgDailyExpense: 6109,
  bestPerformingMonth: 'July 2026',
  worstPerformingMonth: 'January 2026',
};

export const useFinancialDashboard = () => {
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('this_month');
  const [cashFlowTimeframe, setCashFlowTimeframe] = useState<'weekly' | 'monthly' | 'quarterly' | 'yearly'>('monthly');

  const {
    data,
    isLoading,
    isError,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ['financial-dashboard', selectedBranch, selectedPeriod, cashFlowTimeframe],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
      return {
        kpis: MOCK_KPIS,
        incomeBreakdown: MOCK_INCOME_BREAKDOWN,
        expenseBreakdown: MOCK_EXPENSE_BREAKDOWN,
        cashFlow: MOCK_CASH_FLOW_TRENDS[cashFlowTimeframe] || MOCK_CASH_FLOW_TRENDS.monthly,
        accounts: MOCK_ACCOUNTS,
        transactions: MOCK_UNIFIED_TRANSACTIONS,
        insights: MOCK_INSIGHTS,
      };
    },
    staleTime: 1000 * 60 * 10,
  });

  return {
    kpis: data?.kpis || MOCK_KPIS,
    incomeBreakdown: data?.incomeBreakdown || MOCK_INCOME_BREAKDOWN,
    expenseBreakdown: data?.expenseBreakdown || MOCK_EXPENSE_BREAKDOWN,
    cashFlow: data?.cashFlow || MOCK_CASH_FLOW_TRENDS.monthly,
    accounts: data?.accounts || MOCK_ACCOUNTS,
    transactions: data?.transactions || MOCK_UNIFIED_TRANSACTIONS,
    insights: data?.insights || MOCK_INSIGHTS,
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
  };
};
