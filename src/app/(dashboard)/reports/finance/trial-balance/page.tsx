import { redirect } from 'next/navigation';

export default function TrialBalanceRedirect() {
  redirect('/reports/finance?tab=profit-loss');
}
