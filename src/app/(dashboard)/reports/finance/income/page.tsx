import { redirect } from 'next/navigation';

export default function FinanceIncomeReportRedirect() {
  redirect('/reports/finance?tab=income-expense');
}
