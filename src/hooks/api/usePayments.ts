
import { getPaymentList, paymentSummary, createPaymentIn, createPaymentOut, adjustBalance } from "@/services/payments.services"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const usePaymentSummary = () => {
    return useQuery({
        queryKey: ["payment-summary"],
        queryFn: () => paymentSummary(),
        select: data => data.data
    })
}

export const useCreatePaymentIn = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPaymentIn,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['parties'] });
            queryClient.invalidateQueries({ queryKey: ['party'] });
        }
    });
};

export const useCreatePaymentOut = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPaymentOut,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['parties'] });
            queryClient.invalidateQueries({ queryKey: ['party'] });
        }
    });
};
export const useAdjustBalance = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: adjustBalance,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['parties'] });
            queryClient.invalidateQueries({ queryKey: ['party'] });
        }
    });
}
export const useGetPaymentList = (partyId?: string) => {
    return useQuery({
        queryKey: ['payment-plans', partyId],
        queryFn: () => getPaymentList(partyId),
        select: data => data.data
    })
}