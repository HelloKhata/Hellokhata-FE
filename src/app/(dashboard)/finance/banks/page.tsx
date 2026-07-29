import { Metadata } from "next";
import { BankWalletsPageContent } from "@/components/finance/banks/BankWalletsPageContent";

export const metadata: Metadata = {
  title: "Bank & Wallets | Hello Khata",
  description: "Reconcile your bank and wallet statements with recorded transactions.",
};

export default function BankWalletsPage() {
  return <BankWalletsPageContent />;
}
