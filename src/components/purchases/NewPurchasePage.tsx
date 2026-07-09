// Hello Khata OS - New Purchase Page
// হ্যালো খাতা - নতুন ক্রয় পেজ

"use client";

import { useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  Check,
  X,
  ArrowLeft,
  Camera,
  Users,
  Loader2,
} from "lucide-react";
import { useCurrency } from "@/hooks/useAppTranslation";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useGetItems } from "@/hooks/api/useItems";
import { useParties, useParty } from "@/hooks/api/useParties";
import { useCreatePurchases } from "@/hooks/api/usePurchases";
import { useUser } from "@/stores/sessionStore";

interface BillingItemRow {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unitCost: number;
  discountPercent: number;
  discountFlat: number;
  total: number;
  searchQuery: string;
  showSuggestions: boolean;
}

function NewPurchaseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supplierIdParam = searchParams.get("partyId") || "";
  const { t, isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const { mutate, isPending } = useCreatePurchases();

  // API Data
  const [supplierSearchQuery, setSupplierSearchQuery] = useState("");

  const { data: itemsData } = useGetItems({ page: 1, limit: 100 });
  const items = itemsData?.data || [];

  const { data: suppliersData } = useParties({ type: "supplier" });
  const suppliers = suppliersData?.data || [];

  // Form State
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(supplierIdParam);

  // Fetch individual supplier if selectedSupplierId is set
  const { data: singleSupplierData } = useParty(selectedSupplierId, {
    enabled: !!selectedSupplierId,
  });
  const [showSupplierSuggestions, setShowSupplierSuggestions] = useState(false);

  const [invoiceNo, setInvoiceNo] = useState("");
  const [isManualInvoiceNo, setIsManualInvoiceNo] = useState(false);
  const [invoiceDate, setInvoiceDate] = useState<Date>(new Date());

  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "card" | "mobile_banking" | "credit"
  >("cash");
  const [paidAmount, setPaidAmount] = useState<string>("");

  // Billing Items Table Rows
  const [selectedItems, setSelectedItems] = useState<BillingItemRow[]>([
    {
      id: "initial-row",
      itemId: "",
      itemName: "",
      quantity: 1,
      unitCost: 0,
      discountPercent: 0,
      discountFlat: 0,
      total: 0,
      searchQuery: "",
      showSuggestions: false,
    },
  ]);

  // Suppliers Filtering
  const filteredSuppliers = useMemo(() => {
    if (!supplierSearchQuery) return suppliers;
    return suppliers.filter(
      (p: any) =>
        p.name.toLowerCase().includes(supplierSearchQuery.toLowerCase()) ||
        p.phone?.includes(supplierSearchQuery),
    );
  }, [suppliers, supplierSearchQuery]);

  // Selected Supplier Name
  const selectedSupplierName = useMemo(() => {
    const supplier = suppliers.find((p: any) => p.id === selectedSupplierId);
    if (supplier) return supplier.name;
    if (singleSupplierData?.data && singleSupplierData.data.id === selectedSupplierId) {
      return singleSupplierData.data.name;
    }
    return "";
  }, [suppliers, selectedSupplierId, singleSupplierData]);

  // Calculations
  const subtotal = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + item.total, 0);
  }, [selectedItems]);

  const totalDiscount = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + item.discountFlat, 0);
  }, [selectedItems]);

  const total = subtotal; // total is sum of rows after row-level discounts

  const effectivePaidAmount = useMemo(() => {
    if (paymentMethod === "credit") return 0;
    return paidAmount === "" ? total : parseFloat(paidAmount) || total;
  }, [paymentMethod, paidAmount, total]);

  const due = Math.max(0, total - effectivePaidAmount);

  // Add Item Row
  const addItemRow = () => {
    setSelectedItems((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        itemId: "",
        itemName: "",
        quantity: 1,
        unitCost: 0,
        discountPercent: 0,
        discountFlat: 0,
        total: 0,
        searchQuery: "",
        showSuggestions: false,
      },
    ]);
  };

  // Remove Item Row
  const removeItemRow = (id: string) => {
    if (selectedItems.length === 1) {
      setSelectedItems([
        {
          id: "initial-row",
          itemId: "",
          itemName: "",
          quantity: 1,
          unitCost: 0,
          discountPercent: 0,
          discountFlat: 0,
          total: 0,
          searchQuery: "",
          showSuggestions: false,
        },
      ]);
      return;
    }
    setSelectedItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Calculate Row Total helper
  const calculateRowTotal = (
    qty: number,
    cost: number,
    flatDiscount: number,
  ) => {
    return Math.max(0, qty * cost - flatDiscount);
  };

  // Handle Name field input (search items)
  const handleNameChange = (id: string, query: string) => {
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            // Clear selected item when user starts typing
            itemId: "",
            itemName: "",
            searchQuery: query,
            showSuggestions: true,
          };
        }
        return item;
      }),
    );
  };

  // Handle product selection from dropdown
  const handleSelectProduct = (rowId: string, product: any) => {
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id === rowId) {
          const qty = item.quantity || 1;
          const cost = product.costPrice || 0;
          const flatDiscount = item.discountFlat || 0;
          const total = calculateRowTotal(qty, cost, flatDiscount);
          return {
            ...item,
            itemId: product.id,
            itemName: product.name,
            searchQuery: "",
            unitCost: cost,
            total,
            showSuggestions: false,
          };
        }
        return item;
      }),
    );
  };

  // Handle Quantity Change
  const handleQuantityChange = (id: string, val: string) => {
    const qty = parseFloat(val) || 0;
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const cost = item.unitCost || 0;
          const flat =
            parseFloat(
              (cost * qty * (item.discountPercent / 100)).toFixed(2),
            ) || 0;
          const total = calculateRowTotal(qty, cost, flat);
          return {
            ...item,
            quantity: qty,
            discountFlat: flat,
            total,
          };
        }
        return item;
      }),
    );
  };

  // Handle Rate Change
  const handleRateChange = (id: string, val: string) => {
    const cost = parseFloat(val) || 0;
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const qty = item.quantity || 0;
          const flat =
            parseFloat(
              (cost * qty * (item.discountPercent / 100)).toFixed(2),
            ) || 0;
          const total = calculateRowTotal(qty, cost, flat);
          return {
            ...item,
            unitCost: cost,
            discountFlat: flat,
            total,
          };
        }
        return item;
      }),
    );
  };

  // Handle Row Discount % Change
  const handleDiscountPercentChange = (id: string, val: string) => {
    const percent = parseFloat(val) || 0;
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const qty = item.quantity || 0;
          const cost = item.unitCost || 0;
          const flat =
            parseFloat((cost * qty * (percent / 100)).toFixed(2)) || 0;
          const total = calculateRowTotal(qty, cost, flat);
          return {
            ...item,
            discountPercent: percent,
            discountFlat: flat,
            total,
          };
        }
        return item;
      }),
    );
  };

  // Handle Row Discount Flat Tk Change
  const handleDiscountFlatChange = (id: string, val: string) => {
    const flat = parseFloat(val) || 0;
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const qty = item.quantity || 0;
          const cost = item.unitCost || 0;
          const totalCost = cost * qty;
          const percent =
            totalCost > 0
              ? parseFloat(((flat / totalCost) * 100).toFixed(2))
              : 0;
          const total = calculateRowTotal(qty, cost, flat);
          return {
            ...item,
            discountPercent: percent,
            discountFlat: flat,
            total,
          };
        }
        return item;
      }),
    );
  };

  // Handle row blur with delay to register suggestion clicks
  const handleRowBlur = (id: string) => {
    setTimeout(() => {
      setSelectedItems((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            return { ...item, showSuggestions: false };
          }
          return item;
        }),
      );
    }, 300);
  };

  // Filter available items for inline suggestions dropdown
  const getFilteredProducts = (query: string) => {
    if (!query?.trim()) {
      return items.slice(0, 10);
    }
    const search = query.toLowerCase();
    return items.filter((product: any) => {
      return (
        product.name?.toLowerCase().includes(search) ||
        product.sku?.toLowerCase().includes(search) ||
        product.barcode?.toLowerCase().includes(search)
      );
    });
  };

  // Handle submit form
  const handleSubmit = async () => {
    // Filter empty items
    const validItems = selectedItems.filter((i) => i.itemId !== "");
    if (validItems.length === 0) {
      toast.error(
        isBangla ? "অন্তত একটি পণ্য যোগ করুন" : "Add at least one item",
      );
      return;
    }

    const payload = {
      supplierId: selectedSupplierId || undefined,
      invoiceNo: invoiceNo || undefined,
      items: validItems.map((item) => ({
        itemId: item.itemId,
        itemName: item.itemName,
        quantity: item.quantity,
        unitCost: item.unitCost,
        discount: item.discountFlat,
        trackBatch: true,
        expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        manufactureDate: new Date().toISOString(),
      })),
      discount: totalDiscount,
      paidAmount: effectivePaidAmount,
      paymentMethod,
      notes: notes || undefined,
    };

    mutate(payload, {
      onSuccess: () => {
        toast.success(
          isBangla
            ? "ক্রয় সফলভাবে সম্পন্ন হয়েছে"
            : "Purchase completed successfully",
        );
        router.push("/purchases");
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Section */}
      <div className="flex items-center justify-between pb-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          {isBangla ? "নতুন ক্রয়" : "New Purchase"}
        </h1>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {isBangla ? "পেছনে" : "Back"}
        </Button>
      </div>

      <div className="space-y-6">
        {/* Row 1 Layout: Select Supplier, Invoice No, Invoice Date */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* Select Supplier */}
          <div className="relative space-y-2">
            <Label className="text-sm font-medium text-foreground">
              {isBangla ? "সরবরাহকারী নির্বাচন করুন" : "Select Supplier"}
            </Label>
            <div className="relative">
              <Input
                value={selectedSupplierName || supplierSearchQuery}
                onChange={(e) => {
                  setSupplierSearchQuery(e.target.value);
                  if (selectedSupplierId) setSelectedSupplierId("");
                  setShowSupplierSuggestions(true);
                }}
                onFocus={() => setShowSupplierSuggestions(true)}
                onBlur={() => {
                  setTimeout(() => setShowSupplierSuggestions(false), 200);
                }}
                placeholder={isBangla ? "সরবরাহকারী খুঁজুন..." : "Search for supplier"}
                className="pr-10 h-11 bg-background/50 border-input"
              />
              <Users className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

              {showSupplierSuggestions && (
                <div className="absolute z-50 left-0 top-full mt-1 w-full bg-card border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto divide-y divide-border">
                  {filteredSuppliers.length === 0 ? (
                    <div className="p-3 text-center text-sm text-muted-foreground">
                      {isBangla
                        ? "কোনো সরবরাহকারী পাওয়া যায়নি"
                        : "No suppliers found"}
                    </div>
                  ) : (
                    filteredSuppliers.map((supplier: any) => (
                      <button
                        key={supplier.id}
                        type="button"
                        className="w-full text-left p-3 hover:bg-muted/80 text-sm transition-colors flex justify-between"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setSelectedSupplierId(supplier.id);
                          setSupplierSearchQuery("");
                          setShowSupplierSuggestions(false);
                        }}
                      >
                        <span className="font-medium text-foreground">
                          {supplier.name}
                        </span>
                        {supplier.phone && (
                          <span className="text-xs text-muted-foreground">
                            {supplier.phone}
                          </span>
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Invoice No */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium text-foreground">
                {isBangla ? "ক্রয় নম্বর" : "Purchase No"}
              </Label>
              <button
                type="button"
                onClick={() => setIsManualInvoiceNo(!isManualInvoiceNo)}
                className="text-xs text-emerald-600 font-semibold hover:underline"
              >
                {isManualInvoiceNo
                  ? isBangla
                    ? "স্বয়ংক্রিয়"
                    : "Auto"
                  : isBangla
                    ? "ম্যানুয়াল"
                    : "Manual"}
              </button>
            </div>
            <Input
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
              disabled={!isManualInvoiceNo}
              placeholder={isBangla ? "স্বয়ংক্রিয় ক্রয়" : "Auto Generated"}
              className="h-11 bg-background/50 border-input font-medium"
            />
          </div>

          {/* Invoice Date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              {isBangla ? "ক্রয় তারিখ" : "Purchase Date"}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-11 justify-between text-left font-normal bg-background/50 border-input text-foreground hover:bg-muted"
                >
                  <span>{format(invoiceDate, "dd MMM yyyy")}</span>
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={invoiceDate}
                  onSelect={(date) => date && setInvoiceDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Row 2: Billing Items Table */}
        <div className="border border-border rounded-xl bg-card overflow-visible shadow-sm">
          <div className="overflow-visible">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b border-border text-muted-foreground text-xs font-semibold uppercase">
                  <th className="px-4 py-3 w-[8%]">
                    {isBangla ? "ক্রমিক" : "S.N."}
                  </th>
                  <th className="px-4 py-3 w-[35%]">
                    {isBangla ? "নাম" : "Name"}
                  </th>
                  <th className="px-4 py-3 w-[12%]">
                    {isBangla ? "পরিমাণ" : "Quantity"}
                  </th>
                  <th className="px-4 py-3 w-[15%]">
                    {isBangla ? "ক্রয় মূল্য / দর" : "Cost Price / Rate"}
                  </th>
                  <th className="px-4 py-3 w-[18%]">
                    {isBangla ? "ছাড়" : "Discount"}
                  </th>
                  <th className="px-4 py-3 w-[12%] text-right">
                    {isBangla ? "মোট" : "Amount"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {selectedItems.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-muted/10 transition-colors"
                  >
                    {/* SN */}
                    <td className="px-4 py-4 font-bold text-amber-500 align-middle">
                      {idx + 1}
                    </td>

                    {/* Name */}
                    <td className="px-4 py-3 align-middle relative">
                      <Input
                        value={
                          item.showSuggestions
                            ? item.searchQuery || ""
                            : item.itemName
                        }
                        placeholder={
                          isBangla ? "পণ্য নাম লিখুন" : "Search item..."
                        }
                        className="bg-transparent border-none outline-none focus-visible:ring-0 px-0 h-9"
                        onFocus={() => {
                          setSelectedItems((prev) =>
                            prev.map((i) =>
                              i.id === item.id
                                ? {
                                    ...i,
                                    searchQuery: i.itemName,
                                    showSuggestions: true,
                                  }
                                : i,
                            ),
                          );
                        }}
                        onChange={(e) =>
                          handleNameChange(item.id, e.target.value)
                        }
                        onBlur={() => handleRowBlur(item.id)}
                      />

                      {item.showSuggestions && (
                        <div className="absolute z-50 left-4 right-4 top-full mt-1 bg-card border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto divide-y divide-border">
                          {getFilteredProducts(item.searchQuery || "")
                            .length === 0 ? (
                            <div className="p-3 text-center text-sm text-muted-foreground">
                              {isBangla
                                ? "কোনো পণ্য পাওয়া যায়নি"
                                : "No items found"}
                            </div>
                          ) : (
                            getFilteredProducts(item.searchQuery || "").map(
                              (product: any) => (
                                <button
                                  key={product.id}
                                  type="button"
                                  className="w-full text-left p-3 hover:bg-muted/80 transition-colors flex justify-between"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleSelectProduct(item.id, product);
                                  }}
                                >
                                  <div>
                                    <p className="font-medium text-foreground">
                                      {product.name}
                                    </p>

                                    <p className="text-xs text-muted-foreground">
                                      SKU: {product.sku || "-"}
                                    </p>

                                    <p className="text-xs text-muted-foreground">
                                      Stock: {product.currentStock}{" "}
                                      {product.unit}
                                    </p>
                                  </div>

                                  <div className="text-right">
                                    <p className="font-semibold text-emerald-600">
                                      Tk. {product.costPrice}
                                    </p>
                                  </div>
                                </button>
                              ),
                            )
                          )}
                        </div>
                      )}
                    </td>
                    {/* Quantity */}
                    <td className="px-4 py-3 align-middle">
                      <Input
                        type="number"
                        value={item.quantity || ""}
                        onChange={(e) =>
                          handleQuantityChange(item.id, e.target.value)
                        }
                        className="bg-background/30 h-9 text-center border-input focus:ring-0"
                        min="1"
                      />
                    </td>

                    {/* Rate */}
                    <td className="px-4 py-3 align-middle">
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-xs text-muted-foreground font-medium">
                          Tk.
                        </span>
                        <Input
                          type="number"
                          value={item.unitCost || ""}
                          onChange={(e) =>
                            handleRateChange(item.id, e.target.value)
                          }
                          className="pl-9 bg-background/30 h-9 border-input focus:ring-0"
                          min="0"
                        />
                      </div>
                    </td>

                    {/* Discount (% and flat) */}
                    <td className="px-4 py-3 align-middle">
                      <div className="flex gap-1.5 items-center">
                        <div className="relative flex-1 flex items-center">
                          <Input
                            type="number"
                            value={item.discountPercent || ""}
                            onChange={(e) =>
                              handleDiscountPercentChange(
                                item.id,
                                e.target.value,
                              )
                            }
                            placeholder="0"
                            className="bg-background/30 h-9 text-right pr-6 border-input focus:ring-0"
                            min="0"
                            max="100"
                          />
                          <span className="absolute right-2 text-xs text-muted-foreground font-semibold">
                            %
                          </span>
                        </div>
                        <div className="relative flex-1 flex items-center">
                          <span className="absolute left-2.5 text-[10px] text-muted-foreground font-medium">
                            Tk.
                          </span>
                          <Input
                            type="number"
                            value={item.discountFlat || ""}
                            onChange={(e) =>
                              handleDiscountFlatChange(item.id, e.target.value)
                            }
                            placeholder="0"
                            className="pl-7 bg-background/30 h-9 text-right border-input focus:ring-0"
                            min="0"
                          />
                        </div>
                      </div>
                    </td>

                    {/* Amount & Action */}
                    <td className="px-4 py-3 align-middle text-right font-medium text-foreground">
                      <div className="flex items-center justify-end gap-3">
                        <span className="font-semibold text-foreground text-sm">
                          Tk. {item.total.toFixed(2)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItemRow(item.id)}
                          className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Bottom Add Action */}
          <div className="flex justify-between items-center px-6 py-4 bg-muted/10 border-t border-border">
            <button
              type="button"
              onClick={addItemRow}
              className="text-emerald-600 font-semibold text-sm flex items-center gap-1.5 hover:text-emerald-700 transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              {isBangla ? "বিল আইটেম যোগ করুন" : "Add Billing Item"}
            </button>
            <div className="flex items-center gap-8">
              <span className="text-sm text-muted-foreground font-medium">
                {isBangla ? "উপমোট" : "Sub Total"}
              </span>
              <span className="font-bold text-foreground text-base">
                Tk. {subtotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Row 3 Layout: Notes, Attachments, Totals and Payment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Notes and Attachments */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                {isBangla ? "নোট বা মন্তব্য" : "Notes or Remarks"}
              </Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  isBangla ? "নোট লিখুন..." : "Enter note or description..."
                }
                className="min-h-[100px] bg-background/50 border-input resize-none"
              />
            </div>

            {/* Attach Images */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                {isBangla ? "ছবি সংযুক্ত করুন" : "Attach Images"}
              </Label>
              <div className="flex flex-wrap gap-3 items-center">
                <button
                  type="button"
                  className="h-16 w-16 rounded-xl border border-dashed border-border flex flex-col items-center justify-center bg-background/30 hover:bg-muted/50 hover:border-emerald-600 transition-all text-muted-foreground hover:text-foreground"
                >
                  <Camera className="h-5 w-5 mb-1" />
                  <span className="text-[10px]">
                    {isBangla ? "ক্যামেরা" : "Upload"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Totals, Payment Mode and Submit Actions */}
          <div className="space-y-6 lg:pl-12">
            {/* Total Amount Output */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-base font-semibold text-foreground">
                {isBangla ? "সর্বমোট পরিমাণ" : "Total Amount"}
              </span>
              <div className="relative w-48 flex items-center">
                <span className="absolute left-3 text-sm text-muted-foreground font-semibold">
                  Tk.
                </span>
                <Input
                  value={total.toFixed(2)}
                  readOnly
                  className="pl-9 h-11 bg-muted/30 border-input text-right font-bold text-lg text-foreground focus-visible:ring-0"
                />
              </div>
            </div>

            {/* Payment Mode Selector */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-base font-semibold text-foreground">
                {isBangla ? "পেমেন্ট মোড" : "Payment Mode"}
              </span>
              <div className="w-48">
                <Select
                  value={paymentMethod}
                  onValueChange={(val: any) => setPaymentMethod(val)}
                >
                  <SelectTrigger className="h-11 bg-background/50 border-input text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">
                      {isBangla ? "নগদ (Cash)" : "Cash"}
                    </SelectItem>
                    <SelectItem value="card">
                      {isBangla ? "কার্ড (Card)" : "Card"}
                    </SelectItem>
                    <SelectItem value="mobile_banking">
                      {isBangla ? "মোবাইল ব্যাংকিং" : "Mobile Banking"}
                    </SelectItem>
                    <SelectItem value="credit">
                      {isBangla ? "বাকি (Credit)" : "Credit"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Paid Amount Input (if not Credit) */}
            {paymentMethod !== "credit" && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-base font-semibold text-foreground">
                  {isBangla ? "পরিশোধিত পরিমাণ" : "Paid Amount"}
                </span>
                <div className="relative w-48 flex items-center">
                  <span className="absolute left-3 text-sm text-muted-foreground font-semibold">
                    Tk.
                  </span>
                  <Input
                    type="number"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                    placeholder={total.toString()}
                    className="pl-9 h-11 bg-background/50 border-input text-right font-bold text-foreground"
                    min="0"
                  />
                </div>
              </div>
            )}

            {/* Due Alert */}
            {due > 0 && (
              <div className="p-3.5 bg-destructive/10 border border-destructive/20 rounded-xl flex justify-between items-center text-sm font-semibold">
                <span className="text-destructive">
                  {isBangla ? "বাকি পরিমাণ" : "Due Amount"}
                </span>
                <span className="text-destructive font-bold">
                  Tk. {due.toFixed(2)}
                </span>
              </div>
            )}

            {/* Submit Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1 h-11 border-input hover:bg-muted"
              >
                <X className="h-4 w-4 mr-2" />
                {isBangla ? "বাতিল" : "Cancel"}
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    {isBangla ? "সংরক্ষণ হচ্ছে..." : "Saving..."}
                  </span>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    {isBangla ? "স্টক যোগ করুন" : "Add Stock"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewPurchasePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <NewPurchaseContent />
    </Suspense>
  );
}
