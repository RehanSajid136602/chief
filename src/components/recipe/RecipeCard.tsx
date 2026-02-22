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
      <article className="premium-card rounded-3xl h-full flex flex-col group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-500">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-[1.4rem]">
          <Image
            src={recipe.images[0]}
            alt={recipe.title}
            fill
            className="object-cover group-hover:rotate-1 transition-transform duration-700 ease-out"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
          
          <div className="absolute top-4 left-4 z-10">
            <FavoriteButton
              recipeSlug={recipe.slug}
              initialIsFavorite={isFavorite}
            />
          </div>

          
          {showMatchBadge && matchPercent !== undefined && (
            <div className="absolute top-4 right-4 animate-float">
              <span
                className={cn(
                  "inline-flex items-center px-3 py-1.5 rounded-2xl text-xs font-bold backdrop-blur-md shadow-xl border border-white/10",
                  matchPercent >= 70
                    ? "bg-emerald-500/90 text-black"
                    : matchPercent >= 40
                    ? "bg-amber-500/90 text-black"
                    : "bg-zinc-800/90 text-white"
                )}
              >
                {matchPercent}% Match
              </span>
            </div>
          )}

          <div className="absolute bottom-4 left-4 flex gap-2 overflow-hidden">
            {recipe.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg text-white">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors duration-300">
            {recipe.title}
          </h3>
          <p className="text-sm text-zinc-500 mb-6 line-clamp-2 leading-relaxed">
            {recipe.description}
          </p>
          
          <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-zinc-600 group-hover:text-zinc-400 transition-colors">
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
            
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
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

