import client from "@/lib/axios";

export const createPaymentMethod = async (data: any) => {
    const res = await client.post('/api/payment-methods', data)
    return res.data
};

export const getPaymentMethods = async () => {
    const res = await client.get('/api/payment-methods')
    return res.data
}