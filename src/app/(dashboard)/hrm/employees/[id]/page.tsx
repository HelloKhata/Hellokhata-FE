import { Metadata } from "next";
import { EmployeeProfileDashboard } from "@/features/hr/employees/components/EmployeeProfileDashboard";
import { MOCK_EMPLOYEES } from "@/features/hr/employees/constants";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Employee Profile | Hello Khata",
  description: "View employee profile dashboard, attendance, leaves, and payslips.",
};

interface EmployeeProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EmployeeProfilePage({ params }: EmployeeProfilePageProps) {
  const { id } = await params;
  const employee = MOCK_EMPLOYEES.find((e) => e.id.toLowerCase() === id.toLowerCase()) || MOCK_EMPLOYEES[0];

  return <EmployeeProfileDashboard employee={employee} />;
}
