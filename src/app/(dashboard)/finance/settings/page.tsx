import { Metadata } from "next";
import { FinanceSettingsPageContent } from "@/components/finance/settings/FinanceSettingsPageContent";

export const metadata: Metadata = {
  title: "Finance & Accounting Settings | Hello Khata",
  description: "Configure accounting preferences, chart of accounts, VAT settings, and advanced options.",
};

export default function FinanceSettingsPage() {
  return <FinanceSettingsPageContent />;
}
