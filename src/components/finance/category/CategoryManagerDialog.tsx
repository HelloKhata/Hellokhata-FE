"use client";

import React, { useState } from "react";
import { CategoryOption } from "../money-entry/CategoryGrid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button, Input } from "@/components/ui/premium";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Edit2,
  Trash2,
  Tag,
  Loader2,
  ShoppingCart,
  TrendingUp,
  Landmark,
  Building2,
  Coins,
  Percent,
  Home,
  Zap,
  Users,
  Package,
  Truck,
  Receipt,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface CategoryManagerDialogProps {
  mode: "income" | "expense";
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryOption[];
  onUpdateCategories: (categories: CategoryOption[]) => void;
  isBangla?: boolean;
}

export function CategoryManagerDialog({
  mode,
  isOpen,
  onClose,
  categories,
  onUpdateCategories,
  isBangla = false,
}: CategoryManagerDialogProps) {
  const { toast } = useToast();

  const isIncome = mode === "income";

  // Mode inside dialog: "list" | "add" | "edit"
  const [dialogMode, setDialogMode] = useState<"list" | "add" | "edit">("list");
  const [editingCategory, setEditingCategory] = useState<CategoryOption | null>(null);

  // Form State for Add / Edit
  const [formNameEn, setFormNameEn] = useState("");
  const [formNameBn, setFormNameBn] = useState("");
  const [selectedColor, setSelectedColor] = useState("emerald");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Colors preset options
  const colorPresets = [
    { id: "emerald", label: "Emerald Green", bgClass: "bg-emerald-600/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400", selectedBgClass: "bg-emerald-600 text-white border-emerald-500" },
    { id: "sky", label: "Sky Blue", bgClass: "bg-sky-600/15 border-sky-500/30 text-sky-600 dark:text-sky-400", selectedBgClass: "bg-sky-600 text-white border-sky-500" },
    { id: "purple", label: "Purple", bgClass: "bg-purple-600/15 border-purple-500/30 text-purple-600 dark:text-purple-400", selectedBgClass: "bg-purple-600 text-white border-purple-500" },
    { id: "amber", label: "Amber", bgClass: "bg-amber-600/15 border-amber-500/30 text-amber-600 dark:text-amber-400", selectedBgClass: "bg-amber-600 text-white border-amber-500" },
    { id: "rose", label: "Rose", bgClass: "bg-rose-600/15 border-rose-500/30 text-rose-600 dark:text-rose-400", selectedBgClass: "bg-rose-600 text-white border-rose-500" },
    { id: "teal", label: "Teal", bgClass: "bg-teal-600/15 border-teal-500/30 text-teal-600 dark:text-teal-400", selectedBgClass: "bg-teal-600 text-white border-teal-500" },
  ];

  // Open Add Category Form
  const handleOpenAdd = () => {
    setFormNameEn("");
    setFormNameBn("");
    setSelectedColor(isIncome ? "emerald" : "rose");
    setEditingCategory(null);
    setDialogMode("add");
  };

  // Open Edit Category Form
  const handleOpenEdit = (cat: CategoryOption) => {
    setEditingCategory(cat);
    setFormNameEn(cat.nameEn);
    setFormNameBn(cat.nameBn);
    setSelectedColor("emerald");
    setDialogMode("edit");
  };

  // Save Category (Add or Edit)
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNameEn.trim()) {
      toast({
        title: isBangla ? "তথ্য অসম্পূর্ণ" : "Name Required",
        description: isBangla ? "ক্যাটাগরির নাম আবশ্যক" : "Category name is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));

      const preset = colorPresets.find((c) => c.id === selectedColor) || colorPresets[0];

      if (dialogMode === "add") {
        const newCat: CategoryOption = {
          id: `cat-${Date.now()}`,
          nameEn: formNameEn.trim(),
          nameBn: formNameBn.trim() || formNameEn.trim(),
          icon: isIncome ? TrendingUp : Receipt,
          bgClass: preset.bgClass,
          selectedBgClass: preset.selectedBgClass,
        };

        onUpdateCategories([...categories, newCat]);
        toast({
          title: isBangla ? "নতুন ক্যাটাগরি তৈরি হয়েছে" : "Category Created",
          description: `"${newCat.nameEn}" added to ${mode} categories.`,
        });
      } else if (dialogMode === "edit" && editingCategory) {
        const updatedList = categories.map((c) =>
          c.id === editingCategory.id
            ? {
                ...c,
                nameEn: formNameEn.trim(),
                nameBn: formNameBn.trim() || formNameEn.trim(),
                bgClass: preset.bgClass,
                selectedBgClass: preset.selectedBgClass,
              }
            : c
        );

        onUpdateCategories(updatedList);
        toast({
          title: isBangla ? "ক্যাটাগরি আপডেট করা হয়েছে" : "Category Updated",
          description: `Updated category "${formNameEn.trim()}".`,
        });
      }

      setDialogMode("list");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Category
  const handleDeleteCategory = (catId: string) => {
    const confirmDelete = window.confirm(
      isBangla ? "আপনি কি ক্যাটাগরিটি মুছে ফেলতে চান?" : "Are you sure you want to delete this category?"
    );
    if (!confirmDelete) return;

    const updatedList = categories.filter((c) => c.id !== catId);
    onUpdateCategories(updatedList);
    toast({
      title: isBangla ? "ক্যাটাগরি মুছে ফেলা হয়েছে" : "Category Deleted",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            {isIncome
              ? isBangla ? "আয় ক্যাটাগরি ব্যবস্থাপনা" : "Manage Income Categories"
              : isBangla ? "খরচ ক্যাটাগরি ব্যবস্থাপনা" : "Manage Expense Categories"}
          </DialogTitle>
          <DialogDescription>
            {isBangla
              ? "নতুন ক্যাটাগরি যোগ করুন, সম্পাদন বা মুছে ফেলুন"
              : "Add new categories, edit names, or remove existing options"}
          </DialogDescription>
        </DialogHeader>

        {dialogMode === "list" ? (
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {isBangla ? "বিদ্যমান ক্যাটাগরি সমূহ" : "Category List"} ({categories.length})
              </span>

              <Button
                type="button"
                size="sm"
                onClick={handleOpenAdd}
                className="h-8 rounded-xl text-xs font-medium cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                {isBangla ? "নতুন ক্যাটাগরি" : "Add New Category"}
              </Button>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-card hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg border shrink-0", cat.bgClass)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">{cat.nameEn}</p>
                        <p className="text-[10.5px] text-muted-foreground">{cat.nameBn}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(cat)}
                        className="h-7 w-7 rounded-lg"
                        title={isBangla ? "সম্পাদনা করুন" : "Edit"}
                      >
                        <Edit2 className="h-3.5 w-3.5 text-muted-foreground hover:text-primary" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="h-7 w-7 rounded-lg text-destructive hover:bg-destructive/10"
                        title={isBangla ? "মুছে ফেলুন" : "Delete"}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" onClick={onClose} className="rounded-xl w-full">
                {isBangla ? "বন্ধ করুন" : "Close"}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSaveCategory} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs font-medium">{isBangla ? "ক্যাটাগরি নাম (English) *" : "Category Name (English) *"}</Label>
              <Input
                value={formNameEn}
                onChange={(e) => setFormNameEn(e.target.value)}
                placeholder="e.g. Consulting Fee"
                className="h-10 text-xs"
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium">{isBangla ? "ক্যাটাগরি নাম (বাংলা)" : "Category Name (Bangla)"}</Label>
              <Input
                value={formNameBn}
                onChange={(e) => setFormNameBn(e.target.value)}
                placeholder="যেমন: কনসাল্টিং ফি"
                className="h-10 text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium">{isBangla ? "কালার থিম" : "Color Theme"}</Label>
              <div className="flex flex-wrap gap-2">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedColor(preset.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer",
                      selectedColor === preset.id
                        ? preset.selectedBgClass
                        : preset.bgClass
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogMode("list")}
                className="rounded-xl"
              >
                {isBangla ? "ফিরে যান" : "Back to List"}
              </Button>
              <Button type="submit" disabled={isSubmitting} className="rounded-xl font-medium">
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {dialogMode === "add"
                  ? isBangla ? "তৈরি করুন" : "Create Category"
                  : isBangla ? "আপডেট করুন" : "Update Category"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
