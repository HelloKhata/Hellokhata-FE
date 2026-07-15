"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Lock,
  ArrowRight,
  Loader2,
  Store,
  EyeOff,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSessionStore } from "@/stores/sessionStore";
import { useLoginUser } from "@/hooks/api/useUser";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { setSessionFromAuthResponse } = useSessionStore();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const loginUser = useLoginUser();

  const handleLogin = () => {
    if (!phone || !/^01[3-9]\d{8}$/.test(phone)) {
      toast.error("Invalid phone number", {
        description: "Please enter a valid Bangladeshi phone number",
      });
      return;
    }


    const user = { phone, password };
    loginUser.mutate(user, {
      onSuccess: (data) => {
        if (data.success) {
          setSessionFromAuthResponse(data);
          toast.success(data.message);
          router.push("/");
        }
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Elements */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ backgroundColor: "#0F141B" }}
      >
        <div
          className="absolute top-0 left-0 w-[600px] h-[500px] opacity-30"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 5% 0%, rgba(79, 91, 255, 0.15) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-[500px] h-[400px] opacity-30"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 90% 90%, rgba(20, 35, 55, 0.4) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] opacity-20"
          style={{
            background:
              "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(15, 191, 159, 0.08) 0%, transparent 70%)",
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
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl mb-4 shrink-0 relative"
            style={{
              background:
                "linear-gradient(135deg, #4F5BFF 0%, #6366F1 50%, #0FBF9F 100%)",
              boxShadow:
                "0 0 30px rgba(79, 91, 255, 0.3), 0 0 60px rgba(15, 191, 159, 0.15)",
            }}
          >
            <Store className="h-8 w-8 md:h-10 md:w-10 text-white" />
          </motion.div>
          <h1
            className="text-2xl md:text-3xl font-bold text-foreground whitespace-nowrap"
            style={{ color: "#E6EDF5" }}
          >
            Hello Khata
          </h1>
          <p
            className="text-muted-foreground mt-1 text-sm md:text-base whitespace-nowrap"
            style={{ color: "#9DA7B3" }}
          >
            আপনার ব্যবসার ডিজিটাল খাতা
          </p>
        </div>

        {/* Login Card */}
        <div
          className="px-6 py-6 md:px-10 md:py-8 lg:px-12 lg:py-10 rounded-xl w-full flex flex-col relative"
          style={{
            background:
              "linear-gradient(180deg, rgba(35, 46, 60, 1) 0%, rgba(28, 36, 48, 1) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            boxShadow:
              "inset 0 1px 0 rgba(255, 255, 255, 0.03), 0 4px 24px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, transparent 50%)",
            }}
          />

          <AnimatePresence mode="wait">
            <motion.form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              key="phone"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col gap-5 md:gap-6 relative z-10"
            >
              <div className="shrink-0">
                <h2
                  className="text-xl md:text-2xl font-semibold whitespace-nowrap"
                  style={{ color: "#E6EDF5" }}
                >
                  Welcome Back!
                </h2>
                <p
                  className="text-sm md:text-base whitespace-nowrap mt-1"
                  style={{ color: "#9DA7B3" }}
                >
                  Enter your phone number to login
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-medium whitespace-nowrap shrink-0"
                  style={{ color: "#E6EDF5" }}
                >
                  Phone Number
                </label>
                <div className="relative w-full">
                  <Phone
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 shrink-0"
                    style={{ color: "#6B7684" }}
                  />
                  <Input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))
                    }
                    className="pl-12 w-full h-12 md:h-14 text-base"
                    style={{
                      backgroundColor: "#171F29",
                      borderColor: "rgba(255, 255, 255, 0.05)",
                      color: "#E6EDF5",
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-medium whitespace-nowrap shrink-0"
                  style={{ color: "#E6EDF5" }}
                >
                  Password
                </label>

                <div className="relative w-full">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 shrink-0"
                    style={{ color: "#6B7684" }}
                  />

                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 w-full h-12 md:h-14 text-base"
                    style={{
                      backgroundColor: "#171F29",
                      borderColor: "rgba(255, 255, 255, 0.05)",
                      color: "#E6EDF5",
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff
                        className="h-5 w-5"
                        style={{ color: "#6B7684" }}
                      />
                    ) : (
                      <Eye className="h-5 w-5" style={{ color: "#6B7684" }} />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex justify-end -mt-2 shrink-0">
                <Link
                  href="/forgot-password"
                  className="text-xs md:text-sm hover:underline transition-colors"
                  style={{ color: "#4F5BFF" }}
                >
                  Forgot Password?
                </Link>
              </div>
              <Button
                type="submit"
                disabled={loginUser.isPending || phone.length !== 11 || password.length < 8}
                className="w-full shrink-0 h-12 md:h-14 font-medium text-base"
                style={{
                  background:
                    "linear-gradient(135deg, #4F5BFF 0%, #5E6AFF 100%)",
                  color: "#FFFFFF",
                  boxShadow: "0 0 20px rgba(79, 91, 255, 0.25)",
                }}
              >
                {loginUser.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <span className="whitespace-nowrap">Login</span>
                    <ArrowRight className="ml-2 h-5 w-5 shrink-0" />
                  </>
                )}
              </Button>

              <div className="relative my-2 shrink-0">
                <div className="absolute inset-0 flex items-center">
                  <div
                    className="w-full border-t"
                    style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}
                  ></div>
                </div>
                <div className="relative flex justify-center text-xs md:text-sm">
                  <span
                    className="px-3 whitespace-nowrap"
                    style={{
                      color: "#6B7684",
                      background:
                        "linear-gradient(180deg, rgba(35, 46, 60, 1) 0%, rgba(28, 36, 48, 1) 100%)",
                    }}
                  >
                    or
                  </span>
                </div>
              </div>

              <Link href="/register" className="w-full">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full shrink-0 h-12 md:h-14 font-medium text-base"
                  style={{
                    backgroundColor: "transparent",
                    borderColor: "rgba(255, 255, 255, 0.1)",
                    color: "#E6EDF5",
                  }}
                >
                  Create New Account
                </Button>
              </Link>
            </motion.form>
          </AnimatePresence>
        </div>

        <p
          className="text-center text-xs md:text-sm mt-6 whitespace-nowrap"
          style={{ color: "#6B7684" }}
        >
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}
