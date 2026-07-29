import { Metadata } from "next";
import { LoanPageContent } from "@/components/finance/loans/LoanPageContent";

export const metadata: Metadata = {
  title: "Business Loan | Hello Khata",
  description: "Explore business loan opportunities using your HelloKhata transaction history.",
};

export default function LoanPage() {
  return <LoanPageContent />;
}
