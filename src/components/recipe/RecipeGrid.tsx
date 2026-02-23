import { ReactNode, Suspense } from "react";
import { RecipeCard } from "./RecipeCard";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { Recipe } from "@/lib/types";

interface RecipeGridProps {
  recipes: Recipe[];
  showMatchBadge?: boolean;
  matchPercents?: number[];
  favorites?: string[];
  pantryMatchCounts?: number[];
  animateEntrance?: boolean;
  revealLimit?: number;
}

export function RecipeGrid({
  recipes,
  showMatchBadge = false,
  matchPercents,
  favorites = [],
  pantryMatchCounts,
  animateEntrance = false,
  revealLimit = 9,
}: RecipeGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe, index) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          matchPercent={matchPercents?.[index]}
          showMatchBadge={showMatchBadge}
          isFavorite={favorites.includes(recipe.slug)}
          pantryMatchCount={pantryMatchCounts?.[index]}
          enableReveal={animateEntrance && index < revealLimit}
          revealIndex={index}
        />
      ))}
    </div>
  );
}


export function RecipeGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function RecipeGridWithSuspense({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
