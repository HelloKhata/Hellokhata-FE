// Hello Khata - Adjustment Details Modal
// Modal to view/edit details of an adjustment or opening balance transaction

"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Loader2,
  Trash2,
  Edit,
  Save,
  Calendar,
} from "lucide-react";
import { useDeletePayment } from "@/hooks/api/usePayments";
import {
  useAppTranslation,
  useDateFormat,
} from "@/hooks/useAppTranslation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AdjustmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: any; // PartyLedgerEntry
  party?: any; // Party object passed from parent
}

export function AdjustmentDetailsModal({
  isOpen,
  onClose,
  entry,
  party,
}: AdjustmentDetailsModalProps) {
  const { isBangla } = useAppTranslation();
  const { formatDate } = useDateFormat();

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form states
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [balanceType, setBalanceType] = useState<'receive' | 'give'>('receive');

  const isAdjustment = entry?.type === "adjustment";
  const isOpening = entry?.type === "opening";

  const { mutate: deletePayment, isPending: isDeletingPayment } = useDeletePayment();

  // Reset form states when entry changes
  useEffect(() => {
    if (entry) {
      setAmount(Math.abs(entry.amount).toString());
      setRemarks(entry.remarks || "");
      setDate(entry.date ? new Date(entry.date) : new Date());
      setBalanceType(entry.amount >= 0 ? 'receive' : 'give');
      setIsEditing(false);
    }
  }, [entry, isOpen]);

  if (!entry) return null;

  const handleSaveChanges = () => {
    toast.success(
      isBangla
        ? "পরিবর্তনগুলো সংরক্ষণ করা হয়েছে"
        : "Changes saved successfully",
      {
        description: isBangla
          ? "লেনদেন বিবরণ আপডেট করা হয়েছে"
          : "Transaction details updated.",
      },
    );
    setIsEditing(false);
    onClose();
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    deletePayment(entry.id, {
      onSuccess: () => {
        toast.success(
          isBangla
            ? "লেনদেনটি সফলভাবে মুছে ফেলা হয়েছে"
            : "Transaction deleted successfully",
        );
        setShowDeleteConfirm(false);
        onClose();
      },
      onError: () => {
        toast.info(
          isBangla
            ? "লেনদেন অপসারণের অনুরোধ সম্পন্ন হয়েছে"
            : "Transaction removal request processed.",
        );
        setShowDeleteConfirm(false);
        onClose();
      },
    });
  };

  const getModalTitle = () => {
    if (isOpening) {
      return isBangla ? "প্রারম্ভিক ব্যালেন্স" : "Opening Balance";
    }
    if (isAdjustment) {
      return isBangla ? "ব্যালেন্স সমন্বয়" : "Adjust Balance";
    }
    return "";
  };

  const renderAdjustmentView = () => {
    const amountLabel = isOpening
      ? isBangla
        ? "প্রারম্ভিক পরিমাণ"
        : "Opening Amount"
      : isBangla
        ? "সমন্বয় পরিমাণ"
        : "Adjustment Amount";

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="tx-amount"
              className="text-xs font-bold text-muted-foreground uppercase tracking-wider"
            >
              {amountLabel}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-muted-foreground font-semibold">
                Tk.
              </span>
              <Input
                id="tx-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={!isEditing}
                className={cn(
                  "h-11 pl-10 text-sm border-border focus:border-primary font-bold font-mono transition-colors duration-200",
                  isEditing
                    ? "bg-background text-foreground"
                    : "bg-zinc-100 dark:bg-zinc-900/60 text-zinc-400 dark:text-zinc-500 border-zinc-200 dark:border-zinc-800 opacity-60 cursor-not-allowed"
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {isBangla ? "তারিখ" : "As of Date"}
            </Label>
            <div className="relative">
              <Input
                type="text"
                value={formatDate(date, "long")}
                disabled
                className="h-11 text-sm bg-zinc-100 dark:bg-zinc-900/60 border-border font-medium text-zinc-400 dark:text-zinc-500 opacity-60 cursor-not-allowed"
              />
              <Calendar className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>

        {isOpening && (
          <div className="space-y-2">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {isBangla ? "ব্যালেন্সের ধরন" : "Balance Direction"}
            </Label>
            <div className="flex gap-2">
              {[
                { value: 'receive', label: isBangla ? 'পাওনা (To Receive)' : 'To Receive' },
                { value: 'give', label: isBangla ? 'দেনা (To Give)' : 'To Give' },
              ].map((dir) => (
                <button
                  key={dir.value}
                  type="button"
                  disabled={!isEditing}
                  onClick={() => setBalanceType(dir.value as 'receive' | 'give')}
                  className={cn(
                    'flex items-center justify-center gap-2 px-3 py-1.5 rounded-md border text-xs font-medium transition-all',
                    isEditing ? 'cursor-pointer' : 'cursor-not-allowed opacity-70',
                    balanceType === dir.value
                      ? dir.value === 'receive'
                        ? 'border-primary/50 bg-primary/10 text-primary font-bold'
                        : 'border-red-500/50 bg-red-500/10 text-red-500 font-bold'
                      : 'border-border bg-transparent text-muted-foreground hover:border-primary/50'
                  )}
                >
                  {dir.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label
            htmlFor="tx-remarks"
            className="text-xs font-bold text-muted-foreground uppercase tracking-wider"
          >
            {isBangla ? "মন্তব্য" : "Remarks"}
          </Label>
          <Textarea
            id="tx-remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            disabled={!isEditing}
            placeholder={
              isBangla ? "এখানে মন্তব্য লিখুন..." : "Enter remarks here..."
            }
            className={cn(
              "text-sm border-border focus:border-primary resize-none h-24 transition-colors duration-200",
              isEditing
                ? "bg-background text-foreground"
                : "bg-zinc-100 dark:bg-zinc-900/60 text-zinc-400 dark:text-zinc-500 border-zinc-200 dark:border-zinc-800 opacity-60 cursor-not-allowed"
            )}
          />
        </div>
      </div>
    );
  };

  const renderFooterButtons = () => {
    const isDeletable = !isOpening;
    return (
      <div className="flex flex-row items-center justify-between w-full gap-4">
        <div>
          {isDeletable && (
            <Button
              variant="outline"
              onClick={handleDeleteClick}
              className="h-10 border-rose-900/40 text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 hover:text-rose-600 text-xs font-semibold flex items-center gap-1.5"
            >
              <Trash2 className="h-4 w-4" />
              {isBangla ? "মুছে ফেলুন" : "Delete"}
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="h-10 text-xs border-border"
              >
                {isBangla ? "বাতিল" : "Cancel"}
              </Button>
              <Button
                onClick={handleSaveChanges}
                className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold flex items-center gap-1.5"
              >
                <Save className="h-4 w-4" />
                {isBangla ? "সংরক্ষণ করুন" : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold flex items-center gap-1.5"
            >
              <Edit className="h-4 w-4" />
              {isBangla ? "বিবরণ সম্পাদনা" : "Edit Details"}
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="w-[95%] max-w-lg md:max-w-3xl rounded-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col justify-between border border-border bg-card shadow-2xl">
          <div className="flex flex-col flex-1 min-h-0">
            <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b border-border">
              <DialogTitle className="text-lg font-bold text-foreground">
                {getModalTitle()}
              </DialogTitle>
            </DialogHeader>

            <div className="py-6 overflow-y-auto max-h-[60vh] pr-1 flex-1">
              {renderAdjustmentView()}
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-border mt-4 shrink-0 flex items-center w-full">
            {renderFooterButtons()}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="w-[320px]">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isBangla ? "লেনদেন মুছবেন?" : "Delete Transaction?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isBangla
                ? "এই কাজ পূর্বাবস্থায় ফেরানো যাবে না। লেনদেনটি স্থায়ীভাবে মুছে ফেলা হবে।"
                : "This action cannot be undone. This transaction will be permanently deleted."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {isBangla ? "বাতিল" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {isDeletingPayment ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              {isBangla ? "মুছুন" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
