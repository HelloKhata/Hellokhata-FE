import client from "@/lib/axios";

export const getTransactions = async (filters?: any) => {
    const res = await client.get('/api/transactions', { params: filters })
    return res.data;
};

export const createIncomeCategory = async (data) => {
    const res = await client.post('/api/incomes/categories', data)
    return res.data;
};

export const getIncomeCategories = async() =>{
    const res = await client.get('/api/incomes/categories')
    return res.data;
};

export const updateIncomeCategory = async({id,data}:{id:string,data:any}) =>{
    const res = await client.patch(`/api/incomes/categories/${id}`,data)
    return res.data;
};

export const deleteIncomeCategory = async(id:string) =>{
    const res = await client.delete(`/api/incomes/categories/${id}`)
    return res.data;
};


export const createIncome = async(data:any) =>{
    const res = await client.post('/api/incomes',data)
    return res.data;
};


export const getIncomes = async (data?: any) => {
    const res = await client.get('/api/incomes')
    return res.data;
}

export const deleteIncome = async (id: string) => {
    const res = await client.delete(`/api/incomes/${id}`)
    return res.data;
}

export const getIncomeSummary = async () => {
    const res = await client.get('/api/incomes/summary')
    return res.data;
}