import client from "@/lib/axios";

export const createItemCategories = async (data: {name: string}) => {
    const res = await client.post('/api/item-categories', data);
    return res.data;
}