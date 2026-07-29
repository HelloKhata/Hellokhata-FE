import { Metadata } from "next";
import { PayrollPageContent } from "@/features/hr/payroll/components/PayrollPageContent";

export const metadata: Metadata = {
  title: "Payroll System | Hello Khata",
  description: "Review, calculate, approve, and distribute employee salaries while automatically syncing with Finance.",
};

export default function PayrollPage() {
  return <PayrollPageContent />;
}
