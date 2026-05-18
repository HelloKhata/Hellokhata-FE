import { updateBusiness, updatePassword, updateUser } from "@/services/settings.services"
import { useMutation } from "@tanstack/react-query"

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