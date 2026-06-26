// Hello Khata - Add Payment Out Modal
// Modal to record a supplier payment payout (Payment Out)

"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useParties, useParty } from "@/hooks/api/useParties";
import { useCreatePaymentOut } from "@/hooks/api/usePayments";
import { toast } from "sonner";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface AddPaymentOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPartyId?: string;
}

export function AddPaymentOutModal({
  isOpen,
  onClose,
  defaultPartyId,
}: AddPaymentOutModalProps) {
  const { isBangla } = useAppTranslation();
  const { data: partiesData } = useParties();
  const parties = partiesData?.data || [];

  const [referenceNumber, setReferenceNumber] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedPartyId, setSelectedPartyId] = useState<string>("");
  const [paidAmount, setPaidAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [remarks, setRemarks] = useState("");

  const { data: selectedPartyData } = useParty(selectedPartyId, {
    enabled: !!selectedPartyId,
  });
  const selectedParty = selectedPartyData?.data;

  const { mutate: createPayment, isPending } = useCreatePaymentOut();

  // Set default party if provided
  useEffect(() => {
    if (defaultPartyId) {
      setSelectedPartyId(defaultPartyId);
    }
  }, [defaultPartyId, isOpen]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setReferenceNumber(String(Math.floor(Math.random() * 100) + 1));
      setDate(new Date());
      setPaidAmount("");
      setPaymentMethod("cash");
      setRemarks("");
      if (defaultPartyId) {
        setSelectedPartyId(defaultPartyId);
      }
    }
  }, [isOpen, defaultPartyId]);

  const handleSave = (shouldClose: boolean) => {
    if (!selectedPartyId) {
      toast.error(isBangla ? "দয়া করে পার্টি নির্বাচন করুন" : "Please select a party");
      return;
    }
    if (!paidAmount || parseFloat(paidAmount) <= 0) {
      toast.error(isBangla ? "দয়া করে সঠিক পরিমাণ লিখুন" : "Please enter a valid amount");
      return;
    }

    createPayment(
      {
        partyId: selectedPartyId,
        amount: parseFloat(paidAmount),
        mode: paymentMethod,
        receiptNumber: referenceNumber,
        remarks,
        date: date.toISOString(),
      },
      {
        onSuccess: () => {
          toast.success(
            isBangla
              ? "পেমেন্ট আউট সফলভাবে সংরক্ষণ করা হয়েছে!"
              : "Payment Out recorded successfully!"
          );
          if (shouldClose) {
            onClose();
          } else {
            // Reset for "Save & New"
            setReferenceNumber(String(Math.floor(Math.random() * 100) + 1));
            setPaidAmount("");
            setRemarks("");
          }
        }
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] p-0 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
          <DialogTitle className="text-lg font-bold text-foreground">
            {isBangla ? "পেমেন্ট আউট যোগ করুন" : "Add Payment Out"}
          </DialogTitle>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Row 1: Reference Number and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-muted-foreground">
                  {isBangla ? "রেফারেন্স নম্বর" : "Reference Number"}
                </Label>
                <span className="text-[10px] text-primary font-medium bg-primary/10 px-1.5 py-0.5 rounded">
                  {isBangla ? "ম্যানুয়াল" : "Manual"}
                </span>
              </div>
              <Input
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="h-11 bg-background/50 border-input text-foreground focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                {isBangla ? "তারিখ" : "Date"}
              </Label>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-11 justify-between text-left font-normal bg-background/50 border-input text-foreground hover:bg-muted/50"
                  >
                    <span>{format(date, "dd MMM yyyy")}</span>
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                      if (selectedDate) setDate(selectedDate);
                      setDatePickerOpen(false);
                    }}
                    disabled={(d) => d > new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Row 2: Party Name & Outstanding Balance */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-muted-foreground">
                {isBangla ? "পার্টির নাম" : "Party Name"}
              </Label>
              {selectedParty && (
                <span
                  className={cn(
                    "text-xs font-semibold",
                    selectedParty.currentBalance >= 0 ? "text-emerald-500" : "text-red-500"
                  )}
                >
                  {isBangla ? "বকেয়া: " : "Bal: "}
                  Tk. {Math.abs(selectedParty.currentBalance)}
                </span>
              )}
            </div>
            <Select value={selectedPartyId} onValueChange={setSelectedPartyId}>
              <SelectTrigger className="h-11 bg-background/50 border-input text-foreground focus:ring-1 focus:ring-primary">
                <SelectValue placeholder={isBangla ? "পার্টি নির্বাচন করুন" : "Select a party"} />
              </SelectTrigger>
              <SelectContent>
                {parties.map((p: any) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} {p.phone ? `(${p.phone})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Row 3: Paid Amount and Payment Method */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                {isBangla ? "পরিশোধিত পরিমাণ" : "Paid Amount"}
              </Label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-sm text-muted-foreground font-semibold">
                  Tk.
                </span>
                <Input
                  type="number"
                  placeholder="0"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  className="pl-9 h-11 bg-background/50 border-input text-foreground font-bold focus:ring-1 focus:ring-primary"
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-1.5 w-full">
              <Label className="text-xs font-semibold text-muted-foreground">
                {isBangla ? "পেমেন্ট পদ্ধতি" : "Payment Method"}
              </Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="h-11 bg-background/50 border-input text-foreground focus:ring-1 focus:ring-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">{isBangla ? "নগদ" : "Cash"}</SelectItem>
                  <SelectItem value="card">{isBangla ? "কার্ড" : "Card"}</SelectItem>
                  <SelectItem value="mobile_banking">
                    {isBangla ? "মোবাইল ব্যাংকিং" : "Mobile Banking"}
                  </SelectItem>
                  <SelectItem value="bank_transfer">
                    {isBangla ? "ব্যাংক ট্রান্সফার" : "Bank Transfer"}
                  </SelectItem>
                  <SelectItem value="cheque">{isBangla ? "চেক" : "Cheque"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 4: Remarks */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">
              {isBangla ? "মন্তব্য" : "Remarks"}
            </Label>
            <Textarea
              placeholder={isBangla ? "এখানে মন্তব্য লিখুন..." : "Enter remarks here..."}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="min-h-[90px] bg-background/50 border-input text-foreground resize-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-card">
          <Button
            variant="outline"
            onClick={() => handleSave(false)}
            disabled={isPending}
            className="h-11 px-6 border-input hover:bg-muted text-foreground font-semibold"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {isBangla ? "সংরক্ষণ ও নতুন" : "Save & New"}
          </Button>

          <Button
            onClick={() => handleSave(true)}
            disabled={isPending}
            className="h-11 px-6 font-semibold shadow-md"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {isBangla ? "সংরক্ষণ হচ্ছে..." : "Saving..."}
              </span>
            ) : (
              isBangla ? "পেমেন্ট আউট সংরক্ষণ করুন" : "Save Payment Out"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
