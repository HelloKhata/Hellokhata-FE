import { getAllBranches } from "@/services/branches.servvices"
import {  useQuery } from "@tanstack/react-query"

export const useGetBranches = () =>{
    return useQuery({
        queryKey:['branches'],
        queryFn: getAllBranches,
        select: data => data?.data
        })
}