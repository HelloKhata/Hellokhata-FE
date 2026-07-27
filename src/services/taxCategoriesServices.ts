import client from "@/lib/axios"

export const createTaxCategories = async(data:any) =>{
    const res = await client.post('/api/tax-categories',data)
    return res.data
};


export const getTaxCategories = async () =>{
    const res = await client.get('/api/tax-categories')
    return res.data
}