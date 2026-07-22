// Hello Khata OS - Offers & Promotions Management Page
// হ্যালো খাতা - প্রমোশন ও অফার ব্যবস্থাপনা পেজ

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sparkles,
  Plus,
  Search,
  Tag,
  Calendar,
  Layers,
  Edit2,
  Power,
  PowerOff,
  Percent,
  Gift,
  DollarSign,
  Package,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  Ban,
} from 'lucide-react';
import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useGetOffers, useToggleOfferStatus } from '@/hooks/api/useOffers';
import { Offer, OfferType, OfferStatus } from '@/types/offer.types';
import { toast } from 'sonner';

export default function PromotionsPage() {
  const router = useRouter();
  const { t, isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [branchFilter, setBranchFilter] = useState<string>('all');

  const { data: offersData, isLoading } = useGetOffers({
    search: searchQuery,
    status: statusFilter,
    type: typeFilter,
  });

  const { mutate: toggleStatus, isPending: isToggling } = useToggleOfferStatus();

  const offers = offersData?.data || [];

  // Client-side branch filter (since service mock doesn't support it)
  const filteredOffers = branchFilter === 'all'
    ? offers
    : offers.filter((o) => o.branchId === branchFilter || o.branchId === 'all');

  const handleToggleStatus = (offer: Offer) => {
    const newStatus: OfferStatus = offer.status === 'active' ? 'inactive' : 'active';
    toggleStatus(
      { id: offer.id, status: newStatus },
      {
        onSuccess: () => {
          toast.success(
            isBangla
              ? `অফারটি ${newStatus === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'} করা হয়েছে`
              : `Offer ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`
          );
        },
      }
    );
  };

  const getOfferTypeBadge = (type: OfferType) => {
    switch (type) {
      case 'bogo':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Gift className="h-3.5 w-3.5" />
            Buy X Get Y (BOGO)
          </span>
        );
      case 'percentage':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Percent className="h-3.5 w-3.5" />
            Percentage Off
          </span>
        );
      case 'flat':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <DollarSign className="h-3.5 w-3.5" />
            Flat Discount
          </span>
        );
      case 'bundle':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Package className="h-3.5 w-3.5" />
            Bundle Price
          </span>
        );
    }
  };

  const getStatusBadge = (status: OfferStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {isBangla ? 'সক্রিয়' : 'Active'}
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Clock className="h-3 w-3" />
            {isBangla ? 'নির্ধারিত' : 'Scheduled'}
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle className="h-3 w-3" />
            {isBangla ? 'মেয়াদোত্তীর্ণ' : 'Expired'}
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20">
            <Ban className="h-3 w-3" />
            {isBangla ? 'নিষ্ক্রিয়' : 'Inactive'}
          </span>
        );
    }
  };

  const formatOfferSummary = (offer: Offer) => {
    switch (offer.type) {
      case 'bogo':
        return `Buy ${offer.bogoConfig?.buyQuantity || 1} Get ${offer.bogoConfig?.freeQuantity || 1} Free`;
      case 'percentage':
        return `${offer.percentageConfig?.percentage}% Off`;
      case 'flat':
        return `${formatCurrency(offer.flatConfig?.amount || 0)} Off (${offer.flatConfig?.scope === 'per_unit' ? 'Per Unit' : 'Per Order'})`;
      case 'bundle':
        return `Bundle of ${offer.bundleConfig?.bundleQuantity || 2} @ ${formatCurrency(offer.bundleConfig?.bundlePrice || 0)}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Sparkles className="h-6 w-6 text-primary" />
            {isBangla ? 'প্রমোশন ও অফারসমূহ' : 'Promotions & Offers'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isBangla
              ? 'পণ্য ও ব্যাচের জন্য বিশেষ ছাড়, BOGO ও বান্ডেল অফার পরিচালনা করুন'
              : 'Manage special discounts, BOGO, and bundle offers across products & batches'}
          </p>
        </div>

        <Button
          onClick={() => router.push('/inventory/promotions/new')}
          className="shrink-0 h-10 px-4 rounded-xl font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 cursor-pointer flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>{isBangla ? 'নতুন অফার তৈরি করুন' : 'Create Offer'}</span>
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-xl bg-card border border-border/60 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={isBangla ? 'অফার শিরোনাম, পণ্য বা ব্যাচ খুঁজুন...' : 'Search offer title, product, or batch...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 bg-background/50 border-input"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] h-10 bg-background/50 border-input text-xs font-semibold">
              <SelectValue placeholder={isBangla ? 'স্ট্যাটাস' : 'Status'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isBangla ? 'সব স্ট্যাটাস' : 'All Status'}</SelectItem>
              <SelectItem value="active">{isBangla ? 'সক্রিয়' : 'Active'}</SelectItem>
              <SelectItem value="scheduled">{isBangla ? 'নির্ধারিত' : 'Scheduled'}</SelectItem>
              <SelectItem value="expired">{isBangla ? 'মেয়াদোত্তীর্ণ' : 'Expired'}</SelectItem>
              <SelectItem value="inactive">{isBangla ? 'নিষ্ক্রিয়' : 'Inactive'}</SelectItem>
            </SelectContent>
          </Select>

          {/* Offer Type Filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px] h-10 bg-background/50 border-input text-xs font-semibold">
              <SelectValue placeholder={isBangla ? 'অফার ধরন' : 'Offer Type'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isBangla ? 'সব ধরন' : 'All Types'}</SelectItem>
              <SelectItem value="bogo">BOGO (Buy X Get Y)</SelectItem>
              <SelectItem value="percentage">Percentage Off</SelectItem>
              <SelectItem value="flat">Flat Discount</SelectItem>
              <SelectItem value="bundle">Bundle Price</SelectItem>
            </SelectContent>
          </Select>

          {/* Branch Filter */}
          <Select value={branchFilter} onValueChange={setBranchFilter}>
            <SelectTrigger className="w-[140px] h-10 bg-background/50 border-input text-xs font-semibold">
              <SelectValue placeholder={isBangla ? 'ব্রাঞ্চ' : 'Branch'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isBangla ? 'সব ব্রাঞ্চ' : 'All Branches'}</SelectItem>
              <SelectItem value="all">{isBangla ? 'সকল ব্রাঞ্চ' : 'All Outlets'}</SelectItem>
              <SelectItem value="main">{isBangla ? 'মূল ব্রাঞ্চ' : 'Main Branch'}</SelectItem>
              <SelectItem value="outlet-1">Dhanmondi Outlet</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Offers Table Container */}
      <div className="rounded-xl border border-[#1e2738] bg-[#131823] shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1f283c] flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-100 tracking-tight">
            {isBangla ? 'অফার তালিকা' : 'Offers List'}
          </h2>
          <span className="text-xs font-medium text-[#718296]">
            {filteredOffers.length} {isBangla ? 'টি অফার' : 'total offers'}
          </span>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-xs text-[#718296]">{isBangla ? 'অফার লোড হচ্ছে...' : 'Loading offers...'}</p>
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                {isBangla ? 'কোনো অফার পাওয়া যায়নি' : 'No Offers Found'}
              </h3>
              <p className="text-xs text-[#718296] max-w-sm mx-auto mt-1">
                {isBangla
                  ? 'আপনার বিক্রয় বৃদ্ধি ও স্টক দ্রুত খালি করার জন্য প্রথম প্রমোশন অফারটি তৈরি করুন।'
                  : 'Create your first promotion offer to boost sales and accelerate batch stock turnover.'}
              </p>
            </div>
            <Button
              onClick={() => router.push('/inventory/promotions/new')}
              className="h-10 px-5 rounded-xl font-semibold gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>{isBangla ? 'প্রথম অফার তৈরি করুন' : 'Create First Offer'}</span>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#1f283c] bg-[#131823] text-[#718296] text-[12px] font-semibold tracking-wide">
                  <th className="px-4 py-3.5 whitespace-nowrap">{isBangla ? 'পণ্য' : 'Product'}</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">{isBangla ? 'ব্যাচ' : 'Batch'}</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">{isBangla ? 'অফার ধরন' : 'Offer Type'}</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">{isBangla ? 'সারসংক্ষেপ' : 'Offer Summary'}</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">{isBangla ? 'মেয়াদ' : 'Validity'}</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">{isBangla ? 'ব্রাঞ্চ' : 'Branch'}</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">{isBangla ? 'স্ট্যাটাস' : 'Status'}</th>
                  <th className="px-4 py-3.5 text-right whitespace-nowrap">{isBangla ? 'অ্যাকশন' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b2231] bg-[#131823]">
                {filteredOffers.map((offer) => (
                  <tr
                    key={offer.id}
                    className="hover:bg-[#1a2130]/80 transition-colors"
                  >
                    {/* Product */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {offer.productImage ? (
                          <img
                            src={offer.productImage}
                            alt={offer.productName}
                            className="h-9 w-9 rounded-lg object-cover border border-[#252e42]"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-lg bg-[#1a2130] border border-[#252e42] flex items-center justify-center text-[#718296]">
                            <Package className="h-4 w-4" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-slate-100 text-sm">{offer.productName}</p>
                          <p className="text-[11px] text-[#718296]">
                            Reg: {formatCurrency(offer.regularPrice)} • {offer.productSku || 'SKU-N/A'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Batch */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      {offer.batchNumber ? (
                        <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <Layers className="h-3 w-3" />
                          {offer.batchNumber}
                        </span>
                      ) : (
                        <span className="text-xs text-[#718296] font-medium">All Batches</span>
                      )}
                    </td>

                    {/* Offer Type */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      {getOfferTypeBadge(offer.type)}
                    </td>

                    {/* Offer Summary */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="font-bold text-slate-100 text-xs">
                        {formatOfferSummary(offer)}
                      </span>
                    </td>

                    {/* Validity */}
                    <td className="px-4 py-4 whitespace-nowrap text-xs text-[#718296]">
                      {offer.untilSoldOut ? (
                        <span className="text-amber-400 font-semibold">Until Sold Out</span>
                      ) : offer.endDate ? (
                        <span>
                          {format(new Date(offer.startDate), 'dd MMM')} - {format(new Date(offer.endDate), 'dd MMM yyyy')}
                        </span>
                      ) : (
                        <span>From {format(new Date(offer.startDate), 'dd MMM yyyy')}</span>
                      )}
                    </td>

                    {/* Branch */}
                    <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-300 font-medium">
                      {offer.branchName || 'All Branches'}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      {getStatusBadge(offer.status)}
                    </td>

                    {/* Actions (Edit, Activate/Deactivate) */}
                    <td className="px-4 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          title={isBangla ? 'সম্পাদনা করুন' : 'Edit Offer'}
                          onClick={() => router.push(`/inventory/promotions/new?id=${offer.id}`)}
                          className="p-1.5 rounded-md text-[#718296] hover:text-white hover:bg-[#202738] transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          disabled={isToggling}
                          title={offer.status === 'active' ? 'Deactivate' : 'Activate'}
                          onClick={() => handleToggleStatus(offer)}
                          className={cn(
                            'p-1.5 rounded-md transition-colors',
                            offer.status === 'active'
                              ? 'text-emerald-400 hover:bg-emerald-500/10'
                              : 'text-[#718296] hover:text-white hover:bg-[#202738]'
                          )}
                        >
                          {offer.status === 'active' ? (
                            <Power className="h-4 w-4" />
                          ) : (
                            <PowerOff className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
