'use client'
import { SaveButton, SectionHeader, SettingsCard, SettingsInput } from '@/components/settings/SettingsComponent'
import { useUpdateBusiness } from '@/hooks/api/useSettings'
import { toast } from '@/hooks/use-toast'
import { useAppTranslation } from '@/hooks/useAppTranslation'
import { Building, Building2, MapPin, Phone, Mail, Briefcase, Hash, AlignLeft, Maximize, Languages } from 'lucide-react'
import React, { useState } from 'react'

const BusinessSettingsPage = () => {
  const { t, isBangla, changeLanguage } = useAppTranslation();

  // const 
  // Business form state
  const [businessForm, setBusinessForm] = useState({
    name: '',
    nameBn: '',
    phone: '',
    email: '',
    address: '',
    plan: '',
    invoicePrefix: '',
    invoiceFooter: '',
    invoicePaperSize: '',
    invoiceLanguage: ''
  });

  // const =
  const { mutate: savingBusiness, isPending: isSavingBusiness } = useUpdateBusiness()
  const handleSaveBusiness = async () => {
    // if (!business?.id) return;
    savingBusiness(businessForm, {
      onSuccess: () => {
        toast({
          title: t('common.success'),
          description: t('business.updated'),
        });
      },
      onError: () => {
        toast({
          title: t('common.error'),
          description: t('business.updateFailed'),
        });
      }
    })

  };
  return (
    <SettingsCard>
      <SectionHeader
        icon={Building2}
        title={isBangla ? 'ব্যবসার প্রোফাইল' : 'Business Profile'}
        description={isBangla ? 'আপনার ব্যবসার তথ্য পরিচালনা করুন' : 'Manage your business information'}
        iconColor="indigo"
      />

      <div className="w-full space-y-4">
        <SettingsInput
          label={isBangla ? 'ব্যবসার নাম' : 'Business Name'}
          icon={Building}
          value={businessForm.name}
          onChange={(v) => setBusinessForm({ ...businessForm, name: v })}
          placeholder={isBangla ? 'ব্যবসার নাম লিখুন' : 'Enter business name'}
        />
        <SettingsInput
          label={isBangla ? 'ব্যবসার নাম (বাংলা)' : 'Business Name (Bangla)'}
          icon={Building}
          value={businessForm.nameBn}
          onChange={(v) => setBusinessForm({ ...businessForm, nameBn: v })}
          placeholder={isBangla ? 'বাংলায় ব্যবসার নাম লিখুন' : 'Enter business name in Bangla'}
        />
        <SettingsInput
          label={isBangla ? 'ফোন' : 'Phone'}
          icon={Phone}
          value={businessForm.phone}
          onChange={(v) => setBusinessForm({ ...businessForm, phone: v })}
          placeholder="01XXXXXXXXX"
        />
        <SettingsInput
          label={isBangla ? 'ইমেইল' : 'Email'}
          icon={Mail}
          value={businessForm.email}
          onChange={(v) => setBusinessForm({ ...businessForm, email: v })}
          placeholder={isBangla ? 'ইমেইল ঠিকানা লিখুন' : 'Enter email address'}
        />
        <SettingsInput
          label={isBangla ? 'ঠিকানা' : 'Address'}
          icon={MapPin}
          value={businessForm.address}
          onChange={(v) => setBusinessForm({ ...businessForm, address: v })}
          placeholder={isBangla ? 'ঠিকানা লিখুন' : 'Enter address'}
        />
        <SettingsInput
          label={isBangla ? 'প্ল্যান' : 'Plan'}
          icon={Briefcase}
          value={businessForm.plan}
          onChange={(v) => setBusinessForm({ ...businessForm, plan: v })}
          placeholder={isBangla ? 'প্ল্যান' : 'Enter plan'}
        />
        <SettingsInput
          label={isBangla ? 'ইনভয়েস প্রিফিক্স' : 'Invoice Prefix'}
          icon={Hash}
          value={businessForm.invoicePrefix}
          onChange={(v) => setBusinessForm({ ...businessForm, invoicePrefix: v })}
          placeholder="INV"
        />
        <SettingsInput
          label={isBangla ? 'ইনভয়েস ফুটার' : 'Invoice Footer'}
          icon={AlignLeft}
          value={businessForm.invoiceFooter}
          onChange={(v) => setBusinessForm({ ...businessForm, invoiceFooter: v })}
          placeholder={isBangla ? 'ধন্যবাদ!' : 'Thank you!'}
        />
        <SettingsInput
          label={isBangla ? 'ইনভয়েস কাগজের আকার' : 'Invoice Paper Size'}
          icon={Maximize}
          value={businessForm.invoicePaperSize}
          onChange={(v) => setBusinessForm({ ...businessForm, invoicePaperSize: v })}
          placeholder="A4"
        />
        <SettingsInput
          label={isBangla ? 'ইনভয়েস ভাষা' : 'Invoice Language'}
          icon={Languages}
          value={businessForm.invoiceLanguage}
          onChange={(v) => setBusinessForm({ ...businessForm, invoiceLanguage: v })}
          placeholder="bn / en"
        />
      </div>

      <SaveButton
        onClick={handleSaveBusiness}
        isLoading={isSavingBusiness}
        label={t('common.save')}
      />
    </SettingsCard>
  )
}

export default BusinessSettingsPage
