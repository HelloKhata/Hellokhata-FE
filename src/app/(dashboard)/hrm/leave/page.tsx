import { Metadata } from "next";
import { LeavePageContent } from "@/features/hr/leave/components/LeavePageContent";

export const metadata: Metadata = {
  title: "Leave Management | Hello Khata",
  description: "Request, approve, and monitor employee leave with automatic attendance and payroll synchronization.",
};

export default function LeavePage() {
  return <LeavePageContent />;
}
