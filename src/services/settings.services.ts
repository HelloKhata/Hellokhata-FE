import client from "@/lib/axios"

export const updateUser = async (user: any) => {
    const res = await client.patch('/api/settings/user', user);
    return res.data
};

export const updateBusiness = async (businessInfo: any) => {
    const res = await client.patch('/api/settings/business', businessInfo);
    return res.data
};

export const updatePassword = async (passwords: { currentPassword: string, newPassword: string}) => {
    const res = await client.patch('/api/settings/user/password', passwords);
    return res.data
};

export const getInvetorySettings = async () => {
    const res = await client.get('/api/settings/inventory');
    return res.data;
}
export const updateInventorySettings = async (inventorySettings: any) => {
    const res = await client.put('/api/settings/inventory', inventorySettings);
    return res.data;
}