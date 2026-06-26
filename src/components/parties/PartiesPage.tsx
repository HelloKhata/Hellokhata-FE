// Hello Khata OS - Parties Page
// হ্যালো খাতা - পার্টি পেজ

'use client';

import { useState } from 'react';
import { PageHeader, EmptyState } from '@/components/common';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  Plus,
  Search,
  User,
  Building2,
  Loader2,
  SlidersHorizontal,
} from 'lucide-react';
import { useCurrency, useAppTranslation } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import type { Party } from '@/types';
import { useRouter } from 'next/navigation';
import { useParties } from '@/hooks/api/useParties';
import { useSearch } from '@/hooks/api/useSearch';
import { PartyCard } from './PartyCard';
import { PartyDetailsAndTransactions } from './PartyDetailsAndTransactions';

export default function PartiesPage() {
  const { t, isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'customer' | 'supplier' | 'both'>('both');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'receivable' | 'payable' | 'settled'>('all');
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);

  const { data: partiesData, isLoading } = useParties();
  const parties = partiesData?.data || [];

  const { data: partiesSearchData } = useSearch({ index: "parties", query: searchTerm });
  const searchParties = partiesSearchData?.data.hits;
  const router = useRouter();

  console.log("searchParties", partiesSearchData)

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
            {/* added total count */}
            <div className="flex items-center justify-between mb-4 gap-4">
              <h2 className="text-lg font-bold text-foreground">
                {isBangla ? `পার্টি (${partiesData?.summary?.total || 0})` : `Parties (${partiesData?.summary?.total || 0})`}
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
                  {searchTerm !== '' ? searchParties?.map((party: any) => (
                    <PartyCard
                      key={party.id}
                      party={party}
                      isSelected={selectedParty?.id === party.id}
                      onView={() => setSelectedParty(party)}
                    />
                  )) : parties.map((party: any) => (
                    <PartyCard
                      key={party.id}
                      party={party}
                      isSelected={selectedParty?.id === party.id}
                      onView={() => setSelectedParty(party)}
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
                />
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
