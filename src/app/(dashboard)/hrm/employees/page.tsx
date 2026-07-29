import { Metadata } from "next";
import { EmployeesPageContent } from "@/features/hr/employees/components/EmployeesPageContent";

export const metadata: Metadata = {
  title: "Employees Roster | Hello Khata",
  description: "Manage employee information, roles, salary structures, and branch assignments.",
};

export default function EmployeesPage() {
  return <EmployeesPageContent />;
}
