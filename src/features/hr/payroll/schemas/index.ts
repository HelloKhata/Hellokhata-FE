import { z } from "zod";

export const payrollRunSetupSchema = z.object({
  branchName: z.string().min(1, "Branch required"),
  payPeriod: z.string().min(1, "Pay period required"),
  salaryMonth: z.string().min(1, "Salary month required"),
  paymentDate: z.string().min(1, "Payment date required"),
});

export const bonusPaymentSchema = z.object({
  bonusType: z.enum(["Eid Bonus", "Festival Bonus", "Performance Bonus", "One-Time Bonus"]),
  title: z.string().min(3, "Bonus title is required"),
  branchName: z.string().min(1, "Branch required"),
  amountPerEmployee: z.number().min(100, "Amount must be >= ৳100"),
  disbursedDate: z.string().min(1, "Disbursement date required"),
});

export type PayrollRunSetupValues = z.infer<typeof payrollRunSetupSchema>;
export type BonusPaymentValues = z.infer<typeof bonusPaymentSchema>;
