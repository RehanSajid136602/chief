import { ReactNode } from "react";

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
      className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}
    >
      {icon && (
        <div className="mb-4 text-zinc-600">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-zinc-200 mb-2">
        {heading}
      </h3>
      <p className="text-sm text-zinc-500 max-w-md mb-6">
        {message}
      </p>
      {action}
    </div>
  );
}
