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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Sliders,
  HardDrive,
  Loader2,
  CheckCircle2,
  Warehouse as WarehouseIcon,
  ShieldCheck,
  Thermometer,
  Layers,
  Barcode,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import { Warehouse, MOCK_BRANCHES } from "./WarehouseMockData";

interface NewWarehouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (warehouseData: Partial<Warehouse>) => void;
  editingWarehouse?: Warehouse | null;
  isBangla?: boolean;
}

export function NewWarehouseModal({
  isOpen,
  onClose,
  onSave,
  editingWarehouse,
  isBangla = false,
}: NewWarehouseModalProps) {
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState<Partial<Warehouse>>({
    name: "",
    code: "",
    type: "Central Warehouse",
    branchId: "b1",
    branchName: "Dhaka Central HQ",
    managerName: "",
    managerPhone: "",
    managerEmail: "",
    address: "",
    city: "Dhaka",
    postalCode: "",
    country: "Bangladesh",
    description: "",
    notes: "",
    status: "active",
    capacityMax: 25000,
    capacityUsed: 0,
    storageUnit: "pallets",
    config: {
      allowSales: true,
      allowPurchase: true,
      allowTransfers: true,
      isDefault: false,
      trackCapacity: true,
      trackTemperature: false,
      allowNegativeStock: false,
      barcodeEnabled: true,
      batchTracking: true,
      expiryTracking: true,
      serialTracking: false,
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingWarehouse) {
      setFormData(editingWarehouse);
    } else {
      setFormData({
        name: "",
        code: `WH-${Math.floor(100 + Math.random() * 900)}`,
        type: "Central Warehouse",
        branchId: "b1",
        branchName: "Dhaka Central HQ",
        managerName: "",
        managerPhone: "",
        managerEmail: "",
        address: "",
        city: "Dhaka",
        postalCode: "1200",
        country: "Bangladesh",
        description: "",
        notes: "",
        status: "active",
        capacityMax: 20000,
        capacityUsed: 0,
        storageUnit: "pallets",
        config: {
          allowSales: true,
          allowPurchase: true,
          allowTransfers: true,
          isDefault: false,
          trackCapacity: true,
          trackTemperature: false,
          allowNegativeStock: false,
          barcodeEnabled: true,
          batchTracking: true,
          expiryTracking: true,
          serialTracking: false,
        },
      });
    }
    setErrors({});
    setActiveTab("basic");
  }, [editingWarehouse, isOpen]);

  const handleTextChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleConfigChange = (configKey: keyof Warehouse["config"], value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      config: {
        ...prev.config!,
        [configKey]: value,
      },
    }));
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
    if (!validateForm()) {
      setActiveTab("basic");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const selectedBranchObj = MOCK_BRANCHES.find((b) => b.id === formData.branchId);

      const finalPayload: Partial<Warehouse> = {
        ...formData,
        branchName: selectedBranchObj?.name || formData.branchName || "Main Branch",
        updatedAt: new Date().toISOString(),
        createdAt: formData.createdAt || new Date().toISOString(),
        productsCount: formData.productsCount || 0,
        stockValue: formData.stockValue || 0,
        totalStockUnits: formData.totalStockUnits || 0,
      };

      if (onSave) {
        onSave(finalPayload);
      }

      toast.success(
        editingWarehouse
          ? isBangla
            ? "ওয়্যারহাউস সফলভাবে আপডেট হয়েছে!"
            : "Warehouse updated successfully!"
          : isBangla
            ? "নতুন ওয়্যারহাউস সফলভাবে তৈরি হয়েছে!"
            : "New warehouse created successfully!"
      );
      onClose();
    } catch (error) {
      toast.error(isBangla ? "সংরক্ষণ করতে সমস্যা হয়েছে!" : "Failed to save warehouse!");
    } finally {
      setIsLoading(false);
    }
  };

  const WAREHOUSE_TYPES = [
    { value: "Central Warehouse", labelEn: "Central Warehouse", labelBn: "কেন্দ্রীয় ওয়্যারহাউস" },
    { value: "Distribution Center", labelEn: "Distribution Center", labelBn: "ডিস্ট্রিবিউশন সেন্টার" },
    { value: "Retail Warehouse", labelEn: "Retail Warehouse", labelBn: "রিটেইল স্টোররুম" },
    { value: "Cold Storage", labelEn: "Cold Storage (Sub-zero)", labelBn: "কোল্ড স্টোরেজ" },
    { value: "Transit Warehouse", labelEn: "Transit / Cross-dock Hub", labelBn: "ট্রানজিট ওয়্যারহাউস" },
    { value: "Damaged Goods Warehouse", labelEn: "Damaged Goods Warehouse", labelBn: "ক্ষতিগ্রস্ত পণ্য ডিপো" },
    { value: "Returns Warehouse", labelEn: "Returns & Quarantine", labelBn: "রিটার্ন ওয়্যারহাউস" },
    { value: "Fulfillment Center", labelEn: "E-commerce Fulfillment", labelBn: "ফুলফিলমেন্ট সেন্টার" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-3xl max-h-[92vh] overflow-y-auto p-4 sm:p-6 bg-card border-border shadow-2xl">
        <DialogHeader className="border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                <span>
                  {editingWarehouse
                    ? isBangla
                      ? "ওয়্যারহাউস এডিট করুন"
                      : "Edit Warehouse"
                    : isBangla
                      ? "নতুন ওয়্যারহাউস তৈরি করুন"
                      : "Create New Warehouse"}
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {isBangla
                  ? "মাল্টি-ব্রাঞ্চ ইনভেন্টরি ম্যানেজমেন্টের জন্য ওয়্যারহাউসের তথ্য কনফিগার করুন।"
                  : "Set up capacity, controls, and branch details for multi-warehouse management."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 bg-muted/50 p-1 rounded-lg">
              <TabsTrigger value="basic" className="text-xs font-semibold gap-1.5 cursor-pointer">
                <Building2 className="h-3.5 w-3.5" />
                <span>{isBangla ? "মূল তথ্য" : "Basic Info"}</span>
              </TabsTrigger>

              <TabsTrigger value="config" className="text-xs font-semibold gap-1.5 cursor-pointer">
                <Sliders className="h-3.5 w-3.5" />
                <span>{isBangla ? "কনফিগারেশন" : "Configuration"}</span>
              </TabsTrigger>

              <TabsTrigger value="capacity" className="text-xs font-semibold gap-1.5 cursor-pointer">
                <HardDrive className="h-3.5 w-3.5" />
                <span>{isBangla ? "ধারণক্ষমতা" : "Capacity"}</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: BASIC INFORMATION */}
            <TabsContent value="basic" className="space-y-4 pt-3">
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

                {/* Warehouse Type */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">
                    {isBangla ? "ওয়্যারহাউস টাইপ" : "Warehouse Type"}
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(val) => handleTextChange("type", val)}
                  >
                    <SelectTrigger className="h-9 text-xs bg-background/50 border-input w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {WAREHOUSE_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value} className="text-xs">
                          {isBangla ? t.labelBn : t.labelEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Assign Branch */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">
                    {isBangla ? "সংযুক্ত শাখা (Branch)" : "Assign Branch"}
                  </Label>
                  <Select
                    value={formData.branchId}
                    onValueChange={(val) => {
                      const b = MOCK_BRANCHES.find((item) => item.id === val);
                      setFormData((prev) => ({
                        ...prev,
                        branchId: val,
                        branchName: b?.name || prev.branchName,
                      }));
                    }}
                  >
                    <SelectTrigger className="h-9 text-xs bg-background/50 border-input w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_BRANCHES.map((b) => (
                        <SelectItem key={b.id} value={b.id} className="text-xs">
                          {b.name} ({b.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Manager Name */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">
                    {isBangla ? "ম্যানেজারের নাম" : "Warehouse Manager"}
                  </Label>
                  <Input
                    value={formData.managerName || ""}
                    onChange={(e) => handleTextChange("managerName", e.target.value)}
                    placeholder={isBangla ? "ম্যানেজারের নাম লিখুন" : "Assign employee manager"}
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

                {/* Manager Email */}
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-semibold text-foreground">
                    {isBangla ? "ইমেইল" : "Manager Email"}
                  </Label>
                  <Input
                    type="email"
                    value={formData.managerEmail || ""}
                    onChange={(e) => handleTextChange("managerEmail", e.target.value)}
                    placeholder="manager@hellokhata.com"
                    className="text-xs h-9"
                  />
                </div>

                {/* Address */}
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-semibold text-foreground">
                    {isBangla ? "ঠিকানা" : "Address"}
                  </Label>
                  <Input
                    value={formData.address || ""}
                    onChange={(e) => handleTextChange("address", e.target.value)}
                    placeholder={isBangla ? "রাস্তা / ইন্ডাস্ট্রিয়াল এলাকা" : "Street, Plot, Industrial Zone"}
                    className="text-xs h-9"
                  />
                </div>

                {/* City */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">
                    {isBangla ? "শহর / জেলা" : "City / Region"}
                  </Label>
                  <Input
                    value={formData.city || ""}
                    onChange={(e) => handleTextChange("city", e.target.value)}
                    placeholder="Dhaka"
                    className="text-xs h-9"
                  />
                </div>

                {/* Postal Code & Country */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      {isBangla ? "পোস্ট কোড" : "Postal Code"}
                    </Label>
                    <Input
                      value={formData.postalCode || ""}
                      onChange={(e) => handleTextChange("postalCode", e.target.value)}
                      placeholder="1208"
                      className="text-xs h-9 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      {isBangla ? "দেশ" : "Country"}
                    </Label>
                    <Input
                      value={formData.country || "Bangladesh"}
                      onChange={(e) => handleTextChange("country", e.target.value)}
                      className="text-xs h-9"
                    />
                  </div>
                </div>

                {/* Description & Notes */}
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-semibold text-foreground">
                    {isBangla ? "বিবরণ ও নোটস" : "Description & Notes"}
                  </Label>
                  <Textarea
                    value={formData.notes || ""}
                    onChange={(e) => handleTextChange("notes", e.target.value)}
                    placeholder={isBangla ? "বিশেষ নিরাপত্তা ও লজিস্টিকস তথ্য..." : "Logistics, security detail & notes..."}
                    className="text-xs h-20 resize-none"
                  />
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: WAREHOUSE CONFIGURATION */}
            <TabsContent value="config" className="space-y-4 pt-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Allow Sales */}
                <div className="p-3 rounded-lg border border-border/80 bg-background/50 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-foreground cursor-pointer">
                      {isBangla ? "বিক্রয় অনুমতি" : "Allow Direct Sales"}
                    </Label>
                    <p className="text-[11px] text-muted-foreground">
                      {isBangla ? "এই ওয়্যারহাউস থেকে সরাসরি কাস্টমার সেলস চালু রাখুন" : "Allow direct sales order dispatch from this depot"}
                    </p>
                  </div>
                  <Switch
                    checked={!!formData.config?.allowSales}
                    onCheckedChange={(val) => handleConfigChange("allowSales", val)}
                  />
                </div>

                {/* Allow Purchase */}
                <div className="p-3 rounded-lg border border-border/80 bg-background/50 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-foreground cursor-pointer">
                      {isBangla ? "ক্রয় ইনভয়েস গ্রহণ" : "Allow Purchase Receipt"}
                    </Label>
                    <p className="text-[11px] text-muted-foreground">
                      {isBangla ? "সরাসরি সাপ্লায়ার ক্রয় স্টক যোগ করার অনুমতি" : "Receive vendor PO goods directly into this warehouse"}
                    </p>
                  </div>
                  <Switch
                    checked={!!formData.config?.allowPurchase}
                    onCheckedChange={(val) => handleConfigChange("allowPurchase", val)}
                  />
                </div>

                {/* Allow Transfers */}
                <div className="p-3 rounded-lg border border-border/80 bg-background/50 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-foreground cursor-pointer">
                      {isBangla ? "স্টক ট্রান্সফার অনুমতি" : "Allow Inter-Warehouse Transfers"}
                    </Label>
                    <p className="text-[11px] text-muted-foreground">
                      {isBangla ? "অন্যান্য শাখা/ওয়্যারহাউসে স্টক পাঠানোর সুবিধা" : "Enable incoming & outgoing stock movement"}
                    </p>
                  </div>
                  <Switch
                    checked={!!formData.config?.allowTransfers}
                    onCheckedChange={(val) => handleConfigChange("allowTransfers", val)}
                  />
                </div>

                {/* Default Warehouse */}
                <div className="p-3 rounded-lg border border-border/80 bg-background/50 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-foreground cursor-pointer">
                      {isBangla ? "ডিফল্ট ওয়্যারহাউস" : "Set as Default Warehouse"}
                    </Label>
                    <p className="text-[11px] text-muted-foreground">
                      {isBangla ? "শাখার প্রাথমিক স্টক হাব হিসেবে নির্বাচন" : "Use as primary inventory node for assigned branch"}
                    </p>
                  </div>
                  <Switch
                    checked={!!formData.config?.isDefault}
                    onCheckedChange={(val) => handleConfigChange("isDefault", val)}
                  />
                </div>

                {/* Track Temperature */}
                <div className="p-3 rounded-lg border border-border/80 bg-background/50 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-foreground cursor-pointer flex items-center gap-1.5">
                      <Thermometer className="h-3.5 w-3.5 text-blue-500" />
                      <span>{isBangla ? "তাপমাত্রা ট্র্যাকিং" : "Track Temperature / Climate"}</span>
                    </Label>
                    <p className="text-[11px] text-muted-foreground">
                      {isBangla ? "মেডিসিন বা কোল্ড চেইন মনিটরিং" : "Required for sub-zero medical & pharma storage"}
                    </p>
                  </div>
                  <Switch
                    checked={!!formData.config?.trackTemperature}
                    onCheckedChange={(val) => handleConfigChange("trackTemperature", val)}
                  />
                </div>

                {/* Batch Tracking */}
                <div className="p-3 rounded-lg border border-border/80 bg-background/50 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-foreground cursor-pointer flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-amber-500" />
                      <span>{isBangla ? "ব্যাচ নম্বর ট্র্যাকিং" : "Batch Number Tracking"}</span>
                    </Label>
                    <p className="text-[11px] text-muted-foreground">
                      {isBangla ? "লট ও ব্যাচ নম্বর রেকর্ড রাখুন" : "Track incoming product lot & batch numbers"}
                    </p>
                  </div>
                  <Switch
                    checked={!!formData.config?.batchTracking}
                    onCheckedChange={(val) => handleConfigChange("batchTracking", val)}
                  />
                </div>

                {/* Expiry Tracking */}
                <div className="p-3 rounded-lg border border-border/80 bg-background/50 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-foreground cursor-pointer">
                      {isBangla ? "মেয়াদোত্তীর্ণের তারিখ ট্র্যাকিং" : "Expiry Date Tracking"}
                    </Label>
                    <p className="text-[11px] text-muted-foreground">
                      {isBangla ? "FEFO / FIFO মেয়াদের এলার্ট পান" : "Alert staff before inventory items expire"}
                    </p>
                  </div>
                  <Switch
                    checked={!!formData.config?.expiryTracking}
                    onCheckedChange={(val) => handleConfigChange("expiryTracking", val)}
                  />
                </div>

                {/* Barcode Enabled */}
                <div className="p-3 rounded-lg border border-border/80 bg-background/50 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-foreground cursor-pointer flex items-center gap-1.5">
                      <Barcode className="h-3.5 w-3.5 text-emerald-500" />
                      <span>{isBangla ? "বারকোড স্ক্যানিং চালুকরণ" : "Barcode & QR Scanning"}</span>
                    </Label>
                    <p className="text-[11px] text-muted-foreground">
                      {isBangla ? "বারকোড দিয়ে ইনভেন্টরি দ্রুত স্ক্যান করুন" : "Enable handheld barcode audit & dispatch"}
                    </p>
                  </div>
                  <Switch
                    checked={!!formData.config?.barcodeEnabled}
                    onCheckedChange={(val) => handleConfigChange("barcodeEnabled", val)}
                  />
                </div>
              </div>
            </TabsContent>

            {/* TAB 3: CAPACITY MANAGEMENT */}
            <TabsContent value="capacity" className="space-y-4 pt-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Maximum Capacity */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">
                    {isBangla ? "সর্বোচ্চ ধারণক্ষমতা" : "Maximum Capacity"}
                  </Label>
                  <Input
                    type="number"
                    value={formData.capacityMax || 0}
                    onChange={(e) => handleTextChange("capacityMax", parseFloat(e.target.value) || 0)}
                    placeholder="25000"
                    className="text-xs h-9 font-semibold"
                  />
                </div>

                {/* Storage Unit */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">
                    {isBangla ? "স্টোরেজ পরিমাপ একক" : "Storage Metric Unit"}
                  </Label>
                  <Select
                    value={formData.storageUnit}
                    onValueChange={(val: any) => handleTextChange("storageUnit", val)}
                  >
                    <SelectTrigger className="h-9 text-xs bg-background/50 border-input w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pallets">Pallets (প্যালেট)</SelectItem>
                      <SelectItem value="m³">Cubic Meters - m³ (ঘনমিটার)</SelectItem>
                      <SelectItem value="sq ft">Square Feet - sq ft (বর্গফুট)</SelectItem>
                      <SelectItem value="units">Total Items / Units (মোট পিস)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Current Utilization */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">
                    {isBangla ? "বর্তমান ব্যবহারিত জায়গা" : "Current Storage Used"}
                  </Label>
                  <Input
                    type="number"
                    value={formData.capacityUsed || 0}
                    onChange={(e) => handleTextChange("capacityUsed", parseFloat(e.target.value) || 0)}
                    placeholder="12000"
                    className="text-xs h-9 font-semibold"
                  />
                </div>

                {/* Calculated Utilization % Card */}
                <div className="p-3.5 rounded-lg border border-primary/20 bg-primary/5 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">
                      {isBangla ? "ক্যালকুলেটেড ব্যবহারের হার" : "Calculated Utilization"}
                    </span>
                    <Badge variant="outline" className="bg-primary/10 text-primary font-mono text-xs font-bold">
                      {formData.capacityMax && formData.capacityMax > 0
                        ? Math.round(((formData.capacityUsed || 0) / formData.capacityMax) * 100)
                        : 0}
                      %
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden border border-border/50">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          100,
                          formData.capacityMax && formData.capacityMax > 0
                            ? Math.round(((formData.capacityUsed || 0) / formData.capacityMax) * 100)
                            : 0
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="pt-4 border-t border-border gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-9 text-xs font-semibold cursor-pointer"
            >
              {isBangla ? "বাতিল" : "Cancel"}
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="h-9 text-xs font-semibold gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>{isBangla ? "সংরক্ষণ হচ্ছে..." : "Saving..."}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>
                    {editingWarehouse
                      ? isBangla
                        ? "আপডেট করুন"
                        : "Update Warehouse"
                      : isBangla
                        ? "ওয়্যারহাউস তৈরি করুন"
                        : "Create Warehouse"}
                  </span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
