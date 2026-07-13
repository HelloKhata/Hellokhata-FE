
'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Users, Check, X, User, Building2, ArrowLeft, Trash2, Loader2 } from 'lucide-react';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useUser } from '@/stores';
import { useParty, useUpdateParty, useDeleteParty } from '@/hooks/api/useParties';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface EditPartyPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPartyPage({ params }: EditPartyPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { t, isBangla } = useAppTranslation();
  const user = useUser();

  const { data: partyResponse, isLoading } = useParty(id);
  const party = partyResponse?.data;
  const { mutate: updateParty, isPending: isUpdating } = useUpdateParty();
  const { mutate: deleteParty, isPending: isDeleting } = useDeleteParty();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    type: 'customer' as 'customer' | 'supplier' | 'both',
    openingBalance: '0',
    balanceDirection: 'receive' as 'receive' | 'give',
    creditLimit: '',
    notes: '',
  });

  // Pre-fill form when party data loads
  useEffect(() => {
    if (!party) return;

    setFormData({
      name: party.name ?? '',
      phone: party.phone ?? '',
      email: party.email ?? '',
      address: party.address ?? '',
      type: party.type ?? 'customer',
      openingBalance: party.openingBalance != null ? String(Math.abs(party.openingBalance)) : '0',
      balanceDirection: (party.balanceDirection as 'receive' | 'give') ?? 'receive',
      creditLimit: party.creditLimit != null ? String(party.creditLimit) : '',
      notes: party.notes ?? '',
    });
  }, [party?.id]);


  const updateForm = (key: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error(isBangla ? 'নাম প্রয়োজন' : 'Name is required');
      return;
    }

    const partyData = {
      name: formData.name,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
      address: formData.address || undefined,
      type: formData.type,
      branchId: user?.branchId || '',
      openingBalance: (parseFloat(formData.openingBalance) || 0) * (formData.balanceDirection === 'give' ? -1 : 1),
      balanceDirection: formData.balanceDirection,
      creditLimit: formData.creditLimit ? parseFloat(formData.creditLimit) : undefined,
      notes: formData.notes || undefined,
    };

    updateParty({ id, data: partyData }, {
      onSuccess: () => {
        toast.success(isBangla ? 'পার্টি আপডেট হয়েছে!' : 'Party updated successfully!');
        router.push('/parties');
      },
    });
  };

  const handleDelete = () => {
    deleteParty(id, {
      onSuccess: () => {
        toast.success(isBangla ? 'পার্টি মুছে ফেলা হয়েছে!' : 'Party deleted successfully!');
        router.push('/parties');
      },
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // Not found state
  if (!party) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Users className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium">{isBangla ? 'পার্টি পাওয়া যায়নি' : 'Party not found'}</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/parties')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {isBangla ? 'ফিরে যান' : 'Go Back'}
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Centered Page Container */}
      <div className="flex justify-center">
        <div className="w-full" style={{ maxWidth: '700px' }}>

          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 mb-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">{isBangla ? 'পেছনে' : 'Back'}</span>
          </button>

          {/* Page Title */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 mb-1">
                <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">
                  {isBangla ? 'পার্টি সম্পাদনা' : 'Edit Party'}
                </h1>
              </div>

              {/* Delete Button */}
              <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isBangla ? 'মুছুন' : 'Delete'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className='max-w-[350px]'>
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
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-2" />
                      )}
                      {isBangla ? 'মুছুন' : 'Delete'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {isBangla ? 'পার্টির তথ্য পরিবর্তন করুন' : 'Modify party details'}
            </p>
          </div>

          {/* Form Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {isBangla ? 'পার্টির তথ্য' : 'Party Information'}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Party Type */}
              <div>
                <Label className="mb-2 block">
                  {isBangla ? 'ধরন' : 'Type'}
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'customer', icon: User, label: isBangla ? 'গ্রাহক' : 'Customer' },
                    { value: 'supplier', icon: Building2, label: isBangla ? 'সরবরাহকারী' : 'Supplier' },
                  ].map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => updateForm('type', type.value)}
                      className={cn(
                        'flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all',
                        formData.type === type.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-transparent text-muted-foreground hover:border-primary/50'
                      )}
                    >
                      {type.icon && <type.icon className="h-4 w-4" />}
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <Label className="mb-2 block">
                  {isBangla ? 'নাম' : 'Name'} <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) => updateForm('name', e.target.value)}
                  placeholder={isBangla ? 'পূর্ণ নাম লিখুন' : 'Enter full name'}
                  className="h-11"
                />
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">
                    {isBangla ? 'ফোন' : 'Phone'}
                  </Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => updateForm('phone', e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="h-11"
                  />
                </div>
                <div>
                  <Label className="mb-2 block">
                    {isBangla ? 'ইমেইল' : 'Email'}
                  </Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateForm('email', e.target.value)}
                    placeholder="email@example.com"
                    className="h-11"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <Label className="mb-2 block">
                  {isBangla ? 'ঠিকানা' : 'Address'}
                </Label>
                <Input
                  value={formData.address}
                  onChange={(e) => updateForm('address', e.target.value)}
                  placeholder={isBangla ? 'ঠিকানা লিখুন' : 'Enter address'}
                  className="h-11"
                />
              </div>

              {/* Opening Balance */}
              <div>
                <Label className="mb-2 block">
                  {isBangla ? 'ওপেনিং ব্যালেন্স (৳)' : 'Opening Balance (৳)'}
                </Label>
                <Input
                  type="number"
                  value={formData.openingBalance}
                  onChange={(e) => updateForm('openingBalance', e.target.value)}
                  placeholder="0"
                  className="h-11"
                />
              </div>

              {/* Balance Direction Toggle (To Receive / To Give) */}
              <div>
                <Label className="mb-2 block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {isBangla ? 'ব্যালেন্সের ধরন' : 'Balance Direction'}
                </Label>
                <div className="flex gap-2">
                  {[
                    { value: 'receive', label: isBangla ? 'পাওনা (To Receive)' : 'To Receive' },
                    { value: 'give', label: isBangla ? 'দেনা (To Give)' : 'To Give' },
                  ].map((dir) => (
                    <button
                      key={dir.value}
                      type="button"
                      onClick={() => updateForm('balanceDirection', dir.value)}
                      className={cn(
                        'flex items-center justify-center gap-2 px-3 py-1.5 rounded-md border text-xs font-medium transition-all cursor-pointer',
                        formData.balanceDirection === dir.value
                          ? dir.value === 'receive'
                            ? 'border-primary/50 bg-primary/10 text-primary font-bold'
                            : 'border-red-500/50 bg-red-500/10 text-red-500 font-bold'
                          : 'border-border bg-transparent text-muted-foreground hover:border-primary/50'
                      )}
                    >
                      {dir.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Credit Limit */}
              <div className="p-4 rounded-lg bg-muted/30 border">
                <Label className="mb-2 block">
                  {isBangla ? 'ক্রেডিট লিমিট (৳)' : 'Credit Limit (৳)'}
                </Label>
                <Input
                  type="number"
                  value={formData.creditLimit}
                  onChange={(e) => updateForm('creditLimit', e.target.value)}
                  placeholder="0"
                  className="h-11"
                />
              </div>

              {/* Notes */}
              <div>
                <Label className="mb-2 block">
                  {isBangla ? 'নোট' : 'Notes'}
                </Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => updateForm('notes', e.target.value)}
                  placeholder={isBangla ? 'অতিরিক্ত তথ্য...' : 'Additional notes...'}
                  rows={2}
                />
              </div>
            </CardContent>

            <CardFooter className="flex gap-3">
              <Button
                className="flex-1 h-11"
                onClick={handleSubmit}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isBangla ? 'আপডেট হচ্ছে...' : 'Updating...'}
                  </span>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    {isBangla ? 'আপডেট করুন' : 'Update'}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-11"
                onClick={() => router.back()}
              >
                <X className="h-4 w-4 mr-2" />
                {isBangla ? 'বাতিল' : 'Cancel'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
