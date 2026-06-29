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
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarIcon, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface AddReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: {
    title: string;
    date: Date;
    time: string;
    type: string;
  }) => void;
  initialTitle?: string;
  initialDate?: Date;
  initialTime?: string;
  initialType?: string;
}

// Time Picker Dropdown Options
const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
const PERIODS = ["AM", "PM"];

export function AddReminderModal({
  isOpen,
  onClose,
  onSave,
  initialTitle = "Collect Tk. 60,000 from rahman",
  initialDate,
  initialTime = "03:33 PM",
  initialType = "Payment Reminder",
}: AddReminderModalProps) {
  const { isBangla } = useAppTranslation();

  // State Management
  const [title, setTitle] = useState(initialTitle);
  const [date, setDate] = useState<Date>(initialDate || new Date(2026, 5, 26)); // Default 26 Jun 2026 as in image
  const [time, setTime] = useState(initialTime);
  const [type, setType] = useState(initialType);

  // Popover States
  const [dateOpen, setDateOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);

  // Split time into components for custom time picker
  const [selectedHour, setSelectedHour] = useState("03");
  const [selectedMinute, setSelectedMinute] = useState("33");
  const [selectedPeriod, setSelectedPeriod] = useState("PM");

  // Sync internal time picker states when 'time' prop changes or component mounts
  useEffect(() => {
    const match = time.match(/^(\d{2}):(\d{2})\s(AM|PM)$/i);
    if (match) {
      setSelectedHour(match[1]);
      setSelectedMinute(match[2]);
      setSelectedPeriod(match[3].toUpperCase());
    }
  }, [time]);

  // Handle saving time from custom picker
  const handleTimeChange = (hour: string, minute: string, period: string) => {
    const newTime = `${hour}:${minute} ${period}`;
    setTime(newTime);
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast.error(isBangla ? "দয়া করে রিমাইন্ডার টাইটেল লিখুন" : "Please enter a reminder title");
      return;
    }

    if (onSave) {
      onSave({ title, date, time, type });
    }

    toast.success(
      isBangla
        ? "রিমাইন্ডার সফলভাবে সেট করা হয়েছে!"
        : "Reminder set successfully!"
    );
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[540px] p-0 rounded-xl overflow-hidden border border-border/80 bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
          <DialogTitle className="text-[17px] font-semibold text-foreground tracking-tight">
            {isBangla ? "নতুন রিমাইন্ডার যোগ করুন" : "Add New Reminder"}
          </DialogTitle>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-muted-foreground/75 hover:bg-muted hover:text-foreground transition-all cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6">
          {/* Reminder Title Input */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground/90">
              {isBangla ? "রিমাইন্ডার টাইটেল" : "Reminder Title"}
            </Label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isBangla ? "রিমাইন্ডার লিখুন..." : "Enter reminder title..."}
              className="h-11 w-full bg-background border-border/60 text-foreground font-normal rounded-lg px-4 focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground/40"
            />
          </div>

          {/* Date & Time Selectors */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground/90">
              {isBangla ? "তারিখ ও সময় নির্বাচন করুন" : "Select Date & Time"}
            </Label>
            <div className="grid grid-cols-2 gap-4">
              {/* Date Picker Popover */}
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-11 justify-between text-left font-normal bg-background border-border/60 hover:bg-muted/40 text-foreground rounded-lg px-4"
                  >
                    <span className="font-normal text-[15px]">
                      {format(date, "dd MMM yyyy")}
                    </span>
                    <CalendarIcon className="h-4.5 w-4.5 text-muted-foreground/60" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                      if (selectedDate) setDate(selectedDate);
                      setDateOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {/* Custom Time Picker Popover */}
              <Popover open={timeOpen} onOpenChange={setTimeOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-11 justify-between text-left font-normal bg-background border-border/60 hover:bg-muted/40 text-foreground rounded-lg px-4"
                  >
                    <span className="font-normal text-[15px]">{time}</span>
                    <Clock className="h-4.5 w-4.5 text-muted-foreground/60" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="flex p-3 gap-2 bg-card border border-border/80 rounded-lg shadow-xl max-h-[240px] overflow-hidden">
                    {/* Hour Column */}
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1.5">Hour</span>
                      <ScrollArea className="h-40 w-12 border-r border-border/50 pr-2">
                        <div className="flex flex-col gap-0.5">
                          {HOURS.map((h) => (
                            <button
                              key={h}
                              onClick={() => {
                                setSelectedHour(h);
                                handleTimeChange(h, selectedMinute, selectedPeriod);
                              }}
                              className={cn(
                                "px-2 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer text-center",
                                selectedHour === h
                                  ? "bg-primary text-primary-foreground font-bold"
                                  : "text-foreground hover:bg-muted/60"
                              )}
                            >
                              {h}
                            </button>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>

                    {/* Minute Column */}
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1.5">Min</span>
                      <ScrollArea className="h-40 w-12 border-r border-border/50 pr-2">
                        <div className="flex flex-col gap-0.5">
                          {MINUTES.map((m) => (
                            <button
                              key={m}
                              onClick={() => {
                                setSelectedMinute(m);
                                handleTimeChange(selectedHour, m, selectedPeriod);
                              }}
                              className={cn(
                                "px-2 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer text-center",
                                selectedMinute === m
                                  ? "bg-primary text-primary-foreground font-bold"
                                  : "text-foreground hover:bg-muted/60"
                              )}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>

                    {/* AM/PM Column */}
                    <div className="flex flex-col items-center justify-center pl-1.5 gap-2">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Period</span>
                      <div className="flex flex-col gap-1.5">
                        {PERIODS.map((p) => (
                          <button
                            key={p}
                            onClick={() => {
                              setSelectedPeriod(p);
                              handleTimeChange(selectedHour, selectedMinute, p);
                            }}
                            className={cn(
                              "px-3 py-1.5 text-xs font-bold rounded-md transition-colors border cursor-pointer text-center",
                              selectedPeriod === p
                                ? "bg-primary text-primary-foreground border-primary"
                                : "text-foreground bg-background border-border/60 hover:bg-muted/60"
                            )}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Reminder Type Select */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground/90">
              {isBangla ? "রিমাইন্ডারের ধরন" : "Reminder Type"}
            </Label>
            <div className="w-[50%]">
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-full h-11 bg-background border-border/60 text-foreground font-normal rounded-lg px-4">
                  <SelectValue placeholder={isBangla ? "রিমাইন্ডার টাইপ" : "Reminder Type"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Payment Reminder">
                    {isBangla ? "পেমেন্ট রিমাইন্ডার" : "Payment Reminder"}
                  </SelectItem>
                  <SelectItem value="Follow-up Reminder">
                    {isBangla ? "ফলো-আপ রিমাইন্ডার" : "Follow-up Reminder"}
                  </SelectItem>
                  <SelectItem value="Call Reminder">
                    {isBangla ? "কল রিমাইন্ডার" : "Call Reminder"}
                  </SelectItem>
                  <SelectItem value="Other">
                    {isBangla ? "অন্যান্য" : "Other"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border/40 bg-muted/20">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-10 px-5 border-border/60 hover:bg-muted text-foreground font-medium rounded-lg text-sm cursor-pointer"
          >
            {isBangla ? "বাতিল" : "Cancel"}
          </Button>

          <Button
            onClick={handleSave}
            className="h-10 px-5 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 border-none shadow-sm rounded-lg text-sm transition-colors cursor-pointer"
          >
            {isBangla ? "সংরক্ষণ করুন" : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
