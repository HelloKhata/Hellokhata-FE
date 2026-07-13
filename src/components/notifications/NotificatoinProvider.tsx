'use client'
import { useEffect } from "react";
import { toast } from "sonner";
import { API_BASE_URL } from '@/lib/axios';

const NotificatoinProvider = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        const eventSource = new EventSource(
            `${API_BASE_URL}/api/notifications/stream`,
            {
                withCredentials: true,
            }
        );

        eventSource.onmessage = (event) => {
            try {
                const notification = JSON.parse(
                    event.data
                );
                console.log(notification)
                toast(`🔔 ${notification.title}\n${notification.message}`)

            } catch (error) {
                console.error(
                    "Parse error:",
                    error
                );

            }

        };

        eventSource.onerror = (error) => {
            console.error(
                "❌ SSE error:",
                error
            )
            console.log(
                "State:",
                eventSource.readyState
            );

        };

        return () => {
            eventSource.close();
        };

    }, []);
    return (
        <div>
            {children}
        </div>
    )
}

export default NotificatoinProvider