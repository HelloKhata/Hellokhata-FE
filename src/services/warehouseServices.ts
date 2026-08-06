import client from "@/lib/axios";

export const createWarehouse = async (data: any) => {
    const res = await client.post('/api/warehouses', data);
    return res.data;
};

export const getWarehouses = async () => {
    const res = await client.get('/api/warehouses');
    return res.data;
};
