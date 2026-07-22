"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Boxes,
  CheckCircle2,
  CircleDollarSign,
  Receipt,
  ShieldCheck,
  Tag,
  UploadCloud,
} from "lucide-react";

export default function AddProductPage() {
  // State for Margin/Profit dynamic calculations (preserves business logic)
  const [showAdvancePricing, setShowAdvancePricing] = useState(false);
  const [purchaseCost, setPurchaseCost] = useState<number | "">(0);
  const [sellingPrice, setSellingPrice] = useState<number | "">(0);

  // Dynamic calculation logic
  const cost = typeof purchaseCost === "number" ? purchaseCost : 0;
  const price = typeof sellingPrice === "number" ? sellingPrice : 0;

  const grossProfit = price - cost;
  const markupPercent =
    cost > 0 ? ((grossProfit / cost) * 100).toFixed(1) : "0.0";
  const marginPercent =
    price > 0 ? ((grossProfit / price) * 100).toFixed(1) : "0.0";

  return (
    <div className="min-h-screen text-slate-200 font-sans antialiased">
      {/* ================= MAIN CONTENT CONTAINER ================= */}
      <main className="mx-auto space-y-4 sm:space-y-5 pb-24">
        {/* Header Action Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <button className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:opacity-80 mb-1 transition-opacity">
              <ArrowLeft className="w-3.5 h-3.5" /> BACK TO INVENTORY
            </button>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Add New Product
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Initialize a new stock item, pricing, stock levels, and accounting
              settings.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            {/* <button className="px-3.5 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-colors">
              Discard Draft
            </button> */}
            <button className="px-4 py-2 text-xs font-semibold text-primary-foreground bg-primary hover:opacity-90 rounded-lg transition-opacity shadow-sm shadow-primary/20">
              Save Product
            </button>
          </div>
        </div>

        {/* Form Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          {/* LEFT / MAIN COLUMN (2 cols wide) */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5">
            {/* CARD 1: Basic Product Information */}
            <section className="bg-[#121520] border border-slate-800/80 rounded-xl px-5 py-4.5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 pb-2.5 border-b border-slate-800/60">
                <Boxes className="w-4 h-4 text-primary" />
                <h3 className="text-base font-semibold text-white">
                  Basic Product Information
                </h3>
              </div>

              <div className="space-y-3.5">
                {/* Prominent Product Name Field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Product Name <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Premium Jasmine Rice 5kg"
                    className="w-full bg-slate-900/90 border border-slate-800 rounded-lg px-3.5 h-11 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-medium text-slate-400">
                        SKU Code
                      </label>
                      <button className="text-[11px] text-primary hover:underline font-medium">
                        Generate SKU
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. JSM-RC-5KG"
                      className="w-full bg-slate-900/90 border border-slate-800 rounded-lg px-3 h-10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-medium text-slate-400">
                        Barcode / EAN
                      </label>
                      <button className="text-[11px] text-primary hover:underline font-medium">
                        Generate Barcode
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. 8901030700812"
                      className="w-full bg-slate-900/90 border border-slate-800 rounded-lg px-3 h-10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-medium text-slate-400">
                        Category
                      </label>
                      <button className="text-[11px] text-primary hover:underline font-medium">
                        + Add
                      </button>
                    </div>
                    <select className="w-full bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 h-10 text-xs text-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all">
                      <option>Select Category</option>
                      <option>Grains & Staples</option>
                      <option>Packaged Food</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-medium text-slate-400">
                        Brand
                      </label>
                      <button className="text-[11px] text-primary hover:underline font-medium">
                        + Add
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Royal Harvest"
                      className="w-full bg-slate-900/90 border border-slate-800 rounded-lg px-3 h-10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Unit Measure <span className="text-primary">*</span>
                    </label>
                    <select className="w-full bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 h-10 text-xs text-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all">
                      <option>Pcs (Pieces)</option>
                      <option>Kg (Kilograms)</option>
                      <option>Box</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Select Branch
                    </label>
                    <select className="w-full bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 h-10 text-xs text-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all">
                      <option>Select Branch</option>
                      <option>Main Branch (Dhaka)</option>
                      <option>Chittagong Depot</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Product Type
                    </label>
                    <select className="w-full bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 h-10 text-xs text-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all">
                      <option>Physical Product</option>
                      <option>Digital Product</option>
                      <option>Service</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Initial Status
                    </label>
                    <select className="w-full bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 h-10 text-xs text-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all">
                      <option>Active</option>
                      <option>Draft</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Tightened Toggle Controls */}
                <div className="pt-2.5 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-800/50">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-8 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary relative"></div>
                    <div>
                      <span className="text-xs text-slate-300 font-medium block">
                        Low Stock Alert
                      </span>
                      <span className="text-[10px] text-slate-500 block leading-tight">
                        Notify when stock is below minimumf
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-8 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary relative"></div>
                    <div>
                      <span className="text-xs text-slate-300 font-medium block">
                        Batch Tracking
                      </span>
                      <span className="text-[10px] text-slate-500 block leading-tight">
                        Assign lot numbers on receipt
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-8 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary relative"></div>
                    <div>
                      <span className="text-xs text-slate-300 font-medium block">
                        Expiry Tracking
                      </span>
                      <span className="text-[10px] text-slate-500 block leading-tight">
                        Monitor expiration dates
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </section>

            {/* CARD 2: Pricing & Profit Margins */}
            <section className="bg-[#121520] border border-slate-800/80 rounded-xl px-5 py-4.5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/60">
                <div className="flex items-center gap-2">
                  <CircleDollarSign className="w-4 h-4 text-primary" />
                  <h3 className="text-base font-semibold text-white">
                    Pricing & Profit Margins
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                {/* Left Column: Core Inputs & Expandable Advance Inputs */}
                <div className="md:col-span-2 space-y-3.5">
                  {/* Base Pricing Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">
                        Purchase Cost <span className="text-primary">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono">
                          $
                        </span>
                        <input
                          type="number"
                          value={purchaseCost}
                          onChange={(e) =>
                            setPurchaseCost(
                              e.target.value === ""
                                ? ""
                                : Number(e.target.value),
                            )
                          }
                          placeholder="0.00"
                          className="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-7 pr-3 h-10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">
                        Retail Selling Price (MRP){" "}
                        <span className="text-primary">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono">
                          $
                        </span>
                        <input
                          type="number"
                          value={sellingPrice}
                          onChange={(e) =>
                            setSellingPrice(
                              e.target.value === ""
                                ? ""
                                : Number(e.target.value),
                            )
                          }
                          placeholder="0.00"
                          className="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-7 pr-3 h-10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAdvancePricing((prev) => !prev)}
                    className="text-xs text-primary hover:underline font-medium flex items-center gap-1 transition-all"
                  >
                    {showAdvancePricing
                      ? "– Hide Advance Pricing"
                      : "+ Advance Pricing"}
                  </button>
                  {/* Conditionally Expanded Advance Pricing Inputs */}
                  {showAdvancePricing && (
                    <div className="pt-2 border-t border-slate-800/60 grid grid-cols-1 sm:grid-cols-3 gap-3.5 animate-in fade-in duration-200">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Wholesale Price
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono">
                            $
                          </span>
                          <input
                            type="number"
                            placeholder="0.00"
                            className="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-7 pr-3 h-10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          VIP Price
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono">
                            $
                          </span>
                          <input
                            type="number"
                            placeholder="0.00"
                            className="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-7 pr-3 h-10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Dealer Price
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono">
                            $
                          </span>
                          <input
                            type="number"
                            placeholder="0.00"
                            className="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-7 pr-3 h-10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Dynamic Calculation Sidebar Box */}
                <div className="bg-slate-900/80 border border-slate-800/80 rounded-lg p-3 flex flex-col justify-between space-y-1.5 self-stretch">
                  <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-800">
                    <span className="text-slate-400 font-medium">
                      Profit & Margin
                    </span>
                    <span className="text-primary font-mono text-[11px]">
                      %
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Gross Profit / Unit:
                      </span>
                      <span className="font-mono text-slate-200">
                        ${grossProfit.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Markup %:</span>
                      <span className="font-mono text-primary">
                        {markupPercent}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Profit Margin %:</span>
                      <span className="font-mono text-primary">
                        {marginPercent}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CARD 3: Inventory Stock Levels */}
            <section className="bg-[#121520] border border-slate-800/80 rounded-xl px-5 py-4.5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 pb-2.5 border-b border-slate-800/60">
                <Boxes className="w-4 h-4 text-primary" />
                <h3 className="text-base font-semibold text-white">
                  Inventory Stock Levels
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Opening Stock
                    </label>
                    <input
                      type="number"
                      defaultValue={0}
                      className="w-full bg-slate-900/90 border border-slate-800 rounded-lg px-3 h-10 text-xs text-slate-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Min Stock Alert
                    </label>
                    <input
                      type="number"
                      defaultValue={10}
                      className="w-full bg-slate-900/90 border border-slate-800 rounded-lg px-3 h-10 text-xs text-slate-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Max Capacity
                    </label>
                    <input
                      type="number"
                      defaultValue={500}
                      className="w-full bg-slate-900/90 border border-slate-800 rounded-lg px-3 h-10 text-xs text-slate-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Summary Breakdown Box */}
                <div className="bg-slate-900/80 border border-slate-800/80 rounded-lg p-3 flex flex-col justify-between space-y-1.5">
                  <span className="text-xs text-slate-400 font-medium block pb-1 border-b border-slate-800">
                    Stock Summary
                  </span>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Opening Balance:</span>
                      <span className="font-mono text-slate-200">0 pcs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Min Alert Level:</span>
                      <span className="font-mono text-amber-400">10 pcs</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CARD 4: Tax Rates & Accounting Setup */}
            <section className="bg-[#121520] border border-slate-800/80 rounded-xl px-5 py-4.5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 pb-2.5 border-b border-slate-800/60">
                <Receipt className="w-4 h-4 text-primary" />
                <h3 className="text-base font-semibold text-white">
                  Tax Rates & Accounting Setup
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Tax Category
                  </label>
                  <select className="w-full bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 h-10 text-xs text-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all">
                    <option>Standard Rate</option>
                    <option>Zero Rated</option>
                    <option>Exempt</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    VAT Rate (%)
                  </label>
                  <input
                    type="number"
                    defaultValue={5}
                    className="w-full bg-slate-900/90 border border-slate-800 rounded-lg px-3 h-10 text-xs text-slate-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Income Revenue Account
                  </label>
                  <select className="w-full bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 h-10 text-xs text-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all">
                    <option>Sales Revenue</option>
                    <option>Other Income</option>
                  </select>
                </div>
              </div>
            </section>

            {/* CARD 5: Description Section */}
            <section className="bg-[#121520] border border-slate-800/80 rounded-xl px-5 py-4.5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 pb-2.5 border-b border-slate-800/60">
                <Tag className="w-4 h-4 text-primary" />
                <h3 className="text-base font-semibold text-white">
                  Description
                </h3>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Enter full product details, specifications, packaging notes, tags, or internal metadata..."
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all resize-none"
                />
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN SIDEBAR CARDS - STICKY WRAPPER */}
          <div className="space-y-4 sm:space-y-5 lg:sticky lg:top-6">
            {/* Product Media Dropzone Card */}
            <section className="bg-[#121520] border border-slate-800/80 rounded-xl p-4.5 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800/60">
                <UploadCloud className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-white">
                  Product Media
                </h3>
              </div>

              <div className="border border-dashed border-slate-700/80 hover:border-primary/60 rounded-lg p-15 text-center transition-colors cursor-pointer bg-slate-900/40 group">
                <div className="w-18 h-18 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <p className="text-xs text-slate-300 font-medium mt-1.5">
                  Drag & drop image here, or{" "}
                  <span className="text-primary underline font-medium">
                    browse
                  </span>
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  PNG, JPG up to 10MB
                </p>
              </div>
            </section>

            {/* Creation Summary Card */}
            <section className="bg-[#121520] border border-slate-800/80 rounded-xl p-4.5 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800/60">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-white">
                  Creation Summary
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-800/50">
                  <span className="text-slate-400">Created By:</span>
                  <span className="font-medium text-slate-200">Admin_MGR</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800/50">
                  <span className="text-slate-400">Tax Class:</span>
                  <span className="font-medium text-slate-200">
                    Standard (5%)
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">System Status:</span>
                  <span className="inline-flex items-center gap-1.5 text-primary font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    Validating Entry
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* ================= FIXED BOTTOM ACTION BAR ================= */}
      <footer className="fixed bottom-0 right-0 left-0 h-20 bg-[#121520]/95 backdrop-blur border-t border-slate-800/80 flex items-center justify-between px-4 sm:px-6 z-30 shadow-lg">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
          <span className="hidden sm:inline">
            Ready to register item into inventory master data
          </span>
          <span className="sm:hidden">Ready to submit</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 rounded-lg transition-colors">
            Cancel
          </button>
          {/* <button className="px-3.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors">
            Save Draft
          </button> */}
          <button className="px-8 py-4 text-xs font-semibold text-primary-foreground bg-primary hover:opacity-90 rounded-lg transition-opacity shadow-sm shadow-primary/20">
            Save Product
          </button>
        </div>
      </footer>
    </div>
  );
}
