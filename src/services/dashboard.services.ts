import client from "@/lib/axios"

export const dashboardSummary = async () => {
    const res = await client.get('/api/dashboard/summary');
    console.log(res.data)
    return res.data
}