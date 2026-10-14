"use client";

import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Lock,
  Loader2,
  Store,
  EyeOff,
  Eye,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForgotPasswordStore } from "@/stores/forgotPasswordStore";
import { useResetPassword } from "@/hooks/api/useUser";
import Image from "next/image";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { phone: storedPhone, otp: storedOtp } = useForgotPasswordStore();
  const phone = searchParams.get("phone") || storedPhone || "";
  const initialOtp = searchParams.get("otp") || storedOtp || "";

  const [otp, setOtp] = useState(initialOtp);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: resetPassword, isPending } = useResetPassword();
  const { clearForgotPasswordInfo } = useForgotPasswordStore();

  const handleResetPassword = () => {
    if (!phone) {
      toast.error("Invalid state", {
        description: "Phone number is missing. Please restart password recovery.",
      });
      return;
    }

    if (!otp || otp.length !== 6) {
      toast.error("Invalid reset code", {
        description: "Please enter the 6-digit reset code sent to your phone",
      });
      return;
    }

    if (!password || password.length < 8) {
      toast.error("Invalid password", {
        description: "Password must be at least 8 characters long",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        description: "Please confirm your new password correctly",
      });
      return;
    }

    resetPassword(
      password,
      {
        onSuccess: (data) => {
          if (data.success) {
            clearForgotPasswordInfo();
            toast.success("Password reset successfully!");
            router.push("/login");
          }
        },
        onError: (error: any) => {
          const errMsg = error.response?.data?.error?.message || "Failed to reset password";
          toast.error(errMsg);
        },
      }
    );
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 lg:p-8 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0E5B43 0%, #083D2D 50%, #052B20 100%)",
      }}
    >
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-0 w-[600px] h-[500px] opacity-25"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 5% 0%, rgba(255, 255, 255, 0.25) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-[500px] h-[400px] opacity-25"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 90% 90%, rgba(0, 0, 0, 0.4) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] opacity-20"
          style={{
            background:
              "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(15, 191, 159, 0.15) 0%, transparent 70%)",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-full md:max-w-2xl lg:max-w-3xl relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8 md:mb-10">
          <Image className="mx-auto" src="/logo.png" alt="Logo" width={200} height={200} />
          <p
            className="mt-1 text-sm md:text-base whitespace-nowrap"
            style={{ color: "rgba(255, 255, 255, 0.85)" }}
          >
            আপনার ব্যবসার ডিজিটাল খাতা
          </p>
        </div>

        {/* Card */}
        <div
          className="px-6 py-6 md:px-10 md:py-8 lg:px-12 lg:py-10 rounded-xl w-full flex flex-col relative"
          style={{
            backgroundColor: "#F6F1E5",
            border: "1px solid #E5DEC9",
            boxShadow:
              "0 20px 40px -15px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.08)",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.form
              onSubmit={(e) => {
                e.preventDefault();
                handleResetPassword();
              }}
              key="reset-password"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-5 md:gap-6 relative z-10"
            >
              <div className="shrink-0">
                <div className="flex items-center gap-2">
                  <Link
                    href="/forgot-password"
                    className="p-1.5 rounded-lg transition-colors shrink-0 hover:bg-black/5"
                    style={{ color: "#0F172A" }}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Link>
                  <h2
                    className="text-xl md:text-2xl font-semibold whitespace-nowrap"
                    style={{ color: "#0F172A" }}
                  >
                    Reset Password
                  </h2>
                </div>
                <p
                  className="text-sm md:text-base mt-1 ml-10"
                  style={{ color: "#64748B" }}
                >
                  Set your new account password below
                </p>
              </div>

              {/* New Password */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-medium whitespace-nowrap shrink-0"
                  style={{ color: "#0F172A" }}
                >
                  New Password
                </label>
                <div className="relative w-full">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 shrink-0"
                    style={{ color: "#64748B" }}
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 w-full h-12 md:h-14 text-base placeholder:text-[#94A3B8]"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#E5DEC9",
                      color: "#0F172A",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" style={{ color: "#64748B" }} />
                    ) : (
                      <Eye className="h-5 w-5" style={{ color: "#64748B" }} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-medium whitespace-nowrap shrink-0"
                  style={{ color: "#0F172A" }}
                >
                  Confirm Password
                </label>
                <div className="relative w-full">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 shrink-0"
                    style={{ color: "#64748B" }}
                  />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-12 pr-12 w-full h-12 md:h-14 text-base placeholder:text-[#94A3B8]"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#E5DEC9",
                      color: "#0F172A",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" style={{ color: "#64748B" }} />
                    ) : (
                      <Eye className="h-5 w-5" style={{ color: "#64748B" }} />
                    )}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs mt-1" style={{ color: "#DC2626" }}>
                    Passwords do not match
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={
                  isPending ||
                  otp.length !== 6 ||
                  password.length < 8 ||
                  password !== confirmPassword
                }
                className="w-full shrink-0 h-12 md:h-14 font-medium text-base hover:opacity-95 transition-opacity"
                style={{
                  background:
                    "linear-gradient(135deg, #0E5B43 0%, #052B20 100%)",
                  color: "#FFFFFF",
                  boxShadow: "0 4px 14px rgba(14, 91, 67, 0.25)",
                }}
              >
                {isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <span className="whitespace-nowrap">Reset Password</span>
                    <CheckCircle2 className="ml-2 h-5 w-5 shrink-0" />
                  </>
                )}
              </Button>
            </motion.form>
          </AnimatePresence>
        </div>

        <p
          className="text-center text-xs md:text-sm mt-6 whitespace-nowrap"
          style={{ color: "rgba(255, 255, 255, 0.75)" }}
        >
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ backgroundColor: "#0E5B43" }}
        >
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
