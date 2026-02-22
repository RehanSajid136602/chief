"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleFavorite } from "@/app/actions/user";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface FavoriteButtonProps {
  recipeSlug: string;
  initialIsFavorite: boolean;
  className?: string;
}

export function FavoriteButton({
  recipeSlug,
  initialIsFavorite,
  className,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic UI update
    const previousState = isFavorite;
    setIsFavorite(!previousState);

    startTransition(async () => {
      try {
        const result = await toggleFavorite(recipeSlug);
        setIsFavorite(result.isFavorite);
      } catch {
        // Rollback on error
        setIsFavorite(previousState);
        router.push("/auth/login");
      }

    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "group/fav relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
        isFavorite
          ? "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
          : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white",
        isPending && "opacity-50 cursor-not-allowed",
        className
      )}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={cn(
          "w-5 h-5 transition-all duration-300",
          isFavorite ? "fill-rose-500 scale-110" : "group-hover/fav:scale-110"
        )}
      />
      {isPending && (
        <div className="absolute inset-0 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      )}
    </button>
  );
}
