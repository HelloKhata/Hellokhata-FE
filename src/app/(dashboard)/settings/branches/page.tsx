"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useToast } from "@/hooks/use-toast";
import { useBranchStore } from "@/stores/branchStore";
import { Branch } from "@/types";
import {
  Building2,
  CheckCircle2,
  Save,
  Loader2,
  RotateCcw,
  AlertCircle,
  Plus,
  Edit2,
  Eye,
  Trash2,
  MapPin,
  Phone,
  Store,
  Warehouse,
  X,
} from "lucide-react";
import { Button, Input } from "@/components/ui/premium";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

// Schema for Branch Settings
const branchSettingsSchema = z.object({
  name: z.string().min(2, "Branch name is required"),
  code: z.string().min(2, "Branch code is required"),
  email: z.string().email("Invalid email address").or(z.literal("")),
  phone: z.string().min(6, "Valid phone number is required"),
  address: z.string().min(2, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().optional(),
  country: z.string().default("Bangladesh"),
  postalCode: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
  openingDate: z.string().optional(),
  timeZone: z.string().default("Asia/Dhaka"),
  currency: z.string().default("BDT"),
  language: z.string().default("bn"),
});

type BranchSettingsFormValues = z.infer<typeof branchSettingsSchema>;

const EMPTY_BRANCH_VALUES: BranchSettingsFormValues = {
  name: "",
  code: "",
  email: "",
  phone: "",
  address: "",
  city: "Dhaka",
  state: "Dhaka Division",
  country: "Bangladesh",
  postalCode: "1200",
  status: "active",
  openingDate: new Date().toISOString().split("T")[0],
  timeZone: "Asia/Dhaka",
  currency: "BDT",
  language: "bn",
};

const INITIAL_BRANCHES: Branch[] = [
  {
    id: "br-01",
    businessId: "biz-01",
    name: "Dhanmondi Main Branch",
    nameBn: "ধানমন্ডি প্রধান শাখা",
    type: "main",
    address: "House 42, Road 7, Dhanmondi, Dhaka",
    phone: "01711223344",
    isActive: true,
    isMain: true,
    openingCash: 50000,
    currentCash: 125000,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2026-07-01"),
  },
  {
    id: "br-02",
    businessId: "biz-01",
    name: "Gulshan Retail Store",
    nameBn: "গুলশান রিটেইল স্টোর",
    type: "retail",
    address: "Plot 12, Block SE(C), Gulshan 1, Dhaka",
    phone: "01811998877",
    isActive: true,
    isMain: false,
    openingCash: 30000,
    currentCash: 84000,
    createdAt: new Date("2024-06-15"),
    updatedAt: new Date("2026-07-10"),
  },
  {
    id: "br-03",
    businessId: "biz-01",
    name: "Tejgaon Central Depot",
    nameBn: "তেজগাঁও কেন্দ্রীয় গোডাউন",
    type: "warehouse",
    address: "244 Tejgaon Industrial Area, Dhaka",
    phone: "01911445566",
    isActive: true,
    isMain: false,
    openingCash: 10000,
    currentCash: 45000,
    createdAt: new Date("2025-02-01"),
    updatedAt: new Date("2026-07-20"),
  },
];

export default function BranchManagementPage() {
  const { isBangla } = useAppTranslation();
  const { toast } = useToast();
  const {
    branches: storeBranches,
    addBranch: addBranchToStore,
    updateBranch: updateBranchInStore,
    removeBranch: removeBranchFromStore,
  } = useBranchStore();

  // Branches list
  const [branchesList, setBranchesList] = useState<Branch[]>(
    storeBranches.length > 0 ? storeBranches : INITIAL_BRANCHES
  );

  // Form Visibility State: null (hidden) | "create" | "edit"
  const [activeFormMode, setActiveFormMode] = useState<"create" | "edit" | null>(null);
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);

  // Modals for View Details and Delete
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [targetBranch, setTargetBranch] = useState<Branch | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  // React Hook Form
  const form = useForm<BranchSettingsFormValues>({
    resolver: zodResolver(branchSettingsSchema),
    defaultValues: EMPTY_BRANCH_VALUES,
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = form;

  // Open Form in CREATE mode with empty fields
  const handleOpenCreateForm = () => {
    if (isDirty && activeFormMode) {
      const confirmLeave = window.confirm(
        isBangla
          ? "আপনার অসংরক্ষিত পরিবর্তন রয়েছে। নতুন ফর্ম খুলবেন?"
          : "You have unsaved changes. Open empty create form anyway?"
      );
      if (!confirmLeave) return;
    }

    setActiveFormMode("create");
    setEditingBranchId(null);

    const nextCode = `BR-0${branchesList.length + 1}`;
    reset({
      ...EMPTY_BRANCH_VALUES,
      code: nextCode,
    });

    scrollToForm();
  };

  // Open Form in EDIT mode with branch details pre-filled
  const handleOpenEditForm = (branch: Branch) => {
    if (isDirty && activeFormMode) {
      const confirmLeave = window.confirm(
        isBangla
          ? "আপনার অসংরক্ষিত পরিবর্তন রয়েছে। অন্য ফর্ম খুলবেন?"
          : "You have unsaved changes. Switch editing branch anyway?"
      );
      if (!confirmLeave) return;
    }

    setActiveFormMode("edit");
    setEditingBranchId(branch.id);

    const index = branchesList.findIndex((b) => b.id === branch.id);
    reset({
      name: branch.name,
      code: `BR-${branch.name.substring(0, 2).toUpperCase()}-0${index >= 0 ? index + 1 : 1}`,
      email: `${branch.name.toLowerCase().replace(/\s+/g, "")}@smartstore.com`,
      phone: branch.phone || "",
      address: branch.address || "",
      city: "Dhaka",
      state: "Dhaka Division",
      country: "Bangladesh",
      postalCode: "1200",
      status: branch.isActive ? "active" : "inactive",
      openingDate: "2024-01-01",
      timeZone: "Asia/Dhaka",
      currency: "BDT",
      language: "bn",
    });

    scrollToForm();
  };

  // Close Form
  const handleCloseForm = () => {
    if (isDirty) {
      const confirmClose = window.confirm(
        isBangla ? "আপনার অসংরক্ষিত পরিবর্তন রয়েছে। ফর্মটি বন্ধ করবেন?" : "Discard unsaved changes?"
      );
      if (!confirmClose) return;
    }
    setActiveFormMode(null);
    setEditingBranchId(null);
    reset(EMPTY_BRANCH_VALUES);
  };

  const scrollToForm = () => {
    setTimeout(() => {
      const el = document.getElementById("branch-config-form");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  // Open View Details Modal
  const openViewDetailsModal = (branch: Branch) => {
    setTargetBranch(branch);
    setIsViewDetailsOpen(true);
  };

  // Open Delete Modal
  const openDeleteModal = (branch: Branch) => {
    setTargetBranch(branch);
    setIsDeleteDialogOpen(true);
  };

  // Submit Delete Branch
  const handleDeleteBranchSubmit = async () => {
    if (!targetBranch || targetBranch.isMain) return;

    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));

      setBranchesList((prev) => prev.filter((b) => b.id !== targetBranch.id));
      removeBranchFromStore(targetBranch.id);

      if (editingBranchId === targetBranch.id) {
        setActiveFormMode(null);
        setEditingBranchId(null);
      }

      toast({
        title: isBangla ? "শাখা মুছে ফেলা হয়েছে" : "Branch Deleted",
        description: isBangla
          ? `"${targetBranch.name}" মুছে ফেলা হয়েছে`
          : `"${targetBranch.name}" has been deleted.`,
      });

      setIsDeleteDialogOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  // Submit Form (Handles both CREATE and EDIT)
  const onSaveBranchForm = async (data: BranchSettingsFormValues) => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (activeFormMode === "create") {
        // CREATE NEW BRANCH
        const newBranch: Branch = {
          id: `br-${Date.now()}`,
          businessId: "biz-01",
          name: data.name.trim(),
          nameBn: data.name.trim(),
          type: "retail",
          address: data.address.trim(),
          phone: data.phone.trim(),
          openingCash: 0,
          currentCash: 0,
          isActive: data.status === "active",
          isMain: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        setBranchesList((prev) => [...prev, newBranch]);
        addBranchToStore(newBranch);

        toast({
          title: isBangla ? "নতুন শাখা তৈরি হয়েছে" : "Branch Created",
          description: isBangla
            ? `"${newBranch.name}" সফলভাবে তৈরি হয়েছে`
            : `"${newBranch.name}" created successfully.`,
        });
      } else if (activeFormMode === "edit" && editingBranchId) {
        // EDIT EXISTING BRANCH
        const updatedFields: Partial<Branch> = {
          name: data.name.trim(),
          address: data.address.trim(),
          phone: data.phone.trim(),
          isActive: data.status === "active",
        };

        setBranchesList((prev) =>
          prev.map((b) => (b.id === editingBranchId ? { ...b, ...updatedFields } : b))
        );
        updateBranchInStore(editingBranchId, updatedFields);

        toast({
          title: isBangla ? "শাখা সংফিগারেশন সেভ হয়েছে" : "Branch Saved",
          description: isBangla
            ? `"${data.name}" এর তথ্য আপডেট হয়েছে`
            : `Updated configuration for ${data.name}.`,
        });
      }

      reset(data);
    } catch (error: any) {
      toast({
        title: isBangla ? "ত্রুটি ঘটেছে" : "Save Error",
        description: error?.message || "Failed to save branch.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const editingBranchObj = branchesList.find((b) => b.id === editingBranchId);

  return (
    <div className="space-y-6 mx-auto pb-24">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
              <Building2 className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  {isBangla ? "শাখা পরিচালনা ও সেটিংস" : "Branch Settings & Management"}
                </h1>
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/20 text-[10px]"
                >
                  {branchesList.length} {isBangla ? "টি শাখা" : "Branches"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {isBangla
                  ? "নতুন শাখা তৈরি করুন, বিদ্যমান শাখা সম্পাদনা করুন এবং সিলেক্ট করা শাখার কনফিগারেশন আপডেট করুন"
                  : "Create new branches, edit existing locations, view details, and manage branch configurations"}
              </p>
            </div>
          </div>

          {/* Add Branch Button */}
          <Button
            onClick={handleOpenCreateForm}
            className="rounded-xl shadow-xs shrink-0 font-medium cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-2" />
            {isBangla ? "নতুন শাখা তৈরি করুন" : "Create a new branch"}
          </Button>
        </div>

        {/* Existing Branches Grid Card List */}
        <div className="space-y-3 pt-2">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {isBangla ? "সকল শাখার তালিকা" : "All Branches List"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {branchesList.map((branch) => {
              const isSelectedForEdit = activeFormMode === "edit" && editingBranchId === branch.id;
              const isRetail = branch.type === "retail";
              const isWarehouse = branch.type === "warehouse";

              return (
                <div
                  key={branch.id}
                  className={cn(
                    "rounded-xl border p-4 transition-all relative flex flex-col justify-between space-y-3",
                    isSelectedForEdit
                      ? "border-primary bg-primary/5 ring-1 ring-primary/30 shadow-xs"
                      : "border-border/70 bg-background/60 hover:border-border hover:bg-muted/30"
                  )}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {isWarehouse ? (
                          <Warehouse className="h-4 w-4 text-indigo-500 shrink-0" />
                        ) : isRetail ? (
                          <Store className="h-4 w-4 text-emerald-500 shrink-0" />
                        ) : (
                          <Building2 className="h-4 w-4 text-primary shrink-0" />
                        )}
                        <h3 className="font-semibold text-sm text-foreground truncate">
                          {isBangla && branch.nameBn ? branch.nameBn : branch.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {branch.isMain && (
                          <Badge
                            variant="outline"
                            className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          >
                            Main
                          </Badge>
                        )}
                        <Badge
                          variant="secondary"
                          className="text-[10px] capitalize px-1.5 py-0"
                        >
                          {branch.type || "Retail"}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
                      <span className="truncate">{branch.address || "No address provided"}</span>
                    </p>

                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
                      <span>{branch.phone || "N/A"}</span>
                    </p>
                  </div>

                  {/* Actions for Branch */}
                  <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={isSelectedForEdit ? "default" : "outline"}
                      onClick={() => handleOpenEditForm(branch)}
                      className="h-8 rounded-lg text-xs flex-1 cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5 mr-1" />
                      {isSelectedForEdit
                        ? isBangla ? "সম্পাদনা চলছে" : "Editing..."
                        : isBangla ? "কনফিগার ও সম্পাদনা" : "Configure & Edit"}
                    </Button>

                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => openViewDetailsModal(branch)}
                        title={isBangla ? "বিস্তারিত দেখুন" : "View Details"}
                        className="h-8 w-8 rounded-lg cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                      </Button>

                      {!branch.isMain && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteModal(branch)}
                          title={isBangla ? "মুছে ফেলুন" : "Delete Branch"}
                          className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main General Branch Configuration Form (HIDDEN BY DEFAULT until user clicks Configure/Edit or Create) */}
      {activeFormMode !== null && (
        <form
          id="branch-config-form"
          onSubmit={handleSubmit(onSaveBranchForm)}
          className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6 scroll-mt-6 animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="flex items-center justify-between pb-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                {activeFormMode === "create" ? (
                  <Plus className="h-5 w-5" />
                ) : (
                  <Building2 className="h-5 w-5" />
                )}
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  {activeFormMode === "create"
                    ? isBangla ? "নতুন শাখা তৈরি করুন (Create a new branch)" : "Create a new branch"
                    : isBangla
                    ? `শাখা কনফিগার ও সম্পাদনা: ${editingBranchObj?.name || ""}`
                    : `Configure & Edit Branch: ${editingBranchObj?.name || ""}`}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activeFormMode === "create"
                    ? isBangla
                      ? "নতুন শাখার নাম, কোড, ঠিকানা ও যোগাযোগের তথ্য দিয়ে নিচের ফর্মটি পূরণ করুন"
                      : "Fill in the general information form below to create a new branch"
                    : isBangla
                    ? "শাখার নাম, কোড, স্থান এবং আঞ্চলিক সেটিংস আপডেট করুন"
                    : "Update core identity, location, and regional settings for this branch"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isDirty && (
                <span className="text-[10px] font-medium text-amber-600 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                  {isBangla ? "পরিবর্তিত" : "Unsaved Changes"}
                </span>
              )}

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleCloseForm}
                className="h-8 w-8 rounded-lg"
                title={isBangla ? "ফর্ম বন্ধ করুন" : "Close Form"}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Input Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Branch Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                {isBangla ? "ব্রাঞ্চের নাম *" : "Branch Name *"}
              </Label>
              <Input
                {...register("name")}
                placeholder={isBangla ? "ব্রাঞ্চের নাম (যেমন: উত্তরা শাখা)" : "Enter branch name (e.g. Uttara Branch)"}
                className="h-10 text-xs"
              />
              {errors.name && (
                <p className="text-[11px] text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Branch Code */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                {isBangla ? "ব্রাঞ্চ কোড *" : "Branch Code *"}
              </Label>
              <Input
                {...register("code")}
                placeholder="BR-04"
                className="h-10 text-xs font-mono"
              />
              {errors.code && (
                <p className="text-[11px] text-destructive">{errors.code.message}</p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                {isBangla ? "স্ট্যাটাস" : "Status"}
              </Label>
              <Select
                value={watch("status")}
                onValueChange={(val) =>
                  setValue("status", val as "active" | "inactive", {
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger className="h-10 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">
                    {isBangla ? "সক্রিয় (Active)" : "Active"}
                  </SelectItem>
                  <SelectItem value="inactive">
                    {isBangla ? "নিষ্ক্রিয় (Inactive)" : "Inactive"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                {isBangla ? "ইমেইল" : "Branch Email"}
              </Label>
              <Input
                type="email"
                {...register("email")}
                placeholder="branch@example.com"
                className="h-10 text-xs"
              />
              {errors.email && (
                <p className="text-[11px] text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                {isBangla ? "ফোন নম্বর *" : "Phone Number *"}
              </Label>
              <Input
                {...register("phone")}
                placeholder="01XXXXXXXXX"
                className="h-10 text-xs"
              />
              {errors.phone && (
                <p className="text-[11px] text-destructive">{errors.phone.message}</p>
              )}
            </div>

            {/* Opening Date */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                {isBangla ? "উদ্বোধনের তারিখ" : "Opening Date"}
              </Label>
              <Input
                type="date"
                {...register("openingDate")}
                className="h-10 text-xs"
              />
            </div>

            {/* Address (Span 2) */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-medium text-muted-foreground">
                {isBangla ? "ঠিকানা *" : "Street Address *"}
              </Label>
              <Input
                {...register("address")}
                placeholder={isBangla ? "ঠিকানা লিখুন" : "Enter street address"}
                className="h-10 text-xs"
              />
              {errors.address && (
                <p className="text-[11px] text-destructive">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                {isBangla ? "শহর *" : "City *"}
              </Label>
              <Input
                {...register("city")}
                placeholder="Dhaka"
                className="h-10 text-xs"
              />
              {errors.city && (
                <p className="text-[11px] text-destructive">{errors.city.message}</p>
              )}
            </div>

            {/* State */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                {isBangla ? "বিভাগ / রাজ্য" : "State / Division"}
              </Label>
              <Input
                {...register("state")}
                placeholder="Dhaka Division"
                className="h-10 text-xs"
              />
            </div>

            {/* Country */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                {isBangla ? "দেশ *" : "Country *"}
              </Label>
              <Input
                {...register("country")}
                placeholder="Bangladesh"
                className="h-10 text-xs"
              />
            </div>

            {/* Postal Code */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                {isBangla ? "পোস্টাল কোড" : "Postal Code"}
              </Label>
              <Input
                {...register("postalCode")}
                placeholder="1205"
                className="h-10 text-xs"
              />
            </div>

            {/* Time Zone */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                {isBangla ? "টাইম জোন" : "Time Zone"}
              </Label>
              <Select
                value={watch("timeZone")}
                onValueChange={(val) => setValue("timeZone", val, { shouldDirty: true })}
              >
                <SelectTrigger className="h-10 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Dhaka">Asia/Dhaka (GMT+6)</SelectItem>
                  <SelectItem value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</SelectItem>
                  <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Currency */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                {isBangla ? "মুদ্রা (Currency)" : "Currency"}
              </Label>
              <Select
                value={watch("currency")}
                onValueChange={(val) => setValue("currency", val, { shouldDirty: true })}
              >
                <SelectTrigger className="h-10 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BDT">BDT (৳ - Bangladeshi Taka)</SelectItem>
                  <SelectItem value="USD">USD ($ - US Dollar)</SelectItem>
                  <SelectItem value="EUR">EUR (€ - Euro)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Language */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                {isBangla ? "ডিফল্ট ভাষা" : "Default Language"}
              </Label>
              <Select
                value={watch("language")}
                onValueChange={(val) => setValue("language", val, { shouldDirty: true })}
              >
                <SelectTrigger className="h-10 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCloseForm}
              className="rounded-xl text-xs"
            >
              {isBangla ? "বাতিল করুন" : "Cancel"}
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSaving}
              className="rounded-xl text-xs font-medium"
            >
              {isSaving ? (
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              ) : activeFormMode === "create" ? (
                <Plus className="h-3.5 w-3.5 mr-1.5" />
              ) : (
                <Save className="h-3.5 w-3.5 mr-1.5" />
              )}
              {activeFormMode === "create"
                ? isBangla ? "শাখা তৈরি করুন" : "Create Branch"
                : isBangla ? "সংরক্ষণ করুন" : "Save Changes"}
            </Button>
          </div>
        </form>
      )}

      {/* Sticky Bottom Save Bar */}
      <div
        className={cn(
          "fixed bottom-4 left-4 right-4 sm:left-auto sm:right-8 z-50 transition-all duration-300 transform",
          isDirty && activeFormMode !== null
            ? "translate-y-0 opacity-100"
            : "translate-y-12 opacity-0 pointer-events-none"
        )}
      >
        <div className="bg-card/95 backdrop-blur-md border border-primary/30 shadow-xl rounded-2xl p-3 sm:px-5 flex items-center justify-between gap-4 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-medium text-amber-600 dark:text-amber-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>
              {isBangla
                ? "আপনার পরিবর্তনসমূহ সেভ করা হয়নি"
                : "Unsaved changes in branch form"}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => reset()}
              disabled={isSaving}
              className="rounded-xl text-xs"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              {isBangla ? "পুনরায় সেট" : "Reset"}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSubmit(onSaveBranchForm)}
              disabled={isSaving}
              className="rounded-xl text-xs font-medium"
            >
              {isSaving ? (
                <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5 mr-1" />
              )}
              {isBangla ? "সংরক্ষণ করুন" : "Save"}
            </Button>
          </div>
        </div>
      </div>

      {/* MODAL 1: View Branch Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              {isBangla ? "শাখার বিস্তারিত বিবরণ" : "Branch Details Overview"}
            </DialogTitle>
            <DialogDescription>
              {targetBranch?.name}
            </DialogDescription>
          </DialogHeader>

          {targetBranch && (
            <div className="space-y-4 py-2 text-xs">
              <div className="p-4 rounded-xl bg-muted/40 border border-border/50 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-border/40">
                  <span className="text-muted-foreground">{isBangla ? "শাখার নাম:" : "Branch Name:"}</span>
                  <span className="font-semibold text-foreground">{targetBranch.name}</span>
                </div>

                {targetBranch.nameBn && (
                  <div className="flex justify-between items-center pb-2 border-b border-border/40">
                    <span className="text-muted-foreground">{isBangla ? "নাম (বাংলা):" : "Name (Bangla):"}</span>
                    <span className="font-medium text-foreground">{targetBranch.nameBn}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pb-2 border-b border-border/40">
                  <span className="text-muted-foreground">{isBangla ? "শাখার ধরন:" : "Branch Type:"}</span>
                  <Badge variant="secondary" className="capitalize text-[10px]">
                    {targetBranch.type || "Retail"}
                  </Badge>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-border/40">
                  <span className="text-muted-foreground">{isBangla ? "ফোন নম্বর:" : "Phone:"}</span>
                  <span className="font-mono text-foreground">{targetBranch.phone || "N/A"}</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-border/40">
                  <span className="text-muted-foreground">{isBangla ? "ঠিকানা:" : "Address:"}</span>
                  <span className="text-right max-w-[200px] truncate text-foreground">
                    {targetBranch.address || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-border/40">
                  <span className="text-muted-foreground">{isBangla ? "বর্তমান ক্যাশ:" : "Current Cash:"}</span>
                  <span className="font-bold text-emerald-600">
                    ৳{(targetBranch.currentCash || 0).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{isBangla ? "তৈরির তারিখ:" : "Created At:"}</span>
                  <span className="text-muted-foreground">
                    {new Date(targetBranch.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              onClick={() => setIsViewDetailsOpen(false)}
              className="rounded-xl w-full"
            >
              {isBangla ? "বন্ধ করুন" : "Close"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              {isBangla ? "শাখা মুছে ফেলবেন?" : "Delete Branch?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {targetBranch?.isMain
                ? isBangla
                  ? "প্রধান শাখা মুছে ফেলা যাবে না।"
                  : "The main branch cannot be deleted."
                : isBangla
                  ? `আপনি কি "${targetBranch?.name}" শাখা মুছে ফেলতে চান? এই কাজটি পরিবর্তন করা যাবে না।`
                  : `Are you sure you want to delete "${targetBranch?.name}"? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl">
              {isBangla ? "বাতিল" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBranchSubmit}
              disabled={isSaving || targetBranch?.isMain}
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isBangla ? "মুছে ফেলুন" : "Delete Branch"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
