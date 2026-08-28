import { getTransactions } from "@/services/finance.services"
import { useQuery } from "@tanstack/react-query"

export const useGetTransactions = () =>{
    return useQuery({
        queryKey:['transactions'],
        queryFn: () =>   getTransactions(),
        select: (data) => data.data
    })
}