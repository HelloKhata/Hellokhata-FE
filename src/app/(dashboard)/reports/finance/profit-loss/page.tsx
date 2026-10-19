import { redirect } from 'next/navigation';

export default function FinanceProfitLossReportRedirect() {
  redirect('/reports/finance?tab=profit-loss');
}
