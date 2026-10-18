"use client";

import { useEffect, useRef } from "react";
import { ArrowUp, AudioLines, Loader2, Mic, Square } from "lucide-react";
import { Button } from "../ui/button";

export function ChatComposer({
  text,
  onChange,
  onSend,
  onRecord,
  onStop,
  disabled,
  audioState,
  recordingSeconds,
  transcript,
}: {
  text: string;
  onChange: (text: string) => void;
  onSend: () => void;
  onRecord: () => void;
  onStop: () => void;
  disabled: boolean;
  audioState: "IDLE" | "STARTING" | "RECORDING" | "TRANSCRIBING";
  recordingSeconds: number;
  transcript: boolean;
}) {
  const input = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (input.current) {
      input.current.style.height = "auto";
      input.current.style.height =
        Math.min(input.current.scrollHeight, 96) + "px";
    }
  }, [text]);
  const recording = audioState === "RECORDING";
  const pending = audioState === "STARTING" || audioState === "TRANSCRIBING";
  return (
    <div className="shrink-0 border-t border-border bg-card px-3 py-2 sm:px-6">
      <div className="mx-auto max-w-4xl">
        {audioState !== "IDLE" && (
          <p
            role="status"
            className="mb-1.5 flex items-center gap-2 text-xs text-muted-foreground"
          >
            {recording ? (
              <AudioLines className="h-4 w-4 text-primary" />
            ) : (
              <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none text-primary" />
            )}
            {recording
              ? `Recording · ${String(Math.floor(recordingSeconds / 60)).padStart(2, "0")}:${String(recordingSeconds % 60).padStart(2, "0")}`
              : audioState === "STARTING"
                ? "Connecting to your microphone…"
                : "Transcribing your voice…"}
          </p>
        )}
        {transcript && audioState === "IDLE" && (
          <p className="mb-1.5 text-xs font-medium text-primary">
            Transcript ready — review or edit, then send.
          </p>
        )}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (
              !disabled &&
              audioState === "IDLE" &&
              text.trim() &&
              text.length <= 4000
            )
              onSend();
          }}
          className="flex items-end gap-1 rounded-xl border border-border bg-background p-1.5 shadow-sm transition-colors focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10"
        >
          <textarea
            ref={input}
            value={text}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault();
                if (
                  !disabled &&
                  audioState === "IDLE" &&
                  text.trim() &&
                  text.length <= 4000
                )
                  onSend();
              }
            }}
            disabled={disabled || audioState !== "IDLE"}
            maxLength={4000}
            rows={1}
            aria-label="Message or voice transcript"
            placeholder="Type a message…"
            className="block max-h-[96px] min-h-[36px] min-w-0 flex-1 resize-none overflow-y-auto bg-transparent px-2 py-1.5 text-sm leading-6 text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-60"
          />
          <div className="flex shrink-0 items-center gap-1">
            <div className="flex items-center">
              {recording ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={onStop}
                  aria-label="Stop recording and transcribe"
                  title="Stop recording and transcribe"
                  className="h-9 w-9 p-0"
                >
                  <Square className="h-3 w-3 fill-current" />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={disabled || pending}
                  onClick={onRecord}
                  aria-label="Record voice"
                  title="Record voice"
                  className="h-9 w-9 p-0"
                >
                  <Mic className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button
              type="submit"
              disabled={
                disabled ||
                audioState !== "IDLE" ||
                !text.trim() ||
                text.length > 4000
              }
              className="h-9 w-9 rounded-lg p-0"
              aria-label="Send message"
              title="Send message"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </form>
        <p className="mt-1 hidden text-center text-[10px] leading-4 text-muted-foreground sm:block">
          {text.length > 3600
            ? `${text.length}/4,000`
            : "Enter to send · Shift + Enter for a new line · Review before confirming"}
        </p>
      </div>
    </div>
  );
}
