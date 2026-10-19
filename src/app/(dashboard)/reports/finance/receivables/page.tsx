import { redirect } from 'next/navigation';

export default function FinanceReceivablesReportRedirect() {
  redirect('/reports/finance?tab=receivables');
}
