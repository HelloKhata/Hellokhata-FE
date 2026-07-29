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
  sourceBranch: string;
  destinationBranch: string;
  date: string;
  status: "completed" | "in_transit" | "pending" | "cancelled";
  notes?: string;
  totalItems: number;
  items: WarehouseTransferItem[];
}

export const MOCK_BRANCHES = [
  { id: "b1", name: "Central Distribution Warehouse", code: "WH-MAIN", isWarehouse: true },
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

export const MOCK_TRANSFERS: WarehouseTransfer[] = [
  {
    id: "trf-101",
    transferNo: "TRF-2026-001",
    sourceBranch: "Central Distribution Warehouse",
    destinationBranch: "Gulshan Outlet",
    date: "2026-07-28T10:30:00Z",
    status: "in_transit",
    notes: "Urgent weekend stock replenishment for Gulshan retail outlet.",
    totalItems: 3,
    items: [
      {
        id: "ti-1",
        productId: "p1",
        productName: "Napa Extra 500mg (Paracetamol)",
        sku: "MED-NAP-500",
        batchNumber: "B2026-081",
        batchExpiry: "2027-05-15",
        quantitySent: 50,
        expectedQuantity: 50,
        actualReceived: 50,
        unit: "Boxes",
      },
      {
        id: "ti-2",
        productId: "p2",
        productName: "Sergel 20mg (Esomeprazole)",
        sku: "MED-SER-020",
        batchNumber: "SRG-8812",
        batchExpiry: "2027-08-30",
        quantitySent: 30,
        expectedQuantity: 30,
        actualReceived: 25, // less than expected for testing warning
        unit: "Strips",
      },
      {
        id: "ti-3",
        productId: "p3",
        productName: "Amodis 400mg (Metronidazole)",
        sku: "MED-AMO-400",
        batchNumber: "AMD-4011",
        batchExpiry: "2027-03-12",
        quantitySent: 20,
        expectedQuantity: 20,
        actualReceived: 20,
        unit: "Boxes",
      },
    ],
  },
  {
    id: "trf-102",
    transferNo: "TRF-2026-002",
    sourceBranch: "Central Distribution Warehouse",
    destinationBranch: "Dhanmondi Branch",
    date: "2026-07-27T14:15:00Z",
    status: "completed",
    notes: "Regular weekly stock transfer.",
    totalItems: 2,
    items: [
      {
        id: "ti-4",
        productId: "p4",
        productName: "Seclo 20mg Capsule",
        sku: "MED-SEC-020",
        batchNumber: "SEC-9002",
        batchExpiry: "2027-10-01",
        quantitySent: 40,
        expectedQuantity: 40,
        actualReceived: 40,
        unit: "Boxes",
      },
    ],
  },
  {
    id: "trf-103",
    transferNo: "TRF-2026-003",
    sourceBranch: "Central Distribution Warehouse",
    destinationBranch: "Uttara Branch",
    date: "2026-07-26T09:00:00Z",
    status: "pending",
    notes: "Scheduled transfer awaiting dispatch confirmation.",
    totalItems: 4,
    items: [],
  },
  {
    id: "trf-104",
    transferNo: "TRF-2026-004",
    sourceBranch: "Central Distribution Warehouse",
    destinationBranch: "Chittagong Hub",
    date: "2026-07-25T16:45:00Z",
    status: "cancelled",
    notes: "Cancelled due to transport logistics delay.",
    totalItems: 1,
    items: [],
  },
];
