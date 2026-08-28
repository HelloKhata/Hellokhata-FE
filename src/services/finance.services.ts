import client from "@/lib/axios";

export const getTransactions = async () =>{
    const res = await client.get('/api/transactions')
    return res.data;
}