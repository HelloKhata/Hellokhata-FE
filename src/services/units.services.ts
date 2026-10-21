import client from "@/lib/axios";

export const createUnit = async (data:{name:string}) =>{
    const res = await client.post('/api/units',data);
    return res.data;

};

export const getUnits = async () =>{
    const res = await client.get('/api/units');
    return res.data;
}