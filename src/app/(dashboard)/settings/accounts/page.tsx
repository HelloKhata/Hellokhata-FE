"use client";

import React, { useRef, useState } from "react";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { toast } from "@/hooks/use-toast";
import { useSessionStore } from "@/stores/sessionStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Building2,
  Loader2,
  Save,
  Mail,
  Phone,
  MapPin,
  FileText,
  Camera,
  Trash2,
} from "lucide-react";

import { Button, Input } from "@/components/ui/premium";
import { Label } from "@/components/ui/label";

export default function AccountSettingsPage() {
  const { isBangla } = useAppTranslation();
  const { user, business } = useSessionStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(
    user?.image || null,
  );
  // 1. Personal Profile State
  const [personalForm, setPersonalForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    image: user?.image || null,
  });
  const [isSavingPersonal, setIsSavingPersonal] = useState(false);

  // 2. Business Profile State
  const [businessForm, setBusinessForm] = useState({
    name: business?.name || "",
    nameBn: business?.nameBn || "",
    phone: business?.phone || "",
    address: business?.address || "",
    taxId: business?.taxId || "",
  });
  const [isSavingBusiness, setIsSavingBusiness] = useState(false);

  // Handlers
  const handleSavePersonal = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingPersonal(true);

    try {
      toast({
        title: isBangla ? "সফলভাবে আপডেট করা হয়েছে" : "Profile Updated",
        description: isBangla
          ? "ব্যক্তিগত তথ্য সফলভাবে আপডেট হয়েছে"
          : "Personal information saved successfully",
      });
    } catch (error: any) {
      toast({
        title: isBangla ? "ত্রুটি ঘটেছে" : "Error",
        description:
          error?.message ||
          (isBangla ? "কিছু একটা ভুল হয়েছে" : "Something went wrong"),
        variant: "destructive",
      });
    } finally {
      setIsSavingPersonal(false);
    }
  };

  const handleSaveBusiness = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingBusiness(true);

    try {
      toast({
        title: isBangla ? "সফলভাবে আপডেট করা হয়েছে" : "Business Updated",
        description: isBangla
          ? "ব্যবসার তথ্য সফলভাবে আপডেট হয়েছে"
          : "Business details saved successfully",
      });
    } catch (error: any) {
      toast({
        title: isBangla ? "ত্রুটি ঘটেছে" : "Error",
        description:
          error?.message ||
          (isBangla ? "কিছু একটা ভুল হয়েছে" : "Something went wrong"),
        variant: "destructive",
      });
    } finally {
      setIsSavingBusiness(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setPersonalForm((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setPersonalForm((prev) => ({ ...prev, image: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6 mx-auto pb-10">
      {/* SECTION 1: PERSONAL PROFILE */}
      <form
        onSubmit={handleSavePersonal}
        className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-6"
      >
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        {/* Header with Integrated Interactive Avatar */}
        <div className="flex items-center justify-between pb-4 border-b border-border/40">
          <div className="flex items-center gap-4">
            {/* Interactive Avatar with Hover Overlay */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative group cursor-pointer h-20 w-20 rounded-full overflow-hidden border-2 border-border/80 shadow-sm shrink-0 transition-all hover:border-primary/50"
              title={
                isBangla ? "ছবি আপলোড/পরিবর্তন করুন" : "Upload or change photo"
              }
            >
              <Avatar className="h-full w-full rounded-full">
                <AvatarImage
                  src={previewImage || ""}
                  alt="Profile"
                  className="object-cover h-full w-full rounded-full"
                />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl rounded-full flex items-center justify-center">
                  {personalForm.name
                    ? personalForm.name.slice(0, 2).toUpperCase()
                    : "UI"}
                </AvatarFallback>
              </Avatar>

              {/* Hover Camera Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 backdrop-blur-[2px] rounded-full">
                <Camera className="h-5 w-5" />
                <span className="text-[10px] font-medium leading-none">
                  {isBangla ? "পরিবর্তন" : "Change"}
                </span>
              </div>
            </div>

            {/* Section Title & Subtitle */}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-foreground">
                  {isBangla ? "ব্যক্তিগত প্রোফাইল" : "Personal Profile"}
                </h2>
                {previewImage && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-xs text-destructive hover:underline flex items-center gap-0.5 ml-1"
                    title={isBangla ? "ছবি মুছে ফেলুন" : "Remove image"}
                  >
                    <Trash2 className="h-3 w-3" />
                    {isBangla ? "রিমুভ" : "Remove"}
                  </button>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isBangla
                  ? "আপনার ব্যক্তিগত তথ্য ও যোগাযোগের ঠিকানা"
                  : "Manage your personal identity details"}
              </p>
            </div>
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              {isBangla ? "পূর্ণ নাম" : "Full Name"}
            </Label>
            <Input
              type="text"
              value={personalForm.name}
              onChange={(e) =>
                setPersonalForm({ ...personalForm, name: e.target.value })
              }
              placeholder={isBangla ? "আপনার নাম লিখুন" : "Enter full name"}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              {isBangla ? "ইমেইল ঠিকানা" : "Email Address"}
            </Label>
            <Input
              type="email"
              value={personalForm.email}
              onChange={(e) =>
                setPersonalForm({ ...personalForm, email: e.target.value })
              }
              placeholder={isBangla ? "ইমেইল লিখুন" : "Enter email address"}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              {isBangla ? "ফোন নম্বর" : "Phone Number"}
            </Label>
            <Input
              type="text"
              value={personalForm.phone}
              onChange={(e) =>
                setPersonalForm({ ...personalForm, phone: e.target.value })
              }
              placeholder={isBangla ? "ফোন নম্বর লিখুন" : "Enter phone number"}
              className="h-10"
            />
          </div>
        </div>
      </form>

      {/* SECTION 2: BUSINESS PROFILE */}
      <form
        onSubmit={handleSaveBusiness}
        className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/40">
          <div className="flex items-center gap-4">
            {/* Section Title & Subtitle */}
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {isBangla ? "ব্যবসার প্রোফাইল" : "Business Profile"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {isBangla
                    ? "আপনার প্রতিষ্ঠানের সাধারণ তথ্য"
                    : "Manage business details and contact options"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              {isBangla ? "প্রতিষ্ঠানের নাম (ইংরেজি)" : "Business Name (EN)"}
            </Label>
            <Input
              type="text"
              value={businessForm.name}
              onChange={(e) =>
                setBusinessForm({ ...businessForm, name: e.target.value })
              }
              placeholder={
                isBangla ? "ইংরেজিতে ব্যবসার নাম" : "Business name in English"
              }
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              {isBangla ? "প্রতিষ্ঠানের নাম (বাংলা)" : "Business Name (BN)"}
            </Label>
            <Input
              type="text"
              value={businessForm.nameBn}
              onChange={(e) =>
                setBusinessForm({ ...businessForm, nameBn: e.target.value })
              }
              placeholder={
                isBangla ? "বাংলায় ব্যবসার নাম" : "Business name in Bangla"
              }
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              {isBangla ? "ব্যবসার ফোন" : "Business Phone"}
            </Label>
            <Input
              type="text"
              value={businessForm.phone}
              onChange={(e) =>
                setBusinessForm({ ...businessForm, phone: e.target.value })
              }
              placeholder={
                isBangla ? "ব্যবসার ফোন নম্বর" : "Business phone number"
              }
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              {isBangla ? "ট্যাক্স আইডেন্টিফায়ার" : "BIN / Tax Identification"}
            </Label>
            <Input
              type="text"
              value={businessForm.taxId}
              onChange={(e) =>
                setBusinessForm({ ...businessForm, taxId: e.target.value })
              }
              placeholder={
                isBangla ? "BIN / Tax ID লিখুন" : "Enter BIN or Tax ID"
              }
              className="h-10"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {isBangla ? "ঠিকানা" : "Address"}
            </Label>
            <Input
              type="text"
              value={businessForm.address}
              onChange={(e) =>
                setBusinessForm({ ...businessForm, address: e.target.value })
              }
              placeholder={
                isBangla
                  ? "ব্যবসার পূর্ণ ঠিকানা"
                  : "Enter full business address"
              }
              className="h-10"
            />
          </div>
        </div>
      </form>

      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          disabled={isSavingPersonal || isSavingBusiness}
          size="sm"
          className="rounded-xl bg-red-500 border border-red-600"
        >
          {isBangla ? "বাতিল করুন" : "Cancel"}
        </Button>
        <Button
          type="button"
          onClick={() => {
            handleSavePersonal();
            handleSaveBusiness();
          }}
          disabled={isSavingPersonal || isSavingBusiness}
          size="sm"
          className="rounded-xl"
        >
          {isSavingPersonal || isSavingBusiness ? (
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {isBangla ? "সংরক্ষণ করুন" : "Save"}
        </Button>
      </div>
    </div>
  );
}
