import { Metadata } from "next";
import { DepositWithdrawalPageContent } from "@/components/finance/deposits-withdrawals/DepositWithdrawalPageContent";

export const metadata: Metadata = {
  title: "Deposit & Withdrawal | Hello Khata",
  description: "Move money between your cash, bank, and wallet accounts.",
};

export default function DepositWithdrawalPage() {
  return <DepositWithdrawalPageContent />;
}
