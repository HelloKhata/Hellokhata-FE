import { redirect } from 'next/navigation';

export default function AccountLedgerRedirect() {
  redirect('/reports/finance?tab=cash-bank');
}
