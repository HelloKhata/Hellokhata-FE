export interface Product {
  id: string;
  name: string;
  category: string;
  brand?: string;
  unit: string;
  sku: string;
  barcode?: string;
  imageUrl: string;
  costPrice: number;
  sellingPrice: number;
  totalStock: number;
  availableStock?: number;
  reservedStock?: number;
  damagedStock?: number;
  inTransitStock?: number;
  totalBranches: number;
  totalBatches?: number;
  lastUpdated: string;
  status?: 'Active' | 'Low Stock' | 'Out of Stock' | 'Discontinued';
  taxRate?: number;
  description?: string;
  preferredSupplier?: string;
  supplierContact?: string;
  supplierEmail?: string;
  minStockAlert?: number;
}

export interface Batch {
  id: string;
  branch: string;
  supplierName?: string;
  purchaseNo?: string;
  quantity: number;
  availableQuantity: number;
  reservedQuantity: number;
  costPrice: number;
  expiryDate: string;
  receivedDate: string;
  status: "active" | "expiring" | "expired";
}

export interface BranchStock {
  id: string;
  branchName: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  averageCost: number;
  lastUpdated: string;
}

export interface PurchaseRecord {
  id: string;
  purchaseNo: string;
  supplierName: string;
  purchaseDate: string;
  batchId: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  createdBy: string;
}

export interface StockMovement {
  id: string;
  type: "in" | "out";
  eventType: 'Purchase' | 'Sale' | 'Sales Return' | 'Purchase Return' | 'Stock Transfer' | 'Stock Adjustment' | 'Damage' | 'Opening Stock';
  quantity: number;
  branch: string;
  user?: string;
  timestamp: string;
  reason: string;
  batchId?: string;
}

export interface BarcodeRecord {
  id: string;
  barcode: string;
  branch: string;
  batchId: string;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  avatarUrl?: string;
  lastSuppliedDate: string;
  email: string;
}

export const mockProduct: Product = {
  id: "prod-1029",
  name: "Premium Jasmine Rice (5kg)",
  category: "Grocery & Staples",
  brand: "Royal Harvest",
  unit: "Bag",
  sku: "JSM-RC-5KG-01",
  barcode: "8901030700812",
  imageUrl: "/images/image.png",
  costPrice: 850,
  sellingPrice: 1050,
  totalStock: 345,
  availableStock: 310,
  reservedStock: 25,
  damagedStock: 5,
  inTransitStock: 5,
  totalBranches: 4,
  totalBatches: 4,
  lastUpdated: "2026-07-16T14:30:00Z",
  status: "Active",
  taxRate: 5,
  description: "Premium long-grain fragrant jasmine rice sourced directly from organic farms. Vacuum sealed for long-lasting freshness.",
  preferredSupplier: "Agro Foods Trading Co.",
  supplierContact: "+880 1711-234567",
  supplierEmail: "orders@agrofoods.com.bd",
  minStockAlert: 30,
};

export const mockBatches: Batch[] = [
  {
    id: "BCH-2026-001",
    branch: "Dhaka Banani",
    supplierName: "Agro Foods Trading Co.",
    purchaseNo: "PO-2026-089",
    quantity: 120,
    availableQuantity: 110,
    reservedQuantity: 10,
    costPrice: 840,
    expiryDate: "2027-06-30",
    receivedDate: "2026-06-15",
    status: "active",
  },
  {
    id: "BCH-2026-002",
    branch: "Chittagong GEC",
    supplierName: "Agro Foods Trading Co.",
    purchaseNo: "PO-2026-092",
    quantity: 85,
    availableQuantity: 75,
    reservedQuantity: 10,
    costPrice: 850,
    expiryDate: "2026-08-10",
    receivedDate: "2026-06-18",
    status: "expiring",
  },
  {
    id: "BCH-2026-003",
    branch: "Sylhet Zindabazar",
    supplierName: "Bengal Rice Mills Ltd.",
    purchaseNo: "PO-2026-104",
    quantity: 90,
    availableQuantity: 85,
    reservedQuantity: 5,
    costPrice: 855,
    expiryDate: "2027-02-15",
    receivedDate: "2026-07-02",
    status: "active",
  },
  {
    id: "BCH-2026-004",
    branch: "Dhaka Uttara",
    supplierName: "Bengal Rice Mills Ltd.",
    purchaseNo: "PO-2026-042",
    quantity: 50,
    availableQuantity: 40,
    reservedQuantity: 0,
    costPrice: 835,
    expiryDate: "2026-05-01",
    receivedDate: "2026-03-10",
    status: "expired",
  },
];

export const mockBranchStocks: BranchStock[] = [
  {
    id: "br-1",
    branchName: "Dhaka Banani",
    currentStock: 120,
    reservedStock: 10,
    availableStock: 110,
    averageCost: 840,
    lastUpdated: "2026-07-16 14:30",
  },
  {
    id: "br-2",
    branchName: "Chittagong GEC",
    currentStock: 85,
    reservedStock: 10,
    availableStock: 75,
    averageCost: 850,
    lastUpdated: "2026-07-15 11:20",
  },
  {
    id: "br-3",
    branchName: "Sylhet Zindabazar",
    currentStock: 90,
    reservedStock: 5,
    availableStock: 85,
    averageCost: 855,
    lastUpdated: "2026-07-14 16:45",
  },
  {
    id: "br-4",
    branchName: "Dhaka Uttara",
    currentStock: 50,
    reservedStock: 0,
    availableStock: 40,
    averageCost: 835,
    lastUpdated: "2026-07-10 09:15",
  },
];

export const mockPurchases: PurchaseRecord[] = [
  {
    id: "pur-1",
    purchaseNo: "PO-2026-104",
    supplierName: "Bengal Rice Mills Ltd.",
    purchaseDate: "2026-07-02",
    batchId: "BCH-2026-003",
    quantity: 90,
    unitCost: 855,
    totalCost: 76950,
    createdBy: "Rahim Ahmed",
  },
  {
    id: "pur-2",
    purchaseNo: "PO-2026-092",
    supplierName: "Agro Foods Trading Co.",
    purchaseDate: "2026-06-18",
    batchId: "BCH-2026-002",
    quantity: 85,
    unitCost: 850,
    totalCost: 72250,
    createdBy: "Farhana Karim",
  },
  {
    id: "pur-3",
    purchaseNo: "PO-2026-089",
    supplierName: "Agro Foods Trading Co.",
    purchaseDate: "2026-06-15",
    batchId: "BCH-2026-001",
    quantity: 120,
    unitCost: 840,
    totalCost: 100800,
    createdBy: "Rahim Ahmed",
  },
  {
    id: "pur-4",
    purchaseNo: "PO-2026-042",
    supplierName: "Bengal Rice Mills Ltd.",
    purchaseDate: "2026-03-10",
    batchId: "BCH-2026-004",
    quantity: 50,
    unitCost: 835,
    totalCost: 41750,
    createdBy: "System Admin",
  },
];

export const mockMovements: StockMovement[] = [
  {
    id: "m-1",
    type: "in",
    eventType: "Purchase",
    quantity: 90,
    branch: "Sylhet Zindabazar",
    user: "Rahim Ahmed",
    timestamp: "2026-07-02 10:15 AM",
    reason: "Supplier Delivery PO-2026-104",
    batchId: "BCH-2026-003",
  },
  {
    id: "m-2",
    type: "out",
    eventType: "Sale",
    quantity: 12,
    branch: "Chittagong GEC",
    user: "Kashem Ali",
    timestamp: "2026-07-16 02:30 PM",
    reason: "Retail Cash Sale #INV-109",
    batchId: "BCH-2026-002",
  },
  {
    id: "m-3",
    type: "out",
    eventType: "Sale",
    quantity: 25,
    branch: "Sylhet Zindabazar",
    user: "Nusrat Jahan",
    timestamp: "2026-07-15 04:45 PM",
    reason: "Wholesale Credit Invoice #INV-102",
    batchId: "BCH-2026-003",
  },
  {
    id: "m-4",
    type: "in",
    eventType: "Stock Transfer",
    quantity: 45,
    branch: "Dhaka Uttara",
    user: "Farhana Karim",
    timestamp: "2026-07-14 11:10 AM",
    reason: "Transfer from Banani Warehouse",
    batchId: "BCH-2026-001",
  },
  {
    id: "m-5",
    type: "out",
    eventType: "Damage",
    quantity: 5,
    branch: "Dhaka Banani",
    user: "Manager Audit",
    timestamp: "2026-07-12 05:00 PM",
    reason: "Water leakage damage write-off",
    batchId: "BCH-2026-001",
  },
  {
    id: "m-6",
    type: "in",
    eventType: "Sales Return",
    quantity: 2,
    branch: "Dhaka Banani",
    user: "Kashem Ali",
    timestamp: "2026-07-10 01:20 PM",
    reason: "Customer returned unopened bag",
    batchId: "BCH-2026-001",
  },
];

export const mockBarcodes: BarcodeRecord[] = [
  {
    id: "bc-1",
    barcode: "8901030700812",
    branch: "Dhaka Banani",
    batchId: "BCH-2026-001",
    createdAt: "2026-06-15",
  },
  {
    id: "bc-2",
    barcode: "8901030700829",
    branch: "Chittagong GEC",
    batchId: "BCH-2026-002",
    createdAt: "2026-06-18",
  },
  {
    id: "bc-3",
    barcode: "8901030700836",
    branch: "Sylhet Zindabazar",
    batchId: "BCH-2026-003",
    createdAt: "2026-07-02",
  },
];

export const mockSuppliers: Supplier[] = [
  {
    id: "sup-1",
    name: "Agro Foods Trading Co.",
    phone: "+880 1711-234567",
    avatarUrl: "",
    lastSuppliedDate: "2026-07-02",
    email: "orders@agrofoods.com.bd",
  },
  {
    id: "sup-2",
    name: "Bengal Rice Mills Ltd.",
    phone: "+880 1912-987654",
    avatarUrl: "",
    lastSuppliedDate: "2026-06-15",
    email: "bengalrice@info.com",
  },
];
