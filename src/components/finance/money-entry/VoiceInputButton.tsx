"use client";

import React, { useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceInputButtonProps {
  onTranscript?: (text: string) => void;
  isBangla?: boolean;
}

export function VoiceInputButton({ onTranscript, isBangla = false }: VoiceInputButtonProps) {
  const [isListening, setIsListening] = useState(false);

  const handleToggleListening = () => {
    if (!isListening) {
      setIsListening(true);
      // Simulate voice input after 1.5 seconds for demo
      setTimeout(() => {
        setIsListening(false);
        onTranscript?.(isBangla ? "দোকান ভাড়া পরিশোধ" : "Rent payment note");
      }, 1500);
    } else {
      setIsListening(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggleListening}
      title={isBangla ? "ভয়েস নোট দিন" : "Voice Input"}
      className={cn(
        "h-8 w-8 rounded-lg flex items-center justify-center transition-all shrink-0 cursor-pointer",
        isListening
          ? "bg-rose-500 text-white animate-pulse"
          : "text-muted-foreground hover:text-primary hover:bg-muted/60"
      )}
    >
      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </button>
  );
}
