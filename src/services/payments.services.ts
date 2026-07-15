import client from "@/lib/axios"


// payments (payment in / payment out)
export const createPaymentIn = (data: any) => {
    return client.post('/api/parties/payment-in', data)
}

export const createPaymentOut = (data: any) => {
    return client.post('/api/parties/payment-out', data)
}

export const deletePayment = async (id: string) => {
    const res = await client.delete(`/api/payments/${id}`);
    console.log('delete response',res)
    return res.data;
}

export const getPaymentList = (type?: 'received' | 'paid') => {
    return client.get('/api/payments', { params: { type } })
}

export const getPaymentById = async (id: string) => {
    const res = await client.get(`/api/payments/${id}`);
    return res.data;
}

export const updatePayment = async ({id,data} ) =>{
    const res = await client.patch(`/api/payments/${id}`,data)
}

// opening balance
export const getOpeningBalance  = async (id:string) =>{
    const res = await client.get(`/api/parties/${id}/opening-balance`)
    return res.data
}

export const updateOpeningBalance  = async ({id,data} ) =>{
    const res = await client.patch(`/api/parties/${id}/opening-balance`,data)
    return res.data
}

export const deleteOpeningBalance = async (id:string ) =>{
    const res = await client.delete(`/api/parties/${id}/opening-balance`)
    return res.data
};

// adjustment balance
export const createAdjustBalance = (data: any) => {
    return client.post('/api/parties/adjust-balance', data)
};

export const getAdjustBalance = async (id: string) => {
    const res = await client.get(`/api/parties/adjustments/${id}`)
    return res.data
};

export const deleteAdjustBalance = async (id:string ) =>{
    const res = await client.delete(`/api/parties/adjustments/${id}`)
    return res.data
};

export const updateAdjustBalance = async ({id,data} ) =>{
    const res = await client.patch(`/api/parties/adjustments/${id}`,data)
    return res.data
};