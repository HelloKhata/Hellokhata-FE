// Hello Khata OS - Offers TanStack Query Hooks
// হ্যালো খাতা - অফার ক্যোয়ারী হুকস

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getOffers,
  getOfferById,
  createOffer,
  updateOffer,
  toggleOfferStatus,
  getActiveOfferForProduct,
} from "@/services/offer.service";
import { Offer, OfferStatus } from "@/types/offer.types";

export const useGetOffers = (filter?: {
  search?: string;
  status?: string;
  type?: string;
  productId?: string;
  batchId?: string;
}) => {
  return useQuery({
    queryKey: ["offers", filter],
    queryFn: () => getOffers(filter),
  });
};

export const useGetOfferById = (id?: string) => {
  return useQuery({
    queryKey: ["offers", id],
    queryFn: () => getOfferById(id!),
    enabled: !!id,
  });
};

export const useCreateOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Offer>) => createOffer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
};

export const useUpdateOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Offer> }) =>
      updateOffer(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["batches"] });
    },
  });
};

export const useToggleOfferStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OfferStatus }) =>
      toggleOfferStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    },
  });
};

export const useCheckActiveOffer = (productId?: string, batchId?: string) => {
  return useQuery({
    queryKey: ["offers", "active", productId, batchId],
    queryFn: () => getActiveOfferForProduct(productId!, batchId),
    enabled: !!productId,
  });
};
