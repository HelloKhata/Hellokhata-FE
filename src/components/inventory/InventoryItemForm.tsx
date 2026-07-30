"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  Boxes,
  CircleDollarSign,
  UploadCloud,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useGetTaxCategories } from "@/hooks/api/useTaxCategories";
import { useGetUnits } from "@/hooks/api/useUnits";
import { useGetItemsCategories } from "@/hooks/api/useItemCategories";
import { useCreateItem } from "@/hooks/api/useItems";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { Button } from "@/components/ui/button";

export interface InventoryItemFormProps {
  onSuccess?: (newItem?: any) => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export function InventoryItemForm({
  onSuccess,
  onCancel,
  isModal = false,
}: InventoryItemFormProps) {
  const { isBangla } = useAppTranslation();

  // Form State matching API JSON schema
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [brand, setBrand] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [taxCategoryId, setTaxCategoryId] = useState("");
  const [unitId, setUnitId] = useState("");
  const [description, setDescription] = useState("");

  const [costPrice, setCostPrice] = useState<number | "">(0);
  const [sellingPrice, setSellingPrice] = useState<number | "">(0);
  const [wholesalePrice, setWholesalePrice] = useState<number | "">(0);
  const [vipPrice, setVipPrice] = useState<number | "">(0);
  const [minimumPrice, setMinimumPrice] = useState<number | "">(0);

  const [currentStock, setCurrentStock] = useState<number | "">(0);
  const [minStock, setMinStock] = useState<number | "">(10);
  const [vatRate, setVatRate] = useState<number | "">(5);
  const [lowStockAlert, setLowStockAlert] = useState(false);

  const [trackExpiry, setTrackExpiry] = useState(false);
  const [trackBatch, setTrackBatch] = useState(false);
  const [status, setStatus] = useState("ACTIVE");
  const [warranty, setWarranty] = useState<"YES" | "NO">("NO");
  const [warrantyDays, setWarrantyDays] = useState<number | "">("");
  const [productType, setProductType] = useState("PRODUCT");
  const [imageUrl, setImageUrl] = useState("");

  const [manufactureDate, setManufactureDate] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");

  const [showAdvancePricing, setShowAdvancePricing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch API options
  const { data: taxCategories } = useGetTaxCategories();
  const { data: units } = useGetUnits();
  const { data: itemCategories } = useGetItemsCategories();
  const { mutate: saveProduct, isPending: isSaving } = useCreateItem();

  const showDateFields =
    trackBatch &&
    trackExpiry &&
    typeof currentStock === "number" &&
    currentStock > 0;

  const handleTrackBatchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setTrackBatch(isChecked);
    if (!isChecked) {
      setTrackExpiry(false);
    }
  };

  const generateSku = () => {
    const randomSku = `SKU-${Math.floor(100000 + Math.random() * 900000)}`;
    setSku(randomSku);
  };

  const generateBarcode = () => {
    const randomBarcode = `890${Math.floor(
      1000000000 + Math.random() * 9000000000
    )}`;
    setBarcode(randomBarcode);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = isBangla ? "পণ্যের নাম আবশ্যক" : "Product Name is required";
    }

    if (!unitId.trim()) {
      newErrors.unitId = isBangla ? "একক পরিমাপ আবশ্যক" : "Unit Measure is required";
    }

    if (costPrice === "") {
      newErrors.costPrice = isBangla ? "ক্রয় মূল্য আবশ্যক" : "Purchase Cost is required";
    }

    if (sellingPrice === "") {
      newErrors.sellingPrice = isBangla ? "বিক্রয় মূল্য আবশ্যক" : "Retail Selling Price is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProduct = () => {
    if (!validateForm()) {
      toast.error(
        isBangla ? "দয়া করে সকল প্রয়োজনীয় তথ্য লিখুন" : "Please fill in all required fields"
      );
      return;
    }

    const formData = {
      name,
      sku,
      barcode,
      brand,
      categoryId,
      taxCategoryId,
      unitId,
      description,
      costPrice: costPrice === "" ? 0 : Number(costPrice),
      sellingPrice: sellingPrice === "" ? 0 : Number(sellingPrice),
      wholesalePrice: wholesalePrice === "" ? 0 : Number(wholesalePrice),
      vipPrice: vipPrice === "" ? 0 : Number(vipPrice),
      minimumPrice: minimumPrice === "" ? 0 : Number(minimumPrice),
      currentStock: currentStock === "" ? 0 : Number(currentStock),
      minStock: minStock === "" ? 0 : Number(minStock),
      vatRate: vatRate === "" ? 0 : Number(vatRate),
      lowStockAlert,
      trackExpiry,
      trackBatch,
      status,
      warranty,
      hasWarranty: warranty === "YES",
      warrantyDays:
        warranty === "YES"
          ? warrantyDays === ""
            ? 0
            : Number(warrantyDays)
          : 0,
      productType,
      imageUrl,
      expiryDate: showDateFields ? expiryDate : null,
      manufactureDate: showDateFields ? manufactureDate : null,
    };

    saveProduct(formData, {
      onSuccess: (res: any) => {
        if (res?.success || res?.data) {
          toast.success(
            res?.message || (isBangla ? "পণ্য সফলভাবে যুক্ত হয়েছে" : "Product added successfully")
          );
          onSuccess?.(res?.data || { ...formData, id: res?.id || Math.random().toString() });
        } else {
          toast.error(res?.message || (isBangla ? "পণ্য যুক্ত করতে ব্যর্থ হয়েছে" : "Failed to add product"));
        }
      },
      onError: (err: any) => {
        toast.error(err?.message || (isBangla ? "ত্রুটি ঘটেছে" : "An error occurred"));
      },
    });
  };

  // Calculations
  const cost = typeof costPrice === "number" ? costPrice : 0;
  const price = typeof sellingPrice === "number" ? sellingPrice : 0;
  const grossProfit = price - cost;
  const marginPercent =
    price > 0 ? ((grossProfit / price) * 100).toFixed(1) : "0.0";

  return (
    <div className={`space-y-4 text-slate-200 ${isModal ? "p-1" : ""}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* LEFT / MAIN COLUMN (2 cols wide) */}
        <div className="lg:col-span-2 space-y-4">
          {/* CARD 1: Basic Product Information */}
          <section className="bg-card border border-border/80 rounded-xl px-4 py-4 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-border/60">
              <Boxes className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                {isBangla ? "মৌলিক পণ্যের তথ্য" : "Basic Product Information"}
              </h3>
            </div>

            <div className="space-y-3">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  {isBangla ? "পণ্যের নাম" : "Product Name"}{" "}
                  <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  placeholder={
                    isBangla
                      ? "যেমন: প্রিমিয়াম জাসমিন চাল ৫ কেজি"
                      : "e.g. Premium Jasmine Rice 5kg"
                  }
                  className={`w-full bg-background border ${
                    errors.name ? "border-destructive" : "border-input"
                  } rounded-lg px-3 h-10 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all`}
                />
                {errors.name && (
                  <p className="text-destructive text-[10px] mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* SKU & Barcode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      {isBangla ? "এসকেইউ কোড" : "SKU Code"}
                    </label>
                    <button
                      type="button"
                      onClick={generateSku}
                      className="text-[10px] text-primary hover:underline font-medium cursor-pointer"
                    >
                      {isBangla ? "জেনারেট করুন" : "Generate SKU"}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. JSM-RC-5KG"
                    className="w-full bg-background border border-input rounded-lg px-3 h-9 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      {isBangla ? "বারকোড / ইএএন" : "Barcode / EAN"}
                    </label>
                    <button
                      type="button"
                      onClick={generateBarcode}
                      className="text-[10px] text-primary hover:underline font-medium cursor-pointer"
                    >
                      {isBangla ? "জেনারেট করুন" : "Generate Barcode"}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="e.g. 8901030700812"
                    className="w-full bg-background border border-input rounded-lg px-3 h-9 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>

              {/* Category, Brand & Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    {isBangla ? "ক্যাটাগরি" : "Category"}
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-background border border-input rounded-lg px-2.5 h-9 text-xs text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                  >
                    <option value="">{isBangla ? "সিলেক্ট করুন" : "Select Category"}</option>
                    {itemCategories?.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    {isBangla ? "ব্র্যান্ড" : "Brand"}
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Royal Harvest"
                    className="w-full bg-background border border-input rounded-lg px-3 h-9 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    {isBangla ? "একক" : "Unit Measure"}{" "}
                    <span className="text-primary">*</span>
                  </label>
                  <select
                    value={unitId}
                    onChange={(e) => {
                      setUnitId(e.target.value);
                      if (errors.unitId)
                        setErrors((prev) => ({ ...prev, unitId: "" }));
                    }}
                    className={`w-full bg-background border ${
                      errors.unitId ? "border-destructive" : "border-input"
                    } rounded-lg px-2.5 h-9 text-xs text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all`}
                  >
                    <option value="">{isBangla ? "সিলেক্ট করুন" : "Select Unit"}</option>
                    {units?.map((u: any) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                  {errors.unitId && (
                    <p className="text-destructive text-[10px] mt-1">
                      {errors.unitId}
                    </p>
                  )}
                </div>
              </div>

              {/* Product Type, Status & Warranty */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    {isBangla ? "পণ্যের ধরন" : "Product Type"}
                  </label>
                  <select
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
                    className="w-full bg-background border border-input rounded-lg px-2.5 h-9 text-xs text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                  >
                    <option value="PRODUCT">Physical Product</option>
                    <option value="DIGITAL">Digital Product</option>
                    <option value="SERVICE">Service</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    {isBangla ? "স্ট্যাটাস" : "Status"}
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-background border border-input rounded-lg px-2.5 h-9 text-xs text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    {isBangla ? "ওয়ারেন্টি" : "Warranty"}
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      value={warranty}
                      onChange={(e) =>
                        setWarranty(e.target.value as "YES" | "NO")
                      }
                      className="w-full bg-background border border-input rounded-lg px-2.5 h-9 text-xs text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                    >
                      <option value="NO">No</option>
                      <option value="YES">Yes</option>
                    </select>

                    {warranty === "YES" && (
                      <div className="relative w-24 shrink-0">
                        <input
                          type="number"
                          min="0"
                          value={warrantyDays}
                          onChange={(e) =>
                            setWarrantyDays(
                              e.target.value === ""
                                ? ""
                                : Number(e.target.value)
                            )
                          }
                          placeholder="365"
                          className="w-full bg-background border border-input rounded-lg pl-2 pr-7 h-9 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-medium pointer-events-none">
                          Days
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Batch & Expiry Toggles */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-border/50">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={trackBatch}
                    onChange={handleTrackBatchChange}
                    className="h-3.5 w-3.5 rounded border-input accent-primary cursor-pointer"
                  />
                  <div>
                    <span className="text-xs text-foreground font-medium block">
                      {isBangla ? "ব্যাচ ট্র্যাকিং" : "Batch Tracking"}
                    </span>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-2 select-none ${
                    !trackBatch
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={trackExpiry}
                    onChange={(e) => setTrackExpiry(e.target.checked)}
                    disabled={!trackBatch}
                    className="h-3.5 w-3.5 rounded border-input accent-primary cursor-pointer"
                  />
                  <div>
                    <span className="text-xs text-foreground font-medium block">
                      {isBangla ? "মেয়াদ ট্র্যাকিং" : "Expiry Tracking"}
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </section>

          {/* CARD 2: Pricing & Profit Margins */}
          <section className="bg-card border border-border/80 rounded-xl px-4 py-4 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <div className="flex items-center gap-2">
                <CircleDollarSign className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">
                  {isBangla ? "মূল্য এবং লাভ" : "Pricing & Profit Margins"}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <div className="md:col-span-2 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      {isBangla ? "ক্রয় মূল্য" : "Purchase Cost"}{" "}
                      <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-mono">
                        ৳
                      </span>
                      <input
                        type="number"
                        value={costPrice}
                        onChange={(e) => {
                          setCostPrice(
                            e.target.value === "" ? "" : Number(e.target.value)
                          );
                          if (errors.costPrice)
                            setErrors((prev) => ({ ...prev, costPrice: "" }));
                        }}
                        placeholder="0.00"
                        className={`w-full bg-background border ${
                          errors.costPrice
                            ? "border-destructive"
                            : "border-input"
                        } rounded-lg pl-6 pr-3 h-9 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono`}
                      />
                    </div>
                    {errors.costPrice && (
                      <p className="text-destructive text-[10px] mt-1">
                        {errors.costPrice}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      {isBangla ? "বিক্রয় মূল্য (MRP)" : "Retail Selling Price (MRP)"}{" "}
                      <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-mono">
                        ৳
                      </span>
                      <input
                        type="number"
                        value={sellingPrice}
                        onChange={(e) => {
                          setSellingPrice(
                            e.target.value === "" ? "" : Number(e.target.value)
                          );
                          if (errors.sellingPrice)
                            setErrors((prev) => ({
                              ...prev,
                              sellingPrice: "",
                            }));
                        }}
                        placeholder="0.00"
                        className={`w-full bg-background border ${
                          errors.sellingPrice
                            ? "border-destructive"
                            : "border-input"
                        } rounded-lg pl-6 pr-3 h-9 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono`}
                      />
                    </div>
                    {errors.sellingPrice && (
                      <p className="text-destructive text-[10px] mt-1">
                        {errors.sellingPrice}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Profit Sidebar Box */}
              <div className="bg-muted/30 border border-border/80 rounded-lg p-3 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Profit:</span>
                  <span className="font-mono text-foreground font-semibold">
                    ৳{grossProfit.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Margin:</span>
                  <span className="font-mono text-primary font-bold">
                    {marginPercent}%
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN (1 col wide) */}
        <div className="space-y-4">
          {/* Stock Levels Section */}
          <section className="bg-card border border-border/80 rounded-xl px-4 py-4 space-y-3 shadow-xs">
            <h3 className="text-sm font-semibold text-foreground pb-2 border-b border-border/60">
              {isBangla ? "স্টক তথ্য" : "Stock Information"}
            </h3>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                {isBangla ? "প্রাথমিক স্টক" : "Opening Stock"}
              </label>
              <input
                type="number"
                value={currentStock}
                onChange={(e) =>
                  setCurrentStock(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                className="w-full bg-background border border-input rounded-lg px-3 h-9 text-xs text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                {isBangla ? "সর্বনিম্ন স্টক অ্যালার্ট" : "Min Stock Alert"}
              </label>
              <input
                type="number"
                value={minStock}
                onChange={(e) =>
                  setMinStock(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                className="w-full bg-background border border-input rounded-lg px-3 h-9 text-xs text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono"
              />
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              onClick={handleSaveProduct}
              disabled={isSaving}
              className="flex-1 h-10 text-xs font-bold gap-2 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{isBangla ? "সংরক্ষণ হচ্ছে..." : "Saving..."}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{isBangla ? "পণ্য সংরক্ষণ করুন" : "Save Product"}</span>
                </>
              )}
            </Button>

            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="h-10 text-xs cursor-pointer"
              >
                {isBangla ? "বাতিল" : "Cancel"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
