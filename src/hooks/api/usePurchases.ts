import { createPurchases, getPurchaseById, getPurchases, updatePurchase } from "@/services/purchases.services"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useCreatePurchases = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createPurchases,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['purchases'] })
        }
    })
}

export const useGetPurchases = ({search}: {search?: string} ={search:''}) => {
    return useQuery({
        queryKey: ['purchases', search],
        queryFn: () => getPurchases({search}),
        select: (data) => data.data
    })
}

export const useGetPurchaseById = (id: string) => {
    return useQuery({
        queryKey: ['purchase', id],
        queryFn: () => getPurchaseById(id),
        select: (data) => data.data
    })
}

export const useUpdatePurchase = (id: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: any) => updatePurchase({ id, data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['purchases'] })
            queryClient.invalidateQueries({ queryKey: ['purchase', id] })
        }
    })
}