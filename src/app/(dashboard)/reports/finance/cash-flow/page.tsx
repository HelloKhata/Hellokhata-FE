import { redirect } from 'next/navigation';

export default function CashFlowRedirect() {
    redirect('/reports/finance?tab=cash-bank');
}    
 