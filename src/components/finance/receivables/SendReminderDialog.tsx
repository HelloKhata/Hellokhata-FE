"use client";

import React, { useState } from "react";
import { ReceivableCustomer } from "@/types/receivable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCurrency } from "@/hooks/useAppTranslation";
import { Send, Copy, Check, MessageSquare, Phone } from "lucide-react";
import { toast } from "sonner";

interface SendReminderDialogProps {
  customer: ReceivableCustomer | null;
  isOpen: boolean;
  onClose: () => void;
  isBangla?: boolean;
}

export function SendReminderDialog({
  customer,
  isOpen,
  onClose,
  isBangla = false,
}: SendReminderDialogProps) {
  const { formatCurrency } = useCurrency();
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);

  if (!customer) return null;

  const defaultMessage = isBangla
    ? `প্রিয় ${customer.name}, হ্যালো খাতা-তে আপনার বকেয়া পাওনা ৳${customer.totalOutstanding.toLocaleString()} টাকা জমা দেওয়ার জন্য বিনীত অনুরোধ করা হচ্ছে। ধন্যবাদ!`
    : `Dear ${customer.name}, your outstanding balance of ৳${customer.totalOutstanding.toLocaleString()} is due. Please settle your payment at your earliest convenience. Thank you!`;

  const [message, setMessage] = useState(defaultMessage);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    toast.success(isBangla ? "মেসেজ কপি করা হয়েছে" : "SMS text copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendSms = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      onClose();
      toast.success(
        isBangla
          ? `${customer.phone} নম্বরে এসএমএস রিমাইন্ডার পাঠানো হয়েছে`
          : `SMS reminder sent successfully to ${customer.phone}`
      );
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-5 bg-card">
        <DialogHeader className="space-y-1.5 border-b border-border pb-3">
          <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <MessageSquare className="h-4 w-4" />
            </div>
            <span>{isBangla ? "এসএমএস রিমাইন্ডার পাঠান" : "Send SMS Payment Reminder"}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isBangla
              ? `${customer.name}-এর কাছে পাওনা পরিশোধের তাগিদ দিতে বার্তা পাঠান।`
              : `Prepare and send an SMS payment reminder to ${customer.name}.`}
          </DialogDescription>
        </DialogHeader>

        {/* Recipient Details */}
        <div className="bg-background/50 border border-border/70 rounded-xl p-3 flex justify-between items-center text-xs">
          <div>
            <span className="font-bold text-foreground block">{customer.name}</span>
            <span className="text-[11px] text-muted-foreground font-mono flex items-center gap-1 mt-0.5">
              <Phone className="h-3 w-3" />
              {customer.phone}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-muted-foreground uppercase block">
              {isBangla ? "পাওনা পরিমাণ" : "Due Amount"}
            </span>
            <span className="font-bold font-mono text-rose-600 dark:text-rose-400 text-xs">
              {formatCurrency(customer.totalOutstanding)}
            </span>
          </div>
        </div>

        {/* Message Editor */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-foreground">
              {isBangla ? "মেসেজ প্রিভিউ (SMS Preview)" : "SMS Text Message"}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-[11px] text-primary hover:underline flex items-center gap-1 font-medium cursor-pointer"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
              <span>{copied ? (isBangla ? "কপি হয়েছে" : "Copied") : isBangla ? "কপি করুন" : "Copy"}</span>
            </button>
          </div>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="h-24 bg-background/50 border-input text-xs leading-relaxed focus-visible:ring-1"
          />
          <p className="text-[10px] text-muted-foreground text-right">
            {message.length} {isBangla ? "টি অক্ষর" : "characters"} (~1 SMS)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <Button
            type="button"
            onClick={handleSendSms}
            disabled={isSending}
            className="flex-1 h-10 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 cursor-pointer"
          >
            <Send className="h-3.5 w-3.5" />
            <span>
              {isSending
                ? isBangla
                  ? "পাঠানো হচ্ছে..."
                  : "Sending..."
                : isBangla
                ? "এসএমএস পাঠান (Send SMS)"
                : "Send SMS Reminder"}
            </span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSending}
            className="h-10 text-xs px-4 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {isBangla ? "বাতিল" : "Cancel"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
