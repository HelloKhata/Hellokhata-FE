// Hello Khata OS - Invoice Settings Page
// হ্যালো খাতা - ইনভয়েস সেটিংস পেজ

"use client";

import { useState, useRef, useEffect } from "react";
import {
  Button,
} from "@/components/ui/premium";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import {
  FileText,
  Upload,
  Building2,
  MapPin,
  Phone,
  Hash,
  MessageSquare,
  Printer,
  Save,
  Loader2,
  Image as ImageIcon,
  X,
  Eye,
  Receipt,
  User,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { InvoicePreviewWrapper } from "@/components/invoice/InvoiceActions";
import { InvoiceData } from "@/types/invoice";

// Settings input component using shadcn/ui Input with full width
const SettingsInput = ({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  icon?: React.ElementType;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) => (
  <div className="w-full space-y-2">
    <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
    <div className="relative w-full">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          <Icon className="h-4 w-4" />
        </div>
      )}
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn("h-11 w-full", Icon && "pl-10")}
      />
    </div>
  </div>
);

// Section header component
const SectionHeader = ({
  icon: Icon,
  title,
  description,
  iconColor = "primary",
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
  iconColor?: "primary" | "indigo" | "warning" | "emerald";
}) => {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    indigo: "bg-indigo/10 text-indigo",
    warning: "bg-warning/10 text-warning",
    emerald: "bg-emerald/10 text-emerald",
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-foreground flex items-center gap-3">
        <div
          className={cn(
            "h-8 w-8 rounded-lg flex items-center justify-center",
            colorClasses[iconColor],
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        {title}
      </h2>
      {description && (
        <p className="text-sm text-muted-foreground mt-1.5 ml-11">
          {description}
        </p>
      )}
    </div>
  );
};

// Settings card component with full width
const SettingsCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "w-full rounded-2xl p-6",
      "bg-card border border-border",
      className,
    )}
  >
    {children}
  </div>
);

export default function InvoiceSettingsPage() {
  const { isBangla } = useAppTranslation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState("স্মার্টস্টোর");
  const [businessAddress, setBusinessAddress] = useState("ঢাকা, বাংলাদেশ");
  const [businessPhone, setBusinessPhone] = useState("01XXXXXXXXX");
  const [invoicePrefix, setInvoicePrefix] = useState("INV-");
  const [footerNote, setFooterNote] = useState("ধন্যবাদ আপনার কেনাকাটার জন্য!");
  const [customerName, setCustomerName] = useState("আব্দুর রহিম");
  const [customerPhone, setCustomerPhone] = useState("01711223344");
  const [customerAddress, setCustomerAddress] = useState("ধানমন্ডি, ঢাকা");
  const [returnPolicy, setReturnPolicy] = useState(
    "পণ্য বিক্রয়ের ৭ দিনের মধ্যে ক্যাশ মেমোসহ পরিবর্তনযোগ্য। ব্যবহৃত বা ক্ষতিগ্রস্ত পণ্য ফেরতযোগ্য নয়。"
  );
  const [paperSize, setPaperSize] = useState<"A4" | "A5">("A4");
  const [printerType, setPrinterType] = useState<"normal" | "thermal">("normal");
  const [isSaving, setIsSaving] = useState(false);

  // Load saved settings from localStorage if available
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("hk_invoice_settings");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.logoUrl !== undefined) setLogoPreview(parsed.logoUrl);
          if (parsed.businessName) setBusinessName(parsed.businessName);
          if (parsed.businessAddress) setBusinessAddress(parsed.businessAddress);
          if (parsed.businessPhone) setBusinessPhone(parsed.businessPhone);
          if (parsed.invoicePrefix) setInvoicePrefix(parsed.invoicePrefix);
          if (parsed.footerNote) setFooterNote(parsed.footerNote);
          if (parsed.returnPolicy) setReturnPolicy(parsed.returnPolicy);
          if (parsed.paperSize) setPaperSize(parsed.paperSize);
          if (parsed.printerType) setPrinterType(parsed.printerType);
        }
      }
    } catch (e) {
      console.error("Error reading saved invoice settings:", e);
    }
  }, []);

  // Mock data for live invoice preview
  const sampleItems = [
    {
      id: 1,
      name: isBangla ? "স্মার্টফোন এক্স" : "Smartphone X",
      qty: 1,
      price: 25000,
    },
    {
      id: 2,
      name: isBangla ? "ওয়্যারলেস ইয়ারবাড" : "Wireless Earbuds",
      qty: 2,
      price: 2500,
    },
  ];
  const subtotal = sampleItems.reduce(
    (acc, item) => acc + item.qty * item.price,
    0,
  );

  // Constructed Invoice Data Object
  const previewInvoiceData: InvoiceData = {
    invoiceNumber: `${invoicePrefix || "INV-"}20260715-0001`,
    date: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    status: "DUE",
    business: {
      name: businessName,
      address: businessAddress,
      phone: businessPhone,
      logoUrl: logoPreview,
    },
    customer: {
      name: customerName,
      phone: customerPhone,
      address: customerAddress,
    },
    items: sampleItems,
    subtotal: subtotal,
    discount: 0,
    tax: 0,
    paidAmount: 0,
    dueAmount: subtotal,
    changeAmount: 0,
    returnPolicy: returnPolicy,
    footerNote: footerNote,
    paperSize: paperSize,
    printerType: printerType,
    inWords: isBangla ? "ছাব্বিশ হাজার টাকা মাত্র" : "Twenty Six Thousand Taka Only",
  };

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: isBangla ? "ফাইল বড় হয়েছে" : "File too large",
          description: isBangla
            ? "লোগো ২MB এর চেয়ে ছোট হতে হবে"
            : "Logo must be smaller than 2MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        toast({
          title: isBangla ? "লোগো আপলোড হয়েছে" : "Logo uploaded",
          description: isBangla
            ? "নতুন লোগো সফলভাবে আপলোড হয়েছে"
            : "New logo uploaded successfully",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove logo
  const handleRemoveLogo = () => {
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast({
      title: isBangla ? "লোগো সরানো হয়েছে" : "Logo removed",
      description: isBangla
        ? "লোগো সফলভাবে সরানো হয়েছে"
        : "Logo has been removed",
    });
  };

  // Save settings
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      if (typeof window !== "undefined") {
        const settings = {
          logoUrl: logoPreview,
          businessName,
          businessAddress,
          businessPhone,
          invoicePrefix,
          footerNote,
          returnPolicy,
          paperSize,
          printerType,
        };
        localStorage.setItem("hk_invoice_settings", JSON.stringify(settings));
      }
      toast({
        title: isBangla ? "সফল হয়েছে" : "Success",
        description: isBangla
          ? "ইনভয়েস সেটিংস সংরক্ষিত হয়েছে"
          : "Invoice settings saved successfully",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full mx-auto px-4 sm:px-6 py-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          {isBangla ? "ইনভয়েস কাস্টমাইজেশন" : "Invoice Customization"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isBangla
            ? "আপনার ইনভয়েস টেমপ্লেট কাস্টমাইজ করুন এবং লাইভ প্রিভিউ দেখুন"
            : "Customize your invoice template and view real-time preview"}
        </p>
      </div>

      {/* Main Grid Layout (60% / 40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Left Side: Settings Forms (60% = 3/5 cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Logo Upload Section */}
          <SettingsCard>
            <SectionHeader
              icon={ImageIcon}
              title={isBangla ? "ব্যবসার লোগো" : "Business Logo"}
              description={
                isBangla
                  ? "ইনভয়েসে দেখানোর জন্য লোগো আপলোড করুন"
                  : "Upload logo for invoices"
              }
              iconColor="primary"
            />

            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Logo Preview */}
              <div
                className={cn(
                  "w-32 h-32 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden flex-shrink-0",
                  logoPreview
                    ? "border-primary/30 bg-primary/5"
                    : "border-border bg-muted/30",
                )}
              >
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <div className="text-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                    <span className="text-[10px] text-muted-foreground/50">
                      {isBangla ? "লোগো নেই" : "No logo"}
                    </span>
                  </div>
                )}
              </div>

              {/* Upload Actions */}
              <div className="flex-1 w-full space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  className="w-full h-11 rounded-xl"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isBangla ? "লোগো আপলোড করুন" : "Upload Logo"}
                </Button>
                {logoPreview && (
                  <Button
                    variant="ghost"
                    className="w-full h-9 rounded-xl text-destructive hover:bg-destructive/10"
                    onClick={handleRemoveLogo}
                  >
                    <X className="h-4 w-4 mr-2" />
                    {isBangla ? "লোগো সরান" : "Remove Logo"}
                  </Button>
                )}
                <p className="text-xs text-muted-foreground">
                  {isBangla
                    ? "PNG, JPG বা SVG • সর্বোচ্চ 2MB"
                    : "PNG, JPG or SVG • Max 2MB"}
                </p>
              </div>
            </div>
          </SettingsCard>

          {/* Business Information Section */}
          <SettingsCard>
            <SectionHeader
              icon={Building2}
              title={isBangla ? "ব্যবসার তথ্য" : "Business Information"}
              description={
                isBangla
                  ? "ইনভয়েসে দেখানোর তথ্য"
                  : "Information shown on invoices"
              }
              iconColor="indigo"
            />

            <div className="w-full space-y-4">
              <SettingsInput
                label={isBangla ? "ব্যবসার নাম" : "Business Name"}
                icon={Building2}
                value={businessName}
                onChange={setBusinessName}
                placeholder={
                  isBangla ? "ব্যবসার নাম লিখুন" : "Enter business name"
                }
              />
              <SettingsInput
                label={isBangla ? "ঠিকানা" : "Address"}
                icon={MapPin}
                value={businessAddress}
                onChange={setBusinessAddress}
                placeholder={isBangla ? "ঠিকানা লিখুন" : "Enter address"}
              />
              <SettingsInput
                label={isBangla ? "ফোন" : "Phone"}
                icon={Phone}
                value={businessPhone}
                onChange={setBusinessPhone}
                placeholder="01XXXXXXXXX"
              />
            </div>
          </SettingsCard>

          {/* Customer Information Section */}
          <SettingsCard>
            <SectionHeader
              icon={User}
              title={isBangla ? "গ্রাহকের তথ্য" : "Customer Information"}
              description={
                isBangla
                  ? "ইনভয়েসে দেখানোর জন্য গ্রাহকের তথ্য"
                  : "Customer details shown on invoice"
              }
              iconColor="emerald"
            />

            <div className="w-full space-y-4">
              <SettingsInput
                label={isBangla ? "গ্রাহকের নাম" : "Customer Name"}
                icon={User}
                value={customerName}
                onChange={setCustomerName}
                placeholder={isBangla ? "গ্রাহকের নাম লিখুন" : "Enter customer name"}
              />
              <SettingsInput
                label={isBangla ? "ফোন নম্বর" : "Phone Number"}
                icon={Phone}
                value={customerPhone}
                onChange={setCustomerPhone}
                placeholder="01XXXXXXXXX"
              />
              <SettingsInput
                label={isBangla ? "ঠিকানা" : "Address"}
                icon={MapPin}
                value={customerAddress}
                onChange={setCustomerAddress}
                placeholder={isBangla ? "ঠিকানা লিখুন" : "Enter address"}
              />
            </div>
          </SettingsCard>

          {/* Invoice Settings Section */}
          <SettingsCard>
            <SectionHeader
              icon={Hash}
              title={isBangla ? "ইনভয়েস নম্বর ও সাইজ" : "Invoice Formatting"}
              description={
                isBangla
                  ? "প্রিফিক্স এবং পেপার সাইজ নির্বাচন করুন"
                  : "Set prefix and paper format"
              }
              iconColor="primary"
            />

            <div className="w-full space-y-4">
              <SettingsInput
                label={isBangla ? "ইনভয়েস প্রিফিক্স" : "Invoice Prefix"}
                icon={Hash}
                value={invoicePrefix}
                onChange={setInvoicePrefix}
                placeholder="INV-"
              />

              {/* Paper Size Selector */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  {isBangla ? "কাগজের সাইজ" : "Paper Size"}
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaperSize("A4")}
                    className={cn(
                      "h-11 rounded-xl border font-medium text-sm transition-all flex items-center justify-center gap-2",
                      paperSize === "A4"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-muted/50",
                    )}
                  >
                    <Printer className="h-4 w-4" /> A4 Size
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaperSize("A5")}
                    className={cn(
                      "h-11 rounded-xl border font-medium text-sm transition-all flex items-center justify-center gap-2",
                      paperSize === "A5"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-muted/50",
                    )}
                  >
                    <Printer className="h-4 w-4" /> A5 Size
                  </button>
                </div>
              </div>
            </div>
          </SettingsCard>

          {/* Footer Note Section */}
          <SettingsCard>
            <SectionHeader
              icon={MessageSquare}
              title={isBangla ? "ফুটার নোট" : "Footer Note"}
              description={
                isBangla
                  ? "ইনভয়েসের নিচে দেখানোর জন্য"
                  : "Shown at the bottom of invoices"
              }
              iconColor="warning"
            />

            <div className="w-full space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                {isBangla ? "ফুটার বার্তা" : "Footer Message"}
              </Label>
              <Textarea
                value={footerNote}
                onChange={(e) => setFooterNote(e.target.value)}
                placeholder={isBangla ? "ফুটার নোট লিখুন" : "Enter footer note"}
                rows={3}
                className="w-full resize-none"
              />
            </div>
          </SettingsCard>

          {/* Return & Exchange Policy Section */}
          <SettingsCard>
            <SectionHeader
              icon={RotateCcw}
              title={isBangla ? "রিটার্ন ও এক্সচেঞ্জ পলিসি" : "Return & Exchange Policy"}
              description={
                isBangla
                  ? "ইনভয়েসের নিচে দেখানোর পলিসি নির্দেশিকা"
                  : "Return & exchange guidelines shown on invoice"
              }
              iconColor="indigo"
            />

            <div className="w-full space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                {isBangla ? "পলিসি বিবরণ" : "Policy Terms"}
              </Label>
              <Textarea
                value={returnPolicy}
                onChange={(e) => setReturnPolicy(e.target.value)}
                placeholder={
                  isBangla
                    ? "রিটার্ন ও এক্সচেঞ্জ পলিসি লিখুন"
                    : "Enter return & exchange policy"
                }
                rows={3}
                className="w-full resize-none text-xs"
              />
            </div>
          </SettingsCard>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="h-11 px-8 rounded-xl font-medium text-sm w-full sm:w-auto"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isBangla ? "সংরক্ষণ করুন" : "Save Settings"}
            </Button>
          </div>
        </div>

        {/* Right Side: Live Invoice Preview (40% = 2/5 cols) */}
        <div className="lg:col-span-2 lg:sticky lg:top-6 space-y-3">
          <div className="flex items-center px-1">
            <span className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              {isBangla ? "লাইভ প্রিভিউ" : "Live Preview"}
            </span>
          </div>

          {/* Format Selector Buttons */}
          <div className="grid grid-cols-2 gap-2 w-full">
            <button
              type="button"
              onClick={() => setPrinterType("normal")}
              className={cn(
                "h-10 rounded-xl border text-xs font-medium transition-all flex items-center justify-center gap-2 px-3 w-full shadow-2xs cursor-pointer",
                printerType === "normal"
                  ? "border-primary bg-primary/10 text-primary font-semibold shadow-xs"
                  : "border-border text-muted-foreground bg-card hover:bg-muted/50",
              )}
            >
              <Printer className="h-3.5 w-3.5" />
              <span>{isBangla ? "নরমাল ইনভয়েস" : "Normal Invoice"}</span>
            </button>
            <button
              type="button"
              onClick={() => setPrinterType("thermal")}
              className={cn(
                "h-10 rounded-xl border text-xs font-medium transition-all flex items-center justify-center gap-2 px-3 w-full shadow-2xs cursor-pointer",
                printerType === "thermal"
                  ? "border-primary bg-primary/10 text-primary font-semibold shadow-xs"
                  : "border-border text-muted-foreground bg-card hover:bg-muted/50",
              )}
            >
              <Receipt className="h-3.5 w-3.5" />
              <span>{isBangla ? "থার্মাল রসিদ" : "Thermal Receipt"}</span>
            </button>
          </div>

          {/* Paper Mockup Container with Reusable Invoice Preview & Download PDF Button */}
          <div className="w-full bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-border shadow-inner p-4 min-h-[580px] max-h-[calc(100vh-100px)] overflow-y-auto">
            <InvoicePreviewWrapper data={previewInvoiceData} isBangla={isBangla} />
          </div>
        </div>
      </div>
    </div>
  );
}
