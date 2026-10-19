import { redirect } from 'next/navigation';

export default function GeneralLedgerRedirect() {
  redirect('/reports/finance?tab=income-expense');
}
