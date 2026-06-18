
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getNotifications, readAllNotifications } from "@/services/notifications.services"

export const useNotifications = () => {
    return useQuery({
        queryKey: ['notifications'],
        queryFn: getNotifications
    })
}

export const useReadAllNotifications = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: readAllNotifications,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
    })
}

