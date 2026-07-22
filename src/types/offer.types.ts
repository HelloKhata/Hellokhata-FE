// Hello Khata OS - Offer & Promotion Types
// হ্যালো খাতা - প্রমোশন ও অফার টাইপস

export type OfferType = 'bogo' | 'percentage' | 'flat' | 'bundle';

export type OfferStatus = 'active' | 'scheduled' | 'expired' | 'inactive';

export type OfferScope = 'product' | 'batch';

export interface BogoConfig {
  buyQuantity: number;
  freeQuantity: number;
}

export interface PercentageConfig {
  percentage: number;
}

export interface FlatConfig {
  amount: number;
  scope: 'per_unit' | 'per_transaction';
}

export interface BundleConfig {
  bundleQuantity: number;
  bundlePrice: number;
}

export type OfferConfig = BogoConfig | PercentageConfig | FlatConfig | BundleConfig;

export interface Offer {
  id: string;
  title: string;
  type: OfferType;
  status: OfferStatus;
  scope: OfferScope;
  productId: string;
  productName: string;
  productSku?: string;
  productImage?: string;
  regularPrice: number;
  batchId?: string;
  batchNumber?: string;
  batchExpiry?: string;
  
  // Specific Configuration based on type
  bogoConfig?: BogoConfig;
  percentageConfig?: PercentageConfig;
  flatConfig?: FlatConfig;
  bundleConfig?: BundleConfig;
  
  // Validity
  startDate: string;
  endDate?: string;
  untilSoldOut?: boolean;
  
  // Branch
  branchId?: string; // 'all' or specific branch ID
  branchName?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface POSAppliedOffer {
  offerId: string;
  offerType: OfferType;
  title: string;
  chargedQuantity: number;
  freeQuantity: number;
  unitPrice: number;
  originalLineTotal: number;
  discountedLineTotal: number;
  savings: number;
}

// Extended BillingItemRow with offer integration for POS
export interface POSCartItem {
  id: string;
  itemId: string;
  itemName: string;
  batchNo?: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  discountPercent: number;
  discountFlat: number;
  total: number;
  searchQuery: string;
  showSuggestions: boolean;
  imageUrl?: string;
  // Offer fields
  appliedOffer?: POSAppliedOffer;
  chargedQuantity: number;
  freeQuantity: number;
  offerSavings: number;
}

// Helper to calculate BOGO offer for a given quantity
export function calculateBogoOffer(
  quantity: number,
  buyQty: number,
  freeQty: number,
  unitPrice: number
): POSAppliedOffer | null {
  if (quantity < buyQty) return null;

  const groupSize = buyQty + freeQty;
  const fullGroups = Math.floor(quantity / groupSize);
  const remainder = quantity % groupSize;
  const extraCharged = Math.min(remainder, buyQty);

  const chargedQuantity = fullGroups * buyQty + extraCharged;
  const freeQuantity = quantity - chargedQuantity;
  const originalLineTotal = quantity * unitPrice;
  const discountedLineTotal = chargedQuantity * unitPrice;
  const savings = originalLineTotal - discountedLineTotal;

  if (savings <= 0) return null;

  return {
    offerId: '',
    offerType: 'bogo',
    title: `Buy ${buyQty} Get ${freeQty} Free`,
    chargedQuantity,
    freeQuantity,
    unitPrice,
    originalLineTotal,
    discountedLineTotal,
    savings,
  };
}

// Helper to calculate percentage offer
export function calculatePercentageOffer(
  quantity: number,
  percentage: number,
  unitPrice: number
): POSAppliedOffer | null {
  if (percentage <= 0 || percentage > 100) return null;

  const discountPerUnit = unitPrice * (percentage / 100);
  const savings = discountPerUnit * quantity;
  const originalLineTotal = quantity * unitPrice;
  const discountedLineTotal = originalLineTotal - savings;

  return {
    offerId: '',
    offerType: 'percentage',
    title: `${percentage}% Off`,
    chargedQuantity: quantity,
    freeQuantity: 0,
    unitPrice: unitPrice - discountPerUnit,
    originalLineTotal,
    discountedLineTotal,
    savings,
  };
}

// Helper to calculate flat discount
export function calculateFlatOffer(
  quantity: number,
  flatAmount: number,
  scope: 'per_unit' | 'per_transaction',
  unitPrice: number
): POSAppliedOffer | null {
  if (flatAmount <= 0) return null;

  const savings = scope === 'per_unit' ? flatAmount * quantity : Math.min(flatAmount, quantity * unitPrice);
  const originalLineTotal = quantity * unitPrice;
  const discountedLineTotal = originalLineTotal - savings;

  return {
    offerId: '',
    offerType: 'flat',
    title: `${flatAmount} Tk Off (${scope === 'per_unit' ? 'Per Unit' : 'Per Order'})`,
    chargedQuantity: quantity,
    freeQuantity: 0,
    unitPrice: scope === 'per_unit' ? unitPrice - flatAmount : unitPrice,
    originalLineTotal,
    discountedLineTotal,
    savings,
  };
}

// Helper to calculate bundle offer
export function calculateBundleOffer(
  quantity: number,
  bundleQty: number,
  bundlePrice: number,
  unitPrice: number
): POSAppliedOffer | null {
  if (quantity < bundleQty) return null;

  const fullBundles = Math.floor(quantity / bundleQty);
  const remainder = quantity % bundleQty;
  const bundleTotal = fullBundles * bundlePrice + remainder * unitPrice;
  const originalLineTotal = quantity * unitPrice;
  const savings = originalLineTotal - bundleTotal;

  if (savings <= 0) return null;

  return {
    offerId: '',
    offerType: 'bundle',
    title: `Bundle of ${bundleQty} @ ${bundlePrice} Tk`,
    chargedQuantity: quantity,
    freeQuantity: 0,
    unitPrice: bundleTotal / quantity,
    originalLineTotal,
    discountedLineTotal: bundleTotal,
    savings,
  };
}
