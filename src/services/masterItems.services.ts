import client from "@/lib/axios"

export const getMasterItems = async (search: string) => {
    const res = await client.get('/api/master-items', { params: { search } });
    return res.data
};


export const getMasterBusinessTypes = async () => {
    const res = await client.get('/api/settings/master-db/business-types');
    return res.data
};

export const changeBusinessTypes = async(businessIds: string[]) => {
    const res = await client.put('/api/settings/master-db/business-types', {businessTypeIds:businessIds});
    return res.data
}