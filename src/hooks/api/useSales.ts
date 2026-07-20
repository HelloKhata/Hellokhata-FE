import { createSales, getSaleById, getSales, getSalesSummary } from "@/services/sales.services"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useCreateSales = () => {
    return useMutation({
        mutationFn: createSales
    })
}

export const useGetSales = (filter: { search?: string, partyId?: string } = {}) => {
    return useQuery({
        queryKey: ['sales', filter],
        queryFn: () => getSales(filter)
    })
}

export const useGetSalesSummary = () => {
    return useQuery({
        queryKey: ['sales', 'summary'],
        queryFn: getSalesSummary
    })
}

export const useGetSaleById = (id: string) => {
    return useQuery({
        queryKey: ['sales', id],
        queryFn: () => getSaleById(id),
        enabled: !!id,
    })
}



