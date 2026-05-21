import { getInvetorySettings, updateBusiness, updateInventorySettings, updatePassword, updateUser } from "@/services/settings.services"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useUpdateUser = () => {
    return useMutation({
        mutationFn: updateUser,
    })
};

export const useUpdateBusiness = () => {
    return useMutation({
        mutationFn: updateBusiness
    })
};

export const useUpdatePassword = () => {
    return useMutation({
        mutationFn: updatePassword
    })
};


export const useGetInventorySettings = () => {
    return useQuery({
        queryKey: ['inventorySettings'],
        queryFn: getInvetorySettings,
        select: data => data.data
    })
}
export const useUpdateInventorySettings = () => {
    return useMutation({
        mutationFn: updateInventorySettings
    })
}