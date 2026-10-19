import { redirect } from 'next/navigation';

export default function FinanceWalletStatementRedirect() {
  redirect('/reports/finance?tab=cash-bank');
}
