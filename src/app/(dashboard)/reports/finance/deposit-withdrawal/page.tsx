import { redirect } from 'next/navigation';

export default function FinanceDepositWithdrawalRedirect() {
  redirect('/reports/finance?tab=cash-bank');
}
