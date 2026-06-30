"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  Calendar,
  CreditCard,
  CheckCircle,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
import { EmptyState } from "@/components/common";
import { useAppTranslation, useDateFormat } from "@/hooks/useAppTranslation";
import { useGetReminders, useDeleteReminder } from "@/hooks/api/useReminders";
import { AddReminderModal } from "@/components/parties/AddReminderModal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const typeIcons: Record<string, any> = {
  "payment reminder": CreditCard,
  "event reminder": Calendar,
  "task reminder": CheckCircle,
};

const typeLabels: Record<string, { en: string; bn: string }> = {
  "payment reminder": { en: "Payment Reminder", bn: "পেমেন্ট রিমাইন্ডার" },
  "event reminder": { en: "Event Reminder", bn: "ইভেন্ট রিমাইন্ডার" },
  "task reminder": { en: "Task Reminder", bn: "টাস্ক রিমাইন্ডার" },
};

export default function RemindersPage() {
  const router = useRouter();
  const { isBangla } = useAppTranslation();
  const { formatDateTime } = useDateFormat();

  const [activeTab, setActiveTab] = useState<"upcoming" | "completed">("completed");
  const [searchTerm, setSearchTerm] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<any>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { data: reminders = [], isLoading } = useGetReminders();
  const { mutate: deleteReminder, isPending: isDeleting } = useDeleteReminder();

  // Helper to determine if a reminder is completed (past date or explicit property)
  const isCompleted = (r: any) => {
    if (r.completed === true || r.status === "completed") return true;
    return new Date(r.dateTime) <= new Date();
  };

  // Group and search reminders
  const filteredReminders = reminders.filter((r: any) => {
    const matchesSearch =
      r.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.notes?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab =
      activeTab === "completed" ? isCompleted(r) : !isCompleted(r);

    return matchesSearch && matchesTab;
  });

  const upcomingCount = reminders.filter((r: any) => !isCompleted(r)).length;
  const completedCount = reminders.filter((r: any) => isCompleted(r)).length;

  const handleDelete = () => {
    if (!deleteConfirmId) return;

    deleteReminder(deleteConfirmId, {
      onSuccess: () => {
        toast.success(
          isBangla
            ? "রিমাইন্ডার সফলভাবে মুছে ফেলা হয়েছে"
            : "Reminder deleted successfully"
        );
        setDeleteConfirmId(null);
      },
    });
  };

  const handleEdit = (reminder: any) => {
    setSelectedReminder(reminder);
    setAddModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header section matching mockup layout */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
            {isBangla ? "রিমাইন্ডারসমূহ" : "Reminders"}
          </h1>
        </div>
        <Button
          onClick={() => {
            setSelectedReminder(null);
            setAddModalOpen(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-2 rounded-lg px-4 h-10 border-none shadow-sm cursor-pointer transition-colors"
        >
          <Plus className="h-4 w-4" />
          {isBangla ? "নতুন রিমাইন্ডার" : "Add New Reminder"}
        </Button>
      </div>

      {/* Tabs Layout */}
      <div className="flex border-b border-border/40 gap-6">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={cn(
            "pb-3 text-sm font-medium relative transition-colors cursor-pointer",
            activeTab === "upcoming"
              ? "text-emerald-500 font-semibold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {isBangla ? `আসন্ন (${upcomingCount})` : `Upcoming (${upcomingCount})`}
          {activeTab === "upcoming" && (
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-emerald-500 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={cn(
            "pb-3 text-sm font-medium relative transition-colors cursor-pointer",
            activeTab === "completed"
              ? "text-emerald-500 font-semibold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {isBangla
            ? `সম্পন্ন (${completedCount})`
            : `Completed (${completedCount})`}
          {activeTab === "completed" && (
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-emerald-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Filter and List Section */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60 shrink-0" />
          <Input
            placeholder={
              isBangla ? "রিমাইন্ডার খুঁজুন..." : "Search reminder..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-10 bg-background border-border/60 text-foreground font-normal rounded-lg placeholder:text-muted-foreground/40"
          />
        </div>

        {/* Reminders Table */}
        <Card className="bg-[#131A22] border-border/40 overflow-hidden rounded-xl">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="animate-spin h-8 w-8 text-emerald-600" />
              </div>
            ) : filteredReminders.length === 0 ? (
              <div className="py-12">
                <EmptyState
                  icon={Bell}
                  title={
                    isBangla
                      ? "কোনো রিমাইন্ডার পাওয়া যায়নি"
                      : "No reminders found"
                  }
                  description={
                    isBangla
                      ? "নতুন একটি রিমাইন্ডার যোগ করতে ওপরের বাটনে চাপ দিন"
                      : "Click the button above to add a new reminder"
                  }
                />
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-background/20 border-b border-border/40">
                  <TableRow className="border-b border-border/40 hover:bg-transparent">
                    <TableHead className="w-[200px] text-muted-foreground font-semibold py-4 px-6">
                      {isBangla ? "ধরণ" : "Type"}
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold py-4 px-6">
                      {isBangla ? "শিরোনাম" : "Title"}
                    </TableHead>
                    <TableHead className="w-[250px] text-muted-foreground font-semibold py-4 px-6">
                      {isBangla ? "তারিখ" : "Date"}
                    </TableHead>
                    <TableHead className="w-[120px] text-right text-muted-foreground font-semibold py-4 px-6">
                      {isBangla ? "অ্যাকশন" : "Action"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReminders.map((reminder: any) => {
                    const IconComponent = typeIcons[reminder.type] || Bell;
                    const labelObj = typeLabels[reminder.type] || {
                      en: reminder.type || "Reminder",
                      bn: reminder.type || "রিমাইন্ডার",
                    };
                    const typeLabel = isBangla ? labelObj.bn : labelObj.en;

                    return (
                      <TableRow
                        key={reminder.id}
                        className="border-b border-border/40 hover:bg-muted/10 transition-colors"
                      >
                        <TableCell className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-muted/40 flex items-center justify-center text-muted-foreground shrink-0">
                              <IconComponent className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-medium text-foreground">
                              {typeLabel}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm text-foreground font-medium">
                              {reminder.title}
                            </span>
                            {reminder.notes && (
                              <span className="text-xs text-muted-foreground/80 line-clamp-1">
                                {reminder.notes}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6 text-sm text-muted-foreground font-medium">
                          {formatDateTime(reminder.dateTime)}
                        </TableCell>
                        <TableCell className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(reminder)}
                              className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteConfirmId(reminder.id)}
                              className="h-8 w-8 text-destructive hover:bg-destructive-subtle hover:text-destructive cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add / Edit Reminder Modal */}
      <AddReminderModal
        isOpen={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setSelectedReminder(null);
        }}
        reminderId={selectedReminder?.id}
        initialTitle={selectedReminder?.title}
        initialDateTime={selectedReminder?.dateTime}
        initialType={selectedReminder?.type}
        initialNotes={selectedReminder?.notes}
        partyId={selectedReminder?.partyId}
      />

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={!!deleteConfirmId}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <AlertDialogContent className="bg-card border border-border/80 rounded-xl shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              {isBangla ? "আপনি কি নিশ্চিত?" : "Are you sure?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              {isBangla
                ? "এই রিমাইন্ডারটি স্থায়ীভাবে মুছে ফেলা হবে।"
                : "This reminder will be permanently deleted."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-background border-border/60 hover:bg-muted text-foreground cursor-pointer rounded-lg">
              {isBangla ? "বাতিল" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90 text-white font-semibold cursor-pointer rounded-lg flex items-center gap-2"
            >
              {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isBangla ? "মুছে ফেলুন" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
