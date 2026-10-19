import { redirect } from 'next/navigation';

export default function FinanceCashBookRedirect() {
  redirect('/reports/finance?tab=cash-bank');
}
