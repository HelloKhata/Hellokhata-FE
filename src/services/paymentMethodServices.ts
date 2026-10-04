import client from "@/lib/axios";

export const createPaymentMethod = async (data: any) => {
    const res = await client.post('/api/payment-methods', data)
    return res.data
};

export const getPaymentMethods = async () => {
    const res = await client.get('/api/payment-methods')
    return res.data
};

// deposits and withdrawls
export const getDepositsAndWithdrawls = async (params?: { search?: string; accountId?: string; type?: string }) => {
    const res = await client.get('/api/payment-methods/deposit-withdraw', { params })
    return res.data
};

export const createDeposit = async (data: any) => {
    const res = await client.post('/api/payment-methods/deposit', data)
    return res.data
};

export const createWithdrawal = async (data: any) => {
    const res = await client.post('/api/payment-methods/withdraw', data)
    return res.data
};

export const getDepositWithdrawlsSum = async() =>{
    const res = await client.get('/api/payment-methods/stats')
    return res.data
};

// delete a transaction
export const deleteTransaction = async(id:string) =>{
    const res = await client.delete(`/api/payment-methods/deposit-withdraw/${id}`)
    return res.data
};