import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  compact?: boolean;
}

export function Logo({ className, compact = false }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src="/brand/logo-mark.svg"
        alt=""
        aria-hidden="true"
        width={32}
        height={32}
        className="h-8 w-8 rounded-lg"
      />
      {!compact ? (
        <span className="text-[1.05rem] font-semibold tracking-tight text-zinc-100">
          Recipe<span className="text-emerald-300">Hub</span>
        </span>
      ) : null}
    </span>
  );
}
