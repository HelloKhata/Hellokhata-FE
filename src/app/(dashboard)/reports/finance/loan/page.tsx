import { redirect } from 'next/navigation';

export default function LoanReportRedirect() {
  redirect('/reports/finance?tab=cash-bank');
}
