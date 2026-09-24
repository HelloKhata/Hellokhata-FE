import { createRole, deleteRole, getAlRoles } from "@/services/roles.services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createRole,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
        },
    });
};


export const useGetRoles = () =>{
    return useQuery({
        queryKey: ['roles'],
        queryFn: getAlRoles,
        select: data => data.data
    });
};

export const useDeleteRole = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteRole,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
        },
    })
}