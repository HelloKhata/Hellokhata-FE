
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getNotifications, markAsReadNotification, readAllNotifications } from "@/services/notifications.services"

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



export const useMarkAsReadNotification  = () =>{
      const queryClient = useQueryClient();

    return useMutation({
        mutationFn: markAsReadNotification,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
    })
}