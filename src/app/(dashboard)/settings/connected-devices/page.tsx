"use client";

import React, { useState } from "react";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { toast } from "@/hooks/use-toast";
import {
  Laptop,
  Smartphone,
  Monitor,
  MoreVertical,
  Trash2,
  ShieldAlert,
  Search,
  RefreshCw,
  LogOut,
  Copy,
  Check,
  Globe,
  CheckCircle2,
} from "lucide-react";

import { Button, Input } from "@/components/ui/premium";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

interface ConnectedDevice {
  id: string;
  deviceInfo: string;
  ipAddress: string;
  lastUsed: string;
  addedAt: string;
  isCurrent?: boolean;
  type?: "desktop" | "mobile" | "tablet";
}

const INITIAL_DEVICES: ConnectedDevice[] = [
  {
    id: "1",
    deviceInfo:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
    ipAddress: "2401:f40:1509:326:9152:326c:f6b:56a2",
    lastUsed: "Jul 23, 2026 11:40 AM",
    addedAt: "Jul 14, 2026 02:20 PM",
    isCurrent: true,
    type: "desktop",
  },
  {
    id: "2",
    deviceInfo:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36",
    ipAddress: "59.153.103.254",
    lastUsed: "Jul 16, 2026 03:18 PM",
    addedAt: "Jul 16, 2026 03:18 PM",
    isCurrent: false,
    type: "desktop",
  },
  {
    id: "3",
    deviceInfo:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
    ipAddress: "103.102.14.25",
    lastUsed: "Jul 12, 2026 09:12 AM",
    addedAt: "Jul 01, 2026 10:00 AM",
    isCurrent: false,
    type: "mobile",
  },
];

export default function ConnectedDevicesPage() {
  const { isBangla } = useAppTranslation();
  const [devices, setDevices] = useState<ConnectedDevice[]>(INITIAL_DEVICES);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal dialog states
  const [deviceToRevoke, setDeviceToRevoke] = useState<ConnectedDevice | null>(
    null
  );
  const [isRevokeAllOpen, setIsRevokeAllOpen] = useState(false);

  // Handlers
  const handleCopyIp = (id: string, ip: string) => {
    navigator.clipboard.writeText(ip);
    setCopiedId(id);
    toast({
      title: isBangla ? "আইপি কপি করা হয়েছে" : "IP Copied",
      description: ip,
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRevokeSingle = (device: ConnectedDevice) => {
    setDevices((prev) => prev.filter((d) => d.id !== device.id));
    setDeviceToRevoke(null);
    toast({
      title: isBangla ? "ডিভাইস সংযোগ বিচ্ছিন্ন করা হয়েছে" : "Device Revoked",
      description: isBangla
        ? "ডিভাইসটি সফলভাবে নিষ্ক্রিয় করা হয়েছে"
        : "The device session has been terminated.",
    });
  };

  const handleRevokeAllOther = () => {
    setDevices((prev) => prev.filter((d) => d.isCurrent));
    setIsRevokeAllOpen(false);
    toast({
      title: isBangla
        ? "অন্যান্য সকল ডিভাইস বিচ্ছিন্ন করা হয়েছে"
        : "All Other Devices Revoked",
      description: isBangla
        ? "বর্তমান ডিভাইস ব্যতীত সকল সেশন বন্ধ করা হয়েছে"
        : "All other sessions have been logged out successfully.",
    });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: isBangla ? "রিফ্রেশ সম্পূর্ণ" : "Refreshed",
        description: isBangla
          ? "ডিভাইস তালিকা আপডেট করা হয়েছে"
          : "Connected devices list has been updated.",
      });
    }, 600);
  };

  const filteredDevices = devices.filter(
    (d) =>
      d.deviceInfo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.ipAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 mx-auto pb-10">
      {/* Header & Main Actions */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Laptop className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {isBangla ? "সংযুক্ত ডিভাইসসমূহ" : "Connected Devices"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {isBangla
                  ? "আপনার অ্যাকাউন্টে সক্রিয় ডিভাইস এবং সেশনসমূহ পরিচালনা করুন"
                  : "Manage devices and active sessions signed into your account"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="rounded-xl"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isBangla ? "রিফ্রেশ" : "Refresh"}
            </Button>

            {devices.some((d) => !d.isCurrent) && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsRevokeAllOpen(true)}
                className="rounded-xl"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {isBangla
                  ? "অন্যান্য সেশন নিষ্ক্রিয় করুন"
                  : "Revoke All Other Sessions"}
              </Button>
            )}
          </div>
        </div>

        {/* Stats & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isBangla
                  ? "ডিভাইস তথ্য বা আইপি দিয়ে খুঁজুন..."
                  : "Search device info or IP address..."
              }
              className="pl-9 h-10"
            />
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground self-start sm:self-center">
            <div className="flex items-center gap-1.5 bg-muted/40 px-3 py-1.5 rounded-lg border border-border/50">
              <Globe className="h-3.5 w-3.5 text-primary" />
              <span>
                {isBangla ? "মোট সংযুক্ত:" : "Total Connected:"}{" "}
                <strong className="text-foreground">{devices.length}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Devices Table matching exact layout from user screenshot */}
        <div className="rounded-xl border border-border/50 overflow-hidden bg-background/50">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-12 font-semibold text-xs text-muted-foreground uppercase">
                  #
                </TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground uppercase">
                  {isBangla ? "ডিভাইস তথ্য" : "DEVICE INFO"}
                </TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground uppercase">
                  {isBangla ? "আইপি এড্রেস" : "IP ADDRESS"}
                </TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground uppercase">
                  {isBangla ? "শেষ ব্যবহার" : "LAST USED"}
                </TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground uppercase">
                  {isBangla ? "সংযুক্তির সময়" : "ADDED AT"}
                </TableHead>
                <TableHead className="text-right font-semibold text-xs text-muted-foreground uppercase">
                  {isBangla ? "অ্যাকশন" : "ACTIONS"}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredDevices.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-muted-foreground text-sm"
                  >
                    {isBangla
                      ? "কোনো সংযুক্ত ডিভাইস পাওয়া যায়নি"
                      : "No connected devices found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredDevices.map((device, index) => (
                  <TableRow
                    key={device.id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    {/* Index column */}
                    <TableCell className="font-medium text-xs text-muted-foreground">
                      {index + 1}
                    </TableCell>

                    {/* Device info column */}
                    <TableCell className="text-xs max-w-md">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {device.type === "mobile" ? (
                            <Smartphone className="h-4 w-4 text-primary shrink-0" />
                          ) : (
                            <Laptop className="h-4 w-4 text-primary shrink-0" />
                          )}
                          <span className="font-mono text-muted-foreground text-[11px] break-all leading-snug">
                            {device.deviceInfo}
                          </span>
                          {device.isCurrent && (
                            <Badge
                              variant="outline"
                              className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shrink-0 flex items-center gap-1"
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              {isBangla ? "বর্তমান ডিভাইস" : "Current Device"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* IP Address column */}
                    <TableCell className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                      {device.ipAddress}
                    </TableCell>

                    {/* Last Used column */}
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {device.lastUsed}
                    </TableCell>

                    {/* Added At column */}
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {device.addedAt}
                    </TableCell>

                    {/* Actions column (...) */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg hover:bg-muted"
                          >
                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() =>
                              handleCopyIp(device.id, device.ipAddress)
                            }
                            className="cursor-pointer"
                          >
                            {copiedId === device.id ? (
                              <Check className="h-4 w-4 mr-2 text-emerald-500" />
                            ) : (
                              <Copy className="h-4 w-4 mr-2 text-muted-foreground" />
                            )}
                            {isBangla ? "আইপি কপি করুন" : "Copy IP Address"}
                          </DropdownMenuItem>

                          {!device.isCurrent && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setDeviceToRevoke(device)}
                                className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {isBangla
                                  ? "ডিভাইস সেশন বন্ধ করুন"
                                  : "Revoke Device"}
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Confirmation Dialog: Revoke Single Device */}
      <AlertDialog
        open={!!deviceToRevoke}
        onOpenChange={(open) => !open && setDeviceToRevoke(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="h-5 w-5" />
              {isBangla ? "ডিভাইস সংযোগ বিচ্ছিন্ন করবেন?" : "Revoke Device Session?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isBangla
                ? "এই ডিভাইস থেকে আপনার অ্যাকাউন্ট লগআউট করা হবে। আপনাকে পুনরায় লগইন করতে হতে পারে।"
                : "This device will be logged out of your account immediately."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">
              {isBangla ? "বাতিল" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deviceToRevoke && handleRevokeSingle(deviceToRevoke)}
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isBangla ? "বিচ্ছিন্ন করুন" : "Revoke"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmation Dialog: Revoke All Other Devices */}
      <AlertDialog open={isRevokeAllOpen} onOpenChange={setIsRevokeAllOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="h-5 w-5" />
              {isBangla
                ? "অন্যান্য সকল সেশন বন্ধ করবেন?"
                : "Revoke All Other Sessions?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isBangla
                ? "বর্তমান ডিভাইস ছাড়া অন্য সকল সংযুক্ত ডিভাইস থেকে আপনার অ্যাকাউন্ট লগআউট হয়ে যাবে।"
                : "All other active sessions except for your current device will be logged out."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">
              {isBangla ? "বাতিল" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevokeAllOther}
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isBangla ? "সকল সেশন বন্ধ করুন" : "Revoke All"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
