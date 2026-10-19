import { redirect } from 'next/navigation';

export default function JournalReportRedirect() {
  redirect('/reports/finance?tab=income-expense');
}
