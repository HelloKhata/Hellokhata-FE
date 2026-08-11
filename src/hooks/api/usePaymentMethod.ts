
import { createPaymentMethod, getPaymentMethods } from "@/services/paymentMethodServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useCreatePaymentMethod = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPaymentMethod,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payment-method'] });
        }
    })
}


export const useGetPaymentMethods = () =>{
    return useQuery({
        queryKey: ['payment-method'],
        queryFn: getPaymentMethods,
        select: data => data.data
    })
}