import client from "@/lib/axios"

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
    console.log('delete response',res)
    return res.data;
}



// get all payments(payment in / payment out)
export const getPaymentList = (type?: 'received' | 'paid') => {
    return client.get('/api/payments', { params: { type } })
}

// for particular payment
export const getPaymentById = async (id: string) => {
    const res = await client.get(`/api/payments/${id}`);
    return res.data;
}


// delete a payment(payment in/payment out)
export const updatePayment = async ({id,data} ) =>{
    const res = await client.patch(`/api/payments/${id}`,data)
}