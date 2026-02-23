"use client";

import { Mic, Square, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceSearchButtonProps {
  isSupported: boolean;
  isListening: boolean;
  isProcessing: boolean;
  onStart: () => void;
  onStop: () => void;
}

export function VoiceSearchButton({
  isSupported,
  isListening,
  isProcessing,
  onStart,
  onStop,
}: VoiceSearchButtonProps) {
  if (!isSupported) {
    return (
      <Button
        type="button"
        variant="outline"
        className="h-11 px-4"
        disabled
        aria-label="Voice search not supported in this browser"
      >
        <Mic className="w-4 h-4" />
        Voice Unsupported
      </Button>
    );
  }

  if (isListening) {
    return (
      <Button
        type="button"
        variant="outline"
        className="h-11 px-4 border-rose-300/30 text-rose-200"
        onClick={onStop}
        aria-label="Stop voice dictation"
      >
        <Square className="w-4 h-4 fill-current" />
        Stop
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="h-11 px-4"
      onClick={onStart}
      aria-label="Start voice dictation search"
      disabled={isProcessing}
    >
      {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
      {isProcessing ? "Processing..." : "Voice Search"}
    </Button>
  );
}
