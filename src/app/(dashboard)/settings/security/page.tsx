"use client";

import React, { useState } from "react";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { toast } from "@/hooks/use-toast";
import { useUpdatePassword } from "@/hooks/api/useSettings";
import {
  Shield,
  Key,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Smartphone,
  Globe,
  Laptop,
} from "lucide-react";

import { Button, Input } from "@/components/ui/premium";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SecurityPage() {
  const { isBangla } = useAppTranslation();

  // Password State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Two-Factor Authentication (2FA) State
  const [twoFactor, setTwoFactor] = useState({
    phone: false,
    email: true,
  });

  // Mock Data for Login Activity
  const loginActivities = [
    {
      id: "1",
      device: 'MacBook Pro 16"',
      browser: "Chrome 126.0",
      ip: "103.102.14.22",
      os: "macOS Sonoma",
      date: "2026-07-22",
      time: "02:45 PM",
      isCurrent: true,
      location: "Dhaka, Bangladesh",
    },
    {
      id: "2",
      device: "iPhone 15 Pro",
      browser: "Safari 17.4",
      ip: "103.102.14.25",
      os: "iOS 17.5",
      date: "2026-07-21",
      time: "09:12 AM",
      isCurrent: false,
      location: "Dhaka, Bangladesh",
    },
    {
      id: "3",
      device: "Windows Desktop",
      browser: "Firefox 125.0",
      ip: "118.179.42.10",
      os: "Windows 11",
      date: "2026-07-18",
      time: "11:30 PM",
      isCurrent: false,
      location: "Chittagong, Bangladesh",
    },
    {
      id: "4",
      device: "Samsung Galaxy S24",
      browser: "Chrome Mobile 126.0",
      ip: "203.190.12.88",
      os: "Android 14",
      date: "2026-07-15",
      time: "04:15 PM",
      isCurrent: false,
      location: "Sylhet, Bangladesh",
    },
  ];

  const { mutate: updatePassword, isPending: isChangingPassword } =
    useUpdatePassword();

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      toast({
        title: isBangla ? "তথ্য অসম্পূর্ণ" : "Incomplete data",
        description: isBangla ? "সব ঘর পূরণ করুন" : "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast({
        title: isBangla ? "পাসওয়ার্ড ছোট" : "Password too short",
        description: isBangla
          ? "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে"
          : "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: isBangla ? "পাসওয়ার্ড মিলছে না" : "Passwords do not match",
        description: isBangla
          ? "নতুন পাসওয়ার্ড দুটি মিলছে না"
          : "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    updatePassword(
      {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      },
      {
        onSuccess: () => {
          toast({
            title: isBangla
              ? "সফলভাবে আপডেট করা হয়েছে"
              : "Successfully updated",
            description: isBangla
              ? "আপনার পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে"
              : "Your password has been changed successfully",
          });
          setPasswordForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        },
        onError: (error: any) => {
          toast({
            title: isBangla ? "ত্রুটি ঘটেছে" : "An error occurred",
            description:
              error?.message ||
              (isBangla ? "কিছু একটা ভুল হয়েছে" : "Something went wrong"),
            variant: "destructive",
          });
        },
      }
    );
  };

  const handle2FAToggle = (type: "phone" | "email", enabled: boolean) => {
    setTwoFactor((prev) => ({ ...prev, [type]: enabled }));
    toast({
      title: isBangla ? "২-ফ্যাক্টর নিরাপত্তা আপডেট" : "2FA Status Changed",
      description: isBangla
        ? `${type === "phone" ? "ফোন" : "ইমেইল"} ২-ফ্যাক্টর যাচাইকরণ ${enabled ? "চালু" : "বন্ধ"} করা হয়েছে`
        : `${type === "phone" ? "Phone" : "Email"} 2FA verification has been ${enabled ? "enabled" : "disabled"}`,
    });
  };

  return (
    <div className="space-y-6 mx-auto pb-10">
      {/* SECTION 1: PASSWORD & SECURITY */}
      <form
        onSubmit={handleChangePassword}
        className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-6"
      >
        <div className="flex items-center justify-between pb-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {isBangla ? "পাসওয়ার্ড পরিচালনা" : "Password & Security"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {isBangla
                  ? "আপনার অ্যাকাউন্টের পাসওয়ার্ড আপডেট করুন"
                  : "Update your account password regularly"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">
              {isBangla ? "বর্তমান পাসওয়ার্ড" : "Current Password"}
            </Label>
            <div className="relative">
              <Input
                type={showPasswords.current ? "text" : "password"}
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  })
                }
                placeholder={
                  isBangla ? "বর্তমান পাসওয়ার্ড" : "Enter current password"
                }
                className="h-10 pr-10"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords({
                    ...showPasswords,
                    current: !showPasswords.current,
                  })
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.current ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">
              {isBangla ? "নতুন পাসওয়ার্ড" : "New Password"}
            </Label>
            <div className="relative">
              <Input
                type={showPasswords.new ? "text" : "password"}
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
                placeholder={
                  isBangla ? "নতুন পাসওয়ার্ড" : "Enter new password"
                }
                className="h-10 pr-10"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords({
                    ...showPasswords,
                    new: !showPasswords.new,
                  })
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">
              {isBangla ? "পাসওয়ার্ড নিশ্চিত করুন" : "Confirm Password"}
            </Label>
            <div className="relative">
              <Input
                type={showPasswords.confirm ? "text" : "password"}
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
                placeholder={
                  isBangla ? "পাসওয়ার্ড নিশ্চিত করুন" : "Confirm new password"
                }
                className="h-10 pr-10"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords({
                    ...showPasswords,
                    confirm: !showPasswords.confirm,
                  })
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isChangingPassword}
            size="sm"
            className="rounded-xl"
          >
            {isChangingPassword ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Key className="h-4 w-4 mr-2" />
            )}
            {isBangla ? "পাসওয়ার্ড পরিবর্তন করুন" : "Update Password"}
          </Button>
        </div>
      </form>

      {/* SECTION 2: TWO-FACTOR AUTHENTICATION (2FA) */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border/40">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <Smartphone className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {isBangla
                ? "টু-ফ্যাক্টর অথেনটিকেশন (2FA)"
                : "Two-Factor Authentication (2FA)"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {isBangla
                ? "আপনার অ্যাকাউন্টে অতিরিক্ত নিরাপত্তা স্তর যোগ করুন"
                : "Add extra layers of security to verify your login attempts"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SMS / Phone 2FA */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/40">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-background border border-border/50 text-foreground">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {isBangla
                    ? "এসএমএস / ফোন ভেরিফিকেশন"
                    : "SMS / Phone Verification"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isBangla
                    ? "ফোনে ওটিপি কোড পাঠানো হবে"
                    : "Receive an OTP code on your registered phone"}
                </p>
              </div>
            </div>
            <Switch
              checked={twoFactor.phone}
              onCheckedChange={(checked) => handle2FAToggle("phone", checked)}
            />
          </div>

          {/* Email 2FA */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/40">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-background border border-border/50 text-foreground">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {isBangla ? "ইমেইল ভেরিফিকেশন" : "Email Verification"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isBangla
                    ? "ইমেইলে ওটিপি কোড পাঠানো হবে"
                    : "Receive a security code to your email address"}
                </p>
              </div>
            </div>
            <Switch
              checked={twoFactor.email}
              onCheckedChange={(checked) => handle2FAToggle("email", checked)}
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: RECENT LOGIN ACTIVITY */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {isBangla ? "লগইন অ্যাক্টিভিটি" : "Recent Login Activity"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {isBangla
                  ? "সাম্প্রতিক লগইন ডিভাইস ও স্থানসমূহের ইতিহাস"
                  : "Monitor active sessions and devices accessing your account"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/50 overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>{isBangla ? "ডিভাইস" : "Device"}</TableHead>
                <TableHead>{isBangla ? "ব্রাউজার" : "Browser"}</TableHead>
                <TableHead>{isBangla ? "আইপি এড্রেস" : "IP Address"}</TableHead>
                <TableHead>{isBangla ? "অপারেটিং সিস্টেম" : "OS"}</TableHead>
                <TableHead>{isBangla ? "তারিখ" : "Date"}</TableHead>
                <TableHead className="text-right">
                  {isBangla ? "সময়" : "Time"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loginActivities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium text-xs">
                    <div className="flex items-center gap-2">
                      {activity.device.includes("iPhone") ||
                      activity.device.includes("Galaxy") ? (
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Laptop className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span>{activity.device}</span>
                      {activity.isCurrent && (
                        <Badge
                          variant="outline"
                          className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        >
                          {isBangla ? "বর্তমান" : "Active Now"}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {activity.browser}
                  </TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">
                    {activity.ip}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {activity.os}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {activity.date}
                  </TableCell>
                  <TableCell className="text-xs text-right text-muted-foreground">
                    {activity.time}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
