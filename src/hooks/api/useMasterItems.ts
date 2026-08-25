import { getMasterItems } from "@/services/masterItems.services"
import { useQuery } from "@tanstack/react-query"

export const useGetMasterItems = (search:string) =>{
    return useQuery({
        queryKey:['master-items',search],
        queryFn: () => getMasterItems(search),
        select: data => data.data,
        enabled:!!search
    })
}