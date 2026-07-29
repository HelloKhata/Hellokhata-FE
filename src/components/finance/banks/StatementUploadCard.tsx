"use client";

import React, { useState } from "react";
import { UploadCloud, FileText, CheckCircle2, Loader2, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface StatementUploadCardProps {
  onFileUploaded: (fileName: string) => void;
  isBangla?: boolean;
}

export function StatementUploadCard({
  onFileUploaded,
  isBangla = false,
}: StatementUploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const simulateUpload = (fileName: string) => {
    setIsUploading(true);
    setUploadProgress(15);
    setUploadedFile(null);

    const timer1 = setTimeout(() => setUploadProgress(55), 200);
    const timer2 = setTimeout(() => setUploadProgress(90), 400);
    const timer3 = setTimeout(() => {
      setUploadProgress(100);
      setIsUploading(false);
      setUploadedFile(fileName);
      onFileUploaded(fileName);
      toast.success(
        isBangla
          ? `ফাইল ${fileName} সফলভাবে আপলোড হয়েছে`
          : `Bank statement ${fileName} imported successfully`
      );
    }, 600);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      simulateUpload(file.name);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-3.5 shadow-2xs">
      <div className="flex items-center justify-between border-b border-border/80 pb-2.5">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
            <FileUp className="h-4 w-4 text-primary" />
            <span>{isBangla ? "ব্যাংক স্টেটমেন্ট ইমপোর্ট করুন (CSV Upload)" : "Import Statement (CSV)"}</span>
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {isBangla
              ? "আপনার অনলাইন ব্যাংক বা ওয়ালেটের CSV স্টেটমেন্ট ইমপোর্ট করুন।"
              : "Upload bank or mobile wallet CSV statement to reconcile against recorded transactions."}
          </p>
        </div>
      </div>

      {/* Drag & Drop Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) simulateUpload(file.name);
        }}
        className={cn(
          "border-2 border-dashed rounded-xl p-6 text-center transition-all flex flex-col items-center justify-center space-y-3 cursor-pointer",
          isDragging
            ? "border-primary bg-primary/10"
            : "border-border/80 bg-background/50 hover:border-primary/50 hover:bg-muted/15"
        )}
      >
        <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          <UploadCloud className="h-6 w-6" />
        </div>

        <div className="space-y-1">
          <p className="text-xs font-bold text-foreground">
            {isBangla ? "CSV ফাইল এখানে ড্রাগ করুন অথবা ব্রাউজ করুন" : "Drag & drop CSV statement here, or browse"}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Supported formats: <strong className="text-foreground font-mono">CSV, XLSX</strong> (Max 10MB)
          </p>
        </div>

        <div className="relative">
          <input
            type="file"
            accept=".csv, .xlsx"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 text-xs font-semibold px-4 border-input bg-background cursor-pointer"
          >
            {isBangla ? "ফাইল বেছে নিন" : "Browse Files"}
          </Button>
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="p-3 bg-muted/20 border border-border/60 rounded-lg space-y-1.5">
          <div className="flex justify-between text-xs font-mono font-semibold text-foreground">
            <span className="flex items-center gap-1.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              <span>Importing statement lines...</span>
            </span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-1.5" />
        </div>
      )}

      {/* Success Badge */}
      {uploadedFile && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-between text-xs">
          <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2 font-mono">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Imported: {uploadedFile}</span>
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">
            Ready for mapping
          </span>
        </div>
      )}
    </div>
  );
}
