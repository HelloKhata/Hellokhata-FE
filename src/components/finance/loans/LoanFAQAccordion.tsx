"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

interface LoanFAQAccordionProps {
  isBangla?: boolean;
}

export function LoanFAQAccordion({ isBangla = false }: LoanFAQAccordionProps) {
  const faqs = [
    {
      id: "faq-1",
      question: "How is my loan eligibility calculated without manual papers?",
      questionBn: "কোনো ম্যানুয়াল কাগজপত্র ছাড়া লোন যোগ্যতা কীভাবে নির্ধারিত হয়?",
      answer:
        "HelloKhata automatically analyzes your sales transactions, daily cash flow stability, customer dues, and supplier bill recovery patterns. No manual financial statements are required.",
      answerBn:
        "হ্যালো খাতা আপনার দৈনিক বেচাকেনা, গ্রাহক বাকি আদায় এবং ক্যাশ ফ্লো বিশ্লেষণ করে স্বয়ংক্রিয়ভাবে যোগ্যতা যাঁচাই করে। কোনো ব্যাংকিং সিআরবি বা আর্থিক স্টেটমেন্ট আপলোড করতে হয় না।",
    },
    {
      id: "faq-2",
      question: "Who are the partner banks providing the loan?",
      questionBn: "ঋণ প্রদানকারী ব্যাংক পার্টনার কারা?",
      answer:
        "Loans are disbursed directly by Bangladesh Bank approved SME banking partners including Dutch-Bangla Bank, City Bank SME, and Brac Bank.",
      answerBn:
        "বাংলাদেশ ব্যাংক অনুমোদিত বিশ্বস্ত এসএমই ব্যাংক পার্টনার যেমন ডাচ-বাংলা ব্যাংক, সিটি ব্যাংক ও ব্র্যাক ব্যাংক সরাসরি লোন বিতরণ করে।",
    },
    {
      id: "faq-3",
      question: "How long does it take for loan approval and disbursement?",
      questionBn: "আবেদন জমা দেওয়ার পর কত সময় লাগে?",
      answer:
        "After submitting your KYC and data consent, initial automated desk evaluation takes 24 to 48 business hours.",
      answerBn:
        "কেওয়াইসি এবং ডাটা শেয়ারিং সম্মতি জমা দেওয়ার ২৪ থেকে ৪৮ কর্মঘণ্টার মধ্যে ব্যাংক সিদ্ধান্ত চূড়ান্ত করে।",
    },
    {
      id: "faq-4",
      question: "Is my business data secure when sharing with partner banks?",
      questionBn: "আমার ব্যবসার আর্থিক ডাটা কতটা নিরাপদ?",
      answer:
        "Your data is 256-bit encrypted and shared strictly with your explicit consent for loan evaluation only.",
      answerBn:
        "আপনার ডাটা ২৫৬-বিট এনক্রিপ্টেড এবং আপনার স্পষ্ট সম্মতি ছাড়া অন্য কোনো তৃতীয় পক্ষের সাথে শেয়ার করা হয় না।",
    },
  ];

  return (
    <div id="faq-section" className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-3 shadow-2xs">
      <div className="border-b border-border/80 pb-3 flex items-center gap-2">
        <HelpCircle className="h-4 w-4 text-primary" />
        <h3 className="text-xs sm:text-sm font-bold text-foreground">
          {isBangla ? "সাধারণ জিজ্ঞাসাসমূহ (FAQ)" : "Frequently Asked Questions"}
        </h3>
      </div>

      <Accordion type="single" collapsible className="w-full text-xs">
        {faqs.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id} className="border-border/60">
            <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3 text-left">
              {isBangla ? faq.questionBn : faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-[11px] leading-relaxed pb-3">
              {isBangla ? faq.answerBn : faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
