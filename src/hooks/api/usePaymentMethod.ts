
import { createPaymentMethod, getPaymentMethods, getDepositsAndWithdrawls, createDeposit, createWithdrawal, deleteTransaction, getPaymentMethodStatus } from "@/services/paymentMethodServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreatePaymentMethod = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPaymentMethod,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payment-method'] });
        }
    });
};


export const useGetPaymentMethods = () =>{
    return useQuery({
        queryKey: ['payment-method'],
        queryFn: getPaymentMethods,
        select: data => data.data
    })
};
 
// status
export const useGetPaymentMethodStatus = ()=>{
    return useQuery({
        queryKey: ['deposit-withdrawls-sum'],
        queryFn: getPaymentMethodStatus,
        select: data => data.data
    })
};


// deposits and withdrawls
export const useGetDepositsAndWithdrawls = (params?: { search?: string; accountId?: string; type?: string }) =>{
    return useQuery({
        queryKey: ['deposits-and-withdrawls', params],
        queryFn: () => getDepositsAndWithdrawls(params),
        select: data => data.data
    })
};

export const useCreateDeposit = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createDeposit,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['deposits-and-withdrawls'] });
            queryClient.invalidateQueries({ queryKey: ['deposit-withdrawls-sum'] });
            // queryClient.invalidateQueries({ queryKey: ['payment-method'] });
        }
    });
};

export const useCreateWithdrawal = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createWithdrawal,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['deposits-and-withdrawls'] });
            queryClient.invalidateQueries({ queryKey: ['deposit-withdrawls-sum'] });
            // queryClient.invalidateQueries({ queryKey: ['payment-method'] });
        }
    });
};

export const useDeleteTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['deposits-and-withdrawls'] });
            queryClient.invalidateQueries({ queryKey: ['deposit-withdrawls-sum'] });
            // queryClient.invalidateQueries({ queryKey: ['payment-method'] });
        }
    });
};