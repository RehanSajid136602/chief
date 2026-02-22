import Link from "next/link";
import Image from "next/image";
import { Recipe } from "@/lib/types";
import { cn } from "@/lib/utils";
import { FavoriteButton } from "./FavoriteButton";

interface RecipeCardProps {
  recipe: Recipe;
  matchPercent?: number;
  showMatchBadge?: boolean;
  isFavorite?: boolean;
}

export function RecipeCard({
  recipe,
  matchPercent,
  showMatchBadge = false,
  isFavorite = false,
}: RecipeCardProps) {


  return (
    <Link href={`/recipes/${recipe.slug}`} className="block group">
      <article className="premium-card rounded-2xl h-full flex flex-col group-hover:border-white/10 group-hover:shadow-[0_16px_34px_rgba(0,0,0,0.28)]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
          <Image
            src={recipe.images[0]}
            alt={recipe.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-70" />
          
          <div className="absolute top-4 left-4 z-10">
            <FavoriteButton
              recipeSlug={recipe.slug}
              initialIsFavorite={isFavorite}
            />
          </div>

          
          {showMatchBadge && matchPercent !== undefined && (
            <div className="absolute top-4 right-4">
              <span
                className={cn(
                  "inline-flex items-center px-2.5 py-1 rounded-full text-[0.7rem] font-semibold backdrop-blur-md border border-white/10",
                  matchPercent >= 70
                    ? "bg-emerald-400/90 text-black"
                    : matchPercent >= 40
                    ? "bg-amber-400/90 text-black"
                    : "bg-zinc-900/80 text-white"
                )}
              >
                {matchPercent}% Match
              </span>
            </div>
          )}

          <div className="absolute bottom-4 left-4 flex gap-1.5 overflow-hidden">
            {recipe.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[10px] uppercase tracking-[0.08em] font-semibold px-2 py-1 bg-black/35 backdrop-blur-md border border-white/10 rounded-md text-zinc-100">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg leading-tight font-semibold text-zinc-100 mb-2 group-hover:text-white transition-colors">
            {recipe.title}
          </h3>
          <p className="text-sm text-zinc-400 mb-5 line-clamp-2 leading-6">
            {recipe.description}
          </p>
          
          <div className="mt-auto pt-4 border-t border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-[0.08em] text-zinc-500">
              <span className="flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {recipe.totalTime}m
              </span>
              <span className="flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2v20M2 12h20" />
                </svg>
                {recipe.caloriesPerServing} Cal
              </span>
            </div>
            
            <div className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-zinc-300 group-hover:text-white group-hover:border-white/15 transition-all">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
