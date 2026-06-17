'use client';

import { useEffect } from 'react';

export default function NotificationStream() {
  useEffect(() => {

    const eventSource = new EventSource('https://voiceerp.mapleitfirm.com/api/notifications/stream', {
      withCredentials: true,
    });

    eventSource.onopen = () => {

      console.log(
        "✅ SSE connected"
      );

    };

    eventSource.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      alert(`🔔 ${notification.title}\n${notification.message}`);
    };

    eventSource.onerror = (err) => {
      console.error('SSE Connection Error:', err);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return null; // Renders nothing on the screen
}