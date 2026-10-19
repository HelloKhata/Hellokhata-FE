import { redirect } from 'next/navigation';

export default function FinancePayablesReportRedirect() {
  redirect('/reports/finance?tab=payables');
}
