import { z } from "zod";

export const leaveRequestSchema = z.object({
  leaveType: z.enum(["Casual Leave", "Sick Leave", "Earned Leave", "Festival Leave"]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  reason: z.string().min(3, "Reason must be at least 3 characters"),
});

export type LeaveRequestValues = z.infer<typeof leaveRequestSchema>;
