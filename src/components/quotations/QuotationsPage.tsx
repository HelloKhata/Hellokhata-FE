// Hello Khata OS - Premium Quotations Page
// Elite SaaS Design - Dark Theme First

'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  Badge, 
  Button, 
  KPICard, 
  Divider, 
  EmptyState 
} from '@/components/ui/premium';
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
  FileText,
  Plus,
  Search,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  DollarSign,
  ChevronRight,
  ShoppingCart,
  Loader2,
  TrendingUp,
  Printer,
  Share2,
  Package,
} from 'lucide-react';
import { useCurrency, useDateFormat } from '@/hooks/useAppTranslation';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import type { Quotation, QuotationStatus } from '@/types/quotation';
import { QUOTATION_STATUS_CONFIG } from '@/types/quotation';
import { toast } from 'sonner';
import { useDeleteQuotation, useGetQoutationSummary, useGetQuotations } from '@/hooks/api/useQuotations';
import { DetailModal, DetailRow, DetailSection } from '@/components/shared/DetailModal';

export default function QuotationsPage() {
  const router = useRouter();
  const { t, isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const { formatDate } = useDateFormat();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quotationToDelete, setQuotationToDelete] = useState<Quotation | null>(null);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  
  // Fetch quotations from API
  const { data: quotationData = [], isLoading } = useGetQuotations(searchTerm);
  const {data: summaryData} = useGetQoutationSummary();
  const {mutate:deleteMutate,isPending:isDeleting} = useDeleteQuotation();

  // Extract quotations and summary from API response
  const quotations = quotationData?.data || [];
  const summary = summaryData?.data || {};

  // Filter quotations (client-side search and status filter)
  const filteredQuotations = useMemo(() => {
    if (!quotations) return [];
    
    let filtered = quotations;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(q => q.status === statusFilter);
    }
    
    if (!searchTerm) return filtered;
    
    return filtered.filter((quotation) => {
      const matchesSearch = 
        quotation.quotationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quotation.partyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quotation.items.some((item) => item.itemName.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    });
  }, [quotations, searchTerm, statusFilter]);
  
  // Calculate stats
  const stats = useMemo(() => {
    if (!quotations) return { total: 0, pending: 0, accepted: 0, totalValue: 0 };
    
    const total = quotations.length;
    const pending = quotations.filter(q => q.status === 'sent' || q.status === 'draft').length;
    const accepted = quotations.filter(q => q.status === 'accepted').length;
    const totalValue = quotations.reduce((sum, q) => sum + q.total, 0);
    
    return { total, pending, accepted, totalValue };
  }, [quotations]);
  
  // Handle delete confirmation
  const handleDeleteClick = (quotation: Quotation) => {
    setQuotationToDelete(quotation);
    setDeleteDialogOpen(true);
  };
  
  // Handle confirmed delete
  const handleDeleteConfirm = async () => {
    if (!quotationToDelete) return;

    deleteMutate(quotationToDelete.id, {
      onSuccess: () => {
        toast.success(isBangla ? 'কোটেশন সফলভাবে মুছে ফেলা হয়েছে' : 'Quotation deleted successfully');  
        setDeleteDialogOpen(false);
        setQuotationToDelete(null);
      }});

  };
  
  // Handle view quotation
  const handleView = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setIsOpenDetail(true);
  };
  
  // Handle edit quotation
  const handleEdit = (quotation: Quotation) => {
    router.push(`/sales/quotations/${quotation.id}/edit`);
  };
  
  // Handle convert to sale
  const handleConvert = (quotation: Quotation) => {
    router.push(`/sales/new?quotationId=${quotation.id}`);
  };
  
  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              {isBangla ? 'কোটেশন' : 'Quotations'}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5 whitespace-nowrap">
              {isBangla ? 'সকল কোটেশনের রেকর্ড' : 'All quotation records'}
            </p>
          </div>
          <Button onClick={() => router.push('/sales/quotations/new')} className="shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            <span className="whitespace-nowrap">{isBangla ? 'নতুন কোটেশন' : 'New Quotation'}</span>
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Quotations"
            titleBn="মোট কোটেশন"
            value={stats.total}
            icon={<FileText className="h-5 w-5" />}
            iconColor="indigo"
            isBangla={isBangla}
          />
          <KPICard
            title="Pending"
            titleBn="অপেক্ষমান"
            value={stats.pending}
            icon={<Clock className="h-5 w-5" />}
            iconColor="warning"
            isBangla={isBangla}
          />
          <KPICard
            title="Accepted"
            titleBn="গৃহীত"
            value={stats.accepted}
            trend={{ value: 15, isPositive: true }}
            icon={<CheckCircle className="h-5 w-5" />}
            iconColor="emerald"
            isBangla={isBangla}
          />
          <KPICard
            title="Total Value"
            titleBn="মোট মূল্য"
            value={stats.totalValue}
            prefix="৳"
            icon={<DollarSign className="h-5 w-5" />}
            iconColor="emerald"
            isBangla={isBangla}
          />
        </div>

        {/* Filters */}
        <Card variant="elevated" padding="default">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground shrink-0" />
              <Input
                placeholder={isBangla ? 'কোটেশন বা গ্রাহক খুঁজুন...' : 'Search quotation or customer...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder={isBangla ? 'স্ট্যাটাস' : 'Status'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isBangla ? 'সব' : 'All'}</SelectItem>
                <SelectItem value="draft">{isBangla ? 'খসড়া' : 'Draft'}</SelectItem>
                <SelectItem value="sent">{isBangla ? 'প্রেরিত' : 'Sent'}</SelectItem>
                <SelectItem value="accepted">{isBangla ? 'গৃহীত' : 'Accepted'}</SelectItem>
                <SelectItem value="rejected">{isBangla ? 'প্রত্যাখ্যাত' : 'Rejected'}</SelectItem>
                <SelectItem value="converted">{isBangla ? 'রূপান্তরিত' : 'Converted'}</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2 shrink-0">
              <Calendar className="h-4 w-4" />
              <span className="whitespace-nowrap">{isBangla ? 'তারিখ' : 'Date'}</span>
            </Button>
          </div>
        </Card>

        {/* Quotations List */}
        <Card variant="elevated" padding="none">
          <CardHeader className="px-6 pt-6 pb-3">
            <CardTitle className="text-base whitespace-nowrap">
              {isBangla ? 'কোটেশন তালিকা' : 'Quotation List'}
            </CardTitle>
          </CardHeader>
          <Divider />
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
            ) : filteredQuotations.length === 0 ? (
              <EmptyState
                icon={<FileText className="h-8 w-8" />}
                title={isBangla ? 'কোনো কোটেশন নেই' : 'No quotations found'}
                description={isBangla ? 'নতুন কোটেশন তৈরি করুন' : 'Create your first quotation'}
                isBangla={isBangla}
                action={
                  <Button onClick={() => router.push('/sales/quotations/new')}>
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="whitespace-nowrap">{isBangla ? 'নতুন কোটেশন' : 'New Quotation'}</span>
                  </Button>
                }
              />
            ) : (
              <ScrollArea className="h-[500px]">
                <div className="divide-y divide-border-subtle">
                  {filteredQuotations.map((quotation, index) => (
                    <QuotationRow 
                      key={quotation.id} 
                      quotation={quotation} 
                      isBangla={isBangla} 
                      index={index}
                      onView={() => handleView(quotation)}
                      onEdit={() => handleEdit(quotation)}
                      onConvert={() => handleConvert(quotation)}
                      onDelete={() => handleDeleteClick(quotation)}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quotation Detail Modal */}
      <DetailModal
        isOpen={!!isOpenDetail}
        onClose={() => setIsOpenDetail(false)}
        title={selectedQuotation?.quotationNo || ''}
        subtitle={isBangla ? 'কোটেশনের বিবরণ' : 'Quotation Details'}
        width="lg"
      >
        {selectedQuotation && (
          <>
            <DetailSection title={isBangla ? 'কাস্টমার তথ্য' : 'Customer'}>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center shrink-0">
                  <span className="text-sm font-medium text-purple-800 dark:text-purple-300">
                    {selectedQuotation?.partyName 
                      ? selectedQuotation.partyName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) 
                      : 'WC'}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground truncate">
                    {selectedQuotation?.partyName || (isBangla ? 'সাধারণ গ্রাহক' : 'Walk-in customer')}
                  </p>
                </div>
              </div>
            </DetailSection>

            <DetailSection title={isBangla ? 'পণ্য তালিকা' : 'Items'}>
              {selectedQuotation.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 gap-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground truncate">{item.itemName}</p>
                      <p className="text-sm text-muted-foreground whitespace-nowrap">
                        {item.quantity} × {formatCurrency(item.unitPrice)}
                        {item.discount > 0 && (
                          <span className="ml-2 text-amber-600">-{formatCurrency(item.discount)} off</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0 gap-1">
                    <p className="font-bold text-foreground">{formatCurrency(item.total)}</p>
                  </div>
                </div>
              ))}
            </DetailSection>

            <DetailSection title={isBangla ? 'কোটেশনের তথ্য' : 'Quotation Information'}>
              <DetailRow
                label={isBangla ? 'তারিখ ও সময়' : 'Date & Time'}
                value={new Date(selectedQuotation.quotationDate).toLocaleString()}
                icon={<Clock className="h-5 w-5 text-blue-600" />}
              />
              <DetailRow
                label={isBangla ? 'মেয়াদ শেষ হওয়ার তারিখ' : 'Validity Date'}
                value={new Date(selectedQuotation.validityDate).toLocaleDateString()}
                icon={<Calendar className="h-5 w-5 text-amber-600" />}
              />
              <DetailRow
                label={isBangla ? 'স্ট্যাটাস' : 'Status'}
                value={
                  <span className={cn(
                    "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium",
                    selectedQuotation.status === 'converted' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300' :
                    selectedQuotation.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                    selectedQuotation.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                    'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                  )}>
                    <span className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      selectedQuotation.status === 'converted' ? 'bg-indigo-600' :
                      selectedQuotation.status === 'accepted' ? 'bg-green-600' :
                      selectedQuotation.status === 'rejected' ? 'bg-red-600' :
                      'bg-amber-600'
                    )} />
                    {QUOTATION_STATUS_CONFIG[selectedQuotation.status]?.label || selectedQuotation.status}
                  </span>
                }
                icon={<TrendingUp className="h-5 w-5 text-amber-600" />}
              />
              <DetailRow
                label={isBangla ? 'সাবটোটাল' : 'Subtotal'}
                value={formatCurrency(selectedQuotation.subtotal)}
                icon={<DollarSign className="h-5 w-5 text-gray-500" />}
              />
              {selectedQuotation.discount > 0 && (
                <DetailRow
                  label={isBangla ? 'ছাড়' : 'Discount'}
                  value={<span className="text-amber-600">-{formatCurrency(selectedQuotation.discount)}</span>}
                  icon={<DollarSign className="h-5 w-5 text-amber-600" />}
                />
              )}
              {selectedQuotation.tax > 0 && (
                <DetailRow
                  label={isBangla ? 'ট্যাক্স' : 'Tax'}
                  value={formatCurrency(selectedQuotation.tax)}
                  icon={<DollarSign className="h-5 w-5 text-gray-500" />}
                />
              )}
              <DetailRow
                label={isBangla ? 'মোট পরিমাণ' : 'Total Amount'}
                value={
                  <span className="text-xl font-bold text-emerald-600">
                    {formatCurrency(selectedQuotation.total)}
                  </span>
                }
                icon={<DollarSign className="h-5 w-5 text-emerald-600" />}
              />
              {selectedQuotation.notes && (
                <DetailRow
                  label={isBangla ? 'নোট' : 'Notes'}
                  value={selectedQuotation.notes}
                  icon={<FileText className="h-5 w-5 text-gray-500" />}
                />
              )}
            </DetailSection>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <Button className="flex-1">
                <Printer className="h-4 w-4 mr-2" />
                <span className="whitespace-nowrap">{isBangla ? 'প্রিন্ট' : 'Print'}</span>
              </Button>
              <Button variant="outline" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                <span className="whitespace-nowrap">{isBangla ? 'শেয়ার' : 'Share'}</span>
              </Button>
            </div>
          </>
        )}
      </DetailModal>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className='w-[400px] sm:w-[350px]'>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isBangla ? 'কোটেশন মুছে ফেলুন' : 'Delete Quotation'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isBangla 
                ? `আপনি কি নিশ্চিত যে "${quotationToDelete?.quotationNo}" কোটেশনটি মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।`
                : `Are you sure you want to delete quotation "${quotationToDelete?.quotationNo}"? This action cannot be undone.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {isBangla ? 'বাতিল' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {isBangla ? 'মুছে ফেলুন' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Quotation Row Component
interface QuotationRowProps {
  quotation: Quotation;
  isBangla: boolean;
  index: number;
  onView: () => void;
  onEdit: () => void;
  onConvert: () => void;
  onDelete: () => void;
}

function QuotationRow({ quotation, isBangla, index, onView, onEdit, onConvert, onDelete }: QuotationRowProps) {
  const { formatCurrency } = useCurrency();
  const { formatDate } = useDateFormat();
  
  const statusConfig = QUOTATION_STATUS_CONFIG[quotation.status];

  const isExpired = new Date(quotation.validityDate) < new Date() && quotation.status === 'sent';
  
  return (
    <div 
      className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors cursor-pointer group stagger-item gap-4"
      style={{ animationDelay: `${index * 30}ms` }}
      onClick={onView}
    >
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className={cn(
          "h-12 w-12 rounded-xl flex items-center justify-center shrink-0",
          quotation.status === 'converted' ? 'bg-indigo-subtle' :
          quotation.status === 'accepted' ? 'bg-success-subtle' :
          quotation.status === 'rejected' ? 'bg-destructive-subtle' :
          'bg-primary-subtle'
        )}>
          <FileText className={cn(
            "h-5 w-5",
            quotation.status === 'converted' ? 'text-indigo' :
            quotation.status === 'accepted' ? 'text-success' :
            quotation.status === 'rejected' ? 'text-destructive' :
            'text-primary'
          )} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-foreground truncate">{quotation.quotationNo}</p>
            <Badge variant={statusConfig.variant} size="sm" className="whitespace-nowrap">
              {isBangla ? statusConfig.labelBn : statusConfig.label}
            </Badge>
            {isExpired && (
              <Badge variant="destructive" size="sm" className="whitespace-nowrap">
                {isBangla ? 'মেয়াদ শেষ' : 'Expired'}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5 whitespace-nowrap">
            {quotation.partyName || (isBangla ? 'সাধারণ গ্রাহক' : 'Walk-in customer')}
            {' • '}
            {quotation.items.length} {isBangla ? 'পণ্য' : 'items'}
            {' • '}
            {isBangla ? 'তারিখ' : 'Date'}: {formatDate(quotation.quotationDate)}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 whitespace-nowrap">
            {isBangla ? 'মেয়াদ' : 'Valid until'}: {formatDate(quotation.validityDate)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <div className="text-right min-w-0">
          <p className="font-bold text-foreground text-lg truncate">
            {formatCurrency(quotation.total)}
          </p>
          <div className="flex items-center gap-2 justify-end flex-wrap">
            {quotation.discount > 0 && (
              <span className="text-xs text-primary whitespace-nowrap">
                {isBangla ? 'ছাড়' : 'Discount'}: {formatCurrency(quotation.discount)}
              </span>
            )}
            {quotation.convertedToSaleId && (
              <span className="text-xs text-indigo whitespace-nowrap">
                {isBangla ? 'বিক্রিতে রূপান্তরিত' : 'Converted to sale'}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 transition-opacity shrink-0">
          <Button variant="ghost" size="icon-sm" onClick={(e) => { e.stopPropagation(); onView(); }}>
            <Eye className="h-4 w-4" />
          </Button>
          {(quotation.status === 'draft' || quotation.status === 'sent') && (
            <Button variant="ghost" size="icon-sm" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {quotation.status === 'accepted' && (
            <Button variant="ghost" size="icon-sm" onClick={(e) => { e.stopPropagation(); onConvert(); }} title={isBangla ? 'বিক্রিতে রূপান্তর' : 'Convert to Sale'}>
              <ShoppingCart className="h-4 w-4 text-emerald" />
            </Button>
          )}
          {quotation.status === 'draft' && (
            <Button variant="ghost" size="icon-sm" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
