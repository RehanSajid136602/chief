import { MatchResult } from "@/lib/types";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { EmptyState } from "@/components/ui/EmptyState";

interface MatchResultsProps {
  results: MatchResult[];
}

export function MatchResults({ results }: MatchResultsProps) {
  if (results.length === 0) {
    return (
      <EmptyState
        heading="No matches found"
        message="Try adding different ingredients to find recipes you can make."
      />
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-zinc-100">
        Matching Recipes ({results.length})
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((result) => (
          <div key={result.recipe.id} className="relative">
            <RecipeCard
              recipe={result.recipe}
              matchPercent={result.matchPercent}
              showMatchBadge
            />
            {result.missingIngredients.length > 0 && (
              <div className="mt-2 text-xs text-zinc-500">
                <span className="font-medium text-zinc-400">Missing:</span>{" "}
                {result.missingIngredients.join(", ")}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
