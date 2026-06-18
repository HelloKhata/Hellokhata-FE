import client from "@/lib/axios";

export const getNotifications = async () => {
    const res = await client.get('/api/notifications');
    return res.data;
}

export const readAllNotifications = async () => {
    const res = await client.patch('/api/notifications/read-all');
    return res.data;
}