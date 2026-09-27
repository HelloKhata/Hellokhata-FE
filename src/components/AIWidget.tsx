// components/AIChatWidget.tsx
"use client";

import Script from "next/script";

export default function AIChatWidget() {
  return (
    <Script
      src="https://ai-data-assistant-for-ap-is-erp-sys.vercel.app/embed.js"
      data-key="pub_GK3i7uCi0qt5pLayAJQwzp9u"
      data-title="Ask AI"
      data-subtitle="Online 24/7"
      data-color="#0d9488"
      data-position="right"
      data-theme="light"
      data-greeting="Hi! How can I help you today?"
      data-avatar="🤖"
      data-height="500px"
      strategy="afterInteractive"
    />
  );
}