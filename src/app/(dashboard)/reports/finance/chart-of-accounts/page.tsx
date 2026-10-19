import { redirect } from 'next/navigation';

export default function ChartOfAccountsRedirect() {
  redirect('/reports/finance?tab=cash-bank');
}
