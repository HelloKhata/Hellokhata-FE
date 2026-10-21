"use client";
import { useEffect } from "react";
import { toast } from "sonner";
import { erpApiEndpoint } from "@/lib/api-url";

const NotificatoinProvider = ({ children }: { children: React.ReactNode }) => {

  useEffect(() => {
    const eventSource = new EventSource(
      erpApiEndpoint("api/notifications/stream"),
      {
        withCredentials: true,
      },
    );

    eventSource.onmessage = (event) => {
      try {
        const notification = JSON.parse(event.data); 
        toast(`🔔 ${notification.title}\n${notification.message}`);
      } catch (error) {
        console.error("Parse error:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("❌ SSE error:", error);
    };

    return () => {
      eventSource.close();
    };
  }, []);
  return <div>{children}</div>;
};

export default NotificatoinProvider;
