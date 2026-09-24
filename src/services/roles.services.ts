import client from "@/lib/axios"

export const createRole = async(roleData: any) => {
   const res = await client.post('/api/settings/roles', roleData)
   return res.data
};


export const getAlRoles = async() => {
   const res = await client.get('/api/settings/roles')
   return res.data
};

export const deleteRole = async(roleId: string) => {
   const res = await client.delete(`/api/settings/roles/${roleId}`)
   return res.data
};