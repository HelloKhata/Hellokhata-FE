
import { getPaymentList, createPaymentIn, createPaymentOut, adjustBalance, deletePayment, getPaymentById, updatePayment, deleteOpeningBalance, updateOpeningBalance, getOpeningBalance } from "@/services/payments.services"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useCreatePaymentIn = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPaymentIn,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['parties'] });
            queryClient.invalidateQueries({ queryKey: ['party'] });
            queryClient.invalidateQueries({ queryKey: ['partyLedger'] });
             queryClient.invalidateQueries({ queryKey: ['payment'] });
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
            queryClient.invalidateQueries({ queryKey: ['partyLedger'] });
            queryClient.invalidateQueries({queryKey:['payment']})
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
            queryClient.invalidateQueries({ queryKey: ['partyLedger'] });
        }
    });
};

export const useDeletePayment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deletePayment,
        onSuccess: (_data, deletedId) => {
            // Remove the specific payment query BEFORE invalidating,
            // so React Query won't refetch a deleted resource (404).
            queryClient.removeQueries({ queryKey: ['payment', deletedId] });
            queryClient.invalidateQueries({ queryKey: ['parties'] });
            queryClient.invalidateQueries({ queryKey: ['party'] });
            queryClient.invalidateQueries({ queryKey: ['partyLedger'] });
            queryClient.invalidateQueries({ queryKey: ['payment'] });
        }
    });
};

export const useGetPaymentById = (id: string) => {
    console.log('id from useGetPaymentById', id)
    return useQuery({
        queryKey: ["payment", id],
        queryFn: () => getPaymentById(id),
        enabled: !!id,
    })
}; 

export const useUpdatePayment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updatePayment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['parties'] });
            queryClient.invalidateQueries({ queryKey: ['party'] });
            queryClient.invalidateQueries({ queryKey: ['partyLedger'] });
            queryClient.invalidateQueries({queryKey: ['payment']})
      
        }
    });
};



export const useGetPaymentList = (type?: 'received' | 'paid') => {
    return useQuery({
        queryKey: ["payment", type],
        queryFn: () => getPaymentList(type),
        enabled: !!type,
    })
}       



// opening balance
export const useGetOpeningBalance = (id:string) =>{
    return useQuery({
        queryKey: ["openingBalance", id],
        queryFn: () => getOpeningBalance(id),
        enabled: !!id,
    })
};


export const useUpdateOpeningBalance = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateOpeningBalance,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['parties'] });
            queryClient.invalidateQueries({ queryKey: ['party'] });
            queryClient.invalidateQueries({ queryKey: ['partyLedger'] });
        }
    })
};

export const useDeleteOpeningBalance = ( ) =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteOpeningBalance,
        onSuccess: () =>{
            queryClient.invalidateQueries({ queryKey: ['parties'] });
            queryClient.invalidateQueries({ queryKey: ['party'] });
            queryClient.invalidateQueries({ queryKey: ['partyLedger'] });
        }
    })
};