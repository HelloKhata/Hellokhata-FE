import client from "@/lib/axios";


export const getDashboardStats = async () => {
    const response = await client.get("/api/dashboard/summary");
    return response.data;
}