// Hello Khata OS - Minimal Sales Report Types
// হ্যালো খাতা - মিনিমাল বিক্রয় রিপোর্ট টাইপস

export type ReportPeriod = 'today' | 'yesterday' | 'last_7_days' | 'this_month' | 'last_month' | 'this_quarter' | 'custom';
export type TrendInterval = 'daily' | 'weekly' | 'monthly';
export type TrendMetric = 'sales' | 'orders' | 'profit';
export type DriverDimension = 'products' | 'categories' | 'customers' | 'salespeople' | 'branches' | 'payments';

export interface SalesFocusItem {
  type: 'product' | 'category' | 'customer' | 'salesperson' | 'branch' | 'payment';
  id: string;
  name: string;
  nameBn?: string;
  amount: number;
  sharePercentage: number;
  ordersCount?: number;
}

export interface AdvancedFilterState {
  categoryId?: string;
  productId?: string;
  customerId?: string;
  salesperson?: string;
  paymentMethod?: string;
  status?: 'all' | 'paid' | 'partial' | 'due';
  minAmount?: number;
  maxAmount?: number;
}

export interface MinimalSalesSummary {
  netSales: number;
  grossSales: number;
  discounts: number;
  returns: number;
  growthPercentage: number; // vs previous period
  isGrowthPositive: boolean;
  ordersCount: number;
  ordersGrowthPercentage?: number;
  averageOrderValue: number;
  aovGrowthPercentage?: number;
  grossProfit?: number;
  grossMarginPercentage?: number;
}

export interface TimeSeriesTrendPoint {
  label: string;
  labelBn?: string;
  date: string;
  sales: number;
  orders: number;
  profit: number;
  prevSales?: number;
  growthVsPrev?: number;
}

export interface DriverItem {
  id: string;
  rank: number;
  name: string;
  nameBn?: string;
  subtitle?: string;
  subtitleBn?: string;
  amount: number;
  sharePercentage: number;
  growthPercentage: number;
  ordersCount: number;
  category?: string;
  branch?: string;
}

export interface SalesTransactionRecord {
  id: string;
  invoiceNo: string;
  date: string;
  rawDate: string;
  customerName: string;
  customerPhone?: string;
  itemsCount: number;
  amount: number;
  paymentStatus: 'paid' | 'partial' | 'due';
  paymentMethod: string;
  salesperson: string;
  branch: string;
  items: Array<{
    id: string;
    name: string;
    nameBn?: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    total: number;
  }>;
}

export interface MinimalSalesReportData {
  summary: MinimalSalesSummary;
  trend: TimeSeriesTrendPoint[];
  drivers: {
    products: DriverItem[];
    categories: DriverItem[];
    customers: DriverItem[];
    salespeople: DriverItem[];
    branches: DriverItem[];
    payments: DriverItem[];
  };
  records: SalesTransactionRecord[];
  totalRecordsCount: number;
}
