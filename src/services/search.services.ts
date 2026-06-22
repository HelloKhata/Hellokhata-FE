import client from "@/lib/axios";

export const getSearch = async (query: string) => {
    const res = await client.get(`/api/search`, {
        params: {
            index: 'parties',
            q: query
        }
    })
    return res.data
}