'use client'
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from "@/components/ui/premium";
import { Checkbox } from "@/components/ui/checkbox";
import { useChangeBusinessTypes, useGetMasterBusinessTypes } from "@/hooks/api/useMasterItems";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Check, Loader2, Save, Store } from "lucide-react";
import { toast } from "sonner";

interface MasterBusinessType {
    id: string;
    value: string;
    labelEn: string;
    labelBn: string;
    isDefault: boolean;
    isSelected: boolean;
}

const InventorySettings = () => {
    const { isBangla } = useAppTranslation();
    const { data: masterTypesData, isLoading } = useGetMasterBusinessTypes();
    const masterTypes: MasterBusinessType[] = masterTypesData?.businessTypes ?? [];
    const {mutate:changeMasterTypes, isPending:isLoadingMasterItesmChange} = useChangeBusinessTypes()
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const toggleType = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleSave = () => {
        changeMasterTypes(selectedIds, {
            onSuccess: data => {
                if (data.success) toast.success("Business types updated successfully");
            },
        });
    };


    return (
        <Card className="w-full border-0 !shadow-none bg-transparent">
            <CardHeader className="!px-0 !pt-0">
                <CardTitle>Inventory Settings</CardTitle>
                <CardDescription>
                    Configure your invoice settings including template, default currency, and numbering format.
                </CardDescription>
            </CardHeader>
            <CardContent className="px-0 !pb-0">
                <div className="w-full rounded-2xl p-6 bg-card border border-border">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
                                    <Store className="h-4 w-4" />
                                </div>
                                {isBangla ? "ব্যবসার ধরন নির্বাচন করুন" : "Select Business Types"}
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1.5 ml-11">
                                {isBangla
                                    ? "আপনার ব্যবসার সাথে প্রযোজ্য একাধিক ধরন নির্বাচন করুন"
                                    : "Select one or more types that apply to your business"}
                            </p>
                        </div>
                        <Badge variant="secondary" size="lg">
                            {selectedIds.length} {isBangla ? "নির্বাচিত" : "selected"}
                        </Badge>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-12 text-muted-foreground">
                            <Loader2 className="h-5 w-5 animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {masterTypes.map((type) => {
                                const isChecked = selectedIds.includes(type.id);
                                return (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => toggleType(type.id)}
                                        className={cn(
                                            "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                                            isChecked
                                                ? "border-primary bg-primary/10 shadow-xs"
                                                : "border-border hover:bg-muted/50"
                                        )}
                                    >
                                        <Checkbox
                                            checked={isChecked}
                                            onCheckedChange={() => toggleType(type.id)}
                                            className="pointer-events-none"
                                        />
                                        <span
                                            className={cn(
                                                "flex-1 text-sm font-medium",
                                                isChecked ? "text-primary" : "text-foreground"
                                            )}
                                        >
                                            {isBangla ? type.labelBn : type.labelEn}
                                        </span>
                                        {isChecked && <Check className="h-4 w-4 text-primary" />}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    <div className="flex justify-end pt-6">
                        <Button
                            onClick={handleSave}
                            disabled={isLoadingMasterItesmChange}
                            className="h-11 px-8 rounded-xl font-medium text-sm w-full sm:w-auto"
                        >
                            {isLoadingMasterItesmChange ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4 mr-2" />
                            )}
                            {isBangla ? "সংরক্ষণ করুন" : "Save Settings"}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};


export default InventorySettings
