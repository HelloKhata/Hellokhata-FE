import { z } from "zod";

export const generalInfoSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().min(11, "Enter a valid phone number (min 11 digits)"),
  email: z.string().email("Enter a valid email address"),
  nid: z.string().optional(),
  avatarUrl: z.string().optional(),
});

export const employmentSchema = z.object({
  employeeId: z.string().min(2, "Employee ID is required"),
  branchName: z.string().min(1, "Please select a branch"),
  role: z.enum([
    "Manager",
    "Sales Associate",
    "Accountant",
    "Cashier",
    "Store Keeper",
    "HR Officer",
    "Delivery Executive",
  ]),
  joiningDate: z.string().min(1, "Joining date is required"),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  managerName: z.string().optional(),
});

export const salaryComponentSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Component name required"),
  amount: z.number().min(0, "Amount must be >= 0"),
  type: z.enum(["allowance", "deduction"]),
});

export const salaryStructureSchema = z.object({
  basicSalary: z.number().min(1000, "Basic salary must be at least ৳1,000"),
  allowances: z.array(salaryComponentSchema).default([]),
  deductions: z.array(salaryComponentSchema).default([]),
});

export const addEmployeeWizardSchema = z.object({
  general: generalInfoSchema,
  employment: employmentSchema,
  salary: salaryStructureSchema,
});

export type GeneralInfoValues = z.infer<typeof generalInfoSchema>;
export type EmploymentValues = z.infer<typeof employmentSchema>;
export type SalaryStructureValues = z.infer<typeof salaryStructureSchema>;
export type AddEmployeeWizardValues = z.infer<typeof addEmployeeWizardSchema>;
