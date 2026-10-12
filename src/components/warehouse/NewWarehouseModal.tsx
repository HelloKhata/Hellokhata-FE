"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useCreateWarehouse } from "@/hooks/api/useWarehouse";

interface NewWarehouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  isBangla?: boolean;
}

export function NewWarehouseModal({
  isOpen,
  onClose,
  isBangla = false,
}: NewWarehouseModalProps) {
  const { mutate:createWarehouse, isPending:isCreating } = useCreateWarehouse();

  // Form State matching Warehouse List columns (Name, Code, Location, Manager, Status)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    location: "Dhaka",
    managerName: "",
    managerPhone: "",
    status: "ACTIVE",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        code: `WH-${Math.floor(100 + Math.random() * 900)}`,
        location: "Dhaka",
        managerName: "",
        managerPhone: "",
        status: "ACTIVE",
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleTextChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.name?.trim()) {
      errs.name = isBangla ? "ওয়্যারহাউসের নাম আবশ্যক" : "Warehouse Name is required";
    }
    if (!formData.code?.trim()) {
      errs.code = isBangla ? "ওয়্যারহাউস কোড আবশ্যক" : "Warehouse Code is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    createWarehouse(formData,{onSuccess:()=>{
      toast.success(isBangla ? "ওয়্যারহাউস সফলভাবে তৈরি করা হয়েছে" : "Warehouse created successfully");
      onClose()
    }})

  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-3xl max-h-[92vh] overflow-y-auto p-4 sm:p-6 bg-card border-border shadow-2xl rounded-2xl">
        <DialogHeader className="border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold text-foreground">
                {isBangla ? "নতুন ওয়্যারহাউস তৈরি করুন" : "Create New Warehouse"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {isBangla
                  ? "ওয়্যারহাউসের তথ্য পূরণ করুন।"
                  : "Enter warehouse details matching the warehouse list."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Warehouse Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                {isBangla ? "ওয়্যারহাউসের নাম *" : "Warehouse Name *"}
              </Label>
              <Input
                value={formData.name || ""}
                onChange={(e) => handleTextChange("name", e.target.value)}
                placeholder={isBangla ? "যেমন: ঢাকা সেন্ট্রাল ডিপো" : "e.g. Central Distribution Depot"}
                className={errors.name ? "border-destructive text-xs h-9" : "text-xs h-9"}
              />
              {errors.name && <p className="text-[10px] text-destructive font-medium">{errors.name}</p>}
            </div>

            {/* Warehouse Code */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                {isBangla ? "ওয়্যারহাউস কোড *" : "Warehouse Code *"}
              </Label>
              <Input
                value={formData.code || ""}
                onChange={(e) => handleTextChange("code", e.target.value.toUpperCase())}
                placeholder="WH-MAIN-01"
                className={errors.code ? "border-destructive text-xs h-9 font-mono" : "text-xs h-9 font-mono"}
              />
              {errors.code && <p className="text-[10px] text-destructive font-medium">{errors.code}</p>}
            </div>

          

            {/* City (Location) */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                {isBangla ? "লোকেশন (Location)" : "Location"}
              </Label>
              <Input
                value={formData.location || ""}
                onChange={(e) => handleTextChange("location", e.target.value)}
                placeholder="Plot 45, Sector 7, Uttara, Dhaka"
                className="text-xs h-9"
              />
            </div>

            {/* Manager Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                {isBangla ? "ম্যানেজার" : "Manager Name"}
              </Label>
              <Input
                value={formData.managerName || ""}
                onChange={(e) => handleTextChange("managerName", e.target.value)}
                placeholder={isBangla ? "ম্যানেজারের নাম" : "Manager Name"}
                className="text-xs h-9"
              />
            </div>

            {/* Manager Phone */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                {isBangla ? "ফোন নম্বর" : "Manager Phone"}
              </Label>
              <Input
                value={formData.managerPhone || ""}
                onChange={(e) => handleTextChange("managerPhone", e.target.value)}
                placeholder="+880 1711-000000"
                className="text-xs h-9 font-mono"
              />
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                {isBangla ? "স্ট্যাটাস" : "Status"}
              </Label>
              <Select
                value={formData.status}
                onValueChange={(val: any) => handleTextChange("status", val)}
              >
                <SelectTrigger className="h-9 text-xs bg-background/50 border-input w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE" className="text-xs">
                    {isBangla ? "সক্রিয় (Active)" : "Active"}
                  </SelectItem>
                  <SelectItem value="MAINTENANCE" className="text-xs">
                    {isBangla ? "রক্ষণাবেক্ষণ (Maintenance)" : "Maintenance"}
                  </SelectItem>
                  <SelectItem value="INACTIVE" className="text-xs">
                    {isBangla ? "নিষ্ক্রিয় (Inactive)" : "Inactive"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-border gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-9 text-xs font-semibold cursor-pointer rounded-xl"
              disabled={isCreating || isCreating}
            >
              {isBangla ? "বাতিল" : "Cancel"}
            </Button>

            <Button
              type="submit"
              disabled={isCreating || isCreating}
              className="h-9 text-xs font-semibold gap-2 cursor-pointer rounded-xl"
            >
              {(isCreating || isCreating) ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  {isBangla ? "সংরক্ষণ হচ্ছে..." : "Saving..."}
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  {isBangla ? "সেভ করুন" : "Save Warehouse"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
