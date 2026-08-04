export interface WarehouseConfig {
  allowSales: boolean;
  allowPurchase: boolean;
  allowTransfers: boolean;
  isDefault: boolean;
  trackCapacity: boolean;
  trackTemperature: boolean;
  allowNegativeStock: boolean;
  barcodeEnabled: boolean;
  batchTracking: boolean;
  expiryTracking: boolean;
  serialTracking: boolean;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  type:
    | "Central Warehouse"
    | "Distribution Center"
    | "Retail Warehouse"
    | "Cold Storage"
    | "Transit Warehouse"
    | "Damaged Goods Warehouse"
    | "Returns Warehouse"
    | "Fulfillment Center";
  branchId: string;
  branchName: string;
  managerName: string;
  managerPhone: string;
  managerEmail: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  description?: string;
  notes?: string;
  status: "active" | "inactive" | "maintenance";
  isDefault?: boolean;
  capacityMax: number;
  capacityUsed: number;
  storageUnit: "m³" | "sq ft" | "pallets" | "units";
  productsCount: number;
  stockValue: number;
  totalStockUnits: number;
  availableUnits: number;
  reservedUnits: number;
  config: WarehouseConfig;
  createdAt: string;
  updatedAt: string;
}

export interface WarehouseProduct {
  id: string;
  warehouseId: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  stockQty: number;
  reservedQty: number;
  availableQty: number;
  unitPrice: number;
  stockValue: number;
  batchNumber: string;
  expiryDate?: string;
  status: "in_stock" | "low_stock" | "out_of_stock";
  imageUrl?: string;
}

export interface WarehouseTransferItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  imageUrl?: string;
  batchNumber: string;
  batchExpiry?: string;
  quantitySent: number;
  expectedQuantity: number;
  actualReceived?: number;
  unit: string;
}

export interface WarehouseTransfer {
  id: string;
  transferNo: string;
  transferType: "Inter-Branch" | "Internal Depot";
  sourceWarehouseId: string;
  sourceBranch: string;
  destinationWarehouseId: string;
  destinationBranch: string;
  date: string;
  createdBy: string;
  status:
    | "pending"
    | "approved"
    | "packed"
    | "in_transit"
    | "delivered"
    | "cancelled"
    | "completed";
  notes?: string;
  totalItems: number;
  totalQuantity: number;
  items: WarehouseTransferItem[];
}

export interface WarehouseAlert {
  id: string;
  type: "low_capacity" | "over_capacity" | "expired" | "damaged" | "pending_transfer" | "inactive" | "warning";
  severity: "critical" | "warning" | "info";
  warehouseId?: string;
  warehouseName?: string;
  titleEn: string;
  titleBn: string;
  messageEn: string;
  messageBn: string;
  timestamp: string;
  actionTextEn?: string;
  actionTextBn?: string;
}

export interface WarehouseActivity {
  id: string;
  type: "created" | "transfer_completed" | "inventory_adjusted" | "stock_received" | "edited" | "manager_changed";
  warehouseName: string;
  user: string;
  descriptionEn: string;
  descriptionBn: string;
  timestamp: string;
  timeframe: "today" | "this_week" | "earlier";
}

export const MOCK_BRANCHES = [
  { id: "b1", name: "Dhaka Central HQ", code: "HQ-01" },
  { id: "b2", name: "Dhanmondi Branch", code: "DHN-01" },
  { id: "b3", name: "Gulshan Outlet", code: "GLS-02" },
  { id: "b4", name: "Uttara Branch", code: "UTR-03" },
  { id: "b5", name: "Chittagong Hub", code: "CTG-04" },
];

export const MOCK_PRODUCTS = [
  {
    id: "p1",
    name: "Napa Extra 500mg (Paracetamol)",
    sku: "MED-NAP-500",
    unit: "Boxes",
    batches: [
      { batchNumber: "B2026-081", expiryDate: "2027-05-15", availableStock: 450 },
      { batchNumber: "B2026-092", expiryDate: "2026-11-20", availableStock: 120 },
    ],
  },
  {
    id: "p2",
    name: "Sergel 20mg (Esomeprazole)",
    sku: "MED-SER-020",
    unit: "Strips",
    batches: [
      { batchNumber: "SRG-8812", expiryDate: "2027-08-30", availableStock: 800 },
      { batchNumber: "SRG-8815", expiryDate: "2026-12-10", availableStock: 200 },
    ],
  },
  {
    id: "p3",
    name: "Amodis 400mg (Metronidazole)",
    sku: "MED-AMO-400",
    unit: "Boxes",
    batches: [
      { batchNumber: "AMD-4011", expiryDate: "2027-03-12", availableStock: 300 },
    ],
  },
  {
    id: "p4",
    name: "Seclo 20mg Capsule",
    sku: "MED-SEC-020",
    unit: "Boxes",
    batches: [
      { batchNumber: "SEC-9002", expiryDate: "2027-10-01", availableStock: 600 },
    ],
  },
];

// Products stored in specific warehouses
export const MOCK_WAREHOUSE_PRODUCTS: WarehouseProduct[] = [
  // Central Warehouse Products (wh-1)
  {
    id: "wp-101",
    warehouseId: "wh-1",
    name: "Napa Extra 500mg Tablet",
    sku: "MED-NAP-500",
    category: "Pharmaceuticals",
    unit: "Boxes",
    stockQty: 450,
    reservedQty: 50,
    availableQty: 400,
    unitPrice: 320,
    stockValue: 144000,
    batchNumber: "B2026-081",
    expiryDate: "2027-05-15",
    status: "in_stock",
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "wp-102",
    warehouseId: "wh-1",
    name: "Sergel 20mg Capsule",
    sku: "MED-SER-020",
    category: "Pharmaceuticals",
    unit: "Strips",
    stockQty: 1200,
    reservedQty: 150,
    availableQty: 1050,
    unitPrice: 70,
    stockValue: 84000,
    batchNumber: "SRG-8812",
    expiryDate: "2027-08-30",
    status: "in_stock",
    imageUrl: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "wp-103",
    warehouseId: "wh-1",
    name: "Ceevit 250mg Vitamin C",
    sku: "MED-CEE-250",
    category: "Vitamins & Supplements",
    unit: "Bottles",
    stockQty: 25,
    reservedQty: 5,
    availableQty: 20,
    unitPrice: 180,
    stockValue: 4500,
    batchNumber: "CV-901",
    expiryDate: "2026-11-10",
    status: "low_stock",
    imageUrl: "https://images.unsplash.com/photo-1577401239170-897942555fb3?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "wp-104",
    warehouseId: "wh-1",
    name: "Amodis 400mg Tablet",
    sku: "MED-AMO-400",
    category: "Pharmaceuticals",
    unit: "Boxes",
    stockQty: 600,
    reservedQty: 80,
    availableQty: 520,
    unitPrice: 240,
    stockValue: 144000,
    batchNumber: "AMD-4011",
    expiryDate: "2027-03-12",
    status: "in_stock",
    imageUrl: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "wp-105",
    warehouseId: "wh-1",
    name: "Monas 10mg Montelukast",
    sku: "MED-MON-010",
    category: "Respiratory",
    unit: "Boxes",
    stockQty: 380,
    reservedQty: 30,
    availableQty: 350,
    unitPrice: 520,
    stockValue: 197600,
    batchNumber: "MNS-7701",
    expiryDate: "2027-09-01",
    status: "in_stock",
    imageUrl: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=300&auto=format&fit=crop&q=80",
  },

  // Dhanmondi Regional Depot Products (wh-2)
  {
    id: "wp-201",
    warehouseId: "wh-2",
    name: "Napa Extra 500mg Tablet",
    sku: "MED-NAP-500",
    category: "Pharmaceuticals",
    unit: "Boxes",
    stockQty: 180,
    reservedQty: 20,
    availableQty: 160,
    unitPrice: 320,
    stockValue: 57600,
    batchNumber: "B2026-092",
    expiryDate: "2026-11-20",
    status: "in_stock",
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "wp-202",
    warehouseId: "wh-2",
    name: "Seclo 20mg Capsule",
    sku: "MED-SEC-020",
    category: "Pharmaceuticals",
    unit: "Boxes",
    stockQty: 420,
    reservedQty: 40,
    availableQty: 380,
    unitPrice: 410,
    stockValue: 172200,
    batchNumber: "SEC-9002",
    expiryDate: "2027-10-01",
    status: "in_stock",
    imageUrl: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "wp-203",
    warehouseId: "wh-2",
    name: "Bizoran 5/20mg Tablet",
    sku: "MED-BIZ-520",
    category: "Cardiology",
    unit: "Boxes",
    stockQty: 12,
    reservedQty: 2,
    availableQty: 10,
    unitPrice: 650,
    stockValue: 7800,
    batchNumber: "BZR-102",
    expiryDate: "2026-12-15",
    status: "low_stock",
    imageUrl: "https://images.unsplash.com/photo-1626714494904-e3a5332fbc13?w=300&auto=format&fit=crop&q=80",
  },

  // Gulshan Cold Storage Products (wh-3)
  {
    id: "wp-301",
    warehouseId: "wh-3",
    name: "Insulin Humulin N 100IU/ml",
    sku: "MED-INS-HUM",
    category: "Cold Chain / Pharma",
    unit: "Vials",
    stockQty: 850,
    reservedQty: 100,
    availableQty: 750,
    unitPrice: 950,
    stockValue: 807500,
    batchNumber: "INS-2026-X",
    expiryDate: "2026-10-20",
    status: "in_stock",
    imageUrl: "https://images.unsplash.com/photo-1579165466741-7f35e4755660?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "wp-302",
    warehouseId: "wh-3",
    name: "Tetanus Toxoid Vaccine",
    sku: "VAC-TET-001",
    category: "Cold Chain / Vaccines",
    unit: "Ampoules",
    stockQty: 320,
    reservedQty: 30,
    availableQty: 290,
    unitPrice: 140,
    stockValue: 44800,
    batchNumber: "VAC-8809",
    expiryDate: "2027-01-30",
    status: "in_stock",
    imageUrl: "https://images.unsplash.com/photo-1618961734760-466979ce35b0?w=300&auto=format&fit=crop&q=80",
  },
];

export const MOCK_WAREHOUSES: Warehouse[] = [
  {
    id: "wh-1",
    name: "Central Distribution Warehouse",
    code: "WH-MAIN-01",
    type: "Central Warehouse",
    branchId: "b1",
    branchName: "Dhaka Central HQ",
    managerName: "Mahmud Hasan",
    managerPhone: "+880 1711-234567",
    managerEmail: "mahmud.hasan@hellokhata.com",
    address: "Plot 42, Tejgaon Industrial Area",
    city: "Dhaka",
    postalCode: "1208",
    country: "Bangladesh",
    description: "Primary central fulfillment hub for national distribution.",
    notes: "24/7 security & climate control.",
    status: "active",
    isDefault: true,
    capacityMax: 50000,
    capacityUsed: 41000,
    storageUnit: "pallets",
    productsCount: 1420,
    stockValue: 24500000,
    totalStockUnits: 85400,
    availableUnits: 72100,
    reservedUnits: 13300,
    config: {
      allowSales: true,
      allowPurchase: true,
      allowTransfers: true,
      isDefault: true,
      trackCapacity: true,
      trackTemperature: true,
      allowNegativeStock: false,
      barcodeEnabled: true,
      batchTracking: true,
      expiryTracking: true,
      serialTracking: true,
    },
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2026-07-29T14:20:00Z",
  },
  {
    id: "wh-2",
    name: "Dhanmondi Regional Depot",
    code: "WH-DHN-02",
    type: "Distribution Center",
    branchId: "b2",
    branchName: "Dhanmondi Branch",
    managerName: "Rafiqul Islam",
    managerPhone: "+880 1812-987654",
    managerEmail: "rafiqul.islam@hellokhata.com",
    address: "Road 27, Dhanmondi R/A",
    city: "Dhaka",
    postalCode: "1209",
    country: "Bangladesh",
    description: "Regional hub servicing South Dhaka outlets.",
    status: "active",
    isDefault: false,
    capacityMax: 20000,
    capacityUsed: 13000,
    storageUnit: "m³",
    productsCount: 840,
    stockValue: 11200000,
    totalStockUnits: 34200,
    availableUnits: 30100,
    reservedUnits: 4100,
    config: {
      allowSales: true,
      allowPurchase: true,
      allowTransfers: true,
      isDefault: false,
      trackCapacity: true,
      trackTemperature: false,
      allowNegativeStock: false,
      barcodeEnabled: true,
      batchTracking: true,
      expiryTracking: true,
      serialTracking: false,
    },
    createdAt: "2024-06-10T11:30:00Z",
    updatedAt: "2026-07-30T10:15:00Z",
  },
  {
    id: "wh-3",
    name: "Gulshan Cold Storage Hub",
    code: "WH-GLS-COLD",
    type: "Cold Storage",
    branchId: "b3",
    branchName: "Gulshan Outlet",
    managerName: "Tariqul Alam",
    managerPhone: "+880 1913-456789",
    managerEmail: "tariqul.alam@hellokhata.com",
    address: "House 14, Avenue 3, Gulshan-2",
    city: "Dhaka",
    postalCode: "1212",
    country: "Bangladesh",
    description: "Dedicated sub-zero cold chain storage.",
    status: "active",
    isDefault: false,
    capacityMax: 15000,
    capacityUsed: 6150,
    storageUnit: "pallets",
    productsCount: 320,
    stockValue: 8400000,
    totalStockUnits: 18500,
    availableUnits: 16200,
    reservedUnits: 2300,
    config: {
      allowSales: true,
      allowPurchase: true,
      allowTransfers: true,
      isDefault: false,
      trackCapacity: true,
      trackTemperature: true,
      allowNegativeStock: false,
      barcodeEnabled: true,
      batchTracking: true,
      expiryTracking: true,
      serialTracking: true,
    },
    createdAt: "2024-11-01T08:00:00Z",
    updatedAt: "2026-07-28T16:00:00Z",
  },
  {
    id: "wh-4",
    name: "Chittagong Logistics Depot",
    code: "WH-CTG-03",
    type: "Distribution Center",
    branchId: "b5",
    branchName: "Chittagong Hub",
    managerName: "Nasir Uddin",
    managerPhone: "+880 1614-789012",
    managerEmail: "nasir.uddin@hellokhata.com",
    address: "Agrabad Commercial Area",
    city: "Chittagong",
    postalCode: "4100",
    country: "Bangladesh",
    description: "Port side transit and distribution warehouse.",
    status: "active",
    isDefault: true,
    capacityMax: 35000,
    capacityUsed: 22750,
    storageUnit: "pallets",
    productsCount: 960,
    stockValue: 15800000,
    totalStockUnits: 46100,
    availableUnits: 40500,
    reservedUnits: 5600,
    config: {
      allowSales: true,
      allowPurchase: true,
      allowTransfers: true,
      isDefault: true,
      trackCapacity: true,
      trackTemperature: false,
      allowNegativeStock: false,
      barcodeEnabled: true,
      batchTracking: true,
      expiryTracking: true,
      serialTracking: false,
    },
    createdAt: "2025-02-18T10:00:00Z",
    updatedAt: "2026-07-29T11:40:00Z",
  },
  {
    id: "wh-5",
    name: "Uttara Fast Fulfillment Center",
    code: "WH-UTR-FFC",
    type: "Fulfillment Center",
    branchId: "b4",
    branchName: "Uttara Branch",
    managerName: "Farhana Akter",
    managerPhone: "+880 1715-345678",
    managerEmail: "farhana.akter@hellokhata.com",
    address: "Sector 11, Uttara Model Town",
    city: "Dhaka",
    postalCode: "1230",
    country: "Bangladesh",
    description: "Express e-commerce pick-pack-ship fulfillment depot.",
    status: "active",
    isDefault: false,
    capacityMax: 18000,
    capacityUsed: 14760,
    storageUnit: "units",
    productsCount: 610,
    stockValue: 6900000,
    totalStockUnits: 22100,
    availableUnits: 19800,
    reservedUnits: 2300,
    config: {
      allowSales: true,
      allowPurchase: true,
      allowTransfers: true,
      isDefault: false,
      trackCapacity: true,
      trackTemperature: false,
      allowNegativeStock: false,
      barcodeEnabled: true,
      batchTracking: true,
      expiryTracking: false,
      serialTracking: true,
    },
    createdAt: "2025-05-12T09:30:00Z",
    updatedAt: "2026-07-30T08:10:00Z",
  },
];

export const MOCK_TRANSFERS: WarehouseTransfer[] = [
  {
    id: "trf-101",
    transferNo: "TRF-2026-001",
    transferType: "Inter-Branch",
    sourceWarehouseId: "wh-1",
    sourceBranch: "Central Distribution Warehouse",
    destinationWarehouseId: "wh-3",
    destinationBranch: "Gulshan Cold Storage Hub",
    date: "2026-07-28T10:30:00Z",
    createdBy: "Mahmud Hasan",
    status: "in_transit",
    notes: "Urgent weekend stock replenishment for Gulshan cold storage.",
    totalItems: 3,
    totalQuantity: 100,
    items: [
      {
        id: "ti-1",
        productId: "wp-101",
        productName: "Napa Extra 500mg Tablet",
        sku: "MED-NAP-500",
        batchNumber: "B2026-081",
        batchExpiry: "2027-05-15",
        quantitySent: 50,
        expectedQuantity: 50,
        unit: "Boxes",
      },
      {
        id: "ti-2",
        productId: "wp-102",
        productName: "Sergel 20mg Capsule",
        sku: "MED-SER-020",
        batchNumber: "SRG-8812",
        batchExpiry: "2027-08-30",
        quantitySent: 50,
        expectedQuantity: 50,
        unit: "Strips",
      },
    ],
  },
  {
    id: "trf-102",
    transferNo: "TRF-2026-002",
    transferType: "Inter-Branch",
    sourceWarehouseId: "wh-1",
    sourceBranch: "Central Distribution Warehouse",
    destinationWarehouseId: "wh-2",
    destinationBranch: "Dhanmondi Regional Depot",
    date: "2026-07-27T14:15:00Z",
    createdBy: "Rafiqul Islam",
    status: "completed",
    notes: "Regular weekly stock transfer.",
    totalItems: 2,
    totalQuantity: 80,
    items: [
      {
        id: "ti-3",
        productId: "wp-104",
        productName: "Amodis 400mg Tablet",
        sku: "MED-AMO-400",
        batchNumber: "AMD-4011",
        batchExpiry: "2027-03-12",
        quantitySent: 80,
        expectedQuantity: 80,
        unit: "Boxes",
      },
    ],
  },
  {
    id: "trf-103",
    transferNo: "TRF-2026-003",
    transferType: "Internal Depot",
    sourceWarehouseId: "wh-1",
    sourceBranch: "Central Distribution Warehouse",
    destinationWarehouseId: "wh-5",
    destinationBranch: "Uttara Fast Fulfillment Center",
    date: "2026-07-26T09:00:00Z",
    createdBy: "Farhana Akter",
    status: "pending",
    notes: "Scheduled transfer awaiting dispatch approval.",
    totalItems: 4,
    totalQuantity: 160,
    items: [],
  },
  {
    id: "trf-104",
    transferNo: "TRF-2026-004",
    transferType: "Inter-Branch",
    sourceWarehouseId: "wh-4",
    sourceBranch: "Chittagong Logistics Depot",
    destinationWarehouseId: "wh-1",
    destinationBranch: "Central Distribution Warehouse",
    date: "2026-07-25T16:45:00Z",
    createdBy: "Nasir Uddin",
    status: "cancelled",
    notes: "Cancelled due to highway weather condition.",
    totalItems: 1,
    totalQuantity: 30,
    items: [],
  },
  {
    id: "trf-105",
    transferNo: "TRF-2026-005",
    transferType: "Internal Depot",
    sourceWarehouseId: "wh-2",
    sourceBranch: "Dhanmondi Regional Depot",
    destinationWarehouseId: "wh-1",
    destinationBranch: "Central Distribution Warehouse",
    date: "2026-07-24T11:20:00Z",
    createdBy: "Kazi Sayeed",
    status: "delivered",
    notes: "Damaged box return transfer.",
    totalItems: 2,
    totalQuantity: 15,
    items: [],
  },
];

export const MOCK_ALERTS: WarehouseAlert[] = [
  {
    id: "alt-1",
    type: "over_capacity",
    severity: "critical",
    warehouseId: "wh-1",
    warehouseName: "Central Distribution Warehouse",
    titleEn: "High Storage Capacity Alert (82%)",
    titleBn: "উচ্চ ধারণক্ষমতা সতর্কতা (৮২%)",
    messageEn: "Central Warehouse exceeded 80% threshold.",
    messageBn: "কেন্দ্রীয় ওয়্যারহাউস ৮০% স্টোরেজ সীমার বাইরে।",
    timestamp: "10m ago",
    actionTextEn: "Manage Space",
    actionTextBn: "স্পেস বন্টন",
  },
  {
    id: "alt-2",
    type: "expired",
    severity: "warning",
    warehouseId: "wh-3",
    warehouseName: "Gulshan Cold Storage Hub",
    titleEn: "8 Batches Expiring Within 30 Days",
    titleBn: "৮টি ব্যাচের মেয়াদ শীঘ্রই শেষ হবে",
    messageEn: "Pharma stock expiring soon in cold storage.",
    messageBn: "কোল্ড স্টোরেজের কিছু ওষুধের মেয়াদ শেষ পর্যায়ে।",
    timestamp: "1h ago",
    actionTextEn: "View Batches",
    actionTextBn: "ব্যাচ দেখুন",
  },
  {
    id: "alt-3",
    type: "pending_transfer",
    severity: "info",
    warehouseId: "wh-5",
    warehouseName: "Uttara Fast Fulfillment Center",
    titleEn: "5 Stock Transfers Pending Approval",
    titleBn: "৫টি ট্রান্সফার অনুমোদনের অপেক্ষায়",
    messageEn: "Inbound transfers require manager approval.",
    messageBn: "ইনবাউন্ড স্টক ট্রান্সফারের অনুমোদন প্রয়োজন।",
    timestamp: "3h ago",
    actionTextEn: "Review Transfers",
    actionTextBn: "রিভিউ করুন",
  },
  {
    id: "alt-4",
    type: "inactive",
    severity: "warning",
    warehouseId: "wh-8",
    warehouseName: "Rajshahi Retail Stockroom",
    titleEn: "Depot Under Equipment Maintenance",
    titleBn: "ওয়্যারহাউস মেরামতের জন্য বন্ধ",
    messageEn: "Depot offline during sensor calibration.",
    messageBn: "সেন্সর ক্যালিব্রেশনের সময় ডিপো সাময়িক বন্ধ।",
    timestamp: "1d ago",
    actionTextEn: "Check Status",
    actionTextBn: "অবস্থা দেখুন",
  },
];

export const MOCK_ACTIVITIES: WarehouseActivity[] = [
  {
    id: "act-1",
    type: "transfer_completed",
    warehouseName: "Central Distribution Warehouse",
    user: "Mahmud Hasan",
    descriptionEn: "Completed Transfer TRF-2026-002 (80 Boxes)",
    descriptionBn: "ট্রান্সফার TRF-2026-002 সম্পন্ন হয়েছে",
    timestamp: "25m ago",
    timeframe: "today",
  },
  {
    id: "act-2",
    type: "stock_received",
    warehouseName: "Uttara Fast Fulfillment Center",
    user: "Farhana Akter",
    descriptionEn: "Received Goods PO-9801 (450 Units)",
    descriptionBn: "পারচেজ PO-9801 স্টক গ্রহণ করা হয়েছে",
    timestamp: "2h ago",
    timeframe: "today",
  },
  {
    id: "act-3",
    type: "inventory_adjusted",
    warehouseName: "Gulshan Cold Storage Hub",
    user: "Tariqul Alam",
    descriptionEn: "Adjusted stock (-15 Strips damaged)",
    descriptionBn: "স্টক অ্যাডজাস্টমেন্ট সম্পন্ন হয়েছে",
    timestamp: "4h ago",
    timeframe: "today",
  },
  {
    id: "act-4",
    type: "created",
    warehouseName: "Rajshahi Retail Stockroom",
    user: "Anisur Rahman",
    descriptionEn: "Created warehouse entry WH-RJH-04",
    descriptionBn: "নতুন ওয়্যারহাউস এন্ট্রি তৈরি করা হয়েছে",
    timestamp: "2 days ago",
    timeframe: "this_week",
  },
  {
    id: "act-5",
    type: "manager_changed",
    warehouseName: "Chittagong Logistics Depot",
    user: "System Admin",
    descriptionEn: "Assigned Nasir Uddin as Manager",
    descriptionBn: "নাসির উদ্দিনকে ম্যানেজার হিসেবে নিযুক্ত করা হয়েছে",
    timestamp: "4 days ago",
    timeframe: "this_week",
  },
];
