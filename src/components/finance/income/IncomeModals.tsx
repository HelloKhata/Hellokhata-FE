"use client";

import React from "react";
import { Plus, Edit2, Trash2, Loader2, Save } from "lucide-react";
import { Button, Input } from "@/components/ui/premium";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import {
  INCOME_CATEGORY_ICONS,
  CATEGORY_COLOR_PRESETS,
  getIconComponentById,
  getCategoryColorStyles,
  toBnNum,
} from "./types";

interface IncomeModalsProps {
  // Add Category
  isAddCategoryOpen: boolean;
  setIsAddCategoryOpen: (open: boolean) => void;
  addCatNameEn: string;
  setAddCatNameEn: (val: string) => void;
  addCatNameBn: string;
  setAddCatNameBn: (val: string) => void;
  addCatColor: string;
  setAddCatColor: (val: string) => void;
  addCatIcon: string;
  setAddCatIcon: (val: string) => void;
  isCreatingCategory?: boolean;
  onCreateCategory: () => void;

  // Edit Category
  isEditCategoryOpen: boolean;
  setIsEditCategoryOpen: (open: boolean) => void;
  editCatNameEn: string;
  setEditCatNameEn: (val: string) => void;
  editCatNameBn: string;
  setEditCatNameBn: (val: string) => void;
  editCatColor: string;
  setEditCatColor: (val: string) => void;
  editCatIcon: string;
  setEditCatIcon: (val: string) => void;
  isUpdatingCategory?: boolean;
  onUpdateCategory: () => void;

  // View All Categories
  isViewAllCategoriesOpen: boolean;
  setIsViewAllCategoriesOpen: (open: boolean) => void;
  incomeCategories?: any[];
  loadingCategories?: boolean;
  onOpenEditCategory: (cat: any) => void;

  // Delete Category
  isDeleteCategoryOpen: boolean;
  setIsDeleteCategoryOpen: (open: boolean) => void;
  categoryToDelete: any;
  setCategoryToDelete: (cat: any) => void;
  isDeletingCategory?: boolean;
  onConfirmDeleteCategory: () => void;
  onPromptDeleteCategory: (cat: any) => void;

  isBangla: boolean;
}

export const IncomeModals: React.FC<IncomeModalsProps> = ({
  isAddCategoryOpen,
  setIsAddCategoryOpen,
  addCatNameEn,
  setAddCatNameEn,
  addCatNameBn,
  setAddCatNameBn,
  addCatColor,
  setAddCatColor,
  addCatIcon,
  setAddCatIcon,
  isCreatingCategory,
  onCreateCategory,

  isEditCategoryOpen,
  setIsEditCategoryOpen,
  editCatNameEn,
  setEditCatNameEn,
  editCatNameBn,
  setEditCatNameBn,
  editCatColor,
  setEditCatColor,
  editCatIcon,
  setEditCatIcon,
  isUpdatingCategory,
  onUpdateCategory,

  isViewAllCategoriesOpen,
  setIsViewAllCategoriesOpen,
  incomeCategories = [],
  loadingCategories,
  onOpenEditCategory,

  isDeleteCategoryOpen,
  setIsDeleteCategoryOpen,
  categoryToDelete,
  setCategoryToDelete,
  isDeletingCategory,
  onConfirmDeleteCategory,
  onPromptDeleteCategory,

  isBangla,
}) => {
  return (
    <>
      {/* 1. ADD INCOME CATEGORY MODAL */}
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-foreground">
                  {isBangla ? "নতুন আয় ক্যাটাগরি তৈরি" : "Add New Income Category"}
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isBangla
                    ? "আপনার ব্যবসার জন্য নতুন আয়ের খাত যুক্ত করুন"
                    : "Create a new category for classifying revenue streams"}
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                {isBangla ? "ক্যাটাগরির নাম (ইংরেজি)" : "Category Name (English)"} *
              </Label>
              <Input
                value={addCatNameEn}
                onChange={(e) => setAddCatNameEn(e.target.value)}
                placeholder="e.g. Consulting Fee"
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                {isBangla ? "ক্যাটাগরির নাম (বাংলা)" : "Category Name (Bangla)"}
              </Label>
              <Input
                value={addCatNameBn}
                onChange={(e) => setAddCatNameBn(e.target.value)}
                placeholder="যেমন: পরামর্শ ফি"
                className="h-9 text-xs"
              />
            </div>

            {/* Icon Selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                {isBangla ? "আইকন নির্বাচন" : "Select Icon"}
              </Label>
              <div className="grid grid-cols-6 gap-2">
                {INCOME_CATEGORY_ICONS.map((item) => {
                  const IconComp = item.icon;
                  const isSelected = addCatIcon === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAddCatIcon(item.id)}
                      className={cn(
                        "flex flex-col items-center justify-center p-2 rounded-xl border text-xs transition-all cursor-pointer",
                        isSelected
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-xs ring-1 ring-emerald-500"
                          : "border-border/70 bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                      )}
                      title={isBangla ? item.labelBn : item.labelEn}
                    >
                      <IconComp className="h-4 w-4" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                {isBangla ? "কালার থিম" : "Color Theme"}
              </Label>
              <div className="flex items-center gap-2.5 flex-wrap">
                {CATEGORY_COLOR_PRESETS.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setAddCatColor(col)}
                    style={{ backgroundColor: col }}
                    className={cn(
                      "h-7 w-7 rounded-full transition-transform cursor-pointer shadow-xs",
                      addCatColor.toLowerCase() === col.toLowerCase() &&
                        "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Live Preview Card */}
            <div className="pt-2">
              <Label className="text-[11px] font-medium text-muted-foreground">
                {isBangla ? "প্রিভিউ" : "Preview"}
              </Label>
              <div className="mt-1.5 flex items-center gap-3 p-2.5 rounded-xl border border-border bg-muted/20">
                {(() => {
                  const { bgColor, borderColor } = getCategoryColorStyles(addCatColor);
                  return (
                    <>
                      <div className={cn("p-2 rounded-lg border", bgColor, borderColor)}>
                        {React.createElement(getIconComponentById(addCatIcon), {
                          className: "h-4 w-4",
                        })}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">
                          {addCatNameEn.trim() || addCatNameBn.trim()
                            ? isBangla
                              ? addCatNameBn.trim() || addCatNameEn.trim()
                              : addCatNameEn.trim() || addCatNameBn.trim()
                            : isBangla
                            ? "ক্যাটাগরির নাম"
                            : "Category Name"}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddCategoryOpen(false)}
              className="text-xs h-9 rounded-xl cursor-pointer"
            >
              {isBangla ? "বাতিল" : "Cancel"}
            </Button>
            <Button
              type="button"
              onClick={onCreateCategory}
              disabled={isCreatingCategory}
              className="text-xs h-9 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              {isCreatingCategory ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>{isBangla ? "সংরক্ষণ করা হচ্ছে..." : "Creating..."}</span>
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  <span>{isBangla ? "ক্যাটাগরি তৈরি করুন" : "Create Category"}</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. EDIT INCOME CATEGORY MODAL */}
      <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Edit2 className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-foreground">
                  {isBangla ? "আয় ক্যাটাগরি সম্পাদনা" : "Edit Income Category"}
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isBangla
                    ? "ক্যাটাগরির তথ্য, নাম, আইকন এবং রঙ পরিবর্তন করুন"
                    : "Modify category name, visual icon and color scheme"}
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                {isBangla ? "ক্যাটাগরির নাম (ইংরেজি)" : "Category Name (English)"} *
              </Label>
              <Input
                value={editCatNameEn}
                onChange={(e) => setEditCatNameEn(e.target.value)}
                placeholder="e.g. Consulting Fee"
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                {isBangla ? "ক্যাটাগরির নাম (বাংলা)" : "Category Name (Bangla)"}
              </Label>
              <Input
                value={editCatNameBn}
                onChange={(e) => setEditCatNameBn(e.target.value)}
                placeholder="যেমন: পরামর্শ ফি"
                className="h-9 text-xs"
              />
            </div>

            {/* Icon Selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                {isBangla ? "আইকন নির্বাচন" : "Select Icon"}
              </Label>
              <div className="grid grid-cols-6 gap-2">
                {INCOME_CATEGORY_ICONS.map((item) => {
                  const IconComp = item.icon;
                  const isSelected = editCatIcon === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setEditCatIcon(item.id)}
                      className={cn(
                        "flex flex-col items-center justify-center p-2 rounded-xl border text-xs transition-all cursor-pointer",
                        isSelected
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-xs ring-1 ring-emerald-500"
                          : "border-border/70 bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                      )}
                      title={isBangla ? item.labelBn : item.labelEn}
                    >
                      <IconComp className="h-4 w-4" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                {isBangla ? "কালার থিম" : "Color Theme"}
              </Label>
              <div className="flex items-center gap-2.5 flex-wrap">
                {CATEGORY_COLOR_PRESETS.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setEditCatColor(col)}
                    style={{ backgroundColor: col }}
                    className={cn(
                      "h-7 w-7 rounded-full transition-transform cursor-pointer shadow-xs",
                      editCatColor.toLowerCase() === col.toLowerCase() &&
                        "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Live Preview Card */}
            <div className="pt-2">
              <Label className="text-[11px] font-medium text-muted-foreground">
                {isBangla ? "প্রিভিউ" : "Preview"}
              </Label>
              <div className="mt-1.5 flex items-center gap-3 p-2.5 rounded-xl border border-border bg-muted/20">
                {(() => {
                  const { bgColor, borderColor } = getCategoryColorStyles(editCatColor);
                  return (
                    <>
                      <div className={cn("p-2 rounded-lg border", bgColor, borderColor)}>
                        {React.createElement(getIconComponentById(editCatIcon), {
                          className: "h-4 w-4",
                        })}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">
                          {editCatNameEn.trim() || editCatNameBn.trim()
                            ? isBangla
                              ? editCatNameBn.trim() || editCatNameEn.trim()
                              : editCatNameEn.trim() || editCatNameBn.trim()
                            : isBangla
                            ? "ক্যাটাগরির নাম"
                            : "Category Name"}
                        </p>
                        <p className="text-[11px] text-muted-foreground font-mono">
                          {isBangla ? "আয় ক্যাটাগরি" : "Income Category"}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditCategoryOpen(false)}
              className="text-xs h-9 rounded-xl cursor-pointer"
            >
              {isBangla ? "বাতিল" : "Cancel"}
            </Button>
            <Button
              type="button"
              onClick={onUpdateCategory}
              disabled={isUpdatingCategory}
              className="text-xs h-9 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              {isUpdatingCategory ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>{isBangla ? "সংরক্ষণ করা হচ্ছে..." : "Saving..."}</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span>{isBangla ? "পরিবর্তন সংরক্ষণ করুন" : "Save Changes"}</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. VIEW ALL CATEGORIES DIALOG */}
      <Dialog open={isViewAllCategoriesOpen} onOpenChange={setIsViewAllCategoriesOpen}>
        <DialogContent className="sm:max-w-lg bg-card border-border max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">
              {isBangla
                ? `সকল আয় ক্যাটাগরি (${incomeCategories ? toBnNum(incomeCategories.length) : 0}টি)`
                : `All Income Categories (${incomeCategories?.length || 0})`}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {loadingCategories ? (
              <div className="flex items-center justify-center py-8 text-xs text-muted-foreground gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                <span>{isBangla ? "ক্যাটাগরি লোড হচ্ছে..." : "Loading categories..."}</span>
              </div>
            ) : !incomeCategories || incomeCategories.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                {isBangla ? "কোনো ক্যাটাগরি নেই" : "No categories found"}
              </div>
            ) : (
              incomeCategories.map((c: any) => {
                const { bgColor, borderColor } = getCategoryColorStyles(
                  c.color || "#10b981"
                );

                return (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg border", bgColor, borderColor)}>
                        {React.createElement(getIconComponentById(c.icon), {
                          className: "h-4 w-4",
                        })}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">
                          {isBangla ? c.nameBn || c.name : c.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsViewAllCategoriesOpen(false);
                          onOpenEditCategory(c);
                        }}
                        className="text-muted-foreground hover:text-foreground p-1 cursor-pointer"
                        title={isBangla ? "সম্পাদনা" : "Edit"}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onPromptDeleteCategory(c)}
                        className="text-muted-foreground hover:text-rose-400 p-1 cursor-pointer"
                        title={isBangla ? "মুছে ফেলুন" : "Delete"}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 4. DELETE CATEGORY CONFIRMATION DIALOG */}
      <AlertDialog open={isDeleteCategoryOpen} onOpenChange={setIsDeleteCategoryOpen}>
        <AlertDialogContent className="sm:max-w-[400px] bg-card border-border">
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <AlertDialogTitle className="text-base font-bold text-foreground">
                  {isBangla ? "ক্যাটাগরি মুছে ফেলতে চান?" : "Delete Income Category?"}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-xs text-muted-foreground mt-1">
                  {isBangla
                    ? "আপনি কি নিশ্চিত যে এই ক্যাটাগরি মুছে ফেলতে চান? এই পরিবর্তনটি পুনরুদ্ধার করা সম্ভব নয়।"
                    : "Are you sure you want to delete this category? This action cannot be undone."}
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>

          {categoryToDelete && (
            <div className="py-2">
              <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/20">
                {(() => {
                  const { bgColor, borderColor } = getCategoryColorStyles(
                    categoryToDelete.color || "#10b981"
                  );
                  return (
                    <>
                      <div className={cn("p-2 rounded-lg border", bgColor, borderColor)}>
                        {React.createElement(
                          getIconComponentById(categoryToDelete.icon),
                          { className: "h-4 w-4" }
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">
                          {isBangla
                            ? categoryToDelete.nameBn || categoryToDelete.name
                            : categoryToDelete.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {isBangla ? "আয় ক্যাটাগরি" : "Income Category"}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel
              disabled={isDeletingCategory}
              onClick={() => {
                setIsDeleteCategoryOpen(false);
                setCategoryToDelete(null);
              }}
              className="text-xs h-9 rounded-xl cursor-pointer"
            >
              {isBangla ? "বাতিল" : "Cancel"}
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              onClick={onConfirmDeleteCategory}
              disabled={isDeletingCategory}
              className="text-xs h-9 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              {isDeletingCategory ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>{isBangla ? "মুছে ফেলা হচ্ছে..." : "Deleting..."}</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>{isBangla ? "মুছে ফেলুন" : "Delete Category"}</span>
                </>
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
