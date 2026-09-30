import client from "@/lib/axios";

export const getTransactions = async () =>{
    const res = await client.get('/api/transactions')
    return res.data;
};

export const createIncomeCategory = async(data) =>{
    const res = await client.post('/api/incomes/categories',data)
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
}