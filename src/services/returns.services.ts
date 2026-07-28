import client from "@/lib/axios";

export const returnSale = async (data: any) => {
    const res = await client.post('/api/sales/returns', data);
    return res.data;
}

export const getSalesReturns = async () => {
    const res = await client.get('/api/sales/returns');
    return res.data;
}

export const getSalesReturnById = async (id: string) => {
    const res = await client.get(`/api/sales/returns/${id}`);
    return res.data;
}

export const getPurchaseReturns = async () => {
    const res = await client.get('/api/purchases/returns');
    return res.data;
}

export const returnPurchase = async (data: any) => {
    const res = await client.post('/api/purchases/returns', data);
    return res.data;
}

export const getPurchaseReturnById = async (id: string) => {
    const res = await client.get(`/api/purchases/returns/${id}`);
    return res.data;
}