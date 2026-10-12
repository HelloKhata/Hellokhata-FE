import { changeBusinessTypes, getMasterBusinessTypes, getMasterItems } from "@/services/masterItems.services"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useGetMasterItems = (search:string) =>{
    return useQuery({
        queryKey:['master-items',search],
        queryFn: () => getMasterItems(search),
        select: data => data.data,
        enabled:!!search
    })
};


export const useGetMasterBusinessTypes = () =>{
    return useQuery({
        queryKey:['master-business-types'],
        queryFn:  getMasterBusinessTypes,
        select: data => data.data,
    })
};

export const useChangeBusinessTypes = () =>{
    return useMutation({
        mutationFn: changeBusinessTypes,
    })
}