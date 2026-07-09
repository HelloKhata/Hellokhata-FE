// Hello Khata - Add Party Modal
// Modal to create a new customer or supplier

"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Users, Check, X, User, Building2, Loader2 } from "lucide-react";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useUser } from "@/stores";
import { useCreateParty } from "@/hooks/api/useParties";

interface AddPartyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddPartyModal({ isOpen, onClose }: AddPartyModalProps) {
  const { t, isBangla } = useAppTranslation();
  const { mutate, isPending } = useCreateParty();
  const user = useUser();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    type: 'customer' as 'customer' | 'supplier' | 'both',
    openingBalance: '0',
    balanceType: 'receive' as 'receive' | 'give',
    creditLimit: '',
    notes: '',
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        phone: '',
        email: '',
        address: '',
        type: 'customer',
        openingBalance: '0',
        balanceType: 'receive',
        creditLimit: '',
        notes: '',
      });
    }
  }, [isOpen]);

  const updateForm = (key: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error(isBangla ? 'নাম প্রয়োজন' : 'Name is required');
      return;
    }

    const partyItem = {
      name: formData.name,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
      address: formData.address || undefined,
      type: formData.type,
      branchId: user?.branchId || '',
      openingBalance: (parseFloat(formData.openingBalance) || 0) * (formData.balanceType === 'give' ? -1 : 1),
      creditLimit: formData.creditLimit ? parseFloat(formData.creditLimit) : undefined,
      notes: formData.notes || undefined,
    };

    mutate(partyItem, {
      onSuccess: () => {
        toast.success(isBangla ? 'পার্টি তৈরি হয়েছে!' : 'Party created successfully!');
        onClose();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">
                {isBangla ? 'নতুন পার্টি যোগ' : 'Add Party'}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                {isBangla ? 'নতুন গ্রাহক বা সরবরাহকারী যোগ করুন' : 'Add a new customer or supplier'}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 mt-2">
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

          {/* Opening Balance & Credit Limit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div>
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
          </div>

          {/* Balance Direction Toggle */}
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
                  onClick={() => updateForm('balanceType', dir.value)}
                  className={cn(
                    'flex items-center justify-center gap-2 px-3 py-1.5 rounded-md border text-xs font-medium transition-all cursor-pointer',
                    formData.balanceType === dir.value
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
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 mt-4">
          <Button
            className="flex-1 h-11"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {isBangla ? 'সংরক্ষণ হচ্ছে...' : 'Saving...'}
              </span>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                {isBangla ? 'সংরক্ষণ করুন' : 'Save'}
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-11"
            onClick={onClose}
          >
            <X className="h-4 w-4 mr-2" />
            {isBangla ? 'বাতিল' : 'Cancel'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
