import { getSearch } from "@/services/search.services"
import { useQuery } from "@tanstack/react-query"

export const useSearch = ({ index, query }: { index: string; query: string }) => {
    return useQuery({
        queryKey: ["search", index, query],
        queryFn: () => getSearch({ index, query }),
        enabled: !!query
    })
}