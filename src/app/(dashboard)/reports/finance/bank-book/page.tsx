import { redirect } from 'next/navigation';

export default function FinanceBankBookRedirect() {
  redirect('/reports/finance?tab=cash-bank');
}
