import { ReactNode } from "react";

interface TagProps {
  children: ReactNode;
  variant?: "default" | "emerald" | "amber";
  className?: string;
}

export function Tag({
  children,
  variant = "default",
  className = "",
}: TagProps) {
  const variants = {
    default: "bg-zinc-800 text-zinc-300",
    emerald: "bg-emerald-400/20 text-emerald-400 border border-emerald-400/30",
    amber: "bg-amber-400/20 text-amber-400 border border-amber-400/30",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
