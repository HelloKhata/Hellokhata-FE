
import { getPaymentList, createPaymentIn, createPaymentOut, getPaymentById, getOpeningBalance, createAdjustBalance, getAdjustBalance } from "@/services/payments.services"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

// payments(payment in/payment out)
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


export const useGetPaymentById = (id: string) => {
    console.log('id from useGetPaymentById', id)
    return useQuery({
        queryKey: ["payment", id],
        queryFn: () => getPaymentById(id),
        enabled: !!id,
    })
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





// adjustment balance
export const useGetAdjustBalance = (id:string) =>{
    return useQuery({
        queryKey: ["adjustBalance", id],
        queryFn: () => getAdjustBalance(id),
        enabled: !!id,
    })
};

export const useCreateAdjustBalance = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createAdjustBalance,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['parties'] });
            queryClient.invalidateQueries({ queryKey: ['party'] });
            queryClient.invalidateQueries({ queryKey: ['partyLedger'] });
        }
    });
};


