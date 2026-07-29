"use client";

import React, { useState } from "react";
import { KYCDocuments } from "@/types/loan";
import { Button } from "@/components/ui/button";
import { FileText, Camera, Upload, Check, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface KYCUploaderProps {
  initialKyc: KYCDocuments;
  onContinue: (kyc: KYCDocuments) => void;
  onBack: () => void;
  isBangla?: boolean;
}

export function KYCUploader({
  initialKyc,
  onContinue,
  onBack,
  isBangla = false,
}: KYCUploaderProps) {
  const [kyc, setKyc] = useState<KYCDocuments>(initialKyc);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const simulateUpload = (field: keyof KYCDocuments, name: string) => {
    setUploadingField(field as string);
    setTimeout(() => {
      setKyc((prev) => ({
        ...prev,
        [field]: "/images/document-preview.png",
        [`${field}Name`]: name,
      }));
      setUploadingField(null);
      toast.success(isBangla ? "ডকুমেন্ট আপলোড সফল হয়েছে" : "Document uploaded successfully");
    }, 600);
  };

  const removeDoc = (field: keyof KYCDocuments) => {
    setKyc((prev) => {
      const copy = { ...prev };
      delete copy[field];
      if (field === "tradeLicenseUrl") delete copy.tradeLicenseName;
      if (field === "nidFrontUrl") delete copy.nidFrontName;
      if (field === "nidBackUrl") delete copy.nidBackName;
      return copy;
    });
  };

  const handleNext = () => {
    if (!kyc.tradeLicenseName && !kyc.nidFrontName) {
      toast.error(isBangla ? "অন্তত ট্রেড লাইসেন্স বা এনআইডি আপলোড করুন" : "Upload Trade License or National ID to continue");
      return;
    }
    onContinue(kyc);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-4 shadow-2xs">
      <div className="border-b border-border/80 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <span>{isBangla ? "ধাপ ২: কেওয়াইসি কাগজপত্র আপলোড (KYC Upload)" : "Step 2: Complete KYC"}</span>
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {isBangla
              ? "ট্রেড লাইসেন্স ও জাতীয় পরিচয়পত্রের ছবি তুলুন বা ফাইল আপলোড করুন।"
              : "Upload photos of your Trade License and National ID (NID)."}
          </p>
        </div>
        <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full border border-primary/20">
          Step 2 / 5
        </span>
      </div>

      <div className="space-y-4 text-xs">
        {/* Document 1: Trade License */}
        <div className="p-3.5 bg-background/50 border border-border/70 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <FileText className="h-4 w-4 text-amber-500" />
              <span>{isBangla ? "ট্রেড লাইসেন্স (Trade License) *" : "Trade License *"}</span>
            </div>
            {kyc.tradeLicenseName && (
              <span className="text-[10px] bg-emerald-500/10 text-emerald-600 font-bold px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                <Check className="h-3 w-3" /> Uploaded
              </span>
            )}
          </div>

          {kyc.tradeLicenseName ? (
            <div className="p-2.5 bg-muted/30 border border-border/60 rounded-lg flex items-center justify-between text-xs">
              <span className="font-mono text-foreground font-semibold truncate max-w-[200px]">
                📄 {kyc.tradeLicenseName}
              </span>
              <button
                type="button"
                onClick={() => removeDoc("tradeLicenseUrl")}
                className="text-muted-foreground hover:text-rose-500 p-1 transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploadingField === "tradeLicenseUrl"}
                onClick={() => simulateUpload("tradeLicenseUrl", "Trade_License_2026.jpg")}
                className="flex-1 h-9 text-xs gap-1.5 cursor-pointer bg-background/50"
              >
                <Upload className="h-3.5 w-3.5 text-primary" />
                <span>{isBangla ? "ফাইল আপলোড" : "Upload File"}</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploadingField === "tradeLicenseUrl"}
                onClick={() => simulateUpload("tradeLicenseUrl", "Camera_License_Capture.jpg")}
                className="flex-1 h-9 text-xs gap-1.5 cursor-pointer bg-background/50"
              >
                <Camera className="h-3.5 w-3.5 text-primary" />
                <span>{isBangla ? "ক্যামেরা ছবি" : "Camera Capture"}</span>
              </Button>
            </div>
          )}
        </div>

        {/* Document 2: National ID (NID Front) */}
        <div className="p-3.5 bg-background/50 border border-border/70 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <FileText className="h-4 w-4 text-blue-500" />
              <span>{isBangla ? "এনআইডি ফ্রন্ট সাইড (NID Front) *" : "National ID (NID) *"}</span>
            </div>
            {kyc.nidFrontName && (
              <span className="text-[10px] bg-emerald-500/10 text-emerald-600 font-bold px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                <Check className="h-3 w-3" /> Uploaded
              </span>
            )}
          </div>

          {kyc.nidFrontName ? (
            <div className="p-2.5 bg-muted/30 border border-border/60 rounded-lg flex items-center justify-between text-xs">
              <span className="font-mono text-foreground font-semibold truncate max-w-[200px]">
                🪪 {kyc.nidFrontName}
              </span>
              <button
                type="button"
                onClick={() => removeDoc("nidFrontUrl")}
                className="text-muted-foreground hover:text-rose-500 p-1 transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploadingField === "nidFrontUrl"}
                onClick={() => simulateUpload("nidFrontUrl", "NID_Front_Card.jpg")}
                className="flex-1 h-9 text-xs gap-1.5 cursor-pointer bg-background/50"
              >
                <Upload className="h-3.5 w-3.5 text-primary" />
                <span>{isBangla ? "ফাইল আপলোড" : "Upload File"}</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploadingField === "nidFrontUrl"}
                onClick={() => simulateUpload("nidFrontUrl", "Camera_NID_Capture.jpg")}
                className="flex-1 h-9 text-xs gap-1.5 cursor-pointer bg-background/50"
              >
                <Camera className="h-3.5 w-3.5 text-primary" />
                <span>{isBangla ? "ক্যামেরা ছবি" : "Camera Capture"}</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Stepper Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-border/60">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-9 px-3 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer rounded-lg"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />
          <span>{isBangla ? "পেছনে" : "Back"}</span>
        </Button>

        <Button
          type="button"
          onClick={handleNext}
          className="h-9 px-4 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 cursor-pointer rounded-lg shadow-xs"
        >
          <span>{isBangla ? "পরবর্তী ধাপ (Continue)" : "Continue"}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
