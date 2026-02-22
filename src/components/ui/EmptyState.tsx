import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: ReactNode;
  heading: string;
  message: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  heading,
  message,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "surface-subtle rounded-2xl p-8 md:p-10",
        "flex flex-col justify-center gap-3 text-left",
        className
      )}
    >
      {icon && (
        <div className="text-zinc-500">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold leading-tight text-zinc-100">
        {heading}
      </h3>
      <p className="max-w-xl text-sm leading-6 text-zinc-400">
        {message}
      </p>
      {action}
    </div>
  );
}
