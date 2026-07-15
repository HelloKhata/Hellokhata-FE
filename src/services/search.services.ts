import client from "@/lib/axios";

export const getSearch = async ({ index, query, filter }: { index: string; query: string; filter?: string }) => {
    const res = await client.get(`/api/search`, {
        params: {
            index,
            q: query,
            ...(filter ? { filter } : {})
        }
    })
    return res.data
}