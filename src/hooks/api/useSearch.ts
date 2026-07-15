import { getSearch } from "@/services/search.services"
import { useQuery } from "@tanstack/react-query"

export const useSearch = ({ index, query, filter }: { index: string; query: string; filter?: string }) => {
    return useQuery({
        queryKey: ["search", index, query, filter],
        queryFn: () => getSearch({ index, query, filter }),
        enabled: !!query
    })
}