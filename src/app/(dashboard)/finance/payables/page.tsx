import { Metadata } from "next";
import { PayablesPageContent } from "@/components/finance/payables/PayablesPageContent";

export const metadata: Metadata = {
  title: "Payables | Hello Khata",
  description: "Track supplier bills, monitor due dates, and manage business payments.",
};

export default function PayablesPage() {
  return <PayablesPageContent />;
}
