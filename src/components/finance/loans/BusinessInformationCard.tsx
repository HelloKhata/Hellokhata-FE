"use client";

import React, { useState } from "react";
import { BusinessInfo } from "@/types/loan";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Building2, User, Phone, MapPin, Tag, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BusinessInformationCardProps {
  initialInfo: BusinessInfo;
  onContinue: (updatedInfo: BusinessInfo) => void;
  isBangla?: boolean;
}

export function BusinessInformationCard({
  initialInfo,
  onContinue,
  isBangla = false,
}: BusinessInformationCardProps) {
  const [formData, setFormData] = useState<BusinessInfo>(initialInfo);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.businessName.trim()) {
      newErrors.businessName = isBangla ? "প্রতিষ্ঠানের নাম আবশ্যক" : "Business name is required";
    }
    if (!formData.ownerName.trim()) {
      newErrors.ownerName = isBangla ? "মালিকের নাম আবশ্যক" : "Owner name is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onContinue(formData);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-4 shadow-2xs">
      <div className="border-b border-border/80 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            <span>{isBangla ? "ধাপ ১: প্রতিষ্ঠান ও মালিকের তথ্য" : "Step 1: Confirm Business Information"}</span>
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {isBangla
              ? "হ্যালো খাতার প্রোফাইল অনুযায়ী তথ্যটি যাচাই করুন।"
              : "Review your business info pre-filled from your HelloKhata account."}
          </p>
        </div>
        <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full border border-primary/20">
          Step 1 / 5
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Business Name */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              {isBangla ? "প্রতিষ্ঠানের নাম *" : "Business Name *"}
            </Label>
            <Input
              value={formData.businessName}
              onChange={(e) => {
                setFormData({ ...formData, businessName: e.target.value });
                if (errors.businessName) setErrors({ ...errors, businessName: "" });
              }}
              className={cn("h-9 bg-background/50 text-xs border-input", errors.businessName && "border-destructive")}
            />
            {errors.businessName && (
              <p className="text-[10px] text-destructive font-medium">{errors.businessName}</p>
            )}
          </div>

          {/* Owner Name */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              {isBangla ? "মালিকের নাম *" : "Owner Name *"}
            </Label>
            <Input
              value={formData.ownerName}
              onChange={(e) => {
                setFormData({ ...formData, ownerName: e.target.value });
                if (errors.ownerName) setErrors({ ...errors, ownerName: "" });
              }}
              className={cn("h-9 bg-background/50 text-xs border-input", errors.ownerName && "border-destructive")}
            />
            {errors.ownerName && (
              <p className="text-[10px] text-destructive font-medium">{errors.ownerName}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              {isBangla ? "মোবাইল নম্বর *" : "Phone Number *"}
            </Label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="h-9 bg-background/50 text-xs border-input font-mono"
            />
          </div>

          {/* Business Type */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              {isBangla ? "ব্যবসার ধরন" : "Business Type"}
            </Label>
            <Input
              value={formData.businessType}
              onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
              placeholder="e.g. Retail Store / Electronics"
              className="h-9 bg-background/50 text-xs border-input"
            />
          </div>
        </div>

        {/* Business Address */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">
            {isBangla ? "প্রতিষ্ঠানের ঠিকানা" : "Business Address"}
          </Label>
          <Input
            value={formData.businessAddress}
            onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
            placeholder="Address..."
            className="h-9 bg-background/50 text-xs border-input"
          />
        </div>

        {/* Action */}
        <div className="flex justify-end pt-2 border-t border-border/60">
          <Button
            type="submit"
            className="h-9 px-4 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 cursor-pointer rounded-lg shadow-xs"
          >
            <span>{isBangla ? "পরবর্তী ধাপ (Continue)" : "Continue"}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
