"use client";

import { useEffect, useRef, useState } from "react";

type VoiceStatus = "idle" | "listening" | "processing" | "unsupported" | "error";

type RecognitionInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: null | (() => void);
  onend: null | (() => void);
  onerror: null | ((event: { error?: string }) => void);
  onresult: null | ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void);
  start: () => void;
  stop: () => void;
  abort?: () => void;
};

type RecognitionConstructor = new () => RecognitionInstance;

declare global {
  interface Window {
    webkitSpeechRecognition?: RecognitionConstructor;
    SpeechRecognition?: RecognitionConstructor;
  }
}

export function useSpeechRecognition({
  onTranscript,
}: {
  onTranscript?: (text: string) => void;
} = {}) {
  const recognitionRef = useRef<RecognitionInstance | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) {
      setIsSupported(false);
      setStatus("unsupported");
      return;
    }

    setIsSupported(true);
    const recognition = new Ctor();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setError(null);
      setStatus("listening");
    };

    recognition.onresult = (event) => {
      const text = Array.from(event.results)
        .map((r) => r?.[0]?.transcript ?? "")
        .join(" ")
        .trim();
      if (text) {
        setTranscript(text);
        onTranscript?.(text);
      }
      setStatus("processing");
    };

    recognition.onerror = (event) => {
      const nextError = event?.error || "Voice recognition failed";
      setError(nextError);
      setStatus("error");
    };

    recognition.onend = () => {
      setStatus((prev) => (prev === "error" ? "error" : "idle"));
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
        recognition.abort?.();
      } catch {
        // no-op
      }
      recognitionRef.current = null;
    };
  }, [onTranscript]);

  const startListening = () => {
    if (!recognitionRef.current) {
      setStatus("unsupported");
      return;
    }
    try {
      setError(null);
      setStatus("processing");
      recognitionRef.current.start();
    } catch {
      setError("Microphone could not start. Check permissions and try again.");
      setStatus("error");
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
      setStatus("processing");
    } catch {
      setStatus("idle");
    }
  };

  const clearTranscript = () => {
    setTranscript("");
    setError(null);
    setStatus(isSupported ? "idle" : "unsupported");
  };

  return {
    isSupported,
    isListening: status === "listening",
    isProcessing: status === "processing",
    status,
    transcript,
    error,
    startListening,
    stopListening,
    clearTranscript,
  };
}
