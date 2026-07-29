import { z } from "zod";

export const attendanceCorrectionSchema = z.object({
  recordId: z.string().min(1, "Record ID required"),
  checkIn: z.string().min(1, "Check in time required"),
  checkOut: z.string().optional(),
  status: z.enum(["present", "late", "absent", "leave", "holiday"]),
  correctionReason: z.string().min(3, "Correction reason is required for audit logs"),
  managerNote: z.string().optional(),
});

export type AttendanceCorrectionValues = z.infer<typeof attendanceCorrectionSchema>;
