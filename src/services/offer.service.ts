// Hello Khata OS - Offer API Service
// হ্যালো খাতা - অফার এপিআই সার্ভিস Layer

import client from "@/lib/axios";
import { Offer, OfferStatus } from "@/types/offer.types";

// In-memory mock store initialized with sample offers for rich UI demonstration
let mockOffers: Offer[] = [
  {
    id: "off-101",
    title: "123 Maxi Detergent BOGO",
    type: "bogo",
    status: "active",
    scope: "product",
    productId: "item-1",
    productName: "123 Maxi Poder/Max Power Liquid Detergent 1.83 Ltr",
    productSku: "SKU-DET-01",
    regularPrice: 450,
    bogoConfig: {
      buyQuantity: 1,
      freeQuantity: 1,
    },
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0],
    untilSoldOut: false,
    branchId: "all",
    branchName: "All Branches",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "off-102",
    title: "Perfume 20% Off Promotion",
    type: "percentage",
    status: "active",
    scope: "product",
    productId: "item-2",
    productName: "1 Million Paco Rabanne Eau De Toilette Perfume 100 ml",
    productSku: "SKU-PRF-02",
    regularPrice: 12000,
    percentageConfig: {
      percentage: 20,
    },
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    untilSoldOut: false,
    branchId: "all",
    branchName: "All Branches",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "off-103",
    title: "4K Soap Batch Clearance BOGO",
    type: "bogo",
    status: "active",
    scope: "batch",
    productId: "item-3",
    productName: "4K Plus 5X Alpha Arbutin Soap 100 gm",
    productSku: "SKU-SOP-03",
    regularPrice: 350,
    batchId: "batch-301",
    batchNumber: "BATCH-SOAP-2026",
    batchExpiry: "2026-08-30",
    bogoConfig: {
      buyQuantity: 1,
      freeQuantity: 1,
    },
    startDate: new Date().toISOString().split("T")[0],
    untilSoldOut: true,
    branchId: "all",
    branchName: "Main Branch",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const getOffers = async (filter?: {
  search?: string;
  status?: string;
  type?: string;
  productId?: string;
  batchId?: string;
}): Promise<{ data: Offer[] }> => {
  let list = [...mockOffers];

  if (filter?.search) {
    const query = filter.search.toLowerCase();
    list = list.filter(
      (o) =>
        o.title.toLowerCase().includes(query) ||
        o.productName.toLowerCase().includes(query) ||
        (o.batchNumber && o.batchNumber.toLowerCase().includes(query))
    );
  }

  if (filter?.status && filter.status !== "all") {
    list = list.filter((o) => o.status === filter.status);
  }

  if (filter?.type && filter.type !== "all") {
    list = list.filter((o) => o.type === filter.type);
  }

  if (filter?.productId) {
    list = list.filter((o) => o.productId === filter.productId);
  }

  if (filter?.batchId) {
    list = list.filter((o) => o.batchId === filter.batchId);
  }

  return { data: list };
};

export const getOfferById = async (id: string): Promise<{ data: Offer | null }> => {
  const offer = mockOffers.find((o) => o.id === id) || null;
  return { data: offer };
};

export const createOffer = async (payload: Partial<Offer>): Promise<{ data: Offer }> => {
  const newOffer: Offer = {
    id: `off-${Date.now()}`,
    title: payload.title || `${payload.productName || 'Offer'} ${payload.type?.toUpperCase()}`,
    type: payload.type || 'bogo',
    status: payload.status || 'active',
    scope: payload.scope || 'product',
    productId: payload.productId || '',
    productName: payload.productName || '',
    productSku: payload.productSku || '',
    productImage: payload.productImage || '',
    regularPrice: payload.regularPrice || 0,
    batchId: payload.batchId,
    batchNumber: payload.batchNumber,
    batchExpiry: payload.batchExpiry,
    bogoConfig: payload.bogoConfig,
    percentageConfig: payload.percentageConfig,
    flatConfig: payload.flatConfig,
    bundleConfig: payload.bundleConfig,
    startDate: payload.startDate || new Date().toISOString().split("T")[0],
    endDate: payload.endDate,
    untilSoldOut: payload.untilSoldOut || false,
    branchId: payload.branchId || 'all',
    branchName: payload.branchId === 'all' ? 'All Branches' : 'Main Branch',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockOffers = [newOffer, ...mockOffers];
  return { data: newOffer };
};

export const updateOffer = async (id: string, payload: Partial<Offer>): Promise<{ data: Offer }> => {
  mockOffers = mockOffers.map((o) => {
    if (o.id === id) {
      return {
        ...o,
        ...payload,
        updatedAt: new Date().toISOString(),
      };
    }
    return o;
  });

  const updated = mockOffers.find((o) => o.id === id)!;
  return { data: updated };
};

export const toggleOfferStatus = async (
  id: string,
  status: OfferStatus
): Promise<{ data: Offer }> => {
  return updateOffer(id, { status });
};

export const getActiveOfferForProduct = async (
  productId: string,
  batchId?: string
): Promise<{ data: Offer | null }> => {
  const activeOffers = mockOffers.filter(
    (o) =>
      o.status === "active" &&
      o.productId === productId &&
      (batchId ? o.batchId === batchId || !o.batchId : true)
  );

  return { data: activeOffers[0] || null };
};
