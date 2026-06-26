import client from "@/lib/axios";

export const getSearch = async ({ index, query }: { index: string; query: string }) => {
    const res = await client.get(`/api/search`, {
        params: {
            index,
            q: query
        }
    })
    return res.data
}