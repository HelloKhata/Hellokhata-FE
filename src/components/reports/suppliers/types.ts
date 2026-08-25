// Hello Khata OS - Supplier Reports Domain Types
// হ্যালো খাতা - সরবরাহকারী রিপোর্টস ডোমেইন টাইপস

export interface SupplierExecutiveKpis {
  totalPurchases: number;
  purchasesChange: number;
  accountsPayable: number;
  payableRatio: number;
  totalSuppliers: number;
  newSuppliers: number;
  totalInvoices: number;
  averageBillValue: number;
}

export interface SupplierPurchaseTrendPoint {
  period: string;
  currentPurchases: number;
  previousPurchases: number;
  invoices: number;
}

export interface TopSupplierItem {
  id: string;
  name: string;
  phone: string;
  category: string;
  avatarColor: string;
  invoicesCount: number;
  totalPurchases: number;
  totalPaid: number;
  currentDue: number;
  lastSupplyDate: string;
  tier: 'Strategic' | 'Regular' | 'Occasional' | 'Risk';
}

export interface SupplierAgingBucket {
  range: string;
  amount: number;
  percentage: number;
  supplierCount: number;
}

export interface SupplierDetailedRecord {
  id: string;
  supplierId: string;
  name: string;
  nameBn?: string;
  phone: string;
  category: string;
  branch: string;
  invoices: number;
  purchases: number;
  paid: number;
  due: number;
  returns: number;
  lastSupply: string;
  status: 'Active' | 'Paid Clear' | 'Overdue Due' | 'Inactive';
}
