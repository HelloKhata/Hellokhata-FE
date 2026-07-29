"use client";

import React from "react";
import { Package, Wrench, Briefcase, TrendingUp } from "lucide-react";

interface LoanBenefitsProps {
  isBangla?: boolean;
}

export function LoanBenefits({ isBangla = false }: LoanBenefitsProps) {
  const benefits = [
    {
      icon: Package,
      title: "Expand Inventory",
      titleBn: "স্টক ও মালামাল বৃদ্ধি",
      desc: "Stock up fast on high-demand items to boost seasonal sales.",
      descBn: "বেশি বিক্রি হওয়া পন্য স্টক করে ব্যবসা দ্রুত বড় করুন।",
      color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    },
    {
      icon: Wrench,
      title: "Purchase Equipment",
      titleBn: "যন্ত্রপাতি বা ইক্যুইপমেন্ট ক্রয়",
      desc: "Invest in modern machinery, POS hardware, or store renovation.",
      descBn: "দোকান সাজাতে বা নতুন ইক্যুইপমেন্ট কিনতে বিনিয়োগ করুন।",
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },
    {
      icon: Briefcase,
      title: "Increase Working Capital",
      titleBn: "চলতি মূলধন বৃদ্ধি",
      desc: "Ensure seamless daily cash flow for supplier & staff payments.",
      descBn: "দৈনন্দিন খরচ ও সরবরাহকারী পেমেন্টের জন্য নগদ প্রবাহ ঠিক রাখুন।",
      color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    },
    {
      icon: TrendingUp,
      title: "Grow Your Business",
      titleBn: "নতুন শাখা বা আউটলেট খোলা",
      desc: "Open new branch locations or expand into new digital markets.",
      descBn: "নতুন আউটলেট বা শাখা খুলে ব্যবসার পরিধি দ্বিগুণ করুন।",
      color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    },
  ];

  return (
    <div id="benefits-section" className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-4 shadow-2xs">
      <div className="border-b border-border/80 pb-3">
        <h3 className="text-xs sm:text-sm font-bold text-foreground">
          {isBangla ? "বিজনেস লোনের সুবিধাসমূহ" : "How a Business Loan Helps You"}
        </h3>
        <p className="text-[11px] text-muted-foreground">
          {isBangla
            ? "আপনার ব্যবসাকে পরবর্তী ধাপে নিয়ে যাওয়ার জন্য সহজ শর্তে লোন সুবিধা"
            : "Simple, hassle-free financing designed for small business growth"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {benefits.map((b, idx) => {
          const Icon = b.icon;
          return (
            <div
              key={idx}
              className="p-3.5 bg-muted/15 border border-border/60 rounded-xl space-y-2 hover:border-border transition-all"
            >
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center border ${b.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">
                  {isBangla ? b.titleBn : b.title}
                </h4>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                  {isBangla ? b.descBn : b.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
