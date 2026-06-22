import { getSearch } from "@/services/search.services"
import { useQuery } from "@tanstack/react-query"

export const useSearch = (query: string) => {
    return useQuery({
        queryKey: ["search", query],
        queryFn: () => getSearch(query)
    })
}