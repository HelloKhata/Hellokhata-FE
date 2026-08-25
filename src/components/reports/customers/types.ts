// Hello Khata OS - Customer Reports Domain Types
// হ্যালো খাতা - গ্রাহক রিপোর্টস ডোমেইন টাইপস

export interface CustomerExecutiveKpis {
  totalCustomers: number;
  totalCustomersChange: number;
  newCustomers: number;
  newCustomersChange: number;
  activeCustomers: number;
  activeRate: number;
  customerSales: number;
  customerSalesChange: number;
  outstandingReceivables: number;
  receivablesRatio: number;
  averageCustomerValue: number;
  acvChange: number;
}

export interface CustomerSalesTrendPoint {
  period: string;
  currentSales: number;
  previousSales: number;
  orders: number;
}

export interface CustomerSegmentItem {
  id: string;
  name: string;
  nameBn: string;
  count: number;
  percentage: number;
  totalSales: number;
  color: string;
  badgeClass: string;
}

export interface TopCustomerItem {
  id: string;
  name: string;
  phone: string;
  avatarColor: string;
  purchasesCount: number;
  totalSales: number;
  totalPaid: number;
  currentDue: number;
  lastPurchaseDate: string;
  tier: 'VIP' | 'Regular' | 'New' | 'Risk';
}

export interface CustomerAgingBucket {
  range: string;
  amount: number;
  percentage: number;
  customerCount: number;
}

export interface CustomerDetailedRecord {
  id: string;
  customerId: string;
  name: string;
  nameBn?: string;
  phone: string;
  branch: string;
  group: string;
  sales: number;
  purchases: number;
  paid: number;
  due: number;
  returns: number;
  lastPurchase: string;
  status: 'Active' | 'Regular' | 'Dormant' | 'Overdue';
}
