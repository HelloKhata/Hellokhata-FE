"use client";

import React, { useRef, useState } from "react";
import { Camera, Image as ImageIcon, X, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/premium";

interface PhotoUploaderProps {
  photoUrl?: string;
  onPhotoChange: (url: string | undefined) => void;
  isBangla?: boolean;
}

export function PhotoUploader({
  photoUrl,
  onPhotoChange,
  isBangla = false,
}: PhotoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onPhotoChange(url);
    }
  };

  const handleRemovePhoto = () => {
    onPhotoChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
        {isBangla ? "মেমো / রসিদ ছবি (Photo Attachment)" : "Photo Attachment"}
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {photoUrl ? (
        <div className="relative rounded-2xl border border-border bg-card p-2 w-fit">
          <img
            src={photoUrl}
            alt="Voucher Preview"
            className="h-24 w-32 object-cover rounded-xl border border-border/40"
          />
          <button
            type="button"
            onClick={handleRemovePhoto}
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-xl text-xs font-medium cursor-pointer"
          >
            <Camera className="h-3.5 w-3.5 mr-1.5 text-primary" />
            {isBangla ? "ছবি তুলুন / ফাইল আপলোড" : "Camera Capture / Upload Photo"}
          </Button>
        </div>
      )}
    </div>
  );
}
