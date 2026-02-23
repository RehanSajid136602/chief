import type { CSSProperties } from "react";
import { MatchResult } from "@/lib/types";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/ui/Reveal";

interface MatchResultsProps {
  results: MatchResult[];
  favorites?: string[];
}

export function MatchResults({ results, favorites = [] }: MatchResultsProps) {
  if (results.length === 0) {
    return (
      <EmptyState
        heading="No matches found"
        message="Try adding different ingredients to find recipes you can make."
      />
    );
  }

  return (
    <div className="space-y-5">
      <Reveal y={10}>
        <div className="surface-subtle rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.12em] font-semibold text-zinc-500 mb-1">
            Results
          </p>
          <h2 className="text-lg font-semibold text-zinc-100">
            {results.length} matching recipe{results.length === 1 ? "" : "s"}
          </h2>
        </div>
      </Reveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((result, index) => (
          <div
            key={result.recipe.id}
            className="relative"
          >
            <RecipeCard
              recipe={result.recipe}
              matchPercent={result.matchPercent}
              showMatchBadge
              isFavorite={favorites.includes(result.recipe.slug)}
              enableReveal={index < 9}
              revealIndex={index}
            />
            {result.missingIngredients.length > 0 && (
              <div
                className="mt-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-xs leading-5 text-zinc-400 reveal-on-mount"
                style={
                  { ["--reveal-delay" as string]: `${Math.min(index, 8) * 40 + 80}ms` } as CSSProperties
                }
              >
                <span className="font-medium text-zinc-200">Missing:</span>{" "}
                {result.missingIngredients.join(", ")}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
