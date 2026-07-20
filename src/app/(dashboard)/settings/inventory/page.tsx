// Hello Khata OS - Inventory Settings Page
// হ্যালো খাতা - ইনভেন্টরি সেটিংস পেজ

'use client';

import { useState, useCallback } from 'react';
import { Button, Card, Badge } from '@/components/ui/premium';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { useCategories } from '@/hooks/queries';
import {
  Package,
  AlertTriangle,
  Bell,
  Save,
  Loader2,
  Settings,
  TrendingDown,
  Shield,
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  FolderOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useSessionStore } from '@/stores/sessionStore';
import { useNavigation } from '@/stores/uiStore';
import { ArrowLeft } from 'lucide-react';
import { useGetInventorySettings, useUpdateInventorySettings } from '@/hooks/api/useSettings';
import { toast } from 'sonner';

// Settings input component using shadcn/ui Input with full width
const SettingsInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  suffix,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  suffix?: string;
}) => (
  <div className="w-full space-y-2">
    <Label className="text-xs font-medium text-muted-foreground">
      {label}
    </Label>
    <div className="relative w-full">
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn('h-11 w-full', suffix && 'pr-12')}
      />
      {suffix && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  </div>
);

// Section header component
const SectionHeader = ({
  icon: Icon,
  title,
  description,
  iconColor = 'primary',
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
  iconColor?: 'primary' | 'indigo' | 'warning' | 'emerald';
}) => {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    indigo: 'bg-indigo/10 text-indigo',
    warning: 'bg-warning/10 text-warning',
    emerald: 'bg-emerald/10 text-emerald',
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-foreground flex items-center gap-3">
        <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center', colorClasses[iconColor])}>
          <Icon className="h-4 w-4" />
        </div>
        {title}
      </h2>
      {description && (
        <p className="text-sm text-muted-foreground mt-1.5 ml-11">
          {description}
        </p>
      )}
    </div>
  );
};

// Settings card component with full width
const SettingsCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      'w-full rounded-2xl p-6',
      'bg-card border border-border',
      className
    )}
  >
    {children}
  </div>
);

// Toggle row component
const ToggleRow = ({
  icon: Icon,
  title,
  description,
  checked,
  onCheckedChange,
  disabled = false,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}) => (
  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border w-full">
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="font-medium text-foreground text-sm">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
    <Switch checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
  </div>
);

export interface InventorySettingsFormState {
  lowStockThreshold: number;
  lowStockAlerts: boolean;
  stockWarningNotifications: boolean;
}

interface InventorySettingsFormProps {
  initialSettings?: {
    lowStockThreshold?: number;
    lowStockAlerts?: boolean;
    stockWarningNotifications?: boolean;
  };
  isBangla: boolean;
}

function InventorySettingsForm({ initialSettings, isBangla }: InventorySettingsFormProps) {
  const [formState, setFormState] = useState<InventorySettingsFormState>(() => ({
    lowStockThreshold: initialSettings?.lowStockThreshold ?? 10,
    lowStockAlerts: initialSettings?.lowStockAlerts ?? true,
    stockWarningNotifications: initialSettings?.stockWarningNotifications ?? true,
  }));

  const { mutate: updateSettings, isPending: isSaving } = useUpdateInventorySettings();

  const handleSave = useCallback(() => {
    updateSettings(formState, {
      onSuccess: () => {
        toast.success(isBangla ? 'সফল হয়েছে' : 'Success', {
          description: isBangla
            ? 'ইনভেন্টরি সেটিংস সংরক্ষিত হয়েছে'
            : 'Inventory settings saved successfully',
        });
      },
    });
  }, [formState, updateSettings, isBangla]);

  const handleThresholdChange = useCallback((value: string) => {
    setFormState((prev) => ({
      ...prev,
      lowStockThreshold: parseInt(value, 10) || 0,
    }));
  }, []);

  const handleAlertsChange = useCallback((checked: boolean) => {
    setFormState((prev) => ({
      ...prev,
      lowStockAlerts: checked,
    }));
  }, []);

  const handleNotificationsChange = useCallback((checked: boolean) => {
    setFormState((prev) => ({
      ...prev,
      stockWarningNotifications: checked,
    }));
  }, []);

  return (
    <div className="space-y-6 max-w-[800px]">
      {/* Low Stock Settings */}
      <SettingsCard>
        <SectionHeader
          icon={TrendingDown}
          title={isBangla ? 'লো স্টক থ্রেশহোল্ড' : 'Low Stock Threshold'}
          description={isBangla
            ? 'যে পরিমাণের নিচে স্টক কম বলে গণ্য হবে'
            : 'Stock quantity below this will be considered low'}
          iconColor="warning"
        />

        <div className="w-full sm:w-80 space-y-3">
          <SettingsInput
            label={isBangla ? 'ডিফল্ট থ্রেশহোল্ড' : 'Default Threshold'}
            type="number"
            value={formState.lowStockThreshold}
            onChange={handleThresholdChange}
            placeholder="10"
            suffix={isBangla ? 'পিস' : 'pcs'}
          />
          <p className="text-xs text-muted-foreground">
            {isBangla
              ? 'স্টক এই সংখ্যার নিচে নামলে লো স্টক এলার্ট দেখাবে'
              : 'Alert will show when stock falls below this number'}
          </p>
        </div>

        {/* Preview */}
        <div className="mt-4 p-4 rounded-xl bg-muted/30 border border-border w-full sm:w-80">
          <p className="text-xs text-muted-foreground mb-2">
            {isBangla ? 'উদাহরণ:' : 'Example:'}
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-foreground">
                  {isBangla ? 'পণ্য A' : 'Product A'}
                </span>
                <span className="text-sm font-medium text-warning flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {formState.lowStockThreshold} {isBangla ? 'পিস' : 'pcs'}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-warning to-warning/70 rounded-full"
                  style={{
                    width: `${
                      formState.lowStockThreshold <= 0
                        ? 100
                        : Math.min((5 / formState.lowStockThreshold) * 50, 100)
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </SettingsCard>

      {/* Alert Settings */}
      <SettingsCard>
        <SectionHeader
          icon={Bell}
          title={isBangla ? 'এলার্ট সেটিংস' : 'Alert Settings'}
          description={isBangla
            ? 'স্টক সংক্রান্ত নোটিফিকেশন সেটিংস'
            : 'Configure stock-related notifications'}
          iconColor="primary"
        />

        <div className="space-y-3 w-full">
          <ToggleRow
            icon={AlertTriangle}
            title={isBangla ? 'লো স্টক এলার্ট' : 'Low Stock Alerts'}
            description={isBangla
              ? 'স্টক কম হলে এলার্ট দেখাবে'
              : 'Show alerts when stock is low'}
            checked={formState.lowStockAlerts}
            onCheckedChange={handleAlertsChange}
          />

          <ToggleRow
            icon={Bell}
            title={isBangla ? 'স্টক ওয়ার্নিং নোটিফিকেশন' : 'Stock Warning Notifications'}
            description={isBangla
              ? 'ড্যাশবোর্ডে ওয়ার্নিং দেখাবে'
              : 'Show warnings on dashboard'}
            checked={formState.stockWarningNotifications}
            onCheckedChange={handleNotificationsChange}
          />
        </div>
      </SettingsCard>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="h-11 px-8 rounded-xl font-medium text-sm"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {isBangla ? 'সংরক্ষণ করুন' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}

export default function InventorySettingsPage() {
  const { isBangla } = useAppTranslation();
  const { navigateTo } = useNavigation();

  // get inventory settings from API on mount and populate form
  const { data: inventorySettings, isLoading, refetch } = useGetInventorySettings();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigateTo('settings')}
            className="rounded-lg"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              {isBangla ? 'ইনভেন্টরি সেটিংস' : 'Inventory Settings'}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isBangla
                ? 'স্টক ও ইনভেন্টরি সংক্রান্ত সেটিংস'
                : 'Configure stock and inventory settings'}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => refetch()}
          disabled={isLoading}
          className="rounded-lg"
        >
          <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <InventorySettingsForm
          key={inventorySettings ? 'loaded' : 'loading'}
          initialSettings={inventorySettings}
          isBangla={isBangla}
        />
      )}

      {/* Add Category Dialog */}
      {/* <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isBangla ? 'নতুন ক্যাটাগরি' : 'Add Category'}</DialogTitle>
            <DialogDescription>
              {isBangla ? 'একটি নতুন পণ্য ক্যাটাগরি যোগ করুন' : 'Add a new product category'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{isBangla ? 'নাম (ইংরেজি)' : 'Name (English)'}</Label>
              <Input
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                placeholder="Category name"
              />
            </div>
            <div className="space-y-2">
              <Label>{isBangla ? 'নাম (বাংলা)' : 'Name (Bengali)'}</Label>
              <Input
                value={categoryForm.nameBn}
                onChange={(e) => setCategoryForm({ ...categoryForm, nameBn: e.target.value })}
                placeholder="ক্যাটাগরির নাম"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
              {isBangla ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button onClick={handleAddCategory} disabled={isCategorySaving}>
              {isCategorySaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isBangla ? 'যোগ করুন' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    
      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isBangla ? 'ক্যাটাগরি সম্পাদনা' : 'Edit Category'}</DialogTitle>
            <DialogDescription>
              {isBangla ? 'ক্যাটাগরির তথ্য পরিবর্তন করুন' : 'Update category details'}
            </DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>{isBangla ? 'নাম (ইংরেজি)' : 'Name (English)'}</Label>
                <Input
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{isBangla ? 'নাম (বাংলা)' : 'Name (Bengali)'}</Label>
                <Input
                  value={editingCategory.nameBn}
                  onChange={(e) => setEditingCategory({ ...editingCategory, nameBn: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCategory(null)}>
              {isBangla ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button onClick={handleEditCategory} disabled={isCategorySaving}>
              {isCategorySaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isBangla ? 'আপডেট' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

     
      <AlertDialog open={!!deletingCategory} onOpenChange={() => setDeletingCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{isBangla ? 'ক্যাটাগরি মুছবেন?' : 'Delete Category?'}</AlertDialogTitle>
            <AlertDialogDescription>
              {isBangla
                ? `"${deletingCategory?.name}" ক্যাটাগরি মুছে ফেলা হবে। এটি পূর্বাবস্থায় ফেরানো যাবে না।`
                : `Are you sure you want to delete "${deletingCategory?.name}"? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{isBangla ? 'বাতিল' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isCategorySaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isBangla ? 'মুছুন' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </div>
  );
}
