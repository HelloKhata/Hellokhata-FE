import client from "@/lib/axios"

export const lockPeriod = async (data: any) => {
    const res = await client.post('/api/settings/period-locks', data);
    return res.data;
};

export const getPeriodLocks = async () => {
    const res = await client.get('/api/settings/period-locks');
    return res.data;
}

export const unlockPeriod = async (lockId: string) => {
    const res = await client.delete(`/api/settings/period-locks/${lockId}`);
    return res.data;
}