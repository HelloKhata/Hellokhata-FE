
import { createEmployee, getAllEmployes, getSingleEmployee } from "@/services/employes.services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useCreateEmployee = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createEmployee,
        mutationKey: ["create-employee"],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["employees"] });
        },
    })
};

export const useGetEmployes = () =>{
    return useQuery({
        queryKey: ["employees"],
        queryFn: getAllEmployes,
        select: data => data.data
    })
};

export const useGetSingleEmployee = (id: string) => {
    return useQuery({
        queryKey: ["employee", id],
        queryFn: () => getSingleEmployee(id),
        enabled: Boolean(id),
        select: data => data?.data || data
    });
};