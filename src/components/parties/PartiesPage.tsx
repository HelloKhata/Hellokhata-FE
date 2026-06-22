// Hello Khata OS - Parties Page
// হ্যালো খাতা - পার্টি পেজ

'use client';

import { useState } from 'react';
import { PageHeader, EmptyState } from '@/components/common';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Users,
  Plus,
  Search,
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  MessageCircle,
  MoreVertical,
  DollarSign,
  Calendar,
  CreditCard,
  FileText,
  Trash2,
  Loader2,
  SlidersHorizontal,
  Bell,
  ArrowUpDown,
  Edit,
  ChevronLeft,
} from 'lucide-react';
import { useCurrency, useDateFormat } from '@/hooks/useAppTranslation';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import type { Party } from '@/types';
import { useRouter } from 'next/navigation';
import { useDeleteParty, useParties, useParty } from '@/hooks/api/useParties';
import { toast } from '@/hooks/use-toast';
import { AlertDialog } from '@radix-ui/react-alert-dialog';
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { useSearch } from '@/hooks/api/useSearch';

export default function PartiesPage() {
  const { t, isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'customer' | 'supplier' | 'both'>('both');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'receivable' | 'payable' | 'settled'>('all');
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);

  const { data: partiesData, isLoading } = useParties();
  const parties = partiesData?.data || [];
  const { data: partiesSearchData } = useSearch(searchTerm);
  const searchParties = partiesSearchData?.data.hits;
  const router = useRouter();

  console.log('partiesData', partiesData)
  // Client-side filtering and searching
  const filteredParties = parties.filter((party: any) => {
    // Type Filter
    if (typeFilter !== 'both') {
      if (party.type !== typeFilter && party.type !== 'both') {
        return false;
      }
    }
    // Payment status filter
    if (paymentFilter !== 'all') {
      if (paymentFilter === 'receivable' && party.currentBalance <= 0) return false;
      if (paymentFilter === 'payable' && party.currentBalance >= 0) return false;
      if (paymentFilter === 'settled' && party.currentBalance !== 0) return false;
    }
    // Search Term
    if (searchTerm) {
      // const term = searchTerm.toLowerCase();
      // const nameMatch = party.name.toLowerCase().includes(term);
      // const phoneMatch = party.phone?.toLowerCase().includes(term) || false;
      // return nameMatch || phoneMatch;
    }
    return true;
  });

  return (
    <>
      <div className="space-y-6">
        <PageHeader
          title={t('parties.title')}
          subtitle={isBangla ? 'গ্রাহক ও সরবরাহকারী ব্যবস্থাপনা' : 'Customer & supplier management'}
          icon={Users}
          action={{
            label: t('parties.addParty'),
            onClick: () => router.push('/parties/new'),
            icon: Plus,
          }}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setTypeFilter('customer')}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{partiesData?.summary?.customers || 0}</div>
                  <p className="text-sm text-gray-500 truncate">{t('parties.customers')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setTypeFilter('supplier')}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-900 flex items-center justify-center shrink-0">
                  <Building2 className="h-5 w-5 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{partiesData?.summary?.suppliers || 0}</div>
                  <p className="text-sm text-gray-500 truncate">{t('parties.suppliers')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                  <Users className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="min-w-0">
                  <div className="text-xl font-bold text-emerald-600 truncate">{formatCurrency(partiesData?.summary?.totalReceivable || 0)}</div>
                  <p className="text-sm text-gray-500 truncate">{t('dashboard.receivable')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-red-100 dark:bg-red-900 flex items-center justify-center shrink-0">
                  <Users className="h-5 w-5 text-red-600" />
                </div>
                <div className="min-w-0">
                  <div className="text-xl font-bold text-red-600 truncate">{formatCurrency(partiesData?.summary?.totalPayable || 0)}</div>
                  <p className="text-sm text-gray-500 truncate">{t('dashboard.payable')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Split Layout Container */}
        <div className="flex flex-col lg:flex-row gap-6 min-h-[600px] items-stretch">
          {/* Left Column: Parties List (40% width) */}
          <Card className={cn(
            "w-full lg:w-[40%] p-6 flex flex-col shrink-0",
            selectedParty && "hidden lg:flex"
          )}>
            <div className="flex items-center justify-between mb-4 gap-4">
              <h2 className="text-lg font-bold text-foreground">
                {isBangla ? `পার্টি (${partiesData?.summery?.total})` : `Parties (${partiesData?.summary?.total})`}
              </h2>
              <Button
                onClick={() => router.push('/parties/new')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-4 text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                {isBangla ? 'পার্টি যোগ করুন' : 'Add Party'}
              </Button>
            </div>

            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground shrink-0" />
                <Input
                  placeholder={isBangla ? 'পার্টি খুঁজুন...' : 'Search parties...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9 text-xs bg-background border-input"
                />
              </div>
              <Button variant="outline" size="icon" className="h-9 w-9 border-input hover:bg-accent hover:text-accent-foreground text-foreground shrink-0">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTypeFilter(typeFilter === 'customer' ? 'both' : 'customer')}
                className={cn(
                  "rounded-full px-4 h-8 text-xs font-medium border-input",
                  typeFilter === 'customer'
                    ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 dark:bg-primary/20 dark:text-primary dark:border-primary/30"
                    : "text-muted-foreground bg-transparent hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {isBangla ? 'গ্রাহক' : 'Customer'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTypeFilter(typeFilter === 'supplier' ? 'both' : 'supplier')}
                className={cn(
                  "rounded-full px-4 h-8 text-xs font-medium border-input",
                  typeFilter === 'supplier'
                    ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 dark:bg-primary/20 dark:text-primary dark:border-primary/30"
                    : "text-muted-foreground bg-transparent hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {isBangla ? 'সরবরাহকারী' : 'Supplier'}
              </Button>

              <Select
                value={paymentFilter}
                onValueChange={(value: any) => setPaymentFilter(value)}
              >
                <SelectTrigger className="w-auto h-8 rounded-full px-4 text-xs font-medium border-input bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:ring-0">
                  <SelectValue placeholder={isBangla ? 'সব পেমেন্ট' : 'All Payment'} />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="all">{isBangla ? 'সব পেমেন্ট' : 'All Payment'}</SelectItem>
                  <SelectItem value="receivable">{isBangla ? 'পাওনা' : 'Receivable'}</SelectItem>
                  <SelectItem value="payable">{isBangla ? 'দেনা' : 'Payable'}</SelectItem>
                  <SelectItem value="settled">{isBangla ? 'মিমাংসিত' : 'Settled'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center flex-1 py-12">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
              </div>
            ) : filteredParties.length === 0 ? (
              <div className="flex-1 py-12">
                <EmptyState
                  icon={Users}
                  title={isBangla ? 'কোনো পার্টি নেই' : 'No parties found'}
                  description={isBangla ? 'নতুন পার্টি যোগ করুন' : 'Add your first party'}
                  action={{
                    label: t('parties.addParty'),
                    onClick: () => router.push('/parties/new'),
                    icon: Plus,
                  }}
                />
              </div>
            ) : (
              <ScrollArea className="flex-1 max-h-[550px] pr-2">
                <div className="space-y-1">
                  {searchParties?.map((party: any) => (
                    <PartyCard
                      key={party.id}
                      party={party}
                      isSelected={selectedParty?.id === party.id}
                      onView={() => setSelectedParty(party)}
                      onDeleteSuccess={() => {
                        if (selectedParty?.id === party.id) {
                          setSelectedParty(null);
                        }
                      }}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </Card>

          {/* Right Column: Transaction History and Details (60% width) */}
          <div className={cn(
            "w-full lg:w-[60%] flex flex-col min-h-[500px] flex-1",
            !selectedParty && "hidden lg:flex"
          )}>
            {!selectedParty ? (
              <Card className="flex flex-col items-center justify-center text-center p-12 flex-1 my-auto h-full">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {isBangla ? 'পার্টি নির্বাচন করুন' : 'Select a Party'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isBangla
                    ? 'পার্টির বিস্তারিত তথ্য এবং লেনদেনের ইতিহাস দেখতে বাম পাশের তালিকা থেকে যেকোনো একটি পার্টি সিলেক্ট করুন।'
                    : 'Select a party from the list on the left to view their detailed information and complete transaction history.'}
                </p>
              </Card>
            ) : (
              <Card className="p-6 flex flex-col h-full flex-1">
                <PartyDetailsAndTransactions
                  partyId={selectedParty.id}
                  onClose={() => setSelectedParty(null)}
                  isBangla={isBangla}
                  t={t}
                  formatCurrency={formatCurrency}
                  router={router}
                />
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const getInitials = (name: string) => {
  if (!name) return '';
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

// Party Details & Transactions Component
interface PartyDetailsAndTransactionsProps {
  partyId: string;
  onClose: () => void;
  isBangla: boolean;
  t: (key: string) => string;
  formatCurrency: (amount: number) => string;
  router: any;
}

function PartyDetailsAndTransactions({
  partyId,
  onClose,
  isBangla,
  t,
  formatCurrency,
  router,
}: PartyDetailsAndTransactionsProps) {
  const { data: partyDetailData, isLoading, error } = useParty(partyId);
  const { formatDate } = useDateFormat();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { mutate: deleteParty, isPending: isDeleting } = useDeleteParty();

  const [txSearchTerm, setTxSearchTerm] = useState('');
  const [txSortOrder, setTxSortOrder] = useState<'desc' | 'asc'>('desc');
  const [showTxSearch, setShowTxSearch] = useState(false);

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-input hover:bg-accent hover:text-accent-foreground text-foreground h-9 px-4 text-xs font-semibold flex items-center gap-1.5"
              >
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                {isBangla ? 'পার্টি পরিচালনা' : 'Manage Party'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40 text-xs">
              <DropdownMenuItem onClick={() => router.push(`/parties/${party.id}/edit`)}>
                <Edit className="h-3.5 w-3.5 mr-2" />
                {isBangla ? 'সম্পাদনা করুন' : 'Edit Party'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20">
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                {isBangla ? 'মুছে ফেলুন' : 'Delete Party'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="icon"
            className="border-input hover:bg-accent hover:text-accent-foreground text-foreground h-9 w-9 shrink-0 flex items-center justify-center"
            onClick={() => router.push(`/parties/${party.id}/edit`)}
          >
            <FileText className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            toast({
              title: isBangla ? 'রিমাইন্ডার পাঠানো হয়েছে' : 'Reminder Sent',
              description: isBangla ? `${party.name}-কে তাগাদা পাঠানো হয়েছে।` : `Payment reminder sent to ${party.name}.`
            });
          }}
          className="border-input hover:bg-accent hover:text-accent-foreground text-foreground h-9 px-4 text-xs font-semibold flex items-center gap-1.5"
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
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
              {isBangla ? 'মুছুন' : 'Delete'}
            </AlertDialogAction>
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
                <DropdownMenuItem onClick={() => router.push('/sales/new')}>
                  {isBangla ? 'নতুন বিক্রয় (ইনভয়েস)' : 'New Sale (Invoice)'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/purchases/new')}>
                  {isBangla ? 'নতুন ক্রয়' : 'New Purchase'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/payments/new?type=receipt')}>
                  {isBangla ? 'পেমেন্ট গ্রহণ (প্রাপ্তি)' : 'Receive Payment (Payment In)'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/payments/new?type=payment')}>
                  {isBangla ? 'পেমেন্ট প্রদান (পরিশোধ)' : 'Make Payment (Payment Out)'}
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
    </div>
  );
}

// Party Card Component
interface PartyCardProps {
  party: Party;
  onView: () => void;
  isSelected?: boolean;
  onDeleteSuccess?: () => void;
}

function PartyCard({ party, onView, isSelected }: PartyCardProps) {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();

  return (
    <div
      onClick={onView}
      className={cn(
        "flex items-center justify-between p-3.5 rounded-xl border transition-all gap-4 cursor-pointer",
        isSelected
          ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-sm"
          : "border-transparent hover:bg-muted/50"
      )}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
          {getInitials(party.name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground truncate text-sm">{party.name}</p>
          {party.phone && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">{party.phone}</p>
          )}
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className={cn(
          'font-bold text-sm',
          party.currentBalance > 0 ? 'text-emerald-600' : party.currentBalance < 0 ? 'text-red-600' : 'text-foreground'
        )}>
          {formatCurrency(party.currentBalance)}
        </p>
        <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
          {party.currentBalance > 0 ? (isBangla ? 'পাওনা' : 'Receivable') :
            party.currentBalance < 0 ? (isBangla ? 'দেনা' : 'Payable') :
              (isBangla ? 'মিমাংসিত' : 'Settled')}
        </p>
      </div>
    </div>
  );
}


