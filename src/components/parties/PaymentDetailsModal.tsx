// Hello Khata - Payment Details Modal
// Modal to view/edit details of a payment transaction

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
  Printer,
} from "lucide-react";
import { useDeletePayment, useGetPaymentById, useUpdatePayment } from "@/hooks/api/usePayments";
import { useParty } from "@/hooks/api/useParties";
import {
  useAppTranslation,
  useCurrency,
  useDateFormat,
} from "@/hooks/useAppTranslation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PaymentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
 paymentId:string
}

export function PaymentDetailsModal({
  isOpen,
  onClose,
 paymentId
}: PaymentDetailsModalProps) {
  const { isBangla } = useAppTranslation();
  const { formatDate } = useDateFormat();

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form states
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [paymentMethod, setPaymentMethod] = useState("Cash");


  const { data: paymentResponse, isLoading: isPaymentLoading } = useGetPaymentById(paymentId);
  const entry = paymentResponse?.data;

  const partyId = entry?.partyId;
  const { data: partyResponse } = useParty(partyId || "", { enabled: !!partyId });
  const party = partyResponse?.data;

  const { mutateAsync: deletePayment, isPending: isDeletingPayment } = useDeletePayment();
  const { mutate: updatePayment,isPending:isUpdatingPayment } = useUpdatePayment();
  // Reset form states when entry changes
  
  useEffect(() => {
    if (entry) {
      setAmount(Math.abs(entry.amount).toString());
      setRemarks(entry.remarks || entry.notes || "");
      setReceiptNumber(entry.receiptNumber || entry.receiptNo || entry.referenceId || entry.reference || "");
      setDate(entry.date || entry.createdAt ? new Date(entry.date || entry.createdAt) : new Date());
      
      let method = entry.paymentMethod || entry.mode || "Cash";
      if (method.toLowerCase() === "cash") method = "Cash";
      else if (method.toLowerCase() === "bank" || method.toLowerCase() === "bank_transfer") method = "Bank";
      else if (method.toLowerCase() === "bkash") method = "bKash";
      else if (method.toLowerCase() === "nagad") method = "Nagad";
      else if (method.toLowerCase() === "rocket") method = "Rocket";
      
      setPaymentMethod(method);
      setIsEditing(false);
    }
  }, [entry, isOpen]);

  // Log raw API data if any (as in original code)
  useEffect(() => {
    if (paymentResponse) {
      console.log('paymentData', paymentResponse);
    }
  }, [paymentResponse]);

  const handleSaveChanges = () => {
    const data = {
  amount,
  mode:paymentMethod,
  accountId:entry.accountId,
  notes:remarks,
}

updatePayment({id: paymentId, data},{
  onSuccess: data => {
    console.log(data)
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
  }
})
  
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    deletePayment(entry.id, {
      onSuccess: (data) => {
       if(data.success){
         onClose();
         setShowDeleteConfirm(false);
         toast.success(
          isBangla
            ? "লেনদেনটি সফলভাবে মুছে ফেলা হয়েছে"
            : "Transaction deleted successfully",
        );
       }
      }
    });
  };

  const handlePrint = () => {
    toast.success(isBangla ? "প্রিন্ট হচ্ছে..." : "Connecting to printer...");
    window.print();
  };

  const getModalTitle = () => {
    if (isPaymentLoading) return isBangla ? "পেমেন্ট বিবরণ" : "Payment Details";
    if (!entry) return isBangla ? "পেমেন্ট বিবরণ" : "Payment Details";
    const isPaymentIn = entry?.type ? entry.type === 'received' : entry?.amount >= 0;
    return isPaymentIn
      ? isBangla
        ? "পেমেন্ট ইন সম্পাদনা"
        : "Edit Payment In"
      : isBangla
        ? "পেমেন্ট আউট সম্পাদনা"
        : "Edit Payment Out";
  };

  const renderPaymentView = () => {
    if (isPaymentLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-sm text-muted-foreground">
            {isBangla ? "লোড হচ্ছে..." : "Loading payment details..."}
          </p>
        </div>
      );
    }

    if (!entry) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-sm text-rose-500">
            {isBangla ? "লেনদেন বিবরণ পাওয়া যায়নি" : "Payment details not found."}
          </p>
        </div>
      );
    }

    const isPaymentIn = entry?.type ? entry.type === 'received' : entry?.amount >= 0;
    const amountLabel = isPaymentIn
      ? isBangla
        ? "প্রাপ্ত পরিমাণ"
        : "Received Amount"
      : isBangla
        ? "প্রদানকৃত পরিমাণ"
        : "Paid Amount";

    const receiptLabel = isPaymentIn
      ? isBangla
        ? "রসিদ নম্বর"
        : "Receipt Number"
      : isBangla
        ? "রেফারেন্স নম্বর"
        : "Reference Number";

    const partyName = entry?.partyName || party?.name || "—";

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="tx-receipt"
              className="text-xs font-bold text-muted-foreground uppercase tracking-wider"
            >
              {receiptLabel}
            </Label>
            <Input
              id="tx-receipt"
              value={receiptNumber}
              onChange={(e) => setReceiptNumber(e.target.value)}
              disabled={!isEditing}
              className={cn(
                "h-11 text-sm border-border focus:border-primary font-semibold transition-colors duration-200",
                isEditing
                  ? "bg-background text-foreground"
                  : "bg-zinc-100 dark:bg-zinc-900/60 text-zinc-400 dark:text-zinc-500 border-zinc-200 dark:border-zinc-800 opacity-60 cursor-not-allowed"
              )}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {isBangla ? "তারিখ" : "Date"}
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

        <div className="space-y-2">
          <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {isBangla ? "পার্টির নাম" : "Party Name"}
          </Label>
          <Input
            value={partyName}
            disabled
            className="h-11 text-sm bg-zinc-100 dark:bg-zinc-900/60 border-border font-bold text-zinc-400 dark:text-zinc-500 opacity-60 cursor-not-allowed"
          />
        </div>

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
            <Label
              htmlFor="tx-method"
              className="text-xs font-bold text-muted-foreground uppercase tracking-wider"
            >
              {isBangla ? "পেমেন্ট মাধ্যম" : "Payment Method"}
            </Label>
            {isEditing ? (
              <select
                id="tx-method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="Cash">{isBangla ? "ক্যাশ" : "Cash"}</option>
                <option value="Bank">{isBangla ? "ব্যাংক" : "Bank"}</option>
                <option value="bKash">{isBangla ? "বিকাশ" : "bKash"}</option>
                <option value="Nagad">{isBangla ? "নগদ" : "Nagad"}</option>
                <option value="Rocket">{isBangla ? "রকেট" : "Rocket"}</option>
              </select>
            ) : (
              <Input
                id="tx-method"
                value={paymentMethod}
                disabled
                className="h-11 text-sm bg-zinc-100 dark:bg-zinc-900/60 border-border font-semibold text-zinc-400 dark:text-zinc-500 opacity-60 cursor-not-allowed capitalize"
              />
            )}
          </div>
        </div>

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
    if (isPaymentLoading || !entry) return null;
    return (
      <div className="flex flex-row items-center justify-between w-full gap-4">
        <Button
          variant="outline"
          onClick={handleDeleteClick}
          className="h-10 border-rose-900/40 text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 hover:text-rose-600 text-xs font-semibold flex items-center gap-1.5"
        >
          <Trash2 className="h-4 w-4" />
          {isBangla ? "মুছে ফেলুন" : "Delete"}
        </Button>

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
                {isUpdatingPayment ? "Saving..." : isBangla ? "সংরক্ষণ করুন" : "Save Changes"}
                
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handlePrint}
                className="h-10 text-xs font-semibold flex items-center gap-1.5 border-border text-foreground hover:bg-muted"
              >
                <Printer className="h-4 w-4" />
                {isBangla ? "প্রিন্ট" : "Print"}
              </Button>
              <Button
                onClick={() => setIsEditing(true)}
                className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold flex items-center gap-1.5"
              >
                <Edit className="h-4 w-4" />
                {isBangla ? "বিবরণ সম্পাদনা" : "Edit Details"}
              </Button>
            </>
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
              {renderPaymentView()}
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
