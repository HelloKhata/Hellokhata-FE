"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarIcon, Clock, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useCreateReminder, useUpdateReminder } from "@/hooks/api/useReminders";

interface AddReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  partyId?: string;
  onSave?: (data: {
    title: string;
    dateTime: string;
    type: "payment reminder" | "event reminder" | "task reminder";
    notes: string;
    partyId?: string;
  }) => void;
  initialTitle?: string;
  initialDate?: Date;
  initialTime?: string;
  initialDateTime?: string;
  initialType?: "payment reminder" | "event reminder" | "task reminder";
  initialNotes?: string;
  reminderId?: string;
}

// Time Picker Dropdown Options
const HOURS = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0"),
);
const MINUTES = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0"),
);
const PERIODS = ["AM", "PM"];

export function AddReminderModal({
  isOpen,
  onClose,
  partyId,
  initialTitle = "",
  initialDate,
  initialTime,
  initialDateTime,
  initialType,
  initialNotes = "",
  reminderId,
}: AddReminderModalProps) {
  const { isBangla } = useAppTranslation();

  // State Management
  const [title, setTitle] = useState(initialTitle);
  const [date, setDate] = useState<Date>(initialDate || new Date());
  const [time, setTime] = useState(
    initialTime ||
      new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
  );
  const [type, setType] = useState(initialType || "payment reminder");
  const [notes, setNotes] = useState(initialNotes);

  // Popover States
  const [dateOpen, setDateOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);

  // Split time into components for custom time picker
  const [selectedHour, setSelectedHour] = useState("12");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [selectedPeriod, setSelectedPeriod] = useState("AM");

  const { mutate: createReminder, isPending: isCreating } = useCreateReminder();
  const { mutate: updateReminder, isPending: isUpdating } = useUpdateReminder();
  const isPending = isCreating || isUpdating;

  // Handle saving time from custom picker
  const handleTimeChange = (hour: string, minute: string, period: string) => {
    const newTime = `${hour}:${minute} ${period}`;
    setTime(newTime);
  };

  const handleSave = () => {
    if (!title?.trim()) {
      toast.error(
        isBangla
          ? "দয়া করে রিমাইন্ডার টাইটেল লিখুন"
          : "Please enter a reminder title",
      );
      return;
    }

    // Combine date and time to ISO 8601 string
    const match = time.match(/^(\d{2}):(\d{2})\s(AM|PM)$/i);
    console.log("Time match:", match);
    let hour = 12;
    let minute = 0;
    if (match) {
      hour = parseInt(match[1], 10);
      minute = parseInt(match[2], 10);
      const period = match[3].toUpperCase();
      if (period === "PM" && hour < 12) {
        hour += 12;
      } else if (period === "AM" && hour === 12) {
        hour = 0;
      }
    }
    const combinedDate = new Date(date);
    combinedDate.setHours(hour, minute, 0, 0);
    const dateTime = combinedDate.toISOString();

    const payload = {
      title,
      dateTime,
      type: type as "payment reminder" | "event reminder" | "task reminder",
      notes,
      partyId,
    };

    if (reminderId) {
      updateReminder(
        { id: reminderId, data: payload },
        {
          onSuccess: (data) => {
            console.log("Reminder updated:", data);
            toast.success(
              isBangla
                ? "রিমাইন্ডার সফলভাবে আপডেট করা হয়েছে"
                : "Reminder updated successfully",
            );
            onClose();
          },
        },
      );
    } else {
      createReminder(payload, {
        onSuccess: (data) => {
          console.log("Reminder created:", data);
          toast.success(
            isBangla
              ? "রিমাইন্ডার সফলভাবে তৈরি হয়েছে"
              : "Reminder created successfully",
          );
          onClose();
        },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[540px] p-0 rounded-xl overflow-hidden border border-border/80 bg-card shadow-2xl">
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
              placeholder={
                isBangla ? "রিমাইন্ডার লিখুন..." : "Enter reminder title..."
              }
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
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1.5">
                        Hour
                      </span>
                      <ScrollArea className="h-40 w-12 border-r border-border/50 pr-2">
                        <div className="flex flex-col gap-0.5">
                          {HOURS.map((h) => (
                            <button
                              key={h}
                              onClick={() => {
                                setSelectedHour(h);
                                handleTimeChange(
                                  h,
                                  selectedMinute,
                                  selectedPeriod,
                                );
                              }}
                              className={cn(
                                "px-2 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer text-center",
                                selectedHour === h
                                  ? "bg-primary text-primary-foreground font-bold"
                                  : "text-foreground hover:bg-muted/60",
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
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1.5">
                        Min
                      </span>
                      <ScrollArea className="h-40 w-12 border-r border-border/50 pr-2">
                        <div className="flex flex-col gap-0.5">
                          {MINUTES.map((m) => (
                            <button
                              key={m}
                              onClick={() => {
                                setSelectedMinute(m);
                                handleTimeChange(
                                  selectedHour,
                                  m,
                                  selectedPeriod,
                                );
                              }}
                              className={cn(
                                "px-2 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer text-center",
                                selectedMinute === m
                                  ? "bg-primary text-primary-foreground font-bold"
                                  : "text-foreground hover:bg-muted/60",
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
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">
                        Period
                      </span>
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
                                : "text-foreground bg-background border-border/60 hover:bg-muted/60",
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
              <Select value={type} onValueChange={setType as any}>
                <SelectTrigger className="w-full h-11 bg-background border-border/60 text-foreground font-normal rounded-lg px-4">
                  <SelectValue
                    placeholder={isBangla ? "রিমাইন্ডার টাইপ" : "Reminder Type"}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="payment reminder">
                    {isBangla ? "পেমেন্ট রিমাইন্ডার" : "Payment Reminder"}
                  </SelectItem>
                  <SelectItem value="event reminder">
                    {isBangla ? "ইভেন্ট রিমাইন্ডার" : "Event Reminder"}
                  </SelectItem>
                  <SelectItem value="task reminder">
                    {isBangla ? "টাস্ক রিমাইন্ডার" : "Task Reminder"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes field */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground/90">
              {isBangla ? "রিমাইন্ডার নোট" : "Notes"}
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                isBangla
                  ? "রিমাইন্ডার সম্পর্কে লিখুন..."
                  : "Enter reminder notes/details..."
              }
              className="min-h-[100px] w-full bg-background border-border/60 text-foreground font-normal rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground/40 resize-none"
            />
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
            disabled={isPending}
            className="h-10 px-5 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 border-none shadow-sm rounded-lg text-sm transition-colors cursor-pointer flex items-center gap-2"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isBangla ? "সংরক্ষণ করুন" : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
