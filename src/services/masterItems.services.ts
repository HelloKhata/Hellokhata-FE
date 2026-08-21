import client from "@/lib/axios"

export const getMasterItems = async (search: string) => {
    const res = await client.get('/api/master-items', { params: { search } });
    return res.data
}