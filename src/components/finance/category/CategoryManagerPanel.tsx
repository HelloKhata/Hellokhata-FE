"use client";

import React, { useState } from "react";
import { CategoryOption } from "../money-entry/CategoryGrid";
import { Button, Input } from "@/components/ui/premium";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Edit2,
  Trash2,
  Tag,
  Loader2,
  X,
  Check,
  TrendingUp,
  Receipt,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface CategoryManagerPanelProps {
  mode: "income" | "expense";
  categories: CategoryOption[];
  onUpdateCategories: (categories: CategoryOption[]) => void;
  isBangla?: boolean;
}

export function CategoryManagerPanel({
  mode,
  categories,
  onUpdateCategories,
  isBangla = false,
}: CategoryManagerPanelProps) {
  const { toast } = useToast();
  const isIncome = mode === "income";

  // Form State for Adding / Editing Category
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [nameEn, setNameEn] = useState("");
  const [nameBn, setNameBn] = useState("");
  const [selectedColor, setSelectedColor] = useState("emerald");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const colorPresets = [
    { id: "emerald", label: "Emerald", bgClass: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30", selectedBgClass: "bg-emerald-600 text-white border-emerald-500" },
    { id: "sky", label: "Sky", bgClass: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30", selectedBgClass: "bg-sky-600 text-white border-sky-500" },
    { id: "purple", label: "Purple", bgClass: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30", selectedBgClass: "bg-purple-600 text-white border-purple-500" },
    { id: "amber", label: "Amber", bgClass: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30", selectedBgClass: "bg-amber-600 text-white border-amber-500" },
    { id: "rose", label: "Rose", bgClass: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30", selectedBgClass: "bg-rose-600 text-white border-rose-500" },
    { id: "teal", label: "Teal", bgClass: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30", selectedBgClass: "bg-teal-600 text-white border-teal-500" },
  ];

  const handleOpenAdd = () => {
    setEditingCategoryId(null);
    setNameEn("");
    setNameBn("");
    setSelectedColor(isIncome ? "emerald" : "rose");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (cat: CategoryOption) => {
    setEditingCategoryId(cat.id);
    setNameEn(cat.nameEn);
    setNameBn(cat.nameBn);
    setSelectedColor("emerald");
    setIsFormOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn.trim()) return;

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 350));
      const preset = colorPresets.find((c) => c.id === selectedColor) || colorPresets[0];

      if (editingCategoryId) {
        // Edit Existing Category
        const updatedList = categories.map((c) =>
          c.id === editingCategoryId
            ? {
                ...c,
                nameEn: nameEn.trim(),
                nameBn: nameBn.trim() || nameEn.trim(),
                bgClass: preset.bgClass,
                selectedBgClass: preset.selectedBgClass,
              }
            : c
        );
        onUpdateCategories(updatedList);
        toast({
          title: isBangla ? "ক্যাটাগরি আপডেট হয়েছে" : "Category Updated",
          description: `"${nameEn.trim()}" updated successfully.`,
        });
      } else {
        // Add New Category
        const newCat: CategoryOption = {
          id: `cat-${Date.now()}`,
          nameEn: nameEn.trim(),
          nameBn: nameBn.trim() || nameEn.trim(),
          icon: isIncome ? TrendingUp : Receipt,
          bgClass: preset.bgClass,
          selectedBgClass: preset.selectedBgClass,
        };
        onUpdateCategories([...categories, newCat]);
        toast({
          title: isBangla ? "নতুন ক্যাটাগরি তৈরি হয়েছে" : "Category Created",
          description: `"${newCat.nameEn}" added.`,
        });
      }

      setIsFormOpen(false);
      setNameEn("");
      setNameBn("");
      setEditingCategoryId(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = (catId: string) => {
    const confirmDelete = window.confirm(
      isBangla ? "আপনি কি ক্যাটাগরিটি মুছে ফেলতে চান?" : "Delete this category?"
    );
    if (!confirmDelete) return;

    const updated = categories.filter((c) => c.id !== catId);
    onUpdateCategories(updated);
    toast({
      title: isBangla ? "ক্যাটাগরি মুছে ফেলা হয়েছে" : "Category Deleted",
    });
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
      <div className="pb-3 border-b border-border/40 flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <Tag className="h-4 w-4 text-primary" />
          <span>
            {isIncome
              ? isBangla ? "আয় ক্যাটাগরি সমূহ" : "Income Categories"
              : isBangla ? "খরচ ক্যাটাগরি সমূহ" : "Expense Categories"}
          </span>
        </h3>

        {!isFormOpen && (
          <Button
            type="button"
            size="sm"
            onClick={handleOpenAdd}
            className="h-8 rounded-xl text-xs font-medium cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            {isBangla ? "নতুন ক্যাটাগরি" : "Add Category"}
          </Button>
        )}
      </div>

      {/* Inline Form for Add / Edit */}
      {isFormOpen && (
        <form
          onSubmit={handleSaveCategory}
          className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 space-y-3 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between pb-1 border-b border-primary/10">
            <span className="text-xs font-bold text-foreground">
              {editingCategoryId
                ? isBangla ? "ক্যাটাগরি সম্পাদনা" : "Edit Category"
                : isBangla ? "নতুন ক্যাটাগরি তৈরি" : "Add New Category"}
            </span>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-1">
            <Label className="text-[11px] font-medium text-muted-foreground">
              Name (English) *
            </Label>
            <Input
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="Category name"
              className="h-9 text-xs bg-background"
              required
            />
          </div>

          <div className="space-y-1">
            <Label className="text-[11px] font-medium text-muted-foreground">
              Name (Bangla)
            </Label>
            <Input
              value={nameBn}
              onChange={(e) => setNameBn(e.target.value)}
              placeholder="বাংলা নাম"
              className="h-9 text-xs bg-background"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsFormOpen(false)}
              className="h-8 text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="h-8 text-xs rounded-xl font-semibold"
            >
              {isSubmitting ? (
                <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5 mr-1" />
              )}
              Save
            </Button>
          </div>
        </form>
      )}

      {/* Category List View */}
      <div className="max-h-[340px] overflow-y-auto space-y-2 pr-1">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-card hover:bg-muted/30 transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={cn(
                    "p-2 rounded-lg border shrink-0 transition-transform group-hover:scale-105",
                    cat.bgClass
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">
                    {cat.nameEn}
                  </p>
                  {cat.nameBn && cat.nameBn !== cat.nameEn && (
                    <p className="text-[10.5px] text-muted-foreground truncate">
                      {cat.nameBn}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleOpenEdit(cat)}
                  className="h-7 w-7 rounded-lg hover:bg-muted"
                  title="Edit Category"
                >
                  <Edit2 className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="h-7 w-7 rounded-lg text-destructive hover:bg-destructive/10"
                  title="Delete Category"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
