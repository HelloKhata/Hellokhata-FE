import client from "@/lib/axios"

export const getAllBranches = async() =>{
    const res = await client.get('/api/branches');
    return res.data
}