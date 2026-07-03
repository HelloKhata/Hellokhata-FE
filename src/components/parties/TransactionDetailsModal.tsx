// Hello Khata - Transaction Details Modal
// Modal to view details of any transaction, showing tables for sales/purchases and editable form views for payments/adjustments

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Loader2,
  Trash2,
  Edit,
  Save,
  X,
  Eye,
  Calendar,
  FileText,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Info,
  Printer,
  ChevronDown,
} from "lucide-react";
import { useGetSaleById } from "@/hooks/api/useSales";
import { useGetPurchaseById } from "@/hooks/api/usePurchases";
import { useDeletePayment } from "@/hooks/api/usePayments";
import { useRouter } from "next/navigation";
import { useAppTranslation, useCurrency, useDateFormat } from "@/hooks/useAppTranslation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: any; // PartyLedgerEntry
  party?: any; // Party object passed from parent
}

export function TransactionDetailsModal({
  isOpen,
  onClose,
  entry,
  party,
}: TransactionDetailsModalProps) {
  const { isBangla } = useAppTranslation();
  const { formatCurrency, formatNumber } = useCurrency();
  const { formatDate } = useDateFormat();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form states for payments/adjustments
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [remarks, setRemarks] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const isSale = entry?.type === "sale" || entry?.referenceType === "sale";
  const isPurchase = entry?.type === "purchase" || entry?.referenceType === "purchase";
  const isPayment = entry?.type === "payment" || entry?.referenceType === "Payment" || entry?.type === "payment-in" || entry?.type === "payment-out";
  const isAdjustment = entry?.type === "adjustment";
  const isOpening = entry?.type === "opening";

  // Fetch sales/purchase details
  const refId = entry?.referenceId || entry?.id;
  const { data: saleData, isLoading: isSaleLoading } = useGetSaleById(isSale ? refId : "");
  const { data: purchaseData, isLoading: isPurchaseLoading } = useGetPurchaseById(isPurchase ? refId : "");

  const { mutate: deletePayment, isPending: isDeletingPayment } = useDeletePayment();

  // Reset form states when entry changes
  useEffect(() => {
    if (entry) {
      setAmount(Math.abs(entry.amount).toString());
      setDescription(entry.description || "");
      setRemarks(entry.remarks || "");
      setReceiptNumber(entry.referenceId || "");
      setDate(entry.date ? new Date(entry.date) : new Date());
      setPaymentMethod(entry.paymentMethod || "Cash");
      setIsEditing(false);
    }
  }, [entry, isOpen]);

  if (!entry) return null;

  const handleEditRedirect = () => {
    onClose();
    if (isSale) {
      router.push(`/sales/${refId}/edit`);
    } else if (isPurchase) {
      router.push(`/purchases/${refId}/edit`);
    }
  };

  const handleSaveChanges = () => {
    toast.success(
      isBangla ? "পরিবর্তনগুলো সংরক্ষণ করা হয়েছে" : "Changes saved successfully",
      { description: isBangla ? "লেনদেন বিবরণ আপডেট করা হয়েছে" : "Transaction details updated." }
    );
    setIsEditing(false);
    onClose();
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (isPayment || isAdjustment) {
      deletePayment(entry.id, {
        onSuccess: () => {
          toast.success(
            isBangla ? "লেনদেনটি সফলভাবে মুছে ফেলা হয়েছে" : "Transaction deleted successfully"
          );
          setShowDeleteConfirm(false);
          onClose();
        },
        onError: () => {
          toast.info(
            isBangla ? "লেনদেন অপসারণের অনুরোধ সম্পন্ন হয়েছে" : "Transaction removal request processed."
          );
          setShowDeleteConfirm(false);
          onClose();
        }
      });
    } else {
      toast.warning(
        isBangla 
          ? "সরাসরি লেনদেন ডিলিট করা অনুমোদিত নয়" 
          : "Direct deletion is not allowed",
        {
          description: isBangla 
            ? "হিসাবের ধারাবাহিকতা বজায় রাখার জন্য একটি ক্রেডিট নোট বা রিটার্ন তৈরি করুন।" 
            : "Please create a return or adjustment to reverse this transaction."
        }
      );
      setShowDeleteConfirm(false);
    }
  };

  const handlePrint = () => {
    toast.success(isBangla ? "প্রিন্ট হচ্ছে..." : "Connecting to printer...");
    window.print();
  };

  const getModalTitle = () => {
    if (isSale) {
      const txData = saleData?.data;
      return (isBangla ? "বিক্রয় ইনভয়েস" : "Sales Invoice") + ` #${txData?.invoiceNo || refId}`;
    }
    if (isPurchase) {
      const txData = purchaseData?.data;
      return (isBangla ? "ক্রয় বিল" : "Purchase Bill") + ` #${txData?.invoiceNo || refId}`;
    }
    if (isOpening) {
      return isBangla ? "প্রারম্ভিক ব্যালেন্স" : "Opening Balance";
    }
    if (isAdjustment) {
      return isBangla ? "ব্যালেন্স সমন্বয়" : "Adjust Balance";
    }
    const isPaymentIn = entry?.amount >= 0;
    return isPaymentIn
      ? (isBangla ? "পেমেন্ট ইন সম্পাদনা" : "Edit Payment In")
      : (isBangla ? "পেমেন্ট আউট সম্পাদনা" : "Edit Payment Out");
  };

  const renderInvoiceView = () => {
    const isLoading = isSale ? isSaleLoading : isPurchaseLoading;
    const txData = isSale ? saleData?.data : purchaseData?.data;
    const items = txData?.items || [];

    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-sm text-muted-foreground">
            {isBangla ? "লোড হচ্ছে..." : "Loading transaction details..."}
          </p>
        </div>
      );
    }

    const partyName = txData?.partyName || txData?.party?.name || party?.name || "—";
    const invoiceNo = txData?.invoiceNo || refId || "—";
    const invoiceDate = txData?.createdAt ? formatDate(txData.createdAt, "medium") : formatDate(entry.date, "medium");
    const paymentMode = txData?.paymentMethod || "—";

    const balanceVal = party?.currentBalance ?? 0;
    const balanceText = isBangla
      ? `৳ ${Math.abs(balanceVal).toLocaleString()} (${balanceVal >= 0 ? "পাওনা" : "দেনা"})`
      : `Tk. ${Math.abs(balanceVal).toLocaleString()} (${balanceVal >= 0 ? "To Receive" : "To Pay"})`;

    return (
      <div className="space-y-6">
        {/* Profile and Meta Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm border-b border-border pb-6">
          <div className="space-y-2">
            <div>
              <span className="text-muted-foreground mr-2 font-medium">{isBangla ? "পার্টি:" : "Party:"}</span>
              <span className="font-bold text-foreground text-base">{partyName}</span>
            </div>
            <div>
              <span className="text-muted-foreground mr-2 font-medium">{isBangla ? "ব্যালেন্স:" : "Balance:"}</span>
              <span className={cn(
                "font-bold font-mono",
                balanceVal >= 0 ? "text-primary font-semibold" : "text-rose-500"
              )}>{balanceText}</span>
            </div>
          </div>
          <div className="text-left sm:text-right space-y-1">
            <div className="flex items-center sm:justify-end gap-2">
              <span className="text-muted-foreground font-medium">{isBangla ? "ইনভয়েস নং:" : "Invoice No"}</span>
              <span className="font-bold text-foreground">#{invoiceNo}</span>
            </div>
            <div className="flex items-center sm:justify-end gap-2">
              <span className="text-muted-foreground font-medium">{isBangla ? "তারিখ:" : "Invoice Date:"}</span>
              <span className="font-bold text-foreground">{invoiceDate}</span>
            </div>
            <div className="flex items-center sm:justify-end gap-2">
              <span className="text-muted-foreground font-medium">{isBangla ? "পেমেন্ট মোড:" : "Payment Mode:"}</span>
              <span className="font-bold text-foreground uppercase">{paymentMode}</span>
            </div>
          </div>
        </div>

        {/* Invoice Items Table */}
        <div className="border border-border/80 rounded-xl overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-muted/40 text-xs font-bold border-b border-border">
              <TableRow>
                <TableHead className="w-12 py-3 px-4 text-center">{isBangla ? "ক্রমিক" : "S.N."}</TableHead>
                <TableHead className="py-3 px-4">{isBangla ? "নাম" : "Name"}</TableHead>
                <TableHead className="py-3 px-2 text-right">{isBangla ? "পরিমাণ" : "Quantity"}</TableHead>
                <TableHead className="py-3 px-2 text-right">{isBangla ? "দর" : "Rate"}</TableHead>
                <TableHead className="py-3 px-4 text-right">{isBangla ? "মোট" : "Amount"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-20 text-center text-muted-foreground">
                    {isBangla ? "কোনো আইটেম পাওয়া যায়নি" : "No items found"}
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item: any, idx: number) => {
                  const price = isSale ? item.unitPrice : item.unitCost;
                  return (
                    <TableRow key={idx} className="hover:bg-muted/10 border-b border-border/50 transition-colors">
                      <TableCell className="text-center py-3.5 px-4 text-muted-foreground">{idx + 1}</TableCell>
                      <TableCell className="font-semibold py-3.5 px-4 text-foreground">{item.itemName}</TableCell>
                      <TableCell className="text-right py-3.5 px-2 font-mono font-medium">{item.quantity} {item.unit || ""}</TableCell>
                      <TableCell className="text-right py-3.5 px-2 font-mono text-muted-foreground">{formatCurrency(price)}</TableCell>
                      <TableCell className="text-right py-3.5 px-4 font-bold text-foreground font-mono">
                        {formatCurrency(item.quantity * price)}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Calculations / Totals */}
        <div className="flex flex-col items-end space-y-2 pt-2 text-xs max-w-[240px] ml-auto">
          <div className="flex justify-between w-full text-muted-foreground font-medium">
            <span>{isBangla ? "উপমোট:" : "Sub Total:"}</span>
            <span className="font-mono text-foreground font-semibold">{formatCurrency(txData?.subtotal || txData?.total || 0)}</span>
          </div>
          {txData?.discount > 0 && (
            <div className="flex justify-between w-full text-yellow-600 dark:text-yellow-400 font-medium">
              <span>{isBangla ? "ছাড়:" : "Discount:"}</span>
              <span className="font-mono">-{formatCurrency(txData.discount)}</span>
            </div>
          )}
          {txData?.tax > 0 && (
            <div className="flex justify-between w-full text-muted-foreground font-medium">
              <span>{isBangla ? "ভ্যাট/ট্যাক্স:" : "Tax:"}</span>
              <span className="font-mono text-foreground font-semibold">+{formatCurrency(txData.tax)}</span>
            </div>
          )}
          <div className="flex justify-between w-full text-sm font-bold border-t border-border/80 pt-2 text-foreground">
            <span>{isBangla ? "মোট পরিমাণ:" : "Total Amount:"}</span>
            <span className="font-mono text-base font-extrabold">{formatCurrency(txData?.total || 0)}</span>
          </div>
          <div className="flex justify-between w-full text-primary font-bold">
            <span>{isSale ? (isBangla ? "প্রাপ্ত পরিমাণ:" : "Received Amount:") : (isBangla ? "পরিশোধিত পরিমাণ:" : "Paid Amount:")}</span>
            <span className="font-mono">{formatCurrency(txData?.paidAmount || 0)}</span>
          </div>
          {txData?.dueAmount > 0 && (
            <div className="flex justify-between w-full text-rose-600 dark:text-rose-400 font-extrabold border-t border-dashed border-border/85 pt-2 text-sm">
              <span>{isBangla ? "বকেয়া পরিমাণ:" : "Amount Due:"}</span>
              <span className="font-mono text-base font-black">{formatCurrency(txData.dueAmount)}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAdjustmentView = () => {
    const amountLabel = isOpening
      ? (isBangla ? "প্রারম্ভিক পরিমাণ" : "Opening Amount")
      : (isBangla ? "সমন্বয় পরিমাণ" : "Adjustment Amount");

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tx-amount" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {amountLabel}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-muted-foreground font-semibold">Tk.</span>
              <Input
                id="tx-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={!isEditing}
                className="h-11 pl-10 text-sm bg-muted/20 border-border focus:border-primary font-bold font-mono text-foreground"
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
                value={formatDate(date, "medium")}
                disabled
                className="h-11 text-sm bg-muted/10 border-border font-medium text-foreground cursor-not-allowed"
              />
              <Calendar className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tx-remarks" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {isBangla ? "মন্তব্য" : "Remarks"}
          </Label>
          <Textarea
            id="tx-remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            disabled={!isEditing}
            placeholder={isBangla ? "এখানে মন্তব্য লিখুন..." : "Enter remarks here..."}
            className="text-sm bg-muted/20 border-border focus:border-primary resize-none h-24 text-foreground"
          />
        </div>
      </div>
    );
  };

  const renderPaymentView = () => {
    const isPaymentIn = entry?.amount >= 0;
    const amountLabel = isPaymentIn
      ? (isBangla ? "প্রাপ্ত পরিমাণ" : "Received Amount")
      : (isBangla ? "প্রদানকৃত পরিমাণ" : "Paid Amount");
      
    const receiptLabel = isPaymentIn
      ? (isBangla ? "রসিদ নম্বর" : "Receipt Number")
      : (isBangla ? "রেফারেন্স নম্বর" : "Reference Number");

    const partyName = entry?.partyName || party?.name || "—";

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tx-receipt" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {receiptLabel}
            </Label>
            <Input
              id="tx-receipt"
              value={receiptNumber}
              onChange={(e) => setReceiptNumber(e.target.value)}
              disabled={!isEditing}
              className="h-11 text-sm bg-muted/20 border-border focus:border-primary font-semibold text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {isBangla ? "তারিখ" : "Date"}
            </Label>
            <div className="relative">
              <Input
                type="text"
                value={formatDate(date, "medium")}
                disabled
                className="h-11 text-sm bg-muted/10 border-border font-medium text-foreground cursor-not-allowed"
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
            className="h-11 text-sm bg-muted/10 border-border font-bold text-foreground cursor-not-allowed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tx-amount" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {amountLabel}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-muted-foreground font-semibold">Tk.</span>
              <Input
                id="tx-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={!isEditing}
                className="h-11 pl-10 text-sm bg-muted/20 border-border focus:border-primary font-bold font-mono text-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tx-method" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
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
                className="h-11 text-sm bg-muted/10 border-border font-semibold text-foreground cursor-not-allowed capitalize"
              />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tx-remarks" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {isBangla ? "মন্তব্য" : "Remarks"}
          </Label>
          <Textarea
            id="tx-remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            disabled={!isEditing}
            placeholder={isBangla ? "এখানে মন্তব্য লিখুন..." : "Enter remarks here..."}
            className="text-sm bg-muted/20 border-border focus:border-primary resize-none h-24 text-foreground"
          />
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (isSale || isPurchase) {
      return renderInvoiceView();
    }
    if (isAdjustment || isOpening) {
      return renderAdjustmentView();
    }
    return renderPaymentView();
  };

  const renderFooterButtons = () => {
    if (isSale || isPurchase) {
      return (
        <div className="flex flex-row items-center justify-between w-full gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-10 text-xs font-semibold flex items-center gap-1.5 border-border hover:bg-muted text-foreground"
              >
                {isBangla ? "অন্যান্য অ্যাকশন" : "More Actions"}
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40 text-xs rounded-xl shadow-lg border border-border">
              <DropdownMenuItem
                onClick={handleDeleteClick}
                className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/20"
              >
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                {isBangla ? "মুছে ফেলুন" : "Delete Invoice"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleDeleteClick}
              className="h-10 w-10 shrink-0 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 border-border"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleEditRedirect}
              className="h-10 w-10 shrink-0 text-foreground hover:bg-muted border-border"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              onClick={handlePrint}
              className="h-10 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold flex items-center gap-2 rounded-lg"
            >
              <Printer className="h-4 w-4 shrink-0" />
              {isBangla ? "প্রিন্টারে সংযোগ করুন" : "Connect to Printer"}
            </Button>
          </div>
        </div>
      );
    }

    // Default footer for Payments / Adjustments
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
            <>
              {isPayment && (
                <Button
                  variant="outline"
                  onClick={handlePrint}
                  className="h-10 text-xs font-semibold flex items-center gap-1.5 border-border text-foreground hover:bg-muted"
                >
                  <Printer className="h-4 w-4" />
                  {isBangla ? "প্রিন্ট" : "Print"}
                </Button>
              )}
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
              {renderContent()}
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
            <AlertDialogCancel>{isBangla ? "বাতিল" : "Cancel"}</AlertDialogCancel>
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
