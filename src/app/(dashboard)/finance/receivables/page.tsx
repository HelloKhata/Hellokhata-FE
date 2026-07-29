import { Metadata } from "next";
import { ReceivablesPageContent } from "@/components/finance/receivables/ReceivablesPageContent";

export const metadata: Metadata = {
  title: "Receivables | Hello Khata",
  description: "Track outstanding customer payments and monitor overdue balances.",
};

export default function ReceivablesPage() {
  return <ReceivablesPageContent />;
}
