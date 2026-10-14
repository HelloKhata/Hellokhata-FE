"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Lock,
  ArrowRight,
  Loader2,
  Store,
  Sparkles,
  CheckCircle2,
  User,
  Building2,
  ArrowLeft,
  Search,
  ChevronDown,
  EyeOff,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSessionStore } from "@/stores/sessionStore";
import {
  useRegisterUser,
  useVerifyOTP,
  useResendOTP,
} from "@/hooks/api/useUser";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("retail");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const [businessTypeSearch, setBusinessTypeSearch] = useState("");
  const [showBusinessTypeDropdown, setShowBusinessTypeDropdown] =
    useState(false);
  const registerUser = useRegisterUser();


  const handleRegister = () => {
    if (!phone || !/^01[3-9]\d{8}$/.test(phone)) {
      toast.error("Invalid phone number", {
        description: "Please enter a valid Bangladeshi phone number",
      });
      return;
    }

    if (!name || name.length < 2) {
      toast.error("Name required", {
        description: "Please enter your full name",
      });
      return;
    }

    if (!businessName || businessName.length < 2) {
      toast.error("Business name required", {
        description: "Please enter your business name",
      });
      return;
    }

    const user = { name, phone, businessName, businessType, password };

    registerUser.mutate(user, {
      onSuccess: (data) => {
        if (data.success) {
          toast.success(data.message);
          router.push(
            `/verify-otp?otp=${data.data.otp}`
          );
        }
      },
    });
  };

  const businessTypes = [
    { value: "retail", label: "Retail Store", labelBn: "রিটেইল স্টোর" },
    { value: "wholesale", label: "Wholesale", labelBn: "পাইকারি" },
    { value: "grocery", label: "Grocery", labelBn: "মুদি দোকান" },
    { value: "pharmacy", label: "Pharmacy", labelBn: "ফার্মেসি" },
    { value: "electronics", label: "Electronics", labelBn: "ইলেকট্রনিক্স" },
    { value: "clothing", label: "Clothing", labelBn: "কাপড়ের দোকান" },
    { value: "restaurant", label: "Restaurant", labelBn: "রেস্টুরেন্ট" },
    { value: "other", label: "Other", labelBn: "অন্যান্য" },
  ];

  const filteredBusinessTypes = businessTypes.filter(
    (type) =>
      type.label.toLowerCase().includes(businessTypeSearch.toLowerCase()) ||
      type.labelBn.includes(businessTypeSearch),
  );

  const selectedBusinessType = businessTypes.find(
    (t) => t.value === businessType,
  );

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 lg:p-8 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0E5B43 0%, #083D2D 50%, #052B20 100%)",
      }}
    >
      {/* Background */}
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
                handleRegister();
              }}
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-5 md:gap-6 relative z-10"
            >
              <div className="shrink-0">
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="p-1.5 rounded-lg transition-colors shrink-0 hover:bg-black/5"
                    style={{ color: "#0F172A" }}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Link>
                  <h2
                    className="text-xl md:text-2xl font-semibold whitespace-nowrap"
                    style={{ color: "#0F172A" }}
                  >
                    Create Account
                  </h2>
                </div>
                <p
                  className="text-sm md:text-base whitespace-nowrap mt-1 ml-10"
                  style={{ color: "#64748B" }}
                >
                  Set up your business account
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <div className="flex flex-col gap-2">
                  <label
                    className="text-sm font-medium whitespace-nowrap shrink-0"
                    style={{ color: "#0F172A" }}
                  >
                    Your Name *
                  </label>
                  <div className="relative w-full">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 shrink-0"
                      style={{ color: "#64748B" }}
                    />
                    <Input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-12 w-full h-12 md:h-14 text-base placeholder:text-[#94A3B8]"
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#E5DEC9",
                        color: "#0F172A",
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    className="text-sm font-medium whitespace-nowrap shrink-0"
                    style={{ color: "#0F172A" }}
                  >
                    Business Name *
                  </label>
                  <div className="relative w-full">
                    <Building2
                      className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 shrink-0"
                      style={{ color: "#64748B" }}
                    />
                    <Input
                      type="text"
                      placeholder="Enter your business name"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="pl-12 w-full h-12 md:h-14 text-base placeholder:text-[#94A3B8]"
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#E5DEC9",
                        color: "#0F172A",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-medium whitespace-nowrap shrink-0"
                  style={{ color: "#0F172A" }}
                >
                  Business Type
                </label>
                <div className="relative w-full">
                  <button
                    type="button"
                    onClick={() =>
                      setShowBusinessTypeDropdown(!showBusinessTypeDropdown)
                    }
                    className="w-full h-12 md:h-14 px-4 rounded-lg border flex items-center justify-between text-base text-left transition-colors"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: showBusinessTypeDropdown
                        ? "#0E5B43"
                        : "#E5DEC9",
                      color: "#0F172A",
                    }}
                  >
                    <span className="flex items-center gap-3">
                      {selectedBusinessType?.label || "Select business type"}
                      {selectedBusinessType && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            backgroundColor: "rgba(14, 91, 67, 0.08)",
                            color: "#0E5B43",
                          }}
                        >
                          {selectedBusinessType.labelBn}
                        </span>
                      )}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform shrink-0 ${showBusinessTypeDropdown ? "rotate-180" : ""}`}
                      style={{ color: "#64748B" }}
                    />
                  </button>

                  {showBusinessTypeDropdown && (
                    <div
                      className="absolute top-full left-0 right-0 mt-2 rounded-lg border z-50 overflow-hidden"
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#E5DEC9",
                        boxShadow: "0 12px 36px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <div
                        className="relative border-b"
                        style={{ borderColor: "#E5DEC9" }}
                      >
                        <Search
                          className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 shrink-0"
                          style={{ color: "#64748B" }}
                        />
                        <input
                          type="text"
                          placeholder="Search business type..."
                          value={businessTypeSearch}
                          onChange={(e) =>
                            setBusinessTypeSearch(e.target.value)
                          }
                          className="w-full h-11 pl-11 pr-4 text-sm bg-transparent outline-none placeholder:text-[#94A3B8]"
                          style={{ color: "#0F172A" }}
                          autoFocus
                        />
                      </div>
                      <div className="max-h-60 overflow-y-auto py-1">
                        {filteredBusinessTypes.length > 0 ? (
                          filteredBusinessTypes.map((type) => (
                            <button
                              key={type.value}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setBusinessType(type.value);
                                setShowBusinessTypeDropdown(false);
                                setBusinessTypeSearch("");
                              }}
                              className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-black/5 transition-colors cursor-pointer"
                              style={{
                                backgroundColor:
                                  businessType === type.value
                                    ? "rgba(14, 91, 67, 0.08)"
                                    : "transparent",
                              }}
                            >
                              <div>
                                <span
                                  className="text-sm font-medium"
                                  style={{
                                    color:
                                      businessType === type.value
                                        ? "#0E5B43"
                                        : "#0F172A",
                                  }}
                                >
                                  {type.label}
                                </span>{" "}
                                <span
                                  className="ml-2 text-xs"
                                  style={{ color: "#64748B" }}
                                >
                                  {type.labelBn}
                                </span>
                              </div>
                              {businessType === type.value && (
                                <CheckCircle2
                                  className="h-4 w-4 shrink-0"
                                  style={{ color: "#0E5B43" }}
                                />
                              )}
                            </button>
                          ))
                        ) : (
                          <div
                            className="px-4 py-3 text-sm text-center"
                            style={{ color: "#64748B" }}
                          >
                            No business types found
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-medium whitespace-nowrap shrink-0"
                  style={{ color: "#0F172A" }}
                >
                  Phone Number *
                </label>
                <div className="relative w-full">
                  <Phone
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 shrink-0"
                    style={{ color: "#64748B" }}
                  />
                  <Input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))
                    }
                    className="pl-12 w-full h-12 md:h-14 text-base placeholder:text-[#94A3B8]"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#E5DEC9",
                      color: "#0F172A",
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-medium whitespace-nowrap shrink-0"
                  style={{ color: "#0F172A" }}
                >
                  Password *
                </label>

                <div className="relative w-full">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 shrink-0"
                    style={{ color: "#64748B" }}
                  />

                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
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
                      <EyeOff
                        className="h-5 w-5"
                        style={{ color: "#64748B" }}
                      />
                    ) : (
                      <Eye className="h-5 w-5" style={{ color: "#64748B" }} />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-medium whitespace-nowrap shrink-0"
                  style={{ color: "#0F172A" }}
                >
                  Confirm Password *
                </label>

                <div className="relative w-full">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 shrink-0"
                    style={{ color: "#64748B" }}
                  />

                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
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
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeOff
                        className="h-5 w-5"
                        style={{ color: "#64748B" }}
                      />
                    ) : (
                      <Eye className="h-5 w-5" style={{ color: "#64748B" }} />
                    )}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p
                    className="text-xs text-red-500 mt-1"
                    style={{ color: "#DC2626" }}
                  >
                    Passwords do not match
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={
                  registerUser.isPending ||
                  phone.length !== 11 ||
                  !name ||
                  !businessName ||
                  !password ||
                  !confirmPassword ||
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
                {registerUser.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <span className="whitespace-nowrap">Create Account</span>
                    <Sparkles className="ml-2 h-5 w-5 shrink-0" />
                  </>
                )}
              </Button>

              <p
                className="text-xs md:text-sm text-center whitespace-nowrap shrink-0"
                style={{ color: "#64748B" }}
              >
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium hover:underline text-[#0E5B43]"
                >
                  Login instead
                </Link>
              </p>
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
