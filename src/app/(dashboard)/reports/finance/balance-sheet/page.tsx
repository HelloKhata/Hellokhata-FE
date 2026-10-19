import { redirect } from 'next/navigation';

export default function BalanceSheetRedirect() {
  redirect('/reports/finance?tab=profit-loss');
}
