import client from "@/lib/axios"


// payments (payment in / payment out)
export const createPaymentIn = (data: any) => {
    return client.post('/api/parties/payment-in', data)
}

export const createPaymentOut = (data: any) => {
    return client.post('/api/parties/payment-out', data)
}


export const getPaymentList = (type?: 'received' | 'paid') => {
    return client.get('/api/payments', { params: { type } })
}

export const getPaymentById = async (id: string) => {
    const res = await client.get(`/api/payments/${id}`);
    return res.data;
}


// opening balance
export const getOpeningBalance  = async (id:string) =>{
    const res = await client.get(`/api/parties/${id}/opening-balance`)
    return res.data
}



// adjustment balance
export const createAdjustBalance = (data: any) => {
    return client.post('/api/parties/adjust-balance', data)
};

export const getAdjustBalance = async (id: string) => {
    const res = await client.get(`/api/parties/adjustments/${id}`)
    return res.data
};
