import { redirect } from 'next/navigation';

export default function AccountStatementRedirect() {
  redirect('/reports/finance?tab=cash-bank');
}
