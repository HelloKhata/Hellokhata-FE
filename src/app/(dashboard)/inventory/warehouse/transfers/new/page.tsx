"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Building2,
  Package,
  Layers,
  ArrowRightLeft,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { toast } from "sonner";
import { MOCK_BRANCHES, MOCK_PRODUCTS } from "@/components/warehouse/WarehouseMockData";

interface TransferItemRow {
  id: string;
  productId: string;
  productName: string;
  batchNumber: string;
  quantity: number;
  unit: string;
}

export function CreateTransferPage() {
  const { isBangla } = useAppTranslation();
  const router = useRouter();

  // Form State
  const [destinationBranch, setDestinationBranch] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // Item Selector State
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedBatchNumber, setSelectedBatchNumber] = useState<string>("");
  const [quantityInput, setQuantityInput] = useState<string>("1");

  // Items Table State
  const [transferItems, setTransferItems] = useState<TransferItemRow[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Selected product object
  const selectedProduct = MOCK_PRODUCTS.find((p) => p.id === selectedProductId);
  const availableBatches = selectedProduct?.batches || [];

  // Reset batch selector when product changes
  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
    const prod = MOCK_PRODUCTS.find((p) => p.id === productId);
    if (prod && prod.batches.length > 0) {
      setSelectedBatchNumber(prod.batches[0].batchNumber);
    } else {
      setSelectedBatchNumber("");
    }
  };

  const handleAddItem = () => {
    const newErr: Record<string, string> = {};

    if (!selectedProductId) {
      newErr.product = isBangla ? "পণ্য নির্বাচন করুন" : "Select a product";
    }
    if (!selectedBatchNumber) {
      newErr.batch = isBangla ? "ব্যাচ নির্বাচন করুন" : "Select a batch";
    }
    const qtyNum = parseInt(quantityInput, 10) || 0;
    if (qtyNum <= 0) {
      newErr.quantity = isBangla ? "পরিমাণ ০ এর বেশি হতে হবে" : "Quantity must be > 0";
    }

    if (Object.keys(newErr).length > 0) {
      setErrors(newErr);
      return;
    }

    setErrors({});

    if (!selectedProduct) return;

    const newItem: TransferItemRow = {
      id: Math.random().toString(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      batchNumber: selectedBatchNumber,
      quantity: qtyNum,
      unit: selectedProduct.unit,
    };

    setTransferItems((prev) => [...prev, newItem]);
    toast.success(
      isBangla
        ? `${selectedProduct.name} টেবিলে যোগ করা হয়েছে`
        : `Added ${selectedProduct.name} to transfer list`
    );

    // Reset selector inputs
    setSelectedProductId("");
    setSelectedBatchNumber("");
    setQuantityInput("1");
  };

  const handleRemoveItem = (id: string) => {
    setTransferItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCreateTransfer = () => {
    const newErr: Record<string, string> = {};

    if (!destinationBranch) {
      newErr.destination = isBangla ? "গন্তব্য শাখা নির্বাচন করুন" : "Select destination branch";
    }
    if (transferItems.length === 0) {
      newErr.items = isBangla ? "অন্তত একটি পণ্য যোগ করুন" : "Add at least one item to transfer";
    }

    if (Object.keys(newErr).length > 0) {
      setErrors(newErr);
      const firstMsg = Object.values(newErr)[0];
      toast.error(firstMsg);
      return;
    }

    toast.success(
      isBangla
        ? "স্টক ট্রান্সফার সফলভাবে তৈরি করা হয়েছে"
        : "Stock transfer created successfully!"
    );
    router.push("/inventory/warehouse/transfers");
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div className="space-y-1">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>{isBangla ? "ইনভেন্টরি" : "Inventory"}</span>
            <ChevronRight className="h-3 w-3" />
            <span>{isBangla ? "ওয়্যারহাউস" : "Warehouse"}</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-semibold">{isBangla ? "নতুন ট্রান্সফার" : "Create Transfer"}</span>
          </nav>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ArrowRightLeft className="h-6 w-6 text-primary" />
            <span>{isBangla ? "নতুন স্টক ট্রান্সফার তৈরি করুন" : "Create Stock Transfer"}</span>
          </h1>
        </div>

        <Button
          variant="outline"
          onClick={() => router.back()}
          className="h-9 text-xs font-semibold gap-1.5 cursor-pointer shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
          {isBangla ? "পেছনে" : "Back"}
        </Button>
      </div>

      {/* 1. Transfer Information Section */}
      <Card className="border border-border/60 shadow-xs">
        <CardHeader className="p-4 border-b border-border/40">
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            <span>{isBangla ? "ট্রান্সফার তথ্য (Transfer Information)" : "Transfer Information"}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Source Branch (Fixed Warehouse) */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                {isBangla ? "উৎস শাখা (Source)" : "Source Branch"}
              </Label>
              <Input
                value="Central Distribution Warehouse (WH-MAIN)"
                disabled
                className="h-10 text-xs font-semibold bg-muted/60 text-muted-foreground border-input"
              />
            </div>

            {/* Destination Branch Select */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                {isBangla ? "গন্তব্য শাখা (Destination Branch) *" : "Destination Branch *"}
              </Label>
              <Select value={destinationBranch} onValueChange={setDestinationBranch}>
                <SelectTrigger className="h-10 text-xs bg-background border-input w-full">
                  <SelectValue placeholder={isBangla ? "গন্তব্য শাখা নির্বাচন করুন" : "Select Destination Branch"} />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_BRANCHES.filter((b) => !b.isWarehouse).map((b) => (
                    <SelectItem key={b.id} value={b.name} className="text-xs font-medium">
                      {b.name} ({b.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.destination && (
                <p className="text-[10px] text-destructive font-medium">{errors.destination}</p>
              )}
            </div>
          </div>

          {/* Notes Textarea */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              {isBangla ? "মন্তব্য বা নির্দেশনা (Notes)" : "Notes"}
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isBangla ? "ট্রান্সফার সংক্রান্ত অতিরিক্ত নোট বা নির্দেশনা লিখুন..." : "Enter any transfer instructions or details..."}
              className="h-20 text-xs bg-background border-input resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* 2. Transfer Items Section */}
      <Card className="border border-border/60 shadow-xs">
        <CardHeader className="p-4 border-b border-border/40">
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" />
            <span>{isBangla ? "ট্রান্সফার আইটেম (Transfer Items)" : "Transfer Items"}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {/* Product + Batch + Qty Selector Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end p-3 rounded-xl bg-muted/30 border border-border/60">
            {/* Product Selector */}
            <div className="sm:col-span-5 space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                {isBangla ? "পণ্য (Product) *" : "Product *"}
              </Label>
              <Select value={selectedProductId} onValueChange={handleProductSelect}>
                <SelectTrigger className="h-10 text-xs bg-background border-input w-full">
                  <SelectValue placeholder={isBangla ? "পণ্য নির্বাচন করুন" : "Select Product"} />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_PRODUCTS.map((p) => (
                    <SelectItem key={p.id} value={p.id} className="text-xs font-medium">
                      {p.name} (SKU: {p.sku})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.product && (
                <p className="text-[10px] text-destructive font-medium">{errors.product}</p>
              )}
            </div>

            {/* Batch Selector */}
            <div className="sm:col-span-4 space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                {isBangla ? "ব্যাচ (Batch) *" : "Batch *"}
              </Label>
              <Select value={selectedBatchNumber} onValueChange={setSelectedBatchNumber}>
                <SelectTrigger className="h-10 text-xs bg-background border-input w-full">
                  <SelectValue placeholder={isBangla ? "ব্যাচ নির্বাচন করুন" : "Select Batch"} />
                </SelectTrigger>
                <SelectContent>
                  {availableBatches.map((b) => (
                    <SelectItem key={b.batchNumber} value={b.batchNumber} className="text-xs">
                      {b.batchNumber} (Stock: {b.availableStock} • Exp: {b.expiryDate})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.batch && (
                <p className="text-[10px] text-destructive font-medium">{errors.batch}</p>
              )}
            </div>

            {/* Quantity Input */}
            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                {isBangla ? "পরিমাণ *" : "Quantity *"}
              </Label>
              <Input
                type="number"
                value={quantityInput}
                onChange={(e) => setQuantityInput(e.target.value)}
                className="h-10 text-center font-mono font-bold text-xs bg-background border-input"
                min="1"
              />
              {errors.quantity && (
                <p className="text-[10px] text-destructive font-medium">{errors.quantity}</p>
              )}
            </div>

            {/* Add Item Button */}
            <div className="sm:col-span-1">
              <Button
                type="button"
                onClick={handleAddItem}
                className="h-10 w-full text-xs font-bold gap-1 cursor-pointer shadow-xs"
              >
                <Plus className="h-4 w-4" />
                <span>{isBangla ? "যোগ" : "Add"}</span>
              </Button>
            </div>
          </div>

          {/* Items Responsive Table */}
          <div className="overflow-x-auto border border-border/60 rounded-xl bg-card">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-muted/40 text-muted-foreground border-b border-border font-semibold uppercase text-[11px]">
                  <th className="p-3.5 w-[5%]">#</th>
                  <th className="p-3.5 w-[45%]">{isBangla ? "পণ্য (Product)" : "Product"}</th>
                  <th className="p-3.5 w-[25%]">{isBangla ? "ব্যাচ (Batch)" : "Batch"}</th>
                  <th className="p-3.5 w-[15%] text-center">{isBangla ? "পরিমাণ (Quantity)" : "Quantity"}</th>
                  <th className="p-3.5 w-[10%] text-right">{isBangla ? "অ্যাকশন" : "Action"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {transferItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground text-xs">
                      {isBangla
                        ? "উপরের ফরম থেকে পণ্য ও ব্যাচ সিলেক্ট করে ট্রান্সফার টেবিলে যোগ করুন।"
                        : "No items added yet. Select a product and batch above to add to the transfer table."}
                    </td>
                  </tr>
                ) : (
                  transferItems.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-3.5 font-bold text-muted-foreground align-middle">
                        {idx + 1}
                      </td>
                      <td className="p-3.5 align-middle">
                        <div className="font-bold text-foreground text-xs">{item.productName}</div>
                      </td>
                      <td className="p-3.5 align-middle font-mono font-medium text-foreground">
                        {item.batchNumber}
                      </td>
                      <td className="p-3.5 align-middle text-center font-mono font-bold text-foreground">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="p-3.5 align-middle text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-muted-foreground hover:text-rose-600 transition-colors p-1 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {errors.items && <p className="text-[10px] text-destructive font-medium">{errors.items}</p>}
        </CardContent>
      </Card>

      {/* Bottom Right Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="h-10 text-xs font-semibold cursor-pointer"
        >
          {isBangla ? "বাতিল" : "Cancel"}
        </Button>

        <Button
          type="button"
          onClick={handleCreateTransfer}
          className="h-10 text-xs font-bold gap-1.5 cursor-pointer shadow-xs px-5"
        >
          <CheckCircle2 className="h-4 w-4" />
          {isBangla ? "ট্রান্সফার নিশ্চিত করুন" : "Create Transfer"}
        </Button>
      </div>
    </div>
  );
}

export default CreateTransferPage;
