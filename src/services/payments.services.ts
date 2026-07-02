import client from "@/lib/axios"

export const paymentSummary = () => {
    return client.get('/api/payments/summary')
}

export const createPaymentPlans = (data: any) => {
    return client.post('/api/payments/plans', data)
};

export const getPaymentList = (id?: string) => {
    return client.get('/api/payments/plans/list', { params: { partyId: id } })
}

export const createPaymentIn = (data: any) => {
    return client.post('/api/parties/payment-in', data)
}

export const createPaymentOut = (data: any) => {
    return client.post('/api/parties/payment-out', data)
}

export const adjustBalance = (data: any) => {
    return client.post('/api/parties/adjust-balance', data)
}

export const deletePayment = async (id: string) => {
    const res = await client.delete(`/api/payments/${id}`);
    return res.data;
}