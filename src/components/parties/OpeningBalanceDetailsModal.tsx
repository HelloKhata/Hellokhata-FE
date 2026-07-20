// Hello Khata - Opening Balance Details Modal
// Modal to view/edit details of an opening balance transaction

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
  Calendar,
} from "lucide-react";
import { useGetOpeningBalance } from "@/hooks/api/usePayments";
import {
  useAppTranslation,
  useDateFormat,
} from "@/hooks/useAppTranslation";
import { cn } from "@/lib/utils";

interface OpeningBalanceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: any; // PartyLedgerEntry
  party?: any; // Party object passed from parent
}

export function OpeningBalanceDetailsModal({
  isOpen,
  onClose,
  entry,
  party,
}: OpeningBalanceDetailsModalProps) {
  const { isBangla } = useAppTranslation();
  const { formatDate } = useDateFormat();

  // Form states
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [balanceType, setBalanceType] = useState<'receive' | 'give'>('receive');

  const partyId = party?.id || entry?.partyId;
  const { data: openingBalanceResponse } = useGetOpeningBalance(partyId);

  // Reset form states when entry or openingBalanceResponse changes
  useEffect(() => {
    const ob = openingBalanceResponse?.data || openingBalanceResponse;
    if (ob && (typeof ob.amount === 'number' || ob.amount != null)) {
      setAmount(Math.abs(Number(ob.amount)).toString());
      setRemarks(ob.remarks || ob.notes || "");
      setDate(ob.date || ob.createdAt ? new Date(ob.date || ob.createdAt) : new Date());
      setBalanceType(ob.balanceDirection);
    } 
  }, [entry, openingBalanceResponse, isOpen]);

  if (!entry) return null;



  const renderAdjustmentView = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="tx-amount"
              className="text-xs font-bold text-muted-foreground uppercase tracking-wider"
            >
              {isBangla ? "প্রারম্ভিক পরিমাণ" : "Opening Amount"}
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
                disabled
                className="h-11 pl-10 text-sm border-border focus:border-primary font-bold font-mono transition-colors duration-200 bg-zinc-100 dark:bg-zinc-900/60 text-zinc-400 dark:text-zinc-500 border-zinc-200 dark:border-zinc-800 opacity-60 cursor-not-allowed"
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
                disabled
                onClick={() => setBalanceType(dir.value as 'receive' | 'give')}
                className={cn(
                  'flex items-center justify-center gap-2 px-3 py-1.5 rounded-md border text-xs font-medium transition-all cursor-not-allowed opacity-70',
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
            disabled
            placeholder={
              isBangla ? "এখানে মন্তব্য লিখুন..." : "Enter remarks here..."
            }
            className="text-sm border-border resize-none h-24 transition-colors duration-200 bg-zinc-100 dark:bg-zinc-900/60 text-zinc-400 dark:text-zinc-500 border-zinc-200 dark:border-zinc-800 opacity-60 cursor-not-allowed"
          />
        </div>
      </div>
    );
  };

  const renderFooterButtons = () => {
    return (
      <div className="flex flex-row items-center justify-end w-full gap-4">
        <Button
          variant="outline"
          onClick={onClose}
          className="h-10 text-xs border-border"
        >
          {isBangla ? "বন্ধ করুন" : "Close"}
        </Button>
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
                {isBangla ? "প্রারম্ভিক ব্যালেন্স" : "Opening Balance"}
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


    </>
  );
}
