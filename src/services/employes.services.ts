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


export const updateEmployee = async ({ id, employee }: { id: string; employee: any }) => {
    const res = await client.patch(`/api/employees/${id}`, employee);
    return res.data;
};

