import client from "@/lib/axios";

export interface ReminderPayload {
  title: string;
  dateTime: string; // ISO 8601 string: e.g. "2026-06-25T10:00:00.000Z"
  type: "payment reminder" | "event reminder" | "task reminder";
  notes: string;
  partyId?: string;
}

export const createReminder = async (data: ReminderPayload) => {
  const res = await client.post("/api/reminders", data);
  return res.data;
};

export const getReminders = async () => {
  const res = await client.get("/api/reminders");
  return res.data;
};

export const deleteReminder = async (id: string) => {
  const res = await client.delete(`/api/reminders/${id}`);
  return res.data;
};

export const updateReminder = async ({ id, data }: { id: string; data: any }) => {
  const res = await client.patch(`/api/reminders/${id}`, data);
  return res.data;
};

