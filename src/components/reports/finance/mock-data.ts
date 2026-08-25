// Hello Khata OS - Finance & Accounting Reports Mock Data Provider
// হ্যালো খাতা - ফাইন্যান্স ও হিসাবরক্ষণ রিপোর্টস মক ডেটা

import type {
  FinancialHealthMetrics,
  PerformanceTimePoint,
  CashMovementSummary,
  AgingBucket,
  ExpenseCategoryItem,
  FinancialAlertItem,
  RecentTransactionItem,
} from './types';

export const MOCK_FINANCE_METRICS: FinancialHealthMetrics = {
  netProfit: 482450,
  netProfitChange: 14.2,
  netProfitPrevious: 422500,
  revenue: 1845200,
  revenueChange: 8.5,
  expenses: 1362750,
  expensesChange: 5.1,
  cashAndBank: 785900,
  receivables: 324500,
  payables: 195000,
  netMargin: 26.1,
};

export const MOCK_PERFORMANCE_MONTHLY: PerformanceTimePoint[] = [
  { period: 'Jan', revenue: 1420000, expenses: 1100000, netProfit: 320000 },
  { period: 'Feb', revenue: 1510000, expenses: 1160000, netProfit: 350000 },
  { period: 'Mar', revenue: 1680000, expenses: 1250000, netProfit: 430000 },
  { period: 'Apr', revenue: 1590000, expenses: 1220000, netProfit: 370000 },
  { period: 'May', revenue: 1720000, expenses: 1290000, netProfit: 430000 },
  { period: 'Jun', revenue: 1810000, expenses: 1340000, netProfit: 470000 },
  { period: 'Jul', revenue: 1700000, expenses: 1296000, netProfit: 404000 },
  { period: 'Aug (Current)', revenue: 1845200, expenses: 1362750, netProfit: 482450 },
];

export const MOCK_PERFORMANCE_WEEKLY: PerformanceTimePoint[] = [
  { period: 'Week 1', revenue: 410000, expenses: 310000, netProfit: 100000 },
  { period: 'Week 2', revenue: 450000, expenses: 330000, netProfit: 120000 },
  { period: 'Week 3', revenue: 490000, expenses: 360000, netProfit: 130000 },
  { period: 'Week 4', revenue: 495200, expenses: 362750, netProfit: 132450 },
];

export const MOCK_PERFORMANCE_DAILY: PerformanceTimePoint[] = [
  { period: '14 Aug', revenue: 62000, expenses: 45000, netProfit: 17000 },
  { period: '15 Aug', revenue: 71000, expenses: 48000, netProfit: 23000 },
  { period: '16 Aug', revenue: 58000, expenses: 42000, netProfit: 16000 },
  { period: '17 Aug', revenue: 84000, expenses: 54000, netProfit: 30000 },
  { period: '18 Aug', revenue: 76000, expenses: 51000, netProfit: 25000 },
  { period: '19 Aug', revenue: 89000, expenses: 58000, netProfit: 31000 },
  { period: '20 Aug (Today)', revenue: 94000, expenses: 61000, netProfit: 33000 },
];

export const MOCK_PERFORMANCE_QUARTERLY: PerformanceTimePoint[] = [
  { period: 'Q1 (Jan-Mar)', revenue: 4610000, expenses: 3510000, netProfit: 1100000 },
  { period: 'Q2 (Apr-Jun)', revenue: 5120000, expenses: 3850000, netProfit: 1270000 },
  { period: 'Q3 (Jul-Sep)', revenue: 3545200, expenses: 2658750, netProfit: 886450 },
];

export const MOCK_PERFORMANCE_YEARLY: PerformanceTimePoint[] = [
  { period: '2023', revenue: 14200000, expenses: 11400000, netProfit: 2800000 },
  { period: '2024', revenue: 17500000, expenses: 13600000, netProfit: 3900000 },
  { period: '2025', revenue: 20100000, expenses: 15200000, netProfit: 4900000 },
  { period: '2026 (YTD)', revenue: 13275200, expenses: 10018750, netProfit: 3256450 },
];

export const MOCK_CASH_MOVEMENT: CashMovementSummary = {
  openingCash: 640000,
  cashIn: 1420000,
  cashOut: 1274100,
  closingCash: 785900,
  netCashFlow: 145900,
  trend: [640000, 680000, 710000, 690000, 730000, 760000, 785900],
};

export const MOCK_RECEIVABLES_DATA = {
  total: 324500,
  dueToday: 45000,
  overdue: 82000,
  aging: [
    { range: '0–30 Days', amount: 197500, percentage: 61 },
    { range: '31–60 Days', amount: 65000, percentage: 20 },
    { range: '61–90 Days', amount: 42000, percentage: 13 },
    { range: '90+ Days', amount: 20000, percentage: 6 },
  ] as AgingBucket[],
};

export const MOCK_PAYABLES_DATA = {
  total: 195000,
  dueToday: 30000,
  overdue: 25000,
  aging: [
    { range: '0–30 Days', amount: 140000, percentage: 72 },
    { range: '31–60 Days', amount: 30000, percentage: 15 },
    { range: '61–90 Days', amount: 15000, percentage: 8 },
    { range: '90+ Days', amount: 10000, percentage: 5 },
  ] as AgingBucket[],
};

export const MOCK_BALANCE_SHEET_DATA = {
  assets: {
    total: 3245000,
    cash: 215000,
    bank: 570900,
    inventory: 2134600,
    receivables: 324500,
  },
  liabilities: {
    total: 485000,
    payables: 195000,
    loans: 250000,
    others: 40000,
  },
  equity: {
    total: 2760000,
    capital: 2000000,
    retainedEarnings: 760000,
  },
};

export const MOCK_EXPENSE_CATEGORIES: ExpenseCategoryItem[] = [
  { category: 'Inventory & Goods Purchase', categoryBn: 'পণ্য ক্রয় ও কাঁচামাল', amount: 790395, percentage: 58, changePct: 4.2 },
  { category: 'Staff Salaries & Remuneration', categoryBn: 'কর্মচারী বেতন ও ভাতা', amount: 299805, percentage: 22, changePct: 0.0 },
  { category: 'Shop & Warehouse Rent', categoryBn: 'দোকান ও গোডাউন ভাড়া', amount: 109020, percentage: 8, changePct: 0.0 },
  { category: 'Utilities & Electricity', categoryBn: 'বিদ্যুৎ ও ইন্টারনেট বিল', amount: 68137, percentage: 5, changePct: 8.5 },
  { category: 'Transport & Delivery Logistics', categoryBn: 'পরিবহন ও ডেলিভারি', amount: 54510, percentage: 4, changePct: 12.1 },
  { category: 'Marketing & Promotions', categoryBn: 'বিজ্ঞাপন ও প্রমোশন', amount: 40883, percentage: 3, changePct: -6.4 },
];

export const MOCK_FINANCIAL_ALERTS: FinancialAlertItem[] = [
  {
    id: 'alert-1',
    title: '3 Customer Accounts Overdue (>60 Days)',
    titleBn: '৩টি গ্রাহক অ্যাকাউন্টের বকেয়া ৬০ দিনের বেশি অতিক্রান্ত',
    severity: 'warning',
    impact: '৳62,000 tied up in overdue receivables',
    impactBn: '৳৬২,০০০ বকেয়া আটকা পড়েছে',
    actionText: 'Send Payment Reminder',
    actionTextBn: 'তাগাদা পাঠান',
    actionHref: '/finance/receivables',
  },
  {
    id: 'alert-2',
    title: 'Supplier Invoices Maturing in 3 Days',
    titleBn: 'আগামী ৩ দিনের মধ্যে ২টি সাপ্লায়ার ইনভয়েস প্রদেয়',
    severity: 'info',
    impact: '৳45,000 required from current bank balance',
    impactBn: '৳৪৫,০০০ ব্যাংক থেকে পরিশোধযোগ্য',
    actionText: 'Schedule Payment',
    actionTextBn: 'পেমেন্ট শিডিউল',
    actionHref: '/finance/payables',
  },
  {
    id: 'alert-3',
    title: 'Quarterly VAT & Tax Assessment Period',
    titleBn: 'ত্রৈমাসিক মূসক ও ভ্যাট রিটার্ন প্রস্তুতকরণ সময়সীমা',
    severity: 'info',
    impact: 'Estimated statutory liability: ৳18,500',
    impactBn: 'আনুমানিক ট্যাক্স দায়: ৳১৮,৫০০',
    actionText: 'Review Tax Ledger',
    actionTextBn: 'ট্যাক্স লেজার দেখুন',
    actionHref: '/reports/finance/general-ledger',
  },
];

export const MOCK_RECENT_TRANSACTIONS: RecentTransactionItem[] = [
  {
    id: 'tx-1',
    date: '20 Aug 2026',
    reference: 'SAL-2026-0891',
    account: 'Cash in Hand (Counter 1)',
    type: 'Income',
    amount: 34500,
    status: 'Completed',
  },
  {
    id: 'tx-2',
    date: '20 Aug 2026',
    reference: 'EXP-2026-0312',
    account: 'BRAC Bank Current A/C',
    type: 'Expense',
    amount: 14200,
    status: 'Completed',
  },
  {
    id: 'tx-3',
    date: '19 Aug 2026',
    reference: 'REC-2026-0145',
    account: 'bKash Merchant Wallet',
    type: 'Customer Receipt',
    amount: 28000,
    status: 'Completed',
  },
  {
    id: 'tx-4',
    date: '19 Aug 2026',
    reference: 'PAY-2026-0098',
    account: 'City Bank Corporate A/C',
    type: 'Supplier Payment',
    amount: 55000,
    status: 'Completed',
  },
  {
    id: 'tx-5',
    date: '18 Aug 2026',
    reference: 'TRF-2026-0044',
    account: 'Cash → BRAC Bank Deposit',
    type: 'Transfer',
    amount: 50000,
    status: 'Completed',
  },
  {
    id: 'tx-6',
    date: '18 Aug 2026',
    reference: 'EXP-2026-0309',
    account: 'Petty Cash Wallet',
    type: 'Expense',
    amount: 3200,
    status: 'Completed',
  },
];
