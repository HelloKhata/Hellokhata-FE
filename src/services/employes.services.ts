import client from "@/lib/axios"

export const createEmployee = async (employee:any) =>{
    const res = await client.post('/api/employees/',employee)
    return res.data;
};

export const getAllEmployes = async () =>{
    const res = await client.get('/api/employees/')
    return res.data;
};

export const getSingleEmployee = async (id: string) => {
    const res = await client.get(`/api/employees/${id}`)
    return res.data;
};