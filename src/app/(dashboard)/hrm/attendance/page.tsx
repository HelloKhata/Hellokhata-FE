import { Metadata } from "next";
import { AttendancePageContent } from "@/features/hr/attendance/components/AttendancePageContent";

export const metadata: Metadata = {
  title: "Attendance Management | Hello Khata",
  description: "Monitor employee attendance, check-ins, matrix grid, and touch kiosk terminal.",
};

export default function AttendancePage() {
  return <AttendancePageContent />;
}
