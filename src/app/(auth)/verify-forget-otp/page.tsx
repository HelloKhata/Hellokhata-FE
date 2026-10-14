"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Lock,
    Loader2,
    Store,
    CheckCircle2,
    ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForgotPasswordStore } from "@/stores/forgotPasswordStore";
import {
    useVerifyForgetOTP,
} from "@/hooks/api/useUser";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

function VerifyOtpContent() {
    const router = useRouter();
    // Retrieve phone and OTP from store (fallback for query parameters)
    const { phone: storedPhone, otp: storedOtp } = useForgotPasswordStore();

    const [demoOTP, setDemoOTP] = useState(storedOtp);
    const [otp, setOtp] = useState("");

    const verifyForgetOTP = useVerifyForgetOTP();

    const handleVerifyOtp = () => {
        if (!otp || otp.length !== 6) {
            toast.error("Invalid OTP", {
                description: "Please enter the 6-digit OTP",
            });
            return;
        }

        verifyForgetOTP.mutate(
            otp,
            {
                onSuccess: (data) => {
                    if (data.success) {
                        toast.success(data.message || "OTP verified successfully");
                        // Redirect to reset password page with phone and code parameters
                        router.push(`/reset-password`);
                    }
                },
                onError: (error: any) => {
                    toast.error('Verification failed');
                }
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
                                handleVerifyOtp();
                            }}
                            key="otp"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col gap-5 md:gap-6 relative z-10"
                        >
                            <div className="shrink-0">
                                <h2
                                    className="text-xl md:text-2xl font-semibold whitespace-nowrap"
                                    style={{ color: "#0F172A" }}
                                >
                                    Verify OTP
                                </h2>
                                <p
                                    className="text-sm md:text-base mt-1"
                                    style={{ color: "#64748B" }}
                                >
                                    Enter the code sent to{" "}
                                    <span className="font-semibold text-[#0F172A]">{storedPhone || "your phone number"}</span>
                                </p>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label
                                    className="text-sm font-medium whitespace-nowrap shrink-0"
                                    style={{ color: "#0F172A" }}
                                >
                                    Verification Code
                                </label>
                                <div className="relative w-full">
                                    <Lock
                                        className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 shrink-0"
                                        style={{ color: "#64748B" }}
                                    />
                                    <Input
                                        type="text"
                                        placeholder="Enter 6-digit code"
                                        value={otp}
                                        onChange={(e) =>
                                            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                                        }
                                        className="pl-12 text-center tracking-widest w-full h-12 md:h-14 font-mono text-lg md:text-xl placeholder:text-[#94A3B8]"
                                        maxLength={6}
                                        style={{
                                            backgroundColor: "#FFFFFF",
                                            borderColor: "#E5DEC9",
                                            color: "#0F172A",
                                        }}
                                    />
                                </div>
                            </div>

                            {demoOTP && (
                                <p
                                    className="text-xs md:text-sm text-center whitespace-nowrap shrink-0 animate-pulse"
                                    style={{ color: "#64748B" }}
                                >
                                    Demo OTP:{" "}
                                    <span
                                        className="font-mono font-bold"
                                        style={{ color: "#0E5B43" }}
                                    >
                                        {demoOTP}
                                    </span>
                                </p>
                            )}

                            <Button
                                type="submit"
                                disabled={verifyForgetOTP.isPending || otp.length !== 6}
                                className="w-full shrink-0 h-12 md:h-14 font-medium text-base hover:opacity-95 transition-opacity"
                                style={{
                                    background:
                                        "linear-gradient(135deg, #0E5B43 0%, #052B20 100%)",
                                    color: "#FFFFFF",
                                    boxShadow: "0 4px 14px rgba(14, 91, 67, 0.25)",
                                }}
                            >
                                {verifyForgetOTP.isPending ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        <span className="whitespace-nowrap">
                                            Verify & Continue
                                        </span>
                                        <CheckCircle2 className="ml-2 h-5 w-5 shrink-0" />
                                    </>
                                )}
                            </Button>

                            <div className="flex items-center justify-between shrink-0">
                                <Link href="/register">
                                    <button
                                        type="button"
                                        className="text-sm md:text-base flex items-center gap-1 whitespace-nowrap transition-colors hover:text-[#0F172A] cursor-pointer"
                                        style={{ color: "#64748B" }}
                                    >
                                        <ArrowLeft className="h-4 w-4 shrink-0" /> Back
                                    </button>
                                </Link>
                            </div>
                        </motion.form>
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}

export default function VerifyOtpPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0E5B43" }}>
                <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
        }>
            <VerifyOtpContent />
        </Suspense>
    );
}
