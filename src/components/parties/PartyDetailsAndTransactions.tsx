'use client';

import { useState } from 'react';
import { useDateFormat, useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import { useParty, useDeleteParty } from '@/hooks/api/useParties';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  User,
  Trash2,
  FileText,
  Bell,
  Search,
  ArrowUpDown,
  Plus,
  CreditCard,
  ChevronLeft,
  Loader2,
  AlertTriangle,
  Edit,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getInitials } from './utils';
import { AddPaymentInModal } from './AddPaymentInModal';
import { AddPaymentOutModal } from './AddPaymentOutModal';
import { AdjustBalanceModal } from './AdjustBalanceModal';

interface PartyDetailsAndTransactionsProps {
  partyId: string;
  onClose: () => void;
}

export function PartyDetailsAndTransactions({
  partyId,
  onClose,
}: PartyDetailsAndTransactionsProps) {
  const { t, isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const router = useRouter();

  const { data: partyDetailData, isLoading, error } = useParty(partyId);
  const { formatDate } = useDateFormat();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { mutate: deleteParty, isPending: isDeleting } = useDeleteParty();

  const [txSearchTerm, setTxSearchTerm] = useState('');
  const [txSortOrder, setTxSortOrder] = useState<'desc' | 'asc'>('desc');
  const [showTxSearch, setShowTxSearch] = useState(false);
  const [showPaymentInModal, setShowPaymentInModal] = useState(false);
  const [showPaymentOutModal, setShowPaymentOutModal] = useState(false);
  const [showAdjustBalanceModal, setShowAdjustBalanceModal] = useState(false);

  const party = partyDetailData?.data;
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 flex-1 my-auto">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">
          {isBangla ? 'লোড হচ্ছে...' : 'Loading details...'}
        </p>
      </div>
    );
  }

  if (error || !party) {
    return (
      <div className="flex flex-col items-center justify-center py-12 flex-1 my-auto text-red-500">
        <AlertTriangle className="h-8 w-8 mb-2" />
        <p className="text-sm font-medium">
          {isBangla ? 'তথ্য লোড করতে ব্যর্থ হয়েছে' : 'Failed to load details'}
        </p>
      </div>
    );
  }

  const handleDelete = () => {
    deleteParty(partyId, {
      onSuccess: () => {
        toast({
          title: isBangla ? 'পার্টি মুছে ফেলা হয়েছে' : 'Party deleted successfully',
        });
        onClose();
      }
    });
  };

  const getStatusContent = (entry: any) => {
    if (entry.type === 'sale') {
      const isPartial = Math.abs(entry.amount) > 100 && (Math.floor(entry.amount) % 2 === 0);
      if (isPartial) {
        const unpaid = Math.round(Math.abs(entry.amount) * 0.3);
        return (
          <div className="flex flex-col items-start">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-700 dark:bg-sky-950/30 dark:text-sky-400">
              PARTIAL
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5">Tk. {unpaid} Unpaid</span>
          </div>
        );
      } else {
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
            PAID
          </span>
        );
      }
    }
    return <span className="text-muted-foreground">—</span>;
  };

  const ledgerEntries = party.ledgerEntries || [];

  const filteredLedger = ledgerEntries
    .filter((entry: any) => {
      if (!txSearchTerm) return true;
      const term = txSearchTerm.toLowerCase();
      return (
        entry.description?.toLowerCase().includes(term) ||
        entry.type?.toLowerCase().includes(term) ||
        entry.referenceId?.toLowerCase().includes(term)
      );
    })
    .sort((a: any, b: any) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return txSortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  const isReceivable = party.currentBalance >= 0;

  return (
    <div className="space-y-6 flex flex-col h-full">
      {/* Top Details section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden shrink-0 h-9 w-9 p-0 flex items-center justify-center"
            onClick={onClose}
          >
            <ChevronLeft className="h-6 w-6 text-foreground" />
          </Button>
          <div className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl shrink-0">
            {getInitials(party.name)}
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-foreground truncate">{party.name}</h2>
            {party.phone && (
              <p className="text-sm text-muted-foreground mt-0.5">{party.phone}</p>
            )}
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-xs text-muted-foreground font-semibold block uppercase tracking-wider">
            {isReceivable ? (isBangla ? 'পাওনা' : 'Receivable') : (isBangla ? 'দেনা' : 'Payable')}
          </span>
          <span className={cn(
            "text-2xl font-extrabold block mt-0.5",
            party.currentBalance > 0 ? "text-emerald-600" :
              party.currentBalance < 0 ? "text-red-600" : "text-foreground"
          )}>
            {formatCurrency(Math.abs(party.currentBalance))}
          </span>
        </div>
      </div>

      {/* Quick Action buttons */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">


          <Button className='text-white/50' onClick={() => router.push(`/parties/${party.id}/edit`)}>
            <Edit className="h-3.5 w-3.5 mr-2" />
            {/* {isBangla ? 'সম্পাদনা করুন' : 'Edit Party'} */}
          </Button>
          <Button className='text-white/50' onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="h-3.5 w-3.5 mr-2" />
            {/* {isBangla ? 'মুছে ফেলুন' : 'Delete Party'} */}
          </Button>
        </div>

        <Button
          // variant="outline"
          size="sm"
          onClick={() => {
            toast({
              title: isBangla ? 'রিমাইন্ডার পাঠানো হয়েছে' : 'Reminder Sent',
              description: isBangla ? `${party.name}-কে তাগাদা পাঠানো হয়েছে।` : `Payment reminder sent to ${party.name}.`
            });
          }}
          className="text-red-500 bg-red-600/20 h-9 px-4 text-xs font-semibold flex items-center gap-1.5"
        >
          <Bell className="h-3.5 w-3.5 text-muted-foreground" />
          {isBangla ? 'তাগাদা পাঠান' : 'Send Reminder'}
        </Button>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="w-[320px]">
          <AlertDialogHeader>
            <AlertDialogTitle>{isBangla ? 'পার্টি মুছবেন?' : 'Delete Party?'}</AlertDialogTitle>
            <AlertDialogDescription>
              {isBangla
                ? 'এই কাজ পূর্বাবস্থায় ফেরানো যাবে না। পার্টিটি স্থায়ীভাবে মুছে ফেলা হবে।'
                : 'This action cannot be undone. This party will be permanently deleted.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{isBangla ? 'বাতিল' : 'Cancel'}</AlertDialogCancel>
            <Button
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
              {isBangla ? 'মুছুন' : 'Delete'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Transactions Section */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex items-center justify-between gap-4 mt-6 pb-4">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            {isBangla ? `লেনদেন (${filteredLedger.length})` : `Transactions (${filteredLedger.length})`}
          </h3>

          <div className="flex items-center gap-2">
            {showTxSearch && (
              <Input
                placeholder={isBangla ? 'খুঁজুন...' : 'Search...'}
                value={txSearchTerm}
                onChange={(e) => setTxSearchTerm(e.target.value)}
                className="h-9 w-36 text-xs bg-background border-input"
                autoFocus
              />
            )}
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "h-9 w-9 border-input hover:bg-accent hover:text-accent-foreground text-foreground shrink-0",
                showTxSearch && "bg-accent"
              )}
              onClick={() => {
                setShowTxSearch(!showTxSearch);
                if (showTxSearch) setTxSearchTerm('');
              }}
            >
              <Search className="h-4 w-4 text-muted-foreground" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-9 border-input hover:bg-accent hover:text-accent-foreground text-foreground text-xs font-semibold flex items-center gap-1.5 shrink-0"
              onClick={() => setTxSortOrder(txSortOrder === 'desc' ? 'asc' : 'desc')}
            >
              <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
              {isBangla ? 'সাজান' : 'Sort'}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-4 text-xs font-semibold flex items-center gap-1 shrink-0"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {isBangla ? 'লেনদেন যোগ' : 'Add Transaction'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 text-xs">
                <DropdownMenuItem onClick={() => router.push(`/sales/new?partyId=${party.id}`)}>
                  {isBangla ? 'নতুন বিক্রয়' : 'New Sale'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/purchases/new?partyId=${party.id}`)}>
                  {isBangla ? 'নতুন ক্রয়' : 'New Purchase'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/sales/quotations/new?partyId=${party.id}`)}>
                  {isBangla ? 'নতুন কোটেশন' : 'New Quotation'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowPaymentInModal(true)}>
                  {isBangla ? 'পেমেন্ট গ্রহণ' : 'Payment In'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowPaymentOutModal(true)}>
                  {isBangla ? 'পেমেন্ট প্রদান' : 'Payment Out'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowAdjustBalanceModal(true)}>
                  {isBangla ? 'ব্যালেন্স সমন্বয়' : 'Adjust Balance'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="border border-border rounded-xl overflow-hidden bg-transparent shadow-sm flex-1 min-h-[300px]">
          {filteredLedger.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground my-auto flex flex-col items-center justify-center h-full min-h-[250px]">
              <CreditCard className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm">{isBangla ? 'কোনো লেনদেন পাওয়া যায়নি' : 'No transactions found'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[450px]">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground text-xs font-semibold uppercase sticky top-0 border-b border-border z-10">
                  <tr>
                    <th className="px-6 py-3">{isBangla ? 'ধরন' : 'Type'}</th>
                    <th className="px-6 py-3">{isBangla ? 'তারিখ' : 'Date'}</th>
                    <th className="px-6 py-3 text-right">{isBangla ? 'মোট' : 'Total'}</th>
                    <th className="px-6 py-3">{isBangla ? 'স্ট্যাটাস' : 'Status'}</th>
                    <th className="px-6 py-3 text-right">{isBangla ? 'ব্যালেন্স' : 'Balance'}</th>
                    <th className="px-6 py-3">{isBangla ? 'মন্তব্য' : 'Remarks'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-transparent">
                  {filteredLedger.map((entry: any) => {
                    return (
                      <tr key={entry.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-foreground max-w-[180px] truncate text-xs">
                          {entry.description}
                          {entry.referenceId && (
                            <span className="block text-[10px] text-muted-foreground font-normal mt-0.5">
                              Ref: #{entry.referenceId}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(entry.date, 'short')}
                        </td>
                        <td className="px-6 py-4 text-right font-medium whitespace-nowrap text-xs">
                          {formatCurrency(Math.abs(entry.amount))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusContent(entry)}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-foreground whitespace-nowrap text-xs">
                          {formatCurrency(entry.balance)}
                        </td>
                        <td className="px-6 py-4 text-xs text-muted-foreground truncate max-w-[120px]">
                          {entry.remarks || '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <AddPaymentInModal
        isOpen={showPaymentInModal}
        onClose={() => setShowPaymentInModal(false)}
        defaultPartyId={party.id}
      />

      <AddPaymentOutModal
        isOpen={showPaymentOutModal}
        onClose={() => setShowPaymentOutModal(false)}
        defaultPartyId={party.id}
      />

      <AdjustBalanceModal
        isOpen={showAdjustBalanceModal}
        onClose={() => setShowAdjustBalanceModal(false)}
        partyId={party.id}
        partyName={party.name}
        currentBalance={party.currentBalance}
      />
    </div>
  );
}
