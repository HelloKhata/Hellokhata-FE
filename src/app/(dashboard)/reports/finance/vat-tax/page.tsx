import { redirect } from 'next/navigation';

export default function VatTaxRedirect() {
    redirect('/reports/finance?tab=overview');
} 
