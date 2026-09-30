import { createRole, deleteRole, getAllRoles, getAsignedUsers, updateRole } from "@/services/roles.services";
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
        queryFn: getAllRoles,
        select: data => data.data
    });
};

export const useGetAsignedUsers = (roleId:string) => {
    return useQuery({
        queryKey:['assigned-users',roleId],
        queryFn: () => getAsignedUsers(roleId),
        enabled: Boolean(roleId)
    })
}

export const useUpdateRole = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateRole,
        onSuccess:()=>{
            queryClient.invalidateQueries({ queryKey: ['roles'] });
        }
    })
}
export const useDeleteRole = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteRole,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
        },
    })
}