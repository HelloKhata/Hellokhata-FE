import client from "@/lib/axios"

export const getFeaturesPlan = async () =>{
    const res = await client.get('/api/feature/plan')
    return res.data
};


export const activatePlan = async(plan:any) =>{
    const res = await client.post('/api/features/plan/activate',plan)
};

export const getMyFeatures = async() =>{
    const res = await  client.get('/api/features/my-features')
    return res.data
};

